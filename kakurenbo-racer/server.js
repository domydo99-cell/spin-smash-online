const path = require("path");
const http = require("http");
const crypto = require("crypto");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

const rooms = new Map();

const ANIMALS = [
  { id: "cat", label: "ネコ" },
  { id: "dog", label: "イヌ" },
  { id: "fox", label: "キツネ" },
  { id: "bear", label: "クマ" },
  { id: "rabbit", label: "ウサギ" },
  { id: "tanuki", label: "タヌキ" },
  { id: "deer", label: "シカ" },
  { id: "monkey", label: "サル" },
  { id: "turtle", label: "カメ" },
  { id: "owl", label: "フクロウ" },
  { id: "penguin", label: "ペンギン" },
  { id: "panda", label: "パンダ" },
];

const DEFAULT_SETTINGS = {
  expectedPlayers: 6,
  trackLength: 10,
  checkpointAt: 5,
  sniperShotsLimit: 3,
  cardMax: 3,
  racesPerParent: 1,
  revealDelayMs: 700,
};

function makeId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return crypto.randomBytes(16).toString("hex");
}

function makeRoomId() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 4; i += 1) {
    id += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return id;
}

function clampInt(value, min, max) {
  const num = Number.parseInt(value, 10);
  if (Number.isNaN(num)) return min;
  return Math.min(max, Math.max(min, num));
}

function sanitizeSettings(input, base) {
  const next = { ...base };
  if (input.expectedPlayers != null) {
    next.expectedPlayers = clampInt(input.expectedPlayers, 2, 12);
  }
  if (input.cardMax != null) {
    next.cardMax = clampInt(input.cardMax, 0, 9);
  }
  if (input.trackLength != null) {
    next.trackLength = clampInt(input.trackLength, 6, 20);
  }
  if (input.checkpointAt != null) {
    next.checkpointAt = clampInt(input.checkpointAt, 2, next.trackLength - 1);
  } else if (next.checkpointAt >= next.trackLength) {
    next.checkpointAt = Math.max(2, next.trackLength - 1);
  }
  if (input.sniperShotsLimit != null) {
    next.sniperShotsLimit = clampInt(input.sniperShotsLimit, 0, 10);
  }
  if (input.racesPerParent != null) {
    next.racesPerParent = clampInt(input.racesPerParent, 1, 5);
  }
  if (input.revealDelayMs != null) {
    next.revealDelayMs = clampInt(input.revealDelayMs, 200, 1500);
  }
  return next;
}

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createRoom(hostPlayer) {
  let roomId = makeRoomId();
  while (rooms.has(roomId)) roomId = makeRoomId();
  const room = {
    id: roomId,
    hostId: hostPlayer.id,
    players: new Map([[hostPlayer.id, hostPlayer]]),
    order: [hostPlayer.id],
    phase: "lobby",
    settings: { ...DEFAULT_SETTINGS },
    parentId: null,
    parentRoundsTaken: new Map(),
    raceIndex: 0,
    lanes: [],
    lanesOrder: [],
    selections: new Map(),
    checkpointWinnerId: null,
    placements: [],
    sniperShotsLeft: 0,
    lastReveal: null,
    lastRaceAwards: [],
    revealTimer: null,
    revealQueue: [],
    revealIndex: 0,
  };
  rooms.set(roomId, room);
  return room;
}

function buildLaneLabel(used, animal) {
  if (!used.has(animal.id)) {
    used.set(animal.id, 1);
    return animal.label;
  }
  const count = used.get(animal.id) + 1;
  used.set(animal.id, count);
  return `${animal.label}${count}`;
}

function setupRace(room) {
  room.selections = new Map();
  room.checkpointWinnerId = null;
  room.placements = [];
  room.lastReveal = null;
  room.lastRaceAwards = [];
  room.sniperShotsLeft = room.settings.sniperShotsLimit;
  room.revealQueue = [];
  room.revealIndex = 0;
  if (room.revealTimer) {
    clearTimeout(room.revealTimer);
    room.revealTimer = null;
  }

  const parentId = room.parentId;
  const childPlayers = room.order.filter((id) => id !== parentId);
  const aiCount = Math.ceil(childPlayers.length / 2);
  const animals = shuffle(ANIMALS);
  const usedLabels = new Map();
  const lanes = [];

  childPlayers.forEach((playerId, index) => {
    const player = room.players.get(playerId);
    const animal = animals[index % animals.length];
    lanes.push({
      id: `lane-${makeId()}`,
      ownerId: playerId,
      ownerName: player?.name || "プレイヤー",
      isAI: false,
      animalId: animal.id,
      label: buildLaneLabel(usedLabels, animal),
      distance: 0,
      sniped: false,
      finished: false,
      finishRank: null,
      checkpointPassed: false,
    });
  });

  for (let i = 0; i < aiCount; i += 1) {
    const animal = animals[(childPlayers.length + i) % animals.length];
    lanes.push({
      id: `lane-${makeId()}`,
      ownerId: null,
      ownerName: `AI-${i + 1}`,
      isAI: true,
      animalId: animal.id,
      label: buildLaneLabel(usedLabels, animal),
      distance: 0,
      sniped: false,
      finished: false,
      finishRank: null,
      checkpointPassed: false,
    });
  }

  room.lanes = lanes;
  room.lanesOrder = shuffle(lanes.map((lane) => lane.id));
  room.phase = "arrange";
}

function laneById(room, laneId) {
  return room.lanes.find((lane) => lane.id === laneId);
}

function emitState(room) {
  room.players.forEach((player) => {
    if (!player.socketId) return;
    const state = buildClientState(room, player.id);
    io.to(player.socketId).emit("state", state);
  });
}

function buildClientState(room, playerId) {
  const players = room.order.map((id) => {
    const p = room.players.get(id);
    return {
      id: p.id,
      name: p.name,
      connected: p.connected,
      score: p.score,
      isHost: id === room.hostId,
      isParent: id === room.parentId,
    };
  });

  const laneMap = new Map(room.lanes.map((lane) => [lane.id, lane]));
  const lanes = room.lanesOrder
    .map((id) => laneMap.get(id))
    .filter(Boolean)
    .map((lane) => ({
      id: lane.id,
      ownerId: lane.ownerId,
      ownerName: lane.ownerName,
      isAI: lane.isAI,
      animalId: lane.animalId,
      label: lane.label,
      distance: lane.distance,
      sniped: lane.sniped,
      finished: lane.finished,
      finishRank: lane.finishRank,
      checkpointPassed: lane.checkpointPassed,
    }));

  const myLane = room.lanes.find((lane) => lane.ownerId === playerId) || null;
  const mySelection = myLane ? room.selections.get(myLane.id) : null;
  const selectedCount = room.lanes.filter((lane) => lane.ownerId).filter((lane) => room.selections.has(lane.id)).length;
  const totalSelectable = room.lanes.filter((lane) => lane.ownerId).length;

  return {
    roomId: room.id,
    phase: room.phase,
    settings: room.settings,
    hostId: room.hostId,
    parentId: room.parentId,
    players,
    lanes,
    placements: room.placements,
    checkpointWinnerId: room.checkpointWinnerId,
    sniperShotsLeft: room.sniperShotsLeft,
    lastReveal: room.lastReveal,
    raceIndex: room.raceIndex,
    selectedCount,
    totalSelectable,
    myLaneId: myLane ? myLane.id : null,
    mySelection,
    lastRaceAwards: room.lastRaceAwards,
    you: { playerId },
  };
}

function startSelectionPhase(room) {
  room.phase = "select";
  room.selections = new Map();
  room.lastReveal = null;

  room.lanes.forEach((lane) => {
    if (lane.isAI) {
      const value = Math.floor(Math.random() * (room.settings.cardMax + 1));
      room.selections.set(lane.id, value);
    }
  });
}

function allHumansSelected(room) {
  const humanLanes = room.lanes.filter((lane) => lane.ownerId);
  return humanLanes.every((lane) => room.selections.has(lane.id));
}

function revealNext(room) {
  if (room.revealIndex >= room.revealQueue.length) {
    room.revealTimer = null;
    handleRoundEnd(room);
    return;
  }

  const laneId = room.revealQueue[room.revealIndex];
  const lane = laneById(room, laneId);
  const value = room.selections.get(laneId) ?? 0;

  if (lane && !lane.sniped && !lane.finished) {
    lane.distance += value;
    if (!lane.checkpointPassed && lane.distance >= room.settings.checkpointAt) {
      lane.checkpointPassed = true;
      if (!room.checkpointWinnerId) {
        room.checkpointWinnerId = lane.id;
      }
    }

    if (lane.distance >= room.settings.trackLength && !lane.finished) {
      lane.finished = true;
      if (lane.finishRank == null) {
        lane.finishRank = room.placements.length + 1;
        room.placements.push(lane.id);
      }
    }
  }

  room.lastReveal = { laneId, value };
  room.revealIndex += 1;

  emitState(room);

  room.revealTimer = setTimeout(() => revealNext(room), room.settings.revealDelayMs);
}

function aliveLanes(room) {
  return room.lanes.filter((lane) => !lane.sniped && !lane.finished);
}

function handleRoundEnd(room) {
  const maxPlacements = Math.min(3, room.lanes.length);
  if (room.placements.length >= maxPlacements) {
    finalizeRace(room);
    emitState(room);
    return;
  }
  if (aliveLanes(room).length === 0) {
    finalizeRace(room);
    emitState(room);
    return;
  }
  if (room.sniperShotsLeft > 0 && aliveLanes(room).length > 1) {
    room.phase = "sniper";
    emitState(room);
    return;
  }
  startSelectionPhase(room);
  emitState(room);
  maybeStartReveal(room);
}

function finalizePlacements(room) {
  if (room.placements.length >= 3) return;
  const candidates = room.lanes
    .filter((lane) => !lane.sniped && !room.placements.includes(lane.id))
    .sort((a, b) => {
      if (b.distance !== a.distance) return b.distance - a.distance;
      return room.lanesOrder.indexOf(a.id) - room.lanesOrder.indexOf(b.id);
    });

  for (const lane of candidates) {
    if (room.placements.length >= 3) break;
    lane.finishRank = room.placements.length + 1;
    room.placements.push(lane.id);
  }
}

function finalizeRace(room) {
  room.phase = "score";
  if (room.revealTimer) {
    clearTimeout(room.revealTimer);
    room.revealTimer = null;
  }
  finalizePlacements(room);

  const awards = [];
  const rankStars = [3, 2, 1];
  room.placements.slice(0, 3).forEach((laneId, index) => {
    const lane = laneById(room, laneId);
    if (!lane) return;
    const receiverId = lane.isAI ? room.parentId : lane.ownerId;
    const stars = rankStars[index];
    const player = room.players.get(receiverId);
    if (player) {
      player.score += stars;
      awards.push({
        playerId: receiverId,
        stars,
        reason: `${index + 1}位`,
        laneId,
      });
    }
  });

  if (room.checkpointWinnerId && room.placements.includes(room.checkpointWinnerId)) {
    const lane = laneById(room, room.checkpointWinnerId);
    if (lane) {
      const receiverId = lane.isAI ? room.parentId : lane.ownerId;
      const player = room.players.get(receiverId);
      if (player) {
        player.score += 1;
        awards.push({
          playerId: receiverId,
          stars: 1,
          reason: "チェックポイント",
          laneId: lane.id,
        });
      }
    }
  }

  room.lastRaceAwards = awards;
}

function advanceParent(room) {
  const current = room.parentId;
  if (current) {
    const taken = room.parentRoundsTaken.get(current) || 0;
    room.parentRoundsTaken.set(current, taken + 1);
  }
  const next = room.order.find((id) => (room.parentRoundsTaken.get(id) || 0) < room.settings.racesPerParent);
  room.parentId = next || null;
}

function startGame(room) {
  room.raceIndex = 0;
  room.parentRoundsTaken = new Map();
  room.order.forEach((id) => room.parentRoundsTaken.set(id, 0));
  room.parentId = room.order[0] || null;
  setupRace(room);
}

function startNextRace(room) {
  advanceParent(room);
  if (!room.parentId) {
    room.phase = "gameover";
    return;
  }
  room.raceIndex += 1;
  setupRace(room);
}

function maybeStartReveal(room) {
  if (!allHumansSelected(room)) return;
  room.phase = "reveal";
  room.revealQueue = shuffle(room.lanesOrder);
  room.revealIndex = 0;
  emitState(room);
  revealNext(room);
}

function ensureRoom(socket, roomId) {
  const room = rooms.get(roomId);
  if (!room) {
    socket.emit("errorMessage", "部屋が見つかりません");
    return null;
  }
  return room;
}

io.on("connection", (socket) => {
  socket.on("createRoom", (payload, ack) => {
    const name = (payload?.name || "プレイヤー").trim().slice(0, 12) || "プレイヤー";
    const player = {
      id: payload?.playerKey && payload.playerKey.length > 10 ? payload.playerKey : makeId(),
      name,
      socketId: socket.id,
      connected: true,
      score: 0,
    };
    const room = createRoom(player);
    socket.join(room.id);
    socket.data.roomId = room.id;
    socket.data.playerId = player.id;
    if (ack) ack({ ok: true, roomId: room.id, playerKey: player.id });
    emitState(room);
  });

  socket.on("joinRoom", (payload, ack) => {
    const roomId = (payload?.roomId || "").toUpperCase();
    const room = rooms.get(roomId);
    if (!room) {
      if (ack) ack({ ok: false, message: "部屋が見つかりません" });
      return;
    }
    const name = (payload?.name || "プレイヤー").trim().slice(0, 12) || "プレイヤー";
    const key = payload?.playerKey;

    if (key && room.players.has(key)) {
      const player = room.players.get(key);
      player.name = name || player.name;
      player.socketId = socket.id;
      player.connected = true;
      socket.join(room.id);
      socket.data.roomId = room.id;
      socket.data.playerId = player.id;
      if (ack) ack({ ok: true, roomId: room.id, playerKey: player.id, rejoined: true });
      emitState(room);
      return;
    }

    if (room.phase !== "lobby") {
      if (ack) ack({ ok: false, message: "ゲーム進行中のため参加できません" });
      return;
    }

    const player = {
      id: makeId(),
      name,
      socketId: socket.id,
      connected: true,
      score: 0,
    };
    room.players.set(player.id, player);
    room.order.push(player.id);
    socket.join(room.id);
    socket.data.roomId = room.id;
    socket.data.playerId = player.id;

    if (ack) ack({ ok: true, roomId: room.id, playerKey: player.id });
    emitState(room);
  });

  socket.on("setSettings", (payload) => {
    const room = ensureRoom(socket, payload?.roomId);
    if (!room) return;
    if (room.hostId !== socket.data.playerId) return;
    if (room.phase !== "lobby") return;
    room.settings = sanitizeSettings(payload?.settings || {}, room.settings);
    emitState(room);
  });

  socket.on("startGame", (payload) => {
    const room = ensureRoom(socket, payload?.roomId);
    if (!room) return;
    if (room.hostId !== socket.data.playerId) return;
    if (room.phase !== "lobby") return;
    if (room.order.length < 2) {
      socket.emit("errorMessage", "2人以上で開始してください");
      return;
    }
    startGame(room);
    emitState(room);
  });

  socket.on("laneMove", (payload) => {
    const room = ensureRoom(socket, payload?.roomId);
    if (!room) return;
    if (room.phase !== "arrange") return;
    if (room.parentId !== socket.data.playerId) return;
    const from = payload?.from;
    const to = payload?.to;
    if (typeof from !== "number" || typeof to !== "number") return;
    if (from < 0 || to < 0 || from >= room.lanesOrder.length || to >= room.lanesOrder.length) return;
    const updated = [...room.lanesOrder];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    room.lanesOrder = updated;
    emitState(room);
  });

  socket.on("arrangeDone", (payload) => {
    const room = ensureRoom(socket, payload?.roomId);
    if (!room) return;
    if (room.phase !== "arrange") return;
    if (room.parentId !== socket.data.playerId) return;
    startSelectionPhase(room);
    emitState(room);
    maybeStartReveal(room);
  });

  socket.on("selectCard", (payload) => {
    const room = ensureRoom(socket, payload?.roomId);
    if (!room) return;
    if (room.phase !== "select") return;
    const playerId = socket.data.playerId;
    if (!playerId || room.parentId === playerId) return;
    const lane = room.lanes.find((l) => l.ownerId === playerId);
    if (!lane) return;
    const value = clampInt(payload?.value, 0, room.settings.cardMax);
    room.selections.set(lane.id, value);
    emitState(room);
    maybeStartReveal(room);
  });

  socket.on("sniperShot", (payload) => {
    const room = ensureRoom(socket, payload?.roomId);
    if (!room) return;
    if (room.phase !== "sniper") return;
    if (room.parentId !== socket.data.playerId) return;
    if (room.sniperShotsLeft <= 0) return;
    const lane = laneById(room, payload?.laneId);
    if (!lane || lane.sniped || lane.finished) return;
    lane.sniped = true;
    room.sniperShotsLeft -= 1;

    const maxPlacements = Math.min(3, room.lanes.length);
    if (room.placements.length >= maxPlacements || aliveLanes(room).length === 0) {
      finalizeRace(room);
      emitState(room);
      return;
    }

    if (room.sniperShotsLeft <= 0) {
      startSelectionPhase(room);
      emitState(room);
      maybeStartReveal(room);
      return;
    }

    emitState(room);
  });

  socket.on("sniperSkip", (payload) => {
    const room = ensureRoom(socket, payload?.roomId);
    if (!room) return;
    if (room.phase !== "sniper") return;
    if (room.parentId !== socket.data.playerId) return;
    const maxPlacements = Math.min(3, room.lanes.length);
    if (room.placements.length >= maxPlacements || aliveLanes(room).length === 0) {
      finalizeRace(room);
      emitState(room);
      return;
    }
    startSelectionPhase(room);
    emitState(room);
    maybeStartReveal(room);
  });

  socket.on("nextRace", (payload) => {
    const room = ensureRoom(socket, payload?.roomId);
    if (!room) return;
    if (room.phase !== "score") return;
    if (room.hostId !== socket.data.playerId) return;
    startNextRace(room);
    emitState(room);
  });

  socket.on("resetLobby", (payload) => {
    const room = ensureRoom(socket, payload?.roomId);
    if (!room) return;
    if (room.hostId !== socket.data.playerId) return;
    room.phase = "lobby";
    room.parentId = null;
    room.raceIndex = 0;
    room.lanes = [];
    room.lanesOrder = [];
    room.selections = new Map();
    room.placements = [];
    room.sniperShotsLeft = 0;
    room.lastRaceAwards = [];
    emitState(room);
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    const playerId = socket.data.playerId;
    if (!roomId || !playerId) return;
    const room = rooms.get(roomId);
    if (!room) return;
    const player = room.players.get(playerId);
    if (!player) return;
    player.connected = false;
    player.socketId = null;
    emitState(room);
  });
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Kakurenbo Racer listening on ${PORT}`);
});

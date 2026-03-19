const socket = io();

const STORAGE_KEY = {
  name: "kakurenbo_name",
  room: "kakurenbo_room",
  playerKey: "kakurenbo_playerKey",
};

const el = (id) => document.getElementById(id);

const screens = {
  join: el("screen-join"),
  lobby: el("screen-lobby"),
  arrange: el("screen-arrange"),
  select: el("screen-select"),
  reveal: el("screen-reveal"),
  sniper: el("screen-sniper"),
  score: el("screen-score"),
  gameover: el("screen-gameover"),
};

const ui = {
  roomPill: el("room-pill"),
  inputName: el("input-name"),
  inputRoom: el("input-room"),
  btnCreate: el("btn-create"),
  btnJoin: el("btn-join"),
  playerList: el("player-list"),
  arrangeNote: el("arrange-note"),
  arrangeList: el("arrange-list"),
  btnArrangeDone: el("btn-arrange-done"),
  selectStatus: el("select-status"),
  cardOptions: el("card-options"),
  revealNote: el("reveal-note"),
  laneList: el("lane-list"),
  sniperNote: el("sniper-note"),
  sniperList: el("sniper-list"),
  btnSkipSniper: el("btn-skip-sniper"),
  placementList: el("placement-list"),
  scoreList: el("score-list"),
  btnNextRace: el("btn-next-race"),
  btnReset: el("btn-reset"),
  finalList: el("final-list"),
  btnResetFinal: el("btn-reset-final"),
  toast: el("toast"),
  setPlayers: el("set-players"),
  setCardMax: el("set-cardmax"),
  setTrack: el("set-track"),
  setCheckpoint: el("set-checkpoint"),
  setSniper: el("set-sniper"),
  setParent: el("set-parent"),
  setReveal: el("set-reveal"),
  btnSaveSettings: el("btn-save-settings"),
  btnStart: el("btn-start"),
};

let appState = null;
let lastToastTimer = null;

function showToast(message) {
  if (!message) return;
  ui.toast.textContent = message;
  ui.toast.classList.remove("hidden");
  if (lastToastTimer) clearTimeout(lastToastTimer);
  lastToastTimer = setTimeout(() => ui.toast.classList.add("hidden"), 2400);
}

function setScreen(name) {
  Object.keys(screens).forEach((key) => {
    screens[key].classList.toggle("hidden", key !== name);
  });
}

function saveLocal(key, value) {
  localStorage.setItem(key, value);
}

function loadLocal(key) {
  return localStorage.getItem(key) || "";
}

function getPlayerName(id) {
  const player = appState?.players?.find((p) => p.id === id);
  return player ? player.name : "";
}

function updateRoomPill(roomId) {
  if (!roomId) {
    ui.roomPill.classList.add("hidden");
    return;
  }
  ui.roomPill.textContent = `ROOM ${roomId}`;
  ui.roomPill.classList.remove("hidden");
}

function isHost() {
  return appState?.you?.playerId && appState.hostId === appState.you.playerId;
}

function isParent() {
  return appState?.you?.playerId && appState.parentId === appState.you.playerId;
}

function laneOwnerLabel(lane) {
  if (isParent()) return "ひみつ";
  if (lane.isAI) return `AI (${getPlayerName(appState.parentId)}の担当)`;
  return lane.ownerName;
}

function makeAnimalIcon(lane) {
  const img = document.createElement("img");
  img.src = `/assets/animals/${lane.animalId}.svg`;
  img.alt = lane.label;
  img.className = "animal-icon";
  return img;
}

function renderLobby() {
  setScreen("lobby");
  updateRoomPill(appState.roomId);

  ui.playerList.innerHTML = "";
  appState.players.forEach((player) => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = player.name;
    const meta = document.createElement("span");
    const tags = [];
    if (player.isHost) tags.push("ホスト");
    if (player.isParent) tags.push("親");
    if (!player.connected) tags.push("離席中");
    meta.textContent = tags.join(" / ");
    li.append(name, meta);
    ui.playerList.appendChild(li);
  });

  ui.setPlayers.value = appState.settings.expectedPlayers;
  ui.setCardMax.value = appState.settings.cardMax;
  ui.setTrack.value = appState.settings.trackLength;
  ui.setCheckpoint.value = appState.settings.checkpointAt;
  ui.setCheckpoint.max = Math.max(2, appState.settings.trackLength - 1);
  ui.setSniper.value = appState.settings.sniperShotsLimit;
  ui.setParent.value = appState.settings.racesPerParent;
  ui.setReveal.value = appState.settings.revealDelayMs;

  const editable = isHost();
  [
    ui.setPlayers,
    ui.setCardMax,
    ui.setTrack,
    ui.setCheckpoint,
    ui.setSniper,
    ui.setParent,
    ui.setReveal,
    ui.btnSaveSettings,
    ui.btnStart,
  ].forEach((item) => {
    item.disabled = !editable;
  });
}

function renderArrange() {
  setScreen("arrange");
  updateRoomPill(appState.roomId);
  const parentName = getPlayerName(appState.parentId);
  ui.arrangeNote.textContent = isParent()
    ? "あなたが親です。並びを調整してください。"
    : `親の${parentName}さんが並びを調整しています…`;

  ui.arrangeList.innerHTML = "";
  appState.lanes.forEach((lane, index) => {
    const li = document.createElement("li");
    const left = document.createElement("div");
    left.className = "lane-name";
    left.append(makeAnimalIcon(lane));
    const label = document.createElement("span");
    label.textContent = `${lane.label} / ${laneOwnerLabel(lane)}`;
    left.append(label);

    const controls = document.createElement("div");
    if (isParent()) {
      const up = document.createElement("button");
      up.textContent = "↑";
      up.className = "ghost";
      up.disabled = index === 0;
      up.onclick = () => socket.emit("laneMove", { roomId: appState.roomId, from: index, to: index - 1 });
      const down = document.createElement("button");
      down.textContent = "↓";
      down.className = "ghost";
      down.disabled = index === appState.lanes.length - 1;
      down.onclick = () => socket.emit("laneMove", { roomId: appState.roomId, from: index, to: index + 1 });
      controls.append(up, down);
    }

    li.append(left, controls);
    ui.arrangeList.appendChild(li);
  });

  ui.btnArrangeDone.disabled = !isParent();
}

function renderSelect() {
  setScreen("select");
  updateRoomPill(appState.roomId);

  if (isParent()) {
    ui.selectStatus.textContent = "親はカードを出しません。みんなの選択を待ってください。";
    ui.cardOptions.innerHTML = "";
    return;
  }

  ui.selectStatus.textContent = `選択済み ${appState.selectedCount} / ${appState.totalSelectable}`;
  ui.cardOptions.innerHTML = "";

  for (let i = 0; i <= appState.settings.cardMax; i += 1) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = "card-btn";
    if (appState.mySelection === i) btn.classList.add("selected");
    btn.onclick = () => socket.emit("selectCard", { roomId: appState.roomId, value: i });
    ui.cardOptions.appendChild(btn);
  }
}

function renderReveal() {
  setScreen("reveal");
  updateRoomPill(appState.roomId);
  ui.revealNote.textContent = appState.lastReveal
    ? `${getLaneLabel(appState.lastReveal.laneId)} が ${appState.lastReveal.value} 進んだ！`
    : "進行中...";

  ui.laneList.innerHTML = "";
  appState.lanes.forEach((lane) => {
    ui.laneList.appendChild(createLaneCard(lane));
  });
}

function renderSniper() {
  setScreen("sniper");
  updateRoomPill(appState.roomId);

  const parentName = getPlayerName(appState.parentId);
  ui.sniperNote.textContent = isParent()
    ? `残りスナイプ ${appState.sniperShotsLeft} 回`
    : `${parentName}さんがスナイプを考えています...`;

  ui.sniperList.innerHTML = "";
  appState.lanes.forEach((lane) => {
    const card = createLaneCard(lane);
    if (isParent() && !lane.sniped && !lane.finished) {
      const shotBtn = document.createElement("button");
      shotBtn.textContent = "スナイプ";
      shotBtn.className = "primary";
      shotBtn.onclick = () => socket.emit("sniperShot", { roomId: appState.roomId, laneId: lane.id });
      card.appendChild(shotBtn);
    }
    ui.sniperList.appendChild(card);
  });

  ui.btnSkipSniper.disabled = !isParent();
}

function renderScore() {
  setScreen("score");
  updateRoomPill(appState.roomId);

  ui.placementList.innerHTML = "";
  appState.placements.slice(0, 3).forEach((laneId, index) => {
    const lane = appState.lanes.find((l) => l.id === laneId);
    if (!lane) return;
    const card = document.createElement("div");
    card.className = "place-card";
    const label = document.createElement("span");
    label.textContent = `${index + 1}位: ${lane.label} / ${laneOwnerLabel(lane)}`;
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.textContent = `${[3, 2, 1][index]}★`;
    card.append(label, badge);
    ui.placementList.appendChild(card);
  });

  if (appState.checkpointWinnerId && appState.placements.includes(appState.checkpointWinnerId)) {
    const lane = appState.lanes.find((l) => l.id === appState.checkpointWinnerId);
    if (lane) {
      const card = document.createElement("div");
      card.className = "place-card";
      const label = document.createElement("span");
      label.textContent = `チェックポイント: ${lane.label} / ${laneOwnerLabel(lane)}`;
      const badge = document.createElement("span");
      badge.className = "badge";
      badge.textContent = "1★";
      card.append(label, badge);
      ui.placementList.appendChild(card);
    }
  }

  ui.scoreList.innerHTML = "";
  const sorted = [...appState.players].sort((a, b) => b.score - a.score);
  sorted.forEach((player) => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = player.name;
    const score = document.createElement("span");
    score.textContent = `${player.score}★`;
    li.append(name, score);
    ui.scoreList.appendChild(li);
  });

  ui.btnNextRace.disabled = !isHost();
  ui.btnReset.disabled = !isHost();
}

function renderGameover() {
  setScreen("gameover");
  updateRoomPill(appState.roomId);
  const sorted = [...appState.players].sort((a, b) => b.score - a.score);
  ui.finalList.innerHTML = "";
  sorted.forEach((player, index) => {
    const li = document.createElement("li");
    const name = document.createElement("span");
    name.textContent = `${index + 1}位 ${player.name}`;
    const score = document.createElement("span");
    score.textContent = `${player.score}★`;
    li.append(name, score);
    ui.finalList.appendChild(li);
  });
  ui.btnResetFinal.disabled = !isHost();
}

function render() {
  if (!appState) {
    setScreen("join");
    updateRoomPill(null);
    return;
  }
  switch (appState.phase) {
    case "lobby":
      renderLobby();
      break;
    case "arrange":
      renderArrange();
      break;
    case "select":
      renderSelect();
      break;
    case "reveal":
      renderReveal();
      break;
    case "sniper":
      renderSniper();
      break;
    case "score":
      renderScore();
      break;
    case "gameover":
      renderGameover();
      break;
    default:
      setScreen("join");
  }
}

function getLaneLabel(laneId) {
  const lane = appState?.lanes?.find((l) => l.id === laneId);
  return lane ? lane.label : "";
}

function createLaneCard(lane) {
  const card = document.createElement("div");
  card.className = "lane";
  if (appState.lastReveal && appState.lastReveal.laneId === lane.id) {
    card.classList.add("highlight");
  }

  const top = document.createElement("div");
  top.className = "lane-top";
  const name = document.createElement("div");
  name.className = "lane-name";
  name.append(makeAnimalIcon(lane));
  const label = document.createElement("span");
  label.textContent = `${lane.label} / ${laneOwnerLabel(lane)}`;
  name.append(label);
  const status = document.createElement("span");
  if (lane.sniped) status.textContent = "スナイプ済";
  else if (lane.finished) status.textContent = `${lane.finishRank}位確定`;
  else status.textContent = `${lane.distance} / ${appState.settings.trackLength}`;
  top.append(name, status);

  const progress = document.createElement("div");
  progress.className = "progress";
  const bar = document.createElement("span");
  const pct = Math.min(100, Math.round((lane.distance / appState.settings.trackLength) * 100));
  bar.style.width = `${pct}%`;
  progress.appendChild(bar);

  card.append(top, progress);
  return card;
}

ui.btnCreate.addEventListener("click", () => {
  const name = ui.inputName.value.trim() || "プレイヤー";
  const playerKey = loadLocal(STORAGE_KEY.playerKey);
  socket.emit(
    "createRoom",
    { name, playerKey },
    (res) => {
      if (!res?.ok) {
        showToast(res?.message || "作成に失敗しました");
        return;
      }
      saveLocal(STORAGE_KEY.name, name);
      saveLocal(STORAGE_KEY.room, res.roomId);
      saveLocal(STORAGE_KEY.playerKey, res.playerKey);
    }
  );
});

ui.btnJoin.addEventListener("click", () => {
  const name = ui.inputName.value.trim() || "プレイヤー";
  const roomId = ui.inputRoom.value.trim().toUpperCase();
  if (!roomId) {
    showToast("部屋コードを入力してください");
    return;
  }
  const playerKey = loadLocal(STORAGE_KEY.playerKey);
  socket.emit(
    "joinRoom",
    { name, roomId, playerKey },
    (res) => {
      if (!res?.ok) {
        showToast(res?.message || "参加に失敗しました");
        return;
      }
      saveLocal(STORAGE_KEY.name, name);
      saveLocal(STORAGE_KEY.room, res.roomId);
      saveLocal(STORAGE_KEY.playerKey, res.playerKey);
    }
  );
});

ui.btnSaveSettings.addEventListener("click", () => {
  if (!isHost()) return;
  const settings = {
    expectedPlayers: ui.setPlayers.value,
    cardMax: ui.setCardMax.value,
    trackLength: ui.setTrack.value,
    checkpointAt: ui.setCheckpoint.value,
    sniperShotsLimit: ui.setSniper.value,
    racesPerParent: ui.setParent.value,
    revealDelayMs: ui.setReveal.value,
  };
  socket.emit("setSettings", { roomId: appState.roomId, settings });
});

ui.btnStart.addEventListener("click", () => {
  if (!isHost()) return;
  socket.emit("startGame", { roomId: appState.roomId });
});

ui.btnArrangeDone.addEventListener("click", () => {
  if (!isParent()) return;
  socket.emit("arrangeDone", { roomId: appState.roomId });
});

ui.btnSkipSniper.addEventListener("click", () => {
  if (!isParent()) return;
  socket.emit("sniperSkip", { roomId: appState.roomId });
});

ui.btnNextRace.addEventListener("click", () => {
  if (!isHost()) return;
  socket.emit("nextRace", { roomId: appState.roomId });
});

ui.btnReset.addEventListener("click", () => {
  if (!isHost()) return;
  socket.emit("resetLobby", { roomId: appState.roomId });
});

ui.btnResetFinal.addEventListener("click", () => {
  if (!isHost()) return;
  socket.emit("resetLobby", { roomId: appState.roomId });
});

socket.on("state", (state) => {
  appState = state;
  render();
});

socket.on("errorMessage", (message) => {
  showToast(message);
});

window.addEventListener("load", () => {
  ui.inputName.value = loadLocal(STORAGE_KEY.name);
  ui.inputRoom.value = loadLocal(STORAGE_KEY.room);
  render();
});

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const GOAL_POS = 51;

app.use(express.static('public', {
  etag: true,
  lastModified: true,
  maxAge: '7d',
  setHeaders: (res, filePath) => {
    const normalized = String(filePath || '').replace(/\\/g, '/');

    if (normalized.endsWith('.html') || normalized.endsWith('/sw.js')) {
      res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      return;
    }

    if (/\.(?:js|css|png|jpg|jpeg|webp|svg|gif|ico|woff2?)$/i.test(normalized)) {
      res.setHeader('Cache-Control', 'public, max-age=604800, stale-while-revalidate=86400');
    }
  },
}));
app.get('/healthz', (_req, res) => {
  res.status(200).json({
    ok: true,
    uptimeSec: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

server.listen(PORT, () => {
  const ip = getLocalIP();
  console.log(`Wild Derby running on http://${ip || 'localhost'}:${PORT}`);
});

const rooms = new Map();
const socketToRoom = new Map();
const duelRooms = new Map();
const duelSocketToRoom = new Map();

const ANIMALS = [
  { id: 'rabbit', name: 'ウサギ', emoji: '🐇' },
  { id: 'boar', name: 'イノシシ', emoji: '🐗' },
  { id: 'monkey', name: 'サル', emoji: '🐒' },
  { id: 'penguin', name: 'ペンギン', emoji: '🐧' },
  { id: 'turtle', name: 'カメ', emoji: '🐢' },
];

const ANIMAL_BY_EMOJI = new Map(ANIMALS.map((a) => [a.emoji, a]));
const ANIMAL_BY_ID = new Map(ANIMALS.map((a) => [a.id, a]));
const ANIMAL_ORDER = ANIMALS.map((a) => a.id);

const SINGLE_ODDS = {
  rabbit: 3,
  boar: 4,
  monkey: 5,
  penguin: 7,
  turtle: 10,
};

const QUINELLA_ODDS = {
  'boar-monkey': 10,
  'boar-penguin': 14,
  'boar-turtle': 20,
  'monkey-penguin': 18,
  'monkey-turtle': 25,
  'penguin-turtle': 35,
  'rabbit-boar': 6,
  'rabbit-monkey': 8,
  'rabbit-penguin': 10,
  'rabbit-turtle': 15,
};

const CARD_LIST = [
  '🐇４', '🐇４', '🐇６', '🐇６', '🐇７', '🐇７', '🐇８', '🐇１０', '🐇１０', '🐇スペシャル',
  '🐗４', '🐗４', '🐗５', '🐗６', '🐗６', '🐗７', '🐗８', '🐗８', '🐗９', '🐗スペシャル',
  '🐒３', '🐒４', '🐒５', '🐒５', '🐒６', '🐒６', '🐒７', '🐒７', '🐒８', '🐒スペシャル',
  '🐧４', '🐧４', '🐧４', '🐧５', '🐧５', '🐧５', '🐧６', '🐧６', '🐧６', '🐧スペシャル',
  '🐢３', '🐢３', '🐢３', '🐢４', '🐢４', '🐢５', '🐢５', '🐢６', '🐢６', '🐢スペシャル',
  '１位＋５', '１位＋１０', '２位＋７', '２位＋１０', '３位＋１０', '３位＋１０', '４位＋１０', '４位＋１５',
  'ビリ＋１０', 'ビリ＋２５', 'トラップ！', 'トラップ！', '同じマス＋３', '同じマス＋５',
];

function getLocalIP() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) return net.address;
    }
  }
  return null;
}

function shuffle(array) {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i += 1) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function makePlayerKey() {
  return Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
}

function defaultSettings() {
  return {
    expectedPlayers: 4,
    startingChips: 20,
    handSize: 7,
    betsPerPlayer: 3,
    cpuCount: 0,
    randomDraw: 0,
  };
}

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

function log(room, message) {
  room.log.unshift({ message, ts: Date.now() });
  room.log = room.log.slice(0, 10);
}

function buildAnimals() {
  return ANIMALS.map((animal) => ({
    id: animal.id,
    name: animal.name,
    emoji: animal.emoji,
    pos: 0,
    finished: false,
    place: null,
  }));
}

function buildDeck() {
  return shuffle(CARD_LIST.map((name, idx) => ({
    id: `card_${idx}_${Math.random().toString(36).slice(2, 8)}`,
    name,
  })));
}

function getPlayerById(room, id) {
  return room.players.find((p) => p.id === id);
}

function ensureHost(room) {
  if (room.hostId && room.players.some((p) => p.id === room.hostId && p.connected)) return;
  const next = room.players.find((p) => p.connected && !p.isCpu) || room.players.find((p) => p.connected);
  room.hostId = next ? next.id : null;
}

function reassignSeatIndexes(room) {
  room.players.forEach((player, index) => {
    player.seatIndex = index;
  });
}

function renumberCpu(room) {
  let count = 1;
  room.players.forEach((player) => {
    if (player.isCpu) {
      player.name = `CPU${count}`;
      count += 1;
    }
  });
}

function makeCpuPlayer(room, order) {
  return {
    id: `cpu_${room.code}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    playerKey: null,
    name: `CPU${order}`,
    seatIndex: room.players.length,
    connected: true,
    isCpu: true,
    chips: room.settings.startingChips,
    bets: [],
    passCount: 0,
    hand: [],
  };
}

function syncCpuPlayers(room) {
  if (room.phase !== 'lobby') return;
  const desired = clamp(Number(room.settings.cpuCount) || 0, 0, 6);
  const cpuPlayers = room.players.filter((p) => p.isCpu);
  const diff = desired - cpuPlayers.length;

  if (diff > 0) {
    const startIndex = cpuPlayers.length + 1;
    for (let i = 0; i < diff; i += 1) {
      room.players.push(makeCpuPlayer(room, startIndex + i));
    }
  } else if (diff < 0) {
    let remove = -diff;
    while (remove > 0) {
      const idx = room.players.map((p) => p.isCpu).lastIndexOf(true);
      if (idx === -1) break;
      room.players.splice(idx, 1);
      remove -= 1;
    }
  }

  renumberCpu(room);
  reassignSeatIndexes(room);
}

function buildBetOrder(playerCount, dealerIndex, betsPerPlayer) {
  const order = [];
  for (let round = 0; round < betsPerPlayer; round += 1) {
    const dir = round % 2 === 0 ? 1 : -1;
    let idx = round % 2 === 0
      ? dealerIndex
      : (dealerIndex - 1 + playerCount) % playerCount;
    for (let i = 0; i < playerCount; i += 1) {
      order.push(idx);
      idx = (idx + dir + playerCount) % playerCount;
    }
  }
  return order;
}

function startGame(room) {
  syncCpuPlayers(room);
  room.players.forEach((player) => {
    player.chips = room.settings.startingChips;
    player.bets = [];
    player.passCount = 0;
    player.hand = [];
  });

  room.game = {
    dealerIndex: Math.floor(Math.random() * room.players.length),
    activePlayerIndex: 0,
    betOrder: [],
    betTurn: 0,
    pot: 0,
    animals: buildAnimals(),
    deck: [],
    discard: [],
    rabbitDouble: false,
    penguinReplace: false,
    trapTargetId: null,
    finishOrder: [],
    result: null,
  };

  startRace(room, false);
}

function startRace(room, keepPot) {
  const { game, settings } = room;
  room.phase = 'betting';
  game.animals = buildAnimals();
  game.finishOrder = [];
  game.rabbitDouble = false;
  game.penguinReplace = false;
  game.trapTargetId = null;
  game.result = null;
  game.deck = buildDeck();
  game.discard = [];
  if (!keepPot) game.pot = 0;

  room.players.forEach((player) => {
    player.bets = [];
    player.passCount = 0;
    player.hand = [];
  });

  dealHands(room);
  game.betOrder = buildBetOrder(room.players.length, game.dealerIndex, settings.betsPerPlayer);
  game.betTurn = 0;
  game.activePlayerIndex = game.betOrder[0] || 0;
  log(room, 'ベットフェイズ開始。');
}

function dealHands(room) {
  const { handSize } = room.settings;
  for (let i = 0; i < handSize; i += 1) {
    room.players.forEach((player) => {
      const card = room.game.deck.shift();
      if (card) player.hand.push(card);
    });
  }
}

function nextDealer(room) {
  room.game.dealerIndex = Math.floor(Math.random() * room.players.length);
}

function activePlayer(room) {
  return room.players[room.game.activePlayerIndex];
}

function getRankGroups(game) {
  const active = game.animals.filter((a) => !a.finished);
  active.sort((a, b) => b.pos - a.pos);
  const groups = [];
  active.forEach((animal) => {
    const last = groups[groups.length - 1];
    if (!last || last.pos !== animal.pos) {
      groups.push({ pos: animal.pos, animals: [animal] });
    } else {
      last.animals.push(animal);
    }
  });
  return groups;
}

function getUniqueRankAnimal(game, rankIndex) {
  const groups = getRankGroups(game);
  if (rankIndex < 1 || rankIndex > groups.length) return null;
  const group = groups[rankIndex - 1];
  if (!group || group.animals.length !== 1) return null;
  return group.animals[0];
}

function getUniqueLastAnimal(game) {
  const groups = getRankGroups(game);
  if (!groups.length) return null;
  const group = groups[groups.length - 1];
  if (group.animals.length !== 1) return null;
  return group.animals[0];
}

function pairKey(a, b) {
  return [a, b]
    .sort((x, y) => ANIMAL_ORDER.indexOf(x) - ANIMAL_ORDER.indexOf(y))
    .join('-');
}

function findBetOwner(room, selectionKey) {
  for (const player of room.players) {
    const bets = player.bets || [];
    const bet = bets.find((b) => b.selection === selectionKey);
    if (bet) return { player, bet };
  }
  return null;
}

function findBetByType(room, type, selectionKey) {
  for (const player of room.players) {
    const bets = player.bets || [];
    const bet = bets.find((b) => b.type === type && b.selection === selectionKey);
    if (bet) return { player, bet };
  }
  return null;
}

function parseNumber(text) {
  const full = '０１２３４５６７８９';
  const half = '0123456789';
  let out = '';
  for (const char of text) {
    const idx = full.indexOf(char);
    out += idx >= 0 ? half[idx] : char;
  }
  const match = out.match(/\d+/);
  return match ? parseInt(match[0], 10) : null;
}

function firstSymbol(text) {
  const chars = Array.from(text || '');
  return chars[0] || '';
}

function applyMoves(room, moves, cardName) {
  const { game } = room;
  const finishCandidates = [];

  moves.forEach((move) => {
    const animal = game.animals.find((a) => a.id === move.animalId);
    if (!animal || animal.finished) return;

    let amount = move.amount;
    if (game.trapTargetId === animal.id) {
      amount = 0;
      game.trapTargetId = null;
      log(room, `${animal.emoji}${animal.name}はトラップで停止。`);
    }
    if (game.rabbitDouble && animal.id === 'rabbit') {
      amount *= 2;
      game.rabbitDouble = false;
      log(room, '🐇スペシャル発動！移動距離が2倍。');
    }

    const allowFinish = move.allowFinish !== false;
    const cap = allowFinish ? GOAL_POS : GOAL_POS - 1;
    const newPos = Math.min(animal.pos + amount, cap);
    finishCandidates.push({ animal, oldPos: animal.pos, newPos, amount });
  });

  finishCandidates.forEach(({ animal, newPos, amount }) => {
    animal.pos = newPos;
    log(room, `${animal.emoji}${animal.name}が${amount}マス進む（${newPos}/${GOAL_POS}）。`);
  });

  const finishers = finishCandidates
    .filter((c) => c.oldPos < GOAL_POS && c.newPos >= GOAL_POS)
    .sort((a, b) => {
      if (b.oldPos !== a.oldPos) return b.oldPos - a.oldPos;
      return ANIMAL_ORDER.indexOf(a.animal.id) - ANIMAL_ORDER.indexOf(b.animal.id);
    });

  finishers.forEach(({ animal }) => {
    if (animal.finished) return;
    animal.finished = true;
    animal.place = game.finishOrder.length + 1;
    game.finishOrder.push(animal.id);
    log(room, `${animal.emoji}${animal.name}がゴール！${animal.place}位。`);
  });
}

function applyCard(room, card, sourceLabel) {
  const { game } = room;
  const name = card.name;

  if (name.includes('スペシャル')) {
    const emoji = firstSymbol(name);
    const animal = ANIMAL_BY_EMOJI.get(emoji);
    if (!animal) return;

    if (animal.id === 'rabbit') {
      game.rabbitDouble = true;
      log(room, '🐇スペシャル準備完了。次の🐇の移動が2倍。');
      return;
    }

    if (animal.id === 'penguin') {
      game.penguinReplace = true;
      log(room, '🐧スペシャル準備完了。次の移動がペンギンに置換。');
      return;
    }

    if (animal.id === 'boar') {
      const target = game.animals.find((a) => a.id === 'boar');
      if (!target || target.finished) return;
      const next = Math.floor(target.pos / 10) * 10 + 10;
      const amount = Math.max(1, Math.min(next, GOAL_POS) - target.pos);
      handleMoveWithPenguin(room, [{ animalId: 'boar', amount }], name);
      return;
    }

    if (animal.id === 'monkey') {
      const monkey = game.animals.find((a) => a.id === 'monkey');
      if (!monkey || monkey.finished) return;
      const groups = getRankGroups(game);
      const monkeyGroupIndex = groups.findIndex((g) => g.animals.some((a) => a.id === 'monkey'));
      if (monkeyGroupIndex === -1 || monkeyGroupIndex >= groups.length - 1) {
        log(room, '🐒スペシャルは対象なし。');
        return;
      }
      const behind = groups[monkeyGroupIndex + 1];
      if (!behind || behind.animals.length !== 1) {
        log(room, '🐒スペシャルは対象なし。');
        return;
      }
      const diff = monkey.pos - behind.animals[0].pos;
      const amount = Math.max(0, diff * 2);
      handleMoveWithPenguin(room, [{ animalId: 'monkey', amount }], name);
      return;
    }

    if (animal.id === 'turtle') {
      const turtle = game.animals.find((a) => a.id === 'turtle');
      if (!turtle || turtle.finished) return;
      const groups = getRankGroups(game);
      const turtleGroupIndex = groups.findIndex((g) => g.animals.some((a) => a.id === 'turtle'));
      if (turtleGroupIndex <= 0) {
        log(room, '🐢スペシャルは対象なし。');
        return;
      }
      const ahead = groups[turtleGroupIndex - 1];
      if (!ahead || ahead.animals.length !== 1) {
        log(room, '🐢スペシャルは対象なし。');
        return;
      }
      const amount = Math.max(0, ahead.animals[0].pos - turtle.pos);
      handleMoveWithPenguin(room, [{ animalId: 'turtle', amount }], name);
    }
    return;
  }

  if (name.startsWith('トラップ')) {
    const target = getUniqueRankAnimal(game, 1);
    if (!target) {
      log(room, 'トラップは対象なし。');
      return;
    }
    game.trapTargetId = target.id;
    log(room, `${target.emoji}${target.name}にトラップ！次の移動が0。`);
    return;
  }

  if (name.startsWith('同じマス')) {
    const amount = parseNumber(name) || 0;
    const groups = getRankGroups(game).filter((g) => g.animals.length > 1);
    if (!groups.length) {
      log(room, '同じマスの動物がいない。');
      return;
    }
    const moves = groups.flatMap((g) => g.animals.map((animal) => ({
      animalId: animal.id,
      amount,
      allowFinish: false,
    })));
    handleMoveWithPenguin(room, moves, name);
    return;
  }

  if (name.includes('位＋')) {
    const rank = parseNumber(name);
    const amount = parseNumber(name.split('＋')[1] || '') || 0;
    const target = getUniqueRankAnimal(game, rank);
    if (!target) {
      log(room, `${rank}位カードは対象なし。`);
      return;
    }
    handleMoveWithPenguin(room, [{ animalId: target.id, amount }], name);
    return;
  }

  if (name.startsWith('ビリ')) {
    const amount = parseNumber(name) || 0;
    const target = getUniqueLastAnimal(game);
    if (!target) {
      log(room, 'ビリカードは対象なし。');
      return;
    }
    handleMoveWithPenguin(room, [{ animalId: target.id, amount }], name);
    return;
  }

  const emoji = firstSymbol(name);
  const animal = ANIMAL_BY_EMOJI.get(emoji);
  if (animal) {
    const amount = parseNumber(name) || 0;
    handleMoveWithPenguin(room, [{ animalId: animal.id, amount }], name);
  }
}

function handleMoveWithPenguin(room, moves, cardName) {
  const { game } = room;
  if (!moves.length) return;

  if (game.penguinReplace) {
    const isPenguinCard = moves.length === 1 && moves[0].animalId === 'penguin';
    game.penguinReplace = false;

    if (!isPenguinCard) {
      const amount = moves[0].amount || 0;
      const allowFinish = moves[0].allowFinish !== false;
      log(room, '🐧スペシャル発動！ペンギンが代わりに進む。');
      applyMoves(room, [{ animalId: 'penguin', amount, allowFinish }], cardName);
      return;
    }
    log(room, '🐧スペシャルは効果なし。');
  }

  applyMoves(room, moves, cardName);
}

function checkRaceEnd(room) {
  if (room.game.finishOrder.length >= 2) {
    settleRace(room);
    room.phase = 'settle';
    return true;
  }
  return false;
}

function checkDraw(room) {
  const deckEmpty = room.game.deck.length === 0;
  const allEmpty = room.players.every((p) => p.hand.length === 0);
  if (deckEmpty && allEmpty) {
    room.phase = 'draw';
    log(room, '山札が尽きたため引き分け。パスチップは次レースへ。');
    return true;
  }
  return false;
}

function settleRace(room) {
  const { game } = room;
  const first = game.finishOrder[0];
  const second = game.finishOrder[1];
  const singleBet = findBetByType(room, 'single', first);
  const quinellaBet = findBetByType(room, 'quinella', pairKey(first, second));
  const singleWinner = singleBet?.player || null;
  const quinellaWinner = quinellaBet?.player || null;

  game.result = {
    first,
    second,
    singleWinnerId: singleWinner?.id || null,
    quinellaWinnerId: quinellaWinner?.id || null,
  };

  if (singleWinner && quinellaWinner && singleWinner.id !== quinellaWinner.id) {
    const half = Math.floor(game.pot / 2);
    const extra = game.pot % 2;
    singleWinner.chips += half;
    quinellaWinner.chips += half + extra;
    log(room, 'パスチップを単勝/連対で分配。');
  } else if (singleWinner || quinellaWinner) {
    const winner = singleWinner || quinellaWinner;
    winner.chips += game.pot;
    log(room, 'パスチップを的中者へ支払い。');
  }

  game.pot = 0;

  if (singleWinner) {
    const betChips = singleBet?.bet?.chips || 0;
    const payout = SINGLE_ODDS[first] * betChips;
    payOdds(room, singleWinner.id, payout, '単勝');
  }
  if (quinellaWinner) {
    const key = pairKey(first, second);
    const betChips = quinellaBet?.bet?.chips || 0;
    const payout = QUINELLA_ODDS[key] * betChips;
    payOdds(room, quinellaWinner.id, payout, '連対');
  }
}

function payOdds(room, winnerId, amount, label) {
  if (!amount || amount <= 0) return;
  const { game } = room;
  const players = room.players;
  const winner = getPlayerById(room, winnerId);
  if (!winner) return;

  let idx = game.dealerIndex;
  let remaining = amount;
  const playerCount = players.length;

  while (remaining > 0 && playerCount > 1) {
    const player = players[idx];
    if (player.id !== winnerId) {
      player.chips -= 1;
      winner.chips += 1;
      remaining -= 1;
    }
    idx = (idx + 1) % playerCount;
  }

  log(room, `${label}オッズ ${amount} 枚を支払い。`);
}

function advanceTurn(room) {
  const { game } = room;
  const playerCount = room.players.length;
  if (playerCount === 0) return;

  let nextIndex = game.activePlayerIndex;
  for (let i = 0; i < playerCount; i += 1) {
    nextIndex = (nextIndex + 1) % playerCount;
    const candidate = room.players[nextIndex];
    if (candidate.hand.length > 0) break;
  }

  game.activePlayerIndex = nextIndex;

  if (room.settings.randomDraw && nextIndex === game.dealerIndex) {
    resolveRandomDraw(room);
  }
}

function resolveRandomDraw(room) {
  const { game } = room;
  const card = game.deck.shift();
  if (!card) return;
  game.discard.push(card);
  log(room, `ランダムドロー：${card.name}`);
  applyCard(room, card, 'ランダムドロー');
  if (checkRaceEnd(room)) return;
  checkDraw(room);
}

function handleBet(room, player, type, selection) {
  if (!room || room.phase !== 'betting') return false;
  if (!player) return false;
  if (room.players[room.game.activePlayerIndex]?.id !== player.id) return false;

  const selectionKey = type === 'single'
    ? selection
    : pairKey(selection?.[0], selection?.[1]);

  if (!selectionKey) return false;

  const owner = findBetOwner(room, selectionKey);
  if (owner && owner.player.id !== player.id) return false;

  const bets = player.bets || [];
  const existing = bets.find((b) => b.selection === selectionKey);
  if (existing) {
    existing.chips += 1;
  } else {
    bets.push({ type, selection: selectionKey, chips: 1 });
    player.bets = bets;
  }

  log(room, `${player.name}がベット。`);

  room.game.betTurn += 1;
  if (room.game.betTurn >= room.game.betOrder.length) {
    room.phase = 'race';
    room.game.activePlayerIndex = room.game.dealerIndex;
    log(room, 'レースフェイズ開始。');
  } else {
    room.game.activePlayerIndex = room.game.betOrder[room.game.betTurn];
  }

  emitState(room);
  return true;
}

function handlePlayCard(room, player, cardId, isPass) {
  if (!room || room.phase !== 'race') return false;
  if (!player) return false;
  if (room.players[room.game.activePlayerIndex]?.id !== player.id) return false;

  const cardIndex = player.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) return false;

  const [card] = player.hand.splice(cardIndex, 1);
  room.game.discard.push(card);

  if (isPass) {
    const cost = Math.pow(2, player.passCount || 0);
    player.passCount = (player.passCount || 0) + 1;
    player.chips -= cost;
    room.game.pot += cost;
    log(room, `${player.name}がパス（${cost}枚支払い）。`);
  } else {
    log(room, `${player.name}が${card.name}を使用。`);
    applyCard(room, card, player.name);

    if (checkRaceEnd(room)) {
      emitState(room);
      return true;
    }
  }

  if (player.hand.length === 1 && room.game.deck.length > 0) {
    const draw = room.game.deck.shift();
    if (draw) player.hand.push(draw);
  }

  if (checkDraw(room)) {
    emitState(room);
    return true;
  }

  advanceTurn(room);
  emitState(room);
  return true;
}

function cpuPlaceBet(room, player) {
  if (!room || room.phase !== 'betting') return;
  if (!player || !player.isCpu) return;
  if (room.players[room.game.activePlayerIndex]?.id !== player.id) return;

  const choices = [];
  ANIMALS.forEach((animal) => {
    const key = animal.id;
    const owner = findBetOwner(room, key);
    if (!owner || owner.player.id === player.id) {
      choices.push({ type: 'single', selection: animal.id });
    }
  });

  for (let i = 0; i < ANIMALS.length; i += 1) {
    for (let j = i + 1; j < ANIMALS.length; j += 1) {
      const key = pairKey(ANIMALS[i].id, ANIMALS[j].id);
      const owner = findBetOwner(room, key);
      if (!owner || owner.player.id === player.id) {
        choices.push({ type: 'quinella', selection: [ANIMALS[i].id, ANIMALS[j].id] });
      }
    }
  }

  if (!choices.length) return;
  const pick = choices[Math.floor(Math.random() * choices.length)];
  handleBet(room, player, pick.type, pick.selection);
}

function cpuPlayCard(room, player) {
  if (!room || room.phase !== 'race') return;
  if (!player || !player.isCpu) return;
  if (room.players[room.game.activePlayerIndex]?.id !== player.id) return;
  if (!player.hand.length) return;

  const card = player.hand[Math.floor(Math.random() * player.hand.length)];
  handlePlayCard(room, player, card.id, false);
}

function scheduleCpu(room) {
  if (!room || room.cpuTimer) return;
  if (room.phase !== 'betting' && room.phase !== 'race') return;
  const player = room.players[room.game.activePlayerIndex];
  if (!player || !player.isCpu) return;

  room.cpuTimer = setTimeout(() => {
    room.cpuTimer = null;
    const latestPlayer = room.players[room.game.activePlayerIndex];
    if (!latestPlayer || !latestPlayer.isCpu) return;
    if (room.phase === 'betting') cpuPlaceBet(room, latestPlayer);
    if (room.phase === 'race') cpuPlayCard(room, latestPlayer);
  }, 700);
}

function emitState(room) {
  room.players.forEach((player) => {
    const socket = io.sockets.sockets.get(player.id);
    if (!socket) return;
    socket.emit('state', getPublicState(room, player.id));
  });
  scheduleCpu(room);
}

function getPublicState(room, viewerId) {
  const { game } = room;
  const me = getPlayerById(room, viewerId);
  const isHost = room.hostId === viewerId;
  const dealerId = room.players[game?.dealerIndex || 0]?.id || null;
  const activeId = room.players[game?.activePlayerIndex || 0]?.id || null;

  const players = room.players.map((p) => ({
    id: p.id,
    name: p.name,
    seatIndex: p.seatIndex,
    connected: p.connected,
    isHost: room.hostId === p.id,
    isDealer: dealerId === p.id,
    isCpu: !!p.isCpu,
    chips: p.chips || 0,
    bets: p.bets || [],
    passCount: p.passCount || 0,
  }));

  return {
    roomCode: room.code,
    phase: room.phase,
    settings: room.settings,
    serverInfo: { ip: room.serverIp, port: room.port },
    me: me ? {
      id: me.id,
      name: me.name,
      isHost,
      isDealer: dealerId === me.id,
      chips: me.chips || 0,
      bets: me.bets || [],
      passCount: me.passCount || 0,
      hand: me.hand || [],
      playerKey: me.playerKey,
    } : null,
    players,
    animals: game?.animals || [],
    pot: game?.pot || 0,
    deckCount: game?.deck?.length || 0,
    discardCount: game?.discard?.length || 0,
    dealerId,
    activePlayerId: activeId,
    betState: game ? {
      betTurn: game.betTurn,
      betTotal: game.betOrder?.length || 0,
      betRound: game.betOrder?.length ? Math.floor(game.betTurn / room.players.length) + 1 : 1,
      betDirection: (Math.floor(game.betTurn / room.players.length) % 2 === 0) ? 'cw' : 'ccw',
    } : null,
    odds: { single: SINGLE_ODDS, quinella: QUINELLA_ODDS },
    result: game?.result || null,
    log: room.log || [],
  };
}

function handleDisconnect(socket) {
  const roomCode = socketToRoom.get(socket.id);
  if (!roomCode) return;
  const room = rooms.get(roomCode);
  if (!room) return;

  const player = getPlayerById(room, socket.id);
  if (player) {
    player.connected = false;
    log(room, `${player.name}が切断しました。`);
  }

  ensureHost(room);
  emitState(room);
}

function joinRoom(socket, room, name, playerKey) {
  const playerName = (name || '').trim().slice(0, 16) || 'プレイヤー';
  const existingByKey = playerKey ? room.players.find((p) => p.playerKey === playerKey) : null;

  if (existingByKey) {
    const oldId = existingByKey.id;
    replacePlayerId(room, oldId, socket.id);
    existingByKey.connected = true;
    existingByKey.name = playerName || existingByKey.name;
  } else {
    const newPlayer = {
      id: socket.id,
      playerKey: playerKey || makePlayerKey(),
      name: playerName,
      seatIndex: room.players.length,
      connected: true,
      chips: room.settings.startingChips,
      bets: [],
      passCount: 0,
      hand: [],
      isCpu: false,
    };
    const cpuIndex = room.players.findIndex((p) => p.isCpu);
    if (cpuIndex === -1) {
      room.players.push(newPlayer);
    } else {
      room.players.splice(cpuIndex, 0, newPlayer);
    }
    reassignSeatIndexes(room);
  }

  socket.join(room.code);
  socketToRoom.set(socket.id, room.code);
  ensureHost(room);
  emitState(room);
}

function replacePlayerId(room, oldId, newId) {
  if (oldId === newId) return;
  socketToRoom.delete(oldId);

  room.players.forEach((p) => {
    if (p.id === oldId) p.id = newId;
  });

  if (room.hostId === oldId) room.hostId = newId;
}

function duelChannel(code) {
  return `duel_${code}`;
}

function sanitizeDuelName(name, fallback) {
  const clean = (name || '').trim().slice(0, 16);
  return clean || fallback;
}

function sanitizeDuelInput(raw) {
  const x = Number(raw?.x) || 0;
  const y = Number(raw?.y) || 0;
  const len = Number(raw?.len) || 0;
  return {
    x: clamp(x, -1, 1),
    y: clamp(y, -1, 1),
    len: clamp(len, 0, 1),
  };
}

const DUEL_SLOTS = ['p1', 'p2', 'p3', 'p4'];
const DUEL_GUEST_SLOTS = DUEL_SLOTS.slice(1);

function sanitizeDuelNpcCount(value) {
  return clamp(Number(value) || 0, 0, 2);
}

function duelFindRoleBySocket(room, socketId) {
  return DUEL_SLOTS.find((slot) => room.players[slot]?.id === socketId) || null;
}

function duelPublicPlayers(room) {
  const payload = {};
  DUEL_SLOTS.forEach((slot) => {
    payload[slot] = room.players[slot]?.name || null;
  });
  return payload;
}

function duelHumanCount(room) {
  return DUEL_SLOTS.reduce((sum, slot) => sum + (room.players[slot] ? 1 : 0), 0);
}

function duelReady(room) {
  return duelHumanCount(room) + (room.npcCount || 0) >= 2;
}

function duelOpenSlot(room) {
  return DUEL_GUEST_SLOTS.find((slot) => !room.players[slot]) || null;
}

function duelRoomStatePayload(room) {
  return {
    roomCode: room.code,
    ready: duelReady(room),
    players: duelPublicPlayers(room),
    humanCount: duelHumanCount(room),
    npcCount: room.npcCount || 0,
  };
}

function emitDuelRoomState(room) {
  io.to(duelChannel(room.code)).emit('duel_room_state', duelRoomStatePayload(room));
}

function makeDuelRoomCode() {
  for (let i = 0; i < 64; i += 1) {
    const code = makeRoomCode();
    if (!duelRooms.has(code) && !rooms.has(code)) return code;
  }
  return makeRoomCode();
}

function leaveDuelRoom(socket, reasonForPeer) {
  const code = duelSocketToRoom.get(socket.id);
  if (!code) return;

  const room = duelRooms.get(code);
  duelSocketToRoom.delete(socket.id);
  socket.leave(duelChannel(code));
  if (!room) return;

  const role = duelFindRoleBySocket(room, socket.id);
  if (!role) return;

  const isHost = room.hostId === socket.id || role === 'p1';
  if (isHost) {
    DUEL_GUEST_SLOTS.forEach((slot) => {
      const peer = room.players[slot];
      if (!peer) return;
      duelSocketToRoom.delete(peer.id);
      const peerSocket = io.sockets.sockets.get(peer.id);
      if (peerSocket) peerSocket.leave(duelChannel(code));
      io.to(peer.id).emit('duel_error', reasonForPeer || 'ホストが退出しました。');
    });
    duelRooms.delete(code);
    return;
  }

  const peer = room.players[role];
  room.players[role] = null;
  io.to(duelChannel(code)).emit('duel_peer_left', {
    roomCode: code,
    role,
    name: peer?.name || role.toUpperCase(),
  });
  emitDuelRoomState(room);
}

function handleDuelDisconnect(socket) {
  leaveDuelRoom(socket, 'ホストが切断したためルームを終了しました。');
}

io.on('connection', (socket) => {
  socket.on('duel_create_room', ({ name, roomCode, npcCount }) => {
    leaveDuelRoom(socket, 'ホストが退出しました。');

    const preferred = (roomCode || '').toUpperCase().trim();
    const code = preferred || makeDuelRoomCode();
    if (duelRooms.has(code)) {
      socket.emit('duel_error', 'そのルームコードは使用中です。');
      return;
    }

    const room = {
      code,
      hostId: socket.id,
      npcCount: sanitizeDuelNpcCount(npcCount),
      players: {
        p1: {
          id: socket.id,
          name: sanitizeDuelName(name, 'P1'),
        },
        p2: null,
        p3: null,
        p4: null,
      },
    };

    duelRooms.set(code, room);
    duelSocketToRoom.set(socket.id, code);
    socket.join(duelChannel(code));

    socket.emit('duel_room_joined', {
      roomCode: code,
      role: 'p1',
      isHost: true,
      ...duelRoomStatePayload(room),
    });
    emitDuelRoomState(room);
  });

  socket.on('duel_join_room', ({ name, roomCode }) => {
    const code = (roomCode || '').toUpperCase().trim();
    const room = duelRooms.get(code);
    if (!room) {
      socket.emit('duel_error', 'ルームが見つかりません。');
      return;
    }

    const slot = duelOpenSlot(room);
    if (!slot) {
      socket.emit('duel_error', 'このルームは満員です。');
      return;
    }

    leaveDuelRoom(socket, '相手が退出しました。');

    room.players[slot] = {
      id: socket.id,
      name: sanitizeDuelName(name, slot.toUpperCase()),
    };

    duelSocketToRoom.set(socket.id, code);
    socket.join(duelChannel(code));

    socket.emit('duel_room_joined', {
      roomCode: code,
      role: slot,
      isHost: false,
      ...duelRoomStatePayload(room),
    });
    socket.to(duelChannel(code)).emit('duel_peer_joined', {
      name: room.players[slot].name,
      role: slot,
      roomCode: code,
    });
    emitDuelRoomState(room);
  });

  socket.on('duel_set_npc_count', ({ npcCount }) => {
    const code = duelSocketToRoom.get(socket.id);
    if (!code) return;
    const room = duelRooms.get(code);
    if (!room) return;
    if (room.hostId !== socket.id) return;

    room.npcCount = sanitizeDuelNpcCount(npcCount);
    emitDuelRoomState(room);
  });

  socket.on('duel_leave_room', () => {
    leaveDuelRoom(socket, 'ホストが退出しました。');
  });

  socket.on('duel_input', ({ input }) => {
    const code = duelSocketToRoom.get(socket.id);
    if (!code) return;
    const room = duelRooms.get(code);
    if (!room) return;

    const role = duelFindRoleBySocket(room, socket.id);
    if (!role) return;

    const cleanInput = sanitizeDuelInput(input);
    if (role !== 'p1' && room.hostId) {
      io.to(room.hostId).emit('duel_remote_input', {
        role,
        input: cleanInput,
      });
    }
  });

  socket.on('duel_select', ({ type, value }) => {
    const code = duelSocketToRoom.get(socket.id);
    if (!code) return;
    const room = duelRooms.get(code);
    if (!room) return;

    const role = duelFindRoleBySocket(room, socket.id);
    if (!role) return;

    if (role !== 'p1' && type === 'player_char' && room.hostId) {
      const charId = String(value || '').trim().slice(0, 24);
      if (!charId) return;
      io.to(room.hostId).emit('duel_remote_select', {
        type: 'player_char',
        role,
        value: charId,
      });
    }
  });

  socket.on('duel_use_item', () => {
    const code = duelSocketToRoom.get(socket.id);
    if (!code) return;
    const room = duelRooms.get(code);
    if (!room) return;

    const role = duelFindRoleBySocket(room, socket.id);
    if (!role) return;

    if (role !== 'p1' && room.hostId) {
      io.to(room.hostId).emit('duel_remote_use_item', { role });
    }
  });

  socket.on('duel_snapshot', ({ snapshot }) => {
    const code = duelSocketToRoom.get(socket.id);
    if (!code) return;
    const room = duelRooms.get(code);
    if (!room) return;
    if (room.hostId !== socket.id) return;

    DUEL_GUEST_SLOTS.forEach((slot) => {
      const peer = room.players[slot];
      if (!peer) return;
      io.to(peer.id).emit('duel_snapshot', snapshot);
    });
  });

  socket.on('create_room', ({ name, roomCode, expectedPlayers, playerKey }) => {
    const code = (roomCode || makeRoomCode()).toUpperCase();
    if (rooms.has(code)) {
      socket.emit('error_message', 'そのルームコードは使用中です。');
      return;
    }
    const room = {
      code,
      hostId: socket.id,
      players: [],
      settings: defaultSettings(),
      phase: 'lobby',
      log: [],
      game: null,
      serverIp: getLocalIP(),
      port: PORT,
    };

    if (Number.isInteger(expectedPlayers)) {
      room.settings.expectedPlayers = clamp(expectedPlayers, 2, 8);
    }

    rooms.set(code, room);
    joinRoom(socket, room, name, playerKey);
  });

  socket.on('join_room', ({ name, roomCode, playerKey }) => {
    const code = (roomCode || '').toUpperCase();
    const room = rooms.get(code);
    if (!room) {
      socket.emit('error_message', 'ルームが見つかりません。');
      return;
    }
    const existing = playerKey ? room.players.find((p) => p.playerKey === playerKey) : null;
    if (!existing && room.phase !== 'lobby') {
      socket.emit('error_message', 'ゲーム進行中のため参加できません。');
      return;
    }
    joinRoom(socket, room, name, playerKey);
  });

  socket.on('set_settings', ({ roomCode, settings }) => {
    const room = rooms.get((roomCode || '').toUpperCase());
    if (!room) return;
    if (room.hostId !== socket.id) return;

    const s = room.settings;
    if (Number.isInteger(settings.expectedPlayers)) s.expectedPlayers = clamp(settings.expectedPlayers, 2, 8);
    if (Number.isInteger(settings.startingChips)) s.startingChips = clamp(settings.startingChips, 5, 50);
    if (Number.isInteger(settings.handSize)) s.handSize = clamp(settings.handSize, 3, 10);
    if (Number.isInteger(settings.betsPerPlayer)) s.betsPerPlayer = clamp(settings.betsPerPlayer, 1, 5);
    if (Number.isInteger(settings.cpuCount)) s.cpuCount = clamp(settings.cpuCount, 0, 6);
    if (settings.randomDraw !== undefined) s.randomDraw = settings.randomDraw ? 1 : 0;

    syncCpuPlayers(room);
    emitState(room);
  });

  socket.on('start_game', ({ roomCode }) => {
    const room = rooms.get((roomCode || '').toUpperCase());
    if (!room) return;
    if (room.hostId !== socket.id) return;
    syncCpuPlayers(room);
    const humanCount = room.players.filter((p) => !p.isCpu).length;
    const totalPlayers = room.players.length;
    if (humanCount < 1) return;
    if (totalPlayers < 2) return;
    if (totalPlayers < room.settings.expectedPlayers) return;

    startGame(room);
    emitState(room);
  });

  socket.on('place_bet', ({ roomCode, type, selection }) => {
    const room = rooms.get((roomCode || '').toUpperCase());
    const player = getPlayerById(room, socket.id);
    if (!room || !player) return;
    handleBet(room, player, type, selection);
  });

  socket.on('play_card', ({ roomCode, cardId }) => {
    const room = rooms.get((roomCode || '').toUpperCase());
    const player = getPlayerById(room, socket.id);
    if (!room || !player) return;
    handlePlayCard(room, player, cardId, false);
  });

  socket.on('pass_turn', ({ roomCode, cardId }) => {
    const room = rooms.get((roomCode || '').toUpperCase());
    const player = getPlayerById(room, socket.id);
    if (!room || !player) return;
    handlePlayCard(room, player, cardId, true);
  });

  socket.on('next_race', ({ roomCode }) => {
    const room = rooms.get((roomCode || '').toUpperCase());
    if (!room || (room.phase !== 'settle' && room.phase !== 'draw')) return;
    if (room.hostId !== socket.id) return;

    const keepPot = room.phase === 'draw';
    nextDealer(room);
    startRace(room, keepPot);
    emitState(room);
  });

  socket.on('restart_game', ({ roomCode }) => {
    const room = rooms.get((roomCode || '').toUpperCase());
    if (!room) return;
    if (room.hostId !== socket.id) return;

    room.phase = 'lobby';
    room.game = null;
    room.log = [];
    emitState(room);
  });

  socket.on('disconnect', () => {
    handleDisconnect(socket);
    handleDuelDisconnect(socket);
  });
});

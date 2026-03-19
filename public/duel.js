const socket = typeof io !== 'undefined' ? io({
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 700,
  reconnectionDelayMax: 2800,
  timeout: 10000,
}) : null;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const p1NameEl = document.getElementById('p1Name');
const p2NameEl = document.getElementById('p2Name');
const p1ScoreEl = document.getElementById('p1Score');
const p2ScoreEl = document.getElementById('p2Score');
const p1SetMarksEl = document.getElementById('p1SetMarks');
const p2SetMarksEl = document.getElementById('p2SetMarks');
const p1BuffsEl = document.getElementById('p1Buffs');
const p2BuffsEl = document.getElementById('p2Buffs');
const timerEl = document.getElementById('timerText');
const roundEl = document.getElementById('roundText');
const statusEl = document.getElementById('statusText');
const setScoreTextEl = document.getElementById('setScoreText');

const stageCardsEl = document.getElementById('stageCards');
const p1CharCardsEl = document.getElementById('p1CharCards');
const p2CharCardsEl = document.getElementById('p2CharCards');

const modeLocalBtn = document.getElementById('modeLocalBtn');
const modeOnlineBtn = document.getElementById('modeOnlineBtn');
const modeSingleBtn = document.getElementById('modeSingleBtn');

const onlineControlsEl = document.getElementById('onlineControls');
const playerNameInputEl = document.getElementById('playerNameInput');
const npcCountSelectEl = document.getElementById('npcCountSelect');
const joinCodeInputEl = document.getElementById('joinCodeInput');
const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const leaveRoomBtn = document.getElementById('leaveRoomBtn');
const modeStatusEl = document.getElementById('modeStatus');
const campaignInfoEl = document.getElementById('campaignInfo');

const p2ChoiceBlockEl = document.getElementById('p2ChoiceBlock');
const p2CharTitleEl = document.getElementById('p2CharTitle');
const ruleTextEl = document.getElementById('ruleText');
const hintTextEl = document.getElementById('hintText');

const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const setupToggleBtn = document.getElementById('setupToggleBtn');
const focusBtn = document.getElementById('focusBtn');
const controlHintEl = document.getElementById('controlHint');
const arenaSetupPanelEl = document.getElementById('arenaSetupPanel');

const touchColP1 = document.getElementById('touchColP1');
const touchColP2 = document.getElementById('touchColP2');
const touchRowEl = document.getElementById('touchRow');
const padP1 = document.getElementById('padP1');
const padP2 = document.getElementById('padP2');
const knobP1 = document.getElementById('knobP1');
const knobP2 = document.getElementById('knobP2');
const itemBtnP1 = document.getElementById('itemBtnP1');
const itemBtnP2 = document.getElementById('itemBtnP2');
const quickItemBtn = document.getElementById('quickItemBtn');
const connectionBannerEl = document.getElementById('connectionBanner');

const CONFIG = {
  width: 900,
  height: 900,
  roundSeconds: 45,
  pointsToWin: 2,
  baseRadius: 24,
  baseAccel: 980,
  baseMaxSpeed: 390,
  roundInterval: 2,
  itemLife: 9,
  itemRadius: 20,
};

const PLAY_MODES = {
  local: 'local',
  online: 'online',
  single: 'single',
};

const ONLINE_PLAYER_ROLES = ['p1', 'p2', 'p3', 'p4'];
const ONLINE_GUEST_ROLES = ['p2', 'p3', 'p4'];
const SNAPSHOT_PLAYER_IDS = ['p1', 'p2', 'p3', 'p4', 'npcA', 'npcB'];

const CHARACTERS = [
  {
    id: 'blaze',
    name: 'ブレイズ',
    shape: 'shape-blaze',
    title: '爆炎アタッカー',
    attack: 5,
    defense: 2,
    size: 2,
    speed: 4,
    color: '#ff774f',
    accent: '#ffd09a',
  },
  {
    id: 'fort',
    name: 'フォート',
    shape: 'shape-fort',
    title: '鉄壁ディフェンダー',
    attack: 2,
    defense: 5,
    size: 5,
    speed: 2,
    color: '#5ea2ff',
    accent: '#c4ddff',
  },
  {
    id: 'swift',
    name: 'スイフト',
    shape: 'shape-swift',
    title: '高速ストライカー',
    attack: 3,
    defense: 2,
    size: 1,
    speed: 5,
    color: '#22d6a3',
    accent: '#b7ffe8',
  },
  {
    id: 'crusher',
    name: 'クラッシャー',
    shape: 'shape-crusher',
    title: '重量パワー型',
    attack: 4,
    defense: 4,
    size: 4,
    speed: 2,
    color: '#f6af46',
    accent: '#ffe1a8',
  },
  {
    id: 'balance',
    name: 'バランサー',
    shape: 'shape-balance',
    title: '万能オールラウンダー',
    attack: 3,
    defense: 3,
    size: 3,
    speed: 3,
    color: '#b682ff',
    accent: '#e7d4ff',
  },
];

const CHARACTER_BY_ID = new Map(CHARACTERS.map((char) => [char.id, char]));

const STAGES = [
  {
    id: 'neon',
    name: 'Neon Dome',
    desc: '標準バランスの円形ステージ',
    arenaRadius: 338,
    drag: 0.966,
    impactScale: 1,
    speedScale: 1,
    projectileScale: 1,
    itemSpawnMin: 2,
    itemSpawnMax: 4,
    bgTop: '#0c1c22',
    bgBottom: '#09131a',
    ringColor: 'rgba(180, 253, 240, 0.55)',
    glowColor: 'rgba(0, 220, 190, %A%)',
    miniClass: 'stage-mini--neon',
  },
  {
    id: 'glacier',
    name: 'Glacier Ring',
    desc: '滑りやすく高速。制御が難しい',
    arenaRadius: 323,
    drag: 0.984,
    impactScale: 1.06,
    speedScale: 1.06,
    projectileScale: 0.98,
    itemSpawnMin: 2.5,
    itemSpawnMax: 4.5,
    bgTop: '#0d1a2a',
    bgBottom: '#0a1220',
    ringColor: 'rgba(163, 214, 255, 0.62)',
    glowColor: 'rgba(89, 160, 255, %A%)',
    miniClass: 'stage-mini--glacier',
  },
  {
    id: 'magma',
    name: 'Magma Pit',
    desc: '重い手触り。弾き飛ばしが強い',
    arenaRadius: 353,
    drag: 0.948,
    impactScale: 1.15,
    speedScale: 0.93,
    projectileScale: 1.1,
    itemSpawnMin: 1.7,
    itemSpawnMax: 3.4,
    bgTop: '#2a1410',
    bgBottom: '#120a09',
    ringColor: 'rgba(255, 178, 120, 0.65)',
    glowColor: 'rgba(255, 112, 72, %A%)',
    miniClass: 'stage-mini--magma',
  },
];

const STAGE_BY_ID = new Map(STAGES.map((stage) => [stage.id, stage]));

const ITEM_TYPES = {
  power: { label: 'POW', color: '#ffb56b', duration: 7 },
  fire: { label: 'FIR', color: '#ff7b56', duration: 5 },
  ice: { label: 'ICE', color: '#8ed5ff', duration: 5 },
  missile: { label: 'MIS', color: '#ffd772' },
  bomb: { label: 'BOM', color: '#ff927d' },
};

const ITEM_KEYS = Object.keys(ITEM_TYPES);
const ITEM_ICONS = {
  power: '⚡',
  fire: '🔥',
  ice: '❄',
  missile: '🚀',
  bomb: '💣',
};

const CAMPAIGN_STAGES = [
  {
    id: 'stage1',
    title: 'Rookie Spin',
    stageId: 'neon',
    enemies: [
      {
        charId: 'swift',
        slot: 'CPU-ALFA',
        scale: { attack: 0.95, defense: 0.95, speed: 1.04, size: 0.98, mass: 0.96 },
        ai: { aggression: 0.9, edgeCare: 1.15, strafe: 0.35, jitter: 0.45 },
      },
    ],
  },
  {
    id: 'stage2',
    title: 'Cold Sprint',
    stageId: 'glacier',
    enemies: [
      {
        charId: 'blaze',
        slot: 'CPU-BLAZE',
        scale: { attack: 1.08, defense: 1.0, speed: 1.06, size: 1.0, mass: 1.02 },
        ai: { aggression: 1.05, edgeCare: 1.08, strafe: 0.5, jitter: 0.38 },
      },
    ],
  },
  {
    id: 'stage3',
    title: 'Molten Wall',
    stageId: 'magma',
    enemies: [
      {
        charId: 'fort',
        slot: 'CPU-FORT',
        scale: { attack: 1.14, defense: 1.16, speed: 1.03, size: 1.03, mass: 1.15 },
        ai: { aggression: 1.05, edgeCare: 1.2, strafe: 0.32, jitter: 0.28 },
      },
    ],
  },
  {
    id: 'stage4',
    title: 'Twin Strike',
    stageId: 'neon',
    enemies: [
      {
        charId: 'swift',
        slot: 'CPU-RUSH',
        scale: { attack: 1.06, defense: 1.04, speed: 1.15, size: 0.96, mass: 0.96 },
        ai: { aggression: 1.06, edgeCare: 1.08, strafe: 0.65, jitter: 0.55 },
      },
      {
        charId: 'balance',
        slot: 'CPU-CORE',
        scale: { attack: 1.08, defense: 1.1, speed: 1.08, size: 1.0, mass: 1.06 },
        ai: { aggression: 1.0, edgeCare: 1.18, strafe: 0.38, jitter: 0.32 },
      },
    ],
  },
  {
    id: 'stage5',
    title: 'Glacier Boss',
    stageId: 'glacier',
    enemies: [
      {
        charId: 'crusher',
        slot: 'CPU-TITAN',
        scale: { attack: 1.24, defense: 1.2, speed: 1.08, size: 1.06, mass: 1.22 },
        ai: { aggression: 1.22, edgeCare: 1.14, strafe: 0.42, jitter: 0.25 },
      },
    ],
  },
  {
    id: 'stage6',
    title: 'Magma Overdrive',
    stageId: 'magma',
    enemies: [
      {
        charId: 'blaze',
        slot: 'CPU-OMEGA',
        scale: { attack: 1.3, defense: 1.24, speed: 1.16, size: 1.02, mass: 1.18 },
        ai: { aggression: 1.28, edgeCare: 1.2, strafe: 0.58, jitter: 0.38 },
      },
    ],
  },
  {
    id: 'stage7',
    title: 'Final Duo',
    stageId: 'neon',
    enemies: [
      {
        charId: 'fort',
        slot: 'CPU-GUARD',
        scale: { attack: 1.26, defense: 1.35, speed: 1.12, size: 1.08, mass: 1.3 },
        ai: { aggression: 1.2, edgeCare: 1.26, strafe: 0.38, jitter: 0.2 },
      },
      {
        charId: 'blaze',
        slot: 'CPU-FLARE',
        scale: { attack: 1.34, defense: 1.2, speed: 1.2, size: 1.0, mass: 1.15 },
        ai: { aggression: 1.35, edgeCare: 1.15, strafe: 0.7, jitter: 0.44 },
      },
    ],
  },
];

const center = {
  x: CONFIG.width * 0.5,
  y: CONFIG.height * 0.5,
};

const heldKeys = new Set();

const touchState = {
  p1: { active: false, pointerId: null, x: 0, y: 0 },
  p2: { active: false, pointerId: null, x: 0, y: 0 },
};

function emptyOnlinePlayers() {
  return {
    p1: null,
    p2: null,
    p3: null,
    p4: null,
  };
}

function emptyRemoteInputs() {
  return {
    p2: { x: 0, y: 0, len: 0 },
    p3: { x: 0, y: 0, len: 0 },
    p4: { x: 0, y: 0, len: 0 },
  };
}

const online = {
  enabled: false,
  isHost: false,
  role: 'local',
  roomCode: null,
  peerReady: false,
  npcCount: 0,
  players: emptyOnlinePlayers(),
  remoteInputs: emptyRemoteInputs(),
  sendTimer: 0,
  snapshotTimer: 0,
};

const reconnectSession = {
  active: false,
  roomCode: null,
  wasHost: false,
  npcCount: 0,
  name: '',
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function sanitizeInput(input) {
  return {
    x: clamp(Number(input?.x) || 0, -1, 1),
    y: clamp(Number(input?.y) || 0, -1, 1),
    len: clamp(Number(input?.len) || 0, 0, 1),
  };
}

function sanitizeNpcCount(value) {
  return clamp(Number(value) || 0, 0, 2);
}

function createPlayer({ id, slot, team, controls = null, isBot = false }) {
  return {
    id,
    slot,
    team,
    controls,
    isBot,
    charId: 'balance',
    char: CHARACTER_BY_ID.get('balance'),
    color: '#ffffff',
    accent: '#cccccc',
    attackMul: 1,
    defenseMul: 1,
    speedMul: 1,
    baseRadius: CONFIG.baseRadius,
    massBase: 1,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: CONFIG.baseRadius,
    spinAngle: 0,
    freezeTimer: 0,
    freezeImmuneTimer: 0,
    aimX: 1,
    aimY: 0,
    cooldownFire: 0,
    cooldownIce: 0,
    ai: {
      aggression: 1,
      edgeCare: 1,
      strafe: 0.3,
      jitter: 0.3,
    },
    buffs: {
      power: 0,
      fire: 0,
      ice: 0,
    },
    consumables: {
      missile: 0,
      bomb: 0,
    },
    selectedConsumable: null,
  };
}

const roster = {
  p1: createPlayer({
    id: 'p1',
    slot: 'P1',
    team: 'left',
    controls: { left: 'KeyA', right: 'KeyD', up: 'KeyW', down: 'KeyS' },
  }),
  p2: createPlayer({
    id: 'p2',
    slot: 'P2',
    team: 'right',
    controls: { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown' },
  }),
  p3: createPlayer({
    id: 'p3',
    slot: 'P3',
    team: 'right',
  }),
  p4: createPlayer({
    id: 'p4',
    slot: 'P4',
    team: 'right',
  }),
  npcA: createPlayer({
    id: 'npcA',
    slot: 'CPU-1',
    team: 'right',
    isBot: true,
  }),
  npcB: createPlayer({
    id: 'npcB',
    slot: 'CPU-2',
    team: 'right',
    isBot: true,
  }),
};

const state = {
  playMode: PLAY_MODES.local,
  phase: 'idle',
  round: 1,
  timer: CONFIG.roundSeconds,
  betweenTimer: 0,
  stageId: 'neon',
  stage: STAGE_BY_ID.get('neon'),
  ringPulse: 0,
  status: 'Startで開始',
  scoreLeft: 0,
  scoreRight: 0,
  activePlayers: [roster.p1, roster.p2],
  activePlayerIds: ['p1', 'p2'],
  itemTimer: 3,
  item: null,
  bullets: [],
  bombs: [],
  particles: [],
  sparks: [],
  impactRings: [],
  shakeTime: 0,
  shakePower: 0,
  lastCollisionSfxAt: 0,
  selection: {
    stageId: 'neon',
    p1: 'blaze',
    p2: 'fort',
    p3: 'swift',
    p4: 'crusher',
  },
  single: {
    stageIndex: 0,
    campaignComplete: false,
  },
};

const audio = {
  ctx: null,
  master: null,
  bgmTimer: null,
  bgmStep: 0,
};

const uiState = {
  focusMode: false,
  activeItemSlot: null,
  setupPanelOpen: false,
};

function isSingleMode() {
  return state.playMode === PLAY_MODES.single;
}

function isOnlineMode() {
  return state.playMode === PLAY_MODES.online;
}

function setStatus(text) {
  state.status = text;
  statusEl.textContent = text;
}

function setModeStatus(text) {
  modeStatusEl.textContent = text;
}

function setArenaSetupOpen(open) {
  const next = Boolean(open);
  uiState.setupPanelOpen = next;
  if (arenaSetupPanelEl) {
    arenaSetupPanelEl.classList.toggle('is-hidden', !next);
  }
  if (setupToggleBtn) {
    setupToggleBtn.textContent = next ? 'Close Select' : 'Select';
  }
}

function showConnectionBanner(text, onlineTone = false, pulsing = false) {
  if (!connectionBannerEl) return;
  connectionBannerEl.textContent = text;
  connectionBannerEl.classList.remove('is-hidden');
  connectionBannerEl.classList.toggle('is-online', onlineTone);
  connectionBannerEl.classList.toggle('is-pulsing', pulsing);
}

function hideConnectionBanner() {
  if (!connectionBannerEl) return;
  connectionBannerEl.classList.add('is-hidden');
  connectionBannerEl.classList.remove('is-online');
  connectionBannerEl.classList.remove('is-pulsing');
  connectionBannerEl.textContent = '';
}

function clearReconnectSession() {
  reconnectSession.active = false;
  reconnectSession.roomCode = null;
  reconnectSession.wasHost = false;
  reconnectSession.npcCount = 0;
  reconnectSession.name = '';
}

function rememberReconnectSession() {
  if (!online.enabled || !online.roomCode) return;
  reconnectSession.active = true;
  reconnectSession.roomCode = online.roomCode;
  reconnectSession.wasHost = online.isHost;
  reconnectSession.npcCount = online.npcCount;
  reconnectSession.name = getPlayerName();
}

function tryResumeReconnectSession() {
  if (!socket || !socket.connected) return;
  if (!reconnectSession.active || !reconnectSession.roomCode) return;

  if (reconnectSession.wasHost) {
    socket.emit('duel_create_room', {
      name: reconnectSession.name || getPlayerName(),
      roomCode: reconnectSession.roomCode,
      npcCount: sanitizeNpcCount(reconnectSession.npcCount),
    });
    setModeStatus(`再接続中... ルーム ${reconnectSession.roomCode} を復元しています`);
  } else {
    socket.emit('duel_join_room', {
      name: reconnectSession.name || getPlayerName(),
      roomCode: reconnectSession.roomCode,
    });
    setModeStatus(`再接続中... ルーム ${reconnectSession.roomCode} に再参加しています`);
  }

  showConnectionBanner('通信が切断されました。再接続してルーム復旧中...', false, true);
}

function getPlayerName() {
  return (playerNameInputEl.value || '').trim().slice(0, 16) || 'Player';
}

function getCampaignStage() {
  return CAMPAIGN_STAGES[clamp(state.single.stageIndex, 0, CAMPAIGN_STAGES.length - 1)];
}

function isOnlineHumanRole(role) {
  return ONLINE_PLAYER_ROLES.includes(role);
}

function getOnlineOwnRole() {
  return isOnlineHumanRole(online.role) ? online.role : 'p2';
}

function getSecondaryControlRole() {
  if (isOnlineMode() && online.enabled && !online.isHost) {
    return getOnlineOwnRole();
  }
  return 'p2';
}

function getSelectionRoleByIndex(index) {
  if (index === 0) return 'p1';
  if (isSingleMode()) return null;
  if (isOnlineMode() && online.enabled && !online.isHost) {
    return getOnlineOwnRole();
  }
  return 'p2';
}

function getOnlineRemoteRoles() {
  return ONLINE_GUEST_ROLES.filter((role) => Boolean(online.players[role]));
}

function hasOnlineRemotePlayers() {
  return getOnlineRemoteRoles().length > 0;
}

function applyOnlineRoomState(payload) {
  if (!payload) return;

  online.peerReady = Boolean(payload.ready);
  online.npcCount = sanitizeNpcCount(payload.npcCount);
  if (npcCountSelectEl) {
    npcCountSelectEl.value = String(online.npcCount);
  }

  const nextPlayers = emptyOnlinePlayers();
  const payloadPlayers = payload.players || {};
  ONLINE_PLAYER_ROLES.forEach((role) => {
    const name = payloadPlayers[role];
    nextPlayers[role] = name ? String(name).slice(0, 16) : null;
  });
  online.players = nextPlayers;

  ONLINE_GUEST_ROLES.forEach((role) => {
    if (!online.players[role]) {
      online.remoteInputs[role] = { x: 0, y: 0, len: 0 };
    }
  });
}

function getOnlineEnemyCount() {
  const humanEnemies = getOnlineRemoteRoles().length;
  return humanEnemies + online.npcCount;
}

function applyCharacter(player, charId) {
  const picked = CHARACTER_BY_ID.get(charId) || CHARACTERS[0];
  player.charId = picked.id;
  player.char = picked;
  player.color = picked.color;
  player.accent = picked.accent;
  player.attackMul = 0.6 + picked.attack * 0.2;
  player.defenseMul = 0.96 + picked.defense * 0.012;
  player.speedMul = 0.68 + picked.speed * 0.16;
  player.baseRadius = CONFIG.baseRadius + picked.size * 2.1;
  player.massBase = 0.98 + picked.size * 0.045 + picked.defense * 0.002;
  player.radius = player.baseRadius;
}

function applyEnemyTuning(player, enemyConfig, index) {
  applyCharacter(player, enemyConfig.charId);

  const scale = enemyConfig.scale || {};
  player.attackMul *= scale.attack ?? 1;
  player.defenseMul *= scale.defense ?? 1;
  player.speedMul *= scale.speed ?? 1;
  player.baseRadius *= scale.size ?? 1;
  player.massBase *= scale.mass ?? 1;
  player.radius = player.baseRadius;

  player.ai = {
    aggression: enemyConfig.ai?.aggression ?? 1,
    edgeCare: enemyConfig.ai?.edgeCare ?? 1,
    strafe: enemyConfig.ai?.strafe ?? 0.3,
    jitter: enemyConfig.ai?.jitter ?? 0.3,
  };

  player.slot = enemyConfig.slot || `CPU-${index + 1}`;
}

function applyStage(stageId) {
  const next = STAGE_BY_ID.get(stageId) || STAGE_BY_ID.get('neon');
  state.stageId = next.id;
  state.stage = next;
  state.itemTimer = randomRange(next.itemSpawnMin, next.itemSpawnMax);
  audio.bgmStep = 0;
}

function canEditStageSelection() {
  if (isSingleMode()) return false;
  if (!isOnlineMode()) return true;
  if (!online.enabled) return true;
  return online.isHost;
}

function canEditCharacter(index) {
  if (isSingleMode() && index === 1) return false;
  if (!isOnlineMode()) return true;
  if (!online.enabled) return index === 0;
  if (online.isHost) return index === 0;
  return index === 1;
}

function isSelectionLockedForUser(index, isStage = false) {
  if (isStage) return !canEditStageSelection();
  return !canEditCharacter(index);
}

function selectCharacter(index, charId, byUser = false) {
  if (byUser && isSelectionLockedForUser(index, false)) return;

  const role = getSelectionRoleByIndex(index);
  if (!role || !roster[role]) return;

  state.selection[role] = charId;
  applyCharacter(roster[role], charId);

  refreshSelectionUi();

  if (
    byUser
    && isOnlineMode()
    && online.enabled
    && !online.isHost
    && index === 1
    && socket
  ) {
    setArenaSetupOpen(false);
    socket.emit('duel_select', {
      type: 'player_char',
      value: charId,
    });
    setModeStatus(`${role.toUpperCase()}を ${roster[role].char.name} に設定（ホストへ同期中）`);
    return;
  }

  if (byUser) {
    setArenaSetupOpen(false);
    resetMatch(true);
    emitSnapshotNow();
  }
}

function selectStage(stageId, byUser = false) {
  if (byUser && isSelectionLockedForUser(0, true)) return;

  state.selection.stageId = stageId;
  applyStage(stageId);
  refreshSelectionUi();

  if (byUser) {
    setArenaSetupOpen(false);
    resetMatch(true);
    emitSnapshotNow();
  }
}

function buildStatBars(character) {
  const stats = [
    ['ATK', character.attack],
    ['DEF', character.defense],
    ['SIZE', character.size],
    ['SPD', character.speed],
  ];

  return stats.map(([label, value]) => {
    const width = (value / 5) * 100;
    return `<div class="stat-row"><span>${label}</span><div class="stat-bar"><i style="width:${width}%"></i></div></div>`;
  }).join('');
}

function renderStageCards() {
  stageCardsEl.innerHTML = '';
  STAGES.forEach((stage) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'choice-card stage-card';
    card.dataset.stageId = stage.id;

    card.innerHTML = `
      <p class="stage-name">${stage.name}</p>
      <div class="stage-mini ${stage.miniClass}"></div>
      <p class="stage-desc">${stage.desc}</p>
    `;

    card.addEventListener('click', () => selectStage(stage.id, true));
    stageCardsEl.appendChild(card);
  });
}

function renderCharacterCards(container, playerIndex) {
  container.innerHTML = '';

  CHARACTERS.forEach((character) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'choice-card char-card';
    card.dataset.charId = character.id;
    card.dataset.playerIndex = String(playerIndex);
    card.style.setProperty('--main', character.color);
    card.style.setProperty('--accent', character.accent);

    card.innerHTML = `
      <div class="char-top">
        <div class="char-token ${character.shape}"></div>
        <div>
          <p class="char-name">${character.name}</p>
          <p class="char-sub">${character.title}</p>
        </div>
      </div>
      <div class="stats">${buildStatBars(character)}</div>
    `;

    card.addEventListener('click', () => selectCharacter(playerIndex, character.id, true));
    container.appendChild(card);
  });
}

function getEnemyRosterFromCampaign() {
  if (!isSingleMode()) return [roster.p2];
  const stage = getCampaignStage();
  if (!stage) return [roster.npcA];
  return stage.enemies.length > 1 ? [roster.npcA, roster.npcB] : [roster.npcA];
}

function syncNamePlates() {
  const p1 = roster.p1;
  p1NameEl.textContent = `${isSingleMode() ? 'YOU' : 'P1'} | ${p1.char.name}`;

  if (isSingleMode()) {
    const enemies = getEnemyRosterFromCampaign();
    if (enemies.length > 1) {
      p2NameEl.textContent = 'ENEMY TEAM';
    } else {
      const enemy = enemies[0] || roster.npcA;
      p2NameEl.textContent = `${enemy.slot} | ${enemy.char.name}`;
    }
    return;
  }

  if (isOnlineMode() && online.enabled) {
    const enemyCount = getOnlineEnemyCount();
    const humanRoles = getOnlineRemoteRoles();
    if (enemyCount > 1) {
      p2NameEl.textContent = `ENEMY TEAM x${enemyCount}`;
    } else if (humanRoles.length === 1) {
      const enemy = roster[humanRoles[0]] || roster.p2;
      p2NameEl.textContent = `${enemy.slot} | ${enemy.char.name}`;
    } else if (online.npcCount > 0) {
      p2NameEl.textContent = `${roster.npcA.slot} | ${roster.npcA.char.name}`;
    } else {
      p2NameEl.textContent = `${roster.p2.slot} | ${roster.p2.char.name}`;
    }
  } else {
    p2NameEl.textContent = `${roster.p2.slot} | ${roster.p2.char.name}`;
  }
}

function refreshSelectionUi() {
  modeLocalBtn.classList.toggle('is-active', state.playMode === PLAY_MODES.local);
  modeOnlineBtn.classList.toggle('is-active', state.playMode === PLAY_MODES.online);
  modeSingleBtn.classList.toggle('is-active', state.playMode === PLAY_MODES.single);

  onlineControlsEl.classList.toggle('is-hidden', !isOnlineMode());
  p2ChoiceBlockEl.classList.toggle('is-hidden', isSingleMode());

  document.querySelectorAll('[data-stage-id]').forEach((card) => {
    card.classList.toggle('is-selected', card.dataset.stageId === state.stageId);
    card.disabled = !canEditStageSelection();
  });

  document.querySelectorAll('[data-char-id]').forEach((card) => {
    const index = Number(card.dataset.playerIndex);
    const role = getSelectionRoleByIndex(index);
    const selectedChar = role ? state.selection[role] : null;
    card.classList.toggle('is-selected', card.dataset.charId === selectedChar);
    card.disabled = !canEditCharacter(index);
  });

  if (p2CharTitleEl) {
    if (isSingleMode()) {
      p2CharTitleEl.textContent = 'ENEMY CHARACTER';
    } else if (isOnlineMode()) {
      if (online.enabled && !online.isHost) {
        p2CharTitleEl.textContent = `${getOnlineOwnRole().toUpperCase()} CHARACTER`;
      } else {
        p2CharTitleEl.textContent = 'GUEST CHARACTER';
      }
    } else {
      p2CharTitleEl.textContent = 'P2 CHARACTER';
    }
  }

  if (npcCountSelectEl) {
    const canEditNpc = isOnlineMode() && (!online.enabled || online.isHost);
    npcCountSelectEl.disabled = !canEditNpc;
  }

  syncNamePlates();
}

function resetOnlineState() {
  online.enabled = false;
  online.isHost = false;
  online.role = 'local';
  online.roomCode = null;
  online.peerReady = false;
  online.npcCount = sanitizeNpcCount(npcCountSelectEl ? npcCountSelectEl.value : 0);
  online.players = emptyOnlinePlayers();
  online.remoteInputs = emptyRemoteInputs();
  online.sendTimer = 0;
  online.snapshotTimer = 0;
}

function leaveOnlineRoom() {
  if (socket && online.enabled) {
    socket.emit('duel_leave_room');
  }
  clearReconnectSession();
  hideConnectionBanner();
  resetOnlineState();
}

function setActivePlayers(ids) {
  state.activePlayerIds = ids.slice();
  state.activePlayers = ids.map((id) => roster[id]).filter(Boolean);
}

function configureSingleEnemies() {
  const stage = getCampaignStage();
  if (!stage) return;

  const enemyA = stage.enemies[0];
  const enemyB = stage.enemies[1];

  if (enemyA) applyEnemyTuning(roster.npcA, enemyA, 0);
  if (enemyB) applyEnemyTuning(roster.npcB, enemyB, 1);

  if (!enemyB) {
    roster.npcB.slot = 'CPU-2';
    roster.npcB.ai = {
      aggression: 1,
      edgeCare: 1,
      strafe: 0.3,
      jitter: 0.3,
    };
  }

  if (enemyB) {
    setActivePlayers(['p1', 'npcA', 'npcB']);
  } else {
    setActivePlayers(['p1', 'npcA']);
  }
}

function configureOnlineLineup() {
  roster.p1.slot = 'P1';
  roster.p1.team = 'left';
  applyCharacter(roster.p1, state.selection.p1);

  const activeIds = ['p1'];

  ONLINE_GUEST_ROLES.forEach((role) => {
    const player = roster[role];
    if (!player) return;
    if (!online.players[role]) return;

    player.isBot = false;
    player.team = 'right';
    player.slot = role.toUpperCase();
    applyCharacter(player, state.selection[role] || 'balance');
    activeIds.push(role);
  });

  const onlineNpcPresets = [
    {
      player: roster.npcA,
      charId: 'balance',
      slot: 'CPU-1',
      ai: { aggression: 1.04, edgeCare: 1.1, strafe: 0.35, jitter: 0.32 },
    },
    {
      player: roster.npcB,
      charId: 'swift',
      slot: 'CPU-2',
      ai: { aggression: 1.1, edgeCare: 1.08, strafe: 0.56, jitter: 0.44 },
    },
  ];

  for (let i = 0; i < online.npcCount; i += 1) {
    const preset = onlineNpcPresets[i];
    if (!preset) break;
    const player = preset.player;
    player.isBot = true;
    player.team = 'right';
    player.slot = preset.slot;
    player.ai = { ...preset.ai };
    applyCharacter(player, preset.charId);
    activeIds.push(player.id);
  }

  setActivePlayers(activeIds);
}

function configureLineupForMode() {
  applyCharacter(roster.p1, state.selection.p1);

  if (isSingleMode()) {
    configureSingleEnemies();
    return;
  }

  if (isOnlineMode() && online.enabled) {
    configureOnlineLineup();
    return;
  }

  roster.p2.slot = 'P2';
  roster.p2.team = 'right';
  roster.p2.isBot = false;
  applyCharacter(roster.p2, state.selection.p2);
  setActivePlayers(['p1', 'p2']);
}

function setCampaignInfoText() {
  if (!isSingleMode()) {
    campaignInfoEl.textContent = '-';
    return;
  }

  const stage = getCampaignStage();
  if (!stage) {
    campaignInfoEl.textContent = '-';
    return;
  }

  const enemyNames = stage.enemies.map((enemy) => {
    const char = CHARACTER_BY_ID.get(enemy.charId);
    return `${enemy.slot}(${char ? char.name : enemy.charId})`;
  }).join(' / ');

  campaignInfoEl.textContent = `STAGE ${state.single.stageIndex + 1}/${CAMPAIGN_STAGES.length} | ${stage.title} | ENEMY: ${enemyNames}`;
}

function getModeLabel() {
  if (state.playMode === PLAY_MODES.single) return 'SINGLE';
  if (state.playMode === PLAY_MODES.online) return 'ONLINE';
  return 'LOCAL';
}

function updateRuleText() {
  if (isSingleMode()) {
    ruleTextEl.innerHTML = `全${CAMPAIGN_STAGES.length}ステージ | 各対戦 <strong>${CONFIG.pointsToWin}本先取</strong>`;
    return;
  }

  ruleTextEl.innerHTML = `先に <strong>${CONFIG.pointsToWin}本</strong> 先取で勝ち`;
}

function updateHintText() {
  if (isSingleMode()) {
    hintTextEl.textContent = 'PC操作: YOU = WASD / QでITEM | Focusで全画面寄り';
    return;
  }

  if (isOnlineMode()) {
    hintTextEl.textContent = 'PC操作: ONLINEは自分の枠のみ操作（移動＋ITEM） | Focusで全画面寄り';
    return;
  }

  hintTextEl.textContent = 'PC操作: P1 = WASD+Q / P2 = 矢印+/ | Focusで全画面寄り';
}

function setFocusMode(enabled) {
  uiState.focusMode = Boolean(enabled);
  document.body.classList.toggle('focus-mode', uiState.focusMode);
  focusBtn.textContent = uiState.focusMode ? 'Exit' : 'Focus';
}

function updateControlUi() {
  if (isSingleMode()) {
    touchColP1.classList.remove('is-hidden');
    touchColP2.classList.add('is-hidden');
    touchRowEl.classList.add('one-handed');
    touchColP1.classList.add('is-active');
    touchColP2.classList.remove('is-active');
    uiState.activeItemSlot = 'p1';
    controlHintEl.textContent = 'SINGLE | スティックのみで移動。敵をリングアウト';
    startBtn.disabled = false;
    resetBtn.disabled = false;
    updateItemButtons();
    return;
  }

  if (!isOnlineMode()) {
    touchColP1.classList.remove('is-hidden');
    touchColP2.classList.remove('is-hidden');
    touchRowEl.classList.remove('one-handed');
    touchColP1.classList.remove('is-active');
    touchColP2.classList.remove('is-active');
    uiState.activeItemSlot = null;
    controlHintEl.textContent = 'LOCAL 2P | 操作はスティックのみ。倒した方向へ移動';
    startBtn.disabled = false;
    resetBtn.disabled = false;
    updateItemButtons();
    return;
  }

  if (!online.enabled) {
    touchColP1.classList.remove('is-hidden');
    touchColP2.classList.add('is-hidden');
    touchRowEl.classList.add('one-handed');
    touchColP1.classList.add('is-active');
    touchColP2.classList.remove('is-active');
    uiState.activeItemSlot = 'p1';
    controlHintEl.textContent = 'ONLINE | ルーム作成または参加してください';
    startBtn.disabled = true;
    resetBtn.disabled = false;
    updateItemButtons();
    return;
  }

  if (online.isHost) {
    touchColP1.classList.remove('is-hidden');
    touchColP2.classList.add('is-hidden');
    touchRowEl.classList.add('one-handed');
    touchColP1.classList.add('is-active');
    touchColP2.classList.remove('is-active');
    uiState.activeItemSlot = 'p1';
    controlHintEl.textContent = `ONLINE HOST | ROOM: ${online.roomCode} | ENEMY ${getOnlineEnemyCount()}体`;
    startBtn.disabled = !online.peerReady;
    resetBtn.disabled = false;
  } else {
    touchColP1.classList.add('is-hidden');
    touchColP2.classList.remove('is-hidden');
    touchRowEl.classList.add('one-handed');
    touchColP1.classList.remove('is-active');
    touchColP2.classList.add('is-active');
    uiState.activeItemSlot = getOnlineOwnRole();
    controlHintEl.textContent = `ONLINE ${getOnlineOwnRole().toUpperCase()} | ROOM: ${online.roomCode} | ホストの開始待ち`;
    startBtn.disabled = true;
    resetBtn.disabled = true;
  }

  updateItemButtons();
}

function triggerItemUse(slotId) {
  if (state.phase !== 'playing') return false;

  if (!roster[slotId]) return false;

  if (isOnlineMode()) {
    if (!online.enabled) return false;

    if (online.isHost) {
      if (slotId !== 'p1') return false;
      const used = useSelectedConsumable(roster.p1);
      if (used) emitSnapshotNow();
      return used;
    }

    if (slotId !== getOnlineOwnRole()) return false;
    if (getTotalConsumables(roster[slotId]) <= 0) return false;
    if (socket) {
      socket.emit('duel_use_item');
      setStatus(`${slotId.toUpperCase()} ITEM使用を送信`);
      return true;
    }
    return false;
  }

  return useSelectedConsumable(roster[slotId]);
}

function updateStartButtonLabel() {
  if (state.phase === 'playing') {
    startBtn.textContent = isSingleMode() ? 'Retry Stage' : 'Rematch';
    return;
  }

  if (isSingleMode() && state.single.campaignComplete) {
    startBtn.textContent = 'Restart Campaign';
    return;
  }

  if (state.phase === 'match_over') {
    startBtn.textContent = isSingleMode() ? 'Retry Stage' : 'Rematch';
    return;
  }

  startBtn.textContent = 'Start';
}

function switchMode(nextMode, initial = false) {
  if (!Object.values(PLAY_MODES).includes(nextMode)) return;

  const previousMode = state.playMode;
  if (previousMode === PLAY_MODES.online && !initial) {
    leaveOnlineRoom();
  }

  state.playMode = nextMode;
  state.single.campaignComplete = false;
  setArenaSetupOpen(false);

  if (nextMode === PLAY_MODES.local) {
    clearReconnectSession();
    hideConnectionBanner();
    applyStage(state.selection.stageId);
    setModeStatus('ローカル2人対戦モード');
    campaignInfoEl.textContent = '-';
  }

  if (nextMode === PLAY_MODES.online) {
    resetOnlineState();
    applyStage(state.selection.stageId);
    setModeStatus('オンライン待機中 | ルームを作成 or 参加');
    campaignInfoEl.textContent = '友達の端末とルームコードで対戦';
  }

  if (nextMode === PLAY_MODES.single) {
    clearReconnectSession();
    hideConnectionBanner();
    state.single.stageIndex = 0;
    const stage = getCampaignStage();
    applyStage(stage.stageId);
    setModeStatus('1人プレイキャンペーン | 全7ステージ');
    setCampaignInfoText();
  }

  updateRuleText();
  updateHintText();
  resetMatch(true);
  refreshSelectionUi();
  updateControlUi();

  resetStick(touchState.p1, knobP1);
  resetStick(touchState.p2, knobP2);
}

function resetPlayer(player, x, y) {
  player.x = x;
  player.y = y;
  player.vx = 0;
  player.vy = 0;
  player.spinAngle = Math.random() * Math.PI * 2;
  player.freezeTimer = 0;
  player.freezeImmuneTimer = 0;
  player.aimX = player.team === 'left' ? 1 : -1;
  player.aimY = 0;
  player.cooldownFire = 0;
  player.cooldownIce = 0;
  player.radius = player.baseRadius;

  Object.keys(player.buffs).forEach((key) => {
    player.buffs[key] = 0;
  });

  Object.keys(player.consumables).forEach((key) => {
    player.consumables[key] = 0;
  });
  player.selectedConsumable = null;
}

function placeTeam(teamPlayers, side) {
  if (teamPlayers.length === 0) return;

  const x = side === 'left' ? center.x - 190 : center.x + 190;
  const spread = teamPlayers.length > 1 ? 125 : 0;
  teamPlayers.forEach((player, index) => {
    const offset = index - (teamPlayers.length - 1) / 2;
    const y = center.y + offset * spread;
    resetPlayer(player, x, y);
  });
}

function resetRound() {
  configureLineupForMode();

  const leftTeam = state.activePlayers.filter((player) => player.team === 'left');
  const rightTeam = state.activePlayers.filter((player) => player.team === 'right');

  placeTeam(leftTeam, 'left');
  placeTeam(rightTeam, 'right');

  state.timer = CONFIG.roundSeconds;
  state.item = null;
  state.bullets = [];
  state.bombs = [];
  state.particles = [];
  state.sparks = [];
  state.impactRings = [];
  state.shakeTime = 0;
  state.shakePower = 0;
  state.itemTimer = randomRange(state.stage.itemSpawnMin, state.stage.itemSpawnMax);
}

function resetScoresAndRound() {
  state.scoreLeft = 0;
  state.scoreRight = 0;
  state.round = 1;
}

function resetMatch(idle) {
  if (isSingleMode()) {
    const stage = getCampaignStage();
    applyStage(stage.stageId);
    setCampaignInfoText();
  } else {
    applyStage(state.selection.stageId);
  }

  resetScoresAndRound();
  resetRound();

  if (idle) {
    state.phase = 'idle';
    if (isSingleMode()) {
      setStatus(`STAGE ${state.single.stageIndex + 1} | Startで開始`);
    } else if (isOnlineMode() && !online.enabled) {
      setStatus('オンライン接続後に開始できます');
    } else {
      setStatus('Startで開始');
    }
  } else {
    state.phase = 'playing';
    if (isSingleMode()) {
      setStatus(`STAGE ${state.single.stageIndex + 1} 開始!`);
    } else {
      setStatus('ぶつかって相手をリング外へ');
    }
    playSfx('start');
  }

  updateStartButtonLabel();
  updateHud();
}

function startMatch() {
  if (isOnlineMode()) {
    if (!online.enabled) {
      setStatus('先にルーム作成/参加してください');
      return;
    }

    if (online.isHost && !online.peerReady) {
      setStatus('相手の参加待ち');
      return;
    }

    if (!online.isHost) {
      setStatus('ホストの開始待ち');
      return;
    }
  }

  if (isSingleMode() && state.single.campaignComplete) {
    state.single.stageIndex = 0;
    state.single.campaignComplete = false;
  }

  resetMatch(false);
  emitSnapshotNow();
}

function nextRound() {
  state.round += 1;
  resetRound();
  state.phase = 'playing';
  setStatus('次ラウンド開始');
  playSfx('start');
  updateStartButtonLabel();
  emitSnapshotNow();
}

function handleSingleMatchResult(heroWon) {
  if (heroWon) {
    playSfx('win');
    if (state.single.stageIndex >= CAMPAIGN_STAGES.length - 1) {
      state.single.campaignComplete = true;
      state.phase = 'match_over';
      setStatus('CAMPAIGN CLEAR! 全ステージ制覇!');
      updateStartButtonLabel();
      updateHud();
      return;
    }

    const clearedStage = state.single.stageIndex + 1;
    state.single.stageIndex += 1;
    const nextStage = getCampaignStage();
    applyStage(nextStage.stageId);
    resetScoresAndRound();
    resetRound();
    state.phase = 'idle';
    setCampaignInfoText();
    setStatus(`STAGE ${clearedStage} CLEAR! Startで次のステージへ`);
    updateStartButtonLabel();
    updateHud();
    return;
  }

  state.phase = 'match_over';
  const stageNo = state.single.stageIndex + 1;
  setStatus(`STAGE ${stageNo} 敗北... Retryで再挑戦`);
  updateStartButtonLabel();
  updateHud();
}

function getRightTeamLabel() {
  if (isSingleMode()) return 'ENEMY';
  const hasExtraRight = state.activePlayers.some((player) => player.team === 'right' && player.id !== 'p2');
  return hasExtraRight ? 'ENEMY' : 'P2';
}

function endRound(winnerTeam, reason) {
  if (state.phase !== 'playing') return;

  if (winnerTeam === 'left') {
    state.scoreLeft += 1;
    setStatus(reason || 'LEFTポイント!');
  } else if (winnerTeam === 'right') {
    state.scoreRight += 1;
    setStatus(reason || 'RIGHTポイント!');
  } else {
    setStatus(reason || '引き分け');
  }

  playSfx('ringout');

  const hasWinner = state.scoreLeft >= CONFIG.pointsToWin || state.scoreRight >= CONFIG.pointsToWin;
  if (!hasWinner) {
    state.phase = 'round_over';
    state.betweenTimer = CONFIG.roundInterval;
    updateStartButtonLabel();
    updateHud();
    emitSnapshotNow();
    return;
  }

  if (isSingleMode()) {
    handleSingleMatchResult(state.scoreLeft > state.scoreRight);
    emitSnapshotNow();
    return;
  }

  state.phase = 'match_over';
  const champTeam = state.scoreLeft > state.scoreRight ? 'left' : 'right';
  setStatus(`${champTeam === 'left' ? 'P1' : getRightTeamLabel()} WIN! Rematchで再戦`);
  playSfx('win');
  updateStartButtonLabel();
  updateHud();
  emitSnapshotNow();
}

function getBuffAmount(player, key) {
  return player.buffs[key] > 0 ? 1 : 0;
}

function getItemIcon(type) {
  return ITEM_ICONS[type] || '◆';
}

function getConsumableLabel(type) {
  if (type === 'missile') return 'MIS';
  if (type === 'bomb') return 'BOM';
  return '';
}

function enforceSingleConsumable(player) {
  if (!player || !player.consumables) return;

  const hasMissile = (player.consumables.missile || 0) > 0;
  const hasBomb = (player.consumables.bomb || 0) > 0;

  let held = null;
  if (player.selectedConsumable && (player.consumables[player.selectedConsumable] || 0) > 0) {
    held = player.selectedConsumable;
  } else if (hasMissile) {
    held = 'missile';
  } else if (hasBomb) {
    held = 'bomb';
  }

  player.consumables.missile = held === 'missile' ? 1 : 0;
  player.consumables.bomb = held === 'bomb' ? 1 : 0;
  player.selectedConsumable = held;
}

function getTotalConsumables(player) {
  enforceSingleConsumable(player);
  return (player.consumables.missile || 0) + (player.consumables.bomb || 0);
}

function getPreferredConsumable(player) {
  enforceSingleConsumable(player);
  return player.selectedConsumable;
}

function getInputVector(player, touchInput) {
  let x = touchInput.x;
  let y = touchInput.y;

  if (!touchInput.active && player.controls) {
    if (heldKeys.has(player.controls.left)) x -= 1;
    if (heldKeys.has(player.controls.right)) x += 1;
    if (heldKeys.has(player.controls.up)) y -= 1;
    if (heldKeys.has(player.controls.down)) y += 1;
  }

  const len = Math.hypot(x, y);
  if (len > 1) {
    x /= len;
    y /= len;
  }

  return { x, y, len: Math.min(1, len) };
}

function getOpponents(player) {
  return state.activePlayers.filter((other) => other.team !== player.team);
}

function getNearestOpponent(player) {
  const opponents = getOpponents(player);
  if (opponents.length === 0) return null;

  let best = opponents[0];
  let bestDist = Infinity;

  opponents.forEach((candidate) => {
    const dist = Math.hypot(candidate.x - player.x, candidate.y - player.y);
    if (dist < bestDist) {
      bestDist = dist;
      best = candidate;
    }
  });

  return best;
}

function getNpcInput(player, dt) {
  const target = getNearestOpponent(player);
  if (!target) return { x: 0, y: 0, len: 0 };

  const toTargetX = target.x - player.x;
  const toTargetY = target.y - player.y;
  const distToTarget = Math.hypot(toTargetX, toTargetY) || 1;

  const targetNX = toTargetX / distToTarget;
  const targetNY = toTargetY / distToTarget;

  const toCenterX = center.x - player.x;
  const toCenterY = center.y - player.y;
  const distToCenter = Math.hypot(toCenterX, toCenterY) || 1;

  const centerNX = toCenterX / distToCenter;
  const centerNY = toCenterY / distToCenter;

  const edgeRisk = clamp((distToCenter - state.stage.arenaRadius * 0.66) / (state.stage.arenaRadius * 0.34), 0, 1);

  const strafe = player.ai.strafe;
  const strafeDir = (Math.sin((performance.now() * 0.0014) + player.id.length) > 0 ? 1 : -1) * strafe;
  const strafeX = -targetNY * strafeDir;
  const strafeY = targetNX * strafeDir;

  const jitterStrength = player.ai.jitter;
  const jitterX = Math.sin((performance.now() * 0.0025) + player.x * 0.015) * 0.12 * jitterStrength;
  const jitterY = Math.cos((performance.now() * 0.0023) + player.y * 0.017) * 0.12 * jitterStrength;

  let x = targetNX * (0.9 * player.ai.aggression) + centerNX * (0.45 + edgeRisk * 1.25 * player.ai.edgeCare) + strafeX + jitterX;
  let y = targetNY * (0.9 * player.ai.aggression) + centerNY * (0.45 + edgeRisk * 1.25 * player.ai.edgeCare) + strafeY + jitterY;

  if (distToTarget < 92) {
    x += strafeX * 1.4;
    y += strafeY * 1.4;
  }

  const length = Math.hypot(x, y);
  if (length > 0.001) {
    x /= length;
    y /= length;
  }

  const pressure = clamp(0.72 + player.ai.aggression * 0.2 + edgeRisk * 0.18, 0.6, 1);
  return { x, y, len: pressure };
}

function getPlayerInput(player, dt) {
  if (player.isBot) {
    return getNpcInput(player, dt);
  }

  if (player.id === 'p1') {
    return getInputVector(player, touchState.p1);
  }

  if (ONLINE_GUEST_ROLES.includes(player.id)) {
    if (isOnlineMode()) {
      if (online.isHost) {
        return sanitizeInput(online.remoteInputs[player.id] || { x: 0, y: 0, len: 0 });
      }
      if (getOnlineOwnRole() === player.id) {
        return getInputVector(player, touchState.p2);
      }
      return { x: 0, y: 0, len: 0 };
    }

    if (player.id === 'p2') {
      return getInputVector(player, touchState.p2);
    }
    return { x: 0, y: 0, len: 0 };
  }

  return { x: 0, y: 0, len: 0 };
}

function applyMovement(player, input, dt, target) {
  if (player.freezeTimer > 0) {
    input = { x: 0, y: 0, len: 0 };
  }

  if (input.len > 0.15) {
    player.aimX = input.x;
    player.aimY = input.y;
  } else if (target) {
    const dx = target.x - player.x;
    const dy = target.y - player.y;
    const len = Math.hypot(dx, dy) || 1;
    player.aimX = dx / len;
    player.aimY = dy / len;
  }

  const powBuff = getBuffAmount(player, 'power');
  const accel = CONFIG.baseAccel * player.speedMul * (1 + powBuff * 0.45) * state.stage.speedScale;
  const maxSpeed = CONFIG.baseMaxSpeed * player.speedMul * (1 + powBuff * 0.28) * state.stage.speedScale;
  const speedGrip = clamp((player.speedMul - 0.95) * 0.02, 0, 0.012);

  player.vx += input.x * accel * dt * input.len;
  player.vy += input.y * accel * dt * input.len;

  if (input.len > 0.22) {
    const velLen = Math.hypot(player.vx, player.vy);
    if (velLen > 120) {
      const steerGrip = clamp((0.0016 + speedGrip) * input.len * dt * 60, 0, 0.022);
      const desiredVX = input.x * velLen;
      const desiredVY = input.y * velLen;
      player.vx += (desiredVX - player.vx) * steerGrip;
      player.vy += (desiredVY - player.vy) * steerGrip;
    }
  }

  const damp = Math.pow(state.stage.drag, dt * 60);
  player.vx *= damp;
  player.vy *= damp;

  const speed = Math.hypot(player.vx, player.vy);
  const speedLimit = input.len > 0.2 ? maxSpeed * 1.7 : maxSpeed * 3.25;
  if (speed > speedLimit) {
    const ratio = speedLimit / speed;
    player.vx *= ratio;
    player.vy *= ratio;
  }

  player.x += player.vx * dt;
  player.y += player.vy * dt;
  player.spinAngle += (Math.hypot(player.vx, player.vy) * dt) / 33;
}

function spawnCollisionSparks(x, y) {
  for (let i = 0; i < 10; i += 1) {
    const ang = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
    const speed = 100 + Math.random() * 220;
    state.sparks.push({
      x,
      y,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      life: 0.3,
      size: 2 + Math.random() * 2,
    });
  }
}

function resolvePlayerCollision(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const minDist = a.radius + b.radius;

  if (dist === 0 || dist >= minDist) return;

  const nx = dx / dist;
  const ny = dy / dist;
  const overlap = minDist - dist;

  a.x -= nx * overlap * 0.5;
  a.y -= ny * overlap * 0.5;
  b.x += nx * overlap * 0.5;
  b.y += ny * overlap * 0.5;

  const powA = getBuffAmount(a, 'power');
  const powB = getBuffAmount(b, 'power');
  const preSpeedA = Math.hypot(a.vx, a.vy);
  const preSpeedB = Math.hypot(b.vx, b.vy);

  const massA = a.massBase * (1 + powA * 0.28);
  const massB = b.massBase * (1 + powB * 0.28);

  const rvx = b.vx - a.vx;
  const rvy = b.vy - a.vy;
  const velAlongNormal = rvx * nx + rvy * ny;

  if (velAlongNormal < 0) {
    const impulse = -(1 + 0.82) * velAlongNormal / ((1 / massA) + (1 / massB));
    const ix = impulse * nx;
    const iy = impulse * ny;

    a.vx -= ix / massA;
    a.vy -= iy / massA;
    b.vx += ix / massB;
    b.vy += iy / massB;
  }

  const powerA = getBuffAmount(a, 'power');
  const powerB = getBuffAmount(b, 'power');

  const impactSpeed = Math.max(0, -(rvx * nx + rvy * ny));
  const crashBoost = 1 + clamp(impactSpeed / 220, 0, 0.82);
  const speedBoostA = 1 + clamp(preSpeedA / 520, 0, 0.2);
  const speedBoostB = 1 + clamp(preSpeedB / 520, 0, 0.2);

  const defenseResistA = 1 + Math.max(0, b.defenseMul - 1) * 0.06;
  const defenseResistB = 1 + Math.max(0, a.defenseMul - 1) * 0.06;

  const atkDriveA = 0.65 + a.attackMul * 0.95;
  const atkDriveB = 0.65 + b.attackMul * 0.95;

  const bonusA = (132 * atkDriveA * state.stage.impactScale * crashBoost * speedBoostA * (1 + powerA * 0.42)) / defenseResistA;
  const bonusB = (132 * atkDriveB * state.stage.impactScale * crashBoost * speedBoostB * (1 + powerB * 0.42)) / defenseResistB;

  a.vx -= nx * bonusB;
  a.vy -= ny * bonusB;
  b.vx += nx * bonusA;
  b.vy += ny * bonusA;

  spawnCollisionSparks((a.x + b.x) * 0.5, (a.y + b.y) * 0.5);

  const now = performance.now();
  if (now - state.lastCollisionSfxAt > 80) {
    playSfx('hit');
    state.lastCollisionSfxAt = now;
  }
}

function spawnBullet(owner, type) {
  const speedBase = type === 'fire' ? 560 : type === 'ice' ? 520 : 430;
  const speed = speedBase * state.stage.projectileScale;

  state.bullets.push({
    id: `${type}_${Math.random().toString(36).slice(2, 9)}`,
    type,
    ownerId: owner.id,
    x: owner.x + owner.aimX * (owner.radius + 10),
    y: owner.y + owner.aimY * (owner.radius + 10),
    vx: owner.aimX * speed,
    vy: owner.aimY * speed,
    life: type === 'missile' ? 1.6 : 1.4,
    radius: type === 'fire' ? 10 : type === 'ice' ? 11 : 13,
  });

  playSfx(type === 'ice' ? 'iceShot' : 'fireShot');
}

function triggerAutoShots(player, dt) {
  if (player.buffs.fire > 0) {
    player.cooldownFire -= dt;
    if (player.cooldownFire <= 0) {
      player.cooldownFire = 0.36;
      spawnBullet(player, 'fire');
    }
  } else {
    player.cooldownFire = 0;
  }

  if (player.buffs.ice > 0) {
    player.cooldownIce -= dt;
    if (player.cooldownIce <= 0) {
      player.cooldownIce = 0.62;
      spawnBullet(player, 'ice');
    }
  } else {
    player.cooldownIce = 0;
  }
}

function placeBomb(owner) {
  state.bombs.push({
    id: `bomb_${Math.random().toString(36).slice(2, 9)}`,
    ownerId: owner.id,
    x: owner.x - owner.aimX * Math.max(12, owner.radius * 0.55),
    y: owner.y - owner.aimY * Math.max(12, owner.radius * 0.55),
    radius: 22,
    blastRadius: 165,
    life: 5,
    armTimer: 0.32,
    ownerSafeTimer: 0.55,
  });
}

function useSelectedConsumable(player) {
  if (!player || state.phase !== 'playing') return false;

  const type = getPreferredConsumable(player);
  if (!type) return false;

  if ((player.consumables[type] || 0) <= 0) return false;

  if (type === 'missile') {
    spawnBullet(player, 'missile');
  } else if (type === 'bomb') {
    placeBomb(player);
  } else {
    return false;
  }

  player.consumables.missile = 0;
  player.consumables.bomb = 0;
  player.selectedConsumable = null;

  setStatus(`${player.slot} が ${getItemIcon(type)} ${type === 'missile' ? 'ミサイル' : 'ボム'} を使用!`);
  updateItemButtons();
  return true;
}

function spawnItem() {
  const type = ITEM_KEYS[Math.floor(Math.random() * ITEM_KEYS.length)];
  const angle = Math.random() * Math.PI * 2;
  const distance = randomRange(0, state.stage.arenaRadius - 110);

  state.item = {
    type,
    x: center.x + Math.cos(angle) * distance,
    y: center.y + Math.sin(angle) * distance,
    radius: CONFIG.itemRadius,
    life: CONFIG.itemLife,
    rot: Math.random() * Math.PI * 2,
  };
}

function burstEffect(x, y, color, options = {}) {
  const count = Math.max(6, Math.floor(options.count ?? 18));
  const speedMin = options.speedMin ?? 50;
  const speedMax = options.speedMax ?? 240;
  const life = options.life ?? 0.48;
  const sizeBase = options.sizeBase ?? 2;
  const sizeVar = options.sizeVar ?? 2;

  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.22;
    const speed = speedMin + Math.random() * Math.max(1, speedMax - speedMin);
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life,
      color,
      size: sizeBase + Math.random() * sizeVar,
    });
  }
}

function addImpactRings(x, y, color, intensity = 1) {
  const ringCount = intensity >= 1.5 ? 2 : 1;
  for (let i = 0; i < ringCount; i += 1) {
    state.impactRings.push({
      x,
      y,
      radius: 12 + i * 10,
      grow: 300 + intensity * 140 + i * 55,
      life: 0.2 + intensity * 0.07 + i * 0.04,
      maxLife: 0.2 + intensity * 0.07 + i * 0.04,
      color,
      width: 2.2 + intensity * 0.9 - i * 0.35,
    });
  }
}

function addScreenShake(power = 5, duration = 0.14) {
  state.shakePower = Math.max(state.shakePower, power);
  state.shakeTime = Math.max(state.shakeTime, duration);
}

function spawnImpactFx(x, y, color, intensity = 1) {
  const boosted = Math.max(0.6, intensity);
  burstEffect(x, y, color, {
    count: Math.floor(20 + boosted * 12),
    speedMin: 80 + boosted * 30,
    speedMax: 260 + boosted * 120,
    life: 0.46 + boosted * 0.08,
    sizeBase: 2 + boosted * 0.45,
    sizeVar: 2.4 + boosted * 0.6,
  });
  spawnCollisionSparks(x, y);
  if (boosted >= 1.35) {
    spawnCollisionSparks(x, y);
  }
  addImpactRings(x, y, color, boosted);
  addScreenShake(3 + boosted * 3.2, 0.11 + boosted * 0.08);
}

function updateItem(dt) {
  if (!state.item) {
    state.itemTimer -= dt;
    if (state.itemTimer <= 0) spawnItem();
    return;
  }

  const item = state.item;
  item.life -= dt;
  item.rot += dt * 2;

  if (item.life <= 0) {
    state.item = null;
    state.itemTimer = randomRange(state.stage.itemSpawnMin, state.stage.itemSpawnMax);
    return;
  }

  let picker = null;
  for (const player of state.activePlayers) {
    const dx = player.x - item.x;
    const dy = player.y - item.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= player.radius + item.radius) {
      picker = player;
      break;
    }
  }

  if (!picker) return;

  const itemData = ITEM_TYPES[item.type];

  if (item.type === 'missile' || item.type === 'bomb') {
    const previousType = getPreferredConsumable(picker);
    picker.consumables.missile = item.type === 'missile' ? 1 : 0;
    picker.consumables.bomb = item.type === 'bomb' ? 1 : 0;
    picker.selectedConsumable = item.type;
    burstEffect(item.x, item.y, itemData.color);
    playSfx('pickup');
    if (previousType && previousType !== item.type) {
      setStatus(`${picker.slot} のアイテムを ${getItemIcon(item.type)} ${itemData.label} に上書き!`);
    } else {
      setStatus(`${picker.slot} が ${getItemIcon(item.type)} ${itemData.label} を取得!`);
    }
  } else {
    picker.buffs[item.type] = itemData.duration;
    burstEffect(item.x, item.y, itemData.color);
    playSfx('pickup');

    if (item.type === 'fire' || item.type === 'ice') {
      setStatus(`${picker.slot} が ${getItemIcon(item.type)} ${itemData.label} を取得!`);
    }
  }

  state.item = null;
  state.itemTimer = randomRange(state.stage.itemSpawnMin, state.stage.itemSpawnMax);
  updateItemButtons();
}

function applyBulletHit(bullet, target, owner) {
  const powGuard = getBuffAmount(target, 'power');
  const reduce = 1 - powGuard * 0.3;
  const dirLen = Math.hypot(bullet.vx, bullet.vy) || 1;
  const dirX = bullet.vx / dirLen;
  const dirY = bullet.vy / dirLen;

  if (bullet.type === 'fire') {
    const attackDrive = 0.86 + owner.attackMul * 0.9;
    const defenseScale = Math.max(0.96, 0.92 + target.defenseMul * 0.08);
    const knock = (355 * attackDrive * state.stage.impactScale * reduce) / defenseScale;
    target.vx += dirX * knock;
    target.vy += dirY * knock;
    playSfx('fireHit');
    spawnImpactFx(target.x, target.y, '#ff9f84', 1.05);
  }

  if (bullet.type === 'ice') {
    const defenseScale = Math.max(0.94, 0.9 + target.defenseMul * 0.08);
    const knock = (94 * owner.attackMul * reduce) / defenseScale;
    target.vx += dirX * knock;
    target.vy += dirY * knock;
    if (target.freezeImmuneTimer <= 0) {
      target.freezeTimer = Math.max(target.freezeTimer, 1);
      setStatus(`${target.slot} が1秒凍結`);
    }
    playSfx('iceHit');
    spawnImpactFx(target.x, target.y, '#8ed5ff', 0.9);
  }

  if (bullet.type === 'missile') {
    const attackDrive = 0.94 + owner.attackMul * 0.95;
    const defenseScale = Math.max(0.95, 0.91 + target.defenseMul * 0.08);
    const knock = (860 * attackDrive * state.stage.impactScale * reduce) / defenseScale;
    target.vx += dirX * knock;
    target.vy += dirY * knock;
    setStatus(`${target.slot} がミサイル被弾! 大きく吹き飛んだ`);
    playSfx('missileHit');
    spawnImpactFx(target.x, target.y, '#ffd772', 2.05);
  }
}

function updateBullets(dt) {
  for (let i = state.bullets.length - 1; i >= 0; i -= 1) {
    const bullet = state.bullets[i];
    bullet.life -= dt;
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;

    const outDist = Math.hypot(bullet.x - center.x, bullet.y - center.y);
    if (bullet.life <= 0 || outDist > state.stage.arenaRadius + 130) {
      state.bullets.splice(i, 1);
      continue;
    }

    const owner = state.activePlayers.find((player) => player.id === bullet.ownerId);
    if (!owner) {
      state.bullets.splice(i, 1);
      continue;
    }

    let hitTarget = null;
    let hitDist = Infinity;

    state.activePlayers.forEach((target) => {
      if (target.team === owner.team) return;
      const dx = target.x - bullet.x;
      const dy = target.y - bullet.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= target.radius + bullet.radius && dist < hitDist) {
        hitTarget = target;
        hitDist = dist;
      }
    });

    if (hitTarget) {
      applyBulletHit(bullet, hitTarget, owner);
      state.bullets.splice(i, 1);
    }
  }
}

function explodeBomb(bomb) {
  let hitCount = 0;

  state.activePlayers.forEach((player) => {
    const dx = player.x - bomb.x;
    const dy = player.y - bomb.y;
    const dist = Math.hypot(dx, dy);
    if (dist > bomb.blastRadius + player.radius) return;

    const pushDirLen = dist || 1;
    const nx = dx / pushDirLen || Math.cos(player.spinAngle);
    const ny = dy / pushDirLen || Math.sin(player.spinAngle);
    const falloff = 1 - clamp((dist - player.radius) / Math.max(1, bomb.blastRadius), 0, 1);
    const powGuard = getBuffAmount(player, 'power');
    const reduce = 1 - powGuard * 0.25;
    const directHit = dist <= bomb.radius + player.radius * 0.95 ? 2.2 : 1;
    const knock = 1020 * (0.64 + falloff * 1.72) * reduce * directHit;

    player.vx += nx * knock;
    player.vy += ny * knock;
    hitCount += 1;
  });

  spawnImpactFx(bomb.x, bomb.y, '#ffbd7f', 2.2);
  burstEffect(bomb.x, bomb.y, '#ffd2ad', {
    count: 52,
    speedMin: 160,
    speedMax: 560,
    life: 0.68,
    sizeBase: 2.8,
    sizeVar: 4.2,
  });
  playSfx('bombBlast');
  if (hitCount > 0) {
    setStatus(`ボム爆発! ${hitCount}人が吹き飛んだ`);
  }
}

function updateBombs(dt) {
  for (let i = state.bombs.length - 1; i >= 0; i -= 1) {
    const bomb = state.bombs[i];
    bomb.life -= dt;
    bomb.armTimer = Math.max(0, (bomb.armTimer || 0) - dt);
    bomb.ownerSafeTimer = Math.max(0, (bomb.ownerSafeTimer || 0) - dt);

    let touched = false;
    if (bomb.armTimer <= 0) {
      for (const player of state.activePlayers) {
        if (player.id === bomb.ownerId && bomb.ownerSafeTimer > 0) continue;
        const dist = Math.hypot(player.x - bomb.x, player.y - bomb.y);
        if (dist <= player.radius + bomb.radius) {
          touched = true;
          break;
        }
      }
    }

    if (touched || bomb.life <= 0) {
      explodeBomb(bomb);
      state.bombs.splice(i, 1);
    }
  }
}

function updateBuffTimers(player, dt) {
  Object.keys(player.buffs).forEach((key) => {
    player.buffs[key] = Math.max(0, player.buffs[key] - dt);
  });

  player.freezeImmuneTimer = Math.max(0, player.freezeImmuneTimer - dt);
  const wasFrozen = player.freezeTimer > 0;
  player.freezeTimer = Math.max(0, player.freezeTimer - dt);
  if (wasFrozen && player.freezeTimer <= 0) {
    player.freezeImmuneTimer = Math.max(player.freezeImmuneTimer, 2);
  }
}

function teamAliveCount(team) {
  return state.activePlayers.filter((player) => player.team === team).length;
}

function checkRingOut() {
  const outPlayers = state.activePlayers.filter((player) => {
    const dist = Math.hypot(player.x - center.x, player.y - center.y);
    return dist > state.stage.arenaRadius + player.radius * 0.2;
  });

  if (outPlayers.length === 0) return;

  outPlayers.forEach((player) => {
    burstEffect(player.x, player.y, player.team === 'left' ? '#90fff0' : '#ffc18f');
  });

  const outIds = new Set(outPlayers.map((player) => player.id));
  state.activePlayers = state.activePlayers.filter((player) => !outIds.has(player.id));
  state.activePlayerIds = state.activePlayers.map((player) => player.id);

  const leftAlive = teamAliveCount('left');
  const rightAlive = teamAliveCount('right');

  if (leftAlive === 0 && rightAlive === 0) {
    endRound(null, '同時リングアウト');
    return;
  }

  if (leftAlive === 0) {
    endRound('right', isSingleMode() ? 'YOU がリングアウト' : `${getRightTeamLabel()} が押し出した!`);
    return;
  }

  if (rightAlive === 0) {
    endRound('left', isSingleMode() ? '敵を全員リングアウト!' : 'P1 が押し出した!');
    return;
  }

  if (isSingleMode()) {
    const names = outPlayers.map((player) => player.slot).join(' / ');
    setStatus(`${names} リングアウト!`);
    playSfx('ringout');
  }
}

function getTeamBestDistance(team) {
  const players = state.activePlayers.filter((player) => player.team === team);
  if (players.length === 0) return Infinity;

  return players.reduce((min, player) => {
    const dist = Math.hypot(player.x - center.x, player.y - center.y);
    return Math.min(min, dist);
  }, Infinity);
}

function judgeByDistance() {
  const leftBest = getTeamBestDistance('left');
  const rightBest = getTeamBestDistance('right');

  if (!Number.isFinite(leftBest) && !Number.isFinite(rightBest)) {
    endRound(null, '時間切れ: 引き分け');
    return;
  }

  if (!Number.isFinite(leftBest)) {
    endRound('right', '時間切れ判定');
    return;
  }

  if (!Number.isFinite(rightBest)) {
    endRound('left', '時間切れ判定');
    return;
  }

  if (Math.abs(leftBest - rightBest) < 12) {
    endRound(null, '時間切れ: 引き分け');
    return;
  }

  endRound(leftBest < rightBest ? 'left' : 'right', '時間切れ判定');
}

function updateParticles(dt) {
  state.particles.forEach((particle) => {
    particle.life -= dt;
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.vx *= 0.98;
    particle.vy *= 0.98;
  });
  state.particles = state.particles.filter((particle) => particle.life > 0);

  state.sparks.forEach((spark) => {
    spark.life -= dt;
    spark.x += spark.vx * dt;
    spark.y += spark.vy * dt;
    spark.vx *= 0.94;
    spark.vy *= 0.94;
  });
  state.sparks = state.sparks.filter((spark) => spark.life > 0);

  state.impactRings.forEach((ring) => {
    ring.life -= dt;
    ring.radius += ring.grow * dt;
  });
  state.impactRings = state.impactRings.filter((ring) => ring.life > 0);

  state.shakeTime = Math.max(0, state.shakeTime - dt);
  if (state.shakeTime <= 0) {
    state.shakePower = 0;
  }
}

function createSnapshot() {
  return {
    stageId: state.stageId,
    selection: {
      stageId: state.selection.stageId,
      p1: state.selection.p1,
      p2: state.selection.p2,
      p3: state.selection.p3,
      p4: state.selection.p4,
    },
    phase: state.phase,
    round: state.round,
    timer: state.timer,
    status: state.status,
    scoreLeft: state.scoreLeft,
    scoreRight: state.scoreRight,
    activePlayerIds: state.activePlayerIds.slice(),
    item: state.item ? { ...state.item } : null,
    bullets: state.bullets.map((bullet) => ({ ...bullet })),
    bombs: state.bombs.map((bomb) => ({ ...bomb })),
    players: state.activePlayers.map((player) => ({
      id: player.id,
      slot: player.slot,
      charId: player.charId,
      team: player.team,
      x: player.x,
      y: player.y,
      vx: player.vx,
      vy: player.vy,
      radius: player.radius,
      spinAngle: player.spinAngle,
      freezeTimer: player.freezeTimer,
      freezeImmuneTimer: player.freezeImmuneTimer,
      buffs: { ...player.buffs },
      consumables: { ...player.consumables },
      selectedConsumable: player.selectedConsumable,
    })),
  };
}

function applySnapshot(snapshot) {
  if (!snapshot) return;

  if (snapshot.selection) {
    if (snapshot.selection.stageId) {
      state.selection.stageId = snapshot.selection.stageId;
    }
    if (snapshot.selection.p1) {
      state.selection.p1 = snapshot.selection.p1;
    }
    if (snapshot.selection.p2) {
      state.selection.p2 = snapshot.selection.p2;
    }
    if (snapshot.selection.p3) {
      state.selection.p3 = snapshot.selection.p3;
    }
    if (snapshot.selection.p4) {
      state.selection.p4 = snapshot.selection.p4;
    }
  }

  applyStage(snapshot.stageId || state.selection.stageId || state.stageId);
  applyCharacter(roster.p1, state.selection.p1);
  applyCharacter(roster.p2, state.selection.p2);
  applyCharacter(roster.p3, state.selection.p3);
  applyCharacter(roster.p4, state.selection.p4);

  const incomingIds = Array.isArray(snapshot.activePlayerIds) && snapshot.activePlayerIds.length
    ? snapshot.activePlayerIds
    : ['p1', 'p2'];

  const validIds = incomingIds.filter((id) => SNAPSHOT_PLAYER_IDS.includes(id));
  setActivePlayers(validIds.length ? validIds : ['p1', 'p2']);

  if (Array.isArray(snapshot.players)) {
    snapshot.players.forEach((remote) => {
      const local = roster[remote.id];
      if (!local) return;

      if (remote.charId && remote.charId !== local.charId) {
        applyCharacter(local, remote.charId);
      }

      local.slot = remote.slot || local.slot;
      local.team = remote.team || local.team;
      local.x = Number(remote.x) || 0;
      local.y = Number(remote.y) || 0;
      local.vx = Number(remote.vx) || 0;
      local.vy = Number(remote.vy) || 0;
      local.radius = Number(remote.radius) || local.baseRadius;
      local.spinAngle = Number(remote.spinAngle) || 0;
      local.freezeTimer = Number(remote.freezeTimer) || 0;
      local.freezeImmuneTimer = Number(remote.freezeImmuneTimer) || 0;
      local.buffs = {
        ...local.buffs,
        ...(remote.buffs || {}),
      };
      local.consumables = {
        ...local.consumables,
        ...(remote.consumables || {}),
      };
      if (Object.prototype.hasOwnProperty.call(remote, 'selectedConsumable')) {
        local.selectedConsumable = remote.selectedConsumable || null;
      }
      enforceSingleConsumable(local);
    });
  }

  state.phase = snapshot.phase || state.phase;
  state.round = Number(snapshot.round) || state.round;
  state.timer = Number(snapshot.timer) || 0;
  state.status = snapshot.status || state.status;
  state.scoreLeft = Number(snapshot.scoreLeft) || 0;
  state.scoreRight = Number(snapshot.scoreRight) || 0;
  state.item = snapshot.item ? { ...snapshot.item } : null;
  state.bullets = Array.isArray(snapshot.bullets)
    ? snapshot.bullets.map((bullet) => ({ ...bullet }))
    : [];
  state.bombs = Array.isArray(snapshot.bombs)
    ? snapshot.bombs.map((bomb) => ({ ...bomb }))
    : [];

  updateStartButtonLabel();
  refreshSelectionUi();
  updateHud();
}

function emitSnapshotNow() {
  if (!socket || !isOnlineMode() || !online.enabled || !online.isHost || !online.peerReady) return;
  if (!hasOnlineRemotePlayers()) return;
  socket.emit('duel_snapshot', { snapshot: createSnapshot() });
}

function updateHostSnapshot(dt) {
  if (!socket || !isOnlineMode() || !online.enabled || !online.isHost || !online.peerReady) return;
  if (!hasOnlineRemotePlayers()) return;

  online.snapshotTimer -= dt;
  if (online.snapshotTimer <= 0) {
    online.snapshotTimer = 1 / 22;
    socket.emit('duel_snapshot', { snapshot: createSnapshot() });
  }
}

function updateGuestInput(dt) {
  if (!socket || !isOnlineMode() || !online.enabled || online.isHost) return;

  const selfRole = getOnlineOwnRole();
  const self = roster[selfRole];
  if (!self) return;

  const input = getInputVector(self, touchState.p2);
  online.sendTimer -= dt;
  if (online.sendTimer <= 0) {
    online.sendTimer = 1 / 30;
    socket.emit('duel_input', { input });
  }
}

function stepPlaying(dt) {
  state.timer = Math.max(0, state.timer - dt);

  const inputs = new Map();
  state.activePlayers.forEach((player) => {
    inputs.set(player.id, getPlayerInput(player, dt));
  });

  state.activePlayers.forEach((player) => {
    const target = getNearestOpponent(player);
    applyMovement(player, inputs.get(player.id) || { x: 0, y: 0, len: 0 }, dt, target);
  });

  state.activePlayers.forEach((player) => {
    triggerAutoShots(player, dt);
  });

  for (let i = 0; i < state.activePlayers.length; i += 1) {
    for (let j = i + 1; j < state.activePlayers.length; j += 1) {
      resolvePlayerCollision(state.activePlayers[i], state.activePlayers[j]);
    }
  }

  state.activePlayers.forEach((player) => {
    updateBuffTimers(player, dt);
  });

  updateBullets(dt);
  updateBombs(dt);
  updateItem(dt);
  checkRingOut();

  if (state.phase === 'playing' && state.timer <= 0) {
    judgeByDistance();
  }
}

function updateSimulation(dt) {
  if (state.phase === 'playing') {
    stepPlaying(dt);
  } else if (state.phase === 'round_over') {
    state.betweenTimer -= dt;
    if (state.betweenTimer <= 0) {
      nextRound();
    }
  }

  updateParticles(dt);
}

function update(dt) {
  state.ringPulse += dt * 2.4;

  if (isOnlineMode() && online.enabled && !online.isHost) {
    updateGuestInput(dt);
    updateHud();
    return;
  }

  updateSimulation(dt);
  updateHud();
  updateHostSnapshot(dt);
}

function drawBackground() {
  const grad = ctx.createLinearGradient(0, 0, 0, CONFIG.height);
  grad.addColorStop(0, state.stage.bgTop);
  grad.addColorStop(1, state.stage.bgBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

  const pulse = 0.12 + (Math.sin(state.ringPulse) + 1) * 0.05;
  ctx.beginPath();
  ctx.arc(center.x, center.y, state.stage.arenaRadius + 18, 0, Math.PI * 2);
  ctx.fillStyle = state.stage.glowColor.replace('%A%', String(pulse));
  ctx.fill();

  const ring = ctx.createRadialGradient(
    center.x,
    center.y,
    state.stage.arenaRadius * 0.2,
    center.x,
    center.y,
    state.stage.arenaRadius,
  );
  ring.addColorStop(0, 'rgba(30, 45, 56, 0.92)');
  ring.addColorStop(1, 'rgba(8, 14, 20, 0.98)');

  ctx.beginPath();
  ctx.arc(center.x, center.y, state.stage.arenaRadius, 0, Math.PI * 2);
  ctx.fillStyle = ring;
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = state.stage.ringColor;
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.17)';
  for (let i = 1; i <= 3; i += 1) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, state.stage.arenaRadius * (i / 4), 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawItem() {
  if (!state.item) return;

  const data = ITEM_TYPES[state.item.type];
  const icon = getItemIcon(state.item.type);
  const blink = 0.72 + Math.sin(state.item.rot * 5) * 0.2;

  ctx.save();
  ctx.translate(state.item.x, state.item.y);
  ctx.rotate(state.item.rot);

  ctx.beginPath();
  ctx.arc(0, 0, state.item.radius + 8, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255,255,255,${blink * 0.16})`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, state.item.radius, 0, Math.PI * 2);
  ctx.fillStyle = data.color;
  ctx.fill();

  ctx.fillStyle = '#081217';
  ctx.font = "bold 24px 'Noto Sans JP', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, 0, -3);
  ctx.font = "bold 10px 'Chakra Petch', sans-serif";
  ctx.fillText(data.label, 0, state.item.radius - 6);
  ctx.restore();
}

function drawBullets() {
  state.bullets.forEach((bullet) => {
    const fire = bullet.type === 'fire';
    const ice = bullet.type === 'ice';
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius + 4, 0, Math.PI * 2);
    ctx.fillStyle = fire
      ? 'rgba(255, 140, 111, 0.22)'
      : ice
        ? 'rgba(142, 213, 255, 0.22)'
        : 'rgba(255, 216, 125, 0.24)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
    ctx.fillStyle = fire ? '#ff7b56' : ice ? '#8ed5ff' : '#ffd772';
    ctx.fill();
  });
}

function drawBombs() {
  state.bombs.forEach((bomb) => {
    const pulse = 0.6 + Math.sin((5 - bomb.life) * 11) * 0.25;

    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, bomb.blastRadius * 0.42, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 160, 108, ${0.07 + pulse * 0.05})`;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, bomb.radius + 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 182, 133, 0.22)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(bomb.x, bomb.y, bomb.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff927d';
    ctx.fill();

    ctx.fillStyle = '#2a0b03';
    ctx.font = "bold 12px 'Chakra Petch', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('B', bomb.x, bomb.y + 1);
  });
}

function drawTop(player) {
  const power = getBuffAmount(player, 'power');
  const frozen = player.freezeTimer > 0;

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.spinAngle);

  if (power) {
    ctx.beginPath();
    ctx.arc(0, 0, player.radius + 9, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 181, 107, 0.78)';
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  if (frozen) {
    ctx.beginPath();
    ctx.arc(0, 0, player.radius + 13, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(130, 206, 255, 0.88)';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(0, 0, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = player.color;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, player.radius * 0.68, 0, Math.PI * 2);
  ctx.fillStyle = player.accent;
  ctx.fill();

  for (let i = 0; i < 3; i += 1) {
    ctx.rotate((Math.PI * 2) / 3);
    ctx.fillStyle = 'rgba(11, 29, 34, 0.75)';
    ctx.fillRect(player.radius * 0.08, -5, player.radius * 0.56, 10);
  }

  ctx.rotate(-player.spinAngle);
  ctx.fillStyle = '#f6fbfa';
  ctx.font = "bold 14px 'Chakra Petch', sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText(player.slot, 0, 4);

  if (power || player.buffs.fire > 0 || player.buffs.ice > 0) {
    ctx.beginPath();
    ctx.arc(0, 0, player.radius + 4, 0, Math.PI * 2);

    let aura = 'rgba(255, 181, 107, 0.75)';
    if (power) aura = 'rgba(255, 181, 107, 0.75)';
    if (player.buffs.fire > 0) aura = 'rgba(255, 123, 86, 0.82)';
    if (player.buffs.ice > 0) aura = 'rgba(142, 213, 255, 0.85)';

    ctx.strokeStyle = aura;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  ctx.restore();
}

function drawEffects() {
  state.impactRings.forEach((ring) => {
    const alpha = clamp(ring.life / Math.max(0.001, ring.maxLife), 0, 1);
    ctx.globalAlpha = 0.85 * alpha;
    ctx.beginPath();
    ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
    ctx.strokeStyle = ring.color;
    ctx.lineWidth = Math.max(1.2, ring.width * alpha);
    ctx.stroke();
  });

  state.particles.forEach((particle) => {
    ctx.globalAlpha = Math.max(0, particle.life * 2.2);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  });

  state.sparks.forEach((spark) => {
    ctx.globalAlpha = Math.max(0, spark.life * 2.8);
    ctx.fillStyle = '#fff2c9';
    ctx.fillRect(spark.x, spark.y, spark.size, spark.size);
  });

  ctx.globalAlpha = 1;
}

function drawGameScorePips(startX, y, filledCount, color) {
  for (let i = 0; i < CONFIG.pointsToWin; i += 1) {
    const x = startX + i * 16;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    if (i < filledCount) {
      ctx.fillStyle = color;
      ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.24)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.48)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }
}

function drawInGameScoreBoard() {
  const panelW = 260;
  const panelH = 58;
  const panelX = center.x - panelW * 0.5;
  const panelY = 14;
  const rightLabel = isSingleMode() ? 'ENEMY' : getRightTeamLabel();

  ctx.save();
  ctx.fillStyle = 'rgba(3, 11, 14, 0.58)';
  ctx.fillRect(panelX, panelY, panelW, panelH);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(panelX, panelY, panelW, panelH);

  ctx.font = "bold 16px 'Chakra Petch', sans-serif";
  ctx.fillStyle = '#eaf7f4';
  ctx.textBaseline = 'middle';

  ctx.textAlign = 'left';
  ctx.fillText('P1', panelX + 14, panelY + 19);
  ctx.textAlign = 'right';
  ctx.fillText(rightLabel, panelX + panelW - 14, panelY + 19);

  drawGameScorePips(panelX + 14, panelY + 41, state.scoreLeft, 'rgba(61, 238, 212, 0.95)');
  drawGameScorePips(panelX + panelW - 14 - ((CONFIG.pointsToWin - 1) * 16), panelY + 41, state.scoreRight, 'rgba(255, 182, 108, 0.96)');

  ctx.restore();
}

function drawOverlay() {
  if (state.phase === 'playing') return;

  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

  ctx.fillStyle = '#f0f9f7';
  ctx.textAlign = 'center';
  ctx.font = "42px 'Chakra Petch', sans-serif";

  if (state.phase === 'idle') {
    const title = isSingleMode() ? `SINGLE STAGE ${state.single.stageIndex + 1}` : `${getModeLabel()} BATTLE`;
    ctx.fillText(title, center.x, center.y - 20);
    ctx.font = "22px 'Noto Sans JP', sans-serif";
    ctx.fillText('Startでバトル開始', center.x, center.y + 32);
  }

  if (state.phase === 'match_over') {
    if (isSingleMode() && state.single.campaignComplete) {
      ctx.fillText('CAMPAIGN CLEAR', center.x, center.y - 20);
      ctx.font = "22px 'Noto Sans JP', sans-serif";
      ctx.fillText('Restart Campaignで1から再挑戦', center.x, center.y + 32);
    } else if (isSingleMode()) {
      ctx.fillText(`STAGE ${state.single.stageIndex + 1}`, center.x, center.y - 20);
      ctx.font = "22px 'Noto Sans JP', sans-serif";
      ctx.fillText('Retry Stageで再挑戦', center.x, center.y + 32);
    } else {
      const champ = state.scoreLeft > state.scoreRight ? 'P1' : getRightTeamLabel();
      ctx.fillText(`${champ} CHAMPION`, center.x, center.y - 20);
      ctx.font = "22px 'Noto Sans JP', sans-serif";
      ctx.fillText('Rematchで再戦', center.x, center.y + 32);
    }
  }

  ctx.restore();
}

function render() {
  ctx.save();
  if (state.shakeTime > 0 && state.shakePower > 0) {
    const shakeRatio = clamp(state.shakeTime / 0.35, 0, 1);
    const amp = state.shakePower * (0.35 + shakeRatio * 0.65);
    const ox = (Math.random() * 2 - 1) * amp;
    const oy = (Math.random() * 2 - 1) * amp;
    ctx.translate(ox, oy);
  }
  drawBackground();
  drawItem();
  drawBombs();
  drawBullets();
  state.activePlayers.forEach((player) => drawTop(player));
  drawEffects();
  drawOverlay();
  ctx.restore();

  drawInGameScoreBoard();
}

function buffList(player) {
  const list = [];
  if (player?.buffs?.power > 0) list.push('POW');
  if (player?.buffs?.fire > 0) list.push('FIR');
  if (player?.buffs?.ice > 0) list.push('ICE');
  if ((player?.consumables?.missile || 0) > 0) list.push(`MISx${player.consumables.missile}`);
  if ((player?.consumables?.bomb || 0) > 0) list.push(`BOMx${player.consumables.bomb}`);
  if ((player?.freezeTimer || 0) > 0) list.push('FRZ');
  return list.length ? `BUFF: ${list.join(' / ')}` : 'BUFF: -';
}

function teamBuffList(team) {
  const members = state.activePlayers.filter((player) => player.team === team);
  if (members.length === 0) return 'BUFF: -';

  if (members.length === 1) {
    return buffList(members[0]);
  }

  const tags = new Set();
  members.forEach((member) => {
    const text = buffList(member).replace('BUFF: ', '');
    if (text === '-') return;
    text.split(' / ').forEach((tag) => tags.add(tag));
  });

  return tags.size ? `BUFF: ${Array.from(tags).join(' / ')}` : 'BUFF: -';
}

function updateItemButton(buttonEl, player) {
  if (!buttonEl || !player) return;

  const total = getTotalConsumables(player);
  const type = getPreferredConsumable(player);
  const visible = total > 0 && state.phase === 'playing';

  buttonEl.classList.toggle('is-hidden', !visible);
  if (!visible) {
    buttonEl.textContent = '🎒 ITEM';
    return;
  }

  const missileCount = player.consumables.missile || 0;
  const bombCount = player.consumables.bomb || 0;
  const selectedIcon = getItemIcon(type);
  buttonEl.textContent = `${selectedIcon} M${missileCount} / 💣 B${bombCount}`;
}

function updateItemButtons() {
  const secondaryRole = getSecondaryControlRole();
  updateItemButton(itemBtnP1, roster.p1);
  updateItemButton(itemBtnP2, roster[secondaryRole] || roster.p2);

  if (!quickItemBtn) return;

  const slot = uiState.activeItemSlot;
  if (!slot || !roster[slot]) {
    quickItemBtn.classList.add('is-hidden');
    quickItemBtn.textContent = '🎒 ITEM';
    return;
  }

  const player = roster[slot];
  const total = getTotalConsumables(player);
  const type = getPreferredConsumable(player);
  const visible = total > 0 && state.phase === 'playing';

  quickItemBtn.classList.toggle('is-hidden', !visible);
  if (!visible || !type) {
    quickItemBtn.textContent = '🎒 ITEM';
    return;
  }

  const missileCount = player.consumables.missile || 0;
  const bombCount = player.consumables.bomb || 0;
  const icon = getItemIcon(type);
  quickItemBtn.textContent = `${icon} ${getConsumableLabel(type)}\n🚀 ${missileCount}  💣 ${bombCount}`;
}

function renderSetMarks(container, wins) {
  if (!container) return;
  container.innerHTML = '';
  for (let i = 0; i < CONFIG.pointsToWin; i += 1) {
    const mark = document.createElement('span');
    mark.className = `set-mark${i < wins ? ' is-on' : ''}`;
    container.appendChild(mark);
  }
}

function updateHud() {
  p1ScoreEl.textContent = `${state.scoreLeft}`;
  p2ScoreEl.textContent = `${state.scoreRight}`;
  renderSetMarks(p1SetMarksEl, state.scoreLeft);
  renderSetMarks(p2SetMarksEl, state.scoreRight);

  p1BuffsEl.textContent = teamBuffList('left');
  p2BuffsEl.textContent = teamBuffList('right');

  timerEl.textContent = `${Math.ceil(state.timer)}`;
  roundEl.textContent = `ROUND ${state.round}`;
  statusEl.textContent = state.status;
  if (setScoreTextEl) {
    if (isSingleMode()) {
      setScoreTextEl.textContent = `先取${CONFIG.pointsToWin} | YOU ${state.scoreLeft} - ${state.scoreRight} ENEMY`;
    } else if (isOnlineMode() && online.enabled && getOnlineEnemyCount() > 1) {
      setScoreTextEl.textContent = `先取${CONFIG.pointsToWin} | P1 ${state.scoreLeft} - ${state.scoreRight} ENEMY`;
    } else {
      setScoreTextEl.textContent = `先取${CONFIG.pointsToWin} | P1 ${state.scoreLeft} - ${state.scoreRight} P2`;
    }
  }

  syncNamePlates();
  setCampaignInfoText();
  updateItemButtons();
}

function updateTouchStick(controller, padEl, knobEl, clientX, clientY) {
  const rect = padEl.getBoundingClientRect();
  const centerX = rect.left + rect.width * 0.5;
  const centerY = rect.top + rect.height * 0.5;
  const maxRadius = rect.width * 0.34;

  let dx = clientX - centerX;
  let dy = clientY - centerY;

  const dist = Math.hypot(dx, dy);
  if (dist > maxRadius) {
    const s = maxRadius / dist;
    dx *= s;
    dy *= s;
  }

  controller.x = dx / maxRadius;
  controller.y = dy / maxRadius;

  knobEl.style.left = `${50 + (dx / rect.width) * 100}%`;
  knobEl.style.top = `${50 + (dy / rect.height) * 100}%`;
}

function resetStick(controller, knobEl) {
  controller.active = false;
  controller.pointerId = null;
  controller.x = 0;
  controller.y = 0;
  knobEl.style.left = '50%';
  knobEl.style.top = '50%';
}

function bindPad(padEl, knobEl, controller) {
  padEl.addEventListener('pointerdown', (event) => {
    unlockAudio();
    event.preventDefault();
    controller.active = true;
    controller.pointerId = event.pointerId;
    updateTouchStick(controller, padEl, knobEl, event.clientX, event.clientY);
    padEl.setPointerCapture(event.pointerId);
  });

  padEl.addEventListener('pointermove', (event) => {
    if (!controller.active || event.pointerId !== controller.pointerId) return;
    event.preventDefault();
    updateTouchStick(controller, padEl, knobEl, event.clientX, event.clientY);
  });

  const endTouch = (event) => {
    if (event.pointerId !== controller.pointerId) return;
    event.preventDefault();
    resetStick(controller, knobEl);
  };

  padEl.addEventListener('pointerup', endTouch);
  padEl.addEventListener('pointercancel', endTouch);
}

function bindPressAction(buttonEl, handler) {
  if (!buttonEl) return;

  let pointerHandledAt = -Infinity;

  buttonEl.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    pointerHandledAt = performance.now();
    handler();
  });

  buttonEl.addEventListener('click', (event) => {
    if (performance.now() - pointerHandledAt < 280) {
      event.preventDefault();
      return;
    }
    handler();
  });
}

function playTone(freq, duration, options = {}) {
  if (!audio.ctx || !audio.master) return;

  const type = options.type || 'triangle';
  const gain = options.gain ?? 0.035;
  const when = options.when ?? 0;
  const now = audio.ctx.currentTime + when;

  const osc = audio.ctx.createOscillator();
  const gainNode = audio.ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  if (options.slideTo) {
    osc.frequency.linearRampToValueAtTime(options.slideTo, now + duration);
  }

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gainNode);
  gainNode.connect(audio.master);

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function stageBgmNotes() {
  if (state.stageId === 'glacier') return [220, 247, 294, 330, 294, 247, 220, 196];
  if (state.stageId === 'magma') return [196, 247, 294, 330, 294, 247, 220, 165];
  return [220, 277, 330, 392, 330, 277, 247, 196];
}

function startBgm() {
  if (!audio.ctx || audio.bgmTimer) return;

  audio.bgmTimer = setInterval(() => {
    if (!audio.ctx) return;

    const notes = stageBgmNotes();
    const note = notes[audio.bgmStep % notes.length];
    audio.bgmStep += 1;

    if (state.phase === 'playing' || state.phase === 'idle' || state.phase === 'match_over') {
      playTone(note, 0.2, { type: 'triangle', gain: 0.02 });
      playTone(note * 2, 0.08, { type: 'square', gain: 0.008, when: 0.02 });
    }
  }, 260);
}

function unlockAudio() {
  if (!audio.ctx) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      audio.ctx = new AudioCtx();
      audio.master = audio.ctx.createGain();
      audio.master.gain.value = 0.6;
      audio.master.connect(audio.ctx.destination);
      startBgm();
    } catch {
      return;
    }
  }

  if (audio.ctx.state === 'suspended') {
    audio.ctx.resume();
  }
}

function playSfx(type) {
  if (!audio.ctx) return;

  if (type === 'start') {
    playTone(440, 0.07, { type: 'square', gain: 0.03 });
    playTone(660, 0.1, { type: 'triangle', gain: 0.026, when: 0.05 });
    return;
  }

  if (type === 'hit') {
    playTone(180, 0.05, { type: 'sawtooth', gain: 0.02 });
    return;
  }

  if (type === 'pickup') {
    playTone(520, 0.06, { type: 'triangle', gain: 0.03 });
    playTone(720, 0.09, { type: 'triangle', gain: 0.022, when: 0.03 });
    return;
  }

  if (type === 'fireShot') {
    playTone(280, 0.05, { type: 'sawtooth', gain: 0.022, slideTo: 190 });
    return;
  }

  if (type === 'iceShot') {
    playTone(600, 0.06, { type: 'triangle', gain: 0.018, slideTo: 420 });
    return;
  }

  if (type === 'fireHit') {
    playTone(240, 0.08, { type: 'square', gain: 0.03, slideTo: 170 });
    return;
  }

  if (type === 'iceHit') {
    playTone(780, 0.08, { type: 'triangle', gain: 0.022, slideTo: 520 });
    return;
  }

  if (type === 'missileHit') {
    playTone(170, 0.11, { type: 'sawtooth', gain: 0.038, slideTo: 118 });
    playTone(340, 0.08, { type: 'square', gain: 0.022, when: 0.03, slideTo: 200 });
    playTone(90, 0.15, { type: 'triangle', gain: 0.018, when: 0.06, slideTo: 70 });
    return;
  }

  if (type === 'bombBlast') {
    playTone(120, 0.18, { type: 'sawtooth', gain: 0.05, slideTo: 72 });
    playTone(260, 0.15, { type: 'square', gain: 0.03, when: 0.02, slideTo: 130 });
    playTone(66, 0.22, { type: 'triangle', gain: 0.022, when: 0.08, slideTo: 50 });
    return;
  }

  if (type === 'ringout') {
    playTone(210, 0.12, { type: 'sawtooth', gain: 0.03 });
    playTone(160, 0.16, { type: 'sawtooth', gain: 0.02, when: 0.08 });
    return;
  }

  if (type === 'win') {
    playTone(392, 0.1, { type: 'triangle', gain: 0.03 });
    playTone(523, 0.12, { type: 'triangle', gain: 0.028, when: 0.08 });
    playTone(659, 0.16, { type: 'triangle', gain: 0.026, when: 0.18 });
  }
}

function setupSocketHandlers() {
  if (!socket) {
    setModeStatus('Socket接続が使えないためローカル/シングルのみ');
    return;
  }

  socket.on('connect', () => {
    if (isOnlineMode() && reconnectSession.active) {
      tryResumeReconnectSession();
      return;
    }
    hideConnectionBanner();
  });

  socket.on('connect_error', () => {
    if (!isOnlineMode()) return;
    showConnectionBanner('接続に失敗しました。再試行中...', false, true);
    setModeStatus('接続エラー。再接続を試みています...');
  });

  if (socket.io) {
    socket.io.on('reconnect_attempt', (attempt) => {
      if (!isOnlineMode()) return;
      showConnectionBanner(`再接続中... (${attempt}回目)`, false, true);
    });

    socket.io.on('reconnect', () => {
      if (!isOnlineMode()) return;
      showConnectionBanner('再接続できました。同期中...', true, false);
    });
  }

  socket.on('duel_error', (message) => {
    const text = String(message || 'エラーが発生しました。');
    setModeStatus(text);

    if (reconnectSession.active) {
      showConnectionBanner(`再接続失敗: ${text}`, false, false);
      if (text.includes('ホスト') || text.includes('ルーム')) {
        clearReconnectSession();
      }
    }

    if (
      isOnlineMode()
      && online.enabled
      && (text.includes('ホスト') || text.includes('ルーム'))
    ) {
      resetOnlineState();
      resetMatch(true);
      refreshSelectionUi();
      updateControlUi();
    }
  });

  socket.on('duel_room_joined', (payload) => {
    if (!isOnlineMode()) {
      switchMode(PLAY_MODES.online);
    }

    online.enabled = true;
    online.isHost = Boolean(payload.isHost);
    online.role = isOnlineHumanRole(payload.role) ? payload.role : (online.isHost ? 'p1' : 'p2');
    online.roomCode = payload.roomCode;
    online.remoteInputs = emptyRemoteInputs();
    applyOnlineRoomState(payload);
    online.sendTimer = 0;
    online.snapshotTimer = 0;

    if (online.isHost) {
      setModeStatus(`ルーム ${payload.roomCode} を作成。参加待ち（NPC:${online.npcCount}）`);
    } else {
      setModeStatus(`ルーム ${payload.roomCode} に参加。あなたは ${online.role.toUpperCase()}`);
    }

    clearReconnectSession();
    showConnectionBanner('接続OK', true, false);
    setTimeout(() => {
      if (!reconnectSession.active) hideConnectionBanner();
    }, 900);

    resetMatch(true);
    refreshSelectionUi();
    updateControlUi();
    emitSnapshotNow();
  });

  socket.on('duel_room_state', (payload) => {
    if (!isOnlineMode() || !online.enabled) return;
    if (payload.roomCode !== online.roomCode) return;

    applyOnlineRoomState(payload);

    if (online.isHost) {
      setModeStatus(
        online.peerReady
          ? `ルーム ${online.roomCode} 準備OK（H:${payload.humanCount || 1} NPC:${online.npcCount}）`
          : `ルーム ${online.roomCode} 参加待ち（NPC:${online.npcCount}）`,
      );
    } else {
      setModeStatus(`ルーム ${online.roomCode} | ホストの開始待ち`);
    }

    if (state.phase !== 'playing') {
      resetMatch(true);
    }

    refreshSelectionUi();
    updateControlUi();
  });

  socket.on('duel_peer_joined', ({ name, role, roomCode }) => {
    if (!isOnlineMode() || !online.enabled) return;
    if (roomCode !== online.roomCode) return;

    if (role && ONLINE_GUEST_ROLES.includes(role)) {
      online.players[role] = String(name || role.toUpperCase()).slice(0, 16);
    }

    if (online.isHost) {
      setModeStatus(`${role ? role.toUpperCase() : 'GUEST'}(${name || 'Player'}) が参加。Startで開始`);
    }

    updateControlUi();
    emitSnapshotNow();
  });

  socket.on('duel_peer_left', ({ role, name }) => {
    if (!isOnlineMode() || !online.enabled) return;
    if (role && ONLINE_GUEST_ROLES.includes(role)) {
      online.players[role] = null;
      online.remoteInputs[role] = { x: 0, y: 0, len: 0 };
    }

    resetMatch(true);
    setModeStatus(`${role ? role.toUpperCase() : 'GUEST'}(${name || 'Player'}) が退出`);
    refreshSelectionUi();
    updateControlUi();
  });

  socket.on('duel_remote_input', ({ role, input }) => {
    if (!isOnlineMode() || !online.enabled || !online.isHost) return;
    if (!ONLINE_GUEST_ROLES.includes(role)) return;
    online.remoteInputs[role] = sanitizeInput(input);
  });

  socket.on('duel_remote_use_item', ({ role }) => {
    if (!isOnlineMode() || !online.enabled || !online.isHost) return;
    if (state.phase !== 'playing') return;
    if (!ONLINE_GUEST_ROLES.includes(role)) return;
    if (useSelectedConsumable(roster[role])) {
      emitSnapshotNow();
    }
  });

  socket.on('duel_remote_select', (payload) => {
    if (!isOnlineMode() || !online.enabled || !online.isHost) return;
    if (payload?.type !== 'player_char') return;

    const role = payload.role;
    if (!ONLINE_GUEST_ROLES.includes(role)) return;

    const charId = String(payload.value || '').trim();
    if (!CHARACTER_BY_ID.has(charId)) return;

    state.selection[role] = charId;
    applyCharacter(roster[role], charId);
    resetMatch(true);
    setModeStatus(`${role.toUpperCase()} が ${roster[role].char.name} を選択`);
    refreshSelectionUi();
    updateControlUi();
    emitSnapshotNow();
  });

  socket.on('duel_snapshot', (snapshot) => {
    if (!isOnlineMode() || !online.enabled || online.isHost) return;
    applySnapshot(snapshot);
  });

  socket.on('disconnect', () => {
    if (isOnlineMode() && online.enabled) {
      rememberReconnectSession();
      showConnectionBanner('接続が切れました。再接続しています...', false, true);
      setModeStatus('接続が切れました。再接続中...');
      resetOnlineState();
      resetMatch(true);
      refreshSelectionUi();
      updateControlUi();
    }
  });
}

function updateFrame(now) {
  const dt = Math.min(0.033, (now - updateFrame.lastTime) / 1000 || 0);
  updateFrame.lastTime = now;

  update(dt);
  render();
  requestAnimationFrame(updateFrame);
}
updateFrame.lastTime = performance.now();

function bindUi() {
  bindPad(padP1, knobP1, touchState.p1);
  bindPad(padP2, knobP2, touchState.p2);

  modeLocalBtn.addEventListener('click', () => {
    unlockAudio();
    switchMode(PLAY_MODES.local);
  });

  modeOnlineBtn.addEventListener('click', () => {
    unlockAudio();
    switchMode(PLAY_MODES.online);
  });

  modeSingleBtn.addEventListener('click', () => {
    unlockAudio();
    switchMode(PLAY_MODES.single);
  });

  createRoomBtn.addEventListener('click', () => {
    unlockAudio();
    if (!socket || !isOnlineMode()) return;

    const preferredCode = (joinCodeInputEl.value || '').trim().toUpperCase();
    socket.emit('duel_create_room', {
      name: getPlayerName(),
      roomCode: preferredCode,
      npcCount: sanitizeNpcCount(npcCountSelectEl ? npcCountSelectEl.value : 0),
    });
  });

  joinRoomBtn.addEventListener('click', () => {
    unlockAudio();
    if (!socket || !isOnlineMode()) return;

    const code = (joinCodeInputEl.value || '').trim().toUpperCase();
    if (!code) {
      setModeStatus('参加コードを入力してください');
      return;
    }

    socket.emit('duel_join_room', {
      name: getPlayerName(),
      roomCode: code,
    });
  });

  leaveRoomBtn.addEventListener('click', () => {
    if (isOnlineMode()) {
      leaveOnlineRoom();
      setModeStatus('オンラインから退出しました');
      resetMatch(true);
      refreshSelectionUi();
      updateControlUi();
      resetStick(touchState.p1, knobP1);
      resetStick(touchState.p2, knobP2);
    }
  });

  if (npcCountSelectEl) {
    npcCountSelectEl.addEventListener('change', () => {
      const npcCount = sanitizeNpcCount(npcCountSelectEl.value);
      online.npcCount = npcCount;

      if (isOnlineMode() && online.enabled && online.isHost && socket) {
        socket.emit('duel_set_npc_count', { npcCount });
      } else if (isOnlineMode() && !online.enabled) {
        resetMatch(true);
      }

      refreshSelectionUi();
      updateControlUi();
    });
  }

  startBtn.addEventListener('click', () => {
    unlockAudio();
    startMatch();
  });

  resetBtn.addEventListener('click', () => {
    unlockAudio();
    if (isOnlineMode() && online.enabled && !online.isHost) return;

    resetMatch(true);
    resetStick(touchState.p1, knobP1);
    resetStick(touchState.p2, knobP2);
    emitSnapshotNow();
  });

  if (setupToggleBtn) {
    setupToggleBtn.addEventListener('click', () => {
      setArenaSetupOpen(!uiState.setupPanelOpen);
    });
  }

  bindPressAction(itemBtnP1, () => {
    unlockAudio();
    triggerItemUse('p1');
  });

  bindPressAction(itemBtnP2, () => {
    unlockAudio();
    triggerItemUse(getSecondaryControlRole());
  });

  bindPressAction(quickItemBtn, () => {
    unlockAudio();
    if (!uiState.activeItemSlot) return;
    triggerItemUse(uiState.activeItemSlot);
  });

  focusBtn.addEventListener('click', () => {
    setFocusMode(!uiState.focusMode);
  });

  window.addEventListener('keydown', (event) => {
    unlockAudio();

    if (
      event.code.startsWith('Arrow') ||
      ['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'Enter'].includes(event.code)
    ) {
      event.preventDefault();
    }

    heldKeys.add(event.code);

    if (event.code === 'Escape' && uiState.focusMode) {
      setFocusMode(false);
      return;
    }

    if (event.code === 'KeyQ') {
      triggerItemUse('p1');
    }
    if (event.code === 'Slash') {
      triggerItemUse(getSecondaryControlRole());
    }

    if ((event.code === 'Space' || event.code === 'Enter') && (state.phase === 'idle' || state.phase === 'match_over')) {
      startMatch();
    }
  });

  window.addEventListener('keyup', (event) => {
    heldKeys.delete(event.code);
  });
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;

  const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
  if (!window.isSecureContext && !isLocalhost) return;

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

function bootSelectionUi() {
  renderStageCards();
  renderCharacterCards(p1CharCardsEl, 0);
  renderCharacterCards(p2CharCardsEl, 1);

  state.selection.p1 = 'blaze';
  state.selection.p2 = 'fort';
  state.selection.p3 = 'swift';
  state.selection.p4 = 'crusher';
  state.selection.stageId = 'neon';

  applyCharacter(roster.p1, state.selection.p1);
  applyCharacter(roster.p2, state.selection.p2);
  applyCharacter(roster.p3, state.selection.p3);
  applyCharacter(roster.p4, state.selection.p4);
  if (npcCountSelectEl) {
    npcCountSelectEl.value = String(sanitizeNpcCount(npcCountSelectEl.value));
  }
  applyStage(state.selection.stageId);

  refreshSelectionUi();
}

bootSelectionUi();
bindUi();
setupSocketHandlers();
switchMode(PLAY_MODES.local, true);
updateControlUi();
resetMatch(true);
registerServiceWorker();
requestAnimationFrame(updateFrame);

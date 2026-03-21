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
const stagePreviewEl = document.getElementById('stagePreview');
const stagePreviewNameEl = document.getElementById('stagePreviewName');
const stagePreviewGimmickEl = document.getElementById('stagePreviewGimmick');
const stagePreviewSampleEl = document.getElementById('stagePreviewSample');
const p1CharCardsEl = document.getElementById('p1CharCards');
const p2CharCardsEl = document.getElementById('p2CharCards');

const modeLocalBtn = document.getElementById('modeLocalBtn');
const modeOnlineBtn = document.getElementById('modeOnlineBtn');
const modeSingleBtn = document.getElementById('modeSingleBtn');
const singleModeChoiceEl = document.getElementById('singleModeChoice');
const singleStoryBtn = document.getElementById('singleStoryBtn');
const singleFreeBtn = document.getElementById('singleFreeBtn');
const singleEndlessBtn = document.getElementById('singleEndlessBtn');
const steerAssistToggleEl = document.getElementById('steerAssistToggle');

const onlineControlsEl = document.getElementById('onlineControls');
const playerNameInputEl = document.getElementById('playerNameInput');
const npcCountSelectEl = document.getElementById('npcCountSelect');
const joinCodeInputEl = document.getElementById('joinCodeInput');
const createRoomBtn = document.getElementById('createRoomBtn');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const leaveRoomBtn = document.getElementById('leaveRoomBtn');
const modeStatusEl = document.getElementById('modeStatus');
const campaignInfoEl = document.getElementById('campaignInfo');
const onlinePanelEl = document.getElementById('onlinePanel');
const setupPanelEl = document.getElementById('setupPanel');
const arenaPanelEl = document.getElementById('arenaPanel');
const topPanelEl = document.getElementById('topPanel');

const stageChoiceBlockEl = document.getElementById('stageChoiceBlock');
const p1ChoiceBlockEl = document.getElementById('p1ChoiceBlock');
const p2ChoiceBlockEl = document.getElementById('p2ChoiceBlock');
const freeChoiceBlockEl = document.getElementById('freeChoiceBlock');
const p2CharTitleEl = document.getElementById('p2CharTitle');
const freeEnemyCountSelectEl = document.getElementById('freeEnemyCountSelect');
const freeEnemySlotButtonsEl = document.getElementById('freeEnemySlotButtons');
const freeEnemyHintEl = document.getElementById('freeEnemyHint');
const ruleTextEl = document.getElementById('ruleText');
const hintTextEl = document.getElementById('hintText');
const setupTitleMainEl = document.getElementById('setupTitleMain');
const setupStepTextEl = document.getElementById('setupStepText');
const setupBackBtn = document.getElementById('setupBackBtn');
const setupNextBtn = document.getElementById('setupNextBtn');

const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const titleBtn = document.getElementById('titleBtn');
const guideBtn = document.getElementById('guideBtn');
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
const netBadgeEl = document.getElementById('netBadge');
const rematchActionsEl = document.getElementById('rematchActions');
const rematchBtn = document.getElementById('rematchBtn');
const leaveQuickBtn = document.getElementById('leaveQuickBtn');
const rematchStatusEl = document.getElementById('rematchStatus');
const guideModalEl = document.getElementById('guideModal');
const guideCloseBtn = document.getElementById('guideCloseBtn');
const guideSkipBtn = document.getElementById('guideSkipBtn');
const guideStartBtn = document.getElementById('guideStartBtn');
const guideTabTutorialBtn = document.getElementById('guideTabTutorial');
const guideTabRulesBtn = document.getElementById('guideTabRules');
const guideTabItemsBtn = document.getElementById('guideTabItems');
const guideTabStagesBtn = document.getElementById('guideTabStages');
const guidePanelTutorialEl = document.getElementById('guidePanelTutorial');
const guidePanelRulesEl = document.getElementById('guidePanelRules');
const guidePanelItemsEl = document.getElementById('guidePanelItems');
const guidePanelStagesEl = document.getElementById('guidePanelStages');

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

const SINGLE_VARIANTS = {
  story: 'story',
  free: 'free',
  endless: 'endless',
};

const ROUND_COUNTDOWN_SECONDS = 3.9;
const ENDLESS_SPAWN_INTERVAL = 5;
const ENDLESS_STAGE_KILL_STEP = 10;
const ENDLESS_ELITE_SPAWN_STEP = 20;
const ENDLESS_STAGE_ROTATION = ['classic', 'neon', 'glacier', 'magma', 'storm', 'gravity', 'collapse'];
const ENDLESS_ENEMY_IDS = ['p2', 'p3', 'p4', 'npcA', 'npcB'];
const STEER_ASSIST_STORAGE_KEY = 'spin_smash_steer_assist_v1';
const GUIDE_TAB_IDS = {
  tutorial: 'tutorial',
  rules: 'rules',
  items: 'items',
  stages: 'stages',
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
    id: 'classic',
    name: 'Classic Arena',
    desc: 'ギミックなし。純粋な操作と読み合い',
    gimmick: 'なし（基準ステージ）',
    previewSample: 'サンプル: ノーギミック。標準バトル',
    arenaRadius: 390,
    drag: 0.966,
    impactScale: 1,
    speedScale: 1,
    projectileScale: 1,
    itemSpawnMin: 2,
    itemSpawnMax: 4,
    bgTop: '#11171e',
    bgBottom: '#090f16',
    ringColor: 'rgba(221, 235, 255, 0.52)',
    glowColor: 'rgba(149, 184, 255, %A%)',
    miniClass: 'stage-mini--classic',
  },
  {
    id: 'neon',
    name: 'Neon Dome',
    desc: '周期的なショック波を見切る読み合い',
    gimmick: 'Shock Pulse（中心から衝撃波）',
    previewSample: 'サンプル: 中央予告 -> 衝撃波が広がる',
    arenaRadius: 382,
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
    desc: '衝突で氷床が割れ、滑走ゾーンが生まれる',
    gimmick: 'Break Ice（低摩擦ゾーン）',
    previewSample: 'サンプル: ひび割れ後に滑る氷床ゾーン発生',
    arenaRadius: 368,
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
    desc: '噴出口の予告から吹き上げを避ける',
    gimmick: 'Vent Burst（噴火ノックバック）',
    previewSample: 'サンプル: 噴出口の予告後にバースト',
    arenaRadius: 398,
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
  {
    id: 'storm',
    name: 'Storm Alley',
    desc: '風向きが定期変化し、移動と弾道が流される',
    gimmick: 'Wind Shift（周期的な横風）',
    previewSample: 'サンプル: 矢印方向へ風が流れて押される',
    arenaRadius: 386,
    drag: 0.962,
    impactScale: 1.03,
    speedScale: 1,
    projectileScale: 1.02,
    itemSpawnMin: 2,
    itemSpawnMax: 4,
    bgTop: '#0d1f29',
    bgBottom: '#0b1720',
    ringColor: 'rgba(170, 222, 255, 0.62)',
    glowColor: 'rgba(126, 197, 255, %A%)',
    miniClass: 'stage-mini--storm',
  },
  {
    id: 'gravity',
    name: 'Gravity Core',
    desc: '吸引と斥力が切り替わり、軌道が変化する',
    gimmick: 'Gravity Flip（引力/斥力）',
    previewSample: 'サンプル: IN/OUT が周期切替',
    arenaRadius: 382,
    drag: 0.968,
    impactScale: 1.05,
    speedScale: 1,
    projectileScale: 1,
    itemSpawnMin: 2.1,
    itemSpawnMax: 4,
    bgTop: '#1a1030',
    bgBottom: '#0d0a1a',
    ringColor: 'rgba(213, 191, 255, 0.62)',
    glowColor: 'rgba(184, 132, 255, %A%)',
    miniClass: 'stage-mini--gravity',
  },
  {
    id: 'collapse',
    name: 'Collapse Ring',
    desc: '終盤にリングが縮小し、決着が早まる',
    gimmick: 'Ring Collapse（残り20秒から縮小）',
    previewSample: 'サンプル: 終盤でリングが縮小',
    arenaRadius: 394,
    drag: 0.962,
    impactScale: 1.08,
    speedScale: 1,
    projectileScale: 1.02,
    itemSpawnMin: 1.9,
    itemSpawnMax: 3.6,
    bgTop: '#211819',
    bgBottom: '#120d0f',
    ringColor: 'rgba(255, 196, 196, 0.64)',
    glowColor: 'rgba(255, 124, 140, %A%)',
    miniClass: 'stage-mini--collapse',
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
    title: 'Classic Opening',
    stageId: 'classic',
    enemies: [
      {
        charId: 'swift',
        slot: 'CPU-ALPHA',
        scale: { attack: 0.62, defense: 0.68, speed: 0.74, size: 0.9, mass: 0.78 },
        ai: { aggression: 0.52, edgeCare: 0.88, strafe: 0.1, jitter: 0.12 },
      },
    ],
  },
  {
    id: 'stage2',
    title: 'Pulse Clash',
    stageId: 'neon',
    enemies: [
      {
        charId: 'blaze',
        slot: 'CPU-BLAZE',
        scale: { attack: 0.78, defense: 0.8, speed: 0.84, size: 0.94, mass: 0.86 },
        ai: { aggression: 0.68, edgeCare: 0.94, strafe: 0.18, jitter: 0.18 },
      },
    ],
  },
  {
    id: 'stage3',
    title: 'Cracked Ice',
    stageId: 'glacier',
    enemies: [
      {
        charId: 'fort',
        slot: 'CPU-FORT',
        scale: { attack: 0.9, defense: 0.92, speed: 0.9, size: 0.96, mass: 0.9 },
        ai: { aggression: 0.78, edgeCare: 1.0, strafe: 0.24, jitter: 0.22 },
      },
    ],
  },
  {
    id: 'stage4',
    title: 'Vent Pressure',
    stageId: 'magma',
    enemies: [
      {
        charId: 'crusher',
        slot: 'CPU-BLAST',
        scale: { attack: 1.18, defense: 1.12, speed: 1.06, size: 1.03, mass: 1.14 },
        ai: { aggression: 1.12, edgeCare: 1.14, strafe: 0.42, jitter: 0.3 },
      },
    ],
  },
  {
    id: 'stage5',
    title: 'Wind Twins',
    stageId: 'storm',
    enemies: [
      {
        charId: 'swift',
        slot: 'CPU-GUST',
        scale: { attack: 1.17, defense: 1.1, speed: 1.16, size: 0.98, mass: 1.0 },
        ai: { aggression: 1.14, edgeCare: 1.1, strafe: 0.62, jitter: 0.48 },
      },
      {
        charId: 'balance',
        slot: 'CPU-DRIFT',
        scale: { attack: 1.18, defense: 1.14, speed: 1.12, size: 1.02, mass: 1.1 },
        ai: { aggression: 1.12, edgeCare: 1.15, strafe: 0.44, jitter: 0.38 },
      },
    ],
  },
  {
    id: 'stage6',
    title: 'Gravity Duel',
    stageId: 'gravity',
    enemies: [
      {
        charId: 'blaze',
        slot: 'CPU-CORE',
        scale: { attack: 1.28, defense: 1.2, speed: 1.18, size: 1.02, mass: 1.17 },
        ai: { aggression: 1.24, edgeCare: 1.18, strafe: 0.56, jitter: 0.36 },
      },
    ],
  },
  {
    id: 'stage7',
    title: 'Collapse Finale',
    stageId: 'collapse',
    enemies: [
      {
        charId: 'fort',
        slot: 'CPU-GUARD',
        scale: { attack: 1.28, defense: 1.34, speed: 1.12, size: 1.08, mass: 1.28 },
        ai: { aggression: 1.2, edgeCare: 1.24, strafe: 0.4, jitter: 0.22 },
      },
      {
        charId: 'blaze',
        slot: 'CPU-FLARE',
        scale: { attack: 1.36, defense: 1.2, speed: 1.22, size: 1.0, mass: 1.16 },
        ai: { aggression: 1.34, edgeCare: 1.15, strafe: 0.68, jitter: 0.44 },
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
  pingTimer: 0,
  pingPending: false,
  pingSentAt: 0,
  pingMs: null,
  pingQuality: 'unknown',
  rematchReadyByRole: {},
  rematchReadyCount: 0,
  rematchRequiredCount: 0,
  rematchLocalReady: false,
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

function loadSteerAssistSetting() {
  try {
    const saved = localStorage.getItem(STEER_ASSIST_STORAGE_KEY);
    if (saved === '0') return false;
    if (saved === '1') return true;
  } catch (_) {
    // ignore storage errors and fall back to default
  }
  return true;
}

function saveSteerAssistSetting(enabled) {
  try {
    localStorage.setItem(STEER_ASSIST_STORAGE_KEY, enabled ? '1' : '0');
  } catch (_) {
    // ignore storage errors
  }
}

function setSteerAssistEnabled(enabled, persist = true) {
  controlOptions.steerAssist = Boolean(enabled);
  if (steerAssistToggleEl) {
    steerAssistToggleEl.checked = controlOptions.steerAssist;
  }
  if (persist) {
    saveSteerAssistSetting(controlOptions.steerAssist);
  }
  updateControlUi();
}

function getArenaRadius() {
  return state.arenaRadiusCurrent || state.stage?.arenaRadius || 360;
}

function createStageFx() {
  const stageId = state.stageId;

  if (stageId === 'neon') {
    return {
      pulseTimer: randomRange(5.8, 7.2),
      pulseWarning: 0,
      pulseWaveActive: false,
      pulseWaveRadius: 0,
      pulseFlash: 0,
      pulseHitIds: [],
    };
  }

  if (stageId === 'glacier') {
    return {
      breakCharge: 0,
      iceZone: null,
    };
  }

  if (stageId === 'magma') {
    return {
      ventTimer: randomRange(2.2, 3.8),
      vents: [],
    };
  }

  if (stageId === 'storm') {
    const angle = randomRange(0, Math.PI * 2);
    return {
      windTimer: randomRange(3.8, 5.4),
      windAngle: angle,
      windX: Math.cos(angle),
      windY: Math.sin(angle),
      windStrength: randomRange(76, 108),
      windPulse: 0,
    };
  }

  if (stageId === 'gravity') {
    return {
      gravityTimer: randomRange(4.4, 5.8),
      gravityMode: 'in',
      gravityPulse: 0,
    };
  }

  if (stageId === 'collapse') {
    return {
      collapseWarned: false,
      collapseRatio: 1,
    };
  }

  return {};
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
    knockbackGraceTimer: 0,
    knockbackSpeedLimit: 0,
    itemDisabled: false,
    aimX: 1,
    aimY: 0,
    cooldownFire: 0,
    cooldownIce: 0,
    itemDecisionTimer: randomRange(0.28, 0.7),
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
  playMode: PLAY_MODES.single,
  phase: 'idle',
  round: 1,
  timer: CONFIG.roundSeconds,
  betweenTimer: 0,
  countdownTimer: 0,
  stageId: 'classic',
  stage: STAGE_BY_ID.get('classic'),
  arenaRadiusCurrent: STAGE_BY_ID.get('classic').arenaRadius,
  stageFx: {},
  ringPulse: 0,
  status: 'Tapでバトル開始',
  scoreLeft: 0,
  scoreRight: 0,
  battleRoyale: false,
  activePlayers: [roster.p1, roster.p2],
  activePlayerIds: ['p1', 'p2'],
  itemTimer: 3,
  item: null,
  itemWarning: null,
  bullets: [],
  bombs: [],
  particles: [],
  sparks: [],
  impactRings: [],
  shakeTime: 0,
  shakePower: 0,
  lastCollisionSfxAt: 0,
  selection: {
    stageId: 'classic',
    p1: 'blaze',
    p2: 'fort',
    p3: 'swift',
    p4: 'crusher',
  },
  single: {
    variant: SINGLE_VARIANTS.story,
    stageIndex: 0,
    campaignComplete: false,
    pendingAdvance: null,
    free: {
      enemyCount: 1,
      activeSlot: 0,
    },
    endless: {
      kills: 0,
      spawnTimer: ENDLESS_SPAWN_INTERVAL,
      totalSpawned: 0,
      lastStageShiftAt: 0,
      stageCursor: 0,
      bestKills: 0,
    },
  },
};

state.stageFx = createStageFx();

const audio = {
  ctx: null,
  master: null,
  bgmTimer: null,
  bgmStep: 0,
};

let audioUnlockPrimed = false;

const uiState = {
  focusMode: false,
  activeItemSlot: null,
  setupPanelOpen: false,
  guideOpen: false,
  guideTab: GUIDE_TAB_IDS.tutorial,
};

const controlOptions = {
  steerAssist: loadSteerAssistSetting(),
};

const FLOW_SCENES = {
  title: 'title',
  onlineLobby: 'online_lobby',
  setup: 'setup',
  game: 'game',
};

const flowState = {
  scene: FLOW_SCENES.title,
  setupContext: 'single_story',
  setupSteps: [],
  setupIndex: 0,
  singleChoiceOpen: false,
};

function keepViewportTop() {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
}

function isSingleMode() {
  return state.playMode === PLAY_MODES.single;
}

function isOnlineMode() {
  return state.playMode === PLAY_MODES.online;
}

function isSingleStoryMode() {
  return isSingleMode() && state.single.variant === SINGLE_VARIANTS.story;
}

function isSingleFreeMode() {
  return isSingleMode() && state.single.variant === SINGLE_VARIANTS.free;
}

function isSingleEndlessMode() {
  return isSingleMode() && state.single.variant === SINGLE_VARIANTS.endless;
}

function resetEndlessProgress() {
  state.single.endless.kills = 0;
  state.single.endless.spawnTimer = ENDLESS_SPAWN_INTERVAL;
  state.single.endless.totalSpawned = 0;
  state.single.endless.lastStageShiftAt = 0;
  state.single.endless.stageCursor = 0;
}

function getFreeEnemyRoleBySlot(slotIndex) {
  if (slotIndex === 0) return 'p2';
  if (slotIndex === 1) return 'p3';
  return 'p4';
}

function getFreeEnemyCount() {
  return clamp(Number(state.single.free.enemyCount) || 1, 1, 3);
}

function getFreeEnemyRoles() {
  const count = getFreeEnemyCount();
  return Array.from({ length: count }, (_, index) => getFreeEnemyRoleBySlot(index));
}

function shouldUseBattleRoyale() {
  if (isOnlineMode()) {
    return state.activePlayers.length >= 3;
  }
  if (isSingleFreeMode()) {
    return state.activePlayers.length >= 3;
  }
  return false;
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

function setFlowScene(scene) {
  flowState.scene = scene;
  keepViewportTop();

  if (onlinePanelEl) {
    onlinePanelEl.classList.toggle('is-flow-visible', scene === FLOW_SCENES.title || scene === FLOW_SCENES.onlineLobby);
  }
  if (setupPanelEl) {
    setupPanelEl.classList.toggle('is-flow-visible', scene === FLOW_SCENES.setup);
  }
  if (arenaPanelEl) {
    arenaPanelEl.classList.toggle('is-flow-visible', scene === FLOW_SCENES.game);
  }
  if (topPanelEl) {
    topPanelEl.classList.remove('is-flow-visible');
  }

  document.body.classList.toggle('flow-title', scene === FLOW_SCENES.title);
  document.body.classList.toggle('flow-online-lobby', scene === FLOW_SCENES.onlineLobby);
  document.body.classList.toggle('flow-setup', scene === FLOW_SCENES.setup);
  document.body.classList.toggle('flow-game', scene === FLOW_SCENES.game);

  if (scene !== FLOW_SCENES.game && uiState.focusMode) {
    setFocusMode(false);
  }

  if (scene === FLOW_SCENES.title) {
    audio.bgmStep = 0;
    if (onlineControlsEl) onlineControlsEl.classList.add('is-hidden');
    if (isSingleMode()) {
      if (flowState.singleChoiceOpen) {
        setModeStatus('SINGLE: STORY / FREE BATTLE / ENDLESS を選択');
        setCampaignInfoText();
      } else {
        setModeStatus('モードを選択してください');
        campaignInfoEl.textContent = 'SINGLEを押すと STORY / FREE / ENDLESS を選択';
      }
    } else {
      setModeStatus('モードを選択してください');
      campaignInfoEl.textContent = 'SPIN SMASH';
    }
  } else if (scene === FLOW_SCENES.onlineLobby) {
    if (onlineControlsEl) onlineControlsEl.classList.remove('is-hidden');
    setModeStatus('オンライン | ルーム作成 or 参加コード入力');
    campaignInfoEl.textContent = 'ルーム接続後にセレクトへ進みます';
  }

  refreshSelectionUi();
  updateControlUi();
  renderNetBadge();
  refreshRematchUi();
}

function setupStepsForContext(context) {
  if (context === 'single_story') {
    return [{ key: 'p1', label: 'YOUR CHARACTER' }];
  }
  if (context === 'single_free') {
    return [
      { key: 'stage', label: 'STAGE SELECT' },
      { key: 'p1', label: 'YOUR CHARACTER' },
      { key: 'free', label: 'FREE BATTLE' },
    ];
  }
  if (context === 'local') {
    return [
      { key: 'stage', label: 'STAGE SELECT' },
      { key: 'p1', label: 'P1 CHARACTER' },
      { key: 'p2', label: 'P2 CHARACTER' },
    ];
  }
  if (context === 'online_host') {
    return [
      { key: 'stage', label: 'HOST STAGE SELECT' },
      { key: 'p1', label: 'HOST CHARACTER' },
    ];
  }
  return [{ key: 'p2', label: 'YOUR CHARACTER' }];
}

function renderSetupStep() {
  const steps = flowState.setupSteps;
  const index = clamp(flowState.setupIndex, 0, Math.max(steps.length - 1, 0));
  flowState.setupIndex = index;
  const step = steps[index];

  if (!step) return;

  if (stageChoiceBlockEl) stageChoiceBlockEl.classList.toggle('is-flow-active', step.key === 'stage');
  if (p1ChoiceBlockEl) p1ChoiceBlockEl.classList.toggle('is-flow-active', step.key === 'p1');
  if (p2ChoiceBlockEl) p2ChoiceBlockEl.classList.toggle('is-flow-active', step.key === 'p2' || step.key === 'free');
  if (freeChoiceBlockEl) {
    freeChoiceBlockEl.classList.toggle('is-hidden', flowState.setupContext !== 'single_free');
    freeChoiceBlockEl.classList.toggle('is-flow-active', step.key === 'free');
  }
  if (setupPanelEl) {
    const isFreeStep = flowState.setupContext === 'single_free' && step.key === 'free';
    setupPanelEl.classList.toggle('is-free-step', isFreeStep);
  }

  if (setupTitleMainEl) {
    if (flowState.setupContext === 'single_story') {
      setupTitleMainEl.textContent = isSingleEndlessMode() ? 'ENDLESS SETUP' : 'STORY SETUP';
    }
    else if (flowState.setupContext === 'single_free') setupTitleMainEl.textContent = 'FREE BATTLE SETUP';
    else if (flowState.setupContext === 'local') setupTitleMainEl.textContent = 'LOCAL 2P SETUP';
    else setupTitleMainEl.textContent = 'ONLINE SETUP';
  }

  if (setupStepTextEl) {
    setupStepTextEl.textContent = `STEP ${index + 1}/${steps.length} | ${step.label}`;
  }

  if (setupBackBtn) {
    setupBackBtn.textContent = index === 0 ? (flowState.setupContext.startsWith('online') ? 'Back Lobby' : 'Back Title') : 'Back';
  }
  if (setupNextBtn) {
    setupNextBtn.textContent = index >= steps.length - 1 ? 'ゲームへ' : 'Next';
  }

  if (p2CharTitleEl && (step.key === 'p2' || step.key === 'free')) {
    if (flowState.setupContext === 'single_free') {
      p2CharTitleEl.textContent = `ENEMY ${state.single.free.activeSlot + 1} CHARACTER`;
    } else if (flowState.setupContext === 'online_guest') {
      p2CharTitleEl.textContent = `${getOnlineOwnRole().toUpperCase()} CHARACTER`;
    } else {
      p2CharTitleEl.textContent = 'P2 CHARACTER';
    }
  }

  if (freeEnemyCountSelectEl) {
    freeEnemyCountSelectEl.value = String(getFreeEnemyCount());
  }
  if (freeEnemyHintEl && flowState.setupContext === 'single_free') {
    freeEnemyHintEl.textContent = `ENEMY ${state.single.free.activeSlot + 1} のキャラクターを選択`;
  }
  if (freeEnemySlotButtonsEl && flowState.setupContext === 'single_free') {
    const count = getFreeEnemyCount();
    freeEnemySlotButtonsEl.querySelectorAll('[data-free-slot]').forEach((button) => {
      const slot = clamp(Number(button.dataset.freeSlot), 0, 2);
      button.disabled = slot >= count;
      button.classList.toggle('is-active', slot === state.single.free.activeSlot);
    });
  }
}

function setSingleVariant(nextVariant, byUser = false) {
  const variant = nextVariant === SINGLE_VARIANTS.free
    ? SINGLE_VARIANTS.free
    : nextVariant === SINGLE_VARIANTS.endless
      ? SINGLE_VARIANTS.endless
      : SINGLE_VARIANTS.story;
  state.single.variant = variant;
  state.single.stageIndex = 0;
  state.single.pendingAdvance = null;
  state.single.campaignComplete = false;

  if (variant === SINGLE_VARIANTS.story) {
    const stage = getCampaignStage();
    applyStage(stage.stageId);
    setModeStatus('STORY | 全7ステージを勝ち抜け');
  } else if (variant === SINGLE_VARIANTS.free) {
    applyStage(state.selection.stageId);
    setModeStatus('FREE BATTLE | 条件を自由に選んで対戦');
  } else {
    resetEndlessProgress();
    applyStage(ENDLESS_STAGE_ROTATION[0]);
    setModeStatus('ENDLESS | 無制限サバイバルで撃破数を伸ばせ');
  }

  updateRuleText();
  updateHintText();
  setCampaignInfoText();
  refreshSelectionUi();

  if (byUser) {
    unlockAudio();
    playSfx('menu');
  }
}

function beginSingleSetupFlow() {
  beginSetupFlow((isSingleStoryMode() || isSingleEndlessMode()) ? 'single_story' : 'single_free');
}

function beginSetupFlow(context) {
  flowState.setupContext = context;
  flowState.setupSteps = setupStepsForContext(context);
  flowState.setupIndex = 0;
  setFlowScene(FLOW_SCENES.setup);
  renderSetupStep();
}

function enterGameScene() {
  setFlowScene(FLOW_SCENES.game);
  resetMatch(true);
  resetStick(touchState.p1, knobP1);
  resetStick(touchState.p2, knobP2);
}

function beginModeFlow(mode) {
  switchMode(mode);

  if (mode === PLAY_MODES.online) {
    flowState.singleChoiceOpen = false;
    setFlowScene(FLOW_SCENES.onlineLobby);
    return;
  }

  if (mode === PLAY_MODES.single) {
    flowState.singleChoiceOpen = true;
    setFlowScene(FLOW_SCENES.title);
    setModeStatus('SINGLE: STORY / FREE BATTLE / ENDLESS を選択');
    setCampaignInfoText();
    return;
  }

  flowState.singleChoiceOpen = false;
  beginSetupFlow('local');
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

function classifyPingQuality(ms) {
  if (!Number.isFinite(ms)) return 'unknown';
  if (ms <= 85) return 'good';
  if (ms <= 170) return 'fair';
  return 'poor';
}

function resetPingState() {
  online.pingTimer = 0;
  online.pingPending = false;
  online.pingSentAt = 0;
  online.pingMs = null;
  online.pingQuality = 'unknown';
}

function renderNetBadge() {
  if (!netBadgeEl) return;

  const visible = isOnlineMode() && online.enabled;
  netBadgeEl.classList.toggle('is-hidden', !visible);
  if (!visible) return;

  const msText = Number.isFinite(online.pingMs) ? `${Math.round(online.pingMs)}ms` : '--';
  const qualityLabel = online.pingQuality === 'good'
    ? 'GOOD'
    : online.pingQuality === 'fair'
      ? 'FAIR'
      : online.pingQuality === 'poor'
        ? 'POOR'
        : '...';

  netBadgeEl.textContent = `NET ${msText} ${qualityLabel}`;
  netBadgeEl.classList.remove('quality-good', 'quality-fair', 'quality-poor');
  if (online.pingQuality === 'good') netBadgeEl.classList.add('quality-good');
  if (online.pingQuality === 'fair') netBadgeEl.classList.add('quality-fair');
  if (online.pingQuality === 'poor') netBadgeEl.classList.add('quality-poor');
}

function resetRematchState() {
  online.rematchReadyByRole = {};
  online.rematchReadyCount = 0;
  online.rematchRequiredCount = 0;
  online.rematchLocalReady = false;
}

function applyRematchState(payload) {
  const readyByRole = payload?.readyByRole || {};
  const next = {};
  ONLINE_PLAYER_ROLES.forEach((role) => {
    next[role] = Boolean(readyByRole[role]);
  });
  online.rematchReadyByRole = next;
  online.rematchReadyCount = clamp(Number(payload?.readyCount) || 0, 0, 4);
  online.rematchRequiredCount = clamp(Number(payload?.requiredCount) || 0, 0, 4);

  const ownRole = getOnlineOwnRole();
  online.rematchLocalReady = Boolean(next[ownRole]);
}

function refreshRematchUi() {
  if (!rematchActionsEl || !rematchBtn || !rematchStatusEl) return;

  const visible = isOnlineMode() && online.enabled && state.phase === 'match_over';
  rematchActionsEl.classList.toggle('is-hidden', !visible);
  if (!visible) return;

  rematchBtn.textContent = online.rematchLocalReady ? 'Ready ✓' : 'Rematch';
  rematchBtn.classList.toggle('action-btn--ghost', online.rematchLocalReady);

  const ready = online.rematchReadyCount;
  const required = online.rematchRequiredCount;
  rematchStatusEl.textContent = `再戦準備 ${ready}/${required}`;
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

function getPrimaryControlRole() {
  if (isOnlineMode() && online.enabled && !online.isHost) {
    return getOnlineOwnRole();
  }
  return 'p1';
}

function isUserControlledPlayer(player) {
  if (!player) return false;
  return player.id === getPrimaryControlRole();
}

function getSelectionRoleByIndex(index) {
  if (index === 0) return 'p1';
  if (isSingleMode()) {
    if (!isSingleFreeMode()) return null;
    return getFreeEnemyRoleBySlot(state.single.free.activeSlot);
  }
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

  applyRematchState(payload.rematch || {});
  refreshRematchUi();
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
  const next = STAGE_BY_ID.get(stageId) || STAGE_BY_ID.get('classic');
  state.stageId = next.id;
  state.stage = next;
  state.arenaRadiusCurrent = next.arenaRadius;
  state.stageFx = createStageFx();
  state.itemTimer = randomRange(next.itemSpawnMin, next.itemSpawnMax);
  state.itemWarning = null;
  audio.bgmStep = 0;
}

function canEditStageSelection() {
  if (isSingleStoryMode() || isSingleEndlessMode()) return false;
  if (isSingleFreeMode()) return true;
  if (!isOnlineMode()) return true;
  if (!online.enabled) return true;
  return online.isHost;
}

function canEditCharacter(index) {
  if (isSingleMode() && index === 1) return isSingleFreeMode();
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

  if (byUser) {
    unlockAudio();
    playSfx('menu');
  }

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
    unlockAudio();
    playSfx('menu');
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
    `;

    card.addEventListener('click', () => selectStage(stage.id, true));
    stageCardsEl.appendChild(card);
  });
}

function updateStagePreview() {
  if (!stagePreviewEl) return;
  const stage = STAGE_BY_ID.get(state.stageId) || state.stage;
  if (!stage) return;

  stagePreviewEl.className = `stage-preview stage-preview--${stage.id}`;
  if (stagePreviewNameEl) {
    stagePreviewNameEl.textContent = stage.name;
  }
  if (stagePreviewGimmickEl) {
    stagePreviewGimmickEl.textContent = `ギミック: ${stage.gimmick || stage.desc}`;
  }
  if (stagePreviewSampleEl) {
    stagePreviewSampleEl.textContent = stage.previewSample || 'サンプル演出';
  }
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
  if (isSingleEndlessMode()) {
    return state.activePlayers.filter((player) => player.id !== 'p1');
  }
  if (isSingleFreeMode()) {
    const slots = ['p2', 'npcA', 'npcB'];
    const count = getFreeEnemyCount();
    return slots.slice(0, count).map((id) => roster[id]).filter(Boolean);
  }
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
      p2NameEl.textContent = isSingleFreeMode() ? `RIVALS x${enemies.length}` : 'ENEMY TEAM';
    } else if (isSingleEndlessMode() && enemies.length === 0) {
      p2NameEl.textContent = 'ENEMY | SPAWNING...';
    } else {
      const enemy = enemies[0] || roster.npcA;
      p2NameEl.textContent = `${enemy.slot} | ${enemy.char.name}`;
    }
    return;
  }

  if (isOnlineMode() && online.enabled) {
    const enemyCount = getOnlineEnemyCount();
    const humanRoles = getOnlineRemoteRoles();
    if (state.battleRoyale && enemyCount > 1) {
      p2NameEl.textContent = `FIELD x${enemyCount}`;
    } else if (enemyCount > 1) {
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
  if (singleStoryBtn) singleStoryBtn.classList.toggle('is-active', isSingleStoryMode());
  if (singleFreeBtn) singleFreeBtn.classList.toggle('is-active', isSingleFreeMode());
  if (singleEndlessBtn) singleEndlessBtn.classList.toggle('is-active', isSingleEndlessMode());

  const showSingleChoice = isSingleMode() && flowState.scene === FLOW_SCENES.title && flowState.singleChoiceOpen;
  if (singleModeChoiceEl) singleModeChoiceEl.classList.toggle('is-hidden', !showSingleChoice);

  const showOnlineControls = isOnlineMode() && flowState.scene === FLOW_SCENES.onlineLobby;
  onlineControlsEl.classList.toggle('is-hidden', !showOnlineControls);
  p2ChoiceBlockEl.classList.toggle('is-hidden', isSingleStoryMode() || isSingleEndlessMode());

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
    if (isSingleFreeMode()) {
      p2CharTitleEl.textContent = 'ENEMY CHARACTER';
    } else if (isSingleStoryMode()) {
      p2CharTitleEl.textContent = 'ENEMY CHARACTER';
    } else if (isSingleEndlessMode()) {
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

  if (freeEnemyCountSelectEl) {
    freeEnemyCountSelectEl.value = String(getFreeEnemyCount());
  }
  if (freeEnemySlotButtonsEl) {
    const enemyCount = getFreeEnemyCount();
    freeEnemySlotButtonsEl.querySelectorAll('[data-free-slot]').forEach((button) => {
      const slot = clamp(Number(button.dataset.freeSlot), 0, 2);
      button.disabled = slot >= enemyCount;
      button.classList.toggle('is-active', slot === state.single.free.activeSlot);
    });
  }
  if (freeEnemyHintEl && isSingleFreeMode()) {
    const role = getFreeEnemyRoleBySlot(state.single.free.activeSlot);
    const pickedId = state.selection[role];
    const pickedChar = CHARACTER_BY_ID.get(pickedId);
    freeEnemyHintEl.textContent = pickedChar
      ? `ENEMY ${state.single.free.activeSlot + 1}: ${pickedChar.name}`
      : `ENEMY ${state.single.free.activeSlot + 1} のキャラクターを選択`;
  }

  updateStagePreview();
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
  resetPingState();
  resetRematchState();
  renderNetBadge();
  refreshRematchUi();
}

function leaveOnlineRoom() {
  if (socket && online.enabled) {
    socket.emit('duel_leave_room');
  }
  clearReconnectSession();
  hideConnectionBanner();
  resetOnlineState();
}

function leaveOnlineFromUi(statusText = 'オンラインから退出しました') {
  if (!isOnlineMode()) return;
  leaveOnlineRoom();
  setModeStatus(statusText);
  flowState.singleChoiceOpen = false;
  resetMatch(true);
  refreshSelectionUi();
  updateControlUi();
  resetStick(touchState.p1, knobP1);
  resetStick(touchState.p2, knobP2);
  setFlowScene(FLOW_SCENES.title);
}

function returnToTitleFromBattle() {
  if (isOnlineMode() && online.enabled) {
    leaveOnlineFromUi('タイトルへ戻りました');
    return;
  }

  flowState.singleChoiceOpen = false;
  resetMatch(true);
  resetStick(touchState.p1, knobP1);
  resetStick(touchState.p2, knobP2);
  setFlowScene(FLOW_SCENES.title);
}

function setRematchReady(nextReady, byUser = false) {
  if (!isOnlineMode() || !online.enabled) return;
  const ownRole = getOnlineOwnRole();
  online.rematchLocalReady = Boolean(nextReady);
  online.rematchReadyByRole[ownRole] = online.rematchLocalReady;
  refreshRematchUi();

  if (byUser && socket) {
    socket.emit('duel_rematch_ready', { ready: online.rematchLocalReady });
    setModeStatus(online.rematchLocalReady ? '再戦準備OK。全員の準備待ち' : '再戦準備を解除');
  }
}

function setActivePlayers(ids) {
  state.activePlayerIds = ids.slice();
  state.activePlayers = ids.map((id) => roster[id]).filter(Boolean);
}

function configureSingleStoryEnemies() {
  const stage = getCampaignStage();
  if (!stage) return;

  const enemyA = stage.enemies[0];
  const enemyB = stage.enemies[1];

  if (enemyA) applyEnemyTuning(roster.npcA, enemyA, 0);
  if (enemyB) applyEnemyTuning(roster.npcB, enemyB, 1);
  roster.npcA.itemDisabled = false;
  roster.npcB.itemDisabled = false;

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

function configureSingleFreeEnemies() {
  const enemyRoles = getFreeEnemyRoles();
  const enemySlots = ['p2', 'npcA', 'npcB'];
  const activeIds = ['p1'];

  enemyRoles.forEach((role, index) => {
    const playerId = enemySlots[index];
    const player = roster[playerId];
    if (!player) return;

    const pickedCharId = state.selection[role] || 'balance';
    applyCharacter(player, pickedCharId);
    player.isBot = true;
    player.team = 'right';
    player.itemDisabled = false;
    player.slot = `CPU-${index + 1}`;
    player.ai = {
      aggression: 0.96 + index * 0.08,
      edgeCare: 1.08 + index * 0.04,
      strafe: 0.34 + index * 0.08,
      jitter: 0.34 + index * 0.05,
    };

    activeIds.push(playerId);
  });

  setActivePlayers(activeIds);
}

function tuneEndlessEnemy(player, isElite, spawnIndex) {
  player.isBot = true;
  player.team = 'right';
  player.itemDisabled = true;

  if (isElite) {
    const eliteChars = ['blaze', 'fort', 'swift', 'crusher', 'balance'];
    const charId = eliteChars[Math.floor(Math.random() * eliteChars.length)];
    applyCharacter(player, charId);
    player.attackMul *= 1.02;
    player.defenseMul *= 1.0;
    player.speedMul *= 1.0;
    player.baseRadius *= 0.92;
    player.massBase *= 0.9;
    player.radius = player.baseRadius;
    player.slot = `ELITE-${Math.max(1, Math.floor(spawnIndex / ENDLESS_ELITE_SPAWN_STEP))}`;
    player.ai = {
      aggression: 1.08,
      edgeCare: 1.04,
      strafe: 0.46,
      jitter: 0.34,
    };
    return;
  }

  applyCharacter(player, 'swift');
  player.attackMul *= 0.46;
  player.defenseMul *= 0.7;
  player.speedMul *= 0.8;
  player.baseRadius *= 0.64;
  player.massBase *= 0.56;
  player.radius = player.baseRadius;
  player.slot = `MOB-${spawnIndex}`;
  player.ai = {
    aggression: 0.56,
    edgeCare: 0.94,
    strafe: 0.2,
    jitter: 0.24,
  };
}

function spawnEndlessEnemy(force = false) {
  if (!isSingleEndlessMode()) return false;

  const currentEnemies = state.activePlayers.filter((player) => player.id !== 'p1').length;
  if (!force && currentEnemies >= ENDLESS_ENEMY_IDS.length) return false;

  const nextId = ENDLESS_ENEMY_IDS.find((id) => !state.activePlayerIds.includes(id));
  if (!nextId) return false;

  const endless = state.single.endless;
  const spawnIndex = endless.totalSpawned + 1;
  const isElite = spawnIndex % ENDLESS_ELITE_SPAWN_STEP === 0;
  const player = roster[nextId];
  if (!player) return false;

  tuneEndlessEnemy(player, isElite, spawnIndex);

  const angle = Math.random() * Math.PI * 2;
  const spawnDistance = Math.max(150, getArenaRadius() * 0.72);
  const x = center.x + Math.cos(angle) * spawnDistance;
  const y = center.y + Math.sin(angle) * spawnDistance;
  resetPlayer(player, x, y);
  player.itemDisabled = true;

  const toCenterX = center.x - player.x;
  const toCenterY = center.y - player.y;
  const toCenterLen = Math.hypot(toCenterX, toCenterY) || 1;
  const initSpeed = isElite ? 180 : 120;
  player.vx = (toCenterX / toCenterLen) * initSpeed;
  player.vy = (toCenterY / toCenterLen) * initSpeed;

  setActivePlayers([...state.activePlayerIds, nextId]);
  endless.totalSpawned = spawnIndex;

  if (isElite) {
    playSfx('spawnWarn');
    setStatus(`ENDLESS: ELITE ${player.slot} 出現!`);
  }
  return true;
}

function updateEndlessSpawns(dt) {
  if (!isSingleEndlessMode() || state.phase !== 'playing') return;

  const endless = state.single.endless;
  endless.spawnTimer -= dt;
  while (endless.spawnTimer <= 0) {
    const spawned = spawnEndlessEnemy(false);
    endless.spawnTimer += ENDLESS_SPAWN_INTERVAL;
    if (!spawned) {
      endless.spawnTimer = Math.max(0.9, endless.spawnTimer);
      break;
    }
  }
}

function keepPlayersInsideArena() {
  const radius = getArenaRadius();
  state.activePlayers.forEach((player) => {
    const dx = player.x - center.x;
    const dy = player.y - center.y;
    const dist = Math.hypot(dx, dy) || 1;
    const limit = Math.max(24, radius - player.radius * 1.2);
    if (dist <= limit) return;
    const ratio = limit / dist;
    player.x = center.x + dx * ratio;
    player.y = center.y + dy * ratio;
  });
}

function applyEndlessStageShiftIfNeeded() {
  const endless = state.single.endless;
  let shifted = false;
  while (endless.kills >= endless.lastStageShiftAt + ENDLESS_STAGE_KILL_STEP) {
    endless.lastStageShiftAt += ENDLESS_STAGE_KILL_STEP;
    endless.stageCursor = (endless.stageCursor + 1) % ENDLESS_STAGE_ROTATION.length;
    const nextStageId = ENDLESS_STAGE_ROTATION[endless.stageCursor];
    applyStage(nextStageId);
    keepPlayersInsideArena();
    shifted = true;
  }

  if (shifted) {
    playSfx('spawnWarn');
    setStatus(`ENDLESS: ${endless.kills}体撃破! STAGEが ${state.stage.name} に変化`);
  }
}

function configureSingleEndlessEnemies() {
  applyStage(ENDLESS_STAGE_ROTATION[0]);
  ENDLESS_ENEMY_IDS.forEach((id) => {
    const enemy = roster[id];
    if (!enemy) return;
    enemy.isBot = true;
    enemy.team = 'right';
    enemy.itemDisabled = true;
    enemy.slot = 'MOB';
    enemy.ai = {
      aggression: 0.56,
      edgeCare: 0.94,
      strafe: 0.2,
      jitter: 0.24,
    };
    applyCharacter(enemy, 'swift');
  });
  setActivePlayers(['p1']);
}

function configureSingleEnemies() {
  if (isSingleEndlessMode()) {
    configureSingleEndlessEnemies();
    return;
  }
  if (isSingleFreeMode()) {
    configureSingleFreeEnemies();
    return;
  }
  configureSingleStoryEnemies();
}

function configureOnlineLineup() {
  roster.p1.slot = 'P1';
  roster.p1.team = 'left';
  roster.p1.itemDisabled = false;
  applyCharacter(roster.p1, state.selection.p1);

  const activeIds = ['p1'];

  ONLINE_GUEST_ROLES.forEach((role) => {
    const player = roster[role];
    if (!player) return;
    if (!online.players[role]) return;

    player.isBot = false;
    player.team = 'right';
    player.itemDisabled = false;
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
    player.itemDisabled = false;
    player.slot = preset.slot;
    player.ai = { ...preset.ai };
    applyCharacter(player, preset.charId);
    activeIds.push(player.id);
  }

  setActivePlayers(activeIds);
}

function configureLineupForMode() {
  applyCharacter(roster.p1, state.selection.p1);
  roster.p1.itemDisabled = false;

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
  roster.p2.itemDisabled = false;
  applyCharacter(roster.p2, state.selection.p2);
  setActivePlayers(['p1', 'p2']);
}

function setCampaignInfoText() {
  if (!isSingleMode()) {
    campaignInfoEl.textContent = '-';
    return;
  }

  if (isSingleFreeMode()) {
    const enemyNames = getFreeEnemyRoles().map((role, index) => {
      const charId = state.selection[role];
      const char = CHARACTER_BY_ID.get(charId);
      return `E${index + 1}:${char ? char.name : charId}`;
    }).join(' / ');
    campaignInfoEl.textContent = `FREE BATTLE | STAGE: ${state.stage.name} | ${enemyNames}`;
    return;
  }

  if (isSingleEndlessMode()) {
    const kills = state.single.endless.kills;
    const nextStageAt = Math.floor(kills / ENDLESS_STAGE_KILL_STEP + 1) * ENDLESS_STAGE_KILL_STEP;
    campaignInfoEl.textContent = `ENDLESS | KILLS ${kills} | STAGE ${state.stage.name} | NEXT SHIFT ${nextStageAt}`;
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
  if (isSingleStoryMode()) {
    ruleTextEl.innerHTML = `全${CAMPAIGN_STAGES.length}ステージ | 各対戦 <strong>${CONFIG.pointsToWin}本先取</strong>`;
    return;
  }

  if (isSingleFreeMode()) {
    ruleTextEl.innerHTML = `FREE BATTLE | <strong>${CONFIG.pointsToWin}本先取</strong> | 敵最大3人`;
    return;
  }

  if (isSingleEndlessMode()) {
    ruleTextEl.innerHTML = 'ENDLESS | <strong>無制限</strong> | 5秒ごとに敵増援 | 10撃破ごとにステージ変化';
    return;
  }

  ruleTextEl.innerHTML = `先に <strong>${CONFIG.pointsToWin}本</strong> 先取で勝ち`;
}

function updateHintText() {
  if (isSingleStoryMode()) {
    hintTextEl.textContent = 'PC操作: YOU = WASD / QでITEM';
    return;
  }

  if (isSingleFreeMode()) {
    hintTextEl.textContent = 'PC操作: YOU = WASD / QでITEM | FREEは敵数/キャラ/ステージを自由設定';
    return;
  }

  if (isSingleEndlessMode()) {
    hintTextEl.textContent = 'PC操作: YOU = WASD / QでITEM | ENDLESSは撃破数チャレンジ';
    return;
  }

  if (isOnlineMode()) {
    hintTextEl.textContent = 'PC操作: ONLINEは自分の枠のみ操作（移動＋ITEM）';
    return;
  }

  hintTextEl.textContent = 'PC操作: P1 = WASD+Q / P2 = 矢印+/';
}

function setFocusMode(enabled) {
  uiState.focusMode = Boolean(enabled);
  document.body.classList.toggle('focus-mode', uiState.focusMode);
  if (focusBtn) {
    focusBtn.textContent = uiState.focusMode ? 'Exit' : 'Focus';
  }
  keepViewportTop();
}

function setControlHint(text) {
  if (!controlHintEl) return;
  controlHintEl.textContent = text;
}

function withAssistHint(text) {
  return `${text} | ASSIST ${controlOptions.steerAssist ? 'ON' : 'OFF'}`;
}

function setGuideTab(tabId) {
  const tabButtons = {
    [GUIDE_TAB_IDS.tutorial]: guideTabTutorialBtn,
    [GUIDE_TAB_IDS.rules]: guideTabRulesBtn,
    [GUIDE_TAB_IDS.items]: guideTabItemsBtn,
    [GUIDE_TAB_IDS.stages]: guideTabStagesBtn,
  };
  const tabPanels = {
    [GUIDE_TAB_IDS.tutorial]: guidePanelTutorialEl,
    [GUIDE_TAB_IDS.rules]: guidePanelRulesEl,
    [GUIDE_TAB_IDS.items]: guidePanelItemsEl,
    [GUIDE_TAB_IDS.stages]: guidePanelStagesEl,
  };

  const nextTab = Object.prototype.hasOwnProperty.call(tabButtons, tabId)
    ? tabId
    : GUIDE_TAB_IDS.tutorial;
  uiState.guideTab = nextTab;

  Object.entries(tabButtons).forEach(([key, buttonEl]) => {
    if (!buttonEl) return;
    const active = key === nextTab;
    buttonEl.classList.toggle('is-active', active);
    buttonEl.setAttribute('aria-selected', active ? 'true' : 'false');
  });

  Object.entries(tabPanels).forEach(([key, panelEl]) => {
    if (!panelEl) return;
    panelEl.classList.toggle('is-active', key === nextTab);
  });
}

function setGuideOpen(open, tabId = null) {
  if (tabId) {
    setGuideTab(tabId);
  }
  uiState.guideOpen = Boolean(open);
  if (guideModalEl) {
    guideModalEl.classList.toggle('is-hidden', !uiState.guideOpen);
  }
  document.body.classList.toggle('guide-open', uiState.guideOpen);
  if (uiState.guideOpen) {
    keepViewportTop();
  }
}

function resetToTitleHome() {
  if (state.phase !== 'idle') {
    resetMatch(true);
  }
  flowState.singleChoiceOpen = false;
  setFocusMode(false);
  setFlowScene(FLOW_SCENES.title);
  keepViewportTop();
}

function updateControlUi() {
  if (isSingleMode()) {
    touchColP1.classList.remove('is-hidden');
    touchColP2.classList.add('is-hidden');
    touchRowEl.classList.add('one-handed');
    touchColP1.classList.add('is-active');
    touchColP2.classList.remove('is-active');
    uiState.activeItemSlot = 'p1';
    if (isSingleStoryMode()) {
      setControlHint(withAssistHint('STORY | スティックのみで移動。敵をリングアウト'));
    } else if (isSingleEndlessMode()) {
      setControlHint(withAssistHint('ENDLESS | 生き残り続けて撃破数を伸ばす'));
    } else {
      setControlHint(withAssistHint('FREE BATTLE | スティックのみで移動。全員バトルロイヤル'));
    }
    if (startBtn) startBtn.disabled = false;
    resetBtn.disabled = false;
    updateItemButtons();
    refreshRematchUi();
    return;
  }

  if (!isOnlineMode()) {
    touchColP1.classList.remove('is-hidden');
    touchColP2.classList.remove('is-hidden');
    touchRowEl.classList.remove('one-handed');
    touchColP1.classList.remove('is-active');
    touchColP2.classList.remove('is-active');
    uiState.activeItemSlot = null;
    setControlHint(withAssistHint('LOCAL 2P | 操作はスティックのみ。倒した方向へ移動'));
    if (startBtn) startBtn.disabled = false;
    resetBtn.disabled = false;
    updateItemButtons();
    refreshRematchUi();
    return;
  }

  if (!online.enabled) {
    touchColP1.classList.remove('is-hidden');
    touchColP2.classList.add('is-hidden');
    touchRowEl.classList.add('one-handed');
    touchColP1.classList.add('is-active');
    touchColP2.classList.remove('is-active');
    uiState.activeItemSlot = 'p1';
    setControlHint(withAssistHint('ONLINE | ルーム作成または参加してください'));
    if (startBtn) startBtn.disabled = true;
    resetBtn.disabled = false;
    updateItemButtons();
    refreshRematchUi();
    return;
  }

  if (online.isHost) {
    touchColP1.classList.remove('is-hidden');
    touchColP2.classList.add('is-hidden');
    touchRowEl.classList.add('one-handed');
    touchColP1.classList.add('is-active');
    touchColP2.classList.remove('is-active');
    uiState.activeItemSlot = 'p1';
    setControlHint(withAssistHint(`ONLINE HOST | ROOM: ${online.roomCode} | ENEMY ${getOnlineEnemyCount()}体`));
    if (startBtn) startBtn.disabled = state.phase === 'match_over' ? true : !online.peerReady;
    resetBtn.disabled = false;
  } else {
    touchColP1.classList.add('is-hidden');
    touchColP2.classList.remove('is-hidden');
    touchRowEl.classList.add('one-handed');
    touchColP1.classList.remove('is-active');
    touchColP2.classList.add('is-active');
    uiState.activeItemSlot = getOnlineOwnRole();
    setControlHint(withAssistHint(`ONLINE ${getOnlineOwnRole().toUpperCase()} | ROOM: ${online.roomCode} | ホストの開始待ち`));
    if (startBtn) startBtn.disabled = true;
    resetBtn.disabled = true;
  }

  updateItemButtons();
  refreshRematchUi();
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
  if (!startBtn) return;
  startBtn.disabled = false;

  if (isSingleMode() && state.single.pendingAdvance) {
    startBtn.textContent = 'Tap Arena';
    startBtn.disabled = true;
    return;
  }

  if (state.phase === 'playing') {
    if (isSingleEndlessMode()) {
      startBtn.textContent = 'Retry Endless';
    } else {
      startBtn.textContent = isSingleMode() ? 'Retry Stage' : 'Rematch';
    }
    return;
  }

  if (isOnlineMode() && online.enabled && state.phase === 'match_over') {
    startBtn.textContent = 'Rematch Vote';
    startBtn.disabled = true;
    return;
  }

  if (isSingleStoryMode() && state.single.campaignComplete) {
    startBtn.textContent = 'Restart Campaign';
    return;
  }

  if (state.phase === 'match_over') {
    if (isSingleEndlessMode()) {
      startBtn.textContent = 'Retry Endless';
    } else {
      startBtn.textContent = isSingleMode() ? 'Retry Stage' : 'Rematch';
    }
    return;
  }

  startBtn.textContent = 'Start';
}

function advanceSingleByTap() {
  if (!isSingleMode()) return false;
  const pending = state.single.pendingAdvance;
  if (!pending) return false;

  state.single.pendingAdvance = null;

  if (pending === 'round') {
    nextRound();
    return true;
  }

  if (pending === 'stage') {
    startMatch();
    return true;
  }

  return false;
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
    state.single.pendingAdvance = null;
    state.single.campaignComplete = false;
    if (isSingleStoryMode()) {
      const stage = getCampaignStage();
      applyStage(stage.stageId);
      setModeStatus('STORY | 全7ステージを勝ち抜け');
    } else if (isSingleFreeMode()) {
      applyStage(state.selection.stageId);
      setModeStatus('FREE BATTLE | 条件を自由に選んで対戦');
    } else {
      resetEndlessProgress();
      applyStage(ENDLESS_STAGE_ROTATION[0]);
      setModeStatus('ENDLESS | 無制限サバイバルで撃破数を伸ばせ');
    }
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
  player.knockbackGraceTimer = 0;
  player.knockbackSpeedLimit = 0;
  player.aimX = player.team === 'left' ? 1 : -1;
  player.aimY = 0;
  player.cooldownFire = 0;
  player.cooldownIce = 0;
  player.itemDecisionTimer = randomRange(0.24, 0.64);
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

function placeBattleRoyale(players) {
  const total = players.length;
  if (total === 0) return;

  const arenaRadius = getArenaRadius();
  const ring = clamp(arenaRadius * 0.56, 140, arenaRadius - 116);
  const angleOffset = -Math.PI * 0.5;

  players.forEach((player, index) => {
    const angle = angleOffset + ((Math.PI * 2) / total) * index;
    const x = center.x + Math.cos(angle) * ring;
    const y = center.y + Math.sin(angle) * ring;
    resetPlayer(player, x, y);

    const toCenterX = center.x - player.x;
    const toCenterY = center.y - player.y;
    const len = Math.hypot(toCenterX, toCenterY) || 1;
    player.aimX = toCenterX / len;
    player.aimY = toCenterY / len;
  });
}

function resetRound() {
  configureLineupForMode();
  state.arenaRadiusCurrent = state.stage.arenaRadius;
  state.stageFx = createStageFx();

  state.battleRoyale = shouldUseBattleRoyale();

  if (state.battleRoyale) {
    state.activePlayers.forEach((player) => {
      player.team = player.id;
    });
    placeBattleRoyale(state.activePlayers);
  } else {
    const leftTeam = state.activePlayers.filter((player) => player.team === 'left');
    const rightTeam = state.activePlayers.filter((player) => player.team === 'right');

    placeTeam(leftTeam, 'left');
    placeTeam(rightTeam, 'right');
  }

  state.timer = CONFIG.roundSeconds;
  state.item = null;
  state.itemWarning = null;
  state.bullets = [];
  state.bombs = [];
  state.particles = [];
  state.sparks = [];
  state.impactRings = [];
  state.shakeTime = 0;
  state.shakePower = 0;
  state.itemTimer = randomRange(state.stage.itemSpawnMin, state.stage.itemSpawnMax);

  if (isSingleEndlessMode()) {
    state.single.endless.spawnTimer = 0.8;
    spawnEndlessEnemy(true);
  }
}

function resetScoresAndRound() {
  state.scoreLeft = 0;
  state.scoreRight = 0;
  state.round = 1;
  if (isSingleEndlessMode()) {
    resetEndlessProgress();
  }
}

function beginRoundCountdown(startStatus) {
  state.phase = 'countdown';
  state.countdownTimer = ROUND_COUNTDOWN_SECONDS;
  if (startStatus) {
    setStatus(startStatus);
  }
}

function resetMatch(idle) {
  state.single.pendingAdvance = null;

  if (isSingleStoryMode()) {
    const stage = getCampaignStage();
    applyStage(stage.stageId);
    setCampaignInfoText();
  } else if (isSingleEndlessMode()) {
    applyStage(ENDLESS_STAGE_ROTATION[0]);
    setCampaignInfoText();
  } else {
    applyStage(state.selection.stageId);
    if (isSingleFreeMode()) {
      setCampaignInfoText();
    }
  }

  resetScoresAndRound();
  resetRound();

  if (idle) {
    state.phase = 'idle';
    state.countdownTimer = 0;
    if (isSingleStoryMode()) {
      setStatus(`STAGE ${state.single.stageIndex + 1} | Tapで開始`);
    } else if (isSingleEndlessMode()) {
      setStatus('ENDLESS | Tapでサバイバル開始');
    } else if (isSingleFreeMode()) {
      setStatus('FREE BATTLE | Tapでバトル開始');
    } else if (isOnlineMode() && !online.enabled) {
      setStatus('オンライン接続後に開始できます');
    } else {
      setStatus('Tapでバトル開始');
    }
  } else {
    if (isSingleStoryMode()) {
      beginRoundCountdown(`STAGE ${state.single.stageIndex + 1} | Ready...`);
    } else if (isSingleEndlessMode()) {
      beginRoundCountdown('ENDLESS | Ready...');
    } else if (isSingleFreeMode()) {
      beginRoundCountdown('FREE BATTLE | Ready...');
    } else {
      beginRoundCountdown('Ready...');
    }
  }

  updateStartButtonLabel();
  updateHud();
}

function startMatch() {
  if (isSingleMode() && state.single.pendingAdvance) {
    setStatus('画面タップで次に進めます');
    return;
  }

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

  if (isSingleStoryMode() && state.single.campaignComplete) {
    state.single.stageIndex = 0;
    state.single.campaignComplete = false;
  }

  if (isOnlineMode() && online.enabled) {
    resetRematchState();
    refreshRematchUi();
  }

  state.single.pendingAdvance = null;
  resetMatch(false);
  emitSnapshotNow();
}

function nextRound() {
  state.single.pendingAdvance = null;
  state.round += 1;
  resetRound();
  beginRoundCountdown(`ROUND ${state.round} | Ready...`);
  updateStartButtonLabel();
  emitSnapshotNow();
}

function handleSingleMatchResult(heroWon) {
  if (isSingleFreeMode()) {
    state.single.pendingAdvance = null;
    state.phase = 'match_over';
    playSfx('decide');
    if (heroWon) {
      playSfx('win');
      setStatus('FREE BATTLE WIN! 画面タップで再戦');
    } else {
      setStatus('FREE BATTLE LOSE... 画面タップで再戦');
    }
    updateStartButtonLabel();
    updateHud();
    return;
  }

  if (heroWon) {
    playSfx('decide');
    playSfx('win');
    if (state.single.stageIndex >= CAMPAIGN_STAGES.length - 1) {
      state.single.campaignComplete = true;
      state.single.pendingAdvance = null;
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
    state.single.pendingAdvance = 'stage';
    setCampaignInfoText();
    setStatus(`STAGE ${clearedStage} CLEAR! 画面タップで次ステージへ`);
    updateStartButtonLabel();
    updateHud();
    return;
  }

  state.single.pendingAdvance = null;
  state.phase = 'match_over';
  playSfx('decide');
  const stageNo = state.single.stageIndex + 1;
  setStatus(`STAGE ${stageNo} 敗北... Retryで再挑戦`);
  updateStartButtonLabel();
  updateHud();
}

function getRightTeamLabel() {
  if (state.battleRoyale) return 'FIELD';
  if (isSingleMode()) return 'ENEMY';
  const hasExtraRight = state.activePlayers.some((player) => player.team === 'right' && player.id !== 'p2');
  return hasExtraRight ? 'ENEMY' : 'P2';
}

function getRoundWinnerTeam(player) {
  if (!player) return null;
  return player.id === 'p1' ? 'left' : 'right';
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
    if (isSingleMode()) {
      state.single.pendingAdvance = 'round';
      state.betweenTimer = 0;
      setStatus('ラウンド終了! 画面タップで次ラウンド');
    } else {
      state.betweenTimer = CONFIG.roundInterval;
    }
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
  playSfx('decide');
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

  const input = { x, y, len: Math.min(1, len) };
  return applySteerAssistInput(player, input);
}

function applySteerAssistInput(player, input) {
  if (!controlOptions.steerAssist) return input;
  if (!player || player.isBot) return input;
  if (input.len <= 0.08) return input;

  const target = getNearestOpponent(player);
  if (!target) return input;

  const dx = target.x - player.x;
  const dy = target.y - player.y;
  const dist = Math.hypot(dx, dy);
  if (dist <= 0.001) return input;

  const tx = dx / dist;
  const ty = dy / dist;
  const align = input.x * tx + input.y * ty;
  if (align <= -0.35) return input;

  const gate = clamp((align + 0.35) / 1.35, 0, 1);
  const strength = clamp((0.14 + (1 - input.len) * 0.1) * gate, 0, 0.24);
  if (strength <= 0.001) return input;

  let x = input.x * (1 - strength) + tx * strength;
  let y = input.y * (1 - strength) + ty * strength;
  const len = Math.hypot(x, y);
  if (len <= 0.001) return input;

  x /= len;
  y /= len;
  return { x, y, len: input.len };
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

  const arenaRadius = getArenaRadius();
  const edgeRisk = clamp((distToCenter - arenaRadius * 0.66) / (arenaRadius * 0.34), 0, 1);

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
  const speedGrip = clamp((player.speedMul - 0.95) * 0.02, 0, 0.014);
  const humanGripBonus = player.isBot ? 0 : 0.0012;

  player.vx += input.x * accel * dt * input.len;
  player.vy += input.y * accel * dt * input.len;

  if (input.len > 0.22) {
    const velLen = Math.hypot(player.vx, player.vy);
    if (velLen > 120) {
      const steerGrip = clamp((0.0016 + speedGrip + humanGripBonus) * input.len * dt * 60, 0, 0.03);
      const desiredVX = input.x * velLen;
      const desiredVY = input.y * velLen;
      player.vx += (desiredVX - player.vx) * steerGrip;
      player.vy += (desiredVY - player.vy) * steerGrip;
    }
  }

  let stageDrag = state.stage.drag;
  if (!player.isBot) {
    // Touch操作で曲がりやすく止まりやすくして、全体の滑り感を抑える。
    const activeGrip = input.len > 0.2 ? 0.007 * input.len : 0;
    const releaseGrip = input.len <= 0.2 ? 0.011 : 0;
    stageDrag -= activeGrip + releaseGrip;
  }
  if (state.stageId === 'glacier') {
    const zone = state.stageFx?.iceZone;
    if (zone) {
      const distZone = Math.hypot(player.x - zone.x, player.y - zone.y);
      if (distZone <= zone.radius + player.radius * 0.22) {
        stageDrag = Math.max(stageDrag, 0.991);
      }
    }
  }
  stageDrag = clamp(stageDrag, 0.91, 0.995);

  const damp = Math.pow(stageDrag, dt * 60);
  player.vx *= damp;
  player.vy *= damp;

  const speed = Math.hypot(player.vx, player.vy);
  let speedLimit = input.len > 0.2 ? maxSpeed * 1.7 : maxSpeed * 3.25;
  if (player.knockbackGraceTimer > 0) {
    speedLimit = Math.max(speedLimit, player.knockbackSpeedLimit || 0);
  }
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

  if (state.stageId === 'glacier') {
    const fx = state.stageFx || {};
    fx.breakCharge = (fx.breakCharge || 0) + impactSpeed / 320;
    if (!fx.iceZone && fx.breakCharge >= 1) {
      fx.breakCharge = 0;
      fx.iceZone = {
        x: (a.x + b.x) * 0.5,
        y: (a.y + b.y) * 0.5,
        radius: 152,
        life: 2.2,
        maxLife: 2.2,
      };
      state.stageFx = fx;
      setStatus('氷床が割れてスリップゾーン発生!');
      playSfx('spawnWarn');
    }
  }

  spawnCollisionSparks((a.x + b.x) * 0.5, (a.y + b.y) * 0.5);

  const now = performance.now();
  if (now - state.lastCollisionSfxAt > 80) {
    playSfx('hit');
    state.lastCollisionSfxAt = now;
  }
}

function spawnBullet(owner, type) {
  const speedBase = type === 'fire' ? 560 : type === 'ice' ? 520 : 500;
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

function triggerBotConsumable(player, dt) {
  if (!player?.isBot || state.phase !== 'playing') return;
  if (player.itemDisabled) return;
  if (player.freezeTimer > 0) return;

  const type = getPreferredConsumable(player);
  if (!type || getTotalConsumables(player) <= 0) return;

  player.itemDecisionTimer -= dt;
  if (player.itemDecisionTimer > 0) return;
  player.itemDecisionTimer = randomRange(0.2, 0.58);

  const target = getNearestOpponent(player);
  if (!target) return;

  const toTargetX = target.x - player.x;
  const toTargetY = target.y - player.y;
  const dist = Math.hypot(toTargetX, toTargetY) || 1;
  const tx = toTargetX / dist;
  const ty = toTargetY / dist;
  const facing = player.aimX * tx + player.aimY * ty;
  const aggression = clamp(player.ai?.aggression ?? 1, 0.7, 1.45);

  if (type === 'missile') {
    const inRange = dist <= 440;
    const inFront = facing >= 0.3;
    if (!inRange || !inFront) return;
    const chance = clamp(0.26 + aggression * 0.22 + (dist < 220 ? 0.2 : 0), 0.2, 0.86);
    if (Math.random() <= chance) {
      useSelectedConsumable(player);
    }
    return;
  }

  if (type === 'bomb') {
    const closeEnough = dist <= 168;
    const dangerZone = Math.hypot(player.x - center.x, player.y - center.y) > getArenaRadius() * 0.72;
    if (!closeEnough && !dangerZone) return;
    const chance = clamp(0.22 + aggression * 0.2 + (closeEnough ? 0.24 : 0) + (dangerZone ? 0.12 : 0), 0.2, 0.84);
    if (Math.random() <= chance) {
      useSelectedConsumable(player);
    }
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

function createRandomItemSpec() {
  const type = ITEM_KEYS[Math.floor(Math.random() * ITEM_KEYS.length)];
  const angle = Math.random() * Math.PI * 2;
  const distance = randomRange(0, getArenaRadius() - 110);
  return {
    type,
    x: center.x + Math.cos(angle) * distance,
    y: center.y + Math.sin(angle) * distance,
  };
}

function beginItemWarning(spec = createRandomItemSpec()) {
  state.itemWarning = {
    type: spec.type,
    x: spec.x,
    y: spec.y,
    radius: CONFIG.itemRadius + 3,
    life: 0.9,
    rot: Math.random() * Math.PI * 2,
  };
  playSfx('spawnWarn');
}

function spawnItem(spec = createRandomItemSpec()) {
  state.item = {
    type: spec.type,
    x: spec.x,
    y: spec.y,
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
  if (state.itemWarning) {
    const warning = state.itemWarning;
    warning.life -= dt;
    warning.rot += dt * 3.6;
    if (warning.life <= 0) {
      spawnItem({
        type: warning.type,
        x: warning.x,
        y: warning.y,
      });
      state.itemWarning = null;
    }
    return;
  }

  if (!state.item) {
    state.itemTimer -= dt;
    if (state.itemTimer <= 0) beginItemWarning();
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
    if (player.itemDisabled) continue;
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
    playSfx('itemGet');
    if (previousType && previousType !== item.type) {
      setStatus(`${picker.slot} のアイテムを ${getItemIcon(item.type)} ${itemData.label} に上書き!`);
    } else {
      setStatus(`${picker.slot} が ${getItemIcon(item.type)} ${itemData.label} を取得!`);
    }
  } else {
    picker.buffs[item.type] = itemData.duration;
    burstEffect(item.x, item.y, itemData.color);
    playSfx('itemGet');

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
    const knock = (980 * attackDrive * state.stage.impactScale * reduce) / defenseScale;
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
    if (bullet.life <= 0 || outDist > getArenaRadius() + 130) {
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
    const isDirectHit = dist <= bomb.radius + player.radius * 0.95;
    const powGuard = getBuffAmount(player, 'power');
    const reduce = 1 - powGuard * (isDirectHit ? 0.08 : 0.15);

    let knock = 0;
    if (isDirectHit) {
      knock = 9800 * (0.92 + falloff * 0.35) * reduce;
    } else {
      // Splash should be around missile-tier (or a bit stronger), not instant death.
      knock = 980 * (0.82 + falloff * 0.52) * reduce;
    }

    player.vx += nx * knock;
    player.vy += ny * knock;
    player.knockbackGraceTimer = Math.max(player.knockbackGraceTimer || 0, isDirectHit ? 0.46 : 0.24);
    player.knockbackSpeedLimit = Math.max(player.knockbackSpeedLimit || 0, isDirectHit ? 7600 : 1950);
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

function updateNeonGimmick(dt) {
  const fx = state.stageFx || {};
  const arenaRadius = getArenaRadius();

  if (fx.pulseWarning > 0) {
    fx.pulseWarning = Math.max(0, fx.pulseWarning - dt);
    if (fx.pulseWarning <= 0) {
      fx.pulseWaveActive = true;
      fx.pulseWaveRadius = 0;
      fx.pulseHitIds = [];
      playSfx('ringout');
      addImpactRings(center.x, center.y, 'rgba(186, 255, 238, 0.8)', 1.2);
    }
    state.stageFx = fx;
    return;
  }

  if (fx.pulseWaveActive) {
    const prevRadius = fx.pulseWaveRadius;
    fx.pulseWaveRadius += dt * 780;
    const hitBand = 30;

    state.activePlayers.forEach((player) => {
      if (fx.pulseHitIds.includes(player.id)) return;
      const dx = player.x - center.x;
      const dy = player.y - center.y;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < prevRadius - hitBand || dist > fx.pulseWaveRadius + hitBand) return;

      const nx = dx / dist;
      const ny = dy / dist;
      const defenseScale = Math.max(0.94, 0.9 + player.defenseMul * 0.09);
      const knock = (460 * (1 + clamp((arenaRadius - dist) / arenaRadius, 0, 0.5))) / defenseScale;
      player.vx += nx * knock;
      player.vy += ny * knock;
      fx.pulseHitIds.push(player.id);
      spawnImpactFx(player.x, player.y, '#8ff8e8', 1.18);
      playSfx('hit');
    });

    if (fx.pulseWaveRadius > arenaRadius + 170) {
      fx.pulseWaveActive = false;
      fx.pulseWaveRadius = 0;
      fx.pulseTimer = randomRange(5.6, 7.4);
      fx.pulseFlash = 0.22;
    }

    fx.pulseFlash = Math.max(0, (fx.pulseFlash || 0) - dt);
    state.stageFx = fx;
    return;
  }

  fx.pulseTimer = (fx.pulseTimer || randomRange(5.8, 7.2)) - dt;
  if (fx.pulseTimer <= 0) {
    fx.pulseTimer = 0;
    fx.pulseWarning = 1.0;
    setStatus('Shock Pulse incoming!');
    playSfx('spawnWarn');
  }
  fx.pulseFlash = Math.max(0, (fx.pulseFlash || 0) - dt);
  state.stageFx = fx;
}

function updateGlacierGimmick(dt) {
  const fx = state.stageFx || {};
  if (fx.iceZone) {
    fx.iceZone.life -= dt;
    if (fx.iceZone.life <= 0) {
      fx.iceZone = null;
    }
  }
  fx.breakCharge = Math.max(0, (fx.breakCharge || 0) - dt * 0.12);
  state.stageFx = fx;
}

function updateMagmaGimmick(dt) {
  const fx = state.stageFx || {};
  const arenaRadius = getArenaRadius();
  fx.ventTimer = (fx.ventTimer || randomRange(2.2, 3.8)) - dt;
  if (fx.ventTimer <= 0) {
    const angle = Math.random() * Math.PI * 2;
    const distance = randomRange(0, arenaRadius - 120);
    fx.vents = fx.vents || [];
    fx.vents.push({
      x: center.x + Math.cos(angle) * distance,
      y: center.y + Math.sin(angle) * distance,
      radius: 84,
      warn: 1.0,
      burstLife: 0.32,
      bursted: false,
    });
    fx.ventTimer = randomRange(2.3, 3.9);
  }

  if (Array.isArray(fx.vents)) {
    for (let i = fx.vents.length - 1; i >= 0; i -= 1) {
      const vent = fx.vents[i];
      if (!vent.bursted) {
        vent.warn -= dt;
        if (vent.warn <= 0) {
          vent.bursted = true;
          let hitCount = 0;
          state.activePlayers.forEach((player) => {
            const dx = player.x - vent.x;
            const dy = player.y - vent.y;
            const dist = Math.hypot(dx, dy);
            if (dist > vent.radius + player.radius) return;
            const len = dist || 1;
            const nx = dx / len;
            const ny = dy / len;
            const falloff = 1 - clamp((dist - player.radius) / vent.radius, 0, 1);
            const defenseScale = Math.max(0.94, 0.9 + player.defenseMul * 0.08);
            const knock = (760 * (0.45 + falloff * 1.05)) / defenseScale;
            player.vx += nx * knock;
            player.vy += ny * knock;
            hitCount += 1;
            spawnImpactFx(player.x, player.y, '#ffb37a', 1.35);
          });

          spawnImpactFx(vent.x, vent.y, '#ff915e', 1.48);
          playSfx('bombBlast');
          if (hitCount > 0) {
            setStatus(`Vent Burst! ${hitCount}人ヒット`);
          }
        }
      } else {
        vent.burstLife -= dt;
        if (vent.burstLife <= 0) {
          fx.vents.splice(i, 1);
        }
      }
    }
  }

  state.stageFx = fx;
}

function updateStormGimmick(dt) {
  const fx = state.stageFx || {};
  fx.windPulse = (fx.windPulse || 0) + dt;
  fx.windTimer = (fx.windTimer || randomRange(3.8, 5.4)) - dt;

  if (fx.windTimer <= 0) {
    fx.windAngle = randomRange(0, Math.PI * 2);
    fx.windX = Math.cos(fx.windAngle);
    fx.windY = Math.sin(fx.windAngle);
    fx.windStrength = randomRange(76, 108);
    fx.windTimer = randomRange(3.8, 5.4);
    setStatus('Wind Shift!');
    playSfx('spawnWarn');
  }

  const windStrength = fx.windStrength || 86;
  state.activePlayers.forEach((player) => {
    player.vx += (fx.windX || 0) * windStrength * dt;
    player.vy += (fx.windY || 0) * windStrength * dt;
  });

  state.bullets.forEach((bullet) => {
    bullet.vx += (fx.windX || 0) * windStrength * 0.28 * dt;
    bullet.vy += (fx.windY || 0) * windStrength * 0.28 * dt;
  });

  state.stageFx = fx;
}

function updateGravityGimmick(dt) {
  const fx = state.stageFx || {};
  fx.gravityPulse = (fx.gravityPulse || 0) + dt;
  fx.gravityTimer = (fx.gravityTimer || randomRange(4.4, 5.8)) - dt;

  if (fx.gravityTimer <= 0) {
    fx.gravityMode = fx.gravityMode === 'in' ? 'out' : 'in';
    fx.gravityTimer = randomRange(4.4, 5.8);
    setStatus(fx.gravityMode === 'in' ? 'Gravity Pull!' : 'Gravity Push!');
    playSfx('spawnWarn');
  }

  const arenaRadius = getArenaRadius();
  const scalar = fx.gravityMode === 'in' ? 170 : -138;

  state.activePlayers.forEach((player) => {
    const dx = center.x - player.x;
    const dy = center.y - player.y;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;
    const force = scalar * clamp(0.45 + (dist / arenaRadius) * 0.8, 0.45, 1.3);
    player.vx += nx * force * dt;
    player.vy += ny * force * dt;
  });

  state.bullets.forEach((bullet) => {
    const dx = center.x - bullet.x;
    const dy = center.y - bullet.y;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;
    const force = scalar * 0.36;
    bullet.vx += nx * force * dt;
    bullet.vy += ny * force * dt;
  });

  state.stageFx = fx;
}

function updateCollapseGimmick() {
  const fx = state.stageFx || {};
  const baseRadius = state.stage.arenaRadius;
  if (state.timer > 20) {
    state.arenaRadiusCurrent = baseRadius;
    fx.collapseRatio = 1;
    state.stageFx = fx;
    return;
  }

  const t = clamp((20 - state.timer) / 20, 0, 1);
  const ratio = 1 - t * 0.24;
  state.arenaRadiusCurrent = baseRadius * ratio;
  fx.collapseRatio = ratio;

  if (!fx.collapseWarned && state.timer <= 20) {
    fx.collapseWarned = true;
    setStatus('Ring Collapse! 外周が狭まる');
    playSfx('spawnWarn');
  }

  state.stageFx = fx;
}

function updateStageGimmicks(dt) {
  if (!state.stageFx) {
    state.stageFx = createStageFx();
  }

  if (state.stageId !== 'collapse') {
    state.arenaRadiusCurrent = state.stage.arenaRadius;
  }

  if (state.stageId === 'neon') {
    updateNeonGimmick(dt);
    return;
  }
  if (state.stageId === 'glacier') {
    updateGlacierGimmick(dt);
    return;
  }
  if (state.stageId === 'magma') {
    updateMagmaGimmick(dt);
    return;
  }
  if (state.stageId === 'storm') {
    updateStormGimmick(dt);
    return;
  }
  if (state.stageId === 'gravity') {
    updateGravityGimmick(dt);
    return;
  }
  if (state.stageId === 'collapse') {
    updateCollapseGimmick();
    return;
  }

  state.stageFx = state.stageFx || {};
}

function updateBuffTimers(player, dt) {
  Object.keys(player.buffs).forEach((key) => {
    player.buffs[key] = Math.max(0, player.buffs[key] - dt);
  });

  player.freezeImmuneTimer = Math.max(0, player.freezeImmuneTimer - dt);
  player.knockbackGraceTimer = Math.max(0, (player.knockbackGraceTimer || 0) - dt);
  if (player.knockbackGraceTimer <= 0) {
    player.knockbackSpeedLimit = 0;
  }
  const wasFrozen = player.freezeTimer > 0;
  player.freezeTimer = Math.max(0, player.freezeTimer - dt);
  if (wasFrozen && player.freezeTimer <= 0) {
    player.freezeImmuneTimer = Math.max(player.freezeImmuneTimer, 2);
  }
}

function teamAliveCount(team) {
  return state.activePlayers.filter((player) => player.team === team).length;
}

function handleEndlessRingOut(outPlayers) {
  if (!isSingleEndlessMode()) return;

  const outIds = new Set(outPlayers.map((player) => player.id));
  const heroOut = outIds.has('p1');
  let defeatedEnemies = 0;

  outPlayers.forEach((player) => {
    burstEffect(player.x, player.y, player.id === 'p1' ? '#90fff0' : '#ffc18f');
    if (player.id !== 'p1') {
      defeatedEnemies += 1;
    }
  });

  state.activePlayers = state.activePlayers.filter((player) => !outIds.has(player.id));
  state.activePlayerIds = state.activePlayers.map((player) => player.id);

  if (defeatedEnemies > 0) {
    state.single.endless.kills += defeatedEnemies;
    state.single.endless.bestKills = Math.max(state.single.endless.bestKills, state.single.endless.kills);
    applyEndlessStageShiftIfNeeded();
    playSfx('ringout');
    if (!heroOut) {
      setStatus(`ENDLESS: ${state.single.endless.kills}体撃破`);
    }
  }

  if (!heroOut) {
    return;
  }

  state.phase = 'match_over';
  state.single.pendingAdvance = null;
  playSfx('decide');
  setStatus(`ENDLESS 終了 | 撃破 ${state.single.endless.kills} 体`);
  updateStartButtonLabel();
  updateHud();
}

function checkRingOut() {
  const outPlayers = state.activePlayers.filter((player) => {
    const dist = Math.hypot(player.x - center.x, player.y - center.y);
    return dist > getArenaRadius() + player.radius * 0.2;
  });

  if (outPlayers.length === 0) return;

  if (isSingleEndlessMode()) {
    handleEndlessRingOut(outPlayers);
    return;
  }

  outPlayers.forEach((player) => {
    burstEffect(player.x, player.y, player.id === 'p1' ? '#90fff0' : '#ffc18f');
  });

  const outIds = new Set(outPlayers.map((player) => player.id));
  state.activePlayers = state.activePlayers.filter((player) => !outIds.has(player.id));
  state.activePlayerIds = state.activePlayers.map((player) => player.id);

  if (state.battleRoyale) {
    if (state.activePlayers.length === 0) {
      endRound(null, '同時リングアウト');
      return;
    }

    if (state.activePlayers.length === 1) {
      const winner = state.activePlayers[0];
      const winnerTeam = getRoundWinnerTeam(winner);
      endRound(winnerTeam, `${winner.slot} が勝利!`);
      return;
    }

    const names = outPlayers.map((player) => player.slot).join(' / ');
    setStatus(`${names} リングアウト!`);
    playSfx('ringout');
    return;
  }

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
  if (state.battleRoyale) {
    if (state.activePlayers.length === 0) {
      endRound(null, '時間切れ: 引き分け');
      return;
    }

    const ranked = state.activePlayers
      .map((player) => ({
        player,
        dist: Math.hypot(player.x - center.x, player.y - center.y),
      }))
      .sort((a, b) => a.dist - b.dist);

    if (!ranked.length) {
      endRound(null, '時間切れ: 引き分け');
      return;
    }

    if (ranked.length > 1 && Math.abs(ranked[0].dist - ranked[1].dist) < 12) {
      endRound(null, '時間切れ: 引き分け');
      return;
    }

    const winner = ranked[0].player;
    endRound(getRoundWinnerTeam(winner), `時間切れ判定: ${winner.slot} 勝利`);
    return;
  }

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
    battleRoyale: state.battleRoyale,
    round: state.round,
    timer: state.timer,
    countdownTimer: state.countdownTimer,
    arenaRadiusCurrent: state.arenaRadiusCurrent,
    stageFx: state.stageFx ? JSON.parse(JSON.stringify(state.stageFx)) : null,
    status: state.status,
    scoreLeft: state.scoreLeft,
    scoreRight: state.scoreRight,
    activePlayerIds: state.activePlayerIds.slice(),
    item: state.item ? { ...state.item } : null,
    itemWarning: state.itemWarning ? { ...state.itemWarning } : null,
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
      knockbackGraceTimer: player.knockbackGraceTimer,
      knockbackSpeedLimit: player.knockbackSpeedLimit,
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
      local.knockbackGraceTimer = Math.max(0, Number(remote.knockbackGraceTimer) || 0);
      local.knockbackSpeedLimit = Math.max(0, Number(remote.knockbackSpeedLimit) || 0);
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
  state.battleRoyale = Boolean(snapshot.battleRoyale);
  state.round = Number(snapshot.round) || state.round;
  state.timer = Number(snapshot.timer) || 0;
  state.countdownTimer = Math.max(0, Number(snapshot.countdownTimer) || 0);
  state.arenaRadiusCurrent = Number(snapshot.arenaRadiusCurrent) || state.stage.arenaRadius;
  state.stageFx = snapshot.stageFx
    ? JSON.parse(JSON.stringify(snapshot.stageFx))
    : createStageFx();
  state.status = snapshot.status || state.status;
  state.scoreLeft = Number(snapshot.scoreLeft) || 0;
  state.scoreRight = Number(snapshot.scoreRight) || 0;
  state.item = snapshot.item ? { ...snapshot.item } : null;
  state.itemWarning = snapshot.itemWarning ? { ...snapshot.itemWarning } : null;
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

function updateNetworkPing(dt) {
  if (!socket || !socket.connected) return;
  if (!isOnlineMode() || !online.enabled) return;

  online.pingTimer -= dt;
  if (online.pingPending) {
    if (Date.now() - online.pingSentAt > 3200) {
      online.pingPending = false;
      online.pingMs = 999;
      online.pingQuality = 'poor';
      online.pingTimer = 1.2;
    }
    return;
  }
  if (online.pingTimer > 0) return;

  online.pingPending = true;
  online.pingSentAt = Date.now();
  socket.emit('duel_ping', { clientSentAt: online.pingSentAt });
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
  if (isSingleEndlessMode()) {
    state.timer -= dt;
    if (state.timer <= 0) {
      state.timer = CONFIG.roundSeconds;
    }
  } else {
    state.timer = Math.max(0, state.timer - dt);
  }

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
    triggerBotConsumable(player, dt);
  });

  for (let i = 0; i < state.activePlayers.length; i += 1) {
    for (let j = i + 1; j < state.activePlayers.length; j += 1) {
      resolvePlayerCollision(state.activePlayers[i], state.activePlayers[j]);
    }
  }

  updateStageGimmicks(dt);

  state.activePlayers.forEach((player) => {
    updateBuffTimers(player, dt);
  });

  updateBullets(dt);
  updateBombs(dt);
  updateItem(dt);
  updateEndlessSpawns(dt);
  checkRingOut();

  if (!isSingleEndlessMode() && state.phase === 'playing' && state.timer <= 0) {
    judgeByDistance();
  }
}

function updateSimulation(dt) {
  if (state.phase === 'playing') {
    stepPlaying(dt);
  } else if (state.phase === 'countdown') {
    state.countdownTimer = Math.max(0, state.countdownTimer - dt);
    if (state.countdownTimer <= 0) {
      state.phase = 'playing';
      if (isSingleStoryMode()) {
        setStatus(`STAGE ${state.single.stageIndex + 1} 開始!`);
      } else if (isSingleEndlessMode()) {
        setStatus('ENDLESS 開始! 生き残って撃破数を伸ばせ');
      } else if (isSingleFreeMode()) {
        setStatus('FREE BATTLE 開始!');
      } else {
        setStatus('ぶつかって相手をリング外へ');
      }
      playSfx('start');
      emitSnapshotNow();
    }
  } else if (state.phase === 'round_over') {
    if (isSingleMode() && state.single.pendingAdvance === 'round') {
      updateParticles(dt);
      return;
    }
    state.betweenTimer -= dt;
    if (state.betweenTimer <= 0) {
      nextRound();
    }
  }

  updateParticles(dt);
}

function update(dt) {
  state.ringPulse += dt * 2.4;
  updateNetworkPing(dt);
  renderNetBadge();
  refreshRematchUi();

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
  const arenaRadius = getArenaRadius();
  const grad = ctx.createLinearGradient(0, 0, 0, CONFIG.height);
  grad.addColorStop(0, state.stage.bgTop);
  grad.addColorStop(1, state.stage.bgBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

  const pulse = 0.12 + (Math.sin(state.ringPulse) + 1) * 0.05;
  ctx.beginPath();
  ctx.arc(center.x, center.y, arenaRadius + 18, 0, Math.PI * 2);
  ctx.fillStyle = state.stage.glowColor.replace('%A%', String(pulse));
  ctx.fill();

  const ring = ctx.createRadialGradient(
    center.x,
    center.y,
    arenaRadius * 0.2,
    center.x,
    center.y,
    arenaRadius,
  );
  ring.addColorStop(0, 'rgba(30, 45, 56, 0.92)');
  ring.addColorStop(1, 'rgba(8, 14, 20, 0.98)');

  ctx.beginPath();
  ctx.arc(center.x, center.y, arenaRadius, 0, Math.PI * 2);
  ctx.fillStyle = ring;
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = state.stage.ringColor;
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.17)';
  for (let i = 1; i <= 3; i += 1) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, arenaRadius * (i / 4), 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawStageGimmicks() {
  const fx = state.stageFx || {};
  const arenaRadius = getArenaRadius();

  if (state.stageId === 'neon') {
    if (fx.pulseWarning > 0) {
      const pulse = 0.45 + Math.sin((1 - fx.pulseWarning) * 18) * 0.25;
      ctx.beginPath();
      ctx.arc(center.x, center.y, arenaRadius * (0.26 + (1 - fx.pulseWarning) * 0.12), 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(181, 255, 233, ${0.4 + pulse * 0.35})`;
      ctx.lineWidth = 5;
      ctx.stroke();
    }
    if (fx.pulseWaveActive) {
      ctx.beginPath();
      ctx.arc(center.x, center.y, fx.pulseWaveRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(189, 255, 242, 0.85)';
      ctx.lineWidth = 8;
      ctx.stroke();
    }
    if (fx.pulseFlash > 0) {
      ctx.fillStyle = `rgba(196, 255, 241, ${fx.pulseFlash * 0.35})`;
      ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);
    }
    return;
  }

  if (state.stageId === 'glacier') {
    const zone = fx.iceZone;
    if (!zone) return;
    const alpha = clamp(zone.life / Math.max(0.001, zone.maxLife || 1), 0, 1);
    ctx.beginPath();
    ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(150, 221, 255, ${0.12 + alpha * 0.16})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(185, 235, 255, ${0.26 + alpha * 0.34})`;
    ctx.lineWidth = 3;
    ctx.stroke();
    return;
  }

  if (state.stageId === 'magma') {
    const vents = Array.isArray(fx.vents) ? fx.vents : [];
    vents.forEach((vent) => {
      if (!vent.bursted) {
        const pulse = 0.5 + Math.sin((1 - vent.warn) * 16) * 0.35;
        ctx.beginPath();
        ctx.arc(vent.x, vent.y, vent.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 170, 120, ${0.28 + pulse * 0.35})`;
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(vent.x, vent.y, 12 + (1 - vent.warn) * 6, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 112, 84, ${0.35 + pulse * 0.4})`;
        ctx.fill();
      } else {
        const flash = clamp(vent.burstLife / 0.32, 0, 1);
        ctx.beginPath();
        ctx.arc(vent.x, vent.y, vent.radius * (1.15 - flash * 0.35), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, 193, 144, ${flash * 0.86})`;
        ctx.lineWidth = 6 * flash;
        ctx.stroke();
      }
    });
    return;
  }

  if (state.stageId === 'storm') {
    const windX = fx.windX || 0;
    const windY = fx.windY || 0;
    const len = Math.hypot(windX, windY) || 1;
    const nx = windX / len;
    const ny = windY / len;
    const perpX = -ny;
    const perpY = nx;
    const pulse = fx.windPulse || 0;

    for (let i = -2; i <= 2; i += 1) {
      const shift = ((pulse * 90 + i * 120) % 640) - 320;
      const x = center.x + perpX * shift;
      const y = center.y + perpY * shift;
      const ex = x + nx * 170;
      const ey = y + ny * 170;
      ctx.strokeStyle = 'rgba(173, 230, 255, 0.32)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }
    return;
  }

  if (state.stageId === 'gravity') {
    const inward = fx.gravityMode !== 'out';
    const pulse = 0.55 + Math.sin((fx.gravityPulse || 0) * 5.2) * 0.2;
    ctx.beginPath();
    ctx.arc(center.x, center.y, arenaRadius * 0.24, 0, Math.PI * 2);
    ctx.strokeStyle = inward
      ? `rgba(210, 181, 255, ${0.44 + pulse * 0.3})`
      : `rgba(255, 170, 214, ${0.44 + pulse * 0.3})`;
    ctx.lineWidth = 4;
    ctx.stroke();
    return;
  }

  if (state.stageId === 'collapse') {
    const baseRadius = state.stage.arenaRadius;
    if (arenaRadius >= baseRadius - 1) return;
    ctx.beginPath();
    ctx.arc(center.x, center.y, arenaRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 165, 165, 0.88)';
    ctx.lineWidth = 6;
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

function drawItemWarning() {
  if (!state.itemWarning) return;

  const warning = state.itemWarning;
  const icon = getItemIcon(warning.type);
  const alpha = clamp(warning.life / 0.9, 0, 1);
  const pulse = 0.58 + Math.sin((1 - alpha) * 22) * 0.22;

  ctx.save();
  ctx.translate(warning.x, warning.y);
  ctx.rotate(warning.rot);

  ctx.beginPath();
  ctx.arc(0, 0, warning.radius + 17, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(255, 255, 255, ${0.06 + pulse * 0.08})`;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(0, 0, warning.radius + 4, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(255, 245, 205, ${0.35 + pulse * 0.35})`;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, 0, warning.radius, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(34, 46, 52, ${0.45 + pulse * 0.18})`;
  ctx.fill();

  ctx.fillStyle = `rgba(255, 242, 217, ${0.72 + pulse * 0.24})`;
  ctx.font = "bold 22px 'Noto Sans JP', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, 0, -1);
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
  const isYou = isUserControlledPlayer(player);
  const youPulse = 0.58 + Math.sin(performance.now() * 0.012) * 0.22;

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

  if (isYou) {
    ctx.beginPath();
    ctx.arc(0, 0, player.radius + 18, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(255, 238, 160, ${0.76 + youPulse * 0.22})`;
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, player.radius + 11, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(22, 32, 42, 0.64)';
    ctx.lineWidth = 2;
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
  ctx.fillStyle = isYou ? '#fffad2' : '#f6fbfa';
  ctx.font = isYou ? "bold 16px 'Chakra Petch', sans-serif" : "bold 14px 'Chakra Petch', sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText(player.slot, 0, 4);

  if (isYou) {
    const badgeY = -player.radius - 19;
    ctx.fillStyle = 'rgba(4, 12, 18, 0.78)';
    ctx.fillRect(-27, badgeY - 10, 54, 18);
    ctx.strokeStyle = 'rgba(255, 244, 177, 0.92)';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(-27, badgeY - 10, 54, 18);
    ctx.fillStyle = '#fff6bf';
    ctx.font = "bold 11px 'Chakra Petch', sans-serif";
    ctx.fillText('YOU', 0, badgeY + 2);
  }

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
  const panelW = 280;
  const panelH = 66;
  const panelX = center.x - panelW * 0.5;
  const panelY = 14;
  const rightLabel = isSingleMode() ? 'ENEMY' : getRightTeamLabel();
  const timeLeft = Math.ceil(state.timer);
  const endlessKills = state.single.endless.kills;
  const endlessAlive = Math.max(0, state.activePlayers.filter((player) => player.id !== 'p1').length);

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

  ctx.textAlign = 'center';
  ctx.font = "bold 11px 'Chakra Petch', sans-serif";
  ctx.fillStyle = 'rgba(236, 247, 244, 0.8)';
  ctx.fillText(isSingleEndlessMode() ? 'ENDLESS' : 'TIME', panelX + panelW * 0.5, panelY + 16);
  ctx.font = "bold 24px 'Chakra Petch', sans-serif";
  if (isSingleEndlessMode()) {
    ctx.fillStyle = '#ffe08e';
    ctx.fillText(`K${endlessKills} / E${endlessAlive}`, panelX + panelW * 0.5, panelY + 43);
  } else {
    ctx.fillStyle = timeLeft <= 10 ? '#ff9f86' : '#ffe08e';
    ctx.fillText(String(timeLeft), panelX + panelW * 0.5, panelY + 43);
    drawGameScorePips(panelX + 14, panelY + 50, state.scoreLeft, 'rgba(61, 238, 212, 0.95)');
    drawGameScorePips(panelX + panelW - 14 - ((CONFIG.pointsToWin - 1) * 16), panelY + 50, state.scoreRight, 'rgba(255, 182, 108, 0.96)');
  }

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

  if (state.phase === 'countdown') {
    const marker = Math.ceil(state.countdownTimer - 0.9);
    const label = marker > 0 ? String(marker) : 'Start!';
    const size = marker > 0 ? 110 : 84;
    const color = marker > 0 ? '#f9f4df' : '#ffdd92';

    ctx.font = `bold ${size}px 'Chakra Petch', sans-serif`;
    ctx.fillStyle = color;
    ctx.fillText(label, center.x, center.y + 14);
    ctx.font = "20px 'Noto Sans JP', sans-serif";
    ctx.fillStyle = 'rgba(240, 249, 247, 0.92)';
    ctx.fillText('Tapでバトル開始', center.x, center.y + 80);
    ctx.restore();
    return;
  }

  if (state.phase === 'idle') {
    const title = isSingleStoryMode()
      ? `STORY STAGE ${state.single.stageIndex + 1}`
      : isSingleEndlessMode()
        ? 'ENDLESS SURVIVAL'
      : isSingleFreeMode()
        ? 'FREE BATTLE'
        : `${getModeLabel()} BATTLE`;
    ctx.fillText(title, center.x, center.y - 20);
    ctx.font = "22px 'Noto Sans JP', sans-serif";
    if (isSingleStoryMode() && state.single.pendingAdvance === 'stage') {
      ctx.fillText('画面タップで次ステージ開始', center.x, center.y + 32);
    } else if (isSingleEndlessMode()) {
      ctx.fillText('Tapでサバイバル開始', center.x, center.y + 32);
    } else {
      ctx.fillText('Tapでバトル開始', center.x, center.y + 32);
    }
  }

  if (state.phase === 'round_over') {
    ctx.fillText(`ROUND ${state.round} END`, center.x, center.y - 20);
    ctx.font = "22px 'Noto Sans JP', sans-serif";
    if (isSingleMode() && state.single.pendingAdvance === 'round') {
      ctx.fillText('画面タップで次ラウンドへ', center.x, center.y + 32);
    } else {
      ctx.fillText('次ラウンド準備中...', center.x, center.y + 32);
    }
  }

  if (state.phase === 'match_over') {
    if (isSingleStoryMode() && state.single.campaignComplete) {
      ctx.fillText('CAMPAIGN CLEAR', center.x, center.y - 20);
      ctx.font = "22px 'Noto Sans JP', sans-serif";
      ctx.fillText('Restart Campaignで1から再挑戦', center.x, center.y + 32);
    } else if (isSingleEndlessMode()) {
      ctx.fillText('ENDLESS OVER', center.x, center.y - 20);
      ctx.font = "22px 'Noto Sans JP', sans-serif";
      ctx.fillText(`撃破数 ${state.single.endless.kills} 体 | Tapで再挑戦`, center.x, center.y + 32);
    } else if (isSingleStoryMode()) {
      ctx.fillText(`STAGE ${state.single.stageIndex + 1}`, center.x, center.y - 20);
      ctx.font = "22px 'Noto Sans JP', sans-serif";
      ctx.fillText('Retry Stageで再挑戦', center.x, center.y + 32);
    } else if (isSingleFreeMode()) {
      ctx.fillText('FREE BATTLE', center.x, center.y - 20);
      ctx.font = "22px 'Noto Sans JP', sans-serif";
      ctx.fillText('画面タップで再戦', center.x, center.y + 32);
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
  drawStageGimmicks();
  drawItemWarning();
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
  if ((player?.consumables?.missile || 0) > 0) list.push('MIS');
  if ((player?.consumables?.bomb || 0) > 0) list.push('BOM');
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
    buttonEl.setAttribute('aria-label', 'アイテムなし');
    return;
  }

  const selectedIcon = getItemIcon(type);
  buttonEl.textContent = selectedIcon;
  buttonEl.setAttribute('aria-label', `${getConsumableLabel(type)}を使用`);
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
    quickItemBtn.setAttribute('aria-label', 'アイテムなし');
    return;
  }

  const player = roster[slot];
  const total = getTotalConsumables(player);
  const type = getPreferredConsumable(player);
  const visible = total > 0 && state.phase === 'playing';

  quickItemBtn.classList.toggle('is-hidden', !visible);
  if (!visible || !type) {
    quickItemBtn.textContent = '🎒 ITEM';
    quickItemBtn.setAttribute('aria-label', 'アイテムなし');
    return;
  }

  const icon = getItemIcon(type);
  quickItemBtn.textContent = icon;
  quickItemBtn.setAttribute('aria-label', `${getConsumableLabel(type)}を使用`);
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
  if (isSingleEndlessMode()) {
    const aliveEnemies = Math.max(0, state.activePlayers.filter((player) => player.id !== 'p1').length);
    p1ScoreEl.textContent = `${state.single.endless.kills}`;
    p2ScoreEl.textContent = `${aliveEnemies}`;
    renderSetMarks(p1SetMarksEl, 0);
    renderSetMarks(p2SetMarksEl, 0);
  } else {
    p1ScoreEl.textContent = `${state.scoreLeft}`;
    p2ScoreEl.textContent = `${state.scoreRight}`;
    renderSetMarks(p1SetMarksEl, state.scoreLeft);
    renderSetMarks(p2SetMarksEl, state.scoreRight);
  }

  p1BuffsEl.textContent = teamBuffList('left');
  p2BuffsEl.textContent = teamBuffList('right');

  timerEl.textContent = isSingleEndlessMode() ? '∞' : `${Math.ceil(state.timer)}`;
  roundEl.textContent = isSingleEndlessMode() ? 'ENDLESS' : `ROUND ${state.round}`;
  statusEl.textContent = state.status;
  if (setScoreTextEl) {
    if (isSingleEndlessMode()) {
      const aliveEnemies = Math.max(0, state.activePlayers.filter((player) => player.id !== 'p1').length);
      setScoreTextEl.textContent = `ENDLESS | KILLS ${state.single.endless.kills} | ALIVE ${aliveEnemies}`;
    } else if (state.battleRoyale && isSingleMode()) {
      setScoreTextEl.textContent = `先取${CONFIG.pointsToWin} | YOU ${state.scoreLeft} - ${state.scoreRight} FIELD`;
    } else if (state.battleRoyale) {
      setScoreTextEl.textContent = `先取${CONFIG.pointsToWin} | P1 ${state.scoreLeft} - ${state.scoreRight} FIELD`;
    } else if (isSingleMode()) {
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
  if (state.stageId === 'classic') return [196, 247, 294, 330, 294, 247, 220, 196];
  if (state.stageId === 'glacier') return [220, 247, 294, 330, 294, 247, 220, 196];
  if (state.stageId === 'magma') return [196, 247, 294, 330, 294, 247, 220, 165];
  if (state.stageId === 'storm') return [233, 277, 311, 370, 311, 277, 247, 208];
  if (state.stageId === 'gravity') return [185, 220, 277, 330, 277, 220, 196, 165];
  if (state.stageId === 'collapse') return [247, 311, 370, 415, 370, 311, 277, 220];
  return [220, 277, 330, 392, 330, 277, 247, 196];
}

function titleBgmNotes() {
  return [196, 247, 294, 392, 330, 294, 247, 220];
}

function startBgm() {
  if (!audio.ctx || audio.bgmTimer) return;

  audio.bgmTimer = setInterval(() => {
    if (!audio.ctx) return;

    const inTitleScene = flowState.scene === FLOW_SCENES.title;
    const notes = inTitleScene ? titleBgmNotes() : stageBgmNotes();
    const note = notes[audio.bgmStep % notes.length];
    audio.bgmStep += 1;

    if (inTitleScene) {
      playTone(note, 0.26, { type: 'triangle', gain: 0.028 });
      playTone(note * 0.5, 0.22, { type: 'sine', gain: 0.014, when: 0.02 });
      playTone(note * 2, 0.1, { type: 'square', gain: 0.01, when: 0.04 });
      return;
    }

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

function primeAudioUnlockOnFirstGesture() {
  if (audioUnlockPrimed) return;
  audioUnlockPrimed = true;

  const unlock = () => {
    unlockAudio();
  };

  window.addEventListener('pointerdown', unlock, { once: true, passive: true });
  window.addEventListener('keydown', unlock, { once: true });
}

function playSfx(type) {
  if (!audio.ctx) return;

  if (type === 'start') {
    playTone(440, 0.07, { type: 'square', gain: 0.03 });
    playTone(660, 0.1, { type: 'triangle', gain: 0.026, when: 0.05 });
    return;
  }

  if (type === 'menu') {
    playTone(520, 0.05, { type: 'triangle', gain: 0.024 });
    playTone(760, 0.09, { type: 'square', gain: 0.018, when: 0.03 });
    return;
  }

  if (type === 'hit') {
    playTone(180, 0.05, { type: 'sawtooth', gain: 0.02 });
    return;
  }

  if (type === 'itemGet') {
    playTone(500, 0.06, { type: 'triangle', gain: 0.034 });
    playTone(760, 0.1, { type: 'triangle', gain: 0.028, when: 0.03 });
    playTone(980, 0.12, { type: 'square', gain: 0.018, when: 0.07 });
    return;
  }

  if (type === 'pickup') {
    playTone(520, 0.06, { type: 'triangle', gain: 0.03 });
    playTone(720, 0.09, { type: 'triangle', gain: 0.022, when: 0.03 });
    return;
  }

  if (type === 'spawnWarn') {
    playTone(430, 0.05, { type: 'square', gain: 0.014 });
    playTone(540, 0.08, { type: 'triangle', gain: 0.012, when: 0.03 });
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

  if (type === 'decide') {
    playTone(160, 0.08, { type: 'square', gain: 0.04 });
    playTone(300, 0.1, { type: 'sawtooth', gain: 0.03, when: 0.02 });
    playTone(520, 0.14, { type: 'triangle', gain: 0.022, when: 0.08 });
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
    resetPingState();
    online.pingTimer = 0.25;
    if (isOnlineMode() && reconnectSession.active) {
      tryResumeReconnectSession();
      return;
    }
    hideConnectionBanner();
    renderNetBadge();
  });

  socket.on('connect_error', () => {
    if (!isOnlineMode()) return;
    online.pingPending = false;
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
    resetPingState();
    online.pingTimer = 0.2;
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
    beginSetupFlow(online.isHost ? 'online_host' : 'online_guest');
    refreshSelectionUi();
    updateControlUi();
    renderNetBadge();
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
    refreshRematchUi();
  });

  socket.on('duel_peer_joined', ({ name, role, roomCode }) => {
    if (!isOnlineMode() || !online.enabled) return;
    if (roomCode !== online.roomCode) return;

    if (role && ONLINE_GUEST_ROLES.includes(role)) {
      online.players[role] = String(name || role.toUpperCase()).slice(0, 16);
    }

    if (online.isHost) {
      setModeStatus(`${role ? role.toUpperCase() : 'GUEST'}(${name || 'Player'}) が参加。Tapで開始`);
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

  socket.on('duel_rematch_state', (payload) => {
    if (!isOnlineMode() || !online.enabled) return;
    applyRematchState(payload || {});
    const need = online.rematchRequiredCount;
    if (need >= 2 && state.phase === 'match_over') {
      setModeStatus(`再戦準備 ${online.rematchReadyCount}/${need}`);
    }
    refreshRematchUi();
  });

  socket.on('duel_rematch_start', () => {
    if (!isOnlineMode() || !online.enabled) return;
    resetRematchState();
    refreshRematchUi();
    if (online.isHost) {
      startMatch();
    } else {
      setStatus('再戦開始!');
    }
  });

  socket.on('duel_pong', (payload) => {
    const sentAt = Number(payload?.clientSentAt) || 0;
    if (!sentAt) return;
    const now = Date.now();
    const rtt = clamp(now - sentAt, 0, 9999);
    online.pingPending = false;
    online.pingMs = rtt;
    online.pingQuality = classifyPingQuality(rtt);
    online.pingTimer = 1.6;
    renderNetBadge();
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
    online.pingPending = false;
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
  primeAudioUnlockOnFirstGesture();
  bindPad(padP1, knobP1, touchState.p1);
  bindPad(padP2, knobP2, touchState.p2);

  if (steerAssistToggleEl) {
    steerAssistToggleEl.checked = controlOptions.steerAssist;
    steerAssistToggleEl.addEventListener('change', () => {
      unlockAudio();
      playSfx('menu');
      setSteerAssistEnabled(steerAssistToggleEl.checked);
    });
  }

  setGuideTab(uiState.guideTab);

  [
    [guideTabTutorialBtn, GUIDE_TAB_IDS.tutorial],
    [guideTabRulesBtn, GUIDE_TAB_IDS.rules],
    [guideTabItemsBtn, GUIDE_TAB_IDS.items],
    [guideTabStagesBtn, GUIDE_TAB_IDS.stages],
  ].forEach(([buttonEl, tabId]) => {
    if (!buttonEl) return;
    buttonEl.addEventListener('click', () => {
      unlockAudio();
      playSfx('menu');
      setGuideTab(tabId);
    });
  });

  bindPressAction(guideBtn, () => {
    unlockAudio();
    playSfx('menu');
    setGuideOpen(true, GUIDE_TAB_IDS.tutorial);
  });

  bindPressAction(guideCloseBtn, () => {
    unlockAudio();
    playSfx('menu');
    setGuideOpen(false);
  });

  bindPressAction(guideSkipBtn, () => {
    unlockAudio();
    playSfx('menu');
    setGuideOpen(false);
  });

  bindPressAction(guideStartBtn, () => {
    unlockAudio();
    playSfx('menu');
    setGuideOpen(false);
  });

  if (guideModalEl) {
    guideModalEl.addEventListener('pointerdown', (event) => {
      if (event.target !== guideModalEl) return;
      unlockAudio();
      playSfx('menu');
      setGuideOpen(false);
    });
  }

  modeLocalBtn.addEventListener('click', () => {
    unlockAudio();
    playSfx('menu');
    beginModeFlow(PLAY_MODES.local);
  });

  modeOnlineBtn.addEventListener('click', () => {
    unlockAudio();
    playSfx('menu');
    beginModeFlow(PLAY_MODES.online);
  });

  modeSingleBtn.addEventListener('click', () => {
    unlockAudio();
    playSfx('menu');
    beginModeFlow(PLAY_MODES.single);
  });

  if (singleStoryBtn) {
    singleStoryBtn.addEventListener('click', () => {
      if (!isSingleMode()) {
        switchMode(PLAY_MODES.single);
      }
      flowState.singleChoiceOpen = false;
      setSingleVariant(SINGLE_VARIANTS.story, true);
      beginSingleSetupFlow();
    });
  }

  if (singleFreeBtn) {
    singleFreeBtn.addEventListener('click', () => {
      if (!isSingleMode()) {
        switchMode(PLAY_MODES.single);
      }
      flowState.singleChoiceOpen = false;
      setSingleVariant(SINGLE_VARIANTS.free, true);
      beginSingleSetupFlow();
    });
  }

  if (singleEndlessBtn) {
    singleEndlessBtn.addEventListener('click', () => {
      if (!isSingleMode()) {
        switchMode(PLAY_MODES.single);
      }
      flowState.singleChoiceOpen = false;
      setSingleVariant(SINGLE_VARIANTS.endless, true);
      beginSingleSetupFlow();
    });
  }

  if (setupBackBtn) {
    setupBackBtn.addEventListener('click', () => {
      if (flowState.scene !== FLOW_SCENES.setup) return;
      unlockAudio();
      playSfx('menu');
      if (flowState.setupIndex > 0) {
        flowState.setupIndex -= 1;
        renderSetupStep();
        return;
      }

      if (flowState.setupContext.startsWith('online')) {
        setFlowScene(FLOW_SCENES.onlineLobby);
      } else {
        flowState.singleChoiceOpen = false;
        setFlowScene(FLOW_SCENES.title);
      }
    });
  }

  if (setupNextBtn) {
    setupNextBtn.addEventListener('click', () => {
      if (flowState.scene !== FLOW_SCENES.setup) return;
      unlockAudio();
      playSfx('menu');

      const steps = flowState.setupSteps;
      if (flowState.setupIndex < steps.length - 1) {
        flowState.setupIndex += 1;
        renderSetupStep();
        return;
      }

      enterGameScene();
    });
  }

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
    leaveOnlineFromUi();
  });

  if (leaveQuickBtn) {
    leaveQuickBtn.addEventListener('click', () => {
      leaveOnlineFromUi('オンライン対戦を終了しました');
    });
  }

  if (rematchBtn) {
    rematchBtn.addEventListener('click', () => {
      if (!isOnlineMode() || !online.enabled) return;
      if (state.phase !== 'match_over') return;
      setRematchReady(!online.rematchLocalReady, true);
      refreshRematchUi();
    });
  }

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

  if (freeEnemyCountSelectEl) {
    freeEnemyCountSelectEl.addEventListener('change', () => {
      const next = clamp(Number(freeEnemyCountSelectEl.value) || 1, 1, 3);
      state.single.free.enemyCount = next;
      state.single.free.activeSlot = clamp(state.single.free.activeSlot, 0, next - 1);
      refreshSelectionUi();
      renderSetupStep();
      if (isSingleFreeMode()) {
        resetMatch(true);
      }
    });
  }

  if (freeEnemySlotButtonsEl) {
    freeEnemySlotButtonsEl.querySelectorAll('[data-free-slot]').forEach((button) => {
      button.addEventListener('click', () => {
        const slot = clamp(Number(button.dataset.freeSlot), 0, 2);
        if (slot >= getFreeEnemyCount()) return;
        unlockAudio();
        playSfx('menu');
        state.single.free.activeSlot = slot;
        refreshSelectionUi();
        renderSetupStep();
      });
    });
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      unlockAudio();
      startMatch();
    });
  }

  if (titleBtn) {
    titleBtn.addEventListener('click', () => {
      unlockAudio();
      playSfx('menu');
      returnToTitleFromBattle();
    });
  }

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

  if (focusBtn) {
    focusBtn.addEventListener('click', () => {
      setFocusMode(!uiState.focusMode);
    });
  }

  canvas.addEventListener('pointerdown', (event) => {
    unlockAudio();
    if (uiState.guideOpen) return;

    if (flowState.scene !== FLOW_SCENES.game) return;

    if (advanceSingleByTap()) {
      event.preventDefault();
      return;
    }

    if (state.phase === 'idle') {
      event.preventDefault();
      startMatch();
      return;
    }

    if (state.phase === 'match_over' && !isOnlineMode()) {
      event.preventDefault();
      startMatch();
    }
  });

  window.addEventListener('keydown', (event) => {
    unlockAudio();

    if (uiState.guideOpen) {
      if (event.code === 'Escape' || event.code === 'Space' || event.code === 'Enter') {
        event.preventDefault();
        setGuideOpen(false);
      }
      return;
    }

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

    if ((event.code === 'Space' || event.code === 'Enter') && advanceSingleByTap()) {
      return;
    }

    if ((event.code === 'Space' || event.code === 'Enter') && isOnlineMode() && online.enabled && state.phase === 'match_over') {
      return;
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
    navigator.serviceWorker.register('sw.js?v=20260322-1')
      .then((registration) => registration.update())
      .catch(() => {});
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
  state.selection.stageId = 'classic';

  applyCharacter(roster.p1, state.selection.p1);
  applyCharacter(roster.p2, state.selection.p2);
  applyCharacter(roster.p3, state.selection.p3);
  applyCharacter(roster.p4, state.selection.p4);
  if (npcCountSelectEl) {
    npcCountSelectEl.value = String(sanitizeNpcCount(npcCountSelectEl.value));
  }
  if (freeEnemyCountSelectEl) {
    freeEnemyCountSelectEl.value = String(getFreeEnemyCount());
  }
  applyStage(state.selection.stageId);

  refreshSelectionUi();
}

bootSelectionUi();
bindUi();
setupSocketHandlers();
switchMode(PLAY_MODES.single, true);
resetToTitleHome();
setGuideOpen(true, GUIDE_TAB_IDS.tutorial);
window.addEventListener('pageshow', (event) => {
  if (!event.persisted) return;
  resetToTitleHome();
});
registerServiceWorker();
requestAnimationFrame(updateFrame);

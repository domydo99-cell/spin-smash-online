const socket = io();
const app = document.getElementById('app');
const GOAL_POS = 51;

const ANIMAL_IMAGES = {
  rabbit: 'assets/animals/rabbit.png',
  boar: 'assets/animals/boar.png',
  monkey: 'assets/animals/monkey.png',
  penguin: 'assets/animals/penguin.png',
  turtle: 'assets/animals/turtle.png',
};

const STORAGE_LAST_ROOM = 'wd_last_room';
const STORAGE_NAME = 'wd_name';
const storageKeyForRoom = (code) => `wd_key_${code}`;

let state = null;
let draftSettings = null;
let ui = { passMode: false };

const params = new URLSearchParams(window.location.search);
const storedName = localStorage.getItem(STORAGE_NAME);

const joinDefaults = {
  name: storedName || '',
  roomCode: '',
  expectedPlayers: 4,
};

if (params.get('room')) {
  joinDefaults.roomCode = params.get('room').toUpperCase();
} else {
  const storedRoom = localStorage.getItem(STORAGE_LAST_ROOM);
  if (storedRoom) joinDefaults.roomCode = storedRoom;
}

socket.on('state', (nextState) => {
  state = nextState;
  if (state?.phase === 'lobby') {
    draftSettings = { ...state.settings };
  }
  if (state?.roomCode && state?.me?.playerKey) {
    localStorage.setItem(storageKeyForRoom(state.roomCode), state.me.playerKey);
    localStorage.setItem(STORAGE_LAST_ROOM, state.roomCode);
  }
  if (state?.me?.name) {
    localStorage.setItem(STORAGE_NAME, state.me.name);
  }
  if (state?.activePlayerId !== state?.me?.id) {
    ui.passMode = false;
  }
  render();
});

socket.on('error_message', (msg) => {
  alert(msg);
});

render();

app.addEventListener('click', (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;

  if (action === 'create-room') {
    const name = valueOf('join-name');
    const roomCode = valueOf('join-room').toUpperCase();
    const expectedPlayers = parseInt(valueOf('join-players'), 10);
    const playerKey = roomCode ? localStorage.getItem(storageKeyForRoom(roomCode)) : null;
    socket.emit('create_room', { name, roomCode, expectedPlayers, playerKey });
  }

  if (action === 'join-room') {
    const name = valueOf('join-name');
    const roomCode = valueOf('join-room').toUpperCase();
    const playerKey = roomCode ? localStorage.getItem(storageKeyForRoom(roomCode)) : null;
    socket.emit('join_room', { name, roomCode, playerKey });
  }

  if (action === 'start-game') {
    socket.emit('start_game', { roomCode: state.roomCode });
  }

  if (action === 'restart') {
    socket.emit('restart_game', { roomCode: state.roomCode });
  }

  if (action === 'next-race') {
    socket.emit('next_race', { roomCode: state.roomCode });
  }

  if (action === 'place-bet') {
    const type = target.dataset.betType;
    const selection = target.dataset.bet;
    if (!type || !selection) return;
    const payload = {
      roomCode: state.roomCode,
      type,
      selection: type === 'quinella' ? selection.split(',') : selection,
    };
    socket.emit('place_bet', payload);
  }

  if (action === 'play-card') {
    const cardId = target.dataset.cardId;
    if (!cardId) return;
    if (ui.passMode) {
      socket.emit('pass_turn', { roomCode: state.roomCode, cardId });
      ui.passMode = false;
      return;
    }
    socket.emit('play_card', { roomCode: state.roomCode, cardId });
  }

  if (action === 'pass-mode') {
    ui.passMode = true;
    render();
  }

  if (action === 'pass-cancel') {
    ui.passMode = false;
    render();
  }
});

app.addEventListener('change', (event) => {
  const target = event.target;
  if (!target || !target.dataset.setting) return;
  const key = target.dataset.setting;
  let value = target.type === 'checkbox' ? target.checked : parseInt(target.value, 10);

  if (!draftSettings) draftSettings = { ...state.settings };
  draftSettings[key] = value;
  socket.emit('set_settings', { roomCode: state.roomCode, settings: draftSettings });
});

function render() {
  if (!state) {
    app.innerHTML = renderJoin();
    return;
  }

  if (state.phase === 'lobby') {
    app.innerHTML = [
      renderHero(),
      renderLobby(),
    ].join('');
    return;
  }

  app.innerHTML = [
    renderHero(),
    '<div class="layout">',
    renderBoard(),
    '<div class="board">',
    renderActionPanel(),
    renderPlayers(),
    renderLog(),
    '</div>',
    '</div>',
  ].join('');
}

function renderHero() {
  const phaseLabel = phaseText(state?.phase || '');
  const roomCode = escapeHtml(state?.roomCode || '');
  const me = state?.me || {};
  return `
    <div class="hero">
      <div class="hero-card">
        <div class="title">WILD DERBY</div>
        <div class="subtitle">ローカルレース | ルーム ${roomCode}</div>
        <div class="row" style="margin-top:12px">
          <div class="badge">フェイズ: ${phaseLabel}</div>
          ${me?.name ? `<div class="badge dealer">${escapeHtml(me.name)} / ${me.isDealer ? '親' : '子'}</div>` : ''}
          ${state?.pot !== undefined ? `<div class="badge">パスチップ: ${state.pot}</div>` : ''}
        </div>
        <div class="small" style="margin-top:8px">単勝・連対を当ててチップを増やそう。</div>
      </div>
      <img class="hero-img" src="assets/box.png" alt="Wild Derby" />
    </div>
  `;
}

function renderJoin() {
  return `
    <div class="hero">
      <div class="hero-card">
        <div class="title">WILD DERBY</div>
        <p class="subtitle">同じWi-Fiで遊べるレース予想ゲーム</p>
        <div class="row">
          <div style="flex:1">
            <label>名前</label>
            <input id="join-name" value="${escapeHtml(joinDefaults.name)}" placeholder="なまえ" />
          </div>
          <div style="flex:1">
            <label>ルームコード</label>
            <input id="join-room" value="${escapeHtml(joinDefaults.roomCode)}" placeholder="例: 9K2B" />
          </div>
        </div>
        <div class="row">
          <div style="flex:1">
            <label>予定人数（ホスト用）</label>
            <input id="join-players" type="number" min="2" max="8" value="${joinDefaults.expectedPlayers}" />
          </div>
        </div>
        <div class="row">
          <button data-action="create-room">ルーム作成</button>
          <button class="secondary" data-action="join-room">参加する</button>
        </div>
      </div>
      <img class="hero-img" src="assets/box.png" alt="Wild Derby" />
    </div>
  `;
}

function renderLobby() {
  const players = state.players.map((p) => `
    <div class="player-card">
      <strong>${escapeHtml(p.name)}</strong>
      <div class="pill">${p.isCpu ? 'CPU' : p.isHost ? 'ホスト' : p.isDealer ? '親' : '参加者'}</div>
    </div>
  `).join('');

  const me = state.me || {};
  const canStart = me.isHost && state.players.length >= 2 && state.players.length >= state.settings.expectedPlayers;
  const serverIp = state.serverInfo?.ip || 'localhost';
  const serverPort = state.serverInfo?.port || 3000;

  return `
    <div class="panel strong">
      <h2 style="margin-bottom:8px">ロビー</h2>
      <div class="player-list">${players}</div>
      <div class="notice" style="margin-top:12px">人数が揃ったらホストが開始してください。</div>
      <div class="small" style="margin-top:8px">参加URL: http://${serverIp}:${serverPort}</div>
      <div class="row" style="margin-top:12px">
        <div style="flex:1">
          <label>予定人数</label>
          <input type="number" data-setting="expectedPlayers" min="2" max="8" value="${state.settings.expectedPlayers}" ${me.isHost ? '' : 'disabled'} />
        </div>
        <div style="flex:1">
          <label>初期チップ</label>
          <input type="number" data-setting="startingChips" min="5" max="50" value="${state.settings.startingChips}" ${me.isHost ? '' : 'disabled'} />
        </div>
        <div style="flex:1">
          <label>初期手札</label>
          <input type="number" data-setting="handSize" min="3" max="10" value="${state.settings.handSize}" ${me.isHost ? '' : 'disabled'} />
        </div>
        <div style="flex:1">
          <label>賭けチップ数/人</label>
          <input type="number" data-setting="betsPerPlayer" min="1" max="5" value="${state.settings.betsPerPlayer}" ${me.isHost ? '' : 'disabled'} />
        </div>
        <div style="flex:1">
          <label>CPU人数</label>
          <input type="number" data-setting="cpuCount" min="0" max="6" value="${state.settings.cpuCount || 0}" ${me.isHost ? '' : 'disabled'} />
        </div>
        <div style="flex:1">
          <label style="display:block">ランダムドロー</label>
          <input type="checkbox" data-setting="randomDraw" ${state.settings.randomDraw ? 'checked' : ''} ${me.isHost ? '' : 'disabled'} />
        </div>
      </div>
      <div class="row" style="margin-top:12px">
        <button data-action="start-game" ${canStart ? '' : 'disabled'}>ゲーム開始</button>
      </div>
    </div>
  `;
}

function renderBoard() {
  const animals = state.animals || [];
  const trackRows = animals.map((animal) => {
    const posPercent = Math.min((animal.pos / GOAL_POS) * 100, 100);
    const placeLabel = animal.place ? `${animal.place}位` : '';
    return `
      <div class="track-row">
        <div class="track-label">
          ${animalIcon(animal, 'lg')}
          <div class="track-name">${escapeHtml(animal.name)}</div>
        </div>
        <div class="track-bar">
          <div class="track-marker" style="left:${posPercent}%">${animalIcon(animal, 'sm')}</div>
        </div>
        <div class="track-place">
          <div>${animal.pos}/${GOAL_POS}</div>
          <div class="small">${placeLabel}</div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="board">
      <div class="panel strong board-panel">
        <h3>レースボード</h3>
        <div class="track-list" style="margin-top:10px">${trackRows}</div>
      </div>
      ${renderHandPanel()}
    </div>
  `;
}

function renderHandPanel() {
  const me = state.me || {};
  if (!me.hand || (state.phase !== 'betting' && state.phase !== 'race')) return '';
  const isMyTurn = state.activePlayerId === me.id;
  const canPlay = state.phase === 'race' && isMyTurn;
  const passCost = Math.pow(2, me.passCount || 0);

  return `
    <div class="panel">
      <h3>あなたの手札</h3>
      ${state.phase === 'race' ? `<div class="small">手番: ${escapeHtml(state.players.find((p) => p.id === state.activePlayerId)?.name || '')}</div>` : ''}
      ${state.phase === 'race' ? `
        <div class="row" style="margin-top:8px">
          ${isMyTurn && !ui.passMode ? `<button data-action="pass-mode" class="secondary">パス (${passCost}枚)</button>` : ''}
          ${isMyTurn && ui.passMode ? `<button data-action="pass-cancel" class="secondary">パス取消</button>` : ''}
        </div>
        ${ui.passMode ? '<div class="notice" style="margin-top:8px">捨てるカードを選んでください。</div>' : ''}
      ` : ''}
      <div class="hand-grid" style="margin-top:10px">${renderHand(canPlay)}</div>
    </div>
  `;
}

function renderSingleOdds() {
  const animals = state.animals || [];
  return animals.map((animal) => `
    <div class="odds-card">
      <div>${animalIcon(animal, 'sm')} ${escapeHtml(animal.name)}</div>
      <span>${state.odds.single[animal.id]}x</span>
    </div>
  `).join('');
}

function renderQuinellaOdds() {
  const animals = state.animals || [];
  const combos = [];
  for (let i = 0; i < animals.length; i += 1) {
    for (let j = i + 1; j < animals.length; j += 1) {
      const a = animals[i];
      const b = animals[j];
      const key = pairKey(a.id, b.id);
      combos.push(`
        <div class="odds-card">
          <div>${animalIcon(a, 'xs')}${animalIcon(b, 'xs')}</div>
          <span>${state.odds.quinella[key]}x</span>
        </div>
      `);
    }
  }
  return combos.join('');
}

function renderActionPanel() {
  if (state.phase === 'betting') return renderBettingPanel();
  if (state.phase === 'race') return renderRacePanel();
  if (state.phase === 'settle') return renderSettlePanel();
  if (state.phase === 'draw') return renderDrawPanel();
  return '';
}

function renderBettingPanel() {
  const me = state.me || {};
  const isMyTurn = state.activePlayerId === me.id;
  const activeName = state.players.find((p) => p.id === state.activePlayerId)?.name || '';
  const betState = state.betState || { betRound: 1, betDirection: 'cw' };
  const dirLabel = betState.betDirection === 'cw' ? '時計回り' : '逆回り';

  return `
    <div class="panel strong">
      <h3>ベットフェイズ</h3>
      <div class="small">次のベット: ${escapeHtml(activeName)} | ${betState.betRound}巡目 / ${dirLabel}</div>
      <div class="small">あなたのチップ: ${me.chips || 0}枚</div>
      <div class="small">※ベットはマーカーのためチップは減りません。</div>
      <div style="margin-top:12px">
        <h4>単勝</h4>
        <div class="bet-row">${renderSingleBetRow()}</div>
      </div>
      <div style="margin-top:12px">
        <h4>連対（上三角が有効）</h4>
        ${renderQuinellaMatrix()}
      </div>
      ${!isMyTurn ? '<div class="notice" style="margin-top:12px">自分の番まで待ってください。</div>' : ''}
    </div>
  `;
}

function renderSingleBetRow() {
  const me = state.me || {};
  const isMyTurn = state.activePlayerId === me.id;
  const animals = state.animals || [];

  return animals.map((animal) => {
    const key = animal.id;
    const found = findBetOwner(key);
    const owner = found?.player || null;
    const bet = found?.bet || null;
    const isMine = owner && owner.id === me.id;
    const taken = owner && owner.id !== me.id;
    const disabled = !isMyTurn || taken;
    return `
      <button class="bet-tile ${taken ? 'taken' : ''} ${isMine ? 'me' : ''}" data-action="place-bet" data-bet-type="single" data-bet="${animal.id}" ${disabled ? 'disabled' : ''}>
        <div class="bet-title">${animalIcon(animal, 'sm')} ${escapeHtml(animal.name)}</div>
        <div class="bet-odds">${state.odds.single[animal.id]}x</div>
        <div class="bet-owner">${owner ? `${escapeHtml(owner.name)} (${bet?.chips || 0}枚)` : '空き'}</div>
      </button>
    `;
  }).join('');
}

function renderQuinellaMatrix() {
  const me = state.me || {};
  const isMyTurn = state.activePlayerId === me.id;
  const animals = state.animals || [];

  let html = `<div class="quinella-grid" style="--size:${animals.length}">`;
  html += '<div class="q-cell head"></div>';
  animals.forEach((animal) => {
    html += `<div class="q-cell head">${animalIcon(animal, 'xs')}</div>`;
  });

  animals.forEach((rowAnimal, rowIndex) => {
    html += `<div class="q-cell head">${animalIcon(rowAnimal, 'xs')}</div>`;
    animals.forEach((colAnimal, colIndex) => {
      if (colIndex <= rowIndex) {
        html += '<div class="q-cell empty"></div>';
        return;
      }
      const key = pairKey(rowAnimal.id, colAnimal.id);
      const found = findBetOwner(key);
      const owner = found?.player || null;
      const bet = found?.bet || null;
      const isMine = owner && owner.id === me.id;
      const taken = owner && owner.id !== me.id;
      const disabled = !isMyTurn || taken;
      html += `
        <button class="q-cell bet ${taken ? 'taken' : ''} ${isMine ? 'me' : ''}" data-action="place-bet" data-bet-type="quinella" data-bet="${rowAnimal.id},${colAnimal.id}" ${disabled ? 'disabled' : ''}>
          <div class="q-odds">${state.odds.quinella[key]}x</div>
          <div class="q-owner">${owner ? `${escapeHtml(owner.name)} ${bet?.chips || 0}枚` : '空き'}</div>
        </button>
      `;
    });
  });

  html += '</div>';
  return html;
}

function renderRacePanel() {
  const me = state.me || {};
  const isMyTurn = state.activePlayerId === me.id;
  const activeName = state.players.find((p) => p.id === state.activePlayerId)?.name || '';

  return `
    <div class="panel strong">
      <h3>レースフェイズ</h3>
      <div class="small">手番: ${escapeHtml(activeName)} ${isMyTurn ? '（あなた）' : ''}</div>
      <div class="small">山札: ${state.deckCount}枚 / 捨て札: ${state.discardCount}枚</div>
      <div class="notice" style="margin-top:10px">カードを1枚使用するか、手札パネルのパスで捨て札を選んでください。</div>
    </div>
  `;
}

function renderHand(canPlay) {
  const me = state.me || {};
  if (!me.hand || me.hand.length === 0) {
    return '<div class="small">手札がありません。</div>';
  }
  return me.hand.map((card) => {
    const note = describeCard(card.name);
    const disabled = !canPlay;
    return `
      <button class="card-btn ${ui.passMode ? 'pass-mode' : ''}" data-action="play-card" data-card-id="${card.id}" ${disabled ? 'disabled' : ''}>
        <span>${escapeHtml(card.name)}</span>
        <div class="card-note">${escapeHtml(note)}</div>
      </button>
    `;
  }).join('');
}

function renderSettlePanel() {
  const result = state.result || {};
  const first = state.animals.find((a) => a.id === result.first);
  const second = state.animals.find((a) => a.id === result.second);
  const singleWinner = state.players.find((p) => p.id === result.singleWinnerId);
  const quinellaWinner = state.players.find((p) => p.id === result.quinellaWinnerId);

  return `
    <div class="panel strong">
      <h3>精算フェイズ</h3>
      <div class="small">1位: ${first ? animalLabel(first, 'xs') : '---'}</div>
      <div class="small">2位: ${second ? animalLabel(second, 'xs') : '---'}</div>
      <div class="small">単勝的中: ${singleWinner ? escapeHtml(singleWinner.name) : 'なし'}</div>
      <div class="small">連対的中: ${quinellaWinner ? escapeHtml(quinellaWinner.name) : 'なし'}</div>
      <div class="row" style="margin-top:12px">
        ${state.me?.isHost ? '<button data-action="next-race">次のレース</button>' : ''}
        ${state.me?.isHost ? '<button class="secondary" data-action="restart">ロビーへ戻る</button>' : ''}
      </div>
    </div>
  `;
}

function renderDrawPanel() {
  return `
    <div class="panel strong">
      <h3>引き分け</h3>
      <div class="small">山札が尽きました。パスチップは次のレースに持ち越しです。</div>
      <div class="row" style="margin-top:12px">
        ${state.me?.isHost ? '<button data-action="next-race">次のレース</button>' : ''}
        ${state.me?.isHost ? '<button class="secondary" data-action="restart">ロビーへ戻る</button>' : ''}
      </div>
    </div>
  `;
}

function renderPlayers() {
  const cards = state.players.map((p) => {
    const betLabel = p.bets && p.bets.length ? formatBetList(p.bets) : '未ベット';
    return `
      <div class="player-card">
        <div>
          <strong>${escapeHtml(p.name)}${p.isCpu ? ' (CPU)' : ''}</strong>
          <div class="small">${betLabel}</div>
        </div>
        <div class="pill">${p.chips}枚</div>
      </div>
    `;
  }).join('');

  return `
    <div class="panel">
      <h3>プレイヤー</h3>
      <div class="player-list" style="margin-top:10px">${cards}</div>
    </div>
  `;
}

function renderLog() {
  const rows = (state.log || []).map((entry) => `
    <div class="log-item">${escapeHtml(entry.message)}</div>
  `).join('');
  return `
    <div class="panel">
      <h3>ログ</h3>
      <div class="log" style="margin-top:8px">${rows || '<div class="small">まだログがありません。</div>'}</div>
    </div>
  `;
}

function phaseText(phase) {
  if (phase === 'lobby') return 'ロビー';
  if (phase === 'betting') return 'ベット';
  if (phase === 'race') return 'レース';
  if (phase === 'settle') return '精算';
  if (phase === 'draw') return '引き分け';
  return phase;
}

function findBetOwner(selectionKey) {
  for (const player of state.players || []) {
    const bet = (player.bets || []).find((b) => b.selection === selectionKey);
    if (bet) return { player, bet };
  }
  return null;
}

function formatBetEntry(bet) {
  if (!bet) return '';
  if (bet.type === 'single') {
    const animal = state.animals.find((a) => a.id === bet.selection);
    return animal ? `単勝 ${animalLabel(animal, 'xs')} (${bet.chips}枚)` : `単勝(${bet.chips}枚)`;
  }
  if (bet.type === 'quinella') {
    const parts = bet.selection.split('-');
    const a = state.animals.find((x) => x.id === parts[0]);
    const b = state.animals.find((x) => x.id === parts[1]);
    return a && b
      ? `連対 ${animalLabel(a, 'xs')} + ${animalLabel(b, 'xs')} (${bet.chips}枚)`
      : `連対(${bet.chips}枚)`;
  }
  return '';
}

function formatBetList(bets) {
  return bets.map((bet) => formatBetEntry(bet)).join(' / ');
}

function animalIcon(animal, className = '') {
  if (!animal) return '';
  const cls = className ? ` ${className}` : '';
  const src = ANIMAL_IMAGES[animal.id];
  if (src) {
    return `<img class="animal-icon${cls}" src="${src}" alt="${escapeHtml(animal.name)}" />`;
  }
  return `<span class="animal-emoji${cls}">${animal.emoji}</span>`;
}

function animalLabel(animal, className = '') {
  if (!animal) return '---';
  return `<span class="animal-label">${animalIcon(animal, className)}<span>${escapeHtml(animal.name)}</span></span>`;
}

function describeCard(name) {
  const number = parseNumber(name);
  if (name.includes('スペシャル')) {
    if (name.startsWith('🐇')) return '次の🐇が2倍進む';
    if (name.startsWith('🐗')) return '🐗を次の10の倍数へ';
    if (name.startsWith('🐒')) return '🐒が後ろとの差×2進む';
    if (name.startsWith('🐧')) return '次の移動を🐧に置換';
    if (name.startsWith('🐢')) return '🐢が1つ上の順位へ';
  }
  if (name.startsWith('トラップ')) return '1位の次の移動が0';
  if (name.startsWith('同じマス')) return `同じマスの動物を${number}マス（ゴール不可）`;
  if (name.includes('位＋')) return `${name.replace('＋', ' +')}`;
  if (name.startsWith('ビリ')) return `ビリを${number}マス進める`;
  const animal = emojiAnimal(firstSymbol(name));
  if (animal) return `${animal.name}を${number}マス進める`;
  return 'カード効果';
}

function emojiAnimal(emoji) {
  return (state.animals || []).find((a) => a.emoji === emoji);
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
  return match ? parseInt(match[0], 10) : 0;
}

function firstSymbol(text) {
  const chars = Array.from(text || '');
  return chars[0] || '';
}

function pairKey(a, b) {
  const order = ['rabbit', 'boar', 'monkey', 'penguin', 'turtle'];
  return [a, b].sort((x, y) => order.indexOf(x) - order.indexOf(y)).join('-');
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

function valueOf(id) {
  const el = document.getElementById(id);
  return el ? el.value : '';
}

// ==================== GAME STATE ====================
let mode = 'long';
let state = {};
let scores = { white: 0, black: 0 };

// POINTS 0-23, index 0 = point 24 (Black's home top-right), index 23 = point 1 (White's home bottom-right)
// Direction: White moves 23→0 (bear off left), Black moves 0→23 (bear off right)

function initState() {
  const s = {
    points: Array(24).fill(null).map(() => ({ color: null, count: 0 })),
    bar: { white: 0, black: 0 },
    borneOff: { white: 0, black: 0 },
    turn: 'white',
    dice: [],
    diceUsed: [],
    rolled: false,
    selected: null, // { type: 'point'|'bar', index }
    phase: 'roll', // roll | move | gameover
    mode: mode
  };

  if (mode === 'long') {
    // Standard backgammon starting position
    // White: home board is points 18-23 (indices), bearing off at index -1
    // Black: home board is points 0-5, bearing off at index 24
    s.points[0]  = { color: 'black', count: 2 };
    s.points[5]  = { color: 'white', count: 5 };
    s.points[7]  = { color: 'white', count: 3 };
    s.points[11] = { color: 'black', count: 5 };
    s.points[12] = { color: 'white', count: 5 };
    s.points[16] = { color: 'black', count: 3 };
    s.points[18] = { color: 'black', count: 5 };
    s.points[23] = { color: 'white', count: 2 };
  } else {
    // Short backgammon: Narde style — all pieces on one point at start
    // White: all 15 on point index 23
    // Black: all 15 on point index 11
    s.points[23] = { color: 'white', count: 15 };
    s.points[11] = { color: 'black', count: 15 };
  }

  return s;
}

function setMode(m) {
  mode = m;
  document.getElementById('btnLong').classList.toggle('active', m === 'long');
  document.getElementById('btnShort').classList.toggle('active', m === 'short');
  updateRulesBox();
  newGame();
}

function newGame() {
  state = initState();
  document.getElementById('winModal').style.display = 'none';
  render();
}

// ==================== DICE ====================
function rollDice() {
  if (state.phase !== 'roll') return;
  const d1 = Math.ceil(Math.random() * 6);
  const d2 = Math.ceil(Math.random() * 6);
  state.dice = d1 === d2 ? [d1, d1, d1, d1] : [d1, d2];
  state.diceUsed = state.dice.map(() => false);
  state.rolled = true;
  state.phase = 'move';

  // Check if any move is possible; if not, end turn
  if (!hasAnyMove()) {
    setStatus(`${cap(state.turn)} has no moves — turn passes`);
    setTimeout(() => switchTurn(), 1200);
  } else {
    setStatus(`${cap(state.turn)}: choose a checker`);
  }
  render();
}

function remainingDice() {
  return state.dice.filter((_, i) => !state.diceUsed[i]);
}

// ==================== MOVEMENT ====================
// White moves from index 23 → 0 (decreasing), bears off at -1
// Black moves from index 0 → 23 (increasing), bears off at 24
function moveDir(color) { return color === 'white' ? -1 : 1; }

function targetIndex(from, die, color) {
  return from + die * moveDir(color);
}

function isHomeBoard(idx, color) {
  // White home: 0-5 (indices), Black home: 18-23
  if (color === 'white') return idx >= 0 && idx <= 5;
  return idx >= 18 && idx <= 23;
}

function allInHome(color) {
  const total = 15;
  let home = 0;
  const range = color === 'white' ? [0, 5] : [18, 23];
  for (let i = range[0]; i <= range[1]; i++) {
    if (state.points[i].color === color) home += state.points[i].count;
  }
  home += state.borneOff[color];
  return home === total;
}

function canBearOff(from, die, color) {
  if (!allInHome(color)) return false;
  const target = from + die * moveDir(color);
  if (color === 'white' && target < 0) {
    // Exact or overshoot only if no checkers further back
    if (target === -1) return true; // exact
    // overshoot: ensure no checker on a higher index
    for (let i = from + 1; i <= 5; i++) {
      if (state.points[i].color === 'white' && state.points[i].count > 0) return false;
    }
    return true;
  }
  if (color === 'black' && target > 23) {
    if (target === 24) return true;
    for (let i = from - 1; i >= 18; i--) {
      if (state.points[i].color === 'black' && state.points[i].count > 0) return false;
    }
    return true;
  }
  return false;
}

function isValidMove(from, die) {
  const color = state.turn;
  // From bar
  if (from === 'bar') {
    const entry = color === 'white' ? 24 - die : die - 1;
    return isLandable(entry, color);
  }
  const to = targetIndex(from, die, color);
  if (to < 0 || to > 23) return canBearOff(from, die, color);
  return isLandable(to, color);
}

function isLandable(idx, color) {
  if (idx < 0 || idx > 23) return false;
  const p = state.points[idx];
  if (p.color === null || p.color === color) return true;
  // In short (Narde), hitting is not allowed
  if (mode === 'short') return false;
  return p.count === 1; // can hit a blot
}

function getValidMoves(from) {
  return remainingDice()
    .filter((d, i) => {
      // Only unique dice values to avoid duplicates
      return state.dice.indexOf(d) === state.dice.findIndex((x, j) => x === d && !state.diceUsed[j]);
    })
    .filter(d => isValidMove(from, d));
}

// Get all unique valid target indices for selected checker
function getValidTargets(from) {
  const rem = remainingDice();
  const targets = new Set();
  const seen = new Set();
  for (let i = 0; i < rem.length; i++) {
    const d = rem[i];
    if (seen.has(d)) continue;
    seen.add(d);
    if (isValidMove(from, d)) {
      if (from === 'bar') {
        const entry = state.turn === 'white' ? 24 - d : d - 1;
        targets.add(entry);
      } else {
        const to = targetIndex(from, d, state.turn);
        if (to >= 0 && to <= 23) targets.add(to);
        else targets.add('bearoff');
      }
    }
  }
  return targets;
}

function executeMove(from, to) {
  const color = state.turn;
  let diceUsed = false;

  // Determine die used
  for (let i = 0; i < state.dice.length; i++) {
    if (state.diceUsed[i]) continue;
    const d = state.dice[i];
    let expected;
    if (from === 'bar') {
      expected = color === 'white' ? 24 - d : d - 1;
    } else if (to === 'bearoff') {
      if (canBearOff(from, d, color)) { expected = to; }
    } else {
      expected = targetIndex(from, d, color);
    }
    if (expected === to || (to === 'bearoff' && canBearOff(from, d, color))) {
      state.diceUsed[i] = true;
      diceUsed = true;
      break;
    }
  }
  if (!diceUsed) return false;

  // Remove from source
  if (from === 'bar') {
    state.bar[color]--;
  } else {
    state.points[from].count--;
    if (state.points[from].count === 0) state.points[from].color = null;
  }

  // Bear off
  if (to === 'bearoff') {
    state.borneOff[color]++;
    checkWin();
    return true;
  }

  // Hit blot (long game only)
  if (mode === 'long' && state.points[to].color && state.points[to].color !== color && state.points[to].count === 1) {
    const opp = state.points[to].color;
    state.bar[opp]++;
    state.points[to] = { color: null, count: 0 };
  }

  // Place checker
  if (state.points[to].color === null) state.points[to] = { color, count: 1 };
  else state.points[to].count++;

  return true;
}

function hasAnyMove() {
  const color = state.turn;
  const rem = remainingDice();
  if (rem.length === 0) return false;

  if (state.bar[color] > 0) {
    for (const d of new Set(rem)) {
      const entry = color === 'white' ? 24 - d : d - 1;
      if (isLandable(entry, color)) return true;
    }
    return false;
  }

  for (let i = 0; i < 24; i++) {
    if (state.points[i].color !== color) continue;
    for (const d of new Set(rem)) {
      if (isValidMove(i, d)) return true;
    }
  }
  return false;
}

function checkWin() {
  if (state.borneOff.white === 15) {
    state.phase = 'gameover';
    scores.white++;
    showWin('White');
  } else if (state.borneOff.black === 15) {
    state.phase = 'gameover';
    scores.black++;
    showWin('Black');
  }
}

function switchTurn() {
  state.turn = state.turn === 'white' ? 'black' : 'white';
  state.dice = [];
  state.diceUsed = [];
  state.rolled = false;
  state.phase = 'roll';
  state.selected = null;
  render();
}

function endTurn() {
  if (state.phase !== 'move') return;
  switchTurn();
}

// ==================== INTERACTION ====================
function selectChecker(from) {
  if (state.phase !== 'move') return;
  const color = state.turn;

  // Must move bar checkers first
  if (state.bar[color] > 0 && from !== 'bar') {
    setStatus('You must move your bar checker first!');
    return;
  }
  if (from === 'bar' && state.bar[color] === 0) return;
  if (from !== 'bar' && state.points[from].color !== color) return;

  const moves = getValidTargets(from);
  if (moves.size === 0) {
    setStatus('No valid moves from here');
    return;
  }

  state.selected = from;
  render();
}

function selectTarget(to) {
  if (state.selected === null) return;
  executeMove(state.selected, to);
  state.selected = null;

  if (remainingDice().length === 0 || !hasAnyMove()) {
    if (state.phase !== 'gameover') {
      setTimeout(() => {
        setStatus(`${cap(state.turn)}'s turn complete`);
        setTimeout(switchTurn, 800);
      }, 200);
    }
  } else {
    if (state.bar[state.turn] > 0) setStatus('Move your bar checker');
    else setStatus(`${cap(state.turn)}: choose a checker`);
  }
  render();
}

// ==================== RENDER ====================
function render() {
  renderBoard();
  renderDice();
  renderBearOff();
  renderStatus();
  renderScores();
  document.getElementById('btnRoll').disabled = state.phase !== 'roll';
  document.getElementById('btnPass').disabled = state.phase !== 'move';
}

function renderBoard() {
  const bi = document.getElementById('boardInner');
  bi.innerHTML = '';

  // Top row: points 12-23 left to right (indices 12..23)
  // Bottom row: points 11-0 right to left (indices 11..0)
  // Board is split into left quadrant (6 points) | bar | right quadrant (6 points)

  // Top-left: points 12-17 (indices)
  // Top-right: points 18-23
  // Bottom-left: points 11-6
  // Bottom-right: points 5-0

  const validTargets = state.selected !== null ? getValidTargets(state.selected) : new Set();

  // Left half top
  const topLeft = makeQuadrant([12,13,14,15,16,17], 'top', validTargets);
  // Bar
  const bar = makeBar(validTargets);
  // Right half top
  const topRight = makeQuadrant([18,19,20,21,22,23], 'top', validTargets);

  // Divider
  const div = document.createElement('div');
  div.className = 'board-mid-divider';

  // Bottom-left: 11,10,9,8,7,6 displayed left-to-right
  const botLeft = makeQuadrant([11,10,9,8,7,6], 'bottom', validTargets);
  // Bottom-right: 5,4,3,2,1,0
  const botRight = makeQuadrant([5,4,3,2,1,0], 'bottom', validTargets);

  // Assemble grid: 3 cols x 3 rows
  // Row 1: topLeft | bar-top | topRight
  // Row 2: divider
  // Row 3: botLeft | bar-bot | botRight

  bi.style.gridTemplateRows = '160px 12px 160px';

  const topLeftDiv = document.createElement('div');
  topLeftDiv.className = 'points-row top';
  topLeftDiv.append(...Array.from(topLeft));
  bi.appendChild(topLeftDiv);

  const barTop = document.createElement('div');
  barTop.style.cssText = 'grid-row:1;grid-column:2;background:var(--bar-bg);border-left:1px solid rgba(139,105,20,0.3);border-right:1px solid rgba(139,105,20,0.3);display:flex;align-items:flex-start;justify-content:center;padding-top:4px;';
  renderBarSection(barTop, 'black', validTargets);
  bi.appendChild(barTop);

  const topRightDiv = document.createElement('div');
  topRightDiv.className = 'points-row top';
  topRightDiv.append(...Array.from(topRight));
  bi.appendChild(topRightDiv);

  bi.appendChild(div);

  const botLeftDiv = document.createElement('div');
  botLeftDiv.className = 'points-row bottom';
  botLeftDiv.append(...Array.from(botLeft));
  bi.appendChild(botLeftDiv);

  const barBot = document.createElement('div');
  barBot.style.cssText = 'grid-row:3;grid-column:2;background:var(--bar-bg);border-left:1px solid rgba(139,105,20,0.3);border-right:1px solid rgba(139,105,20,0.3);display:flex;align-items:flex-end;justify-content:center;padding-bottom:4px;';
  renderBarSection(barBot, 'white', validTargets);
  bi.appendChild(barBot);

  const botRightDiv = document.createElement('div');
  botRightDiv.className = 'points-row bottom';
  botRightDiv.append(...Array.from(botRight));
  bi.appendChild(botRightDiv);

  // Point labels
  // Top: 13,14,15,16,17,18 | 19,20,21,22,23,24 (human numbering for long)
  // Bottom: 12,11,10,9,8,7 | 6,5,4,3,2,1
}

function makeQuadrant(indices, pos, validTargets) {
  return indices.map((idx, i) => {
    const pt = state.points[idx];
    const isSelected = state.selected === idx;
    const isValid = validTargets.has(idx);
    const isOdd = (pos === 'top') ? (i % 2 === 0) : (i % 2 === 1);

    const div = document.createElement('div');
    div.className = `point ${pos} ${isOdd ? 'dark' : 'light'}${isValid ? ' valid-move' : ''}`;
    div.dataset.idx = idx;

    const tri = document.createElement('div');
    tri.className = 'point-triangle';
    div.appendChild(tri);

    // Label
    const label = document.createElement('div');
    label.className = 'point-label';
    label.textContent = humanPoint(idx);
    div.appendChild(label);

    // Checkers
    if (pt.count > 0) {
      const stack = document.createElement('div');
      stack.className = 'checker-stack';
      const showCount = pt.count > 5;
      const visCount = Math.min(pt.count, 5);
      for (let c = 0; c < visCount; c++) {
        const ch = document.createElement('div');
        ch.className = `checker ${pt.color}${isSelected && c === 0 ? ' selected' : ''}`;
        if (showCount && c === visCount - 1) {
          const cnt = document.createElement('span');
          cnt.className = 'checker-count';
          cnt.textContent = pt.count;
          ch.appendChild(cnt);
        }
        stack.appendChild(ch);
      }
      div.appendChild(stack);

      div.addEventListener('click', () => {
        if (isValid && state.selected !== null) {
          selectTarget(idx);
        } else {
          selectChecker(idx);
        }
      });
    } else {
      if (isValid) {
        div.addEventListener('click', () => selectTarget(idx));
      }
    }

    return div;
  });
}

function renderBarSection(container, color, validTargets) {
  const count = state.bar[color];
  const isValid = validTargets.has('bar-entry') ||
    (state.selected === 'bar' && state.turn === color);
  if (count === 0 && !isValid) return;

  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:1px;';

  for (let i = 0; i < Math.min(count, 4); i++) {
    const ch = document.createElement('div');
    ch.className = `checker ${color}${state.selected === 'bar' && state.turn === color ? ' selected' : ''}`;
    ch.style.width = '22px';
    ch.style.cursor = 'pointer';
    if (i === 0 && count > 4) {
      const cnt = document.createElement('span');
      cnt.className = 'checker-count';
      cnt.textContent = count;
      ch.appendChild(cnt);
    }
    wrap.appendChild(ch);
  }

  const lbl = document.createElement('div');
  lbl.className = 'bar-label';
  lbl.textContent = 'BAR';
  wrap.appendChild(lbl);

  wrap.addEventListener('click', () => {
    if (state.turn === color && count > 0) selectChecker('bar');
  });

  container.appendChild(wrap);
}

function makeBar(validTargets) {
  const bar = document.createElement('div');
  bar.className = 'bar';
  return bar;
}

function renderBearOff() {
  const area = document.getElementById('bearOffArea');
  area.innerHTML = '';
  const validTargets = state.selected !== null ? getValidTargets(state.selected) : new Set();
  const canBearW = validTargets.has('bearoff') && state.turn === 'white';
  const canBearB = validTargets.has('bearoff') && state.turn === 'black';

  // Black bear-off (top)
  const bs = document.createElement('div');
  bs.className = `bear-off-slot${canBearB ? ' valid-move' : ''}`;
  bs.innerHTML = `<div class="bear-off-count">${state.borneOff.black}</div><div class="bear-off-label">Black<br>Off</div>`;
  if (canBearB) bs.addEventListener('click', () => selectTarget('bearoff'));
  area.appendChild(bs);

  // White bear-off (bottom)
  const ws = document.createElement('div');
  ws.className = `bear-off-slot${canBearW ? ' valid-move' : ''}`;
  ws.innerHTML = `<div class="bear-off-count">${state.borneOff.white}</div><div class="bear-off-label">White<br>Off</div>`;
  if (canBearW) ws.addEventListener('click', () => selectTarget('bearoff'));
  area.appendChild(ws);
}

function renderDice() {
  const faces = ['', '⚀','⚁','⚂','⚃','⚄','⚅'];
  ['white','black'].forEach(color => {
    const el = document.getElementById(color + 'Dice');
    el.innerHTML = '';
    if (state.turn !== color || state.dice.length === 0) return;
    state.dice.forEach((d, i) => {
      const die = document.createElement('div');
      die.className = `die${state.diceUsed[i] ? ' used' : ''}`;
      die.textContent = faces[d];
      el.appendChild(die);
    });
  });
}

function renderStatus() {
  const dot = document.getElementById('turnDot');
  dot.className = 'pip-dot ' + state.turn;
  document.getElementById('turnText').textContent = cap(state.turn) + "'s Turn";
}

function renderScores() {
  document.getElementById('scoreBox').textContent = `W: ${scores.white}  |  B: ${scores.black}`;
}

function setStatus(msg) {
  document.getElementById('statusMsg').textContent = msg;
}

function humanPoint(idx) {
  // Standard backgammon: point 1 = index 0 (black's bearing side), point 24 = index 23
  return idx + 1;
}

function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ==================== WIN ====================
function showWin(winner) {
  document.getElementById('winTitle').textContent = `${winner} Wins!`;
  document.getElementById('winMsg').textContent = `Congratulations! ${winner} has borne off all 15 checkers. Score: W ${scores.white} — B ${scores.black}`;
  document.getElementById('winModal').style.display = 'flex';
}

// ==================== RULES BOX ====================
function updateRulesBox() {
  const rb = document.getElementById('rulesBox');
  if (mode === 'long') {
    rb.innerHTML = `<strong>Long Backgammon (Tavla)</strong> — White moves 24→1 (right to left on bottom row). Black moves 1→24. Hit lone opponent blots to send them to the bar. Bear off all 15 checkers from your home board (points 1–6 for White) to win. Doubles give 4 moves.`;
  } else {
    rb.innerHTML = `<strong>Short Backgammon (Narde)</strong> — Both players start with all 15 pieces on one point. White starts at point 24, moves toward point 1. Black starts at point 12, moves toward point 24. <em>No hitting or blocking</em> — only bear off to win. First to bear off all 15 checkers wins!`;
  }
}

// ==================== INIT ====================
updateRulesBox();
newGame();
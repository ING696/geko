const ROWS = 6;
  const COLS = 8;
  const PRICE = 2500;
  const ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];
  const PRE_OCCUPIED = [2, 5, 10, 11, 19, 27, 30, 35, 38, 42];

  const states = Array(ROWS * COLS).fill('free');
  PRE_OCCUPIED.forEach(i => { if (i < states.length) states[i] = 'occupied'; });

  function render() {
    const grid = document.getElementById('seat-grid');
    const labels = document.getElementById('row-labels');

    grid.innerHTML = '';
    labels.innerHTML = '';

    ROW_LABELS.forEach(label => {
      const el = document.createElement('div');
      el.className = 'row-label';
      el.textContent = label;
      labels.appendChild(el);
    });

    states.forEach((state, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const el = document.createElement('div');
      el.className = 'seat ' + state;
      el.textContent = col + 1;
      el.title = ROW_LABELS[row] + (col + 1);
      if (state !== 'occupied') {
        el.addEventListener('click', () => toggle(i));
      }
      grid.appendChild(el);
    });

    const selectedCount = states.filter(s => s === 'selected').length;
    document.getElementById('count').textContent = selectedCount;
    document.getElementById('total').textContent =
      (selectedCount * PRICE).toLocaleString('hy-AM') + ' ֏';
    document.getElementById('book-btn').disabled = selectedCount === 0;
  }

  function toggle(i) {
    if (states[i] === 'occupied') return;
    states[i] = states[i] === 'selected' ? 'free' : 'selected';
    render();
  }

  function bookSeats() {
    const hasSelected = states.some(s => s === 'selected');
    if (!hasSelected) return;

    states.forEach((s, i) => {
      if (s === 'selected') states[i] = 'occupied';
    });

    render();

    const toast = document.getElementById('toast');
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  render();
/* ===== THEME ===== */
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('invincibleos_theme', theme);
  document.getElementById('themeToggle').innerHTML =
    theme === 'light' ? '<span class="icon-emoji">☀️</span>' : '<span class="icon-emoji">🌙</span>';
}
function initTheme(){
  applyTheme(localStorage.getItem('invincibleos_theme') || 'dark');
  document.getElementById('themeToggle').addEventListener('click', ()=>{
    const current = document.documentElement.getAttribute('data-theme');
    applyTheme(current === 'light' ? 'dark' : 'light');
  });
}

/* ===== BOOT SCREEN ===== */
function initBoot(){
  const boot = document.getElementById('boot-screen');
  const desktop = document.getElementById('desktop');
  boot.addEventListener('click', ()=>{
    boot.classList.add('fade-out');
    setTimeout(()=>{ boot.style.display='none'; desktop.classList.remove('hidden'); }, 500);
  }, { once:true });
}

/* ===== MATRIX RAIN ===== */
function initMatrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = [];
  
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100;
  }
  
  function draw() {
    ctx.fillStyle = 'rgba(11, 14, 20, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#5ec8ff';
    ctx.font = fontSize + 'px monospace';
    
    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length));
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  
  const interval = setInterval(draw, 33);
  
  document.getElementById('boot-screen').addEventListener('click', () => {
    clearInterval(interval);
  });
}

/* ===== CLOCK + TIMEZONE (Brand Widget Only) ===== */
function updateClock(){
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  const timeStr = `${h}:${m}`;

  const brandTime = document.getElementById('brand-time');
  const brandZone = document.getElementById('brand-zone');
  if (brandTime) brandTime.textContent = timeStr;
  if (brandZone) {
    const tzAbbr = new Date().toLocaleTimeString('en-US', { timeZoneName: 'short' }).split(' ').pop();
    brandZone.textContent = tzAbbr || 'UTC';
  }
}

/* ===== GENERIC DRAG HELPER (Viewport Containment + Touch) ===== */
function makeDraggableEl(el, handle, onMove){
  let offsetX=0, offsetY=0, dragging=false;

  function startDrag(clientX, clientY){
    dragging = true;
    el.classList.add('dragging');
    offsetX = clientX - el.offsetLeft;
    offsetY = clientY - el.offsetTop;
  }

  function moveDrag(clientX, clientY){
    if (!dragging) return;
    let newLeft = clientX - offsetX;
    let newTop  = clientY - offsetY;

    const maxLeft = window.innerWidth - el.offsetWidth;
    const maxTop  = window.innerHeight - el.offsetHeight;
    newLeft = Math.max(0, Math.min(newLeft, maxLeft));
    newTop  = Math.max(0, Math.min(newTop, maxTop));

    el.style.left = newLeft + 'px';
    el.style.top  = newTop + 'px';
  }

  function endDrag(){
    if (!dragging) return;
    dragging = false;
    el.classList.remove('dragging');
    if (onMove) onMove(el.style.left, el.style.top);
  }

  handle.addEventListener('pointerdown', (e)=>{
    handle.setPointerCapture(e.pointerId);
    startDrag(e.clientX, e.clientY);
  });
  handle.addEventListener('pointermove', (e)=>{
    moveDrag(e.clientX, e.clientY);
  });
  handle.addEventListener('pointerup', ()=> endDrag());
  handle.addEventListener('pointercancel', ()=> endDrag());

  handle.addEventListener('touchstart', (e)=>{
    if (e.touches.length === 1) {
      const t = e.touches[0];
      startDrag(t.clientX, t.clientY);
    }
  }, { passive: true });

  handle.addEventListener('touchmove', (e)=>{
    if (e.touches.length === 1) {
      e.preventDefault();
      const t = e.touches[0];
      moveDrag(t.clientX, t.clientY);
    }
  }, { passive: false });

  handle.addEventListener('touchend', ()=> endDrag(), { passive: true });
  handle.addEventListener('touchcancel', ()=> endDrag(), { passive: true });
}

/* ===== BRAND WIDGET (clock center, text caption) ===== */
function initBrandWidget(){
  const layer = document.getElementById('widget-layer');
  const wrap = document.createElement('div');
  wrap.className = 'brand-widget';
  wrap.innerHTML = `
    <img src="assets/brand-widget.png" alt="Invincible OS by PRON33R Universe">
    <div class="brand-clock-overlay">
      <div class="brand-time" id="brand-time">00:00</div>
      <div class="brand-zone" id="brand-zone">UTC</div>
    </div>
    <div class="brand-caption-text">ANYTHING FOR MONEY</div>
  `;
  layer.appendChild(wrap);

  const saved = JSON.parse(localStorage.getItem('invincibleos_brandPos') || 'null');
  wrap.style.left = (saved ? saved.left : '24px');
  wrap.style.top  = (saved ? saved.top  : '90px');

  makeDraggableEl(wrap, wrap, (left, top)=>{
    localStorage.setItem('invincibleos_brandPos', JSON.stringify({ left, top }));
  });
}

/* ===== WINDOW MANAGER ===== */
const WM = {
  zIndex: 10,
  windows: {},

  open(appId){
    if (this.windows[appId]) { this.focus(appId); return; }
    const app = APP_REGISTRY[appId];
    const win = document.createElement('div');
    win.className = 'window';

    const offset = Object.keys(this.windows).length * 30;
    const rawW = parseInt(app.width || '320', 10);
    const rawH = parseInt(app.height || '240', 10);
    let left = 60 + offset;
    let top  = 60 + offset;
    left = Math.min(left, Math.max(0, window.innerWidth - rawW));
    top  = Math.min(top,  Math.max(0, window.innerHeight - rawH - 64));

    win.style.left = left + 'px';
    win.style.top  = top + 'px';
    win.style.width = app.width || '320px';
    win.style.height = app.height || '240px';
    win.innerHTML = `
      <div class="window-titlebar" data-app="${appId}">
        <span class="window-title">${app.title}</span>
        <div class="window-controls"><div class="win-btn" data-close="${appId}">✕</div></div>
      </div>
      <div class="window-body">${app.render()}</div>
    `;
    document.getElementById('window-layer').appendChild(win);
    this.windows[appId] = { el: win };
    makeDraggableEl(win, win.querySelector('.window-titlebar'), ()=> this.saveState());
    win.querySelector('.window-titlebar').addEventListener('pointerdown', ()=> this.focus(appId));
    win.querySelector('[data-close]').addEventListener('click', ()=> this.close(appId));
    this.focus(appId);
    if (app.afterMount) app.afterMount(win);
    this.saveState();
  },

  close(appId){
    if (!this.windows[appId]) return;
    this.windows[appId].el.remove();
    delete this.windows[appId];
    this.saveState();
  },

  focus(appId){
    const w = this.windows[appId];
    if (!w) return;
    this.zIndex++;
    w.el.style.zIndex = this.zIndex;
  },

  saveState(){
    const state = {};
    for (const id in this.windows){
      const el = this.windows[id].el;
      state[id] = { left: el.style.left, top: el.style.top };
    }
    localStorage.setItem('invincibleos_windows', JSON.stringify(state));
  },

  restoreState(){
    const raw = localStorage.getItem('invincibleos_windows');
    if (!raw) return;
    const state = JSON.parse(raw);
    for (const id in state){
      if (!APP_REGISTRY[id]) continue;
      this.open(id);
      const el = this.windows[id].el;
      el.style.left = state[id].left;
      el.style.top  = state[id].top;
    }
  }
};

/* ===== APPS ===== */
const APP_REGISTRY = {
  terminal: {
    title: 'Terminal', width: '340px', height: '260px',
    render(){
      return `
        <div class="terminal-app">
          <div class="terminal-output" id="term-output">Invincible OS Terminal v0.1
Type "help" to see available commands.
</div>
          <div class="terminal-line">
            <span class="terminal-prompt">guest@invincibleos:~$</span>
            <input class="terminal-input" id="term-input" autocomplete="off">
          </div>
        </div>`;
    },
    afterMount(win){
      const input = win.querySelector('#term-input');
      const output = win.querySelector('#term-output');
      const print = (txt)=>{ output.textContent += txt + '\n'; output.scrollTop = output.scrollHeight; };
      const commands = {
        help: ()=> 'Commands: help, whoami, date, clear, echo [text], theme, apps, exit',
        whoami: ()=> 'guest@invincibleos',
        date: ()=> new Date().toString(),
        clear: ()=> { output.textContent=''; return null; },
        theme: ()=> { document.getElementById('themeToggle').click(); return 'theme switched'; },
        apps: ()=> Object.keys(APP_REGISTRY).join(', '),
        exit: ()=> { WM.close('terminal'); return null; }
      };
      input.addEventListener('keydown', (e)=>{
        if (e.key !== 'Enter') return;
        const raw = input.value.trim();
        input.value = '';
        if (!raw) return;
        print(`guest@invincibleos:~$ ${raw}`);
        const [cmd, ...rest] = raw.split(' ');
        if (cmd === 'echo') { print(rest.join(' ')); return; }
        if (commands[cmd]) { const res = commands[cmd](); if (res) print(res); }
        else print(`command not found: ${cmd}`);
      });
    }
  },

  notes: {
    title: 'Notes', width: '300px', height: '260px',
    render(){
      return `
        <div class="notes-app">
          <textarea class="notes-textarea" id="notes-text" placeholder="Type your notes..."></textarea>
          <div class="notes-status" id="notes-status">saved</div>
        </div>`;
    },
    afterMount(win){
      const textarea = win.querySelector('#notes-text');
      const status = win.querySelector('#notes-status');
      textarea.value = localStorage.getItem('invincibleos_notes') || '';
      let timer;
      textarea.addEventListener('input', ()=>{
        status.textContent = 'saving...';
        clearTimeout(timer);
        timer = setTimeout(()=>{
          localStorage.setItem('invincibleos_notes', textarea.value);
          status.textContent = 'saved';
        }, 400);
      });
    }
  }
};

/* ===== DESKTOP ICONS (PNG only, no emojis) ===== */
function buildDesktopIcons(){
  const zone = document.getElementById('appsZone');
  const icons = {
    terminal: { label:'Terminal' },
    notes:    { label:'Notes' }
  };
  for (const id in icons){
    const div = document.createElement('div');
    div.className = 'app-icon';
    div.innerHTML = `
      <img src="assets/icons/${id}.png" class="icon-img" alt="${icons[id].label}">
      <span class="label">${icons[id].label}</span>`;
    div.addEventListener('click', ()=> WM.open(id));
    zone.appendChild(div);
  }
}

function initEverythingBtn(){
  document.getElementById('everythingBtn').addEventListener('click', ()=>{
    const choice = prompt('Open app: ' + Object.keys(APP_REGISTRY).join(', '));
    if (choice && APP_REGISTRY[choice]) WM.open(choice);
  });
}

/* ===== INIT ===== */
window.addEventListener('DOMContentLoaded', ()=>{
  initMatrixRain();
  initTheme();
  initBoot();
  buildDesktopIcons();
  initBrandWidget();
  initEverythingBtn();
  updateClock();
  setInterval(updateClock, 1000);
  WM.restoreState();
});
  

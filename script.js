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

/* ===== CLOCK ===== */
function updateClock(){
  const now = new Date();
  const h = String(now.getHours()).padStart(2,'0');
  const m = String(now.getMinutes()).padStart(2,'0');
  document.getElementById('system-clock').textContent = `${h}:${m}`;
}

/* ===== GENERIC DRAG HELPER ===== */
function makeDraggableEl(el, handle, onMove){
  let offsetX=0, offsetY=0, dragging=false;
  handle.addEventListener('pointerdown', (e)=>{
    dragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    handle.setPointerCapture(e.pointerId);
  });
  handle.addEventListener('pointermove', (e)=>{
    if (!dragging) return;
    el.style.left = (e.clientX - offsetX) + 'px';
    el.style.top = (e.clientY - offsetY) + 'px';
  });
  handle.addEventListener('pointerup', ()=>{
    dragging = false;
    if (onMove) onMove(el.style.left, el.style.top);
  });
}

/* ===== BRAND WIDGET (your logo + caption, moves as one piece) ===== */
function initBrandWidget(){
  const layer = document.getElementById('widget-layer');
  const wrap = document.createElement('div');
  wrap.className = 'brand-widget';
  wrap.innerHTML = `
    <img src="assets/brand-widget.png" alt="Invincible OS by PRON33R Universe">
    <img class="brand-caption" src="assets/brand-caption.png" alt="litrelly doing anything a.t.p.">
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
    win.style.left = (60 + Object.keys(this.windows).length*30) + 'px';
    win.style.top = (60 + Object.keys(this.windows).length*30) + 'px';
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
      el.style.top = state[id].top;
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

/* ===== DESKTOP ICONS ===== */
function buildDesktopIcons(){
  const zone = document.getElementById('appsZone');
  const icons = {
    terminal: { emoji:'🛠️', label:'Terminal' },
    notes:    { emoji:'📝', label:'Notes' }
  };
  for (const id in icons){
    const div = document.createElement('div');
    div.className = 'app-icon';
    div.innerHTML = `
      <img src="assets/icons/${id}.png" class="icon-img" alt="${icons[id].label}"
        onerror="this.outerHTML='<span class=icon-emoji>${icons[id].emoji}</span>'">
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
  initTheme();
  initBoot();
  buildDesktopIcons();
  initBrandWidget();
  initEverythingBtn();
  updateClock();
  setInterval(updateClock, 1000);
  WM.restoreState();
});

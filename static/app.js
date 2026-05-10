const API = {
  async call(method, path, body) {
    const opts = { method, headers: { 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(path, opts);
    return res.json();
  },
  register(username, password) { return API.call('POST', '/api/register', { username, password }); },
  login(username, password) { return API.call('POST', '/api/login', { username, password }); },
  logout() { return API.call('POST', '/api/logout'); },
  me() { return API.call('GET', '/api/me'); },
  lessons() { return API.call('GET', '/api/lessons'); },
  markDone(lessonId) { return API.call('POST', '/api/progress/' + lessonId); },
  adminStudents() { return API.call('GET', '/api/admin/students'); },
  adminStudent(id) { return API.call('GET', '/api/admin/student/' + id); },
  cheatsheets() { return API.call('GET', '/api/cheatsheets'); }
};

const State = {
  user: null,
  progress: {},
  lessons: [],
  onboardingSeen: localStorage.getItem('onboarding_seen') === '1'
};

function slugify(v) {
  return v.toLowerCase().replace(/`/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function esc(v) {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function md(v) {
  return esc(v).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

const $ = (s) => document.querySelector(s);
const main = () => $('#app-main');
const header = () => $('#app-header');
const footer = () => $('#app-footer');

function renderHeader() {
  const u = State.user;
  header().innerHTML = `
    <div class="header-inner">
      <a class="brand" href="#/dashboard">
        <span class="brand-mark" translate="no">SQL</span>
        <span>PL/SQL</span>
      </a>
      <nav>
        ${u ? `<a href="#/dashboard">Dashboard</a>
        <a href="#/roadmap" class="hide-mobile">Roadmap</a>
        <a href="#/memory" class="hide-mobile">Memory</a>
        <span style="color:var(--text-muted);font-size:13px;margin:0 4px;">${esc(u.username)}</span>
        <a href="#" id="logout-btn">Logout</a>` : ''}
      </nav>
    </div>`;
  if (u) {
    $('#logout-btn').addEventListener('click', async (e) => {
      e.preventDefault();
      await API.logout();
      State.user = null;
      State.progress = {};
      window.location.hash = '#/login';
    });
  }
}

function renderFooter() {
  const u = State.user;
  footer().innerHTML = `
    <div class="footer-left">
      <span class="footer-item">PL/SQL Learning Platform &middot; ${State.lessons.length} lessons</span>
      <span class="footer-item footer-sep">${u ? 'ESPRIT &middot; ' + esc(u.username) : 'ESPRIT'}</span>
    </div>
    <a class="footer-credit" href="https://sadokdridi.me" target="_blank" rel="noopener">
      Built by <strong>Sadok</strong>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
    </a>`;
}

function setHTML(html) {
  main().innerHTML = html;
  renderHeader();
  renderFooter();
  dismissSplash();
}

function loadState(msg) {
  setHTML(`<div class="loading-card" style="margin-top:48px;">${msg}</div>`);
}

function showSplash(username, variant, callback) {
  const isNew = variant === 'new';
  const overlay = document.createElement('div');
  overlay.className = 'splash-overlay';
  overlay.innerHTML = `
    <div class="splash-brand">SQL</div>
    <div class="splash-greeting">${isNew ? 'Welcome aboard, ' + esc(username) + '!' : 'Welcome back, ' + esc(username)}</div>
    <div class="splash-sub">${isNew ? 'Your PL/SQL journey starts now' : 'Continue where you left off'}</div>`;
  document.body.appendChild(overlay);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.classList.add('in');
    });
  });

  setTimeout(() => {
    if (callback) callback();
  }, 3000);
}

function dismissSplash() {
  const splash = document.querySelector('.splash-overlay');
  if (splash) {
    splash.classList.remove('in');
    splash.classList.add('out');
    setTimeout(() => splash.remove(), 500);
  }
}

/* ── Login View ────────────────────────────── */

function renderLogin() {
  if (State.user) { window.location.hash = State.onboardingSeen ? '#/dashboard' : '#/onboarding'; return; }
  setHTML(`
    <div class="page login-page" style="max-width:420px;margin:60px auto;padding:0 24px;">
      <div style="text-align:center;margin-bottom:32px;">
        <div class="brand-mark entrance-scale" style="display:inline-flex;width:48px;height:48px;font-size:22px;">SQL</div>
        <h1 class="entrance entrance-2" style="font-size:24px;font-weight:700;margin-top:12px;letter-spacing:-0.02em;">PL/SQL Learning</h1>
        <p class="entrance entrance-3" style="color:var(--text-muted);font-size:13px;margin-top:4px;">ESPRIT &mdash; 133 structured lessons</p>
      </div>
      <div id="login-tabs" class="entrance entrance-3" style="display:flex;gap:0;margin-bottom:24px;border:1px solid var(--border);border-radius:8px;overflow:hidden;">
        <button class="tab-btn active" data-tab="login" style="flex:1;padding:10px;border:none;background:var(--bg-card);color:var(--text);font-family:var(--font-sans);font-size:14px;font-weight:500;cursor:pointer;">Login</button>
        <button class="tab-btn" data-tab="register" style="flex:1;padding:10px;border:none;background:transparent;color:var(--text-muted);font-family:var(--font-sans);font-size:14px;font-weight:500;cursor:pointer;">Register</button>
      </div>
      <div id="login-error" class="entrance entrance-3" style="color:#ef4444;font-size:13px;margin-bottom:12px;display:none;"></div>
      <form id="login-form">
        <input type="text" name="username" placeholder="Username" autocomplete="username" required class="entrance entrance-4" style="width:100%;padding:10px;margin-bottom:10px;background:var(--bg-code);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:var(--font-sans);font-size:14px;">
        <input type="password" name="password" placeholder="Password" autocomplete="current-password" required class="entrance entrance-5" style="width:100%;padding:10px;margin-bottom:16px;background:var(--bg-code);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:var(--font-sans);font-size:14px;">
        <button type="submit" class="btn btn-primary entrance entrance-6" id="login-submit-btn" style="width:100%;justify-content:center;">Login</button>
      </form>
      <p class="entrance entrance-7" style="text-align:center;color:var(--text-muted);font-size:12px;margin-top:16px;">Password must be at least 4 characters</p>
    </div>`);

  let mode = 'login';
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      mode = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => { b.classList.toggle('active', b === btn); b.style.background = b === btn ? 'var(--bg-card)' : 'transparent'; b.style.color = b === btn ? 'var(--text)' : 'var(--text-muted)'; });
      $('button[type=submit]').textContent = mode === 'login' ? 'Login' : 'Register';
    });
  });

  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const username = fd.get('username').trim();
    const password = fd.get('password');
    if (!username || !password) return;
    const errEl = $('#login-error');
    const btn = $('#login-submit-btn');
    errEl.style.display = 'none';
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Signing in...';

    const fn = mode === 'login' ? API.login : API.register;
    const res = await fn(username, password);

    if (!res.ok) {
      errEl.textContent = res.error;
      errEl.style.display = 'block';
      errEl.classList.remove('entrance', 'entrance-3');
      void errEl.offsetWidth;
      errEl.classList.add('entrance', 'entrance-3');
      btn.disabled = false;
      btn.textContent = mode === 'login' ? 'Login' : 'Register';
      return;
    }

    State.user = res.user;
    const me = await API.me();
    State.progress = me.progress || {};
    const wentOnboarding = localStorage.getItem('onboarding_seen') === '1';

    showSplash(username, mode === 'register' ? 'new' : 'return', () => {
      if (!wentOnboarding) {
        localStorage.setItem('onboarding_seen', '1');
        State.onboardingSeen = true;
        window.location.hash = '#/onboarding';
      } else {
        window.location.hash = '#/dashboard';
      }
    });
  });
}

/* ── Onboarding View ──────────────────────── */

function renderOnboarding() {
  if (!State.user) { window.location.hash = '#/login'; return; }
  if (State.onboardingSeen) { window.location.hash = '#/dashboard'; return; }
  localStorage.setItem('onboarding_seen', '1');
  State.onboardingSeen = true;

  const chapters = [...new Set(State.lessons.map(l => l.chapter))];
  const firstLesson = State.lessons[0] || null;

  setHTML(`
    <div class="onboarding-container">
      <div class="onboarding-dots" aria-label="Step indicator">
        <span class="ob-dot active" data-step="0"></span>
        <span class="ob-dot" data-step="1"></span>
        <span class="ob-dot" data-step="2"></span>
        <span class="ob-dot" data-step="3"></span>
      </div>

      <div class="onboarding-slides">
        <!-- Step 1: Welcome -->
        <div class="ob-step active" data-step="0">
          <div class="ob-icon">&#128075;</div>
          <h2>Welcome, ${esc(State.user.username)}!</h2>
          <p>You are about to master <strong>PL/SQL</strong> through <strong>${State.lessons.length} lessons</strong> across <strong>${chapters.length} chapters</strong>.</p>
          <p style="color:var(--text-muted);font-size:13px;margin-top:8px;">From anonymous blocks to triggers and exceptions &mdash; step by step, at your own pace.</p>
        </div>

        <!-- Step 2: Learning loop -->
        <div class="ob-step" data-step="1">
          <div class="ob-icon">&#128218;</div>
          <h2>How does it work?</h2>
          <p style="margin-bottom:24px;">Every lesson follows a proven learning loop:</p>
          <div class="ob-loop">
            <div class="ob-loop-item"><span class="ob-loop-num">1</span><strong>Run</strong><span>Copy &amp; execute in Oracle</span></div>
            <div class="ob-loop-item"><span class="ob-loop-num">2</span><strong>Memorize</strong><span>Internalize syntax &amp; key points</span></div>
            <div class="ob-loop-item"><span class="ob-loop-num">3</span><strong>Practice</strong><span>Try variants of the concept</span></div>
            <div class="ob-loop-item"><span class="ob-loop-num">4</span><strong>Drill</strong><span>Write from memory, no peeking</span></div>
            <div class="ob-loop-item"><span class="ob-loop-num">&#10003;</span><strong>Mark Done</strong><span>Track your progress</span></div>
          </div>
        </div>

        <!-- Step 3: First lesson preview -->
        <div class="ob-step" data-step="2">
          <div class="ob-icon">&#128640;</div>
          <h2>Your first lesson</h2>
          ${firstLesson ? `
            <div class="ob-preview">
              <p style="font-size:12px;color:var(--text-muted);margin-bottom:4px;">${esc(firstLesson.chapter)}</p>
              <h3 style="font-size:18px;margin-bottom:10px;">${esc(firstLesson.title)}</h3>
              <pre style="background:var(--bg-code);border:1px solid var(--border);border-radius:8px;padding:14px;overflow:auto;font-family:var(--font-mono);font-size:12px;line-height:1.6;color:var(--text-secondary);max-height:140px;"><code>${esc(firstLesson.run.split('\\n').slice(0, 6).join('\\n'))}</code></pre>
              <p style="font-size:12px;color:var(--text-muted);margin-top:8px;">Schema: <strong>${esc(firstLesson.schema)}</strong> &middot; ${State.lessons.length} lessons total</p>
            </div>
          ` : '<p style="color:var(--text-muted);">Loading lessons...</p>'}
        </div>

        <!-- Step 4: Summary -->
        <div class="ob-step" data-step="3">
          <div class="ob-icon">&#9989;</div>
          <h2>You are all set!</h2>
          <p>Lessons are tracked automatically. Review your memorization items anytime from the <strong>Memory</strong> tab.</p>
          <p style="color:var(--text-muted);font-size:13px;margin-top:8px;">Open Oracle SQL*Plus or SQL Developer in another window and start coding.</p>
        </div>
      </div>

      <div class="onboarding-nav">
        <button class="btn" id="ob-prev" style="visibility:hidden;">&larr; Back</button>
        <button class="btn btn-primary" id="ob-next">How does it work?</button>
      </div>
    </div>`);

  let step = 0;
  const totalSteps = 4;
  const stepButtons = ['How does it work?', 'Got it', 'Let\'s go!', 'Start Learning'];

  const slides = document.querySelectorAll('.ob-step');
  const dots = document.querySelectorAll('.ob-dot');
  const prevBtn = $('#ob-prev');
  const nextBtn = $('#ob-next');

  function showStep(n) {
    step = Math.max(0, Math.min(n, totalSteps - 1));
    slides.forEach((s, i) => { s.classList.toggle('active', i === step); });
    dots.forEach((d, i) => { d.classList.toggle('active', i <= step); });
    prevBtn.style.visibility = step === 0 ? 'hidden' : 'visible';
    nextBtn.textContent = stepButtons[step];
    if (step === totalSteps - 1) {
      nextBtn.classList.add('btn-primary');
    } else {
      nextBtn.classList.add('btn-primary');
    }
  }

  function goNext() {
    if (step < totalSteps - 1) { showStep(step + 1); return; }
    if (firstLesson) {
      window.location.hash = '#/learn/' + encodeURIComponent(firstLesson.chapter) + '/' + encodeURIComponent(firstLesson.id);
    } else {
      window.location.hash = '#/dashboard';
    }
  }

  nextBtn.addEventListener('click', goNext);
  prevBtn.addEventListener('click', () => showStep(step - 1));

  document.addEventListener('keydown', function obKey(e) {
    if (e.key === 'ArrowRight') goNext();
    else if (e.key === 'ArrowLeft') showStep(step - 1);
  });
}

/* ── Dashboard View ───────────────────────── */

function renderDashboard() {
  if (!State.user) { window.location.hash = '#/login'; return; }

  const chapters = new Map();
  for (const l of State.lessons) {
    const ch = l.chapter;
    if (!chapters.has(ch)) chapters.set(ch, { total: 0, done: 0, lessons: [] });
    const c = chapters.get(ch);
    c.total++;
    if (State.progress[l.id]) c.done++;
    c.lessons.push(l);
  }

  const totalDone = Object.values(State.progress).filter(p => p.done).length;
  const totalLessons = State.lessons.length;
  const chaptersWithDone = [...chapters.values()].filter(c => c.done > 0).length;

  setHTML(`
    <section class="hero">
      <div class="hero-left">
        <div class="ascii-wrapper">
          <div class="ascii-container">
            <pre class="ascii-art ascii-bg" aria-hidden="true">
██████╗ ██╗         ███████╗ ██████╗ ██╗     
██╔══██╗██║         ██╔════╝██╔═══██╗██║     
██████╔╝██║         ███████╗██║   ██║██║     
██╔═══╝ ██║         ╚════██║██║▄▄ ██║██║     
██║     ███████╗    ███████║╚██████╔╝███████╗
╚═╝     ╚══════╝    ╚══════╝ ╚══▀▀═╝ ╚══════╝
            </pre>
            <pre class="ascii-art ascii-wipe" aria-hidden="true">
██████╗ ██╗         ███████╗ ██████╗ ██╗     
██╔══██╗██║         ██╔════╝██╔═══██╗██║     
██████╔╝██║         ███████╗██║   ██║██║     
██╔═══╝ ██║         ╚════██║██║▄▄ ██║██║     
██║     ███████╗    ███████║╚██████╔╝███████╗
╚═╝     ╚══════╝    ╚══════╝ ╚══▀▀═╝ ╚══════╝
            </pre>
          </div>
        </div>
      </div>
      <div class="hero-copy entrance entrance-2">
        <p class="hero-desc">Welcome, ${esc(State.user.username)}.<br>Master PL/SQL step-by-step </p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/roadmap">View Roadmap</a>
          <a class="btn" href="#/memory">Review Memory</a>
        </div>
      </div>
    </section>

    <div class="section-head entrance entrance-3" style="padding-top:8px;">
      <h2>Continue Where You Left Off</h2>
      <p>Jump to the next unfinished lesson in each chapter</p>
    </div>
    <div class="continue-grid entrance-stagger" style="padding-bottom:40px;">
      ${[...chapters.entries()].map(([name, c]) => {
        if (c.done === 0 || c.done === c.total) return ''; // skip untouched or fully done
        const firstUndone = c.lessons.find(l => !State.progress[l.id]);
        if (!firstUndone) return '';
        return `<a href="#/learn/${encodeURIComponent(name)}/${encodeURIComponent(firstUndone.id)}" class="continue-card entrance">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
            <div>
              <strong style="color:var(--text);">${md(name)}</strong>
              <p style="font-size:12px;color:var(--text-muted);margin-top:2px;">Next: ${esc(firstUndone.title)}</p>
              <p style="font-size:11px;color:var(--text-muted);">${c.done}/${c.total} complete &middot; ${c.total ? Math.round(c.done / c.total * 100) : 0}%</p>
            </div>
            <span style="font-size:20px;flex-shrink:0;color:var(--text-muted);">&rarr;</span>
          </div>
        </a>`;
      }).filter(Boolean).join('') || '<div class="continue-card entrance" style="opacity:0.5;cursor:default;pointer-events:none;display:flex;align-items:center;gap:10px;padding:16px;"><span style="font-size:18px;">&#128218;</span><div><strong style="color:var(--text);">All chapters done or not started yet</strong><p style="font-size:12px;color:var(--text-muted);">Visit the roadmap to browse all lessons.</p></div></div>'}
    </div>`);
}

/* ── Chapter Overview ─────────────────────── */

function renderChapter(chapterName) {
  if (!State.user) { window.location.hash = '#/login'; return; }

  const chLessons = State.lessons.filter(l => l.chapter === chapterName);
  if (!chLessons.length) { setHTML('<div class="empty-state"><h3>Chapter not found</h3></div>'); return; }

  const doneCount = chLessons.filter(l => State.progress[l.id]).length;
  const pct = Math.round(doneCount / chLessons.length * 100);

  setHTML(`
    <div style="max-width:900px;margin:0 auto;padding:32px 0;">
      <a href="#/dashboard" style="color:var(--text-muted);font-size:13px;text-decoration:none;">&larr; Back to Dashboard</a>
      <div class="section-head" style="padding-top:16px;">
        <p>${doneCount}/${chLessons.length} complete</p>
        <h2>${md(chapterName)}</h2>
      </div>
      <div class="progress-track" style="margin-bottom:24px;">
        <span style="width:${pct}%"></span>
      </div>
      <div class="memory-grid">
        ${chLessons.map(l => {
          const done = !!State.progress[l.id];
          return `<a href="#/learn/${encodeURIComponent(chapterName)}/${encodeURIComponent(l.id)}" class="memory-card" style="text-decoration:none;color:inherit;${done ? 'border-color:var(--check-done);' : ''}">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
              <h3 style="margin:0;">${done ? '&#10003; ' : ''}${esc(l.title)}</h3>
              <span style="font-size:11px;padding:2px 8px;border-radius:10px;font-weight:500;flex-shrink:0;${done ? 'background:rgba(16,185,129,0.1);color:var(--check-done);' : 'background:var(--bg-code);color:var(--text-muted);'}">${done ? 'Done' : 'Next'}</span>
            </div>
            <p style="font-size:12px;color:var(--text-muted);margin-top:6px;">Schema: ${esc(l.schema)}</p>
          </a>`;
        }).join('')}
      </div>
    </div>`);
}

/* ── Lesson Detail ────────────────────────── */

function renderLesson(chapterName, lessonId) {
  if (!State.user) { window.location.hash = '#/login'; return; }

  const lesson = State.lessons.find(l => l.id === lessonId && l.chapter === chapterName);
  if (!lesson) { setHTML('<div class="empty-state"><h3>Lesson not found</h3></div>'); return; }

  const done = !!State.progress[lesson.id];

  setHTML(`
    <div style="max-width:900px;margin:0 auto;padding:32px 0;">
      <a href="#/learn/${encodeURIComponent(chapterName)}" style="color:var(--text-muted);font-size:13px;text-decoration:none;">&larr; Back to ${esc(chapterName)}</a>

      <div class="section-head" style="padding-top:16px;">
        <p>${done ? '&#10003; Completed' : 'In Progress'}</p>
        <h2>${esc(lesson.title)}</h2>
        <p>Schema: <strong>${esc(lesson.schema)}</strong></p>
      </div>

      <!-- Run -->
      <div class="memory-card" style="margin-bottom:16px;">
        <h3 style="font-size:14px;margin-bottom:8px;">1. Run This Code</h3>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:10px;">Copy and execute in Oracle SQL*Plus or SQL Developer</p>
        <pre><code>${esc(lesson.run)}</code></pre>
      </div>

      <!-- Memorize -->
      <div class="memory-card" style="margin-bottom:16px;">
        <h3 style="font-size:14px;margin-bottom:8px;">2. Memorize</h3>
        <pre style="margin-bottom:14px;"><code>${esc(lesson.memorize.syntax)}</code></pre>
        <ul style="list-style:none;padding:0;">
          ${(lesson.memorize.points || []).map(p => `<li style="position:relative;padding:3px 0 3px 18px;font-size:13px;color:var(--text-secondary);line-height:1.55;"><span style="position:absolute;left:0;top:10px;width:6px;height:6px;border-radius:50%;background:var(--text-muted);display:inline-block;"></span>${md(p)}</li>`).join('')}
        </ul>
      </div>

      <!-- Practice -->
      ${lesson.practice && lesson.practice.length ? `
      <div class="memory-card" style="margin-bottom:16px;">
        <h3 style="font-size:14px;margin-bottom:8px;">3. Practice Variants</h3>
        ${lesson.practice.map((p, i) => `
          <div style="margin-bottom:${i < lesson.practice.length - 1 ? '16px' : '0'};">
            <p style="font-size:12px;color:var(--text-muted);margin-bottom:6px;font-weight:600;">${esc(p.label)}</p>
            <pre><code>${esc(p.code)}</code></pre>
          </div>
        `).join('')}
      </div>` : ''}

      <!-- Drill -->
      <div class="memory-card" style="margin-bottom:16px;">
        <h3 style="font-size:14px;margin-bottom:8px;">4. Drill (Write From Memory)</h3>
        <p style="color:var(--text-secondary);font-size:13px;line-height:1.6;">${md(lesson.drill)}</p>
      </div>

      <!-- Mark Done -->
      <div style="text-align:center;padding:20px 0 40px;">
        ${done ? `
          <span class="btn" disabled style="opacity:0.5;cursor:default;">&#10003; Lesson Completed</span>
          ${(() => {
            const chLessons = State.lessons.filter(l => l.chapter === chapterName);
            const idx = chLessons.findIndex(l => l.id === lessonId);
            const nextLesson = idx >= 0 && idx < chLessons.length - 1 ? chLessons[idx + 1] : null;
            const chapterOrder = [...new Set(State.lessons.map(l => l.chapter))];
            const chIdx = chapterOrder.indexOf(chapterName);
            const nextChapter = chIdx >= 0 && chIdx < chapterOrder.length - 1 ? chapterOrder[chIdx + 1] : null;
            const firstOfNext = nextChapter ? State.lessons.find(l => l.chapter === nextChapter) : null;
            const isLastLesson = !nextLesson && !firstOfNext;

            if (isLastLesson) {
              return '<div style="margin-top:20px;padding:24px;border:1px solid var(--check-done);border-radius:12px;background:rgba(16,185,129,0.06);"><p style="font-size:18px;font-weight:700;color:var(--check-done);margin-bottom:6px;">&#127881; All 133 lessons completed!</p><p style="font-size:13px;color:var(--text-secondary);">You have mastered every PL/SQL lesson. Outstanding work!</p></div>';
            }
            if (nextLesson) {
              return '<div style="margin-top:20px;"><a class="btn btn-primary" href="#/learn/' + encodeURIComponent(chapterName) + '/' + encodeURIComponent(nextLesson.id) + '" style="padding:10px 28px;">Next Lesson &rarr;</a><p style="font-size:12px;color:var(--text-muted);margin-top:6px;">' + esc(nextLesson.title) + '</p></div>';
            }
            return '<div style="margin-top:20px;"><a class="btn btn-primary" href="#/learn/' + encodeURIComponent(nextChapter) + '/' + encodeURIComponent(firstOfNext.id) + '" style="padding:10px 28px;">Next Chapter &rarr;</a><p style="font-size:12px;color:var(--text-muted);margin-top:6px;">' + esc(nextChapter) + '</p></div>';
          })()}
        ` : `
          <button class="btn btn-primary" id="mark-done-btn" style="padding:12px 32px;font-size:15px;">Mark as Done</button>
        `}
      </div>
    </div>`);

  if (!done) {
    $('#mark-done-btn').addEventListener('click', async () => {
      const res = await API.markDone(lesson.id);
      if (res.ok) {
        State.progress[lesson.id] = { done: 1, completed_at: new Date().toISOString() };
        renderLesson(chapterName, lessonId);
      }
    });
  }
}

/* ── Roadmap View ─────────────────────────── */

function renderRoadmap() {
  if (!State.user) { window.location.hash = '#/login'; return; }

  const chapters = new Map();
  for (const l of State.lessons) {
    const ch = l.chapter;
    if (!chapters.has(ch)) chapters.set(ch, []);
    chapters.get(ch).push(l);
  }

  const totalDone = Object.keys(State.progress).length;
  const totalLessons = State.lessons.length;
  const pct = totalLessons ? Math.round(totalDone / totalLessons * 100) : 0;
  const circumference = 2 * Math.PI * 42;

  // Chapter-level counts
  const chEntries = [...chapters.entries()];
  const chaptersFullyDone = chEntries.filter(([, items]) => items.every(l => State.progress[l.id])).length;
  const chaptersInProgress = chEntries.filter(([, items]) => {
    const done = items.filter(l => State.progress[l.id]).length;
    return done > 0 && done < items.length;
  }).length;
  const chaptersUntouched = chEntries.length - chaptersFullyDone - chaptersInProgress;

  setHTML(`
    <section class="hero" style="padding: 32px 0 24px; display: flex; flex-direction: column; align-items: center; gap: 24px;">
      <aside class="roadmap-ring-wrap">
        <svg width="100" height="100" viewBox="0 0 100 100" style="display:block;">
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--progress-bg)" stroke-width="6"/>
          <circle cx="50" cy="50" r="42" fill="none" stroke="var(--text)" stroke-width="6"
            stroke-linecap="round" stroke-dasharray="${circumference}"
            stroke-dashoffset="${circumference * (1 - pct / 100)}"
            transform="rotate(-90 50 50)" style="transition: stroke-dashoffset 0.8s ease;"/>
          <text x="50" y="47" text-anchor="middle" fill="var(--text)" font-family="var(--font-sans)" font-size="20" font-weight="700" letter-spacing="-0.03em">${pct}%</text>
          <text x="50" y="65" text-anchor="middle" fill="var(--text-muted)" font-family="var(--font-sans)" font-size="10">complete</text>
        </svg>
        <div class="orbit-note">
          <strong>${totalDone}</strong> / ${totalLessons}
          <span>lessons completed</span>
        </div>
      </aside>
      <div class="roadmap-chapter-summary">
        <div class="rcs-chip">
          <span class="rcs-dot" style="background:var(--check-done);"></span>
          <strong>${chaptersFullyDone}</strong> fully done
        </div>
        <div class="rcs-chip">
          <span class="rcs-dot" style="background:#f59e0b;"></span>
          <strong>${chaptersInProgress}</strong> in progress
        </div>
        <div class="rcs-chip">
          <span class="rcs-dot" style="background:var(--text-muted);"></span>
          <strong>${chaptersUntouched}</strong> untouched
        </div>
      </div>
    </section>

    <div class="roadmap-grid">
      ${[...chapters.entries()].map(([ch, items]) => {
        const done = items.filter(l => State.progress[l.id]).length;
        const cpct = Math.round(done / items.length * 100);
        return `
          <section class="roadmap-card">
            <div class="roadmap-card-header">
              <div>
                <p>${done}/${items.length} complete</p>
                <h3>${md(ch)}</h3>
              </div>
              <span class="roadmap-percent">${cpct}%</span>
            </div>
            <div class="progress-track" aria-label="Progress">
              <span style="width:${cpct}%"></span>
            </div>
            <ul class="roadmap-list">
              ${items.map((l, i) => {
                const isDone = !!State.progress[l.id];
                return `<li class="roadmap-task ${isDone ? 'done' : 'pending'}">
                  <span class="task-check" aria-hidden="true">${isDone ? '\u2713' : i + 1}</span>
                  <a href="#/learn/${encodeURIComponent(ch)}/${encodeURIComponent(l.id)}" class="task-text" style="text-decoration:none;">${esc(l.title)}</a>
                  <span class="task-state">${isDone ? 'Done' : 'Next'}</span>
                </li>`;
              }).join('')}
            </ul>
          </section>`;
      }).join('')}
    </div>`);
}

/* ── Memory View ──────────────────────────── */

async function renderMemory() {
  setHTML('<div class="loading-card" style="margin-top:48px;">Loading cheat sheets...</div>');

  let sheets;
  try {
    sheets = await API.cheatsheets();
  } catch (e) {
    setHTML('<div class="empty-state" style="margin-top:48px;"><h3>Error loading cheat sheets</h3></div>');
    return;
  }

  if (!Array.isArray(sheets) || !sheets.length) {
    setHTML('<div class="empty-state" style="margin-top:48px;"><h3>No cheat sheets available</h3></div>');
    return;
  }

  setHTML(`
    <div class="cheatsheet-container">
      <div class="cheatsheet-tabs" id="cs-tabs">
        ${sheets.map((s, i) => `
          <button class="cs-tab${i === 0 ? ' active' : ''}" data-idx="${i}">${esc(s.chapter.split(':')[1] || s.chapter)}</button>
        `).join('')}
      </div>
      <div class="cheatsheet-panels" id="cs-panels">
        ${sheets.map((s, i) => `
          <div class="cs-panel${i === 0 ? ' active' : ''}" data-idx="${i}">
            <h2 class="cs-panel-title">${md(s.chapter)}</h2>
            <div class="cs-columns">
              <div class="cs-col">
                <h3 class="cs-col-head">Syntax</h3>
                <div class="cs-syntax-grid">
                  ${s.syntaxes.map(sy => `
                    <div class="cs-syntax-item">
                      <span class="cs-syntax-label">${esc(sy.label)}</span>
                      <pre><code>${esc(sy.code)}</code></pre>
                    </div>
                  `).join('')}
                </div>
              </div>
              <div class="cs-col">
                <h3 class="cs-col-head">Rules</h3>
                <ul class="cs-rules">
                  ${s.rules.map(r => `<li>${md(r)}</li>`).join('')}
                </ul>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>`);

  const tabs = document.querySelectorAll('.cs-tab');
  const panels = document.querySelectorAll('.cs-panel');

  function switchTab(idx) {
    tabs.forEach(t => t.classList.toggle('active', parseInt(t.dataset.idx) === idx));
    panels.forEach(p => p.classList.toggle('active', parseInt(p.dataset.idx) === idx));
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(parseInt(tab.dataset.idx)));
  });

  renderHeader();
  renderFooter();
}

/* ── Admin View ───────────────────────────── */

async function renderAdmin() {
  setHTML('<div class="loading-card" style="margin-top:48px;">Loading admin panel...</div>');

  try {
    const students = await API.adminStudents();
    if (!Array.isArray(students)) {
      setHTML(`<div class="empty-state" style="margin-top:48px;"><h3>Access Denied</h3><p>You do not have admin privileges.</p></div>`);
      renderHeader();
      renderFooter();
      return;
    }

    setHTML(`
      <div class="section-head" style="padding-top:32px;">
        <h2>Admin Panel</h2>
        <p>${students.length} registered student${students.length !== 1 ? 's' : ''}</p>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;padding-bottom:40px;">
        ${students.map(s => `
          <div class="memory-card" style="cursor:default;">
            <div class="admin-student-row" style="display:flex;align-items:center;justify-content:space-between;gap:16px;">
              <div>
                <h3 style="margin:0 0 4px;">${esc(s.username)}</h3>
                <p style="font-size:12px;color:var(--text-muted);">${s.done}/${s.total} complete &middot; ${s.percent}%</p>
              </div>
              <div class="admin-student-pct" style="flex-shrink:0;text-align:right;">
                <span style="font-size:20px;font-weight:700;color:var(--text-secondary);">${s.percent}%</span>
                <br>
                <button class="btn" data-student="${s.id}" style="font-size:12px;padding:4px 12px;margin-top:4px;">Details</button>
              </div>
            </div>
            <div class="progress-track" style="margin-top:12px;">
              <span style="width:${s.percent}%"></span>
            </div>
            <div class="student-detail" data-student="${s.id}" style="display:none;margin-top:12px;padding-top:12px;border-top:1px solid var(--border);"></div>
          </div>
        `).join('')}
      </div>`);

    document.querySelectorAll('.btn[data-student]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.student;
        const detailEl = document.querySelector(`.student-detail[data-student="${id}"]`);
        if (detailEl.style.display !== 'none') { detailEl.style.display = 'none'; btn.textContent = 'Details'; return; }

        btn.textContent = 'Loading...';
        btn.disabled = true;
        const data = await API.adminStudent(parseInt(id));
        btn.disabled = false;
        btn.textContent = 'Hide';

        const chs = data.progress_per_chapter || {};
        detailEl.innerHTML = Object.keys(chs).length ? `
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${Object.entries(chs).map(([ch, st]) => `
              <div style="font-size:13px;color:var(--text-secondary);">
                <strong style="color:var(--text);">${esc(ch)}</strong>: ${st.done}/${st.total} (${st.percent}%)
                <div class="progress-track" style="margin-top:4px;"><span style="width:${st.percent}%"></span></div>
              </div>
            `).join('')}
          </div>
        ` : '<p style="font-size:13px;color:var(--text-muted);">No progress yet.</p>';
        detailEl.style.display = 'block';
      });
    });
  } catch (e) {
    setHTML('<div class="empty-state" style="margin-top:48px;"><h3>Error loading admin panel</h3></div>');
  }
}

/* ── Router ────────────────────────────────── */

function route() {
  const raw = window.location.hash.replace(/^#/, '') || '/dashboard';
  const h = decodeURIComponent(raw);

  if (h === '/login') return renderLogin();
  if (h === '/onboarding') return renderOnboarding();
  if (h === '/dashboard') return renderDashboard();
  if (h === '/roadmap') return renderRoadmap();
  if (h === '/memory') return renderMemory();
  if (h === '/admin') return renderAdmin();

  const m2 = h.match(/^\/learn\/(.+)\/(.+)$/);
  if (m2) return renderLesson(m2[1], m2[2]);

  const m1 = h.match(/^\/learn\/(.+)$/);
  if (m1) return renderChapter(m1[1]);

  window.location.hash = '#/dashboard';
}

function navigate(hash) {
  window.location.hash = hash;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/* ── Init ──────────────────────────────────── */

async function init() {
  try {
    const me = await API.me();
    if (me.user) {
      State.user = me.user;
      State.progress = me.progress || {};
    }

    const lessons = await API.lessons();
    if (Array.isArray(lessons)) State.lessons = lessons;

    if (!State.onboardingSeen) State.onboardingSeen = localStorage.getItem('onboarding_seen') === '1';
  } catch (e) {
    console.error('Init error:', e);
  }

  window.addEventListener('hashchange', () => {
    route();
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
  route();
}

init();

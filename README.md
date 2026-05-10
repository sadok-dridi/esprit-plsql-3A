<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>esprit-plsql-3A</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #0a0a0a;
      color: #fafafa;
      font-family: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
      font-size: 15px;
      line-height: 1.6;
      padding: 0 24px 60px;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
    }

    /* ASCII */
    .ascii-wrapper {
      display: flex;
      justify-content: center;
      padding: 64px 0 40px;
    }
    .ascii {
      font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
      font-size: 13px;
      line-height: 1.15;
      white-space: pre;
      color: #6b6b6b;
      user-select: none;
      letter-spacing: -1px;
    }
    .ascii .fg {
      color: #fafafa;
    }

    /* Headings */
    h1 {
      text-align: center;
      font-size: 40px;
      font-weight: 700;
      letter-spacing: -0.03em;
      margin-bottom: 12px;
    }
    .subtitle {
      text-align: center;
      font-size: 17px;
      color: #a1a1a1;
      font-weight: 450;
      letter-spacing: -0.01em;
      max-width: 560px;
      margin: 0 auto 56px;
      text-wrap: balance;
    }
    .subtitle code {
      font-family: "JetBrains Mono", "Fira Code", monospace;
      font-size: 14px;
      background: rgba(255,255,255,0.04);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.08);
    }

    /* Cards */
    .card {
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      background: #111111;
      padding: 28px;
      margin-bottom: 16px;
    }
    .card h2 {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
    }
    .card h3 {
      font-size: 13px;
      font-weight: 600;
      color: #6b6b6b;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      margin: 24px 0 10px;
    }
    .card p, .card li {
      color: #a1a1a1;
      font-size: 14px;
      line-height: 1.65;
    }

    /* Code blocks */
    pre {
      font-family: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
      font-size: 12px;
      line-height: 1.6;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 14px 18px;
      overflow-x: auto;
      color: #a1a1a1;
      margin: 12px 0;
    }
    pre .kw   { color: #fafafa; }
    pre .cm   { color: #6b6b6b; }
    pre .str  { color: #a1a1a1; }

    code.inline {
      font-family: "JetBrains Mono", "Fira Code", monospace;
      font-size: 12px;
      background: rgba(255,255,255,0.04);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.08);
    }

    /* Badges */
    .badges {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 32px;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      font-size: 12px;
      font-weight: 450;
      color: #a1a1a1;
      font-family: "JetBrains Mono", "Fira Code", monospace;
    }
    .badge .dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .dot-py   { background: #fafafa; }
    .dot-fl   { background: #a1a1a1; }
    .dot-sql  { background: #6b6b6b; }
    .dot-dkr  { background: #e5e5e5; }

    /* Architecture box */
    .arch {
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 14px 18px;
      font-family: "JetBrains Mono", "Fira Code", monospace;
      font-size: 12px;
      line-height: 1.7;
      color: #6b6b6b;
    }
    .arch .hl { color: #fafafa; }

    /* Grids */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin: 16px 0;
    }
    .stat-box {
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 10px;
      background: #111111;
      padding: 18px;
      text-align: center;
    }
    .stat-box .num {
      display: block;
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
    }
    .stat-box .lbl {
      display: block;
      font-size: 12px;
      color: #6b6b6b;
      margin-top: 2px;
    }

    /* Chapter pills */
    .chapters {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 12px 0;
    }
    .ch-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      font-size: 13px;
      font-weight: 450;
      color: #a1a1a1;
    }
    .ch-pill .tag {
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 10px;
      background: rgba(255,255,255,0.04);
      color: #6b6b6b;
      font-family: "JetBrains Mono", "Fira Code", monospace;
    }

    /* Quick start */
    .step {
      display: flex;
      gap: 14px;
      padding: 10px 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
      align-items: baseline;
    }
    .step:last-child { border-bottom: none; }
    .step-num {
      font-family: "JetBrains Mono", "Fira Code", monospace;
      font-size: 12px;
      color: #6b6b6b;
      min-width: 24px;
      flex-shrink: 0;
    }
    .step code {
      font-family: "JetBrains Mono", "Fira Code", monospace;
      font-size: 12px;
      background: rgba(255,255,255,0.04);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(255,255,255,0.08);
      color: #a1a1a1;
    }

    /* API table */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    th {
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      color: #6b6b6b;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 8px 12px;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    td {
      padding: 8px 12px;
      border-bottom: 1px solid rgba(255,255,255,0.04);
      color: #a1a1a1;
    }
    td:first-child {
      font-family: "JetBrains Mono", "Fira Code", monospace;
      font-size: 12px;
      color: #fafafa;
    }

    /* Divider */
    hr {
      border: none;
      border-top: 1px solid rgba(255,255,255,0.08);
      margin: 0;
    }

    @media (max-width: 640px) {
      body { padding: 0 16px 40px; }
      h1 { font-size: 28px; }
      .ascii { font-size: 9px; letter-spacing: 0; }
      .ascii-wrapper { padding: 40px 0 28px; }
      .grid-2, .grid-3 { grid-template-columns: 1fr; }
      .card { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">

    <!-- ASCII Art -->
    <div class="ascii-wrapper">
      <pre class="ascii">
    ┌─────────────────────────────────────────┐
    │                                         │
    │   <span class="fg">██████╗ ██╗      █████╗ ███████╗ ██████╗ ██╗</span>
    │   <span class="fg">██╔══██╗██║     ██╔══██╗██╔════╝██╔═══██╗██║</span>
    │   <span class="fg">██████╔╝██║     ███████║███████╗██║   ██║██║</span>
    │   <span class="fg">██╔═══╝ ██║     ██╔══██║╚════██║██║▄▄ ██║██║</span>
    │   <span class="fg">██║     ███████╗██║  ██║███████║╚██████╔╝███████╗</span>
    │   <span class="fg">╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝ ╚══▀▀═╝ ╚══════╝</span>
    │                                         │
    │        <span class="fg">espri-plsql-3A</span>
    │                                         │
    └─────────────────────────────────────────┘
      </pre>
    </div>

    <h1>esprit-plsql-3A</h1>
    <p class="subtitle">
      A self-hosted web platform where <strong>ESPRIT</strong> university students learn
      <code>PL/SQL</code> step-by-step through 133 structured lessons &mdash;
      from anonymous blocks to advanced exception handling.
    </p>

    <!-- Badges -->
    <div class="badges">
      <span class="badge"><span class="dot dot-py"></span> Python 3.12</span>
      <span class="badge"><span class="dot dot-fl"></span> Flask</span>
      <span class="badge"><span class="dot dot-sql"></span> SQLite</span>
      <span class="badge"><span class="dot dot-dkr"></span> Docker</span>
      <span class="badge"><span class="dot dot-py"></span> Gunicorn</span>
      <span class="badge"><span class="dot dot-fl"></span> nginx</span>
    </div>

    <!-- Stats -->
    <div class="grid-3">
      <div class="stat-box">
        <span class="num">133</span>
        <span class="lbl">Lessons</span>
      </div>
      <div class="stat-box">
        <span class="num">5</span>
        <span class="lbl">Chapters</span>
      </div>
      <div class="stat-box">
        <span class="num">7</span>
        <span class="lbl">SPA Views</span>
      </div>
    </div>

    <!-- Chapters -->
    <div class="card">
      <h2>Course Scope</h2>
      <div class="chapters">
        <span class="ch-pill"><span class="tag">24</span> CH1: Anonymous Blocks</span>
        <span class="ch-pill"><span class="tag">17</span> CH2: Cursors</span>
        <span class="ch-pill"><span class="tag">19</span> CH3: Procedures &amp; Functions</span>
        <span class="ch-pill"><span class="tag">22</span> CH4: Triggers</span>
        <span class="ch-pill"><span class="tag">20</span> CH5: Exceptions</span>
        <span class="ch-pill"><span class="tag">14</span> Mini Projects</span>
        <span class="ch-pill"><span class="tag">17</span> Exam</span>
      </div>
      <p>
        Each lesson follows a structured flow:
        <strong>Read</strong> &rarr; <strong>Run</strong> the code &rarr;
        <strong>Memorize</strong> syntax &rarr; <strong>Practice</strong> variants &rarr;
        <strong>Drill</strong> from memory. Mark it done to track progress across all 133 items.
      </p>
    </div>

    <!-- Architecture -->
    <div class="card">
      <h2>Architecture</h2>
      <pre class="arch">
<span class="hl">nginx</span> (plsql.example.com → 127.0.0.1:8083)
  └── <span class="hl">Docker</span> container: plsql-learning
        ├── <span class="hl">gunicorn</span> → Flask app (internal port 8000)
        │     ├── /api/*        JSON API (auth, progress, lessons)
        │     └── /             static SPA (index.html)
        ├── <span class="hl">SQLite</span>: data/app.db
        └── <span class="hl">data/lessons.json</span> (133 lessons)
      </pre>
    </div>

    <!-- Quick Start -->
    <div class="card">
      <h2>Quick Start</h2>

      <h3>Local Development</h3>
      <div class="step">
        <span class="step-num">01</span>
        <span>Install dependencies: <code>pip install -r server/requirements.txt</code></span>
      </div>
      <div class="step">
        <span class="step-num">02</span>
        <span>Run the dev server: <code>python server/app.py</code></span>
      </div>
      <div class="step">
        <span class="step-num">03</span>
        <span>Open <a href="http://localhost:5000" style="color:#a1a1a1">http://localhost:5000</a></span>
      </div>

      <h3>VPS Deployment</h3>
      <div class="step">
        <span class="step-num">01</span>
        <span>Clone the repo: <code>git clone git@github.com:sadok-dridi/esprit-plsql-3A.git</code></span>
      </div>
      <div class="step">
        <span class="step-num">02</span>
        <span>Copy and edit env: <code>cp .env.example .env</code> → set <code>SECRET_KEY</code></span>
      </div>
      <div class="step">
        <span class="step-num">03</span>
        <span>Build and run: <code>docker compose up -d --build</code></span>
      </div>
      <div class="step">
        <span class="step-num">04</span>
        <span>Configure nginx: <code>proxy_pass http://127.0.0.1:8083;</code></span>
      </div>
    </div>

    <!-- API -->
    <div class="card">
      <h2>API Endpoints</h2>
      <table>
        <thead>
          <tr>
            <th>Method</th>
            <th>Path</th>
            <th>Auth</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>POST</td><td>/api/register</td><td>No</td><td>Create account</td></tr>
          <tr><td>POST</td><td>/api/login</td><td>No</td><td>Sign in</td></tr>
          <tr><td>POST</td><td>/api/logout</td><td>Yes</td><td>Sign out</td></tr>
          <tr><td>GET</td><td>/api/me</td><td>Yes</td><td>Current user + progress</td></tr>
          <tr><td>GET</td><td>/api/lessons</td><td>Yes</td><td>All 133 lessons</td></tr>
          <tr><td>POST</td><td>/api/progress/:id</td><td>Yes</td><td>Mark lesson done</td></tr>
          <tr><td>GET</td><td>/api/admin/students</td><td>No</td><td>All students &amp; stats</td></tr>
          <tr><td>GET</td><td>/api/admin/student/:id</td><td>No</td><td>Per-chapter detail</td></tr>
        </tbody>
      </table>
    </div>

  </div>
</body>
</html>

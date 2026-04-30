/* ============================================================
   agentmako landing — interactions
   ============================================================ */

(() => {

  /* ─── reveal-on-scroll ───
     `html.js-ready` is set by an inline script in the <head> before
     first paint, so .am-reveal elements start in their hidden state
     and don't flash visible. Here we just observe and toggle `.in`. */
  const reveals = document.querySelectorAll('.am-reveal');

  if ('IntersectionObserver' in window && reveals.length > 0) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach((el) => io.observe(el));
  } else {
    // No IntersectionObserver — reveal everything immediately.
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ─── ticker (auto-scrolling tool names) ─── */
  const tickerItems = [
    'mako_help', 'context_packet', 'file_preflight', 'reef_diff_impact', 'reef_scout',
    'cross_search', 'ast_find_pattern', 'route_trace', 'imports_impact',
    'db_table_schema', 'db_rls', 'tenant_leak_audit', 'flow_map',
    'project_findings', 'verification_state', 'lint_files', 'git_precommit_check',
    'extract_rule_template', 'reef_inspect', 'project_conventions'
  ];
  const tickerTrack = document.getElementById('ticker-track');
  if (tickerTrack) {
    tickerTrack.innerHTML = [...tickerItems, ...tickerItems]
      .map((t) => `<span>${t}</span>`).join('');
  }

  /* ─── GitHub star count ─── */
  const starButtons = document.querySelectorAll('[data-github-repo]');
  if (starButtons.length > 0 && 'fetch' in window) {
    const formatter = new Intl.NumberFormat('en-US');
    const repos = [...new Set([...starButtons].map((btn) => btn.dataset.githubRepo).filter(Boolean))];

    repos.forEach(async (repo) => {
      try {
        const res = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: { Accept: 'application/vnd.github+json' },
        });
        if (!res.ok) return;

        const data = await res.json();
        const count = Number(data.stargazers_count);
        if (!Number.isFinite(count)) return;

        const formatted = formatter.format(count);
        document.querySelectorAll(`[data-github-repo="${repo}"]`).forEach((btn) => {
          const countEl = btn.querySelector('[data-github-star-count]');
          const sepEl = btn.querySelector('[data-github-star-sep]');
          if (!countEl) return;

          countEl.textContent = formatted;
          countEl.removeAttribute('hidden');
          if (sepEl) sepEl.removeAttribute('hidden');
          btn.setAttribute('aria-label', `Open ${repo} on GitHub (${formatted} stars)`);
        });
      } catch {}
    });
  }

  /* ─── tool catalog: tab filter + search + click-to-expand ─── */
  const tabs = document.querySelectorAll('.am-tool-pill');
  const groups = document.querySelectorAll('.am-tools-group');
  const tools = document.querySelectorAll('.am-tool');
  const panel = document.getElementById('tool-panel');
  const panelName = document.getElementById('tool-panel-name');
  const panelCmd = document.getElementById('tool-panel-cmd');
  const searchInput = document.getElementById('tool-search');
  const toolCount = document.getElementById('tool-count');
  const toolsBar = document.getElementById('tools-bar');
  const totalTools = tools.length;
  const initialActive = 5;   // matches the default "Context" group count
  let activeGroup = 'context';
  let searchTerm = '';

  function applyFilter() {
    const q = searchTerm.toLowerCase();
    const searching = q.length > 0;

    // dim the category tabs while a search is running
    if (toolsBar) toolsBar.classList.toggle('is-search-active', searching);

    // when searching, all groups are "open" so cross-category matches appear
    groups.forEach((g) => {
      if (searching) {
        g.style.display = 'contents';
      } else {
        const isActive = g.dataset.group === activeGroup;
        g.classList.toggle('active', isActive);
        g.style.display = isActive ? 'contents' : 'none';
      }
    });

    let visible = 0;
    let visibleInActive = 0;
    tools.forEach((tool) => {
      const name = tool.dataset.name.toLowerCase();
      const desc = (tool.querySelector('.desc')?.textContent || '').toLowerCase();
      const groupId = tool.parentElement?.dataset.group;
      const matchesSearch = !q || name.includes(q) || desc.includes(q);
      const matchesGroup = searching || groupId === activeGroup;
      const show = matchesSearch && matchesGroup;
      tool.style.display = show ? '' : 'none';
      if (show) visible++;
      if (matchesSearch && groupId === activeGroup) visibleInActive++;
    });

    if (toolCount) {
      const shown = searching ? visible : visibleInActive;
      toolCount.innerHTML = `<strong>${shown}</strong> shown · ${totalTools} total`;
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      activeGroup = tab.dataset.group;
      tabs.forEach((t) => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      panel.classList.remove('open');
      applyFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value.trim();
      panel.classList.remove('open');
      applyFilter();
    });
    // `/` keyboard shortcut to focus search
    document.addEventListener('keydown', (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        searchInput.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchTerm = '';
        applyFilter();
        searchInput.blur();
      }
    });
  }

  tools.forEach((tool) => {
    tool.addEventListener('click', () => {
      const name = tool.dataset.name;
      const isOpen = panel.classList.contains('open') && panelName.textContent === name;
      if (isOpen) {
        panel.classList.remove('open');
        return;
      }
      panelName.textContent = name;
      panelCmd.textContent = `$ agentmako --json tool call . ${name} '{}'`;
      panel.classList.add('open');
    });
  });

  // initialize count
  applyFilter();

  /* ─── copy buttons ─── */
  document.querySelectorAll('.am-copy[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch {}
        document.body.removeChild(ta);
      }
      btn.classList.add('copied');
      btn.textContent = 'copied';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = 'copy';
      }, 1400);
    });
  });

  /* ─── click-to-copy command blocks (hero) ─── */
  document.querySelectorAll('.am-cmd[data-copy]').forEach((btn) => {
    const labelEl = btn.querySelector('.am-cmd__label');
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch {}
        document.body.removeChild(ta);
      }
      btn.classList.add('copied');
      if (labelEl) labelEl.textContent = 'copied';
      setTimeout(() => {
        btn.classList.remove('copied');
        if (labelEl) labelEl.textContent = 'copy';
      }, 1600);
    });
  });

  /* ─── playbook: copy CLAUDE.md content ─── */
  const playbookBtn = document.getElementById('playbook-copy');
  if (playbookBtn) {
    let cachedMd = null;
    playbookBtn.addEventListener('click', async () => {
      const original = playbookBtn.innerHTML;
      try {
        if (!cachedMd) {
          const res = await fetch('./CLAUDE.md', { cache: 'force-cache' });
          if (!res.ok) throw new Error('fetch failed');
          cachedMd = await res.text();
        }
        await navigator.clipboard.writeText(cachedMd);
        playbookBtn.classList.add('copied');
        playbookBtn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M20 6L9 17l-5-5"/></svg> Copied · paste into your project root';
        setTimeout(() => {
          playbookBtn.classList.remove('copied');
          playbookBtn.innerHTML = original;
        }, 2400);
      } catch {
        // fallback: copy from the rendered pre's textContent
        const pre = document.getElementById('playbook-text');
        if (pre) {
          try { await navigator.clipboard.writeText(pre.textContent); } catch {}
        }
        playbookBtn.classList.add('copied');
        playbookBtn.innerHTML = 'Copied (preview)';
        setTimeout(() => {
          playbookBtn.classList.remove('copied');
          playbookBtn.innerHTML = original;
        }, 2000);
      }
    });
  }

  /* ─── animated hero terminal ─── */
  const termBody = document.getElementById('hero-term-body');
  if (termBody) startTerminal(termBody);

  function startTerminal(body) {
    const TICK = 22;          // ms per char
    const PAUSE_LINE = 240;   // pause between regular lines
    const PAUSE_SHORT = 120;  // pause between comment lines
    const PAUSE_BLOCK = 700;  // pause before restart-caret
    const PAUSE_RESTART = 1800;

    const SCRIPT = [
      { cls: 'cmt', text: '# attach Mako to the project' },
      { cls: 'cmd', text: '$ agentmako connect . --no-db' },
      { cls: 'out', text: '  ✓ indexed 482 files · 6,213 symbols · 38 routes' },
      { cls: 'out', text: '  ✓ reef daemon ready · watcher active' },
      { cls: 'blank', text: '' },
      { cls: 'cmt', text: '# agent asks for an edit workflow, not a grep dump' },
      { cls: 'cmd', text: '$ agentmako tool call . mako_help \\' },
      { cls: 'cmd2', text: '    \'{"task":"fix broken auth callback route"}\'' },
      { cls: 'blank', text: '' },
      { cls: 'json', text: '{' },
      { cls: 'json', text: '  "steps": [' },
      { cls: 'json', text: '    "context_packet", "file_preflight",' },
      { cls: 'json', text: '    "route_trace", "lint_files"' },
      { cls: 'json', text: '  ],' },
      { cls: 'json', text: '  "daemon":       "watcher active",' },
      { cls: 'json', text: '  "_hints":       ["batch read-only follow-ups"]' },
      { cls: 'json', text: '}' },
      { cls: 'blank', text: '' },
      { cls: 'cmt', text: '# agent now has the next calls and freshness rules.' },
      { cls: 'caret', text: '' }
    ];

    let lineIdx = 0;
    let charIdx = 0;
    let timer = null;
    let lineEls = [];

    function render() {
      // ensure we have a div for current line
      while (lineEls.length <= lineIdx) {
        const el = document.createElement('div');
        el.className = 'am-term-line';
        body.appendChild(el);
        lineEls.push(el);
      }
    }

    function reset() {
      body.innerHTML = '';
      lineEls = [];
      lineIdx = 0;
      charIdx = 0;
      step();
    }

    function colorizeJson(text) {
      return text
        .replace(/("[^"]+")(\s*:)/g, '<span class="key">$1</span>$2')
        .replace(/:\s*("[^"]+")/g, ': <span class="str">$1</span>')
        .replace(/:\s*([0-9.]+)/g, ': <span class="num">$1</span>');
    }

    function step() {
      if (lineIdx >= SCRIPT.length) {
        timer = setTimeout(reset, PAUSE_RESTART);
        return;
      }

      const cur = SCRIPT[lineIdx];
      render();
      const el = lineEls[lineIdx];

      if (cur.cls === 'caret') {
        el.innerHTML = '<span class="prompt">$ </span><span class="caret"></span>';
        lineIdx += 1;
        timer = setTimeout(step, PAUSE_BLOCK);
        return;
      }

      if (cur.cls === 'blank') {
        el.innerHTML = '&nbsp;';
        lineIdx += 1;
        timer = setTimeout(step, PAUSE_SHORT);
        return;
      }

      // typewriter on this line
      charIdx += 1;
      const partial = cur.text.slice(0, charIdx);
      const done = charIdx >= cur.text.length;

      if (cur.cls === 'cmt') {
        el.className = 'am-term-line cmt';
        el.textContent = partial;
      } else if (cur.cls === 'cmd' || cur.cls === 'cmd2') {
        const cleaned = partial.replace(/^\$\s*/, '');
        const prefix = cur.cls === 'cmd' ? '<span class="prompt">$ </span>' : '&nbsp;&nbsp;';
        el.className = 'am-term-line';
        el.innerHTML = prefix + '<span class="key">' + escapeHtml(cleaned) + '</span>'
          + (done ? '' : '<span class="caret"></span>');
      } else if (cur.cls === 'out') {
        el.className = 'am-term-line ok';
        el.textContent = partial;
      } else if (cur.cls === 'json') {
        el.className = 'am-term-line';
        el.innerHTML = colorizeJson(escapeHtml(partial)) + (done ? '' : '<span class="caret"></span>');
      } else {
        el.className = 'am-term-line';
        el.textContent = partial;
      }

      if (done) {
        lineIdx += 1;
        charIdx = 0;
        const isCmt = cur.cls === 'cmt';
        timer = setTimeout(step, isCmt ? PAUSE_SHORT : PAUSE_LINE);
      } else {
        timer = setTimeout(step, TICK + Math.random() * 12);
      }
    }

    function escapeHtml(s) {
      return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }

    timer = setTimeout(step, 400);

    // pause when off-screen to save battery
    if ('IntersectionObserver' in window) {
      const visIo = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting && timer) {
            clearTimeout(timer);
            timer = null;
          } else if (e.isIntersecting && !timer) {
            timer = setTimeout(step, 400);
          }
        });
      }, { threshold: 0 });
      visIo.observe(body);
    }
  }

})();

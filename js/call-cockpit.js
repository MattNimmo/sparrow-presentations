/* ============================================
   CALL COCKPIT — call-cockpit.js
   Phases 1–4. Vanilla JS, no dependencies.
   ============================================ */

'use strict';

/* ── SVG constants ── */
const COPY_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
const CHECK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

/* ── Step metadata ── */
const STEPS = [
  { id: 'step0', num: '0', name: 'Before the Call',    tagline: '30-second reset' },
  { id: 'step1', num: '1', name: 'Setting Expectations', tagline: 'Connect human-to-human' },
  { id: 'step2', num: '2', name: 'Basic Info',           tagline: 'Get into Chariot' },
  { id: 'step3', num: '3', name: 'Collecting Inventory', tagline: 'You name, they confirm' },
  { id: 'step4', num: '4', name: 'Paint the Picture',    tagline: 'Anchor on their words' },
  { id: 'step5', num: '5', name: 'Confirm Basic Info',   tagline: 'Build the Yes Ladder' },
  { id: 'step6', num: '6', name: 'Present the Pricing',  tagline: 'Verbal first, one number' },
  { id: 'step7', num: '7', name: 'Assume the Sale',      tagline: 'Immediate, confident' },
  { id: 'step8', num: '8', name: 'Objections & Rebuttals', tagline: 'Address → Reassure → Close' },
  { id: 'step9', num: '9', name: 'Rewrap & Close',       tagline: 'Always close on something' },
];

/* ── Toast ── */
let _toastTimer = null;
function toast(msg) {
  const el = document.getElementById('cockpitToast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('visible');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('visible'), 1600);
}

/* ── Clipboard ── */
async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Copied');
    if (btn) {
      btn.innerHTML = CHECK_SVG;
      setTimeout(() => { btn.innerHTML = COPY_SVG; }, 1400);
    }
  } catch (_) {
    toast('Copy failed');
  }
}

/* ── Phase 1.1 — Multi-open accordion with sessionStorage ── */
function persistOpenSteps() {
  const open = [...document.querySelectorAll('.step-card.open')].map(c => c.id);
  sessionStorage.setItem('nest-open-steps', JSON.stringify(open));
}

function toggleStep(id) {
  const card = document.getElementById(id);
  if (!card) return;
  card.classList.toggle('open');
  persistOpenSteps();
  updateProgress();
  updateJumperActive();
}

// Make globally accessible (called by existing inline onclick)
window.toggleStep = toggleStep;

function collapseAll() {
  document.querySelectorAll('.step-card.open').forEach(c => c.classList.remove('open'));
  persistOpenSteps();
  updateProgress();
  updateJumperActive();
}

function restoreOpenSteps() {
  const saved = JSON.parse(sessionStorage.getItem('nest-open-steps') || '[]');
  saved.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  });
}

/* ── C1 — Progress bar: highlight which steps are actually open ── */
function updateProgress() {
  const steps = document.querySelectorAll('.progress-bar__step');
  if (!steps.length) return;
  const openIds = new Set(
    [...document.querySelectorAll('.step-card.open')].map(c => c.id)
  );
  steps.forEach((s, i) => s.classList.toggle('done', openIds.has('step' + i)));
}

/* ── Phase 1.2 — Step jumper ── */
function buildStepJumper() {
  const jumper = document.getElementById('stepJumper');
  if (!jumper) return;

  STEPS.forEach(step => {
    const btn = document.createElement('button');
    btn.className = 'step-jumper__btn';
    btn.dataset.jump = step.id;
    btn.dataset.label = step.name;
    btn.setAttribute('aria-label', `Step ${step.num} — ${step.name}`);
    btn.textContent = step.num;
    btn.addEventListener('click', () => openAndScrollToStep(step.id));
    jumper.appendChild(btn);
  });

  // Spacer + Collapse All
  const spacer = document.createElement('span');
  spacer.className = 'step-jumper__spacer';
  jumper.appendChild(spacer);

  const collapseBtn = document.createElement('button');
  collapseBtn.className = 'step-jumper__collapse';
  collapseBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3"/></svg> Collapse all`;
  collapseBtn.addEventListener('click', collapseAll);
  jumper.appendChild(collapseBtn);

  updateJumperActive();
}

function openAndScrollToStep(id) {
  const card = document.getElementById(id);
  if (!card) return;
  if (!card.classList.contains('open')) {
    card.classList.add('open');
    persistOpenSteps();
    updateProgress();
  }
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  updateJumperActive();
}

function updateJumperActive() {
  const openIds = new Set([...document.querySelectorAll('.step-card.open')].map(c => c.id));
  document.querySelectorAll('.step-jumper__btn[data-jump]').forEach(btn => {
    btn.setAttribute('aria-current', openIds.has(btn.dataset.jump) ? 'true' : 'false');
  });
}

/* IntersectionObserver for auto-highlighting jumper as user scrolls */
function initJumperObserver() {
  const cards = document.querySelectorAll('.step-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.step-jumper__btn[data-jump]').forEach(btn => {
          const isThis = btn.dataset.jump === entry.target.id;
          if (isThis && entry.target.classList.contains('open')) {
            btn.setAttribute('aria-current', 'true');
          }
        });
      }
    });
  }, { threshold: 0.3 });

  cards.forEach(c => observer.observe(c));
}

/* ── Phase 1.3 — Copy buttons on every .script-block ── */
function initCopyButtons(root) {
  const target = root || document;
  target.querySelectorAll('.script-block').forEach(block => {
    if (block.querySelector('.copy-btn')) return; // already attached
    block.style.position = 'relative';
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.setAttribute('aria-label', 'Copy script');
    btn.innerHTML = COPY_SVG;
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const text = block.textContent.replace(/\s+/g, ' ').trim();
      copyText(text, btn);
    });
    block.appendChild(btn);
  });
}

/* ── Phase 1.4 — Principle callout (injected into DOM via HTML, JS handles dismiss) ── */
function initPrincipleCallout() {
  const callout = document.getElementById('principleCallout');
  if (!callout) return;

  const dismissed = sessionStorage.getItem('nest-principle-dismissed');
  if (dismissed) {
    callout.style.display = 'none';
    return;
  }

  const btn = callout.querySelector('.principle-callout__dismiss');
  if (btn) {
    btn.addEventListener('click', () => {
      callout.style.display = 'none';
      sessionStorage.setItem('nest-principle-dismissed', '1');
    });
  }
}

/* ── Phase 1.5 — Fork cues ── */
function initForkCues(root) {
  const target = root || document;
  target.querySelectorAll('.script-block strong').forEach(el => {
    if (el.textContent.trim().startsWith('If ') || el.textContent.trim().startsWith('If They')) {
      el.closest('.script-block')?.classList.add('is-fork');
    }
  });
}

/* ── Phase 2.1 — Within-page search ── */
let _searchIndex = [];

function buildSearchIndex() {
  _searchIndex = [];

  // Step cards
  document.querySelectorAll('.step-card').forEach(card => {
    const stepData = STEPS.find(s => s.id === card.id);
    if (!stepData) return;

    _searchIndex.push({
      type: 'step',
      id: card.id,
      badge: stepData.num,
      title: stepData.name,
      body: stepData.tagline,
    });

    card.querySelectorAll('.script-block').forEach(sb => {
      const label = sb.querySelector('strong')?.textContent?.trim() || '';
      const rawText = sb.textContent.replace(/\s+/g, ' ').trim().slice(0, 140);
      _searchIndex.push({
        type: 'script',
        id: card.id,
        badge: stepData.num,
        title: label || 'Script',
        body: rawText,
        scriptEl: sb,
      });
    });
  });
}

function scoreResult(item, query) {
  const q = query.toLowerCase();
  const t = (item.title + ' ' + item.body).toLowerCase();
  if (t.includes(q)) return 10;
  const words = q.split(/\s+/);
  return words.filter(w => t.includes(w)).length;
}

function searchIndex(query) {
  if (!query || query.length < 2) return [];
  return _searchIndex
    .map(item => ({ item, score: scoreResult(item, query) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(r => r.item);
}

function initSearch() {
  const wrapper = document.getElementById('cockpitSearch');
  if (!wrapper) return;

  const input = wrapper.querySelector('.cockpit-search__input');
  const resultsEl = wrapper.querySelector('.cockpit-search__results');

  function hideResults() { resultsEl.hidden = true; }
  function showResults(results) {
    if (!results.length) { hideResults(); return; }

    resultsEl.innerHTML = results.map((item, i) => {
      const badgeClass = item.type === 'step' ? '' : item.type === 'script' ? 'cockpit-search__result-badge--script' : 'cockpit-search__result-badge--obj';
      const badgeContent = item.type === 'obj' ? '💬' : item.badge;
      return `
        <button class="cockpit-search__result" data-idx="${i}" role="option" aria-selected="false">
          <span class="cockpit-search__result-badge ${badgeClass}">${badgeContent}</span>
          <span class="cockpit-search__result-info">
            <span class="cockpit-search__result-type">${item.type === 'obj' ? 'Objection' : item.type === 'script' ? 'Script' : 'Step'}</span>
            <span class="cockpit-search__result-title">${item.title}</span>
            <span class="cockpit-search__result-body">${item.body.slice(0, 80)}</span>
          </span>
        </button>`.trim();
    }).join('');
    resultsEl.hidden = false;

    resultsEl.querySelectorAll('.cockpit-search__result').forEach((btn, i) => {
      btn.addEventListener('click', () => {
        activateResult(results[i]);
        input.value = '';
        hideResults();
        input.blur();
      });
    });
  }

  let _selectedIdx = -1;
  function moveSelection(dir) {
    const btns = [...resultsEl.querySelectorAll('.cockpit-search__result')];
    if (!btns.length) return;
    btns.forEach(b => b.setAttribute('aria-selected', 'false'));
    _selectedIdx = (_selectedIdx + dir + btns.length) % btns.length;
    btns[_selectedIdx].setAttribute('aria-selected', 'true');
    btns[_selectedIdx].scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('input', () => {
    _selectedIdx = -1;
    const q = input.value.trim();
    if (q.length < 2) { hideResults(); return; }
    showResults(searchIndex(q));
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown')  { e.preventDefault(); moveSelection(1); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); moveSelection(-1); }
    if (e.key === 'Enter') {
      e.preventDefault();
      const btns = [...resultsEl.querySelectorAll('.cockpit-search__result')];
      const sel = btns[_selectedIdx];
      if (sel) sel.click();
    }
    if (e.key === 'Escape') { hideResults(); input.blur(); }
  });

  document.addEventListener('click', e => {
    if (!wrapper.contains(e.target)) hideResults();
  });
}

function addObjSearchItems(sheetDoc) {
  // Called after objection sheet is fetched; adds obj items to index
  sheetDoc.querySelectorAll('.obj-card').forEach(card => {
    const phrase = card.querySelector('.obj-card__trigger-phrase')?.textContent?.trim() || '';
    const hint   = card.querySelector('.obj-card__hint')?.textContent?.trim() || '';
    _searchIndex.push({
      type: 'obj',
      id: card.id,
      badge: '💬',
      title: phrase,
      body: hint,
    });
  });
}

function activateResult(item) {
  if (item.type === 'step' || item.type === 'script') {
    openAndScrollToStep(item.id);
    if (item.type === 'script' && item.scriptEl) {
      setTimeout(() => {
        item.scriptEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        item.scriptEl.classList.add('flashing');
        setTimeout(() => item.scriptEl.classList.remove('flashing'), 1600);
      }, 350);
    }
  } else if (item.type === 'obj') {
    openObjSheet(item.id);
  }
}

/* ── Phase 2.2 — Objection sheet trigger (sheet built by objection-sheet.js) ── */
function openObjSheet(targetId) {
  if (window.cockpitObjSheet) {
    window.cockpitObjSheet.open(targetId);
  }
}

/* ── Phase 2.3 — Context drawer (right rail on desktop) ── */
function buildContextDrawer() {
  const drawer = document.getElementById('contextDrawer');
  if (!drawer) return;

  const TABS = [
    { id: 'tab-principle', label: 'Principle',    build: buildPrinciplePanel   },
    { id: 'tab-funnel',    label: 'Pain Funnel',  build: buildPainFunnelPanel  },
    { id: 'tab-brandfit',  label: 'Brand Fit',    build: buildBrandFitPanel    },
    { id: 'tab-close',     label: 'Always Close', build: buildAlwaysClosePanel },
    { id: 'tab-phrases',   label: 'Phrases',      build: buildPhrasesPanel     },
  ];

  const tabBar = document.createElement('div');
  tabBar.className = 'drawer-tabs';
  tabBar.setAttribute('role', 'tablist');

  const body = document.createElement('div');
  body.style.flex = '1';
  body.style.overflow = 'hidden';
  body.style.display = 'flex';
  body.style.flexDirection = 'column';

  TABS.forEach((tab, i) => {
    const btn = document.createElement('button');
    btn.className = 'drawer-tab' + (i === 0 ? ' active' : '');
    btn.dataset.tab = tab.id;
    btn.textContent = tab.label;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tabBar.appendChild(btn);

    const panel = document.createElement('div');
    panel.className = 'drawer-panel' + (i === 0 ? ' active' : '');
    panel.id = tab.id + '-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.innerHTML = tab.build();
    body.appendChild(panel);
  });

  tabBar.addEventListener('click', e => {
    const btn = e.target.closest('.drawer-tab');
    if (!btn) return;
    tabBar.querySelectorAll('.drawer-tab').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    body.querySelectorAll('.drawer-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    document.getElementById(btn.dataset.tab + '-panel')?.classList.add('active');
  });

  // Open Objections button at bottom
  const objBtn = document.createElement('button');
  objBtn.className = 'drawer-open-obj-btn';
  objBtn.textContent = '💬  Open Objections';
  objBtn.addEventListener('click', () => openObjSheet(null));

  drawer.appendChild(tabBar);
  drawer.appendChild(body);
  drawer.appendChild(objBtn);
}

function buildPrinciplePanel() {
  return `
    <p><strong>The core principle</strong></p>
    <p>The customer didn't call to be sold to. They called because they have to move and they hope someone will help them feel less stressed about it. Your job is to be that person. The booking takes care of itself when you do that part right.</p>
  `;
}

function buildPainFunnelPanel() {
  // Pull live from DOM so content never drifts
  const funnel = document.querySelector('#step1 .step-card__body');
  if (!funnel) return '<p>Open Step 1 first.</p>';

  const technique = funnel.querySelector('p + p strong')?.closest('p')?.textContent?.trim() || '';
  const examples  = [...funnel.querySelectorAll('.script-block')].slice(0, 3).map(sb => {
    const label = sb.querySelector('strong')?.textContent?.trim() || '';
    const text  = sb.textContent.replace(label, '').replace(/\s+/g, ' ').trim().slice(0, 160);
    return `<h3>${label}</h3><p>${text}&hellip;</p>`;
  }).join('');

  return `<p><strong>Technique:</strong> "Tell me more about that — why is that important?" — in your own words.</p>${examples}`;
}

function buildBrandFitPanel() {
  const step8 = document.querySelector('#step8 .step-card__body');
  if (!step8) return '<p>Open Step 8 first.</p>';
  const items = step8.querySelector('ul:last-of-type');
  if (!items) return '<p>See Step 8 → Brand-Fit Watchpoints.</p>';
  return `<h3>Brand-Fit Watchpoints</h3>${items.outerHTML}`;
}

function buildAlwaysClosePanel() {
  const step9 = document.querySelector('#step9 .step-card__body');
  if (!step9) return '<p>Open Step 9 first.</p>';
  const table = step9.querySelector('table');
  if (!table) return '<p>See Step 9 → Always Close on Something.</p>';
  return `<h3>Always Close on Something</h3>${table.outerHTML}`;
}

function buildPhrasesPanel() {
  const ref = document.querySelector('.pro-tips');
  if (!ref) return '<p>See Quick Reference at bottom of page.</p>';
  const items = ref.querySelectorAll('.pro-tip-item');
  let html = '';
  items.forEach(item => {
    const title = item.querySelector('strong')?.textContent?.trim() || '';
    const body  = item.querySelector('p')?.innerHTML || '';
    if (title.includes('Phrases')) {
      html += `<h3>${title}</h3><p>${body}</p>`;
    }
  });
  return html || '<p>See Quick Reference at bottom of page.</p>';
}

/* ── Phase 3.1 — Quick Scripts overlay ── */
const QS_SCRIPTS = [
  { num: '1 — Opener',      selector: '#step1 .script-block:nth-of-type(1)' },
  { num: '2 — Follow-Up',   selector: '#step1 .script-block:nth-of-type(4)' },
  { num: '3 — Pain Funnel', selector: '#step1 p em' },
  { num: '4 — Pricing',     selector: '#step6 .script-block:nth-of-type(1)' },
  { num: '5 — The Close',   selector: '#step7 .script-block:nth-of-type(1)' },
  { num: '6 — Tentative Reservation', selector: '#step8 .script-block:nth-of-type(1)' },
  { num: '7 — Rewrap + Emotional Close', selector: '#step9' },
];

function buildQSOverlay() {
  const overlay = document.getElementById('qsOverlay');
  if (!overlay) return;

  const body = overlay.querySelector('.qs-body');
  if (!body) return;

  QS_SCRIPTS.forEach(qs => {
    let text = '';
    const src = document.querySelector(qs.selector);
    if (src) {
      if (qs.num.startsWith('3')) {
        text = src.textContent.trim();
      } else if (qs.num.startsWith('7')) {
        // Combine step 9's two main scripts
        const scripts = document.querySelectorAll('#step9 .script-block');
        text = [...scripts].slice(0, 2).map(s => s.textContent.replace(/\s+/g, ' ').trim()).join('\n\n');
      } else {
        text = src.textContent.replace(/\s+/g, ' ').trim();
      }
    }
    if (!text) text = '(Open the step to load this script)';

    const card = document.createElement('div');
    card.className = 'qs-card';
    card.innerHTML = `
      <div class="qs-card__num">${qs.num}</div>
      <div class="qs-card__text">${escHtml(text)}</div>
      <button class="qs-card__copy" aria-label="Copy">${COPY_SVG}</button>
    `;
    card.querySelector('.qs-card__copy').addEventListener('click', e => {
      e.stopPropagation();
      copyText(text, card.querySelector('.qs-card__copy'));
    });
    body.appendChild(card);
  });

  // Utility row
  const util = document.createElement('div');
  util.className = 'qs-utilities';
  util.innerHTML = `
    <a href="https://box-wizardry-calculator.lovable.app/" target="_blank" rel="noopener" class="qs-util-btn qs-util-btn--calc">📦 Pack Calculator</a>
    <button class="qs-util-btn qs-util-btn--obj" id="qsOpenObj">💬 Objections</button>
  `;
  util.querySelector('#qsOpenObj').addEventListener('click', () => {
    closeQS();
    openObjSheet(null);
  });
  body.appendChild(util);
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

/* A1 — body.qs-open hides the context drawer so QS can use the same rail */
function openQS() {
  document.getElementById('qsOverlay')?.classList.add('open');
  document.body.classList.add('qs-open');
}

function closeQS() {
  document.getElementById('qsOverlay')?.classList.remove('open');
  document.body.classList.remove('qs-open');
}

/* ── Phase 3.2 — One-Handed Mode ── */
function initOneHandedMode() {
  const stored = localStorage.getItem('nest-one-handed');
  if (stored === '1') {
    document.body.classList.add('one-handed');
  }
}

function toggleOneHanded(btn) {
  const on = document.body.classList.toggle('one-handed');
  localStorage.setItem('nest-one-handed', on ? '1' : '0');
  btn?.classList.toggle('on', on);
  toast(on ? 'One-handed mode on' : 'One-handed mode off');
}

/* ── Phase 4.2 — Keyboard shortcuts ── */
function initKeyboard() {
  document.addEventListener('keydown', e => {
    const tag  = document.activeElement?.tagName?.toLowerCase();
    const inInput = (tag === 'input' || tag === 'textarea' || document.activeElement?.isContentEditable);
    if (inInput) return;

    const key = e.key;

    if (key >= '0' && key <= '9') {
      e.preventDefault();
      openAndScrollToStep('step' + key);
      return;
    }

    switch (key) {
      case '/':
        e.preventDefault();
        document.querySelector('.cockpit-search__input')?.focus();
        break;
      case 'o': case 'O':
        e.preventDefault();
        openObjSheet(null);
        break;
      case 'q': case 'Q':
        e.preventDefault();
        document.getElementById('qsOverlay')?.classList.contains('open') ? closeQS() : openQS();
        break;
      case 'c': case 'C':
        e.preventDefault();
        collapseAll();
        toast('All steps collapsed');
        break;
      case 'Escape':
        closeQS();
        if (window.cockpitObjSheet) window.cockpitObjSheet.close();
        hideKbdHelp();
        break;
      case '?':
        e.preventDefault();
        toggleKbdHelp();
        break;
    }
  });
}

/* ── Keyboard help modal ── */
function buildKbdHelp() {
  const modal = document.getElementById('kbdHelp');
  if (!modal) return;
  const rows = [
    ['0 – 9', 'Jump to step'],
    ['/', 'Focus search'],
    ['o', 'Toggle Objections'],
    ['q', 'Toggle Quick Scripts'],
    ['c', 'Collapse all steps'],
    ['Esc', 'Close any overlay'],
    ['?', 'Show this help'],
  ];
  modal.innerHTML = `
    <h2>Keyboard Shortcuts</h2>
    ${rows.map(([k, label]) => `<div class="kbd-row"><span>${label}</span><kbd>${k}</kbd></div>`).join('')}
    <button class="kbd-help-close" id="kbdHelpClose">Got it</button>
  `;
  document.getElementById('kbdHelpClose')?.addEventListener('click', hideKbdHelp);
}

function toggleKbdHelp() {
  const open = document.getElementById('kbdHelp')?.classList.toggle('open');
  document.getElementById('kbdBackdrop')?.classList.toggle('open', open);
}

function hideKbdHelp() {
  document.getElementById('kbdHelp')?.classList.remove('open');
  document.getElementById('kbdBackdrop')?.classList.remove('open');
}

/* ── Phase 4.3 — Desktop body class ── */
function initDesktopLayout() {
  if (window.innerWidth >= 1024) {
    document.body.classList.add('cockpit-active');
  }
  window.addEventListener('resize', () => {
    document.body.classList.toggle('cockpit-active', window.innerWidth >= 1024);
  });
}

/* ── Header height measurement ── */
function measureHeader() {
  const h = document.querySelector('.header');
  if (h) {
    const height = h.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--cockpit-header-h', height + 'px');
  }
}

/* ── Main init ── */
document.addEventListener('DOMContentLoaded', () => {
  measureHeader();
  initOneHandedMode();
  restoreOpenSteps();
  updateProgress();
  buildStepJumper();
  initJumperObserver();
  initCopyButtons();
  initPrincipleCallout();
  initForkCues();
  buildContextDrawer();
  buildSearchIndex();
  initSearch();
  buildQSOverlay();
  buildKbdHelp();
  initKeyboard();
  initDesktopLayout();

  // Wire up QS close button
  document.getElementById('qsClose')?.addEventListener('click', closeQS);

  // Wire up QS header button
  document.getElementById('qsOpenBtn')?.addEventListener('click', openQS);

  // Wire up one-handed toggle
  const ohBtn = document.getElementById('oneHandedToggle');
  if (ohBtn) {
    if (localStorage.getItem('nest-one-handed') === '1') ohBtn.classList.add('on');
    ohBtn.addEventListener('click', () => toggleOneHanded(ohBtn));
  }

  // Wire up FABs
  document.getElementById('fabObj')?.addEventListener('click', () => openObjSheet(null));
  document.getElementById('fabQS')?.addEventListener('click', openQS);

  // Kbd backdrop click-to-close
  document.getElementById('kbdBackdrop')?.addEventListener('click', hideKbdHelp);

  // Expose to objection-sheet.js
  window.cockpit = {
    addObjSearchItems,
    initCopyButtons,
    initForkCues,
    toast,
  };
});

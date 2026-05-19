/* ============================================
   OBJECTION SHEET — objection-sheet.js
   Fetches the objection-handling page and
   renders its content in a bottom-sheet /
   right-panel / modal depending on viewport.
   ============================================ */

'use strict';

(function () {
  const OBJ_URL = '../objection-handling/index.html';

  let _built = false;
  let _sheetEl = null;
  let _backdropEl = null;

  /* ── Build the sheet DOM once ── */
  async function buildSheet() {
    if (_built) return;
    _built = true;

    // Create backdrop
    _backdropEl = document.createElement('div');
    _backdropEl.className = 'obj-sheet-backdrop';
    _backdropEl.id = 'objSheetBackdrop';
    _backdropEl.addEventListener('click', closeSheet);
    document.body.appendChild(_backdropEl);

    // Create sheet skeleton
    _sheetEl = document.getElementById('objSheet');
    if (!_sheetEl) {
      // Fallback: create it dynamically
      _sheetEl = document.createElement('div');
      _sheetEl.id = 'objSheet';
      _sheetEl.setAttribute('role', 'dialog');
      _sheetEl.setAttribute('aria-modal', 'true');
      _sheetEl.setAttribute('aria-label', 'Objection Handling');
      document.body.appendChild(_sheetEl);
    }

    // Fetch objection page
    let objContent = '';
    try {
      const res = await fetch(OBJ_URL, { cache: 'force-cache' });
      const html = await res.text();
      const doc  = new DOMParser().parseFromString(html, 'text/html');
      const src  = doc.getElementById('objection-sheet-source');
      if (src) {
        objContent = src.innerHTML;
      } else {
        // Fallback: grab the doc-content article
        const art = doc.querySelector('.doc-content');
        objContent = art ? art.innerHTML : '<p>Could not load objections. <a href="../objection-handling/index.html">Open full page →</a></p>';
      }
    } catch (err) {
      objContent = '<p>Could not load objection handling content. <a href="../objection-handling/index.html">Open full page →</a></p>';
    }

    _sheetEl.innerHTML = `
      <div class="obj-sheet__handle"></div>
      <div class="obj-sheet__header">
        <h2>💬 Objections</h2>
        <button class="obj-sheet__close" aria-label="Close objections" id="objSheetClose">×</button>
      </div>
      <div class="obj-sheet__body" id="objSheetBody">
        ${objContent}
      </div>
    `;

    // Wire close button
    document.getElementById('objSheetClose')?.addEventListener('click', closeSheet);

    // Keyboard: Esc to close
    _sheetEl.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeSheet();
    });

    // Rebind accordions inside the sheet
    rebindAccordions();

    // Rebind copy buttons + fork cues via cockpit API
    if (window.cockpit) {
      window.cockpit.initCopyButtons(_sheetEl);
      window.cockpit.initForkCues(_sheetEl);
      // Add obj items to cockpit search index
      window.cockpit.addObjSearchItems(_sheetEl);
    }

    // Swipe-to-close on mobile
    initSwipeClose();
  }

  /* ── Accordion rebind (multi-open, mirroring call-framework) ── */
  function rebindAccordions() {
    if (!_sheetEl) return;
    _sheetEl.querySelectorAll('.obj-card__trigger').forEach(trigger => {
      // Remove existing onclick
      trigger.removeAttribute('onclick');
      trigger.addEventListener('click', () => {
        const card = trigger.closest('.obj-card');
        if (card) card.classList.toggle('open');
      });
    });
  }

  /* ── Swipe-to-close (mobile) ── */
  function initSwipeClose() {
    if (!_sheetEl || window.innerWidth >= 640) return;
    let startY = 0;
    let isDragging = false;

    _sheetEl.addEventListener('touchstart', e => {
      startY = e.touches[0].clientY;
      isDragging = true;
    }, { passive: true });

    _sheetEl.addEventListener('touchmove', e => {
      if (!isDragging) return;
      const delta = e.touches[0].clientY - startY;
      if (delta > 0) {
        _sheetEl.style.transform = `translateY(${delta}px)`;
      }
    }, { passive: true });

    _sheetEl.addEventListener('touchend', e => {
      if (!isDragging) return;
      isDragging = false;
      const delta = e.changedTouches[0].clientY - startY;
      if (delta > 100) {
        closeSheet();
      } else {
        _sheetEl.style.transform = '';
      }
    });
  }

  /* ── Open ── */
  async function openSheet(targetId) {
    await buildSheet();

    // Show backdrop + sheet
    _backdropEl.classList.add('visible');
    _sheetEl.classList.add('open');
    _sheetEl.style.transform = ''; // reset swipe offset

    document.body.style.overflow = 'hidden';

    // Scroll to target inside the sheet
    if (targetId) {
      setTimeout(() => {
        const target = _sheetEl.querySelector('#' + targetId);
        if (target) {
          target.classList.add('open');
          target.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      }, 320);
    } else {
      // Scroll to top
      const body = document.getElementById('objSheetBody');
      if (body) body.scrollTop = 0;
    }

    // Focus trap
    setTimeout(() => {
      const first = _sheetEl.querySelector('button, [href], input, [tabindex]');
      first?.focus();
    }, 350);
  }

  /* ── Close ── */
  function closeSheet() {
    if (!_sheetEl) return;
    _sheetEl.classList.remove('open');
    _backdropEl?.classList.remove('visible');
    document.body.style.overflow = '';
  }

  /* ── Public API ── */
  window.cockpitObjSheet = {
    open: openSheet,
    close: closeSheet,
  };

})();

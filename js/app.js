/* ============================================
   THE NEST - Main JavaScript
   ============================================ */

// Document data for search and filtering
const documents = [
  {
    id: 'handbook',
    title: 'Employee Handbook',
    description: 'Company policies, expectations, PTO, pay schedules, disciplinary process',
    category: 'handbook',
    roles: ['all'],
    icon: 'book',
    color: 'var(--doc-handbook)',
    url: 'docs/handbook/index.html'
  },
  {
    id: 'code-of-conduct',
    title: 'Code of Conduct',
    description: 'Professional behavior standards, customer interaction, social media policy',
    category: 'conduct',
    roles: ['all'],
    icon: 'shield',
    color: 'var(--doc-conduct)',
    url: 'docs/code-of-conduct/index.html'
  },
  {
    id: 'safety-manual',
    title: 'Safety Manual',
    description: 'OSHA compliance, lifting techniques, equipment handling, PPE requirements',
    category: 'safety',
    roles: ['mover', 'crew-lead'],
    icon: 'alert-triangle',
    color: 'var(--doc-safety)',
    url: 'docs/safety-manual/index.html'
  },
  {
    id: 'job-descriptions',
    title: 'Job Descriptions',
    description: 'Role duties, requirements, and reporting structure',
    category: 'jobs',
    roles: ['all'],
    icon: 'users',
    color: 'var(--doc-jobs)',
    url: 'docs/job-descriptions/index.html'
  },
  {
    id: 'training-sops',
    title: 'Training & SOPs',
    description: 'Pack & prep, loading, specialty items, checklists',
    category: 'training',
    roles: ['mover', 'crew-lead'],
    icon: 'clipboard',
    color: 'var(--doc-training)',
    url: 'docs/training-sops/index.html'
  },
  {
    id: 'vehicle-policy',
    title: 'Vehicle Operation Policy',
    description: 'DOT compliance, pre-trip inspections, accident procedures',
    category: 'vehicle',
    roles: ['crew-lead'],
    icon: 'truck',
    color: 'var(--doc-vehicle)',
    url: 'docs/vehicle-policy/index.html'
  },
  {
    id: 'compensation',
    title: 'Compensation',
    description: 'Pay structure, tip distribution, bonuses, out-of-state day rates',
    category: 'compensation',
    roles: ['mover', 'crew-lead'],
    icon: 'dollar-sign',
    color: 'var(--doc-compensation)',
    url: 'docs/compensation/index.html'
  },
  {
    id: 'onboarding',
    title: 'Onboarding Checklist',
    description: 'Day-one paperwork, training schedule, mentorship pairing',
    category: 'onboarding',
    roles: ['all'],
    icon: 'check-square',
    color: 'var(--doc-onboarding)',
    url: 'docs/onboarding/index.html'
  },
  {
    id: 'injury-workers-comp',
    title: 'Injury & Workers\' Comp',
    description: 'On-site injury response, reporting chain, return-to-work protocol',
    category: 'injury',
    roles: ['all'],
    icon: 'activity',
    color: 'var(--doc-injury)',
    url: 'docs/injury-workers-comp/index.html'
  },
  {
    id: 'claims-protocol',
    title: 'Property Damage & Claims',
    description: 'Damage documentation, photo requirements, claims process',
    category: 'claims',
    roles: ['mover', 'crew-lead'],
    icon: 'camera',
    color: 'var(--doc-claims)',
    url: 'docs/claims-protocol/index.html'
  }
];

// SVG icons
const icons = {
  'book': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
  'shield': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  'alert-triangle': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4m0 4h.01M12 3l9 16H3L12 3z"/></svg>',
  'users': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6m3-3h-6"/></svg>',
  'clipboard': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>',
  'truck': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="6" width="15" height="12" rx="2"/><path d="M16 8h4l3 4v6h-7V8z"/><circle cx="5.5" cy="18" r="2"/><circle cx="18.5" cy="18" r="2"/></svg>',
  'dollar-sign': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
  'check-square': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>',
  'activity': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  'camera': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
  'chevron-right': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>',
  'chevron-down': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>',
  'search': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
  'x': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>',
  'home': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>',
  'file-text': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>',
  'video': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
  'play': '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>'
};

// Initialize Fuse.js for search
let fuse;

document.addEventListener('DOMContentLoaded', function() {
  initTheme();
  injectThemeToggle();
  initSearch();
  initRoleFilters();
  initFAQ();
  initNavigation();
});

/* ============================================
   SEARCH FUNCTIONALITY
   ============================================ */

function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const clearBtn = document.querySelector('.search__clear');
  
  if (!searchInput) return;
  
  // Initialize Fuse.js
  const options = {
    keys: ['title', 'description', 'category'],
    threshold: 0.3,
    includeScore: true
  };
  fuse = new Fuse(documents, options);
  
  // Search input handler
  searchInput.addEventListener('input', function(e) {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
      searchResults.classList.remove('active');
      return;
    }
    
    const results = fuse.search(query);
    renderSearchResults(results);
  });
  
  // Clear button
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      searchInput.value = '';
      searchResults.classList.remove('active');
      searchInput.focus();
    });
  }
  
  // Close results on click outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.search')) {
      searchResults.classList.remove('active');
    }
  });
}

function renderSearchResults(results) {
  const container = document.getElementById('searchResults');
  if (!container) return;
  
  if (results.length === 0) {
    container.innerHTML = '<div class="search-results__empty">No results found</div>';
    container.classList.add('active');
    return;
  }
  
  const html = results.slice(0, 8).map(result => {
    const doc = result.item;
    return `
      <a href="${doc.url}" class="search-results__item">
        <div class="search-results__icon" style="background: ${doc.color}">
          ${icons[doc.icon]}
        </div>
        <div class="search-results__content">
          <div class="search-results__title">${doc.title}</div>
          <div class="search-results__category">${doc.description}</div>
        </div>
      </a>
    `;
  }).join('');
  
  container.innerHTML = html;
  container.classList.add('active');
}

/* ============================================
   ROLE FILTERING
   ============================================ */

function initRoleFilters() {
  const pills = document.querySelectorAll('.role-pill');
  const documentCards = document.querySelectorAll('.document-card');
  
  pills.forEach(pill => {
    pill.addEventListener('click', function() {
      // Update active state
      pills.forEach(p => p.classList.remove('active'));
      this.classList.add('active');
      
      const role = this.dataset.role;
      filterDocuments(role);
    });
  });
}

function filterDocuments(role) {
  const cards = document.querySelectorAll('.document-card');
  
  cards.forEach(card => {
    const cardRoles = card.dataset.roles.split(',');
    
    if (role === 'all' || cardRoles.includes('all') || cardRoles.includes(role)) {
      card.style.display = '';
      // Animate in
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
      requestAnimationFrame(() => {
        card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    } else {
      card.style.display = 'none';
    }
  });
}

/* ============================================
   FAQ ACCORDION
   ============================================ */

function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', function() {
      // Close other items
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
        }
      });
      
      // Toggle current item
      item.classList.toggle('open');
    });
  });
}

/* ============================================
   NAVIGATION
   ============================================ */

function initNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const currentPath = window.location.pathname;
  
  navItems.forEach(item => {
    const href = item.getAttribute('href');
    if (currentPath.includes(href) || (href === 'index.html' && currentPath === '/')) {
      item.classList.add('active');
    }
  });
}

/* ============================================
   HELPER FUNCTIONS
   ============================================ */

function getIcon(name) {
  return icons[name] || '';
}

function formatRoleTags(roles) {
  if (roles.includes('all')) {
    return '<span class="role-tag role-tag--all">All roles</span>';
  }
  
  const roleLabels = {
    'mover': 'Mover',
    'crew-lead': 'Crew lead',
    'sales': 'Sales',
    'estimator': 'Estimator',
    'dispatcher': 'Dispatcher'
  };
  
  return roles.map(role => 
    `<span class="role-tag role-tag--${role}">${roleLabels[role]}</span>`
  ).join('');
}

/* ============================================
   DARK MODE
   ============================================ */

function initTheme() {
  const stored = localStorage.getItem('nest-theme');
  if (stored === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  } else if (stored === 'light') {
    document.documentElement.classList.add('light');
    document.documentElement.classList.remove('dark');
  }
  // If no stored preference, system @media handles it
}

function injectThemeToggle() {
  const brand = document.querySelector('.header__brand');
  if (!brand) return;

  const btn = document.createElement('button');
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', 'Toggle dark mode');
  btn.innerHTML = `
    <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
    <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  `;

  btn.addEventListener('click', function() {
    const isDark = document.documentElement.classList.contains('dark');
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (isDark) {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('nest-theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('nest-theme', 'dark');
    }
  });

  brand.appendChild(btn);
}

// Render document cards dynamically if needed
function renderDocumentCards(containerId, docs = documents) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const html = docs.map(doc => `
    <a href="${doc.url}" class="document-card" data-roles="${doc.roles.join(',')}">
      <div class="document-card__icon" style="background: ${doc.color}">
        ${icons[doc.icon]}
      </div>
      <div class="document-card__content">
        <div class="document-card__title">${doc.title}</div>
        <div class="document-card__desc">${doc.description}</div>
        <div class="document-card__roles">
          ${formatRoleTags(doc.roles)}
        </div>
      </div>
      <div class="document-card__arrow">
        ${icons['chevron-right']}
      </div>
    </a>
  `).join('');
  
  container.innerHTML = html;
}

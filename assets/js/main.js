/**
 * Bimal Pathology & Diagnostic Center — Main UI Application Logic
 * Lightweight, accessible, zero-dependency native JavaScript
 */

(function() {
  'use strict';

  // ===== 1. TOAST NOTIFICATION UTILITY =====
  const toastEl = document.getElementById('toast');
  let toastTimer = null;

  window.showToast = function(message, type = 'info') {
    if (!toastEl) return;
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastEl.classList.remove('show', 'error', 'success');
    }
    toastEl.textContent = message;
    toastEl.className = 'toast-msg';
    if (type === 'error') toastEl.classList.add('error');
    else if (type === 'success') toastEl.classList.add('success');

    // Force reflow
    void toastEl.offsetWidth;
    toastEl.classList.add('show');

    toastTimer = setTimeout(() => {
      toastEl.classList.remove('show');
      toastTimer = null;
    }, 4500);
  };

  // ===== 2. MOBILE NAVIGATION DRAWER & TOGGLE =====
  const mobileToggleBtn = document.getElementById('mobileMenuBtn') || document.getElementById('navToggle');
  const mobileNavDrawer = document.getElementById('mobileNav') || document.getElementById('navMenu');

  function closeMobileNav() {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.remove('open', 'active');
      if (mobileToggleBtn) {
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  }

  function openMobileNav() {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.add('open', 'active');
      if (mobileToggleBtn) {
        mobileToggleBtn.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
    }
  }

  if (mobileToggleBtn && mobileNavDrawer) {
    mobileToggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = mobileNavDrawer.classList.contains('open') || mobileNavDrawer.classList.contains('active');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close on clicking outside
    document.addEventListener('click', function(e) {
      const isOpen = mobileNavDrawer.classList.contains('open') || mobileNavDrawer.classList.contains('active');
      if (isOpen && !mobileNavDrawer.contains(e.target) && !mobileToggleBtn.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on mobile link click
    mobileNavDrawer.querySelectorAll('.mobile-nav-link, .nav-link, a.btn').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const isOpen = mobileNavDrawer.classList.contains('open') || mobileNavDrawer.classList.contains('active');
        if (isOpen) closeMobileNav();
      }
    });
  }

  // ===== 3. FAQ ACCORDION =====
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close other accordions for clean single-panel UX
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-question-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });
  });

  // ===== 4. LABORATORY TEST RATE SEARCH ENGINE (SEARCH-FIRST) =====
  let ratesDataset = window.BIMAL_RATES_DATA || { categories: [], tests: [] };
  let searchQuery = '';
  let visibleLimit = 8;
  const PAGE_SIZE = 8;

  const rateSearchInput = document.getElementById('rateSearchInput');
  const clearRateSearchBtn = document.getElementById('clearRateSearchBtn');
  const rateInitialPrompt = document.getElementById('rateInitialPrompt');
  const rateResultsMeta = document.getElementById('rateResultsMeta');
  const rateResultsCountText = document.getElementById('rateResultsCountText');
  const rateResultsGrid = document.getElementById('rateResultsGrid');
  const rateShowMoreContainer = document.getElementById('rateShowMoreContainer');
  const rateShowMoreBtn = document.getElementById('rateShowMoreBtn');
  const rateEmptyState = document.getElementById('rateEmptyState');
  const printSearchResultBtn = document.getElementById('printSearchResultBtn');
  const shortcutChips = document.querySelectorAll('.rate-shortcut-chip');

  // Format NPR Currency
  function formatCurrency(price) {
    if (price === undefined || price === null || price <= 0) return 'सोधपुछ गर्नुहोस्';
    return `रु. ${price.toLocaleString('en-IN')}`;
  }

  // Safe HTML Escaping helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Calculate search relevance score
  function scoreTestMatch(test, query) {
    const q = query.toLowerCase().trim();
    if (!q || q.length < 2) return 0;

    let score = 0;
    const code = (test.code || '').toLowerCase();
    const name = (test.name || '').toLowerCase();
    const nepaliName = (test.nepaliName || '').toLowerCase();
    const category = (test.category || '').toLowerCase();
    const catLabel = (test.categoryLabel || '').toLowerCase();
    const desc = (test.description || '').toLowerCase();
    const aliases = Array.isArray(test.aliases) ? test.aliases.map(a => a.toLowerCase()) : [];

    // Exact code match
    if (code === q) score += 120;
    else if (code.includes(q)) score += 80;

    // Aliases exact or partial match
    for (const alias of aliases) {
      if (alias === q) {
        score += 100;
        break;
      } else if (alias.startsWith(q)) {
        score += 70;
      } else if (alias.includes(q)) {
        score += 50;
      }
    }

    // Name matches
    if (name === q) score += 95;
    else if (name.startsWith(q)) score += 75;
    else if (name.includes(q)) score += 45;

    // Nepali name match
    if (nepaliName.includes(q)) score += 40;

    // Category match
    if (category.includes(q) || catLabel.includes(q)) score += 30;

    // Package tests match
    if (Array.isArray(test.packageTests)) {
      const pkgStr = test.packageTests.join(' ').toLowerCase();
      if (pkgStr.includes(q)) score += 25;
    }

    // Description match
    if (desc.includes(q)) score += 10;

    return score;
  }

  // Render a Single Test Result Card directly in place
  function renderTestCard(test) {
    const rateVal = test.rate || test.price;
    const hasPackageTests = Array.isArray(test.packageTests) && test.packageTests.length > 0;

    return `
      <div class="rate-result-card" data-category="${escapeHtml(test.category)}">
        <div class="rate-card-header">
          <div class="rate-card-title-group">
            ${test.code ? `<span class="rate-card-code">${escapeHtml(test.code)}</span>` : ''}
            <h3 class="rate-card-name">${escapeHtml(test.name)}</h3>
            ${test.nepaliName ? `<div class="rate-card-nepali">${escapeHtml(test.nepaliName)}</div>` : ''}
          </div>
          <div class="rate-card-price-badge">
            <span class="rate-price-value">${formatCurrency(rateVal)}</span>
          </div>
        </div>

        <div class="rate-card-category-row">
          <span class="rate-card-category-tag"><i class="fas fa-tag" aria-hidden="true"></i> ${escapeHtml(test.categoryLabel || test.category)}</span>
        </div>

        ${test.description ? `<p class="rate-card-desc">${escapeHtml(test.description)}</p>` : ''}

        ${hasPackageTests ? `
          <div class="rate-package-includes">
            <strong><i class="fas fa-check-circle text-primary" aria-hidden="true"></i> समावेश परीक्षणहरू (${test.packageTests.length}):</strong>
            <div class="rate-package-tags">
              ${test.packageTests.map(t => `<span class="rate-package-tag-item">${escapeHtml(t)}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        <div class="rate-card-meta-grid">
          ${test.sample ? `
            <div class="rate-meta-cell">
              <i class="fas fa-vial text-primary" aria-hidden="true"></i>
              <div>
                <span class="rate-meta-label">नमुना (Sample)</span>
                <span class="rate-meta-val">${escapeHtml(test.sample)}</span>
              </div>
            </div>
          ` : ''}
          ${test.reporting ? `
            <div class="rate-meta-cell">
              <i class="far fa-clock text-primary" aria-hidden="true"></i>
              <div>
                <span class="rate-meta-label">रिपोर्ट (Time)</span>
                <span class="rate-meta-val">${escapeHtml(test.reporting)}</span>
              </div>
            </div>
          ` : ''}
          ${test.preparation ? `
            <div class="rate-meta-cell">
              <i class="fas fa-notes-medical text-primary" aria-hidden="true"></i>
              <div>
                <span class="rate-meta-label">तयारी (Prep)</span>
                <span class="rate-meta-val">${escapeHtml(test.preparation)}</span>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Execute Search and Render Results
  function executeRateSearch() {
    if (!rateResultsGrid) return;
    const q = searchQuery.toLowerCase().trim();

    // 1. If query is shorter than 2 characters -> Reset to Initial Prompt (Do NOT render full list)
    if (!q || q.length < 2) {
      if (rateInitialPrompt) rateInitialPrompt.style.display = 'block';
      if (rateResultsMeta) rateResultsMeta.style.display = 'none';
      if (rateResultsGrid) rateResultsGrid.innerHTML = '';
      if (rateShowMoreContainer) rateShowMoreContainer.style.display = 'none';
      if (rateEmptyState) rateEmptyState.style.display = 'none';
      if (clearRateSearchBtn) clearRateSearchBtn.style.display = q.length > 0 ? 'flex' : 'none';
      return;
    }

    if (clearRateSearchBtn) clearRateSearchBtn.style.display = 'flex';
    if (rateInitialPrompt) rateInitialPrompt.style.display = 'none';

    // 2. Score and Filter Matching Tests
    const tests = ratesDataset.tests || [];
    const scoredMatches = [];

    tests.forEach(test => {
      const score = scoreTestMatch(test, q);
      if (score > 0) {
        scoredMatches.push({ test, score });
      }
    });

    // Sort by best matches first
    scoredMatches.sort((a, b) => b.score - a.score);
    const matchedTests = scoredMatches.map(m => m.test);
    const totalMatches = matchedTests.length;

    // 3. No Results State
    if (totalMatches === 0) {
      if (rateResultsMeta) rateResultsMeta.style.display = 'none';
      if (rateResultsGrid) rateResultsGrid.innerHTML = '';
      if (rateShowMoreContainer) rateShowMoreContainer.style.display = 'none';
      if (rateEmptyState) rateEmptyState.style.display = 'block';
      return;
    }

    if (rateEmptyState) rateEmptyState.style.display = 'none';
    if (rateResultsMeta) rateResultsMeta.style.display = 'flex';

    // Update Count text
    if (rateResultsCountText) {
      rateResultsCountText.innerHTML = `<strong>${totalMatches}</strong> परीक्षण फेला पर्यो (Found matching "${escapeHtml(searchQuery)}")`;
    }

    // 4. Render Limited Result Cards (initial max 8)
    const visibleTests = matchedTests.slice(0, visibleLimit);
    rateResultsGrid.innerHTML = visibleTests.map(test => renderTestCard(test)).join('');

    // 5. Show More Button (Visible if more matches exist)
    if (rateShowMoreContainer) {
      if (totalMatches > visibleLimit) {
        rateShowMoreContainer.style.display = 'block';
        if (rateShowMoreBtn) {
          const remaining = totalMatches - visibleLimit;
          rateShowMoreBtn.innerHTML = `<i class="fas fa-chevron-down" aria-hidden="true"></i> थप ${remaining > PAGE_SIZE ? PAGE_SIZE : remaining} परीक्षण हेर्नुहोस् (Show More / बाँकी ${remaining})`;
        }
      } else {
        rateShowMoreContainer.style.display = 'none';
      }
    }
  }

  // Search Input Listener
  if (rateSearchInput) {
    rateSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      visibleLimit = PAGE_SIZE; // reset pagination limit on new search
      executeRateSearch();
    });
  }

  // Clear Search Button
  if (clearRateSearchBtn) {
    clearRateSearchBtn.addEventListener('click', () => {
      if (rateSearchInput) {
        rateSearchInput.value = '';
        rateSearchInput.focus();
      }
      searchQuery = '';
      visibleLimit = PAGE_SIZE;
      executeRateSearch();
    });
  }

  // Show More Button Listener
  if (rateShowMoreBtn) {
    rateShowMoreBtn.addEventListener('click', () => {
      visibleLimit += PAGE_SIZE;
      executeRateSearch();
    });
  }

  // Shortcut Chips Listeners
  if (shortcutChips && shortcutChips.length > 0) {
    shortcutChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-search') || chip.textContent.trim();
        if (rateSearchInput) {
          rateSearchInput.value = query;
          searchQuery = query;
          visibleLimit = PAGE_SIZE;
          executeRateSearch();
          rateSearchInput.focus();
        }
      });
    });
  }

  // Print Currently Searched Results
  if (printSearchResultBtn) {
    printSearchResultBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Asynchronous dataset fetch with fallback to embedded window.BIMAL_RATES_DATA
  function initializeRateEngine() {
    executeRateSearch(); // Boots in default empty state (0 tests rendered)

    if (window.location.protocol.startsWith('http')) {
      fetch('assets/data/rates.json', { cache: 'no-cache' })
        .then(response => {
          if (!response.ok) throw new Error('Network response not ok');
          return response.json();
        })
        .then(data => {
          if (data && data.tests && data.tests.length > 0) {
            ratesDataset = data;
            if (searchQuery.length >= 2) {
              executeRateSearch();
            }
          }
        })
        .catch(() => {
          // Gracefully continue using window.BIMAL_RATES_DATA
        });
    }
  }

  // Initial Boot
  initializeRateEngine();

  // ===== 5. GALLERY LIGHTBOX MODAL =====
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');

  document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', function() {
      const img = this.querySelector('img');
      const caption = this.querySelector('.gallery-caption');
      if (img && lightboxModal && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        if (lightboxCaption && caption) {
          lightboxCaption.textContent = caption.textContent;
        }
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });

    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', function(e) {
      if (e.target === lightboxModal) closeLightbox();
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  // ===== 6. ACTIVE NAVBAR LINK HIGHLIGHTING ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (sections.length > 0) {
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollPosition = window.scrollY + 140;

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}` || (current === '' && link.getAttribute('href') === '#home')) {
          link.classList.add('active');
        }
      });
    }, { passive: true });
  }

})();

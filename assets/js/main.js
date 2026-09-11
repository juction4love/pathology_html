/**
 * Bimal Pathology & Diagnostic Center — Main UI Application Logic
 * Lightweight, accessible, zero-dependency JavaScript
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

  // ===== 2. MOBILE NAVIGATION DRAWER =====
  const mobileToggleBtn = document.getElementById('mobileMenuBtn');
  const mobileNavDrawer = document.getElementById('mobileNav');

  function closeMobileNav() {
    if (mobileNavDrawer && mobileNavDrawer.classList.contains('open')) {
      mobileNavDrawer.classList.remove('open');
      if (mobileToggleBtn) {
        mobileToggleBtn.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  }

  function openMobileNav() {
    if (mobileNavDrawer) {
      mobileNavDrawer.classList.add('open');
      if (mobileToggleBtn) {
        mobileToggleBtn.setAttribute('aria-expanded', 'true');
      }
      document.body.style.overflow = 'hidden';
    }
  }

  if (mobileToggleBtn && mobileNavDrawer) {
    mobileToggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = mobileNavDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close on clicking outside
    document.addEventListener('click', function(e) {
      if (mobileNavDrawer.classList.contains('open') && 
          !mobileNavDrawer.contains(e.target) && 
          !mobileToggleBtn.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on mobile link click
    mobileNavDrawer.querySelectorAll('.mobile-nav-link, a.btn').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNavDrawer.classList.contains('open')) {
        closeMobileNav();
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

  // ===== 4. TEST DIRECTORY & SEARCH DATASET =====
  const TESTS_DATA = [
    {
      name: 'Complete Blood Count (CBC)',
      nepaliName: 'पूर्ण रक्त गणना (CBC)',
      abbr: 'CBC',
      category: 'hematology',
      categoryLabel: 'Hematology',
      sample: 'Blood (EDTA Whole Blood)',
      prep: 'Routine sample / No fasting needed',
      desc: 'Hemoglobin, Total & Differential WBC count, Platelet Count, and RBC Indices analysis.'
    },
    {
      name: 'Hemoglobin (Hb)',
      nepaliName: 'हेमोग्लोबिन परीक्षण',
      abbr: 'Hb',
      category: 'hematology',
      categoryLabel: 'Hematology',
      sample: 'Blood (EDTA)',
      prep: 'Routine sample / No fasting needed',
      desc: 'Assessment for anemia and oxygen-carrying capacity.'
    },
    {
      name: 'Erythrocyte Sedimentation Rate (ESR)',
      nepaliName: 'ईएसआर (ESR)',
      abbr: 'ESR',
      category: 'hematology',
      categoryLabel: 'Hematology',
      sample: 'Blood (Citrate/EDTA)',
      prep: 'Routine sample collection',
      desc: 'Non-specific marker for clinical inflammation assessment.'
    },
    {
      name: 'Liver Function Test (LFT)',
      nepaliName: 'कलेजो कार्य परीक्षण (LFT)',
      abbr: 'LFT',
      category: 'biochemistry',
      categoryLabel: 'Biochemistry',
      sample: 'Blood Serum',
      prep: 'Overnight fasting (8–10 hrs) recommended or as advised',
      desc: 'Total/Direct Bilirubin, SGOT (AST), SGPT (ALT), Alkaline Phosphatase, Total Protein, Albumin.'
    },
    {
      name: 'Kidney Function Test (KFT / RFT)',
      nepaliName: 'मृगौला कार्य परीक्षण (KFT)',
      abbr: 'KFT',
      category: 'biochemistry',
      categoryLabel: 'Biochemistry',
      sample: 'Blood Serum',
      prep: 'Routine sample; maintain normal hydration',
      desc: 'Serum Creatinine, Blood Urea, and Uric Acid evaluation.'
    },
    {
      name: 'Fasting Blood Sugar (FBS)',
      nepaliName: 'फास्टिङ ब्लड सुगर (FBS)',
      abbr: 'FBS',
      category: 'diabetes',
      categoryLabel: 'Diabetes',
      sample: 'Blood (Fluoride Plasma)',
      prep: 'Overnight fasting required (8–10 hrs)',
      desc: 'Baseline blood glucose measurement for diabetes evaluation.'
    },
    {
      name: 'Post Prandial Blood Sugar (PPBS)',
      nepaliName: 'खाना खाएपछिको सुगर (PPBS)',
      abbr: 'PPBS',
      category: 'diabetes',
      categoryLabel: 'Diabetes',
      sample: 'Blood (Fluoride Plasma)',
      prep: 'Sample collected 2 hours after starting meal',
      desc: 'Post-meal blood glucose evaluation.'
    },
    {
      name: 'HbA1c (Glycated Hemoglobin)',
      nepaliName: 'एचबिएवानसी (HbA1c)',
      abbr: 'HbA1c',
      category: 'diabetes',
      categoryLabel: 'Diabetes',
      sample: 'Blood (EDTA Whole Blood)',
      prep: 'No fasting required; any time of day',
      desc: 'Long-term glycemic status overview over past 2–3 months.'
    },
    {
      name: 'Lipid Profile (Full Panel)',
      nepaliName: 'लिपिड प्रोफाइल (कोलेस्ट्रोल)',
      abbr: 'Lipid',
      category: 'lipid',
      categoryLabel: 'Lipid Profile',
      sample: 'Blood Serum',
      prep: '10–12 hours overnight fasting recommended',
      desc: 'Total Cholesterol, Triglycerides, HDL, LDL, and VLDL cholesterol fractions.'
    },
    {
      name: 'Thyroid Stimulating Hormone (TSH)',
      nepaliName: 'थाइरोइड हर्मोन (TSH)',
      abbr: 'TSH',
      category: 'thyroid',
      categoryLabel: 'Thyroid',
      sample: 'Blood Serum',
      prep: 'Morning sample preferred / Follow clinician advice',
      desc: 'Quantitative fluorescence immunoassay for thyroid function.'
    },
    {
      name: 'Free T3 & Free T4 Panel',
      nepaliName: 'फ्री टी३ र फ्री टी४',
      abbr: 'FT3/FT4',
      category: 'thyroid',
      categoryLabel: 'Thyroid',
      sample: 'Blood Serum',
      prep: 'Morning sample preferred / Follow clinician advice',
      desc: 'Active circulating unbound thyroid hormones assessment.'
    },
    {
      name: 'Vitamin D (25-Hydroxy)',
      nepaliName: 'भिटामिन डी (Vitamin D)',
      abbr: 'Vit D',
      category: 'vitamins',
      categoryLabel: 'Vitamins',
      sample: 'Blood Serum',
      prep: 'Routine sample collection',
      desc: 'Vitamin D status and bone mineral health evaluation.'
    },
    {
      name: 'Vitamin B12 (Cyanocobalamin)',
      nepaliName: 'भिटामिन बी१२ (Vitamin B12)',
      abbr: 'Vit B12',
      category: 'vitamins',
      categoryLabel: 'Vitamins',
      sample: 'Blood Serum',
      prep: 'Routine sample collection / Follow clinician advice',
      desc: 'Vitamin B12 level for neurological and red blood cell health.'
    },
    {
      name: 'Troponin I (Cardiac Marker)',
      nepaliName: 'ट्रोपोनिन आई (Troponin I)',
      abbr: 'cTnI',
      category: 'cardiac',
      categoryLabel: 'Cardiac',
      sample: 'Blood Serum / Plasma',
      prep: 'Emergency marker; immediate collection as ordered',
      desc: 'Quantitative cardiac biomarker detection for acute myocardial assessment.'
    },
    {
      name: 'Urine Routine & Microscopy (R/E)',
      nepaliName: 'पिसाब परीक्षण (Urine R/E)',
      abbr: 'Urine R/E',
      category: 'urine',
      categoryLabel: 'Urine & Routine',
      sample: 'Mid-stream Clean Catch Urine',
      prep: 'Fresh clean-catch midstream urine sample',
      desc: 'Physical, chemical, and microscopic examination (Pus cells, RBC, Albumin, Sugar).'
    },
    {
      name: 'Infectious Serology (Dengue, HBsAg, HCV)',
      nepaliName: 'सेरोलोजी परीक्षण (डेंगु, हेपाटाइटिस)',
      abbr: 'Serology',
      category: 'serology',
      categoryLabel: 'Serology',
      sample: 'Blood Serum',
      prep: 'No fasting required',
      desc: 'Rapid immunochromatographic assays for viral antigens and antibodies.'
    }
  ];

  // Render Test Cards
  const testsGrid = document.getElementById('testsGrid');
  const testSearchInput = document.getElementById('testSearchInput');
  const filterTabs = document.querySelectorAll('.filter-tab-btn');
  const emptySearchState = document.getElementById('emptySearchState');

  let activeCategory = 'all';
  let searchQuery = '';

  function renderTests() {
    if (!testsGrid) return;

    const q = searchQuery.toLowerCase().trim();

    const filtered = TESTS_DATA.filter(test => {
      const matchesCategory = activeCategory === 'all' || test.category === activeCategory;
      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        test.name.toLowerCase().includes(q) || 
        test.nepaliName.toLowerCase().includes(q) || 
        test.abbr.toLowerCase().includes(q) || 
        test.categoryLabel.toLowerCase().includes(q) ||
        test.desc.toLowerCase().includes(q) ||
        test.sample.toLowerCase().includes(q)
      );
    });

    if (filtered.length === 0) {
      testsGrid.innerHTML = '';
      if (emptySearchState) emptySearchState.style.display = 'block';
      return;
    }

    if (emptySearchState) emptySearchState.style.display = 'none';

    testsGrid.innerHTML = filtered.map(test => `
      <div class="test-item-card" data-category="${test.category}">
        <div class="test-card-top">
          <div>
            <h3 class="test-name">${test.name}</h3>
            <p class="test-nepali-sub">${test.nepaliName}</p>
          </div>
          <span class="test-category-tag">${test.categoryLabel}</span>
        </div>
        <p class="test-desc-text">
          ${test.desc}
        </p>
        <div class="test-card-details">
          <div class="test-detail-row">
            <i class="fas fa-vial" aria-hidden="true"></i>
            <span><strong>Sample:</strong> ${test.sample}</span>
          </div>
          <div class="test-detail-row">
            <i class="far fa-clock" aria-hidden="true"></i>
            <span><strong>Prep:</strong> ${test.prep}</span>
          </div>
        </div>
      </div>
    `).join('');
  }

  if (testSearchInput) {
    testSearchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderTests();
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', function() {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');
      activeCategory = this.getAttribute('data-category');
      renderTests();
    });
  });

  // Initial render of tests
  renderTests();

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

})();

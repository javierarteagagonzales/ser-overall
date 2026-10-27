/* =====================================================
   Overall × SER — main.js
   Sticky header, mobile menu, scroll fade-in animations
   ===================================================== */

(function () {
  'use strict';

  // --- Sticky header ---
  const header = document.getElementById('header');
  const SCROLL_THRESHOLD = 24;

  function updateHeader() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // --- Mobile menu toggle ---
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  function toggleMenu(open) {
    mobileMenu.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    // Animate hamburger spans
    const spans = hamburger.querySelectorAll('span');
    if (open) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity  = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity  = '';
      spans[2].style.transform = '';
    }
  }

  hamburger.addEventListener('click', function () {
    const isOpen = mobileMenu.classList.contains('open');
    toggleMenu(!isOpen);
  });

  // Close mobile menu when clicking a link inside it
  mobileMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMenu(false);
    });
  });

  // Close on click outside
  document.addEventListener('click', function (e) {
    if (
      mobileMenu.classList.contains('open') &&
      !header.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerH = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH - 12;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Scroll fade-in with IntersectionObserver ---
  const fadeEls = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    fadeEls.forEach(function (el) { observer.observe(el); });
  } else {
    // Fallback: show all immediately
    fadeEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // --- Dynamic Tarifario: Category filter & Currency switcher ---
  const tabBtns = document.querySelectorAll('.category-tabs .tab-btn');
  const currencyBtns = document.querySelectorAll('.currency-toggle .currency-btn');
  const tableRows = document.querySelectorAll('#pricing-table tbody tr');

  if (tabBtns.length > 0 && tableRows.length > 0) {
    // Category tabs
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tabBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        const cat = this.getAttribute('data-category');
        tableRows.forEach(function (row) {
          if (cat === 'todos' || row.getAttribute('data-category') === cat) {
            row.classList.remove('hidden-row');
          } else {
            row.classList.add('hidden-row');
          }
        });
      });
    });

    // Currency switcher
    currencyBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        currencyBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        this.classList.add('active');
        this.setAttribute('aria-pressed', 'true');

        const curr = this.getAttribute('data-currency'); // 'soles' or 'usd'
        const isUsd = curr === 'usd';

        document.querySelectorAll('#pricing-table .price-original').forEach(function (el) {
          const val = isUsd ? el.getAttribute('data-usd') : el.getAttribute('data-soles');
          if (val) el.textContent = val;
        });

        document.querySelectorAll('#pricing-table .price-final').forEach(function (el) {
          const val = isUsd ? el.getAttribute('data-usd') : el.getAttribute('data-soles');
          if (val) el.textContent = val;
        });
      });
    });
  }

})();

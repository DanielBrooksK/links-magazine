/* ============================================
   LINKS MAGAZINE — MAIN JS
   js/main.js
   Nav, scroll behavior, animations
   ============================================ */

(function () {
  'use strict';

  /* ----------------------------------------
     DOM READY
     ---------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initStickyNav();
    initMobileNav();
    initScrollAnimations();
    initSmoothScroll();
    initActiveNavLinks();
  });

  /* ----------------------------------------
     STICKY NAV
     Compact on scroll past 120px
     ---------------------------------------- */
  function initStickyNav() {
    var header = document.getElementById('site-header');
    if (!header) return;

    var scrollThreshold = 120;
    var ticking = false;

    function updateNav() {
      if (window.scrollY > scrollThreshold) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });

    // Run once on load
    updateNav();
  }

  /* ----------------------------------------
     MOBILE NAV
     Hamburger toggle with sidebar + overlay
     ---------------------------------------- */
  function initMobileNav() {
    var hamburger = document.querySelector('.nav-hamburger');
    var sidebar   = document.getElementById('nav-sidebar');
    var overlay   = document.getElementById('nav-overlay');
    var closeBtn  = document.querySelector('.nav-sidebar__close');
    var body      = document.body;

    if (!hamburger || !sidebar || !overlay) return;

    function openNav() {
      sidebar.classList.add('is-open');
      overlay.classList.add('is-visible');
      overlay.removeAttribute('aria-hidden');
      overlay.style.display = 'block';
      hamburger.setAttribute('aria-expanded', 'true');
      sidebar.setAttribute('aria-hidden', 'false');
      body.classList.add('no-scroll');

      // Trap focus inside sidebar
      setTimeout(function () {
        var firstFocusable = sidebar.querySelector('button, a, input');
        if (firstFocusable) firstFocusable.focus();
      }, 50);
    }

    function closeNav() {
      sidebar.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      hamburger.setAttribute('aria-expanded', 'false');
      sidebar.setAttribute('aria-hidden', 'true');
      body.classList.remove('no-scroll');

      // Hide overlay after transition
      setTimeout(function () {
        if (!sidebar.classList.contains('is-open')) {
          overlay.style.display = '';
        }
      }, 400);
    }

    hamburger.addEventListener('click', function () {
      var isOpen = sidebar.classList.contains('is-open');
      if (isOpen) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeNav);
    }

    overlay.addEventListener('click', closeNav);

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
        closeNav();
        hamburger.focus();
      }
    });

    // Close sidebar links on click
    var sidebarLinks = sidebar.querySelectorAll('.sidebar-link, .sidebar-subscribe');
    sidebarLinks.forEach(function (link) {
      link.addEventListener('click', closeNav);
    });
  }

  /* ----------------------------------------
     SCROLL ANIMATIONS
     Intersection Observer for .fade-in and .stagger-children
     ---------------------------------------- */
  function initScrollAnimations() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: make everything visible
      document.querySelectorAll('.fade-in, .stagger-children').forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var options = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    document.querySelectorAll('.fade-in, .stagger-children').forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ----------------------------------------
     SMOOTH SCROLL
     For in-page anchor links
     ---------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;

        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();

        var header = document.getElementById('site-header');
        var headerHeight = header ? header.offsetHeight : 0;
        var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jump
        if (history.pushState) {
          history.pushState(null, null, targetId);
        }
      });
    });
  }

  /* ----------------------------------------
     ACTIVE NAV LINKS
     Highlight current page in nav
     ---------------------------------------- */
  function initActiveNavLinks() {
    var currentPath = window.location.pathname;
    var currentFile = currentPath.split('/').pop() || 'index.html';

    document.querySelectorAll('.nav-link, .sidebar-link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;

      var linkFile = href.split('/').pop();

      if (linkFile === currentFile ||
          (currentFile === '' && linkFile === 'index.html') ||
          (currentFile === 'index.html' && linkFile === 'index.html')) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

})();

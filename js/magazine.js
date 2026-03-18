/* ============================================
   LINKS MAGAZINE — MAGAZINE INTERACTIONS
   js/magazine.js
   Issue ticker, drag scroll, tilt effect,
   reading progress bar, read time
   ============================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initIssueTicker();
    initDragScroll();
    initArchiveTilt();
    initReadingProgress();
    initReadTime();
    initScoreBarAnimations();
  });

  /* ----------------------------------------
     ISSUE BANNER TICKER
     Cycles through 3 headlines every 4s
     ---------------------------------------- */
  function initIssueTicker() {
    var ticker = document.querySelector('.issue-band__ticker');
    if (!ticker) return;

    var items = ticker.querySelectorAll('.issue-band__item');
    if (items.length < 2) return;

    var currentIndex = 0;
    var intervalMs = 4000;

    // Set initial state
    items[0].classList.add('is-active');

    function showNext() {
      var current = items[currentIndex];
      currentIndex = (currentIndex + 1) % items.length;
      var next = items[currentIndex];

      // Animate out current
      current.style.opacity = '0';
      current.style.transform = 'translateY(-100%)';
      current.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

      // After exit, swap
      setTimeout(function () {
        current.classList.remove('is-active');
        current.style.cssText = '';

        // Set next ready to enter from below
        next.style.opacity = '0';
        next.style.transform = 'translateY(100%)';
        next.style.transition = 'none';
        next.classList.add('is-active');

        // Force reflow
        next.offsetHeight; // eslint-disable-line no-unused-expressions

        // Animate in
        next.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        next.style.opacity = '1';
        next.style.transform = 'translateY(0)';
      }, 400);
    }

    setInterval(showNext, intervalMs);
  }

  /* ----------------------------------------
     DRAG-TO-SCROLL (horizontal strip)
     Desktop drag, mobile touch handled by CSS overflow
     ---------------------------------------- */
  function initDragScroll() {
    var sliders = document.querySelectorAll('.destinations-strip, [data-drag-scroll]');

    sliders.forEach(function (slider) {
      var isDown = false;
      var startX = 0;
      var scrollLeft = 0;
      var velocity = 0;
      var lastX = 0;
      var animFrame = null;

      slider.addEventListener('mousedown', function (e) {
        isDown = true;
        slider.classList.add('is-dragging');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        lastX = e.pageX;
        velocity = 0;
        if (animFrame) cancelAnimationFrame(animFrame);
      });

      document.addEventListener('mouseup', function () {
        if (!isDown) return;
        isDown = false;
        slider.classList.remove('is-dragging');
        applyMomentum();
      });

      document.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        var x = e.pageX - slider.offsetLeft;
        var walk = (x - startX) * 1.2;
        velocity = e.pageX - lastX;
        lastX = e.pageX;
        slider.scrollLeft = scrollLeft - walk;
      });

      function applyMomentum() {
        if (Math.abs(velocity) < 1) return;
        slider.scrollLeft -= velocity * 0.8;
        velocity *= 0.92;
        animFrame = requestAnimationFrame(applyMomentum);
      }

      // Prevent click on drag
      slider.addEventListener('click', function (e) {
        if (slider.classList.contains('is-dragging')) {
          e.preventDefault();
        }
      }, true);
    });
  }

  /* ----------------------------------------
     ARCHIVE COVERS — SUBTLE 3D TILT
     CSS perspective transform on hover
     ---------------------------------------- */
  function initArchiveTilt() {
    var covers = document.querySelectorAll('.issue-cover');
    if (!covers.length) return;

    // Skip on touch devices
    if ('ontouchstart' in window) return;

    covers.forEach(function (cover) {
      var bounds;

      cover.addEventListener('mouseenter', function () {
        bounds = cover.getBoundingClientRect();
      });

      cover.addEventListener('mousemove', function (e) {
        if (!bounds) return;

        var mouseX = e.clientX - bounds.left;
        var mouseY = e.clientY - bounds.top;
        var centerX = bounds.width / 2;
        var centerY = bounds.height / 2;

        var rotateX = ((mouseY - centerY) / centerY) * -6;
        var rotateY = ((mouseX - centerX) / centerX) * 6;

        cover.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
        cover.style.transition = 'transform 0.1s ease';
      });

      cover.addEventListener('mouseleave', function () {
        cover.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        cover.style.transition = 'transform 0.4s ease';
        bounds = null;
      });
    });
  }

  /* ----------------------------------------
     READING PROGRESS BAR
     Thin green line at top of article pages
     ---------------------------------------- */
  function initReadingProgress() {
    var progressBar = document.getElementById('reading-progress');
    if (!progressBar) return;

    var articleBody = document.querySelector('.article-body');
    if (!articleBody) return;

    var ticking = false;

    function updateProgress() {
      var articleRect = articleBody.getBoundingClientRect();
      var articleTop    = articleRect.top + window.scrollY;
      var articleBottom = articleTop + articleBody.offsetHeight;
      var windowBottom  = window.scrollY + window.innerHeight;

      var progress = 0;
      if (window.scrollY >= articleTop) {
        var scrolledInArticle = windowBottom - articleTop;
        var totalArticleHeight = articleBody.offsetHeight + window.innerHeight;
        progress = Math.min(scrolledInArticle / totalArticleHeight, 1);
      }

      progressBar.style.width = (progress * 100) + '%';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });

    updateProgress();
  }

  /* ----------------------------------------
     READ TIME ESTIMATOR
     Words / 200wpm, shown in article header
     ---------------------------------------- */
  function initReadTime() {
    var readTimeEl = document.getElementById('read-time');
    if (!readTimeEl) return;

    var articleBody = document.querySelector('.article-body');
    if (!articleBody) return;

    var text  = articleBody.textContent || articleBody.innerText || '';
    var words = text.trim().split(/\s+/).filter(function (w) { return w.length > 0; }).length;
    var mins  = Math.max(1, Math.round(words / 200));

    readTimeEl.textContent = mins + ' min read';
  }

  /* ----------------------------------------
     SCORE BAR ANIMATIONS
     Animate fill width when in viewport
     ---------------------------------------- */
  function initScoreBarAnimations() {
    var scoreBars = document.querySelectorAll('.score-bar__fill');
    if (!scoreBars.length) return;

    if (!('IntersectionObserver' in window)) {
      scoreBars.forEach(function (bar) {
        bar.style.width = bar.dataset.score + '%';
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var bar = entry.target;
          var score = bar.dataset.score || '0';
          setTimeout(function () {
            bar.style.width = score + '%';
          }, 200);
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    scoreBars.forEach(function (bar) {
      bar.style.width = '0%';
      observer.observe(bar);
    });
  }

})();

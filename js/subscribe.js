/* ============================================
   LINKS MAGAZINE — SUBSCRIBE FORM
   js/subscribe.js
   Email validation, states, localStorage
   ============================================ */

(function () {
  'use strict';

  var STORAGE_KEY = 'links_subscribed';

  document.addEventListener('DOMContentLoaded', function () {
    initSubscribeForms();
  });

  /* ----------------------------------------
     INIT ALL SUBSCRIBE FORMS
     ---------------------------------------- */
  function initSubscribeForms() {
    var forms = document.querySelectorAll('.subscribe-form');

    forms.forEach(function (form) {
      var input    = form.querySelector('.subscribe-form__input');
      var btn      = form.querySelector('.subscribe-form__btn');
      var feedback = form.querySelector('.subscribe-form__feedback');

      if (!input || !btn) return;

      // Check if already subscribed
      if (isAlreadySubscribed()) {
        showAlreadySubscribed(form, input, btn, feedback);
        return;
      }

      // Clear error on input
      input.addEventListener('input', function () {
        input.classList.remove('is-error');
        if (feedback) {
          feedback.textContent = '';
          feedback.className = 'subscribe-form__feedback';
        }
      });

      // Form submission
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        handleSubmit(form, input, btn, feedback);
      });
    });
  }

  /* ----------------------------------------
     HANDLE FORM SUBMISSION
     ---------------------------------------- */
  function handleSubmit(form, input, btn, feedback) {
    var email = input.value.trim();

    // Validate
    if (!email) {
      showError(input, feedback, 'Please enter your email address.');
      input.focus();
      return;
    }

    if (!isValidEmail(email)) {
      showError(input, feedback, 'Please enter a valid email address.');
      input.focus();
      return;
    }

    // Loading state
    setLoadingState(btn);

    // Simulate async API call
    setTimeout(function () {
      // Mark as subscribed
      markSubscribed(email);

      // Show success
      showSuccess(form, input, btn, feedback, email);
    }, 1200);
  }

  /* ----------------------------------------
     EMAIL VALIDATION
     ---------------------------------------- */
  function isValidEmail(email) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return re.test(email);
  }

  /* ----------------------------------------
     LOCALSTORAGE
     ---------------------------------------- */
  function isAlreadySubscribed() {
    try {
      return !!localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return false;
    }
  }

  function markSubscribed(email) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        email: email,
        date: new Date().toISOString()
      }));
    } catch (e) {
      // localStorage unavailable — proceed silently
    }
  }

  /* ----------------------------------------
     UI STATE HELPERS
     ---------------------------------------- */
  function showError(input, feedback, message) {
    input.classList.add('is-error');
    if (feedback) {
      feedback.textContent = message;
      feedback.className = 'subscribe-form__feedback is-error';
    }
  }

  function setLoadingState(btn) {
    btn.disabled = true;
    btn.dataset.originalText = btn.textContent;
    btn.innerHTML = '<span class="btn-loading-dots">Subscribing<span>.</span><span>.</span><span>.</span></span>';
  }

  function showSuccess(form, input, btn, feedback, email) {
    // Replace form contents with success message
    var successHtml =
      '<div class="subscribe-success" role="status" aria-live="assertive">' +
        '<svg class="subscribe-success__icon" width="28" height="28" viewBox="0 0 24 24" fill="none" ' +
             'stroke="currentColor" stroke-width="2" aria-hidden="true">' +
          '<path d="M20 6 9 17l-5-5"/>' +
        '</svg>' +
        '<div>' +
          '<p class="subscribe-success__title">You\'re in.</p>' +
          '<p class="subscribe-success__text">Welcome to Links Magazine. Expect the finest golf writing in your inbox.</p>' +
        '</div>' +
      '</div>';

    var inner = form.querySelector('.subscribe-form__inner');
    if (inner) {
      inner.outerHTML = successHtml;
    } else {
      form.innerHTML = successHtml;
    }
    if (feedback) feedback.remove();

    // Inject success styles
    injectSuccessStyles();
  }

  function showAlreadySubscribed(form, input, btn, feedback) {
    if (input) input.value = '';
    if (input) input.placeholder = 'Already subscribed — thank you!';
    if (input) input.disabled = true;
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Subscribed ✓';
    }
    if (feedback) {
      feedback.textContent = 'You\'re already on our list. Thank you for reading Links Magazine.';
      feedback.className = 'subscribe-form__feedback is-success';
    }
  }

  /* ----------------------------------------
     INJECT SUCCESS STYLES (once)
     ---------------------------------------- */
  var stylesInjected = false;

  function injectSuccessStyles() {
    if (stylesInjected) return;
    stylesInjected = true;

    var style = document.createElement('style');
    style.textContent = [
      '.subscribe-success {',
      '  display: flex;',
      '  align-items: flex-start;',
      '  gap: 16px;',
      '  max-width: 480px;',
      '  margin: 0 auto;',
      '  animation: fadeInUp 0.5s ease forwards;',
      '}',
      '.subscribe-success__icon {',
      '  color: #B8973A;',
      '  flex-shrink: 0;',
      '  margin-top: 2px;',
      '}',
      '.subscribe-success__title {',
      '  font-family: "Cormorant Garamond", serif;',
      '  font-size: 1.5rem;',
      '  font-style: italic;',
      '  color: #ffffff;',
      '  margin-bottom: 4px;',
      '  max-width: none;',
      '}',
      '.subscribe-success__text {',
      '  font-family: "DM Sans", sans-serif;',
      '  font-size: 0.875rem;',
      '  color: rgba(255,255,255,0.7);',
      '  line-height: 1.6;',
      '  max-width: none;',
      '}',
      '.btn-loading-dots span {',
      '  animation: blink 1.2s infinite;',
      '}',
      '.btn-loading-dots span:nth-child(2) { animation-delay: 0.2s; }',
      '.btn-loading-dots span:nth-child(3) { animation-delay: 0.4s; }',
      '@keyframes blink { 0%, 80%, 100% { opacity: 0; } 40% { opacity: 1; } }',
      '@keyframes fadeInUp {',
      '  from { opacity: 0; transform: translateY(12px); }',
      '  to   { opacity: 1; transform: translateY(0); }',
      '}',
    ].join('\n');

    document.head.appendChild(style);
  }

})();

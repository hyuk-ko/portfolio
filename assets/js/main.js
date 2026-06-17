/* ============================================================
   박준혁 — LLM Engineer Portfolio
   main.js  ·  theme toggle / case accordion / scroll reveal
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Theme (light / dark) ---------- */
  var STORAGE_KEY = 'pf-theme';
  var root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    var btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
    }
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    var prefersDark = window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));
  }

  function toggleTheme() {
    var isDark = root.getAttribute('data-theme') === 'dark';
    var next = isDark ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
  }

  /* ---------- Case study accordion ---------- */
  function toggleCase(id) {
    var item = document.getElementById(id);
    if (!item) return;
    var isOpen = item.classList.toggle('open');
    var header = item.querySelector('.case-header');
    if (header) header.setAttribute('aria-expanded', String(isOpen));
    if (isOpen && history.replaceState) {
      history.replaceState(null, '', '#' + id);
    }
  }

  /* Open a case if the URL points at one (e.g. #case-2) */
  function openCaseFromHash() {
    var hash = window.location.hash.replace('#', '');
    if (/^case-\d+$/.test(hash)) {
      var item = document.getElementById(hash);
      if (item && !item.classList.contains('open')) toggleCase(hash);
    }
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    var reduce = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Wire up ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initReveal();
    openCaseFromHash();

    var toggle = document.querySelector('.theme-toggle');
    if (toggle) toggle.addEventListener('click', toggleTheme);

    document.querySelectorAll('.case-header').forEach(function (header) {
      var item = header.closest('.case-item');
      if (!item) return;
      header.addEventListener('click', function () { toggleCase(item.id); });
    });
  });

  /* run theme before paint to avoid flash */
  initTheme();
})();

// ============================================================
// ALGORITHMIC MONOLITH — Main JS
// ============================================================

(function () {
  'use strict';

  // ─── Mobile Navigation ──────────────────────────────────
  const toggle = document.getElementById('mobileToggle');
  const nav    = document.getElementById('mobileNav');
  const close  = document.getElementById('mobileClose');

  if (toggle && nav && close) {
    toggle.addEventListener('click', () => {
      nav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    close.addEventListener('click', () => {
      nav.classList.remove('open');
      document.body.style.overflow = '';
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        nav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // ─── Scroll-based header opacity ────────────────────────
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.style.borderBottomColor = 'rgba(196, 198, 204, 0.25)';
      } else {
        header.style.borderBottomColor = 'rgba(196, 198, 204, 0.15)';
      }
    }, { passive: true });
  }

  // ─── Intersection Observer: Fade-in on scroll ───────────
  const fadeEls = document.querySelectorAll(
    '.comp-card, .research-item, .post-card, .project-card'
  );

  if ('IntersectionObserver' in window && fadeEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.55s ease forwards';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.animationDelay = `${i * 0.07}s`;
      observer.observe(el);
    });
  }

  // ─── Terminal typewriter (hero section) ─────────────────
  const terminalBody = document.querySelector('.cta-banner__terminal-body');
  if (terminalBody) {
    const lines = terminalBody.querySelectorAll('div');
    lines.forEach((line, i) => {
      line.style.opacity = '0';
      setTimeout(() => {
        line.style.transition = 'opacity 0.3s';
        line.style.opacity = '1';
      }, 400 + i * 280);
    });
  }

  // ─── Code block: copy button ────────────────────────────
  document.querySelectorAll('pre').forEach((block) => {
    const btn = document.createElement('button');
    btn.textContent = 'COPY';
    btn.style.cssText = `
      position: absolute; top: 10px; right: 10px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.65rem; letter-spacing: 0.08em;
      background: rgba(255,255,255,0.08);
      color: rgba(255,255,255,0.4);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 2px; padding: 3px 8px;
      cursor: pointer; transition: background 0.2s;
    `;

    btn.addEventListener('click', () => {
      const code = block.querySelector('code') || block;
      navigator.clipboard.writeText(code.textContent).then(() => {
        btn.textContent = 'COPIED';
        btn.style.color = 'rgba(34,197,94,0.8)';
        setTimeout(() => {
          btn.textContent = 'COPY';
          btn.style.color = 'rgba(255,255,255,0.4)';
        }, 2000);
      });
    });

    block.style.position = 'relative';
    block.appendChild(btn);
  });

})();

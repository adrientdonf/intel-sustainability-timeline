/* ═══════════════════════════════════════════════════════════
   INTEL SUSTAINABILITY — script.js
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ── 1. WORD SCRAMBLE HERO ───────────────────────────────── */
(function initScramble() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%';
  const words = ['heroWord1', 'heroWord2', 'heroWord3'];
  const targets = ['Sustainability', 'Through', 'The\u00a0Ages'];

  function scramble(el, target, delay) {
    const orig = el.textContent;
    let frame = 0;
    const totalFrames = 28;
    setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        const progress = frame / totalFrames;
        const revealCount = Math.floor(target.length * Math.min(progress * 1.4, 1));
        let result = '';
        for (let i = 0; i < target.length; i++) {
          if (target[i] === ' ' || target[i] === '\u00a0') {
            result += target[i];
          } else if (i < revealCount) {
            result += target[i];
          } else {
            result += chars[Math.floor(Math.random() * chars.length)];
          }
        }
        el.textContent = result;
        if (frame >= totalFrames) {
          clearInterval(interval);
          el.textContent = target;
        }
      }, 40);
    }, delay);
  }

  window.addEventListener('load', () => {
    words.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) scramble(el, targets[i], 400 + i * 260);
    });
  });
})();

/* ── 2. HERO MOUSE PARALLAX ──────────────────────────────── */
(function initParallax() {
  const chips = document.querySelectorAll('[data-parallax]');
  const glows = document.querySelectorAll('.hero-glow');

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    chips.forEach(chip => {
      const factor = parseFloat(chip.dataset.parallax) || 0.05;
      chip.style.transform = `translate(${dx * factor * 80}px, ${dy * factor * 80}px) rotate(15deg)`;
    });

    glows.forEach((g, i) => {
      const f = (i + 1) * 0.012;
      g.style.transform = `translate(${dx * f * 80}px, ${dy * f * 80}px) scale(1)`;
    });
  });
})();

/* ── 3. SCROLL PROGRESS + SIDEBAR NAV ───────────────────── */
(function initNav() {
  const progressBar = document.getElementById('sidebarProgress');
  const links       = document.querySelectorAll('.sidebar-link, .mob-link');
  const sections    = document.querySelectorAll('section[id], footer');

  function updateProgress() {
    const scrolled  = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const pct = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
    if (progressBar) progressBar.style.height = pct + '%';
  }

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= window.innerHeight * 0.45) {
        current = sec.id || '';
      }
    });
    links.forEach(link => {
      link.classList.toggle('active', link.dataset.section === current);
    });
  }

  window.addEventListener('scroll', () => {
    updateProgress();
    updateActiveLink();
  }, { passive: true });

  updateProgress();
  updateActiveLink();
})();

/* ── 4. REVEAL ON SCROLL ─────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ── 5. ANIMATED COUNTERS ────────────────────────────────── */
(function initCounters() {
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

  function animateCounter(el) {
    const target    = parseFloat(el.dataset.target);
    const suffix    = el.dataset.suffix || '';
    const display   = el.dataset.display || null;
    const duration  = 1800;
    const start     = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = target * easeOut(progress);

      if (display && progress >= 1) {
        el.textContent = display;
      } else if (target >= 1e9) {
        el.textContent = (value / 1e9).toFixed(1) + 'B+';
      } else {
        el.textContent = Math.round(value) + suffix;
      }

      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('.counter, [data-target]');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  counterEls.forEach(el => counterObserver.observe(el));
})();

/* ── 6. ANIMATED PROGRESS BARS ───────────────────────────── */
(function initProgressBars() {
  const fills = document.querySelectorAll('.dash-prog-fill, [data-width]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = '1';
        const w = entry.target.dataset.width || '0';
        setTimeout(() => {
          entry.target.style.width = w + '%';
        }, 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => observer.observe(el));
})();

/* ── 7. ANIMATED BAR CHART ───────────────────────────────── */
(function initBars() {
  const bars = document.querySelectorAll('.bar[data-height]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = '1';
        const h = entry.target.dataset.height;
        setTimeout(() => {
          entry.target.style.height = h + '%';
        }, 150);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(el => observer.observe(el));
})();

/* ── 8. DONUT CHART ANIMATION ────────────────────────────── */
(function initDonuts() {
  const arcs = document.querySelectorAll('.donut-arc');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = '1';
        const targetOffset = parseFloat(entry.target.dataset.targetOffset) || 0;
        setTimeout(() => {
          entry.target.style.strokeDashoffset = targetOffset;
        }, 300);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  arcs.forEach(el => observer.observe(el));
})();

/* ── 9. TIMELINE HORIZONTAL SCROLL ──────────────────────── */
(function initTimeline() {
  const track  = document.getElementById('timelineTrack');
  const fill   = document.getElementById('timelineFill');
  const prev   = document.getElementById('tlPrev');
  const next   = document.getElementById('tlNext');
  const dotsRow = document.getElementById('tlDots');
  if (!track) return;

  const cards  = Array.from(track.querySelectorAll('.tl-card'));
  let current  = 0;

  /* Build dot indicators */
  cards.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'tl-dot-btn' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.addEventListener('click', () => scrollToCard(i));
    dotsRow.appendChild(btn);
  });

  function updateDots(idx) {
    dotsRow.querySelectorAll('.tl-dot-btn').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  function updateProgress(idx) {
    const pct = cards.length > 1 ? (idx / (cards.length - 1)) * 100 : 100;
    if (fill) fill.style.width = pct + '%';
  }

  function scrollToCard(idx) {
    const card = cards[idx];
    if (!card) return;
    const cardLeft   = card.offsetLeft;
    const cardWidth  = card.offsetWidth;
    const trackWidth = track.offsetWidth;
    const scrollTo   = cardLeft - (trackWidth / 2) + (cardWidth / 2);
    track.scrollTo({ left: scrollTo, behavior: 'smooth' });
    current = idx;
    updateDots(idx);
    updateProgress(idx);
    if (prev) prev.disabled = idx === 0;
    if (next) next.disabled = idx === cards.length - 1;
  }

  if (prev) {
    prev.disabled = true;
    prev.addEventListener('click', () => scrollToCard(Math.max(0, current - 1)));
  }
  if (next) {
    next.addEventListener('click', () => scrollToCard(Math.min(cards.length - 1, current + 1)));
  }

  /* Sync dots on manual scroll */
  let scrollTimer;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const center = track.scrollLeft + track.offsetWidth / 2;
      let closest = 0;
      let minDist  = Infinity;
      cards.forEach((card, i) => {
        const cardCenter = card.offsetLeft + card.offsetWidth / 2;
        const dist = Math.abs(center - cardCenter);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      if (closest !== current) {
        current = closest;
        updateDots(current);
        updateProgress(current);
        if (prev) prev.disabled = current === 0;
        if (next) next.disabled = current === cards.length - 1;
      }
    }, 80);
  }, { passive: true });

  /* Touch swipe */
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) {
      scrollToCard(dx < 0
        ? Math.min(cards.length - 1, current + 1)
        : Math.max(0, current - 1));
    }
  });

  scrollToCard(0);
})();

/* ── 10. GALLERY PARALLAX ────────────────────────────────── */
(function initGalleryParallax() {
  const items = document.querySelectorAll('.gal-item');

  items.forEach(item => {
    item.addEventListener('mousemove', e => {
      const rect = item.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      item.style.transform = `perspective(800px) rotateY(${dx * 4}deg) rotateX(${-dy * 4}deg) scale(1.02)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(800px) rotateY(0) rotateX(0) scale(1)';
    });
  });
})();

/* ── 11. SPOTLIGHT CARD GLOW ─────────────────────────────── */
(function initSpotlight() {
  const cards = document.querySelectorAll('.fut-card, .ov-card, .dash-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
      card.style.background = `
        radial-gradient(circle at ${x}% ${y}%, rgba(0,104,181,.12) 0%, transparent 60%),
        var(--bg-card)
      `;
    });
    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();

/* ── 12. SMOOTH SCROLL FOR ALL ANCHOR LINKS ──────────────── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ── 13. FLOATING HERO CHIP ANIMATION ────────────────────── */
(function initChipFloat() {
  const chips = document.querySelectorAll('.hero-chip');
  chips.forEach((chip, i) => {
    const duration = 4000 + i * 1200;
    const delay    = i * 600;
    let start = null;

    function animate(timestamp) {
      if (!start) start = timestamp;
      const elapsed = (timestamp - start + delay) % duration;
      const t = elapsed / duration;
      const y = Math.sin(t * Math.PI * 2) * 12;
      chip.style.transform = `translateY(${y}px) rotate(${15 + i * 5}deg)`;
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  });
})();

/* ── 14. PAGE LOAD FADE IN ───────────────────────────────── */
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity .5s ease';
  window.addEventListener('load', () => {
    document.body.style.opacity = '1';
  });
})();

/* ── 15. REDUCED MOTION SUPPORT ──────────────────────────── */
(function respectReducedMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-up').forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    document.querySelectorAll('[data-parallax]').forEach(el => {
      el.style.transform = 'none';
    });
  }
})();
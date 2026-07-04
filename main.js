/* ── Hamburger menu ─────────────────────────────────────────── */
(function () {
  var hamburger = document.querySelector('.nav-hamburger');
  var navbar    = document.querySelector('.navbar');
  if (!hamburger || !navbar) return;

  function closeMenu() {
    navbar.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  hamburger.addEventListener('click', function (e) {
    e.stopPropagation();
    var opening = !navbar.classList.contains('open');
    navbar.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(opening));
  });

  // Close when any nav link is tapped
  navbar.querySelectorAll('.nav-links a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close when tapping outside the navbar
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target)) closeMenu();
  });
})();

/* ── Tap-to-flip cards ──────────────────────────────────────── */
(function () {
  var SELECTORS = [
    '.hero-photo-card',
    '.hero-name-flip',
    '.cert-card:not(.cert-card--testimonials)',
    '.schedule-day',
    '.desi-card',
    '.princess-logo-card',
    '.tl-flip-card',
    '.cta-flip-card',
    '.offbrnd-card',
    '.dance-roots-flip'
  ];

  var allCards = Array.prototype.slice.call(
    document.querySelectorAll(SELECTORS.join(', '))
  );
  if (!allCards.length) return;

  function untapAll(except) {
    allCards.forEach(function (c) {
      if (c !== except) c.classList.remove('tapped');
    });
  }

  allCards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.stopPropagation();
      var wasTapped = this.classList.contains('tapped');
      untapAll(this);
      this.classList.toggle('tapped', !wasTapped);
    });
  });

  // Tap outside any card → untap all
  document.addEventListener('click', function () {
    untapAll(null);
  });
})();

/* ── Scroll reveal (deal-in) ────────────────────────────────── */
(function () {
  var els = document.querySelectorAll('.reveal, .reveal-stagger');
  if (!els.length) return;

  function revealAll() {
    els.forEach(function (el) { el.classList.add('in-view'); });
  }

  // No observer support (or reduced motion) → just show everything.
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) {
    revealAll();
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

  els.forEach(function (el) { io.observe(el); });
})();

/* ── Music toggle ───────────────────────────────────────────── */
(function () {
  var audio = document.getElementById('bgAudio');
  var btn   = document.getElementById('musicToggle');

  // Restore mute state — default is muted (first visit: null !== 'false' → true)
  var prevMuted = sessionStorage.getItem('audioMuted') !== 'false';
  audio.muted = prevMuted;
  if (!prevMuted) btn.classList.add('playing');

  // Restore playback position so the track doesn't restart from 0
  var prevTime = parseFloat(sessionStorage.getItem('audioTime') || '0');
  if (prevTime > 0) {
    // Try immediately (works if audio is cached), then retry on canplay
    try { audio.currentTime = prevTime; } catch (e) {}
    audio.addEventListener('canplay', function onReady() {
      audio.currentTime = prevTime;
      audio.removeEventListener('canplay', onReady);
    });
  }

  // Toggle mute on click
  btn.addEventListener('click', function () {
    audio.muted = !audio.muted;
    btn.classList.toggle('playing', !audio.muted);
    // If autoplay was blocked on first load, kick off playback now that
    // the user has interacted with the page
    if (!audio.muted && audio.paused) {
      audio.play().catch(function () {});
    }
    sessionStorage.setItem('audioMuted', String(audio.muted));
  });

  // Persist state before the page unloads
  window.addEventListener('beforeunload', function () {
    sessionStorage.setItem('audioMuted', String(audio.muted));
    sessionStorage.setItem('audioTime',  String(audio.currentTime));
  });
})();

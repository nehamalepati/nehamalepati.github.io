/* ── Soft SVG suit symbols ────────────────────────────────────── */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var PATHS = {
    '♥': 'M50,93C50,89,5,69,5,36C5,16,18,6,30,6C40,6,48,12,50,20C52,12,60,6,70,6C82,6,95,16,95,36C95,69,50,89,50,93Z',
    '♠': 'M50,5C50,10,5,28,5,50C5,65,22,72,35,66C43,62,48,56,50,66L44,88L56,88L50,66C52,56,57,62,65,66C78,72,95,65,95,50C95,28,50,10,50,5Z',
    '♦': 'M50,5L95,50L50,95L5,50Z',
    '♣': 'M50,90L42,90C38,82,39,74,46,69C36,66,26,58,26,46C26,32,37,22,50,22C63,22,74,32,74,46C74,58,64,66,54,69C61,74,62,82,58,90Z'
  };

  function makeSVG(char, display) {
    var d = PATHS[char];
    if (!d) return null;
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('fill', 'currentColor');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'width:1em;height:1em;display:' + (display || 'block') + ';';
    var p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    svg.appendChild(p);
    return svg;
  }

  document.querySelectorAll('.card-suit-big, .card-corner, .page-hero-suit').forEach(function (el) {
    var char = el.textContent.trim();
    var svg = makeSVG(char, 'block');
    if (svg) { el.textContent = ''; el.appendChild(svg); }
  });

  document.querySelectorAll('.princess-heart').forEach(function (el) {
    var char = el.textContent.trim();
    var svg = makeSVG(char, 'inline-block');
    if (svg) {
      svg.style.verticalAlign = 'middle';
      el.textContent = '';
      el.appendChild(svg);
    }
  });
})();

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

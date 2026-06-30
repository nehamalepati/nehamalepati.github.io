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

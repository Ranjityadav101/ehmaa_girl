/* ==========================================================================
   INTERACTIVE BIRTHDAY SURPRISE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  const PERSONAL_MESSAGE = "I hope this year brings you lots of happiness, success, and everything your heart wishes for. Keep smiling and stay the amazing person you are. Happy Birthday, Sathi! ❤️🎂";

  // STATE MANAGEMENT
  let isAudioPlaying = false;
  let audioCtx = null;
  let musicInterval = null;

  // DOM ELEMENTS
  const typewriterElement = document.getElementById('typewriter-text');
  const giftBox = document.getElementById('gift-box');
  const giftBtn = document.getElementById('gift-btn');
  const memoriesBtn = document.getElementById('memories-btn');
  const replayBtn = document.getElementById('replay-btn');
  const musicBtn = document.getElementById('music-btn');
  const musicIcon = document.getElementById('music-icon');
  const musicText = document.getElementById('music-text');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  /* --------------------------------------------------------------------------
     1. CANVAS ENGINE: MOVING STARS, FLOATING BALLOONS, CANDLES, TEDDIES & CONFETTI
     -------------------------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let stars = [];
  let confetti = [];
  let floatingItems = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Initialize Moving Stars (Positions slowly drift)
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.8 + 0.4,
      alpha: Math.random(),
      alphaSpeed: Math.random() * 0.02 + 0.005,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2
    });
  }

  // Animation Loop
  function animateCanvas() {
    ctx.clearRect(0, 0, width, height);

    // Render & Move Stars
    stars.forEach(star => {
      star.alpha += star.alphaSpeed;
      if (star.alpha > 1 || star.alpha < 0) star.alphaSpeed = -star.alphaSpeed;

      star.x += star.speedX;
      star.y += star.speedY;

      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 235, 255, ${Math.abs(star.alpha)})`;
      ctx.fill();
    });

    // Render & Move Floating Balloons, Candles, Teddy Bears & Stars
    floatingItems.forEach((item, index) => {
      item.y -= item.speedY;
      item.x += Math.sin(item.angle) * item.swing;
      item.angle += 0.02;

      ctx.save();
      ctx.font = `${item.size}px sans-serif`;
      ctx.globalAlpha = item.alpha;
      ctx.fillText(item.symbol, item.x, item.y);
      ctx.restore();

      if (item.y < -60) floatingItems.splice(index, 1);
    });

    // Render Confetti
    confetti.forEach((p, index) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.spin;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();

      if (p.y > height + 20) confetti.splice(index, 1);
    });

    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();

  // Burst Confetti
  function triggerConfetti() {
    const colors = ['#ff75a0', '#f7aef8', '#ffe57f', '#4deeea', '#a0c4ff'];
    for (let i = 0; i < 120; i++) {
      confetti.push({
        x: width / 2,
        y: height / 2 - 100,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 14,
        speedY: (Math.random() - 0.7) * 14,
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.2
      });
    }
  }

  // Continuous Floating Balloon & Star Spawner
  setInterval(() => {
    const symbols = ['🎈', '⭐', '🧸', '🕯️', '🎈', '💖', '✨', '🎈'];
    floatingItems.push({
      x: Math.random() * width,
      y: height + 50,
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      size: Math.random() * 18 + 22,
      speedY: Math.random() * 1.5 + 0.8,
      swing: Math.random() * 1.5 + 0.5,
      angle: 0,
      alpha: Math.random() * 0.4 + 0.6
    });
  }, 900);

  /* --------------------------------------------------------------------------
     2. TYPEWRITER EFFECT
     -------------------------------------------------------------------------- */
  function startTypewriter() {
    typewriterElement.textContent = "";
    let index = 0;

    function typeChar() {
      if (index < PERSONAL_MESSAGE.length) {
        typewriterElement.textContent += PERSONAL_MESSAGE.charAt(index);
        index++;
        setTimeout(typeChar, 38);
      }
    }
    typeChar();
  }

  /* --------------------------------------------------------------------------
     3. BACKGROUND MELODY SYNTHESIZER (Web Audio API)
     -------------------------------------------------------------------------- */
  function playMelodyNote() {
    if (!audioCtx || audioCtx.state === 'suspended') return;

    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25];
    const freq = notes[Math.floor(Math.random() * notes.length)];

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

    gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.8);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 2.0);
  }

  function toggleMusic() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }

    if (isAudioPlaying) {
      clearInterval(musicInterval);
      isAudioPlaying = false;
      musicText.textContent = "Play Melody";
      musicIcon.textContent = "🎵";
    } else {
      audioCtx.resume();
      isAudioPlaying = true;
      musicText.textContent = "Pause Melody";
      musicIcon.textContent = "🎶";
      playMelodyNote();
      musicInterval = setInterval(playMelodyNote, 800);
    }
  }

  musicBtn.addEventListener('click', toggleMusic);

  /* --------------------------------------------------------------------------
     4. BUTTON INTERACTIONS & LIGHTBOX
     -------------------------------------------------------------------------- */
  function openGift() {
    giftBox.classList.add('open');
    triggerConfetti();
  }

  giftBox.addEventListener('click', openGift);
  
  giftBtn.addEventListener('click', () => {
    giftBox.scrollIntoView({ behavior: 'smooth' });
    openGift();
  });

  memoriesBtn.addEventListener('click', () => {
    document.querySelector('.gallery-section').scrollIntoView({ behavior: 'smooth' });
  });

  replayBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    triggerConfetti();
    startTypewriter();
  });

  // Lightbox
  document.querySelectorAll('.polaroid-card').forEach(card => {
    card.addEventListener('click', () => {
      const imgSrc = card.getAttribute('data-img');
      const caption = card.getAttribute('data-caption');
      lightboxImg.src = imgSrc;
      lightboxCaption.textContent = caption;
      lightbox.classList.remove('hidden');
    });
  });

  lightboxClose.addEventListener('click', () => {
    lightbox.classList.add('hidden');
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.add('hidden');
  });

  // Launch initial celebration
  triggerConfetti();
  startTypewriter();

});
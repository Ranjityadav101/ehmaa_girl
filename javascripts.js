/* =========================================================
   REKHA'S BIRTHDAY MAGIC 💜
   Floating stars, balloons, moonlight, gift & confetti
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const PERSONAL_MESSAGE =
    "Dear Rekha 💜, I hope this beautiful new chapter of your life brings you endless happiness, success, peaceful moments, and dreams that slowly turn into reality. May you always find a reason to smile, strength to follow your dreams, and wonderful people who appreciate the beautiful person you are. Never forget how special you are. Keep shining, keep smiling, and always be your lovely self. Happy Birthday, Sathi! 🎂💗✨";

  const GIFT_MESSAGE =
    "Surprise, Rekha! 🎁💜 If I could give you one thing today, it would be the ability to see yourself through the eyes of the people who appreciate you. You would see someone wonderful, kind, and truly special. May your days be full of little joys, your heart full of peace, and your future full of beautiful possibilities. Thank you for being you. Happy Birthday, Beautiful Soul! 🌙✨❤️";

  const $ = (selector) => document.querySelector(selector);
  const typewriter = $("#typewriter-text");
  const giftBox = $("#gift-box");
  const giftBtn = $("#gift-btn");
  const memoriesBtn = $("#memories-btn");
  const replayBtn = $("#replay-btn");
  const musicBtn = $("#music-btn");
  const musicIcon = $("#music-icon");
  const musicText = $("#music-text");
  const gallery = $(".gallery-section");
  const canvas = $("#bg-canvas");

  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Create a gift message panel without changing your pictures.
  let giftMessage = $("#gift-message");

  if (!giftMessage && giftBox) {
    giftMessage = document.createElement("div");
    giftMessage.id = "gift-message";
    giftMessage.className = "glass-card gift-message hidden";
    giftMessage.setAttribute("aria-live", "polite");
    giftMessage.innerHTML =
      '<h2 class="card-heading">A Little Surprise for You 💝</h2>' +
      '<p class="gift-message-text"></p>';
    giftBox.parentElement.appendChild(giftMessage);
  }

  const giftMessageText = giftMessage
    ? giftMessage.querySelector(".gift-message-text")
    : null;

  // Canvas sizing
  let width = 0;
  let height = 0;
  let stars = [];
  let balloons = [];
  let confetti = [];
  let animationFrame = 0;
  let lastBalloonTime = 0;
  let giftOpened = false;
  let audioCtx = null;
  let musicTimer = null;
  let isPlaying = false;
  let typingTimer = null;
  let lightbox = $("#lightbox");
  let lightboxImg = $("#lightbox-img");
  let lightboxCaption = $("#lightbox-caption");
  let lightboxClose = $("#lightbox-close");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    stars = Array.from(
      { length: Math.min(130, Math.floor((width * height) / 8500)) },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.4,
        alpha: Math.random(),
        speed: Math.random() * 0.015 + 0.004,
        phase: Math.random() * Math.PI * 2
      })
    );
  }

  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Background animation
  function animate(timestamp = 0) {
    ctx.clearRect(0, 0, width, height);

    // Twinkling stars
    stars.forEach((star) => {
      star.phase += star.speed;
      const opacity = 0.25 + (Math.sin(star.phase) + 1) * 0.35;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 240, 255, ${opacity})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#e9b7ff";
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Floating balloons, hearts and teddy bears
    if (
      !reducedMotion &&
      timestamp - lastBalloonTime > 1000 &&
      balloons.length < 24
    ) {
      lastBalloonTime = timestamp;

      const symbols = ["🎈", "💜", "✨", "🎈", "🧸", "⭐", "💗"];

      balloons.push({
        x: Math.random() * width,
        y: height + 40,
        speed: Math.random() * 0.6 + 0.45,
        swing: Math.random() * 1.2 + 0.4,
        phase: Math.random() * Math.PI * 2,
        size: Math.random() * 13 + 19,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        opacity: Math.random() * 0.3 + 0.55
      });
    }

    balloons = balloons.filter((item) => item.y > -70);

    balloons.forEach((item) => {
      item.y -= item.speed;
      item.phase += 0.025;
      item.x += Math.sin(item.phase) * item.swing;

      ctx.save();
      ctx.globalAlpha = item.opacity;
      ctx.font = `${item.size}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(item.symbol, item.x, item.y);
      ctx.restore();
    });

    // Confetti
    confetti = confetti.filter(
      (piece) => piece.y < height + 30 && piece.life > 0
    );

    confetti.forEach((piece) => {
      piece.x += piece.vx;
      piece.y += piece.vy;
      piece.vy += 0.045;
      piece.rotation += piece.spin;
      piece.life -= 1;

      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.globalAlpha = Math.min(1, piece.life / 30);
      ctx.fillStyle = piece.color;
      ctx.fillRect(
        -piece.size / 2,
        -piece.size / 2,
        piece.size,
        piece.size * 1.5
      );
      ctx.restore();
    });

    animationFrame = requestAnimationFrame(animate);
  }

  animationFrame = requestAnimationFrame(animate);

  function celebrate(count = 130) {
    const colors = [
      "#ff75a0", "#e9b7ff", "#ffe57f",
      "#ffffff", "#b8a1ff", "#ffb7e0"
    ];

    for (let i = 0; i < count; i++) {
      confetti.push({
        x: width * (0.25 + Math.random() * 0.5),
        y: height * (0.2 + Math.random() * 0.25),
        vx: (Math.random() - 0.5) * 9,
        vy: (Math.random() - 0.8) * 10,
        size: Math.random() * 7 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI,
        spin: (Math.random() - 0.5) * 0.2,
        life: Math.random() * 90 + 70
      });
    }
  }

  // Typewriter message
  function typeMessage(element, message, speed = 28) {
    if (!element) return;

    clearTimeout(typingTimer);
    element.textContent = "";

    if (reducedMotion) {
      element.textContent = message;
      return;
    }

    let index = 0;

    function typeNext() {
      if (index >= message.length) return;

      element.textContent += message.charAt(index);
      index++;
      typingTimer = setTimeout(typeNext, speed);
    }

    typeNext();
  }

  // Gift opens only once; the button and box both work.
  function openGift() {
    if (!giftBox) return;

    giftBox.classList.add("open");

    if (giftMessage) {
      giftMessage.classList.remove("hidden");
      giftMessage.classList.add("gift-reveal");

      if (giftMessageText) {
        giftMessageText.textContent = GIFT_MESSAGE;
      }

      giftMessage.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "center"
      });
    }

    if (!giftOpened) {
      giftOpened = true;
      celebrate(180);
    }
  }

  giftBox?.addEventListener("click", openGift);

  giftBox?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openGift();
    }
  });

  if (giftBox && !giftBox.hasAttribute("tabindex")) {
    giftBox.tabIndex = 0;
    giftBox.setAttribute("role", "button");
    giftBox.setAttribute("aria-label", "Open your birthday gift");
  }

  giftBtn?.addEventListener("click", openGift);

  // Memories button
  memoriesBtn?.addEventListener("click", () => {
    gallery?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start"
    });
  });

  // Replay the birthday magic
  replayBtn?.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });

    celebrate(160);
    typeMessage(typewriter, PERSONAL_MESSAGE);
  });

  // Melody generated in the browser; no external audio file needed.
  function playNote() {
    if (!audioCtx || audioCtx.state !== "running") return;

    const notes = [
      261.63, 329.63, 392.00, 329.63,
      293.66, 349.23, 440.00, 392.00
    ];

    const note = notes[Math.floor(Math.random() * notes.length)];
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = note;
    gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.045, audioCtx.currentTime + 0.08
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001, audioCtx.currentTime + 0.65
    );

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.7);
  }

  async function toggleMusic() {
    try {
      if (!audioCtx) {
        const AudioContextClass =
          window.AudioContext || window.webkitAudioContext;

        if (!AudioContextClass) {
          alert("Sorry, this browser does not support audio playback.");
          return;
        }

        audioCtx = new AudioContextClass();
      }

      if (isPlaying) {
        clearInterval(musicTimer);
        musicTimer = null;
        isPlaying = false;
        musicText && (musicText.textContent = "Play Melody");
        musicIcon && (musicIcon.textContent = "🎵");
        return;
      }

      await audioCtx.resume();
      isPlaying = true;
      playNote();
      musicTimer = setInterval(playNote, 700);

      musicText && (musicText.textContent = "Pause Melody");
      musicIcon && (musicIcon.textContent = "🎶");
    } catch (error) {
      console.error("Audio could not start:", error);
    }
  }

  musicBtn?.addEventListener("click", toggleMusic);

  // Click photos to enlarge
  document.querySelectorAll(".polaroid-card").forEach((card) => {
    card.addEventListener("click", () => {
      const image = card.querySelector("img");
      const src = card.dataset.img || image?.src;
      if (!src || !lightbox || !lightboxImg) return;

      lightboxImg.src = src;
      lightboxCaption && (
        lightboxCaption.textContent = card.dataset.caption || ""
      );
      lightbox.classList.remove("hidden");
      document.body.classList.add("lightbox-open");
    });
  });

  function closeLightbox() {
    lightbox?.classList.add("hidden");
    document.body.classList.remove("lightbox-open");
  }

  lightboxClose?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });

  // Start the birthday surprise
  typeMessage(typewriter, PERSONAL_MESSAGE);
  celebrate(90);

  // Cancel animation when the page is hidden to save resources.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(animationFrame);
    } else {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(animate);
    }
  });
});
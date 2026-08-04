/* ==========================================
   Gift Website - Script
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ===== AUTH =====
  const authScreen    = document.getElementById('auth-screen');
  const mainContent   = document.getElementById('main-content');
  const codeInput     = document.getElementById('code-input');
  const authBtn       = document.getElementById('auth-btn');
  const authError     = document.getElementById('auth-error');
  const CORRECT_CODE  = '260709';

  function unlock() {
    if (codeInput.value === CORRECT_CODE) {
      authScreen.classList.add('hidden');
      mainContent.classList.remove('hidden');
      document.body.style.overflow = '';
      startCounter();
      revealCards();
    } else {
      authError.classList.add('show');
      codeInput.value = '';
      codeInput.focus();
      codeInput.style.animation = 'none';
      setTimeout(() => codeInput.style.animation = 'shake 0.4s ease-out', 10);
    }
  }

  authBtn.addEventListener('click', unlock);
  codeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') unlock();
  });
  codeInput.addEventListener('input', () => {
    authError.classList.remove('show');
    if (codeInput.value.length >= 6) {
      setTimeout(unlock, 200);
    }
  });

  codeInput.focus();

  // ===== DAYS COUNTER =====
  const START_DATE = new Date(2026, 6, 9);
  const counterEl  = document.getElementById('days-counter');

  function getDaysSince() {
    const now   = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff  = Math.floor((today - START_DATE) / (1000 * 60 * 60 * 24));
    return Math.max(0, diff);
  }

  function startCounter() {
    const target = getDaysSince();
    let current = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      counterEl.textContent = current;
    }, 30);
    counterEl.textContent = current;
  }

  // ===== SCROLL REVEAL =====
  function revealCards() {
    const cards = document.querySelectorAll('.flip-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });
    cards.forEach((card) => observer.observe(card));
  }

  // ===== FLIP CARDS =====
  document.querySelectorAll('.flip-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.gift-box')) return;
      card.classList.toggle('flipped');
    });
  });

  // ===== OVERLAY ELEMENTS =====
  const overlay       = document.getElementById('gift-overlay');
  const closeBtn      = document.getElementById('gift-close');
  const musicMode     = document.getElementById('music-mode');
  const sheetMusic    = document.getElementById('sheet-music');
  const modelMode     = document.getElementById('model-mode');
  const giftImg       = document.getElementById('gift-image');
  const placeholder    = document.getElementById('gift-placeholder');

  // Audio elements
  const audioPlayer   = document.getElementById('audio-player');
  const playBtn       = document.getElementById('play-btn');
  const restartBtn    = document.getElementById('restart-btn');
  const progressFill  = document.getElementById('progress-fill');
  const currentTimeEl = document.getElementById('current-time');
  const durationTimeEl = document.getElementById('duration-time');

  // ===== GIFT CLICK HANDLERS =====

  document.querySelectorAll('.gift-box').forEach((box) => {
    box.addEventListener('click', (e) => {
      e.stopPropagation();
      const giftId = parseInt(box.dataset.gift);

      // Gift 1 → music mode
      if (giftId === 1) {
        showMusicMode();
        return;
      }

      // Gift 2 → 3D model mode
      if (giftId === 2) {
        showModelMode();
        return;
      }
    });
  });

  // ===== MUSIC MODE =====
  function showMusicMode() {
    // Stop any current playback
    stopMusic();

    // Hide image/placeholder, show music mode
    giftImg.style.display = 'none';
    placeholder.classList.add('hidden');
    musicMode.classList.remove('hidden');

    // Load sheet music PDF
    sheetMusic.src = 'images/peace.pdf';

    // Load audio
    audioPlayer.src = 'images/peace.aif';
    audioPlayer.load();

    overlay.classList.remove('hidden');

    // Update play button state
    playBtn.textContent = '▶ 播放';
    playBtn.classList.remove('playing');
  }

  // ===== AUDIO PLAYER LOGIC =====
  let isPlaying = false;

  function formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  playBtn.addEventListener('click', () => {
    if (audioPlayer.src === '' || !audioPlayer.src) return;
    if (isPlaying) {
      audioPlayer.pause();
      playBtn.textContent = '▶ 播放';
      playBtn.classList.remove('playing');
    } else {
      audioPlayer.play().catch(() => {});
      playBtn.textContent = '⏸ 暂停';
      playBtn.classList.add('playing');
    }
    isPlaying = !isPlaying;
  });

  function stopMusic() {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    isPlaying = false;
    playBtn.textContent = '▶ 播放';
    playBtn.classList.remove('playing');
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
  }

  // ===== 3D MODEL MODE =====
  function showModelMode() {
    stopMusic();
    musicMode.classList.add('hidden');
    placeholder.classList.add('hidden');
    giftImg.style.display = 'none';
    modelMode.classList.remove('hidden');
    overlay.classList.remove('hidden');
  }

  restartBtn.addEventListener('click', () => {
    audioPlayer.currentTime = 0;
    if (!isPlaying) {
      audioPlayer.play().catch(() => {});
      isPlaying = true;
      playBtn.textContent = '⏸ 暂停';
      playBtn.classList.add('playing');
    }
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
  });

  // Audio events
  audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
      const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
      progressFill.style.width = `${pct}%`;
      currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
  });

  audioPlayer.addEventListener('loadedmetadata', () => {
    durationTimeEl.textContent = formatTime(audioPlayer.duration);
  });

  audioPlayer.addEventListener('ended', () => {
    isPlaying = false;
    playBtn.textContent = '▶ 播放';
    playBtn.classList.remove('playing');
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
  });

  // ===== IMAGE PLACEHOLDER =====
  function showImagePlaceholder(giftId) {
    giftImg.style.display = 'none';
    placeholder.classList.remove('hidden');
    placeholder.textContent = `🎀 礼物 ${giftId}\n请将图片文件放在\nfriendship-gift/images/ 目录下\n命名为 gift-${giftId}.jpg`;
    overlay.classList.remove('hidden');
  }

  // ===== CLOSE OVERLAY =====
  function closeOverlay() {
    // Stop any playing music
    stopMusic();
    // Reset
    musicMode.classList.add('hidden');
    modelMode.classList.add('hidden');
    sheetMusic.src = '';
    placeholder.classList.add('hidden');
    giftImg.style.display = '';
    audioPlayer.src = '';
    overlay.classList.add('hidden');
  }

  closeBtn.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeOverlay();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
      closeOverlay();
    }
  });

  // ===== SHAKE ANIMATION =====
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-6px); }
      80% { transform: translateX(6px); }
    }
  `;
  document.head.appendChild(style);

});
(function () {
  // ========== 关卡配置 ==========
  const ROUNDS = [
    {
      cards: 5,
      rows: 1,
      cols: 5,
      speed: 25,
      overlap: false,
      explosion: false,
      score: 5,
      moveDuration: 8000,
    },
    {
      cards: 5,
      rows: 1,
      cols: 5,
      speed: 25,
      overlap: false,
      explosion: false,
      score: 5,
      moveDuration: 8000,
    },
    {
      cards: 10,
      rows: 2,
      cols: 5,
      speed: 25,
      overlap: false,
      explosion: false,
      score: 10,
      moveDuration: 8000,
    },
    {
      cards: 10,
      rows: 2,
      cols: 5,
      speed: 25,
      overlap: false,
      explosion: false,
      score: 10,
      moveDuration: 8000,
    },
    {
      cards: 15,
      rows: 3,
      cols: 5,
      speed: 30,
      overlap: true,
      explosion: false,
      score: 15,
      moveDuration: 8000,
    },
    {
      cards: 15,
      rows: 3,
      cols: 5,
      speed: 30,
      overlap: true,
      explosion: false,
      score: 15,
      moveDuration: 8000,
    },
    {
      cards: 15,
      rows: 3,
      cols: 5,
      speed: 30,
      overlap: true,
      explosion: true,
      score: 20,
      moveDuration: 8000,
    },
    {
      cards: 15,
      rows: 3,
      cols: 5,
      speed: 30,
      overlap: true,
      explosion: true,
      score: 20,
      moveDuration: 8000,
    },
  ];

  const TOTAL_ROUNDS = 8;
  const CARD_W = 80;
  const CARD_H = 80;

  let canvas, ctx;
  let currentRound = 0;
  let totalScore = 0;
  let roundScore = 0;
  let cards = [];
  let targetIndex = -1;
  let gameState = "blink";
  let animFrame = null;
  let moveStartTime = 0;
  let moveDuration = 8000;
  let explosionTimeout = null;
  let blinkInterval = null;
  let moveTimeout = null;
  let autoNextTimeout = null;

  const scoreSpan = document.getElementById("scoreValue");
  const roundSpan = document.getElementById("roundValue");
  const roundScoreSpan = document.getElementById("roundScore");
  const restartGameBtn = document.getElementById("restartGameBtn");
  const backMenuBtn = document.getElementById("backMenuBtn");
  const messageDiv = document.getElementById("message");
  const gameContainer = document.getElementById("gameContainer");
  const startOverlay = document.getElementById("startOverlay");
  const startBtn = document.getElementById("startBtn");

  let sharedAudioCtx = null;
  let audioAllowed = false;

  function getAudioContext() {
    if (!sharedAudioCtx)
      sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return sharedAudioCtx;
  }

  function resumeAudioContext() {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();
  }

  function getRandomImagePaths(count) {
    const commonImages = [
      "apple",
      "banana",
      "orange",
      "strawberry",
      "grape",
      "watermelon",
      "cat",
      "dog",
      "bird",
      "fish",
      "rabbit",
      "tiger",
      "lion",
      "elephant",
      "car",
      "bus",
      "train",
      "ball",
      "star",
      "sun",
      "moon",
      "flower",
      "tree",
      "house",
      "pen",
      "pencil",
    ];
    const shuffled = [...commonImages];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected = shuffled.slice(0, count);
    return selected.map((name) => ({
      word: name,
      path: `images/${name}.jpeg`,
      img: null,
    }));
  }

  function loadImages(images, callback) {
    let loaded = 0;
    if (images.length === 0) {
      callback();
      return;
    }
    for (let img of images) {
      const imageObj = new Image();
      imageObj.onload = () => {
        loaded++;
        img.img = imageObj;
        if (loaded === images.length) callback();
      };
      imageObj.onerror = () => {
        loaded++;
        img.img = null;
        if (loaded === images.length) callback();
      };
      imageObj.src = img.path;
    }
  }

  function initCanvas() {
    const container = document.getElementById("gameArea");
    if (!container) return;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width - 40;
    canvas.height = rect.height - 40;
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";
  }

  function getGridPositions(rows, cols) {
    const positions = [];
    const marginX = 10;
    const marginY = 20;
    const availableWidth = canvas.width - marginX * 2;
    const availableHeight = canvas.height - marginY * 2;
    const cellWidth = availableWidth / cols;
    const cellHeight = availableHeight / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const centerX = marginX + cellWidth * (col + 0.5);
        const centerY = marginY + cellHeight * (row + 0.5);
        const x = centerX - CARD_W / 2;
        const y = centerY - CARD_H / 2;
        positions.push({ x, y });
      }
    }
    return positions;
  }

  function drawCard(ctx, card, isBlinking, isTarget, isFaceUp) {
    const x = card.currentX;
    const y = card.currentY;

    ctx.shadowBlur = 4;
    ctx.shadowColor = "rgba(0,0,0,0.3)";

    if (isFaceUp) {
      ctx.fillStyle = "#fff9ef";
      ctx.fillRect(x, y, CARD_W, CARD_H);
      ctx.fillStyle = "#b47c2e";
      ctx.strokeRect(x + 2, y + 2, CARD_W - 4, CARD_H - 4);

      if (card.img && card.img.complete && card.img.naturalWidth > 0) {
        const imgW = CARD_W * 0.75;
        const imgH = CARD_H * 0.75;
        ctx.drawImage(
          card.img,
          x + (CARD_W - imgW) / 2,
          y + (CARD_H - imgH) / 2,
          imgW,
          imgH,
        );
      } else {
        ctx.fillStyle = "#FFD966";
        ctx.fillRect(
          x + CARD_W * 0.15,
          y + CARD_H * 0.15,
          CARD_W * 0.7,
          CARD_H * 0.7,
        );
        ctx.fillStyle = "#B97F44";
        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(card.word || "?", x + CARD_W / 2, y + CARD_H / 2);
      }
    } else {
      ctx.fillStyle = "#2c5a2c";
      ctx.fillRect(x, y, CARD_W, CARD_H);
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.arc(
          x + Math.random() * CARD_W,
          y + Math.random() * CARD_H,
          2,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = "#4a7a4a";
        ctx.fill();
      }
      ctx.strokeStyle = "#f3c26b";
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 3, y + 3, CARD_W - 6, CARD_H - 6);
      ctx.font = "bold 32px Arial";
      ctx.fillStyle = "#ffd966";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("?", x + CARD_W / 2, y + CARD_H / 2);
    }

    if (isBlinking && isTarget) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#ffaa33";
      ctx.strokeStyle = "#ffaa33";
      ctx.lineWidth = 8;
      ctx.strokeRect(x + 2, y + 2, CARD_W - 4, CARD_H - 4);
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 5, y + 5, CARD_W - 10, CARD_H - 10);
      ctx.fillStyle = "rgba(255, 170, 51, 0.4)";
      ctx.fillRect(x + 2, y + 2, CARD_W - 4, CARD_H - 4);
      ctx.shadowBlur = 0;
    }

    ctx.shadowBlur = 0;
  }

  function draw() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#2c4a2e";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const isBlinking = gameState === "blink";

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const faceUp = isBlinking || card.revealed;
      drawCard(ctx, card, isBlinking, i === targetIndex, faceUp);
    }
  }

  function startMoving() {
    if (gameState !== "blink") return;

    const config = ROUNDS[currentRound];
    gameState = "moving";

    for (let i = 0; i < cards.length; i++) {
      cards[i].startX = cards[i].currentX;
      cards[i].startY = cards[i].currentY;
      cards[i].vx = (Math.random() - 0.5) * config.speed;
      cards[i].vy = (Math.random() - 0.5) * config.speed;
      if (Math.abs(cards[i].vx) < 1) cards[i].vx = Math.random() > 0.5 ? 1 : -1;
      if (Math.abs(cards[i].vy) < 1) cards[i].vy = Math.random() > 0.5 ? 1 : -1;
    }

    moveStartTime = performance.now();

    function animateMove(now) {
      const elapsed = now - moveStartTime;
      const t = Math.min(1, elapsed / moveDuration);

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        card.currentX += card.vx;
        card.currentY += card.vy;

        if (card.currentX < 0) {
          card.currentX = 0;
          card.vx = Math.abs(card.vx);
        }
        if (card.currentX + CARD_W > canvas.width) {
          card.currentX = canvas.width - CARD_W;
          card.vx = -Math.abs(card.vx);
        }
        if (card.currentY < 0) {
          card.currentY = 0;
          card.vy = Math.abs(card.vy);
        }
        if (card.currentY + CARD_H > canvas.height) {
          card.currentY = canvas.height - CARD_H;
          card.vy = -Math.abs(card.vy);
        }
      }

      if (!config.overlap) {
        for (let i = 0; i < cards.length; i++) {
          for (let j = i + 1; j < cards.length; j++) {
            const a = cards[i];
            const b = cards[j];
            const dx = a.currentX - b.currentX;
            const dy = a.currentY - b.currentY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CARD_W) {
              const angle = Math.atan2(dy, dx);
              const overlap = CARD_W - dist;
              const moveX = (Math.cos(angle) * overlap) / 2;
              const moveY = (Math.sin(angle) * overlap) / 2;
              a.currentX += moveX;
              a.currentY += moveY;
              b.currentX -= moveX;
              b.currentY -= moveY;
              const tempVx = a.vx,
                tempVy = a.vy;
              a.vx = b.vx;
              a.vy = b.vy;
              b.vx = tempVx;
              b.vy = tempVy;
            }
          }
        }
      }

      draw();

      if (t < 1) {
        animFrame = requestAnimationFrame(animateMove);
      } else {
        gameState = "waiting";
        messageDiv.textContent = "🔍 点击卡片，找出刚才闪动的那张！ 🔍";

        if (ROUNDS[currentRound].explosion) {
          showExplosionEffect();
        }

        cancelAnimationFrame(animFrame);
        animFrame = null;
      }
    }

    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = requestAnimationFrame(animateMove);
  }

  function showExplosionEffect() {
    if (explosionTimeout) clearTimeout(explosionTimeout);
    const rect = canvas.getBoundingClientRect();
    const explosion = document.createElement("div");
    explosion.className = "explosion-effect";
    explosion.textContent = "💥✨💥";
    explosion.style.left = rect.left + rect.width / 2 + "px";
    explosion.style.top = rect.top + rect.height / 2 + "px";
    document.body.appendChild(explosion);
    explosionTimeout = setTimeout(() => {
      if (explosion && explosion.remove) explosion.remove();
    }, 1000);
  }

  function showCountdown(callback) {
    const overlay = document.createElement("div");
    overlay.className = "countdown-overlay";
    overlay.style.cssText =
      "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center; z-index:10000; font-size:5rem; font-weight:bold; color:#ffaa33; text-shadow:3px 3px 0 #b45309;";
    overlay.innerHTML = "3";
    document.body.appendChild(overlay);

    let count = 3;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        overlay.innerHTML = count;
      } else if (count === 0) {
        overlay.innerHTML = "GO!";
        setTimeout(() => {
          overlay.remove();
          if (callback) callback();
        }, 500);
        clearInterval(interval);
      }
    }, 1000);
  }

  function showRestartButton() {
    restartGameBtn.style.display = "inline-block";
  }

  function hideRestartButton() {
    restartGameBtn.style.display = "none";
  }

  function restartGame() {
    if (autoNextTimeout) clearTimeout(autoNextTimeout);
    if (blinkInterval) clearInterval(blinkInterval);
    if (moveTimeout) clearTimeout(moveTimeout);
    if (animFrame) cancelAnimationFrame(animFrame);

    currentRound = 0;
    totalScore = 0;
    updateUI();
    hideRestartButton();
    showCountdown(() => {
      initRound();
    });
  }

  function autoNextRound() {
    if (currentRound + 1 < TOTAL_ROUNDS) {
      currentRound++;
      showCountdown(() => {
        initRound();
      });
    } else {
      // 游戏完成
      gameState = "result";
      messageDiv.innerHTML = `🏆 恭喜完成所有关卡！ 总分：${totalScore} / 100 🏆`;
      showRestartButton();
      showConfetti();
    }
  }

  function initRound() {
    hideRestartButton();
    messageDiv.innerHTML = "";

    const config = ROUNDS[currentRound];
    roundScore = config.score;
    updateUI();

    const imageItems = getRandomImagePaths(config.cards);
    const gridPositions = getGridPositions(config.rows, config.cols);

    cards = [];
    for (let i = 0; i < config.cards; i++) {
      cards.push({
        word: imageItems[i].word,
        img: null,
        currentX: gridPositions[i].x,
        currentY: gridPositions[i].y,
        targetX: gridPositions[i].x,
        targetY: gridPositions[i].y,
        startX: gridPositions[i].x,
        startY: gridPositions[i].y,
        vx: 0,
        vy: 0,
        revealed: false,
      });
    }

    targetIndex = Math.floor(Math.random() * config.cards);

    if (blinkInterval) clearInterval(blinkInterval);
    if (moveTimeout) clearTimeout(moveTimeout);

    loadImages(imageItems, () => {
      for (let i = 0; i < cards.length; i++) {
        cards[i].img = imageItems[i].img;
      }

      gameState = "blink";
      draw();

      let blinkCount = 0;
      blinkInterval = setInterval(() => {
        if (gameState !== "blink") {
          clearInterval(blinkInterval);
          return;
        }
        blinkCount++;
        draw();
        if (blinkCount >= 10) {
          clearInterval(blinkInterval);
          for (let i = 0; i < cards.length; i++) {
            cards[i].revealed = false;
          }
          draw();
          messageDiv.textContent = "⏰ 记住图片位置，卡片即将移动...";
          moveTimeout = setTimeout(() => {
            messageDiv.textContent = "";
            startMoving();
          }, 2000);
        }
      }, 300);
    });
  }

  function handleCanvasClick(e) {
    if (gameState !== "waiting") return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      if (card.revealed) continue;
      if (
        mouseX >= card.currentX &&
        mouseX <= card.currentX + CARD_W &&
        mouseY >= card.currentY &&
        mouseY <= card.currentY + CARD_H
      ) {
        card.revealed = true;
        draw();

        if (i === targetIndex) {
          totalScore += roundScore;
          updateUI();
          playSound("correct");
          messageDiv.innerHTML = `🎉 正确！ +${roundScore} 分 🎉`;
          gameState = "result";

          if (autoNextTimeout) clearTimeout(autoNextTimeout);
          autoNextTimeout = setTimeout(() => {
            autoNextRound();
          }, 1500);
        } else {
          playSound("wrong");
          messageDiv.innerHTML = `❌ 不对！正确答案是 ${cards[targetIndex].word} ❌`;
          cards[targetIndex].revealed = true;
          draw();
          gameState = "result";

          if (autoNextTimeout) clearTimeout(autoNextTimeout);
          autoNextTimeout = setTimeout(() => {
            autoNextRound();
          }, 2000);
        }
        break;
      }
    }
  }

  function updateUI() {
    scoreSpan.textContent = totalScore;
    roundSpan.textContent = currentRound + 1;
    roundScoreSpan.textContent = roundScore;
  }

  function showConfetti() {
    const colors = ["#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0"];
    for (let i = 0; i < 80; i++) {
      const conf = document.createElement("div");
      conf.style.cssText = `position:fixed; width:8px; height:8px; background:${colors[i % 4]}; left:${Math.random() * 100}vw; top:-10px; border-radius:50%; pointer-events:none; z-index:9999;`;
      document.body.appendChild(conf);
      const anim = conf.animate(
        [
          { transform: "translateY(0)", opacity: 1 },
          {
            transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`,
            opacity: 0,
          },
        ],
        { duration: 1500 + Math.random() * 1500 },
      );
      anim.onfinish = () => conf.remove();
    }
    playSound("correct");
  }

  function resizeAndRestart() {
    initCanvas();
    draw();
  }

  function initGame() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    initCanvas();
    window.addEventListener("resize", resizeAndRestart);
    canvas.addEventListener("click", handleCanvasClick);
    showCountdown(() => {
      initRound();
    });
  }

  function initAndStart() {
    wakeUpAudio();
    startOverlay.style.display = "none";
    gameContainer.style.display = "block";
    initGame();
  }

  function wakeUpAudio() {
    if (audioAllowed) return;
    try {
      const ctx = getAudioContext();
      const silentOsc = ctx.createOscillator();
      const silentGain = ctx.createGain();
      silentGain.gain.value = 0;
      silentOsc.connect(silentGain);
      silentGain.connect(ctx.destination);
      silentOsc.start();
      silentOsc.stop(ctx.currentTime + 0.01);
      ctx.resume();
      audioAllowed = true;
    } catch (e) {}
  }

  startBtn?.addEventListener("click", initAndStart);
  restartGameBtn?.addEventListener("click", restartGame);
  bindGoHome(backMenuBtn);
})();

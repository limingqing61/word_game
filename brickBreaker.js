(function () {
  "use strict";

  // ========== 配置 ==========
  const ROWS = 4;
  const COLS = 8;
  const SEGMENTS = ["a", "b", "c", "d", "e"];
  const SEGMENT_COUNT = 5;

  const ANGLE_ADJUST = {
    a: 30,
    b: 15,
    c: 0,
    d: -15,
    e: -30,
  };

  // ========== DOM ==========
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const timerDisplay = document.getElementById("timerDisplay");
  const brickCountEl = document.getElementById("brickCount");
  const startOverlay = document.getElementById("startOverlay");
  const startBtn = document.getElementById("startBtn");
  const gameContainer = document.getElementById("gameContainer");
  const backHomeBtn = document.getElementById("backHomeBtn");

  // ========== 尺寸变量 ==========
  let W = 0,
    H = 0;
  let BRICK_W = 0,
    BRICK_H = 0;
  let BALL_R = 0,
    PADDLE_W = 0,
    PADDLE_H = 0;
  let PADDLE_SEGMENT_W = 0;

  // ========== 游戏状态 ==========
  let bricks = [];
  let paddle = { x: 0, y: 0, segment: "c" };
  let ball = { x: 0, y: 0, vx: 0, vy: 0, r: 0 };
  let gameActive = false;
  let ballLaunched = false;
  let gameOver = false;
  let timerSeconds = 0;
  let timerInterval = null;
  let animFrame = null;
  let bricksRemaining = 0;
  let explosions = [];

  // ========== 音效 ==========
  function playHitSound() {
    playSound("correct");
  }
  function playMissSound() {
    playSound("wrong");
  }
  function playWinSound() {
    playSound("correct");
  }

  // ========== 尺寸计算 ==========
  function calcSizes() {
    const wrapper = canvas.parentElement;
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    let cw = rect.width;
    let ch = rect.height;
    if (ch < 200) {
      const headerH = document.querySelector("header")?.offsetHeight || 50;
      const panelH = document.querySelector(".top-panel")?.offsetHeight || 30;
      const bottomH = document.querySelector(".bottom-bar")?.offsetHeight || 40;
      ch = window.innerHeight - headerH - panelH - bottomH - 40;
      if (ch < 200) ch = 400;
    }
    cw = Math.max(cw, 300);
    ch = Math.max(ch, 300);

    canvas.width = cw;
    canvas.height = ch;
    canvas.style.width = cw + "px";
    canvas.style.height = ch + "px";
    W = cw;
    H = ch;

    const padding = 6;
    const gap = 3;
    const topMargin = 6;
    const bottomMargin = 6;

    const availW = W - padding * 2;
    const availH = H - topMargin - bottomMargin;

    let bw = (availW - (COLS - 1) * gap) / COLS;
    let bh = (availH - (ROWS - 1) * gap) / ROWS;

    const ratio = bh / bw;
    if (ratio > 0.85) bh = bw * 0.85;
    else if (ratio < 0.45) bh = bw * 0.45;

    BRICK_W = bw;
    BRICK_H = bh;
    BALL_R = Math.max(5, BRICK_W * 0.1);
    PADDLE_W = Math.min(BRICK_W * 1.6, W * 0.4);
    PADDLE_H = Math.max(8, BRICK_H * 0.22);
    PADDLE_SEGMENT_W = PADDLE_W / SEGMENT_COUNT;

    paddle.y = H - 8 - PADDLE_H;
    paddle.x = (W - PADDLE_W) / 2;
    ball.r = BALL_R;
    ball.x = paddle.x + PADDLE_W / 2;
    ball.y = paddle.y - BALL_R - 2;
    ball.vx = 0;
    ball.vy = 0;
  }

  // ========== 砖块生成 ==========
  function generateBricks() {
    const animals = [];
    if (window.wordData) {
      for (const [key, value] of Object.entries(window.wordData)) {
        if (value.type === "animal") animals.push(key);
      }
    }
    if (animals.length < ROWS * COLS) {
      const allWords = Object.keys(window.wordData || {});
      const shuffledAll = [...allWords];
      for (let i = shuffledAll.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledAll[i], shuffledAll[j]] = [shuffledAll[j], shuffledAll[i]];
      }
      for (const w of shuffledAll) {
        if (animals.length >= ROWS * COLS) break;
        if (!animals.includes(w)) animals.push(w);
      }
    }
    while (animals.length < ROWS * COLS) animals.push("cat");

    const shuffled = [...animals];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected = shuffled.slice(0, ROWS * COLS);
    for (let i = selected.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [selected[i], selected[j]] = [selected[j], selected[i]];
    }

    bricks = [];
    let idx = 0;
    const gap = 3;
    const topMargin = 6;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const x = gap + c * (BRICK_W + gap);
        const y = topMargin + r * (BRICK_H + gap);
        const key = selected[idx++];
        const wordData = window.wordData[key] || {};
        bricks.push({
          x: x,
          y: y,
          w: BRICK_W,
          h: BRICK_H,
          wordKey: key,
          image: wordData.image || "",
          alive: true,
        });
      }
    }
    bricksRemaining = bricks.length;
    brickCountEl.textContent = bricksRemaining;
  }

  // ========== 挡板分段 ==========
  function getPaddleSegment(px) {
    const relX = px - paddle.x;
    const segIndex = Math.floor(relX / PADDLE_SEGMENT_W);
    const idx = Math.max(0, Math.min(SEGMENT_COUNT - 1, segIndex));
    return SEGMENTS[idx];
  }

  // ========== 球物理 ==========
  function launchBall() {
    if (ballLaunched) return;
    ballLaunched = true;
    const angle = (45 * Math.PI) / 180;
    const speed = BRICK_W * 3.8;
    ball.vx = Math.cos(angle) * speed;
    ball.vy = -Math.sin(angle) * speed;
    startTimer();
  }

  function startTimer() {
    if (timerInterval) return;
    timerSeconds = 0;
    timerDisplay.textContent = "0";
    timerInterval = setInterval(() => {
      timerSeconds++;
      timerDisplay.textContent = timerSeconds;
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function resetBall() {
    ball.x = paddle.x + PADDLE_W / 2;
    ball.y = paddle.y - ball.r - 2;
    ball.vx = 0;
    ball.vy = 0;
    ballLaunched = false;
  }

  // ========== 碰撞处理 ==========
  function handleBrickCollision(brick) {
    if (!brick.alive) return;
    brick.alive = false;
    bricksRemaining--;
    brickCountEl.textContent = bricksRemaining;
    explosions.push({
      x: brick.x + brick.w / 2,
      y: brick.y + brick.h / 2,
      progress: 0,
    });
    playHitSound();
    if (bricksRemaining <= 0) winGame();
  }

  function handlePaddleCollision() {
    const seg = getPaddleSegment(ball.x);
    const side = ball.x - (paddle.x + PADDLE_W / 2);
    let deg = (Math.atan2(ball.vy, ball.vx) * 180) / Math.PI;

    if (side > 0) {
      if (seg === "a") deg += ANGLE_ADJUST.a;
      else if (seg === "b") deg += ANGLE_ADJUST.b;
    } else if (side < 0) {
      if (seg === "d") deg += ANGLE_ADJUST.d;
      else if (seg === "e") deg += ANGLE_ADJUST.e;
    }

    const speed = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);
    const newAngle = (deg * Math.PI) / 180;
    ball.vx = Math.cos(newAngle) * speed;
    ball.vy = -Math.abs(Math.sin(newAngle) * speed);
    if (Math.abs(ball.vy) < speed * 0.15) ball.vy = -speed * 0.25;
    ball.y = paddle.y - ball.r - 1;
    playHitSound();
  }

  function updateBall() {
    if (!ballLaunched || gameOver) return;
    const dt = 0.016;
    ball.x += ball.vx * dt;
    ball.y += ball.vy * dt;

    if (ball.x - ball.r <= 0) {
      ball.x = ball.r;
      ball.vx = -ball.vx;
    }
    if (ball.x + ball.r >= W) {
      ball.x = W - ball.r;
      ball.vx = -ball.vx;
    }
    if (ball.y - ball.r <= 0) {
      ball.y = ball.r;
      ball.vy = -ball.vy;
    }

    if (ball.y + ball.r >= H) {
      gameOver = true;
      gameActive = false;
      ballLaunched = false;
      playMissSound();
      stopTimer();
      showGameOver();
      return;
    }

    for (const brick of bricks) {
      if (!brick.alive) continue;
      const cx = ball.x,
        cy = ball.y,
        r = ball.r;
      const bx = brick.x,
        by = brick.y,
        bw = brick.w,
        bh = brick.h;
      const closestX = Math.max(bx, Math.min(cx, bx + bw));
      const closestY = Math.max(by, Math.min(cy, by + bh));
      const dx = cx - closestX,
        dy = cy - closestY;
      if (dx * dx + dy * dy < r * r) {
        const overlapX = r - Math.abs(dx);
        const overlapY = r - Math.abs(dy);
        if (overlapX < overlapY) ball.vx = -ball.vx;
        else ball.vy = -ball.vy;
        if (overlapX < overlapY) ball.x += (dx > 0 ? 1 : -1) * overlapX;
        else ball.y += (dy > 0 ? 1 : -1) * overlapY;
        handleBrickCollision(brick);
        break;
      }
    }

    if (
      ball.vy > 0 &&
      ball.y + ball.r >= paddle.y &&
      ball.y + ball.r <= paddle.y + PADDLE_H + 10 &&
      ball.x >= paddle.x - 2 &&
      ball.x <= paddle.x + PADDLE_W + 2
    ) {
      handlePaddleCollision();
    }
  }

  // ========== 渲染 ==========
  function drawBricks() {
    for (const brick of bricks) {
      if (!brick.alive) continue;
      const x = brick.x,
        y = brick.y,
        w = brick.w,
        h = brick.h;
      ctx.fillStyle = "#2a3a2a";
      ctx.fillRect(x - 1, y - 1, w + 2, h + 2);
      const grad = ctx.createLinearGradient(x, y, x, y + h);
      grad.addColorStop(0, "#3a5a3a");
      grad.addColorStop(1, "#2a4a2a");
      ctx.fillStyle = grad;
      ctx.fillRect(x, y, w, h);
      if (brick.image) {
        const img = new Image();
        img.src = brick.image;
        if (img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, x + 4, y + 4, w - 8, h - 8);
        } else {
          ctx.fillStyle = "rgba(255,255,255,0.1)";
          ctx.fillRect(x + 4, y + 4, w - 8, h - 8);
          ctx.fillStyle = "rgba(255,255,255,0.2)";
          ctx.font = `${Math.min(w, h) * 0.3}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText("🐾", x + w / 2, y + h / 2);
        }
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        ctx.font = `${Math.min(w, h) * 0.4}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🐾", x + w / 2, y + h / 2);
      }
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 2, y + 2, w - 4, h - 4);
    }
  }

  function drawPaddle() {
    const x = paddle.x,
      y = paddle.y,
      w = PADDLE_W,
      h = PADDLE_H;
    const grad = ctx.createLinearGradient(x, y, x, y + h);
    grad.addColorStop(0, "#4fc3f7");
    grad.addColorStop(1, "#0288d1");
    ctx.fillStyle = grad;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(79, 195, 247, 0.3)";
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    for (let i = 1; i < SEGMENT_COUNT; i++) {
      const sx = x + i * PADDLE_SEGMENT_W;
      ctx.beginPath();
      ctx.moveTo(sx, y + 4);
      ctx.lineTo(sx, y + h - 4);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "10px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = 0; i < SEGMENT_COUNT; i++) {
      const lx = x + i * PADDLE_SEGMENT_W + PADDLE_SEGMENT_W / 2;
      ctx.fillText(SEGMENTS[i].toUpperCase(), lx, y + h / 2);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 6);
    ctx.stroke();
  }

  function drawBall() {
    const grad = ctx.createRadialGradient(
      ball.x - ball.r * 0.3,
      ball.y - ball.r * 0.3,
      ball.r * 0.1,
      ball.x,
      ball.y,
      ball.r,
    );
    grad.addColorStop(0, "#ffd54f");
    grad.addColorStop(0.7, "#ffaa33");
    grad.addColorStop(1, "#ff6b00");
    ctx.shadowBlur = 20;
    ctx.shadowColor = "rgba(255, 170, 51, 0.4)";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(
      ball.x - ball.r * 0.25,
      ball.y - ball.r * 0.25,
      ball.r * 0.25,
      0,
      Math.PI * 2,
    );
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.fill();
  }

  function drawExplosions() {
    for (let i = explosions.length - 1; i >= 0; i--) {
      const e = explosions[i];
      e.progress += 0.035;
      if (e.progress >= 1) {
        explosions.splice(i, 1);
        continue;
      }
      const size = e.progress * 30;
      const alpha = 1 - e.progress;
      ctx.globalAlpha = alpha;
      ctx.font = `${size}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("💥", e.x, e.y);
      ctx.globalAlpha = 1;
    }
  }

  function render() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(255,255,255,0.02)";
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, H);
      ctx.stroke();
    }
    for (let i = 0; i < H; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(W, i);
      ctx.stroke();
    }
    drawBricks();
    drawPaddle();
    drawBall();
    drawExplosions();
    ctx.strokeStyle = "rgba(255,0,0,0.08)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(0, H - 5);
    ctx.lineTo(W, H - 5);
    ctx.stroke();
    ctx.setLineDash([]);
    if (!ballLaunched && !gameOver) {
      ctx.fillStyle = "rgba(255,236,179,0.3)";
      ctx.font = "16px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("👆 点击屏幕发射小球", W / 2, H / 2 + 40);
    }
  }

  // ========== 游戏循环 ==========
  function gameLoop() {
    if (gameActive && !gameOver) updateBall();
    render();
    animFrame = requestAnimationFrame(gameLoop);
  }

  // ========== 游戏控制 ==========
  function startGame() {
    startOverlay.style.display = "none";
    gameContainer.style.display = "flex";
    requestAnimationFrame(() => {
      calcSizes();
      generateBricks();
      resetBall();
      gameActive = true;
      gameOver = false;
      ballLaunched = false;
      explosions = [];
      stopTimer();
      timerSeconds = 0;
      timerDisplay.textContent = "0";
      setTimeout(() => {
        calcSizes();
        generateBricks();
        render();
      }, 100);
      if (animFrame) cancelAnimationFrame(animFrame);
      gameLoop();
    });
  }

  function resetGame() {
    const overlay = document.querySelector(".result-overlay");
    if (overlay) overlay.remove();
    stopTimer();
    gameActive = true;
    gameOver = false;
    ballLaunched = false;
    explosions = [];
    generateBricks();
    resetBall();
    timerSeconds = 0;
    timerDisplay.textContent = "0";
    calcSizes();
  }

  function winGame() {
    gameActive = false;
    ballLaunched = false;
    stopTimer();
    playWinSound();
    const overlay = document.createElement("div");
    overlay.className = "result-overlay";
    overlay.innerHTML = `
            <div class="result-card">
                <h2>🎉 通关成功！ 🎉</h2>
                <div class="final-label">总用时</div>
                <div class="final-time">${timerSeconds}s</div>
                <div class="result-buttons">
                    <button class="btn-restart" id="resultRestartBtn"><i class="fas fa-redo"></i> 再来一局</button>
                    <button class="btn-home" id="resultHomeBtn"><i class="fas fa-home"></i> 返回首页</button>
                </div>
            </div>
        `;
    document.body.appendChild(overlay);
    document
      .getElementById("resultRestartBtn")
      .addEventListener("click", () => {
        overlay.remove();
        resetGame();
      });
    document.getElementById("resultHomeBtn").addEventListener("click", () => {
      overlay.remove();
      goHome();
    });
  }

  function showGameOver() {
    const overlay = document.createElement("div");
    overlay.className = "result-overlay";
    overlay.innerHTML = `
            <div class="result-card" style="border-color: #f44336;">
                <h2 style="color: #f44336;">💔 球落了</h2>
                <div class="final-label">已消除砖块</div>
                <div class="final-time">${bricksRemaining > 0 ? 32 - bricksRemaining : 32} / 32</div>
                <div class="result-buttons">
                    <button class="btn-restart" id="resultRestartBtn"><i class="fas fa-redo"></i> 再来一局</button>
                    <button class="btn-home" id="resultHomeBtn"><i class="fas fa-home"></i> 返回首页</button>
                </div>
            </div>
        `;
    document.body.appendChild(overlay);
    document
      .getElementById("resultRestartBtn")
      .addEventListener("click", () => {
        overlay.remove();
        resetGame();
      });
    document.getElementById("resultHomeBtn").addEventListener("click", () => {
      overlay.remove();
      goHome();
    });
  }

  // ========== 交互 ==========
  function updatePaddle(clientX) {
    if (!gameActive || gameOver) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    let px = (clientX - rect.left) * scaleX;
    px = Math.max(0, Math.min(W - PADDLE_W, px - PADDLE_W / 2));
    paddle.x = px;
    if (!ballLaunched) {
      ball.x = paddle.x + PADDLE_W / 2;
      ball.y = paddle.y - ball.r - 2;
    }
  }

  function handlePointerMove(e) {
    e.preventDefault();
    if (e.touches && e.touches.length > 1) return;
    const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
    updatePaddle(clientX);
  }

  function handleLaunch(e) {
    e.preventDefault();
    if (!gameActive || gameOver || ballLaunched) return;
    launchBall();
  }

  canvas.addEventListener(
    "touchstart",
    function (e) {
      e.preventDefault();
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        updatePaddle(touch.clientX);
        handleLaunch(e);
      }
    },
    { passive: false },
  );

  canvas.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
      if (e.touches.length === 1) handlePointerMove(e);
    },
    { passive: false },
  );

  canvas.addEventListener(
    "touchend",
    function (e) {
      e.preventDefault();
    },
    { passive: false },
  );

  canvas.addEventListener("mousemove", function (e) {
    handlePointerMove(e);
  });
  canvas.addEventListener("click", function (e) {
    handleLaunch(e);
  });

  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (gameActive && !gameOver) {
        calcSizes();
        generateBricks();
        render();
      }
    }, 300);
  });

  // ========== 启动 ==========
  startBtn.addEventListener("click", startGame);
  if (backHomeBtn) backHomeBtn.addEventListener("click", goHome);

  // ========== roundRect polyfill ==========
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
      if (r > w / 2) r = w / 2;
      if (r > h / 2) r = h / 2;
      this.moveTo(x + r, y);
      this.lineTo(x + w - r, y);
      this.quadraticCurveTo(x + w, y, x + w, y + r);
      this.lineTo(x + w, y + h - r);
      this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      this.lineTo(x + r, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - r);
      this.lineTo(x, y + r);
      this.quadraticCurveTo(x, y, x + r, y);
      return this;
    };
  }
})();

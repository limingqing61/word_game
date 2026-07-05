(function () {
  "use strict";

  // ========== 游戏配置 ==========
  const TOTAL_ROUNDS = 8;
  const UNIT_T = 0.5; // 单位时间（秒）
  const FLAG_SINGLE_DURATION = 10 * UNIT_T; // 旗帜单程时间 5s
  const ARROW_FLIGHT_DURATION = 3 * UNIT_T; // 弓箭飞行时间 1.5s
  const PLAYER_SPEED_RATIO = 2; // 玩家移动速度是旗帜的 2 倍

  // 每局配置 [分值, 箭数, 是否可移动, 固定位置比例(仅不可移动时)]
  const ROUND_CONFIGS = [
    { score: 5, arrows: Infinity, movable: true, fixedY: null },
    { score: 5, arrows: Infinity, movable: true, fixedY: null },
    { score: 10, arrows: 6, movable: true, fixedY: null },
    { score: 10, arrows: 6, movable: true, fixedY: null },
    { score: 15, arrows: 4, movable: true, fixedY: null },
    { score: 15, arrows: 4, movable: true, fixedY: null },
    { score: 20, arrows: Infinity, movable: false, fixedY: 0.4 },
    { score: 20, arrows: Infinity, movable: false, fixedY: 0.6 },
  ];

  const MAX_SCORE = 100;

  // ========== DOM 元素 ==========
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const roundDisplay = document.getElementById("roundDisplay");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const arrowsDisplay = document.getElementById("arrowsDisplay");

  const fireBtn = document.getElementById("fireBtn");
  const floatingBtn = document.getElementById("floatingHomeBtn");

  // ========== 尺寸参数 ==========
  let FLAG_WIDTH = 50;
  let FLAG_HEIGHT = 70;
  let ARROW_WIDTH = 45;
  let ARROW_HEIGHT = 10;
  const FLAG_POLE_GAP = 70;
  let PLAYER_POLE_X = 80;
  let ENEMY_POLE_X = 600;

  // ========== 游戏状态 ==========
  let game = {
    round: 0,
    score: 0,
    arrowsRemaining: Infinity,
    maxArrows: Infinity,
    movable: true,
    fixedY: null,
    playerY: 0.5,
    enemyY: 1.0,
    enemyDir: -1,
    arrows: [],
    status: "idle",
    countdown: 3,
    roundFinished: false,
    animId: null,
    countdownTimer: null,
    W: 0,
    H: 0,
    flagSpeed: 0,
    playerSpeed: 0,
    isPointerDown: false,
    pointerY: 0,
  };

  // ========== 音效 ==========
  let sharedAudioCtx = null;

  function getAudioContext() {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return sharedAudioCtx;
  }

  function resumeAudioContext() {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();
  }

  // ========== Canvas 初始化 ==========
  function resizeCanvas() {
    const wrapper = canvas.parentElement;
    const rect = wrapper.getBoundingClientRect();
    const containerWidth = rect.width || 700;
    const aspectRatio = 4 / 3;
    const w = containerWidth;
    const h = containerWidth / aspectRatio;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    game.W = w;
    game.H = h;
    PLAYER_POLE_X = FLAG_POLE_GAP;
    ENEMY_POLE_X = w - FLAG_POLE_GAP;
    const flagPathPixels = h - FLAG_HEIGHT - 20;
    game.flagSpeed = flagPathPixels / FLAG_SINGLE_DURATION;
    game.playerSpeed = game.flagSpeed * PLAYER_SPEED_RATIO;
    if (game.status === "idle") {
      render();
    }
  }

  // ========== 绘制函数 ==========
  function drawFlag(ctx, x, y, width, height, color, label, isEnemy = false) {
    ctx.beginPath();
    ctx.moveTo(x, y + height);
    ctx.lineTo(x, y - 10);
    ctx.strokeStyle = "#8D6E63";
    ctx.lineWidth = 4;
    ctx.stroke();

    const flagX = x + 2;
    const flagY = y;
    const flagW = width;
    const flagH = height;

    const grad = ctx.createLinearGradient(flagX, flagY, flagX + flagW, flagY);
    grad.addColorStop(0, color);
    grad.addColorStop(1, lightenColor(color, 20));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(flagX, flagY);
    ctx.lineTo(flagX + flagW, flagY + 4);
    ctx.lineTo(flagX + flagW, flagY + flagH - 4);
    ctx.lineTo(flagX, flagY + flagH);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const img = new Image();
    const imgPath = isEnemy ? "images/Russia.jpeg" : "images/Ukraine.jpeg";
    img.src = imgPath;
    img.onload = function () {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(flagX, flagY);
      ctx.lineTo(flagX + flagW, flagY + 4);
      ctx.lineTo(flagX + flagW, flagY + flagH - 4);
      ctx.lineTo(flagX, flagY + flagH);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, flagX, flagY, flagW, flagH);
      ctx.restore();
    };
    if (img.complete && img.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(flagX, flagY);
      ctx.lineTo(flagX + flagW, flagY + 4);
      ctx.lineTo(flagX + flagW, flagY + flagH - 4);
      ctx.lineTo(flagX, flagY + flagH);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, flagX, flagY, flagW, flagH);
      ctx.restore();
    }

    if (isEnemy) {
      ctx.beginPath();
      ctx.arc(x + width / 2, y + height / 2, 12, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255, 0, 0, 0.15)";
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.fillStyle = "white";
    ctx.font = 'bold 12px "Comic Neue", sans-serif';
    ctx.textAlign = "center";
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4;
    ctx.fillText(label, x + width / 2, y + height + 18);
    ctx.shadowBlur = 0;
  }

  function lightenColor(hex, amount) {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    let r = parseInt(c.substring(0, 2), 16);
    let g = parseInt(c.substring(2, 4), 16);
    let b = parseInt(c.substring(4, 6), 16);
    r = Math.min(255, r + amount);
    g = Math.min(255, g + amount);
    b = Math.min(255, b + amount);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  function drawArrow(ctx, x, y, width, height, angle = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = "#5D4037";
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.fillStyle = "#BDBDBD";
    ctx.beginPath();
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2 - 10, -height * 1.5);
    ctx.lineTo(width / 2 - 10, height * 1.5);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#8D6E63";
    ctx.fillRect(-width / 2, -height * 0.8, 4, height * 1.6);
    ctx.restore();
  }

  function drawCountdown(ctx, num) {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 20;
    ctx.fillStyle = "#FFE484";
    ctx.font = 'bold 100px "Comic Neue", sans-serif';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(num, game.W / 2, game.H / 2);
    ctx.restore();
  }

  function drawExplosion(ctx, x, y, progress) {
    const particles = 20;
    const radius = 30 + progress * 40;
    ctx.save();
    for (let i = 0; i < particles; i++) {
      const angle = (i / particles) * Math.PI * 2 + progress * 0.5;
      const r = radius * (0.3 + 0.7 * progress);
      const px = x + Math.cos(angle) * r;
      const py = y + Math.sin(angle) * r;
      const size = 6 * (1 - progress * 0.5);
      const alpha = 1 - progress;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = ["#FF6B6B", "#FFD93D", "#FF8A65", "#FFAB40", "#FF5252"][
        i % 5
      ];
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  let explosionAnim = null;

  function render() {
    const { W, H } = game;
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = "rgba(255,255,255,0.03)";
    ctx.lineWidth = 1;
    for (let i = 0; i < W; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, H);
      ctx.stroke();
    }
    for (let i = 0; i < H; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(W, i);
      ctx.stroke();
    }

    ctx.strokeStyle = "rgba(139, 110, 69, 0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 8]);
    ctx.beginPath();
    ctx.moveTo(PLAYER_POLE_X, 20);
    ctx.lineTo(PLAYER_POLE_X, H - 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ENEMY_POLE_X, 20);
    ctx.lineTo(ENEMY_POLE_X, H - 20);
    ctx.stroke();
    ctx.setLineDash([]);

    const topMargin = 20;
    const bottomMargin = 20;
    const flagPathPixels = H - topMargin - bottomMargin - FLAG_HEIGHT;
    const playerPx = topMargin + game.playerY * flagPathPixels;
    const enemyPx = topMargin + game.enemyY * flagPathPixels;

    if (game.status !== "roundEnd" || game.roundFinished === false) {
      drawFlag(
        ctx,
        ENEMY_POLE_X - FLAG_WIDTH,
        enemyPx,
        FLAG_WIDTH,
        FLAG_HEIGHT,
        "#FF6B6B",
        "🏳️",
        true,
      );
    }

    const now = performance.now() / 1000;
    const arrowsToRemove = [];
    game.arrows.forEach((arrow, idx) => {
      const elapsed = now - arrow.startTime;
      const progress = Math.min(elapsed / ARROW_FLIGHT_DURATION, 1);
      const x =
        PLAYER_POLE_X + 10 + (ENEMY_POLE_X - PLAYER_POLE_X - 20) * progress;
      const y = arrow.startY + (arrow.endY - arrow.startY) * progress;
      arrow.currentX = x;
      arrow.currentY = y;
      drawArrow(ctx, x, y, ARROW_WIDTH, ARROW_HEIGHT);
      if (progress >= 1) {
        arrowsToRemove.push(idx);
      }
    });
    for (let i = arrowsToRemove.length - 1; i >= 0; i--) {
      game.arrows.splice(arrowsToRemove[i], 1);
    }

    const playerX = PLAYER_POLE_X - FLAG_WIDTH - 2;
    drawFlag(
      ctx,
      playerX,
      playerPx,
      FLAG_WIDTH,
      FLAG_HEIGHT,
      "#FFD93D",
      "🛡️",
      false,
    );

    if (game.status === "countdown") {
      drawCountdown(ctx, game.countdown);
    }

    if (game.status === "roundEnd") {
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, H / 2 - 60, W, 120);
      ctx.fillStyle = game.roundWin ? "#a5ffa5" : "#ffaaaa";
      ctx.font = 'bold 48px "Comic Neue", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 10;
      ctx.fillText(
        game.roundWin ? "🎉 命中！ 🎉" : "💔 未命中...",
        W / 2,
        H / 2,
      );
      ctx.restore();
    }

    if (game.status === "gameOver") {
      ctx.save();
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#FFE484";
      ctx.font = 'bold 60px "Comic Neue", sans-serif';
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(0,0,0,0.5)";
      ctx.shadowBlur = 20;
      ctx.fillText("🏆 游戏结束", W / 2, H / 2 - 60);
      ctx.font = 'bold 40px "Comic Neue", sans-serif';
      ctx.fillStyle = "#ffaa33";
      ctx.fillText(`最终得分: ${game.score} / ${MAX_SCORE}`, W / 2, H / 2 + 40);
      ctx.restore();
    }

    if (explosionAnim) {
      drawExplosion(
        ctx,
        explosionAnim.x,
        explosionAnim.y,
        explosionAnim.progress,
      );
    }
  }

  // ========== 游戏循环 ==========
  let lastTime = 0;

  function gameLoop(timestamp) {
    if (game.status === "idle" || game.status === "gameOver") {
      render();
      game.animId = requestAnimationFrame(gameLoop);
      return;
    }

    const dt = lastTime ? Math.min((timestamp - lastTime) / 1000, 0.05) : 0.016;
    lastTime = timestamp;

    if (game.status === "playing") {
      const delta = game.flagSpeed * dt * game.enemyDir;
      const flagPathPixels = game.H - 40 - FLAG_HEIGHT;
      game.enemyY += delta / flagPathPixels;

      if (game.enemyY <= 0) {
        game.enemyY = 0;
        game.enemyDir = 1;
      } else if (game.enemyY >= 1) {
        game.enemyY = 1;
        game.enemyDir = -1;
        if (!game.roundFinished) {
          endRound(false);
        }
      }

      const enemyPx = 20 + game.enemyY * (game.H - 40 - FLAG_HEIGHT);
      const enemyCenterX = ENEMY_POLE_X - FLAG_WIDTH / 2;
      const enemyCenterY = enemyPx + FLAG_HEIGHT / 2;
      const hitRadius = Math.max(FLAG_WIDTH, FLAG_HEIGHT) / 2;

      for (let i = game.arrows.length - 1; i >= 0; i--) {
        const arrow = game.arrows[i];
        if (arrow.hit) continue;
        const dx = arrow.currentX - enemyCenterX;
        const dy = arrow.currentY - enemyCenterY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < hitRadius) {
          arrow.hit = true;
          if (!game.roundFinished) {
            playSound("action");
            triggerExplosion(enemyCenterX, enemyCenterY);
            endRound(true);
          }
          game.arrows.splice(i, 1);
          break;
        }
      }
    }

    render();

    if (explosionAnim) {
      explosionAnim.progress += dt * 2;
      if (explosionAnim.progress >= 1) {
        explosionAnim = null;
      }
    }

    game.animId = requestAnimationFrame(gameLoop);
  }

  // ========== 爆炸效果 ==========
  function triggerExplosion(x, y) {
    explosionAnim = { x, y, progress: 0 };
  }

  // ========== 倒计时 ==========
  function startCountdown() {
    game.status = "countdown";
    game.countdown = 3;
    game.roundFinished = false;

    if (game.countdownTimer) {
      clearInterval(game.countdownTimer);
      game.countdownTimer = null;
    }

    setButtonsEnabled(false);

    game.countdownTimer = setInterval(() => {
      game.countdown--;
      if (game.countdown <= 0) {
        clearInterval(game.countdownTimer);
        game.countdownTimer = null;
        game.status = "playing";
        setButtonsEnabled(true);
        game.enemyY = 1.0;
        game.enemyDir = -1;
        game.roundFinished = false;
        game.arrows = [];
        updateArrowsDisplay();
        render();
      }
    }, 1000);
  }

  // ========== 局结束 ==========
  function endRound(win) {
    if (game.roundFinished) return;
    game.roundFinished = true;
    game.status = "roundEnd";
    game.roundWin = win;

    setButtonsEnabled(false);

    if (win) {
      const config = ROUND_CONFIGS[game.round];
      game.score += config.score;
      scoreDisplay.textContent = game.score;
      playSound("correct");
    } else {
      playSound("wrong");
    }

    render();

    setTimeout(() => {
      game.round++;
      if (game.round >= TOTAL_ROUNDS) {
        game.status = "gameOver";
        setButtonsEnabled(false);
        render();
        showGameComplete();
      } else {
        setupRound(game.round);
        startCountdown();
      }
    }, 1500);
  }

  // ========== 显示游戏结束 ==========
  function showGameComplete() {
    setButtonsEnabled(false);

    const existing = document.querySelector(".game-result-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "game-result-overlay";
    overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            backdrop-filter: blur(8px);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
    overlay.innerHTML = `
            <div style="
                background: linear-gradient(145deg, #1a472a, #0e2a1a);
                border-radius: 60px;
                padding: 40px 50px;
                text-align: center;
                border: 3px solid #ffaa33;
                max-width: 400px;
                width: 85%;
                box-shadow: 0 30px 60px rgba(0,0,0,0.5);
            ">
                <h2 style="color: #FFE484; font-size: 2.2rem; margin: 0 0 10px;">🏆 游戏结束</h2>
                <p style="color: #ffaa33; font-size: 2.5rem; font-weight: bold; margin: 10px 0;">
                    ${game.score} / ${MAX_SCORE}
                </p>
                <div style="display: flex; gap: 15px; justify-content: center; margin-top: 25px; flex-wrap: wrap;">
                    <button id="resultRestartBtn" style="
                        background: #4CAF50;
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 40px;
                        font-size: 1.1rem;
                        font-weight: bold;
                        cursor: pointer;
                        font-family: inherit;
                        box-shadow: 0 4px 0 #2e7d32;
                    "><i class="fas fa-redo"></i> 再来一局</button>
                    <button id="resultHomeBtn" style="
                        background: #607d8b;
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 40px;
                        font-size: 1.1rem;
                        font-weight: bold;
                        cursor: pointer;
                        font-family: inherit;
                        box-shadow: 0 4px 0 #455a64;
                    "><i class="fas fa-home"></i> 返回首页</button>
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

  // ========== 设置按钮状态 ==========
  function setButtonsEnabled(enabled) {
    fireBtn.disabled = !enabled || game.arrowsRemaining === 0;
  }

  // ========== 更新箭数显示 ==========
  function updateArrowsDisplay() {
    if (game.arrowsRemaining === Infinity) {
      arrowsDisplay.textContent = "🏹 箭数: ∞";
    } else {
      arrowsDisplay.textContent = `🏹 箭数: ${game.arrowsRemaining}`;
    }
    if (game.arrowsRemaining === 0) {
      fireBtn.disabled = true;
    } else {
      fireBtn.disabled = false;
    }
  }

  // ========== 设置当前局 ==========
  function setupRound(roundIndex) {
    const config = ROUND_CONFIGS[roundIndex];
    game.round = roundIndex;
    game.movable = config.movable;
    game.fixedY = config.fixedY;
    game.maxArrows = config.arrows;
    game.arrowsRemaining = config.arrows;

    if (!game.movable && game.fixedY !== null) {
      game.playerY = game.fixedY;
    } else {
      game.playerY = 0.5;
    }

    roundDisplay.textContent = game.round + 1;
    updateArrowsDisplay();

    game.arrows = [];
    game.enemyY = 1.0;
    game.enemyDir = -1;
    game.roundFinished = false;

    render();
  }

  // ========== 重置游戏 ==========
  function resetGame() {
    game.score = 0;
    game.round = 0;
    scoreDisplay.textContent = "0";

    const existing = document.querySelector(".game-result-overlay");
    if (existing) existing.remove();

    setupRound(0);
    startCountdown();
  }

  // ========== 发射弓箭 ==========
  function fireArrow() {
    if (game.status !== "playing") return;
    if (game.arrowsRemaining === 0) return;

    if (game.arrowsRemaining !== Infinity) {
      game.arrowsRemaining--;
      updateArrowsDisplay();
      if (game.arrowsRemaining === 0) {
        fireBtn.disabled = true;
        setTimeout(() => {
          if (!game.roundFinished && game.arrowsRemaining === 0) {
            endRound(false);
          }
        }, 500);
      }
    }

    const topMargin = 20;
    const bottomMargin = 20;
    const flagPathPixels = game.H - topMargin - bottomMargin - FLAG_HEIGHT;
    const playerPx = topMargin + game.playerY * flagPathPixels;
    const startX = PLAYER_POLE_X + 5;
    const startY = playerPx + FLAG_HEIGHT / 2;

    const endY = startY + (Math.random() - 0.5) * 30;

    const arrow = {
      startX: startX,
      startY: startY,
      endY: endY,
      currentX: startX,
      currentY: startY,
      startTime: performance.now() / 1000,
      hit: false,
    };
    game.arrows.push(arrow);
  }

  // ========== 玩家移动（拖拽） ==========
  function updatePlayerPosition(y) {
    const topMargin = 20;
    const bottomMargin = 20;
    const flagPathPixels = game.H - topMargin - bottomMargin - FLAG_HEIGHT;
    let normalized = (y - topMargin) / flagPathPixels;
    normalized = Math.max(0, Math.min(1, normalized));
    game.playerY = normalized;
    render();
  }

  // ========== 事件绑定 ==========
  fireBtn.addEventListener("click", fireArrow);

  // 触摸/鼠标拖拽
  canvas.addEventListener("mousedown", (e) => {
    if (game.status !== "playing") return;
    if (!game.movable) return;
    const rect = canvas.getBoundingClientRect();
    const scaleY = canvas.height / rect.height;
    const y = (e.clientY - rect.top) * scaleY;
    game.isPointerDown = true;
    updatePlayerPosition(y);
  });

  canvas.addEventListener("mousemove", (e) => {
    if (!game.isPointerDown) return;
    if (game.status !== "playing") return;
    if (!game.movable) return;
    const rect = canvas.getBoundingClientRect();
    const scaleY = canvas.height / rect.height;
    const y = (e.clientY - rect.top) * scaleY;
    updatePlayerPosition(y);
  });

  canvas.addEventListener("mouseup", () => {
    game.isPointerDown = false;
  });

  canvas.addEventListener("mouseleave", () => {
    game.isPointerDown = false;
  });

  // 触摸事件（禁用系统手势）
  canvas.style.touchAction = "none";

  canvas.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (game.status !== "playing") return;
      if (!game.movable) return;
      const touch = e.touches[0];
      if (!touch) return;
      const rect = canvas.getBoundingClientRect();
      const scaleY = canvas.height / rect.height;
      const y = (touch.clientY - rect.top) * scaleY;
      game.isPointerDown = true;
      updatePlayerPosition(y);
    },
    { passive: false },
  );

  canvas.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!game.isPointerDown) return;
      if (game.status !== "playing") return;
      if (!game.movable) return;
      const touch = e.touches[0];
      if (!touch) return;
      const rect = canvas.getBoundingClientRect();
      const scaleY = canvas.height / rect.height;
      const y = (touch.clientY - rect.top) * scaleY;
      updatePlayerPosition(y);
    },
    { passive: false },
  );

  canvas.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      game.isPointerDown = false;
    },
    { passive: false },
  );

  canvas.addEventListener(
    "touchcancel",
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      game.isPointerDown = false;
    },
    { passive: false },
  );

  // 悬浮返回按钮
  if (floatingBtn) {
    floatingBtn.addEventListener("click", goHome);
  }

  // ========== 窗口尺寸变化 ==========
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      render();
    }, 200);
  });

  // ========== 启动游戏 ==========
  function initGame() {
    resizeCanvas();
    getAudioContext();
    resetGame();
    if (game.animId) cancelAnimationFrame(game.animId);
    lastTime = 0;
    game.animId = requestAnimationFrame(gameLoop);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGame);
  } else {
    initGame();
  }

  window.resetArrowGame = resetGame;
})();

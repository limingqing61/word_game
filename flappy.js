(function () {
  // ========== 游戏配置 ==========
  let CANVAS_WIDTH = 450;
  let CANVAS_HEIGHT = 600;
  const GRAVITY = 0.2;
  const JUMP_POWER = -4.5;
  const PIPE_WIDTH = 60;
  const PIPE_GAP = 130;
  const BASE_PIPE_SPACING = 200; // 基础间距稍微增大
  const MAX_PIPE_SPACING = 380; // 最大间距增大
  const PIPE_SPEED = 2;
  const BIRD_SIZE = 32;
  const MAX_HEIGHT_CHANGE = 120; // 最大高度变化增大

  // DOM 元素
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const scoreSpan = document.getElementById("scoreValue");
  const bestSpan = document.getElementById("bestValue");
  const bestBox = document.getElementById("bestBox");
  const pauseBtn = document.getElementById("pauseBtn");
  const homeBtn = document.getElementById("homeBtn");

  // ========== 游戏状态 ==========
  let gameActive = false;
  let isPaused = false;
  let isGameOver = false;
  let isCountdown = false;

  let bird = {
    x: 80,
    y: 300,
    vy: 0,
    rotation: 0,
  };

  let pipes = [];
  let score = 0;
  let bestScore = 0;
  let frameId = null;
  let countdownValue = 3;

  // 图片资源
  let birdImg = null;
  let pipeImg = null;
  let groundImg = null;
  let imagesLoaded = 0;
  let totalImages = 3;

  // 存储 key
  const SCORE_KEY = "flappy_score";
  const BEST_KEY = "flappy_best";

  // 三击删除相关
  let clickCount = 0;
  let clickTimer = null;

  // ========== 加载图片 ==========
  function loadImages(callback) {
    birdImg = new Image();
    pipeImg = new Image();
    groundImg = new Image();

    let loaded = 0;
    function checkComplete() {
      loaded++;
      if (loaded === totalImages) callback();
    }

    birdImg.onload = checkComplete;
    pipeImg.onload = checkComplete;
    groundImg.onload = checkComplete;
    birdImg.onerror = checkComplete;
    pipeImg.onerror = checkComplete;
    groundImg.onerror = checkComplete;

    birdImg.src = "images/bird.jpeg";
    pipeImg.src = "images/tree.jpeg";
    groundImg.src = "images/grass.jpeg";

    setTimeout(() => {
      if (loaded < totalImages) {
        console.warn("图片加载超时，使用备用颜色");
        callback();
      }
    }, 2000);
  }

  // ========== 分数存储 ==========
  function loadScore() {
    const savedScore = localStorage.getItem(SCORE_KEY);
    if (savedScore && !isNaN(parseInt(savedScore))) {
      score = parseInt(savedScore);
    } else {
      score = 0;
    }
    const savedBest = localStorage.getItem(BEST_KEY);
    if (savedBest && !isNaN(parseInt(savedBest))) {
      bestScore = parseInt(savedBest);
    } else {
      bestScore = 0;
    }
    updateScoreUI();
  }

  function saveScore() {
    localStorage.setItem(SCORE_KEY, score);
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem(BEST_KEY, bestScore);
      updateScoreUI();
    }
  }

  function updateScoreUI() {
    scoreSpan.textContent = score;
    bestSpan.textContent = bestScore;
  }

  // 三击删除最高记录
  function bindTripleClick() {
    bestBox.addEventListener("click", (e) => {
      e.stopPropagation();
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 500);
      if (clickCount >= 3) {
        clickCount = 0;
        if (confirm("确认清除最高记录吗？")) {
          bestScore = 0;
          localStorage.setItem(BEST_KEY, "0");
          updateScoreUI();
          const msg = document.createElement("div");
          msg.textContent = "✅ 最高记录已清除";
          msg.style.cssText =
            "position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.7); color:white; padding:8px 16px; border-radius:30px; z-index:200; font-size:0.9rem;";
          document.body.appendChild(msg);
          setTimeout(() => msg.remove(), 1500);
        }
      }
    });
    // iPad 触摸支持
    bestBox.addEventListener("touchstart", (e) => {
      e.preventDefault();
      e.stopPropagation();
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 500);
      if (clickCount >= 3) {
        clickCount = 0;
        if (confirm("确认清除最高记录吗？")) {
          bestScore = 0;
          localStorage.setItem(BEST_KEY, "0");
          updateScoreUI();
          const msg = document.createElement("div");
          msg.textContent = "✅ 最高记录已清除";
          msg.style.cssText =
            "position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.7); color:white; padding:8px 16px; border-radius:30px; z-index:200; font-size:0.9rem;";
          document.body.appendChild(msg);
          setTimeout(() => msg.remove(), 1500);
        }
      }
    });
  }

  // ========== 游戏逻辑 ==========
  function generatePipe(prevPipe) {
    const minHeight = 60;
    const maxHeight = CANVAS_HEIGHT - PIPE_GAP - minHeight;
    let topHeight;
    let spacing = BASE_PIPE_SPACING;

    if (prevPipe) {
      // 调整变化概率：增加极端变化的几率
      let change;
      const rand = Math.random();

      if (rand < 0.35) {
        // 35% 几率出现极端变化（大起大落）- 原20%
        // 变化范围 80-120 像素
        change = (Math.random() - 0.5) * 200;
      } else if (rand < 0.6) {
        // 25% 几率中等变化 - 原30%
        // 变化范围 40-80 像素
        change = (Math.random() - 0.5) * 120;
      } else {
        // 40% 几率小变化（平滑）- 原50%
        // 变化范围 0-40 像素
        change = (Math.random() - 0.5) * 60;
      }

      let newHeight = prevPipe.topHeight + change;
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
      topHeight = newHeight;

      // 高度变化越大，间距越大（确保可玩性）
      const actualChange = Math.abs(topHeight - prevPipe.topHeight);
      if (actualChange > 70) {
        // 大落差：间距增加 60-100
        spacing = BASE_PIPE_SPACING + 60 + Math.floor(Math.random() * 50);
      } else if (actualChange > 35) {
        // 中等落差：间距增加 30-60
        spacing = BASE_PIPE_SPACING + 30 + Math.floor(Math.random() * 35);
      } else {
        // 小平滑：间距增加 10-25
        spacing = BASE_PIPE_SPACING + 10 + Math.floor(Math.random() * 20);
      }
      spacing = Math.min(
        MAX_PIPE_SPACING,
        Math.max(BASE_PIPE_SPACING, spacing),
      );
    } else {
      // 第一根柱子随机
      topHeight = Math.floor(
        Math.random() * (maxHeight - minHeight + 1) + minHeight,
      );
    }

    return {
      x: CANVAS_WIDTH,
      topHeight: topHeight,
      bottomY: topHeight + PIPE_GAP,
      counted: false,
      spacing: spacing,
    };
  }

  function resetGame() {
    bird.y = CANVAS_HEIGHT / 2;
    bird.vy = 0;
    bird.rotation = 0;
    pipes = [];
    let lastPipe = null;
    let lastX = CANVAS_WIDTH;
    for (let i = 0; i < 3; i++) {
      const pipe = generatePipe(lastPipe);
      const spacing = lastPipe ? lastPipe.spacing : BASE_PIPE_SPACING;
      pipe.x = lastX + spacing;
      lastX = pipe.x;
      lastPipe = pipe;
      pipes.push(pipe);
    }
    score = 0;
    updateScoreUI();
    gameActive = true;
    isGameOver = false;
    isPaused = false;
  }

  function jump() {
    if (!gameActive || isPaused || isCountdown) return;
    bird.vy = JUMP_POWER;
    bird.rotation = -20;
  }

  function update() {
    if (!gameActive || isPaused) return;

    bird.vy += GRAVITY;
    bird.y += bird.vy;

    if (bird.vy < 0) {
      bird.rotation = Math.min(bird.rotation + 2, 20);
    } else {
      bird.rotation = Math.max(bird.rotation - 2, -30);
    }

    if (
      bird.y - BIRD_SIZE / 2 <= 0 ||
      bird.y + BIRD_SIZE / 2 >= CANVAS_HEIGHT - 50
    ) {
      gameOver();
      return;
    }

    for (let i = 0; i < pipes.length; i++) {
      pipes[i].x -= PIPE_SPEED;
    }
    pipes = pipes.filter((p) => p.x + PIPE_WIDTH > 0);

    let lastPipe = pipes[pipes.length - 1];
    if (lastPipe && lastPipe.x + PIPE_WIDTH < CANVAS_WIDTH - lastPipe.spacing) {
      const newPipe = generatePipe(lastPipe);
      newPipe.x = lastPipe.x + lastPipe.spacing;
      pipes.push(newPipe);
    }

    const birdLeft = bird.x - BIRD_SIZE / 2;
    const birdRight = bird.x + BIRD_SIZE / 2;
    const birdTop = bird.y - BIRD_SIZE / 2;
    const birdBottom = bird.y + BIRD_SIZE / 2;

    for (let pipe of pipes) {
      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + PIPE_WIDTH;

      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < pipe.topHeight || birdBottom > pipe.bottomY) {
          gameOver();
          return;
        }
      }

      if (!pipe.counted && pipe.x + PIPE_WIDTH < bird.x) {
        pipe.counted = true;
        score++;
        updateScoreUI();
        saveScore();
      }
    }

    render();
    frameId = requestAnimationFrame(update);
  }

  function gameOver() {
    gameActive = false;
    isGameOver = true;
    if (frameId) cancelAnimationFrame(frameId);
    saveScore();
    showGameOverOverlay();
  }

  function showGameOverOverlay() {
    removeOverlay("gameover-overlay");

    const overlay = document.createElement("div");
    overlay.className = "gameover-overlay";
    overlay.style.cssText =
      "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:200; color:white; text-align:center;";
    overlay.innerHTML = `
            <h2 style="font-size:2rem; margin-bottom:20px;">💀 游戏结束 💀</h2>
            <p style="font-size:1.5rem">得分: ${score}</p>
            <p style="font-size:1rem">最佳: ${bestScore}</p>
            <button id="restartBtn" style="background:#ffaa33; border:none; padding:12px 30px; font-size:1.2rem; border-radius:40px; font-weight:bold; margin:10px; cursor:pointer; pointer-events:auto;">🎮 再飞一次</button>
            <button id="homeBtnOverlay" style="background:#ffaa33; border:none; padding:12px 30px; font-size:1.2rem; border-radius:40px; font-weight:bold; margin:10px; cursor:pointer; pointer-events:auto;">🏠 返回主页</button>
        `;
    document.querySelector(".game-container").appendChild(overlay);

    // 同时绑定 click 和 touchstart
    const restartBtn = document.getElementById("restartBtn");
    const homeBtnOverlay = document.getElementById("homeBtnOverlay");

    function onRestart(e) {
      e.preventDefault();
      e.stopPropagation();
      overlay.remove();
      startCountdown();
    }
    function onHome(e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "index.html";
    }

    if (restartBtn) {
      restartBtn.onclick = onRestart;
      restartBtn.ontouchstart = onRestart;
    }
    if (homeBtnOverlay) {
      homeBtnOverlay.onclick = onHome;
      homeBtnOverlay.ontouchstart = onHome;
    }
  }

  function showPauseOverlay() {
    if (isGameOver || isCountdown) return;

    removeOverlay("pause-overlay");

    const overlay = document.createElement("div");
    overlay.className = "pause-overlay";
    overlay.style.cssText =
      "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; flex-direction:column; justify-content:center; align-items:center; z-index:200; color:white; text-align:center;";
    overlay.innerHTML = `
            <h2 style="font-size:2rem; margin-bottom:20px;">⏸️ 暂停中</h2>
            <button id="resumeBtn" style="background:#ffaa33; border:none; padding:12px 30px; font-size:1.2rem; border-radius:40px; font-weight:bold; margin:10px; cursor:pointer; pointer-events:auto;">▶️ 继续</button>
            <button id="restartBtnPause" style="background:#ffaa33; border:none; padding:12px 30px; font-size:1.2rem; border-radius:40px; font-weight:bold; margin:10px; cursor:pointer; pointer-events:auto;">🔄 重新开始</button>
            <button id="homeBtnPause" style="background:#ffaa33; border:none; padding:12px 30px; font-size:1.2rem; border-radius:40px; font-weight:bold; margin:10px; cursor:pointer; pointer-events:auto;">🏠 返回主页</button>
        `;
    document.querySelector(".game-container").appendChild(overlay);

    const resumeBtn = document.getElementById("resumeBtn");
    const restartBtnPause = document.getElementById("restartBtnPause");
    const homeBtnPause = document.getElementById("homeBtnPause");

    function onResume(e) {
      e.preventDefault();
      e.stopPropagation();
      overlay.remove();
      isPaused = false;
      gameActive = true;
      frameId = requestAnimationFrame(update);
    }
    function onRestart(e) {
      e.preventDefault();
      e.stopPropagation();
      overlay.remove();
      startCountdown();
    }
    function onHome(e) {
      e.preventDefault();
      e.stopPropagation();
      window.location.href = "index.html";
    }

    if (resumeBtn) {
      resumeBtn.onclick = onResume;
      resumeBtn.ontouchstart = onResume;
    }
    if (restartBtnPause) {
      restartBtnPause.onclick = onRestart;
      restartBtnPause.ontouchstart = onRestart;
    }
    if (homeBtnPause) {
      homeBtnPause.onclick = onHome;
      homeBtnPause.ontouchstart = onHome;
    }
  }

  function removeOverlay(className) {
    const existing = document.querySelector(`.${className}`);
    if (existing) existing.remove();
  }

  function startCountdown() {
    if (frameId) cancelAnimationFrame(frameId);

    isCountdown = true;
    gameActive = false;
    isPaused = false;
    isGameOver = false;
    countdownValue = 3;

    resetGame();

    removeOverlay("countdownOverlay");

    const overlay = document.createElement("div");
    overlay.className = "countdownOverlay";
    overlay.style.cssText =
      "position:absolute; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; justify-content:center; align-items:center; z-index:150;";
    overlay.innerHTML = `<div class="countdown" style="font-size:4rem; font-weight:bold; animation:pulse 0.5s infinite;">3</div>`;
    document.querySelector(".game-container").appendChild(overlay);

    const countdownInterval = setInterval(() => {
      countdownValue--;
      if (countdownValue > 0) {
        const cd = overlay.querySelector(".countdown");
        if (cd) cd.textContent = countdownValue;
      } else if (countdownValue === 0) {
        const cd = overlay.querySelector(".countdown");
        if (cd) cd.textContent = "GO!";
        setTimeout(() => {
          overlay.remove();
          isCountdown = false;
          gameActive = true;
          frameId = requestAnimationFrame(update);
        }, 500);
        clearInterval(countdownInterval);
      }
    }, 1000);
  }

  // ========== 尺寸自适应 ==========
  function resizeCanvas() {
    const container = document.querySelector(".game-container");
    const rect = container.getBoundingClientRect();
    CANVAS_WIDTH = rect.width;
    CANVAS_HEIGHT = rect.height;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    bird.x = Math.min(80, CANVAS_WIDTH * 0.2);
    bird.y = CANVAS_HEIGHT / 2;
  }

  // ========== 渲染 ==========
  function render() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, "#87CEEB");
    gradient.addColorStop(1, "#E0F6FF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.ellipse(80, 70, 40, 30, 0, 0, Math.PI * 2);
    ctx.ellipse(110, 60, 35, 28, 0, 0, Math.PI * 2);
    ctx.ellipse(140, 70, 40, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(350, 120, 50, 35, 0, 0, Math.PI * 2);
    ctx.ellipse(390, 105, 45, 30, 0, 0, Math.PI * 2);
    ctx.ellipse(430, 120, 50, 35, 0, 0, Math.PI * 2);
    ctx.fill();

    for (let pipe of pipes) {
      if (pipeImg && pipeImg.complete && pipeImg.naturalWidth > 0) {
        ctx.drawImage(pipeImg, pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        ctx.drawImage(
          pipeImg,
          pipe.x,
          pipe.bottomY,
          PIPE_WIDTH,
          CANVAS_HEIGHT - pipe.bottomY,
        );
      } else {
        ctx.fillStyle = "#228B22";
        ctx.fillRect(pipe.x, 0, PIPE_WIDTH, pipe.topHeight);
        ctx.fillRect(
          pipe.x,
          pipe.bottomY,
          PIPE_WIDTH,
          CANVAS_HEIGHT - pipe.bottomY,
        );
        ctx.fillStyle = "#8B4513";
        ctx.fillRect(pipe.x - 5, pipe.topHeight - 30, PIPE_WIDTH + 10, 30);
        ctx.fillRect(pipe.x - 5, pipe.bottomY, PIPE_WIDTH + 10, 30);
      }
    }

    if (groundImg && groundImg.complete && groundImg.naturalWidth > 0) {
      ctx.drawImage(groundImg, 0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
    } else {
      ctx.fillStyle = "#8B6914";
      ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 50);
      ctx.fillStyle = "#C99E3E";
      ctx.fillRect(0, CANVAS_HEIGHT - 50, CANVAS_WIDTH, 10);
    }

    ctx.save();
    ctx.translate(bird.x, bird.y);
    ctx.rotate((bird.rotation * Math.PI) / 180);
    if (birdImg && birdImg.complete && birdImg.naturalWidth > 0) {
      ctx.drawImage(
        birdImg,
        -BIRD_SIZE / 2,
        -BIRD_SIZE / 2,
        BIRD_SIZE,
        BIRD_SIZE,
      );
    } else {
      ctx.fillStyle = "#FF6B6B";
      ctx.fillRect(-BIRD_SIZE / 2, -BIRD_SIZE / 2, BIRD_SIZE, BIRD_SIZE);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(-BIRD_SIZE / 2 + 5, -BIRD_SIZE / 2 + 5, 6, 6);
      ctx.fillRect(BIRD_SIZE / 2 - 11, -BIRD_SIZE / 2 + 5, 6, 6);
      ctx.fillStyle = "#000000";
      ctx.fillRect(-BIRD_SIZE / 2 + 6, -BIRD_SIZE / 2 + 6, 3, 3);
      ctx.fillRect(BIRD_SIZE / 2 - 10, -BIRD_SIZE / 2 + 6, 3, 3);
    }
    ctx.restore();
  }

  // ========== 事件绑定 ==========
  function bindEvents() {
    const container = document.querySelector(".game-container");

    container.addEventListener("click", (e) => {
      e.preventDefault();
      jump();
    });
    container.addEventListener("touchstart", (e) => {
      e.preventDefault();
      jump();
    });

    // 暂停按钮 - 同时绑定 click 和 touchstart
    function onPause(e) {
      e.preventDefault();
      e.stopPropagation();
      if (!gameActive || isGameOver || isCountdown) return;
      if (frameId) cancelAnimationFrame(frameId);
      isPaused = true;
      gameActive = false;
      showPauseOverlay();
    }
    pauseBtn.onclick = onPause;
    pauseBtn.ontouchstart = onPause;

    // 主页按钮
    function onHome(e) {
      e.preventDefault();
      e.stopPropagation();
      if (gameActive && !isGameOver && !isPaused) saveScore();
      window.location.href = "index.html";
    }
    homeBtn.onclick = onHome;
    homeBtn.ontouchstart = onHome;

    window.addEventListener("beforeunload", () => {
      if (gameActive && !isGameOver && !isPaused) saveScore();
    });
    window.addEventListener("resize", () => {
      resizeCanvas();
      if (!isGameOver && !isCountdown && gameActive) {
        render();
      }
    });
  }

  // ========== 启动游戏 ==========
  function init() {
    resizeCanvas();
    loadScore();
    bindTripleClick();
    bindEvents();

    loadImages(() => {
      startCountdown();
    });
  }

  init();
})();

(function () {
  "use strict";

  // ========== 配置 ==========
  const ROWS = 7;
  const COLS = 8;
  const TOTAL_CELLS = ROWS * COLS;

  const THREADS = [
    {
      id: 0,
      animal: "rat",
      emoji: "🐀",
      label: "老鼠",
      score: 1,
      interval: 2.5,
      stayDuration: 0.8,
      count: 17,
    },
    {
      id: 1,
      animal: "hamster",
      emoji: "🐹",
      label: "仓鼠",
      score: 2,
      interval: 2.5,
      stayDuration: 1.0,
      count: 16,
    },
    {
      id: 2,
      animal: "squirrel",
      emoji: "🐿️",
      label: "松鼠",
      score: 3,
      interval: 2.5,
      stayDuration: 1.2,
      count: 17,
    },
  ];

  const TOTAL_SCORE = 17 * 1 + 16 * 2 + 17 * 3;
  const TOTAL_HITS = 17 + 16 + 17;

  // ========== DOM ==========
  const gridContainer = document.getElementById("gridContainer");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const remainingDisplay = document.getElementById("remainingDisplay");
  const startOverlay = document.getElementById("startOverlay");
  const startBtn = document.getElementById("startBtn");
  const gameContainer = document.getElementById("gameContainer");
  const floatingBtn = document.getElementById("floatingHomeBtn");

  // ========== 游戏状态 ==========
  let score = 0;
  let remaining = TOTAL_HITS;
  let cells = [];
  let activeMoles = {};
  let threadTimers = [];
  let gameActive = false;
  let isGameOver = false;
  let started = false;
  let completedThreads = 0;

  // ========== 音效 ==========
  function playHitSound() {
    playSound("correct");
  }

  function playGameOverSound() {
    playSound("correct");
  }

  // ========== 网格 ==========
  function initGrid() {
    gridContainer.innerHTML = "";
    cells = [];
    for (let r = 0; r < ROWS; r++) {
      cells[r] = [];
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = r;
        cell.dataset.col = c;

        const back = document.createElement("span");
        back.className = "back";
        back.textContent = "?";
        cell.appendChild(back);

        cell.addEventListener("click", () => onCellClick(r, c));
        cell.addEventListener("touchstart", (e) => {
          e.preventDefault();
          onCellClick(r, c);
        });

        gridContainer.appendChild(cell);
        cells[r][c] = {
          element: cell,
          isUp: false,
          animal: null,
          threadId: null,
          backEl: back,
          imgEl: null,
        };
      }
    }
  }

  // ========== 地鼠 ==========
  function showMole(row, col, threadId, animal) {
    const cell = cells[row][col];
    if (!cell || cell.isUp) return false;

    cell.backEl.style.display = "none";

    const img = document.createElement("img");
    img.src = `images/${animal}.jpeg`;
    img.alt = animal;
    img.onerror = () => {
      img.style.display = "none";
      const fallback = document.createElement("span");
      fallback.textContent = "🐾";
      fallback.style.fontSize = "2rem";
      cell.element.appendChild(fallback);
    };
    cell.element.appendChild(img);
    cell.imgEl = img;
    cell.isUp = true;
    cell.animal = animal;
    cell.threadId = threadId;

    const key = `${row},${col}`;
    activeMoles[key] = { threadId, animal };

    return true;
  }

  function hideMole(row, col) {
    const cell = cells[row][col];
    if (!cell || !cell.isUp) return;

    if (cell.imgEl) {
      cell.imgEl.remove();
      cell.imgEl = null;
    }
    const fallback = cell.element.querySelector("span:not(.back)");
    if (fallback) fallback.remove();

    cell.backEl.style.display = "";
    cell.isUp = false;
    cell.animal = null;
    cell.threadId = null;

    const key = `${row},${col}`;
    delete activeMoles[key];
  }

  function getRandomEmptyCell() {
    const empty = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!cells[r][c].isUp) {
          empty.push([r, c]);
        }
      }
    }
    if (empty.length === 0) return null;
    const idx = Math.floor(Math.random() * empty.length);
    return empty[idx];
  }

  // ========== 线程 ==========
  function runThread(threadConfig) {
    let count = 0;
    const {
      id,
      animal,
      interval,
      stayDuration,
      count: maxCount,
    } = threadConfig;

    function scheduleNext() {
      if (!gameActive || isGameOver || count >= maxCount) {
        if (count >= maxCount) {
          completedThreads++;
          if (completedThreads >= THREADS.length) {
            setTimeout(waitForAllMolesToHide, 500);
          }
        }
        return;
      }

      const pos = getRandomEmptyCell();
      if (pos) {
        const [row, col] = pos;
        showMole(row, col, id, animal);
        const timer = setTimeout(() => {
          hideMole(row, col);
        }, stayDuration * 1000);
        const key = `${row},${col}`;
        if (activeMoles[key]) {
          activeMoles[key].timer = timer;
        }
      }

      count++;
      if (count < maxCount) {
        const timerId = setTimeout(scheduleNext, interval * 1000);
        threadTimers.push(timerId);
      } else {
        completedThreads++;
        if (completedThreads >= THREADS.length) {
          setTimeout(waitForAllMolesToHide, 500);
        }
      }
    }

    scheduleNext();
  }

  function waitForAllMolesToHide() {
    let hasMoles = false;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (cells[r][c].isUp) {
          hasMoles = true;
          break;
        }
      }
      if (hasMoles) break;
    }

    if (hasMoles) {
      setTimeout(waitForAllMolesToHide, 200);
    } else {
      endGame();
    }
  }

  // ========== 点击 ==========
  function onCellClick(row, col) {
    if (!gameActive || isGameOver) return;

    const cell = cells[row][col];
    if (!cell.isUp) return;

    const key = `${row},${col}`;
    const mole = activeMoles[key];
    if (!mole) return;

    const thread = THREADS.find((t) => t.id === mole.threadId);
    const points = thread ? thread.score : 1;

    if (mole.timer) {
      clearTimeout(mole.timer);
    }

    hideMole(row, col);
    delete activeMoles[key];

    score += points;
    remaining--;
    updateUI();

    playHitSound();

    const rect = cell.element.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    showExplosion(cx, cy);

    if (remaining <= 0) {
      endGame();
    }
  }

  // ========== 爆炸 ==========
  function showExplosion(x, y) {
    const el = document.createElement("div");
    el.className = "explosion-effect";
    el.textContent = "💥";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 500);
  }

  // ========== UI ==========
  function updateUI() {
    scoreDisplay.textContent = score;
    remainingDisplay.textContent = remaining;
  }

  // ========== 结束 ==========
  function endGame() {
    if (isGameOver) return;
    isGameOver = true;
    gameActive = false;

    for (const timer of threadTimers) {
      clearTimeout(timer);
    }
    threadTimers = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        hideMole(r, c);
      }
    }
    activeMoles = {};

    playGameOverSound();
    showResult();
  }

  function showResult() {
    const existing = document.querySelector(".result-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "result-overlay";

    const isPerfect = score === TOTAL_SCORE;
    const emoji = isPerfect
      ? "🏆"
      : score >= 70
        ? "🎉"
        : score >= 40
          ? "😊"
          : "💪";

    overlay.innerHTML = `
            <div class="result-card">
                <h2>${emoji} 游戏结束 ${emoji}</h2>
                <div class="final-label">最终得分</div>
                <div class="final-score">${score} / ${TOTAL_SCORE}</div>
                ${isPerfect ? '<div style="color:#ff6b6b; font-size:1.2rem; font-weight:bold;">🌟 满分通关！太棒了！ 🌟</div>' : ""}
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

  // ========== 重置 ==========
  function resetGame() {
    score = 0;
    remaining = TOTAL_HITS;
    completedThreads = 0;
    isGameOver = false;
    gameActive = false;
    started = false;

    for (const timer of threadTimers) {
      clearTimeout(timer);
    }
    threadTimers = [];

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        hideMole(r, c);
      }
    }
    activeMoles = {};

    initGrid();
    updateUI();

    startOverlay.style.display = "flex";
    gameContainer.style.display = "none";
  }

  // ========== 启动 ==========
  function startGame() {
    startOverlay.style.display = "none";
    gameContainer.style.display = "block";

    // 滚动到网格区域
    const gridWrapper = document.querySelector(".grid-wrapper");
    if (gridWrapper) {
      setTimeout(() => {
        gridWrapper.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }

    // 倒计时
    let countdown = 3;
    const cdOverlay = document.createElement("div");
    cdOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.6); z-index: 10000;
            display: flex; align-items: center; justify-content: center;
            font-size: 6rem; font-weight: bold; color: #FFE484;
            text-shadow: 4px 4px 0 #B45309;
            pointer-events: none;
        `;
    cdOverlay.textContent = "3";
    document.body.appendChild(cdOverlay);

    const cdInterval = setInterval(() => {
      countdown--;
      if (countdown > 0) {
        cdOverlay.textContent = countdown;
      } else {
        cdOverlay.textContent = "GO!";
        setTimeout(() => {
          cdOverlay.remove();
          clearInterval(cdInterval);
          startGameplay();
        }, 500);
      }
    }, 1000);

    // 重置状态
    score = 0;
    remaining = TOTAL_HITS;
    completedThreads = 0;
    isGameOver = false;
    gameActive = false;
    started = true;

    initGrid();
    updateUI();
  }

  function startGameplay() {
    gameActive = true;

    for (const timer of threadTimers) clearTimeout(timer);
    threadTimers = [];
    activeMoles = {};
    completedThreads = 0;

    // 按分值排序，从低到高启动
    const sortedThreads = [...THREADS].sort((a, b) => a.score - b.score);
    const staggeredDelays = [0, 800, 1600];

    sortedThreads.forEach((thread, idx) => {
      const delay = staggeredDelays[idx];
      const timerId = setTimeout(() => {
        if (gameActive && !isGameOver) {
          runThread(thread);
        }
      }, delay);
      threadTimers.push(timerId);
    });
  }

  // ========== 事件 ==========
  startBtn.addEventListener("click", startGame);

  if (floatingBtn) {
    floatingBtn.addEventListener("click", goHome);
  }

  // ========== 初始化 ==========
  initGrid();
  updateUI();
})();

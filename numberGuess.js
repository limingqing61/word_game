(function () {
  "use strict";

  // ========== 配置 ==========
  const DIFFICULTY_CONFIG = {
    easy: { digits: 2, label: "简单", key: "easy" },
    medium: { digits: 3, label: "普通", key: "medium" },
    hard: { digits: 4, label: "困难", key: "hard" },
  };

  const BEST_KEY_PREFIX = "numberGuess_best_";

  // ========== DOM ==========
  const guessCountEl = document.getElementById("guessCount");
  const bestDisplay = document.getElementById("bestDisplay");
  const bestBox = document.getElementById("bestBox");
  const guessDisplay = document.getElementById("guessDisplay");
  const numpad = document.getElementById("numpad");
  const historyList = document.getElementById("historyList");
  const historyPanel = document.getElementById("historyPanel");
  const startOverlay = document.getElementById("startOverlay");
  const startBtn = document.getElementById("startBtn");
  const gameContainer = document.getElementById("gameContainer");
  const backHomeBtn = document.getElementById("backHomeBtn");
  const diffBtns = document.querySelectorAll(".difficulty-btn");

  // ========== 游戏状态 ==========
  let currentDifficulty = "medium";
  let digitCount = 3;
  let secretNumber = [];
  let currentGuess = [];
  let guessCount = 0;
  let history = [];
  let gameActive = false;
  let isGameOver = false;
  let bestRecords = {};

  // ========== 最佳记录 ==========
  function loadBestRecords() {
    for (const [key, config] of Object.entries(DIFFICULTY_CONFIG)) {
      const stored = localStorage.getItem(BEST_KEY_PREFIX + config.key);
      if (stored) {
        const val = parseInt(stored);
        if (!isNaN(val)) {
          bestRecords[config.key] = val;
        }
      }
    }
    updateBestDisplay();
  }

  function saveBestRecord(difficultyKey, guesses) {
    if (!bestRecords[difficultyKey] || guesses < bestRecords[difficultyKey]) {
      bestRecords[difficultyKey] = guesses;
      localStorage.setItem(BEST_KEY_PREFIX + difficultyKey, String(guesses));
      updateBestDisplay();
      return true;
    }
    return false;
  }

  function updateBestDisplay() {
    const config = DIFFICULTY_CONFIG[currentDifficulty];
    const best = bestRecords[config.key];
    if (best !== undefined && best !== null) {
      bestDisplay.textContent = best;
    } else {
      bestDisplay.textContent = "—";
    }
  }

  // ========== 三击删除 ==========
  function bindTripleClick() {
    if (!bestBox || bestBox._tripleClickBound) return;
    bestBox._tripleClickBound = true;

    let clickCount = 0;
    let clickTimer = null;
    bestBox.addEventListener("click", function (e) {
      e.stopPropagation();
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 500);
      if (clickCount >= 3) {
        clickCount = 0;
        const config = DIFFICULTY_CONFIG[currentDifficulty];
        const currentBest = bestRecords[config.key];
        if (
          confirm(
            `确认清除「${config.label}」级别的最佳记录吗？\n\n当前记录：${currentBest !== undefined ? currentBest : "无"}`,
          )
        ) {
          delete bestRecords[config.key];
          localStorage.removeItem(BEST_KEY_PREFIX + config.key);
          updateBestDisplay();
        }
      }
    });
  }

  // ========== 数字图片路径 ==========
  function getNumberImage(num) {
    const words = {
      0: "zero",
      1: "one",
      2: "two",
      3: "three",
      4: "four",
      5: "five",
      6: "six",
      7: "seven",
      8: "eight",
      9: "nine",
    };
    return `images/${words[num]}.jpeg`;
  }

  // ========== 游戏逻辑 ==========
  function generateSecret(digits) {
    const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const shuffled = [...nums];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    let result = shuffled.slice(0, digits);
    if (result[0] === 0) {
      for (let i = 1; i < result.length; i++) {
        if (result[i] !== 0) {
          [result[0], result[i]] = [result[i], result[0]];
          break;
        }
      }
      if (result[0] === 0) {
        return generateSecret(digits);
      }
    }
    return result;
  }

  function evaluateGuess(guess, secret) {
    let a = 0,
      b = 0;
    const secretCopy = [...secret];
    const guessCopy = [...guess];
    for (let i = 0; i < guessCopy.length; i++) {
      if (guessCopy[i] === secretCopy[i]) {
        a++;
        guessCopy[i] = null;
        secretCopy[i] = null;
      }
    }
    for (let i = 0; i < guessCopy.length; i++) {
      if (guessCopy[i] === null) continue;
      const idx = secretCopy.indexOf(guessCopy[i]);
      if (idx !== -1) {
        b++;
        secretCopy[idx] = null;
      }
    }
    return { a, b };
  }

  function resetGame() {
    const config = DIFFICULTY_CONFIG[currentDifficulty];
    digitCount = config.digits;
    secretNumber = generateSecret(digitCount);
    currentGuess = [];
    guessCount = 0;
    history = [];
    isGameOver = false;
    gameActive = true;

    guessCountEl.textContent = "0";
    updateBestDisplay();
    renderGuessDisplay();
    renderNumpad();
    renderHistory();
  }

  // ========== 渲染 ==========
  function renderGuessDisplay() {
    guessDisplay.innerHTML = "";
    for (let i = 0; i < digitCount; i++) {
      const div = document.createElement("div");
      div.className = "guess-digit";
      if (i < currentGuess.length) {
        div.classList.add("filled");
        const img = document.createElement("img");
        img.src = getNumberImage(currentGuess[i]);
        img.alt = currentGuess[i];
        div.appendChild(img);
      } else {
        const placeholder = document.createElement("span");
        placeholder.className = "placeholder";
        placeholder.textContent = "_";
        div.appendChild(placeholder);
      }
      guessDisplay.appendChild(div);
    }
  }

  function renderNumpad() {
    numpad.innerHTML = "";

    for (let i = 0; i <= 9; i++) {
      const btn = document.createElement("button");
      btn.className = "num-btn";
      btn.dataset.num = i;
      if (currentGuess.includes(i)) {
        btn.classList.add("used");
      }
      const img = document.createElement("img");
      img.src = getNumberImage(i);
      img.alt = i;
      btn.appendChild(img);
      btn.addEventListener("click", () => handleNumClick(i));
      numpad.appendChild(btn);
    }

    const delBtn = document.createElement("button");
    delBtn.className = "num-btn delete-btn";
    delBtn.innerHTML = '<i class="fas fa-backspace"></i>';
    delBtn.addEventListener("click", handleDelete);
    numpad.appendChild(delBtn);
  }

  function renderHistory() {
    if (history.length === 0) {
      historyList.innerHTML = '<div class="history-empty">还没有猜测记录</div>';
      return;
    }
    let html = "";
    for (const item of history) {
      const guessStr = item.guess.join("");
      const resultStr = `${item.result.a}A${item.result.b}B`;
      html += `
                <div class="history-item">
                    <span class="guess-num">${guessStr}</span>
                    <span class="guess-result">
                        <span class="a">${item.result.a}A</span>
                        <span class="b">${item.result.b}B</span>
                    </span>
                </div>
            `;
    }
    historyList.innerHTML = html;
    historyPanel.scrollTop = historyPanel.scrollHeight;
  }

  // ========== 交互 ==========
  function handleNumClick(num) {
    if (!gameActive || isGameOver) return;
    if (currentGuess.length >= digitCount) return;
    if (currentGuess.includes(num)) return;

    currentGuess.push(num);
    renderGuessDisplay();
    renderNumpad();

    // 自动提交：填满后自动验证
    if (currentGuess.length === digitCount) {
      handleSubmit();
    }
  }

  function handleDelete() {
    if (!gameActive || isGameOver) return;
    if (currentGuess.length === 0) return;
    currentGuess.pop();
    renderGuessDisplay();
    renderNumpad();
  }

  function handleSubmit() {
    if (!gameActive || isGameOver) return;
    if (currentGuess.length !== digitCount) return;

    const unique = new Set(currentGuess);
    if (unique.size !== digitCount) {
      // 理论上不会发生，但以防万一
      return;
    }

    const result = evaluateGuess(currentGuess, secretNumber);
    guessCount++;
    guessCountEl.textContent = guessCount;

    history.push({
      guess: [...currentGuess],
      result: result,
    });

    currentGuess = [];
    renderGuessDisplay();
    renderNumpad();
    renderHistory();

    if (result.a === digitCount) {
      gameActive = false;
      isGameOver = true;
      playSound("correct");
      const isNewRecord = saveBestRecord(
        DIFFICULTY_CONFIG[currentDifficulty].key,
        guessCount,
      );
      showVictory(guessCount, isNewRecord);
    } else {
      playSound("wrong");
    }
  }

  // ========== 胜利 ==========
  function showVictory(guesses, isNewRecord) {
    const overlay = document.createElement("div");
    overlay.className = "result-overlay";
    overlay.innerHTML = `
            <div class="result-card">
                <h2>🎉 猜中了！ 🎉</h2>
                <div class="final-label">用了 <span class="final-guesses">${guesses}</span> 次</div>
                ${isNewRecord ? '<div style="color:#ff6b6b; font-size:1.1rem; font-weight:bold; margin-top:6px;">✨ 新纪录！ ✨</div>' : ""}
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

  // ========== 难度切换 ==========
  function setDifficulty(difficultyKey) {
    currentDifficulty = difficultyKey;
    diffBtns.forEach((btn) => {
      if (btn.dataset.difficulty === difficultyKey) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
    const overlay = document.querySelector(".result-overlay");
    if (overlay) overlay.remove();
    resetGame();
  }

  // ========== 启动 ==========
  function startGame() {
    startOverlay.style.display = "none";
    gameContainer.style.display = "block";
    loadBestRecords();
    bindTripleClick();
    resetGame();
  }

  // ========== 事件绑定 ==========
  startBtn.addEventListener("click", startGame);

  diffBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const difficulty = this.dataset.difficulty;
      if (difficulty && DIFFICULTY_CONFIG[difficulty]) {
        setDifficulty(difficulty);
      }
    });
  });

  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", goHome);
  }

  loadBestRecords();
})();

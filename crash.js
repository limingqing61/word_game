(function () {
  // 关卡配置 [行, 列]
  const LEVELS = [
    { rows: 2, cols: 3 }, // 0: 2x3
    { rows: 3, cols: 4 }, // 1: 3x4
    { rows: 4, cols: 5 }, // 2: 4x5
    { rows: 5, cols: 6 }, // 3: 5x6
    { rows: 6, cols: 7 }, // 4: 6x7
    { rows: 7, cols: 8 }, // 5: 7x8
  ];
  let currentLevel = 0;
  let cardsData = [];
  let cardElements = [];
  let openedCards = [];
  let waitForAnimation = false;
  let timerSeconds = 0;
  let timerInterval = null;
  let gameActive = false;
  let gameStarted = false;
  let bestRecords = {};

  const gridContainer = document.getElementById("gridContainer");
  const timerDisplaySpan = document.getElementById("timerDisplay");
  const bestDisplaySpan = document.getElementById("bestDisplay");
  const gameMessageDiv = document.getElementById("gameMessage");
  const levelBtns = document.querySelectorAll(".level-btn");
  const backBtn = document.getElementById("backToMenuBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");

  function formatTime(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}小时 ${mins}分 ${secs}秒`;
    if (mins > 0) return `${mins}分 ${secs}秒`;
    return `${secs}秒`;
  }

  function updateBestDisplay() {
    const bestSec = bestRecords[currentLevel];
    if (bestSec !== undefined && bestSec !== null) {
      bestDisplaySpan.textContent = formatTime(bestSec);
    } else {
      bestDisplaySpan.textContent = "尚未通过";
    }
  }

  function saveBestRecord(level, seconds) {
    if (!bestRecords[level] || seconds < bestRecords[level]) {
      bestRecords[level] = seconds;
      localStorage.setItem("crash_best_records", JSON.stringify(bestRecords));
      updateBestDisplay();
      return true;
    }
    return false;
  }

  function resetCurrentLevelRecord() {
    if (bestRecords[currentLevel] !== undefined) {
      delete bestRecords[currentLevel];
      localStorage.setItem("crash_best_records", JSON.stringify(bestRecords));
      updateBestDisplay();
      return true;
    }
    return false;
  }

  // 三击重置
  let clickCount = 0;
  let clickTimer = null;
  function bindTripleClickReset() {
    const bestBox = document.querySelector(".best-box");
    if (!bestBox) return;
    bestBox.style.cursor = "pointer";
    bestBox.addEventListener("click", (e) => {
      e.stopPropagation();
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 500);
      if (clickCount >= 3) {
        clickCount = 0;
        if (
          confirm(
            `确认清除当前关卡的最快记录吗？\n\n当前记录：${bestDisplaySpan.textContent}`,
          )
        ) {
          resetCurrentLevelRecord();
          gameMessageDiv.innerHTML = "✅ 当前关卡的记录已清除";
          setTimeout(() => {
            if (gameMessageDiv.innerHTML === "✅ 当前关卡的记录已清除")
              gameMessageDiv.innerHTML = "";
          }, 1500);
        }
      }
    });
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startTimer() {
    if (timerInterval) stopTimer();
    timerSeconds = 0;
    timerDisplaySpan.textContent = "0";
    timerInterval = setInterval(() => {
      if (gameActive && gameStarted) {
        timerSeconds++;
        timerDisplaySpan.textContent = timerSeconds;
      }
    }, 1000);
  }

  function gameWin() {
    if (!gameActive) return;
    gameActive = false;
    gameStarted = false;
    stopTimer();
    const isNewRecord = saveBestRecord(currentLevel, timerSeconds);
    gameMessageDiv.innerHTML = `🎉 恭喜通关！ 🎉<br>用时 ${formatTime(timerSeconds)}${isNewRecord ? "<br>✨ 新纪录！ ✨" : ""}`;
    // 显示「再玩一次」按钮
    if (playAgainBtn) {
      playAgainBtn.style.display = "inline-block";
    }
  }

  function checkAllMatched() {
    if (!gameActive) return;
    const allMatched = cardsData.every((c) => c.isMatched);
    if (allMatched) {
      gameWin();
    }
  }

  function showExplosion(x, y) {
    const div = document.createElement("div");
    div.className = "explosion-effect";
    div.textContent = "💥✨";
    div.style.left = x + "px";
    div.style.top = y + "px";
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 400);
  }

  function matchSuccess(idxA, idxB, cardElA, cardElB) {
    cardsData[idxA].isMatched = true;
    cardsData[idxB].isMatched = true;
    cardElA.classList.add("eliminated");
    cardElB.classList.add("eliminated");
    const rectA = cardElA.getBoundingClientRect();
    const rectB = cardElB.getBoundingClientRect();
    showExplosion(
      (rectA.left + rectA.right) / 2,
      (rectA.top + rectA.bottom) / 2,
    );
    showExplosion(
      (rectB.left + rectB.right) / 2,
      (rectB.top + rectB.bottom) / 2,
    );
    playSound("correct");
    // 关键：检查是否全部匹配
    checkAllMatched();
  }

  function matchFailed(idxA, idxB, cardElA, cardElB) {
    setTimeout(() => {
      if (
        !cardElA.classList.contains("eliminated") &&
        !cardElB.classList.contains("eliminated")
      ) {
        cardElA.classList.remove("front");
        cardElA.classList.add("back");
        cardElB.classList.remove("front");
        cardElB.classList.add("back");
        cardElA.innerHTML = "";
        cardElB.innerHTML = "";
      }
      openedCards = [];
      waitForAnimation = false;
    }, 800);
  }

  function onCardClick(idx) {
    if (!gameActive) return;
    if (waitForAnimation) return;
    if (cardsData[idx].isMatched) return;
    const cardEl = cardElements[idx];
    if (cardEl.classList.contains("front")) return;
    if (openedCards.length >= 2) return;

    if (!gameStarted) {
      gameStarted = true;
      startTimer();
    }

    const card = cardsData[idx];
    const wordObj = window.wordData[card.wordKey];
    if (!wordObj) return;

    cardEl.innerHTML = `
            <img src="${wordObj.image}" alt="${card.wordKey}" style="width:60px;height:60px;object-fit:contain; margin-bottom:4px;" onerror="this.style.display='none'">
            <div class="card-word">${card.wordKey}</div>
            <div class="card-phonetic">${wordObj.phonetic || ""}</div>
            <div class="card-chinese">${wordObj.chinese || ""}</div>
        `;
    cardEl.classList.remove("back");
    cardEl.classList.add("front");

    openedCards.push(idx);

    if (openedCards.length === 2) {
      waitForAnimation = true;
      const idx1 = openedCards[0];
      const idx2 = openedCards[1];
      const word1 = cardsData[idx1].wordKey;
      const word2 = cardsData[idx2].wordKey;
      const el1 = cardElements[idx1];
      const el2 = cardElements[idx2];
      if (word1 === word2) {
        matchSuccess(idx1, idx2, el1, el2);
        openedCards = [];
        waitForAnimation = false;
      } else {
        matchFailed(idx1, idx2, el1, el2);
        openedCards = [];
      }
    }
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function generateLevelData(rows, cols) {
    const totalCards = rows * cols;
    const pairCount = totalCards / 2;
    const wordKeys = Object.keys(window.wordData);
    if (wordKeys.length < pairCount) {
      console.error("wordData 中的单词不足，请扩充 wordData");
      return [];
    }
    const shuffledAll = shuffleArray([...wordKeys]);
    const selectedWords = shuffledAll.slice(0, pairCount);
    let pool = [];
    selectedWords.forEach((word) => {
      pool.push({ wordKey: word, pairId: word });
      pool.push({ wordKey: word, pairId: word });
    });
    pool = shuffleArray(pool);
    return pool.map((item, idx) => ({
      wordKey: item.wordKey,
      pairId: item.pairId,
      isMatched: false,
      index: idx,
    }));
  }

  function renderGrid(rows, cols, data) {
    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, minmax(70px, 100px))`;
    gridContainer.innerHTML = "";
    cardElements = [];
    for (let i = 0; i < data.length; i++) {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card back";
      cardDiv.addEventListener(
        "click",
        (function (idx) {
          return function () {
            onCardClick(idx);
          };
        })(i),
      );
      gridContainer.appendChild(cardDiv);
      cardElements.push(cardDiv);
    }
  }

  function resetGame(levelIdx) {
    stopTimer();
    openedCards = [];
    waitForAnimation = false;
    gameStarted = false;
    const level = LEVELS[levelIdx];
    const rows = level.rows,
      cols = level.cols;
    const totalCards = rows * cols;
    const newData = generateLevelData(rows, cols);
    if (newData.length !== totalCards) {
      gameMessageDiv.innerHTML = "❌ 单词数量不足，无法开始游戏";
      return;
    }
    cardsData = newData;
    renderGrid(rows, cols, cardsData);
    gameActive = true;
    gameMessageDiv.innerHTML = "";
    timerDisplaySpan.textContent = "0";
    // 隐藏「再玩一次」按钮
    if (playAgainBtn) {
      playAgainBtn.style.display = "none";
    }
  }

  function loadLevel(levelIdx) {
    currentLevel = levelIdx;
    levelBtns.forEach((btn, idx) => {
      if (idx == levelIdx) btn.classList.add("active");
      else btn.classList.remove("active");
    });
    const stored = localStorage.getItem("crash_best_records");
    if (stored) {
      try {
        bestRecords = JSON.parse(stored);
      } catch (e) {
        bestRecords = {};
      }
    } else {
      bestRecords = {};
    }
    updateBestDisplay();
    resetGame(levelIdx);
  }

  // 关卡按钮事件
  levelBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      if (currentLevel === idx) return;
      loadLevel(idx);
    });
  });

  // 返回菜单
  bindGoHome(backBtn);

  // 再玩一次按钮
  if (playAgainBtn) {
    playAgainBtn.addEventListener("click", () => {
      resetGame(currentLevel);
    });
    // 初始状态隐藏
    playAgainBtn.style.display = "none";
  }

  bindTripleClickReset();
  loadLevel(0);
})();

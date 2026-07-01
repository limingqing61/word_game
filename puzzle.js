(function () {
  // 关卡配置 [行, 列]
  const LEVELS = [
    { rows: 3, cols: 3, name: "3x3" }, // 数字 1-8
    { rows: 3, cols: 4, name: "3x4" }, // 数字 1-11
    { rows: 4, cols: 4, name: "4x4" }, // 数字 1-15
    { rows: 4, cols: 5, name: "4x5" }, // 数字 1-19
  ];

  let currentLevel = 0;
  let puzzleData = [];
  let emptyRow = -1,
    emptyCol = -1;
  let timerSeconds = 0;
  let timerInterval = null;
  let gameActive = true;
  let gameStarted = false;
  let bestRecords = {};

  const gridContainer = document.getElementById("puzzleGrid");
  const timerDisplaySpan = document.getElementById("timerDisplay");
  const bestDisplaySpan = document.getElementById("bestDisplay");
  const gameMessageDiv = document.getElementById("gameMessage");
  const levelBtns = document.querySelectorAll(".level-btn");
  const backBtn = document.getElementById("backToMenuBtn");
  const playAgainBtn = document.getElementById("playAgainBtn");

  // ========== 工具函数 ==========
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
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
      localStorage.setItem("puzzle_best_records", JSON.stringify(bestRecords));
      updateBestDisplay();
      return true;
    }
    return false;
  }

  function resetCurrentLevelRecord() {
    if (bestRecords[currentLevel] !== undefined) {
      delete bestRecords[currentLevel];
      localStorage.setItem("puzzle_best_records", JSON.stringify(bestRecords));
      updateBestDisplay();
      gameMessageDiv.innerHTML = "✅ 当前关卡的记录已清除";
      setTimeout(() => {
        if (gameMessageDiv.innerHTML === "✅ 当前关卡的记录已清除")
          gameMessageDiv.innerHTML = "";
      }, 1500);
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

  function checkWin() {
    const rows = LEVELS[currentLevel].rows;
    const cols = LEVELS[currentLevel].cols;
    let expected = 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = puzzleData[r][c];
        if (r === rows - 1 && c === cols - 1) {
          if (val !== null) return false;
        } else {
          if (val !== expected) return false;
          expected++;
        }
      }
    }
    return true;
  }

  function gameWin() {
    if (!gameActive) return;
    gameActive = false;
    gameStarted = false;
    stopTimer();
    const isNewRecord = saveBestRecord(currentLevel, timerSeconds);
    gameMessageDiv.innerHTML = `🎉 恭喜通关！ 🎉<br>用时 ${formatTime(timerSeconds)}${isNewRecord ? "<br>✨ 新纪录！ ✨" : ""}`;
    playAgainBtn.style.display = "inline-block";
  }

  function swap(r1, c1, r2, c2) {
    const temp = puzzleData[r1][c1];
    puzzleData[r1][c1] = puzzleData[r2][c2];
    puzzleData[r2][c2] = temp;
  }

  function onCellClick(row, col) {
    if (!gameActive) return;
    if (row === emptyRow && col === emptyCol) return;

    const isAdjacent =
      Math.abs(row - emptyRow) + Math.abs(col - emptyCol) === 1;
    if (!isAdjacent) return;

    if (!gameStarted) {
      gameStarted = true;
      startTimer();
    }

    swap(row, col, emptyRow, emptyCol);
    emptyRow = row;
    emptyCol = col;

    renderGrid();

    if (checkWin()) {
      gameWin();
    }
  }

  function generatePuzzle(rows, cols) {
    const total = rows * cols;
    const numbers = [];
    for (let i = 1; i < total; i++) {
      numbers.push(i);
    }
    numbers.push(null);

    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }

    const puzzle = [];
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push(numbers[idx++]);
      }
      puzzle.push(row);
    }
    return puzzle;
  }

  function isSolvable(puzzle, rows, cols) {
    const flat = [];
    let emptyRowPos = -1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = puzzle[r][c];
        if (val === null) {
          emptyRowPos = r;
        } else {
          flat.push(val);
        }
      }
    }

    let inversions = 0;
    for (let i = 0; i < flat.length; i++) {
      for (let j = i + 1; j < flat.length; j++) {
        if (flat[i] > flat[j]) inversions++;
      }
    }

    if (cols % 2 === 1) {
      return inversions % 2 === 0;
    } else {
      const emptyRowDist = rows - 1 - emptyRowPos;
      return (inversions + emptyRowDist) % 2 === 0;
    }
  }

  function generateSolvablePuzzle(rows, cols) {
    let puzzle;
    let attempts = 0;
    do {
      puzzle = generatePuzzle(rows, cols);
      attempts++;
      if (attempts > 100) break;
    } while (!isSolvable(puzzle, rows, cols));
    return puzzle;
  }

  function renderGrid() {
    const rows = LEVELS[currentLevel].rows;
    const cols = LEVELS[currentLevel].cols;
    gridContainer.style.display = "grid";
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, minmax(60px, 80px))`;
    gridContainer.innerHTML = "";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const val = puzzleData[r][c];
        const cell = document.createElement("div");
        cell.className = "puzzle-cell";
        if (val === null) {
          cell.classList.add("empty");
        } else {
          const img = document.createElement("img");
          img.src = `images/${val}.jpeg`;
          img.alt = val;
          cell.appendChild(img);
          img.onerror = () => {
            img.style.display = "none";
            const fallback = document.createElement("span");
            fallback.textContent = val;
            fallback.style.fontSize = "1.5rem";
            fallback.style.fontWeight = "bold";
            cell.appendChild(fallback);
          };
        }
        cell.addEventListener(
          "click",
          (function (row, col) {
            return function () {
              onCellClick(row, col);
            };
          })(r, c),
        );
        gridContainer.appendChild(cell);
      }
    }
  }

  function renderTemplate() {
    const rows = LEVELS[currentLevel].rows;
    const cols = LEVELS[currentLevel].cols;
    const templateContainer = document.getElementById("templateGrid");
    templateContainer.style.display = "grid";
    templateContainer.style.gridTemplateColumns = `repeat(${cols}, minmax(30px, 45px))`;
    templateContainer.innerHTML = "";

    let num = 1;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isLast = r === rows - 1 && c === cols - 1;
        const cell = document.createElement("div");
        cell.className = "template-cell";
        if (isLast) {
          cell.classList.add("empty");
          cell.textContent = "";
        } else {
          cell.textContent = num++;
        }
        templateContainer.appendChild(cell);
      }
    }
  }

  function resetGame(levelIdx) {
    stopTimer();
    gameStarted = false;
    gameActive = true;

    const level = LEVELS[levelIdx];
    const rows = level.rows;
    const cols = level.cols;

    const puzzle = generateSolvablePuzzle(rows, cols);
    puzzleData = puzzle;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (puzzleData[r][c] === null) {
          emptyRow = r;
          emptyCol = c;
          break;
        }
      }
    }

    renderGrid();
    renderTemplate();
    gameMessageDiv.innerHTML = "";
    timerDisplaySpan.textContent = "0";
    playAgainBtn.style.display = "none";
  }

  function loadLevel(levelIdx) {
    currentLevel = levelIdx;
    levelBtns.forEach((btn, idx) => {
      if (idx == levelIdx) btn.classList.add("active");
      else btn.classList.remove("active");
    });

    const stored = localStorage.getItem("puzzle_best_records");
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

  // ========== 事件绑定 ==========
  levelBtns.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      if (currentLevel === idx) return;
      loadLevel(idx);
    });
  });

  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  playAgainBtn.addEventListener("click", () => {
    resetGame(currentLevel);
  });

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

  function playSoundEffect(type) {
    try {
      const ctx = getAudioContext();
      resumeAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      if (type === "correct") {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3);
        osc.type = "sine";
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      } else {
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.setValueAtTime(300, ctx.currentTime + 0.2);
        osc.type = "sawtooth";
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  bindTripleClickReset();
  loadLevel(0);
})();

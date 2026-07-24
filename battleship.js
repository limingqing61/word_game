(function () {
  "use strict";

  // ========== 配置 ==========
  const ROWS = 10;
  const COLS = 10;
  const PLANE_COUNT = 3;
  const HEAD_SHOT = "💀";

  // 飞机形状（以机头为基准 (0,0)）
  const PLANE_SHAPE = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [1, -2],
    [1, -1],
    [1, 1],
    [1, 2],
    [3, -1],
    [3, 1],
  ];

  // 飞机颜色（3架不同颜色，亮色显眼）
  const PLANE_COLORS = ["plane-color-0", "plane-color-1", "plane-color-2"];

  // ========== DOM ==========
  const gridContainer = document.getElementById("gridContainer");
  const shotsDisplay = document.getElementById("shotsDisplay");
  const bestDisplay = document.getElementById("bestDisplay");
  const bestBox = document.getElementById("bestBox");
  const message = document.getElementById("message");
  const floatingBtn = document.getElementById("floatingHomeBtn");

  // ========== 游戏状态 ==========
  let board = [];
  let planes = [];
  let shots = 0;
  let headsHit = 0;
  let gameOver = false;
  let gameActive = false;
  let bestRecord = null;
  let waitingForResult = false;

  const BEST_KEY = "battleship_best";

  // ========== 最佳记录 ==========
  function loadBest() {
    const stored = localStorage.getItem(BEST_KEY);
    if (stored) {
      bestRecord = parseInt(stored);
      if (!isNaN(bestRecord)) {
        bestDisplay.textContent = bestRecord;
        return;
      }
    }
    bestRecord = null;
    bestDisplay.textContent = "—";
  }

  function saveBest(shots) {
    if (bestRecord === null || shots < bestRecord) {
      bestRecord = shots;
      localStorage.setItem(BEST_KEY, String(bestRecord));
      bestDisplay.textContent = bestRecord;
      return true;
    }
    return false;
  }

  // 三击删除
  let clickCount = 0;
  let clickTimer = null;

  function bindTripleClick() {
    if (!bestBox) return;
    bestBox.addEventListener("click", (e) => {
      e.stopPropagation();
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 500);
      if (clickCount >= 3) {
        clickCount = 0;
        if (confirm("确认清除最佳记录吗？")) {
          localStorage.removeItem(BEST_KEY);
          bestRecord = null;
          bestDisplay.textContent = "—";
          message.textContent = "✅ 最佳记录已清除";
          setTimeout(() => {
            if (message.textContent === "✅ 最佳记录已清除")
              message.textContent = "💣 点击格子，炸毁三架飞机！";
          }, 1500);
        }
      }
    });
  }

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

  // ========== 飞机生成 ==========
  function generatePlanes() {
    const placed = [];
    let attempts = 0;

    while (placed.length < PLANE_COUNT && attempts < 1000) {
      attempts++;
      const dir = Math.floor(Math.random() * 4);
      const range = getHeadRange(dir);
      const headR =
        Math.floor(Math.random() * (range.maxR - range.minR + 1)) + range.minR;
      const headC =
        Math.floor(Math.random() * (range.maxC - range.minC + 1)) + range.minC;

      // 机头离边缘太近（≤2格），40%概率跳过
      const edgeDist = Math.min(
        headR,
        ROWS - 1 - headR,
        headC,
        COLS - 1 - headC,
      );
      if (edgeDist <= 2 && Math.random() < 0.4) {
        continue;
      }

      const cells = getPlaneCells(headR, headC, dir);
      if (!cells || isOverlapping(cells, placed)) continue;

      // 如果已经有飞机了，检查距离
      if (placed.length > 0) {
        const minDist = getMinDistance(cells, placed);
        // 如果距离太远（> 5格），50%概率跳过
        if (minDist > 5 && Math.random() < 0.5) {
          continue;
        }
      }

      placed.push({
        head: [headR, headC],
        cells: cells,
        dir: dir,
        destroyed: false,
        color: PLANE_COLORS[placed.length],
      });
    }

    // 兜底：如果还没放满，用纯随机补足
    while (placed.length < PLANE_COUNT) {
      const dir = Math.floor(Math.random() * 4);
      const range = getHeadRange(dir);
      const headR =
        Math.floor(Math.random() * (range.maxR - range.minR + 1)) + range.minR;
      const headC =
        Math.floor(Math.random() * (range.maxC - range.minC + 1)) + range.minC;
      const cells = getPlaneCells(headR, headC, dir);
      if (cells && !isOverlapping(cells, placed)) {
        placed.push({
          head: [headR, headC],
          cells: cells,
          dir: dir,
          destroyed: false,
          color: PLANE_COLORS[placed.length],
        });
      }
    }

    return placed;
  }

  function getHeadRange(dir) {
    const maxDr = 3;
    const maxDc = 2;

    if (dir === 0) {
      return {
        minR: maxDr,
        maxR: ROWS - 1,
        minC: maxDc,
        maxC: COLS - 1 - maxDc,
      };
    } else if (dir === 1) {
      return {
        minR: maxDc,
        maxR: ROWS - 1 - maxDc,
        minC: 0,
        maxC: COLS - 1 - maxDr,
      };
    } else if (dir === 2) {
      return {
        minR: 0,
        maxR: ROWS - 1 - maxDr,
        minC: maxDc,
        maxC: COLS - 1 - maxDc,
      };
    } else {
      return {
        minR: maxDc,
        maxR: ROWS - 1 - maxDc,
        minC: maxDr,
        maxC: COLS - 1,
      };
    }
  }

  function getPlaneCells(headR, headC, dir) {
    const cells = [];
    for (const [dr, dc] of PLANE_SHAPE) {
      let r, c;
      if (dir === 0) {
        r = headR - dr;
        c = headC + dc;
      } else if (dir === 1) {
        r = headR + dc;
        c = headC + dr;
      } else if (dir === 2) {
        r = headR + dr;
        c = headC - dc;
      } else {
        r = headR - dc;
        c = headC - dr;
      }
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return null;
      cells.push([r, c]);
    }
    return cells;
  }

  function isOverlapping(cells, placed) {
    const cellSet = new Set();
    for (const p of placed) {
      for (const [r, c] of p.cells) {
        cellSet.add(`${r},${c}`);
      }
    }
    for (const [r, c] of cells) {
      if (cellSet.has(`${r},${c}`)) return true;
    }
    return false;
  }

  function getMinDistance(cells, placed) {
    let minDist = Infinity;
    for (const p of placed) {
      for (const [r1, c1] of cells) {
        for (const [r2, c2] of p.cells) {
          const dist = Math.abs(r1 - r2) + Math.abs(c1 - c2);
          if (dist < minDist) minDist = dist;
        }
      }
    }
    return minDist;
  }

  // ========== 初始化 ==========
  function initBoard() {
    board = [];
    for (let r = 0; r < ROWS; r++) {
      board[r] = [];
      for (let c = 0; c < COLS; c++) {
        board[r][c] = {
          revealed: false,
          hit: false,
          head: false,
          planeIdx: -1,
        };
      }
    }
    shots = 0;
    headsHit = 0;
    gameOver = false;
    gameActive = true;
    waitingForResult = false;
    shotsDisplay.textContent = "0";
    message.textContent = "💣 点击格子，炸毁三架飞机！";

    planes = generatePlanes();

    for (let p = 0; p < planes.length; p++) {
      const plane = planes[p];
      for (const [r, c] of plane.cells) {
        board[r][c].planeIdx = p;
      }
      const [hr, hc] = plane.head;
      board[hr][hc].head = true;
    }

    renderGrid();

    // ===== 滚动到网格底部（多重延迟） =====
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const gridWrapper = document.querySelector(".grid-wrapper");
          if (gridWrapper) {
            gridWrapper.scrollIntoView({ behavior: "smooth", block: "end" });
          }
          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }, 200);
        }, 100);
      });
    });
  }

  // ========== 渲染 ==========
  function renderGrid() {
    gridContainer.innerHTML = "";

    const header = document.createElement("div");
    header.className = "grid-header";
    const emptyLabel = document.createElement("div");
    emptyLabel.className = "label";
    emptyLabel.textContent = "";
    header.appendChild(emptyLabel);
    for (let c = 0; c < COLS; c++) {
      const label = document.createElement("div");
      label.className = "label";
      label.textContent = String.fromCharCode(65 + c);
      header.appendChild(label);
    }
    gridContainer.appendChild(header);

    for (let r = 0; r < ROWS; r++) {
      const row = document.createElement("div");
      row.className = "grid-row";
      const rowLabel = document.createElement("div");
      rowLabel.className = "row-label";
      rowLabel.textContent = r + 1;
      row.appendChild(rowLabel);

      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = r;
        cell.dataset.col = c;
        const state = board[r][c];

        if (state.revealed) {
          cell.classList.add("revealed");
          if (state.hit && state.head) {
            cell.classList.add("head");
            cell.textContent = HEAD_SHOT;
          } else if (state.hit) {
            cell.classList.add("hit");
            cell.textContent = "X";
          } else {
            cell.classList.add("miss");
            cell.textContent = "O";
          }
        }

        if (gameOver) {
          const planeIdx = board[r][c].planeIdx;
          if (planeIdx >= 0 && planeIdx < PLANE_COLORS.length) {
            cell.classList.add(PLANE_COLORS[planeIdx]);
            if (state.head) cell.classList.add("head");
            if (!state.revealed) {
              cell.classList.add("revealed");
            }
          }
        }

        cell.addEventListener("click", () => onCellClick(r, c));
        cell.addEventListener(
          "touchstart",
          (e) => {
            e.preventDefault();
            onCellClick(r, c);
          },
          { passive: false },
        );

        row.appendChild(cell);
      }
      gridContainer.appendChild(row);
    }
  }

  // ========== 点击逻辑 ==========
  function onCellClick(row, col) {
    if (!gameActive || gameOver || waitingForResult) return;
    const state = board[row][col];
    if (state.revealed) return;

    state.revealed = true;
    shots++;
    shotsDisplay.textContent = shots;

    const planeIdx = state.planeIdx;
    if (planeIdx >= 0) {
      state.hit = true;
      if (state.head) {
        playHitSound();
        headsHit++;
        message.textContent = `💀 打中机头！已击毁 ${headsHit}/${PLANE_COUNT} 架飞机！`;
        if (headsHit >= PLANE_COUNT) {
          gameActive = false;
          gameOver = true;
          waitingForResult = true;
          playWinSound();
          for (let p = 0; p < planes.length; p++) {
            for (const [r, c] of planes[p].cells) {
              board[r][c].revealed = true;
            }
          }
          renderGrid();
          setTimeout(() => {
            waitingForResult = false;
            showVictory(shots);
          }, 3000);
          return;
        }
      } else {
        playHitSound();
        message.textContent = `💥 打中机身！继续搜索！`;
      }
    } else {
      playMissSound();
      message.textContent = `⭕ 打空了... 继续！`;
    }

    renderGrid();
  }

  // ========== 胜利 ==========
  function showVictory(shots) {
    const isNewRecord = saveBest(shots);

    const overlay = document.createElement("div");
    overlay.className = "result-overlay";
    overlay.innerHTML = `
            <div class="result-card">
                <h2>🎉 全部击毁！ 🎉</h2>
                <div class="final-label">总炮数</div>
                <div class="final-score">${shots}</div>
                ${isNewRecord ? '<div style="color:#ff6b6b; font-size:1.2rem; font-weight:bold;">✨ 新纪录！ ✨</div>' : ""}
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
    const overlay = document.querySelector(".result-overlay");
    if (overlay) overlay.remove();
    waitingForResult = false;
    initBoard();
    renderGrid();
    message.textContent = "💣 点击格子，炸毁三架飞机！";
  }

  // ========== 事件绑定 ==========
  if (floatingBtn) {
    floatingBtn.addEventListener("click", goHome);
  }

  bindTripleClick();

  // ========== 启动 ==========
  loadBest();
  initBoard();
  renderGrid();
})();

// ========== 启动遮罩 ==========
const startOverlay = document.getElementById("startOverlay");
const startBtn = document.getElementById("startBtn");
const gameContainer = document.getElementById("gameContainer");

if (startBtn) {
  startBtn.addEventListener("click", function () {
    startOverlay.style.display = "none";
    gameContainer.style.display = "block";

    // ===== 等待容器完全显示后再初始化 =====
    setTimeout(() => {
      // 重新调用 IIFE 内部的函数
      // 通过触发 loadBest 和 initBoard（它们已经在 IIFE 内定义了）
      // 但它们在闭包内无法直接访问，所以我们重新执行初始化
      // 最简单的方式：刷新页面逻辑
      // 但实际上，我们需要重新初始化 board 和 UI
      // 更好的方式是用一个全局入口
      startGame();
    }, 150);
  });
}

// ===== 全局启动函数 =====
function startGame() {
  // 重新获取 DOM 引用（确保容器显示后）
  const gridContainer = document.getElementById("gridContainer");
  const shotsDisplay = document.getElementById("shotsDisplay");
  const bestDisplay = document.getElementById("bestDisplay");
  const message = document.getElementById("message");

  // 重新执行初始化（复制 IIFE 内部的初始化逻辑）
  const ROWS = 10;
  const COLS = 10;
  const PLANE_COUNT = 3;
  const HEAD_SHOT = "💀";
  const PLANE_SHAPE = [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [1, -2],
    [1, -1],
    [1, 1],
    [1, 2],
    [3, -1],
    [3, 1],
  ];
  const PLANE_COLORS = ["plane-color-0", "plane-color-1", "plane-color-2"];

  let board = [];
  let planes = [];
  let shots = 0;
  let headsHit = 0;
  let gameOver = false;
  let gameActive = true;
  let waitingForResult = false;

  // 从 localStorage 加载最佳记录
  const BEST_KEY = "battleship_best";
  let bestRecord = null;
  const stored = localStorage.getItem(BEST_KEY);
  if (stored) {
    bestRecord = parseInt(stored);
    if (!isNaN(bestRecord)) {
      bestDisplay.textContent = bestRecord;
    }
  }

  function getHeadRange(dir) {
    const maxDr = 3;
    const maxDc = 2;
    if (dir === 0) {
      return {
        minR: maxDr,
        maxR: ROWS - 1,
        minC: maxDc,
        maxC: COLS - 1 - maxDc,
      };
    } else if (dir === 1) {
      return {
        minR: maxDc,
        maxR: ROWS - 1 - maxDc,
        minC: 0,
        maxC: COLS - 1 - maxDr,
      };
    } else if (dir === 2) {
      return {
        minR: 0,
        maxR: ROWS - 1 - maxDr,
        minC: maxDc,
        maxC: COLS - 1 - maxDc,
      };
    } else {
      return {
        minR: maxDc,
        maxR: ROWS - 1 - maxDc,
        minC: maxDr,
        maxC: COLS - 1,
      };
    }
  }

  function getPlaneCells(headR, headC, dir) {
    const cells = [];
    for (const [dr, dc] of PLANE_SHAPE) {
      let r, c;
      if (dir === 0) {
        r = headR - dr;
        c = headC + dc;
      } else if (dir === 1) {
        r = headR + dc;
        c = headC + dr;
      } else if (dir === 2) {
        r = headR + dr;
        c = headC - dc;
      } else {
        r = headR - dc;
        c = headC - dr;
      }
      if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return null;
      cells.push([r, c]);
    }
    return cells;
  }

  function isOverlapping(cells, placed) {
    const cellSet = new Set();
    for (const p of placed) {
      for (const [r, c] of p.cells) {
        cellSet.add(`${r},${c}`);
      }
    }
    for (const [r, c] of cells) {
      if (cellSet.has(`${r},${c}`)) return true;
    }
    return false;
  }

  function getMinDistance(cells, placed) {
    let minDist = Infinity;
    for (const p of placed) {
      for (const [r1, c1] of cells) {
        for (const [r2, c2] of p.cells) {
          const dist = Math.abs(r1 - r2) + Math.abs(c1 - c2);
          if (dist < minDist) minDist = dist;
        }
      }
    }
    return minDist;
  }

  function generatePlanes() {
    const placed = [];
    let attempts = 0;
    while (placed.length < PLANE_COUNT && attempts < 1000) {
      attempts++;
      const dir = Math.floor(Math.random() * 4);
      const range = getHeadRange(dir);
      const headR =
        Math.floor(Math.random() * (range.maxR - range.minR + 1)) + range.minR;
      const headC =
        Math.floor(Math.random() * (range.maxC - range.minC + 1)) + range.minC;
      const edgeDist = Math.min(
        headR,
        ROWS - 1 - headR,
        headC,
        COLS - 1 - headC,
      );
      if (edgeDist <= 2 && Math.random() < 0.4) continue;
      const cells = getPlaneCells(headR, headC, dir);
      if (!cells || isOverlapping(cells, placed)) continue;
      if (placed.length > 0) {
        const minDist = getMinDistance(cells, placed);
        if (minDist > 5 && Math.random() < 0.5) continue;
      }
      placed.push({
        head: [headR, headC],
        cells: cells,
        dir: dir,
        destroyed: false,
        color: PLANE_COLORS[placed.length],
      });
    }
    while (placed.length < PLANE_COUNT) {
      const dir = Math.floor(Math.random() * 4);
      const range = getHeadRange(dir);
      const headR =
        Math.floor(Math.random() * (range.maxR - range.minR + 1)) + range.minR;
      const headC =
        Math.floor(Math.random() * (range.maxC - range.minC + 1)) + range.minC;
      const cells = getPlaneCells(headR, headC, dir);
      if (cells && !isOverlapping(cells, placed)) {
        placed.push({
          head: [headR, headC],
          cells: cells,
          dir: dir,
          destroyed: false,
          color: PLANE_COLORS[placed.length],
        });
      }
    }
    return placed;
  }

  function renderGrid() {
    gridContainer.innerHTML = "";
    const header = document.createElement("div");
    header.className = "grid-header";
    const emptyLabel = document.createElement("div");
    emptyLabel.className = "label";
    emptyLabel.textContent = "";
    header.appendChild(emptyLabel);
    for (let c = 0; c < COLS; c++) {
      const label = document.createElement("div");
      label.className = "label";
      label.textContent = String.fromCharCode(65 + c);
      header.appendChild(label);
    }
    gridContainer.appendChild(header);

    for (let r = 0; r < ROWS; r++) {
      const row = document.createElement("div");
      row.className = "grid-row";
      const rowLabel = document.createElement("div");
      rowLabel.className = "row-label";
      rowLabel.textContent = r + 1;
      row.appendChild(rowLabel);
      for (let c = 0; c < COLS; c++) {
        const cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.row = r;
        cell.dataset.col = c;
        const state = board[r][c];
        if (state.revealed) {
          cell.classList.add("revealed");
          if (state.hit && state.head) {
            cell.classList.add("head");
            cell.textContent = HEAD_SHOT;
          } else if (state.hit) {
            cell.classList.add("hit");
            cell.textContent = "X";
          } else {
            cell.classList.add("miss");
            cell.textContent = "O";
          }
        }
        if (gameOver) {
          const planeIdx = board[r][c].planeIdx;
          if (planeIdx >= 0 && planeIdx < PLANE_COLORS.length) {
            cell.classList.add(PLANE_COLORS[planeIdx]);
            if (state.head) cell.classList.add("head");
            if (!state.revealed) {
              cell.classList.add("revealed");
            }
          }
        }
        cell.addEventListener("click", () => onCellClick(r, c));
        cell.addEventListener(
          "touchstart",
          (e) => {
            e.preventDefault();
            onCellClick(r, c);
          },
          { passive: false },
        );
        row.appendChild(cell);
      }
      gridContainer.appendChild(row);
    }
  }

  function initBoard() {
    board = [];
    for (let r = 0; r < ROWS; r++) {
      board[r] = [];
      for (let c = 0; c < COLS; c++) {
        board[r][c] = {
          revealed: false,
          hit: false,
          head: false,
          planeIdx: -1,
        };
      }
    }
    shots = 0;
    headsHit = 0;
    gameOver = false;
    gameActive = true;
    waitingForResult = false;
    shotsDisplay.textContent = "0";
    message.textContent = "💣 点击格子，炸毁三架飞机！";
    planes = generatePlanes();
    for (let p = 0; p < planes.length; p++) {
      const plane = planes[p];
      for (const [r, c] of plane.cells) {
        board[r][c].planeIdx = p;
      }
      const [hr, hc] = plane.head;
      board[hr][hc].head = true;
    }
    renderGrid();
    // 滚动到网格底部
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          const gridWrapper = document.querySelector(".grid-wrapper");
          if (gridWrapper) {
            gridWrapper.scrollIntoView({ behavior: "smooth", block: "end" });
          }
          setTimeout(() => {
            window.scrollTo({
              top: document.body.scrollHeight,
              behavior: "smooth",
            });
          }, 200);
        }, 100);
      });
    });
  }

  function onCellClick(row, col) {
    if (!gameActive || gameOver || waitingForResult) return;
    const state = board[row][col];
    if (state.revealed) return;
    state.revealed = true;
    shots++;
    shotsDisplay.textContent = shots;
    const planeIdx = state.planeIdx;
    if (planeIdx >= 0) {
      state.hit = true;
      if (state.head) {
        playSound("correct");
        headsHit++;
        message.textContent = `💀 打中机头！已击毁 ${headsHit}/${PLANE_COUNT} 架飞机！`;
        if (headsHit >= PLANE_COUNT) {
          gameActive = false;
          gameOver = true;
          waitingForResult = true;
          playSound("correct");
          for (let p = 0; p < planes.length; p++) {
            for (const [r, c] of planes[p].cells) {
              board[r][c].revealed = true;
            }
          }
          renderGrid();
          setTimeout(() => {
            waitingForResult = false;
            showVictory();
          }, 3000);
          return;
        }
      } else {
        playSound("correct");
        message.textContent = `💥 打中机身！继续搜索！`;
      }
    } else {
      playSound("wrong");
      message.textContent = `⭕ 打空了... 继续！`;
    }
    renderGrid();
  }

  function showVictory() {
    const isNewRecord = saveBest(shots);
    const overlay = document.createElement("div");
    overlay.className = "result-overlay";
    overlay.innerHTML = `
      <div class="result-card">
        <h2>🎉 全部击毁！ 🎉</h2>
        <div class="final-label">总炮数</div>
        <div class="final-score">${shots}</div>
        ${isNewRecord ? '<div style="color:#ff6b6b; font-size:1.2rem; font-weight:bold;">✨ 新纪录！ ✨</div>' : ""}
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

  function resetGame() {
    const overlay = document.querySelector(".result-overlay");
    if (overlay) overlay.remove();
    waitingForResult = false;
    initBoard();
    renderGrid();
    message.textContent = "💣 点击格子，炸毁三架飞机！";
  }

  function saveBest(shots) {
    const BEST_KEY = "battleship_best";
    let bestRecord = null;
    const stored = localStorage.getItem(BEST_KEY);
    if (stored) {
      bestRecord = parseInt(stored);
    }
    if (bestRecord === null || shots < bestRecord) {
      localStorage.setItem(BEST_KEY, String(shots));
      bestDisplay.textContent = shots;
      return true;
    }
    return false;
  }

  function goHome() {
    window.location.href = "index.html";
  }

  // 绑定三击删除
  if (bestBox) {
    let clickCount = 0;
    let clickTimer = null;
    bestBox.addEventListener("click", (e) => {
      e.stopPropagation();
      clickCount++;
      if (clickTimer) clearTimeout(clickTimer);
      clickTimer = setTimeout(() => {
        clickCount = 0;
      }, 500);
      if (clickCount >= 3) {
        clickCount = 0;
        if (confirm("确认清除最佳记录吗？")) {
          localStorage.removeItem("battleship_best");
          bestDisplay.textContent = "—";
          message.textContent = "✅ 最佳记录已清除";
          setTimeout(() => {
            if (message.textContent === "✅ 最佳记录已清除")
              message.textContent = "💣 点击格子，炸毁三架飞机！";
          }, 1500);
        }
      }
    });
  }

  // 悬浮返回首页
  if (floatingBtn) {
    floatingBtn.addEventListener("click", goHome);
  }

  // 启动游戏
  initBoard();
}

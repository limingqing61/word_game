(function () {
  "use strict";

  // ========== 配置 ==========
  const CATEGORIES = [
    "fruit",
    "vegetable",
    "animal",
    "food",
    "body",
    "number",
    "transport",
    "clothing",
    "nature",
    "country",
  ];

  const TOTAL_ROUNDS = 10;
  const PANEL_SIZE = 8;

  // ========== DOM ==========
  const leftGrid = document.getElementById("leftGrid");
  const rightGrid = document.getElementById("rightGrid");
  const candidateGrid = document.getElementById("candidateGrid");
  const roundDisplay = document.getElementById("roundDisplay");
  const timerDisplay = document.getElementById("timerDisplay");
  const bestDisplay = document.getElementById("bestDisplay");
  const bestBox = document.getElementById("bestBox");
  const commonHint = document.getElementById("commonHint");
  const message = document.getElementById("message");
  const backHomeBtn = document.getElementById("backHomeBtn");
  const startOverlay = document.getElementById("startOverlay");
  const startBtn = document.getElementById("startBtn");
  const gameContainer = document.getElementById("gameContainer");

  // ========== 游戏状态 ==========
  let roundOrder = [];
  let currentRoundIndex = 0;
  let currentCategory = "";
  let leftImages = [];
  let rightImages = [];
  let commonKey = "";
  let candidateKeys = [];
  let timerSeconds = 0;
  let timerInterval = null;
  let gameActive = false;
  let isWaiting = false;
  let bestRecords = {};
  const BEST_KEY = "duplicateMatch_best";

  // ========== 工具 ==========
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins}分 ${secs}秒`;
    return `${secs}秒`;
  }

  function loadBestRecord() {
    const stored = localStorage.getItem(BEST_KEY);
    if (stored) {
      try {
        bestRecords = JSON.parse(stored);
      } catch (e) {
        bestRecords = {};
      }
    }
    updateBestDisplay();
  }

  function saveBestRecord(seconds) {
    const key = "total";
    if (!bestRecords[key] || seconds < bestRecords[key]) {
      bestRecords[key] = seconds;
      localStorage.setItem(BEST_KEY, JSON.stringify(bestRecords));
      updateBestDisplay();
      return true;
    }
    return false;
  }

  function updateBestDisplay() {
    const key = "total";
    if (bestRecords[key] !== undefined && bestRecords[key] !== null) {
      bestDisplay.textContent = formatTime(bestRecords[key]);
    } else {
      bestDisplay.textContent = "—";
    }
  }

  // 三击删除最佳记录
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
          delete bestRecords["total"];
          localStorage.setItem(BEST_KEY, JSON.stringify(bestRecords));
          updateBestDisplay();
          message.textContent = "✅ 最佳记录已清除";
          setTimeout(() => {
            if (message.textContent === "✅ 最佳记录已清除")
              message.textContent = "";
          }, 1500);
        }
      }
    });
  }

  // ========== 计时器 ==========
  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startTimer() {
    stopTimer();
    timerSeconds = 0;
    timerDisplay.textContent = "0";
    timerInterval = setInterval(() => {
      timerSeconds++;
      timerDisplay.textContent = timerSeconds;
    }, 1000);
  }

  // ========== 从 wordData 获取某类别的单词列表 ==========
  function getWordsByCategory(category) {
    const result = [];
    for (const [key, value] of Object.entries(window.wordData)) {
      if (value.type === category) {
        result.push(key);
      }
    }
    return result;
  }

  // ========== 生成一局数据 ==========
  function generateRound(category) {
    const wordList = getWordsByCategory(category);
    // 需要至少 15 个不同的词（8+8-1=15）
    if (wordList.length < 15) {
      console.warn(
        `类别 ${category} 单词不足，需要至少15个，当前 ${wordList.length}`,
      );
      // 从其他类别补充
      const allWords = Object.keys(window.wordData);
      const shuffledAll = shuffleArray([...allWords]);
      for (const w of shuffledAll) {
        if (!wordList.includes(w) && wordList.length < 20) {
          wordList.push(w);
        }
      }
    }
    const shuffled = shuffleArray([...wordList]);
    // 选前 15 个不同的
    const selected = shuffled.slice(0, 15);
    // 再打乱，选第 0 个作为公共图
    const shuffledSelected = shuffleArray([...selected]);
    const common = shuffledSelected[0];
    const remaining = shuffledSelected.slice(1, 15);
    // 左区：公共 + 7 个
    const leftPool = shuffleArray([...remaining]);
    const left = [common, ...leftPool.slice(0, 7)];
    // 右区：公共 + 另外 7 个（从剩下的 7 个里取）
    const rightPool = leftPool.slice(7);
    const right = [common, ...rightPool.slice(0, 7)];

    // 左右分别打乱显示顺序
    const shuffledLeft = shuffleArray([...left]);
    const shuffledRight = shuffleArray([...right]);

    // 候选区：所有 15 个（并集），打乱
    const candidate = shuffleArray([...selected]);

    return {
      common: common,
      left: shuffledLeft,
      right: shuffledRight,
      candidate: candidate,
    };
  }

  // ========== 渲染 ==========
  function renderRound(data) {
    // 渲染左区（3-2-3 交错布局）
    leftGrid.innerHTML = "";
    renderPanel(leftGrid, data.left);

    // 渲染右区（3-2-3 交错布局）
    rightGrid.innerHTML = "";
    renderPanel(rightGrid, data.right);

    // 渲染候选区（3行5列）
    candidateGrid.innerHTML = "";
    data.candidate.forEach((key) => {
      const div = document.createElement("div");
      div.className = "candidate-img";
      div.dataset.key = key;
      const img = createImageElement(key);
      div.appendChild(img);
      div.addEventListener("click", () =>
        onCandidateClick(div, key, data.common),
      );
      candidateGrid.appendChild(div);
    });

    commonHint.innerHTML = `🔍 找出左右两区 <span class="highlight">唯一相同</span> 的那一张图！`;
  }

  // ===== 新增：渲染单个 Panel（3行，3-2-3布局） =====
  function renderPanel(container, images) {
    container.innerHTML = "";
    // 8张图按 3-2-3 交错排列
    // 索引 0,1,2 → 第1行（3张）
    // 索引 3,4   → 第2行（2张，缩进）
    // 索引 5,6,7 → 第3行（3张）
    for (let i = 0; i < images.length; i++) {
      const key = images[i] || "";
      const div = document.createElement("div");
      div.className = "panel-img";
      // 中间行（索引3、4）加缩进类
      if (i === 3) {
        div.classList.add("row2-col1");
      } else if (i === 4) {
        div.classList.add("row2-col2");
      }
      const img = createImageElement(key);
      div.appendChild(img);
      container.appendChild(div);
    }
  }

  function createImageElement(key) {
    const img = document.createElement("img");
    const wordData = window.wordData[key];
    if (wordData && wordData.image) {
      img.src = wordData.image;
      img.alt = key;
      img.onerror = () => {
        img.style.display = "none";
        const placeholder = document.createElement("span");
        placeholder.className = "placeholder";
        placeholder.textContent = key.substring(0, 3);
        img.parentNode.appendChild(placeholder);
      };
    } else {
      img.style.display = "none";
      const placeholder = document.createElement("span");
      placeholder.className = "placeholder";
      placeholder.textContent = key.substring(0, 3);
      img.parentNode.appendChild(placeholder);
    }
    return img;
  }

  // ========== 候选区点击 ==========
  function onCandidateClick(el, key, commonKey) {
    if (!gameActive || isWaiting) return;

    // 如果已选过，忽略
    if (el.classList.contains("disabled")) return;

    // 判断是否正确
    const isCorrect = key === commonKey;

    // 禁用所有候选区
    document
      .querySelectorAll(".candidate-img")
      .forEach((c) => c.classList.add("disabled"));

    if (isCorrect) {
      el.classList.add("correct");
      playSound("correct");
      // 爆炸效果
      const rect = el.getBoundingClientRect();
      showExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2);
      message.textContent = "🎉 正确！进入下一局！";
      isWaiting = true;
      setTimeout(() => {
        isWaiting = false;
        // 下一局
        if (currentRoundIndex < TOTAL_ROUNDS - 1) {
          currentRoundIndex++;
          loadRound(currentRoundIndex);
        } else {
          // 游戏结束
          endGame();
        }
      }, 1000);
    } else {
      el.classList.add("wrong");
      playSound("wrong");
      message.textContent = "❌ 再找找看！";
      isWaiting = true;
      setTimeout(() => {
        // 重置状态，重新启用候选区
        document.querySelectorAll(".candidate-img").forEach((c) => {
          c.classList.remove("wrong", "selected", "disabled");
        });
        isWaiting = false;
        message.textContent = "🔍 再试试！找出唯一相同的那一张！";
      }, 800);
    }
  }

  // ========== 爆炸效果 ==========
  function showExplosion(x, y) {
    const el = document.createElement("div");
    el.className = "explosion-effect";
    el.textContent = "💥✨";
    el.style.left = x + "px";
    el.style.top = y + "px";
    el.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 500);
  }

  // ========== 加载一局 ==========
  function loadRound(index) {
    const category = roundOrder[index];
    currentCategory = category;
    const data = generateRound(category);
    commonKey = data.common;
    roundDisplay.textContent = index + 1;
    message.textContent = `🔍 第 ${index + 1}/${TOTAL_ROUNDS} 局 · 类别: ${category}`;
    renderRound(data);
    // 启用候选区
    document
      .querySelectorAll(".candidate-img")
      .forEach((c) => c.classList.remove("disabled"));
    isWaiting = false;
  }

  // ========== 游戏结束 ==========
  function endGame() {
    gameActive = false;
    stopTimer();
    const isNewRecord = saveBestRecord(timerSeconds);

    // 禁用所有候选区
    document
      .querySelectorAll(".candidate-img")
      .forEach((c) => c.classList.add("disabled"));

    const overlay = document.createElement("div");
    overlay.className = "result-overlay";
    overlay.innerHTML = `
            <div class="result-card">
                <h2>🎉 通关成功！ 🎉</h2>
                <div class="final-label">总用时</div>
                <div class="final-time">${formatTime(timerSeconds)}</div>
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

  // ========== 重置游戏 ==========
  function resetGame() {
    stopTimer();
    timerSeconds = 0;
    timerDisplay.textContent = "0";
    currentRoundIndex = 0;
    isWaiting = false;
    gameActive = true;

    // 生成随机类别顺序
    roundOrder = shuffleArray([...CATEGORIES]);
    // 如果某个类别单词不够，替换
    for (let i = 0; i < roundOrder.length; i++) {
      const cat = roundOrder[i];
      const words = getWordsByCategory(cat);
      if (words.length < 15) {
        // 从其他类别补充
        const allWords = Object.keys(window.wordData);
        const shuffledAll = shuffleArray([...allWords]);
        let replaced = false;
        for (const w of shuffledAll) {
          const wCat = window.wordData[w]?.type;
          if (
            wCat &&
            !roundOrder.includes(wCat) &&
            getWordsByCategory(wCat).length >= 15
          ) {
            roundOrder[i] = wCat;
            replaced = true;
            break;
          }
        }
        if (!replaced) {
          // 如果还不行，用 fruit 兜底
          roundOrder[i] = "fruit";
        }
      }
    }

    // 移除所有结果浮层
    const existing = document.querySelector(".result-overlay");
    if (existing) existing.remove();

    // 重新开始计时
    startTimer();
    loadRound(0);
  }

  // ========== 启动游戏 ==========
  function startGame() {
    startOverlay.style.display = "none";
    gameContainer.style.display = "block";
    loadBestRecord();
    bindTripleClick();
    resetGame();
    bindGoHome(backHomeBtn);
  }

  // ========== 事件绑定 ==========
  startBtn.addEventListener("click", startGame);
})();

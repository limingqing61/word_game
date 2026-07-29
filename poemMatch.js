(function () {
  "use strict";

  // ========== 配置 ==========
  const TOTAL_QUESTIONS = 20;
  const SCORES = {
    firstHalf: 4, // 1-10 题
    secondHalf: 6, // 11-20 题
  };

  // 题目分布：每题的配对数量
  const QUESTION_CONFIG = [
    { pairs: 4, type: "five" }, // 1-5
    { pairs: 4, type: "seven" }, // 6-10
    { pairs: 6, type: "five" }, // 11-15
    { pairs: 6, type: "seven" }, // 16-20
  ];

  // 允许的诗类型
  const POEM_TYPES = ["five", "seven"];

  // ========== DOM ==========
  const poemContainer = document.getElementById("poemContainer");
  const correctCountEl = document.getElementById("correctCount");
  const wrongCountEl = document.getElementById("wrongCount");
  const totalScoreEl = document.getElementById("totalScore");
  const roundCountEl = document.getElementById("roundCount");
  const progressFillEl = document.getElementById("progressFill");
  const roundInfoEl = document.getElementById("roundInfo");
  const startOverlay = document.getElementById("startOverlay");
  const startBtn = document.getElementById("startBtn");
  const gameContainer = document.getElementById("gameContainer");
  const backHomeBtn = document.getElementById("backHomeBtn");

  // ========== 游戏状态 ==========
  let gameState = {
    correctCount: 0,
    wrongCount: 0,
    totalScore: 0,
    currentQuestion: 0,
    pairs: [],
    totalPairs: 0,
    selectedLeft: null,
    selectedRight: null,
    isAnswered: false,
    isRoundActive: true,
    streakCount: 0,
    wrongPoems: [],
  };

  // ========== 工具函数 ==========
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getPoemType(questionIndex) {
    // questionIndex 从 0 开始
    if (questionIndex < 5) return "five";
    if (questionIndex < 10) return "seven";
    if (questionIndex < 15) return "five";
    return "seven";
  }

  function getPairsCount(questionIndex) {
    if (questionIndex < 5) return 4;
    if (questionIndex < 10) return 4;
    if (questionIndex < 15) return 6;
    return 6;
  }

  function getScoreForQuestion(questionIndex) {
    return questionIndex < 10 ? SCORES.firstHalf : SCORES.secondHalf;
  }

  function getPoemDataByType(type) {
    // 五言或七言
    const source = type === "five" ? window.POEM_DATA5 : window.POEM_DATA7;
    if (!source) return [];
    return Object.entries(source).map(([title, data]) => ({
      title,
      author: data.author,
      dynasty: data.dynasty,
      content: data.content,
      index: data.index,
    }));
  }

  function extractLines(content, index) {
    // 按句号分割
    const sentences = content.split("。").filter((s) => s.trim().length > 0);
    // 如果 index 超出范围，取最后一句
    const targetIdx = Math.min(index, sentences.length - 1);
    const targetSentence = sentences[targetIdx] || sentences[0];
    // 按逗号分割
    const parts = targetSentence.split("，").filter((s) => s.trim().length > 0);
    if (parts.length < 2) {
      // 如果没有逗号，尝试按空格或其他分隔
      return [targetSentence, ""];
    }
    return [parts[0].trim(), parts[1].trim()];
  }

  function getPoemDisplayName(title, author, dynasty) {
    return `${dynasty}·${author}《${title}》`;
  }

  // ========== 生成题目 ==========
  function buildQuestion(questionIndex) {
    const type = getPoemType(questionIndex);
    const pairsCount = getPairsCount(questionIndex);
    const allPoems = getPoemDataByType(type);

    if (allPoems.length < pairsCount) {
      console.warn(
        `⚠️ ${type}言诗数量不足，需要 ${pairsCount} 首，实际 ${allPoems.length} 首`,
      );
      // 循环复用
    }

    // 随机选 pairsCount 首不同的诗
    const shuffled = shuffleArray([...allPoems]);
    const selected = [];
    for (let i = 0; i < pairsCount && i < shuffled.length; i++) {
      selected.push(shuffled[i]);
    }
    // 如果不够，循环补足
    while (selected.length < pairsCount) {
      for (const poem of shuffled) {
        if (selected.length >= pairsCount) break;
        if (!selected.includes(poem)) {
          selected.push(poem);
        }
      }
      // 如果还是不够，复制第一个
      if (selected.length < pairsCount && shuffled.length > 0) {
        selected.push({ ...shuffled[0] });
      }
    }

    const pairs = [];
    for (const poem of selected) {
      const [left, right] = extractLines(poem.content, poem.index);
      const displayName = getPoemDisplayName(
        poem.title,
        poem.author,
        poem.dynasty,
      );
      pairs.push({
        left: left,
        right: right,
        title: poem.title,
        author: poem.author,
        dynasty: poem.dynasty,
        displayName: displayName,
        // 用于发音
        leftFull: left,
        rightFull: right,
      });
    }

    // 打乱左右顺序
    const leftItems = shuffleArray([...pairs]);
    const rightItems = shuffleArray([...pairs]);

    return {
      type: type,
      pairs: pairs,
      leftItems: leftItems,
      rightItems: rightItems,
      pairsCount: pairsCount,
      score: getScoreForQuestion(questionIndex),
    };
  }

  // ========== 渲染 ==========
  function renderQuestion(q) {
    poemContainer.innerHTML = "";

    const leftCol = document.createElement("div");
    leftCol.className = "poem-column";
    const rightCol = document.createElement("div");
    rightCol.className = "poem-column";

    const charClass = q.type === "five" ? "five-char" : "seven-char";

    q.leftItems.forEach((pair, idx) => {
      const item = document.createElement("div");
      item.className = `poem-item ${charClass}`;
      item.dataset.pairId = idx;
      item.dataset.side = "left";
      item.dataset.matchId = pair.left + pair.right; // 唯一标识

      const textSpan = document.createElement("span");
      textSpan.className = "poem-text";
      textSpan.textContent = pair.left;
      item.appendChild(textSpan);

      // 发音按钮
      const speakBtn = document.createElement("button");
      speakBtn.className = "speak-btn";
      speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      speakBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        speakPoem(pair.left);
      });
      item.appendChild(speakBtn);

      item.addEventListener("click", () => handleItemClick(item, "left", pair));
      leftCol.appendChild(item);
    });

    q.rightItems.forEach((pair, idx) => {
      const item = document.createElement("div");
      item.className = `poem-item ${charClass}`;
      item.dataset.pairId = idx;
      item.dataset.side = "right";
      item.dataset.matchId = pair.left + pair.right;

      const textSpan = document.createElement("span");
      textSpan.className = "poem-text";
      textSpan.textContent = pair.right;
      item.appendChild(textSpan);

      const speakBtn = document.createElement("button");
      speakBtn.className = "speak-btn";
      speakBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      speakBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        speakPoem(pair.right);
      });
      item.appendChild(speakBtn);

      item.addEventListener("click", () =>
        handleItemClick(item, "right", pair),
      );
      rightCol.appendChild(item);
    });

    poemContainer.appendChild(leftCol);
    poemContainer.appendChild(rightCol);

    // 更新提示
    const typeLabel = q.type === "five" ? "五言" : "七言";
    roundInfoEl.textContent = `第 ${gameState.currentQuestion + 1}/${TOTAL_QUESTIONS} 题 · ${q.pairsCount} 句${typeLabel} · 每题 ${q.score} 分`;
    updateUI();
  }

  // ========== 发音 ==========
  function speakPoem(text) {
    if (window.SpeechHelper && window.SpeechHelper.speak) {
      window.SpeechHelper.speak(text, 0.7);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.7;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }

  // ========== 交互 ==========
  let selectedLeftItem = null;
  let selectedLeftPair = null;
  let selectedRightItem = null;

  function handleItemClick(item, side, pair) {
    if (gameState.isAnswered || !gameState.isRoundActive) return;
    if (item.classList.contains("matched")) return;

    if (side === "left") {
      if (selectedLeftItem) {
        selectedLeftItem.classList.remove("selected");
      }
      selectedLeftItem = item;
      selectedLeftPair = pair;
      item.classList.add("selected");
      if (selectedRightItem) {
        selectedRightItem.classList.remove("selected");
        selectedRightItem = null;
      }
    } else {
      if (!selectedLeftItem) return;
      if (item.classList.contains("matched")) return;

      const isMatch =
        selectedLeftPair.left === pair.left &&
        selectedLeftPair.right === pair.right;
      gameState.isAnswered = true;

      if (isMatch) {
        item.classList.add("matched");
        selectedLeftItem.classList.add("matched");
        selectedLeftItem.classList.remove("selected");

        const allMatched =
          document.querySelectorAll(".poem-item:not(.matched)").length === 0;
        if (allMatched) {
          // ===== 全部配对完成：加分 + 音效 =====
          gameState.correctCount++;
          gameState.streakCount++;
          gameState.totalScore += getScoreForQuestion(
            gameState.currentQuestion,
          );
          updateUI();
          playSound("correct");

          if (gameState.streakCount >= 5) {
            showCelebration(() => {
              gameState.streakCount = 0;
              advanceQuestion();
            });
          } else {
            setTimeout(advanceQuestion, 1000);
          }
        } else {
          gameState.isAnswered = false;
          selectedLeftItem = null;
          selectedLeftPair = null;
          selectedRightItem = null;
        }
      } else {
        item.classList.add("wrong");
        selectedLeftItem.classList.add("wrong");
        gameState.wrongCount++;
        gameState.streakCount = 0;
        const wrongEntry = {
          left: selectedLeftPair.left,
          right: selectedLeftPair.right,
          title: selectedLeftPair.title,
          author: selectedLeftPair.author,
          dynasty: selectedLeftPair.dynasty,
        };
        gameState.wrongPoems.push(wrongEntry);
        updateUI();
        playSound("wrong");

        const allItems = document.querySelectorAll(".poem-item");
        allItems.forEach((el) => {
          const sideAttr = el.dataset.side;
          const matchId = el.dataset.matchId;
          if (sideAttr === "left") {
            const rightMatch = document.querySelector(
              `.poem-item[data-side="right"][data-matchid="${matchId}"]`,
            );
            if (rightMatch && !rightMatch.classList.contains("matched")) {
              rightMatch.classList.add("correct-highlight");
            }
          }
        });

        setTimeout(() => {
          document
            .querySelectorAll(".poem-item.wrong")
            .forEach((el) => el.classList.remove("wrong"));
          document
            .querySelectorAll(".poem-item.correct-highlight")
            .forEach((el) => el.classList.remove("correct-highlight"));
          gameState.isAnswered = false;
          selectedLeftItem = null;
          selectedLeftPair = null;
          selectedRightItem = null;
          advanceQuestion();
        }, 1200);
      }
    }
  }

  function advanceQuestion() {
    gameState.currentQuestion++;
    if (gameState.currentQuestion >= TOTAL_QUESTIONS) {
      showResult();
    } else {
      startRound(gameState.currentQuestion);
    }
  }

  // ========== 计分板 ==========
  function updateUI() {
    correctCountEl.textContent = gameState.correctCount;
    wrongCountEl.textContent = gameState.wrongCount;
    totalScoreEl.textContent = gameState.totalScore;
    roundCountEl.textContent = `${gameState.currentQuestion}/${TOTAL_QUESTIONS}`;
    const percent = (gameState.currentQuestion / TOTAL_QUESTIONS) * 100;
    progressFillEl.style.width = `${percent}%`;
  }

  // ========== 开始一轮 ==========
  function startRound(questionIndex) {
    gameState.isAnswered = false;
    gameState.isRoundActive = true;
    selectedLeftItem = null;
    selectedLeftPair = null;

    const q = buildQuestion(questionIndex);
    renderQuestion(q);
    updateUI();
  }

  // ========== 彩蛋 ==========
  function showCelebration(callback) {
    const msgs = ["Very Well!", "Great job!", "Fantastic!", "Amazing!"];
    const overlay = document.createElement("div");
    overlay.className = "celebration-overlay";
    overlay.style.cssText =
      "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.7); display:flex; align-items:center; justify-content:center; z-index:10000;";
    overlay.innerHTML = `<div style="background:white; padding:30px; border-radius:60px; font-size:2rem;">🎉 ${msgs[Math.floor(Math.random() * msgs.length)]} 🎉</div>`;
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.remove();
      if (callback) callback();
    }, 1200);
  }

  // ========== 结果 ==========
  function showResult() {
    gameState.isRoundActive = false;
    const maxScore = 10 * 4 + 10 * 6;

    // 对错题本去重
    const uniqueWrong = [];
    const seen = new Set();
    gameState.wrongPoems.forEach((w) => {
      const key = w.left + w.right;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueWrong.push(w);
      }
    });

    let wrongHtml = "";
    if (uniqueWrong.length > 0) {
      wrongHtml = `
                <div style="margin-top:20px; background:#fff3e0; border-radius:30px; padding:16px; max-height:200px; overflow-y:auto; width:100%;">
                    <div style="font-weight:bold; color:#E65100; margin-bottom:10px;">📖 错题本 (${uniqueWrong.length} 个)</div>
                    ${uniqueWrong
                      .map(
                        (w) => `
                        <div style="display:flex; justify-content:space-between; padding:6px 10px; background:white; border-radius:10px; margin-bottom:6px; font-size:0.9rem; border:1px solid #FF9800;">
                            <span style="color:#333;">${w.left}</span>
                            <span style="color:#4CAF50;">→</span>
                            <span style="color:#333;">${w.right}</span>
                            <span style="color:#999; font-size:0.75rem;">${w.dynasty}·${w.author}</span>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            `;
    }

    const overlay = document.createElement("div");
    overlay.className = "poem-result-overlay";
    overlay.innerHTML = `
            <div class="poem-result-card">
                <h2>🎉 闯关完成！</h2>
                <div class="final-label">最终得分</div>
                <div class="final-score">${gameState.totalScore} / ${maxScore}</div>
                ${wrongHtml}
                <div class="poem-result-buttons">
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
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.totalScore = 0;
    gameState.currentQuestion = 0;
    gameState.streakCount = 0;
    gameState.wrongPoems = [];
    startRound(0);
  }

  // ========== 启动 ==========
  function initAndStart() {
    startOverlay.style.display = "none";
    gameContainer.style.display = "block";
    bindGoHome(backHomeBtn);
    resetGame();
  }

  startBtn.addEventListener("click", initAndStart);
})();

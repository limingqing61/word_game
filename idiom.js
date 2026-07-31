(function () {
  "use strict";

  // ========== 配置 ==========
  const TOTAL_QUESTIONS = 20;
  const POINTS_PER_CORRECT = 5;
  const MAX_SCORE = 100;

  // 允许的类别
  const ALLOWED_TYPES = ["animal", "number", "nature", "color"];

  // ========== DOM ==========
  const idiomDisplay = document.getElementById("idiomDisplay");
  const meaningDisplay = document.getElementById("meaningDisplay");
  const optionsContainer = document.getElementById("optionsContainer");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const progressDisplay = document.getElementById("progressDisplay");
  const feedback = document.getElementById("feedback");
  const startOverlay = document.getElementById("startOverlay");
  const startBtn = document.getElementById("startBtn");
  const gameContainer = document.getElementById("gameContainer");
  const backHomeBtn = document.getElementById("backHomeBtn");

  // ========== 游戏状态 ==========
  let allQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let isAnswered = false;
  let gameActive = false;
  let bestRecord = null;
  const BEST_KEY = "idiomMaster_best";

  // ========== 工具函数 ==========
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getWordChinese(wordKey) {
    if (window.wordData && window.wordData[wordKey]) {
      return window.wordData[wordKey].chinese || wordKey;
    }
    return wordKey;
  }

  function getWordImage(wordKey) {
    if (window.wordData && window.wordData[wordKey]) {
      return window.wordData[wordKey].image || "";
    }
    return "";
  }

  function isValidIdiom(idiomKey, data) {
    const words = data.words;
    for (const [pos, wordKey] of Object.entries(words)) {
      if (!window.wordData || !window.wordData[wordKey]) {
        console.warn(
          `⚠️ 成语「${idiomKey}」中的「${wordKey}」不在 wordData 中，已跳过`,
        );
        return false;
      }
    }
    return true;
  }

  function getWordsByType(type) {
    if (!window.wordData) return [];
    const result = [];
    for (const [key, info] of Object.entries(window.wordData)) {
      if (info.type === type) {
        result.push(key);
      }
    }
    return result;
  }

  function renderOptions(options) {
    optionsContainer.innerHTML = "";
    options.forEach((wordKey) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.dataset.word = wordKey;

      const img = document.createElement("img");
      const imgPath = getWordImage(wordKey);
      if (imgPath) {
        img.src = imgPath;
        img.alt = wordKey;
        img.onerror = () => {
          img.style.display = "none";
          const fallback = document.createElement("span");
          fallback.className = "option-label";
          fallback.textContent = getWordChinese(wordKey);
          btn.appendChild(fallback);
        };
        btn.appendChild(img);
      } else {
        const fallback = document.createElement("span");
        fallback.className = "option-label";
        fallback.textContent = getWordChinese(wordKey);
        btn.appendChild(fallback);
      }

      const label = document.createElement("div");
      label.className = "option-label";
      label.textContent = getWordChinese(wordKey);
      btn.appendChild(label);

      btn.addEventListener("click", () => handleOptionClick(btn, wordKey));
      optionsContainer.appendChild(btn);
    });
  }

  // ========== 生成题目 ==========
  function buildQuestions() {
    if (!window.IDIOM_DATA) {
      console.error("❌ IDIOM_DATA 未加载");
      return [];
    }

    const allIdioms = Object.entries(window.IDIOM_DATA);
    const validIdioms = [];

    for (const [idiomKey, data] of allIdioms) {
      if (!ALLOWED_TYPES.includes(data.type)) continue;
      if (!isValidIdiom(idiomKey, data)) continue;
      validIdioms.push({ idiomKey, data });
    }

    if (validIdioms.length === 0) {
      console.error("❌ 没有有效的成语数据");
      return [];
    }

    const shuffled = shuffleArray([...validIdioms]);
    const selected = shuffled.slice(
      0,
      Math.min(TOTAL_QUESTIONS, shuffled.length),
    );

    return selected.map(({ idiomKey, data }) => {
      const wordEntries = Object.entries(data.words);
      const allPositions = wordEntries.map(([posStr, wordKey]) => ({
        position: parseInt(posStr),
        wordKey: wordKey,
      }));

      // 生成显示文本：所有空都显示为 _
      const chars = idiomKey.split("");
      const displayChars = chars.map((ch, idx) => {
        const isBlank = wordEntries.some(
          ([posStr]) => parseInt(posStr) === idx,
        );
        if (isBlank) {
          return { type: "blank", char: ch };
        }
        return { type: "char", char: ch };
      });

      // ===== 生成固定选项：包含所有正确答案 + 干扰项 =====
      const allCorrectSet = new Set(allPositions.map((p) => p.wordKey));
      const firstBlank = allPositions[0];
      const sameTypeWords = getWordsByType(data.type);
      const distractors = sameTypeWords
        .filter((w) => !allCorrectSet.has(w))
        .sort(() => Math.random() - 0.5)
        .slice(0, 6 - allPositions.length);

      let options = [...allCorrectSet, ...distractors];
      if (options.length < 6) {
        const allWords = Object.keys(window.wordData || {});
        const extra = allWords
          .filter(
            (w) => !options.includes(w) && window.wordData[w]?.type !== "time",
          )
          .sort(() => Math.random() - 0.5);
        for (const w of extra) {
          if (options.length >= 6) break;
          if (!options.includes(w)) options.push(w);
        }
      }
      options = shuffleArray(options);

      return {
        idiomKey,
        meaning: data.meaning,
        type: data.type,
        allPositions,
        displayChars,
        allCorrectWords: allPositions.map((p) => p.wordKey),
        fixedOptions: options,
        filledPositions: [],
      };
    });
  }

  // ========== UI 更新 ==========
  function updateUI() {
    scoreDisplay.textContent = score;
    progressDisplay.textContent = `${currentIndex}/${allQuestions.length}`;
  }

  function showQuestion() {
    if (currentIndex >= allQuestions.length) {
      showResult();
      return;
    }

    isAnswered = false;
    gameActive = true;
    feedback.textContent = "";
    feedback.className = "feedback";

    const q = allQuestions[currentIndex];
    q.filledPositions = [];

    // 渲染成语（所有空显示为 _）
    const chars = q.idiomKey.split("");
    let html = "";
    for (let i = 0; i < chars.length; i++) {
      const isBlank = q.allPositions.some((p) => p.position === i);
      if (isBlank) {
        html += `<span class="blank" spellcheck="false">_</span>`;
      } else {
        html += `<span>${chars[i]}</span>`;
      }
    }
    idiomDisplay.innerHTML = html;

    meaningDisplay.textContent = `💡 ${q.meaning}`;

    // 使用固定选项
    renderOptions(q.fixedOptions);
    updateUI();
  }

  function handleOptionClick(btn, selected) {
    if (isAnswered || !gameActive) return;

    const q = allQuestions[currentIndex];

    // 找到第一个未填的空
    let currentBlankIndex = -1;
    for (let i = 0; i < q.allPositions.length; i++) {
      const pos = q.allPositions[i].position;
      if (!q.filledPositions.includes(pos)) {
        currentBlankIndex = i;
        break;
      }
    }

    if (currentBlankIndex === -1) return;

    const currentBlank = q.allPositions[currentBlankIndex];
    const isCorrect = selected === currentBlank.wordKey;

    // 禁用所有选项（防止快速连点）
    document
      .querySelectorAll(".option-btn")
      .forEach((b) => (b.disabled = true));

    if (isCorrect) {
      // 填对了：记录这个空
      q.filledPositions.push(currentBlank.position);

      // 标记当前选中的按钮为正确（视觉反馈）
      btn.classList.add("correct");

      // 更新显示：把这个空填上
      const chars = q.idiomKey.split("");
      let html = "";
      for (let i = 0; i < chars.length; i++) {
        const isBlank = q.allPositions.some((p) => p.position === i);
        if (isBlank) {
          const isFilled = q.filledPositions.includes(i);
          if (isFilled) {
            const originalChar = chars[i];
            html += `<span class="blank" style="color:#4CAF50; border-bottom-color:#4CAF50;" spellcheck="false">${originalChar}</span>`;
          } else {
            html += `<span class="blank" spellcheck="false">_</span>`;
          }
        } else {
          html += `<span>${chars[i]}</span>`;
        }
      }
      idiomDisplay.innerHTML = html;

      // 检查是否所有空都填完了
      const allFilled = q.allPositions.every((p) =>
        q.filledPositions.includes(p.position),
      );

      if (allFilled) {
        // 全部填对！通关！
        isAnswered = true;
        gameActive = false;
        score += POINTS_PER_CORRECT;
        updateUI();
        feedback.textContent = `✅ 完美！ +${POINTS_PER_CORRECT} 分`;
        feedback.className = "feedback correct";
        playSound("correct");

        setTimeout(() => {
          currentIndex++;
          showQuestion();
        }, 1500);
      } else {
        // 还有空没填，继续
        feedback.textContent = `✅ 正确！继续填下一个空！`;
        feedback.className = "feedback correct";
        playSound("correct");

        // ===== 重新启用所有选项（不禁用任何选项） =====
        document.querySelectorAll(".option-btn").forEach((b) => {
          b.disabled = false;
          b.style.opacity = "1";
        });
      }
    } else {
      // 填错了：直接失败
      isAnswered = true;
      gameActive = false;
      btn.classList.add("wrong");

      // 高亮正确答案（当前空）
      document.querySelectorAll(".option-btn").forEach((b) => {
        if (b.dataset.word === currentBlank.wordKey) {
          b.classList.add("correct");
        }
      });

      const chinese = getWordChinese(currentBlank.wordKey);
      feedback.textContent = `❌ 错误！正确答案是「${chinese}」`;
      feedback.className = "feedback wrong";
      playSound("wrong");

      // 显示所有空（已填的保留，未填的显示正确答案红色）
      const chars = q.idiomKey.split("");
      let html = "";
      for (let i = 0; i < chars.length; i++) {
        const isBlank = q.allPositions.some((p) => p.position === i);
        if (isBlank) {
          const isFilled = q.filledPositions.includes(i);
          if (isFilled) {
            const originalChar = chars[i];
            html += `<span class="blank" style="color:#4CAF50; border-bottom-color:#4CAF50;" spellcheck="false">${originalChar}</span>`;
          } else {
            const originalChar = chars[i];
            html += `<span class="blank" style="color:#f44336; border-bottom-color:#f44336;" spellcheck="false">${originalChar}</span>`;
          }
        } else {
          html += `<span>${chars[i]}</span>`;
        }
      }
      idiomDisplay.innerHTML = html;

      setTimeout(() => {
        currentIndex++;
        showQuestion();
      }, 1500);
    }
  }

  // ========== 结束 ==========
  function showResult() {
    gameActive = false;

    const overlay = document.createElement("div");
    overlay.className = "result-overlay";
    overlay.innerHTML = `
            <div class="result-card">
                <h2>🏆 闯关完成！</h2>
                <div class="final-label">最终得分</div>
                <div class="final-score">${score} / ${MAX_SCORE}</div>
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

    currentIndex = 0;
    score = 0;
    allQuestions = buildQuestions();
    updateUI();

    if (allQuestions.length === 0) {
      idiomDisplay.textContent = "⚠️ 暂无成语数据";
      meaningDisplay.textContent = "请检查 idiomData.js 是否正确加载";
      optionsContainer.innerHTML = "";
      feedback.textContent = "❌ 数据加载失败";
      feedback.className = "feedback wrong";
      return;
    }

    showQuestion();
  }

  // ========== 启动 ==========
  function initAndStart() {
    startOverlay.style.display = "none";
    gameContainer.style.display = "block";
    bindGoHome(backHomeBtn);
    resetGame();
  }

  // ========== 事件绑定 ==========
  startBtn.addEventListener("click", initAndStart);
})();

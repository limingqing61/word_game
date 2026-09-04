(function () {
  "use strict";

  // ========== DOM 引用 ==========
  const startOverlay = document.getElementById("startOverlay");
  const startBtn = document.getElementById("startBtn");
  const gameContainer = document.getElementById("gameContainer");
  const questionContainer = document.getElementById("questionContainer");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const progressDisplay = document.getElementById("progressDisplay");
  const speakHintLeft = document.getElementById("speakHintLeft");
  const letterHintLeft = document.getElementById("letterHintLeft");
  const backHomeBtn = document.getElementById("backHomeBtn");

  // ========== 游戏状态 ==========
  const STATE = {
    questions: [],
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    skipCount: 0,
    wrongWords: [], // 记录答错或跳过的单词对象
    // 提示剩余次数（全局）
    speakRemaining: 2,
    letterRemaining: 2,
    // 当前题目是否已使用某类提示（每题重置）
    currentSpeakUsed: false,
    currentHintUsed: false,
    answered: false,
  };

  // ========== 工具：判断是否包含元音 ==========
  function hasVowel(word) {
    return /[aeiou]/i.test(word);
  }

  // ========== 工具：获取单词信息（安全） ==========
  function getWordInfo(word) {
    const data = window.wordData && window.wordData[word];
    if (data) {
      return {
        word: word,
        chinese: data.chinese || word,
        image: data.image || "",
        phonetic: data.phonetic || "",
      };
    }
    return { word, chinese: word, image: "", phonetic: "" };
  }

  // ========== 生成题目（15题：10短+5长，打乱） ==========
  function generateQuestions() {
    if (!window.wordList || !window.wordList.length) {
      console.error("wordList not loaded");
      return [];
    }

    const candidates = window.wordList.filter((item) => hasVowel(item.word));

    if (candidates.length < 15) {
      console.warn("候选单词少于15个，将重复使用");
      while (candidates.length < 15) {
        const extra = window.wordList.filter((item) => hasVowel(item.word));
        if (extra.length) candidates.push(extra[0]);
        else break;
      }
    }

    function shuffle(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    const shuffled = shuffle([...candidates]);
    const short = shuffled.filter((item) => item.word.length <= 6);
    const long = shuffled.filter((item) => item.word.length > 6);

    let selectedShort = shuffle(short).slice(0, 10);
    let selectedLong = shuffle(long).slice(0, 5);
    let combined = [...selectedShort, ...selectedLong];

    if (combined.length < 15) {
      const usedWords = new Set(combined.map((w) => w.word));
      const pool = candidates.filter((w) => !usedWords.has(w.word));
      const needed = 15 - combined.length;
      for (let i = 0; i < Math.min(needed, pool.length); i++) {
        combined.push(pool[i]);
      }
    }

    const finalQuestions = shuffle(combined).slice(0, 15);
    return finalQuestions.map((item) => {
      const len = item.word.length;
      const points = len > 6 ? 8 : 6;
      return {
        word: item.word,
        chinese: item.chinese || "",
        image: item.image || "",
        phonetic: item.phonetic || "",
        points: points,
        length: len,
      };
    });
  }

  // ========== 渲染当前题目 ==========
  function renderQuestion() {
    const q = STATE.questions[STATE.currentIndex];
    if (!q) {
      showGameComplete();
      return;
    }

    // 重置当前题目的提示使用标记
    STATE.currentSpeakUsed = false;
    STATE.currentHintUsed = false;
    STATE.answered = false;

    progressDisplay.textContent = `${STATE.currentIndex + 1}/${STATE.questions.length}`;
    scoreDisplay.textContent = STATE.score;
    speakHintLeft.textContent = STATE.speakRemaining;
    letterHintLeft.textContent = STATE.letterRemaining;

    let html = `
      <div class="question-card">
        <img src="${q.image}" alt="${q.word}" onerror="this.style.display='none'">
        <div class="chinese-hint">${q.chinese}</div>

        <div class="spell-input-area">
          <input type="text" id="wordInput" placeholder="输入单词..." autofocus>
        </div>

        <div class="hint-display" id="hintDisplay">💡 点击「辅音提示」显示</div>

        <div class="action-buttons">
          <button class="action-btn speak" id="speakBtn" ${STATE.speakRemaining <= 0 ? "disabled" : ""}>
            <i class="fas fa-volume-up"></i> 发音
          </button>
          <button class="action-btn hint" id="hintBtn" ${STATE.letterRemaining <= 0 ? "disabled" : ""}>
            <i class="fas fa-lightbulb"></i> 辅音提示
          </button>
          <button class="action-btn submit" id="submitBtn">
            <i class="fas fa-check"></i> 提交
          </button>
          <button class="action-btn skip" id="skipBtn">
            <i class="fas fa-forward"></i> 跳过
          </button>
        </div>

        <div id="resultArea" style="margin-top:12px;"></div>
      </div>
    `;

    questionContainer.innerHTML = html;

    // 绑定事件
    const wordInput = document.getElementById("wordInput");
    const speakBtn = document.getElementById("speakBtn");
    const hintBtn = document.getElementById("hintBtn");
    const submitBtn = document.getElementById("submitBtn");
    const skipBtn = document.getElementById("skipBtn");

    // 发音（按题目计数）
    speakBtn.addEventListener("click", function () {
      if (STATE.answered) return;
      if (STATE.speakRemaining <= 0) return;
      SpeechHelper.speak(q.word);
      // 只有该题第一次点击发音才扣减次数
      if (!STATE.currentSpeakUsed) {
        STATE.speakRemaining--;
        STATE.currentSpeakUsed = true;
        speakHintLeft.textContent = STATE.speakRemaining;
        if (STATE.speakRemaining <= 0) this.disabled = true;
      }
    });

    // 辅音提示（按题目计数）
    hintBtn.addEventListener("click", function () {
      if (STATE.answered) return;
      if (STATE.letterRemaining <= 0) return;
      const hint = generateConsonantHint(q.word);
      document.getElementById("hintDisplay").textContent = hint;
      if (!STATE.currentHintUsed) {
        STATE.letterRemaining--;
        STATE.currentHintUsed = true;
        letterHintLeft.textContent = STATE.letterRemaining;
        if (STATE.letterRemaining <= 0) this.disabled = true;
      }
    });

    // 提交
    submitBtn.addEventListener("click", function () {
      if (STATE.answered) return;
      const userInput = wordInput.value.trim();
      checkAnswer(q, userInput);
    });

    // 跳过（将单词加入错题本）
    skipBtn.addEventListener("click", function () {
      if (STATE.answered) return;
      STATE.skipCount++;
      // 将当前单词加入错题本（可重复，最终展示去重）
      STATE.wrongWords.push(q);
      playSound("click");
      goToNextQuestion();
    });

    // 回车提交
    wordInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!STATE.answered) {
          submitBtn.click();
        }
      }
    });

    setTimeout(() => wordInput.focus(), 100);
  }

  // ========== 生成辅音提示 ==========
  function generateConsonantHint(word) {
    const vowels = new Set(["a", "e", "i", "o", "u"]);
    let hint = "";
    for (let ch of word.toLowerCase()) {
      if (vowels.has(ch)) {
        hint += "_ ";
      } else {
        hint += ch + " ";
      }
    }
    return hint.trim();
  }

  // ========== 检查答案 ==========
  function checkAnswer(q, userInput) {
    if (STATE.answered) return;
    STATE.answered = true;

    const correct = q.word.toLowerCase();
    const user = userInput.toLowerCase().trim();
    const isCorrect = user === correct;

    if (isCorrect) {
      STATE.score += q.points;
      STATE.correctCount++;
      playSound("correct");
    } else {
      STATE.wrongCount++;
      STATE.wrongWords.push(q);
      playSound("wrong");
    }

    // 显示结果
    const resultArea = document.getElementById("resultArea");
    if (resultArea) {
      const icon = isCorrect ? "✅" : "❌";
      const msg = isCorrect ? "正确！" : `错误，正确答案是：`;
      resultArea.innerHTML = `
        <div class="result-display ${isCorrect ? "correct" : "wrong"}">
          ${icon} ${msg} <strong>${q.word}</strong>
          <span class="phonetic">${q.phonetic}</span>
        </div>
      `;
    }

    // 禁用控件
    document.getElementById("wordInput").disabled = true;
    document
      .getElementById("wordInput")
      .classList.add(isCorrect ? "correct" : "wrong");
    document.getElementById("speakBtn").disabled = true;
    document.getElementById("hintBtn").disabled = true;
    document.getElementById("submitBtn").disabled = true;
    document.getElementById("skipBtn").disabled = true;

    scoreDisplay.textContent = STATE.score;

    setTimeout(() => {
      goToNextQuestion();
    }, 1800);
  }

  // ========== 下一题 ==========
  function goToNextQuestion() {
    STATE.currentIndex++;
    if (STATE.currentIndex >= STATE.questions.length) {
      showGameComplete();
    } else {
      renderQuestion();
    }
  }

  // ========== 游戏结束 ==========
  function showGameComplete() {
    const total = STATE.questions.length;
    const correct = STATE.correctCount;
    const wrong = STATE.wrongCount;
    const skipped = STATE.skipCount;
    const score = STATE.score;

    // 错题本去重（按单词去重）
    const unique = [];
    const seen = new Set();
    STATE.wrongWords.forEach((w) => {
      if (!seen.has(w.word)) {
        seen.add(w.word);
        unique.push(w);
      }
    });

    let wrongHtml = "";
    if (unique.length) {
      wrongHtml = `
        <div class="wrong-words-section">
          <h3><i class="fas fa-book"></i> 需要复习 (${unique.length})</h3>
          <div class="wrong-words-list">
            ${unique
              .map(
                (w) => `
              <div class="wrong-word-item">
                <img src="${w.image}" style="width:60px;height:60px;object-fit:contain" onerror="this.style.display='none'">
                <div class="wrong-word-info">
                  <div class="wrong-word-text">${w.word}</div>
                  <div class="wrong-word-phonetic">${w.phonetic}</div>
                  <div class="wrong-word-chinese">${w.chinese}</div>
                </div>
                <div class="wrong-word-buttons">
                  <button class="wrong-word-btn" onclick="SpeechHelper.speak('${w.word}')">
                    <i class="fas fa-volume-up"></i>
                  </button>
                  <button class="wrong-word-fav-btn" data-word="${w.word}">
                    <i class="fa-regular fa-floppy-disk"></i>
                  </button>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        </div>
      `;
    }

    const completeHtml = `
      <div class="game-complete">
        <h2><i class="fas fa-trophy"></i> 挑战完成！</h2>
        <div class="final-score">
          <span style="color:#4CAF50;">✅ 正确 ${correct}</span> |
          <span style="color:#F44336;">❌ 错误 ${wrong}</span> |
          <span style="color:#FF9800;">⏭️ 跳过 ${skipped}</span>
        </div>
        <div class="final-score" style="font-size:2rem; color:#ff3366;">
          ⭐ 总分 ${score} / 100
        </div>
        ${wrongHtml}
        <div class="btn-group">
          <button class="restart" id="restartBtn"><i class="fas fa-redo"></i> 再来一局</button>
          <button class="home" id="homeBtn"><i class="fas fa-home"></i> 返回首页</button>
        </div>
      </div>
    `;

    questionContainer.innerHTML = completeHtml;

    // 绑定错题本的收藏按钮（参考 listening.js）
    document.querySelectorAll(".wrong-word-fav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const word = btn.dataset.word;
        if (typeof showAddToFavoritesDialog === "function") {
          showAddToFavoritesDialog(word);
        } else {
          alert(`收藏单词 "${word}" 功能需要从单词表页面使用`);
        }
      });
    });

    document.getElementById("restartBtn").addEventListener("click", initGame);
    document.getElementById("homeBtn").addEventListener("click", goHome);

    if (backHomeBtn) backHomeBtn.style.display = "none";
    showConfetti();
  }

  // ========== 游戏初始化 ==========
  function initGame() {
    STATE.currentIndex = 0;
    STATE.score = 0;
    STATE.correctCount = 0;
    STATE.wrongCount = 0;
    STATE.skipCount = 0;
    STATE.wrongWords = [];
    STATE.speakRemaining = 2;
    STATE.letterRemaining = 2;
    STATE.currentSpeakUsed = false;
    STATE.currentHintUsed = false;
    STATE.answered = false;

    STATE.questions = generateQuestions();

    if (STATE.questions.length === 0) {
      questionContainer.innerHTML = `<div style="text-align:center;padding:40px;">⚠️ 没有可用的单词，请检查 wordData</div>`;
      return;
    }

    startOverlay.style.display = "none";
    gameContainer.style.display = "block";
    if (backHomeBtn) backHomeBtn.style.display = "";

    renderQuestion();
  }

  // ========== 启动 ==========
  startBtn.addEventListener("click", initGame);

  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", goHome);
  }

  // ========== 撒花效果 ==========
  function showConfetti() {
    const colors = ["#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0", "#A29BFE"];
    for (let i = 0; i < 60; i++) {
      const conf = document.createElement("div");
      conf.style.cssText = `
        position:fixed; width:10px; height:10px;
        background:${colors[i % colors.length]};
        left:${Math.random() * 100}vw;
        top:-10px;
        border-radius:50%;
        pointer-events:none;
        z-index:9999;
        opacity:1;
      `;
      document.body.appendChild(conf);
      const anim = conf.animate(
        [
          { transform: "translateY(0) rotate(0deg)", opacity: 1 },
          {
            transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 720}deg)`,
            opacity: 0,
          },
        ],
        { duration: 1500 + Math.random() * 1500 },
      );
      anim.onfinish = () => conf.remove();
    }
  }

  // ========== 确保 goHome / playSound 存在 ==========
  if (typeof goHome !== "function") {
    window.goHome = function () {
      window.location.href = "index.html";
    };
  }
  if (typeof playSound !== "function") {
    window.playSound = function (type) {
      /* no-op */
    };
  }
})();

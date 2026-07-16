(function () {
  const TOTAL_QUESTIONS = 20;
  const POINTS_PER_CORRECT = 5;
  const STREAK_CELEBRATION = 5;

  const correctCountSpan = document.getElementById("correctCount");
  const wrongCountSpan = document.getElementById("wrongCount");
  const totalScoreSpan = document.getElementById("totalScore");
  const progressCountSpan = document.getElementById("progressCount");

  const backBtn = document.getElementById("backBtn");
  const repeatBtn = document.getElementById("repeatBtn");
  const slowBtn = document.getElementById("slowBtn");
  const oppositeImage = document.getElementById("oppositeImage");
  const leftArea = document.getElementById("leftClickArea");
  const rightArea = document.getElementById("rightClickArea");
  const feedback = document.getElementById("feedback");
  const gameArea = document.getElementById("gameArea");
  const resultArea = document.getElementById("resultArea");
  const gameContainer = document.getElementById("gameContainer");
  const startOverlay = document.getElementById("startOverlay");
  const startBtn = document.getElementById("startBtn");

  // 唤醒音频上下文（iOS 需要）
  let audioContext = null;
  let audioAllowed = false;

  function wakeUpAudio() {
    if (audioAllowed) return;
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      // 播放一个极短的无声音频来激活 AudioContext
      const silentOsc = audioContext.createOscillator();
      const silentGain = audioContext.createGain();
      silentGain.gain.value = 0;
      silentOsc.connect(silentGain);
      silentGain.connect(audioContext.destination);
      silentOsc.start();
      silentOsc.stop(audioContext.currentTime + 0.01);
      audioContext.resume();
      audioAllowed = true;
    } catch (e) {
      console.warn("AudioContext wake up failed", e);
    }
  }

  let gameState = {
    score: 0,
    correct: 0,
    wrong: 0,
    streak: 0,
    currentIndex: 0,
    questions: [],
    isAnswered: false,
    currentQuestionData: null,
    wrongList: [],
  };

  function getOppositePairs() {
    if (window.oppositePairs && window.oppositePairs.length) {
      return window.oppositePairs;
    }
    console.error("❌ oppositePairs 未加载");
    return [];
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function buildQuestions() {
    const allPairs = getOppositePairs();
    if (allPairs.length === 0) return [];
    const shuffled = shuffleArray([...allPairs]);
    const selected = shuffled.slice(0, TOTAL_QUESTIONS);
    return selected.map((pair) => {
      const targetSide = Math.random() < 0.5 ? "left" : "right";
      const targetWord = targetSide === "left" ? pair.left : pair.right;
      const oppositeWord = targetSide === "left" ? pair.right : pair.left;
      return {
        image: `opposite/${pair.name}.jpeg`,
        targetSide,
        targetWord,
        oppositeWord,
        leftWord: pair.left,
        rightWord: pair.right,
        leftChinese: pair.leftChinese || "",
        rightChinese: pair.rightChinese || "",
        leftPhonetic: pair.leftPhonetic || "",
        rightPhonetic: pair.rightPhonetic || "",
      };
    });
  }

  function speakPair(target, opposite, rate = 0.7) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(
      `this is ${target}, not ${opposite}`,
    );
    utter.lang = "en-US";
    utter.rate = rate;
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find((v) => v.name === "Samantha");
    if (enVoice) utter.voice = enVoice;
    window.speechSynthesis.speak(utter);
  }

  function playCurrentQuestion(rate = 0.7) {
    if (!gameState.currentQuestionData) return;
    const q = gameState.currentQuestionData;
    speakPair(q.targetWord, q.oppositeWord, rate);
  }

  function updateUI() {
    correctCountSpan.textContent = gameState.correct;
    wrongCountSpan.textContent = gameState.wrong;
    totalScoreSpan.textContent = gameState.score;
    progressCountSpan.textContent = `${gameState.currentIndex}/${TOTAL_QUESTIONS}`;
  }

  function showQuestion() {
    if (gameState.currentIndex >= TOTAL_QUESTIONS) {
      showGameComplete();
      return;
    }

    gameState.isAnswered = false;
    feedback.textContent = "";
    const q = gameState.questions[gameState.currentIndex];
    if (!q) return;
    gameState.currentQuestionData = q;
    oppositeImage.src = q.image;
    oppositeImage.alt = `${q.targetWord} VS ${q.oppositeWord}`;
    updateUI();
    setTimeout(() => speakPair(q.targetWord, q.oppositeWord), 300);
  }

  function handleAnswer(side) {
    if (gameState.isAnswered) return;
    const q = gameState.currentQuestionData;
    if (!q) return;
    const isCorrect = side === q.targetSide;

    gameState.isAnswered = true;

    if (isCorrect) {
      gameState.score += POINTS_PER_CORRECT;
      gameState.correct++;
      gameState.streak++;
      feedback.textContent = `✅ 正确！ +${POINTS_PER_CORRECT} 分`;
      feedback.className = "feedback correct";
      playSound("correct");

      if (gameState.streak % STREAK_CELEBRATION === 0) {
        showCelebration();
      }
    } else {
      gameState.wrong++;
      gameState.streak = 0;
      feedback.textContent = `❌ 错误！正确答案是 ${q.targetSide.toUpperCase()} 侧`;
      feedback.className = "feedback wrong";
      playSound("wrong");
      gameState.wrongList.push(q);
    }

    // ✅ 先增加索引，再更新 UI
    gameState.currentIndex++;
    updateUI();

    setTimeout(() => {
      showQuestion();
    }, 1200);
  }

  function showGameComplete() {
    if (gameArea) gameArea.style.display = "none";
    if (resultArea) resultArea.style.display = "block";

    // ===== 新增：隐藏底部的 Back 按钮 =====
    const backBtn = document.getElementById("backBtn");
    if (backBtn) backBtn.style.display = "none";

    const maxScore = TOTAL_QUESTIONS * POINTS_PER_CORRECT;
    let wrongHtml = "";
    if (gameState.wrongList.length > 0) {
      wrongHtml = `
                <div style="margin-top:30px; background:#fff3e0; border-radius:40px; padding:20px;">
                    <h3>📖 错题本（${gameState.wrongList.length} 个）</h3>
                    <div style="display:flex; flex-direction:column; gap:25px; margin-top:20px;">
                        ${gameState.wrongList
                          .map(
                            (wrong, idx) => `
                            <div style="background:white; border-radius:30px; padding:20px; display:flex; flex-direction:column; gap:15px;">
                                <img src="${wrong.image}" style="width:200px; height:150px; object-fit:contain; border-radius:20px; align-self:center;">
                                <div style="display:flex; justify-content:space-around; text-align:center;">
                                    <div>
                                        <div><strong>← LEFT</strong></div>
                                        <div style="font-size:1.3rem;">${wrong.leftWord}</div>
                                        <div style="font-size:0.9rem; color:#666;">${wrong.leftChinese || ""}</div>
                                        <div style="font-size:0.8rem; font-family:monospace;">${wrong.leftPhonetic || ""}</div>
                                        <button class="speakWordBtn" data-word="${wrong.leftWord}" style="background:#ffd966; border:none; border-radius:20px; padding:5px 15px; margin-top:8px; cursor:pointer;">🔊 发音</button>
                                    </div>
                                    <div>
                                        <div><strong>→ RIGHT</strong></div>
                                        <div style="font-size:1.3rem;">${wrong.rightWord}</div>
                                        <div style="font-size:0.9rem; color:#666;">${wrong.rightChinese || ""}</div>
                                        <div style="font-size:0.8rem; font-family:monospace;">${wrong.rightPhonetic || ""}</div>
                                        <button class="speakWordBtn" data-word="${wrong.rightWord}" style="background:#ffd966; border:none; border-radius:20px; padding:5px 15px; margin-top:8px; cursor:pointer;">🔊 发音</button>
                                    </div>
                                </div>
                                <div style="text-align:center; color:#888;">✅ 正确答案是 <strong>${wrong.targetSide.toUpperCase()} 侧</strong>（${wrong.targetSide === "left" ? wrong.leftWord : wrong.rightWord}）</div>
                            </div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            `;
    }

    if (resultArea) {
      resultArea.innerHTML = `
                <div style="text-align:center; margin:20px 0;">
                    <h2>🎉 游戏完成！</h2>
                    <p style="font-size:2rem;">⭐ 得分：${gameState.score} / ${maxScore}</p>
                    ${wrongHtml}
                    <div class="result-buttons">
                        <button id="restartOppositeBtn" class="next-btn" style="background:#4caf50;">🔄 再玩一次</button>
                        <button id="homeBtn" class="next-btn" style="background:#ff8c42;">🏠 返回主页</button>
                    </div>
                </div>
            `;
    }

    const restartBtn = document.getElementById("restartOppositeBtn");
    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        if (gameArea) gameArea.style.display = "block";
        if (resultArea) resultArea.style.display = "none";
        resetAndStart();
      });
    }

    const homeBtn = document.getElementById("homeBtn");
    if (homeBtn) {
      bindGoHome(homeBtn);
    }

    document.querySelectorAll(".speakWordBtn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const word = btn.getAttribute("data-word");
        if (word) SpeechHelper.speak(word, 0.7);
      });
    });
  }

  function showCelebration() {
    const msgs = ["Very Well!", "Great job!", "Fantastic!", "Amazing!"];
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.7)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = 9999;
    overlay.innerHTML = `<div style="background:white; padding:30px; border-radius:60px; font-size:2rem;">🎉 ${msgs[Math.floor(Math.random() * msgs.length)]} 🎉</div>`;
    document.body.appendChild(overlay);
    setTimeout(() => overlay.remove(), 1500);
  }

  function resetAndStart() {
    if (gameArea) gameArea.style.display = "block";
    if (resultArea) resultArea.style.display = "none";

    const backBtn = document.getElementById("backBtn");
    if (backBtn) backBtn.style.display = "inline-block";

    gameState = {
      score: 0,
      correct: 0,
      wrong: 0,
      streak: 0,
      currentIndex: 0,
      questions: buildQuestions(),
      isAnswered: false,
      currentQuestionData: null,
      wrongList: [],
    };
    updateUI();
    showQuestion();

    const savedScroll = localStorage.getItem("opposite_scroll");
    if (savedScroll !== null) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedScroll));
      }, 100);
    }

    // ===== 延迟滚动到底部（200ms 确保渲染完成） =====
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 200);
  }

  // 初始化游戏（用户点击开始按钮后调用）
  function initAndStart() {
    // 隐藏遮罩，显示游戏容器
    startOverlay.style.display = "none";
    gameContainer.style.display = "block";

    // 唤醒音频
    wakeUpAudio();

    // 启动游戏
    resetAndStart();

    // 拉到最下
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  // 绑定开始按钮
  if (startBtn) {
    startBtn.addEventListener("click", initAndStart);
  }

  repeatBtn.addEventListener("click", () => playCurrentQuestion(0.7));
  slowBtn.addEventListener("click", () => playCurrentQuestion(0.5));
  leftArea.addEventListener("click", () => handleAnswer("left"));
  rightArea.addEventListener("click", () => handleAnswer("right"));
  if (backBtn) bindGoHome(backBtn);

  // ✅ 保存滚动位置（防抖）
  let scrollTimer;
  window.addEventListener("scroll", () => {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      localStorage.setItem("opposite_scroll", window.scrollY);
    }, 200);
  });

  // 注意：不再自动调用 resetAndStart()，而是等待用户点击开始按钮
})();

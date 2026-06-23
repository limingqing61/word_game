(function () {
  // 从 wordData 中提取所有单词及其 type
  const allWords = window.wordList || [];
  // 定义有效分类（排除 other）
  const VALID_TYPES = [
    "fruit",
    "vegetable",
    "animal",
    "body",
    "household",
    "clothing",
    "transport",
    "nature",
    "people",
    "action",
    "number",
    "color",
    "place",
    "toy",
    "time",
    "country",
  ];

  // 分类显示名称（用于学习区）
  const TYPE_DISPLAY = {
    fruit: "🍎 水果",
    vegetable: "🥬 蔬菜",
    animal: "🐶 动物",
    body: "🖐️ 身体",
    household: "🏠 家居",
    clothing: "👕 衣物",
    transport: "🚗 交通",
    nature: "🌿 自然",
    people: "👨‍👩‍👧 人物",
    action: "🏃 动作",
    number: "🔢 数字",
    color: "🎨 颜色",
    place: "📍 地点",
    toy: "🧸 玩具",
    time: "⏰ 时间",
    country: "🌍 国家",
  };

  // 构建分类->单词映射
  const typeMap = new Map();
  allWords.forEach((word) => {
    if (word.type && VALID_TYPES.includes(word.type)) {
      if (!typeMap.has(word.type)) typeMap.set(word.type, []);
      typeMap.get(word.type).push(word);
    }
  });

  // 有效分类列表（用于出题）
  const availableTypes = Array.from(typeMap.keys());

  let currentScore = 0;
  let currentIndex = 0;
  let totalQuestions = 30;
  let currentType = null;
  let currentCorrectWord = null;
  let currentOptions = [];
  let questionCard = document.getElementById("questionCard");
  let cardMoveInterval = null;
  let cardTimeout = null;
  let canAnswer = false;
  let currentQuestionObj = null;

  const scoreSpan = document.getElementById("scoreValue");
  const progressSpan = document.getElementById("progressValue");
  const totalSpan = document.getElementById("totalQuestions");
  const optionsDiv = document.getElementById("optionsArea");
  const messageDiv = document.getElementById("messageArea");
  const repeatBtn = document.getElementById("repeatSoundBtn");
  const gameContainer = document.getElementById("gameContainer");
  const startOverlay = document.getElementById("startOverlay");
  const startBtn = document.getElementById("startBtn");

  totalSpan.innerText = totalQuestions;

  // 唤醒音频上下文（iOS 需要）
  let audioContext = null;
  let audioAllowed = false;

  function wakeUpAudio() {
    if (audioAllowed) return;
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
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

  // 播放分类发音
  function speakCategory(english, chinese) {
    wakeUpAudio();
    const utterance = new SpeechSynthesisUtterance(`${english}, ${chinese}`);
    utterance.lang = "zh-CN";
    utterance.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  // 生成分类学习图标（基于 VALID_TYPES）
  function generateCategoryIcons() {
    const container = document.getElementById("categoriesGrid");
    if (!container) return;

    container.innerHTML = "";
    VALID_TYPES.forEach((type) => {
      const displayName = TYPE_DISPLAY[type] || type;
      const catDiv = document.createElement("div");
      catDiv.className = "cat-item";
      catDiv.textContent = displayName;
      catDiv.dataset.type = type;

      catDiv.addEventListener("click", (e) => {
        e.stopPropagation();
        const chinese = displayName.split(" ")[1] || "";
        speakCategory(type, chinese);
      });

      container.appendChild(catDiv);
    });
  }

  // 隐藏分类学习区（开始游戏后调用）
  function hideCategoriesLearn() {
    const learnDiv = document.getElementById("categoriesLearn");
    if (learnDiv) learnDiv.style.display = "none";
  }

  // 初始化游戏（用户点击开始按钮后调用）
  function initAndStart() {
    // 隐藏分类学习区
    hideCategoriesLearn();

    // 隐藏遮罩，显示游戏容器
    startOverlay.style.display = "none";
    gameContainer.style.display = "block";

    // 唤醒音频
    wakeUpAudio();

    // 重置游戏状态
    currentScore = 0;
    currentIndex = 0;
    scoreSpan.innerText = "0";
    progressSpan.innerText = "0";
    messageDiv.innerHTML = "";

    // 清空选项区域
    optionsDiv.innerHTML = "";

    // 重新开始游戏
    if (cardMoveInterval) cancelAnimationFrame(cardMoveInterval);
    if (cardTimeout) clearTimeout(cardTimeout);

    // 重置状态后启动第一题
    nextQuestion();
  }

  // 绑定开始按钮
  if (startBtn) {
    startBtn.addEventListener("click", initAndStart);
  }

  // 生成分类学习图标
  generateCategoryIcons();

  function getRandomWordByType(type) {
    const list = typeMap.get(type);
    if (!list || list.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
  }

  function getRandomDistractors(correctWord, type, count) {
    const otherWords = [];
    for (let [t, words] of typeMap.entries()) {
      if (t !== type) {
        otherWords.push(...words);
      }
    }
    for (let i = otherWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherWords[i], otherWords[j]] = [otherWords[j], otherWords[i]];
    }
    const dists = [];
    for (let i = 0; i < otherWords.length && dists.length < count; i++) {
      if (otherWords[i].word !== correctWord.word) {
        dists.push(otherWords[i]);
      }
    }
    return dists;
  }

  function generateQuestion() {
    if (availableTypes.length === 0) return null;
    const randomType =
      availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const correctWord = getRandomWordByType(randomType);
    if (!correctWord) return null;
    const optionsCount = currentIndex < 21 ? 4 : 6;
    const distractors = getRandomDistractors(
      correctWord,
      randomType,
      optionsCount - 1,
    );
    const options = [correctWord, ...distractors];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return {
      type: randomType,
      correctWord: correctWord,
      options: options,
      points: currentIndex < 21 ? 3 : 4,
    };
  }

  function speakQuestion(type) {
    const questionText = `Which one is ${type}?`;
    if (window.SpeechHelper) {
      SpeechHelper.speak(questionText);
    } else {
      const utterance = new SpeechSynthesisUtterance(questionText);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  }

  function startCardMove() {
    if (cardMoveInterval) cancelAnimationFrame(cardMoveInterval);
    const gameArea = document.getElementById("gameArea");
    const areaRect = gameArea.getBoundingClientRect();
    const startLeft = areaRect.width - 20;
    let currentLeft = startLeft;
    const duration = 4000;
    const startTime = performance.now();
    questionCard.style.left = currentLeft + "px";
    questionCard.style.display = "flex";

    function step(now) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      currentLeft = startLeft - (startLeft - 20) * t;
      questionCard.style.left = currentLeft + "px";
      if (t < 1) {
        cardMoveInterval = requestAnimationFrame(step);
      } else {
        cancelQuestion();
      }
    }
    cardMoveInterval = requestAnimationFrame(step);
    cardTimeout = setTimeout(() => {
      cancelQuestion();
    }, duration);
  }

  function cancelQuestion() {
    if (cardMoveInterval) {
      cancelAnimationFrame(cardMoveInterval);
      cardMoveInterval = null;
    }
    if (cardTimeout) {
      clearTimeout(cardTimeout);
      cardTimeout = null;
    }
    questionCard.style.display = "none";
    canAnswer = false;
    nextQuestion();
  }

  function showFloatMessage(text, isCorrect = true) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "feedback";
    msgDiv.textContent = text;
    msgDiv.style.left = "50%";
    msgDiv.style.top = "40%";
    msgDiv.style.transform = "translateX(-50%)";
    msgDiv.style.color = isCorrect ? "#a5ffa5" : "#ffaaaa";
    document.body.appendChild(msgDiv);
    setTimeout(() => msgDiv.remove(), 500);
  }

  function playSoundEffect(type) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
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
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(
          293.66,
          ctx.currentTime + 0.3,
        );
        osc.type = "sawtooth";
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  function handleAnswer(selectedWord) {
    if (!canAnswer) return;
    canAnswer = false;
    if (cardMoveInterval) cancelAnimationFrame(cardMoveInterval);
    if (cardTimeout) clearTimeout(cardTimeout);
    questionCard.style.display = "none";

    const isCorrect = selectedWord.word === currentCorrectWord.word;
    if (isCorrect) {
      currentScore += currentQuestionObj.points;
      showFloatMessage(`+${currentQuestionObj.points}`, true);
      playSoundEffect("correct");
    } else {
      showFloatMessage("✗ 再试试", false);
      playSoundEffect("wrong");
    }
    scoreSpan.innerText = currentScore;
    setTimeout(() => {
      nextQuestion();
    }, 800);
  }

  function renderOptions() {
    optionsDiv.innerHTML = "";
    currentQuestionObj.options.forEach((opt) => {
      const card = document.createElement("div");
      card.className = "option-card";
      const img = document.createElement("img");
      img.src = opt.image;
      img.alt = opt.word;
      const chineseSpan = document.createElement("div");
      chineseSpan.textContent = opt.chinese || "";
      chineseSpan.style.fontSize = "0.8rem";
      chineseSpan.style.color = "#2e7d32";
      chineseSpan.style.marginTop = "6px";
      chineseSpan.style.fontWeight = "bold";
      card.appendChild(img);
      card.appendChild(chineseSpan);
      card.addEventListener("click", () => handleAnswer(opt));
      optionsDiv.appendChild(card);
    });
  }

  function nextQuestion() {
    if (currentIndex >= totalQuestions) {
      showGameComplete();
      return;
    }
    currentIndex++;
    progressSpan.innerText = currentIndex;
    const newQuestion = generateQuestion();
    if (!newQuestion) {
      messageDiv.innerText = "❌ 题目生成失败，请刷新重试";
      return;
    }
    currentQuestionObj = newQuestion;
    currentCorrectWord = newQuestion.correctWord;
    currentType = newQuestion.type;
    renderOptions();
    speakQuestion(currentType);
    startCardMove();
    canAnswer = true;
  }

  function showGameComplete() {
    messageDiv.innerHTML = `<span style="font-size:1.5rem;">🎉 游戏通关！ 🎉</span><br>⭐ 最终得分：${currentScore}`;
    optionsDiv.innerHTML = "";
    questionCard.style.display = "none";
    if (cardMoveInterval) cancelAnimationFrame(cardMoveInterval);
    if (cardTimeout) clearTimeout(cardTimeout);
    const restartBtn = document.createElement("button");
    restartBtn.innerText = "🎮 再来一局";
    restartBtn.style.marginTop = "15px";
    restartBtn.addEventListener("click", () => location.reload());
    messageDiv.appendChild(restartBtn);
  }

  repeatBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (currentType) {
      speakQuestion(currentType);
    }
  });

  document.getElementById("backMenuBtn").addEventListener("click", () => {
    window.location.href = "index.html";
  });
})();

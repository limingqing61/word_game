(function () {
  // ========== 游戏配置 ==========
  const TOTAL_QUESTIONS = 10;
  const POINTS_PER_CORRECT = 10;
  const OPTIONS_COUNT = 6;

  // ========== DOM 元素 ==========
  const questionImage = document.getElementById("questionImage");
  const questionHint = document.getElementById("questionHint");
  const optionsContainer = document.getElementById("optionsContainer");
  const scoreValue = document.getElementById("scoreValue");
  const progressValue = document.getElementById("progressValue");
  const totalQuestionsSpan = document.getElementById("totalQuestions");
  const feedbackDiv = document.getElementById("feedback");
  const gameArea = document.getElementById("gameArea");
  const resultArea = document.getElementById("resultArea");
  const finalScoreSpan = document.getElementById("finalScore");
  const backBtn = document.getElementById("backBtn");
  const restartBtn = document.getElementById("restartBtn");
  const backHomeBtn = document.getElementById("backHomeBtn");

  // ========== 游戏状态 ==========
  let currentQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let isAnswered = false;
  let gameActive = false;

  // ========== 音效 ==========
  let sharedAudioCtx = null;
  let audioAllowed = false;

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
      console.warn("Audio error", e);
    }
  }

  // ========== 工具函数 ==========
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getAllCountries() {
    const countries = new Set();
    CULTURE_DATA.forEach((item) => countries.add(item.country));
    return Array.from(countries);
  }

  function getChineseName(country) {
    if (window.wordData && window.wordData[country]) {
      return window.wordData[country].chinese || country;
    }
    return country;
  }

  function generateAllQuestions() {
    const shuffledData = shuffleArray([...CULTURE_DATA]);
    const selected = shuffledData.slice(0, TOTAL_QUESTIONS);
    return selected.map((item) => {
      const correctCountry = item.country;
      const allCountries = getAllCountries();
      const otherCountries = allCountries.filter((c) => c !== correctCountry);
      const shuffledOthers = shuffleArray([...otherCountries]);
      const distractors = shuffledOthers.slice(0, OPTIONS_COUNT - 1);
      let options = [correctCountry, ...distractors];
      if (options.length < OPTIONS_COUNT) {
        const extra = allCountries.filter((c) => !options.includes(c));
        const shuffledExtra = shuffleArray([...extra]);
        const needed = OPTIONS_COUNT - options.length;
        options = [...options, ...shuffledExtra.slice(0, needed)];
      }
      options = shuffleArray(options);
      return {
        questionItem: item,
        correctCountry: correctCountry,
        options: options,
      };
    });
  }

  // ========== UI 更新 ==========
  function updateProgress() {
    if (progressValue) {
      progressValue.textContent = `${currentIndex + 1}/${TOTAL_QUESTIONS}`;
    }
    if (totalQuestionsSpan) {
      totalQuestionsSpan.textContent = TOTAL_QUESTIONS;
    }
  }

  function updateScore() {
    if (scoreValue) scoreValue.textContent = score;
  }

  function showQuestion() {
    if (currentIndex >= TOTAL_QUESTIONS) {
      showResult();
      return;
    }

    isAnswered = false;
    gameActive = true;
    if (feedbackDiv) {
      feedbackDiv.textContent = "";
      feedbackDiv.className = "feedback";
    }

    const q = currentQuestions[currentIndex];
    if (questionImage) {
      questionImage.src = q.questionItem.image;
      questionImage.alt = q.questionItem.hint;
      questionImage.onerror = () => {
        questionImage.style.display = "none";
        const fallback = document.createElement("div");
        fallback.className = "image-fallback";
        fallback.textContent = "🖼️";
        questionImage.parentNode.insertBefore(fallback, questionImage);
      };
    }
    if (questionHint) questionHint.textContent = q.questionItem.hint;

    if (optionsContainer) {
      optionsContainer.innerHTML = "";
      q.options.forEach((country) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.dataset.country = country;

        const img = document.createElement("img");
        img.src = `images/${country}.jpeg`;
        img.alt = country;
        img.onerror = () => {
          img.style.display = "none";
          const fallback = document.createElement("span");
          fallback.textContent = country;
          btn.appendChild(fallback);
        };
        btn.appendChild(img);

        btn.addEventListener("click", () => handleOptionClick(btn, country));
        optionsContainer.appendChild(btn);
      });
    }

    updateProgress();
    updateScore();
    if (gameArea) gameArea.style.display = "block";
    if (resultArea) resultArea.style.display = "none";
  }

  function handleOptionClick(btn, selectedCountry) {
    if (isAnswered || !gameActive) return;
    isAnswered = true;
    gameActive = false;

    const q = currentQuestions[currentIndex];
    const isCorrect = selectedCountry === q.correctCountry;

    document.querySelectorAll(".option-btn").forEach((b) => {
      b.disabled = true;
    });

    if (feedbackDiv) {
      feedbackDiv.textContent = "";
      feedbackDiv.className = "feedback";
    }

    if (isCorrect) {
      document.querySelectorAll(".option-btn").forEach((b) => {
        if (b.dataset.country === q.correctCountry) {
          b.classList.add("correct");
          const label = document.createElement("div");
          label.className = "country-label correct-label";
          const chineseName = getChineseName(q.correctCountry);
          label.textContent = `✅ ${chineseName}`;
          b.appendChild(label);
        }
      });
      score += POINTS_PER_CORRECT;
      updateScore();
      playSoundEffect("correct");
    } else {
      document.querySelectorAll(".option-btn").forEach((b) => {
        if (b.dataset.country === q.correctCountry) {
          b.classList.add("correct");
          const label = document.createElement("div");
          label.className = "country-label correct-label";
          const correctChinese = getChineseName(q.correctCountry);
          label.textContent = `✅ ${correctChinese}`;
          b.appendChild(label);
        }
        if (b === btn) {
          b.classList.add("wrong");
          const label = document.createElement("div");
          label.className = "country-label wrong-label";
          const wrongChinese = getChineseName(selectedCountry);
          label.textContent = `❌ ${wrongChinese}`;
          b.appendChild(label);
        }
      });
      playSoundEffect("wrong");
    }

    setTimeout(() => {
      currentIndex++;
      showQuestion();
    }, 2200);
  }

  function showResult() {
    if (gameArea) gameArea.style.display = "none";
    if (resultArea) resultArea.style.display = "block";
    if (finalScoreSpan) finalScoreSpan.textContent = score;
    if (score === 100) {
      showConfetti();
    }
  }

  function showConfetti() {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#FFD166",
      "#06D6A0",
      "#9C27B0",
      "#FF9800",
    ];
    for (let i = 0; i < 100; i++) {
      const conf = document.createElement("div");
      conf.style.cssText = `position:fixed; width:10px; height:10px; background:${colors[i % colors.length]}; left:${Math.random() * 100}vw; top:-10px; border-radius:50%; pointer-events:none; z-index:9999;`;
      document.body.appendChild(conf);
      const anim = conf.animate(
        [
          { transform: "translateY(0)", opacity: 1 },
          {
            transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`,
            opacity: 0,
          },
        ],
        { duration: 1500 + Math.random() * 1500 },
      );
      anim.onfinish = () => conf.remove();
    }
    playSoundEffect("correct");
  }

  function startGame() {
    currentQuestions = generateAllQuestions();
    currentIndex = 0;
    score = 0;
    updateScore();
    showQuestion();
  }

  function restartGame() {
    if (resultArea) resultArea.style.display = "none";
    if (gameArea) gameArea.style.display = "block";
    startGame();
  }

  // ========== 事件绑定 ==========
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener("click", restartGame);
  }

  if (backHomeBtn) {
    backHomeBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // ========== 启动遮罩 ==========
  const startOverlay = document.getElementById("startOverlay");
  const startBtn = document.getElementById("startBtn");
  const gameContainer = document.getElementById("gameContainer");

  function initAndStart() {
    if (startOverlay) startOverlay.style.display = "none";
    if (gameContainer) gameContainer.style.display = "block";
    wakeUpAudio();
    startGame();
  }

  if (startBtn) {
    startBtn.addEventListener("click", initAndStart);
  }

  function wakeUpAudio() {
    if (audioAllowed) return;
    try {
      const ctx = getAudioContext();
      const silentOsc = ctx.createOscillator();
      const silentGain = ctx.createGain();
      silentGain.gain.value = 0;
      silentOsc.connect(silentGain);
      silentGain.connect(ctx.destination);
      silentOsc.start();
      silentOsc.stop(ctx.currentTime + 0.01);
      ctx.resume();
      audioAllowed = true;
    } catch (e) {}
  }

  // ========== 数据检查 ==========
  if (typeof CULTURE_DATA === "undefined") {
    console.error("❌ CULTURE_DATA 未加载");
    const container = document.querySelector(".game-container");
    if (container) {
      container.innerHTML = `
                <div style="text-align:center;padding:40px;color:#ffecb3;">
                    <h2>⚠️ 数据加载失败</h2>
                    <p>请检查 cultureData.js 是否存在</p>
                </div>
            `;
    }
    return;
  }

  if (CULTURE_DATA.length === 0) {
    console.error("❌ CULTURE_DATA 为空");
    const container = document.querySelector(".game-container");
    if (container) {
      container.innerHTML = `
                <div style="text-align:center;padding:40px;color:#ffecb3;">
                    <h2>⚠️ 数据为空</h2>
                    <p>请检查 cultureData.js 是否正确填充</p>
                </div>
            `;
    }
    return;
  }
})();

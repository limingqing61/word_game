(function () {
  // ========== 支持的数字列表（有图片的） ==========
  const SUPPORTED_NUMBERS = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    30, 40, 50, 60, 70, 80, 90, 100, 1000,
  ];

  // ========== 关卡配置 ==========
  const ROUNDS = [
    // 1-5: 简单二元加减，限时5秒，每题2分
    { type: "simple", timeLimit: 5, score: 2, count: 5 },
    // 6-10: 中等二元加减，限时10秒，每题4分
    { type: "medium", timeLimit: 10, score: 4, count: 5 },
    // 11-15: 三元加法，限时15秒，每题6分
    { type: "triple_add", timeLimit: 15, score: 6, count: 5 },
    // 16-20: 三元混合，限时20秒，每题8分
    { type: "triple_mix", timeLimit: 20, score: 8, count: 5 },
  ];

  const TOTAL_ROUNDS = 20;
  const MAX_SCORE = 100;

  // ========== DOM 元素 ==========
  const questionText = document.getElementById("questionText");
  const optionsContainer = document.getElementById("optionsContainer");
  const scoreValue = document.getElementById("scoreValue");
  const roundValue = document.getElementById("roundValue");
  const totalRounds = document.getElementById("totalRounds");
  const timerValue = document.getElementById("timerValue");
  const timerDisplay = document.getElementById("timerDisplay");
  const feedbackDiv = document.getElementById("feedback");
  const gameArea = document.getElementById("gameArea");
  const resultArea = document.getElementById("resultArea");
  const finalScoreSpan = document.getElementById("finalScore");
  const restartBtn = document.getElementById("restartBtn");
  const backHomeBtn = document.getElementById("backHomeBtn");
  const backBtn = document.getElementById("backBtn");

  // ========== 游戏状态 ==========
  let currentQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let isAnswered = false;
  let timerInterval = null;
  let timeLeft = 0;
  let gameActive = false;
  let currentCorrectAnswer = null;

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

  // ========== 工具 ==========
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getNumberImage(num) {
    const numberWords = {
      0: "zero",
      1: "one",
      2: "two",
      3: "three",
      4: "four",
      5: "five",
      6: "six",
      7: "seven",
      8: "eight",
      9: "nine",
      10: "ten",
      11: "eleven",
      12: "twelve",
      13: "thirteen",
      14: "fourteen",
      15: "fifteen",
      16: "sixteen",
      17: "seventeen",
      18: "eighteen",
      19: "nineteen",
      20: "twenty",
      30: "thirty",
      40: "forty",
      50: "fifty",
      60: "sixty",
      70: "seventy",
      80: "eighty",
      90: "ninety",
      100: "hundred",
      1000: "thousand",
    };
    const word = numberWords[num];
    if (!word) return null;
    return `images/${word}.jpeg`;
  }

  function getNumberWord(num) {
    const words = {
      0: "zero",
      1: "one",
      2: "two",
      3: "three",
      4: "four",
      5: "five",
      6: "six",
      7: "seven",
      8: "eight",
      9: "nine",
      10: "ten",
      11: "eleven",
      12: "twelve",
      13: "thirteen",
      14: "fourteen",
      15: "fifteen",
      16: "sixteen",
      17: "seventeen",
      18: "eighteen",
      19: "nineteen",
      20: "twenty",
      30: "thirty",
      40: "forty",
      50: "fifty",
      60: "sixty",
      70: "seventy",
      80: "eighty",
      90: "ninety",
      100: "one hundred",
      1000: "one thousand",
    };
    return words[num] || String(num);
  }

  // 从支持的数字中生成选项（保证包含正确答案）
  function generateOptions(correct, count) {
    // 从支持的数字中筛选候选
    const candidates = SUPPORTED_NUMBERS.filter(
      (n) => n !== correct && n <= 200,
    );
    const shuffled = shuffleArray([...candidates]);
    const selected = [correct];
    for (const num of shuffled) {
      if (selected.length >= count) break;
      if (!selected.includes(num)) {
        selected.push(num);
      }
    }
    // 如果还不够，手动补一些
    while (selected.length < count) {
      const fallback = Math.floor(Math.random() * 30) + 1;
      if (
        !selected.includes(fallback) &&
        SUPPORTED_NUMBERS.includes(fallback)
      ) {
        selected.push(fallback);
      } else if (!selected.includes(fallback) && fallback <= 100) {
        selected.push(fallback);
      }
    }
    return shuffleArray(selected);
  }

  // ========== 题目生成 ==========
  function generateQuestions() {
    const questions = [];
    let roundNum = 1;

    // 辅助：生成不重复的题目
    function generateUnique(generator, existing) {
      let attempts = 0;
      let q;
      do {
        q = generator();
        attempts++;
        if (attempts > 200) break;
      } while (existing.some((e) => e.displayText === q.displayText));
      return q;
    }

    // 1-5: 简单二元加减
    for (let i = 0; i < 5; i++) {
      const q = generateUnique(generateSimpleQuestion, questions);
      questions.push({ ...q, round: roundNum++, score: 2, timeLimit: 5 });
    }

    // 6-10: 中等二元加减
    for (let i = 0; i < 5; i++) {
      const q = generateUnique(generateMediumQuestion, questions);
      questions.push({ ...q, round: roundNum++, score: 4, timeLimit: 10 });
    }

    // 11-15: 三元加法
    for (let i = 0; i < 5; i++) {
      const q = generateUnique(generateTripleAddQuestion, questions);
      questions.push({ ...q, round: roundNum++, score: 6, timeLimit: 15 });
    }

    // 16-20: 三元混合
    for (let i = 0; i < 5; i++) {
      const q = generateUnique(generateTripleMixQuestion, questions);
      questions.push({ ...q, round: roundNum++, score: 8, timeLimit: 20 });
    }

    return questions;
  }

  // 简单二元加减 (结果 ≤ 10，或整十)
  function generateSimpleQuestion() {
    const isAdd = Math.random() < 0.5;
    let a, b, result, symbol;

    if (isAdd) {
      if (Math.random() < 0.3) {
        // 整十加法
        const tens = [10, 20, 30, 40, 50, 60, 70, 80];
        a = tens[Math.floor(Math.random() * tens.length)];
        const maxB = 100 - a;
        const availableTens = tens.filter((t) => t <= maxB && t > 0);
        if (availableTens.length === 0) {
          a = 10;
        }
        const avail = tens.filter((t) => t <= 100 - a && t > 0);
        b =
          avail.length > 0
            ? avail[Math.floor(Math.random() * avail.length)]
            : 10;
        if (a + b > 100) {
          a = 20;
          b = 30;
        }
        result = a + b;
        symbol = "+";
      } else {
        a = Math.floor(Math.random() * 9) + 1;
        const maxB = 10 - a;
        if (maxB <= 0) {
          a = 3;
        }
        b = Math.floor(Math.random() * (10 - a)) + 1;
        if (a + b > 10) {
          a = 3;
          b = 5;
        }
        result = a + b;
        symbol = "+";
      }
    } else {
      if (Math.random() < 0.3) {
        const bases = [20, 30, 40, 50, 60, 70, 80, 90, 100];
        a = bases[Math.floor(Math.random() * bases.length)];
        const availB = bases.filter((b) => b < a && b > 0);
        if (availB.length === 0) {
          a = 50;
        }
        const avail = bases.filter((b) => b < a && b > 0);
        b =
          avail.length > 0
            ? avail[Math.floor(Math.random() * avail.length)]
            : 10;
        if (b >= a) {
          a = 50;
          b = 20;
        }
        result = a - b;
        symbol = "-";
      } else {
        a = Math.floor(Math.random() * 9) + 2;
        b = Math.floor(Math.random() * (a - 1)) + 1;
        if (b === 0) b = 1;
        result = a - b;
        symbol = "-";
      }
    }

    const displayText = `${a} ${symbol} ${b} = ?`;
    const options = generateOptions(result, 4);
    return { text: displayText, answer: result, options, displayText };
  }

  // 中等二元加减 (结果 > 10, ≤ 20)
  function generateMediumQuestion() {
    const isAdd = Math.random() < 0.5;
    let a, b, result, symbol;

    if (isAdd) {
      a = Math.floor(Math.random() * 9) + 2;
      const maxB = Math.min(20 - a, 10);
      if (maxB <= 0) {
        a = 7;
      }
      b = Math.floor(Math.random() * Math.min(maxB, 9)) + 1;
      if (a + b <= 10) {
        a = 7;
        b = 5;
      }
      result = a + b;
      if (result > 20) {
        a = 9;
        b = 8;
        result = 17;
      }
      symbol = "+";
    } else {
      a = Math.floor(Math.random() * 10) + 11;
      const maxB = Math.min(10, a - 1);
      if (maxB <= 0) {
        a = 15;
      }
      b = Math.floor(Math.random() * maxB) + 1;
      if (a - b > 10) {
        a = 15;
        b = 7;
      }
      result = a - b;
      if (result < 0) {
        a = 12;
        b = 5;
        result = 7;
      }
      if (result > 10) {
        a = 14;
        b = 6;
        result = 8;
      }
      symbol = "-";
    }

    const displayText = `${a} ${symbol} ${b} = ?`;
    const options = generateOptions(result, 4);
    return { text: displayText, answer: result, options, displayText };
  }

  // 三元加法 (结果 10-20)
  function generateTripleAddQuestion() {
    let a, b, c, result;
    let attempts = 0;
    do {
      a = Math.floor(Math.random() * 7) + 2;
      b = Math.floor(Math.random() * 7) + 2;
      c = Math.floor(Math.random() * 7) + 2;
      result = a + b + c;
      attempts++;
      if (attempts > 200) break;
    } while (result <= 10 || result > 20);

    const displayText = `${a} + ${b} + ${c} = ?`;
    const options = generateOptions(result, 4);
    return { text: displayText, answer: result, options, displayText };
  }

  // 三元混合 (一次加一次减，中间结果非负)
  function generateTripleMixQuestion() {
    let a, b, c, result;
    let attempts = 0;
    let isFirstAdd = true;

    do {
      a = Math.floor(Math.random() * 9) + 1;
      b = Math.floor(Math.random() * 9) + 1;
      isFirstAdd = Math.random() < 0.5;

      if (isFirstAdd) {
        // a + b - c
        const mid = a + b;
        if (mid > 20) {
          a = 5;
          b = 4;
          continue;
        }
        c = Math.floor(Math.random() * mid) + 1;
        if (c > 10) c = Math.floor(Math.random() * 8) + 1;
        result = mid - c;
      } else {
        // a - b + c
        if (a <= b) {
          a = b + Math.floor(Math.random() * 4) + 1;
        }
        const mid = a - b;
        if (mid < 0) {
          a = 8;
          b = 3;
          continue;
        }
        c = Math.floor(Math.random() * 8) + 1;
        result = mid + c;
      }
      attempts++;
      if (attempts > 300) break;
    } while (
      result < 0 ||
      result > 20 ||
      result === 0 ||
      result === a ||
      result === b ||
      result === c
    );

    let displayText;
    if (isFirstAdd) {
      displayText = `${a} + ${b} - ${c} = ?`;
    } else {
      displayText = `${a} - ${b} + ${c} = ?`;
    }

    const options = generateOptions(result, 4);
    return { text: displayText, answer: result, options, displayText };
  }

  // ========== UI 渲染 ==========
  function updateScore() {
    scoreValue.textContent = score;
  }

  function updateRound() {
    const q = currentQuestions[currentIndex];
    if (q) {
      roundValue.textContent = q.round;
      totalRounds.textContent = TOTAL_ROUNDS;
    }
  }

  function showQuestion() {
    if (currentIndex >= currentQuestions.length) {
      showResult();
      return;
    }

    const q = currentQuestions[currentIndex];
    isAnswered = false;
    gameActive = true;
    feedbackDiv.textContent = "";
    feedbackDiv.className = "feedback";

    questionText.innerHTML = q.displayText;

    optionsContainer.innerHTML = "";
    q.options.forEach((num) => {
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.dataset.value = num;

      const img = document.createElement("img");
      const imgPath = getNumberImage(num);
      if (imgPath) {
        img.src = imgPath;
        img.alt = getNumberWord(num);
        img.onerror = () => {
          img.style.display = "none";
          const fallback = document.createElement("span");
          fallback.className = "image-fallback";
          fallback.textContent = num;
          btn.appendChild(fallback);
        };
        btn.appendChild(img);
      } else {
        const fallback = document.createElement("span");
        fallback.className = "image-fallback";
        fallback.textContent = num;
        btn.appendChild(fallback);
      }

      btn.addEventListener("click", () => handleOptionClick(btn, num));
      optionsContainer.appendChild(btn);
    });

    updateRound();
    updateScore();
    startTimer(q.timeLimit);
  }

  function startTimer(seconds) {
    if (timerInterval) clearInterval(timerInterval);
    timeLeft = seconds;
    timerValue.textContent = timeLeft;
    timerDisplay.classList.remove("warning");

    timerInterval = setInterval(() => {
      timeLeft--;
      timerValue.textContent = timeLeft;
      if (timeLeft <= 3) {
        timerDisplay.classList.add("warning");
      }
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        if (!isAnswered && gameActive) {
          handleTimeout();
        }
      }
    }, 1000);
  }

  function handleTimeout() {
    if (isAnswered || !gameActive) return;
    isAnswered = true;
    gameActive = false;
    if (timerInterval) clearInterval(timerInterval);

    const q = currentQuestions[currentIndex];
    feedbackDiv.textContent = `⏰ 时间到！正确答案是 ${q.answer}`;
    feedbackDiv.className = "feedback wrong";
    playSoundEffect("wrong");

    document.querySelectorAll(".option-btn").forEach((btn) => {
      btn.disabled = true;
      if (parseInt(btn.dataset.value) === q.answer) {
        btn.classList.add("correct");
      }
    });

    setTimeout(() => {
      currentIndex++;
      showQuestion();
    }, 1500);
  }

  function handleOptionClick(btn, selected) {
    if (isAnswered || !gameActive) return;
    isAnswered = true;
    gameActive = false;
    if (timerInterval) clearInterval(timerInterval);

    const q = currentQuestions[currentIndex];
    const isCorrect = selected === q.answer;

    document.querySelectorAll(".option-btn").forEach((b) => {
      b.disabled = true;
      if (parseInt(b.dataset.value) === q.answer) {
        b.classList.add("correct");
      }
      if (b === btn && !isCorrect) {
        b.classList.add("wrong");
      }
    });

    if (isCorrect) {
      score += q.score;
      updateScore();
      playSoundEffect("correct");
      feedbackDiv.textContent = `✅ 正确！ +${q.score} 分`;
      feedbackDiv.className = "feedback correct";
    } else {
      playSoundEffect("wrong");
      feedbackDiv.textContent = `❌ 正确答案是 ${q.answer}`;
      feedbackDiv.className = "feedback wrong";
    }

    setTimeout(() => {
      currentIndex++;
      showQuestion();
    }, 1500);
  }

  function showResult() {
    gameArea.style.display = "none";
    resultArea.style.display = "block";
    finalScoreSpan.textContent = score;
    if (backBtn) backBtn.style.display = "none";
    if (score === MAX_SCORE) {
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
    currentQuestions = generateQuestions();
    currentIndex = 0;
    score = 0;
    updateScore();
    resultArea.style.display = "none";
    gameArea.style.display = "flex";
    showQuestion();
  }

  function restartGame() {
    if (timerInterval) clearInterval(timerInterval);
    resultArea.style.display = "none";
    gameArea.style.display = "flex";
    if (backBtn) backBtn.style.display = "";
    startGame();
  }

  // ========== 事件绑定 ==========
  if (backBtn) {
    bindGoHome(backBtn);
  }
  if (restartBtn) {
    restartBtn.addEventListener("click", restartGame);
  }
  if (backHomeBtn) {
    bindGoHome(backHomeBtn);
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

  totalRounds.textContent = TOTAL_ROUNDS;
})();

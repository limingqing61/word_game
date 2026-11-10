(function () {
  "use strict";

  // ============================================================
  // 通用配置
  // ============================================================
  const MAX_SCORE = 100;

  // ============================================================
  // 一、加减法 sheet
  // ============================================================
  const SUPPORTED_NUMBERS = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    30, 40, 50, 60, 70, 80, 90, 100, 1000,
  ];

  const TOTAL_ROUNDS = 20;

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

  let currentQuestions = [];
  let currentIndex = 0;
  let score = 0;
  let isAnswered = false;
  let timerInterval = null;
  let timeLeft = 0;
  let gameActive = false;

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

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function randomInt(min, max) {
    if (max < min) return min;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // ---------- 数字图片 ----------
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
      21: "twentyone",
      22: "twentytwo",
      23: "twentythree",
      24: "twentyfour",
      25: "twentyfive",
      26: "twentysix",
      27: "twentyseven",
      28: "twentyeight",
      29: "twentynine",
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
    const custom = getWordImage(word);
    if (custom) return custom;
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
      21: "twenty one",
      22: "twenty two",
      23: "twenty three",
      24: "twenty four",
      25: "twenty five",
      26: "twenty six",
      27: "twenty seven",
      28: "twenty eight",
      29: "twenty nine",
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

  function generateOptions(correct, count) {
    const candidates = SUPPORTED_NUMBERS.filter(
      (n) => n !== correct && n <= 200,
    );
    const shuffled = shuffleArray([...candidates]);
    const selected = [correct];
    for (const num of shuffled) {
      if (selected.length >= count) break;
      if (!selected.includes(num)) selected.push(num);
    }
    while (selected.length < count) {
      const fallback = randomInt(1, 30);
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

  // ---------- 加减法出题 ----------
  function generateQuestions() {
    const questions = [];
    let roundNum = 1;

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

    for (let i = 0; i < 5; i++) {
      const q = generateUnique(generateSimpleQuestion, questions);
      questions.push({ ...q, round: roundNum++, score: 2, timeLimit: 5 });
    }
    for (let i = 0; i < 5; i++) {
      const q = generateUnique(generateMediumQuestion, questions);
      questions.push({ ...q, round: roundNum++, score: 4, timeLimit: 10 });
    }
    for (let i = 0; i < 5; i++) {
      const q = generateUnique(generateTripleAddQuestion, questions);
      questions.push({ ...q, round: roundNum++, score: 6, timeLimit: 15 });
    }
    for (let i = 0; i < 5; i++) {
      const q = generateUnique(generateTripleMixQuestion, questions);
      questions.push({ ...q, round: roundNum++, score: 8, timeLimit: 20 });
    }
    return questions;
  }

  function generateSimpleQuestion() {
    const isAdd = Math.random() < 0.5;
    let a, b, result, symbol;

    if (isAdd) {
      if (Math.random() < 0.3) {
        const tens = [10, 20, 30, 40, 50, 60, 70, 80];
        a = tens[Math.floor(Math.random() * tens.length)];
        const maxB = 100 - a;
        const availableTens = tens.filter((t) => t <= maxB && t > 0);
        if (availableTens.length === 0) a = 10;
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
        if (maxB <= 0) a = 3;
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
        if (availB.length === 0) a = 50;
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

  function generateMediumQuestion() {
    const isAdd = Math.random() < 0.5;
    let a, b, result, symbol;

    if (isAdd) {
      a = Math.floor(Math.random() * 9) + 2;
      const maxB = Math.min(20 - a, 10);
      if (maxB <= 0) a = 7;
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
      if (maxB <= 0) a = 15;
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

  function generateTripleMixQuestion() {
    let a, b, c, result;
    let attempts = 0;
    let isFirstAdd = true;
    do {
      a = Math.floor(Math.random() * 9) + 1;
      b = Math.floor(Math.random() * 9) + 1;
      isFirstAdd = Math.random() < 0.5;
      if (isFirstAdd) {
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
        if (a <= b) a = b + Math.floor(Math.random() * 4) + 1;
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
    const displayText = isFirstAdd
      ? `${a} + ${b} - ${c} = ?`
      : `${a} - ${b} + ${c} = ?`;
    const options = generateOptions(result, 4);
    return { text: displayText, answer: result, options, displayText };
  }

  // ---------- 加减法 UI ----------
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
      if (timeLeft <= 3) timerDisplay.classList.add("warning");
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        if (!isAnswered && gameActive) handleTimeout();
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
    playSound("wrong");
    document.querySelectorAll(".option-btn").forEach((btn) => {
      if (parseInt(btn.dataset.value) === q.answer)
        btn.classList.add("correct");
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
      if (parseInt(b.dataset.value) === q.answer) b.classList.add("correct");
      if (b === btn && !isCorrect) b.classList.add("wrong");
    });

    if (isCorrect) {
      score += q.score;
      updateScore();
      playSound("correct");
      feedbackDiv.textContent = `✅ 正确！ +${q.score} 分`;
      feedbackDiv.className = "feedback correct";
    } else {
      playSound("wrong");
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
    if (score === MAX_SCORE) showConfetti();
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
    playSound("correct");
  }

  function startGame() {
    currentQuestions = generateQuestions();
    currentIndex = 0;
    score = 0;
    updateScore();
    resultArea.style.display = "none";
    gameArea.style.display = "flex";
    if (backBtn) backBtn.style.display = "";
    showQuestion();
  }

  function restartGame() {
    if (timerInterval) clearInterval(timerInterval);
    resultArea.style.display = "none";
    gameArea.style.display = "flex";
    if (backBtn) backBtn.style.display = "";
    startGame();
  }

  // ============================================================
  // 二、剩多少 sheet
  // ============================================================
  const SPLIT_TOTAL = 10;
  const SPLIT_POINTS = 10;

  const splitSheet = document.getElementById("splitSheet");
  const splitScoreValue = document.getElementById("splitScoreValue");
  const splitRoundValue = document.getElementById("splitRoundValue");
  const splitTimerValue = document.getElementById("splitTimerValue");
  const splitTimerDisplay = document.getElementById("splitTimerDisplay");
  const splitRoot = document.getElementById("splitRoot");
  const splitLeft = document.getElementById("splitLeft");
  const splitAnswer = document.getElementById("splitAnswer");
  const splitPrompt = document.getElementById("splitPrompt");
  const splitOptions = document.getElementById("splitOptions");
  const splitFeedback = document.getElementById("splitFeedback");

  const splitState = {
    currentIndex: 0,
    score: 0,
    questions: [],
    isAnswered: false,
    timerInterval: null,
    timeLeft: 0,
    gameActive: false,
    generation: 0,
  };

  // 按题号生成题目：
  // 第 1-2 题：sum [2, 5]，5 秒
  // 第 3-4 题：sum [6, 10]，7 秒
  // 第 5-8 题：sum [11, 20]，15 秒
  // 第 9-10 题：sum = 30，10 秒
  function splitGenerateQuestionByIndex(index) {
    let sum, timeLimit;
    if (index < 2) {
      sum = randomInt(2, 5);
      timeLimit = 5;
    } else if (index < 4) {
      sum = randomInt(6, 10);
      timeLimit = 7;
    } else if (index < 8) {
      sum = randomInt(11, 20);
      timeLimit = 15;
    } else {
      sum = 30;
      timeLimit = 10;
    }

    // 左加数范围：sum=30 时 [10, 20]，否则 [1, sum-1]
    let left;
    if (sum === 30) {
      left = randomInt(10, 20);
    } else {
      left = randomInt(1, sum - 1);
    }

    return { sum, left, answer: sum - left, timeLimit };
  }

  // 生成 4 个选项，包含正确答案
  function splitGenerateOptions(correct) {
    const OPTION_MAX = 20;
    // 优先从"贴近正确答案的区间"取干扰项，不够再从全局取
    const nearCandidates = [];
    const nearMin = Math.max(1, correct - 5);
    const nearMax = Math.min(OPTION_MAX, correct + 5);
    for (let i = nearMin; i <= nearMax; i++) {
      if (i !== correct) nearCandidates.push(i);
    }
    shuffleArray(nearCandidates);

    const selected = [correct];
    for (const n of nearCandidates) {
      if (selected.length >= 4) break;
      selected.push(n);
    }

    // 不够再从全局补
    if (selected.length < 4) {
      const rest = [];
      for (let i = 1; i <= OPTION_MAX; i++) {
        if (!selected.includes(i)) rest.push(i);
      }
      shuffleArray(rest);
      for (const n of rest) {
        if (selected.length >= 4) break;
        selected.push(n);
      }
    }

    return shuffleArray(selected);
  }

  // 生成 10 道题：按题号难度递增，去重
  function splitGenerateAll() {
    const list = [];
    const usedBySum = new Map(); // sum -> Set(left)

    for (let i = 0; i < SPLIT_TOTAL; i++) {
      let q = null;
      let attempts = 0;
      const MAX_ATTEMPTS = 100;

      while (attempts < MAX_ATTEMPTS) {
        attempts++;
        const candidate = splitGenerateQuestionByIndex(i);
        if (!usedBySum.has(candidate.sum)) {
          usedBySum.set(candidate.sum, new Set());
        }
        const leftSet = usedBySum.get(candidate.sum);
        if (leftSet.has(candidate.left)) continue;
        leftSet.add(candidate.left);
        q = candidate;
        break;
      }

      if (!q) {
        q = splitGenerateQuestionByIndex(i);
        if (!usedBySum.has(q.sum)) usedBySum.set(q.sum, new Set());
        usedBySum.get(q.sum).add(q.left);
      }

      list.push(q);
    }

    return list;
  }

  function splitStartTimer(seconds) {
    if (splitState.timerInterval) clearInterval(splitState.timerInterval);
    splitState.timeLeft = seconds;
    splitTimerValue.textContent = splitState.timeLeft;
    splitTimerDisplay.classList.remove("warning");

    splitState.timerInterval = setInterval(() => {
      splitState.timeLeft--;
      splitTimerValue.textContent = splitState.timeLeft;
      if (splitState.timeLeft <= 2) splitTimerDisplay.classList.add("warning");
      if (splitState.timeLeft <= 0) {
        clearInterval(splitState.timerInterval);
        splitState.timerInterval = null;
        if (!splitState.isAnswered && splitState.gameActive)
          splitHandleTimeout();
      }
    }, 1000);
  }

  function splitStopTimer() {
    if (splitState.timerInterval) {
      clearInterval(splitState.timerInterval);
      splitState.timerInterval = null;
    }
    splitTimerDisplay.classList.remove("warning");
  }

  function splitShowQuestion() {
    if (splitState.currentIndex >= SPLIT_TOTAL) {
      splitShowResult();
      return;
    }

    splitState.isAnswered = false;
    splitState.gameActive = true;
    splitFeedback.textContent = "";
    splitFeedback.className = "feedback";

    const q = splitState.questions[splitState.currentIndex];
    splitRoot.textContent = q.sum;
    splitLeft.textContent = q.left;
    splitAnswer.textContent = "?";
    splitAnswer.classList.remove("filled");
    splitAnswer.style.background = "";
    splitPrompt.textContent = `${q.sum} 可以分成 ${q.left} 和 ？`;

    splitRoundValue.textContent = splitState.currentIndex + 1;
    splitScoreValue.textContent = splitState.score;

    splitOptions.innerHTML = "";
    const opts = splitGenerateOptions(q.answer, q.sum);
    opts.forEach((num) => {
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

      btn.addEventListener("click", () => splitHandleOptionClick(btn, num));
      splitOptions.appendChild(btn);
    });

    splitStartTimer(q.timeLimit);
  }

  function splitHandleOptionClick(btn, selected) {
    if (splitState.isAnswered || !splitState.gameActive) return;
    splitState.isAnswered = true;
    splitState.gameActive = false;
    splitStopTimer();

    const q = splitState.questions[splitState.currentIndex];
    const isCorrect = selected === q.answer;

    splitOptions.querySelectorAll(".option-btn").forEach((b) => {
      if (parseInt(b.dataset.value) === q.answer) b.classList.add("correct");
      if (b === btn && !isCorrect) b.classList.add("wrong");
    });

    if (isCorrect) {
      splitState.score += SPLIT_POINTS;
      splitScoreValue.textContent = splitState.score;
      splitAnswer.classList.add("filled");
      splitAnswer.textContent = q.answer;
      splitFeedback.textContent = `✅ 正确！ +${SPLIT_POINTS} 分`;
      splitFeedback.className = "feedback correct";
      playSound("correct");
    } else {
      splitAnswer.style.background = "#ffcdd2";
      splitAnswer.textContent = q.answer;
      splitFeedback.textContent = `❌ 正确答案是 ${q.answer}`;
      splitFeedback.className = "feedback wrong";
      playSound("wrong");
    }

    const gen = splitState.generation;
    setTimeout(() => {
      if (gen !== splitState.generation) return;
      splitState.currentIndex++;
      if (splitState.currentIndex >= SPLIT_TOTAL) splitShowResult();
      else splitShowQuestion();
    }, 1500);
  }

  function splitHandleTimeout() {
    if (splitState.isAnswered) return;
    splitState.isAnswered = true;
    const q = splitState.questions[splitState.currentIndex];

    splitOptions.querySelectorAll(".option-btn").forEach((b) => {
      if (parseInt(b.dataset.value) === q.answer) b.classList.add("correct");
    });

    splitAnswer.style.background = "#ffcdd2";
    splitAnswer.textContent = q.answer;
    splitFeedback.textContent = `⏰ 时间到！正确答案是 ${q.answer}`;
    splitFeedback.className = "feedback wrong";
    playSound("wrong");

    const gen = splitState.generation;
    setTimeout(() => {
      if (gen !== splitState.generation) return;
      splitState.currentIndex++;
      if (splitState.currentIndex >= SPLIT_TOTAL) splitShowResult();
      else splitShowQuestion();
    }, 1500);
  }

  function splitShowResult() {
    splitState.gameActive = false;
    splitStopTimer();

    splitFeedback.textContent = "";
    splitFeedback.className = "feedback";
    splitRoot.textContent = "🏆";
    splitLeft.textContent = "✅";
    splitAnswer.textContent = splitState.score;

    splitPrompt.innerHTML = `
      <div style="font-size:1.3rem; margin-bottom:8px;">🎉 完成！</div>
      <div>得分：<strong>${splitState.score}</strong> / ${SPLIT_TOTAL * SPLIT_POINTS}</div>
      <button id="splitRestartBtn"
        style="margin-top:14px; background:#4CAF50; color:#fff; border:none; padding:10px 26px; border-radius:40px; font-weight:bold; cursor:pointer; font-family:inherit; box-shadow:0 4px 0 #2e7d32;">
        🔄 再来一局
      </button>
    `;
    splitOptions.innerHTML = "";

    const btn = document.getElementById("splitRestartBtn");
    if (btn) btn.addEventListener("click", splitStartGame);
  }

  function splitStartGame() {
    splitStopTimer();
    splitState.generation++;
    splitState.currentIndex = 0;
    splitState.score = 0;
    splitState.isAnswered = false;
    splitState.gameActive = true;
    splitState.questions = splitGenerateAll();
    splitScoreValue.textContent = "0";
    splitRoundValue.textContent = "1";
    splitShowQuestion();
  }

  // ============================================================
  // 三、Tab 切换
  // ============================================================
  const tabMath = document.getElementById("tabMath");
  const tabSplit = document.getElementById("tabSplit");
  const mathSheet = document.getElementById("mathSheet");

  function switchToMath() {
    if (tabMath) tabMath.classList.add("active");
    if (tabSplit) tabSplit.classList.remove("active");
    if (mathSheet) mathSheet.classList.remove("hidden");
    if (splitSheet) splitSheet.classList.add("hidden");
    splitStopTimer();
    splitState.gameActive = false;
    restartGame();
  }

  function switchToSplit() {
    if (tabSplit) tabSplit.classList.add("active");
    if (tabMath) tabMath.classList.remove("active");
    if (splitSheet) splitSheet.classList.remove("hidden");
    if (mathSheet) mathSheet.classList.add("hidden");
    if (timerInterval) clearInterval(timerInterval);
    splitStartGame();
  }

  // ============================================================
  // 四、事件绑定与启动
  // ============================================================
  if (backBtn) bindGoHome(backBtn);
  if (restartBtn) restartBtn.addEventListener("click", restartGame);
  if (backHomeBtn) bindGoHome(backHomeBtn);

  const startOverlay = document.getElementById("startOverlay");
  const startBtn = document.getElementById("startBtn");
  const gameContainer = document.getElementById("gameContainer");

  function initAndStart() {
    if (startOverlay) startOverlay.style.display = "none";
    if (gameContainer) gameContainer.style.display = "block";
    wakeUpAudio();
    startGame();
  }

  if (startBtn) startBtn.addEventListener("click", initAndStart);

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

  if (tabMath) tabMath.addEventListener("click", switchToMath);
  if (tabSplit) tabSplit.addEventListener("click", switchToSplit);

  totalRounds.textContent = TOTAL_ROUNDS;
})();

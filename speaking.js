// ========= 游戏配置 =========
const TOTAL_QUESTIONS = 25;
const POINTS_PER_CORRECT = 4;

// ========= 游戏状态 =========
let gameState = {
  correct: 0,
  wrong: 0,
  score: 0,
  currentQuestionIndex: 0,
  questions: [], // 随机抽取的题目列表
  isListening: false,
  recognition: null,
  foundWords: new Set(), // 记录已答对的单词
};

// DOM 元素
const correctCountEl = document.getElementById("correctCount");
const wrongCountEl = document.getElementById("wrongCount");
const progressCountEl = document.getElementById("progressCount");
const totalScoreEl = document.getElementById("totalScore");
const progressFillEl = document.getElementById("progressFill");
const targetWordEl = document.getElementById("targetWord");
const wordImageEl = document.getElementById("wordImage");
const resultEl = document.getElementById("result");
const statusEl = document.getElementById("status");
const hintBtn = document.getElementById("hintBtn");
const skipBtn = document.getElementById("skipBtn");
const backBtn = document.getElementById("backBtn");

// ========= 辅助函数 =========
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 随机抽取 TOTAL_QUESTIONS 道题
function generateQuestions() {
  const allIndices = [...Array(window.wordList.length).keys()];
  const shuffled = shuffleArray([...allIndices]);
  const selected = shuffled.slice(0, TOTAL_QUESTIONS);
  return selected.map((idx) => window.wordList[idx]);
}

// 更新UI
function updateUI() {
  correctCountEl.textContent = gameState.correct;
  wrongCountEl.textContent = gameState.wrong;
  totalScoreEl.textContent = gameState.score;
  const progress = `${gameState.currentQuestionIndex}/${TOTAL_QUESTIONS}`;
  progressCountEl.textContent = progress;
  const percent = (gameState.currentQuestionIndex / TOTAL_QUESTIONS) * 100;
  progressFillEl.style.width = `${percent}%`;
}

// 更新当前显示的单词
function updateCurrentWord() {
  if (gameState.currentQuestionIndex >= TOTAL_QUESTIONS) {
    showGameComplete();
    return;
  }

  const current = gameState.questions[gameState.currentQuestionIndex];
  if (!current) return;

  targetWordEl.textContent = current.word;
  wordImageEl.src = current.image;
  wordImageEl.alt = current.word;

  // 音标
  const phoneticEl = document.getElementById("phonetic");
  if (phoneticEl && window.getPhoneticSymbol) {
    phoneticEl.textContent = window.getPhoneticSymbol(current.word);
  }

  // 图片加载失败处理
  wordImageEl.onerror = () => {
    wordImageEl.style.display = "none";
    const container = wordImageEl.parentNode;
    let fb = container.querySelector(".fallback-text");
    if (!fb) {
      fb = document.createElement("div");
      fb.className = "fallback-text";
      fb.innerHTML = `<div style="font-size:3rem">📷</div><div>${current.word}</div>`;
      container.appendChild(fb);
    }
  };
  wordImageEl.onload = () => {
    wordImageEl.style.display = "block";
    const container = wordImageEl.parentNode;
    const fb = container.querySelector(".fallback-text");
    if (fb) fb.remove();
  };
}

// 正确回答处理
function handleCorrect() {
  gameState.correct++;
  gameState.score += POINTS_PER_CORRECT;
  const currentWord =
    gameState.questions[gameState.currentQuestionIndex].word.toLowerCase();
  gameState.foundWords.add(currentWord);

  updateUI();

  statusEl.className = "status correct";
  statusEl.innerHTML = `✅ 正确！ +${POINTS_PER_CORRECT} 分`;

  // 播放正确音效
  playSoundEffect("correct");

  setTimeout(() => {
    gameState.currentQuestionIndex++;
    if (gameState.currentQuestionIndex >= TOTAL_QUESTIONS) {
      showGameComplete();
    } else {
      updateCurrentWord();
      statusEl.className = "status listening";
      statusEl.innerHTML = '<i class="fas fa-microphone"></i> Listening...';
      // 重新启动语音识别
      if (gameState.recognition) {
        try {
          gameState.recognition.start();
        } catch (e) {}
      }
    }
  }, 1500);
}

// 错误/跳过处理
function handleWrong() {
  gameState.wrong++;
  updateUI();
  playSoundEffect("wrong");

  statusEl.className = "status idle";
  statusEl.innerHTML = `⏩ 已跳过，进入下一题`;

  setTimeout(() => {
    gameState.currentQuestionIndex++;
    if (gameState.currentQuestionIndex >= TOTAL_QUESTIONS) {
      showGameComplete();
    } else {
      updateCurrentWord();
      statusEl.className = "status listening";
      statusEl.innerHTML = '<i class="fas fa-microphone"></i> Listening...';
      if (gameState.recognition) {
        try {
          gameState.recognition.start();
        } catch (e) {}
      }
    }
  }, 1200);
}

// 跳过当前单词
function skipCurrentWord() {
  if (gameState.currentQuestionIndex >= TOTAL_QUESTIONS) return;
  if (gameState.recognition) {
    try {
      gameState.recognition.stop();
    } catch (e) {}
  }
  handleWrong();
}

// 音效（复用 listening 模块）
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
    } else if (type === "wrong") {
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

// 游戏结束
function showGameComplete() {
  if (gameState.recognition) {
    try {
      gameState.recognition.stop();
    } catch (e) {}
  }
  gameState.isListening = false;

  const maxScore = TOTAL_QUESTIONS * POINTS_PER_CORRECT;
  statusEl.className = "status correct";
  statusEl.innerHTML = `🏆 游戏完成！ 得分：${gameState.score} / ${maxScore} 🏆`;

  // 彩蛋
  showConfetti();

  // 显示重新开始按钮
  const existingBtn = document.querySelector(".restart-btn");
  if (!existingBtn) {
    const restartBtn = document.createElement("button");
    restartBtn.className = "btn restart-btn";
    restartBtn.style.cssText =
      "background:#4caf50;color:white;margin-top:15px;padding:10px 20px;border-radius:40px;border:none;font-size:1rem;font-weight:bold;cursor:pointer;";
    restartBtn.innerHTML = '<i class="fas fa-redo"></i> 再来一局';
    restartBtn.addEventListener("click", () => {
      location.reload();
    });
    document.querySelector(".recognition-status").appendChild(restartBtn);
  }
}

// 彩蛋
function showConfetti() {
  const colors = ["#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0"];
  for (let i = 0; i < 80; i++) {
    const conf = document.createElement("div");
    conf.style.cssText = `position:fixed; width:8px; height:8px; background:${colors[i % 4]}; left:${Math.random() * 100}vw; top:-10px; border-radius:50%; pointer-events:none; z-index:9999;`;
    document.body.appendChild(conf);
    const anim = conf.animate(
      [
        { transform: "translateY(0)" },
        {
          transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`,
        },
      ],
      { duration: 1500 + Math.random() * 1500 },
    );
    anim.onfinish = () => conf.remove();
  }
}

// 语音识别匹配逻辑
function levenshteinDistance(a, b) {
  const m = Array(b.length + 1)
    .fill()
    .map(() => Array(a.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) m[0][i] = i;
  for (let i = 0; i <= b.length; i++) m[i][0] = i;
  for (let i = 1; i <= b.length; i++)
    for (let j = 1; j <= a.length; j++)
      m[i][j] = Math.min(
        m[i - 1][j] + 1,
        m[i][j - 1] + 1,
        m[i - 1][j - 1] + (b[i - 1] !== a[j - 1] ? 1 : 0),
      );
  return m[b.length][a.length];
}

function calculateSimilarity(a, b) {
  if (Math.abs(a.length - b.length) > 3) return 0.3;
  let posMatch = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++)
    if (a[i] === b[i]) posMatch++;
  const setA = new Set(a),
    setB = new Set(b);
  let setMatch = 0;
  for (let ch of setA) if (setB.has(ch)) setMatch++;
  return (
    (posMatch / Math.max(a.length, b.length)) * 0.7 +
    (setMatch / Math.max(setA.size, setB.size)) * 0.3
  );
}

function checkWordMatch(spoken) {
  if (gameState.currentQuestionIndex >= TOTAL_QUESTIONS) return;

  const current =
    gameState.questions[gameState.currentQuestionIndex].word.toLowerCase();
  let isMatch = false;

  if (spoken === current) isMatch = true;
  else if (
    levenshteinDistance(current, spoken) <= (current.length <= 4 ? 1 : 2)
  )
    isMatch = true;
  else if (current.includes(spoken) || spoken.includes(current)) {
    if (Math.abs(spoken.length - current.length) <= 3) isMatch = true;
    else if (spoken.length >= current.length / 2) isMatch = true;
  } else if (
    current.length >= 2 &&
    spoken.length >= 2 &&
    (current.substring(0, 2) === spoken.substring(0, 2) ||
      current.slice(-2) === spoken.slice(-2))
  )
    isMatch = true;
  else if (calculateSimilarity(current, spoken) >= 0.5) isMatch = true;

  if (isMatch && !gameState.foundWords.has(current)) {
    handleCorrect();
  } else if (!gameState.foundWords.has(current)) {
    statusEl.className = "status idle";
    statusEl.innerHTML = `❌ 识别出“${spoken}”，目标是“${current}”，再试试！`;
    if (gameState.isListening && gameState.recognition) {
      setTimeout(() => {
        try {
          gameState.recognition.start();
        } catch (e) {}
      }, 1000);
    }
  }
}

// 语音识别初始化
function initSpeechRecognition() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    statusEl.innerHTML = "❌ 浏览器不支持语音识别，请使用 Chrome / Edge";
    return null;
  }

  const rec = new SpeechRecognition();
  rec.continuous = false;
  rec.interimResults = false;
  rec.lang = "en-US";

  rec.onstart = () => {
    gameState.isListening = true;
    statusEl.className = "status listening";
    statusEl.innerHTML =
      '<i class="fas fa-microphone"></i> Listening... Speak now!';
  };

  rec.onresult = (e) => {
    const transcript = e.results[0][0].transcript.toLowerCase().trim();
    resultEl.textContent = transcript;
    checkWordMatch(transcript);
  };

  rec.onerror = (e) => {
    console.warn("识别错误", e.error);
    statusEl.className = "status idle";
    statusEl.innerHTML = `⚠️ 识别错误：${e.error}`;
    gameState.isListening = false;
    if (
      e.error !== "not-allowed" &&
      gameState.currentQuestionIndex < TOTAL_QUESTIONS
    ) {
      setTimeout(() => {
        if (
          !gameState.isListening &&
          gameState.currentQuestionIndex < TOTAL_QUESTIONS
        ) {
          try {
            gameState.recognition.start();
          } catch (e) {}
        }
      }, 1500);
    }
  };

  rec.onend = () => {
    gameState.isListening = false;
    if (gameState.currentQuestionIndex < TOTAL_QUESTIONS) {
      statusEl.className = "status idle";
      statusEl.innerHTML = "🎤 准备就绪，请说话...";
      setTimeout(() => {
        if (
          !gameState.isListening &&
          gameState.currentQuestionIndex < TOTAL_QUESTIONS
        ) {
          try {
            gameState.recognition.start();
          } catch (e) {}
        }
      }, 500);
    }
  };

  return rec;
}

// 提示发音（修复 current 未定义的问题）
function playHint() {
  if (gameState.currentQuestionIndex >= TOTAL_QUESTIONS) return;
  const currentWordObj = gameState.questions[gameState.currentQuestionIndex];
  if (!currentWordObj) return;
  const utterance = new SpeechSynthesisUtterance(currentWordObj.word);
  utterance.lang = "en-US";
  utterance.rate = 0.7;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  statusEl.innerHTML = `🔊 发音提示：${currentWordObj.word}`;
  setTimeout(() => {
    if (gameState.currentQuestionIndex < TOTAL_QUESTIONS) {
      statusEl.innerHTML = '<i class="fas fa-microphone"></i> Listening...';
    }
  }, 1500);
}

// 启动游戏
function startGame() {
  // 随机生成题目
  gameState.questions = generateQuestions();
  gameState.correct = 0;
  gameState.wrong = 0;
  gameState.score = 0;
  gameState.currentQuestionIndex = 0;
  gameState.foundWords.clear();

  updateUI();
  updateCurrentWord();

  // 初始化语音识别
  gameState.recognition = initSpeechRecognition();
  if (gameState.recognition) {
    setTimeout(() => {
      try {
        gameState.recognition.start();
      } catch (e) {}
    }, 500);
  }

  // 唤醒音频
  getAudioContext();
}

// ========= 事件绑定 =========
hintBtn?.addEventListener("click", () => {
  playHint();
});

skipBtn?.addEventListener("click", () => {
  if (gameState.currentQuestionIndex >= TOTAL_QUESTIONS) return;
  if (gameState.recognition) {
    try {
      gameState.recognition.stop();
    } catch (e) {}
  }
  handleWrong();
});

backBtn?.addEventListener("click", () => {
  window.location.href = "index.html";
});

// 启动
window.addEventListener("load", () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () =>
      window.speechSynthesis.getVoices();
  }
  startGame();
});

// ========= 依赖检查（只使用，不赋值） =========
function ensureGameData() {
  if (!window.__wordGame) {
    setTimeout(ensureGameData, 30);
    return;
  }

  if (typeof initListeningGame === "function") {
    initListeningGame();
  }
}

// ========= 游戏状态 =========
let gameState = {
  correctCount: 0,
  wrongCount: 0,
  currentQuestionIndex: 0,
  questionOrder: [],
  isAnswered: false,
  hintUsed: false,
  hintRemaining: 5,
  totalQuestions: 30,
  wrongWords: [],
};

let streakCount = 0;
let totalScore = 0;

// ========= DOM 元素 =========
const correctCountElement = document.getElementById("correctCount");
const wrongCountElement = document.getElementById("wrongCount");
const progressCountElement = document.getElementById("progressCount");
const progressFillElement = document.getElementById("progressFill");
const choicesGrid = document.getElementById("choicesGrid");
const repeatBtn = document.getElementById("repeatBtn");
const slowPlayBtn = document.getElementById("slowPlayBtn");
const hintBtn = document.getElementById("hintBtnListening");
const backBtn = document.getElementById("backBtn");
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

// 初始化游戏（用户点击开始按钮后调用）
function initAndStart() {
  // 隐藏遮罩，显示游戏容器
  startOverlay.style.display = "none";
  gameContainer.style.display = "block";

  // 唤醒音频
  wakeUpAudio();

  // 启动游戏
  if (typeof initListeningGame === "function") {
    initListeningGame();
  }
}

// 绑定开始按钮
if (startBtn) {
  startBtn.addEventListener("click", initAndStart);
}

// ========= 工具函数 =========
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function updateScoreDisplay() {
  correctCountElement.textContent = gameState.correctCount;
  wrongCountElement.textContent = gameState.wrongCount;
  progressCountElement.textContent = `${gameState.currentQuestionIndex}/${gameState.totalQuestions}`;
  const percent =
    (gameState.currentQuestionIndex / gameState.totalQuestions) * 100;
  progressFillElement.style.width = `${percent}%`;
  const totalScoreEl = document.getElementById("totalScore");
  if (totalScoreEl) totalScoreEl.textContent = totalScore;
}

function updateHintButton() {
  hintBtn.textContent = `Hint (${gameState.hintRemaining})`;
  hintBtn.disabled = gameState.hintRemaining <= 0;
}

// ========= 核心游戏逻辑 =========
function initListeningGame() {
  gameState.correctCount = 0;
  gameState.wrongCount = 0;
  gameState.currentQuestionIndex = 0;
  gameState.isAnswered = false;
  gameState.hintUsed = false;
  gameState.hintRemaining = 5;
  gameState.wrongWords = [];
  totalScore = 0;
  streakCount = 0;

  const wordList = window.__wordGame.wordList;
  const allIndices = [...Array(wordList.length).keys()];
  const shuffledAll = shuffleArray(allIndices);
  gameState.questionOrder = shuffledAll.slice(0, Math.min(30, wordList.length));
  gameState.totalQuestions = gameState.questionOrder.length;

  const actionButtons = document.querySelector(".action-buttons");
  if (actionButtons) actionButtons.style.display = "flex";

  updateScoreDisplay();
  updateHintButton();
  showQuestion();
}

function showQuestion() {
  if (gameState.currentQuestionIndex >= gameState.totalQuestions) {
    showGameComplete();
    return;
  }

  gameState.isAnswered = false;
  gameState.hintUsed = false;

  const actionButtons = document.querySelector(".action-buttons");
  if (actionButtons) actionButtons.style.display = "flex";
  if (slowPlayBtn) slowPlayBtn.disabled = false;

  const wordIndex = gameState.questionOrder[gameState.currentQuestionIndex];
  const wordList = window.__wordGame.wordList;
  const correctWord = wordList[wordIndex];

  generateChoices(wordIndex);
  SpeechHelper.speak(correctWord.word);
  updateScoreDisplay();
  updateHintButton();
}

function generateChoices(correctIndex) {
  const wordList = window.__wordGame.wordList;
  const getPhoneticSymbol = window.__wordGame.getPhoneticSymbol;
  const correctWord = wordList[correctIndex];
  const numChoices = gameState.currentQuestionIndex < 20 ? 4 : 6;

  // 1. 找出和正确答案同一 type 的其他单词
  const sameTypeIndices = [];
  for (let i = 0; i < wordList.length; i++) {
    if (i !== correctIndex && wordList[i].type === correctWord.type) {
      sameTypeIndices.push(i);
    }
  }

  // 2. 随机打乱同类型单词列表
  const shuffledSameType = shuffleArray([...sameTypeIndices]);

  // 3. 优先从同类型中取干扰项
  const neededCount = numChoices - 1;
  const selectedOthers = [];

  // 先从同类型取
  for (
    let i = 0;
    i < shuffledSameType.length && selectedOthers.length < neededCount;
    i++
  ) {
    selectedOthers.push(shuffledSameType[i]);
  }

  // 4. 如果同类型不够，再从其他类型补充
  if (selectedOthers.length < neededCount) {
    const otherIndices = [];
    for (let i = 0; i < wordList.length; i++) {
      if (i !== correctIndex && wordList[i].type !== correctWord.type) {
        otherIndices.push(i);
      }
    }
    const shuffledOthers = shuffleArray([...otherIndices]);
    for (
      let i = 0;
      i < shuffledOthers.length && selectedOthers.length < neededCount;
      i++
    ) {
      selectedOthers.push(shuffledOthers[i]);
    }
  }

  // 5. 构建选项列表
  const choiceIndices = [correctIndex, ...selectedOthers];
  const shuffledChoices = shuffleArray([...choiceIndices]);

  choicesGrid.innerHTML = "";
  choicesGrid.classList.remove("choices-grid-6");
  if (numChoices === 6) choicesGrid.classList.add("choices-grid-6");

  shuffledChoices.forEach((idx) => {
    const word = wordList[idx];
    const choice = document.createElement("div");
    choice.className = "choice-item";
    choice.dataset.wordIndex = idx;
    choice.dataset.isCorrect = idx === correctIndex;

    const img = document.createElement("img");
    img.src = word.image;
    img.alt = word.word;

    const wordLabel = document.createElement("div");
    wordLabel.className = "word-label";
    wordLabel.textContent = word.word;

    const wordPhonetic = document.createElement("div");
    wordPhonetic.className = "word-phonetic";
    wordPhonetic.textContent = getPhoneticSymbol(word.word);

    const wordChinese = document.createElement("div");
    wordChinese.className = "word-chinese";
    wordChinese.textContent = word.chinese || "";

    const details = document.createElement("div");
    details.className = "word-details";
    details.appendChild(wordLabel);
    details.appendChild(wordPhonetic);
    details.appendChild(wordChinese);

    choice.appendChild(img);
    choice.appendChild(details);

    img.onerror = () => {
      img.style.display = "none";
      const fallback = document.createElement("div");
      fallback.textContent = word.word;
      fallback.style.fontSize = "2rem";
      fallback.style.fontWeight = "bold";
      fallback.style.color = word.color;
      fallback.style.padding = "20px";
      choice.insertBefore(fallback, wordLabel);
    };

    choice.addEventListener("click", () =>
      handleChoiceClick(choice, correctIndex),
    );
    choicesGrid.appendChild(choice);
  });
}

function handleChoiceClick(clicked, correctIndex) {
  const wordList = window.__wordGame.wordList;
  const getPhoneticSymbol = window.__wordGame.getPhoneticSymbol;

  if (gameState.isAnswered) return;

  gameState.isAnswered = true;
  hintBtn.disabled = true;
  if (slowPlayBtn) slowPlayBtn.disabled = true;

  const clickedIndex = parseInt(clicked.dataset.wordIndex);
  const isCorrect = clickedIndex === correctIndex;
  const allChoices = document.querySelectorAll(".choice-item");
  allChoices.forEach((c) => c.classList.add("disabled"));

  let correctEl = null;
  allChoices.forEach((c) => {
    if (parseInt(c.dataset.wordIndex) === correctIndex) correctEl = c;
  });

  const points = gameState.currentQuestionIndex < 20 ? 3 : 4;

  if (isCorrect) {
    gameState.correctCount++;
    totalScore += points;
    streakCount++;
    clicked.classList.add("correct", "revealed");
    const icon = document.createElement("div");
    icon.className = "result-icon correct";
    icon.innerHTML = '<i class="fas fa-check-circle"></i>';
    clicked.appendChild(icon);
    const details = clicked.querySelector(".word-details");
    if (details) details.style.display = "flex";
    playSoundEffect("correct");
  } else {
    gameState.wrongCount++;
    streakCount = 0;
    gameState.wrongWords.push(wordList[correctIndex]);
    clicked.classList.add("wrong", "revealed");
    const wrongIcon = document.createElement("div");
    wrongIcon.className = "result-icon wrong";
    wrongIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
    clicked.appendChild(wrongIcon);
    if (correctEl) {
      correctEl.classList.add("correct", "revealed");
      const correctIcon = document.createElement("div");
      correctIcon.className = "result-icon correct";
      correctIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
      correctEl.appendChild(correctIcon);
      const correctDetails = correctEl.querySelector(".word-details");
      if (correctDetails) correctDetails.style.display = "flex";
    }
    playSoundEffect("wrong");
  }

  if (correctEl) {
    const details = correctEl.querySelector(".word-details");
    if (details) details.style.display = "flex";
  }

  updateScoreDisplay();

  const advanceDelay = 2000;
  if (streakCount >= 5) {
    showCelebration(() => {
      streakCount = 0;
      gameState.currentQuestionIndex++;
      showQuestion();
    });
  } else {
    setTimeout(() => {
      gameState.currentQuestionIndex++;
      showQuestion();
    }, advanceDelay);
  }
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
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.setValueAtTime(300, ctx.currentTime + 0.2);
      osc.type = "sawtooth";
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {}
}

// ========= 游戏结束 & 彩蛋 =========
function showGameComplete() {
  const getPhoneticSymbol = window.__wordGame.getPhoneticSymbol;
  updateScoreDisplay();
  choicesGrid.innerHTML = "";
  const actionButtons = document.querySelector(".action-buttons");
  if (actionButtons) actionButtons.style.display = "none";

  let wrongHtml = "";
  if (gameState.wrongWords.length) {
    wrongHtml = `
            <div class="wrong-words-section">
                <h3><i class="fas fa-book"></i> Words to Review (${gameState.wrongWords.length})</h3>
                <div class="wrong-words-list">
                    ${gameState.wrongWords
                      .map(
                        (w) => `
                        <div class="wrong-word-item">
                            <img src="${w.image}" style="width:80px;height:80px;object-fit:contain">
                            <div class="wrong-word-info">
                                <div class="wrong-word-text">${w.word}</div>
                                <div class="wrong-word-phonetic">${getPhoneticSymbol(w.word)}</div>
                                <div class="wrong-word-chinese">${w.chinese || ""}</div>
                            </div>
                            <div class="wrong-word-buttons">
                                <button class="wrong-word-play-btn" onclick="SpeechHelper.speak('${w.word}',0.7)">
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

  const completeDiv = document.createElement("div");
  completeDiv.className = "game-complete";
  completeDiv.innerHTML = `
        <h2><i class="fas fa-trophy"></i> Game Complete!</h2>
        <div class="final-score">
            <span class="correct">Correct: ${gameState.correctCount}</span> |
            <span class="wrong">Wrong: ${gameState.wrongCount}</span> |
            <span class="score">Score: ${totalScore}</span>
        </div>
        ${wrongHtml}
        <button id="playAgainBtn" class="repeat-btn"><i class="fas fa-redo"></i> Play Again</button>
        <button id="backToMenuBtn" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Menu</button>
    `;

  choicesGrid.appendChild(completeDiv);

  // 绑定错题本的收藏按钮事件
  document.querySelectorAll(".wrong-word-fav-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const word = btn.dataset.word;
      // 复用 wordlist 的收藏弹窗函数
      if (typeof showAddToFavoritesDialog === "function") {
        showAddToFavoritesDialog(word);
      } else {
        alert(`收藏单词 "${word}" 功能需要从单词表页面使用`);
      }
    });
  });

  document.getElementById("playAgainBtn")?.addEventListener("click", () => {
    if (actionButtons) actionButtons.style.display = "flex";
    initListeningGame();
  });
  document.getElementById("backToMenuBtn")?.addEventListener("click", () => {
    window.location.href = "index.html";
  });
  showConfetti();
}

function showCelebration(callback) {
  const msgs = ["Very Well!", "Great job!", "Fantastic!", "Amazing!"];
  const overlay = document.createElement("div");
  overlay.className = "celebration-overlay";
  overlay.innerHTML = `<div class="celebration-content"><div class="celebration-message">${msgs[Math.floor(Math.random() * msgs.length)]}</div></div>`;
  document.body.appendChild(overlay);
  setTimeout(() => {
    overlay.remove();
    if (callback) callback();
  }, 2000);
}

function showConfetti() {
  const colors = ["#FF6B6B", "#4ECDC4", "#FFD166", "#06D6A0"];
  for (let i = 0; i < 80; i++) {
    const conf = document.createElement("div");
    conf.style.cssText = `
            position:fixed; width:8px; height:8px;
            background:${colors[i % colors.length]};
            left:${Math.random() * 100}vw;
            top:-10px;
            border-radius:50%;
            pointer-events:none;
            z-index:9999;
        `;
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
}

// ========= 事件绑定 =========
repeatBtn?.addEventListener("click", () => {
  if (gameState.currentQuestionIndex < gameState.totalQuestions) {
    const idx = gameState.questionOrder[gameState.currentQuestionIndex];
    const wordList = window.__wordGame.wordList;
    SpeechHelper.speak(wordList[idx].word);
  }
});

slowPlayBtn?.addEventListener("click", () => {
  if (gameState.currentQuestionIndex < gameState.totalQuestions) {
    const idx = gameState.questionOrder[gameState.currentQuestionIndex];
    const wordList = window.__wordGame.wordList;
    SpeechHelper.speak(wordList[idx].word, 0.2);
  }
});

hintBtn?.addEventListener("click", () => {
  if (
    gameState.isAnswered ||
    gameState.hintUsed ||
    gameState.hintRemaining <= 0
  )
    return;
  gameState.hintUsed = true;
  gameState.hintRemaining--;
  updateHintButton();

  const correctIdx = gameState.questionOrder[gameState.currentQuestionIndex];
  const wrongs = [...document.querySelectorAll(".choice-item")].filter(
    (c) =>
      parseInt(c.dataset.wordIndex) !== correctIdx &&
      !c.classList.contains("eliminated"),
  );
  if (wrongs.length) {
    const target = wrongs[Math.floor(Math.random() * wrongs.length)];
    target.classList.add("eliminated");
  }
});

backBtn?.addEventListener("click", () => (window.location.href = "index.html"));

// 注意：不再自动调用 ensureGameData()，而是等待用户点击开始按钮
// 但为了兼容旧逻辑，保留 ensureGameData 的定义，启动由点击按钮触发

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

// ========= 连错记录 =========
const STREAK_KEY = "listening_wrong_streak";

// 获取某个单词的连错次数
function getWrongStreak(word) {
  try {
    const data = JSON.parse(localStorage.getItem(STREAK_KEY) || "{}");
    return data[word] || 0;
  } catch {
    return 0;
  }
}

// 更新连错次数：isCorrect=true 清零，false 则 +1
function updateWrongStreak(word, isCorrect) {
  try {
    const data = JSON.parse(localStorage.getItem(STREAK_KEY) || "{}");
    if (isCorrect) {
      data[word] = 0;
    } else {
      data[word] = (data[word] || 0) + 1;
    }
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("更新连错记录失败", e);
  }
}

// 获取所有连错 >= 2 的单词（用于遮罩展示）
function getFocusWords() {
  try {
    const data = JSON.parse(localStorage.getItem(STREAK_KEY) || "{}");
    const result = [];
    for (const [word, count] of Object.entries(data)) {
      if (count >= 2) {
        result.push({ word, count });
      }
    }
    // 按连错次数从高到低排序
    result.sort((a, b) => b.count - a.count);
    return result;
  } catch {
    return [];
  }
}

// ========= 渲染遮罩上的重点单词列表 =========
function renderFocusWordsOnOverlay() {
  const container = document.getElementById("focusWordsContainer");
  if (!container) return;

  const focusWords = getFocusWords();

  if (focusWords.length === 0) {
    container.innerHTML = `
      <div style="color: rgba(255,255,255,0.5); text-align: center; padding: 8px 0; font-size: 0.9rem;">
        ✅ 暂无需要重点复习的单词
      </div>
    `;
    return;
  }

  let html = `
    <div style="color: #ffd54f; font-size: 0.85rem; font-weight: bold; margin-bottom: 10px;">
      ⚠️ 需要重点复习的单词（连错 ≥ 2 次）
    </div>
  `;

  focusWords.forEach(({ word, count }) => {
    // 从 wordData 获取中文
    let chinese = "";
    let image = "";
    if (window.wordData && window.wordData[word]) {
      chinese = window.wordData[word].chinese || "";
      image = window.wordData[word].image || "";
    }

    html += `
      <div style="
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 0;
        border-bottom: 1px solid rgba(255,255,255,0.05);
        font-size: 0.9rem;
      ">
        ${image ? `<img src="${image}" style="width:28px;height:28px;object-fit:contain;border-radius:4px;flex-shrink:0;" onerror="this.style.display='none'">` : ""}
        <span style="color: #fff; font-weight: 500;">${word}</span>
        ${chinese ? `<span style="color: rgba(255,255,255,0.5); font-size: 0.8rem;">${chinese}</span>` : ""}
        <span style="margin-left: auto; color: #ff6b6b; font-weight: bold; font-size: 0.85rem;">
          ❌ 连错 ${count} 次
        </span>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ========= 遮罩按钮切换 =========
function initFocusToggle() {
  const toggleBtn = document.getElementById("toggleFocusBtn");
  const container = document.getElementById("focusWordsContainer");
  if (!toggleBtn || !container) return;

  let isOpen = false;

  toggleBtn.addEventListener("click", () => {
    isOpen = !isOpen;
    if (isOpen) {
      container.style.display = "block";
      toggleBtn.textContent = "📌 收起重点复习单词";
      toggleBtn.style.background = "rgba(255, 193, 7, 0.35)";
      renderFocusWordsOnOverlay();
    } else {
      container.style.display = "none";
      toggleBtn.textContent = "📌 查看需要重点复习的单词";
      toggleBtn.style.background = "rgba(255, 193, 7, 0.2)";
    }
  });
}

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
  startOverlay.style.display = "none";
  gameContainer.style.display = "block";
  wakeUpAudio();

  if (typeof initListeningGame === "function") {
    initListeningGame();
  }

  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
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

  // ===== 新增：滚动到底部 =====
  setTimeout(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }, 200);
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

  const sameTypeIndices = [];
  for (let i = 0; i < wordList.length; i++) {
    if (i !== correctIndex && wordList[i].type === correctWord.type) {
      sameTypeIndices.push(i);
    }
  }

  const shuffledSameType = shuffleArray([...sameTypeIndices]);
  const neededCount = numChoices - 1;
  const selectedOthers = [];

  for (
    let i = 0;
    i < shuffledSameType.length && selectedOthers.length < neededCount;
    i++
  ) {
    selectedOthers.push(shuffledSameType[i]);
  }

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

// ========= 核心：处理点击（含连错记录） =========
function handleChoiceClick(clicked, correctIndex) {
  const wordList = window.__wordGame.wordList;
  const getPhoneticSymbol = window.__wordGame.getPhoneticSymbol;

  if (gameState.isAnswered) return;

  gameState.isAnswered = true;
  hintBtn.disabled = true;
  if (slowPlayBtn) slowPlayBtn.disabled = true;

  const clickedIndex = parseInt(clicked.dataset.wordIndex);
  const isCorrect = clickedIndex === correctIndex;
  const correctWord = wordList[correctIndex];

  // ===== 更新连错记录 =====
  updateWrongStreak(correctWord.word, isCorrect);

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
    playSound("correct");
  } else {
    gameState.wrongCount++;
    streakCount = 0;
    gameState.wrongWords.push(correctWord);
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
    playSound("wrong");
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

// ========= 游戏结束 & 错题本（含连错次数） =========
function showGameComplete() {
  const getPhoneticSymbol = window.__wordGame.getPhoneticSymbol;
  updateScoreDisplay();
  choicesGrid.innerHTML = "";
  const actionButtons = document.querySelector(".action-buttons");
  if (actionButtons) actionButtons.style.display = "none";

  // 对错题本去重（同一单词可能多次答错）
  const uniqueWrongWords = [];
  const seen = new Set();
  gameState.wrongWords.forEach((w) => {
    if (!seen.has(w.word)) {
      seen.add(w.word);
      uniqueWrongWords.push(w);
    }
  });

  let wrongHtml = "";
  if (uniqueWrongWords.length) {
    wrongHtml = `
      <div class="wrong-words-section">
        <h3><i class="fas fa-book"></i> Words to Review (${uniqueWrongWords.length})</h3>
        <div class="wrong-words-list">
          ${uniqueWrongWords
            .map((w) => {
              const streak = getWrongStreak(w.word);
              let streakDisplay = "";
              if (streak === 0) {
                streakDisplay =
                  '<span style="color: #4caf50; font-size: 0.75rem;">✅ 已掌握</span>';
              } else if (streak === 1) {
                streakDisplay = `<span style="color: #ffd54f; font-size: 0.75rem;">❌ 连错 ${streak} 次</span>`;
              } else {
                streakDisplay = `<span style="color: #ff6b6b; font-size: 0.75rem; font-weight: bold;">❌ 连错 ${streak} 次</span>`;
              }
              return `
                <div class="wrong-word-item">
                  <img src="${w.image}" style="width:80px;height:80px;object-fit:contain">
                  <div class="wrong-word-info">
                    <div class="wrong-word-text">${w.word}</div>
                    <div class="wrong-word-phonetic">${getPhoneticSymbol(w.word)}</div>
                    <div class="wrong-word-chinese">${w.chinese || ""}</div>
                  </div>
                  <div style="display:flex;flex-direction:column;align-items:flex-end;gap:6px;">
                    <div style="font-size:0.8rem;">${streakDisplay}</div>
                    <div class="wrong-word-buttons">
                      <button class="wrong-word-play-btn" onclick="SpeechHelper.speak('${w.word}',0.7)">
                        <i class="fas fa-volume-up"></i>
                      </button>
                      <button class="wrong-word-fav-btn" data-word="${w.word}">
                        <i class="fa-regular fa-floppy-disk"></i>
                      </button>
                    </div>
                  </div>
                </div>
              `;
            })
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
    <div style="margin-top: 20px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
      <button id="playAgainBtn" class="repeat-btn"><i class="fas fa-redo"></i> Play Again</button>
      <button id="backToMenuBtn" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Menu</button>
    </div>
  `;

  choicesGrid.appendChild(completeDiv);

  // 绑定错题本的收藏按钮事件
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

  document.getElementById("playAgainBtn")?.addEventListener("click", () => {
    if (actionButtons) actionButtons.style.display = "flex";
    initListeningGame();
  });
  document.getElementById("backToMenuBtn")?.addEventListener("click", () => {
    goHome();
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

bindGoHome(backBtn);

// ========= 遮罩初始化 =========
// DOM 加载完成后初始化遮罩按钮
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFocusToggle);
} else {
  initFocusToggle();
}

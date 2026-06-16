// ========= 游戏状态 =========
let gameState = {
  correctCount: 0,
  wrongCount: 0,
  currentQuestionIndex: 0,
  questionOrder: [],
  isAnswered: false,
  totalQuestions: 25,
  wrongWords: [],
};

let streakCount = 0;
let totalScore = 0;

// ========= DOM 元素 =========
const correctCountEl = document.getElementById("correctCount");
const wrongCountEl = document.getElementById("wrongCount");
const totalScoreEl = document.getElementById("totalScore");
const progressCountEl = document.getElementById("progressCount");
const progressFillEl = document.getElementById("progressFill");
const roundInfoEl = document.getElementById("roundInfo");
const spellingContainer = document.getElementById("spellingContainer");
const backBtn = document.getElementById("backBtn");

// ========= 工具函数 =========
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function hasVowels(word) {
  const vowels = new Set(["a", "e", "i", "o", "u"]);
  for (let ch of word.toLowerCase()) {
    if (vowels.has(ch)) return true;
  }
  return false;
}

function updateScoreDisplay() {
  console.log(
    `📊 更新进度: ${gameState.currentQuestionIndex}/${gameState.totalQuestions}`,
  );
  correctCountEl.textContent = gameState.correctCount;
  wrongCountEl.textContent = gameState.wrongCount;
  totalScoreEl.textContent = totalScore;
  progressCountEl.textContent = `${gameState.currentQuestionIndex}/${gameState.totalQuestions}`;
  const percent =
    (gameState.currentQuestionIndex / gameState.totalQuestions) * 100;
  progressFillEl.style.width = `${percent}%`;
}

// ========= 核心游戏逻辑 =========
function initSpellingGame() {
  console.log("🚀 初始化游戏");
  gameState.correctCount = 0;
  gameState.wrongCount = 0;
  gameState.currentQuestionIndex = 0;
  gameState.isAnswered = false;
  gameState.wrongWords = [];
  totalScore = 0;
  streakCount = 0;

  const wordList = window.wordList;
  const allIndices = [...Array(wordList.length).keys()];
  const vowelIndices = allIndices.filter((i) => hasVowels(wordList[i].word));
  const shuffledAll = shuffleArray(vowelIndices);
  gameState.questionOrder = shuffledAll.slice(
    0,
    Math.min(25, vowelIndices.length),
  );
  gameState.totalQuestions = gameState.questionOrder.length;

  updateScoreDisplay();
  showQuestion();
}

function showQuestion() {
  console.log(`📖 显示题目，当前索引: ${gameState.currentQuestionIndex}`);
  updateScoreDisplay();

  if (gameState.currentQuestionIndex >= gameState.totalQuestions) {
    showGameComplete();
    return;
  }

  gameState.isAnswered = false;
  const wordIndex = gameState.questionOrder[gameState.currentQuestionIndex];
  const wordList = window.wordList;
  const correctWord = wordList[wordIndex];
  const originalWord = correctWord.word;
  const word = correctWord.word.toLowerCase();

  roundInfoEl.textContent = `Question ${gameState.currentQuestionIndex + 1}: Spell the word`;

  spellingContainer.innerHTML = "";
  const questionDiv = document.createElement("div");
  questionDiv.className = "spelling-question";

  const img = document.createElement("img");
  img.src = correctWord.image;
  img.alt = correctWord.word;
  img.onerror = () => {
    img.style.display = "none";
  };
  questionDiv.appendChild(img);

  const chineseDiv = document.createElement("div");
  chineseDiv.className = "spelling-chinese";
  chineseDiv.textContent = correctWord.chinese || "";
  questionDiv.appendChild(chineseDiv);

  const pronounceBtn = document.createElement("button");
  pronounceBtn.className = "spelling-pronounce-btn";
  pronounceBtn.innerHTML = '<i class="fas fa-volume-up"></i> Listen';
  pronounceBtn.addEventListener("click", () => {
    SpeechHelper.speak(correctWord.word);
  });
  questionDiv.appendChild(pronounceBtn);

  const wordDiv = document.createElement("div");
  wordDiv.className = "spelling-word";
  const vowelSet = new Set(["a", "e", "i", "o", "u"]);
  const vowelSlots = [];
  const expectedVowels = [];
  let vowelIndex = 0;

  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    if (vowelSet.has(ch)) {
      const slot = document.createElement("span");
      slot.className = "spelling-vowel-slot";
      slot.dataset.vowelIndex = vowelIndex;
      slot.dataset.charIndex = i;
      slot.dataset.expected = ch;
      slot.textContent = "_";
      vowelSlots.push(slot);
      expectedVowels.push(ch);
      wordDiv.appendChild(slot);
      vowelIndex++;
    } else {
      const span = document.createElement("span");
      span.className = "spelling-consonant";
      span.textContent = originalWord[i];
      wordDiv.appendChild(span);
    }
  }

  questionDiv.appendChild(wordDiv);

  const vowelButtonsDiv = document.createElement("div");
  vowelButtonsDiv.className = "spelling-vowel-buttons";
  const vowels = ["a", "e", "i", "o", "u"];
  const vowelBtns = [];
  vowels.forEach((v) => {
    const btn = document.createElement("button");
    btn.className = "spelling-vowel-btn";
    btn.textContent = v;
    btn.dataset.vowel = v;
    vowelBtns.push(btn);
    vowelButtonsDiv.appendChild(btn);
  });

  const backspaceBtn = document.createElement("button");
  backspaceBtn.className = "spelling-vowel-btn backspace";
  backspaceBtn.innerHTML = '<i class="fas fa-backspace"></i>';
  vowelButtonsDiv.appendChild(backspaceBtn);
  questionDiv.appendChild(vowelButtonsDiv);
  spellingContainer.appendChild(questionDiv);

  let currentSlotIndex = 0;

  function updateSlots() {
    vowelSlots.forEach((slot, idx) => {
      if (idx < currentSlotIndex) {
        slot.classList.add("filled");
      } else {
        slot.classList.remove("filled");
        slot.textContent = "_";
      }
    });
    const allBtns = vowelButtonsDiv.querySelectorAll(".spelling-vowel-btn");
    allBtns.forEach((btn) => {
      btn.disabled =
        gameState.isAnswered || currentSlotIndex >= vowelSlots.length;
    });
    backspaceBtn.disabled = gameState.isAnswered || currentSlotIndex === 0;
  }

  function fillVowel(vowel) {
    if (gameState.isAnswered) return;
    if (currentSlotIndex >= vowelSlots.length) return;
    const slot = vowelSlots[currentSlotIndex];
    slot.textContent = vowel;
    slot.dataset.filled = vowel;
    currentSlotIndex++;
    updateSlots();
    if (currentSlotIndex === vowelSlots.length) {
      checkAnswer(vowelSlots, expectedVowels, originalWord);
    }
  }

  vowelBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      fillVowel(btn.dataset.vowel);
    });
  });

  backspaceBtn.addEventListener("click", () => {
    if (gameState.isAnswered) return;
    if (currentSlotIndex === 0) return;
    currentSlotIndex--;
    const slot = vowelSlots[currentSlotIndex];
    slot.textContent = "_";
    delete slot.dataset.filled;
    updateSlots();
  });

  updateSlots();
}

function checkAnswer(vowelSlots, expectedVowels, originalWord) {
  if (gameState.isAnswered) return;
  gameState.isAnswered = true;

  let allCorrect = true;
  vowelSlots.forEach((slot, idx) => {
    const expected = expectedVowels[idx];
    const given = (slot.dataset.filled || "").toLowerCase();
    if (given === expected) {
      slot.classList.add("correct");
      const originalChar = originalWord[parseInt(slot.dataset.charIndex)];
      slot.textContent = originalChar;
    } else {
      slot.classList.add("wrong");
      allCorrect = false;
      slot.textContent = expected;
    }
  });

  const wordIndex = gameState.questionOrder[gameState.currentQuestionIndex];
  const wordList = window.wordList;
  const correctWord = wordList[wordIndex];

  if (allCorrect) {
    gameState.correctCount++;
    totalScore += 4;
    streakCount++;
    playSoundEffect("correct");
  } else {
    gameState.wrongCount++;
    streakCount = 0;
    gameState.wrongWords.push(correctWord);
    playSoundEffect("wrong");
  }

  console.log(
    `✅ 答题完成，准备增加索引，当前索引: ${gameState.currentQuestionIndex}`,
  );

  gameState.currentQuestionIndex++;

  console.log(`➡️ 索引已变为: ${gameState.currentQuestionIndex}`);

  const advanceDelay = 2000;
  const next = () => {
    console.log(
      `⏩ 调用 showQuestion，当前索引: ${gameState.currentQuestionIndex}`,
    );
    if (gameState.currentQuestionIndex >= gameState.totalQuestions) {
      showGameComplete();
    } else {
      showQuestion();
    }
  };

  if (streakCount >= 5) {
    showCelebration(() => {
      streakCount = 0;
      next();
    });
  } else {
    setTimeout(next, advanceDelay);
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
  updateScoreDisplay();
  spellingContainer.innerHTML = "";

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
                                <div class="wrong-word-phonetic">${window.getPhoneticSymbol(w.word)}</div>
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

  spellingContainer.appendChild(completeDiv);

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

  document
    .getElementById("playAgainBtn")
    ?.addEventListener("click", () => initSpellingGame());
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
backBtn?.addEventListener("click", () => (window.location.href = "index.html"));

// ========= 启动 =========
window.addEventListener("load", () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () =>
      window.speechSynthesis.getVoices();
  }
  initSpellingGame();
});

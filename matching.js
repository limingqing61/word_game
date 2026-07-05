// ========= 游戏状态 =========
let gameState = {
  correctCount: 0,
  wrongCount: 0,
  currentRound: 0,
  totalRounds: 30,
  pairs: [],
  selectedWord: null,
  selectedImage: null,
  matchedPairs: 0,
  totalPairs: 0,
  isRoundActive: true,
  streakCount: 0,
  totalScore: 0,
  wrongWords: [],
};

// DOM 元素
const correctCountEl = document.getElementById("correctCount");
const wrongCountEl = document.getElementById("wrongCount");
const totalScoreEl = document.getElementById("totalScore");
const roundCountEl = document.getElementById("roundCount");
const progressFillEl = document.getElementById("progressFill");
const roundInfoEl = document.getElementById("roundInfo");
const matchingContainer = document.getElementById("matchingContainer");
const backBtn = document.getElementById("backBtn");

// Shuffle 函数
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// 更新界面分数
function updateScoreDisplay() {
  correctCountEl.textContent = gameState.correctCount;
  wrongCountEl.textContent = gameState.wrongCount;
  totalScoreEl.textContent = gameState.totalScore;
  roundCountEl.textContent = `${gameState.currentRound}/${gameState.totalRounds}`;
  const percent = (gameState.currentRound / gameState.totalRounds) * 100;
  progressFillEl.style.width = `${percent}%`;
}

// 开始一轮
function startRound() {
  if (gameState.currentRound >= gameState.totalRounds) {
    showGameComplete();
    return;
  }

  gameState.isRoundActive = true;
  gameState.matchedPairs = 0;
  gameState.selectedWord = null;
  gameState.selectedImage = null;

  const numPairs = gameState.currentRound < 20 ? 3 : 5;
  gameState.totalPairs = numPairs;

  // ✅ 新逻辑：从同一类别中随机取单词
  // 1. 收集所有有单词的类别
  const typeMap = new Map();
  window.wordList.forEach((word) => {
    if (word.type && word.type !== "other") {
      if (!typeMap.has(word.type)) typeMap.set(word.type, []);
      typeMap.get(word.type).push(word);
    }
  });

  // 2. 过滤出单词数量足够的类别（至少 numPairs 个）
  const availableTypes = [];
  for (let [type, words] of typeMap.entries()) {
    if (words.length >= numPairs) {
      availableTypes.push(type);
    }
  }

  // 3. 如果找不到足够的类别，降级到从所有单词中随机取
  let selectedWords = [];
  if (availableTypes.length > 0) {
    // 随机选一个类别
    const randomType =
      availableTypes[Math.floor(Math.random() * availableTypes.length)];
    const typeWords = typeMap.get(randomType);
    const shuffledTypeWords = shuffleArray([...typeWords]);
    selectedWords = shuffledTypeWords.slice(0, numPairs);
  } else {
    // 降级方案：从所有单词中随机取（原逻辑）
    const shuffledAll = shuffleArray([...window.wordList]);
    selectedWords = shuffledAll.slice(0, numPairs);
  }

  gameState.pairs = selectedWords.map((w) => ({
    word: w.word,
    image: w.image,
    chinese: w.chinese,
    matched: false,
  }));

  const shuffledWords = shuffleArray([...gameState.pairs]);
  const shuffledImages = shuffleArray([...gameState.pairs]);

  matchingContainer.innerHTML = "";

  const leftCol = document.createElement("div");
  leftCol.className = "matching-column";
  const rightCol = document.createElement("div");
  rightCol.className = "matching-column";

  shuffledWords.forEach((pair) => {
    const wordDiv = document.createElement("div");
    wordDiv.className = "matching-word-item";
    wordDiv.textContent = pair.word;
    wordDiv.dataset.word = pair.word;
    wordDiv.addEventListener("click", (e) =>
      handleItemClick(e, wordDiv, pair.word),
    );
    leftCol.appendChild(wordDiv);
  });

  shuffledImages.forEach((pair) => {
    const imgDiv = document.createElement("div");
    imgDiv.className = "matching-image-item";
    imgDiv.dataset.word = pair.word;
    const img = document.createElement("img");
    img.src = pair.image;
    img.alt = pair.word;
    const chLabel = document.createElement("div");
    chLabel.className = "chinese-label";
    chLabel.textContent = pair.chinese;
    imgDiv.appendChild(img);
    imgDiv.appendChild(chLabel);
    imgDiv.addEventListener("click", (e) =>
      handleItemClick(e, imgDiv, pair.word),
    );
    rightCol.appendChild(imgDiv);
  });

  matchingContainer.appendChild(leftCol);
  matchingContainer.appendChild(rightCol);

  // 为后10题（5组）添加紧凑样式
  const scoreBoard = document.querySelector(".matching-score-board");
  if (numPairs === 5) {
    matchingContainer.classList.add("compact");
    roundInfoEl.classList.add("compact");
    if (scoreBoard) scoreBoard.classList.add("compact");
  } else {
    matchingContainer.classList.remove("compact");
    roundInfoEl.classList.remove("compact");
    if (scoreBoard) scoreBoard.classList.remove("compact");
  }

  // 显示当前类别（可选）
  const currentType = selectedWords[0]?.type || "mixed";
  const typeNames = {
    fruit: "水果",
    vegetable: "蔬菜",
    animal: "动物",
    body: "身体",
    food: "食物",
    household: "家居",
    clothing: "衣物",
    transport: "交通",
    nature: "自然",
    people: "人物",
    action: "动作",
    number: "数字",
    color: "颜色",
    place: "地点",
    toy: "玩具",
    time: "时间",
    country: "国家",
  };
  const typeDisplay = typeNames[currentType] || currentType;
  roundInfoEl.textContent = `Round ${gameState.currentRound + 1}: Match ${numPairs} ${typeDisplay}`;
  updateScoreDisplay();
}

// 点击配对逻辑（完全保留你原来的交互）
function handleItemClick(event, element, word) {
  if (!gameState.isRoundActive) return;
  if (element.classList.contains("matched")) return;

  if (gameState.selectedWord === null && gameState.selectedImage === null) {
    const isWord = element.classList.contains("matching-word-item");
    if (isWord) {
      gameState.selectedWord = element;
      element.classList.add("selected");
    } else {
      gameState.selectedImage = element;
      element.classList.add("selected");
    }
    return;
  }

  const selectedIsWord = gameState.selectedWord !== null;
  const clickedIsWord = element.classList.contains("matching-word-item");

  if (selectedIsWord === clickedIsWord) {
    if (gameState.selectedWord)
      gameState.selectedWord.classList.remove("selected");
    if (gameState.selectedImage)
      gameState.selectedImage.classList.remove("selected");
    gameState.selectedWord = null;
    gameState.selectedImage = null;

    if (clickedIsWord) {
      gameState.selectedWord = element;
      element.classList.add("selected");
    } else {
      gameState.selectedImage = element;
      element.classList.add("selected");
    }
    return;
  }

  const wordElement = selectedIsWord ? gameState.selectedWord : element;
  const imageElement = selectedIsWord ? element : gameState.selectedImage;
  const wordKey = wordElement.dataset.word;
  const imageKey = imageElement.dataset.word;

  if (wordKey === imageKey) {
    // 正确配对
    wordElement.classList.remove("selected");
    imageElement.classList.remove("selected");
    wordElement.classList.add("matched");
    imageElement.classList.add("matched");
    gameState.matchedPairs++;

    gameState.selectedWord = null;
    gameState.selectedImage = null;

    if (gameState.matchedPairs === gameState.totalPairs) {
      gameState.correctCount++;
      gameState.streakCount++;
      const points = gameState.currentRound < 20 ? 3 : 4;
      gameState.totalScore += points;
      updateScoreDisplay();
      playSound("correct");

      if (gameState.streakCount >= 5) {
        showCelebration(() => {
          gameState.streakCount = 0;
          gameState.currentRound++;
          startRound();
        });
      } else {
        setTimeout(() => {
          gameState.currentRound++;
          startRound();
        }, 1000);
      }
    }
  } else {
    // 错误配对
    gameState.wrongCount++;
    gameState.streakCount = 0;

    const wrongWordObj = window.wordList.find((w) => w.word === imageKey);
    if (wrongWordObj) gameState.wrongWords.push(wrongWordObj);

    updateScoreDisplay();
    playSound("wrong");

    wordElement.classList.remove("selected");
    imageElement.classList.remove("selected");
    wordElement.classList.add("wrong");
    imageElement.classList.add("wrong");

    setTimeout(() => {
      wordElement.classList.remove("wrong");
      imageElement.classList.remove("wrong");
      gameState.currentRound++;
      startRound();
    }, 1000);
  }
}

// 游戏结束界面
function showGameComplete() {
  updateScoreDisplay();
  matchingContainer.innerHTML = "";

  // ===== 隐藏底部的 Back 按钮 =====
  const backBtn = document.getElementById("backBtn");
  if (backBtn) backBtn.style.display = "none";

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
            <span class="score">Score: ${gameState.totalScore}</span>
        </div>
        ${wrongHtml}
        <button id="playAgainBtn" class="repeat-btn"><i class="fas fa-redo"></i> Play Again</button>
        <button id="backToMenuBtn" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Menu</button>
    `;

  matchingContainer.appendChild(completeDiv);

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

  document
    .getElementById("playAgainBtn")
    ?.addEventListener("click", () => initMatchingGame());
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

// 启动
function initMatchingGame() {
  // ===== 恢复显示底部的 Back 按钮 =====
  const backBtn = document.getElementById("backBtn");
  if (backBtn) backBtn.style.display = "";

  gameState.correctCount = 0;
  gameState.wrongCount = 0;
  gameState.currentRound = 0;
  gameState.totalScore = 0;
  gameState.wrongWords = [];
  updateScoreDisplay();
  startRound();
}

// 返回按钮
bindGoHome(backBtn);

// 页面启动
window.addEventListener("load", () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () =>
      window.speechSynthesis.getVoices();
  }
  initMatchingGame();
});

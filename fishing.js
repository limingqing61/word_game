(function () {
  const ROUNDS = [
    {
      points: 2,
      fishCount: 15,
      rodCols: 4,
      baseDelaySec: 5,
      speedKey: "round1",
    },
    {
      points: 3,
      fishCount: 10,
      rodCols: 6,
      baseDelaySec: 7,
      speedKey: "round2",
    },
    {
      points: 4,
      fishCount: 10,
      rodCols: 8,
      baseDelaySec: 9,
      speedKey: "round3",
    },
  ];
  const SPEED_MAP = {
    low: { round1: 7, round2: 6, round3: 5 },
    medium: { round1: 6, round2: 5, round3: 4 },
    high: { round1: 5, round2: 4, round3: 3 },
  };
  let currentDifficulty = null;
  let currentRound = 0;
  let totalScore = 0;
  let roundActive = false;
  let timerId = null;
  let fishList = [];
  let rodImages = [];
  let laneElements = [];
  let lanesCount = 3;
  let isGameEnded = false;
  let pendingFishCount = 0;
  let activeFishCount = 0;

  const pondArea = document.getElementById("pondArea");
  const rodArea = document.getElementById("rodArea");
  const totalScoreSpan = document.getElementById("totalScore");
  const diffBtns = document.querySelectorAll(".difficulty-btn");
  const backBtn = document.getElementById("backBtn");

  // ========== 音效 ==========
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

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function getRandomRodImages(count) {
    const allWords = Object.keys(window.wordData).filter((word) => {
      const wordData = window.wordData[word];
      return wordData && wordData.type !== "time";
    });

    if (allWords.length === 0) {
      console.warn("没有可用的非 time 类型单词");
      return [];
    }

    const shuffled = shuffleArray([...allWords]);
    return shuffled.slice(0, count);
  }

  function renderRodArea(rodCols, images) {
    rodArea.innerHTML = "";
    const rows = 3;
    const gridDiv = document.createElement("div");
    gridDiv.className = "rod-grid";
    gridDiv.style.gridTemplateColumns = `repeat(${rodCols}, 1fr)`;
    for (let i = 0; i < rows * rodCols; i++) {
      const idx = i % images.length;
      const wordKey = images[idx];
      const wordData = window.wordData[wordKey];
      const card = document.createElement("div");
      card.className = "rod-card";
      card.dataset.word = wordKey;
      const img = document.createElement("img");
      img.src = wordData.image;
      img.alt = wordKey;
      card.appendChild(img);
      card.addEventListener(
        "click",
        (function (wk) {
          return function () {
            onRodClick(wk);
          };
        })(wordKey),
      );
      gridDiv.appendChild(card);
    }
    rodArea.appendChild(gridDiv);
  }

  function initPond() {
    pondArea.innerHTML = "";
    laneElements = [];
    for (let i = 0; i < lanesCount; i++) {
      const lane = document.createElement("div");
      lane.className = "fish-lane";
      lane.dataset.lane = i;
      pondArea.appendChild(lane);
      laneElements.push(lane);
    }
  }

  function clearAllFish() {
    fishList.forEach((f) => {
      if (f.moveInterval) cancelAnimationFrame(f.moveInterval);
      if (f.endTimer) clearTimeout(f.endTimer);
      if (f.element && f.element.remove) f.element.remove();
    });
    fishList = [];
  }

  function stopRoundTimers() {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }
  }

  function showFloatNumber(x, y, text, color = "#ffd966") {
    const div = document.createElement("div");
    div.className = "float-number";
    div.textContent = text;
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.style.color = color;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 500);
  }

  function onRodClick(wordKey) {
    if (!roundActive || isGameEnded) return;
    const matchedFish = fishList.find((f) => f.wordKey === wordKey);
    if (matchedFish) {
      playSoundEffect("correct");
      const points = ROUNDS[currentRound].points;
      totalScore += points;
      totalScoreSpan.innerText = totalScore;
      const rect = matchedFish.element.getBoundingClientRect();
      showFloatNumber(rect.left + 20, rect.top, `+${points}`, "#a5ffa5");
      if (matchedFish.moveInterval)
        cancelAnimationFrame(matchedFish.moveInterval);
      if (matchedFish.endTimer) clearTimeout(matchedFish.endTimer);
      matchedFish.element.remove();
      const idx = fishList.indexOf(matchedFish);
      if (idx !== -1) fishList.splice(idx, 1);
      activeFishCount--;
      checkRoundComplete();
    } else {
      playSoundEffect("wrong");
      totalScore -= 1;
      totalScoreSpan.innerText = totalScore;
      const rect = event.target.closest(".rod-card")?.getBoundingClientRect();
      if (rect) showFloatNumber(rect.left + 30, rect.top, "-1", "#ffaaaa");
    }
  }

  function startFishMoving(fishObj, laneWidthPx, durationSec) {
    const fishEl = fishObj.element;
    const startPos = 0;
    const endPos = laneWidthPx - fishEl.clientWidth;
    let startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const progress = Math.min(1, elapsed / durationSec);
      const leftPos = startPos + (endPos - startPos) * progress;
      fishEl.style.left = leftPos + "px";
      if (progress < 1) {
        fishObj.moveInterval = requestAnimationFrame(step);
      } else {
        if (fishEl && fishEl.remove) fishEl.remove();
        const idx = fishList.indexOf(fishObj);
        if (idx !== -1) fishList.splice(idx, 1);
        activeFishCount--;
        checkRoundComplete();
      }
    }
    if (fishObj.moveInterval) cancelAnimationFrame(fishObj.moveInterval);
    fishObj.moveInterval = requestAnimationFrame(step);
  }

  function canDispatchFish(laneIdx, wordKey) {
    if (fishList.some((f) => f.laneIdx === laneIdx)) return false;
    if (fishList.some((f) => f.wordKey === wordKey)) return false;
    return true;
  }

  function dispatchFish(laneIdx, wordKey, durationSec) {
    if (!canDispatchFish(laneIdx, wordKey)) {
      setTimeout(() => dispatchFish(laneIdx, wordKey, durationSec), 200);
      return;
    }
    const lane = laneElements[laneIdx];
    if (!lane) return;
    const wordData = window.wordData[wordKey];
    const fishEl = document.createElement("img");
    fishEl.src = wordData.image;
    fishEl.className = "fish";
    fishEl.style.position = "absolute";
    fishEl.style.left = "0px";
    fishEl.style.top = "calc(50% - 20px)";
    fishEl.style.width = "75px";
    fishEl.style.height = "75px";
    fishEl.style.objectFit = "contain";
    lane.appendChild(fishEl);
    const fishObj = {
      laneIdx,
      element: fishEl,
      wordKey,
      moveInterval: null,
      endTimer: null,
    };
    fishList.push(fishObj);
    activeFishCount++;
    const laneWidth = lane.clientWidth;
    startFishMoving(fishObj, laneWidth, durationSec);
  }

  function buildFishQueue(roundIdx, fishCount, laneCount, durationSec) {
    const queue = [];
    const availableWords = [...rodImages];
    const totalTimeWindow = ROUNDS[roundIdx].baseDelaySec + durationSec * 2.5;
    let lastTime = 0;
    let lastWord = null;
    for (let i = 0; i < fishCount; i++) {
      let candidateWords = availableWords.filter((w) => w !== lastWord);
      if (candidateWords.length === 0) candidateWords = availableWords;
      const randomWord =
        candidateWords[Math.floor(Math.random() * candidateWords.length)];
      lastWord = randomWord;
      const lane = i % laneCount;
      let timeOffset;
      if (i === 0) timeOffset = ROUNDS[roundIdx].baseDelaySec;
      else {
        const avgGap =
          (totalTimeWindow - ROUNDS[roundIdx].baseDelaySec) / fishCount;
        let gap = Math.max(1.0, avgGap * (0.7 + Math.random() * 0.8));
        timeOffset = lastTime + gap;
      }
      lastTime = timeOffset;
      queue.push({ lane, wordKey: randomWord, timeOffset });
    }
    queue.sort((a, b) => a.timeOffset - b.timeOffset);
    return queue;
  }

  function executeFishQueue(queue, durationSec, onComplete) {
    let idx = 0;
    function schedule() {
      if (idx >= queue.length) return;
      const item = queue[idx];
      const delay =
        (idx === 0
          ? item.timeOffset
          : item.timeOffset - queue[idx - 1].timeOffset) * 1000;
      timerId = setTimeout(() => {
        dispatchFish(item.lane, item.wordKey, durationSec);
        idx++;
        schedule();
      }, delay);
    }
    schedule();
    const checkCompletion = setInterval(() => {
      if (idx >= queue.length && activeFishCount === 0) {
        clearInterval(checkCompletion);
        if (onComplete) onComplete();
      }
    }, 200);
  }

  function showGameComplete() {
    if (isGameEnded) return;
    isGameEnded = true;
    roundActive = false;
    const levelText = { low: "低", medium: "中", high: "高" }[
      currentDifficulty
    ];

    rodArea.style.display = "none";
    pondArea.style.display = "none";

    const gameGrid = document.querySelector(".game-grid");
    const existingPanel = document.getElementById("gameEndPanel");
    if (existingPanel) existingPanel.remove();

    const endContainer = document.createElement("div");
    endContainer.id = "gameEndPanel";
    endContainer.style.cssText = `
            background: #0f1f0f;
            border-radius: 60px;
            padding: 30px 20px;
            text-align: center;
            margin: 20px 0;
            border: 3px solid #ffaa33;
        `;
    endContainer.innerHTML = `
            <h2 style="color:#ffd966; font-size:2.5rem; margin:0 0 15px 0;">🎉 游戏结束 🎉</h2>
            <p style="font-size:1.8rem; margin:15px 0; color:#fff;">难度：${levelText}</p>
            <p style="font-size:2rem; margin:15px 0; color:#ffaa66;">🏆 最终得分：${totalScore}</p>
            <div style="display:flex; justify-content:center; gap:20px; margin-top:30px;">
                <button id="restartGameBtn" style="background:#4caf50; border:none; padding:10px 30px; border-radius:40px; font-size:1.2rem; font-weight:bold; cursor:pointer;">🎣 再来一局</button>
                <button id="homeBtn" style="background:#ffaa33; border:none; padding:10px 30px; border-radius:40px; font-size:1.2rem; font-weight:bold; cursor:pointer;">🏠 回到主页</button>
            </div>
        `;
    gameGrid.appendChild(endContainer);

    const restartBtn = document.getElementById("restartGameBtn");
    const homeBtn = document.getElementById("homeBtn");
    if (restartBtn)
      restartBtn.addEventListener("click", () => location.reload());
    if (homeBtn) bindGoHome(homeBtn);
  }

  function checkRoundComplete() {
    if (!roundActive) return;
    if (activeFishCount === 0 && pendingFishCount === 0) {
      roundActive = false;
      if (currentRound + 1 < ROUNDS.length) {
        currentRound++;
        startRound(currentRound);
      } else {
        showGameComplete();
      }
    }
  }

  function startRound(roundIdx) {
    if (isGameEnded) return;
    roundActive = true;
    const roundCfg = ROUNDS[roundIdx];
    const rodCols = roundCfg.rodCols;
    const rodCount = 3 * rodCols;
    const fishCount = roundCfg.fishCount;
    const durationSec = SPEED_MAP[currentDifficulty][roundCfg.speedKey];
    const uniqueImages = getRandomRodImages(rodCount);
    rodImages = uniqueImages;
    renderRodArea(rodCols, rodImages);
    clearAllFish();
    activeFishCount = 0;
    pendingFishCount = fishCount;
    const fishQueue = buildFishQueue(
      roundIdx,
      fishCount,
      lanesCount,
      durationSec,
    );
    executeFishQueue(fishQueue, durationSec, () => {
      pendingFishCount = 0;
      checkRoundComplete();
    });
  }

  function startGameWithDifficulty() {
    if (currentDifficulty === null) return;
    diffBtns.forEach((btn) => (btn.disabled = true));
    totalScore = 0;
    totalScoreSpan.innerText = "0";
    currentRound = 0;
    isGameEnded = false;

    const existingPanel = document.getElementById("gameEndPanel");
    if (existingPanel) existingPanel.remove();
    rodArea.style.display = "";
    pondArea.style.display = "";

    initPond();
    startRound(0);
  }

  diffBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (currentDifficulty !== null) return;
      diffBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentDifficulty = btn.dataset.diff;
      startGameWithDifficulty();
    });
  });

  // ===== 返回首页按钮 =====
  if (backBtn) {
    bindGoHome(backBtn);
  }
})();

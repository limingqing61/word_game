(function () {
  const ANIMALS = [
    { id: "elephant", name: "Elephant", score: 8, rank: 8 },
    { id: "lion", name: "Lion", score: 7, rank: 7 },
    { id: "tiger", name: "Tiger", score: 6, rank: 6 },
    { id: "leopard", name: "Leopard", score: 5, rank: 5 },
    { id: "wolf", name: "Wolf", score: 4, rank: 4 },
    { id: "dog", name: "Dog", score: 3, rank: 3 },
    { id: "cat", name: "Cat", score: 2, rank: 2 },
    { id: "rat", name: "Rat", score: 1, rank: 1 },
  ];

  // ========== 徽章系统 ==========
  const BADGE_KEYS = {
    HIGH_SCORE: "beastChess_highScore",
    WIN_STREAK: "beastChess_winStreak",
  };
  const WIN_STREAK_KEY = "beastChess_currentWinStreak";

  function getBadgeCount(key) {
    const val = localStorage.getItem(key);
    return val ? parseInt(val) : 0;
  }

  function addBadge(key) {
    const current = getBadgeCount(key);
    localStorage.setItem(key, current + 1);
    return current + 1;
  }

  function getCurrentWinStreak() {
    const val = localStorage.getItem(WIN_STREAK_KEY);
    return val ? parseInt(val) : 0;
  }

  function setCurrentWinStreak(count) {
    if (count === 0) {
      localStorage.removeItem(WIN_STREAK_KEY);
    } else {
      localStorage.setItem(WIN_STREAK_KEY, count);
    }
  }

  function updateBadgesDisplay() {
    const highScoreCount = getBadgeCount(BADGE_KEYS.HIGH_SCORE);
    const winStreakCount = getBadgeCount(BADGE_KEYS.WIN_STREAK);

    const highScoreBadge = document.getElementById("highScoreBadge");
    const winStreakBadge = document.getElementById("winStreakBadge");
    const highScoreCountEl = document.getElementById("highScoreCount");
    const winStreakCountEl = document.getElementById("winStreakCount");

    if (highScoreBadge && highScoreCount > 0) {
      highScoreBadge.style.display = "flex";
      if (highScoreCountEl) highScoreCountEl.textContent = highScoreCount;
    } else if (highScoreBadge) {
      highScoreBadge.style.display = "none";
    }

    if (winStreakBadge && winStreakCount > 0) {
      winStreakBadge.style.display = "flex";
      if (winStreakCountEl) winStreakCountEl.textContent = winStreakCount;
    } else if (winStreakBadge) {
      winStreakBadge.style.display = "none";
    }
  }

  // 显示徽章彩蛋
  function showBadgeEarned(badgeIconSrc, badgeName, newCount) {
    return new Promise((resolve) => {
      const overlay = document.createElement("div");
      overlay.className = "badge-earned-overlay";
      overlay.innerHTML = `
        <div class="badge-earned-card">
          <img class="badge-earned-icon" src="${badgeIconSrc}" alt="${badgeName}">
          <div class="badge-earned-name">${badgeName}</div>
          <div class="badge-earned-count">x ${newCount}</div>
          <div class="badge-earned-text">🎉 获得新徽章！ 🎉</div>
        </div>
      `;
      document.body.appendChild(overlay);
      setTimeout(() => {
        overlay.remove();
        resolve();
      }, 2000);
    });
  }

  // 全局复用 AudioContext
  let sharedAudioCtx = null;

  function getAudioContext() {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return sharedAudioCtx;
  }

  function resumeAudioContext() {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
  }

  function getWinner(playerAnimal, computerAnimal) {
    if (!playerAnimal || !computerAnimal) return 0;
    const playerRank = playerAnimal.rank;
    const computerRank = computerAnimal.rank;
    if (playerAnimal.id === "rat" && computerAnimal.id === "elephant") return 1;
    if (computerAnimal.id === "rat" && playerAnimal.id === "elephant")
      return -1;
    if (playerRank > computerRank) return 1;
    if (playerRank < computerRank) return -1;
    return 0;
  }

  function getAnimalScore(animal) {
    return animal ? animal.score : 0;
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
      console.warn("Audio error:", e);
    }
  }

  function showFloatScore(x, y, score, isPlayer) {
    const div = document.createElement("div");
    div.className = "float-score";
    div.textContent = `${isPlayer ? "+" : ""}${score}`;
    div.style.color = isPlayer ? "#a5ffa5" : "#ffaa66";
    div.style.left = x + "px";
    div.style.top = y + "px";
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 800);
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function createAnimalCard(animal, showBack = false) {
    const container = document.createElement("div");
    container.style.position = "relative";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.justifyContent = "center";

    if (showBack) {
      const backDiv = document.createElement("div");
      backDiv.style.width = "70%";
      backDiv.style.height = "70%";
      backDiv.style.backgroundColor = "#8B6914";
      backDiv.style.borderRadius = "20px";
      backDiv.style.display = "flex";
      backDiv.style.alignItems = "center";
      backDiv.style.justifyContent = "center";
      backDiv.style.fontSize = "1.8rem";
      backDiv.innerHTML = "❓";
      backDiv.style.boxShadow = "inset 0 0 10px rgba(0,0,0,0.3)";
      container.appendChild(backDiv);
      return container;
    }

    const img = document.createElement("img");
    img.src = `images/${animal.id}.jpeg`;
    img.alt = animal.name;
    img.style.width = "75%";
    img.style.height = "75%";
    img.style.objectFit = "contain";

    const badge = document.createElement("div");
    badge.textContent = `${animal.score}`;
    badge.style.position = "absolute";
    badge.style.bottom = "2px";
    badge.style.right = "2px";
    badge.style.backgroundColor = "rgba(0,0,0,0.7)";
    badge.style.color = "#ffd966";
    badge.style.fontSize = "0.7rem";
    badge.style.fontWeight = "bold";
    badge.style.padding = "2px 5px";
    badge.style.borderRadius = "15px";
    badge.style.border = "1px solid #ffaa33";
    badge.style.minWidth = "22px";
    badge.style.textAlign = "center";

    container.appendChild(img);
    container.appendChild(badge);
    return container;
  }

  function showExplosion(x, y, callback) {
    const div = document.createElement("div");
    div.textContent = "💥✨";
    div.style.position = "fixed";
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.style.fontSize = "3rem";
    div.style.transform = "translate(-50%, -50%)";
    div.style.zIndex = "20000";
    div.style.pointerEvents = "none";
    div.style.animation = "explodeAnim 0.5s ease-out forwards";
    document.body.appendChild(div);
    setTimeout(() => {
      div.remove();
      if (callback) callback();
    }, 500);
  }

  function showHandshakeAt(x, y, callback) {
    const div = document.createElement("div");
    div.textContent = "🤝";
    div.style.position = "fixed";
    div.style.left = x + "px";
    div.style.top = y + "px";
    div.style.fontSize = "4rem";
    div.style.transform = "translate(-50%, -50%)";
    div.style.zIndex = "20000";
    div.style.pointerEvents = "none";
    div.style.animation = "shakeAnim 0.5s ease-out";
    document.body.appendChild(div);
    setTimeout(() => {
      div.remove();
      if (callback) callback();
    }, 500);
  }

  class BeastChess {
    constructor() {
      this.playerGrid = Array(8).fill(null);
      this.computerGrid = Array(8).fill(null);
      this.playerScore = 0;
      this.computerScore = 0;
      this.gameActive = false;
      this.battleIndex = 0;
      this.battleTimeout = null;
      this.computerRevealed = Array(8).fill(false);
      this.init();
    }

    init() {
      const shuffled = [...ANIMALS];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      this.computerGrid = [...shuffled];
      this.computerRevealed = Array(8).fill(false);
      this.playerGrid = Array(8).fill(null);
      this.playerScore = 0;
      this.computerScore = 0;
      this.gameActive = false;
      this.battleIndex = 0;
      this.updateUI();
      this.updateStartButton();
    }

    updateUI() {
      const computerGridEl = document.getElementById("computerGrid");
      computerGridEl.innerHTML = "";
      this.computerGrid.forEach((animal, idx) => {
        const cell = document.createElement("div");
        cell.className = "chess-cell";
        cell.dataset.index = idx;
        if (animal) {
          const showBack = !this.computerRevealed[idx];
          const card = createAnimalCard(animal, showBack);
          cell.appendChild(card);
        } else {
          cell.classList.add("empty");
        }
        computerGridEl.appendChild(cell);
      });

      const playerGridEl = document.getElementById("playerGrid");
      playerGridEl.innerHTML = "";
      this.playerGrid.forEach((animal, idx) => {
        const cell = document.createElement("div");
        cell.className = "chess-cell";
        cell.dataset.index = idx;
        if (animal) {
          const card = createAnimalCard(animal, false);
          cell.appendChild(card);
        } else {
          cell.classList.add("empty");
        }
        cell.addEventListener("dragover", (e) => {
          e.preventDefault();
          cell.classList.add("drag-over");
        });
        cell.addEventListener("dragleave", () => {
          cell.classList.remove("drag-over");
        });
        cell.addEventListener("drop", (e) => {
          e.preventDefault();
          cell.classList.remove("drag-over");
          const animalId = e.dataTransfer.getData("text/plain");
          if (!animalId) return;
          const animal = ANIMALS.find((a) => a.id === animalId);
          if (!animal) return;
          const targetIdx = parseInt(cell.dataset.index);
          this.placeAnimal(targetIdx, animal);
        });
        playerGridEl.appendChild(cell);
      });

      const poolEl = document.getElementById("animalsPool");
      poolEl.innerHTML = "";
      const placedIds = this.playerGrid
        .filter((a) => a !== null)
        .map((a) => a.id);
      const availableAnimals = ANIMALS.filter((a) => !placedIds.includes(a.id));
      availableAnimals.forEach((animal) => {
        const card = document.createElement("div");
        card.className = "animal-card";
        card.draggable = true;
        card.setAttribute("data-animal-id", animal.id);
        const img = document.createElement("img");
        img.src = `images/${animal.id}.jpeg`;
        img.alt = animal.name;
        const nameSpan = document.createElement("div");
        nameSpan.className = "animal-name";
        nameSpan.textContent = animal.name;
        const scoreSpan = document.createElement("div");
        scoreSpan.className = "animal-score";
        scoreSpan.textContent = `⚡${animal.score}`;
        card.appendChild(img);
        card.appendChild(nameSpan);
        card.appendChild(scoreSpan);

        card.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          return false;
        });

        card.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", animal.id);
          e.dataTransfer.effectAllowed = "copy";
          card.classList.add("dragging");
          const dragIcon = document.createElement("div");
          dragIcon.style.opacity = "0";
          document.body.appendChild(dragIcon);
          e.dataTransfer.setDragImage(dragIcon, 0, 0);
          setTimeout(() => dragIcon.remove(), 0);
        });

        card.addEventListener("dragend", (e) => {
          card.classList.remove("dragging");
        });

        poolEl.appendChild(card);
      });

      document.getElementById("playerScore").textContent = this.playerScore;
      document.getElementById("computerScore").textContent = this.computerScore;
    }

    placeAnimal(index, animal) {
      if (this.playerGrid[index] !== null) return;
      if (this.playerGrid.includes(animal)) return;
      this.playerGrid[index] = animal;
      this.updateUI();
      this.updateStartButton();
    }

    updateStartButton() {
      const startBtn = document.getElementById("startBattleBtn");
      const allPlaced = this.playerGrid.every((a) => a !== null);
      startBtn.disabled = !allPlaced || this.gameActive;
    }

    async startBattle() {
      if (this.gameActive) return;
      const allPlaced = this.playerGrid.every((a) => a !== null);
      if (!allPlaced) return;

      this.gameActive = true;
      this.playerScore = 0;
      this.computerScore = 0;
      this.battleIndex = 0;
      this.computerRevealed = Array(8).fill(false);
      document.getElementById("playerScore").textContent = "0";
      document.getElementById("computerScore").textContent = "0";
      document.getElementById("startBattleBtn").disabled = true;
      this.updateUI();

      await this.battleLoop();
    }

    async battleLoop() {
      while (this.battleIndex < 8 && this.gameActive) {
        await this.battleOneColumn();
        this.battleIndex++;
        if (this.battleIndex < 8) await wait(2000);
      }
      if (this.battleIndex >= 8) {
        await this.endGame();
      }
    }

    async battleOneColumn() {
      const playerAnimal = this.playerGrid[this.battleIndex];
      const computerAnimal = this.computerGrid[this.battleIndex];

      this.computerRevealed[this.battleIndex] = true;
      this.updateUI();
      await wait(2000);

      const playerCell = document.querySelector(
        `#playerGrid .chess-cell:nth-child(${this.battleIndex + 1})`,
      );
      const computerCell = document.querySelector(
        `#computerGrid .chess-cell:nth-child(${this.battleIndex + 1})`,
      );
      const arena = document.getElementById("battleArena");
      const arenaComputerCard = document.getElementById("arenaComputerCard");
      const arenaPlayerCard = document.getElementById("arenaPlayerCard");
      const arenaContainer = document.querySelector(".arena-container");

      if (!playerCell || !computerCell) return;

      const playerRect = playerCell.getBoundingClientRect();
      const computerRect = computerCell.getBoundingClientRect();

      const playerClone = playerCell.cloneNode(true);
      const computerClone = computerCell.cloneNode(true);
      playerClone.style.position = "fixed";
      playerClone.style.left = playerRect.left + "px";
      playerClone.style.top = playerRect.top + "px";
      playerClone.style.width = playerRect.width + "px";
      playerClone.style.height = playerRect.height + "px";
      playerClone.style.zIndex = "15000";
      playerClone.style.transition = "all 0.8s ease-in-out";
      playerClone.style.margin = "0";

      computerClone.style.position = "fixed";
      computerClone.style.left = computerRect.left + "px";
      computerClone.style.top = computerRect.top + "px";
      computerClone.style.width = computerRect.width + "px";
      computerClone.style.height = computerRect.height + "px";
      computerClone.style.zIndex = "15000";
      computerClone.style.transition = "all 0.8s ease-in-out";
      computerClone.style.margin = "0";

      document.body.appendChild(playerClone);
      document.body.appendChild(computerClone);

      playerCell.style.opacity = "0";
      computerCell.style.opacity = "0";

      await wait(50);

      const arenaRect = arenaContainer.getBoundingClientRect();
      const targetPlayerLeft = arenaRect.left + 160;
      const targetPlayerTop = arenaRect.top + 65;
      const targetComputerLeft = arenaRect.left + 50;
      const targetComputerTop = arenaRect.top + 65;

      playerClone.style.left = targetPlayerLeft + "px";
      playerClone.style.top = targetPlayerTop + "px";
      playerClone.style.width = "100px";
      playerClone.style.height = "100px";

      computerClone.style.left = targetComputerLeft + "px";
      computerClone.style.top = targetComputerTop + "px";
      computerClone.style.width = "100px";
      computerClone.style.height = "100px";

      await wait(800);

      arena.style.display = "flex";
      arenaComputerCard.innerHTML = "";
      arenaPlayerCard.innerHTML = "";
      arenaComputerCard.appendChild(computerClone);
      arenaPlayerCard.appendChild(playerClone);
      computerClone.style.position = "relative";
      computerClone.style.left = "0";
      computerClone.style.top = "0";
      playerClone.style.position = "relative";
      playerClone.style.left = "0";
      playerClone.style.top = "0";

      await wait(2000);

      const winner = getWinner(playerAnimal, computerAnimal);
      const freshArenaRect = document
        .querySelector(".arena-container")
        .getBoundingClientRect();
      const arenaCenterX = (freshArenaRect.left + freshArenaRect.right) / 2;
      const arenaCenterY = (freshArenaRect.top + freshArenaRect.bottom) / 2;

      if (winner === 1) {
        const gainedScore = getAnimalScore(computerAnimal);
        this.playerScore += gainedScore;
        document.getElementById("playerScore").textContent = this.playerScore;
        showFloatScore(
          freshArenaRect.right - 80,
          freshArenaRect.top + 50,
          `+${gainedScore}`,
          true,
        );
        playSoundEffect("correct");
        const computerCardRect = computerClone.getBoundingClientRect();
        await new Promise((resolve) => {
          showExplosion(
            computerCardRect.left + 50,
            computerCardRect.top + 50,
            resolve,
          );
        });
        computerClone.remove();
        arenaComputerCard.innerHTML =
          '<div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; font-size:3rem;">💀</div>';
      } else if (winner === -1) {
        const gainedScore = getAnimalScore(playerAnimal);
        this.computerScore += gainedScore;
        document.getElementById("computerScore").textContent =
          this.computerScore;
        showFloatScore(
          freshArenaRect.left + 80,
          freshArenaRect.top + 50,
          `+${gainedScore}`,
          false,
        );
        playSoundEffect("wrong");
        const playerCardRect = playerClone.getBoundingClientRect();
        await new Promise((resolve) => {
          showExplosion(
            playerCardRect.left + 50,
            playerCardRect.top + 50,
            resolve,
          );
        });
        playerClone.remove();
        arenaPlayerCard.innerHTML =
          '<div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%; font-size:3rem;">💀</div>';
      } else {
        await new Promise((resolve) => {
          showHandshakeAt(arenaCenterX, arenaCenterY, resolve);
        });
      }

      await wait(2000);

      arena.style.display = "none";
      arenaComputerCard.innerHTML = "";
      arenaPlayerCard.innerHTML = "";

      playerCell.style.opacity = "1";
      computerCell.style.opacity = "1";
      if (playerClone.parentNode) playerClone.remove();
      if (computerClone.parentNode) computerClone.remove();

      await wait(2000);
    }

    async endGame() {
      this.gameActive = false;

      const badgesEarned = [];

      // 高分徽章（获胜且净胜分 ≥ 20）
      const scoreDiff = this.playerScore - this.computerScore;
      if (this.playerScore > this.computerScore && scoreDiff >= 20) {
        const newCount = addBadge(BADGE_KEYS.HIGH_SCORE);
        badgesEarned.push({
          iconSrc: "resources/modal20.jpeg",
          name: "净胜20分",
          count: newCount,
        });
      }

      // 五连胜徽章：只有赢了才增加连胜计数
      if (this.playerScore > this.computerScore) {
        // 赢了：连胜 +1
        const currentStreak = getCurrentWinStreak();
        const newStreak = currentStreak + 1;
        if (newStreak >= 5) {
          const newCount = addBadge(BADGE_KEYS.WIN_STREAK);
          badgesEarned.push({
            iconSrc: "resources/modal5.jpeg",
            name: "五连胜徽章",
            count: newCount,
          });
          setCurrentWinStreak(0);
        } else {
          setCurrentWinStreak(newStreak);
        }
      } else {
        // 输了或平局：连胜清零
        setCurrentWinStreak(0);
      }

      // 显示彩蛋
      for (const badge of badgesEarned) {
        await showBadgeEarned(badge.iconSrc, badge.name, badge.count);
      }

      updateBadgesDisplay();

      let resultText = "";
      let resultEmoji = "";
      if (this.playerScore > this.computerScore) {
        resultText = "Victory!";
        resultEmoji = "🏆";
        playSoundEffect("correct");
      } else if (this.playerScore < this.computerScore) {
        resultText = "Defeat...";
        resultEmoji = "😭";
        playSoundEffect("wrong");
      } else {
        resultText = "Draw!";
        resultEmoji = "🤝";
      }

      const overlay = document.createElement("div");
      overlay.className = "result-overlay";
      overlay.innerHTML = `
                <div class="result-card">
                    <h2>${resultEmoji} ${resultText} ${resultEmoji}</h2>
                    <div class="result-score">🐻‍❄️ Computer: ${this.computerScore}  |  👤 Player: ${this.playerScore}</div>
                    <button id="resultRestartBtn">🎮 Play Again</button>
                    <button id="resultHomeBtn">🏠 Home</button>
                </div>
            `;
      document.body.appendChild(overlay);

      document
        .getElementById("resultRestartBtn")
        ?.addEventListener("click", () => {
          overlay.remove();
          this.resetGame();
        });
      document
        .getElementById("resultHomeBtn")
        ?.addEventListener("click", () => {
          window.location.href = "index.html";
        });
    }

    resetGame() {
      if (this.battleTimeout) clearTimeout(this.battleTimeout);
      this.init();
    }
  }

  let game = null;
  let audioAllowed = false;

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

  function initAndStart() {
    wakeUpAudio();
    updateBadgesDisplay();
    document.getElementById("startOverlay").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    game = new BeastChess();

    document.getElementById("startBattleBtn").addEventListener("click", () => {
      if (game) game.startBattle();
    });
  }

  updateBadgesDisplay();
  document.getElementById("startBtn")?.addEventListener("click", initAndStart);
})();

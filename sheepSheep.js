(function () {
  const ANIMALS = [
    { id: "elephant", name: "Elephant" },
    { id: "lion", name: "Lion" },
    { id: "tiger", name: "Tiger" },
    { id: "leopard", name: "Leopard" },
    { id: "wolf", name: "Wolf" },
    { id: "dog", name: "Dog" },
    { id: "cat", name: "Cat" },
    { id: "rat", name: "Rat" },
  ];

  const INIT_SLOT_MAX = 6;
  const ELIMINATE_COUNT = 3;
  const STACK_COUNT = 6;
  const CARDS_PER_STACK = 4;
  const MAX_UNDO = 3;

  let gameState = {
    slots: [],
    stacks: [],
    gameActive: true,
    gameWin: false,
    slotMax: INIT_SLOT_MAX,
  };

  let undoCount = MAX_UNDO;
  let historyStack = [];

  let sharedAudioCtx = null;
  let audioAllowed = false;

  let successCount = 0;
  const SUCCESS_KEY = "sheepSheepSuccessCount";

  function loadSuccessCount() {
    const saved = localStorage.getItem(SUCCESS_KEY);
    if (saved && !isNaN(parseInt(saved))) {
      successCount = parseInt(saved);
    } else {
      successCount = 0;
    }
    updateSuccessDisplay();
  }

  function saveSuccessCount() {
    localStorage.setItem(SUCCESS_KEY, successCount);
    updateSuccessDisplay();
  }

  function incrementSuccessCount() {
    successCount++;
    saveSuccessCount();
  }

  function updateSuccessDisplay() {
    const el = document.getElementById("successCount");
    if (el) el.textContent = `🏆 成功: ${successCount}`;
  }

  function updateUndoButton() {
    const undoBtn = document.getElementById("undoBtn");
    if (undoBtn) {
      undoBtn.textContent = `↩️ 撤回 (${undoCount})`;
      undoBtn.disabled =
        undoCount <= 0 || !gameState.gameActive || gameState.gameWin;
    }
  }

  function pushHistory() {
    const stateCopy = {
      slots: [...gameState.slots],
      stacks: gameState.stacks.map((stack) => [...stack]),
      gameActive: gameState.gameActive,
      gameWin: gameState.gameWin,
      slotMax: gameState.slotMax,
    };
    historyStack.push(stateCopy);
    if (historyStack.length > 10) historyStack.shift();
  }

  function undo() {
    if (undoCount <= 0) return;
    if (!gameState.gameActive || gameState.gameWin) return;
    if (historyStack.length === 0) return;

    const lastState = historyStack.pop();
    gameState.slots = lastState.slots;
    gameState.stacks = lastState.stacks;
    gameState.gameActive = lastState.gameActive;
    gameState.gameWin = lastState.gameWin;
    gameState.slotMax = lastState.slotMax;

    undoCount--;
    updateUndoButton();

    updateSlotsUI();
    updateStacksUI();

    playSoundEffect("undo");
  }

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
      } else if (type === "undo") {
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.15);
        osc.type = "sine";
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function generateStacks() {
    const deck = [];
    ANIMALS.forEach((animal) => {
      for (let i = 0; i < 3; i++) deck.push(animal.id);
    });
    shuffleArray(deck);
    const stacks = [];
    let idx = 0;
    for (let s = 0; s < STACK_COUNT; s++) {
      const stack = [];
      for (let i = 0; i < CARDS_PER_STACK; i++) {
        if (idx < deck.length) stack.push(deck[idx++]);
      }
      stacks.push(stack);
    }
    return stacks;
  }

  function getImagePath(animalId) {
    return `images/${animalId}.jpeg`;
  }

  function createAnimalImage(animalId, className = "") {
    const img = document.createElement("img");
    img.src = getImagePath(animalId);
    img.alt = animalId;
    if (className) img.className = className;
    img.style.width = "75px";
    img.style.height = "75px";
    img.style.objectFit = "contain";
    return img;
  }

  function updateSlotsUI() {
    const container = document.getElementById("slotsContainer");
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < gameState.slotMax; i++) {
      const slot = document.createElement("div");
      slot.className = "slot";
      if (i < gameState.slots.length) {
        const img = createAnimalImage(gameState.slots[i]);
        slot.appendChild(img);
      } else {
        slot.classList.add("empty");
        if (i >= INIT_SLOT_MAX && !slot.dataset.animated) {
          slot.classList.add("new-slot");
          slot.dataset.animated = "true";
          setTimeout(() => slot.classList.remove("new-slot"), 300);
        }
      }
      container.appendChild(slot);
    }
  }

  function checkAndEliminate() {
    const counts = {};
    for (const id of gameState.slots) counts[id] = (counts[id] || 0) + 1;
    let eliminated = false;
    for (const [animalId, count] of Object.entries(counts)) {
      if (count >= ELIMINATE_COUNT) {
        let removed = 0;
        const newSlots = [];
        for (const slotAnimal of gameState.slots) {
          if (slotAnimal === animalId && removed < ELIMINATE_COUNT) {
            removed++;
          } else {
            newSlots.push(slotAnimal);
          }
        }
        gameState.slots = newSlots;
        eliminated = true;
        playSoundEffect("correct");
        break;
      }
    }
    if (eliminated) {
      updateSlotsUI();
      checkAndEliminate();
    }
  }

  function addToSlot(animalId) {
    if (!gameState.gameActive || gameState.gameWin) return false;
    if (gameState.slots.length >= gameState.slotMax) {
      gameState.gameActive = false;
      playSoundEffect("wrong");
      showGameResult(false);
      return false;
    }
    gameState.slots.push(animalId);
    updateSlotsUI();
    checkAndEliminate();
    if (gameState.slots.length >= gameState.slotMax && !gameState.gameWin) {
      gameState.gameActive = false;
      playSoundEffect("wrong");
      showGameResult(false);
      return false;
    }
    return true;
  }

  function onStackClick(stackIdx) {
    if (!gameState.gameActive || gameState.gameWin) return;
    const stack = gameState.stacks[stackIdx];
    if (!stack || stack.length === 0) return;
    const topId = stack[0];

    pushHistory();

    stack.shift();
    if (stack.length === 0) {
      gameState.slotMax++;
      updateSlotsUI();
    }
    updateStacksUI();

    addToSlot(topId);

    let remaining = 0;
    for (const s of gameState.stacks) remaining += s.length;
    if (remaining === 0 && gameState.gameActive && !gameState.gameWin) {
      gameState.gameActive = false;
      gameState.gameWin = true;
      playSoundEffect("correct");
      incrementSuccessCount();
      showGameResult(true);
      showFairyDance();
    }

    updateUndoButton();
  }

  function updateStacksUI() {
    const container = document.getElementById("stacksContainer");
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < gameState.stacks.length; i++) {
      const stack = gameState.stacks[i];
      const stackDiv = document.createElement("div");
      stackDiv.className = "card-stack";
      if (stack.length === 0) {
        stackDiv.classList.add("empty-stack");
      }
      stackDiv.dataset.stackIdx = i;
      for (let depth = 0; depth < stack.length; depth++) {
        const cardDiv = document.createElement("div");
        cardDiv.className = `stack-card depth-${depth}`;
        const img = createAnimalImage(stack[depth]);
        cardDiv.appendChild(img);
        stackDiv.appendChild(cardDiv);
      }
      container.appendChild(stackDiv);
    }
    let remaining = 0;
    for (const stack of gameState.stacks) remaining += stack.length;
    document.getElementById("remainingCount").innerText =
      `剩余牌数: ${remaining}`;
  }

  function bindEvents() {
    const container = document.getElementById("stacksContainer");
    if (!container) return;
    container.addEventListener("click", function (e) {
      let target = e.target.closest(".stack-card");
      if (!target) return;
      let stackDiv = target.closest(".card-stack");
      if (!stackDiv) return;
      let idx = stackDiv.dataset.stackIdx;
      if (idx !== undefined) onStackClick(parseInt(idx));
    });
  }

  function showFairyDance() {
    const fairy = document.createElement("div");
    fairy.className = "fairy-egg";
    fairy.innerHTML =
      "🎉✨🧚‍♀️ 恭喜通关！ 🧚‍♀️✨🎉<br><span style='font-size:1rem'>小仙女为你跳舞~</span>";
    document.body.appendChild(fairy);
    setTimeout(() => {
      if (fairy && fairy.remove) fairy.remove();
    }, 5000);
  }

  function resetGame() {
    gameState = {
      slots: [],
      stacks: generateStacks(),
      gameActive: true,
      gameWin: false,
      slotMax: INIT_SLOT_MAX,
    };
    undoCount = MAX_UNDO;
    historyStack = [];
    updateUndoButton();
    updateSlotsUI();
    updateStacksUI();
  }

  function showGameResult(isWin) {
    const existing = document.querySelector(".result-overlay");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.className = "result-overlay";
    if (isWin) {
      overlay.innerHTML = `
                <div class="result-card">
                    <h2>🎉 通关成功！ 🎉</h2>
                    <p>🐏 羊了个羊 · 动物版 🐏</p>
                    <p>🏆 累计成功: ${successCount} 次</p>
                    <button class="restart-game-btn">🎮 再来一局</button>
                    <button class="home-btn">🏠 返回主页</button>
                </div>
            `;
    } else {
      overlay.innerHTML = `
                <div class="result-card">
                    <h2>💔 游戏失败... 💔</h2>
                    <p>槽位满了，未能消除</p>
                    <button class="restart-game-btn">🎮 再来一局</button>
                    <button class="home-btn">🏠 返回主页</button>
                </div>
            `;
    }
    document.body.appendChild(overlay);

    overlay
      .querySelector(".restart-game-btn")
      ?.addEventListener("click", () => {
        overlay.remove();
        resetGame();
      });
    overlay.querySelector(".home-btn")?.addEventListener("click", () => {
      goHome();
    });
  }

  function initGame() {
    resetGame();
    bindEvents();
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
    } catch (e) {
      console.warn("Audio wakeup", e);
    }
  }

  function initAndStart() {
    wakeUpAudio();
    loadSuccessCount();
    document.getElementById("startOverlay").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    initGame();
  }

  document.getElementById("startBtn")?.addEventListener("click", initAndStart);
  document.getElementById("backMenuBtn")?.addEventListener("click", () => {
    goHome();
  });
  document.getElementById("undoBtn")?.addEventListener("click", () => undo());
})();

(function () {
  // ========== Canvas 设置 ==========
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const W = 780,
    H = 420;
  canvas.width = W;
  canvas.height = H;

  // ========== DOM ==========
  const targetDisplay = document.getElementById("targetDisplay");
  const stepsDisplay = document.getElementById("stepsDisplay");
  const jugASizeEl = document.getElementById("jugASize");
  const jugBSizeEl = document.getElementById("jugBSize");
  const messageEl = document.getElementById("message");
  const resetBtn = document.getElementById("resetBtn");
  const hintBtn = document.getElementById("hintBtn");
  const backBtn = document.getElementById("backBtn");
  const gameContainer = document.getElementById("gameContainer");
  const startOverlay = document.getElementById("startOverlay");
  const startBtn = document.getElementById("startBtn");

  // ========== 游戏状态 ==========
  let jugA = { max: 5, current: 0 };
  let jugB = { max: 3, current: 0 };
  let target = 4;
  let steps = 0;
  let gameActive = true;
  let isAnimating = false;
  let selectedSource = null; // 'river', 'jugA', 'jugB'
  let animData = null;

  // 音效
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
      if (type === "pour") {
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.12;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + 0.3,
        );
        noise.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();
        noise.stop(ctx.currentTime + 0.3);
        return;
      }
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
    } catch (e) {}
  }

  // ========== 工具 ==========
  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
      [a, b] = [b, a % b];
    }
    return a;
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function generatePuzzle() {
    let A, B, T;
    let attempts = 0;
    do {
      A = Math.floor(Math.random() * 9) + 2;
      B = Math.floor(Math.random() * 9) + 2;
      if (A === B) continue;

      const g = gcd(A, B);
      const maxAB = Math.max(A, B);
      const minTarget = 1;
      const maxTarget = Math.min(20, maxAB * 4);

      const multiples = [];
      for (let i = minTarget; i <= maxTarget; i++) {
        if (i % g === 0) multiples.push(i);
      }
      if (multiples.length === 0) continue;

      const shuffledMultiples = shuffleArray([...multiples]);

      let found = false;
      for (let candidate of shuffledMultiples) {
        if (candidate === A || candidate === B) continue;
        if (candidate === A + B) continue;
        if (candidate === Math.abs(A - B)) continue;
        if (candidate === 0) continue;
        T = candidate;
        found = true;
        break;
      }

      if (!found) continue;

      attempts++;
      if (attempts > 300) break;
    } while (
      T === undefined ||
      T === A ||
      T === B ||
      T === A + B ||
      T === Math.abs(A - B) ||
      T > 20
    );

    // 兜底方案
    if (T === undefined || attempts > 300) {
      A = 3;
      B = 5;
      T = 4;
    }

    return { A, B, T };
  }

  function resetGame() {
    jugA.current = 0;
    jugB.current = 0;
    steps = 0;
    selectedSource = null;
    isAnimating = false;
    animData = null;
    gameActive = true;
    updateUI();
    render();
    messageEl.textContent = "💡 点击水源（河流或桶），再点击目的（桶或大缸）";
  }

  function startNewGame() {
    const puzzle = generatePuzzle();
    jugA.max = puzzle.A;
    jugB.max = puzzle.B;
    target = puzzle.T;
    window._tankTotal = 0; // 先重置大缸水量
    resetGame(); // 重置桶和界面
    jugASizeEl.textContent = jugA.max;
    jugBSizeEl.textContent = jugB.max;
    targetDisplay.textContent = target;
    messageEl.textContent = `🎯 用 ${jugA.max}L 和 ${jugB.max}L 的桶量出 ${target}L！`;
  }

  function updateUI() {
    stepsDisplay.textContent = steps;
    jugASizeEl.textContent = jugA.max;
    jugBSizeEl.textContent = jugB.max;
    targetDisplay.textContent = target;
  }

  // ========== 倒水逻辑 ==========
  function pourWater(source, targetJug) {
    if (isAnimating || !gameActive) return false;

    let sourceObj, targetObj;
    let srcName = source,
      tgtName = targetJug;

    // 处理桶→河流（倒空）
    if (targetJug === "river") {
      if (source === "river") {
        messageEl.textContent = "⚠️ 不能从河流倒回河流！";
        return false;
      }
      if (source === "jugA") {
        if (jugA.current === 0) {
          messageEl.textContent = "⚠️ 桶A已经是空的！";
          return false;
        }
        const amount = jugA.current;
        jugA.current = 0;
        steps++;
        playSoundEffect("pour");
        updateUI();
        render();
        messageEl.textContent = `✅ 倒掉桶A中的 ${amount}L 水`;
        return true;
      } else if (source === "jugB") {
        if (jugB.current === 0) {
          messageEl.textContent = "⚠️ 桶B已经是空的！";
          return false;
        }
        const amount = jugB.current;
        jugB.current = 0;
        steps++;
        playSoundEffect("pour");
        updateUI();
        render();
        messageEl.textContent = `✅ 倒掉桶B中的 ${amount}L 水`;
        return true;
      }
      return false;
    }

    if (source === "river") {
      sourceObj = { current: Infinity, max: Infinity };
    } else if (source === "jugA") {
      sourceObj = jugA;
    } else if (source === "jugB") {
      sourceObj = jugB;
    } else {
      return false;
    }

    if (targetJug === "jugA") {
      targetObj = jugA;
    } else if (targetJug === "jugB") {
      targetObj = jugB;
    } else if (targetJug === "tank") {
      if (sourceObj.current === 0 || sourceObj.current === Infinity) {
        messageEl.textContent = "⚠️ 水源是空的！";
        return false;
      }
      const amount = sourceObj.current;
      sourceObj.current = 0;
      steps++;
      playSoundEffect("pour");
      updateUI();
      window._tankTotal = (window._tankTotal || 0) + amount;
      render();
      if (window._tankTotal >= target) {
        gameActive = false;
        playSoundEffect("correct");
        setTimeout(showVictory, 400);
      } else {
        messageEl.textContent = `✅ 倒入大缸 ${amount}L，还需 ${target - window._tankTotal}L`;
      }
      return true;
    } else {
      return false;
    }

    if (sourceObj.current === 0) {
      messageEl.textContent = "⚠️ 水源是空的！";
      return false;
    }
    if (targetObj.current === targetObj.max) {
      messageEl.textContent = "⚠️ 目的桶已满！";
      return false;
    }

    const space = targetObj.max - targetObj.current;
    const amount = Math.min(sourceObj.current, space);
    if (amount === 0) return false;

    startPourAnimation(srcName, tgtName, amount);
    return true;
  }

  // ========== 倒水动画 ==========
  function startPourAnimation(source, target, amount) {
    isAnimating = true;
    playSoundEffect("pour");

    let sourceObj = source === "river" ? null : source === "jugA" ? jugA : jugB;
    let targetObj = target === "jugA" ? jugA : target === "jugB" ? jugB : null;
    const sourceStart = sourceObj ? sourceObj.current : Infinity;
    const targetStart = targetObj ? targetObj.current : 0;

    const duration = Math.max(350, amount * 200);
    const startTime = performance.now();

    const particles = [];
    const count = Math.min(15, Math.floor(amount * 3) + 3);
    for (let i = 0; i < count; i++) {
      particles.push({
        progress: i / count,
        offsetX: (Math.random() - 0.5) * 20,
        offsetY: (Math.random() - 0.5) * 8,
      });
    }

    const jugAX = 230,
      jugAY = 370;
    const jugBX = 430,
      jugBY = 370;
    const jugW = 80;
    const riverX = 30,
      riverY = 60,
      riverW = 80,
      riverH = 280;
    const tankX = 660,
      tankY = 40,
      tankW = 80,
      tankH = 300;

    function getJugHeight(max) {
      const baseH = 80;
      const maxH = 220;
      return Math.max(baseH, Math.min(maxH, baseH + (max - 2) * 18));
    }

    let srcX, srcY, tgtX, tgtY;
    if (source === "river") {
      srcX = riverX + riverW / 2;
      srcY = riverY + riverH / 2;
    } else if (source === "jugA") {
      const h = getJugHeight(jugA.max);
      srcX = jugAX + jugW / 2;
      srcY = jugAY - h * 0.15;
    } else {
      const h = getJugHeight(jugB.max);
      srcX = jugBX + jugW / 2;
      srcY = jugBY - h * 0.15;
    }
    if (target === "jugA") {
      const h = getJugHeight(jugA.max);
      tgtX = jugAX + jugW / 2;
      tgtY = jugAY - h * 0.15;
    } else if (target === "jugB") {
      const h = getJugHeight(jugB.max);
      tgtX = jugBX + jugW / 2;
      tgtY = jugBY - h * 0.15;
    } else {
      tgtX = tankX + tankW / 2;
      tgtY = tankY + tankH * 0.15;
    }

    animData = {
      source,
      target,
      sourceObj,
      targetObj,
      sourceStart,
      targetStart,
      amount,
      duration,
      startTime,
      particles,
      srcX,
      srcY,
      tgtX,
      tgtY,
      isRiverSource: source === "river",
    };

    animatePour();
  }

  function animatePour() {
    if (!animData) return;
    const now = performance.now();
    const elapsed = now - animData.startTime;
    const progress = Math.min(1, elapsed / animData.duration);

    if (animData.sourceObj) {
      animData.sourceObj.current =
        animData.sourceStart - animData.amount * progress;
      if (animData.sourceObj.current < 0) animData.sourceObj.current = 0;
    }
    if (animData.targetObj) {
      animData.targetObj.current =
        animData.targetStart + animData.amount * progress;
      if (animData.targetObj.current > animData.targetObj.max)
        animData.targetObj.current = animData.targetObj.max;
    }

    renderWithPour(progress);

    if (progress < 1) {
      requestAnimationFrame(animatePour);
    } else {
      if (animData.sourceObj)
        animData.sourceObj.current = animData.sourceStart - animData.amount;
      if (animData.targetObj)
        animData.targetObj.current = animData.targetStart + animData.amount;
      const wasTankPour = animData.target === "tank";
      const tankAmount = wasTankPour ? animData.amount : 0;
      animData = null;
      isAnimating = false;
      steps++;
      updateUI();

      if (wasTankPour) {
        window._tankTotal = (window._tankTotal || 0) + tankAmount;
        if (window._tankTotal >= target) {
          gameActive = false;
          playSoundEffect("correct");
          setTimeout(showVictory, 300);
          render();
          return;
        }
        messageEl.textContent = `✅ 已倒入大缸 ${window._tankTotal}L，还需 ${target - window._tankTotal}L`;
      } else {
        messageEl.textContent = `✅ 已倒水 ${tankAmount || animData?.amount || 0}L`;
      }
      render();
    }
  }

  // ========== 渲染 ==========
  function render() {
    renderWithPour(-1);
  }

  function getJugHeight(max) {
    const baseH = 80;
    const maxH = 220;
    return Math.max(baseH, Math.min(maxH, baseH + (max - 2) * 18));
  }

  function renderWithPour(flowProgress) {
    ctx.clearRect(0, 0, W, H);

    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "#87CEEB");
    grad.addColorStop(1, "#E0F6FF");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "#6B8E23";
    ctx.fillRect(0, H - 20, W, 20);

    // 河流（左侧）
    const riverX = 30,
      riverY = 60,
      riverW = 80,
      riverH = 280;
    ctx.fillStyle = "#2196F3";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(33,150,243,0.3)";
    ctx.fillRect(riverX, riverY, riverW, riverH);
    ctx.shadowBlur = 0;
    for (let i = 0; i < 6; i++) {
      const wx = riverX + 10 + i * 12;
      const wy = riverY + 25 + i * 40;
      ctx.beginPath();
      ctx.ellipse(wx, wy, 10, 4, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fill();
    }
    ctx.fillStyle = "#fff";
    ctx.font = "bold 15px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🏞️ 河流", riverX + riverW / 2, riverY + riverH + 30);

    // 大缸（右侧）
    const tankX = 660,
      tankY = 40,
      tankW = 80,
      tankH = 300;
    ctx.fillStyle = "#8B7355";
    ctx.fillRect(tankX - 4, tankY - 4, tankW + 8, tankH + 8);
    ctx.fillStyle = "#D2B48C";
    ctx.fillRect(tankX, tankY, tankW, tankH);
    const tankWaterH = Math.min(
      tankH,
      ((window._tankTotal || 0) / target) * tankH * 0.8,
    );
    ctx.fillStyle = "rgba(33,150,243,0.4)";
    ctx.fillRect(tankX + 5, tankY + tankH - tankWaterH, tankW - 10, tankWaterH);
    ctx.fillStyle = "#fff";
    ctx.font = "bold 15px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🏺 大缸", tankX + tankW / 2, tankY + tankH + 30);
    ctx.font = "13px Arial";
    ctx.fillText(`目标 ${target}L`, tankX + tankW / 2, tankY + tankH + 50);
    // 新增：显示已收集水量
    ctx.font = "bold 14px Arial";
    ctx.fillStyle = "#4fc3f7";
    ctx.fillText(
      `已收集: ${window._tankTotal || 0}L`,
      tankX + tankW / 2,
      tankY + tankH + 75,
    );

    // 桶A
    const jugAX = 230,
      jugAY = 370;
    const jugAW = 80;
    const jugAH_A = getJugHeight(jugA.max);
    drawJug(
      ctx,
      jugAX,
      jugAY,
      jugAW,
      jugAH_A,
      jugA,
      "A",
      selectedSource === "jugA",
    );

    // 桶B
    const jugBX = 430,
      jugBY = 370;
    const jugBW = 80;
    const jugAH_B = getJugHeight(jugB.max);
    drawJug(
      ctx,
      jugBX,
      jugBY,
      jugBW,
      jugAH_B,
      jugB,
      "B",
      selectedSource === "jugB",
    );

    // 选中河流高亮
    if (selectedSource === "river") {
      ctx.fillStyle = "rgba(255,215,0,0.15)";
      ctx.fillRect(riverX, riverY, riverW, riverH);
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 3;
      ctx.strokeRect(riverX, riverY, riverW, riverH);
      ctx.fillStyle = "#FFD700";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText("⬆️ 水源 (点击桶取水)", riverX + riverW / 2, riverY - 15);
    }

    // 水流粒子
    if (flowProgress >= 0 && flowProgress <= 1 && animData) {
      const srcX = animData.srcX;
      const srcY = animData.srcY;
      const tgtX = animData.tgtX;
      const tgtY = animData.tgtY;
      for (const p of animData.particles) {
        const prog = Math.min(1, p.progress + flowProgress * 0.4);
        const x = srcX + (tgtX - srcX) * prog + p.offsetX * (1 - prog);
        const y =
          srcY + (tgtY - srcY) * prog + p.offsetY * (1 - prog) - prog * 25;
        ctx.beginPath();
        ctx.arc(
          x,
          y,
          (3 + Math.random() * 4) * (1 - prog * 0.3),
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = `rgba(33,150,243,${0.8 * (1 - prog * 0.4)})`;
        ctx.fill();
      }
    }

    if (selectedSource && !isAnimating) {
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(W / 2 - 110, 5, 220, 25);
      ctx.fillStyle = "#FFD700";
      ctx.font = "14px Arial";
      ctx.textAlign = "center";
      ctx.fillText("👉 点击目的（桶、大缸或河流）", W / 2, 24);
    }

    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.roundRect(W - 165, 8, 155, 28, 12);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText("🟡 黄色 = 选中水源", W - 160, 27);
  }

  function drawJug(ctx, x, y, w, h, jug, label, isSelected) {
    const bottomY = y;
    const topY = bottomY - h;

    ctx.shadowBlur = isSelected ? 20 : 5;
    ctx.shadowColor = isSelected ? "#FFD700" : "rgba(0,0,0,0.15)";

    let fillColor = "#D2B48C";
    if (isSelected) fillColor = "#FFD700";

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = "#8B7355";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const topW = w * 0.75;
    const topOffset = (w - topW) / 2;
    ctx.moveTo(x + topOffset, topY);
    ctx.lineTo(x + w - topOffset, topY);
    ctx.quadraticCurveTo(x + w, topY, x + w, topY + 5);
    ctx.lineTo(x + w, bottomY - 5);
    ctx.quadraticCurveTo(x + w, bottomY, x + w - 5, bottomY);
    ctx.lineTo(x + 5, bottomY);
    ctx.quadraticCurveTo(x, bottomY, x, bottomY - 5);
    ctx.lineTo(x, topY + 5);
    ctx.quadraticCurveTo(x, topY, x + topOffset, topY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = "#8B7355";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + w / 2, topY + 12, 14, Math.PI, 0, false);
    ctx.stroke();

    const waterH = (jug.current / jug.max) * (h - 20);
    if (waterH > 2) {
      ctx.fillStyle = "rgba(33,150,243,0.6)";
      ctx.shadowBlur = 0;
      const waterTop = bottomY - 10 - waterH;
      ctx.fillRect(x + 10, waterTop, w - 20, waterH);
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(x + 12, waterTop, w - 24, 4);
    }

    ctx.shadowBlur = 0;
    ctx.fillStyle = "#333";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(`${jug.current}/${jug.max}L`, x + w / 2, bottomY + 22);

    ctx.fillStyle = "#333";
    ctx.font = "bold 18px Arial";
    ctx.fillText(`🪣 ${label}`, x + w / 2, topY - 12);

    if (isSelected) {
      ctx.fillStyle = "#FFD700";
      ctx.font = "14px Arial";
      ctx.fillText("⬆️ 水源", x + w / 2, bottomY + 48);
    }

    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(x + w + 4, topY + 8, 3, h - 16);
    for (let i = 0; i <= jug.max; i++) {
      const pos = bottomY - 8 - (h - 16) * (i / jug.max);
      ctx.fillRect(x + w + 4, pos, 7, 2);
    }
  }

  // ========== 胜利 ==========
  function showVictory() {
    const overlay = document.createElement("div");
    overlay.className = "result-overlay";
    overlay.innerHTML = `
            <div class="result-card">
                <h2>🎉 成功！ 🎉</h2>
                <p style="font-size:1.2rem;">用 ${steps} 步量出了 ${target}L</p>
                <button id="nextLevelBtn">🎮 下一关</button>
                <button id="homeBtn">🏠 返回主页</button>
            </div>
        `;
    document.body.appendChild(overlay);

    document.getElementById("nextLevelBtn")?.addEventListener("click", () => {
      overlay.remove();
      startNewGame();
    });
    document.getElementById("homeBtn")?.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // ========== 提示 ==========
  function showHint() {
    if (isAnimating) return;
    if (jugA.current === 0 && jugB.current === 0) {
      messageEl.textContent = "💡 先点击河流，再点击一个空桶装满水！";
      return;
    }
    if ((window._tankTotal || 0) + jugA.current + jugB.current >= target) {
      messageEl.textContent = `💡 桶里的水加起来够了，倒入大缸吧！`;
      return;
    }
    if (jugA.current === jugA.max && jugB.current === 0) {
      messageEl.textContent = `💡 尝试将桶A的水倒入桶B或大缸，或倒回河流`;
      return;
    }
    if (jugA.current === 0 && jugB.current === jugB.max) {
      messageEl.textContent = `💡 尝试将桶B的水倒入桶A或大缸，或倒回河流`;
      return;
    }
    messageEl.textContent = "💡 试试把水从一个桶倒到另一个桶，或倒回河流清空";
  }

  // ========== 点击处理 ==========
  function handleClick(e) {
    if (isAnimating || !gameActive) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const riverX = 30,
      riverY = 60,
      riverW = 80,
      riverH = 280;
    const jugAX = 230,
      jugAY = 370,
      jugAW = 80;
    const jugAH_A = getJugHeight(jugA.max);
    const jugBX = 430,
      jugBY = 370,
      jugBW = 80;
    const jugAH_B = getJugHeight(jugB.max);
    const tankX = 660,
      tankY = 40,
      tankW = 80,
      tankH = 300;

    let clicked = null;
    if (
      x >= riverX &&
      x <= riverX + riverW &&
      y >= riverY &&
      y <= riverY + riverH
    )
      clicked = "river";
    else if (
      x >= jugAX &&
      x <= jugAX + jugAW &&
      y >= jugAY - jugAH_A &&
      y <= jugAY
    )
      clicked = "jugA";
    else if (
      x >= jugBX &&
      x <= jugBX + jugBW &&
      y >= jugBY - jugAH_B &&
      y <= jugBY
    )
      clicked = "jugB";
    else if (
      x >= tankX &&
      x <= tankX + tankW &&
      y >= tankY &&
      y <= tankY + tankH
    )
      clicked = "tank";
    else {
      selectedSource = null;
      render();
      messageEl.textContent = "💡 已取消选择";
      return;
    }

    // 大缸只能作为目的
    if (clicked === "tank") {
      if (selectedSource) {
        if (selectedSource === "river") {
          messageEl.textContent = "⚠️ 不能从河流直接倒入大缸！";
          return;
        }
        const success = pourWater(selectedSource, "tank");
        if (success) {
          selectedSource = null;
        }
      } else {
        messageEl.textContent = "💡 请先点击水源（河流或桶）";
      }
      return;
    }

    // 点击河流
    if (clicked === "river") {
      if (selectedSource === "river") {
        selectedSource = null;
        render();
        messageEl.textContent = "💡 已取消选择";
        return;
      }
      if (selectedSource === "jugA" || selectedSource === "jugB") {
        // 把桶里的水倒回河流
        const jug = selectedSource === "jugA" ? jugA : jugB;
        const label = selectedSource === "jugA" ? "A" : "B";
        if (jug.current === 0) {
          messageEl.textContent = `⚠️ 桶${label}已经是空的！`;
          return;
        }
        const amount = jug.current;
        jug.current = 0;
        steps++;
        playSoundEffect("pour");
        updateUI();
        render();
        messageEl.textContent = `✅ 桶${label}已倒空 (${amount}L 水倒回河流)`;
        selectedSource = null;
        return;
      }
      // 选中河流作为水源
      selectedSource = "river";
      render();
      messageEl.textContent = "💡 河流已选中，点击一个空桶装满水！";
      return;
    }

    // 点击桶
    if (clicked === "jugA" || clicked === "jugB") {
      const jug = clicked === "jugA" ? jugA : jugB;
      const label = clicked === "jugA" ? "A" : "B";

      if (selectedSource === clicked) {
        selectedSource = null;
        render();
        messageEl.textContent = "💡 已取消选择";
        return;
      }

      if (selectedSource === "river") {
        if (jug.current === jug.max) {
          messageEl.textContent = `⚠️ 桶${label}已满！`;
          return;
        }
        jug.current = jug.max;
        steps++;
        playSoundEffect("pour");
        updateUI();
        render();
        messageEl.textContent = `✅ 桶${label}已装满 (${jug.max}L)`;
        selectedSource = null;
        return;
      }

      if (selectedSource === "jugA" || selectedSource === "jugB") {
        const success = pourWater(selectedSource, clicked);
        if (success) selectedSource = null;
        return;
      }

      selectedSource = clicked;
      render();
      messageEl.textContent = `💡 桶${label}已选中（${jug.current}L），点击目的（桶、大缸或河流）`;
      return;
    }

    selectedSource = null;
    render();
  }

  // ========== 事件绑定 ==========
  function bindEvents() {
    canvas.addEventListener("click", handleClick);
    canvas.addEventListener("touchstart", (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const mouseEvent = new MouseEvent("click", {
        clientX: touch.clientX,
        clientY: touch.clientY,
      });
      canvas.dispatchEvent(mouseEvent);
    });

    resetBtn.addEventListener("click", () => {
      window._tankTotal = 0;
      resetGame();
    });

    hintBtn.addEventListener("click", showHint);
    backBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });

    window.addEventListener("resize", () => {
      render();
    });

    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (r > w / 2) r = w / 2;
        if (r > h / 2) r = h / 2;
        this.moveTo(x + r, y);
        this.lineTo(x + w - r, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r);
        this.lineTo(x + w, y + h - r);
        this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.lineTo(x + r, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r);
        this.lineTo(x, y + r);
        this.quadraticCurveTo(x, y, x + r, y);
        return this;
      };
    }
  }

  function initAndStart() {
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

    startOverlay.style.display = "none";
    gameContainer.style.display = "block";
    window._tankTotal = 0;
    startNewGame();
    bindEvents();
  }

  startBtn?.addEventListener("click", initAndStart);
})();

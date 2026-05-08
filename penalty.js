// ========= 游戏状态 =========
let gameState = {
    playerScore: 0,
    opponentScore: 0,
    round: 0,
    totalRounds: 5,
    isPlayerTurn: true,
    isShooting: false,
    currentWords: [],
    currentImages: [],
    cursorInterval: null,
    selectedBox: null,
    ballMoving: false,
    gameOver: false
};

// ========= DOM 元素 =========
const playerScoreEl = document.getElementById('playerScore');
const opponentScoreEl = document.getElementById('opponentScore');
const roundCountEl = document.getElementById('roundCount');
const roundInfoEl = document.getElementById('roundInfo');
const opponentGoal = document.getElementById('opponentGoal');
const playerGoal = document.getElementById('playerGoal');
const ball = document.getElementById('ball');
const backBtn = document.getElementById('backBtn');

// ========= 工具函数 =========
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateScoreDisplay() {
    playerScoreEl.textContent = gameState.playerScore;
    opponentScoreEl.textContent = gameState.opponentScore;
    roundCountEl.textContent = gameState.round + 1;
}

// ========= 核心游戏逻辑 =========
function initPenaltyGame() {
    gameState.playerScore = 0;
    gameState.opponentScore = 0;
    gameState.round = 0;
    gameState.isPlayerTurn = true;
    gameState.isShooting = false;
    gameState.gameOver = false;
    updateScoreDisplay();
    startRound();
}

function startRound() {
    if (gameState.gameOver) return;
    if (gameState.round >= gameState.totalRounds && gameState.playerScore !== gameState.opponentScore) {
        gameState.gameOver = true;
        showGameComplete();
        return;
    }
    if (gameState.round >= gameState.totalRounds && gameState.playerScore === gameState.opponentScore) {
        // continue until tie broken
    }

    // Pick 3 random words
    const wordList = window.wordList;
    const shuffledAll = shuffleArray([...wordList]);
    const selected = shuffledAll.slice(0, 3);
    gameState.currentWords = selected.map(w => w.word);
    gameState.currentImages = selected.map(w => w.image);

    // Render goals
    renderGoals();

    // Flip field based on turn
    const field = document.getElementById('penaltyField');
    if (gameState.isPlayerTurn) {
        field.classList.remove('flipped');
    } else {
        field.classList.add('flipped');
    }

    // Start turn
    if (gameState.isPlayerTurn) {
        roundInfoEl.textContent = `Round ${gameState.round + 1} – Player shoots`;
        startPlayerShoot();
    } else {
        roundInfoEl.textContent = `Round ${gameState.round + 1} – Opponent shoots`;
        startOpponentShoot();
    }
}

function renderGoals() {
    opponentGoal.innerHTML = '';
    playerGoal.innerHTML = '';

    gameState.currentWords.forEach((word, idx) => {
        const box = document.createElement('div');
        box.className = 'penalty-word-box';
        box.textContent = word;
        box.dataset.index = idx;
        opponentGoal.appendChild(box);
    });

    gameState.currentImages.forEach((imgSrc, idx) => {
        const box = document.createElement('div');
        box.className = 'penalty-image-box';
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = gameState.currentWords[idx];
        box.appendChild(img);
        box.dataset.index = idx;
        playerGoal.appendChild(box);
    });
}

function startPlayerShoot() {
    gameState.isShooting = true;
    const boxes = opponentGoal.querySelectorAll('.penalty-word-box');
    let currentIdx = 0;
    boxes.forEach(b => b.classList.remove('active'));
    boxes[currentIdx].classList.add('active');

    gameState.cursorInterval = setInterval(() => {
        boxes.forEach(b => b.classList.remove('active'));
        currentIdx = (currentIdx + 1) % boxes.length;
        boxes[currentIdx].classList.add('active');
    }, 300);

    // Wait for player click on image box
    const imageBoxes = playerGoal.querySelectorAll('.penalty-image-box');
    imageBoxes.forEach(box => {
        box.addEventListener('click', function handler() {
            if (!gameState.isShooting) return;
            clearInterval(gameState.cursorInterval);
            gameState.isShooting = false;
            // Determine which word box was active
            const activeWordBox = opponentGoal.querySelector('.penalty-word-box.active');
            const activeIdx = parseInt(activeWordBox.dataset.index);
            const clickedIdx = parseInt(this.dataset.index);
            // Remove other boxes
            opponentGoal.querySelectorAll('.penalty-word-box').forEach(b => {
                if (b !== activeWordBox) b.style.display = 'none';
            });
            playerGoal.querySelectorAll('.penalty-image-box').forEach(b => {
                if (b !== this) b.style.display = 'none';
            });
            // Animate ball
            animateBall(this, activeWordBox, () => {
                const isGoal = clickedIdx !== activeIdx;
                if (isGoal) {
                    gameState.playerScore++;
                    playSoundEffect('correct');
                } else {
                    playSoundEffect('wrong');
                }
                updateScoreDisplay();
                // Remove listeners
                imageBoxes.forEach(b => b.removeEventListener('click', handler));
                // Next turn
                gameState.isPlayerTurn = false;
                gameState.round++;
                setTimeout(() => startRound(), 1500);
            });
        });
    });
}

function startOpponentShoot() {
    gameState.isShooting = true;
    const boxes = playerGoal.querySelectorAll('.penalty-image-box');
    let currentIdx = 0;
    boxes.forEach(b => b.classList.remove('active'));
    boxes[currentIdx].classList.add('active');

    gameState.cursorInterval = setInterval(() => {
        boxes.forEach(b => b.classList.remove('active'));
        currentIdx = (currentIdx + 1) % boxes.length;
        boxes[currentIdx].classList.add('active');
    }, 300);

    // Wait for player click on word box
    const wordBoxes = opponentGoal.querySelectorAll('.penalty-word-box');
    wordBoxes.forEach(box => {
        box.addEventListener('click', function handler() {
            if (!gameState.isShooting) return;
            clearInterval(gameState.cursorInterval);
            gameState.isShooting = false;
            const activeImageBox = playerGoal.querySelector('.penalty-image-box.active');
            const activeIdx = parseInt(activeImageBox.dataset.index);
            const clickedIdx = parseInt(this.dataset.index);
            // Remove other boxes
            playerGoal.querySelectorAll('.penalty-image-box').forEach(b => {
                if (b !== activeImageBox) b.style.display = 'none';
            });
            opponentGoal.querySelectorAll('.penalty-word-box').forEach(b => {
                if (b !== this) b.style.display = 'none';
            });
            // Animate ball from opponent side to player side
            animateBall(activeImageBox, this, () => {
                const isGoal = clickedIdx !== activeIdx;
                if (isGoal) {
                    gameState.opponentScore++;
                    playSoundEffect('correct');
                } else {
                    playSoundEffect('wrong');
                }
                updateScoreDisplay();
                wordBoxes.forEach(b => b.removeEventListener('click', handler));
                gameState.isPlayerTurn = true;
                gameState.round++;
                setTimeout(() => startRound(), 1500);
            });
        });
    });
}

function animateBall(fromEl, toEl, callback) {
    const field = document.getElementById('penaltyField');
    const fieldRect = field.getBoundingClientRect();
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const startX = fromRect.left - fieldRect.left + fromRect.width / 2 - 15;
    const startY = fromRect.top - fieldRect.top + fromRect.height / 2 - 15;
    const endX = toRect.left - fieldRect.left + toRect.width / 2 - 15;
    const endY = toRect.top - fieldRect.top + toRect.height / 2 - 15;

    ball.style.display = 'block';
    ball.style.left = startX + 'px';
    ball.style.top = startY + 'px';

    const duration = 800;
    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const x = startX + (endX - startX) * progress;
        const y = startY + (endY - startY) * progress;
        ball.style.left = x + 'px';
        ball.style.top = y + 'px';
        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            ball.style.display = 'none';
            if (callback) callback();
        }
    }
    requestAnimationFrame(step);
}

function showGameComplete() {
    roundInfoEl.textContent = 'Game Over!';
    opponentGoal.innerHTML = '';
    playerGoal.innerHTML = '';
    const winner = gameState.playerScore > gameState.opponentScore ? 'Player' : 'Opponent';
    const completeDiv = document.createElement('div');
    completeDiv.className = 'game-complete';
    completeDiv.innerHTML = `
        <h2><i class="fas fa-trophy"></i> ${winner} Wins!</h2>
        <div class="final-score">
            <span class="correct">Player: ${gameState.playerScore}</span> |
            <span class="wrong">Opponent: ${gameState.opponentScore}</span>
        </div>
        <button id="playAgainBtn" class="repeat-btn"><i class="fas fa-redo"></i> Play Again</button>
        <button id="backToMenuBtn" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Menu</button>
    `;
    document.getElementById('penaltyField').appendChild(completeDiv);
    document.getElementById('playAgainBtn')?.addEventListener('click', () => {
        document.getElementById('penaltyField').querySelector('.game-complete')?.remove();
        initPenaltyGame();
    });
    document.getElementById('backToMenuBtn')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    showConfetti();
}

// ========= 音效 =========
function playSoundEffect(type) {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        if (type === 'correct') {
            osc.frequency.setValueAtTime(523.25, ctx.currentTime);
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
            osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } else {
            osc.frequency.setValueAtTime(400, ctx.currentTime);
            osc.frequency.setValueAtTime(300, ctx.currentTime + 0.2);
            osc.type = 'sawtooth';
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
            osc.start();
            osc.stop(ctx.currentTime + 0.4);
        }
    } catch (e) {}
}

function showConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0'];
    for (let i = 0; i < 80; i++) {
        const conf = document.createElement('div');
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
        const anim = conf.animate([
            { transform: 'translateY(0)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], { duration: 1500 + Math.random() * 1500 });
        anim.onfinish = () => conf.remove();
    }
}

// ========= 事件绑定 =========
backBtn?.addEventListener('click', () => window.location.href = 'index.html');

// ========= 启动 =========
window.addEventListener('load', () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
    initPenaltyGame();
});

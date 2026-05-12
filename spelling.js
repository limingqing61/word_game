// ========= 游戏状态 =========
let gameState = {
    correctCount: 0,
    wrongCount: 0,
    currentQuestionIndex: 0,
    questionOrder: [],
    isAnswered: false,
    totalQuestions: 25,
    wrongWords: []
};

let streakCount = 0;
let totalScore = 0;

// ========= DOM 元素 =========
const correctCountEl = document.getElementById('correctCount');
const wrongCountEl = document.getElementById('wrongCount');
const totalScoreEl = document.getElementById('totalScore');
const progressCountEl = document.getElementById('progressCount');
const progressFillEl = document.getElementById('progressFill');
const roundInfoEl = document.getElementById('roundInfo');
const spellingContainer = document.getElementById('spellingContainer');
const backBtn = document.getElementById('backBtn');

// ========= 工具函数 =========
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function hasVowels(word) {
    const vowels = new Set(['a','e','i','o','u']);
    for (let ch of word.toLowerCase()) {
        if (vowels.has(ch)) return true;
    }
    return false;
}

function updateScoreDisplay() {
    correctCountEl.textContent = gameState.correctCount;
    wrongCountEl.textContent = gameState.wrongCount;
    totalScoreEl.textContent = totalScore;
    progressCountEl.textContent = `${gameState.currentQuestionIndex}/${gameState.totalQuestions}`;
    const percent = (gameState.currentQuestionIndex / gameState.totalQuestions) * 100;
    progressFillEl.style.width = `${percent}%`;
}

// ========= 核心游戏逻辑 =========
function initSpellingGame() {
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.currentQuestionIndex = 0;
    gameState.isAnswered = false;
    gameState.wrongWords = [];
    totalScore = 0;
    streakCount = 0;

    const wordList = window.wordList;
    const allIndices = [...Array(wordList.length).keys()];
    // Filter out words that have no vowels (e.g., sky, fry, cry)
    const vowelIndices = allIndices.filter(i => hasVowels(wordList[i].word));
    const shuffledAll = shuffleArray(vowelIndices);
    gameState.questionOrder = shuffledAll.slice(0, Math.min(25, vowelIndices.length));
    gameState.totalQuestions = gameState.questionOrder.length;

    updateScoreDisplay();
    showQuestion();
}

function showQuestion() {
    if (gameState.currentQuestionIndex >= gameState.totalQuestions) {
        showGameComplete();
        return;
    }

    gameState.isAnswered = false;

    const wordIndex = gameState.questionOrder[gameState.currentQuestionIndex];
    const wordList = window.wordList;
    const correctWord = wordList[wordIndex];

    roundInfoEl.textContent = `Question ${gameState.currentQuestionIndex + 1}: Spell the word`;

    spellingContainer.innerHTML = '';

    const questionDiv = document.createElement('div');
    questionDiv.className = 'spelling-question';

    // Image
    const img = document.createElement('img');
    img.src = correctWord.image;
    img.alt = correctWord.word;
    img.onerror = () => { img.style.display = 'none'; };
    questionDiv.appendChild(img);

    // Chinese
    const chineseDiv = document.createElement('div');
    chineseDiv.className = 'spelling-chinese';
    chineseDiv.textContent = correctWord.chinese || '';
    questionDiv.appendChild(chineseDiv);

    // Pronunciation button
    const pronounceBtn = document.createElement('button');
    pronounceBtn.className = 'spelling-pronounce-btn';
    pronounceBtn.innerHTML = '<i class="fas fa-volume-up"></i> Listen';
    pronounceBtn.addEventListener('click', () => {
        playWordPronunciation(correctWord.word);
    });
    questionDiv.appendChild(pronounceBtn);

    // Word display with vowel slots (clickable buttons below)
    const wordDiv = document.createElement('div');
    wordDiv.className = 'spelling-word';

    const word = correctWord.word.toLowerCase();
    const vowelSet = new Set(['a','e','i','o','u']);
    const vowelSlots = [];
    const expectedVowels = [];
    let vowelIndex = 0;

    for (let i = 0; i < word.length; i++) {
        const ch = word[i];
        if (vowelSet.has(ch)) {
            const slot = document.createElement('span');
            slot.className = 'spelling-vowel-slot';
            slot.dataset.vowelIndex = vowelIndex;
            slot.dataset.expected = ch;
            slot.textContent = '_';
            vowelSlots.push(slot);
            expectedVowels.push(ch);
            wordDiv.appendChild(slot);
            vowelIndex++;
        } else {
            const span = document.createElement('span');
            span.className = 'spelling-consonant';
            span.textContent = ch;
            wordDiv.appendChild(span);
        }
    }

    questionDiv.appendChild(wordDiv);

    // Vowel buttons row
    const vowelButtonsDiv = document.createElement('div');
    vowelButtonsDiv.className = 'spelling-vowel-buttons';

    const vowels = ['a','e','i','o','u'];
    const vowelBtns = [];
    vowels.forEach(v => {
        const btn = document.createElement('button');
        btn.className = 'spelling-vowel-btn';
        btn.textContent = v;
        btn.dataset.vowel = v;
        vowelBtns.push(btn);
        vowelButtonsDiv.appendChild(btn);
    });

    // Backspace button
    const backspaceBtn = document.createElement('button');
    backspaceBtn.className = 'spelling-vowel-btn backspace';
    backspaceBtn.innerHTML = '<i class="fas fa-backspace"></i>';
    vowelButtonsDiv.appendChild(backspaceBtn);

    questionDiv.appendChild(vowelButtonsDiv);
    spellingContainer.appendChild(questionDiv);

    // State for current slot index
    let currentSlotIndex = 0;

    function updateSlots() {
        vowelSlots.forEach((slot, idx) => {
            if (idx < currentSlotIndex) {
                slot.classList.add('filled');
            } else {
                slot.classList.remove('filled');
                slot.textContent = '_';
            }
        });
        // Enable/disable vowel buttons
        const allBtns = vowelButtonsDiv.querySelectorAll('.spelling-vowel-btn');
        allBtns.forEach(btn => {
            btn.disabled = gameState.isAnswered || currentSlotIndex >= vowelSlots.length;
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
            // All slots filled → check answer
            checkAnswer(vowelSlots, expectedVowels);
        }
    }

    vowelBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            fillVowel(btn.dataset.vowel);
        });
    });

    backspaceBtn.addEventListener('click', () => {
        if (gameState.isAnswered) return;
        if (currentSlotIndex === 0) return;
        currentSlotIndex--;
        const slot = vowelSlots[currentSlotIndex];
        slot.textContent = '_';
        delete slot.dataset.filled;
        updateSlots();
    });

    updateSlots();
}

function checkAnswer(vowelSlots, expectedVowels) {
    if (gameState.isAnswered) return;
    gameState.isAnswered = true;

    let allCorrect = true;
    vowelSlots.forEach((slot, idx) => {
        const expected = expectedVowels[idx];
        const given = slot.dataset.filled || '';
        if (given === expected) {
            slot.classList.add('correct');
        } else {
            slot.classList.add('wrong');
            allCorrect = false;
        }
    });

    const wordIndex = gameState.questionOrder[gameState.currentQuestionIndex];
    const wordList = window.wordList;
    const correctWord = wordList[wordIndex];

    if (allCorrect) {
        gameState.correctCount++;
        totalScore += 4;
        streakCount++;
        playSoundEffect('correct');
    } else {
        gameState.wrongCount++;
        streakCount = 0;
        gameState.wrongWords.push(correctWord);
        playSoundEffect('wrong');
    }

    gameState.currentQuestionIndex++;
    updateScoreDisplay();

    const advanceDelay = 2000;
    if (streakCount >= 5) {
        showCelebration(() => {
            streakCount = 0;
            showQuestion();
        });
    } else {
        setTimeout(() => {
            showQuestion();
        }, advanceDelay);
    }
}

// ========= 语音 & 音效 =========
function playWordPronunciation(word, rate = 0.5) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.2;
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) utterance.voice = englishVoice;
    window.speechSynthesis.speak(utterance);
}

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

// ========= 游戏结束 & 彩蛋 =========
function showGameComplete() {
    updateScoreDisplay();
    spellingContainer.innerHTML = '';

    let wrongHtml = '';
    if (gameState.wrongWords.length) {
        wrongHtml = `
            <div class="wrong-words-section">
                <h3><i class="fas fa-book"></i> Words to Review (${gameState.wrongWords.length})</h3>
                <div class="wrong-words-list">
                    ${gameState.wrongWords.map(w => `
                        <div class="wrong-word-item">
                            <img src="${w.image}" style="width:80px;height:80px;object-fit:contain">
                            <div class="wrong-word-info">
                                <div class="wrong-word-text">${w.word}</div>
                                <div class="wrong-word-phonetic">${window.getPhoneticSymbol(w.word)}</div>
                                <div class="wrong-word-chinese">${w.chinese || ''}</div>
                            </div>
                            <button class="wrong-word-play-btn" onclick="playWordPronunciation('${w.word}',0.7)">
                                <i class="fas fa-volume-up"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    const completeDiv = document.createElement('div');
    completeDiv.className = 'game-complete';
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
    document.getElementById('playAgainBtn')?.addEventListener('click', () => initSpellingGame());
    document.getElementById('backToMenuBtn')?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    showConfetti();
}

function showCelebration(callback) {
    const msgs = ["Very Well!", "Great job!", "Fantastic!", "Amazing!"];
    const overlay = document.createElement('div');
    overlay.className = 'celebration-overlay';
    overlay.innerHTML = `<div class="celebration-content"><div class="celebration-message">${msgs[Math.floor(Math.random() * msgs.length)]}</div></div>`;
    document.body.appendChild(overlay);
    setTimeout(() => {
        overlay.remove();
        if (callback) callback();
    }, 2000);
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
    initSpellingGame();
});

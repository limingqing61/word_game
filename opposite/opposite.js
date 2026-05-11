(function() {
    'use strict';

    // ---------- Configuration ----------
    const TOTAL_QUESTIONS = 20;
    const POINTS_PER_CORRECT = 5;
    const STREAK_CELEBRATION = 5;

    // ---------- DOM references ----------
    const scoreDisplay = document.getElementById('scoreDisplay');
    const questionDisplay = document.getElementById('questionDisplay');
    const streakDisplay = document.getElementById('streakDisplay');
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    const questionArea = document.getElementById('questionArea');
    const startMessage = document.getElementById('startMessage');
    const oppositeImage = document.getElementById('oppositeImage');
    const leftClickArea = document.getElementById('leftClickArea');
    const rightClickArea = document.getElementById('rightClickArea');
    const feedback = document.getElementById('feedback');

    // ---------- Game state ----------
    let gameState = {
        score: 0,
        currentQuestion: 0,
        streak: 0,
        questions: [],          // array of {image, targetSide, targetWord, oppositeWord}
        isPlaying: false,
        isAnswered: false,
        totalQuestions: TOTAL_QUESTIONS,
    };

    // ---------- Helper functions ----------
    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // ---------- Build question list ----------
    function buildQuestions() {
        // List of image filenames (without extension)
        const imageNames = [
            'big_small',
            'good_bad',
            'hot_cold',
            'fast_slow',
            'happy_sad',
            'tall_short',
            'long_short',
            'heavy_light',
            'old_young',
            'new_old',
            'clean_dirty',
            'wet_dry',
            'full_empty',
            'open_closed',
            'hard_soft',
            'loud_quiet',
            'bright_dark',
            'thick_thin',
            'wide_narrow',
            'high_low',
            'rich_poor',
            'strong_weak',
            'sweet_sour',
            'smooth_rough',
            'sharp_dull',
            'deep_shallow',
            'early_late',
            'near_far',
            'easy_hard',
            'safe_dangerous',
        ];

        // Shuffle and pick up to TOTAL_QUESTIONS
        const shuffled = shuffleArray([...imageNames]);
        const selected = shuffled.slice(0, TOTAL_QUESTIONS);

        const questions = selected.map(name => {
            // Split by underscore
            const parts = name.split('_');
            const leftWord = parts[0];
            const rightWord = parts[1];
            // Randomly decide which side is the target (0 = left, 1 = right)
            const targetSide = Math.random() < 0.5 ? 'left' : 'right';
            const targetWord = targetSide === 'left' ? leftWord : rightWord;
            const oppositeWord = targetSide === 'left' ? rightWord : leftWord;
            return {
                image: `./${name}.jpeg`,
                targetSide,
                targetWord,
                oppositeWord,
            };
        });

        return questions;
    }

    // ---------- Play voice ----------
    function speakPhrase(targetWord, oppositeWord) {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(`this is ${targetWord}, not ${oppositeWord}`);
        utterance.lang = 'en-US';
        utterance.rate = 0.7;
        utterance.pitch = 1.2;
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith('en'));
        if (englishVoice) utterance.voice = englishVoice;
        window.speechSynthesis.speak(utterance);
    }

    // ---------- Show question ----------
    function showQuestion() {
        if (gameState.currentQuestion >= gameState.totalQuestions) {
            showGameComplete();
            return;
        }

        gameState.isAnswered = false;
        feedback.textContent = '';
        feedback.className = 'opposite-feedback';

        const q = gameState.questions[gameState.currentQuestion];
        oppositeImage.src = q.image;
        oppositeImage.alt = `${q.targetWord} vs ${q.oppositeWord}`;

        // Update display
        questionDisplay.textContent = `${gameState.currentQuestion + 1}/${gameState.totalQuestions}`;
        scoreDisplay.textContent = gameState.score;
        streakDisplay.textContent = gameState.streak;

        // Speak after a short delay to allow image load
        setTimeout(() => {
            speakPhrase(q.targetWord, q.oppositeWord);
        }, 500);
    }

    // ---------- Handle click ----------
    function handleClick(side) {
        if (!gameState.isPlaying) return;
        if (gameState.isAnswered) return;

        const q = gameState.questions[gameState.currentQuestion];
        const correct = (side === q.targetSide);

        gameState.isAnswered = true;

        if (correct) {
            gameState.score += POINTS_PER_CORRECT;
            gameState.streak++;
            feedback.textContent = '✓ Correct!';
            feedback.className = 'opposite-feedback correct';
            playSoundEffect('correct');

            // Check streak celebration
            if (gameState.streak % STREAK_CELEBRATION === 0) {
                showCelebration(() => {
                    nextQuestion();
                });
                return;
            }
        } else {
            gameState.streak = 0;
            feedback.textContent = `✗ Wrong. The correct side was ${q.targetSide}.`;
            feedback.className = 'opposite-feedback wrong';
            playSoundEffect('wrong');
        }

        // Update display
        scoreDisplay.textContent = gameState.score;
        streakDisplay.textContent = gameState.streak;

        // Move to next question after a short delay
        setTimeout(() => {
            nextQuestion();
        }, 1500);
    }

    function nextQuestion() {
        gameState.currentQuestion++;
        showQuestion();
    }

    // ---------- Game complete ----------
    function showGameComplete() {
        questionArea.style.display = 'none';
        startMessage.style.display = 'block';
        startMessage.innerHTML = `
            <h3><i class="fas fa-trophy"></i> Game Complete!</h3>
            <p style="font-size:2rem; margin:20px 0;">Your score: ${gameState.score} / ${TOTAL_QUESTIONS * POINTS_PER_CORRECT}</p>
            <p style="font-size:1.5rem;">Click "Start" to play again.</p>
        `;
        gameState.isPlaying = false;
        startBtn.textContent = 'Play Again';
    }

    // ---------- Sound effects ----------
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
            } else {
                osc.frequency.setValueAtTime(200, ctx.currentTime);
                osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
            }
            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) {
            // ignore
        }
    }

    // ---------- Celebration ----------
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

    // ---------- Start / Reset ----------
    function startGame() {
        gameState.score = 0;
        gameState.currentQuestion = 0;
        gameState.streak = 0;
        gameState.isPlaying = true;
        gameState.isAnswered = false;
        gameState.questions = buildQuestions();

        startMessage.style.display = 'none';
        questionArea.style.display = 'block';
        startBtn.textContent = 'Restart';

        showQuestion();
    }

    function resetGame() {
        gameState.isPlaying = false;
        gameState.score = 0;
        gameState.currentQuestion = 0;
        gameState.streak = 0;
        gameState.questions = [];
        gameState.isAnswered = false;

        scoreDisplay.textContent = '0';
        questionDisplay.textContent = `0/${TOTAL_QUESTIONS}`;
        streakDisplay.textContent = '0';
        feedback.textContent = '';
        feedback.className = 'opposite-feedback';
        oppositeImage.src = '';
        questionArea.style.display = 'none';
        startMessage.style.display = 'block';
        startMessage.innerHTML = `
            <h3><i class="fas fa-info-circle"></i> How to Play</h3>
            <ol>
                <li>Click "Start" to begin.</li>
                <li>You will see an image with two opposite adjectives.</li>
                <li>Listen to the voice: "this is [target], not [opposite]".</li>
                <li>Click the correct side of the image (left or right).</li>
                <li>Each correct answer gives 5 points.</li>
                <li>Get 5 in a row for a celebration!</li>
            </ol>
        `;
        startBtn.textContent = 'Start';
        gameState.isPlaying = false;
    }

    // ---------- Event listeners ----------
    leftClickArea.addEventListener('click', () => handleClick('left'));
    rightClickArea.addEventListener('click', () => handleClick('right'));
    startBtn.addEventListener('click', startGame);
    resetBtn.addEventListener('click', resetGame);

    // ---------- Initial state ----------
    resetGame();
})();

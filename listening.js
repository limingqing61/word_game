// Game data - words and local images (shared with main game)
const wordList = [
    { word: "apple", image: "images/apple.jpeg", color: "#FF6B6B" },
    { word: "banana", image: "images/banana.jpeg", color: "#FFD166" },
    { word: "orange", image: "images/orange.jpeg", color: "#FF9800" },
    { word: "strawberry", image: "images/strawberry.jpeg", color: "#EF476F" },
    { word: "cat", image: "images/cat.jpeg", color: "#FFD166" },
    { word: "dog", image: "images/dog.jpeg", color: "#06D6A0" },
    { word: "fish", image: "images/fish.jpeg", color: "#2196F3" },
    { word: "bird", image: "images/bird.jpeg", color: "#FF9800" },
    { word: "lion", image: "images/lion.jpeg", color: "#FF9800" },
    { word: "elephant", image: "images/elephant.jpeg", color: "#9E9E9E" },
    { word: "fox", image: "images/fox.jpeg", color: "#FF9800" },
    { word: "wolf", image: "images/wolf.jpeg", color: "#9E9E9E" },
    { word: "dolphin", image: "images/dolphin.jpeg", color: "#2196F3" },
    { word: "whale", image: "images/whale.jpeg", color: "#2196F3" },
    { word: "alligator", image: "images/alligator.jpeg", color: "#4CAF50" },
    { word: "eye", image: "images/eye.jpeg", color: "#9C27B0" },
    { word: "nose", image: "images/nose.jpeg", color: "#FF8A65" },
    { word: "ear", image: "images/ear.jpeg", color: "#FFD166" },
    { word: "mouth", image: "images/mouth.jpeg", color: "#EF476F" },
    { word: "leg", image: "images/leg.jpeg", color: "#FF9800" },
    { word: "foot", image: "images/foot.jpeg", color: "#795548" },
    { word: "car", image: "images/car.jpeg", color: "#FF6347" },
    { word: "egg", image: "images/egg.jpeg", color: "#FFE082" },
    { word: "house", image: "images/house.jpeg", color: "#FF8A65" },
    { word: "flower", image: "images/flower.jpeg", color: "#E91E63" },
    { word: "ball", image: "images/ball.jpeg", color: "#4ECDC4" },
    { word: "sun", image: "images/sun.jpeg", color: "#FFD700" }
];

// Game state
let gameState = {
    correctCount: 0,
    wrongCount: 0,
    currentQuestionIndex: 0,
    questionOrder: [],
    isAnswered: false,
    hintUsed: false,
    totalQuestions: wordList.length
};

// DOM elements
const correctCountElement = document.getElementById('correctCount');
const wrongCountElement = document.getElementById('wrongCount');
const progressCountElement = document.getElementById('progressCount');
const progressFillElement = document.getElementById('progressFill');
const questionContainer = document.getElementById('questionContainer');
const choicesGrid = document.getElementById('choicesGrid');
const repeatBtn = document.getElementById('repeatBtn');
const hintBtn = document.getElementById('hintBtnListening');
const backBtn = document.getElementById('backBtn');

// Initialize the game
function initListeningGame() {
    // Reset game state
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.currentQuestionIndex = 0;
    gameState.isAnswered = false;
    gameState.hintUsed = false;
    
    // Create shuffled question order
    gameState.questionOrder = shuffleArray([...Array(wordList.length).keys()]);
    
    // Update UI
    updateScoreDisplay();
    showQuestion();
}

// Shuffle array (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Update score display
function updateScoreDisplay() {
    correctCountElement.textContent = gameState.correctCount;
    wrongCountElement.textContent = gameState.wrongCount;
    progressCountElement.textContent = `${gameState.currentQuestionIndex}/${gameState.totalQuestions}`;
    
    const progressPercent = (gameState.currentQuestionIndex / gameState.totalQuestions) * 100;
    progressFillElement.style.width = `${progressPercent}%`;
}

// Show current question
function showQuestion() {
    if (gameState.currentQuestionIndex >= gameState.totalQuestions) {
        showGameComplete();
        return;
    }
    
    gameState.isAnswered = false;
    gameState.hintUsed = false;
    hintBtn.disabled = false;
    
    const wordIndex = gameState.questionOrder[gameState.currentQuestionIndex];
    const correctWord = wordList[wordIndex];
    
    // Show question mark
    questionContainer.innerHTML = '<div class="question-mark">?</div>';
    
    // Generate choices
    generateChoices(wordIndex);
    
    // Play the word pronunciation
    playWordPronunciation(correctWord.word);
    
    // Update progress
    updateScoreDisplay();
}

// Generate 4 choices (1 correct + 3 random)
function generateChoices(correctIndex) {
    const correctWord = wordList[correctIndex];
    
    // Get all other word indices
    const otherIndices = [];
    for (let i = 0; i < wordList.length; i++) {
        if (i !== correctIndex) {
            otherIndices.push(i);
        }
    }
    
    // Shuffle and pick 3 random
    const shuffledOthers = shuffleArray([...otherIndices]);
    const selectedOthers = shuffledOthers.slice(0, 3);
    
    // Combine and shuffle
    const choiceIndices = [correctIndex, ...selectedOthers];
    const shuffledChoices = shuffleArray([...choiceIndices]);
    
    // Clear grid
    choicesGrid.innerHTML = '';
    
    // Create choice elements
    shuffledChoices.forEach((wordIndex) => {
        const word = wordList[wordIndex];
        const choiceItem = document.createElement('div');
        choiceItem.className = 'choice-item';
        choiceItem.dataset.wordIndex = wordIndex;
        choiceItem.dataset.isCorrect = (wordIndex === correctIndex) ? 'true' : 'false';
        
        const img = document.createElement('img');
        img.src = word.image;
        img.alt = word.word;
        
        const wordLabel = document.createElement('div');
        wordLabel.className = 'word-label';
        wordLabel.textContent = word.word;
        
        choiceItem.appendChild(img);
        choiceItem.appendChild(wordLabel);
        
        // Add error handling for images
        img.onerror = function() {
            img.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.textContent = word.word;
            fallback.style.fontSize = '2rem';
            fallback.style.fontWeight = 'bold';
            fallback.style.color = word.color;
            fallback.style.padding = '20px';
            choiceItem.insertBefore(fallback, wordLabel);
        };
        
        choiceItem.addEventListener('click', function() {
            handleChoiceClick(this, correctIndex);
        });
        
        choicesGrid.appendChild(choiceItem);
    });
}

// Handle choice click
function handleChoiceClick(clickedElement, correctIndex) {
    if (gameState.isAnswered) return;
    
    gameState.isAnswered = true;
    hintBtn.disabled = true;
    
    const clickedIndex = parseInt(clickedElement.dataset.wordIndex);
    const isCorrect = (clickedIndex === correctIndex);
    
    // Disable all choices
    const allChoices = document.querySelectorAll('.choice-item');
    allChoices.forEach(choice => choice.classList.add('disabled'));
    
    // Find correct choice element
    let correctChoiceElement = null;
    allChoices.forEach(choice => {
        if (parseInt(choice.dataset.wordIndex) === correctIndex) {
            correctChoiceElement = choice;
        }
    });
    
    // Show result icons
    if (isCorrect) {
        gameState.correctCount++;
        clickedElement.classList.add('correct');
        clickedElement.classList.add('revealed');
        
        const icon = document.createElement('div');
        icon.className = 'result-icon correct';
        icon.innerHTML = '<i class="fas fa-check-circle"></i>';
        clickedElement.appendChild(icon);
    } else {
        gameState.wrongCount++;
        clickedElement.classList.add('wrong');
        clickedElement.classList.add('revealed');
        
        const wrongIcon = document.createElement('div');
        wrongIcon.className = 'result-icon wrong';
        wrongIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
        clickedElement.appendChild(wrongIcon);
        
        // Also reveal correct answer
        if (correctChoiceElement) {
            correctChoiceElement.classList.add('correct');
            correctChoiceElement.classList.add('revealed');
            
            const correctIcon = document.createElement('div');
            correctIcon.className = 'result-icon correct';
            correctIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
            correctChoiceElement.appendChild(correctIcon);
        }
    }
    
    // Update score
    updateScoreDisplay();
    
    // Auto advance to next question after delay
    setTimeout(() => {
        gameState.currentQuestionIndex++;
        showQuestion();
    }, 2000);
}

// Play word pronunciation using speech synthesis
function playWordPronunciation(word) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = 0.7; // Slower for kids
        utterance.pitch = 1.1;
        
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        if (englishVoice) {
            utterance.voice = englishVoice;
        }
        
        window.speechSynthesis.speak(utterance);
    }
}

// Show game complete screen
function showGameComplete() {
    questionContainer.innerHTML = '';
    choicesGrid.innerHTML = '';
    
    const completeDiv = document.createElement('div');
    completeDiv.className = 'game-complete';
    completeDiv.innerHTML = `
        <h2><i class="fas fa-trophy"></i> Game Complete!</h2>
        <div class="final-score">
            <span class="correct">Correct: ${gameState.correctCount}</span> | 
            <span class="wrong">Wrong: ${gameState.wrongCount}</span>
        </div>
        <button id="playAgainBtn" class="repeat-btn">
            <i class="fas fa-redo"></i> Play Again
        </button>
        <button id="backToMenuBtn" class="back-btn">
            <i class="fas fa-arrow-left"></i> Back to Menu
        </button>
    `;
    
    questionContainer.appendChild(completeDiv);
    
    document.getElementById('playAgainBtn').addEventListener('click', function() {
        initListeningGame();
    });
    
    document.getElementById('backToMenuBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
    
    // Show confetti
    showConfetti();
}

// Simple confetti effect
function showConfetti() {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#EF476F'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        
        document.body.appendChild(confetti);
        
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 10}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 3000 + 2000,
            easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

// Event listeners
repeatBtn.addEventListener('click', function() {
    if (gameState.currentQuestionIndex < gameState.totalQuestions) {
        const wordIndex = gameState.questionOrder[gameState.currentQuestionIndex];
        const word = wordList[wordIndex].word;
        playWordPronunciation(word);
    }
});

hintBtn.addEventListener('click', function() {
    if (gameState.isAnswered || gameState.hintUsed) return;
    
    gameState.hintUsed = true;
    hintBtn.disabled = true;
    
    const correctIndex = gameState.questionOrder[gameState.currentQuestionIndex];
    
    // Find a wrong choice to eliminate
    const allChoices = document.querySelectorAll('.choice-item');
    const wrongChoices = [];
    allChoices.forEach(choice => {
        if (parseInt(choice.dataset.wordIndex) !== correctIndex && !choice.classList.contains('eliminated')) {
            wrongChoices.push(choice);
        }
    });
    
    if (wrongChoices.length > 0) {
        const randomWrong = wrongChoices[Math.floor(Math.random() * wrongChoices.length)];
        randomWrong.classList.add('eliminated');
    }
});

backBtn.addEventListener('click', function() {
    window.location.href = 'index.html';
});

// Initialize the game when page loads
window.addEventListener('load', function() {
    // Pre-load speech synthesis voices
    if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = function() {
            window.speechSynthesis.getVoices();
        };
    }
    
    initListeningGame();
});

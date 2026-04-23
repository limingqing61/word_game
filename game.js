// Game data - words and image URLs
const wordList = [
    // Fruits
    {
        word: "apple",
        image: "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=400&h=300&fit=crop&auto=format",
        color: "#FF6B6B"
    },
    {
        word: "banana",
        image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=300&fit=crop&auto=format",
        color: "#FFD166"
    },
    {
        word: "orange",
        image: "https://images.unsplash.com/photo-1547514701-42782101795e?w=400&h=300&fit=crop&auto=format",
        color: "#FF9800"
    },
    {
        word: "grape",
        image: "https://images.unsplash.com/photo-1515777315835-281b94c9589f?w=400&h=300&fit=crop&auto=format",
        color: "#9C27B0"
    },
    // Animals
    {
        word: "cat",
        image: "https://images.unsplash.com/photo-1514888286974-6d03bde4ba42?w=400&h=300&fit=crop&auto=format",
        color: "#FFD166"
    },
    {
        word: "dog",
        image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop&auto=format",
        color: "#06D6A0"
    },
    {
        word: "fish",
        image: "https://images.unsplash.com/photo-1518834103328-93d45986dce1?w=400&h=300&fit=crop&auto=format",
        color: "#EF476F"
    },
    {
        word: "bird",
        image: "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop&auto=format",
        color: "#2196F3"
    },
    {
        word: "rabbit",
        image: "https://images.unsplash.com/photo-1556838803-cc94986cb631?w=400&h=300&fit=crop&auto=format",
        color: "#9E9E9E"
    },
    {
        word: "bear",
        image: "https://images.unsplash.com/photo-1573920110899-84b4c8bc5c6a?w=400&h=300&fit=crop&auto=format",
        color: "#795548"
    },
    // Common objects
    {
        word: "ball",
        image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=400&h=300&fit=crop&auto=format",
        color: "#4ECDC4"
    },
    {
        word: "car",
        image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop&auto=format",
        color: "#FF6347"
    },
    {
        word: "sun",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format",
        color: "#FFD700"
    },
    {
        word: "egg",
        image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop&auto=format",
        color: "#118AB2"
    }
];

// Game state
let gameState = {
    score: 0,
    remaining: wordList.length,
    currentWordIndex: 0,
    isListening: false,
    recognition: null,
    foundWords: new Set()
};

// DOM elements
const scoreElement = document.getElementById('score');
const remainingElement = document.getElementById('remaining');
const targetWordElement = document.getElementById('targetWord');
const wordImageElement = document.getElementById('wordImage');
const resultElement = document.getElementById('result');
const statusElement = document.getElementById('status');
const startBtn = document.getElementById('startBtn');
const hintBtn = document.getElementById('hintBtn');
const skipBtn = document.getElementById('skipBtn');
const resetBtn = document.getElementById('resetBtn');
const wordsGrid = document.querySelector('.words-grid');

// Audio elements
const correctSound = document.getElementById('correctSound');
const explosionSound = document.getElementById('explosionSound');
const winSound = document.getElementById('winSound');
const clickSound = document.getElementById('clickSound');

// Initialize the game
function initGame() {
    // Reset game state
    gameState.score = 0;
    gameState.remaining = wordList.length;
    gameState.currentWordIndex = 0;
    gameState.foundWords.clear();
    
    // Update UI
    updateScore();
    updateCurrentWord();
    createWordGrid();
    
    // Reset status
    statusElement.className = 'status idle';
    statusElement.innerHTML = '<i class="fas fa-microphone-slash"></i> Click "Start Game" to begin';
    resultElement.textContent = '...';
    
    // Stop recognition if active
    if (gameState.recognition) {
        gameState.recognition.stop();
        gameState.isListening = false;
        updateStartButton();
    }
}

// Update score display
function updateScore() {
    scoreElement.textContent = gameState.score;
    remainingElement.textContent = gameState.remaining;
}

// Update current word display
function updateCurrentWord() {
    const currentWord = wordList[gameState.currentWordIndex];
    targetWordElement.textContent = currentWord.word;
    wordImageElement.src = currentWord.image;
    wordImageElement.alt = currentWord.word;
}

// Create word grid
function createWordGrid() {
    wordsGrid.innerHTML = '';
    
    wordList.forEach((item, index) => {
        const wordItem = document.createElement('div');
        wordItem.className = 'word-item';
        wordItem.dataset.word = item.word;
        wordItem.dataset.index = index;
        
        // Check if word is already found
        if (gameState.foundWords.has(item.word)) {
            wordItem.classList.add('found');
        }
        
        wordItem.innerHTML = `
            <img src="${item.image}" alt="${item.word}">
            <div class="word">${item.word}</div>
        `;
        
        wordsGrid.appendChild(wordItem);
    });
}

// Initialize speech recognition
function initSpeechRecognition() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Sorry, your browser does not support speech recognition. Please try Chrome on iPad.');
        return null;
    }
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = function() {
        gameState.isListening = true;
        updateStartButton();
        statusElement.className = 'status listening';
        statusElement.innerHTML = '<i class="fas fa-microphone"></i> Listening... Speak now!';
    };
    
    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        resultElement.textContent = transcript;
        
        checkWordMatch(transcript);
    };
    
    recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
        statusElement.className = 'status idle';
        statusElement.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Error: ${event.error}`;
        gameState.isListening = false;
        updateStartButton();
    };
    
    recognition.onend = function() {
        gameState.isListening = false;
        updateStartButton();
        
        if (gameState.remaining > 0) {
            statusElement.className = 'status idle';
            statusElement.innerHTML = '<i class="fas fa-microphone-slash"></i> Click to speak again';
        }
    };
    
    return recognition;
}

// Check if spoken word matches current word
function checkWordMatch(spokenWord) {
    const currentWord = wordList[gameState.currentWordIndex].word.toLowerCase();
    
    // Normalize spoken word
    const normalizedSpoken = spokenWord.toLowerCase().trim();
    
    // More flexible matching
    let isMatch = false;
    
    // Exact match
    if (normalizedSpoken === currentWord) {
        isMatch = true;
    }
    // Match without plural 's'
    else if (normalizedSpoken === currentWord + 's' || normalizedSpoken + 's' === currentWord) {
        isMatch = true;
    }
    // Match common variations (for short words like "ball")
    else if (currentWord === 'ball' && (normalizedSpoken.includes('ball') || normalizedSpoken === 'bawl' || normalizedSpoken === 'bowl')) {
        isMatch = true;
    }
    // Handle common misrecognitions
    else if (currentWord === 'cat' && (normalizedSpoken === 'kite' || normalizedSpoken === 'kit' || normalizedSpoken === 'kat')) {
        isMatch = true;
    }
    else if (currentWord === 'dog' && (normalizedSpoken === 'dock' || normalizedSpoken === 'dug' || normalizedSpoken === 'dag')) {
        isMatch = true;
    }
    else if (currentWord === 'bird' && (normalizedSpoken === 'burd' || normalizedSpoken === 'beard' || normalizedSpoken === 'bard')) {
        isMatch = true;
    }
    // Match if spoken word contains the target word (for longer phrases)
    else if (normalizedSpoken.includes(currentWord) || currentWord.includes(normalizedSpoken)) {
        // Only allow if the spoken word is at least half the length of the target word
        if (normalizedSpoken.length >= currentWord.length / 2) {
            isMatch = true;
        }
    }
    // Sound similarity for short words (first two letters match)
    else if (currentWord.length <= 4 && normalizedSpoken.length <= 4) {
        if (currentWord.substring(0,2) === normalizedSpoken.substring(0,2)) {
            isMatch = true;
        }
    }
    
    if (isMatch) {
        // Play correct sound
        correctSound.currentTime = 0;
        correctSound.play();
        
        // Update game state
        gameState.score++;
        gameState.remaining--;
        gameState.foundWords.add(currentWord);
        
        // Update UI
        updateScore();
        
        // Mark word as found in grid
        const wordItems = document.querySelectorAll('.word-item');
        wordItems.forEach(item => {
            if (item.dataset.word.toLowerCase() === currentWord) {
                item.classList.add('found');
                
                // Play explosion sound after a short delay
                setTimeout(() => {
                    explosionSound.currentTime = 0;
                    explosionSound.play();
                }, 300);
            }
        });
        
        // Update status with what was recognized
        statusElement.className = 'status correct';
        statusElement.innerHTML = `<i class="fas fa-check-circle"></i> Correct! You said "${spokenWord}"`;
        
        // Move to next word if available
        setTimeout(() => {
            if (gameState.remaining > 0) {
                // Find next unfound word
                let nextIndex = -1;
                for (let i = 0; i < wordList.length; i++) {
                    if (!gameState.foundWords.has(wordList[i].word.toLowerCase())) {
                        nextIndex = i;
                        break;
                    }
                }
                
                if (nextIndex !== -1) {
                    gameState.currentWordIndex = nextIndex;
                    updateCurrentWord();
                    
                    // Restart listening
                    if (gameState.isListening) {
                        setTimeout(() => {
                            gameState.recognition.start();
                        }, 1000);
                    }
                }
            } else {
                // Game completed
                winSound.currentTime = 0;
                winSound.play();
                
                statusElement.className = 'status correct';
                statusElement.innerHTML = '<i class="fas fa-trophy"></i> You won! All words found!';
                
                // Show confetti effect
                showConfetti();
            }
        }, 1500);
    } else {
        // Show more detailed feedback
        statusElement.className = 'status idle';
        statusElement.innerHTML = `<i class="fas fa-times-circle"></i> Try again! You said "${spokenWord}". Target was "${currentWord}"`;
        
        // Restart listening after a short delay
        if (gameState.isListening) {
            setTimeout(() => {
                gameState.recognition.start();
            }, 1000);
        }
    }
}

// Update start button text and icon
function updateStartButton() {
    if (gameState.isListening) {
        startBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Stop Listening';
        startBtn.classList.add('listening');
    } else {
        startBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Game';
        startBtn.classList.remove('listening');
    }
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
        
        // Animate confetti
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

// Add pronunciation guide
function getPronunciationGuide(word) {
    const guides = {
        'apple': 'AP-pul',
        'banana': 'buh-NA-nuh',
        'orange': 'OR-inj',
        'grape': 'GRAYP',
        'cat': 'KAT',
        'dog': 'DAWG',
        'fish': 'FISH',
        'bird': 'BURD',
        'rabbit': 'RAB-bit',
        'bear': 'BAIR',
        'ball': 'BAWL',
        'car': 'KAR',
        'sun': 'SUN',
        'egg': 'EG'
    };
    return guides[word.toLowerCase()] || word;
}

// Update current word display to include pronunciation
function updateCurrentWord() {
    const currentWord = wordList[gameState.currentWordIndex];
    targetWordElement.textContent = currentWord.word;
    wordImageElement.src = currentWord.image;
    wordImageElement.alt = currentWord.word;
    
    // Update pronunciation hint in status area
    const pronunciation = getPronunciationGuide(currentWord.word);
    document.querySelector('.speech-result p').innerHTML = 
        `Say: <strong>"${currentWord.word}"</strong> (sounds like "${pronunciation}")`;
}

// Function to skip current word
function skipCurrentWord() {
    // Mark current word as found (but don't add to score)
    const currentWord = wordList[gameState.currentWordIndex].word.toLowerCase();
    gameState.foundWords.add(currentWord);
    
    // Update remaining count
    gameState.remaining--;
    
    // Update UI
    updateScore();
    
    // Mark word as found in grid
    const wordItems = document.querySelectorAll('.word-item');
    wordItems.forEach(item => {
        if (item.dataset.word.toLowerCase() === currentWord) {
            item.classList.add('found');
        }
    });
    
    // Find next unfound word
    let nextIndex = -1;
    for (let i = 0; i < wordList.length; i++) {
        if (!gameState.foundWords.has(wordList[i].word.toLowerCase())) {
            nextIndex = i;
            break;
        }
    }
    
    if (nextIndex !== -1) {
        gameState.currentWordIndex = nextIndex;
        updateCurrentWord();
        
        // Update status
        statusElement.className = 'status idle';
        statusElement.innerHTML = `<i class="fas fa-forward"></i> Skipped! Now try: "${wordList[nextIndex].word}"`;
        
        // Restart listening if it was active
        if (gameState.isListening) {
            setTimeout(() => {
                if (gameState.recognition) {
                    gameState.recognition.start();
                }
            }, 1000);
        }
    } else {
        // Game completed
        winSound.currentTime = 0;
        winSound.play();
        
        statusElement.className = 'status correct';
        statusElement.innerHTML = '<i class="fas fa-trophy"></i> You won! All words found!';
        
        // Show confetti effect
        showConfetti();
    }
}

// Event listeners
startBtn.addEventListener('click', function() {
    clickSound.currentTime = 0;
    clickSound.play();
    
    if (!gameState.recognition) {
        gameState.recognition = initSpeechRecognition();
    }
    
    if (!gameState.recognition) return;
    
    if (gameState.isListening) {
        gameState.recognition.stop();
    } else {
        gameState.recognition.start();
    }
});

hintBtn.addEventListener('click', function() {
    clickSound.currentTime = 0;
    clickSound.play();
    
    const currentWord = wordList[gameState.currentWordIndex].word;
    const pronunciation = getPronunciationGuide(currentWord);
    alert(`Hint: The word is "${currentWord}".\n\nPronounce it like: "${pronunciation}"\n\nTry saying it clearly and slowly!`);
});

skipBtn.addEventListener('click', function() {
    clickSound.currentTime = 0;
    clickSound.play();
    
    if (confirm(`Skip the word "${wordList[gameState.currentWordIndex].word}" and move to the next one?`)) {
        skipCurrentWord();
    }
});

resetBtn.addEventListener('click', function() {
    clickSound.currentTime = 0;
    clickSound.play();
    
    if (confirm('Are you sure you want to reset the game?')) {
        initGame();
    }
});

// Initialize the game when page loads
window.addEventListener('load', initGame);

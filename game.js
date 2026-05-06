
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
const backBtn = document.getElementById('backBtn');
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
    statusElement.innerHTML = '<i class="fas fa-microphone"></i> Ready to listen... Speak now!';
    resultElement.textContent = '...';
    
    // Update initial remaining count display
    remainingElement.textContent = gameState.remaining;
    
    // Initialize speech recognition
    if (!gameState.recognition) {
        gameState.recognition = initSpeechRecognition();
    }
    
    // Start listening automatically after a short delay
    setTimeout(() => {
        if (gameState.remaining > 0 && !gameState.isListening) {
            try {
                // 创建新的识别实例
                gameState.recognition = initSpeechRecognition();
                if (gameState.recognition) {
                    gameState.recognition.start();
                }
            } catch (e) {
                console.log('Auto-start error:', e);
            }
        }
    }, 1000);
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
        
        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.word;
        
        const wordText = document.createElement('div');
        wordText.className = 'word';
        wordText.textContent = item.word;
        wordText.style.color = item.color;
        
        wordItem.appendChild(img);
        wordItem.appendChild(wordText);
        
        // Add error handling for grid images
        img.onerror = function() {
            img.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.textContent = item.word;
            fallback.style.color = item.color;
            fallback.style.fontSize = '1.5rem';
            fallback.style.fontWeight = 'bold';
            fallback.style.textAlign = 'center';
            fallback.style.marginTop = '10px';
            fallback.style.padding = '10px';
            fallback.style.background = '#f9f9f9';
            fallback.style.borderRadius = '10px';
            wordItem.insertBefore(fallback, wordText);
        };
        
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
    
    // 每次创建新的识别实例，避免上下文干扰
    function createNewRecognition() {
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1; // 只获取一个结果
        
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
            
            // Try to restart after an error (unless it's a not-allowed error)
            if (event.error !== 'not-allowed' && event.error !== 'service-not-allowed') {
                setTimeout(() => {
                    if (!gameState.isListening && gameState.remaining > 0) {
                        try {
                            // 创建新的识别实例
                            gameState.recognition = createNewRecognition();
                            gameState.recognition.start();
                        } catch (e) {
                            console.log('Error restarting after error:', e);
                        }
                    }
                }, 1500);
            }
        };
        
        recognition.onend = function() {
            gameState.isListening = false;
            updateStartButton();
            
            // Auto-restart listening if game is not finished
            if (gameState.remaining > 0) {
                statusElement.className = 'status idle';
                statusElement.innerHTML = '<i class="fas fa-microphone"></i> Ready to listen... Speak now!';
                
                // Restart after a short delay with a new instance
                setTimeout(() => {
                    if (!gameState.isListening && gameState.remaining > 0) {
                        try {
                            // 创建新的识别实例，避免上下文问题
                            gameState.recognition = createNewRecognition();
                            gameState.recognition.start();
                        } catch (e) {
                            console.log('Recognition restart error:', e);
                            // If error, try again after a longer delay
                            setTimeout(() => {
                                if (!gameState.isListening && gameState.remaining > 0) {
                                    gameState.recognition = createNewRecognition();
                                    gameState.recognition.start();
                                }
                            }, 2000);
                        }
                    }
                }, 800);
            }
        };
        
        return recognition;
    }
    
    return createNewRecognition();
}

// Check if spoken word matches current word
function checkWordMatch(spokenWord) {
    const currentWord = wordList[gameState.currentWordIndex].word.toLowerCase();
    
    // Normalize spoken word
    const normalizedSpoken = spokenWord.toLowerCase().trim();
    
    // More flexible matching - 放宽标准
    let isMatch = false;
    
    // 1. 完全匹配
    if (normalizedSpoken === currentWord) {
        isMatch = true;
    }
    // 2. 编辑距离匹配（Levenshtein距离）
    else {
        const distance = levenshteinDistance(currentWord, normalizedSpoken);
        // 对于短词（<=4字符），允许编辑距离<=1
        // 对于长词，允许编辑距离<=2
        const maxAllowedDistance = (currentWord.length <= 4) ? 1 : 2;
        if (distance <= maxAllowedDistance) {
            isMatch = true;
        }
    }
    
    // 3. 如果编辑距离不匹配，尝试其他宽松匹配
    if (!isMatch) {
        // 包含匹配：如果说的词包含目标词或目标词包含说的词
        if (normalizedSpoken.includes(currentWord) || currentWord.includes(normalizedSpoken)) {
            // 长度相差不超过3个字符
            if (Math.abs(normalizedSpoken.length - currentWord.length) <= 3) {
                isMatch = true;
            }
            // 或者说的词至少是目标词长度的一半
            else if (normalizedSpoken.length >= currentWord.length / 2) {
                isMatch = true;
            }
        }
        // 开头匹配：前2个字符相同（更宽松）
        else if (currentWord.length >= 2 && normalizedSpoken.length >= 2) {
            if (currentWord.substring(0, 2) === normalizedSpoken.substring(0, 2)) {
                isMatch = true;
            }
        }
        // 结尾匹配：后2个字符相同
        else if (currentWord.length >= 2 && normalizedSpoken.length >= 2) {
            const currentEnd = currentWord.substring(currentWord.length - 2);
            const spokenEnd = normalizedSpoken.substring(normalizedSpoken.length - 2);
            if (currentEnd === spokenEnd) {
                isMatch = true;
            }
        }
        // 相似度匹配
        else {
            const similarity = calculateSimilarity(currentWord, normalizedSpoken);
            if (similarity >= 0.5) { // 降低到50%相似度
                isMatch = true;
            }
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

// Levenshtein距离计算
function levenshteinDistance(a, b) {
    const matrix = [];
    
    // 初始化矩阵
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }
    
    // 填充矩阵
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // 替换
                    Math.min(
                        matrix[i][j - 1] + 1,     // 插入
                        matrix[i - 1][j] + 1      // 删除
                    )
                );
            }
        }
    }
    
    return matrix[b.length][a.length];
}

// 计算两个词的相似度（简化版）
function calculateSimilarity(word1, word2) {
    // 如果长度相差太大，相似度低
    const lengthDiff = Math.abs(word1.length - word2.length);
    if (lengthDiff > 3) return 0.3;
    
    // 计算相同字符的比例
    let matches = 0;
    const minLength = Math.min(word1.length, word2.length);
    
    for (let i = 0; i < minLength; i++) {
        if (word1[i] === word2[i]) {
            matches++;
        }
    }
    
    // 考虑顺序不同的情况（简单实现）
    const word1Set = new Set(word1);
    const word2Set = new Set(word2);
    let setMatches = 0;
    for (const char of word1Set) {
        if (word2Set.has(char)) setMatches++;
    }
    
    // 综合两种匹配方式
    const positionSimilarity = matches / Math.max(word1.length, word2.length);
    const charSimilarity = setMatches / Math.max(word1Set.size, word2Set.size);
    
    return (positionSimilarity * 0.7 + charSimilarity * 0.3);
}

// Update start button text and icon
function updateStartButton() {
    if (gameState.isListening) {
        startBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Stop Listening';
        startBtn.classList.add('listening');
    } else {
        startBtn.innerHTML = '<i class="fas fa-microphone"></i> Start Listening';
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

// Add pronunciation guide and phonetic symbols
function getPronunciationGuide(word) {
    const guides = {
        'apple': 'AP-uhl',
        'banana': 'buh-NAH-nuh',
        'orange': 'ORR-inj',
        'strawberry': 'STRAW-buh-ree',
        'cat': 'KAT',
        'dog': 'DOG',
        'fish': 'FISH',
        'bird': 'BURD',
        'lion': 'LY-uhn',
        'elephant': 'EL-uh-fuhnt',
        'fox': 'FOKS',
        'wolf': 'WUULF',
        'dolphin': 'DOL-fin',
        'whale': 'WAYL',
        'alligator': 'AL-uh-gay-tuh',
        'eye': 'EYE',
        'nose': 'NOHZ',
        'ear': 'EER',
        'mouth': 'MOWTH',
        'leg': 'LEG',
        'foot': 'FUUT',
        'car': 'KAH',
        'egg': 'EG',
        'house': 'HOWSS',
        'flower': 'FLOW-uh',
        // New words
        'queen': 'KWEEN',
        'king': 'KING',
        'giant': 'JY-uhnt',
        'elf': 'ELF',
        'witch': 'WITCH',
        'wizard': 'WIZ-uhd',
        'clown': 'KLOWN',
        'soldier': 'SOHL-juh',
        'teacher': 'TEE-chuh',
        'doctor': 'DOK-tuh',
        'nurse': 'NURS',
        'farmer': 'FAH-muh',
        'chef': 'SHEF',
        'pilot': 'PY-luht',
        'driver': 'DRY-vuh',
        'crab': 'KRAB',
        'lobster': 'LOB-stuh',
        'shrimp': 'SHRIMP',
        'octopus': 'OK-tuh-puhs',
        'squid': 'SKWID',
        'seal': 'SEEL',
        'walrus': 'WAWL-ruhs',
        'otter': 'OT-uh',
        'bat': 'BAT',
        'rat': 'RAT',
        'hamster': 'HAM-stuh',
        'ferret': 'FER-it',
        'pony': 'POH-nee',
        'donkey': 'DONG-kee',
        'goose': 'GOOSS',
        'pigeon': 'PIJ-in',
        'seagull': 'SEE-guhl',
        'woodpecker': 'WOOD-pek-uh',
        'peacock': 'PEE-kok',
        'firefly': 'FY-uh-fly',
        'caterpillar': 'KAT-uh-pil-uh',
        'snail': 'SNAYL',
        'worm': 'WURM',
        'dinosaur': 'DY-nuh-saw',
        'date': 'DAYT',
        'papaya': 'puh-PY-uh',
        'nectarine': 'NEK-tuh-reen',
        'olive': 'OL-iv',
        'celery': 'SEL-uh-ree',
        'okra': 'OH-kruh',
        'shallot': 'shuh-LOT',
        'endive': 'EN-dyv',
        'bed': 'BED',
        'desk': 'DESK',
        'chair': 'CHAIR',
        'sofa': 'SOH-fuh',
        'blanket': 'BLANG-kit',
        'pillow': 'PIL-oh',
        'sheet': 'SHEET',
        'sponge': 'SPUNJ',
        'bucket': 'BUK-it',
        'broom': 'BROOM',
        'mop': 'MOP',
        'detergent': 'di-TUR-juhnt',
        'clothespin': 'KLOHTHZ-pin',
        'hanger': 'HANG-uh',
        'iron': 'EYE-uhn',
        'needle': 'NEE-dul',
        'thread': 'THRED',
        'button': 'BUT-uhn',
        'zipper': 'ZIP-uh',
        'wallet': 'WOL-it',
        'backpack': 'BAK-pak',
        'suitcase': 'SOOT-kayss',
        'ladder': 'LAD-uh',
        'hammer': 'HAM-uh',
        'nail': 'NAYL',
        'screwdriver': 'SKROO-dry-vuh',
        'wrench': 'RENCH',
        'pliers': 'PLY-uhz',
        'crayon': 'KRAY-on',
        'chalk': 'CHAWK',
        'glue': 'GLOO',
        'vest': 'VEST',
        'raincoat': 'RAYN-koht',
        'pajamas': 'puh-JAH-muhz',
        'swimsuit': 'SWIM-soot',
        'underwear': 'UN-duh-wair',
        'overalls': 'OH-vuh-rawlz',
        'helmet': 'HEL-mit',
        'earring': 'EER-ring',
        'necklace': 'NEK-lis',
        'bracelet': 'BRAYSS-lit',
        'ring': 'RING',
        'watch': 'WOCH',
        'glasses': 'GLAH-siz',
        'suspenders': 'suh-SPEN-duhz',
        'handkerchief': 'HANG-kuh-cheef',
        'scooter': 'SKOO-tuh',
        'skateboard': 'SKAYT-bord',
        'sailboat': 'SAYL-boht',
        'yacht': 'YOT',
        'submarine': 'sub-muh-REEN',
        'blimp': 'BLIMP',
        'rocket': 'ROK-it',
        'tractor': 'TRAK-tuh',
        'bulldozer': 'BOOL-doh-zuh',
        'crane': 'KRAYN',
        'forklift': 'FORK-lift',
        'convertible': 'kuhn-VUR-tuh-bul',
        'island': 'EYE-luhnd',
        'beach': 'BEECH',
        'cliff': 'KLIF',
        'cave': 'KAYV',
        'desert': 'DEZ-urt',
        'forest': 'FOR-ist',
        'waterfall': 'WAW-tuh-fawl',
        'stream': 'STREEM',
        'pond': 'POND',
        'wave': 'WAYV',
        'sand': 'SAND',
        'rock': 'ROK',
        'stone': 'STOHN',
        'flood': 'FLUD',
        'drought': 'DROWT',
        'earthquake': 'URTH-kwayk',
        'volcano': 'vol-KAY-noh',
        'dew': 'DYOO',
        'balloon': 'buh-LOON',
        'kite': 'KYT',
        'doll': 'DOL',
        'puzzle': 'PUZ-ul',
        'lego': 'LEG-oh',
        'checkers': 'CHEK-uhz',
        'marbles': 'MAR-bulz',
        'top': 'TOP',
        'whistle': 'WIS-ul',
        'drum': 'DRUM',
        'guitar': 'gi-TAR',
        'piano': 'pee-AN-oh',
        'violin': 'vy-uh-LIN',
        'microscope': 'MY-kruh-skohp',
        'telescope': 'TEL-uh-skohp',
        'compass': 'KUM-puhs',
        'map': 'MAP',
        'hospital': 'HOS-pi-tul',
        'school': 'SKOOL',
        'library': 'LY-brer-ee',
        'museum': 'myoo-ZEE-um',
        'zoo': 'ZOO',
        'farm': 'FARM',
        'park': 'PARK',
        'garden': 'GAR-dun',
        'restaurant': 'RES-tuh-ront',
        'bakery': 'BAY-kuh-ree',
        'cafe': 'KAF-ay',
        'supermarket': 'SOO-puh-mar-kit',
        'cinema': 'SIN-uh-muh',
        'stadium': 'STAY-dee-um',
        'airport': 'AIR-port',
        'head': 'HED',
        'hair': 'HAIR',
        'forehead': 'FOR-id',
        'eyebrow': 'EYE-brow',
        'eyelash': 'EYE-lash',
        'cheek': 'CHEEK',
        'chin': 'CHIN',
        'neck': 'NEK',
        'shoulder': 'SHOHL-duh',
        'arm': 'ARM',
        'elbow': 'EL-boh',
        'wrist': 'RIST',
        'hand': 'HAND',
        'finger': 'FING-guh',
        'thumb': 'THUM',
        'chest': 'CHEST',
        'back': 'BAK',
        'stomach': 'STUM-uhk',
        'hip': 'HIP',
        'knee': 'NEE',
        'ankle': 'ANG-kul',
        'heel': 'HEEL',
        'toe': 'TOH',
        // Verbs
        'run': 'RUN',
        'walk': 'WAWK',
        'jump': 'JUMP',
        'climb': 'KLYM',
        'crawl': 'KRAWL',
        'swim': 'SWIM',
        'dance': 'DAHNS',
        'sing': 'SING',
        'eat': 'EET',
        'drink': 'DRINK',
        'bite': 'BYT',
        'lick': 'LIK',
        'smell': 'SMEL',
        'look': 'LOOK',
        'listen': 'LIS-uhn',
        'touch': 'TUCH',
        'hold': 'HOHLD',
        'catch': 'KACH',
        'throw': 'THROH',
        'kick': 'KIK',
        'hit': 'HIT',
        'push': 'POOSH',
        'pull': 'POOL',
        'lift': 'LIFT',
        'carry': 'KAR-ee',
        'drop': 'DROP',
        'press': 'PRES',
        'break': 'BRAY',
        'fix': 'FIKS',
        'build': 'BILD',
        'draw': 'DRAW',
        'write': 'RYT',
        'read': 'REED',
        'count': 'KOWNT',
        'think': 'THINK',
        'know': 'NOH',
        'remember': 'ri-MEM-buh',
        'forget': 'fuh-GET',
        'sleep': 'SLEEP',
        'sit': 'SIT',
        'stand': 'STAND',
        'bend': 'BEND',
        'kneel': 'NEEL',
        'stretch': 'STRECH',
        'wash': 'WOSH',
        'clean': 'KLEEN',
        'sweep': 'SWEEP',
        'wipe': 'WYP',
        'cook': 'KOOK',
        'bake': 'BAYK',
        'fry': 'FRY',
        'boil': 'BOYL',
        'cut': 'KUT',
        'peel': 'PEEL',
        'pour': 'POR',
        'mix': 'MIKS',
        'stir': 'STUR',
        'spread': 'SPRED',
        'plant': 'PLAHNT',
        'dig': 'DIG',
        'hide': 'HYD',
        'find': 'FYND',
        'search': 'SURCH',
        'give': 'GIV',
        'take': 'TAYK',
        'bring': 'BRING',
        'send': 'SEND',
        'receive': 'ri-SEEV',
        'buy': 'BY',
        'sell': 'SEL',
        'pay': 'PAY',
        'earn': 'URN',
        'save': 'SAYV',
        'spend': 'SPEND',
        'help': 'HELP',
        'share': 'SHAIR',
        'laugh': 'LAF',
        'cry': 'KRY',
        'smile': 'SMYL'
    };
    return guides[word.toLowerCase()] || word;
}

// Add phonetic symbols (IPA)
function getPhoneticSymbol(word) {
    const phonetics = {
        'apple': '/ˈæp.əl/',
        'banana': '/bəˈnɑː.nə/',
        'orange': '/ˈɒr.ɪndʒ/',
        'strawberry': '/ˈstrɔː.bər.i/',
        'cat': '/kæt/',
        'dog': '/dɒɡ/',
        'fish': '/fɪʃ/',
        'bird': '/bɜːd/',
        'lion': '/ˈlaɪ.ən/',
        'elephant': '/ˈel.ɪ.fənt/',
        'fox': '/fɒks/',
        'wolf': '/wʊlf/',
        'dolphin': '/ˈdɒl.fɪn/',
        'whale': '/weɪl/',
        'alligator': '/ˈæl.ɪ.ɡeɪ.tə/',
        'eye': '/aɪ/',
        'nose': '/nəʊz/',
        'ear': '/ɪə/',
        'mouth': '/maʊθ/',
        'leg': '/leɡ/',
        'foot': '/fʊt/',
        'car': '/kɑː/',
        'egg': '/eɡ/',
        'house': '/haʊs/',
        'flower': '/ˈflaʊ.ə/',
        'ball': '/bɔːl/',
        'sun': '/sʌn/',
        'brother': '/ˈbrʌð.ə/',
        'mother': '/ˈmʌð.ə/',
        'father': '/ˈfɑː.ðə/',
        'grandpa': '/ˈɡræn.pɑː/',
        'grandma': '/ˈɡræn.mɑː/',
        'uncle': '/ˈʌŋ.kəl/',
        'aunt': '/ɑːnt/',
        'sister': '/ˈsɪs.tə/',
        'family': '/ˈfæm.əl.i/',
        // New words
        'queen': '/kwiːn/',
        'king': '/kɪŋ/',
        'giant': '/ˈdʒaɪ.ənt/',
        'elf': '/elf/',
        'witch': '/wɪtʃ/',
        'wizard': '/ˈwɪz.əd/',
        'clown': '/klaʊn/',
        'soldier': '/ˈsəʊl.dʒə/',
        'teacher': '/ˈtiː.tʃə/',
        'doctor': '/ˈdɒk.tə/',
        'nurse': '/nɜːs/',
        'farmer': '/ˈfɑː.mə/',
        'chef': '/ʃef/',
        'pilot': '/ˈpaɪ.lət/',
        'driver': '/ˈdraɪ.və/',
        'crab': '/kræb/',
        'lobster': '/ˈlɒb.stə/',
        'shrimp': '/ʃrɪmp/',
        'octopus': '/ˈɒk.tə.pəs/',
        'squid': '/skwɪd/',
        'seal': '/siːl/',
        'walrus': '/ˈwɔːl.rəs/',
        'otter': '/ˈɒt.ə/',
        'bat': '/bæt/',
        'rat': '/ræt/',
        'hamster': '/ˈhæm.stə/',
        'ferret': '/ˈfer.ɪt/',
        'pony': '/ˈpəʊ.ni/',
        'donkey': '/ˈdɒŋ.ki/',
        'goose': '/ɡuːs/',
        'pigeon': '/ˈpɪdʒ.ɪn/',
        'seagull': '/ˈsiː.ɡʌl/',
        'woodpecker': '/ˈwʊd.pek.ə/',
        'peacock': '/ˈpiː.kɒk/',
        'firefly': '/ˈfaɪə.flaɪ/',
        'caterpillar': '/ˈkæt.ə.pɪl.ə/',
        'snail': '/sneɪl/',
        'worm': '/wɜːm/',
        'dinosaur': '/ˈdaɪ.nə.sɔː/',
        'date': '/deɪt/',
        'papaya': '/pəˈpaɪ.ə/',
        'nectarine': '/ˈnek.tər.iːn/',
        'olive': '/ˈɒl.ɪv/',
        'celery': '/ˈsel.ər.i/',
        'okra': '/ˈəʊ.krə/',
        'shallot': '/ʃəˈlɒt/',
        'endive': '/ˈen.daɪv/',
        'bed': '/bed/',
        'desk': '/desk/',
        'chair': '/tʃeə/',
        'sofa': '/ˈsəʊ.fə/',
        'blanket': '/ˈblæŋ.kɪt/',
        'pillow': '/ˈpɪl.əʊ/',
        'sheet': '/ʃiːt/',
        'sponge': '/spʌndʒ/',
        'bucket': '/ˈbʌk.ɪt/',
        'broom': '/bruːm/',
        'mop': '/mɒp/',
        'detergent': '/dɪˈtɜː.dʒənt/',
        'clothespin': '/ˈkləʊðz.pɪn/',
        'hanger': '/ˈhæŋ.ə/',
        'iron': '/ˈaɪ.ən/',
        'needle': '/ˈniː.dəl/',
        'thread': '/θred/',
        'button': '/ˈbʌt.ən/',
        'zipper': '/ˈzɪp.ə/',
        'wallet': '/ˈwɒl.ɪt/',
        'backpack': '/ˈbæk.pæk/',
        'suitcase': '/ˈsuːt.keɪs/',
        'ladder': '/ˈlæd.ə/',
        'hammer': '/ˈhæm.ə/',
        'nail': '/neɪl/',
        'screwdriver': '/ˈskruː.draɪ.və/',
        'wrench': '/rentʃ/',
        'pliers': '/ˈplaɪ.əz/',
        'crayon': '/ˈkreɪ.ɒn/',
        'chalk': '/tʃɔːk/',
        'glue': '/ɡluː/',
        'vest': '/vest/',
        'raincoat': '/ˈreɪn.kəʊt/',
        'pajamas': '/pəˈdʒɑː.məz/',
        'swimsuit': '/ˈswɪm.suːt/',
        'underwear': '/ˈʌn.də.weə/',
        'overalls': '/ˈəʊ.vər.ɔːlz/',
        'helmet': '/ˈhel.mɪt/',
        'earring': '/ˈɪə.rɪŋ/',
        'necklace': '/ˈnek.lɪs/',
        'bracelet': '/ˈbreɪs.lɪt/',
        'ring': '/rɪŋ/',
        'watch': '/wɒtʃ/',
        'glasses': '/ˈɡlɑː.sɪz/',
        'suspenders': '/səˈspen.dəz/',
        'handkerchief': '/ˈhæŋ.kə.tʃiːf/',
        'scooter': '/ˈskuː.tə/',
        'skateboard': '/ˈskeɪt.bɔːd/',
        'sailboat': '/ˈseɪl.bəʊt/',
        'yacht': '/jɒt/',
        'submarine': '/ˌsʌb.məˈriːn/',
        'blimp': '/blɪmp/',
        'rocket': '/ˈrɒk.ɪt/',
        'tractor': '/ˈtræk.tə/',
        'bulldozer': '/ˈbʊl.dəʊ.zə/',
        'crane': '/kreɪn/',
        'forklift': '/ˈfɔːk.lɪft/',
        'convertible': '/kənˈvɜː.tə.bəl/',
        'island': '/ˈaɪ.lənd/',
        'beach': '/biːtʃ/',
        'cliff': '/klɪf/',
        'cave': '/keɪv/',
        'desert': '/ˈdez.ət/',
        'forest': '/ˈfɒr.ɪst/',
        'waterfall': '/ˈwɔː.tə.fɔːl/',
        'stream': '/striːm/',
        'pond': '/pɒnd/',
        'wave': '/weɪv/',
        'sand': '/sænd/',
        'rock': '/rɒk/',
        'stone': '/stəʊn/',
        'flood': '/flʌd/',
        'drought': '/draʊt/',
        'earthquake': '/ˈɜːθ.kweɪk/',
        'volcano': '/vɒlˈkeɪ.nəʊ/',
        'dew': '/djuː/',
        'balloon': '/bəˈluːn/',
        'kite': '/kaɪt/',
        'doll': '/dɒl/',
        'puzzle': '/ˈpʌz.əl/',
        'lego': '/ˈleɡ.əʊ/',
        'checkers': '/ˈtʃek.əz/',
        'marbles': '/ˈmɑː.bəlz/',
        'top': '/tɒp/',
        'whistle': '/ˈwɪs.əl/',
        'drum': '/drʌm/',
        'guitar': '/ɡɪˈtɑː/',
        'piano': '/piˈæn.əʊ/',
        'violin': '/ˌvaɪ.əˈlɪn/',
        'microscope': '/ˈmaɪ.krə.skəʊp/',
        'telescope': '/ˈtel.ɪ.skəʊp/',
        'compass': '/ˈkʌm.pəs/',
        'map': '/mæp/',
        'hospital': '/ˈhɒs.pɪ.təl/',
        'school': '/skuːl/',
        'library': '/ˈlaɪ.brər.i/',
        'museum': '/mjuːˈziː.əm/',
        'zoo': '/zuː/',
        'farm': '/fɑːm/',
        'park': '/pɑːk/',
        'garden': '/ˈɡɑː.dən/',
        'restaurant': '/ˈres.tər.ɒnt/',
        'bakery': '/ˈbeɪ.kər.i/',
        'cafe': '/ˈkæf.eɪ/',
        'supermarket': '/ˈsuː.pə.mɑː.kɪt/',
        'cinema': '/ˈsɪn.ə.mə/',
        'stadium': '/ˈsteɪ.di.əm/',
        'airport': '/ˈeə.pɔːt/',
        'head': '/hed/',
        'hair': '/heə/',
        'forehead': '/ˈfɒr.ɪd/',
        'eyebrow': '/ˈaɪ.braʊ/',
        'eyelash': '/ˈaɪ.læʃ/',
        'cheek': '/tʃiːk/',
        'chin': '/tʃɪn/',
        'neck': '/nek/',
        'shoulder': '/ˈʃəʊl.də/',
        'arm': '/ɑːm/',
        'elbow': '/ˈel.bəʊ/',
        'wrist': '/rɪst/',
        'hand': '/hænd/',
        'finger': '/ˈfɪŋ.ɡə/',
        'thumb': '/θʌm/',
        'chest': '/tʃest/',
        'back': '/bæk/',
        'stomach': '/ˈstʌm.ək/',
        'hip': '/hɪp/',
        'knee': '/niː/',
        'ankle': '/ˈæŋ.kəl/',
        'heel': '/hiːl/',
        'toe': '/təʊ/',
        // Verbs
        'run': '/rʌn/',
        'walk': '/wɔːk/',
        'jump': '/dʒʌmp/',
        'climb': '/klaɪm/',
        'crawl': '/krɔːl/',
        'swim': '/swɪm/',
        'dance': '/dɑːns/',
        'sing': '/sɪŋ/',
        'eat': '/iːt/',
        'drink': '/drɪŋk/',
        'bite': '/baɪt/',
        'lick': '/lɪk/',
        'smell': '/smel/',
        'look': '/lʊk/',
        'listen': '/ˈlɪs.ən/',
        'touch': '/tʌtʃ/',
        'hold': '/həʊld/',
        'catch': '/kætʃ/',
        'throw': '/θrəʊ/',
        'kick': '/kɪk/',
        'hit': '/hɪt/',
        'push': '/pʊʃ/',
        'pull': '/pʊl/',
        'lift': '/lɪft/',
        'carry': '/ˈkær.i/',
        'drop': '/drɒp/',
        'press': '/pres/',
        'break': '/breɪk/',
        'fix': '/fɪks/',
        'build': '/bɪld/',
        'draw': '/drɔː/',
        'write': '/raɪt/',
        'read': '/riːd/',
        'count': '/kaʊnt/',
        'think': '/θɪŋk/',
        'know': '/nəʊ/',
        'remember': '/rɪˈmem.bə/',
        'forget': '/fəˈɡet/',
        'sleep': '/sliːp/',
        'sit': '/sɪt/',
        'stand': '/stænd/',
        'bend': '/bend/',
        'kneel': '/niːl/',
        'stretch': '/stretʃ/',
        'wash': '/wɒʃ/',
        'clean': '/kliːn/',
        'sweep': '/swiːp/',
        'wipe': '/waɪp/',
        'cook': '/kʊk/',
        'bake': '/beɪk/',
        'fry': '/fraɪ/',
        'boil': '/bɔɪl/',
        'cut': '/kʌt/',
        'peel': '/piːl/',
        'pour': '/pɔː/',
        'mix': '/mɪks/',
        'stir': '/stɜː/',
        'spread': '/spred/',
        'plant': '/plɑːnt/',
        'dig': '/dɪɡ/',
        'hide': '/haɪd/',
        'find': '/faɪnd/',
        'search': '/sɜːtʃ/',
        'give': '/ɡɪv/',
        'take': '/teɪk/',
        'bring': '/brɪŋ/',
        'send': '/send/',
        'receive': '/rɪˈsiːv/',
        'buy': '/baɪ/',
        'sell': '/sel/',
        'pay': '/peɪ/',
        'earn': '/ɜːn/',
        'save': '/seɪv/',
        'spend': '/spend/',
        'help': '/help/',
        'share': '/ʃeə/',
        'laugh': '/lɑːf/',
        'cry': '/kraɪ/',
        'smile': '/smaɪl/'
    };
    return phonetics[word.toLowerCase()] || `/${word.toLowerCase()}/`;
}

// Update current word display to include pronunciation and phonetic
function updateCurrentWord() {
    const currentWord = wordList[gameState.currentWordIndex];
    targetWordElement.textContent = currentWord.word;
    
    // Update phonetic symbol
    const phoneticElement = document.getElementById('phonetic');
    if (phoneticElement) {
        phoneticElement.textContent = getPhoneticSymbol(currentWord.word);
    }
    
    // Update Chinese translation
    const chineseElement = document.getElementById('chinese');
    if (chineseElement) {
        chineseElement.textContent = currentWord.chinese || '';
    }
    
    // Clear any existing fallback text
    const imageContainer = wordImageElement.parentNode;
    const existingFallback = imageContainer.querySelector('.fallback-text');
    if (existingFallback) {
        existingFallback.remove();
    }
    
    // Reset image display
    wordImageElement.style.display = 'block';
    wordImageElement.onerror = null; // Clear previous error handler
    
    // Set a timeout to handle images that take too long to load
    const imageLoadTimeout = setTimeout(() => {
        if (wordImageElement.complete === false || wordImageElement.naturalHeight === 0) {
            showFallbackText(currentWord, imageContainer);
        }
    }, 2000);
    
    wordImageElement.onload = function() {
        clearTimeout(imageLoadTimeout);
    };
    
    wordImageElement.onerror = function() {
        clearTimeout(imageLoadTimeout);
        console.warn(`Failed to load image for ${currentWord.word}: ${currentWord.image}`);
        showFallbackText(currentWord, imageContainer);
    };
    
    wordImageElement.src = currentWord.image;
    wordImageElement.alt = currentWord.word;
    
    // Update pronunciation hint in status area
    const pronunciation = getPronunciationGuide(currentWord.word);
    const speechResult = document.querySelector('.speech-result');
    if (speechResult) {
        const firstParagraph = speechResult.querySelector('p:first-child');
        if (firstParagraph) {
            firstParagraph.innerHTML = 
                `Say: <strong>"${currentWord.word}"</strong> (sounds like "${pronunciation}")`;
        }
    }
}

// Helper function to show fallback text when image fails to load
function showFallbackText(currentWord, imageContainer) {
    wordImageElement.style.display = 'none';
    
    const fallbackText = document.createElement('div');
    fallbackText.className = 'fallback-text';
    
    // Create word and phonetic display
    const wordDisplay = document.createElement('div');
    wordDisplay.textContent = currentWord.word;
    wordDisplay.style.fontSize = '4rem';
    wordDisplay.style.color = currentWord.color;
    wordDisplay.style.fontWeight = 'bold';
    wordDisplay.style.marginBottom = '10px';
    
    const phoneticDisplay = document.createElement('div');
    phoneticDisplay.textContent = getPhoneticSymbol(currentWord.word);
    phoneticDisplay.style.fontSize = '2.5rem';
    phoneticDisplay.style.color = '#3366ff';
    phoneticDisplay.style.fontWeight = 'bold';
    phoneticDisplay.style.fontFamily = 'Arial, sans-serif';
    
    fallbackText.appendChild(wordDisplay);
    fallbackText.appendChild(phoneticDisplay);
    
    fallbackText.style.textAlign = 'center';
    fallbackText.style.width = '100%';
    fallbackText.style.height = '100%';
    fallbackText.style.display = 'flex';
    fallbackText.style.flexDirection = 'column';
    fallbackText.style.alignItems = 'center';
    fallbackText.style.justifyContent = 'center';
    fallbackText.style.background = '#f0f0f0';
    fallbackText.style.borderRadius = '15px';
    
    imageContainer.appendChild(fallbackText);
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
        
        // Auto-restart listening after skip (only once)
        if (gameState.isListening) {
            setTimeout(() => {
                if (gameState.recognition) {
                    gameState.recognition.start();
                }
            }, 500);
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
    
    if (gameState.isListening) {
        // Stop listening
        if (gameState.recognition) {
            gameState.recognition.stop();
        }
        gameState.isListening = false;
        updateStartButton();
        statusElement.className = 'status idle';
        statusElement.innerHTML = '<i class="fas fa-microphone-slash"></i> Listening stopped';
    } else {
        // Start listening with a fresh instance
        try {
            // 创建新的识别实例
            gameState.recognition = initSpeechRecognition();
            if (gameState.recognition) {
                gameState.recognition.start();
            }
        } catch (e) {
            console.log('Recognition start error:', e);
            statusElement.className = 'status idle';
            statusElement.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error starting microphone';
        }
    }
});

hintBtn.addEventListener('click', function() {
    clickSound.currentTime = 0;
    clickSound.play();
    
    const currentWord = wordList[gameState.currentWordIndex].word;
    
    // Use speech synthesis to pronounce the word
    if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(currentWord);
        utterance.lang = 'en-GB';
        utterance.rate = 0.8; // Slower rate for kids
        utterance.pitch = 1.2; // Slightly higher pitch for clarity
        
        // Try to find an English voice
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        if (englishVoice) {
            utterance.voice = englishVoice;
        }
        
        window.speechSynthesis.speak(utterance);
        
        // Update status to show hint was given
        statusElement.className = 'status idle';
        statusElement.innerHTML = `<i class="fas fa-volume-up"></i> Listen carefully!`;
    } else {
        // Fallback: just show the word
        statusElement.className = 'status idle';
        statusElement.innerHTML = `<i class="fas fa-volume-up"></i> Say: "${currentWord}"`;
    }
});

skipBtn.addEventListener('click', function() {
    clickSound.currentTime = 0;
    clickSound.play();
    
    // Skip without confirmation
    skipCurrentWord();
});

resetBtn.addEventListener('click', function() {
    clickSound.currentTime = 0;
    clickSound.play();
    
    if (confirm('Are you sure you want to reset the game?')) {
        initGame();
    }
});

backBtn.addEventListener('click', function() {
    clickSound.currentTime = 0;
    clickSound.play();
    window.location.href = 'index.html';
});

// Initialize the game when page loads
window.addEventListener('load', function() {
    // Pre-load speech synthesis voices
    if ('speechSynthesis' in window) {
        // Some browsers need a user interaction to load voices
        window.speechSynthesis.getVoices();
        // Also listen for when voices are loaded
        window.speechSynthesis.onvoiceschanged = function() {
            window.speechSynthesis.getVoices();
        };
    }
    
    initGame();
});

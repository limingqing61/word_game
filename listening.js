// Game data - words and local images (shared with main game)
// Only include words that have corresponding images in the images/ directory
const wordList = [
    // Fruits
    { word: "apple", image: "images/apple.jpeg", color: "#FF6B6B" },
    { word: "banana", image: "images/banana.jpeg", color: "#FFD166" },
    { word: "orange", image: "images/orange.jpeg", color: "#FF9800" },
    { word: "strawberry", image: "images/strawberry.jpeg", color: "#EF476F" },
    { word: "pear", image: "images/pear.jpeg", color: "#8BC34A" },
    { word: "peach", image: "images/peach.jpeg", color: "#FF8A65" },
    { word: "grape", image: "images/grape.jpeg", color: "#9C27B0" },
    { word: "watermelon", image: "images/watermelon.jpeg", color: "#4CAF50" },
    { word: "pineapple", image: "images/pineapple.jpeg", color: "#FF9800" },
    { word: "mango", image: "images/mango.jpeg", color: "#FFC107" },
    { word: "kiwi", image: "images/kiwi.jpeg", color: "#8BC34A" },
    { word: "lemon", image: "images/lemon.jpeg", color: "#FFEB3B" },
    { word: "cherry", image: "images/cherry.jpeg", color: "#F44336" },
    { word: "blueberry", image: "images/blueberry.jpeg", color: "#3F51B5" },
    { word: "coconut", image: "images/coconut.jpeg", color: "#795548" },
    { word: "avocado", image: "images/avocado.jpeg", color: "#4CAF50" },
    { word: "plum", image: "images/plum.jpeg", color: "#9C27B0" },
    { word: "apricot", image: "images/apricot.jpeg", color: "#FF9800" },
    { word: "grapefruit", image: "images/grapefruit.jpeg", color: "#FF5722" },
    { word: "pomegranate", image: "images/pomegranate.jpeg", color: "#F44336" },
    { word: "lychee", image: "images/lychee.jpeg", color: "#FF4081" },
    { word: "durian", image: "images/durian.jpeg", color: "#8BC34A" },
    { word: "cantaloupe", image: "images/cantaloupe.jpeg", color: "#FF9800" },
    // Vegetables
    { word: "tomato", image: "images/tomato.jpeg", color: "#F44336" },
    { word: "potato", image: "images/potato.jpeg", color: "#795548" },
    { word: "carrot", image: "images/carrot.jpeg", color: "#FF9800" },
    { word: "onion", image: "images/onion.jpeg", color: "#FFC107" },
    { word: "cabbage", image: "images/cabbage.jpeg", color: "#4CAF50" },
    { word: "lettuce", image: "images/lettuce.jpeg", color: "#8BC34A" },
    { word: "cucumber", image: "images/cucumber.jpeg", color: "#4CAF50" },
    { word: "pumpkin", image: "images/pumpkin.jpeg", color: "#FF9800" },
    { word: "broccoli", image: "images/broccoli.jpeg", color: "#4CAF50" },
    { word: "cauliflower", image: "images/cauliflower.jpeg", color: "#FFE082" },
    { word: "spinach", image: "images/spinach.jpeg", color: "#4CAF50" },
    { word: "eggplant", image: "images/eggplant.jpeg", color: "#9C27B0" },
    { word: "pepper", image: "images/pepper.jpeg", color: "#F44336" },
    { word: "chili", image: "images/chili.jpeg", color: "#F44336" },
    { word: "garlic", image: "images/garlic.jpeg", color: "#FFE082" },
    { word: "mushroom", image: "images/mushroom.jpeg", color: "#795548" },
    { word: "corn", image: "images/corn.jpeg", color: "#FFC107" },
    { word: "pea", image: "images/pea.jpeg", color: "#4CAF50" },
    { word: "radish", image: "images/radish.jpeg", color: "#F44336" },
    { word: "leek", image: "images/leek.jpeg", color: "#4CAF50" },
    { word: "asparagus", image: "images/asparagus.jpeg", color: "#4CAF50" },
    { word: "zucchini", image: "images/zucchini.jpeg", color: "#4CAF50" },
    // Animals
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
    { word: "rabbit", image: "images/rabbit.jpeg", color: "#FFE082" },
    { word: "monkey", image: "images/monkey.jpeg", color: "#795548" },
    { word: "panda", image: "images/panda.jpeg", color: "#212121" },
    { word: "bear", image: "images/bear.jpeg", color: "#795548" },
    { word: "tiger", image: "images/tiger.jpeg", color: "#FF9800" },
    { word: "giraffe", image: "images/giraffe.jpeg", color: "#FFC107" },
    { word: "zebra", image: "images/zebra.jpeg", color: "#212121" },
    { word: "deer", image: "images/deer.jpeg", color: "#795548" },
    { word: "kangaroo", image: "images/kangaroo.jpeg", color: "#795548" },
    { word: "snake", image: "images/snake.jpeg", color: "#4CAF50" },
    { word: "turtle", image: "images/turtle.jpeg", color: "#4CAF50" },
    { word: "frog", image: "images/frog.jpeg", color: "#4CAF50" },
    { word: "penguin", image: "images/penguin.jpeg", color: "#212121" },
    { word: "eagle", image: "images/eagle.jpeg", color: "#795548" },
    { word: "owl", image: "images/owl.jpeg", color: "#795548" },
    { word: "parrot", image: "images/parrot.jpeg", color: "#F44336" },
    { word: "crow", image: "images/crow.jpeg", color: "#212121" },
    { word: "swan", image: "images/swan.jpeg", color: "#FFFFFF" },
    { word: "butterfly", image: "images/butterfly.jpeg", color: "#E91E63" },
    { word: "bee", image: "images/bee.jpeg", color: "#FFC107" },
    { word: "ladybug", image: "images/ladybug.jpeg", color: "#F44336" },
    { word: "ant", image: "images/ant.jpeg", color: "#212121" },
    { word: "spider", image: "images/spider.jpeg", color: "#212121" },
    { word: "duck", image: "images/duck.jpeg", color: "#FFC107" },
    { word: "chicken", image: "images/chicken.jpeg", color: "#FFE082" },
    { word: "cow", image: "images/cow.jpeg", color: "#FFFFFF" },
    { word: "pig", image: "images/pig.jpeg", color: "#FF8A80" },
    { word: "horse", image: "images/horse.jpeg", color: "#795548" },
    { word: "sheep", image: "images/sheep.jpeg", color: "#FFFFFF" },
    { word: "goat", image: "images/goat.jpeg", color: "#9E9E9E" },
    { word: "hen", image: "images/hen.jpeg", color: "#FFE082" },
    { word: "squirrel", image: "images/squirrel.jpeg", color: "#795548" },
    { word: "hedgehog", image: "images/hedgehog.jpeg", color: "#795548" },
    { word: "camel", image: "images/camel.jpeg", color: "#FFC107" },
    // Body parts
    { word: "eye", image: "images/eye.jpeg", color: "#9C27B0" },
    { word: "nose", image: "images/nose.jpeg", color: "#FF8A65" },
    { word: "ear", image: "images/ear.jpeg", color: "#FFD166" },
    { word: "mouth", image: "images/mouth.jpeg", color: "#EF476F" },
    { word: "leg", image: "images/leg.jpeg", color: "#FF9800" },
    { word: "foot", image: "images/foot.jpeg", color: "#795548" },
    // Food & Drinks
    { word: "bread", image: "images/bread.jpeg", color: "#FFC107" },
    { word: "rice", image: "images/rice.jpeg", color: "#FFFFFF" },
    { word: "noodles", image: "images/noodles.jpeg", color: "#FFC107" },
    { word: "pizza", image: "images/pizza.jpeg", color: "#FF9800" },
    { word: "hamburger", image: "images/hamburger.jpeg", color: "#795548" },
    { word: "sandwich", image: "images/sandwich.jpeg", color: "#795548" },
    { word: "meat", image: "images/meat.jpeg", color: "#F44336" },
    { word: "cookie", image: "images/cookie.jpeg", color: "#795548" },
    { word: "candy", image: "images/candy.jpeg", color: "#E91E63" },
    { word: "chocolate", image: "images/chocolate.jpeg", color: "#795548" },
    { word: "cake", image: "images/cake.jpeg", color: "#FF8A65" },
    { word: "donut", image: "images/donut.jpeg", color: "#FF9800" },
    { word: "popcorn", image: "images/popcorn.jpeg", color: "#FFC107" },
    { word: "milk", image: "images/milk.jpeg", color: "#FFFFFF" },
    { word: "juice", image: "images/juice.jpeg", color: "#FF9800" },
    { word: "water", image: "images/water.jpeg", color: "#2196F3" },
    { word: "tea", image: "images/tea.jpeg", color: "#795548" },
    // Household items
    { word: "cup", image: "images/cup.jpeg", color: "#2196F3" },
    { word: "plate", image: "images/plate.jpeg", color: "#FFFFFF" },
    { word: "bowl", image: "images/bowl.jpeg", color: "#FFFFFF" },
    { word: "spoon", image: "images/spoon.jpeg", color: "#9E9E9E" },
    { word: "fork", image: "images/fork.jpeg", color: "#9E9E9E" },
    { word: "knife", image: "images/knife.jpeg", color: "#9E9E9E" },
    { word: "chopsticks", image: "images/chopsticks.jpeg", color: "#795548" },
    { word: "toothbrush", image: "images/toothbrush.jpeg", color: "#2196F3" },
    { word: "toothpaste", image: "images/toothpaste.jpeg", color: "#FFFFFF" },
    { word: "towel", image: "images/towel.jpeg", color: "#2196F3" },
    { word: "soap", image: "images/soap.jpeg", color: "#FFC107" },
    { word: "shampoo", image: "images/shampoo.jpeg", color: "#2196F3" },
    { word: "comb", image: "images/comb.jpeg", color: "#795548" },
    { word: "mirror", image: "images/mirror.jpeg", color: "#9E9E9E" },
    { word: "umbrella", image: "images/umbrella.jpeg", color: "#F44336" },
    { word: "clock", image: "images/clock.jpeg", color: "#795548" },
    { word: "lamp", image: "images/lamp.jpeg", color: "#FFC107" },
    { word: "phone", image: "images/phone.jpeg", color: "#212121" },
    { word: "computer", image: "images/computer.jpeg", color: "#212121" },
    { word: "television", image: "images/television.jpeg", color: "#212121" },
    { word: "remote", image: "images/remote.jpeg", color: "#212121" },
    { word: "battery", image: "images/battery.jpeg", color: "#F44336" },
    { word: "key", image: "images/key.jpeg", color: "#FFC107" },
    { word: "lock", image: "images/lock.jpeg", color: "#795548" },
    { word: "candle", image: "images/candle.jpeg", color: "#FFC107" },
    { word: "scissors", image: "images/scissors.jpeg", color: "#9E9E9E" },
    { word: "ruler", image: "images/ruler.jpeg", color: "#2196F3" },
    { word: "eraser", image: "images/eraser.jpeg", color: "#FFC107" },
    { word: "tape", image: "images/tape.jpeg", color: "#9E9E9E" },
    // Clothing
    { word: "shirt", image: "images/shirt.jpeg", color: "#2196F3" },
    { word: "skirt", image: "images/skirt.jpeg", color: "#E91E63" },
    { word: "dress", image: "images/dress.jpeg", color: "#E91E63" },
    { word: "shorts", image: "images/shorts.jpeg", color: "#2196F3" },
    { word: "jeans", image: "images/jeans.jpeg", color: "#3F51B5" },
    { word: "jacket", image: "images/jacket.jpeg", color: "#F44336" },
    { word: "coat", image: "images/coat.jpeg", color: "#795548" },
    { word: "sweater", image: "images/sweater.jpeg", color: "#F44336" },
    { word: "tie", image: "images/tie.jpeg", color: "#3F51B5" },
    { word: "hat", image: "images/hat.jpeg", color: "#795548" },
    { word: "cap", image: "images/cap.jpeg", color: "#F44336" },
    { word: "glove", image: "images/glove.jpeg", color: "#F44336" },
    { word: "sock", image: "images/sock.jpeg", color: "#FFFFFF" },
    { word: "shoe", image: "images/shoe.jpeg", color: "#795548" },
    { word: "boot", image: "images/boot.jpeg", color: "#795548" },
    { word: "slipper", image: "images/slipper.jpeg", color: "#FFC107" },
    { word: "belt", image: "images/belt.jpeg", color: "#795548" },
    { word: "scarf", image: "images/scarf.jpeg", color: "#F44336" },
    // Transportation
    { word: "car", image: "images/car.jpeg", color: "#FF6347" },
    { word: "bus", image: "images/bus.jpeg", color: "#FFC107" },
    { word: "train", image: "images/train.jpeg", color: "#F44336" },
    { word: "subway", image: "images/subway.jpeg", color: "#FF9800" },
    { word: "taxi", image: "images/taxi.jpeg", color: "#FFC107" },
    { word: "bicycle", image: "images/bicycle.jpeg", color: "#2196F3" },
    { word: "motorcycle", image: "images/motorcycle.jpeg", color: "#F44336" },
    { word: "plane", image: "images/plane.jpeg", color: "#2196F3" },
    { word: "ship", image: "images/ship.jpeg", color: "#2196F3" },
    { word: "boat", image: "images/boat.jpeg", color: "#795548" },
    { word: "truck", image: "images/truck.jpeg", color: "#F44336" },
    { word: "ambulance", image: "images/ambulance.jpeg", color: "#F44336" },
    { word: "helicopter", image: "images/helicopter.jpeg", color: "#F44336" },
    // Nature
    { word: "moon", image: "images/moon.jpeg", color: "#FFC107" },
    { word: "sky", image: "images/sky.jpeg", color: "#2196F3" },
    { word: "rainbow", image: "images/rainbow.jpeg", color: "#E91E63" },
    { word: "tree", image: "images/tree.jpeg", color: "#4CAF50" },
    { word: "leaf", image: "images/leaf.jpeg", color: "#4CAF50" },
    { word: "grass", image: "images/grass.jpeg", color: "#4CAF50" },
    { word: "mountain", image: "images/mountain.jpeg", color: "#795548" },
    { word: "sea", image: "images/sea.jpeg", color: "#2196F3" },
    { word: "star", image: "images/star.jpeg", color: "#FFC107" },
    { word: "cloud", image: "images/cloud.jpeg", color: "#FFFFFF" },
    { word: "rain", image: "images/rain.jpeg", color: "#2196F3" },
    { word: "snow", image: "images/snow.jpeg", color: "#FFFFFF" },
    { word: "wind", image: "images/wind.jpeg", color: "#9E9E9E" },
    { word: "thunder", image: "images/thunder.jpeg", color: "#FFC107" },
    { word: "lightning", image: "images/lightning.jpeg", color: "#FFC107" },
    { word: "fog", image: "images/fog.jpeg", color: "#9E9E9E" },
    { word: "river", image: "images/river.jpeg", color: "#2196F3" },
    { word: "lake", image: "images/lake.jpeg", color: "#2196F3" },
    // Original words
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
    hintRemaining: 5,
    totalQuestions: 30,
    wrongWords: []
};

// DOM elements
const correctCountElement = document.getElementById('correctCount');
const wrongCountElement = document.getElementById('wrongCount');
const progressCountElement = document.getElementById('progressCount');
const progressFillElement = document.getElementById('progressFill');
const questionContainer = document.getElementById('questionContainer');
const choicesGrid = document.getElementById('choicesGrid');
const repeatBtn = document.getElementById('repeatBtn');
const slowPlayBtn = document.getElementById('slowPlayBtn');
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
    gameState.hintRemaining = 5;
    gameState.wrongWords = [];
    
    // Select 30 random questions from the word list
    const allIndices = [...Array(wordList.length).keys()];
    const shuffledAll = shuffleArray(allIndices);
    const selectedIndices = shuffledAll.slice(0, Math.min(30, wordList.length));
    gameState.questionOrder = selectedIndices;
    gameState.totalQuestions = selectedIndices.length;
    
    // Show action buttons
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.style.display = 'flex';
    }
    
    // Update UI
    updateScoreDisplay();
    updateHintButton();
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

// Update hint button display
function updateHintButton() {
    hintBtn.textContent = `Hint (${gameState.hintRemaining})`;
    if (gameState.hintRemaining <= 0) {
        hintBtn.disabled = true;
    } else {
        hintBtn.disabled = false;
    }
}

// Show current question
function showQuestion() {
    if (gameState.currentQuestionIndex >= gameState.totalQuestions) {
        showGameComplete();
        return;
    }
    
    gameState.isAnswered = false;
    gameState.hintUsed = false;
    
    // Show action buttons
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.style.display = 'flex';
    }
    
    // Enable slow play button
    if (slowPlayBtn) {
        slowPlayBtn.disabled = false;
    }
    
    const wordIndex = gameState.questionOrder[gameState.currentQuestionIndex];
    const correctWord = wordList[wordIndex];
    
    // Show question mark
    questionContainer.innerHTML = '<div class="question-mark">?</div>';
    
    // Generate choices
    generateChoices(wordIndex);
    
    // Play the word pronunciation
    playWordPronunciation(correctWord.word);
    
    // Update progress and hint button
    updateScoreDisplay();
    updateHintButton();
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
    if (slowPlayBtn) {
        slowPlayBtn.disabled = true;
    }
    
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
        // Track wrong word
        const wrongWord = wordList[correctIndex];
        gameState.wrongWords.push(wrongWord);
        
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
    
    // Replace question mark with the correct image
    const correctWord = wordList[correctIndex];
    questionContainer.innerHTML = `
        <img src="${correctWord.image}" alt="${correctWord.word}" style="max-width:100%; max-height:100%; object-fit:contain;">
        <div class="word-text" style="position:absolute; bottom:0; left:0; right:0; background:rgba(255,204,0,0.9); padding:15px; text-align:center;">
            <span style="font-size:3rem; font-weight:bold; color:#ff3366; text-transform:uppercase;">${correctWord.word}</span>
            <div style="font-size:1.8rem; color:#3366ff; font-weight:bold;">${getPhoneticSymbol(correctWord.word)}</div>
        </div>
    `;
    
    // Update score
    updateScoreDisplay();
    
    // Auto advance to next question after delay
    setTimeout(() => {
        gameState.currentQuestionIndex++;
        showQuestion();
    }, 2000);
}

// Add phonetic symbols (IPA) - shared with main game
function getPhoneticSymbol(word) {
    const phonetics = {
        // Fruits
        'apple': '/ˈæp.əl/',
        'banana': '/bəˈnæn.ə/',
        'orange': '/ˈɔːr.ɪndʒ/',
        'strawberry': '/ˈstrɔː.ber.i/',
        'pear': '/pɛər/',
        'peach': '/piːtʃ/',
        'grape': '/ɡreɪp/',
        'watermelon': '/ˈwɔː.tər.mel.ən/',
        'pineapple': '/ˈpaɪn.æp.əl/',
        'mango': '/ˈmæŋ.ɡoʊ/',
        'kiwi': '/ˈkiː.wiː/',
        'lemon': '/ˈlem.ən/',
        'cherry': '/ˈtʃer.i/',
        'blueberry': '/ˈbluː.ber.i/',
        'coconut': '/ˈkoʊ.kə.nʌt/',
        'avocado': '/ˌæv.əˈkɑː.doʊ/',
        'plum': '/plʌm/',
        'apricot': '/ˈeɪ.prɪ.kɒt/',
        'grapefruit': '/ˈɡreɪp.fruːt/',
        'pomegranate': '/ˈpɒm.ɪ.ɡræn.ɪt/',
        'lychee': '/ˈliː.tʃiː/',
        'durian': '/ˈdʊr.i.ən/',
        'cantaloupe': '/ˈkæn.tə.luːp/',
        // Vegetables
        'tomato': '/təˈmeɪ.toʊ/',
        'potato': '/pəˈteɪ.toʊ/',
        'carrot': '/ˈkær.ət/',
        'onion': '/ˈʌn.jən/',
        'cabbage': '/ˈkæb.ɪdʒ/',
        'lettuce': '/ˈlet.ɪs/',
        'cucumber': '/ˈkjuː.kʌm.bər/',
        'pumpkin': '/ˈpʌmp.kɪn/',
        'broccoli': '/ˈbrɒk.əl.i/',
        'cauliflower': '/ˈkɒl.ɪ.flaʊ.ər/',
        'spinach': '/ˈspɪn.ɪtʃ/',
        'eggplant': '/ˈeɡ.plænt/',
        'pepper': '/ˈpep.ər/',
        'chili': '/ˈtʃɪl.i/',
        'garlic': '/ˈɡɑːr.lɪk/',
        'mushroom': '/ˈmʌʃ.ruːm/',
        'corn': '/kɔːrn/',
        'pea': '/piː/',
        'radish': '/ˈræd.ɪʃ/',
        'leek': '/liːk/',
        'asparagus': '/əˈspær.ə.ɡəs/',
        'zucchini': '/zuːˈkiː.ni/',
        // Animals
        'cat': '/kæt/',
        'dog': '/dɒɡ/',
        'fish': '/fɪʃ/',
        'bird': '/bɜːrd/',
        'lion': '/ˈlaɪ.ən/',
        'elephant': '/ˈel.ɪ.fənt/',
        'fox': '/fɒks/',
        'wolf': '/wʊlf/',
        'dolphin': '/ˈdɒl.fɪn/',
        'whale': '/weɪl/',
        'alligator': '/ˈæl.ɪ.ɡeɪ.tər/',
        'rabbit': '/ˈræb.ɪt/',
        'monkey': '/ˈmʌŋ.ki/',
        'panda': '/ˈpæn.də/',
        'bear': '/bɛər/',
        'tiger': '/ˈtaɪ.ɡər/',
        'giraffe': '/dʒɪˈræf/',
        'zebra': '/ˈziː.brə/',
        'deer': '/dɪər/',
        'kangaroo': '/ˌkæŋ.ɡəˈruː/',
        'snake': '/sneɪk/',
        'turtle': '/ˈtɜːr.təl/',
        'frog': '/frɒɡ/',
        'penguin': '/ˈpeŋ.ɡwɪn/',
        'eagle': '/ˈiː.ɡəl/',
        'owl': '/aʊl/',
        'parrot': '/ˈpær.ət/',
        'crow': '/kroʊ/',
        'swan': '/swɒn/',
        'butterfly': '/ˈbʌt.ər.flaɪ/',
        'bee': '/biː/',
        'ladybug': '/ˈleɪ.di.bʌɡ/',
        'ant': '/ænt/',
        'spider': '/ˈspaɪ.dər/',
        'duck': '/dʌk/',
        'chicken': '/ˈtʃɪk.ɪn/',
        'cow': '/kaʊ/',
        'pig': '/pɪɡ/',
        'horse': '/hɔːrs/',
        'sheep': '/ʃiːp/',
        'goat': '/ɡoʊt/',
        'hen': '/hen/',
        'squirrel': '/ˈskwɜːr.əl/',
        'hedgehog': '/ˈhedʒ.hɒɡ/',
        'camel': '/ˈkæm.əl/',
        // Body parts
        'eye': '/aɪ/',
        'nose': '/noʊz/',
        'ear': '/ɪər/',
        'mouth': '/maʊθ/',
        'leg': '/leɡ/',
        'foot': '/fʊt/',
        // Food & Drinks
        'bread': '/bred/',
        'rice': '/raɪs/',
        'noodles': '/ˈnuː.dəlz/',
        'pizza': '/ˈpiːt.sə/',
        'hamburger': '/ˈhæm.bɜːr.ɡər/',
        'sandwich': '/ˈsænd.wɪtʃ/',
        'meat': '/miːt/',
        'cookie': '/ˈkʊk.i/',
        'candy': '/ˈkæn.di/',
        'chocolate': '/ˈtʃɒk.lət/',
        'cake': '/keɪk/',
        'donut': '/ˈdoʊ.nʌt/',
        'popcorn': '/ˈpɒp.kɔːrn/',
        'milk': '/mɪlk/',
        'juice': '/dʒuːs/',
        'water': '/ˈwɔː.tər/',
        'tea': '/tiː/',
        // Household items
        'cup': '/kʌp/',
        'plate': '/pleɪt/',
        'bowl': '/boʊl/',
        'spoon': '/spuːn/',
        'fork': '/fɔːrk/',
        'knife': '/naɪf/',
        'chopsticks': '/ˈtʃɒp.stɪks/',
        'toothbrush': '/ˈtuːθ.brʌʃ/',
        'toothpaste': '/ˈtuːθ.peɪst/',
        'towel': '/ˈtaʊ.əl/',
        'soap': '/soʊp/',
        'shampoo': '/ʃæmˈpuː/',
        'comb': '/koʊm/',
        'mirror': '/ˈmɪr.ər/',
        'umbrella': '/ʌmˈbrel.ə/',
        'clock': '/klɒk/',
        'lamp': '/læmp/',
        'phone': '/foʊn/',
        'computer': '/kəmˈpjuː.tər/',
        'television': '/ˈtel.ɪ.vɪʒ.ən/',
        'remote': '/rɪˈmoʊt/',
        'battery': '/ˈbæt.ər.i/',
        'key': '/kiː/',
        'lock': '/lɒk/',
        'candle': '/ˈkæn.dəl/',
        'scissors': '/ˈsɪz.ərz/',
        'ruler': '/ˈruː.lər/',
        'eraser': '/ɪˈreɪ.zər/',
        'tape': '/teɪp/',
        // Clothing
        'shirt': '/ʃɜːrt/',
        'skirt': '/skɜːrt/',
        'dress': '/dres/',
        'shorts': '/ʃɔːrts/',
        'jeans': '/dʒiːnz/',
        'jacket': '/ˈdʒæk.ɪt/',
        'coat': '/koʊt/',
        'sweater': '/ˈswet.ər/',
        'tie': '/taɪ/',
        'hat': '/hæt/',
        'cap': '/kæp/',
        'glove': '/ɡlʌv/',
        'sock': '/sɒk/',
        'shoe': '/ʃuː/',
        'boot': '/buːt/',
        'slipper': '/ˈslɪp.ər/',
        'belt': '/belt/',
        'scarf': '/skɑːrf/',
        // Transportation
        'car': '/kɑːr/',
        'bus': '/bʌs/',
        'train': '/treɪn/',
        'subway': '/ˈsʌb.weɪ/',
        'taxi': '/ˈtæk.si/',
        'bicycle': '/ˈbaɪ.sɪ.kəl/',
        'motorcycle': '/ˈmoʊ.tər.saɪ.kəl/',
        'plane': '/pleɪn/',
        'ship': '/ʃɪp/',
        'boat': '/boʊt/',
        'truck': '/trʌk/',
        'ambulance': '/ˈæm.bjə.ləns/',
        'helicopter': '/ˈhel.ɪ.kɒp.tər/',
        // Nature
        'moon': '/muːn/',
        'sky': '/skaɪ/',
        'rainbow': '/ˈreɪn.boʊ/',
        'tree': '/triː/',
        'leaf': '/liːf/',
        'grass': '/ɡræs/',
        'mountain': '/ˈmaʊn.tɪn/',
        'sea': '/siː/',
        'star': '/stɑːr/',
        'cloud': '/klaʊd/',
        'rain': '/reɪn/',
        'snow': '/snoʊ/',
        'wind': '/wɪnd/',
        'thunder': '/ˈθʌn.dər/',
        'lightning': '/ˈlaɪt.nɪŋ/',
        'fog': '/fɒɡ/',
        'river': '/ˈrɪv.ər/',
        'lake': '/leɪk/',
        // Original words
        'egg': '/eɡ/',
        'house': '/haʊs/',
        'flower': '/ˈflaʊ.ər/',
        'ball': '/bɔːl/',
        'sun': '/sʌn/'
    };
    return phonetics[word.toLowerCase()] || `/${word.toLowerCase()}/`;
}

// Play word pronunciation using speech synthesis
function playWordPronunciation(word, rate) {
    if (rate === undefined) {
        rate = 0.7;
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = rate; // Slower for kids
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
    
    // Hide action buttons
    const actionButtons = document.querySelector('.action-buttons');
    if (actionButtons) {
        actionButtons.style.display = 'none';
    }
    
    let wrongWordsHtml = '';
    if (gameState.wrongWords.length > 0) {
        wrongWordsHtml = `
            <div class="wrong-words-section">
                <h3><i class="fas fa-book"></i> Words to Review (${gameState.wrongWords.length})</h3>
                <div class="wrong-words-list">
                    ${gameState.wrongWords.map(w => `
                        <div class="wrong-word-item" onclick="playWordPronunciation('${w.word}')">
                            <img src="${w.image}" alt="${w.word}" style="width:60px; height:60px; object-fit:contain; border-radius:10px;">
                            <span>${w.word}</span>
                            <i class="fas fa-volume-up" style="color:#2196F3; font-size:1.5rem;"></i>
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
            <span class="wrong">Wrong: ${gameState.wrongCount}</span>
        </div>
        ${wrongWordsHtml}
        <button id="playAgainBtn" class="repeat-btn">
            <i class="fas fa-redo"></i> Play Again
        </button>
        <button id="backToMenuBtn" class="back-btn">
            <i class="fas fa-arrow-left"></i> Back to Menu
        </button>
    `;
    
    questionContainer.appendChild(completeDiv);
    
    document.getElementById('playAgainBtn').addEventListener('click', function() {
        // Show action buttons again
        if (actionButtons) {
            actionButtons.style.display = 'flex';
        }
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

slowPlayBtn.addEventListener('click', function() {
    if (gameState.currentQuestionIndex < gameState.totalQuestions) {
        const wordIndex = gameState.questionOrder[gameState.currentQuestionIndex];
        const word = wordList[wordIndex].word;
        playWordPronunciation(word, 0.6);
    }
});

hintBtn.addEventListener('click', function() {
    if (gameState.isAnswered || gameState.hintUsed || gameState.hintRemaining <= 0) return;
    
    gameState.hintUsed = true;
    gameState.hintRemaining--;
    updateHintButton();
    
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

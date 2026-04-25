// Game data - words and local images
// Only include words that have corresponding images in the images/ directory
const wordList = [
    // Fruits
    { word: "apple", image: "images/apple.jpeg", color: "#FF6B6B", chinese: "苹果" },
    { word: "banana", image: "images/banana.jpeg", color: "#FFD166", chinese: "香蕉" },
    { word: "orange", image: "images/orange.jpeg", color: "#FF9800", chinese: "橙子" },
    { word: "strawberry", image: "images/strawberry.jpeg", color: "#EF476F", chinese: "草莓" },
    { word: "pear", image: "images/pear.jpeg", color: "#8BC34A", chinese: "梨" },
    { word: "peach", image: "images/peach.jpeg", color: "#FF8A65", chinese: "桃子" },
    { word: "grape", image: "images/grape.jpeg", color: "#9C27B0", chinese: "葡萄" },
    { word: "watermelon", image: "images/watermelon.jpeg", color: "#4CAF50", chinese: "西瓜" },
    { word: "pineapple", image: "images/pineapple.jpeg", color: "#FF9800", chinese: "菠萝" },
    { word: "mango", image: "images/mango.jpeg", color: "#FFC107", chinese: "芒果" },
    { word: "kiwi", image: "images/kiwi.jpeg", color: "#8BC34A", chinese: "猕猴桃" },
    { word: "lemon", image: "images/lemon.jpeg", color: "#FFEB3B", chinese: "柠檬" },
    { word: "cherry", image: "images/cherry.jpeg", color: "#F44336", chinese: "樱桃" },
    { word: "blueberry", image: "images/blueberry.jpeg", color: "#3F51B5", chinese: "蓝莓" },
    { word: "coconut", image: "images/coconut.jpeg", color: "#795548", chinese: "椰子" },
    { word: "avocado", image: "images/avocado.jpeg", color: "#4CAF50", chinese: "牛油果" },
    { word: "plum", image: "images/plum.jpeg", color: "#9C27B0", chinese: "李子" },
    { word: "apricot", image: "images/apricot.jpeg", color: "#FF9800", chinese: "杏" },
    { word: "grapefruit", image: "images/grapefruit.jpeg", color: "#FF5722", chinese: "西柚" },
    { word: "pomegranate", image: "images/pomegranate.jpeg", color: "#F44336", chinese: "石榴" },
    { word: "lychee", image: "images/lychee.jpeg", color: "#FF4081", chinese: "荔枝" },
    { word: "durian", image: "images/durian.jpeg", color: "#8BC34A", chinese: "榴莲" },
    { word: "cantaloupe", image: "images/cantaloupe.jpeg", color: "#FF9800", chinese: "哈密瓜" },
    // Vegetables
    { word: "tomato", image: "images/tomato.jpeg", color: "#F44336", chinese: "番茄" },
    { word: "potato", image: "images/potato.jpeg", color: "#795548", chinese: "土豆" },
    { word: "carrot", image: "images/carrot.jpeg", color: "#FF9800", chinese: "胡萝卜" },
    { word: "onion", image: "images/onion.jpeg", color: "#FFC107", chinese: "洋葱" },
    { word: "cabbage", image: "images/cabbage.jpeg", color: "#4CAF50", chinese: "卷心菜" },
    { word: "lettuce", image: "images/lettuce.jpeg", color: "#8BC34A", chinese: "生菜" },
    { word: "cucumber", image: "images/cucumber.jpeg", color: "#4CAF50", chinese: "黄瓜" },
    { word: "pumpkin", image: "images/pumpkin.jpeg", color: "#FF9800", chinese: "南瓜" },
    { word: "broccoli", image: "images/broccoli.jpeg", color: "#4CAF50", chinese: "西兰花" },
    { word: "cauliflower", image: "images/cauliflower.jpeg", color: "#FFE082", chinese: "花椰菜" },
    { word: "spinach", image: "images/spinach.jpeg", color: "#4CAF50", chinese: "菠菜" },
    { word: "eggplant", image: "images/eggplant.jpeg", color: "#9C27B0", chinese: "茄子" },
    { word: "pepper", image: "images/pepper.jpeg", color: "#F44336", chinese: "辣椒" },
    { word: "chili", image: "images/chili.jpeg", color: "#F44336", chinese: "辣椒" },
    { word: "garlic", image: "images/garlic.jpeg", color: "#FFE082", chinese: "大蒜" },
    { word: "mushroom", image: "images/mushroom.jpeg", color: "#795548", chinese: "蘑菇" },
    { word: "corn", image: "images/corn.jpeg", color: "#FFC107", chinese: "玉米" },
    { word: "pea", image: "images/pea.jpeg", color: "#4CAF50", chinese: "豌豆" },
    { word: "radish", image: "images/radish.jpeg", color: "#F44336", chinese: "萝卜" },
    { word: "leek", image: "images/leek.jpeg", color: "#4CAF50", chinese: "韭菜" },
    { word: "asparagus", image: "images/asparagus.jpeg", color: "#4CAF50", chinese: "芦笋" },
    { word: "zucchini", image: "images/zucchini.jpeg", color: "#4CAF50", chinese: "西葫芦" },
    // Animals
    { word: "cat", image: "images/cat.jpeg", color: "#FFD166", chinese: "猫" },
    { word: "dog", image: "images/dog.jpeg", color: "#06D6A0", chinese: "狗" },
    { word: "fish", image: "images/fish.jpeg", color: "#2196F3", chinese: "鱼" },
    { word: "bird", image: "images/bird.jpeg", color: "#FF9800", chinese: "鸟" },
    { word: "lion", image: "images/lion.jpeg", color: "#FF9800", chinese: "狮子" },
    { word: "elephant", image: "images/elephant.jpeg", color: "#9E9E9E", chinese: "大象" },
    { word: "fox", image: "images/fox.jpeg", color: "#FF9800", chinese: "狐狸" },
    { word: "wolf", image: "images/wolf.jpeg", color: "#9E9E9E", chinese: "狼" },
    { word: "dolphin", image: "images/dolphin.jpeg", color: "#2196F3", chinese: "海豚" },
    { word: "whale", image: "images/whale.jpeg", color: "#2196F3", chinese: "鲸鱼" },
    { word: "alligator", image: "images/alligator.jpeg", color: "#4CAF50", chinese: "短吻鳄" },
    { word: "rabbit", image: "images/rabbit.jpeg", color: "#FFE082", chinese: "兔子" },
    { word: "monkey", image: "images/monkey.jpeg", color: "#795548", chinese: "猴子" },
    { word: "panda", image: "images/panda.jpeg", color: "#212121", chinese: "熊猫" },
    { word: "bear", image: "images/bear.jpeg", color: "#795548", chinese: "熊" },
    { word: "tiger", image: "images/tiger.jpeg", color: "#FF9800", chinese: "老虎" },
    { word: "giraffe", image: "images/giraffe.jpeg", color: "#FFC107", chinese: "长颈鹿" },
    { word: "zebra", image: "images/zebra.jpeg", color: "#212121", chinese: "斑马" },
    { word: "deer", image: "images/deer.jpeg", color: "#795548", chinese: "鹿" },
    { word: "kangaroo", image: "images/kangaroo.jpeg", color: "#795548", chinese: "袋鼠" },
    { word: "snake", image: "images/snake.jpeg", color: "#4CAF50", chinese: "蛇" },
    { word: "turtle", image: "images/turtle.jpeg", color: "#4CAF50", chinese: "乌龟" },
    { word: "frog", image: "images/frog.jpeg", color: "#4CAF50", chinese: "青蛙" },
    { word: "penguin", image: "images/penguin.jpeg", color: "#212121", chinese: "企鹅" },
    { word: "eagle", image: "images/eagle.jpeg", color: "#795548", chinese: "鹰" },
    { word: "owl", image: "images/owl.jpeg", color: "#795548", chinese: "猫头鹰" },
    { word: "parrot", image: "images/parrot.jpeg", color: "#F44336", chinese: "鹦鹉" },
    { word: "crow", image: "images/crow.jpeg", color: "#212121", chinese: "乌鸦" },
    { word: "swan", image: "images/swan.jpeg", color: "#FFFFFF", chinese: "天鹅" },
    { word: "butterfly", image: "images/butterfly.jpeg", color: "#E91E63", chinese: "蝴蝶" },
    { word: "bee", image: "images/bee.jpeg", color: "#FFC107", chinese: "蜜蜂" },
    { word: "ladybug", image: "images/ladybug.jpeg", color: "#F44336", chinese: "瓢虫" },
    { word: "ant", image: "images/ant.jpeg", color: "#212121", chinese: "蚂蚁" },
    { word: "spider", image: "images/spider.jpeg", color: "#212121", chinese: "蜘蛛" },
    { word: "duck", image: "images/duck.jpeg", color: "#FFC107", chinese: "鸭子" },
    { word: "chicken", image: "images/chicken.jpeg", color: "#FFE082", chinese: "鸡" },
    { word: "cow", image: "images/cow.jpeg", color: "#FFFFFF", chinese: "牛" },
    { word: "pig", image: "images/pig.jpeg", color: "#FF8A80", chinese: "猪" },
    { word: "horse", image: "images/horse.jpeg", color: "#795548", chinese: "马" },
    { word: "sheep", image: "images/sheep.jpeg", color: "#FFFFFF", chinese: "羊" },
    { word: "goat", image: "images/goat.jpeg", color: "#9E9E9E", chinese: "山羊" },
    { word: "hen", image: "images/hen.jpeg", color: "#FFE082", chinese: "母鸡" },
    { word: "squirrel", image: "images/squirrel.jpeg", color: "#795548", chinese: "松鼠" },
    { word: "hedgehog", image: "images/hedgehog.jpeg", color: "#795548", chinese: "刺猬" },
    { word: "camel", image: "images/camel.jpeg", color: "#FFC107", chinese: "骆驼" },
    // Body parts
    { word: "eye", image: "images/eye.jpeg", color: "#9C27B0", chinese: "眼睛" },
    { word: "nose", image: "images/nose.jpeg", color: "#FF8A65", chinese: "鼻子" },
    { word: "ear", image: "images/ear.jpeg", color: "#FFD166", chinese: "耳朵" },
    { word: "mouth", image: "images/mouth.jpeg", color: "#EF476F", chinese: "嘴巴" },
    { word: "leg", image: "images/leg.jpeg", color: "#FF9800", chinese: "腿" },
    { word: "foot", image: "images/foot.jpeg", color: "#795548", chinese: "脚" },
    // Food & Drinks
    { word: "bread", image: "images/bread.jpeg", color: "#FFC107", chinese: "面包" },
    { word: "rice", image: "images/rice.jpeg", color: "#FFFFFF", chinese: "米饭" },
    { word: "noodles", image: "images/noodles.jpeg", color: "#FFC107", chinese: "面条" },
    { word: "pizza", image: "images/pizza.jpeg", color: "#FF9800", chinese: "披萨" },
    { word: "hamburger", image: "images/hamburger.jpeg", color: "#795548", chinese: "汉堡" },
    { word: "sandwich", image: "images/sandwich.jpeg", color: "#795548", chinese: "三明治" },
    { word: "meat", image: "images/meat.jpeg", color: "#F44336", chinese: "肉" },
    { word: "cookie", image: "images/cookie.jpeg", color: "#795548", chinese: "饼干" },
    { word: "candy", image: "images/candy.jpeg", color: "#E91E63", chinese: "糖果" },
    { word: "chocolate", image: "images/chocolate.jpeg", color: "#795548", chinese: "巧克力" },
    { word: "cake", image: "images/cake.jpeg", color: "#FF8A65", chinese: "蛋糕" },
    { word: "donut", image: "images/donut.jpeg", color: "#FF9800", chinese: "甜甜圈" },
    { word: "popcorn", image: "images/popcorn.jpeg", color: "#FFC107", chinese: "爆米花" },
    { word: "milk", image: "images/milk.jpeg", color: "#FFFFFF", chinese: "牛奶" },
    { word: "juice", image: "images/juice.jpeg", color: "#FF9800", chinese: "果汁" },
    { word: "water", image: "images/water.jpeg", color: "#2196F3", chinese: "水" },
    { word: "tea", image: "images/tea.jpeg", color: "#795548", chinese: "茶" },
    // Household items
    { word: "cup", image: "images/cup.jpeg", color: "#2196F3", chinese: "杯子" },
    { word: "plate", image: "images/plate.jpeg", color: "#FFFFFF", chinese: "盘子" },
    { word: "bowl", image: "images/bowl.jpeg", color: "#FFFFFF", chinese: "碗" },
    { word: "spoon", image: "images/spoon.jpeg", color: "#9E9E9E", chinese: "勺子" },
    { word: "fork", image: "images/fork.jpeg", color: "#9E9E9E", chinese: "叉子" },
    { word: "knife", image: "images/knife.jpeg", color: "#9E9E9E", chinese: "刀" },
    { word: "chopsticks", image: "images/chopsticks.jpeg", color: "#795548", chinese: "筷子" },
    { word: "toothbrush", image: "images/toothbrush.jpeg", color: "#2196F3", chinese: "牙刷" },
    { word: "toothpaste", image: "images/toothpaste.jpeg", color: "#FFFFFF", chinese: "牙膏" },
    { word: "towel", image: "images/towel.jpeg", color: "#2196F3", chinese: "毛巾" },
    { word: "soap", image: "images/soap.jpeg", color: "#FFC107", chinese: "肥皂" },
    { word: "shampoo", image: "images/shampoo.jpeg", color: "#2196F3", chinese: "洗发水" },
    { word: "comb", image: "images/comb.jpeg", color: "#795548", chinese: "梳子" },
    { word: "mirror", image: "images/mirror.jpeg", color: "#9E9E9E", chinese: "镜子" },
    { word: "umbrella", image: "images/umbrella.jpeg", color: "#F44336", chinese: "雨伞" },
    { word: "clock", image: "images/clock.jpeg", color: "#795548", chinese: "时钟" },
    { word: "lamp", image: "images/lamp.jpeg", color: "#FFC107", chinese: "台灯" },
    { word: "phone", image: "images/phone.jpeg", color: "#212121", chinese: "电话" },
    { word: "computer", image: "images/computer.jpeg", color: "#212121", chinese: "电脑" },
    { word: "television", image: "images/television.jpeg", color: "#212121", chinese: "电视" },
    { word: "remote", image: "images/remote.jpeg", color: "#212121", chinese: "遥控器" },
    { word: "battery", image: "images/battery.jpeg", color: "#F44336", chinese: "电池" },
    { word: "key", image: "images/key.jpeg", color: "#FFC107", chinese: "钥匙" },
    { word: "lock", image: "images/lock.jpeg", color: "#795548", chinese: "锁" },
    { word: "candle", image: "images/candle.jpeg", color: "#FFC107", chinese: "蜡烛" },
    { word: "scissors", image: "images/scissors.jpeg", color: "#9E9E9E", chinese: "剪刀" },
    { word: "ruler", image: "images/ruler.jpeg", color: "#2196F3", chinese: "尺子" },
    { word: "eraser", image: "images/eraser.jpeg", color: "#FFC107", chinese: "橡皮" },
    { word: "tape", image: "images/tape.jpeg", color: "#9E9E9E", chinese: "胶带" },
    // Clothing
    { word: "shirt", image: "images/shirt.jpeg", color: "#2196F3", chinese: "衬衫" },
    { word: "skirt", image: "images/skirt.jpeg", color: "#E91E63", chinese: "裙子" },
    { word: "dress", image: "images/dress.jpeg", color: "#E91E63", chinese: "连衣裙" },
    { word: "shorts", image: "images/shorts.jpeg", color: "#2196F3", chinese: "短裤" },
    { word: "jeans", image: "images/jeans.jpeg", color: "#3F51B5", chinese: "牛仔裤" },
    { word: "jacket", image: "images/jacket.jpeg", color: "#F44336", chinese: "夹克" },
    { word: "coat", image: "images/coat.jpeg", color: "#795548", chinese: "外套" },
    { word: "sweater", image: "images/sweater.jpeg", color: "#F44336", chinese: "毛衣" },
    { word: "tie", image: "images/tie.jpeg", color: "#3F51B5", chinese: "领带" },
    { word: "hat", image: "images/hat.jpeg", color: "#795548", chinese: "帽子" },
    { word: "cap", image: "images/cap.jpeg", color: "#F44336", chinese: "鸭舌帽" },
    { word: "glove", image: "images/glove.jpeg", color: "#F44336", chinese: "手套" },
    { word: "sock", image: "images/sock.jpeg", color: "#FFFFFF", chinese: "袜子" },
    { word: "shoe", image: "images/shoe.jpeg", color: "#795548", chinese: "鞋子" },
    { word: "boot", image: "images/boot.jpeg", color: "#795548", chinese: "靴子" },
    { word: "slipper", image: "images/slipper.jpeg", color: "#FFC107", chinese: "拖鞋" },
    { word: "belt", image: "images/belt.jpeg", color: "#795548", chinese: "皮带" },
    { word: "scarf", image: "images/scarf.jpeg", color: "#F44336", chinese: "围巾" },
    // Transportation
    { word: "car", image: "images/car.jpeg", color: "#FF6347", chinese: "汽车" },
    { word: "bus", image: "images/bus.jpeg", color: "#FFC107", chinese: "公共汽车" },
    { word: "train", image: "images/train.jpeg", color: "#F44336", chinese: "火车" },
    { word: "subway", image: "images/subway.jpeg", color: "#FF9800", chinese: "地铁" },
    { word: "taxi", image: "images/taxi.jpeg", color: "#FFC107", chinese: "出租车" },
    { word: "bicycle", image: "images/bicycle.jpeg", color: "#2196F3", chinese: "自行车" },
    { word: "motorcycle", image: "images/motorcycle.jpeg", color: "#F44336", chinese: "摩托车" },
    { word: "plane", image: "images/plane.jpeg", color: "#2196F3", chinese: "飞机" },
    { word: "ship", image: "images/ship.jpeg", color: "#2196F3", chinese: "轮船" },
    { word: "boat", image: "images/boat.jpeg", color: "#795548", chinese: "小船" },
    { word: "truck", image: "images/truck.jpeg", color: "#F44336", chinese: "卡车" },
    { word: "ambulance", image: "images/ambulance.jpeg", color: "#F44336", chinese: "救护车" },
    { word: "helicopter", image: "images/helicopter.jpeg", color: "#F44336", chinese: "直升机" },
    // Nature
    { word: "moon", image: "images/moon.jpeg", color: "#FFC107", chinese: "月亮" },
    { word: "sky", image: "images/sky.jpeg", color: "#2196F3", chinese: "天空" },
    { word: "rainbow", image: "images/rainbow.jpeg", color: "#E91E63", chinese: "彩虹" },
    { word: "tree", image: "images/tree.jpeg", color: "#4CAF50", chinese: "树" },
    { word: "leaf", image: "images/leaf.jpeg", color: "#4CAF50", chinese: "叶子" },
    { word: "grass", image: "images/grass.jpeg", color: "#4CAF50", chinese: "草" },
    { word: "mountain", image: "images/mountain.jpeg", color: "#795548", chinese: "山" },
    { word: "sea", image: "images/sea.jpeg", color: "#2196F3", chinese: "大海" },
    { word: "star", image: "images/star.jpeg", color: "#FFC107", chinese: "星星" },
    { word: "cloud", image: "images/cloud.jpeg", color: "#FFFFFF", chinese: "云" },
    { word: "rain", image: "images/rain.jpeg", color: "#2196F3", chinese: "雨" },
    { word: "snow", image: "images/snow.jpeg", color: "#FFFFFF", chinese: "雪" },
    { word: "wind", image: "images/wind.jpeg", color: "#9E9E9E", chinese: "风" },
    { word: "thunder", image: "images/thunder.jpeg", color: "#FFC107", chinese: "雷" },
    { word: "lightning", image: "images/lightning.jpeg", color: "#FFC107", chinese: "闪电" },
    { word: "fog", image: "images/fog.jpeg", color: "#9E9E9E", chinese: "雾" },
    { word: "river", image: "images/river.jpeg", color: "#2196F3", chinese: "河流" },
    { word: "lake", image: "images/lake.jpeg", color: "#2196F3", chinese: "湖" },
    // Original words
    { word: "egg", image: "images/egg.jpeg", color: "#FFE082", chinese: "鸡蛋" },
    { word: "house", image: "images/house.jpeg", color: "#FF8A65", chinese: "房子" },
    { word: "flower", image: "images/flower.jpeg", color: "#E91E63", chinese: "花" },
    { word: "ball", image: "images/ball.jpeg", color: "#4ECDC4", chinese: "球" },
    { word: "sun", image: "images/sun.jpeg", color: "#FFD700", chinese: "太阳" },
    { word: "crybaby", image: "images/crybaby.jpeg", color: "#FF6B6B", chinese: "爱哭鬼" },
    { word: "brother", image: "images/brother.jpeg", color: "#2196F3", chinese: "兄弟" },
    { word: "hero", image: "images/hero.jpeg", color: "#FF9800", chinese: "英雄" }
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
        'apple': 'AP-pul',
        'banana': 'buh-NA-nuh',
        'orange': 'OR-inj',
        'strawberry': 'STRAW-ber-ee',
        'cat': 'KAT',
        'dog': 'DAWG',
        'fish': 'FISH',
        'bird': 'BURD',
        'lion': 'LY-on',
        'elephant': 'EL-uh-funt',
        'fox': 'FAHKS',
        'wolf': 'WUULF',
        'dolphin': 'DAHL-fin',
        'whale': 'WAYL',
        'alligator': 'AL-uh-gay-ter',
        'eye': 'EYE',
        'nose': 'NOHZ',
        'ear': 'EER',
        'mouth': 'MOWTH',
        'leg': 'LEG',
        'foot': 'FUUT',
        'car': 'KAR',
        'egg': 'EG',
        'house': 'HOWSS',
        'flower': 'FLOW-er'
    };
    return guides[word.toLowerCase()] || word;
}

// Add phonetic symbols (IPA)
function getPhoneticSymbol(word) {
    const phonetics = {
        'apple': '/ˈæp.əl/',
        'banana': '/bəˈnæn.ə/',
        'orange': '/ˈɔːr.ɪndʒ/',
        'strawberry': '/ˈstrɔː.ber.i/',
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
        'eye': '/aɪ/',
        'nose': '/noʊz/',
        'ear': '/ɪər/',
        'mouth': '/maʊθ/',
        'leg': '/leɡ/',
        'foot': '/fʊt/',
        'car': '/kɑːr/',
        'egg': '/eɡ/',
        'house': '/haʊs/',
        'flower': '/ˈflaʊ.ər/',
        'ball': '/bɔːl/',
        'sun': '/sʌn/',
        'crybaby': '/ˈkraɪ.beɪ.bi/',
        'brother': '/ˈbrʌð.ər/',
        'hero': '/ˈhɪr.oʊ/'
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
        utterance.lang = 'en-US';
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

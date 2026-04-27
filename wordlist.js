// Word list data (same as listening.js)
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
    { word: "brother", image: "images/brother.jpeg", color: "#2196F3", chinese: "兄弟" },
    { word: "mother", image: "images/mother.jpeg", color: "#E91E63", chinese: "母亲" },
    { word: "father", image: "images/father.jpeg", color: "#2196F3", chinese: "父亲" },
    { word: "grandpa", image: "images/grandpa.jpeg", color: "#795548", chinese: "爷爷" },
    { word: "grandma", image: "images/grandma.jpeg", color: "#795548", chinese: "奶奶" },
    { word: "uncle", image: "images/uncle.jpeg", color: "#FF9800", chinese: "叔叔" },
    { word: "aunt", image: "images/aunt.jpeg", color: "#FF9800", chinese: "阿姨" },
    { word: "sister", image: "images/sister.jpeg", color: "#E91E63", chinese: "姐妹" },
    { word: "family", image: "images/family.jpeg", color: "#E91E63", chinese: "家庭" }
];

// Phonetic symbols (same as listening.js)
function getPhoneticSymbol(word) {
    const phonetics = {
        // Fruits
        'apple': '/ˈæp.əl/',
        'banana': '/bəˈnɑː.nə/',
        'orange': '/ˈɒr.ɪndʒ/',
        'strawberry': '/ˈstrɔː.bər.i/',
        'pear': '/pɛə/',
        'peach': '/piːtʃ/',
        'grape': '/ɡreɪp/',
        'watermelon': '/ˈwɔː.tə.mel.ən/',
        'pineapple': '/ˈpaɪn.æp.əl/',
        'mango': '/ˈmæŋ.ɡəʊ/',
        'kiwi': '/ˈkiː.wiː/',
        'lemon': '/ˈlem.ən/',
        'cherry': '/ˈtʃer.i/',
        'blueberry': '/ˈbluː.bər.i/',
        'coconut': '/ˈkəʊ.kə.nʌt/',
        'avocado': '/ˌæv.əˈkɑː.dəʊ/',
        'plum': '/plʌm/',
        'apricot': '/ˈeɪ.prɪ.kɒt/',
        'grapefruit': '/ˈɡreɪp.fruːt/',
        'pomegranate': '/ˈpɒm.ɪ.ɡræn.ɪt/',
        'lychee': '/ˈliː.tʃiː/',
        'durian': '/ˈdʊr.i.ən/',
        'cantaloupe': '/ˈkæn.tə.luːp/',
        // Vegetables
        'tomato': '/təˈmɑː.təʊ/',
        'potato': '/pəˈteɪ.təʊ/',
        'carrot': '/ˈkær.ət/',
        'onion': '/ˈʌn.jən/',
        'cabbage': '/ˈkæb.ɪdʒ/',
        'lettuce': '/ˈlet.ɪs/',
        'cucumber': '/ˈkjuː.kʌm.bə/',
        'pumpkin': '/ˈpʌmp.kɪn/',
        'broccoli': '/ˈbrɒk.əl.i/',
        'cauliflower': '/ˈkɒl.ɪ.flaʊ.ə/',
        'spinach': '/ˈspɪn.ɪtʃ/',
        'eggplant': '/ˈeɡ.plɑːnt/',
        'pepper': '/ˈpep.ə/',
        'chili': '/ˈtʃɪl.i/',
        'garlic': '/ˈɡɑː.lɪk/',
        'mushroom': '/ˈmʌʃ.ruːm/',
        'corn': '/kɔːn/',
        'pea': '/piː/',
        'radish': '/ˈræd.ɪʃ/',
        'leek': '/liːk/',
        'asparagus': '/əˈspær.ə.ɡəs/',
        'zucchini': '/zuːˈkiː.ni/',
        // Animals
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
        'rabbit': '/ˈræb.ɪt/',
        'monkey': '/ˈmʌŋ.ki/',
        'panda': '/ˈpæn.də/',
        'bear': '/bɛə/',
        'tiger': '/ˈtaɪ.ɡə/',
        'giraffe': '/dʒɪˈrɑːf/',
        'zebra': '/ˈzeb.rə/',
        'deer': '/dɪə/',
        'kangaroo': '/ˌkæŋ.ɡəˈruː/',
        'snake': '/sneɪk/',
        'turtle': '/ˈtɜː.təl/',
        'frog': '/frɒɡ/',
        'penguin': '/ˈpeŋ.ɡwɪn/',
        'eagle': '/ˈiː.ɡəl/',
        'owl': '/aʊl/',
        'parrot': '/ˈpær.ət/',
        'crow': '/krəʊ/',
        'swan': '/swɒn/',
        'butterfly': '/ˈbʌt.ə.flaɪ/',
        'bee': '/biː/',
        'ladybug': '/ˈleɪ.di.bʌɡ/',
        'ant': '/ænt/',
        'spider': '/ˈspaɪ.də/',
        'duck': '/dʌk/',
        'chicken': '/ˈtʃɪk.ɪn/',
        'cow': '/kaʊ/',
        'pig': '/pɪɡ/',
        'horse': '/hɔːs/',
        'sheep': '/ʃiːp/',
        'goat': '/ɡəʊt/',
        'hen': '/hen/',
        'squirrel': '/ˈskwɪr.əl/',
        'hedgehog': '/ˈhedʒ.hɒɡ/',
        'camel': '/ˈkæm.əl/',
        // Body parts
        'eye': '/aɪ/',
        'nose': '/nəʊz/',
        'ear': '/ɪə/',
        'mouth': '/maʊθ/',
        'leg': '/leɡ/',
        'foot': '/fʊt/',
        // Food & Drinks
        'bread': '/bred/',
        'rice': '/raɪs/',
        'noodles': '/ˈnuː.dəlz/',
        'pizza': '/ˈpiːt.sə/',
        'hamburger': '/ˈhæm.bɜː.ɡə/',
        'sandwich': '/ˈsænd.wɪtʃ/',
        'meat': '/miːt/',
        'cookie': '/ˈkʊk.i/',
        'candy': '/ˈkæn.di/',
        'chocolate': '/ˈtʃɒk.lət/',
        'cake': '/keɪk/',
        'donut': '/ˈdəʊ.nʌt/',
        'popcorn': '/ˈpɒp.kɔːn/',
        'milk': '/mɪlk/',
        'juice': '/dʒuːs/',
        'water': '/ˈwɔː.tə/',
        'tea': '/tiː/',
        // Household items
        'cup': '/kʌp/',
        'plate': '/pleɪt/',
        'bowl': '/bəʊl/',
        'spoon': '/spuːn/',
        'fork': '/fɔːk/',
        'knife': '/naɪf/',
        'chopsticks': '/ˈtʃɒp.stɪks/',
        'toothbrush': '/ˈtuːθ.brʌʃ/',
        'toothpaste': '/ˈtuːθ.peɪst/',
        'towel': '/ˈtaʊ.əl/',
        'soap': '/səʊp/',
        'shampoo': '/ʃæmˈpuː/',
        'comb': '/kəʊm/',
        'mirror': '/ˈmɪr.ə/',
        'umbrella': '/ʌmˈbrel.ə/',
        'clock': '/klɒk/',
        'lamp': '/læmp/',
        'phone': '/fəʊn/',
        'computer': '/kəmˈpjuː.tə/',
        'television': '/ˈtel.ɪ.vɪʒ.ən/',
        'remote': '/rɪˈməʊt/',
        'battery': '/ˈbæt.ər.i/',
        'key': '/kiː/',
        'lock': '/lɒk/',
        'candle': '/ˈkæn.dəl/',
        'scissors': '/ˈsɪz.əz/',
        'ruler': '/ˈruː.lə/',
        'eraser': '/ɪˈreɪ.zə/',
        'tape': '/teɪp/',
        // Clothing
        'shirt': '/ʃɜːt/',
        'skirt': '/skɜːt/',
        'dress': '/dres/',
        'shorts': '/ʃɔːts/',
        'jeans': '/dʒiːnz/',
        'jacket': '/ˈdʒæk.ɪt/',
        'coat': '/kəʊt/',
        'sweater': '/ˈswet.ə/',
        'tie': '/taɪ/',
        'hat': '/hæt/',
        'cap': '/kæp/',
        'glove': '/ɡlʌv/',
        'sock': '/sɒk/',
        'shoe': '/ʃuː/',
        'boot': '/buːt/',
        'slipper': '/ˈslɪp.ə/',
        'belt': '/belt/',
        'scarf': '/skɑːf/',
        // Transportation
        'car': '/kɑː/',
        'bus': '/bʌs/',
        'train': '/treɪn/',
        'subway': '/ˈsʌb.weɪ/',
        'taxi': '/ˈtæk.si/',
        'bicycle': '/ˈbaɪ.sɪ.kəl/',
        'motorcycle': '/ˈməʊ.tə.saɪ.kəl/',
        'plane': '/pleɪn/',
        'ship': '/ʃɪp/',
        'boat': '/bəʊt/',
        'truck': '/trʌk/',
        'ambulance': '/ˈæm.bjə.ləns/',
        'helicopter': '/ˈhel.ɪ.kɒp.tə/',
        // Nature
        'moon': '/muːn/',
        'sky': '/skaɪ/',
        'rainbow': '/ˈreɪn.bəʊ/',
        'tree': '/triː/',
        'leaf': '/liːf/',
        'grass': '/ɡrɑːs/',
        'mountain': '/ˈmaʊn.tɪn/',
        'sea': '/siː/',
        'star': '/stɑː/',
        'cloud': '/klaʊd/',
        'rain': '/reɪn/',
        'snow': '/snəʊ/',
        'wind': '/wɪnd/',
        'thunder': '/ˈθʌn.də/',
        'lightning': '/ˈlaɪt.nɪŋ/',
        'fog': '/fɒɡ/',
        'river': '/ˈrɪv.ə/',
        'lake': '/leɪk/',
        // Original words
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
        'sister': '/ˈsɪs.tə/'
    };
    return phonetics[word.toLowerCase()] || `/${word.toLowerCase()}/`;
}

// Play word pronunciation
function playWordPronunciation(word, rate) {
    if (rate === undefined) {
        rate = 0.7;
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-GB';
        utterance.rate = rate;
        utterance.pitch = 1.1;
        
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        if (englishVoice) {
            utterance.voice = englishVoice;
        }
        
        window.speechSynthesis.speak(utterance);
    }
}

// Generate word list
function generateWordList() {
    const table = document.getElementById('wordListTable');
    table.innerHTML = '';
    
    wordList.forEach(w => {
        const row = document.createElement('div');
        row.className = 'word-list-row';
        
        const img = document.createElement('img');
        img.src = w.image;
        img.alt = w.word;
        img.onerror = function() {
            img.style.display = 'none';
        };
        
        const info = document.createElement('div');
        info.className = 'word-list-info';
        
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word-list-word';
        wordSpan.textContent = w.word;
        
        const phoneticSpan = document.createElement('span');
        phoneticSpan.className = 'word-list-phonetic';
        phoneticSpan.textContent = getPhoneticSymbol(w.word);
        
        const chineseSpan = document.createElement('span');
        chineseSpan.className = 'word-list-chinese';
        chineseSpan.textContent = w.chinese || '';
        
        info.appendChild(wordSpan);
        info.appendChild(phoneticSpan);
        info.appendChild(chineseSpan);
        
        const playBtn = document.createElement('button');
        playBtn.className = 'word-list-play-btn';
        playBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        playBtn.addEventListener('click', function() {
            playWordPronunciation(w.word);
        });
        
        row.appendChild(img);
        row.appendChild(info);
        row.appendChild(playBtn);
        
        table.appendChild(row);
    });
}

// Back button
document.addEventListener('DOMContentLoaded', function() {
    generateWordList();
    
    document.getElementById('backToMenuBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });
});

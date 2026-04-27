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
    { word: "brother", image: "images/brother.jpeg", color: "#2196F3", chinese: "兄弟" },
    { word: "mother", image: "images/mother.jpeg", color: "#E91E63", chinese: "母亲" },
    { word: "father", image: "images/father.jpeg", color: "#2196F3", chinese: "父亲" },
    { word: "grandpa", image: "images/grandpa.jpeg", color: "#795548", chinese: "爷爷" },
    { word: "grandma", image: "images/grandma.jpeg", color: "#795548", chinese: "奶奶" },
    { word: "uncle", image: "images/uncle.jpeg", color: "#FF9800", chinese: "叔叔" },
    { word: "aunt", image: "images/aunt.jpeg", color: "#FF9800", chinese: "阿姨" },
    { word: "sister", image: "images/sister.jpeg", color: "#E91E63", chinese: "姐妹" },
    // New words
    { word: "queen", image: "images/queen.jpeg", color: "#9C27B0", chinese: "女王" },
    { word: "king", image: "images/king.jpeg", color: "#FF9800", chinese: "国王" },
    { word: "giant", image: "images/giant.jpeg", color: "#4CAF50", chinese: "巨人" },
    { word: "elf", image: "images/elf.jpeg", color: "#4CAF50", chinese: "精灵" },
    { word: "witch", image: "images/witch.jpeg", color: "#9C27B0", chinese: "女巫" },
    { word: "wizard", image: "images/wizard.jpeg", color: "#3F51B5", chinese: "巫师" },
    { word: "clown", image: "images/clown.jpeg", color: "#F44336", chinese: "小丑" },
    { word: "soldier", image: "images/soldier.jpeg", color: "#795548", chinese: "士兵" },
    { word: "teacher", image: "images/teacher.jpeg", color: "#2196F3", chinese: "老师" },
    { word: "doctor", image: "images/doctor.jpeg", color: "#4CAF50", chinese: "医生" },
    { word: "nurse", image: "images/nurse.jpeg", color: "#E91E63", chinese: "护士" },
    { word: "farmer", image: "images/farmer.jpeg", color: "#795548", chinese: "农民" },
    { word: "chef", image: "images/chef.jpeg", color: "#FF9800", chinese: "厨师" },
    { word: "pilot", image: "images/pilot.jpeg", color: "#2196F3", chinese: "飞行员" },
    { word: "driver", image: "images/driver.jpeg", color: "#795548", chinese: "司机" },
    { word: "crab", image: "images/crab.jpeg", color: "#F44336", chinese: "螃蟹" },
    { word: "lobster", image: "images/lobster.jpeg", color: "#F44336", chinese: "龙虾" },
    { word: "shrimp", image: "images/shrimp.jpeg", color: "#FF9800", chinese: "虾" },
    { word: "octopus", image: "images/octopus.jpeg", color: "#9C27B0", chinese: "章鱼" },
    { word: "squid", image: "images/squid.jpeg", color: "#9C27B0", chinese: "鱿鱼" },
    { word: "seal", image: "images/seal.jpeg", color: "#9E9E9E", chinese: "海豹" },
    { word: "walrus", image: "images/walrus.jpeg", color: "#795548", chinese: "海象" },
    { word: "otter", image: "images/otter.jpeg", color: "#795548", chinese: "水獭" },
    { word: "bat", image: "images/bat.jpeg", color: "#212121", chinese: "蝙蝠" },
    { word: "rat", image: "images/rat.jpeg", color: "#795548", chinese: "老鼠" },
    { word: "hamster", image: "images/hamster.jpeg", color: "#FFC107", chinese: "仓鼠" },
    { word: "ferret", image: "images/ferret.jpeg", color: "#FFC107", chinese: "雪貂" },
    { word: "pony", image: "images/pony.jpeg", color: "#795548", chinese: "小马" },
    { word: "donkey", image: "images/donkey.jpeg", color: "#9E9E9E", chinese: "驴" },
    { word: "goose", image: "images/goose.jpeg", color: "#FFFFFF", chinese: "鹅" },
    { word: "pigeon", image: "images/pigeon.jpeg", color: "#9E9E9E", chinese: "鸽子" },
    { word: "seagull", image: "images/seagull.jpeg", color: "#FFFFFF", chinese: "海鸥" },
    { word: "woodpecker", image: "images/woodpecker.jpeg", color: "#F44336", chinese: "啄木鸟" },
    { word: "peacock", image: "images/peacock.jpeg", color: "#2196F3", chinese: "孔雀" },
    { word: "firefly", image: "images/firefly.jpeg", color: "#FFC107", chinese: "萤火虫" },
    { word: "caterpillar", image: "images/caterpillar.jpeg", color: "#4CAF50", chinese: "毛毛虫" },
    { word: "snail", image: "images/snail.jpeg", color: "#795548", chinese: "蜗牛" },
    { word: "worm", image: "images/worm.jpeg", color: "#795548", chinese: "蠕虫" },
    { word: "dinosaur", image: "images/dinosaur.jpeg", color: "#4CAF50", chinese: "恐龙" },
    { word: "date", image: "images/date.jpeg", color: "#795548", chinese: "枣" },
    { word: "papaya", image: "images/papaya.jpeg", color: "#FF9800", chinese: "木瓜" },
    { word: "nectarine", image: "images/nectarine.jpeg", color: "#FF9800", chinese: "油桃" },
    { word: "olive", image: "images/olive.jpeg", color: "#4CAF50", chinese: "橄榄" },
    { word: "celery", image: "images/celery.jpeg", color: "#4CAF50", chinese: "芹菜" },
    { word: "okra", image: "images/okra.jpeg", color: "#4CAF50", chinese: "秋葵" },
    { word: "shallot", image: "images/shallot.jpeg", color: "#FF9800", chinese: "青葱" },
    { word: "endive", image: "images/endive.jpeg", color: "#4CAF50", chinese: "菊苣" },
    { word: "bed", image: "images/bed.jpeg", color: "#795548", chinese: "床" },
    { word: "desk", image: "images/desk.jpeg", color: "#795548", chinese: "书桌" },
    { word: "chair", image: "images/chair.jpeg", color: "#795548", chinese: "椅子" },
    { word: "sofa", image: "images/sofa.jpeg", color: "#795548", chinese: "沙发" },
    { word: "blanket", image: "images/blanket.jpeg", color: "#2196F3", chinese: "毯子" },
    { word: "pillow", image: "images/pillow.jpeg", color: "#FFFFFF", chinese: "枕头" },
    { word: "sheet", image: "images/sheet.jpeg", color: "#FFFFFF", chinese: "床单" },
    { word: "sponge", image: "images/sponge.jpeg", color: "#FFC107", chinese: "海绵" },
    { word: "bucket", image: "images/bucket.jpeg", color: "#2196F3", chinese: "水桶" },
    { word: "broom", image: "images/broom.jpeg", color: "#795548", chinese: "扫帚" },
    { word: "mop", image: "images/mop.jpeg", color: "#2196F3", chinese: "拖把" },
    { word: "detergent", image: "images/detergent.jpeg", color: "#2196F3", chinese: "洗涤剂" },
    { word: "clothespin", image: "images/clothespin.jpeg", color: "#795548", chinese: "衣夹" },
    { word: "hanger", image: "images/hanger.jpeg", color: "#9E9E9E", chinese: "衣架" },
    { word: "iron", image: "images/iron.jpeg", color: "#9E9E9E", chinese: "熨斗" },
    { word: "needle", image: "images/needle.jpeg", color: "#9E9E9E", chinese: "针" },
    { word: "thread", image: "images/thread.jpeg", color: "#F44336", chinese: "线" },
    { word: "button", image: "images/button.jpeg", color: "#F44336", chinese: "纽扣" },
    { word: "zipper", image: "images/zipper.jpeg", color: "#9E9E9E", chinese: "拉链" },
    { word: "wallet", image: "images/wallet.jpeg", color: "#795548", chinese: "钱包" },
    { word: "backpack", image: "images/backpack.jpeg", color: "#F44336", chinese: "背包" },
    { word: "suitcase", image: "images/suitcase.jpeg", color: "#795548", chinese: "手提箱" },
    { word: "ladder", image: "images/ladder.jpeg", color: "#795548", chinese: "梯子" },
    { word: "hammer", image: "images/hammer.jpeg", color: "#795548", chinese: "锤子" },
    { word: "nail", image: "images/nail.jpeg", color: "#9E9E9E", chinese: "钉子" },
    { word: "screwdriver", image: "images/screwdriver.jpeg", color: "#795548", chinese: "螺丝刀" },
    { word: "wrench", image: "images/wrench.jpeg", color: "#9E9E9E", chinese: "扳手" },
    { word: "pliers", image: "images/pliers.jpeg", color: "#9E9E9E", chinese: "钳子" },
    { word: "crayon", image: "images/crayon.jpeg", color: "#F44336", chinese: "蜡笔" },
    { word: "chalk", image: "images/chalk.jpeg", color: "#FFFFFF", chinese: "粉笔" },
    { word: "glue", image: "images/glue.jpeg", color: "#FFC107", chinese: "胶水" },
    { word: "vest", image: "images/vest.jpeg", color: "#2196F3", chinese: "背心" },
    { word: "raincoat", image: "images/raincoat.jpeg", color: "#FFC107", chinese: "雨衣" },
    { word: "pajamas", image: "images/pajamas.jpeg", color: "#2196F3", chinese: "睡衣" },
    { word: "swimsuit", image: "images/swimsuit.jpeg", color: "#2196F3", chinese: "泳衣" },
    { word: "underwear", image: "images/underwear.jpeg", color: "#FFFFFF", chinese: "内衣" },
    { word: "overalls", image: "images/overalls.jpeg", color: "#2196F3", chinese: "工装裤" },
    { word: "helmet", image: "images/helmet.jpeg", color: "#F44336", chinese: "头盔" },
    { word: "earring", image: "images/earring.jpeg", color: "#FFC107", chinese: "耳环" },
    { word: "necklace", image: "images/necklace.jpeg", color: "#FFC107", chinese: "项链" },
    { word: "bracelet", image: "images/bracelet.jpeg", color: "#FFC107", chinese: "手镯" },
    { word: "ring", image: "images/ring.jpeg", color: "#FFC107", chinese: "戒指" },
    { word: "watch", image: "images/watch.jpeg", color: "#795548", chinese: "手表" },
    { word: "glasses", image: "images/glasses.jpeg", color: "#795548", chinese: "眼镜" },
    { word: "suspenders", image: "images/suspenders.jpeg", color: "#795548", chinese: "吊带裤" },
    { word: "handkerchief", image: "images/handkerchief.jpeg", color: "#FFFFFF", chinese: "手帕" },
    { word: "scooter", image: "images/scooter.jpeg", color: "#F44336", chinese: "滑板车" },
    { word: "skateboard", image: "images/skateboard.jpeg", color: "#F44336", chinese: "滑板" },
    { word: "sailboat", image: "images/sailboat.jpeg", color: "#2196F3", chinese: "帆船" },
    { word: "yacht", image: "images/yacht.jpeg", color: "#FFFFFF", chinese: "游艇" },
    { word: "submarine", image: "images/submarine.jpeg", color: "#2196F3", chinese: "潜艇" },
    { word: "blimp", image: "images/blimp.jpeg", color: "#FFFFFF", chinese: "飞艇" },
    { word: "rocket", image: "images/rocket.jpeg", color: "#F44336", chinese: "火箭" },
    { word: "tractor", image: "images/tractor.jpeg", color: "#F44336", chinese: "拖拉机" },
    { word: "bulldozer", image: "images/bulldozer.jpeg", color: "#FFC107", chinese: "推土机" },
    { word: "crane", image: "images/crane.jpeg", color: "#FFC107", chinese: "起重机" },
    { word: "forklift", image: "images/forklift.jpeg", color: "#FFC107", chinese: "叉车" },
    { word: "convertible", image: "images/convertible.jpeg", color: "#F44336", chinese: "敞篷车" },
    { word: "island", image: "images/island.jpeg", color: "#4CAF50", chinese: "岛屿" },
    { word: "beach", image: "images/beach.jpeg", color: "#FFC107", chinese: "海滩" },
    { word: "cliff", image: "images/cliff.jpeg", color: "#795548", chinese: "悬崖" },
    { word: "cave", image: "images/cave.jpeg", color: "#212121", chinese: "洞穴" },
    { word: "desert", image: "images/desert.jpeg", color: "#FFC107", chinese: "沙漠" },
    { word: "forest", image: "images/forest.jpeg", color: "#4CAF50", chinese: "森林" },
    { word: "waterfall", image: "images/waterfall.jpeg", color: "#2196F3", chinese: "瀑布" },
    { word: "stream", image: "images/stream.jpeg", color: "#2196F3", chinese: "溪流" },
    { word: "pond", image: "images/pond.jpeg", color: "#2196F3", chinese: "池塘" },
    { word: "wave", image: "images/wave.jpeg", color: "#2196F3", chinese: "波浪" },
    { word: "sand", image: "images/sand.jpeg", color: "#FFC107", chinese: "沙子" },
    { word: "rock", image: "images/rock.jpeg", color: "#795548", chinese: "岩石" },
    { word: "stone", image: "images/stone.jpeg", color: "#9E9E9E", chinese: "石头" },
    { word: "flood", image: "images/flood.jpeg", color: "#2196F3", chinese: "洪水" },
    { word: "drought", image: "images/drought.jpeg", color: "#FFC107", chinese: "干旱" },
    { word: "earthquake", image: "images/earthquake.jpeg", color: "#795548", chinese: "地震" },
    { word: "volcano", image: "images/volcano.jpeg", color: "#F44336", chinese: "火山" },
    { word: "dew", image: "images/dew.jpeg", color: "#2196F3", chinese: "露水" },
    { word: "balloon", image: "images/balloon.jpeg", color: "#F44336", chinese: "气球" },
    { word: "kite", image: "images/kite.jpeg", color: "#F44336", chinese: "风筝" },
    { word: "doll", image: "images/doll.jpeg", color: "#E91E63", chinese: "洋娃娃" },
    { word: "puzzle", image: "images/puzzle.jpeg", color: "#FF9800", chinese: "拼图" },
    { word: "lego", image: "images/lego.jpeg", color: "#F44336", chinese: "乐高" },
    { word: "checkers", image: "images/checkers.jpeg", color: "#F44336", chinese: "跳棋" },
    { word: "marbles", image: "images/marbles.jpeg", color: "#2196F3", chinese: "弹珠" },
    { word: "top", image: "images/top.jpeg", color: "#F44336", chinese: "陀螺" },
    { word: "whistle", image: "images/whistle.jpeg", color: "#9E9E9E", chinese: "哨子" },
    { word: "drum", image: "images/drum.jpeg", color: "#F44336", chinese: "鼓" },
    { word: "guitar", image: "images/guitar.jpeg", color: "#795548", chinese: "吉他" },
    { word: "piano", image: "images/piano.jpeg", color: "#212121", chinese: "钢琴" },
    { word: "violin", image: "images/violin.jpeg", color: "#795548", chinese: "小提琴" },
    { word: "microscope", image: "images/microscope.jpeg", color: "#9E9E9E", chinese: "显微镜" },
    { word: "telescope", image: "images/telescope.jpeg", color: "#795548", chinese: "望远镜" },
    { word: "compass", image: "images/compass.jpeg", color: "#795548", chinese: "指南针" },
    { word: "map", image: "images/map.jpeg", color: "#4CAF50", chinese: "地图" },
    { word: "hospital", image: "images/hospital.jpeg", color: "#F44336", chinese: "医院" },
    { word: "school", image: "images/school.jpeg", color: "#2196F3", chinese: "学校" },
    { word: "library", image: "images/library.jpeg", color: "#795548", chinese: "图书馆" },
    { word: "museum", image: "images/museum.jpeg", color: "#795548", chinese: "博物馆" },
    { word: "zoo", image: "images/zoo.jpeg", color: "#4CAF50", chinese: "动物园" },
    { word: "farm", image: "images/farm.jpeg", color: "#4CAF50", chinese: "农场" },
    { word: "park", image: "images/park.jpeg", color: "#4CAF50", chinese: "公园" },
    { word: "garden", image: "images/garden.jpeg", color: "#4CAF50", chinese: "花园" },
    { word: "restaurant", image: "images/restaurant.jpeg", color: "#F44336", chinese: "餐厅" },
    { word: "bakery", image: "images/bakery.jpeg", color: "#FFC107", chinese: "面包店" },
    { word: "cafe", image: "images/cafe.jpeg", color: "#795548", chinese: "咖啡馆" },
    { word: "supermarket", image: "images/supermarket.jpeg", color: "#2196F3", chinese: "超市" },
    { word: "cinema", image: "images/cinema.jpeg", color: "#F44336", chinese: "电影院" },
    { word: "stadium", image: "images/stadium.jpeg", color: "#2196F3", chinese: "体育场" },
    { word: "airport", image: "images/airport.jpeg", color: "#2196F3", chinese: "机场" },
    { word: "head", image: "images/head.jpeg", color: "#FFE082", chinese: "头" },
    { word: "hair", image: "images/hair.jpeg", color: "#795548", chinese: "头发" },
    { word: "forehead", image: "images/forehead.jpeg", color: "#FFE082", chinese: "额头" },
    { word: "eyebrow", image: "images/eyebrow.jpeg", color: "#795548", chinese: "眉毛" },
    { word: "eyelash", image: "images/eyelash.jpeg", color: "#212121", chinese: "睫毛" },
    { word: "cheek", image: "images/cheek.jpeg", color: "#FF8A80", chinese: "脸颊" },
    { word: "chin", image: "images/chin.jpeg", color: "#FFE082", chinese: "下巴" },
    { word: "neck", image: "images/neck.jpeg", color: "#FFE082", chinese: "脖子" },
    { word: "shoulder", image: "images/shoulder.jpeg", color: "#FFE082", chinese: "肩膀" },
    { word: "arm", image: "images/arm.jpeg", color: "#FFE082", chinese: "手臂" },
    { word: "elbow", image: "images/elbow.jpeg", color: "#FFE082", chinese: "肘部" },
    { word: "wrist", image: "images/wrist.jpeg", color: "#FFE082", chinese: "手腕" },
    { word: "hand", image: "images/hand.jpeg", color: "#FFE082", chinese: "手" },
    { word: "finger", image: "images/finger.jpeg", color: "#FFE082", chinese: "手指" },
    { word: "thumb", image: "images/thumb.jpeg", color: "#FFE082", chinese: "拇指" },
    { word: "chest", image: "images/chest.jpeg", color: "#FFE082", chinese: "胸部" },
    { word: "back", image: "images/back.jpeg", color: "#FFE082", chinese: "背部" },
    { word: "stomach", image: "images/stomach.jpeg", color: "#FFE082", chinese: "胃" },
    { word: "hip", image: "images/hip.jpeg", color: "#FFE082", chinese: "臀部" },
    { word: "knee", image: "images/knee.jpeg", color: "#FFE082", chinese: "膝盖" },
    { word: "ankle", image: "images/ankle.jpeg", color: "#FFE082", chinese: "脚踝" },
    { word: "heel", image: "images/heel.jpeg", color: "#FFE082", chinese: "脚跟" },
    { word: "toe", image: "images/toe.jpeg", color: "#FFE082", chinese: "脚趾" }
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
        'toe': 'TOH'
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
        'toe': '/təʊ/'
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

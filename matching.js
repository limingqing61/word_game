// Word list (same as listening.js)
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
    { word: "family", image: "images/family.jpeg", color: "#E91E63", chinese: "家庭" },
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
    { word: "toe", image: "images/toe.jpeg", color: "#FFE082", chinese: "脚趾" },
    // Verbs
    { word: "run", image: "images/run.jpeg", color: "#F44336", chinese: "跑" },
    { word: "walk", image: "images/walk.jpeg", color: "#4CAF50", chinese: "走" },
    { word: "jump", image: "images/jump.jpeg", color: "#FF9800", chinese: "跳" },
    { word: "climb", image: "images/climb.jpeg", color: "#795548", chinese: "爬" },
    { word: "crawl", image: "images/crawl.jpeg", color: "#795548", chinese: "爬行" },
    { word: "swim", image: "images/swim.jpeg", color: "#2196F3", chinese: "游泳" },
    { word: "dance", image: "images/dance.jpeg", color: "#E91E63", chinese: "跳舞" },
    { word: "sing", image: "images/sing.jpeg", color: "#9C27B0", chinese: "唱歌" },
    { word: "eat", image: "images/eat.jpeg", color: "#FF9800", chinese: "吃" },
    { word: "drink", image: "images/drink.jpeg", color: "#2196F3", chinese: "喝" },
    { word: "bite", image: "images/bite.jpeg", color: "#F44336", chinese: "咬" },
    { word: "lick", image: "images/lick.jpeg", color: "#E91E63", chinese: "舔" },
    { word: "smell", image: "images/smell.jpeg", color: "#9C27B0", chinese: "闻" },
    { word: "look", image: "images/look.jpeg", color: "#2196F3", chinese: "看" },
    { word: "listen", image: "images/listen.jpeg", color: "#4CAF50", chinese: "听" },
    { word: "touch", image: "images/touch.jpeg", color: "#FF9800", chinese: "触摸" },
    { word: "hold", image: "images/hold.jpeg", color: "#795548", chinese: "拿" },
    { word: "catch", image: "images/catch.jpeg", color: "#F44336", chinese: "接" },
    { word: "throw", image: "images/throw.jpeg", color: "#FF9800", chinese: "扔" },
    { word: "kick", image: "images/kick.jpeg", color: "#F44336", chinese: "踢" },
    { word: "hit", image: "images/hit.jpeg", color: "#F44336", chinese: "打" },
    { word: "push", image: "images/push.jpeg", color: "#FF9800", chinese: "推" },
    { word: "pull", image: "images/pull.jpeg", color: "#4CAF50", chinese: "拉" },
    { word: "lift", image: "images/lift.jpeg", color: "#795548", chinese: "举起" },
    { word: "carry", image: "images/carry.jpeg", color: "#795548", chinese: "搬运" },
    { word: "drop", image: "images/drop.jpeg", color: "#F44336", chinese: "掉落" },
    { word: "press", image: "images/press.jpeg", color: "#9E9E9E", chinese: "按" },
    { word: "break", image: "images/break.jpeg", color: "#F44336", chinese: "打破" },
    { word: "fix", image: "images/fix.jpeg", color: "#4CAF50", chinese: "修理" },
    { word: "build", image: "images/build.jpeg", color: "#795548", chinese: "建造" },
    { word: "draw", image: "images/draw.jpeg", color: "#E91E63", chinese: "画" },
    { word: "write", image: "images/write.jpeg", color: "#2196F3", chinese: "写" },
    { word: "read", image: "images/read.jpeg", color: "#4CAF50", chinese: "读" },
    { word: "count", image: "images/count.jpeg", color: "#FF9800", chinese: "数" },
    { word: "think", image: "images/think.jpeg", color: "#9C27B0", chinese: "思考" },
    { word: "know", image: "images/know.jpeg", color: "#2196F3", chinese: "知道" },
    { word: "remember", image: "images/remember.jpeg", color: "#4CAF50", chinese: "记住" },
    { word: "forget", image: "images/forget.jpeg", color: "#F44336", chinese: "忘记" },
    { word: "sleep", image: "images/sleep.jpeg", color: "#9E9E9E", chinese: "睡觉" },
    { word: "sit", image: "images/sit.jpeg", color: "#795548", chinese: "坐" },
    { word: "stand", image: "images/stand.jpeg", color: "#4CAF50", chinese: "站" },
    { word: "bend", image: "images/bend.jpeg", color: "#FF9800", chinese: "弯曲" },
    { word: "kneel", image: "images/kneel.jpeg", color: "#795548", chinese: "跪" },
    { word: "stretch", image: "images/stretch.jpeg", color: "#2196F3", chinese: "伸展" },
    { word: "wash", image: "images/wash.jpeg", color: "#2196F3", chinese: "洗" },
    { word: "clean", image: "images/clean.jpeg", color: "#4CAF50", chinese: "清洁" },
    { word: "sweep", image: "images/sweep.jpeg", color: "#795548", chinese: "扫" },
    { word: "wipe", image: "images/wipe.jpeg", color: "#2196F3", chinese: "擦" },
    { word: "cook", image: "images/cook.jpeg", color: "#FF9800", chinese: "烹饪" },
    { word: "bake", image: "images/bake.jpeg", color: "#FFC107", chinese: "烤" },
    { word: "fry", image: "images/fry.jpeg", color: "#FF9800", chinese: "炸" },
    { word: "boil", image: "images/boil.jpeg", color: "#2196F3", chinese: "煮" },
    { word: "cut", image: "images/cut.jpeg", color: "#F44336", chinese: "切" },
    { word: "peel", image: "images/peel.jpeg", color: "#FF9800", chinese: "削皮" },
    { word: "pour", image: "images/pour.jpeg", color: "#2196F3", chinese: "倒" },
    { word: "mix", image: "images/mix.jpeg", color: "#795548", chinese: "混合" },
    { word: "stir", image: "images/stir.jpeg", color: "#795548", chinese: "搅拌" },
    { word: "spread", image: "images/spread.jpeg", color: "#FFC107", chinese: "涂抹" },
    { word: "plant", image: "images/plant.jpeg", color: "#4CAF50", chinese: "种植" },
    { word: "dig", image: "images/dig.jpeg", color: "#795548", chinese: "挖" },
    { word: "hide", image: "images/hide.jpeg", color: "#795548", chinese: "隐藏" },
    { word: "find", image: "images/find.jpeg", color: "#4CAF50", chinese: "找到" },
    { word: "search", image: "images/search.jpeg", color: "#2196F3", chinese: "搜索" },
    { word: "give", image: "images/give.jpeg", color: "#4CAF50", chinese: "给" },
    { word: "take", image: "images/take.jpeg", color: "#FF9800", chinese: "拿" },
    { word: "bring", image: "images/bring.jpeg", color: "#4CAF50", chinese: "带来" },
    { word: "send", image: "images/send.jpeg", color: "#2196F3", chinese: "发送" },
    { word: "receive", image: "images/receive.jpeg", color: "#4CAF50", chinese: "接收" },
    { word: "buy", image: "images/buy.jpeg", color: "#FF9800", chinese: "买" },
    { word: "sell", image: "images/sell.jpeg", color: "#F44336", chinese: "卖" },
    { word: "pay", image: "images/pay.jpeg", color: "#4CAF50", chinese: "支付" },
    { word: "earn", image: "images/earn.jpeg", color: "#4CAF50", chinese: "赚" },
    { word: "save", image: "images/save.jpeg", color: "#2196F3", chinese: "节省" },
    { word: "spend", image: "images/spend.jpeg", color: "#F44336", chinese: "花费" },
    { word: "help", image: "images/help.jpeg", color: "#4CAF50", chinese: "帮助" },
    { word: "share", image: "images/share.jpeg", color: "#FF9800", chinese: "分享" },
    { word: "laugh", image: "images/laugh.jpeg", color: "#FFC107", chinese: "笑" },
    { word: "cry", image: "images/cry.jpeg", color: "#2196F3", chinese: "哭" },
    { word: "smile", image: "images/smile.jpeg", color: "#FFC107", chinese: "微笑" },
    // Numbers
    { word: "one", image: "images/one.jpeg", color: "#2196F3", chinese: "一" },
    { word: "two", image: "images/two.jpeg", color: "#2196F3", chinese: "二" },
    { word: "three", image: "images/three.jpeg", color: "#2196F3", chinese: "三" },
    { word: "four", image: "images/four.jpeg", color: "#2196F3", chinese: "四" },
    { word: "five", image: "images/five.jpeg", color: "#2196F3", chinese: "五" },
    { word: "six", image: "images/six.jpeg", color: "#2196F3", chinese: "六" },
    { word: "seven", image: "images/seven.jpeg", color: "#2196F3", chinese: "七" },
    { word: "eight", image: "images/eight.jpeg", color: "#2196F3", chinese: "八" },
    { word: "nine", image: "images/nine.jpeg", color: "#2196F3", chinese: "九" },
    { word: "ten", image: "images/ten.jpeg", color: "#2196F3", chinese: "十" },
    { word: "eleven", image: "images/eleven.jpeg", color: "#2196F3", chinese: "十一" },
    { word: "twelve", image: "images/twelve.jpeg", color: "#2196F3", chinese: "十二" },
    { word: "thirteen", image: "images/thirteen.jpeg", color: "#2196F3", chinese: "十三" },
    { word: "fourteen", image: "images/fourteen.jpeg", color: "#2196F3", chinese: "十四" },
    { word: "fifteen", image: "images/fifteen.jpeg", color: "#2196F3", chinese: "十五" },
    { word: "sixteen", image: "images/sixteen.jpeg", color: "#2196F3", chinese: "十六" },
    { word: "seventeen", image: "images/seventeen.jpeg", color: "#2196F3", chinese: "十七" },
    { word: "eighteen", image: "images/eighteen.jpeg", color: "#2196F3", chinese: "十八" },
    { word: "nineteen", image: "images/nineteen.jpeg", color: "#2196F3", chinese: "十九" },
    { word: "twenty", image: "images/twenty.jpeg", color: "#2196F3", chinese: "二十" },
    { word: "thirty", image: "images/thirty.jpeg", color: "#2196F3", chinese: "三十" },
    { word: "forty", image: "images/forty.jpeg", color: "#2196F3", chinese: "四十" },
    { word: "fifty", image: "images/fifty.jpeg", color: "#2196F3", chinese: "五十" },
    { word: "sixty", image: "images/sixty.jpeg", color: "#2196F3", chinese: "六十" },
    { word: "seventy", image: "images/seventy.jpeg", color: "#2196F3", chinese: "七十" },
    { word: "eighty", image: "images/eighty.jpeg", color: "#2196F3", chinese: "八十" },
    { word: "ninety", image: "images/ninety.jpeg", color: "#2196F3", chinese: "九十" },
    { word: "hundred", image: "images/hundred.jpeg", color: "#2196F3", chinese: "百" },
    { word: "thousand", image: "images/thousand.jpeg", color: "#2196F3", chinese: "千" },
    // Seasons
    { word: "spring", image: "images/spring.jpeg", color: "#4CAF50", chinese: "春天" },
    { word: "summer", image: "images/summer.jpeg", color: "#FF9800", chinese: "夏天" },
    { word: "autumn", image: "images/autumn.jpeg", color: "#FFC107", chinese: "秋天" },
    { word: "winter", image: "images/winter.jpeg", color: "#2196F3", chinese: "冬天" }
];

// Game state
let gameState = {
    correctCount: 0,
    wrongCount: 0,
    currentRound: 0,
    totalRounds: 30,
    pairs: [],
    selectedWord: null,
    selectedImage: null,
    matchedPairs: 0,
    totalPairs: 0,
    isRoundActive: true,
    streakCount: 0,
    totalScore: 0,
    wrongWords: []
};

// Drag state for line drawing
let dragState = {
    isDragging: false,
    startElement: null,
    startWord: null,
    tempLine: null
};

// DOM elements
const correctCountEl = document.getElementById('correctCount');
const wrongCountEl = document.getElementById('wrongCount');
const totalScoreEl = document.getElementById('totalScore');
const roundCountEl = document.getElementById('roundCount');
const progressFillEl = document.getElementById('progressFill');
const roundInfoEl = document.getElementById('roundInfo');
const matchingContainer = document.getElementById('matchingContainer');
const backBtn = document.getElementById('backBtn');

// Shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize game
function initMatchingGame() {
    gameState.correctCount = 0;
    gameState.wrongCount = 0;
    gameState.currentRound = 0;
    gameState.totalRounds = 30;
    gameState.totalScore = 0;
    gameState.streakCount = 0;
    gameState.wrongWords = [];
    updateScoreDisplay();
    startRound();
}

// Start a round
function startRound() {
    clearLines();
    dragState.isDragging = false;
    dragState.startElement = null;
    dragState.startWord = null;
    dragState.tempLine = null;

    if (gameState.currentRound >= gameState.totalRounds) {
        showGameComplete();
        return;
    }

    gameState.isRoundActive = true;
    gameState.matchedPairs = 0;
    gameState.selectedWord = null;
    gameState.selectedImage = null;

    const numPairs = (gameState.currentRound < 20) ? 3 : 5;
    gameState.totalPairs = numPairs;

    // Pick random words
    const allIndices = [...Array(wordList.length).keys()];
    const shuffledAll = shuffleArray(allIndices);
    const selectedIndices = shuffledAll.slice(0, numPairs);
    const selectedWords = selectedIndices.map(i => wordList[i]);

    gameState.pairs = selectedWords.map(w => ({
        word: w.word,
        image: w.image,
        chinese: w.chinese,
        matched: false
    }));

    // Shuffle words and images separately
    const shuffledWords = shuffleArray([...gameState.pairs]);
    const shuffledImages = shuffleArray([...gameState.pairs]);

    // Build columns
    matchingContainer.innerHTML = '';

    const leftCol = document.createElement('div');
    leftCol.className = 'matching-column';
    leftCol.id = 'wordColumn';

    const rightCol = document.createElement('div');
    rightCol.className = 'matching-column';
    rightCol.id = 'imageColumn';

    shuffledWords.forEach(pair => {
        const wordItem = document.createElement('div');
        wordItem.className = 'matching-word-item';
        wordItem.dataset.word = pair.word;
        wordItem.textContent = pair.word;
        wordItem.addEventListener('pointerdown', (e) => handlePointerDown(e, wordItem, pair.word));
        leftCol.appendChild(wordItem);
    });

    shuffledImages.forEach(pair => {
        const imgItem = document.createElement('div');
        imgItem.className = 'matching-image-item';
        imgItem.dataset.word = pair.word;
        const img = document.createElement('img');
        img.src = pair.image;
        img.alt = pair.word;
        const chineseLabel = document.createElement('div');
        chineseLabel.className = 'chinese-label';
        chineseLabel.textContent = pair.chinese;
        imgItem.appendChild(img);
        imgItem.appendChild(chineseLabel);
        imgItem.addEventListener('pointerdown', (e) => handlePointerDown(e, imgItem, pair.word));
        rightCol.appendChild(imgItem);
    });

    matchingContainer.appendChild(leftCol);
    matchingContainer.appendChild(rightCol);

    // Add pointermove and pointerup listeners on the container
    matchingContainer.addEventListener('pointermove', handlePointerMove);
    matchingContainer.addEventListener('pointerup', handlePointerUp);
    matchingContainer.addEventListener('pointercancel', handlePointerUp);

    // Update round info
    roundInfoEl.textContent = `Round ${gameState.currentRound + 1}: Match ${numPairs} pairs`;
    updateScoreDisplay();
}

// Handle pointer down on a word or image item
function handlePointerDown(event, element, word) {
    if (!gameState.isRoundActive) return;
    if (element.classList.contains('matched')) return;

    event.preventDefault();
    element.setPointerCapture(event.pointerId);
    document.body.style.overflow = 'hidden';

    dragState.isDragging = true;
    dragState.startElement = element;
    dragState.startWord = word;

    // Create a temporary line from the center of the element to the pointer
    const svg = document.getElementById('lineSvg');
    if (!svg) return;

    const containerRect = matchingContainer.getBoundingClientRect();
    const elRect = element.getBoundingClientRect();
    const x1 = elRect.left - containerRect.left + elRect.width / 2;
    const y1 = elRect.top - containerRect.top + elRect.height / 2;
    const x2 = event.clientX - containerRect.left;
    const y2 = event.clientY - containerRect.top;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#2196F3');
    line.setAttribute('stroke-width', '4');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-dasharray', '8,4');
    svg.appendChild(line);
    dragState.tempLine = line;

    // Add pointermove and pointerup listeners to document for proper capture
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);
}

// Handle pointer move
function handlePointerMove(event) {
    if (!dragState.isDragging || !dragState.tempLine) return;

    const svg = document.getElementById('lineSvg');
    if (!svg) return;

    const containerRect = matchingContainer.getBoundingClientRect();
    const x2 = event.clientX - containerRect.left;
    const y2 = event.clientY - containerRect.top;

    dragState.tempLine.setAttribute('x2', x2);
    dragState.tempLine.setAttribute('y2', y2);
}

// Handle pointer up
function handlePointerUp(event) {
    // restore scrolling
    document.body.style.overflow = '';

    // Remove document listeners
    document.removeEventListener('pointermove', handlePointerMove);
    document.removeEventListener('pointerup', handlePointerUp);
    document.removeEventListener('pointercancel', handlePointerUp);

    if (!dragState.isDragging) return;

    dragState.isDragging = false;

    // Remove temporary line
    if (dragState.tempLine) {
        dragState.tempLine.remove();
        dragState.tempLine = null;
    }

    const startElement = dragState.startElement;
    const startWord = dragState.startWord;
    dragState.startElement = null;
    dragState.startWord = null;

    if (!startElement) return;

    // Determine if the pointer is over a valid target element
    const targetElement = document.elementFromPoint(event.clientX, event.clientY);
    if (!targetElement) return;

    // Find the closest matching-word-item or matching-image-item ancestor
    let targetItem = targetElement.closest('.matching-word-item, .matching-image-item');
    if (!targetItem) return;

    // Ensure target is not the same element and not already matched
    if (targetItem === startElement) return;
    if (targetItem.classList.contains('matched')) return;

    // Determine if start is word and target is image (or vice versa)
    const startIsWord = startElement.classList.contains('matching-word-item');
    const targetIsWord = targetItem.classList.contains('matching-word-item');
    if (startIsWord === targetIsWord) return; // both same type

    const targetWord = targetItem.dataset.word;

    // Check if they are the correct pair
    if (startWord === targetWord) {
        // Correct match
        startElement.classList.add('matched');
        targetItem.classList.add('matched');
        gameState.matchedPairs++;

        // Draw permanent line
        drawLine(startElement, targetItem);

        // Check if round complete
        if (gameState.matchedPairs === gameState.totalPairs) {
            gameState.correctCount++;
            gameState.streakCount++;
            const points = (gameState.currentRound < 20) ? 3 : 4;
            gameState.totalScore += points;
            updateScoreDisplay();

            if (gameState.streakCount >= 5) {
                showCelebration(() => {
                    gameState.streakCount = 0;
                    gameState.currentRound++;
                    startRound();
                });
            } else {
                setTimeout(() => {
                    gameState.currentRound++;
                    startRound();
                }, 1000);
            }
        }
    } else {
        // Wrong match
        gameState.wrongCount++;
        gameState.streakCount = 0;
        // Track wrong word (the correct word for the target)
        const correctWord = targetWord;
        const wrongWordObj = wordList.find(w => w.word === correctWord);
        if (wrongWordObj) {
            gameState.wrongWords.push(wrongWordObj);
        }
        updateScoreDisplay();

        // Show wrong animation
        startElement.classList.add('wrong');
        targetItem.classList.add('wrong');
        setTimeout(() => {
            startElement.classList.remove('wrong');
            targetItem.classList.remove('wrong');
            // Move to next round
            gameState.currentRound++;
            startRound();
        }, 1000);
    }
}

// Draw a permanent line between two elements
function drawLine(fromEl, toEl) {
    const svg = document.getElementById('lineSvg');
    if (!svg) return;

    const containerRect = matchingContainer.getBoundingClientRect();
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const x1 = fromRect.left - containerRect.left + fromRect.width / 2;
    const y1 = fromRect.top - containerRect.top + fromRect.height / 2;
    const x2 = toRect.left - containerRect.left + toRect.width / 2;
    const y2 = toRect.top - containerRect.top + toRect.height / 2;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', '#4CAF50');
    line.setAttribute('stroke-width', '4');
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
}

// Clear all lines from SVG
function clearLines() {
    const svg = document.getElementById('lineSvg');
    if (svg) {
        svg.innerHTML = '';
    }
}

// Update score display
function updateScoreDisplay() {
    correctCountEl.textContent = gameState.correctCount;
    wrongCountEl.textContent = gameState.wrongCount;
    totalScoreEl.textContent = gameState.totalScore;
    roundCountEl.textContent = `${gameState.currentRound}/${gameState.totalRounds}`;
    const progressPercent = (gameState.currentRound / gameState.totalRounds) * 100;
    progressFillEl.style.width = `${progressPercent}%`;
}

// Show game complete
function showGameComplete() {
    matchingContainer.innerHTML = '';

    let wrongWordsHtml = '';
    if (gameState.wrongWords.length > 0) {
        wrongWordsHtml = `
            <div class="wrong-words-section">
                <h3><i class="fas fa-book"></i> Words to Review (${gameState.wrongWords.length})</h3>
                <div class="wrong-words-list">
                    ${gameState.wrongWords.map(w => `
                        <div class="wrong-word-item">
                            <img src="${w.image}" alt="${w.word}" style="width:80px; height:80px; object-fit:contain; border-radius:10px;">
                            <div class="wrong-word-info">
                                <span class="wrong-word-text">${w.word}</span>
                                <span class="wrong-word-phonetic">${getPhoneticSymbol(w.word)}</span>
                                <span class="wrong-word-chinese">${w.chinese || ''}</span>
                            </div>
                            <button class="wrong-word-play-btn" onclick="playWordPronunciation('${w.word}', 0.7)">
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
            <span class="score">Score: ${gameState.totalScore}</span>
        </div>
        ${wrongWordsHtml}
        <button id="playAgainBtn" class="repeat-btn">
            <i class="fas fa-redo"></i> Play Again
        </button>
        <button id="backToMenuBtn" class="back-btn">
            <i class="fas fa-arrow-left"></i> Back to Menu
        </button>
    `;

    matchingContainer.appendChild(completeDiv);

    document.getElementById('playAgainBtn').addEventListener('click', function() {
        initMatchingGame();
    });

    document.getElementById('backToMenuBtn').addEventListener('click', function() {
        window.location.href = 'index.html';
    });

    showConfetti();
}

// Phonetic symbols (same as listening.js)
function getPhoneticSymbol(word) {
    const phonetics = {
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
        'eye': '/aɪ/',
        'nose': '/nəʊz/',
        'ear': '/ɪə/',
        'mouth': '/maʊθ/',
        'leg': '/leɡ/',
        'foot': '/fʊt/',
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
        'family': '/ˈfæm.ɪ.li/',
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
        'smile': '/smaɪl/',
        'one': '/wʌn/',
        'two': '/tuː/',
        'three': '/θriː/',
        'four': '/fɔː/',
        'five': '/faɪv/',
        'six': '/sɪks/',
        'seven': '/ˈsev.ən/',
        'eight': '/eɪt/',
        'nine': '/naɪn/',
        'ten': '/ten/',
        'eleven': '/ɪˈlev.ən/',
        'twelve': '/twelv/',
        'thirteen': '/θɜːˈtiːn/',
        'fourteen': '/fɔːˈtiːn/',
        'fifteen': '/fɪfˈtiːn/',
        'sixteen': '/sɪksˈtiːn/',
        'seventeen': '/sev.ənˈtiːn/',
        'eighteen': '/eɪˈtiːn/',
        'nineteen': '/naɪnˈtiːn/',
        'twenty': '/ˈtwen.ti/',
        'thirty': '/ˈθɜː.ti/',
        'forty': '/ˈfɔː.ti/',
        'fifty': '/ˈfɪf.ti/',
        'sixty': '/ˈsɪks.ti/',
        'seventy': '/ˈsev.ən.ti/',
        'eighty': '/ˈeɪ.ti/',
        'ninety': '/ˈnaɪn.ti/',
        'hundred': '/ˈhʌn.drəd/',
        'thousand': '/ˈθaʊ.zənd/',
        'spring': '/sprɪŋ/',
        'summer': '/ˈsʌm.ə/',
        'autumn': '/ˈɔː.təm/',
        'winter': '/ˈwɪn.tə/'
    };
    return phonetics[word.toLowerCase()] || `/${word.toLowerCase()}/`;
}

// Play word pronunciation
function playWordPronunciation(word, rate) {
    if (rate === undefined) {
        rate = 0.5;
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = 'en-US';
        utterance.rate = rate;
        utterance.pitch = 1.2;
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        if (englishVoice) {
            utterance.voice = englishVoice;
        }
        window.speechSynthesis.speak(utterance);
    }
}

// Show celebration overlay (same as listening.js)
function showCelebration(callback) {
    const messages = [
        "Very Well!",
        "You are so clever!",
        "I admire you so much!",
        "Amazing!",
        "Fantastic!",
        "Great job!",
        "You're a star!",
        "Wonderful!"
    ];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    const overlay = document.createElement('div');
    overlay.className = 'celebration-overlay';
    const content = document.createElement('div');
    content.className = 'celebration-content';
    content.innerHTML = `
        <div class="celebration-emoji">🧚</div>
        <div class="celebration-message">${randomMessage}</div>
    `;
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    setTimeout(function() {
        overlay.remove();
        if (callback) callback();
    }, 2000);
}

// Simple confetti effect (same as listening.js)
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
backBtn.addEventListener('click', function() {
    window.location.href = 'index.html';
});

// Initialize on load
window.addEventListener('load', function() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = function() {
            window.speechSynthesis.getVoices();
        };
    }
    initMatchingGame();
});

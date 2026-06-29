// 风俗文化数据 - 用于"看标志猜国家"游戏 + "文化列表"学习模块
const CULTURE_DATA = [
  // ===== 中国 =====
  {
    id: "china_panda",
    country: "China",
    image: "custom/panda.jpeg",
    hint: "熊猫",
    content:
      "熊猫是中国独有的珍稀动物，被称为中国的国宝。它们生活在中国四川、陕西和甘肃的山区，以竹子为主食。熊猫圆圆的脸蛋和黑白相间的皮毛非常可爱，全世界的人都喜欢它们。熊猫是中国的重要象征，代表着和平与友谊。",
  },
  {
    id: "china_great_wall",
    country: "China",
    image: "custom/great_wall.jpeg",
    hint: "长城",
    content:
      "长城是中国古代建造的巨大防御工程，全长超过两万公里，被称为世界第八大奇迹。它像一条巨龙蜿蜒在中国的群山之间，已经有两千多年的历史。长城是中国悠久历史和伟大智慧的象征，也是世界上最著名的建筑之一。",
  },
  {
    id: "china_chinese_knot",
    country: "China",
    image: "custom/Chinese_knot.jpeg",
    hint: "中国结",
    content:
      "中国结是中国传统的手工编织工艺品，用一根绳子通过巧妙的编织形成各种美丽的图案。中国结寓意着团结、幸福和美好的祝愿，常常出现在春节和喜庆的场合。它是中国传统文化的代表之一，充满了浓浓的东方韵味。",
  },

  // ===== 美国 =====
  {
    id: "usa_liberty_statue",
    country: "America",
    image: "custom/liberty_statue.jpeg",
    hint: "自由女神像",
    content:
      "自由女神像是美国最著名的标志之一，坐落在纽约港的自由岛上。这座巨大的雕像由法国人民赠送给美国，象征着自由和友谊。女神手中高举火炬，照亮了世界各地追求自由的人们。它是美国精神的代表，欢迎着来自世界各地的游客。",
  },
  {
    id: "usa_white_house",
    country: "America",
    image: "custom/white_house.jpeg",
    hint: "白宫",
    content:
      "白宫是美国总统的办公和居住的地方，位于华盛顿特区。这座白色的新古典风格建筑是美国政治权力的中心，已经有两百多年的历史。白宫不仅象征着美国的领导力，也是世界上最有名的建筑之一，吸引了无数游客前来参观。",
  },
  {
    id: "usa_mount_rushmore",
    country: "America",
    image: "custom/mount_rushmore.jpeg",
    hint: "总统山",
    content:
      "总统山位于美国南达科他州，在巨大的花岗岩山体上雕刻着四位美国历史上最著名的总统——华盛顿、杰斐逊、林肯和西奥多·罗斯福。这项伟大的工程代表了美国对自由和民主的追求，是美国家喻户晓的标志性景观。",
  },

  // ===== 日本 =====
  {
    id: "japan_fuji_mount",
    country: "Japan",
    image: "custom/Fuji_mount.jpeg",
    hint: "富士山",
    content:
      "富士山是日本最高、最著名的山峰，海拔3776米，也是一座活火山。它的山形像一把倒挂的扇子，山顶常年积雪，十分美丽。富士山是日本的精神象征，出现在无数的绘画、诗歌和故事中，是日本人心中最神圣的地方之一。",
  },
  {
    id: "japan_sakura",
    country: "Japan",
    image: "custom/sakura.jpeg",
    hint: "樱花",
    content:
      "樱花是日本的国花，每年春天，粉白色的樱花盛开，整个日本都沉浸在浪漫的花海之中。日本人喜欢在樱花树下聚会、赏花，这被称为'花见'。樱花象征着重生和美好，也提醒人们珍惜短暂而灿烂的生命，是日本文化中最重要的花朵。",
  },
  {
    id: "japan_sushi",
    country: "Japan",
    image: "custom/sushi.jpeg",
    hint: "寿司",
    content:
      "寿司是日本最著名的传统美食，用醋调味的米饭配上新鲜的生鱼片、海鲜或蔬菜制作而成。寿司不仅在日本广受欢迎，也风靡全世界。它体现了日本人对食材新鲜度和制作工艺的极致追求，是日本饮食文化的代表。",
  },

  // ===== 英国 =====
  {
    id: "uk_big_ben",
    country: "England",
    image: "custom/big_ben.jpeg",
    hint: "大本钟",
    content:
      "大本钟是英国伦敦最著名的地标，位于议会大厦的钟楼上。它其实是钟楼里那口大钟的名字，钟声浑厚悠扬，每隔一小时敲响一次。大本钟是英国历史和文化的象征，也是伦敦最受欢迎的打卡景点，全世界的人都认识它。",
  },
  {
    id: "uk_london_tower",
    country: "England",
    image: "custom/London_tower.jpeg",
    hint: "伦敦塔",
    content:
      "伦敦塔是英国伦敦一座历史悠久的城堡，坐落在泰晤士河畔。它曾经是皇家宫殿、监狱甚至动物园，英国历史上许多重要事件都发生在这里。现在伦敦塔里还保存着英国王室的珍贵珠宝，是了解英国历史的好去处。",
  },
  {
    id: "uk_thames_river",
    country: "England",
    image: "custom/Thames_river.jpeg",
    hint: "泰晤士河",
    content:
      "泰晤士河是英国最长的河流，流经伦敦市中心，被称为'英国的母亲河'。它见证了英国两千多年的历史，两岸有大本钟、伦敦塔桥等著名建筑。泰晤士河是英国重要的水路交通要道，也是伦敦最美丽的风景线之一。",
  },

  // ===== 法国 =====
  {
    id: "france_eiffel_tower",
    country: "France",
    image: "custom/Eiffel_tower.jpeg",
    hint: "埃菲尔铁塔",
    content:
      "埃菲尔铁塔是法国巴黎最著名的地标，也是全世界最受欢迎的建筑之一。它由钢铁建造而成，高324米，是1889年为世界博览会而建的。埃菲尔铁塔是法国浪漫和艺术的象征，夜晚时分，塔身灯光闪烁，美不胜收。",
  },
  {
    id: "france_triumphal_arch",
    country: "France",
    image: "custom/triumphal_arch.jpeg",
    hint: "凯旋门",
    content:
      "凯旋门是法国巴黎的一座雄伟建筑，位于戴高乐广场的中心。它由拿破仑下令建造，用以纪念法国军队的胜利和荣誉。凯旋门上有精美的浮雕，记录着法国历史上的重要战役，是法国爱国主义精神的象征。",
  },
  {
    id: "france_rooster",
    country: "France",
    image: "custom/rooster.jpeg",
    hint: "高卢雄鸡",
    content:
      "高卢雄鸡是法国的国家象征之一。古代法国地区被称为'高卢'，在拉丁语中'高卢人'和'公鸡'是同一个词，所以公鸡就成了法国的标志。雄鸡代表着机警和勇敢，出现在法国体育代表团、硬币和许多官方场合上。",
  },

  // ===== 意大利 =====
  {
    id: "italy_pisa_tower",
    country: "Italy",
    image: "custom/Pisa_tower.jpeg",
    hint: "比萨斜塔",
    content:
      "比萨斜塔是意大利比萨市的一座钟楼，因为地基不均匀而著名地倾斜了数百年。这座白色大理石建造的塔楼高约56米，虽然倾斜但始终没有倒塌，吸引了全世界的游客来一睹它的风采。它是意大利建筑史上的奇观。",
  },
  {
    id: "italy_colosseum",
    country: "Italy",
    image: "custom/Colosseum.jpeg",
    hint: "罗马斗兽场",
    content:
      "罗马斗兽场是古罗马时期最大的圆形剧场，位于意大利罗马市中心，已经有近两千年的历史。它曾经可以容纳五万名观众观看角斗士表演和竞技比赛。虽然历经岁月的洗礼，但斗兽场依然是罗马辉煌文明的见证。",
  },
  {
    id: "italy_spaghetti",
    country: "Italy",
    image: "custom/spaghetti.jpeg",
    hint: "意大利面",
    content:
      "意大利面是意大利最著名的美食之一，用硬质小麦粉制作成细长的面条，搭配各种酱汁食用。意大利面是意大利人餐桌上不可缺少的主食，也在全世界广受欢迎。它代表了意大利人对美食的热爱和对生活的热情。",
  },

  // ===== 埃及 =====
  {
    id: "egypt_pyramid",
    country: "Egypt",
    image: "custom/pyramid.jpeg",
    hint: "金字塔",
    content:
      "金字塔是古埃及法老为自己修建的巨大陵墓，位于埃及的吉萨高原上。其中最著名的胡夫金字塔高达146米，是古代世界七大奇迹中唯一保存至今的。金字塔代表了古埃及人卓越的建筑智慧和他们对永生的追求。",
  },
  {
    id: "egypt_sphinx",
    country: "Egypt",
    image: "custom/Sphinx.jpeg",
    hint: "狮身人面像",
    content:
      "狮身人面像是埃及最著名的雕像之一，位于吉萨金字塔群附近。它长73米，高20米，有着狮子的身体和法老的面孔，象征着智慧与力量。狮身人面像已经在沙漠中守护了四千多年，是古埃及文明最神秘的代表之一。",
  },
  {
    id: "egypt_obelisk",
    country: "Egypt",
    image: "custom/obelisk.jpeg",
    hint: "方尖碑",
    content:
      "方尖碑是古埃及人建造的纪念碑，用一整块巨大的花岗岩雕刻而成，顶端呈金字塔形。方尖碑上刻满了象形文字，记录着法老的功绩和对太阳神的崇拜。它是古埃及文明的重要标志，后来也被许多国家当作艺术品收藏。",
  },

  // ===== 澳大利亚 =====
  {
    id: "australia_kangaroo",
    country: "Australia",
    image: "custom/kangaroo.jpeg",
    hint: "袋鼠",
    content:
      "袋鼠是澳大利亚最具代表性的动物，它们有着强壮的后腿和长长的尾巴，可以跳跃得很远很高。袋鼠妈妈胸前有一个育儿袋，小袋鼠在袋子里长大。袋鼠是澳大利亚的国徽上的动物之一，象征着澳大利亚的独特自然生态。",
  },
  {
    id: "australia_opera_house",
    country: "Australia",
    image: "custom/Sydney_opera_house.jpeg",
    hint: "悉尼歌剧院",
    content:
      "悉尼歌剧院是澳大利亚悉尼最著名的地标，坐落在悉尼港的半岛上。它的屋顶像一片片白色的贝壳，又像扬起的风帆，造型非常独特。悉尼歌剧院是世界级的艺术表演中心，代表了澳大利亚现代化的建筑艺术和文化活力。",
  },
  {
    id: "australia_koala",
    country: "Australia",
    image: "custom/koala.jpeg",
    hint: "考拉",
    content:
      "考拉是澳大利亚特有的可爱动物，长着毛茸茸的大耳朵和圆圆的鼻子，每天要睡18到20个小时。它们以桉树叶为食，几乎从不喝水，所以考拉在土著语中的意思就是'不喝水'。考拉是澳大利亚最受欢迎的动物明星之一。",
  },

  // ===== 巴西 =====
  {
    id: "brazil_football",
    country: "Brazil",
    image: "custom/football.jpeg",
    hint: "足球",
    content:
      "足球是巴西最受欢迎的运动，被称为'足球王国'。巴西国家足球队是全世界最成功的球队之一，曾经五次获得世界杯冠军。足球不仅是巴西人的骄傲，也是他们生活中最重要的娱乐方式，巴西街头到处都能看到孩子们在踢球。",
  },
  {
    id: "brazil_samba",
    country: "Brazil",
    image: "custom/samba.jpeg",
    hint: "桑巴舞",
    content:
      "桑巴舞是巴西最具代表性的舞蹈，起源于非洲，融合了巴西土著和欧洲的元素。桑巴舞节奏欢快、舞姿热情奔放，每年狂欢节期间，成千上万的人在街头跳桑巴舞庆祝。桑巴舞是巴西人快乐和自由的象征。",
  },
  {
    id: "brazil_scarlet_macaw",
    country: "Brazil",
    image: "custom/scarlet_macaw.jpeg",
    hint: "金刚鹦鹉",
    content:
      "金刚鹦鹉是巴西热带雨林中最美丽的鸟类之一，羽毛鲜红、蓝黄相间，色彩非常艳丽。它们生活在亚马逊雨林中，以水果和坚果为食。金刚鹦鹉是巴西丰富多彩的自然环境的代表，也是南美洲最有名的鹦鹉种类。",
  },

  // ===== 土耳其 =====
  {
    id: "turkey_hagia_sophia",
    country: "Turkey",
    image: "custom/Hagia_sophia_mosque.jpeg",
    hint: "圣索菲亚大清真寺",
    content:
      "圣索菲亚大清真寺位于土耳其伊斯坦布尔，是一座有着一千五百多年历史的伟大建筑。它曾经是教堂，后来变成了清真寺，现在已成为博物馆。巨大的穹顶和金碧辉煌的装饰让人惊叹，是土耳其最著名的历史遗迹之一。",
  },
  {
    id: "turkey_topkapi_palace",
    country: "Turkey",
    image: "custom/Topkapi_palace.jpeg",
    hint: "托普卡帕宫",
    content:
      "托普卡帕宫是土耳其伊斯坦布尔的一座古老宫殿，曾是奥斯曼帝国苏丹的居所和行政中心。宫殿里装饰着精美的瓷砖和宝石，展示了奥斯曼帝国数百年的辉煌。这座宫殿博物馆现在是了解土耳其历史和皇室生活的重要场所。",
  },
  {
    id: "turkey_blue_eye",
    country: "Turkey",
    image: "custom/blue_eye.jpeg",
    hint: "蓝眼睛护身符",
    content:
      "蓝眼睛是土耳其著名的护身符，由蓝色的玻璃制成，中间有一个黑色的'瞳孔'。土耳其人相信它能够抵御'邪恶之眼'，带来好运和保护。蓝眼睛是土耳其文化中最重要的吉祥物，也是游客最喜欢购买的纪念品。",
  },

  // ===== 西班牙 =====
  {
    id: "spain_bullfight",
    country: "Spain",
    image: "custom/bullfight.jpeg",
    hint: "斗牛",
    content:
      "斗牛是西班牙最著名的传统活动，起源于古代，已经有数百年的历史。勇士在斗牛场上用红布与公牛仔进行激烈的搏斗，展现勇气和技艺。斗牛是西班牙文化中最具争议但也最具代表性的部分，体现了西班牙人奔放的性格。",
  },
  {
    id: "spain_sagrada_familia",
    country: "Spain",
    image: "custom/Sagrada_Familia.jpeg",
    hint: "圣家堂",
    content:
      "圣家堂是西班牙巴塞罗那最著名的教堂，由天才建筑师高迪设计，修建了一百多年仍未完工。教堂的塔楼高耸入云，外墙上有精美的雕刻，内部像一座奇幻的森林。圣家堂是人类建筑史上的奇迹，代表了西班牙的艺术创造力。",
  },
  {
    id: "spain_pomegranate_flower",
    country: "Spain",
    image: "custom/pomegranate_flower.jpeg",
    hint: "石榴花",
    content:
      "石榴花是西班牙的国花，在西班牙的庭院和街头到处都能看到它们火红色的花朵。石榴在西班牙语中叫做'格拉纳达'，也是一座著名城市的名字。石榴花象征着热情和繁荣，代表了西班牙人热烈如火的性格。",
  },

  // ===== 希腊 =====
  {
    id: "greece_athens_acropolis",
    country: "Greece",
    image: "custom/Athens_Acropolis.jpeg",
    hint: "雅典卫城",
    content:
      "雅典卫城是希腊最著名的古代建筑群，位于雅典城中心的一座小山上。其中最著名的帕特农神庙是为雅典娜女神修建的，至今已有两千五百多年的历史。雅典卫城是古希腊文明的象征，是西方文化的摇篮。",
  },
  {
    id: "greece_olive_branch",
    country: "Greece",
    image: "custom/olive_branch.jpeg",
    hint: "橄榄枝",
    content:
      "橄榄枝是希腊最重要的象征之一，在古希腊奥运会上，胜利者会被戴上橄榄枝编成的花环。橄榄树在希腊有着悠久的种植历史，出产的橄榄油享誉世界。橄榄枝代表着和平与荣誉，也是希腊自然和文化的双重象征。",
  },
  {
    id: "greece_prometheus",
    country: "Greece",
    image: "custom/Prometheus.jpeg",
    hint: "普罗米修斯",
    content:
      "普罗米修斯是古希腊神话中最著名的英雄之一，他从天神那里偷来了火种送给人类，因此受到了严厉的惩罚。普罗米修斯象征着牺牲和奉献精神，是希腊神话中追求光明和文明的代表，他的故事全世界都广为流传。",
  },

  // ===== 墨西哥 =====
  {
    id: "mexico_cactus",
    country: "Mexico",
    image: "custom/cactus.jpeg",
    hint: "仙人掌",
    content:
      "仙人掌是墨西哥的国花，墨西哥有世界上最多的仙人掌品种，在沙漠和荒野中随处可见。仙人掌生命力极强，在干旱的环境中也能生存。它代表了墨西哥人的坚强和顽强，也是墨西哥国旗和国徽上的重要图案。",
  },
  {
    id: "mexico_day_of_dead",
    country: "Mexico",
    image: "custom/Day_of_the_Dead.jpeg",
    hint: "亡灵节",
    content:
      "亡灵节是墨西哥最重要的传统节日，每年11月初举行。人们用彩色骷髅和万寿菊装饰祭坛，欢迎逝去的亲人灵魂回家。这个节日虽然名字听起来有点悲伤，但实际上是欢乐的庆祝活动，体现了墨西哥人对生命和死亡的独特理解。",
  },
  {
    id: "mexico_mayan_civilization",
    country: "Mexico",
    image: "custom/Mayan_civilization.jpeg",
    hint: "玛雅文明",
    content:
      "玛雅文明是古代美洲最辉煌的文明之一，在今天墨西哥的尤卡坦半岛上留下了许多宏伟的金字塔和天文台。玛雅人创造了复杂的文字和精准的历法，在天文学和数学方面有着非常高的成就。玛雅文明是墨西哥历史的重要组成部分。",
  },

  // ===== 挪威 =====
  {
    id: "norway_fjord",
    country: "Norway",
    image: "custom/fjord.jpeg",
    hint: "峡湾",
    content:
      "峡湾是挪威最著名的自然景观，由冰川在山谷中雕刻而成，海水深入内陆形成狭长的海湾。挪威的峡湾风光美不胜收，被联合国教科文组织列为世界自然遗产。峡湾是挪威大自然鬼斧神工的杰作，也是挪威最引以为傲的风景。",
  },
  {
    id: "norway_viking_longship",
    country: "Norway",
    image: "custom/Viking_longship.jpeg",
    hint: "维京长船",
    content:
      "维京长船是古代挪威人——维京海盗使用的船只，船身细长、首尾翘起，可以在海洋和河流中快速航行。维京人乘坐这种船从北欧出发，远航到欧洲各地甚至到达了美洲。维京长船代表着挪威人勇敢探索的航海精神。",
  },
  {
    id: "norway_aurora",
    country: "Norway",
    image: "custom/aurora.jpeg",
    hint: "极光",
    content:
      "极光是挪威最神奇的自然奇观，在北极圈附近的夜空中，绿色、粉色和紫色的光芒像舞动的帷幕。极光是由太阳风与地球大气层碰撞产生的自然现象，美得令人惊叹。挪威是世界上观赏极光最好的地方之一。",
  },

  // ===== 以色列 =====
  {
    id: "israel_tower_of_david",
    country: "Israel",
    image: "custom/tower_of_david.jpeg",
    hint: "大卫塔",
    content:
      "大卫塔是耶路撒冷古城中的一座古老城堡，由大希律王修建，已经有超过两千年的历史。大卫塔的城墙厚重坚固，见证了耶路撒冷从古至今的风云变幻。现在这里是耶路撒冷历史博物馆，讲述着这座圣城的千年故事。",
  },
  {
    id: "israel_wailing_wall",
    country: "Israel",
    image: "custom/wailing_wall.jpeg",
    hint: "哭墙",
    content:
      "哭墙位于耶路撒冷，是古代犹太圣殿仅存的一段墙壁，已经有两千多年的历史。世界各地的犹太人都会来到这里祈祷，把心愿写在纸条上塞进墙缝里。哭墙是犹太教最神圣的地方，承载着犹太民族数千年的记忆和信仰。",
  },
  {
    id: "israel_jesus",
    country: "Israel",
    image: "custom/Jesus.jpeg",
    hint: "耶稣",
    content:
      "耶稣是基督教的创始人和核心人物，他出生在以色列的伯利恒，在以色列各地传道和行善。耶稣教人爱人如己、宽恕他人，他的教导影响了全世界几十亿人。以色列是耶稣生活和传道的地方，至今仍保留着许多与他相关的遗迹。",
  },

  // ===== 智利 =====
  {
    id: "chile_easter_island_stone",
    country: "Chile",
    image: "custom/Easter_Island_Stone.jpeg",
    hint: "复活节岛石像",
    content:
      "复活节岛石像位于智利的复活节岛上，岛上有数百尊巨大的石像，叫做'摩艾'。这些石像高达数米，由古代的岛民用火山石雕刻而成，它们面朝大海，神情庄严肃穆。这些石像是世界未解之谜，也是智利最神秘的文化遗产。",
  },
  {
    id: "chile_andean_condor",
    country: "Chile",
    image: "custom/Andean_condor.jpeg",
    hint: "安第斯神鹰",
    content:
      "安第斯神鹰是世界上最大的飞禽之一，生活在南美洲安第斯山脉的高空。它翼展可达三米，在蓝天上翱翔的姿态十分壮观。安第斯神鹰是智利国徽上的标志，象征着力量、自由和安第斯山脉的雄壮之美。",
  },
  {
    id: "chile_chiloe_church",
    country: "Chile",
    image: "custom/Chiloe_Church.jpeg",
    hint: "奇洛埃教堂",
    content:
      "奇洛埃教堂是智利南部奇洛埃群岛上的古老木质教堂群，是联合国教科文组织的世界文化遗产。这些教堂用当地木材建造，融合了西班牙和土著建筑风格，色彩鲜艳、造型独特。它们是智利多元文化融合的完美体现。",
  },

  // ===== 乌克兰 =====
  {
    id: "ukraine_saint_sophia",
    country: "Ukraine",
    image: "custom/Saint_Sophia_Cathedral.jpeg",
    hint: "圣索菲亚大教堂",
    content:
      "圣索菲亚大教堂是乌克兰基辅最著名的东正教教堂，建于11世纪，已有近千年历史。教堂内部保存着完好的拜占庭风格马赛克和壁画，金碧辉煌。这座教堂是乌克兰历史的见证，也是东斯拉夫文明最重要的文化遗产之一。",
  },
  {
    id: "ukraine_vyshyvanka",
    country: "Ukraine",
    image: "custom/Vyshyvanka.jpeg",
    hint: "维希万卡传统服饰",
    content:
      "维希万卡是乌克兰的传统刺绣服饰，白色衣料上绣着精美的红色或黑色花纹。每一件维希万卡的图案都有独特的含义，代表着不同的地区和家族。乌克兰人在重要节日和婚礼上都会穿上维希万卡，它是乌克兰民族认同的重要标志。",
  },
  {
    id: "ukraine_sunflower",
    country: "Ukraine",
    image: "custom/sunflower.jpeg",
    hint: "向日葵",
    content:
      "向日葵是乌克兰的国花，乌克兰是世界上最大的葵花籽油生产国之一。每年夏天，乌克兰广袤的平原上开满了金色的向日葵花田，像一片金色的海洋。向日葵代表着阳光和希望，也象征着乌克兰这个'欧洲粮仓'的富饶。",
  },

  // ===== 葡萄牙 =====
  {
    id: "portugal_cape_roca",
    country: "Portugal",
    image: "custom/Cape_Roca.jpeg",
    hint: "罗卡角",
    content:
      "罗卡角是葡萄牙大陆的最西端，位于大西洋岸边，有'欧洲之角'之称。这里有一座古老的灯塔和一块纪念碑，上面写着葡萄牙诗人卡蒙斯的名句：'陆地在此结束，海洋从此开始'。罗卡角是葡萄牙航海大发现时代的象征。",
  },
  {
    id: "portugal_belem_tower",
    country: "Portugal",
    image: "custom/Belem_Tower.jpeg",
    hint: "贝伦塔",
    content:
      "贝伦塔是葡萄牙里斯本最著名的地标之一，位于太加斯河畔，是一座中世纪风格的防御塔楼。大航海时代，葡萄牙的探险家们正是从这里扬帆出发，开辟了通往印度和巴西的航路。贝伦塔见证了葡萄牙海上帝国的辉煌历史。",
  },
  {
    id: "portugal_ronaldo",
    country: "Portugal",
    image: "custom/Ronaldo.jpeg",
    hint: "C罗",
    content:
      "C罗是葡萄牙最著名的足球运动员，也是世界足坛历史上最伟大的球星之一。他出生于葡萄牙的马德拉岛，为葡萄牙国家队赢得了欧洲杯冠军。C罗是葡萄牙的全民偶像，他用勤奋和天赋激励了无数葡萄牙年轻人追逐梦想。",
  },

  // ===== 伊朗 =====
  {
    id: "iran_golestan_palace",
    country: "Iran",
    image: "custom/Golestan_palace.jpeg",
    hint: "古列斯坦王宫",
    content:
      "古列斯坦王宫是伊朗德黑兰最古老的皇家宫殿，建筑风格融合了波斯和欧洲元素，装饰着精美的彩色瓷砖和镜子。王宫曾经是卡扎尔王朝的皇宫，见证了伊朗近代历史的重要时刻。这里是了解伊朗皇家文化和建筑艺术的最佳场所。",
  },
  {
    id: "iran_khaju_bridge",
    country: "Iran",
    image: "custom/Khaju_bridge.jpeg",
    hint: "郝久古桥",
    content:
      "郝久古桥位于伊朗伊斯法罕，是一座修建于17世纪的古老石桥，也是当时的水坝和公共聚会场所。桥拱和桥梁上精美的壁画和砖雕展示了萨法维王朝时期的艺术成就。郝久古桥是伊朗最美丽的桥梁之一，充满了历史韵味。",
  },
  {
    id: "iran_chaharshanbe_suri",
    country: "Iran",
    image: "custom/Chaharshanbe_Suri.jpeg",
    hint: "跳火节",
    content:
      "跳火节是伊朗最古老的传统节日之一，在新年前最后一个星期二晚上举行。人们点燃篝火，从火堆上跳过去，口中念着'给黄色，取红色'，寓意驱走病痛和厄运，迎来健康和好运。跳火节展现了伊朗人对光明和纯洁的追求。",
  },

  // ===== 瑞典 =====
  {
    id: "sweden_nobel",
    country: "Sweden",
    image: "custom/Nobel.jpeg",
    hint: "诺贝尔奖",
    content:
      "诺贝尔奖是世界上最知名的奖项，由瑞典化学家诺贝尔设立，每年颁发给在物理、化学、医学、文学和和平方面做出杰出贡献的人。颁奖典礼在瑞典斯德哥尔摩举行。诺贝尔奖代表了人类智慧和文明的最高荣誉。",
  },
  {
    id: "sweden_stockholm_city_hall",
    country: "Sweden",
    image: "custom/Stockholm_city_hall.jpeg",
    hint: "斯德哥尔摩市政厅",
    content:
      "斯德哥尔摩市政厅是瑞典首都最著名的建筑之一，位于梅拉伦湖畔，每年诺贝尔奖颁奖晚宴都在这里举行。市政厅塔楼顶端有一个金色的王冠，代表了瑞典王国的尊严。它是瑞典建筑艺术的典范，也是国际盛会的举办地。",
  },
  {
    id: "sweden_dala_horse",
    country: "Sweden",
    image: "custom/Dala_horse.jpeg",
    hint: "达拉木马",
    content:
      "达拉木马是瑞典最著名的传统木工艺品，起源于瑞典中部的达拉纳地区。这些手工雕刻的木马涂着鲜艳的红、蓝、黄等颜色，花纹精美。达拉木马是瑞典文化的象征，代表着瑞典人的手工艺传统和对自然的热爱。",
  },

  // ===== 阿根廷 =====
  {
    id: "argentina_tango",
    country: "Argentina",
    image: "custom/tango.jpeg",
    hint: "探戈舞",
    content:
      "探戈舞是阿根廷最著名的舞蹈，起源于布宜诺斯艾利斯的码头区，融合了非洲、欧洲和南美土著的文化元素。探戈舞男女搭档，舞步缠绵悱恻、充满激情，被称为'三分钟的爱情'。探戈是阿根廷的灵魂，也是世界非物质文化遗产。",
  },
  {
    id: "argentina_che_guevara",
    country: "Argentina",
    image: "custom/Che_Guevara.jpeg",
    hint: "切·格瓦拉",
    content:
      "切·格瓦拉是阿根廷出生的革命家和英雄，后来成为古巴革命的核心人物之一。他为了理想和正义走遍南美洲和非洲，为穷人的权益而斗争。格瓦拉的头像成了全世界追求自由和公平的象征，是阿根廷最有名的历史人物之一。",
  },
  {
    id: "argentina_messi",
    country: "Argentina",
    image: "custom/Messi.jpeg",
    hint: "梅西",
    content:
      "梅西是阿根廷历史上最伟大的足球运动员，被全世界公认为'球王'。他从小在阿根廷罗萨里奥长大，带领阿根廷国家队赢得了2022年世界杯冠军。梅西是阿根廷人的骄傲，他的名字已经成为了阿根廷这个国家的名片。",
  },

  // ===== 德国 =====
  {
    id: "germany_oktoberfest",
    country: "Germany",
    image: "custom/Oktoberfest.jpeg",
    hint: "啤酒节",
    content:
      "啤酒节是德国慕尼黑最盛大的民间节日，每年九月底到十月初举行，已经有二百多年的历史。节日期间，人们穿着传统的巴伐利亚服装，喝啤酒、吃烤猪肘和椒盐卷饼，在巨大的帐篷里欢歌跳舞。啤酒节是德国快乐好客精神的体现。",
  },
  {
    id: "germany_marx",
    country: "Germany",
    image: "custom/Marx.jpeg",
    hint: "马克思",
    content:
      "马克思是德国历史上最著名的思想家之一，他创立了科学社会主义理论，撰写了影响世界的《资本论》和《共产党宣言》。马克思出生于德国特里尔，他的思想改变了全世界二十世纪的历史进程，是德国贡献给人类的最重要的思想家之一。",
  },
  {
    id: "germany_cologne_cathedral",
    country: "Germany",
    image: "custom/Cologne_Cathedral.jpeg",
    hint: "科隆大教堂",
    content:
      "科隆大教堂是德国科隆市最宏伟的哥特式教堂，也是德国最大的教堂。它始建于1248年，修建了六百多年才完工。大教堂的尖塔高157米，是世界上最壮观的教堂之一。科隆大教堂是德国历史和宗教信仰的活见证。",
  },

  // ===== 加拿大 =====
  {
    id: "canada_maple_leaf",
    country: "Canada",
    image: "custom/maple_leaf.jpeg",
    hint: "枫叶",
    content:
      "枫叶是加拿大最著名的象征，加拿大的国旗中央就有一片红色的枫叶。每年秋天，加拿大的枫叶变成红、橙、黄等绚丽的颜色，漫山遍野像燃烧的火焰。枫叶不仅美丽，还能制作成枫糖浆，是加拿大自然和文化中最重要的符号。",
  },
  {
    id: "canada_cn_tower",
    country: "Canada",
    image: "custom/CN_Tower.jpeg",
    hint: "国家电视塔",
    content:
      "国家电视塔位于加拿大多伦多，是西半球最高的独立建筑，高553米。塔顶有一个旋转餐厅和观景台，游客可以俯瞰多伦多全景和安大略湖。国家电视塔是现代工程的杰作，也是加拿大现代化成就的标志性建筑。",
  },
  {
    id: "canada_beaver",
    country: "Canada",
    image: "custom/beaver.jpeg",
    hint: "海狸",
    content:
      "海狸是加拿大的国家动物，它们天生就是建筑师，能用树枝和泥土在河流中修建水坝和巢穴。海狸的皮毛厚实，在历史上曾是加拿大早期毛皮贸易的重要资源。海狸象征着勤劳和智慧，是加拿大人与自然和谐相处的代表。",
  },

  // ===== 俄罗斯 =====
  {
    id: "russia_bear",
    country: "Russia",
    image: "custom/bear.jpeg",
    hint: "熊",
    content:
      "熊是俄罗斯最有代表性的动物，被称为'俄罗斯的森林之王'。俄罗斯广阔的森林中生活着许多棕熊，它们体型庞大、力量惊人。熊象征着俄罗斯人的勇敢和坚毅，在很多故事和民间传说中，熊都是最受尊敬和喜爱的角色。",
  },
  {
    id: "russia_kremlin",
    country: "Russia",
    image: "custom/Kremlin.jpeg",
    hint: "克里姆林宫",
    content:
      "克里姆林宫是俄罗斯总统的办公地点，位于莫斯科市中心，是俄罗斯的象征。克里姆林宫由多座宫殿、教堂和高高的红墙构成，墙上分布着尖塔和红星。它已经有八百多年的历史，见证了俄罗斯从公国到帝国的全部历程。",
  },
  {
    id: "russia_winter_palace",
    country: "Russia",
    image: "custom/Winter_Palace.jpeg",
    hint: "冬宫",
    content:
      "冬宫是俄罗斯圣彼得堡最宏伟的宫殿，曾经是沙皇的冬季住所，现在是著名的埃尔米塔日博物馆。冬宫的外观是华丽的蓝白相间色彩，内部金碧辉煌，收藏着全世界最丰富的艺术品。冬宫代表了俄罗斯帝国曾经的辉煌与高贵。",
  },

  // ===== 印度 =====
  {
    id: "india_taj_mahal",
    country: "India",
    image: "custom/Taj_mahal.jpeg",
    hint: "泰姬陵",
    content:
      "泰姬陵是印度最著名的建筑，位于阿格拉市，是一座白色大理石建造的陵墓。它是莫卧儿帝国皇帝沙贾汗为心爱的皇后修建的，用了两万多名工匠、花费了二十多年才完工。泰姬陵被誉为'爱情的丰碑'，是印度最珍贵的文化遗产。",
  },
  {
    id: "india_railways",
    country: "India",
    image: "custom/Indian_Railways.jpeg",
    hint: "印度火车",
    content:
      "印度拥有亚洲最古老的铁路系统，火车是印度人最重要的长途交通工具。印度火车车厢常常坐满了人，车顶上也坐满了旅客，非常有特色。印度铁路贯穿全国每一个角落，连接着不同的城市和乡村，是印度庞大人口的生动写照。",
  },
  {
    id: "india_tachagata",
    country: "India",
    image: "custom/Tachagata.jpeg",
    hint: "如来",
    content:
      "如来是指佛陀释迦牟尼，他出生于古印度，是佛教的创始人。佛陀通过修行觉悟了人生的真理，教导人们通过慈悲和智慧摆脱痛苦。印度是佛教的发源地，至今仍保存着许多与佛陀有关的圣地和遗址，吸引了世界各地的信徒前来朝圣。",
  },
];

window.CULTURE_DATA = CULTURE_DATA;

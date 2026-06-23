// 风俗文化数据 - 用于"看标志猜国家"游戏
const CULTURE_DATA = [
  // ===== 中国 =====
  {
    id: "china_panda",
    country: "China",
    image: "custom/panda.jpeg",
    hint: "熊猫",
  },
  {
    id: "china_great_wall",
    country: "China",
    image: "custom/great_wall.jpeg",
    hint: "长城",
  },
  {
    id: "china_chinese_knot",
    country: "China",
    image: "custom/Chinese_knot.jpeg",
    hint: "中国结",
  },

  // ===== 美国 =====
  {
    id: "usa_liberty_statue",
    country: "America",
    image: "custom/liberty_statue.jpeg",
    hint: "自由女神像",
  },
  {
    id: "usa_white_house",
    country: "America",
    image: "custom/white_house.jpeg",
    hint: "白宫",
  },
  {
    id: "usa_mount_rushmore",
    country: "America",
    image: "custom/mount_rushmore.jpeg",
    hint: "总统山",
  },

  // ===== 日本 =====
  {
    id: "japan_fuji_mount",
    country: "Japan",
    image: "custom/Fuji_mount.jpeg",
    hint: "富士山",
  },
  {
    id: "japan_sakura",
    country: "Japan",
    image: "custom/sakura.jpeg",
    hint: "樱花",
  },
  {
    id: "japan_sushi",
    country: "Japan",
    image: "custom/sushi.jpeg",
    hint: "寿司",
  },

  // ===== 英国 =====
  {
    id: "uk_big_ben",
    country: "England",
    image: "custom/big_ben.jpeg",
    hint: "大本钟",
  },
  {
    id: "uk_london_tower",
    country: "England",
    image: "custom/London_tower.jpeg",
    hint: "伦敦塔",
  },
  {
    id: "uk_thames_river",
    country: "England",
    image: "custom/Thames_river.jpeg",
    hint: "泰晤士河",
  },

  // ===== 法国 =====
  {
    id: "france_eiffel_tower",
    country: "France",
    image: "custom/Eiffel_tower.jpeg",
    hint: "埃菲尔铁塔",
  },
  {
    id: "france_triumphal_arch",
    country: "France",
    image: "custom/triumphal_arch.jpeg",
    hint: "凯旋门",
  },
  {
    id: "france_rooster",
    country: "France",
    image: "custom/rooster.jpeg",
    hint: "高卢雄鸡",
  },

  // ===== 意大利 =====
  {
    id: "italy_pisa_tower",
    country: "Italy",
    image: "custom/Pisa_tower.jpeg",
    hint: "比萨斜塔",
  },
  {
    id: "italy_colosseum",
    country: "Italy",
    image: "custom/Colosseum.jpeg",
    hint: "罗马斗兽场",
  },
  {
    id: "italy_spaghetti",
    country: "Italy",
    image: "custom/spaghetti.jpeg",
    hint: "意大利面",
  },

  // ===== 埃及 =====
  {
    id: "egypt_pyramid",
    country: "Egypt",
    image: "custom/pyramid.jpeg",
    hint: "金字塔",
  },
  {
    id: "egypt_sphinx",
    country: "Egypt",
    image: "custom/Sphinx.jpeg",
    hint: "狮身人面像",
  },
  {
    id: "egypt_obelisk",
    country: "Egypt",
    image: "custom/obelisk.jpeg",
    hint: "方尖碑",
  },

  // ===== 澳大利亚 =====
  {
    id: "australia_kangaroo",
    country: "Australia",
    image: "custom/kangaroo.jpeg",
    hint: "袋鼠",
  },
  {
    id: "australia_opera_house",
    country: "Australia",
    image: "custom/Sydney_opera_house.jpeg",
    hint: "悉尼歌剧院",
  },
  {
    id: "australia_koala",
    country: "Australia",
    image: "custom/koala.jpeg",
    hint: "考拉",
  },

  // ===== 巴西 =====
  {
    id: "brazil_football",
    country: "Brazil",
    image: "custom/football.jpeg",
    hint: "足球",
  },
  {
    id: "brazil_samba",
    country: "Brazil",
    image: "custom/samba.jpeg",
    hint: "桑巴舞",
  },
  {
    id: "brazil_scarlet_macaw",
    country: "Brazil",
    image: "custom/scarlet_macaw.jpeg",
    hint: "金刚鹦鹉",
  },

  // ===== 土耳其 =====
  {
    id: "turkey_hagia_sophia",
    country: "Turkey",
    image: "custom/Hagia_sophia_mosque.jpeg",
    hint: "圣索菲亚大清真寺",
  },
  {
    id: "turkey_topkapi_palace",
    country: "Turkey",
    image: "custom/Topkapi_palace.jpeg",
    hint: "托普卡帕宫",
  },
  {
    id: "turkey_blue_eye",
    country: "Turkey",
    image: "custom/blue_eye.jpeg",
    hint: "蓝眼睛护身符",
  },

  // ===== 西班牙 =====
  {
    id: "spain_bullfight",
    country: "Spain",
    image: "custom/bullfight.jpeg",
    hint: "斗牛",
  },
  {
    id: "spain_sagrada_familia",
    country: "Spain",
    image: "custom/Sagrada_Familia.jpeg",
    hint: "圣家堂",
  },
  {
    id: "spain_pomegranate_flower",
    country: "Spain",
    image: "custom/pomegranate_flower.jpeg",
    hint: "石榴花",
  },

  // ===== 希腊 =====
  {
    id: "greece_athens_acropolis",
    country: "Greece",
    image: "custom/Athens_Acropolis.jpeg",
    hint: "雅典卫城",
  },
  {
    id: "greece_olive_branch",
    country: "Greece",
    image: "custom/olive_branch.jpeg",
    hint: "橄榄枝",
  },
  {
    id: "greece_prometheus",
    country: "Greece",
    image: "custom/Prometheus.jpeg",
    hint: "普罗米修斯",
  },

  // ===== 墨西哥 =====
  {
    id: "mexico_cactus",
    country: "Mexico",
    image: "custom/cactus.jpeg",
    hint: "仙人掌",
  },
  {
    id: "mexico_day_of_dead",
    country: "Mexico",
    image: "custom/Day_of_the_Dead.jpeg",
    hint: "亡灵节",
  },
  {
    id: "mexico_mayan_civilization",
    country: "Mexico",
    image: "custom/Mayan_civilization.jpeg",
    hint: "玛雅文明",
  },

  // ===== 挪威 =====
  {
    id: "norway_fjord",
    country: "Norway",
    image: "custom/fjord.jpeg",
    hint: "峡湾",
  },
  {
    id: "norway_viking_longship",
    country: "Norway",
    image: "custom/Viking_longship.jpeg",
    hint: "维京长船",
  },
  {
    id: "norway_aurora",
    country: "Norway",
    image: "custom/aurora.jpeg",
    hint: "极光",
  },

  // ===== 以色列 =====
  {
    id: "israel_dead_sea",
    country: "Israel",
    image: "custom/dead_sea.jpeg",
    hint: "死海",
  },
  {
    id: "israel_wailing_wall",
    country: "Israel",
    image: "custom/wailing_wall.jpeg",
    hint: "哭墙",
  },
  {
    id: "israel_jesus",
    country: "Israel",
    image: "custom/Jesus.jpeg",
    hint: "耶稣",
  },

  // ===== 智利 =====
  {
    id: "chile_easter_island_stone",
    country: "Chile",
    image: "custom/Easter_Island_Stone.jpeg",
    hint: "复活节岛石像",
  },
  {
    id: "chile_andean_condor",
    country: "Chile",
    image: "custom/Andean_condor.jpeg",
    hint: "安第斯神鹰",
  },
  {
    id: "chile_chiloe_church",
    country: "Chile",
    image: "custom/Chiloe_Church.jpeg",
    hint: "奇洛埃教堂",
  },

  // ===== 乌克兰 =====
  {
    id: "ukraine_saint_sophia",
    country: "Ukraine",
    image: "custom/Saint_Sophia_Cathedral.jpeg",
    hint: "圣索菲亚大教堂",
  },
  {
    id: "ukraine_vyshyvanka",
    country: "Ukraine",
    image: "custom/Vyshyvanka.jpeg",
    hint: "维希万卡传统服饰",
  },
  {
    id: "ukraine_sunflower",
    country: "Ukraine",
    image: "custom/sunflower.jpeg",
    hint: "向日葵",
  },

  // ===== 葡萄牙 =====
  {
    id: "portugal_cape_roca",
    country: "Portugal",
    image: "custom/Cape_Roca.jpeg",
    hint: "罗卡角",
  },
  {
    id: "portugal_belem_tower",
    country: "Portugal",
    image: "custom/Belem_Tower.jpeg",
    hint: "贝伦塔",
  },
  {
    id: "portugal_ronaldo",
    country: "Portugal",
    image: "custom/Ronaldo.jpeg",
    hint: "C罗",
  },

  // ===== 伊朗 =====
  {
    id: "iran_golestan_palace",
    country: "Iran",
    image: "custom/Golestan_palace.jpeg",
    hint: "古列斯坦王宫",
  },
  {
    id: "iran_khaju_bridge",
    country: "Iran",
    image: "custom/Khaju_bridge.jpeg",
    hint: "郝久古桥",
  },
  {
    id: "iran_chaharshanbe_suri",
    country: "Iran",
    image: "custom/Chaharshanbe_Suri.jpeg",
    hint: "跳火节",
  },

  // ===== 瑞典 =====
  {
    id: "sweden_nobel",
    country: "Sweden",
    image: "custom/Nobel.jpeg",
    hint: "诺贝尔奖",
  },
  {
    id: "sweden_stockholm_city_hall",
    country: "Sweden",
    image: "custom/Stockholm_city_hall.jpeg",
    hint: "斯德哥尔摩市政厅",
  },
  {
    id: "sweden_dala_horse",
    country: "Sweden",
    image: "custom/Dala_horse.jpeg",
    hint: "达拉木马",
  },

  // ===== 阿根廷 =====
  {
    id: "argentina_tango",
    country: "Argentina",
    image: "custom/tango.jpeg",
    hint: "探戈舞",
  },
  {
    id: "argentina_che_guevara",
    country: "Argentina",
    image: "custom/Che_Guevara.jpeg",
    hint: "切·格瓦拉",
  },
  {
    id: "argentina_messi",
    country: "Argentina",
    image: "custom/Messi.jpeg",
    hint: "梅西",
  },

  // ===== 德国 =====
  {
    id: "germany_oktoberfest",
    country: "Germany",
    image: "custom/Oktoberfest.jpeg",
    hint: "啤酒节",
  },
  {
    id: "germany_marx",
    country: "Germany",
    image: "custom/Marx.jpeg",
    hint: "马克思",
  },
  {
    id: "germany_cologne_cathedral",
    country: "Germany",
    image: "custom/Cologne_Cathedral.jpeg",
    hint: "科隆大教堂",
  },

  // ===== 加拿大 =====
  {
    id: "canada_maple_leaf",
    country: "Canada",
    image: "custom/maple_leaf.jpeg",
    hint: "枫叶",
  },
  {
    id: "canada_cn_tower",
    country: "Canada",
    image: "custom/CN_Tower.jpeg",
    hint: "国家电视塔",
  },
  {
    id: "canada_beaver",
    country: "Canada",
    image: "custom/beaver.jpeg",
    hint: "海狸",
  },

  // ===== 俄罗斯 =====
  {
    id: "russia_bear",
    country: "Russia",
    image: "custom/bear.jpeg",
    hint: "熊",
  },
  {
    id: "russia_kremlin",
    country: "Russia",
    image: "custom/Kremlin.jpeg",
    hint: "克里姆林宫",
  },
  {
    id: "russia_winter_palace",
    country: "Russia",
    image: "custom/Winter_Palace.jpeg",
    hint: "冬宫",
  },

  // ===== 印度 =====
  {
    id: "india_taj_mahal",
    country: "India",
    image: "custom/Taj_mahal.jpeg",
    hint: "泰姬陵",
  },
  {
    id: "india_railways",
    country: "India",
    image: "custom/Indian_Railways.jpeg",
    hint: "印度火车",
  },
  {
    id: "india_tachagata",
    country: "India",
    image: "custom/Tachagata.jpeg",
    hint: "如来",
  },
];

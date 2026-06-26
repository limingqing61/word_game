// ========== 歌曲数据 ==========
// 音符说明: 1=Do, 2=Re, 3=Mi, 4=Fa, 5=Sol, 6=La, 7=Si, 8=高音Do'
// 7 表示低音Si（在8音阶琴中表现为最低音）

const MUSIC_DATA = {
  songs: [
    {
      id: "shangxuege",
      title: "上学歌",
      titleEn: "Going to School",
      lines: [
        { lyric: "太阳当空照", notes: [1, 2, 3, 1, 5] },
        { lyric: "花儿对我笑", notes: [6, 6, 8, 6, 5] },
        {
          lyric: "小鸟说早早早",
          notes: [6, 6, 8, 5, 6, 5],
        },
        {
          lyric: "你为什么背上小书包",
          notes: [6, 5, 3, 5, 3, 1, 2, 3, 1],
        },
        { lyric: "我要上学校", notes: [1, 2, 3, 1, 5] },
        { lyric: "天天不迟到", notes: [6, 6, 8, 6, 5] },
        {
          lyric: "爱学习爱劳动",
          notes: [6, 6, 8, 5, 6, 5],
        },
        {
          lyric: "长大要为人民立功劳",
          notes: [6, 5, 3, 5, 3, 1, 2, 3, 1],
        },
      ],
    },
    {
      id: "woyoueryuan",
      title: "我上幼儿园",
      titleEn: "Going to Kindergarten",
      lines: [
        { lyric: "爸爸妈妈去上班", notes: [5, 5, 3, 3, 5, 6, 5] },
        { lyric: "我上幼儿园", notes: [3, 5, 6, 6, 5] },
        { lyric: "我不哭也不闹", notes: [3, 5, 6, 5, 6, 3] },
        { lyric: "叫声老师早", notes: [2, 5, 3, 2, 1] },
        { lyric: "爸爸妈妈去上班", notes: [5, 5, 3, 3, 5, 6, 5] },
        { lyric: "我上幼儿园", notes: [3, 5, 6, 6, 5] },
        { lyric: "我不哭也不闹", notes: [3, 5, 6, 5, 6, 3] },
        { lyric: "叫声老师早", notes: [2, 5, 3, 2, 1] },
      ],
    },
    {
      id: "xiaomaolv",
      title: "我有一只小毛驴",
      titleEn: "I Have a Little Donkey",
      lines: [
        {
          lyric: "我有一只小毛驴我",
          notes: [1, 1, 1, 3, 5, 5, 5, 5],
        },
        {
          lyric: "从来也不骑",
          notes: [6, 6, 6, 8, 5],
        },
        {
          lyric: "有一天我心血来潮",
          notes: [4, 4, 4, 6, 3, 3, 3, 5],
        },
        {
          lyric: "骑它去赶集",
          notes: [2, 2, 2, 2, 5],
        },
        {
          lyric: "我手里拿着小皮鞭我",
          notes: [5, 1, 1, 1, 3, 5, 5, 5, 5],
        },
        {
          lyric: "心里正得意",
          notes: [6, 6, 6, 8, 5],
        },
        {
          lyric: "不知怎么哗啦啦啦我",
          notes: [4, 4, 4, 6, 3, 3, 3, 3, 3, 3],
        },
        {
          lyric: "摔了一身泥",
          notes: [2, 2, 2, 3, 1],
        },
      ],
    },
    {
      id: "shuajiang",
      title: "粉刷匠",
      titleEn: "Painter",
      lines: [
        {
          lyric: "我是一个粉刷匠",
          notes: [5, 3, 5, 3, 5, 3, 1],
        },
        {
          lyric: "粉刷本领强",
          notes: [2, 4, 3, 2, 5],
        },
        {
          lyric: "我要把那新房子",
          notes: [5, 3, 5, 3, 5, 3, 1],
        },
        {
          lyric: "刷得很漂亮",
          notes: [2, 4, 3, 2, 1],
        },
        {
          lyric: "刷了房顶又刷墙",
          notes: [2, 2, 4, 4, 3, 1, 5],
        },
        {
          lyric: "刷子飞舞忙",
          notes: [2, 4, 3, 2, 5],
        },
        {
          lyric: "哎呀我的小鼻子",
          notes: [5, 3, 5, 3, 5, 3, 1],
        },
        {
          lyric: "变呀变了样",
          notes: [2, 4, 3, 2, 1],
        },
      ],
    },
    {
      id: "wohaomama",
      title: "我的好妈妈",
      titleEn: "My Good Mother",
      lines: [
        { lyric: "我的好妈妈", notes: [3, 3, 5, 2, 2, 1] },
        { lyric: "下班回到家", notes: [3, 3, 5, 6, 6, 5] },
        { lyric: "劳动了一天", notes: [2, 3, 5, 6, 3, 2, 3] },
        { lyric: "多么辛苦呀", notes: [5, -5, 5, 3, 2] },
        {
          lyric: "妈妈妈妈快坐下",
          notes: [3, 3, 3, 2, 1, -6, -5],
        },
        {
          lyric: "妈妈妈妈快坐下",
          notes: [3, 3, 3, 2, 1, -6, -5],
        },
        {
          lyric: "请喝一杯茶",
          notes: [-5, -6, 1, 2, 3],
        },
        {
          lyric: "让我亲亲你吧",
          notes: [5, 3, 5, 6, 6, 5, 3, 2],
        },
        {
          lyric: "让我亲亲你吧",
          notes: [5, 3, 5, 6, 6, 5, 3, 2],
        },
        {
          lyric: "我的好妈妈",
          notes: [-5, 3, 3, 2, 1],
        },
      ],
    },
    {
      id: "diushoujuan",
      title: "丢手绢",
      titleEn: "Drop the Handkerchief",
      lines: [
        {
          lyric: "丢丢丢手绢",
          notes: [5, 3, 5, 3, 5, 3, 2, 3, 5],
        },
        {
          lyric: "轻轻地放在",
          notes: [5, 5, 3, 6, 5],
        },
        {
          lyric: "小朋友的后面",
          notes: [3, 5, 3, 2, 1, 2],
        },
        {
          lyric: "大家不要告诉他",
          notes: [3, 5, 3, 2, 1, 2, 3],
        },
        {
          lyric: "快点快点抓住他",
          notes: [6, 5, 6, 5, 2, 3, 5],
        },
        { lyric: "快点快点抓住他", notes: [6, 5, 6, 5, 2, 3, 1] },
      ],
    },
    {
      id: "shuya",
      title: "数鸭子",
      titleEn: "Counting Ducks",
      lines: [
        {
          lyric: "门前大桥下",
          notes: [3, 1, 3, 3, 1],
        },
        {
          lyric: "游过一群鸭",
          notes: [3, 3, 5, 6, 5],
        },
        {
          lyric: "快来快来数一数",
          notes: [6, 6, 6, 5, 4, 4, 4],
        },
        {
          lyric: "二四六七八",
          notes: [2, 3, 2, 1, 2],
        },
        {
          lyric: "咕嘎咕嘎",
          notes: [3, 1, 3, 1],
        },
        {
          lyric: "真呀真多呀",
          notes: [3, 3, 5, 6, 6],
        },
        { lyric: "数不清到底", notes: [8, 5, 5, 6, 3] },
        { lyric: "多少鸭", notes: [2, 1, 2, 3, 5] },
        { lyric: "数不清到底", notes: [8, 5, 5, 6, 3] },
        { lyric: "多少鸭", notes: [2, 1, 2, 3, 1] },
      ],
    },
    {
      id: "yangwawa",
      title: "洋娃娃和小熊跳舞",
      titleEn: "Doll and Bear Dance",
      lines: [
        {
          lyric: "洋娃娃和小熊跳舞",
          notes: [1, 2, 3, 4, 5, 5, 5, 4, 3],
        },
        {
          lyric: "跳呀跳呀一二一",
          notes: [4, 4, 4, 3, 2, 1, 3, 5],
        },
        {
          lyric: "他们在跳圆圈舞呀",
          notes: [1, 2, 3, 4, 5, 5, 5, 4, 3],
        },
        {
          lyric: "跳呀跳呀一二一",
          notes: [4, 4, 4, 3, 2, 1, 3, 1],
        },
        {
          lyric: "小熊小熊点点头呀",
          notes: [6, 6, 6, 5, 4, 5, 5, 5, 4, 3],
        },
        {
          lyric: "点点头呀一二一",
          notes: [4, 4, 4, 3, 2, 1, 3, 5],
        },
        {
          lyric: "洋娃娃呀笑哈哈呀",
          notes: [6, 6, 6, 5, 4, 5, 5, 5, 4, 3],
        },
        {
          lyric: "笑哈哈呀一二一",
          notes: [4, 4, 4, 3, 2, 1, 3, 1],
        },
      ],
    },
    {
      id: "liangzhilaohu",
      title: "两只老虎",
      titleEn: "Two Tigers",
      lines: [
        { lyric: "两只老虎", notes: [1, 2, 3, 1] },
        { lyric: "两只老虎", notes: [1, 2, 3, 1] },
        { lyric: "跑得快", notes: [3, 4, 5] },
        { lyric: "跑得快", notes: [3, 4, 5] },
        {
          lyric: "一只没有耳朵",
          notes: [5, 6, 5, 4, 3, 1],
        },
        {
          lyric: "一只没有尾巴",
          notes: [5, 6, 5, 4, 3, 1],
        },
        { lyric: "真奇怪", notes: [2, 5, 1] },
        { lyric: "真奇怪", notes: [2, 5, 1] },
      ],
    },
    {
      id: "shengri",
      title: "生日快乐",
      titleEn: "Happy Birthday",
      lines: [
        { lyric: "祝你生日快乐", notes: [1, 1, 2, 1, 4, 3] },
        { lyric: "祝你生日快乐", notes: [1, 1, 2, 1, 5, 4] },
        { lyric: "祝你生日快乐", notes: [1, 1, 8, 6, 4, 3, 2] },
        { lyric: "祝你生日快乐", notes: [7, 7, 6, 4, 5, 4] },
      ],
    },
    {
      id: "xiaomeiman",
      title: "小美满",
      titleEn: "Little Happy",
      lines: [
        { lyric: "没什么大愿望", notes: [5, 5, 5, 3, 8, 5, 5] },
        { lyric: "没有什么事要赶", notes: [1, 6, 6, 6, 6, 5, 3] },
        { lyric: "看见路口红灯一直闪", notes: [1, 1, 1, -7, 1, 2, 3, 6, 5] },
        { lyric: "它像眨眼的小太阳", notes: [5, 1, 1, 1, 1, 1, 5, 3, 2] },
        { lyric: "乌云还挺大胆", notes: [5, 5, 5, 3, 8, 5, 5] },
        { lyric: "顶在头上吹不散", notes: [1, 6, 6, 6, 6, 5, 3] },
        {
          lyric: "我抓在手里捏成棉花糖",
          notes: [-5, 1, 1, 1, -7, 1, 2, 3, 6, 5, 5],
        },
        { lyric: "什么烦恼不能忘", notes: [1, 1, 1, 1, 1, -7, 1] },
        { lyric: "既然是路一定有转弯", notes: [2, 1, 2, 2, 2, 2, 2, 1, 3] },
        { lyric: "哪个风景都漂亮", notes: [1, 8, 8, 8, 8, 7, 5] },
        { lyric: "揉揉疲惫的眼睛", notes: [2, 2, 2, 2, 2, 1, 3] },
        {
          lyric: "停下来看一看美好简单",
          notes: [5, 6, 8, 8, 6, 6, 6, 3, 2, 1, 5],
        },
        {
          lyric: "你看小狗在叫树叶会笑",
          notes: [1, 2, 3, 2, 3, 3, 8, 8, 7, 5, 5, 2],
        },
        { lyric: "风声在呢喃", notes: [1, -7, 1, 1, 6, 5] },
        { lyric: "不如好好欣赏一秒", notes: [1, -7, 1, 1, 6, 6, 3, 2, 1] },
        { lyric: "迷迷糊糊的浪漫", notes: [1, 1, 1, 1, -6, 5, 3, 2] },
        {
          lyric: "只要一觉醒来床单洒满",
          notes: [1, 2, 3, 2, 3, 3, 8, 8, 7, 5, 5, 2],
        },
        { lyric: "阳光的温暖", notes: [1, -7, 1, 1, 6, 5, 5] },
        { lyric: "不去想不必想", notes: [6, 5, 1, 6, 5, 1, 1] },
        {
          lyric: "不用急急忙忙说一个答案",
          notes: [-6, 1, 5, 5, 5, 5, 5, 1, 1, -7, 1],
        },
      ],
    },
  ],
};

window.MUSIC_DATA = MUSIC_DATA;

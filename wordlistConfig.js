// 不重复声明，直接使用 window.wordData
if (!window.wordData) {
  console.error("❌ 请确保 wordData.js 在 wordlistConfig.js 之前加载");
}

// ========= 自动生成 wordList =========
const wordList = Object.keys(window.wordData).map((word) => ({
  word: word,
  image: window.wordData[word].image,
  chinese: window.wordData[word].chinese,
  color: window.wordData[word].color,
  type: wordData[word].type,
}));

// ========= 自动生成 phoneticMap =========
const phoneticMap = Object.fromEntries(
  Object.keys(window.wordData).map((word) => [
    word,
    window.wordData[word].phonetic,
  ]),
);

// ========= 自动生成 guideMap =========
const guideMap = Object.fromEntries(
  Object.keys(window.wordData).map((word) => [
    word,
    window.wordData[word].guide,
  ]),
);

// ========= 工具函数 =========
function getPhoneticSymbol(word) {
  return window.wordData[word]?.phonetic || `/${word}/`;
}

function getPronunciationGuide(word) {
  return window.wordData[word]?.guide || word;
}

// ========= 挂载全局（兼容旧代码） =========
window.wordList = wordList;
window.phoneticMap = phoneticMap;
window.guideMap = guideMap;
window.getPhoneticSymbol = getPhoneticSymbol;
window.getPronunciationGuide = getPronunciationGuide;

// 统一出口
window.__wordGame = {
  getPhoneticSymbol,
  wordList,
  phoneticMap,
  guideMap,
};

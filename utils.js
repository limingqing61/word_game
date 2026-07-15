// ========= 公共语音工具类 =========
const SpeechHelper = {
  // 获取最佳语音（优先 Samantha，其次 en-US，最后任意英语）
  getBestVoice() {
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find((v) => v.name === "Samantha");
    if (!voice) voice = voices.find((v) => v.lang === "en-US");
    if (!voice) voice = voices.find((v) => v.lang.startsWith("en"));
    return voice;
  },

  // 播放单词发音（统一入口）
  speak(word, rate = 0.7) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const speakNow = () => {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = Math.min(0.9, Math.max(0.6, rate));
      utterance.pitch = 1.0;
      utterance.volume = 1;
      const voice = this.getBestVoice();
      if (voice) utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    };

    // 如果语音列表还未加载，等待一下
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = speakNow;
    } else {
      speakNow();
    }
  },
};

// 兼容旧调用方式（如果你希望保留全局函数）
window.playWordPronunciation = function (word, rate) {
  SpeechHelper.speak(word, rate);
};

// ========== 公共导航工具 ==========

/**
 * 返回首页
 * 所有模块统一调用此函数，便于后续扩展（如：保存状态、弹出确认等）
 */
function goHome() {
  window.location.href = "index.html";
}

/**
 * 绑定返回首页按钮
 * @param {string|Element} selector - 按钮的选择器或DOM元素
 */
function bindGoHome(selector) {
  const btn =
    typeof selector === "string"
      ? document.getElementById(selector) || document.querySelector(selector)
      : selector;
  if (btn) {
    btn.addEventListener("click", goHome);
  }
}

// ========== 公共音效 ==========
let _audioCtx = null;

function _getAudioCtx() {
  if (!_audioCtx) {
    _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return _audioCtx;
}

function _resumeAudio() {
  const ctx = _getAudioCtx();
  if (ctx.state === "suspended") ctx.resume();
}

/**
 * 播放音效
 * @param {string} type - 'correct' | 'wrong'
 * @param {number} volume - 音量 0-1，默认 0.3
 */
function playSound(type, volume = 0.3) {
  try {
    const ctx = _getAudioCtx();
    _resumeAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(volume, ctx.currentTime);

    switch (type) {
      case "correct":
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3);
        osc.type = "sine";
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
        break;

      case "wrong":
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.setValueAtTime(300, ctx.currentTime + 0.2);
        osc.type = "sawtooth";
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
        break;

      case "action":
        // 短促清脆的"滴"声，代表操作反馈
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        osc.type = "sine";
        gain.gain.setValueAtTime(volume * 0.6, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
        break;

      default:
        break;
    }
  } catch (e) {
    // 静默失败，不影响游戏
  }
}

// 挂载到 window 供全局使用
window.playSound = playSound;

// ========== 收藏夹公共工具（共享存储） ==========
const FAVORITES_STORAGE_KEY = "wordlist_favorites";

/**
 * 获取所有收藏夹
 * @returns {Object} 收藏夹对象 { 收藏夹名: [单词列表] }
 */
function getAllFavorites() {
  const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return { 默认: [] };
    }
  }
  return { 默认: [] };
}

/**
 * 保存所有收藏夹
 * @param {Object} favorites - 收藏夹对象
 */
function saveAllFavorites(favorites) {
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
}

/**
 * 添加单词到指定收藏夹
 * @param {string} word - 单词
 * @param {string} favoriteName - 收藏夹名称
 * @returns {boolean} 是否添加成功
 */
function addToFavorite(word, favoriteName) {
  const favorites = getAllFavorites();
  if (!favorites[favoriteName]) {
    favorites[favoriteName] = [];
  }
  if (!favorites[favoriteName].includes(word)) {
    favorites[favoriteName].push(word);
    saveAllFavorites(favorites);
    return true;
  }
  return false;
}

/**
 * 从指定收藏夹移除单词
 * @param {string} word - 单词
 * @param {string} favoriteName - 收藏夹名称
 * @returns {boolean} 是否移除成功
 */
function removeFromFavorite(word, favoriteName) {
  const favorites = getAllFavorites();
  if (favorites[favoriteName]) {
    const index = favorites[favoriteName].indexOf(word);
    if (index !== -1) {
      favorites[favoriteName].splice(index, 1);
      // 如果收藏夹为空，保留空数组（不自动删除，让用户手动删除）
      saveAllFavorites(favorites);
      return true;
    }
  }
  return false;
}

/**
 * 删除整个收藏夹
 * @param {string} favoriteName - 要删除的收藏夹名称
 * @returns {boolean} 是否删除成功
 */
function deleteFavorite(favoriteName) {
  const favorites = getAllFavorites();
  if (!favorites[favoriteName]) return false;
  delete favorites[favoriteName];
  saveAllFavorites(favorites);
  return true;
}

/**
 * 重命名收藏夹
 * @param {string} oldName - 原名称
 * @param {string} newName - 新名称
 * @returns {boolean} 是否重命名成功
 */
function renameFavorite(oldName, newName) {
  if (!oldName || !newName || oldName === newName) return false;
  const favorites = getAllFavorites();
  if (!favorites[oldName]) return false;
  if (favorites[newName]) return false; // 新名称已存在
  favorites[newName] = favorites[oldName];
  delete favorites[oldName];
  saveAllFavorites(favorites);
  return true;
}

/**
 * 检查单词是否在指定收藏夹中
 * @param {string} word - 单词
 * @param {string} favoriteName - 收藏夹名称
 * @returns {boolean}
 */
function isWordInFavorite(word, favoriteName) {
  const favorites = getAllFavorites();
  return favorites[favoriteName]?.includes(word) || false;
}

// 挂载到 window 供全局使用
window.getAllFavorites = getAllFavorites;
window.saveAllFavorites = saveAllFavorites;
window.addToFavorite = addToFavorite;
window.removeFromFavorite = removeFromFavorite;
window.deleteFavorite = deleteFavorite;
window.renameFavorite = renameFavorite;
window.isWordInFavorite = isWordInFavorite;
window.FAVORITES_STORAGE_KEY = FAVORITES_STORAGE_KEY;

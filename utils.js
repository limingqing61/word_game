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

// ========== 三击删除最佳记录 ==========

/**
 * 绑定三击删除功能
 * @param {string|HTMLElement} target - 要绑定点击事件的元素（选择器或 DOM 元素）
 * @param {Function} onClear - 删除记录后的回调函数（通常用于更新 UI）
 * @param {string} storageKey - localStorage 中存储最佳记录的 key
 * @param {Function} onConfirm - 可选，自定义确认框的提示文字
 */
function bindTripleClickDelete(target, onClear, storageKey, onConfirm) {
  let clickCount = 0;
  let clickTimer = null;

  const el =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;

  // ===== 防止重复绑定 =====
  if (el._tripleClickBound) return;
  el._tripleClickBound = true;

  const defaultMessage = `确认清除最佳记录吗？\n\n当前记录：${localStorage.getItem(storageKey) || "无"}`;

  el.addEventListener("click", function (e) {
    e.stopPropagation();
    clickCount++;
    if (clickTimer) clearTimeout(clickTimer);
    clickTimer = setTimeout(() => {
      clickCount = 0;
    }, 500);

    if (clickCount >= 3) {
      clickCount = 0;
      const msg = onConfirm ? onConfirm() : defaultMessage;
      if (confirm(msg)) {
        localStorage.removeItem(storageKey);
        if (onClear) onClear();
      }
    }
  });
}

window.bindTripleClickDelete = bindTripleClickDelete;

// ========== 收藏夹 UI 公共工具 ==========

/**
 * 显示短暂提示
 */
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.textContent = message;
  toast.style.cssText =
    "position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.7); color:white; padding:8px 20px; border-radius:30px; z-index:10001; font-size:0.9rem;";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}

/**
 * HTML 转义
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/[&<>]/g, function (m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}

/**
 * 获取单词的分类（从 wordData 中读取）
 */
function getWordType(word) {
  return window.wordData?.[word]?.type || "other";
}

/**
 * 显示「管理收藏夹」弹窗（全局公共 UI 工具）
 * - 已收藏：显示「✕ 取消收藏」按钮，可即时取消
 * - 未收藏：显示「➕ 添加」，点击即添加
 * 操作后刷新列表但不关闭弹窗，方便连续操作
 * @param {string} word - 单词
 */
function showAddToFavoritesDialog(word) {
  const existingDialog = document.querySelector(".favorites-dialog-overlay");
  if (existingDialog) existingDialog.remove();

  const overlay = document.createElement("div");
  overlay.className = "favorites-dialog-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;

  const dialog = document.createElement("div");
  dialog.style.cssText = `
    background: white;
    border-radius: 24px;
    padding: 24px;
    width: 90%;
    max-width: 320px;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
  `;
  dialog.innerHTML = `
    <h3 style="margin: 0 0 12px 0; font-size: 1.2rem;">📚 管理收藏夹</h3>
    <p style="color: #666; margin-bottom: 16px; font-size: 0.9rem;">单词: <strong>${escapeHtml(word)}</strong></p>
    <div style="margin-bottom: 16px;">
      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        <input type="text" id="newFavoriteName" placeholder="新收藏夹名称" style="flex:1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px;">
        <button id="createFavoriteBtn" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">➕ 新建</button>
      </div>
      <div id="favoriteList" style="display: flex; flex-direction: column; gap: 8px;"></div>
    </div>
    <div style="display: flex; gap: 12px; justify-content: flex-end;">
      <button id="closeFavoritesDialog" style="background: #ccc; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer;">关闭</button>
    </div>
  `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  const favoriteListEl = document.getElementById("favoriteList");

  function renderFavoriteItems() {
    const favs = getAllFavorites();
    const names = Object.keys(favs);

    if (names.length === 0) {
      favoriteListEl.innerHTML = `<div style="color:#999;text-align:center;font-size:0.85rem;padding:8px 0;">暂无收藏夹，请先新建</div>`;
      return;
    }

    favoriteListEl.innerHTML = names
      .map((name) => {
        const isAdded = favs[name].includes(word);
        if (isAdded) {
          // 已收藏：显示「取消收藏」
          return `
            <div class="favorite-item favorite-added-item" data-name="${escapeHtml(name)}" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f0f8f0; border: 1px solid #c8e6c9; border-radius: 8px;">
              <span style="color: #2e7d32; font-weight: 500;">📁 ${escapeHtml(name)}</span>
              <button class="favorite-remove-btn" data-name="${escapeHtml(name)}" style="background: #ffebee; color: #c62828; border: 1px solid #ef9a9a; padding: 4px 12px; border-radius: 20px; cursor: pointer; font-size: 0.78rem; font-weight: bold;">✕ 取消收藏</button>
            </div>
          `;
        } else {
          // 未收藏：显示「添加」
          return `
            <div class="favorite-item favorite-add-item" data-name="${escapeHtml(name)}" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f5f5f5; border-radius: 8px; cursor: pointer;">
              <span>📁 ${escapeHtml(name)}</span>
              <span style="font-size: 0.8rem; color: #999;">➕ 添加</span>
            </div>
          `;
        }
      })
      .join("");

    // 绑定「添加」事件
    favoriteListEl.querySelectorAll(".favorite-add-item").forEach((item) => {
      item.onclick = (e) => {
        e.stopPropagation();
        const name = item.dataset.name;
        addToFavorite(word, name);
        showToast(`✓ 已添加到「${name}」`);
        renderFavoriteItems();
      };
    });

    // 绑定「取消收藏」事件
    favoriteListEl.querySelectorAll(".favorite-remove-btn").forEach((btn) => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const name = btn.dataset.name;
        removeFromFavorite(word, name);
        showToast(`✕ 已从「${name}」取消收藏`);
        renderFavoriteItems();
      };
    });
  }

  renderFavoriteItems();

  // 关闭对话框
  document.getElementById("closeFavoritesDialog").onclick = () =>
    overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };

  // 新建收藏夹
  document.getElementById("createFavoriteBtn").onclick = () => {
    const newName = document.getElementById("newFavoriteName").value.trim();
    if (!newName) {
      alert("请输入收藏夹名称");
      return;
    }
    const favs = getAllFavorites();
    if (favs[newName]) {
      alert("收藏夹已存在");
      return;
    }
    favs[newName] = [];
    saveAllFavorites(favs);
    document.getElementById("newFavoriteName").value = "";
    renderFavoriteItems();
  };
}

// ========== 挂载到 window ==========
window.showToast = showToast;
window.escapeHtml = escapeHtml;
window.getWordType = getWordType;
window.showAddToFavoritesDialog = showAddToFavoritesDialog;

// ========= 相近单词分组页面逻辑 (minimalPairs.js) =========
// 依赖: wordlistConfig.js, wordData.js, minimalPairsData.js
// 功能: 渲染相近单词分组，与 wordlist 共享收藏夹

// 获取单词的分类（从 wordData 中读取）
function getWordType(word) {
  return window.wordData?.[word]?.type || "other";
}

// ========= 收藏夹功能（使用 utils.js 中的工具） =========

// 显示添加收藏夹弹窗
function showAddToFavoritesDialog(word) {
  const existingDialog = document.querySelector(".favorites-dialog-overlay");
  if (existingDialog) existingDialog.remove();

  const favorites = window.getAllFavorites();
  const favoriteNames = Object.keys(favorites);

  const overlay = document.createElement("div");
  overlay.className = "favorites-dialog-overlay";

  const dialog = document.createElement("div");
  dialog.className = "favorites-dialog";
  dialog.innerHTML = `
        <h3 style="margin:0 0 12px 0; font-size:1.2rem;">📚 添加到收藏夹</h3>
        <p style="color: #666; margin-bottom: 16px; font-size: 0.9rem;">单词: <strong>${escapeHtml(word)}</strong></p>
        <div style="margin-bottom: 16px;">
            <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                <input type="text" id="newFavoriteName" placeholder="新收藏夹名称" style="flex:1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px;">
                <button id="createFavoriteBtn" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">➕ 新建</button>
            </div>
            <div id="favoriteList" style="display: flex; flex-direction: column; gap: 8px;">
                ${favoriteNames
                  .map(
                    (name) => `
                    <div class="favorite-item" data-name="${escapeHtml(name)}" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f5f5f5; border-radius: 8px; cursor: pointer;">
                        <span>📁 ${escapeHtml(name)}</span>
                        <span class="favorite-add-status" style="font-size: 0.8rem; color: ${favorites[name].includes(word) ? "#4caf50" : "#999"}">${favorites[name].includes(word) ? "✓ 已添加" : "➕ 添加"}</span>
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button id="closeFavoritesDialog" style="background: #ccc; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer;">取消</button>
        </div>
    `;

  overlay.appendChild(dialog);
  document.body.appendChild(overlay);

  document.getElementById("closeFavoritesDialog").onclick = () =>
    overlay.remove();
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };

  document.getElementById("createFavoriteBtn").onclick = () => {
    const newName = document.getElementById("newFavoriteName").value.trim();
    if (!newName) {
      alert("请输入收藏夹名称");
      return;
    }
    const favorites = window.getAllFavorites();
    if (favorites[newName]) {
      alert("收藏夹已存在");
      return;
    }
    favorites[newName] = [];
    window.saveAllFavorites(favorites);
    overlay.remove();
    showAddToFavoritesDialog(word);
  };

  document.querySelectorAll(".favorite-item").forEach((item) => {
    item.onclick = (e) => {
      e.stopPropagation();
      const name = item.dataset.name;
      const favorites = window.getAllFavorites();
      const isAdded = favorites[name]?.includes(word);
      if (isAdded) {
        alert(`"${word}" 已经在「${name}」中`);
      } else {
        window.addToFavorite(word, name);
        overlay.remove();
        showToast(`✓ 已添加到「${name}」`);
      }
    };
  });
}

// 显示短暂提示
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.textContent = message;
  toast.style.cssText =
    "position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.7); color:white; padding:8px 20px; border-radius:30px; z-index:10001; font-size:0.9rem;";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}

// 渲染收藏夹筛选下拉框（minimalPairs 中保留，供未来扩展使用）
function renderFavoriteFilter() {
  const container = document.getElementById("typeFilterContainer");
  if (!container) return;

  let favContainer = document.getElementById("favoriteFilterContainer");
  if (!favContainer) {
    favContainer = document.createElement("div");
    favContainer.id = "favoriteFilterContainer";
    favContainer.className = "type-filter-wrapper";
    favContainer.style.marginTop = "15px";
    favContainer.style.paddingTop = "15px";
    favContainer.style.borderTop = "1px solid #eee";
    container.parentNode.insertBefore(favContainer, container.nextSibling);
  }

  const favorites = window.getAllFavorites();
  const favoriteNames = Object.keys(favorites);

  let html =
    '<label style="margin-right: 10px; color: #666;">⭐ 收藏夹：</label>';
  html +=
    '<select id="favoriteSelect" class="type-select" style="margin-right: 10px;">';
  html += '<option value="">— 不筛选 —</option>';
  favoriteNames.forEach((name) => {
    html += `<option value="${name}">📁 ${name} (${favorites[name].length})</option>`;
  });
  html += "</select>";

  // 删除按钮 + 重命名按钮
  if (favoriteNames.length > 0) {
    html +=
      '<div style="display: inline-flex; gap: 6px; flex-wrap: wrap; margin-top: 8px;">';
    favoriteNames.forEach((name) => {
      html += `
        <span style="display: inline-flex; align-items: center; gap: 4px; background: rgba(0,0,0,0.05); padding: 2px 8px 2px 12px; border-radius: 20px; font-size: 0.8rem; color: #555;">
          📁 ${name} (${favorites[name].length})
          <button class="rename-fav-btn" data-name="${name}" style="background: none; border: none; color: #2196F3; cursor: pointer; font-size: 0.8rem; padding: 0 2px;" title="重命名">✏️</button>
          <button class="delete-fav-btn" data-name="${name}" style="background: none; border: none; color: #dc3545; cursor: pointer; font-size: 0.8rem; padding: 0 2px;" title="删除收藏夹">✕</button>
        </span>
      `;
    });
    html += "</div>";
  }

  favContainer.innerHTML = html;

  const savedFavoriteFilter = localStorage.getItem("wordlist_favoriteFilter");
  if (savedFavoriteFilter) {
    document.getElementById("favoriteSelect").value = savedFavoriteFilter;
  }

  document.getElementById("favoriteSelect").addEventListener("change", (e) => {
    const value = e.target.value;
    if (value) {
      localStorage.setItem("wordlist_favoriteFilter", value);
      const typeSelect = document.getElementById("typeSelect");
      if (typeSelect) typeSelect.value = "all";
      localStorage.setItem("wordlist_typeFilter", "all");
    } else {
      localStorage.removeItem("wordlist_favoriteFilter");
    }
    generateWordList();
    if (window.resetPagination) window.resetPagination();
  });

  // 删除收藏夹事件
  document.querySelectorAll(".delete-fav-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const name = this.dataset.name;
      if (
        confirm(
          `确定要删除收藏夹「${name}」吗？\n其中的单词不会被删除，只是这个收藏夹被移除。`,
        )
      ) {
        window.deleteFavorite(name);
        const select = document.getElementById("favoriteSelect");
        if (select && select.value === name) {
          select.value = "";
          localStorage.removeItem("wordlist_favoriteFilter");
        }
        renderFavoriteFilter();
        generateWordList();
        if (window.resetPagination) window.resetPagination();
        showToast(`🗑️ 已删除收藏夹「${name}」`);
      }
    });
  });

  // ===== 重命名收藏夹事件 =====
  document.querySelectorAll(".rename-fav-btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const oldName = this.dataset.name;
      const newName = prompt(`将「${oldName}」重命名为：`, oldName);
      if (newName && newName.trim() !== "" && newName.trim() !== oldName) {
        const result = window.renameFavorite(oldName, newName.trim());
        if (result) {
          renderFavoriteFilter();
          const select = document.getElementById("favoriteSelect");
          if (select && select.value === oldName) {
            select.value = newName.trim();
            localStorage.setItem("wordlist_favoriteFilter", newName.trim());
          }
          showToast(`✅ 已重命名为「${newName.trim()}」`);
        } else {
          alert("重命名失败，可能新名称已存在或原收藏夹不存在");
        }
      }
    });
  });
}

// 获取单词详情（从 wordList 中查找）
function getWordDetail(word) {
  if (window.wordList) {
    const found = window.wordList.find((w) => w.word === word);
    if (found) return found;
  }
  return {
    word: word,
    image: "",
    chinese: window.wordData?.[word]?.chinese || "",
    color: "#333",
  };
}

// 获取音标
function getPhonetic(word) {
  if (window.getPhoneticSymbol) {
    return window.getPhoneticSymbol(word);
  }
  return `/${word.toLowerCase()}/`;
}

// HTML 转义
function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/[&<>]/g, function (m) {
    if (m === "&") return "&amp;";
    if (m === "<") return "&lt;";
    if (m === ">") return "&gt;";
    return m;
  });
}

// 渲染相近单词分组
function renderMinimalPairs() {
  const container = document.getElementById("groupsContainer");
  if (!container) return;

  if (!window.MINIMAL_PAIRS_DATA || window.MINIMAL_PAIRS_DATA.length === 0) {
    container.innerHTML =
      '<div class="empty-group-msg">📭 暂无相近词分组数据，请检查 minimalPairsData.js</div>';
    return;
  }

  if (!window.wordList || window.wordList.length === 0) {
    container.innerHTML =
      '<div class="empty-group-msg">📭 单词表数据未加载，请检查 wordlistConfig.js</div>';
    return;
  }

  let allHtml = "";

  for (const group of window.MINIMAL_PAIRS_DATA) {
    // 过滤出在 wordList 中实际存在的单词
    const validWords = [];
    for (const word of group.words) {
      const detail = getWordDetail(word);
      if (detail) {
        validWords.push({
          word: word,
          image: detail.image || "",
          chinese: detail.chinese || window.wordData?.[word]?.chinese || "",
        });
      }
    }

    if (validWords.length === 0) continue;

    let wordsHtml = "";
    for (const w of validWords) {
      const word = w.word;
      const image = w.image;
      const chinese = w.chinese;
      const phonetic = getPhonetic(word);

      wordsHtml += `
                <div class="word-row" data-word="${escapeHtml(word)}">
                    <img class="word-img" src="${image || ""}" alt="${escapeHtml(word)}" onerror="this.style.display='none'">
                    <div class="word-info">
                        <div class="word-main">
                            <span class="word-text">${escapeHtml(word)}</span>
                            <span class="word-phonetic">${escapeHtml(phonetic)}</span>
                        </div>
                        <div class="word-chinese">${escapeHtml(chinese)}</div>
                    </div>
                    <div class="action-buttons">
                        <button class="action-btn speak" data-word="${escapeHtml(word)}" title="发音"><i class="fas fa-volume-up"></i></button>
                        <button class="action-btn fav" data-word="${escapeHtml(word)}" title="收藏"><i class="fa-regular fa-star"></i></button>
                    </div>
                </div>
            `;
    }

    allHtml += `
            <div class="minimal-card" data-group-id="${group.id}">
                <div class="card-header">
                    <div class="pair-title">
                        <i class="fas fa-volume-off"></i>
                        <span class="sound-badge">${escapeHtml(group.sound || "")}</span>
                        <span class="example-word">📌 ${escapeHtml(group.example || group.name)}</span>
                        <span class="word-count">${validWords.length} 个单词</span>
                    </div>
                    <div class="toggle-icon"><i class="fas fa-chevron-up"></i></div>
                </div>
                <div class="words-list">
                    ${wordsHtml}
                </div>
            </div>
        `;
  }

  if (allHtml === "") {
    container.innerHTML =
      '<div class="empty-group-msg">😢 未找到有效的单词数据，请检查 wordList 中的单词是否与 minimalPairsData 中的单词匹配</div>';
  } else {
    container.innerHTML = allHtml;
  }

  attachInteractions();
}

// 绑定所有交互
function attachInteractions() {
  // 1. 折叠/展开分组 - 手风琴效果（每次只展开一个）
  const allCards = document.querySelectorAll(".minimal-card");

  // 先全部折叠
  allCards.forEach((card) => {
    const wordsList = card.querySelector(".words-list");
    const icon = card.querySelector(".toggle-icon i");
    if (wordsList) {
      wordsList.style.display = "none";
      if (icon) icon.className = "fas fa-chevron-down";
    }
  });

  // 绑定点击事件
  allCards.forEach((card) => {
    const header = card.querySelector(".card-header");
    const wordsList = card.querySelector(".words-list");
    const icon = header.querySelector(".toggle-icon i");
    if (!header || !wordsList) return;

    header.removeEventListener("click", header._toggleHandler);
    const toggleHandler = (e) => {
      e.stopPropagation();

      const isExpanded = wordsList.style.display !== "none";

      if (isExpanded) {
        wordsList.style.display = "none";
        if (icon) icon.className = "fas fa-chevron-down";
      } else {
        // 收起所有其他分组
        allCards.forEach((otherCard) => {
          const otherWordsList = otherCard.querySelector(".words-list");
          const otherIcon = otherCard.querySelector(".toggle-icon i");
          if (otherWordsList && otherWordsList !== wordsList) {
            otherWordsList.style.display = "none";
            if (otherIcon) otherIcon.className = "fas fa-chevron-down";
          }
        });
        wordsList.style.display = "flex";
        if (icon) icon.className = "fas fa-chevron-up";
      }
    };
    header.addEventListener("click", toggleHandler);
    header._toggleHandler = toggleHandler;
  });

  // 2. 发音按钮 - 使用 SpeechHelper（与 wordlist.js 保持一致）
  document.querySelectorAll(".speak").forEach((btn) => {
    btn.removeEventListener("click", btn._speakEvent);
    const word = btn.getAttribute("data-word");
    const speakHandler = (e) => {
      e.stopPropagation();
      // 使用 SpeechHelper，与 wordlist.js 完全一致
      if (window.SpeechHelper && window.SpeechHelper.speak) {
        window.SpeechHelper.speak(word);
      } else {
        // 备用方案：使用原生语音合成
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.lang = "en-US";
        speechSynthesis.cancel();
        speechSynthesis.speak(utterance);
      }
    };
    btn.addEventListener("click", speakHandler);
    btn._speakEvent = speakHandler;
  });

  // 3. 收藏按钮
  document.querySelectorAll(".fav").forEach((btn) => {
    btn.removeEventListener("click", btn._favEvent);
    const word = btn.getAttribute("data-word");
    const favHandler = (e) => {
      e.stopPropagation();
      showAddToFavoritesDialog(word);
    };
    btn.addEventListener("click", favHandler);
    btn._favEvent = favHandler;
  });

  // 4. 图片放大
  document.querySelectorAll(".word-img").forEach((img) => {
    img.removeEventListener("click", img._zoomEvent);
    const zoomHandler = (e) => {
      e.stopPropagation();
      const src = img.src;
      if (!src || src === window.location.href) return;
      const backdrop = document.createElement("div");
      backdrop.style.cssText =
        "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:9999; cursor:pointer;";
      const zoomImg = document.createElement("img");
      zoomImg.src = src;
      zoomImg.style.cssText =
        "max-width:min(90vw, 500px); max-height:min(90vh, 500px); border-radius:20px; box-shadow:0 10px 30px rgba(0,0,0,0.3);";
      backdrop.appendChild(zoomImg);
      backdrop.addEventListener("click", () => backdrop.remove());
      document.body.appendChild(backdrop);
    };
    img.addEventListener("click", zoomHandler);
    img._zoomEvent = zoomHandler;
  });
}

// 数据加载等待
function initMinimalPairs() {
  console.log("🔍 检查数据加载状态...");
  console.log(
    "  wordList:",
    window.wordList ? `${window.wordList.length} 个单词` : "❌ 未加载",
  );
  console.log(
    "  MINIMAL_PAIRS_DATA:",
    window.MINIMAL_PAIRS_DATA
      ? `${window.MINIMAL_PAIRS_DATA.length} 个分组`
      : "❌ 未加载",
  );
  console.log("  wordData:", window.wordData ? "✓ 已加载" : "❌ 未加载");

  if (
    window.wordList &&
    window.wordList.length > 0 &&
    window.MINIMAL_PAIRS_DATA
  ) {
    console.log("✅ 数据加载完成，开始渲染");
    renderMinimalPairs();
    // 渲染完成后绑定返回按钮
    bindBackButton();
  } else {
    console.log("⏳ 等待数据加载...");
    setTimeout(initMinimalPairs, 200);
  }
}

// 绑定返回按钮事件
function bindBackButton() {
  const backBtn = document.getElementById("backToMenuBtn");
  if (backBtn) {
    const newBackBtn = backBtn.cloneNode(true);
    backBtn.parentNode.replaceChild(newBackBtn, backBtn);
    bindGoHome(newBackBtn);
  }
}

// ===== 提供给外部的刷新函数 =====
window.refreshMinimalPairs = function () {
  renderMinimalPairs();
};

// 页面加载完成后开始检查
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    // 初始化收藏夹筛选器（如果有容器）
    if (document.getElementById("typeFilterContainer")) {
      renderFavoriteFilter();
    }
    initMinimalPairs();
  });
} else {
  if (document.getElementById("typeFilterContainer")) {
    renderFavoriteFilter();
  }
  initMinimalPairs();
}

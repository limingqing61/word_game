// ========= 所有数据来自全局 wordlistConfig.js =========

// 获取单词的分类（从 wordData 中读取）
function getWordType(word) {
  return window.wordData?.[word]?.type || "other";
}

// ========= 收藏夹功能（使用 utils.js 中的工具） =========

// 获取当前选中的收藏夹筛选
let currentFavoriteFilter = null;

function getCurrentFavoriteFilter() {
  const select = document.getElementById("favoriteSelect");
  return select ? select.value : null;
}

// 获取当前选中的收藏夹筛选值
function getCurrentFavoriteFilterValue() {
  const select = document.getElementById("favoriteSelect");
  if (!select) return null;
  const value = select.value;
  return value && value !== "" ? value : null;
}

// 显示添加收藏夹弹窗（UI 逻辑保留在模块中）
function showAddToFavoritesDialog(word) {
  const existingDialog = document.querySelector(".favorites-dialog-overlay");
  if (existingDialog) existingDialog.remove();

  const favorites = window.getAllFavorites();
  const favoriteNames = Object.keys(favorites);

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
    <h3 style="margin: 0 0 12px 0; font-size: 1.2rem;">📚 添加到收藏夹</h3>
    <p style="color: #666; margin-bottom: 16px; font-size: 0.9rem;">单词: <strong>${word}</strong></p>
    <div style="margin-bottom: 16px;">
      <div style="display: flex; gap: 8px; margin-bottom: 16px;">
        <input type="text" id="newFavoriteName" placeholder="新收藏夹名称" style="flex:1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 8px;">
        <button id="createFavoriteBtn" style="background: #667eea; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">➕ 新建</button>
      </div>
      <div id="favoriteList" style="display: flex; flex-direction: column; gap: 8px;">
        ${favoriteNames
          .map(
            (name) => `
          <div class="favorite-item" data-name="${name}" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #f5f5f5; border-radius: 8px; cursor: pointer;">
            <span>📁 ${name}</span>
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
        const toast = document.createElement("div");
        toast.textContent = `✓ 已添加到「${name}」`;
        toast.style.cssText =
          "position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.7); color:white; padding:8px 20px; border-radius:30px; z-index:10001; font-size:0.9rem;";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 1500);
      }
    };
  });
}

// 渲染收藏夹筛选下拉框
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

// 获取当前选中的分类
function getCurrentTypeFilter() {
  const select = document.getElementById("typeSelect");
  return select ? select.value : "all";
}

// 获取当前选中的收藏夹筛选
function getCurrentFavoriteFilterValue() {
  const select = document.getElementById("favoriteSelect");
  if (!select) return null;
  const value = select.value;
  return value && value !== "" ? value : null;
}

// 获取过滤后的单词列表
function getFilteredWords() {
  const favoriteFilter = getCurrentFavoriteFilterValue();

  if (favoriteFilter) {
    const favorites = window.getAllFavorites();
    const favoriteWords = favorites[favoriteFilter] || [];
    return favoriteWords
      .map((word) => {
        const found = wordList.find((w) => w.word === word);
        return found || { word: word, image: "", chinese: "", color: "#333" };
      })
      .filter((w) => w.word);
  }

  const typeFilter = getCurrentTypeFilter();
  if (typeFilter !== "all") {
    return wordList.filter((w) => getWordType(w.word) === typeFilter);
  }

  return wordList;
}

// 渲染分类下拉框
function renderTypeFilter() {
  const container = document.getElementById("typeFilterContainer");
  if (!container) return;

  const types = new Set();
  wordList.forEach((w) => {
    const type = getWordType(w.word);
    types.add(type);
  });

  const typeNames = {
    fruit: "🍎 水果",
    vegetable: "🥬 蔬菜",
    animal: "🐶 动物",
    food: "🍔 食物",
    body: "🖐️ 身体",
    color: "🎨 颜色",
    number: "🔢 数字",
    transport: "🚗 交通",
    clothing: "👕 衣物",
    nature: "🌿 自然",
    action: "🏃 动作",
    people: "👨‍👩‍👧 人物",
    household: "🏠 家居",
    place: "📍 地点",
    toy: "🧸 玩具",
    time: "⏰ 时间",
    country: "🌍 国家",
    other: "📦 其他",
  };

  let html = '<div class="type-filter-wrapper">';
  html += '<label style="margin-right: 10px; color: #666;">📂 分类：</label>';
  html += '<select id="typeSelect" class="type-select">';
  html += '<option value="all">📋 全部</option>';
  Array.from(types)
    .sort()
    .forEach((type) => {
      html += `<option value="${type}">${typeNames[type] || type}</option>`;
    });
  html += "</select>";
  html += "</div>";

  container.innerHTML = html;

  const savedType = localStorage.getItem("wordlist_typeFilter");
  if (savedType && savedType !== "all") {
    document.getElementById("typeSelect").value = savedType;
  }

  document.getElementById("typeSelect").addEventListener("change", (e) => {
    localStorage.setItem("wordlist_typeFilter", e.target.value);
    const favSelect = document.getElementById("favoriteSelect");
    if (favSelect) favSelect.value = "";
    localStorage.removeItem("wordlist_favoriteFilter");
    generateWordList();
    if (window.resetPagination) window.resetPagination();
  });
}

function generateWordList() {
  const table = document.getElementById("wordListTable");
  if (!table) return;
  if (typeof wordList === "undefined") {
    console.error("❌ wordList 未加载");
    return;
  }

  const favoriteFilter = getCurrentFavoriteFilterValue();
  const isFavoriteMode = favoriteFilter !== null;

  let filteredWords = getFilteredWords();

  const pageSize = 20;
  let currentPage = parseInt(localStorage.getItem("wordlist_currentPage")) || 1;
  const totalPages = Math.ceil(filteredWords.length / pageSize);

  if (currentPage > totalPages) currentPage = 1;
  if (currentPage < 1) currentPage = 1;

  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageWords = filteredWords.slice(start, end);

  table.innerHTML = "";

  if (pageWords.length === 0) {
    table.innerHTML = '<div class="empty-state">😢 没有找到单词</div>';
    renderPagination(1, 1, totalPages);
    return;
  }

  pageWords.forEach((w, idx) => {
    const row = document.createElement("div");
    row.className = "word-list-row";

    const img = document.createElement("img");
    img.src = w.image;
    img.alt = w.word;
    img.onerror = () => (img.style.display = "none");
    img.addEventListener("click", (e) => {
      e.stopPropagation();
      document.body.style.overflow = "hidden";
      const backdrop = document.createElement("div");
      backdrop.style.cssText =
        "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:9999; cursor:pointer;";
      const zoomImg = document.createElement("img");
      zoomImg.src = img.src;
      zoomImg.style.cssText =
        "max-width: min(90vw, 500px); max-height: min(90vh, 500px); width: auto; height: auto; object-fit: contain; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);";
      backdrop.appendChild(zoomImg);
      backdrop.addEventListener("click", () => {
        backdrop.remove();
        document.body.style.overflow = "";
      });
      document.body.appendChild(backdrop);
    });

    const info = document.createElement("div");
    info.className = "word-list-info";
    const wordSpan = document.createElement("span");
    wordSpan.className = "word-list-word";
    wordSpan.textContent = w.word;
    const phoneticSpan = document.createElement("span");
    phoneticSpan.className = "word-list-phonetic";
    phoneticSpan.textContent = window.getPhoneticSymbol
      ? window.getPhoneticSymbol(w.word)
      : `/${w.word}/`;
    const chineseSpan = document.createElement("span");
    chineseSpan.className = "word-list-chinese";
    chineseSpan.textContent = w.chinese || "";
    info.appendChild(wordSpan);
    info.appendChild(phoneticSpan);
    info.appendChild(chineseSpan);

    const playBtn = document.createElement("button");
    playBtn.className = "word-list-play-btn";
    playBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    playBtn.addEventListener("click", () => SpeechHelper.speak(w.word));

    const actionBtn = document.createElement("button");
    actionBtn.className = "word-list-play-btn";

    if (isFavoriteMode) {
      actionBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
      actionBtn.style.background = "#dc3545";
      actionBtn.addEventListener("click", () => {
        window.removeFromFavorite(w.word, favoriteFilter);
        generateWordList();
        const toast = document.createElement("div");
        toast.textContent = `✓ 已从「${favoriteFilter}」删除`;
        toast.style.cssText =
          "position:fixed; bottom:100px; left:50%; transform:translateX(-50%); background:rgba(0,0,0,0.7); color:white; padding:8px 20px; border-radius:30px; z-index:10001; font-size:0.9rem;";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 1500);
      });
    } else {
      actionBtn.innerHTML = '<i class="fa-regular fa-floppy-disk"></i>';
      actionBtn.style.background = "#28a745";
      actionBtn.addEventListener("click", () => {
        showAddToFavoritesDialog(w.word);
      });
    }

    const btnContainer = document.createElement("div");
    btnContainer.style.display = "flex";
    btnContainer.style.gap = "8px";
    btnContainer.appendChild(playBtn);
    btnContainer.appendChild(actionBtn);

    row.appendChild(img);
    row.appendChild(info);
    row.appendChild(btnContainer);
    table.appendChild(row);
  });

  renderPagination(currentPage, filteredWords.length, totalPages);
  localStorage.setItem("wordlist_currentPage", currentPage);
}

function renderPagination(currentPage, totalItems, totalPages) {
  const container = document.getElementById("paginationContainer");
  if (!container) return;

  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  let html = '<div class="pagination">';
  html += `<button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}>◀ 上一页</button>`;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, currentPage + 2);

  if (startPage > 1) {
    html += `<button class="page-btn" data-page="1">1</button>`;
    if (startPage > 2) html += `<span class="page-dots">...</span>`;
  }

  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="page-btn ${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) html += `<span class="page-dots">...</span>`;
    html += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
  }

  html += `<button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>下一页 ▶</button>`;
  html += `<span class="page-info">第 ${currentPage} / ${totalPages} 页，共 ${totalItems} 个单词</span>`;
  html += "</div>";

  container.innerHTML = html;

  document.querySelectorAll(".page-btn[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.dataset.page);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        localStorage.setItem("wordlist_currentPage", page);
        generateWordList();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

window.resetPagination = function () {
  localStorage.setItem("wordlist_currentPage", 1);
  generateWordList();
};

function restoreScroll() {
  const savedScroll = localStorage.getItem("wordlist_scroll");
  if (savedScroll !== null) {
    setTimeout(() => window.scrollTo(0, parseInt(savedScroll)), 100);
  }
}

function saveScroll() {
  let scrollTimer;
  return function () {
    if (scrollTimer) clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      localStorage.setItem("wordlist_scroll", window.scrollY);
    }, 200);
  };
}

function initSearch() {
  const searchInput = document.getElementById("searchWordInput");
  const searchBtn = document.getElementById("searchWordBtn");
  const radios = document.querySelectorAll('input[name="searchType"]');
  if (!searchInput || !searchBtn) return;

  function getSearchType() {
    for (let r of radios) if (r.checked) return r.value;
    return "en";
  }

  function getCurrentFilteredWords() {
    const favoriteFilter = getCurrentFavoriteFilterValue();
    if (favoriteFilter) {
      const favorites = window.getAllFavorites();
      const favoriteWords = favorites[favoriteFilter] || [];
      return favoriteWords
        .map((word) => {
          const found = wordList.find((w) => w.word === word);
          return found || { word: word, image: "", chinese: "", color: "#333" };
        })
        .filter((w) => w.word);
    }

    const typeFilter = getCurrentTypeFilter();
    if (typeFilter !== "all") {
      return wordList.filter((w) => getWordType(w.word) === typeFilter);
    }
    return wordList;
  }

  function locateWord() {
    const keyword = searchInput.value.trim();
    if (!keyword) return;
    const type = getSearchType();

    const filteredWords = getCurrentFilteredWords();

    let index = -1;
    if (type === "en") {
      index = filteredWords.findIndex(
        (item) => item.word.toLowerCase() === keyword.toLowerCase(),
      );
    } else {
      index = filteredWords.findIndex((item) => item.chinese === keyword);
    }

    if (index === -1) {
      alert(`未找到匹配的${type === "en" ? "英文单词" : "中文解释"}`);
      return;
    }

    const pageSize = 20;
    const targetPage = Math.floor(index / pageSize) + 1;
    const currentPage =
      parseInt(localStorage.getItem("wordlist_currentPage")) || 1;

    if (targetPage !== currentPage) {
      localStorage.setItem("wordlist_currentPage", targetPage);
      generateWordList();
      setTimeout(() => {
        const rows = document.querySelectorAll(".word-list-row");
        const rowIndex = index % pageSize;
        if (rows[rowIndex]) {
          rows[rowIndex].scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          rows[rowIndex].style.backgroundColor = "#fff3cd";
          setTimeout(() => (rows[rowIndex].style.backgroundColor = ""), 1500);
        }
      }, 200);
    } else {
      const rows = document.querySelectorAll(".word-list-row");
      const rowIndex = index % pageSize;
      if (rows[rowIndex]) {
        rows[rowIndex].scrollIntoView({ behavior: "smooth", block: "center" });
        rows[rowIndex].style.backgroundColor = "#fff3cd";
        setTimeout(() => (rows[rowIndex].style.backgroundColor = ""), 1500);
      }
    }
  }

  searchBtn.addEventListener("click", locateWord);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") locateWord();
  });
}

function initTypeFilter() {
  renderTypeFilter();
  renderFavoriteFilter();
}

document.addEventListener("DOMContentLoaded", () => {
  initTypeFilter();
  generateWordList();
  restoreScroll();
  window.addEventListener("scroll", saveScroll());
  initSearch();

  const backBtn = document.getElementById("backToMenuBtn");
  if (backBtn) bindGoHome(backBtn);
});

// ========= 相近单词分组页面逻辑 (minimalPairs.js) =========
// 依赖: utils.js, wordlistConfig.js, wordData.js, minimalPairsData.js
// 公共函数（showAddToFavoritesDialog / showToast / escapeHtml / getWordType）来自 utils.js

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
    initMinimalPairs();
  });
} else {
  initMinimalPairs();
}

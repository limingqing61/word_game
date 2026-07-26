(function () {
  "use strict";

  // ========== DOM ==========
  const listContainer = document.getElementById("listContainer");
  const totalCountEl = document.getElementById("totalCount");
  const countBadge = document.getElementById("countBadge");
  const floatingBtn = document.getElementById("floatingHomeBtn");

  // ========== 工具函数 ==========
  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // ========== 滚动记忆 ==========
  function restoreScroll() {
    const saved = localStorage.getItem("idiomList_scroll");
    if (saved !== null) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(saved));
      }, 100);
    }
  }

  function saveScroll() {
    let timer;
    return function () {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        localStorage.setItem("idiomList_scroll", window.scrollY);
      }, 200);
    };
  }

  // ========== 阅读功能（使用 utils 中的 speak 或 SpeechHelper） ==========
  function readIdiom(idiom, meaning) {
    const text = `${idiom}，${meaning}`;
    if (window.SpeechHelper && window.SpeechHelper.speak) {
      window.SpeechHelper.speak(text, 0.7);
    } else {
      // 备用方案
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.7;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }

  // ========== 渲染列表 ==========
  function renderList() {
    if (!window.IDIOM_DATA) {
      listContainer.innerHTML = `
                <div class="empty-state" style="color: rgba(255,236,179,0.4); text-align:center; padding: 50px 20px; font-size:1.1rem;">
                    ⚠️ 成语数据加载失败<br>
                    <span style="display:block; font-size:0.85rem; color: rgba(255,236,179,0.2); margin-top:8px;">
                        请检查 idiomData.js 是否存在，且最后一行有 window.IDIOM_DATA = IDIOM_DATA;
                    </span>
                </div>
            `;
      return;
    }

    const entries = Object.entries(window.IDIOM_DATA);
    const total = entries.length;

    totalCountEl.textContent = total;
    countBadge.textContent = `${total} 个`;

    if (total === 0) {
      listContainer.innerHTML = `
                <div class="empty-state" style="color: rgba(255,236,179,0.4); text-align:center; padding: 50px 20px; font-size:1.1rem;">
                    🌱 暂无成语数据，请先在 idiomData.js 中添加
                </div>
            `;
      return;
    }

    // 按成语拼音排序（中文排序）
    const sorted = entries.sort((a, b) => a[0].localeCompare(b[0], "zh"));

    let html = "";
    for (const [idiom, data] of sorted) {
      const meaning = data.meaning || "暂无解释";
      html += `
                <div class="list-item" data-idiom="${idiom}">
                    <div class="idiom-text">${idiom}</div>
                    <div class="idiom-meaning">${meaning}</div>
                    <button class="read-btn" data-idiom="${idiom}" data-meaning="${meaning}">
                        <i class="fas fa-volume-up"></i> 阅读
                    </button>
                </div>
            `;
    }

    listContainer.innerHTML = html;

    // ===== 绑定阅读按钮事件 =====
    document.querySelectorAll(".read-btn").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const idiom = this.dataset.idiom;
        const meaning = this.dataset.meaning;
        readIdiom(idiom, meaning);
      });
    });

    // ===== 恢复滚动位置 =====
    restoreScroll();
  }

  // ========== 事件绑定 ==========
  if (floatingBtn) {
    floatingBtn.addEventListener("click", goHome);
  }

  window.addEventListener("scroll", saveScroll());

  // ========== 启动 ==========
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderList);
  } else {
    renderList();
  }
})();

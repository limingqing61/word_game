(function () {
  "use strict";

  // ========== 存储 Key ==========
  const LEARNED_KEY = "poemList_learned";

  // ========== DOM ==========
  const listContainer = document.getElementById("listContainer");
  const totalCountEl = document.getElementById("totalCount");
  const countBadge = document.getElementById("countBadge");
  const floatingBtn = document.getElementById("floatingHomeBtn");

  // 弹窗相关
  const modalOverlay = document.getElementById("modalOverlay");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalSpeakBtn = document.getElementById("modalSpeakBtn");
  const modalPoemName = document.getElementById("modalPoemName");
  const modalPoemMeta = document.getElementById("modalPoemMeta");
  const modalBody = document.getElementById("modalBody");

  // 筛选按钮
  const filterBtns = document.querySelectorAll(".filter-btn");

  let currentPoem = null;
  let allPoems = [];
  let currentFilter = "all"; // 'all' | 'learned' | 'unlearned'

  // ========== 已学状态 ==========
  function getLearnedSet() {
    const stored = localStorage.getItem(LEARNED_KEY);
    if (stored) {
      try {
        return new Set(JSON.parse(stored));
      } catch (e) {
        return new Set();
      }
    }
    return new Set();
  }

  function saveLearnedSet(set) {
    localStorage.setItem(LEARNED_KEY, JSON.stringify([...set]));
  }

  function isLearned(title) {
    const set = getLearnedSet();
    return set.has(title);
  }

  function toggleLearned(title) {
    const set = getLearnedSet();
    if (set.has(title)) {
      set.delete(title);
    } else {
      set.add(title);
    }
    saveLearnedSet(set);
  }

  // ========== 工具函数 ==========
  function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>]/g, function (m) {
      if (m === "&") return "&amp;";
      if (m === "<") return "&lt;";
      if (m === ">") return "&gt;";
      return m;
    });
  }

  function getPoemLines(content) {
    const sentences = content.split("。").filter((s) => s.trim().length > 0);
    const lines = [];
    for (const s of sentences) {
      const parts = s.split("，").filter((p) => p.trim().length > 0);
      for (const p of parts) {
        lines.push(p.trim());
      }
    }
    return lines;
  }

  // ========== 滚动记忆 ==========
  function restoreScroll() {
    const saved = localStorage.getItem("poemList_scroll");
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
        localStorage.setItem("poemList_scroll", window.scrollY);
      }, 200);
    };
  }

  // ========== 朗读功能 ==========
  function speakPoem(poem) {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (!poem) return;

    const title = poem.title || "";
    const author = poem.author || "";
    const dynasty = poem.dynasty || "";
    const content = poem.content || "";

    let text = `${title}。`;
    if (dynasty && author) {
      text += `${dynasty}，${author}。`;
    } else if (author) {
      text += `${author}。`;
    }
    const contentText = content.replace(/，/g, "，").replace(/。/g, "。");
    text += contentText;

    if (window.SpeechHelper && window.SpeechHelper.speak) {
      window.SpeechHelper.speak(text, 0.7);
    } else {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "zh-CN";
      utterance.rate = 0.7;
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  }

  function stopSpeech() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // ========== 渲染列表 ==========
  function renderList() {
    // 合并五言和七言
    allPoems = [];

    if (window.POEM_DATA5) {
      const entries5 = Object.entries(window.POEM_DATA5);
      for (const [title, data] of entries5) {
        allPoems.push({
          title: title,
          author: data.author || "佚名",
          dynasty: data.dynasty || "",
          content: data.content || "",
          type: "five",
        });
      }
    }

    if (window.POEM_DATA7) {
      const entries7 = Object.entries(window.POEM_DATA7);
      for (const [title, data] of entries7) {
        allPoems.push({
          title: title,
          author: data.author || "佚名",
          dynasty: data.dynasty || "",
          content: data.content || "",
          type: "seven",
        });
      }
    }

    // 按诗名排序
    allPoems.sort((a, b) => a.title.localeCompare(b.title, "zh"));

    const total = allPoems.length;
    totalCountEl.textContent = total;
    countBadge.textContent = `${total} 首`;

    if (total === 0) {
      listContainer.innerHTML = `
                <div style="color: rgba(255,236,179,0.4); text-align:center; padding: 50px 20px; font-size:1.1rem;">
                    📭 暂无古诗数据<br>
                    <span style="display:block; font-size:0.85rem; color: rgba(255,236,179,0.2); margin-top:8px;">
                        请检查 poemData.js 是否正确加载
                    </span>
                </div>
            `;
      return;
    }

    // 根据筛选条件过滤
    let filteredPoems = allPoems;
    if (currentFilter === "learned") {
      const learnedSet = getLearnedSet();
      filteredPoems = allPoems.filter((p) => learnedSet.has(p.title));
    } else if (currentFilter === "unlearned") {
      const learnedSet = getLearnedSet();
      filteredPoems = allPoems.filter((p) => !learnedSet.has(p.title));
    }

    if (filteredPoems.length === 0) {
      const msg =
        currentFilter === "all"
          ? "暂无古诗"
          : currentFilter === "learned"
            ? "还没有已学的诗，加油！"
            : "🎉 所有诗都已学完！";
      listContainer.innerHTML = `
                <div style="color: rgba(255,236,179,0.4); text-align:center; padding: 40px 20px; font-size:1.1rem;">
                    ${msg}
                </div>
            `;
      return;
    }

    let html = "";
    for (const poem of filteredPoems) {
      const metaParts = [];
      if (poem.dynasty) metaParts.push(poem.dynasty);
      if (poem.author) metaParts.push(poem.author);
      const metaStr = metaParts.join(" · ");
      const learned = isLearned(poem.title);

      html += `
                <div class="list-item" data-title="${escapeHtml(poem.title)}">
                    <div class="poem-title">${escapeHtml(poem.title)}</div>
                    <div class="poem-meta">${escapeHtml(metaStr)}</div>
                    <div class="poem-status">
                        <span class="status-text ${learned ? "learned" : "unlearned"}">${learned ? "✅ 已学" : "📝 未学"}</span>
                        <button class="status-toggle" data-title="${escapeHtml(poem.title)}">
                            ${learned ? "未学" : "已学"}
                        </button>
                    </div>
                    <button class="detail-btn" data-title="${escapeHtml(poem.title)}">📖 详情</button>
                </div>
            `;
    }

    listContainer.innerHTML = html;

    // ===== 绑定状态切换事件 =====
    document.querySelectorAll(".status-toggle").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const title = this.dataset.title;
        toggleLearned(title);
        // 重新渲染列表（保持当前筛选）
        renderList();
      });
    });

    // ===== 绑定详情按钮事件 =====
    document.querySelectorAll(".detail-btn").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const title = this.dataset.title;
        const poem = allPoems.find((p) => p.title === title);
        if (poem) {
          openModal(poem);
        }
      });
    });

    // ===== 恢复滚动位置 =====
    restoreScroll();
  }

  // ========== 弹窗逻辑 ==========
  function openModal(poem) {
    currentPoem = poem;
    stopSpeech();

    modalPoemName.textContent = poem.title;

    const metaParts = [];
    if (poem.dynasty) metaParts.push(poem.dynasty);
    if (poem.author) metaParts.push(poem.author);
    modalPoemMeta.textContent = metaParts.join(" · ");

    const lines = getPoemLines(poem.content);
    let bodyHtml = "";
    for (const line of lines) {
      bodyHtml += `<div class="poem-line">${escapeHtml(line)}</div>`;
    }
    if (lines.length <= 1) {
      bodyHtml = `<div class="poem-line">${escapeHtml(poem.content)}</div>`;
    }
    modalBody.innerHTML = bodyHtml;

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    stopSpeech();
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
    currentPoem = null;
  }

  // ===== 弹窗事件绑定 =====
  modalCloseBtn.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", function (e) {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });

  modalSpeakBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    if (currentPoem) {
      speakPoem(currentPoem);
    }
  });

  // ========== 筛选事件 ==========
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      filterBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      currentFilter = this.dataset.filter;
      renderList();
    });
  });

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

  window.closePoemModal = closeModal;
})();

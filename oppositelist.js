(function () {
  // ===== 悬浮按钮 =====
  const floatingBtn = document.getElementById("floatingHomeBtn");

  // ========== 滚动记忆 ==========
  function restoreScroll() {
    const saved = localStorage.getItem("oppositelist_scroll");
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
        localStorage.setItem("oppositelist_scroll", window.scrollY);
      }, 200);
    };
  }

  function buildOppositeList() {
    const container = document.getElementById("oppositeListContainer");
    if (!window.oppositePairs || !window.oppositePairs.length) {
      container.innerHTML =
        '<div style="text-align:center; padding:30px;">❌ 反义词数据加载失败</div>';
      return;
    }

    container.innerHTML = "";
    window.oppositePairs.forEach((pair) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "opposite-item";

      // 左侧单词卡片
      const leftCard = document.createElement("div");
      leftCard.className = "word-card-left";
      leftCard.innerHTML = `
                <button class="speak-btn" data-word="${pair.left}">🔊 发音</button>
                <div class="word-title">${pair.left}</div>
                <div class="word-phonetic">${pair.leftPhonetic || ""}</div>
                <div class="word-chinese">${pair.leftChinese || ""}</div>
            `;

      // 图片（带点击放大）
      const img = document.createElement("img");
      img.src = `opposite/${pair.name}.jpeg`;
      img.alt = `${pair.left} / ${pair.right}`;
      img.className = "opposite-img";
      img.onerror = () => {
        img.src = "";
        img.alt = "⚠️ 图片缺失";
      };

      // 点击放大图片
      img.addEventListener("click", function (e) {
        e.stopPropagation();
        document.body.style.overflow = "hidden";
        const backdrop = document.createElement("div");
        backdrop.style.position = "fixed";
        backdrop.style.top = 0;
        backdrop.style.left = 0;
        backdrop.style.width = "100%";
        backdrop.style.height = "100%";
        backdrop.style.backgroundColor = "rgba(0,0,0,0.85)";
        backdrop.style.display = "flex";
        backdrop.style.alignItems = "center";
        backdrop.style.justifyContent = "center";
        backdrop.style.zIndex = 9999;
        backdrop.style.cursor = "pointer";

        const zoomImg = document.createElement("img");
        zoomImg.src = img.src;
        zoomImg.style.maxWidth = "90%";
        zoomImg.style.maxHeight = "90%";
        zoomImg.style.objectFit = "contain";
        zoomImg.style.borderRadius = "20px";
        zoomImg.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";

        backdrop.appendChild(zoomImg);
        backdrop.addEventListener("click", () => {
          backdrop.remove();
          document.body.style.overflow = "";
        });
        document.body.appendChild(backdrop);
      });

      // 右侧单词卡片
      const rightCard = document.createElement("div");
      rightCard.className = "word-card-right";
      rightCard.innerHTML = `
                <button class="speak-btn" data-word="${pair.right}">🔊 发音</button>
                <div class="word-title">${pair.right}</div>
                <div class="word-phonetic">${pair.rightPhonetic || ""}</div>
                <div class="word-chinese">${pair.rightChinese || ""}</div>
            `;

      itemDiv.appendChild(leftCard);
      itemDiv.appendChild(img);
      itemDiv.appendChild(rightCard);
      container.appendChild(itemDiv);
    });

    // 绑定发音按钮
    document.querySelectorAll(".speak-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const word = btn.getAttribute("data-word");
        if (word) SpeechHelper.speak(word);
      });
    });

    // ===== 恢复滚动位置 =====
    restoreScroll();
  }

  // ===== 悬浮按钮返回首页 =====
  if (floatingBtn) {
    floatingBtn.addEventListener("click", goHome);
  }

  // ===== 滚动监听 =====
  window.addEventListener("scroll", saveScroll());

  // ===== 启动 =====
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildOppositeList);
  } else {
    buildOppositeList();
  }
})();

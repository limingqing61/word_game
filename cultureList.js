(function () {
  "use strict";

  // ========== 获取 DOM 引用 ==========
  const listContainer = document.getElementById("listContainer");
  const totalCountEl = document.getElementById("totalCount");
  const countryCountEl = document.getElementById("countryCount");
  const countBadge = document.getElementById("countBadge");

  // 弹窗相关
  const modalOverlay = document.getElementById("modalOverlay");
  const modalCloseBtn = document.getElementById("modalCloseBtn");
  const modalName = document.getElementById("modalName");
  const modalCountry = document.getElementById("modalCountry");
  const modalContentText = document.getElementById("modalContentText");

  // ========== 工具：从 wordData 获取国家中文名 ==========
  function getCountryChinese(englishKey) {
    if (!window.wordData) {
      console.warn("⚠️ wordData.js 未加载");
      return englishKey;
    }

    // 遍历 wordData，找 type === 'country' 且 key 匹配的
    for (const [key, value] of Object.entries(window.wordData)) {
      if (
        value.type === "country" &&
        key.toLowerCase() === englishKey.toLowerCase()
      ) {
        return value.chinese;
      }
    }

    // 没找到，返回英文原值
    return englishKey;
  }

  // ========== 工具：获取国家对应的 emoji 旗帜 ==========
  function getCountryEmoji(countryKey) {
    // 简单映射常见国家
    const map = {
      China: "🇨🇳",
      America: "🇺🇸",
      Japan: "🇯🇵",
      England: "🇬🇧",
      France: "🇫🇷",
      Italy: "🇮🇹",
      Egypt: "🇪🇬",
      Australia: "🇦🇺",
      Brazil: "🇧🇷",
      Turkey: "🇹🇷",
      Spain: "🇪🇸",
      Greece: "🇬🇷",
      Mexico: "🇲🇽",
      Norway: "🇳🇴",
      Israel: "🇮🇱",
      Chile: "🇨🇱",
      Ukraine: "🇺🇦",
      Portugal: "🇵🇹",
      Iran: "🇮🇷",
      Sweden: "🇸🇪",
      Argentina: "🇦🇷",
      Germany: "🇩🇪",
      Canada: "🇨🇦",
      Russia: "🇷🇺",
      India: "🇮🇳",
      Korea: "🇰🇷",
      Singapore: "🇸🇬",
      Malaysia: "🇲🇾",
      Thailand: "🇹🇭",
      Vietnam: "🇻🇳",
      Philippines: "🇵🇭",
      Indonesia: "🇮🇩",
      Pakistan: "🇵🇰",
      Bangladesh: "🇧🇩",
      Nigeria: "🇳🇬",
      "South Africa": "🇿🇦",
      Kenya: "🇰🇪",
      "Saudi Arabia": "🇸🇦",
      UAE: "🇦🇪",
      Qatar: "🇶🇦",
      "New Zealand": "🇳🇿",
      Fiji: "🇫🇯",
    };
    return map[countryKey] || "🌍";
  }

  // ========== 渲染列表 ==========
  // ========== 渲染列表 ==========
  function renderList() {
    // ===== 兜底：兼容两种变量写法 =====
    let data = window.CULTURE_DATA || window.cultureData || window.CultureData;

    if (!data || !Array.isArray(data) || data.length === 0) {
      listContainer.innerHTML = `
      <div class="empty-state">
        ⚠️ 文化数据加载失败<br>
        <span class="sub">请检查 cultureData.js 是否存在，且最后一行有 window.CULTURE_DATA = CULTURE_DATA;</span>
      </div>
    `;
      return;
    }

    const total = data.length;

    // 统计覆盖的国家数（去重）
    const countrySet = new Set(data.map((item) => item.country));
    const countryCount = countrySet.size;

    // 更新统计
    totalCountEl.textContent = total;
    countryCountEl.textContent = countryCount;
    countBadge.textContent = `${total} 项`;

    if (total === 0) {
      listContainer.innerHTML = `
      <div class="empty-state">
        🌱 暂无文化数据，请先在 cultureData.js 中添加
      </div>
    `;
      return;
    }

    // 生成列表项
    let html = "";
    data.forEach((item, index) => {
      const countryChinese = getCountryChinese(item.country);
      const flagEmoji = getCountryEmoji(item.country);
      const imagePath = item.image || "";
      const imageHtml = imagePath
        ? `<img src="${imagePath}" alt="${item.hint}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" />`
        : "";
      const fallbackHtml = !imagePath
        ? `<span class="no-image">📷<br>无图</span>`
        : `<span class="no-image" style="display:none;">📷<br>无图</span>`;

      html += `
      <div class="list-item" data-index="${index}" data-id="${item.id}">
        <div class="item-image" data-img-src="${imagePath}">
          ${imageHtml}
          ${fallbackHtml}
        </div>
        <div class="item-info">
          <div class="item-name">${item.hint}</div>
          <div class="item-country">
            <span class="flag">${flagEmoji}</span>
            ${countryChinese}
          </div>
        </div>
        <button class="detail-btn" data-index="${index}">📖 详情</button>
      </div>
    `;
    });

    listContainer.innerHTML = html;

    // ===== 图片点击放大功能 =====
    document.querySelectorAll(".item-image").forEach((imgContainer) => {
      const img = imgContainer.querySelector("img");
      if (!img) return;
      // 如果图片加载失败（被 onerror 隐藏了），就不绑定点击
      img.addEventListener("click", function (e) {
        e.stopPropagation();
        // 如果图片被隐藏（显示为无图占位），不放大
        if (this.style.display === "none") return;
        // 检查图片是否有效（src 不为空且不是无图占位）
        if (!this.src || this.src === "") return;

        document.body.style.overflow = "hidden";
        const backdrop = document.createElement("div");
        backdrop.style.cssText = `
        position: fixed; 
        top: 0; 
        left: 0; 
        width: 100%; 
        height: 100%; 
        background: rgba(0, 0, 0, 0.85); 
        display: flex; 
        align-items: center; 
        justify-content: center; 
        z-index: 9999; 
        cursor: pointer;
        animation: fadeIn 0.25s ease;
      `;

        const zoomImg = document.createElement("img");
        zoomImg.src = this.src;
        zoomImg.style.cssText = `
        max-width: min(90vw, 500px); 
        max-height: min(90vh, 500px); 
        width: auto; 
        height: auto; 
        object-fit: contain; 
        border-radius: 20px; 
        box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        animation: slideUp 0.3s ease;
      `;

        backdrop.appendChild(zoomImg);

        // 点击背景关闭
        backdrop.addEventListener("click", function () {
          this.remove();
          document.body.style.overflow = "";
        });

        // ESC 键关闭
        const escHandler = function (e) {
          if (e.key === "Escape") {
            if (document.body.contains(backdrop)) {
              backdrop.remove();
              document.body.style.overflow = "";
            }
            document.removeEventListener("keydown", escHandler);
          }
        };
        document.addEventListener("keydown", escHandler);

        document.body.appendChild(backdrop);
      });
    });

    // ===== 事件绑定：详情按钮 =====
    document.querySelectorAll(".detail-btn").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        const index = parseInt(this.dataset.index, 10);
        const item = data[index];
        if (item) {
          openModal(item);
        }
      });
    });
  }

  // ========== 弹窗逻辑 ==========
  let currentModalItem = null;

  function openModal(item) {
    const countryChinese = getCountryChinese(item.country);
    const flagEmoji = getCountryEmoji(item.country);

    modalName.textContent = item.hint;
    modalCountry.textContent = `${flagEmoji} ${countryChinese}`;

    // 处理 content：如果有 content 就用，没有就显示提示
    const contentText = item.content || "📝 暂无详细介绍，请稍后补充。";
    // 支持换行（如果 content 中有 \n 就转成 <br>）
    const formattedContent = contentText.replace(/\n/g, "<br>");
    modalContentText.innerHTML = formattedContent;

    modalOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
    currentModalItem = item;
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
    document.body.style.overflow = "";
    currentModalItem = null;
  }

  // ===== 弹窗事件绑定 =====
  // 点击关闭按钮
  modalCloseBtn.addEventListener("click", closeModal);

  // 点击遮罩（外部）关闭
  modalOverlay.addEventListener("click", function (e) {
    // 只有点击遮罩本身（而不是弹窗内容）才关闭
    if (e.target === modalOverlay) {
      closeModal();
    }
  });

  // ESC 键关闭
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalOverlay.classList.contains("active")) {
      closeModal();
    }
  });

  // ========== 启动 ==========
  // 等待 DOM 完全加载后再渲染
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderList);
  } else {
    renderList();
  }

  // 暴露关闭方法给外部（以备不时之需）
  window.closeCultureModal = closeModal;
})();

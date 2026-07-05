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

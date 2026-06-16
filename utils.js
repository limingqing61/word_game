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

(function () {
  // ========== 音阶配置 ==========
  // 核心音阶数据：每个音符的显示名、频率、颜色
  const NOTE_DATA = {
    // 低音区 (只保留常用的 -5, -6, -7)
    "-5": { label: "Sol", display: "·5", frequency: 196.0, zone: "low" },
    "-6": { label: "La", display: "·6", frequency: 220.0, zone: "low" },
    "-7": { label: "Si", display: "·7", frequency: 246.94, zone: "low" },
    // 中音区 (1 ~ 7)
    1: { label: "Do", display: "1", frequency: 261.63, zone: "mid" },
    2: { label: "Re", display: "2", frequency: 293.66, zone: "mid" },
    3: { label: "Mi", display: "3", frequency: 329.63, zone: "mid" },
    4: { label: "Fa", display: "4", frequency: 349.23, zone: "mid" },
    5: { label: "Sol", display: "5", frequency: 392.0, zone: "mid" },
    6: { label: "La", display: "6", frequency: 440.0, zone: "mid" },
    7: { label: "Si", display: "7", frequency: 493.88, zone: "mid" },
    // 高音区 (只保留常用的 8, 9)
    8: { label: "Do'", display: "1·", frequency: 523.25, zone: "high" },
    9: { label: "Re'", display: "2·", frequency: 587.33, zone: "high" },
  };

  // 音区颜色
  const ZONE_COLORS = {
    low: "key-low",
    mid: "", // 中音用原来的颜色
    high: "key-high",
  };

  // 中音区颜色（1-7）
  const MID_COLORS = {
    1: "key-1",
    2: "key-2",
    3: "key-3",
    4: "key-4",
    5: "key-5",
    6: "key-6",
    7: "key-7",
  };

  function getKeyColor(noteId) {
    const data = NOTE_DATA[noteId];
    if (!data) return "";
    if (data.zone === "low") return "key-low";
    if (data.zone === "high") return "key-high";
    return MID_COLORS[noteId] || "";
  }

  function getNoteDisplay(noteId) {
    const data = NOTE_DATA[noteId];
    return data ? data.display : "?";
  }

  function getNoteLabel(noteId) {
    const data = NOTE_DATA[noteId];
    return data ? data.label : "?";
  }

  function getNoteFrequency(noteId) {
    const data = NOTE_DATA[noteId];
    return data ? data.frequency : 440;
  }

  function getNoteZone(noteId) {
    const data = NOTE_DATA[noteId];
    return data ? data.zone : "mid";
  }

  // ========== DOM 元素 ==========
  const keysContainer = document.getElementById("keysContainer");
  const freeModeBtn = document.getElementById("freeModeBtn");
  const learnModeBtn = document.getElementById("learnModeBtn");
  const songSelect = document.getElementById("songSelect");
  const songTitleDisplay = document.getElementById("songTitleDisplay");
  const lyricLine = document.getElementById("lyricLine");
  const notesLine = document.getElementById("notesLine");
  const progressInfo = document.getElementById("progressInfo");
  const messageArea = document.getElementById("messageArea");
  const backBtn = document.getElementById("backBtn");
  const rangeRadios = document.querySelectorAll('input[name="rangeMode"]');

  // ========== 游戏状态 ==========
  let mode = "free"; // 'free' | 'learn'
  let rangeMode = "simple"; // 'simple' | 'full'
  let currentSong = null;
  let currentLineIndex = 0;
  let currentNoteIndex = 0;
  let isPlayingDemo = false;
  let demoTimeout = null;

  // 固定12键布局（低音5·6·7· + 中音1-7 + 高音1·2·）
  const FIXED_12_KEYS = [-5, -6, -7, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  // ========== 音效 ==========
  let sharedAudioCtx = null;
  let audioAllowed = false;

  function getAudioContext() {
    if (!sharedAudioCtx) {
      sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return sharedAudioCtx;
  }

  function resumeAudioContext() {
    const ctx = getAudioContext();
    if (ctx.state === "suspended") ctx.resume();
  }

  function playNote(frequency, duration = 0.5) {
    try {
      const ctx = getAudioContext();
      resumeAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio error", e);
    }
  }

  function playNoteByNum(num, duration = 0.5) {
    const freq = getNoteFrequency(num);
    if (freq) playNote(freq, duration);
  }

  // ========== 琴键渲染 ==========
  function getRequiredNotes() {
    // 固定12键布局，不再区分模式和扫描歌曲
    return FIXED_12_KEYS;
  }

  function renderKeys() {
    const notes = getRequiredNotes();
    keysContainer.innerHTML = "";

    // 直接渲染所有键，不分组，不显示音区标签
    notes.forEach((n) => {
      keysContainer.appendChild(createKeyElement(n));
    });
  }

  function createKeyElement(noteId) {
    const key = document.createElement("div");
    const display = getNoteDisplay(noteId);
    const label = getNoteLabel(noteId);
    const color = getKeyColor(noteId);

    key.className = `key ${color}`;
    key.dataset.noteId = noteId;
    key.innerHTML = `
            <span class="key-note">${display}</span>
            <span class="key-label">${label}</span>
        `;
    key.addEventListener("click", () => onKeyClick(noteId));
    key.addEventListener("touchstart", (e) => {
      e.preventDefault();
      onKeyClick(noteId);
    });
    return key;
  }

  // ========== 琴键点击 ==========
  function onKeyClick(noteId) {
    if (isPlayingDemo) return;
    const freq = getNoteFrequency(noteId);
    if (!freq) return;
    playNote(freq);

    const keyEl = keysContainer.querySelector(`.key[data-note-id="${noteId}"]`);
    if (keyEl) {
      keyEl.classList.remove("flash-green", "flash-red");
      void keyEl.offsetWidth;
      if (mode === "free") {
        keyEl.classList.add("flash-green");
        setTimeout(() => keyEl.classList.remove("flash-green"), 300);
      } else {
        handleLearnModeClick(noteId, keyEl);
      }
    }
  }

  // ========== 跟谱模式 ==========
  function handleLearnModeClick(noteId, keyEl) {
    if (!currentSong || !currentSong.lines || currentSong.lines.length === 0) {
      messageArea.textContent = "⚠️ 请先选择一首歌曲";
      messageArea.className = "message-area error";
      return;
    }

    const line = currentSong.lines[currentLineIndex];
    if (!line) {
      showComplete();
      return;
    }

    const expected = line.notes[currentNoteIndex];
    if (noteId === expected) {
      keyEl.classList.add("flash-green");
      setTimeout(() => keyEl.classList.remove("flash-green"), 300);
      currentNoteIndex++;
      updateSheetDisplay();

      if (currentNoteIndex >= line.notes.length) {
        messageArea.textContent = `✅ 第 ${currentLineIndex + 1} 句完成！`;
        messageArea.className = "message-area success";
        setTimeout(() => {
          currentLineIndex++;
          currentNoteIndex = 0;
          if (currentLineIndex >= currentSong.lines.length) {
            showComplete();
          } else {
            messageArea.textContent = `🎵 下一句：${currentSong.lines[currentLineIndex].lyric}`;
            messageArea.className = "message-area";
            updateSheetDisplay();
          }
        }, 800);
      }
    } else {
      keyEl.classList.add("flash-red");
      setTimeout(() => keyEl.classList.remove("flash-red"), 300);
      messageArea.textContent = `❌ 弹错了，重新开始这句`;
      messageArea.className = "message-area error";
      currentNoteIndex = 0;
      updateSheetDisplay();
      setTimeout(() => {
        messageArea.textContent = `🔄 重新弹奏：${currentSong.lines[currentLineIndex].lyric}`;
        messageArea.className = "message-area";
      }, 1200);
    }
  }

  // ========== 乐谱显示 ==========
  function updateSheetDisplay() {
    if (!currentSong || !currentSong.lines || currentSong.lines.length === 0) {
      songTitleDisplay.textContent = "🎶 自由弹奏";
      lyricLine.textContent = "";
      notesLine.innerHTML = "";
      progressInfo.textContent = "";
      return;
    }

    const line = currentSong.lines[currentLineIndex];
    if (!line) {
      lyricLine.textContent = "🎉 全部完成！";
      notesLine.innerHTML = "";
      progressInfo.textContent = "";
      return;
    }

    lyricLine.textContent = line.lyric;

    let html = "";
    line.notes.forEach((num, idx) => {
      const display = getNoteDisplay(num);
      let cls = "note-slot";
      if (idx < currentNoteIndex) cls += " done";
      if (idx === currentNoteIndex) cls += " active";
      html += `<span class="${cls}">${display}</span>`;
    });
    notesLine.innerHTML = html;

    const total = currentSong.lines.length;
    progressInfo.textContent = `📊 第 ${currentLineIndex + 1} / ${total} 句`;
  }

  // ========== 完整旋律播放 ==========
  function playFullMelody() {
    if (!currentSong || isPlayingDemo) return;
    const lines = currentSong.lines;
    if (lines.length === 0) return;

    isPlayingDemo = true;
    messageArea.textContent = "🔊 播放完整旋律...";
    messageArea.className = "message-area";

    let lineIndex = 0;
    let noteIndex = 0;
    const noteDuration = 250;
    const pauseBetweenLines = 500;

    function playNextNote() {
      if (lineIndex >= lines.length) {
        isPlayingDemo = false;
        messageArea.textContent = "🎵 播放结束！点击琴键继续练习";
        messageArea.className = "message-area success";
        document
          .querySelectorAll(".note-slot")
          .forEach((el) => el.classList.remove("active", "done"));
        return;
      }

      const line = lines[lineIndex];
      if (noteIndex >= line.notes.length) {
        demoTimeout = setTimeout(() => {
          lineIndex++;
          noteIndex = 0;
          updateSheetDisplayForDemo(lineIndex);
          playNextNote();
        }, pauseBetweenLines);
        return;
      }

      const num = line.notes[noteIndex];
      playNoteByNum(num, 0.25);

      const slots = notesLine.querySelectorAll(".note-slot");
      slots.forEach((el, i) => {
        el.classList.remove("active", "done");
        if (i === noteIndex) el.classList.add("active");
        if (i < noteIndex) el.classList.add("done");
      });

      noteIndex++;
      demoTimeout = setTimeout(playNextNote, noteDuration);
    }

    function updateSheetDisplayForDemo(lineIdx) {
      if (!currentSong || lineIdx >= currentSong.lines.length) return;
      const line = currentSong.lines[lineIdx];
      lyricLine.textContent = line.lyric;
      let html = "";
      line.notes.forEach((num, idx) => {
        const display = getNoteDisplay(num);
        let cls = "note-slot";
        if (idx === 0) cls += " active";
        html += `<span class="${cls}">${display}</span>`;
      });
      notesLine.innerHTML = html;
      const total = currentSong.lines.length;
      progressInfo.textContent = `📊 第 ${lineIdx + 1} / ${total} 句`;
    }

    updateSheetDisplayForDemo(0);
    playNextNote();
  }

  // ========== 完成 ==========
  function showComplete() {
    lyricLine.textContent = "🎉 太棒啦！你弹完了整首歌！🎉";
    notesLine.innerHTML = "";
    progressInfo.textContent = "✅ 完成！";
    messageArea.textContent = "🎵 即将播放完整旋律...";
    messageArea.className = "message-area success";

    setTimeout(() => {
      playFullMelody();
    }, 1000);
  }

  // ========== 加载歌曲 ==========
  function loadSong(songId) {
    if (isPlayingDemo) {
      if (demoTimeout) clearTimeout(demoTimeout);
      isPlayingDemo = false;
    }

    const songs = window.MUSIC_DATA ? window.MUSIC_DATA.songs : [];
    const song = songs.find((s) => s.id === songId);
    if (!song) {
      currentSong = null;
      songTitleDisplay.textContent = "🎶 自由弹奏";
      lyricLine.textContent = "";
      notesLine.innerHTML = "";
      progressInfo.textContent = "";
      messageArea.textContent = "💡 点击琴键自由弹奏";
      messageArea.className = "message-area";
      renderKeys();
      return;
    }

    currentSong = song;
    currentLineIndex = 0;
    currentNoteIndex = 0;
    songTitleDisplay.textContent = `🎤 ${song.title} (${song.titleEn})`;
    messageArea.textContent = `🎵 开始弹奏：${song.lines[0].lyric}`;
    messageArea.className = "message-area";
    updateSheetDisplay();
    renderKeys();
  }

  // ========== 初始化歌曲列表 ==========
  function initSongSelect() {
    const songs = window.MUSIC_DATA ? window.MUSIC_DATA.songs : [];
    songSelect.innerHTML = '<option value="__free">🎵 自由弹奏</option>';
    songs.forEach((song) => {
      const opt = document.createElement("option");
      opt.value = song.id;
      opt.textContent = `${song.title} (${song.titleEn})`;
      songSelect.appendChild(opt);
    });
    songSelect.value = "__free";
    songSelect.addEventListener("change", () => {
      const val = songSelect.value;
      if (val === "__free") {
        mode = "free";
        freeModeBtn.classList.add("active");
        learnModeBtn.classList.remove("active");
        loadSong(null);
      } else {
        mode = "learn";
        learnModeBtn.classList.add("active");
        freeModeBtn.classList.remove("active");
        loadSong(val);
      }
    });
  }

  // ========== 事件绑定 ==========
  function bindEvents() {
    freeModeBtn.addEventListener("click", () => {
      if (isPlayingDemo) {
        if (demoTimeout) clearTimeout(demoTimeout);
        isPlayingDemo = false;
      }
      mode = "free";
      freeModeBtn.classList.add("active");
      learnModeBtn.classList.remove("active");
      songSelect.value = "__free";
      loadSong(null);
      messageArea.textContent = "🎵 自由弹奏模式，点击琴键随意发挥！";
      messageArea.className = "message-area";
    });

    learnModeBtn.addEventListener("click", () => {
      if (isPlayingDemo) {
        if (demoTimeout) clearTimeout(demoTimeout);
        isPlayingDemo = false;
      }
      mode = "learn";
      learnModeBtn.classList.add("active");
      freeModeBtn.classList.remove("active");
      const val = songSelect.value;
      if (val && val !== "__free") {
        loadSong(val);
      } else {
        const songs = window.MUSIC_DATA ? window.MUSIC_DATA.songs : [];
        if (songs.length > 0) {
          songSelect.value = songs[0].id;
          loadSong(songs[0].id);
        } else {
          messageArea.textContent = "⚠️ 暂无歌曲，请检查数据";
          messageArea.className = "message-area error";
        }
      }
    });

    bindGoHome(backBtn);

    // 启动遮罩
    const startOverlay = document.getElementById("startOverlay");
    const startBtn = document.getElementById("startBtn");
    const gameContainer = document.getElementById("gameContainer");

    function initAndStart() {
      if (startOverlay) startOverlay.style.display = "none";
      if (gameContainer) gameContainer.style.display = "block";
      wakeUpAudio();
      initSongSelect();
      loadSong(null);
      messageArea.textContent = "🎵 点击琴键开始演奏！";
      messageArea.className = "message-area";
      renderKeys();
    }

    if (startBtn) {
      startBtn.addEventListener("click", initAndStart);
    }
  }

  // ========== 唤醒音频 ==========
  function wakeUpAudio() {
    if (audioAllowed) return;
    try {
      const ctx = getAudioContext();
      const silentOsc = ctx.createOscillator();
      const silentGain = ctx.createGain();
      silentGain.gain.value = 0;
      silentOsc.connect(silentGain);
      silentGain.connect(ctx.destination);
      silentOsc.start();
      silentOsc.stop(ctx.currentTime + 0.01);
      ctx.resume();
      audioAllowed = true;
    } catch (e) {}
  }

  // ========== 数据检查 ==========
  function checkData() {
    if (typeof window.MUSIC_DATA === "undefined") {
      console.error("❌ MUSIC_DATA 未加载");
      const container = document.querySelector(".game-container");
      if (container) {
        container.innerHTML = `
                    <div style="text-align:center;padding:40px;color:#ffecb3;">
                        <h2>⚠️ 数据加载失败</h2>
                        <p>请检查 musicData.js 是否存在</p>
                    </div>
                `;
      }
      return false;
    }
    return true;
  }

  // ========== 启动 ==========
  if (checkData()) {
    bindEvents();
    // 初始渲染琴键（会在启动后由 initAndStart 触发）
  }
})();

(function () {
  // ========== 音阶配置 ==========
  // 21 个音：低音 1-7（负数为编码）、中音 1-7、高音 1-7（+7 为编码）
  // 跟谱练习只开放 12 键：[-5,-6,-7, 1~7, 8,9]
  // 播放乐谱可播放全部 21 个音
  const NOTE_DATA = {
    // ===== 低音区 1-7 =====
    "-1": { label: "Do", display: "·1", frequency: 130.81, zone: "low" },
    "-2": { label: "Re", display: "·2", frequency: 146.83, zone: "low" },
    "-3": { label: "Mi", display: "·3", frequency: 164.81, zone: "low" },
    "-4": { label: "Fa", display: "·4", frequency: 174.61, zone: "low" },
    "-5": { label: "Sol", display: "·5", frequency: 196.0, zone: "low" },
    "-6": { label: "La", display: "·6", frequency: 220.0, zone: "low" },
    "-7": { label: "Si", display: "·7", frequency: 246.94, zone: "low" },
    // ===== 中音区 1-7 =====
    1: { label: "Do", display: "1", frequency: 261.63, zone: "mid" },
    2: { label: "Re", display: "2", frequency: 293.66, zone: "mid" },
    3: { label: "Mi", display: "3", frequency: 329.63, zone: "mid" },
    4: { label: "Fa", display: "4", frequency: 349.23, zone: "mid" },
    5: { label: "Sol", display: "5", frequency: 392.0, zone: "mid" },
    6: { label: "La", display: "6", frequency: 440.0, zone: "mid" },
    7: { label: "Si", display: "7", frequency: 493.88, zone: "mid" },
    // ===== 高音区 1-7 =====
    8: { label: "Do'", display: "1·", frequency: 523.25, zone: "high" },
    9: { label: "Re'", display: "2·", frequency: 587.33, zone: "high" },
    10: { label: "Mi'", display: "3·", frequency: 659.25, zone: "high" },
    11: { label: "Fa'", display: "4·", frequency: 698.46, zone: "high" },
    12: { label: "Sol'", display: "5·", frequency: 783.99, zone: "high" },
    13: { label: "La'", display: "6·", frequency: 880.0, zone: "high" },
    14: { label: "Si'", display: "7·", frequency: 987.77, zone: "high" },
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

  // ========== DOM 元素 ==========
  const keysContainer = document.getElementById("keysContainer");
  const freeModeBtn = document.getElementById("freeModeBtn");
  const learnModeBtn = document.getElementById("learnModeBtn");
  const playModeBtn = document.getElementById("playModeBtn");
  const songSelector = document.getElementById("songSelector");
  const songSelect = document.getElementById("songSelect");
  const songTitleDisplay = document.getElementById("songTitleDisplay");
  const lyricLine = document.getElementById("lyricLine");
  const notesLine = document.getElementById("notesLine");
  const progressInfo = document.getElementById("progressInfo");
  const progressBarContainer = document.getElementById("progressBarContainer");
  const progressBarFill = document.getElementById("progressBarFill");
  const messageArea = document.getElementById("messageArea");
  const backBtn = document.getElementById("backBtn");

  // ========== 游戏状态 ==========
  let mode = "free"; // 'free' | 'learn' | 'play'
  let currentSong = null;
  let currentLineIndex = 0;
  let currentNoteIndex = 0;
  let isPlayingDemo = false;
  let demoTimeout = null;
  let autoPlayTimer = null;

  // 固定 12 键布局（跟谱练习用）：低音 5-7 + 中音 1-7 + 高音 1-2
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

  // ========== 琴键渲染（仅跟谱练习用） ==========
  function renderKeys() {
    keysContainer.innerHTML = "";
    FIXED_12_KEYS.forEach((n) => {
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
    if (!keyEl) return;

    keyEl.classList.remove("flash-green", "flash-red");
    void keyEl.offsetWidth;

    if (mode === "learn") {
      handleLearnModeClick(noteId, keyEl);
    } else {
      // 自由弹奏或其它情况：仅视觉反馈
      keyEl.classList.add("flash-green");
      setTimeout(() => keyEl.classList.remove("flash-green"), 300);
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

  // ========== 停止播放（清定时器 + 标记） ==========
  function stopPlayback() {
    if (demoTimeout) {
      clearTimeout(demoTimeout);
      demoTimeout = null;
    }
    if (autoPlayTimer) {
      clearTimeout(autoPlayTimer);
      autoPlayTimer = null;
    }
    isPlayingDemo = false;
  }

  // ========== 完整旋律播放 ==========
  function playFullMelody() {
    if (!currentSong) return;

    // 如果正在播放，先停掉（允许中断重放）
    stopPlayback();

    const lines = currentSong.lines;
    if (lines.length === 0) return;

    // 重置进度，从第一句第一个音开始
    currentLineIndex = 0;
    currentNoteIndex = 0;

    isPlayingDemo = true;
    messageArea.textContent = "🔊 播放中...";
    messageArea.className = "message-area";
    progressBarFill.style.width = "0%";

    let lineIndex = 0;
    let noteIndex = 0;
    const noteDuration = 250;
    const pauseBetweenLines = 500;

    // 计算总音符数，用于进度条
    const totalNotes = lines.reduce((sum, line) => sum + line.notes.length, 0);
    let playedNotes = 0;

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

    function playNextNote() {
      if (lineIndex >= lines.length) {
        isPlayingDemo = false;
        progressBarFill.style.width = "100%";
        messageArea.textContent = "🎵 播放结束！";
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
      playedNotes++;
      progressBarFill.style.width = `${(playedNotes / totalNotes) * 100}%`;

      demoTimeout = setTimeout(playNextNote, noteDuration);
    }

    updateSheetDisplayForDemo(0);
    playNextNote();
  }

  // ========== 跟谱完成 ==========
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

  // ========== 下拉列表填充（按模式过滤） ==========
  // onlyPlayable=true → 只显示 playable !== false 的歌（跟谱练习）
  // onlyPlayable=false → 显示全部（播放乐谱）
  function populateSongSelect(onlyPlayable) {
    const songs = window.MUSIC_DATA ? window.MUSIC_DATA.songs : [];
    const currentValue = songSelect.value;
    const filtered = onlyPlayable
      ? songs.filter((s) => s.playable !== false)
      : songs;

    songSelect.innerHTML = "";
    filtered.forEach((song) => {
      const opt = document.createElement("option");
      opt.value = song.id;
      opt.textContent = `${song.title} (${song.titleEn})`;
      songSelect.appendChild(opt);
    });

    if (filtered.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "（无可用歌曲）";
      songSelect.appendChild(opt);
      return;
    }

    // 尽量保持之前选中的歌曲
    if (currentValue && filtered.some((s) => s.id === currentValue)) {
      songSelect.value = currentValue;
    }
  }

  // ========== 模式切换 ==========
  function setMode(newMode) {
    // 切换前先停止所有播放
    stopPlayback();

    mode = newMode;

    // 按钮激活态
    freeModeBtn.classList.toggle("active", newMode === "free");
    learnModeBtn.classList.toggle("active", newMode === "learn");
    playModeBtn.classList.toggle("active", newMode === "play");

    // 显示控制
    if (newMode === "free") {
      songSelector.classList.add("hidden");
      keysContainer.style.display = "flex";
      progressBarContainer.style.display = "none";

      currentSong = null;
      currentLineIndex = 0;
      currentNoteIndex = 0;
      songTitleDisplay.textContent = "🎶 自由弹奏";
      lyricLine.textContent = "";
      notesLine.innerHTML = "";
      progressInfo.textContent = "";
      progressBarFill.style.width = "0%";
      messageArea.textContent = "🎵 自由弹奏模式，点击琴键随意发挥！";
      messageArea.className = "message-area";
      return;
    }

    // learn 或 play
    songSelector.classList.remove("hidden");
    keysContainer.style.display = newMode === "play" ? "none" : "flex";
    progressBarContainer.style.display = newMode === "play" ? "block" : "none";

    // 根据模式填充下拉列表：跟谱练习只显示 playable，播放乐谱显示全部
    populateSongSelect(newMode === "learn");

    // 确保有选中的歌曲
    let songId = songSelect.value;
    const songs = window.MUSIC_DATA ? window.MUSIC_DATA.songs : [];
    const validSongs =
      newMode === "learn" ? songs.filter((s) => s.playable !== false) : songs;
    if (!songId || !validSongs.find((s) => s.id === songId)) {
      if (validSongs.length > 0) {
        songId = validSongs[0].id;
        songSelect.value = songId;
      } else {
        messageArea.textContent = "⚠️ 暂无可用歌曲";
        messageArea.className = "message-area error";
        return;
      }
    }

    loadSong(songId);
  }

  // ========== 加载歌曲 ==========
  function loadSong(songId, autoPlay = false) {
    stopPlayback();

    const songs = window.MUSIC_DATA ? window.MUSIC_DATA.songs : [];
    const song = songs.find((s) => s.id === songId);
    if (!song) {
      currentSong = null;
      return;
    }

    currentSong = song;
    currentLineIndex = 0;
    currentNoteIndex = 0;
    progressBarFill.style.width = "0%";

    songTitleDisplay.textContent = `🎤 ${song.title} (${song.titleEn})`;
    updateSheetDisplay();

    if (mode === "learn") {
      messageArea.textContent = `🎵 开始弹奏：${song.lines[0].lyric}`;
      messageArea.className = "message-area";
    } else if (mode === "play") {
      if (autoPlay) {
        autoPlayTimer = setTimeout(() => {
          autoPlayTimer = null;
          playFullMelody();
        }, 300);
      } else {
        messageArea.textContent = "👆 请从下拉框选择歌曲开始播放";
        messageArea.className = "message-area";
      }
    }
  }

  // ========== 初始化歌曲列表（只绑定 onchange，内容由 setMode 填充） ==========
  function initSongSelect() {
    songSelect.onchange = () => {
      const songId = songSelect.value;
      if (!songId) return;
      if (mode === "learn") {
        loadSong(songId);
      } else if (mode === "play") {
        loadSong(songId, true);
      }
    };
  }

  // ========== 事件绑定 ==========
  function bindEvents() {
    freeModeBtn.addEventListener("click", () => setMode("free"));
    learnModeBtn.addEventListener("click", () => setMode("learn"));
    playModeBtn.addEventListener("click", () => setMode("play"));

    bindGoHome(backBtn);

    const startOverlay = document.getElementById("startOverlay");
    const startBtn = document.getElementById("startBtn");
    const gameContainer = document.getElementById("gameContainer");

    function initAndStart() {
      if (startOverlay) startOverlay.style.display = "none";
      if (gameContainer) gameContainer.style.display = "block";
      wakeUpAudio();
      initSongSelect();
      renderKeys();
      setMode("free");
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

  // ========== 辅助工具：检查某首歌是否在 12 键范围内 ==========
  // 挂到 window，方便控制台批量验证
  function checkSongPlayable(song) {
    const FIXED_KEYS = [-5, -6, -7, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const allNotes = [];
    for (const line of song.lines) {
      allNotes.push(...line.notes);
    }
    const outOfRange = allNotes.filter((n) => !FIXED_KEYS.includes(n));
    return {
      playable: outOfRange.length === 0,
      outOfRange: [...new Set(outOfRange)],
    };
  }
  window.checkSongPlayable = checkSongPlayable;

  // ========== 启动 ==========
  if (checkData()) {
    bindEvents();
  }
})();

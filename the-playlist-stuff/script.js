//this widget is created in 2025 by elsie
//check out my website at elswhere.neocities.org
//released under the MIT lisence


//actual code below
//inject html

document.addEventListener("DOMContentLoaded", () => {
  mountPlayer(); // put the HTML into #player
  initPlayerUI(); // query elements & attach listeners
});

const playerHTML = `
          <button id="prev" aria-label="Previous">⏮</button>
          <button id="play" aria-label="Play/Pause">▶</button>
          <button id="next" aria-label="Next">⏭</button>
          <button id="shuffle" aria-label="Shuffle">🔀</button>
          <button id="repeat" aria-label="Repeat">🔁</button>
          //if you want to have different looking buttons, just change the html content above
          
          <div class="track">
            <div class="title-wrap">
              <div class="title" id="title" style="font-family: 'VT323';">-</div>
            </div>
            
            <div class="progress" id="progress">
              <div class="progress-bar" id="progressBar"></div>
            </div>
            <div class="time" >
              <span id="currentTime" style="font-family: 'VT323';">0:00</span>
              <span id="duration" style="font-family: 'VT323';">0:00</span>
            </div>
          </div>

          <button id="btnPlaylist" aria-haspopup="listbox" aria-expanded="false" aria-controls="playlistPanel">🎵</button>
          <div id="playlistPanel" class="playlist" role="listbox" tabindex="-1" hidden style="font-family: 'VT323';"></div> 


          <input id="volume" type="range" min="0" max="1" step="0.01" value="0.5" aria-label="Volume">`;

function mountPlayer(opts={}) {
  const root = document.getElementById("player");
  if (!root) return; // page without a player
  root.innerHTML = playerHTML;
}

function initPlayerUI(opts={}) {

  showConsoleCredit(opts);
  
  let path = window.location.pathname;

  let rootPath = "";
  if(
    path.includes("extra/mediarec/")
  ) {
    rootPath = "../../../"; 
  } else if (
    path.includes("blog/posts/") 
  ) {
    rootPath = "../../";
  } else if (
    path.includes("blog/") ||
    path.includes("artworks/") ||
    path.includes("about/") ||
    path.includes("extra/")
  ) {
    rootPath = "../";
  } else {
    rootPath = ""; //main index.html
  }


  // oh my lord so many consts
  const audio = document.getElementById("audio");
  const btnPlay = document.getElementById("play");
  const btnNext = document.getElementById("next");
  const btnPrev = document.getElementById("prev");
  const btnShuffle = document.getElementById("shuffle");
  const btnRepeat = document.getElementById("repeat");
  const titleEl = document.getElementById("title");
  const progress = document.getElementById("progress");
  const progressBar = document.getElementById("progressBar");
  const volume = document.getElementById("volume");

  let list = [];
  let index = 0;
  let repeat = "all";
  let shuffle = false;
  
  // 1) fetch playlist.json
  fetch(`${rootPath}music/playlist.json`, {cache: 'no-store'})
    .then((r) => r.json())
    .then((tracks) => {
      list = tracks;
      //load playlist
      list = tracks; 
      renderPlaylist();
      restoreStateThenLoad();

      load(index);

      audio.crossOrigin = "anonymous";
      audio.src = resolveSrc(t.src);
      audio.load();
    })
    .catch((err) => console.error("Playlist load failed:", err));


  //1.1) restore state
  function restoreStateThenLoad() {
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch {}
  // Defaults if nothing saved yet
  let i = 0, resumeTime = 0, resumePlay = false;

  if (saved) {
    // Prefer matching by src (safer if playlist order changed)
    const bySrc = saved.src ? list.findIndex(t => t.src === saved.src) : -1;
    i = bySrc >= 0 ? bySrc : (
      Number.isInteger(saved.index) && saved.index >= 0 && saved.index < list.length
        ? saved.index : 0
    );

    // restore modes + volume
    if (typeof saved.shuffle === 'boolean') shuffle = saved.shuffle;
    if (saved.repeat) repeat = saved.repeat;
    if (typeof saved.vol === 'number') {
      audio.volume = Math.min(1, Math.max(0, saved.vol));
      volume && (volume.value = audio.volume);
    }

    resumeTime = Number(saved.time) || 0;
    resumePlay = !!saved.playing;  
  }

  // Load the track now
  load(i);

  const onMeta = () => {
    audio.removeEventListener('loadedmetadata', onMeta);
    if (isFinite(audio.duration)) {
      audio.currentTime = Math.min(resumeTime, audio.duration - 0.25);
    }
    if (resumePlay) {
      const resumeOnce = () => {
        play();                         // your existing play()
        document.removeEventListener('click', resumeOnce, true);
        document.removeEventListener('keydown', resumeOnce, true);
      };
      // any click or keypress will resume
      document.addEventListener('click', resumeOnce, true);
      document.addEventListener('keydown', resumeOnce, true);
      // Optional: show a tiny “tap to resume ▶” hint near the player
    }
  };
  audio.addEventListener('loadedmetadata', onMeta);
}

  //1.5) title scrolling

  const titleWrap = document.querySelector(".title-wrap");
  const titleMarquee = document.getElementById("title");

  function setTitle(text) {
    // reset
    titleMarquee.classList.remove("scroll");
    titleMarquee.style.removeProperty("--scroll-distance");
    titleMarquee.style.removeProperty("--duration");

    // set fresh text
    titleMarquee.textContent = text;

    // If it fits, don't animate
    requestAnimationFrame(() => {
      const needsScroll = titleMarquee.scrollWidth > titleWrap.clientWidth;
      if (!needsScroll) return;

      // Duplicate the text so it loops smoothly
      const gap = " \u00A0\u00A0\u00A0 ";
      titleMarquee.innerHTML = `${text}${gap}${text}`;

      // Distance to travel = width of one copy
      const distance = titleMarquee.scrollWidth / 2;

      // Speed: ~40px/sec (tweak to taste)
      const duration = Math.max(10, distance / 40);

      titleMarquee.style.setProperty("--scroll-distance", distance + "px");
      titleMarquee.style.setProperty("--duration", duration + "s");
      titleMarquee.classList.add("scroll");
    });
  }

  //1.6) time marker
  const curEl = document.getElementById("currentTime");
  const durEl = document.getElementById("duration");

  // mm:ss (or h:mm:ss if long)
  function fmtTime(s) {
    if (!isFinite(s)) return "0:00";
    s = Math.floor(s);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = String(s % 60).padStart(2, "0");
    return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
  }

  //1.7) Playlist panel

  const btnPlaylist = document.getElementById("btnPlaylist");
  const panel = document.getElementById("playlistPanel");

  function renderPlaylist() {
    if (!panel) return;
    panel.innerHTML = list
      .map(
        (t, i) => `
    <div class="playlist_item" role="option"
         data-index="${i}"
         aria-selected="${i === index}">
      <div class="playlist_title">${t.artist}${t.title ? " — " + t.title : ""}</div>
    </div>
  `
      )
      .join("");
  }

  function prefetchDurations() {
    list.forEach((t, i) => {
      if (t._durFetched) return;
      t._durFetched = true;
      const a = new Audio();
      a.crossOrigin = "anonymous"; // helps metadata on some hosts
      a.preload = "metadata";
      a.src = resolveSrc(t.src);
      a.src = t.src;
      a.addEventListener(
        "loadedmetadata",
        () => {
          t._dur = fmtTime(a.duration);
          const row = panel.querySelector(`.playlist_item[data-index="${i}"]`);
          if (row && !row.querySelector(".playlist_dur")) {
            row.insertAdjacentHTML(
              "beforeend",
              `<div class="playlist_dur">${t._dur}</div>`
            );
          }
        },
        { once: true }
      );
    });
  }

  function openPlaylist() {
    panel.hidden = false;
    panel.setAttribute("aria-open", "true");
    btnPlaylist.setAttribute("aria-expanded", "true");
    panel.focus();
  }
  function closePlaylist() {
    panel.hidden = true;
    panel.setAttribute("aria-open", "false");
    btnPlaylist.setAttribute("aria-expanded", "false");
    setTimeout(() => (panel.hidden = true), 150);
  }

  // Button click toggles
  btnPlaylist.addEventListener("click", () => {
    panel.hidden ? openPlaylist() : closePlaylist();
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (panel.hidden) return;
    const within = panel.contains(e.target) || btnPlaylist.contains(e.target);
    if (!within) closePlaylist();
  });

  // Close on Esc
  panel.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closePlaylist();
      btnPlaylist.focus();
    }
  });

  panel.addEventListener("click", (e) => {
    const row = e.target.closest(".playlist_item");
    if (!row) return;
    const i = +row.dataset.index;
    load(i);
    play();
    renderPlaylist(); // refresh highlight
    closePlaylist();
  });

  function focusActiveRow() {
    const row = panel.querySelector(`.playlist_item[data-index="${index}"]`);
    row?.scrollIntoView({ block: "nearest" });
  }


  //1.9) save state
  //9) remember play progress

function throttle (fn, ms) {
  let t = 0;
  return (...args) => {
    const now = Date.now();
    if (now - t >= ms) {
      t = now;
      fn(...args);
    }
  }
}

const STORAGE_KEY = 'localPlayer';

const saveState = throttle(() => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        index: index,
        src: list[index]?.src || null,
        time: audio.currentTime || 0,
        vol: audio.volume,
        shuffle,
        repeat,
        playing: !audio.paused,
        updatedAT: Date.now()
      })
    );
  } catch (e) {
    console.warn("Failed to save player state:", e);
  }
}, 500);



  // 2) load a track into the audio tag
  function load(i) {
    index = (i + list.length) % list.length;
    const t = list[index];
    audio.src = t.src; // direct MP3/OGG URL
    setTitle(`${t.artist} - ${t.title ?? ""}`.trim());
    curEl.textContent = "0:00";
    durEl.textContent = "0:00";
    saveState();// save current state
    // load playlist
    renderPlaylist();
    prefetchDurations();
    focusActiveRow();
  }

  // 2.5) update time markers when loaded

  audio.addEventListener("loadedmetadata", () => {
    durEl.textContent = fmtTime(audio.duration);
    curEl.textContent = fmtTime(audio.currentTime || 0);
  });

  audio.addEventListener("timeupdate", () => {
    curEl.textContent = fmtTime(audio.currentTime);
  });

  progress?.addEventListener("click", () => {
    curEl.textContent = fmtTime(audio.currentTime);
  });

  audio.addEventListener("ended", () => {
    curEl.textContent = fmtTime(audio.duration);
  });


  // 2.7) when to save state

  // when to save? 

    audio.addEventListener('timeupdate', saveState);
    progress?.addEventListener('click', () => saveState());
    btnPlay.addEventListener('click', () => saveState());
    volume.addEventListener('input', () => saveState());
    btnShuffle.addEventListener('click', () => { shuffle = !shuffle; saveState(); });
    btnRepeat.addEventListener('click', () => { /* cycle repeat */ saveState(); });
    window.addEventListener('pagehide', saveState);



  // 3) play/pause logic
  function play() {
    audio
      .play()
      .then(() => {
        btnPlay.textContent = "⏸";
      })
      .catch((err) => {
        console.warn("Play failed (likely autoplay policy):", err);
      });
  }
  function pause() {
    audio.pause();
    btnPlay.textContent = "▶";
  }

  // 4) wire up buttons
  btnPlay.addEventListener("click", () => (audio.paused ? play() : pause()));
  btnNext.addEventListener("click", () => {
    next();
    play();
  });
  btnPrev.addEventListener("click", () => {
    prev();
    play();
  });

  function next() {
    if (shuffle) {
      let j;
      do {
        j = Math.floor(Math.random() * list.length);
      } while (j === index && list.length > 1);
      load(j);
    } else {
      load(index + 1);
    }
  }
  function prev() {
    load(index - 1);
  }

  // 5) time/progress UI

  audio.addEventListener("timeupdate", () => {
    if (!isFinite(audio.duration)) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = `${pct}%`;
  });

  // click to seek
  progress.addEventListener("click", (e) => {
    const rect = progress.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    if (isFinite(audio.duration)) audio.currentTime = pct * audio.duration;
  });

  // 6) when a song ends → next depending on repeat mode
  audio.addEventListener("ended", () => {
    if (repeat === "one") {
      audio.currentTime = 0;
      play();
      return;
    }
    if (repeat === "all") {
      next();
      play();
      return;
    }
    // 'off'
    btnPlay.textContent = "▶️";
  });

  // 7) volume (and remember it)
  const savedVol = +localStorage.getItem("vol");
  if (!Number.isNaN(savedVol)) {
    volume.value = savedVol;
    audio.volume = savedVol;
  }
  volume.addEventListener("input", () => {
    audio.volume = +volume.value;
    localStorage.setItem("vol", volume.value);
  });

  //8) shuffle and repeat

  btnShuffle.addEventListener("click", () => {
    shuffle = !shuffle;
    btnShuffle.style.opacity = shuffle ? "1" : ".5";
  });

  btnRepeat.addEventListener("click", () => {
    repeat = repeat === "all" ? "one" : repeat === "one" ? "off" : "all";
    btnRepeat.textContent = repeat === "one" ? "🔂" : "🔁";
    btnRepeat.style.opacity = repeat === "off" ? ".5" : "1";
  });
  
} //end of initPlayerUI


//9) remember play progress

function throttle (fn, ms) {
  let t = 0;
  return (...args) => {
    const now = Date.now();
    if (now - t >= ms) {
      t = now;
      fn(...args);
    }
  }
}

//don't change the section below or else i will b really sad ------

function showConsoleCredit(opts = {}) {
  // allow turning it off: init({ credit:false })
  if (opts.credit === false) return;

  // avoid duplicates (per page load)
  if (window.__lilacCreditShown) return;
  window.__lilacCreditShown = true;


  const NAME = "elsie's music player widget";
  const VERSION = '1.0.0';
  const URL = 'https://github.com/elsieeeyjd/music-player-bar';

  const credStart = "this lovely site uses: ";
  const tag   = `${NAME} v${VERSION} `;
  const style = 'background:#8b5cf6;color:#fff;padding:2px 8px;border-radius:8px;font-weight:600';
  const msg   = `by elsie — MIT — ${URL}`;

  console.info(`${credStart}%c${tag}%c ${msg} ${URL}`, style, '');
}


//------------------

const STORAGE_KEY = 'elsiePlayer';

const saveState = throttle(() => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        index: index,
        src: list[index]?.src || null,
        time: audio.currentTime || 0,
        vol: audio.volume,
        shuffle,
        repeat,
        playing: !audio.paused,
        updatedAT: Date.now()
      })
    );
  } catch (e) {
    console.warn("Failed to save player state:", e);
  }
}, 500);

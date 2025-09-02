let synth = window.speechSynthesis;
let voices = [];

class AudioPlayer {
    constructor() {
      this.audio = new Audio();
      this.currentCallback = null;
  
      this.audio.addEventListener('ended', this.handleStop.bind(this, 'ended'));
      this.audio.addEventListener('error', this.handleStop.bind(this, 'error'));
      this.audio.addEventListener('pause', this.handleStop.bind(this, 'pause'));
    }
  
    play(url, volume, playbackRate, callback) {
        this.triggerCallback(); // previous callback if any

        this.currentCallback = callback;

        this.audio.volume = volume;
        this.audio.playbackRate = playbackRate;
        this.audio.src = url;
        this.audio.play().catch((error) => {
            console.error("Playback failed:", error);
            this.handleStop('exception');
        });
    }
  
    handleStop(cause) {
        // console.log("Audio stopped due to:", cause);
        this.triggerCallback();
    }
  
    triggerCallback() {
      if (this.currentCallback) {
        this.currentCallback();
        this.currentCallback = null;
      }
    }
}

const player = new AudioPlayer();

export function listenMP3(state, line, settings, callback) {
    const file = `/audio/${state.storyName}/${state.storyName}-${state.lang}-${line.key}.mp3`;
    player.play(file, settings.volume(), settings.voiceSpeed(), callback);
}

export function soundEffect(settings, name, callback = null) {
    const file = `/audio/${name}.mp3`;
    player.play(file, settings.volume(), 1, callback);
}

export function updateVoices(lang) {
  synth = window.speechSynthesis;
  voices = synth.getVoices();
  console.log("Available voices", voices);

  if (lang == null) {
    return;
  }

  const voiceSelect = document.querySelector("#voice");
  voiceSelect.innerHTML = "";
  let voicesAvailable = false;
  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement("option");
    if (!voices[i].lang.startsWith(lang)) {
        continue;
    }
    option.textContent = voices[i].name;
    option.value = i;

    option.setAttribute("data-lang", voices[i].lang);
    option.setAttribute("data-name", voices[i].name);
    voiceSelect.appendChild(option);
    voicesAvailable = true;
  }
}

function listen(text, lang) {
    const voice = voices[document.querySelector("#voice").value];
    if (voice == null) {
        return;
    }
    var msg = new SpeechSynthesisUtterance(text);
    msg.voice = voice;
    msg.lang = lang;
    msg.rate = document.querySelector("#rate").value;
    msg.volume = document.querySelector("#volume").value;
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
}

export function initTTS(state) {
    synth.getVoices();
    synth.onvoiceschanged = function() {
        updateVoices(state.lang);
    };
}

const audio = new Audio();
let synth = window.speechSynthesis;
let voices = [];

export function listenMP3(state, page, sentenceIndex, autoPlayCallback) {
    const file = `audio/${state.storyName}/${state.storyName}-${state.lang}-${page.pageIndex}-${sentenceIndex}.mp3`;
    audio.src = file;
    audio.playbackRate = document.querySelector("#rate").value;
    audio.volume = document.querySelector("#volume").value;
    
    audio.onended = (event) => {
        if (autoPlayCallback && document.querySelector("#mode").value === "autoAdvance") {
            autoPlayCallback();
        }
    }

    audio.play().catch((e) => {
        console.log("Failed to play audio", e);
        // listen(state.sentence(pageIndex, sentenceIndex, state.lang), state.lang);
    });
}

export function soundEffect(name, callback = null) {
    const file = `audio/${name}.mp3`;
    audio.src = file;
    audio.onended = callback;
    audio.playbackRate = 1;
    audio.volume = document.querySelector("#volume").value;
    audio.play();
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

import { State } from "./state.js";

let synth = window.speechSynthesis;
let voices = [];

const state = new State();
const audio = new Audio();

function listenMP3(pageIndex, sentenceIndex, mayAutoPlay) {
    const file = `audio/${state.storyName}/${state.storyName}-${state.lang}-${pageIndex}-${sentenceIndex}.mp3`;
    audio.src = file;
    audio.playbackRate = document.querySelector("#rate").value;
    audio.volume = document.querySelector("#volume").value;
    
    audio.onended = (event) => {
        if (mayAutoPlay && document.querySelector("#mode").value === "autoAdvance") {
            next();
        }
    }

    audio.play().catch((e) => {
        listen(state.sentence(pageIndex, sentenceIndex, state.lang));
    });
}

function soundEffect(name) {
    const file = `audio/${name}.mp3`;
    audio.src = file;
    audio.onended = null;
    audio.playbackRate = 1;
    audio.volume = document.querySelector("#volume").value;
    audio.play();
}

synth.getVoices();

synth.onvoiceschanged = function() {
    updateVoices(state.lang);
};

function updateVoices(lang) {
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

  document.querySelector("#no-voices").style.display = voicesAvailable ? "none" : "block";
  if (!voicesAvailable) {
    document.querySelector("#mode").value = "textOnly";
  } else {
    document.querySelector("#mode").value = "audioAndText";
  }
}

function resetStory() {
    state.resetStory();
    document.querySelector('.story').innerHTML = "";
    document.querySelector('.story-end').style.display = "none";
    document.querySelector('.footer').style.display = "flex";
}

function targetLang() {
    return document.querySelector("#targetLang").value;
}

export function setLanguage(l) {
    state.lang = l;
    document.querySelector('.top').style.display = "block";
    updateVoices(state.lang);
    document.querySelector("#storySelector").style.display = "block";
    document.querySelector("#languageSelector").style.display = "none";

    if (targetLang() === state.lang) {
        document.querySelector("#targetLang").value =
            state.lang === "en" ? "fr" : "en";
    }
}

async function chooseStory(name) {
    document.querySelector('#infoHeader').style.display = "none";
    document.querySelector("#storySelector").style.display = "none";

    await state.loadStory(name);
    resetStory();
    next();
}

function listen(text) {
    const voice = voices[document.querySelector("#voice").value];
    if (voice == null) {
        return;
    }
    var msg = new SpeechSynthesisUtterance(text);
    msg.voice = voice;
    msg.lang = state.lang;
    msg.rate = document.querySelector("#rate").value;
    msg.volume = document.querySelector("#volume").value;
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
}

function createTranslation(parent, pageIndex, sentenceIndex) {
    const transl = document.createElement("p");
    const transLang = targetLang();
    transl.textContent = state.sentence(pageIndex, sentenceIndex, transLang);
    transl.classList.add("translation");
    if (state.openTransl) {
        state.openTransl.remove();
        state.openTransl = null;
    }
    transl.style.display = showTranslations ? "block" : "none";
    state.openTransl = transl;

    parent.appendChild(transl);
}

function showText(pageIndex, sentenceIndex, useSpoiler) {

    const image = state.getImage();
    if (sentenceIndex == 0 && image) {
        const img = document.createElement("img");
        img.src = `img/stories/${image}`;
        img.classList.add("story-image");
        const main = document.querySelector('.story');
        main.appendChild(img);
    }

    const content = state.sentence(pageIndex, sentenceIndex, state.lang);
    const icon = document.createElement("img");
    icon.src = "img/volume-up.svg";
    icon.classList.add("icon", "audio-icon");
    icon.onclick = () => {
        listenMP3(pageIndex, sentenceIndex, false);
    };

    const container = document.createElement("span");
    container.classList.add("audio-icon-container");
    container.appendChild(icon);

    const elt = document.createElement("span");
    if (useSpoiler) {
        elt.classList.add("spoiler");
        state.spoiler = elt;
    }

    elt.classList.add("text");
    elt.textContent = content;

    const main = document.querySelector('.story');
    const showTranslation = document.querySelector("#showTranslations").checked || state.storyName === "intro";
    if (showTranslation) {
        createTranslation(elt, pageIndex, sentenceIndex);
    }

    elt.onclick = () => {
        if (elt.classList.contains("spoiler")) {
            next();
            return;
        }
        if (state.openTransl && state.openTransl.parentElement === elt) {
            state.openTransl.remove();
            state.openTransl = null;
            return;
        }
        else {
            createTranslation(elt, pageIndex, sentenceIndex);
        }
    }

    const title = pageIndex === 0 && sentenceIndex === 0;
    const div = document.createElement(title ? "h2" : "p");
    div.appendChild(container);
    div.appendChild(elt);
    main.appendChild(div);
}

function showChoices() {
    const choices = state.choices;
    const main = document.querySelector('.story');
    const container = document.createElement("div");
    container.classList.add("choices");

    const transLang = targetLang();
    for (let i = 0; i < choices.length; i++) {
        const text = choices[i][state.lang];
        const elt = document.createElement("div");
        elt.classList.add("choice");
        elt.textContent = text;
        elt.title = text;

        const transl = document.createElement("p");
        transl.textContent = choices[i][transLang];
        transl.classList.add("translation");
        transl.style.display = "none";
        elt.appendChild(transl);

        elt.onclick = () => {
            if (transl.style.display === "block") {
                transl.style.display = "none";
            }
            else {
                transl.style.display = "block";
            }
        }

        const icon = document.createElement("img");
        icon.src = "img/arrow-right-3-square.svg";
        icon.classList.add("icon", "choice-icon");
        icon.onclick = () => {
            container.innerHTML = "";
            container.appendChild(elt);

            state.openPage(state.choices[i]["goto"]);
            next();
        
        };

        container.appendChild(icon);
        container.appendChild(elt);
    }

    state.sentenceIndex++;
    if (choices.length === 0) {
        document.querySelector(".story-end").style.display = "block";
        document.querySelector('.footer').style.display = "none";
        soundEffect('level-end');
    } else {
        main.appendChild(container);
    }
}

function backToMenu() {
    resetStory();
    document.querySelector('#infoHeader').style.display = "block";
    document.querySelector('#storySelector').style.display = "block";
    document.querySelector('.footer').style.display = "none";
}

function revealSpoiler() {
    state.spoiler.classList.remove("spoiler");
    state.spoiler.classList.add("revealed");
    state.spoiler = null;
}

function updateButtons() {
    const hasNext = state.hasNext();
    const hasInlineNext = hasNext || state.spoiler;
    document.getElementById("inlineNext").style.display = hasInlineNext ? "block" : "none";
    document.getElementById("player-next").style.visibility = hasNext ? "visible" : "hidden";
    document.getElementById("player-all").style.visibility = hasNext ? "visible" : "hidden";

    setTimeout(function () {
        window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
    }, 10);
}

function showAll() {
    if (state.spoiler) {
        revealSpoiler();
    }
    while (!state.endOfPage()) {
        showText(state.pageIndex, state.sentenceIndex, false);
        state.nextLine();
    }
    showChoices();
    updateButtons();
}

function next() {
    if (state.spoiler) {
        revealSpoiler();
        return;
    }

    if (state.endOfPage()) {
        if (state.hasNext()) {
            showChoices();
        }
        updateButtons();
        return;
    }

    const useSpoiler = document.querySelector("#mode").value === "audioFirst";
    showText(state.pageIndex, state.sentenceIndex, useSpoiler);
    if (document.querySelector("#mode").value !== "audioFirst") {
        inlineNext.style.display = "block";
    }
    if (document.querySelector("#mode").value !== "textOnly") {
        listenMP3(state.pageIndex, state.sentenceIndex, true);
    }
    state.nextLine();
    updateButtons();
};


// Expose entry points to the browser
window.chooseStory = chooseStory;
window.setLanguage = setLanguage;
window.next = next;
window.showAll = showAll;
window.resetStory = resetStory;
window.backToMenu = backToMenu;
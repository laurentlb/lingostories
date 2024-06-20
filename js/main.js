"use strict";

let synth = window.speechSynthesis;
let voices = [];

class State {
    constructor() {
        this.spoiler = null;
        this.lang = null;
        this.sentenceIndex = 0;
        this.pageIndex = 0;
        this.openTransl = null;
        this.storyName = null;
    }

    resetStory() {
        this.sentenceIndex = 0;
        this.pageIndex = 0;
        this.spoiler = null;
    }

    openPage(index) {
        this.pageIndex = index;
        this.sentenceIndex = 0;
        this.spoiler = null;
    }

    endOfPage() {
        return this.sentenceIndex >= sentences[this.pageIndex].text[this.lang].length;
    }

    hasNext() {
        return this.sentenceIndex <= sentences[this.pageIndex].text[this.lang].length;
    }

    targetLang() {
        return document.querySelector("#targetLang").value;
    }

    get choices() {
        return sentences[this.pageIndex].choices;
    }

    nextLine() {
        this.sentenceIndex++;
        if (this.endOfPage()) {
            const choices = this.choices;
            if (choices.length === 1 && !choices[0]["en"]) {
                this.openPage(choices[0]["goto"]);
            }
            return;
        }
    }

    sentence(pageIndex, sentenceIndex, lang) {
        return sentences[pageIndex].text[lang][sentenceIndex];
    }
};

const state = new State();
let sentences = {};

class Page {
    constructor(text, choices, image) {
        this.text = text;
        this.choices = choices;
        this.image = image;
    }
}

synth.getVoices();

synth.onvoiceschanged = function() {
    updateVoices();
};

function updateVoices() {
  synth = window.speechSynthesis;
  voices = synth.getVoices();
  console.log("Available voices", voices);

  if (state.lang == null) {
    return;
  }

  const voiceSelect = document.querySelector("#voice");
  voiceSelect.innerHTML = "";
  let voicesAvailable = false;
  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement("option");
    if (!voices[i].lang.startsWith(state.lang)) {
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

function setLanguage(l) {
    state.lang = l;
    document.querySelector('.top').style.display = "block";
    updateVoices();
    document.querySelector("#storySelector").style.display = "block";
    document.querySelector("#languageSelector").style.display = "none";

    if (state.targetLang() === state.lang) {
        document.querySelector("#targetLang").value =
            state.lang === "en" ? "fr" : "en";
    }
}

async function chooseStory(name) {
    document.querySelector('#infoHeader').style.display = "none";
    document.querySelector("#storySelector").style.display = "none";

    state.storyName = name;
    const response = await fetch(`stories/${state.storyName}.json`);
    const story = await response.json();

    for (let page in story) {
        const text = story[page][0];
        for (let lang in text) {
            text[lang] = text[lang].split("|");
        }
        const choices = story[page].slice(1);
        const image = story[page][0]["img"];
        sentences[page] = new Page(text, choices, image);
    }

    console.log(sentences);
    resetStory();
    next();
}

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
    const transLang = state.targetLang();
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

    const image = sentences[pageIndex].image;
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

function openPage(index) {
    state.openPage(index);
    next();
}

function showChoices() {
    const choices = state.choices;
    const main = document.querySelector('.story');
    const container = document.createElement("div");
    container.classList.add("choices");

    const transLang = state.targetLang();
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

            openPage(state.choices[i]["goto"]);
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

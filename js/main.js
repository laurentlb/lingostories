import { State } from "./state.js";
import { initTTS, listenMP3, soundEffect, updateVoices } from "./audio.js";
import { WordShuffleGame } from "./wordShuffleGame.js";

const state = new State();

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
    showHome(false);

    await state.loadStory(name);
    resetStory();
    next();
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

function shouldShowMinigame(content, pageIndex, sentenceIndex) {
    const nbWords = content.split(" ").length;
    if (nbWords < 4 || nbWords > 10) {
        return false;
    }

    if (state.spoiler) {
        return false;
    }

    if (state.storyName === "intro") {
        return false;
    }

    if (pageIndex === 0 && sentenceIndex === 0) {
        return false;
    }

    return Math.random() < 0.2;
}

function showText(pageIndex, sentenceIndex, useSpoiler) {
    const main = document.querySelector('.story');
    const container = document.createElement("div");
    container.classList.add("sentence-container");
    main.appendChild(container);

    const image = state.getImage();
    if (sentenceIndex == 0 && image) {
        const img = document.createElement("img");
        img.src = `img/stories/${image}`;
        img.classList.add("story-image");
        main.appendChild(img);
    }

    const content = state.sentence(pageIndex, sentenceIndex, state.lang);
    const icon = document.createElement("img");
    icon.src = "img/volume-up.svg";
    icon.classList.add("icon", "audio-icon");
    icon.onclick = () => {
        listenMP3(state, pageIndex, sentenceIndex, false);
    };

    const audio = document.createElement("span");
    audio.classList.add("audio-icon-container");
    audio.appendChild(icon);
    container.appendChild(audio);

    const showMinigame = shouldShowMinigame(content, pageIndex, sentenceIndex);

    if (showMinigame) {
        const minigame = document.createElement("div");
        const game = new WordShuffleGame(content, minigame,
            () => {
                minigame.remove();
                actuallyShowText(container, pageIndex, sentenceIndex, useSpoiler);
                next();
            });
        container.appendChild(minigame);
    } else {
        actuallyShowText(container, pageIndex, sentenceIndex, useSpoiler);
    }
}

function actuallyShowText(container, pageIndex, sentenceIndex, useSpoiler) {
    const content = state.sentence(pageIndex, sentenceIndex, state.lang);
    const title = pageIndex === 0 && sentenceIndex === 0;
    const elt = document.createElement(title ? "h2" : "p");
    if (useSpoiler) {
        elt.classList.add("spoiler");
        state.spoiler = elt;
    }

    elt.classList.add("text");
    elt.textContent = content;

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

    container.appendChild(elt);
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

function showHome(show) {
    const display = show ? "block" : "none";
    console.log(document.querySelectorAll('.home'));
    document.querySelectorAll('.home').forEach(e => {
        e.style.display = display;
    });

    document.querySelector("#storySelector").style.display = display;
}

function backToMenu() {
    resetStory();
    showHome(true);
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
        listenMP3(state, state.pageIndex, state.sentenceIndex, true);
    }
    state.nextLine();
    updateButtons();
};

initTTS(state);

// Expose entry points to the browser
window.chooseStory = chooseStory;
window.setLanguage = setLanguage;
window.next = next;
window.showAll = showAll;
window.resetStory = resetStory;
window.backToMenu = backToMenu;
import { Story } from "./story.js";
import { initTTS, listenMP3, soundEffect, updateVoices } from "./audio.js";
import { WordShuffleGame } from "./wordShuffleGame.js";

const story = new Story();

const stories = [
    { id: "intro", title: "Introduction"},
    { id: "park", title: "At the Park" },
];

var nextAction = null;
var actionPending = false;

function resetStory() {
    story.resetStory();
    document.querySelector('.story').innerHTML = "";
    document.querySelector('.story-end').style.display = "none";
    document.querySelector('.footer').style.display = "flex";
    nextAction = null;
    actionPending = false;
}

function targetLang() {
    return document.querySelector("#targetLang").value;
}

function setLanguage(l) {
    story.lang = l;
    document.querySelector('.top').style.display = "block";
    updateVoices(story.lang);
    createStoryList();
    document.querySelector("#storySelector").style.display = "block";
    document.querySelector("#languageSelector").style.display = "none";

    if (targetLang() === story.lang) {
        document.querySelector("#targetLang").value =
            story.lang === "en" ? "fr" : "en";
    }
}

async function chooseStory(name) {
    showHome(false);

    await story.loadStory(name);
    resetStory();
    next();
}

function createTranslation(parent, pageIndex, sentenceIndex) {
    const transl = document.createElement("p");
    const transLang = targetLang();
    transl.textContent = story.sentence(pageIndex, sentenceIndex, transLang);
    transl.classList.add("translation");
    if (story.openTransl) {
        story.openTransl.remove();
        story.openTransl = null;
    }
    transl.style.display = showTranslations ? "block" : "none";
    story.openTransl = transl;

    parent.appendChild(transl);
}

function shouldShowMinigame(content, pageIndex, sentenceIndex) {
    const nbWords = content.split(" ").length;
    if (nbWords < 4 || nbWords > 10) {
        return false;
    }

    if (story.storyName === "intro") {
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

    const image = story.getImage();
    if (sentenceIndex == 0 && image) {
        const img = document.createElement("img");
        img.src = `img/stories/${image}`;
        img.classList.add("story-image");
        main.appendChild(img);
    }

    main.appendChild(container);

    const content = story.sentence(pageIndex, sentenceIndex, story.lang);
    const icon = document.createElement("img");
    icon.src = "img/volume-up.svg"; 
    icon.classList.add("icon", "audio-icon");
    icon.onclick = () => {
        listenMP3(story, pageIndex, sentenceIndex, null);
    };

    const audio = document.createElement("span");
    audio.classList.add("audio-icon-container");
    audio.appendChild(icon);
    container.appendChild(audio);

    const showMinigame = shouldShowMinigame(content, pageIndex, sentenceIndex);

    if (showMinigame) {
        const minigame = document.createElement("div");
        actionPending = true;
        const endGame = () => {
            actionPending = false;
            nextAction = null;
            minigame.remove();
            actuallyShowText(container, pageIndex, sentenceIndex, false);
            updateButtons();
        };

        nextAction = endGame;
        const game = new WordShuffleGame(content, minigame, endGame);
        container.appendChild(minigame);
    } else {
        actuallyShowText(container, pageIndex, sentenceIndex, useSpoiler);
    }
}

function actuallyShowText(container, pageIndex, sentenceIndex, useSpoiler) {
    const content = story.sentence(pageIndex, sentenceIndex, story.lang);
    const title = pageIndex === 0 && sentenceIndex === 0;
    const elt = document.createElement(title ? "h2" : "p");
    if (useSpoiler) {
        elt.classList.add("spoiler");
        nextAction = () => {
            revealSpoiler(elt);
        };
    }

    elt.classList.add("text");
    elt.textContent = content;

    const showTranslation = document.querySelector("#showTranslations").checked || story.storyName === "intro";
    if (showTranslation) {
        createTranslation(elt, pageIndex, sentenceIndex);
    }

    elt.onclick = () => {
        if (elt.classList.contains("spoiler")) {
            next();
            return;
        }
        if (story.openTransl && story.openTransl.parentElement === elt) {
            story.openTransl.remove();
            story.openTransl = null;
            return;
        }
        else {
            createTranslation(elt, pageIndex, sentenceIndex);
        }
    }

    container.appendChild(elt);
}

function showChoices() {
    const choices = story.choices;
    const main = document.querySelector('.story');
    const container = document.createElement("div");
    container.classList.add("choices");

    const transLang = targetLang();
    for (let i = 0; i < choices.length; i++) {
        const text = choices[i][story.lang];
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

            story.openPage(story.choices[i]["goto"]);
            next();
        
        };

        container.appendChild(icon);
        container.appendChild(elt);
    }

    story.sentenceIndex++;
    if (choices.length === 0) {
        document.querySelector(".story-end").style.display = "block";
        document.querySelector('.footer').style.display = "none";
        soundEffect('level-end');
    } else {
        main.appendChild(container);
    }
}

function createStoryList() {
    const container = document.querySelector(".story-list");
    container.innerHTML = "";

    for (const sto of stories) {
        const elt = document.createElement("div");
        elt.onclick = () => { chooseStory(sto.id); };
        elt.classList.add("story-info");

        const img = document.createElement("img");
        img.src = `img/arrow-right-3-square.svg`;
        img.classList.add("icon", "choice-icon");
        elt.appendChild(img);

        const link = document.createElement("span");
        link.classList.add("story-choice");
        link.textContent = sto.title;
        elt.appendChild(link);

        container.appendChild(elt);
    }
}

function showHome(show) {
    const display = show ? "block" : "none";
    console.log(document.querySelectorAll('.home'));
    document.querySelectorAll('.home').forEach(e => {
        e.style.display = display;
    });

    createStoryList();
    document.querySelector("#storySelector").style.display = display;
}

function backToMenu() {
    resetStory();
    showHome(true);
    document.querySelector('.footer').style.display = "none";
}

function revealSpoiler(spoiler) {
    spoiler.classList.remove("spoiler");
    spoiler.classList.add("revealed");
}

function updateButtons() {
    const storyContinues = story.hasNext();
    const hasNext = storyContinues;
    const hasInlineNext = (hasNext || nextAction) && !actionPending;
    document.getElementById("inlineNext").style.display = hasInlineNext ? "block" : "none";
    document.getElementById("player-next").style.visibility = hasNext ? "visible" : "hidden";
    document.getElementById("player-all").style.visibility = hasNext ? "visible" : "hidden";

    setTimeout(function () {
        window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
    }, 10);
}

function showAll() {
    if (nextAction) {
        nextAction();
        nextAction = null;
    }
    while (!story.endOfPage()) {
        showText(story.pageIndex, story.sentenceIndex, false);
        story.nextLine();
    }
    showChoices();
    updateButtons();
}

function next() {
    if (nextAction) {
        const action = nextAction;
        nextAction = null;
        action();
        updateButtons();
        return;
    }

    if (story.endOfPage()) {
        if (story.hasNext()) {
            showChoices();
        }
        updateButtons();
        return;
    }

    const useSpoiler = document.querySelector("#mode").value === "audioFirst";
    showText(story.pageIndex, story.sentenceIndex, useSpoiler);
    if (document.querySelector("#mode").value !== "audioFirst") {
        inlineNext.style.display = "block";
    }
    if (document.querySelector("#mode").value !== "textOnly") {
        listenMP3(story, story.pageIndex, story.sentenceIndex, () => {
            if (!actionPending) {
                next();
            }
        });
    }
    story.nextLine();
    updateButtons();
};

initTTS(story);

document.addEventListener("keydown", (event) => {
    if (event.key === " ") {
        next();
    }
});

window.onload = function(){
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("lang")) {
        setLanguage(urlParams.get("lang"));
    }

    if (urlParams.has("story")) {
        chooseStory(urlParams.get("story"));
    }
};

// Expose entry points to the browser
window.chooseStory = chooseStory;
window.setLanguage = setLanguage;
window.next = next;
window.showAll = showAll;
window.resetStory = resetStory;
window.backToMenu = backToMenu;
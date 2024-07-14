import { stories } from "./stories.js";
import { Story } from "./story.js";
import { listenMP3, soundEffect } from "./audio.js";
import { WordShuffleGame } from "./wordShuffleGame.js";
import { UserData } from "./userdata.js";
import { Settings, initSettings } from "./settings.js";

const story = new Story();
const userData = new UserData();
const settings = new Settings();

var nextAction = null;
var actionPending = false;
var openTransl = null;
var lastSentence = null;
var lastAudioIcon = null;
var lastChoices = [];

function resetStory() {
    story.resetStory();
    document.querySelector('.story').innerHTML = "";
    document.querySelector('.story').style.display = "block";
    document.querySelector('.story-end').style.display = "none";
    document.querySelector('.footer').style.display = "flex";
    nextAction = null;
    actionPending = false;
}

function setLanguage(l) {
    story.lang = l;
    document.querySelector('.top').style.display = "block";
    createStoryList();

    if (settings.translationLang() === story.lang) {
        document.querySelector("#translation-lang").value =
            story.lang === "en" ? "fr" : "en";
    }
}

function updateCollectionCountLabel(label, lang, storyName) {
    const collected = userData.nbCollectedImages(lang, storyName);
    const storyData = stories.find(s => s.id == storyName);
    label.textContent = `${collected}/${storyData.imageCount}`;
    if (collected === storyData.imageCount) {
        label.classList.add("story-complete");
        label.title = `You have collected all images in this story!`;
    } else {
        label.title = `You have collected ${collected} out of ${storyData.imageCount} images in this story.`
    }
}

function updateCollectionTopStatus() {
    const label = document.querySelector("#collection-count");
    label.style.visibility = "visible";
    updateCollectionCountLabel(label, story.lang, story.storyName);
    createImageCollection(".top-image-collection", story.lang, story.storyName);
}

async function chooseStory(name) {
    showStory();
    const backUrl = "/?lang=" + story.lang;
    document.querySelector("#back-icon").setAttribute("href", backUrl);
    document.querySelector("#back-to-menu").setAttribute("href", backUrl);
    document.querySelector("#restart-icon").style.visibility = "visible";

    await story.loadStory(name);
    updateCollectionTopStatus();
    resetStory();
    gtag('event', 'load-story', { 'story': name, 'lang': story.lang });
    next();
}

function createTranslation(parent, page, sentenceIndex) {
    const transl = document.createElement("p");
    const transLang = settings.translationLang();
    transl.textContent = page.sentence(sentenceIndex, transLang);
    transl.classList.add("translation");
    if (openTransl) {
        openTransl.remove();
        openTransl = null;
    }
    openTransl = transl;

    parent.appendChild(transl);
}

function shouldShowMinigame(content, page, sentenceIndex) {
    const nbWords = content.split(" ").length;
    if (nbWords < 4 || nbWords > 10) {
        return false;
    }

    if (story.storyName === "intro") {
        return false;
    }

    if (page.pageIndex === "0" && sentenceIndex === 0) {
        return false;
    }

    return Math.random() < 0.2;
}

function showTextOrImage(page, sentenceIndex, useSpoiler) {
    const image = story.getImage();
    if (!image) {
        showText(page, sentenceIndex, useSpoiler);
        return;
    }

    const main = document.querySelector('.story');
    const img = document.createElement("img");
    img.onload = () => {
        window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
    };
    img.src = `img/stories/${image}`;
    img.classList.add("story-image");
    main.appendChild(img);
    userData.collectImage(story.lang, story.storyName, image);
    soundEffect(settings, 'image-collected');
    updateCollectionTopStatus();

    // Show explanation for the first image
    if (story.storyName === "intro") {
        const info = document.createElement("div");
        info.classList.add("info-box");
        info.textContent =
                `You have collected an image! Each story has a set of images to
                collect (see the number at the top). This encourages you to read
                the stories multiple times and make different choices.`;
        main.appendChild(info);
    }

    nextAction = () => {
        showText(page, sentenceIndex, useSpoiler);
    };
}

function showText(page, sentenceIndex, useSpoiler) {
    const main = document.querySelector('.story');
    const container = document.createElement("div");
    container.classList.add("sentence-container");
    main.appendChild(container);

    const content = page.sentence(sentenceIndex, story.lang);
    const icon = document.createElement("img");
    icon.src = "img/volume-up.svg"; 
    icon.classList.add("icon", "audio-icon");
    icon.onclick = () => {
        listenMP3(story, page, sentenceIndex, settings, null);
    };
    lastAudioIcon = icon;

    const audio = document.createElement("span");
    audio.classList.add("audio-icon-container");
    audio.appendChild(icon);
    container.appendChild(audio);

    const showMinigame = shouldShowMinigame(content, page, sentenceIndex);

    if (showMinigame) {
        const minigame = document.createElement("div");
        actionPending = true;
        const endGame = () => {
            actionPending = false;
            nextAction = null;
            minigame.remove();
            actuallyShowText(container, page, sentenceIndex, false);
            updateButtons();
        };

        nextAction = endGame;
        const game = new WordShuffleGame(settings, content, minigame, endGame);
        container.appendChild(minigame);
    } else {
        actuallyShowText(container, page, sentenceIndex, useSpoiler);
    }

    if (settings.readingMode() !== "textOnly") {
        listenMP3(story, page, sentenceIndex, settings, () => {
            if (!actionPending) {
                next();
            }
        });
    }
}

function actuallyShowText(container, page, sentenceIndex, useSpoiler) {
    const content = page.sentence(sentenceIndex, story.lang);
    const title = page.pageIndex === "0" && sentenceIndex === 0;
    const elt = document.createElement(title ? "h2" : "p");
    if (useSpoiler) {
        elt.classList.add("spoiler");
        nextAction = () => {
            revealSpoiler(elt);
        };
    }

    elt.classList.add("text");
    elt.textContent = content;

    const showTranslation = settings.showTranslations() || story.storyName === "intro";
    if (showTranslation) {
        createTranslation(elt, page, sentenceIndex);
    }

    elt.onclick = () => {
        if (elt.classList.contains("spoiler")) {
            next();
            return;
        }
        if (openTransl && openTransl.parentElement === elt) {
            openTransl.remove();
            openTransl = null;
            return;
        }
        else {
            createTranslation(elt, page, sentenceIndex);
        }
    }

    lastSentence = elt;
    container.appendChild(elt);
}

function showChoices() {
    const choices = story.choices;
    const main = document.querySelector('.story');
    const container = document.createElement("div");
    container.classList.add("choices");

    const transLang = settings.translationLang();
    lastChoices.length = 0;
    for (let i = 0; i < choices.length; i++) {
        const text = choices[i][story.lang];
        const elt = document.createElement("div");
        elt.classList.add("choice");
        elt.textContent = text;
        elt.title = choices[i][transLang];

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

        const textIcon = document.createElement("div");
        textIcon.classList.add("text-icon");
        textIcon.textContent = i + 1;
        textIcon.onclick = () => {
            lastChoices.length = 0;
            container.innerHTML = "";
            textIcon.onclick = null;
            container.appendChild(textIcon);
            container.appendChild(elt);

            story.openPage(story.choices[i]["goto"]);
            next();
        };
        lastChoices.push(textIcon);

        container.appendChild(textIcon);
        container.appendChild(elt);
    }

    story.nextLine();
    if (choices.length === 0) {
        soundEffect(settings, 'level-end');
        document.querySelector(".story-end").style.display = "block";
        const storyData = stories.find(s => s.id === story.storyName);
        const collectedImages = userData.nbCollectedImages(story.lang, story.storyName);
        let text = "You have completed this story. "
        if (collectedImages === storyData.imageCount) {
            text += `You have collected all images in this story!`;
        } else {
            text += `You have collected ${collectedImages} out of ${storyData.imageCount} images in this story.`;
        }
        document.querySelector('.story-end-text').textContent = text;
        document.querySelector('.footer').style.display = "none";

        gtag('event', 'end-story', { 'story': story.storyName, 'lang': story.lang });
    } else {
        main.appendChild(container);
    }
}

function createImageCollection(classname, lang, storyName) {
    const container = document.querySelector(classname);
    container.innerHTML = "";

    if (!userData.collectedImages[lang]) {
        return;
    }

    for (const sto of stories) {
        if (storyName && storyName !== sto.id) {
            continue;
        }
        const images = userData.collectedImages[lang][sto.id] || [];
        for (const img of images) {
            const elt = document.createElement("img");
            elt.src = `img/stories/${img}`;
            elt.classList.add("small-story-image");
            container.appendChild(elt);
        }
    }
}

function createStoryList() {
    const container = document.querySelector(".story-list");
    container.innerHTML = "";

    for (const sto of stories) {
        const elt = document.createElement("div");
        elt.classList.add("story-info");

        const imgLink = document.createElement("a");
        imgLink.href = `/?lang=${story.lang}&story=${sto.id}`;
        const img = document.createElement("img");
        img.src = `img/arrow-right-3-square.svg`;
        img.classList.add("icon", "choice-icon");
        imgLink.appendChild(img);
        elt.appendChild(imgLink);

        const link = document.createElement("a");
        link.href = `/?lang=${story.lang}&story=${sto.id}`;
        link.textContent = sto.title;
        elt.appendChild(link);

        const countLabel = document.createElement("span");
        countLabel.classList.add("story-count");
        updateCollectionCountLabel(countLabel, story.lang, sto.id);
        elt.appendChild(countLabel);

        container.appendChild(elt);
    }
}

function showHome() {
    document.querySelectorAll('.home').forEach(e => {
        e.style.display = "block";
    });

    if (story.lang) {
        createImageCollection(".image-collection", story.lang, null);
        document.querySelector("#language-selector").style.display = "none";
    } else {
        document.querySelector("#story-selector").style.display = "none";
    }
}

function showStory() {
    document.querySelectorAll('.in-story').forEach(e => {
        e.style.display = "block";
    });

    document.querySelector("#back-icon").style.display = "block";;
    document.querySelector("#home-icon").style.display = "none";

    document.querySelector(".story-end").style.display = "none";
}

function revealSpoiler(spoiler) {
    spoiler.classList.remove("spoiler");
    spoiler.classList.add("revealed");
}

function updateButtons() {
    const storyContinues = story.hasNext();
    const hasNext = storyContinues;
    document.getElementById("player-next").style.visibility = hasNext ? "visible" : "hidden";

    setTimeout(function () {
        window.scrollTo({top: document.body.scrollHeight, behavior: "smooth"});
    }, 10);
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

    const useSpoiler = settings.readingMode() === "audioFirst";
    showTextOrImage(story.currentPage(), story.currentPage().paragraphIndex, useSpoiler);
    story.nextLine();
    updateButtons();
};

document.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
    }

    if (event.key === " ") {
        next();
    }

    if (event.key === "t") {
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        lastSentence.click();
    }

    if (event.key === "r") {
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        lastAudioIcon.click();
    }

    if (event.key.match(/[0-9]/)) {
        const index = parseInt(event.key) - 1;
        if (lastChoices[index]) {
            lastChoices[index].click();
        }
    }
});

window.onload = function(){
    initSettings();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("lang")) {
        setLanguage(urlParams.get("lang"));
        if (urlParams.has("story")) {
            chooseStory(urlParams.get("story"));
            return;
        }
    }
    showHome();
};

// Expose entry points to the browser
window.next = next;
window.resetStory = resetStory;

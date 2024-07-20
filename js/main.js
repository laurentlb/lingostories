import { stories } from "./stories.js";
import { listenMP3, soundEffect } from "./audio.js";
import { WordShuffleGame } from "./wordShuffleGame.js";
import { UserData } from "./userdata.js";
import { Settings } from "./settings.js";

let story = {};
const userData = new UserData();
const settings = new Settings(userData);

let nextAction = null;
let actionPending = false;
let openTransl = null;
let lastSentence = null;
let lastAudioIcon = null;
let lastChoices = [];
let didShowChoices = false;
let storyMetadata = null;

function resetStory() {
    story.ResetState();
    document.querySelector('.story').innerHTML = "";
    document.querySelector('.story').style.display = "block";
    document.querySelector('.story-end').style.display = "none";
    document.querySelector('.footer').style.display = "flex";
    nextAction = null;
    actionPending = false;
    didShowChoices = false;
    updateButtons();
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

    const lang = story.lang;
    const storyData = await fetch(`stories/${name}.ink.json`, {cache: "no-cache"}).then(response => response.json());
    story = new inkjs.Story(storyData);
    story.storyName = name;
    story.lang = lang;

    storyMetadata = await fetch(`stories/${name}.tl.json`, {cache: "no-cache"}).then(response => response.json());

    updateCollectionTopStatus();
    resetStory();
    gtag('event', 'load-story', { 'story': name, 'lang': story.lang });
    next();
}

function createTranslation(parent, line) {
    const transl = document.createElement("p");
    const transLang = settings.translationLang();
    transl.textContent = line[transLang];
    transl.classList.add("translation");
    if (openTransl) {
        openTransl.remove();
        openTransl = null;
    }
    openTransl = transl;

    parent.appendChild(transl);
}

function shouldShowMinigame(content, line) {
    if (!settings.enableMinigames()) {
        return false;
    }

    const nbWords = content.split(" ").length;
    if (nbWords < 4 || nbWords > 10) {
        return false;
    }

    if (story.storyName === "intro") {
        return false;
    }

    if (line.isTitle) {
        return false;
    }

    return Math.random() < 0.2;
}

function showTextOrImage(line, useSpoiler) {
    const image = line["img"];
    if (!image) {
        showText(line, useSpoiler);
        return;
    }

    const main = document.querySelector('.story');
    const img = document.createElement("img");
    img.onload = () => {
        scrollDown();
    };
    img.src = `img/stories/${image}`;
    img.classList.add("story-image");
    main.appendChild(img);
    userData.collectImage(story.lang, story.storyName, image);
    const textOnly = settings.readingMode() === "textOnly";
    if (!textOnly) {
        soundEffect(settings, 'image-collected');
    }
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
}

function showText(line, useSpoiler) {
    const textOnly = settings.readingMode() === "textOnly";

    const main = document.querySelector('.story');
    const container = document.createElement("div");
    container.classList.add("sentence-container");
    main.appendChild(container);

    const audioElt = document.createElement("img");
    const speakerId = line["speaker"];
    if (speakerId) {
        // TODO: put speaker information in the metadata file
        const file = speakerId === "tom" ? "man.svg" : "woman.svg";
        audioElt.classList.add("speaker");
        audioElt.src = `img/avatars/${file}`;
    } else {
        audioElt.src = "img/volume-up.svg"; 
        audioElt.classList.add("icon", "audio-icon");
    }

    audioElt.onclick = () => {
        listenMP3(story, line, settings, null);
    };
    lastAudioIcon = audioElt;
    container.appendChild(audioElt);

    const content = line[story.lang];
    const showMinigame = !textOnly && shouldShowMinigame(content, line);

    if (showMinigame) {
        const minigame = document.createElement("div");
        actionPending = true;
        const endGame = () => {
            actionPending = false;
            nextAction = null;
            minigame.remove();
            actuallyShowText(container, line, false);
            updateButtons();
        };

        nextAction = endGame;
        const game = new WordShuffleGame(settings, content, minigame, endGame);
        container.appendChild(minigame);
    } else {
        actuallyShowText(container, line, useSpoiler);
    }

    if (!textOnly) {
        listenMP3(story, line, settings, () => {
            if (!actionPending) {
                next();
            }
        });
    }
}

function actuallyShowText(container, line, useSpoiler) {
    const content = line[story.lang];
    const title = line.isTitle;
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
        createTranslation(elt, line);
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
            createTranslation(elt, line);
        }
    }

    lastSentence = elt;
    container.appendChild(elt);
}

function translateChoice(choice, lang) {
    return storyMetadata["sentences"][choice][lang];
}

function showChoices(choices) {
    const main = document.querySelector('.story');
    const container = document.createElement("div");
    container.classList.add("choices");

    const transLang = settings.translationLang();
    lastChoices.length = 0;
    for (let i = 0; i < choices.length; i++) {
        const text = translateChoice(choices[i].text, story.lang);
        const elt = document.createElement("div");
        elt.classList.add("choice");
        elt.textContent = text;
        elt.title = translateChoice(choices[i].text, transLang);

        const transl = document.createElement("p");
        transl.textContent = translateChoice(choices[i].text, transLang);
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

            story.ChooseChoiceIndex(choices[i].index);
            didShowChoices = false;
            next();
        };
        lastChoices.push(textIcon);

        container.appendChild(textIcon);
        container.appendChild(elt);
    }

    didShowChoices = true;
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
    const storyContinues = !didShowChoices;
    document.getElementById("player-next").style.visibility = storyContinues ? "visible" : "hidden";
    scrollDown();
}

let lastBottom = 0;
function scrollDown() {
    window.scrollTo({top: lastBottom - 150, behavior: "smooth"});
}

// Process a line generated by Ink; parse the line, add metadata and translations.
function processLine(line) {
    line = line.trim();

    if (line.startsWith("$image")) {
        const img = line.split(" ")[1];
        return {
            "img": img,
        };
    }

    if (line.startsWith("`")) {
        let text = line.substring(1, line.length - 1);
        let speaker = text.match(/^(\w*?):/);
        if (speaker) {
            speaker = speaker[1];
            text = text.substring(speaker.length + 1).trim();
        } else {
            speaker = null;
        }
        const result = {
            "speaker": speaker,
            "isTitle": false,
        };
        for (const [key, value] of Object.entries(storyMetadata["sentences"][text])) {
            result[key] = value;
        }
        return result;
    }
    return line;
}

function contentBottomEdgeY() {
    const main = document.querySelector('.story');
    const bottomElement = main.lastElementChild;
    return bottomElement ? bottomElement.offsetTop + bottomElement.offsetHeight : 0;
}

function next() {
    lastBottom = contentBottomEdgeY();
    if (nextAction) {
        const action = nextAction;
        nextAction = null;
        action();
        updateButtons();
        return;
    }

    if (!story.canContinue) {
        if (!didShowChoices) {
            showChoices(story.currentChoices);
        }
        updateButtons();
        return;
    }

    const useSpoiler = settings.readingMode() === "audioFirst";
    const textOnly = settings.readingMode() === "textOnly";
    if (textOnly) {
        const y = contentBottomEdgeY();
        while (story.canContinue) {
            const line = story.Continue();
            showTextOrImage(processLine(line), useSpoiler);
        }
        showChoices(story.currentChoices);
    } else {
        const line = story.Continue();
        showTextOrImage(processLine(line), useSpoiler);
    }
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
    settings.init();

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

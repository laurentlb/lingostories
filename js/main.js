import { allStories } from "./stories.js";
import { listenMP3, soundEffect } from "./audio.js";
import { WordShuffleGame } from "./wordShuffleGame.js";
import { UserData } from "./userdata.js";
import { Settings } from "./settings.js";
import { Story } from "./story-engine.js";
import { SpeechRecognitionBox } from "./speech-recognition.js";

let story = new Story(updateInventory);
const userData = new UserData();
const settings = new Settings(userData);

let nextAction = null;
let actionPending = false;
let openTransl = null;
let lastSentence = null;
let lastAudioIcon = null;
let lastChoices = [];
let didShowChoices = false;
let speechRecognition = new SpeechRecognitionBox(settings, document.querySelector(".speech-recognition .output"));

function resetStory() {
    story.ResetState();
    document.querySelector('.story').innerHTML = "";
    document.querySelector('.story').style.display = "block";
    document.querySelector('.story-end').style.display = "none";
    document.querySelector('.inventory').style.display = "none";
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
    const storyData = allStories.find(s => s.id == storyName);
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

    story.storyName = name;
    await story.loadStory(name);

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
    if (nbWords < 4 || nbWords > 8) {
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

function handleLine(line, useSpoiler) {
    const audio = line["audio"];
    if (!audio) {
        showTextOrImage(line, useSpoiler);
        return;
    }

    const textOnly = settings.readingMode() === "textOnly";
    if (!textOnly) {
        soundEffect(settings, audio, () => {
            next();
        });
    }
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
        soundEffect(settings, 'image-collected', () => {
            if (settings.readingMode() === "autoAdvance") {
                next();
            }
        });
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
    if (line[story.lang] === "") {
        next();
        return;
    }

    const speechRecognitionBox = document.querySelector(".speech-recognition");    
    if (settings.useMicrophone()) {
        speechRecognitionBox.style.display = "flex";
        speechRecognition.init(story.lang, line[story.lang], () => {
            speechRecognitionBox.style.display = "none";
            speechRecognitionBox.querySelector(".output").innerHTML = "";
            next(true);
        });
    } else {
        speechRecognitionBox.style.display = "none";
    }

    const textOnly = settings.readingMode() === "textOnly";

    const main = document.querySelector('.story');
    const container = document.createElement("div");
    container.classList.add("sentence-container");
    main.appendChild(container);

    const audioElt = document.createElement("img");
    const speaker = line["speaker"];
    if (speaker) {
        audioElt.classList.add("speaker");
        audioElt.src = `img/avatars/${speaker.avatar}`;
        if (speaker.color) {
            container.style.setProperty('--character-color', speaker.color);
        }
        if (speaker.side === "right") {
            container.style.flexDirection = "row-reverse";
        }
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
            if (settings.readingMode() === "autoAdvance") {
                next();
            }
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
    const speaker = line["speaker"];
    if (speaker) {
        const side = speaker.side === "right" ? "right" : "left";
        elt.classList.add("bubble", `bubble-${side}`);
        elt.style.setProperty('--bubble-color', '#444');
    }

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

function showChoices(choices) {
    const main = document.querySelector('.story');
    const container = document.createElement("div");
    container.classList.add("choices");

    const transLang = settings.translationLang();
    lastChoices.length = 0;
    for (let i = 0; i < choices.length; i++) {
        const choice = choices[i];
        const text = story.translateChoice(choice, story.lang);
        const elt = document.createElement("div");
        elt.classList.add("choice");
        elt.textContent = text;
        elt.title = story.translateChoice(choice, transLang);

        const transl = document.createElement("p");
        transl.textContent = story.translateChoice(choice, transLang);
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
            container.remove();

            story.ChooseChoiceIndex(choice.index);
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
        const storyData = allStories.find(s => s.id === story.storyName);
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

    for (const sto of allStories) {
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

    for (const sto of allStories) {
        if (sto.released === false) {
            continue;
        }
        const unreleased = Array.isArray(sto.released) && !sto.released.includes(story.lang);

        const elt = document.createElement("div");
        elt.classList.add("story-info");

        const link = document.createElement("a");
        if (!unreleased) {
            link.href = `/?lang=${story.lang}&story=${sto.id}`;
        } else {
            elt.classList.add("unreleased");
        }

        const img = document.createElement("img");
        img.src = `img/stories/${sto.id}.jpg`;
        link.appendChild(img);

        const title = document.createElement("p");
        title.textContent = sto.title;
        link.appendChild(title);
        elt.appendChild(link);

        const countLabel = document.createElement("span");
        countLabel.classList.add("story-count");
        if (unreleased) {
            countLabel.textContent = "not yet available";
            countLabel.title = "This story has not been translated yet.";
        } else {
            updateCollectionCountLabel(countLabel, story.lang, sto.id);
        }
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

function itemImage(item) {
    let name = item;
    switch (item) {
        case "money": name = "coin"; break;
        case "apples": name = "apple"; break;
        case "pears": name = "pear"; break;
        case "tomatoes": name = "tomato"; break;
        case "pastry": name = "croissant"; break;
        case "bread": name = "bread"; break;
        case "chocolate": name = "chocolate-bar"; break;
        case "eggs": name = "egg"; break;
        case "carrots": name = "carrot"; break;
    }
    return `img/items/${name}.svg`;
}

function updateItem(item, value) {
    const inventory = document.querySelector(".inventory");
    let element = inventory.querySelector(`#${item}`);
    if (!element) {
        element = document.createElement("div");
        element.style.backgroundImage = `url(${itemImage(item)})`;
        element.id = item;
        element.classList.add("item", "money");
        inventory.appendChild(element);
        if (typeof value === "boolean") {
            element.classList.add("boolean");
        }
    }
    if (typeof value === "number") {
        element.textContent = value;
        element.classList.remove("updated");
        setTimeout(() => {
            element.classList.add("updated");
        }, 10);    
    }

    if (value) {
        inventory.style.display = "flex";
    } else {
        element.display = "none";
    }
}

function updateInventory(name, value) {
    if (value.entries) {
        // remove all boolean items
        const inventory = document.querySelector(".inventory");
        for (const item of inventory.querySelectorAll(".item.boolean")) {
            item.remove();
        }
        for (const it of value.entries()) {
            const name = JSON.parse(it[0]).itemName; // the API looks weird??
            updateItem(name, true);
        }
    } else if (typeof value === "number") {
        updateItem(name, value);
    }
}

let lastBottom = 0;
function scrollDown() {
    window.scrollTo({top: lastBottom - 150, behavior: "smooth"});
}

function contentBottomEdgeY() {
    const main = document.querySelector('.story');
    const bottomElement = main.lastElementChild;
    return bottomElement ? bottomElement.offsetTop + bottomElement.offsetHeight : 0;
}

function next(nextSentence = false) {
    lastBottom = contentBottomEdgeY();
    if (nextAction) {
        const action = nextAction;
        nextAction = null;
        action();
        updateButtons();
        if (!nextSentence) {
            return;
        }
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
        while (story.canContinue) {
            const line = story.Continue();
            handleLine(line, useSpoiler);
        }
        if (!didShowChoices) {
            showChoices(story.currentChoices);
        }
    } else {
        const line = story.Continue();
        handleLine(line, useSpoiler);
    }
    updateButtons();
};

function toggleListening() {
    speechRecognition.toggle();
}

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

    if (event.key === "l") {
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        toggleListening();
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
window.story = story; // for debug & js console
window.toggleListening = toggleListening;

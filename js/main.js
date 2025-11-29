import { allStories } from "./stories.js";
import { UserData } from "./userdata.js";
import { Settings } from "./settings.js";
import { Story } from "./story-engine.js";
import { SpeechRecognitionBox } from "./speech-recognition.js";
import { StoryUI } from "./story-ui.js";

const story = new Story(updateInventory);
const userData = new UserData();
const settings = new Settings(userData);
const storyUI = new StoryUI(userData, settings, story, next, updateCollectionTopStatus, updateButtons);
const speechRecognition = new SpeechRecognitionBox(settings, document.querySelector(".speech-recognition .output"), listeningCallback);

function listeningCallback(isListening) {
    const icon = document.querySelector("#listening-icon");
    if (!icon) return;

    if (isListening) {
        icon.classList.add("listening");
        icon.classList.remove("disabled");
    } else {
        icon.classList.remove("listening");
        icon.classList.add("disabled");
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

async function chooseStory(name, language) {
    const backUrl = "./";
    document.querySelector("#back-icon").setAttribute("href", backUrl);
    document.querySelector("#back-to-menu").setAttribute("href", backUrl);
    document.querySelector("#restart-icon").style.visibility = "visible";
    document.querySelector("#settings-icon").style.visibility = "visible";
    
    if (settings.translationLang() === story.lang) {
        document.querySelector("#translation-lang").value =
            story.lang === "en" ? "fr" : "en";
    }

    story.storyName = name;
    story.lang = language;
    await story.loadStory(name);
    await storyUI.init(name, language);

    updateCollectionTopStatus();
    resetStory();
    
    if (window.goatcounter) {
        window.goatcounter.count({
            path:  `start/${story.lang}/${story.storyName}`,
            title: 'Load Story',
            event: true,
        });
    }
}

function resetStory() {
    storyUI.resetStory();
    next();
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
            elt.src = `/img/stories/${img}`;
            elt.classList.add("small-story-image");
            container.appendChild(elt);
        }
    }
}

function createStoryList(language) {
    const container = document.querySelector(".story-list");
    container.innerHTML = "";

    for (const sto of allStories) {
        if (!sto.released) {
            continue;
        }
        const unreleased = Array.isArray(sto.released) && !sto.released.includes(language);

        const elt = document.createElement("div");
        elt.classList.add("story-info");

        const link = document.createElement("a");
        if (unreleased) {
            elt.classList.add("unreleased");
        } else {
            link.href = `?story=${sto.id}`;
        }

        const img = document.createElement("img");
        img.src = `/img/stories/${sto.id}.jpg`;
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
            updateCollectionCountLabel(countLabel, language, sto.id);
        }
        elt.appendChild(countLabel);

        container.appendChild(elt);
    }
}

function showHome(language) {
    document.querySelectorAll('.home').forEach(e => {
        e.style.display = "block";
    });
    createStoryList(language);
}

function showStory() {
    document.querySelectorAll('.in-story').forEach(e => {
        e.style.display = "block";
    });

    document.querySelector("#back-icon").style.display = "block";;
    document.querySelector("#home-icon").style.display = "none";
    document.querySelector(".story-end").style.display = "none";
}

function updateButtons() {
    const storyContinues = !storyUI.didShowChoices;
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
    return `/img/items/${name}.svg`;
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
    if (storyUI.nextAction) {
        const action = storyUI.nextAction;
        storyUI.nextAction = null;
        action();
        updateButtons();
        if (!nextSentence) {
            return;
        }
    }

    hideSpeechRecognition();

    if (!story.canContinue) {
        storyUI.showChoices(story.currentChoices);
        updateButtons();
        return;
    }

    const useSpoiler = settings.readingMode() === "audioFirst";
    const textOnly = settings.readingMode() === "textOnly";
    if (textOnly) {
        while (story.canContinue) {
            const line = story.Continue();
            storyUI.handleLine(line, useSpoiler);
        }
        storyUI.showChoices(story.currentChoices);
    } else {
        const line = story.Continue();
        storyUI.handleLine(line, useSpoiler);
    }
    updateButtons();
};

function toggleListening() {
    speechRecognition.toggle();
}

function hideSpeechRecognition() {
    const speechRecognitionBox = document.querySelector(".speech-recognition");
    speechRecognitionBox.style.display = "none";
    speechRecognitionBox.querySelector(".output").innerHTML = "";
}

function listenMic() {
    const speechRecognitionBox = document.querySelector(".speech-recognition");
    speechRecognitionBox.style.display = "flex";
    const textToRepeat = storyUI.lastSentence.textContent;
    speechRecognition.init(story.lang, textToRepeat, () => {
        speechRecognitionBox.style.display = "none";
        speechRecognitionBox.querySelector(".output").innerHTML = "";

        if (window.goatcounter) {
            window.goatcounter.count({
                path:  `mic/${story.lang}/${story.storyName}`,
                title: 'Microphone',
                event: true,
            });
        }

        next(true);
    });
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
        storyUI.lastTranslateIcon.click();
    }

    if (event.key === "r") {
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        storyUI.lastAudioIcon.click();
    }

    if (event.key === "m") {
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        listenMic();
    }

    if (event.key === "l") {
        if (event.ctrlKey || event.metaKey || event.altKey) {
            return;
        }
        toggleListening();
    }

    if (event.key.match(/[0-9]/)) {
        const index = parseInt(event.key) - 1;
        if (storyUI.lastChoices[index]) {
            storyUI.lastChoices[index].click();
        }
    }
});

window.onload = function(){
    settings.init();
    const updateMicIcon = () => {
        const micIcon = document.querySelector("#microphone-button");
        if (micIcon) {
            micIcon.style.display = settings.useMicrophone() ? "block" : "none";
        }
    };

    updateMicIcon();
    document.querySelector("#use-microphone").addEventListener("change", updateMicIcon);

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("story")) {
        chooseStory(urlParams.get("story"), LANG_CODE);
        showStory();
    } else {
        showHome(LANG_CODE);
    }
};

// Expose entry points to the browser
window.next = next;
window.resetStory = resetStory;
window.story = story; // for debug & js console
window.toggleListening = toggleListening;
window.listenMic = listenMic;

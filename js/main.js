import { refreshBadgesHome } from "./badges.js";
import { allStories } from "./stories.js";
import { UserData } from "./userdata.js";
import { Settings } from "./settings.js";
import { Story } from "./story-engine.js";
import { SpeechRecognitionBox } from "./speech-recognition.js";
import { StoryUI } from "./story-ui.js";
import { Puzzle } from "./puzzle.js";
import { setLang } from "./lang.js";

const SHARE_ORIGIN = "https://lingostories.org";

const story = new Story(updateInventory);
const userData = new UserData();
const settings = new Settings(userData);
const PLAYER_NEXT_PLAY_ICON = "/img/player-play.svg";
const PLAYER_NEXT_PAUSE_ICON = "/img/player-pause.svg";

let pendingShareText = "";
let pendingShareUrl = "";

function setPendingShare(detail) {
    pendingShareUrl = `${SHARE_ORIGIN}/${encodeURIComponent(detail.lang)}/?story=${encodeURIComponent(detail.storyId)}`;
    pendingShareText = `I finished the story "${detail.title}" on LingoStories!`;
    const status = document.querySelector(".story-share-status");
    if (status) {
        status.textContent = "";
    }
}

async function copyShareMessage() {
    // The system share sheet is in the user's language.
    if (navigator.share) {
        try {
            await navigator.share({ text: pendingShareText, url: pendingShareUrl });
        } catch {
            // Cancelled by the user.
        }
        return;
    }
    const message = `${pendingShareText}\n${pendingShareUrl}`;
    const status = document.querySelector(".story-share-status");
    try {
        await navigator.clipboard.writeText(message);
        if (status) {
            status.textContent = "✓";
        }
    } catch {
        if (status) {
            status.textContent = message;
        }
    }
}

window.addEventListener("story-complete", (ev) => {
    if (ev.detail && ev.detail.storyId) {
        setPendingShare(ev.detail);
    }
});
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

// Number of puzzle pieces found, minus `pending` pieces that are still flying in.
function foundPieces(lang, storyName, total, pending = 0) {
    return Math.max(0, Math.min(userData.pieces(lang, storyName).length, total) - pending);
}

// Renders a small puzzle and the "found/total" count into `label`.
// Returns the puzzle, or null if the story has no puzzle.
function renderPuzzleCount(label, lang, storyName, size, pending = 0) {
    label.innerHTML = "";
    const storyData = allStories.find(s => s.id == storyName);
    if (!storyData || !storyData.pieceCount) {
        return null;
    }
    const total = storyData.pieceCount;
    const found = foundPieces(lang, storyName, total, pending);
    const puzzle = new Puzzle(label, storyName, total, size);
    puzzle.show(found);
    const count = document.createElement("span");
    count.textContent = `${found}/${total}`;
    label.appendChild(count);
    label.classList.toggle("story-complete", found >= total);
    label.title = found >= total
        ? "You have completed the puzzle of this story!"
        : `You have found ${found} of ${total} puzzle pieces in this story.`;
    return puzzle;
}

function updateCollectionTopStatus(pending = 0) {
    const label = document.querySelector("#collection-count");
    const puzzle = renderPuzzleCount(label, story.lang, story.storyName, 26, pending);
    label.style.visibility = puzzle ? "visible" : "hidden";

    const panelPuzzle = document.querySelector(".top-puzzle");
    panelPuzzle.innerHTML = "";
    if (puzzle) {
        const total = puzzle.total;
        new Puzzle(panelPuzzle, story.storyName, total, 200)
            .show(foundPieces(story.lang, story.storyName, total, pending));
    }
    createImageCollection(".top-image-collection", story.lang, story.storyName);
    return puzzle;
}

let storyHelpDialogInstance = null;

function ensureStoryHelpDialog() {
    if (storyHelpDialogInstance) {
        return storyHelpDialogInstance;
    }
    const tmpl = document.getElementById("story-help-dialog-template");
    if (!tmpl) {
        return null;
    }
    const root = tmpl.content.cloneNode(true);
    const dialog = root.querySelector("dialog");
    const closeBtn = root.querySelector(".close-button");
    closeBtn.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            dialog.close();
        }
    });
    document.body.appendChild(root);
    storyHelpDialogInstance = { dialog, closeBtn };
    return storyHelpDialogInstance;
}

function openStoryHelpDialog() {
    const ui = ensureStoryHelpDialog();
    if (!ui) {
        return;
    }
    ui.dialog.showModal();
    ui.closeBtn.focus();
}

function showImageOverlay(imagePath) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "1000";
    overlay.style.cursor = "pointer";

    const img = document.createElement("img");
    img.src = `/img/stories/${imagePath}`;
    img.style.maxWidth = "90%";
    img.style.maxHeight = "90%";
    img.style.objectFit = "contain";
    img.style.pointerEvents = "none";

    overlay.appendChild(img);
    overlay.addEventListener("click", () => overlay.remove());
    document.body.appendChild(overlay);
}

function syncStoryPageIntro() {
    const wrap = document.querySelector(".story-page-intro");
    if (!wrap) {
        return;
    }
    const credits = document.getElementById("story-credits-line");
    const list = story.metadata?.sentences?.contributors;
    const lang = story.lang;
    if (credits) {
        credits.textContent = "";
        if (list && list[lang]) {
            const icon = document.createElement("img");
            icon.src = "/img/translate.svg";
            icon.alt = "Translation:";
            icon.title = "Translation";
            icon.classList.add("icon", "credits-icon");
            credits.append(icon, " " + list[lang]);
        }
    }
    const coverImg = document.getElementById("story-cover-img");
    const coverWrap = document.getElementById("story-cover-wrap");
    if (coverImg && coverWrap && story.storyName) {
        const showCover = () => {
            coverWrap.style.display = "block";
        };
        const hideCover = () => {
            coverWrap.style.display = "none";
        };
        coverImg.onload = showCover;
        coverImg.onerror = hideCover;
        coverImg.src = `/img/stories/${story.storyName}.jpg`;
        coverImg.alt = storyTitle(story.storyName, story.lang);
        if (coverImg.complete && coverImg.naturalHeight > 0) {
            showCover();
        } else {
            hideCover();
        }
    }
    wrap.style.display = "block";
}

function hideStoryPageIntro() {
    const wrap = document.querySelector(".story-page-intro");
    if (wrap) {
        wrap.style.display = "none";
    }
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

    syncStoryPageIntro();

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
            elt.style.cursor = "pointer";
            elt.addEventListener("click", () => showImageOverlay(img));
            container.appendChild(elt);
        }
    }
}

function storyTitle(id, lang) {
    return STORY_TITLES[id]?.[lang] || allStories.find((s) => s.id === id)?.title || id;
}

// The story cards are in the page (see templates/lang.html). This adds what
// depends on the user: the puzzle progress, and the title in their language.
function createStoryList(language) {
    const nativeLang = settings.translationLang();
    for (const elt of document.querySelectorAll(".story-list .story-info")) {
        const id = elt.dataset.story;
        const translation = elt.querySelector(".story-title-translation");
        if (translation) {
            if (storyTitle(id, nativeLang) === storyTitle(id, language)) {
                translation.remove();
            } else {
                translation.textContent = storyTitle(id, nativeLang);
                setLang(translation, nativeLang);
            }
        }
        if (elt.classList.contains("unreleased")) {
            continue;
        }
        elt.querySelector(".story-count")?.remove();
        const countLabel = document.createElement("span");
        countLabel.classList.add("story-count");
        if (renderPuzzleCount(countLabel, language, id, 28)) {
            elt.appendChild(countLabel);
        }
    }
}

function showHome(language) {
    hideStoryPageIntro();
    document.querySelectorAll('.home').forEach(e => {
        e.style.display = "block";
    });
    createStoryList(language);
    refreshBadgesHome(userData, language);
}

function showStory() {
    document.querySelectorAll('.in-story').forEach(e => {
        e.style.display = "block";
    });

    document.querySelector("#back-icon").style.display = "block";
    document.querySelector("#home-icon").style.display = "none";
    document.querySelector(".story-end").style.display = "none";
}

function updatePlayerNextIcon() {
    const playerNext = document.getElementById("player-next");
    if (!playerNext) {
        return;
    }
    const isPauseState = settings.readingMode() === "autoAdvance" && storyUI.isAudioPlaying();
    playerNext.src = isPauseState ? PLAYER_NEXT_PAUSE_ICON : PLAYER_NEXT_PLAY_ICON;
    playerNext.title = isPauseState ? "Pause audio (Space key)" : "Continue (Space key)";
}

function continueOrPauseStory() {
    if (settings.readingMode() === "autoAdvance" && storyUI.isAudioPlaying()) {
        storyUI.stopAudioPlayback();
        updateButtons();
        return;
    }
    next();
}

function updateButtons() {
    const storyContinues = !storyUI.didShowChoices;
    document.getElementById("player-next").style.visibility = storyContinues ? "visible" : "hidden";
    updatePlayerNextIcon();
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

    if (value) {
        inventory.style.display = "flex";
    }

    let element = inventory.querySelector(`#item-${item}`);
    if (!element) {
        element = document.createElement("div");
        element.style.backgroundImage = `url(${itemImage(item)})`;
        element.id = `item-${item}`;
        element.classList.add("item");
        if (typeof value === "boolean") {
            element.classList.add("boolean");
        }
        inventory.appendChild(element);
    }
    if (typeof value === "number") {
        element.textContent = value;
        element.classList.remove("updated");
        setTimeout(() => {
            element.classList.add("updated");
        }, 10);    
    }

    element.style.display = value ? "block" : "none";
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
    // Shortcuts only apply while reading a story, and must not interfere with
    // form controls (settings) or open dialogs.
    if (!story.ink || document.querySelector("dialog[open]")) {
        return;
    }
    if (event.target.closest("input, select, textarea")) {
        return;
    }

    switch (event.key) {
        case " ":
            event.preventDefault(); // don't scroll the page
            // A focused button (e.g. Help) would also be activated on keyup.
            event.target.closest("button")?.blur();
            continueOrPauseStory();
            break;
        case "t":
            storyUI.lastTranslateIcon?.click();
            break;
        case "r":
            storyUI.lastAudioIcon?.click();
            break;
        case "m":
            if (settings.useMicrophone() && storyUI.lastSentence) {
                listenMic();
            }
            break;
        case "l":
            toggleListening();
            break;
        default:
            if (/^[1-9]$/.test(event.key)) {
                storyUI.lastChoices[parseInt(event.key) - 1]?.click();
            }
    }
});

function toggleSettings() {
    const options = document.querySelector(".options");
    if (!options) return;
    const isOpen = options.style.display !== "block";
    const icons = document.querySelector(".icon-bar")?.children;
    if (icons) {
        for (let i = 0; i < icons.length; i++) {
            if (icons[i].id !== "settings-icon") {
                icons[i].style.visibility = isOpen ? "hidden" : "visible";
            }
        }
    }
    options.style.display = options.style.display === "block" ? "none" : "block";
}

function toggleCollection() {
    const collection = document.querySelector(".top-collection");
    if (!collection) return;
    collection.style.display = collection.style.display === "block" ? "none" : "block";
}

function handleMainUiClick(event) {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    switch (target.getAttribute("data-action")) {
        case "toggle-settings":
            toggleSettings();
            break;
        case "toggle-collection":
            toggleCollection();
            break;
        case "reset-story":
            resetStory();
            break;
        case "continue-story":
            continueOrPauseStory();
            break;
        case "listen-mic":
            listenMic();
            break;
        case "toggle-listening":
            toggleListening();
            break;
        case "story-share-copy":
            copyShareMessage();
            break;
        case "story-help-open":
            openStoryHelpDialog();
            break;
        default:
            break;
    }
}

window.addEventListener("load", () => {
    document.body.addEventListener("click", handleMainUiClick);

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
    if (allStories.some((s) => s.id === urlParams.get("story"))) {
        chooseStory(urlParams.get("story"), LANG_CODE);
        showStory();
    } else {
        showHome(LANG_CODE);
    }
});

window.story = story;

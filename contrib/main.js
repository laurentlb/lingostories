import { stories } from '/js/stories.js';
import { Story } from '/js/story.js';

const languages = ["en", "fr", "de", "pl", "sv"];

const storyData = new Story();

function createPage(container, page, srcLang, tgtLang) {
    const pageDiv = document.createElement('div');

    for (let i = 0; i < page.text["en"].length; i++) {
        const sentenceDiv = document.createElement('div');
        sentenceDiv.classList.add('sentence');

        const tgtInput = document.createElement('input');
        tgtInput.type = 'text';
        tgtInput.value = page.text[tgtLang][i];
        tgtInput.onchange = function() {
            page.text[tgtLang][i] = tgtInput.value;
        };
        sentenceDiv.appendChild(tgtInput);

        const srcLabel = document.createElement('div');
        srcLabel.classList.add('reference');
        srcLabel.textContent = page.text[srcLang][i];
        sentenceDiv.appendChild(srcLabel);

        pageDiv.appendChild(sentenceDiv);
    }

    for (const choice of page.choices) {
        if (!choice["en"] || choice["en"] === "...") continue;

        const sentenceDiv = document.createElement('div');
        sentenceDiv.classList.add('sentence');

        const tgtInput = document.createElement('input');
        tgtInput.type = 'text';
        tgtInput.value = choice[tgtLang];
        tgtInput.onchange = function() {
            choice[tgtLang] = tgtInput.value;
        };
        sentenceDiv.appendChild(tgtInput);

        const srcLabel = document.createElement('div');
        srcLabel.classList.add('reference');
        srcLabel.textContent = choice[srcLang];
        sentenceDiv.appendChild(srcLabel);

        pageDiv.appendChild(sentenceDiv);
    }

    container.appendChild(pageDiv);
}

function updateStoryText() {
    const container = document.getElementById('story-text');
    const tgtLang = document.getElementById('targetLang').value;
    const srcLang = document.getElementById('sourceLang').value;
    container.innerHTML = '';

    for (const [pageNumber, page] of Object.entries(storyData.sentences)) {
        const hr = document.createElement('hr');
        container.appendChild(hr);

        const title = document.createElement('h2');
        title.textContent = `Page ${pageNumber}`;
        container.appendChild(title);

        createPage(container, page, srcLang, tgtLang);
    }
}

async function createStoryText(storyId, srcLang, tgtLang) {
    await storyData.loadStory(storyId);
    updateStoryText();
}

function loadFromFile() {
    const targetLang = document.getElementById('targetLang').value;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'text/plain';

    input.onchange = function() {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = function() {
            storyData.importTranslation(targetLang, reader.result);
            updateStoryText();
        };
        reader.readAsText(file);
    };
    input.click();
}

function saveToFile() {
    const data = storyData.exportTranslations(document.getElementById('targetLang').value);
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    // save to disk
    const a = document.createElement('a');
    a.href = url;
    const targetLang = document.getElementById('targetLang').value;
    a.download = `translation-${storyData.storyName}-${targetLang}.txt`;
    a.click();
}

window.onload = function() {
    const storyName = document.getElementById('storyName');
    for (const story of stories) {
        const option = document.createElement('option');
        option.value = story.id;
        option.text = story.title;
        storyName.appendChild(option);
    }
 
    const sourceLang = document.getElementById('sourceLang');
    const targetLang = document.getElementById('targetLang');
    for (const lang of languages) {
        const option = document.createElement('option');
        option.value = lang;
        option.text = lang;
        sourceLang.appendChild(option);
        targetLang.appendChild(option.cloneNode(true));
    }

    sourceLang.value = "en";
    targetLang.value = "fr";

    storyName.onchange = function() {
        createStoryText(storyName.value, sourceLang.value, targetLang.value);
    }
    
    sourceLang.onchange = targetLang.onchange = function() {
        updateStoryText();
    };
}

window.loadFromFile = loadFromFile;
window.saveToFile = saveToFile;
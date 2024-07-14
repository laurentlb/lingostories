export class Settings {
    translationLang() {
        return document.querySelector("#translation-lang").value;
    }

    readingMode() {
        return document.querySelector("#reading-mode").value;
    }

    volume() {
        return document.querySelector("#audio-volume").value;
    }

    showTranslations() {
        return document.querySelector("#show-translations").checked;
    }

    voiceSpeed() {
        return document.querySelector("#voice-speed").value;
    }
}

function showReadingModeLegend() {
    const mode = document.getElementById('reading-mode').value;
    const legend = document.getElementById('reading-mode-legend');
    const text = {
        'audioAndText': 'Audio + transcript. Go at your own pace.',
        'autoAdvance': 'Automatically read the next sentence.',
        'audioFirst': 'Try to understand the audio first, then read the transcript.',
        'textOnly': 'Read yourself. The audio is available if you need it.'
    };
    legend.textContent = text[mode];
}

function showTranslationLegend() {
    const showTranslations = document.getElementById('show-translations').checked;
    const legend = document.getElementById('show-translations-legend');
    const text = {
        'true': 'Show translations by default.',
        'false': 'See the translation when you need it, by clicking on the text.'
    };
    legend.textContent = text[showTranslations];
}

export function initSettings() {
    document.querySelector("#show-translations").onchange = showTranslationLegend;
    document.querySelector("#reading-mode").onchange = showReadingModeLegend;

    showTranslationLegend();
    showReadingModeLegend();
}

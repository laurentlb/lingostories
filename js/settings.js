export class Settings {
    constructor(userData) {
        this.userData = userData;
    }

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

    save() {
        this.userData.saveData("settings", {
            translationLang: this.translationLang(),
            readingMode: this.readingMode(),
            volume: this.volume(),
            showTranslations: this.showTranslations(),
            voiceSpeed: this.voiceSpeed(),
        });
    }

    load() {
        const settings = this.userData.loadData("settings", {});
        document.querySelector("#translation-lang").value = settings.translationLang || "en";
        document.querySelector("#reading-mode").value = settings.readingMode || "audioAndText";
        document.querySelector("#audio-volume").value = settings.volume || 1;
        document.querySelector("#show-translations").checked = settings.showTranslations || false;
        document.querySelector("#voice-speed").value = settings.voiceSpeed || 1;
    }

    init() {
        this.load();

        showTranslationLegend();
        showReadingModeLegend();

        document.querySelector("#show-translations").onchange = () => {
            showTranslationLegend();
            this.save();
        };

        document.querySelector("#reading-mode").onchange = () => {
            showReadingModeLegend();
            this.save();
        };

        document.querySelector("#audio-volume").oninput = () => {
            this.save();
        };

        document.querySelector("#voice-speed").oninput = () => {
            this.save();
        };

        document.querySelector("#translation-lang").onchange = () => {
            this.save();
        };
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

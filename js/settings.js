export class Settings {
    constructor(userData) {
        this.userData = userData;
        // The front page only has #translation-lang, but not the other settings.
        this.pageHasFullSettings = document.querySelector(".options") !== null;
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

    enableMinigames() {
        return document.querySelector("#enable-minigames").checked;
    }

    useMicrophone() {
        return document.querySelector("#use-microphone").checked;
    }

    save() {
        if (!this.pageHasFullSettings) {
            // Only save the translation language on this page.
            this.userData.saveData("settings", {
                ...this.userData.loadData("settings", {}),
                translationLang: this.translationLang()
            });
            return;
        }

        this.userData.saveData("settings", {
            translationLang: this.translationLang(),
            readingMode: this.readingMode(),
            volume: this.volume(),
            showTranslations: this.showTranslations(),
            voiceSpeed: this.voiceSpeed(),
            enableMinigames: this.enableMinigames(),
            useMicrophone: this.useMicrophone()
        });
    }

    load() {
        const settings = this.userData.loadData("settings", {
            translationLang: "en",
            readingMode: "audioAndText",
            volume: 1,
            showTranslations: false,
            voiceSpeed: 1,
            enableMinigames: true,
            useMicrophone: false
        });
        document.querySelector("#translation-lang").value = settings.translationLang;
        if (this.pageHasFullSettings) {
            document.querySelector("#reading-mode").value = settings.readingMode;
            document.querySelector("#audio-volume").value = settings.volume;
            document.querySelector("#show-translations").checked = settings.showTranslations;
            document.querySelector("#voice-speed").value = settings.voiceSpeed;
            document.querySelector("#voice-speed-value").textContent = settings.voiceSpeed + "x";
            document.querySelector("#enable-minigames").checked = settings.enableMinigames;
            document.querySelector("#use-microphone").checked = settings.useMicrophone;
        }
    }

    init() {
        this.load();

        document.querySelector("#translation-lang").onchange = () => {
            this.save();
        };

        if (!this.pageHasFullSettings) {
            return;
        }

        showTranslationLegend();
        showReadingModeLegend();
        showMinigamesLegend();

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
            document.querySelector("#voice-speed-value").textContent = document.querySelector("#voice-speed").value + "x";
            this.save();
        };

        document.querySelector("#enable-minigames").onchange = () => {
            showMinigamesLegend();
            this.save();
        };

        document.querySelector("#use-microphone").onchange = () => {
            this.save();
        }
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

function showMinigamesLegend() {
    const showMinigames = document.getElementById('enable-minigames').checked;
    const legend = document.getElementById('enable-minigames-legend');
    const text = {
        'true': 'Minigames use the sentences in the story.',
        'false': 'Minigames are disabled.'
    };
    legend.textContent = text[showMinigames];
}

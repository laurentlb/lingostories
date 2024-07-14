export class Settings {

    translationLang() {
        return document.querySelector("#translation-lang").value;
    }

    readingMode() {
        return document.querySelector("#mode").value;
    }

    volume() {
        return document.querySelector("#volume").value;
    }

    showTranslations() {
        return document.querySelector("#show-translations").checked;
    }

    voiceSpeed() {
        return document.querySelector("#voice-speed").value;
    }
}

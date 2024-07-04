export class UserData {
    constructor() {
        this.storage = window.localStorage;
        this.collectedImages = this.loadData("collectedImages", {});
    }

    saveData(key, data) {
        this.storage.setItem(key, JSON.stringify(data));
    }

    loadData(key, defaultValue) {
        const data = this.storage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    }

    collectImage(lang, story, image) {
        if (!this.collectedImages[lang]) {
            this.collectedImages[lang] = {};
        }

        if (!this.collectedImages[lang][story]) {
            this.collectedImages[lang][story] = [];
        }

        if (!this.collectedImages[lang][story].includes(image)) {
            this.collectedImages[lang][story].push(image);
        }
        this.saveData("collectedImages", this.collectedImages);
    }

    nbCollectedImages(lang, story) {
        if (story) {
            if (!this.collectedImages[lang] || !this.collectedImages[lang][story]) {
                return 0;
            }
            return this.collectedImages[lang][story].length;
        }

        let count = 0;
        for (const story of this.collectedImages[lang]) {
            count += story.length;
        }
        return count;
    }
}

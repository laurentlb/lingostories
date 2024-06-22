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

    collectImage(story, image) {
        const images = this.collectedImages[story] || [];
        if (!images.includes(image)) {
            images.push(image);
        }
        this.collectedImages[story] = images;
        this.saveData("collectedImages", this.collectedImages);
    }

    nbCollectedImages(story) {
        if (story) {
            return this.collectedImages[story]?.length || 0;
        }

        let count = 0;
        for (const story in this.collectedImages) {
            count += this.collectedImages[story].length;
        }
        return count;
    }
}
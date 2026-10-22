export class UserData {
    constructor() {
        this.storage = window.localStorage;
        this.collectedImages = this.loadData("collectedImages", {});
        // Puzzle pieces, in the order they were found: {lang: {story: [pieceId]}}.
        this.puzzlePieces = this.loadData("puzzlePieces", null);
        if (this.puzzlePieces === null) {
            // Before puzzles, every collected image was a collectible:
            // each one becomes a puzzle piece (piece id = image name).
            this.puzzlePieces = JSON.parse(JSON.stringify(this.collectedImages));
            this.saveData("puzzlePieces", this.puzzlePieces);
        }
    }

    pieces(lang, story) {
        return this.puzzlePieces[lang]?.[story] || [];
    }

    hasPiece(lang, story, pieceId) {
        return this.pieces(lang, story).includes(pieceId);
    }

    // Returns true if the piece is new.
    addPiece(lang, story, pieceId) {
        if (this.hasPiece(lang, story, pieceId)) {
            return false;
        }
        this.puzzlePieces[lang] ||= {};
        this.puzzlePieces[lang][story] ||= [];
        this.puzzlePieces[lang][story].push(pieceId);
        this.saveData("puzzlePieces", this.puzzlePieces);
        return true;
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
        for (const images of Object.values(this.collectedImages[lang] || {})) {
            count += images.length;
        }
        return count;
    }
}

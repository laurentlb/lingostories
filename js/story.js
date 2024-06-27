class Page {
    constructor(text, choices, image) {
        this.text = text;
        this.choices = choices;
        this.image = image;
    }
}

export class Story {
    constructor() {
        this.sentences = {};
        this.lang = null;
        this.sentenceIndex = 0;
        this.pageIndex = 0;
        this.storyName = null;
    }

    resetStory() {
        this.sentenceIndex = 0;
        this.pageIndex = 0;
    }

    openPage(index) {
        this.pageIndex = index;
        this.sentenceIndex = 0;
    }

    endOfPage() {
        return this.sentenceIndex >= this.sentences[this.pageIndex].text[this.lang].length;
    }

    hasNext() {
        return this.sentenceIndex <= this.sentences[this.pageIndex].text[this.lang].length;
    }

    get choices() {
        return this.sentences[this.pageIndex].choices;
    }

    nextLine() {
        this.sentenceIndex++;
        if (this.endOfPage()) {
            const choices = this.choices;
            if (choices.length === 1) { // skip superfluous choices
                if (!choices[0]["en"] || choices[0]["en"] === "...") {
                    this.openPage(choices[0]["goto"]);
                }
            }
            return;
        }
    }

    getImage() {
        const img = this.sentences[this.pageIndex].image;
        if (!img) {
            return null;
        }
        if (parseInt(img[0]) === this.sentenceIndex) {
            return img[1];
        }
    }

    sentence(pageIndex, sentenceIndex, lang) {
        return this.sentences[pageIndex].text[lang][sentenceIndex];
    }

    async loadStory(storyName) {
        this.storyName = storyName;
        const response = await fetch(`./stories/${storyName}.json`);
        const story = await response.json();

        for (let page in story) {
            const text = story[page][0];
            for (let lang in text) {
                text[lang] = text[lang].split("|");
            }
            const choices = story[page].slice(1);
            const image = story[page][0]["img"];
            this.sentences[page] = new Page(text, choices, image);
        }
        console.log(this.sentences);
    }
};

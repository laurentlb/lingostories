class Page {
    constructor(paragraphs, choices) {
        this.paragraphIndex = 0;
        this.paragraphs = paragraphs;
        this.choices = choices;
    }

    currentLine() {
        const p = this.paragraphs[this.paragraphIndex];
        const clone = Object.assign({}, p);
        clone.sentenceIndex = this.paragraphIndex;
        return clone;
    }

    nextParagraph() {
        this.paragraphIndex++;
    }

    hasNext() {
        return this.paragraphIndex < this.paragraphs.length;
    }

    reset() {
        this.paragraphIndex = 0;
    }
}

export class Story {
    constructor() {
        this.pages = {};
        this.lang = null;
        this.pageIndex = 0;
        this.storyName = null;
        this.history = new Set();
    }

    speaker(speakerId) {
        return this.speakers[speakerId];
    }

    ResetState() {
        this.pageIndex = 0;
        this.currentPage().reset();
    }

    openPage(index) {
        this.pageIndex = index;
        this.currentPage().reset();
    }

    currentPage() {
        return this.pages[this.pageIndex];
    }

    get canContinue() {
        return this.currentPage().hasNext();
    }

    get choices() {
        return this.pages[this.pageIndex].choices;
    }

    Continue() {
        const res = this.pages[this.pageIndex].currentLine();
        res.pageIndex = this.pageIndex;
        res.isTitle = res.pageIndex === 0 && res.sentenceIndex === 0;

        this.pages[this.pageIndex].nextParagraph();
        if (!this.canContinue) {
            const choices = this.choices;
            if (choices.length === 1) { // skip superfluous choices
                if (!choices[0]["en"] || choices[0]["en"] === "...") {
                    this.openPage(choices[0]["goto"]);
                }
            }
        }
        return res;
    }
    
    async loadStory(storyName) {
        this.pages = {};
        this.storyName = storyName;
        const response = await fetch(`/stories/${storyName}.json`, {cache: "no-cache"});
        const story = await response.json();

        this.speakers = story["metadata"]["speakers"];

        for (let page in story) {
            if (page === "metadata") {
                continue;
            }

            const text = [];
            const choices = [];
            for (const paragraph of story[page]) {
                if (paragraph["goto"]) {
                    choices.push(paragraph);
                } else if (paragraph["en"]) {
                    const parag = [];
                    for (const lang of Object.keys(paragraph)) {
                        const lines = paragraph[lang].split("|");
                        for (let i = 0; i < lines.length; i++) {
                            if (parag.length <= i) {
                                parag.push({});
                            }
                            parag[i][lang] = lines[i];
                        }
                    }
                    parag[0]["img"] = paragraph["img"];
                    text.push(...parag);
                }
            }
            this.pages[page] = new Page(text, choices, null);
        }
        console.log(this.pages);
    }

    exportTranslations(lang) {
        let lines = [];
        for (const page of Object.values(this.pages)) {
            for (const paragraph of page.paragraphs) {
                lines.push(paragraph[lang]);
            }
            for (const choice of page.choices) {
                if (!choice[lang] || choice[lang] === "...") {
                    continue;
                }
                lines.push(choice[lang]);
            }
        }
        return lines.join("\n");
    }

    importTranslation(lang, text) {
        const lines = text.split("\n");
        let lineIndex = 0;
        for (const page of Object.values(this.pages)) {
            for (let i = 0; i < page.paragraphs.length; i++) {
                page.paragraphs[i][lang] = lines[lineIndex];
                lineIndex++;
            }
            for (const choice of page.choices) {
                if (!choice["en"] || choice["en"] === "...") {
                    continue;
                }
                choice[lang] = lines[lineIndex];
                lineIndex++;
            }
        }
    }

    addLanguage(lang) {
       for (const page of Object.values(this.pages)) {
            for (const line of page.paragraphs) {
                if (line["en"]) {
                    line[lang] = "";
                }
            }
            for (const choice of page.choices) {
                choice[lang] = "";
            }
        }
    }
};

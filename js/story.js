class Page {
    constructor(pageIndex, paragraphs, choices, image) {
        this.pageIndex = pageIndex;
        this.paragraphIndex = 0;
        this.paragraphs = paragraphs;
        this.choices = choices;
    }

    nextParagraph() {
        this.paragraphIndex++;
    }

    endOfPage() {
        return this.paragraphIndex >= this.paragraphs.length;
    }

    hasNext() {
        return this.paragraphIndex <= this.paragraphs.length;
    }

    reset() {
        this.paragraphIndex = 0;
    }

    image() {
        return this.paragraphs[this.paragraphIndex]["img"];
    }

    sentence(lineIndex, lang) {
        return this.paragraphs[lineIndex][lang];
    }
}

export class Story {
    constructor() {
        this.pages = {};
        this.lang = null;
        this.pageIndex = 0;
        this.storyName = null;
    }

    resetStory() {
        this.pageIndex = 0;
        this.currentPage().reset();
    }

    openPage(index) {
        this.pageIndex = index;
    }

    currentPage() {
        return this.pages[this.pageIndex];
    }

    endOfPage() {
        return this.currentPage().endOfPage();
    }

    hasNext() {
        return this.currentPage().hasNext();
    }

    get choices() {
        return this.pages[this.pageIndex].choices;
    }

    nextLine() {
        this.pages[this.pageIndex].nextParagraph();
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
        return this.currentPage().image();
    }

    async loadStory(storyName) {
        this.pages = {};
        this.storyName = storyName;
        const response = await fetch(`/stories/${storyName}.json`);
        const story = await response.json();

        for (let page in story) {
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
            this.pages[page] = new Page(page, text, choices, null);
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

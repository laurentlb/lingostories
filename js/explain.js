import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

export class Explain {
    constructor() { }

    async init(storyName, language) {
        this.storyName = storyName;
        this.language = language;
        this.explanations = {};

        const jsonFile = `/stories/${storyName}-explain-${language}.json`;

        await fetch(jsonFile)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${jsonFile}`);
                }
                return response.json();
            })
            .then((data) => {
                this.explanations = data;
            })
            .catch((error) => {
                console.error("Error loading explanations:", error);
            });
    }

    explain(key, sentence, container) {
        if (!this.explanations[key]) {
            return;
        }

        const icon = document.createElement("img");
        icon.src = "/img/question-mark.svg";
        icon.alt = "Explain";
        icon.classList.add("icon", "explain-icon");
        container.appendChild(icon);

        icon.addEventListener("click", () => {
            const explanation = this.explanations[key];
            this.createModal(explanation, sentence);
        });

        if (window.goatcounter) {
            window.goatcounter.count({
                path:  `explain/${story.lang}/${this.story.storyName}`,
                title: 'Microphone',
                event: true,
            });
        }
    }

    markdownToHtml(markdown) {
        if (typeof marked !== 'undefined') {
            return marked(markdown);
        } else {
            console.error("marked library not found.");
            return markdown;
        }
    }

    createModal(content, sentence) {
        const modal = document.createElement("div");
        modal.classList.add("explain-modal");

        // Display the sentence at the top
        const keyElement = document.createElement("h3");
        keyElement.textContent = sentence;
        modal.appendChild(keyElement);

        const text = document.createElement("p");
        text.innerHTML = this.markdownToHtml(content);
        modal.appendChild(text);

        const closeButton = document.createElement("button");
        closeButton.textContent = "Close";
        closeButton.addEventListener("click", () => {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        });
        modal.appendChild(closeButton);

        // Create overlay
        const overlay = document.createElement("div");
        overlay.classList.add("explain-overlay");
        overlay.addEventListener("click", () => {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        });

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }
}

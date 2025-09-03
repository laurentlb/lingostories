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

            if (window.goatcounter) {
                window.goatcounter.count({
                    path:  `explain/${this.language}/${this.storyName}`,
                    title: 'Explain',
                    event: true,
                });
            }
        });
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

        // Header section
        const headerElement = document.createElement("div");
        headerElement.classList.add("header");

        const keyElement = document.createElement("h1");
        keyElement.textContent = sentence;
        headerElement.appendChild(keyElement);

        const closeButton = document.createElement("button");
        closeButton.classList.add("close-button");
        closeButton.textContent = "×";
        closeButton.addEventListener("click", () => {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        });
        headerElement.appendChild(closeButton);

        modal.appendChild(headerElement);

        // Content section
        const contentElement = document.createElement("div");
        contentElement.classList.add("content");

        const text = document.createElement("p");
        text.innerHTML = this.markdownToHtml(content);
        contentElement.appendChild(text);

        modal.appendChild(contentElement);

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

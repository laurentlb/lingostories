import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';

export class Explain {
    constructor() {
        this._dialogUi = null;
    }

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

    /**
     * Lazily clones #explain-dialog-template once and wires close behavior.
     */
    _ensureDialog() {
        if (this._dialogUi) {
            return this._dialogUi;
        }

        const tmpl = document.getElementById("explain-dialog-template");
        if (!tmpl) {
            console.error("Missing #explain-dialog-template in the page.");
            return null;
        }

        const root = tmpl.content.cloneNode(true);
        const dialog = root.querySelector("dialog");
        const titleEl = root.querySelector(".explain-modal-title");
        const bodyEl = root.querySelector(".explain-modal-body");
        const closeButton = root.querySelector(".close-button");

        closeButton.addEventListener("click", () => dialog.close());

        dialog.addEventListener("click", (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });

        document.body.appendChild(root);

        this._dialogUi = { dialog, titleEl, bodyEl };
        return this._dialogUi;
    }

    createModal(content, sentence) {
        const ui = this._ensureDialog();
        if (!ui) {
            return;
        }

        const { dialog, titleEl, bodyEl } = ui;
        titleEl.textContent = sentence;
        bodyEl.innerHTML = this.markdownToHtml(content);

        if (!dialog.open) {
            dialog.showModal();
        }
    }
}

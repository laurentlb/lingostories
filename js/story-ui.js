import { Explain } from "./explain.js";
import { allStories } from "./stories.js";
import { listenMP3, soundEffect } from "./audio.js";
import { WordShuffleGame } from "./wordShuffleGame.js";

// ---------------- BaseStoryUI ----------------
export class BaseStoryUI {
    constructor(story, settings, next, updateButtons) {
        this.story = story;
        this.settings = settings;
        this.next = next;
        this.updateButtons = updateButtons;

        this.nextAction = null;
        this.actionPending = false;
        this.openTransl = null;
        this.lastSentence = null;
        this.lastAudioIcon = null;
        this.lastChoices = [];
        this.didShowChoices = false;
    }

    async init(name, language) {
        this.domStory = document.querySelector('.story');
        this.domStoryEnd = document.querySelector('.story-end');
    }

    resetStory() {
        this.story.ResetState();
        this.domStory.innerHTML = "";
        this.domStory.style.display = "block";
        this.domStoryEnd.style.display = "none";
        const inv = document.querySelector('.inventory');
        if (inv) inv.style.display = "none";
        const footer = document.querySelector('.footer');
        if (footer) footer.style.display = "flex";
        this.nextAction = null;
        this.actionPending = false;
        this.didShowChoices = false;
    }

    // ---- hooks to override ----
    playLineAudio(line, onDone) {}
    playSoundEffect(name, onDone) {}
    collectImage(lang, storyName, image) {}
    showTranslation(elt, line) {}
    addExplanation(container, line) {}
    addContributors(container) {}
    createMinigame(container, line, content) {
        this.actuallyShowText(container, line, false);
    }
    showEndGame() {}
    // ---------------------------

    createSpeaker(audioElt, speaker, container) {
        audioElt.classList.add("speaker");
        audioElt.src = `/img/avatars/${speaker.avatar}`;
        if (speaker.color) {
            container.style.setProperty('--character-color', speaker.color);
        }
        if (speaker.side === "right") {
            container.style.flexDirection = "row-reverse";
        }
    }

    showText(line, useSpoiler) {
        if (line[this.story.lang] === "") {
            this.next();
            return;
        }

        const textOnly = this.settings.readingMode() === "textOnly";

        const container = document.createElement("div");
        container.classList.add("sentence-container");
        this.domStory.appendChild(container);

        const audioElt = document.createElement("img");
        const speaker = line["speaker"];
        if (speaker) {
            this.createSpeaker(audioElt, speaker, container);
        } else {
            audioElt.src = "/img/volume-up.svg"; 
            audioElt.classList.add("icon", "audio-icon");
        }
        audioElt.onclick = () => this.playLineAudio(line, null);
        this.lastAudioIcon = audioElt;
        container.appendChild(audioElt);

        const content = line[this.story.lang];
        if (!content) {
            console.error("Empty content", line, this.story.lang);
        }
        const showMinigame = !textOnly && this.shouldShowMinigame(content, line);

        if (showMinigame) {
            this.createMinigame(container, line, content);
        } else {
            this.actuallyShowText(container, line, useSpoiler);
        }

        if (!textOnly) {
            this.playLineAudio(line, () => {
                if (!this.actionPending) {
                    this.next();
                }
            });
        }
    }

    actuallyShowText(container, line, useSpoiler) {
        const content = line[this.story.lang];
        const isTitle = line.isTitle;
        const elt = document.createElement(isTitle ? "h2" : "p");
        if (useSpoiler) {
            elt.classList.add("spoiler");
            this.nextAction = () => {
                elt.classList.remove("spoiler");
                elt.classList.add("revealed");
            };
        }

        elt.classList.add("text");
        elt.textContent = content;
        const speaker = line["speaker"];
        if (speaker) {
            const side = speaker.side === "right" ? "right" : "left";
            elt.classList.add("bubble", `bubble-${side}`);
        }

        elt.onclick = () => this.showTranslation(elt, line);

        this.lastSentence = elt;
        container.appendChild(elt);

        this.addExplanation(container, line);
        if (isTitle) {
            this.addContributors(container.parentElement);
        }
    }

    showChoices(choices) {
        if (this.didShowChoices) return;
        this.didShowChoices = true;

        const container = document.createElement("div");
        container.classList.add("choices");

        this.lastChoices.length = 0;
        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            const text = this.story.translateChoice(choice, this.story.lang);
            const elt = document.createElement("div");
            elt.classList.add("choice");
            elt.textContent = text;

            const transl = document.createElement("p");
            transl.classList.add("translation");
            transl.style.display = "none";
            elt.appendChild(transl);

            elt.onclick = () => this.showTranslation(elt, choice);

            const textIcon = document.createElement("div");
            textIcon.classList.add("text-icon");
            textIcon.textContent = i + 1;
            textIcon.onclick = () => {
                this.lastChoices.length = 0;
                container.innerHTML = "";
                textIcon.onclick = null;
                container.appendChild(textIcon);
                container.appendChild(elt);
                container.remove();

                this.story.ChooseChoiceIndex(choice.index);
                this.didShowChoices = false;
                this.next();
            };
            this.lastChoices.push(textIcon);

            container.appendChild(textIcon);
            container.appendChild(elt);
        }

        if (choices.length > 0) {
            this.domStory.appendChild(container);
        } else {
            this.showEndGame();
        }
    }

    shouldShowMinigame(content, line) {
        return false;
    }

    handleLine(line, useSpoiler) {
        const audio = line["audio"];
        if (!audio) {
            const image = line["img"];
            if (image) {
                this.showImage(image);
            } else {
                this.showText(line, useSpoiler);
            }
            return;
        }

        const textOnly = this.settings.readingMode() === "textOnly";
        if (!textOnly) {
            this.playSoundEffect(audio, () => this.next());
        }
    }

    showImage(image) {
        const img = document.createElement("img");
        img.onload = () => this.updateButtons();
        img.src = `/img/stories/${image}`;
        img.classList.add("story-image");
        this.domStory.appendChild(img);

        this.collectImage(this.story.lang, this.story.storyName, image);

        const textOnly = this.settings.readingMode() === "textOnly";
        if (!textOnly) {
            this.playSoundEffect('image-collected', () => {
                if (this.settings.readingMode() === "autoAdvance") {
                    this.next();
                }
            });
        }
    }
}

// ---------------- StoryUI (game) ----------------
export class StoryUI extends BaseStoryUI {
    constructor(userData, settings, story, next, updateCollectionTopStatus, updateButtons) {
        super(story, settings, next, updateButtons);
        this.userData = userData;
        this.updateCollectionTopStatus = updateCollectionTopStatus;
        this.explainer = new Explain();
    }

    async init(name, language) {
        await super.init(name, language);
        await this.explainer.init(name, language);
    }

    playLineAudio(line, onDone) {
        listenMP3(this.story, line, this.settings, onDone);
    }

    playSoundEffect(name, onDone) {
        soundEffect(this.settings, name, onDone);
    }

    collectImage(lang, storyName, image) {
        this.userData.collectImage(lang, storyName, image);
        this.updateCollectionTopStatus();
        if (this.story.storyName === "intro") {
            const info = document.createElement("div");
            info.classList.add("info-box");
            info.textContent =
                `You have collected an image! Each story has a set of images to
                 collect (see the number at the top). This encourages you to read
                 the stories multiple times and make different choices.`;
            this.domStory.appendChild(info);
        }

        if (window.goatcounter) {
            window.goatcounter.count({
                path:  `collect/${image}`,
                title: 'Load Story',
                event: true,
            });
        }
    }

    showTranslation(elt, line) {
        if (!line || !this.settings.showTranslations()) return;
        const transl = document.createElement("p");
        const transLang = this.settings.translationLang();
        transl.textContent = line[transLang];
        transl.classList.add("translation");
        elt.appendChild(transl);
    }

    addExplanation(container, line) {
        this.explainer.explain(line.key, line[this.story.lang], container);
    }

    addContributors(container) {
        const list = this.story.metadata.sentences["contributors"];
        if (!list || !list[this.story.lang]) return;
        const contributors = document.createElement("div");
        contributors.classList.add("info");
        contributors.textContent = "Translation: " + list[this.story.lang];
        container.appendChild(contributors);
    }

    createMinigame(container, line, content) {
        const minigame = document.createElement("div");
        this.actionPending = true;
        const endGame = () => {
            this.actionPending = false;
            this.nextAction = null;
            minigame.remove();
            this.actuallyShowText(container, line, false);
            this.updateButtons();
            if (this.settings.readingMode() === "autoAdvance") {
                this.next();
            }
        };
        this.nextAction = endGame;
        const game = new WordShuffleGame(this.settings, content, minigame, endGame);
        container.appendChild(minigame);
    }

    shouldShowMinigame(content, line) {
        if (!this.settings.enableMinigames()) return false;
        const nbWords = content.split(" ").length;
        if (nbWords < 4 || nbWords > 8) return false;
        if (this.story.storyName === "intro") return false;
        if (line.isTitle) return false;
        return Math.random() < 0.2;
    }

    showEndGame() {
        this.playSoundEffect('level-end');
        this.domStoryEnd.style.display = "block";
        const storyData = allStories.find(s => s.id === this.story.storyName);
        const collectedImages = this.userData.nbCollectedImages(this.story.lang, this.story.storyName);
        let text = "You have completed this story. ";
        if (collectedImages === storyData.imageCount) {
            text += `You have collected all images in this story!`;
        } else {
            text += `You have collected ${collectedImages} out of ${storyData.imageCount} images in this story.`;
        }
        document.querySelector('.story-end-text').textContent = text;
        document.querySelector('.footer').style.display = "none";

        if (window.goatcounter) {
            window.goatcounter.count({
                path:  `end/${this.story.lang}/${this.story.storyName}`,
                title: 'End Story',
                event: true,
            });
        }
    }
}

// ---------------- EditorStoryUI ----------------
export class EditorStoryUI extends BaseStoryUI {
    playLineAudio(line, onDone) { /* no audio in editor */ }
    playSoundEffect(name, onDone) { /* no sounds */ }
    collectImage(lang, storyName, image) { /* editor doesn’t track userdata */ }
    showTranslation(elt, line) { /* no translations in editor */ }
    addExplanation(container, line) { /* no explanations */ }
    addContributors(container) { /* no contributors */ }
    showEndGame() {
        this.domStoryEnd.style.display = "block";
        const txt = this.domStoryEnd.querySelector(".story-end-text");
        if (txt) txt.textContent = "(End of story – editor mode)";
    }
}

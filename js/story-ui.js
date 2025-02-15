import { Explain } from "./explain.js";
import { allStories } from "./stories.js";
import { listenMP3, soundEffect } from "./audio.js";
import { WordShuffleGame } from "./wordShuffleGame.js";

export class StoryUI {
    constructor(userData, settings, story, next, updateCollectionTopStatus, updateButtons) {
        this.userData = userData;
        this.settings = settings;
        this.story = story;
        this.next = next;
        this.updateCollectionTopStatus = updateCollectionTopStatus;

        this.nextAction = null;
        this.actionPending = false;
        this.openTransl = null;
        this.lastSentence = null;
        this.lastAudioIcon = null;
        this.lastChoices = [];
        this.didShowChoices = false;

        this.explainer = new Explain();
    }

    async init(name, language) {
        this.domStory = document.querySelector('.story');
        this.domStoryEnd = document.querySelector('.story-end');
        await this.explainer.init(name, language);
    }
    
    resetStory() {
        this.story.ResetState();
        this.domStory.innerHTML = "";
        this.domStory.style.display = "block";
        this.domStoryEnd.style.display = "none";
        document.querySelector('.inventory').style.display = "none";
        document.querySelector('.footer').style.display = "flex";
        this.nextAction = null;
        this.actionPending = false;
        this.didShowChoices = false;
    }

    createTranslation(parent, line) {
        const transl = document.createElement("p");
        const transLang = this.settings.translationLang();
        transl.textContent = line[transLang];
        transl.classList.add("translation");
        if (this.openTransl) {
            this.openTransl.remove();
            this.openTransl = null;
        }
        this.openTransl = transl;

        parent.appendChild(transl);
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
    
        audioElt.onclick = () => {
            listenMP3(this.story, line, this.settings, null);
        };
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
            listenMP3(this.story, line, this.settings, () => {
                if (!this.actionPending) {
                    this.next();
                }
            });
        }
    }
    
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
    
        const showTranslation = this.settings.showTranslations() || this.story.storyName === "intro";
        if (showTranslation) {
            this.createTranslation(elt, line);
        }

        elt.onclick = () => {
            if (elt.classList.contains("spoiler")) {
                this.next();
                return;
            }
            if (this.openTransl && this.openTransl.parentElement === elt) {
                this.openTransl.remove();
                this.openTransl = null;
                return;
            }
            else {
                this.createTranslation(elt, line);
            }
        }
    
        this.lastSentence = elt;
        container.appendChild(elt);
    
        this.addExplanation(container, line);
        if (isTitle) {
            this.addContributors(container.parentElement);
        }
    }
    
    addContributors(container) {
        const list = this.story.metadata.sentences["contributors"];
        if (!list || !list[this.story.lang]) {
            return;
        }
        const contributors = document.createElement("div");
        contributors.classList.add("info");
        contributors.textContent = "Translation: " + list[this.story.lang];
        container.appendChild(contributors);
    }

    showChoices(choices) {
        if (this.didShowChoices) {
            return;
        }
        this.didShowChoices = true;

        const container = document.createElement("div");
        container.classList.add("choices");
    
        const transLang = this.settings.translationLang();
        this.lastChoices.length = 0;
        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            const text = this.story.translateChoice(choice, this.story.lang);
            const elt = document.createElement("div");
            elt.classList.add("choice");
            elt.textContent = text;
            elt.title = this.story.translateChoice(choice, transLang);

            const transl = document.createElement("p");
            transl.classList.add("translation");
            transl.style.display = "none";
            elt.appendChild(transl);

            elt.onclick = () => {
                if (transl.style.display === "block") {
                    transl.style.display = "none";
                }
                else {
                    const transLang = this.settings.translationLang();
                    transl.style.display = "block";
                    transl.textContent = this.story.translateChoice(choice, transLang);
                }
            }
    
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

    showEndGame() {
        soundEffect(this.settings, 'level-end');
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

        gtag('event', 'end-story', { 'story': this.story.storyName, 'lang': this.story.lang });
    }

    shouldShowMinigame(content, line) {
        if (!this.settings.enableMinigames()) {
            return false;
        }
    
        const nbWords = content.split(" ").length;
        if (nbWords < 4 || nbWords > 8) {
            return false;
        }
    
        if (this.story.storyName === "intro") {
            return false;
        }
    
        if (line.isTitle) {
            return false;
        }
    
        return Math.random() < 0.2;
    }
    
    addExplanation(container, line) {
        this.explainer.explain(line.key, line[this.story.lang], container);
    }
    
    handleLine(line, useSpoiler) {
        const audio = line["audio"]; // in-game sound effects
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
            soundEffect(this.settings, audio, () => {
                this.next();
            });
        }
    }
    
    showImage(image) {
        const img = document.createElement("img");
        img.onload = () => {
            updateButtons(); // to scroll down
        };
        img.src = `/img/stories/${image}`;
        img.classList.add("story-image");
        this.domStory.appendChild(img);
        this.userData.collectImage(this.story.lang, this.story.storyName, image);
        const textOnly = this.settings.readingMode() === "textOnly";
        if (!textOnly) {
            soundEffect(this.settings, 'image-collected', () => {
                if (this.settings.readingMode() === "autoAdvance") {
                    this.next();
                }
            });
        }
        this.updateCollectionTopStatus();
    
        // Show explanation for the first image
        if (this.story.storyName === "intro") {
            const info = document.createElement("div");
            info.classList.add("info-box");
            info.textContent =
                    `You have collected an image! Each story has a set of images to
                    collect (see the number at the top). This encourages you to read
                    the stories multiple times and make different choices.`;
            this.domStory.appendChild(info);
        }
    }
}

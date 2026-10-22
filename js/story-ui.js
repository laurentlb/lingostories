import { Explain } from "./explain.js";
import { recordStoryCompletion, refreshBadgesHome } from "./badges.js";
import { allStories } from "./stories.js";
import { listenMP3, soundEffect, stopMP3 } from "./audio.js";
import { WordShuffleGame } from "./wordShuffleGame.js";
import { WordPopup } from "./word-popup.js";
import { Puzzle, flyPiece, sparkle } from "./puzzle.js";
import { Sfx } from "./sfx.js";

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------------- BaseStoryUI ----------------
export class BaseStoryUI {
    constructor(story, settings, next, updateButtons) {
        this.story = story;
        this.settings = settings;
        this.next = next;
        this.updateButtons = updateButtons;

        this.nextAction = null;
        this.actionPending = false;
        this.lastSentence = null;
        this.lastAudioIcon = null;
        this.lastTranslateIcon = null;
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
    playLineAudio(line, container, onDone) {}
    playSoundEffect(name, onDone) {}
    collectImage(lang, storyName, image) {}
    addExplanation(container, line) {}
    addContributors(container) {}
    toggleTranslation(container, line) {}
    toggleChoiceTranslation(container, choice) {}
    createMinigame(container, line, content) {
        this.actuallyShowText(container, line, false);
    }
    showEndGame() {}
    answerWrong(quiz, icon, elt) {
        icon.classList.add("tried");
        elt.classList.add("tried");
    }
    answerRight(quiz, icon, elt, choose) {
        choose();
    }
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
        this.lastLine = line;

        const container = document.createElement("div");
        container.classList.add("sentence-container");
        this.domStory.appendChild(container);

        const translateElt = document.createElement("img");
        translateElt.title = "Translate (T)";
        translateElt.src = "/img/translate.svg";
        translateElt.classList.add("icon", "translate-icon");
        translateElt.onclick = () => this.toggleTranslation(container, line);
        this.lastTranslateIcon = translateElt;
        container.appendChild(translateElt);

        const audioElt = document.createElement("img");
        audioElt.title = "Play audio (R)";
        const speaker = line["speaker"];
        if (speaker) {
            this.createSpeaker(audioElt, speaker, container);
        } else {
            audioElt.src = "/img/volume-up.svg"; 
            audioElt.classList.add("icon", "audio-icon");
        }
        audioElt.onclick = () => this.playLineAudio(line, container, null);
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
            this.playLineAudio(line, container, () => {
                if (!this.actionPending) {
                    this.next();
                }
            });
        }
    }

    showWordPopup(container, word) {
        var popup = new WordPopup();
        popup.showWordPopup(container, container, word, this.story.lang, this.settings.translationLang());
    }

    addEachWordToDom(sentenceElement, content) {
        const tokens = content.match(/(\p{L}+|\s+|\P{L}+)/gu) || [];
        
        sentenceElement.textContent = ''; 

        // Create a DocumentFragment for efficient DOM manipulation
        const fragment = document.createDocumentFragment();

        tokens.forEach(token => {
            if (/\p{L}/u.test(token)) {
                const wordSpan = document.createElement('span');
                wordSpan.textContent = token;
                wordSpan.classList.add('word');
                fragment.appendChild(wordSpan);
            } else {
                const nonWordTextNode = document.createTextNode(token);
                fragment.appendChild(nonWordTextNode);
            }
        });

        sentenceElement.appendChild(fragment);

        // Attach the single event listener to the parent container for event delegation
        const parent = this;
        sentenceElement.addEventListener('click', function(event) {
            const clickedElement = event.target;
            if (parent.nextAction) { // happens in case of spoiler
                parent.nextAction();
                parent.nextAction = null;
                return;
            }

            if (clickedElement.classList.contains('word')) {
                var popup = new WordPopup();
                popup.showWordPopup(sentenceElement, clickedElement, clickedElement.textContent,
                    parent.story.lang, parent.settings.translationLang());
            }
        });
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
        this.addEachWordToDom(elt, content);
        const speaker = line["speaker"];
        if (speaker) {
            const side = speaker.side === "right" ? "right" : "left";
            elt.classList.add("bubble", `bubble-${side}`);
        }

        if (this.settings.showTranslations()) {
            this.showTranslation(elt, line);
        }

        this.lastSentence = elt;
        container.appendChild(elt);

        this.addExplanation(container, line);
    }

    showChoices(choices) {
        if (this.didShowChoices) return;
        this.didShowChoices = true;

        const container = document.createElement("div");
        container.classList.add("choices");

        // A question: choices tagged #ok / #fail. Wrong answers can be retried.
        const tagged = (choice, tag) => (choice.tags || []).includes(tag);
        const isQuiz = choices.some((c) => tagged(c, "ok") || tagged(c, "fail"));
        const quiz = isQuiz ? {
            pieceId: "q:" + (this.lastLine?.key || this.lastLine?.en || ""),
            tries: 0,
            container,
        } : null;

        this.lastChoices.length = 0;
        for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            const text = this.story.translateChoice(choice, this.story.lang);
            const elt = document.createElement("div");
            elt.classList.add("choice");
            elt.textContent = text;

            const transl = document.createElement("p");
            transl.textContent = text;
            transl.classList.add("translation");
            transl.style.display = "none";
            elt.appendChild(transl);

            elt.onclick = () => this.toggleChoiceTranslation(transl, choice);

            const textIcon = document.createElement("div");
            textIcon.classList.add("text-icon");
            textIcon.textContent = i + 1;
            // keep: leave the chosen answer visible (questions).
            const choose = (keep = false) => {
                this.lastChoices.length = 0;
                container.innerHTML = "";
                container.appendChild(textIcon);
                container.appendChild(elt);
                if (keep) {
                    container.classList.add("answered");
                } else {
                    container.remove();
                }

                this.story.ChooseChoiceIndex(choice.index);
                this.didShowChoices = false;
                this.next();
            };
            textIcon.onclick = () => {
                if (!quiz) {
                    textIcon.onclick = null;
                    choose();
                } else if (tagged(choice, "fail")) {
                    textIcon.onclick = null;
                    quiz.tries++;
                    this.answerWrong(quiz, textIcon, elt);
                } else {
                    for (const icon of this.lastChoices) icon.onclick = null;
                    this.answerRight(quiz, textIcon, elt, choose);
                }
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
                this.showImage(image, line["collect"]);
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

    showImage(image, collect) {
        const img = document.createElement("img");
        img.onload = () => this.updateButtons();
        img.src = `/img/stories/${image}`;
        img.classList.add("story-image");
        this.domStory.appendChild(img);

        this.collectImage(this.story.lang, this.story.storyName, image, collect);

        const textOnly = this.settings.readingMode() === "textOnly";
        if (textOnly) {
            return;
        }
        const autoAdvance = () => {
            if (this.settings.readingMode() === "autoAdvance") {
                this.next();
            }
        };
        if (collect) {
            this.playSoundEffect('image-collected', autoAdvance);
        } else {
            // Leave a moment to look at the illustration.
            setTimeout(autoAdvance, 1500);
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
        this.sfx = new Sfx(settings);
        this.openTransl = null;
        this.highlightedText = null;
        this.currentAudioContainer = null;
        this.combo = 0; // consecutive first-try answers, only used for the chime pitch
        this.piecesAtStart = 0;
    }

    async init(name, language) {
        await super.init(name, language);
        await this.explainer.init(name, language);
    }

    resetStory() {
        super.resetStory();
        this.combo = 0;
        this.piecesAtStart = this.userData.pieces(this.story.lang, this.story.storyName).length;
    }

    // Grants a puzzle piece (if new) and animates it from `source` to the top puzzle.
    awardPiece(pieceId, source) {
        if (this.userData.addPiece(this.story.lang, this.story.storyName, pieceId)) {
            this.animatePiece(source);
        }
    }

    // Animates the last piece found from `source` to the top puzzle.
    animatePiece(source) {
        const index = this.userData.pieces(this.story.lang, this.story.storyName).length - 1;
        const puzzle = this.updateCollectionTopStatus(1);
        flyPiece(source, puzzle, index, () => {
            this.updateCollectionTopStatus()?.bump();
            this.sfx.piece();
        });
    }

    quizHint(quiz, text) {
        let hint = quiz.container.querySelector(".quiz-hint");
        if (!hint) {
            hint = document.createElement("p");
            hint.classList.add("quiz-hint");
            hint.setAttribute("aria-live", "polite");
            quiz.container.appendChild(hint);
        }
        hint.textContent = text;
    }

    answerWrong(quiz, icon, elt) {
        super.answerWrong(quiz, icon, elt);
        this.combo = 0;
        this.sfx.tok();
        icon.classList.remove("wobble");
        void icon.offsetWidth;
        icon.classList.add("wobble");
        this.quizHint(quiz, "Not this one. Try another.");
    }

    answerRight(quiz, icon, elt, choose) {
        const lang = this.story.lang;
        const name = this.story.storyName;
        const firstTry = quiz.tries === 0;
        const hasPiece = this.userData.hasPiece(lang, name, quiz.pieceId);

        icon.textContent = "✓";
        icon.classList.add("correct");
        icon.setAttribute("aria-label", "Correct");
        elt.classList.add("chosen");
        quiz.container.classList.add("answering");
        sparkle(icon);
        this.sfx.chime(firstTry ? this.combo : 0);
        this.combo = firstTry ? this.combo + 1 : 0;

        setTimeout(() => {
            // Grant the piece before continuing: the story may end right away.
            const newPiece = firstTry && !hasPiece && this.userData.addPiece(lang, name, quiz.pieceId);
            choose(true);
            if (hasPiece) {
                return;
            }
            if (newPiece) {
                this.quizHint(quiz, "Puzzle piece found!");
                this.animatePiece(icon);
            } else {
                this.quizHint(quiz, "Get it right the first time on a replay to earn this piece.");
            }
        }, reducedMotion() ? 150 : 600);
    }

    clearPlayingAudioState() {
        if (this.currentAudioContainer) {
            this.currentAudioContainer.classList.remove("playing-audio");
        }
        this.currentAudioContainer = null;
        this.highlightedText = null;
    }

    isAudioPlaying() {
        return this.currentAudioContainer !== null;
    }

    stopAudioPlayback() {
        if (!this.currentAudioContainer) {
            return;
        }
        stopMP3();
        this.clearPlayingAudioState();
    }

    playLineAudio(line, container, onDone) {
        this.clearPlayingAudioState();

        if (this.highlightedText !== null) {
            this.highlightedText.classList.remove("playing-audio");
        }
        this.highlightedText = container;
        container.classList.add("playing-audio");
        this.currentAudioContainer = container;

        listenMP3(this.story, line, this.settings, (success) => {
            if (this.currentAudioContainer === container) {
                this.clearPlayingAudioState();
            } else {
                container.classList.remove("playing-audio");
            }
            if (onDone !== null && success && this.settings.readingMode() === "autoAdvance") {
                onDone();
            }
        });
    }

    playSoundEffect(name, onDone) {
        soundEffect(this.settings, name, onDone);
    }

    collectImage(lang, storyName, image, collect) {
        this.userData.collectImage(lang, storyName, image);
        this.updateCollectionTopStatus();
        if (!collect) {
            return;
        }
        const imageElement = this.domStory.querySelector(".story-image:last-of-type");
        this.awardPiece(image, imageElement);
        if (this.story.storyName === "intro") {
            const info = document.createElement("div");
            info.classList.add("info-box");
            info.textContent =
                `You found a puzzle piece! Each story hides a picture to complete
                 (see the puzzle at the top). Read the stories again and make
                 different choices to find all the pieces.`;
            this.domStory.appendChild(info);
        }

        if (window.goatcounter) {
            window.goatcounter.count({
                path:  `collect/${image}`,
                title: 'Collect Image',
                event: true,
            });
        }
    }

    showTranslation(elt, line) {
        if (!line) {
            return;
        }
        const transl = document.createElement("p");
        transl.classList.add("translation");
        const transLang = this.settings.translationLang();

        if (transLang === this.story.lang) {
            transl.textContent = "(select a different translation language in the settings to see translations)";
        } else {
            transl.textContent = line[transLang];
        }

        if (this.openTransl) {
            this.openTransl.remove();
            this.openTransl = null;
        }
        this.openTransl = transl;

        elt.appendChild(transl);
    }

    toggleChoiceTranslation(elt, choice) {
        if (elt.style.display === "block") {
            elt.style.display = "none";
        } else {
            const transLang = this.settings.translationLang();
            elt.style.display = "block";
            elt.textContent = this.story.translateChoice(choice, transLang);
        }
    }

    toggleTranslation(elt, line) {
        elt = elt.querySelector(".text");
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
            this.showTranslation(elt, line);
        }
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
        const total = storyData.pieceCount;
        const found = this.userData.pieces(this.story.lang, this.story.storyName).length;
        let text = "You have completed this story.";
        if (total > 0 && found >= total) {
            text += " Puzzle complete! Here is the hidden picture.";
        } else if (total > 0) {
            text += ` You have found ${found} of ${total} puzzle pieces. Replay to find the missing ones.`;
        }
        document.querySelector('.story-end-text').textContent = text;
        document.querySelector('.footer').style.display = "none";

        const puzzleArea = document.querySelector('.story-end-puzzle');
        if (puzzleArea) {
            puzzleArea.innerHTML = "";
            if (total > 0) {
                const puzzle = new Puzzle(puzzleArea, this.story.storyName, total, 200);
                const from = Math.min(this.piecesAtStart, found);
                puzzle.revealFrom(from, found);
                this.sfx.arpeggio(found - from);
            }
        }

        if (window.goatcounter) {
            window.goatcounter.count({
                path:  `end/${this.story.lang}/${this.story.storyName}`,
                title: 'End Story',
                event: true,
            });
        }

        const completionDetail = {
            storyId: this.story.storyName,
            lang: this.story.lang,
            title: storyData.title,
            readingMode: this.settings.readingMode(),
            pieceCount: total,
            foundPieces: found,
        };
        recordStoryCompletion(this.userData, completionDetail);
        refreshBadgesHome(this.userData, this.story.lang);

        window.dispatchEvent(
            new CustomEvent("story-complete", {
                bubbles: true,
                detail: completionDetail,
            })
        );
    }
}

// ---------------- EditorStoryUI ----------------
export class EditorStoryUI extends BaseStoryUI {
    playLineAudio(line, container, onDone) { /* no audio in editor */ }
    playSoundEffect(name, onDone) { /* no sounds */ }
    collectImage(lang, storyName, image) { /* editor doesn’t track userdata */ }
    toggleTranslation(container) { /* no translations in editor */ }
    addExplanation(container, line) { /* no explanations */ }
    addContributors(container) { /* no contributors */ }
    showEndGame() {
        this.domStoryEnd.style.display = "block";
        const txt = this.domStoryEnd.querySelector(".story-end-text");
        if (txt) txt.textContent = "(End of story – editor mode)";
    }
}

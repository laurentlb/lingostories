import { soundEffect } from "./audio.js";

export class SpeechRecognitionBox {
    constructor(settings, container) {
        this.settings = settings;
        this.container = container;

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        this.isAPIAvailable = !!SpeechRecognition;
        if (!this.isAPIAvailable) {
            return;
        }
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 10;
        this.isListening = false;

        this.loopCount = 0;
        const restart = () => {
            this.recognition.abort();
            try {
                if (this.hasSucceeded) {
                    return;
                }
                this.loopCount++;
                if (this.loopCount >= 5) {
                    console.log("Stopping audio after 5 tries.");
                    return;
                }
                this.recognition.start();
            } catch (e) {
                console.error("restart failed - ", e);
            }
        }

        this.recognition.onresult = (event) => {
            this.updateResult(event);
        }

        this.recognition.onerror = (event) => {
            console.error(`Speech recognition error detected: ${event.error}`);
        };
    
        this.recognition.onnomatch = () => {
            console.error("Speech not recognized");
        };
    
        this.recognition.addEventListener("end", () => {
            restart();
        });
    
        this.recognition.addEventListener("audiostart", () => {
            this.isListening = true;
        });

        this.recognition.addEventListener("audioend", () => {
            this.isListening = false;
            console.log("Audio capturing ended");
        });
    }

    init(lang, sentence, callback) {
        if (!this.isAPIAvailable) {
            return;
        }

        const SpeechGrammarList =
            window.SpeechGrammarList || window.webkitSpeechGrammarList;

        this.words = this.splitWords(sentence);
        console.log("words", this.words);
        this.lang = lang;
        this.hasSucceeded = false;
        this.callback = callback;
        this.loopCount = 0;

        const speechRecognitionList = new SpeechGrammarList();
        const grammar =
            `#JSGF V1.0; grammar words; public <word> = ${this.words.join(' | ')};`;
        speechRecognitionList.addFromString(grammar, 1);        
        this.recognition.grammars = speechRecognitionList;

        const locales = {
            "en": "en-US",
            "fr": "fr-FR",
            "de": "de-DE",
            "nl": "nl-NL",
            "pl": "pl-PL",
            "sv": "sv-SE",
            "pt": "pt-PT",
        }
        this.recognition.lang = locales[lang];

        this.recognition.abort();
        try {
            this.recognition.start();
        } catch (e) {
            console.error("Failed to start speech recognition", e);
        }
    }

    toggle() {
        if (this.isListening) {
            this.loopCount = 10;
            this.recognition.abort();
        } else {
            this.loopCount = 0;
            this.hasSucceeded = false;
            this.recognition.start();
        }
    }

    splitWords(sentence) {
        return sentence.match(/[^-.,!;:()?" ]+/g);
    }

    updateResult(event) {
        const elements = [];
        const expected = this.words.join(" ").toLowerCase();
        this.container.innerHTML = "";

        console.log("updateResult", event.results);
        for (let i = event.resultIndex; i < event.results.length; i++) {
            for (let j = 0; j < event.results[i].length; j++) {
                const elt = document.createElement("div");
                elt.textContent = event.results[i][j].transcript;
                const result = event.results[i][j].transcript;
                if (event.results[i].isFinal &&
                    this.splitWords(result).join(" ").toLowerCase() === expected) {
                    elt.classList.add("success");
                    this.success();
                    this.container.append(elt);
                    return;
                }

                if (i == 0 && j == 0) {
                    elements.push(elt);
                }
            }
        }

        this.container.append(...elements);
    }

    success() {
        if (this.hasSucceeded) {
            return;
        }

        this.hasSucceeded = true;
        soundEffect(this.settings, 'game-success', () => {
            this.callback();
        });
    }
}

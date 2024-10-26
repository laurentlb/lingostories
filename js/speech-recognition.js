import { soundEffect } from "./audio.js";

export class SpeechRecognitionBox {
    constructor(settings, container) {
        this.settings = settings;
        this.container = container;

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 5;
        this.isListening = false;

        this.loopCount = 0;
        const restart = () => {
            console.log("Restarting audio");
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
                console.log("Actually restarting audio");
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
            console.log("Speech recognition service disconnected");
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
        // this.recognition.lang = "en-US";
        this.recognition.lang = "fr-FR"; // de-DE"; // fr-FR";

        this.recognition.stop();
        this.recognition.start();
    }

    toggle() {
        if (this.isListening) {
            this.loopCount = 10;
            this.recognition.abort();
        } else {
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

        const elt = document.createElement("div");
        let success = false;
        for (let i = event.resultIndex; i < event.results.length; i++) {
            for (let j = 0; j < event.results[i].length; j++) {
                elt.textContent = event.results[i][j].transcript;
                const result = event.results[i][j].transcript;
                if (event.results[i].isFinal &&
                    this.splitWords(result).join(" ").toLowerCase() === expected) {
                    elt.classList.add("success");
                    success = true;
                    this.success();
                    break;
                }
            }
            if (success) {
                break;
            }
        }

        this.container.innerHTML = "";
        this.container.append(elt);
        return false;
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

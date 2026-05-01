import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';
import { LingoStoriesWordTranslator } from './word-translator.js';

export class WordPopup {
    constructor() {
        this.wordTranslator = new LingoStoriesWordTranslator();
        this._outsideClickHandler = this._handleOutsideClick.bind(this);
    }

    _detachOutsideClick() {
        document.removeEventListener("click", this._outsideClickHandler, true);
    }

    _handleOutsideClick(event) {
        const popupElement = document.getElementById("word-popup");
        if (!popupElement) {
            this._detachOutsideClick();
            return;
        }

        const clickedElement = event.target;
        const isClickInsidePopup = popupElement.contains(clickedElement);
        const isClickOnWord = clickedElement.classList.contains("word");

        if (!isClickInsidePopup && !isClickOnWord) {
            popupElement.style.display = "none";
            this._detachOutsideClick();
        }
    }

    createWordPopupElement(container, id) {
        var existingPopup = document.getElementById(id);
        if (existingPopup) {
            existingPopup.parentNode.removeChild(existingPopup);
        }

        const popup = document.createElement('div');
        popup.id = id;
        
        popup.classList.add('word-popup'); 
        container.appendChild(popup);
        return popup;
    }

    async setPopupContent(popupElement, word, source, target) {
        popupElement.innerHTML = ''; // Clear existing content

        try {
            const divSource = document.createElement('div');
            divSource.textContent = word;
            divSource.classList.add('source-word');
            popupElement.appendChild(divSource);

            const divTranslation = document.createElement('div');
            divTranslation.classList.add('translated-word');
            divTranslation.textContent = '...';

            this.wordTranslator.translate(source, word, target).then((translation) => {
                divTranslation.textContent = translation;
            }).catch((error) => {
                console.error("Translation error:", error);
                divTranslation.textContent = "(translation error)";
            });

            popupElement.appendChild(divTranslation);
        } catch (e) {
            console.log(e)
            popupElement.appendChild(document.createTextNode(`"${word}":`));
        }

        const expandButton = document.createElement('button');
        expandButton.textContent = 'More...';
        expandButton.classList.add('expand-button');
        popupElement.appendChild(expandButton);
        const listElement = document.createElement('ul');        

        expandButton.onclick = () => {
            expandButton.style.display = 'none';
            listElement.innerHTML = ''; // clear in case of double click
            const links = getDictionaries(word, source, target);
            for (const [name, url] of Object.entries(links)) {
                if (url === null) continue;
                const linkElement = document.createElement('a');
                linkElement.target = '_blank';
                linkElement.href = url;
                linkElement.textContent = name;
                const listItem = document.createElement('li');
                listItem.appendChild(linkElement);
                listElement.appendChild(listItem);
            }
            popupElement.appendChild(listElement);
        };

        popupElement.appendChild(listElement);
    }

    showWordPopup(container, wordElement, word, source, target) {
        this._detachOutsideClick();

        const popupElement = this.createWordPopupElement(container, "word-popup");

        // 1. Get positions relative to the viewport
        const wordRect = wordElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const popupX = (wordRect.left + (wordRect.width / 2)) - containerRect.left;
        const popupY = wordRect.top - containerRect.top;
        this.setPopupContent(popupElement, word, source, target);

        popupElement.style.left = `${popupX}px`;
        popupElement.style.top = `${popupY}px`;

        popupElement.style.display = "block";

        document.addEventListener("click", this._outsideClickHandler, true);
    }
}

function GoogleTranslate(text, source, target) {
    // Example:
    // https://translate.google.com/?sl=fr&tl=en&text=maison

    const url = `https://translate.google.com/?sl=${source}&tl=${target}&text=${encodeURIComponent(text)}&op=translate`;
    return url;
}

function DeepL(text, source, target) {
    // Example:
    // https://www.deepl.com/translator#fr/en-us/maison

    const convertLangCode = (lang) => {
        if (lang === "ua") return "uk"; // DeepL uses 'uk' for Ukrainian
        return lang;
    }

    target = convertLangCode(target);
    source = convertLangCode(source);

    const url = `https://www.deepl.com/translator#${source}/${target}/${encodeURIComponent(text)}`;
    return url;
}

function WordReference(text, source, target) {
    // Example:
    // https://www.wordreference.com/fren/maison
    
    // Many "virtual" dictionaries are supported, so many language pairs are possible.
    // https://www.wordreference.com/virtual_dictionaries.html

    if (source === "ua" || target === "ua") return null; // WordReference does not support Ukrainian

    const langPair = `${source}${target}`;
    const url = `https://www.wordreference.com/${langPair}/${encodeURIComponent(text)}`;
    return url;
}

function DictCC(text, source, target) {
    // Example:
    // https://enfr.dict.cc/?s=maison

    // en/de => any
    const supportedLangs = ["en", "de"];
    if (!supportedLangs.includes(source) && !supportedLangs.includes(target)) {
        return null;
    }

    const convertLangCode = (lang) => {
        if (lang === "ua") return "uk"; // DeepL uses 'uk' for Ukrainian
        return lang;
    }

    target = convertLangCode(target);
    source = convertLangCode(source);

    const url = `https://${source}${target}.dict.cc/?s=${encodeURIComponent(text)}`;
    return url;
}

function PonsCom(text, source, target) {
    // Example:
    // https://en.pons.com/text-translation/french-english?q=maison

    const langMap = {
        "en": "english",
        "fr": "french",
        "de": "german",
        "es": "spanish",
        "it": "italian",
        "nl": "dutch",
        "pl": "polish",
        "pt": "portuguese",
        "ru": "russian",
        "sv": "swedish",
        "tr": "turkish",
        "ua": "ukrainian",
    };

    source = langMap[source] || null;
    target = langMap[target] || null;
    if (source === null || target === null) {
        return null;
    }

    const url = `https://en.pons.com/text-translation/${source}-${target}?q=${encodeURIComponent(text)}`;
    return url;
}

function getDictionaries(text, source, target) {
    return {
        "DeepL": DeepL(text, source, target),
        "Dict.cc": DictCC(text, source, target),
        "Google Translate": GoogleTranslate(text, source, target),
        "Pons.com": PonsCom(text, source, target),
        "WordReference": WordReference(text, source, target),
    };
}

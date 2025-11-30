export class BaseWordTranslator {
    async translate(word, targetLang) { }
}

export class LingoStoriesWordTranslator extends BaseWordTranslator {
    convertLangCode(lang) {
        if (lang === "ua") return "uk"; // DeepL uses 'uk' for Ukrainian
        return lang;
    }

    async translate(sourceLang, word, targetLang) {
        const response = await fetch(`https://lingostories.org/py/translate_api.py?src=${this.convertLangCode(sourceLang)}&tgt=${this.convertLangCode(targetLang)}&word=${word}`)
            .then((response) => {
                console.log(response)
                if (!response.ok) {
                    throw new Error(`Failed to translate word ${word}`);
                }
                return response.json();
            })
        if (!response.success) {
            throw new Error(`Failed to translate word ${word}`);
        }

        return response.translation;
    }
}

// Language codes used on the site. They are ISO 639-1 codes, except "ua" for Ukrainian.

// Value for the HTML lang attribute.
export function htmlLang(code) {
    return code === "ua" ? "uk" : code;
}

export function textDir(code) {
    return code === "ar" ? "rtl" : "ltr";
}

// Marks an element as written in `code`, for screen readers, fonts and right-to-left text.
export function setLang(elt, code) {
    elt.lang = htmlLang(code);
    elt.dir = textDir(code);
}

// The first browser language that is in `supported`.
export function browserLang(supported, fallback = "en") {
    for (const tag of navigator.languages || [navigator.language]) {
        let code = tag.toLowerCase().split("-")[0];
        if (code === "uk") code = "ua";
        if (supported.includes(code)) return code;
    }
    return fallback;
}

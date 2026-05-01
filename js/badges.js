const ENGAGEMENT_KEY = "engagement";

const STORY_LEVEL_BADGES = [
    { id: "stories_1", count: 1, title: "Finisher I", description: "Complete 1 story in this language." },
    { id: "stories_3", count: 3, title: "Finisher II", description: "Complete 3 stories in this language." },
    { id: "stories_5", count: 5, title: "Finisher III", description: "Complete 5 stories in this language." },
];

export const BADGE_CATALOG = [
    ...STORY_LEVEL_BADGES.map(({ id, title, description }) => ({ id, title, description })),
    { id: "collector", title: "Collector", description: "Collect every illustration in one story." },
    { id: "listening_finisher", title: "Listening ear", description: "Finish a story in Listening mode." },
    { id: "reader", title: "Bookworm", description: "Finish a story in Reading mode (text only)." },
];

function loadEngagement(userData) {
    const state = userData.loadData(ENGAGEMENT_KEY, { byLang: {} });

    if (!state.byLang || typeof state.byLang !== "object") {
        state.byLang = {};
    }

    if (Array.isArray(state.completedKeys)) {
        const completedByLang = {};
        for (const key of state.completedKeys) {
            const parsed = parseCompletionKey(key);
            if (!parsed) {
                continue;
            }
            if (!completedByLang[parsed.lang]) {
                completedByLang[parsed.lang] = new Set();
            }
            completedByLang[parsed.lang].add(parsed.storyId);
        }

        for (const [lang, storyIds] of Object.entries(completedByLang)) {
            const langState = getLanguageState(state, lang);
            for (const storyId of storyIds) {
                if (!langState.completedStoryIds.includes(storyId)) {
                    langState.completedStoryIds.push(storyId);
                }
            }
            if (Array.isArray(state.badges)) {
                for (const badgeId of state.badges) {
                    if (!langState.badges.includes(badgeId)) {
                        langState.badges.push(badgeId);
                    }
                }
            }
        }
    }

    return state;
}

function saveEngagement(userData, state) {
    userData.saveData(ENGAGEMENT_KEY, state);
}

function parseCompletionKey(key) {
    const i = key.indexOf("_");
    if (i <= 0) {
        return null;
    }
    return { lang: key.slice(0, i), storyId: key.slice(i + 1) };
}

function getLanguageState(state, lang) {
    if (!state.byLang[lang]) {
        state.byLang[lang] = {
            completedStoryIds: [],
            badges: [],
        };
    }
    const langState = state.byLang[lang];
    if (!Array.isArray(langState.completedStoryIds)) {
        langState.completedStoryIds = [];
    }
    if (!Array.isArray(langState.badges)) {
        langState.badges = [];
    }
    return langState;
}

export function recordStoryCompletion(userData, detail) {
    const { storyId, lang, readingMode, imageCount, collectedImages } = detail;
    const state = loadEngagement(userData);
    const langState = getLanguageState(state, lang);
    if (!langState.completedStoryIds.includes(storyId)) {
        langState.completedStoryIds.push(storyId);
    }

    const award = (id) => {
        if (!langState.badges.includes(id)) {
            langState.badges.push(id);
        }
    };

    const completedStories = langState.completedStoryIds.length;
    for (const level of STORY_LEVEL_BADGES) {
        if (completedStories >= level.count) {
            award(level.id);
        }
    }

    if (imageCount > 0 && collectedImages >= imageCount) {
        award("collector");
    }

    if (readingMode === "audioFirst") {
        award("listening_finisher");
    }
    if (readingMode === "textOnly") {
        award("reader");
    }

    saveEngagement(userData, state);
}

export function refreshBadgesHome(userData, lang) {
    const section = document.getElementById("badges-section");
    if (!section) {
        return;
    }

    const el = document.getElementById("badges-strip");
    const state = loadEngagement(userData);
    const langState = getLanguageState(state, lang);
    el.innerHTML = "";
    if (!langState.badges.length) {
        section.style.display = "none";
        return;
    }
    section.style.display = "block";
    for (const id of langState.badges) {
        const def = BADGE_CATALOG.find((b) => b.id === id);
        if (!def) {
            continue;
        }
        const span = document.createElement("span");
        span.className = "badge-pill";
        span.textContent = def.title;
        span.title = def.description;
        el.appendChild(span);
    }
}

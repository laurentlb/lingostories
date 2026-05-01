const ENGAGEMENT_KEY = "engagement";

export const BADGE_CATALOG = [
    { id: "first_finish", title: "Finisher", description: "Complete any story." },
    { id: "collector", title: "Collector", description: "Collect every illustration in one story." },
    { id: "listening_finisher", title: "Listening ear", description: "Finish a story in Listening mode." },
    { id: "reader", title: "Bookworm", description: "Finish a story in Reading mode (text only)." },
    {
        id: "polyglot_story",
        title: "Same plot, new language",
        description: "Finish the same story in two different practice languages.",
    },
    { id: "explorer", title: "Explorer", description: "Finish three different stories." },
];

function loadEngagement(userData) {
    return userData.loadData(ENGAGEMENT_KEY, { completedKeys: [], badges: [] });
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

export function recordStoryCompletion(userData, detail) {
    const { storyId, lang, readingMode, imageCount, collectedImages } = detail;
    const key = `${lang}_${storyId}`;
    const state = loadEngagement(userData);
    if (!state.completedKeys.includes(key)) {
        state.completedKeys.push(key);
    }

    const award = (id) => {
        if (!state.badges.includes(id)) {
            state.badges.push(id);
        }
    };

    if (state.completedKeys.length >= 1) {
        award("first_finish");
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

    const langsForThisStory = new Set();
    for (const k of state.completedKeys) {
        const p = parseCompletionKey(k);
        if (p && p.storyId === storyId) {
            langsForThisStory.add(p.lang);
        }
    }
    if (langsForThisStory.size >= 2) {
        award("polyglot_story");
    }

    const distinctStories = new Set();
    for (const k of state.completedKeys) {
        const p = parseCompletionKey(k);
        if (p) {
            distinctStories.add(p.storyId);
        }
    }
    if (distinctStories.size >= 3) {
        award("explorer");
    }

    saveEngagement(userData, state);
}

export function refreshBadgesHome(userData) {
    const el = document.getElementById("badges-strip");
    if (!el) {
        return;
    }
    const state = loadEngagement(userData);
    el.innerHTML = "";
    if (!state.badges.length) {
        el.style.display = "none";
        return;
    }
    el.style.display = "flex";
    for (const id of state.badges) {
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

// Compiles Ink stories and checks them against their translation files.
//
// Usage: node scripts/check_stories.cjs [--write] [--langs=en,fr,de] [--runs=500] story...
//
// For each story, this:
// - compiles stories/<id>.ink (and writes stories/<id>.ink.json with --write),
// - plays many random paths through the story,
// - reports lines/choices without a translation in each language,
// - reports translation entries that are never displayed,
// - reports the endings reached and images that are missing from img/stories.

const fs = require("fs");
const path = require("path");
const inkjs = require("../js/third_party/ink.js");

const root = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
const write = args.includes("--write");
const langs = (args.find((a) => a.startsWith("--langs=")) || "--langs=en,fr,de")
    .slice("--langs=".length).split(",");
const runs = parseInt((args.find((a) => a.startsWith("--runs=")) || "--runs=500").slice("--runs=".length));
const stories = args.filter((a) => !a.startsWith("--"));

// Mirrors Story.processLine in js/story-engine.js.
function normalizeLine(line) {
    line = line.trim();
    if (line.startsWith("`")) {
        line = line.substring(1, line.length - 1);
    }
    return line;
}

function checkStory(name) {
    console.log(`\n=== ${name} ===`);
    const source = fs.readFileSync(path.join(root, "stories", `${name}.ink`), "utf-8");
    const metadata = JSON.parse(fs.readFileSync(path.join(root, "stories", `${name}.tl.json`), "utf-8"));
    const sentences = metadata.sentences || {};

    const compiler = new inkjs.Compiler(source);
    let story;
    try {
        story = compiler.Compile();
    } catch (e) {
        console.log("Compilation failed:", e.message);
        for (const err of compiler.errors) console.log("  error:", err);
        return false;
    }
    for (const w of compiler.warnings) console.log("  warning:", w);
    const json = story.ToJson();
    if (write) {
        fs.writeFileSync(path.join(root, "stories", `${name}.ink.json`), json);
    }

    const seen = new Map(); // text -> "line" | "choice"
    const images = new Set();
    const endings = new Map();
    let maxSteps = 0;

    for (let run = 0; run < runs; run++) {
        const s = new inkjs.Story(json);
        let steps = 0;
        let last = "";
        while (true) {
            while (s.canContinue) {
                const line = normalizeLine(s.Continue());
                if (line === "") continue;
                if (line.startsWith("$image")) {
                    images.add(line.split(" ")[1]);
                    continue;
                }
                if (line.startsWith("$audio")) continue;
                if (!seen.has(line)) seen.set(line, "line");
                last = line;
                steps++;
            }
            if (s.currentChoices.length === 0) break;
            for (const c of s.currentChoices) {
                if (!seen.has(c.text)) seen.set(c.text, "choice");
            }
            const choice = s.currentChoices[Math.floor(Math.random() * s.currentChoices.length)];
            s.ChooseChoiceIndex(choice.index);
        }
        maxSteps = Math.max(maxSteps, steps);
        const vars = s.variablesState;
        const key = `${last}` + (vars.$("found_pages") !== null && vars.$("found_pages") !== undefined
            ? ` [found_pages=${vars.$("found_pages")}]` : "");
        endings.set(key, (endings.get(key) || 0) + 1);
    }

    let ok = true;
    const missing = {};
    for (const [text, kind] of seen) {
        const entry = sentences[text];
        for (const lang of langs) {
            if (!entry || !entry[lang]) {
                (missing[lang] ||= []).push(`${kind}: ${text}`);
            }
        }
        if (entry && !entry.key) {
            console.log(`  no audio key: ${text}`);
        }
    }
    for (const [lang, list] of Object.entries(missing)) {
        ok = false;
        console.log(`  missing ${lang} (${list.length}):`);
        for (const m of list) console.log(`    ${m}`);
    }

    const unused = Object.keys(sentences).filter((k) => !seen.has(k) && k !== "contributors");
    if (unused.length) {
        console.log(`  never displayed (${unused.length}) - unused entry or unreachable content:`);
        for (const u of unused) console.log(`    ${u}`);
    }

    for (const img of images) {
        if (!fs.existsSync(path.join(root, "img", "stories", img))) {
            console.log(`  missing image: img/stories/${img}`);
        }
    }
    if (!fs.existsSync(path.join(root, "img", "stories", `${name}.jpg`))) {
        console.log(`  missing cover: img/stories/${name}.jpg`);
    }

    console.log(`  ${seen.size} distinct lines, longest path ${maxSteps} lines, ${images.size} images`);
    console.log("  endings:");
    for (const [k, v] of [...endings].sort((a, b) => b[1] - a[1])) {
        console.log(`    ${v}x ${k}`);
    }
    return ok;
}

let allOk = true;
for (const name of stories) {
    allOk = checkStory(name) && allOk;
}
process.exit(allOk ? 0 : 1);

// Edit Page JavaScript
import { Story } from '/js/story-engine.js';
import { EditorStoryUI } from '/js/story-ui.js';
import { allStories } from '/js/stories.js';

import { basicEditor } from "https://unpkg.com/prism-code-editor@2.4.1/dist/setups/index.js";
import { loadTheme } from "https://unpkg.com/prism-code-editor@2.4.1/dist/themes/index.js";
import { l as internal } from "https://unpkg.com/prism-code-editor@2.4.1/dist/prismCore-AxbjJFmh.js";

const settings = {
    readingMode: () => "text-only",
    enableMinigames: () => false,
    showTranslations: () => false,
    translationLang: () => "en",
};
const story = new Story();
const storyUI = new EditorStoryUI(story, settings, renderNext, () => {});

// Ink language grammar for Prism
internal.ink = Prism.languages.ink = {
    'comment': {
        pattern: /\/\*[\s\S]*?\*\/|\/\/.*/,
        greedy: true
    },
    'string': {
        pattern: /"[^"]*"|->\s\w+/,
        greedy: true
    },
    'keyword': {
        pattern: new RegExp('\\b(?:LIST|VAR|VAR|CONST|TEMP|FUNCTION|INCLUDE|DEFINE|EXTERNAL|GLOBAL|TUNNEL|DIVERT|DONE|END|STITCH|GATHER|CHOICE|OPTION|FALLBACK|WEAVE|SEQUENCE|CYCLE|SHUFFLE|ONCE|STOP|RETURN|~|->|<-|===|==|!=|<=|>=|<|>|\\+|-|\\*|/|%|&&|\\|\\||!|true|false|null)\\b'),
        greedy: true
    },
    'variable': {
        pattern: /[@$]\w+\b/,
        greedy: true
    },
    'number': {
        pattern: /\b\d+(?:\.\d+)?\b/,
        greedy: true
    },
    'operator': {
        pattern: /[+\-*/%=<>!&|~^]/,
        greedy: true
    },
    'punctuation': {
        pattern: /[{}[\];(),.:]/,
        greedy: true
    }
};

// DOM elements
const elWorkbench = document.querySelector(".ink-workbench");
const elEditor = document.getElementById("wb-editor");
const elOutput = document.querySelector(".story");

// Sample Ink code
const sample = `Story example #title
This is an example of a story.
Each sentence should be on a separate line.

Use the star to offer choices.
  * 1st choice.
    This is a good choice.
  * Another choice.
    This is also fine.
-

After the dash, the story continues.
@tom Some characters can talk.
@anna We'll add more characters later.
You can also offer choices that jump to another section.
-> menu

=== menu
  + [Go left] -> left
  + [Go right] -> right
  * [Wait]
    You waited.
    -> menu
// with '*', the action can be used only once; with '+', it can be used again.

=== left
You went left.
-> menu

=== right
You went right.
And it is the end of the tutorial.
-> END`;

const speakers = {
    "mom": {
        "avatar": "woman.svg",
        "color": "#a26"
    },
    "peter": {
        "avatar": "peter.svg",
        "color": "#26a",
        "side": "right"
    },
    "teacher": {
        "avatar": "woman.svg",
        "color": "#484"
    },
    "employee": {
        "avatar": "man5.svg",
        "color": "#a62"
    },
    "seller": {
        "avatar": "man2.svg",
        "color": "#288"
    },
    "baker": {
        "avatar": "man3.svg",
        "color": "#a22"
    },
    "anna": {
        "avatar": "woman.svg",
        "color": "#484",
        "side": "right"
    },
    "tom": {
        "avatar": "man.svg",
        "color": "#26a"
    },
};

// Initialize Prism editor
const editor = basicEditor("#wb-editor", {
    value: sample,
    language: "ink",
    theme: "github-dark",
    lineNumbers: true
});

loadTheme("github-dark");

// State
let autoCompileEnabled = true;
let autoCompileTimeout = null;
let lastCompiledContent = '';   

// Helper functions for editor content management
function getEditorContent() {
    return editor.value;
}

function setEditorContent(content) {
    editor.textarea.value = content;

    // Manually trigger the input event to force an update
    editor.textarea.dispatchEvent(new Event('input'));
}

function appendLine(txt, className = '') {
    const div = document.createElement("div");
    div.textContent = txt;
    if (className) {
        div.className = className;
    }
    elOutput.appendChild(div);
    setTimeout(() => {
        elOutput.scrollTop = elOutput.scrollHeight;
    }, 0);
}

function renderNext() {
    while (story.canContinue) {
        const line = story.Continue();
        storyUI.handleLine(line, false);
    }
    storyUI.showChoices(story.currentChoices);
}

// Story functions
function run() {
    const content = editor.value;
    lastCompiledContent = content;

    document.querySelector(".story-end").style.display = "none";

    try {
        story.loadStoryFromText(content, speakers);
    } catch (e) {
        elOutput.innerHTML = "";
        appendLine(e.message);
        for (const msg of story.compiler.errors) {
            appendLine(`❌ ${msg}`, "error");
        }
        for (const msg of story.compiler.warnings) {
            appendLine(`⚠ ${msg}`, "warning");
        }
        return;
    }
    storyUI.init("noname", "en");
    storyUI.resetStory();
    renderNext();
    elWorkbench.setAttribute("data-mode", "player");
}

// Auto-compilation functions
function toggleAutoCompile() {
    autoCompileEnabled = !autoCompileEnabled;
    const button = document.getElementById("wb-auto-compile");
    if (button) {
        button.textContent = autoCompileEnabled ? "🔄 Auto: ON" : "🔄 Auto: OFF";
    }

    if (!autoCompileEnabled) {
        if (autoCompileTimeout) {
            clearTimeout(autoCompileTimeout);
            autoCompileTimeout = null;
        }
    }
}

function scheduleAutoCompile() {
    if (!autoCompileEnabled) return;
    
    if (autoCompileTimeout) {
        clearTimeout(autoCompileTimeout);
    }
    
    autoCompileTimeout = setTimeout(() => {
        if (autoCompileEnabled) {
            if (editor.value !== lastCompiledContent) {
                run();
            }
        }
    }, 500); // 500ms delay
}

// Story loading functionality
async function populateStoryDropdown() {
    const select = document.getElementById("wb-story-select");
    if (!select) return;
    
    // Clear existing options except the first one
    while (select.children.length > 1) {
        select.removeChild(select.lastChild);
    }
    
    // Add stories from the stories.js file
    allStories.forEach(story => {
        const option = document.createElement("option");
        option.value = story.id;
        option.textContent = story.title;
        select.appendChild(option);
    });
}

async function loadStory(storyId) {
    if (!storyId) return;
    
    // Find the story title for better feedback
    const storyInfo = allStories.find(story => story.id === storyId);
    const storyTitle = storyInfo ? storyInfo.title : storyId;
    
    try {
        appendLine(`🔄 Loading "${storyTitle}"...`, "info");
        
        const response = await fetch(`/stories/${storyId}.ink`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const content = await response.text();
        setEditorContent(content);
        run();
    } catch (error) {
        console.error('Failed to load story:', error);
        appendLine(`❌ Failed to load "${storyTitle}": ${error.message}`, "error");
    }
}

function handleStorySelection() {
    const select = document.getElementById("wb-story-select");
    if (select && select.value) {
        loadStory(select.value);
        select.selectedIndex = 0;
    }
}

// Modal functionality
async function loadSyntaxModal() {
    try {
        const response = await fetch('syntax-modal.html');
        const content = await response.text();
        const modal = document.getElementById("syntax-modal");
        modal.innerHTML = content;
        
        // Re-attach event handlers after loading content
        const syntaxCloseBtn = document.getElementById("syntax-close");
        if (syntaxCloseBtn) {
            syntaxCloseBtn.onclick = hideSyntaxModal;
        }
    } catch (error) {
        console.error('Failed to load syntax modal:', error);
    }
}

function showSyntaxModal() {
    const syntaxModal = document.getElementById("syntax-modal");
    const syntaxOverlay = document.getElementById("syntax-overlay");
    syntaxModal.style.display = "block";
    syntaxOverlay.style.display = "block";
}

function hideSyntaxModal() {
    const syntaxModal = document.getElementById("syntax-modal");
    const syntaxOverlay = document.getElementById("syntax-overlay");
    syntaxModal.style.display = "none";
    syntaxOverlay.style.display = "none";
}

// Keyboard shortcuts
function handleKeyboardShortcuts(event) {
    // Ctrl+Space to manually run/compile
    if (event.ctrlKey && event.key === ' ') {
        event.preventDefault();
        run();
    }
    
    // Ctrl+Shift+A to toggle auto-compile
    if (event.ctrlKey && event.shiftKey && event.key === 'A') {
        event.preventDefault();
        toggleAutoCompile();
    }
}

// Event handlers
function initializeEventHandlers() {
    // Toolbar buttons
    document.getElementById("wb-run").onclick = run;
    document.getElementById("wb-syntax-help").onclick = showSyntaxModal;
    document.getElementById("wb-auto-compile").onclick = toggleAutoCompile;
    
    // Story selector dropdown
    const storySelect = document.getElementById("wb-story-select");
    if (storySelect) {
        storySelect.onchange = handleStorySelection;
    }
    
    // Close modal when clicking overlay
    const syntaxOverlay = document.getElementById("syntax-overlay");
    syntaxOverlay.onclick = hideSyntaxModal;
    
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    setupChangeDetection();
}

// Set up change detection for the editor
function setupChangeDetection() {
    elEditor.addEventListener('input', () => {
        scheduleAutoCompile();
    });
}

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', async function() {
    // Load syntax modal content
    await loadSyntaxModal();
    
    // Populate story dropdown
    await populateStoryDropdown();
    await editor.textarea.dispatchEvent(new Event('input')); // wait for editor to be ready
    
    initializeEventHandlers();

    document.querySelectorAll('.in-story').forEach(e => {
        e.style.display = "block";
    });

    run();
});

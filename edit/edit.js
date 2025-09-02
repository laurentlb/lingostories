// Edit Page JavaScript
import { Story } from '/js/story-engine.js';
import { StoryUI } from '/js/story-ui.js';
import { allStories } from '/js/stories.js';

import { basicEditor } from "https://unpkg.com/prism-code-editor@2.4.1/dist/setups/index.js";
import { loadTheme } from "https://unpkg.com/prism-code-editor@2.4.1/dist/themes/index.js";
import { l as internal } from "https://unpkg.com/prism-code-editor@2.4.1/dist/prismCore-AxbjJFmh.js";

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
const elOutput = document.getElementById("wb-output");
const elChoices = document.getElementById("wb-choices");

// Sample Ink code
const sample = `Hello world!
      *   Say hi
          Nice to meet you.
      *   Say bye
          Goodbye!
      -> END`;

// Initialize Prism editor
const editor = basicEditor("#wb-editor", {
    value: sample,
    language: "ink",
    theme: "github-dark",
    lineNumbers: true
});
window.editor = editor; // Expose for debugging

loadTheme("github-dark");

// State
let story = null;
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

// Output functions
function clearOutput() { 
    elOutput.innerHTML = ""; 
    elChoices.innerHTML = "";
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

function appendChoice(idx, txt) {
    const btn = document.createElement("button");
    btn.textContent = txt;
    btn.onclick = () => { 
        story.ChooseChoiceIndex(idx);
        elChoices.innerHTML = "";
        renderNext(); 
    };
    const div = document.createElement("div"); 
    div.className = "wb-choice";
    div.appendChild(btn); 
    elChoices.appendChild(div);
}

function renderNext() {
    while (story.canContinue) {
        const line = story.Continue();
        appendLine(line["en"]);
    }
    story.currentChoices.forEach((c, i) => appendChoice(i, c.text));
}

// Story functions
function run() {
    const content = editor.value;
    lastCompiledContent = content;

    clearOutput();
    // const compiler = new inkjs.Compiler(content);
    story = new Story();
    try {
        story.loadStoryFromText(content);
        console.log("Compiled successfully.");
        // story = compiler.Compile();
        renderNext();
        elWorkbench.setAttribute("data-mode", "player");
    } catch (e) {
        clearOutput();
        for (const msg of story.compiler.errors) {
            appendLine(`❌ ${msg}`, "error");
        }
        for (const msg of story.compiler.warnings) {
            appendLine(`⚠ ${msg}`, "warning");
        }
    }
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
        // Reset selection to show "Load Story..." again
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
document.addEventListener('DOMContentLoaded', async function() {
    // Load syntax modal content
    await loadSyntaxModal();
    
    // Populate story dropdown
    await populateStoryDropdown();
    
    initializeEventHandlers();

    run();
});

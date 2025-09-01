// Edit Page JavaScript
import { Story } from '/js/story-engine.js';

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
        pattern: new RegExp('\\b(?:LIST|VAR|CONST|TEMP|FUNCTION|INCLUDE|DEFINE|EXTERNAL|GLOBAL|TUNNEL|DIVERT|DONE|END|STITCH|GATHER|CHOICE|OPTION|FALLBACK|WEAVE|SEQUENCE|CYCLE|SHUFFLE|ONCE|STOP|RETURN|~|->|<-|===|==|!=|<=|>=|<|>|\\+|-|\\*|/|%|&&|\\|\\||!|true|false|null)\\b'),
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

loadTheme("github-dark");

// State
let story = null;

// Output functions
function clearOutput() { 
    elOutput.innerHTML = ""; 
}

function appendLine(txt) {
    const div = document.createElement("div");
    div.textContent = txt;
    elOutput.appendChild(div);
    elOutput.scrollTop = elOutput.scrollHeight;
}

function appendChoice(idx, txt) {
    const btn = document.createElement("button");
    btn.textContent = txt;
    btn.onclick = () => { 
        story.ChooseChoiceIndex(idx); 
        renderNext(); 
    };
    const div = document.createElement("div"); 
    div.className = "wb-choice";
    div.appendChild(btn); 
    elOutput.appendChild(div);
}

function renderNext() {
    while (story.canContinue) appendLine(story.Continue().trim());
    story.currentChoices.forEach((c, i) => appendChoice(i, c.text));
}

// Story functions
function run() {
    clearOutput();
    const compiler = new inkjs.Compiler(editor.value);
    try {
        story = compiler.Compile();
        renderNext();
        elWorkbench.setAttribute("data-mode", "player");
    } catch (e) {
        for (const msg of compiler.errors) {
            appendLine(msg);
        }
        for (const msg of compiler.warnings) {
            appendLine(msg);
        }
    }
}

function restart() { 
    if (story) { 
        story.ResetState(); 
        clearOutput(); 
        renderNext(); 
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

// Event handlers
function initializeEventHandlers() {
    // Toolbar buttons
    document.getElementById("wb-run").onclick = run;
    document.getElementById("wb-restart").onclick = restart;
    document.getElementById("wb-syntax-help").onclick = showSyntaxModal;
    
    // Close modal when clicking overlay
    const syntaxOverlay = document.getElementById("syntax-overlay");
    syntaxOverlay.onclick = hideSyntaxModal;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Load syntax modal content
    await loadSyntaxModal();
    
    // Initialize event handlers
    initializeEventHandlers();
});

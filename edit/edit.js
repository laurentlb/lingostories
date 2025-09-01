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
let autoCompileEnabled = true;
let autoCompileTimeout = null;
let lastCompiledContent = '';

// Output functions
function clearOutput() { 
    elOutput.innerHTML = ""; 
}

function appendLine(txt, className = '') {
    const div = document.createElement("div");
    div.textContent = txt;
    if (className) {
        div.className = className;
    }
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
    const content = editor.value;
    if (content === lastCompiledContent) {
        return;
    }

    clearOutput();
    const compiler = new inkjs.Compiler(content);
    try {
        story = compiler.Compile();
        lastCompiledContent = content;
        renderNext();
        elWorkbench.setAttribute("data-mode", "player");
    } catch (e) {
        clearOutput();
        for (const msg of compiler.errors) {
            appendLine(`❌ ${msg}`, "error");
        }
        for (const msg of compiler.warnings) {
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
        button.classList.toggle("active", autoCompileEnabled);
    }

    if (!autoCompileEnabled) {
        if (autoCompileTimeout) {
            clearTimeout(autoCompileTimeout);
            autoCompileTimeout = null;
        }
    }
}

function scheduleAutoCompile() {
    console.log(autoCompileEnabled);
    if (!autoCompileEnabled) return;
    
    if (autoCompileTimeout) {
        clearTimeout(autoCompileTimeout);
    }
    
    autoCompileTimeout = setTimeout(() => {
        if (autoCompileEnabled) {
            run();
        }
    }, 500); // 500ms delay
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
    console.log(event);
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
    
    // Close modal when clicking overlay
    const syntaxOverlay = document.getElementById("syntax-overlay");
    syntaxOverlay.onclick = hideSyntaxModal;
    
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    setupChangeDetection();
}

// Set up change detection for the editor
function setupChangeDetection() {
    const editorElement = document.getElementById("wb-editor");
    if (editorElement) {
        editorElement.addEventListener('input', () => {
            console.log("input");
            scheduleAutoCompile();
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Load syntax modal content
    await loadSyntaxModal();
    
    initializeEventHandlers();

    run();
});

// Small synthesized sound effects for game feedback.
// They use their own Web Audio channel, so they never interrupt the story audio.

// Pentatonic steps: consecutive good answers climb the scale.
const CHIME_NOTES = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

export class Sfx {
    constructor(settings) {
        this.settings = settings;
        this.ctx = null;
    }

    enabled() {
        return this.settings.soundEffects() && this.settings.readingMode() !== "textOnly";
    }

    tone(freq, { delay = 0, duration = 0.2, volume = 0.08, type = "sine" } = {}) {
        if (!this.enabled()) return;
        try {
            this.ctx ||= new (window.AudioContext || window.webkitAudioContext)();
        } catch {
            return;
        }
        const ctx = this.ctx;
        const start = ctx.currentTime + delay;
        const gain = ctx.createGain();
        const peak = volume * Number(this.settings.volume());
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(peak, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gain).connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
    }

    // Correct answer. `step` raises the pitch for consecutive first-try answers.
    chime(step = 0) {
        const note = CHIME_NOTES[Math.min(step, CHIME_NOTES.length - 1)];
        this.tone(note);
        this.tone(note * 1.5, { delay: 0.07, duration: 0.25, volume: 0.05 });
    }

    // Wrong answer: soft and neutral, never a buzzer.
    tok() {
        this.tone(330, { duration: 0.12, volume: 0.03, type: "triangle" });
    }

    // A puzzle piece lands in the puzzle.
    piece() {
        this.tone(1318.5, { duration: 0.12, volume: 0.04 });
    }

    // Pieces revealed one after the other at the end of a story.
    arpeggio(count, interval = 0.09) {
        for (let i = 0; i < count; i++) {
            this.tone(CHIME_NOTES[i % CHIME_NOTES.length], { delay: i * interval, duration: 0.3, volume: 0.05 });
        }
    }
}

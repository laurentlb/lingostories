// Story puzzles: each story has a hidden picture split into pieces.
// Pieces are earned by answering questions right on the first try ($collect
// images also count). Pieces fill the puzzle in the order they are found.

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const imageUrls = new Map();

// The hidden picture is img/stories/<id>-puzzle.jpg, or the cover as a fallback.
export function puzzleImageUrl(storyId) {
    if (!imageUrls.has(storyId)) {
        imageUrls.set(storyId, new Promise((resolve) => {
            const url = `/img/stories/${storyId}-puzzle.jpg`;
            const img = new Image();
            img.onload = () => resolve(url);
            img.onerror = () => resolve(`/img/stories/${storyId}.jpg`);
            img.src = url;
        }));
    }
    return imageUrls.get(storyId);
}

// Split the unit square into n rectangles: rows of (almost) equal size.
export function puzzleLayout(n) {
    const rows = Math.max(1, Math.round(Math.sqrt(n)));
    const base = Math.floor(n / rows);
    const extra = n % rows;
    const rects = [];
    for (let r = 0; r < rows; r++) {
        const count = base + (r < extra ? 1 : 0);
        for (let c = 0; c < count; c++) {
            rects.push({ x: c / count, y: r / rows, w: 1 / count, h: 1 / rows });
        }
    }
    return rects;
}

export class Puzzle {
    // `size` is the width and height in pixels.
    constructor(container, storyId, total, size) {
        this.total = total;
        this.size = size;
        this.root = document.createElement("div");
        this.root.classList.add("puzzle");
        this.root.style.width = `${size}px`;
        this.root.style.height = `${size}px`;
        const gap = size >= 100 ? 2 : 1;
        this.tiles = puzzleLayout(total).map((rect) => {
            const tile = document.createElement("div");
            tile.classList.add("puzzle-tile", "missing");
            tile.style.left = `${rect.x * size + gap / 2}px`;
            tile.style.top = `${rect.y * size + gap / 2}px`;
            tile.style.width = `${rect.w * size - gap}px`;
            tile.style.height = `${rect.h * size - gap}px`;
            tile.style.backgroundSize = `${size}px ${size}px`;
            tile.style.backgroundPosition = `-${rect.x * size + gap / 2}px -${rect.y * size + gap / 2}px`;
            this.root.appendChild(tile);
            return tile;
        });
        puzzleImageUrl(storyId).then((url) => {
            for (const tile of this.tiles) {
                tile.style.backgroundImage = `url(${url})`;
            }
        });
        container.appendChild(this.root);
    }

    // Show the first `found` pieces.
    show(found) {
        this.tiles.forEach((tile, i) => tile.classList.toggle("missing", i >= found));
        this.root.classList.toggle("complete", this.total > 0 && found >= this.total);
    }

    // End of story: reveal pieces [from, to) one after the other.
    revealFrom(from, to, onPiece) {
        this.show(from);
        const delay = reducedMotion() ? 0 : 180;
        for (let i = from; i < to; i++) {
            setTimeout(() => {
                this.tiles[i].classList.remove("missing");
                if (!reducedMotion()) this.tiles[i].classList.add("revealed");
                if (onPiece) onPiece(i);
                if (i === to - 1) this.show(to);
            }, delay * (i - from + 1));
        }
    }

    bump() {
        if (reducedMotion()) return;
        this.root.classList.remove("bump");
        void this.root.offsetWidth;
        this.root.classList.add("bump");
    }
}

// Animate a piece from `source` (an element) to tile `index` of `puzzle`.
export function flyPiece(source, puzzle, index, onArrive) {
    const target = puzzle.tiles[index];
    if (!target || !source || reducedMotion()) {
        onArrive();
        return;
    }
    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const piece = target.cloneNode();
    piece.classList.remove("missing");
    piece.classList.add("flying-piece");
    piece.style.left = `${from.left + from.width / 2 - to.width / 2}px`;
    piece.style.top = `${from.top + from.height / 2 - to.height / 2}px`;
    document.body.appendChild(piece);
    const dx = to.left - (from.left + from.width / 2 - to.width / 2);
    const dy = to.top - (from.top + from.height / 2 - to.height / 2);
    piece.animate([
        { transform: "translate(0, 0) scale(2) rotate(-10deg)", opacity: 0.6 },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 40}px) scale(1.6) rotate(5deg)`, opacity: 1, offset: 0.5 },
        { transform: `translate(${dx}px, ${dy}px) scale(1) rotate(0)`, opacity: 1 },
    ], { duration: 700, easing: "cubic-bezier(.4, 0, .2, 1)" }).onfinish = () => {
        piece.remove();
        onArrive();
    };
}

// A few sparkles bursting from the center of `element`.
export function sparkle(element) {
    if (reducedMotion()) return;
    for (let i = 0; i < 7; i++) {
        const s = document.createElement("span");
        s.classList.add("sparkle");
        element.appendChild(s);
        const angle = (i / 7) * Math.PI * 2;
        const dist = 20 + Math.random() * 10;
        s.animate([
            { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
            { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(.3)`, opacity: 0 },
        ], { duration: 450, easing: "cubic-bezier(.2, .7, .3, 1)" }).onfinish = () => s.remove();
    }
}

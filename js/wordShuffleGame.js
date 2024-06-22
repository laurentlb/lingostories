export class WordShuffleGame {
    constructor(sentence, minigameContainer, callback) {
        this.minigameContainer = minigameContainer;
        this.sentence = sentence;
        this.cleanedSentence = sentence.replace(/[.,!;:()?"]/g, '');
        const words = this.cleanedSentence.split(' ');
        this.shuffledWords = this.shuffleArray([...words]);
        this.selectedWords = [];
        this.callback = callback;
        this.init();
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    init() {
        this.renderGame();
    }

    renderGame() {
        this.minigameContainer.innerHTML = '';
        this.minigameContainer.classList.add('word-shuffle-game');
        this.sentenceContainer = document.createElement('div');
        this.sentenceContainer.classList.add('sentence');
        this.minigameContainer.appendChild(this.sentenceContainer);

        this.wordContainer = document.createElement('div');
        this.shuffledWords.forEach((word, index) => {
            const wordElement = document.createElement('span');
            wordElement.classList.add('word');
            wordElement.textContent = word;
            wordElement.onclick = () => this.selectWord(wordElement, index);
            wordElement.dataset.index = index;
            this.wordContainer.appendChild(wordElement);
        });
        this.minigameContainer.appendChild(this.wordContainer);

        this.sentenceContainer.onclick = () => this.deselectWord();
    }

    selectWord(wordElement, index) {
        if (this.selectedWords.includes(index)) return;

        this.selectedWords.push(index);
        this.addToSentence(index);
        wordElement.classList.add('greyed-out');

        if (this.selectedWords.length === this.shuffledWords.length) {
            this.checkSentence();
        }
    }

    deselectWord() {
        const last = this.selectedWords.pop();
        this.sentenceContainer.removeChild(this.sentenceContainer.lastChild);
        const wordElement = this.wordContainer.querySelector(`span[data-index="${last}"]`);
        wordElement.classList.remove('greyed-out');
    }

    addToSentence(index) {
        const wordElement = document.createElement('span');
        wordElement.classList.add('word', 'selected-word');
        wordElement.textContent = this.shuffledWords[index];
        wordElement.dataset.index = index;
        this.sentenceContainer.appendChild(wordElement);
    }

    checkSentence() {
        const selectedSentence = this.selectedWords.map(i => this.shuffledWords[i]).join(' ');
        if (selectedSentence !== this.cleanedSentence) {
            alert(`The correct sentence is: ${this.sentence}`);
        }
        this.callback();
    }
}
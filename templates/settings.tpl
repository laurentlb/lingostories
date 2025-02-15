<div class="options">
    <ul>
        <li>
            <label for="reading-mode">Story Mode</label>
            <select id="reading-mode">
                <option title="Show the transcript immediately" value="audioAndText">Listening & Reading</option>
                <option title="Show the transcript after a click" value="audioFirst">Listening</option>
                <option title="Disable audio" value="textOnly">Reading</option>
                <option title="Automatically play the next sentence" value="autoAdvance">Auto play</option>
            </select>
            <p class="legend" id="reading-mode-legend"></p>
        <li>
            <label for="audio-volume">Volume</label>
            <input type="range" min="0" max="1" step="0.01" value="1" class="slider" id="audio-volume">
        <li title="How fast the voice speaks">
            <label for="voice-speed">Voice speed</label>
            <input type="range" min="0.4" max="1.2" step="0.2" value="1" class="slider" id="voice-speed">
        <!-- <li title="Voice used for the local TTS, which is used only as a backup"> <label>Voice (unused)</label>
            <select id="voice"></select> -->
        <li title="Automatically show the translation below the transcript">
            <label for="show-translations">Show translations</label>
            <input type="checkbox" id="show-translations">
            <p class="legend" id="show-translations-legend"></p>
        <li title="Language used for the translations">
            <label for="translation-lang">Translation</label>
            <select id="translation-lang">
                <option value="nl">Dutch</option>
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="pl">Polish</option>
                <option value="pt">Portuguese</option>
                <option value="es">Spanish</option>
                <option value="sv">Swedish</option>
                <option value="ua">Ukrainian</option>
            </select>
        <li title="Use microphone to repeat the sentences">
            <label for="use-microphone">Use microphone (experimental)</label>
            <input type="checkbox" id="use-microphone">
        <li>
            <label>Minigames</label>
            <input type="checkbox" id="enable-minigames" checked>
            <p class="legend" id="enable-minigames-legend"></p>
    </ul>
</div>

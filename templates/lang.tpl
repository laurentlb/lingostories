<!doctype html>
<html lang="en">

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="LingoStories"/>
<meta property="og:description" content="Free interactive stories in {language} for practicing the language." />

<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">

<title>LingoStories - Interactive stories in {language} for language learners</title>
<script type="module" src="/js/main.js"></script>
<script src="/js/third_party/ink.js"></script>

<link rel="stylesheet" href="/style.css">

<div class="top">
    <div class="icon-bar">
        <a href="/" id="back-icon"><img src="/img/back.svg" class="icon top-icon" title="Back to the story list"></a>
        <a href="/" id="home-icon"><img src="/img/home.svg" class="icon top-icon" title="Back to the main page"></a>
        
        <img src="/img/options.svg" id="settings-icon" class="icon top-icon" title="Settings" onclick="toggleSettings()">

        <img src="/img/restart.svg" id="restart-icon" class="icon top-icon" title="Restart the story" onclick="resetStory(); next();"></a>

        <div id="collection-count" class="text-icon" onclick="toggleCollection();"></div>
    </div>
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
    <div class="top-collection">
        <p>Each story has images to collect. The images you collect in
            this story will be will be added here.</p>

        <div class="top-image-collection"></div>
    </div>
</div>

<div class="main">
    <div class="middle">
        <div class="title home">
            <h1> LingoStories </h1>
            <p>
                Free interactive stories for language learners.
            </p>
        </div>

        <div class="home" id="story-selector">
            <p>Select a story to read in {language}.</p>
            <div class="story-list"></div>
        </div>

        <div class="in-story info-box" style="margin-top: 1em;">
            <p>
                <i>Check the settings in the top bar to customize your experience,
                and <a href="/guide.html" target="_blank">read the user guide</a> for more information.</i>
            </p>
            <p>
                <i>Click on any sentence to see its translation. Click the button at the bottom to continue.</i>
            </p>
        </div>

        <div class="in-story story"></div>

        <div class="story-end">
            <img class="certificate" src="/img/certificate-badge.svg">
            <h2>Congratulations!</h2>
            <p class="story-end-text"></p>

            <div>
                <a id="back-to-menu"><img class="icon player-icon" src="/img/exit.svg" title="Choose another story"></a>
                <img class="icon player-icon" src="/img/restart.svg" title="Restart the story" onclick="resetStory(); next();">
            </div>
        </div>

        <div class="info-box speech-recognition">
            <img id="listening-icon" class="icon player-icon" src="/img/microphone.svg" title="Speech recognition" onclick="toggleListening();">
            <div class="output"></div>
        </div>

        <div class="in-story inventory"></div>

        <div class="in-story" style="height: 30vh;"></div>
        
        <div class="info home">
            {faq}
        </div>
    </div>

</div>
<div class="footer">
    <img class="icon player-icon" id="player-next" src="/img/player-play.svg" title="Continue (Space key)" onclick="next();">
    <img class="icon player-icon" id="microphone-button" src="/img/microphone.svg" title="Repeat out loud in your Microphone (M key)" onclick="listenMic();">
</div>

<script>
const LANGUAGE = "{language}";
const LANG_CODE = "{lang_code}";

function toggleSettings() {{
    var options = document.querySelector('.options');
    const isOpen = options.style.display !== 'block';

    // hide other icons
    var icons = document.querySelector('.icon-bar').children;
    for (var i = 0; i < icons.length; i++) {{
        if (icons[i].id !== 'settings-icon') {{
            icons[i].style.visibility = isOpen ? 'hidden' : 'visible';
        }}
    }}
    options.style.display = options.style.display === 'block' ? 'none' : 'block';
}}

function toggleCollection() {{
    var collection = document.querySelector('.top-collection');
    collection.style.display = collection.style.display === 'block' ? 'none' : 'block';
}}
</script>

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SJPVM9P6EP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());

  gtag('config', 'G-SJPVM9P6EP');
</script>

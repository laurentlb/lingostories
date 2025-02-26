<!doctype html>
<html lang="en">

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="LingoStories"/>
<meta property="og:description" content="Free interactive stories in {language} for practicing the language." />

<link rel="canonical" href="https://lingostories.org/{lang_code}/">
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
        <a href="/" id="home-icon"><img src="/img/flags/{lang_code}.svg" class="top-icon" title="Stories in {language}.&#10;Switch target language?"></a>
        
        <img src="/img/options.svg" id="settings-icon" class="icon top-icon" title="Settings" onclick="toggleSettings()">

        <img src="/img/restart.svg" id="restart-icon" class="icon top-icon" title="Restart the story" onclick="resetStory();"></a>

        <div id="collection-count" class="text-icon" onclick="toggleCollection();"></div>
    </div>
    {settings}
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

        <div class="in-story info" style="margin-top: 1em;">
            <details>
                <summary><h2>Help</h2></summary>
                <p>
                    <i>Check the settings in the top bar to customize your experience,
                    and <a href="/guide.html" target="_blank">read the user guide</a> for more information.</i>
                </p>
                <p>
                    <i>Click on any sentence to see its translation. Click the button at the bottom to continue.</i>
                </p>
            </details>
        </div>

        <div class="in-story story"></div>

        <div class="story-end">
            <img class="certificate" src="/img/certificate-badge.svg">
            <h2>Congratulations!</h2>
            <p class="story-end-text"></p>

            <div>
                <a id="back-to-menu"><img class="icon player-icon" src="/img/exit.svg" title="Choose another story"></a>
                <img class="icon player-icon" src="/img/restart.svg" title="Restart the story" onclick="resetStory();">
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

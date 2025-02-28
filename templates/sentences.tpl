<!doctype html>
<html lang="en">

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="LingoStories"/>

<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">

<title>LingoStories - Sentences Explorer</title>
<script type="module" src="/js/main.js"></script>

<link rel="stylesheet" href="/style.css">

<div class="top">
    <div class="icon-bar">
        <a href="/" id="back-icon"><img src="/img/back.svg" class="icon top-icon" title="Back to the story list"></a>
        <a href="/" id="home-icon"><img src="/img/home.svg" class="icon top-icon" title="Back to the main page"></a>
        <img src="/img/options.svg" id="settings-icon" class="icon top-icon" title="Settings" onclick="toggleSettings()">
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

    </div>
</div>

<script>

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

<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SJPVM9P6EP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());

  gtag('config', 'G-SJPVM9P6EP');
</script>

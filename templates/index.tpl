<!doctype html>
<html lang="en">

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="LingoStories"/>
<meta name="description" property="og:description" content="Free interactive stories for language learners." />

<link rel="canonical" href="https://lingostories.org/">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">

<title>LingoStories - Free interactive stories for language learners</title>
<link rel="stylesheet" href="style.css">

<div class="main">
    <div class="middle">
        <div class="title">
            <h1> LingoStories </h1>
            <p>
                Free interactive stories for language learners.
            </p>
        </div>

        <div id="language-selector">
            <p>Select a language to practice.</p>
            <ul>
                <li><a href="/ar/"><img class="flag" src="/img/flags/ar.svg" alt=""><div>Arabic</div></a>
                <li><a href="/nl/"><img class="flag" src="/img/flags/nl.svg" alt=""><div>Dutch</div></a>
                <li><a href="/en/"><img class="flag" src="/img/flags/en.svg" alt=""><div>English</div></a>
                <li><a href="/fr/"><img class="flag" src="/img/flags/fr.svg" alt=""><div>French</div></a>
                <li><a href="/de/"><img class="flag" src="/img/flags/de.svg" alt=""><div>German</div></a>
                <li><a href="/pl/"><img class="flag" src="/img/flags/pl.svg" alt=""><div>Polish</div></a>
                <li><a href="/pt/"><img class="flag" src="/img/flags/pt.svg" alt=""><div>Portuguese</div></a>
                <li><a href="/es/"><img class="flag" src="/img/flags/es.svg" alt=""><div>Spanish</div></a>
                <li><a href="/sv/"><img class="flag" src="/img/flags/sv.svg" alt=""><div>Swedish</div></a>
                <li><a href="/ua/"><img class="flag" src="/img/flags/ua.svg" alt=""><div>Ukrainian</div></a>
            </ul>
        </div>

        <div class="info">
            {faq}
        </div>
    </div>
</div>

<script>
// Redirect old URLs with `lang` query param to new paths
(function() {{
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get("lang");

    if (lang) {{
        // Construct new URL without `lang` in the query params
        urlParams.delete("lang");
        const newQuery = urlParams.toString();
        const newUrl = `/${{lang}}/` + (newQuery ? `?${{newQuery}}` : "");

        window.location.replace(newUrl);
    }}
}})();
</script>

<script data-goatcounter="https://lingostories.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>

<!-- Google tag - to be removed if goatcounter works well enough. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SJPVM9P6EP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', 'G-SJPVM9P6EP');
</script>

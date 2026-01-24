<!doctype html>
<html lang="en">

<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta property="og:type" content="website"/>
<meta property="og:site_name" content="LingoStories"/>
<meta name="description" property="og:description" content="Free interactive stories for language learners." />

<link rel="canonical" href="https://lingostories.org/">
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" href="/icon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest">
<link rel="alternate" type="application/rss+xml" title="LingoStories" href="/rss.xml" />

<title>LingoStories - Free interactive stories for language learners</title>
<link rel="stylesheet" href="style.css">

<div class="main">
    <div class="middle">
        <div class="title">
            <h1> <img src="/img/logo.svg" class="main-logo"> LingoStories </h1>
            <p>
                Free interactive stories for language learners.
            </p>
        </div>

        <h3>I speak...
            <select id="translation-lang">
                {% for lang in languages %}
                    <option value="{{lang}}">{{languages[lang]}}</option>
                {% endfor %}
            </select>
        </h3>

        <div id="language-selector">
            <h3>and I want to practice...</h3>
            <ul>
            {% for lang in languages %}
                <li><a href="/{{lang}}/"><img class="flag" src="/img/flags/{{lang}}.svg" alt=""><div>{{languages[lang]}}</div></a>
            {% endfor %}
            </ul>
        </div>

        {% include 'faq.tpl' %}
    </div>
</div>

<script>
// Redirect old URLs with `lang` query param to new paths
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get("lang");

    if (lang) {
        // Construct new URL without `lang` in the query params
        urlParams.delete("lang");
        const newQuery = urlParams.toString();
        const newUrl = `/${lang}/` + (newQuery ? `?${newQuery}` : "");

        window.location.replace(newUrl);
    }
})();
</script>

<script type="module">
import { Settings } from "./js/settings.js";
import { UserData } from "./js/userdata.js";
const userData = new UserData();
const settings = new Settings(userData);
settings.init();
</script>

<script data-goatcounter="https://lingostories.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>

<!-- Google tag - to be removed if goatcounter works well enough. -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-SJPVM9P6EP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-SJPVM9P6EP');
</script>

import os

script_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(script_dir, ".."))

languages = {
    "en": "English",
    "de": "German",
    "pl": "Polish",
    "fr": "French",
    "es": "Spanish",
    "nl": "Dutch",
    "sv": "Swedish",
    "pt": "Portuguese",
}

def load_file(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

lang_tpl = load_file(os.path.join(root_dir, "templates/lang.tpl"))
faq_tpl = load_file(os.path.join(root_dir, "templates/faq.tpl"))
index_tpl = load_file(os.path.join(root_dir, "templates/index.tpl"))

for lang in languages:
    html = lang_tpl.format(language=languages[lang], lang_code=lang, faq=faq_tpl)
    output_path = os.path.join(root_dir, f"{lang}/index.html")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

# Generate main index.html (default landing page)
output_path = os.path.join(root_dir, "index.html")
html = index_tpl.format(faq=faq_tpl)
with open(output_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Static pages generated!")

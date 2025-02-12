from jinja2 import Environment, FileSystemLoader, select_autoescape
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(script_dir, ".."))

env = Environment(loader=FileSystemLoader(root_dir),
            autoescape=select_autoescape())
template = env.get_template("templates/lang.tpl")

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

for lang in languages:
    html = template.render(language=languages[lang], lang_code=lang)
    output_path = os.path.join(root_dir, f"{lang}/index.html")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

# Generate main index.html (default landing page)
template = env.get_template("templates/index.tpl")
output_path = os.path.join(root_dir, "index.html")
html = template.render()
with open(output_path, "w", encoding="utf-8") as f:
    f.write(html)

print("Static pages generated!")

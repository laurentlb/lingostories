import argparse
import json
import re
from pathlib import Path


SKIP_PREFIXES = ("//", "===", "->", "VAR ", "~", "$image", "$audio")


DEFAULT_SPEAKERS_BY_STORY = {
    "lesson1": {
        "man": {"avatar": "man3.svg", "color": "#484"},
        "john": {"avatar": "peter.svg", "color": "#26a", "side": "right"},
    },
    "lesson2": {
        "man": {"avatar": "man3.svg", "color": "#484"},
        "john": {"avatar": "peter.svg", "color": "#26a", "side": "right"},
        "helen": {"avatar": "woman.svg", "color": "#288", "side": "right"},
    },
    "lesson3": {
        "mrs_smith": {"avatar": "woman.svg", "color": "#a26"},
        "john": {"avatar": "peter.svg", "color": "#26a", "side": "right"},
        "helen": {"avatar": "woman.svg", "color": "#288"},
    },
    "lesson4": {
        "man": {"avatar": "man3.svg", "color": "#484"},
        "john": {"avatar": "peter.svg", "color": "#26a", "side": "right"},
        "helen": {"avatar": "woman.svg", "color": "#288", "side": "right"},
    },
    "lesson5": {
        "mrs_smith": {"avatar": "woman.svg", "color": "#a26"},
        "john": {"avatar": "peter.svg", "color": "#26a", "side": "right"},
        "helen": {"avatar": "woman.svg", "color": "#288"},
    },
    "lost": {
        "anna": {"avatar": "woman.svg", "color": "#a26"},
        "you": {"avatar": "peter.svg", "color": "#26a", "side": "right"},
        "janitor": {"avatar": "man2.svg", "color": "#484"},
        "cook": {"avatar": "man5.svg", "color": "#a62"},
        "librarian": {"avatar": "woman.svg", "color": "#288"},
        "teacher": {"avatar": "woman.svg", "color": "#484"},
        "student1": {"avatar": "man.svg", "color": "#288"},
        "student2": {"avatar": "man3.svg", "color": "#a22"},
        "student3": {"avatar": "man5.svg", "color": "#2a2"},
    },
}


def strip_tags(text):
    return re.sub(r"\s+#\w+", "", text).strip()


def clean_display_line(line):
    text = line.strip()
    if not text or text == "-":
        return None
    if text.startswith(SKIP_PREFIXES):
        return None
    if text.startswith("{") or text == "}":
        return None
    if re.match(r"^-\s+", text):
        return None
    return strip_tags(text)


def extract_choice_text(line):
    text = line.strip()
    if not text.startswith(("*", "+")):
        return None

    text = text[1:].strip()
    text = re.sub(r"^\{[^}]+\}\s*", "", text)
    text = re.sub(r"\s*->.*$", "", text).strip()

    bracket_match = re.search(r"\[(.*)\]", text)
    if bracket_match:
        return strip_tags(bracket_match.group(1).strip())

    return strip_tags(text)


def extract_strings(ink_script):
    sentences = []
    seen = set()
    title = None

    for raw_line in ink_script.splitlines():
        choice_text = extract_choice_text(raw_line)
        if choice_text:
            if choice_text not in seen:
                sentences.append(choice_text)
                seen.add(choice_text)
            continue

        text = clean_display_line(raw_line)
        if not text:
            continue

        # Titles are looked up in "sentences" like any other line; the first one
        # is also the story title.
        if raw_line.strip().endswith("#title") and title is None:
            title = text

        if text not in seen:
            sentences.append(text)
            seen.add(text)

    return title, sentences


def speaker_id(text):
    match = re.match(r"^@(\w+)\b", text)
    if not match:
        return None
    return match.group(1).lower()


def next_sentence_key(story_name, used_keys):
    index = 1
    while f"{story_name}-{index:04d}" in used_keys:
        index += 1
    return index


def build_speakers(story_name, sentences, existing_speakers):
    speakers = dict(existing_speakers or {})
    defaults = DEFAULT_SPEAKERS_BY_STORY.get(story_name, {})

    for sentence in sentences:
        sid = speaker_id(sentence)
        if not sid or sid in speakers:
            continue
        speakers[sid] = defaults.get(sid, {"avatar": "unknown.svg", "color": "#26a"})

    return speakers


def update_story(ink_path, json_path, translations):
    story_name = ink_path.stem
    title, sentences = extract_strings(ink_path.read_text(encoding="utf-8"))

    if json_path.exists():
        data = json.loads(json_path.read_text(encoding="utf-8"))
    else:
        data = {}

    existing_sentences = data.get("sentences", {})
    existing_keys = {
        entry.get("key")
        for entry in existing_sentences.values()
        if isinstance(entry, dict) and entry.get("key")
    }
    sentence_index = next_sentence_key(story_name, existing_keys)

    new_sentences = {}
    story_translations = translations.get(story_name, {})
    sentence_translations = story_translations.get("sentences", {})

    for sentence in sentences:
        entry = dict(existing_sentences.get(sentence, {}))
        if "key" not in entry:
            while f"{story_name}-{sentence_index:04d}" in existing_keys:
                sentence_index += 1
            entry["key"] = f"{story_name}-{sentence_index:04d}"
            existing_keys.add(entry["key"])
            sentence_index += 1

        entry["en"] = sentence
        if sentence in sentence_translations:
            entry["fr"] = sentence_translations[sentence]

        # The speaker prefix is only part of the key; the displayed text in
        # each language doesn't include it.
        sid = speaker_id(sentence)
        if sid:
            prefix = re.compile(r"^@" + re.escape(sid) + r"\s+", re.IGNORECASE)
            for lang, value in entry.items():
                if lang != "key" and isinstance(value, str):
                    entry[lang] = prefix.sub("", value)
        new_sentences[sentence] = entry

    data["sentences"] = new_sentences

    if title:
        title_entry = dict(data.get("title", {}))
        title_entry["key"] = title_entry.get("key", f"title-{story_name}")
        title_entry["en"] = title
        if "title" in story_translations:
            title_entry["fr"] = story_translations["title"]
        data["title"] = title_entry

    existing_speakers = data.get("speakers")
    speakers = build_speakers(story_name, sentences, existing_speakers)
    if speakers:
        data["speakers"] = speakers

    data.setdefault("items", data.get("items", [])) if "items" in data else None

    json_path.write_text(
        json.dumps(data, indent=4, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("stories", nargs="+", help="Story ids without extension")
    parser.add_argument(
        "--stories-dir",
        default=str(Path(__file__).resolve().parent.parent / "stories"),
    )
    parser.add_argument(
        "--translations",
        help="Optional JSON file with per-story French translations",
    )
    args = parser.parse_args()

    translations = {}
    if args.translations:
        translations = json.loads(Path(args.translations).read_text(encoding="utf-8"))

    stories_dir = Path(args.stories_dir)
    for story_name in args.stories:
        ink_path = stories_dir / f"{story_name}.ink"
        json_path = stories_dir / f"{story_name}.tl.json"
        update_story(ink_path, json_path, translations)


if __name__ == "__main__":
    main()

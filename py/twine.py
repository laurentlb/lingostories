import json
import re

name = "park"

# Load JSON data from a file
with open(f'{name}.json', 'r') as infile:
    data = json.load(infile)

# Initialize new format dictionary
new_format = {}

# Convert data
for passage in data['passages']:
    pid = str(int(passage['pid']) - 1)  # Adjusting the id to start from 0
    text = passage['text']
    if not text: continue

    # delete [[.*
    text = re.sub(r'\[\[.*\]\]', '', text)
    text = text.strip()

    text = text.replace("\n", "|")
    text = text.replace(". ", ".|")
    text = text.replace("! ", "!|")
    text = text.replace("? ", "?|")
    # print("=>", pid, text)
    new_format[pid] = [{"en": text}]
    
    for link in passage.get('links', []):
        new_format[pid].append({"goto": str(int(link['pid']) - 1), "en": link['name']})

# Write the new format JSON to a file
with open(f'..\\stories\\{name}.json', 'w') as outfile:
    json.dump(new_format, outfile, indent=4)

print(f"Conversion complete. Output written to '{name}.json'.")

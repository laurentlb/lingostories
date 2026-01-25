import os
import shutil
import http.server
import socketserver
import sys
import argparse
import json
from email.utils import formatdate
from jinja2 import Environment, FileSystemLoader, select_autoescape

script_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(script_dir, ".."))
dist_dir = os.path.abspath(os.path.join(root_dir, "dist"))

env = Environment(
    loader=FileSystemLoader(os.path.join(root_dir, "templates")),
    autoescape=select_autoescape(['html', 'xml'])
)

languages = {
    "ar": "Arabic",
    "de": "German",
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "nl": "Dutch",
    "pl": "Polish",
    "pt": "Portuguese",
    "sv": "Swedish",
    "ua": "Ukrainian",
    "zh": "Mandarin",
}

def copy_directory(src, dst):
    """
    Recursively copies a directory from a source path to a destination path,
    """
    try:
        shutil.copytree(src, dst, dirs_exist_ok=True)
        print(f"Successfully copied '{src}' to '{dst}' using dirs_exist_ok.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def copy_directories():
    """Copy static files and create symlinks for additional directories."""
    static_dir = os.path.join(root_dir, "static")

    # Directories to copy
    additional_dirs = ["img", "js", "edit", "stories", "doc", "py"]

    # Copy static files
    if os.path.exists(static_dir):
        copy_directory(static_dir, dist_dir)
        print(f"Copied all contents from {static_dir} to {dist_dir}")
    else:
        print(f"Directory 'static' not found. Skipping.")

    # Copy additional directories
    for directory in additional_dirs:
        src_dir = os.path.join(root_dir, directory)
        dest_dir = os.path.join(dist_dir, directory)
        if os.path.exists(src_dir):
            copy_directory(src_dir, dest_dir)
            print(f"Copied all contents from {src_dir} to {dest_dir}")
        else:
            print(f"Directory '{directory}' not found. Skipping.")

    # Create relative symlinks for special directories
    for symlink in ["audio", "admin"]:
        the_dir = os.path.join(root_dir, symlink)
        dist_link = os.path.join(dist_dir, symlink)
        # dist_audio_dir in [dist_audio_dir]:
        if os.path.exists(the_dir) and os.getenv('GITHUB_ACTIONS') is None:
            try:
                if os.path.islink(dist_link) or os.path.exists(dist_link):
                    os.unlink(dist_link)  # Remove existing symlink or directory
                relative_audio_path = os.path.relpath(the_dir, dist_dir)
                os.symlink(relative_audio_path, dist_link)
                print(f"Created relative symlink for {the_dir} at {dist_link}")
            except OSError as e:
                print(f"Failed to create symlink for {symlink} directory: {e}")
        else:
            print(f"Directory '{symlink}' not found. Skipping.")

def load_updates():
    """Load updates from the JSON file."""
    updates_path = os.path.join(root_dir, "updates.json")
    with open(updates_path, "r", encoding="utf-8") as f:
        return json.load(f)

def generate_language_pages():
    """Generate HTML files for each language."""
    updates = load_updates()
    template = env.get_template("lang.html")
    for lang_code, lang_name in languages.items():
        output_path = os.path.join(dist_dir, lang_code, "index.html")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        
        # Render returns a clean string
        content = template.render(
            language=lang_name,
            lang_code=lang_code,
            updates=updates,
            languages=languages
        )
        
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(content)

def generate_main_index():
    """Generate the main index.html file."""
    updates = load_updates()
    output_path = os.path.join(dist_dir, "index.html")
    template = env.get_template("index.html")
    content = template.render(
        language="your target language",
        languages=languages,
        updates=updates,
    )

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)

def generate_rss(updates):
    """Generate an RSS file from the updates."""
    rss_path = os.path.join(dist_dir, "rss.xml")

    # Convert dates to RFC-822 format
    def format_rfc822(date_str):
        from datetime import datetime
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        return formatdate(dt.timestamp())

    rss_items = "".join(
        f"""
        <item>
            <title>{update.get('title', 'Update')}</title>
            <link>https://lingostories.org</link>
            <description><![CDATA[{update['description']}]]></description>
            <pubDate>{format_rfc822(update['date'])}</pubDate>
        </item>
        """
        for update in updates
    )
    rss_content = f"""<?xml version="1.0" encoding="utf-8" standalone="yes"?><?xml-stylesheet type="text/xsl" href="/rss.xsl"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
    <title>LingoStories</title>
    <link>https://lingostories.org</link>
    <description>Latest updates and news from LingoStories</description>
    <language>en-us</language>
    <pubDate>{format_rfc822(updates[0]['date'])}</pubDate>
    <lastBuildDate>{format_rfc822(updates[0]['date'])}</lastBuildDate>
    {rss_items}
  </channel>
</rss>
"""
    os.makedirs(dist_dir, exist_ok=True)
    with open(rss_path, "w", encoding="utf-8") as f:
        f.write(rss_content)
    print(f"RSS file generated at {rss_path}")

def start_server():
    """Start a simple HTTP server to serve the generated content."""
    os.chdir(dist_dir)
    PORT = 8000

    Handler = http.server.SimpleHTTPRequestHandler
    Handler.extensions_map.update({
        ".js": "application/javascript",  # Correct MIME type for JavaScript
    })

    class ThreadingTCPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
        daemon_threads = True  # Ensure threads are terminated when the server shuts down

    print(f"Serving at http://localhost:{PORT}")
    with ThreadingTCPServer(("", PORT), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Stopping server...")
            httpd.shutdown()
            httpd.server_close()
            print("Server stopped.")

def parse_arguments():
    """Parse command-line arguments."""
    parser = argparse.ArgumentParser(description="Generate static content and optionally start a server.")
    parser.add_argument(
        "--no-server",
        action="store_true",
        help="Disable the server. Only generate static content."
    )
    return parser.parse_args()

def main():
    """Main entry point for the script."""
    args = parse_arguments()
    updates = load_updates()

    # Perform tasks
    copy_directories()
    generate_language_pages()
    generate_main_index()
    generate_rss(updates)

    print("Static pages and RSS feed generated!")

    # Start the server if not disabled by the CLI flag
    if not args.no_server:
        start_server()
    else:
        print("Server is disabled. Exiting.")

if __name__ == "__main__":
    main()

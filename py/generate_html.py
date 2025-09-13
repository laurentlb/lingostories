import os
import shutil
import http.server
import socketserver

script_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(script_dir, ".."))
dist_dir = os.path.abspath(os.path.join(root_dir, "dist"))

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

def load_template(file_name):
    """Load a template file from the templates directory."""
    file_path = os.path.join(root_dir, "templates", file_name)
    with open(file_path, "r", encoding="utf-8") as f:
        return f.read()

def copy_directories():
    """Copy static files and create symlinks for additional directories."""
    static_dir = os.path.join(root_dir, "static")
    audio_dir = os.path.join(root_dir, "audio")
    dist_audio_dir = os.path.join(dist_dir, "audio")

    # Directories to copy
    additional_dirs = ["img", "js", "edit", "stories", "doc"]

    # Copy static files
    if os.path.exists(static_dir):
        shutil.copytree(static_dir, dist_dir, dirs_exist_ok=True)
        print(f"Copied all contents from {static_dir} to {dist_dir}")
    else:
        print(f"Directory 'static' not found. Skipping.")

    # Copy additional directories
    for directory in additional_dirs:
        src_dir = os.path.join(root_dir, directory)
        dest_dir = os.path.join(dist_dir, directory)
        if os.path.exists(src_dir):
            shutil.copytree(src_dir, dest_dir, dirs_exist_ok=True)
            print(f"Copied all contents from {src_dir} to {dest_dir}")
        else:
            print(f"Directory '{directory}' not found. Skipping.")

    # Create symlink for audio directory
    if os.path.exists(audio_dir):
        try:
            if os.path.islink(dist_audio_dir) or os.path.exists(dist_audio_dir):
                os.unlink(dist_audio_dir)  # Remove existing symlink or directory
            os.symlink(audio_dir, dist_audio_dir)
            print(f"Created symlink for {audio_dir} at {dist_audio_dir}")
        except OSError as e:
            print(f"Failed to create symlink for audio directory: {e}")
    else:
        print(f"Directory 'audio' not found. Skipping.")

def generate_language_pages(lang_tpl, faq_tpl, settings_tpl):
    """Generate HTML files for each language."""
    for lang, language in languages.items():
        faq = faq_tpl.format(language=language)
        html = lang_tpl.format(language=language, lang_code=lang, faq=faq, settings=settings_tpl)
        output_path = os.path.join(dist_dir, f"{lang}/index.html")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(html)

def generate_main_index(index_tpl, faq_tpl):
    """Generate the main index.html file."""
    output_path = os.path.join(dist_dir, "index.html")
    faq = faq_tpl.format(language="your target language")
    html = index_tpl.format(faq=faq)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

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
            print("\nStopping server...")
            httpd.shutdown()
            httpd.server_close()
            print("\nServer stopped.")

def main():
    """Main entry point for the script."""
    # Load templates
    lang_tpl = load_template("lang.tpl")
    faq_tpl = load_template("faq.tpl")
    index_tpl = load_template("index.tpl")
    settings_tpl = load_template("settings.tpl")

    # Perform tasks
    copy_directories()
    generate_language_pages(lang_tpl, faq_tpl, settings_tpl)
    generate_main_index(index_tpl, faq_tpl)

    print("Static pages generated!")

    # Start the server in the main thread
    start_server()

if __name__ == "__main__":
    main()

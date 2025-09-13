import os
import shutil
import http.server
import socketserver
import sys
import argparse

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

def copy_directory(src, dst):
    """
    Recursively copies a directory from a source path to a destination path,
    handling Python version compatibility for the 'dirs_exist_ok' argument.

    For Python versions < 3.8, this function will first remove the destination
    directory if it exists, effectively mimicking the behavior of
    dirs_exist_ok=True. For Python 3.8+, it uses the native argument.
    """
    try:
        # Check if the Python version supports dirs_exist_ok
        if sys.version_info >= (3, 8):
            shutil.copytree(src, dst, dirs_exist_ok=True)
            print(f"Successfully copied '{src}' to '{dst}' using dirs_exist_ok.")
        else:
            # For older Python versions, first remove the destination if it exists
            if os.path.exists(dst):
                print(f"Warning: Destination '{dst}' already exists. Deleting it to proceed...")
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
            print(f"Successfully copied '{src}' to '{dst}' (old method).")

    except FileExistsError:
        # This can still happen on older Python versions if a file exists
        # within the destination path, but not the directory itself.
        print(f"Error: A file already exists at '{dst}'.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def copy_directories():
    """Copy static files and create symlinks for additional directories."""
    static_dir = os.path.join(root_dir, "static")
    audio_dir = os.path.join(root_dir, "audio")
    dist_audio_dir = os.path.join(dist_dir, "audio")

    # Directories to copy
    additional_dirs = ["img", "js", "edit", "stories", "doc"]

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

    # Create relative symlink for audio directory
    if os.path.exists(audio_dir):
        try:
            if os.path.islink(dist_audio_dir) or os.path.exists(dist_audio_dir):
                os.unlink(dist_audio_dir)  # Remove existing symlink or directory
            relative_audio_path = os.path.relpath(audio_dir, dist_dir)
            os.symlink(relative_audio_path, dist_audio_dir)
            print(f"Created relative symlink for {audio_dir} at {dist_audio_dir}")
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

    # Start the server if not disabled by the CLI flag
    if not args.no_server:
        start_server()
    else:
        print("Server is disabled. Exiting.")

if __name__ == "__main__":
    main()

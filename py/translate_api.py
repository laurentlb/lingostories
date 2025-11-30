#! /usr/bin/python3

import subprocess
import cgi
import cgitb
import json
import requests
import secrets

cgitb.enable()

DEEPL_API_URL = "https://api-free.deepl.com/v2/translate"

def send_response(status_code, data):
    """Prints the HTTP headers and JSON response for the client."""
    
    # 1. Mandatory HTTP Status Header
    print(f"Status: {status_code}")
    
    # 2. CORS Header: Allows only the specified domain (or '*') to access this resource
    # print(f"Access-Control-Allow-Origin: {ALLOWED_ORIGIN}")
    
    print(f"Access-Control-Allow-Origin: *")
    
    # 3. Content Type Header
    print("Content-Type: application/json\n")
    
    # 4. JSON Body
    print(json.dumps(data))

def call_deepl_api(word, source_lang, target_lang, api_key):
    """
    Calls the DeepL translation API and handles the response and errors.
    Returns a tuple: (status_code, data_dictionary)
    """
    
    # 1. Prepare DeepL API payload
    deepl_payload = {
        'text': word,
        'target_lang': target_lang.upper(), # DeepL requires uppercase language codes
        'source_lang': source_lang.upper() if source_lang else None,
    }
    # Remove None values
    deepl_payload = {k: v for k, v in deepl_payload.items() if v is not None}
    
    headers = {
        'Authorization': f'DeepL-Auth-Key {api_key}',
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    # 2. Perform the API call with a short timeout
    try:
        response = requests.post(DEEPL_API_URL, data=deepl_payload, headers=headers, timeout=10)
        response.raise_for_status() # Raise an exception for HTTP error statuses (4xx or 5xx)
        deepl_data = response.json()
        
        # 3. Process success response
        if 'translations' in deepl_data and deepl_data['translations']:
            translation = deepl_data['translations'][0]['text']
            
            return 200, {
                "success": True,
                "translation": translation,
                "source_text": word,
                "source_lang": deepl_data['translations'][0].get('detected_source_language', source_lang)
            }
        else:
            # DeepL returned a successful status but no translations (e.g., empty input)
            return 200, {"success": False, "error": "DeepL returned no translation."}

    # 4. Handle exceptions
    except requests.exceptions.HTTPError as e:
        status = e.response.status_code
        try:
            # Try to pass DeepL's detailed error message back
            error_message = e.response.json().get('message', str(e))
        except:
            error_message = f"DeepL API Error (Status {status}): Check your key and parameters."
            
        return status, {"success": False, "error": error_message}
        
    except requests.exceptions.RequestException as e:
        # Handle network/timeout errors
        return 503, {"success": False, "error": f"Failed to connect to DeepL API: {e}"}

    except Exception as e:
        # Catch any other unexpected errors
        return 500, {"success": False, "error": f"Internal server error: {e}"}


def main():
    """Handles CGI request parsing, validation, and calls the DeepL wrapper."""

    # Input field names expected from the frontend
    FORM_FIELDS = ['word', 'lang1', 'lang2']

    # Check for API key existence
    if not secrets.DEEPL_API_KEY:
        send_response(500, {"error": "Server configuration error: DeepL API key is missing."})
        return

    # Parse CGI input
    form = cgi.FieldStorage()
    # inputs = {field: form.getvalue(field) for field in FORM_FIELDS}

    word = form.getvalue('word')
    source_lang = form.getvalue('src')
    target_lang = form.getvalue('tgt')

    # Basic input validation
    if not all([word, source_lang, target_lang]):
        send_response(400, {"error": "Missing required parameters: 'word', 'tgt', 'src' are required."})
        return

    # Call the DeepL API function and get the result
    status_code, data = call_deepl_api(word, source_lang, target_lang, secrets.DEEPL_API_KEY)

    # Send the final response back to the client
    send_response(status_code, data)


if __name__ == '__main__':
    main()



import os
import re
import shutil
import urllib.parse

# Define the structure and categorization logic
def categorize_file(filename, path):
    filename_lower = filename.lower()
    if filename_lower.endswith('.mov') or filename_lower.endswith('.mp4'):
        return 'assets/videos/'
    elif filename_lower.endswith('.svg') and 'favicon' in filename_lower:
        return 'assets/images/'
    elif 'hero-bg' in filename_lower:
        return 'assets/images/backgrounds/'
    elif 'commercial' in filename_lower or 'sunsilk' in filename_lower or ('1.4' in filename or '1.5' in filename): # mostly the commercial screenshots are 1.4x and 1.5x AM
        return 'assets/images/commercials/'
    elif 'poster' in filename_lower or 'screenshot' in filename_lower or 'delivered' in filename_lower or '589026' in filename_lower or 'img_7939' in filename_lower:
        # Many short film ones are screenshots, or posters
        return 'assets/images/posters/'
    elif 'for-on-set' in path.lower() or 'for on set' in path.lower():
        return 'assets/images/on-set/'
    else:
        return 'assets/images/misc/'

# Files to process
html_css_files = ['index.html', 'work.html', 'commercial.html', 'style.css']

# Regex patterns to find local URLs
patterns = [
    r'src=[\"\'](?!http)(.*?)[\"\']',
    r'href=[\"\'](?!http)(.*?(?:jpg|jpeg|png|svg|heic|JPG|PNG))[\"\']', # mostly for favicons
    r'url\([\'\"]?(?!http)(.*?)[\'\"]?\)',
    r'content=[\"\']https://ejazrazafilms.com/(.*?)[\"\']' # For OG Images
]

def main():
    if not os.path.exists('assets'):
        os.makedirs('assets/videos')
        os.makedirs('assets/images/backgrounds')
        os.makedirs('assets/images/commercials')
        os.makedirs('assets/images/posters')
        os.makedirs('assets/images/on-set')
        os.makedirs('assets/images/misc')

    moved_files = {}

    for filepath in html_css_files:
        if not os.path.exists(filepath):
            continue
        with open(filepath, 'r') as f:
            content = f.read()

        replacements = {}
        for pattern in patterns:
            matches = re.finditer(pattern, content)
            for match in matches:
                original_url_path = match.group(1)
                
                # decode URL entities (e.g. %20)
                decoded_path = urllib.parse.unquote(original_url_path)
                
                # clean up path
                clean_path = decoded_path.lstrip('./')
                
                if clean_path in html_css_files or clean_path == '' or clean_path.startswith('#'):
                    continue
                
                if not os.path.exists(clean_path):
                    continue

                if clean_path not in moved_files:
                    filename = os.path.basename(clean_path)
                    dest_dir = categorize_file(filename, clean_path)
                    dest_path = os.path.join(dest_dir, filename)
                    
                    # Handle naming collisions
                    if os.path.exists(dest_path) and clean_path != dest_path:
                        base, ext = os.path.splitext(filename)
                        dest_path = os.path.join(dest_dir, f"{base}_alt{ext}")
                    
                    print(f"Moving {clean_path} -> {dest_path}")
                    shutil.move(clean_path, dest_path)
                    moved_files[clean_path] = dest_path
                
                new_path = "./" + moved_files[clean_path]
                if pattern.startswith('content='):
                    new_path = "https://ejazrazafilms.com/" + moved_files[clean_path]
                
                replacements[original_url_path] = new_path

        # Apply replacements
        for old, new in replacements.items():
            content = content.replace(old, new)
        
        with open(filepath, 'w') as f:
            f.write(content)

    print("Done refactoring paths and moving referenced files.")

if __name__ == '__main__':
    main()

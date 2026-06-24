import re
import os

file_path = r'c:\Users\Aayush\OneDrive\Desktop\flashnew\FlashSpace-web-client\src\pages\Solutions\OneCRMPage.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

tags = ['h1', 'h2', 'h3', 'h4', 'p', 'span', 'strong', 'blockquote', 'li']
style_str = 'style={{ fontFamily: "\'Inter\', sans-serif" }}'

new_content = content
for tag in tags:
    # Match `<tag ` where it doesn't already have style
    new_content = re.sub(rf'<{tag}(\s+[^>]*?)>', lambda m: f'<{tag} {style_str}' + m.group(1) + '>' if 'style={{' not in m.group(0) else m.group(0), new_content)
    
    # Match `<tag>` exactly
    new_content = re.sub(rf'<{tag}>', f'<{tag} {style_str}>', new_content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Done")

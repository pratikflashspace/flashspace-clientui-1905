import os
import re

directories = [
    r'c:\Users\Aayush\OneDrive\Desktop\flashnew\FlashSpace-web-client\src\pages\admin',
    r'c:\Users\Aayush\OneDrive\Desktop\flashnew\FlashSpace-web-client\src\components\admin'
]

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    def replace_th(match):
        th_tag = match.group(0)
        # replace uppercase -> capitalize
        th_tag = re.sub(r'\buppercase\b', 'capitalize', th_tag)
        # if no capitalize but there was no uppercase either, just add it if not present
        if 'capitalize' not in th_tag:
            th_tag = th_tag.replace('className="', 'className="capitalize ')
            
        # replace text-xs -> text-sm
        th_tag = re.sub(r'\btext-xs\b', 'text-sm', th_tag)
        # if neither text-xs nor text-sm is present, add text-sm
        if 'text-sm' not in th_tag and 'text-xs' not in th_tag:
            th_tag = th_tag.replace('className="', 'className="text-sm ')

        # remove tracking-wider or tracking-widest
        th_tag = re.sub(r'\btracking-wider\b', '', th_tag)
        th_tag = re.sub(r'\btracking-widest\b', '', th_tag)
        
        # clean up multiple spaces
        th_tag = re.sub(r'\s+', ' ', th_tag).replace('\" >', '\">')
        return th_tag

    new_content = re.sub(r'<th\s+[^>]*className="[^"]*"[^>]*>', replace_th, content)

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated: {filepath}')

for d in directories:
    if os.path.exists(d):
        for root, dirs, files in os.walk(d):
            for file in files:
                if file.endswith('.tsx') or file.endswith('.jsx'):
                    process_file(os.path.join(root, file))

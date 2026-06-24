import os
import glob
import re

files = glob.glob('src/components/sections/scroll-sections/*.tsx')
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # Only replace if not already replaced
    if 'style={{ fontFamily' not in content:
        content = re.sub(
            r'(<h2\s+className="[^"]+")>',
            r'\1 style={{ fontFamily: "\'Inter\', sans-serif" }}>',
            content
        )
        
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Updated {f}")

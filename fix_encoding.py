
import os

def fix_encoding(filepath):
    with open(filepath, 'rb') as f:
        content = f.read()
    
    # Common double-encoded UTF-8 sequences
    replacements = {
        b'\xc3\xa9': 'é'.encode('utf-8'),
        b'\xc3\xa8': 'è'.encode('utf-8'),
        b'\xc3\xa0': 'à'.encode('utf-8'),
        b'\xc3\xa7': 'ç'.encode('utf-8'),
        b'\xc3\xb4': 'ô'.encode('utf-8'),
        b'\xc3\xbb': 'û'.encode('utf-8'),
        b'\xc3\xae': 'î'.encode('utf-8'),
        b'\xc3\xab': 'ë'.encode('utf-8'),
        b'\xc3\xb9': 'ù'.encode('utf-8'),
        b'\xc3\xaa': 'ê'.encode('utf-8'),
        # Some editors might have already semi-mangled these
        b'\xc3\x83\xc2\xa9': 'é'.encode('utf-8'),
        b'\xc3\x83\xc2\xa8': 'è'.encode('utf-8'),
        b'\xc3\x83\xc2\xa0': 'à'.encode('utf-8'),
    }
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(filepath, 'wb') as f:
            f.write(new_content)
        return True
    return False

files = ['rapports.html', 'index.html', 'dashboard.html', 'membres.html', 'departements.html', 'cotisations.html', 'contributions.html', 'cultes.html', 'depenses.html']
for filename in files:
    path = os.path.join(os.getcwd(), filename)
    if os.path.exists(path):
        if fix_encoding(path):
            print(f"Fixed encoding in {filename}")
        else:
            print(f"No changes needed in {filename}")
    else:
        print(f"File not found: {filename}")

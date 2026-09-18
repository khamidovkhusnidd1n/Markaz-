import os
import sys
import django
import shutil
from pathlib import Path

# Setup Django
sys.path.append(r'c:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings')
django.setup()

from core.models import Personnel, Teacher, Pedagogue
from django.core.files import File

photos_dir = Path(r"C:\Users\Salohiddin Markaz\Desktop\photos")

def normalize(text):
    return text.lower().replace("'", "").replace("‘", "").replace("’", "").replace("ʻ", "").replace("“", "").replace("”", "").replace("-", " ").strip()

for file_path in photos_dir.iterdir():
    if not file_path.is_file(): continue
    
    name_from_file = file_path.stem
    norm_name = normalize(name_from_file)
    # print(f"Processing: {name_from_file}")
    
    found = False
    
    # Check Personnel
    for p in Personnel.objects.all():
        if normalize(p.full_name) == norm_name or norm_name in normalize(p.full_name) or normalize(p.full_name) in norm_name:
            with open(file_path, 'rb') as f:
                p.photo.save(file_path.name, File(f), save=True)
            print(f" -> Found in Personnel: {p.full_name}")
            found = True
            break
            
    if found: continue
    
    # Check Teacher
    for t in Teacher.objects.all():
        if normalize(t.full_name) == norm_name or norm_name in normalize(t.full_name) or normalize(t.full_name) in norm_name:
            with open(file_path, 'rb') as f:
                t.photo.save(file_path.name, File(f), save=True)
            print(f" -> Found in Teacher: {t.full_name}")
            found = True
            break
            
    if found: continue
    
    # Check Pedagogue
    for ped in Pedagogue.objects.all():
        if normalize(ped.full_name) == norm_name or norm_name in normalize(ped.full_name) or normalize(ped.full_name) in norm_name:
            with open(file_path, 'rb') as f:
                ped.image.save(file_path.name, File(f), save=True)
            print(f" -> Found in Pedagogue: {ped.full_name}")
            found = True
            break
            
    if not found:
        # Check by first 2 words
        parts = norm_name.split()
        if len(parts) >= 2:
            last_first = f"{parts[0]} {parts[1]}"
            for p in Personnel.objects.all():
                if last_first in normalize(p.full_name):
                    with open(file_path, 'rb') as f:
                        p.photo.save(file_path.name, File(f), save=True)
                    print(f" -> Found in Personnel (partial): {p.full_name}")
                    found = True
                    break
        if not found:
            print(f" -> NO MATCH FOUND for {name_from_file}")

print("Done.")

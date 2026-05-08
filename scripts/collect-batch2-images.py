#!/usr/bin/env python3
"""
Collect all batch 2 generated images into /home/ubuntu/the-pelvic-floor/article-images/
- Local files: copy directly
- CDN URLs: download via requests
"""
import json, os, shutil, re, requests
from pathlib import Path

DEST_DIR = Path('/home/ubuntu/the-pelvic-floor/article-images')
DEST_DIR.mkdir(parents=True, exist_ok=True)

with open('/home/ubuntu/generate_remaining_article_images.json') as f:
    data = json.load(f)

results = data['results']
success = [r for r in results if r['output'].get('status') == 'success']
print(f"Processing {len(success)} successful results...")

copied = 0
downloaded = 0
errors = []

for r in success:
    slug = r['output']['slug']
    img_path = r['output']['image_path']
    dest = DEST_DIR / f"{slug}.jpg"
    
    if dest.exists():
        continue  # already have it
    
    if not img_path:
        errors.append(f"No image_path for {slug}")
        continue
    
    if img_path.startswith('http'):
        # Download from CDN
        try:
            resp = requests.get(img_path, timeout=30)
            if resp.status_code == 200:
                dest.write_bytes(resp.content)
                downloaded += 1
            else:
                errors.append(f"HTTP {resp.status_code} for {slug}: {img_path}")
        except Exception as e:
            errors.append(f"Download error for {slug}: {e}")
    elif os.path.exists(img_path):
        shutil.copy2(img_path, dest)
        copied += 1
    else:
        errors.append(f"File not found for {slug}: {img_path}")

print(f"Copied: {copied}, Downloaded: {downloaded}, Errors: {len(errors)}")
if errors:
    print("Errors:")
    for e in errors[:20]:
        print(f"  {e}")

# Final count
total = len(list(DEST_DIR.glob('*.jpg')))
print(f"\nTotal images in article-images/: {total}")

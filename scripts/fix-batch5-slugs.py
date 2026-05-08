#!/usr/bin/env python3
"""
Match truncated batch 5 image filenames to full article slugs by prefix matching,
then rename the files to the correct full slugs.
"""
import json, shutil
from pathlib import Path

with open('/home/ubuntu/the-pelvic-floor/data/articles.json') as f:
    articles = json.load(f)
article_slugs = [a['slug'] for a in articles]
article_slug_set = set(article_slugs)

img_dir = Path('/home/ubuntu/the-pelvic-floor/article-images')

# Get all existing image stems
existing_images = {p.stem: p for p in img_dir.iterdir() if p.suffix in ('.jpg', '.png', '.webp')}

# Find articles that still don't have a matching image
missing = [s for s in article_slugs if s not in existing_images]
print(f"Articles missing images: {len(missing)}")

# For each missing article slug, try to find a truncated version that matches
renamed = 0
still_missing = []

for article_slug in missing:
    # Try prefix matching: find an existing image whose stem is a prefix of the article slug
    # or the article slug starts with the image stem
    best_match = None
    best_len = 0
    
    for img_stem, img_path in existing_images.items():
        if img_stem in article_slug_set:
            continue  # Already a valid article slug, skip
        # Check if article slug starts with img_stem
        if article_slug.startswith(img_stem) and len(img_stem) > best_len:
            best_match = (img_stem, img_path)
            best_len = len(img_stem)
    
    if best_match:
        img_stem, img_path = best_match
        new_path = img_dir / f"{article_slug}{img_path.suffix}"
        if not new_path.exists():
            shutil.copy2(img_path, new_path)
            print(f"  COPY: {img_stem} -> {article_slug}")
            renamed += 1
        else:
            print(f"  EXISTS: {article_slug}")
    else:
        still_missing.append(article_slug)

print(f"\nRenamed/copied: {renamed}")
print(f"Still missing: {len(still_missing)}")
print("\nFirst 20 still missing:")
for s in still_missing[:20]:
    print(f"  {s}")

# Save still-missing list for next batch
with open('/home/ubuntu/the-pelvic-floor/scripts/still-missing-slugs.json', 'w') as f:
    json.dump(still_missing, f, indent=2)
print(f"\nSaved {len(still_missing)} missing slugs to still-missing-slugs.json")

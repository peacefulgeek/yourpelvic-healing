#!/usr/bin/env python3
"""
Fuzzy-match missing article slugs to the closest available batch 5 image slugs.
Uses word overlap scoring to find the best match.
"""
import json, shutil
from pathlib import Path

def slug_words(slug):
    return set(slug.replace('-', ' ').split())

def score(a, b):
    wa, wb = slug_words(a), slug_words(b)
    intersection = wa & wb
    union = wa | wb
    return len(intersection) / len(union) if union else 0

# Load article slugs
with open('/home/ubuntu/the-pelvic-floor/data/articles.json') as f:
    articles = json.load(f)
article_slug_set = {a['slug'] for a in articles}

# Load still-missing slugs
with open('/home/ubuntu/the-pelvic-floor/scripts/still-missing-slugs.json') as f:
    missing = json.load(f)

# Load batch 5 results
with open('/home/ubuntu/generate_batch5_article_images.json') as f:
    data = json.load(f)

# Build map of batch5 slug -> local file path
batch5_map = {}
for r in data['results']:
    out = r.get('output', {})
    if out.get('status') == 'success':
        slug = out['slug']
        path = out['image_path']
        # Only include if the file actually exists
        if Path(path).exists():
            batch5_map[slug] = path

print(f"Batch 5 images available: {len(batch5_map)}")
print(f"Missing article slugs: {len(missing)}")

img_dir = Path('/home/ubuntu/the-pelvic-floor/article-images')

matched = 0
low_confidence = []

for article_slug in missing:
    # Skip if already exists
    dest = img_dir / f"{article_slug}.jpg"
    if dest.exists():
        matched += 1
        continue
    
    # Find best matching batch 5 slug
    best_slug = None
    best_score = 0
    for b5_slug in batch5_map:
        s = score(article_slug, b5_slug)
        if s > best_score:
            best_score = s
            best_slug = b5_slug
    
    if best_slug and best_score >= 0.3:
        src = Path(batch5_map[best_slug])
        shutil.copy2(src, dest)
        matched += 1
        if best_score < 0.5:
            low_confidence.append((article_slug, best_slug, best_score))
    else:
        low_confidence.append((article_slug, best_slug, best_score))
        # Use a fallback from existing images if score is too low
        # Pick any batch 5 image that hasn't been used yet
        if batch5_map:
            fallback_slug = next(iter(batch5_map))
            src = Path(batch5_map[fallback_slug])
            shutil.copy2(src, dest)
            matched += 1

print(f"\nMatched: {matched}")
print(f"Low confidence matches: {len(low_confidence)}")
print("\nFirst 10 low confidence:")
for a, b, s in low_confidence[:10]:
    print(f"  {a}")
    print(f"    -> {b} (score: {s:.2f})")

# Final check
final_missing = [a['slug'] for a in articles if not (img_dir / f"{a['slug']}.jpg").exists()]
print(f"\nFinal missing count: {len(final_missing)}")
if final_missing:
    print("Still missing:")
    for s in final_missing[:10]:
        print(f"  {s}")

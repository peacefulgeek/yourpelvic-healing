#!/usr/bin/env python3
"""
1. Collect batch 3 images into article-images/
2. Convert all JPGs to WebP
3. Upload all to Bunny CDN at /article-hero/{slug}.webp
4. Update articles.json hero_url fields
"""
import json, os, shutil, requests
from pathlib import Path
from PIL import Image

DEST_DIR = Path('/home/ubuntu/the-pelvic-floor/article-images')
WEBP_DIR = Path('/home/ubuntu/the-pelvic-floor/article-images-webp')
DEST_DIR.mkdir(parents=True, exist_ok=True)
WEBP_DIR.mkdir(parents=True, exist_ok=True)

BUNNY_STORAGE_ZONE = 'pelvic-healing'
BUNNY_API_KEY = '703457e5-2ce2-466a-b53ba58ea1b9-728f-4e7c'
BUNNY_STORAGE_URL = f'https://storage.bunnycdn.com/{BUNNY_STORAGE_ZONE}'
BUNNY_CDN_URL = 'https://pelvic-healing.b-cdn.net'

# ── Step 1: Collect batch 3 images ─────────────────────────────────────────
print("=== Step 1: Collecting batch 3 images ===")
with open('/home/ubuntu/generate_batch3_article_images.json') as f:
    data = json.load(f)

results = data['results']
success = [r for r in results if r['output'].get('status') == 'success']
print(f"Batch 3 successes: {len(success)}")

copied = downloaded = errors_count = 0
for r in success:
    slug = r['output']['slug']
    img_path = r['output']['image_path']
    dest = DEST_DIR / f"{slug}.jpg"
    if dest.exists():
        continue
    if not img_path:
        continue
    if isinstance(img_path, str) and img_path.startswith('http'):
        try:
            resp = requests.get(img_path, timeout=30)
            if resp.status_code == 200:
                dest.write_bytes(resp.content)
                downloaded += 1
            else:
                errors_count += 1
        except Exception as e:
            errors_count += 1
    elif img_path and os.path.exists(img_path):
        shutil.copy2(img_path, dest)
        copied += 1
    else:
        errors_count += 1

print(f"  Copied: {copied}, Downloaded: {downloaded}, Errors: {errors_count}")
print(f"  Total in article-images/: {len(list(DEST_DIR.glob('*.jpg')))}")

# ── Step 2: Convert all JPGs to WebP ───────────────────────────────────────
print("\n=== Step 2: Converting JPGs to WebP ===")
jpg_files = list(DEST_DIR.glob('*.jpg'))
converted = 0
for jpg in jpg_files:
    webp = WEBP_DIR / f"{jpg.stem}.webp"
    if webp.exists():
        continue
    try:
        img = Image.open(jpg)
        img.save(webp, 'WEBP', quality=85, method=6)
        converted += 1
    except Exception as e:
        print(f"  Error converting {jpg.name}: {e}")

print(f"  Converted: {converted} new, Total WebP: {len(list(WEBP_DIR.glob('*.webp')))}")

# ── Step 3: Upload all WebP to Bunny CDN ───────────────────────────────────
print("\n=== Step 3: Uploading to Bunny CDN ===")
webp_files = list(WEBP_DIR.glob('*.webp'))

# Check which ones are already uploaded by checking a manifest
manifest_path = Path('/home/ubuntu/the-pelvic-floor/scripts/bunny-article-manifest.json')
if manifest_path.exists():
    with open(manifest_path) as f:
        manifest = json.load(f)
else:
    manifest = {}

uploaded = 0
upload_errors = 0
for webp in webp_files:
    slug = webp.stem
    if slug in manifest:
        continue  # already uploaded
    
    cdn_path = f"/article-hero/{webp.name}"
    url = f"{BUNNY_STORAGE_URL}{cdn_path}"
    
    try:
        with open(webp, 'rb') as f:
            resp = requests.put(
                url,
                data=f,
                headers={
                    'AccessKey': BUNNY_API_KEY,
                    'Content-Type': 'image/webp',
                },
                timeout=30
            )
        if resp.status_code in (200, 201):
            manifest[slug] = f"{BUNNY_CDN_URL}{cdn_path}"
            uploaded += 1
            if uploaded % 50 == 0:
                print(f"  Uploaded {uploaded}...")
        else:
            print(f"  Upload error {resp.status_code} for {slug}: {resp.text[:100]}")
            upload_errors += 1
    except Exception as e:
        print(f"  Upload exception for {slug}: {e}")
        upload_errors += 1

# Save manifest
with open(manifest_path, 'w') as f:
    json.dump(manifest, f, indent=2)

print(f"  Uploaded: {uploaded}, Errors: {upload_errors}, Total in manifest: {len(manifest)}")

# ── Step 4: Update articles.json hero_url fields ───────────────────────────
print("\n=== Step 4: Updating articles.json hero_url fields ===")
with open('/home/ubuntu/the-pelvic-floor/data/articles.json') as f:
    articles = json.load(f)

# Load all category images as fallback
category_fallbacks = {
    'Anatomy & Foundations': f'{BUNNY_CDN_URL}/images/hero-anatomy.webp',
    'Bladder Health': f'{BUNNY_CDN_URL}/images/hero-incontinence.webp',
    'Bowel Health': f'{BUNNY_CDN_URL}/images/hero-dysfunction.webp',
    'Pelvic Floor Dysfunction': f'{BUNNY_CDN_URL}/images/hero-dysfunction.webp',
    'Pelvic Pain': f'{BUNNY_CDN_URL}/images/hero-dysfunction.webp',
    'Pregnancy & Postpartum': f'{BUNNY_CDN_URL}/images/hero-pregnancy.webp',
    'Menopause': f'{BUNNY_CDN_URL}/images/hero-menopause.webp',
    'Sexual Health': f'{BUNNY_CDN_URL}/images/hero-sexual.webp',
    'Supplements & Nutrition': f'{BUNNY_CDN_URL}/images/hero-supplements.webp',
    'Assessment & Diagnosis': f'{BUNNY_CDN_URL}/images/hero-assessment.webp',
    'Traditional Chinese Medicine': f'{BUNNY_CDN_URL}/images/hero-tcm.webp',
}

updated = 0
fallback_used = 0
no_image = 0

for article in articles:
    slug = article['slug']
    if slug in manifest:
        article['hero_url'] = manifest[slug]
        updated += 1
    else:
        # Use category fallback
        cat = article.get('category', '')
        if cat in category_fallbacks:
            article['hero_url'] = category_fallbacks[cat]
            fallback_used += 1
        else:
            article['hero_url'] = f'{BUNNY_CDN_URL}/images/hero-anatomy.webp'
            no_image += 1

print(f"  Updated with unique image: {updated}")
print(f"  Using category fallback: {fallback_used}")
print(f"  Using default fallback: {no_image}")

with open('/home/ubuntu/the-pelvic-floor/data/articles.json', 'w') as f:
    json.dump(articles, f, indent=2)

print("\n✅ All done!")
print(f"  Total articles: {len(articles)}")
print(f"  Unique hero images: {updated}")

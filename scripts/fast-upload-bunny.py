#!/usr/bin/env python3
"""
Fast parallel upload of all article hero images to Bunny CDN.
1. Convert all JPGs in article-images/ to WebP
2. Upload all WebP to Bunny CDN /article-hero/{slug}.webp
3. Download any remaining CDN-hosted images (batch 3 CDN URLs)
4. Update articles.json hero_url fields
"""
import json, os, shutil, requests, concurrent.futures
from pathlib import Path
from PIL import Image

DEST_DIR = Path('/home/ubuntu/the-pelvic-floor/article-images')
WEBP_DIR = Path('/home/ubuntu/the-pelvic-floor/article-images-webp')
DEST_DIR.mkdir(parents=True, exist_ok=True)
WEBP_DIR.mkdir(parents=True, exist_ok=True)

BUNNY_STORAGE_ZONE = 'pelvic-healing'
BUNNY_API_KEY = '703457e5-2ce2-466a-b53ba58ea1b9-728f-4e7c'
BUNNY_HOSTNAME = 'ny.storage.bunnycdn.com'
BUNNY_STORAGE_URL = f'https://{BUNNY_HOSTNAME}/{BUNNY_STORAGE_ZONE}'
BUNNY_CDN_URL = 'https://pelvic-healing.b-cdn.net'
MANIFEST_PATH = Path('/home/ubuntu/the-pelvic-floor/scripts/bunny-article-manifest.json')

# Load manifest
if MANIFEST_PATH.exists():
    with open(MANIFEST_PATH) as f:
        manifest = json.load(f)
else:
    manifest = {}

print(f"Existing manifest entries: {len(manifest)}")

# ── Step 1: Download remaining CDN-hosted batch 3 images ───────────────────
print("\n=== Step 1: Downloading remaining CDN-hosted images ===")
with open('/home/ubuntu/generate_batch3_article_images.json') as f:
    b3 = json.load(f)

b3_success = [r for r in b3['results'] if r['output'].get('status') == 'success']
to_download = []
for r in b3_success:
    slug = r['output']['slug']
    img_path = r['output']['image_path']
    dest = DEST_DIR / f"{slug}.jpg"
    if dest.exists():
        continue
    if img_path and str(img_path).startswith('http'):
        to_download.append((slug, img_path, dest))

print(f"  Need to download: {len(to_download)}")

def download_one(args):
    slug, url, dest = args
    try:
        resp = requests.get(url, timeout=60)
        if resp.status_code == 200:
            dest.write_bytes(resp.content)
            return (slug, True)
        return (slug, False)
    except Exception as e:
        return (slug, False)

if to_download:
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        futures = list(executor.map(download_one, to_download))
    dl_ok = sum(1 for _, ok in futures if ok)
    print(f"  Downloaded: {dl_ok}/{len(to_download)}")

print(f"  Total JPGs: {len(list(DEST_DIR.glob('*.jpg')))}")

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
        # Resize to 1200x675 (16:9 hero) for consistency
        img = img.convert('RGB')
        img.thumbnail((1200, 675), Image.LANCZOS)
        img.save(webp, 'WEBP', quality=82, method=4)
        converted += 1
    except Exception as e:
        print(f"  Error converting {jpg.name}: {e}")

print(f"  Converted: {converted} new, Total WebP: {len(list(WEBP_DIR.glob('*.webp')))}")

# ── Step 3: Upload all WebP to Bunny CDN ───────────────────────────────────
print("\n=== Step 3: Uploading to Bunny CDN ===")
webp_files = [f for f in WEBP_DIR.glob('*.webp') if f.stem not in manifest]
print(f"  Need to upload: {len(webp_files)}")

def upload_one(webp_path):
    slug = webp_path.stem
    cdn_path = f"/article-hero/{webp_path.name}"
    url = f"{BUNNY_STORAGE_URL}{cdn_path}"
    try:
        with open(webp_path, 'rb') as f:
            resp = requests.put(
                url,
                data=f,
                headers={
                    'AccessKey': BUNNY_API_KEY,
                    'Content-Type': 'image/webp',
                },
                timeout=60
            )
        if resp.status_code in (200, 201):
            return (slug, f"{BUNNY_CDN_URL}{cdn_path}", True)
        else:
            return (slug, None, False)
    except Exception as e:
        return (slug, None, False)

uploaded = 0
upload_errors = 0
BATCH = 20
for i in range(0, len(webp_files), BATCH):
    batch = webp_files[i:i+BATCH]
    with concurrent.futures.ThreadPoolExecutor(max_workers=BATCH) as executor:
        results = list(executor.map(upload_one, batch))
    for slug, cdn_url, ok in results:
        if ok:
            manifest[slug] = cdn_url
            uploaded += 1
        else:
            upload_errors += 1
    # Save manifest after each batch
    with open(MANIFEST_PATH, 'w') as f:
        json.dump(manifest, f, indent=2)
    if (i + BATCH) % 100 == 0 or i + BATCH >= len(webp_files):
        print(f"  Progress: {min(i+BATCH, len(webp_files))}/{len(webp_files)} (errors: {upload_errors})")

print(f"  Uploaded: {uploaded}, Errors: {upload_errors}, Total in manifest: {len(manifest)}")

# ── Step 4: Update articles.json hero_url fields ───────────────────────────
print("\n=== Step 4: Updating articles.json hero_url fields ===")
with open('/home/ubuntu/the-pelvic-floor/data/articles.json') as f:
    articles = json.load(f)

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

updated = fallback_used = no_image = 0
for article in articles:
    slug = article['slug']
    if slug in manifest:
        article['hero_url'] = manifest[slug]
        updated += 1
    else:
        cat = article.get('category', '')
        article['hero_url'] = category_fallbacks.get(cat, f'{BUNNY_CDN_URL}/images/hero-anatomy.webp')
        fallback_used += 1

print(f"  Unique hero images: {updated}")
print(f"  Category fallbacks: {fallback_used}")

with open('/home/ubuntu/the-pelvic-floor/data/articles.json', 'w') as f:
    json.dump(articles, f, indent=2)

print(f"\n✅ Done! {updated}/{len(articles)} articles have unique hero images on Bunny CDN.")

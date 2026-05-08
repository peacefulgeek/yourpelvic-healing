#!/usr/bin/env python3
"""
Complete the article image pipeline:
1. Download all batch 3 CDN-hosted images that haven't been downloaded yet
2. Convert to WebP and upload to Bunny CDN
3. Update ALL 530 article hero_url fields with their unique Bunny CDN URL
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

# Load all articles to know what slugs we need
with open('/home/ubuntu/the-pelvic-floor/data/articles.json') as f:
    articles = json.load(f)
all_slugs = {a['slug'] for a in articles}
print(f"Total articles: {len(all_slugs)}")

# ── Step 1: Build complete slug -> image_path map from all batches ──────────
print("\n=== Step 1: Building complete slug -> image map ===")

slug_to_src = {}  # slug -> (type, path_or_url)

# Batch 1
with open('/home/ubuntu/generate_article_hero_images.json') as f:
    b1 = json.load(f)
for r in b1['results']:
    out = r.get('output', {})
    slug = out.get('slug', '')
    img = out.get('image_path', '')
    if slug and img and out.get('status') == 'success':
        slug_to_src[slug] = img

# Batch 2
with open('/home/ubuntu/generate_remaining_article_images.json') as f:
    b2 = json.load(f)
for r in b2['results']:
    out = r.get('output', {})
    slug = out.get('slug', '') or out.get('Article Slug', '')
    img = out.get('image_path', '') or out.get('Generated Image Path', '')
    status = out.get('status', '') or out.get('Generation Status', '')
    if slug and img and status == 'success':
        slug_to_src[slug] = img

# Batch 3
with open('/home/ubuntu/generate_batch3_article_images.json') as f:
    b3 = json.load(f)
for r in b3['results']:
    out = r.get('output', {})
    slug = out.get('slug', '')
    img = out.get('image_path', '')
    if slug and img and out.get('status') == 'success':
        slug_to_src[slug] = img

print(f"Total slug->image mappings: {len(slug_to_src)}")

# ── Step 2: Download missing images ─────────────────────────────────────────
print("\n=== Step 2: Downloading missing images ===")
to_download = []
for slug, src in slug_to_src.items():
    dest = DEST_DIR / f"{slug}.jpg"
    if dest.exists():
        continue
    if str(src).startswith('http'):
        to_download.append((slug, src, dest))
    elif os.path.exists(src):
        shutil.copy2(src, dest)

print(f"  Need to download from CDN: {len(to_download)}")

def download_one(args):
    slug, url, dest = args
    try:
        resp = requests.get(url, timeout=120)
        if resp.status_code == 200:
            dest.write_bytes(resp.content)
            return (slug, True)
        return (slug, False)
    except Exception as e:
        return (slug, False)

if to_download:
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(download_one, to_download))
    dl_ok = sum(1 for _, ok in results if ok)
    print(f"  Downloaded: {dl_ok}/{len(to_download)}")

total_jpg = len(list(DEST_DIR.glob('*.jpg')))
print(f"  Total JPGs in article-images/: {total_jpg}")

# ── Step 3: Convert new JPGs to WebP ────────────────────────────────────────
print("\n=== Step 3: Converting new JPGs to WebP ===")
converted = 0
for jpg in DEST_DIR.glob('*.jpg'):
    webp = WEBP_DIR / f"{jpg.stem}.webp"
    if webp.exists():
        continue
    try:
        img = Image.open(jpg).convert('RGB')
        img.thumbnail((1200, 675), Image.LANCZOS)
        img.save(webp, 'WEBP', quality=82, method=4)
        converted += 1
    except Exception as e:
        print(f"  Error: {jpg.name}: {e}")

total_webp = len(list(WEBP_DIR.glob('*.webp')))
print(f"  Converted: {converted} new, Total WebP: {total_webp}")

# ── Step 4: Upload new WebP files to Bunny CDN ──────────────────────────────
print("\n=== Step 4: Uploading new WebP to Bunny CDN ===")
to_upload = [f for f in WEBP_DIR.glob('*.webp') if f.stem not in manifest]
print(f"  Need to upload: {len(to_upload)}")

def upload_one(webp_path):
    slug = webp_path.stem
    cdn_path = f"/article-hero/{webp_path.name}"
    url = f"{BUNNY_STORAGE_URL}{cdn_path}"
    try:
        with open(webp_path, 'rb') as f:
            resp = requests.put(
                url, data=f,
                headers={'AccessKey': BUNNY_API_KEY, 'Content-Type': 'image/webp'},
                timeout=60
            )
        if resp.status_code in (200, 201):
            return (slug, f"{BUNNY_CDN_URL}{cdn_path}", True)
        else:
            print(f"  Error {resp.status_code} for {slug}")
            return (slug, None, False)
    except Exception as e:
        print(f"  Exception for {slug}: {e}")
        return (slug, None, False)

uploaded = errors = 0
BATCH = 20
for i in range(0, len(to_upload), BATCH):
    batch = to_upload[i:i+BATCH]
    with concurrent.futures.ThreadPoolExecutor(max_workers=BATCH) as executor:
        results = list(executor.map(upload_one, batch))
    for slug, cdn_url, ok in results:
        if ok:
            manifest[slug] = cdn_url
            uploaded += 1
        else:
            errors += 1
    with open(MANIFEST_PATH, 'w') as f:
        json.dump(manifest, f, indent=2)
    if (i + BATCH) % 100 == 0 or i + BATCH >= len(to_upload):
        print(f"  Progress: {min(i+BATCH, len(to_upload))}/{len(to_upload)} (errors: {errors})")

print(f"  Uploaded: {uploaded}, Errors: {errors}, Total in manifest: {len(manifest)}")

# ── Step 5: Update ALL articles.json hero_url fields ────────────────────────
print("\n=== Step 5: Updating articles.json hero_url fields ===")

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

updated = fallback_used = 0
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
print(f"   Remaining {fallback_used} articles use category hero images (also on Bunny CDN).")

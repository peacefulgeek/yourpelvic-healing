#!/usr/bin/env python3
"""
Process batch 4 images:
1. Decode base64 filenames to get original slugs
2. Copy to article-images/ with correct slug names
3. Convert all new images to WebP
4. Upload to Bunny CDN
5. Update ALL 530 article hero_url fields
"""
import json, os, shutil, requests, base64, concurrent.futures
from pathlib import Path
from PIL import Image

SRC_DIR = Path('/home/ubuntu/image_path(3)')
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

# ── Step 1: Decode batch 4 filenames and copy to article-images/ ─────────────
print("\n=== Step 1: Decoding batch 4 filenames and copying images ===")
copied = 0
decode_errors = 0

for src_file in SRC_DIR.glob('*.jpg'):
    fname = src_file.stem  # filename without extension
    # The filename format is: {index}_{id}_{timestamp}_na1fn_{base64_path}
    # Extract the base64 part (after 'na1fn_')
    parts = fname.split('_na1fn_')
    if len(parts) != 2:
        decode_errors += 1
        continue
    
    b64_part = parts[1]
    # Add padding if needed
    padding = 4 - len(b64_part) % 4
    if padding != 4:
        b64_part += '=' * padding
    
    try:
        decoded_path = base64.b64decode(b64_part).decode('utf-8')
        # decoded_path is like /home/ubuntu/the-pelvic-floor/article-images/pelvic-floor-health-and-yoga.jpg
        slug = Path(decoded_path).stem
        dest = DEST_DIR / f"{slug}.jpg"
        if not dest.exists():
            shutil.copy2(src_file, dest)
            copied += 1
    except Exception as e:
        decode_errors += 1

print(f"  Copied: {copied}, Decode errors: {decode_errors}")
total_jpg = len(list(DEST_DIR.glob('*.jpg')))
print(f"  Total JPGs in article-images/: {total_jpg}")

# ── Step 2: Also process batch 4 results JSON for CDN-hosted images ──────────
print("\n=== Step 2: Checking batch 4 JSON for CDN-hosted images ===")
with open('/home/ubuntu/generate_batch4_article_images.json') as f:
    b4 = json.load(f)

cdn_to_download = []
for r in b4['results']:
    out = r.get('output', {})
    slug = out.get('slug', '')
    img = out.get('image_path', '')
    status = out.get('status', '')
    if slug and img and status == 'success':
        if str(img).startswith('http'):
            dest = DEST_DIR / f"{slug}.jpg"
            if not dest.exists():
                cdn_to_download.append((slug, img, dest))

print(f"  CDN images to download: {len(cdn_to_download)}")

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

if cdn_to_download:
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        results = list(executor.map(download_one, cdn_to_download))
    dl_ok = sum(1 for _, ok in results if ok)
    print(f"  Downloaded: {dl_ok}/{len(cdn_to_download)}")

# ── Step 3: Convert all new JPGs to WebP ─────────────────────────────────────
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

# ── Step 4: Upload new WebP files to Bunny CDN ───────────────────────────────
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
            return (slug, None, False)
    except Exception as e:
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
    print(f"  Progress: {min(i+BATCH, len(to_upload))}/{len(to_upload)} (errors: {errors})")

print(f"  Uploaded: {uploaded}, Errors: {errors}, Total in manifest: {len(manifest)}")

# ── Step 5: Update ALL articles.json hero_url fields ─────────────────────────
print("\n=== Step 5: Updating articles.json hero_url fields ===")

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
print(f"   Total WebP files: {total_webp}")
print(f"   Total in manifest: {len(manifest)}")

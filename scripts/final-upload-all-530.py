#!/usr/bin/env python3
"""
Final pipeline: Convert all 530 article images to WebP and upload to Bunny CDN.
Then update all article hero_url fields in articles.json.
"""
import json, os, requests, concurrent.futures
from pathlib import Path
from PIL import Image
import io

BUNNY_STORAGE_ZONE = "pelvic-healing"
BUNNY_API_KEY = "703457e5-2ce2-466a-b53ba58ea1b9-728f-4e7c"
BUNNY_STORAGE_HOST = "https://ny.storage.bunnycdn.com"
BUNNY_PULL_ZONE = "https://pelvic-healing.b-cdn.net"
CDN_PATH = "articles"

img_dir = Path('/home/ubuntu/the-pelvic-floor/article-images')
webp_dir = Path('/home/ubuntu/the-pelvic-floor/article-images-webp')
webp_dir.mkdir(exist_ok=True)

# Load articles
with open('/home/ubuntu/the-pelvic-floor/data/articles.json') as f:
    articles = json.load(f)

print(f"Converting and uploading {len(articles)} article images...")

def convert_to_webp(slug):
    src = img_dir / f"{slug}.jpg"
    if not src.exists():
        # Try png
        src = img_dir / f"{slug}.png"
    if not src.exists():
        return None
    
    dst = webp_dir / f"{slug}.webp"
    if dst.exists():
        return dst
    
    try:
        with Image.open(src) as img:
            # Resize to 1200x675 (16:9)
            img = img.convert('RGB')
            img.thumbnail((1200, 675), Image.LANCZOS)
            # Pad to exact 1200x675
            new_img = Image.new('RGB', (1200, 675), (255, 255, 255))
            offset = ((1200 - img.width) // 2, (675 - img.height) // 2)
            new_img.paste(img, offset)
            new_img.save(dst, 'WEBP', quality=85, method=6)
        return dst
    except Exception as e:
        print(f"  ERROR converting {slug}: {e}")
        return None

def upload_to_bunny(slug, webp_path):
    url = f"{BUNNY_STORAGE_HOST}/{BUNNY_STORAGE_ZONE}/{CDN_PATH}/{slug}.webp"
    headers = {
        "AccessKey": BUNNY_API_KEY,
        "Content-Type": "image/webp",
    }
    try:
        with open(webp_path, 'rb') as f:
            data = f.read()
        resp = requests.put(url, headers=headers, data=data, timeout=30)
        if resp.status_code in (200, 201):
            return f"{BUNNY_PULL_ZONE}/{CDN_PATH}/{slug}.webp"
        else:
            print(f"  UPLOAD FAILED {slug}: {resp.status_code} {resp.text[:100]}")
            return None
    except Exception as e:
        print(f"  UPLOAD ERROR {slug}: {e}")
        return None

# Process in batches
uploaded = {}
failed = []

def process_article(article):
    slug = article['slug']
    webp_path = convert_to_webp(slug)
    if webp_path is None:
        return slug, None
    cdn_url = upload_to_bunny(slug, webp_path)
    return slug, cdn_url

print("Starting parallel upload (20 workers)...")
with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
    futures = {executor.submit(process_article, a): a['slug'] for a in articles}
    done = 0
    for future in concurrent.futures.as_completed(futures):
        slug, cdn_url = future.result()
        done += 1
        if cdn_url:
            uploaded[slug] = cdn_url
            if done % 50 == 0:
                print(f"  Progress: {done}/{len(articles)} ({len(uploaded)} uploaded)")
        else:
            failed.append(slug)

print(f"\nUploaded: {len(uploaded)}")
print(f"Failed: {len(failed)}")
if failed:
    print("Failed slugs:")
    for s in failed[:10]:
        print(f"  {s}")

# Update articles.json with new hero_urls
updated = 0
for article in articles:
    slug = article['slug']
    if slug in uploaded:
        article['hero_url'] = uploaded[slug]
        updated += 1

with open('/home/ubuntu/the-pelvic-floor/data/articles.json', 'w') as f:
    json.dump(articles, f, indent=2)

print(f"\nUpdated {updated} article hero_urls in articles.json")

# Save manifest
manifest = {
    'uploaded': uploaded,
    'failed': failed,
    'total': len(articles),
    'success_count': len(uploaded),
}
with open('/home/ubuntu/the-pelvic-floor/scripts/final-upload-manifest.json', 'w') as f:
    json.dump(manifest, f, indent=2)
print("Manifest saved to scripts/final-upload-manifest.json")

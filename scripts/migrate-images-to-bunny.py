#!/usr/bin/env python3
"""
Migrate all local images to Bunny CDN as compressed WebP.
Storage zone: pelvic-healing
Endpoint: ny.storage.bunnycdn.com
Access Key: 703457e5-2ce2-466a-b53ba58ea1b9-728f-4e7c
CDN Pull: https://pelvic-healing.b-cdn.net
"""
import os
import sys
import glob
import requests
from PIL import Image
import io

BUNNY_STORAGE_API = 'https://ny.storage.bunnycdn.com'
BUNNY_STORAGE_ZONE = 'pelvic-healing'
BUNNY_ACCESS_KEY = '703457e5-2ce2-466a-b53ba58ea1b9-728f-4e7c'
BUNNY_CDN_URL = 'https://pelvic-healing.b-cdn.net'

IMAGES_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'public', 'images')

def convert_to_webp(image_path, quality=82):
    """Convert image to WebP bytes."""
    with Image.open(image_path) as img:
        # Convert to RGB if needed (removes alpha for JPEG compatibility)
        if img.mode in ('RGBA', 'LA', 'P'):
            img = img.convert('RGB')
        # Resize if too large (max 1600px wide for hero images)
        max_width = 1600
        if img.width > max_width:
            ratio = max_width / img.width
            new_size = (max_width, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)
        buf = io.BytesIO()
        img.save(buf, format='WEBP', quality=quality, method=6)
        return buf.getvalue()

def upload_to_bunny(webp_bytes, remote_path):
    """Upload WebP bytes to Bunny CDN storage."""
    url = f'{BUNNY_STORAGE_API}/{BUNNY_STORAGE_ZONE}/{remote_path}'
    headers = {
        'AccessKey': BUNNY_ACCESS_KEY,
        'Content-Type': 'image/webp',
    }
    resp = requests.put(url, data=webp_bytes, headers=headers, timeout=60)
    return resp.status_code, resp.text

def main():
    images = glob.glob(os.path.join(IMAGES_DIR, '*.jpg')) + \
             glob.glob(os.path.join(IMAGES_DIR, '*.jpeg')) + \
             glob.glob(os.path.join(IMAGES_DIR, '*.png')) + \
             glob.glob(os.path.join(IMAGES_DIR, '*.webp'))
    
    if not images:
        print('No images found in', IMAGES_DIR)
        return
    
    print(f'Found {len(images)} images to migrate')
    
    uploaded = []
    failed = []
    
    for img_path in sorted(images):
        filename = os.path.basename(img_path)
        stem = os.path.splitext(filename)[0]
        remote_path = f'images/{stem}.webp'
        cdn_url = f'{BUNNY_CDN_URL}/{remote_path}'
        
        print(f'  Converting {filename}...', end=' ', flush=True)
        try:
            webp_bytes = convert_to_webp(img_path)
            size_kb = len(webp_bytes) // 1024
            print(f'{size_kb}KB WebP', end=' ', flush=True)
        except Exception as e:
            print(f'CONVERT ERROR: {e}')
            failed.append((filename, str(e)))
            continue
        
        print(f'→ uploading to Bunny...', end=' ', flush=True)
        try:
            status, text = upload_to_bunny(webp_bytes, remote_path)
            if status in (200, 201):
                print(f'OK [{status}] → {cdn_url}')
                uploaded.append((filename, cdn_url))
            else:
                print(f'UPLOAD ERROR [{status}]: {text[:100]}')
                failed.append((filename, f'HTTP {status}: {text[:100]}'))
        except Exception as e:
            print(f'UPLOAD EXCEPTION: {e}')
            failed.append((filename, str(e)))
    
    print(f'\n=== Migration Summary ===')
    print(f'Uploaded: {len(uploaded)}/{len(images)}')
    if failed:
        print(f'Failed: {len(failed)}')
        for f, e in failed:
            print(f'  - {f}: {e}')
    
    if uploaded:
        print(f'\n=== Deleting local images ===')
        for filename, cdn_url in uploaded:
            local_path = os.path.join(IMAGES_DIR, filename)
            os.remove(local_path)
            print(f'  Deleted: {filename}')
        
        # Also remove any .webp files that were already there
        for img_path in glob.glob(os.path.join(IMAGES_DIR, '*.webp')):
            os.remove(img_path)
            print(f'  Deleted: {os.path.basename(img_path)}')
        
        print(f'\nAll uploaded images deleted from local storage.')
        print(f'CDN base URL: {BUNNY_CDN_URL}/images/')
    
    # Print the mapping for updating articles.json
    print(f'\n=== CDN URL Mapping ===')
    for filename, cdn_url in uploaded:
        stem = os.path.splitext(filename)[0]
        print(f'{stem} → {cdn_url}')

if __name__ == '__main__':
    main()

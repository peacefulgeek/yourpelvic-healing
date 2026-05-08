#!/usr/bin/env python3
"""
Convert all gen-images/*.jpg to compressed WebP and upload to Bunny CDN.
Storage zone: pelvic-healing
Hostname: ny.storage.bunnycdn.com
Pull zone: https://pelvichealing.b-cdn.net
"""

import os
import sys
import requests
from pathlib import Path
from PIL import Image
import io

BUNNY_API_KEY = "703457e5-2ce2-466a-b53ba58ea1b9-728f-4e7c"
BUNNY_STORAGE_ZONE = "pelvic-healing"
BUNNY_HOSTNAME = "ny.storage.bunnycdn.com"
BUNNY_PULL_ZONE = "https://pelvichealing.b-cdn.net"
CDN_PATH = "hero"  # images go to /hero/ subfolder

GEN_IMAGES_DIR = Path("/home/ubuntu/the-pelvic-floor/gen-images")
WEBP_DIR = Path("/home/ubuntu/the-pelvic-floor/gen-images-webp")
WEBP_DIR.mkdir(exist_ok=True)

def convert_to_webp(src_path: Path, dst_path: Path, quality: int = 82) -> int:
    """Convert image to WebP format with given quality. Returns file size."""
    with Image.open(src_path) as img:
        # Convert to RGB if needed (remove alpha)
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
        # Resize to max 1920px wide while maintaining aspect ratio
        max_width = 1920
        if img.width > max_width:
            ratio = max_width / img.width
            new_size = (max_width, int(img.height * ratio))
            img = img.resize(new_size, Image.LANCZOS)
        img.save(dst_path, "WEBP", quality=quality, method=6)
    return dst_path.stat().st_size

def upload_to_bunny(local_path: Path, remote_filename: str) -> str:
    """Upload a file to Bunny CDN and return the CDN URL."""
    url = f"https://{BUNNY_HOSTNAME}/{BUNNY_STORAGE_ZONE}/{CDN_PATH}/{remote_filename}"
    
    with open(local_path, "rb") as f:
        data = f.read()
    
    headers = {
        "AccessKey": BUNNY_API_KEY,
        "Content-Type": "image/webp",
    }
    
    response = requests.put(url, data=data, headers=headers)
    
    if response.status_code in (200, 201):
        cdn_url = f"{BUNNY_PULL_ZONE}/{CDN_PATH}/{remote_filename}"
        return cdn_url
    else:
        raise Exception(f"Upload failed for {remote_filename}: {response.status_code} {response.text}")

def main():
    jpg_files = sorted(GEN_IMAGES_DIR.glob("*.jpg"))
    print(f"Found {len(jpg_files)} JPG files to process")
    
    results = {}
    
    for jpg_path in jpg_files:
        stem = jpg_path.stem  # e.g. "anatomy-1"
        webp_filename = f"{stem}.webp"
        webp_path = WEBP_DIR / webp_filename
        
        # Convert to WebP
        print(f"  Converting {jpg_path.name} → {webp_filename}...", end=" ", flush=True)
        size = convert_to_webp(jpg_path, webp_path)
        print(f"{size // 1024}KB", end=" ", flush=True)
        
        # Upload to Bunny CDN
        print(f"→ uploading...", end=" ", flush=True)
        cdn_url = upload_to_bunny(webp_path, webp_filename)
        print(f"✓ {cdn_url}")
        
        results[stem] = cdn_url
    
    print(f"\n✅ Uploaded {len(results)} images to Bunny CDN")
    print("\nCDN URL map:")
    for key, url in sorted(results.items()):
        print(f"  {key}: {url}")
    
    # Write results to a JSON file for the next script
    import json
    out_path = Path("/home/ubuntu/the-pelvic-floor/scripts/bunny-image-map.json")
    with open(out_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\nSaved URL map to {out_path}")

if __name__ == "__main__":
    main()

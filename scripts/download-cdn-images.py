"""
Download all images from CDN URLs in the results JSON that couldn't be copied locally.
"""
import json, os, requests, time

with open('/home/ubuntu/generate_article_hero_images.json') as f:
    data = json.load(f)

results = data['results']
article_images_dir = '/home/ubuntu/the-pelvic-floor/article-images'
os.makedirs(article_images_dir, exist_ok=True)

downloaded = 0
skipped = 0
errors = 0

for r in results:
    if r['output'].get('status') != 'success':
        continue
    
    slug = r['output'].get('slug', '')
    path = r['output'].get('image_path', '')
    
    if not slug or not path:
        continue
    
    dst = os.path.join(article_images_dir, f'{slug}.jpg')
    
    # Skip if already exists
    if os.path.exists(dst) and os.path.getsize(dst) > 10000:
        skipped += 1
        continue
    
    if path.startswith('https://'):
        # Download from CDN URL
        for attempt in range(3):
            try:
                resp = requests.get(path, timeout=30)
                resp.raise_for_status()
                with open(dst, 'wb') as f:
                    f.write(resp.content)
                downloaded += 1
                print(f'Downloaded: {slug}')
                break
            except Exception as e:
                if attempt < 2:
                    time.sleep(2)
                else:
                    print(f'ERROR downloading {slug}: {e}')
                    errors += 1
    elif os.path.exists(path):
        import shutil
        shutil.copy2(path, dst)
        downloaded += 1
    else:
        print(f'Path not found: {path[:80]}')
        errors += 1

print(f'\nDone! Downloaded: {downloaded}, Skipped: {skipped}, Errors: {errors}')
print(f'Total files in article-images: {len(os.listdir(article_images_dir))}')

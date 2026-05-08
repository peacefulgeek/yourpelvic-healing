#!/usr/bin/env python3
"""Find all articles still missing images and build batch 3 inputs."""
import json, os
from pathlib import Path

# Load all articles
with open('/home/ubuntu/the-pelvic-floor/data/articles.json') as f:
    articles = json.load(f)

img_dir = Path('/home/ubuntu/the-pelvic-floor/article-images')
existing = {p.stem for p in img_dir.glob('*.jpg')}

# Load all slugs that were in batch 1 or batch 2
with open('/home/ubuntu/generate_article_hero_images.json') as f:
    b1 = json.load(f)
with open('/home/ubuntu/generate_remaining_article_images.json') as f:
    b2 = json.load(f)

def get_slugs(data):
    slugs = set()
    for r in data['results']:
        out = r.get('output', {})
        slug = out.get('slug') or out.get('Article Slug') or ''
        if slug:
            slugs.add(slug)
    return slugs

b1_slugs = get_slugs(b1)
b2_slugs = get_slugs(b2)
all_batched = b1_slugs | b2_slugs

print(f"Batch 1 slugs: {len(b1_slugs)}")
print(f"Batch 2 slugs: {len(b2_slugs)}")
print(f"Total batched: {len(all_batched)}")
print(f"Total articles: {len(articles)}")
print(f"Images on disk: {len(existing)}")

# Find articles not yet having an image
missing_articles = [a for a in articles if a['slug'] not in existing]
print(f"\nArticles missing images: {len(missing_articles)}")

# Load prompts
with open('/tmp/article-prompts-llm.json') as f:
    prompts_data = json.load(f)

# Build a slug -> prompt map
prompt_map = {}
for item in prompts_data:
    if isinstance(item, dict):
        slug = item.get('slug', '')
        prompt = item.get('prompt', '')
        if slug and prompt:
            prompt_map[slug] = prompt

print(f"Prompts available: {len(prompt_map)}")

# Build batch 3 inputs
batch3 = []
for a in missing_articles:
    slug = a['slug']
    title = a.get('title', slug.replace('-', ' ').title())
    category = a.get('category', 'Pelvic Health')
    
    if slug in prompt_map:
        prompt = prompt_map[slug]
    else:
        # Generate a generic prompt based on title/category
        prompt = (
            f"Editorial wellness photography, warm natural light, soft muted tones, "
            f"purple-mauve-sage color palette, no text, no watermarks, professional healthcare "
            f"or serene home environment, photorealistic, cinematic composition \u2014 "
            f"a woman in her 40s consulting with a female healthcare specialist about {title.lower()} "
            f"in a warm professional clinical setting"
        )
    
    batch3.append(f"{slug}|||{prompt}")

print(f"Batch 3 inputs: {len(batch3)}")

# Save to file
with open('/home/ubuntu/the-pelvic-floor/scripts/batch3-inputs.json', 'w') as f:
    json.dump(batch3, f, indent=2)

print("Saved to scripts/batch3-inputs.json")
print("\nSample inputs:")
for inp in batch3[:3]:
    slug, prompt = inp.split('|||', 1)
    print(f"  {slug}: {prompt[:80]}...")

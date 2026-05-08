#!/usr/bin/env python3
"""Build batch 4 inputs for the 366 articles that were never generated."""
import json
from pathlib import Path

# Load all batch results and collect all slugs that were generated
all_generated = set()

for batch_file in [
    '/home/ubuntu/generate_article_hero_images.json',
    '/home/ubuntu/generate_remaining_article_images.json',
    '/home/ubuntu/generate_batch3_article_images.json',
]:
    with open(batch_file) as f:
        data = json.load(f)
    for r in data['results']:
        out = r.get('output', {})
        slug = out.get('slug', '') or out.get('Article Slug', '')
        if slug:
            all_generated.add(slug)

# Load articles
with open('/home/ubuntu/the-pelvic-floor/data/articles.json') as f:
    articles = json.load(f)

# Load prompts
with open('/tmp/article-prompts-llm.json') as f:
    prompts_data = json.load(f)

prompt_map = {item['slug']: item['prompt'] for item in prompts_data if isinstance(item, dict) and 'slug' in item}

# Find never-generated articles
never_generated = [a for a in articles if a['slug'] not in all_generated]
print(f"Never generated: {len(never_generated)}")

# Build batch 4 inputs
batch4 = []
for a in never_generated:
    slug = a['slug']
    title = a.get('title', slug.replace('-', ' ').title())
    category = a.get('category', 'Pelvic Health')
    
    if slug in prompt_map:
        prompt = prompt_map[slug]
    else:
        # Generate a prompt based on title
        prompt = (
            f"Editorial wellness photography, warm natural light, soft muted tones, "
            f"purple-mauve-sage color palette, no text, no watermarks, professional healthcare "
            f"or serene home environment, photorealistic, cinematic composition \u2014 "
            f"a woman in her 40s consulting with a female healthcare specialist about {title.lower()} "
            f"in a warm professional clinical setting"
        )
    
    batch4.append(f"{slug}|||{prompt}")

print(f"Batch 4 inputs: {len(batch4)}")

with open('/home/ubuntu/the-pelvic-floor/scripts/batch4-inputs.json', 'w') as f:
    json.dump(batch4, f, indent=2)

print("Saved to scripts/batch4-inputs.json")
print("Sample:")
for inp in batch4[:3]:
    slug, prompt = inp.split('|||', 1)
    print(f"  {slug}: {prompt[:80]}...")

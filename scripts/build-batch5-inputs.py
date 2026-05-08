#!/usr/bin/env python3
"""Build batch 5 inputs: the exact 343 article slugs that have no image in the manifest."""
import json, os
from openai import OpenAI

client = OpenAI()

with open('/home/ubuntu/the-pelvic-floor/data/articles.json') as f:
    articles = json.load(f)
with open('/home/ubuntu/the-pelvic-floor/scripts/bunny-article-manifest.json') as f:
    manifest = json.load(f)

manifest_slugs = set(manifest.keys())
missing = [a for a in articles if a['slug'] not in manifest_slugs]
print(f"Missing articles: {len(missing)}")

# Build prompts using LLM in batches of 20
SYSTEM = (
    "You are a creative director for a women's pelvic health website. "
    "For each article title, write a single-sentence image prompt for an editorial wellness photo. "
    "Requirements: warm natural light, soft muted tones, purple-mauve-sage color palette, "
    "no text, no watermarks, photorealistic, cinematic composition, professional healthcare or home setting. "
    "Make each prompt specific to the article topic. Return JSON array of objects with 'slug' and 'prompt' keys."
)

all_prompts = []
BATCH = 20
for i in range(0, len(missing), BATCH):
    batch = missing[i:i+BATCH]
    articles_list = [{"slug": a["slug"], "title": a.get("title", a["slug"].replace("-", " ").title())} for a in batch]
    
    try:
        resp = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[
                {"role": "system", "content": SYSTEM},
                {"role": "user", "content": f"Generate image prompts for these articles:\n{json.dumps(articles_list, indent=2)}"}
            ],
            response_format={"type": "json_object"},
            temperature=0.8
        )
        data = json.loads(resp.choices[0].message.content)
        # Handle various response formats
        if isinstance(data, list):
            prompts = data
        elif "prompts" in data:
            prompts = data["prompts"]
        elif "articles" in data:
            prompts = data["articles"]
        else:
            # Try to find any list in the response
            for v in data.values():
                if isinstance(v, list):
                    prompts = v
                    break
            else:
                prompts = []
        
        all_prompts.extend(prompts)
        print(f"  Batch {i//BATCH + 1}: {len(prompts)} prompts")
    except Exception as e:
        print(f"  Batch {i//BATCH + 1} error: {e}")
        # Fallback: generate basic prompts
        for a in batch:
            title = a.get("title", a["slug"].replace("-", " ").title())
            all_prompts.append({
                "slug": a["slug"],
                "prompt": f"Editorial wellness photography, warm natural light, soft muted tones, purple-mauve-sage color palette, no text, no watermarks, photorealistic — a woman consulting with a female healthcare specialist about {title.lower()} in a warm professional clinical setting"
            })

print(f"Total prompts generated: {len(all_prompts)}")

# Build inputs list
slug_to_prompt = {p['slug']: p['prompt'] for p in all_prompts if isinstance(p, dict) and 'slug' in p and 'prompt' in p}

inputs = []
for a in missing:
    slug = a['slug']
    title = a.get('title', slug.replace('-', ' ').title())
    if slug in slug_to_prompt:
        prompt = slug_to_prompt[slug]
    else:
        prompt = f"Editorial wellness photography, warm natural light, soft muted tones, purple-mauve-sage color palette, no text, no watermarks, photorealistic — a woman consulting with a female healthcare specialist about {title.lower()} in a warm professional clinical setting"
    inputs.append(f"{slug}|||{prompt}")

print(f"Total inputs: {len(inputs)}")
with open('/home/ubuntu/the-pelvic-floor/scripts/batch5-inputs.json', 'w') as f:
    json.dump(inputs, f, indent=2)
print("Saved to scripts/batch5-inputs.json")
print("Sample:")
for inp in inputs[:3]:
    slug, prompt = inp.split('|||', 1)
    print(f"  {slug}: {prompt[:80]}...")

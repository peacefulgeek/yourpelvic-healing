"""
Use GPT-4.1-mini to generate unique, article-specific image prompts for all 530 articles.
Processes in batches of 20 for efficiency.
"""
import json, os, time
from openai import OpenAI

client = OpenAI()  # uses env OPENAI_API_KEY and OPENAI_BASE_URL

STYLE_PREFIX = (
    "Editorial wellness photography, warm natural light, soft muted tones, "
    "purple-mauve-sage color palette, no text, no watermarks, "
    "professional healthcare or serene home environment, photorealistic, "
    "cinematic composition — "
)

SYSTEM_PROMPT = """You are an image prompt writer for a pelvic floor health website called YourPelvicHealing.com.

The site has a warm, professional, empowering aesthetic: editorial wellness photography, natural light, soft purple-mauve-sage tones, women-focused healthcare content.

For each article title, write a SHORT, SPECIFIC image scene description (1-2 sentences max, 20-40 words) that:
1. Is UNIQUE and SPECIFIC to that exact article topic
2. Shows a real scene with a person (usually a woman, age appropriate to the topic)
3. Fits the wellness/healthcare aesthetic
4. Does NOT repeat the same scene for different articles
5. Avoids generic descriptions like "woman on yoga mat" for every article

Examples of GOOD specific prompts:
- "a woman in her 50s speaking with a female gynecologist about vaginal dryness, warm clinical office"
- "a new mother gently doing heel slides on a hospital bed, early postpartum recovery"  
- "a woman using a biofeedback device in a pelvic floor physical therapy clinic"
- "a woman squatting over a squatty potty stool in a clean modern bathroom"
- "a pregnant woman in her third trimester doing a supported cat-cow stretch on a yoga mat"
- "a woman in her 40s applying vaginal estrogen cream, private bathroom setting"
- "a woman doing a kegel exercise on an exercise ball, physical therapy clinic"
- "a woman and her partner discussing painful sex with a female therapist"

Return ONLY a JSON array of objects with keys: slug, prompt
No explanation, no markdown, just raw JSON."""

def batch_generate_prompts(articles_batch, retries=5):
    """Generate prompts for a batch of articles with retry logic."""
    articles_text = "\n".join([
        f'{i+1}. slug: {a["slug"]}\n   title: {a["title"]}\n   category: {a["category"]}'
        for i, a in enumerate(articles_batch)
    ])
    
    for attempt in range(retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": f"Write unique image scene descriptions for these articles:\n\n{articles_text}"}
                ],
                temperature=0.8,
                max_tokens=4000
            )
            
            content = response.choices[0].message.content.strip()
            # Clean up if wrapped in markdown
            if content.startswith("```"):
                content = content.split("```")[1]
                if content.startswith("json"):
                    content = content[4:]
            content = content.strip()
            
            return json.loads(content)
        except Exception as e:
            if '429' in str(e) and attempt < retries - 1:
                wait = 15 * (attempt + 1)
                print(f"Rate limited, waiting {wait}s...", end=" ", flush=True)
                time.sleep(wait)
            else:
                raise

# Load articles
with open('/home/ubuntu/the-pelvic-floor/data/articles.json') as f:
    data = json.load(f)
articles = data if isinstance(data, list) else data.get('articles', [])

# Check if we have a partial results file
output_file = '/tmp/article-prompts-llm.json'
if os.path.exists(output_file):
    with open(output_file) as f:
        results = json.load(f)
    done_slugs = {r['slug'] for r in results}
    print(f"Resuming: {len(done_slugs)} already done")
else:
    results = []
    done_slugs = set()

# Filter articles not yet processed
remaining = [a for a in articles if a['slug'] not in done_slugs]
print(f"Remaining: {len(remaining)} articles to process")

BATCH_SIZE = 20
total_batches = (len(remaining) + BATCH_SIZE - 1) // BATCH_SIZE

for batch_idx in range(total_batches):
    batch = remaining[batch_idx * BATCH_SIZE:(batch_idx + 1) * BATCH_SIZE]
    print(f"Batch {batch_idx+1}/{total_batches} ({len(batch)} articles)...", end=" ", flush=True)
    
    try:
        batch_results = batch_generate_prompts(batch)
        
        # Add style prefix to each prompt
        for r in batch_results:
            r['prompt'] = STYLE_PREFIX + r['prompt']
            r['output_file'] = f'/home/ubuntu/the-pelvic-floor/article-images/{r["slug"]}.jpg'
        
        results.extend(batch_results)
        
        # Save progress after each batch
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"done ({len(results)} total)")
        
        # Delay to avoid rate limiting (200 req/min limit)
        if batch_idx < total_batches - 1:
            time.sleep(3)
            
    except Exception as e:
        print(f"ERROR: {e}")
        # Save what we have
        with open(output_file, 'w') as f:
            json.dump(results, f, indent=2)
        print(f"Saved {len(results)} results so far. Re-run to continue.")
        break

print(f"\nFinal: {len(results)} prompts generated")
print(f"Saved to {output_file}")

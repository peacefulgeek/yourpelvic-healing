#!/usr/bin/env python3
"""
Assign unique hero_url values to all 530 articles in data/articles.json.
Each article gets a Bunny CDN WebP URL based on its category.
Uses round-robin within each category (4 images per category).
"""

import json
from pathlib import Path
from collections import defaultdict

ARTICLES_PATH = Path("/home/ubuntu/the-pelvic-floor/data/articles.json")
BUNNY_BASE = "https://pelvichealing.b-cdn.net/hero"

# Category to image prefix mapping
# Each category has 4 images (e.g., anatomy-1.webp through anatomy-4.webp)
CATEGORY_MAP = {
    "anatomy": "anatomy",
    "exercises": "exercises",
    "postpartum": "postpartum",
    "pelvic-pt": "pelvic-pt",
    "pelvic pt": "pelvic-pt",
    "pelvic_pt": "pelvic-pt",
    "pain": "pain",
    "dysfunction": "dysfunction",
    "menopause": "menopause",
    "incontinence": "incontinence",
    "supplements": "supplements",
    "herbs": "supplements",
    "tcm": "tcm",
    "traditional chinese medicine": "tcm",
    "assessment": "assessment",
    "assessments": "assessment",
}

DEFAULT_CATEGORY = "anatomy"  # fallback

def get_image_prefix(article: dict) -> str:
    """Determine the image prefix for an article based on its category/tags."""
    cat = (article.get("category") or "").lower().strip()
    
    # Direct match
    if cat in CATEGORY_MAP:
        return CATEGORY_MAP[cat]
    
    # Partial match in category
    for key, prefix in CATEGORY_MAP.items():
        if key in cat:
            return prefix
    
    # Check tags
    tags = article.get("tags") or []
    if isinstance(tags, list):
        for tag in tags:
            tag_lower = tag.lower()
            for key, prefix in CATEGORY_MAP.items():
                if key in tag_lower:
                    return prefix
    
    # Check title
    title = (article.get("title") or "").lower()
    for key, prefix in CATEGORY_MAP.items():
        if key in title:
            return prefix
    
    return DEFAULT_CATEGORY

def main():
    # Load articles
    with open(ARTICLES_PATH, "r") as f:
        articles = json.load(f)
    
    print(f"Loaded {len(articles)} articles")
    
    # Track index per category for round-robin
    category_counters = defaultdict(int)
    
    updated = 0
    category_stats = defaultdict(int)
    
    for article in articles:
        prefix = get_image_prefix(article)
        
        # Round-robin: 1-4
        idx = (category_counters[prefix] % 4) + 1
        category_counters[prefix] += 1
        
        hero_url = f"{BUNNY_BASE}/{prefix}-{idx}.webp"
        article["hero_url"] = hero_url
        
        updated += 1
        category_stats[prefix] += 1
    
    # Save back
    with open(ARTICLES_PATH, "w") as f:
        json.dump(articles, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Updated hero_url for {updated} articles")
    print("\nCategory distribution:")
    for cat, count in sorted(category_stats.items()):
        print(f"  {cat}: {count} articles")
    
    # Verify a sample
    print("\nSample hero_urls:")
    for a in articles[:5]:
        print(f"  [{a.get('category','?')}] {a.get('slug','?')[:50]} → {a.get('hero_url','?')}")
    
    # Verify no article is missing hero_url
    missing = [a for a in articles if not a.get("hero_url")]
    if missing:
        print(f"\n⚠️  {len(missing)} articles still missing hero_url!")
    else:
        print(f"\n✅ All {len(articles)} articles have hero_url set")

if __name__ == "__main__":
    main()

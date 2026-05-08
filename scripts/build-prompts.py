"""
Build article-specific image generation prompts for all 530 articles.
Each prompt is tailored to the article title and category.
"""
import json, re, sys

STYLE_PREFIX = (
    "Editorial wellness photography, warm natural light, soft muted tones, "
    "purple-mauve-sage color palette, no text, no watermarks, "
    "professional healthcare setting or serene home environment, "
    "photorealistic, cinematic composition — "
)

CATEGORY_CONTEXT = {
    "anatomy": "anatomical wellness, body awareness, mindful movement",
    "Anatomy & Foundations": "anatomical wellness, body awareness, mindful movement",
    "dysfunction": "pelvic floor rehabilitation, physical therapy, healing",
    "Pelvic Floor Dysfunction": "pelvic floor rehabilitation, physical therapy, healing",
    "exercises": "gentle movement, yoga, stretching, physical therapy exercises",
    "Exercises & Movement": "gentle movement, yoga, stretching, physical therapy exercises",
    "incontinence": "bladder health, wellness, calm daily life",
    "Incontinence": "bladder health, wellness, calm daily life",
    "Bladder Health": "bladder health, wellness, hydration, calm daily life",
    "postpartum": "postpartum recovery, new mother, nurturing, healing",
    "Postpartum Recovery": "postpartum recovery, new mother, nurturing, healing",
    "pelvic-pt": "physical therapy clinic, hands-on treatment, professional care",
    "Pelvic Physical Therapy": "physical therapy clinic, hands-on treatment, professional care",
    "pain": "pelvic pain relief, gentle healing, calm therapeutic setting",
    "Pelvic Pain": "pelvic pain relief, gentle healing, calm therapeutic setting",
    "menopause": "menopause wellness, midlife woman, hormonal health, calm",
    "Menopause & Hormonal Health": "menopause wellness, midlife woman, hormonal health, calm",
    "Bowel Health": "digestive wellness, gut health, calm lifestyle",
    "Pregnancy": "pregnancy wellness, prenatal care, expectant mother",
    "Sexual Health": "intimate wellness, relationship health, gentle healing",
    "supplements": "natural supplements, herbal wellness, nutrition",
    "tcm": "traditional Chinese medicine, acupuncture, herbal healing",
    "assessment": "self-assessment, journaling, health awareness",
}

KEYWORD_PROMPTS = {
    # Anatomy
    "anatomy": "a woman in her 30s sitting cross-legged on a yoga mat, hands on lower abdomen, eyes closed in body awareness meditation",
    "muscle": "a woman in athletic wear doing a gentle core stability exercise on a reformer pilates machine",
    "nerve": "a woman receiving gentle therapeutic massage in a calm spa-like clinic setting",
    "fascia": "a woman in a physical therapy session, therapist gently working on her lower back",
    "pelvic floor": "a woman in her 40s doing a mindful breathing exercise on a yoga mat in a sunlit room",
    
    # Dysfunction
    "prolapse": "a woman in her 50s speaking with a female doctor in a warm clinical office",
    "tight": "a woman doing a gentle hip-opening yoga stretch, relaxed expression, soft lighting",
    "weak": "a woman doing gentle pelvic floor exercises on a yoga mat, focused and calm",
    "hypertonic": "a woman doing a restorative yoga child's pose on a purple mat",
    "hypotonic": "a woman doing a gentle Kegel exercise demonstration with a physical therapist",
    "dysfunction": "a woman in her 40s at a pelvic floor physical therapy appointment",
    
    # Exercises
    "kegel": "a woman sitting on an exercise ball doing pelvic floor exercises in a bright home gym",
    "exercise": "a woman doing a gentle bridge pose on a yoga mat in a sunlit living room",
    "yoga": "a woman in a restorative yoga pose, bolster under hips, peaceful expression",
    "pilates": "a woman on a pilates reformer doing gentle core work, professional studio",
    "breathing": "a woman practicing diaphragmatic breathing, hands on belly, soft natural light",
    "squat": "a woman doing a deep squat stretch with a resistance band in a home gym",
    "stretch": "a woman doing a butterfly stretch on a yoga mat, warm morning light",
    
    # Incontinence
    "incontinence": "a woman in her 40s jogging confidently in a park, active and empowered",
    "leaking": "a woman laughing freely with friends, active lifestyle, no worry",
    "bladder": "a woman drinking water at a kitchen counter, healthy hydration routine",
    "urge": "a woman doing a bladder training exercise, sitting calmly at home",
    "stress urinary": "a woman doing a low-impact workout class, confident and active",
    
    # Postpartum
    "postpartum": "a new mother holding her baby, sitting on a yoga mat, gentle recovery",
    "birth": "a woman in early postpartum recovery, resting comfortably at home with soft light",
    "cesarean": "a woman gently massaging her lower abdomen scar, healing at home",
    "diastasis": "a woman checking her abdominal separation with hands on belly, home setting",
    "breastfeeding": "a mother breastfeeding her newborn in a cozy armchair, soft natural light",
    "pregnancy": "a pregnant woman doing prenatal yoga in a sunlit studio",
    "prenatal": "a pregnant woman with her hands on her belly, peaceful expression, garden setting",
    
    # Physical Therapy
    "physical therapy": "a female pelvic floor physical therapist working with a patient in a professional clinic",
    "pelvic pt": "a physical therapist explaining exercises to a woman patient in a clinic",
    "biofeedback": "a woman using biofeedback equipment in a physical therapy clinic",
    "dilator": "a woman in a calm clinical setting speaking with a female therapist",
    "internal exam": "a female physical therapist and patient in a professional clinical consultation",
    "therapist": "a pelvic floor physical therapist demonstrating an exercise to a patient",
    
    # Pain
    "pain": "a woman in her 30s gently placing a heating pad on her lower abdomen, calm home setting",
    "vaginismus": "a woman sitting with a female therapist in a warm, supportive clinical office",
    "vulvodynia": "a woman in a therapeutic consultation with a female healthcare provider",
    "endometriosis": "a woman resting on a couch with a heating pad, soft warm lighting",
    "interstitial cystitis": "a woman drinking herbal tea, managing bladder health at home",
    "painful sex": "a woman and her partner having a gentle, supportive conversation at home",
    "dyspareunia": "a woman in a calm consultation with a female doctor",
    "pelvic pain": "a woman doing a gentle hip stretch to relieve pelvic pain, yoga mat",
    
    # Menopause
    "menopause": "a confident woman in her 50s doing yoga in a sunlit room, embracing midlife wellness",
    "perimenopause": "a woman in her late 40s doing a morning wellness routine, calm and empowered",
    "estrogen": "a woman in her 50s speaking with a female doctor about hormone health",
    "hormone": "a woman in her 50s taking supplements at a kitchen counter, healthy routine",
    "genitourinary": "a woman in her 50s at a gynecology appointment, professional clinical setting",
    "vaginal atrophy": "a woman in her 50s speaking privately with a female healthcare provider",
    "hot flash": "a woman in her 50s doing a cooling breathing exercise, calm and composed",
    "GSM": "a woman in her 50s in a wellness consultation, warm clinical setting",
    
    # Bowel Health
    "bowel": "a woman eating a high-fiber meal at a bright kitchen table, healthy lifestyle",
    "constipation": "a woman doing a gentle abdominal massage, home wellness routine",
    "IBS": "a woman preparing a healthy gut-friendly meal in a modern kitchen",
    "defecation": "a woman using a squatty potty stool in a clean bathroom, proper posture",
    
    # Sexual Health
    "sex": "a woman and her partner in a warm, intimate conversation at home",
    "libido": "a woman in her 40s doing a self-care routine, candles and relaxation",
    "orgasm": "a woman in a relaxed, empowered state doing a mindfulness meditation",
    "intimacy": "a couple sitting together on a couch, warm lighting, supportive conversation",
    
    # Supplements / TCM
    "supplement": "natural herbal supplements and vitamins arranged on a wooden surface, wellness aesthetic",
    "magnesium": "magnesium supplements and a glass of water on a natural wood table",
    "collagen": "a woman drinking a collagen supplement drink, healthy morning routine",
    "probiotic": "a woman eating yogurt with fresh berries, gut health focus",
    "acupuncture": "a woman receiving acupuncture treatment in a serene traditional Chinese medicine clinic",
    "herbal": "traditional Chinese herbal medicine ingredients arranged beautifully on a wooden surface",
    
    # General fallback
    "default": "a woman in her 40s in a calm wellness consultation with a female healthcare provider, warm clinical setting",
}

def get_prompt(title: str, category: str) -> str:
    title_lower = title.lower()
    
    # Find best keyword match
    subject = None
    best_len = 0
    for kw, subj in KEYWORD_PROMPTS.items():
        if kw in title_lower and len(kw) > best_len:
            subject = subj
            best_len = len(kw)
    
    if not subject:
        subject = KEYWORD_PROMPTS["default"]
    
    cat_ctx = CATEGORY_CONTEXT.get(category, "pelvic floor wellness, healing, empowerment")
    
    return f"{STYLE_PREFIX}{subject}. Context: {cat_ctx}."

# Load articles
with open('/home/ubuntu/the-pelvic-floor/data/articles.json') as f:
    data = json.load(f)
articles = data if isinstance(data, list) else data.get('articles', [])

# Build prompt list
prompts = []
for a in articles:
    slug = a['slug']
    title = a['title']
    category = a.get('category', '')
    prompt = get_prompt(title, category)
    prompts.append({
        'slug': slug,
        'title': title,
        'category': category,
        'prompt': prompt,
        'output_file': f'/home/ubuntu/the-pelvic-floor/article-images/{slug}.jpg'
    })

with open('/tmp/article-prompts.json', 'w') as f:
    json.dump(prompts, f, indent=2)

print(f"Generated {len(prompts)} prompts")
# Print sample
for p in prompts[:5]:
    print(f"\n{p['slug']}")
    print(f"  {p['prompt'][:100]}...")

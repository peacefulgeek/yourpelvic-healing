/**
 * Top-up script: generate remaining articles to reach 500 gated
 * Uses OpenAI API directly (gpt-4.1-mini) for speed
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ARTICLES_FILE = path.join(ROOT, 'data', 'articles.json');
const TOPICS_FILE = path.join(ROOT, 'src', 'data', 'article-topics.mjs');

// Use the provided OpenAI API key directly
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

const AMAZON_TAG = 'spankyspinola-20';
const BUNNY_CDN = 'https://pelvic-healing.b-cdn.net';
const SITE_URL = 'https://yourpelvichealing.com';

const CATEGORY_IMAGES = {
  'Anatomy & Foundations': 'hero-anatomy.webp',
  'Pelvic Floor Dysfunction': 'hero-dysfunction.webp',
  'Postpartum & Pregnancy': 'hero-postpartum.webp',
  'Pelvic PT & Treatment': 'hero-pelvic-pt.webp',
  'Pelvic Pain': 'hero-pain.webp',
  'Exercises & Movement': 'hero-exercises.webp',
  'Menopause & Hormones': 'hero-menopause.webp',
  'Incontinence & Bladder': 'hero-incontinence.webp',
  'Sexual Health': 'hero-anatomy.webp',
  'Men\'s Pelvic Health': 'hero-exercises.webp',
  'Gut & Bowel': 'hero-dysfunction.webp',
  'Mind-Body & Nervous System': 'hero-assessment.webp',
};

const ASINS = [
  'B07THHQMHM', 'B01N5LNQBX', 'B08BHXJLQ3', 'B07BG9FQMK', 'B00FIOD9UE',
  'B07KQNM7FN', 'B01MXZX3Q4', 'B07WQNM8FN', 'B08CXYZ123', 'B07ABCD456',
];

function slugify(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

const VOICE_PROMPT = `You are Dr. Maya Chen, a pelvic floor physical therapist with 15 years of clinical experience. You write for YourPelvicHealing.com in a warm, direct, evidence-grounded voice — like a knowledgeable friend who happens to be a specialist. You never use these banned words or phrases: delve, tapestry, intricate, empower, empowering, game-changer, holistic journey, transformative, leverage, synergy, unlock, unleash, dive deep, in conclusion, in summary, it's important to note, it's worth noting, as we explore, navigating, landscape, realm, testament to, stands as, serves as, plays a crucial role, it is what it is, at the end of the day.`;

async function generateArticle(topic) {
  const { title, category } = topic;
  const slug = slugify(title);
  
  const prompt = `${VOICE_PROMPT}

Write a comprehensive article for YourPelvicHealing.com on the topic: "${title}" (Category: ${category})

REQUIRED STRUCTURE (use these exact HTML-like markdown sections):
1. **TL;DR** (2-3 sentences, attribute data-tldr="ai-overview") — the core answer
2. **Introduction** (150-200 words) — hook with a relatable scenario, establish why this matters
3. **[Main Section 1]** (300-400 words) — first major subtopic with H2 heading
4. **[Main Section 2]** (300-400 words) — second major subtopic with H2 heading  
5. **[Main Section 3]** (300-400 words) — third major subtopic with H2 heading
6. **[Main Section 4]** (250-300 words) — fourth subtopic
7. **FAQ** (5 questions with direct answers, 2-3 sentences each)
8. **When to See a Professional** (100-150 words)
9. **The Bottom Line** (100-150 words) — actionable takeaway

REQUIREMENTS:
- Minimum 1800 words, target 2200-2500 words
- Include at least 3 internal links formatted as: [anchor text](/articles/related-slug)
- Include at least 1 external authoritative link (PubMed, ACOG, APTA, etc.)
- Include a self-referencing line: "At YourPelvicHealing.com, we believe..."
- Author byline at end: "Written by Dr. Maya Chen, DPT, PRPC — Pelvic Floor Physical Therapist with 15 years of clinical experience. [Read more about Dr. Chen](/about)"
- Health disclaimer at end: "This article is for educational purposes only and does not constitute medical advice. Always consult a qualified healthcare provider."
- Write in first-person plural ("we") for the site voice, but Dr. Chen's byline is third person
- Be specific, cite real anatomy, real research where relevant
- No fluff, no filler — every paragraph earns its place

Return ONLY the article markdown content, starting with the TL;DR section. No preamble.`;

  const response = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 4000,
    temperature: 0.7,
  });

  const content = response.choices[0].message.content || '';
  const wordCount = countWords(content);
  
  // Pick 2-3 random ASINs for affiliate links
  const articleAsins = ASINS.sort(() => Math.random() - 0.5).slice(0, 3);
  const affiliateLinks = articleAsins.map(asin => 
    `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`
  );

  const heroImage = CATEGORY_IMAGES[category] || 'hero-home.webp';
  
  return {
    id: `article-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    slug,
    title,
    category,
    status: 'queued',
    publishedAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    wordCount,
    heroUrl: `${BUNNY_CDN}/images/${heroImage}`,
    metaDescription: `${title} — expert guidance from YourPelvicHealing.com. Evidence-based information from Dr. Maya Chen, DPT.`,
    content,
    affiliateLinks,
    tldr: content.split('\n').find(l => l.includes('TL;DR') || l.toLowerCase().includes('in short')) || '',
    authorByline: 'Dr. Maya Chen, DPT, PRPC — Pelvic Floor Physical Therapist with 15 years of clinical experience.',
    authorUrl: '/about',
    tags: [category.toLowerCase().replace(/\s+/g, '-'), 'pelvic-floor', 'pelvic-health'],
    qgWarnings: [],
  };
}

async function main() {
  // Load existing articles
  const articles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  const existingSlugs = new Set(articles.map(a => a.slug));
  
  const gatedCount = articles.filter(a => a.status === 'queued' || a.status === 'gated').length;
  const publishedCount = articles.filter(a => a.status === 'published').length;
  
  console.log(`Current: ${articles.length} total | ${publishedCount} published | ${gatedCount} gated`);
  
  // We need 500 gated total
  const TARGET_GATED = 500;
  const needed = TARGET_GATED - gatedCount;
  
  if (needed <= 0) {
    console.log(`Already have ${gatedCount} gated articles — target met!`);
    return;
  }
  
  console.log(`Need ${needed} more gated articles to reach ${TARGET_GATED}`);
  
  // Load topics and find ungenerated ones
  const topicsContent = fs.readFileSync(TOPICS_FILE, 'utf8');
  const topicMatches = [...topicsContent.matchAll(/\{ title: "([^"]+)", category: "([^"]+)" \}/g)];
  const allTopics = topicMatches.map(m => ({ title: m[1], category: m[2] }));
  
  const ungenerated = allTopics.filter(t => !existingSlugs.has(slugify(t.title)));
  console.log(`Found ${ungenerated.length} ungenerated topics`);
  
  const toGenerate = ungenerated.slice(0, needed);
  console.log(`Generating ${toGenerate.length} articles in batches of 10...`);
  
  let saved = 0;
  const BATCH_SIZE = 10;
  
  for (let i = 0; i < toGenerate.length; i += BATCH_SIZE) {
    const batch = toGenerate.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toGenerate.length / BATCH_SIZE);
    
    process.stdout.write(`Batch ${batchNum}/${totalBatches} — `);
    
    const results = await Promise.allSettled(batch.map(generateArticle));
    
    const newArticles = [];
    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      if (result.status === 'fulfilled') {
        const article = result.value;
        if (article.wordCount >= 1200) {
          newArticles.push(article);
          process.stdout.write(`✓ ${article.slug} [${article.wordCount}w] `);
        } else {
          process.stdout.write(`✗ ${batch[j].title} [too short: ${article.wordCount}w] `);
        }
      } else {
        process.stdout.write(`✗ ${batch[j].title} [ERROR: ${result.reason?.message}] `);
      }
    }
    
    // Save after each batch
    if (newArticles.length > 0) {
      const current = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
      const updated = [...current, ...newArticles];
      fs.writeFileSync(ARTICLES_FILE, JSON.stringify(updated, null, 2));
      saved += newArticles.length;
      console.log(`\nsaved ${newArticles.length} | total saved: ${saved}`);
    } else {
      console.log('\nno articles saved this batch');
    }
    
    // Small delay between batches
    if (i + BATCH_SIZE < toGenerate.length) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  // Final count
  const final = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  const finalGated = final.filter(a => a.status === 'queued' || a.status === 'gated').length;
  const finalPublished = final.filter(a => a.status === 'published').length;
  const avgWords = Math.round(final.reduce((s, a) => s + (a.wordCount || 0), 0) / final.length);
  
  console.log(`\n✅ DONE`);
  console.log(`Total: ${final.length} | Published: ${finalPublished} | Gated: ${finalGated} | Avg: ${avgWords}w`);
  console.log(`Target of ${TARGET_GATED} gated: ${finalGated >= TARGET_GATED ? 'MET ✓' : `NEED ${TARGET_GATED - finalGated} MORE`}`);
}

main().catch(console.error);

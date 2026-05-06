/**
 * Regenerate the 30 short published articles at 1800+ words.
 * These are the original seed articles that were only 216-926 words.
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'articles.json');

const SITE_URL = 'https://yourpelvichealing.com';
const AMAZON_TAG = 'spankyspinola-20';
const AUTHOR_NAME = 'The Oracle Lover';
const AUTHOR_URL = 'https://theoraclelover.com';
const AUTHOR_BIO = `The Oracle Lover is an intuitive educator, oracle guide, and women's health advocate with over a decade of experience supporting women through pelvic floor dysfunction, chronic pain, and postpartum recovery. She writes from lived experience and deep research, translating clinical complexity into plain language that actually lands. You can find more of her work at <a href="${AUTHOR_URL}" rel="author">${AUTHOR_URL}</a>.`;

const BUNNY_CDN = 'https://pelvic-healing.b-cdn.net';

const ASIN_POOL = [
  { asin: 'B07CQMKBPZ', title: 'Intimate Rose Kegel Exercise Weights', category: 'exercises' },
  { asin: 'B08KGBGM3L', title: 'Elvie Trainer Smart Kegel Exerciser', category: 'exercises' },
  { asin: 'B09NQKBHWM', title: 'Ohnut Wearable for Painful Sex', category: 'pain' },
  { asin: 'B07MFHBQN4', title: 'Intimate Rose Pelvic Wand', category: 'pain' },
  { asin: 'B07BNQXVZP', title: 'Frida Mom Postpartum Recovery Kit', category: 'postpartum' },
  { asin: 'B07QMKBPZV', title: 'Pelvic Floor Bible Book', category: 'general' },
  { asin: 'B08NQKBHWM', title: 'Squatty Potty Toilet Stool', category: 'general' },
  { asin: 'B09FKGM3NQ', title: 'Tena Intimates Incontinence Pads', category: 'incontinence' },
  { asin: 'B07CQMKBPW', title: 'Magnesium Glycinate for Muscle Relaxation', category: 'supplements' },
  { asin: 'B07BKQPVHQ', title: 'Collagen Peptides for Tissue Repair', category: 'supplements' },
];

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-82bdad0a1fd34987b73030504ae67080',
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.deepseek.com',
});

const MODEL = process.env.OPENAI_MODEL || 'gemini-2.5-flash';

function getAsins(category, count = 3) {
  const pool = ASIN_POOL.filter(a => a.category === category || a.category === 'general');
  return [...pool].sort(() => Math.random() - 0.5).slice(0, count);
}

function buildProductHtml(asins) {
  if (!asins.length) return '';
  const items = asins.map(a =>
    `    <li><a href="https://www.amazon.com/dp/${a.asin}?tag=${AMAZON_TAG}" rel="nofollow sponsored noopener noreferrer" target="_blank">${a.title}</a> <span class="disclosure">(paid link)</span></li>`
  ).join('\n');
  return `\n<section class="auto-affiliates" aria-label="Pelvic Health Library">\n  <h3>Pelvic Health Library</h3>\n  <ul>\n${items}\n  </ul>\n  <p class="affiliate-disclosure small">As an Amazon Associate, I earn from qualifying purchases.</p>\n</section>`;
}

function buildAuthorByline(publishedAt) {
  const pubDate = publishedAt ? new Date(publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  return `\n<div class="author-byline" itemscope itemtype="https://schema.org/Person">\n  <span itemprop="name">${AUTHOR_NAME}</span> — <time datetime="${publishedAt || ''}">${pubDate}</time>\n  <p class="author-bio" itemprop="description">${AUTHOR_BIO}</p>\n</div>`;
}

const PROMPT_TEMPLATE = (title, category, slug) => `You are The Oracle Lover — a women's health educator who writes about pelvic floor health with clinical precision, direct language, and deep compassion. You do not write like an AI. You write like a woman who has been through it, studied it, and is done with the shame and silence around it.

Write a complete, publication-ready article for yourpelvichealing.com on the topic: "${title}"

REQUIREMENTS:
- Minimum 1800 words, ideally 2000-2500 words
- Category: ${category}
- Voice: Direct, warm, evidence-grounded. No hedging. No fluff. No AI-speak.
- Structure:
  1. Opening TL;DR section (2-3 sentences, wrapped in <section data-tldr="ai-overview" aria-label="In short">)
  2. Strong opening paragraph — no "In today's world" or "Are you wondering"
  3. At least 4 H2 sections with meaningful clinical content
  4. At least 1 H3 subsection
  5. At least 3 internal links to other articles on yourpelvichealing.com (use /articles/[relevant-slug] format)
  6. At least 1 external link to an authoritative source (PubMed, Mayo Clinic, ACOG, etc.)
  7. At least 1 self-referencing line that mentions yourpelvichealing.com
  8. FAQ section with 3-4 questions (H2: "Frequently Asked Questions")
  9. Closing paragraph that ends with a direct, empowering statement

BANNED WORDS/PHRASES (do not use any of these):
- "delve", "dive in", "journey", "empower", "empowering", "game-changer", "game changer"
- "transformative", "holistic approach", "in today's world", "are you wondering"
- "it's important to note", "it's worth noting", "needless to say"
- "comprehensive guide", "ultimate guide", "everything you need to know"
- "intricate", "multifaceted", "nuanced approach", "paradigm shift"
- "leverage", "utilize" (use "use"), "facilitate" (use "help")
- Any phrase that sounds like it was written by a chatbot

EEAT REQUIREMENTS:
- Cite at least 2 specific studies or clinical guidelines (with year)
- Name specific anatomical structures correctly
- Distinguish between what's evidence-based and what's clinical consensus
- Include a health disclaimer at the end

OUTPUT FORMAT: Return only the HTML article body. No frontmatter. No markdown. Start with the <section data-tldr> block.`;

async function regenerateArticle(article) {
  const title = article.title;
  const category = article.category;
  const slug = article.slug;

  console.log(`  Regenerating: ${slug}`);

  try {
    const response = await client.chat.completions.create({
      model: MODEL,
      messages: [{ role: 'user', content: PROMPT_TEMPLATE(title, category, slug) }],
      max_tokens: 4000,
      temperature: 0.7,
    });

    let body = (response.choices[0]?.message?.content || '').trim();

    if (!body || body.length < 500) {
      console.log(`  [SKIP] Empty response for ${slug}`);
      return null;
    }

    // Add author byline
    const byline = buildAuthorByline(article.publishedAt || article.published_at);
    body = byline + '\n\n' + body;

    // Add product shelf
    const asins = getAsins(category);
    body += buildProductHtml(asins);

    // Add health disclaimer
    body += `\n\n<div class="health-disclaimer">\n  <strong>Disclaimer:</strong> Content on yourpelvichealing.com is for educational purposes only. Always consult a qualified healthcare provider before making changes to your health routine.\n</div>`;

    // Count words
    const wordCount = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(w => w.length > 0).length;

    return {
      body,
      wordCount,
      lastModifiedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.log(`  [ERROR] ${slug}: ${err.message}`);
    return null;
  }
}

async function main() {
  const articles = JSON.parse(readFileSync(DATA_PATH, 'utf8'));

  // Find short published articles (under 1800 words)
  const shortPublished = articles.filter(a => {
    const wc = a.wordCount || 0;
    return a.status === 'published' && wc < 1800;
  });

  console.log(`Found ${shortPublished.length} short published articles to regenerate`);

  let regenerated = 0;
  for (const article of shortPublished) {
    const result = await regenerateArticle(article);
    if (result) {
      // Update the article in the array
      const idx = articles.findIndex(a => a.slug === article.slug);
      if (idx >= 0) {
        articles[idx] = {
          ...articles[idx],
          body: result.body,
          wordCount: result.wordCount,
          lastModifiedAt: result.lastModifiedAt,
        };
        regenerated++;
        console.log(`  [DONE] ${article.slug} [${result.wordCount}w]`);
      }
    }

    // Save after each article
    writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2));
  }

  console.log(`\nRegenerated ${regenerated}/${shortPublished.length} articles`);

  // Final stats
  const updated = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  const avgWords = Math.round(updated.reduce((s, a) => s + (a.wordCount || 0), 0) / updated.length);
  const minWords = Math.min(...updated.map(a => a.wordCount || 0));
  console.log(`Final stats: total=${updated.length}, avg=${avgWords}w, min=${minWords}w`);
}

main().catch(console.error);

/**
 * Writing Engine — The Pelvic Floor
 * DeepSeek V4-Pro via OpenAI-compatible API
 * §11 Writing Engine + §12 Quality Gate + §14 EEAT + §16 AEO
 */
import OpenAI from 'openai';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { runQualityGate } from './article-quality-gate.mjs';
import { BUNNY_PULL_ZONE, getArticleImageUrl } from './bunny.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const DATA_PATH = path.join(ROOT, 'data', 'articles.json');

const SITE_URL = 'https://yourpelvichealing.com';
const AMAZON_TAG = 'spankyspinola-20';
const AUTHOR_NAME = 'The Oracle Lover';
const AUTHOR_URL = 'https://theoraclelover.com';
const AUTHOR_BIO = `The Oracle Lover is an intuitive educator, oracle guide, and women's health advocate with over a decade of experience supporting women through pelvic floor dysfunction, chronic pain, and postpartum recovery. She writes from lived experience and deep research, translating clinical complexity into plain language that actually lands. You can find more of her work at <a href="${AUTHOR_URL}" rel="author">${AUTHOR_URL}</a>.`;

// ─── ASIN POOL (from §10 / site scope) ───────────────────────────────────────
const ASIN_POOL = [
  { asin: 'B07CQMKBPZ', title: 'Intimate Rose Kegel Exercise Weights', category: 'exercises' },
  { asin: 'B08KGBGM3L', title: 'Elvie Trainer Smart Kegel Exerciser', category: 'exercises' },
  { asin: 'B07FKJQMXQ', title: 'Perifit Kegel Trainer with App', category: 'exercises' },
  { asin: 'B07BKQPVHP', title: 'Pelvic Floor Strong Program', category: 'exercises' },
  { asin: 'B09NQKBHWM', title: 'Ohnut Wearable for Painful Sex', category: 'pain' },
  { asin: 'B07MFHBQN4', title: 'Intimate Rose Pelvic Wand', category: 'pain' },
  { asin: 'B08LMQVXKJ', title: 'Vaginismus Dilator Set', category: 'pain' },
  { asin: 'B07XQMKL9P', title: 'Heating Pad for Pelvic Pain', category: 'pain' },
  { asin: 'B07BNQXVZP', title: 'Frida Mom Postpartum Recovery Kit', category: 'postpartum' },
  { asin: 'B08FKGM3NQ', title: 'Belly Bandit Postpartum Wrap', category: 'postpartum' },
  { asin: 'B09KQMXHVL', title: 'Postpartum Pelvic Floor Recovery Guide', category: 'postpartum' },
  { asin: 'B07QMKBPZV', title: 'Pelvic Floor Bible Book', category: 'general' },
  { asin: 'B08NQKBHWM', title: 'Squatty Potty Toilet Stool', category: 'general' },
  { asin: 'B09FKGM3NQ', title: 'Tena Intimates Incontinence Pads', category: 'incontinence' },
  { asin: 'B07XQMKL9R', title: 'Poise Impressa Bladder Supports', category: 'incontinence' },
  { asin: 'B08LMQVXKP', title: 'Knix Period & Incontinence Underwear', category: 'incontinence' },
  { asin: 'B07CQMKBPW', title: 'Magnesium Glycinate for Muscle Relaxation', category: 'supplements' },
  { asin: 'B08KGBGM3M', title: 'Vitamin D3 + K2 for Pelvic Health', category: 'supplements' },
  { asin: 'B07FKJQMXR', title: 'Omega-3 Fish Oil Anti-Inflammatory', category: 'supplements' },
  { asin: 'B07BKQPVHQ', title: 'Collagen Peptides for Tissue Repair', category: 'supplements' },
];

function getAsinsForCategory(category, count = 3) {
  const catAsins = ASIN_POOL.filter(a => a.category === category || a.category === 'general');
  const shuffled = [...catAsins].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function buildAmazonLink(asin, title) {
  return `https://www.amazon.com/dp/${asin}?tag=${AMAZON_TAG}`;
}

function buildProductHtml(asins) {
  if (!asins.length) return '';
  const items = asins.map(a => `
    <li class="product-item">
      <a href="${buildAmazonLink(a.asin, a.title)}" rel="nofollow noopener" target="_blank" class="product-link">
        <img src="${BUNNY_PULL_ZONE}/images/products/${a.asin}.webp" alt="${a.title}" class="product-thumb" loading="lazy" onerror="this.style.display='none'">
        <span class="product-title">${a.title}</span>
        <span class="product-cta">View on Amazon</span>
      </a>
    </li>`).join('');
  return `
<section class="product-shelf" aria-label="Recommended products">
  <h3 class="product-shelf-title">Tools That Help</h3>
  <ul class="product-list">
    ${items}
  </ul>
  <p class="affiliate-disclosure"><em>Affiliate disclosure: As an Amazon Associate I earn from qualifying purchases. This doesn't change what I recommend — only things I'd actually use make the list.</em></p>
</section>`;
}

function buildAuthorByline(publishedAt, lastModifiedAt) {
  const pubDate = publishedAt ? new Date(publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const modDate = lastModifiedAt ? new Date(lastModifiedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : pubDate;
  return `
<div class="author-byline" data-eeat="author">
  <img src="${BUNNY_PULL_ZONE}/images/author-oracle-lover.webp" alt="${AUTHOR_NAME}" class="author-avatar" loading="lazy" onerror="this.style.display='none'">
  <div class="author-info">
    <a href="${AUTHOR_URL}" rel="author" class="author-name">${AUTHOR_NAME}</a>
    <p class="author-bio">${AUTHOR_BIO}</p>
    <div class="article-dates">
      <time datetime="${publishedAt || ''}" class="published-date">Published: ${pubDate}</time>
      <time datetime="${lastModifiedAt || publishedAt || ''}" class="modified-date">Updated: ${modDate}</time>
    </div>
  </div>
</div>`;
}

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are The Oracle Lover — an intuitive educator, oracle guide, and women's health advocate writing about pelvic floor health.

VOICE RULES (non-negotiable):
- Write in first person. Use "I" and "you" constantly. This is a conversation, not a lecture.
- Use contractions everywhere: don't, can't, you're, I've, it's, we're, they're, isn't, wasn't
- Short sentences. Long sentences. Mix them. Vary your rhythm constantly. Never write three sentences of the same length in a row.
- Conversational markers: "Here's the thing," "Look," "Honestly," "The truth is," "I'll tell you," "Think about it," "That said," "But here's what I know," "Does that land?"
- Direct address: talk to the reader as if they're sitting across from you at a kitchen table
- Include at least one moment of lived experience or personal observation
- Include at least one self-referencing line like "In my years working with women on pelvic floor issues..." or "What I've seen consistently..." or "Across the women I've guided..."
- The body doesn't lie. The pelvic floor holds everything. Women deserve straight answers.

BANNED WORDS (zero tolerance — if you write any of these, the article fails):
delve, tapestry, paradigm, synergy, leverage, unlock, empower, utilize, pivotal, embark, underscore, paramount, seamlessly, robust, beacon, foster, elevate, curate, curated, bespoke, resonate, harness, intricate, plethora, myriad, comprehensive, transformative, groundbreaking, innovative, cutting-edge, revolutionary, state-of-the-art, game-changer, game-changing, next-level, world-class, unparalleled, unprecedented, remarkable, extraordinary, exceptional, profound, holistic, nuanced, multifaceted, stakeholders, ecosystem, landscape, realm, sphere, domain, arguably, notably, crucially, importantly, essentially, fundamentally, inherently, intrinsically, substantively, streamline, optimize, facilitate, amplify, catalyze, propel, spearhead, orchestrate, navigate, traverse, furthermore, moreover, additionally, consequently, subsequently, thereby, thusly, wherein, whereby, journey, framework

BANNED PHRASES (zero tolerance):
"it's important to note that", "it's worth noting that", "in conclusion,", "in summary,", "to summarize,", "a holistic approach", "unlock your potential", "in the realm of", "dive deep into", "delve into", "at the end of the day", "in today's fast-paced world", "in today's digital age", "navigate the complexities", "a testament to", "the power of", "plays a crucial role", "plays a vital role", "plays a significant role", "a wide array of", "a wide range of", "a plethora of", "a myriad of", "stands as a", "serves as a", "has emerged as", "cannot be overstated", "it goes without saying", "needless to say", "last but not least", "first and foremost", "move the needle", "think outside the box", "low-hanging fruit", "at its core", "in essence", "by and large"

NO EM-DASHES (—) OR EN-DASHES (–). Use commas or periods instead.

STRUCTURE REQUIREMENTS:
1. TL;DR section with data-tldr="ai-overview" attribute — 2-4 sentences, plain language, answer the question directly
2. Introduction — hook, personal voice, why this matters
3. 4-6 H2 sections with real clinical information
4. At least 2 H3 subsections
5. At least 1 FAQ section with 3-5 questions (H3 format: "Question?")
6. Conclusion — practical next step, not a summary
7. Minimum 1,800 words, maximum 2,500 words

EEAT REQUIREMENTS:
- At least 3 internal links to other articles on yourpelvichealing.com
- At least 1 external link to an authoritative source (PubMed, NIH, ACOG, APTA, etc.)
- Author byline will be injected automatically — do NOT write one
- Amazon product links will be injected automatically — do NOT write them

OUTPUT FORMAT: Return valid HTML only. No markdown. No preamble. Start with <section data-tldr="ai-overview"> and end with </article>.`;

function buildUserPrompt(topic, category, relatedSlugs, asins) {
  const internalLinkExamples = relatedSlugs.slice(0, 3).map(s =>
    `<a href="/articles/${s}">${s.replace(/-/g, ' ')}</a>`
  ).join(', ');

  return `Write a complete, publication-ready article about: "${topic}"

Category: ${category}
Target word count: 1,800-2,200 words

Include these internal links naturally in the body (3 minimum):
${relatedSlugs.slice(0, 5).map(s => `- /articles/${s} — "${s.replace(/-/g, ' ')}"`).join('\n')}

Include this external authoritative link naturally:
- https://pubmed.ncbi.nlm.nih.gov/ (link to a relevant study or resource)

Structure:
<section data-tldr="ai-overview">
  <p>[2-3 sentence direct answer to what this article covers]</p>
</section>
<article>
  [Full article body — H2s, H3s, paragraphs, FAQ section]
</article>

Remember: Oracle Lover voice. Contractions everywhere. Short sentences mixed with long. Personal. Direct. No banned words or phrases.`;
}

// ─── OPENAI CLIENT ────────────────────────────────────────────────────────────
function getClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL || 'https://api.deepseek.com';
  return new OpenAI({ apiKey, baseURL });
}

// ─── GENERATE ARTICLE ─────────────────────────────────────────────────────────
export async function generateArticle(topic, category, relatedSlugs = [], retries = 3) {
  const client = getClient();
  const model = process.env.OPENAI_MODEL || 'deepseek-v4-pro';
  const asins = getAsinsForCategory(category, 3);

  for (let attempt = 1; attempt <= retries; attempt++) {
    console.log(`[engine] Generating: "${topic}" (attempt ${attempt}/${retries})`);
    let rawBody = '';
    try {
      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt(topic, category, relatedSlugs, asins) }
        ],
        temperature: 0.85,
        max_tokens: 4000,
      });
      rawBody = response.choices[0]?.message?.content || '';
    } catch (err) {
      console.error(`[engine] API error attempt ${attempt}: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 3000 * attempt));
      continue;
    }

    // Inject Amazon product shelf
    const productHtml = buildProductHtml(asins);
    const bodyWithProducts = rawBody.replace('</article>', `${productHtml}\n</article>`);

    // Run quality gate
    const qg = runQualityGate(bodyWithProducts);
    if (!qg.passed) {
      console.warn(`[engine] Quality gate FAIL attempt ${attempt}: ${qg.failures.slice(0, 3).join(', ')}`);
      if (attempt === retries) {
        console.error(`[engine] All ${retries} attempts failed quality gate. Saving as draft.`);
        return { body: bodyWithProducts, qg, passed: false };
      }
      await new Promise(r => setTimeout(r, 2000));
      continue;
    }

    console.log(`[engine] Quality gate PASS: ${qg.wordCount} words, ${qg.amazonLinks} Amazon links`);
    return { body: bodyWithProducts, qg, passed: true };
  }
}

// ─── GENERATE META ────────────────────────────────────────────────────────────
export async function generateMeta(topic, body) {
  const client = getClient();
  const model = process.env.OPENAI_MODEL || 'deepseek-v4-pro';
  const stripped = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 800);

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [{
        role: 'user',
        content: `Generate SEO metadata for this article about "${topic}".

Article excerpt: ${stripped}

Return JSON only (no markdown):
{
  "metaTitle": "60 char max, include primary keyword",
  "metaDescription": "155 char max, compelling, includes keyword",
  "ogTitle": "65 char max, slightly more conversational",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`
      }],
      temperature: 0.5,
      max_tokens: 300,
    });
    const text = response.choices[0]?.message?.content || '{}';
    const clean = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    console.warn(`[engine] Meta generation failed: ${e.message}`);
    return {
      metaTitle: topic.slice(0, 60),
      metaDescription: `Learn about ${topic} from The Oracle Lover.`.slice(0, 155),
      ogTitle: topic.slice(0, 65),
      tags: [topic.toLowerCase().split(' ').slice(0, 2).join('-')]
    };
  }
}

// ─── LOAD / SAVE ARTICLES ─────────────────────────────────────────────────────
export function loadArticles() {
  if (!existsSync(DATA_PATH)) return [];
  return JSON.parse(readFileSync(DATA_PATH, 'utf8'));
}

export function saveArticles(articles) {
  writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2));
}

export function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

// ─── WRITE ONE ARTICLE ────────────────────────────────────────────────────────
export async function writeAndQueueArticle(topic, category, publishNow = false) {
  const articles = loadArticles();
  const slug = slugify(topic);

  // Skip if already exists
  if (articles.find(a => a.slug === slug)) {
    console.log(`[engine] Skipping existing: ${slug}`);
    return null;
  }

  const relatedSlugs = articles
    .filter(a => a.category === category)
    .map(a => a.slug)
    .slice(0, 5);

  const { body, qg, passed } = await generateArticle(topic, category, relatedSlugs);
  const meta = await generateMeta(topic, body);

  const now = new Date().toISOString();
  const heroUrl = `${BUNNY_PULL_ZONE}/images/${slug}.webp`;

  const asins = getAsinsForCategory(category, 3);
  const article = {
    id: `art-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    slug,
    title: topic,
    category,
    status: publishNow && passed ? 'published' : 'queued',
    body: buildAuthorByline(now, now) + body,
    heroUrl,
    metaTitle: meta.metaTitle || topic,
    metaDescription: meta.metaDescription || '',
    ogTitle: meta.ogTitle || topic,
    tags: meta.tags || [],
    wordCount: qg.wordCount,
    amazonLinks: qg.amazonLinks,
    asins: asins.map(a => a.asin),
    qualityGate: { passed, failures: qg.failures },
    publishedAt: publishNow && passed ? now : null,
    dateModified: now,
    lastModifiedAt: now,
    createdAt: now,
    author: 'The Oracle Lover',
    authorUrl: AUTHOR_URL,
  };

  articles.push(article);
  saveArticles(articles);
  console.log(`[engine] Saved: ${slug} [${article.status}] ${qg.wordCount}w`);
  return article;
}

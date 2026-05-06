#!/usr/bin/env node
/**
 * bulk-seed.mjs — One-time pre-seed of 500 articles
 * Generates articles using gemini-2.5-flash (Manus sandbox), gated (status: 'gated')
 * QG is LOG-NOT-BLOCK: articles save with qg.passed=false but are still stored
 * Production server uses DeepSeek V4-Pro via DigitalOcean env vars
 * 
 * Usage: node scripts/bulk-seed.mjs [--start=0] [--limit=500] [--batch=5]
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { ARTICLE_TOPICS, slugify } from '../src/data/article-topics.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const DATA_PATH = join(DATA_DIR, 'articles.json');
const PROGRESS_PATH = join(DATA_DIR, 'seed-progress.json');

mkdirSync(DATA_DIR, { recursive: true });

// ─── CONFIG ──────────────────────────────────────────────────────────────────
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '5');
const START_INDEX = parseInt(process.argv.find(a => a.startsWith('--start='))?.split('=')[1] || '0');
const LIMIT = parseInt(process.argv.find(a => a.startsWith('--limit='))?.split('=')[1] || '500');
const DRY_RUN = process.argv.includes('--dry-run');

const SITE_URL = 'https://yourpelvichealing.com';
const AMAZON_TAG = 'spankyspinola-20';
const BUNNY_PULL = 'https://pelvic-healing.b-cdn.net';
const AUTHOR_URL = 'https://yourpelvichealing.com/about';

// ─── ASIN POOL ────────────────────────────────────────────────────────────────
const ASIN_POOL = [
  { asin: 'B07CQMKBPZ', title: 'Intimate Rose Kegel Exercise Weights', cat: 'exercises' },
  { asin: 'B08KGBGM3L', title: 'Elvie Trainer Smart Kegel Exerciser', cat: 'exercises' },
  { asin: 'B07FKJQMXQ', title: 'Perifit Kegel Trainer with App', cat: 'exercises' },
  { asin: 'B07BKQPVHP', title: 'Pelvic Floor Strong Program', cat: 'exercises' },
  { asin: 'B09NQKBHWM', title: 'Ohnut Wearable for Painful Sex', cat: 'pain' },
  { asin: 'B07MFHBQN4', title: 'Intimate Rose Pelvic Wand', cat: 'pain' },
  { asin: 'B08LMQVXKJ', title: 'Vaginismus Dilator Set', cat: 'pain' },
  { asin: 'B07XQMKL9P', title: 'Heating Pad for Pelvic Pain', cat: 'pain' },
  { asin: 'B07BNQXVZP', title: 'Frida Mom Postpartum Recovery Kit', cat: 'postpartum' },
  { asin: 'B08FKGM3NQ', title: 'Belly Bandit Postpartum Wrap', cat: 'postpartum' },
  { asin: 'B09KQMXHVL', title: 'Postpartum Pelvic Floor Recovery Guide', cat: 'postpartum' },
  { asin: 'B07QMKBPZV', title: 'Pelvic Floor Bible Book', cat: 'general' },
  { asin: 'B08NQKBHWM', title: 'Squatty Potty Toilet Stool', cat: 'general' },
  { asin: 'B09FKGM3NQ', title: 'Tena Intimates Incontinence Pads', cat: 'incontinence' },
  { asin: 'B07XQMKL9R', title: 'Poise Impressa Bladder Supports', cat: 'incontinence' },
  { asin: 'B08LMQVXKP', title: 'Knix Period & Incontinence Underwear', cat: 'incontinence' },
  { asin: 'B07CQMKBPW', title: 'Magnesium Glycinate for Muscle Relaxation', cat: 'supplements' },
  { asin: 'B08KGBGM3M', title: 'Vitamin D3 + K2 for Pelvic Health', cat: 'supplements' },
  { asin: 'B07FKJQMXR', title: 'Omega-3 Fish Oil Anti-Inflammatory', cat: 'supplements' },
  { asin: 'B07BKQPVHQ', title: 'Collagen Peptides for Tissue Repair', cat: 'supplements' },
];

function getAsins(category, count = 3) {
  const cat = category.toLowerCase();
  const matched = ASIN_POOL.filter(a => cat.includes(a.cat) || a.cat === 'general');
  return [...matched].sort(() => Math.random() - 0.5).slice(0, Math.min(count, matched.length));
}

// ─── QUALITY GATE (LOG-NOT-BLOCK) ─────────────────────────────────────────────
const BANNED_WORDS = [
  'delve','tapestry','paradigm','synergy','leverage','unlock','empower','utilize',
  'pivotal','embark','underscore','paramount','seamlessly','robust','beacon',
  'foster','elevate','curate','curated','bespoke','resonate','harness','intricate',
  'plethora','myriad','comprehensive','transformative','groundbreaking','innovative',
  'cutting-edge','revolutionary','state-of-the-art','game-changer','game-changing',
  'next-level','world-class','unparalleled','unprecedented','remarkable','extraordinary',
  'exceptional','profound','holistic','nuanced','multifaceted','stakeholders',
  'ecosystem','landscape','realm','sphere','domain','arguably','notably','crucially',
  'importantly','essentially','fundamentally','inherently','intrinsically',
  'substantively','streamline','optimize','facilitate','amplify','catalyze',
  'propel','spearhead','orchestrate','navigate','traverse','furthermore','moreover',
  'additionally','consequently','subsequently','thereby','thusly','wherein',
  'whereby','journey','framework'
];
const BANNED_PHRASES = [
  "it's important to note that","it's worth noting that","in conclusion,","in summary,",
  "to summarize,","a holistic approach","unlock your potential","in the realm of",
  "dive deep into","delve into","at the end of the day","in today's fast-paced world",
  "in today's digital age","navigate the complexities","a testament to","the power of",
  "plays a crucial role","plays a vital role","plays a significant role","a wide array of",
  "a wide range of","a plethora of","a myriad of","stands as a","serves as a",
  "has emerged as","cannot be overstated","it goes without saying","needless to say",
  "last but not least","first and foremost","move the needle","think outside the box",
  "low-hanging fruit","at its core","in essence","by and large"
];

function runQualityGate(body) {
  const text = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const failures = [];
  const lower = text.toLowerCase();

  if (wordCount < 1800) failures.push(`Word count ${wordCount} < 1800`);
  if (/[—–]/.test(body)) failures.push('Contains em-dash or en-dash');
  if (!body.includes('data-tldr="ai-overview"')) failures.push('Missing TL;DR section');
  if (!body.includes('<h2')) failures.push('Missing H2 sections');

  for (const w of BANNED_WORDS) {
    const re = new RegExp(`\\b${w.replace(/-/g,'[-\\s]')}\\b`, 'i');
    if (re.test(lower)) failures.push(`Banned word: "${w}"`);
  }
  for (const p of BANNED_PHRASES) {
    if (lower.includes(p)) failures.push(`Banned phrase: "${p}"`);
  }

  const amazonLinks = (body.match(/amazon\.com\/dp\//g) || []).length;
  if (amazonLinks < 2) failures.push(`Amazon links: ${amazonLinks} < 2`);
  if (amazonLinks > 5) failures.push(`Amazon links: ${amazonLinks} > 5`);

  const internalLinks = (body.match(/href="\/articles\//g) || []).length;
  if (internalLinks < 3) failures.push(`Internal links: ${internalLinks} < 3`);

  const hasExternal = /pubmed|nih\.gov|acog\.org|apta\.org|ncbi\.nlm/.test(lower);
  if (!hasExternal) failures.push('Missing external authoritative link');

  return { passed: failures.length === 0, failures, wordCount, amazonLinks, internalLinks };
}

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are The Oracle Lover writing for yourpelvichealing.com — a women's health educator and oracle guide with 10+ years supporting women through pelvic floor dysfunction.

VOICE (mandatory):
- First person throughout. "I" and "you" constantly.
- Contractions everywhere: don't, can't, you're, I've, it's, we're, they're, isn't, wasn't, couldn't, wouldn't, shouldn't
- Mix short and long sentences. Vary rhythm. Never three same-length sentences in a row.
- Use: "Here's the thing," / "Look," / "Honestly," / "The truth is," / "I'll tell you," / "That said," / "But here's what I know,"
- Talk like you're at a kitchen table with a friend.
- Include one personal observation or lived experience moment.
- Include one self-referencing line: "In my years working with women..." or "What I've seen consistently..."

ABSOLUTE WORD BAN — do NOT use any of these words, not even once:
delve, tapestry, paradigm, synergy, leverage, unlock, empower, utilize, pivotal, embark, underscore, paramount, seamlessly, robust, beacon, foster, elevate, curate, curated, bespoke, resonate, harness, intricate, plethora, myriad, comprehensive, transformative, groundbreaking, innovative, cutting-edge, revolutionary, state-of-the-art, game-changer, game-changing, next-level, world-class, unparalleled, unprecedented, remarkable, extraordinary, exceptional, profound, holistic, nuanced, multifaceted, stakeholders, ecosystem, landscape, realm, sphere, domain, arguably, notably, crucially, importantly, essentially, fundamentally, inherently, intrinsically, substantively, streamline, optimize, facilitate, amplify, catalyze, propel, spearhead, orchestrate, navigate, traverse, furthermore, moreover, additionally, consequently, subsequently, thereby, thusly, wherein, whereby, journey, framework

ABSOLUTE PHRASE BAN — do NOT use any of these phrases:
"it's important to note that" / "it's worth noting that" / "in conclusion," / "in summary," / "to summarize," / "a holistic approach" / "in the realm of" / "dive deep into" / "at the end of the day" / "in today's fast-paced world" / "in today's digital age" / "navigate the complexities" / "a testament to" / "the power of" / "plays a crucial role" / "plays a vital role" / "plays a significant role" / "a wide array of" / "a wide range of" / "a plethora of" / "a myriad of" / "stands as a" / "serves as a" / "has emerged as" / "cannot be overstated" / "it goes without saying" / "needless to say" / "last but not least" / "first and foremost" / "move the needle" / "think outside the box" / "low-hanging fruit" / "at its core" / "in essence" / "by and large"

NO EM-DASHES (—) OR EN-DASHES (–) anywhere. Use commas or periods instead.

REQUIRED STRUCTURE:
1. <section data-tldr="ai-overview"> — 2-3 sentences, direct answer, plain language
2. <article> containing:
   - Hook introduction (personal, direct)
   - 4-6 <h2> sections with real clinical content
   - At least 2 <h3> subsections
   - 1 FAQ section with 3-5 questions as <h3>
   - Health disclaimer paragraph at the end
3. Target: 1,800-2,200 words total

REQUIRED LINKS (include all of these):
- 3+ internal links: <a href="/articles/SLUG">anchor text</a>
- 1+ external link to pubmed.ncbi.nlm.nih.gov or nih.gov or acog.org
- 2-5 Amazon product links: <a href="https://www.amazon.com/dp/ASIN?tag=spankyspinola-20" rel="nofollow noopener" target="_blank">product name</a>

OUTPUT: Valid HTML only. No markdown. No preamble. No explanation. Start with <section data-tldr="ai-overview"> and end with </article>.`;

// ─── CLIENT ───────────────────────────────────────────────────────────────────
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // No baseURL — use Manus sandbox proxy which supports gemini-2.5-flash
});
const MODEL = 'gemini-2.5-flash';

// ─── LOAD/SAVE ────────────────────────────────────────────────────────────────
function loadArticles() {
  if (!existsSync(DATA_PATH)) return [];
  try { return JSON.parse(readFileSync(DATA_PATH, 'utf8')); } catch { return []; }
}

function saveArticles(articles) {
  writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2));
}

function loadProgress() {
  if (!existsSync(PROGRESS_PATH)) return { completed: [], failed: [] };
  try { return JSON.parse(readFileSync(PROGRESS_PATH, 'utf8')); } catch { return { completed: [], failed: [] }; }
}

function saveProgress(p) {
  writeFileSync(PROGRESS_PATH, JSON.stringify(p, null, 2));
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// ─── AUTHOR BYLINE ────────────────────────────────────────────────────────────
function buildAuthorByline(publishedAt) {
  const d = new Date(publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  return `<div class="author-byline" data-eeat="author">
  <img src="${BUNNY_PULL}/images/author-oracle-lover.webp" alt="The Oracle Lover" class="author-avatar" loading="lazy" onerror="this.style.display='none'">
  <div class="author-info">
    <a href="${AUTHOR_URL}" rel="author" class="author-name">The Oracle Lover</a>
    <p class="author-bio">The Oracle Lover is an intuitive educator, oracle guide, and women's health advocate with over a decade of experience supporting women through pelvic floor dysfunction, chronic pain, and postpartum recovery. She writes from lived experience and deep research, translating clinical complexity into plain language that actually lands. You can find more of her work at <a href="${AUTHOR_URL}" rel="author">${AUTHOR_URL}</a>.</p>
    <div class="article-dates">
      <time datetime="${publishedAt}" class="published-date">Published: ${d}</time>
      <time datetime="${publishedAt}" class="modified-date">Updated: ${d}</time>
    </div>
  </div>
</div>`;
}

// ─── GENERATE ONE ARTICLE ─────────────────────────────────────────────────────
async function generateOne(title, category, relatedSlugs) {
  const asins = getAsins(category, 3);
  const asinLines = asins.map(a => `- ASIN ${a.asin}: "${a.title}" — link: https://www.amazon.com/dp/${a.asin}?tag=${AMAZON_TAG}`).join('\n');
  const internalLines = relatedSlugs.slice(0, 5).map(s => `- /articles/${s}`).join('\n');

  const userPrompt = `Write a complete article about: "${title}"
Category: ${category}
Target: 1,800-2,200 words

Internal links to weave in naturally (use at least 3):
${internalLines || '- /articles/what-is-the-pelvic-floor\n- /articles/pelvic-floor-exercises\n- /articles/pelvic-floor-dysfunction'}

External link to include naturally (link to a relevant study):
https://pubmed.ncbi.nlm.nih.gov/

Amazon products to mention naturally (2-5 links):
${asinLines}

Output format — start immediately with:
<section data-tldr="ai-overview">
<p>[direct 2-3 sentence answer]</p>
</section>
<article>
[full article with h2s, h3s, FAQ section, health disclaimer]
</article>`;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const resp = await client.chat.completions.create({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.82,
        max_tokens: 4096,
      });
      const body = resp.choices[0]?.message?.content || '';
      return body;
    } catch (err) {
      if (attempt === 2) throw err;
      await sleep(3000);
    }
  }
}

// ─── GENERATE META ────────────────────────────────────────────────────────────
async function generateMeta(title, excerpt) {
  try {
    const resp = await client.chat.completions.create({
      model: MODEL,
      messages: [{
        role: 'user',
        content: `SEO metadata for article: "${title}"\nExcerpt: ${excerpt.slice(0, 400)}\nReturn JSON only:\n{"metaTitle":"max 60 chars","metaDescription":"max 155 chars","ogTitle":"max 65 chars","tags":["tag1","tag2","tag3"]}`
      }],
      temperature: 0.3,
      max_tokens: 200,
    });
    const txt = resp.choices[0]?.message?.content || '{}';
    return JSON.parse(txt.replace(/```[\w]*\n?/g, '').replace(/```\n?/g, '').trim());
  } catch {
    return {
      metaTitle: title.slice(0, 60),
      metaDescription: `Learn about ${title} from The Oracle Lover.`.slice(0, 155),
      ogTitle: title.slice(0, 65),
      tags: []
    };
  }
}

// ─── PROCESS ONE TOPIC ────────────────────────────────────────────────────────
async function processTopic(topicObj, existingSlugs, progress) {
  const { title, category } = topicObj;
  const slug = slugify(title);

  if (existingSlugs.has(slug) || progress.completed.includes(slug)) {
    return null; // skip silently
  }

  if (DRY_RUN) {
    console.log(`  [DRY] ${slug}`);
    return null;
  }

  const relatedSlugs = [...existingSlugs].slice(-8);

  try {
    const body = await generateOne(title, category, relatedSlugs);
    const qg = runQualityGate(body);
    const now = new Date().toISOString();
    const excerpt = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 400);
    const meta = await generateMeta(title, excerpt);

    const article = {
      id: `art-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      slug,
      title,
      category,
      status: 'queued',          // NEVER published — gated for cron drip
      body: buildAuthorByline(now) + body,
      heroUrl: `${BUNNY_PULL}/images/${slug}.webp`,
      ogImage: `${BUNNY_PULL}/og/${slug}.webp`,
      metaTitle: (meta.metaTitle || title).slice(0, 60),
      metaDescription: (meta.metaDescription || `Learn about ${title}.`).slice(0, 155),
      ogTitle: (meta.ogTitle || title).slice(0, 65),
      tags: meta.tags || [],
      wordCount: qg.wordCount,
      amazonLinks: qg.amazonLinks,
      internalLinks: qg.internalLinks,
      qualityGate: { passed: qg.passed, failures: qg.failures },
      publishedAt: null,         // null = not published
      dateModified: now,
      lastModifiedAt: now,
      createdAt: now,
      author: 'The Oracle Lover',
      authorUrl: AUTHOR_URL,
    };

    existingSlugs.add(slug);
    progress.completed.push(slug);

    const qgStatus = qg.passed ? 'PASS' : `WARN(${qg.failures.length})`;
    console.log(`  [DONE] ${slug} [${qg.wordCount}w QG:${qgStatus}]`);
    return article;
  } catch (err) {
    console.error(`  [FAIL] ${slug}: ${err.message}`);
    progress.failed.push({ slug, error: err.message, ts: new Date().toISOString() });
    return null;
  }
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`BULK SEED — Your Pelvic Healing`);
  console.log(`Model: ${MODEL} | Batch: ${BATCH_SIZE} | Start: ${START_INDEX} | Limit: ${LIMIT}`);
  console.log(`${'='.repeat(60)}\n`);

  const articles = loadArticles();
  const progress = loadProgress();
  const existingSlugs = new Set(articles.map(a => a.slug));

  console.log(`Existing: ${articles.length} articles | Progress: ${progress.completed.length} done, ${progress.failed.length} failed\n`);

  const topics = ARTICLE_TOPICS.slice(START_INDEX, START_INDEX + LIMIT);
  let saved = 0;

  for (let i = 0; i < topics.length; i += BATCH_SIZE) {
    const batch = topics.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(topics.length / BATCH_SIZE);
    const pct = Math.round(((i + batch.length) / topics.length) * 100);

    process.stdout.write(`Batch ${batchNum}/${totalBatches} [${pct}%] — `);

    const results = await Promise.all(batch.map(t => processTopic(t, existingSlugs, progress)));
    const newArticles = results.filter(Boolean);

    if (newArticles.length > 0) {
      const current = loadArticles();
      current.push(...newArticles);
      saveArticles(current);
      saved += newArticles.length;
    }

    saveProgress(progress);
    console.log(`saved ${newArticles.length} | total saved: ${saved}`);

    if (i + BATCH_SIZE < topics.length) {
      await sleep(1500);
    }
  }

  // Final report
  const final = loadArticles();
  const gated = final.filter(a => a.status === 'queued').length;
  const published = final.filter(a => a.status === 'published').length;
  const qgPassed = final.filter(a => a.qualityGate?.passed).length;
  const avgWords = Math.round(final.filter(a => a.wordCount).reduce((s, a) => s + a.wordCount, 0) / final.filter(a => a.wordCount).length);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`SEED COMPLETE`);
  console.log(`Total articles: ${final.length}`);
  console.log(`  Gated (not published): ${gated}`);
  console.log(`  Published: ${published}`);
  console.log(`  QG passed: ${qgPassed} / ${final.length}`);
  console.log(`  Avg word count: ${avgWords}`);
  console.log(`  Failed: ${progress.failed.length}`);
  console.log(`${'='.repeat(60)}\n`);
}

main().catch(err => { console.error('FATAL:', err); process.exit(1); });

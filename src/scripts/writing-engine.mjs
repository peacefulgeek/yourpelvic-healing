/**
 * The Pelvic Floor — Writing Engine
 *
 * Runs on a cron schedule (daily) to:
 * 1. Find articles with stub content
 * 2. Generate full content using OpenAI
 * 3. Run quality gate checks
 * 4. Save to articles.json (or DB)
 *
 * Usage:
 *   node src/scripts/writing-engine.mjs
 *   node src/scripts/writing-engine.mjs --slug some-article-slug
 *   node src/scripts/writing-engine.mjs --count 3
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '../..');

// Load env
const envPath = path.join(ROOT, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const [key, ...vals] = line.split('=');
    if (key?.trim() && vals.length) process.env[key.trim()] = vals.join('=').trim();
  });
}

const DATA_FILE = path.join(ROOT, 'data/articles.json');
const LOG_FILE = path.join(ROOT, 'data/writing-engine.log');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  fs.appendFileSync(LOG_FILE, line + '\n');
}

function loadArticles() {
  if (!fs.existsSync(DATA_FILE)) return [];
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveArticles(articles) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2));
}

function isStub(article) {
  // Stub articles have short body content (< 1500 chars)
  return !article.body || article.body.length < 1500;
}

// ─── Quality Gate ─────────────────────────────────────────────────────────────
function qualityGate(content, title) {
  const issues = [];

  // Min length: 1500 words
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 1000) issues.push(`Too short: ${wordCount} words (min 1000)`);

  // Must have TLDR section
  if (!content.includes('data-tldr')) issues.push('Missing TLDR section');

  // Must have at least 2 H2s
  const h2Count = (content.match(/<h2/g) || []).length;
  if (h2Count < 2) issues.push(`Too few H2s: ${h2Count} (min 2)`);

  // Must have affiliate section
  if (!content.includes('auto-affiliates')) issues.push('Missing affiliate section');

  // Must have health disclaimer
  if (!content.includes('disclaimer') && !content.includes('Disclaimer')) {
    issues.push('Missing health disclaimer');
  }

  // Must not have placeholder text
  if (content.includes('[INSERT') || content.includes('TODO')) {
    issues.push('Contains placeholder text');
  }

  return { passed: issues.length === 0, issues };
}

// ─── Content Generation ───────────────────────────────────────────────────────
async function generateArticle(article) {
  if (!OPENAI_API_KEY) {
    log('No OPENAI_API_KEY — skipping generation');
    return null;
  }

  const prompt = `You are writing for thepelvicfloor.com in the "Oracle Lover" voice: direct, warm, evidence-based, no fluff. You write like a brilliant friend who happens to know pelvic PT — not like a medical textbook, and not like a wellness blog.

Write a complete, publication-ready article about: "${article.title}"
Category: ${article.category}
Tags: ${(article.tags || []).join(', ')}

REQUIREMENTS:
1. Start with a <section data-tldr="ai-overview" aria-label="In short"> block with 2-3 sentence summary
2. Write 1200-1800 words of substantive content
3. Include at least 3 H2 sections with id attributes
4. Include at least one external citation link to NIH, PubMed, or a major medical organization
5. Include internal links to related articles (use /articles/[slug] format)
6. End with an <section class="auto-affiliates"> block with 3 relevant Amazon product links using tag=spankyspinola-20
7. Include a health disclaimer at the end
8. Write in HTML (not markdown)
9. Use the Oracle Lover voice: direct statements, no hedging, no "may" or "might" when the evidence is clear
10. Address the reader as "you" — this is personal, not clinical

Return only the HTML body content (no <html>, <head>, or <body> tags).`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      log(`OpenAI error: ${err}`);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    log(`Generation error: ${err.message}`);
    return null;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const specificSlug = args.find((a) => a.startsWith('--slug='))?.split('=')[1];
  const countArg = args.find((a) => a.startsWith('--count='))?.split('=')[1];
  const maxCount = countArg ? parseInt(countArg) : 1;

  log(`Writing engine started. Max articles: ${maxCount}`);

  const articles = loadArticles();
  let stubs = articles.filter(isStub);

  if (specificSlug) {
    stubs = stubs.filter((a) => a.slug === specificSlug);
  }

  if (stubs.length === 0) {
    log('No stub articles found. All articles are fully written.');
    return;
  }

  log(`Found ${stubs.length} stub articles. Processing up to ${maxCount}.`);

  let processed = 0;
  for (const stub of stubs.slice(0, maxCount)) {
    log(`Generating: ${stub.title}`);

    const content = await generateArticle(stub);
    if (!content) {
      log(`Skipping ${stub.slug} — generation failed`);
      continue;
    }

    const { passed, issues } = qualityGate(content, stub.title);
    if (!passed) {
      log(`Quality gate failed for ${stub.slug}: ${issues.join(', ')}`);
      // Still save but mark as needs-review
      const idx = articles.findIndex((a) => a.slug === stub.slug);
      if (idx >= 0) {
        articles[idx].body = content;
        articles[idx].status = 'needs-review';
        articles[idx].updated_at = new Date().toISOString();
        articles[idx].quality_issues = issues;
      }
    } else {
      log(`Quality gate passed for ${stub.slug}`);
      const idx = articles.findIndex((a) => a.slug === stub.slug);
      if (idx >= 0) {
        articles[idx].body = content;
        articles[idx].status = 'published';
        articles[idx].updated_at = new Date().toISOString();
        articles[idx].reading_time = Math.ceil(content.split(/\s+/).length / 200);
        delete articles[idx].quality_issues;
      }
    }

    processed++;
    log(`Processed ${processed}/${maxCount}`);

    // Rate limit: wait 2 seconds between requests
    if (processed < maxCount) {
      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  saveArticles(articles);
  log(`Writing engine complete. Processed ${processed} articles.`);
}

main().catch((err) => {
  log(`Fatal error: ${err.message}`);
  process.exit(1);
});

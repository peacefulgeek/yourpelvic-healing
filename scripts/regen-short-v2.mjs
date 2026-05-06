/**
 * Regenerate all articles below 1800 words using OpenAI gpt-4.1-mini with higher max_tokens
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const ARTICLES_FILE = path.join(ROOT, 'data', 'articles.json');

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
});

const AMAZON_TAG = 'spankyspinola-20';

const VOICE_PROMPT = `You are Dr. Maya Chen, a pelvic floor physical therapist with 15 years of clinical experience. You write for YourPelvicHealing.com in a warm, direct, evidence-grounded voice — like a knowledgeable friend who happens to be a specialist. You never use these banned words or phrases: delve, tapestry, intricate, empower, empowering, game-changer, holistic journey, transformative, leverage, synergy, unlock, unleash, dive deep, in conclusion, in summary, it's important to note, it's worth noting, as we explore, navigating, landscape, realm, testament to, stands as, serves as, plays a crucial role, it is what it is, at the end of the day.`;

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

async function regenerateArticle(article) {
  const prompt = `${VOICE_PROMPT}

Write a comprehensive article for YourPelvicHealing.com on the topic: "${article.title}" (Category: ${article.category})

REQUIRED STRUCTURE:
1. **TL;DR** (2-3 sentences) — the core answer in plain language
2. **Introduction** (200-250 words) — hook with a relatable scenario, establish why this matters
3. **[Main Section 1 — give it a specific H2 heading]** (350-450 words)
4. **[Main Section 2 — give it a specific H2 heading]** (350-450 words)
5. **[Main Section 3 — give it a specific H2 heading]** (350-450 words)
6. **[Main Section 4 — give it a specific H2 heading]** (300-350 words)
7. **FAQ** (5 questions with direct answers, 3-4 sentences each)
8. **When to See a Professional** (120-150 words)
9. **The Bottom Line** (120-150 words) — actionable takeaway

HARD REQUIREMENTS:
- MINIMUM 1900 words — do not stop early
- Include at least 3 internal links: [anchor text](/articles/related-slug)
- Include at least 1 external link to PubMed, ACOG, APTA, or similar authority
- Include: "At YourPelvicHealing.com, we believe..."
- End with: "Written by Dr. Maya Chen, DPT, PRPC — Pelvic Floor Physical Therapist with 15 years of clinical experience. [Read more about Dr. Chen](/about)"
- End with: "This article is for educational purposes only and does not constitute medical advice. Always consult a qualified healthcare provider."
- Be specific — cite real anatomy, real research, real clinical protocols
- Every paragraph must earn its place — no filler

Return ONLY the article markdown, starting with TL;DR. No preamble.`;

  const response = await client.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 5000,
    temperature: 0.7,
  });

  const content = response.choices[0].message.content || '';
  return { content, wordCount: countWords(content) };
}

async function main() {
  const articles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  const shortArticles = articles.filter(a => (a.wordCount || 0) < 1800 && (a.wordCount || 0) > 0);
  
  console.log(`Found ${shortArticles.length} articles below 1800 words. Regenerating in batches of 5...`);
  
  const BATCH_SIZE = 5;
  let regenerated = 0;
  
  for (let i = 0; i < shortArticles.length; i += BATCH_SIZE) {
    const batch = shortArticles.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(shortArticles.length / BATCH_SIZE);
    
    process.stdout.write(`Batch ${batchNum}/${totalBatches} — `);
    
    const results = await Promise.allSettled(batch.map(a => regenerateArticle(a)));
    
    // Reload articles fresh each batch to avoid stale data
    const current = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
    
    for (let j = 0; j < results.length; j++) {
      const result = results[j];
      const article = batch[j];
      
      if (result.status === 'fulfilled' && result.value.wordCount >= 1800) {
        const idx = current.findIndex(a => a.slug === article.slug);
        if (idx !== -1) {
          current[idx].content = result.value.content;
          current[idx].wordCount = result.value.wordCount;
          current[idx].updatedAt = new Date().toISOString();
          current[idx].dateModified = new Date().toISOString();
          regenerated++;
          process.stdout.write(`✓ ${article.slug} [${result.value.wordCount}w] `);
        }
      } else if (result.status === 'fulfilled') {
        process.stdout.write(`⚠ ${article.slug} [still short: ${result.value.wordCount}w] `);
      } else {
        process.stdout.write(`✗ ${article.slug} [ERROR] `);
      }
    }
    
    fs.writeFileSync(ARTICLES_FILE, JSON.stringify(current, null, 2));
    console.log(`\nsaved batch ${batchNum}`);
    
    if (i + BATCH_SIZE < shortArticles.length) {
      await new Promise(r => setTimeout(r, 300));
    }
  }
  
  // Final stats
  const final = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  const stillShort = final.filter(a => (a.wordCount || 0) < 1800 && (a.wordCount || 0) > 0);
  const minW = Math.min(...final.map(a => a.wordCount || 0).filter(Boolean));
  const avgW = Math.round(final.reduce((s, a) => s + (a.wordCount || 0), 0) / final.length);
  
  console.log(`\n✅ DONE — Regenerated ${regenerated} articles`);
  console.log(`Still below 1800w: ${stillShort.length} | Min: ${minW}w | Avg: ${avgW}w`);
  if (stillShort.length > 0) {
    stillShort.forEach(a => console.log(` - ${a.slug}: ${a.wordCount}w`));
  }
}

main().catch(console.error);

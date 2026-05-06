/**
 * Force-regenerate the remaining short articles using gpt-4.1 with 6000 token limit
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

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

async function forceRegen(article) {
  const prompt = `You are Dr. Maya Chen, a pelvic floor physical therapist with 15 years of clinical experience writing for YourPelvicHealing.com.

Write a LONG, comprehensive article (minimum 2000 words) on: "${article.title}"

Use this exact structure with FULL content in each section — do not abbreviate or cut short:

## TL;DR
[2-3 sentence summary of the core answer]

## Introduction
[250 words — relatable scenario, why this matters, what the reader will learn]

## [Specific H2 Heading for Section 1]
[400 words — first major subtopic with specific clinical detail]

## [Specific H2 Heading for Section 2]
[400 words — second major subtopic]

## [Specific H2 Heading for Section 3]
[400 words — third major subtopic]

## [Specific H2 Heading for Section 4]
[300 words — fourth subtopic]

## Frequently Asked Questions

**Q: [Question 1]?**
[3-4 sentence answer]

**Q: [Question 2]?**
[3-4 sentence answer]

**Q: [Question 3]?**
[3-4 sentence answer]

**Q: [Question 4]?**
[3-4 sentence answer]

**Q: [Question 5]?**
[3-4 sentence answer]

## When to See a Professional
[150 words]

## The Bottom Line
[150 words — specific, actionable takeaway]

---

REQUIREMENTS — ALL MUST BE MET:
- Total length: minimum 2000 words
- Include 3 internal links like [anchor text](/articles/related-slug)
- Include 1 external link to PubMed, ACOG, APTA, or similar
- Include the phrase: "At YourPelvicHealing.com, we believe..."
- End with: "Written by Dr. Maya Chen, DPT, PRPC — Pelvic Floor Physical Therapist with 15 years of clinical experience. [Read more about Dr. Chen](/about)"
- End with: "This article is for educational purposes only and does not constitute medical advice. Always consult a qualified healthcare provider."
- NEVER use: delve, tapestry, intricate, empower, game-changer, transformative, leverage, synergy, unlock, unleash, dive deep, in conclusion, in summary

Start with "## TL;DR" — no preamble.`;

  const response = await client.chat.completions.create({
    model: 'gpt-4.1',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 6000,
    temperature: 0.7,
  });

  const content = response.choices[0].message.content || '';
  return { content, wordCount: countWords(content) };
}

async function main() {
  const articles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  const shortArticles = articles.filter(a => (a.wordCount || 0) < 1800 && (a.wordCount || 0) > 0);
  
  console.log(`Force-regenerating ${shortArticles.length} short articles with gpt-4.1 (6000 tokens)...`);
  
  // Process one at a time to avoid rate limits
  let fixed = 0;
  let stillShort = 0;
  
  for (let i = 0; i < shortArticles.length; i++) {
    const article = shortArticles[i];
    process.stdout.write(`[${i+1}/${shortArticles.length}] ${article.slug} (${article.wordCount}w) → `);
    
    try {
      const result = await forceRegen(article);
      
      const current = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
      const idx = current.findIndex(a => a.slug === article.slug);
      
      if (idx !== -1 && result.wordCount >= 1800) {
        current[idx].content = result.content;
        current[idx].wordCount = result.wordCount;
        current[idx].updatedAt = new Date().toISOString();
        current[idx].dateModified = new Date().toISOString();
        fs.writeFileSync(ARTICLES_FILE, JSON.stringify(current, null, 2));
        fixed++;
        console.log(`✓ ${result.wordCount}w`);
      } else {
        console.log(`⚠ still short: ${result.wordCount}w`);
        stillShort++;
      }
    } catch (err) {
      console.log(`✗ ERROR: ${err.message}`);
    }
    
    // Small delay between requests
    if (i < shortArticles.length - 1) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  
  // Final check
  const final = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf8'));
  const remaining = final.filter(a => (a.wordCount || 0) < 1800 && (a.wordCount || 0) > 0);
  const minW = Math.min(...final.map(a => a.wordCount || 0).filter(Boolean));
  const avgW = Math.round(final.reduce((s, a) => s + (a.wordCount || 0), 0) / final.length);
  
  console.log(`\n✅ DONE`);
  console.log(`Fixed: ${fixed} | Still short: ${remaining.length} | Min: ${minW}w | Avg: ${avgW}w`);
  if (remaining.length > 0) {
    remaining.forEach(a => console.log(` - ${a.slug}: ${a.wordCount}w`));
  }
}

main().catch(console.error);

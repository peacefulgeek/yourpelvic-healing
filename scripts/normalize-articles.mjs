/**
 * Normalize all articles to consistent camelCase field names.
 * Old articles use snake_case (published_at, meta_description, etc.)
 * New articles use camelCase (publishedAt, metaDescription, etc.)
 * Publisher expects: status='queued' for unpublished, status='published' for live.
 * 
 * After this migration:
 * - All fields are camelCase
 * - status is 'published' | 'queued' (never 'gated')
 * - publishedAt is set for published articles
 * - lastModifiedAt is set for all articles
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '..', 'data', 'articles.json');

const articles = JSON.parse(readFileSync(DATA_PATH, 'utf8'));

let normalized = 0;
let alreadyGood = 0;

const result = articles.map(a => {
  // Normalize all fields to camelCase
  const n = {
    id: a.id || a.slug,
    slug: a.slug,
    title: a.title,
    metaDescription: a.metaDescription || a.meta_description || '',
    ogTitle: a.ogTitle || a.og_title || a.title,
    ogDescription: a.ogDescription || a.og_description || a.metaDescription || a.meta_description || '',
    category: a.category,
    tags: a.tags || [],
    body: a.body || '',
    heroUrl: a.heroUrl || a.hero_url || '',
    imageAlt: a.imageAlt || a.image_alt || a.title,
    readingTime: a.readingTime || a.reading_time || 8,
    wordCount: a.wordCount || (a.body ? a.body.split(/\s+/).length : 0),
    author: a.author || 'Dr. Serena Blake, DPT',
    authorBio: a.authorBio || a.author_bio || '',
    tldr: a.tldr || '',
    internalLinks: a.internalLinks || a.internal_links || [],
    externalLinks: a.externalLinks || a.external_links || [],
    affiliateAsins: a.affiliateAsins || a.affiliate_asins || [],
    qualityGate: a.qualityGate || { passed: true, warnings: [], score: 100 },
    createdAt: a.createdAt || a.created_at || new Date().toISOString(),
    lastModifiedAt: a.lastModifiedAt || a.last_modified_at || a.updated_at || a.publishedAt || a.published_at || new Date().toISOString(),
  };

  // Normalize status: 'published' or 'queued' only
  const oldStatus = a.status;
  const hasPublishedAt = a.publishedAt || a.published_at;
  
  if (oldStatus === 'published' || (hasPublishedAt && oldStatus !== 'gated')) {
    n.status = 'published';
    n.publishedAt = a.publishedAt || a.published_at || new Date().toISOString();
    normalized++;
  } else {
    // gated, queued, or anything else → queued (not published)
    n.status = 'queued';
    n.publishedAt = null;
    if (oldStatus !== 'queued') normalized++;
    else alreadyGood++;
  }

  return n;
});

writeFileSync(DATA_PATH, JSON.stringify(result, null, 2));

const published = result.filter(a => a.status === 'published');
const queued = result.filter(a => a.status === 'queued');
const avgWords = Math.round(result.reduce((s, a) => s + (a.wordCount || 0), 0) / result.length);

console.log(`Migration complete:`);
console.log(`  Total: ${result.length}`);
console.log(`  Published: ${published.length}`);
console.log(`  Queued (gated): ${queued.length}`);
console.log(`  Avg words: ${avgWords}`);
console.log(`  Normalized: ${normalized}`);

// Verify published dates are spread (not all on same day)
const byDate = {};
published.forEach(a => {
  const d = (a.publishedAt || '').split('T')[0];
  byDate[d] = (byDate[d] || 0) + 1;
});
console.log(`  Published by date:`, JSON.stringify(byDate));

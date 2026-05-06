/**
 * Update all hero_url / heroUrl fields in articles.json to use Bunny CDN URLs.
 * Maps category → CDN image URL.
 */
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(__dirname, '..', 'data', 'articles.json');
const BUNNY = 'https://pelvic-healing.b-cdn.net';

const CATEGORY_IMAGES = {
  'Anatomy': `${BUNNY}/images/hero-anatomy.webp`,
  'Exercises': `${BUNNY}/images/hero-exercises.webp`,
  'Postpartum': `${BUNNY}/images/hero-postpartum.webp`,
  'Pelvic PT': `${BUNNY}/images/hero-pelvic-pt.webp`,
  'Pelvic Pain': `${BUNNY}/images/hero-pain.webp`,
  'Pain': `${BUNNY}/images/hero-pain.webp`,
  'Dysfunction': `${BUNNY}/images/hero-dysfunction.webp`,
  'Incontinence': `${BUNNY}/images/card-incontinence.webp`,
  'Menopause': `${BUNNY}/images/card-menopause.webp`,
  'Assessments': `${BUNNY}/images/hero-assessment.webp`,
  'Assessment': `${BUNNY}/images/hero-assessment.webp`,
  'General': `${BUNNY}/images/hero-home.webp`,
};

const DEFAULT_IMAGE = `${BUNNY}/images/hero-home.webp`;

const articles = JSON.parse(readFileSync(DATA_PATH, 'utf8'));

let updated = 0;
const result = articles.map(a => {
  const category = a.category || 'General';
  const cdnUrl = CATEGORY_IMAGES[category] || DEFAULT_IMAGE;
  
  // Only update if currently pointing to local path or empty
  const currentUrl = a.heroUrl || a.hero_url || '';
  if (!currentUrl || currentUrl.startsWith('/images/') || currentUrl.startsWith('/public/') || currentUrl.startsWith('http://localhost')) {
    updated++;
    return { ...a, heroUrl: cdnUrl, hero_url: cdnUrl };
  }
  // Already a CDN URL — keep it
  return a;
});

writeFileSync(DATA_PATH, JSON.stringify(result, null, 2));
console.log(`Updated ${updated}/${articles.length} hero URLs to Bunny CDN`);
console.log(`Sample: ${result[0]?.heroUrl}`);

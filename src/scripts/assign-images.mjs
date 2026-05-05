/**
 * Assigns hero images to articles based on category.
 * Uses local /images/ paths (will be replaced with Bunny CDN URLs later).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '../..');
const DATA_FILE = path.join(ROOT, 'data/articles.json');

const CATEGORY_IMAGES = {
  'anatomy':      '/images/hero-anatomy.jpg',
  'dysfunction':  '/images/hero-dysfunction.jpg',
  'postpartum':   '/images/hero-postpartum.jpg',
  'pelvic-pt':    '/images/hero-pelvic-pt.jpg',
  'pain':         '/images/hero-pain.jpg',
  'exercises':    '/images/hero-exercises.jpg',
  'menopause':    '/images/card-menopause.jpg',
  'incontinence': '/images/hero-incontinence.jpg',
  'assessment':   '/images/hero-assessment.jpg',
};

const DEFAULT_IMAGE = '/images/hero-home.jpg';

const articles = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));

// Reset all hero_urls and reassign
let updated = 0;
for (const article of articles) {
  article.hero_url = CATEGORY_IMAGES[article.category] || DEFAULT_IMAGE;
  updated++;
}

fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2));
console.log(`Updated ${updated} articles with hero images.`);

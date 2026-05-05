/**
 * File-based article store.
 * Falls back to JSON file when no DATABASE_URL is set.
 * Reads from data/articles.json.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(__dirname, '../../data/articles.json');

let _cache = null;
let _cacheTime = 0;
const CACHE_TTL = 30_000; // 30 seconds

function loadArticles() {
  const now = Date.now();
  if (_cache && now - _cacheTime < CACHE_TTL) return _cache;

  if (!fs.existsSync(DATA_FILE)) {
    _cache = [];
    _cacheTime = now;
    return _cache;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    _cache = JSON.parse(raw);
    _cacheTime = now;
    return _cache;
  } catch {
    _cache = [];
    _cacheTime = now;
    return _cache;
  }
}

export function getArticles({ page = 1, limit = 12, category = '', status = 'published' } = {}) {
  let articles = loadArticles().filter(a => a.status === status);

  if (category) {
    articles = articles.filter(a => a.category === category);
  }

  // Sort by published_at desc
  articles.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

  const total = articles.length;
  const pages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const items = articles.slice(offset, offset + limit);

  return {
    articles: items,
    pagination: { page, limit, total, pages },
  };
}

export function getArticleBySlug(slug) {
  const articles = loadArticles();
  return articles.find(a => a.slug === slug && a.status === 'published') || null;
}

export function getRelatedArticles(article, limit = 3) {
  const articles = loadArticles().filter(
    a => a.status === 'published' && a.slug !== article.slug
  );

  // Score by category match and tag overlap
  const scored = articles.map(a => {
    let score = 0;
    if (a.category === article.category) score += 3;
    const articleTags = article.tags || [];
    const aTags = a.tags || [];
    const overlap = articleTags.filter(t => aTags.includes(t)).length;
    score += overlap;
    return { article: a, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(s => s.article);
}

export function getAllSlugs() {
  return loadArticles()
    .filter(a => a.status === 'published')
    .map(a => a.slug);
}

export function saveArticle(article) {
  const articles = loadArticles();
  const idx = articles.findIndex(a => a.slug === article.slug);
  if (idx >= 0) {
    articles[idx] = { ...articles[idx], ...article, updated_at: new Date().toISOString() };
  } else {
    articles.push({ ...article, id: articles.length + 1, updated_at: new Date().toISOString() });
  }

  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2));
  _cache = null; // invalidate cache
}

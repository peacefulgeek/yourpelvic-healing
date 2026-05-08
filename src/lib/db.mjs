/**
 * db.mjs — File-based data layer (no PostgreSQL, no MySQL, no external DB)
 *
 * Compatibility shim: same export names as the old pg-based db.mjs,
 * but reads/writes from data/articles.json via articles-store.mjs.
 * Zero external DB dependencies — works on Render or any Node.js host.
 */

import {
  getArticles,
  getArticleBySlug as _getBySlug,
  getRelatedArticles as _getRelated,
  getAllSlugs,
  saveArticle,
} from './articles-store.mjs';

export async function getPublishedArticles({ limit = 20, offset = 0, category } = {}) {
  const page = Math.floor(offset / limit) + 1;
  const { articles } = getArticles({ page, limit, category, status: 'published' });
  return articles;
}

export async function getArticleBySlug(slug) {
  return _getBySlug(slug);
}

export async function getArticleCount() {
  const { pagination } = getArticles({ limit: 1, status: 'published' });
  return pagination.total;
}

export async function getRelatedArticles(slug, tags, limit = 3) {
  const article = _getBySlug(slug);
  if (!article) return [];
  return _getRelated(article, limit);
}

// query() stub — no-op in file-based mode
export async function query(text, params) {
  console.warn('[db] query() called in file-based mode (no-op).');
  return { rows: [] };
}

// initDb() stub — no schema needed
export async function initDb() {
  console.log('[db] File-based mode — no DB schema to initialize.');
}

export { saveArticle, getAllSlugs };

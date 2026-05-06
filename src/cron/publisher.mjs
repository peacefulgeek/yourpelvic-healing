/**
 * §8 + §15 Phase-Aware Publisher — The Pelvic Floor
 * Runs inside the Express process via node-cron.
 * NOT scheduled via Manus or any external scheduler.
 *
 * Phase schedule (§15D):
 *   Phase 1 (articles 1-30):    2/day  — "ramp"
 *   Phase 2 (articles 31-100):  3/day  — "grow"
 *   Phase 3 (articles 101-250): 4/day  — "scale"
 *   Phase 4 (articles 251-500): 5/day  — "authority"
 *
 * Cron fires at 06:00, 10:00, 14:00, 18:00, 22:00 UTC.
 * Each slot checks if it should publish based on current phase.
 */
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const DATA_PATH = path.join(ROOT, 'data', 'articles.json');
const SITEMAP_LOCK = path.join(ROOT, 'data', '.sitemap-dirty');

function loadArticles() {
  if (!existsSync(DATA_PATH)) return [];
  return JSON.parse(readFileSync(DATA_PATH, 'utf8'));
}

function saveArticles(articles) {
  writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2));
}

function getPhase(publishedCount) {
  if (publishedCount < 30) return { phase: 1, perDay: 2, label: 'ramp' };
  if (publishedCount < 100) return { phase: 2, perDay: 3, label: 'grow' };
  if (publishedCount < 250) return { phase: 3, perDay: 4, label: 'scale' };
  return { phase: 4, perDay: 5, label: 'authority' };
}

function getPublishedTodayCount(articles) {
  const today = new Date().toISOString().split('T')[0];
  return articles.filter(a =>
    a.status === 'published' &&
    a.publishedAt &&
    a.publishedAt.startsWith(today)
  ).length;
}

// Spread publish times across the day to look organic to Google
function getPublishTime() {
  const now = new Date();
  const minutes = Math.floor(Math.random() * 30);
  const seconds = Math.floor(Math.random() * 60);
  const isoBase = now.toISOString().split('T')[0];
  const hour = now.getUTCHours();
  return `${isoBase}T${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}Z`;
}

export function publishOne() {
  const articles = loadArticles();
  const published = articles.filter(a => a.status === 'published');
  const queued = articles.filter(a => a.status === 'queued' && a.qualityGate?.passed !== false);

  if (queued.length === 0) {
    console.log('[publisher] No queued articles ready to publish.');
    return null;
  }

  const { perDay, phase, label } = getPhase(published.length);
  const publishedToday = getPublishedTodayCount(articles);

  if (publishedToday >= perDay) {
    console.log(`[publisher] Phase ${phase} (${label}): daily cap ${perDay} reached (${publishedToday} published today).`);
    return null;
  }

  // Pick oldest queued article
  const sorted = queued.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  const article = sorted[0];

  const now = getPublishTime();
  article.status = 'published';
  article.publishedAt = now;
  article.lastModifiedAt = now;

  const idx = articles.findIndex(a => a.slug === article.slug);
  articles[idx] = article;
  saveArticles(articles);

  // Mark sitemap dirty for regeneration
  writeFileSync(SITEMAP_LOCK, new Date().toISOString());

  console.log(`[publisher] Phase ${phase} (${label}): Published "${article.title}" [${publishedToday + 1}/${perDay} today]`);
  return article;
}

export function getPublisherStatus() {
  const articles = loadArticles();
  const published = articles.filter(a => a.status === 'published');
  const queued = articles.filter(a => a.status === 'queued');
  const failed = articles.filter(a => a.qualityGate?.passed === false);
  const { phase, perDay, label } = getPhase(published.length);
  const publishedToday = getPublishedTodayCount(articles);

  return {
    total: articles.length,
    published: published.length,
    queued: queued.length,
    failed: failed.length,
    phase, perDay, label,
    publishedToday,
    remainingToday: Math.max(0, perDay - publishedToday),
    daysOfContent: Math.floor(queued.length / perDay),
  };
}

// ─── CRON SCHEDULE ────────────────────────────────────────────────────────────
// 5 slots per day: 06:00, 10:00, 14:00, 18:00, 22:00 UTC
// Phase determines how many of these slots actually publish
export function startPublisherCron() {
  const slots = ['0 6 * * *', '0 10 * * *', '0 14 * * *', '0 18 * * *', '0 22 * * *'];

  for (const slot of slots) {
    cron.schedule(slot, () => {
      try {
        publishOne();
      } catch (e) {
        console.error(`[publisher] Cron error: ${e.message}`);
      }
    }, { timezone: 'UTC' });
  }

  console.log('[publisher] Cron publisher started — 5 daily slots, phase-aware.');
  const status = getPublisherStatus();
  console.log(`[publisher] Status: Phase ${status.phase} (${status.label}), ${status.published} published, ${status.queued} queued, ${status.perDay}/day`);
}

/**
 * §8 + §15 Phase-Aware Publisher — The Pelvic Floor
 * Runs inside the Express process via node-cron.
 * NOT scheduled via Manus or any external scheduler.
 *
 * Phase schedule:
 *   Phase 1 (days 1–40 from first publish): 5/day  — "burst"
 *   Phase 2 (day 41+):                      1/weekday (Mon–Fri) — "steady"
 *
 * Cron fires at 06:00, 10:00, 14:00, 18:00, 22:00 UTC (5 slots/day).
 * Phase 1: all 5 slots publish (5/day).
 * Phase 2: only the 09:00 UTC slot publishes on Mon–Fri (1/weekday).
 */
import cron from 'node-cron';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync, writeFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const DATA_PATH = path.join(ROOT, 'data', 'articles.json');
const SITEMAP_LOCK = path.join(ROOT, 'data', '.sitemap-dirty');

// Day 1 of Phase 1 is the date of the first published article.
// If no articles published yet, Phase 1 starts on first publish.
const PHASE1_DAYS = 40;
const PHASE1_PER_DAY = 5;
const PHASE2_PER_DAY = 1; // weekdays only

function loadArticles() {
  if (!existsSync(DATA_PATH)) return [];
  return JSON.parse(readFileSync(DATA_PATH, 'utf8'));
}

function saveArticles(articles) {
  writeFileSync(DATA_PATH, JSON.stringify(articles, null, 2));
}

/**
 * Returns the phase object based on elapsed days since first publish.
 * Phase 1: days 1–40 → 5/day (all days)
 * Phase 2: day 41+   → 1/weekday (Mon–Fri only)
 */
function getPhase(articles) {
  const published = articles.filter(a => a.status === 'published' && a.publishedAt);
  if (published.length === 0) {
    return { phase: 1, perDay: PHASE1_PER_DAY, label: 'burst', weekdayOnly: false };
  }

  // Find earliest publishedAt
  const sorted = published.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
  const firstPublish = new Date(sorted[0].publishedAt);
  const now = new Date();
  const daysSinceFirst = Math.floor((now - firstPublish) / (1000 * 60 * 60 * 24));

  if (daysSinceFirst < PHASE1_DAYS) {
    const daysLeft = PHASE1_DAYS - daysSinceFirst;
    return { phase: 1, perDay: PHASE1_PER_DAY, label: `burst (${daysLeft}d left)`, weekdayOnly: false };
  }

  return { phase: 2, perDay: PHASE2_PER_DAY, label: 'steady (1/weekday)', weekdayOnly: true };
}

function getPublishedTodayCount(articles) {
  const today = new Date().toISOString().split('T')[0];
  return articles.filter(a =>
    a.status === 'published' &&
    a.publishedAt &&
    a.publishedAt.startsWith(today)
  ).length;
}

function isWeekday() {
  const day = new Date().getUTCDay(); // 0=Sun, 6=Sat
  return day >= 1 && day <= 5;
}

// Spread publish times slightly within the slot to look organic
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
  const queued = articles.filter(a => a.status === 'queued' && a.qualityGate?.passed !== false);

  if (queued.length === 0) {
    console.log('[publisher] No queued articles ready to publish.');
    return null;
  }

  const { perDay, phase, label, weekdayOnly } = getPhase(articles);

  // Phase 2: only publish on weekdays
  if (weekdayOnly && !isWeekday()) {
    console.log(`[publisher] Phase ${phase} (${label}): skipping — not a weekday.`);
    return null;
  }

  const publishedToday = getPublishedTodayCount(articles);

  if (publishedToday >= perDay) {
    console.log(`[publisher] Phase ${phase} (${label}): daily cap ${perDay} reached (${publishedToday} published today).`);
    return null;
  }

  // Pick oldest queued article (FIFO)
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
  const { phase, perDay, label, weekdayOnly } = getPhase(articles);
  const publishedToday = getPublishedTodayCount(articles);

  // Estimate days of content remaining
  const weekdayRate = PHASE2_PER_DAY * 5; // per week
  const daysLeft = weekdayOnly
    ? Math.floor(queued.length / PHASE2_PER_DAY)
    : Math.floor(queued.length / PHASE1_PER_DAY);

  return {
    total: articles.length,
    published: published.length,
    queued: queued.length,
    failed: failed.length,
    phase,
    perDay,
    label,
    weekdayOnly,
    publishedToday,
    remainingToday: Math.max(0, perDay - publishedToday),
    daysOfContent: daysLeft,
  };
}

// ─── CRON SCHEDULE ────────────────────────────────────────────────────────────
// Phase 1 (days 1–40): 5 slots fire — 06:00, 10:00, 14:00, 18:00, 22:00 UTC
// Phase 2 (day 41+):   1 slot fires on weekdays — 09:00 UTC Mon–Fri
// The phase check inside publishOne() handles which slots actually publish.
export function startPublisherCron() {
  // Phase 1 slots: all 5 fire daily, publishOne() caps at 5/day
  const phase1Slots = [
    '0 6 * * *',
    '0 10 * * *',
    '0 14 * * *',
    '0 18 * * *',
    '0 22 * * *',
  ];

  // Phase 2 slot: weekdays only at 09:00 UTC
  // publishOne() also checks isWeekday() as a belt-and-suspenders guard
  const phase2Slot = '0 9 * * 1-5';

  for (const slot of phase1Slots) {
    cron.schedule(slot, () => {
      try {
        publishOne();
      } catch (e) {
        console.error(`[publisher] Cron error: ${e.message}`);
      }
    }, { timezone: 'UTC' });
  }

  // Phase 2 weekday slot (also fires in Phase 1 but perDay cap prevents double-publishing)
  cron.schedule(phase2Slot, () => {
    try {
      publishOne();
    } catch (e) {
      console.error(`[publisher] Cron error: ${e.message}`);
    }
  }, { timezone: 'UTC' });

  console.log('[publisher] Cron publisher started.');
  console.log('[publisher]   Phase 1 (days 1–40): 5/day — slots at 06, 10, 14, 18, 22 UTC');
  console.log('[publisher]   Phase 2 (day 41+):   1/weekday — slot at 09 UTC Mon–Fri');

  const status = getPublisherStatus();
  console.log(`[publisher] Current: Phase ${status.phase} (${status.label}), ${status.published} published, ${status.queued} queued`);
}

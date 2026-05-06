/**
 * Generate sitemap.xml with image:loc entries for all published articles.
 * Run via: node scripts/generate-sitemap.mjs
 * Also called by the cron publisher after each new article publish.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'articles.json');
const PUBLIC_PATH = path.join(ROOT, 'public', 'sitemap.xml');

const SITE_URL = process.env.SITE_URL || 'https://yourpelvichealing.com';
const APEX = SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
const BUNNY = process.env.BUNNY_CDN_URL || 'https://pelvic-healing.b-cdn.net';

function esc(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function generateSitemap() {
  if (!existsSync(DATA_PATH)) {
    console.log('[sitemap] No articles.json found, skipping.');
    return;
  }

  const articles = JSON.parse(readFileSync(DATA_PATH, 'utf8'));
  const published = articles.filter(a => a.status === 'published');

  const staticPages = [
    { loc: `https://${APEX}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `https://${APEX}/articles`, changefreq: 'daily', priority: '0.9' },
    { loc: `https://${APEX}/assessments`, changefreq: 'weekly', priority: '0.8' },
    { loc: `https://${APEX}/supplements`, changefreq: 'weekly', priority: '0.8' },
    { loc: `https://${APEX}/about`, changefreq: 'monthly', priority: '0.5' },
    { loc: `https://${APEX}/recommended`, changefreq: 'weekly', priority: '0.6' },
  ];

  const staticEntries = staticPages.map(p =>
    `  <url>\n    <loc>${esc(p.loc)}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`
  ).join('\n');

  const artEntries = published.map(a => {
    const heroUrl = a.heroUrl || a.hero_url || `${BUNNY}/images/og-default.webp`;
    const lastmod = (a.lastModifiedAt || a.last_modified_at || a.publishedAt || a.published_at || new Date().toISOString()).split('T')[0];
    return `  <url>
    <loc>https://${APEX}/articles/${a.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
    <image:image>
      <image:loc>${esc(heroUrl)}</image:loc>
      <image:title>${esc(a.title || '')}</image:title>
      <image:caption>${esc((a.metaDescription || a.meta_description || '').slice(0, 200))}</image:caption>
    </image:image>
  </url>`;
  }).join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${staticEntries}
${artEntries}
</urlset>`;

  writeFileSync(PUBLIC_PATH, xml);
  console.log(`[sitemap] Generated ${PUBLIC_PATH} with ${published.length} articles + ${staticPages.length} static pages`);
}

generateSitemap();

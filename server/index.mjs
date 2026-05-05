/**
 * The Pelvic Floor — Express Server
 * Serves SSR React app + API routes + SEO endpoints
 */
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import compression from 'compression';
import {
  getArticles,
  getArticleBySlug,
  getRelatedArticles,
  getAllSlugs,
} from '../src/lib/articles-store.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.join(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_URL = process.env.SITE_URL || 'https://thepelvicfloor.com';
const IS_PROD = process.env.NODE_ENV === 'production';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(compression());
app.use(express.json());

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ─── Static assets ────────────────────────────────────────────────────────────
app.use('/images', express.static(path.join(ROOT, 'public/images'), {
  maxAge: IS_PROD ? '30d' : 0,
}));
app.use('/fonts', express.static(path.join(ROOT, 'public/fonts'), {
  maxAge: IS_PROD ? '365d' : 0,
}));

if (IS_PROD) {
  app.use('/assets', express.static(path.join(ROOT, 'dist/client/assets'), {
    maxAge: '1y',
    immutable: true,
  }));
}

// ─── API: Articles ────────────────────────────────────────────────────────────
app.get('/api/articles', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const category = req.query.category || '';
  const result = getArticles({ page, limit, category });
  res.json(result);
});

app.get('/api/articles/:slug', (req, res) => {
  const article = getArticleBySlug(req.params.slug);
  if (!article) return res.status(404).json({ error: 'Not found' });
  const related = getRelatedArticles(article, 3);
  res.json({ article, related });
});

// ─── SEO: Sitemap ─────────────────────────────────────────────────────────────
app.get('/sitemap.xml', (req, res) => {
  const slugs = getAllSlugs();
  const now = new Date().toISOString().split('T')[0];

  const staticPages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/articles', priority: '0.9', changefreq: 'daily' },
    { url: '/assessments', priority: '0.9', changefreq: 'monthly' },
    { url: '/assessments/pelvic-floor-symptom-screener', priority: '0.8', changefreq: 'monthly' },
    { url: '/assessments/is-my-pelvic-floor-too-tight-or-too-weak', priority: '0.8', changefreq: 'monthly' },
    { url: '/assessments/postpartum-pelvic-floor-recovery-readiness', priority: '0.8', changefreq: 'monthly' },
    { url: '/recommended', priority: '0.7', changefreq: 'monthly' },
    { url: '/about', priority: '0.6', changefreq: 'monthly' },
    { url: '/privacy', priority: '0.3', changefreq: 'yearly' },
  ];

  const articleUrls = slugs.map((slug) => ({
    url: `/articles/${slug}`,
    priority: '0.8',
    changefreq: 'monthly',
  }));

  const allPages = [...staticPages, ...articleUrls];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}${p.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(xml);
});

// ─── SEO: Robots ──────────────────────────────────────────────────────────────
app.get('/robots.txt', (req, res) => {
  const content = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

Sitemap: ${SITE_URL}/sitemap.xml

# LLM crawlers welcome
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: Google-Extended
Allow: /
`;
  res.setHeader('Content-Type', 'text/plain');
  res.send(content);
});

// ─── AEO: llms.txt ───────────────────────────────────────────────────────────
app.get('/llms.txt', (req, res) => {
  const articles = getArticles({ limit: 100 }).articles;
  const slugs = articles.map((a) => `- [${a.title}](${SITE_URL}/articles/${a.slug})`).join('\n');

  const content = `# The Pelvic Floor

> Evidence-based pelvic floor health education. Written in plain language for people who want real answers, not medical jargon.

## About

The Pelvic Floor is an educational resource covering pelvic floor anatomy, dysfunction, physical therapy, postpartum recovery, pain conditions, exercise, and menopause. All content is written in the Oracle Lover voice — direct, warm, and grounded in evidence.

## Content

${slugs}

## Assessments

- [Pelvic Floor Symptom Screener](${SITE_URL}/assessments/pelvic-floor-symptom-screener)
- [Is My Pelvic Floor Too Tight or Too Weak?](${SITE_URL}/assessments/is-my-pelvic-floor-too-tight-or-too-weak)
- [Postpartum Recovery Readiness Check](${SITE_URL}/assessments/postpartum-pelvic-floor-recovery-readiness)

## Disclaimer

Content on thepelvicfloor.com is for educational purposes only. Always consult a qualified healthcare provider for diagnosis and treatment.
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.send(content);
});

// ─── SSR ──────────────────────────────────────────────────────────────────────

function buildHead(title, description, url, image) {
  const ogImage = image || `${SITE_URL}/images/hero-home.jpg`;
  return `
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />
    <link rel="canonical" href="${url}" />
  `;
}

function buildArticleJsonLd(article) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.meta_description,
    author: {
      '@type': 'Person',
      name: article.author || 'The Oracle Lover',
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Pelvic Floor',
      url: SITE_URL,
    },
    datePublished: article.published_at,
    dateModified: article.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/articles/${article.slug}`,
    },
    image: article.hero_url || `${SITE_URL}/images/hero-home.jpg`,
  });
}

function buildFaqJsonLd(questions) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  });
}

function renderSSR(req, res, headExtra, bodyData, jsonLd) {
  const templatePath = IS_PROD
    ? path.join(ROOT, 'dist/client/index.html')
    : path.join(ROOT, 'index.html');

  if (!fs.existsSync(templatePath)) {
    // Dev fallback
    return res.send(buildDevHTML(headExtra, bodyData, jsonLd));
  }

  let html = fs.readFileSync(templatePath, 'utf-8');
  html = html.replace('</head>', `${headExtra}${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ''}</head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyData}</div>`);
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(html);
}

function buildDevHTML(headExtra, bodyData, jsonLd) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${headExtra}
  ${jsonLd ? `<script type="application/ld+json">${jsonLd}</script>` : ''}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=Nunito+Sans:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&display=swap" rel="stylesheet" />
  <script type="module" src="/src/client/entry-client.tsx"></script>
</head>
<body>
  <div id="root">${bodyData}</div>
</body>
</html>`;
}

// Article page with full SEO
app.get('/articles/:slug', (req, res) => {
  const article = getArticleBySlug(req.params.slug);
  if (!article) {
    const head = buildHead('Article Not Found', 'The requested article was not found.', `${SITE_URL}/articles/${req.params.slug}`);
    return renderSSR(req, res, head, '<p>Article not found</p>');
  }

  const head = buildHead(
    article.og_title || article.title,
    article.og_description || article.meta_description,
    `${SITE_URL}/articles/${article.slug}`,
    article.hero_url
  );
  const jsonLd = buildArticleJsonLd(article);
  renderSSR(req, res, head, '', jsonLd);
});

// All other pages — serve index.html with default meta
app.get('*', (req, res) => {
  const pageMeta = {
    '/': {
      title: 'The Pelvic Floor — Evidence-Based Pelvic Health Education',
      description:
        'Real answers about pelvic floor health. Anatomy, dysfunction, physical therapy, postpartum recovery, pain, and menopause. Written in plain language.',
    },
    '/articles': {
      title: 'Articles — The Pelvic Floor',
      description:
        'Browse all articles on pelvic floor health, anatomy, dysfunction, physical therapy, postpartum recovery, and more.',
    },
    '/assessments': {
      title: 'Pelvic Floor Assessments — Know Your Symptoms',
      description:
        'Free interactive pelvic floor assessments. Find out what your symptoms might indicate and what to do next.',
    },
    '/about': {
      title: 'About — The Pelvic Floor',
      description: 'About The Pelvic Floor — evidence-based pelvic health education.',
    },
    '/recommended': {
      title: 'Recommended Products — The Pelvic Floor',
      description: 'Pelvic floor health products we recommend, with honest context.',
    },
  };

  const meta = pageMeta[req.path] || pageMeta['/'];
  const head = buildHead(meta.title, meta.description, `${SITE_URL}${req.path}`);

  // Organization JSON-LD for homepage
  let jsonLd;
  if (req.path === '/') {
    jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'The Pelvic Floor',
      url: SITE_URL,
      description: meta.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/articles?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    });
  }

  renderSSR(req, res, head, '', jsonLd);
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🌸 The Pelvic Floor running on http://localhost:${PORT}`);
});

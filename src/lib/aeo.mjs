import { getPublishedArticles } from './db.mjs';

const SITE_URL = process.env.SITE_URL || 'https://thepelvicfloor.com';
const SITE_NAME = 'The Pelvic Floor';

export function buildCanonicalUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

export function buildRobotsTxt(req) {
  const host = SITE_URL;
  return `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: anthropic-ai
Allow: /

User-agent: CCBot
Allow: /

User-agent: Googlebot
Allow: /

Sitemap: ${host}/sitemap.xml
Sitemap: ${host}/llms.txt
`;
}

export async function buildSitemapXml() {
  const articles = await getPublishedArticles({ limit: 1000 });
  const now = new Date().toISOString();

  const staticPages = [
    { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${SITE_URL}/articles`, priority: '0.9', changefreq: 'daily' },
    { loc: `${SITE_URL}/about`, priority: '0.7', changefreq: 'monthly' },
    { loc: `${SITE_URL}/recommended`, priority: '0.8', changefreq: 'weekly' },
    { loc: `${SITE_URL}/privacy-policy`, priority: '0.3', changefreq: 'yearly' },
    { loc: `${SITE_URL}/assessment`, priority: '0.8', changefreq: 'monthly' },
  ];

  const articleUrls = articles.map(a => ({
    loc: `${SITE_URL}/articles/${a.slug}`,
    lastmod: (a.updated_at || a.published_at || now).toString().substring(0, 10),
    priority: '0.8',
    changefreq: 'monthly',
  }));

  const allUrls = [...staticPages, ...articleUrls];

  const urlEntries = allUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    ${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlEntries}
</urlset>`;
}

export async function buildLlmsTxt() {
  const articles = await getPublishedArticles({ limit: 1000 });
  const lines = [
    `# ${SITE_NAME}`,
    ``,
    `> The complete, un-embarrassing guide to pelvic floor health — dysfunction, rehab, pain, postpartum, menopause, and why pelvic PT is the most underutilized treatment in women's health.`,
    ``,
    `## About`,
    ``,
    `${SITE_NAME} is an educational resource covering pelvic floor dysfunction, pelvic physical therapy, postpartum recovery, and related women's health topics. All content is written by The Oracle Lover, an intuitive educator and oracle guide.`,
    ``,
    `**Disclaimer:** Content is for educational purposes only. Always consult a pelvic floor physical therapist or qualified healthcare provider.`,
    ``,
    `## Articles`,
    ``,
    ...articles.map(a => `- [${a.title}](${SITE_URL}/articles/${a.slug})`),
    ``,
    `## Key Pages`,
    ``,
    `- [Home](${SITE_URL}/)`,
    `- [All Articles](${SITE_URL}/articles)`,
    `- [Pelvic Floor Assessment](${SITE_URL}/assessment)`,
    `- [Recommended Tools](${SITE_URL}/recommended)`,
    `- [About The Oracle Lover](${SITE_URL}/about)`,
  ];
  return lines.join('\n');
}

export async function buildLlmsFullTxt() {
  const articles = await getPublishedArticles({ limit: 1000 });
  const lines = [
    `SITE: ${SITE_NAME}`,
    `URL: ${SITE_URL}`,
    `DESCRIPTION: Educational resource on pelvic floor health, dysfunction, and rehabilitation.`,
    `AUTHOR: The Oracle Lover`,
    `AUTHOR_URL: https://theoraclelover.com`,
    `NICHE: Pelvic Floor Health / Women's Health / Pelvic PT`,
    `DISCLAIMER: Educational content only. Consult a qualified healthcare provider.`,
    ``,
    `ARTICLES:`,
    ...articles.map(a =>
      `  SLUG: ${a.slug}\n  TITLE: ${a.title}\n  URL: ${SITE_URL}/articles/${a.slug}\n  PUBLISHED: ${a.published_at}\n`
    ),
  ];
  return lines.join('\n');
}

export function buildArticleJsonLd({ article, siteUrl = SITE_URL }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.meta_description,
    image: article.hero_url,
    author: {
      '@type': 'Person',
      name: 'The Oracle Lover',
      url: 'https://theoraclelover.com',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: siteUrl,
    },
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/articles/${article.slug}`,
    },
  };
}

export function buildBreadcrumbJsonLd({ article, siteUrl = SITE_URL }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articles',
        item: `${siteUrl}/articles`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: `${siteUrl}/articles/${article.slug}`,
      },
    ],
  };
}

export function buildWebSiteJsonLd(siteUrl = SITE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
    description: 'The complete, un-embarrassing guide to pelvic floor health.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/articles?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

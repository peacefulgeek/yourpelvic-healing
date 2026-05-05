import { buildArticleJsonLd, buildBreadcrumbJsonLd, buildWebSiteJsonLd, buildCanonicalUrl } from '../src/lib/aeo.mjs';

const SITE_URL = process.env.SITE_URL || 'https://thepelvicfloor.com';
const SITE_NAME = 'The Pelvic Floor';
const DEFAULT_OG_IMAGE = 'https://pelvic-floor.b-cdn.net/og/default.webp';

// Font preloads — Bunny CDN
const FONT_PRELOADS = `
  <link rel="preload" href="https://pelvic-floor.b-cdn.net/fonts/CrimsonPro-Bold.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="https://pelvic-floor.b-cdn.net/fonts/NunitoSans-Regular.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="https://pelvic-floor.b-cdn.net/fonts/DMSans-Regular.woff2" as="font" type="font/woff2" crossorigin />
`;

export async function buildSsrHead(url: string, pageData: Record<string, unknown>): Promise<string> {
  const canonical = buildCanonicalUrl(url.split('?')[0]);
  
  let title = `${SITE_NAME} — Pelvic Floor Health, Dysfunction & Rehab`;
  let description = 'The complete, un-embarrassing guide to pelvic floor health — dysfunction, rehab, pain, postpartum, menopause, and why pelvic PT is the most underutilized treatment in women\'s health.';
  let ogImage = DEFAULT_OG_IMAGE;
  let jsonLdBlocks: string[] = [];

  // Home page
  if (url === '/' || url === '') {
    jsonLdBlocks.push(JSON.stringify(buildWebSiteJsonLd(SITE_URL)));
  }

  // Article page
  const article = pageData.article as Record<string, unknown> | undefined;
  if (article) {
    title = `${article.og_title || article.title} | ${SITE_NAME}`;
    description = (article.og_description || article.meta_description) as string;
    ogImage = (article.hero_url as string) || DEFAULT_OG_IMAGE;
    jsonLdBlocks.push(JSON.stringify(buildArticleJsonLd({ article, siteUrl: SITE_URL })));
    jsonLdBlocks.push(JSON.stringify(buildBreadcrumbJsonLd({ article, siteUrl: SITE_URL })));
  }

  const jsonLdTags = jsonLdBlocks
    .map(block => `<script type="application/ld+json">${block}</script>`)
    .join('\n  ');

  return `
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${canonical}" />

  <!-- Open Graph -->
  <meta property="og:type" content="${article ? 'article' : 'website'}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${ogImage}" />
  <meta property="og:site_name" content="${SITE_NAME}" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImage}" />

  <!-- Robots -->
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />

  <!-- Font preloads -->
  ${FONT_PRELOADS}

  <!-- Structured Data -->
  ${jsonLdTags}
`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { createElement } from 'react';
import { App } from '../src/client/App.js';
import { buildSsrHead } from './ssrHead.js';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';

let manifest: Record<string, string[]> = {};
if (isProd) {
  try {
    const manifestPath = path.join(__dirname, '../dist/client/.vite/manifest.json');
    if (fs.existsSync(manifestPath)) {
      manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    }
  } catch {
    console.warn('[ssr] Could not load Vite manifest');
  }
}

export async function renderPage(url: string) {
  // Fetch data needed for SSR
  let pageData: Record<string, unknown> = {};
  
  try {
    if (url.startsWith('/articles/')) {
      const slug = url.replace('/articles/', '').split('?')[0];
      const { getArticleBySlug, getRelatedArticles } = await import('../src/lib/db.mjs');
      const article = await getArticleBySlug(slug);
      if (article) {
        const related = await getRelatedArticles(slug, article.tags || [], 3);
        pageData = { article, related };
      } else {
        return { html: render404(), statusCode: 404 };
      }
    } else if (url === '/' || url === '') {
      const { getPublishedArticles } = await import('../src/lib/db.mjs');
      const articles = await getPublishedArticles({ limit: 9 });
      pageData = { articles };
    } else if (url.startsWith('/articles')) {
      const { getPublishedArticles, getArticleCount } = await import('../src/lib/db.mjs');
      const urlObj = new URL(url, 'http://localhost');
      const page = parseInt(urlObj.searchParams.get('page') || '1', 10);
      const limit = 12;
      const offset = (page - 1) * limit;
      const articles = await getPublishedArticles({ limit, offset });
      const total = await getArticleCount();
      pageData = { articles, total, page, limit };
    }
  } catch (err) {
    console.error('[ssr] Data fetch error:', err);
    pageData = {};
  }

  const appHtml = renderToString(
    createElement(StaticRouter, { location: url },
      createElement(App, { ssrData: pageData })
    )
  );

  const head = await buildSsrHead(url, pageData);

  const clientScript = isProd
    ? `<script type="module" src="/assets/entry-client.js"></script>`
    : `<script type="module" src="/@vite/client"></script>
       <script type="module" src="/src/client/entry-client.tsx"></script>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${head}
</head>
<body>
  <div id="root">${appHtml}</div>
  <script>window.__SSR_DATA__ = ${JSON.stringify(pageData).replace(/</g, '\\u003c')};</script>
  ${clientScript}
</body>
</html>`;

  return { html, statusCode: 200 };
}

function render404() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Page Not Found | The Pelvic Floor</title>
  <meta name="robots" content="noindex" />
</head>
<body>
  <div id="root"><h1>404 — Page Not Found</h1></div>
</body>
</html>`;
}

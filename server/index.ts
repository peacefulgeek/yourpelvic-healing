import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

// ─── WWW → apex 301 redirect ───
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (host.startsWith('www.')) {
    const apex = host.slice(4);
    return res.redirect(301, `${req.protocol}://${apex}${req.originalUrl}`);
  }
  next();
});

// ─── Compression ───
app.use(compression());

// ─── Body parsing ───
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static assets ───
if (isProd) {
  app.use('/assets', express.static(path.join(projectRoot, 'dist/client/assets'), {
    maxAge: '1y',
    immutable: true,
  }));
}

// ─── Health check ───
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// ─── API Routes ───
const { articlesRouter } = await import('./routes/articles.js');
const { sitemapRouter } = await import('./routes/sitemap.js');
const { robotsRouter } = await import('./routes/robots.js');
const { llmsRouter } = await import('./routes/llms.js');
const { assessmentRouter } = await import('./routes/assessment.js');

app.use('/api/articles', articlesRouter);
app.use('/sitemap.xml', sitemapRouter);
app.use('/robots.txt', robotsRouter);
app.use('/llms.txt', llmsRouter);
app.use('/api/assessment', assessmentRouter);

// ─── SSR catch-all ───
const { renderPage } = await import('./ssr.js');
app.get('*', async (req, res, next) => {
  try {
    const { html, statusCode, headers } = await renderPage(req.originalUrl);
    if (headers) {
      for (const [key, value] of Object.entries(headers)) {
        res.setHeader(key, value);
      }
    }
    res.status(statusCode || 200).send(html);
  } catch (err) {
    console.error('[ssr] Error rendering page:', err);
    next(err);
  }
});

// ─── Error handler ───
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const server = createServer(app);
server.listen(PORT, () => {
  console.log(`[server] The Pelvic Floor running on port ${PORT} (${isProd ? 'production' : 'development'})`);
});

export { app };

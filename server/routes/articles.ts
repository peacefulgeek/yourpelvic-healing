import express from 'express';
import { getPublishedArticles, getArticleBySlug, getArticleCount, getRelatedArticles } from '../../src/lib/db.mjs';

export const articlesRouter = express.Router();

// GET /api/articles — list published articles
articlesRouter.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '12', 10);
    const offset = (page - 1) * limit;
    const category = req.query.category as string | undefined;

    const [articles, total] = await Promise.all([
      getPublishedArticles({ limit, offset, category }),
      getArticleCount(),
    ]);

    res.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('[api/articles] Error:', err);
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

// GET /api/articles/:slug — single article
articlesRouter.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const article = await getArticleBySlug(slug);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    const related = await getRelatedArticles(slug, article.tags || [], 3);
    res.json({ article, related });
  } catch (err) {
    console.error('[api/articles/:slug] Error:', err);
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

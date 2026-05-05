import express from 'express';
import { buildSitemapXml } from '../../src/lib/aeo.mjs';

export const sitemapRouter = express.Router();

sitemapRouter.get('/', async (_req, res) => {
  try {
    const xml = await buildSitemapXml();
    res.type('application/xml').send(xml);
  } catch (err) {
    console.error('[sitemap] Error:', err);
    res.status(500).send('<?xml version="1.0"?><error/>');
  }
});

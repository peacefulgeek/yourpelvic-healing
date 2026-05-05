import express from 'express';
import { buildLlmsTxt, buildLlmsFullTxt } from '../../src/lib/aeo.mjs';

export const llmsRouter = express.Router();

llmsRouter.get('/llms.txt', async (_req, res) => {
  try {
    const txt = await buildLlmsTxt();
    res.type('text/markdown').send(txt);
  } catch (err) {
    console.error('[llms.txt] Error:', err);
    res.status(500).send('# Error generating llms.txt');
  }
});

llmsRouter.get('/llms-full.txt', async (_req, res) => {
  try {
    const txt = await buildLlmsFullTxt();
    res.type('text/plain').send(txt);
  } catch (err) {
    console.error('[llms-full.txt] Error:', err);
    res.status(500).send('Error generating llms-full.txt');
  }
});

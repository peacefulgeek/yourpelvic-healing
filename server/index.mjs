import express from 'express';
import { startAllCrons } from '../src/cron/index.mjs';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { existsSync, readFileSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist', 'client');
const DATA = path.join(ROOT, 'data');

export const SITE_URL = process.env.SITE_URL || 'https://yourpelvichealing.com';
export const APEX = SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '');
export const SITE_NAME = 'The Pelvic Floor';
export const AMAZON_TAG = 'spankyspinola-20';
export const AUTHOR_NAME = 'The Oracle Lover';
export const AUTHOR_URL = 'https://theoraclelover.com';
export const BUNNY_PULL = 'https://pelvic-healing.b-cdn.net';

const app = express();

// §17 WWW→APEX 301 — FIRST MIDDLEWARE
app.set('trust proxy', 1);
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  if (host.startsWith('www.')) {
    const apex = host.slice(4);
    const proto = req.headers['x-forwarded-proto'] || 'https';
    return res.redirect(301, `${proto}://${apex}${req.originalUrl}`);
  }
  next();
});

app.use(compression());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

if (existsSync(DIST)) {
  app.use('/assets', express.static(path.join(DIST, 'assets'), { maxAge: '1y', immutable: true }));
}
app.use(express.static(path.join(ROOT, 'public'), { maxAge: '1d' }));

async function loadArticles() {
  const p = path.join(DATA, 'articles.json');
  if (!existsSync(p)) return [];
  return JSON.parse(await fs.readFile(p, 'utf8'));
}

function stripHtml(html) {
  return (html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function buildHead({ title, description, canonical, ogImage, ogType='website', article=null, jsonLd=[] }) {
  const img = ogImage || `${BUNNY_PULL}/images/og-default.webp`;
  const ld = jsonLd.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');
  const artMeta = article ? `
  <meta property="article:published_time" content="${esc(article.publishedAt||article.published_at||'')}">
  <meta property="article:modified_time" content="${esc(article.lastModifiedAt||article.last_modified_at||article.publishedAt||'')}">
  <meta property="article:author" content="${esc(AUTHOR_NAME)}">
  <meta property="article:section" content="${esc(article.category||'')}">` : '';
  return `
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${esc(canonical)}">
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">
  <meta property="og:type" content="${ogType}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${esc(canonical)}">
  <meta property="og:image" content="${esc(img)}">
  <meta property="og:site_name" content="${esc(SITE_NAME)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(img)}">
  ${artMeta}
  ${ld}`;
}

function injectHead(html, headContent) {
  return html
    .replace(/<title>[^<]*<\/title>/i, '')
    .replace(/<meta\s+name="description"[^>]*>/i, '')
    .replace('</head>', `${headContent}\n</head>`);
}

async function getShell() {
  const p = path.join(DIST, 'index.html');
  if (!existsSync(p)) return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div></body></html>`;
  return fs.readFile(p, 'utf8');
}

function buildArticleJsonLd(a) {
  const heroUrl = a.heroUrl||a.hero_url||`${BUNNY_PULL}/images/og-default.webp`;
  const datePublished = a.publishedAt||a.published_at||new Date().toISOString();
  const dateModified = a.lastModifiedAt||a.last_modified_at||datePublished;
  return {
    '@context':'https://schema.org','@type':'Article',
    headline:a.title, description:a.metaDescription||a.meta_description||'',
    datePublished, dateModified,
    author:{'@type':'Person',name:AUTHOR_NAME,url:AUTHOR_URL},
    publisher:{'@type':'Organization',name:SITE_NAME,url:`https://${APEX}`,logo:{'@type':'ImageObject',url:`${BUNNY_PULL}/images/logo.webp`}},
    image:{'@type':'ImageObject',url:heroUrl,contentUrl:heroUrl,creditText:AUTHOR_NAME,creator:{'@type':'Person',name:AUTHOR_NAME}},
    articleSection:a.category||'', wordCount:a.wordCount||a.word_count||0,
    inLanguage:'en', isAccessibleForFree:true,
    mainEntityOfPage:{'@type':'WebPage','@id':`https://${APEX}/articles/${a.slug}`},
    reviewedBy:{'@type':'Person',name:AUTHOR_NAME,url:AUTHOR_URL},
    speakable:{'@type':'SpeakableSpecification',cssSelector:['[data-tldr="ai-overview"]']}
  };
}

function buildBreadcrumbJsonLd(a) {
  return {
    '@context':'https://schema.org','@type':'BreadcrumbList',
    itemListElement:[
      {'@type':'ListItem',position:1,name:'Home',item:`https://${APEX}/`},
      {'@type':'ListItem',position:2,name:'Articles',item:`https://${APEX}/articles`},
      {'@type':'ListItem',position:3,name:a.category||'Health',item:`https://${APEX}/articles?category=${encodeURIComponent(a.category||'')}`},
      {'@type':'ListItem',position:4,name:a.title,item:`https://${APEX}/articles/${a.slug}`}
    ]
  };
}

function buildFaqJsonLd(body) {
  const matches=[...(body||'').matchAll(/<h[23][^>]*>([^<]*\?[^<]*)<\/h[23]>/gi)].slice(0,6);
  if(matches.length<2) return null;
  const entities=matches.map(m=>{
    const q=stripHtml(m[1]);
    const after=body.slice(body.indexOf(m[0])+m[0].length);
    const pm=after.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const ans=pm?stripHtml(pm[1]).slice(0,300):'';
    return {'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:ans}};
  });
  return {'@context':'https://schema.org','@type':'FAQPage',mainEntity:entities};
}

async function ssrRoute(req, res, headContent) {
  try {
    const shell = await getShell();
    const html = injectHead(shell, headContent);
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=300');
    res.send(html);
  } catch(e) { res.status(500).send('Server error'); }
}

app.get('/health', (req,res) => res.json({ok:true,site:SITE_NAME,apex:APEX}));

app.get('/api/articles', async (req,res) => {
  try {
    const articles = await loadArticles();
    const published = articles.filter(a=>a.status==='published');
    const {category,q,limit=20,offset=0} = req.query;
    let filtered = published;
    if(category) filtered=filtered.filter(a=>a.category===category);
    if(q){const lq=q.toLowerCase();filtered=filtered.filter(a=>a.title.toLowerCase().includes(lq)||(a.metaDescription||'').toLowerCase().includes(lq)||(a.tags||[]).some(t=>t.toLowerCase().includes(lq)));}
    const total=filtered.length;
    const page=filtered.sort((a,b)=>new Date(b.publishedAt||b.published_at||0)-new Date(a.publishedAt||a.published_at||0)).slice(Number(offset),Number(offset)+Number(limit));
    res.json({articles:page,total,limit:Number(limit),offset:Number(offset)});
  } catch(e){res.status(500).json({error:e.message});}
});

app.get('/api/articles/:slug', async (req,res) => {
  try {
    const articles = await loadArticles();
    const a = articles.find(x=>x.slug===req.params.slug&&x.status==='published');
    if(!a) return res.status(404).json({error:'Not found'});
    const related = articles.filter(x=>x.status==='published'&&x.slug!==a.slug&&x.category===a.category).slice(0,3);
    res.set('Cache-Control','public, max-age=3600');
    res.json({article:a,related});
  } catch(e){res.status(500).json({error:e.message});}
});

app.get('/api/stats', async (req,res) => {
  try {
    const articles = await loadArticles();
    const published=articles.filter(a=>a.status==='published');
    const queued=articles.filter(a=>a.status==='queued');
    res.json({published:published.length,queued:queued.length,categories:[...new Set(published.map(a=>a.category))].length});
  } catch(e){res.status(500).json({error:e.message});}
});

app.get('/robots.txt', (req,res) => {
  res.setHeader('Content-Type','text/plain');
  res.setHeader('Cache-Control','public, max-age=3600');
  res.send(`User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nUser-agent: anthropic-ai\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: YouBot\nAllow: /\n\nUser-agent: KagiBot\nAllow: /\n\nUser-agent: Cohere-AI\nAllow: /\n\nUser-agent: CCBot\nAllow: /\n\nDisallow: /api/\nDisallow: /health\n\nSitemap: https://${APEX}/sitemap.xml\n\n# AEO discoverability\n# https://${APEX}/llms.txt\n# https://${APEX}/llms-full.txt\n# https://${APEX}/ai.txt\n`);
});

app.get('/sitemap.xml', async (req,res) => {
  try {
    const articles = await loadArticles();
    const published=articles.filter(a=>a.status==='published').sort((a,b)=>new Date(b.publishedAt||b.published_at||0)-new Date(a.publishedAt||a.published_at||0));
    const statics=[
      {url:`https://${APEX}/`,priority:'1.0',changefreq:'daily'},
      {url:`https://${APEX}/articles`,priority:'0.9',changefreq:'daily'},
      {url:`https://${APEX}/assessments`,priority:'0.8',changefreq:'weekly'},
      {url:`https://${APEX}/recommended`,priority:'0.7',changefreq:'weekly'},
      {url:`https://${APEX}/supplements`,priority:'0.8',changefreq:'weekly'},
      {url:`https://${APEX}/about`,priority:'0.6',changefreq:'monthly'},
      {url:`https://${APEX}/privacy`,priority:'0.3',changefreq:'yearly'},
    ];
    const artEntries=published.map(a=>{
      const heroUrl=a.heroUrl||a.hero_url||`${BUNNY_PULL}/images/og-default.webp`;
      const lastmod=(a.lastModifiedAt||a.last_modified_at||a.publishedAt||a.published_at||new Date().toISOString()).split('T')[0];
      return `  <url>\n    <loc>https://${APEX}/articles/${a.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n    <image:image>\n      <image:loc>${esc(heroUrl)}</image:loc>\n      <image:title>${esc(a.title||'')}</image:title>\n      <image:caption>${esc((a.metaDescription||a.meta_description||'').slice(0,200))}</image:caption>\n    </image:image>\n  </url>`;
    }).join('\n');
    const staticEntries=statics.map(p=>`  <url>\n    <loc>${p.url}</loc>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`).join('\n');
    res.setHeader('Content-Type','application/xml');
    res.setHeader('Cache-Control','public, max-age=3600');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${staticEntries}\n${artEntries}\n</urlset>`);
  } catch(e){res.status(500).send('Error');}
});

app.get('/llms.txt', async (req,res) => {
  try {
    const articles = await loadArticles();
    const published=articles.filter(a=>a.status==='published');
    const byCategory={};
    for(const a of published){const cat=a.category||'General';if(!byCategory[cat])byCategory[cat]=[];byCategory[cat].push(a);}
    let body=`# ${SITE_NAME}\n\n> The complete, un-embarrassing guide to pelvic floor health.\n\n> Author: ${AUTHOR_NAME} | ${AUTHOR_URL}\n\n`;
    for(const [cat,arts] of Object.entries(byCategory)){body+=`## ${cat}\n\n`;for(const a of arts){body+=`- [${a.title}](https://${APEX}/articles/${a.slug}): ${(a.metaDescription||a.meta_description||'').slice(0,120)}\n`;}body+='\n';}
    res.setHeader('Content-Type','text/markdown; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=3600');
    res.send(body);
  } catch(e){res.status(500).send('Error');}
});

app.get('/llms-full.txt', async (req,res) => {
  try {
    const articles = await loadArticles();
    const published=articles.filter(a=>a.status==='published');
    let body='';
    for(const a of published){
      const dp=a.publishedAt||a.published_at||'';
      const dm=a.lastModifiedAt||a.last_modified_at||dp;
      body+=`---\nslug: ${a.slug}\ntitle: ${a.title}\ncategory: ${a.category||''}\npublished: ${dp}\nmodified: ${dm}\n---\n\n${stripHtml(a.body||'')}\n\n`;
    }
    res.setHeader('Content-Type','text/plain; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=3600');
    res.send(body);
  } catch(e){res.status(500).send('Error');}
});

app.get('/ai.txt', async (req,res) => {
  try {
    const articles = await loadArticles();
    const published=articles.filter(a=>a.status==='published');
    res.setHeader('Content-Type','text/plain; charset=utf-8');
    res.setHeader('Cache-Control','public, max-age=3600');
    res.send(`# AI Access Policy for ${SITE_NAME}\n# https://${APEX}/ai.txt\n\nSite: https://${APEX}\nAuthor: ${AUTHOR_NAME}\nAuthor-URL: ${AUTHOR_URL}\nNiche: Pelvic Floor Health / Pelvic PT / Women's Health\n\nAllow-AI-Training: yes\nAllow-AI-Indexing: yes\nAllow-AI-Summarization: yes\n\n# Article index: ${published.length} published articles\n# Full corpus: https://${APEX}/llms-full.txt\n# Article index: https://${APEX}/llms.txt\n# Sitemap: https://${APEX}/sitemap.xml\n\n# Citation preference:\n# Cite as: ${AUTHOR_NAME}, ${SITE_NAME} (https://${APEX})\n`);
  } catch(e){res.status(500).send('Error');}
});

app.get('/', async (req,res) => {
  const jsonLd=[
    {'@context':'https://schema.org','@type':'WebSite',url:`https://${APEX}/`,name:SITE_NAME,potentialAction:{'@type':'SearchAction',target:`https://${APEX}/articles?q={search_term_string}`,'query-input':'required name=search_term_string'}},
    {'@context':'https://schema.org','@type':'Organization',name:SITE_NAME,url:`https://${APEX}/`,logo:`${BUNNY_PULL}/images/logo.webp`,sameAs:[AUTHOR_URL]}
  ];
  const head=buildHead({title:`${SITE_NAME} | Pelvic Floor Health, Dysfunction & Recovery`,description:"The complete, un-embarrassing guide to pelvic floor health. Dysfunction, rehab, pain, postpartum, menopause, and why pelvic PT is the most underutilized treatment in women's health.",canonical:`https://${APEX}/`,ogImage:`${BUNNY_PULL}/images/og-default.webp`,jsonLd});
  await ssrRoute(req,res,head);
});

app.get('/articles/:slug', async (req,res) => {
  try {
    const articles = await loadArticles();
    const a=articles.find(x=>x.slug===req.params.slug&&x.status==='published');
    if(!a){const head=buildHead({title:`Article Not Found | ${SITE_NAME}`,description:'This article could not be found.',canonical:`https://${APEX}/articles/${req.params.slug}`});return ssrRoute(req,res,head);}
    const heroUrl=a.heroUrl||a.hero_url||`${BUNNY_PULL}/images/og-default.webp`;
    const faqLd=buildFaqJsonLd(a.body||'');
    const jsonLd=[buildArticleJsonLd(a),buildBreadcrumbJsonLd(a)];
    if(faqLd)jsonLd.push(faqLd);
    const head=buildHead({title:`${a.title} | ${SITE_NAME}`,description:a.metaDescription||a.meta_description||a.title,canonical:`https://${APEX}/articles/${a.slug}`,ogImage:heroUrl,ogType:'article',article:a,jsonLd});
    res.set('Cache-Control','public, max-age=3600');
    await ssrRoute(req,res,head);
  } catch(e){res.status(500).send('Server error');}
});

const staticRoutes={
  '/articles':{title:`All Articles | ${SITE_NAME}`,desc:'Browse all articles on pelvic floor health, dysfunction, exercises, postpartum recovery, and more.'},
  '/assessments':{title:`Pelvic Floor Assessments | ${SITE_NAME}`,desc:'Free interactive assessments to understand your pelvic floor health.'},
  '/recommended':{title:`Recommended Tools & Resources | ${SITE_NAME}`,desc:'Pelvic floor tools, books, and resources recommended by The Oracle Lover.'},
  '/supplements':{title:`Supplements, Herbs & TCM for Pelvic Health | ${SITE_NAME}`,desc:'Evidence-informed supplements, herbs, and TCM approaches for pelvic floor health.'},
  '/about':{title:`About The Oracle Lover | ${SITE_NAME}`,desc:'The Oracle Lover is an intuitive educator and oracle guide.'},
  '/privacy':{title:`Privacy Policy | ${SITE_NAME}`,desc:'Privacy policy and affiliate disclosure for The Pelvic Floor.'},
};

for(const [route,meta] of Object.entries(staticRoutes)){
  app.get(route, async (req,res) => {
    const head=buildHead({title:meta.title,description:meta.desc,canonical:`https://${APEX}${route}`});
    await ssrRoute(req,res,head);
  });
}

app.get('/assessments/:id', async (req,res) => {
  const head=buildHead({title:`Pelvic Floor Assessment | ${SITE_NAME}`,description:'Take this free interactive pelvic floor assessment.',canonical:`https://${APEX}/assessments/${req.params.id}`});
  await ssrRoute(req,res,head);
});

app.get('*', async (req,res) => {
  const head=buildHead({title:SITE_NAME,description:'The complete guide to pelvic floor health.',canonical:`https://${APEX}${req.path}`});
  await ssrRoute(req,res,head);
});

const PORT = process.env.PORT || 3000;
startAllCrons();
app.listen(PORT, () => {
  console.log(`[server] ${SITE_NAME} running on port ${PORT}`);
  console.log(`[server] APEX: ${APEX} | Bunny: ${BUNNY_PULL}`);
});

export default app;

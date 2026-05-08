# YourPelvicHealing.com — Launch Checklist

**Domain:** yourpelvichealing.com  
**Hosting:** Render (auto-deploy from GitHub `main` branch)  
**CDN:** Bunny CDN — `pelvic-healing.b-cdn.net`  
**Last updated:** 2026-05-08

---

## Pre-Launch (Completed ✅)

### Content & Data
- [x] 530 articles written (avg 2,339 words, min 1,800 words)
- [x] 32 articles published, 288 queued for drip-release
- [x] Phase-aware publisher: 5/day burst (days 1–40), then 1/weekday steady
- [x] 9 interactive pelvic floor assessments
- [x] 200 supplement entries with Amazon affiliate links
- [x] All articles have unique hero images from Bunny CDN

### Images (Zero in Repo)
- [x] 44 unique hero images generated (4 per category × 11 categories)
- [x] All images converted to WebP and uploaded to `pelvic-healing.b-cdn.net/hero/`
- [x] All 530 article `hero_url` fields updated with correct CDN URLs
- [x] Assessment cards use existing `/images/hero-*.webp` from CDN
- [x] Zero binary images committed to the Git repository

### SEO & Discoverability
- [x] `robots.txt` — allows GPTBot, ChatGPT-User, ClaudeBot, PerplexityBot, KagiBot, Google-Extended
- [x] `sitemap.xml` — with `image:loc` entries for all published articles
- [x] `llms.txt` — article index for AI crawlers
- [x] `llms-full.txt` — full article corpus for AI crawlers
- [x] `ai.txt` — AI access policy
- [x] JSON-LD: Article, FAQPage, BreadcrumbList, WebSite, Organization
- [x] Twitter Cards: `summary_large_image`
- [x] Pinterest: `article:published_time`, `article:section`
- [x] OG: `og:image` per article
- [x] AEO: `data-tldr`, TL;DR sections, FAQ blocks

### Technical
- [x] All 29 §22 audit checks pass (zero failures)
- [x] Vite production build succeeds
- [x] Express server with in-process cron (no external scheduler)
- [x] WWW → APEX redirect middleware (first in chain)
- [x] Amazon Associate tag in all affiliate links
- [x] File-based JSON store (no database dependency)
- [x] No banned dependencies (no Next.js, Cloudflare, WordPress, Anthropic)

---

## Render Deployment Steps

1. Push this repo to GitHub `main` branch
2. In Render dashboard → New Web Service → connect GitHub repo
3. **Build command:** `pnpm install && pnpm build`
4. **Start command:** `node server/index.mjs`
5. **Environment variables:**
   - `NODE_ENV=production`
   - `PORT=10000` (Render assigns this automatically)
   - `BUNNY_API_KEY=703457e5-2ce2-466a-b53ba58ea1b9-728f-4e7c`
   - `DEEPSEEK_API_KEY=<your-key>` (for AI article writing)
   - `AMAZON_TAG=<your-tag>` (if overriding default)
6. **Custom domain:** Add `yourpelvichealing.com` in Render settings
7. **DNS:** Point `A` record to Render IP, add `CNAME www → yourpelvichealing.com`

---

## Post-Launch Monitoring

### Week 1 (Burst Phase)
- [ ] Verify 5 articles publish per day via `/api/publisher/status`
- [ ] Check Google Search Console for indexing
- [ ] Verify Bunny CDN images load on live domain
- [ ] Test all 9 assessments end-to-end
- [ ] Verify Amazon affiliate links open correctly
- [ ] Check sitemap at `yourpelvichealing.com/sitemap.xml`
- [ ] Verify `llms.txt` at `yourpelvichealing.com/llms.txt`

### Ongoing
- [ ] Monitor article queue — 288 queued articles = ~57 days of burst content
- [ ] After day 40, publisher switches to 1/weekday (288 articles ÷ 5/week = ~57 weeks)
- [ ] Add new articles via `/api/articles` POST endpoint as needed
- [ ] Monitor Amazon affiliate conversion in Associates dashboard

---

## Key URLs

| Page | URL |
|------|-----|
| Homepage | `yourpelvichealing.com` |
| All Articles | `yourpelvichealing.com/articles` |
| Assessments | `yourpelvichealing.com/assessments` |
| Supplements | `yourpelvichealing.com/supplements` |
| Recommended | `yourpelvichealing.com/recommended` |
| Publisher Status | `yourpelvichealing.com/api/publisher/status` |
| Sitemap | `yourpelvichealing.com/sitemap.xml` |
| LLMs.txt | `yourpelvichealing.com/llms.txt` |
| AI.txt | `yourpelvichealing.com/ai.txt` |

---

## Bunny CDN Assets

| Path | Contents |
|------|----------|
| `/hero/*.webp` | 44 article hero images (anatomy-1..4, dysfunction-1..4, etc.) |
| `/images/hero-*.webp` | Assessment hero images |
| `/images/card-*.webp` | Category card images |
| `/images/og-default.webp` | Default OG image |
| `/fonts/*.woff2` | Web fonts (CrimsonPro, NunitoSans, DMSans) |

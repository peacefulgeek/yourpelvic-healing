# The Pelvic Floor

**Evidence-Based Pelvic Health Education**

A full-stack wellness content site built for DigitalOcean App Platform. Archetype D (Scroll) design with warm mauve/lavender palette, Crimson Pro + Nunito Sans typography, 30 seed articles, 3 interactive assessments, and a GPT-4-powered writing engine.

---

## Live Preview

Run locally:
```bash
pnpm install
node src/scripts/seed.mjs   # generate articles.json (already done)
pnpm build
node server/index.mjs
# → http://localhost:3000
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, stats bar, article grid, assessment CTA, topics grid |
| `/articles` | Paginated article listing with category filters |
| `/articles/:slug` | Individual article with hero image, ToC, dot nav, reading progress |
| `/assessments` | Assessment listing page with 3 quizzes |
| `/assessments/:slug` | Interactive quiz with progress bar and personalized results |
| `/recommended` | Curated product/resource catalog |
| `/about` | About page with author bio |
| `/privacy` | Privacy policy |

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/articles` | Paginated article list (`?page=1&limit=12&category=&sort=`) |
| `GET /api/articles/:slug` | Single article by slug |
| `GET /sitemap.xml` | XML sitemap for all pages |
| `GET /robots.txt` | Robots.txt with LLM crawler allowlist |
| `GET /llms.txt` | LLMs.txt for AI indexing |

---

## Assessments

1. **Pelvic Floor Symptom Screener** — 10 questions, 6 outcomes, tag-match scoring
2. **Is My Pelvic Floor Too Tight or Too Weak?** — 10 questions, 3 outcomes, sum scoring
3. **Postpartum Recovery Readiness Check** — 8 questions, 3 outcomes, sum scoring

---

## Content

30 seed articles across 8 categories:
- **Anatomy** — What the pelvic floor is, anatomy basics
- **Dysfunction** — Hypertonic/hypotonic, bowel dysfunction, prolapse
- **Postpartum** — Recovery, pregnancy, diastasis recti
- **Pelvic PT** — What to expect, biofeedback, dilator therapy
- **Pelvic Pain** — Vaginismus, painful sex, endometriosis
- **Exercises** — Kegels, breathing, running, HIIT, yoga
- **Menopause** — GSM, hormonal changes
- **Incontinence** — Stress, urge, mixed

---

## Writing Engine

The writing engine generates new articles automatically using GPT-4:

```bash
# Generate 1 article from the topic queue
node src/scripts/writing-engine.mjs --count=1

# Start the daily cron (runs at 3am)
node src/scripts/cron.mjs
```

Articles are quality-gated (minimum 1200 words, required sections, disclaimer check) before publishing.

---

## DigitalOcean Deployment

See [DEPLOY.md](./DEPLOY.md) for full instructions.

**Quick deploy:**
```bash
# 1. Push to GitHub
git remote add origin https://github.com/YOUR_ORG/the-pelvic-floor.git
git push -u origin main

# 2. Update .do/app.yaml with your repo and secrets

# 3. Deploy
doctl apps create --spec .do/app.yaml
```

**Environment variables needed:**
- `NODE_ENV=production`
- `PORT=3000`
- `SITE_URL=https://thepelvicfloor.com`
- `OPENAI_API_KEY` — for writing engine
- `BUNNY_STORAGE_ZONE`, `BUNNY_API_KEY`, `BUNNY_CDN_URL` — for CDN images (optional)
- `DATABASE_URL` — PostgreSQL connection string (optional; uses file-based store by default)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + React Router v6 |
| Bundler | Vite 5 |
| Styling | Custom CSS with design tokens (no framework) |
| Server | Express.js (ESM) |
| Data | File-based JSON store (`data/articles.json`) |
| Database | Optional PostgreSQL via `DATABASE_URL` |
| CDN | Bunny CDN (optional, plug-and-play) |
| AI | OpenAI GPT-4 (writing engine) |
| Deployment | DigitalOcean App Platform |

---

## Design System

**Colors:**
- Primary: `#2d1b3d` (deep plum)
- Accent: `#9b6b8a` (mauve)
- Background: `#faf8f9` (warm white)
- Bio card: `#f5f0f4` (lavender tint)

**Typography:**
- Headings: Crimson Pro (Google Fonts)
- Body/UI: Nunito Sans (Google Fonts)

**Archetype D (Scroll):**
- Full-viewport hero with gradient overlay
- Floating dot navigation (right side)
- Reading progress bar (top)
- Sticky table of contents sidebar
- "In Short" TL;DR box (AEO)
- Author byline with avatar

---

## SEO / AEO

- JSON-LD structured data (Article, BreadcrumbList, FAQPage, MedicalWebPage)
- `sitemap.xml` with all pages and articles
- `robots.txt` with LLM crawler allowlist
- `llms.txt` with site description and article index
- TL;DR `<section data-tldr="ai-overview">` on every article
- Open Graph + Twitter Card meta tags
- Canonical URLs

---

## File Structure

```
the-pelvic-floor/
├── .do/app.yaml              # DigitalOcean App Platform spec
├── data/articles.json        # Article data store
├── dist/                     # Production build output
├── index.html                # Vite entry point
├── public/
│   ├── favicon.svg
│   └── images/               # Hero images (15 AI-generated)
├── server/
│   └── index.mjs             # Express server (all routes)
├── src/
│   ├── client/
│   │   ├── App.tsx           # React Router setup
│   │   ├── components/       # Nav, Footer, ArticleCard, ToC, etc.
│   │   ├── pages/            # All page components
│   │   └── styles/           # tokens.css + global.css
│   ├── data/
│   │   ├── assessments.ts    # Assessment definitions
│   │   └── product-catalog.ts
│   ├── lib/
│   │   ├── articles-store.mjs
│   │   ├── aeo.mjs
│   │   └── bunny.mjs
│   └── scripts/
│       ├── seed.mjs          # Seed articles.json
│       ├── writing-engine.mjs # GPT-4 article generator
│       ├── cron.mjs          # Daily scheduler
│       └── assign-images.mjs # Image assignment utility
├── DEPLOY.md
└── README.md
```

# Deployment Guide — The Pelvic Floor

## DigitalOcean App Platform

### Prerequisites

1. A DigitalOcean account
2. The `doctl` CLI installed: `brew install doctl`
3. A GitHub repository with this code
4. (Optional) A Bunny CDN account for image hosting
5. (Optional) A PostgreSQL database (DigitalOcean Managed DB or external)

### Quick Deploy

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_ORG/the-pelvic-floor.git
   git push -u origin main
   ```

2. **Update `.do/app.yaml`**
   - Replace `YOUR_GITHUB_ORG/the-pelvic-floor` with your repo
   - Replace `YOUR_OPENAI_API_KEY` with your key
   - Replace Bunny CDN values if using CDN
   - Replace `DATABASE_URL` if using PostgreSQL

3. **Deploy via DigitalOcean CLI**
   ```bash
   doctl auth init
   doctl apps create --spec .do/app.yaml
   ```

4. **Or deploy via DigitalOcean Dashboard**
   - Go to [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
   - Click "Create App"
   - Connect your GitHub repo
   - Use the `.do/app.yaml` spec

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | Set to `production` |
| `PORT` | Yes | Set to `3000` |
| `SITE_URL` | Yes | Your domain, e.g. `https://thepelvicfloor.com` |
| `OPENAI_API_KEY` | For writing engine | OpenAI API key |
| `BUNNY_STORAGE_ZONE` | For CDN images | Bunny storage zone name |
| `BUNNY_API_KEY` | For CDN images | Bunny API key |
| `BUNNY_CDN_URL` | For CDN images | Bunny CDN pull zone URL |
| `DATABASE_URL` | Optional | PostgreSQL connection string |

### File-Based Mode (No Database)

The site runs in file-based mode by default — no database required. Articles are stored in `data/articles.json`. This works perfectly for DigitalOcean App Platform.

To add a database later, set `DATABASE_URL` and the server will automatically use PostgreSQL.

### Custom Domain

1. In DigitalOcean App Platform, go to Settings → Domains
2. Add your domain (e.g., `thepelvicfloor.com`)
3. Update your DNS records as instructed
4. SSL is handled automatically

### Adding Bunny CDN

1. Create a Bunny CDN account at [bunny.net](https://bunny.net)
2. Create a storage zone (e.g., `pelvic-floor`)
3. Create a pull zone pointing to your storage zone
4. Set environment variables:
   - `BUNNY_STORAGE_ZONE`: your storage zone name
   - `BUNNY_API_KEY`: your Bunny API key
   - `BUNNY_CDN_URL`: your pull zone URL (e.g., `https://pelvic-floor.b-cdn.net`)
5. Images will automatically be served from Bunny CDN

### Writing Engine

The writing engine generates new articles automatically using OpenAI. To run it:

```bash
# Generate 1 article
node src/scripts/writing-engine.mjs --count=1

# Generate a specific article
node src/scripts/writing-engine.mjs --slug=some-article-slug

# Start the daily cron (runs at 3am)
node src/scripts/cron.mjs
```

On DigitalOcean, you can run the writing engine as a separate worker process or use a cron job.

### Build Commands

```bash
# Install dependencies
pnpm install

# Seed articles (first time)
node src/scripts/seed.mjs

# Build for production
pnpm build

# Start production server
node server/index.mjs

# Development mode
pnpm dev
```

### Health Check

The app exposes a health check endpoint at `/api/articles?limit=1`. DigitalOcean will use this to verify the app is running.

### Monitoring

Logs are available in the DigitalOcean App Platform dashboard under the "Logs" tab. Writing engine logs are saved to `data/writing-engine.log`.

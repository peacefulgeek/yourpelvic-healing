import pg from 'pg';

const { Pool } = pg;

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });

    pool.on('error', (err) => {
      console.error('[db] Unexpected pool error:', err);
    });
  }
  return pool;
}

export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await getPool().query(text, params);
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`[db] Slow query (${duration}ms): ${text.substring(0, 80)}`);
    }
    return res;
  } catch (err) {
    console.error('[db] Query error:', err.message, '\nQuery:', text.substring(0, 120));
    throw err;
  }
}

export async function initDb() {
  console.log('[db] Initializing schema...');
  await query(`
    CREATE TABLE IF NOT EXISTS articles (
      id            SERIAL PRIMARY KEY,
      slug          TEXT UNIQUE NOT NULL,
      title         TEXT NOT NULL,
      meta_description TEXT,
      og_title      TEXT,
      og_description TEXT,
      category      TEXT NOT NULL DEFAULT 'pelvic-health',
      tags          TEXT[] DEFAULT '{}',
      body          TEXT NOT NULL,
      hero_url      TEXT,
      image_alt     TEXT,
      reading_time  INT DEFAULT 8,
      author        TEXT NOT NULL DEFAULT 'The Oracle Lover',
      status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','queued','published')),
      asins_used    TEXT[] DEFAULT '{}',
      queued_at     TIMESTAMPTZ,
      published_at  TIMESTAMPTZ,
      updated_at    TIMESTAMPTZ DEFAULT NOW(),
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS assessments (
      id          SERIAL PRIMARY KEY,
      slug        TEXT UNIQUE NOT NULL,
      title       TEXT NOT NULL,
      description TEXT,
      questions   JSONB NOT NULL DEFAULT '[]',
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS assessment_results (
      id            SERIAL PRIMARY KEY,
      assessment_id INT REFERENCES assessments(id),
      session_id    TEXT,
      answers       JSONB NOT NULL DEFAULT '{}',
      score         INT,
      result_label  TEXT,
      created_at    TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await query(`
    CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
    CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
    CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
  `).catch(() => {}); // Ignore if already exists

  console.log('[db] Schema initialized');
}

export async function getPublishedArticles({ limit = 20, offset = 0, category } = {}) {
  const params = [];
  let where = `WHERE status = 'published'`;
  if (category) {
    params.push(category);
    where += ` AND category = $${params.length}`;
  }
  params.push(limit, offset);
  const { rows } = await query(
    `SELECT id, slug, title, meta_description, category, tags, hero_url, image_alt,
            reading_time, author, published_at, updated_at
     FROM articles ${where}
     ORDER BY published_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );
  return rows;
}

export async function getArticleBySlug(slug) {
  const { rows } = await query(
    `SELECT * FROM articles WHERE slug = $1 AND status = 'published'`,
    [slug]
  );
  return rows[0] || null;
}

export async function getArticleCount() {
  const { rows } = await query(
    `SELECT count(*)::int as count FROM articles WHERE status = 'published'`
  );
  return rows[0].count;
}

export async function getRelatedArticles(slug, tags, limit = 3) {
  const { rows } = await query(
    `SELECT id, slug, title, hero_url, image_alt, reading_time, published_at
     FROM articles
     WHERE status = 'published' AND slug != $1
       AND (tags && $2::text[] OR category = 'pelvic-health')
     ORDER BY published_at DESC
     LIMIT $3`,
    [slug, tags, limit]
  );
  return rows;
}

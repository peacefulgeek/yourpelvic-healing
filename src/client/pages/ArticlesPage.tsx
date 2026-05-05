import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';

interface Article {
  slug: string;
  title: string;
  meta_description?: string;
  category?: string;
  hero_url?: string;
  image_alt?: string;
  reading_time?: number;
  published_at?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface ArticlesPageProps {
  ssrData?: { articles?: Article[]; total?: number; page?: number; limit?: number };
}

const CATEGORIES = [
  { slug: '', label: 'All Articles' },
  { slug: 'anatomy', label: 'Anatomy' },
  { slug: 'dysfunction', label: 'Dysfunction' },
  { slug: 'postpartum', label: 'Postpartum' },
  { slug: 'pelvic-pt', label: 'Pelvic PT' },
  { slug: 'pain', label: 'Pelvic Pain' },
  { slug: 'exercises', label: 'Exercises' },
  { slug: 'menopause', label: 'Menopause' },
  { slug: 'incontinence', label: 'Incontinence' },
];

export function ArticlesPage({ ssrData }: ArticlesPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [articles, setArticles] = useState<Article[]>(ssrData?.articles || []);
  const [pagination, setPagination] = useState<Pagination>({
    page: ssrData?.page || 1,
    limit: ssrData?.limit || 12,
    total: ssrData?.total || 0,
    pages: Math.ceil((ssrData?.total || 0) / (ssrData?.limit || 12)),
  });
  const [loading, setLoading] = useState(!ssrData?.articles);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', '12');
    if (category) params.set('category', category);

    fetch(`/api/articles?${params}`)
      .then(r => r.json())
      .then(data => {
        setArticles(data.articles || []);
        setPagination(data.pagination || { page, limit: 12, total: 0, pages: 0 });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category, page]);

  const setCategory = (cat: string) => {
    const params = new URLSearchParams();
    if (cat) params.set('category', cat);
    setSearchParams(params);
  };

  const setPage = (p: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(p));
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ─── Page Header ─── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2D1B2E 0%, #4A2550 100%)',
          padding: 'var(--space-24) 0 var(--space-16)',
          marginTop: 0,
        }}
      >
        <div className="content-width" style={{ textAlign: 'center' }}>
          <div
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-accent-light)',
              marginBottom: 'var(--space-4)',
            }}
          >
            The Pelvic Floor
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 700,
              color: 'white',
              marginBottom: 'var(--space-4)',
            }}
          >
            All Articles
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)' }}>
            {pagination.total > 0 ? `${pagination.total} articles` : 'Loading...'} — practical, specific, evidence-based
          </p>
        </div>
      </div>

      {/* ─── Category Filter ─── */}
      <div
        style={{
          background: 'var(--color-white)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-4) 0',
          position: 'sticky',
          top: 60,
          zIndex: 40,
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'flex',
              gap: 'var(--space-2)',
              overflowX: 'auto',
              paddingBottom: 'var(--space-1)',
              scrollbarWidth: 'none',
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setCategory(cat.slug)}
                style={{
                  padding: 'var(--space-2) var(--space-4)',
                  borderRadius: 'var(--radius-full)',
                  border: '1.5px solid',
                  borderColor: category === cat.slug ? 'var(--color-accent)' : 'var(--color-border)',
                  background: category === cat.slug ? 'var(--color-accent)' : 'transparent',
                  color: category === cat.slug ? 'white' : 'var(--color-muted)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all var(--transition-fast)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Articles Grid ─── */}
      <section className="page-section" aria-label="Articles list">
        <div className="container">
          {loading ? (
            <div className="article-grid">
              {[...Array(9)].map((_, i) => (
                <div key={i} style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                  <div className="skeleton" style={{ height: 200 }} />
                  <div style={{ padding: 'var(--space-6)', background: 'white' }}>
                    <div className="skeleton" style={{ height: 12, width: '40%', marginBottom: 'var(--space-3)' }} />
                    <div className="skeleton" style={{ height: 24, marginBottom: 'var(--space-3)' }} />
                    <div className="skeleton" style={{ height: 16, width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-24) 0', color: 'var(--color-muted)' }}>
              <p style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>No articles found.</p>
              <button onClick={() => setCategory('')} className="btn btn-outline">
                View all articles
              </button>
            </div>
          ) : (
            <div className="article-grid">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}

          {/* ─── Pagination ─── */}
          {pagination.pages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--space-2)',
                marginTop: 'var(--space-12)',
              }}
            >
              <button
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
                className="btn btn-outline"
                style={{ opacity: page <= 1 ? 0.4 : 1 }}
              >
                &larr; Previous
              </button>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 var(--space-4)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: 'var(--text-sm)',
                  color: 'var(--color-muted)',
                }}
              >
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= pagination.pages}
                className="btn btn-outline"
                style={{ opacity: page >= pagination.pages ? 0.4 : 1 }}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
export default ArticlesPage;

import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DotNav } from '../components/DotNav';
import { ReadingProgress } from '../components/ReadingProgress';
import { AuthorByline } from '../components/AuthorByline';
import { TableOfContents, extractHeadings } from '../components/TableOfContents';
import { ArticleCard } from '../components/ArticleCard';

interface Article {
  slug: string;
  title: string;
  meta_description?: string;
  og_title?: string;
  category?: string;
  tags?: string[];
  body: string;
  hero_url?: string;
  image_alt?: string;
  reading_time?: number;
  author?: string;
  published_at?: string;
  updated_at?: string;
}

interface ArticlePageProps {
  ssrData?: { article?: Article; related?: Article[] };
}

export function ArticlePage({ ssrData }: ArticlePageProps) {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(ssrData?.article || null);
  const [related, setRelated] = useState<Article[]>(ssrData?.related || []);
  const [loading, setLoading] = useState(!ssrData?.article);
  const [heroParallax, setHeroParallax] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ssrData?.article && slug) {
      fetch(`/api/articles/${slug}`)
        .then(r => r.json())
        .then(data => {
          setArticle(data.article || null);
          setRelated(data.related || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [slug, ssrData]);

  // Parallax on hero
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollY = window.scrollY;
        setHeroParallax(scrollY * 0.3);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div style={{ paddingTop: '100vh' }}>
        <div className="skeleton" style={{ height: '100vh', position: 'fixed', inset: 0 }} />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ padding: 'var(--space-24) var(--space-6)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', marginBottom: 'var(--space-4)' }}>
          Article Not Found
        </h1>
        <Link to="/articles" className="btn btn-primary">
          Browse All Articles
        </Link>
      </div>
    );
  }

  const headings = extractHeadings(article.body);
  const sections = headings
    .filter(h => h.level === 2)
    .map((h, i) => ({ id: h.id || `section-${i}`, label: h.text }));

  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  // Split body to insert author bio mid-article (after ~40% of content)
  const bodyParts = splitBodyForBio(article.body);

  return (
    <>
      <ReadingProgress />

      {/* ─── Full-viewport Hero ─── */}
      <div className="hero" ref={heroRef} aria-label="Article hero">
        {article.hero_url ? (
          <img
            src={article.hero_url}
            alt={article.image_alt || article.title}
            className="hero-image"
            style={{ transform: `scale(1.05) translateY(${heroParallax}px)` }}
            fetchPriority="high"
            decoding="async"
          />
        ) : (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, #2D1B2E 0%, #4A2550 50%, #221825 100%)',
            }}
            aria-hidden="true"
          />
        )}
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-category">
            <Link
              to={`/articles?category=${article.category || 'pelvic-health'}`}
              style={{ color: 'var(--color-accent-light)', textDecoration: 'none' }}
            >
              {formatCategory(article.category || 'pelvic-health')}
            </Link>
          </div>
          <h1 className="hero-title">{article.title}</h1>
          <div className="hero-meta">
            <span>{article.author || 'The Oracle Lover'}</span>
            {formattedDate && (
              <>
                <span className="hero-meta-dot" aria-hidden="true" />
                <time dateTime={article.published_at}>{formattedDate}</time>
              </>
            )}
            {article.reading_time && (
              <>
                <span className="hero-meta-dot" aria-hidden="true" />
                <span>{article.reading_time} min read</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ─── Floating Dot Nav ─── */}
      {sections.length > 1 && (
        <DotNav sections={[
          { id: 'article-top', label: 'Introduction' },
          ...sections,
          { id: 'article-end', label: 'Conclusion' },
        ]} />
      )}

      {/* ─── Article Content ─── */}
      <article id="article-top" aria-label={article.title}>
        <div className="article-body">
          {/* Table of Contents */}
          <TableOfContents headings={headings} />

          {/* First half of body */}
          <div
            dangerouslySetInnerHTML={{ __html: bodyParts.first }}
          />

          {/* Mid-article Author Bio */}
          <AuthorByline lastUpdated={article.updated_at || article.published_at} variant="mid-article" />

          {/* Second half of body */}
          <div
            dangerouslySetInnerHTML={{ __html: bodyParts.second }}
          />

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-8)' }}>
              {article.tags.map((tag) => (
                <Link key={tag} to={`/articles?category=${tag}`} className="tag">
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Health Disclaimer */}
          <div className="health-disclaimer">
            <strong>Disclaimer:</strong> Content on thepelvicfloor.com is for educational purposes only. Pelvic floor conditions require professional assessment. Always consult a pelvic floor physical therapist or qualified healthcare provider.
          </div>

          {/* Bottom Author Byline */}
          <AuthorByline lastUpdated={article.updated_at || article.published_at} variant="bottom" />
        </div>

        {/* ─── Related Articles ─── */}
        {related.length > 0 && (
          <div className="article-body" id="article-end">
            <div className="related-articles">
              <h2>Keep Reading</h2>
              <div className="related-grid">
                {related.map((r) => (
                  <ArticleCard key={r.slug} article={r} />
                ))}
              </div>
            </div>
          </div>
        )}
      </article>
    </>
  );
}

function splitBodyForBio(body: string): { first: string; second: string } {
  // Find the H2 tags and split after the 2nd or 3rd one (mid-article)
  const h2Regex = /<h2[^>]*>/gi;
  const matches: RegExpExecArray[] = [];
  let match;
  while ((match = h2Regex.exec(body)) !== null) {
    matches.push(match);
  }

  if (matches.length >= 4) {
    // Split after the 2nd H2
    const splitPoint = matches[1].index;
    return {
      first: body.substring(0, splitPoint),
      second: body.substring(splitPoint),
    };
  }

  // Fallback: split at ~40% of content
  const splitPoint = Math.floor(body.length * 0.4);
  const nearestParagraph = body.indexOf('</p>', splitPoint);
  const actualSplit = nearestParagraph > 0 ? nearestParagraph + 4 : splitPoint;

  return {
    first: body.substring(0, actualSplit),
    second: body.substring(actualSplit),
  };
}

function formatCategory(cat: string): string {
  const map: Record<string, string> = {
    'pelvic-health': 'Pelvic Health',
    'dysfunction': 'Dysfunction',
    'postpartum': 'Postpartum',
    'pelvic-pt': 'Pelvic PT',
    'pain': 'Pelvic Pain',
    'exercises': 'Exercises',
    'menopause': 'Menopause',
    'anatomy': 'Anatomy',
    'incontinence': 'Incontinence',
  };
  return map[cat] || cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
export default ArticlePage;

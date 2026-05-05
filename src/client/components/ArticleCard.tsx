import { Link } from 'react-router-dom';

interface Article {
  slug: string;
  title: string;
  meta_description?: string;
  category?: string;
  tags?: string[];
  hero_url?: string;
  image_alt?: string;
  reading_time?: number;
  published_at?: string;
}

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  const categoryLabel = formatCategory(article.category || 'pelvic-health');

  return (
    <Link
      to={`/articles/${article.slug}`}
      className="article-card"
      style={featured ? { gridColumn: 'span 2' } : {}}
    >
      {article.hero_url ? (
        <img
          src={article.hero_url}
          alt={article.image_alt || article.title}
          className="article-card-image"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="article-card-image-placeholder" aria-hidden="true">
          <PelvicFloorIcon />
        </div>
      )}

      <div className="article-card-body">
        <div className="article-card-category">{categoryLabel}</div>
        <h2 className="article-card-title">{article.title}</h2>
        {article.meta_description && (
          <p className="article-card-excerpt">{article.meta_description}</p>
        )}
        <div className="article-card-meta">
          {formattedDate && <span>{formattedDate}</span>}
          {formattedDate && article.reading_time && (
            <span className="hero-meta-dot" aria-hidden="true" />
          )}
          {article.reading_time && <span>{article.reading_time} min read</span>}
        </div>
      </div>
    </Link>
  );
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
  };
  return map[cat] || cat.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export default ArticleCard;

function PelvicFloorIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="20" stroke="#9C6E8A" strokeWidth="1.5" strokeDasharray="4 2" />
      <path d="M14 24C14 18.477 18.477 14 24 14s10 4.477 10 10-4.477 10-10 10" stroke="#9C6E8A" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="4" fill="#C4A0B5" opacity="0.6" />
    </svg>
  );
}

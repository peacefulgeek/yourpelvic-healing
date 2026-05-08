import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArticleCard from '../components/ArticleCard';

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

interface HomePageProps {
  ssrData?: { articles?: Article[] };
}

const TOPICS = [
  { slug: 'anatomy', label: 'Anatomy', icon: '🔬', desc: 'What it is and how it works' },
  { slug: 'dysfunction', label: 'Dysfunction', icon: '⚡', desc: 'Tight vs. weak — what matters' },
  { slug: 'postpartum', label: 'Postpartum', icon: '🌱', desc: 'Recovery after birth' },
  { slug: 'pelvic-pt', label: 'Pelvic PT', icon: '🏥', desc: 'What to expect and how to find one' },
  { slug: 'pain', label: 'Pelvic Pain', icon: '💜', desc: 'Diagnoses and treatments' },
  { slug: 'exercises', label: 'Exercises', icon: '🧘', desc: 'Beyond Kegels' },
  { slug: 'menopause', label: 'Menopause', icon: '🌙', desc: 'GSM and what helps' },
  { slug: 'incontinence', label: 'Incontinence', icon: '💧', desc: 'Stress, urge, and mixed' },
];

export default function HomePage({ ssrData }: HomePageProps) {
  const [articles, setArticles] = useState<Article[]>(ssrData?.articles || []);
  const [loading, setLoading] = useState(!ssrData?.articles);

  useEffect(() => {
    if (!ssrData?.articles) {
      fetch('/api/articles?limit=9')
        .then(r => r.json())
        .then(data => {
          setArticles(data.articles || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [ssrData]);

  return (
    <>
      {/* ─── Hero ─── */}
      <section className="home-hero" aria-label="Site introduction">
        <div
          className="home-hero-bg"
          style={{ backgroundImage: 'url(https://pelvic-healing.b-cdn.net/images/hero-home.webp)' }}
          aria-hidden="true"
        />
        <div className="home-hero-overlay" aria-hidden="true" />
        <div className="home-hero-content">
          <div className="home-hero-eyebrow">Pelvic Floor Health</div>
          <h1 className="home-hero-title">
            What They Should Have<br />Taught You
          </h1>
          <p className="home-hero-subtitle">
            The complete, un-embarrassing guide to pelvic floor health. Dysfunction, rehab, pain, postpartum, menopause. No jargon. No shame. Just what works.
          </p>
          <div className="home-hero-ctas">
            <Link to="/articles" className="btn btn--primary">
              Read the Articles
            </Link>
            <Link to="/assessments" className="btn btn--ghost-light">
              Take the Assessment
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">30+</span>
              <span className="stat-label">In-depth articles</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Free assessments</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Evidence-based</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">Free</span>
              <span className="stat-label">Always</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Featured Articles ─── */}
      <section className="page-section" aria-labelledby="articles-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Latest Articles</div>
            <h2 className="section-title" id="articles-heading">
              The Education You Deserve
            </h2>
            <p className="section-subtitle">
              Practical, specific, and written by someone who doesn't think your body is embarrassing.
            </p>
          </div>

          {loading ? (
            <div className="article-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="article-card-skeleton">
                  <div className="skeleton skeleton--image" />
                  <div className="skeleton-body">
                    <div className="skeleton skeleton--label" />
                    <div className="skeleton skeleton--title" />
                    <div className="skeleton skeleton--text" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="article-grid">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}

          <div className="section-cta">
            <Link to="/articles" className="btn btn--outline">
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Assessment CTA ─── */}
      <section className="assessment-cta-section" aria-labelledby="assessment-cta-heading">
        <div
          className="assessment-cta-bg"
          style={{ backgroundImage: 'url(https://pelvic-healing.b-cdn.net/images/hero-exercises.webp)' }}
          aria-hidden="true"
        />
        <div className="assessment-cta-overlay" aria-hidden="true" />
        <div className="container assessment-cta-content">
          <div className="section-label section-label--light">Free Assessment</div>
          <h2 id="assessment-cta-heading" className="assessment-cta-title">
            Is Your Pelvic Floor Too Tight,<br />Too Weak, or Something Else?
          </h2>
          <p className="assessment-cta-subtitle">
            Stop guessing. Take the 5-minute assessment and find out what's actually going on.
          </p>
          <Link to="/assessments" className="btn btn--primary btn--large">
            Start the Assessment
          </Link>
        </div>
      </section>

      {/* ─── Topic Categories ─── */}
      <section className="page-section topics-section" aria-labelledby="topics-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-label">Browse by Topic</div>
            <h2 className="section-title" id="topics-heading">
              Find What You Need
            </h2>
          </div>
          <div className="topics-grid">
            {TOPICS.map((topic) => (
              <Link
                key={topic.slug}
                to={`/articles?category=${topic.slug}`}
                className="topic-card"
              >
                <span className="topic-card__icon">{topic.icon}</span>
                <span className="topic-card__label">{topic.label}</span>
                <span className="topic-card__desc">{topic.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Oracle Lover Quote ─── */}
      <section className="quote-section" aria-label="Author quote">
        <div className="content-width">
          <blockquote className="oracle-quote">
            <span className="oracle-quote__mark" aria-hidden="true">"</span>
            Leaking when you laugh is common. It's not normal. There's a difference.
          </blockquote>
          <cite className="oracle-quote__cite">— The Oracle Lover</cite>
        </div>
      </section>

      {/* ─── Postpartum Feature ─── */}
      <section className="feature-section" aria-labelledby="postpartum-heading">
        <div className="container">
          <div className="feature-grid">
            <div
              className="feature-image"
              style={{ backgroundImage: 'url(https://pelvic-healing.b-cdn.net/images/hero-postpartum.webp)' }}
              aria-hidden="true"
            />
            <div className="feature-content">
              <div className="section-label">Postpartum Recovery</div>
              <h2 id="postpartum-heading" className="feature-title">
                The 6-Week Clearance Is Not Enough
              </h2>
              <p className="feature-text">
                In France, postpartum pelvic PT is standard care. Every person who gives birth receives a referral. In the US, it's optional and often not mentioned. That's a gap in care — and it has consequences.
              </p>
              <p className="feature-text">
                Whether you had a vaginal or cesarean delivery, your pelvic floor needs attention. The earlier you start, the better the outcomes.
              </p>
              <Link to="/articles/postpartum-pelvic-floor" className="btn btn--primary">
                Read: Postpartum Pelvic Floor
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pelvic PT Feature ─── */}
      <section className="feature-section feature-section--reverse" aria-labelledby="pt-heading">
        <div className="container">
          <div className="feature-grid feature-grid--reverse">
            <div className="feature-content">
              <div className="section-label">Pelvic PT</div>
              <h2 id="pt-heading" className="feature-title">
                What Actually Happens in a Pelvic PT Session
              </h2>
              <p className="feature-text">
                The reason people avoid pelvic PT isn't that it's ineffective. It's that they don't know what it involves. Let me demystify this for you.
              </p>
              <p className="feature-text">
                Pelvic PTs are clinical professionals who do this work every day. There is nothing about your body that will surprise or embarrass them.
              </p>
              <Link to="/articles/what-pelvic-floor-physical-therapy-involves" className="btn btn--primary">
                Read: What Pelvic PT Involves
              </Link>
            </div>
            <div
              className="feature-image"
              style={{ backgroundImage: 'url(https://pelvic-healing.b-cdn.net/images/hero-pelvic-pt.webp)' }}
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* ─── Health Disclaimer ─── */}
      <div className="container" style={{ paddingBottom: 'var(--space-8)' }}>
        <div className="health-disclaimer">
          <strong>Disclaimer:</strong> Content on thepelvicfloor.com is for educational purposes only. Pelvic floor conditions require professional assessment. Always consult a pelvic floor physical therapist or qualified healthcare provider.
        </div>
      </div>
    </>
  );
}

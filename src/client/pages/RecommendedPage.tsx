import { PRODUCT_CATALOG } from '../../data/product-catalog';

const CATEGORIES = [
  { key: 'books', label: 'Books', icon: '📚', desc: 'The essential reading list' },
  { key: 'pelvic-tools', label: 'Pelvic Floor Tools', icon: '🔧', desc: 'Wands, weights, and dilators' },
  { key: 'postpartum', label: 'Postpartum Recovery', icon: '🌱', desc: 'Perineal care and support' },
  { key: 'exercise', label: 'Exercise Support', icon: '🧘', desc: 'Movement and core awareness' },
  { key: 'pain-relief', label: 'Pain Relief', icon: '💜', desc: 'TENS, heat, and more' },
];

export function RecommendedPage() {
  return (
    <>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #2D1B2E 0%, #4A2550 100%)',
          padding: 'var(--space-24) 0 var(--space-16)',
        }}
      >
        <div className="content-width" style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-xs)',
            fontWeight: 500,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-light)',
            marginBottom: 'var(--space-4)',
          }}>
            Pelvic Health Library
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 700,
            color: 'white',
            marginBottom: 'var(--space-4)',
          }}>
            Tools We Recommend
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)', maxWidth: 520, margin: '0 auto' }}>
            Carefully selected tools, books, and resources for pelvic floor health. No filler. Only what actually helps.
          </p>
        </div>
      </div>

      {/* Affiliate Disclosure */}
      <div className="container" style={{ paddingTop: 'var(--space-8)' }}>
        <div className="health-disclaimer">
          <strong>Disclosure:</strong> As an Amazon Associate, I earn from qualifying purchases. All links marked (paid link) are affiliate links. This doesn't change my recommendations — I only list things I'd actually tell a friend about.
        </div>
      </div>

      {/* Products by Category */}
      <div className="container" style={{ paddingBottom: 'var(--space-24)' }}>
        {CATEGORIES.map((cat) => {
          const products = PRODUCT_CATALOG.filter(p => p.category === cat.key);
          if (products.length === 0) return null;

          return (
            <section key={cat.key} style={{ marginTop: 'var(--space-16)' }} aria-labelledby={`cat-${cat.key}`}>
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontSize: '1.5rem' }}>{cat.icon}</span>
                  <h2
                    id={`cat-${cat.key}`}
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 600,
                    }}
                  >
                    {cat.label}
                  </h2>
                </div>
                <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>{cat.desc}</p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 'var(--space-6)',
                }}
              >
                {products.map((product) => (
                  <a
                    key={product.asin}
                    href={`https://www.amazon.com/dp/${product.asin}?tag=spankyspinola-20`}
                    target="_blank"
                    rel="nofollow sponsored noopener noreferrer"
                    style={{
                      background: 'var(--color-white)',
                      borderRadius: 'var(--radius-lg)',
                      padding: 'var(--space-6)',
                      boxShadow: 'var(--shadow-sm)',
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 'var(--space-3)',
                      transition: 'box-shadow var(--transition-normal)',
                      border: '1px solid var(--color-border)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
                  >
                    <div style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-lg)',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      lineHeight: 1.3,
                    }}>
                      {product.name}
                    </div>
                    {product.description && (
                      <p style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--color-muted)',
                        lineHeight: 'var(--leading-relaxed)',
                        flex: 1,
                      }}>
                        {product.description}
                      </p>
                    )}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'var(--space-2)',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-accent)',
                        fontWeight: 500,
                      }}>
                        View on Amazon &rarr;
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: 'var(--text-xs)',
                        color: 'var(--color-muted)',
                      }}>
                        (paid link)
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
export default RecommendedPage;

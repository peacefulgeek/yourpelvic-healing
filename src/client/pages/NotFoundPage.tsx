import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8)',
        background: 'var(--color-bg)',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '6rem',
          fontWeight: 700,
          color: 'var(--color-accent-light)',
          lineHeight: 1,
          marginBottom: 'var(--space-4)',
        }}>
          404
        </div>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-3xl)',
          marginBottom: 'var(--space-4)',
        }}>
          Page Not Found
        </h1>
        <p style={{ color: 'var(--color-muted)', marginBottom: 'var(--space-8)' }}>
          This page doesn't exist. That happens. Let's get you somewhere useful.
        </p>
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">Go Home</Link>
          <Link to="/articles" className="btn btn-outline">Browse Articles</Link>
        </div>
      </div>
    </div>
  );
}
export default NotFoundPage;

interface AuthorBylineProps {
  lastUpdated?: string;
  variant?: 'mid-article' | 'bottom';
}

export function AuthorByline({ lastUpdated, variant = 'mid-article' }: AuthorBylineProps) {
  const dateStr = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const dateIso = lastUpdated
    ? new Date(lastUpdated).toISOString().substring(0, 10)
    : new Date().toISOString().substring(0, 10);

  return (
    <aside
      className="author-byline"
      data-eeat="author"
      style={variant === 'bottom' ? { marginTop: 'var(--space-16)' } : {}}
    >
      <div className="author-byline-avatar-placeholder" aria-hidden="true" style={{
        width: 64,
        height: 64,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #9C6E8A, #C4A0B5)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'var(--font-heading)',
        fontSize: '1.5rem',
        fontWeight: 700,
      }}>
        OL
      </div>
      <div className="author-byline-content">
        <strong>
          <a
            href="https://theoraclelover.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            The Oracle Lover
          </a>
        </strong>
        <p>Intuitive Educator &amp; Oracle Guide</p>
        <p>
          Reviewed and updated{' '}
          <time dateTime={dateIso}>{dateStr}</time>.
          I've spent years writing about pelvic health on this site, cutting through the clinical jargon to give you what actually works.
        </p>
        <a
          href="https://theoraclelover.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          More from The Oracle Lover &rarr;
        </a>
      </div>
    </aside>
  );
}
export default AuthorByline;

import { Link } from 'react-router-dom';

export function AboutPage() {
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
            About
          </div>
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
            fontWeight: 700,
            color: 'white',
            marginBottom: 'var(--space-4)',
          }}>
            The Oracle Lover
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-lg)' }}>
            Intuitive Educator &amp; Oracle Guide
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="article-body" style={{ paddingTop: 'var(--space-16)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-6)',
            marginBottom: 'var(--space-12)',
          }}
        >
          <div style={{
            width: 96,
            height: 96,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #9C6E8A, #C4A0B5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: 700,
            flexShrink: 0,
          }}>
            OL
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-1)' }}>
              The Oracle Lover
            </h2>
            <p style={{ color: 'var(--color-muted)', fontSize: 'var(--text-sm)' }}>
              Intuitive Educator &amp; Oracle Guide
            </p>
            <a
              href="https://theoraclelover.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)' }}
            >
              theoraclelover.com
            </a>
          </div>
        </div>

        <p>
          Look, here's the thing. Most of what you were never told about your pelvic floor isn't complicated. It's just nobody bothered to explain it in plain language.
        </p>

        <p>
          The Oracle Lover is a no-BS educator who also has a science degree. The combination matters. The goal on this site is to demystify pelvic floor health — not with euphemisms, not with clinical jargon, and not with shame.
        </p>

        <p>
          This is a muscle group. It has dysfunction like any other. Here's what to do about it.
        </p>

        <h2>What This Site Is</h2>

        <p>
          The Pelvic Floor is an educational resource covering pelvic floor dysfunction, pelvic physical therapy, postpartum recovery, and related women's health topics. Every article is written to be specific, practical, and honest.
        </p>

        <p>
          The researchers whose work informs this site include Katy Bowman, Tracy Sher PT, Clare Bourne PT, Blandine Calais-Germain, Isa Herrera MSPT, and the clinical standards from APTA's Section on Women's Health. The spiritual 30% draws from Clarissa Pinkola Estés, Angeles Arrien, and Carl Jung — because the body and the psyche are not separate things.
        </p>

        <h2>What This Site Is Not</h2>

        <p>
          This is not medical advice. Content on thepelvicfloor.com is for educational purposes only. Pelvic floor conditions require professional assessment. Always consult a pelvic floor physical therapist or qualified healthcare provider.
        </p>

        <p>
          If you're looking for a pelvic PT, the APTA's <a href="https://www.pelvicrehab.com" target="_blank" rel="nofollow noopener noreferrer">Pelvic Rehab locator</a> is the best place to start.
        </p>

        <div style={{ marginTop: 'var(--space-12)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <Link to="/articles" className="btn btn-primary">Read the Articles</Link>
          <Link to="/assessment" className="btn btn-outline">Take the Assessment</Link>
          <a
            href="https://theoraclelover.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Visit The Oracle Lover
          </a>
        </div>
      </div>
    </>
  );
}
export default AboutPage;

import { Link } from 'react-router-dom';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand-name">The Pelvic Floor</div>
            <p className="footer-brand-desc">
              The complete, un-embarrassing guide to pelvic floor health. Dysfunction, rehab, pain, postpartum, menopause — what they should have taught you.
            </p>
            <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', marginTop: 'var(--space-2)' }}>
              As an Amazon Associate I earn from qualifying purchases.
            </p>
          </div>

          {/* Explore */}
          <div>
            <div className="footer-heading">Explore</div>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/articles">All Articles</Link></li>
              <li><Link to="/assessments">Pelvic Floor Assessments</Link></li>
              <li><Link to="/recommended">Recommended Tools</Link></li>
            </ul>
          </div>

          {/* Topics */}
          <div>
            <div className="footer-heading">Topics</div>
            <ul className="footer-links">
              <li><Link to="/articles?category=dysfunction">Dysfunction</Link></li>
              <li><Link to="/articles?category=postpartum">Postpartum</Link></li>
              <li><Link to="/articles?category=pelvic-pt">Pelvic PT</Link></li>
              <li><Link to="/articles?category=pain">Pelvic Pain</Link></li>
              <li><Link to="/articles?category=exercises">Exercises</Link></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <div className="footer-heading">Connect</div>
            <ul className="footer-links">
              <li><Link to="/about">About</Link></li>
              <li>
                <a href="https://theoraclelover.com" target="_blank" rel="noopener noreferrer">
                  The Oracle Lover
                </a>
              </li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
            <div style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)' }}>
              Pelvic Floor Health
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-disclaimer">
            <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Disclaimer:</strong> Content on thepelvicfloor.com is for educational purposes only. Pelvic floor conditions require professional assessment. Always consult a pelvic floor physical therapist or qualified healthcare provider.
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>
            &copy; {year} The Pelvic Floor
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isArticle = location.pathname.startsWith('/articles/');
  const isAssessment = location.pathname.startsWith('/assessments/');
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const onHero = (isHome || isArticle || isAssessment) && !scrolled;

  return (
    <nav
      className={`nav ${scrolled ? 'scrolled' : ''} ${onHero ? 'on-hero' : ''}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <Link to="/" className="nav-logo" aria-label="The Pelvic Floor — Home">
        The Pelvic Floor
      </Link>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`} role="list">
        <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
        <li><Link to="/articles" onClick={() => setMenuOpen(false)}>Articles</Link></li>
        <li><Link to="/assessments" onClick={() => setMenuOpen(false)}>Assessments</Link></li>
        <li><Link to="/recommended" onClick={() => setMenuOpen(false)}>Recommended</Link></li>
        <li><Link to="/about" onClick={() => setMenuOpen(false)}>About</Link></li>
      </ul>

      <button
        className="nav-hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
      >
        {menuOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>
    </nav>
  );
}

export default Navigation;

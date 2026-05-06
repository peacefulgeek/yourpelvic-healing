import { useState, useMemo } from 'react';

import { supplements, SUPPLEMENT_CATEGORIES, amazonLink, type Supplement } from '../../data/supplements';

const EVIDENCE_LABELS: Record<string, { label: string; color: string }> = {
  strong: { label: 'Strong Evidence', color: '#2d6a4f' },
  moderate: { label: 'Moderate Evidence', color: '#52796f' },
  emerging: { label: 'Emerging Research', color: '#84a98c' },
  traditional: { label: 'Traditional Use', color: '#b08968' },
};

function SupplementCard({ item }: { item: Supplement }) {
  const ev = EVIDENCE_LABELS[item.evidenceLevel];
  const imgSrc = `https://pelvic-healing.b-cdn.net/${item.imageKey}`;
  const fallback = `https://pelvic-healing.b-cdn.net/images/supplement-placeholder.webp`;

  return (
    <article className="supp-card">
      <div className="supp-card__img-wrap">
        <img
          src={imgSrc}
          alt={item.name}
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = fallback; }}
          className="supp-card__img"
        />
        <span className="supp-card__category-badge">{item.category}</span>
      </div>
      <div className="supp-card__body">
        <h3 className="supp-card__name">{item.name}</h3>
        <p className="supp-card__benefit">{item.primaryBenefit}</p>
        <p className="supp-card__desc">{item.description}</p>
        <div className="supp-card__footer">
          <span className="supp-card__evidence" style={{ color: ev.color }}>
            ● {ev.label}
          </span>
          <a
            href={amazonLink(item.asin)}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="supp-card__cta"
            aria-label={`View ${item.name} on Amazon`}
          >
            View on Amazon →
          </a>
        </div>
        <div className="supp-card__tags">
          {item.tags.slice(0, 4).map(tag => (
            <span key={tag} className="supp-card__tag">{tag.replace(/-/g, ' ')}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function SupplementsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeEvidence, setActiveEvidence] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return supplements.filter(s => {
      const matchCat = activeCategory === 'All' || s.category === activeCategory;
      const matchEv = activeEvidence === 'All' || s.evidenceLevel === activeEvidence;
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) ||
        s.primaryBenefit.toLowerCase().includes(q) ||
        s.tags.some(t => t.includes(q)) ||
        s.description.toLowerCase().includes(q);
      return matchCat && matchEv && matchSearch;
    });
  }, [activeCategory, activeEvidence, search]);

  const totalCount = supplements.length;

  return (
    <>
      <Helmet>
        <title>Supplements, Herbs & TCM for Pelvic Floor Health | Your Pelvic Healing</title>
        <meta name="description" content={`Explore ${totalCount}+ evidence-informed supplements, herbs, and TCM remedies for pelvic floor health, bladder support, hormonal balance, and pelvic pain relief.`} />
        <link rel="canonical" href="https://yourpelvichealing.com/supplements" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Supplements, Herbs & TCM for Pelvic Floor Health",
          "url": "https://yourpelvichealing.com/supplements",
          "description": `${totalCount}+ evidence-informed supplements, herbs, and TCM remedies for pelvic floor health.`,
          "publisher": {
            "@type": "Organization",
            "name": "Your Pelvic Healing",
            "url": "https://yourpelvichealing.com"
          }
        })}</script>
      </Helmet>

      {/* Hero */}
      <section className="supp-hero">
        <div className="supp-hero__inner">
          <p className="supp-hero__eyebrow">Evidence-Informed Guide</p>
          <h1 className="supp-hero__title">Supplements, Herbs & TCM<br />for Pelvic Floor Health</h1>
          <p className="supp-hero__subtitle">
            {totalCount}+ carefully researched remedies — from clinical-grade supplements to ancient TCM formulas —
            each with a 3-sentence summary, evidence rating, and direct Amazon link.
            This is not a shopping list. It is a reference guide for informed decisions made with your healthcare provider.
          </p>
          <p className="supp-hero__disclaimer">
            ⚕ This page contains affiliate links (Amazon tag: spankyspinola-20). We earn a small commission at no extra cost to you.
            Nothing here is medical advice. Always consult your healthcare provider before starting any supplement.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="supp-filters">
        <div className="supp-filters__inner">
          <div className="supp-filters__search-wrap">
            <input
              type="search"
              placeholder="Search supplements, herbs, conditions…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="supp-filters__search"
              aria-label="Search supplements"
            />
          </div>
          <div className="supp-filters__row">
            <div className="supp-filters__group">
              <span className="supp-filters__label">Category</span>
              <div className="supp-filters__pills">
                {['All', ...SUPPLEMENT_CATEGORIES].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`supp-filter-pill${activeCategory === cat ? ' supp-filter-pill--active' : ''}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="supp-filters__group">
              <span className="supp-filters__label">Evidence Level</span>
              <div className="supp-filters__pills">
                {['All', 'strong', 'moderate', 'emerging', 'traditional'].map(ev => (
                  <button
                    key={ev}
                    onClick={() => setActiveEvidence(ev)}
                    className={`supp-filter-pill${activeEvidence === ev ? ' supp-filter-pill--active' : ''}`}
                  >
                    {ev === 'All' ? 'All' : EVIDENCE_LABELS[ev].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="supp-filters__count">
            Showing <strong>{filtered.length}</strong> of {totalCount} remedies
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="supp-grid-section">
        <div className="supp-grid">
          {filtered.length === 0 ? (
            <div className="supp-empty">
              <p>No results found. Try a different search or filter.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('All'); setActiveEvidence('All'); }}>
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map(item => <SupplementCard key={item.id} item={item} />)
          )}
        </div>
      </section>

      {/* Bottom disclaimer */}
      <section className="supp-bottom-disclaimer">
        <div className="supp-bottom-disclaimer__inner">
          <h2>A Note on Using This Guide</h2>
          <p>
            Every supplement listed here has been selected based on relevance to pelvic floor health, bladder function,
            hormonal balance, or pelvic pain — not on commission rates. Evidence ratings reflect the current state of
            clinical research: "Strong Evidence" means multiple well-designed clinical trials; "Traditional Use" means
            centuries of documented use without modern clinical trials.
          </p>
          <p>
            Supplements are not a substitute for pelvic floor physical therapy, medical evaluation, or appropriate
            pharmaceutical treatment. They work best as part of a comprehensive approach. Many of the most effective
            interventions for pelvic floor dysfunction — like pelvic floor PT, bladder retraining, and lifestyle
            modifications — cost nothing and have the strongest evidence of all.
          </p>
          <p>
            As an Amazon Associate, Your Pelvic Healing earns from qualifying purchases. This does not affect our
            recommendations. We only list products we would recommend to a friend.
          </p>
        </div>
      </section>
    </>
  );
}

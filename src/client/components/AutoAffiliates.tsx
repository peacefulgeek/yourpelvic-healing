interface Product {
  asin: string;
  name: string;
  category: string;
  tags: string[];
}

interface AutoAffiliatesProps {
  products: Product[];
  bottomSectionName?: string;
}

export function AutoAffiliates({ products, bottomSectionName = 'Pelvic Health Library' }: AutoAffiliatesProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="auto-affiliates" aria-label={bottomSectionName}>
      <h3>{bottomSectionName}</h3>
      <ul>
        {products.map((p) => (
          <li key={p.asin}>
            <a
              href={`https://www.amazon.com/dp/${p.asin}?tag=spankyspinola-20`}
              target="_blank"
              rel="nofollow sponsored noopener noreferrer"
            >
              {p.name}
            </a>
            <span className="disclosure"> (paid link)</span>
          </li>
        ))}
      </ul>
      <p className="affiliate-disclosure">
        As an Amazon Associate, I earn from qualifying purchases.
      </p>
    </section>
  );
}
export default AutoAffiliates;

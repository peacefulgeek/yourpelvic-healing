interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  if (!headings || headings.length < 2) return null;

  const h2s = headings.filter(h => h.level === 2);
  if (h2s.length < 2) return null;

  return (
    <nav className="toc" aria-label="Table of contents">
      <div className="toc-title">In this article</div>
      <ol className="toc-list">
        {h2s.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`}>{h.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function extractHeadings(html: string): Heading[] {
  const headings: Heading[] = [];
  const regex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    headings.push({
      level: parseInt(match[1], 10),
      id: match[2],
      text: match[3].replace(/<[^>]+>/g, ''),
    });
  }
  return headings;
}
export default TableOfContents;

import { readFileSync } from 'fs';
const articles = JSON.parse(readFileSync('data/articles.json', 'utf8'));
const pub = articles.filter(a => a.status === 'published');
const gated = articles.filter(a => a.status === 'gated');
const queued = articles.filter(a => a.status === 'queued');

console.log(`Total: ${articles.length} | Published: ${pub.length} | Gated: ${gated.length} | Queued: ${queued.length}`);

if (pub.length > 0) {
  const first = pub[0];
  const body = first.body || first.content || '';
  const words = body.split(/\s+/).filter(w => w.length > 0).length;
  console.log('\nFirst published article:');
  console.log('  Title:', first.title);
  console.log('  Words:', words);
  console.log('  Has heroUrl:', !!(first.heroUrl || first.hero_url));
  console.log('  Has tldr:', !!first.tldr);
  console.log('  Has authorByline:', !!first.authorByline);
  console.log('  Has dateModified:', !!(first.dateModified || first.lastModifiedAt));
  console.log('  Keys:', Object.keys(first).join(', '));
  
  // Word count distribution
  const counts = pub.map(a => {
    const b = a.body || a.content || '';
    return b.split(/\s+/).filter(w => w.length > 0).length;
  });
  const avg = Math.round(counts.reduce((a,b)=>a+b,0)/counts.length);
  const min = Math.min(...counts);
  const max = Math.max(...counts);
  const under1800 = counts.filter(c=>c<1800).length;
  console.log(`\nWord count stats: avg=${avg}, min=${min}, max=${max}, under1800=${under1800}/${pub.length}`);
}

// Check pub dates
const byDate = {};
pub.forEach(a => {
  const d = (a.publishedAt || a.published_at || '').slice(0,10) || 'unknown';
  byDate[d] = (byDate[d]||0)+1;
});
console.log('\nPublished by date:');
Object.entries(byDate).sort().forEach(([d,c]) => console.log(`  ${d}: ${c}`));

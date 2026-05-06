import { readFileSync } from 'fs';
const a = JSON.parse(readFileSync('data/articles.json','utf8'));
const pub = a.filter(x => x.publishedAt);
const gated = a.filter(x => !x.publishedAt);
const avgWords = Math.round(a.reduce((s,x) => s+(x.wordCount||0),0)/a.length);
const min = Math.min(...a.map(x => x.wordCount||0));
const max = Math.max(...a.map(x => x.wordCount||0));
console.log(`Total: ${a.length} | Published: ${pub.length} | Gated: ${gated.length} | Avg words: ${avgWords} | Min: ${min} | Max: ${max}`);
// Show published dates distribution
const byDate = {};
pub.forEach(x => {
  const d = x.publishedAt ? x.publishedAt.split('T')[0] : 'none';
  byDate[d] = (byDate[d]||0)+1;
});
console.log('Published by date:', JSON.stringify(byDate, null, 2));

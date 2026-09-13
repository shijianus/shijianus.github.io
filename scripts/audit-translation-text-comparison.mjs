import fs from 'node:fs';

const files = {
  'zh-CN (Source)': 'src/content/posts/content-formats-and-markup-mastery.md',
  'en (English)': 'src/content/posts/content-formats-and-markup-mastery-en.md',
  'zh-Hant (Traditional)': 'src/content/posts/content-formats-and-markup-mastery-zh-Hant.md',
  'fr (French)': 'src/content/posts/content-formats-and-markup-mastery-fr.md',
  'de (German)': 'src/content/posts/content-formats-and-markup-mastery-de.md',
  'es (Spanish)': 'src/content/posts/content-formats-and-markup-mastery-es.md',
};

const contents = {};
for (const [k, p] of Object.entries(files)) {
  if (fs.existsSync(p)) {
    contents[k] = fs.readFileSync(p, 'utf8');
  } else {
    console.error(`Missing file: ${p}`);
  }
}

console.log('===============================================================');
console.log('               TRANSLATION ACTUAL TEXT AUDIT');
console.log('===============================================================\n');

// 1. Overall Stats
console.log('--- 1. Structural & Linguistic Statistics ---');
for (const [k, c] of Object.entries(contents)) {
  const lines = c.split('\n');
  const headings = lines.filter((l) => /^#{1,6}\s/.test(l));
  const codeFenceCount = (c.match(/```/g) || []).length;
  const tableRows = lines.filter((l) => l.trim().startsWith('|') && l.trim().endsWith('|')).length;
  const chineseChars = (c.match(/[\u4e00-\u9fa5]/g) || []).length;
  const latinWords = (c.match(/[a-zA-Z]{2,}/g) || []).length;

  console.log(`[${k}]`);
  console.log(`   Size: ${Buffer.byteLength(c, 'utf8')} bytes | Lines: ${lines.length}`);
  console.log(`   Headings: ${headings.length} | Code Fences: ${codeFenceCount} (${codeFenceCount % 2 === 0 ? 'paired' : 'UNPAIRED!'}) | Table Rows: ${tableRows}`);
  console.log(`   Chinese Chars: ${chineseChars} | Latin Words: ${latinWords}\n`);
}

// 2. Section Heading Alignment Comparison
console.log('--- 2. Section Headings Comparison (First 10) ---');
const headingsByLang = {};
for (const [k, c] of Object.entries(contents)) {
  headingsByLang[k] = c.split('\n').filter((l) => /^#{1,3}\s/.test(l)).map((l) => l.trim());
}

const maxH = Math.max(...Object.values(headingsByLang).map((h) => h.length));
console.log(`Total H1-H3 headings found across files:`);
for (const [k, h] of Object.entries(headingsByLang)) {
  console.log(`   ${k}: ${h.length} headings`);
}

console.log('\nSample Headings Side-by-Side:');
for (let i = 0; i < Math.min(8, maxH); i++) {
  console.log(`\n[Heading #${i + 1}]`);
  for (const [k, h] of Object.entries(headingsByLang)) {
    console.log(`   ${k.padEnd(24)}: ${h[i] || '<missing>'}`);
  }
}

// 3. Text Paragraph Semantic Comparison
console.log('\n--- 3. Paragraph Semantic Comparison (Introduction & Sample) ---');
function getFirstThreeParagraphs(c) {
  // strip frontmatter
  const body = c.replace(/^---[\s\S]*?---\s*/, '');
  const paras = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('#') && !p.startsWith('```') && !p.startsWith('> [!') && !p.startsWith('|'));
  return paras.slice(0, 3);
}

for (const [k, c] of Object.entries(contents)) {
  const pList = getFirstThreeParagraphs(c);
  console.log(`\n[${k}] Paragraph #1:`);
  console.log(`   "${pList[0] ? pList[0].slice(0, 180) : ''}..."`);
}

// 4. Check for Untranslated Residuals
console.log('\n--- 4. Residual Chinese Inspection in Western Translations ---');
for (const [k, c] of Object.entries(contents)) {
  if (k.includes('zh-CN') || k.includes('zh-Hant')) continue;
  // find Chinese character occurrences in the body (excluding frontmatter comments if any)
  const body = c.replace(/^---[\s\S]*?---\s*/, '');
  const linesWithChinese = [];
  body.split('\n').forEach((line, idx) => {
    // Ignore lines that are code blocks with Chinese comments, or deliberate Chinese test strings
    if (line.includes('```')) return;
    const match = line.match(/[\u4e00-\u9fa5]{2,}/g);
    if (match) {
      linesWithChinese.push({ lineNum: idx + 1, text: line.trim(), matches: match });
    }
  });

  console.log(`[${k}] Body lines with Chinese characters: ${linesWithChinese.length}`);
  if (linesWithChinese.length > 0) {
    console.log(`   Sample lines (${Math.min(3, linesWithChinese.length)}):`);
    linesWithChinese.slice(0, 3).forEach((l) => {
      console.log(`     L${l.lineNum}: "${l.text.slice(0, 80)}" -> [${l.matches.join(', ')}]`);
    });
  }
}

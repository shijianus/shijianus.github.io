import fs from 'fs';
import path from 'path';

const POSTS_DIR = path.resolve(process.cwd(), 'src/content/posts');
const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

console.log(`[Audit] Scanning ${files.length} articles in ${POSTS_DIR}...\n`);

const results = [];

for (const file of files) {
  const filePath = path.join(POSTS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = [];

  // 1. Leaked context comments and prompt markers
  if (/<!--\s*context from previous chunk\s*-->/i.test(content)) {
    issues.push('Leaked "<!-- context from previous chunk -->"');
  }
  if (/<!--\s*end context\s*-->/i.test(content)) {
    issues.push('Leaked "<!-- end context -->"');
  }
  if (/\[REFERENCE (?:ONLY|CONTEXT)\]/i.test(content)) {
    issues.push('Leaked "[REFERENCE CONTEXT]"');
  }
  if (/\[TEXT TO TRANSLATE\]/i.test(content)) {
    issues.push('Leaked "[TEXT TO TRANSLATE]"');
  }

  // 2. Corrupted LaTeX fragments
  // Matches "artial t}" NOT preceded by "\p"
  if (/(?<!\\p)artial\s*t\s*\}/.test(content)) {
    issues.push('Corrupted LaTeX formula (artial t} without \\p)');
  }
  if (/\bundefined\b/.test(content)) {
    // Check if undefined is an accidental literal in markdown body
    const undefinedMatches = content.match(/(?<!["'`a-zA-Z0-9_-])undefined(?![a-zA-Z0-9_-])/g);
    if (undefinedMatches) {
      issues.push(`Suspicious literal "undefined" (${undefinedMatches.length} occurrences)`);
    }
  }

  // 3. Fenced code block parity
  const codeFences = (content.match(/^```/gm) || []).length;
  if (codeFences % 2 !== 0) {
    issues.push(`Unbalanced code fences (${codeFences} backtick lines)`);
  }

  // 4. KaTeX $$ block parity
  const lines = content.split('\n');
  let inMath = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '$$') {
      inMath = !inMath;
    }
  }
  if (inMath) {
    issues.push('Unbalanced KaTeX multi-line block ($$ not closed)');
  }

  // 5. HTML container balance: div, details
  let divDepth = 0;
  let detailsDepth = 0;
  let inCode = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCode = !inCode;
      continue;
    }
    if (inCode) continue;

    // Strip inline code spans
    const cleanLine = line.replace(/`[^`]*`/g, '');

    // Track div
    const openDivs = (cleanLine.match(/<div(\s+[^>]*)?>/gi) || []).length;
    const closeDivs = (cleanLine.match(/<\/div>/gi) || []).length;
    divDepth += openDivs - closeDivs;

    // Track details
    const openDetails = (cleanLine.match(/<details(\s+[^>]*)?>/gi) || []).length;
    const closeDetails = (cleanLine.match(/<\/details>/gi) || []).length;
    detailsDepth += openDetails - closeDetails;
  }

  if (divDepth !== 0) {
    issues.push(`Unbalanced <div> tags (net depth: ${divDepth})`);
  }
  if (detailsDepth !== 0) {
    issues.push(`Unbalanced <details> tags (net depth: ${detailsDepth})`);
  }

  // 6. User-facing HTML attribute translation check (for non-zh articles)
  const isNonZh = file.includes('-en') || file.includes('-fr') || file.includes('-es') || file.includes('-de');
  if (isNonZh) {
    const dataTitleMatches = content.match(/data-title="[^"]*[\u4e00-\u9fa5]+[^"]*"/g);
    if (dataTitleMatches) {
      issues.push(`Untranslated Chinese in data-title: ${dataTitleMatches[0]}`);
    }
  }

  // 7. Check if article-chat container closed prematurely
  const chatTagMatches = [...content.matchAll(/<div class="article-chat"[^>]*>/g)];
  for (const chatMatch of chatTagMatches) {
    const chatStartIdx = chatMatch.index;
    const rest = content.slice(chatStartIdx);
    const restLines = rest.split('\n');
    let depth = 0;
    let closedAtLine = -1;
    for (let r = 0; r < restLines.length; r++) {
      const rl = restLines[r].replace(/`[^`]*`/g, '');
      depth += (rl.match(/<div(\s+[^>]*)?>/gi) || []).length;
      depth -= (rl.match(/<\/div>/gi) || []).length;
      if (depth === 0 && r > 0) {
        closedAtLine = r;
        break;
      }
    }
    if (closedAtLine > 0) {
      const afterChat = restLines.slice(closedAtLine + 1, closedAtLine + 60).join('\n');
      if (afterChat.includes('class="chat-message')) {
        issues.push('Broken article-chat: chat messages orphaned outside .article-chat container');
      }
    }
  }

  // 8. Check if article-accordion-group closed prematurely
  if (content.includes('class="article-accordion-group"')) {
    const accMatches = content.matchAll(/<div class="article-accordion-group"[^>]*>/g);
    for (const match of accMatches) {
      const accIdx = match.index;
      const rest = content.slice(accIdx);
      const restLines = rest.split('\n');
      let depth = 0;
      let closed = false;
      for (let r = 0; r < restLines.length; r++) {
        const rl = restLines[r].replace(/`[^`]*`/g, '');
        depth += (rl.match(/<div(\s+[^>]*)?>/gi) || []).length;
        depth -= (rl.match(/<\/div>/gi) || []).length;
        if (depth === 0 && r > 0) {
          closed = true;
          // Check if article-tabs is swallowed inside
          const inside = restLines.slice(0, r).join('\n');
          if (inside.includes('class="article-tabs"')) {
            issues.push('Swallowed article-tabs: article-accordion-group unclosed before tabs');
          }
          break;
        }
      }
      if (!closed) {
        issues.push('Unclosed article-accordion-group: never closed, swalling rest of article');
      }
    }
  }

  if (issues.length > 0) {
    results.push({ file, issues });
  }
}

if (results.length === 0) {
  console.log('✅ ALL articles passed structural and syntax quality audit! Zero defects detected.\n');
} else {
  console.log(`⚠️ Detected defects in ${results.length} files:\n`);
  for (const r of results) {
    console.log(`📄 ${r.file}:`);
    for (const iss of r.issues) {
      console.log(`   - ❌ ${iss}`);
    }
  }
}

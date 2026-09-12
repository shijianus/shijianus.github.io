import fs from 'node:fs';
import path from 'node:path';

const postsDir = path.resolve('src/content/posts');
const dataDir = path.resolve('src/data');
const outputFile = path.join(dataDir, 'ai-summaries.json');

const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODELS = [
  'openai/gpt-oss-120b',
  'groq/compound-mini',
  'llama-3.3-70b-versatile',
  'openai/gpt-oss-20b',
];

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function cleanAiOutput(text) {
  if (!text) return '';
  return text
    .replace(/<think>[\s\S]*?(<\/think>|$)/gi, '')
    .replace(/^```[a-z]*\s*/i, '')
    .replace(/\s*```$/i, '')
    .replace(/^["'“](.*)["'”]$/s, '$1')
    .trim();
}

function extractFrontmatterAndContent(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: fileContent, lang: 'zh-CN' };
  }
  const fmRaw = match[1];
  const body = match[2];
  const titleMatch = fmRaw.match(/title:\s*["']?(.*?)["']?\s*\n/);
  const descMatch = fmRaw.match(/description:\s*["']?(.*?)["']?\s*\n/);
  const langMatch = fmRaw.match(/lang:\s*["']?(.*?)["']?\s*\n/);
  const title = titleMatch ? titleMatch[1].trim() : '';
  const description = descMatch ? descMatch[1].trim() : '';
  const lang = langMatch ? langMatch[1].trim() : '';
  return {
    title,
    description,
    lang,
    content: body
      .replace(/```[\s\S]*?```/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 6000),
  };
}

async function generateSummary(title, description, bodyContent, lang = 'zh-CN') {
  const isEn = lang.startsWith('en');
  const systemPrompt = isEn
    ? 'You are a senior systems architect and technical curator powered by Chronral. Deliver an authoritative, high-density architectural core summary for this technical article in natural, professional English.\nRequirements:\n1. Length strictly 120-180 words of cohesive plain text;\n2. Accurately extract core architectural arguments, engineering trade-offs, and reader value;\n3. Objective, concise, and logical tone. Strictly no polite greetings, no cliché openers, and no Markdown headings or lists;\n4. Output a single cohesive paragraph of plain text.'
    : '你是由 Chronral 驱动的资深技术架构师与智能摘要专家。请为这篇博文生成一段高质量、高信息密度的架构核心摘要。要求：\n1. 字数严格控制在 220 至 320 字纯文本之间；\n2. 准确提炼核心架构论点、关键技术方案选型取舍与读者实践价值；\n3. 语言客观凝练、富有思考质感，严禁寒暄与套话，严禁 Markdown 列表与加粗；\n4. 输出单一连贯段落的纯文本。';

  const userPrompt = isEn
    ? `Title: ${title}\nAuthor Note: ${description || 'None'}\nArticle Content:\n${bodyContent}`
    : `标题：${title}\n作者自述：${description || '无'}\n正文内容：\n${bodyContent}`;

  for (const model of GROQ_MODELS) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          temperature: 0.75,
          max_tokens: isEn ? 450 : 600,
        }),
      });

      if (!res.ok) {
        continue;
      }

      const data = await res.json();
      const rawText = data.choices?.[0]?.message?.content?.trim();
      const text = cleanAiOutput(rawText);
      if (text && text.length >= 30) {
        return { summary: text, model: 'llama-3.3-70b-versatile', provider: 'Chronral LLMGPT' };
      }
    } catch {
      continue;
    }
  }

  return {
    summary:
      description ||
      (isEn
        ? `${title}: This article explores core architectural concepts and practical engineering takeaways, helping technical readers systematically master the design patterns and implementations.`
        : `《${title}》：本文深入探讨了相关核心技术与实践要点，帮助读者系统掌握关键概念与应用方法。`),
    model: 'primer-fallback',
    provider: 'Chronral Primer',
  };
}

async function main() {
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
  console.log(`[Chronral Generator] Processing ${files.length} posts...`);

  const results = {};
  for (const file of files) {
    const slug = file.replace(/\.(md|mdx)$/, '');
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf8');
    const { title, description, content, lang: fmLang } = extractFrontmatterAndContent(raw);
    const lang = fmLang || (file.endsWith('-en.md') ? 'en' : 'zh-CN');

    console.log(`[Generating] ${slug} ("${title}") [lang: ${lang}]...`);
    const res = await generateSummary(title, description, content, lang);
    results[slug] = {
      title,
      summary: res.summary,
      model: res.model,
      provider: res.provider,
      lang,
      generatedAt: new Date().toISOString(),
    };
    console.log(`[Done] ${slug} -> ${res.summary.slice(0, 50)}...`);

    // Small delay between calls
    await new Promise((r) => setTimeout(r, 400));
  }

  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n[Chronral Generator] Successfully saved ${Object.keys(results).length} clean summaries to ${outputFile}`);
}

main().catch((err) => {
  console.error('[Chronral Generator Error]', err);
  process.exit(1);
});

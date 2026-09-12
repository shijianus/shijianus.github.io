import fs from 'node:fs';
import path from 'node:path';

export interface ArticleI18nConfig {
  enabled: boolean;
  targetLocales: string[];
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  groqApiKey?: string;
  groqModel?: string;
  targetPosts?: string[];
}

export interface TranslateArticleOptions {
  sourceMarkdown: string;
  sourceLocale?: string;
  targetLocale: string;
  i18nKey: string;
  slug?: string;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  groqApiKey?: string;
  groqModel?: string;
}

export interface TranslateArticleResult {
  ok: boolean;
  translatedMarkdown: string;
  targetLocale: string;
  i18nKey: string;
  provider: string;
  model: string;
  error?: string;
}

export const LOCALE_NAMES: Record<string, { native: string; english: string }> = {
  'zh-CN': { native: '简体中文', english: 'Simplified Chinese' },
  'zh-Hant': { native: '繁體中文', english: 'Traditional Chinese' },
  en: { native: 'English', english: 'English' },
  fr: { native: 'Français', english: 'French' },
  es: { native: 'Español', english: 'Spanish' },
  de: { native: 'Deutsch', english: 'German' },
};

const PROMPT_TEMPLATE_PATH = path.resolve(process.cwd(), 'src/config/article-i18n-prompt.md');

/**
 * Reads and compiles the article localization system prompt.
 */
export function compileSystemPrompt(sourceLocale = 'zh-CN', targetLocale = 'en'): string {
  let template = '';
  try {
    if (fs.existsSync(PROMPT_TEMPLATE_PATH)) {
      template = fs.readFileSync(PROMPT_TEMPLATE_PATH, 'utf8');
    }
  } catch {}

  if (!template) {
    template = `You are an elite technical translator. Translate the markdown article faithfully into \${TARGET_LOCALE_NAME} (\${TARGET_LOCALE}). Output only valid Markdown starting with --- frontmatter.`;
  }

  const sourceMeta = LOCALE_NAMES[sourceLocale] || { native: sourceLocale, english: sourceLocale };
  const targetMeta = LOCALE_NAMES[targetLocale] || { native: targetLocale, english: targetLocale };

  return template
    .replace(/\$\{TARGET_LOCALE\}/g, targetLocale)
    .replace(/\$\{TARGET_LOCALE_NAME\}/g, `${targetMeta.english} / ${targetMeta.native}`)
    .replace(/\$\{SOURCE_LOCALE\}/g, sourceLocale)
    .replace(/\$\{SOURCE_LOCALE_NAME\}/g, `${sourceMeta.english} / ${sourceMeta.native}`);
}

/**
 * Compiles a compact body-only system prompt for chunk translation.
 * Does NOT include frontmatter instructions.
 */
function compileChunkSystemPrompt(targetLocale: string): string {
  const targetMeta = LOCALE_NAMES[targetLocale] || { native: targetLocale, english: targetLocale };
  const localeName = `${targetMeta.english} / ${targetMeta.native}`;
  return [
    `Translate ONLY the following Markdown body text into ${localeName}.`,
    `Do NOT add frontmatter. Do NOT add any preamble or postscript.`,
    `Output ONLY the translated Markdown text.`,
    `Maintain all code blocks, URLs, image references, and special syntax unchanged.`,
    `Preserve all blank lines and heading levels exactly as in the source.`,
  ].join(' ');
}

/**
 * Strips reasoning tokens, outer markdown codeblocks, and ensures frontmatter sanity.
 * NOTE: isAiGenerated is intentionally NOT added. Only i18nKey, lang, aiTranslatedFrom are set.
 */
export function cleanAiArticleOutput(raw: string, i18nKey: string, targetLocale: string, sourceLocale = 'zh-CN'): string {
  if (!raw) return '';

  let cleaned = raw
    .replace(/<think>[\s\S]*?(<\/think>|$)/gi, '')
    .trim();

  // Strip wrapping ```markdown ... ``` or ``` ... ```
  if (cleaned.startsWith('```markdown')) {
    cleaned = cleaned.replace(/^```markdown\r?\n/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```[a-z]*\r?\n/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/\r?\n```$/, '');
  }
  cleaned = cleaned.trim();

  // Validate frontmatter presence
  if (!cleaned.startsWith('---')) {
    const firstFm = cleaned.indexOf('---');
    if (firstFm !== -1) {
      cleaned = cleaned.slice(firstFm).trim();
    }
  }

  // Ensure i18nKey, lang, and aiTranslatedFrom are accurately set in frontmatter.
  // isAiGenerated is intentionally NOT added here.
  const fmMatch = cleaned.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    let fmLines = fmMatch[1].split(/\r?\n/);

    // Remove old lang, i18nKey, isAiGenerated, aiTranslatedFrom lines if duplicated
    fmLines = fmLines.filter(
      (line) =>
        !/^i18nKey\s*:/i.test(line) &&
        !/^lang\s*:/i.test(line) &&
        !/^isAiGenerated\s*:/i.test(line) &&
        !/^aiTranslatedFrom\s*:/i.test(line),
    );

    // Strip externalEncrypt / externalEncrypts blocks entirely from translations.
    // These define encrypted slug routes on the SOURCE article only.
    // Keeping them on translated copies produces duplicate encrypted slugs
    // which causes build errors (validateCustomToken gets "" + "alt" = "alt" -> 3 chars, fails).
    const cleanedFmLines: string[] = [];
    let inEncryptBlock = false;
    for (const line of fmLines) {
      if (/^externalEncrypt(s)?\s*:/i.test(line)) {
        inEncryptBlock = true;
        continue;
      }
      if (inEncryptBlock) {
        // Block ends when we hit a top-level key (no leading spaces) that isn't a YAML list item
        if (/^[a-zA-Z]/.test(line) && !line.startsWith('-') && !line.startsWith('#')) {
          inEncryptBlock = false;
        } else {
          continue; // still inside the block, skip
        }
      }
      cleanedFmLines.push(line);
    }

    // Append standard i18n fields — NO isAiGenerated
    cleanedFmLines.push(`i18nKey: "${i18nKey}"`);
    cleanedFmLines.push(`lang: "${targetLocale}"`);
    cleanedFmLines.push(`aiTranslatedFrom: "${sourceLocale}"`);

    cleaned = `---\n${cleanedFmLines.join('\n')}\n---` + cleaned.slice(fmMatch[0].length);
  }

  return cleaned.trim();
}

function loadLocalEnvFiles() {
  for (const envFile of ['.env', '.dev.vars']) {
    const envPath = path.resolve(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const idx = trimmed.indexOf('=');
          if (idx !== -1) {
            const key = trimmed.slice(0, idx).trim();
            let val = trimmed.slice(idx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
              val = val.slice(1, -1);
            }
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      } catch {}
    }
  }
}

/**
 * Resolves configuration from options and environment variables.
 * Default target locales: en,zh-Hant,fr,es,de (all 5 non-source locales).
 */
export function resolveArticleI18nConfig(): ArticleI18nConfig {
  loadLocalEnvFiles();
  const enabled = process.env.ENABLE_ARTICLE_AI_I18N === 'true';

  const rawLocales = process.env.ARTICLE_AI_I18N_LOCALES || 'en,zh-Hant,fr,es,de';
  const targetLocales = rawLocales
    .split(',')
    .map((l) => l.trim())
    .filter(Boolean);

  const targetPosts = process.env.ARTICLE_AI_I18N_POSTS
    ? process.env.ARTICLE_AI_I18N_POSTS.split(',').map((s) => s.trim()).filter(Boolean)
    : undefined;

  // Custom dedicated article i18n API credentials
  const customKey = process.env.ARTICLE_AI_I18N_API_KEY?.trim();
  const customBase = process.env.ARTICLE_AI_I18N_BASE_URL?.trim();
  const customModel = process.env.ARTICLE_AI_I18N_MODEL?.trim();

  // ChronoralAI fallback credentials
  const instanceKey = process.env.INSTANCE_AI_API_KEY?.trim();
  const instanceBase = process.env.INSTANCE_AI_BASE_URL?.trim() || 'https://ai.121628.xyz/v1';
  const instanceModel = process.env.INSTANCE_AI_MODEL?.trim() || 'kimi-k3-free';

  const groqApiKey = process.env.GROQ_API_KEY?.trim();
  const groqModel = process.env.GROQ_MODEL?.trim() || 'qwen/qwen3.6-27b';

  return {
    enabled,
    targetLocales: targetLocales.length > 0 ? targetLocales : ['en', 'zh-Hant', 'fr', 'es', 'de'],
    apiKey: customKey || instanceKey,
    baseUrl: customBase || instanceBase,
    model: customModel || instanceModel,
    groqApiKey,
    groqModel,
    targetPosts,
  };
}

// ---------------------------------------------------------------------------
// Low-level API call helper (shared by full and chunked translation paths)
// ---------------------------------------------------------------------------

interface CallModelOptions {
  systemPrompt: string;
  userMessage: string;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
  groqApiKey?: string;
  groqModel?: string;
  timeoutMs?: number;
}

interface CallModelResult {
  ok: boolean;
  text: string;
  provider: string;
  model: string;
  error?: string;
}

async function callModel(opts: CallModelOptions): Promise<CallModelResult> {
  const { systemPrompt, userMessage, timeoutMs = 90000 } = opts;

  const customApiKey = opts.apiKey || process.env.ARTICLE_AI_I18N_API_KEY || process.env.INSTANCE_AI_API_KEY || '';
  const customBaseUrl = (
    opts.baseUrl ||
    process.env.ARTICLE_AI_I18N_BASE_URL ||
    process.env.INSTANCE_AI_BASE_URL ||
    'https://ai.121628.xyz/v1'
  ).replace(/\/+$/, '');
  const customModel = opts.model || process.env.ARTICLE_AI_I18N_MODEL || process.env.INSTANCE_AI_MODEL || 'kimi-k3-free';

  const groqKey = opts.groqApiKey || process.env.GROQ_API_KEY || '';
  const groqModel = opts.groqModel || process.env.GROQ_MODEL || 'qwen/qwen3.6-27b';

  // 1. Attempt Primary (Custom or Instance AI)
  if (customApiKey) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      const endpoint = `${customBaseUrl}/chat/completions`;
      const response = await fetch(endpoint, {
        method: 'POST',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${customApiKey}`,
          'User-Agent': 'Mozilla/5.0 (compatible; ChronralAI/2.0; +https://shijian.us)',
        },
        body: JSON.stringify({
          model: customModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
          ],
          temperature: 0.25,
          max_tokens: 8192,
        }),
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const json = await response.json();
        const text = json?.choices?.[0]?.message?.content || '';
        if (text) {
          return { ok: true, text, provider: 'Chronral-Instance', model: customModel };
        }
      }
    } catch (err: any) {
      console.warn(`[Article-i18n] Primary endpoint attempt failed (${err.message}). Trying Groq fallback...`);
    }
  }

  // 2. Fallback to Groq (High-speed & Reliable)
  if (groqKey) {
    const candidateGroqModels = Array.from(
      new Set(
        ['openai/gpt-oss-120b', 'qwen/qwen3.6-27b', 'llama-3.1-8b-instant', opts.groqModel, process.env.GROQ_MODEL].filter(
          (m) => m && m !== 'llama-3.3-70b-versatile', // remove defunct model
        ),
      ),
    ) as string[];

    for (const gModel of candidateGroqModels) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000);
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: gModel,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userMessage },
            ],
            temperature: 0.2,
            max_tokens: 8192,
          }),
        });
        clearTimeout(timeoutId);
        if (response.ok) {
          const json = await response.json();
          const text = json?.choices?.[0]?.message?.content || '';
          if (text) {
            return { ok: true, text, provider: 'Chronral-Groq', model: gModel };
          }
        } else {
          const errText = await response.text().catch(() => '');
          console.warn(`[Article-i18n] Groq (${gModel}) status ${response.status}: ${errText.slice(0, 120)}`);
        }
      } catch (err: any) {
        console.warn(`[Article-i18n] Groq (${gModel}) fallback attempt failed: ${err.message}`);
      }
    }
  }

  return {
    ok: false,
    text: '',
    provider: 'none',
    model: 'error',
    error: 'All configured AI endpoints failed or timed out.',
  };
}

// ---------------------------------------------------------------------------
// Chunk splitting logic
// ---------------------------------------------------------------------------

/**
 * Splits an article body into semantic chunks at paragraph/heading boundaries.
 * Tracks code fence state to never split inside a fenced block.
 * Each chunk gets ~overlap chars of the previous chunk's end as context header.
 */
export function splitIntoChunks(body: string, maxChars = 6000, overlap = 200): string[] {
  if (body.length <= maxChars) return [body];

  const chunks: string[] = [];
  const lines = body.split('\n');

  let currentChunk = '';
  let insideCodeFence = false;

  const flushChunk = () => {
    const trimmed = currentChunk.trimEnd();
    if (trimmed) chunks.push(trimmed);
    currentChunk = '';
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track code fence state (``` toggles)
    if (line.trimStart().startsWith('```')) {
      insideCodeFence = !insideCodeFence;
    }

    const candidate = currentChunk ? currentChunk + '\n' + line : line;

    // Check if adding this line would exceed maxChars
    if (candidate.length > maxChars && !insideCodeFence && currentChunk) {
      // Find a good split boundary in currentChunk
      const lastParaBreak = currentChunk.lastIndexOf('\n\n');
      const lastHeadingBreak = currentChunk.lastIndexOf('\n#');
      const splitPoint = Math.max(lastParaBreak, lastHeadingBreak);

      if (splitPoint > maxChars / 4) {
        // Good split point found
        const flushed = currentChunk.slice(0, splitPoint).trimEnd();
        const remainder = currentChunk.slice(splitPoint).trimStart();
        if (flushed) chunks.push(flushed);
        currentChunk = remainder + '\n' + line;
      } else {
        // No good boundary: force flush and start fresh
        flushChunk();
        currentChunk = line;
      }
    } else {
      currentChunk = candidate;
    }
  }

  flushChunk();

  // Add overlap context: prepend last `overlap` chars of previous chunk to each subsequent chunk
  const chunksWithContext: string[] = [];
  for (let i = 0; i < chunks.length; i++) {
    if (i === 0) {
      chunksWithContext.push(chunks[i]);
    } else {
      const prevEnd = chunks[i - 1].slice(-overlap);
      if (!chunks[i].startsWith(prevEnd.trimStart())) {
        chunksWithContext.push(`<!-- context from previous chunk -->\n${prevEnd}\n<!-- end context -->\n\n${chunks[i]}`);
      } else {
        chunksWithContext.push(chunks[i]);
      }
    }
  }

  return chunksWithContext;
}

// ---------------------------------------------------------------------------
// Chunk / frontmatter translation helpers
// ---------------------------------------------------------------------------

/**
 * Translates ONLY the YAML frontmatter fields (title, description, category, group, tags).
 * All technical/non-translatable fields are preserved unchanged.
 */
export async function translateFrontmatterOnly(
  frontmatter: string,
  options: TranslateArticleOptions,
): Promise<string> {
  const { targetLocale } = options;
  const targetMeta = LOCALE_NAMES[targetLocale] || { native: targetLocale, english: targetLocale };
  const localeName = `${targetMeta.english} / ${targetMeta.native}`;

  const systemPrompt = [
    `You are a precise YAML translator. Translate ONLY the human-readable text values in the given YAML frontmatter into ${localeName}.`,
    `Rules:`,
    `- Translate ONLY the values of these fields: title, description, category, group, tags (and tag list items).`,
    `- Do NOT translate or modify: i18nKey, lang, date, updated, cover, images, slug, permalink, abbrlink, externalLink, encrypt, externalEncrypt, externalEncrypts, pinned, sticky, hidden, draft, isAiGenerated, aiTranslatedFrom, wordCount, readingTime, or any field whose value is a URL, number, boolean, or null.`,
    `- Output ONLY the raw YAML block (no --- delimiters, no markdown fences).`,
    `- Preserve the exact YAML structure, indentation, and key order.`,
  ].join('\n');

  const userMessage = `Frontmatter to translate:\n\n${frontmatter}`;

  const result = await callModel({
    systemPrompt,
    userMessage,
    apiKey: options.apiKey,
    baseUrl: options.baseUrl,
    model: options.model,
    groqApiKey: options.groqApiKey,
    groqModel: options.groqModel,
    timeoutMs: 45000,
  });

  if (result.ok && result.text.trim()) {
    let out = result.text.trim();
    if (out.startsWith('```')) out = out.replace(/^```[a-z]*\r?\n/, '');
    if (out.endsWith('```')) out = out.replace(/\r?\n```$/, '');
    return out.trim();
  }

  // Fallback: return original frontmatter unchanged
  return frontmatter;
}

/**
 * Translates a single body chunk (not a full article; no frontmatter expected in output).
 * Includes retry logic (up to 3 attempts). Falls back to original source chunk on failure.
 */
export async function translateBodyChunk(
  chunk: string,
  chunkIndex: number,
  totalChunks: number,
  options: TranslateArticleOptions,
): Promise<{ text: string; provider: string; model: string }> {
  const { i18nKey, targetLocale } = options;
  const systemPrompt = compileChunkSystemPrompt(targetLocale);

  const userMessage = [
    `This is chunk ${chunkIndex + 1} of ${totalChunks} of the article body. Translate ONLY the provided text, maintaining continuity with the previous context shown.`,
    '',
    chunk,
  ].join('\n');

  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const result = await callModel({
      systemPrompt,
      userMessage,
      apiKey: options.apiKey,
      baseUrl: options.baseUrl,
      model: options.model,
      groqApiKey: options.groqApiKey,
      groqModel: options.groqModel,
      timeoutMs: 60000,
    });

    if (result.ok && result.text.trim()) {
      let translated = result.text.trim();
      // Strip any accidental ``` fences
      if (translated.startsWith('```')) translated = translated.replace(/^```[a-z]*\r?\n/, '');
      if (translated.endsWith('```')) translated = translated.replace(/\r?\n```$/, '');
      // Strip any accidental frontmatter that slipped in
      translated = translated.replace(/^---[\s\S]*?---\s*\n?/, '').trim();
      // Strip context comment markers if model echoed them back
      translated = translated.replace(/<!-- context from previous chunk -->[\s\S]*?<!-- end context -->\s*\n?/, '').trim();

      console.log(`[Article-i18n] 📦 Chunk ${chunkIndex + 1}/${totalChunks} for "${i18nKey}" -> translated via [${result.provider} / ${result.model}]`);
      return { text: translated, provider: result.provider, model: result.model };
    }

    if (attempt < MAX_RETRIES) {
      console.warn(`[Article-i18n] Warning: Chunk ${chunkIndex + 1}/${totalChunks} attempt ${attempt} failed, retrying in 3s...`);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }

  // All retries exhausted: use original source chunk as fallback
  console.warn(`[Article-i18n] Warning: Chunk ${chunkIndex + 1}/${totalChunks} for "${i18nKey}" failed all retries - using original source text as fallback.`);
  return { text: chunk, provider: 'fallback-source', model: 'none' };
}

// ---------------------------------------------------------------------------
// Chunked translation pipeline
// ---------------------------------------------------------------------------

/**
 * Full chunked translation pipeline for large articles (body > 8000 chars).
 * 1. Extracts frontmatter and body
 * 2. Translates frontmatter (first request)
 * 3. Splits body into ~6000-char semantic chunks
 * 4. Translates each chunk sequentially (3s delay between calls to avoid rate limiting)
 * 5. Reassembles: translated frontmatter + translated body chunks
 * 6. Runs cleanAiArticleOutput() and returns TranslateArticleResult
 */
export async function translateArticleChunked(options: TranslateArticleOptions): Promise<TranslateArticleResult> {
  const { sourceMarkdown, sourceLocale = 'zh-CN', targetLocale, i18nKey } = options;

  // Extract frontmatter and body
  const fmMatch = sourceMarkdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!fmMatch) {
    console.warn(`[Article-i18n] Warning: No frontmatter detected for "${i18nKey}". Falling back to full translateArticle().`);
    return translateArticle(options);
  }

  const rawFrontmatter = fmMatch[1];
  const rawBody = fmMatch[2];

  console.log(`[Article-i18n] Starting chunked translation for "${i18nKey}" -> ${targetLocale}`);
  console.log(`[Article-i18n]    Body length: ${rawBody.length} chars`);

  // Step 1: Translate frontmatter
  const translatedFm = await translateFrontmatterOnly(rawFrontmatter, options);

  // Brief pause before body chunks
  await new Promise((r) => setTimeout(r, 1500));

  // Step 2: Split body into chunks (~6000 chars each, 200 chars overlap)
  const chunks = splitIntoChunks(rawBody, 6000, 200);
  console.log(`[Article-i18n]    Split into ${chunks.length} chunks`);

  // Step 3: Translate each chunk sequentially
  const translatedChunks: string[] = [];
  let lastProvider = 'none';
  let lastModel = 'none';

  for (let i = 0; i < chunks.length; i++) {
    if (i > 0) {
      // 3s delay between chunk API calls to avoid rate limiting
      await new Promise((r) => setTimeout(r, 3000));
    }
    const { text, provider, model } = await translateBodyChunk(chunks[i], i, chunks.length, options);
    translatedChunks.push(text);
    lastProvider = provider;
    lastModel = model;
  }

  // Step 4: Reassemble translated frontmatter + body
  const translatedBody = translatedChunks.join('\n\n');
  const reconstructed = `---\n${translatedFm}\n---\n${translatedBody}`;

  // Step 5: Clean and finalize
  const cleaned = cleanAiArticleOutput(reconstructed, i18nKey, targetLocale, sourceLocale);

  if (cleaned && cleaned.includes('---')) {
    return {
      ok: true,
      translatedMarkdown: cleaned,
      targetLocale,
      i18nKey,
      provider: lastProvider,
      model: lastModel,
    };
  }

  return {
    ok: false,
    translatedMarkdown: '',
    targetLocale,
    i18nKey,
    provider: 'none',
    model: 'error',
    error: 'Chunked translation produced empty or invalid output.',
  };
}

// ---------------------------------------------------------------------------
// Original single-request translation (for small articles with body <= 8000 chars)
// ---------------------------------------------------------------------------

/**
 * Core translation function: calls model with fallback capability.
 * Use for articles with body <= 8000 chars. For larger articles, use translateArticleChunked().
 */
export async function translateArticle(options: TranslateArticleOptions): Promise<TranslateArticleResult> {
  const {
    sourceMarkdown,
    sourceLocale = 'zh-CN',
    targetLocale,
    i18nKey,
    slug = i18nKey,
  } = options;

  const targetMeta = LOCALE_NAMES[targetLocale] || { native: targetLocale, english: targetLocale };
  const systemPrompt = compileSystemPrompt(sourceLocale, targetLocale);

  const userMessage = [
    `Target Language: ${targetMeta.english} (${targetLocale})`,
    `Unified i18n Key: "${i18nKey}"`,
    `Slug Stem: "${slug}"`,
    '',
    'Please perform complete, idiomatic localization on the following Markdown article in accordance with the system prompt rules.',
    'Output strictly valid raw Markdown starting directly with "---" frontmatter.',
    '',
    'Original Markdown Content:',
    '----------------------------------------',
    sourceMarkdown,
    '----------------------------------------',
  ].join('\n');

  const result = await callModel({
    systemPrompt,
    userMessage,
    apiKey: options.apiKey,
    baseUrl: options.baseUrl,
    model: options.model,
    groqApiKey: options.groqApiKey,
    groqModel: options.groqModel,
    timeoutMs: 90000,
  });

  if (result.ok && result.text) {
    const cleaned = cleanAiArticleOutput(result.text, i18nKey, targetLocale, sourceLocale);
    if (cleaned && cleaned.includes('---')) {
      return {
        ok: true,
        translatedMarkdown: cleaned,
        targetLocale,
        i18nKey,
        provider: result.provider,
        model: result.model,
      };
    }
  }

  return {
    ok: false,
    translatedMarkdown: '',
    targetLocale,
    i18nKey,
    provider: 'none',
    model: 'error',
    error: result.error || 'All configured AI endpoints failed or timed out during translation.',
  };
}

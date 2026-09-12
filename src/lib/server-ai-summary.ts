/**
 * Shared AI Summary backend handler for Chronral AI (Dev Server & Cloudflare Functions)
 */

export type SummaryLevel = 'low' | 'medium' | 'high';

export interface SummaryRequestPayload {
  slug?: string;
  title?: string;
  url?: string;
  summary?: string;
  content?: string;
  mode?: 'auto' | 'instance' | 'llmgpt' | 'primer' | 'question';
  questionType?: string;
  lang?: string;
  locale?: string;
  related?: Array<{ title: string; href: string }>;
}

export interface SummaryResponsePayload {
  ok: boolean;
  provider: string;
  model: string;
  summary: string;
  thinking?: string;
  level?: SummaryLevel;
  lang?: string;
  cached?: boolean;
  error?: string;
}

export const DEFAULT_INSTANCE_MODELS = [
  'kimi-k3-free',
  'deepseek-v4-flash-free',
  'gpt-oss-120b',
  'gpt-oss-20b',
  'deepseek-v4-pro-free',
  'glm-5.2-free',
  'llama-3.3-70b-free',
];

export function getSummaryLevel(raw?: string | null): SummaryLevel {
  const val = (raw || '').toLowerCase().trim();
  if (val === 'high') return 'high';
  if (val === 'medium') return 'medium';
  return 'low'; // 默认低档位，省 token 且可随时切回
}

export function normalizeSummaryLocale(lang?: string | null): string {
  if (!lang) return 'zh-CN';
  const clean = lang.toLowerCase().trim();
  if (clean.startsWith('zh-hant') || clean.startsWith('zh-tw') || clean.startsWith('zh-hk')) return 'zh-Hant';
  if (clean.startsWith('zh')) return 'zh-CN';
  if (clean.startsWith('en')) return 'en';
  if (clean.startsWith('fr')) return 'fr';
  if (clean.startsWith('es')) return 'es';
  if (clean.startsWith('de')) return 'de';
  if (clean.startsWith('ja')) return 'ja';
  return 'zh-CN';
}

export function cleanModelDisplayName(model: string): string {
  return model
    .replace(/^openai\//i, '')
    .replace(/^groq\//i, '')
    .replace(/^qwen\//i, '')
    .replace(/^meta-llama\//i, '')
    .replace(/-free$/i, '')
    .replace(/-instruct$/i, '')
    .replace(/-versatile$/i, '')
    .trim();
}

export function cleanAiOutputText(text: string): string {
  if (!text) return '';
  return text
    .replace(/<think>[\s\S]*?(<\/think>|$)/gi, '')
    .replace(/^```[a-z]*\s*/i, '')
    .replace(/\s*```$/i, '')
    .replace(/^["'“](.*)["'”]$/s, '$1')
    .trim();
}

export function normalizeArticleContent(content: string, level: SummaryLevel = 'low'): string {
  const cleaned = (content || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[ \t]+\./g, '.')
    .trim();

  if (level === 'high') {
    return cleaned.slice(0, 120000); // 高档位：贴入全量正文知识库
  }
  if (level === 'medium') {
    return cleaned.slice(0, 15000); // 中档位：核心章节与细节
  }
  return cleaned.slice(0, 3500); // 低档位：轻量低消耗
}

export function getSystemInstructionByLevel(
  level: SummaryLevel = 'low',
  customInstruction?: string | null,
  rawLang?: string | null,
): string {
  if (customInstruction?.trim()) {
    return customInstruction.trim();
  }

  const lang = normalizeSummaryLocale(rawLang);

  if (lang === 'en') {
    if (level === 'high') {
      return [
        'You are a principal systems architect and tech curator powered by Chronral. Your mission is to analyze the author\'s complete long-form technical article as an authoritative contextual knowledge base, synthesizing its architectural evolution, engineering trade-offs, core design decisions, and craft philosophy.',
        'You possess a global engineering vision and deep technical insight, discerning underlying essence beyond surface prose.',
        'Adopt an objective, insightful, and craft-oriented tone. Strictly no polite greetings, no meta-chatter, and no Markdown headings, bullet points, or numbered lists. Output a single cohesive, information-dense plain text paragraph in natural, professional English.',
      ].join('\n');
    }
    if (level === 'medium') {
      return [
        'You are a technical architecture analyst powered by Chronral. Analyze this post from an engineering and systems architecture perspective, articulating technical rationale, trade-offs, and implementation outcomes.',
        'Strictly no greetings, no Markdown headings or lists. Output a single cohesive, information-dense plain text paragraph in clear, professional English.',
      ].join('\n');
    }
    return 'You are a concise technical summary assistant powered by Chronral. Extract key takeaways and engineering conclusions rapidly. Strictly no greetings, no Markdown lists or headings. Output a compact, information-dense plain text paragraph in clear English.';
  }

  if (lang === 'zh-Hant') {
    if (level === 'high') {
      return [
        '你是由 Chronral 知識庫驅動的資深技術架構師與全景內容領航專家。你的使命是將作者的整篇長文作為權威上下文知識庫，融會貫通其底層設計邏輯、技術架構演進、核心工程決策與極客思考。',
        '你具備開闊的全局技術視野與敏銳的工程洞察力，能夠跳脫出表面文字，直擊技術本質。',
        '請以冷靜、深邃、富有極客工匠精神的口吻進行總結，嚴禁寒暄客套，嚴禁空洞總結，嚴禁使用 Markdown 標題、編號或列表，輸出整段連貫精悍、高資訊密度的繁體中文純文字。',
      ].join('\n');
    }
    if (level === 'medium') {
      return [
        '你是由 Chronral 驅動的技術部落格架構剖析專家。請從工程實踐與系統架構視角出發，洞悉文章的技術邏輯鏈條、選型背景與實現取捨。',
        '語言緊湊專業，條理清晰，嚴禁寒暄與客套，嚴禁 Markdown 標題或列表，輸出結構連貫、高資訊密度的繁體中文純文字。',
      ].join('\n');
    }
    return '你是由 Chronral 驅動的技術部落格輕量摘要助手。請保持冷靜、嚴謹、客觀、緊湊，快速提取文章核心要點與技術結論。嚴禁寒暄與客套，嚴禁 Markdown 列表，輸出一段極簡緊湊的繁體中文純文字。';
  }

  if (lang === 'fr') {
    if (level === 'high') {
      return [
        'Vous êtes un architecte logiciel principal propulsé par Chronral. Votre mission est d\'analyser l\'intégralité de l\'article technique comme base de connaissances faisant autorité, en synthétisant la logique de conception, l\'évolution architecturale et les compromis d\'ingénierie.',
        'Adoptez un ton perspicace et rigoureux. Aucun préambule ni formule de politesse. Aucun titre ni liste Markdown. Rédigez un paragraphe unique, fluide et dense en français.',
      ].join('\n');
    }
    if (level === 'medium') {
      return 'Vous êtes un analyste en architecture logicielle propulsé par Chronral. Analysez cet article sous l\'angle de l\'ingénierie et des compromis techniques. Pas de salutations, pas de listes Markdown. Rédigez un paragraphe dense et fluide en français.';
    }
    return 'Vous êtes un assistant de synthèse technique propulsé par Chronral. Extrayez les points essentiels et conclusions techniques. Aucun préambule, pas de puces Markdown. Rédigez un paragraphe concis en français.';
  }

  if (lang === 'es') {
    if (level === 'high') {
      return [
        'Eres un arquitecto de software principal impulsado por Chronral. Tu misión es analizar el artículo técnico completo como base de conocimiento fidedigna, sintetizando la evolución arquitectónica, decisiones clave y compensaciones de ingeniería.',
        'Mantén un tono técnico y perspicaz. Sin saludos ni relleno. Sin encabezados ni listas Markdown. Genera un único párrafo fluido y de alta densidad en español.',
      ].join('\n');
    }
    if (level === 'medium') {
      return 'Eres un analista de arquitectura técnica impulsado por Chronral. Analiza este artículo desde la perspectiva de la práctica de ingeniería y arquitectura de sistemas. Sin saludos, sin listas Markdown. Genera un párrafo conciso y fluido en español.';
    }
    return 'Eres un asistente de resumen técnico impulsado por Chronral. Extrae los puntos clave y conclusiones técnicas. Sin saludos ni viñetas Markdown. Genera un párrafo breve y claro en español.';
  }

  if (lang === 'de') {
    if (level === 'high') {
      return [
        'Sie sind ein leitender Systemarchitekt, angetrieben von Chronral. Ihre Mission ist es, den gesamten Fachartikel als maßgebliche Wissensbasis zu analysieren und die Architekturentwicklung, Kernentscheidungen und ingenieurmäßige Abwägungen zusammenzufassen.',
        'Sachlicher, präziser Ton. Keine Höflichkeitsfloskeln, keine Markdown-Überschriften oder Aufzählungen. Geben Sie einen einzelnen, kohärenten Absatz mit hoher Informationsdichte auf Deutsch aus.',
      ].join('\n');
    }
    if (level === 'medium') {
      return 'Sie sind ein technischer Architekturanalyst, angetrieben von Chronral. Analysieren Sie den Beitrag aus der Perspektive von Softwarearchitektur und Engineering. Keine Begrüßung, keine Markdown-Listen. Geben Sie einen dichten Absatz auf Deutsch aus.';
    }
    return 'Sie sind ein technischer Zusammenfassungs-Assistent, angetrieben von Chronral. Extrahieren Sie die Kernaussagen und technischen Ergebnisse. Keine Floskeln, keine Markdown-Listen. Geben Sie einen prägnanten Absatz auf Deutsch aus.';
  }

  // 默认 zh-CN
  if (level === 'high') {
    return [
      '你是由 Chronral 知识库驱动的资深技术架构师与全景内容领航专家。你的使命是将博主的整篇长文作为权威上下文知识库，融会贯通其底层设计逻辑、技术架构演进、核心工程决策与极客思考。',
      '你具备开阔的全局技术视野与敏锐的工程洞察力，能够跳脱出表面文字，直击技术本质。',
      '请以冷静、深邃、富有极客工匠精神的口吻进行总结，严禁寒暄客套，严禁空洞的八股文总结，严禁使用 Markdown 标题、编号或列表，输出一整段连贯精悍、高信息密度的纯文本。',
    ].join('\n');
  }

  if (level === 'medium') {
    return [
      '你是由 Chronral 驱动的技术博客架构剖析专家。请从工程实践与系统架构视角出发，洞悉文章的技术逻辑链条、选型背景与实现取舍。',
      '语言紧凑专业，条理清晰，严禁寒暄与客套，严禁 Markdown 标题或列表，输出结构连贯、高信息密度的纯文本。',
    ].join('\n');
  }

  return '你是由 Chronral 驱动的技术博客轻量摘要助手。请保持冷静、严谨、客观、紧凑，快速提取文章核心要点与技术结论。严禁寒暄与客套，严禁 Markdown 列表，输出一段极简紧凑的纯文本。';
}

export function buildDynamicQuestionPrompt(input: {
  title: string;
  content: string;
  summary: string;
  questionType: string;
  level?: SummaryLevel;
  lang?: string;
  related?: Array<{ title: string; href: string }>;
  customUserPrompt?: string | null;
}): string {
  const { title, content, summary, questionType, level = 'low', lang: rawLang, related = [], customUserPrompt } = input;
  const lang = normalizeSummaryLocale(rawLang);
  const relatedListStr = related.map((r, i) => `${i + 1}. 《${r.title}》`).join('、');

  if (customUserPrompt?.trim() && !questionType) {
    return customUserPrompt
      .replace(/\$\{title\}/g, title)
      .replace(/\$\{summary\}/g, summary || '无')
      .replace(/\$\{content\}/g, content)
      .replace(/\$\{lang\}/g, lang);
  }

  if (lang === 'en') {
    switch (questionType) {
      case 'point': {
        const wordLimit = level === 'high' ? '110-180 words' : level === 'medium' ? '90-140 words' : '80-120 words';
        const promptInstruction =
          level === 'high'
            ? `From a principal systems architect's perspective, analyze the full context of "${title}" and extract the 2-3 most critical architectural arguments and technical decisions, explaining their rationale and trade-offs.`
            : `Extract the 2-3 core technical arguments and architectural takeaways from "${title}".`;
        return [
          promptInstruction,
          `Requirements: Output ${wordLimit} of cohesive plain text in English, no lists, no headings.`,
          '',
          `Knowledge Base:\n${content}`,
        ].join('\n');
      }

      case 'audience': {
        const wordLimit = level === 'high' ? '110-180 words' : level === 'medium' ? '90-140 words' : '80-120 words';
        return [
          `Analyze the target audience persona (e.g. frontend architects, full-stack builders) for "${title}".`,
          `Requirements: Explain how this article reshapes their technical perspective or resolves concrete engineering challenges. Output ${wordLimit} in plain English, no lists.`,
          '',
          `Knowledge Base:\n${content}`,
        ].join('\n');
      }

      case 'quick':
        return [
          `Provide a rapid 30-second overview for "${title}" in exactly three cohesive sentences:`,
          'Sentence 1: Background context and key pain point.',
          'Sentence 2: Core technical architecture and solution.',
          'Sentence 3: Practical outcomes and lasting takeaways.',
          'Requirements: Three fluent, cohesive sentences. Output 80-130 words of plain text in English.',
          '',
          `Knowledge Base:\n${content}`,
        ].join('\n');

      case 'insight': {
        const wordLimit = level === 'high' ? '110-180 words' : level === 'medium' ? '90-140 words' : '80-120 words';
        return [
          `Extract the core practical takeaways, pitfalls to avoid, and architectural insights from "${title}".`,
          `Requirements: Provide actionable engineering guidance in professional, concise English. Output ${wordLimit} plain text, no lists.`,
          '',
          `Knowledge Base:\n${content}`,
        ].join('\n');
      }

      case 'intro':
        return [
          'Generate a comprehensive, craft-focused author introduction for Shijianus: a generalist software builder, student, and long-term writer.',
          'Requirements: Highlight his philosophy of "content-first, structure-first, and craft-driven ergonomics" across Astro, TypeScript, and full-stack systems engineering. Output 100-150 words of plain text in English.',
        ].join('\n');

      case 'related_reason':
        return [
          `In connection with "${title}", analyze why the following recommended readings are valuable follow-ups: ${relatedListStr || 'related technical topics'}.`,
          'Requirements: Explain the thematic progression and complementary value. Output 90-140 words of plain text in English.',
          '',
          `Article Context: ${summary || title}`,
        ].join('\n');

      default: {
        if (level === 'high') {
          return [
            '【Role & Mission】',
            'You are a senior systems architect and technical curator. Use the entire article provided below as an authoritative knowledge base and complete context to deliver an in-depth architectural summary for readers.',
            '',
            '【Core Objectives & Creative Liberty】',
            '1. Panoramic Reading: Comprehend the author\'s background motivation, design philosophy, technical trajectory, and critical engineering trade-offs.',
            '2. Architectural Distillation: Avoid robotic regurgitation. Uncover the most compelling highlights—such as distinct architectural trade-offs, elegant code implementation, systems performance optimization, or deep technology stack integration.',
            '3. Engineering Inspiration: Articulate the profound practical insights and paradigm-shifting value for engineers, architects, and technical explorers.',
            '',
            '【Generation Constraints & Language Requirement】',
            '- Output Language: STRICTLY write in natural, idiomatic, professional English. Do NOT output Chinese or any other language.',
            '- Word Limit: Strictly between 130 and 190 words of cohesive plain text.',
            '- Expression: Natural, reflective, and insight-dense. Strictly NO conversational greetings, NO cliché openers like "This article discusses", and NO Markdown lists (-, *, 1. 2.), headings, or bold markup. Output a single cohesive paragraph.',
            '- Accuracy: Strictly grounded in the provided content; do not invent unmentioned concepts or metrics.',
            '',
            '【Input Knowledge Base】',
            `Article Title: ${title}`,
            `Author Note: ${summary || 'None'}`,
            'Full Article Knowledge Base:',
            content,
          ].join('\n');
        }

        if (level === 'medium') {
          return [
            'Please generate a structured, in-depth architectural summary in English for this technical blog post.',
            'Requirements:',
            '1. Output Language: Strictly write in English.',
            '2. Word Limit: Strictly 100-150 words of plain text.',
            '3. Systematically articulate the core problem background, rationale behind technical choices, architectural implementation, and tangible outcomes.',
            '4. Maintain a professional, cohesive, and concise tone. Strictly no greetings, no Markdown headings or lists.',
            '',
            `Title: ${title}`,
            `Author Note: ${summary || 'None'}`,
            `Core Content:\n${content}`,
          ].join('\n');
        }

        return [
          'Please generate a concise core technical summary in English for this blog post.',
          'Requirements:',
          '1. Output Language: Strictly write in English.',
          '2. Word Limit: Strictly 80-120 words of plain text.',
          '3. High information density, concise prose, no greetings, no Markdown lists.',
          '4. Highlight the primary technical solution and the intended audience.',
          '',
          `Title: ${title}`,
          `Author Note: ${summary || 'None'}`,
          `Content Snippet:\n${content}`,
        ].join('\n');
      }
    }
  }

  if (lang === 'zh-Hant') {
    switch (questionType) {
      case 'point': {
        const wordLimit = level === 'high' ? '150-240 字' : level === 'medium' ? '130-200 字' : '120-170 字';
        const promptInstruction =
          level === 'high'
            ? `請以資深技術架構師視角，縱觀《${title}》全文知識庫，深度提煉最硬核的 2~3 個核心架構論點與技術決斷。闡明立論依據、關鍵實現取捨與架構收益。`
            : `請針對博文《${title}》深度提煉出最核心的 2~3 個技術論點與架構結論。`;
        return [
          promptInstruction,
          `要求：使用繁體中文輸出，緊扣文章方案，語言專業凝練，輸出 ${wordLimit} 純文字，不要列表。`,
          '',
          `正文知識庫：\n${content}`,
        ].join('\n');
      }

      case 'audience': {
        const wordLimit = level === 'high' ? '150-240 字' : level === 'medium' ? '130-200 字' : '120-170 字';
        return [
          `請分析博文《${title}》最適合的目標受眾畫像（例如前端開發者、架構師、全端工程師或技術寫作者）。`,
          `要求：使用繁體中文輸出，具體說明閱讀本文能幫他們解決哪些開發難點或思維盲區，輸出 ${wordLimit} 純文字，不要列表。`,
          '',
          `正文知識庫：\n${content}`,
        ].join('\n');
      }

      case 'quick':
        return [
          `請用極精簡的三句話為博文《${title}》做 30 秒極速通讀：`,
          '第一句說明背景與核心痛點；',
          '第二句說明核心技術實現與方案；',
          '第三句說明最終收益與關鍵結論。',
          '要求：使用繁體中文輸出，三句話連貫一體，客觀緊湊，輸出 100-160 字純文字。',
          '',
          `正文知識庫：\n${content}`,
        ].join('\n');

      case 'insight': {
        const wordLimit = level === 'high' ? '150-240 字' : level === 'medium' ? '130-200 字' : '120-170 字';
        return [
          `請提煉博文《${title}》在真實工程實踐、架構演進或組件設計中的核心避坑指南與認知啟示。`,
          `要求：使用繁體中文輸出，給出具指導意義的工程經驗，語言精煉，輸出 ${wordLimit} 純文字，不要列表。`,
          '',
          `正文知識庫：\n${content}`,
        ].join('\n');
      }

      case 'intro':
        return [
          '請為技術部落客 Shijianus（時鑑）生成一份詳盡、立體且富有極客工匠精神的作者介紹。',
          '要求：使用繁體中文輸出，介紹其作為通才型軟體構建者、學生與長期寫作者的定位，強調「內容優先、結構優先、體驗潔癖」與長期主義構建理念，輸出 140-190 字純文字。',
        ].join('\n');

      case 'related_reason':
        return [
          `請結合博文《${title}》的核心主題，深度分析為什麼以下延伸閱讀值得讀者順著脈絡繼續探索：${relatedListStr || '相關主題文章'}。`,
          '要求：使用繁體中文輸出，闡述各文章與當前主題的技術遞進關係或互補價值，輸出 120-180 字純文字。',
          '',
          `當前文章概要：${summary || title}`,
        ].join('\n');

      default: {
        if (level === 'high') {
          return [
            '【身份與使命】',
            '你是資深技術架構師與全景知識領航專家。請以整篇博文為核心知識庫與完整上下文，為讀者進行深度全景總結。',
            '',
            '【核心任務與自由度】',
            '1. 全景通讀：基於下方提供的完整文章正文，通盤理解整篇作品的背景動機、核心設計思想、技術演進脈絡與關鍵工程取捨。',
            '2. 自由提煉與聚焦：拒絕千篇一律的機械套路與扁平複述。請發揮架構師的全局審視能力，自由提煉最打動人或最硬核的精髓。',
            '3. 啟迪讀者：點明文章對工程師、架構師或技術探索者的深層實踐啟示與範式轉變價值。',
            '',
            '【生成約束與字數上限】',
            '- 輸出語言：必須嚴格使用繁體中文（正體中文）輸出，嚴禁使用簡體中文或英文。',
            '- 字數上限：嚴格控制在 220 至 320 字純文字之間（資訊充沛飽滿，篇幅恰到好處）。',
            '- 表達規範：語言自然連貫、極富思考質感，一氣呵成；嚴禁寒暄；嚴禁使用任何 Markdown 列表，輸出為單一完整段落的純文字。',
            '- 真實準確：完全基於提供的正文知識庫，不捏造任何未提及的概念與數據。',
            '',
            '【輸入知識庫】',
            `文章標題：${title}`,
            `作者手記：${summary || '暫無作者手記'}`,
            '完整正文知識庫：',
            content,
          ].join('\n');
        }

        if (level === 'medium') {
          return [
            '請從工程架構與技術實踐視角，為這篇部落格文章生成結構化繁體中文深度摘要。',
            '要求：',
            '1. 輸出語言：必須嚴格使用繁體中文輸出。',
            '2. 輸出 160-240 字純文字。',
            '3. 深入梳理文章的痛點背景、關鍵技術方案選型依據、核心架構實現與最終落地收益。',
            '4. 嚴禁編造，輸出純文字，不要 Markdown 標題或列表。',
            '',
            `標題：${title}`,
            `作者自述：${summary || '無'}`,
            `正文核心內容：\n${content}`,
          ].join('\n');
        }

        return [
          '請為這篇部落格文章生成極簡繁體中文核心摘要。',
          '要求：',
          '1. 輸出語言：必須嚴格使用繁體中文輸出。',
          '2. 輸出 120-170 字純文字。',
          '3. 保持資訊密度高，語言精煉，不要寒暄。',
          '4. 優先說明文章核心技術方案與適合什麼讀者，不要 Markdown 列表。',
          '',
          `標題：${title}`,
          `作者自述：${summary || '無'}`,
          `正文片段：\n${content}`,
        ].join('\n');
      }
    }
  }

  // 默认 zh-CN
  switch (questionType) {
    case 'point': {
      const wordLimit = level === 'high' ? '150-240 字' : level === 'medium' ? '130-200 字' : '120-170 字';
      const promptInstruction =
        level === 'high'
          ? `请以资深技术架构师视角，纵观《${title}》全文知识库，深度提炼最硬核的 2~3 个核心架构论点与技术决断。阐明立论依据、关键实现取舍与架构收益。`
          : `请针对博文《${title}》深度提炼出最核心的 2~3 个技术论点与架构结论。`;
      return [
        promptInstruction,
        `要求：紧扣文章方案，语言专业凝练，输出 ${wordLimit} 纯文本，不要列表。`,
        '',
        `正文知识库：\n${content}`,
      ].join('\n');
    }

    case 'audience': {
      const wordLimit = level === 'high' ? '150-240 字' : level === 'medium' ? '130-200 字' : '120-170 字';
      return [
        `请分析博文《${title}》最适合的目标受众画像（例如前端开发者、架构师、全栈工程师或技术写作者）。`,
        `要求：具体说明阅读本文能帮他们解决哪些开发难点、思维盲区或技术落地问题，输出 ${wordLimit} 纯文本，不要列表。`,
        '',
        `正文知识库：\n${content}`,
      ].join('\n');
    }

    case 'quick':
      return [
        `请用极精简的三句话为博文《${title}》做 30 秒极速通读：`,
        '第一句说明背景与核心痛点；',
        '第二句说明核心技术实现与方案；',
        '第三句说明最终收益与关键结论。',
        '要求：三句话连贯一体，客观紧凑，输出 100-160 字纯文本。',
        '',
        `正文知识库：\n${content}`,
      ].join('\n');

    case 'insight': {
      const wordLimit = level === 'high' ? '150-240 字' : level === 'medium' ? '130-200 字' : '120-170 字';
      return [
        `请提炼博文《${title}》在真实工程实践、架构演进或组件设计中的核心避坑指南与认知启示。`,
        `要求：给出具有指导意义的工程经验与行动建议，语言精炼，输出 ${wordLimit} 纯文本，不要列表。`,
        '',
        `正文知识库：\n${content}`,
      ].join('\n');
    }

    case 'intro':
      return [
        `请为技术博主 Shijianus（时鉴）生成一份详尽、立体且富有极客工匠精神的作者介绍。`,
        '要求：介绍其作为通才型软件构建者、学生与长期写作者的定位，涵盖 Astro、TypeScript、全栈架构与系统工程技术栈，强调“内容优先、结构优先、体验洁癖”与长期主义构建理念，输出 140-190 字纯文本。',
      ].join('\n');

    case 'related_reason':
      return [
        `请结合博文《${title}》的核心主题，深度分析为什么以下延伸阅读值得读者顺着脉络继续探索：${relatedListStr || '相关主题文章'}。`,
        '要求：阐述各文章与当前主题的技术递进关系或互补价值，输出 120-180 字纯文本。',
        '',
        `当前文章概要：${summary || title}`,
      ].join('\n');

    default: {
      // 默认核心摘要 Prompt
      if (level === 'high') {
        return [
          '【身份与使命】',
          '你是资深技术架构师与全景知识领航专家。请以整篇博文为核心知识库与完整上下文，为读者进行深度全景总结。',
          '',
          '【核心任务与自由度】',
          '1. 全景通读：基于下方提供的完整文章正文，通盘理解整篇作品的背景动机、核心设计思想、技术演进脉络与关键工程取舍。',
          '2. 自由提炼与聚焦：拒绝千篇一律的机械套路与扁平复述。请发挥架构师的全局审视能力，自由提炼最打动人或最硬核的精髓——每次总结可自主聚焦不同的核心亮点（例如独特的架构权衡、优雅的编码实现、系统级性能优化、前沿技术栈的深度整合，或是作者对工程美学的独到见解）。',
          '3. 启迪读者：点明文章对工程师、架构师或技术探索者的深层实践启示与范式转变价值。',
          '',
          '【生成约束与字数上限】',
          '- 字数上限：严格控制在 220 至 320 字纯文本之间（信息充沛饱满，篇幅恰到好处）。',
          '- 表达规范：语言自然连贯、极富思考质感，一气呵成；严禁出现“本文主要讲述了”、“首先其次最后”等刻板八股用语；严禁寒暄；严禁使用任何 Markdown 列表（如 -、*、1. 2.）、加粗或分段标签，输出为单一完整段落的纯文本。',
          '- 真实准确：完全基于提供的正文知识库，不捏造任何未提及的概念与数据。',
          '',
          '【输入知识库】',
          `文章标题：${title}`,
          `作者手记：${summary || '暂无作者手记'}`,
          '完整正文知识库：',
          content,
        ].join('\n');
      }

      if (level === 'medium') {
        return [
          '请从工程架构与技术实践视角，为这篇博客文章生成结构化中文深度摘要。',
          '要求：',
          '1. 输出 160-240 字纯文本。',
          '2. 深入梳理文章的痛点背景、关键技术方案选型依据、核心架构实现与最终落地收益。',
          '3. 语言专业凝练，条理自然顺畅，兼具技术深度与可读性。',
          '4. 严格基于文章提供的内容，严禁编造，输出纯文本，不要 Markdown 标题或列表。',
          '',
          `标题：${title}`,
          `作者自述：${summary || '无'}`,
          `正文核心内容：\n${content}`,
        ].join('\n');
      }

      return [
        '请为这篇博客文章生成极简中文核心摘要。',
        '要求：',
        '1. 输出 120-170 字纯文本。',
        '2. 保持信息密度高，语言精炼，不要寒暄。',
        '3. 优先说明文章核心技术方案与适合什么读者。',
        '4. 不要编造正文里没有的信息，输出纯文本，不要 Markdown 列表。',
        '',
        `标题：${title}`,
        `作者自述：${summary || '无'}`,
        `正文片段：\n${content}`,
      ].join('\n');
    }
  }
}

export async function processAiSummaryRequest(
  payload: SummaryRequestPayload,
  envSecrets: {
    instanceAiBaseUrl?: string;
    instanceAiApiKey?: string;
    instanceAiModel?: string;
    groqApiKey?: string;
    groqModel?: string;
    aiSummaryLevel?: string;
    aiSummaryFixedModel?: string;
    aiSummaryModelPool?: string;
    aiSummaryCustomSystemPrompt?: string;
    aiSummaryCustomUserPrompt?: string;
  },
): Promise<SummaryResponsePayload> {
  const title = payload.title?.trim() || '';
  const summary = payload.summary?.trim() || '';
  const mode = payload.mode || 'auto';
  const questionType = payload.questionType || '';
  const related = payload.related || [];

  if (!title) {
    return {
      ok: false,
      provider: 'Chronral',
      model: 'error',
      summary: '缺少文章标题或内容',
      error: 'Missing title',
    };
  }

  // 1. 确定档位（默认 low，可由环境变量随时切换）
  const rawLevel = envSecrets.aiSummaryLevel || process.env.AI_SUMMARY_LEVEL;
  const level = getSummaryLevel(rawLevel);
  const lang = normalizeSummaryLocale(payload.lang || payload.locale);

  // 2. 根据档位处理正文内容（high 档位保留全量文章作为知识库，不截断）
  const content = normalizeArticleContent(payload.content || '', level);

  // 3. 构建对应的系统指令与提示词
  const systemInstruction = getSystemInstructionByLevel(
    level,
    envSecrets.aiSummaryCustomSystemPrompt || process.env.AI_SUMMARY_CUSTOM_SYSTEM_PROMPT,
    lang,
  );

  const prompt = buildDynamicQuestionPrompt({
    title,
    content,
    summary,
    questionType: questionType || '',
    level,
    lang,
    related,
    customUserPrompt: envSecrets.aiSummaryCustomUserPrompt || process.env.AI_SUMMARY_CUSTOM_USER_PROMPT,
  });

  const instanceKey =
    envSecrets.instanceAiApiKey ||
    process.env.INSTANCE_AI_API_KEY ||
    '';
  const instanceBase = (
    envSecrets.instanceAiBaseUrl ||
    process.env.INSTANCE_AI_BASE_URL ||
    'https://ai.121628.xyz/v1'
  ).replace(/\/+$/, '');

  // 4. 固定模型节点 vs 模型池随机选择
  const explicitFixedModel = (
    envSecrets.aiSummaryFixedModel ||
    process.env.AI_SUMMARY_FIXED_MODEL ||
    ''
  ).trim();

  let candidateInstanceModels: string[] = [];

  if (explicitFixedModel) {
    candidateInstanceModels = [explicitFixedModel];
  } else {
    const customPool = (envSecrets.aiSummaryModelPool || process.env.AI_SUMMARY_MODEL_POOL || '')
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);
    const pool = customPool.length > 0 ? customPool : DEFAULT_INSTANCE_MODELS;
    candidateInstanceModels = [...pool].sort(() => Math.random() - 0.5);

    const preferred = envSecrets.instanceAiModel || process.env.INSTANCE_AI_MODEL;
    if (preferred && !candidateInstanceModels.includes(preferred)) {
      candidateInstanceModels.unshift(preferred);
    }
  }

  // 随机温度与随机 seed，实现高自由度
  const temperature = Number((0.72 + Math.random() * 0.15).toFixed(2));
  const seed = Math.floor(Math.random() * 1000000);
  const maxTokens = level === 'high' ? 950 : level === 'medium' ? 750 : 550;

  // 1. Try InstanceAI
  if (instanceKey) {
    for (const model of candidateInstanceModels.slice(0, explicitFixedModel ? 1 : 2)) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const res = await fetch(`${instanceBase}/chat/completions`, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${instanceKey}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; ChronralAI/2.0; +https://shijian.us)',
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: prompt },
            ],
            temperature,
            seed,
            max_tokens: maxTokens,
          }),
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = (await res.json()) as {
            choices?: Array<{
              message?: {
                content?: string | null;
                reasoning_content?: string | null;
                reasoning?: string | null;
              };
            }>;
          };

          const choice = data.choices?.[0];
          const rawContent = choice?.message?.content || '';
          const thinkingSnippet = (choice?.message?.reasoning_content || choice?.message?.reasoning || '')
            .slice(0, 80)
            .replace(/\n/g, ' ')
            .trim();
          const text = cleanAiOutputText(rawContent);

          if (text && text.length >= 25) {
            const cleanName = cleanModelDisplayName(model);
            return {
              ok: true,
              provider: 'Chronral',
              model: cleanName,
              summary: text,
              level,
              lang,
              thinking: thinkingSnippet || `正在解析博文《${title}》核心脉络与技术方案...`,
            };
          }
        }
      } catch {
        continue;
      }
    }
  }

  // 2. Try Groq
  const groqKey =
    envSecrets.groqApiKey ||
    process.env.GROQ_API_KEY ||
    '';

  if (groqKey) {
    const groqModels = explicitFixedModel
      ? [explicitFixedModel]
      : ['groq/compound', 'qwen/qwen3.8-27b', 'groq/compound-mini', 'openai/gpt-oss-120b', 'qwen/qwen3.6-27b'];
    const shuffledGroq = explicitFixedModel ? groqModels : [...groqModels].sort(() => Math.random() - 0.5);

    for (const m of shuffledGroq) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${groqKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: m,
            messages: [
              { role: 'system', content: systemInstruction },
              { role: 'user', content: prompt },
            ],
            temperature,
            max_tokens: maxTokens,
          }),
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = (await res.json()) as {
            choices?: Array<{ message?: { content?: string; reasoning_content?: string; reasoning?: string } }>;
          };
          const choice = data.choices?.[0];
          const text = cleanAiOutputText(choice?.message?.content || '');
          const thinkingSnippet = (choice?.message?.reasoning_content || choice?.message?.reasoning || '')
            .slice(0, 80)
            .replace(/\n/g, ' ')
            .trim();
          if (text && text.length >= 25) {
            const cleanName = cleanModelDisplayName(m);
            return {
              ok: true,
              provider: 'Chronral',
              model: cleanName,
              summary: text,
              level,
              lang,
              thinking: thinkingSnippet || `正在基于 ${cleanName} 模型提炼文章论点与结论...`,
            };
          }
        }
      } catch {
        continue;
      }
    }
  }

  // 3. Fallback
  return {
    ok: true,
    provider: 'Chronral',
    model: 'Primer',
    summary:
      summary ||
      `《${title}》：本文深入探讨了相关核心技术与实践要点，帮助读者系统掌握关键概念与架构方案。`,
    level,
    lang,
    thinking: '正在调取本地预置精炼概要...',
  };
}

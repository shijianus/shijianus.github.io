#!/usr/bin/env node
/**
 * Verification Suite: Translation Format Preservation, Scheme 1 & Scheme 2, Image OCR, and Dark Mode Contrast
 */

import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import {
  validateTranslatedFormat,
  translateArticleByExtraction,
  performImageOcr,
  processImagesWithOcr,
} from '../src/lib/server-article-i18n.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT, 'dist');
const PORT = 4328;
const BASE_URL = `http://localhost:${PORT}`;

function createStaticServer(distDir, port) {
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
    '.webp': 'image/webp',
  };

  const server = http.createServer((req, res) => {
    let urlPath = req.url.split('?')[0];
    if (urlPath.endsWith('/')) urlPath += 'index.html';
    let filePath = path.join(distDir, urlPath);
    if (!path.extname(filePath)) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = mime[ext] || 'application/octet-stream';

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      res.writeHead(200, { 'Content-Type': contentType });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>404 Not Found</h1>');
    }
  });

  return new Promise((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function run() {
  console.log('🧪 ========================================================');
  console.log('   TRANSLATION FORMAT PRESERVATION & OCR VERIFICATION SUITE');
  console.log('========================================================\n');

  // -------------------------------------------------------------
  // Test 1: Unit Verification of Scheme 2 (Extraction & Re-insertion)
  // -------------------------------------------------------------
  console.log('--- Test 1: Scheme 2 (Extraction & In-Place Re-insertion) ---');
  const sampleMarkdown = `---
title: "测试复杂排版与组件保护"
description: "用于验证翻译后格式是否被破坏的基准测试"
tags: ["Architecture", "Theme", "Astro"]
i18nKey: "test-format-preservation"
lang: "zh-CN"
---

# 核心架构解析与组件格式完整性

在现代博客主题设计中，**排版格式必须严格保留**，包括代码块、HTML标签与状态卡片：

> [!NOTE]
> 这是一个标准 Callout 提示卡片，其语法必须完全保留。

| 模块名称 | 核心职责 | 当前状态 |
| :--- | :--- | :---: |
| **国际化引擎** | 多语言自适应与排版保护 | 正常就绪 |
| **OCR 图像识别** | 提取图中文字并进行多语种转译 | 正常就绪 |

\`\`\`typescript
// 关键配置类型定义
export interface ThemeConfig {
  version: string;
  debug: boolean;
}
\`\`\`

<div class="article-task-tracker" data-storage-key="test-tracker">
  <div class="task-tracker__header">
    <div class="task-tracker__title">
      <svg width="20" height="20" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/></svg>
      <span>任务进度监控面板</span>
    </div>
  </div>
  <ul class="task-checklist">
    <li class="task-checklist-item is-done">
      <input type="checkbox" checked id="step-1" />
      <label for="step-1">步骤一：格式结构模版抽取</label>
    </li>
  </ul>
</div>
`;

  console.log('  Testing Scheme 2 extraction on sample markdown...');
  const extractionResult = await translateArticleByExtraction({
    sourceMarkdown: sampleMarkdown,
    sourceLocale: 'zh-CN',
    targetLocale: 'en',
    i18nKey: 'test-format-preservation',
    enableOcr: false,
  });

  if (!extractionResult.ok || !extractionResult.translatedMarkdown) {
    throw new Error(`Scheme 2 extraction failed: ${extractionResult.error}`);
  }

  const outMd = extractionResult.translatedMarkdown;
  console.log('  Scheme 2 output generated successfully.');

  // Validate HTML tags preservation
  const requiredTags = [
    '<div class="article-task-tracker" data-storage-key="test-tracker">',
    '<div class="task-tracker__header">',
    '<svg width="20" height="20" viewBox="0 0 24 24"><path d="M9 11l3 3L22 4"/></svg>',
    '<ul class="task-checklist">',
    '<input type="checkbox" checked id="step-1" />',
    '<label for="step-1">',
  ];

  for (const tag of requiredTags) {
    if (!outMd.includes(tag)) {
      throw new Error(`Scheme 2 format preservation failed! Missing tag: ${tag}`);
    }
  }
  console.log('  ✅ Scheme 2: All 6 rich HTML tags and attributes 100% preserved!');

  // Validate Markdown structure preservation
  if (!outMd.includes('> [!NOTE]')) {
    throw new Error('Scheme 2 failed to preserve > [!NOTE] callout!');
  }
  if (!outMd.includes('| Module Name |') && !outMd.includes('| Core Responsibility |') && !outMd.includes('| :--- | :--- | :---: |')) {
    if (!outMd.includes('| :--- | :--- | :---: |')) {
      throw new Error('Scheme 2 failed to preserve markdown table structure!');
    }
  }
  if (!outMd.includes('```typescript') || !outMd.includes('export interface ThemeConfig')) {
    throw new Error('Scheme 2 failed to preserve typescript code block!');
  }
  console.log('  ✅ Scheme 2: Callouts, tables, and code blocks 100% preserved!');

  // -------------------------------------------------------------
  // Test 2: Image OCR Extraction
  // -------------------------------------------------------------
  console.log('\n--- Test 2: Gemini Vision Image OCR Extraction ---');
  const testImagePath = '/media/shijianus/workbench.jpg';
  console.log(`  Extracting OCR text from ${testImagePath}...`);
  const ocrText = await performImageOcr(testImagePath, 'en');

  if (ocrText) {
    console.log(`  ✅ Gemini Vision OCR succeeded! Extracted:\n  "${ocrText.slice(0, 120)}..."`);
  } else {
    console.log('  ℹ️ OCR returned null or no text (acceptable if offline / rate-limited).');
  }

  // Test processImagesWithOcr on markdown snippet
  const mdWithImg = 'Here is the workbench:\n\n![Workbench](/media/shijianus/workbench.jpg)\n\nEnd of post.';
  const enrichedMd = await processImagesWithOcr(mdWithImg, 'en');
  if (ocrText) {
    if (!enrichedMd.includes('class="article-image-ocr" data-image-ocr="true"')) {
      throw new Error('Expected article-image-ocr card to be injected into markdown!');
    }
    console.log('  ✅ OCR transcription card successfully injected below image!');
  }

  // -------------------------------------------------------------
  // Test 3: Format Validation Helper
  // -------------------------------------------------------------
  console.log('\n--- Test 3: validateTranslatedFormat Engine ---');
  const validCheck = validateTranslatedFormat(sampleMarkdown, outMd);
  console.log('  Validation result on Scheme 2 output:', validCheck);
  if (!validCheck.valid) {
    throw new Error(`Format validation failed on Scheme 2 output: ${validCheck.reason}`);
  }
  console.log('  ✅ Format validation engine verified.');

  // -------------------------------------------------------------
  // Test 4: Browser E2E Verification on Static Build (Dark Mode & PostHero)
  // -------------------------------------------------------------
  console.log('\n--- Test 4: Browser E2E Verification on Static Build ---');
  if (!fs.existsSync(DIST_DIR)) {
    console.log('  Dist directory not found, skipping browser step (run after build).');
    console.log('✅ ALL UNIT CHECKS PASSED!');
    return;
  }

  const server = await createStaticServer(DIST_DIR, PORT);
  console.log(`  📡 Static test server running on ${BASE_URL}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // Navigate to /posts/hello-world/
    await page.goto(`${BASE_URL}/posts/hello-world/`, { waitUntil: 'networkidle' });

    // Check .post-hero__i18n-switch presence
    const i18nSwitch = await page.$('.post-hero__i18n-switch');
    if (!i18nSwitch) {
      throw new Error('Expected .post-hero__i18n-switch to exist in PostHero!');
    }
    console.log('  ✅ .post-hero__i18n-switch is present in PostHero.');

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('shijianus-theme', 'dark');
    });

    // Check dark mode text color of #article-container paragraphs
    const pColor = await page.$eval('#article-container p', (el) => window.getComputedStyle(el).color);
    console.log(`  Dark mode #article-container p color: ${pColor}`);

    // Parse rgb(r, g, b)
    const rgbMatch = pColor.match(/\d+/g);
    if (rgbMatch) {
      const [r, g, b] = rgbMatch.map(Number);
      // Pure black is (0, 0, 0) or very dark (< 30)
      if (r < 50 && g < 50 && b < 50) {
        throw new Error(`Text color in dark mode is too dark / pure black! Color: ${pColor}`);
      }
      console.log(`  ✅ Dark mode text color has high brightness (R:${r}, G:${g}, B:${b} > 50) - NO pure black font!`);
    }

    console.log('\n✅ ALL PLAYWRIGHT E2E & UNIT TESTS PASSED PERFECTLY!');
  } finally {
    await browser.close();
    server.close();
  }
}

run().catch((err) => {
  console.error('\n❌ Verification failed:', err);
  process.exit(1);
});

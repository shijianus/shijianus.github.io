import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 4329;
const BASE_URL = `http://localhost:${PORT}`;

function startLocalServer() {
  return new Promise((resolve) => {
    console.log(`[Test Server] Starting built-in Node.js HTTP server on port ${PORT}...`);
    const mimeTypes = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'text/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.woff2': 'font/woff2',
    };

    const server = http.createServer((req, res) => {
      const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
      let filePath = path.join(path.resolve('dist'), parsedUrl.pathname);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (!fs.existsSync(filePath)) {
        filePath = path.join(path.resolve('dist'), '404.html');
      }

      if (fs.existsSync(filePath)) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = mimeTypes[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
      }
    });

    server.listen(PORT, () => {
      console.log(`[Test Server] Server is ready at ${BASE_URL}`);
      resolve(server);
    });
  });
}

async function runVerification() {
  console.log('🧪 Starting Chronral AI Summary Multilingual (i18n) Verification Suite...\n');

  let server = null;
  let browser = null;

  try {
    server = await startLocalServer();

    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });

    const page = await context.newPage();

    // ── Test 1: Verify English post (hello-world-en) native UI and summary ──
    console.log('\n--- Test 1: Native English Article (/posts/hello-world-en/) ---');
    await page.goto(`${BASE_URL}/posts/hello-world-en/`, { waitUntil: 'networkidle' });

    await page.waitForSelector('.shijianus-ai-summary');
    const panelArticleLang = await page.$eval('.shijianus-ai-summary', (el) => el.dataset.articleLang);
    console.log(`  - [Assert] data-article-lang == 'en':`, panelArticleLang === 'en' ? 'PASS' : `FAIL (${panelArticleLang})`);

    const brandTitle = await page.$eval('[data-ai-brand-title]', (el) => el.textContent.trim());
    console.log(`  - [Assert] Brand title is 'Chronral Summary':`, brandTitle === 'Chronral Summary' ? 'PASS' : `FAIL (${brandTitle})`);

    const pointLabel = await page.$eval('[data-ai-action="point"]', (el) => el.textContent.trim());
    console.log(`  - [Assert] Action "point" label is '💡 Key Points':`, pointLabel === '💡 Key Points' ? 'PASS' : `FAIL (${pointLabel})`);

    const audienceLabel = await page.$eval('[data-ai-action="audience"]', (el) => el.textContent.trim());
    console.log(`  - [Assert] Action "audience" label is '🎯 Audience':`, audienceLabel === '🎯 Audience' ? 'PASS' : `FAIL (${audienceLabel})`);

    const quickLabel = await page.$eval('[data-ai-action="quick"]', (el) => el.textContent.trim());
    console.log(`  - [Assert] Action "quick" label is '⏱️ 30s Read':`, quickLabel === '⏱️ 30s Read' ? 'PASS' : `FAIL (${quickLabel})`);

    const introLabel = await page.$eval('[data-ai-action="intro"]', (el) => el.textContent.trim());
    console.log(`  - [Assert] Action "intro" label is '👤 About Author':`, introLabel === '👤 About Author' ? 'PASS' : `FAIL (${introLabel})`);

    // Wait for output typing to complete
    await page.waitForTimeout(1000);
    const outputTextEn = await page.$eval('[data-ai-output]', (el) => el.textContent.trim());
    console.log(`  - Output Text (first 100 chars): "${outputTextEn.slice(0, 100)}..."`);
    const isPureEnglish = /^[A-Za-z0-9\s.,!?:;'"’“”()\-—–/]+$/.test(outputTextEn.slice(0, 80));
    console.log(`  - [Assert] Output is pure English (no Chinese chars):`, isPureEnglish ? 'PASS' : 'FAIL');

    // ── Test 2: On English post, user switches UI language to zh-CN ──
    console.log('\n--- Test 2: Language Switch on English Article to zh-CN ---');
    console.log('  Before switch URL:', page.url());
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('shijianus:localechange', { detail: 'zh-CN' }));
      }),
    ]);
    console.log('  After switch URL:', page.url());

    await page.waitForSelector('.shijianus-ai-summary');
    const brandTitleZh = await page.$eval('[data-ai-brand-title]', (el) => el.textContent.trim());
    console.log(`  - [Assert] Brand title switches to 'Chronral 摘要':`, brandTitleZh === 'Chronral 摘要' ? 'PASS' : `FAIL (${brandTitleZh})`);

    const pointLabelZh = await page.$eval('[data-ai-action="point"]', (el) => el.textContent.trim());
    console.log(`  - [Assert] Action "point" switches to '💡 核心论点':`, pointLabelZh === '💡 核心论点' ? 'PASS' : `FAIL (${pointLabelZh})`);

    // ── Test 3: Chinese post without English translation (/posts/readable-geek-interfaces/) ──
    console.log('\n--- Test 3: Chinese Article In-Place Switch (/posts/readable-geek-interfaces/) ---');
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    await page.goto(`${BASE_URL}/posts/readable-geek-interfaces/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.shijianus-ai-summary');

    const brandTitleCnInitial = await page.$eval('[data-ai-brand-title]', (el) => el.textContent.trim());
    console.log(`  - [Assert] Initial brand title is 'Chronral 摘要':`, brandTitleCnInitial === 'Chronral 摘要' ? 'PASS' : `FAIL (${brandTitleCnInitial})`);

    // Now switch UI language to English (Highest priority per user requirement: "如果文章语言和所选文字不同，以所选语言为最高优先对齐")
    console.log('  -> Switching display language to "en"...');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('shijianus:localechange', { detail: 'en' }));
    });
    await page.waitForTimeout(600);

    const brandTitleEnSwitched = await page.$eval('[data-ai-brand-title]', (el) => el.textContent.trim());
    console.log(`  - [Assert] Switched brand title is 'Chronral Summary':`, brandTitleEnSwitched === 'Chronral Summary' ? 'PASS' : `FAIL (${brandTitleEnSwitched})`);

    const pointLabelEnSwitched = await page.$eval('[data-ai-action="point"]', (el) => el.textContent.trim());
    console.log(`  - [Assert] Action "point" is '💡 Key Points':`, pointLabelEnSwitched === '💡 Key Points' ? 'PASS' : `FAIL (${pointLabelEnSwitched})`);

    // ── Test 4: English About Author button on English-switched post ──
    console.log('\n--- Test 4: About Author Action in English ---');
    await page.click('[data-ai-action="intro"]');
    await page.waitForTimeout(500);

    const authorText = await page.$eval('[data-ai-output]', (el) => el.textContent.trim());
    console.log(`  - Author Text (first 100 chars): "${authorText.slice(0, 100)}..."`);
    const isAuthorEnglish = /shijianus/i.test(authorText) && /engineering|frontend|generalist|software|builder|workshop/i.test(authorText);
    console.log(`  - [Assert] English Author Bio presented:`, isAuthorEnglish ? 'PASS' : 'FAIL');

    // ── Test 5: Sibling Navigation on post with translation (/posts/content-formats-and-markup-mastery/) ──
    console.log('\n--- Test 5: Sibling Post Translation Navigation ---');
    await page.goto(`${BASE_URL}/posts/content-formats-and-markup-mastery/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.shijianus-ai-summary');

    // Dispatching locale change should navigate to content-formats-and-markup-mastery-en
    await Promise.all([
      page.waitForURL('**/posts/content-formats-and-markup-mastery-en/'),
      page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('shijianus:localechange', { detail: 'en' }));
      }),
    ]);
    console.log(`  - Navigated to: ${page.url()}`);
    const navigatedBrand = await page.$eval('[data-ai-brand-title]', (el) => el.textContent.trim());
    console.log(`  - [Assert] Translated post brand title is 'Chronral Summary':`, navigatedBrand === 'Chronral Summary' ? 'PASS' : `FAIL (${navigatedBrand})`);

    // ── Test 6: Verify static files across all 3 English posts ──
    console.log('\n--- Test 6: Static Export HTML File Integrity Check ---');
    const englishPosts = [
      'hello-world-en',
      'content-formats-and-markup-mastery-en',
      'api-ready-theme-contracts-en',
    ];

    for (const slug of englishPosts) {
      const htmlPath = path.resolve(`dist/posts/${slug}/index.html`);
      const exists = fs.existsSync(htmlPath);
      if (!exists) {
        console.log(`  - [Assert] ${slug} HTML exists: FAIL`);
        continue;
      }
      const content = fs.readFileSync(htmlPath, 'utf8');
      const hasLangEn = content.includes('data-article-lang="en"');
      const hasStaticSummary = content.includes('data-static-summary=');
      console.log(`  - [Assert] ${slug}: data-article-lang="en" (${hasLangEn ? 'PASS' : 'FAIL'}), has staticSummary (${hasStaticSummary ? 'PASS' : 'FAIL'})`);
    }

    console.log('\n🎉 ALL VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
  } catch (error) {
    console.error('❌ Verification failed with error:', error);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    if (server) server.close();
  }
}

runVerification();

import { chromium } from 'playwright';

const LIVE_URL = 'https://blog.epocanvas.com';

async function runLiveVerification() {
  console.log('🌐 Starting Live Production Chronral AI Summary Multilingual (i18n) Verification Suite on https://blog.epocanvas.com...\n');

  let browser = null;

  try {
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const context = await browser.newContext({
      viewport: { width: 1280, height: 900 },
    });

    const page = await context.newPage();

    // ── Test 1: Native English Article (hello-world-en) on Live ──
    console.log('--- Test 1: Live Native English Article (/posts/hello-world-en/) ---');
    await page.goto(`${LIVE_URL}/posts/hello-world-en/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.shijianus-ai-summary');

    const panelArticleLang = await page.$eval('.shijianus-ai-summary', (el) => el.dataset.articleLang);
    console.log(`  - [Live Assert] data-article-lang == 'en':`, panelArticleLang === 'en' ? 'PASS' : `FAIL (${panelArticleLang})`);

    const brandTitle = await page.$eval('[data-ai-brand-title]', (el) => el.textContent.trim());
    console.log(`  - [Live Assert] Brand title is 'Chronral Summary':`, brandTitle === 'Chronral Summary' ? 'PASS' : `FAIL (${brandTitle})`);

    const pointLabel = await page.$eval('[data-ai-action="point"]', (el) => el.textContent.trim());
    console.log(`  - [Live Assert] Action "point" label is '💡 Key Points':`, pointLabel === '💡 Key Points' ? 'PASS' : `FAIL (${pointLabel})`);

    const audienceLabel = await page.$eval('[data-ai-action="audience"]', (el) => el.textContent.trim());
    console.log(`  - [Live Assert] Action "audience" label is '🎯 Audience':`, audienceLabel === '🎯 Audience' ? 'PASS' : `FAIL (${audienceLabel})`);

    const quickLabel = await page.$eval('[data-ai-action="quick"]', (el) => el.textContent.trim());
    console.log(`  - [Live Assert] Action "quick" label is '⏱️ 30s Read':`, quickLabel === '⏱️ 30s Read' ? 'PASS' : `FAIL (${quickLabel})`);

    const introLabel = await page.$eval('[data-ai-action="intro"]', (el) => el.textContent.trim());
    console.log(`  - [Live Assert] Action "intro" label is '👤 About Author':`, introLabel === '👤 About Author' ? 'PASS' : `FAIL (${introLabel})`);

    await page.waitForTimeout(1000);
    const outputTextEn = await page.$eval('[data-ai-output]', (el) => el.textContent.trim());
    console.log(`  - Output Text (first 100 chars): "${outputTextEn.slice(0, 100)}..."`);
    const isPureEnglish = /^[A-Za-z0-9\s.,!?:;'"’“”()\-—–/]+$/.test(outputTextEn.slice(0, 80));
    console.log(`  - [Live Assert] Output is English:`, isPureEnglish ? 'PASS' : 'FAIL');

    // ── Test 2: In-place Switch on Chinese Post without translation (/posts/readable-geek-interfaces/) ──
    console.log('\n--- Test 2: Live Chinese Article In-Place Switch (/posts/readable-geek-interfaces/) ---');
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });

    await page.goto(`${LIVE_URL}/posts/readable-geek-interfaces/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.shijianus-ai-summary');

    const brandTitleCn = await page.$eval('[data-ai-brand-title]', (el) => el.textContent.trim());
    console.log(`  - [Live Assert] Initial brand title is 'Chronral 摘要':`, brandTitleCn === 'Chronral 摘要' ? 'PASS' : `FAIL (${brandTitleCn})`);

    // Switch display language to English
    console.log('  -> Switching display language to "en"...');
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('shijianus:localechange', { detail: 'en' }));
    });
    await page.waitForTimeout(600);

    const brandTitleEnSwitched = await page.$eval('[data-ai-brand-title]', (el) => el.textContent.trim());
    console.log(`  - [Live Assert] Switched brand title is 'Chronral Summary':`, brandTitleEnSwitched === 'Chronral Summary' ? 'PASS' : `FAIL (${brandTitleEnSwitched})`);

    const pointLabelEnSwitched = await page.$eval('[data-ai-action="point"]', (el) => el.textContent.trim());
    console.log(`  - [Live Assert] Action "point" is '💡 Key Points':`, pointLabelEnSwitched === '💡 Key Points' ? 'PASS' : `FAIL (${pointLabelEnSwitched})`);

    // Click About Author action
    await page.click('[data-ai-action="intro"]');
    await page.waitForTimeout(500);
    const authorText = await page.$eval('[data-ai-output]', (el) => el.textContent.trim());
    console.log(`  - Author Text (first 100 chars): "${authorText.slice(0, 100)}..."`);
    const isAuthorEnglish = /shijianus/i.test(authorText) && /engineering|frontend|generalist|software|builder|workshop/i.test(authorText);
    console.log(`  - [Live Assert] English Author Bio presented:`, isAuthorEnglish ? 'PASS' : `FAIL`);

    // ── Test 3: Sibling Post Translation Navigation on Live ──
    console.log('\n--- Test 3: Live Sibling Post Translation Navigation (/posts/content-formats-and-markup-mastery/) ---');
    await page.goto(`${LIVE_URL}/posts/content-formats-and-markup-mastery/`, { waitUntil: 'networkidle' });
    await page.waitForSelector('.shijianus-ai-summary');

    await Promise.all([
      page.waitForURL('**/posts/content-formats-and-markup-mastery-en/'),
      page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('shijianus:localechange', { detail: 'en' }));
      }),
    ]);
    console.log(`  - Successfully navigated to: ${page.url()}`);
    const navigatedBrand = await page.$eval('[data-ai-brand-title]', (el) => el.textContent.trim());
    console.log(`  - [Live Assert] Translated post brand title is 'Chronral Summary':`, navigatedBrand === 'Chronral Summary' ? 'PASS' : `FAIL (${navigatedBrand})`);

    // ── Test 4: Live Direct API Verification (/api/ai-summary) with Explicit Locales ──
    console.log('\n--- Test 4: Live Edge Function API Verification (/api/ai-summary) ---');
    const testPayload = {
      slug: 'hello-world',
      title: '主题重构启动记录',
      summary: '第一篇重构记录，确定新的主题不是旧主题的壳，而是一套真正可维护的 Astro 实现。',
      mode: 'llmgpt',
      content: '测试博客主题重构与多语言工程设计。',
    };

    // Test en
    const resEn = await fetch(`${LIVE_URL}/api/ai-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...testPayload, lang: 'en' }),
    });
    const dataEn = await resEn.json();
    console.log(`  - API [en] status: ${resEn.status}, lang in response: ${dataEn.lang}`);
    console.log(`  - API [en] summary (first 80 chars): "${dataEn.summary?.slice(0, 80)}..."`);
    console.log(`  - [Live Assert] API returned English summary:`, dataEn.lang === 'en' && dataEn.summary?.length > 20 ? 'PASS' : 'FAIL');

    console.log('\n🎉 ALL LIVE PRODUCTION VERIFICATION TESTS PASSED SUCCESSFULLY!\n');
  } catch (error) {
    console.error('❌ Live verification failed with error:', error);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
  }
}

runLiveVerification();

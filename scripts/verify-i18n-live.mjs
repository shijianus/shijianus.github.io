#!/usr/bin/env node
/**
 * MCP Playwright Live E2E Verification
 * Target: https://blog.epocanvas.com/posts/content-formats-and-markup-mastery/
 * Requirements:
 * 1. AI Multilingual translations exist and are complete (not truncated).
 * 2. .post-hero__i18n-switch is DELETED (no language switcher buttons on post hero).
 * 3. Interface language selected in .account-card exclusively dictates article display language.
 * 4. NO "AI翻译" or "AI 翻译" labels/badges anywhere on articles.
 * 5. Homepage feed deduplication prevents translated articles from appearing as duplicate cards.
 */
import { chromium } from 'playwright';

const BASE_URL = 'https://blog.epocanvas.com';
const ZH_PATH = '/posts/content-formats-and-markup-mastery/';

async function run() {
  console.log('[MCP-i18n-E2E] 🚀 Starting live Cloudflare Pages Playwright E2E verification...');
  console.log(`[MCP-i18n-E2E] 🌐 Target: ${BASE_URL + ZH_PATH}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (compatible; Playwright/1.0; E2E-i18n-Audit)',
  });
  const page = await context.newPage();

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // ─────────────────────────────────────────────────────
    // Test 1: Load Chinese article & verify no .post-hero__i18n-switch
    // ─────────────────────────────────────────────────────
    console.log('\n─── Test 1: ZH article loads & .post-hero__i18n-switch is absent ───');
    await page.goto(BASE_URL + ZH_PATH, { waitUntil: 'networkidle', timeout: 30000 });

    const zhTitle = await page.$eval('h1', (el) => el.textContent?.trim() ?? '');
    console.log(`  ZH Title: "${zhTitle.slice(0, 60)}..."`);
    assert(
      zhTitle.includes('静态站点') || zhTitle.includes('SSG') || zhTitle.includes('内容格式'),
      `Chinese article title loads correctly (got: "${zhTitle.slice(0, 60)}")`
    );

    // Requirement 2: .post-hero__i18n-switch MUST NOT exist
    const heroSwitcher = await page.$('.post-hero__i18n-switch');
    assert(heroSwitcher === null, 'Article language switcher (.post-hero__i18n-switch) is completely removed from PostHero');

    const heroPills = await page.$$('.post-hero__i18n-pill');
    assert(heroPills.length === 0, 'No .post-hero__i18n-pill buttons found in DOM');

    // Requirement 3: NO "AI翻译" badge or label
    const allBadgesText = await page.$$eval('.post-hero__badge, .post-hero__tag, span, div', (els) =>
      els.filter((el) => el.children.length === 0).map((el) => el.textContent?.trim() ?? '')
    );
    const hasAiBadge = allBadgesText.some((t) => t === 'AI翻译' || t === 'AI 翻译' || t === '· AI 翻译');
    assert(!hasAiBadge, 'No "AI翻译" label/badge on the article');

    // Helper: open account card settings and switch locale
    async function switchLocaleViaAccountCard(localeLabel, expectedUrlPart) {
      await page.evaluate(() => {
        window.dispatchEvent(new CustomEvent('shijianus:open-account', { detail: { tab: 'settings' } }));
      });
      await page.waitForTimeout(800);

      const btn = page.locator('.account-locale-btn', { hasText: localeLabel }).first();
      const count = await btn.count();
      assert(count > 0, `Found "${localeLabel}" button in .account-card`);

      if (count > 0) {
        await btn.click();
        await page.waitForURL(expectedUrlPart, { timeout: 15000 });
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
      }
    }

    // ─────────────────────────────────────────────────────
    // Test 2: Switch to English via .account-card
    // ─────────────────────────────────────────────────────
    console.log('\n─── Test 2: Switch to English via .account-card ───');
    await switchLocaleViaAccountCard('English', /content-formats-and-markup-mastery-en/);
    console.log(`  Navigated to: ${page.url()}`);
    assert(page.url().includes('content-formats-and-markup-mastery-en'), 'Auto-navigated to EN article slug');

    const enTitle = await page.$eval('h1', (el) => el.textContent?.trim() ?? '');
    console.log(`  EN Title: "${enTitle.slice(0, 80)}"`);
    assert(/[a-zA-Z]{4,}/.test(enTitle), 'EN article has English title');

    const enBodyText = await page.$eval('#article-container', (el) => el.innerText || el.textContent || '');
    console.log(`  EN Body Length: ${enBodyText.length} characters`);
    assert(enBodyText.length > 20000, `EN body is complete and extensive (>20,000 chars, got ${enBodyText.length})`);

    const blockquotes = await page.$$eval('blockquote', (els) => els.map((el) => el.textContent?.trim() ?? ''));
    const hasTruncationNotice = blockquotes.some((b) => b.includes('partial translation') || b.includes('Partial translation'));
    assert(!hasTruncationNotice, 'No truncation notice found — article is 100% complete');

    const enSwitcher = await page.$('.post-hero__i18n-switch');
    assert(enSwitcher === null, 'No .post-hero__i18n-switch on EN article page');

    // ─────────────────────────────────────────────────────
    // Test 3: Switch to Traditional Chinese (zh-Hant) in .account-card
    // ─────────────────────────────────────────────────────
    console.log('\n─── Test 3: Switch to Traditional Chinese in .account-card ───');
    await switchLocaleViaAccountCard('繁體中文', /content-formats-and-markup-mastery-zh-hant/);
    console.log(`  Navigated to: ${page.url()}`);
    assert(page.url().includes('content-formats-and-markup-mastery-zh-hant'), 'Auto-navigated to zh-Hant article slug');

    const hantTitle = await page.$eval('h1', (el) => el.textContent?.trim() ?? '');
    console.log(`  zh-Hant Title: "${hantTitle.slice(0, 80)}"`);
    assert(hantTitle.includes('靜態') || hantTitle.includes('格式') || hantTitle.includes('排版') || hantTitle.includes('SSG'), 'zh-Hant article title is present');

    const hantBodyText = await page.$eval('#article-container', (el) => el.innerText || el.textContent || '');
    console.log(`  zh-Hant Body Length: ${hantBodyText.length} characters`);
    assert(hantBodyText.length > 10000, `zh-Hant body is complete (>10,000 chars, got ${hantBodyText.length})`);

    // ─────────────────────────────────────────────────────
    // Test 4: Switch to French (fr) in .account-card
    // ─────────────────────────────────────────────────────
    console.log('\n─── Test 4: Switch to French in .account-card ───');
    await switchLocaleViaAccountCard('Français', /content-formats-and-markup-mastery-fr/);
    console.log(`  Navigated to: ${page.url()}`);
    assert(page.url().includes('content-formats-and-markup-mastery-fr'), 'Auto-navigated to fr article slug');

    const frTitle = await page.$eval('h1', (el) => el.textContent?.trim() ?? '');
    console.log(`  French Title: "${frTitle.slice(0, 80)}"`);
    assert(frTitle.includes('Guide') || frTitle.includes('statiques') || /[a-zA-Z]{4,}/.test(frTitle), 'French article title is present');

    const frBodyText = await page.$eval('#article-container', (el) => el.innerText || el.textContent || '');
    console.log(`  French Body Length: ${frBodyText.length} characters`);
    assert(frBodyText.length > 20000, `French body is complete (>20,000 chars, got ${frBodyText.length})`);

    // ─────────────────────────────────────────────────────
    // Test 5: Switch to German (de) in .account-card
    // ─────────────────────────────────────────────────────
    console.log('\n─── Test 5: Switch to German in .account-card ───');
    await switchLocaleViaAccountCard('Deutsch', /content-formats-and-markup-mastery-de/);
    console.log(`  Navigated to: ${page.url()}`);
    assert(page.url().includes('content-formats-and-markup-mastery-de'), 'Auto-navigated to de article slug');

    const deTitle = await page.$eval('h1', (el) => el.textContent?.trim() ?? '');
    console.log(`  German Title: "${deTitle.slice(0, 80)}"`);
    assert(deTitle.includes('Leitfaden') || deTitle.includes('statische') || /[a-zA-Z]{4,}/.test(deTitle), 'German article title is present');

    const deBodyText = await page.$eval('#article-container', (el) => el.innerText || el.textContent || '');
    console.log(`  German Body Length: ${deBodyText.length} characters`);
    assert(deBodyText.length > 15000, `German body is complete (>15,000 chars, got ${deBodyText.length})`);

    // ─────────────────────────────────────────────────────
    // Test 6: Switch to Spanish (es) in .account-card
    // ─────────────────────────────────────────────────────
    console.log('\n─── Test 6: Switch to Spanish in .account-card ───');
    await switchLocaleViaAccountCard('Español', /content-formats-and-markup-mastery-es/);
    console.log(`  Navigated to: ${page.url()}`);
    assert(page.url().includes('content-formats-and-markup-mastery-es'), 'Auto-navigated to es article slug');

    const esTitle = await page.$eval('h1', (el) => el.textContent?.trim() ?? '');
    console.log(`  Spanish Title: "${esTitle.slice(0, 80)}"`);
    assert(esTitle.includes('Guía') || esTitle.includes('sitios') || /[a-zA-Z]{4,}/.test(esTitle), 'Spanish article title is present');

    const esBodyText = await page.$eval('#article-container', (el) => el.innerText || el.textContent || '');
    console.log(`  Spanish Body Length: ${esBodyText.length} characters`);
    assert(esBodyText.length > 20000, `Spanish body is complete (>20,000 chars, got ${esBodyText.length})`);

    // ─────────────────────────────────────────────────────
    // Test 7: Switch back to Simplified Chinese (zh-CN)
    // ─────────────────────────────────────────────────────
    console.log('\n─── Test 7: Switch back to Simplified Chinese in .account-card ───');
    await switchLocaleViaAccountCard('简体中文', /content-formats-and-markup-mastery\/?$/);
    console.log(`  Navigated back to: ${page.url()}`);
    assert(!page.url().includes('-es') && !page.url().includes('-de') && !page.url().includes('-fr') && !page.url().includes('-en') && !page.url().includes('-zh-hant'), 'Returned to main Chinese URL');

    const restoredTitle = await page.$eval('h1', (el) => el.textContent?.trim() ?? '');
    assert(
      restoredTitle.includes('静态站点') || restoredTitle.includes('SSG'),
      `Chinese title restored (got: "${restoredTitle.slice(0, 60)}")`
    );

    // ─────────────────────────────────────────────────────
    // Test 8: Homepage deduplication check
    // ─────────────────────────────────────────────────────
    console.log('\n─── Test 8: Homepage deduplication check ───');
    await page.goto(BASE_URL + '/', { waitUntil: 'networkidle', timeout: 30000 });
    const allLinks = await page.$$eval('a[href*="/posts/"]', (els) => els.map((el) => el.getAttribute('href') ?? ''));
    const transVariants = allLinks.filter((l) =>
      l.includes('-en') || l.includes('-fr') || l.includes('-es') || l.includes('-de') || l.includes('-zh-hant')
    );
    console.log(`  Translated variant links found in post feed: ${JSON.stringify(transVariants)}`);
    assert(transVariants.length === 0, `Translated variants do NOT appear as duplicate cards in post feed (dedup working)`);

  } finally {
    await browser.close();
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`[MCP-i18n-E2E] Results: ${passed} passed, ${failed} failed`);
  if (failed === 0) {
    console.log('[MCP-i18n-E2E] ✅ ALL LIVE SITE MULTILINGUAL i18n VERIFICATION TESTS PASSED!');
  } else {
    console.error('[MCP-i18n-E2E] ❌ Some tests failed. See above for details.');
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('[MCP-i18n-E2E] 💥 Fatal error:', err);
  process.exit(1);
});

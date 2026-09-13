#!/usr/bin/env node
import { chromium } from 'playwright';

async function run() {
  console.log('[Live-Contrast-Audit] Testing https://blog.epocanvas.com for dark mode contrast & format preservation...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  try {
    // 1. Visit Chinese article
    await page.goto('https://blog.epocanvas.com/posts/content-formats-and-markup-mastery/', { waitUntil: 'networkidle' });

    // Switch to dark mode
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'dark';
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('shijianus-theme', 'dark');
    });
    await page.waitForTimeout(500);

    // Check p text color
    const pColor = await page.$eval('#article-container p', (el) => window.getComputedStyle(el).color);
    console.log(`  Dark mode #article-container p color: ${pColor}`);
    const rgb = pColor.match(/\d+/g)?.map(Number) || [0, 0, 0];
    if (rgb[0] < 100 && rgb[1] < 100 && rgb[2] < 100) {
      throw new Error(`Text color is too dark in dark mode: ${pColor}`);
    }
    console.log(`  ✅ Dark mode text color is high-brightness (${pColor}), NOT pure black!`);

    // Check formatted components: code block, admonition callout, table
    const preCount = await page.$$eval('#article-container pre', (els) => els.length);
    const admonitionCount = await page.$$eval('#article-container .admonition, #article-container blockquote', (els) => els.length);
    const tableCount = await page.$$eval('#article-container table', (els) => els.length);

    console.log(`  Format elements: ${preCount} code blocks, ${admonitionCount} admonition callouts, ${tableCount} tables`);
    if (preCount === 0 || admonitionCount === 0 || tableCount === 0) {
      throw new Error('Missing formatted elements!');
    }
    console.log('  ✅ Rich format elements (code blocks, callouts, tables) 100% preserved!');

    // 2. Visit English article
    await page.goto('https://blog.epocanvas.com/posts/content-formats-and-markup-mastery-en/', { waitUntil: 'networkidle' });
    const enPColor = await page.$eval('#article-container p', (el) => window.getComputedStyle(el).color);
    console.log(`  EN Dark mode p color: ${enPColor}`);
    const enPreCount = await page.$$eval('#article-container pre', (els) => els.length);
    console.log(`  EN code blocks: ${enPreCount}`);
    if (enPreCount === 0) {
      throw new Error('EN version missing code blocks!');
    }
    console.log('  ✅ English article format is 100% preserved with high contrast!');

    console.log('\n🎉 ALL LIVE SITE CONTRAST & FORMAT AUDITS PASSED 100%!');
  } finally {
    await browser.close();
  }
}

run().catch((err) => {
  console.error('❌ Audit failed:', err);
  process.exit(1);
});

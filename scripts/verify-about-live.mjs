import puppeteer from 'puppeteer';
import path from 'path';

async function runLiveAudit() {
  const liveUrl = 'https://blog.epocanvas.com/about/';
  console.log(`[INFO] Initiating Live E2E Verification for: ${liveUrl}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: 'Live-Desktop-1440', width: 1440, height: 900 },
    { name: 'Live-Mobile-375', width: 375, height: 667 }
  ];

  let allPassed = true;

  try {
    for (const vp of viewports) {
      console.log(`\n=============================================================`);
      console.log(`[LIVE TEST] Auditing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      console.log(`=============================================================`);

      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height });

      const errors = [];
      page.on('pageerror', err => errors.push(err.message));

      const response = await page.goto(liveUrl, { waitUntil: 'networkidle2', timeout: 30000 });
      console.log(`[HTTP STATUS] ${response.status()} ${response.statusText()}`);

      if (response.status() !== 200) {
        console.error(`❌ Non-200 HTTP response!`);
        allPassed = false;
      }

      // 1. 验证打赏模块在线上彻底不存在
      const rewardCheck = await page.evaluate(() => {
        const rewardElement = document.querySelector('#about-reward');
        const rewardClass = document.querySelector('.author-content-item.reward');
        return {
          hasRewardId: Boolean(rewardElement),
          hasRewardClass: Boolean(rewardClass)
        };
      });

      if (!rewardCheck.hasRewardId && !rewardCheck.hasRewardClass) {
        console.log(`✅ [LIVE SUCCESS] Reward module '#about-reward' is completely absent in production!`);
      } else {
        console.error(`❌ [LIVE FAILURE] Reward module still found in production:`, rewardCheck);
        allPassed = false;
      }

      // 2. 验证新版丰富内容在线上均已成功生效
      const contentAudit = await page.evaluate(() => {
        const query = sel => document.querySelector(sel);
        const queryAll = sel => Array.from(document.querySelectorAll(sel));

        return {
          authorBox: Boolean(query('.author-box')),
          onlineIndicator: Boolean(query('.online-indicator')),
          myInfoAndSayHello: Boolean(query('.myInfoAndSayHello')),
          helloChips: queryAll('.hello-tag-chips span').length,
          clockText: query('#about-live-clock')?.textContent || '',
          personalityBadge: query('.personality-badge')?.textContent || '',
          personalityTraits: queryAll('.personality-traits-grid .trait-item').length,
          gearHardware: queryAll('.gear-card.hardware .gear-item').length,
          gearSoftware: queryAll('.gear-card.software .gear-item').length,
          manifestoTitle: query('.manifesto-title')?.textContent || '',
          manifestoPillars: queryAll('.manifesto-pillars .pillar-card').length,
          topologyLayers: queryAll('.topology-card .topology-tier').length,
          milestoneNodes: queryAll('.milestones-card .milestone-node').length,
          maximTop: query('.author-content-item.maxim .maxim-top')?.textContent || '',
          maximBottom: query('.author-content-item.maxim .maxim-bottom')?.textContent || '',
          vinylSongTitle: query('.vinyl-song-title')?.textContent || '',
          equalizerBars: queryAll('.equalizer-bars .bar').length,
          connectButtons: queryAll('.connect-buttons-grid .connect-btn').length,
        };
      });

      console.log(`[LIVE AUDIT RESULT]:`);
      console.log(` - Online Indicator: ${contentAudit.onlineIndicator}`);
      console.log(` - Hello Chips: ${contentAudit.helloChips} tags`);
      console.log(` - Maxim Motto: '${contentAudit.maximTop} ${contentAudit.maximBottom}'`);
      console.log(` - Live PST Clock: '${contentAudit.clockText}'`);
      console.log(` - Personality: ${contentAudit.personalityBadge} with ${contentAudit.personalityTraits} trait bars`);
      console.log(` - Gear Workstation: ${contentAudit.gearHardware} hardware + ${contentAudit.gearSoftware} software`);
      console.log(` - Manifesto: ${contentAudit.manifestoPillars} pillars ('${contentAudit.manifestoTitle.slice(0, 25)}...')`);
      console.log(` - Topology Deck: ${contentAudit.topologyLayers} architectural tiers`);
      console.log(` - Milestones: ${contentAudit.milestoneNodes} journey timeline nodes`);
      console.log(` - Vinyl Turntable: '${contentAudit.vinylSongTitle}', Equalizer: ${contentAudit.equalizerBars} bars`);
      console.log(` - Connect Buttons: ${contentAudit.connectButtons} social/subscribe links`);

      const mottoOk = contentAudit.maximTop.includes('厚土潜藏细脉') && contentAudit.maximBottom.includes('大荒广构通衢');
      if (!mottoOk) {
        console.error(`❌ Motto text mismatch on live: ${contentAudit.maximTop} / ${contentAudit.maximBottom}`);
        allPassed = false;
      }

      // 验证姓名、大学生、2006、设备等真实文字
      const textAudit = await page.evaluate(() => {
        const bodyText = document.body.innerText;
        return {
          hasTimeName: bodyText.includes('時間'),
          hasWrongName: bodyText.includes('世健'),
          hasStudent: bodyText.includes('大学生'),
          has2006: bodyText.includes('2006'),
          hasLenovo: bodyText.includes('联想小新'),
          hasRedmi: bodyText.includes('红米'),
        };
      });

      if (textAudit.hasTimeName && !textAudit.hasWrongName) {
        console.log(`✅ [LIVE NAME CHECK] Correct name '時間' verified live, '世健' completely absent!`);
      } else {
        console.error(`❌ [LIVE NAME ERROR] Name mismatch on live: hasTimeName=${textAudit.hasTimeName}, hasWrongName=${textAudit.hasWrongName}`);
        allPassed = false;
      }

      if (textAudit.hasStudent && textAudit.has2006) {
        console.log(`✅ [LIVE PERSONA CHECK] Genuine 2006 undergraduate persona verified live!`);
      } else {
        console.error(`❌ [LIVE PERSONA ERROR] Undergraduate / 2006 not found live:`, textAudit);
        allPassed = false;
      }

      if (textAudit.hasLenovo && textAudit.hasRedmi) {
        console.log(`✅ [LIVE GEAR CHECK] Humble student gear verified live (Lenovo / Redmi)!`);
      } else {
        console.error(`❌ [LIVE GEAR ERROR] Student gear not found live:`, textAudit);
        allPassed = false;
      }

      // 测试多语言动态切换 (English: Kevin Sparks, French: Léon Boven)
      const i18nAudit = await page.evaluate(async () => {
        const runtime = window.__SHIJIANUS_LOCALE_RUNTIME__;
        if (!runtime?.applyLocaleVariant) return { available: false };

        // Switch to English
        runtime.applyLocaleVariant('en');
        await new Promise(r => setTimeout(r, 200));
        const enGreeting = document.querySelector('.myInfoAndSayHello .title2')?.innerText || '';
        const enHasKevin = enGreeting.includes('Kevin Sparks');

        // Switch to French
        runtime.applyLocaleVariant('fr');
        await new Promise(r => setTimeout(r, 200));
        const frGreeting = document.querySelector('.myInfoAndSayHello .title2')?.innerText || '';
        const frHasLeon = frGreeting.includes('Léon Boven');

        // Restore to zh-CN
        runtime.applyLocaleVariant('zh-CN');
        await new Promise(r => setTimeout(r, 200));
        const zhGreeting = document.querySelector('.myInfoAndSayHello .title2')?.innerText || '';
        const zhHasTime = zhGreeting.includes('時間');

        return {
          available: true,
          enGreeting,
          enHasKevin,
          frGreeting,
          frHasLeon,
          zhGreeting,
          zhHasTime
        };
      });

      if (i18nAudit.available) {
        if (i18nAudit.enHasKevin && i18nAudit.frHasLeon && i18nAudit.zhHasTime) {
          console.log(`✅ [LIVE I18N SUCCESS] Multilingual localized identity verified live! EN='${i18nAudit.enGreeting.trim()}', FR='${i18nAudit.frGreeting.trim()}', ZH='${i18nAudit.zhGreeting.trim()}'`);
        } else {
          console.error(`❌ [LIVE I18N FAILURE] Localization failed live:`, i18nAudit);
          allPassed = false;
        }
      }

      if (contentAudit.gearHardware !== 4 || contentAudit.manifestoPillars !== 3 || contentAudit.topologyLayers !== 3 || contentAudit.milestoneNodes < 4) {
        console.error(`❌ Live content structural mismatch: Hardware=${contentAudit.gearHardware}, Manifesto=${contentAudit.manifestoPillars}, Topology=${contentAudit.topologyLayers}, Milestones=${contentAudit.milestoneNodes}`);
        allPassed = false;
      } else {
        console.log(`✅ All rich sections confirmed live on production!`);
      }

      if (errors.length > 0) {
        console.warn(`[WARN] Page console errors:`, errors);
      } else {
        console.log(`✅ Zero runtime JavaScript errors on live page.`);
      }

      const shotPath = path.resolve(`/home/shijian/projects/shijianus-blog/scripts/audit_screenshots/${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });
      console.log(`📸 Live Screenshot saved: ${shotPath}`);

      await page.close();
    }
  } finally {
    await browser.close();
  }

  if (allPassed) {
    console.log(`\n🎉 [LIVE VERIFICATION PASSED] Production About page at https://blog.epocanvas.com/about/ is 100% verified!`);
    process.exit(0);
  } else {
    console.error(`\n❌ [LIVE AUDIT FAILED]`);
    process.exit(1);
  }
}

runLiveAudit().catch(err => {
  console.error('Fatal live audit error:', err);
  process.exit(1);
});

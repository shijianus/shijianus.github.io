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

      const response = await page.goto(liveUrl, { waitUntil: 'networkidle2', timeout: 35000 });
      console.log(`[HTTP STATUS] ${response.status()} ${response.statusText()}`);

      if (response.status() !== 200) {
        console.error(`❌ Non-200 HTTP response!`);
        allPassed = false;
      }

      // 1. 验证打赏模块在线上彻底不存在
      const rewardCheck = await page.evaluate(() => {
        const rewardElement = document.querySelector('#about-reward');
        const rewardClass = document.querySelector('.author-content-item.reward');
        const rewardGeneric = document.querySelector('.reward');
        return {
          hasRewardId: Boolean(rewardElement),
          hasRewardClass: Boolean(rewardClass),
          hasRewardGeneric: Boolean(rewardGeneric)
        };
      });

      if (!rewardCheck.hasRewardId && !rewardCheck.hasRewardClass && !rewardCheck.hasRewardGeneric) {
        console.log(`✅ [LIVE SUCCESS] Reward module is completely absent in production!`);
      } else {
        console.error(`❌ [LIVE FAILURE] Reward module still found in production:`, rewardCheck);
        allPassed = false;
      }

      // 2. 验证安知鱼旧模版彻底不存在
      const anzhiyuCleanCheck = await page.evaluate(() => {
        const query = sel => document.querySelector(sel);
        return {
          hasMyInfo: Boolean(query('.myInfoAndSayHello')),
          hasAboutsiteTips: Boolean(query('.aboutsiteTips')),
          hasHelloAbout: Boolean(query('.hello-about')),
          hasGameYuanshen: Boolean(query('.game-yuanshen')),
          hasBuff: Boolean(query('.buff'))
        };
      });

      const residues = Object.entries(anzhiyuCleanCheck).filter(([_, v]) => v);
      if (residues.length === 0) {
        console.log(`✅ [LIVE SUCCESS] Zero legacy Anzhiyu templates online!`);
      } else {
        console.error(`❌ [LIVE FAILURE] Residues found online:`, residues);
        allPassed = false;
      }

      // 3. 验证新架构板块与座右铭
      const contentAudit = await page.evaluate(() => {
        const query = sel => document.querySelector(sel);
        const queryAll = sel => Array.from(document.querySelectorAll(sel));

        return {
          creatorHero: Boolean(query('.creator-hero-card')),
          creatorName: query('.creator-name')?.textContent?.trim() || '',
          mottoText: query('.creator-motto-banner .motto-text')?.textContent?.trim() || '',
          liveClock: query('#about-live-clock')?.textContent?.trim() || '',
          compassCards: queryAll('.compass-grid .compass-card').length,
          topologyTiers: queryAll('.topology-deck .topology-tier').length,
          techBlocks: queryAll('.topology-deck .tech-block').length,
          telemetryCards: queryAll('.garden-telemetry-grid .telemetry-card').length,
          manifestoTriads: queryAll('.manifesto-triad .manifesto-triad-item').length,
          gearRows: queryAll('.gear-matrix-grid .gear-row').length,
          flowCard: Boolean(query('.flow-card')),
          equalizerBars: queryAll('.flow-card .equalizer-bars .bar').length,
          milestones: queryAll('.milestones-timeline .milestone-item').length,
          inquiryChannels: queryAll('.inquiry-matrix-card .inquiry-channel-card').length
        };
      });

      console.log(`[LIVE AUDIT RESULT]:`);
      console.log(` - Creator Hero: ${contentAudit.creatorHero}, Name: '${contentAudit.creatorName}'`);
      console.log(` - Motto: '${contentAudit.mottoText}'`);
      console.log(` - Live PST Clock: '${contentAudit.liveClock}'`);
      console.log(` - Compass: ${contentAudit.compassCards} cards, Topology: ${contentAudit.topologyTiers} tiers (${contentAudit.techBlocks} blocks)`);
      console.log(` - Garden Telemetry: ${contentAudit.telemetryCards} cards, Manifesto Triads: ${contentAudit.manifestoTriads}`);
      console.log(` - Gear Matrix: ${contentAudit.gearRows} items, Flow Deck: Equalizer ${contentAudit.equalizerBars} bars`);
      console.log(` - Milestones: ${contentAudit.milestones} items, Connect Channels: ${contentAudit.inquiryChannels}`);

      if (!contentAudit.mottoText.includes('厚土潜藏细脉') || !contentAudit.mottoText.includes('大荒广构通衢')) {
        console.error(`❌ [LIVE ERROR] Motto text mismatch: '${contentAudit.mottoText}'`);
        allPassed = false;
      } else {
        console.log(`✅ [LIVE SUCCESS] Motto verified on production: '${contentAudit.mottoText}'`);
      }

      if (contentAudit.compassCards !== 4 || contentAudit.topologyTiers !== 3 || contentAudit.telemetryCards !== 6) {
        console.error(`❌ [LIVE ERROR] Cards count mismatch`);
        allPassed = false;
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

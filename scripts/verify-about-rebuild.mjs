import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';
import path from 'path';

function createStaticServer(distDir, port) {
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.mp4': 'video/mp4',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
  };

  const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    let filePath = path.join(distDir, reqUrl);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
      filePath = filePath + '.html';
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  });

  return new Promise(resolve => server.listen(port, () => resolve(server)));
}

async function runAudit() {
  const port = 4355;
  const distDir = path.resolve('/home/shijian/projects/shijianus-blog/dist');
  const server = await createStaticServer(distDir, port);
  const screenshotDir = path.resolve('/home/shijian/projects/shijianus-blog/scripts/audit_screenshots');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  console.log(`[INFO] Static test server running on http://localhost:${port}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const viewports = [
    { name: 'Desktop-1440', width: 1440, height: 900 },
    { name: 'Tablet-768', width: 768, height: 1024 },
    { name: 'Mobile-375', width: 375, height: 667 }
  ];

  let allPassed = true;

  try {
    for (const vp of viewports) {
      console.log(`\n=============================================================`);
      console.log(`[TEST] Auditing Viewport: ${vp.name} (${vp.width}x${vp.height})`);
      console.log(`=============================================================`);

      const page = await browser.newPage();
      await page.setViewport({ width: vp.width, height: vp.height });

      const errors = [];
      page.on('pageerror', err => errors.push(err.message));

      await page.goto(`http://localhost:${port}/about/`, { waitUntil: 'networkidle2' });

      // 1. 验证打赏模块彻底移除
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
        console.log(`✅ [SUCCESS] Reward module is completely removed from /about/!`);
      } else {
        console.error(`❌ [FAILURE] Reward module is still present:`, rewardCheck);
        allPassed = false;
      }

      // 2. 验证安知鱼旧式抄袭元素彻底清除
      const anzhiyuCleanCheck = await page.evaluate(() => {
        const query = sel => document.querySelector(sel);
        return {
          hasMyInfo: Boolean(query('.myInfoAndSayHello')),
          hasAboutsiteTips: Boolean(query('.aboutsiteTips')),
          hasHelloAbout: Boolean(query('.hello-about')),
          hasGameYuanshen: Boolean(query('.game-yuanshen')),
          hasBuff: Boolean(query('.buff')),
          hasCareers: Boolean(query('.careers'))
        };
      });

      const anzhiyuResidue = Object.entries(anzhiyuCleanCheck).filter(([_, v]) => v);
      if (anzhiyuResidue.length === 0) {
        console.log(`✅ [SUCCESS] All Anzhiyu legacy/template elements are 100% eradicated!`);
      } else {
        console.error(`❌ [FAILURE] Anzhiyu legacy elements detected:`, anzhiyuResidue);
        allPassed = false;
      }

      // 3. 验证新架构 9 大板块与核心座右铭
      const contentAudit = await page.evaluate(() => {
        const query = sel => document.querySelector(sel);
        const queryAll = sel => Array.from(document.querySelectorAll(sel));

        return {
          // Module 1: Hero Card
          heroCard: Boolean(query('.creator-hero-card')),
          avatarImg: Boolean(query('.creator-avatar-img')),
          statusOrb: Boolean(query('.creator-status-orb')),
          creatorName: query('.creator-name')?.textContent?.trim() || '',
          creatorAlias: query('.creator-alias')?.textContent?.trim() || '',
          creatorTagBadge: query('.creator-tag-badge')?.textContent?.trim() || '',
          creatorHeadline: query('.creator-headline')?.textContent?.trim() || '',
          mottoText: query('.creator-motto-banner .motto-text')?.textContent?.trim() || '',
          mottoAnnotation: query('.creator-motto-banner .motto-annotation')?.textContent?.trim() || '',
          liveClock: query('#about-live-clock')?.textContent?.trim() || '',
          telemetryPills: queryAll('.creator-telemetry-bar .telemetry-pill').length,

          // Module 2: Compass
          compassCards: queryAll('.compass-grid .compass-card').length,
          compassTags: queryAll('.compass-grid .compass-tag').map(el => el.textContent.trim()),

          // Module 3: Topology Deck
          topologyTiers: queryAll('.topology-deck .topology-tier').length,
          techBlocks: queryAll('.topology-deck .tech-block').length,

          // Module 4: Garden Telemetry
          telemetryCards: queryAll('.garden-telemetry-grid .telemetry-card').length,
          telemetryValues: queryAll('.garden-telemetry-grid .telemetry-card__val').map(el => el.textContent.trim()),

          // Module 5: Manifesto
          manifestoTitle: query('.manifesto-lead-title')?.textContent?.trim() || '',
          manifestoTriads: queryAll('.manifesto-triad .manifesto-triad-item').length,

          // Module 6: Gear Matrix
          gearColumns: queryAll('.gear-matrix-grid .gear-column-card').length,
          gearRows: queryAll('.gear-matrix-grid .gear-row').length,

          // Module 7: Flow Deck
          flowCard: Boolean(query('.flow-card')),
          vinylGroove: Boolean(query('.turntable-vinyl-groove')),
          vinylCover: Boolean(query('.vinyl-core-art')),
          flowSongTitle: query('.flow-track-title')?.textContent?.trim() || '',
          equalizerBars: queryAll('.flow-card .equalizer-bars .bar').length,

          // Module 8: Milestones
          milestoneItems: queryAll('.milestones-timeline .milestone-item').length,
          milestoneYears: queryAll('.milestones-timeline .milestone-year').map(el => el.textContent.trim()),

          // Module 9: Inquiry Matrix
          inquiryChannels: queryAll('.inquiry-matrix-card .inquiry-channel-card').length,
          inquiryTitles: queryAll('.inquiry-matrix-card .inquiry-channel-title').map(el => el.textContent.trim())
        };
      });

      console.log(`[AUDIT RESULT] Content Structure:`);
      console.log(` - Creator Hero: Name='${contentAudit.creatorName} ${contentAudit.creatorAlias}', Badge='${contentAudit.creatorTagBadge}'`);
      console.log(` - Motto: '${contentAudit.mottoText}'`);
      console.log(` - Motto Annotation: '${contentAudit.mottoAnnotation.slice(0, 30)}...'`);
      console.log(` - Live Clock: '${contentAudit.liveClock}', Telemetry Pills: ${contentAudit.telemetryPills}`);
      console.log(` - Philosophy Compass: ${contentAudit.compassCards} cards (${contentAudit.compassTags.join(', ')})`);
      console.log(` - Tech Topology: ${contentAudit.topologyTiers} tiers with ${contentAudit.techBlocks} tech blocks`);
      console.log(` - Garden Telemetry: ${contentAudit.telemetryCards} metric cards (Values: ${contentAudit.telemetryValues.join(', ')})`);
      console.log(` - Manifesto: '${contentAudit.manifestoTitle.slice(0, 25)}...', Triads: ${contentAudit.manifestoTriads}`);
      console.log(` - Gear Matrix: ${contentAudit.gearColumns} columns with ${contentAudit.gearRows} gear rows`);
      console.log(` - Flow Deck: Vinyl=${contentAudit.vinylGroove}, Song='${contentAudit.flowSongTitle}', Equalizer=${contentAudit.equalizerBars} bars`);
      console.log(` - Milestones: ${contentAudit.milestoneItems} items (${contentAudit.milestoneYears.join(' -> ')})`);
      console.log(` - Connect Channels: ${contentAudit.inquiryChannels} items (${contentAudit.inquiryTitles.join(', ')})`);

      // 4. 关键指标与文本严格断言
      if (!contentAudit.mottoText.includes('厚土潜藏细脉') || !contentAudit.mottoText.includes('大荒广构通衢')) {
        console.error(`❌ [ASSERTION ERROR] Motto is incorrect: expected '厚土潜藏细脉，大荒广构通衢', got '${contentAudit.mottoText}'`);
        allPassed = false;
      } else {
        console.log(`✅ [ASSERTION SUCCESS] Motto matches user requirement: '${contentAudit.mottoText}'!`);
      }

      if (contentAudit.compassCards !== 4) {
        console.error(`❌ Compass cards count != 4`);
        allPassed = false;
      }
      if (contentAudit.topologyTiers !== 3 || contentAudit.techBlocks !== 12) {
        console.error(`❌ Topology tiers != 3 or tech blocks != 12`);
        allPassed = false;
      }
      if (contentAudit.telemetryCards !== 6) {
        console.error(`❌ Telemetry cards != 6`);
        allPassed = false;
      }
      if (contentAudit.manifestoTriads !== 3) {
        console.error(`❌ Manifesto triads != 3`);
        allPassed = false;
      }
      if (contentAudit.gearRows !== 8) {
        console.error(`❌ Gear rows != 8`);
        allPassed = false;
      }
      if (!contentAudit.flowCard || contentAudit.equalizerBars !== 5) {
        console.error(`❌ Flow card missing or equalizer bars != 5`);
        allPassed = false;
      }
      if (contentAudit.milestoneItems !== 4) {
        console.error(`❌ Milestones items != 4`);
        allPassed = false;
      }
      if (contentAudit.inquiryChannels !== 4) {
        console.error(`❌ Connect inquiry channels != 4`);
        allPassed = false;
      }

      if (errors.length > 0) {
        console.error(`❌ Console errors detected:`, errors);
        allPassed = false;
      } else {
        console.log(`✅ Zero runtime JavaScript errors.`);
      }

      // 截图留档 (浅色模式)
      const shotPath = path.join(screenshotDir, `about_rebuild_${vp.name}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });
      console.log(`📸 Light Mode Screenshot saved: ${shotPath}`);

      // 截图留档 (深色模式)
      await page.evaluate(() => {
        document.documentElement.setAttribute('data-theme', 'dark');
      });
      await new Promise(r => setTimeout(r, 400));
      const darkShotPath = path.join(screenshotDir, `about_rebuild_${vp.name}_dark.png`);
      await page.screenshot({ path: darkShotPath, fullPage: true });
      console.log(`📸 Dark Mode Screenshot saved: ${darkShotPath}`);

      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (allPassed) {
    console.log(`\n🎉 [ALL TESTS PASSED] About page reconstruction and personal portfolio audit passed 100%!`);
    process.exit(0);
  } else {
    console.error(`\n❌ [AUDIT FAILED] Some assertions did not pass.`);
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('Fatal error during audit:', err);
  process.exit(1);
});

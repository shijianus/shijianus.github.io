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

  let allPassed = true;

  try {
    const pagesToAudit = [
      {
        lang: 'zh-CN',
        url: `http://localhost:${port}/about/`,
        expectedName: '時間',
        expectedRole: '在读大学生',
        expectedYear: '2006',
        expectedMotto: '厚土潜藏细脉 大荒广构通衢',
        expectedGear: '联想',
      },
      {
        lang: 'zh-Hant',
        url: `http://localhost:${port}/zh-hant/about/`,
        expectedName: '時間',
        expectedRole: '在讀大學生',
        expectedYear: '2006',
        expectedMotto: '厚土潛藏細脈 大荒廣構通衢',
        expectedGear: '聯想',
      },
      {
        lang: 'en',
        url: `http://localhost:${port}/en/about/`,
        expectedName: 'Kevin Sparks',
        expectedRole: 'Undergraduate',
        expectedYear: '2006',
        expectedMotto: 'Nurture deep roots quietly',
        expectedGear: 'Lenovo',
      },
      {
        lang: 'fr',
        url: `http://localhost:${port}/fr/about/`,
        expectedName: 'Léon Boven',
        expectedRole: 'Étudiant',
        expectedYear: '2006',
        expectedMotto: 'Enracinement discret',
        expectedGear: 'Lenovo',
      }
    ];

    for (const item of pagesToAudit) {
      console.log(`\n=============================================================`);
      console.log(`[I18N AUDIT] Testing Profile: ${item.lang} (${item.url})`);
      console.log(`=============================================================`);

      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      const errors = [];
      page.on('pageerror', err => errors.push(err.message));

      const response = await page.goto(item.url, { waitUntil: 'networkidle2' });
      if (response.status() !== 200) {
        console.error(`❌ Non-200 response for ${item.url}: ${response.status()}`);
        allPassed = false;
      }

      await page.waitForSelector('.author-box', { timeout: 10000 });

      // 1. 验证打赏模块 100% 彻底不存在
      const rewardAudit = await page.evaluate(() => {
        const rewardId = document.querySelector('#about-reward');
        const rewardClass = document.querySelector('.author-content-item.reward');
        return { hasRewardId: Boolean(rewardId), hasRewardClass: Boolean(rewardClass) };
      });

      if (!rewardAudit.hasRewardId && !rewardAudit.hasRewardClass) {
        console.log(`✅ [REWARD REMOVED] No reward element in ${item.lang} profile!`);
      } else {
        console.error(`❌ [FAILURE] Reward module found in ${item.lang} profile!`);
        allPassed = false;
      }

      // 2. 验证多语言切换栏与当前高亮状态
      const switcherAudit = await page.evaluate((lang) => {
        const switcher = document.querySelector('.about-lang-switch-bar');
        const activeLink = document.querySelector(`.lang-switch-item[data-target-lang="${lang}"]`);
        const allLinks = Array.from(document.querySelectorAll('.lang-switch-item'));
        return {
          hasSwitcher: Boolean(switcher),
          activeMatches: activeLink ? activeLink.classList.contains('active') : false,
          totalLinks: allLinks.length,
        };
      }, item.lang);

      if (switcherAudit.hasSwitcher && switcherAudit.activeMatches && switcherAudit.totalLinks === 4) {
        console.log(`✅ [SWITCHER OK] 4 language switcher links found, '${item.lang}' correctly active.`);
      } else {
        console.error(`❌ [SWITCHER ERROR] Switcher audit failed for ${item.lang}:`, switcherAudit);
        allPassed = false;
      }

      // 3. 验证本地化内容与个人定位
      const content = await page.evaluate(() => {
        const q = sel => document.querySelector(sel);
        const qAll = sel => Array.from(document.querySelectorAll(sel));

        return {
          nameText: q('.myInfoAndSayHello .title2')?.textContent || '',
          descText: q('.myInfoAndSayHello .role-desc')?.textContent || '',
          mottoText: q('.author-content-item.maxim .maxim-title')?.textContent?.trim().replace(/\s+/g, ' ') || '',
          yearText: qAll('.author-content-item.personalities, .milestones-card, #about-page')
            .map(el => el.textContent).join(' '),
          firstGearText: q('.gear-card.hardware .gear-item:first-child .gear-item__name strong')?.textContent || '',
          clockText: q('#about-live-clock')?.textContent || '',
          topologyLayers: qAll('.topology-card .topology-tier-box').length,
          milestones: qAll('.milestones-card .milestone-node').length,
        };
      });

      console.log(`[PROFILE CONTENT RESULT]:`);
      console.log(` - Display Name Text: '${content.nameText.trim()}'`);
      console.log(` - Role Description: '${content.descText.trim()}'`);
      console.log(` - Motto: '${content.mottoText}'`);
      console.log(` - Hardware 1: '${content.firstGearText}'`);
      console.log(` - Live Clock: '${content.clockText}'`);
      console.log(` - Topology Tiers: ${content.topologyLayers}, Milestones: ${content.milestones}`);

      // 断言姓名
      if (content.nameText.includes(item.expectedName)) {
        console.log(`✅ [ASSERTION SUCCESS] Name correctly displays '${item.expectedName}'!`);
      } else {
        console.error(`❌ [ASSERTION FAILURE] Name mismatch! Expected '${item.expectedName}', got '${content.nameText}'`);
        allPassed = false;
      }

      // 断言职业与大学生身份
      if (content.descText.includes(item.expectedRole) || content.nameText.includes(item.expectedRole)) {
        console.log(`✅ [ASSERTION SUCCESS] Role correctly contains '${item.expectedRole}'!`);
      } else {
        console.error(`❌ [ASSERTION FAILURE] Role mismatch! Expected '${item.expectedRole}', got '${content.descText}'`);
        allPassed = false;
      }

      // 断言 2006 出生年份
      if (content.yearText.includes('2006')) {
        console.log(`✅ [ASSERTION SUCCESS] Year 2006 found in profile content!`);
      } else {
        console.error(`❌ [ASSERTION FAILURE] Year 2006 missing from profile!`);
        allPassed = false;
      }

      // 断言座右铭
      if (content.mottoText.includes(item.expectedMotto)) {
        console.log(`✅ [ASSERTION SUCCESS] Motto correctly contains '${item.expectedMotto}'!`);
      } else {
        console.error(`❌ [ASSERTION FAILURE] Motto mismatch! Expected '${item.expectedMotto}', got '${content.mottoText}'`);
        allPassed = false;
      }

      // 断言真实接地气的学生硬件装备（非昂贵炫耀装备）
      if (content.firstGearText.includes(item.expectedGear)) {
        console.log(`✅ [ASSERTION SUCCESS] Hardware gear correctly displays humble student setup ('${content.firstGearText}')!`);
      } else {
        console.error(`❌ [ASSERTION FAILURE] Hardware gear mismatch! Expected '${item.expectedGear}', got '${content.firstGearText}'`);
        allPassed = false;
      }

      if (errors.length > 0) {
        console.warn(`[WARN] Console JS errors:`, errors);
      } else {
        console.log(`✅ Zero runtime JavaScript errors.`);
      }

      // 截图
      const shotDesktop = path.join(screenshotDir, `about_i18n_${item.lang}_desktop.png`);
      await page.screenshot({ path: shotDesktop, fullPage: true });
      console.log(`📸 Desktop screenshot saved: ${shotDesktop}`);

      // 移动端视口测试
      await page.setViewport({ width: 375, height: 667 });
      const shotMobile = path.join(screenshotDir, `about_i18n_${item.lang}_mobile.png`);
      await page.screenshot({ path: shotMobile, fullPage: true });
      console.log(`📸 Mobile screenshot saved: ${shotMobile}`);

      await page.close();
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (allPassed) {
    console.log(`\n🎉 [ALL I18N TESTS PASSED] Multilingual profiles (zh-CN, zh-Hant, en, fr) 100% verified!`);
    process.exit(0);
  } else {
    console.error(`\n❌ [I18N AUDIT FAILED] Some assertions did not pass.`);
    process.exit(1);
  }
}

runAudit().catch(err => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});

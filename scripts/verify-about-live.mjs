import puppeteer from 'puppeteer';
import path from 'path';

async function runLiveAudit() {
  const baseUrl = 'https://blog.epocanvas.com';
  console.log(`[INFO] Initiating Live E2E Multilingual Verification for: ${baseUrl}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const profilesToAudit = [
    {
      lang: 'zh-CN',
      url: `${baseUrl}/about/`,
      expectedName: '時間',
      expectedRole: '在读大学生',
      expectedYear: '2006',
      expectedMotto: '厚土潜藏细脉 大荒广构通衢',
      expectedGear: '联想',
    },
    {
      lang: 'zh-Hant',
      url: `${baseUrl}/zh-hant/about/`,
      expectedName: '時間',
      expectedRole: '在讀大學生',
      expectedYear: '2006',
      expectedMotto: '厚土潛藏細脈 大荒廣構通衢',
      expectedGear: '聯想',
    },
    {
      lang: 'en',
      url: `${baseUrl}/en/about/`,
      expectedName: 'Kevin Sparks',
      expectedRole: 'Undergraduate',
      expectedYear: '2006',
      expectedMotto: 'Nurture deep roots quietly',
      expectedGear: 'Lenovo',
    },
    {
      lang: 'fr',
      url: `${baseUrl}/fr/about/`,
      expectedName: 'Léon Boven',
      expectedRole: 'Étudiant',
      expectedYear: '2006',
      expectedMotto: 'Enracinement discret',
      expectedGear: 'Lenovo',
    },
  ];

  let allPassed = true;

  try {
    for (const item of profilesToAudit) {
      console.log(`\n=============================================================`);
      console.log(`[LIVE PROFILE AUDIT] Auditing: ${item.lang} (${item.url})`);
      console.log(`=============================================================`);

      const page = await browser.newPage();
      await page.setViewport({ width: 1440, height: 900 });

      const errors = [];
      page.on('pageerror', err => errors.push(err.message));

      const response = await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 35000 });
      console.log(`[HTTP STATUS] ${response.status()} ${response.statusText()}`);

      if (response.status() !== 200) {
        console.error(`❌ Non-200 HTTP response for ${item.url}!`);
        allPassed = false;
      }

      await page.waitForSelector('.author-box', { timeout: 15000 });
      await page.waitForSelector('.author-content-item.maxim', { timeout: 15000 });

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
        console.log(`✅ [LIVE SUCCESS] Reward module is completely absent in ${item.lang} profile!`);
      } else {
        console.error(`❌ [LIVE FAILURE] Reward module found in ${item.lang} profile:`, rewardCheck);
        allPassed = false;
      }

      // 2. 验证多语言切换栏
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
        console.log(`✅ [LIVE SWITCHER OK] 4 language switcher links found, '${item.lang}' active.`);
      } else {
        console.error(`❌ [LIVE SWITCHER ERROR] Switcher audit failed for ${item.lang}:`, switcherAudit);
        allPassed = false;
      }

      // 3. 验证本地化内容
      const content = await page.evaluate(() => {
        const q = sel => document.querySelector(sel);
        const qAll = sel => Array.from(document.querySelectorAll(sel));

        return {
          nameText: q('.myInfoAndSayHello .title2')?.textContent || '',
          descText: q('.myInfoAndSayHello .role-desc')?.textContent || '',
          mottoText: q('.author-content-item.maxim .maxim-title')?.textContent?.trim().replace(/\s+/g, ' ') || '',
          allText: qAll('.author-content-item, .milestones-card, #about-page').map(el => el.textContent).join(' '),
          firstGearText: q('.gear-card.hardware .gear-item:first-child .gear-item__name strong')?.textContent || '',
          clockText: q('#about-live-clock')?.textContent || '',
          topologyLayers: qAll('.topology-card .topology-tier-box').length,
          milestoneNodes: qAll('.milestones-card .milestone-node').length,
        };
      });

      console.log(`[LIVE PROFILE RESULT]:`);
      console.log(` - Name: '${content.nameText.trim()}'`);
      console.log(` - Role: '${content.descText.trim()}'`);
      console.log(` - Motto: '${content.mottoText}'`);
      console.log(` - Hardware 1: '${content.firstGearText}'`);
      console.log(` - Live Clock: '${content.clockText}'`);
      console.log(` - Topology: ${content.topologyLayers} tiers, Milestones: ${content.milestoneNodes} nodes`);

      // 断言姓名
      if (content.nameText.includes(item.expectedName)) {
        console.log(`✅ [LIVE ASSERTION] Name correctly displays '${item.expectedName}'!`);
      } else {
        console.error(`❌ [LIVE ASSERTION FAILURE] Name mismatch! Expected '${item.expectedName}', got '${content.nameText}'`);
        allPassed = false;
      }

      // 断言角色身份与大学生
      if (content.descText.includes(item.expectedRole) || content.nameText.includes(item.expectedRole)) {
        console.log(`✅ [LIVE ASSERTION] Role correctly contains '${item.expectedRole}'!`);
      } else {
        console.error(`❌ [LIVE ASSERTION FAILURE] Role mismatch! Expected '${item.expectedRole}', got '${content.descText}'`);
        allPassed = false;
      }

      // 断言 2006
      if (content.allText.includes('2006')) {
        console.log(`✅ [LIVE ASSERTION] Year 2006 found in profile content!`);
      } else {
        console.error(`❌ [LIVE ASSERTION FAILURE] Year 2006 missing from profile!`);
        allPassed = false;
      }

      // 断言座右铭
      if (content.mottoText.includes(item.expectedMotto)) {
        console.log(`✅ [LIVE ASSERTION] Motto correctly contains '${item.expectedMotto}'!`);
      } else {
        console.error(`❌ [LIVE ASSERTION FAILURE] Motto mismatch! Expected '${item.expectedMotto}', got '${content.mottoText}'`);
        allPassed = false;
      }

      // 断言接地气装备
      if (content.firstGearText.includes(item.expectedGear)) {
        console.log(`✅ [LIVE ASSERTION] Hardware gear correctly displays student setup ('${content.firstGearText}')!`);
      } else {
        console.error(`❌ [LIVE ASSERTION FAILURE] Hardware gear mismatch! Expected '${item.expectedGear}', got '${content.firstGearText}'`);
        allPassed = false;
      }

      if (errors.length > 0) {
        console.warn(`[WARN] Live console errors:`, errors);
      } else {
        console.log(`✅ Zero runtime JavaScript errors.`);
      }

      const shotPath = path.resolve(`/home/shijian/projects/shijianus-blog/scripts/audit_screenshots/Live_i18n_${item.lang}.png`);
      await page.screenshot({ path: shotPath, fullPage: true });
      console.log(`📸 Live Screenshot saved: ${shotPath}`);

      await page.close();
    }
  } finally {
    await browser.close();
  }

  if (allPassed) {
    console.log(`\n🎉 [LIVE VERIFICATION PASSED] All multilingual About profiles on production are 100% verified!`);
    process.exit(0);
  } else {
    console.error(`\n❌ [LIVE AUDIT FAILED] Some profiles failed verification.`);
    process.exit(1);
  }
}

runLiveAudit().catch(err => {
  console.error('Fatal live audit error:', err);
  process.exit(1);
});

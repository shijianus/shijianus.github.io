export type AboutLocaleCode = 'zh-CN' | 'zh-Hant' | 'en' | 'fr';

export interface AboutI18nProfile {
  langCode: AboutLocaleCode;
  switchLabel: string;
  langName: string;
  flag: string;
  url: string;
  pageTitle: string;
  pageSubtitle: string;
  authorName: string;
  authorRole: string;
  sayHelloName: string;
  helloTips: string;
  helloLead: string;
  helloDescription: string;
  floatingTagsLeft: string[];
  floatingTagsRight: string[];
  chips: string[];
  siteTips: {
    tips: string;
    titleTop: string;
    titleBottom: string;
    words: string[];
    lead: string;
  };
  skills: {
    tips: string;
    title: string;
  };
  careers: {
    tips: string;
    title: string;
    items: { label: string; accent: string }[];
  };
  stats: {
    tips: string;
    title: string;
    btnLabel: string;
  };
  map: {
    title: string;
    accent: string;
    status: string;
  };
  selfInfo: { label: string; value: string; accent: string }[];
  personality: {
    tips: string;
    type: string;
    title: string;
    summary: string;
    traits: { label: string; value: number; desc: string }[];
  };
  photoTitle: string;
  gear: {
    tips: string;
    title: string;
    hardwareDesc: string;
    softwareDesc: string;
    hardware: { name: string; desc: string; icon: 'laptop' | 'monitor' | 'keyboard' | 'headphones'; badge?: string }[];
    software: { name: string; desc: string; icon: 'code' | 'zap' | 'figma' | 'cloud'; badge?: string }[];
  };
  manifesto: {
    tips: string;
    title: string;
    subtitle: string;
    pillars: { title: string; desc: string; tag: string; icon: 'shield' | 'feather' | 'hammer' }[];
  };
  topology: {
    tips: string;
    title: string;
    lead: string;
    tiers: {
      num: string;
      title: string;
      subtitle: string;
      items: { name: string; desc: string; dot: 'blue' | 'cyan' | 'teal' | 'orange' | 'purple' | 'green' | 'red' | 'yellow' }[];
    }[];
  };
  soundtrack: {
    tips: string;
    title: string;
    summary: string;
    song: string;
    artist: string;
  };
  game: {
    tips: string;
    title: string;
    summary: string;
  };
  comic: {
    tips: string;
    title: string;
    items: string[];
  };
  milestones: {
    tips: string;
    title: string;
    lead: string;
    items: { year: string; tag: string; title: string; desc: string; isCurrent?: boolean; isFuture?: boolean }[];
  };
  maxim: {
    tips: string;
    top: string;
    bottom: string;
    annotation: string;
  };
  buff: {
    tips: string;
    top: string;
    bottom: string;
  };
  connect: {
    tips: string;
    title: string;
    summary: string;
    items: { label: string; desc: string; icon: 'github' | 'telegram' | 'rss' | 'mail'; href: string }[];
  };
}

export const ABOUT_I18N_PROFILES: Record<AboutLocaleCode, AboutI18nProfile> = {
  'zh-CN': {
    langCode: 'zh-CN',
    switchLabel: '语言界面 / Multilingual Profiles',
    langName: '简体中文',
    flag: '🇨🇳',
    url: '/about/',
    pageTitle: '关于我',
    pageSubtitle: '厚土潜藏细脉 · 大荒广构通衢',
    authorName: 'shijianus (時間)',
    authorRole: '00后在读大学生 · Web 全栈初探者 · 数字花园建造者',
    sayHelloName: 'shijianus (時間)',
    helloTips: '你好，很高兴认识你',
    helloLead: '你好，我在这里写作与构建',
    helloDescription: '00后在读大学生 · Web 全栈初探者 · 数字花园建造者',
    floatingTagsLeft: ['00后大学生', '计算机在读', '体验洁癖'],
    floatingTagsRight: ['开源求索', '长效构建', '数字花园'],
    chips: ['#Astro', '#TypeScript', '#Tailwind', '#Cloudflare', '#UI/UX', '#计算机在读', '#数据主权'],
    siteTips: {
      tips: '基调',
      titleTop: '深耕',
      titleBottom: '厚土潜藏细脉',
      words: ['潜藏细脉', '广构通衢', '敬畏秩序', '长效沉淀'],
      lead: '生于 2006 年，计算机专业在读。深潜底层打磨隐秘细脉，拓越远方构筑长效通衢。在信息快餐与算法喧嚣的时代，为你我保留一处专注慢思考、深度阅读与自由构建的数字自留地。',
    },
    skills: {
      tips: '技能',
      title: '开启创造力',
    },
    careers: {
      tips: '求索',
      title: '阶段与长期方向',
      items: [
        { label: '在本科求学阶段踏实打好计算机与工程底座', accent: '#5b8cff' },
        { label: '把个人主页打造成长期自生长的数字花园，而非一次性产物', accent: '#ff7d55' },
        { label: '探索 Web 全栈、现代设计系统与人机协同的融合实践', accent: '#30c48d' },
      ],
    },
    stats: {
      tips: '数据',
      title: '访问统计',
      btnLabel: '查看归档',
    },
    map: {
      title: '现在住在',
      accent: 'UTC-8',
      status: '灵感涌现 · 持续构建中',
    },
    selfInfo: [
      { label: '生于', value: '2006', accent: '#43a6c6' },
      { label: '职业方向', value: 'Web 全栈求索', accent: '#c69043' },
      { label: '当前阶段', value: '在读大学生', accent: '#b04fe6' },
    ],
    personality: {
      tips: '性格',
      type: 'INFJ-A',
      title: '提倡者 / 架构思考者',
      summary: '偏好建立秩序、耐心打磨细节，对长期可维护的系统与极致体验有天然执念。',
      traits: [
        { label: '专注深度 (Introverted)', value: 82, desc: '偏好独处构思与深度心流' },
        { label: '直觉远见 (Intuitive)', value: 86, desc: '洞察系统全貌与长远演进' },
        { label: '人文感受 (Feeling)', value: 74, desc: '关注使用者体验与情感共鸣' },
        { label: '秩序判断 (Judging)', value: 90, desc: '严苛自律、追求清晰与条理' },
        { label: '坚定果决 (Assertive)', value: 78, desc: '从容自信、笃定落实每一行代码' },
      ],
    },
    photoTitle: '真实工作台',
    gear: {
      tips: '生产力工具',
      title: '我的装备与工作流',
      hardwareDesc: '实用、务实与性价比。陪伴日常自习、深夜代码与实验探究的普通学生工具箱。',
      softwareDesc: '极简、敏捷与高信息密度。将现代工具链与自动化流程融为一体。',
      hardware: [
        { name: '联想小新 Pro / 拯救者便携本', desc: '自习室与寝室主力 · 陪我熬夜跑实验写代码的高性价比伙伴', icon: 'laptop', badge: 'Daily' },
        { name: '红米 / AOC 24寸 护眼显示屏', desc: '桌面副屏扩展 · 平价实用，双屏分屏查文档编码更专注', icon: 'monitor' },
        { name: '国产客制化红轴机械键盘', desc: '轻柔静音 · 宿舍不扰室友，长时间打字指尖轻快舒适', icon: 'keyboard' },
        { name: '实用入耳式降噪耳机', desc: '自习防线 · 图书馆与宿舍里隔绝杂音、开启心流沉浸', icon: 'headphones' },
      ],
      software: [
        { name: 'Cursor & VS Code', desc: 'Tokyo Night 主题 · 现代智能结对与流畅编码', icon: 'code', badge: 'Editor' },
        { name: 'Raycast', desc: '工作流神经中枢 · 毫秒级快捷操作与管道调度', icon: 'zap' },
        { name: 'Figma', desc: '界面原型绘制 · 像素级打磨与交互草图设计', icon: 'figma' },
        { name: 'Cloudflare Pages & D1', desc: '全球边缘网络 · 零冷启动现代化分布式架构', icon: 'cloud', badge: 'Cloud' },
      ],
    },
    manifesto: {
      tips: '造物初心',
      title: '在算法喧嚣的时代，构筑一座属于自己的数字花园。',
      subtitle: '不迎合瞬息万变的快餐式流量，用代码与文字沉淀可穿越周期的长效价值。',
      pillars: [
        { title: '数据主权与自由表达', desc: '不为算法推荐妥协，不被商业平台锁定。把每一次技术探索、深度思考与真实试错完整归档在自己的领地上。', tag: 'Sovereignty', icon: 'shield' },
        { title: '慢思考与长效价值', desc: '拒绝碎片化浮躁。以系统化、结构化的长文记录解决真实技术痛点的轨迹，让知识随时间复利持续增值。', tag: 'Longevity', icon: 'feather' },
        { title: '数字工匠精神', desc: '代码架构、字距留白、色彩平衡与微交互，处处皆是作品。追求极致的前端性能与符合人体感官的美学舒适。', tag: 'Craftsmanship', icon: 'hammer' },
      ],
    },
    topology: {
      tips: '系统架构 / Architecture Topology',
      title: '全栈工程架构与云端底座',
      lead: '从浏览器感知交互、排版编译管道到底层全球分布式边缘运算的全链路技术选型。',
      tiers: [
        {
          num: '01',
          title: '感知交互层',
          subtitle: 'Client & UX Tier',
          items: [
            { name: 'Astro 6', desc: 'Islands 极速渲染', dot: 'blue' },
            { name: 'React 19', desc: '动态收银交互', dot: 'cyan' },
            { name: 'TypeScript 5.8', desc: '端到端严格类型', dot: 'blue' },
            { name: 'Tailwind CSS 3.4', desc: '原子化流动排版', dot: 'teal' },
          ],
        },
        {
          num: '02',
          title: '编译管道层',
          subtitle: 'Pipeline & Content Tier',
          items: [
            { name: 'MDX & Remark', desc: 'AST 增强与解析', dot: 'orange' },
            { name: 'Shiki Dual Theme', desc: '零运行时代码高亮', dot: 'purple' },
            { name: 'KaTeX & Math', desc: '纯 CSS 数学排版', dot: 'green' },
            { name: 'Mermaid Diagrams', desc: '架构图表直接渲染', dot: 'red' },
          ],
        },
        {
          num: '03',
          title: '边缘基础设施',
          subtitle: 'Cloudflare Edge Tier',
          items: [
            { name: 'Cloudflare Pages', desc: '全球边缘 Anycast 交付', dot: 'orange' },
            { name: 'Cloudflare D1', desc: '边缘 SQLite 原生留言存储', dot: 'blue' },
            { name: 'Cloudflare Workers', desc: 'Serverless 无冷启动 API', dot: 'yellow' },
            { name: 'GitOps Workflow', desc: '自动化多远端推送与审计', dot: 'green' },
          ],
        },
      ],
    },
    soundtrack: {
      tips: '灵感音轨',
      title: '在旋律与代码间寻得心流',
      summary: '敲下代码时，音乐是最好的白噪音；文字流淌时，旋律是心流的节拍器。在旋律与思考中保持节奏。',
      song: 'Way Back Home / 彼女は旅に出る',
      artist: 'Scop · SHAUN · 悠扬日常',
    },
    game: {
      tips: '沉浸热爱',
      title: '数字造物与极客实验',
      summary: '把内容、界面与交互收束成真正能穿越周期的个人作品。',
    },
    comic: {
      tips: '关注的主题',
      title: '关注的主题',
      items: ['系统架构', '设计系统', '阅读体验', '人机协同'],
    },
    milestones: {
      tips: '演进足迹 / Milestones',
      title: '成长轨迹与造物足迹',
      lead: '生于 2006 年，从一行简单的代码，到求索大学生活与数字花园的成长记录。',
      items: [
        { year: '2006', tag: '始于盛夏 (Origins)', title: '出生于 2006 年', desc: '出生于 2006 年盛夏，在现代互联网与数字浪潮初兴中成长，对未知世界充满向往。' },
        { year: '2022', tag: '初探代码 (First Code)', title: '敲下第一行 Hello World', desc: '高中偶然接触编程，被代码创造数字界面的奇妙所震撼，点燃了极客造物兴趣。' },
        { year: '2024', tag: '步入大学 (Campus Life)', title: '开启计算机专业求学历程', desc: '成为一名在读大学生，在自习室与宿舍搭建个人独立博客，开启全栈技术探索。' },
        { year: '2026', tag: '体系构建 (Digital Garden)', title: '打磨全栈个人主页与长效内容系统', desc: '大二在读，自研边缘原生留言系统与现代工程架构，以真诚、踏实的初心持续沉淀。', isCurrent: true },
        { year: '未来', tag: '踏实求索 (Lifelong Pursuit)', title: '厚土潜藏细脉，大荒广构通衢', desc: '保持好奇与谦逊，在工程技术与人文思考的十字路口，做一名踏实的数字工匠。', isFuture: true },
      ],
    },
    maxim: {
      tips: '座右铭',
      top: '厚土潜藏细脉',
      bottom: '大荒广构通衢',
      annotation: '深潜底层打磨隐秘细脉，拓越远方构筑长效通衢。',
    },
    buff: {
      tips: '加成',
      top: '意图明确的构建',
      bottom: '比一次性的热闹更重要',
    },
    connect: {
      tips: '保持连接',
      title: '与志同道合者同行',
      summary: '无论你想探讨前端工程、交流大学学习生活，还是探讨写作体验与开源思考，欢迎随时与我连接。',
      items: [
        { label: 'GitHub', desc: '查看开源项目与构建足迹', icon: 'github', href: 'https://github.com/shijianus' },
        { label: 'Telegram', desc: '日常交流与即时互动探讨', icon: 'telegram', href: 'https://t.me/chronoral' },
        { label: 'RSS 订阅', desc: '通过现代阅读器第一时间获知更新', icon: 'rss', href: '/rss.xml' },
        { label: '邮件信箱', desc: '欢迎深度长信交流探讨', icon: 'mail', href: 'mailto:contact@epocanvas.com' },
      ],
    },
  },
  'zh-Hant': {
    langCode: 'zh-Hant',
    switchLabel: '語言界面 / Multilingual Profiles',
    langName: '繁體中文',
    flag: '🇭🇰',
    url: '/zh-hant/about/',
    pageTitle: '關於我',
    pageSubtitle: '厚土潛藏細脈 · 大荒廣構通衢',
    authorName: '時間 (shijianus)',
    authorRole: '00後在讀大學生 · Web 全棧初探者 · 數字花園建造者',
    sayHelloName: '時間 (shijianus)',
    helloTips: '你好，很高興認識你',
    helloLead: '你好，我在這裏寫作與構建',
    helloDescription: '00後在讀大學生 · Web 全棧初探者 · 數字花園建造者',
    floatingTagsLeft: ['00後大學生', '計算機在讀', '體驗潔癖'],
    floatingTagsRight: ['開源求索', '長效構建', '數字花園'],
    chips: ['#Astro', '#TypeScript', '#Tailwind', '#Cloudflare', '#UI/UX', '#計算機在讀', '#數據主權'],
    siteTips: {
      tips: '基調',
      titleTop: '深耕',
      titleBottom: '厚土潛藏細脈',
      words: ['潛藏細脈', '廣構通衢', '敬畏秩序', '長效沉澱'],
      lead: '生於 2006 年，計算機專業在讀。深潛底層打磨隱秘細脈，拓越遠方構築長效通衢。在信息快餐與算法喧囂的時代，為你我保留一處專注慢思考、深度閱讀與自由構建的數字自留地。',
    },
    skills: {
      tips: '技能',
      title: '開啟創造力',
    },
    careers: {
      tips: '求索',
      title: '階段與長期方向',
      items: [
        { label: '在本科求學階段踏實打好計算機與工程底座', accent: '#5b8cff' },
        { label: '把個人主頁打造成長期自生長的數字花園，而非一次性產物', accent: '#ff7d55' },
        { label: '探索 Web 全棧、現代設計系統與人機協同的融合實踐', accent: '#30c48d' },
      ],
    },
    stats: {
      tips: '數據',
      title: '訪問統計',
      btnLabel: '查看歸檔',
    },
    map: {
      title: '現在住在',
      accent: 'UTC-8',
      status: '靈感湧現 · 持續構建中',
    },
    selfInfo: [
      { label: '生於', value: '2006', accent: '#43a6c6' },
      { label: '職業方向', value: 'Web 全棧求索', accent: '#c69043' },
      { label: '當前階段', value: '在讀大學生', accent: '#b04fe6' },
    ],
    personality: {
      tips: '性格',
      type: 'INFJ-A',
      title: '提倡者 / 架構思考者',
      summary: '偏好建立秩序、耐心打磨細節，對長期可維護的系統與極致體驗有天然執念。',
      traits: [
        { label: '專注深度 (Introverted)', value: 82, desc: '偏好獨處構思與深度心流' },
        { label: '直覺遠見 (Intuitive)', value: 86, desc: '洞察系統全貌與長遠演進' },
        { label: '人文感受 (Feeling)', value: 74, desc: '關注使用者體驗與情感共鳴' },
        { label: '秩序判斷 (Judging)', value: 90, desc: '嚴苛自律、追求清晰與條理' },
        { label: '堅定果決 (Assertive)', value: 78, desc: '從容自信、篤定落實每一行代碼' },
      ],
    },
    photoTitle: '真實工作台',
    gear: {
      tips: '生產力工具',
      title: '我的裝備與工作流',
      hardwareDesc: '實用、務實與性價比。陪伴日常自習、深夜代碼與實驗探究的普通學生工具箱。',
      softwareDesc: '極簡、敏捷與高信息密度。將現代工具鏈與自動化流程融為一體。',
      hardware: [
        { name: '聯想小新 Pro / 拯救者便攜本', desc: '自習室與寢室主力 · 陪我熬夜跑實驗寫代碼的高性價比夥伴', icon: 'laptop', badge: 'Daily' },
        { name: '紅米 / AOC 24寸 護眼顯示屏', desc: '桌面副屏擴展 · 平價實用，雙屏分屏查文檔編碼更專注', icon: 'monitor' },
        { name: '國產客制化紅軸機械鍵盤', desc: '輕柔靜音 · 宿舍不擾室友，長時間打字指尖輕快舒適', icon: 'keyboard' },
        { name: '實用入耳式降噪耳機', desc: '自習防線 · 圖書館與宿舍裏隔絕雜音、開啟心流沉浸', icon: 'headphones' },
      ],
      software: [
        { name: 'Cursor & VS Code', desc: 'Tokyo Night 主題 · 現代智能結對與流暢編碼', icon: 'code', badge: 'Editor' },
        { name: 'Raycast', desc: '工作流神經中樞 · 毫秒級快捷操作與管道調度', icon: 'zap' },
        { name: 'Figma', desc: '界面原型繪製 · 像素級打磨與交互草圖設計', icon: 'figma' },
        { name: 'Cloudflare Pages & D1', desc: '全球邊緣網絡 · 零冷啟動現代化分布式架構', icon: 'cloud', badge: 'Cloud' },
      ],
    },
    manifesto: {
      tips: '造物初心',
      title: '在算法喧囂的時代，構築一座屬於自己的數字花園。',
      subtitle: '不迎合瞬息萬變的快餐式流量，用代碼與文字沉澱可穿越周期的長效價值。',
      pillars: [
        { title: '數據主權與自由表達', desc: '不為算法推薦妥協，不被商業平台鎖定。把每一次技術探索、深度思考與真實試錯完整歸檔在自己的領地上。', tag: 'Sovereignty', icon: 'shield' },
        { title: '慢思考與長效價值', desc: '拒絕碎片化浮躁。以系統化、結構化的長文記錄解決真實技術痛點的軌跡，讓知識隨時間複利持續增值。', tag: 'Longevity', icon: 'feather' },
        { title: '數字工匠精神', desc: '代碼架構、字距留白、色彩平衡與微交互，處處皆是作品。追求極致的前端性能與符合人體感官的美學舒適。', tag: 'Craftsmanship', icon: 'hammer' },
      ],
    },
    topology: {
      tips: '系統架構 / Architecture Topology',
      title: '全棧工程架構與雲端底座',
      lead: '從瀏覽器感知交互、排版編譯管道到底層全球分布式邊緣運算的全鏈路技術選型。',
      tiers: [
        {
          num: '01',
          title: '感知交互層',
          subtitle: 'Client & UX Tier',
          items: [
            { name: 'Astro 6', desc: 'Islands 極速渲染', dot: 'blue' },
            { name: 'React 19', desc: '動態收銀交互', dot: 'cyan' },
            { name: 'TypeScript 5.8', desc: '端到端嚴格類型', dot: 'blue' },
            { name: 'Tailwind CSS 3.4', desc: '原子化流動排版', dot: 'teal' },
          ],
        },
        {
          num: '02',
          title: '編譯管道層',
          subtitle: 'Pipeline & Content Tier',
          items: [
            { name: 'MDX & Remark', desc: 'AST 增強與解析', dot: 'orange' },
            { name: 'Shiki Dual Theme', desc: '零運行時代碼高亮', dot: 'purple' },
            { name: 'KaTeX & Math', desc: '純 CSS 數學排版', dot: 'green' },
            { name: 'Mermaid Diagrams', desc: '架構圖表直接渲染', dot: 'red' },
          ],
        },
        {
          num: '03',
          title: '邊緣基礎設施',
          subtitle: 'Cloudflare Edge Tier',
          items: [
            { name: 'Cloudflare Pages', desc: '全球邊緣 Anycast 交付', dot: 'orange' },
            { name: 'Cloudflare D1', desc: '邊緣 SQLite 原生留言存儲', dot: 'blue' },
            { name: 'Cloudflare Workers', desc: 'Serverless 無冷啟動 API', dot: 'yellow' },
            { name: 'GitOps Workflow', desc: '自動化多遠端推送與審計', dot: 'green' },
          ],
        },
      ],
    },
    soundtrack: {
      tips: '靈感音軌',
      title: '在旋律與代碼間尋得心流',
      summary: '敲下代碼時，音樂是最好的白噪音；文字流淌時，旋律是心流的節拍器。在旋律與思考中保持節奏。',
      song: 'Way Back Home / 彼女は旅に出る',
      artist: 'Scop · SHAUN · 悠揚日常',
    },
    game: {
      tips: '沉浸熱愛',
      title: '數字造物與極客實驗',
      summary: '把內容、界面與交互收束成真正能穿越周期的個人作品。',
    },
    comic: {
      tips: '關注的主題',
      title: '關注的主題',
      items: ['系統架構', '設計系統', '閱讀體驗', '人機協同'],
    },
    milestones: {
      tips: '演進足跡 / Milestones',
      title: '成長軌跡與造物足跡',
      lead: '生於 2006 年，從一行簡單的代碼，到求索大學生活與數字花園的成長記錄。',
      items: [
        { year: '2006', tag: '始於盛夏 (Origins)', title: '出生於 2006 年', desc: '出生於 2006 年盛夏，在現代互聯網與數字浪潮初興中成長，對未知世界充滿向往。' },
        { year: '2022', tag: '初探代碼 (First Code)', title: '敲下第一行 Hello World', desc: '高中偶然接觸編程，被代碼創造數字界面的奇妙所震撼，點燃了極客造物興趣。' },
        { year: '2024', tag: '步入大學 (Campus Life)', title: '開啟計算機專業求學歷程', desc: '成為一名在讀大學生，在自習室與宿舍搭建個人獨立博客，開啟全棧技術探索。' },
        { year: '2026', tag: '體系構建 (Digital Garden)', title: '打磨全棧個人主頁與長效內容系統', desc: '大二在讀，自研邊緣原生留言系統與現代工程架構，以真誠、踏實的初心持續沉澱。', isCurrent: true },
        { year: '未來', tag: '踏實求索 (Lifelong Pursuit)', title: '厚土潛藏細脈，大荒廣構通衢', desc: '保持好奇與謙遜，在工程技術與人文思考的十字路口，做一名踏實的數字工匠。', isFuture: true },
      ],
    },
    maxim: {
      tips: '座右銘',
      top: '厚土潛藏細脈',
      bottom: '大荒廣構通衢',
      annotation: '深潛底層打磨隱秘細脈，拓越遠方構築長效通衢。',
    },
    buff: {
      tips: '加成',
      top: '意圖明確的構建',
      bottom: '比一次性的熱鬧更重要',
    },
    connect: {
      tips: '保持連接',
      title: '與志同道合者同行',
      summary: '無論你想探討前端工程、交流大學學習生活，還是探討寫作體驗與開源思考，歡迎隨時與我連接。',
      items: [
        { label: 'GitHub', desc: '查看開源項目與構建足跡', icon: 'github', href: 'https://github.com/shijianus' },
        { label: 'Telegram', desc: '日常交流與即時互動探討', icon: 'telegram', href: 'https://t.me/chronoral' },
        { label: 'RSS 訂閱', desc: '通過現代閱讀器第一時間獲知更新', icon: 'rss', href: '/rss.xml' },
        { label: '郵件信箱', desc: '歡迎深度長信交流探討', icon: 'mail', href: 'mailto:contact@epocanvas.com' },
      ],
    },
  },
  'en': {
    langCode: 'en',
    switchLabel: 'Multilingual Profiles',
    langName: 'English',
    flag: '🇺🇸',
    url: '/en/about/',
    pageTitle: 'About Me',
    pageSubtitle: 'Nurture deep roots quietly · Build broad paths forward',
    authorName: 'Kevin Sparks',
    authorRole: 'Undergraduate (b. 2006) · Web Explorer · Digital Gardener',
    sayHelloName: 'Kevin Sparks',
    helloTips: 'Hello, welcome to my digital garden',
    helloLead: 'Hello, I write and craft here',
    helloDescription: 'Undergraduate (b. 2006) · Web Explorer · Digital Gardener',
    floatingTagsLeft: ['CS Undergrad', 'Born in 2006', 'Detail Oriented'],
    floatingTagsRight: ['Open Source', 'Long-term Build', 'Digital Garden'],
    chips: ['#Astro', '#TypeScript', '#Tailwind', '#Cloudflare', '#UI/UX', '#CS Undergrad', '#Sovereignty'],
    siteTips: {
      tips: 'Foundation',
      titleTop: 'Quiet Roots',
      titleBottom: 'Broad Horizons',
      words: ['Deep Roots', 'Broad Horizons', 'Quiet Craft', 'Enduring Value'],
      lead: 'Born in 2006, currently an undergraduate studying Computer Science. Nurturing quiet fundamentals to bridge broad horizons. In an age of ephemeral feeds and algorithmic noise, this garden preserves deliberate thinking, deep reading, and sincere digital craft.',
    },
    skills: {
      tips: 'Skills',
      title: 'Creative Toolkit',
    },
    careers: {
      tips: 'Journey',
      title: 'Phases & Lifelong Direction',
      items: [
        { label: 'Solidify foundational computer science and engineering principles in college', accent: '#5b8cff' },
        { label: 'Cultivate a personal digital garden for the long haul, not just a one-off page', accent: '#ff7d55' },
        { label: 'Explore the confluence of modern web architectures, design systems, and human-AI synergy', accent: '#30c48d' },
      ],
    },
    stats: {
      tips: 'Stats',
      title: 'Telemetry',
      btnLabel: 'View Archives',
    },
    map: {
      title: 'Located at',
      accent: 'UTC-8',
      status: 'Active Flow · Continuous Crafting',
    },
    selfInfo: [
      { label: 'Born', value: '2006', accent: '#43a6c6' },
      { label: 'Direction', value: 'Web Exploration', accent: '#c69043' },
      { label: 'Current Stage', value: 'Undergraduate', accent: '#b04fe6' },
    ],
    personality: {
      tips: 'Personality',
      type: 'INFJ-A',
      title: 'Advocate / Architectural Thinker',
      summary: 'Driven by order, craft, and empathy. Naturally devoted to maintainable software, clear structures, and tactile ergonomics.',
      traits: [
        { label: 'Introverted Depth', value: 82, desc: 'Quiet solitude & deliberate deep work' },
        { label: 'Intuitive Vision', value: 86, desc: 'System overview & evolutionary roadmap' },
        { label: 'Feeling & Empathy', value: 74, desc: 'Human experience & resonant connection' },
        { label: 'Judging & Order', value: 90, desc: 'Strict structure, clarity & cleanliness' },
        { label: 'Assertive Resilience', value: 78, desc: 'Calm confidence & steadfast execution' },
      ],
    },
    photoTitle: 'Real Workstation',
    gear: {
      tips: 'Productivity',
      title: 'My Everyday Gear & Workflow',
      hardwareDesc: 'Practical, reliable, and student-budget conscious. Essential tools for lectures, labs, and late night code.',
      softwareDesc: 'Clean, agile, and high information density. Harmonizing modern toolchains with automated pipelines.',
      hardware: [
        { name: 'Lenovo Laptop (Xiaoxin / Legion)', desc: 'Daily Driver · Faithful laptop for coding, university labs, and coursework', icon: 'laptop', badge: 'Daily' },
        { name: 'Redmi / AOC 24" Eye-Care Monitor', desc: 'Desk Secondary · Affordable dual-screen setup for reading docs while coding', icon: 'monitor' },
        { name: 'Custom Red-Switch Mechanical Keyboard', desc: 'Quiet & Tactile · Smooth typing without disturbing dorm roommates', icon: 'keyboard' },
        { name: 'Noise-Canceling In-Ear Earphones', desc: 'Study Flow · Essential gear to block ambient noise in libraries and dorms', icon: 'headphones' },
      ],
      software: [
        { name: 'Cursor & VS Code', desc: 'Tokyo Night Theme · Modern AI-assisted pair programming & agile coding', icon: 'code', badge: 'Editor' },
        { name: 'Raycast', desc: 'Workflow Control Deck · Millisecond hotkeys and quick script execution', icon: 'zap' },
        { name: 'Figma', desc: 'Interface Drafting · Pixel-level layout polish and component sketches', icon: 'figma' },
        { name: 'Cloudflare Pages & D1', desc: 'Global Edge Runtime · Modern zero-cold-start distributed architecture', icon: 'cloud', badge: 'Cloud' },
      ],
    },
    manifesto: {
      tips: 'Pledge',
      title: 'In an era of fleeting feeds, tending an enduring digital garden.',
      subtitle: 'Rejecting disposable hype to distill long-lasting value with genuine code and structured essays.',
      pillars: [
        { title: 'Data Sovereignty & Independence', desc: 'Never compromised by algorithmic feeds or walled gardens. Preserving technical discoveries on self-owned digital soil.', tag: 'Sovereignty', icon: 'shield' },
        { title: 'Deep Thought & Enduring Value', desc: 'Refusing fragmented distraction. Documenting real problem-solving journeys in depth, letting knowledge compound over time.', tag: 'Longevity', icon: 'feather' },
        { title: 'Digital Craftsmanship', desc: 'From clean code to typography and tactile feedback, every detail is a craft. Pursuing performance and ergonomic delight.', tag: 'Craftsmanship', icon: 'hammer' },
      ],
    },
    topology: {
      tips: 'Architecture / Full-Stack Topology',
      title: 'Full-Stack Architecture & Cloud Deck',
      lead: 'From browser UX perception to compilation pipelines and global distributed edge infrastructure.',
      tiers: [
        {
          num: '01',
          title: 'Perception & UX Tier',
          subtitle: 'Client & User Experience',
          items: [
            { name: 'Astro 6', desc: 'Blazing Fast Islands Architecture', dot: 'blue' },
            { name: 'React 19', desc: 'Dynamic Interactive Checkout', dot: 'cyan' },
            { name: 'TypeScript 5.8', desc: 'End-to-End Strict Typing', dot: 'blue' },
            { name: 'Tailwind CSS 3.4', desc: 'Fluid Utility Typography', dot: 'teal' },
          ],
        },
        {
          num: '02',
          title: 'Compilation Pipeline',
          subtitle: 'Markdown & Content Engine',
          items: [
            { name: 'MDX & Remark', desc: 'AST Syntax Enhancement', dot: 'orange' },
            { name: 'Shiki Dual Theme', desc: 'Zero-Runtime Syntax Highlighting', dot: 'purple' },
            { name: 'KaTeX & Math', desc: 'Pure CSS Math Typesetting', dot: 'green' },
            { name: 'Mermaid Diagrams', desc: 'In-situ Architectural Graphs', dot: 'red' },
          ],
        },
        {
          num: '03',
          title: 'Edge Infrastructure',
          subtitle: 'Cloudflare Distributed Tier',
          items: [
            { name: 'Cloudflare Pages', desc: 'Global Anycast Edge CDN', dot: 'orange' },
            { name: 'Cloudflare D1', desc: 'Edge SQLite Comment Database', dot: 'blue' },
            { name: 'Cloudflare Workers', desc: 'Serverless Instant API Gateway', dot: 'yellow' },
            { name: 'GitOps Workflow', desc: 'Automated Multi-Remote CI & Audit', dot: 'green' },
          ],
        },
      ],
    },
    soundtrack: {
      tips: 'Music Taste',
      title: 'Finding Focus Between Melody & Code',
      summary: 'When writing code, music acts as the finest white noise. When drafting essays, melody meters the flow of thought.',
      song: 'Way Back Home / 彼女は旅に出る',
      artist: 'Scop · SHAUN · Melodic Flow',
    },
    game: {
      tips: 'Immersive Passion',
      title: 'Digital Craft & Geek Experiments',
      summary: 'Unifying content, interface, and tactile micro-interactions into an enduring personal work.',
    },
    comic: {
      tips: 'Key Interests',
      title: 'Key Interests',
      items: ['Systems Architecture', 'Design Systems', 'Reading Ergonomics', 'Human-AI Synergy'],
    },
    milestones: {
      tips: 'Evolution / Milestones',
      title: 'Life Journey & Creator Milestones',
      lead: 'Born in 2006: From the first line of code to navigating college life and cultivating a digital garden.',
      items: [
        { year: '2006', tag: 'Origins', title: 'Born in 2006', desc: 'Born in the summer of 2006, growing up alongside the explosion of the open internet and modern computing.' },
        { year: '2022', tag: 'First Code', title: 'First Hello World', desc: 'Encountered programming in high school, discovering the sheer magic of building digital tools from scratch.' },
        { year: '2024', tag: 'College', title: 'Computer Science Undergrad', desc: 'Stepped into university as a CS undergraduate; created the first personal static blogs and research setups.' },
        { year: '2026', tag: 'Digital Garden', title: 'Refining Personal Digital Garden', desc: 'Sophomore year; engineered edge-native comment systems, multi-currency flows, and deep knowledge architecture.', isCurrent: true },
        { year: 'Future', tag: 'Lifelong', title: 'Quiet Roots & Broad Horizons', desc: 'Staying curious, grounded, and sincere at the crossroads of software craftsmanship and human thought.', isFuture: true },
      ],
    },
    maxim: {
      tips: 'Motto',
      top: 'Nurture deep roots quietly',
      bottom: 'Build broad paths forward',
      annotation: 'Delve into quiet fundamentals to connect distant horizons.',
    },
    buff: {
      tips: 'Buff',
      top: 'Intentional Construction',
      bottom: 'Matters More Than Fleeting Noise',
    },
    connect: {
      tips: 'Stay Connected',
      title: 'Walking with Fellow Explorers',
      summary: 'Whether you want to discuss web engineering, college life, writing ergonomics, or open-source ideas, feel free to reach out.',
      items: [
        { label: 'GitHub', desc: 'Explore open-source projects & code footprint', icon: 'github', href: 'https://github.com/shijianus' },
        { label: 'Telegram', desc: 'Everyday dialogue & quick discussions', icon: 'telegram', href: 'https://t.me/chronoral' },
        { label: 'RSS Feed', desc: 'Stay updated via modern RSS readers', icon: 'rss', href: '/rss.xml' },
        { label: 'Email', desc: 'Long-form letters & thoughtful exchanges', icon: 'mail', href: 'mailto:contact@epocanvas.com' },
      ],
    },
  },
  'fr': {
    langCode: 'fr',
    switchLabel: 'Profils linguistiques',
    langName: 'Français',
    flag: '🇫🇷',
    url: '/fr/about/',
    pageTitle: 'À propos',
    pageSubtitle: 'Enracinement discret · Voies larges vers l\'avenir',
    authorName: 'Léon Boven',
    authorRole: 'Étudiant (né en 2006) · Explorateur Web · Jardinier numérique',
    sayHelloName: 'Léon Boven',
    helloTips: 'Bonjour, enchanté de vous rencontrer',
    helloLead: 'Bonjour, j\'écris et conçois ici',
    helloDescription: 'Étudiant (né en 2006) · Explorateur Web · Jardinier numérique',
    floatingTagsLeft: ['Étudiant en info', 'Né en 2006', 'Souci du détail'],
    floatingTagsRight: ['Open Source', 'Vision long terme', 'Jardin numérique'],
    chips: ['#Astro', '#TypeScript', '#Tailwind', '#Cloudflare', '#UI/UX', '#Étudiant', '#Souveraineté'],
    siteTips: {
      tips: 'Fondation',
      titleTop: 'Ancrage',
      titleBottom: 'Horizons Vastes',
      words: ['Racines Sûres', 'Horizons Ouverts', 'Rigueur Paisible', 'Valeur Durable'],
      lead: 'Né en 2006, étudiant en informatique. Forger des bases solides pour ouvrir de vastes horizons. À l\'ère de la distraction algorithmique, cet endroit cultive la lecture attentive, l\'écriture sincère et l\'artisanat numérique.',
    },
    skills: {
      tips: 'Compétences',
      title: 'Boîte à outils créative',
    },
    careers: {
      tips: 'Parcours',
      title: 'Étapes & Vision durable',
      items: [
        { label: 'Consolider les bases en informatique et en génie logiciel durant mes études universitaires', accent: '#5b8cff' },
        { label: 'Bâtir un jardin numérique personnel pérenne et évolutif plutôt qu\'une page éphémère', accent: '#ff7d55' },
        { label: 'Explorer la convergence du web moderne, des systèmes de design et de la synergie humain-IA', accent: '#30c48d' },
      ],
    },
    stats: {
      tips: 'Données',
      title: 'Télémétrie',
      btnLabel: 'Voir les archives',
    },
    map: {
      title: 'Actuellement à',
      accent: 'UTC-8',
      status: 'Inspiration active · En création continue',
    },
    selfInfo: [
      { label: 'Né en', value: '2006', accent: '#43a6c6' },
      { label: 'Orientation', value: 'Exploration Web', accent: '#c69043' },
      { label: 'Niveau actuel', value: 'Étudiant en licence', accent: '#b04fe6' },
    ],
    personality: {
      tips: 'Personnalité',
      type: 'INFJ-A',
      title: 'Avocat / Penseur d\'architecture',
      summary: 'Attachement naturel à l\'ordre, aux détails et à l\'empathie. Passionné par les systèmes durables et l\'ergonomie soignée.',
      traits: [
        { label: 'Profondeur introversive', value: 82, desc: 'Solitude productive & concentration profonde' },
        { label: 'Vision intuitive', value: 86, desc: 'Compréhension globale & évolution systémique' },
        { label: 'Sentiment & Empathie', value: 74, desc: 'Expérience humaine & résonance sensible' },
        { label: 'Jugement & Clarté', value: 90, desc: 'Discipline stricte, netteté & rigueur' },
        { label: 'Assurance sereine', value: 78, desc: 'Confiance paisible & exécution déterminée' },
      ],
    },
    photoTitle: 'Espace de travail',
    gear: {
      tips: 'Productivité',
      title: 'Mon matériel & flux de travail',
      hardwareDesc: 'Pragmatique, fiable et adapté à la vie étudiante. Mes compagnons pour les cours, les TPs et le code.',
      softwareDesc: 'Minimaliste, rapide et riche en information. Intégration fluide d\'outils modernes et de pipelines automatisés.',
      hardware: [
        { name: 'PC Portable Lenovo (Xiaoxin / Legion)', desc: 'Machine principale · Ordinateur étudiant polyvalent pour le code et les études', icon: 'laptop', badge: 'Daily' },
        { name: 'Écran 24" Redmi / AOC Confort Visuel', desc: 'Second écran · Double affichage abordable pour lire la documentation tout en codant', icon: 'monitor' },
        { name: 'Clavier Mécanique Switch Rouge', desc: 'Silencieux & Fluide · Frappe douce sans déranger les colocataires en dortoir', icon: 'keyboard' },
        { name: 'Écouteurs Intra-auriculaires Réduction de Bruit', desc: 'Focus d\'étude · Outil indispensable pour s\'isoler du bruit en bibliothèque', icon: 'headphones' },
      ],
      software: [
        { name: 'Cursor & VS Code', desc: 'Thème Tokyo Night · Programmation assistée et écriture de code fluide', icon: 'code', badge: 'Editor' },
        { name: 'Raycast', desc: 'Centre névralgique · Raccourcis ultra-rapides et gestion de scripts', icon: 'zap' },
        { name: 'Figma', desc: 'Conception d\'interface · Prototypage précis et ébauches de composants', icon: 'figma' },
        { name: 'Cloudflare Pages & D1', desc: 'Infrastructure Edge · Architecture moderne distribuée sans démarrage à froid', icon: 'cloud', badge: 'Cloud' },
      ],
    },
    manifesto: {
      tips: 'Manifeste',
      title: 'À l\'ère du flux éphémère, cultiver un jardin numérique durable.',
      subtitle: 'Refuser le bruit passager pour déposer une valeur durable avec du code propre et des écrits sincères.',
      pillars: [
        { title: 'Souveraineté des données', desc: 'Ne pas céder aux algorithmes ni aux plateformes closes. Conserver chaque découverte sur son propre territoire numérique.', tag: 'Souveraineté', icon: 'shield' },
        { title: 'Pensée lente & Valeur pérenne', desc: 'Refuser la fragmentation. Raconter la résolution de vrais problèmes techniques, laissant la connaissance croître avec le temps.', tag: 'Pérennité', icon: 'feather' },
        { title: 'Artisanat numérique', desc: 'Du code propre aux détails typographiques et micro-interactions, tout est ouvrage. Viser la performance et le confort humain.', tag: 'Artisanat', icon: 'hammer' },
      ],
    },
    topology: {
      tips: 'Architecture / Topologie Full-Stack',
      title: 'Architecture Full-Stack & Socle Cloud',
      lead: 'De la perception utilisateur aux pipelines de compilation et à l\'infrastructure globale distribuée.',
      tiers: [
        {
          num: '01',
          title: 'Niveau Perception & UX',
          subtitle: 'Interface Client & Ergonomie',
          items: [
            { name: 'Astro 6', desc: 'Architecture Islands ultra-rapide', dot: 'blue' },
            { name: 'React 19', desc: 'Composants interactifs dynamiques', dot: 'cyan' },
            { name: 'TypeScript 5.8', desc: 'Typage strict de bout en bout', dot: 'blue' },
            { name: 'Tailwind CSS 3.4', desc: 'Typographie fluide & utilitaire', dot: 'teal' },
          ],
        },
        {
          num: '02',
          title: 'Niveau Pipeline de Contenu',
          subtitle: 'Moteur Markdown & AST',
          items: [
            { name: 'MDX & Remark', desc: 'Analyse et enrichissement AST', dot: 'orange' },
            { name: 'Shiki Dual Theme', desc: 'Coloration syntaxique sans runtime', dot: 'purple' },
            { name: 'KaTeX & Math', desc: 'Rendu mathématique pur CSS', dot: 'green' },
            { name: 'Mermaid Diagrams', desc: 'Rendu direct de schémas techniques', dot: 'red' },
          ],
        },
        {
          num: '03',
          title: 'Niveau Infrastructure Edge',
          subtitle: 'Socle Cloudflare Distribué',
          items: [
            { name: 'Cloudflare Pages', desc: 'CDN Anycast mondial ultra-rapide', dot: 'orange' },
            { name: 'Cloudflare D1', desc: 'Base SQLite Edge pour commentaires', dot: 'blue' },
            { name: 'Cloudflare Workers', desc: 'Passerelle API Serverless instantanée', dot: 'yellow' },
            { name: 'GitOps Workflow', desc: 'Déploiement multi-remote & audit continu', dot: 'green' },
          ],
        },
      ],
    },
    soundtrack: {
      tips: 'Musique',
      title: 'Trouver le rythme entre mélodie et code',
      summary: 'En écrivant du code, la musique est le meilleur bruit blanc. En composant un essai, la mélodie cadence la pensée.',
      song: 'Way Back Home / 彼女は旅に出る',
      artist: 'Scop · SHAUN · Douceur quotidienne',
    },
    game: {
      tips: 'Passion créative',
      title: 'Création numérique & Expérimentations',
      summary: 'Rassembler le fond, l\'interface et les micro-interactions en une œuvre personnelle pérenne.',
    },
    comic: {
      tips: 'Sujets d\'intérêt',
      title: 'Sujets d\'intérêt',
      items: ['Architecture système', 'Systèmes de design', 'Ergonomie de lecture', 'Synergie humain-IA'],
    },
    milestones: {
      tips: 'Évolution / Jalons',
      title: 'Parcours de vie & Jalons créatifs',
      lead: 'Né en 2006: Des premières lignes de code à la vie étudiante et à la construction d\'un jardin numérique.',
      items: [
        { year: '2006', tag: 'Origines', title: 'Naissance en 2006', desc: 'Né au cœur de l\'été 2006, grandissant au rythme de la révolution numérique et du web ouvert.' },
        { year: '2022', tag: 'Premières lignes', title: 'Premier Hello World', desc: 'Découverte de la programmation au lycée, fasciné par la possibilité de construire des univers avec du code.' },
        { year: '2024', tag: 'Université', title: 'Études en informatique', desc: 'Entrée en licence d\'informatique; conception des premiers blogs statiques et espaces de recherche.' },
        { year: '2026', tag: 'Jardin numérique', title: 'Écosystème & Jardin personnel', desc: 'Deuxième année d\'études; développement d\'un système de commentaires edge, de modules bilingues et d\'une architecture solide.', isCurrent: true },
        { year: 'Avenir', tag: 'Quête durable', title: 'Racines discrètes & Voies ouvertes', desc: 'Rester humble et curieux au carrefour du code rigoureux et de la pensée humaine.', isFuture: true },
      ],
    },
    maxim: {
      tips: 'Devise',
      top: 'Enracinement discret',
      bottom: 'Voies larges vers l\'avenir',
      annotation: 'Forger des bases solides pour ouvrir de vastes horizons.',
    },
    buff: {
      tips: 'Principe',
      top: 'Construire avec intention',
      bottom: 'Vaut mieux que le bruit éphémère',
    },
    connect: {
      tips: 'Contact',
      title: 'Cheminer avec d\'autres passionnés',
      summary: 'Que ce soit pour discuter d\'ingénierie web, de la vie universitaire, de typographie ou d\'open source, n\'hésitez pas à m\'écrire.',
      items: [
        { label: 'GitHub', desc: 'Consulter les projets open-source & dépôts', icon: 'github', href: 'https://github.com/shijianus' },
        { label: 'Telegram', desc: 'Discussions quotidiennes & échanges spontanés', icon: 'telegram', href: 'https://t.me/chronoral' },
        { label: 'Flux RSS', desc: 'Suivre les nouvelles publications via lecteur RSS', icon: 'rss', href: '/rss.xml' },
        { label: 'Courriel', desc: 'Échanges approfondis & lettres sincères', icon: 'mail', href: 'mailto:contact@epocanvas.com' },
      ],
    },
  },
};

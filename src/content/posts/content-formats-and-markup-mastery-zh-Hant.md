---
title: "靜態站點生成器（SSG）與博客主題內容格式全景指南：從主流支持到特異功能、下拉框交互與排版美化"
pubDate: 2026-08-28
updatedDate: 2026-08-28
description: "全面系統梳理 Hugo、Jekyll、Eleventy、Astro、Hexo、WordPress 等主流靜態站點與博客系統的內容格式支持清單。從 Markdown、MDX、HTML、AsciiDoc、Org-mode、RST 到全量實裝的 WordPress Post Formats、交互式下拉框切換器、手風琴折疊、KaTeX 數學公式、Mermaid 圖表與密碼加密特異功能。"
author: "shijianus"
category: "系統設計"
group: "技術規範"
featured: true
sticky: 10
postFormat: "standard"
markup: "markdown"
tags: ["SSG", "Markdown", "MDX", "Astro", "主題格式", "EpoCanvas", "排版規範", "UI", "Mindmap", "思維導圖"]
mermaid: true
mindmap: true
i18nKey: "content-formats-and-markup-mastery"
lang: "zh-Hant"
aiTranslatedFrom: "zh-CN"
---
# 靜態站點生成器（SSG）與主題內容格式全景指南

在現代靜態站點生成器（SSG）與獨立部落格主題工程中，**文章內容格式的解析與呈現能力**直接決定了創作者的表達邊界與讀者的閱讀體驗。

本篇指南結合主流 SSG 生態（**Hugo、Jekyll、Eleventy、Astro、Pelican、Hexo、WordPress、VitePress** 等）的內容規範，建立起一套覆蓋 **基礎 Markup、擴展文件語言、WordPress Post Formats、互動式下拉框切換器、手風琴折疊、LaTeX 數學公式、Mermaid 圖表及加密解密特異功能** 的全景體系，並提供即插即用的活體渲染示範。

---

## 一、主流靜態站點生成器（SSG）內容格式支援與生態彙總

不同的靜態站點生成器在內容解析架構上有不同的選型哲學。下表系統彙總了主流引擎對各種格式的原生與擴展支援情況：

| 靜態站點生成器 / 平台 | 核心解析引擎 | 原生內建支援格式 | 擴展 / 外部工具支援格式 | Front Matter 序列化支援 |
| :--- | :--- | :--- | :--- | :--- |
| **Hugo** | Goldmark (Go) | `.md` (CommonMark/GFM), `.html`, `.org` (Org-mode) | `.adoc` (Asciidoctor), `.rst` (rst2html), `.pdc` (Pandoc) | YAML (`---`), TOML (`+++`), JSON (`{}`) |
| **Astro (本部落格架構)** | Vite + Unified/Remark + MDX | `.md` (GFM), `.mdx` (JSX), `.html`, `.astro` 元件 | 可掛載 AST Loader 擴展 Org/AsciiDoc/RST | YAML, TOML, JSON |
| **Jekyll** | Kramdown (Ruby) | `.md` (Kramdown/GFM), `.html` | `.textile` (Textile 插件) | YAML |
| **Eleventy (11ty)** | JavaScript 模板管道 | `.md`, `.html`, `.liquid`, `.njk`, `.ejs`, `.webc` | MDX (插件), 自訂 Template 擴展 | YAML, JSON, JS/11tydata |
| **Hexo** | Marked / Hexo-Renderer | `.md` (GFM), `.html`, EJS/Pug 模板 | Org-mode / Pandoc (插件支援) | YAML, JSON |
| **Pelican** | Python Docutils | `.md` (Markdown), `.rst` (reStructuredText) | `.asciidoc` (Asciidoctor) | YAML, Markdown Metadata |
| **WordPress (Headless/Theme)** | Gutenberg Block Engine | HTML5 Blocks, Shortcodes, Post Formats | Classic Editor HTML | JSON 塊元資料 / Post Meta |
| **VitePress / Docusaurus** | Markdown-It / MDX | `.md`, `.mdx`, Vue/React 元件 | 自訂容器語法 (`::: tip`) | YAML |

> [!NOTE]
> **生態架構洞察**：Hugo 憑藉 Go 語言的高並發原生支援了 Markdown 與 Org-mode；而以 **Astro** 為代表的現代前端 SSG，則憑藉 **MDX 與組件化群島（Islands）能力**，實現了將動態交互 UI（如本文演示的下拉框切換器、密碼彈窗、黑膠唱片）無縫嵌入正文的終極靈活性。

---

## 二、Front Matter 序列化格式支援規範

部落格文章頭部的元資料（Front Matter）決定了文章的路由、標題、時間、分類、封面及受保護狀態。本主題支援全部主流序列化模式：

### 1. YAML 格式（最廣泛使用，推薦預設）

```yaml
---
title: "文章标题"
pubDate: 2026-08-28
author: "shijianus"
tags: ["Astro", "Markdown"]
featured: true
postFormat: "aside"
---
```

### 2. TOML 格式（Hugo 常用）

```toml
+++
title = "文章标题"
pubDate = 2026-08-28T00:00:00Z
author = "shijianus"
tags = ["Astro", "Markdown"]
featured = true
+++
```

### 3. JSON 格式（API 驅動與 Headless 場景）

```json
{
  "title": "文章标题",
  "pubDate": "2026-08-28T00:00:00.000Z",
  "author": "shijianus",
  "tags": ["Astro", "Markdown"],
  "featured": true
}
```

---

## 三、特殊輕量 Markup 與非 Markdown 格式對照及遷移對應

在不同技術棧中，作者可能使用除 Markdown 外的其他輕量標記語言。以下提供主流格式的語法特性及在本主題中的等價呈現：

### 1. AsciiDoc (.adoc / .asciidoc)

AsciiDoc 常見於技術書籍與長篇工程手冊，擁有極其豐富的提示塊與屬性系統：

```asciidoc
// AsciiDoc 源码语法
= AsciiDoc 技术规范
:author: shijianus
:toc: macro

[NOTE]
====
这是一条 AsciiDoc 风格的注意卡片。
====

[cols="1,2,1", options="header"]
|===
| 模块 | 描述 | 状态
| 核心引擎 | Astro 6 静态管线 | 已就绪
|===
```

**本主題中的 Markdown / MDX 等效寫法**：

> [!NOTE]
> 這是一條在 Astro 主題中原生渲染的等效注意卡片，樣式與互動完全對齊。

| 模块 | 描述 | 状态 |
| :--- | :--- | :---: |
| **核心引擎** | Astro 6 靜態管線 | <span class="badge badge-success">已就緒</span> |

### 2. Emacs Org-Mode (.org)

Org-mode 是 Emacs 使用者進行知識管理、任務追蹤與文件編寫的強大工具：

```ini
#+TITLE: Emacs Org-Mode 实践笔记
#+DATE: 2026-08-28
#+TAGS: Emacs OrgMode

* TODO 第一阶段：Markdown 扫描增强 [1/2]
- [X] 修复表格与移动端溢出
- [ ] 补全 Org-mode 语法转换器

#+BEGIN_QUOTE
“Org-mode 不仅是格式，更是一种可执行的思维工作流。”
#+END_QUOTE
```

**本主題中的標準靜態 GFM 任務清單呈現（只讀狀態）**：

- [x] 修復表格與移動端溢出
- [ ] 補全 Org-mode 語法轉換器

> [!QUOTE]
> “Org-mode 不僅是格式，更是一種可執行的思維工作流。”

#### 可交互式任务清单与联动进度条（互动教程检查清单与链式进度）

在技术教程、实战演练与部署指南中，传统的只读 `[ ]` 任务清单无法直观交互与记忆。本主题特别增设了**支持实时勾选与连锁状态联动的可交互清单（`.article-task-tracker`）**。读者每勾选一项，动态进度条将实时重新计算百分比，当全部关键步骤确认完毕后，还将**自动连锁解锁下游就绪指令**，非常适合用作教程的通关检查表：

<div class="article-task-tracker" data-storage-key="content-format-tutorial-demo">
  <div class="task-tracker__header">
    <div class="task-tracker__title">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
      <span>静态站点工程化上线部署前置检查清单（可交互实时打勾）</span>
    </div>
    <span class="task-tracker__count">1/4 步骤已完成 (25%)</span>
  </div>
  <div class="task-tracker__bar-wrap">
    <div class="task-tracker__fill" style="width: 25%;"></div>
  </div>
  <ul class="task-checklist">
    <li class="task-checklist-item is-done">
      <input type="checkbox" checked id="chk-step-1" />
      <div class="task-item-body">
        <label for="chk-step-1" class="task-item-label">步骤 1：完成本地代码全量备份与 Git Commit</label>
        <div class="task-item-desc">确认当前工作树干净，备份 Hash 记录至开发审计日志。</div>
      </div>
    </li>
    <li class="task-checklist-item">
      <input type="checkbox" id="chk-step-2" />
      <div class="task-item-body">
        <label for="chk-step-2" class="task-item-label">步骤 2：配置 Cloudflare Pages 静态构建管线</label>
        <div class="task-item-desc">设置 <code>BLOG_BUILD_TARGET=static</code> 与 Node.js 20+ 运行时环境。</div>
      </div>
    </li>
    <li class="task-checklist-item">
      <input type="checkbox" id="chk-step-3" />
      <div class="task-item-body">
        <label for="chk-step-3" class="task-item-label">步骤 3：验证媒体资源与外部视频/音频内嵌</label>
        <div class="task-item-desc">确保所有音频与视频单文件体积严格控制在 25MB 以内，满足 CDN 部署规范。</div>
      </div>
    </li>
    <li class="task-checklist-item">
      <input type="checkbox" id="chk-step-4" />
      <div class="task-item-body">
        <label for="chk-step-4" class="task-item-label">步骤 4：执行 Playwright 自动化视觉回归与烟测</label>
        <div class="task-item-desc">验证 PC 端与移动端多分辨率下所有富媒体卡片与交互组件排版正常。</div>
      </div>
    </li>
  </ul>
  <div class="task-tracker__status-card is-pending">
    <div class="status-card__header">
      <span class="badge badge-warning">⏳ 待办就绪中</span>
      <span style="font-weight:700;">当前进度：1/4 (25%)</span>
    </div>
    <p style="margin-top:0.4rem;margin-bottom:0;font-size:0.88rem;line-height:1.6;">请依次完成上方清单中打勾的每个步骤；当所有任务完成后，此处将实时连锁解锁生产发布指令。</p>
    </div>
</div>

---

### 3. reStructuredText (.rst)

reStructuredText 是 Python 社区（如 Sphinx、ReadTheDocs）的标准文档格式：

```rst
.. reStructuredText 源码语法
.. note::
   这是一条 RST 指令定义的 Note 块。

.. code-block:: python
   :linenos:

   def greet(name: str) -> str:
       return f"Hello, {name}!"
```

**本主题中的 Markdown 等效呈现**：

> [!NOTE]
> 这是在 Astro 中以 GitHub Alert 规范呈现的 RST Note 等价卡片。

```python
def greet(name: str) -> str:
    return f"Hello, {name}!"
```

---

### 4. Textile 语法

Textile 是老牌轻量级标记语言（常见于 Redmine 与早期 Jekyll 博客）：

```markdown
h2. 章节标题
bq. 这是 Textile 引用块内容。
*列表项 1*
_斜体强调文本_
```

---

## 四、WordPress 风格文章形态（Post Formats）全量实装与视觉呈现

WordPress 主题生态中经典的 **Post Formats** 机制允许博客针对不同类型的内容展现专属的视觉形态。我们在本主题正文栏中完整实现了这 9 种形态：

### 1. `aside`（轻语 / 便签 / 随笔卡片）

适合记录短小的思考灵感、备忘提醒或临时笔记：

<div class="article-aside">
  <p><strong>💡 随笔备忘</strong>：静态站点的真正价值不在于炫技，而在于交付极速、零服务端维护负担的纯粹阅读体验。即便经过五年、十年，生成的 HTML 文件依然可以完美打开。</p>
</div>

### 2. `status`（狀態動態 / 碎碎念 / 微語錄）

類似 Twitter/微博風格的即時狀態發布卡片，包含作者頭像、客戶端標識與心情標籤：

<div class="article-status">
  <div class="article-status__header">
    <div class="article-status__user">
      <img class="article-status__avatar" src="/media/shijianus/avatar.jpg" alt="作者头像" />
      <div>
        <div class="article-status__name">shijianus</div>
        <div class="article-status__meta">發布於 2026-08-28 14:32 · 🇨🇳 杭州</div>
      </div>
    </div>
    <div class="article-status__badge">
      <span>📱 來自 極客工坊 Mac Studio</span>
    </div>
  </div>
  <p class="article-status__content">
    今天終於完成了部落格主內容欄的全部格式擴展與視覺重構！從 KaTeX、Mermaid 到互動式下拉框與黑膠唱片，全棧靜態交付的感覺太棒了 🚀✨
  </p>
</div>

---

### 3. `quote`（精選引言 / 名言大卡片）

用於展現極具分量的人物語錄、設計箴言或金句：

<div class="article-quote">
  <div class="article-quote__icon">“</div>
  <div class="article-quote__body">
    Simplicity is prerequisite for reliability. (簡單是可靠的前提條件。)
  </div>
  <div class="article-quote__author">
    <img src="/media/shijianus/avatar.jpg" alt="Edsger W. Dijkstra" />
    <div class="article-quote__author-info">
      <div class="article-quote__author-name">Edsger W. Dijkstra</div>
      <div class="article-quote__author-title">計算機科學家 · 圖靈獎得主 (1972)</div>
    </div>
  </div>
</div>

---

### 4. `gallery`（圖片畫廊 / 自適應相冊與拍立得網格）

支援多列自適應回應式網格與具有人文質感的拍立得相紙卡片，點擊任意圖片均可觸發全螢幕燈箱放大：

#### 2 列與 3 列自適應畫廊

<div class="article-gallery">
  <div class="gallery-grid gallery-grid-3">
    <div class="gallery-item">
      <img src="/media/shijianus/workbench.jpg" alt="極客工作台全景" />
      <div class="gallery-item__caption">極客工作台全景</div>
    </div>
    <div class="gallery-item">
      <img src="/media/shijianus/system.jpg" alt="系統架構設計大屏" />
      <div class="gallery-item__caption">系統架構設計大屏</div>
    </div>
    <div class="gallery-item">
      <img src="/media/shijianus/default.png" alt="星河漫遊視覺封面" />
      <div class="gallery-item__caption">星河漫遊視覺封面</div>
    </div>
  </div>
</div>

#### 拍立得相紙畫廊（Polaroid Style）

<div class="gallery-polaroid">
  <div class="polaroid-card">
    <img src="/media/shijianus/workbench.jpg" alt="2026 研發展望" />
    <div class="polaroid-card__caption">2026.04 杭州·研發基地</div>
  </div>
  <div class="polaroid-card">
    <img src="/media/shijianus/system.jpg" alt="架構重構之夜" />
    <div class="polaroid-card__caption">2026.08 架構演進重構夜</div>
  </div>
</div>

---

### 5. `video`（自適應影片播放卡片）

支援 16:9 回應式比例、圓角邊框與底欄說明，單行獨佔一個完整橫位展示。相容 Bilibili、YouTube 外部代理式嵌入及站內原生 MP4（單檔案均控制在 25MB 以內，滿足 Cloudflare Pages 靜態部署規範）：

#### 外部影片內嵌（Bilibili & YouTube 連結代理式嵌入 · 預設需讀者翻到此處並點擊開始播放）

<div class="video-embed-card" data-video-type="bilibili">
  <iframe src="https://player.bilibili.com/player.html?bvid=BV11k4y1T7kS&page=1&high_quality=1&danmaku=0&autoplay=0" allowfullscreen="true" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" sandbox="allow-top-navigation-by-user-activation allow-same-origin allow-forms allow-scripts allow-popups"></iframe>
  <div class="embed-caption">🎬 Bilibili 外部內嵌演示：BV11k4y1T7kS (1080P 高清 · 需翻至此處並點擊播放)</div>
</div>

<div class="video-embed-card" data-video-type="youtube">
  <iframe src="https://www.youtube-nocookie.com/embed/LXb3EKWsInQ?autoplay=0&rel=0" allowfullscreen="true" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
  <div class="embed-caption">🎬 YouTube 外部內嵌演示：Costa Rica 4K 60fps HDR 演示 (1080P/4K · 真实有效 URL · 需翻至此處並點擊播放)</div>
</div>

#### 站內原生 MP4 視頻內嵌（Native HTML5 Video Player · 支持倍速與畫中畫 · 預設禁用下載）

<div class="video-embed-card">
  <video controls controlsList="nodownload" preload="metadata" playsinline oncontextmenu="return false;">
    <source src="/media/video/landscape_compressed.mp4" type="video/mp4" />
    您的瀏覽器不支援 HTML5 視頻播放。
  </video>
  <div class="embed-caption">🎥 本地原生內嵌視頻 1：4K/1080P 超清風光演示 (體積 21.7MB · 支持倍速與畫中畫 · 已禁用直接下載)</div>
</div>

<div class="video-embed-card">
  <video controls controlsList="nodownload" preload="metadata" playsinline oncontextmenu="return false;">
    <source src="/media/video/blue_archive_miracle.mp4" type="video/mp4" />
    您的瀏覽器不支援 HTML5 視頻播放。
  </video>
  <div class="embed-caption">🎥 本地原生內嵌視頻 2：【蔚藍檔案】“奇跡的終始—我們的故事由我們來決定！” (體積 23.3MB · 支持倍速與畫中畫 · 已禁用直接下載)</div>
</div>

---

### 6. `audio`（黑膠唱片旋轉音樂卡片）

內建 HTML5 音訊控制器，並在播放時自動觸發**黑膠唱片無級平滑旋轉動效**。所有唱片封面均採用真實匹配的官方高清專輯封面，支援多種主流音訊格式（無損 FLAC、高碼率 MP3、AAC/M4A），且已內建反爬與防下載保護：

#### ① Shaun - Way Back Home（FLAC 無損音訊格式 · 24.55MB）

<div class="article-audio-card">
  <div class="audio-card__cover">
    <img src="/media/audio/covers/way_back_home.jpg" alt="Shaun - Way Back Home 專輯封面" onerror="this.src='/media/shijianus/default.png'" />
  </div>
  <div class="audio-card__info">
    <div class="audio-card__title">
      <span>Way Back Home</span>
      <span class="badge badge-purple">FLAC 無損</span>
    </div>
    <div class="audio-card__author">Shaun (숀) · 無損音訊 (FLAC / 44.1kHz 16-bit 961 kbps)</div>
    <audio controls preload="metadata" controlsList="nodownload" oncontextmenu="return false;" src="/media/audio/WayBackHome.flac"></audio>
  </div>
</div>

#### ② ヨルシカ (Yorushika) - 彼女は旅に出る（MP3 320Kbps 高清格式 · 8.41MB）

<div class="article-audio-card">
  <div class="audio-card__cover">
    <img src="/media/audio/covers/kanojo_wa_tabi_ni_deru.jpg" alt="ヨルシカ - 彼女は旅に出る 專輯封面" onerror="this.src='/media/shijianus/default.png'" />
  </div>
  <div class="audio-card__info">
    <div class="audio-card__title">
      <span>彼女は旅に出る (She Leaves on a Journey)</span>
      <span class="badge badge-success">320 Kbps MP3</span>
    </div>
    <div class="audio-card__author">ヨルシカ (Yorushika) · 高清立體聲 (MP3 / 48kHz 320 kbps)</div>
    <audio controls preload="metadata" controlsList="nodownload" oncontextmenu="return false;" src="/media/audio/彼女は旅に出る.mp3"></audio>
  </div>
</div>

#### ③ すこっぷ feat. 初音ミク - アイロニ（M4A / AAC 格式 · 7.63MB）

<div class="article-audio-card">
  <div class="audio-card__cover">
    <img src="/media/audio/covers/irony_scop.jpg" alt="すこっぷ feat. 初音ミク - アイロニ 專輯封面" onerror="this.src='/media/shijianus/default.png'" />
  </div>
  <div class="audio-card__info">
    <div class="audio-card__title">
      <span>アイロニ (Irony / 諷刺)</span>
      <span class="badge badge-cyan">M4A / AAC</span>
    </div>
    <div class="audio-card__author">すこっぷ feat. 初音ミク · AAC 音訊 (M4A / 44.1kHz 260 kbps)</div>
    <audio controls preload="metadata" controlsList="nodownload" oncontextmenu="return false;" src="/media/audio/アイロニ.m4a"></audio>
  </div>
</div>

---

### 7. `link`（外部链接与书签预览卡片 / Bookmark Preview）

為文章內的關鍵參考出處提供優雅的卡片化預覽：

<a class="article-bookmark" href="https://github.com/shijianus/shijianus-blog" target="_blank" rel="noopener">
  <div class="article-bookmark__content">
    <div class="article-bookmark__title">EpoCanvas / shijianus-blog (時間博客主題核心設計規範倉庫)</div>
    <p class="article-bookmark__desc">EpoCanvas（時代畫布）是一套專注於高密度資訊呈現、優雅微交互與全格式支援的現代化極客部落格內容架構系統。</p>
    <div class="article-bookmark__site">
      <span class="badge badge-primary">GitHub</span>
      <span>github.com · EpoCanvas Core Spec</span>
    </div>
  </div>
  <div class="article-bookmark__icon">
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
  </div>
</a>

---

### 8. `chat`（聊天氣泡對話流 / Organic Animated Dialogue Stream）

用於生動演示技術答辯、雙人對話討論或使用者訪談場景，支援左右氣泡、行內程式碼、自訂配色以及**動態內容自適應打字動效、Web Audio 合成音效與動態頭像（`footer_mini_logo__media`）**：
* **靜態模式（預設）**：`<div class="article-chat">` 保持輕量純靜態呈現，零 JS 開銷；
* **開啟動態演示（參數控制）**：配置 `data-animate="true"`（或 `class="article-chat is-animated"`），系統將在**讀者第一次捲動滑入該視口時自動觸發基於字元長度與自然隨機律決定的擬真時序打字動畫與左右專屬提示音**；
* **非機械動態時序（Content‑Length Aware Timing）**：系統根據發言長短智慧決定打字中指示器時長（短句 380ms 閃爍發出，長技術段落 1000ms+ 打字思考），並在氣泡間加入符合人類閱讀判斷的自然停頓與微頻音效抖動；
* **動態影片頭像支援（`footer_mini_logo__media`）**：頭像支援嵌入 MP4 微影片動效與靜態兜底海報；
* **單次觸發與重載保障**：首次滑入觸發後自動鎖定，後續反覆捲動不會重複觸發打擾閱讀；只有當使用者重新整理網頁（F5）重新載入時才會重新就緒；同時提供右上角「↺ 重播」與「🔊/🔇 音效切換」微控欄。

<div class="article-chat" data-animate="true" data-sound="true">
  <div class="chat-message chat-left">
    <span class="chat-avatar footer_mini_logo__media">
      <video autoplay muted loop playsinline preload="metadata" poster="/media/shijianus/avatar.jpg" aria-hidden="true">
        <source src="/media/shijianus/avatar-dynamic.mp4" type="video/mp4" />
      </video>
      <img src="/media/shijianus/avatar.jpg" alt="Léon Boven" />
    </span>
    <div class="chat-body">
      <div class="chat-author">開發者 <a href="https://github.com/LeonBoven" target="_blank" rel="noopener noreferrer">Léon Boven</a> · 10:15</div>
      <div class="chat-bubble">
        你好！請問在 Astro 中實現 <code>KaTeX</code> 和 <code>Mermaid</code> 的靜態渲染會不會拖慢前端頁面載入速度？
      </div>
    </div>
  </div>

  <div class="chat-message chat-right">
    <img class="chat-avatar" src="/media/shijianus/avatar.jpg" alt="架構師 shijianus" />
    <div class="chat-body">
      <div class="chat-author">架構師 <a href="https://github.com/shijianus" target="_blank" rel="noopener noreferrer">shijianus</a> · 10:16</div>
      <div class="chat-bubble">
        完全不會！因為 <code>remark-math</code> 和 <code>rehype-katex</code> 在建置期（Build-time）就已經把公式編譯成了純 HTML/MathML 字串，瀏覽器端 <strong>0 JS 執行時負擔</strong>；而 Mermaid 圖表也是動態按需非同步載入 ESM 模組，首屏極其輕快！⚡
      </div>
    </div>
  </div>
</div>

<div class="chat-message chat-left">
    <span class="chat-avatar footer_mini_logo__media">
      <video autoplay muted loop playsinline preload="metadata" poster="/media/shijianus/avatar.jpg" aria-hidden="true">
        <source src="/media/shijianus/avatar-dynamic.mp4" type="video/mp4" />
      </video>
      <img src="/media/shijianus/avatar.jpg" alt="Léon Boven" />
    </span>
    <div class="chat-body">
      <div class="chat-author">開發者 <a href="https://github.com/LeonBoven" target="_blank" rel="noopener noreferrer">Léon Boven</a> · 10:17</div>
      <div class="chat-bubble">
        太棒了！那我們在 Markdown 裡直接寫架構時序圖和交互式單位換算器也是開箱即用的對吧？
      </div>
    </div>
  </div>

  <div class="chat-message chat-right">
    <img class="chat-avatar" src="/media/shijianus/avatar.jpg" alt="架构师 shijianus" />
    <div class="chat-body">
      <div class="chat-author">架構師 <a href="https://github.com/shijianus" target="_blank" rel="noopener noreferrer">shijianus</a> · 10:18</div>
      <div class="chat-bubble">
        對的！不僅雙擊放大與高清 SVG 匯出已全量具備，單位換算器更是接入了<strong>即時聯網外匯牌價同步</strong>與<strong>基準單位下拉切換</strong>，而且保證固定品質單位完整對稱表達，所有度量均經過嚴謹測試！🚀
      </div>
    </div>
  </div>

  <div class="chat-message chat-left">
    <span class="chat-avatar footer_mini_logo__media">
      <video autoplay muted loop playsinline preload="metadata" poster="/media/shijianus/avatar.jpg" aria-hidden="true">
        <source src="/media/shijianus/avatar-dynamic.mp4" type="video/mp4" />
      </video>
      <img src="/media/shijianus/avatar.jpg" alt="Léon Boven" />
    </span>
    <div class="chat-body">
      <div class="chat-author">開發者 <a href="https://github.com/LeonBoven" target="_blank" rel="noopener noreferrer">Léon Boven</a> · 10:19</div>
      <div class="chat-bubble">
        收到！這個交互手感與根據訊息長短變化的打字動畫非常自然，我這就把團隊的技術文件庫升級上來！🎉
      </div>
    </div>
  </div>

  <div class="chat-message chat-right">
    <img class="chat-avatar" src="/media/shijianus/avatar.jpg" alt="架构师 shijianus" />
    <div class="chat-body">
      <div class="chat-author">架構師 <a href="https://github.com/shijianus" target="_blank" rel="noopener noreferrer">shijianus</a> · 10:20</div>
      <div class="chat-bubble">
        歡迎體驗！後續如果遇到任何格式擴展或客製需求，隨時在討論區或 GitHub 交流探討~ ✨
      </div>
    </div>
  </div>
</div>

---

## 五、特殊的下拉框格式與動態交互元件（Dropdown Selectors & Interactive Formats）

針對使用者明確要求的**特殊下拉框格式**，我們在文章正文層提供了純客戶端即時回應的下拉選擇器元件：

### 1. 多框架與多程式碼版本下拉切換器（Interactive Dropdown Switcher）

讀者可以在下拉框中自由選擇技術框架，正文面板將即時無重新整理切換對應的內容與程式碼：

<div class="article-dropdown-switcher">
  <div class="article-dropdown-switcher__header">
    <div class="article-dropdown-switcher__title">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="m14 9 3 3-3 3"/></svg>
      <span>请选择要查看的前端框架实现代码：</span>
    </div>
    <select class="article-select dropdown-switcher__select">
      <option value="react-tab">⚛️ React 19 (Hooks & TSX)</option>
      <option value="vue-tab">🟢 Vue 3.5 (Composition API)</option>
      <option value="astro-tab">🚀 Astro 6 (Island Component)</option>
      <option value="svelte-tab">🟠 Svelte 5 (Runes)</option>
    </select>
  </div>
  <div class="article-dropdown-switcher__body">
    <div class="article-dropdown-panel is-active" data-panel="react-tab">
      <div class="article-dropdown-panel__title">⚛️ React 19 组件实现方式：</div>
      <pre class="no-code-enhance"><code class="language-tsx">import { useState } from 'react';
export function Counter() {
  const [count, setCount] = useState(0);
  return (
    &lt;button onClick={() =&gt; setCount((c) =&gt; c + 1)} className="btn-primary"&gt;
      React 点击计数：&#123;count&#125;
    &lt;/button&gt;
  );
}</code></pre>
    </div>
    <div class="article-dropdown-panel" data-panel="vue-tab">
      <div class="article-dropdown-panel__title">🟢 Vue 3.5 单文件组件实现方式：</div>
      <pre class="no-code-enhance"><code class="language-html">&lt;script setup lang="ts"&gt;
import { ref } from 'vue';
const count = ref(0);
&lt;/script&gt;
&lt;template&gt;
  &lt;button @click="count++" class="btn-primary"&gt;
    Vue 点击计数：&#123;&#123; count &#125;&#125;
  &lt;/button&gt;
&lt;/template&gt;</code></pre>
    </div>
    <div class="article-dropdown-panel" data-panel="astro-tab">
      <div class="article-dropdown-panel__title">🚀 Astro 6 零 JS 静态组件实现方式：</div>
      <pre class="no-code-enhance"><code class="language-astro">---
const { title = "Astro 极速群岛" } = Astro.props;
---
&lt;div class="astro-island"&gt;
  &lt;h3&gt;&#123;title&#125;&lt;/h3&gt;
  &lt;p&gt;默认交付 0KB JavaScript，按需注水交互！&lt;/p&gt;
&lt;/div&gt;</code></pre>
    </div>
    <div class="article-dropdown-panel" data-panel="svelte-tab">
      <div class="article-dropdown-panel__title">🟠 Svelte 5 Runes 实现方式：</div>
      <pre class="no-code-enhance"><code class="language-svelte">&lt;script lang="ts"&gt;
  let count = $state(0);
&lt;/script&gt;
&lt;button onclick={() =&gt; count++} class="btn-primary"&gt;
  Svelte 点击计数：&#123;count&#125;
&lt;/button&gt;</code></pre>
    </div>
  </div>
</div>

---

### 2. 交互式多品类通用单位换算器（Universal Interactive Unit Converter · 基准下拉切换与实时汇率）

支持用户在输入框中自由输入**任意基数数值**（默认值为 `1`，支持增减步进器与一键重置），并在不同品类（质量重量、国际汇率、数据存储、网络带宽、长度尺寸）之间即时无缝换算：
* **动态可切换换算基准（Base Unit Dropdown）**：输入框右侧的基准单位支持下拉自由选择（例如在质量中可选择 `kg`、`g`、`lb`、`斤`、`oz`、`t` 等；在汇率中可选择 `USD`、`HKD`、`CNY`、`EUR`、`JPY`、`GBP` 等）。选择任一基准单位后，目标换算网格将**智能自动排除当前基准单位（彻底杜绝 1kg=1kg 冗余卡片）**，并以当前基准为分母即时重算所有目标单位；
* **真实汇率波动联网接入（Live Forex API）**：切换至「💱 国际汇率」时，系统将自动异步请求服务端 `/api/exchange-rate` 并回退公共实时汇率接口，获取各大主流货币的最新实时牌价（右上角显示 `🟢 实时联网汇率已同步`）；在未联网或断网离线时自动无缝回退至内置基准比例（显示 `⚪ 离线基准汇率`），确保“实时”真正实时且离线体验坚如磐石；
* **通用 API 便捷调用**：系统同时在全局暴露了 `window.shijianusAPI.fetchExchangeRates(base)` 辅助函数，方便文档内的任何自定义脚本即时调用实时牌价数据；
* **快捷一键复制与等式推算**：每个换算卡片均提供一键复制按钮与高亮反馈，底部同步展示动态等式链推算摘要。

<div class="interactive-unit-converter" data-default="1" data-title="🔄 交互式通用单位换算器（支持基准单位切换与实时汇率）"></div>

---

### 3. 規格參數與視頻編碼下拉推算器（互動規格計算下拉選單）

選擇不同選項時，右側即時顯示對應的技術指標與換算說明：

<div class="interactive-calc-select">
  <div class="article-select-box">
    <label>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
      <span>選擇視頻編碼解析度：</span>
    </label>
    <select class="article-select">
      <option value="1080p" data-desc="1920 × 1080 @ 60fps · 碼率 6,000 Kbps · 推薦頻寬 15 Mbps">1080P 全高清 (1080p60)</option>
      <option value="2k" data-desc="2560 × 1440 @ 60fps · 碼率 12,000 Kbps · 推薦頻寬 30 Mbps">2K 極清 (1440p60)</option>
      <option value="4k" data-desc="3840 × 2160 @ 60fps · 碼率 25,000 Kbps · 推薦頻寬 60 Mbps">4K 超高清 (2160p60 HDR)</option>
      <option value="8k" data-desc="7680 × 4320 @ 60fps · 碼率 80,000 Kbps · 推薦頻寬 200 Mbps">8K 影院級 (4320p60 AV1)</option>
    </select>
  </div>
  <div class="calc-output-box">
    <span>📊 <strong>技術規格推算結果</strong>：</span>
    <span class="calc-output-value">1920 × 1080 @ 60fps · 碼率 6,000 Kbps · 推薦頻寬 15 Mbps</span>
  </div>
</div>

---

## 六、手風琴折疊、選項卡與多欄排版（摺疊面板、分頁與多欄排版）

### 1. 互斥手風琴折疊組（獨占摺疊面板組 · 展開單項自動關閉其餘項）

配置 `data-single="true"`。展開其中一項時，同組內的其他展開項將自動聯動收起，保持頁面整潔聚焦：

<div class="article-accordion-group" data-single="true">
  <details class="article-accordion" open>
    <summary>
      <span>🔒 1. 靜態站點的安全性優勢</span>
      <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </summary>
    <div class="accordion-content">
      <p>靜態站點沒有傳統的 PHP/Node.js 動態執行引擎和暴露在公網的 SQL 資料庫，從物理層面免疫了 SQL 注入與服務端遠端程式碼執行（RCE）風險。</p>
    </div>
  </details>

  <details class="article-accordion">
    <summary>
      <span>⚡ 2. 全球 CDN 邊緣加速交付</span>
      <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </summary>
    <div class="accordion-content">
      <p>透過將編譯產物部署至 Cloudflare Pages 或 GitHub Pages，所有靜態資源可在全球 300+ 邊緣節點快取，首位元組回應時間（TTFB）通常低於 20ms。</p>
    </div>
  </details>

  <details class="article-accordion">
    <summary>
      <span>💰 3. 極低的雲服務託管成本</span>
      <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </summary>
    <div class="accordion-content">
      <p>靜態站點無需全天候運行昂貴的 VPS 雲伺服器，配合免費層級的 Cloudflare D1 資料庫與 Serverless 評論系統，日常營運成本近乎為零。</p>
    </div>
  </details>
</div>

---

### 2. 非互斥獨立手風琴折疊組（多項展開 / 非獨占摺疊面板組 · 允許多項同時展開）

配置 `data-single="false"`（或預設多開模式）。讀者可以自由展開多個或全部折疊項進行橫向比對與深度閱讀，不會因為展開新專案而關閉已開啟的內容：

<div class="article-accordion-group" data-single="false">
  <details class="article-accordion" open>
    <summary>
      <span>🛠️ 架構模組 A：Markdown AST 語法編譯器流水線</span>
      <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </summary>
    <div class="accordion-content">
      <p>基於 Unified、Remark-math 與 Rehype-katex 架構，在編譯建置階段將 Markdown 語法樹完全靜態轉化為標準語意 HTML 節點，並在 Node.js 端完成高亮和公式生成。</p>
    </div>
  </details>

<details class="article-accordion" open>
    <summary>
      <span>🎨 架構模組 B：EpoCanvas 動態視覺引擎與響應式系統</span>
      <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </summary>
    <div class="accordion-content">
      <p>提供極光背景（Aurora）、星空視差（Starfield）、毛玻璃擬態（Glassmorphism）與多端響應式斷點適配，無論在 4K 寬屏還是摺疊屏手機上均呈現一致的美學體驗。</p>
    </div>
  </details>

  <details class="article-accordion">
    <summary>
      <span>🛡️ 架構模組 C：WebCrypto SHA-256 分級安全隔離體系</span>
      <svg class="accordion-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
    </summary>
    <div class="accordion-content">
      <p>內建 1 級會話持久解鎖、2 級防窺動態多態遮罩（高斯模糊/馬賽克/劇透遮罩）、3 級視口哨兵離開即鎖以及外聯 URL 分片加密方案，徹底杜絕密碼明文在 DOM 中的暴露。</p>
    </div>
  </details>
</div>

---

### 3. 多標籤選項卡（Interactive Tabs）

<div class="article-tabs">
  <div class="article-tabs__nav">
    <button class="article-tabs__button is-active" type="button">pnpm</button>
    <button class="article-tabs__button" type="button">npm</button>
    <button class="article-tabs__button" type="button">yarn</button>
    <button class="article-tabs__button" type="button">bun</button>
  </div>
  <div class="article-tabs__panels">
    <div class="article-tabs__panel is-active">
      <pre class="no-code-enhance"><code class="language-bash">pnpm add @astrojs/mdx remark-math rehype-katex katex mermaid</code></pre>
    </div>
    <div class="article-tabs__panel">
      <pre class="no-code-enhance"><code class="language-bash">npm install @astrojs/mdx remark-math rehype-katex katex mermaid</code></pre>
    </div>
    <div class="article-tabs__panel">
      <pre class="no-code-enhance"><code class="language-bash">yarn add @astrojs/mdx remark-math rehype-katex katex mermaid</code></pre>
    </div>
    <div class="article-tabs__panel">
      <pre class="no-code-enhance"><code class="language-bash">bun add @astrojs/mdx remark-math rehype-katex katex mermaid</code></pre>
    </div>
  </div>
</div>

---

### 4. 多欄網格佈局系統（Multi-Column Grid）

#### 3 列等寬卡片網格

<div class="article-grid article-grid-3">
  <div class="article-col-card">
    <h4>🎨 視覺體系</h4>
    <p>深度吸收 EpoCanvas 現代極客設計美學，支援明暗高對比、毛玻璃背景與平滑色彩過渡。</p>
  </div>
  <div class="article-col-card">
    <h4>⚡ 效能工程</h4>
    <p>Astro 6 靜態群島架構，建構期 HTML 預渲染，純靜態極致 SEO 優化。</p>
  </div>
  <div class="article-col-card">
    <h4>🛠️ 擴充生態</h4>
    <p>全面支援 KaTeX 公式、Mermaid 圖表、加密彈窗與 9 種 Post Formats。</p>
  </div>
</div>

#### 1:2 不均等側邊欄網格

<div class="article-grid article-columns-1-2">
  <div class="article-col-card">
    <h4>📌 架構定位</h4>
    <p>專注於極客與工程師的現代化技術寫作載體。</p>
  </div>
  <div class="article-col-card">
    <h4>🚀 交付保障</h4>
    <p>內建完善的自動化煙測與靜態建構驗證機制，無論公式、圖表還是複雜卡片，都能確保在全設備上嚴絲合縫呈現。</p>
  </div>
</div>

---

## 七、13 種語意告示框（Admonitions / GitHub Alerts）

基於 GitHub Alert 與 EpoCanvas 設計規範，支持 13 種不同語意的彩色卡片，並支持使用 `[!TYPE]-` 語法實現預設折疊：

> [!NOTE]
> **常規備註（Note）**：這是一條標準的背景資訊或上下文說明。

> [!TIP]
> **實用技巧（Tip）**：使用快捷鍵 <kbd>Ctrl</kbd> + <kbd>K</kbd> 可以快速喚起全域文章搜尋面板！

> [!IMPORTANT]
> **重要事項（Important）**：在部署生產環境前，請確認 `BLOG_BUILD_TARGET=static` 環境變數已正確注入。

> [!WARNING]
> **風險警告（Warning）**：請勿在公開 Git 倉庫中提交生產資料庫金鑰或雲服務私鑰。

> [!CAUTION]
> **危險警示（Caution）**：執行資料表重建操作具有破壞性，請先備份 D1 資料庫！

> [!DANGER]
> **致命危險（Danger）**：直接刪除生產資料庫將導致全部評論與使用者資產永久損毀。

> [!SUCCESS]
> **操作成功（Success）**：靜態建構流程已成功完成，所有 47 個靜態路由已就緒！

> [!QUESTION]
> **疑难探讨（Question）**：如何在无服务端依赖的环境下实现毫秒级的纯客户端全文检索？

> [!QUOTE]
> **精选引用（Quote）**：“优秀的代码不仅能被机器执行，更能像诗歌一样优雅地向人类传达思想。”

> [!INFO]
> **详细信息（Info）**：本博客基于 Astro 6 与 Tailwind 4 构建，全站纯静态导出。

> [!TODO]
> **待办计划（Todo）**：计划在下一迭代中引入 WebAssembly 客户端全文检索索引。

> [!BUG]
> **缺陷记录（Bug）**：已修复旧版在极端窄屏设备下表格横向截断的排版问题。

> [!EXAMPLE]
> **范例说明（Example）**：以上所有告示框均自动适配深色与浅色模式的高对比度色彩。

### 折叠式告示框演示

> [!TIP]- 点击展开查看：生产环境 Nginx 极速缓存配置参考
> ```nginx
> location ~* \.(?:css|js|woff2?|svg|png|jpg|webp)$ {
>     expires 1y;
>     add_header Cache-Control "public, immutable";
>     access_log off;
> }
> ```

---

## 八、学术数学公式（KaTeX）、架构图表（Mermaid 11）与动态思维导图（Markmap）

在展示型与示例型技术文档中，以 **「实际渲染效果 + 对应源码对照」**（双标签选项卡 Tabs）为核心呈现理念，不仅能让读者直观体验最终视觉与交互特性，更能方便开发者一键参考、复制并迁移至实际项目中。

---

### 1. LaTeX 数学公式（KaTeX Math · 行内与块级多行推导）

#### 行内公式（Inline Formula）

<div class="article-tabs">
<div class="article-tabs__nav">
<button class="article-tabs__button is-active" type="button">🌟 渲染效果呈现</button>
<button class="article-tabs__button" type="button">💻 LaTeX 源码</button>
</div>
<div class="article-tabs__panels">
<div class="article-tabs__panel is-active">

质能方程 $E = mc^2$，欧拉恒等式 $e^{i\pi} + 1 = 0$，高斯积分 $\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$。

</div>
<div class="article-tabs__panel">

```latex
质能方程 $E = mc^2$，欧拉恒等式 $e^{i\pi} + 1 = 0$，高斯积分 $\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}$。
```

</div>
</div>
</div>

#### 块级多行推导公式 1：二阶动态系统拉普拉斯变换（Block Math · Single Equation）

<div class="article-tabs">
<div class="article-tabs__nav">
<button class="article-tabs__button is-active" type="button">🌟 渲染效果呈现</button>
<button class="article-tabs__button" type="button">💻 LaTeX 源码</button>
</div>
<div class="article-tabs__panels">
<div class="article-tabs__panel is-active">

$$
\mathcal{L}\{\ddot{x}(t) + 2\zeta\omega_n\dot{x}(t) + \omega_n^2 x(t)\} = X(s)(s^2 + 2\zeta\omega_n s + \omega_n^2)
$$

</div>
<div class="article-tabs__panel">

```latex
$$
\mathcal{L}\{\ddot{x}(t) + 2\zeta\omega_n\dot{x}(t) + \omega_n^2 x(t)\} = X(s)(s^2 + 2\zeta\omega_n s + \omega_n^2)
$$
```

</div>
</div>
</div>

#### 块级多行推导公式 2：麦克斯韦经典电磁方程组（Block Math · Multi-line Aligned）

<div class="article-tabs">
<div class="article-tabs__nav">
<button class="article-tabs__button is-active" type="button">🌟 渲染效果呈现</button>
<button class="article-tabs__button" type="button">💻 LaTeX 源码</button>
</div>
<div class="article-tabs__panels">
<div class="article-tabs__panel is-active">

$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$

</div>
<div class="article-tabs__panel">

```latex
$$
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0 \varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
$$
```

</div>
</div>
</div>

---

### 2. Mermaid 11 架构图表（Flowchart & Sequence · 流程图与时序图）

#### ① 博客加密验证与内容渲染流程图（Flowchart TD）

<!-- context from previous chunk -->
artial t}
\end{aligned}
$$
```

</div>
</div>
</div>

---

### 2. Mermaid 11 架構圖表（Flowchart & Sequence · 流程圖與時序圖）

#### ① 部落格加密驗證與內容渲染流程圖（Flowchart TD）

<div class="article-tabs">
<div class="article-tabs__nav">
<button class="article-tabs__button is-active" type="button">🌟 渲染效果呈現</button>
<button class="article-tabs__button" type="button">💻 Mermaid 原始碼</button>
</div>
<div class="article-tabs__panels">
<div class="article-tabs__panel is-active">

```mermaid
flowchart TD
    A[讀者訪問文章] --> B{文章是否加密?}
    B -- 是 --> C[彈出毛玻璃密碼對話框]
    C --> D{密碼校驗}
    D -- 正確 --> E[解密並呈現正文]
    D -- 錯誤 --> F[觸發視窗震動與紅字警示]
    F -. 重新輸入口令 .-> C
    B -- 否 --> E
    E --> G[渲染 KaTeX 公式與 Mermaid 圖表]
    G --> H[呈現完整沉浸式閱讀體驗]
```

</div>
<div class="article-tabs__panel">

````markdown
```mermaid
flowchart TD
    A[讀者訪問文章] --> B{文章是否加密?}
    B -- 是 --> C[彈出毛玻璃密碼對話框]
    C --> D{密碼校驗}
    D -- 正確 --> E[解密並呈現正文]
    D -- 錯誤 --> F[觸發視窗震動與紅字警示]
    F -. 重新輸入口令 .-> C
    B -- 否 --> E
    E --> G[渲染 KaTeX 公式與 Mermaid 圖表]
    G --> H[呈現完整沉浸式閱讀體驗]
```
````

</div>
</div>
</div>

#### ② 客戶端安全鑑權與解密時序圖（Sequence Diagram）

<div class="article-tabs">
<div class="article-tabs__nav">
<button class="article-tabs__button is-active" type="button">🌟 渲染效果呈現</button>
<button class="article-tabs__button" type="button">💻 Mermaid 原始碼</button>
</div>
<div class="article-tabs__panels">
<div class="article-tabs__panel is-active">

```mermaid
sequenceDiagram
    autonumber
    actor User as 讀者 (User)
    participant Browser as 客戶端瀏覽器
    participant PostPage as 文章渲染引擎
    participant Security as 加密安全模組

    User->>Browser: 點擊受保護的加密內容
    Browser->>PostPage: 喚起密碼輸入對話框
    User->>Browser: 輸入訪問密鑰
    Browser->>Security: 校驗口令 Hash
    alt 驗證成功
        Security-->>Browser: 返回解鎖令牌
        Browser->>PostPage: 解密正文並平滑展示
    else 驗證失敗
        Security-->>Browser: 返回密碼錯誤
        Browser->>User: 觸發視窗搖晃與紅字警示
    end
```

</div>
<div class="article-tabs__panel">

````markdown
```mermaid
sequenceDiagram
    autonumber
    actor User as 讀者 (User)
    participant Browser as 客戶端瀏覽器
    participant PostPage as 文章渲染引擎
    participant Security as 加密安全模組

    User->>Browser: 點擊受保護的加密內容
    Browser->>PostPage: 喚起密碼輸入對話框
    User->>Browser: 輸入訪問密鑰
    Browser->>Security: 校驗口令 Hash
    alt 驗證成功
        Security-->>Browser: 返回解鎖令牌
        Browser->>PostPage: 解密正文並平滑展示
    else 驗證失敗
        Security-->>Browser: 返回密碼錯誤
        Browser->>User: 觸發視窗搖晃與紅字警示
    end
```
````

</div>
</div>
</div>

---

### 3. 動態交互式思維導圖（Markmap / Mindmap · 多向分支擴散）

在長篇技術規範與系統架構梳理中，傳統的靜態列表難以直觀呈現複雜的知識脈絡。本主題全新實裝 **Markmap 動態交互式思維導圖引擎**，在文章主欄（`.post.post-page-shell`）中實現徹底的原生解析與交互增強：

> [!TIP]
> **多向分支擴散核心規則**：
> 1. **預設單塊保護空間**：預設狀態下，思維導圖僅展示 **1 塊核心根節點**（Level 1），右側附帶折疊小圓點指示器；
> 2. **點擊展開多向分支**：點擊根節點或任意子節點的小圓點，子分支將**平滑向外散開**；
> 3. **工具欄全能操控**：支援 **放大 / 縮小 / 居中自適應 / 一鍵展開全部 / 一鍵收起單塊 / 全螢幕沉浸式閱讀 / 複製原始碼**；
> 4. **畫布拖拽與縮放**：按住滑鼠左鍵可自由拖拽平移畫布，滾動滑鼠滾輪可縮放視野。

#### 活體思維導圖呈現：SSG 與主題內容格式生態全景

<div class="article-tabs">
<div class="article-tabs__nav">
<button class="article-tabs__button is-active" type="button">🌟 交互導圖呈現</button>
<button class="article-tabs__button" type="button">💻 Mindmap 結構原始碼</button>
</div>
<div class="article-tabs__panels">
<div class="article-tabs__panel is-active">

```mindmap
# 靜態站點生成器與全格式內容生態架構
## 1. 靜態編譯核心流水線
### AST 語法轉換管道
#### Markdown / MDX 語義解析流水線
##### Unified / Remark 語法擴展
- GFM 表格與刪除線語法轉換
- 自動生成 Heading 鏈接與 ID
##### Markmap 交互式多向思維導圖擴展
- 递归 AST 樹構建 (Transformer.transform)
- D3 層次化彈性布局 (Flextree Algorithm)
- 交互式折疊狀態機 (payload.fold)
- 動態調色板分支染色 (d3.scaleOrdinal)
##### Rehype Katex 數學公式擴展
- 行內公式與獨立塊公式解析
- 宏定義支持與錯誤容錯回退
#### 程式碼高亮與靜態著色器
##### Shiki 雙主題編譯器
- VSCode TextMate 語法規則解析
- 浅色/深色模式雙主題預渲染零水合
### 編譯器與資源打包
#### Vite 6 极速热重载 (HMR)
##### ESM 原生模組載入
- 毫秒級按需編譯與熱更新
#### Rollup 靜態生成流水線
##### 靜態打包優化
- 智能代碼分塊 (Code Splitting)
- Tree‑Shaking 冗餘消除
## 2. 動態交互與群島體系
### 混合組件群島 Islands
#### 客戶端組件分島掛載
##### React 19 客戶端組件
- 獨立狀態隔離與上下文通信
- 會話狀態保持 (SessionStorage / Crypto)
##### Astro 伺服器端 Islands
- 零執行時客戶端 JS (Zero‑JS by Default)
- 按需激活交互島嶼 (client:visible)
### 現代視覺與動效系統
#### 動態背景與渲染引擎
##### Aurora 極光 / Starfield 星空
- WebGL / Canvas 2D 硬體加速
- 節能模式與視口離開自動暫停
##### 毛玻璃卡片 Glassmorphism 規範
- 動態高斯模糊與多重環境陰影
- 響應式全端自適應布局 (PC / Pad / Mobile)
## 3. 格式全景與特異功能
### 擴展文件規範對照
#### AsciiDoc (.adoc) 原生等效適配
#### Emacs Org-Mode (.org) 任務清單映射
#### reStructuredText (.rst) 指令轉換
### 富交互組件集
#### 交互式下拉框切換器 (Dropdown Switcher)
#### 互斥手風琴折疊卡片 (Accordion Groups)
#### 動態黑膠唱片音頻播放器 (Vinyl Audio)
### 安全隱私與分級加密
#### WebCrypto SHA-256 雜湊校驗 (無明文外露)
#### 1級會話持久解鎖 (Session Persistent)
#### 2級防窺遮罩切換 (高斯模糊 / 馬賽克 / 劇透遮罩)
#### 3級視口防窺離開即鎖 (IntersectionObserver)
``` 

</div>
<div class="article-tabs__panel">

````markdown
```mindmap
# 靜態站點生成器與全格式內容生態架構
## 1. 靜態編譯核心流水線
### AST 語法轉換管道
#### Markdown / MDX 語義解析流水線
##### Unified / Remark 語法擴展
- GFM 表格與刪除線語法轉換
- 自動生成 Heading 鏈接與 ID
##### Markmap 交互式多向思維導圖擴展
- 递归 AST 樹構建 (Transformer.transform)
- D3 層次化彈性布局 (Flextree Algorithm)
- 交互式折疊狀態機 (payload.fold)
- 動態調色板分支染色 (d3.scaleOrdinal)
##### Rehype Katex 數學公式擴展
- 行內公式與獨立塊公式解析
- 宏定義支持與錯誤容錯回退
#### 程式碼高亮與靜態著色器
##### Shiki 雙主題編譯器
- VSCode TextMate 語法規則解析
- 浅色/深色模式雙主題預渲染零水合
### 編譯器與資源打包
#### Vite 6 极速热重载 (HMR)
##### ESM 原生模組載入
- 毫秒級按需編譯與熱更新
#### Rollup 靜態生成流水線
##### 靜態打包優化
- 智能代碼分塊 (Code Splitting)
- Tree‑Shaking 冗餘消除
## 2. 動態交互與群島體系
### 混合組件群島 Islands
#### 客戶端組件分島掛載
##### React 19 客戶端組件
- 獨立狀態隔離與上下文通信
- 會話狀態保持 (SessionStorage / Crypto)
##### Astro 伺服器端 Islands
- 零執行時客戶端 JS (Zero‑JS by Default)
- 按需激活交互島嶼 (client:visible)
### 現代視覺與動效系統
#### 動態背景與渲染引擎
##### Aurora 極光 / Starfield 星空
- WebGL / Canvas 2D 硬體加速
- 節能模式與視口離開自動暫停
##### 毛玻璃卡片 Glassmorphism 規範
- 動態高斯模糊與多重環境陰影
- 響應式全端自適應布局 (PC / Pad / Mobile)
## 3. 格式全景與特異功能
### 擴展文件規範對照
#### AsciiDoc (.adoc) 原生等效適配
#### Emacs Org-Mode (.org) 任務清單映射
#### reStructuredText (.rst) 指令轉換
### 富交互組件集
#### 交互式下拉框切換器 (Dropdown Switcher)
#### 互斥手風琴折疊卡片 (Accordion Groups)
#### 動態黑膠唱片音頻播放器 (Vinyl Audio)
### 安全隱私與分級加密
#### WebCrypto SHA-256 雜湊校驗 (無明文外露)
#### 1級會話持久解鎖 (Session Persistent)
#### 2級防窺遮罩切換 (高斯模糊 / 馬賽克 / 劇透遮罩)
#### 3級視口防窺離開即鎖 (IntersectionObserver)
```
````

</div>
</div>
</div>

#### 外聯分段解密端點隔離 (Standalone Token)
```

</div>
<div class="article-tabs__panel">

````markdown
```mindmap
# 靜態站點生成器與全格式內容生態架構
## 1. 靜態編譯核心流水線
### AST 語法轉換管道
#### Markdown / MDX 語義解析流水線
##### Unified / Remark 語法拓展
- GFM 表格與刪除線語法轉換
- 自動生成 Heading 鎖點與 ID
##### Markmap 互動式多向思維導圖拓展
- 遞迴 AST 樹構建 (Transformer.transform)
- D3 層次化彈性佈局 (Flextree Algorithm)
- 互動式折疊狀態機 (payload.fold)
- 動態調色板分支染色 (d3.scaleOrdinal)
##### Rehype Katex 數學公式拓展
- 行內公式與獨立塊公式解析
- 宏定義支援與錯誤容錯回退
#### 程式碼高亮與靜態著色器
##### Shiki 雙主題編譯器
- VSCode TextMate 語法規則解析
- 淺色/深色模式雙主題預渲染零水合
### 編譯器與資源打包
#### Vite 6 极速熱重載 (HMR)
##### ESM 原生模組載入
- 毫秒級按需編譯與熱更新
#### Rollup 靜態生成流水線
##### 靜態打包優化
- 智慧程式碼分塊 (Code Splitting)
- Tree-Shaking 冗餘消除
## 2. 動態互動與群島體系
### 混合元件群島 Islands
#### 客戶端元件分島掛載
##### React 19 Client Components
- 獨立狀態隔離與上下文通信
- 會話狀態保持 (SessionStorage / Crypto)
##### Astro Server-Side Islands
- 零執行時客戶端 JS (Zero-JS by Default)
- 按需激活互動島嶼 (client:visible)
### 現代視覺與動效系統
#### 動態背景與渲染引擎
##### Aurora 極光 / Starfield 星空
- WebGL / Canvas 2D 硬體加速
- 節能模式與視口離開自動暫停
##### 毛玻璃卡片 Glassmorphism 規範
- 動態高斯模糊與多重環境陰影
- 響應式全端自適應佈局 (PC / Pad / Mobile)
## 3. 格式全景與特異功能
### 擴展文件規範對照
#### AsciiDoc (.adoc) 原生等效適配
#### Emacs Org-Mode (.org) 任務清單映射
#### reStructuredText (.rst) 指令轉換
### 富互動元件集
#### 互動式下拉框切換器 (Dropdown Switcher)
#### 互斥手風琴折疊卡片 (Accordion Groups)
#### 動態黑膠唱片音訊播放器 (Vinyl Audio)
### 安全隱私與分級加密
#### WebCrypto SHA-256 雜湊校驗 (無明文外露)
#### 1級會話持久解鎖 (Session Persistent)
#### 2級防窺遮罩切換 (高斯模糊 / 馬賽克 / 劇透遮罩)
#### 3級視口防窺離開即鎖 (IntersectionObserver)
#### 外聯分段解密端點隔離 (Standalone Token)
```
````

</div>
</div>
</div>

#### Markdown 編寫規範與語法參考

本部落格整合的 **Mindmap 渲染引擎** 基於 AST 遞迴解析與 D3 Flextree 彈性樹佈局，**原生支援無限層級擴展（Level 1 至 Level N）**，無任何深度上限限制。作者在編寫文章時，可根據知識樹的縱深複雜度選擇以下書寫規範：

##### 1. 混合階梯語法（推薦 1~6 層骨幹 + 無限列表深層衍生）
標準 Markdown 標題支援 6 級深度（`#` 至 `######`），在第 6 級以下可繼續透過無序列表項（`-`、`*`）配合空格縮進無限向下衍生（Level 7、Level 8、Level 9...）：

````markdown
```mindmap
#

为了彻底杜绝密码明文暴露在 DOM 属性中（如 `data-password` 易被审查元素窥探），本博客内容系统全面升级为 **WebCrypto SHA-256 散列校验（`data-hash`）**，并建立起三级文内局部加密与外联分段解密体系：
* **默认安全重置规则（重新載入時零持久性）**：默认情况下，所有加密内容（1级、2级、3级及外联解密门）在**页面刷新（F5 / 重新加载）后都会坚决自动重置回上锁状态**，彻底避免页面刷新后保持裸露的安全隐患；
* **开放性持久化参数（`data-persist`）**：为了满足特殊文档场景的开放性需求，可通过参数配置覆盖默认重置策略：
  * `data-persist="session"`（或 `data-persist="true"`）：在当前标签页会话期间跨刷新保持解锁；
  * `data-persist="local"`：在本地浏览器存储中持久记忆解锁状态；
  * 默认未配置：纯内存生命周期，**页面刷新立即安全重置上锁**。

---

### 1. 1级加密：单页基础加密（等級 1 · 預設刷新重置）

输入一次访问凭证即可解锁阅读正文，默认刷新页面即刻自动重锁；若需跨刷新保持可在标签中加入 `data-persist="session"`：

<div class="article-encrypted-box" data-level="1" data-hash="d7fb6c64b9aa44cc0c3b427edaa623369dee1a9778329801f68fdaa34b09d351" data-hint="💡 1级加密提示：演示密钥请输入 shijianus2026（哈希校验 · 刷新自动重锁）">
  <div class="encrypted-box__lock">
    <div class="encrypted-box__level-tag"><span class="badge badge-success">🛡️ 1级加密 · 刷新自动重置</span> <span class="badge badge-cyan">SHA-256 保护</span></div>
    <div class="encrypted-box__icon">🔒</div>
    <div class="encrypted-box__title">1级保护：私有开发配置与源码资产</div>
    <div class="encrypted-box__desc">该区域受 1 级安全策略保护，密码使用 WebCrypto 散列校验，无明文外露；刷新页面后将自动重锁。</div>
    <button class="encrypted-box__btn" type="button">🔑 验证密钥解锁内容</button>
  </div>
  <div class="encrypted-box__content">
    <div class="admonition admonition-success">
      <div class="admonition-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>🎉 1级验证通过！当前页面已解锁（刷新将自动安全重锁）</span>
      </div>
      <div class="admonition-content">
        <p><strong>核心开发环境参数已解锁：</strong></p>
        <ul>
          <li><code>DEPLOY_ENDPOINT</code>: <code>https://api.shijian.us/v2/deploy/core</code></li>
          <li><code>AUTH_SCOPE</code>: <code>read:articles, write:releases</code></li>
        </ul>
      </div>
    </div>
  </div>
</div>

---

### 2. 2级加密：解密后遮罩防窥保护（等級 2 · 遮罩保護）

验证成功后内容虽被解密，但**默认自动进入高斯模糊防窥遮罩状态**（默认不显示切换栏，鼠标悬浮即可清晰查看），有效抵御近距离窥屏。
- **开启工具栏**：配置 `data-allow-select="true"` 开启遮罩切换工具栏，**工具栏默认同样包含在遮罩内受保护**（鼠标悬浮时工具栏与正文一同清晰显露并可点击切换）；如需工具栏保持在遮罩外，可配置 `data-toolbar-masked="false"`；
- **指定遮罩方式**：可通过 `data-mask="blur|mosaic|spoiler|reveal"` 强制指定遮罩模式；
- **自定义设置栏**：支持在 Markdown 标签中传入 `data-mask-options="blur,mosaic"` 快速定制可选模式，或直接在正文中书写 `<div class="encrypted-mask-toolbar">` 结构，系统会自动扫描并激活自定义设置栏；
- **刷新重置保障**：默认刷新页面后自动重锁。

<div class="article-encrypted-box" data-level="2" data-allow-select="true" data-hash="f31aafdcf42582306027026c37ee59c747be6e17258aa490c5bba32b93911c07" data-hint="💡 2級加密提示：演示密鑰請輸入 epocanvas2026">
  <div class="encrypted-box__lock">
    <div class="encrypted-box__level-tag"><span class="badge badge-warning">🛡️ 2級加密 · 遮罩防窺模式</span> <span class="badge badge-purple">動態多態遮罩</span></div>
    <div class="encrypted-box__icon">🛡️</div>
    <div class="encrypted-box__title">2級保護：機密商業資料與財務清單</div>
    <div class="encrypted-box__desc">解密後將預設啟用高斯模糊保護，滑鼠懸停或點擊方可看清，有效抵禦近距離窺視；頁面刷新後自動重鎖。</div>
    <button class="encrypted-box__btn" type="button">🔑 驗證憑證並開啟防窺查看</button>
  </div>
  <div class="encrypted-box__content">
    <div class="admonition admonition-important">
      <div class="admonition-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
        <span>📊 商業專案核心財務與合約參數</span>
      </div>
      <div class="admonition-content">
        <p>以下為 2026 年度 EpoCanvas 商業支援預算分配：</p>
        <ul>
          <li><strong>企業級私有化授權費</strong>：¥ 280,000 / 年（含高可用叢集與 SLA 保障）</li>
          <li><strong>邊緣 CDN 流量支出</strong>：¥ 36,500 / 月</li>
          <li><strong>專屬技術顧問密鑰</strong>：<code>sec_corp_epocanvas_key_2026</code></li>
        </ul>
      </div>
    </div>
  </div>
</div>

---

### 3. 3級加密：離開視口立即重新上鎖（第3級 · 視口自動鎖定）

超高安全等級！**不寫入任何永久性儲存**；一旦解密後的內容在滾動中**離開當前螢幕視口**，或者瀏覽器分頁切換到背景，系統將**瞬間自動重新上鎖**，再次查看必須重新輸入密碼：

<div class="article-encrypted-box" data-level="3" data-hash="0f67fcb3bceddb88ef917fa5cf73affc3490db24a44adf25238a00f5ee81ee89" data-hint="💡 3級加密提示：演示密鑰請輸入 level3pass">
  <div class="encrypted-box__lock">
    <div class="encrypted-box__level-tag"><span class="badge badge-danger">🛡️ 3級加密 · 離開視口即鎖</span> <span class="badge badge-orange">視口哨兵監控</span></div>
    <div class="encrypted-box__relock-wrap">
      <div class="encrypted-relock-notice">⚠️ 安全保護已觸發：由於該內容先前離開了螢幕視口，系統已自動重新鎖定！</div>
    </div>
    <div class="encrypted-box__icon">🚨</div>
    <div class="encrypted-box__title">3級絕密：核心基礎設施私鑰與災備指令</div>
    <div class="encrypted-box__desc">最高防護標準。解密後一旦滾動移出螢幕，立即觸發銷毀重鎖機制，絕不在螢幕外遺留任何明文。</div>
    <button class="encrypted-box__btn" type="button">🔐 驗證高階密鑰（離開視口即鎖）</button>
  </div>
  <div class="encrypted-box__content">
    <div class="encrypted-level3-status">
      <span class="security-pulse-dot"></span>
      <span>視口防窺哨兵即時監聽中 · 移出視口立即銷毀明文</span>
    </div>
    <div class="admonition admonition-danger">
      <div class="admonition-title">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
        <span>⚡ 絕密叢集應急接管憑據</span>
      </div>
      <div class="admonition-content">
        <p>請注意：此資訊僅在當前視口內可見，向下或向上滾動使其離開螢幕將自動上鎖：</p>
        <pre><code># 核心節點緊急自毀 / 切換指令
curl -X POST https://cluster.shijian.us/v1/node/failover \
  -H "X-Root-Token: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"</code></pre>
      </div>
    </div>
  </div>
</div>

---

### 4. 外部連結分段解密門（External Link Segment Decryption Gate）

在构建期或架构分层时，同一篇文章可以被物理分割为**公开正文段**与**外联受控密文段**。创作者可在文末或章节任意位置插入外联解密引导门，验证凭据后动态解密并在此无缝挂载完整后半段正文：

<div class="article-external-decrypt-gate" data-hash="d7fb6c64b9aa44cc0c3b427edaa623369dee1a9778329801f68fdaa34b09d351" data-hint="🔑 外联分段密钥：请输入 shijianus2026">
  <div class="external-gate__header">
    <div class="external-gate__badge">
      <span class="badge badge-purple">🌐 外联安全分段加密</span>
      <span class="badge badge-cyan">端点分片存储</span>
      <span class="badge badge-success">WebCrypto SHA-256</span>
    </div>
    <h3 class="external-gate__title">🔐 正文深度章节已外联隔离存放</h3>
    <p class="external-gate__desc">当前长文在构建阶段启用了**外联分段隔离存储**：前 75% 基础语法与组件说明公开交付；核心企业级工程落地方案与架构推导演示已被加密打包存放。点击下方按钮输入密钥，即可在当前页面实时无缝解密并挂载剩余正文内容。</p>
  </div>
  <div class="external-gate__actions">
    <button type="button" class="external-gate__btn">🔑 输入凭据解密并挂载完整正文</button>
    <a href="#top" class="article-btn article-btn-outline external-gate__btn-alt">⬆️ 返回文章顶部</a>
  </div>
  <div class="external-gate__decrypted-payload">
    <div class="decrypted-payload-banner">
      <span class="badge badge-success">✨ 外联分段密文已成功验证解密，正文无缝挂载完成</span>
      <span class="payload-timestamp">SHA-256 Stream Verified</span>
    </div>
    <div class="decrypted-payload-body">
      <h4>📦 外联分段解密正文：企业级 SSG 内容工程落地规范</h4>
      <p>恭喜您成功解锁了本文的外联分段核心内容！在现代大型静态知识库工程中，将高敏感或付费特权内容采用外联分段加密存放，具有以下核心优势：</p>
      <ul>
        <li><strong>首屏负载极小化</strong>：未授权访问者仅拉取基础公开 HTML，网络开销减少 60% 以上；</li>
        <li><strong>防抓取与防逆向</strong>：敏感密文与密钥隔离存储，静态爬虫无法从公开 DOM 中抓取到任何有效数据；</li>
        <li><strong>无感流式接入</strong>：通过客户端 WebCrypto 引擎，读者在当前页面无需页面跳转即可享受无缝展开的连贯阅读体验。</li>
      </ul>
    </div>
  </div>
</div>

---

### 5. 行内高斯模糊、马赛克与剧透隐藏

除了块级加密外，正文行内亦提供丰富的轻量级防窥与趣味遮罩：

- **文字高斯模糊**：<span class="blur-text">这是一段被高斯模糊保护的关键剧透文字，鼠标悬浮或点击即可看清！</span>
- **黑幕马赛克**：<span class="mosaic-text">机密数据：SHA256-7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
- **Discord 剧透遮罩**：||这是一段使用双竖线包裹的剧透遮罩，点击揭开。||
- **内联隐藏锁**：%%这里是使用百分号包裹的内联隐藏内容，点击展开。%%

#### 图片高斯模糊保护

<div class="blur-image-wrap">
  <img class="blur-image" src="/media/shijianus/workbench.jpg" alt="模糊保护工作台图片" />
  <div class="blur-image-badge"><span>👁️ 悬浮或点击揭开迷雾</span></div>
</div>

---

## 十、时间轴、步骤条、定义列表与数据表格

### 1. 垂直时间轴（Vertical Timeline）

<div class="article-timeline">
  <div class="timeline-node is-success">
    <div class="timeline-node__dot"></div>
    <div class="timeline-node__content">
      <div class="timeline-node__date">2026.04 · 基础重构</div>
      <div class="timeline-node__title">完成 Astro 6 静态站点内核迁移</div>
      <p class="timeline-node__desc">建立全新 Content Collections 架构与 Shiki 代码高亮管道。</p>
    </div>
  </div>

  <div class="timeline-node is-warning">
    <div class="timeline-node__dot"></div>
    <div class="timeline-node__content">
      <div class="timeline-node__date">2026.08 · 特性扩展</div>
      <div class="timeline-node__title">全量实装 WordPress Post Formats 与下拉框切换器</div>
      <p class="timeline-node__desc">补全 13 种 Admonitions、KaTeX 数学公式与密码弹窗解密系统。</p>
    </div>
  </div>

  <div class="timeline-node">
    <div class="timeline-node__dot"></div>
    <div class="timeline-node__content">
      <div class="timeline-node__date">未来展望 · 生态演进</div>
      <div class="timeline-node__title">发布开源主题标准与多平台插件</div>
      <p class="timeline-node__desc">提供从 Hexo/WordPress 到 Astro 的一键无缝内容迁移工具链。</p>
    </div>
  </div>
</div>

---

### 2. 教程步骤条（Tutorial Steps）

</div>
      <p class="timeline-node__desc">提供從 Hexo/WordPress 到 Astro 的一鍵無縫內容遷移工具鏈。</p>
    </div>
  </div>
</div>

---

### 2. 教程步驟條（Tutorial Steps）
<!-- end context -->

<div class="article-steps">
  <div class="article-steps__item">
    <div class="article-steps__num">1</div>
    <div class="article-steps__content">
      <h4>編寫 Markdown 或 MDX 文章</h4>
      <p>在 <code>src/content/posts/</code> 目錄下建立 <code>.md</code> 檔案，宣告 Front Matter 中繼資料。</p>
    </div>
  </div>
  <div class="article-steps__item">
    <div class="article-steps__num">2</div>
    <div class="article-steps__content">
      <h4>自由組合富媒體卡片與互動元件</h4>
      <p>按需選用下拉框切換器、黑膠音樂卡片、畫廊相簿或加密解密區塊。</p>
    </div>
  </div>
  <div class="article-steps__item">
    <div class="article-steps__num">3</div>
    <div class="article-steps__content">
      <h4>一鍵靜態編譯並秒級發布</h4>
      <p>執行 <code>npm run build</code> 產生純靜態產物，推送至 Cloudflare CDN 全球加速。</p>
    </div>
  </div>
</div>

---

### 3. 定義列表與規格表（Definition Lists & Specs）

<dl class="article-dl">
  <dt>Astro 群島 (Islands)</dt>
  <dd>將頁面拆分為靜態 HTML 骨架與獨立注水的互動式元件，極大縮減 JavaScript 體積。</dd>
  <dt>KaTeX 編譯器</dt>
  <dd>在建置期完成 LaTeX 語法的 AST 解析，零客戶端額外渲染延遲。</dd>
  <dt>Post Formats</dt>
  <dd>源自 WordPress 的內容形態定義規範，用於賦予不同文章類型專屬的排版外觀。</dd>
</dl>

---

## 十一、富文字行內微排版美化與徽章

- **多色彩高亮（HTML 標籤形式）**：
  - <mark class="mark-yellow">黃色高亮（重點標註）</mark>
  - <mark class="mark-green">綠色高亮（成功推薦）</mark>
  - <mark class="mark-blue">藍色高亮（資訊線索）</mark>
  - <mark class="mark-pink">粉色高亮（設計靈感）</mark>
  - <mark class="mark-purple">紫色高亮（深度原理）</mark>
  - <mark class="mark-orange">橙色高亮（操作預警）</mark>
  - <mark class="mark-red">紅色高亮（風險警示）</mark>
  - <mark class="mark-cyan">青色高亮（網路協議）</mark>
- **快捷語法糖高亮（`==顏色:內容==` 形式）**：
  - ==默认高亮文本（自动黄色）==
  - ==green:綠色高亮語法糖（敏捷標記）==
  - ==blue:藍色高亮語法糖（架構要素）==
  - ==pink:粉色高亮語法糖（介面美化）==
  - ==purple:紫色高亮語法糖（核心算法）==
- **狀態徽章（Badges）**：
  - <span class="badge badge-primary">推薦 (Primary)</span>
  - <span class="badge badge-success">通過 (Success)</span>
  - <span class="badge badge-warning">注意 (Warning)</span>
  - <span class="badge badge-danger">危險 (Danger)</span>
  - <span class="badge badge-info">資訊 (Info)</span>
  - <span class="badge badge-purple">架構 (Purple)</span>
  - <span class="badge badge-cyan">網路 (Cyan)</span>
  - <span class="badge badge-orange">硬體 (Orange)</span>
- **按鍵展示**：<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> 開啟全域指令調色板。
- **多語言注音與發音標註（Ruby / Multilingual Phonetics）**：
  - **中文漢語拼音（Hanyu Pinyin）**：<ruby>時間<rt>shí jiān</rt></ruby> · <ruby>畫布<rt>huà bù</rt></ruby> · <ruby>極客<rt>jí kè</rt></ruby>
  - **中文注音符號（Bopomofo / 台灣注音）**：<ruby>時間<rt>ㄕˊ ㄐㄧㄢ</rt></ruby> · <ruby>極客<rt>ㄐㄧˊ ㄎㄜˋ</rt></ruby> · <ruby>編程<rt>ㄅㄧㄢ ㄔㄥˊ</rt></ruby>
  - **日文漢字 + 平假名振假名（Furigana / 訓読・音読）**：<ruby>時間<rt>じかん</rt></ruby> · <ruby>明日<rt>あす</rt></ruby> · <ruby>儚い<rt>はかない</rt></ruby>
  - **日文片假名外來語與當て字（Katakana / Loanwords & Ateji）**：<ruby>畫布<rt>キャンバス</rt></ruby> · <ruby>電脳<rt>パソコン</rt></ruby> · <ruby>宇宙<rt>コスモ</rt></ruby>
  - **日文熟字訓（Jukujikun / 義訓特殊讀法）**：<ruby>煙草<rt>タバコ</rt></ruby> · <ruby>大人<rt>おとな</rt></ruby> · <ruby>今日<rt>きょう</rt></ruby>
  - **英文單詞 + IPA 國際音標標註（English + IPA Transcription）**：<ruby>EpoCanvas<rt>/ˌepəˈkænvəs/</rt></ruby> · <ruby>Aesthetics<rt>/esˈθetɪks/</rt></ruby> · <ruby>Chronos<rt>/ˈkrɒnɒs/</rt></ruby>
  - **法語音標與特殊連誦（French IPA & Special Pronunciation）**：<ruby>Rendez-vous<rt>/ʁɑ̃.de.vu/</rt></ruby> · <ruby>Déjà-vu<rt>/de.ʒa.vy/</rt></ruby> · <ruby>C'est la vie<rt>/sɛ la vi/</rt></ruby>
  - **德語變音與複合詞發音（German Umlaut & Compounds）**：<ruby>Zeitgeist<rt>/ˈtsaɪtɡaɪst/</rt></ruby> · <ruby>Schadenfreude<rt>/ˈʃaːdn̩ˌfʁɔʏ̯də/</rt></ruby>
  - **希臘文與其拉丁轉寫（Greek + Romanization）**：<ruby>Φιλοσοφία<rt>philosophia</rt></ruby> · <ruby>Καλημέρα<rt>kaliméra</rt></ruby>
  - **韓文漢字與諺文注音（Hanja + Hangul）**：<ruby>時間<rt>시간</rt></ruby> · <ruby>極客<rt>긱</rt></ruby> · <ruby>未來<rt>미래</rt></ruby>
  - **俄語/西里爾字母音標（Russian Cyrillic + IPA）**：<ruby>Привет<rt>/prʲɪˈvʲet/</rt></ruby> · <ruby>Спасибо<rt>/spɐˈsʲibə/</rt></ruby>
  - **梵文/天城文與 IAST 轉寫（Sanskrit Devanagari + IAST）**：<ruby>नमस्ते<rt>namaste</rt></ruby> · <ruby>शान्तिः<rt>śāntiḥ</rt></ruby>
- **縮寫說明**：<abbr title="Static Site Generator 靜態站點生成器">SSG</abbr> 與 <abbr title="Single Page Application 單頁應用程式">SPA</abbr>。
- **波浪與虛線下劃線**：<u class="u-wavy">波浪強調下劃線</u> 與 <u class="u-dashed">虛線注重下劃線</u>。
- **行動呼籲按鈕（CTA Buttons）**：
  - <a class="article-btn article-btn-primary" href="#top">返回頂部 ⬆️</a>
  - <a class="article-btn article-btn-outline" href="/archives/">查看全站歸檔 📂</a>

---

## 十二、腳註與懸浮氣泡（Footnotes）

在學術或長篇技術文章中，腳註是必不可少的引用形式。滑鼠懸浮於下方腳註角標即可直接彈出釋義氣泡[^ref-ssg-spec]，無需離開當前閱讀視口[^ref-epocanvas-ui]。

[^ref-ssg-spec]: **SSG 內容規範**：主流靜態站點生成器均遵循以 Markdown/GFM 為核心，以 MDX 或模板語言為擴展的現代內容工程標準。
[^ref-epocanvas-ui]: **EpoCanvas 美學規範**：以精緻的微交互、高對比色彩與克制的留白，為中文與全球極客社群帶來一流的閱讀體驗。

## 結語：構建面向未來的內容呈現系統

透過本次全量升級與擴展，`shijianus-blog` 在主內容欄（`.article-body.post-content`）上實現了對主流 SSG 內容格式、WordPress Post Formats、交互式下拉框、手風琴折疊、LaTeX 公式、Mermaid 圖表以及密碼加密等特異功能的全景覆蓋。

無論是嚴謹的長篇技術論文，還是輕量的人文生活隨筆，每一位創作者都能在這套系統中找到最契合的表達形態！
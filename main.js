const {
  Plugin,
  ItemView,
  PluginSettingTab,
  Setting,
  Notice,
  TFile,
  normalizePath,
  setIcon,
  MarkdownRenderer,
} = require("obsidian");

const VIEW_TYPE = "alex-desk-view";

const DEFAULT_SETTINGS = {
  autoOpen: true,
  displayName: "朋友",
  motto: "今天也把喜欢的事，认真做一点。",
  avatarPath: "",
  heroCaption: "把喜欢的画面，留在每天开始的地方。",
  heroImages: "",
  carouselEnabled: true,
  carouselSeconds: 8,
  colorMode: "auto",
  palette: "reading",
  insightsTitle: "知识概览",
  insightMetrics: "notes,characters,monthUpdates,activeDays",
  todayTitle: "当下",
  todayExcerptLines: 5,
  todayExcerptCharacters: 180,
  heatmapTitle: "文字热力图",
  heatmapWeeks: 26,
  dailyFolder: "今日随笔",
  clippingsFolder: "Clippings",
  recentLimit: 4,
};

const PALETTES = new Set(["reading", "monochrome", "pink", "ocean"]);

function el(parent, tag, cls = "", text = "") {
  return parent.createEl(tag, { cls, text });
}

function plainText(source) {
  return String(source || "")
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/!\[\[[^\]]+\]\]/g, "")
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, alias) => alias || target)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[#>*_`~=-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function excerpt(source, limit = 180) {
  const text = plainText(source);
  return text.length > limit ? `${text.slice(0, limit).trim()}…` : text;
}

function countCharacters(source) {
  return plainText(source).replace(/\s/g, "").length;
}

function compactNumber(value) {
  if (value >= 100000) return `${(value / 10000).toFixed(1)}万`;
  if (value >= 10000) return `${(value / 10000).toFixed(1)}万`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return String(value);
}

function greeting(hour) {
  if (hour < 6) return "夜深了";
  if (hour < 11) return "早上好";
  if (hour < 14) return "中午好";
  if (hour < 18) return "下午好";
  return "晚上好";
}

function parseTasks(source) {
  return String(source || "")
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*[-*]\s+\[ \]\s+(.+)$/i))
    .filter(Boolean)
    .map((match) => excerpt(match[1], 100));
}

function heatLevel(count) {
  if (!count) return 0;
  if (count < 200) return 1;
  if (count < 600) return 2;
  if (count < 1200) return 3;
  return 4;
}

class AlexDeskView extends ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
    this.renderId = 0;
    this.heroIndex = 0;
    this.carouselTimer = 0;
    this.insightDetailKey = "";
  }

  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return "Alex Desk"; }
  getIcon() { return "sparkles"; }

  async onOpen() {
    this.plugin.views.add(this);
    this.contentEl.addClass("alex-desk-root");
    await this.render();
  }

  async onClose() {
    this.plugin.views.delete(this);
    window.clearInterval(this.carouselTimer);
  }

  effectiveMode() {
    if (this.plugin.settings.colorMode === "day") return "day";
    if (this.plugin.settings.colorMode === "night") return "night";
    return document.body.classList.contains("theme-dark") ? "night" : "day";
  }

  applyAppearance() {
    this.contentEl.classList.remove("is-day", "is-night", "palette-reading", "palette-monochrome", "palette-pink", "palette-ocean");
    this.contentEl.classList.add(`is-${this.effectiveMode()}`);
    const palette = PALETTES.has(this.plugin.settings.palette) ? this.plugin.settings.palette : "reading";
    this.contentEl.classList.add(`palette-${palette}`);
  }

  async render() {
    const id = ++this.renderId;
    window.clearInterval(this.carouselTimer);
    this.applyAppearance();
    const root = this.contentEl;
    root.empty();
    el(root, "div", "ad-loading", "正在整理今天的桌面…");

    try {
      const data = await this.plugin.collectData();
      if (id !== this.renderId) return;
      root.empty();
      this.renderPage(root, data);
    } catch (error) {
      console.error("[Alex Desk]", error);
      root.empty();
      const card = el(root, "div", "ad-error");
      el(card, "strong", "", "桌面暂时没有准备好");
      el(card, "p", "", error.message || String(error));
      const retry = el(card, "button", "ad-solid-button", "再试一次");
      retry.addEventListener("click", () => this.render());
    }
  }

  renderPage(root, data) {
    const page = el(root, "div", "ad-page");
    this.renderGreeting(page, data);
    this.renderHero(page, data);
    this.renderInsights(page, data);

    const dashboard = el(page, "div", "ad-dashboard");
    this.renderToday(dashboard, data);
    this.renderHeatmap(dashboard, data);

    const footer = el(page, "footer", "ad-footer");
    el(footer, "span", "", "所有内容均保存在本地");
    el(footer, "span", "", `${data.totalNotes} 篇笔记`);
  }

  renderGreeting(parent, data) {
    const section = el(parent, "header", "ad-greeting");
    const identity = el(section, "div", "ad-identity");
    const avatar = el(identity, "div", "ad-avatar");
    if (data.avatarUrl) {
      const image = el(avatar, "img");
      image.src = data.avatarUrl;
      image.alt = `${this.plugin.settings.displayName} 的头像`;
    } else {
      avatar.appendText((this.plugin.settings.displayName || "A").slice(0, 1).toUpperCase());
    }
    const copy = el(identity, "div", "ad-greeting-copy");
    const line = el(copy, "span", "ad-decor-line");
    el(line, "i");
    const title = el(copy, "h1");
    title.appendText(`${data.greeting}，`);
    el(title, "em", "", this.plugin.settings.displayName || "朋友");
    el(copy, "p", "ad-date", `${data.dateLabel} · ${data.weekday}`);
    el(copy, "p", "ad-motto", this.plugin.settings.motto);

    const tools = el(section, "div", "ad-greeting-tools");
    const mode = el(tools, "button", "ad-tool-button");
    setIcon(mode, this.effectiveMode() === "night" ? "sun" : "moon");
    mode.setAttribute("aria-label", this.effectiveMode() === "night" ? "切换到白天模式" : "切换到黑夜模式");
    mode.addEventListener("click", () => this.toggleMode());
    const refresh = el(tools, "button", "ad-tool-button");
    setIcon(refresh, "refresh-cw");
    refresh.setAttribute("aria-label", "刷新主页");
    refresh.addEventListener("click", () => this.render());
  }

  async toggleMode() {
    this.plugin.settings.colorMode = this.effectiveMode() === "night" ? "day" : "night";
    await this.plugin.saveSettings();
    this.render();
  }

  renderHero(parent, data) {
    const hero = el(parent, "section", "ad-hero");
    this.heroImages = data.heroImages;
    if (data.heroImages.length) {
      this.heroIndex = ((this.heroIndex % data.heroImages.length) + data.heroImages.length) % data.heroImages.length;
      this.heroTrack = el(hero, "div", "ad-hero-track");
      data.heroImages.forEach((item, index) => {
        const slide = el(this.heroTrack, "button", "ad-hero-slide");
        slide.setAttribute("aria-label", item.noteFile ? `打开图片所在笔记：${item.noteFile.basename}` : item.name);
        const image = el(slide, "img", "ad-hero-image");
        image.src = item.url;
        image.alt = item.name;
        const plate = el(slide, "span", "ad-image-plate");
        el(plate, "time", "", item.date);
        const source = el(plate, "span");
        setIcon(source, item.noteFile ? "file-text" : "image");
        el(source, "strong", "", item.noteFile?.basename || item.name);
        slide.addEventListener("click", () => {
          if (item.noteFile) this.plugin.openFile(item.noteFile);
          else new Notice("仓库中暂未找到引用这张图片的笔记。");
        });
      });
      this.updateHeroTrack(false);
    } else {
      el(hero, "div", "ad-hero-fallback");
    }
    el(hero, "div", "ad-hero-shade");
    el(hero, "div", "ad-hero-blur");
    el(hero, "strong", "ad-hero-caption", this.plugin.settings.heroCaption);

    this.heroDots = [];
    const controls = el(hero, "div", "ad-carousel");
    if (data.heroImages.length > 1) {
      const previous = el(controls, "button", "ad-carousel-arrow");
      setIcon(previous, "chevron-left");
      previous.setAttribute("aria-label", "上一张封面");
      previous.addEventListener("click", () => this.changeHero(-1));
      const dots = el(controls, "span", "ad-dots");
      data.heroImages.forEach((_, index) => {
        const dot = el(dots, "button");
        dot.setAttribute("aria-label", `第 ${index + 1} 张封面`);
        dot.addEventListener("click", () => {
          this.heroIndex = index;
          this.updateHeroTrack(true);
        });
        this.heroDots.push(dot);
      });
      const next = el(controls, "button", "ad-carousel-arrow");
      setIcon(next, "chevron-right");
      next.setAttribute("aria-label", "下一张封面");
      next.addEventListener("click", () => this.changeHero(1));
    } else {
      el(controls, "span", "ad-single-dot");
    }
    this.updateHeroDots();

    if (this.plugin.settings.carouselEnabled && data.heroImages.length > 1) {
      const seconds = Math.max(3, Math.min(60, Number(this.plugin.settings.carouselSeconds) || 8));
      this.carouselTimer = window.setInterval(() => this.changeHero(1), seconds * 1000);
    }
  }

  changeHero(direction) {
    if (!this.heroImages?.length) return;
    this.heroIndex = (this.heroIndex + direction + this.heroImages.length) % this.heroImages.length;
    this.updateHeroTrack(true);
  }

  updateHeroTrack(animate = true) {
    if (!this.heroTrack || !this.heroImages?.length) return;
    this.heroTrack.toggleClass("is-animated", animate);
    this.heroTrack.style.transform = `translate3d(-${this.heroIndex * 100}%, 0, 0)`;
    this.updateHeroDots();
  }

  updateHeroDots() {
    this.heroDots?.forEach((dot, index) => dot.toggleClass("is-active", index === this.heroIndex));
  }

  renderInsights(parent, data) {
    const section = el(parent, "section", "ad-insights");
    const head = el(section, "header", "ad-section-title");
    el(head, "span", "ad-decor-line").createEl("i");
    el(head, "h2", "", this.plugin.settings.insightsTitle || "知识概览");
    const grid = el(section, "div", "ad-insight-grid");
    const selected = String(this.plugin.settings.insightMetrics || "")
      .split(",")
      .map((item) => item.trim())
      .filter((item) => data.insightMetrics[item]);
    const metricKeys = selected.length ? selected : ["notes", "characters", "monthUpdates", "activeDays"];
    metricKeys.forEach((key) => {
      const metric = data.insightMetrics[key];
      const card = el(grid, "button", `ad-insight-card ${this.insightDetailKey === key ? "is-active" : ""}`);
      const iconWrap = el(card, "span", "ad-insight-icon");
      setIcon(iconWrap, metric.icon);
      const copy = el(card, "span", "ad-insight-copy");
      el(copy, "strong", "", compactNumber(metric.value));
      el(copy, "small", "", metric.label);
      const disclosure = el(card, "i", "ad-insight-disclosure");
      setIcon(disclosure, this.insightDetailKey === key ? "chevron-up" : "chevron-down");
      card.addEventListener("click", () => {
        this.insightDetailKey = this.insightDetailKey === key ? "" : key;
        this.render();
      });
    });

    if (this.insightDetailKey && data.insightMetrics[this.insightDetailKey]) {
      const metric = data.insightMetrics[this.insightDetailKey];
      const detail = el(section, "div", "ad-insight-detail");
      const detailHead = el(detail, "header");
      el(detailHead, "strong", "", metric.detailTitle);
      el(detailHead, "span", "", `${metric.items.length} 项`);
      const list = el(detail, "div", "ad-source-list");
      metric.items.slice(0, 10).forEach((item) => {
        const row = el(list, "button", "ad-source-row");
        const text = el(row, "span");
        el(text, "strong", "", item.label);
        el(text, "small", "", item.meta);
        const arrow = el(row, "i");
        setIcon(arrow, "arrow-up-right");
        row.addEventListener("click", () => this.plugin.openFile(item.file));
      });
      if (!metric.items.length) el(list, "p", "ad-source-empty", "这个范围内还没有可显示的笔记。");
    }
  }

  panel(parent, title, className) {
    const panel = el(parent, "section", `ad-panel ${className}`);
    const head = el(panel, "header", "ad-panel-head");
    const titleWrap = el(head, "div", "ad-section-title");
    el(titleWrap, "span", "ad-decor-line").createEl("i");
    el(titleWrap, "h2", "", title);
    return { panel, head, body: el(panel, "div", "ad-panel-body") };
  }

  renderToday(parent, data) {
    const { head, body } = this.panel(parent, this.plugin.settings.todayTitle || "当下", "ad-today-panel");
    const badge = el(head, "span", "ad-day-badge", `今日 ${data.todayCharacters} 字`);
    badge.setAttribute("aria-label", "今日字数");

    if (!data.todayFile) {
      const empty = el(body, "button", "ad-today-empty");
      el(empty, "strong", "", "今天还是一张白纸");
      el(empty, "span", "", "写下第一句话，就已经是一次开始。");
      empty.addEventListener("click", () => this.plugin.openToday());
      return;
    }

    body.addClass("is-populated");
    const mainArea = el(body, "div", "ad-today-main");
    const now = el(mainArea, "div", "ad-now-card");
    now.setAttribute("role", "button");
    now.setAttribute("tabindex", "0");
    const nowCopy = el(now, "span");
    el(nowCopy, "strong", "", data.todayFile.basename);
    const excerptEl = el(nowCopy, "div", "ad-markdown-excerpt");
    excerptEl.style.setProperty("--excerpt-lines", String(Math.max(2, Math.min(12, Number(this.plugin.settings.todayExcerptLines) || 5))));
    this.renderMarkdownExcerpt(
      excerptEl,
      data.todayMarkdown,
      data.todayFile.path,
      Math.max(60, Math.min(500, Number(this.plugin.settings.todayExcerptCharacters) || 180)),
    );
    const arrow = el(now, "i");
    setIcon(arrow, "arrow-up-right");
    now.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      this.plugin.openFile(data.todayFile);
    });
    now.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") this.plugin.openFile(data.todayFile);
    });

    if (data.todayTasks.length) {
      const taskHead = el(mainArea, "div", "ad-subsection-title");
      el(taskHead, "span", "", "仍需完成");
      el(taskHead, "i");
      const list = el(mainArea, "div", "ad-task-list");
      data.todayTasks.slice(0, 4).forEach((task) => {
        const row = el(list, "button", "ad-task-row");
        el(row, "i");
        el(row, "span", "", task);
        row.addEventListener("click", () => this.plugin.openFile(data.todayFile));
      });
    }

    const relatedArea = el(body, "div", "ad-related-section");
    const relatedHead = el(relatedArea, "div", "ad-subsection-title");
    el(relatedHead, "span", "", "今日关联");
    el(relatedHead, "i");
    const related = el(relatedArea, "div", "ad-related-list");
    if (data.todayRelated.length) {
      data.todayRelated.slice(0, 4).forEach((file) => {
        const button = el(related, "button", "ad-related-item");
        const icon = el(button, "i");
        setIcon(icon, "link-2");
        el(button, "span", "", file.basename);
        button.addEventListener("click", () => this.plugin.openFile(file));
      });
    } else {
      el(related, "p", "", "今天的记录尚未连接其他笔记。");
    }
  }

  renderHeatmap(parent, data) {
    const { panel, head, body } = this.panel(parent, this.plugin.settings.heatmapTitle || "文字热力图", "ad-heatmap-panel");
    panel.id = "alex-desk-heatmap";
    const summary = el(head, "span", "ad-heatmap-range", `近 ${data.heatmap.days.length} 天`);
    const stats = el(body, "div", "ad-heatmap-stats");
    [
      [compactNumber(data.heatmap.totalCharacters), `近${data.heatmap.weeks}周日记字数`],
      [String(data.heatmap.activeDays), `近${data.heatmap.weeks}周写作日`],
      [compactNumber(data.heatmap.averageCharacters), "活跃日均字数"],
    ].forEach(([value, label]) => {
      const item = el(stats, "div");
      el(item, "strong", "", value);
      el(item, "span", "", label);
    });

    const chart = el(body, "div", "ad-heatmap-chart");
    const monthRow = el(chart, "div", "ad-heatmap-months");
    monthRow.style.setProperty("--weeks", String(data.heatmap.weeks));
    data.heatmap.monthLabels.forEach((item) => {
      const label = el(monthRow, "span", "", item.label);
      label.style.gridColumn = String(item.column + 1);
    });
    const weekdayLabels = el(chart, "div", "ad-heatmap-weekdays");
    el(weekdayLabels, "span", "", "一");
    el(weekdayLabels, "span", "", "三");
    el(weekdayLabels, "span", "", "五");
    const grid = el(chart, "div", "ad-heatmap-grid");
    grid.style.setProperty("--weeks", String(data.heatmap.weeks));
    data.heatmap.days.forEach((day) => {
      const cell = el(grid, "button", `ad-heat-cell heat-${heatLevel(day.characters)}`);
      if (day.isToday) cell.addClass("is-today");
      cell.setAttribute("aria-label", `${day.label}，${day.characters} 字`);
      cell.setAttribute("data-tooltip-position", "top");
      cell.addEventListener("click", () => {
        if (day.dailyFile) this.plugin.openFile(day.dailyFile);
        else if (day.isToday) this.plugin.openToday();
      });
    });

    const legend = el(body, "div", "ad-heat-legend");
    el(legend, "span", "", "少");
    for (let level = 1; level <= 4; level += 1) el(legend, "i", `heat-${level}`);
    el(legend, "span", "", "多");
    const best = el(legend, "button", "ad-best-day");
    el(best, "span", "", `单日日记最高 ${compactNumber(data.heatmap.bestDay.characters)} 字`);
    if (data.heatmap.bestDay.dailyFile) {
      best.setAttribute("aria-label", `打开 ${data.heatmap.bestDay.dailyFile.basename}`);
      const preview = el(best, "span", "ad-best-preview");
      el(preview, "strong", "", data.heatmap.bestDay.label);
      best.addEventListener("click", () => this.plugin.openFile(data.heatmap.bestDay.dailyFile));
    } else {
      best.disabled = true;
    }

    const recent = el(body, "div", "ad-heat-recent");
    const recentTitle = el(recent, "div", "ad-subsection-title");
    el(recentTitle, "span", "", "最近写作");
    el(recentTitle, "i");
    const recentList = el(recent, "div", "ad-heat-recent-list");
    data.heatmap.recentDays.forEach((day) => {
      const row = el(recentList, "button");
      el(row, "strong", "", day.label);
      el(row, "span", "", `${compactNumber(day.characters)} 字`);
      row.addEventListener("click", () => this.plugin.openFile(day.dailyFile));
    });
  }

  async renderMarkdownExcerpt(container, markdown, sourcePath, limit) {
    const cleaned = String(markdown || "")
      .replace(/^---[\s\S]*?---\s*/m, "")
      .replace(/^#\s+\d{4}年\d{1,2}月\d{1,2}日\s*$/m, "")
      .trim();
    if (!cleaned) {
      el(container, "p", "", "今天已经留下了一些文字。");
      return;
    }
    try {
      await MarkdownRenderer.render(this.app, cleaned, container, sourcePath, this);
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      let remaining = limit;
      let truncated = false;
      nodes.forEach((node) => {
        if (truncated) {
          node.textContent = "";
          return;
        }
        const value = node.textContent || "";
        if (value.length <= remaining) {
          remaining -= value.length;
          return;
        }
        node.textContent = `${value.slice(0, Math.max(0, remaining)).trimEnd()}…`;
        remaining = 0;
        truncated = true;
      });
      container.toggleClass("is-truncated", truncated);
    } catch (error) {
      console.error("[Alex Desk] Markdown render failed", error);
      container.setText(excerpt(markdown, limit));
    }
  }
}

class AlexDeskSettingTab extends PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.addClass("alex-desk-settings");
    containerEl.createEl("h2", { text: "Alex Desk" });
    containerEl.createEl("p", { text: "主页只保留需要被看见的信息。全部数据均从本地仓库读取。" });

    this.text("称呼", "显示在主页问候中。", "displayName");
    new Setting(containerEl)
      .setName("头像")
      .setDesc(this.plugin.settings.avatarPath || "尚未选择头像；留空时显示名字首字。")
      .addText((input) => input
        .setPlaceholder("Image/alex-desk-avatar.png")
        .setValue(this.plugin.settings.avatarPath || "")
        .onChange(async (value) => {
          this.plugin.settings.avatarPath = value.trim();
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }))
      .addButton((button) => button
        .setButtonText("选择图片")
        .onClick(() => {
          const picker = document.createElement("input");
          picker.type = "file";
          picker.accept = "image/png,image/jpeg,image/webp,image/gif";
          picker.addEventListener("change", async () => {
            const file = picker.files?.[0];
            if (!file) return;
            await this.plugin.saveAvatar(file);
            this.display();
          }, { once: true });
          picker.click();
        }));
    this.text("每日提醒", "问候下方的一句话。", "motto");
    this.text("封面文案", "显示在横幅底部。", "heroCaption");

    new Setting(containerEl)
      .setName("封面图片")
      .setDesc("每行填写一张仓库内图片路径。")
      .addTextArea((input) => input
        .setValue(this.plugin.settings.heroImages || "")
        .onChange(async (value) => {
          this.plugin.settings.heroImages = value;
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }));

    new Setting(containerEl)
      .setName("自动轮播")
      .addToggle((toggle) => toggle
        .setValue(this.plugin.settings.carouselEnabled)
        .onChange(async (value) => {
          this.plugin.settings.carouselEnabled = value;
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }));

    new Setting(containerEl)
      .setName("轮播间隔")
      .setDesc("3–30 秒。")
      .addSlider((slider) => slider
        .setLimits(3, 30, 1)
        .setDynamicTooltip()
        .setValue(Number(this.plugin.settings.carouselSeconds) || 8)
        .onChange(async (value) => {
          this.plugin.settings.carouselSeconds = value;
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }));

    new Setting(containerEl)
      .setName("昼夜模式")
      .setDesc("自动模式跟随 Obsidian。")
      .addDropdown((dropdown) => dropdown
        .addOption("auto", "跟随 Obsidian")
        .addOption("day", "白天")
        .addOption("night", "黑夜")
        .setValue(this.plugin.settings.colorMode)
        .onChange(async (value) => {
          this.plugin.settings.colorMode = value;
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }));

    new Setting(containerEl)
      .setName("配色主题")
      .addDropdown((dropdown) => dropdown
        .addOption("reading", "阅读暖纸")
        .addOption("monochrome", "黑白极简")
        .addOption("pink", "柔和粉红")
        .addOption("ocean", "静谧海蓝")
        .setValue(this.plugin.settings.palette)
        .onChange(async (value) => {
          this.plugin.settings.palette = value;
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }));

    this.text("数据模块标题", "例如：知识概览、写作数据、我的沉淀。", "insightsTitle");
    this.text(
      "数据指标",
      "用英文逗号分隔：notes（笔记数）、characters（总字数）、monthUpdates（本月更新）、activeDays（沉淀天数）、todayCharacters（今日字数）、monthCharacters（本月字数）。",
      "insightMetrics",
    );
    this.text("当下模块标题", "例如：当下、今日记录、此刻。", "todayTitle");
    new Setting(containerEl)
      .setName("当下摘要行数")
      .setDesc("控制当日笔记摘要显示 2–12 行。")
      .addSlider((slider) => slider
        .setLimits(2, 12, 1)
        .setDynamicTooltip()
        .setValue(Number(this.plugin.settings.todayExcerptLines) || 5)
        .onChange(async (value) => {
          this.plugin.settings.todayExcerptLines = value;
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }));
    new Setting(containerEl)
      .setName("当下摘要字数")
      .setDesc("超过设定字数后自动使用省略号，范围 60–500 字。")
      .addSlider((slider) => slider
        .setLimits(60, 500, 20)
        .setDynamicTooltip()
        .setValue(Number(this.plugin.settings.todayExcerptCharacters) || 180)
        .onChange(async (value) => {
          this.plugin.settings.todayExcerptCharacters = value;
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }));
    this.text("热力图标题", "例如：文字热力图、写作足迹、日记沉淀。", "heatmapTitle");
    new Setting(containerEl)
      .setName("热力图周数")
      .setDesc("显示最近 12–52 周。")
      .addSlider((slider) => slider
        .setLimits(12, 52, 1)
        .setDynamicTooltip()
        .setValue(Number(this.plugin.settings.heatmapWeeks) || 26)
        .onChange(async (value) => {
          this.plugin.settings.heatmapWeeks = value;
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }));
    this.text("今日随笔文件夹", "", "dailyFolder");
    this.text("知识素材文件夹", "", "clippingsFolder");

    new Setting(containerEl)
      .setName("启动时打开主页")
      .addToggle((toggle) => toggle
        .setValue(this.plugin.settings.autoOpen)
        .onChange(async (value) => {
          this.plugin.settings.autoOpen = value;
          await this.plugin.saveSettings();
        }));
  }

  text(name, desc, key) {
    new Setting(this.containerEl)
      .setName(name)
      .setDesc(desc)
      .addText((input) => input
        .setValue(String(this.plugin.settings[key] || ""))
        .onChange(async (value) => {
          this.plugin.settings[key] = value.trim();
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }));
  }
}

class AlexDeskPlugin extends Plugin {
  async onload() {
    this.views = new Set();
    const saved = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, saved);
    if (!this.settings.heroImages && saved?.heroImagePath) this.settings.heroImages = saved.heroImagePath;
    this.registerView(VIEW_TYPE, (leaf) => new AlexDeskView(leaf, this));
    this.addRibbonIcon("sparkles", "打开 Alex Desk", () => this.activateView());
    this.addCommand({ id: "open-alex-desk", name: "打开主页", callback: () => this.activateView() });
    this.addSettingTab(new AlexDeskSettingTab(this.app, this));
    this.registerEvent(this.app.vault.on("modify", () => this.scheduleRefresh()));
    this.registerEvent(this.app.vault.on("create", () => this.scheduleRefresh()));
    this.app.workspace.onLayoutReady(() => {
      if (this.settings.autoOpen && !this.app.workspace.getLeavesOfType(VIEW_TYPE).length) this.activateView();
    });
  }

  onunload() {
    window.clearTimeout(this.refreshTimer);
    this.app.workspace.detachLeavesOfType(VIEW_TYPE);
  }

  async saveSettings() { await this.saveData(this.settings); }
  refreshViews() { this.views.forEach((view) => view.render()); }
  scheduleRefresh() {
    window.clearTimeout(this.refreshTimer);
    this.refreshTimer = window.setTimeout(() => this.refreshViews(), 750);
  }

  async activateView() {
    let leaf = this.app.workspace.getLeavesOfType(VIEW_TYPE)[0];
    if (!leaf) {
      leaf = this.app.workspace.getLeaf("tab");
      await leaf.setViewState({ type: VIEW_TYPE, active: true });
    }
    this.app.workspace.revealLeaf(leaf);
  }

  filesIn(folder) {
    const prefix = normalizePath(folder || "").replace(/\/$/, "");
    if (!prefix) return [];
    return this.app.vault.getMarkdownFiles().filter((file) => file.path.startsWith(`${prefix}/`));
  }

  async read(file) {
    try { return await this.app.vault.cachedRead(file); }
    catch (_) { return ""; }
  }

  resolveImage(path) {
    if (!path) return "";
    const file = this.app.vault.getAbstractFileByPath(normalizePath(path.trim()));
    return file instanceof TFile ? this.app.vault.getResourcePath(file) : "";
  }

  resolveHeroImages(noteEntries) {
    return String(this.settings.heroImages || "")
      .split(/\r?\n|,/)
      .map((path) => normalizePath(path.trim()))
      .filter(Boolean)
      .map((path) => this.app.vault.getAbstractFileByPath(path))
      .filter((file) => file instanceof TFile)
      .map((file) => {
        const noteEntry = noteEntries.find((entry) =>
          entry.source.includes(file.path)
          || entry.source.includes(file.name)
          || entry.source.includes(file.basename));
        const frontmatter = noteEntry ? this.app.metadataCache.getFileCache(noteEntry.file)?.frontmatter : null;
        const rawDate = frontmatter?.date || frontmatter?.created || frontmatter?.createdAt;
        let dateMoment = rawDate ? window.moment(rawDate) : null;
        if (!dateMoment?.isValid()) {
          const basenameDate = noteEntry?.file.basename.match(/\d{4}-\d{2}-\d{2}/)?.[0];
          dateMoment = basenameDate ? window.moment(basenameDate, "YYYY-MM-DD") : window.moment(file.stat.ctime);
        }
        return {
          name: file.basename,
          url: this.app.vault.getResourcePath(file),
          noteFile: noteEntry?.file || null,
          date: dateMoment.format("YYYY年M月D日"),
        };
      });
  }

  async collectData() {
    const now = window.moment();
    const todayName = now.format("YYYY-MM-DD");
    const dailyFiles = this.filesIn(this.settings.dailyFolder);
    const todayFile = dailyFiles.find((file) => file.basename === todayName)
      || dailyFiles.find((file) => file.basename.includes(now.format("YYYY年MM月DD日")));
    const todaySource = todayFile ? await this.read(todayFile) : "";

    const allFiles = this.app.vault.getMarkdownFiles();
    const allSources = await Promise.all(allFiles.map((file) => this.read(file)));
    const allEntries = allFiles.map((file, index) => ({
      file,
      source: allSources[index],
      characters: countCharacters(allSources[index]),
    }));
    const totalCharacters = allEntries.reduce((sum, entry) => sum + entry.characters, 0);
    const currentMonthKey = now.format("YYYY-MM");
    const monthEntries = allEntries.filter((entry) => window.moment(entry.file.stat.mtime).format("YYYY-MM") === currentMonthKey);
    const monthUpdates = monthEntries.length;

    const dailyEntries = await Promise.all(dailyFiles.map(async (file) => {
      const source = await this.read(file);
      return {
        file,
        key: file.basename.match(/^\d{4}-\d{2}-\d{2}$/) ? file.basename : "",
        characters: countCharacters(source),
        preview: excerpt(source, 96),
      };
    }));
    const dailyMap = new Map(dailyEntries.filter((entry) => entry.key).map((entry) => [entry.key, entry]));
    const currentMonthDaily = dailyEntries.filter((entry) => entry.key.startsWith(currentMonthKey) && entry.characters);
    const heatmapWeeks = Math.max(12, Math.min(52, Number(this.settings.heatmapWeeks) || 26));
    const heatmapStart = now.clone().startOf("isoWeek").subtract(heatmapWeeks - 1, "weeks");
    const heatmapDays = Array.from({ length: heatmapWeeks * 7 }, (_, index) => {
      const moment = heatmapStart.clone().add(index, "days");
      const key = moment.format("YYYY-MM-DD");
      const entry = dailyMap.get(key);
      return {
        label: moment.format("YYYY年M月D日"),
        characters: entry?.characters || 0,
        preview: entry?.preview || "",
        isToday: key === now.format("YYYY-MM-DD"),
        dailyFile: entry?.file,
      };
    });
    const monthLabels = [];
    let lastMonth = "";
    for (let column = 0; column < heatmapWeeks; column += 1) {
      const weekMoment = heatmapStart.clone().add(column, "weeks");
      const monthKey = weekMoment.format("YYYY-MM");
      if (monthKey !== lastMonth) {
        monthLabels.push({ column, label: `${weekMoment.month() + 1}月` });
        lastMonth = monthKey;
      }
    }
    const heatmapActive = heatmapDays.filter((day) => day.characters);
    const bestHeatmapDay = heatmapActive.reduce(
      (best, day) => day.characters > best.characters ? day : best,
      { characters: 0, label: "暂无记录", preview: "", dailyFile: null },
    );
    const todayCache = todayFile ? this.app.metadataCache.getFileCache(todayFile) : null;
    const linkCandidates = [...(todayCache?.links || []), ...(todayCache?.embeds || [])];
    const todayRelated = [];
    const seenRelated = new Set();
    linkCandidates.forEach((link) => {
      const target = this.app.metadataCache.getFirstLinkpathDest(link.link, todayFile?.path || "");
      if (target instanceof TFile && target.extension === "md" && target.path !== todayFile?.path && !seenRelated.has(target.path)) {
        seenRelated.add(target.path);
        todayRelated.push(target);
      }
    });

    const sourceItem = (entry, meta) => ({
      file: entry.file,
      label: entry.file.basename,
      meta,
    });
    const byModified = [...allEntries].sort((a, b) => b.file.stat.mtime - a.file.stat.mtime);
    const byCharacters = [...allEntries].sort((a, b) => b.characters - a.characters);
    const monthCharacters = currentMonthDaily.reduce((sum, entry) => sum + entry.characters, 0);
    const todayCharacters = countCharacters(todaySource);
    const insightMetrics = {
      notes: {
        icon: "file-text",
        label: "全库笔记",
        value: allFiles.length,
        detailTitle: "构成笔记总数的最近文件",
        items: byModified.map((entry) => sourceItem(entry, `更新于 ${window.moment(entry.file.stat.mtime).format("M月D日 HH:mm")}`)),
      },
      characters: {
        icon: "text",
        label: "全库字数",
        value: totalCharacters,
        detailTitle: "字数最多的笔记",
        items: byCharacters.map((entry) => sourceItem(entry, `${compactNumber(entry.characters)} 字`)),
      },
      monthUpdates: {
        icon: "calendar-days",
        label: "本月有改动笔记",
        value: monthUpdates,
        detailTitle: "本月更新过的笔记",
        items: monthEntries
          .sort((a, b) => b.file.stat.mtime - a.file.stat.mtime)
          .map((entry) => sourceItem(entry, window.moment(entry.file.stat.mtime).format("M月D日 HH:mm"))),
      },
      activeDays: {
        icon: "flame",
        label: "本月日记天数",
        value: currentMonthDaily.length,
        detailTitle: "本月写下文字的日记",
        items: currentMonthDaily
          .sort((a, b) => b.key.localeCompare(a.key))
          .map((entry) => sourceItem(entry, `${entry.key} · ${compactNumber(entry.characters)} 字`)),
      },
      todayCharacters: {
        icon: "pen-line",
        label: "今日日记字数",
        value: todayCharacters,
        detailTitle: "今天的文字",
        items: todayFile ? [sourceItem({ file: todayFile }, `${compactNumber(todayCharacters)} 字`)] : [],
      },
      monthCharacters: {
        icon: "chart-no-axes-column",
        label: "本月日记字数",
        value: monthCharacters,
        detailTitle: "本月每日文字",
        items: currentMonthDaily
          .sort((a, b) => b.key.localeCompare(a.key))
          .map((entry) => sourceItem(entry, `${entry.key} · ${compactNumber(entry.characters)} 字`)),
      },
    };

    return {
      greeting: greeting(now.hour()),
      dateLabel: now.format("YYYY年M月D日"),
      weekday: `星期${"日一二三四五六"[now.day()]}`,
      avatarUrl: this.resolveImage(this.settings.avatarPath),
      heroImages: this.resolveHeroImages(allEntries),
      todayFile,
      todayMarkdown: todaySource,
      todayExcerpt: excerpt(
        todaySource,
        Math.max(60, Math.min(500, Number(this.settings.todayExcerptCharacters) || 180)),
      ),
      todayCharacters,
      todayTasks: parseTasks(todaySource),
      todayRelated,
      totalNotes: allFiles.length,
      totalCharacters,
      monthUpdates,
      insightMetrics,
      heatmap: {
        weeks: heatmapWeeks,
        days: heatmapDays,
        monthLabels,
        activeDays: heatmapActive.length,
        totalCharacters: heatmapActive.reduce((sum, day) => sum + day.characters, 0),
        averageCharacters: heatmapActive.length
          ? Math.round(heatmapActive.reduce((sum, day) => sum + day.characters, 0) / heatmapActive.length)
          : 0,
        bestDay: bestHeatmapDay,
        recentDays: [...heatmapActive].reverse().slice(0, 4),
      },
    };
  }

  async ensureFolder(folder) {
    const normalized = normalizePath(folder);
    if (!this.app.vault.getAbstractFileByPath(normalized)) await this.app.vault.createFolder(normalized);
    return normalized;
  }

  async saveAvatar(sourceFile) {
    const folder = await this.ensureFolder("Image");
    const rawExtension = sourceFile.name.split(".").pop()?.toLowerCase() || "png";
    const extension = ["png", "jpg", "jpeg", "webp", "gif"].includes(rawExtension) ? rawExtension : "png";
    const path = normalizePath(`${folder}/alex-desk-avatar.${extension}`);
    const binary = await sourceFile.arrayBuffer();
    const existing = this.app.vault.getAbstractFileByPath(path);
    if (existing instanceof TFile) await this.app.vault.modifyBinary(existing, binary);
    else await this.app.vault.createBinary(path, binary);
    this.settings.avatarPath = path;
    await this.saveSettings();
    this.refreshViews();
    new Notice("头像已保存到本地仓库。");
  }

  async openToday() {
    const now = window.moment();
    const folder = await this.ensureFolder(this.settings.dailyFolder || "今日随笔");
    const path = normalizePath(`${folder}/${now.format("YYYY-MM-DD")}.md`);
    let file = this.app.vault.getAbstractFileByPath(path);
    if (!(file instanceof TFile)) {
      file = await this.app.vault.create(path, `---\ndate: ${now.format("YYYY-MM-DD")}\ntags:\n  - 每日随笔\n---\n\n# ${now.format("YYYY年M月D日")}\n\n`);
    }
    await this.openFile(file);
  }

  async openFile(file) {
    if (!(file instanceof TFile)) return;
    const leaf = this.app.workspace.getLeaf("tab");
    await leaf.openFile(file);
    this.app.workspace.setActiveLeaf(leaf, { focus: true });
  }
}

module.exports = AlexDeskPlugin;

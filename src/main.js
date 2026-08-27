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
const { spawn } = require("child_process");
const { createElasticMesh } = require("./elastic-mesh");
const audioMeterModule = require("./audio-meter.ps1");
const AUDIO_METER_SCRIPT = audioMeterModule.default || audioMeterModule;

const VIEW_TYPE = "alex-desk-view";

const DEFAULT_SETTINGS = {
  autoOpen: true,
  displayName: "朋友",
  motto: "今天也把喜欢的事，认真做一点。",
  avatarPath: "",
  avatarPositionY: 50,
  heroCaption: "把喜欢的画面，留在每天开始的地方。",
  heroImages: "",
  carouselEnabled: true,
  carouselSeconds: 8,
  heroAutoPan: true,
  heroImagePositions: {},
  systemSpectrumEnabled: false,
  systemSpectrumColor: "",
  systemSpectrumStyle: "soft-bars",
  systemSpectrumThreshold: 12,
  colorMode: "auto",
  palette: "reading",
  insightsTitle: "知识概览",
  insightMetrics: "notes,characters,monthUpdates,activeDays",
  todayTitle: "当下",
  heatmapTitle: "文字热力图",
  heatmapWeeks: 26,
  rediscoverySoundEnabled: true,
  rediscoverySoundVolume: 0.22,
  birthDate: "",
  lifeProgressTitle: "人生进度",
  lifeProgressMark: "人",
  lifeProgressMarkColor: "",
  lifeProgressMarkFont: "PingFang SC",
  dailyFolder: "今日随笔",
  clippingsFolder: "Clippings",
  taskFolders: "",
  recentLimit: 4,
};

const PALETTES = new Set(["reading", "monochrome", "pink", "ocean"]);

function el(parent, tag, cls = "", text = "") {
  return parent.createEl(tag, { cls, text });
}

function gummyArrow(parent) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", "M8.3 6.7C9.95 8.3 11.8 10.05 13.55 11.55C13.9 11.85 13.9 12.35 13.55 12.65C11.8 14.15 9.95 15.9 8.3 17.5");
  svg.appendChild(path);
  parent.appendChild(svg);
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

function withoutMarkdownImages(source) {
  return String(source || "")
    .replace(/!\[\[[^\]]+\]\]/g, "")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, "")
    .replace(/<img\b[^>]*>/gi, "")
    .trim();
}

function clampRenderedText(container, limit = 32) {
  const nodes = [];
  const walker = document.createTreeWalker(container, 4);
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const fullText = Array.from(String(container.textContent || "").replace(/\s+/g, " ").trim());
  if (fullText.length <= limit) return;
  let remaining = limit;
  let lastKept = null;
  let previousWasSpace = false;
  nodes.forEach((node) => {
    if (remaining <= 0) {
      node.nodeValue = "";
      return;
    }
    let nextValue = "";
    for (const character of Array.from(node.nodeValue || "")) {
      const isSpace = /\s/.test(character);
      if (isSpace && (previousWasSpace || !nextValue && !lastKept)) continue;
      const normalized = isSpace ? " " : character;
      if (remaining <= 0) break;
      nextValue += normalized;
      remaining -= 1;
      previousWasSpace = isSpace;
    }
    node.nodeValue = nextValue;
    if (nextValue.trim()) lastKept = node;
  });
  if (lastKept) lastKept.nodeValue = `${lastKept.nodeValue.replace(/[.…\s]+$/u, "")}…`;
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
    this.rediscoveryIndex = 0;
    this.optionWheelFrame = 0;
    this.optionWheelTimer = 0;
    this.wheelLastTick = 0;
    this.wheelAudioContext = null;
    this.lifeWheelFrame = 0;
    this.lifeWheelTimer = 0;
    this.calendarLayer = null;
    this.calendarOutsideHandler = null;
    this.spectrumFrame = 0;
    this.spectrumLastSoundAt = 0;
    this.heroMeshCleanup = null;
    this.heroMeshToken = 0;
  }

  getViewType() { return VIEW_TYPE; }
  getDisplayText() { return "每日专注主页"; }
  getIcon() { return "sparkles"; }

  async onOpen() {
    this.plugin.views.add(this);
    this.contentEl.addClass("alex-desk-root");
    await this.render();
  }

  async onClose() {
    this.plugin.views.delete(this);
    window.clearInterval(this.carouselTimer);
    window.cancelAnimationFrame(this.optionWheelFrame);
    window.clearTimeout(this.optionWheelTimer);
    window.cancelAnimationFrame(this.lifeWheelFrame);
    window.cancelAnimationFrame(this.spectrumFrame);
    window.clearTimeout(this.lifeWheelTimer);
    if (this.calendarOutsideHandler) document.removeEventListener("pointerdown", this.calendarOutsideHandler, true);
    this.calendarOutsideHandler = null;
    this.calendarLayer?.remove();
    this.calendarLayer = null;
    this.heroMeshToken += 1;
    this.heroMeshCleanup?.();
    this.heroMeshCleanup = null;
    this.wheelAudioContext?.close?.().catch(() => {});
    this.wheelAudioContext = null;
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
    window.cancelAnimationFrame(this.optionWheelFrame);
    window.clearTimeout(this.optionWheelTimer);
    window.cancelAnimationFrame(this.lifeWheelFrame);
    window.cancelAnimationFrame(this.spectrumFrame);
    window.clearTimeout(this.lifeWheelTimer);
    if (this.calendarOutsideHandler) document.removeEventListener("pointerdown", this.calendarOutsideHandler, true);
    this.calendarOutsideHandler = null;
    this.calendarLayer?.remove();
    this.calendarLayer = null;
    this.heroMeshToken += 1;
    this.heroMeshCleanup?.();
    this.heroMeshCleanup = null;
    this.optionWheelFrame = 0;
    this.lifeWheelFrame = 0;
    this.spectrumFrame = 0;
    this.spectrumLastSoundAt = performance.now();
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
      console.error("[每日专注主页]", error);
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
      const avatarPosition = Number(this.plugin.settings.avatarPositionY);
      image.style.objectPosition = `50% ${Number.isFinite(avatarPosition) ? Math.min(100, Math.max(0, avatarPosition)) : 50}%`;
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
    const paletteNames = {
      reading: ["book-open", "阅读暖纸"],
      monochrome: ["circle", "黑白极简"],
      pink: ["heart", "柔和粉红"],
      ocean: ["waves", "静谧海蓝"],
    };
    const activePalette = PALETTES.has(this.plugin.settings.palette) ? this.plugin.settings.palette : "reading";
    const palette = el(tools, "button", `ad-tool-button ad-palette-button palette-${activePalette}`);
    setIcon(palette, paletteNames[activePalette][0]);
    palette.setAttribute("aria-label", `当前主题：${paletteNames[activePalette][1]}，点击切换`);
    palette.addEventListener("click", () => this.cyclePalette());
    const mode = el(tools, "button", "ad-tool-button");
    setIcon(mode, this.effectiveMode() === "night" ? "sun" : "moon");
    mode.setAttribute("aria-label", this.effectiveMode() === "night" ? "切换到白天模式" : "切换到黑夜模式");
    mode.addEventListener("click", () => this.toggleMode());
  }

  async toggleMode() {
    this.plugin.settings.colorMode = this.effectiveMode() === "night" ? "day" : "night";
    await this.plugin.saveSettings();
    this.render();
  }

  async cyclePalette() {
    const palettes = ["reading", "monochrome", "pink", "ocean"];
    const current = palettes.indexOf(this.plugin.settings.palette);
    this.plugin.settings.palette = palettes[(current + 1 + palettes.length) % palettes.length];
    await this.plugin.saveSettings();
    this.render();
  }

  renderHero(parent, data) {
    const hero = el(parent, "section", "ad-hero");
    hero.toggleClass("is-auto-pan", this.plugin.settings.heroAutoPan !== false);
    this.heroImages = data.heroImages;
    this.heroSlides = [];
    if (data.heroImages.length) {
      this.heroIndex = ((this.heroIndex % data.heroImages.length) + data.heroImages.length) % data.heroImages.length;
      this.heroTrack = el(hero, "div", "ad-hero-track");
      data.heroImages.forEach((item, index) => {
        const slide = el(this.heroTrack, "button", "ad-hero-slide");
        slide.setAttribute("aria-label", item.noteFile ? `打开图片所在笔记：${item.noteFile.basename}` : item.name);
        const image = el(slide, "img", "ad-hero-image");
        image.src = item.url;
        image.alt = item.name;
        image.draggable = false;
        this.heroSlides.push({ slide, imageUrl: item.url, imageElement: image });
        const savedPosition = Number(this.plugin.settings.heroImagePositions?.[item.path]);
        if (Number.isFinite(savedPosition)) {
          image.style.setProperty("--ad-hero-pan", `${savedPosition}%`);
          slide.addClass("is-user-positioned");
        }
        this.bindHeroPan(slide, image, item);
        const panHint = el(slide, "span", "ad-pan-hint");
        const panIcon = el(panHint, "i");
        setIcon(panIcon, "grip-horizontal");
        el(panHint, "span", "", "上下拖动取景");
        const plate = el(slide, "span", "ad-image-plate");
        el(plate, "time", "", item.date);
        const source = el(plate, "span");
        setIcon(source, item.noteFile ? "file-text" : "image");
        const sourceName = el(source, "strong", "", item.noteFile?.basename || item.name);
        sourceName.setAttribute("title", item.noteFile?.basename || item.name);
        slide.addEventListener("click", (event) => {
          if (slide.dataset.wasDragged === "true") {
            event.preventDefault();
            return;
          }
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
    this.renderSystemSpectrum(hero);

    this.heroDots = [];
    const controls = el(hero, "div", "ad-carousel");
    if (data.heroImages.length > 1) {
      const previous = el(controls, "button", "ad-carousel-arrow");
      previous.addClass("is-previous");
      gummyArrow(previous);
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
      next.addClass("is-next");
      gummyArrow(next);
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

  renderSystemSpectrum(hero) {
    if (this.plugin.settings.systemSpectrumEnabled !== true) return;
    const spectrum = el(hero, "div", "ad-system-spectrum");
    spectrum.setAttribute("aria-hidden", "true");
    const availableStyles = new Set(["soft-bars", "mirror", "dots", "blocks"]);
    const selectedStyle = availableStyles.has(this.plugin.settings.systemSpectrumStyle)
      ? this.plugin.settings.systemSpectrumStyle
      : "soft-bars";
    spectrum.addClass(`style-${selectedStyle}`);
    const customColor = String(this.plugin.settings.systemSpectrumColor || "").trim();
    if (customColor) spectrum.style.setProperty("--ad-spectrum-color", customColor);
    const bars = Array.from({ length: 54 }, () => el(spectrum, "i"));
    const draw = () => {
      if (!spectrum.isConnected || this.plugin.settings.systemSpectrumEnabled !== true) return;
      const levels = this.plugin.readSystemSpectrum(bars.length);
      const now = performance.now();
      if (this.plugin.isSystemAudioAudible(levels)) this.spectrumLastSoundAt = now;
      const shouldHide = now - this.spectrumLastSoundAt >= 10000;
      spectrum.toggleClass("is-silent-hidden", shouldHide);
      if (!levels) {
        spectrum.removeClass("is-listening");
        spectrum.removeClass("is-active");
        if (!this.plugin.systemAudioUnavailable || !shouldHide) this.spectrumFrame = window.requestAnimationFrame(draw);
        return;
      }
      let active = false;
      bars.forEach((bar, index) => {
        const level = levels?.[index] || 0;
        if (level > .035) active = true;
        bar.style.setProperty("--ad-spectrum-level", String(Math.max(.16, Math.min(1, level))));
        bar.style.setProperty("--ad-spectrum-dot-offset", `${((.5 - level) * 15).toFixed(2)}px`);
        bar.style.setProperty("--ad-spectrum-dot-scale", String((.72 + level * .38).toFixed(3)));
      });
      spectrum.addClass("is-listening");
      spectrum.toggleClass("is-active", active);
      this.spectrumFrame = window.requestAnimationFrame(draw);
    };
    this.plugin.startSystemAudioCapture(false).finally(() => {
      if (!this.spectrumFrame && spectrum.isConnected) draw();
    });
    draw();
  }

  bindHeroPan(slide, image, item) {
    let drag = null;
    const clamp = (value) => Math.max(-6, Math.min(6, value));
    const currentPosition = () => {
      const inline = parseFloat(image.style.getPropertyValue("--ad-hero-pan"));
      return Number.isFinite(inline) ? inline : 0;
    };
    const applyPosition = (value) => {
      const next = clamp(value);
      image.style.setProperty("--ad-hero-pan", `${next}%`);
      return next;
    };
    const finish = async (event) => {
      if (!drag) return;
      const completed = drag;
      drag = null;
      slide.removeClass("is-panning");
      if (slide.hasPointerCapture?.(event.pointerId)) slide.releasePointerCapture(event.pointerId);
      if (!completed.moved) return;
      slide.dataset.wasDragged = "true";
      window.setTimeout(() => { slide.dataset.wasDragged = "false"; }, 0);
      slide.addClass("is-user-positioned");
      const positions = { ...(this.plugin.settings.heroImagePositions || {}) };
      positions[item.path] = Number(currentPosition().toFixed(2));
      this.plugin.settings.heroImagePositions = positions;
      await this.plugin.saveSettings();
    };

    slide.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      drag = {
        pointerId: event.pointerId,
        startY: event.clientY,
        startPosition: currentPosition(),
        moved: false,
      };
      slide.addClass("is-panning");
    });
    slide.addEventListener("pointermove", (event) => {
      if (!drag || drag.pointerId !== event.pointerId) return;
      const delta = event.clientY - drag.startY;
      if (!drag.moved && Math.abs(delta) > 4) {
        drag.moved = true;
        slide.setPointerCapture?.(event.pointerId);
      }
      if (!drag.moved) return;
      event.preventDefault();
      applyPosition(drag.startPosition + (delta / Math.max(slide.clientHeight, 1)) * 18);
    });
    slide.addEventListener("pointerup", finish);
    slide.addEventListener("pointercancel", finish);
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
    this.activateHeroMesh();
  }

  updateHeroDots() {
    this.heroDots?.forEach((dot, index) => dot.toggleClass("is-active", index === this.heroIndex));
  }

  activateHeroMesh() {
    const token = ++this.heroMeshToken;
    this.heroMeshCleanup?.();
    this.heroMeshCleanup = null;
    const current = this.heroSlides?.[this.heroIndex];
    const meshFactory = this.plugin.createElasticMesh;
    if (!current?.slide?.isConnected || !current.imageUrl || typeof meshFactory !== "function") return;
    meshFactory(current.slide, current.imageUrl, {
      interaction: "hover",
      tilt: 0,
      shading: .78,
      resolution: 25,
      stiffness: .05,
      damping: .2,
      grabRadius: .6,
      pull: .4,
      wobble: 5,
      borderRadius: 30,
      sourceElement: current.imageElement,
    }).then((cleanup) => {
      if (token !== this.heroMeshToken || !current.slide.isConnected) {
        cleanup?.();
        return;
      }
      this.heroMeshCleanup = cleanup;
    }).catch((error) => console.warn("[每日专注主页] 弹性横幅不可用", error));
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
      metric.items.forEach((item) => {
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
    body.addClass("is-today-layout");

    if (!data.todayFile) {
      const empty = el(body, "button", "ad-today-empty");
      el(empty, "strong", "", "今天还是一张白纸");
      el(empty, "span", "", "写下第一句话，就已经是一次开始。");
      empty.addEventListener("click", () => this.plugin.openToday());
      this.renderLifeProgress(body, data.lifeProgress);
      return;
    }

    body.addClass("is-populated");
    const mainArea = el(body, "div", "ad-today-main");
    const now = el(mainArea, "div", "ad-now-card");
    now.setAttribute("role", "button");
    now.setAttribute("tabindex", "0");
    const nowCopy = el(now, "span");
    el(nowCopy, "strong", "", data.todayFile.basename);
    const excerptFrame = el(nowCopy, "div", "ad-markdown-frame");
    const excerptEl = el(excerptFrame, "div", "ad-markdown-excerpt");
    this.renderMarkdownExcerpt(excerptEl, data.todayMarkdown, data.todayFile.path);
    now.addEventListener("click", (event) => {
      if (event.target.closest("a")) return;
      this.plugin.openFile(data.todayFile);
    });
    now.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") this.plugin.openFile(data.todayFile);
    });

    this.renderLifeProgress(body, data.lifeProgress);

    if (data.todayRelated.length) {
      const relatedArea = el(body, "div", "ad-related-section");
      const relatedHead = el(relatedArea, "div", "ad-subsection-title");
      el(relatedHead, "span", "", "今日关联");
      el(relatedHead, "i");
      const related = el(relatedArea, "div", "ad-related-list");
      data.todayRelated.slice(0, 4).forEach((file) => {
        const button = el(related, "button", "ad-related-item");
        const icon = el(button, "i");
        setIcon(icon, "link-2");
        el(button, "span", "", file.basename);
        button.addEventListener("click", () => this.plugin.openFile(file));
      });
    }
  }

  renderLifeProgress(parent, data) {
    const section = el(parent, "section", `ad-life-progress glass-surface ${data.hasBirthDate ? "" : "is-unset"}`);
    const head = el(section, "header", "ad-life-head");
    const identity = el(head, "div", "ad-life-identity");
    const lifeMark = (this.plugin.settings.lifeProgressMark || "人").slice(0, 2);
    const lifeOrb = el(identity, "span", "ad-life-orb", lifeMark);
    lifeOrb.addClass(lifeMark.length === 1 ? "is-single" : "is-pair");
    if (/^[a-z\d]{2}$/i.test(lifeMark)) lifeOrb.addClass("is-latin-pair");
    const lifeMarkColor = String(this.plugin.settings.lifeProgressMarkColor || "").trim();
    if (lifeMarkColor && CSS.supports("color", lifeMarkColor)) {
      lifeOrb.style.setProperty("--ad-life-mark-color", lifeMarkColor);
      lifeOrb.style.setProperty("color", lifeMarkColor, "important");
    }
    const lifeMarkFont = String(this.plugin.settings.lifeProgressMarkFont || "PingFang SC").trim();
    if (lifeMarkFont && CSS.supports("font-family", lifeMarkFont)) {
      lifeOrb.style.setProperty("--ad-life-mark-font", lifeMarkFont);
    }
    const copy = el(identity, "div");
    el(copy, "strong", "", this.plugin.settings.lifeProgressTitle || "人生进度");
    const daysLine = el(copy, "span", "ad-life-days-line");
    el(daysLine, "em", "", data.hasBirthDate ? "已经走过" : "记录跨度");
    const daysSlot = el(daysLine, "b", "ad-life-days-slot");
    let displayedLifeDays = data.hasBirthDate ? data.livedDays : data.journalSpanDays;
    el(daysLine, "em", "", "天");
    const digitModulo = (value) => ((value % 10) + 10) % 10;
    const buildLifeDigits = (value) => {
      daysSlot.empty();
      String(value.toLocaleString()).split("").forEach((character) => {
        if (!/\d/.test(character)) {
          el(daysSlot, "i", "ad-life-digit-separator", character);
          return;
        }
        const digit = Number(character);
        const cell = el(daysSlot, "i", "ad-life-digit-cell");
        cell.dataset.digit = String(digit);
        cell._position = 20 + digit;
        const reel = el(cell, "span", "ad-life-digit-reel");
        for (let index = 0; index <= 40; index += 1) el(reel, "b", "", String(index % 10));
        reel.style.transition = "none";
        reel.style.transform = `translateY(${-cell._position * 1.28}em)`;
        window.requestAnimationFrame(() => { reel.style.transition = ""; });
      });
    };
    buildLifeDigits(displayedLifeDays);
    const calendarJumpButton = el(head, "button", "ad-life-today-button is-visible");
    const calendarJumpIcon = el(calendarJumpButton, "i");
    setIcon(calendarJumpIcon, "calendar-days");
    el(calendarJumpButton, "span", "", "日期");
    calendarJumpButton.setAttribute("aria-label", "查看并跳转日期");
    calendarJumpButton.setAttribute("aria-haspopup", "dialog");
    calendarJumpButton.setAttribute("aria-expanded", "false");

    const wheel = el(section, "div", "ad-life-wheel");
    wheel.setAttribute("role", "listbox");
    wheel.setAttribute("tabindex", "0");
    wheel.setAttribute("aria-description", "使用滚轮或拖动回看过去日期");
    el(wheel, "span", "ad-life-wheel-glow");
    const dateTrigger = el(wheel, "button", "ad-life-selected-label", "今天");
    const selectedLabel = dateTrigger;
    dateTrigger.setAttribute("aria-description", "打开日期定位");
    dateTrigger.setAttribute("aria-haspopup", "dialog");
    dateTrigger.setAttribute("aria-expanded", "false");
    const calendarLayer = document.body.createDiv({ cls: "ad-life-calendar-layer" });
    calendarLayer.addClass(`is-${this.effectiveMode()}`);
    this.calendarLayer = calendarLayer;
    const appearance = getComputedStyle(this.contentEl);
    ["--ad-bg", "--ad-card", "--ad-line", "--ad-accent", "--ad-text", "--ad-sub", "--ad-muted", "--ad-soft", "--ad-on-heat", "--ad-glass-strong"]
      .forEach((property) => calendarLayer.style.setProperty(property, appearance.getPropertyValue(property)));
    const calendar = el(calendarLayer, "div", "ad-life-calendar");
    calendar.setAttribute("role", "dialog");
    calendar.setAttribute("aria-label", "选择人生进度日期");
    calendar.setAttribute("aria-hidden", "true");
    const returnButton = el(wheel, "button", "ad-life-calendar-trigger");
    for (let index = 0; index < 6; index += 1) {
      const ring = el(returnButton, "span", "ad-life-magic-ring");
      ring.style.setProperty("--ad-ring-size", `${16 + index * 5}px`);
      ring.style.setProperty("--ad-ring-angle", `${index * 31}deg`);
      ring.style.setProperty("--ad-ring-mix", `${56 - index * 5}%`);
      ring.style.setProperty("--ad-ring-peak", String(.5 - index * .055));
      ring.style.setProperty("--ad-ring-mid", String(.32 - index * .04));
      ring.style.setProperty("--ad-ring-duration", `${4.15 + index * .28}s`);
      ring.style.setProperty("--ad-ring-delay", `${index * -.61}s`);
    }
    returnButton.setAttribute("aria-label", "回到今天");
    returnButton.disabled = true;

    const slotCount = 11;
    const centerSlot = Math.floor(slotCount / 2);
    const slots = Array.from({ length: slotCount }, (_, index) => {
      const button = el(wheel, "button", "ad-life-day");
      button.setAttribute("role", "option");
      el(button, "strong");
      el(button, "span");
      el(button, "i");
      el(button, "b", "ad-life-dial-tick");
      button.dataset.relative = String(index - centerSlot);
      return button;
    });

    let position = 0;
    let target = 0;
    let selectedOffset = 0;
    let lastFrame = performance.now();
    let drag = null;
    let dragMoved = false;
    const dayWidth = 58;
    const clamp = (value) => Math.max(0, Math.min(data.maxOffset, value));
    const entryForOffset = (offset) => {
      const key = window.moment().startOf("day").subtract(offset, "days").format("YYYY-MM-DD");
      return { key, entry: data.noteDays.get(key), moment: window.moment(key, "YYYY-MM-DD") };
    };
    const updateLifeDays = (offset) => {
      const nextValue = Math.max(0, (data.hasBirthDate ? data.livedDays : data.journalSpanDays) - offset);
      if (nextValue === displayedLifeDays) return;
      const previousText = displayedLifeDays.toLocaleString();
      const nextText = nextValue.toLocaleString();
      if (previousText.length !== nextText.length) {
        displayedLifeDays = nextValue;
        buildLifeDigits(nextValue);
        return;
      }
      const direction = nextValue < displayedLifeDays ? -1 : 1;
      const children = Array.from(daysSlot.children);
      nextText.split("").forEach((character, index) => {
        const cell = children[index];
        if (!cell || !/\d/.test(character) || cell.dataset.digit === character) return;
        const targetDigit = Number(character);
        let nextPosition = Number(cell._position);
        do nextPosition += direction; while (digitModulo(nextPosition) !== targetDigit);
        cell._position = nextPosition;
        cell.dataset.digit = character;
        const reel = cell.querySelector(".ad-life-digit-reel");
        const inertiaDelay = Math.max(0, nextText.length - 1 - index) * 18;
        reel.style.transitionDelay = `${inertiaDelay}ms`;
        reel.style.transform = `translateY(${-nextPosition * 1.28}em)`;
        window.clearTimeout(cell._rebaseTimer);
        cell._rebaseTimer = window.setTimeout(() => {
          if (cell._position >= 10 && cell._position <= 30) return;
          const rebased = 20 + Number(cell.dataset.digit);
          reel.style.transition = "none";
          cell._position = rebased;
          reel.style.transform = `translateY(${-rebased * 1.28}em)`;
          window.requestAnimationFrame(() => { reel.style.transition = ""; });
        }, 520 + inertiaDelay);
      });
      displayedLifeDays = nextValue;
    };

    const updateSelected = (offset, withSound = true) => {
      const next = Math.round(clamp(offset));
      if (next === selectedOffset && selectedLabel.textContent) return;
      selectedOffset = next;
      const { moment } = entryForOffset(next);
      selectedLabel.setText(next === 0 ? "今天" : moment.format("M月D日"));
      updateLifeDays(next);
      returnButton.disabled = next === 0;
      returnButton.toggleClass("is-available", next > 0);
      if (withSound) this.playWheelTick();
    };

    const layoutDays = (value) => {
      const base = Math.floor(value);
      const fraction = value - base;
      slots.forEach((button, index) => {
        const relative = index - centerSlot;
        const offset = base + relative;
        const distance = relative - fraction;
        if (offset < -centerSlot || offset > data.maxOffset) {
          button.hidden = true;
          return;
        }
        button.hidden = false;
        const { entry, moment } = entryForOffset(offset);
        if (button.dataset.offset !== String(offset)) {
          button.dataset.offset = String(offset);
          button.querySelector("strong").setText(String(moment.date()));
          button.querySelector("span").setText(moment.format("M月"));
          button.setAttribute("aria-label", `${moment.format("YYYY年M月D日")}${entry ? "，有日记" : ""}`);
        }
        button.toggleClass("has-note", Boolean(entry));
        button.toggleClass("is-future", offset < 0);
        button.toggleClass("is-selected", offset === Math.round(value));
        button.setAttribute("aria-selected", String(offset === Math.round(value)));
        const x = distance * dayWidth;
        const y = Math.pow(Math.abs(distance), 1.5) * 2.05;
        const rotation = distance * 5.1;
        const opacity = Math.max(.12, 1 - Math.abs(distance) * .13);
        const blur = Math.min(Math.abs(distance) * .46, 2.8);
        const focus = Math.exp(-Math.pow(distance * .88, 2));
        const tick = button.querySelector(".ad-life-dial-tick");
        tick.style.height = `${(7 + focus * 25).toFixed(2)}px`;
        tick.style.opacity = String(.22 + focus * .78);
        tick.style.filter = `blur(${Math.min(Math.abs(distance) * .7, 2.8).toFixed(2)}px)`;
        tick.style.transform = `translateX(-50%) rotate(${(distance * 3.2).toFixed(2)}deg)`;
        button.style.transform = `translate(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px)) rotate(${rotation.toFixed(2)}deg)`;
        button.style.opacity = String(opacity);
        button.style.filter = `blur(${blur.toFixed(2)}px)`;
      });
    };

    const runFrame = (now) => {
      const delta = Math.min((now - lastFrame) / 1000, .05);
      lastFrame = now;
      const smoothing = 1 - Math.exp(-delta / .16);
      position += (target - position) * smoothing;
      const settled = Math.abs(target - position) < .001;
      if (settled) position = target;
      layoutDays(position);
      updateSelected(position);
      this.lifeWheelFrame = settled ? 0 : window.requestAnimationFrame(runFrame);
    };
    const startLoop = () => {
      window.cancelAnimationFrame(this.lifeWheelFrame);
      lastFrame = performance.now();
      this.lifeWheelFrame = window.requestAnimationFrame(runFrame);
    };
    const applyTarget = (value, snap = false) => {
      wheel.removeClass("is-returning");
      returnButton.removeClass("is-returning");
      if (!snap && value < 0) target = Math.max(-.42, value * .18);
      else target = clamp(snap ? Math.round(value) : value);
      startLoop();
    };

    const returnToToday = () => {
      const startPosition = Math.max(0, position);
      if (startPosition < .001) return;
      window.cancelAnimationFrame(this.lifeWheelFrame);
      window.clearTimeout(this.lifeWheelTimer);
      target = 0;
      const startedAt = performance.now();
      const duration = Math.min(1650, 760 + Math.log1p(startPosition) * 115);
      wheel.addClass("is-returning");
      returnButton.addClass("is-returning");
      const returnFrame = (now) => {
        const progress = Math.min(1, (now - startedAt) / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        position = startPosition * (1 - eased);
        layoutDays(position);
        updateSelected(position);
        if (progress < 1) {
          this.lifeWheelFrame = window.requestAnimationFrame(returnFrame);
          return;
        }
        position = 0;
        target = 0;
        layoutDays(0);
        updateSelected(0, false);
        wheel.removeClass("is-returning");
        returnButton.removeClass("is-returning");
        this.lifeWheelFrame = 0;
      };
      this.lifeWheelFrame = window.requestAnimationFrame(returnFrame);
    };
    returnButton.addEventListener("click", returnToToday);

    const todayMoment = window.moment().startOf("day");
    const minimumMoment = todayMoment.clone().subtract(data.maxOffset, "days");
    let pickerMoment = todayMoment.clone();
    const closeCalendar = () => {
      calendarLayer.removeClass("is-open");
      calendar.removeClass("is-open");
      calendar.setAttribute("aria-hidden", "true");
      dateTrigger.setAttribute("aria-expanded", "false");
      calendarJumpButton.setAttribute("aria-expanded", "false");
      if (this.calendarOutsideHandler) document.removeEventListener("pointerdown", this.calendarOutsideHandler, true);
      this.calendarOutsideHandler = null;
    };
    const selectCalendarDate = (moment) => {
      pickerMoment = moment.clone().startOf("day");
      const offset = todayMoment.diff(pickerMoment, "days");
      applyTarget(offset, true);
      closeCalendar();
    };
    const renderCalendar = () => {
      calendar.empty();
      const calendarHead = el(calendar, "header", "ad-life-calendar-head");
      const previous = el(calendarHead, "button", "ad-life-calendar-nav");
      setIcon(previous, "chevron-left");
      const selects = el(calendarHead, "div", "ad-life-calendar-selects");
      const yearSelect = el(selects, "select");
      for (let year = todayMoment.year(); year >= minimumMoment.year(); year -= 1) {
        const option = yearSelect.createEl("option", { text: `${year}年` });
        option.value = String(year);
        option.selected = year === pickerMoment.year();
      }
      const monthSelect = el(selects, "select");
      for (let month = 0; month < 12; month += 1) {
        const option = monthSelect.createEl("option", { text: `${month + 1}月` });
        option.value = String(month);
        option.selected = month === pickerMoment.month();
      }
      const next = el(calendarHead, "button", "ad-life-calendar-nav");
      setIcon(next, "chevron-right");
      const weekdays = el(calendar, "div", "ad-life-calendar-weekdays");
      "一二三四五六日".split("").forEach((day) => el(weekdays, "span", "", day));
      const days = el(calendar, "div", "ad-life-calendar-days");
      const start = pickerMoment.clone().startOf("month").startOf("isoWeek");
      for (let index = 0; index < 42; index += 1) {
        const dayMoment = start.clone().add(index, "days");
        const disabled = dayMoment.isAfter(todayMoment, "day") || dayMoment.isBefore(minimumMoment, "day");
        const button = el(days, "button", "ad-life-calendar-day", String(dayMoment.date()));
        button.toggleClass("is-outside", dayMoment.month() !== pickerMoment.month());
        button.toggleClass("is-selected", dayMoment.isSame(pickerMoment, "day"));
        button.toggleClass("has-note", Boolean(data.noteDays.get(dayMoment.format("YYYY-MM-DD"))));
        button.disabled = disabled;
        if (!disabled) button.addEventListener("click", () => selectCalendarDate(dayMoment));
      }
      const changeMonth = (delta) => {
        const candidate = pickerMoment.clone().add(delta, "month").startOf("month");
        if (candidate.isAfter(todayMoment, "month") || candidate.isBefore(minimumMoment, "month")) return;
        pickerMoment = candidate;
        renderCalendar();
      };
      previous.addEventListener("click", () => changeMonth(-1));
      next.addEventListener("click", () => changeMonth(1));
      yearSelect.addEventListener("change", () => {
        pickerMoment.date(1).year(Number(yearSelect.value));
        if (pickerMoment.isAfter(todayMoment, "day")) pickerMoment = todayMoment.clone();
        if (pickerMoment.isBefore(minimumMoment, "day")) pickerMoment = minimumMoment.clone();
        renderCalendar();
      });
      monthSelect.addEventListener("change", () => {
        pickerMoment.date(1).month(Number(monthSelect.value));
        if (pickerMoment.isAfter(todayMoment, "day")) pickerMoment = todayMoment.clone();
        if (pickerMoment.isBefore(minimumMoment, "day")) pickerMoment = minimumMoment.clone();
        renderCalendar();
      });
    };
    dateTrigger.addEventListener("click", (event) => {
      event.stopPropagation();
      if (calendar.hasClass("is-open")) {
        closeCalendar();
        return;
      }
      pickerMoment = entryForOffset(selectedOffset).moment.clone();
      renderCalendar();
      calendarLayer.addClass("is-open");
      calendar.addClass("is-open");
      calendar.setAttribute("aria-hidden", "false");
      dateTrigger.setAttribute("aria-expanded", "true");
      calendarJumpButton.setAttribute("aria-expanded", "true");
      this.calendarOutsideHandler = (outsideEvent) => {
        if (calendar.contains(outsideEvent.target) || dateTrigger.contains(outsideEvent.target) || calendarJumpButton.contains(outsideEvent.target)) return;
        closeCalendar();
      };
      window.setTimeout(() => {
        if (this.calendarOutsideHandler) document.addEventListener("pointerdown", this.calendarOutsideHandler, true);
      }, 0);
    });
    dateTrigger.addEventListener("pointerdown", (event) => event.stopPropagation());
    returnButton.addEventListener("pointerdown", (event) => event.stopPropagation());
    calendarJumpButton.addEventListener("pointerdown", (event) => event.stopPropagation());
    calendarJumpButton.addEventListener("click", (event) => {
      event.stopPropagation();
      dateTrigger.click();
    });

    slots.forEach((button) => {
      button.addEventListener("click", () => {
        if (dragMoved) return;
        const offset = Number(button.dataset.offset);
        if (!Number.isFinite(offset)) return;
        if (offset < 0) {
          applyTarget(-.36, false);
          window.clearTimeout(this.lifeWheelTimer);
          this.lifeWheelTimer = window.setTimeout(() => applyTarget(0, true), 150);
          return;
        }
        const { entry } = entryForOffset(offset);
        if (offset === selectedOffset && entry) this.plugin.openFile(entry.file);
        else applyTarget(offset, true);
      });
    });
    wheel.addEventListener("wheel", (event) => {
      event.preventDefault();
      const delta = event.deltaMode === 1 ? event.deltaY * 24 : event.deltaY;
      const step = Math.max(-1, Math.min(1, delta / dayWidth));
      applyTarget(target + step, false);
      window.clearTimeout(this.lifeWheelTimer);
      this.lifeWheelTimer = window.setTimeout(() => applyTarget(target, true), 140);
    }, { passive: false });
    wheel.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, start: target };
      dragMoved = false;
      wheel.addClass("is-dragging");
    });
    wheel.addEventListener("pointermove", (event) => {
      if (!drag || drag.id !== event.pointerId) return;
      const delta = event.clientX - drag.x;
      if (!dragMoved && Math.abs(delta) > 4) {
        dragMoved = true;
        wheel.setPointerCapture?.(event.pointerId);
      }
      if (dragMoved) applyTarget(drag.start - delta / dayWidth, false);
    });
    const finishDrag = (event) => {
      if (!drag) return;
      drag = null;
      wheel.removeClass("is-dragging");
      if (wheel.hasPointerCapture?.(event.pointerId)) wheel.releasePointerCapture(event.pointerId);
      if (dragMoved) applyTarget(target, true);
      window.setTimeout(() => { dragMoved = false; }, 0);
    };
    wheel.addEventListener("pointerup", finishDrag);
    wheel.addEventListener("pointercancel", finishDrag);
    wheel.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Enter", " "].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Enter" || event.key === " ") {
        const { entry } = entryForOffset(selectedOffset);
        if (entry) this.plugin.openFile(entry.file);
        return;
      }
      applyTarget(Math.round(target) + (event.key === "ArrowLeft" ? 1 : -1), true);
    });

    updateSelected(0, false);
    layoutDays(0);
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

    this.renderTaskQueue(body, data.taskQueue);
  }

  renderTaskQueue(parent, taskData) {
    const pending = taskData?.pending || [];
    const completed = taskData?.completed || [];
    const section = el(parent, "section", "ad-task-queue");
    const head = el(section, "header", "ad-subsection-title");
    const heading = el(head, "span", "ad-task-heading");
    el(heading, "strong", "", "待办拾取");
    el(head, "i");
    el(head, "small", "ad-task-queue-count", `散落在 ${taskData?.sourceCount || 0} 篇笔记中`);

    const overview = el(section, "div", "ad-task-overview");
    const total = pending.length + (taskData?.completedTotal || 0);
    const completedRatio = total ? Math.round(((taskData?.completedTotal || 0) / total) * 100) : 0;
    const encouragement = !total
      ? "清单还是空的"
      : completedRatio === 100
        ? "今天的清单，漂亮收尾"
        : completedRatio >= 75
          ? "只差一点，稳稳收尾"
          : completedRatio >= 50
            ? "已经走过一半"
            : completedRatio >= 25
              ? "节奏正在形成"
              : completedRatio > 0
                ? "已经开始，很好"
                : "先完成最小的一件";
    section.toggleClass("is-complete", total > 0 && completedRatio === 100);
    const summary = el(overview, "span");
    el(summary, "strong", "", `${completedRatio}%`);
    const progress = el(overview, "i");
    progress.style.setProperty("--ad-task-progress", `${completedRatio}%`);
    const currentStage = !total || completedRatio === 0 ? 0
      : completedRatio < 25 ? 1
        : completedRatio < 50 ? 2
          : completedRatio < 75 ? 3
            : completedRatio < 100 ? 4 : 5;
    const encouragementPill = el(overview, "div", `ad-task-encouragement stage-${currentStage}`);
    const reactionOptions = [["🙂", "先完成最小的一件"], ["👍", "已经开始，很好"], ["👏🏻", "节奏正在形成"], ["✨", "已经走过一半"], ["🎉", "漂亮收尾"]];
    const activeReaction = [0, 1, 2, 3, 3, 4][currentStage];
    const reactionRail = el(encouragementPill, "div", "ad-task-reactions");
    reactionOptions.forEach(([emoji, label], index) => {
      const displayLabel = index === activeReaction ? encouragement : label;
      const reaction = el(reactionRail, "span", index === activeReaction ? "is-active" : "", emoji);
      reaction.dataset.label = displayLabel;
      reaction.setAttribute("role", "img");
      reaction.setAttribute("aria-label", displayLabel);
    });

    const filters = el(section, "div", "ad-task-filters");
    const pendingFilter = el(filters, "button", "is-active", `待完成 ${pending.length}`);
    const completedFilter = el(filters, "button", "", `最近完成 ${completed.length}`);
    const list = el(section, "div", "ad-task-queue-list");
    const renderTask = (task) => {
      const row = el(list, "div", `ad-task-queue-item ${task.completed ? "is-completed" : ""}`);
      const checkbox = el(row, "input", "ad-task-checkbox");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.setAttribute("aria-label", task.completed ? `恢复待办：${plainText(task.text)}` : `完成待办：${plainText(task.text)}`);
      checkbox.addEventListener("change", async (event) => {
        event.stopPropagation();
        checkbox.disabled = true;
        try {
          const shouldCelebrate = !task.completed && checkbox.checked;
          const checkboxBounds = checkbox.getBoundingClientRect();
          await this.plugin.toggleTask(task);
          if (shouldCelebrate) this.celebrateTaskCheck(checkboxBounds);
        } catch (error) {
          console.error("[每日专注主页] 待办状态更新失败", error);
          checkbox.checked = task.completed;
          checkbox.disabled = false;
          new Notice("待办状态更新失败，请打开原笔记检查。");
        }
      });
      const copy = el(row, "div", "ad-task-copy");
      copy.tabIndex = 0;
      copy.setAttribute("role", "button");
      copy.setAttribute("aria-label", `打开 ${task.file.basename}`);
      const markdown = el(copy, "div", "ad-task-markdown");
      MarkdownRenderer.render(this.app, withoutMarkdownImages(task.text), markdown, task.file.path, this)
        .then(() => clampRenderedText(markdown, 32))
        .catch((error) => {
          console.error("[每日专注主页] 待办 Markdown 渲染失败", error);
          markdown.setText(excerpt(task.text, 32));
        });
      el(copy, "small", "", task.file.basename);
      const arrow = el(row, "b");
      setIcon(arrow, "arrow-up-right");
      const openTask = (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.plugin.openFile(task.file);
      };
      copy.addEventListener("click", openTask);
      copy.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") openTask(event);
      });
    };
    const renderList = (mode) => {
      list.empty();
      pendingFilter.toggleClass("is-active", mode === "pending");
      completedFilter.toggleClass("is-active", mode === "completed");
      pendingFilter.setAttribute("aria-pressed", String(mode === "pending"));
      completedFilter.setAttribute("aria-pressed", String(mode === "completed"));
      const tasks = mode === "pending" ? pending : completed;
      if (!tasks.length) {
        const empty = el(list, "div", "ad-task-queue-empty");
        const mark = el(empty, "i");
        setIcon(mark, mode === "pending" ? "check-check" : "history");
        el(empty, "span", "", mode === "pending" ? "当前没有散落的未完成事项" : "还没有最近完成的事项");
        return;
      }
      tasks.forEach(renderTask);
    };
    pendingFilter.addEventListener("click", () => renderList("pending"));
    completedFilter.addEventListener("click", () => renderList("completed"));
    renderList(pending.length ? "pending" : "completed");
  }

  celebrateTaskCheck(bounds) {
    const celebration = document.body.createDiv({ cls: "ad-task-check-celebration" });
    const appearance = window.getComputedStyle(this.contentEl);
    celebration.style.left = `${bounds.left + bounds.width / 2}px`;
    celebration.style.top = `${bounds.top + bounds.height / 2}px`;
    celebration.style.setProperty("--ad-task-check-accent", appearance.getPropertyValue("--ad-accent").trim());
    celebration.createSpan({ cls: "ad-task-check-ring" });
    const core = celebration.createSpan({ cls: "ad-task-check-core" });
    setIcon(core, "check");
    for (let index = 0; index < 12; index += 1) {
      const spark = celebration.createSpan({ cls: `ad-task-check-spark shape-${index % 3}` });
      spark.style.setProperty("--angle", `${index * 30 + (Math.random() * 8 - 4)}deg`);
      spark.style.setProperty("--distance", `${20 + Math.random() * 13}px`);
      spark.style.setProperty("--delay", `${Math.random() * 55}ms`);
      spark.style.setProperty("--spin", `${90 + Math.random() * 220}deg`);
    }
    window.setTimeout(() => celebration.remove(), 900);
    this.playTaskCheckSound();
  }

  playTaskCheckSound() {
    if (this.plugin.settings.rediscoverySoundEnabled === false) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!this.wheelAudioContext || this.wheelAudioContext.state === "closed") {
      this.wheelAudioContext = new AudioContext();
    }
    const context = this.wheelAudioContext;
    context.resume?.().catch(() => {});
    const rawVolume = Number(this.plugin.settings.rediscoverySoundVolume);
    const volume = Number.isFinite(rawVolume) ? Math.max(0, Math.min(1, rawVolume)) : .22;
    [659.25, 880].forEach((frequency, index) => {
      const start = context.currentTime + index * .045;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(Math.max(.0002, volume * .055), start + .012);
      gain.gain.exponentialRampToValueAtTime(.0001, start + .16);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + .17);
    });
  }

  playWheelTick() {
    if (this.plugin.settings.rediscoverySoundEnabled === false) return;
    const now = performance.now();
    if (now - this.wheelLastTick < 70) return;
    this.wheelLastTick = now;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    if (!this.wheelAudioContext || this.wheelAudioContext.state === "closed") {
      this.wheelAudioContext = new AudioContext();
    }
    const context = this.wheelAudioContext;
    context.resume?.().catch(() => {});
    const duration = .026;
    const length = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) {
      const envelope = Math.pow(1 - index / length, 4);
      channel[index] = (Math.random() * 2 - 1) * envelope;
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    filter.type = "bandpass";
    filter.frequency.value = 1500;
    filter.Q.value = .7;
    const rawVolume = Number(this.plugin.settings.rediscoverySoundVolume);
    const volume = Number.isFinite(rawVolume) ? Math.max(0, Math.min(1, rawVolume)) : .22;
    gain.gain.setValueAtTime(volume * .11, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + duration);
    source.buffer = buffer;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(context.destination);
    source.start();
    source.stop(context.currentTime + duration);
  }

  async renderMarkdownExcerpt(container, markdown, sourcePath) {
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
    } catch (error) {
      console.error("[每日专注主页] Markdown 渲染失败", error);
      container.setText(plainText(markdown));
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
          picker.style.display = "none";
          containerEl.appendChild(picker);
          const cleanup = () => picker.remove();
          picker.addEventListener("change", async () => {
            const file = picker.files?.[0];
            if (!file) {
              cleanup();
              return;
            }
            await this.plugin.saveAvatar(file);
            cleanup();
            this.display();
          }, { once: true });
          picker.addEventListener("cancel", cleanup, { once: true });
          picker.click();
        }));
    this.renderAvatarCrop(containerEl);
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
      .setName("封面自然游移")
      .setDesc("图片仅做缓慢的上下取景，不再自动放大缩小。手动拖动后会记住该图片的位置。")
      .addToggle((toggle) => toggle
        .setValue(this.plugin.settings.heroAutoPan !== false)
        .onChange(async (value) => {
          this.plugin.settings.heroAutoPan = value;
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }));

    new Setting(containerEl)
      .setName("重置封面取景")
      .setDesc("清除所有图片的手动上下位置，恢复自然游移。")
      .addButton((button) => button
        .setButtonText("恢复默认")
        .onClick(async () => {
          this.plugin.settings.heroImagePositions = {};
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
          new Notice("封面取景位置已重置。");
        }));

    new Setting(containerEl)
      .setName("系统音频频谱")
      .setDesc("在横幅底部显示随系统声音跳动的音谱。Windows 直接读取本机扬声器峰值，不需要屏幕共享权限。")
      .addToggle((toggle) => toggle
        .setValue(this.plugin.settings.systemSpectrumEnabled === true)
        .onChange(async (value) => {
          this.plugin.settings.systemSpectrumEnabled = value;
          const connection = value ? this.plugin.startSystemAudioCapture(true) : Promise.resolve(false);
          if (!value) this.plugin.stopSystemAudioCapture();
          await this.plugin.saveSettings();
          if (value) await connection;
          this.plugin.refreshViews();
        }))
      .addButton((button) => button
        .setButtonText("重新连接")
        .onClick(async () => {
          this.plugin.stopSystemAudioCapture();
          const connected = await this.plugin.startSystemAudioCapture(true);
          if (connected) new Notice("系统声音已连接，播放音乐即可看到频谱跳动。");
          this.plugin.refreshViews();
        }));

    new Setting(containerEl)
      .setName("频谱颜色")
      .setDesc("默认跟随当前配色主题；选择颜色后将固定使用自定义颜色。")
      .addColorPicker((picker) => picker
        .setValue(this.plugin.settings.systemSpectrumColor || "#a85c45")
        .onChange(async (value) => {
          this.plugin.settings.systemSpectrumColor = value;
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }))
      .addExtraButton((button) => button
        .setIcon("rotate-ccw")
        .setTooltip("恢复跟随主题")
        .onClick(async () => {
          this.plugin.settings.systemSpectrumColor = "";
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
          this.display();
        }));

    new Setting(containerEl)
      .setName("频谱样式")
      .setDesc("四种样式共用同一安全高度，不会与横幅文案重叠。")
      .addDropdown((dropdown) => dropdown
        .addOption("soft-bars", "柔光音柱")
        .addOption("mirror", "镜像脉冲")
        .addOption("dots", "圆点声波")
        .addOption("blocks", "分段均衡器")
        .setValue(this.plugin.settings.systemSpectrumStyle || "soft-bars")
        .onChange(async (value) => {
          this.plugin.settings.systemSpectrumStyle = value;
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }));

    new Setting(containerEl)
      .setName("音频响应阈值")
      .setDesc("数值越低越灵敏、跳动越明显；数值越高越平缓。高度始终限制在频谱区域内。")
      .addSlider((slider) => slider
        .setLimits(0, 40, 1)
        .setDynamicTooltip()
        .setValue(Number.isFinite(Number(this.plugin.settings.systemSpectrumThreshold))
          ? Number(this.plugin.settings.systemSpectrumThreshold)
          : 12)
        .onChange(async (value) => {
          this.plugin.settings.systemSpectrumThreshold = value;
          await this.plugin.saveSettings();
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

    this.text("数据模块标题", "例如：知识概览、写作数据、我的沉淀。", "insightsTitle");
    this.text(
      "数据指标",
      "用英文逗号分隔：notes（笔记数）、characters（总字数）、monthUpdates（本月更新）、activeDays（沉淀天数）、todayCharacters（今日字数）、monthCharacters（本月字数）。",
      "insightMetrics",
    );
    this.text("当下模块标题", "例如：当下、今日记录、此刻。", "todayTitle");
    this.text("人生模块标题", "显示在日期回看功能上方，例如：人生进度、时间漫游。", "lifeProgressTitle");
    this.text("人生模块圆形标记", "显示 1–2 个字，例如：人、忆、我。", "lifeProgressMark");
    new Setting(containerEl)
      .setName("圆形标记文字颜色")
      .setDesc("只改变圆形标记内的文字；点击右侧重置按钮可恢复跟随当前主题。")
      .addColorPicker((picker) => picker
        .setValue(this.plugin.settings.lifeProgressMarkColor || "#2f7187")
        .onChange(async (value) => {
          this.plugin.settings.lifeProgressMarkColor = value;
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }))
      .addExtraButton((button) => button
        .setIcon("rotate-ccw")
        .setTooltip("恢复跟随主题")
        .onClick(async () => {
          this.plugin.settings.lifeProgressMarkColor = "";
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
          this.display();
        }));
    this.text("圆形标记字体", "填写本机已安装字体的名称；默认使用苹方粗体，留空也会回到苹方。", "lifeProgressMarkFont");
    new Setting(containerEl)
      .setName("出生日期")
      .setDesc("用于显示已经走过的天数；只保存在本地插件设置中。")
      .addText((input) => {
        input.inputEl.type = "date";
        input
          .setValue(this.plugin.settings.birthDate || "")
          .onChange(async (value) => {
            this.plugin.settings.birthDate = value;
            await this.plugin.saveSettings();
            this.plugin.refreshViews();
          });
      });
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
    new Setting(containerEl)
      .setName("日期滚轮声音")
      .setDesc("回看过去日期时播放轻微的本地刻度声。")
      .addToggle((toggle) => toggle
        .setValue(this.plugin.settings.rediscoverySoundEnabled !== false)
        .onChange(async (value) => {
          this.plugin.settings.rediscoverySoundEnabled = value;
          await this.plugin.saveSettings();
        }));
    new Setting(containerEl)
      .setName("滚轮声音音量")
      .setDesc("声音只在操作日期滚轮时播放。")
      .addSlider((slider) => slider
        .setLimits(0, 0.6, 0.02)
        .setDynamicTooltip()
        .setValue(Number.isFinite(Number(this.plugin.settings.rediscoverySoundVolume))
          ? Number(this.plugin.settings.rediscoverySoundVolume)
          : .22)
        .onChange(async (value) => {
          this.plugin.settings.rediscoverySoundVolume = value;
          await this.plugin.saveSettings();
        }));
    this.text("今日随笔文件夹", "", "dailyFolder");
    new Setting(containerEl)
      .setName("待办拾取文件夹")
      .setDesc("留空时扫描整个仓库；需要限制范围时，每行填写一个文件夹路径，也可以用英文逗号分隔。包含这些文件夹及其所有子文件夹。")
      .addTextArea((input) => input
        .setPlaceholder("留空 = 整个仓库\n例如：每日随笔\n项目")
        .setValue(this.plugin.settings.taskFolders || "")
        .onChange(async (value) => {
          this.plugin.settings.taskFolders = value;
          await this.plugin.saveSettings();
          this.plugin.refreshViews();
        }));

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

  renderAvatarCrop(containerEl) {
    const avatarUrl = this.plugin.resolveImage(this.plugin.settings.avatarPath);
    if (!avatarUrl) return;
    const crop = containerEl.createDiv({ cls: "ad-avatar-crop-setting" });
    const stage = crop.createDiv({ cls: "ad-avatar-crop-stage" });
    const image = stage.createEl("img", { attr: { src: avatarUrl, alt: "头像裁剪预览", draggable: "false" } });
    stage.createDiv({ cls: "ad-avatar-crop-guide" });
    const controls = crop.createDiv({ cls: "ad-avatar-crop-controls" });
    controls.createEl("strong", { text: "调整头像范围" });
    controls.createEl("span", { text: "在预览中上下拖动图片，或使用滑杆微调。" });
    const slider = controls.createEl("input", { attr: { type: "range", min: "0", max: "100", step: "1" } });
    const centerButton = controls.createEl("button", { text: "恢复居中", cls: "mod-cta" });
    const savedPosition = Number(this.plugin.settings.avatarPositionY);
    let position = Number.isFinite(savedPosition) ? Math.min(100, Math.max(0, savedPosition)) : 50;
    let startY = 0;
    let startPosition = position;
    const paint = (value) => {
      position = Math.min(100, Math.max(0, Number(value) || 0));
      slider.value = String(Math.round(position));
      image.style.objectPosition = `50% ${position}%`;
    };
    const persist = async () => {
      this.plugin.settings.avatarPositionY = Math.round(position);
      await this.plugin.saveSettings();
      this.plugin.refreshViews();
    };
    paint(position);
    slider.addEventListener("input", () => paint(slider.value));
    slider.addEventListener("change", persist);
    stage.addEventListener("pointerdown", (event) => {
      startY = event.clientY;
      startPosition = position;
      stage.setPointerCapture(event.pointerId);
      stage.addClass("is-dragging");
    });
    stage.addEventListener("pointermove", (event) => {
      if (!stage.hasPointerCapture(event.pointerId)) return;
      paint(startPosition - ((event.clientY - startY) / Math.max(1, stage.clientHeight)) * 100);
    });
    const finishDrag = async (event) => {
      if (!stage.hasPointerCapture(event.pointerId)) return;
      stage.releasePointerCapture(event.pointerId);
      stage.removeClass("is-dragging");
      await persist();
    };
    stage.addEventListener("pointerup", finishDrag);
    stage.addEventListener("pointercancel", finishDrag);
    centerButton.addEventListener("click", async () => {
      paint(50);
      await persist();
    });
  }
}

class AlexDeskPlugin extends Plugin {
  async onload() {
    this.views = new Set();
    this.createElasticMesh = createElasticMesh;
    this.systemAudioStream = null;
    this.systemAudioContext = null;
    this.systemAudioAnalyser = null;
    this.systemAudioData = null;
    this.systemAudioCapturePromise = null;
    this.systemAudioUnavailable = false;
    this.systemAudioNativeProcess = null;
    this.systemAudioNativeLevel = 0;
    this.systemAudioNativeSmoothed = 0;
    this.systemAudioNativeUpdatedAt = 0;
    const saved = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, saved);
    if (!this.settings.heroImages && saved?.heroImagePath) this.settings.heroImages = saved.heroImagePath;
    this.registerView(VIEW_TYPE, (leaf) => new AlexDeskView(leaf, this));
    this.addRibbonIcon("sparkles", "打开每日专注主页", () => this.activateView());
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
    this.stopSystemAudioCapture();
  }

  async saveSettings() { await this.saveData(this.settings); }
  refreshViews() { this.views.forEach((view) => view.render()); }
  scheduleRefresh() {
    window.clearTimeout(this.refreshTimer);
    this.refreshTimer = window.setTimeout(() => this.refreshViews(), 750);
  }

  async startSystemAudioCapture(allowPrompt = false) {
    if (this.settings.systemSpectrumEnabled !== true) return false;
    if (this.systemAudioAnalyser && this.systemAudioStream?.active) {
      await this.systemAudioContext?.resume?.().catch(() => {});
      return true;
    }
    if (this.systemAudioCapturePromise) return this.systemAudioCapturePromise;
    if (this.systemAudioUnavailable && !allowPrompt) return false;
    if (allowPrompt) this.systemAudioUnavailable = false;
    this.systemAudioCapturePromise = (async () => {
      if (await this.startNativeAudioMeter()) return true;
      let stream = null;
      let firstError = null;
      if (allowPrompt && navigator.mediaDevices?.getDisplayMedia) {
        try {
          stream = await navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: true,
            systemAudio: "include",
            selfBrowserSurface: "exclude",
            surfaceSwitching: "exclude",
          });
        } catch (error) {
          firstError = error;
        }
      }
      if (stream && !stream.getAudioTracks?.().length) {
        stream.getTracks?.().forEach((track) => track.stop());
        stream = null;
      }
      try {
        if (!stream) {
          const electron = typeof require === "function" ? require("electron") : null;
          const sources = await electron?.desktopCapturer?.getSources?.({ types: ["screen"] });
          const source = sources?.[0];
          if (source && navigator.mediaDevices?.getUserMedia) {
            stream = await navigator.mediaDevices.getUserMedia({
              audio: { mandatory: { chromeMediaSource: "desktop" } },
              video: { mandatory: { chromeMediaSource: "desktop", chromeMediaSourceId: source.id, maxFrameRate: 1 } },
            });
          }
        }
      } catch (error) {
        firstError ||= error;
      }
      if (!stream?.getAudioTracks?.().length) {
        stream?.getTracks?.().forEach((track) => track.stop());
        throw firstError || new Error("No system audio track was provided");
      }
      stream.getVideoTracks().forEach((track) => { track.enabled = false; });
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContextClass();
      const analyser = context.createAnalyser();
      analyser.fftSize = 128;
      analyser.minDecibels = -82;
      analyser.maxDecibels = -18;
      analyser.smoothingTimeConstant = .78;
      context.createMediaStreamSource(stream).connect(analyser);
      this.systemAudioStream = stream;
      this.systemAudioContext = context;
      this.systemAudioAnalyser = analyser;
      this.systemAudioData = new Uint8Array(analyser.frequencyBinCount);
      stream.getTracks().forEach((track) => track.addEventListener("ended", () => this.stopSystemAudioCapture(), { once: true }));
      await context.resume().catch(() => {});
      this.systemAudioUnavailable = false;
      return true;
    })().catch((error) => {
      console.warn("[每日专注主页] 系统音频频谱不可用", error);
      this.systemAudioUnavailable = true;
      this.stopSystemAudioCapture();
      if (allowPrompt) new Notice("当前 Obsidian 没有提供可用的系统音频声道。请确认共享窗口中勾选了系统音频。", 6500);
      return false;
    }).finally(() => {
      this.systemAudioCapturePromise = null;
    });
    return this.systemAudioCapturePromise;
  }

  readSystemSpectrum(count = 42) {
    if (this.systemAudioNativeProcess && Date.now() - this.systemAudioNativeUpdatedAt < 800) {
      const thresholdSetting = Math.max(0, Math.min(40, Number(this.settings.systemSpectrumThreshold) || 0));
      const threshold = thresholdSetting / 1000;
      const peak = Math.max(0, this.systemAudioNativeLevel - threshold);
      this.systemAudioNativeSmoothed = this.systemAudioNativeSmoothed * .62 + peak * .38;
      const responseGain = 4.4 - thresholdSetting * .045;
      const energy = Math.min(1, Math.pow(this.systemAudioNativeSmoothed * responseGain, .66));
      const phase = performance.now() / 118;
      return Array.from({ length: count }, (_, index) => {
        const position = count > 1 ? index / (count - 1) : .5;
        const centerWeight = .74 + (1 - Math.abs(position * 2 - 1)) * .26;
        const wave = .34 + Math.abs(Math.sin(phase * (.72 + (index % 6) * .018) + index * .67)) * .66;
        const ripple = .78 + Math.abs(Math.cos(phase * .43 - index * .31)) * .22;
        return energy * centerWeight * wave * ripple;
      });
    }
    const analyser = this.systemAudioAnalyser;
    const data = this.systemAudioData;
    if (!analyser || !data || !this.systemAudioStream?.active) return null;
    analyser.getByteFrequencyData(data);
    const half = Math.ceil(count / 2);
    const usableBins = Math.max(half, Math.floor(data.length * .72));
    const halfLevels = Array.from({ length: half }, (_, index) => {
      const start = Math.floor((index / half) * usableBins);
      const end = Math.max(start + 1, Math.floor(((index + 1) / half) * usableBins));
      let peak = 0;
      for (let bin = start; bin < end; bin += 1) peak = Math.max(peak, data[bin] || 0);
      const normalized = Math.max(0, peak / 255 - .025);
      return Math.min(1, Math.pow(normalized * 1.55, .82));
    });
    return Array.from({ length: count }, (_, index) => {
      const mirroredIndex = index < count / 2 ? half - 1 - index : index - Math.floor(count / 2);
      return halfLevels[Math.min(half - 1, mirroredIndex)] || 0;
    });
  }

  isSystemAudioAudible(levels) {
    if (this.systemAudioNativeProcess && Date.now() - this.systemAudioNativeUpdatedAt < 800) {
      return this.systemAudioNativeLevel > .004;
    }
    return Array.isArray(levels) && levels.some((level) => level > .02);
  }

  stopSystemAudioCapture() {
    const nativeProcess = this.systemAudioNativeProcess;
    this.systemAudioNativeProcess = null;
    this.systemAudioNativeLevel = 0;
    this.systemAudioNativeSmoothed = 0;
    this.systemAudioNativeUpdatedAt = 0;
    nativeProcess?.kill?.();
    const stream = this.systemAudioStream;
    this.systemAudioStream = null;
    this.systemAudioAnalyser = null;
    this.systemAudioData = null;
    stream?.getTracks?.().forEach((track) => track.stop());
    const context = this.systemAudioContext;
    this.systemAudioContext = null;
    context?.close?.().catch(() => {});
  }

  async startNativeAudioMeter() {
    if (process.platform !== "win32") return false;
    if (this.systemAudioNativeProcess && Date.now() - this.systemAudioNativeUpdatedAt < 800) return true;
    this.systemAudioNativeProcess?.kill?.();
    this.systemAudioNativeProcess = null;
    const encodedScript = Buffer.from(AUDIO_METER_SCRIPT, "utf16le").toString("base64");
    return new Promise((resolve) => {
      let settled = false;
      let buffer = "";
      let child;
      const finish = (connected) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        if (!connected) child?.kill?.();
        resolve(connected);
      };
      const timeout = window.setTimeout(() => finish(false), 3500);
      try {
        child = spawn("powershell.exe", [
          "-NoLogo", "-NoProfile", "-NonInteractive", "-EncodedCommand", encodedScript,
        ], { windowsHide: true, stdio: ["ignore", "pipe", "pipe"] });
        this.systemAudioNativeProcess = child;
        child.stderr.on("data", () => {});
        child.stdout.setEncoding("utf8");
        child.stdout.on("data", (chunk) => {
          buffer += chunk;
          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || "";
          lines.forEach((line) => {
            const value = Number(line.trim());
            if (!Number.isFinite(value)) return;
            this.systemAudioNativeLevel = Math.max(0, Math.min(1, value));
            this.systemAudioNativeUpdatedAt = Date.now();
            finish(true);
          });
        });
        child.on("error", () => finish(false));
        child.on("exit", () => {
          if (this.systemAudioNativeProcess === child) this.systemAudioNativeProcess = null;
          finish(false);
        });
      } catch (_) {
        finish(false);
      }
    });
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

  taskFiles() {
    const allFiles = this.app.vault.getMarkdownFiles();
    const folders = String(this.settings.taskFolders || "")
      .split(/\r?\n|,/)
      .map((folder) => normalizePath(folder.trim()).replace(/^\.\/?/, "").replace(/\/$/, ""))
      .filter(Boolean);
    if (!folders.length) return allFiles;
    return allFiles.filter((file) => folders.some((folder) =>
      file.path === folder || file.path.startsWith(`${folder}/`)));
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
          path: file.path,
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
    const datedDailyEntries = dailyEntries.filter((entry) => entry.key).sort((a, b) => a.key.localeCompare(b.key));
    const earliestDailyMoment = datedDailyEntries.length
      ? window.moment(datedDailyEntries[0].key, "YYYY-MM-DD", true)
      : now.clone().startOf("day");
    const configuredBirth = window.moment(String(this.settings.birthDate || ""), "YYYY-MM-DD", true);
    const hasBirthDate = configuredBirth.isValid() && !configuredBirth.isAfter(now, "day");
    const lifeStart = hasBirthDate ? configuredBirth.clone().startOf("day") : earliestDailyMoment.clone().startOf("day");
    const livedDays = Math.max(0, now.clone().startOf("day").diff(lifeStart, "days"));
    const journalSpanDays = Math.max(1, now.clone().startOf("day").diff(earliestDailyMoment, "days") + 1);
    const lifeProgress = {
      hasBirthDate,
      livedDays,
      journalSpanDays,
      maxOffset: hasBirthDate ? Math.max(1, livedDays) : Math.max(365, journalSpanDays - 1),
      noteDays: dailyMap,
    };
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
    const taskFilePaths = new Set(this.taskFiles().map((file) => file.path));
    const taskEntries = allEntries
      .filter((entry) => taskFilePaths.has(entry.file.path))
      .flatMap((entry) => String(entry.source || "")
        .split(/\r?\n/)
        .map((line, lineIndex) => {
          const match = line.match(/^\s*[-*+]\s+\[([ xX])\]\s+(.+)$/);
          return match ? {
            file: entry.file,
            text: match[2].trim(),
            rawLine: line,
            lineIndex,
            completed: match[1].toLowerCase() === "x",
            modified: entry.file.stat.mtime,
          } : null;
        })
        .filter(Boolean))
      .sort((a, b) => b.modified - a.modified);
    const taskQueue = {
      pending: taskEntries.filter((task) => !task.completed),
      completed: taskEntries.filter((task) => task.completed).slice(0, 5),
      completedTotal: taskEntries.filter((task) => task.completed).length,
      sourceCount: new Set(taskEntries.map((task) => task.file.path)).size,
    };
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
      todayCharacters,
      todayRelated,
      lifeProgress,
      totalNotes: allFiles.length,
      totalCharacters,
      monthUpdates,
      insightMetrics,
      taskQueue,
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
      },
    };
  }

  async ensureFolder(folder) {
    const normalized = normalizePath(folder);
    if (!this.app.vault.getAbstractFileByPath(normalized)) await this.app.vault.createFolder(normalized);
    return normalized;
  }

  async toggleTask(task) {
    await this.app.vault.process(task.file, (source) => {
      const eol = source.includes("\r\n") ? "\r\n" : "\n";
      const lines = source.split(/\r?\n/);
      let index = task.lineIndex;
      if (lines[index] !== task.rawLine) index = lines.findIndex((line) => line === task.rawLine);
      if (index < 0 || !/^\s*[-*+]\s+\[[ xX]\]\s+/.test(lines[index])) {
        throw new Error("Task line could not be located");
      }
      lines[index] = task.completed
        ? lines[index].replace(/\[[xX]\]/, "[ ]")
        : lines[index].replace(/\[ \]/, "[x]");
      return lines.join(eol);
    });
    this.refreshViews();
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
    this.settings.avatarPositionY = 50;
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

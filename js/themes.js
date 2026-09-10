/**
 * Vườn Xanh – Hệ thống Theme theo mùa & lễ
 * Version tích hợp: 1.9.176+
 */

const THEMES = {

  /* ===================== THEME MẶC ĐỊNH ===================== */
  "default": {
    id: "default",
    name: "Vườn Xanh Mặc định",
    type: "default",
    priority: 0,
    startAt: null,
    endAt: null,
    enabled: true,

    ui: {
      primaryColor: "#166534",
      secondaryColor: "#22c55e",
      accentColor: "#fbbf24",
      bgGradient: "linear-gradient(135deg, #064e3b 0%, #166534 50%, #14532d 100%)",
      orbColors: ["#22c55e", "#4ade80", "#86efac"],
      particle: "none",
      logoIcon: "fa-duotone fa-seedling",
      titleSuffix: ""
    },

    limited: { plants: [], seeds: [], fertilizers: [], pets: [], frames: [], badges: [], recipes: [] },
    globalBuff: { growSpeed: 1, rainChance: 1, coinBonus: 1 },
    decorations: { showLanterns: false, showMoon: false, showFireworks: false, gardenOverlay: null },
    shopBanner: null,
    extraDailyQuest: false
  },

  /* ===================== 4 MÙA ===================== */
  "xuan": {
    id: "xuan",
    name: "Mùa Xuân",
    type: "season",
    priority: 10,
    startAt: "2026-02-01T00:00:00+07:00",
    endAt: "2026-04-30T23:59:59+07:00",
    enabled: true,

    ui: {
      primaryColor: "#e11d48",
      secondaryColor: "#fb7185",
      accentColor: "#fbbf24",
      bgGradient: "linear-gradient(135deg, #4c0519 0%, #9f1239 40%, #be123c 100%)",
      orbColors: ["#fb7185", "#fda4af", "#fef08a"],
      particle: "petal",
      logoIcon: "fa-duotone fa-flower",
      titleSuffix: " · Mùa Xuân"
    },

    limited: {
      plants: ["hoa-dao", "hoa-mai-vang", "hoa-anh-dao"],
      seeds: ["hat-dao", "hat-mai"],
      fertilizers: ["phan-xuan"],
      pets: ["pet-chim-hoc"],
      frames: ["frame-hoa-dao"],
      badges: ["badge-xuan-2026"],
      recipes: ["banh-chung-mini"]
    },
    globalBuff: { growSpeed: 1.08, rainChance: 1.1, coinBonus: 1.05 },
    decorations: { showLanterns: false, showMoon: false, showFireworks: false, gardenOverlay: "xuan-overlay" },
    shopBanner: "Mùa Xuân - Hoa đào & Mai vàng",
    extraDailyQuest: true
  },

  "ha": {
    id: "ha",
    name: "Mùa Hạ",
    type: "season",
    priority: 10,
    startAt: "2026-05-01T00:00:00+07:00",
    endAt: "2026-07-31T23:59:59+07:00",
    enabled: true,

    ui: {
      primaryColor: "#0891b2",
      secondaryColor: "#22d3ee",
      accentColor: "#facc15",
      bgGradient: "linear-gradient(135deg, #083344 0%, #0e7490 50%, #155e75 100%)",
      orbColors: ["#22d3ee", "#67e8f9", "#fde047"],
      particle: "firefly",
      logoIcon: "fa-duotone fa-sun",
      titleSuffix: " · Mùa Hạ"
    },

    limited: {
      plants: ["hoa-sen-hong", "hoa-phuong", "cay-dua"],
      seeds: ["hat-sen", "hat-phuong"],
      fertilizers: ["phan-ha"],
      pets: ["pet-chuon-chuon"],
      frames: ["frame-mua-ha"],
      badges: ["badge-ha-2026"],
      recipes: ["nuoc-mia", "che-sen"]
    },
    globalBuff: { growSpeed: 1.12, rainChance: 0.9, coinBonus: 1.05 },
    decorations: { showLanterns: false, showMoon: false, showFireworks: false, gardenOverlay: "ha-overlay" },
    shopBanner: "Mùa Hạ rực rỡ",
    extraDailyQuest: true
  },

  "thu": {
    id: "thu",
    name: "Mùa Thu",
    type: "season",
    priority: 10,
    startAt: "2026-08-01T00:00:00+07:00",
    endAt: "2026-11-15T23:59:59+07:00",
    enabled: true,

    ui: {
      primaryColor: "#c2410c",
      secondaryColor: "#fb923c",
      accentColor: "#fbbf24",
      bgGradient: "linear-gradient(135deg, #431407 0%, #9a3412 50%, #c2410c 100%)",
      orbColors: ["#fb923c", "#fdba74", "#fef08a"],
      particle: "leaf",
      logoIcon: "fa-duotone fa-leaf",
      titleSuffix: " · Mùa Thu"
    },

    limited: {
      plants: ["hoa-cuc-hoa-mi", "cay-hong-vang", "hoa-dong-tien"],
      seeds: ["hat-cuc-hoa-mi"],
      fertilizers: ["phan-thu"],
      pets: ["pet-soc"],
      frames: ["frame-la-vang"],
      badges: ["badge-thu-2026"],
      recipes: ["banh-bi-do"]
    },
    globalBuff: { growSpeed: 1.05, rainChance: 1.15, coinBonus: 1.08 },
    decorations: { showLanterns: false, showMoon: false, showFireworks: false, gardenOverlay: "thu-overlay" },
    shopBanner: "Mùa Thu lá vàng",
    extraDailyQuest: true
  },

  "dong": {
    id: "dong",
    name: "Mùa Đông",
    type: "season",
    priority: 10,
    startAt: "2026-11-16T00:00:00+07:00",
    endAt: "2027-01-31T23:59:59+07:00",
    enabled: true,

    ui: {
      primaryColor: "#1e40af",
      secondaryColor: "#60a5fa",
      accentColor: "#e0f2fe",
      bgGradient: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1e40af 100%)",
      orbColors: ["#60a5fa", "#93c5fd", "#e0f2fe"],
      particle: "snow",
      logoIcon: "fa-duotone fa-snowflake",
      titleSuffix: " · Mùa Đông"
    },

    limited: {
      plants: ["hoa-tram-huong", "cay-thong-nho", "hoa-tuyet"],
      seeds: ["hat-thong"],
      fertilizers: ["phan-dong"],
      pets: ["pet-canh-cam"],
      frames: ["frame-tuyet"],
      badges: ["badge-dong-2026"],
      recipes: ["tra-gung", "banh-khoai"]
    },
    globalBuff: { growSpeed: 0.95, rainChance: 1.2, coinBonus: 1.1 },
    decorations: { showLanterns: false, showMoon: false, showFireworks: false, gardenOverlay: "dong-overlay" },
    shopBanner: "Mùa Đông ấm áp",
    extraDailyQuest: true
  },

  /* ===================== LỄ LỚN ===================== */
  "tet": {
    id: "tet",
    name: "Tết Nguyên Đán 2026",
    type: "event",
    priority: 100,
    startAt: "2026-01-25T00:00:00+07:00",
    endAt: "2026-02-18T23:59:59+07:00",
    enabled: true,

    ui: {
      primaryColor: "#dc2626",
      secondaryColor: "#fbbf24",
      accentColor: "#fef08a",
      bgGradient: "linear-gradient(135deg, #450a0a 0%, #991b1b 40%, #b45309 100%)",
      orbColors: ["#fbbf24", "#fef08a", "#fecaca"],
      particle: "firework",
      logoIcon: "fa-duotone fa-firecracker",
      titleSuffix: " · Chúc Mừng Năm Mới"
    },

    limited: {
      plants: ["hoa-mai-tet", "hoa-dao-tet", "cay-quat", "hoa-lan-ho-diep"],
      seeds: ["hat-mai-tet", "hat-dao-tet", "hat-quat"],
      fertilizers: ["phan-li-xi", "phan-than-tai"],
      pets: ["pet-rong-2026", "pet-meo-than-tai"],
      frames: ["frame-tet-do", "frame-li-xi"],
      badges: ["badge-tet-2026"],
      recipes: ["banh-chung", "mut-tet", "thit-kho-tau"]
    },
    globalBuff: { growSpeed: 1.2, rainChance: 1.1, coinBonus: 1.25 },
    decorations: { showLanterns: true, showMoon: false, showFireworks: true, gardenOverlay: "tet-overlay" },
    shopBanner: "Tết 2026 - Lì xì & Mai Đào",
    extraDailyQuest: true
  },

  "trung-thu": {
    id: "trung-thu",
    name: "Tết Trung Thu 2026",
    type: "event",
    priority: 100,
    startAt: "2026-09-10T00:00:00+07:00",
    endAt: "2026-09-25T23:59:59+07:00",
    enabled: true,

    ui: {
      primaryColor: "#d97706",
      secondaryColor: "#fbbf24",
      accentColor: "#fef3c7",
      bgGradient: "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 40%, #9a3412 100%)",
      orbColors: ["#fbbf24", "#fcd34d", "#c084fc"],
      particle: "lantern",
      logoIcon: "fa-duotone fa-moon",
      titleSuffix: " · Trung Thu"
    },

    limited: {
      plants: ["hoa-sen-trang", "hoa-cuc-vang-tt", "cay-du-du-tt"],
      seeds: ["hat-sen-trang", "hat-cuc-vang-tt"],
      fertilizers: ["phan-trung-thu"],
      pets: ["pet-tho-ngoc", "pet-chi-hang"],
      frames: ["frame-den-long", "frame-trang-tron"],
      badges: ["badge-trung-thu-2026"],
      recipes: ["banh-trung-thu", "che-hat-sen"]
    },
    globalBuff: { growSpeed: 1.15, rainChance: 1.2, coinBonus: 1.15 },
    decorations: { showLanterns: true, showMoon: true, showFireworks: false, gardenOverlay: "trung-thu-overlay" },
    shopBanner: "Trung Thu - Đèn lồng & Thỏ Ngọc",
    extraDailyQuest: true
  },

  "halloween": {
    id: "halloween",
    name: "Halloween 2026",
    type: "event",
    priority: 80,
    startAt: "2026-10-20T00:00:00+07:00",
    endAt: "2026-11-05T23:59:59+07:00",
    enabled: true,

    ui: {
      primaryColor: "#ea580c",
      secondaryColor: "#f97316",
      accentColor: "#000000",
      bgGradient: "linear-gradient(135deg, #0c0a09 0%, #431407 50%, #7c2d12 100%)",
      orbColors: ["#f97316", "#fb923c", "#a3a3a3"],
      particle: "bat",
      logoIcon: "fa-duotone fa-ghost",
      titleSuffix: " · Halloween"
    },

    limited: {
      plants: ["bi-ngo", "hoa-nhen", "cay-doc"],
      seeds: ["hat-bi-ngo"],
      fertilizers: ["phan-ma-quai"],
      pets: ["pet-ma", "pet-doi"],
      frames: ["frame-bi-ngo", "frame-ma"],
      badges: ["badge-halloween-2026"],
      recipes: ["banh-bi-ngo", "keo-halloween"]
    },
    globalBuff: { growSpeed: 1.1, rainChance: 1.3, coinBonus: 1.1 },
    decorations: { showLanterns: false, showMoon: true, showFireworks: false, gardenOverlay: "halloween-overlay" },
    shopBanner: "Halloween - Ma quái & Bí ngô",
    extraDailyQuest: true
  },

  "giang-sinh": {
    id: "giang-sinh",
    name: "Giáng Sinh 2026",
    type: "event",
    priority: 90,
    startAt: "2026-12-15T00:00:00+07:00",
    endAt: "2027-01-05T23:59:59+07:00",
    enabled: true,

    ui: {
      primaryColor: "#b91c1c",
      secondaryColor: "#16a34a",
      accentColor: "#fef2f2",
      bgGradient: "linear-gradient(135deg, #0f172a 0%, #14532d 40%, #7f1d1d 100%)",
      orbColors: ["#f87171", "#4ade80", "#fef2f2"],
      particle: "snow",
      logoIcon: "fa-duotone fa-tree-christmas",
      titleSuffix: " · Giáng Sinh"
    },

    limited: {
      plants: ["cay-thong-noel", "hoa-trang-sinh", "cay-kim-tuyen"],
      seeds: ["hat-thong-noel"],
      fertilizers: ["phan-noel"],
      pets: ["pet-ong-gia-noel", "pet-tuan-loc"],
      frames: ["frame-noel", "frame-tuyet-trang"],
      badges: ["badge-giang-sinh-2026"],
      recipes: ["banh-noel", "sua-nong"]
    },
    globalBuff: { growSpeed: 1.1, rainChance: 1.0, coinBonus: 1.2 },
    decorations: { showLanterns: false, showMoon: false, showFireworks: true, gardenOverlay: "giang-sinh-overlay" },
    shopBanner: "Giáng Sinh - Ông già Noel",
    extraDailyQuest: true
  },

  "valentine": {
    id: "valentine",
    name: "Valentine 2026",
    type: "event",
    priority: 70,
    startAt: "2026-02-10T00:00:00+07:00",
    endAt: "2026-02-16T23:59:59+07:00",
    enabled: true,

    ui: {
      primaryColor: "#e11d48",
      secondaryColor: "#fb7185",
      accentColor: "#fce7f3",
      bgGradient: "linear-gradient(135deg, #4c0519 0%, #9f1239 50%, #be123c 100%)",
      orbColors: ["#fb7185", "#fda4af", "#fce7f3"],
      particle: "heart",
      logoIcon: "fa-duotone fa-heart",
      titleSuffix: " · Valentine"
    },

    limited: {
      plants: ["hoa-hong-do-valentine", "hoa-hong-hong"],
      seeds: ["hat-hong-valentine"],
      fertilizers: ["phan-tinh-yeu"],
      pets: ["pet-cupid"],
      frames: ["frame-trai-tim"],
      badges: ["badge-valentine-2026"],
      recipes: ["chocolate", "banh-trai-tim"]
    },
    globalBuff: { growSpeed: 1.1, rainChance: 1.0, coinBonus: 1.15 },
    decorations: { showLanterns: false, showMoon: false, showFireworks: false, gardenOverlay: "valentine-overlay" },
    shopBanner: "Valentine - Tình yêu & Hoa hồng",
    extraDailyQuest: true
  },

  "quoc-khanh": {
    id: "quoc-khanh",
    name: "Quốc Khánh 2/9",
    type: "event",
    priority: 85,
    startAt: "2026-08-28T00:00:00+07:00",
    endAt: "2026-09-05T23:59:59+07:00",
    enabled: true,

    ui: {
      primaryColor: "#dc2626",
      secondaryColor: "#fbbf24",
      accentColor: "#fef2f2",
      bgGradient: "linear-gradient(135deg, #450a0a 0%, #991b1b 50%, #b45309 100%)",
      orbColors: ["#fbbf24", "#fef08a", "#fecaca"],
      particle: "flag",
      logoIcon: "fa-duotone fa-flag",
      titleSuffix: " · Quốc Khánh"
    },

    limited: {
      plants: ["hoa-sen-do", "cay-tre-vang"],
      seeds: ["hat-sen-do"],
      fertilizers: ["phan-to-quoc"],
      pets: [],
      frames: ["frame-co-do"],
      badges: ["badge-quoc-khanh-2026"],
      recipes: []
    },
    globalBuff: { growSpeed: 1.1, rainChance: 1.0, coinBonus: 1.1 },
    decorations: { showLanterns: false, showMoon: false, showFireworks: true, gardenOverlay: "quoc-khanh-overlay" },
    shopBanner: "Quốc Khánh 2/9",
    extraDailyQuest: true
  },

  "nha-giao": {
    id: "nha-giao",
    name: "Ngày Nhà giáo Việt Nam 20/11",
    type: "event",
    priority: 60,
    startAt: "2026-11-15T00:00:00+07:00",
    endAt: "2026-11-22T23:59:59+07:00",
    enabled: true,

    ui: {
      primaryColor: "#be123c",
      secondaryColor: "#fb7185",
      accentColor: "#fce7f3",
      bgGradient: "linear-gradient(135deg, #4c0519 0%, #9f1239 50%, #be123c 100%)",
      orbColors: ["#fb7185", "#fda4af", "#fce7f3"],
      particle: "petal",
      logoIcon: "fa-duotone fa-book-open",
      titleSuffix: " · Nhà giáo Việt Nam"
    },

    limited: {
      plants: ["hoa-hong-nha-giao", "hoa-dong-tien"],
      seeds: ["hat-hong-nha-giao"],
      fertilizers: ["phan-tri-thuc"],
      pets: [],
      frames: ["frame-sach"],
      badges: ["badge-nha-giao-2026"],
      recipes: []
    },
    globalBuff: { growSpeed: 1.05, rainChance: 1.0, coinBonus: 1.05 },
    decorations: { showLanterns: false, showMoon: false, showFireworks: false, gardenOverlay: null },
    shopBanner: "Tri ân Thầy Cô 20/11",
    extraDailyQuest: true
  },

  "phu-nu-83": {
    id: "phu-nu-83",
    name: "Quốc tế Phụ nữ 8/3",
    type: "event",
    priority: 65,
    startAt: "2026-03-05T00:00:00+07:00",
    endAt: "2026-03-10T23:59:59+07:00",
    enabled: true,

    ui: {
      primaryColor: "#db2777",
      secondaryColor: "#f472b6",
      accentColor: "#fce7f3",
      bgGradient: "linear-gradient(135deg, #500724 0%, #9d174d 50%, #db2777 100%)",
      orbColors: ["#f472b6", "#f9a8d4", "#fce7f3"],
      particle: "heart",
      logoIcon: "fa-duotone fa-venus",
      titleSuffix: " · 8/3"
    },

    limited: {
      plants: ["hoa-hong-83", "hoa-lan-83"],
      seeds: ["hat-hong-83"],
      fertilizers: ["phan-phu-nu"],
      pets: [],
      frames: ["frame-83"],
      badges: ["badge-83-2026"],
      recipes: []
    },
    globalBuff: { growSpeed: 1.08, rainChance: 1.0, coinBonus: 1.1 },
    decorations: { showLanterns: false, showMoon: false, showFireworks: false, gardenOverlay: null },
    shopBanner: "Chúc mừng 8/3",
    extraDailyQuest: true
  },

  "phu-nu-2010": {
    id: "phu-nu-2010",
    name: "Phụ nữ Việt Nam 20/10",
    type: "event",
    priority: 65,
    startAt: "2026-10-15T00:00:00+07:00",
    endAt: "2026-10-22T23:59:59+07:00",
    enabled: true,

    ui: {
      primaryColor: "#db2777",
      secondaryColor: "#f472b6",
      accentColor: "#fce7f3",
      bgGradient: "linear-gradient(135deg, #500724 0%, #9d174d 50%, #db2777 100%)",
      orbColors: ["#f472b6", "#f9a8d4", "#fce7f3"],
      particle: "petal",
      logoIcon: "fa-duotone fa-venus",
      titleSuffix: " · 20/10"
    },

    limited: {
      plants: ["hoa-hong-2010", "hoa-sen-2010"],
      seeds: ["hat-hong-2010"],
      fertilizers: ["phan-phu-nu"],
      pets: [],
      frames: ["frame-2010"],
      badges: ["badge-2010-2026"],
      recipes: []
    },
    globalBuff: { growSpeed: 1.08, rainChance: 1.0, coinBonus: 1.1 },
    decorations: { showLanterns: false, showMoon: false, showFireworks: false, gardenOverlay: null },
    shopBanner: "Chúc mừng 20/10",
    extraDailyQuest: true
  }
};

/** Cấu hình mặc định theme (merge vào settings) */
const DEFAULT_THEME_CONFIG = {
  activeThemeId: null,
  forceTheme: false,
  autoSwitch: true,
  defaultThemeId: "default",
  themes: JSON.parse(JSON.stringify(THEMES)) // deep clone
};

/**
 * Lấy theme đang active
 * Ưu tiên: forceTheme > event/season trong khoảng thời gian (priority cao nhất) > default
 */
function getActiveTheme() {
  const cfg = (typeof currentSettings !== 'undefined' && currentSettings.themeConfig)
    ? currentSettings.themeConfig
    : DEFAULT_THEME_CONFIG;

  const themes = cfg.themes || THEMES;

  // 1. Admin ép theme
  if (cfg.forceTheme && cfg.activeThemeId && themes[cfg.activeThemeId]) {
    return themes[cfg.activeThemeId];
  }

  // 2. Tìm theme đang trong khoảng thời gian + priority cao nhất
  if (cfg.autoSwitch !== false) {
    const now = Date.now();
    let best = null;
    let bestPriority = -1;

    Object.values(themes).forEach(t => {
      if (!t || !t.enabled) return;
      if (t.type === "default") return;

      const start = t.startAt ? new Date(t.startAt).getTime() : 0;
      const end = t.endAt ? new Date(t.endAt).getTime() : Infinity;

      if (now >= start && now <= end && (t.priority || 0) > bestPriority) {
        best = t;
        bestPriority = t.priority || 0;
      }
    });

    if (best) return best;
  }

  // 3. Fallback default
  return themes[cfg.defaultThemeId || "default"] || THEMES["default"];
}

/**
 * Áp dụng theme lên UI (CSS variables + class + particle)
 */
function applySeasonTheme(theme) {
  if (!theme || !theme.ui) return;

  const root = document.documentElement;
  const ui = theme.ui;

  // Data attribute để CSS target
  root.setAttribute("data-season-theme", theme.id || "default");

  // CSS variables
  if (ui.primaryColor) root.style.setProperty("--theme-primary", ui.primaryColor);
  if (ui.secondaryColor) root.style.setProperty("--theme-secondary", ui.secondaryColor);
  if (ui.accentColor) root.style.setProperty("--theme-accent", ui.accentColor);
  if (ui.bgGradient) root.style.setProperty("--theme-bg-gradient", ui.bgGradient);

  // Orb colors
  if (Array.isArray(ui.orbColors) && ui.orbColors.length) {
    ui.orbColors.forEach((c, i) => {
      root.style.setProperty(`--theme-orb-${i + 1}`, c);
    });
  }

  // Title suffix (nếu có element)
  const titleEl = document.querySelector(".login-card h1, .app-title, #app-title");
  if (titleEl && ui.titleSuffix !== undefined) {
    const base = titleEl.dataset.baseTitle || titleEl.textContent.replace(/\s·\s.*$/, "").trim();
    titleEl.dataset.baseTitle = base;
    titleEl.textContent = base + (ui.titleSuffix || "");
  }

  // Logo icon
  const logoIcon = document.querySelector(".login-logo i, .sidebar-logo i, #main-logo-icon");
  if (logoIcon && ui.logoIcon) {
    logoIcon.className = ui.logoIcon;
  }

  // Particle / decoration overlay
  updateThemeParticles(theme);

  // Shop banner
  const banner = document.getElementById("theme-shop-banner");
  if (banner) {
    if (theme.shopBanner) {
      banner.textContent = theme.shopBanner;
      banner.style.display = "";
    } else {
      banner.style.display = "none";
    }
  }

  // Lưu id hiện tại để tránh apply liên tục
  window.__currentSeasonThemeId = theme.id;
}

/**
 * Cập nhật particle / hiệu ứng trang trí
 */
function updateThemeParticles(theme) {
  let container = document.getElementById("theme-particle-layer");
  if (!container) {
    container = document.createElement("div");
    container.id = "theme-particle-layer";
    container.setAttribute("aria-hidden", "true");
    container.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:5;overflow:hidden;";
    document.body.appendChild(container);
  }

  container.innerHTML = "";
  container.className = "theme-particle-layer particle-" + (theme.ui?.particle || "none");

  const particle = theme.ui?.particle || "none";
  if (particle === "none") return;

  const count = particle === "snow" || particle === "petal" || particle === "leaf" ? 28 :
                particle === "lantern" || particle === "firework" ? 12 :
                particle === "heart" || particle === "bat" || particle === "firefly" ? 18 : 15;

  const emojis = {
    petal: ["🌸", "🌺", "🌼"],
    leaf: ["🍂", "🍁", "🍃"],
    snow: ["❄", "❅", "❆"],
    lantern: ["🏮", "🧧"],
    firework: ["✨", "🎆", "🎇"],
    heart: ["💕", "💗", "❤️"],
    bat: ["🦇", "🎃"],
    firefly: ["✨", "🌟"],
    flag: ["🚩", "⭐"]
  };

  const list = emojis[particle] || ["✨"];

  for (let i = 0; i < count; i++) {
    const el = document.createElement("span");
    el.className = "theme-particle";
    el.textContent = list[Math.floor(Math.random() * list.length)];
    el.style.left = (Math.random() * 100) + "%";
    el.style.animationDuration = (4 + Math.random() * 8) + "s";
    el.style.animationDelay = (Math.random() * 5) + "s";
    el.style.fontSize = (12 + Math.random() * 14) + "px";
    el.style.opacity = String(0.35 + Math.random() * 0.45);
    container.appendChild(el);
  }

  // Moon cho Trung Thu / Halloween
  if (theme.decorations?.showMoon) {
    const moon = document.createElement("div");
    moon.className = "theme-moon";
    moon.textContent = "🌕";
    container.appendChild(moon);
  }
}

/**
 * Lấy buff toàn cục của theme đang active
 */
function getThemeGlobalBuff() {
  const t = getActiveTheme();
  return t?.globalBuff || { growSpeed: 1, rainChance: 1, coinBonus: 1 };
}

/**
 * Kiểm tra item có thuộc limited của theme đang active không
 */
function isThemeLimitedItem(kind, id) {
  const t = getActiveTheme();
  if (!t || !t.limited) return false;
  const list = t.limited[kind] || [];
  return list.includes(id);
}

/**
 * Khởi tạo theme system (gọi 1 lần sau khi load settings)
 */
function initSeasonThemeSystem() {
  try {
    const theme = getActiveTheme();
    applySeasonTheme(theme);

    // Kiểm tra lại mỗi 5 phút (phòng trường hợp qua ngày)
    if (window.__themeCheckInterval) clearInterval(window.__themeCheckInterval);
    window.__themeCheckInterval = setInterval(() => {
      const next = getActiveTheme();
      if (next && next.id !== window.__currentSeasonThemeId) {
        applySeasonTheme(next);
        if (typeof showToast === "function") {
          showToast("Theme đã đổi: " + (next.name || next.id), "info");
        }
      }
    }, 5 * 60 * 1000);
  } catch (e) {
    console.warn("initSeasonThemeSystem error:", e);
  }
}

// Export cho admin / global
if (typeof window !== "undefined") {
  window.THEMES = THEMES;
  window.DEFAULT_THEME_CONFIG = DEFAULT_THEME_CONFIG;
  window.getActiveTheme = getActiveTheme;
  window.applySeasonTheme = applySeasonTheme;
  window.getThemeGlobalBuff = getThemeGlobalBuff;
  window.isThemeLimitedItem = isThemeLimitedItem;
  window.initSeasonThemeSystem = initSeasonThemeSystem;
}



const Game = {
  
  now() { return (typeof nowMs === "function") ? nowMs() : Date.now(); },

  /** Chuẩn hóa timestamp từ number / string / Firebase Timestamp → ms (number) hoặc null */
  toMs(val) {
    if (val == null || val === '') return null;
    if (typeof val === 'number') return Number.isFinite(val) && val > 0 ? val : null;
    if (typeof val === 'string') {
      const n = Number(val);
      return Number.isFinite(n) && n > 0 ? n : null;
    }
    if (typeof val === 'object') {
      // Firebase Timestamp (admin SDK / client)
      if (typeof val.toMillis === 'function') {
        try { const m = val.toMillis(); return Number.isFinite(m) && m > 0 ? m : null; } catch (_) {}
      }
      if (val.seconds != null) {
        const sec = Number(val.seconds);
        const nano = Number(val.nanoseconds) || 0;
        if (Number.isFinite(sec)) return sec * 1000 + Math.floor(nano / 1e6);
      }
      if (val._seconds != null) {
        const sec = Number(val._seconds);
        const nano = Number(val._nanoseconds) || 0;
        if (Number.isFinite(sec)) return sec * 1000 + Math.floor(nano / 1e6);
      }
    }
    const n = Number(val);
    return Number.isFinite(n) && n > 0 ? n : null;
  },

  
  raining: false,
  rainUntil: 0,
  nextRainAt: 0,
  RAIN_INTERVAL_MS: 30 * 60 * 1000,
  rainBoostPlots: {}, 

  getPlayer() { return currentPlayer; },
  getPlants() { return currentPlants; },
  getPlant(id) {
    if (id == null || id === '') return null;
    const s = String(id);
    return currentPlants.find(p => p && (p.id === id || String(p.id) === s)) || null;
  },
  getFertilizer(id) { return DEFAULT_FERTILIZERS.find(f => f.id === id); },
  getFertilizers() { return DEFAULT_FERTILIZERS; },
  getProtect(id) { return DEFAULT_PROTECTS.find(p => p.id === id); },
  getProtects() { return DEFAULT_PROTECTS; },
  getFairyPacks() { return DEFAULT_FAIRY_PACKS; },
  getHelperPacks() { return (typeof DEFAULT_HELPER_PACKS !== 'undefined') ? DEFAULT_HELPER_PACKS : []; },
  getNycPacks() { return DEFAULT_NYC_PACKS; },
  getPets() { return typeof getPets === 'function' ? getPets() : (typeof DEFAULT_PETS !== 'undefined' ? DEFAULT_PETS : []); },
  getAvatarFrames() { return typeof getAvatarFrames === 'function' ? getAvatarFrames() : (typeof DEFAULT_AVATAR_FRAMES !== 'undefined' ? DEFAULT_AVATAR_FRAMES : []); },
  getAvatarFrame(id) { return this.getAvatarFrames().find(f => f.id === id); },
  getCompanions() { return typeof getCompanions === 'function' ? getCompanions() : (typeof DEFAULT_COMPANIONS !== 'undefined' ? DEFAULT_COMPANIONS : []); },
  getCompanion(id) { return this.getCompanions().find(c => c.id === id); },

  
  isUnlimitedResources() {
    return !!(currentPlayer && currentPlayer.unlimitedResources);
  },
  canAfford(cost) {
    if (this.isUnlimitedResources()) return true;
    return (Number(currentPlayer && currentPlayer.coins) || 0) >= (Number(cost) || 0);
  },
  
  chargeCoins(cost) {
    cost = Math.max(0, Number(cost) || 0);
    if (this.isUnlimitedResources()) return true;
    if (!currentPlayer || (Number(currentPlayer.coins) || 0) < cost) return false;
    currentPlayer.coins = (Number(currentPlayer.coins) || 0) - cost;
    currentPlayer.stats = currentPlayer.stats || {};
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
    return true;
  },

  getAvatarBadges() { return typeof getAvatarBadges === 'function' ? getAvatarBadges() : (typeof DEFAULT_AVATAR_BADGES !== 'undefined' ? DEFAULT_AVATAR_BADGES : []); },
  getAvatarBadge(id) {
    if (!id) return null;
    const found = this.getAvatarBadges().find(b => b.id === id);
    if (found) return found;
    
    const slug = String(id).replace(/^ab-/, '').replace(/^fa-/, '');
    if (!slug) return null;
    const fa = (typeof faProClass === 'function') ? faProClass(slug) : ('fa-solid fa-' + slug);
    return {
      id: 'ab-' + slug,
      fa,
      slug,
      name: slug,
      price: 400,
      rarity: 'common',
      desc: 'Icon FA · ' + slug
    };
  },



  getPet(id) { return this.getPets().find(p => p.id === id); },
  getRecipes() { return typeof getKitchenRecipes === 'function' ? getKitchenRecipes() : []; },
  getRecipe(id) { return this.getRecipes().find(r => r.id === id); },
  getSettings() { return currentSettings; },

  
  MAX_PLOTS_PER_GARDEN: 99,

  makeEmptyPlots(count) {
    const n = Math.max(1, count || (currentSettings && currentSettings.plotCount) || 4);
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      plantId: null,
      plantedAt: null,
      watered: false,
      waterCount: 0,
      lastWatered: null,
      fertilizerId: null
    }));
  },

  ensureGardens() {
    if (!currentPlayer) return;

    // Firebase đôi khi lưu gardens dạng object {0:[],1:[]} thay vì array
    if (currentPlayer.gardens && !Array.isArray(currentPlayer.gardens) && typeof currentPlayer.gardens === 'object') {
      const keys = Object.keys(currentPlayer.gardens).sort((a, b) => Number(a) - Number(b));
      currentPlayer.gardens = keys.map(k => currentPlayer.gardens[k]);
    }

    if (!Array.isArray(currentPlayer.gardens) || !currentPlayer.gardens.length) {
      let plots = currentPlayer.plots;
      if (!Array.isArray(plots)) plots = Object.values(plots || {});
      if (!plots.length) plots = this.makeEmptyPlots();
      // Chỉ normalize id, giữ nguyên object ô (không clone oan)
      plots.forEach((p, i) => {
        if (p && typeof p === 'object' && typeof p.id !== 'number') p.id = i;
      });
      currentPlayer.gardens = [plots];
    } else {
      // Chỉ sửa cấu trúc hỏng — KHÔNG clone lại toàn bộ ô mỗi lần gọi
      // (clone liên tục làm plots lệch reference → chuyển vườn ghi đè nhầm)
      for (let gi = 0; gi < currentPlayer.gardens.length; gi++) {
        let g = currentPlayer.gardens[gi];
        let plots;
        if (Array.isArray(g)) {
          plots = g;
        } else if (g && Array.isArray(g.plots)) {
          plots = g.plots;
        } else if (g && typeof g === 'object') {
          const keys = Object.keys(g).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
          plots = keys.length ? keys.map(k => g[k]) : [];
        } else {
          plots = [];
        }
        // Không xóa vườn đang có cây chỉ vì parse lỗi tạm thời
        if (!plots.length && Array.isArray(g) && g.length === 0) {
          // thật sự trống — giữ [] hoặc starter tùy logic cũ
          plots = this.makeEmptyPlots();
        } else if (!plots.length && g && typeof g === 'object' && !Array.isArray(g)) {
          plots = this.makeEmptyPlots();
        }
        if (Array.isArray(plots)) {
          for (let i = 0; i < plots.length; i++) {
            if (plots[i] && typeof plots[i] === 'object' && typeof plots[i].id !== 'number') {
              plots[i].id = i;
            }
          }
          currentPlayer.gardens[gi] = plots;
        }
      }
    }

    // Tách reference trùng giữa các vườn (Firebase / sync lỗi có thể làm 2 vườn cùng 1 mảng → mất ô)
    if (Array.isArray(currentPlayer.gardens) && currentPlayer.gardens.length > 1) {
      const seen = new Map();
      for (let gi = 0; gi < currentPlayer.gardens.length; gi++) {
        const arr = currentPlayer.gardens[gi];
        if (!Array.isArray(arr)) continue;
        if (seen.has(arr)) {
          // Clone nông từng ô — giữ dữ liệu hiện có, không còn share mảng
          currentPlayer.gardens[gi] = arr.map((p, idx) => {
            if (p && typeof p === 'object') {
              const c = Object.assign({}, p);
              c.id = idx;
              return c;
            }
            return {
              id: idx, plantId: null, plantedAt: null, watered: false,
              waterCount: 0, lastWatered: null, fertilizerId: null
            };
          });
        } else {
          seen.set(arr, gi);
        }
      }
    }

    if (typeof currentPlayer.activeGarden !== 'number' || currentPlayer.activeGarden < 0 || isNaN(currentPlayer.activeGarden)) {
      currentPlayer.activeGarden = 0;
    }
    if (currentPlayer.activeGarden >= currentPlayer.gardens.length) {
      currentPlayer.activeGarden = Math.max(0, currentPlayer.gardens.length - 1);
    }

    this.refreshGardenUnlocks();

    // Chuẩn hóa từng ô: timestamp & hệ số tốc độ về number (Firebase hay trả string / Timestamp object)
    for (let gi = 0; gi < currentPlayer.gardens.length; gi++) {
      const plots = currentPlayer.gardens[gi];
      if (!Array.isArray(plots)) continue;
      for (let i = 0; i < plots.length; i++) {
        const p = plots[i];
        if (!p || typeof p !== 'object') continue;
        if (p.plantedAt != null) {
          p.plantedAt = this.toMs(p.plantedAt);
        }
        if (p.lastWatered != null) {
          p.lastWatered = this.toMs(p.lastWatered);
        }
        if (p.fertilizedAt != null) {
          p.fertilizedAt = this.toMs(p.fertilizedAt);
        }
        if (p.specialMult != null) p.specialMult = Number(p.specialMult) || 1;
        if (p.specialMultPermanent != null) p.specialMultPermanent = Number(p.specialMultPermanent) || 1;
        if (p.specialMultTemp != null) p.specialMultTemp = Number(p.specialMultTemp) || 1;
        if (p.specialMultUntil != null) {
          p.specialMultUntil = this.toMs(p.specialMultUntil);
        }
        // Đồng bộ: nếu có tốc độ >1 mà chưa có permanent → gán permanent (tránh offline mất buff)
        const sm = Number(p.specialMult) || 1;
        const sp = Number(p.specialMultPermanent) || 0;
        const until = Number(p.specialMultUntil) || 0;
        const nowT = (typeof nowMs === 'function' ? nowMs() : Date.now());
        if (sm > 1 && sp < sm && (!until || until <= nowT)) {
          p.specialMultPermanent = sm;
        }
        if ((Number(p.specialMultPermanent) || 0) > 1) {
          p.specialMult = Math.max(Number(p.specialMult) || 1, Number(p.specialMultPermanent) || 1);
        }
        // Ép permanent x50+ luôn giữ floor (tránh mất tốc độ offline)
        if ((Number(p.specialMultPermanent) || 0) >= 2) {
          p.specialMult = Math.max(Number(p.specialMult) || 1, Number(p.specialMultPermanent) || 1);
        }
        // Backfill baseGrowTime cho cây đang trồng (phục vụ offline khi thiếu định nghĩa cây)
        if (p.plantId && !(Number(p.baseGrowTime) > 0)) {
          try {
            const plDef = this.getPlant(p.plantId);
            if (plDef && Number(plDef.growTime) > 0) p.baseGrowTime = Number(plDef.growTime);
          } catch (_) {}
        }
        if (typeof p.waterCount !== 'number') p.waterCount = p.watered ? 3 : 0;
        if (typeof p.id !== 'number') p.id = i;
      }
    }

    // Đồng bộ plots với vườn đang active (cùng reference)
    const ai = currentPlayer.activeGarden;
    if (Array.isArray(currentPlayer.gardens[ai])) {
      currentPlayer.plots = currentPlayer.gardens[ai];
    }
  },

  
  refreshGardenUnlocks() {
    if (!currentPlayer || !Array.isArray(currentPlayer.gardens)) return;
    const max = this.MAX_PLOTS_PER_GARDEN;
    let guard = 0;
    while (guard++ < 30) {
      const last = currentPlayer.gardens[currentPlayer.gardens.length - 1];
      if (last && last.length >= max) {
        const newGi = currentPlayer.gardens.length; // chỉ số vườn sắp mở
        currentPlayer.gardens.push(this.makeEmptyPlots());
        // Vườn mới: KHÔNG tự trồng hạt (NYC/Tiên) — tắt đến khi người chơi bật trong cấu hình
        try {
          if (!currentPlayer.nycConfig || typeof currentPlayer.nycConfig !== 'object') {
            currentPlayer.nycConfig = { gardensEnabled: {}, byGarden: {} };
          }
          if (!currentPlayer.nycConfig.gardensEnabled || typeof currentPlayer.nycConfig.gardensEnabled !== 'object') {
            currentPlayer.nycConfig.gardensEnabled = {};
          }
          currentPlayer.nycConfig.gardensEnabled[String(newGi)] = false;
          currentPlayer.nycConfig.gardensEnabled[newGi] = false;
        } catch (_) {}
        try {
          if (!currentPlayer.fairyConfig || typeof currentPlayer.fairyConfig !== 'object') {
            currentPlayer.fairyConfig = { gardensEnabled: {} };
          }
          if (!currentPlayer.fairyConfig.gardensEnabled || typeof currentPlayer.fairyConfig.gardensEnabled !== 'object') {
            currentPlayer.fairyConfig.gardensEnabled = {};
          }
          currentPlayer.fairyConfig.gardensEnabled[String(newGi)] = false;
          currentPlayer.fairyConfig.gardensEnabled[newGi] = false;
        } catch (_) {}
      } else break;
    }
  },

  syncActiveGarden() {
    if (!currentPlayer || !Array.isArray(currentPlayer.gardens)) return;
    const i = (typeof currentPlayer.activeGarden === 'number' && currentPlayer.activeGarden >= 0)
      ? currentPlayer.activeGarden
      : 0;
    if (!Array.isArray(currentPlayer.plots)) return;
    if (i < 0 || i >= currentPlayer.gardens.length) return;

    // plots đang trỏ nhầm sang vườn khác → kéo về đúng slot, không ghi đè
    for (let j = 0; j < currentPlayer.gardens.length; j++) {
      if (j !== i && currentPlayer.plots === currentPlayer.gardens[j]) {
        currentPlayer.plots = currentPlayer.gardens[i];
        return;
      }
    }

    if (currentPlayer.plots === currentPlayer.gardens[i]) {
      return;
    }

    const existing = currentPlayer.gardens[i];
    // Không bao giờ ghi đè vườn đang nhiều ô bằng mảng ngắn hơn (trừ khi cùng nội dung mở rộng hợp lệ)
    if (Array.isArray(existing) && existing.length > currentPlayer.plots.length) {
      // Giữ vườn dài, đồng bộ plots theo vườn
      currentPlayer.plots = existing;
      return;
    }

    currentPlayer.gardens[i] = currentPlayer.plots;
  },

  getGardenCount() {
    this.ensureGardens();
    return currentPlayer.gardens.length;
  },

  getActiveGardenIndex() {
    this.ensureGardens();
    return currentPlayer.activeGarden || 0;
  },

  switchGarden(index) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    this.ensureGardens();
    const prev = (typeof currentPlayer.activeGarden === 'number') ? currentPlayer.activeGarden : 0;
    // Chỉ ghi plots vào vườn prev nếu không phải reference của vườn khác và không làm ngắn bất thường
    if (Array.isArray(currentPlayer.plots) && prev >= 0 && prev < currentPlayer.gardens.length) {
      let pointsElsewhere = false;
      for (let j = 0; j < currentPlayer.gardens.length; j++) {
        if (j !== prev && currentPlayer.plots === currentPlayer.gardens[j]) {
          pointsElsewhere = true;
          break;
        }
      }
      const existing = currentPlayer.gardens[prev];
      const wouldShrink = Array.isArray(existing) && existing.length > currentPlayer.plots.length;
      if (!pointsElsewhere && !wouldShrink) {
        currentPlayer.gardens[prev] = currentPlayer.plots;
      }
    }
    index = parseInt(index, 10);
    if (isNaN(index) || index < 0 || index >= currentPlayer.gardens.length) {
      return { ok: false, msg: 'Vườn chưa mở khóa! Cần đủ 99 ô ở vườn trước.' };
    }
    if (!Array.isArray(currentPlayer.gardens[index])) {
      return { ok: false, msg: 'Dữ liệu Vườn ' + (index + 1) + ' lỗi. Thử tải lại trang.' };
    }
    currentPlayer.activeGarden = index;
    currentPlayer.plots = currentPlayer.gardens[index];
    return { ok: true, msg: 'Đã chuyển sang Vườn ' + (index + 1) };
  },

  
  forEachGarden(fn) {
    if (!currentPlayer) return;
    this.ensureGardens();
    this.syncActiveGarden();
    const active = currentPlayer.activeGarden || 0;
    currentPlayer.gardens.forEach((plots, i) => {
      currentPlayer.activeGarden = i;
      currentPlayer.plots = plots;
      fn(plots, i);
      currentPlayer.gardens[i] = currentPlayer.plots;
    });
    currentPlayer.activeGarden = active;
    currentPlayer.plots = currentPlayer.gardens[active];
  },


  
  hasFairy() {
    return !!(currentPlayer && currentPlayer.fairyUntil && currentPlayer.fairyUntil > (typeof nowMs==="function"?nowMs():Date.now()));
  },

  
  isFairyActive() {
    return this.hasFairy() && this.getBuffPrefs().fairyEnabled;
  },

  
  showFairyDecor() {
    return this.hasFairy() && !!this.getBuffPrefs().fairyVisual;
  },
  showNycDecor() {
    return this.hasNyc() && !!this.getBuffPrefs().nycVisual;
  },
  showHelperDecor() {
    return this.hasHelper() && !!this.getBuffPrefs().helperVisual;
  },
  showRobotDecor() {
    return this.hasRobot() && !!this.getBuffPrefs().robotVisual;
  },

  fairyRemainingSec() {
    if (!this.hasFairy()) return 0;
    return Math.max(0, Math.ceil((currentPlayer.fairyUntil - (typeof nowMs==="function"?nowMs():Date.now())) / 1000));
  },

  
  hasNyc() {
    if (!currentPlayer) return false;
    const until = this.toMs(currentPlayer.nycUntil) || Number(currentPlayer.nycUntil) || 0;
    return until > (typeof nowMs === 'function' ? nowMs() : Date.now());
  },

  
  isNycActive() {
    return this.hasNyc() && this.getBuffPrefs().nycEnabled;
  },

  
  isNycActiveAt(t) {
    if (!currentPlayer || !this.getBuffPrefs().nycEnabled) return false;
    const until = this.toMs(currentPlayer.nycUntil) || Number(currentPlayer.nycUntil) || 0;
    return until > (Number(t) || 0);
  },

  
  isFairyActiveAt(t) {
    if (!currentPlayer || !this.getBuffPrefs().fairyEnabled) return false;
    const until = this.toMs(currentPlayer.fairyUntil) || Number(currentPlayer.fairyUntil) || 0;
    return until > (Number(t) || 0);
  },

  nycRemainingSec() {
    if (!this.hasNyc()) return 0;
    return Math.max(0, Math.ceil((currentPlayer.nycUntil - (typeof nowMs==="function"?nowMs():Date.now())) / 1000));
  },

  getBuffPrefs() {
    const def = { fairyEnabled: true, nycEnabled: true, helperEnabled: true, robotEnabled: true, fairyVisual: true, nycVisual: true, helperVisual: true, robotVisual: true };
    if (!currentPlayer) return { ...def };
    if (!currentPlayer.buffPrefs || typeof currentPlayer.buffPrefs !== 'object') {
      currentPlayer.buffPrefs = { ...def };
    }
    const p = currentPlayer.buffPrefs;
    if (typeof p.fairyEnabled !== 'boolean') p.fairyEnabled = true;
    if (typeof p.nycEnabled !== 'boolean') p.nycEnabled = true;
    if (typeof p.helperEnabled !== 'boolean') p.helperEnabled = true;
    if (typeof p.robotEnabled !== 'boolean') p.robotEnabled = true;
    if (typeof p.fairyVisual !== 'boolean') p.fairyVisual = true;
    if (typeof p.nycVisual !== 'boolean') p.nycVisual = true;
    if (typeof p.helperVisual !== 'boolean') p.helperVisual = true;
    if (typeof p.robotVisual !== 'boolean') p.robotVisual = true;
    return p;
  },

  setBuffPrefs(prefs) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const cur = this.getBuffPrefs();
    currentPlayer.buffPrefs = {
      fairyEnabled: prefs && typeof prefs.fairyEnabled === 'boolean' ? prefs.fairyEnabled : cur.fairyEnabled,
      nycEnabled: prefs && typeof prefs.nycEnabled === 'boolean' ? prefs.nycEnabled : cur.nycEnabled,
      helperEnabled: prefs && typeof prefs.helperEnabled === 'boolean' ? prefs.helperEnabled : cur.helperEnabled,
      robotEnabled: prefs && typeof prefs.robotEnabled === 'boolean' ? prefs.robotEnabled : cur.robotEnabled,
      fairyVisual: prefs && typeof prefs.fairyVisual === 'boolean' ? prefs.fairyVisual : cur.fairyVisual,
      nycVisual: prefs && typeof prefs.nycVisual === 'boolean' ? prefs.nycVisual : cur.nycVisual,
      helperVisual: prefs && typeof prefs.helperVisual === 'boolean' ? prefs.helperVisual : cur.helperVisual,
      robotVisual: prefs && typeof prefs.robotVisual === 'boolean' ? prefs.robotVisual : cur.robotVisual
    };
    const a = [];
    a.push('Tiên hình:' + (currentPlayer.buffPrefs.fairyVisual ? 'bật' : 'tắt') + '/buff:' + (currentPlayer.buffPrefs.fairyEnabled ? 'bật' : 'tắt'));
    a.push('NYC hình:' + (currentPlayer.buffPrefs.nycVisual ? 'bật' : 'tắt') + '/buff:' + (currentPlayer.buffPrefs.nycEnabled ? 'bật' : 'tắt'));
    a.push('Giúp việc hình:' + (currentPlayer.buffPrefs.helperVisual ? 'bật' : 'tắt') + '/buff:' + (currentPlayer.buffPrefs.helperEnabled ? 'bật' : 'tắt'));
    a.push('Người máy hình:' + (currentPlayer.buffPrefs.robotVisual ? 'bật' : 'tắt') + '/buff:' + (currentPlayer.buffPrefs.robotEnabled ? 'bật' : 'tắt'));
    return { ok: true, msg: 'Đã lưu: ' + a.join(' · ') };
  },

  getNycConfig() {
    const def = { plantId: null, seedKind: 'normal', plantList: [], mode: 'all', count: 1, gardensEnabled: {}, byGarden: {}, customName: '', gender: 'female' };
    if (!currentPlayer) return { ...def };
    if (!currentPlayer.nycConfig || typeof currentPlayer.nycConfig !== 'object') {
      currentPlayer.nycConfig = { ...def };
    }
    if (!currentPlayer.nycConfig.seedKind) currentPlayer.nycConfig.seedKind = 'normal';
    if (!currentPlayer.nycConfig.gardensEnabled || typeof currentPlayer.nycConfig.gardensEnabled !== 'object') {
      currentPlayer.nycConfig.gardensEnabled = {};
    }
    if (!currentPlayer.nycConfig.byGarden || typeof currentPlayer.nycConfig.byGarden !== 'object') {
      currentPlayer.nycConfig.byGarden = {};
    }
    if (typeof currentPlayer.nycConfig.customName !== 'string') currentPlayer.nycConfig.customName = '';
    if (currentPlayer.nycConfig.gender !== 'male' && currentPlayer.nycConfig.gender !== 'female') {
      currentPlayer.nycConfig.gender = 'female';
    }
    // Chuẩn hoá plantList (danh sách hạt dự phòng theo thứ tự ưu tiên)
    currentPlayer.nycConfig.plantList = this._normalizeNycPlantList(
      currentPlayer.nycConfig.plantList,
      currentPlayer.nycConfig.plantId,
      currentPlayer.nycConfig.seedKind
    );
    if (currentPlayer.nycConfig.plantList.length) {
      currentPlayer.nycConfig.plantId = currentPlayer.nycConfig.plantList[0].plantId;
      currentPlayer.nycConfig.seedKind = currentPlayer.nycConfig.plantList[0].seedKind;
    }
    return currentPlayer.nycConfig;
  },

  _normalizeNycPlantList(list, fallbackId, fallbackKind) {
    const normKind = (k) => (k === 'myth' || k === 'star') ? k : 'normal';
    const out = [];
    const seen = new Set();
    const push = (id, kind) => {
      if (!id) return;
      const k = normKind(kind);
      const key = id + '|' + k;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ plantId: id, seedKind: k });
    };
    if (Array.isArray(list)) {
      list.forEach(it => {
        if (!it) return;
        if (typeof it === 'string') push(it, 'normal');
        else if (typeof it === 'object') push(it.plantId || it.id, it.seedKind || it.kind);
      });
    }
    if (!out.length && fallbackId) push(fallbackId, fallbackKind);
    return out.slice(0, 8);
  },

  
  getNycConfigForGarden(gardenIndex) {
    const base = this.getNycConfig();
    const key = String(gardenIndex);
    const ov = (base.byGarden && (base.byGarden[key] || base.byGarden[gardenIndex])) || null;
    // Chỉ dùng cấu hình của ĐÚNG vườn này — không lấy hạt từ vườn khác
    let plantId = null;
    let seedKind = 'normal';
    let plantList = [];
    let mode = 'all';
    let count = 1;
    const normKind = (k) => (k === 'myth' || k === 'star') ? k : 'normal';
    if (ov && typeof ov === 'object') {
      plantList = this._normalizeNycPlantList(ov.plantList, ov.plantId, ov.seedKind);
      plantId = plantList.length ? plantList[0].plantId : (ov.plantId || null);
      seedKind = plantList.length ? plantList[0].seedKind : normKind(ov.seedKind);
      mode = ov.mode === 'count' ? 'count' : 'all';
      count = typeof ov.count === 'number' ? ov.count : 1;
    } else {
      // Chưa có byGarden riêng → dùng cấu hình gốc
      plantList = this._normalizeNycPlantList(base.plantList, base.plantId, base.seedKind);
      plantId = plantList.length ? plantList[0].plantId : (base.plantId || null);
      seedKind = plantList.length ? plantList[0].seedKind : normKind(base.seedKind);
      mode = base.mode === 'count' ? 'count' : 'all';
      count = typeof base.count === 'number' ? base.count : 1;
    }
    return { ...base, plantId, seedKind, plantList, mode, count, _gardenIndex: gardenIndex };
  },

  setNycConfig(cfg) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const prev = this.getNycConfig();
    const ge = {};
    if (cfg && cfg.gardensEnabled && typeof cfg.gardensEnabled === 'object') {
      Object.keys(cfg.gardensEnabled).forEach(k => { ge[k] = !!cfg.gardensEnabled[k]; });
    } else {
      Object.assign(ge, prev.gardensEnabled || {});
    }
    const byGarden = Object.assign({}, prev.byGarden || {});
    let plantList = this._normalizeNycPlantList(
      cfg && cfg.plantList,
      cfg && cfg.plantId,
      cfg && cfg.seedKind
    );
    if (!plantList.length && cfg && cfg.plantId) {
      plantList = this._normalizeNycPlantList(null, cfg.plantId, cfg.seedKind);
    }
    const slice = {
      plantId: plantList.length ? plantList[0].plantId : ((cfg && cfg.plantId) || null),
      seedKind: plantList.length ? plantList[0].seedKind : ((cfg && (cfg.seedKind === 'myth' || cfg.seedKind === 'star')) ? cfg.seedKind : 'normal'),
      plantList,
      mode: cfg && cfg.mode === 'count' ? 'count' : 'all',
      count: Math.max(1, Math.min(99, parseInt(cfg && cfg.count, 10) || 1))
    };
    const gIdx = cfg && (cfg.gardenIndex !== undefined && cfg.gardenIndex !== null)
      ? String(cfg.gardenIndex) : null;
    if (gIdx !== null) {
      byGarden[gIdx] = slice;
      if (cfg && typeof cfg.gardenEnabled === 'boolean') ge[gIdx] = cfg.gardenEnabled;
    }
    const next = {
      ...slice,
      gardensEnabled: ge,
      byGarden,
      customName: (cfg && typeof cfg.customName === 'string') ? cfg.customName.trim().slice(0, 20) : (prev.customName || ''),
      gender: cfg && cfg.gender === 'male' ? 'male' : 'female'
    };
    currentPlayer.nycConfig = next;
    const label = gIdx !== null ? ('Vườn ' + (Number(gIdx) + 1) + ' · ') : '';
    const listLabel = plantList.length
      ? (plantList.map(x => x.plantId + (x.seedKind !== 'normal' ? ('/' + x.seedKind) : '')).join(' → '))
      : (slice.plantId || 'chưa chọn hạt');
    return { ok: true, msg: 'Đã lưu NYC · ' + label + listLabel };
  },

  
  getPlotSpeedMult(plot, atMs) {
    if (!plot) return 1;
    const t = (atMs != null && Number.isFinite(Number(atMs)))
      ? Number(atMs)
      : ((typeof nowMs === 'function' ? nowMs() : Date.now()));
    const perm = Number(plot.specialMultPermanent) || 0;
    const untilN = this.toMs(plot.specialMultUntil) || 0;
    const tempActive = untilN > t;
    let temp = 1;
    if (tempActive) {
      temp = Number(plot.specialMultTemp || plot.specialMult) || 1;
    }
    // specialMult luôn là sàn tốc độ (nâng vĩnh viễn / legacy / sau khi hết temp vẫn giữ)
    // Trước đây hết temp + có specialMultUntil cũ → rơi về x1 → offline mất vụ, realtime vẫn thu được
    const floor = Number(plot.specialMult) > 1 ? Number(plot.specialMult) : 1;
    // Permanent x50+ luôn được ưu tiên (tránh mất tốc độ offline)
    return Math.max(perm, temp, floor, 1);
  },

  getWeather() {
    if (this.raining && (typeof nowMs==="function"?nowMs():Date.now()) < this.rainUntil) {
      return { icon: '🌧️', text: 'Đang mưa!', mult: 1.25 };
    }
    const h = new Date().getHours();
    const weathers = [
      { icon: '☀️', text: 'Nắng đẹp', mult: 1.1 },
      { icon: '🌤️', text: 'Nắng nhẹ', mult: 1.05 },
      { icon: '⛅', text: 'Ít mây', mult: 1.0 },
      { icon: '🌦️', text: 'Có mưa rào', mult: 1.08 },
      { icon: '🌈', text: 'Sau mưa', mult: 1.12 }
    ];
    return weathers[h % weathers.length];
  },

  
  
  ensureNextRainAt() {
    const now = (typeof nowMs === 'function' ? nowMs() : Date.now());
    const interval = this.RAIN_INTERVAL_MS || (30 * 60 * 1000);
    let next = Number(this.nextRainAt) || 0;
    if (currentPlayer && currentPlayer.nextRainAt) {
      const pNext = Number(currentPlayer.nextRainAt) || 0;
      if (pNext > 0 && (next <= 0 || Math.abs(pNext - next) > 1000)) {
        // Ưu tiên lịch đã lưu trên player (đồng bộ phiên)
        next = pNext;
      }
    }
    // Chưa có lịch → hẹn đúng 30 phút tới
    if (!next || next <= 0) {
      next = now + interval;
    }
    // Lịch cũ bị cộng nhầm 60p (bug) hoặc xa hơn 1 chu kỳ → kẹp còn tối đa 30 phút
    if (next > now + interval) {
      next = now + interval;
    }
    // Quá hạn quá lâu (hơn 1 chu kỳ) → đẩy lịch sang chu kỳ tiếp theo thay vì mưa ngay mỗi lần vào web
    // Offline catch-up vẫn xử lý trận mưa đã bỏ lỡ trong simulateOffline
    if (next <= now - interval) {
      next = now + interval;
    } else if (next <= now) {
      // Vừa quá hạn (trong vòng 30p) → giữ next để tryTriggerRain có thể mưa 1 lần
      // (không reset để tránh bỏ lỡ trận đúng giờ)
    }
    this.nextRainAt = next;
    if (currentPlayer) currentPlayer.nextRainAt = next;
    return next;
  },

  /**
   * Đặt mốc mưa tiếp theo = fromMs + 30 phút.
   * fromMs = thời điểm bắt đầu tính chu kỳ (thường = lúc bắt đầu trận mưa hiện tại).
   */
  scheduleNextRain(fromMs) {
    const interval = this.RAIN_INTERVAL_MS || (30 * 60 * 1000);
    const base = (typeof fromMs === 'number' && fromMs > 0)
      ? fromMs
      : (typeof nowMs === 'function' ? nowMs() : Date.now());
    const next = base + interval;
    this.nextRainAt = next;
    if (currentPlayer) currentPlayer.nextRainAt = next;
    return next;
  },

  getRainRemainingSec() {
    const now = (typeof nowMs === 'function' ? nowMs() : Date.now());
    if (this.raining && this.rainUntil > now) {
      return Math.max(0, Math.ceil((this.rainUntil - now) / 1000));
    }
    const next = this.ensureNextRainAt();
    return Math.max(0, Math.ceil((next - now) / 1000));
  },

  tryTriggerRain() {
    if (this.raining && (typeof nowMs==="function"?nowMs():Date.now()) < this.rainUntil) return false;
    const now = (typeof nowMs === 'function' ? nowMs() : Date.now());
    const next = this.ensureNextRainAt();
    if (now >= next) {
      this.startRain();
      return true;
    }
    return false;
  },

  
  getRainDurationMs() {
    let mins = (currentSettings && currentSettings.rainDurationMinutes) != null
      ? Number(currentSettings.rainDurationMinutes)
      : 0.25;
    if (!Number.isFinite(mins) || mins <= 0) mins = 0.25;
    
    mins = Math.max(5 / 60, Math.min(120, mins));
    return Math.round(mins * 60 * 1000);
  },

  startRain() {
    this.raining = true;
    const durationMs = this.getRainDurationMs();
    const now = (typeof nowMs === 'function' ? nowMs() : Date.now());
    this.rainUntil = now + durationMs;
    // Chu kỳ đúng 30 phút kể từ lúc bắt đầu trận mưa (không cộng thêm 1 lần nữa)
    // nextRainAt = now + 30p; nếu trận mưa kéo dài hơn 30p thì next = rainUntil
    {
      const interval = this.RAIN_INTERVAL_MS || (30 * 60 * 1000);
      const next = Math.max(this.rainUntil, now + interval);
      this.nextRainAt = next;
      if (currentPlayer) currentPlayer.nextRainAt = next;
    }
    this.rainCollectCount = 0;
    let wateredN = 0;
    let autoCollectN = 0;
    let autoCoins = 0;
    let autoSeeds = 0;
    const fairyOn = this.isFairyActive();
    const fairyCollect = fairyOn && this.getFairyConfig().collectRain !== false;
    const fairyName = fairyOn
      ? ((this.getFairyDisplayName && this.getFairyDisplayName()) || 'Tiên')
      : '';
    const fairyEmoji = fairyOn
      ? ((this.getFairyEmoji && this.getFairyEmoji()) || '🧚')
      : '';

    if (currentPlayer) {
      this.ensureGardens();
      
      this.forEachGarden((plots, gi) => {
        if (!Array.isArray(plots)) return;
        const fairyHere = fairyOn && this.isFairyGardenEnabled(gi);
        plots.forEach((plot) => {
          if (!plot || !plot.plantId || !plot.plantedAt) return;
          if (!this.isReady(plot)) {
            const remain = this.getRemainingSeconds(plot);
            const cut = Math.floor(remain * 0.12);
            if (cut > 0) plot.plantedAt -= cut * 1000;
          }
          if (fairyHere) {
            plot.watered = true;
            plot.waterCount = 3;
            plot.lastWatered = now;
            wateredN++;
          }
        });
      });

      
      const robotSeedMap = {};
      if (fairyCollect) {
        if (!currentPlayer.inventory) currentPlayer.inventory = { seeds: {}, harvest: {}, fertilizers: {} };
        if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
        const plantsPool = (this.getPlants() || []).filter(p => p && p.id && this.isPlantAvailable && this.isPlantAvailable(p));
        const pool = plantsPool.length ? plantsPool : (this.getPlants() || []).filter(p => p && p.id);
        // 4–7 lần nhặt; ưu tiên hạt (~70%), còn lại xu — đảm bảo ≥1 hạt nếu có danh sách cây
        const n = 4 + Math.floor(Math.random() * 4);
        let seedHits = 0;
        for (let i = 0; i < n; i++) {
          const wantSeed = pool.length && (Math.random() < 0.7 || (i === n - 1 && seedHits === 0));
          if (!wantSeed) {
            const coins = 5 + Math.floor(Math.random() * 11);
            currentPlayer.coins = (currentPlayer.coins || 0) + coins;
            autoCoins += coins;
          } else {
            const plant = pool[Math.floor(Math.random() * pool.length)];
            currentPlayer.inventory.seeds[plant.id] = (currentPlayer.inventory.seeds[plant.id] || 0) + 1;
            autoSeeds++;
            seedHits++;
            robotSeedMap[plant.id] = (robotSeedMap[plant.id] || 0) + 1;
          }
          autoCollectN++;
        }
        this.rainCollectCount = Math.min(8, (this.rainCollectCount || 0) + autoCollectN);
        currentPlayer.rainedCollectOnce = true;
        // Ghi log Tiên nhặt hạt mưa (trước đây thiếu → log Tiên = 0 dù robot mua được)
        try {
          if (autoSeeds > 0) this.trackDayStat('fairy_rain_seed', { qty: autoSeeds });
          if (autoCoins > 0) { /* xu mưa — không bắt buộc log riêng */ }
        } catch (_) {}
      }
      // Người máy: chỉ mua thêm khi Tiên nhặt hạt; luôn ghép kho (không mua hạt shop)
      if (this.isRobotActive && this.isRobotActive()) {
        try {
          const hasFairySeeds = robotSeedMap && Object.keys(robotSeedMap).length > 0;
          const p = hasFairySeeds
            ? this.robotAfterRainCollect(robotSeedMap)
            : this.robotMergeAllBag({ silent: true });
          if (p && typeof p.then === 'function') {
            p.then((rr) => {
              // robotMergeAllBag đã trackDayStat robot_merge (kể cả silent)
              if (rr && (rr.bought > 0 || rr.starOk || rr.mythOk || rr.starDid || rr.mythDid) && typeof showToast === 'function') {
                let tip = (this.getRobotDisplayName() || 'Người máy');
                if (rr.bought > 0) tip += ' mua (Tiên nhặt) +' + rr.bought.toLocaleString() + ' hạt';
                if (rr.starDid) tip += ' · +' + rr.starDid.toLocaleString() + ' hạt sao';
                else if (rr.starOk) tip += ' · ghép sao';
                if (rr.mythDid) tip += ' · +' + rr.mythDid.toLocaleString() + ' hạt HT';
                else if (rr.mythOk) tip += ' · ghép HT';
                showToast(tip, 'success');
              }
              if (typeof updateCoins === 'function') updateCoins();
              if (typeof savePlayer === 'function') savePlayer();
            }).catch(() => {});
          }
        } catch (_) {}
      }
      
      let actMsg = fairyOn
        ? `Mưa · ${fairyEmoji} ${fairyName} tưới khi mưa: ${wateredN} ô`
        : `Mưa bắt đầu (${Math.round(durationMs / 1000)}s)`;
      if (autoCollectN > 0) {
        actMsg += ` · nhặt ${autoCollectN} vật phẩm`;
        if (autoCoins) actMsg += ` (+${autoCoins}🪙)`;
        if (autoSeeds) actMsg += ` (+${autoSeeds} hạt)`;
      }
      this.trackDayStat('rain', { count: 1 });
      this.addActivity(actMsg, { type: fairyOn ? 'fairy_rain' : 'rain', at: now });
      if (fairyOn && wateredN > 0 && typeof Features !== 'undefined' && Features.trackQuest) {
        try { Features.trackQuest('water', wateredN * 3); } catch (_) {}
      }
      if (typeof savePlayer === 'function') savePlayer();
      if (typeof updateCoins === 'function') updateCoins();
      if (typeof renderGarden === 'function') {
        try { renderGarden(); } catch (_) {}
      }
      if (typeof renderActivityPage === 'function') {
        try { renderActivityPage(); } catch (_) {}
      }
    }
    if (typeof showRainEffect === 'function') showRainEffect();
    let tip = fairyOn
      ? `🌧️ Mưa + ${fairyEmoji} ${fairyName} tưới ${wateredN} ô!`
      : '🌧️ Mưa rồi! Chạm sâu / hạt rơi để nhặt thưởng!';
    if (autoCollectN > 0) tip += ` Nhặt ${autoCollectN} vật phẩm.`;
    if (typeof showToast === 'function') showToast(tip, 'success');
    setTimeout(() => {
      this.raining = false;
      if (typeof hideRainEffect === 'function') hideRainEffect();
    }, durationMs);
  },

  
  async collectRainItem(kind) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    if (!this.raining || (typeof nowMs==="function"?nowMs():Date.now()) >= this.rainUntil) {
      return { ok: false, msg: 'Mưa đã tạnh!' };
    }
    this.rainCollectCount = (this.rainCollectCount || 0) + 1;
    if (this.rainCollectCount > 8) {
      return { ok: false, msg: 'Đã nhặt hết trong trận mưa này!' };
    }
    currentPlayer.rainedCollectOnce = true;
    let msg = '';
    if (kind === 'bug') {
      const coins = 5 + Math.floor(Math.random() * 11); 
      currentPlayer.coins = (currentPlayer.coins || 0) + coins;
      this.addActivity(`Bắt sâu khi mưa +${coins}🪙`);
      msg = `🐛 +${coins}🪙`;
    } else {
      const plants = (this.getPlants() || []).filter(p => p && p.id);
      if (!plants.length) {
        const coins = 8;
        currentPlayer.coins = (currentPlayer.coins || 0) + coins;
        msg = `✨ +${coins}🪙`;
      } else {
        const plant = plants[Math.floor(Math.random() * plants.length)];
        if (!currentPlayer.inventory) currentPlayer.inventory = { seeds: {}, harvest: {}, fertilizers: {} };
        if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
        currentPlayer.inventory.seeds[plant.id] = (currentPlayer.inventory.seeds[plant.id] || 0) + 1;
        this.trackDayStat('fairy_rain_seed', { qty: 1 });
        this.addActivity(`Nhặt hạt rơi: ${plant.name}`);
        msg = `🌱 +1 ${plant.name}`;
      }
    }
    const ach = this.checkAchievements();
    await savePlayer();
    this.notifyAchievements(ach);
    if (typeof updateCoins === 'function') updateCoins();
    return { ok: true, msg };
  },

  
  async publishPublicGarden() {
    if (!currentUser || !currentPlayer) return;
    try {
      const plots = (Array.isArray(currentPlayer.plots) ? currentPlayer.plots : Object.values(currentPlayer.plots || {}))
        .map((p, i) => ({
          id: i,
          plantId: p.plantId || null,
          plantedAt: p.plantedAt || null,
          waterCount: p.waterCount || 0,
          lastWatered: p.lastWatered || null,
          fertilizerId: p.fertilizerId || null,
          fertilizedAt: p.fertilizedAt || null
        }));
      await db.ref('publicGardens/' + currentUser.uid).set({
        uid: currentUser.uid,
        name: currentPlayer.displayName || (currentPlayer.email || currentUser.email || 'Player').split('@')[0],
        level: currentPlayer.level || 1,
        plotCount: plots.length,
        plots,
        updatedAt: (typeof nowMs==="function"?nowMs():Date.now())
      });
    } catch (e) {
      console.warn('publicGarden', e);
    }
  },

  



  async helpWaterFriend(friendUid) {
    if (!currentUser || !currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    if (!friendUid || friendUid === currentUser.uid) return { ok: false, msg: 'Không hợp lệ!' };
    const today = (typeof gameDateString === 'function') ? gameDateString() : new Date().toDateString();
    if (!currentPlayer.helpWaterLog) currentPlayer.helpWaterLog = {};
    if (currentPlayer.helpWaterLog[friendUid] === today) {
      return { ok: false, msg: 'Hôm nay bạn đã tưới giúp người này rồi!' };
    }
    try {
      await db.ref('gardenHelps/' + friendUid + '/' + currentUser.uid).set({
        from: currentUser.uid,
        fromName: currentPlayer.displayName || (currentPlayer.email || '').split('@')[0] || 'Bạn',
        at: (typeof nowMs==="function"?nowMs():Date.now()),
        day: today
      });
    } catch (e) {
      return { ok: false, msg: 'Lỗi gửi tưới giúp (cập nhật Firebase Rules?). ' + (e.message || '') };
    }
    currentPlayer.helpWaterLog[friendUid] = today;
    currentPlayer.helpedFriendOnce = true;
    const coins = 12;
    const xp = 3;
    currentPlayer.coins = (currentPlayer.coins || 0) + coins;
    this.addXp(xp);
    this.addActivity(`Tưới giúp bạn +${coins}🪙 +${xp} XP`);
    const ach = this.checkAchievements();
    await savePlayer();
    this.notifyAchievements(ach);
    if (typeof updateCoins === 'function') updateCoins();
    return { ok: true, msg: `Đã tưới giúp! +${coins}🪙 +${xp} XP` };
  },

  
  async applyPendingHelps() {
    if (!currentUser || !currentPlayer || !currentPlayer.plots) return;
    try {
      const snap = await db.ref('gardenHelps/' + currentUser.uid).once('value');
      const helps = snap.val();
      if (!helps) return;
      let applied = 0;
      const names = [];
      for (const fromUid of Object.keys(helps)) {
        const h = helps[fromUid];
        
        const plot = currentPlayer.plots.find(p =>
          p && p.plantId && !this.isReady(p) && (p.waterCount || 0) < 3
        );
        if (plot) {
          plot.waterCount = (plot.waterCount || 0) + 1;
          plot.watered = true;
          plot.lastWatered = (typeof nowMs==="function"?nowMs():Date.now());
          applied++;
          if (h.fromName) names.push(h.fromName);
        }
        await db.ref('gardenHelps/' + currentUser.uid + '/' + fromUid).remove();
      }
      if (applied > 0) {
        this.addActivity(`Nhận ${applied} lượt tưới giúp` + (names.length ? ` từ ${names.slice(0, 3).join(', ')}` : ''));
        if (typeof showToast === 'function') {
          showToast(`💧 Bạn bè đã tưới giúp ${applied} ô!`, 'success');
        }
      }
    } catch (e) {
      console.warn('applyPendingHelps', e);
    }
  },

  getEffectiveGrowTime(plot, atMs) {
    if (!plot || !plot.plantId) return 9999;
    const plant = this.getPlant(plot.plantId);
    // Fallback: dùng baseGrowTime lưu trên ô (tránh offline 0 vụ khi định nghĩa cây custom chưa load / lệch id)
    let t = (plant && Number(plant.growTime) > 0)
      ? Number(plant.growTime)
      : (Number(plot.baseGrowTime) > 0 ? Number(plot.baseGrowTime) : 0);
    if (!(t > 0)) {
      // Cây custom mất định nghĩa — không trả 9999 (sẽ làm offline luôn 0 vụ)
      // Dùng 600s mặc định an toàn thay vì bỏ sót hoàn toàn
      t = 600;
    }

    const waterBonus = Math.min(plot.waterCount || 0, 3) * 0.12;
    t *= (1 - waterBonus);

    if (plot.fertilizerId) {
      const fert = this.getFertilizer(plot.fertilizerId);
      if (fert) t *= (1 - (fert.timeReduce || 0));
    }

    const weather = this.getWeather();
    if (weather && weather.mult > 0) t /= weather.mult;

    const sm = this.getPlotSpeedMult(plot, atMs);
    if (sm > 1) t /= sm;

    return Math.max(20, t);
  },

  
  getStageThresholds(plot) {
    const plant = this.getPlant(plot.plantId);
    const effective = this.getEffectiveGrowTime(plot);
    if (plant && Array.isArray(plant.growStages) && plant.growStages.length >= 4) {
      const baseTotal = plant.growStages[3] || plant.growTime || effective;
      const ratio = effective / baseTotal;
      return plant.growStages.map(t => Math.max(1, t * ratio));
    }
    
    const total = effective;
    const t1 = Math.max(60, total * 0.25);
    const t2 = Math.max(t1 + 60, total * 0.50);
    const t3 = Math.max(t2 + 60, total * 0.75);
    const t4 = total;
    return [t1, t2, t3, t4];
  },

  getElapsedEffective(plot) {
    if (!plot || !plot.plantId || !plot.plantedAt) return 0;
    const plantedAt = this.toMs(plot.plantedAt);
    if (!Number.isFinite(plantedAt) || plantedAt <= 0) return 0;
    return Math.max(0, ((typeof nowMs === 'function' ? nowMs() : Date.now()) - plantedAt) / 1000);
  },

  getProgress(plot) {
    if (!plot || !plot.plantId || !plot.plantedAt) return 0;
    const elapsed = this.getElapsedEffective(plot);
    const total = this.getEffectiveGrowTime(plot);
    return Math.min(100, Math.floor((elapsed / total) * 100));
  },

  getRemainingSeconds(plot) {
    if (!plot || !plot.plantId || !plot.plantedAt) return 0;
    const elapsed = this.getElapsedEffective(plot);
    const total = this.getEffectiveGrowTime(plot);
    return Math.max(0, Math.ceil(total - elapsed));
  },

  formatTime(sec) {
    const n = Math.max(0, Math.floor(Number(sec) || 0));
    const h = Math.floor(n / 3600);
    const m = Math.floor((n % 3600) / 60);
    const s = n % 60;
    const pad2 = (x) => String(x).padStart(2, '0');
    
    if (h > 0) return `${h}h ${pad2(m)}m ${pad2(s)}s`;
    if (m > 0) return `${pad2(m)}m ${pad2(s)}s`;
    return `${pad2(s)}s`;
  },

  getStage(plot) {
    if (!plot || !plot.plantId) {
      return { key: 'empty', icon: '🟫', label: 'Trống', idx: -1 };
    }
    const plant = this.getPlant(plot.plantId);
    const elapsed = this.getElapsedEffective(plot);
    const [t1, t2, t3, t4] = this.getStageThresholds(plot);
    const ready = elapsed >= t4;

    if (ready) {
      return { key: 'ready', icon: plant ? plant.icon : '✨', label: 'Sẵn sàng', idx: 4 };
    }
    if (elapsed >= t3) {
      return { key: 'almost', icon: '🌾', label: 'Sắp chín', idx: 3 };
    }
    if (elapsed >= t2) {
      return { key: 'growing', icon: '🌿', label: 'Đang lớn', idx: 2 };
    }
    if (elapsed >= t1) {
      return { key: 'seedling', icon: '🌱', label: 'Mầm / Cây non', idx: 1 };
    }
    return { key: 'seed', icon: '🫘', label: 'Hạt giống', idx: 0 };
  },

  isReady(plot) {
    if (!plot || !plot.plantId || !plot.plantedAt) return false;
    const plantedAt = Number(plot.plantedAt);
    if (!Number.isFinite(plantedAt) || plantedAt <= 0) return false;
    const elapsed = Math.max(0, ((typeof nowMs === 'function' ? nowMs() : Date.now()) - plantedAt) / 1000);
    return elapsed + 0.05 >= this.getEffectiveGrowTime(plot);
  },

  xpForLevel(level) { return level * 50; },

  addXp(amount) {
    if (!currentPlayer) return;
    const MAX_LV = 10000;
    if ((currentPlayer.level || 1) >= MAX_LV) {
      currentPlayer.level = MAX_LV;
      return;
    }
    const xpBefore = currentPlayer.xp || 0;
    const levelBefore = currentPlayer.level || 1;
    currentPlayer.xp = xpBefore + amount;
    if (amount) {
      this.pushGameEvent({
        action: 'xp',
        actor: 'system',
        category: 'level',
        quantity: amount,
        xp: amount,
        summaryText: '⭐ +' + Number(amount).toLocaleString() + ' XP',
        detail: { before: { xp: xpBefore, level: levelBefore }, after: { xp: currentPlayer.xp, level: currentPlayer.level } },
        result: { xp: amount }
      });
    }
    while (currentPlayer.xp >= this.xpForLevel(currentPlayer.level || 1) && (currentPlayer.level || 1) < MAX_LV) {
      currentPlayer.xp -= this.xpForLevel(currentPlayer.level || 1);
      const fromLv = currentPlayer.level || 1;
      currentPlayer.level = fromLv + 1;
      currentPlayer.coins += 100 * currentPlayer.level;
      this.trackDayStat('levelup', { level: currentPlayer.level });
      this.pushGameEvent({
        action: 'level_up',
        actor: 'system',
        category: 'level',
        summaryText: '⬆️ Lên cấp Lv ' + fromLv + ' → Lv ' + currentPlayer.level,
        detail: { from: fromLv, to: currentPlayer.level, coinsGain: 100 * currentPlayer.level },
        before: { level: fromLv },
        after: { level: currentPlayer.level },
        coins: 100 * currentPlayer.level,
        result: { currency: 100 * currentPlayer.level }
      });
    }
  },

  
  isPlantLimited(plant) {
    if (!plant) return false;
    if (plant.limited) return true;
    if (Array.isArray(plant.availableMonths) && plant.availableMonths.length) return true;
    if (plant.availableFrom || plant.availableTo) return true;
    return false;
  },

  isPlantAvailable(plant) {
    if (!plant) return false;
    if (!this.isPlantLimited(plant)) return true;
    const now = (typeof nowMs==="function"?nowMs():Date.now());
    if (plant.availableFrom && now < Number(plant.availableFrom)) return false;
    if (plant.availableTo && now > Number(plant.availableTo)) return false;
    const months = plant.availableMonths;
    if (months && months.length) {
      const m = new Date().getMonth() + 1;
      return months.includes(Number(m));
    }
    return true;
  },

  getLimitedEventLabel(plant) {
    if (!this.isPlantLimited(plant)) return '';
    if (plant.availableTo) {
      const left = Math.max(0, Number(plant.availableTo) - (typeof nowMs==="function"?nowMs():Date.now()));
      if (left <= 0) return 'Hết sự kiện';
      return 'Còn ' + this.formatTime(Math.ceil(left / 1000));
    }
    const months = plant.availableMonths;
    if (months && months.length) return 'Tháng ' + months.join(', ');
    return 'Limited';
  },

  unlockCollection(plantId) {
    if (!currentPlayer || !plantId) return;
    if (!currentPlayer.collection) currentPlayer.collection = {};
    if (!currentPlayer.collection[plantId]) {
      currentPlayer.collection[plantId] = { at: (typeof nowMs==="function"?nowMs():Date.now()) };
      return true;
    }
    return false;
  },

  collectionCount() {
    if (!currentPlayer || !currentPlayer.collection) return 0;
    return Object.keys(currentPlayer.collection).length;
  },

  collectionPercent() {
    const total = (this.getPlants() || []).length || 1;
    return Math.min(100, Math.round((this.collectionCount() / total) * 100));
  },

  getAchievementsDef() {
    return [
      { id: 'first_plant', name: 'Người gieo hạt', desc: 'Trồng cây lần đầu', icon: '🌱', check: p => (p.stats && p.stats.planted) >= 1, reward: { coins: 30, xp: 5 } },
      { id: 'first_harvest', name: 'Mùa màng đầu', desc: 'Thu hoạch lần đầu', icon: '🧺', check: p => (p.stats && p.stats.harvested) >= 1, reward: { coins: 50, xp: 8 } },
      { id: 'harvest_50', name: 'Nông dân chăm chỉ', desc: 'Thu hoạch tổng 50 sản phẩm', icon: '🌾', check: p => (p.stats && p.stats.harvested) >= 50, reward: { coins: 120, xp: 15 } },
      { id: 'harvest_200', name: 'Đại gia nông sản', desc: 'Thu hoạch tổng 200 sản phẩm', icon: '🏆', check: p => (p.stats && p.stats.harvested) >= 200, reward: { coins: 400, xp: 40 } },
      { id: 'full_garden', name: 'Vườn ken đặc', desc: 'Có ít nhất 12 ô đang trồng', icon: '🌳', check: p => (p.plots || []).filter(x => x && x.plantId).length >= 12, reward: { coins: 100, xp: 12 } },
      { id: 'level_5', name: 'Tài năng vườn', desc: 'Đạt cấp 5', icon: '⭐', check: p => (p.level || 1) >= 5, reward: { coins: 150, xp: 0 } },
      { id: 'level_10', name: 'Bậc thầy vườn', desc: 'Đạt cấp 10', icon: '🌟', check: p => (p.level || 1) >= 10, reward: { coins: 400, xp: 0 } },
      { id: 'collect_10', name: 'Sưu tầm viên', desc: 'Mở khóa 10 loại trong album', icon: '📖', check: p => Object.keys(p.collection || {}).length >= 10, reward: { coins: 80, xp: 10 } },
      { id: 'collect_50', name: 'Nhà sưu tầm', desc: 'Mở khóa 50 loại trong album', icon: '📚', check: p => Object.keys(p.collection || {}).length >= 50, reward: { coins: 300, xp: 30 } },
      { id: 'collect_100', name: 'Bách khoa thực vật', desc: 'Mở khóa 100 loại', icon: '🏅', check: p => Object.keys(p.collection || {}).length >= 100, reward: { coins: 800, xp: 80 } },
      { id: 'chat_streak_3', name: 'Bạn thân', desc: 'Chat streak 3 ngày với một người', icon: '💬', check: p => (p.maxChatStreak || 0) >= 3, reward: { coins: 60, xp: 8 } },
      { id: 'chat_streak_7', name: 'Gắn bó tuần', desc: 'Chat streak 7 ngày', icon: '🔥', check: p => (p.maxChatStreak || 0) >= 7, reward: { coins: 200, xp: 20 } },
      { id: 'help_friend', name: 'Hàng xóm tốt', desc: 'Tưới giúp bạn bè 1 lần', icon: '💧', check: p => !!p.helpedFriendOnce, reward: { coins: 40, xp: 5 } },
      { id: 'rain_play', name: 'Đùa với mưa', desc: 'Nhặt vật phẩm khi mưa', icon: '🌧️', check: p => !!p.rainedCollectOnce, reward: { coins: 40, xp: 5 } },
      { id: 'rich_5k', name: 'Túi tiền đầy', desc: 'Sở hữu ít nhất 5000 coin', icon: '💰', check: p => (p.coins || 0) >= 5000, reward: { coins: 100, xp: 10 } }
    ];
  },

  checkAchievements() {
    if (!currentPlayer) return [];
    if (!currentPlayer.achievements) currentPlayer.achievements = {};
    const unlocked = [];
    this.getAchievementsDef().forEach(a => {
      if (currentPlayer.achievements[a.id]) return;
      try {
        if (a.check(currentPlayer)) {
          currentPlayer.achievements[a.id] = (typeof nowMs==="function"?nowMs():Date.now());
          const coins = (a.reward && a.reward.coins) || 0;
          const xp = (a.reward && a.reward.xp) || 0;
          if (coins) currentPlayer.coins = (currentPlayer.coins || 0) + coins;
          if (xp) this.addXp(xp);
          this.addActivity(`🏅 Thành tựu: ${a.name}` + (coins ? ` +${coins}🪙` : ''));
          unlocked.push(a);
        }
      } catch (_) {}
    });
    return unlocked;
  },

  notifyAchievements(list) {
    if (!list || !list.length) return;
    if (typeof showToast === 'function') {
      list.forEach(a => showToast(`🏅 ${a.name}: ${a.desc}`, 'success'));
    }
  },

  // 0 = không giới hạn số lượng / lần (chỉ giới hạn bởi số xu)
  BUY_MAX_QTY: 0,

  // Chặn double-tap / ghost click làm mua 2 lần
  _buyLock: false,

  async buySeed(plantId, qty = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    if (this._buyLock) return { ok: false, msg: 'Đang xử lý mua hàng…' };
    const plant = this.getPlant(plantId);
    if (!plant) return { ok: false, msg: 'Không tìm thấy cây!' };
    if (!this.isPlantAvailable(plant)) {
      return { ok: false, msg: 'Hạt Limited — ngoài thời gian sự kiện!' };
    }
    const price = Math.max(0, Number(plant.seedPrice) || 0);
    if (qty === 'all' || qty === 'max') {
      qty = price > 0 ? Math.floor((Number(currentPlayer.coins) || 0) / price) : 1;
    } else {
      qty = Math.max(1, Math.floor(Number(qty) || 1));
    }
    if (!Number.isFinite(qty) || qty < 1) qty = 1;
    const buyMax = this.BUY_MAX_QTY || 0;
    if (buyMax > 0 && qty > buyMax) qty = buyMax;
    // Không vượt quá số xu hiện có
    if (price > 0 && !this.isUnlimitedResources()) {
      const maxAfford = Math.floor((Number(currentPlayer.coins) || 0) / price);
      if (maxAfford < 1) return { ok: false, msg: 'Không đủ tiền!' };
      if (qty > maxAfford) qty = maxAfford;
    }
    const cost = price * qty;
    this._buyLock = true;
    try {
      if (!this.chargeCoins(cost)) return { ok: false, msg: 'Không đủ tiền!' };
      if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
      currentPlayer.inventory.seeds[plantId] = (currentPlayer.inventory.seeds[plantId] || 0) + qty;
      this.addActivity(this.isUnlimitedResources()
        ? `Mua ${qty} hạt ${plant.name} (unlimited)`
        : `Mua ${qty} hạt ${plant.name} (-${cost.toLocaleString()}🪙)`);
      if (typeof Features !== 'undefined') Features.trackQuest('buySeed', qty);
      await savePlayer();
      return { ok: true, msg: `Đã mua ${qty.toLocaleString()} hạt ${plant.name}!` };
    } finally {
      this._buyLock = false;
    }
  },

  async buyFertilizer(fertId, qty = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    if (this._buyLock) return { ok: false, msg: 'Đang xử lý mua hàng…' };
    const fert = this.getFertilizer(fertId);
    if (!fert) return { ok: false, msg: 'Không tìm thấy phân bón!' };
    const price = Math.max(0, Number(fert.price) || 0);
    if (qty === 'all' || qty === 'max') {
      qty = price > 0 ? Math.floor((Number(currentPlayer.coins) || 0) / price) : 1;
    } else {
      qty = Math.max(1, Math.floor(Number(qty) || 1));
    }
    if (!Number.isFinite(qty) || qty < 1) qty = 1;
    const buyMax = this.BUY_MAX_QTY || 0;
    if (buyMax > 0 && qty > buyMax) qty = buyMax;
    if (price > 0 && !this.isUnlimitedResources()) {
      const maxAfford = Math.floor((Number(currentPlayer.coins) || 0) / price);
      if (maxAfford < 1) return { ok: false, msg: 'Không đủ tiền!' };
      if (qty > maxAfford) qty = maxAfford;
    }
    const cost = price * qty;
    this._buyLock = true;
    try {
      if (!this.chargeCoins(cost)) return { ok: false, msg: 'Không đủ tiền!' };
      if (!currentPlayer.inventory.fertilizers) currentPlayer.inventory.fertilizers = {};
      currentPlayer.inventory.fertilizers[fertId] = (currentPlayer.inventory.fertilizers[fertId] || 0) + qty;
      this.addActivity(this.isUnlimitedResources()
        ? `Mua ${qty} ${fert.name} (unlimited)`
        : `Mua ${qty} ${fert.name} (-${cost.toLocaleString()}🪙)`);
      await savePlayer();
      return { ok: true, msg: `Đã mua ${qty.toLocaleString()} ${fert.name}!` };
    } finally {
      this._buyLock = false;
    }
  },

  async plantSeed(plotId, plantId, preferredKind) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plot = currentPlayer.plots[plotId];
    if (!plot) return { ok: false, msg: 'Ô đất không tồn tại!' };
    if (plot.plantId) return { ok: false, msg: 'Ô đất đã có cây!' };
    const unlimited = this.isUnlimitedResources();
    if (!currentPlayer.inventory.seedsMyth) currentPlayer.inventory.seedsMyth = {};
    const normal = (currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[plantId]) || 0;
    const star = (currentPlayer.inventory.seedsStar && currentPlayer.inventory.seedsStar[plantId]) || 0;
    const myth = (currentPlayer.inventory.seedsMyth && currentPlayer.inventory.seedsMyth[plantId]) || 0;
    let usedStar = false;
    let usedMyth = false;
    if (preferredKind === 'myth') {
      if (!unlimited && myth < 1) return { ok: false, msg: 'Không đủ hạt huyền thoại!' };
      usedMyth = true;
      usedStar = true;
      if (!unlimited) {
        currentPlayer.inventory.seedsMyth[plantId]--;
        if (currentPlayer.inventory.seedsMyth[plantId] <= 0) delete currentPlayer.inventory.seedsMyth[plantId];
      }
    } else if (preferredKind === 'star') {
      if (!unlimited && star < 1) return { ok: false, msg: 'Không đủ hạt sao!' };
      usedStar = true;
      if (!unlimited) {
        currentPlayer.inventory.seedsStar[plantId]--;
        if (currentPlayer.inventory.seedsStar[plantId] <= 0) delete currentPlayer.inventory.seedsStar[plantId];
      }
    } else if (preferredKind === 'normal') {
      if (!unlimited && normal < 1) return { ok: false, msg: 'Không đủ hạt thường!' };
      if (!unlimited) {
        currentPlayer.inventory.seeds[plantId]--;
        if (currentPlayer.inventory.seeds[plantId] <= 0) delete currentPlayer.inventory.seeds[plantId];
      }
    } else {
      if (!unlimited && normal + star < 1) return { ok: false, msg: 'Không đủ hạt giống!' };
      if (star > 0 || (unlimited && preferredKind !== 'normal')) {
        usedStar = star > 0;
        if (unlimited && star < 1 && preferredKind === 'star') usedStar = true;
        if (!unlimited && star > 0) {
          currentPlayer.inventory.seedsStar[plantId]--;
          if (currentPlayer.inventory.seedsStar[plantId] <= 0) delete currentPlayer.inventory.seedsStar[plantId];
          usedStar = true;
        } else if (!unlimited) {
          currentPlayer.inventory.seeds[plantId]--;
          if (currentPlayer.inventory.seeds[plantId] <= 0) delete currentPlayer.inventory.seeds[plantId];
        } else if (star > 0) {
          usedStar = true;
        }
      }
    }
    plot.plantId = plantId;
    plot.plantedAt = (typeof nowMs==="function"?nowMs():Date.now());
    plot.watered = false;
    plot.waterCount = 0;
    plot.lastWatered = null;
    plot.fertilizerId = null;
    plot.fertilizedAt = null;
    plot.seedStar = usedStar || usedMyth;
    plot.seedMyth = usedMyth;
    {
      const plDef = this.getPlant(plantId);
      plot.baseGrowTime = (plDef && Number(plDef.growTime) > 0) ? Number(plDef.growTime) : (Number(plot.baseGrowTime) || 0);
    }
    
    let fairyWatered = false;
    if (this.isFairyActive() && (plot.waterCount || 0) < 3) {
      plot.waterCount = 3;
      plot.watered = true;
      plot.lastWatered = (typeof nowMs==="function"?nowMs():Date.now());
      fairyWatered = true;
      if (typeof Features !== 'undefined' && Features.trackQuest) Features.trackQuest('water', 3);
    }
    currentPlayer.stats.planted = (currentPlayer.stats.planted || 0) + 1;
    const plant = this.getPlant(plantId);
    const _pTag = usedMyth ? '✨ ' : (usedStar ? '⭐ ' : '');
    this.trackDayStat('plant', { plots: 1, actions: 1, gardenIndex: currentPlayer.activeGarden || 0, name: plant.name || plantId, plotId });
    if (fairyWatered) this.trackDayStat('fairy_water', { actions: 1, gardenIndex: currentPlayer.activeGarden || 0 });
    this.pushGameEvent({
      action: 'plant',
      actor: 'player',
      category: 'garden',
      target: { type: 'crop', id: plantId, name: (_pTag || '') + (plant.name || plantId) },
      quantity: 1,
      cellId: plotId,
      gardenIndex: currentPlayer.activeGarden || 0,
      plantId,
      plantedAt: plot.plantedAt,
      readyAt: (typeof this.getReadyAtMs === 'function') ? this.getReadyAtMs(plot) : null,
      summaryText: '🌱 Trồng ' + _pTag + plant.name + ' tại ô #' + (plotId + 1) + (fairyWatered ? ' · Tiên tưới ngay' : ''),
      detail: { seedKind: usedMyth ? 'myth' : (usedStar ? 'star' : 'normal'), fairyWatered: !!fairyWatered, waterCount: plot.waterCount || 0 }
    });
    if (fairyWatered) {
      this.pushGameEvent({
        action: 'fairy_water',
        actor: 'fairy',
        category: 'fairy',
        target: { type: 'crop', id: plantId, name: plant.name },
        cellId: plotId,
        gardenIndex: currentPlayer.activeGarden || 0,
        quantity: 1,
        summaryText: '🧚 Tiên tưới ô #' + (plotId + 1) + ' · ' + plant.name
      });
    }
    if (typeof renderActivityPage === 'function') {
      try {
        const page = document.getElementById('page-activity');
        if (page && page.classList.contains('active')) renderActivityPage();
      } catch (_) {}
    }
    if (typeof Features !== 'undefined') Features.trackQuest('plant', 1);
    if (typeof recordGameEvent === 'function') {
      recordGameEvent('plant', {
        plotId,
        gardenIndex: currentPlayer.activeGarden || 0,
        plantId,
        plantedAt: plot.plantedAt,
        seedKind: usedMyth ? 'myth' : (usedStar ? 'star' : 'normal'),
        watered: plot.watered,
        waterCount: plot.waterCount || 0
      });
    }
    const ach = this.checkAchievements();
    await savePlayer({ action: 'plant' });
    this.notifyAchievements(ach);
    return { ok: true, msg: `Đã trồng ${usedMyth ? '✨ ' : (usedStar ? '⭐ ' : '')}${plant.name}!` + (fairyWatered ? ' 🧚 Tiên đã tưới.' : '') };
  },

  
  async plantMultiple(plantId, count, preferredKind, sharedAt) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plant = this.getPlant(plantId);
    if (!plant) return { ok: false, msg: 'Hạt không hợp lệ!' };
    const empty = [];
    currentPlayer.plots.forEach((p, i) => { if (!p.plantId) empty.push(i); });
    if (empty.length === 0) return { ok: false, msg: 'Không còn ô đất trống!' };
    if (!currentPlayer.inventory.seedsMyth) currentPlayer.inventory.seedsMyth = {};
    const normal = (currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[plantId]) || 0;
    const star = (currentPlayer.inventory.seedsStar && currentPlayer.inventory.seedsStar[plantId]) || 0;
    const myth = (currentPlayer.inventory.seedsMyth && currentPlayer.inventory.seedsMyth[plantId]) || 0;
    let seedCount = normal + star + myth;
    if (preferredKind === 'myth') seedCount = myth;
    else if (preferredKind === 'star') seedCount = star;
    else if (preferredKind === 'normal') seedCount = normal;
    if (seedCount < 1) {
      return { ok: false, msg: preferredKind === 'myth' ? 'Không đủ hạt huyền thoại!' : (preferredKind === 'star' ? 'Không đủ hạt sao!' : (preferredKind === 'normal' ? 'Không đủ hạt thường!' : 'Không đủ hạt giống!')) };
    }
    const n = Math.min(count, empty.length, seedCount);
    const at = typeof sharedAt === 'number' ? sharedAt : (typeof nowMs==="function"?nowMs():Date.now());
    const fairyOn = this.isFairyActive();
    let planted = 0;
    let fairyWateredN = 0;
    for (let i = 0; i < n; i++) {
      const plotId = empty[i];
      const plot = currentPlayer.plots[plotId];
      if (!plot || plot.plantId) break;
      let usedStar = false;
      let usedMyth = false;
      if (preferredKind === 'myth') {
        if (!this.isUnlimitedResources() && (currentPlayer.inventory.seedsMyth[plantId] || 0) < 1) break;
        if (!this.isUnlimitedResources()) {
          currentPlayer.inventory.seedsMyth[plantId]--;
          if (currentPlayer.inventory.seedsMyth[plantId] <= 0) delete currentPlayer.inventory.seedsMyth[plantId];
        }
        usedMyth = true;
        usedStar = true;
      } else if (preferredKind === 'star') {
        if ((currentPlayer.inventory.seedsStar[plantId] || 0) < 1) break;
        currentPlayer.inventory.seedsStar[plantId]--;
        if (currentPlayer.inventory.seedsStar[plantId] <= 0) delete currentPlayer.inventory.seedsStar[plantId];
        usedStar = true;
      } else if (preferredKind === 'normal') {
        if ((currentPlayer.inventory.seeds[plantId] || 0) < 1) break;
        currentPlayer.inventory.seeds[plantId]--;
        if (currentPlayer.inventory.seeds[plantId] <= 0) delete currentPlayer.inventory.seeds[plantId];
      } else {
        const my = (currentPlayer.inventory.seedsMyth && currentPlayer.inventory.seedsMyth[plantId]) || 0;
        const st = (currentPlayer.inventory.seedsStar && currentPlayer.inventory.seedsStar[plantId]) || 0;
        const nm = (currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[plantId]) || 0;
        if (my + st + nm < 1) break;
        if (my > 0) {
          currentPlayer.inventory.seedsMyth[plantId]--;
          if (currentPlayer.inventory.seedsMyth[plantId] <= 0) delete currentPlayer.inventory.seedsMyth[plantId];
          usedMyth = true;
          usedStar = true;
        } else if (st > 0) {
          currentPlayer.inventory.seedsStar[plantId]--;
          if (currentPlayer.inventory.seedsStar[plantId] <= 0) delete currentPlayer.inventory.seedsStar[plantId];
          usedStar = true;
        } else {
          currentPlayer.inventory.seeds[plantId]--;
          if (currentPlayer.inventory.seeds[plantId] <= 0) delete currentPlayer.inventory.seeds[plantId];
        }
      }
      plot.plantId = plantId;
      plot.plantedAt = at; 
      plot.watered = false;
      plot.waterCount = 0;
      plot.lastWatered = null;
      plot.fertilizerId = null;
      plot.fertilizedAt = null;
      plot.seedStar = usedStar || usedMyth;
      plot.seedMyth = usedMyth;
      {
        const plDef = this.getPlant(plantId);
        plot.baseGrowTime = (plDef && Number(plDef.growTime) > 0) ? Number(plDef.growTime) : (Number(plot.baseGrowTime) || 0);
      }
      if (fairyOn) {
        plot.waterCount = 3;
        plot.watered = true;
        plot.lastWatered = at;
        fairyWateredN++;
      }
      planted++;
      currentPlayer.stats.planted = (currentPlayer.stats.planted || 0) + 1;
    }
    if (planted > 0) {
      if (typeof Features !== 'undefined' && Features.trackQuest) {
        Features.trackQuest('plant', planted);
        if (fairyWateredN > 0) Features.trackQuest('water', fairyWateredN * 3);
      }
      this.trackDayStat('plant', { plots: planted, actions: 1, gardenIndex: currentPlayer.activeGarden || 0, name: plant.name || plantId });
      if (fairyWateredN) this.trackDayStat('fairy_water', { actions: fairyWateredN, gardenIndex: currentPlayer.activeGarden || 0 });
      this.addActivity(`Trồng ${planted} ô ${plant.name}` + (fairyWateredN ? ` · Tiên tưới ${fairyWateredN} ô` : '') + ' (đồng bộ giờ)');
      const ach = this.checkAchievements();
      await savePlayer();
      this.notifyAchievements(ach);
    }
    return { ok: planted > 0, msg: planted > 0 ? `Đã trồng ${planted} ô (cùng giờ)!` : 'Không trồng được.' };
  },

  async waterPlot(plotId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plot = currentPlayer.plots[plotId];
    if (!plot || !plot.plantId) return { ok: false, msg: 'Không có cây để tưới!' };
    if (this.isReady(plot)) return { ok: false, msg: 'Cây đã chín rồi!' };
    const count = plot.waterCount || 0;
    if (count >= 3) return { ok: false, msg: 'Đã tưới tối đa 3 lần!' };
    
    plot.watered = true;
    plot.waterCount = count + 1;
    plot.lastWatered = (typeof nowMs==="function"?nowMs():Date.now());
    try { this._pushDayEvent('water', { plots: 1, plotId }, currentPlayer.activeGarden || 0); } catch(_){}
    const _wPlant = this.getPlant(plot.plantId);
    this.pushGameEvent({
      action: 'water',
      actor: 'player',
      category: 'garden',
      target: _wPlant ? { type: 'crop', id: plot.plantId, name: _wPlant.name } : null,
      cellId: plotId,
      gardenIndex: currentPlayer.activeGarden || 0,
      quantity: 1,
      summaryText: '💧 Tưới ' + (_wPlant ? _wPlant.name + ' ' : '') + 'tại ô #' + (plotId + 1) + ' (' + plot.waterCount + '/3)',
      detail: { waterCount: plot.waterCount, plantId: plot.plantId }
    });
    if (typeof renderActivityPage === 'function') {
      try {
        const page = document.getElementById('page-activity');
        if (page && page.classList.contains('active')) renderActivityPage();
      } catch (_) {}
    }
    if (typeof Features !== 'undefined') Features.trackQuest('water', 1);
    if (typeof recordGameEvent === 'function') {
      recordGameEvent('water', {
        plotId,
        gardenIndex: currentPlayer.activeGarden || 0,
        plantId: plot.plantId,
        waterCount: plot.waterCount,
        at: plot.lastWatered
      });
    }
    await savePlayer({ action: 'water' });
    this.checkAchievements();
    return { ok: true, msg: `Đã tưới! (${plot.waterCount}/3)` };
  },

  async applyFertilizer(plotId, fertId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plot = currentPlayer.plots[plotId];
    if (!plot || !plot.plantId) return { ok: false, msg: 'Không có cây!' };
    if (this.isReady(plot)) return { ok: false, msg: 'Cây đã chín rồi!' };
    if (plot.fertilizerId) return { ok: false, msg: 'Ô này đã bón phân rồi!' };
    const have = (currentPlayer.inventory.fertilizers && currentPlayer.inventory.fertilizers[fertId]) || 0;
    if (have < 1) return { ok: false, msg: 'Không đủ phân bón!' };
    const fert = this.getFertilizer(fertId);
    if (!fert) return { ok: false, msg: 'Phân bón không hợp lệ!' };
    currentPlayer.inventory.fertilizers[fertId]--;
    if (currentPlayer.inventory.fertilizers[fertId] <= 0) delete currentPlayer.inventory.fertilizers[fertId];
    plot.fertilizerId = fertId;
    plot.fertilizedAt = (typeof nowMs==="function"?nowMs():Date.now());
    try { this._pushDayEvent('fert', { plots: 1, plotId, name: fert.name }, currentPlayer.activeGarden || 0); this.syncActivityLogsFromDayStats(); } catch(_){}
    this.addActivity(`Bón ${fert.name} ô #${plotId + 1}`);
    if (typeof recordGameEvent === 'function') {
      recordGameEvent('fert', {
        plotId,
        gardenIndex: currentPlayer.activeGarden || 0,
        plantId: plot.plantId,
        fertId,
        at: plot.fertilizedAt
      });
    }
    await savePlayer({ action: 'fert' });
    return { ok: true, msg: `Đã bón ${fert.name}!` };
  },

  async waterAll(limit) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const maxPlots = (limit == null || limit === 'all') ? Infinity : Math.max(0, parseInt(limit, 10) || 0);
    let plotsDone = 0;
    let actions = 0;
    for (const plot of currentPlayer.plots) {
      if (plotsDone >= maxPlots) break;
      if (plot.plantId && !this.isReady(plot) && (plot.waterCount || 0) < 3) {
        
        while ((plot.waterCount || 0) < 3) {
          plot.watered = true;
          plot.waterCount = (plot.waterCount || 0) + 1;
          plot.lastWatered = (typeof nowMs==="function"?nowMs():Date.now());
          actions++;
        }
        plotsDone++;
      }
    }
    if (actions > 0) {
      this.addActivity(`Tưới đủ ${plotsDone} ô (${actions} lần)`);
      if (typeof Features !== 'undefined' && Features.trackQuest) Features.trackQuest('water', actions);
      await savePlayer();
      this.checkAchievements();
    }
    return { ok: true, msg: actions > 0 ? `Đã tưới đủ 3 lần cho ${plotsDone} ô!` : 'Không có ô nào cần tưới.' };
  },

  
  async fertilizeAll(limit, fertId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    if (!currentPlayer.inventory) currentPlayer.inventory = {};
    if (!currentPlayer.inventory.fertilizers) currentPlayer.inventory.fertilizers = {};
    const stock = currentPlayer.inventory.fertilizers;
    let available = Object.keys(stock).filter(id => stock[id] > 0)
      .map(id => this.getFertilizer(id)).filter(Boolean)
      .sort((a, b) => (b.yieldBonus || 0) - (a.yieldBonus || 0));
    if (fertId) {
      const chosen = this.getFertilizer(fertId);
      if (!chosen || !(stock[fertId] > 0)) return { ok: false, msg: 'Không đủ loại phân đã chọn!' };
      available = [chosen];
    }
    if (!available.length) return { ok: false, msg: 'Không còn phân bón trong kho!' };

    const max = (limit == null || limit === 'all') ? Infinity : Math.max(0, parseInt(limit, 10) || 0);
    let count = 0;
    for (const plot of currentPlayer.plots) {
      if (count >= max) break;
      if (!plot.plantId || this.isReady(plot) || plot.fertilizerId) continue;
      let fert = available.find(f => (stock[f.id] || 0) > 0);
      if (!fert) break;
      stock[fert.id]--;
      if (stock[fert.id] <= 0) delete stock[fert.id];
      plot.fertilizerId = fert.id;
      plot.fertilizedAt = (typeof nowMs==="function"?nowMs():Date.now());
      count++;
    }
    if (count > 0) {
      this.addActivity(`Bón phân ${count} ô đất`);
      await savePlayer();
    }
    return { ok: true, msg: count > 0 ? `Đã bón phân ${count} ô!` : 'Không có ô nào cần bón.' };
  },

  
  BOOST_MS: 3 * 60 * 60 * 1000,
  
  BOOST_PREVIEW_MS: 10 * 1000,

  
  getWaterBoostRemainingMs(plot, now = (typeof nowMs==="function"?nowMs():Date.now())) {
    if (!plot || !(plot.waterCount > 0) || !plot.lastWatered) return 0;
    return Math.max(0, (plot.lastWatered + this.BOOST_MS) - now);
  },

  
  getFertBoostRemainingMs(plot, now = (typeof nowMs==="function"?nowMs():Date.now())) {
    if (!plot || !plot.fertilizerId || !plot.fertilizedAt) return 0;
    return Math.max(0, (plot.fertilizedAt + this.BOOST_MS) - now);
  },

  
  isWaterBoostActive(plot, now = (typeof nowMs==="function"?nowMs():Date.now())) {
    return this.getWaterBoostRemainingMs(plot, now) > 0;
  },

  
  isFertBoostActive(plot, now = (typeof nowMs==="function"?nowMs():Date.now())) {
    return this.getFertBoostRemainingMs(plot, now) > 0;
  },

  




  getWaterDisplayState(plot, now = (typeof nowMs==="function"?nowMs():Date.now())) {
    const rem = this.getWaterBoostRemainingMs(plot, now);
    if (rem <= 0 || rem <= this.BOOST_PREVIEW_MS) {
      return {
        active: false,
        nearExpiry: rem > 0 && rem <= this.BOOST_PREVIEW_MS,
        remainingMs: rem,
        text: 'Chưa tưới nước',
        short: '0/3'
      };
    }
    const c = Math.min(3, plot.waterCount || 0);
    return {
      active: true,
      nearExpiry: false,
      remainingMs: rem,
      text: `${c}/3 💧`,
      short: `${c}/3`
    };
  },

  




  getFertDisplayState(plot, now = (typeof nowMs==="function"?nowMs():Date.now())) {
    const rem = this.getFertBoostRemainingMs(plot, now);
    if (rem <= 0 || rem <= this.BOOST_PREVIEW_MS || !plot.fertilizerId) {
      return {
        active: false,
        nearExpiry: rem > 0 && rem <= this.BOOST_PREVIEW_MS,
        remainingMs: rem,
        text: 'Chưa bón phân',
        fertId: null
      };
    }
    const fert = this.getFertilizer(plot.fertilizerId);
    const name = fert ? `${fert.icon || ''} ${fert.name}`.trim() : plot.fertilizerId;
    return {
      active: true,
      nearExpiry: false,
      remainingMs: rem,
      text: name,
      fertId: plot.fertilizerId
    };
  },

  
  getBoostResetRemaining(plot) {
    if (!plot) return null;
    const now = (typeof nowMs==="function"?nowMs():Date.now());
    let ends = [];
    const w = this.getWaterBoostRemainingMs(plot, now);
    if (w > 0) ends.push(now + w);
    const f = this.getFertBoostRemainingMs(plot, now);
    if (f > 0) ends.push(now + f);
    if (!ends.length) return null;
    const soonest = Math.min(...ends);
    return Math.max(0, Math.ceil((soonest - now) / 1000));
  },

  
  countFertilizerInBag() {
    if (!currentPlayer || !currentPlayer.inventory) return 0;
    const bag = currentPlayer.inventory.fertilizers || {};
    let n = 0;
    Object.keys(bag).forEach(id => {
      n += Math.max(0, Math.floor(Number(bag[id]) || 0));
    });
    return n;
  },

  
  pickBestFertilizerFromBag() {
    if (!currentPlayer || !currentPlayer.inventory || !currentPlayer.inventory.fertilizers) return null;
    const bag = currentPlayer.inventory.fertilizers;
    let best = null;
    let bestReduce = -1;
    Object.keys(bag).forEach(id => {
      const qty = Math.floor(Number(bag[id]) || 0);
      if (qty < 1) return;
      const fert = this.getFertilizer(id);
      if (!fert) return;
      const r = Number(fert.timeReduce) || 0;
      if (r > bestReduce) {
        bestReduce = r;
        best = fert;
      }
    });
    return best;
  },

  
  defaultFairyConfig() {
    return {
      waterMode: 'all',      
      waterCount: 12,
      useFertilizer: true,
      fertSource: 'any',     
      fertId: null,
      fertMode: 'all',       
      fertCount: 12,
      gardensEnabled: {},    
      byGarden: {},
      collectRain: true
    };
  },

  getFairyConfig() {
    const def = this.defaultFairyConfig();
    if (!currentPlayer) return { ...def };
    if (!currentPlayer.fairyConfig || typeof currentPlayer.fairyConfig !== 'object') {
      currentPlayer.fairyConfig = { ...def };
    }
    const c = currentPlayer.fairyConfig;
    if (c.waterMode !== 'count') c.waterMode = 'all';
    if (typeof c.waterCount !== 'number' || c.waterCount < 1) c.waterCount = def.waterCount;
    if (typeof c.useFertilizer !== 'boolean') c.useFertilizer = true;
    if (c.fertSource !== 'specific') c.fertSource = 'any';
    if (c.fertId === undefined) c.fertId = null;
    if (c.fertMode !== 'count') c.fertMode = 'all';
    if (typeof c.fertCount !== 'number' || c.fertCount < 1) c.fertCount = def.fertCount;
    if (!c.gardensEnabled || typeof c.gardensEnabled !== 'object') c.gardensEnabled = {};
    if (!c.byGarden || typeof c.byGarden !== 'object') c.byGarden = {};
    if (typeof c.customName !== 'string') c.customName = '';
    if (c.gender !== 'male' && c.gender !== 'female') c.gender = 'female';
    if (typeof c.collectRain !== 'boolean') c.collectRain = true;
    return c;
  },

  
  getFairyConfigForGarden(gardenIndex) {
    const base = this.getFairyConfig();
    const key = String(gardenIndex);
    const ov = (base.byGarden && base.byGarden[key]) || (base.byGarden && base.byGarden[gardenIndex]) || null;
    if (!ov || typeof ov !== 'object') return { ...base, _gardenIndex: gardenIndex };
    return {
      ...base,
      waterMode: ov.waterMode === 'count' ? 'count' : (ov.waterMode === 'all' ? 'all' : base.waterMode),
      waterCount: typeof ov.waterCount === 'number' ? ov.waterCount : base.waterCount,
      useFertilizer: typeof ov.useFertilizer === 'boolean' ? ov.useFertilizer : base.useFertilizer,
      fertSource: ov.fertSource === 'specific' ? 'specific' : (ov.fertSource === 'any' ? 'any' : base.fertSource),
      fertId: ov.fertId !== undefined ? ov.fertId : base.fertId,
      fertMode: ov.fertMode === 'count' ? 'count' : (ov.fertMode === 'all' ? 'all' : base.fertMode),
      fertCount: typeof ov.fertCount === 'number' ? ov.fertCount : base.fertCount,
      _gardenIndex: gardenIndex
    };
  },

  getFairyDisplayName() {
    const n = (this.getFairyConfig().customName || '').trim();
    return n || 'Tiên';
  },

  getNycDisplayName() {
    const cfg = this.getNycConfig();
    const n = (cfg.customName || '').trim();
    return n || 'NYC';
  },

  getFairyGender() {
    return this.getFairyConfig().gender === 'male' ? 'male' : 'female';
  },

  getNycGender() {
    return this.getNycConfig().gender === 'male' ? 'male' : 'female';
  },

  getFairyEmoji() {
    return this.getFairyGender() === 'male' ? '🧙' : '🧚';
  },

  getNycEmoji() {
    return this.getNycGender() === 'male' ? '👨‍🌾' : '👩‍🌾';
  },

  
  isFairyGardenEnabled(gardenIndex) {
    const cfg = this.getFairyConfig();
    const ge = cfg.gardensEnabled || {};
    if (ge[gardenIndex] === false || ge[String(gardenIndex)] === false) return false;
    return true;
  },

  isNycGardenEnabled(gardenIndex) {
    const cfg = this.getNycConfig();
    const ge = cfg.gardensEnabled || {};
    const k = String(gardenIndex);
    // Chỉ tắt khi ghi nhận explicit false (boolean)
    if (ge[k] === false || ge[gardenIndex] === false) return false;
    // Array-style (hiếm): phần tử false
    if (Array.isArray(ge) && ge[Number(gardenIndex)] === false) return false;
    return true;
  },

  setFairyConfig(cfg) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const def = this.defaultFairyConfig();
    const prev = this.getFairyConfig();
    const ge = {};
    if (cfg && cfg.gardensEnabled && typeof cfg.gardensEnabled === 'object') {
      Object.keys(cfg.gardensEnabled).forEach(k => {
        ge[k] = !!cfg.gardensEnabled[k];
      });
    } else {
      Object.assign(ge, prev.gardensEnabled || {});
    }
    
    const byGarden = Object.assign({}, prev.byGarden || {});
    const gIdx = cfg && (cfg.gardenIndex !== undefined && cfg.gardenIndex !== null)
      ? String(cfg.gardenIndex) : null;
    const careSlice = {
      waterMode: cfg && cfg.waterMode === 'count' ? 'count' : 'all',
      waterCount: Math.max(1, Math.min(99, parseInt(cfg && cfg.waterCount, 10) || def.waterCount)),
      useFertilizer: !!(cfg && cfg.useFertilizer),
      fertSource: cfg && cfg.fertSource === 'specific' ? 'specific' : 'any',
      fertId: (cfg && cfg.fertId) || null,
      fertMode: cfg && cfg.fertMode === 'count' ? 'count' : 'all',
      fertCount: Math.max(1, Math.min(99, parseInt(cfg && cfg.fertCount, 10) || def.fertCount))
    };
    if (careSlice.fertSource === 'specific' && careSlice.fertId && !this.getFertilizer(careSlice.fertId)) {
      return { ok: false, msg: 'Loại phân không hợp lệ!' };
    }
    if (gIdx !== null) {
      byGarden[gIdx] = careSlice;
      
      if (cfg && typeof cfg.gardenEnabled === 'boolean') {
        ge[gIdx] = cfg.gardenEnabled;
      }
    }
    const next = {
      
      ...careSlice,
      gardensEnabled: ge,
      byGarden,
      customName: (cfg && typeof cfg.customName === 'string') ? cfg.customName.trim().slice(0, 20) : (prev.customName || ''),
      gender: cfg && cfg.gender === 'male' ? 'male' : 'female',
      collectRain: cfg && typeof cfg.collectRain === 'boolean' ? cfg.collectRain : (typeof prev.collectRain === 'boolean' ? prev.collectRain : true)
    };
    currentPlayer.fairyConfig = next;
    const parts = [];
    if (gIdx !== null) parts.push('Vườn ' + (Number(gIdx) + 1));
    parts.push(careSlice.waterMode === 'all' ? 'tưới hết ô' : `tưới ${careSlice.waterCount} ô`);
    if (careSlice.useFertilizer) {
      const src = careSlice.fertSource === 'specific'
        ? ((this.getFertilizer(careSlice.fertId) || {}).name || careSlice.fertId)
        : 'mọi loại trong kho';
      const n = careSlice.fertMode === 'all' ? 'hết ô' : `${careSlice.fertCount} ô`;
      parts.push(`bón ${src} · ${n}`);
    } else {
      parts.push('không bón phân');
    }
    return { ok: true, msg: 'Đã lưu: ' + parts.join(' · ') };
  },

  
  takeFertFromBagForFairy(cfg) {
    if (!currentPlayer.inventory) currentPlayer.inventory = {};
    if (!currentPlayer.inventory.fertilizers || typeof currentPlayer.inventory.fertilizers !== 'object') {
      currentPlayer.inventory.fertilizers = {};
    }
    const bag = currentPlayer.inventory.fertilizers;
    if (cfg.fertSource === 'specific') {
      const id = cfg.fertId;
      const qty = Math.floor(Number(bag[id]) || 0);
      if (!id || qty < 1) {
        
        const best = this.pickBestFertilizerFromBag();
        if (!best) return null;
        const q = Math.floor(Number(bag[best.id]) || 0);
        if (q < 1) return null;
        bag[best.id] = q - 1;
        if (bag[best.id] <= 0) delete bag[best.id];
        return best.id;
      }
      bag[id] = qty - 1;
      if (bag[id] <= 0) delete bag[id];
      return id;
    }
    
    const best = this.pickBestFertilizerFromBag();
    if (!best) return null;
    const q = Math.floor(Number(bag[best.id]) || 0);
    if (q < 1) return null;
    bag[best.id] = q - 1;
    if (bag[best.id] <= 0) delete bag[best.id];
    return best.id;
  },

  




  runFairyCare(now = (typeof nowMs==="function"?nowMs():Date.now())) {
    if (!currentPlayer || !currentPlayer.plots) return false;
    let wateredN = 0;
    let fertN = 0;
    const plots = Array.isArray(currentPlayer.plots)
      ? currentPlayer.plots
      : Object.values(currentPlayer.plots || {});
    if (!Array.isArray(currentPlayer.plots)) currentPlayer.plots = plots;
    const gi = typeof currentPlayer.activeGarden === 'number' ? currentPlayer.activeGarden : 0;
    if (!this.isFairyGardenEnabled(gi)) return false;
    const cfg = this.getFairyConfigForGarden(gi);

    
    let needWater = plots.filter(p => p && p.plantId);
    if (cfg.waterMode === 'count') {
      needWater = needWater.slice(0, Math.max(1, Number(cfg.waterCount) || 12));
    }
    for (let i = 0; i < needWater.length; i++) {
      const plot = needWater[i];
      plot.waterCount = 3;
      plot.watered = true;
      plot.lastWatered = now;
      wateredN++;
    }

    
    let needFertN = 0;
    let stoppedNoFert = false;
    if (cfg.useFertilizer) {
      let needFert = plots.filter(p => {
        if (!p || !p.plantId) return false;
        if (typeof this.isReadyAt === 'function' ? this.isReadyAt(p, now) : this.isReady(p)) return false;
        return !this.isFertBoostActive(p, now);
      });
      if (cfg.fertMode === 'count') {
        needFert = needFert.slice(0, Math.max(1, Number(cfg.fertCount) || 12));
      }
      needFertN = needFert.length;
      for (let i = 0; i < needFert.length; i++) {
        const plot = needFert[i];
        if (plot.fertilizerId) {
          plot.fertilizerId = null;
          plot.fertilizedAt = null;
        }
        const fertId = this.takeFertFromBagForFairy(cfg);
        if (!fertId) {
          stoppedNoFert = true;
          break; 
        }
        plot.fertilizerId = fertId;
        plot.fertilizedAt = now; 
        fertN++;
      }
    }

    currentPlayer.lastFairyCare = now;
    if (wateredN > 0 || fertN > 0 || (cfg.useFertilizer && needFertN > 0)) {
      const emoji = this.getFairyEmoji ? this.getFairyEmoji() : '🧚';
      const name = this.getFairyDisplayName ? this.getFairyDisplayName() : 'Tiên';
      let msg = `${emoji} ${name} chăm: tưới ${wateredN} ô`;
      if (cfg.useFertilizer) {
        if (fertN > 0) {
          msg += `, bón ${fertN} ô`;
          if (stoppedNoFert && fertN < needFertN) {
            msg += ` (hết phân giữa chừng, còn ${this.countFertilizerInBag()} trong kho)`;
          }
        } else if (needFertN === 0) {
          
          msg += ' (không ô cần bón)';
        } else {
          
          const left = this.countFertilizerInBag();
          msg += left > 0
            ? ` (không bón được · kho còn ${left} — kiểm tra loại phân cấu hình)`
            : ' (hết phân trong kho)';
        }
      } else {
        msg += ' (không bón phân)';
      }
      if (wateredN > 0) this.trackDayStat('fairy_water', { actions: wateredN, gardenIndex: currentPlayer.activeGarden || 0 });
      if (fertN > 0) this.trackDayStat('fairy_fert', { actions: fertN });
      this.addActivity(msg, { type: 'fairy_care', at: now });
      
      if (wateredN > 0 && typeof Features !== 'undefined' && Features.trackQuest) {
        Features.trackQuest('water', wateredN * 3);
      }
    }
    return wateredN > 0 || fertN > 0;
  },

  




  fairyEnsureWatered(now = (typeof nowMs==="function"?nowMs():Date.now())) {
    if (!this.isFairyActive() || !currentPlayer || !currentPlayer.plots) return false;
    const plots = Array.isArray(currentPlayer.plots)
      ? currentPlayer.plots
      : Object.values(currentPlayer.plots || {});
    if (!Array.isArray(currentPlayer.plots)) currentPlayer.plots = plots;
    let n = 0;
    plots.forEach(plot => {
      if (!plot || !plot.plantId) return;
      
      const count = plot.waterCount || 0;
      const expired = !this.isWaterBoostActive(plot, now);
      const missing = count < 3;
      const never = count <= 0 || !plot.lastWatered;
      if (!expired && !missing && !never) return;
      plot.waterCount = 3;
      plot.watered = true;
      plot.lastWatered = now;
      n++;
    });
    if (n > 0 && typeof Features !== 'undefined' && Features.trackQuest) {
      Features.trackQuest('water', n * 3);
    }
    return n > 0;
  },

  




  fairyEnsureFertilized(now = (typeof nowMs==="function"?nowMs():Date.now())) {
    if (!this.isFairyActive() || !currentPlayer || !currentPlayer.plots) return false;
    const cfg = this.getFairyConfig();
    if (!cfg.useFertilizer) return false;
    const plots = Array.isArray(currentPlayer.plots)
      ? currentPlayer.plots
      : Object.values(currentPlayer.plots || {});
    if (!Array.isArray(currentPlayer.plots)) currentPlayer.plots = plots;
    let n = 0;
    plots.forEach(plot => {
      if (!plot || !plot.plantId) return;
      if (this.isReady(plot)) return;
      const active = this.isFertBoostActive(plot, now);
      if (active) return;
      
      if (plot.fertilizerId) {
        plot.fertilizerId = null;
        plot.fertilizedAt = null;
      }
      const fertId = this.takeFertFromBagForFairy(cfg);
      if (!fertId) return; 
      plot.fertilizerId = fertId;
      plot.fertilizedAt = now;
      n++;
    });
    return n > 0;
  },

  






  resetExpiredBoosts() {
    if (!currentPlayer) return false;
    this.ensureGardens();
    const now = (typeof nowMs==="function"?nowMs():Date.now());
    let changed = false;
    const fairy = this.isFairyActive();

    this.forEachGarden((plots, gi) => {
      const fairyHere = fairy && this.isFairyGardenEnabled(gi);
      if (fairyHere) {
        if (this.fairyEnsureWatered(now)) changed = true;
        if (this.fairyEnsureFertilized(now)) changed = true;
      } else {
        plots.forEach(plot => {
          if (!plot) return;
          if ((plot.waterCount || 0) > 0 && plot.lastWatered && !this.isWaterBoostActive(plot, now)) {
            plot.waterCount = 0;
            plot.watered = false;
            plot.lastWatered = null;
            changed = true;
          }
          if (plot.fertilizerId && plot.fertilizedAt && !this.isFertBoostActive(plot, now)) {
            plot.fertilizerId = null;
            plot.fertilizedAt = null;
            changed = true;
          }
        });
      }
      plots.forEach(plot => {
        if (plot && plot.fertilizerId && !plot.fertilizedAt) {
          plot.fertilizedAt = now;
          changed = true;
        }
      });
    });

    if (fairy) {
      const last = Number(currentPlayer.lastFairyCare) || 0;
      
      
      if (!last) {
        this.forEachGarden((plots, gi) => {
          if (!this.isFairyGardenEnabled(gi)) return;
          this.runFairyCare(now);
        });
        currentPlayer.lastFairyCare = now;
        changed = true;
      } else if (now - last >= this.BOOST_MS) {
        
        let careAt = last;
        while (careAt + this.BOOST_MS <= now) {
          careAt += this.BOOST_MS;
        }
        this.forEachGarden((plots, gi) => {
          if (!this.isFairyGardenEnabled(gi)) return;
          this.runFairyCare(careAt);
        });
        currentPlayer.lastFairyCare = careAt;
        changed = true;
      }
    }
    return changed;
  },

  
  getElapsedAt(plot, atMs) {
    if (!plot || !plot.plantId || !plot.plantedAt) return 0;
    const plantedAt = this.toMs(plot.plantedAt);
    if (!Number.isFinite(plantedAt) || plantedAt <= 0) return 0;
    return Math.max(0, (Number(atMs) - plantedAt) / 1000);
  },

  isReadyAt(plot, atMs) {
    if (!plot || !plot.plantId || !plot.plantedAt) return false;
    return this.getElapsedAt(plot, atMs) + 0.05 >= this.getEffectiveGrowTime(plot, atMs);
  },

  
  getReadyAtMs(plot, atMs) {
    if (!plot || !plot.plantId || !plot.plantedAt) return null;
    // Dùng thời điểm đang xét (atMs / now) để tính buff tốc độ — KHÔNG dùng plantedAt
    // (nếu dùng plantedAt, ô mới nâng cấp sau khi trồng sẽ bị offline bỏ sót, NYC realtime vẫn thu được)
    const ref = (atMs != null && Number.isFinite(Number(atMs)))
      ? Number(atMs)
      : ((typeof nowMs === 'function' ? nowMs() : Date.now()));
    const growSec = this.getEffectiveGrowTime(plot, ref);
    const plantedAt = this.toMs(plot.plantedAt);
    if (!Number.isFinite(plantedAt) || plantedAt <= 0) return null;
    return plantedAt + growSec * 1000;
  },

  








  
  applyOfflineRainAt(t) {
    if (!currentPlayer) return { watered: 0, boosted: 0, collected: 0, collectCoins: 0, collectSeeds: 0 };
    this.ensureGardens();
    let watered = 0;
    let boosted = 0;
    let collected = 0;
    let collectCoins = 0;
    let collectSeeds = 0;
    const fairy = this.isFairyActive();
    this.forEachGarden((plots, gi) => {
      const fairyHere = fairy && this.isFairyGardenEnabled(gi);
      (plots || []).forEach(plot => {
        if (!plot || !plot.plantId || !plot.plantedAt) return;
        const ready = typeof this.isReadyAt === 'function'
          ? this.isReadyAt(plot, t)
          : this.isReady(plot);
        if (!ready) {
          const growSec = this.getEffectiveGrowTime(plot);
          const elapsed = this.getElapsedAt(plot, t);
          const remain = Math.max(0, growSec - elapsed);
          const cut = Math.floor(remain * 0.12);
          if (cut > 0) {
            plot.plantedAt -= cut * 1000;
            boosted++;
          }
        }
        if (fairyHere) {
          plot.waterCount = 3;
          plot.watered = true;
          plot.lastWatered = t;
          watered++;
        }
      });
    });
    
    const seedMap = {};
    const collectOn = fairy && this.getFairyConfig().collectRain !== false;
    if (collectOn) {
      const n = 4 + Math.floor(Math.random() * 4);
      if (!currentPlayer.inventory) currentPlayer.inventory = { seeds: {}, harvest: {}, fertilizers: {} };
      if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
      const plantsPool = (this.getPlants() || []).filter(p => p && p.id && (!this.isPlantAvailable || this.isPlantAvailable(p)));
      const pool = plantsPool.length ? plantsPool : (this.getPlants() || []).filter(p => p && p.id);
      let seedHits = 0;
      for (let i = 0; i < n; i++) {
        const wantSeed = pool.length && (Math.random() < 0.7 || (i === n - 1 && seedHits === 0));
        if (!wantSeed) {
          const coins = 5 + Math.floor(Math.random() * 11);
          currentPlayer.coins = (currentPlayer.coins || 0) + coins;
          collectCoins += coins;
        } else {
          const plant = pool[Math.floor(Math.random() * pool.length)];
          currentPlayer.inventory.seeds[plant.id] = (currentPlayer.inventory.seeds[plant.id] || 0) + 1;
          collectSeeds++;
          seedHits++;
          seedMap[plant.id] = (seedMap[plant.id] || 0) + 1;
        }
        collected++;
      }
      currentPlayer.rainedCollectOnce = true;
    }
    return { watered, boosted, collected, collectCoins, collectSeeds, seedMap };
  },

  



  



  _nycHarvestOneAt(plot, t, gi, cfg, doReplant, silent, force) {
    if (!plot || !plot.plantId || !plot.plantedAt) return { harvested: 0, planted: 0, amount: 0, plantName: '', plantId: null, seedStar: false };
    if (!force && !this.isReadyAt(plot, t)) return { harvested: 0, planted: 0, amount: 0, plantName: '', plantId: null, seedStar: false };
    const plant = this.getPlant(plot.plantId);
    // Cho phép thu cả khi thiếu định nghĩa cây (tránh mất vụ offline)
    if (!plant && !force) return { harvested: 0, planted: 0, amount: 0, plantName: '', plantId: null, seedStar: false };
    let amount = (plant && plant.yield) ? plant.yield : 1;
    if (plot.fertilizerId) {
      const fert = this.getFertilizer(plot.fertilizerId);
      if (fert && fert.yieldBonus) amount = Math.ceil(amount * (1 + fert.yieldBonus));
    }
    if ((plot.waterCount || 0) >= 2) amount = Math.ceil(amount * 1.1);
    amount = this.applySeedYieldBonus(plot, amount);
    const seedStarFlag = !!plot.seedStar;
    const hid = plot.plantId;
    const plantName = (plant && plant.name) ? plant.name : String(hid || 'cây');
    if (!currentPlayer.inventory) currentPlayer.inventory = {};
    this.stashHarvestProduct(hid, amount, plot);
    currentPlayer.stats = currentPlayer.stats || {};
    currentPlayer.stats.harvested = (currentPlayer.stats.harvested || 0) + amount;
    this.unlockCollection(hid);
    this.addXp(Math.ceil(((plant && plant.xp) || 5) * this.getSeedXpMult(plot)));
    plot.plantId = null;
    plot.plantedAt = null;
    plot.watered = false;
    plot.waterCount = 0;
    plot.lastWatered = null;
    plot.fertilizerId = null;
    plot.fertilizedAt = null;
    plot.seedStar = false;
    plot.seedMyth = false;
    let planted = 0;
    let replantName = '';
    if (doReplant && cfg && cfg.plantId) {
      if (this._nycPlantOneAt(plot, cfg, t, gi)) {
        planted = 1;
        const rp = this.getPlant(cfg.plantId);
        replantName = (rp && rp.name) ? rp.name : String(cfg.plantId);
      }
    }
    
    if (!silent) {
      const _tierTag = this.getPlotSeedTier(plot) === 'myth' ? ' ✨' : (seedStarFlag || plot.seedStar ? ' ⭐' : '');
      let logMsg = 'Thu hoạch ' + amount + ' ' + plantName + _tierTag;
      if (planted && replantName) logMsg += ' · NYC trồng lại ' + replantName;
      this.addActivity(logMsg, { type: 'harvest_offline', at: t, plotGarden: gi });
    }
    return { harvested: 1, planted, amount, plantName, plantId: hid, seedStar: seedStarFlag, replantName };
  },

  




  _nextNycReadyAt(untilMs, opts) {
    if (!currentPlayer || !currentPlayer.gardens) return null;
    const requireActive = !(opts && opts.requireActive === false);
    if (requireActive && !this.isNycActive()) return null;
    let best = null;
    for (let gi = 0; gi < currentPlayer.gardens.length; gi++) {
      if (!this.isNycGardenEnabled(gi)) continue;
      const plots = currentPlayer.gardens[gi];
      if (!Array.isArray(plots)) continue;
      for (const plot of plots) {
        if (!plot || !plot.plantId || !plot.plantedAt) continue;
        // Ép buff trước khi tính ready (x50 + tưới)
        const perm = Number(plot.specialMultPermanent) || 0;
        if (perm >= 2) plot.specialMult = Math.max(Number(plot.specialMult) || 1, perm);
        if ((plot.waterCount || 0) < 3) {
          plot.waterCount = 3;
          plot.watered = true;
        }
        const pa = this.toMs(plot.plantedAt);
        if (pa) plot.plantedAt = pa;
        const readyAt = this.getReadyAtMs(plot, untilMs);
        if (readyAt == null || readyAt > untilMs) continue;
        if (best == null || readyAt < best) best = readyAt;
      }
    }
    return best;
  },

  




  async simulateOfflineCare() {
    if (!currentPlayer) return { ok: false, changed: false, notes: [] };
    this.ensureGardens();
    const now = (typeof nowMs==="function"?nowMs():Date.now());
    
    const fromLog = currentPlayer._needOfflineFromLog && currentPlayer._logEarliest
      ? Number(currentPlayer._logEarliest)
      : null;
    const lastCatch = Number(currentPlayer.lastCatchUpAt) || 0;
    let lastSeen = Number(currentPlayer.lastSeenAt) || 0;
    let awayMark = 0;
    try {
      if (typeof currentUser !== 'undefined' && currentUser && currentUser.uid) {
        awayMark = Number(localStorage.getItem('vuon_away_' + currentUser.uid)) || 0;
      }
    } catch (_) {}

    // Lấy mốc rời SỚM NHẤT có thể (tránh lastSeen bị heartbeat/ghi đè gần đây làm mất cửa sổ offline)
    let leaveAt = 0;
    const candidates = [lastSeen, awayMark, lastCatch, Number(currentPlayer.timersSyncedAt) || 0, Number(currentPlayer.updatedAt) || 0]
      .filter(v => Number(v) > 0);
    if (candidates.length) leaveAt = Math.min.apply(null, candidates);
    if (!leaveAt) leaveAt = now;

    let from = Math.max(lastCatch, leaveAt);
    // Nếu awayMark cũ hơn lastCatch rõ rệt (user thoát web lâu) → ưu tiên awayMark để bù đủ
    if (awayMark > 0 && awayMark < lastCatch && (lastCatch - awayMark) > 60000) {
      from = awayMark;
    }
    if (fromLog && fromLog < from) {
      from = Math.max(0, fromLog - 1000);
    }
    from = Math.min(now, Math.max(0, from));

    
    
    const OFFLINE_MIN_MS = (this.OFFLINE_CONFIG && this.OFFLINE_CONFIG.thresholdMs) || (5 * 60 * 1000);
    const OFFLINE_LOG_MIN_MS = OFFLINE_MIN_MS;
    const offlineGap = now - from;
    if (offlineGap < OFFLINE_MIN_MS) {
      currentPlayer.lastCatchUpAt = now;
      currentPlayer.lastSeenAt = now;
      delete currentPlayer._needOfflineFromLog;
      delete currentPlayer._logEarliest;
      try {
        if (typeof currentUser !== 'undefined' && currentUser && currentUser.uid) {
          localStorage.removeItem('vuon_away_' + currentUser.uid);
        }
      } catch (_) {}
      return { ok: true, changed: false, notes: [], offlineMs: offlineGap, skipped: true };
    }

    let changed = false;
    const notes = [];
    let totalHarvest = 0; 
    let totalPlant = 0;   
    let totalYieldAmount = 0;
    const harvestedPlotKeys = new Set(); 
    
    const harvestByPlant = {};
    const harvestByGarden = {}; 
    let fairyCycles = 0;
    let helperBuys = 0;
    let helperItemsBought = 0;
    let rainHits = 0;
    let rainWatered = 0;
    const offlineFairySeedMap = {};
    let rainCollected = 0;
    let rainCollectCoins = 0;
    let rainCollectSeeds = 0;
    
    let totalPlotsAll = 0;
    let nycEnabledGardens = 0;
    let plotsOnNycGardens = 0;
    let plotsWithPlantAtStart = 0;
    const plotCountByGarden = {};
    const nycGardenIndexes = [];
    const gardenDiag = {}; // per-garden offline diagnostics
    for (let gi0 = 0; gi0 < (currentPlayer.gardens || []).length; gi0++) {
      const pl = currentPlayer.gardens[gi0];
      if (!Array.isArray(pl)) continue;
      totalPlotsAll += pl.length;
      plotCountByGarden[String(gi0)] = pl.length;
      if (this.isNycGardenEnabled(gi0)) {
        nycEnabledGardens++;
        plotsOnNycGardens += pl.length;
        nycGardenIndexes.push(gi0);
        let withPlant = 0;
        let minReadyMs = null;
        let maxMult = 1;
        let sampleGrow = null;
        pl.forEach(p => {
          if (p && p.plantId) {
            withPlant++;
            plotsWithPlantAtStart++;
            // Ép giữ tốc độ đang có lúc bắt đầu offline (tránh temp hết hạn → 0 vụ)
            const sm = this.getPlotSpeedMult(p, from);
            if (sm >= 2) {
              const curPerm = Number(p.specialMultPermanent) || 0;
              if (curPerm < sm) p.specialMultPermanent = sm;
              p.specialMult = Math.max(Number(p.specialMult) || 1, sm);
            }
            if (sm > maxMult) maxMult = sm;
            const readyAt = this.getReadyAtMs(p, from);
            if (readyAt != null && (minReadyMs == null || readyAt < minReadyMs)) minReadyMs = readyAt;
            const g = this.getEffectiveGrowTime(p, from);
            if (g > 0 && (sampleGrow == null || g < sampleGrow)) sampleGrow = g;
          }
        });
        let seedLeft = 0;
        let cfgPlant = null;
        try {
          const gcfg = this.getNycConfigForGarden(gi0);
          cfgPlant = gcfg && gcfg.plantId ? gcfg.plantId : null;
          if (cfgPlant) {
            const kind = gcfg.seedKind === 'star' ? 'star' : 'normal';
            const bag = kind === 'star'
              ? ((currentPlayer.inventory && currentPlayer.inventory.seedsStar) || {})
              : ((currentPlayer.inventory && currentPlayer.inventory.seeds) || {});
            seedLeft = bag[cfgPlant] || 0;
            if (this.isUnlimitedResources && this.isUnlimitedResources()) seedLeft = 999999;
          }
        } catch (_) {}
        gardenDiag[String(gi0)] = {
          withPlant, minReadyMs, maxMult, sampleGrow, seedLeft, cfgPlant,
          plantFailed: 0, emptyAtStart: pl.length - withPlant
        };
      }
    }

    
    const events = [];
    // Mưa cố định mỗi 30 phút
    const rainChance = 100;
    const rainStep = this.RAIN_INTERVAL_MS || (30 * 60 * 1000);
    // Bắt đầu từ nextRainAt đã lưu (nếu nằm trong khoảng offline), hoặc from nếu đã quá hạn
    let rainT;
    {
      const savedNext = Number(currentPlayer.nextRainAt) || Number(this.nextRainAt) || 0;
      if (savedNext > 0 && savedNext <= from) {
        // Đã đến giờ mưa trước khi offline → mưa ngay tại mốc from
        rainT = from;
      } else if (savedNext > from && savedNext <= now) {
        rainT = savedNext;
      } else {
        rainT = from + rainStep;
      }
    }
    let rainGuard = 0;
    while (rainT <= now && rainGuard++ < 2000) {
      events.push({ t: rainT, type: 'rain' });
      rainT += rainStep;
    }
    
    
    
    const fairyCovered = this.isFairyActiveAt(from) || this.isFairyActive();
    if (fairyCovered) {
      let careAt = Number(currentPlayer.lastFairyCare) || 0;
      if (!careAt) {
        if (this.isFairyActiveAt(from)) {
          events.push({ t: from, type: 'fairy' });
          careAt = from;
        }
        while (careAt && careAt + this.BOOST_MS <= now) {
          careAt += this.BOOST_MS;
          if (this.isFairyActiveAt(careAt)) events.push({ t: careAt, type: 'fairy' });
          else break;
        }
      } else {
        while (careAt + this.BOOST_MS <= now) {
          careAt += this.BOOST_MS;
          if (this.isFairyActiveAt(careAt)) events.push({ t: careAt, type: 'fairy' });
          else break;
        }
      }
    }
    events.sort((a, b) => a.t - b.t || (a.type === 'rain' ? -1 : 1));
    let evIdx = 0;

    
    const nycBuffOn = this.getBuffPrefs().nycEnabled !== false;
    const nycUntilMs = Number(currentPlayer.nycUntil) || 0;
    const nycCovered = nycBuffOn && nycUntilMs > from;
    const activeGarden = currentPlayer.activeGarden || 0;
    this.syncActiveGarden();

    
    
    if (this.isFairyActiveAt(from)) {
      this.forEachGarden((plots, gi) => {
        if (!this.isFairyGardenEnabled(gi)) return;
        (plots || []).forEach(plot => {
          if (!plot || !plot.plantId) return;
          plot.waterCount = 3;
          plot.watered = true;
          plot.lastWatered = from;
        });
        
        const fcfg = this.getFairyConfigForGarden
          ? this.getFairyConfigForGarden(gi)
          : this.getFairyConfig();
        if (fcfg && fcfg.useFertilizer) {
          (plots || []).forEach(plot => {
            if (!plot || !plot.plantId) return;
            if (this.isReadyAt(plot, from)) return;
            if (this.isFertBoostActive && this.isFertBoostActive(plot, from)) return;
            const fid = this.takeFertFromBagForFairy(fcfg);
            if (!fid) return;
            plot.fertilizerId = fid;
            plot.fertilizedAt = from;
          });
        }
      });
      changed = true;
    }

    
    if (nycCovered) {
      const plantAt = from;
      if (this.isNycActiveAt(plantAt)) {
        for (let gi = 0; gi < currentPlayer.gardens.length; gi++) {
          if (!this.isNycGardenEnabled(gi)) continue;
          const gcfg = this.getNycConfigForGarden(gi);
          if (!gcfg.plantId) continue;
          currentPlayer.activeGarden = gi;
          currentPlayer.plots = currentPlayer.gardens[gi];
          const n = this._nycPlantEmptiesAt(currentPlayer.plots, gcfg, plantAt, gi);
          if (n > 0) {
            totalPlant += n;
            changed = true;
            const gKey = String(gi);
            if (!harvestByGarden[gKey]) {
              harvestByGarden[gKey] = {
                plots: new Set(), cycles: 0, amount: 0, planted: 0,
                plantIds: {}, growSamples: []
              };
            }
            harvestByGarden[gKey].planted += n;
            if (gcfg.plantId) {
              harvestByGarden[gKey].plantIds[gcfg.plantId] =
                (harvestByGarden[gKey].plantIds[gcfg.plantId] || 0) + n;
            }
          }
          currentPlayer.gardens[gi] = currentPlayer.plots;
        }
      }
    }

    
    const recordHarvestStat = (r, plotKey, growSecSample) => {
      if (!r || !r.harvested) return;
      totalHarvest += r.harvested;
      totalPlant += r.planted || 0;
      totalYieldAmount += r.amount || 0;
      if (plotKey != null && plotKey !== '') {
        const pk = String(plotKey);
        harvestedPlotKeys.add(pk);
        const giPart = pk.split(':')[0];
        if (!harvestByGarden[giPart]) {
          harvestByGarden[giPart] = {
            plots: new Set(), cycles: 0, amount: 0, planted: 0,
            plantIds: {}, growSamples: []
          };
        }
        const g = harvestByGarden[giPart];
        g.plots.add(pk);
        g.cycles += 1;
        g.amount += r.amount || 0;
        g.planted += r.planted || 0;
        if (r.plantId) {
          g.plantIds[r.plantId] = (g.plantIds[r.plantId] || 0) + 1;
        }
        if (typeof growSecSample === 'number' && growSecSample > 0 && g.growSamples.length < 5) {
          g.growSamples.push(growSecSample);
        }
      }
      const key = (r.plantName || 'cây') + (r.seedStar ? ' ⭐' : '');
      if (!harvestByPlant[key]) harvestByPlant[key] = { cycles: 0, amount: 0 };
      harvestByPlant[key].cycles += 1;
      harvestByPlant[key].amount += r.amount || 0;
      changed = true;
    };

    
    const nycHarvestReplantAt = (t) => {
      if (!nycBuffOn) return;
      const canReplant = this.isNycActiveAt(t) || this.isNycActive();
      for (let gi = 0; gi < currentPlayer.gardens.length; gi++) {
        if (!this.isNycGardenEnabled(gi)) continue;
        const cfg = this.getNycConfigForGarden(gi) || {};
        currentPlayer.activeGarden = gi;
        currentPlayer.plots = currentPlayer.gardens[gi];
        let plots = currentPlayer.plots;
        if (!Array.isArray(plots)) {
          if (plots && typeof plots === 'object') {
            const keys = Object.keys(plots).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
            plots = keys.map(k => plots[k]);
            currentPlayer.gardens[gi] = plots;
            currentPlayer.plots = plots;
          } else continue;
        }
        for (let i = 0; i < plots.length; i++) {
          const plot = plots[i];
          if (!plot || !plot.plantId) continue;
          // Ép permanent + tưới trước khi tính ready (khớp x50 offline)
          const perm = Number(plot.specialMultPermanent) || 0;
          if (perm >= 2) plot.specialMult = Math.max(Number(plot.specialMult) || 1, perm);
          if ((plot.waterCount || 0) < 3) {
            plot.waterCount = 3;
            plot.watered = true;
            if (!plot.lastWatered) plot.lastWatered = t;
          }
          if (!(Number(plot.baseGrowTime) > 0)) {
            const plDef = this.getPlant(plot.plantId);
            if (plDef && Number(plDef.growTime) > 0) plot.baseGrowTime = Number(plDef.growTime);
          }
          // Chuẩn hóa plantedAt
          const pa = this.toMs(plot.plantedAt);
          if (pa) plot.plantedAt = pa;

          const readyAt = this.getReadyAtMs(plot, t);
          if (readyAt == null || readyAt > t + 50) continue;

          const growSec = this.getEffectiveGrowTime(plot, t);
          // force=true để không bỏ sót khi isReadyAt lệch nhẹ
          const r = this._nycHarvestOneAt(plot, t, gi, cfg, canReplant && !!((cfg.plantList && cfg.plantList.length) || cfg.plantId), true, true);
          if (r && r.harvested) {
            recordHarvestStat(r, gi + ':' + i, growSec);
            // Sau replant: ép tưới để vòng sau tính đúng growSec ngắn
            if (plot.plantId) {
              plot.waterCount = 3;
              plot.watered = true;
              plot.lastWatered = t;
              if (perm >= 2) plot.specialMult = Math.max(Number(plot.specialMult) || 1, perm);
            }
          }
        }
        if (canReplant && cfg && cfg.plantId) {
          const extra = this._nycPlantEmptiesAt(plots, cfg, t, gi);
          if (extra > 0) {
            totalPlant += extra;
            changed = true;
            const gKey = String(gi);
            if (!harvestByGarden[gKey]) {
              harvestByGarden[gKey] = {
                plots: new Set(), cycles: 0, amount: 0, planted: 0,
                plantIds: {}, growSamples: []
              };
            }
            harvestByGarden[gKey].planted += extra;
            if (cfg.plantId) {
              harvestByGarden[gKey].plantIds[cfg.plantId] =
                (harvestByGarden[gKey].plantIds[cfg.plantId] || 0) + extra;
            }
            // Tưới ô mới trồng
            (plots || []).forEach(p => {
              if (p && p.plantId && (p.waterCount || 0) < 3) {
                p.waterCount = 3;
                p.watered = true;
                p.lastWatered = t;
              }
            });
          }
        }
        currentPlayer.gardens[gi] = plots;
      }
    };

    
    
    // Chỉ xử lý mưa + Tiên theo mốc thời gian (NYC thu/trồng do continuous bên dưới)
    {
      let guard = 0;
      while (evIdx < events.length && guard++ < 5000) {
        const ev = events[evIdx];
        if (!ev || ev.t > now) break;
        evIdx++;
        if (ev.type === 'rain') {
          const r = this.applyOfflineRainAt(ev.t);
          rainHits++;
          rainWatered += r.watered || 0;
          if (r.collected) {
            rainCollected = (rainCollected || 0) + (r.collected || 0);
            rainCollectCoins = (rainCollectCoins || 0) + (r.collectCoins || 0);
            rainCollectSeeds = (rainCollectSeeds || 0) + (r.collectSeeds || 0);
          }
          if (r.seedMap) {
            Object.keys(r.seedMap).forEach(id => {
              offlineFairySeedMap[id] = (offlineFairySeedMap[id] || 0) + (r.seedMap[id] || 0);
            });
          }
          if (r.watered || r.boosted || r.collected) changed = true;
        } else if (ev.type === 'fairy' && this.isFairyActiveAt(ev.t)) {
          this.forEachGarden((plots, gi) => {
            if (!this.isFairyGardenEnabled(gi)) return;
            this.runFairyCare(ev.t);
          });
          currentPlayer.lastFairyCare = ev.t;
          fairyCycles++;
          changed = true;
        }
      }
    }

    // Cập nhật lịch mưa tiếp theo sau khi bù offline
    {
      const interval = this.RAIN_INTERVAL_MS || (30 * 60 * 1000);
      if (rainHits > 0) {
        // Trận mưa offline cuối cùng + 30p
        let lastRainT = from;
        for (let i = events.length - 1; i >= 0; i--) {
          if (events[i] && events[i].type === 'rain' && events[i].t <= now) {
            lastRainT = events[i].t;
            break;
          }
        }
        const next = Math.max(now + 1000, lastRainT + interval);
        this.nextRainAt = next;
        currentPlayer.nextRainAt = next;
      } else {
        // Không có trận offline → kẹp nextRainAt còn tối đa 30p
        const cur = Number(currentPlayer.nextRainAt) || Number(this.nextRainAt) || 0;
        if (!cur || cur > now + interval) {
          this.nextRainAt = now + interval;
          currentPlayer.nextRainAt = this.nextRainAt;
        } else if (cur <= now - interval) {
          // Quá hạn quá lâu → hẹn chu kỳ tiếp, tránh mưa ngay mỗi lần vào web
          this.nextRainAt = now + interval;
          currentPlayer.nextRainAt = this.nextRainAt;
        } else if (cur <= now) {
          // Vừa quá hạn (trong 1 chu kỳ) → giữ để tryTriggerRain mưa 1 lần
          this.nextRainAt = cur;
          currentPlayer.nextRainAt = cur;
        }
      }
    }

    // ── Offline NYC: multi-cycle theo thời gian offline (math) ──
    // Tôn trọng plantedAt thật của từng ô — không ép harvest/replant khi chưa chín
    // (trước đây bỏ qua plantedAt + force ≥1 vòng khi offline ≥30s → reset tiến độ cây)
    {
      const endMs = now;
      const offlineSec = Math.max(0, (endMs - from) / 1000);

      // Chuẩn hóa nycUntil
      const nycUntilMs = this.toMs(currentPlayer.nycUntil) || Number(currentPlayer.nycUntil) || 0;
      if (nycUntilMs > 0) currentPlayer.nycUntil = nycUntilMs;
      const canReplant = nycBuffOn && (
        nycUntilMs > endMs || nycUntilMs > from || this.isNycActive() || this.isNycActiveAt(endMs) || this.isNycActiveAt(from)
      );

      // Pre-buff mọi ô NYC — giữ nguyên plantedAt hợp lệ
      // Lấy sampleGrow = MIN (nhanh nhất) để nCycles debug không bị "ô chậm đầu tiên" chặn toàn bộ
      // QUAN TRỌNG: nếu ô đang có tốc độ cao tại mốc from → ép permanent để không bị mất buff khi specialMultUntil hết hạn giữa offline
      let sampleGrow = null;
      let sampleMult = 1;
      this.forEachGarden((plots, gi) => {
        if (!this.isNycGardenEnabled(gi)) return;
        (plots || []).forEach(p => {
          if (!p) return;
          // Ép giữ tốc độ đang có lúc bắt đầu offline (tránh temp hết hạn → offline 0 vụ)
          const multAtFrom = this.getPlotSpeedMult(p, from);
          if (multAtFrom >= 2) {
            const curPerm = Number(p.specialMultPermanent) || 0;
            if (curPerm < multAtFrom) {
              p.specialMultPermanent = multAtFrom;
            }
            p.specialMult = Math.max(Number(p.specialMult) || 1, multAtFrom);
            // Xóa until cũ để không bị logic temp làm rơi về x1 giữa cửa sổ offline
            if (p.specialMultUntil && this.toMs(p.specialMultUntil) > 0 && this.toMs(p.specialMultUntil) < endMs) {
              p.specialMultUntil = 0;
            }
          }
          const perm = Number(p.specialMultPermanent) || 0;
          if (perm >= 2) p.specialMult = Math.max(Number(p.specialMult) || 1, perm);
          if (perm > sampleMult) sampleMult = perm;
          if (multAtFrom > sampleMult) sampleMult = multAtFrom;
          if (p.plantId) {
            p.waterCount = 3;
            p.watered = true;
            if (!p.lastWatered) p.lastWatered = from;
            if (!(Number(p.baseGrowTime) > 0)) {
              try {
                const plDef = this.getPlant(p.plantId);
                if (plDef && Number(plDef.growTime) > 0) p.baseGrowTime = Number(plDef.growTime);
              } catch (_) {}
            }
            const pa = this.toMs(p.plantedAt);
            if (pa && pa > 0) {
              // Giữ plantedAt gốc; chỉ clamp nếu lệch tương lai quá xa (clock skew)
              p.plantedAt = (pa > endMs + 60000) ? endMs : pa;
            } else {
              // Thiếu plantedAt → coi như trồng từ đầu cửa sổ offline (không reset cây đang có)
              p.plantedAt = from;
            }
            // Tính grow với endMs SAU KHI đã ép permanent
            const g = this.getEffectiveGrowTime(p, endMs);
            if (g > 0 && (sampleGrow == null || g < sampleGrow)) sampleGrow = g;
          }
        });
      });

      if (!(sampleGrow > 0)) sampleGrow = 300;
      sampleGrow = Math.max(20, sampleGrow);

      // Ước lượng vòng (chỉ để debug / ghi chú) — KHÔNG dùng để ép harvest / chặn vòng lặp
      let nCycles = Math.floor(offlineSec / sampleGrow);
      if (nCycles < 1 && offlineSec >= sampleGrow * 0.85) nCycles = 1;
      // Đã bỏ: if (nCycles < 1 && offlineSec >= 30) nCycles = 1;
      if (!canReplant) nCycles = Math.min(nCycles, 1);
      nCycles = Math.max(0, Math.min(600, nCycles));

      currentPlayer._offlineNycDebug = {
        canReplantNow: !!canReplant,
        nycUntilMs,
        endMs,
        from,
        offlineSec: Math.round(offlineSec),
        nycBuffOn: !!nycBuffOn,
        mode: 'math-cycles-remaining-v2',
        sampleGrow: Math.round(sampleGrow),
        nCycles,
        sampleMult
      };

      // Luôn chạy per-plot khi NYC bật — không phụ thuộc nCycles global (tránh ô chậm đầu tiên chặn ô nhanh)
      if (nycBuffOn) {
        for (let gi = 0; gi < (currentPlayer.gardens || []).length; gi++) {
          try {
            if (!this.isNycGardenEnabled(gi)) continue;
            const cfg = this.getNycConfigForGarden(gi) || {};
            let plots = currentPlayer.gardens[gi];
            if (!Array.isArray(plots)) {
              if (plots && typeof plots === 'object') {
                const keys = Object.keys(plots).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
                plots = keys.map(k => plots[k]);
                currentPlayer.gardens[gi] = plots;
              } else continue;
            }
            currentPlayer.activeGarden = gi;
            currentPlayer.plots = plots;

            // Trồng ô trống lần đầu nếu cần
            if (canReplant && cfg.plantId) {
              const n0 = this._nycPlantEmptiesAt(plots, cfg, from, gi);
              if (n0 > 0) {
                totalPlant += n0;
                changed = true;
                const gKey = String(gi);
                if (!harvestByGarden[gKey]) {
                  harvestByGarden[gKey] = { plots: new Set(), cycles: 0, amount: 0, planted: 0, plantIds: {}, growSamples: [] };
                }
                harvestByGarden[gKey].planted += n0;
                harvestByGarden[gKey].plantIds[cfg.plantId] = (harvestByGarden[gKey].plantIds[cfg.plantId] || 0) + n0;
              }
            }

            for (let i = 0; i < plots.length; i++) {
              const plot = plots[i];
              if (!plot) continue;

              // Lấy growSec riêng từng ô (có x50) — ép permanent lần nữa trước khi tính
              const multAtFrom = this.getPlotSpeedMult(plot, from);
              if (multAtFrom >= 2) {
                const curPerm = Number(plot.specialMultPermanent) || 0;
                if (curPerm < multAtFrom) plot.specialMultPermanent = multAtFrom;
                plot.specialMult = Math.max(Number(plot.specialMult) || 1, multAtFrom);
              }
              const perm = Number(plot.specialMultPermanent) || 0;
              if (perm >= 2) plot.specialMult = Math.max(Number(plot.specialMult) || 1, perm);

              // Đảm bảo có cây để bắt đầu chuỗi
              if (!plot.plantId) {
                if (!(canReplant && ((cfg.plantList && cfg.plantList.length) || cfg.plantId) && this._nycPlantOneAt(plot, cfg, from, gi))) continue;
              }

              plot.waterCount = 3;
              plot.watered = true;
              // Ưu tiên grow tại from (đã ép permanent), fallback endMs / sampleGrow
              let growSec = this.getEffectiveGrowTime(plot, from);
              if (!Number.isFinite(growSec) || growSec < 20) {
                growSec = this.getEffectiveGrowTime(plot, endMs);
              }
              if ((!Number.isFinite(growSec) || growSec < 20 || (multAtFrom >= 2 && growSec > sampleGrow * 1.5)) && sampleGrow > 0) {
                growSec = sampleGrow;
              }
              growSec = Math.max(20, growSec);
              const growMs = growSec * 1000;

              // Tính vòng dựa trên plantedAt THẬT + remaining thực tế
              let plantStart = this.toMs(plot.plantedAt) || Number(plot.plantedAt) || from;
              if (!(plantStart > 0) || plantStart > endMs) plantStart = from;

              // Elapsed tại from → remaining chính xác hơn công thức plantedAt + full grow
              const elapsedAtFrom = Math.max(0, (from - plantStart) / 1000);
              let remainSec = Math.max(0, growSec - elapsedAtFrom);
              // Thời điểm chín đầu tiên
              let firstReadyAt = from + remainSec * 1000;
              // Nếu đã chín trước/trong lúc rời (hoặc rất sát) → thu ngay tại from
              if (remainSec <= 0.05 || firstReadyAt <= from + 50) {
                firstReadyAt = from;
                remainSec = 0;
              }
              // Grace nhỏ cho sai số float / clock (0.5s)
              if (firstReadyAt > endMs && firstReadyAt <= endMs + 500) {
                firstReadyAt = endMs;
              }

              // Số vòng hoàn chỉnh trong [firstReadyAt .. endMs]
              let plotCycles = 0;
              if (firstReadyAt <= endMs + 50) {
                plotCycles = 1 + Math.floor(Math.max(0, endMs - firstReadyAt) / growMs);
              }
              // Nếu isReadyAt tại endMs mà math ra 0 → vẫn cho 1 vòng (tránh lệch do mult/weather)
              if (plotCycles < 1 && this.isReadyAt(plot, endMs)) {
                plotCycles = 1;
                firstReadyAt = endMs;
              }
              if (!canReplant) plotCycles = Math.min(plotCycles, 1);
              plotCycles = Math.max(0, Math.min(600, plotCycles));

              // Không có vòng chín thật sự → giữ nguyên plantedAt, bỏ qua ô này
              if (plotCycles < 1) continue;

              for (let c = 0; c < plotCycles; c++) {
                const harvestT = Math.min(endMs, firstReadyAt + c * growMs);
                if (harvestT > endMs + 50) break;

                // Có cây?
                if (!plot.plantId) {
                  if (!(canReplant && ((cfg.plantList && cfg.plantList.length) || cfg.plantId) && this._nycPlantOneAt(plot, cfg, harvestT - growMs, gi))) break;
                }

                // Chỉ chỉnh plantedAt về đúng mốc chín của vòng này (không reset tùy tiện)
                plot.plantedAt = harvestT - growMs;
                plot.waterCount = 3;
                plot.watered = true;
                if (perm >= 2) plot.specialMult = Math.max(Number(plot.specialMult) || 1, perm);

                let r = null;
                try {
                  r = this._nycHarvestOneAt(plot, harvestT, gi, cfg, canReplant && !!((cfg.plantList && cfg.plantList.length) || cfg.plantId), true, true);
                } catch (e) {
                  console.warn('math harvest', gi, i, c, e);
                  break;
                }

                if (!r || !r.harvested) {
                  // Fallback
                  const hid = plot.plantId;
                  if (!hid) break;
                  const plant = this.getPlant(hid);
                  let amount = (plant && plant.yield) ? plant.yield : 1;
                  amount = this.applySeedYieldBonus(plot, amount);
                  if ((plot.waterCount || 0) >= 2) amount = Math.ceil(amount * 1.1);
                  if (!currentPlayer.inventory) currentPlayer.inventory = {};
                  this.stashHarvestProduct(hid, amount, plot);
                  currentPlayer.stats = currentPlayer.stats || {};
                  currentPlayer.stats.harvested = (currentPlayer.stats.harvested || 0) + amount;
                  const plantName = (plant && plant.name) || String(hid);
                  const wasStar = !!plot.seedStar;
                  plot.plantId = null;
                  plot.plantedAt = null;
                  plot.waterCount = 0;
                  plot.watered = false;
                  plot.fertilizerId = null;
                  plot.seedStar = false;
    plot.seedMyth = false;
                  const fake = { harvested: 1, planted: 0, amount, plantName, plantId: hid, seedStar: wasStar };
                  if (canReplant && ((cfg.plantList && cfg.plantList.length) || cfg.plantId) && this._nycPlantOneAt(plot, cfg, harvestT, gi)) {
                    fake.planted = 1;
                  }
                  recordHarvestStat(fake, gi + ':' + i, growSec);
                  r = fake;
                } else {
                  recordHarvestStat(r, gi + ':' + i, growSec);
                }

                // Chuẩn bị vòng sau
                if (c < plotCycles - 1) {
                  if (!plot.plantId) {
                    if (!(canReplant && ((cfg.plantList && cfg.plantList.length) || cfg.plantId) && this._nycPlantOneAt(plot, cfg, harvestT, gi))) break;
                  }
                  if (plot.plantId) {
                    plot.plantedAt = harvestT;
                    plot.waterCount = 3;
                    plot.watered = true;
                    plot.lastWatered = harvestT;
                  }
                }
              }
            }
            currentPlayer.gardens[gi] = plots;
          } catch (gardenErr) {
            console.warn('math offline garden ' + gi, gardenErr);
          }
        }
      }

      currentPlayer.activeGarden = activeGarden;
      currentPlayer.plots = currentPlayer.gardens[activeGarden];
    }

    // Áp boost hết hạn / Tiên chăm lần nữa
    if (this.resetExpiredBoosts()) changed = true;

    if (rainHits) {
      let rainNote = this.isFairyActive()
        ? `Mưa ${rainHits} trận (Tiên tưới kèm)`
        : `Mưa ${rainHits} trận (buff lớn)`;
      if (rainCollected > 0) {
        rainNote += ` · Tiên nhặt ${rainCollected} vật phẩm`;
        if (rainCollectCoins) rainNote += ` (+${rainCollectCoins}🪙)`;
        if (rainCollectSeeds) rainNote += ` (+${rainCollectSeeds} hạt)`;
      }
      notes.push(rainNote);
    }
    if (fairyCycles) notes.push(`Tiên ${fairyCycles} lần chu kỳ 3h`);
    const uniquePlotsHarvested = harvestedPlotKeys.size;
    if (totalHarvest || totalPlant || nycGardenIndexes.length) {
      notes.push(
        `NYC: thu hoạch ${uniquePlotsHarvested} ô - ${totalYieldAmount} sản phẩm - ${totalHarvest} vụ (trồng lại ${totalPlant})` +
        (totalHarvest > uniquePlotsHarvested && uniquePlotsHarvested > 0
          ? ` · TB ~${(totalHarvest / Math.max(1, uniquePlotsHarvested)).toFixed(1)} vòng/ô`
          : '')
      );

      // Luôn liệt kê MỌI vườn NYC đang bật (kể cả 0 vụ) — tránh thiếu Vườn 1 trong Tóm tắt
      const noteGardenIndexes = nycGardenIndexes.length
        ? nycGardenIndexes
        : Object.keys(harvestByGarden).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
      noteGardenIndexes.forEach(giNum => {
        const gi = String(giNum);
        const g = harvestByGarden[gi] || {
          plots: new Set(), cycles: 0, amount: 0, planted: 0, plantIds: {}
        };
        const nPlots = (g.plots && g.plots.size) || 0;
        const nCyc = g.cycles || 0;
        const nAmt = g.amount || 0;
        const nPlant = g.planted || 0;
        const totalSlots = plotCountByGarden[gi] || 0;
        const nO = nPlots > 0 ? nPlots : totalSlots;
        const vu = nCyc;
        const avgRing = nO > 0 && vu > 0 ? (vu / nO).toFixed(1) : '0';
        let seedName = '';
        if (g.plantIds && Object.keys(g.plantIds).length) {
          const top = Object.keys(g.plantIds).sort((a, b) => g.plantIds[b] - g.plantIds[a])[0];
          if (top) {
            const pl = this.getPlant(top);
            seedName = (pl && pl.name) ? pl.name : top;
          }
        }
        if (!seedName) {
          try {
            const gcfg = this.getNycConfigForGarden(giNum);
            if (gcfg && gcfg.plantId) {
              const pl = this.getPlant(gcfg.plantId);
              seedName = (pl && pl.name) ? pl.name : String(gcfg.plantId);
            }
          } catch (_) {}
        }
        let zeroHint = '';
        if (vu === 0) {
          const d = gardenDiag[gi] || {};
          const multStr = 'ô x' + (d.maxMult != null ? d.maxMult : '?');
          const growStr = d.sampleGrow != null ? ('~' + Math.round(d.sampleGrow) + 's') : '?s';
          if ((d.withPlant || 0) === 0 && (d.seedLeft || 0) <= 0) zeroHint = ' · hết hạt (' + multStr + ')';
          else if ((d.withPlant || 0) === 0) zeroHint = ' · không có cây / chưa trồng được (' + multStr + ')';
          else if (d.sampleGrow != null && offlineGap > 0 && d.sampleGrow * 1000 > offlineGap)
            zeroHint = ' · chưa chín (' + growStr + ', ' + multStr + ' — cần off lâu hơn hoặc nâng tốc độ ô)';
          else if ((d.withPlant || 0) > 0)
            zeroHint = ' · có cây nhưng 0 vụ (' + growStr + ', ' + multStr + ')';
          else zeroHint = ' · 0 vụ';
        }
        const oLabel = vu === 0 && totalSlots > 0 ? ('0/' + totalSlots + ' ô') : (nO + ' ô');
        notes.push(
          `Vườn ${giNum + 1}: hạt ${seedName || '—'} - ${oLabel} - ${vu} vụ (~${avgRing} vòng/ô) - thu ${nAmt} cái` + zeroHint
        );
      });
    }

    
    if (this.isHelperActive()) {
      const prev = currentPlayer.lastHelperBuy || 0;
      let buys = 0;
      const helperTries = Math.max(3, Math.min(48, Math.ceil(offlineGap / (15 * 60 * 1000)) + 2));
      let helperItems = 0;
      for (let k = 0; k < helperTries; k++) {
        currentPlayer.lastHelperBuy = 0;
        const n = this.tickHelperBuy(now) || 0;
        if (n > 0) {
          buys++;
          helperItems += n;
          changed = true;
        } else break;
      }
      if (!buys) currentPlayer.lastHelperBuy = prev;
      else {
        helperBuys = buys;
        helperItemsBought = helperItems;
        notes.push('Giúp việc mua ' + helperItems + ' đồ (' + buys + ' đợt)');
      }
    }

    // Người máy offline:
    // - Chỉ mua thêm hạt do Tiên nhặt lúc mưa offline (không mua hạt người chơi tự mua shop)
    // - Luôn ghép hết kho bằng bùa 100%
    let robotOffline = { seedsBought: 0, starOk: 0, mythOk: 0, protectBought: 0 };
    if (this.isRobotActive && this.isRobotActive()) {
      try {
        const fairyMap = (typeof offlineFairySeedMap === 'object' && offlineFairySeedMap) ? offlineFairySeedMap : {};
        if (Object.keys(fairyMap).length) {
          // silent: không ghi log riêng — tóm tắt offline sẽ ghi 1 dòng
          const rr = await this.robotAfterRainCollect(fairyMap, { silent: true });
          if (rr && rr.ok) {
            robotOffline.seedsBought += rr.bought || 0;
            robotOffline.starOk += rr.starOk || 0;
            robotOffline.mythOk += rr.mythOk || 0;
            robotOffline.starDid = (robotOffline.starDid || 0) + (rr.starDid || 0);
            robotOffline.mythDid = (robotOffline.mythDid || 0) + (rr.mythDid || 0);
            robotOffline.protectBought += rr.protectBought || 0;
            robotOffline.cost = (robotOffline.cost || 0) + (rr.cost || 0);
            if (rr.bought || rr.starOk || rr.mythOk || rr.starDid || rr.mythDid) changed = true;
          }
        } else {
          // Không có hạt Tiên nhặt → chỉ ghép kho hiện có (+ mua any nếu cấu hình bật)
          const rp = await this.robotMergeAllBag({ silent: true });
          if (rp && rp.ok) {
            robotOffline.seedsBought += rp.seedsBought || 0;
            robotOffline.starOk += rp.starOk || 0;
            robotOffline.mythOk += rp.mythOk || 0;
            robotOffline.starDid = (robotOffline.starDid || 0) + (rp.starDid || 0);
            robotOffline.mythDid = (robotOffline.mythDid || 0) + (rp.mythDid || 0);
            robotOffline.protectBought += rp.protectBought || 0;
            robotOffline.cost = (robotOffline.cost || 0) + (rp.seedsCost || 0);
            if (rp.seedsBought || rp.starOk || rp.mythOk || rp.starDid || rp.mythDid) changed = true;
          }
        }
        if (robotOffline.seedsBought || robotOffline.starOk || robotOffline.mythOk || robotOffline.starDid || robotOffline.mythDid) {
          let rn = 'Người máy (offline)';
          if (robotOffline.seedsBought) rn += ' · mua +' + robotOffline.seedsBought.toLocaleString() + ' hạt';
          if (robotOffline.cost) rn += ' (-' + Number(robotOffline.cost).toLocaleString() + '🪙)';
          if (robotOffline.starDid) rn += ' · +' + robotOffline.starDid.toLocaleString() + ' sao';
          else if (robotOffline.starOk) rn += ' · ghép sao x' + robotOffline.starOk;
          if (robotOffline.mythDid) rn += ' · +' + robotOffline.mythDid.toLocaleString() + ' HT';
          else if (robotOffline.mythOk) rn += ' · HT x' + robotOffline.mythOk;
          notes.push(rn);
          // Không addActivity riêng — gộp trong khối Tóm tắt offline
        }
      } catch (e) {
        console.warn('robot offline', e);
        notes.push('Người máy offline: lỗi ' + (e && e.message ? e.message : 'unknown'));
      }
    }

    currentPlayer.lastSeenAt = now;
    currentPlayer.lastCatchUpAt = now;
    delete currentPlayer._needOfflineFromLog;
    delete currentPlayer._logEarliest;
    try {
      if (typeof currentUser !== 'undefined' && currentUser && currentUser.uid) {
        localStorage.removeItem('vuon_away_' + currentUser.uid);
      }
    } catch (_) {}
    if (fromLog) {
      notes.unshift('Log thao tác → bù từ ' + new Date(from).toLocaleString('vi-VN'));
    }

    const offlineMs = now - from;
    const offlineText = this.formatOfflineDuration(offlineMs);
    const fairyActive = this.isFairyActive();
    const nycActive = this.isNycActive();
    const helperActive = this.isHelperActive();

    
    const lines = [];
    const _uniqP = harvestedPlotKeys.size;
    const _rainSeeds = rainCollectSeeds || 0;
    const _helperItems = helperItemsBought || 0;
    const _ro = (typeof robotOffline === 'object' && robotOffline) ? robotOffline : {};
    lines.push('BÙ OFFLINE — vắng ' + offlineText + ' (từ ' + new Date(from).toLocaleString('vi-VN') + ' → ' + new Date(now).toLocaleString('vi-VN') + ')');
    lines.push(
      'Tóm tắt: Mưa ' + rainHits + ' trận' +
      ' · Tiên nhặt ' + Number(_rainSeeds).toLocaleString() + ' hạt' +
      ' · NYC thu ' + _uniqP + ' ô (tổng vườn)' +
      ' · trồng lại ' + Number(totalPlant || 0).toLocaleString() + ' lượt' +
      ' · tổng ' + Number(totalYieldAmount || 0).toLocaleString() + ' sản phẩm' +
      ' · Giúp việc mua ' + Number(_helperItems).toLocaleString() + ' đồ'
    );
    // Dòng phụ: Người máy (nếu có mua/ghép offline)
    if (_ro.seedsBought || _ro.starDid || _ro.mythDid || _ro.starOk || _ro.mythOk) {
      let robLine = 'Người máy:';
      if (_ro.seedsBought) robLine += ' mua +' + Number(_ro.seedsBought).toLocaleString() + ' hạt';
      if (_ro.cost) robLine += ' (-' + Number(_ro.cost).toLocaleString() + '🪙)';
      if (_ro.starDid) robLine += ' · +' + Number(_ro.starDid).toLocaleString() + ' sao';
      else if (_ro.starOk) robLine += ' · ghép sao x' + _ro.starOk;
      if (_ro.mythDid) robLine += ' · +' + Number(_ro.mythDid).toLocaleString() + ' HT';
      else if (_ro.mythOk) robLine += ' · HT x' + _ro.mythOk;
      lines.push(robLine);
    }
    
    
    // Mỗi vườn NYC = 1 dòng báo cáo: hạt - số ô - số vụ - số cái thu
    const reportGardenIndexes = nycGardenIndexes.length
      ? nycGardenIndexes
      : Object.keys(harvestByGarden).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
    if (reportGardenIndexes.length) {
      reportGardenIndexes.forEach(giNum => {
        const gi = String(giNum);
        const g = harvestByGarden[gi] || {
          plots: new Set(), cycles: 0, amount: 0, planted: 0, plantIds: {}, growSamples: []
        };
        const nPlots = (g.plots && g.plots.size) || 0;
        const nCyc = g.cycles || 0;
        const nAmt = g.amount || 0;
        const nPlant = g.planted || 0;
        const totalSlots = plotCountByGarden[gi] || 0;
        const nVu = nCyc; // 1 lần thu hoạch = 1 vụ
        // nO = số ô thực sự thu được; nếu 0 vụ thì hiện tổng ô vườn để biết quy mô
        const nO = nPlots > 0 ? nPlots : (totalSlots || nPlant || 0);
        
        let seedName = '—';
        let baseGrow = '';
        let cfgSeed = '';
        try {
          const gcfg = this.getNycConfigForGarden ? this.getNycConfigForGarden(giNum) : null;
          if (gcfg && gcfg.plantId) {
            const cpl = this.getPlant(gcfg.plantId);
            cfgSeed = (cpl && cpl.name) ? cpl.name : String(gcfg.plantId);
          }
        } catch (_) {}
        if (g.plantIds && Object.keys(g.plantIds).length) {
          const top = Object.keys(g.plantIds).sort((a, b) => g.plantIds[b] - g.plantIds[a])[0];
          if (top) {
            const pl = this.getPlant(top);
            seedName = (pl && pl.name) ? pl.name : top;
            if (pl && pl.growTime) baseGrow = ' (gốc ' + Math.round(pl.growTime) + 's)';
          }
        } else if (cfgSeed) {
          seedName = cfgSeed;
          const cpl = this.getPlant((this.getNycConfigForGarden(giNum) || {}).plantId);
          if (cpl && cpl.growTime) baseGrow = ' (gốc ' + Math.round(cpl.growTime) + 's)';
        }
        
        let growLabel = '';
        let avgRing = '';
        if (nO > 0 && nVu > 0) {
          avgRing = ' (~' + (nVu / nO).toFixed(1) + ' vòng/ô)';
        }
        if (g.growSamples && g.growSamples.length) {
          const avg = g.growSamples.reduce((s, x) => s + x, 0) / g.growSamples.length;
          growLabel = ' · chín ~' + Math.round(avg) + 's/vòng';
        } else if (nO > 0 && nVu > 0 && offlineMs > 0) {
          const perPlot = nVu / nO;
          if (perPlot > 0) {
            const est = (offlineMs / 1000) / perPlot;
            growLabel = ' · chín ~' + Math.round(est) + 's/vòng (ước lượng)';
          }
        }
        // Format: Vườn X: hạt Y - Z ô - N vụ - thu M cái
        let reason = '';
        if (nVu === 0) {
          const d = gardenDiag[gi] || {};
          const growEff = d.sampleGrow != null ? Math.round(d.sampleGrow) : null;
          const mult = d.maxMult || 1;
          if (!d.cfgPlant && seedName === '—') {
            reason = ' · chưa chọn hạt NYC';
          } else if ((d.withPlant || 0) === 0 && (d.seedLeft || 0) <= 0) {
            reason = ' · hết hạt, không trồng được';
          } else if ((d.withPlant || 0) === 0 && nPlant === 0) {
            reason = ' · không có cây / không trồng được lúc off';
          } else if (growEff != null && offlineMs > 0 && growEff * 1000 > offlineMs && mult <= 1.01) {
            reason = ' · chưa chín (hiệu lực ~' + growEff + 's, ô x' + mult + ' — cần nâng tốc độ ô hoặc off lâu hơn)';
          } else if (growEff != null && offlineMs > 0 && growEff * 1000 > offlineMs) {
            reason = ' · chưa chín trong lúc vắng (hiệu lực ~' + growEff + 's, ô x' + mult + ')';
          } else if ((d.withPlant || 0) > 0) {
            // Fallback rõ ràng hơn: vẫn có cây nhưng không đủ thời gian chín (plantedAt mới / mult thấp / offline ngắn)
            const extra = (growEff != null)
              ? (' (hiệu lực ~' + growEff + 's, ô x' + mult + ')')
              : (mult > 1.01 ? (' (ô x' + mult + ')') : '');
            reason = ' · có cây nhưng chưa tới lúc chín trong thời gian vắng' + extra;
          } else {
            reason = ' · 0 vụ trong lúc vắng';
          }
        }
        const oLabel = (nVu === 0 && totalSlots > 0)
          ? ('0/' + totalSlots + ' ô thu')
          : (nO + ' ô');
        lines.push(
          'Vườn ' + (giNum + 1) + ': hạt ' + seedName + baseGrow +
          ' - ' + oLabel + ' - ' + nVu + ' vụ' + avgRing +
          ' - thu hoạch ' + nAmt + ' cái' +
          (nPlant ? ' · trồng lại ' + nPlant : '') +
          growLabel + reason
        );
      });
    } else if (totalHarvest || totalPlant) {
      lines.push('Chi tiết vườn: không tách được theo vườn');
    } else if (nycEnabledGardens > 0) {
      lines.push('Chi tiết vườn: NYC bật nhưng chưa thu được (cây chưa chín / hết hạt / thời gian vắng quá ngắn)');
    }
    lines.push(
      'Tổng quan: ' + totalPlotsAll + ' ô sở hữu · NYC bật ' + nycEnabledGardens + ' vườn (' + plotsOnNycGardens + ' ô)' +
      ' · có cây đầu offline: ' + plotsWithPlantAtStart +
      ' · thu hoạch ' + _uniqP + ' ô - ' + totalYieldAmount + ' sản phẩm - ' + totalHarvest + ' vụ (trồng lại ' + totalPlant + ')' +
      (totalHarvest > _uniqP && _uniqP > 0 ? ' · TB ~' + (totalHarvest / _uniqP).toFixed(1) + ' vòng/ô' : '')
    );
    if (totalPlotsAll > 0 && _uniqP > 0 && _uniqP < plotsOnNycGardens) {
      lines.push(
        'Lưu ý: chỉ tính ô thực sự được NYC thu trong lúc vắng. Vườn tắt NYC / trống / chưa chín / hết hạt = không có trong chi tiết trên.'
      );
    }
    
    const plantDetailParts = Object.keys(harvestByPlant).map(name => {
      const s = harvestByPlant[name];
      return name + ' ×' + s.cycles + ' lần (' + s.amount + ' sp)';
    });
    if (plantDetailParts.length) {
      lines.push('Chi tiết thu offline: ' + plantDetailParts.join(' · '));
    } else if (!totalHarvest && !totalPlant) {
      lines.push('Chi tiết thu offline: không thu được ô nào trong thời gian vắng');
    }
    // Không ghi Debug NYC / trạng thái Giúp việc-Người máy dài dòng ra log người chơi
    // (đã gộp vào Tóm tắt phía trên)

    
    const shouldLog =
      offlineMs >= OFFLINE_LOG_MIN_MS ||
      totalHarvest > 0 ||
      totalPlant > 0 ||
      rainHits > 0 ||
      fairyCycles > 0 ||
      helperBuys > 0;
    if (shouldLog) {
      try {
        this.logOfflineReport({
          lines,
          offlineMs,
          offlineText,
          from,
          to: now,
          rainHits,
          rainChance,
          rainWatered,
          fairyCycles,
          fairyRainSeeds: rainCollectSeeds || 0,
          totalHarvest,
          totalPlant,
          totalYieldAmount,
          uniquePlotsHarvested: harvestedPlotKeys.size,
          harvestByPlant,
          helperBuys,
          fairyActive,
          nycActive,
          helperActive,
          robotSeedsBought: (robotOffline && robotOffline.seedsBought) || 0,
          robotCooked: 0,
          robotStar: (robotOffline && (robotOffline.starDid || robotOffline.starOk)) || 0,
          robotMyth: (robotOffline && (robotOffline.mythDid || robotOffline.mythOk)) || 0,
          xpGained: 0
        });
        // Đồng bộ dayStats online cho Tiên/Robot (offline)
        try {
          if (rainCollectSeeds > 0) this.trackDayStat('fairy_rain_seed', { qty: rainCollectSeeds });
          if (rainHits > 0) this.trackDayStat('rain', { count: rainHits });
          if (robotOffline) {
            if (robotOffline.starDid || robotOffline.mythDid) {
              this.trackDayStat('robot_merge', {
                star: robotOffline.starDid || 0,
                myth: robotOffline.mythDid || 0
              });
            }
          }
        } catch (_) {}
      } catch (logErr) {
        console.warn('logOfflineReport', logErr);
      }
    }

    return {
      ok: true,
      changed,
      notes,
      lines,
      offlineMs,
      offlineText,
      totalHarvest,
      totalPlant,
      totalYieldAmount,
      uniquePlotsHarvested: typeof harvestedPlotKeys !== 'undefined' ? harvestedPlotKeys.size : 0,
      harvestByPlant,
      fairyCycles,
      helperBuys,
      rainHits,
      rainWatered,
      rainChance,
      from: from,
      to: now,
      fairyRainSeeds: typeof rainCollectSeeds !== 'undefined' ? (rainCollectSeeds || 0) : 0,
      robotSeedsBought: (typeof robotOffline !== 'undefined' && robotOffline) ? (robotOffline.seedsBought || 0) : 0,
      robotStar: (typeof robotOffline !== 'undefined' && robotOffline) ? (robotOffline.starDid || robotOffline.starOk || 0) : 0,
      robotMyth: (typeof robotOffline !== 'undefined' && robotOffline) ? (robotOffline.mythDid || robotOffline.mythOk || 0) : 0,
      nycGardens: (typeof nycGardenIndexes !== 'undefined' && nycGardenIndexes) ? nycGardenIndexes.length : 0,
      fromLog: fromLog || null
    };
  },

  
  _nycPlantOneAt(plot, cfg, plantTime, gi) {
    if (!plot || plot.plantId || !cfg) return false;
    if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
    if (!currentPlayer.inventory.seedsStar) currentPlayer.inventory.seedsStar = {};
    if (!currentPlayer.inventory.seedsMyth) currentPlayer.inventory.seedsMyth = {};
    const unlimited = this.isUnlimitedResources();
    const candidates = (cfg.plantList && cfg.plantList.length)
      ? cfg.plantList
      : (cfg.plantId ? [{ plantId: cfg.plantId, seedKind: cfg.seedKind || 'normal' }] : []);
    if (!candidates.length) return false;

    let used = null;
    for (let ci = 0; ci < candidates.length; ci++) {
      const c = candidates[ci];
      if (!c || !c.plantId) continue;
      const kind = c.seedKind === 'myth' ? 'myth' : (c.seedKind === 'star' ? 'star' : 'normal');
      const bag = kind === 'myth'
        ? currentPlayer.inventory.seedsMyth
        : (kind === 'star' ? currentPlayer.inventory.seedsStar : currentPlayer.inventory.seeds);
      if (!unlimited) {
        if ((bag[c.plantId] || 0) < 1) continue; // hết loại này → thử hạt dự phòng tiếp theo
        bag[c.plantId]--;
        if (bag[c.plantId] <= 0) delete bag[c.plantId];
      }
      used = { plantId: c.plantId, kind };
      break;
    }
    if (!used) return false; // hết tất cả hạt đã cấu hình → dừng không trồng
    const plantId = used.plantId;
    const kind = used.kind;
    plot.plantId = plantId;
    plot.plantedAt = plantTime;
    plot.seedStar = kind === 'star' || kind === 'myth';
    plot.seedMyth = kind === 'myth';
    // Lưu growTime gốc lên ô — offline không phụ thuộc currentPlants có load đủ cây custom
    const plDef = this.getPlant(plantId);
    plot.baseGrowTime = (plDef && Number(plDef.growTime) > 0)
      ? Number(plDef.growTime)
      : (Number(plot.baseGrowTime) > 0 ? Number(plot.baseGrowTime) : 0);
    plot.waterCount = 0;
    plot.watered = false;
    plot.lastWatered = null;
    plot.fertilizerId = null;
    plot.fertilizedAt = null;
    
    if (typeof gi === 'number' && this.isFairyActiveAt(plantTime) && this.isFairyGardenEnabled(gi)) {
      plot.waterCount = 3;
      plot.watered = true;
      plot.lastWatered = plantTime;
      const fcfg = this.getFairyConfigForGarden
        ? this.getFairyConfigForGarden(gi)
        : this.getFairyConfig();
      if (fcfg && fcfg.useFertilizer) {
        const fid = this.takeFertFromBagForFairy(fcfg);
        if (fid) {
          plot.fertilizerId = fid;
          plot.fertilizedAt = plantTime;
        }
      }
    }
    currentPlayer.stats = currentPlayer.stats || {};
    currentPlayer.stats.planted = (currentPlayer.stats.planted || 0) + 1;
    return true;
  },

  
  _nycPlantEmptiesAt(plots, cfg, t, gi) {
    if (!cfg || !plots) return 0;
    const hasAny = (cfg.plantList && cfg.plantList.length) || cfg.plantId;
    if (!hasAny) return 0;
    const mode = cfg.mode === 'count' ? 'count' : 'all';
    
    const limit = mode === 'count'
      ? Math.max(1, Math.min(999, parseInt(cfg.count, 10) || 1))
      : 99999;
    let n = 0;
    let miss = 0;
    for (let i = 0; i < plots.length && n < limit; i++) {
      const plot = plots[i];
      if (!plot || plot.plantId) continue;
      // Hết loại trên → _nycPlantOneAt tự chọn loại tiếp trong plantList
      if (this._nycPlantOneAt(plot, cfg, t, gi)) {
        n++;
        miss = 0;
      } else {
        // Không trồng được ô này (hết mọi loại trong list) → dừng sớm
        miss++;
        if (miss >= 1) break;
      }
    }
    return n;
  },


  async buyProtect(protectId, qty = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const item = this.getProtect(protectId);
    if (!item) return { ok: false, msg: 'Không tìm thấy bảo hộ!' };
    const price = Math.max(1, Number(item.price) || 1);
    const maxAfford = Math.max(1, Math.floor((Number(currentPlayer.coins) || 0) / price));
    if (qty === 'all' || qty === 'max') {
      qty = maxAfford;
    } else {
      qty = Math.max(1, parseInt(qty, 10) || 1);
      
      if (qty > maxAfford) qty = maxAfford;
    }
    if (qty < 1) return { ok: false, msg: 'Không đủ tiền!' };
    const cost = price * qty;
    if (!this.chargeCoins(cost)) return { ok: false, msg: 'Không đủ tiền!' };
    if (!currentPlayer.inventory.protects) currentPlayer.inventory.protects = {};
    currentPlayer.inventory.protects[protectId] = (currentPlayer.inventory.protects[protectId] || 0) + qty;
    this.addActivity(this.isUnlimitedResources()
      ? `Mua ${qty} ${item.name} (unlimited)`
      : `Mua ${qty} ${item.name} (-${cost.toLocaleString()}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Đã mua ${qty} ${item.name}!` };
  },

  async buyFairyPack(packId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const pack = DEFAULT_FAIRY_PACKS.find(p => p.id === packId);
    if (!pack) return { ok: false, msg: 'Gói không hợp lệ!' };
    if (!this.chargeCoins(pack.price)) return { ok: false, msg: 'Không đủ tiền!' };
    const base = Math.max((typeof nowMs==="function"?nowMs():Date.now()), currentPlayer.fairyUntil || 0);
    const wasActive = this.hasFairy();
    currentPlayer.fairyUntil = base + pack.days * 24 * 60 * 60 * 1000;
    
    if (!wasActive || !currentPlayer.lastFairyCare) {
      this.ensureGardens();
      const now = (typeof nowMs==="function"?nowMs():Date.now());
      this.forEachGarden((plots, gi) => {
        if (this.isFairyGardenEnabled(gi)) this.runFairyCare(now);
      });
      currentPlayer.lastFairyCare = now;
    }
    this.addActivity(`Mua ${pack.name} (-${pack.price}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Đã kích hoạt ${pack.name}! Còn ${this.formatTime(this.fairyRemainingSec())}` };
  },

  async buyNycPack(packId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const pack = DEFAULT_NYC_PACKS.find(p => p.id === packId);
    if (!pack) return { ok: false, msg: 'Gói không hợp lệ!' };
    if (!this.chargeCoins(pack.price)) return { ok: false, msg: 'Không đủ tiền!' };
    const base = Math.max((typeof nowMs==="function"?nowMs():Date.now()), currentPlayer.nycUntil || 0);
    const wasActive = this.hasNyc();
    currentPlayer.nycUntil = base + pack.days * 24 * 60 * 60 * 1000;
    if (!wasActive || !currentPlayer.lastNycCare) {
      await this.runNycCare((typeof nowMs==="function"?nowMs():Date.now()));
    }
    this.addActivity(`Mua ${pack.name} (-${pack.price}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Đã kích hoạt ${pack.name}! Còn ${this.formatTime(this.nycRemainingSec())}` };
  },

  
  hasHelper() {
    return !!(currentPlayer && currentPlayer.helperUntil && currentPlayer.helperUntil > (typeof nowMs==="function"?nowMs():Date.now()));
  },
  isHelperActive() {
    return this.hasHelper() && this.getBuffPrefs().helperEnabled !== false;
  },
  helperRemainingSec() {
    if (!this.hasHelper()) return 0;
    return Math.max(0, Math.ceil((currentPlayer.helperUntil - (typeof nowMs==="function"?nowMs():Date.now())) / 1000));
  },
  getHelperEmoji() {
    const g = (this.getHelperConfig().gender === 'male') ? 'male' : 'female';
    return g === 'male' ? '🤵' : '💁';
  },
  getHelperDisplayName() {
    const n = (this.getHelperConfig().customName || '').trim();
    return n || 'Giúp việc';
  },
  defaultHelperConfig() {
    return {
      customName: '',
      gender: 'female',
      
      rules: []
    };
  },
  getHelperConfig() {
    const def = this.defaultHelperConfig();
    if (!currentPlayer) return { ...def, rules: [] };
    if (!currentPlayer.helperConfig || typeof currentPlayer.helperConfig !== 'object') {
      currentPlayer.helperConfig = { ...def, rules: [] };
    }
    const c = currentPlayer.helperConfig;
    if (typeof c.customName !== 'string') c.customName = '';
    if (c.gender !== 'male' && c.gender !== 'female') c.gender = 'female';
    if (!Array.isArray(c.rules)) c.rules = [];
    c.rules = c.rules.filter(r => r && r.kind && r.id).map(r => ({
      kind: r.kind,
      id: String(r.id),
      minStock: Math.max(0, Math.min(999999999, parseInt(r.minStock, 10) || 0)),
      buyQty: Math.max(1, Math.min(999999999, parseInt(r.buyQty, 10) || 1)),
      enabled: r.enabled !== false
    }));
    return c;
  },
  setHelperConfig(cfg) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const next = {
      customName: (cfg && typeof cfg.customName === 'string') ? cfg.customName.trim().slice(0, 20) : '',
      gender: cfg && cfg.gender === 'male' ? 'male' : 'female',
      rules: Array.isArray(cfg && cfg.rules) ? cfg.rules.filter(r => r && r.kind && r.id).map(r => ({
        kind: r.kind,
        id: String(r.id),
        minStock: Math.max(0, Math.min(999999999, parseInt(r.minStock, 10) || 0)),
        buyQty: Math.max(1, Math.min(999999999, parseInt(r.buyQty, 10) || 1)),
        enabled: r.enabled !== false
      })) : []
    };
    currentPlayer.helperConfig = next;
    return { ok: true, msg: 'Đã lưu cấu hình Người giúp việc (' + next.rules.length + ' mục)' };
  },

  
  getStockCount(kind, id) {
    if (!currentPlayer || !currentPlayer.inventory) return 0;
    const inv = currentPlayer.inventory;
    if (kind === 'seed') return (inv.seeds && inv.seeds[id]) || 0;
    if (kind === 'fert') return (inv.fertilizers && inv.fertilizers[id]) || 0;
    if (kind === 'protect') return (inv.protects && inv.protects[id]) || 0;
    return 0;
  },

  
  getShopUnitPrice(kind, id) {
    if (kind === 'seed') {
      const p = this.getPlant(id);
      return p ? (p.seedPrice || 0) : 0;
    }
    if (kind === 'fert') {
      const f = this.getFertilizer(id);
      return f ? (f.price || 0) : 0;
    }
    if (kind === 'protect') {
      const pr = this.getProtect(id);
      return pr ? (pr.price || 0) : 0;
    }
    return 0;
  },

  getItemDisplayName(kind, id) {
    if (kind === 'seed') {
      const p = this.getPlant(id);
      return p ? ((p.icon || '') + ' ' + p.name).trim() : id;
    }
    if (kind === 'fert') {
      const f = this.getFertilizer(id);
      return f ? ((f.icon || '') + ' ' + f.name).trim() : id;
    }
    if (kind === 'protect') {
      const pr = this.getProtect(id);
      return pr ? ((pr.icon || '') + ' ' + pr.name).trim() : id;
    }
    return id;
  },

  



  helperBuySilent(kind, id, qty) {
    qty = Math.max(1, Math.min(999999999, parseInt(qty, 10) || 1));
    if (kind === 'seed') {
      const plant = this.getPlant(id);
      if (!plant) return { ok: false, bought: 0, cost: 0, msg: 'Không có hạt' };
      if (!this.isPlantAvailable(plant)) return { ok: false, bought: 0, cost: 0, msg: 'Limited hết hạn' };
      const cost = plant.seedPrice * qty;
      if (!this.chargeCoins(cost)) return { ok: false, bought: 0, cost: 0, msg: 'Thiếu tiền' };
      currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
      if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
      currentPlayer.inventory.seeds[id] = (currentPlayer.inventory.seeds[id] || 0) + qty;
      return { ok: true, bought: qty, cost, msg: plant.name };
    }
    if (kind === 'fert') {
      const fert = this.getFertilizer(id);
      if (!fert) return { ok: false, bought: 0, cost: 0, msg: 'Không có phân' };
      const cost = fert.price * qty;
      if (!this.chargeCoins(cost)) return { ok: false, bought: 0, cost: 0, msg: 'Thiếu tiền' };
      currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
      if (!currentPlayer.inventory.fertilizers) currentPlayer.inventory.fertilizers = {};
      currentPlayer.inventory.fertilizers[id] = (currentPlayer.inventory.fertilizers[id] || 0) + qty;
      return { ok: true, bought: qty, cost, msg: fert.name };
    }
    if (kind === 'protect') {
      const item = this.getProtect(id);
      if (!item) return { ok: false, bought: 0, cost: 0, msg: 'Không có bảo hộ' };
      const cost = item.price * qty;
      if (!this.chargeCoins(cost)) return { ok: false, bought: 0, cost: 0, msg: 'Thiếu tiền' };
      currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
      if (!currentPlayer.inventory.protects) currentPlayer.inventory.protects = {};
      currentPlayer.inventory.protects[id] = (currentPlayer.inventory.protects[id] || 0) + qty;
      return { ok: true, bought: qty, cost, msg: item.name };
    }
    return { ok: false, bought: 0, cost: 0, msg: 'Loại không hỗ trợ' };
  },

  



  tickHelperBuy(now = (typeof nowMs==="function"?nowMs():Date.now())) {
    if (!this.isHelperActive() || !currentPlayer) return 0;
    const last = currentPlayer.lastHelperBuy || 0;
    if (now - last < 12000) return 0; 
    const cfg = this.getHelperConfig();
    const rules = (cfg.rules || []).filter(r => r.enabled !== false);
    if (!rules.length) return 0;

    let totalBought = 0;
    let totalCost = 0;
    const lines = [];
    rules.forEach(r => {
      const have = this.getStockCount(r.kind, r.id);
      if (have >= r.minStock) return;
      
      const res = this.helperBuySilent(r.kind, r.id, r.buyQty);
      if (res.ok && res.bought > 0) {
        totalBought += res.bought;
        totalCost += res.cost;
        lines.push(`${res.msg} x${res.bought}`);
      }
    });
    if (totalBought > 0) {
      currentPlayer.lastHelperBuy = now;
      const name = this.getHelperDisplayName();
      this.trackDayStat('helper_buy', { qty: lines.length, cost: totalCost });
      this.addActivity(`${name} mua: ${lines.slice(0, 5).join(', ')} (−${totalCost.toLocaleString()}🪙)`, { type: 'helper_buy' });
    }
    return totalBought;
  },

  async buyHelperPack(packId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const packs = this.getHelperPacks();
    const pack = packs.find(p => p.id === packId);
    if (!pack) return { ok: false, msg: 'Gói không hợp lệ!' };
    if (!this.chargeCoins(pack.price)) return { ok: false, msg: 'Không đủ tiền!' };
    const base = Math.max((typeof nowMs==="function"?nowMs():Date.now()), currentPlayer.helperUntil || 0);
    currentPlayer.helperUntil = base + pack.days * 24 * 60 * 60 * 1000;
    
    this.tickHelperBuy((typeof nowMs==="function"?nowMs():Date.now()));
    this.addActivity(`Mua ${pack.name} (-${pack.price}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Đã kích hoạt ${pack.name}! Còn ${this.formatTime(this.helperRemainingSec())}` };
  },

  /* ========== Người máy (Robot) — chỉ admin cấp, không bán ========== */
  hasRobot() {
    return !!(currentPlayer && currentPlayer.robotEnabled);
  },
  isRobotActive() {
    return this.hasRobot() && this.getBuffPrefs().robotEnabled !== false;
  },
  getRobotEmoji() {
    const g = (this.getRobotConfig().gender === 'male') ? 'male' : 'female';
    return g === 'male' ? '🤖' : '🤖';
  },
  getRobotDisplayName() {
    const n = (this.getRobotConfig().customName || '').trim();
    return n || 'Người máy';
  },
  defaultRobotConfig() {
    return {
      customName: '',
      gender: 'female',
      // Mua thêm hạt loại Tiên đã nhặt (đủ 10000 rồi ghép)
      buyFairySeeds: true,
      // Mua bùa 100% (đồ mua đi) khi cần ghép
      buyProtect: true,
      // Mua thêm + ghép mọi loại hạt đang có trong kho (kể cả mua shop) — mặc định TẮT
      buyAnySeeds: false,
      // Nấu ăn trong Bếp — mặc định TẮT
      cookEnabled: false,
      cookNormal: true,
      cookStar: false,
      cookMyth: false,
      // Số món mỗi công thức đạt mức này thì dừng (không nấu thêm / không trùng lặp)
      cookTargetQty: 10
    };
  },
  getRobotConfig() {
    const def = this.defaultRobotConfig();
    if (!currentPlayer) return { ...def };
    if (!currentPlayer.robotConfig || typeof currentPlayer.robotConfig !== 'object') {
      currentPlayer.robotConfig = { ...def };
    }
    const c = currentPlayer.robotConfig;
    if (typeof c.customName !== 'string') c.customName = '';
    if (c.gender !== 'male' && c.gender !== 'female') c.gender = 'female';
    if (typeof c.buyFairySeeds !== 'boolean') c.buyFairySeeds = true;
    if (typeof c.buyProtect !== 'boolean') c.buyProtect = true;
    if (typeof c.buyAnySeeds !== 'boolean') c.buyAnySeeds = false;
    if (typeof c.cookEnabled !== 'boolean') c.cookEnabled = false;
    if (typeof c.cookNormal !== 'boolean') c.cookNormal = true;
    if (typeof c.cookStar !== 'boolean') c.cookStar = false;
    if (typeof c.cookMyth !== 'boolean') c.cookMyth = false;
    if (!Number.isFinite(Number(c.cookTargetQty))) c.cookTargetQty = 10;
    else c.cookTargetQty = Math.max(0, Math.floor(Number(c.cookTargetQty))); // 0 = không giới hạn
    return c;
  },
  setRobotConfig(cfg) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const prev = this.getRobotConfig();
    const tq = cfg && cfg.cookTargetQty != null ? Math.floor(Number(cfg.cookTargetQty)) : prev.cookTargetQty;
    currentPlayer.robotConfig = {
      customName: (cfg && typeof cfg.customName === 'string') ? cfg.customName.trim().slice(0, 20) : (prev.customName || ''),
      gender: cfg && cfg.gender === 'male' ? 'male' : 'female',
      buyFairySeeds: cfg && typeof cfg.buyFairySeeds === 'boolean' ? cfg.buyFairySeeds : (prev.buyFairySeeds !== false),
      buyProtect: cfg && typeof cfg.buyProtect === 'boolean' ? cfg.buyProtect : (prev.buyProtect !== false),
      buyAnySeeds: cfg && typeof cfg.buyAnySeeds === 'boolean' ? cfg.buyAnySeeds : !!prev.buyAnySeeds,
      cookEnabled: cfg && typeof cfg.cookEnabled === 'boolean' ? cfg.cookEnabled : !!prev.cookEnabled,
      cookNormal: cfg && typeof cfg.cookNormal === 'boolean' ? cfg.cookNormal : (prev.cookNormal !== false),
      cookStar: cfg && typeof cfg.cookStar === 'boolean' ? cfg.cookStar : !!prev.cookStar,
      cookMyth: cfg && typeof cfg.cookMyth === 'boolean' ? cfg.cookMyth : !!prev.cookMyth,
      cookTargetQty: Number.isFinite(tq) && tq >= 0 ? tq : 10
    };
    return { ok: true, msg: 'Đã lưu Người máy' };
  },

  /** ID bùa 100% dùng cho Người máy */
  ROBOT_PROTECT_ID: 'bao-100',

  /**
   * Mua thêm bùa bao-100 cho đủ needQty (trừ xu). Unlimited thì không trừ.
   */
  robotEnsureProtect100(needQty) {
    if (!currentPlayer) return { ok: false, bought: 0, cost: 0 };
    // Cấu hình robot: tắt mua bùa 100% (đồ mua đi)
    if (this.getRobotConfig().buyProtect === false) return { ok: false, bought: 0, cost: 0, msg: 'Tắt mua bùa trong cấu hình Người máy' };
    needQty = Math.max(0, Math.floor(Number(needQty) || 0));
    if (needQty < 1) return { ok: true, bought: 0, cost: 0 };
    if (!currentPlayer.inventory) currentPlayer.inventory = { seeds: {}, harvest: {}, fertilizers: {}, protects: {} };
    if (!currentPlayer.inventory.protects) currentPlayer.inventory.protects = {};
    const pid = this.ROBOT_PROTECT_ID || 'bao-100';
    const unlimited = this.isUnlimitedResources();
    const have = unlimited ? Number.MAX_SAFE_INTEGER : (currentPlayer.inventory.protects[pid] || 0);
    if (have >= needQty) return { ok: true, bought: 0, cost: 0 };
    let buy = needQty - (unlimited ? needQty : have);
    if (unlimited) {
      // Không cần mua
      return { ok: true, bought: 0, cost: 0 };
    }
    const item = this.getProtect(pid);
    if (!item) return { ok: false, bought: 0, cost: 0, msg: 'Không có bùa 100%' };
    const price = Math.max(1, Number(item.price) || 1);
    const maxAfford = Math.floor((Number(currentPlayer.coins) || 0) / price);
    if (maxAfford < 1) return { ok: false, bought: 0, cost: 0, msg: 'Thiếu tiền mua bùa 100%' };
    if (buy > maxAfford) buy = maxAfford;
    const cost = price * buy;
    if (!this.chargeCoins(cost)) return { ok: false, bought: 0, cost: 0, msg: 'Thiếu tiền mua bùa 100%' };
    currentPlayer.stats = currentPlayer.stats || {};
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
    currentPlayer.inventory.protects[pid] = (currentPlayer.inventory.protects[pid] || 0) + buy;
    return { ok: true, bought: buy, cost };
  },

  /**
   * Ước lượng số lần ghép cần (hạt thường→sao + sao→huyền thoại) để mua đủ bùa.
   */
  robotEstimateMergeAttempts() {
    if (!currentPlayer || !currentPlayer.inventory) return 0;
    const seeds = currentPlayer.inventory.seeds || {};
    const stars = currentPlayer.inventory.seedsStar || {};
    let n = 0;
    Object.keys(seeds).forEach(id => {
      const h = seeds[id] || 0;
      if (h >= 2) n += Math.floor(h / 2); // worst-case: mỗi lần mất 2 khi success rate 100%
    });
    Object.keys(stars).forEach(id => {
      const h = stars[id] || 0;
      if (h >= 2) n += Math.floor(h / 2);
    });
    return n;
  },

  /**
   * Ghép bulk O(1) với bùa 100% — xử lý được kho hàng tỷ hạt (offline không bị timeout).
   * 2 thường → 1 sao; 2 sao → 1 huyền thoại. Chắc chắn thành công.
   */
  robotBulkMerge100(plantId) {
    if (!currentPlayer || !plantId) return { starMade: 0, mythMade: 0, protUsed: 0 };
    if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
    if (!currentPlayer.inventory.seedsStar) currentPlayer.inventory.seedsStar = {};
    if (!currentPlayer.inventory.seedsMyth) currentPlayer.inventory.seedsMyth = {};
    if (!currentPlayer.inventory.protects) currentPlayer.inventory.protects = {};
    const pid = this.ROBOT_PROTECT_ID || 'bao-100';
    const unlimited = this.isUnlimitedResources();
    const seeds = currentPlayer.inventory.seeds;
    const stars = currentPlayer.inventory.seedsStar;
    const myths = currentPlayer.inventory.seedsMyth;
    const protects = currentPlayer.inventory.protects;

    let starMade = 0;
    let mythMade = 0;
    let protUsed = 0;

    // --- Thường → sao ---
    let haveN = Number(seeds[plantId]) || 0;
    if (haveN >= 2) {
      let pairs = Math.floor(haveN / 2);
      if (!unlimited) {
        const ph = Number(protects[pid]) || 0;
        if (ph < pairs) {
          // Mua thêm bùa cho đủ (hoặc tối đa xu cho phép)
          const needBuy = pairs - ph;
          const er = this.robotEnsureProtect100(needBuy);
          // sau mua
          const ph2 = Number(protects[pid]) || 0;
          if (ph2 < pairs) pairs = ph2; // chỉ ghép được bằng số bùa có
        }
        if (pairs > 0) {
          protects[pid] = (Number(protects[pid]) || 0) - pairs;
          if (protects[pid] <= 0) delete protects[pid];
          protUsed += pairs;
        }
      }
      if (pairs > 0) {
        // remaining = haveN - 2*pairs (có thể còn 0 hoặc 1)
        const left = haveN - pairs * 2;
        if (left > 0) seeds[plantId] = left;
        else delete seeds[plantId];
        stars[plantId] = (Number(stars[plantId]) || 0) + pairs;
        starMade = pairs;
      }
    }

    // --- Sao → huyền thoại ---
    let haveS = Number(stars[plantId]) || 0;
    if (haveS >= 2) {
      let pairs = Math.floor(haveS / 2);
      if (!unlimited) {
        const ph = Number(protects[pid]) || 0;
        if (ph < pairs) {
          const needBuy = pairs - ph;
          this.robotEnsureProtect100(needBuy);
          const ph2 = Number(protects[pid]) || 0;
          if (ph2 < pairs) pairs = ph2;
        }
        if (pairs > 0) {
          protects[pid] = (Number(protects[pid]) || 0) - pairs;
          if (protects[pid] <= 0) delete protects[pid];
          protUsed += pairs;
        }
      }
      if (pairs > 0) {
        const left = haveS - pairs * 2;
        if (left > 0) stars[plantId] = left;
        else delete stars[plantId];
        myths[plantId] = (Number(myths[plantId]) || 0) + pairs;
        mythMade = pairs;
      }
    }

    return { starMade, mythMade, protUsed };
  },

  /** Ghi nhận loại hạt Tiên đã nhặt → robot được phép mua thêm loại đó */
  robotMarkFairySeedTypes(collectedMap) {
    if (!currentPlayer || !collectedMap) return;
    if (!currentPlayer.fairyRobotSeedTypes || typeof currentPlayer.fairyRobotSeedTypes !== 'object') {
      currentPlayer.fairyRobotSeedTypes = {};
    }
    Object.keys(collectedMap).forEach(id => {
      if ((collectedMap[id] || 0) > 0) currentPlayer.fairyRobotSeedTypes[id] = true;
    });
  },

  /**
   * Mua đủ 10000 chỉ cho các loại hạt Tiên đã nhặt (không đụng hạt chỉ mua shop).
   */
  robotBuyFairyMarkedSeeds(extraMap) {
    if (!this.isRobotActive() || !currentPlayer) return { bought: 0, cost: 0 };
    // Cấu hình robot: tắt mua thêm hạt Tiên nhặt
    if (this.getRobotConfig().buyFairySeeds === false) return { bought: 0, cost: 0 };
    if (!currentPlayer.inventory) currentPlayer.inventory = { seeds: {}, harvest: {}, fertilizers: {}, protects: {} };
    if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
    this.robotMarkFairySeedTypes(extraMap || {});
    const marked = currentPlayer.fairyRobotSeedTypes || {};
    const ids = new Set(Object.keys(marked).filter(id => marked[id]));
    if (extraMap) Object.keys(extraMap).forEach(id => { if ((extraMap[id] || 0) > 0) ids.add(id); });
    const targetQty = 10000;
    let seedsBought = 0;
    let seedsCost = 0;
    for (const plantId of ids) {
      const plant = this.getPlant(plantId);
      if (!plant) continue;
      const price = Math.max(0, Number(plant.seedPrice) || 0);
      const have = Number(currentPlayer.inventory.seeds[plantId]) || 0;
      // Chỉ mua nếu đã có ≥1 (Tiên vừa nhặt / còn trong kho loại Tiên đã nhặt)
      if (have < 1) {
        // Vừa nhặt có thể đã +1 vào bag trước khi gọi — nếu map có mà bag 0 thì bỏ qua
        continue;
      }
      if (have >= targetQty) continue;
      let needBuy = targetQty - have;
      if (!this.isUnlimitedResources() && price > 0) {
        const maxAfford = Math.floor((Number(currentPlayer.coins) || 0) / price);
        if (maxAfford < 1) continue;
        if (needBuy > maxAfford) needBuy = maxAfford;
      }
      if (needBuy < 1) continue;
      const cost = price * needBuy;
      if (!this.chargeCoins(cost)) continue;
      currentPlayer.stats = currentPlayer.stats || {};
      currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
      currentPlayer.inventory.seeds[plantId] = have + needBuy;
      seedsBought += needBuy;
      seedsCost += cost;
      try {
        this.trackDayStat('robot_seed', {
          name: plant.name || plantId,
          seedId: plantId,
          qty: needBuy,
          cost: cost
        });
      } catch (_) {}
    }
    return { bought: seedsBought, cost: seedsCost };
  },

  /**
   * Mua đủ 10000 cho MỌI loại hạt đang có ≥1 trong kho (kể cả mua từ shop).
   * Chỉ chạy khi cấu hình buyAnySeeds = true (mặc định tắt).
   */
  robotBuyAnyBagSeeds() {
    if (!this.isRobotActive() || !currentPlayer) return { bought: 0, cost: 0 };
    if (this.getRobotConfig().buyAnySeeds !== true) return { bought: 0, cost: 0 };
    if (!currentPlayer.inventory) currentPlayer.inventory = { seeds: {}, harvest: {}, fertilizers: {}, protects: {} };
    if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
    const seeds = currentPlayer.inventory.seeds;
    const targetQty = 10000;
    let seedsBought = 0;
    let seedsCost = 0;
    const ids = Object.keys(seeds).filter(id => (Number(seeds[id]) || 0) >= 1);
    for (const plantId of ids) {
      const plant = this.getPlant(plantId);
      if (!plant) continue;
      const price = Math.max(0, Number(plant.seedPrice) || 0);
      const have = Number(seeds[plantId]) || 0;
      if (have >= targetQty) continue;
      let needBuy = targetQty - have;
      if (!this.isUnlimitedResources() && price > 0) {
        const maxAfford = Math.floor((Number(currentPlayer.coins) || 0) / price);
        if (maxAfford < 1) continue;
        if (needBuy > maxAfford) needBuy = maxAfford;
      }
      if (needBuy < 1) continue;
      const cost = price * needBuy;
      if (!this.chargeCoins(cost)) continue;
      currentPlayer.stats = currentPlayer.stats || {};
      currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
      seeds[plantId] = have + needBuy;
      seedsBought += needBuy;
      seedsCost += cost;
      try {
        this.trackDayStat('robot_seed', {
          name: plant.name || plantId,
          seedId: plantId,
          qty: needBuy,
          cost: cost
        });
      } catch (_) {}
    }
    return { bought: seedsBought, cost: seedsCost };
  },

  /**
   * Rà kho: CHỈ ghép bulk bùa 100%. KHÔNG mua hạt shop.
   * Mua hạt chỉ khi Tiên nhặt → robotBuyFairyMarkedSeeds / robotAfterRainCollect.
   */

  /**
   * Người máy nấu ăn: mỗi công thức + mỗi tier chỉ nấu 1 lần/tick tới mức cookTargetQty.
   * Không nấu trùng nếu đã đủ số món trong kho món.
   */
  robotTickCook(opts) {
    if (!this.isRobotActive() || !currentPlayer) return { ok: false, cooked: 0 };
    const cfg = this.getRobotConfig();
    if (!cfg.cookEnabled) return { ok: true, cooked: 0, skipped: true };
    const rawTarget = Math.floor(Number(cfg.cookTargetQty));
    // 0 hoặc âm = không giới hạn (nấu đến hết nguyên liệu)
    const unlimitedCook = !Number.isFinite(rawTarget) || rawTarget <= 0;
    const target = unlimitedCook ? Number.MAX_SAFE_INTEGER : rawTarget;
    const tiers = [];
    if (cfg.cookNormal !== false) tiers.push('normal');
    if (cfg.cookStar === true) tiers.push('star');
    if (cfg.cookMyth === true) tiers.push('myth');
    if (!tiers.length) return { ok: true, cooked: 0, msg: 'Chưa chọn loại sản phẩm nấu' };

    this.normalizeHarvestBags && this.normalizeHarvestBags();
    const inv = currentPlayer.inventory || (currentPlayer.inventory = {});
    const recipes = this.getRecipes() || [];
    let cooked = 0;
    const lines = [];
    const seen = new Set(); // chống trùng recipe+tier trong 1 lần chạy

    for (const recipe of recipes) {
      if (!recipe || !recipe.id || !Array.isArray(recipe.ingredients) || !recipe.ingredients.length) continue;
      for (const tier of tiers) {
        const key = recipe.id + '|' + tier;
        if (seen.has(key)) continue;
        seen.add(key);

        const bagKey = this.harvestBagKey(tier);
        const dishKey = this.dishBagKey(tier);
        const harvest = inv[bagKey] || (inv[bagKey] = {});
        if (!inv[dishKey]) inv[dishKey] = {};
        const haveDish = Number(inv[dishKey][recipe.id]) || 0;
        if (!unlimitedCook && haveDish >= target) continue; // đã đủ mức người chơi đặt

        let maxTimes = unlimitedCook ? 1e12 : (target - haveDish);
        for (const ing of recipe.ingredients) {
          const need = Math.max(1, Number(ing.qty) || 1);
          const have = Number(harvest[ing.plantId]) || 0;
          maxTimes = Math.min(maxTimes, Math.floor(have / need));
        }
        maxTimes = Math.floor(maxTimes);
        if (maxTimes < 1) continue;

        // Trừ nguyên liệu + cộng món (không gọi cookRecipe để tránh save từng lần)
        for (const ing of recipe.ingredients) {
          const need = Math.max(1, Number(ing.qty) || 1) * maxTimes;
          harvest[ing.plantId] = (Number(harvest[ing.plantId]) || 0) - need;
          if (harvest[ing.plantId] <= 0) delete harvest[ing.plantId];
        }
        inv[dishKey][recipe.id] = haveDish + maxTimes;
        const xpBase = (Number(recipe.xp) || 1) * maxTimes;
        const xpGain = Math.ceil(xpBase * (this.getSeedXpMult ? this.getSeedXpMult(tier) : 1));
        currentPlayer.xp = (currentPlayer.xp || 0) + xpGain;
        cooked += maxTimes;
        const tag = tier === 'myth' ? '✨' : (tier === 'star' ? '⭐' : '');
        if (lines.length < 6) lines.push((recipe.name || recipe.id) + tag + '×' + maxTimes);
      }
    }

    const silent = opts && opts.silent;
    if (cooked > 0) {
      try {
        (lines || []).forEach(ln => {
          const m = String(ln).match(/^(.+?)(?:⭐|✨)?×(\d+)$/);
          if (m) this.trackDayStat('robot_cook', { name: m[1].trim(), qty: Number(m[2]) || 1 });
          else this.trackDayStat('robot_cook', { name: String(ln), qty: 1 });
        });
      } catch (_) {}
      if (!silent) {
        const name = this.getRobotDisplayName ? this.getRobotDisplayName() : 'Người máy';
        this.addActivity(name + ' nấu: ' + lines.join(', ') + (unlimitedCook ? ' (không giới hạn)' : (' (tới mức ' + target + ')')), { type: 'robot_cook' });
      }
    }
    return { ok: true, cooked, lines, target };
  },

  async robotMergeAllBag(opts) {
    if (!this.isRobotActive() || !currentPlayer) return { ok: false, starDid: 0, mythDid: 0 };
    if (!currentPlayer.inventory) currentPlayer.inventory = { seeds: {}, harvest: {}, fertilizers: {}, protects: {} };
    if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
    if (!currentPlayer.inventory.seedsStar) currentPlayer.inventory.seedsStar = {};
    if (!currentPlayer.inventory.seedsMyth) currentPlayer.inventory.seedsMyth = {};
    if (!currentPlayer.inventory.protects) currentPlayer.inventory.protects = {};

    const silent = opts && opts.silent;
    // opts.buyFairy: true → mua thêm các loại Tiên đã nhặt (đánh dấu)
    let seedsBought = 0;
    let seedsCost = 0;
    if (opts && opts.buyFairy) {
      const br = this.robotBuyFairyMarkedSeeds(opts.fairyMap || null);
      seedsBought = br.bought || 0;
      seedsCost = br.cost || 0;
    }
    // Cấu hình buyAnySeeds: mua thêm mọi loại hạt đang có trong kho (shop / kho sẵn)
    if (this.getRobotConfig().buyAnySeeds === true) {
      const br2 = this.robotBuyAnyBagSeeds();
      seedsBought += (br2.bought || 0);
      seedsCost += (br2.cost || 0);
    }

    const mergeIds = new Set();
    Object.keys(currentPlayer.inventory.seeds || {}).forEach(id => {
      if ((Number(currentPlayer.inventory.seeds[id]) || 0) >= 2) mergeIds.add(id);
    });
    Object.keys(currentPlayer.inventory.seedsStar || {}).forEach(id => {
      if ((Number(currentPlayer.inventory.seedsStar[id]) || 0) >= 2) mergeIds.add(id);
    });

    let starDid = 0, mythDid = 0, starOk = 0, mythOk = 0;
    for (const plantId of mergeIds) {
      try {
        const r = this.robotBulkMerge100(plantId);
        if (r.starMade > 0) { starOk++; starDid += r.starMade; }
        if (r.mythMade > 0) { mythOk++; mythDid += r.mythMade; }
      } catch (e) {
        console.warn('robotBulkMerge100', plantId, e);
      }
    }

    // Nấu ăn theo cấu hình (nếu bật)
    let cookN = 0;
    try {
      const cr = this.robotTickCook({ silent: true });
      cookN = (cr && cr.cooked) || 0;
      if (!silent && cookN > 0 && cr.lines && cr.lines.length) {
        const nm = this.getRobotDisplayName();
        this.addActivity(nm + ' nấu: ' + cr.lines.join(', '), { type: 'robot_cook' });
      }
    } catch (e) { console.warn('robotTickCook', e); }

    // Luôn ghi thống kê ghép (kể cả silent) — để log Summary có số sao / HT
    try {
      if (starDid || mythDid) {
        this.trackDayStat('robot_merge', { star: starDid, myth: mythDid });
      }
    } catch (_) {}

    if (!silent && (starOk || mythOk || starDid || mythDid || seedsBought)) {
      const name = this.getRobotDisplayName();
      let act = name + ' rà kho';
      if (seedsBought) act += ' · mua (Tiên) +' + seedsBought.toLocaleString() + ' hạt';
      if (starDid) act += ' · +' + starDid.toLocaleString() + ' hạt sao';
      if (mythDid) act += ' · +' + mythDid.toLocaleString() + ' hạt HT';
      if (seedsCost) act += ' (-' + seedsCost.toLocaleString() + '🪙)';
      this.addActivity(act, { type: 'robot_merge' });
    }
    return {
      ok: true,
      starOk, mythOk, starDid, mythDid,
      protectBought: 0, protectCost: 0,
      seedsBought, seedsCost
    };
  },

  /**
   * Khi mưa + Tiên nhặt hạt: đánh dấu loại hạt, mua đủ 10000, ghép bulk bùa 100%.
   * Chỉ mua loại Tiên vừa nhặt — không mua hạt người chơi tự mua shop.
   */
  async robotAfterRainCollect(collectedMap, opts) {
    if (!this.isRobotActive() || !currentPlayer) return { ok: false, bought: 0, merges: 0 };
    if (!collectedMap || typeof collectedMap !== 'object') collectedMap = {};
    const silent = opts && opts.silent;

    this.robotMarkFairySeedTypes(collectedMap);
    const buyRes = this.robotBuyFairyMarkedSeeds(collectedMap);
    const totalBought = buyRes.bought || 0;
    const totalCost = buyRes.cost || 0;

    const mergeRes = await this.robotMergeAllBag({ silent: true });
    const starOk = (mergeRes && mergeRes.starOk) || 0;
    const mythOk = (mergeRes && mergeRes.mythOk) || 0;
    const starDid = (mergeRes && mergeRes.starDid) || 0;
    const mythDid = (mergeRes && mergeRes.mythDid) || 0;

    const name = this.getRobotDisplayName();
    // merge đã được track trong robotMergeAllBag({silent:true})
    if (!silent && (totalBought > 0 || starDid || mythDid || starOk || mythOk)) {
      let act = name;
      if (totalBought > 0) {
        act += ' mua (Tiên nhặt) +' + totalBought.toLocaleString() + ' hạt';
        if (totalCost) act += ' (-' + totalCost.toLocaleString() + '🪙)';
      } else {
        act += ' rà kho';
      }
      if (starDid) act += ' · +' + starDid.toLocaleString() + ' hạt sao';
      else if (starOk) act += ' · ghép sao x' + starOk;
      if (mythDid) act += ' · +' + mythDid.toLocaleString() + ' hạt HT';
      else if (mythOk) act += ' · ghép HT x' + mythOk;
      this.addActivity(act, { type: 'robot_rain' });
    }
    return {
      ok: true,
      bought: totalBought,
      cost: totalCost,
      details: [],
      starOk,
      mythOk,
      starDid,
      mythDid,
      protectBought: 0,
      protectCost: 0
    };
  },



  
  nycSyncWindowSec: 10,

  


  nycShouldWaitForNearReady(plots) {
    const list = plots || (currentPlayer && currentPlayer.plots) || [];
    const win = this.nycSyncWindowSec || 10;
    let ready = 0;
    let near = 0;
    for (const plot of list) {
      if (!plot || !plot.plantId || !plot.plantedAt) continue;
      if (this.isReady(plot)) {
        ready++;
        continue;
      }
      const remain = this.getRemainingSeconds(plot);
      if (remain > 0 && remain <= win) near++;
    }
    return ready > 0 && near > 0;
  },

  





  async runNycCare(now, gardenIndex, plotsOverride) {
    if (!currentPlayer) return false;
    now = now || (typeof nowMs === 'function' ? nowMs() : Date.now());
    const gIdx = (typeof gardenIndex === 'number')
      ? gardenIndex
      : (typeof currentPlayer.activeGarden === 'number' ? currentPlayer.activeGarden : 0);
    const gLabel = gIdx + 1;

    // Dùng plots của vườn đích — KHÔNG đổi activeGarden (tránh UI nhảy vườn)
    let plots = plotsOverride;
    if (!plots) {
      if (Array.isArray(currentPlayer.gardens) && currentPlayer.gardens[gIdx]) {
        plots = currentPlayer.gardens[gIdx];
      } else {
        plots = currentPlayer.plots;
      }
    }
    if (!Array.isArray(plots)) {
      if (plots && typeof plots === 'object') {
        const keys = Object.keys(plots).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
        plots = keys.map(k => plots[k]);
      } else {
        return false;
      }
    }

    if (this.nycShouldWaitForNearReady(plots)) {
      return false;
    }

    let harvested = 0;
    let planted = 0;
    let totalAmount = 0;
    let totalXp = 0;

    for (let i = 0; i < plots.length; i++) {
      const plot = plots[i];
      if (!(plot && plot.plantId && this.isReady(plot))) continue;
      const plant = this.getPlant(plot.plantId);
      if (!plant) continue;
      let amount = plant.yield;
      if (plot.fertilizerId) {
        const fert = this.getFertilizer(plot.fertilizerId);
        if (fert && fert.yieldBonus) amount = Math.ceil(amount * (1 + fert.yieldBonus));
      }
      if ((plot.waterCount || 0) >= 2) amount = Math.ceil(amount * 1.1);
      amount = this.applySeedYieldBonus(plot, amount);
      const hid = plot.plantId;
      this.stashHarvestProduct(hid, amount, plot);
      currentPlayer.stats.harvested = (currentPlayer.stats.harvested || 0) + amount;
      this.unlockCollection(plot.plantId);
      totalAmount += amount;
      totalXp += Math.ceil((plant.xp || 5) * this.getSeedXpMult(plot));
      plot.plantId = null;
      plot.plantedAt = null;
      plot.watered = false;
      plot.waterCount = 0;
      plot.lastWatered = null;
      plot.fertilizerId = null;
      plot.fertilizedAt = null;
      plot.seedStar = false;
      plot.seedMyth = false;
      harvested++;
    }
    if (harvested > 0) {
      this.addXp(totalXp);
      if (typeof Features !== 'undefined' && Features.trackQuest) Features.trackQuest('harvest', harvested);
    }

    const cfg = this.getNycConfigForGarden(gIdx);
    // Trồng theo plantList ưu tiên: hết loại trên → trồng loại tiếp ngay (không chờ)
    const hasPlantCfg = (cfg.plantList && cfg.plantList.length) || cfg.plantId;
    if (hasPlantCfg) {
      const prevActive = currentPlayer.activeGarden;
      const prevPlots = currentPlayer.plots;
      currentPlayer.activeGarden = gIdx;
      currentPlayer.plots = plots;
      try {
        planted = this._nycPlantEmptiesAt(plots, cfg, now, gIdx) || 0;
      } finally {
        if (Array.isArray(currentPlayer.gardens)) {
          currentPlayer.gardens[gIdx] = currentPlayer.plots;
        }
        currentPlayer.activeGarden = prevActive;
        currentPlayer.plots = (Array.isArray(currentPlayer.gardens) && Array.isArray(currentPlayer.gardens[prevActive])
          ? currentPlayer.gardens[prevActive]
          : prevPlots);
      }
    } else if (harvested > 0) {
      await savePlayer();
    }

    if (Array.isArray(currentPlayer.gardens)) {
      currentPlayer.gardens[gIdx] = plots;
      if ((currentPlayer.activeGarden || 0) === gIdx) {
        currentPlayer.plots = plots;
      }
    }

    if (harvested > 0 || planted > 0) {
      currentPlayer.lastNycCare = now;
      if (harvested > 0) {
        this.trackDayStat('harvest', { yield: totalAmount || harvested, plots: harvested, cycles: 1, gardenIndex: gIdx, name: 'tự động' });
        this.trackDayStat('nyc_harvest', { yield: totalAmount || harvested, plots: harvested, gardenIndex: gIdx });
      }
      if (planted > 0) {
        this.trackDayStat('nyc_plant', { plots: planted, gardenIndex: gIdx });
        this.trackDayStat('plant', { plots: planted, actions: 1, gardenIndex: gIdx, replant: true });
      }
      this.addActivity(
        `NYC vườn ${gLabel}: thu ${harvested} ô` +
        (totalAmount ? ` (${totalAmount} sp)` : '') +
        (planted ? `, trồng ${planted} ô cùng giờ` : '')
      );
    }
    return harvested > 0 || planted > 0;
  },

  /** Kiểm tra 1 vườn có việc NYC — không đụng activeGarden */
  nycHasWorkOn(plots, gIdx) {
    if (!this.isNycActive() || !plots) return false;
    const list = Array.isArray(plots) ? plots : Object.values(plots || {});
    const win = this.nycSyncWindowSec || 10;
    for (const plot of list) {
      if (!plot || !plot.plantId || !plot.plantedAt) continue;
      if (this.isReady(plot)) return true;
      const remain = this.getRemainingSeconds(plot);
      if (remain > 0 && remain <= win) return true;
    }
    if (!this.isNycGardenEnabled(gIdx)) return false;
    const cfg = this.getNycConfigForGarden(gIdx);
    const candidates = (cfg.plantList && cfg.plantList.length)
      ? cfg.plantList
      : (cfg.plantId ? [{ plantId: cfg.plantId, seedKind: cfg.seedKind || 'normal' }] : []);
    if (!candidates.length) return false;
    if (!list.some(p => p && !p.plantId)) return false;
    // Có ít nhất 1 loại trong danh sách còn hạt (hoặc unlimited) → cần trồng
    if (this.isUnlimitedResources && this.isUnlimitedResources()) return true;
    const seeds = (currentPlayer.inventory && currentPlayer.inventory.seeds) || {};
    const stars = (currentPlayer.inventory && currentPlayer.inventory.seedsStar) || {};
    const myths = (currentPlayer.inventory && currentPlayer.inventory.seedsMyth) || {};
    for (const c of candidates) {
      if (!c || !c.plantId) continue;
      const kind = c.seedKind === 'myth' ? 'myth' : (c.seedKind === 'star' ? 'star' : 'normal');
      const bag = kind === 'myth' ? myths : (kind === 'star' ? stars : seeds);
      if ((Number(bag[c.plantId]) || 0) >= 1) return true;
    }
    return false;
  },

  nycHasWork() {
    if (!this.isNycActive() || !currentPlayer || !currentPlayer.plots) return false;
    const gIdx = typeof currentPlayer.activeGarden === 'number' ? currentPlayer.activeGarden : 0;
    return this.nycHasWorkOn(currentPlayer.plots, gIdx);
  },

  _nycBusy: false,
  async tickNycCare() {
    if (!this.isNycActive() || this._nycBusy) return false;
    this.ensureGardens();
    this._nycBusy = true;
    let any = false;
    try {
      // Giữ nguyên vườn đang xem — không gán activeGarden trong vòng lặp (tránh UI nhảy)
      const active = (typeof currentPlayer.activeGarden === 'number') ? currentPlayer.activeGarden : 0;
      this.syncActiveGarden();
      for (let i = 0; i < currentPlayer.gardens.length; i++) {
        if (!this.isNycGardenEnabled(i)) continue;
        const plots = currentPlayer.gardens[i];
        if (!this.nycHasWorkOn(plots, i)) continue;
        const gardenNow = (typeof nowMs === 'function' ? nowMs() : Date.now());
        const did = await this.runNycCare(gardenNow, i, plots);
        if (did) any = true;
      }
      currentPlayer.activeGarden = active;
      if (Array.isArray(currentPlayer.gardens[active])) {
        currentPlayer.plots = currentPlayer.gardens[active];
      }
      return any;
    } finally {
      this._nycBusy = false;
    }
  },

  
  getMergeBaseRate() {
    let b = 25;
    if (typeof currentSettings !== 'undefined' && currentSettings && currentSettings.mergeBaseRate != null) {
      b = Number(currentSettings.mergeBaseRate);
    }
    if (!Number.isFinite(b)) b = 25;
    return Math.max(1, Math.min(100, Math.round(b)));
  },

  



  getMergeSuccessRate(protectId) {
    let rate = this.getMergeBaseRate();
    if (protectId) {
      const protect = this.getProtect(protectId);
      if (protect && Number.isFinite(Number(protect.rate))) {
        rate += Number(protect.rate);
      }
    }
    return Math.max(1, Math.min(100, Math.round(rate)));
  },

  




  


  _binomialSample(n, p) {
    n = Math.max(0, Math.floor(n) || 0);
    if (n === 0) return 0;
    p = Math.max(0, Math.min(1, Number(p) || 0));
    if (p <= 0) return 0;
    if (p >= 1) return n;
    
    if (n <= 8000) {
      let k = 0;
      for (let i = 0; i < n; i++) if (Math.random() < p) k++;
      return k;
    }
    
    const mean = n * p;
    const sd = Math.sqrt(n * p * (1 - p)) || 0;
    let u = 0, v = 0, s = 0;
    do {
      u = Math.random() * 2 - 1;
      v = Math.random() * 2 - 1;
      s = u * u + v * v;
    } while (s === 0 || s >= 1);
    const z = u * Math.sqrt(-2 * Math.log(s) / s);
    let k = Math.round(mean + sd * z);
    if (k < 0) k = 0;
    if (k > n) k = n;
    return k;
  },


  /** normal | star | myth */
  getPlotSeedTier(plot) {
    if (!plot) return 'normal';
    if (plot.seedMyth || plot.seedTier === 'myth') return 'myth';
    if (plot.seedStar || plot.seedTier === 'star') return 'star';
    return 'normal';
  },
  getSeedYieldMult(plotOrTier) {
    const t = (typeof plotOrTier === 'string') ? plotOrTier : this.getPlotSeedTier(plotOrTier);
    if (t === 'myth') return 2;
    if (t === 'star') return 1.5;
    return 1;
  },
  getSeedXpMult(plotOrTier) {
    const t = (typeof plotOrTier === 'string') ? plotOrTier : this.getPlotSeedTier(plotOrTier);
    if (t === 'myth') return 1.6;
    if (t === 'star') return 1.3;
    return 1;
  },
  getSeedSellMult(tier) {
    if (tier === 'myth') return 2;
    if (tier === 'star') return 1.5;
    return 1;
  },
  applySeedYieldBonus(plot, amount) {
    const m = this.getSeedYieldMult(plot);
    return m > 1 ? Math.ceil(amount * m) : amount;
  },
  stashHarvestProduct(hid, amount, plot) {
    if (!currentPlayer.inventory) currentPlayer.inventory = {};
    const tier = this.getPlotSeedTier(plot);
    let bagKey = 'harvest';
    if (tier === 'myth') bagKey = 'harvestMyth';
    else if (tier === 'star') bagKey = 'harvestStar';
    if (!currentPlayer.inventory[bagKey]) currentPlayer.inventory[bagKey] = {};
    currentPlayer.inventory[bagKey][hid] = (currentPlayer.inventory[bagKey][hid] || 0) + amount;
    return tier;
  },

  async mergeSeeds(plantId, protectId, times = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plant = this.getPlant(plantId);
    if (!plant) return { ok: false, msg: 'Hạt không hợp lệ!' };
    if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
    if (!currentPlayer.inventory.seedsStar) currentPlayer.inventory.seedsStar = {};
    if (!currentPlayer.inventory.protects) currentPlayer.inventory.protects = {};

    
    const unlimited = this.isUnlimitedResources();
    const seeds = currentPlayer.inventory.seeds;
    const stars = currentPlayer.inventory.seedsStar;
    const protects = currentPlayer.inventory.protects;
    let protect = null;
    if (protectId) {
      protect = this.getProtect(protectId);
      if (!protect) return { ok: false, msg: 'Bùa bảo hộ không hợp lệ!' };
    }

    const ratePct = this.getMergeSuccessRate(protectId || null);
    const p = ratePct / 100;
    const lastRate = ratePct;

    let wantAll = (times === 'all' || times === 'max' || times === Infinity);
    let timesLeft = wantAll ? Number.MAX_SAFE_INTEGER : Math.max(1, Math.floor(Number(times) || 1));
    if (!Number.isFinite(timesLeft) || timesLeft < 1) timesLeft = 1;
    if (wantAll && unlimited) {
      
      timesLeft = 1000000;
      wantAll = false;
    }

    let success = 0;
    let fail = 0;
    let did = 0;
    let guard = 0;
    const YIELD_EVERY_BLOCKS = 1;

    while (timesLeft > 0 && guard++ < 500000) {
      let have = unlimited ? Number.MAX_SAFE_INTEGER : (seeds[plantId] || 0);
      if (!unlimited && have < 2) break;
      let ph = 0;
      if (protect && !unlimited) {
        ph = protects[protectId] || 0;
        if (ph < 1) {
          if (did === 0) return { ok: false, msg: 'Không đủ bùa bảo hộ!' };
          break;
        }
      }

      
      
      let maxBySeed = unlimited ? timesLeft : Math.floor(have / 2);
      if (protect && !unlimited) maxBySeed = Math.min(maxBySeed, ph);
      let B = Math.min(timesLeft, maxBySeed);
      if (B < 1) break;

      
      if (B > 200000) B = 200000;

      const k = this._binomialSample(B, p); 
      const f = B - k;

      if (!unlimited) {
        
        const consume = B + k;
        seeds[plantId] = have - consume;
        if (seeds[plantId] <= 0) delete seeds[plantId];
        if (protect) {
          protects[protectId] = ph - B;
          if (protects[protectId] <= 0) delete protects[protectId];
        }
      }
      if (k > 0) stars[plantId] = (stars[plantId] || 0) + k;

      success += k;
      fail += f;
      did += B;
      timesLeft -= B;

      
      if ((guard % YIELD_EVERY_BLOCKS) === 0) {
        await new Promise(r => setTimeout(r, 0));
      }
    }

    if (did === 0) return { ok: false, msg: 'Cần ít nhất 2 hạt thường cùng loại!' };

    if (did === 1) {
      if (success) {
        this.addActivity(`Ghép thành công ⭐ ${plant.name} (${lastRate}%)`);
        await savePlayer();
        return { ok: true, success: true, msg: `✨ Thành công! Nhận 1 hạt sao ${plant.name} (tỉ lệ ${lastRate}%)` };
      }
      this.addActivity(`Ghép thất bại ${plant.name} (${lastRate}%)`);
      await savePlayer();
      return { ok: true, success: false, msg: `💥 Thất bại (tỉ lệ ${lastRate}%). Mất 1 hạt` + (protectId ? ' + bùa' : '') + '.' };
    }

    this.addActivity(`Ghép ×${did}: thành công ${success}, thất bại ${fail} (${plant.name}, ${lastRate}%)`);
    await savePlayer();
    return {
      ok: true,
      success: success > 0,
      msg: `Ghép ${did.toLocaleString()} lần · ✨ ${success.toLocaleString()} sao · 💥 ${fail.toLocaleString()} thất bại (tỉ lệ ${lastRate}%)`,
      did, successCount: success, failCount: fail
    };
  },


  /** Ghép 2 hạt sao → 1 hạt huyền thoại */
  async mergeMythSeeds(plantId, protectId, times = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plant = this.getPlant(plantId);
    if (!plant) return { ok: false, msg: 'Hạt không hợp lệ!' };
    if (!currentPlayer.inventory.seedsStar) currentPlayer.inventory.seedsStar = {};
    if (!currentPlayer.inventory.seedsMyth) currentPlayer.inventory.seedsMyth = {};
    if (!currentPlayer.inventory.protects) currentPlayer.inventory.protects = {};

    const unlimited = this.isUnlimitedResources();
    const stars = currentPlayer.inventory.seedsStar;
    const myths = currentPlayer.inventory.seedsMyth;
    const protects = currentPlayer.inventory.protects;
    let protect = null;
    if (protectId) {
      protect = this.getProtect(protectId);
      if (!protect) return { ok: false, msg: 'Bùa bảo hộ không hợp lệ!' };
    }

    // Cùng công thức bùa như ghép sao: base + protect, cap 100%
    // (Bùa 100% → chắc chắn thành công, không trừ thêm)
    let ratePct = this.getMergeSuccessRate(protectId || null);
    ratePct = Math.max(1, Math.min(100, ratePct));
    const p = ratePct / 100;
    const lastRate = ratePct;

    let wantAll = (times === 'all' || times === 'max' || times === Infinity);
    let timesLeft = wantAll ? Number.MAX_SAFE_INTEGER : Math.max(1, Math.floor(Number(times) || 1));
    if (!Number.isFinite(timesLeft) || timesLeft < 1) timesLeft = 1;
    if (wantAll && unlimited) {
      timesLeft = 1000000;
      wantAll = false;
    }

    let success = 0;
    let fail = 0;
    let did = 0;
    let guard = 0;

    while (timesLeft > 0 && guard++ < 500000) {
      let have = unlimited ? Number.MAX_SAFE_INTEGER : (stars[plantId] || 0);
      if (!unlimited && have < 2) break;
      let ph = 0;
      if (protect && !unlimited) {
        ph = protects[protectId] || 0;
        if (ph < 1) {
          if (did === 0) return { ok: false, msg: 'Không đủ bùa bảo hộ!' };
          break;
        }
      }
      let maxBySeed = unlimited ? timesLeft : Math.floor(have / 2);
      if (protect && !unlimited) maxBySeed = Math.min(maxBySeed, ph);
      let B = Math.min(timesLeft, maxBySeed);
      if (B < 1) break;
      if (B > 200000) B = 200000;

      const k = this._binomialSample(B, p);
      const f = B - k;

      if (!unlimited) {
        // Thành công: mất 2 sao/lần; thất bại: mất 1 sao/lần (giống logic ghép thường)
        const consume = B + k;
        stars[plantId] = have - consume;
        if (stars[plantId] <= 0) delete stars[plantId];
        if (protect) {
          protects[protectId] = ph - B;
          if (protects[protectId] <= 0) delete protects[protectId];
        }
      }
      if (k > 0) myths[plantId] = (myths[plantId] || 0) + k;

      success += k;
      fail += f;
      did += B;
      timesLeft -= B;
      if ((guard % 1) === 0) {
        await new Promise(r => setTimeout(r, 0));
      }
    }

    if (did === 0) return { ok: false, msg: 'Cần ít nhất 2 hạt sao ⭐ cùng loại để ghép huyền thoại!' };

    if (did === 1) {
      if (success) {
        this.addActivity(`Ghép huyền thoại ✨ ${plant.name} (${lastRate}%)`);
        await savePlayer();
        return { ok: true, success: true, msg: `🌌 Thành công! Nhận 1 hạt huyền thoại ${plant.name} (tỉ lệ ${lastRate}%)` };
      }
      this.addActivity(`Ghép huyền thoại thất bại ${plant.name} (${lastRate}%)`);
      await savePlayer();
      return { ok: true, success: false, msg: `💥 Thất bại (tỉ lệ ${lastRate}%). Mất 1 hạt sao` + (protectId ? ' + bùa' : '') + '.' };
    }

    this.addActivity(`Ghép huyền thoại ×${did}: thành công ${success}, thất bại ${fail} (${plant.name}, ${lastRate}%)`);
    await savePlayer();
    return {
      ok: true,
      success: success > 0,
      msg: `Huyền thoại ${did.toLocaleString()} lần · ✨ ${success.toLocaleString()} · 💥 ${fail.toLocaleString()} (tỉ lệ ${lastRate}%)`,
      did, successCount: success, failCount: fail
    };
  },

  async harvestPlot(plotId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plot = currentPlayer.plots[plotId];
    if (!plot || !plot.plantId) return { ok: false, msg: 'Không có cây!' };
    if (!this.isReady(plot)) return { ok: false, msg: 'Cây chưa chín!' };
    const plant = this.getPlant(plot.plantId);
    let amount = plant.yield;
    if (plot.fertilizerId) {
      const fert = this.getFertilizer(plot.fertilizerId);
      if (fert && fert.yieldBonus) amount = Math.ceil(amount * (1 + fert.yieldBonus));
    }
    if ((plot.waterCount || 0) >= 2) amount = Math.ceil(amount * 1.1);
    amount = this.applySeedYieldBonus(plot, amount);
    const hid = plot.plantId;
    this.stashHarvestProduct(hid, amount, plot);
    currentPlayer.stats.harvested = (currentPlayer.stats.harvested || 0) + amount;
    if (typeof Features !== 'undefined') Features.trackQuest('harvest', 1);
    const newCol = this.unlockCollection(plot.plantId);
    const xpGain = Math.ceil((plant.xp || 5) * this.getSeedXpMult(plot));
    this.addXp(xpGain);
    const _ht = this.getPlotSeedTier(plot);
    const _htag = _ht === 'myth' ? ' ✨' : (_ht === 'star' ? ' ⭐' : '');
    plot.plantId = null;
    plot.plantedAt = null;
    plot.watered = false;
    plot.waterCount = 0;
    plot.lastWatered = null;
    plot.fertilizerId = null;
    plot.fertilizedAt = null;
    plot.seedStar = false;
    plot.seedMyth = false;
    this.trackDayStat('harvest', { yield: amount, plots: 1, cycles: 1, gardenIndex: currentPlayer.activeGarden || 0, name: plant.name, plotId });
    this.pushGameEvent({
      action: 'harvest',
      actor: 'player',
      category: 'garden',
      target: { type: 'crop', id: hid, name: plant.name + (_htag || '') },
      quantity: amount,
      cellId: plotId,
      gardenIndex: currentPlayer.activeGarden || 0,
      plantId: hid,
      sp: amount,
      xp: xpGain,
      summaryText: '🌱 Thu hoạch ' + plant.name + _htag + ' tại ô #' + (plotId + 1) + ' · ×' + amount + ' · +' + xpGain + ' XP' + (newCol ? ' · Album +1' : ''),
      result: { sp: amount, xp: xpGain },
      detail: { newCollection: !!newCol }
    });
    if (typeof renderActivityPage === 'function') {
      try {
        const page = document.getElementById('page-activity');
        if (page && page.classList.contains('active')) renderActivityPage();
      } catch (_) {}
    }
    if (typeof recordGameEvent === 'function') {
      recordGameEvent('harvest', {
        plotId,
        gardenIndex: currentPlayer.activeGarden || 0,
        plantId: hid,
        amount,
        at: (typeof nowMs === 'function' ? nowMs() : Date.now())
      });
    }
    const ach = this.checkAchievements();
    await savePlayer({ action: 'harvest' });
    this.notifyAchievements(ach);
    return { ok: true, msg: `Thu hoạch ${amount} ${plant.name}! +${xpGain} XP` + (newCol ? ' · Mở album!' : '') };
  },

  async harvestAll(limit) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const max = (limit == null || limit === 'all') ? Infinity : Math.max(0, parseInt(limit, 10) || 0);
    let total = 0, totalXp = 0, plotsDone = 0;
    for (const plot of currentPlayer.plots) {
      if (plotsDone >= max) break;
      if (plot.plantId && this.isReady(plot)) {
        const plant = this.getPlant(plot.plantId);
        let amount = plant.yield;
        if (plot.fertilizerId) {
          const fert = this.getFertilizer(plot.fertilizerId);
          if (fert && fert.yieldBonus) amount = Math.ceil(amount * (1 + fert.yieldBonus));
        }
        if ((plot.waterCount || 0) >= 2) amount = Math.ceil(amount * 1.1);
        amount = this.applySeedYieldBonus(plot, amount);
        const hid = plot.plantId;
        this.stashHarvestProduct(hid, amount, plot);
        currentPlayer.stats.harvested = (currentPlayer.stats.harvested || 0) + amount;
        this.unlockCollection(plot.plantId);
        total += amount;
        totalXp += Math.ceil((plant.xp || 5) * this.getSeedXpMult(plot));
        plot.plantId = null;
        plot.plantedAt = null;
        plot.watered = false;
        plot.waterCount = 0;
        plot.lastWatered = null;
        plot.fertilizerId = null;
        plot.fertilizedAt = null;
        plot.seedStar = false;
    plot.seedMyth = false;
        plotsDone++;
      }
    }
    if (total > 0) {
      this.addXp(totalXp);
      this.trackDayStat('harvest', { yield: total, plots: plotsDone, cycles: 1, gardenIndex: currentPlayer.activeGarden || 0, name: 'nhiều loại' });
      this.addActivity(`Thu hoạch ${plotsDone} ô: ${total} sản phẩm (+${totalXp} XP)`);
      const ach = this.checkAchievements();
      await savePlayer();
      this.notifyAchievements(ach);
    }
    return { ok: true, msg: total > 0 ? `Thu hoạch ${total} sản phẩm! +${totalXp} XP` : 'Chưa có gì chín.' };
  },

  async removePlant(plotId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plot = currentPlayer.plots[plotId];
    if (!plot || !plot.plantId) return { ok: false, msg: 'Không có cây!' };
    const plant = this.getPlant(plot.plantId);
    plot.plantId = null;
    plot.plantedAt = null;
    plot.watered = false;
    plot.waterCount = 0;
    plot.lastWatered = null;
    plot.fertilizerId = null;
    plot.fertilizedAt = null;
    plot.seedStar = false;
    plot.seedMyth = false;
    this.addActivity(`Nhổ bỏ ${plant ? plant.name : 'cây'}`);
    await savePlayer();
    return { ok: true, msg: `Đã nhổ bỏ ${plant ? plant.name : 'cây'}.` };
  },

  

  async sellFertilizer(fertId, qty = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const fert = this.getFertilizer(fertId);
    if (!fert) return { ok: false, msg: 'Phân bón không hợp lệ!' };
    qty = Math.max(1, parseInt(qty, 10) || 1);
    if (!currentPlayer.inventory.fertilizers) currentPlayer.inventory.fertilizers = {};
    const have = currentPlayer.inventory.fertilizers[fertId] || 0;
    if (have < qty) return { ok: false, msg: 'Không đủ phân bón!' };
    const unit = Math.max(1, Math.floor((Number(fert.price) || 10) * 0.5));
    const earn = unit * qty;
    currentPlayer.inventory.fertilizers[fertId] -= qty;
    if (currentPlayer.inventory.fertilizers[fertId] <= 0) delete currentPlayer.inventory.fertilizers[fertId];
    currentPlayer.coins = (currentPlayer.coins || 0) + earn;
    currentPlayer.stats = currentPlayer.stats || {};
    currentPlayer.stats.earned = (currentPlayer.stats.earned || 0) + earn;
    if (typeof Features !== 'undefined' && Features.trackQuest) Features.trackQuest('earn', earn);
    this.addActivity('Bán ' + qty + ' ' + fert.name + ' (+' + earn + '🪙)');
    await savePlayer();
    return { ok: true, msg: 'Bán ' + qty + ' ' + fert.name + ', nhận ' + earn + '🪙!' };
  },

  async sellSeed(plantId, qty = 1, kind = 'normal') {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plant = this.getPlant(plantId);
    if (!plant) return { ok: false, msg: 'Hạt không hợp lệ!' };
    if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
    if (!currentPlayer.inventory.seedsStar) currentPlayer.inventory.seedsStar = {};
    if (!currentPlayer.inventory.seedsMyth) currentPlayer.inventory.seedsMyth = {};
    qty = Math.max(1, parseInt(qty, 10) || 1);
    let soldN = 0, soldS = 0, soldM = 0, earn = 0;
    const unitNormal = Math.max(1, Math.floor((plant.seedPrice || 1) * 0.5));
    const unitStar = Math.max(1, Math.floor((plant.seedPrice || 1) * 0.75));
    const unitMyth = Math.max(1, Math.floor((plant.seedPrice || 1) * 1.2));

    if (kind === 'myth' || kind === 'all') {
      const haveM = currentPlayer.inventory.seedsMyth[plantId] || 0;
      const takeM = kind === 'all' ? haveM : Math.min(qty, haveM);
      if (takeM > 0) {
        currentPlayer.inventory.seedsMyth[plantId] -= takeM;
        if (currentPlayer.inventory.seedsMyth[plantId] <= 0) delete currentPlayer.inventory.seedsMyth[plantId];
        soldM = takeM;
        earn += unitMyth * takeM;
      }
    }
    if (kind === 'star' || kind === 'all') {
      const haveS = currentPlayer.inventory.seedsStar[plantId] || 0;
      const takeS = kind === 'all' ? haveS : Math.min(qty, haveS);
      if (takeS > 0) {
        currentPlayer.inventory.seedsStar[plantId] -= takeS;
        if (currentPlayer.inventory.seedsStar[plantId] <= 0) delete currentPlayer.inventory.seedsStar[plantId];
        soldS = takeS;
        earn += unitStar * takeS;
      }
    }
    if (kind === 'normal' || kind === 'all') {
      const haveN = currentPlayer.inventory.seeds[plantId] || 0;
      const takeN = kind === 'all' ? haveN : Math.min(qty, haveN);
      if (takeN > 0) {
        currentPlayer.inventory.seeds[plantId] -= takeN;
        if (currentPlayer.inventory.seeds[plantId] <= 0) delete currentPlayer.inventory.seeds[plantId];
        soldN = takeN;
        earn += unitNormal * takeN;
      }
    }
    if (soldN + soldS + soldM < 1) return { ok: false, msg: 'Không đủ hạt để bán!' };
    currentPlayer.coins += earn;
    currentPlayer.stats.earned = (currentPlayer.stats.earned || 0) + earn;
    if (typeof Features !== 'undefined') Features.trackQuest('earn', earn);
    const parts = [];
    if (soldN) parts.push(`${soldN} thường`);
    if (soldS) parts.push(`${soldS} ⭐`);
    if (soldM) parts.push(`${soldM} ✨`);
    this.addActivity(`Bán hạt ${plant.name} (${parts.join(', ')}) (+${earn}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Bán ${parts.join(' + ')} ${plant.name}, nhận ${earn}🪙!` };
  },

  
  
  normalizeHarvestBags() {
    if (!currentPlayer || !currentPlayer.inventory) return;
    const inv = currentPlayer.inventory;
    if (!inv.harvest) inv.harvest = {};
    if (!inv.harvestStar) inv.harvestStar = {};
    if (!inv.harvestMyth) inv.harvestMyth = {};
    if (!inv.harvestBought) inv.harvestBought = {};
    if (!inv.dishes) inv.dishes = {};
    if (!inv.dishesStar) inv.dishesStar = {};
    if (!inv.dishesMyth) inv.dishesMyth = {};
    if (inv._harvestSplitDone) return;
    Object.keys(inv.harvestStar).forEach(id => {
      const star = inv.harvestStar[id] || 0;
      if (star > 0 && (inv.harvest[id] || 0) >= star) {
        inv.harvest[id] -= star;
        if (inv.harvest[id] <= 0) delete inv.harvest[id];
      }
    });
    inv._harvestSplitDone = true;
  },

  harvestBagKey(tier) {
    if (tier === 'myth') return 'harvestMyth';
    if (tier === 'star') return 'harvestStar';
    return 'harvest';
  },
  dishBagKey(tier) {
    if (tier === 'myth') return 'dishesMyth';
    if (tier === 'star') return 'dishesStar';
    return 'dishes';
  },
  getDishSellPrice(recipe, tier) {
    const base = Math.max(0, Number(recipe && recipe.sellPrice) || 0);
    return Math.ceil(base * this.getSeedSellMult(tier === 'myth' ? 'myth' : (tier === 'star' ? 'star' : 'normal')));
  },

  async sellHarvest(plantId, qty = 1, kind = 'normal') {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plant = this.getPlant(plantId);
    if (!plant) return { ok: false, msg: 'Sản phẩm không hợp lệ!' };
    qty = Math.max(1, parseInt(qty, 10) || 1);
    const bagKey = kind === 'myth' ? 'harvestMyth' : (kind === 'star' ? 'harvestStar' : (kind === 'bought' ? 'harvestBought' : 'harvest'));
    if (!currentPlayer.inventory[bagKey]) currentPlayer.inventory[bagKey] = {};
    const have = currentPlayer.inventory[bagKey][plantId] || 0;
    if (have < qty) return { ok: false, msg: 'Không đủ sản phẩm!' };
    const unit = Math.ceil(plant.sellPrice * this.getSeedSellMult(kind === 'myth' ? 'myth' : (kind === 'star' ? 'star' : 'normal')));
    const earn = unit * qty;
    if (typeof Features !== 'undefined') Features.trackQuest('earn', earn);
    currentPlayer.inventory[bagKey][plantId] -= qty;
    if (currentPlayer.inventory[bagKey][plantId] <= 0) delete currentPlayer.inventory[bagKey][plantId];
    currentPlayer.coins += earn;
    currentPlayer.stats.earned = (currentPlayer.stats.earned || 0) + earn;
    const tag = kind === 'myth' ? '✨' : (kind === 'star' ? '⭐' : (kind === 'bought' ? '🛒' : ''));
    this.addActivity(`Bán ${qty} ${plant.name}${tag} (+${earn}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Bán ${qty} ${plant.name}, nhận ${earn}🪙!` };
  },

  async sellAllHarvest(kind = null) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    let total = 0;
    const bags = kind ? [kind] : ['harvest', 'harvestStar', 'harvestMyth', 'harvestBought'];
    bags.forEach(bk => {
      const bag = currentPlayer.inventory[bk] || {};
      Object.keys(bag).forEach(id => {
        const plant = this.getPlant(id);
        if (!plant) return;
        const qty = bag[id] || 0;
        if (qty <= 0) return;
        const tier = bk === 'harvestMyth' ? 'myth' : (bk === 'harvestStar' ? 'star' : 'normal');
        const unit = Math.ceil(plant.sellPrice * this.getSeedSellMult(tier));
        total += unit * qty;
      });
      currentPlayer.inventory[bk] = {};
    });
    currentPlayer.coins += total;
    currentPlayer.stats.earned = (currentPlayer.stats.earned || 0) + total;
    if (total > 0) {
      this.addActivity(`Bán tất cả hoa quả (+${total}🪙)`);
      await savePlayer();
    }
    return { ok: true, msg: total > 0 ? `Bán hết, nhận ${total}🪙!` : 'Kho trống.' };
  },

  /** Bảng thưởng streak (ngày liên tiếp) */
  getStreakRewardTable(streak, level) {
    const s = Math.max(1, Number(streak) || 1);
    const lv = Math.max(1, Number(level) || 1);
    const baseCoins = 150 + lv * 20;
    const streakBonus = Math.min(s, 30) * 15;
    let coins = baseCoins + streakBonus;
    let fertNormal = 2;
    let fertExtra = [];
    let milestoneText = '';

    if (s >= 3) {
      fertExtra.push({ id: 'phan-xanh', qty: 1 });
      milestoneText = 'Mốc 3 ngày';
    }
    if (s >= 7) {
      fertExtra.push({ id: 'phan-vang', qty: 1 });
      coins += 100;
      milestoneText = 'Mốc 7 ngày';
    }
    if (s >= 14) {
      fertExtra.push({ id: 'phan-do', qty: 1 });
      coins += 250;
      milestoneText = 'Mốc 14 ngày';
    }
    if (s >= 30) {
      fertExtra.push({ id: 'phan-tim', qty: 1 });
      coins += 500;
      milestoneText = 'Mốc 30 ngày';
    }
    if (s >= 60) {
      fertExtra.push({ id: 'phan-bac', qty: 1 });
      coins += 800;
      milestoneText = 'Mốc 60 ngày';
    }
    if (s >= 100) {
      fertExtra.push({ id: 'phan-vang-kim', qty: 1 });
      coins += 1500;
      milestoneText = 'Mốc 100 ngày';
    }

    return {
      coins,
      fertNormal,
      fertExtra,
      milestoneText,
      streak: s,
      baseCoins,
      streakBonus
    };
  },

  getLoginStreak() {
    if (!currentPlayer) return 0;
    return Math.max(0, Number(currentPlayer.loginStreak) || 0);
  },

  getMaxLoginStreak() {
    if (!currentPlayer) return 0;
    return Math.max(0, Number(currentPlayer.maxLoginStreak) || 0);
  },

  /**
   * Cập nhật chuỗi đăng nhập theo ngày GMT+7.
   * Gọi khi vào game (sau loadPlayer).
   */
  processLoginStreak() {
    if (!currentPlayer) return { changed: false, streak: 0, isNewDay: false, broken: false };

    const today = (typeof gameDateString === 'function') ? gameDateString() : new Date().toDateString();
    const yesterday = (typeof gameDateString === 'function')
      ? gameDateString((typeof nowMs === 'function' ? nowMs() : Date.now()) - 86400000)
      : new Date(Date.now() - 86400000).toDateString();

    const last = currentPlayer.lastLoginDay || null;
    let streak = Math.max(0, Number(currentPlayer.loginStreak) || 0);
    let changed = false;
    let isNewDay = false;
    let broken = false;

    if (last === today) {
      return { changed: false, streak, isNewDay: false, broken: false };
    }

    isNewDay = true;
    if (last === yesterday) {
      streak = streak + 1;
    } else {
      if (last && streak > 0) broken = true;
      streak = 1;
    }

    currentPlayer.loginStreak = streak;
    currentPlayer.lastLoginDay = today;
    currentPlayer.maxLoginStreak = Math.max(
      Number(currentPlayer.maxLoginStreak) || 0,
      streak
    );
    changed = true;

    if (typeof this.addActivity === 'function') {
      if (broken) {
        this.addActivity('Chuỗi đăng nhập bị đứt → bắt đầu lại ngày 1 🔥');
      } else if (streak > 1) {
        this.addActivity('Chuỗi đăng nhập: ' + streak + ' ngày 🔥');
      } else {
        this.addActivity('Đăng nhập ngày đầu tiên của chuỗi 🔥');
      }
    }

    return { changed, streak, isNewDay, broken };
  },

  async claimDaily() {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!', already: false };
    try {
      const streakRes = this.processLoginStreak();

      const today = (typeof gameDateString === 'function') ? gameDateString() : new Date().toDateString();
      const legacy = new Date().toDateString();
      // Chuẩn hóa lastDaily cũ (toDateString) về gameDateString nếu cùng ngày
      if (currentPlayer.lastDaily === legacy && today !== legacy) {
        currentPlayer.lastDaily = today;
      }
      if (currentPlayer.lastDaily === today || currentPlayer.lastDaily === legacy) {
        if (streakRes && streakRes.changed) {
          try { await savePlayer({ silent: true, action: 'streak-sync' }); } catch (_) {}
        }
        return {
          ok: false,
          already: true,
          msg: 'Bạn đã nhận thưởng hôm nay rồi! Chuỗi: ' + this.getLoginStreak() + ' ngày 🔥'
        };
      }

      const streak = this.getLoginStreak() || 1;
      const rewardInfo = this.getStreakRewardTable(streak, currentPlayer.level || 1);
      const reward = Math.max(0, Number(rewardInfo.coins) || 0);

      currentPlayer.coins = (currentPlayer.coins || 0) + reward;
      currentPlayer.lastDaily = today;
      currentPlayer.stats = currentPlayer.stats || {};
      currentPlayer.stats.earned = (currentPlayer.stats.earned || 0) + reward;

      if (!currentPlayer.inventory) currentPlayer.inventory = {};
      if (!currentPlayer.inventory.fertilizers) currentPlayer.inventory.fertilizers = {};
      currentPlayer.inventory.fertilizers['phan-thuong'] =
        (currentPlayer.inventory.fertilizers['phan-thuong'] || 0) + (rewardInfo.fertNormal || 2);

      (rewardInfo.fertExtra || []).forEach(f => {
        if (!f || !f.id) return;
        currentPlayer.inventory.fertilizers[f.id] =
          (currentPlayer.inventory.fertilizers[f.id] || 0) + (f.qty || 1);
      });

      try {
        this.trackDayStat('daily', { coins: reward, streak: streak });
      } catch (e) {
        console.warn('trackDayStat daily', e);
      }

      const saveRes = await savePlayer({ silent: true, action: 'claim-daily' });
      if (saveRes && saveRes.ok === false) {
        // Vẫn báo đã nhận local, nhưng cảnh báo lưu cloud
        return {
          ok: true,
          msg: 'Đã nhận ' + reward.toLocaleString() + '🪙 (streak ' + streak + ') — chưa lưu Firebase: ' + (saveRes.msg || 'lỗi mạng'),
          streak,
          coins: reward,
          saveWarn: true
        };
      }

      let msg = 'Streak ' + streak + ' ngày 🔥 · Nhận ' + reward.toLocaleString() + '🪙';
      msg += ' + ' + (rewardInfo.fertNormal || 2) + ' Phân thường';
      if ((rewardInfo.fertExtra || []).length) msg += ' + quà mốc!';
      if (rewardInfo.milestoneText) msg += ' (' + rewardInfo.milestoneText + ')';

      return { ok: true, msg, streak, coins: reward, rewardInfo };
    } catch (e) {
      console.error('claimDaily', e);
      return {
        ok: false,
        already: false,
        msg: 'Lỗi nhận thưởng: ' + (e && e.message ? e.message : String(e))
      };
    }
  },

  hasClaimedDaily() {
    if (!currentPlayer) return false;
    const today = (typeof gameDateString === 'function') ? gameDateString() : new Date().toDateString();
    const legacy = new Date().toDateString();
    return currentPlayer.lastDaily === today || currentPlayer.lastDaily === legacy;
  },

  emptyPlotCount() {
    if (!currentPlayer || !currentPlayer.plots) return 0;
    return currentPlayer.plots.filter(p => !p.plantId).length;
  },

  
  formatOfflineDuration(ms) {
    const s = Math.max(0, Math.floor(Number(ms) / 1000));
    if (s < 60) return s + ' giây';
    const days = Math.floor(s / 86400);
    const hours = Math.floor((s % 86400) / 3600);
    const mins = Math.floor((s % 3600) / 60);
    const parts = [];
    if (days) parts.push(days + ' ngày');
    if (hours) parts.push(hours + ' giờ');
    if (mins) parts.push(mins + ' phút');
    // dưới 1 giờ: chỉ phút (không ghi 0 giờ)
    if (!parts.length) return '0 giây';
    return parts.join(' ');
  },

  /** HH:mm:ss chính xác theo GMT+7 (withSeconds=false → HH:mm) */
  formatLogClock(ms, withSeconds) {
    if (!ms) return '';
    if (withSeconds == null) withSeconds = true;
    const pad = n => String(n).padStart(2, '0');
    try {
      // Ưu tiên Intl Asia/Ho_Chi_Minh để đúng GMT+7
      const opts = {
        timeZone: (typeof GAME_TIMEZONE !== 'undefined' ? GAME_TIMEZONE : 'Asia/Ho_Chi_Minh'),
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };
      if (withSeconds) opts.second = '2-digit';
      let s = new Date(ms).toLocaleTimeString('en-GB', opts);
      // en-GB → 08:32:15
      s = String(s).replace(/,/g, '').trim();
      const m = s.match(/(\d{1,2}):(\d{2})(?::(\d{2}))?/);
      if (m) {
        const hh = pad(m[1]);
        const mm = pad(m[2]);
        if (withSeconds) return hh + ':' + mm + ':' + pad(m[3] || '0');
        return hh + ':' + mm;
      }
      if (typeof formatGameDateTime === 'function') {
        const full = formatGameDateTime(ms, true);
        const m2 = String(full).match(/(\d{1,2}:\d{2}:\d{2})/);
        if (m2) return m2[1];
        const m3 = String(full).match(/(\d{1,2}:\d{2})/);
        if (m3 && !withSeconds) return m3[1].padStart(5, '0');
      }
      return s;
    } catch (_) {
      const d = new Date(Number(ms) + 7 * 3600 * 1000); // thô GMT+7
      // better use local if GAME_TZ fails
      try {
        return new Date(ms).toLocaleTimeString('vi-VN', {
          hour: '2-digit', minute: '2-digit', second: withSeconds ? '2-digit' : undefined,
          hour12: false, timeZone: 'Asia/Ho_Chi_Minh'
        });
      } catch (e2) {
        const x = new Date(ms);
        return pad(x.getHours()) + ':' + pad(x.getMinutes()) + (withSeconds ? ':' + pad(x.getSeconds()) : '');
      }
    }
  },


  





  /* ============================================================
   * HỆ THỐNG NHẬT KÝ HÀNH ĐỘNG CHI TIẾT (Event Log)
   * currentPlayer.gameEvents[] = từng event riêng (timestamp HH:mm:ss)
   * currentPlayer.activityLogs[] = offline sessions + legacy summaries
   * dayStats = bộ đếm tổng hợp (giữ để tương thích)
   * ============================================================ */

  OFFLINE_CONFIG: {
    thresholdMs: 5 * 60 * 1000,
    showPopup: true,
    createLog: true,
    showSecondsUnderMinute: true,
    maxDetailLogs: 100,
    maxGameEvents: 500
  },

  _logId() {
    return 'log_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  },

  _eventId() {
    return 'ev_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
  },

  _dayKey(ms) {
    if (typeof gameDateString === 'function') return gameDateString(ms);
    if (ms) return new Date(ms).toDateString();
    return new Date().toDateString();
  },

  ensureActivityLogs() {
    if (!currentPlayer) return [];
    if (!Array.isArray(currentPlayer.activityLogs)) currentPlayer.activityLogs = [];
    return currentPlayer.activityLogs;
  },

  ensureGameEvents() {
    if (!currentPlayer) return [];
    if (!Array.isArray(currentPlayer.gameEvents)) currentPlayer.gameEvents = [];
    return currentPlayer.gameEvents;
  },

  /** Khóa lọc cố định cho UI: all|garden|robot|nyc|fairy|helper|offline|level|reward|rain|system */
  resolveFilterKey(action, actor, text, category, mode) {
    const act = String(action || '').toLowerCase();
    const ac = String(actor || '').toLowerCase();
    const cat = String(category || '').toLowerCase();
    const md = String(mode || '').toLowerCase();
    const t = String(text || '');
    const tl = t.toLowerCase();

    if (md === 'offline' || cat === 'offline' || ac === 'offline' || act.indexOf('offline') >= 0 || /offline/i.test(t)) return 'offline';
    if (ac === 'robot' || cat === 'robot' || act.indexOf('robot') >= 0 || /robot/i.test(t)) return 'robot';
    if (ac === 'nyc' || cat === 'nyc' || act.indexOf('nyc') >= 0 || /\bnyc\b/i.test(t)) return 'nyc';
    if (ac === 'fairy' || cat === 'fairy' || act.indexOf('fairy') >= 0 || /tiên|fairy/i.test(t)) return 'fairy';
    if (ac === 'helper' || cat === 'helper' || act.indexOf('helper') >= 0 || /giúp việc|giup viec/i.test(t)) return 'helper';
    if (cat === 'level' || act === 'xp' || act === 'level_up' || act === 'levelup' || /\+\s*[\d.,]+\s*xp/i.test(t) || /lên cấp/i.test(t)) return 'level';
    if (cat === 'reward' || act === 'daily' || act === 'reward' || /thưởng|daily reward/i.test(t)) return 'reward';
    if (cat === 'rain' || act.indexOf('rain') === 0 || (/mưa/i.test(t) && !/robot/i.test(t))) return 'rain';
    if (cat === 'garden' || ['plant','water','harvest','fert','crop_ready','replant','remove','uproot'].indexOf(act) >= 0) return 'garden';
    if ((/trồng|tưới|thu hoạch|bón|nhổ|ô #/i.test(t)) && !/nyc|robot|tiên/i.test(t)) return 'garden';
    return 'system';
  },

  /** Lấy / reset dayStats theo ngày GMT+7 (bộ đếm online) */
  ensureDayStats() {
    if (!currentPlayer) return null;
    const dayKey = this._dayKey();
    if (!currentPlayer.dayStats || currentPlayer.dayStats.dayKey !== dayKey) {
      currentPlayer.dayStats = {
        dayKey,
        gardens: {},
        fairy: { gardensWatered: 0, waterActions: 0, rainSeeds: 0, fertActions: 0, _gSet: {} },
        nyc: { gardens: 0, plots: 0, harvestYield: 0, byGarden: {}, _gSet: {} },
        helper: { fertBought: 0, spent: 0, items: {} },
        robot: { seedsBought: {}, seedCost: 0, cooked: {}, cookCount: 0, mergeStar: 0, mergeMyth: 0 },
        offlineMs: 0,
        levelUps: [],
        levelFrom: null,
        rainCount: 0,
        rainSeeds: 0,
        dailyClaim: 0,
        streak: 0,
        xpGained: 0,
        _events: {}
      };
    }
    const ds = currentPlayer.dayStats;
    if (!ds.gardens) ds.gardens = {};
    if (!ds.fairy) ds.fairy = { gardensWatered: 0, waterActions: 0, rainSeeds: 0, fertActions: 0, _gSet: {} };
    if (!ds.nyc) ds.nyc = { gardens: 0, plots: 0, harvestYield: 0, byGarden: {}, _gSet: {} };
    if (!ds.helper) ds.helper = { fertBought: 0, spent: 0, items: {} };
    if (!ds.robot) ds.robot = { seedsBought: {}, seedCost: 0, cooked: {}, cookCount: 0, mergeStar: 0, mergeMyth: 0 };
    if (!Array.isArray(ds.levelUps)) ds.levelUps = [];
    if (!ds.nyc.byGarden) ds.nyc.byGarden = {};
    if (!ds._events || typeof ds._events !== 'object') ds._events = {};
    return ds;
  },

  _gardenStat(gi) {
    const ds = this.ensureDayStats();
    if (!ds) return null;
    const key = String(gi == null ? (currentPlayer.activeGarden || 0) : gi);
    if (!ds.gardens[key]) {
      ds.gardens[key] = {
        plantedQty: 0, plantActions: 0, replanted: 0,
        harvestYield: 0, plotsHarvested: 0, harvestCycles: 0
      };
    }
    return ds.gardens[key];
  },

  _mapKindToCategory(kind) {
    const k = String(kind || '');
    if (k.startsWith('robot') || k === 'helper_buy') return k === 'helper_buy' ? 'helper' : 'robot';
    if (k.startsWith('fairy') || k === 'rain') return k === 'rain' ? 'rain' : 'fairy';
    if (k.startsWith('nyc')) return 'nyc';
    if (k === 'plant' || k === 'replant' || k === 'harvest' || k === 'water' || k === 'fert' || k === 'crop_ready') return 'garden';
    if (k === 'levelup' || k === 'level_up' || k === 'xp') return 'level';
    if (k === 'daily' || k === 'reward') return 'reward';
    if (k === 'offline') return 'offline';
    return 'system';
  },

  /**
   * Ghi 1 EVENT riêng vào gameEvents (nguồn chính của nhật ký).
   * Không gộp, không bịa timestamp.
   */
  pushGameEvent(spec) {
    if (!currentPlayer || !spec) return null;
    try {
      const now = (spec.timestamp != null)
        ? Number(spec.timestamp)
        : ((typeof nowMs === 'function') ? nowMs() : Date.now());
      const category = spec.category || this._mapKindToCategory(spec.action || spec.type) || 'system';
      const action = String(spec.action || spec.type || 'action');
      const actor = String(spec.actor || 'player');
      const mode = spec.mode || 'online';
      const eventSource = spec.eventSource || (mode === 'offline' ? 'offline_calculation' : 'live');
      const id = spec.id || this._eventId();

      const ev = {
        id,
        timestamp: now,
        mode,
        eventSource,
        category,
        action,
        actor,
        target: spec.target || null,
        quantity: spec.quantity != null ? Number(spec.quantity) : (spec.qty != null ? Number(spec.qty) : null),
        result: spec.result || null,
        detail: spec.detail || {},
        summaryText: spec.summaryText || null,
        cellId: spec.cellId != null ? spec.cellId : (spec.plotId != null ? spec.plotId : null),
        gardenIndex: spec.gardenIndex != null ? spec.gardenIndex : null,
        offlineSessionId: spec.offlineSessionId || null,
        parentEventId: spec.parentEventId || null,
        dayKey: this._dayKey(now)
      };

      // Copy extra fields useful for detail
      if (spec.ingredients) ev.ingredients = spec.ingredients;
      if (spec.cost != null) ev.cost = spec.cost;
      if (spec.coins != null) ev.coins = spec.coins;
      if (spec.xp != null) ev.xp = spec.xp;
      if (spec.sp != null) ev.sp = spec.sp;
      if (spec.name) ev.name = spec.name;
      if (spec.plantId) ev.plantId = spec.plantId;
      if (spec.recipeId) ev.recipeId = spec.recipeId;
      if (spec.seedId) ev.seedId = spec.seedId;
      if (spec.tier) ev.tier = spec.tier;
      if (spec.plantedAt != null) ev.plantedAt = spec.plantedAt;
      if (spec.readyAt != null) ev.readyAt = spec.readyAt;
      if (spec.before) ev.before = spec.before;
      if (spec.after) ev.after = spec.after;
      if (spec.text) ev.text = spec.text;

      // Khóa lọc cố định
      ev.filter = this.resolveFilterKey(
        ev.action,
        ev.actor,
        ev.summaryText || ev.text || (ev.target && ev.target.name) || '',
        ev.category,
        ev.mode
      );

      const list = this.ensureGameEvents();
      list.unshift(ev);
      const maxN = (this.OFFLINE_CONFIG && this.OFFLINE_CONFIG.maxGameEvents) || 500;
      if (list.length > maxN) currentPlayer.gameEvents = list.slice(0, maxN);

      // Cũng đẩy vào dayStats._events để summary vẫn có chi tiết
      try {
        this._pushDayEvent(action, Object.assign({}, spec, {
          plots: spec.quantity || spec.qty || spec.plots,
          qty: spec.quantity || spec.qty,
          yield: spec.sp || (spec.result && spec.result.sp),
          name: (spec.target && spec.target.name) || spec.name,
          plotId: ev.cellId
        }), ev.gardenIndex);
      } catch (_) {}

      return ev;
    } catch (e) {
      console.warn('pushGameEvent', e);
      return null;
    }
  },

  /** Tạo summary text ngắn cho 1 event (hiển thị dòng list) */
  formatEventSummaryText(ev) {
    if (!ev) return '';
    if (ev.summaryText) return ev.summaryText;
    if (ev.text) return ev.text;
    const actorIcon = {
      player: '👤', robot: '🤖', nyc: '❤️', fairy: '🧚', helper: '🧹', system: '⚙️', offline: '⚡'
    }[ev.actor] || '';
    const q = ev.quantity != null ? ev.quantity : null;
    const tName = (ev.target && ev.target.name) || ev.name || '';
    const cell = ev.cellId != null ? (' ô #' + (Number(ev.cellId) + 1)) : '';
    const act = String(ev.action || '');

    if (act === 'buy' || act === 'buy_seed' || act === 'robot_seed') {
      return (actorIcon + ' ' + (ev.actor === 'robot' ? 'Robot' : '') + ' mua ' + (q != null ? q + ' × ' : '') + (tName || 'hạt')).trim();
    }
    if (act === 'cook' || act === 'robot_cook') {
      return (actorIcon + ' Robot nấu ' + (q != null ? q + ' × ' : '') + (tName || 'món')).trim();
    }
    if (act === 'merge' || act === 'robot_merge') {
      return (actorIcon + ' Robot ghép ' + (tName || 'vật phẩm') + (q != null ? ' ×' + q : '')).trim();
    }
    if (act === 'plant' || act === 'replant') {
      return '🌱 Trồng ' + (tName || 'cây') + cell + (act === 'replant' ? ' (trồng lại)' : '');
    }
    if (act === 'water') {
      return '💧 Tưới ' + (tName || 'cây') + cell;
    }
    if (act === 'fert' || act === 'fertilize') {
      return '🧪 Bón ' + (tName || 'phân') + cell;
    }
    if (act === 'harvest') {
      let s = '🌱 Thu hoạch ' + (tName || 'cây') + cell;
      if (q != null) s += ' · ×' + q;
      if (ev.sp) s += ' · +' + ev.sp + ' SP';
      else if (ev.result && ev.result.sp) s += ' · +' + ev.result.sp + ' SP';
      return s;
    }
    if (act === 'crop_ready') {
      return '🌱 ' + (tName || 'Cây') + cell + ' đã chín';
    }
    if (act === 'remove' || act === 'uproot') {
      return '🌱 Nhổ ' + (tName || 'cây') + cell;
    }
    if (act === 'level_up' || act === 'levelup') {
      const from = (ev.detail && ev.detail.from) || (ev.before && ev.before.level);
      const to = (ev.detail && ev.detail.to) || (ev.after && ev.after.level) || ev.level;
      return '⬆️ Lên cấp' + (from != null && to != null ? (' Lv ' + from + ' → Lv ' + to) : '');
    }
    if (act === 'xp' || act === 'xp_gain') {
      const xp = ev.xp != null ? ev.xp : (ev.result && ev.result.xp);
      return '⭐ +' + (xp != null ? Number(xp).toLocaleString() : '?') + ' XP';
    }
    if (act === 'reward' || act === 'daily') {
      return '🎁 Nhận thưởng' + (ev.coins ? (' · +' + Number(ev.coins).toLocaleString() + '🪙') : '');
    }
    if (act === 'rain_start') return '🌧️ Bắt đầu mưa';
    if (act === 'rain_end') return '🌧️ Kết thúc mưa';
    if (act === 'rain') return '🌧️ Mưa' + (q != null ? (' · ' + q + ' ô') : '');
    if (act === 'offline_start') return '⚡ Bắt đầu offline';
    if (act === 'offline_end' || act === 'offline') {
      const dur = (ev.detail && ev.detail.durationText) || '';
      return '⚡ Offline kết thúc' + (dur ? (' · ' + dur) : '');
    }
    if (act === 'fairy_water') return '🧚 Tiên tưới' + cell + (tName ? (' · ' + tName) : '');
    if (act === 'fairy_rain_seed') return '🧚 Tiên nhặt hạt' + (q != null ? (' ×' + q) : '') + (tName ? (' ' + tName) : '');
    if (act === 'nyc_harvest' || (ev.actor === 'nyc' && act === 'harvest')) {
      return '❤️ NYC thu hoạch ' + (tName || '') + (q != null ? (' ×' + q) : '');
    }
    if (act === 'nyc_plant' || (ev.actor === 'nyc' && act === 'plant')) {
      return '❤️ NYC trồng ' + (tName || '') + cell;
    }
    if (act === 'helper_buy') return '🧹 Giúp việc mua ' + (tName || 'vật phẩm') + (q != null ? (' ×' + q) : '');
    if (act === 'currency' || act === 'coins') {
      const c = ev.coins != null ? ev.coins : (ev.result && ev.result.currency);
      const sign = c >= 0 ? '+' : '';
      return '💰 ' + sign + Number(c || 0).toLocaleString() + '🪙' + (ev.detail && ev.detail.source ? (' · ' + ev.detail.source) : '');
    }
    // fallback
    return (actorIcon + ' ' + act + (tName ? (' ' + tName) : '') + (q != null ? (' ×' + q) : '')).trim();
  },

  /**
   * Ghi nhận thống kê + đồng bộ activityLogs (summary/detail).
   * Vẫn giữ để tương thích code cũ gọi trackDayStat.
   */
  trackDayStat(kind, data) {
    if (!currentPlayer) return;
    const ds = this.ensureDayStats();
    if (!ds) return;
    const d = data || {};
    const gi = d.gardenIndex != null ? d.gardenIndex : (currentPlayer.activeGarden || 0);

    switch (String(kind)) {
      case 'plant': {
        const g = this._gardenStat(gi);
        if (!g) break;
        const n = Math.max(0, Number(d.plots) || Number(d.qty) || 1);
        g.plantedQty += n;
        g.plantActions += Math.max(1, Number(d.actions) || 1);
        if (d.replant) g.replanted += n;
        break;
      }
      case 'replant': {
        const g = this._gardenStat(gi);
        if (!g) break;
        const n = Math.max(0, Number(d.plots) || Number(d.qty) || 1);
        g.replanted += n;
        g.plantedQty += n;
        g.plantActions += Math.max(1, Number(d.actions) || 1);
        break;
      }
      case 'harvest': {
        const g = this._gardenStat(gi);
        if (!g) break;
        g.harvestYield += Math.max(0, Number(d.yield) || Number(d.qty) || 0);
        g.plotsHarvested += Math.max(0, Number(d.plots) || 1);
        g.harvestCycles += Math.max(1, Number(d.cycles) || 1);
        break;
      }
      case 'fairy_water': {
        ds.fairy.waterActions += Math.max(0, Number(d.actions) || Number(d.plots) || 1);
        ds.fairy._gSet = ds.fairy._gSet || {};
        if (d.gardenIndex != null) {
          ds.fairy._gSet[String(d.gardenIndex)] = 1;
          ds.fairy.gardensWatered = Object.keys(ds.fairy._gSet).length;
        } else if (d.gardens) {
          ds.fairy.gardensWatered = Math.max(ds.fairy.gardensWatered, Number(d.gardens) || 0);
        }
        break;
      }
      case 'fairy_fert': {
        ds.fairy.fertActions += Math.max(0, Number(d.actions) || Number(d.plots) || 1);
        break;
      }
      case 'fairy_rain_seed': {
        const q = Math.max(0, Number(d.qty) || 1);
        ds.fairy.rainSeeds += q;
        ds.rainSeeds = (ds.rainSeeds || 0) + q;
        break;
      }
      case 'nyc_plant': {
        const plots = Math.max(0, Number(d.plots) || 1);
        ds.nyc.plots += plots;
        ds.nyc._gSet = ds.nyc._gSet || {};
        const gk = String(d.gardenIndex != null ? d.gardenIndex : gi);
        ds.nyc._gSet[gk] = 1;
        ds.nyc.gardens = Object.keys(ds.nyc._gSet).length;
        if (!ds.nyc.byGarden[gk]) ds.nyc.byGarden[gk] = { plots: 0, yield: 0 };
        ds.nyc.byGarden[gk].plots = (ds.nyc.byGarden[gk].plots || 0) + plots;
        break;
      }
      case 'nyc_harvest': {
        const y = Math.max(0, Number(d.yield) || Number(d.qty) || 0);
        const plots = Math.max(0, Number(d.plots) || 1);
        ds.nyc.harvestYield += y;
        ds.nyc.plots += plots;
        ds.nyc._gSet = ds.nyc._gSet || {};
        const gk = String(d.gardenIndex != null ? d.gardenIndex : gi);
        ds.nyc._gSet[gk] = 1;
        ds.nyc.gardens = Object.keys(ds.nyc._gSet).length;
        if (!ds.nyc.byGarden[gk]) ds.nyc.byGarden[gk] = { plots: 0, yield: 0 };
        ds.nyc.byGarden[gk].yield = (ds.nyc.byGarden[gk].yield || 0) + y;
        ds.nyc.byGarden[gk].plots = (ds.nyc.byGarden[gk].plots || 0) + plots;
        break;
      }
      case 'helper_buy': {
        ds.helper.fertBought += Math.max(0, Number(d.qty) || 1);
        ds.helper.spent += Math.max(0, Number(d.cost) || 0);
        break;
      }
      case 'robot_seed': {
        const nm = d.name || d.seedName || 'hạt';
        const q = Math.max(0, Number(d.qty) || 1);
        ds.robot.seedsBought[nm] = (ds.robot.seedsBought[nm] || 0) + q;
        ds.robot.seedCost += Math.max(0, Number(d.cost) || 0);
        break;
      }
      case 'robot_cook': {
        const nm = d.name || 'món';
        const q = Math.max(0, Number(d.qty) || 1);
        ds.robot.cooked[nm] = (ds.robot.cooked[nm] || 0) + q;
        ds.robot.cookCount += q;
        break;
      }
      case 'robot_merge': {
        ds.robot.mergeStar += Math.max(0, Number(d.star) || 0);
        ds.robot.mergeMyth += Math.max(0, Number(d.myth) || 0);
        break;
      }
      case 'rain': {
        ds.rainCount += Math.max(0, Number(d.count) || 1);
        break;
      }
      case 'levelup':
      case 'level_up': {
        const lv = Number(d.level) || (currentPlayer && currentPlayer.level) || 0;
        if (ds.levelFrom == null) ds.levelFrom = Math.max(1, lv - 1);
        ds.levelUps.push(lv);
        break;
      }
      case 'daily':
      case 'reward': {
        ds.dailyClaim = Math.max(0, Number(d.coins) || 0);
        ds.streak = Number(d.streak) || 0;
        break;
      }
      case 'xp': {
        ds.xpGained += Math.max(0, Number(d.xp) || Number(d.qty) || 0);
        break;
      }
      default:
        break;
    }

    try { this._pushDayEvent(kind, d, gi); } catch (_) {}

    // Auto-push individual game event khi có đủ dữ liệu chi tiết
    try {
      this._autoPushFromTrack(kind, d, gi);
    } catch (_) {}
  },

  /** Tự tạo event từ trackDayStat — CHỈ cho robot/level/reward khi có name (tránh double với addActivity) */
  _autoPushFromTrack(kind, d, gi) {
    if (!d) return;
    const k = String(kind);
    // Chỉ auto-push các kind thường không đi qua addActivity chi tiết từng món
    const autoKinds = ['robot_seed', 'robot_cook', 'robot_merge', 'levelup', 'level_up', 'daily', 'reward'];
    if (!autoKinds.includes(k)) return;
    if (k.startsWith('robot') && !d.name && k !== 'robot_merge') return;

    const list = this.ensureGameEvents();
    const now = (typeof nowMs === 'function') ? nowMs() : Date.now();
    const recent = list[0];
    if (recent && recent.action === k && Math.abs((recent.timestamp || 0) - now) < 120) {
      if (d.name && recent.target && recent.target.name === d.name) return;
      if (k === 'robot_merge') return;
      if (k === 'levelup' || k === 'level_up' || k === 'daily' || k === 'reward') return;
    }

    const actorMap = {
      robot_seed: 'robot', robot_cook: 'robot', robot_merge: 'robot',
      levelup: 'system', level_up: 'system', daily: 'system', reward: 'system'
    };
    const actor = actorMap[k] || 'system';
    const qty = d.qty != null ? d.qty : null;
    let summaryText = null;
    if (k === 'robot_seed') summaryText = '🤖 Robot mua ' + (qty != null ? qty + ' × ' : '') + (d.name || 'hạt');
    if (k === 'robot_cook') summaryText = '🤖 Robot nấu ' + (qty != null ? qty + ' × ' : '') + (d.name || 'món');
    if (k === 'robot_merge') summaryText = '🤖 Robot ghép ⭐×' + (d.star || 0) + ' · ✨×' + (d.myth || 0);
    if (k === 'levelup' || k === 'level_up') summaryText = '⬆️ Lên cấp Lv ' + (d.level || '');
    if (k === 'daily' || k === 'reward') summaryText = '🎁 Nhận thưởng' + (d.coins ? (' · +' + Number(d.coins).toLocaleString() + '🪙') : '');

    this.pushGameEvent({
      action: k,
      actor,
      category: this._mapKindToCategory(k),
      target: d.name ? { type: 'item', name: d.name, id: d.plantId || d.recipeId || d.seedId || null } : null,
      quantity: qty,
      gardenIndex: gi,
      cost: d.cost,
      coins: d.coins,
      xp: d.xp,
      name: d.name,
      summaryText,
      detail: Object.assign({}, d),
      timestamp: now
    });
  },

  _pushDayEvent(kind, data, gi) {
    const ds = this.ensureDayStats();
    if (!ds) return;
    const cat = this._mapKindToCategory(kind);
    if (cat === 'offline') return;
    if (!ds._events[cat]) ds._events[cat] = [];
    const maxN = (this.OFFLINE_CONFIG && this.OFFLINE_CONFIG.maxDetailLogs) || 100;
    const now = (typeof nowMs === 'function') ? nowMs() : Date.now();
    const d = data || {};
    const ev = {
      timestamp: now,
      action: String(kind),
      gardenIndex: gi != null ? gi : undefined
    };
    ['plots', 'qty', 'yield', 'actions', 'cycles', 'name', 'cost', 'coins', 'streak',
      'level', 'xp', 'star', 'myth', 'count', 'ms', 'itemId', 'seedId', 'recipeId', 'plotId', 'text'].forEach(k => {
      if (d[k] != null) ev[k] = d[k];
    });
    if (d.replant) ev.replant = true;
    ds._events[cat].push(ev);
    if (ds._events[cat].length > maxN) {
      ds._events[cat] = ds._events[cat].slice(-maxN);
    }
  },

  /**
   * Legacy: rebuild summary activityLogs từ dayStats (giữ offline).
   * UI chính dùng gameEvents; summary chỉ phụ.
   */
  syncActivityLogsFromDayStats() {
    if (!currentPlayer) return;
    const ds = this.ensureDayStats();
    if (!ds) return;
    const dayKey = ds.dayKey;
    const logs = this.ensureActivityLogs();
    const now = (typeof nowMs === 'function') ? nowMs() : Date.now();

    // Chỉ giữ offline + log ngày khác; không rebuild summary online (đã chuyển sang gameEvents)
    const keep = logs.filter(l => {
      if (!l) return false;
      if (l.type === 'offline') return true;
      if (l.dayKey && l.dayKey !== dayKey) return true;
      if (l._isEvent) return true; // individual event mirrored
      return false;
    });
    currentPlayer.activityLogs = keep.slice(0, 120);
  },

  /**
   * Tạo 1 log Offline duy nhất + timeline events nếu engine có.
   */
  addOfflineLog(report) {
    if (!currentPlayer || !report) return null;
    const logs = this.ensureActivityLogs();
    const now = Number(report.to) || ((typeof nowMs === 'function') ? nowMs() : Date.now());
    const startedAt = Number(report.from) || (now - (Number(report.offlineMs) || 0));
    const offlineMs = Math.max(0, Number(report.offlineMs) || (now - startedAt) || 0);
    const dayKey = this._dayKey(now);
    const duration = this.formatOfflineDuration(offlineMs);
    const durationSeconds = Math.round(offlineMs / 1000);
    const sessionId = 'offline_' + startedAt.toString(36) + '_' + Math.random().toString(36).slice(2, 6);

    const garden = {
      harvested: report.uniquePlotsHarvested || report.totalHarvest || 0,
      replanted: report.totalPlant || 0,
      product: report.totalYieldAmount || report.totalHarvest || 0
    };
    const nyc = {
      gardens: report.nycGardens || 0,
      cells: report.nycPlots || report.totalPlant || 0
    };
    const robot = {
      seedsBought: report.robotSeedsBought || 0,
      cooked: report.robotCooked || 0,
      starMerged: report.robotStar || 0,
      mythicMerged: report.robotMyth || 0
    };
    const fairy = {
      watered: report.rainWatered || report.fairyCycles || 0,
      rainSeeds: report.fairyRainSeeds || 0
    };
    const xp = report.xpGained || 0;

    const sumParts = [duration];
    if (garden.product) sumParts.push('+' + garden.product + ' SP');
    if (xp) sumParts.push('+' + Number(xp).toLocaleString() + ' XP');
    if (nyc.gardens) sumParts.push('NYC ' + nyc.gardens + ' vườn');
    const robotJobs = (robot.seedsBought || 0) + (robot.cooked || 0) + (robot.starMerged || 0) + (robot.mythicMerged || 0);
    if (robotJobs) sumParts.push('Robot ' + robotJobs + ' việc');
    if (fairy.watered) sumParts.push('Tiên ' + fairy.watered + ' ô');

    // Timeline từ report nếu engine cung cấp (không bịa)
    const timeline = Array.isArray(report.timeline) ? report.timeline.slice() : [];
    if (Array.isArray(report.events)) {
      report.events.forEach(e => timeline.push(e));
    }

    const entry = {
      id: this._logId(),
      type: 'offline',
      dayKey,
      timestamp: now,
      firstAt: startedAt,
      offlineSessionId: sessionId,
      offline: {
        startedAt,
        endedAt: now,
        durationSeconds,
        durationMs: offlineMs
      },
      summary: {
        title: 'Offline',
        duration,
        text: sumParts.join(' · ')
      },
      detail: {
        durationSeconds,
        durationText: duration,
        offlineMs,
        startedAt,
        endedAt: now,
        startedClock: this.formatLogClock(startedAt),
        endedClock: this.formatLogClock(now),
        garden,
        nyc,
        robot,
        fairy,
        xp,
        rainHits: report.rainHits || 0,
        helperBuys: report.helperBuys || 0,
        timeline: timeline.slice(0, 200),
        eventSource: timeline.length ? 'offline_simulation' : 'offline_calculation'
      }
    };

    logs.unshift(entry);
    if (logs.length > 120) currentPlayer.activityLogs = logs.slice(0, 120);

    // Ghi event offline_end vào gameEvents
    this.pushGameEvent({
      id: entry.id + '_end',
      action: 'offline_end',
      actor: 'offline',
      category: 'offline',
      mode: 'offline',
      eventSource: entry.detail.eventSource,
      offlineSessionId: sessionId,
      timestamp: now,
      summaryText: '⚡ Offline kết thúc · ' + duration,
      detail: entry.detail,
      result: {
        sp: garden.product || 0,
        xp: xp || 0
      }
    });

    // Đưa các timeline event (nếu có timestamp thật) vào gameEvents
    timeline.forEach(te => {
      if (!te || te.timestamp == null) return;
      this.pushGameEvent({
        action: te.action || te.type || 'offline_event',
        actor: te.actor || 'offline',
        category: te.category || this._mapKindToCategory(te.action || te.type),
        mode: 'offline',
        eventSource: te.eventSource || 'offline_simulation',
        offlineSessionId: sessionId,
        timestamp: Number(te.timestamp),
        target: te.target || (te.name ? { name: te.name, id: te.plantId || null } : null),
        quantity: te.quantity != null ? te.quantity : te.qty,
        cellId: te.cellId != null ? te.cellId : te.plotId,
        gardenIndex: te.gardenIndex,
        detail: te.detail || te,
        summaryText: te.summaryText || te.text || null
      });
    });

    return entry;
  },

  /** Danh sách log để render — ƯU TIÊN từng event riêng */
  getActivityLogList() {
    this.ensureActivityLogs();
    this.ensureGameEvents();
    const now = (typeof nowMs === 'function') ? nowMs() : Date.now();
    const dayKey = this._dayKey();
    const KEEP_MS = 7 * 24 * 3600 * 1000;
    const DAY_MS = 36 * 3600 * 1000; // ~1.5 ngày cho online events

    const events = (currentPlayer.gameEvents || []).filter(e => {
      if (!e || !e.timestamp) return false;
      const age = now - e.timestamp;
      if (e.mode === 'offline' || e.category === 'offline') return age < KEEP_MS;
      return age < DAY_MS || e.dayKey === dayKey;
    });

    // Offline session summaries (để detail offline đầy đủ)
    const offlineLogs = (currentPlayer.activityLogs || []).filter(l => {
      if (!l || l.type !== 'offline') return false;
      const ts = l.timestamp || (l.offline && l.offline.endedAt) || 0;
      return ts && (now - ts) < KEEP_MS;
    });

    // Map events → list items (luôn có filter key)
    const list = events.map(e => {
      const text = this.formatEventSummaryText(e);
      const filter = e.filter || this.resolveFilterKey(e.action, e.actor, text, e.category, e.mode);
      return {
        id: e.id,
        type: e.category || e.action || 'system',
        action: e.action,
        actor: e.actor,
        mode: e.mode || 'online',
        filter: filter,
        filterKey: filter,
        title: e.action || e.category,
        text: text,
        timestamp: e.timestamp,
        firstAt: e.timestamp,
        timeText: this.formatLogClock(e.timestamp),
        hasDetail: true,
        _isEvent: true,
        _event: e
      };
    });

    // Thêm offline summary nếu chưa có event offline_end tương ứng
    offlineLogs.forEach(l => {
      const has = list.some(x => x.id === l.id || x.id === (l.id + '_end'));
      if (!has) {
        const sum = l.summary || {};
        list.push({
          id: l.id,
          type: 'offline',
          action: 'offline',
          actor: 'offline',
          mode: 'offline',
          title: sum.title || 'Offline',
          text: sum.text || '',
          timestamp: l.timestamp || (l.offline && l.offline.endedAt) || 0,
          firstAt: l.firstAt || (l.offline && l.offline.startedAt) || 0,
          timeText: this.formatLogClock(l.timestamp || (l.offline && l.offline.endedAt)),
          hasDetail: true,
          _isOfflineSummary: true
        });
      }
    });

    list.sort((a, b) => {
      const dt = (b.timestamp || 0) - (a.timestamp || 0);
      if (dt !== 0) return dt;
      return 0;
    });
    return list.slice(0, 300);
  },

  getActivityLogById(id) {
    if (!id) return null;
    // Ưu tiên gameEvents
    const events = this.ensureGameEvents();
    const ev = events.find(e => e && e.id === id);
    if (ev) {
      return {
        id: ev.id,
        type: ev.category || ev.action,
        action: ev.action,
        actor: ev.actor,
        mode: ev.mode,
        timestamp: ev.timestamp,
        firstAt: ev.timestamp,
        summary: {
          title: this._eventDetailTitle(ev),
          text: this.formatEventSummaryText(ev)
        },
        detail: this._buildEventDetail(ev),
        _event: ev,
        _isEvent: true
      };
    }
    const logs = this.ensureActivityLogs();
    return logs.find(l => l && l.id === id) || null;
  },

  _eventDetailTitle(ev) {
    if (!ev) return 'Chi tiết';
    const map = {
      plant: '🌱 Trồng cây',
      replant: '🌱 Trồng lại',
      water: '💧 Tưới nước',
      fert: '🧪 Bón phân',
      harvest: '🌱 Thu hoạch',
      crop_ready: '🌱 Cây chín',
      remove: '🌱 Nhổ cây',
      buy: '🛒 Mua',
      buy_seed: '🛒 Mua hạt',
      robot_seed: '🤖 Robot mua hạt',
      cook: '🤖 Robot nấu',
      robot_cook: '🤖 Robot nấu',
      merge: '🤖 Robot ghép',
      robot_merge: '🤖 Robot ghép',
      level_up: '⬆️ Lên cấp',
      levelup: '⬆️ Lên cấp',
      xp: '⭐ XP',
      reward: '🎁 Thưởng',
      daily: '🎁 Thưởng ngày',
      rain: '🌧️ Mưa',
      offline_end: '⚡ Offline',
      offline: '⚡ Offline',
      fairy_water: '🧚 Tiên tưới',
      fairy_rain_seed: '🧚 Tiên nhặt hạt',
      nyc_harvest: '❤️ NYC thu hoạch',
      nyc_plant: '❤️ NYC trồng',
      helper_buy: '🧹 Giúp việc'
    };
    return map[ev.action] || (ev.actor === 'robot' ? '🤖 Robot' : (ev.summaryText || ev.action || 'Chi tiết'));
  },

  _buildEventDetail(ev) {
    if (!ev) return {};
    const d = Object.assign({}, ev.detail || {});
    d.action = ev.action;
    d.actor = ev.actor;
    d.category = ev.category;
    d.mode = ev.mode;
    d.eventSource = ev.eventSource;
    d.timestamp = ev.timestamp;
    d.timeText = this.formatLogClock(ev.timestamp);
    d.target = ev.target;
    d.quantity = ev.quantity;
    d.result = ev.result;
    d.cellId = ev.cellId;
    d.gardenIndex = ev.gardenIndex;
    d.cost = ev.cost;
    d.coins = ev.coins;
    d.xp = ev.xp;
    d.sp = ev.sp;
    d.name = (ev.target && ev.target.name) || ev.name;
    d.plantId = ev.plantId || (ev.target && ev.target.id);
    d.ingredients = ev.ingredients;
    d.plantedAt = ev.plantedAt;
    d.readyAt = ev.readyAt;
    d.before = ev.before;
    d.after = ev.after;
    d.offlineSessionId = ev.offlineSessionId;
    d.parentEventId = ev.parentEventId;
    if (ev.cellId != null) d.plotLabel = '#' + (Number(ev.cellId) + 1);
    if (ev.plantedAt) d.plantedClock = this.formatLogClock(ev.plantedAt);
    if (ev.readyAt) d.readyClock = this.formatLogClock(ev.readyAt);
    return d;
  },

  /** Tương thích UI — trả từng dòng event */
  buildDayLogLines() {
    return this.getActivityLogList();
  },

  /**
   * addActivity — tương thích string cũ + object event mới.
   * Object structured → pushGameEvent.
   * String: chỉ refresh UI (thống kê qua trackDayStat nếu caller đã gọi).
   */
  addActivity(textOrEvent, meta) {
    try {
      if (textOrEvent && typeof textOrEvent === 'object' && !Array.isArray(textOrEvent)) {
        const ev = textOrEvent;
        // Nếu đã là event chuẩn
        if (ev.action || ev.category || (ev.target && ev.timestamp)) {
          this.pushGameEvent(ev);
        } else {
          const type = ev.type || (meta && meta.type) || 'system';
          const kind = ev.action || type;
          const data = Object.assign({}, ev.detail || {}, ev.data || {});
          this.trackDayStat(kind, data);
        }
      } else if (typeof textOrEvent === 'string') {
        // String path: tạo event tối thiểu nếu meta có type
        const type = (meta && meta.type) || 'system';
        const at = (meta && meta.at) || ((typeof nowMs === 'function') ? nowMs() : Date.now());
        // Chỉ push nếu chưa có event gần giống trong 100ms
        const list = this.ensureGameEvents();
        const recent = list[0];
        if (!(recent && recent.summaryText === textOrEvent && Math.abs((recent.timestamp || 0) - at) < 150)) {
          this.pushGameEvent({
            action: type,
            actor: (type && String(type).startsWith('robot')) ? 'robot'
              : (type && String(type).startsWith('fairy')) ? 'fairy'
              : (type && String(type).startsWith('nyc')) ? 'nyc'
              : (type === 'harvest_offline' ? 'offline' : 'player'),
            category: this._mapKindToCategory(type),
            mode: type === 'harvest_offline' ? 'offline' : 'online',
            eventSource: type === 'harvest_offline' ? 'offline_simulation' : 'live',
            summaryText: textOrEvent,
            text: textOrEvent,
            timestamp: at,
            gardenIndex: meta && meta.plotGarden,
            detail: meta || {}
          });
        }
      }
    } catch (e) {
      console.warn('addActivity', e);
    }
    if (typeof renderActivityPage === 'function') {
      try {
        const page = document.getElementById('page-activity');
        if (page && page.classList.contains('active')) renderActivityPage();
      } catch (_) {}
    }
  },

  logOfflineReport(report) {
    if (!report || !currentPlayer) return null;
    try {
      return this.addOfflineLog(report);
    } catch (e) {
      console.warn('logOfflineReport', e);
      return null;
    }
  },


  totalFertilizerCount() {
    if (!currentPlayer || !currentPlayer.inventory.fertilizers) return 0;
    return Object.values(currentPlayer.inventory.fertilizers).reduce((a, b) => a + (b || 0), 0);
  },

  async buyPlot(qty = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    this.ensureGardens();
    const max = this.MAX_PLOTS_PER_GARDEN;
    const have = currentPlayer.plots.length;
    const room = max - have;
    if (room <= 0) {
      return { ok: false, msg: 'Vườn này đã đủ ' + max + ' ô! Hãy chuyển sang vườn tiếp theo.' };
    }
    qty = Math.max(1, Math.min(20, parseInt(qty, 10) || 1));
    qty = Math.min(qty, room);
    const price = (currentSettings && currentSettings.plotPrice) || 500;
    const cost = price * qty;
    if (!this.chargeCoins(cost)) return { ok: false, msg: 'Không đủ tiền! Cần ' + cost + '🪙' };
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
    const start = currentPlayer.plots.length;
    for (let i = 0; i < qty; i++) {
      currentPlayer.plots.push({
        id: start + i,
        plantId: null,
        plantedAt: null,
        watered: false,
        waterCount: 0,
        lastWatered: null,
        fertilizerId: null
      });
    }
    this.syncActiveGarden();
    const unlockedBefore = currentPlayer.gardens.length;
    this.refreshGardenUnlocks();
    const gName = 'Vườn ' + ((currentPlayer.activeGarden || 0) + 1);
    let msg = `Đã mua ${qty} ô đất trên ${gName}! (${currentPlayer.plots.length}/${max} ô)`;
    if (currentPlayer.gardens.length > unlockedBefore) {
      msg += ` · Mở khóa Vườn ${currentPlayer.gardens.length}!`;
    }
    this.addActivity(msg + ` (-${cost}🪙)`);
    await savePlayer();
    return { ok: true, msg };
  },


  


  async buyCompanion(id) {
    const item = this.getCompanion(id);
    if (!item) return { ok: false, msg: 'Không tìm thấy thú cưng!' };
    if (!currentPlayer.companions) currentPlayer.companions = {};
    if (currentPlayer.companions[id]) return { ok: false, msg: 'Đã sở hữu!' };
    const price = Number(item.price) || 0;
    if (!this.chargeCoins(price)) return { ok: false, msg: 'Không đủ xu!' };
    currentPlayer.companions[id] = { id, boughtAt: (typeof nowMs === 'function' ? nowMs() : Date.now()) };
    if (!currentPlayer.companionId) currentPlayer.companionId = id;
    this.addActivity(this.isUnlimitedResources()
      ? 'Mua thú cưng ' + item.name + ' (unlimited)'
      : 'Mua thú cưng ' + item.name + ' (-' + price + '🪙)');
    return { ok: true, msg: 'Đã mua ' + item.name + '!' };
  },
  equipCompanion(id) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập' };
    if (!id || id === 'none') { currentPlayer.companionId = null; return { ok: true, msg: 'Đã gỡ thú cưng' }; }
    if (!currentPlayer.companions || !currentPlayer.companions[id]) return { ok: false, msg: 'Chưa sở hữu!' };
    currentPlayer.companionId = id;
    const c = this.getCompanion(id);
    return { ok: true, msg: 'Đã gắn ' + ((c && c.name) || id) };
  },

  async buyAvatarBadge(id) {
    const item = this.getAvatarBadge(id);
    if (!item) return { ok: false, msg: 'Không tìm thấy icon badge!' };
    if (!currentPlayer.avatarBadges) currentPlayer.avatarBadges = {};
    const bid = item.id || id;
    if (currentPlayer.avatarBadges[bid]) return { ok: false, msg: 'Đã sở hữu!' };
    const price = Number(item.price) || 400;
    if (!this.chargeCoins(price)) return { ok: false, msg: 'Không đủ xu!' };
    currentPlayer.avatarBadges[bid] = {
      id: bid,
      fa: item.fa || ('fa-regular fa-' + (item.slug || bid)),
      slug: item.slug || null,
      boughtAt: (typeof nowMs === 'function' ? nowMs() : Date.now())
    };
    if (!currentPlayer.avatarBadgeId) currentPlayer.avatarBadgeId = bid;
    this.addActivity('Mua badge icon ' + item.name + (this.isUnlimitedResources() ? ' (unlimited)' : ' (-' + price + '🪙)'));
    return { ok: true, msg: 'Đã mua ' + item.name + '!' };
  },
  equipAvatarBadge(id) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập' };
    if (!id || id === 'none') {
      currentPlayer.avatarBadgeId = null;
      return { ok: true, msg: 'Đã gỡ badge icon' };
    }
    if (!currentPlayer.avatarBadges || !currentPlayer.avatarBadges[id]) return { ok: false, msg: 'Chưa sở hữu!' };
    currentPlayer.avatarBadgeId = id;
    const b = this.getAvatarBadge(id);
    return { ok: true, msg: 'Đã gắn ' + ((b && b.name) || id) };
  },

  async buyAvatarFrame(frameId) {
    const frame = this.getAvatarFrame(frameId);
    if (!frame) return { ok: false, msg: 'Không tìm thấy khung!' };
    if (!currentPlayer.avatarFrames) currentPlayer.avatarFrames = {};
    if (currentPlayer.avatarFrames[frameId]) return { ok: false, msg: 'Bạn đã sở hữu khung này!' };
    const price = Number(frame.price) || 0;
    if (!this.chargeCoins(price)) return { ok: false, msg: 'Không đủ xu!' };
    currentPlayer.avatarFrames[frameId] = { id: frameId, boughtAt: (typeof nowMs === 'function' ? nowMs() : Date.now()) };
    if (!currentPlayer.avatarFrameId) currentPlayer.avatarFrameId = frameId;
    this.addActivity(this.isUnlimitedResources()
      ? 'Mua khung avatar ' + frame.name + ' (unlimited)'
      : 'Mua khung avatar ' + frame.name + ' (-' + price + '🪙)');
    return { ok: true, msg: 'Đã mua khung ' + frame.name + '!' };
  },

  equipAvatarFrame(frameId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập' };
    if (frameId === '' || frameId === 'none' || frameId == null) {
      currentPlayer.avatarFrameId = null;
      return { ok: true, msg: 'Đã gỡ khung avatar' };
    }
    if (!currentPlayer.avatarFrames || !currentPlayer.avatarFrames[frameId]) {
      return { ok: false, msg: 'Bạn chưa sở hữu khung này!' };
    }
    const frame = this.getAvatarFrame(frameId);
    currentPlayer.avatarFrameId = frameId;
    return { ok: true, msg: 'Đã gắn khung ' + ((frame && frame.name) || frameId) };
  },

  async buyPet(petId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const pet = this.getPet(petId);
    if (!pet) return { ok: false, msg: 'Không tìm thấy pet!' };
    if (!currentPlayer.pets) currentPlayer.pets = {};
    if (currentPlayer.pets[petId]) return { ok: false, msg: 'Bạn đã sở hữu pet này!' };
    if (!this.chargeCoins(pet.price)) return { ok: false, msg: 'Không đủ xu!' };
    currentPlayer.pets[petId] = { id: petId, boughtAt: (typeof nowMs==="function"?nowMs():Date.now()), active: true };
    this.addActivity(this.isUnlimitedResources()
      ? `Nhận pet ${pet.name} (unlimited)`
      : `Nhận pet ${pet.name} (-${pet.price}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Đã mua ${pet.icon} ${pet.name}!` };
  },

  togglePet(petId, active) {
    if (!currentPlayer || !currentPlayer.pets || !currentPlayer.pets[petId]) return { ok: false, msg: 'Chưa có pet!' };
    currentPlayer.pets[petId].active = !!active;
    return { ok: true };
  },

  
  tryPetCoinDrop() {
    if (!currentPlayer || !currentPlayer.pets) return null;
    const active = Object.keys(currentPlayer.pets).filter(id => currentPlayer.pets[id] && currentPlayer.pets[id].active !== false);
    if (!active.length) return null;
    const id = active[Math.floor(Math.random() * active.length)];
    const pet = this.getPet(id);
    if (!pet) return null;
    if (Math.random() > (pet.coinChance || 0.008)) return null;
    const min = pet.coinMin || 1, max = pet.coinMax || 3;
    const coins = min + Math.floor(Math.random() * (max - min + 1));
    currentPlayer.coins = (currentPlayer.coins || 0) + coins;
    currentPlayer.stats.earned = (currentPlayer.stats.earned || 0) + coins;
    return { pet, coins };
  },

  
  async cookRecipe(recipeId, times = 1, tier = 'normal') {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const recipe = this.getRecipe(recipeId);
    if (!recipe) return { ok: false, msg: 'Không có công thức!' };
    times = Math.max(1, Math.min(99, Math.floor(Number(times) || 1)));
    tier = (tier === 'myth' || tier === 'star') ? tier : 'normal';
    this.normalizeHarvestBags();
    const inv = currentPlayer.inventory || (currentPlayer.inventory = {});
    const bagKey = this.harvestBagKey(tier);
    const dishKey = this.dishBagKey(tier);
    const harvest = inv[bagKey] || (inv[bagKey] = {});
    const tag = tier === 'myth' ? '✨' : (tier === 'star' ? '⭐' : '');

    for (const ing of recipe.ingredients) {
      const have = harvest[ing.plantId] || 0;
      const need = (ing.qty || 1) * times;
      if (have < need) {
        const pl = this.getPlant(ing.plantId);
        return { ok: false, msg: `Thiếu ${pl ? pl.name : ing.plantId}${tag} (cần ${need}, có ${have})` };
      }
    }
    for (const ing of recipe.ingredients) {
      const need = (ing.qty || 1) * times;
      harvest[ing.plantId] = (harvest[ing.plantId] || 0) - need;
      if (harvest[ing.plantId] <= 0) delete harvest[ing.plantId];
    }
    if (!inv[dishKey]) inv[dishKey] = {};
    inv[dishKey][recipe.id] = (inv[dishKey][recipe.id] || 0) + times;
    const xpBase = (recipe.xp || 1) * times;
    const xpGain = Math.ceil(xpBase * this.getSeedXpMult(tier));
    currentPlayer.xp = (currentPlayer.xp || 0) + xpGain;
    const sellHint = this.getDishSellPrice(recipe, tier);
    this.addActivity(`Nấu ${times}× ${recipe.name}${tag}`);
    await savePlayer();
    return {
      ok: true,
      msg: `Đã nấu ${times}× ${recipe.icon || ''} ${recipe.name}${tag}! +${xpGain} XP · bán ${sellHint.toLocaleString()}🪙/món`,
      tier
    };
  },

  async sellDish(recipeId, qty = 1, tier = 'normal') {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const recipe = this.getRecipe(recipeId);
    if (!recipe) return { ok: false, msg: 'Không có món!' };
    tier = (tier === 'myth' || tier === 'star') ? tier : 'normal';
    this.normalizeHarvestBags();
    const dishKey = this.dishBagKey(tier);
    const bag = (currentPlayer.inventory && currentPlayer.inventory[dishKey]) || {};
    if (qty === 'all' || qty === -1) {
      qty = bag[recipeId] || 0;
    } else {
      qty = Math.max(0, Math.floor(Number(qty) || 0));
    }
    const have = bag[recipeId] || 0;
    if (qty < 1 || have < qty) return { ok: false, msg: 'Không đủ món để bán!' };
    const unit = this.getDishSellPrice(recipe, tier);
    const gain = unit * qty;
    currentPlayer.inventory[dishKey][recipeId] = have - qty;
    if (currentPlayer.inventory[dishKey][recipeId] <= 0) delete currentPlayer.inventory[dishKey][recipeId];
    currentPlayer.coins = (currentPlayer.coins || 0) + gain;
    currentPlayer.stats.earned = (currentPlayer.stats.earned || 0) + gain;
    const tag = tier === 'myth' ? '✨' : (tier === 'star' ? '⭐' : '');
    this.addActivity(`Bán ${qty}× ${recipe.name}${tag} (+${gain}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Đã bán ${qty}× ${recipe.name}${tag} (+${gain.toLocaleString()}🪙)` };
  },

  async updateLeaderboard() {
    if (!currentUser || !currentPlayer) return;
    try {
      await db.ref('leaderboard/' + currentUser.uid).set({
        uid: currentUser.uid,
        name: currentPlayer.displayName || (currentPlayer.email || currentUser.email || 'Player').split('@')[0],
        avatar: currentPlayer.avatar || '',
        coins: currentPlayer.coins || 0,
        planted: (currentPlayer.stats && currentPlayer.stats.planted) || 0,
        harvested: (currentPlayer.stats && currentPlayer.stats.harvested) || 0,
        level: currentPlayer.level || 1,
        collection: this.collectionCount(),
        updatedAt: (typeof nowMs==="function"?nowMs():Date.now())
      });
    } catch (e) { console.warn('leaderboard', e); }
  }
};
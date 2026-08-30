const Game = {
  now() { return (typeof nowMs === "function") ? nowMs() : Date.now(); },

  raining: false,
  rainUntil: 0,
  rainBoostPlots: {},

  getPlayer() { return currentPlayer; },
  getPlants() { return currentPlants; },
  getPlant(id) { return currentPlants.find(p => p.id === id); },
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
    if (currentPlayer.gardens && !Array.isArray(currentPlayer.gardens) && typeof currentPlayer.gardens === 'object') {
      const keys = Object.keys(currentPlayer.gardens).sort((a, b) => Number(a) - Number(b));
      currentPlayer.gardens = keys.map(k => currentPlayer.gardens[k]);
    }
    if (!Array.isArray(currentPlayer.gardens) || !currentPlayer.gardens.length) {
      let plots = currentPlayer.plots;
      if (!Array.isArray(plots)) plots = Object.values(plots || {});
      if (!plots.length) plots = this.makeEmptyPlots();
      plots = plots.map((p, i) => ({ ...(p || {}), id: (p && typeof p.id === 'number') ? p.id : i }));
      currentPlayer.gardens = [plots];
    } else {
      currentPlayer.gardens = currentPlayer.gardens.map((g, gi) => {
        let plots;
        if (Array.isArray(g)) plots = g;
        else if (g && Array.isArray(g.plots)) plots = g.plots;
        else if (g && typeof g === 'object') {
          const keys = Object.keys(g).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
          plots = keys.length ? keys.map(k => g[k]) : [];
        } else plots = [];
        if (!plots.length) plots = this.makeEmptyPlots();
        return plots.map((p, i) => ({ ...(p || {}), id: i }));
      });
    }
    if (typeof currentPlayer.activeGarden !== 'number' || currentPlayer.activeGarden < 0) {
      currentPlayer.activeGarden = 0;
    }
    if (currentPlayer.activeGarden >= currentPlayer.gardens.length) {
      currentPlayer.activeGarden = 0;
    }
    this.refreshGardenUnlocks();
    currentPlayer.plots = currentPlayer.gardens[currentPlayer.activeGarden];
  },

  refreshGardenUnlocks() {
    if (!currentPlayer || !Array.isArray(currentPlayer.gardens)) return;
    const max = this.MAX_PLOTS_PER_GARDEN;
    let guard = 0;
    while (guard++ < 30) {
      const last = currentPlayer.gardens[currentPlayer.gardens.length - 1];
      if (last && last.length >= max) {
        currentPlayer.gardens.push(this.makeEmptyPlots());
      } else break;
    }
  },

  syncActiveGarden() {
    if (!currentPlayer || !Array.isArray(currentPlayer.gardens)) return;
    const i = currentPlayer.activeGarden || 0;
    if (currentPlayer.gardens[i]) currentPlayer.gardens[i] = currentPlayer.plots;
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
    this.syncActiveGarden();
    index = parseInt(index, 10);
    if (isNaN(index) || index < 0 || index >= currentPlayer.gardens.length) {
      return { ok: false, msg: 'Vườn chưa mở khóa! Cần đủ 99 ô ở vườn trước.' };
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

  fairyRemainingSec() {
    if (!this.hasFairy()) return 0;
    return Math.max(0, Math.ceil((currentPlayer.fairyUntil - (typeof nowMs==="function"?nowMs():Date.now())) / 1000));
  },

  hasNyc() {
    return !!(currentPlayer && currentPlayer.nycUntil && currentPlayer.nycUntil > (typeof nowMs==="function"?nowMs():Date.now()));
  },

  isNycActive() {
    return this.hasNyc() && this.getBuffPrefs().nycEnabled;
  },

  isNycActiveAt(t) {
    if (!currentPlayer || !this.getBuffPrefs().nycEnabled) return false;
    const until = Number(currentPlayer.nycUntil) || 0;
    return until > (Number(t) || 0);
  },

  isFairyActiveAt(t) {
    if (!currentPlayer || !this.getBuffPrefs().fairyEnabled) return false;
    const until = Number(currentPlayer.fairyUntil) || 0;
    return until > (Number(t) || 0);
  },

  nycRemainingSec() {
    if (!this.hasNyc()) return 0;
    return Math.max(0, Math.ceil((currentPlayer.nycUntil - (typeof nowMs==="function"?nowMs():Date.now())) / 1000));
  },

  getBuffPrefs() {
    const def = { fairyEnabled: true, nycEnabled: true, helperEnabled: true, fairyVisual: true, nycVisual: true, helperVisual: true };
    if (!currentPlayer) return { ...def };
    if (!currentPlayer.buffPrefs || typeof currentPlayer.buffPrefs !== 'object') {
      currentPlayer.buffPrefs = { ...def };
    }
    const p = currentPlayer.buffPrefs;
    if (typeof p.fairyEnabled !== 'boolean') p.fairyEnabled = true;
    if (typeof p.nycEnabled !== 'boolean') p.nycEnabled = true;
    if (typeof p.helperEnabled !== 'boolean') p.helperEnabled = true;
    if (typeof p.fairyVisual !== 'boolean') p.fairyVisual = true;
    if (typeof p.nycVisual !== 'boolean') p.nycVisual = true;
    if (typeof p.helperVisual !== 'boolean') p.helperVisual = true;
    return p;
  },

  setBuffPrefs(prefs) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const cur = this.getBuffPrefs();
    currentPlayer.buffPrefs = {
      fairyEnabled: prefs && typeof prefs.fairyEnabled === 'boolean' ? prefs.fairyEnabled : cur.fairyEnabled,
      nycEnabled: prefs && typeof prefs.nycEnabled === 'boolean' ? prefs.nycEnabled : cur.nycEnabled,
      fairyVisual: prefs && typeof prefs.fairyVisual === 'boolean' ? prefs.fairyVisual : cur.fairyVisual,
      nycVisual: prefs && typeof prefs.nycVisual === 'boolean' ? prefs.nycVisual : cur.nycVisual
    };
    const a = [];
    a.push('Tiên hình:' + (currentPlayer.buffPrefs.fairyVisual ? 'bật' : 'tắt') + '/buff:' + (currentPlayer.buffPrefs.fairyEnabled ? 'bật' : 'tắt'));
    a.push('NYC hình:' + (currentPlayer.buffPrefs.nycVisual ? 'bật' : 'tắt') + '/buff:' + (currentPlayer.buffPrefs.nycEnabled ? 'bật' : 'tắt'));
    return { ok: true, msg: 'Đã lưu: ' + a.join(' · ') };
  },

  getNycConfig() {
    const def = { plantId: null, seedKind: 'normal', mode: 'all', count: 1, gardensEnabled: {}, byGarden: {}, customName: '', gender: 'female' };
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
    return currentPlayer.nycConfig;
  },

  getNycConfigForGarden(gardenIndex) {
    const base = this.getNycConfig();
    const key = String(gardenIndex);
    const ov = (base.byGarden && (base.byGarden[key] || base.byGarden[gardenIndex])) || null;
    if (!ov || typeof ov !== 'object') return { ...base, _gardenIndex: gardenIndex };
    return {
      ...base,
      plantId: ov.plantId !== undefined ? ov.plantId : base.plantId,
      seedKind: ov.seedKind === 'star' ? 'star' : (ov.seedKind === 'normal' ? 'normal' : base.seedKind),
      mode: ov.mode === 'count' ? 'count' : (ov.mode === 'all' ? 'all' : base.mode),
      count: typeof ov.count === 'number' ? ov.count : base.count,
      _gardenIndex: gardenIndex
    };
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
    const slice = {
      plantId: (cfg && cfg.plantId) || null,
      seedKind: cfg && cfg.seedKind === 'star' ? 'star' : 'normal',
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
    return { ok: true, msg: 'Đã lưu NYC · ' + label + (slice.plantId || 'chưa chọn hạt') };
  },

  getPlotSpeedMult(plot) {
    if (!plot) return 1;
    const now = (typeof nowMs==="function"?nowMs():Date.now());
    let perm = Number(plot.specialMultPermanent) || 0;
    if (!perm && plot.specialMult > 1 && !plot.specialMultUntil) {
      perm = Number(plot.specialMult) || 1;
    }
    if (!perm) perm = 1;
    let temp = 1;
    if (plot.specialMultUntil && now < plot.specialMultUntil) {
      temp = Number(plot.specialMultTemp || plot.specialMult) || 1;
    }
    return Math.max(perm, temp, 1);
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

  tryTriggerRain() {
    if (this.raining && (typeof nowMs==="function"?nowMs():Date.now()) < this.rainUntil) return false;
    let chance = (currentSettings && currentSettings.rainChance) != null
      ? Number(currentSettings.rainChance)
      : 15;
    if (!Number.isFinite(chance)) chance = 15;
    chance = Math.max(1, Math.min(50, chance));
    if (Math.random() * 100 < chance) {
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
    this.rainCollectCount = 0;
    let wateredN = 0;
    const fairyOn = this.isFairyActive();
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
      this.addActivity(
        fairyOn
          ? `🌧️ Mưa · ${fairyEmoji} ${fairyName} tưới khi mưa: ${wateredN} ô`
          : `🌧️ Mưa bắt đầu (${Math.round(durationMs / 1000)}s)`,
        { type: fairyOn ? 'fairy_rain' : 'rain', at: now }
      );
      if (fairyOn && wateredN > 0 && typeof Features !== 'undefined' && Features.trackQuest) {
        try { Features.trackQuest('water', wateredN * 3); } catch (_) {}
      }
      if (typeof savePlayer === 'function') savePlayer();
      if (typeof renderGarden === 'function') {
        try { renderGarden(); } catch (_) {}
      }
      if (typeof renderActivityPage === 'function') {
        try { renderActivityPage(); } catch (_) {}
      }
    }
    if (typeof showRainEffect === 'function') showRainEffect();
    const tip = fairyOn
      ? `🌧️ Mưa + ${fairyEmoji} ${fairyName} tưới ${wateredN} ô!`
      : '🌧️ Mưa rồi! Chạm sâu / hạt rơi để nhặt thưởng!';
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

  getEffectiveGrowTime(plot) {
    const plant = this.getPlant(plot.plantId);
    if (!plant) return 9999;
    let t = plant.growTime || 300;

    const waterBonus = Math.min(plot.waterCount || 0, 3) * 0.12;
    t *= (1 - waterBonus);

    if (plot.fertilizerId) {
      const fert = this.getFertilizer(plot.fertilizerId);
      if (fert) t *= (1 - (fert.timeReduce || 0));
    }

    const weather = this.getWeather();
    t /= weather.mult;

    const sm = this.getPlotSpeedMult(plot);
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
    return ((typeof nowMs==="function"?nowMs():Date.now()) - plot.plantedAt) / 1000;
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
    return this.getElapsedEffective(plot) >= this.getEffectiveGrowTime(plot);
  },

  xpForLevel(level) { return level * 50; },

  addXp(amount) {
    if (!currentPlayer) return;
    const MAX_LV = 10000;
    if ((currentPlayer.level || 1) >= MAX_LV) {
      currentPlayer.level = MAX_LV;
      return;
    }
    currentPlayer.xp = (currentPlayer.xp || 0) + amount;
    while (currentPlayer.xp >= this.xpForLevel(currentPlayer.level || 1) && (currentPlayer.level || 1) < MAX_LV) {
      currentPlayer.xp -= this.xpForLevel(currentPlayer.level || 1);
      currentPlayer.level = (currentPlayer.level || 1) + 1;
      currentPlayer.coins += 100 * currentPlayer.level;
      this.addActivity(`Lên cấp ${currentPlayer.level}! +${100 * currentPlayer.level}🪙`);
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

  async buySeed(plantId, qty = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plant = this.getPlant(plantId);
    if (!plant) return { ok: false, msg: 'Không tìm thấy cây!' };
    if (!this.isPlantAvailable(plant)) {
      return { ok: false, msg: 'Hạt Limited — ngoài thời gian sự kiện!' };
    }
    const cost = plant.seedPrice * qty;
    if (!this.chargeCoins(cost)) return { ok: false, msg: 'Không đủ tiền!' };
    if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
    currentPlayer.inventory.seeds[plantId] = (currentPlayer.inventory.seeds[plantId] || 0) + qty;
    this.addActivity(this.isUnlimitedResources()
      ? `Mua ${qty} hạt ${plant.name} (unlimited)`
      : `Mua ${qty} hạt ${plant.name} (-${cost}🪙)`);
    if (typeof Features !== 'undefined') Features.trackQuest('buySeed', qty);
    await savePlayer();
    return { ok: true, msg: `Đã mua ${qty} hạt ${plant.name}!` };
  },

  async buyFertilizer(fertId, qty = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const fert = this.getFertilizer(fertId);
    if (!fert) return { ok: false, msg: 'Không tìm thấy phân bón!' };
    const cost = fert.price * qty;
    if (!this.chargeCoins(cost)) return { ok: false, msg: 'Không đủ tiền!' };
    if (!currentPlayer.inventory.fertilizers) currentPlayer.inventory.fertilizers = {};
    currentPlayer.inventory.fertilizers[fertId] = (currentPlayer.inventory.fertilizers[fertId] || 0) + qty;
    this.addActivity(this.isUnlimitedResources()
      ? `Mua ${qty} ${fert.name} (unlimited)`
      : `Mua ${qty} ${fert.name} (-${cost}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Đã mua ${qty} ${fert.name}!` };
  },

  async plantSeed(plotId, plantId, preferredKind) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plot = currentPlayer.plots[plotId];
    if (!plot) return { ok: false, msg: 'Ô đất không tồn tại!' };
    if (plot.plantId) return { ok: false, msg: 'Ô đất đã có cây!' };
    const unlimited = this.isUnlimitedResources();
    const normal = (currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[plantId]) || 0;
    const star = (currentPlayer.inventory.seedsStar && currentPlayer.inventory.seedsStar[plantId]) || 0;
    let usedStar = false;
    if (preferredKind === 'star') {
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
    plot.seedStar = usedStar;
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
    this.addActivity(`Trồng ${usedStar ? '⭐ ' : ''}${plant.name} vào ô #${plotId + 1}` + (fairyWatered ? ' · 🧚 Tiên tưới ngay' : ''));
    if (typeof Features !== 'undefined') Features.trackQuest('plant', 1);
    if (typeof recordGameEvent === 'function') {
      recordGameEvent('plant', {
        plotId,
        gardenIndex: currentPlayer.activeGarden || 0,
        plantId,
        plantedAt: plot.plantedAt,
        seedKind: usedStar ? 'star' : 'normal',
        watered: plot.watered,
        waterCount: plot.waterCount || 0
      });
    }
    const ach = this.checkAchievements();
    await savePlayer({ action: 'plant' });
    this.notifyAchievements(ach);
    return { ok: true, msg: `Đã trồng ${usedStar ? '⭐ ' : ''}${plant.name}!` + (fairyWatered ? ' 🧚 Tiên đã tưới.' : '') };
  },

  async plantMultiple(plantId, count, preferredKind, sharedAt) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plant = this.getPlant(plantId);
    if (!plant) return { ok: false, msg: 'Hạt không hợp lệ!' };
    const empty = [];
    currentPlayer.plots.forEach((p, i) => { if (!p.plantId) empty.push(i); });
    if (empty.length === 0) return { ok: false, msg: 'Không còn ô đất trống!' };
    const normal = (currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[plantId]) || 0;
    const star = (currentPlayer.inventory.seedsStar && currentPlayer.inventory.seedsStar[plantId]) || 0;
    let seedCount = normal + star;
    if (preferredKind === 'star') seedCount = star;
    else if (preferredKind === 'normal') seedCount = normal;
    if (seedCount < 1) {
      return { ok: false, msg: preferredKind === 'star' ? 'Không đủ hạt sao!' : (preferredKind === 'normal' ? 'Không đủ hạt thường!' : 'Không đủ hạt giống!') };
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
      if (preferredKind === 'star') {
        if ((currentPlayer.inventory.seedsStar[plantId] || 0) < 1) break;
        currentPlayer.inventory.seedsStar[plantId]--;
        if (currentPlayer.inventory.seedsStar[plantId] <= 0) delete currentPlayer.inventory.seedsStar[plantId];
        usedStar = true;
      } else if (preferredKind === 'normal') {
        if ((currentPlayer.inventory.seeds[plantId] || 0) < 1) break;
        currentPlayer.inventory.seeds[plantId]--;
        if (currentPlayer.inventory.seeds[plantId] <= 0) delete currentPlayer.inventory.seeds[plantId];
      } else {
        const st = (currentPlayer.inventory.seedsStar && currentPlayer.inventory.seedsStar[plantId]) || 0;
        const nm = (currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[plantId]) || 0;
        if (st + nm < 1) break;
        if (st > 0) {
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
      plot.seedStar = usedStar;
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
      this.addActivity(`Trồng ${planted} ô ${plant.name}` + (fairyWateredN ? ` · 🧚 Tiên tưới ${fairyWateredN} ô` : '') + ' (đồng bộ giờ)');
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
    this.addActivity(`Tưới nước ô #${plotId + 1} (${plot.waterCount}/3)`);
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

  getFairyCareRemainingSec() {
    if (!this.isFairyActive() || !currentPlayer) return null;
    const THREE_H = 3 * 60 * 60 * 1000;
    const last = currentPlayer.lastFairyCare || 0;
    const next = last + THREE_H;
    return Math.max(0, Math.ceil((next - (typeof nowMs==="function"?nowMs():Date.now())) / 1000));
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
      byGarden: {}
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
    if (ge[gardenIndex] === false || ge[String(gardenIndex)] === false) return false;
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
      gender: cfg && cfg.gender === 'male' ? 'male' : 'female'
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
    return Math.max(0, (atMs - plot.plantedAt) / 1000);
  },

  isReadyAt(plot, atMs) {
    if (!plot || !plot.plantId || !plot.plantedAt) return false;
    return this.getElapsedAt(plot, atMs) + 0.05 >= this.getEffectiveGrowTime(plot);
  },

  getReadyAtMs(plot) {
    if (!plot || !plot.plantId || !plot.plantedAt) return null;
    const growSec = this.getEffectiveGrowTime(plot);
    return plot.plantedAt + growSec * 1000;
  },

  OFFLINE_RAIN_INTERVAL_MS: 15 * 60 * 1000,

  getRainChancePct() {
    let chance = (typeof currentSettings !== 'undefined' && currentSettings && currentSettings.rainChance) != null
      ? Number(currentSettings.rainChance)
      : 15;
    if (!Number.isFinite(chance)) chance = 15;
    return Math.max(1, Math.min(50, chance));
  },

  applyOfflineRainAt(t) {
    if (!currentPlayer) return { watered: 0, boosted: 0 };
    this.ensureGardens();
    let watered = 0;
    let boosted = 0;
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
    return { watered, boosted };
  },

  _nycHarvestOneAt(plot, t, gi, cfg, doReplant, silent) {
    if (!plot || !plot.plantId || !plot.plantedAt) return { harvested: 0, planted: 0, amount: 0, plantName: '', plantId: null, seedStar: false };
    if (!this.isReadyAt(plot, t)) return { harvested: 0, planted: 0, amount: 0, plantName: '', plantId: null, seedStar: false };
    const plant = this.getPlant(plot.plantId);
    if (!plant) return { harvested: 0, planted: 0, amount: 0, plantName: '', plantId: null, seedStar: false };
    let amount = plant.yield || 1;
    if (plot.fertilizerId) {
      const fert = this.getFertilizer(plot.fertilizerId);
      if (fert && fert.yieldBonus) amount = Math.ceil(amount * (1 + fert.yieldBonus));
    }
    if ((plot.waterCount || 0) >= 2) amount = Math.ceil(amount * 1.1);
    if (plot.seedStar) amount = Math.ceil(amount * 1.5);
    const seedStarFlag = !!plot.seedStar;
    const hid = plot.plantId;
    const plantName = (plant && plant.name) ? plant.name : String(hid || 'cây');
    if (!currentPlayer.inventory) currentPlayer.inventory = {};
    if (plot.seedStar) {
      if (!currentPlayer.inventory.harvestStar) currentPlayer.inventory.harvestStar = {};
      currentPlayer.inventory.harvestStar[hid] = (currentPlayer.inventory.harvestStar[hid] || 0) + amount;
    } else {
      if (!currentPlayer.inventory.harvest) currentPlayer.inventory.harvest = {};
      currentPlayer.inventory.harvest[hid] = (currentPlayer.inventory.harvest[hid] || 0) + amount;
    }
    currentPlayer.stats = currentPlayer.stats || {};
    currentPlayer.stats.harvested = (currentPlayer.stats.harvested || 0) + amount;
    this.unlockCollection(hid);
    this.addXp(Math.ceil((plant.xp || 5) * (seedStarFlag ? 1.3 : 1)));
    plot.plantId = null;
    plot.plantedAt = null;
    plot.watered = false;
    plot.waterCount = 0;
    plot.lastWatered = null;
    plot.fertilizerId = null;
    plot.fertilizedAt = null;
    plot.seedStar = false;
    let planted = 0;
    let replantName = '';
    if (doReplant && cfg && cfg.plantId) {
      if (this._nycPlantOneAt(plot, cfg, t)) {
        planted = 1;
        const rp = this.getPlant(cfg.plantId);
        replantName = (rp && rp.name) ? rp.name : String(cfg.plantId);
        if (this.isFairyActive() && this.isFairyGardenEnabled(gi)) {
          plot.waterCount = 3;
          plot.watered = true;
          plot.lastWatered = t;
          const fcfg = this.getFairyConfig();
          if (fcfg.useFertilizer) {
            const fid = this.takeFertFromBagForFairy(fcfg);
            if (fid) {
              plot.fertilizerId = fid;
              plot.fertilizedAt = t;
            }
          }
        }
      }
    }
    if (!silent) {
      let logMsg = 'Thu hoạch ' + amount + ' ' + plantName + (seedStarFlag ? ' ⭐' : '');
      if (planted && replantName) logMsg += ' · NYC trồng lại ' + replantName;
      this.addActivity(logMsg, { type: 'harvest_offline', at: t, plotGarden: gi });
    }
    return { harvested: 1, planted, amount, plantName, plantId: hid, seedStar: seedStarFlag, replantName };
  },

  _nextNycReadyAt(untilMs) {
    if (!this.isNycActive() || !currentPlayer || !currentPlayer.gardens) return null;
    let best = null;
    for (let gi = 0; gi < currentPlayer.gardens.length; gi++) {
      if (!this.isNycGardenEnabled(gi)) continue;
      const plots = currentPlayer.gardens[gi];
      if (!Array.isArray(plots)) continue;
      for (const plot of plots) {
        if (!plot || !plot.plantId || !plot.plantedAt) continue;
        const readyAt = this.getReadyAtMs(plot);
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
    let from = Math.min(
      now,
      Math.max(
        0,
        currentPlayer.lastSeenAt ||
          currentPlayer.lastCatchUpAt ||
          currentPlayer.timersSyncedAt ||
          currentPlayer.updatedAt ||
          now
      )
    );
    if (fromLog && fromLog < from) {
      from = Math.max(Number(currentPlayer.lastCatchUpAt) || 0, fromLog - 1000);
    }
    const OFFLINE_MIN_MS = 30 * 1000;
    const OFFLINE_LOG_MIN_MS = 60 * 1000;
    const offlineGap = now - from;
    if (offlineGap < OFFLINE_MIN_MS) {
      currentPlayer.lastCatchUpAt = now;
      delete currentPlayer._needOfflineFromLog;
      delete currentPlayer._logEarliest;
      return { ok: true, changed: false, notes: [], offlineMs: offlineGap, skipped: true };
    }

    let changed = false;
    const notes = [];
    let totalHarvest = 0;
    let totalPlant = 0;
    let totalYieldAmount = 0;
    const harvestedPlotKeys = new Set();
    const harvestByPlant = {};
    let fairyCycles = 0;
    let helperBuys = 0;
    let rainHits = 0;
    let rainWatered = 0;

    const events = [];
    const rainChance = this.getRainChancePct();
    const rainStep = this.OFFLINE_RAIN_INTERVAL_MS || (15 * 60 * 1000);
    let rainT = from + rainStep;
    let rainGuard = 0;
    while (rainT <= now && rainGuard++ < 2000) {
      if (Math.random() * 100 < rainChance) {
        events.push({ t: rainT, type: 'rain' });
      }
      rainT += rainStep;
    }
    if (this.isFairyActive()) {
      let careAt = Number(currentPlayer.lastFairyCare) || 0;
      if (!careAt) {
        events.push({ t: from, type: 'fairy' });
        careAt = from;
        while (careAt + this.BOOST_MS <= now) {
          careAt += this.BOOST_MS;
          events.push({ t: careAt, type: 'fairy' });
        }
      } else {
        while (careAt + this.BOOST_MS <= now) {
          careAt += this.BOOST_MS;
          events.push({ t: careAt, type: 'fairy' });
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

    if (nycCovered) {
      const plantAt = from;
      if (this.isNycActiveAt(plantAt)) {
        for (let gi = 0; gi < currentPlayer.gardens.length; gi++) {
          if (!this.isNycGardenEnabled(gi)) continue;
          const gcfg = this.getNycConfigForGarden(gi);
          if (!gcfg.plantId) continue;
          currentPlayer.activeGarden = gi;
          currentPlayer.plots = currentPlayer.gardens[gi];
          const n = this._nycPlantEmptiesAt(currentPlayer.plots, gcfg, plantAt);
          if (n > 0) {
            totalPlant += n;
            changed = true;
          }
          currentPlayer.gardens[gi] = currentPlayer.plots;
        }
      }
    }

    const recordHarvestStat = (r, plotKey) => {
      if (!r || !r.harvested) return;
      totalHarvest += r.harvested;
      totalPlant += r.planted || 0;
      totalYieldAmount += r.amount || 0;
      if (plotKey != null && plotKey !== '') harvestedPlotKeys.add(String(plotKey));
      const key = (r.plantName || 'cây') + (r.seedStar ? ' ⭐' : '');
      if (!harvestByPlant[key]) harvestByPlant[key] = { cycles: 0, amount: 0 };
      harvestByPlant[key].cycles += 1;
      harvestByPlant[key].amount += r.amount || 0;
      changed = true;
    };

    const nycHarvestReplantAt = (t) => {
      if (!nycBuffOn) return;
      const canReplant = this.isNycActiveAt(t);
      for (let gi = 0; gi < currentPlayer.gardens.length; gi++) {
        if (!this.isNycGardenEnabled(gi)) continue;
        const cfg = this.getNycConfigForGarden(gi);
        currentPlayer.activeGarden = gi;
        currentPlayer.plots = currentPlayer.gardens[gi];
        const plots = currentPlayer.plots;
        if (!Array.isArray(plots)) continue;
        for (let i = 0; i < plots.length; i++) {
          const plot = plots[i];
          if (!plot || !plot.plantId) continue;
          const readyAt = this.getReadyAtMs(plot);
          if (readyAt == null || readyAt > t) continue;
          const r = this._nycHarvestOneAt(plot, t, gi, cfg, canReplant && !!cfg.plantId, true);
          recordHarvestStat(r, gi + ':' + i);
        }
        if (canReplant && cfg && cfg.plantId) {
          const extra = this._nycPlantEmptiesAt(plots, cfg, t);
          if (extra > 0) {
            totalPlant += extra;
            changed = true;
          }
        }
        currentPlayer.gardens[gi] = plots;
      }
    };

    let guard = 0;
    let lastReadyStamp = -1;
    let stuckSame = 0;
    const GUARD_MAX = 50000;
    while (guard++ < GUARD_MAX) {
      const nextReady = this._nextNycReadyAt(now);
      const nextEv = (evIdx < events.length && events[evIdx].t <= now) ? events[evIdx] : null;

      if (nextReady == null && !nextEv) break;

      if (nextReady != null && (!nextEv || nextReady <= nextEv.t)) {
        if (nextReady === lastReadyStamp) {
          stuckSame++;
          if (stuckSame > 3) {
            nycHarvestReplantAt(Math.min(now, nextReady + 1));
            stuckSame = 0;
            lastReadyStamp = -1;
            const still = this._nextNycReadyAt(now);
            if (still === nextReady) {
              this.forEachGarden((plots, gi2) => {
                if (!this.isNycGardenEnabled(gi2)) return;
                const cfg2 = this.getNycConfigForGarden(gi2);
                (plots || []).forEach((plot, pi) => {
                  if (plot && plot.plantId && plot.plantedAt && this.getReadyAtMs(plot) === nextReady) {
                    plot.plantedAt = nextReady;
                    const rStuck = this._nycHarvestOneAt(plot, nextReady, gi2, cfg2, this.isNycActiveAt(nextReady), true);
                    recordHarvestStat(rStuck, gi2 + ':' + pi);
                  }
                });
              });
            }
            continue;
          }
        } else {
          stuckSame = 0;
          lastReadyStamp = nextReady;
        }
        if (nycCovered || nextReady <= now) {
          nycHarvestReplantAt(nextReady);
        }
        continue;
      }

      const ev = nextEv;
      evIdx++;
      if (ev.type === 'rain') {
        const r = this.applyOfflineRainAt(ev.t);
        rainHits++;
        rainWatered += r.watered || 0;
        if (r.watered || r.boosted) changed = true;
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

    nycHarvestReplantAt(now);

    currentPlayer.activeGarden = activeGarden;
    currentPlayer.plots = currentPlayer.gardens[activeGarden];

    if (this.resetExpiredBoosts()) changed = true;

    if (rainHits) {
      notes.push(
        this.isFairyActive()
          ? `Mưa ${rainHits} trận (Tiên tưới kèm)`
          : `Mưa ${rainHits} trận (buff lớn)`
      );
    }
    if (fairyCycles) notes.push(`Tiên ${fairyCycles} lần chu kỳ 3h`);
    const uniquePlotsHarvested = harvestedPlotKeys.size;
    if (totalHarvest || totalPlant) {
      notes.push(
        `NYC: thu ${uniquePlotsHarvested} ô` +
        (totalHarvest > uniquePlotsHarvested ? ` (${totalHarvest} lần)` : '') +
        ` · trồng lại ${totalPlant} lần · sản lượng ${totalYieldAmount} (offline)`
      );
    }

    if (this.isHelperActive()) {
      const prev = currentPlayer.lastHelperBuy || 0;
      let buys = 0;
      for (let k = 0; k < 5; k++) {
        currentPlayer.lastHelperBuy = 0;
        if (this.tickHelperBuy(now)) {
          buys++;
          changed = true;
        } else break;
      }
      if (!buys) currentPlayer.lastHelperBuy = prev;
      else {
        helperBuys = buys;
        notes.push(`Giúp việc mua ${buys} đợt`);
      }
    }

    currentPlayer.lastSeenAt = now;
    currentPlayer.lastCatchUpAt = now;
    delete currentPlayer._needOfflineFromLog;
    delete currentPlayer._logEarliest;
    if (fromLog) {
      notes.unshift('Log thao tác → bù từ ' + new Date(from).toLocaleString('vi-VN'));
    }

    const offlineMs = now - from;
    const offlineText = this.formatOfflineDuration(offlineMs);
    const fairyActive = this.isFairyActive();
    const nycActive = this.isNycActive();
    const helperActive = this.isHelperActive();

    const lines = [];
    lines.push('BÙ OFFLINE - vắng ' + offlineText + ' (từ ' + new Date(from).toLocaleString('vi-VN') + ' → ' + new Date(now).toLocaleString('vi-VN') + ')');
    lines.push('Tóm tắt: ' + (notes.length ? notes.join(' · ') : (changed ? 'đã cập nhật trạng thái' : 'không có thay đổi lớn')));
    lines.push('Mưa: ' + rainHits + ' trận (tỉ lệ admin ' + rainChance + '% / mỗi 15 phút) · ô được Tiên tưới kèm mưa: ' + rainWatered);
    let cycleLeftSec = null;
    if (fairyActive) {
      const lastC = Number(currentPlayer.lastFairyCare) || 0;
      if (lastC) {
        cycleLeftSec = Math.max(0, Math.ceil((lastC + this.BOOST_MS - now) / 1000));
      }
    }
    lines.push('Tiên: ' + (fairyActive ? 'ĐANG BẬT' : 'tắt/hết hạn') + ' · chu kỳ 3 giờ đã chạy: ' + fairyCycles + ' lần · đồng hồ 3h còn: ' + (cycleLeftSec == null ? '—' : this.formatTime(cycleLeftSec)) + ' (không reset full 3h)');
    const _uniqP = harvestedPlotKeys.size;
    lines.push(
      'NYC: ' + (nycActive ? 'ĐANG BẬT' : 'tắt/hết hạn') +
      ' · thu ' + _uniqP + ' ô' +
      (totalHarvest > _uniqP ? ' (' + totalHarvest + ' lần thu)' : '') +
      ' · trồng lại ' + totalPlant + ' lần · sản lượng ' + totalYieldAmount
    );
    const plantDetailParts = Object.keys(harvestByPlant).map(name => {
      const s = harvestByPlant[name];
      return name + ' ×' + s.cycles + ' lần (' + s.amount + ' sp)';
    });
    if (plantDetailParts.length) {
      lines.push('Chi tiết thu offline: ' + plantDetailParts.join(' · '));
    } else if (!totalHarvest && !totalPlant) {
      lines.push('Chi tiết thu offline: không thu được ô nào trong thời gian vắng');
    }
    lines.push('Giúp việc: ' + (helperActive ? 'ĐANG BẬT' : 'tắt/hết hạn') + ' · mua theo mốc kho: ' + helperBuys + ' đợt');
    if (fromLog) {
      lines.push('Có log thao tác (trồng/tưới/bón) → mốc bù lấy sớm hơn lastSeen');
    }
    lines.push('Kết thúc bù offline · lastSeen/lastCatchUp cập nhật ' + new Date(now).toLocaleString('vi-VN'));

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
          totalHarvest,
          totalPlant,
          totalYieldAmount,
          uniquePlotsHarvested: harvestedPlotKeys.size,
          harvestByPlant,
          helperBuys,
          fairyActive,
          nycActive,
          helperActive
        });
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
      harvestByPlant,
      fairyCycles,
      helperBuys,
      rainHits,
      rainWatered,
      rainChance,
      fromLog: fromLog || null
    };
  },

  _nycPlantOneAt(plot, cfg, plantTime) {
    if (!plot || plot.plantId || !cfg || !cfg.plantId) return false;
    const kind = cfg.seedKind === 'star' ? 'star' : 'normal';
    if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
    if (!currentPlayer.inventory.seedsStar) currentPlayer.inventory.seedsStar = {};
    const bag = kind === 'star' ? currentPlayer.inventory.seedsStar : currentPlayer.inventory.seeds;
    const plantId = cfg.plantId;
    if ((bag[plantId] || 0) < 1) return false;
    bag[plantId]--;
    if (bag[plantId] <= 0) delete bag[plantId];
    plot.plantId = plantId;
    plot.plantedAt = plantTime;
    plot.seedStar = kind === 'star';
    plot.waterCount = 0;
    plot.watered = false;
    plot.lastWatered = null;
    plot.fertilizerId = null;
    plot.fertilizedAt = null;
    currentPlayer.stats = currentPlayer.stats || {};
    currentPlayer.stats.planted = (currentPlayer.stats.planted || 0) + 1;
    return true;
  },

  _nycPlantEmptiesAt(plots, cfg, t) {
    if (!cfg || !cfg.plantId || !plots) return 0;
    const mode = cfg.mode === 'count' ? 'count' : 'all';
    const limit = mode === 'count'
      ? Math.max(1, Math.min(999, parseInt(cfg.count, 10) || 1))
      : 99999;
    let n = 0;
    for (let i = 0; i < plots.length && n < limit; i++) {
      const plot = plots[i];
      if (!plot || plot.plantId) continue;
      if (this._nycPlantOneAt(plot, cfg, t)) n++;
      else break;
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
    if ((currentPlayer.coins || 0) < cost) return { ok: false, msg: 'Không đủ tiền!' };
    currentPlayer.coins -= cost;
    currentPlayer.stats = currentPlayer.stats || {};
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
    if (!currentPlayer.inventory.protects) currentPlayer.inventory.protects = {};
    currentPlayer.inventory.protects[protectId] = (currentPlayer.inventory.protects[protectId] || 0) + qty;
    this.addActivity(`Mua ${qty} ${item.name} (-${cost.toLocaleString()}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Đã mua ${qty} ${item.name}!` };
  },

  async buyFairyPack(packId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const pack = DEFAULT_FAIRY_PACKS.find(p => p.id === packId);
    if (!pack) return { ok: false, msg: 'Gói không hợp lệ!' };
    if (currentPlayer.coins < pack.price) return { ok: false, msg: 'Không đủ tiền!' };
    currentPlayer.coins -= pack.price;
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + pack.price;
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
    if (currentPlayer.coins < pack.price) return { ok: false, msg: 'Không đủ tiền!' };
    currentPlayer.coins -= pack.price;
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + pack.price;
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
      minStock: Math.max(0, Math.min(9999, parseInt(r.minStock, 10) || 0)),
      buyQty: Math.max(1, Math.min(9999, parseInt(r.buyQty, 10) || 1)),
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
        minStock: Math.max(0, Math.min(9999, parseInt(r.minStock, 10) || 0)),
        buyQty: Math.max(1, Math.min(9999, parseInt(r.buyQty, 10) || 1)),
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
    qty = Math.max(1, Math.min(9999, parseInt(qty, 10) || 1));
    if (kind === 'seed') {
      const plant = this.getPlant(id);
      if (!plant) return { ok: false, bought: 0, cost: 0, msg: 'Không có hạt' };
      if (!this.isPlantAvailable(plant)) return { ok: false, bought: 0, cost: 0, msg: 'Limited hết hạn' };
      const cost = plant.seedPrice * qty;
      if (currentPlayer.coins < cost) return { ok: false, bought: 0, cost: 0, msg: 'Thiếu tiền' };
      currentPlayer.coins -= cost;
      currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
      if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
      currentPlayer.inventory.seeds[id] = (currentPlayer.inventory.seeds[id] || 0) + qty;
      return { ok: true, bought: qty, cost, msg: plant.name };
    }
    if (kind === 'fert') {
      const fert = this.getFertilizer(id);
      if (!fert) return { ok: false, bought: 0, cost: 0, msg: 'Không có phân' };
      const cost = fert.price * qty;
      if (currentPlayer.coins < cost) return { ok: false, bought: 0, cost: 0, msg: 'Thiếu tiền' };
      currentPlayer.coins -= cost;
      currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
      if (!currentPlayer.inventory.fertilizers) currentPlayer.inventory.fertilizers = {};
      currentPlayer.inventory.fertilizers[id] = (currentPlayer.inventory.fertilizers[id] || 0) + qty;
      return { ok: true, bought: qty, cost, msg: fert.name };
    }
    if (kind === 'protect') {
      const item = this.getProtect(id);
      if (!item) return { ok: false, bought: 0, cost: 0, msg: 'Không có bảo hộ' };
      const cost = item.price * qty;
      if (currentPlayer.coins < cost) return { ok: false, bought: 0, cost: 0, msg: 'Thiếu tiền' };
      currentPlayer.coins -= cost;
      currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
      if (!currentPlayer.inventory.protects) currentPlayer.inventory.protects = {};
      currentPlayer.inventory.protects[id] = (currentPlayer.inventory.protects[id] || 0) + qty;
      return { ok: true, bought: qty, cost, msg: item.name };
    }
    return { ok: false, bought: 0, cost: 0, msg: 'Loại không hỗ trợ' };
  },

  tickHelperBuy(now = (typeof nowMs==="function"?nowMs():Date.now())) {
    if (!this.isHelperActive() || !currentPlayer) return false;
    const last = currentPlayer.lastHelperBuy || 0;
    if (now - last < 12000) return false;
    const cfg = this.getHelperConfig();
    const rules = (cfg.rules || []).filter(r => r.enabled !== false);
    if (!rules.length) return false;

    let any = false;
    let totalCost = 0;
    const lines = [];
    rules.forEach(r => {
      const have = this.getStockCount(r.kind, r.id);
      if (have >= r.minStock) return;
      const res = this.helperBuySilent(r.kind, r.id, r.buyQty);
      if (res.ok && res.bought > 0) {
        any = true;
        totalCost += res.cost;
        lines.push(`${res.msg} x${res.bought}`);
      }
    });
    if (any) {
      currentPlayer.lastHelperBuy = now;
      const emoji = this.getHelperEmoji();
      const name = this.getHelperDisplayName();
      this.addActivity(`${emoji} ${name} mua: ${lines.slice(0, 5).join(', ')} (−${totalCost}🪙)`);
      if (typeof Features !== 'undefined' && Features.trackQuest) {
      }
    }
    return any;
  },

  async buyHelperPack(packId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const packs = this.getHelperPacks();
    const pack = packs.find(p => p.id === packId);
    if (!pack) return { ok: false, msg: 'Gói không hợp lệ!' };
    if (currentPlayer.coins < pack.price) return { ok: false, msg: 'Không đủ tiền!' };
    currentPlayer.coins -= pack.price;
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + pack.price;
    const base = Math.max((typeof nowMs==="function"?nowMs():Date.now()), currentPlayer.helperUntil || 0);
    currentPlayer.helperUntil = base + pack.days * 24 * 60 * 60 * 1000;
    this.tickHelperBuy((typeof nowMs==="function"?nowMs():Date.now()));
    this.addActivity(`Mua ${pack.name} (-${pack.price}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Đã kích hoạt ${pack.name}! Còn ${this.formatTime(this.helperRemainingSec())}` };
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

  async runNycCare(now, gardenIndex) {
    if (!currentPlayer || !currentPlayer.plots) return false;
    now = now || (typeof nowMs==="function"?nowMs():Date.now());
    const gLabel = (typeof gardenIndex === 'number') ? (gardenIndex + 1) : ((currentPlayer.activeGarden || 0) + 1);

    if (this.nycShouldWaitForNearReady(currentPlayer.plots)) {
      return false;
    }

    let harvested = 0;
    let planted = 0;
    let totalAmount = 0;
    let totalXp = 0;

    for (let i = 0; i < currentPlayer.plots.length; i++) {
      const plot = currentPlayer.plots[i];
      if (!(plot && plot.plantId && this.isReady(plot))) continue;
      const plant = this.getPlant(plot.plantId);
      if (!plant) continue;
      let amount = plant.yield;
      if (plot.fertilizerId) {
        const fert = this.getFertilizer(plot.fertilizerId);
        if (fert && fert.yieldBonus) amount = Math.ceil(amount * (1 + fert.yieldBonus));
      }
      if ((plot.waterCount || 0) >= 2) amount = Math.ceil(amount * 1.1);
      if (plot.seedStar) amount = Math.ceil(amount * 1.5);
      const hid = plot.plantId;
      if (plot.seedStar) {
        if (!currentPlayer.inventory.harvestStar) currentPlayer.inventory.harvestStar = {};
        currentPlayer.inventory.harvestStar[hid] = (currentPlayer.inventory.harvestStar[hid] || 0) + amount;
      } else {
        if (!currentPlayer.inventory.harvest) currentPlayer.inventory.harvest = {};
        currentPlayer.inventory.harvest[hid] = (currentPlayer.inventory.harvest[hid] || 0) + amount;
      }
      currentPlayer.stats.harvested = (currentPlayer.stats.harvested || 0) + amount;
      this.unlockCollection(plot.plantId);
      totalAmount += amount;
      totalXp += Math.ceil((plant.xp || 5) * (plot.seedStar ? 1.3 : 1));
      plot.plantId = null;
      plot.plantedAt = null;
      plot.watered = false;
      plot.waterCount = 0;
      plot.lastWatered = null;
      plot.fertilizerId = null;
      plot.fertilizedAt = null;
      plot.seedStar = false;
      harvested++;
    }
    if (harvested > 0) {
      this.addXp(totalXp);
      if (typeof Features !== 'undefined' && Features.trackQuest) Features.trackQuest('harvest', harvested);
    }

    const gIdx = typeof currentPlayer.activeGarden === 'number' ? currentPlayer.activeGarden : 0;
    const cfg = this.getNycConfigForGarden(gIdx);
    if (cfg.plantId) {
      const kind = cfg.seedKind === 'star' ? 'star' : 'normal';
      const seeds = (currentPlayer.inventory && currentPlayer.inventory.seeds) || {};
      const stars = (currentPlayer.inventory && currentPlayer.inventory.seedsStar) || {};
      const have = kind === 'star' ? (stars[cfg.plantId] || 0) : (seeds[cfg.plantId] || 0);
      if (have > 0) {
        const empty = [];
        currentPlayer.plots.forEach((p, i) => { if (!p.plantId) empty.push(i); });
        let want = cfg.mode === 'count' ? Math.min(cfg.count || 1, empty.length, have) : Math.min(empty.length, have);
        if (want > 0) {
          const res = await this.plantMultiple(cfg.plantId, want, kind, now);
          if (res.ok) {
            const m = (res.msg || '').match(/(\d+)/);
            planted = m ? parseInt(m[1], 10) : want;
          }
        }
      }
    } else if (harvested > 0) {
      await savePlayer();
    }

    if (harvested > 0 || planted > 0) {
      currentPlayer.lastNycCare = now;
      this.addActivity(
        `NYC vườn ${gLabel}: thu ${harvested} ô` +
        (totalAmount ? ` (${totalAmount} sp)` : '') +
        (planted ? `, trồng ${planted} ô cùng giờ` : '')
      );
    }
    return harvested > 0 || planted > 0;
  },

  nycHasWork() {
    if (!this.isNycActive() || !currentPlayer || !currentPlayer.plots) return false;
    const win = this.nycSyncWindowSec || 10;
    for (const plot of currentPlayer.plots) {
      if (!plot || !plot.plantId || !plot.plantedAt) continue;
      if (this.isReady(plot)) return true;
      const remain = this.getRemainingSeconds(plot);
      if (remain > 0 && remain <= win) return true;
    }
    const gIdx = typeof currentPlayer.activeGarden === 'number' ? currentPlayer.activeGarden : 0;
    if (!this.isNycGardenEnabled(gIdx)) return false;
    const cfg = this.getNycConfigForGarden(gIdx);
    if (!cfg.plantId) return false;
    const kind = cfg.seedKind === 'star' ? 'star' : 'normal';
    const seeds = (currentPlayer.inventory && currentPlayer.inventory.seeds) || {};
    const stars = (currentPlayer.inventory && currentPlayer.inventory.seedsStar) || {};
    const have = kind === 'star' ? (stars[cfg.plantId] || 0) : (seeds[cfg.plantId] || 0);
    if (have < 1) return false;
    return currentPlayer.plots.some(p => p && !p.plantId);
  },

  _nycBusy: false,
  async tickNycCare() {
    if (!this.isNycActive() || this._nycBusy) return false;
    this.ensureGardens();
    this._nycBusy = true;
    let any = false;
    try {
      const active = currentPlayer.activeGarden || 0;
      this.syncActiveGarden();
      for (let i = 0; i < currentPlayer.gardens.length; i++) {
        if (!this.isNycGardenEnabled(i)) continue;
        currentPlayer.activeGarden = i;
        currentPlayer.plots = currentPlayer.gardens[i];
        if (this.nycHasWork()) {
          const gardenNow = (typeof nowMs==="function"?nowMs():Date.now());
          const did = await this.runNycCare(gardenNow, i);
          if (did) any = true;
        }
        currentPlayer.gardens[i] = currentPlayer.plots;
      }
      currentPlayer.activeGarden = active;
      currentPlayer.plots = currentPlayer.gardens[active];
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

  async mergeSeeds(plantId, protectId, times = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plant = this.getPlant(plantId);
    if (!plant) return { ok: false, msg: 'Hạt không hợp lệ!' };
    if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
    if (!currentPlayer.inventory.seedsStar) currentPlayer.inventory.seedsStar = {};
    if (!currentPlayer.inventory.protects) currentPlayer.inventory.protects = {};

    times = Math.max(1, parseInt(times, 10) || 1);
    if (!Number.isFinite(times) || times < 1) times = 1;
    let success = 0;
    let fail = 0;
    let did = 0;
    let lastRate = this.getMergeSuccessRate(protectId || null);

    const unlimited = this.isUnlimitedResources();
    for (let i = 0; i < times; i++) {
      const have = currentPlayer.inventory.seeds[plantId] || 0;
      if (!unlimited && have < 2) break;
      let protect = null;
      if (protectId) {
        protect = this.getProtect(protectId);
        if (!protect) return { ok: false, msg: 'Bùa bảo hộ không hợp lệ!' };
        if (!unlimited) {
          const ph = currentPlayer.inventory.protects[protectId] || 0;
          if (ph < 1) {
            if (did === 0) return { ok: false, msg: 'Không đủ bùa bảo hộ!' };
            break;
          }
        }
      }
      const rate = this.getMergeSuccessRate(protectId || null);
      lastRate = rate;

      if (!unlimited) {
        currentPlayer.inventory.seeds[plantId] -= 2;
        if (currentPlayer.inventory.seeds[plantId] <= 0) delete currentPlayer.inventory.seeds[plantId];
        if (protect) {
          currentPlayer.inventory.protects[protectId]--;
          if (currentPlayer.inventory.protects[protectId] <= 0) delete currentPlayer.inventory.protects[protectId];
        }
      }

      const roll = Math.random() * 100;
      if (roll < rate) {
        currentPlayer.inventory.seedsStar[plantId] = (currentPlayer.inventory.seedsStar[plantId] || 0) + 1;
        success++;
      } else if (!unlimited) {
        currentPlayer.inventory.seeds[plantId] = (currentPlayer.inventory.seeds[plantId] || 0) + 1;
        fail++;
      } else {
        fail++;
      }
      did++;
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
      msg: `Ghép ${did} lần · ✨ ${success} sao · 💥 ${fail} thất bại (tỉ lệ ${lastRate}%)`,
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
    if (plot.seedStar) amount = Math.ceil(amount * 1.5);
    const hid = plot.plantId;
    if (plot.seedStar) {
      if (!currentPlayer.inventory.harvestStar) currentPlayer.inventory.harvestStar = {};
      currentPlayer.inventory.harvestStar[hid] = (currentPlayer.inventory.harvestStar[hid] || 0) + amount;
    } else {
      if (!currentPlayer.inventory.harvest) currentPlayer.inventory.harvest = {};
      currentPlayer.inventory.harvest[hid] = (currentPlayer.inventory.harvest[hid] || 0) + amount;
    }
    currentPlayer.stats.harvested = (currentPlayer.stats.harvested || 0) + amount;
    if (typeof Features !== 'undefined') Features.trackQuest('harvest', 1);
    const newCol = this.unlockCollection(plot.plantId);
    const xpGain = Math.ceil((plant.xp || 5) * (plot.seedStar ? 1.3 : 1));
    this.addXp(xpGain);
    plot.plantId = null;
    plot.plantedAt = null;
    plot.watered = false;
    plot.waterCount = 0;
    plot.lastWatered = null;
    plot.fertilizerId = null;
    plot.fertilizedAt = null;
    plot.seedStar = false;
    this.addActivity(`Thu hoạch ${amount} ${plant.name} (+${xpGain} XP)` + (newCol ? ' · Album +1' : ''));
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
        if (plot.seedStar) amount = Math.ceil(amount * 1.5);
        const hid = plot.plantId;
        if (plot.seedStar) {
          if (!currentPlayer.inventory.harvestStar) currentPlayer.inventory.harvestStar = {};
          currentPlayer.inventory.harvestStar[hid] = (currentPlayer.inventory.harvestStar[hid] || 0) + amount;
        } else {
          if (!currentPlayer.inventory.harvest) currentPlayer.inventory.harvest = {};
          currentPlayer.inventory.harvest[hid] = (currentPlayer.inventory.harvest[hid] || 0) + amount;
        }
        currentPlayer.stats.harvested = (currentPlayer.stats.harvested || 0) + amount;
        this.unlockCollection(plot.plantId);
        total += amount;
        totalXp += Math.ceil((plant.xp || 5) * (plot.seedStar ? 1.3 : 1));
        plot.plantId = null;
        plot.plantedAt = null;
        plot.watered = false;
        plot.waterCount = 0;
        plot.lastWatered = null;
        plot.fertilizerId = null;
        plot.fertilizedAt = null;
        plot.seedStar = false;
        plotsDone++;
      }
    }
    if (total > 0) {
      this.addXp(totalXp);
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
    qty = Math.max(1, parseInt(qty, 10) || 1);
    let soldN = 0, soldS = 0, earn = 0;
    const unitNormal = Math.max(1, Math.floor((plant.seedPrice || 1) * 0.5));
    const unitStar = Math.max(1, Math.floor((plant.seedPrice || 1) * 0.75));

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
    if (soldN + soldS < 1) return { ok: false, msg: 'Không đủ hạt để bán!' };
    currentPlayer.coins += earn;
    currentPlayer.stats.earned = (currentPlayer.stats.earned || 0) + earn;
    if (typeof Features !== 'undefined') Features.trackQuest('earn', earn);
    const parts = [];
    if (soldN) parts.push(`${soldN} thường`);
    if (soldS) parts.push(`${soldS} ⭐`);
    this.addActivity(`Bán hạt ${plant.name} (${parts.join(', ')}) (+${earn}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Bán ${parts.join(' + ')} ${plant.name}, nhận ${earn}🪙!` };
  },

  normalizeHarvestBags() {
    if (!currentPlayer || !currentPlayer.inventory) return;
    const inv = currentPlayer.inventory;
    if (!inv.harvest) inv.harvest = {};
    if (!inv.harvestStar) inv.harvestStar = {};
    if (!inv.harvestBought) inv.harvestBought = {};
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

  async sellHarvest(plantId, qty = 1, kind = 'normal') {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plant = this.getPlant(plantId);
    if (!plant) return { ok: false, msg: 'Sản phẩm không hợp lệ!' };
    qty = Math.max(1, parseInt(qty, 10) || 1);
    const bagKey = kind === 'star' ? 'harvestStar' : (kind === 'bought' ? 'harvestBought' : 'harvest');
    if (!currentPlayer.inventory[bagKey]) currentPlayer.inventory[bagKey] = {};
    const have = currentPlayer.inventory[bagKey][plantId] || 0;
    if (have < qty) return { ok: false, msg: 'Không đủ sản phẩm!' };
    const unit = kind === 'star' ? Math.ceil(plant.sellPrice * 1.5) : plant.sellPrice;
    const earn = unit * qty;
    if (typeof Features !== 'undefined') Features.trackQuest('earn', earn);
    currentPlayer.inventory[bagKey][plantId] -= qty;
    if (currentPlayer.inventory[bagKey][plantId] <= 0) delete currentPlayer.inventory[bagKey][plantId];
    currentPlayer.coins += earn;
    currentPlayer.stats.earned = (currentPlayer.stats.earned || 0) + earn;
    const tag = kind === 'star' ? '⭐' : (kind === 'bought' ? '🛒' : '');
    this.addActivity(`Bán ${qty} ${plant.name}${tag} (+${earn}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Bán ${qty} ${plant.name}, nhận ${earn}🪙!` };
  },

  async sellAllHarvest(kind = null) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    let total = 0;
    const bags = kind ? [kind] : ['harvest', 'harvestStar', 'harvestBought'];
    const bagMap = { harvest: 'normal', harvestStar: 'star', harvestBought: 'bought' };
    bags.forEach(bk => {
      const bag = currentPlayer.inventory[bk] || {};
      Object.keys(bag).forEach(id => {
        const plant = this.getPlant(id);
        if (!plant) return;
        const qty = bag[id] || 0;
        if (qty <= 0) return;
        const unit = bk === 'harvestStar' ? Math.ceil(plant.sellPrice * 1.5) : plant.sellPrice;
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

  async claimDaily() {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const today = (typeof gameDateString === 'function') ? gameDateString() : new Date().toDateString();
    const legacy = new Date().toDateString();
    if (currentPlayer.lastDaily === today || currentPlayer.lastDaily === legacy) {
      return { ok: false, msg: 'Bạn đã nhận thưởng hôm nay rồi!' };
    }
    const reward = 150 + (currentPlayer.level || 1) * 20;
    currentPlayer.coins += reward;
    currentPlayer.lastDaily = today;
    if (!currentPlayer.inventory.fertilizers) currentPlayer.inventory.fertilizers = {};
    currentPlayer.inventory.fertilizers['phan-thuong'] = (currentPlayer.inventory.fertilizers['phan-thuong'] || 0) + 2;
    this.addActivity(`Nhận thưởng hàng ngày +${reward}🪙 +2 Phân thường`);
    await savePlayer();
    return { ok: true, msg: `Nhận ${reward}🪙 và 2 Phân thường!` };
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
    ms = Math.max(0, Number(ms) || 0);
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    const parts = [];
    if (d) parts.push(d + ' ngày');
    if (h) parts.push(h + ' giờ');
    if (m) parts.push(m + ' phút');
    if (sec && !d) parts.push(sec + ' giây');
    return parts.length ? parts.join(' ') : '0 giây';
  },

  addActivity(text, meta) {
    if (!currentPlayer) return;
    if (!currentPlayer.activity) currentPlayer.activity = [];
    const t = (meta && typeof meta.at === 'number' && meta.at > 0)
      ? meta.at
      : ((typeof nowMs === 'function') ? nowMs() : Date.now());
    const timeStr = (typeof formatGameDateTime === 'function')
      ? formatGameDateTime(t)
      : new Date(t).toLocaleString('vi-VN');
    currentPlayer.activity.unshift({
      text: String(text || ''),
      time: timeStr,
      t: t,
      type: (meta && meta.type) ? String(meta.type) : 'note'
    });
    if (currentPlayer.activity.length > 120) currentPlayer.activity = currentPlayer.activity.slice(0, 120);

    if (typeof recordGameEvent === 'function') {
      const type = (meta && meta.type) ? String(meta.type).slice(0, 24) : 'note';
      const data = meta && typeof meta === 'object' ? { ...meta, msg: String(text || '').slice(0, 400) } : { msg: String(text || '').slice(0, 400) };
      delete data.type;
      try { recordGameEvent(type, data); } catch (_) {}
    }
  },

  logOfflineReport(report) {
    if (!report || !currentPlayer) return;
    const lines = Array.isArray(report.lines) ? report.lines : [];
    lines.forEach((line, i) => {
      this.addActivity(line, {
        type: i === 0 ? 'offline' : 'offline_detail',
        offlineMs: report.offlineMs,
        idx: i
      });
    });
    if (typeof recordGameEvent === 'function') {
      try {
        recordGameEvent('offline_summary', {
          offlineMs: report.offlineMs,
          offlineText: report.offlineText,
          from: report.from,
          to: report.to,
          rainHits: report.rainHits,
          rainChance: report.rainChance,
          rainWatered: report.rainWatered,
          fairyCycles: report.fairyCycles,
          totalHarvest: report.totalHarvest,
          totalPlant: report.totalPlant,
          totalYieldAmount: report.totalYieldAmount,
          harvestByPlant: report.harvestByPlant || null,
          helperBuys: report.helperBuys,
          fairyActive: report.fairyActive,
          nycActive: report.nycActive,
          helperActive: report.helperActive,
          lines: lines.slice(0, 20)
        });
      } catch (_) {}
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
    if (currentPlayer.coins < cost) return { ok: false, msg: 'Không đủ tiền! Cần ' + cost + '🪙' };
    currentPlayer.coins -= cost;
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
    if ((currentPlayer.coins || 0) < price) return { ok: false, msg: 'Không đủ xu!' };
    currentPlayer.coins -= price;
    currentPlayer.companions[id] = { id, boughtAt: (typeof nowMs === 'function' ? nowMs() : Date.now()) };
    if (!currentPlayer.companionId) currentPlayer.companionId = id;
    this.addActivity('Mua thú cưng ' + item.name + ' (-' + price + '🪙)');
    currentPlayer.stats = currentPlayer.stats || {};
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + price;
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
    if ((currentPlayer.coins || 0) < price) return { ok: false, msg: 'Không đủ xu!' };
    currentPlayer.coins -= price;
    currentPlayer.avatarFrames[frameId] = { id: frameId, boughtAt: (typeof nowMs === 'function' ? nowMs() : Date.now()) };
    if (!currentPlayer.avatarFrameId) currentPlayer.avatarFrameId = frameId;
    this.addActivity('Mua khung avatar ' + frame.name + ' (-' + price + '🪙)');
    currentPlayer.stats = currentPlayer.stats || {};
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + price;
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
    if ((currentPlayer.coins || 0) < pet.price) return { ok: false, msg: 'Không đủ xu!' };
    currentPlayer.coins -= pet.price;
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + pet.price;
    currentPlayer.pets[petId] = { id: petId, boughtAt: (typeof nowMs==="function"?nowMs():Date.now()), active: true };
    this.addActivity(`Nhận pet ${pet.name} (-${pet.price}🪙)`);
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

  async cookRecipe(recipeId, times = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const recipe = this.getRecipe(recipeId);
    if (!recipe) return { ok: false, msg: 'Không có công thức!' };
    times = Math.max(1, Math.min(99, Math.floor(Number(times) || 1)));
    this.normalizeHarvestBags();
    const inv = currentPlayer.inventory || (currentPlayer.inventory = {});
    const harvest = inv.harvest || (inv.harvest = {});
    for (const ing of recipe.ingredients) {
      const have = harvest[ing.plantId] || 0;
      const need = (ing.qty || 1) * times;
      if (have < need) {
        const pl = this.getPlant(ing.plantId);
        return { ok: false, msg: `Thiếu ${pl ? pl.name : ing.plantId} (cần ${need}, có ${have})` };
      }
    }
    for (const ing of recipe.ingredients) {
      const need = (ing.qty || 1) * times;
      harvest[ing.plantId] = (harvest[ing.plantId] || 0) - need;
      if (harvest[ing.plantId] <= 0) delete harvest[ing.plantId];
    }
    if (!inv.dishes) inv.dishes = {};
    inv.dishes[recipe.id] = (inv.dishes[recipe.id] || 0) + times;
    const xpGain = (recipe.xp || 1) * times;
    currentPlayer.xp = (currentPlayer.xp || 0) + xpGain;
    this.addActivity(`Nấu ${times}× ${recipe.name}`);
    await savePlayer();
    return { ok: true, msg: `Đã nấu ${times}× ${recipe.icon} ${recipe.name}! +${xpGain} XP` };
  },

  async sellDish(recipeId, qty = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const recipe = this.getRecipe(recipeId);
    if (!recipe) return { ok: false, msg: 'Không có món!' };
    if (qty === 'all' || qty === -1) {
      qty = (currentPlayer.inventory && currentPlayer.inventory.dishes && currentPlayer.inventory.dishes[recipeId]) || 0;
    } else {
      qty = Math.max(0, Math.floor(Number(qty) || 0));
    }
    const have = (currentPlayer.inventory && currentPlayer.inventory.dishes && currentPlayer.inventory.dishes[recipeId]) || 0;
    if (qty < 1 || have < qty) return { ok: false, msg: 'Không đủ món để bán!' };
    const gain = (recipe.sellPrice || 1) * qty;
    currentPlayer.inventory.dishes[recipeId] = have - qty;
    if (currentPlayer.inventory.dishes[recipeId] <= 0) delete currentPlayer.inventory.dishes[recipeId];
    currentPlayer.coins = (currentPlayer.coins || 0) + gain;
    currentPlayer.stats.earned = (currentPlayer.stats.earned || 0) + gain;
    this.addActivity(`Bán ${qty}× ${recipe.name} (+${gain}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Đã bán ${qty}× ${recipe.name} (+${gain}🪙)` };
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
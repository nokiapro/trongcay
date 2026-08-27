// ===== GAME LOGIC (Firebase) =====

const Game = {
  // Rain state (client)
  raining: false,
  rainUntil: 0,
  rainBoostPlots: {}, // plotId -> boost applied

  getPlayer() { return currentPlayer; },
  getPlants() { return currentPlants; },
  getPlant(id) { return currentPlants.find(p => p.id === id); },
  getFertilizer(id) { return DEFAULT_FERTILIZERS.find(f => f.id === id); },
  getFertilizers() { return DEFAULT_FERTILIZERS; },
  getProtect(id) { return DEFAULT_PROTECTS.find(p => p.id === id); },
  getProtects() { return DEFAULT_PROTECTS; },
  getFairyPacks() { return DEFAULT_FAIRY_PACKS; },
  getNycPacks() { return DEFAULT_NYC_PACKS; },
  getPets() { return typeof getPets === 'function' ? getPets() : (typeof DEFAULT_PETS !== 'undefined' ? DEFAULT_PETS : []); },
  getPet(id) { return this.getPets().find(p => p.id === id); },
  getRecipes() { return typeof getKitchenRecipes === 'function' ? getKitchenRecipes() : []; },
  getRecipe(id) { return this.getRecipes().find(r => r.id === id); },
  getSettings() { return currentSettings; },

  /** Mỗi vườn tối đa 99 ô; đủ 99 ô → mở vườn mới */
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
    if (!Array.isArray(currentPlayer.gardens) || !currentPlayer.gardens.length) {
      let plots = currentPlayer.plots;
      if (!Array.isArray(plots)) plots = Object.values(plots || {});
      if (!plots.length) plots = this.makeEmptyPlots();
      // chuẩn hóa id
      plots = plots.map((p, i) => ({ ...(p || {}), id: (p && typeof p.id === 'number') ? p.id : i }));
      currentPlayer.gardens = [plots];
    } else {
      currentPlayer.gardens = currentPlayer.gardens.map((g, gi) => {
        let plots = Array.isArray(g) ? g : (g && Array.isArray(g.plots) ? g.plots : []);
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
    // Đồng bộ plots = vườn đang xem (code cũ vẫn dùng currentPlayer.plots)
    currentPlayer.plots = currentPlayer.gardens[currentPlayer.activeGarden];
  },

  /** Đủ 99 ô ở vườn bất kỳ → mở thêm 1 vườn trống phía sau */
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

  /** Chạy fn trên từng vườn (plots tạm trỏ đúng vườn) */
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


  /** Còn hạn gói Tiên (không phụ thuộc bật/tắt trong hồ sơ) */
  hasFairy() {
    return !!(currentPlayer && currentPlayer.fairyUntil && currentPlayer.fairyUntil > Date.now());
  },

  /** Tiên đang hoạt động: còn hạn + người chơi bật trong hồ sơ */
  isFairyActive() {
    return this.hasFairy() && this.getBuffPrefs().fairyEnabled;
  },

  /** Hiện icon tiên trong vườn (tách khỏi buff) */
  showFairyDecor() {
    return this.hasFairy() && !!this.getBuffPrefs().fairyVisual;
  },
  showNycDecor() {
    return this.hasNyc() && !!this.getBuffPrefs().nycVisual;
  },

  fairyRemainingSec() {
    if (!this.hasFairy()) return 0;
    return Math.max(0, Math.ceil((currentPlayer.fairyUntil - Date.now()) / 1000));
  },

  /** Còn hạn gói NYC */
  hasNyc() {
    return !!(currentPlayer && currentPlayer.nycUntil && currentPlayer.nycUntil > Date.now());
  },

  /** NYC đang hoạt động: còn hạn + bật trong hồ sơ */
  isNycActive() {
    return this.hasNyc() && this.getBuffPrefs().nycEnabled;
  },

  nycRemainingSec() {
    if (!this.hasNyc()) return 0;
    return Math.max(0, Math.ceil((currentPlayer.nycUntil - Date.now()) / 1000));
  },

  getBuffPrefs() {
    const def = { fairyEnabled: true, nycEnabled: true, fairyVisual: true, nycVisual: true };
    if (!currentPlayer) return { ...def };
    if (!currentPlayer.buffPrefs || typeof currentPlayer.buffPrefs !== 'object') {
      currentPlayer.buffPrefs = { ...def };
    }
    const p = currentPlayer.buffPrefs;
    if (typeof p.fairyEnabled !== 'boolean') p.fairyEnabled = true;
    if (typeof p.nycEnabled !== 'boolean') p.nycEnabled = true;
    if (typeof p.fairyVisual !== 'boolean') p.fairyVisual = true;
    if (typeof p.nycVisual !== 'boolean') p.nycVisual = true;
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
    const def = { plantId: null, seedKind: 'normal', mode: 'all', count: 1, gardensEnabled: {}, customName: '', gender: 'female' };
    if (!currentPlayer) return { ...def };
    if (!currentPlayer.nycConfig || typeof currentPlayer.nycConfig !== 'object') {
      currentPlayer.nycConfig = { ...def };
    }
    if (!currentPlayer.nycConfig.seedKind) currentPlayer.nycConfig.seedKind = 'normal';
    if (!currentPlayer.nycConfig.gardensEnabled || typeof currentPlayer.nycConfig.gardensEnabled !== 'object') {
      currentPlayer.nycConfig.gardensEnabled = {};
    }
    if (typeof currentPlayer.nycConfig.customName !== 'string') currentPlayer.nycConfig.customName = '';
    if (currentPlayer.nycConfig.gender !== 'male' && currentPlayer.nycConfig.gender !== 'female') {
      currentPlayer.nycConfig.gender = 'female';
    }
    return currentPlayer.nycConfig;
  },

  setNycConfig(cfg) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const ge = {};
    if (cfg && cfg.gardensEnabled && typeof cfg.gardensEnabled === 'object') {
      Object.keys(cfg.gardensEnabled).forEach(k => { ge[k] = !!cfg.gardensEnabled[k]; });
    }
    const next = {
      plantId: cfg.plantId || null,
      seedKind: cfg.seedKind === 'star' ? 'star' : 'normal',
      mode: cfg.mode === 'count' ? 'count' : 'all',
      count: Math.max(1, Math.min(99, parseInt(cfg.count, 10) || 1)),
      gardensEnabled: ge,
      customName: (cfg && typeof cfg.customName === 'string') ? cfg.customName.trim().slice(0, 20) : (this.getNycConfig().customName || ''),
      gender: cfg && cfg.gender === 'male' ? 'male' : 'female'
    };
    currentPlayer.nycConfig = next;
    return { ok: true, msg: 'Đã lưu cấu hình NYC!' };
  },

  /** Hệ số tốc độ ô: max(vĩnh viễn, tạm thời còn hạn) */
  getPlotSpeedMult(plot) {
    if (!plot) return 1;
    const now = Date.now();
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
    if (this.raining && Date.now() < this.rainUntil) {
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

  // Try trigger rain based on admin %
  // Try trigger rain based on admin % (1–50)
  tryTriggerRain() {
    if (this.raining && Date.now() < this.rainUntil) return false;
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

  /** Thời lượng mưa (ms) từ admin — mặc định 15s (0.25 phút) */
  getRainDurationMs() {
    let mins = (currentSettings && currentSettings.rainDurationMinutes) != null
      ? Number(currentSettings.rainDurationMinutes)
      : 0.25;
    if (!Number.isFinite(mins) || mins <= 0) mins = 0.25;
    // Giới hạn hợp lý: 5 giây – 120 phút
    mins = Math.max(5 / 60, Math.min(120, mins));
    return Math.round(mins * 60 * 1000);
  },

  startRain() {
    this.raining = true;
    const durationMs = this.getRainDurationMs();
    this.rainUntil = Date.now() + durationMs;
    this.rainCollectCount = 0;
    // Apply rain boost to growing plots (shorten remaining like light fertilizer)
    if (currentPlayer && currentPlayer.plots) {
      const plots = Array.isArray(currentPlayer.plots)
        ? currentPlayer.plots
        : Object.values(currentPlayer.plots || {});
      // Đồng bộ lại mảng nếu Firebase trả object
      if (!Array.isArray(currentPlayer.plots)) {
        currentPlayer.plots = plots;
      }
      plots.forEach((plot) => {
        if (plot && plot.plantId && plot.plantedAt && !this.isReady(plot)) {
          // Pull plantedAt forward by 12% of remaining effective time
          const remain = this.getRemainingSeconds(plot);
          const cut = Math.floor(remain * 0.12);
          if (cut > 0) {
            plot.plantedAt -= cut * 1000;
          }
        }
      });
      // Tiên (đang bật): khi mưa tưới đủ 3/3 TẤT CẢ các ô đang có cây
      if (this.isFairyActive()) {
        let wateredN = 0;
        plots.forEach(plot => {
          if (plot && plot.plantId) {
            plot.watered = true;
            plot.waterCount = 3;
            plot.lastWatered = Date.now();
            wateredN++;
          }
        });
        this.addActivity(`🧚 Tiên tưới khi mưa: ${wateredN} ô`);
      }
      savePlayer();
      if (typeof renderGarden === 'function') {
        try { renderGarden(); } catch (_) {}
      }
    }
    if (typeof showRainEffect === 'function') showRainEffect();
    const tip = this.isFairyActive()
      ? '🌧️ Mưa + Tiên tưới hết tất cả cây trong vườn!'
      : '🌧️ Mưa rồi! Chạm sâu / hạt rơi để nhặt thưởng!';
    if (typeof showToast === 'function') showToast(tip, 'success');
    setTimeout(() => {
      this.raining = false;
      if (typeof hideRainEffect === 'function') hideRainEffect();
    }, durationMs);
  },

  /** Nhặt vật phẩm khi mưa (sâu / hạt rơi). Tối đa 8 lần / trận mưa */
  async collectRainItem(kind) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    if (!this.raining || Date.now() >= this.rainUntil) {
      return { ok: false, msg: 'Mưa đã tạnh!' };
    }
    this.rainCollectCount = (this.rainCollectCount || 0) + 1;
    if (this.rainCollectCount > 8) {
      return { ok: false, msg: 'Đã nhặt hết trong trận mưa này!' };
    }
    currentPlayer.rainedCollectOnce = true;
    let msg = '';
    if (kind === 'bug') {
      const coins = 5 + Math.floor(Math.random() * 11); // 5–15
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

  /** Đồng bộ vườn công khai để bạn bè thăm (không lộ coin/kho) */
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
        updatedAt: Date.now()
      });
    } catch (e) {
      console.warn('publicGarden', e);
    }
  },

  /**
   * Tưới giúp bạn: 1 lần/bạn/ngày.
   * Ghi help vào gardenHelps; bạn nhận khi load game. Người giúp +coin +XP.
   */
  async helpWaterFriend(friendUid) {
    if (!currentUser || !currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    if (!friendUid || friendUid === currentUser.uid) return { ok: false, msg: 'Không hợp lệ!' };
    const today = new Date().toDateString();
    if (!currentPlayer.helpWaterLog) currentPlayer.helpWaterLog = {};
    if (currentPlayer.helpWaterLog[friendUid] === today) {
      return { ok: false, msg: 'Hôm nay bạn đã tưới giúp người này rồi!' };
    }
    try {
      await db.ref('gardenHelps/' + friendUid + '/' + currentUser.uid).set({
        from: currentUser.uid,
        fromName: currentPlayer.displayName || (currentPlayer.email || '').split('@')[0] || 'Bạn',
        at: Date.now(),
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

  /** Áp dụng các lượt tưới giúp đang chờ (khi load) */
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
        // Tìm 1 ô đang trồng, chưa chín, chưa tưới max
        const plot = currentPlayer.plots.find(p =>
          p && p.plantId && !this.isReady(p) && (p.waterCount || 0) < 3
        );
        if (plot) {
          plot.waterCount = (plot.waterCount || 0) + 1;
          plot.watered = true;
          plot.lastWatered = Date.now();
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

    // Ô đất đặc biệt / tăng tốc: lớn nhanh hơn
    const sm = this.getPlotSpeedMult(plot);
    if (sm > 1) t /= sm;

    return Math.max(20, t);
  },

  // Stage thresholds (seconds). Prefer plant.growStages scaled by effective/total ratio
  getStageThresholds(plot) {
    const plant = this.getPlant(plot.plantId);
    const effective = this.getEffectiveGrowTime(plot);
    if (plant && Array.isArray(plant.growStages) && plant.growStages.length >= 4) {
      const baseTotal = plant.growStages[3] || plant.growTime || effective;
      const ratio = effective / baseTotal;
      return plant.growStages.map(t => Math.max(1, t * ratio));
    }
    // fallback: stage1 cũng random-ish theo tổng
    const total = effective;
    const t1 = Math.max(60, total * 0.25);
    const t2 = Math.max(t1 + 60, total * 0.50);
    const t3 = Math.max(t2 + 60, total * 0.75);
    const t4 = total;
    return [t1, t2, t3, t4];
  },

  getElapsedEffective(plot) {
    if (!plot || !plot.plantId || !plot.plantedAt) return 0;
    return (Date.now() - plot.plantedAt) / 1000;
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
    // Luôn pad phút/giây → độ rộng ổn định, không đẩy layout
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
    currentPlayer.xp = (currentPlayer.xp || 0) + amount;
    while (currentPlayer.xp >= this.xpForLevel(currentPlayer.level || 1)) {
      currentPlayer.xp -= this.xpForLevel(currentPlayer.level || 1);
      currentPlayer.level = (currentPlayer.level || 1) + 1;
      currentPlayer.coins += 100 * currentPlayer.level;
      this.addActivity(`🎉 Lên cấp ${currentPlayer.level}! +${100 * currentPlayer.level}🪙`);
    }
  },

  /** Limited chỉ lấy từ data cây (admin / Firebase) — không hardcode */
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
    const now = Date.now();
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
      const left = Math.max(0, Number(plant.availableTo) - Date.now());
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
      currentPlayer.collection[plantId] = { at: Date.now() };
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
          currentPlayer.achievements[a.id] = Date.now();
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
    if (currentPlayer.coins < cost) return { ok: false, msg: 'Không đủ tiền!' };
    currentPlayer.coins -= cost;
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
    if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
    currentPlayer.inventory.seeds[plantId] = (currentPlayer.inventory.seeds[plantId] || 0) + qty;
    this.addActivity(`Mua ${qty} hạt ${plant.name} (-${cost}🪙)`);
    if (typeof Features !== 'undefined') Features.trackQuest('buySeed', qty);
    await savePlayer();
    return { ok: true, msg: `Đã mua ${qty} hạt ${plant.name}!` };
  },

  async buyFertilizer(fertId, qty = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const fert = this.getFertilizer(fertId);
    if (!fert) return { ok: false, msg: 'Không tìm thấy phân bón!' };
    const cost = fert.price * qty;
    if (currentPlayer.coins < cost) return { ok: false, msg: 'Không đủ tiền!' };
    currentPlayer.coins -= cost;
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
    if (!currentPlayer.inventory.fertilizers) currentPlayer.inventory.fertilizers = {};
    currentPlayer.inventory.fertilizers[fertId] = (currentPlayer.inventory.fertilizers[fertId] || 0) + qty;
    this.addActivity(`Mua ${qty} ${fert.name} (-${cost}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Đã mua ${qty} ${fert.name}!` };
  },

  async plantSeed(plotId, plantId, preferredKind) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plot = currentPlayer.plots[plotId];
    if (!plot) return { ok: false, msg: 'Ô đất không tồn tại!' };
    if (plot.plantId) return { ok: false, msg: 'Ô đất đã có cây!' };
    const normal = (currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[plantId]) || 0;
    const star = (currentPlayer.inventory.seedsStar && currentPlayer.inventory.seedsStar[plantId]) || 0;
    let usedStar = false;
    if (preferredKind === 'star') {
      if (star < 1) return { ok: false, msg: 'Không đủ hạt sao!' };
      currentPlayer.inventory.seedsStar[plantId]--;
      if (currentPlayer.inventory.seedsStar[plantId] <= 0) delete currentPlayer.inventory.seedsStar[plantId];
      usedStar = true;
    } else if (preferredKind === 'normal') {
      if (normal < 1) return { ok: false, msg: 'Không đủ hạt thường!' };
      currentPlayer.inventory.seeds[plantId]--;
      if (currentPlayer.inventory.seeds[plantId] <= 0) delete currentPlayer.inventory.seeds[plantId];
    } else {
      // Mặc định: ưu tiên sao nếu có
      if (normal + star < 1) return { ok: false, msg: 'Không đủ hạt giống!' };
      if (star > 0) {
        currentPlayer.inventory.seedsStar[plantId]--;
        if (currentPlayer.inventory.seedsStar[plantId] <= 0) delete currentPlayer.inventory.seedsStar[plantId];
        usedStar = true;
      } else {
        currentPlayer.inventory.seeds[plantId]--;
        if (currentPlayer.inventory.seeds[plantId] <= 0) delete currentPlayer.inventory.seeds[plantId];
      }
    }
    plot.plantId = plantId;
    plot.plantedAt = Date.now();
    plot.watered = false;
    plot.waterCount = 0;
    plot.lastWatered = null;
    plot.fertilizerId = null;
    plot.fertilizedAt = null;
    plot.seedStar = usedStar;
    // Tiên active: tưới ngay ô vừa trồng (nếu còn cần tưới)
    let fairyWatered = false;
    if (this.isFairyActive() && (plot.waterCount || 0) < 3) {
      plot.waterCount = 3;
      plot.watered = true;
      plot.lastWatered = Date.now();
      fairyWatered = true;
      if (typeof Features !== 'undefined' && Features.trackQuest) Features.trackQuest('water', 3);
    }
    currentPlayer.stats.planted = (currentPlayer.stats.planted || 0) + 1;
    const plant = this.getPlant(plantId);
    this.addActivity(`Trồng ${usedStar ? '⭐ ' : ''}${plant.name} vào ô #${plotId + 1}` + (fairyWatered ? ' · 🧚 Tiên tưới ngay' : ''));
    if (typeof Features !== 'undefined') Features.trackQuest('plant', 1);
    const ach = this.checkAchievements();
    await savePlayer();
    this.notifyAchievements(ach);
    return { ok: true, msg: `Đã trồng ${usedStar ? '⭐ ' : ''}${plant.name}!` + (fairyWatered ? ' 🧚 Tiên đã tưới.' : '') };
  },

  // Plant same seed on up to `count` empty plots — cùng plantedAt (đồng bộ giờ)
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
    const at = typeof sharedAt === 'number' ? sharedAt : Date.now();
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
      plot.plantedAt = at; // cùng 1 mốc giờ
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
    // Tưới liên tục, không chờ giữa các lần
    plot.watered = true;
    plot.waterCount = count + 1;
    plot.lastWatered = Date.now();
    this.addActivity(`Tưới nước ô #${plotId + 1} (${plot.waterCount}/3)`);
    if (typeof Features !== 'undefined') Features.trackQuest('water', 1);
    await savePlayer();
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
    plot.fertilizedAt = Date.now();
    this.addActivity(`Bón ${fert.name} ô #${plotId + 1}`);
    await savePlayer();
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
        // Tưới liên tục đến tối đa 3 lần / ô, không chờ
        while ((plot.waterCount || 0) < 3) {
          plot.watered = true;
          plot.waterCount = (plot.waterCount || 0) + 1;
          plot.lastWatered = Date.now();
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

  /** Bón phân tất cả ô đủ điều kiện, ưu tiên phân có yieldBonus cao nhất đang có */
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
      plot.fertilizedAt = Date.now();
      count++;
    }
    if (count > 0) {
      this.addActivity(`Bón phân ${count} ô đất`);
      await savePlayer();
    }
    return { ok: true, msg: count > 0 ? `Đã bón phân ${count} ô!` : 'Không có ô nào cần bón.' };
  },

  /** Giây còn lại đến khi hết hiệu lực nước/phân (mốc sớm nhất). null nếu không có boost */
  getBoostResetRemaining(plot) {
    if (!plot) return null;
    const THREE_H = 3 * 60 * 60 * 1000;
    const now = Date.now();
    let ends = [];
    if ((plot.waterCount || 0) > 0 && plot.lastWatered) {
      ends.push(plot.lastWatered + THREE_H);
    }
    if (plot.fertilizerId && plot.fertilizedAt) {
      ends.push(plot.fertilizedAt + THREE_H);
    }
    if (!ends.length) return null;
    const soonest = Math.min(...ends);
    return Math.max(0, Math.ceil((soonest - now) / 1000));
  },

  /** Chọn phân tốt nhất còn trong kho (theo timeReduce), hoặc null nếu hết */
  pickBestFertilizerFromBag() {
    if (!currentPlayer || !currentPlayer.inventory || !currentPlayer.inventory.fertilizers) return null;
    const bag = currentPlayer.inventory.fertilizers;
    let best = null;
    let bestReduce = -1;
    Object.keys(bag).forEach(id => {
      if ((bag[id] || 0) < 1) return;
      const fert = this.getFertilizer(id);
      if (!fert) return;
      const r = fert.timeReduce || 0;
      if (r > bestReduce) {
        bestReduce = r;
        best = fert;
      }
    });
    return best;
  },

  /** Giây còn lại đến lần Tiên chăm tiếp theo (chu kỳ 3 giờ). null nếu không có Tiên */
  getFairyCareRemainingSec() {
    if (!this.isFairyActive() || !currentPlayer) return null;
    const THREE_H = 3 * 60 * 60 * 1000;
    const last = currentPlayer.lastFairyCare || 0;
    const next = last + THREE_H;
    return Math.max(0, Math.ceil((next - Date.now()) / 1000));
  },

  /** Cấu hình mặc định Tiên chăm */
  defaultFairyConfig() {
    return {
      waterMode: 'all',      // all | count
      waterCount: 12,
      useFertilizer: true,
      fertSource: 'any',     // any = mọi loại trong kho (chọn tốt nhất) | specific = 1 loại
      fertId: null,
      fertMode: 'all',       // all | count — số ô bón
      fertCount: 12,
      gardensEnabled: {}     // { 0: true, 1: false, ... } thiếu key = bật
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
    if (typeof c.customName !== 'string') c.customName = '';
    if (c.gender !== 'male' && c.gender !== 'female') c.gender = 'female';
    return c;
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

  /** Vườn index có được Tiên chăm không (mặc định bật) */
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
    const ge = {};
    if (cfg && cfg.gardensEnabled && typeof cfg.gardensEnabled === 'object') {
      Object.keys(cfg.gardensEnabled).forEach(k => {
        ge[k] = !!cfg.gardensEnabled[k];
      });
    }
    const next = {
      waterMode: cfg && cfg.waterMode === 'count' ? 'count' : 'all',
      waterCount: Math.max(1, Math.min(99, parseInt(cfg && cfg.waterCount, 10) || def.waterCount)),
      useFertilizer: !!(cfg && cfg.useFertilizer),
      fertSource: cfg && cfg.fertSource === 'specific' ? 'specific' : 'any',
      fertId: (cfg && cfg.fertId) || null,
      fertMode: cfg && cfg.fertMode === 'count' ? 'count' : 'all',
      fertCount: Math.max(1, Math.min(99, parseInt(cfg && cfg.fertCount, 10) || def.fertCount)),
      gardensEnabled: ge,
      customName: (cfg && typeof cfg.customName === 'string') ? cfg.customName.trim().slice(0, 20) : (this.getFairyConfig().customName || ''),
      gender: cfg && cfg.gender === 'male' ? 'male' : 'female'
    };
    if (next.fertSource === 'specific' && next.fertId && !this.getFertilizer(next.fertId)) {
      return { ok: false, msg: 'Loại phân không hợp lệ!' };
    }
    currentPlayer.fairyConfig = next;
    const parts = [];
    parts.push(next.waterMode === 'all' ? 'tưới hết ô' : `tưới ${next.waterCount} ô`);
    if (next.useFertilizer) {
      const src = next.fertSource === 'specific'
        ? ((this.getFertilizer(next.fertId) || {}).name || next.fertId)
        : 'mọi loại trong kho';
      const n = next.fertMode === 'all' ? 'hết ô' : `${next.fertCount} ô`;
      parts.push(`bón ${src} · ${n} (trừ kho, hết thì dừng)`);
    } else {
      parts.push('không bón phân');
    }
    return { ok: true, msg: 'Đã lưu: ' + parts.join(' · ') };
  },

  /** Lấy 1 phân từ kho theo cấu hình; null nếu hết / không có */
  takeFertFromBagForFairy(cfg) {
    if (!currentPlayer.inventory.fertilizers) currentPlayer.inventory.fertilizers = {};
    const bag = currentPlayer.inventory.fertilizers;
    if (cfg.fertSource === 'specific') {
      const id = cfg.fertId;
      if (!id || (bag[id] || 0) < 1) return null;
      bag[id]--;
      if (bag[id] <= 0) delete bag[id];
      return id;
    }
    // any: chọn loại tốt nhất còn trong kho
    const best = this.pickBestFertilizerFromBag();
    if (!best) return null;
    bag[best.id]--;
    if (bag[best.id] <= 0) delete bag[best.id];
    return best.id;
  },

  /**
   * Tiên chăm 1 lần (chu kỳ 3 giờ) theo fairyConfig:
   * - Tưới: KHÔNG giới hạn — tưới hết mọi ô có cây (mọi nguồn / mọi vườn được bật)
   * - Bón: tắt / bất kỳ loại trong kho / 1 loại chỉ định; bón hết ô cần bón; trừ kho, hết thì dừng
   */
  runFairyCare(now = Date.now()) {
    if (!currentPlayer || !currentPlayer.plots) return false;
    let wateredN = 0;
    let fertN = 0;
    const plots = Array.isArray(currentPlayer.plots)
      ? currentPlayer.plots
      : Object.values(currentPlayer.plots || {});
    if (!Array.isArray(currentPlayer.plots)) currentPlayer.plots = plots;
    const cfg = this.getFairyConfig();

    // 1) Tưới hết — không giới hạn số ô
    const needWater = plots.filter(p => p && p.plantId);
    for (let i = 0; i < needWater.length; i++) {
      const plot = needWater[i];
      plot.waterCount = 3;
      plot.watered = true;
      plot.lastWatered = now;
      wateredN++;
    }

    // 2) Bón phân từ kho — chọn loại theo config; hết kho thì dừng, không bón nữa
    if (cfg.useFertilizer) {
      const needFert = plots.filter(p => p && p.plantId && !this.isReady(p) && !p.fertilizerId);
      for (let i = 0; i < needFert.length; i++) {
        const fertId = this.takeFertFromBagForFairy(cfg);
        if (!fertId) break; // hết phân → dừng
        const plot = needFert[i];
        plot.fertilizerId = fertId;
        plot.fertilizedAt = now;
        fertN++;
      }
    }

    currentPlayer.lastFairyCare = now;
    if (wateredN > 0 || fertN > 0) {
      let msg = `🧚 Tiên chăm: tưới ${wateredN} ô`;
      if (cfg.useFertilizer) msg += fertN ? `, bón ${fertN} ô` : ' (hết / không đủ phân)';
      else msg += ' (không bón phân)';
      this.addActivity(msg);
      // Tiên tưới cũng tính nhiệm vụ tưới (mỗi ô = 3 lần tưới)
      if (wateredN > 0 && typeof Features !== 'undefined' && Features.trackQuest) {
        Features.trackQuest('water', wateredN * 3);
      }
    }
    return wateredN > 0 || fertN > 0;
  },

  /**
   * Tiên tưới lại ô có cây ngay khi có lượt (trên currentPlayer.plots = vườn đang xét):
   * - chưa đủ 3/3 nước, HOẶC
   * - đã hết hạn 3 giờ kể từ lastWatered (đếm ngược về 0 = có 1 lượt tưới)
   * → tưới ngay 3/3 + lastWatered = now (không chờ chu kỳ lastFairyCare).
   * Không giới hạn số ô — cứ thấy ô cần tưới là tưới hết.
   * Gọi từ forEachGarden trong resetExpiredBoosts → mỗi vườn được xử lý riêng.
   */
  fairyEnsureWatered(now = Date.now()) {
    if (!this.isFairyActive() || !currentPlayer || !currentPlayer.plots) return false;
    const THREE_H = 3 * 60 * 60 * 1000;
    const plots = Array.isArray(currentPlayer.plots)
      ? currentPlayer.plots
      : Object.values(currentPlayer.plots || {});
    if (!Array.isArray(currentPlayer.plots)) currentPlayer.plots = plots;
    let n = 0;
    plots.forEach(plot => {
      if (!plot || !plot.plantId) return;
      const count = plot.waterCount || 0;
      const expired = count > 0 && plot.lastWatered && (now - plot.lastWatered >= THREE_H);
      const missing = count < 3;
      const never = count <= 0 || !plot.lastWatered;
      // Có lượt (hết 3h / thiếu / chưa tưới) → tưới ngay
      if (!expired && !missing && !never) return;
      plot.waterCount = 3;
      plot.watered = true;
      plot.lastWatered = now;
      n++;
    });
    // Tiên tưới lại cũng tính nhiệm vụ
    if (n > 0 && typeof Features !== 'undefined' && Features.trackQuest) {
      Features.trackQuest('water', n * 3);
    }
    return n > 0;
  },

  /**
   * Mỗi tick:
   * - Có Tiên: khi hết hạn nước (timer → 0) hoặc thiếu nước → Tiên tưới NGAY (không chờ);
   *   đủ 3 giờ kể từ lastFairyCare → chăm full (tưới + bón theo config), luôn cập nhật mốc 3h.
   * - Không Tiên: hết 3 giờ trên ô → mất nước/phân như cũ.
   */
  resetExpiredBoosts() {
    if (!currentPlayer) return false;
    this.ensureGardens();
    const THREE_H = 3 * 60 * 60 * 1000;
    const now = Date.now();
    let changed = false;
    const fairy = this.isFairyActive();

    // Xử lý trên từng vườn (Tiên chỉ chăm vườn được bật trong cấu hình)
    this.forEachGarden((plots, gi) => {
      const fairyHere = fairy && this.isFairyGardenEnabled(gi);
      if (fairyHere) {
        // Tiên thấy có lượt tưới (đếm ngược 3h = 0) → tưới ngay
        if (this.fairyEnsureWatered(now)) changed = true;
      } else {
        plots.forEach(plot => {
          if (!plot) return;
          if ((plot.waterCount || 0) > 0 && plot.lastWatered && (now - plot.lastWatered >= THREE_H)) {
            plot.waterCount = 0;
            plot.watered = false;
            plot.lastWatered = null;
            changed = true;
          }
          if (plot.fertilizerId && plot.fertilizedAt && (now - plot.fertilizedAt >= THREE_H)) {
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
      const last = currentPlayer.lastFairyCare || 0;
      // Có lượt chăm 3h → chạy ngay (tưới hết + bón theo lựa chọn, hết phân thì dừng)
      if (!last || (now - last >= THREE_H)) {
        this.forEachGarden((plots, gi) => {
          if (!this.isFairyGardenEnabled(gi)) return;
          this.runFairyCare(now);
        });
        currentPlayer.lastFairyCare = now;
        changed = true;
      }
    }
    return changed;
  },

  async buyProtect(protectId, qty = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const item = this.getProtect(protectId);
    if (!item) return { ok: false, msg: 'Không tìm thấy bảo hộ!' };
    qty = Math.max(1, Math.min(99, parseInt(qty, 10) || 1));
    const cost = item.price * qty;
    if (currentPlayer.coins < cost) return { ok: false, msg: 'Không đủ tiền!' };
    currentPlayer.coins -= cost;
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
    if (!currentPlayer.inventory.protects) currentPlayer.inventory.protects = {};
    currentPlayer.inventory.protects[protectId] = (currentPlayer.inventory.protects[protectId] || 0) + qty;
    this.addActivity(`Mua ${qty} ${item.name} (-${cost}🪙)`);
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
    const base = Math.max(Date.now(), currentPlayer.fairyUntil || 0);
    const wasActive = this.hasFairy();
    currentPlayer.fairyUntil = base + pack.days * 24 * 60 * 60 * 1000;
    // Mới kích hoạt / hết hạn trước đó: chăm ngay 1 lần rồi đếm 3 giờ
    if (!wasActive || !currentPlayer.lastFairyCare) {
      this.ensureGardens();
      const now = Date.now();
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
    const base = Math.max(Date.now(), currentPlayer.nycUntil || 0);
    const wasActive = this.hasNyc();
    currentPlayer.nycUntil = base + pack.days * 24 * 60 * 60 * 1000;
    if (!wasActive || !currentPlayer.lastNycCare) {
      await this.runNycCare(Date.now());
    }
    this.addActivity(`Mua ${pack.name} (-${pack.price}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Đã kích hoạt ${pack.name}! Còn ${this.formatTime(this.nycRemainingSec())}` };
  },

  /** Cửa sổ đồng bộ trong MỘT vườn: 10s cuối gom ô sắp chín rồi thu + trồng cùng lúc */
  nycSyncWindowSec: 10,

  /**
   * Trong plots hiện tại (1 vườn): có ô chín nhưng còn ô khác ≤10s → chờ gom batch vườn đó.
   */
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

  /**
   * NYC care cho ĐÚNG 1 vườn (currentPlayer.plots đã trỏ vườn đó).
   * - Vườn độc lập: không chờ / không dùng chung giờ với vườn khác
   * - Trong vườn: cửa sổ 10s → batch thu → trồng cùng plantedAt
   * - Ô còn >10s: để nguyên, xử lý batch sau
   */
  async runNycCare(now, gardenIndex) {
    if (!currentPlayer || !currentPlayer.plots) return false;
    // Mốc giờ riêng cho vườn này
    now = now || Date.now();
    const gLabel = (typeof gardenIndex === 'number') ? (gardenIndex + 1) : ((currentPlayer.activeGarden || 0) + 1);

    // Chỉ xét cửa sổ 10s trong vườn hiện tại
    if (this.nycShouldWaitForNearReady(currentPlayer.plots)) {
      return false;
    }

    let harvested = 0;
    let planted = 0;
    let totalAmount = 0;
    let totalXp = 0;

    // 1) Thu HẾT ô đã chín của vườn này (1 phát)
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

    // 2) Trồng lại chỉ trên ô trống của vườn này — cùng plantedAt
    const cfg = this.getNycConfig();
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
        `💔 NYC vườn ${gLabel}: thu ${harvested} ô` +
        (totalAmount ? ` (${totalAmount} sp)` : '') +
        (planted ? `, trồng ${planted} ô cùng giờ` : '')
      );
    }
    return harvested > 0 || planted > 0;
  },

  /** Vườn hiện tại (plots) có việc NYC không? */
  nycHasWork() {
    if (!this.isNycActive() || !currentPlayer || !currentPlayer.plots) return false;
    const win = this.nycSyncWindowSec || 10;
    for (const plot of currentPlayer.plots) {
      if (!plot || !plot.plantId || !plot.plantedAt) continue;
      if (this.isReady(plot)) return true;
      const remain = this.getRemainingSeconds(plot);
      if (remain > 0 && remain <= win) return true;
    }
    const cfg = this.getNycConfig();
    if (!cfg.plantId) return false;
    const kind = cfg.seedKind === 'star' ? 'star' : 'normal';
    const seeds = (currentPlayer.inventory && currentPlayer.inventory.seeds) || {};
    const stars = (currentPlayer.inventory && currentPlayer.inventory.seedsStar) || {};
    const have = kind === 'star' ? (stars[cfg.plantId] || 0) : (seeds[cfg.plantId] || 0);
    if (have < 1) return false;
    return currentPlayer.plots.some(p => p && !p.plantId);
  },

  /**
   * Tick NYC: mỗi vườn độc lập.
   * - Chỉ vườn được bật trong config
   * - Mỗi vườn: now riêng + cửa sổ 10s riêng + batch thu/trồng riêng
   * - Vườn còn 1 phút không bị vườn đã chín kéo theo
   */
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
        // Việc + cửa sổ 10s chỉ xét plots của vườn i
        if (this.nycHasWork()) {
          // Mốc giờ RIÊNG cho vườn này (không dùng chung với vườn khác)
          const gardenNow = Date.now();
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

  /**
   * Ghép 2 hạt thường → 1 hạt sao (sản lượng & giá bán cao hơn khi trồng).
   * protectId optional: tỉ lệ thành công = rate của bùa; không có bùa = 25%.
   * Thất bại: mất 1 hạt (giữ 1); có bùa vẫn mất bùa.
   */
  async mergeSeeds(plantId, protectId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plant = this.getPlant(plantId);
    if (!plant) return { ok: false, msg: 'Hạt không hợp lệ!' };
    if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
    if (!currentPlayer.inventory.seedsStar) currentPlayer.inventory.seedsStar = {};
    if (!currentPlayer.inventory.protects) currentPlayer.inventory.protects = {};
    const have = currentPlayer.inventory.seeds[plantId] || 0;
    if (have < 2) return { ok: false, msg: 'Cần ít nhất 2 hạt thường cùng loại!' };

    let rate = 25;
    let protect = null;
    if (protectId) {
      protect = this.getProtect(protectId);
      if (!protect) return { ok: false, msg: 'Bùa bảo hộ không hợp lệ!' };
      const ph = currentPlayer.inventory.protects[protectId] || 0;
      if (ph < 1) return { ok: false, msg: 'Không đủ bùa bảo hộ!' };
      rate = protect.rate;
    }

    currentPlayer.inventory.seeds[plantId] -= 2;
    if (currentPlayer.inventory.seeds[plantId] <= 0) delete currentPlayer.inventory.seeds[plantId];
    if (protect) {
      currentPlayer.inventory.protects[protectId]--;
      if (currentPlayer.inventory.protects[protectId] <= 0) delete currentPlayer.inventory.protects[protectId];
    }

    const roll = Math.random() * 100;
    const ok = roll < rate;
    if (ok) {
      currentPlayer.inventory.seedsStar[plantId] = (currentPlayer.inventory.seedsStar[plantId] || 0) + 1;
      this.addActivity(`Ghép thành công ⭐ ${plant.name} (${rate}%)`);
      await savePlayer();
      return { ok: true, success: true, msg: `✨ Thành công! Nhận 1 hạt sao ${plant.name} (tỉ lệ ${rate}%)` };
    }
    // Thất bại: hoàn 1 hạt
    currentPlayer.inventory.seeds[plantId] = (currentPlayer.inventory.seeds[plantId] || 0) + 1;
    this.addActivity(`Ghép thất bại ${plant.name} (roll ${Math.floor(roll)}/${rate})`);
    await savePlayer();
    return { ok: true, success: false, msg: `💥 Thất bại (${Math.floor(roll)}≥${rate}%). Mất 1 hạt` + (protect ? ' + bùa' : '') + '.' };
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
    const ach = this.checkAchievements();
    await savePlayer();
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

  /** Bán hạt giống từ kho. kind: 'normal' | 'star' | 'all' */
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

  /** kind: 'normal' | 'star' | 'bought' */
  /** Tách dữ liệu cũ: harvest từng gồm cả sao → tách ra harvest / harvestStar */
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
    const today = new Date().toDateString();
    if (currentPlayer.lastDaily === today) {
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
    return currentPlayer.lastDaily === new Date().toDateString();
  },

  emptyPlotCount() {
    if (!currentPlayer || !currentPlayer.plots) return 0;
    return currentPlayer.plots.filter(p => !p.plantId).length;
  },

  addActivity(text) {
    if (!currentPlayer) return;
    if (!currentPlayer.activity) currentPlayer.activity = [];
    currentPlayer.activity.unshift({ text, time: new Date().toLocaleString('vi-VN') });
    if (currentPlayer.activity.length > 30) currentPlayer.activity = currentPlayer.activity.slice(0, 30);
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


  /** Mua pet dạo vườn */
  async buyPet(petId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const pet = this.getPet(petId);
    if (!pet) return { ok: false, msg: 'Không tìm thấy pet!' };
    if (!currentPlayer.pets) currentPlayer.pets = {};
    if (currentPlayer.pets[petId]) return { ok: false, msg: 'Bạn đã sở hữu pet này!' };
    if ((currentPlayer.coins || 0) < pet.price) return { ok: false, msg: 'Không đủ xu!' };
    currentPlayer.coins -= pet.price;
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + pet.price;
    currentPlayer.pets[petId] = { id: petId, boughtAt: Date.now(), active: true };
    this.addActivity(`Nhận pet ${pet.name} (-${pet.price}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Đã mua ${pet.icon} ${pet.name}!` };
  },

  togglePet(petId, active) {
    if (!currentPlayer || !currentPlayer.pets || !currentPlayer.pets[petId]) return { ok: false, msg: 'Chưa có pet!' };
    currentPlayer.pets[petId].active = !!active;
    return { ok: true };
  },

  /** Pet nhặt xu rất hiếm — gọi định kỳ khi đang ở vườn */
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

  /** Nấu món — trừ harvest, cộng inventory.dishes */
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
        updatedAt: Date.now()
      });
    } catch (e) { console.warn('leaderboard', e); }
  }
};

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
  getSettings() { return currentSettings; },

  hasFairy() {
    return !!(currentPlayer && currentPlayer.fairyUntil && currentPlayer.fairyUntil > Date.now());
  },

  fairyRemainingSec() {
    if (!this.hasFairy()) return 0;
    return Math.max(0, Math.ceil((currentPlayer.fairyUntil - Date.now()) / 1000));
  },

  hasNyc() {
    return !!(currentPlayer && currentPlayer.nycUntil && currentPlayer.nycUntil > Date.now());
  },

  nycRemainingSec() {
    if (!this.hasNyc()) return 0;
    return Math.max(0, Math.ceil((currentPlayer.nycUntil - Date.now()) / 1000));
  },

  getNycConfig() {
    if (!currentPlayer) return { plantId: null, mode: 'all', count: 1 };
    if (!currentPlayer.nycConfig || typeof currentPlayer.nycConfig !== 'object') {
      currentPlayer.nycConfig = { plantId: null, mode: 'all', count: 1 };
    }
    return currentPlayer.nycConfig;
  },

  setNycConfig(cfg) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const next = {
      plantId: cfg.plantId || null,
      mode: cfg.mode === 'count' ? 'count' : 'all',
      count: Math.max(1, Math.min(99, parseInt(cfg.count, 10) || 1))
    };
    currentPlayer.nycConfig = next;
    return { ok: true, msg: 'Đã lưu cấu hình NYC!' };
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
  tryTriggerRain() {
    if (this.raining && Date.now() < this.rainUntil) return false;
    const chance = (currentSettings && currentSettings.rainChance) || 15;
    if (Math.random() * 100 < chance) {
      this.startRain();
      return true;
    }
    return false;
  },

  startRain() {
    this.raining = true;
    this.rainUntil = Date.now() + 15000; // 15s: animation + mini-game
    this.rainCollectCount = 0;
    // Apply rain boost to growing plots (shorten remaining like light fertilizer)
    if (currentPlayer && currentPlayer.plots) {
      currentPlayer.plots.forEach((plot, i) => {
        if (plot.plantId && plot.plantedAt && !this.isReady(plot)) {
          // Pull plantedAt forward by 12% of remaining effective time
          const remain = this.getRemainingSeconds(plot);
          const cut = Math.floor(remain * 0.12);
          if (cut > 0) {
            plot.plantedAt -= cut * 1000;
          }
        }
      });
      // Tiên tự chăm: khi mưa tưới đủ 3 lần các ô đang lớn
      if (this.hasFairy()) {
        currentPlayer.plots.forEach(plot => {
          if (plot && plot.plantId && !this.isReady(plot)) {
            plot.watered = true;
            plot.waterCount = 3;
            plot.lastWatered = Date.now();
          }
        });
        this.addActivity('🧚 Tiên tưới vườn khi mưa');
      }
      savePlayer();
    }
    if (typeof showRainEffect === 'function') showRainEffect();
    const tip = this.hasFairy()
      ? '🌧️ Mưa + Tiên đang chăm vườn!'
      : '🌧️ Mưa rồi! Chạm sâu / hạt rơi để nhặt thưởng!';
    if (typeof showToast === 'function') showToast(tip, 'success');
    setTimeout(() => {
      this.raining = false;
      if (typeof hideRainEffect === 'function') hideRainEffect();
    }, 15000);
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

    return Math.max(60, t);
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
    if (sec <= 0) return '0s';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
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

  /** Cây limited / sự kiện theo mùa (tháng 1–12) hoặc availableFrom/To (ms) */
  _builtinLimited: {
    'hoa-mai': { months: [1, 2, 12] },
    'hoa-dao': { months: [1, 2, 12] },
    'hoa-canh': { months: [1, 2] },
    'hoa-lan': { months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }
  },

  isPlantLimited(plant) {
    if (!plant) return false;
    if (plant.limited) return true;
    return !!this._builtinLimited[plant.id];
  },

  isPlantAvailable(plant) {
    if (!plant) return false;
    if (!this.isPlantLimited(plant)) return true;
    const now = Date.now();
    if (plant.availableFrom && now < Number(plant.availableFrom)) return false;
    if (plant.availableTo && now > Number(plant.availableTo)) return false;
    let months = plant.availableMonths;
    if ((!months || !months.length) && this._builtinLimited[plant.id]) {
      months = this._builtinLimited[plant.id].months;
    }
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
    const months = plant.availableMonths || (this._builtinLimited[plant.id] && this._builtinLimited[plant.id].months);
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

  async plantSeed(plotId, plantId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plot = currentPlayer.plots[plotId];
    if (!plot) return { ok: false, msg: 'Ô đất không tồn tại!' };
    if (plot.plantId) return { ok: false, msg: 'Ô đất đã có cây!' };
    const normal = (currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[plantId]) || 0;
    const star = (currentPlayer.inventory.seedsStar && currentPlayer.inventory.seedsStar[plantId]) || 0;
    if (normal + star < 1) return { ok: false, msg: 'Không đủ hạt giống!' };
    // Ưu tiên dùng hạt sao nếu có
    let usedStar = false;
    if (star > 0) {
      currentPlayer.inventory.seedsStar[plantId]--;
      if (currentPlayer.inventory.seedsStar[plantId] <= 0) delete currentPlayer.inventory.seedsStar[plantId];
      usedStar = true;
    } else {
      currentPlayer.inventory.seeds[plantId]--;
      if (currentPlayer.inventory.seeds[plantId] <= 0) delete currentPlayer.inventory.seeds[plantId];
    }
    plot.plantId = plantId;
    plot.plantedAt = Date.now();
    plot.watered = false;
    plot.waterCount = 0;
    plot.lastWatered = null;
    plot.fertilizerId = null;
    plot.fertilizedAt = null;
    plot.seedStar = usedStar;
    currentPlayer.stats.planted = (currentPlayer.stats.planted || 0) + 1;
    const plant = this.getPlant(plantId);
    this.addActivity(`Trồng ${usedStar ? '⭐ ' : ''}${plant.name} vào ô #${plotId + 1}`);
    const ach = this.checkAchievements();
    await savePlayer();
    this.notifyAchievements(ach);
    return { ok: true, msg: `Đã trồng ${usedStar ? '⭐ ' : ''}${plant.name}!` };
  },

  // Plant same seed on up to `count` empty plots
  async plantMultiple(plantId, count) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const empty = [];
    currentPlayer.plots.forEach((p, i) => { if (!p.plantId) empty.push(i); });
    if (empty.length === 0) return { ok: false, msg: 'Không còn ô đất trống!' };
    const seedCount = ((currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[plantId]) || 0)
      + ((currentPlayer.inventory.seedsStar && currentPlayer.inventory.seedsStar[plantId]) || 0);
    if (seedCount < 1) return { ok: false, msg: 'Không đủ hạt giống!' };
    const n = Math.min(count, empty.length, seedCount);
    let planted = 0;
    for (let i = 0; i < n; i++) {
      const res = await this.plantSeed(empty[i], plantId);
      if (res.ok) planted++;
      else break;
    }
    return { ok: planted > 0, msg: planted > 0 ? `Đã trồng ${planted} ô!` : 'Không trồng được.' };
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
    if (!this.hasFairy() || !currentPlayer) return null;
    const THREE_H = 3 * 60 * 60 * 1000;
    const last = currentPlayer.lastFairyCare || 0;
    const next = last + THREE_H;
    return Math.max(0, Math.ceil((next - Date.now()) / 1000));
  },

  /**
   * Tiên chăm 1 lần: tưới đủ 3/3 mọi ô đang lớn; có phân trong kho thì bón.
   * Ghi lastFairyCare = now → đếm lại 3 giờ.
   */
  runFairyCare(now = Date.now()) {
    if (!currentPlayer || !currentPlayer.plots) return false;
    let wateredN = 0;
    let fertN = 0;
    if (!currentPlayer.inventory.fertilizers) currentPlayer.inventory.fertilizers = {};
    const bag = currentPlayer.inventory.fertilizers;

    currentPlayer.plots.forEach(plot => {
      if (!plot || !plot.plantId || this.isReady(plot)) return;
      plot.waterCount = 3;
      plot.watered = true;
      plot.lastWatered = now;
      wateredN++;

      let fertId = null;
      if (plot.fertilizerId && (bag[plot.fertilizerId] || 0) > 0) {
        fertId = plot.fertilizerId;
      } else {
        const best = this.pickBestFertilizerFromBag();
        if (best) fertId = best.id;
      }
      if (fertId) {
        bag[fertId]--;
        if (bag[fertId] <= 0) delete bag[fertId];
        plot.fertilizerId = fertId;
        plot.fertilizedAt = now;
        fertN++;
      }
    });

    currentPlayer.lastFairyCare = now;
    if (wateredN > 0 || fertN > 0) {
      this.addActivity(`🧚 Tiên chăm: tưới ${wateredN} ô` + (fertN ? `, bón ${fertN} ô` : ''));
    }
    return wateredN > 0 || fertN > 0;
  },

  /**
   * Mỗi tick:
   * - Có Tiên: đủ 3 giờ kể từ lastFairyCare → tưới toàn vườn + reset đồng hồ 3 giờ
   * - Không Tiên: hết 3 giờ trên ô → mất nước/phân như cũ
   */
  resetExpiredBoosts() {
    if (!currentPlayer || !currentPlayer.plots) return false;
    const THREE_H = 3 * 60 * 60 * 1000;
    const now = Date.now();
    let changed = false;
    const fairy = this.hasFairy();

    if (fairy) {
      const last = currentPlayer.lastFairyCare || 0;
      // Lần đầu mua Tiên (chưa chăm): chăm ngay; sau đó mỗi 3 giờ một lần
      if (!last || (now - last >= THREE_H)) {
        if (this.runFairyCare(now)) changed = true;
        else {
          // Không có ô nào cần chăm vẫn reset mốc để đếm 3h tiếp
          currentPlayer.lastFairyCare = now;
          changed = true;
        }
      }
    }

    // Không có Tiên: hết hạn thì xóa boost
    currentPlayer.plots.forEach(plot => {
      if (!plot) return;
      if (!fairy) {
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
      }
      if (plot.fertilizerId && !plot.fertilizedAt) {
        plot.fertilizedAt = now;
        changed = true;
      }
    });
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
      this.runFairyCare(Date.now());
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

  /**
   * Người Yêu Cũ: thu hoạch cây chín + trồng lại theo cấu hình hạt trong kho.
   * mode=all → trồng hết ô trống (đến khi hết hạt)
   * mode=count → trồng tối đa `count` ô mỗi lần chăm
   * Chạy mỗi 5 phút khi còn hạn.
   */
  async runNycCare(now) {
    if (!currentPlayer || !currentPlayer.plots) return false;
    now = now || Date.now();
    let harvested = 0;
    let planted = 0;

    // 1) Thu hoạch tất cả ô đã chín
    for (let i = 0; i < currentPlayer.plots.length; i++) {
      const plot = currentPlayer.plots[i];
      if (plot && plot.plantId && this.isReady(plot)) {
        const res = await this.harvestPlot(i);
        if (res.ok) harvested++;
      }
    }

    // 2) Trồng theo cấu hình
    const cfg = this.getNycConfig();
    if (cfg.plantId) {
      const seeds = (currentPlayer.inventory && currentPlayer.inventory.seeds) || {};
      const stars = (currentPlayer.inventory && currentPlayer.inventory.seedsStar) || {};
      const have = (seeds[cfg.plantId] || 0) + (stars[cfg.plantId] || 0);
      if (have > 0) {
        const empty = [];
        currentPlayer.plots.forEach((p, i) => { if (!p.plantId) empty.push(i); });
        let want = cfg.mode === 'count' ? Math.min(cfg.count || 1, empty.length, have) : Math.min(empty.length, have);
        if (want > 0) {
          const res = await this.plantMultiple(cfg.plantId, want);
          if (res.ok) {
            const m = (res.msg || '').match(/(\d+)/);
            planted = m ? parseInt(m[1], 10) : want;
          }
        }
      }
    }

    currentPlayer.lastNycCare = now;
    if (harvested > 0 || planted > 0) {
      this.addActivity(`💔 NYC: thu ${harvested} ô` + (planted ? `, trồng ${planted} ô` : ''));
    }
    return harvested > 0 || planted > 0;
  },

  /** Tick NYC: mỗi 5 phút một lần khi còn hạn */
  _nycBusy: false,
  async tickNycCare() {
    if (!this.hasNyc() || this._nycBusy) return false;
    const FIVE_MIN = 5 * 60 * 1000;
    const now = Date.now();
    const last = currentPlayer.lastNycCare || 0;
    if (!last || (now - last >= FIVE_MIN)) {
      this._nycBusy = true;
      // Đánh dấu mốc ngay để tránh gọi chồng chéo
      currentPlayer.lastNycCare = now;
      try {
        const did = await this.runNycCare(now);
        return did;
      } finally {
        this._nycBusy = false;
      }
    }
    return false;
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
    if (!currentPlayer.inventory.harvest) currentPlayer.inventory.harvest = {};
    // Hạt sao: thu hoạch ghi nhận bonus coin khi bán qua flag trên harvest? → nhân sell lúc bán phức tạp.
    // Cộng thêm harvest count; sellPrice boost: lưu harvestStar riêng
    const hid = plot.plantId;
    currentPlayer.inventory.harvest[hid] = (currentPlayer.inventory.harvest[hid] || 0) + amount;
    if (plot.seedStar) {
      if (!currentPlayer.inventory.harvestStar) currentPlayer.inventory.harvestStar = {};
      currentPlayer.inventory.harvestStar[hid] = (currentPlayer.inventory.harvestStar[hid] || 0) + amount;
    }
    currentPlayer.stats.harvested = (currentPlayer.stats.harvested || 0) + amount;
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
        if (!currentPlayer.inventory.harvest) currentPlayer.inventory.harvest = {};
        const hid = plot.plantId;
        currentPlayer.inventory.harvest[hid] = (currentPlayer.inventory.harvest[hid] || 0) + amount;
        if (plot.seedStar) {
          if (!currentPlayer.inventory.harvestStar) currentPlayer.inventory.harvestStar = {};
          currentPlayer.inventory.harvestStar[hid] = (currentPlayer.inventory.harvestStar[hid] || 0) + amount;
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
    const parts = [];
    if (soldN) parts.push(`${soldN} thường`);
    if (soldS) parts.push(`${soldS} ⭐`);
    this.addActivity(`Bán hạt ${plant.name} (${parts.join(', ')}) (+${earn}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Bán ${parts.join(' + ')} ${plant.name}, nhận ${earn}🪙!` };
  },

  async sellHarvest(plantId, qty = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const have = (currentPlayer.inventory.harvest && currentPlayer.inventory.harvest[plantId]) || 0;
    if (have < qty) return { ok: false, msg: 'Không đủ sản phẩm!' };
    const plant = this.getPlant(plantId);
    if (!plant) return { ok: false, msg: 'Sản phẩm không hợp lệ!' };
    const starHave = (currentPlayer.inventory.harvestStar && currentPlayer.inventory.harvestStar[plantId]) || 0;
    const starSell = Math.min(qty, starHave);
    const normalSell = qty - starSell;
    const earn = plant.sellPrice * normalSell + Math.ceil(plant.sellPrice * 1.5) * starSell;
    currentPlayer.inventory.harvest[plantId] -= qty;
    if (currentPlayer.inventory.harvest[plantId] <= 0) delete currentPlayer.inventory.harvest[plantId];
    if (starSell > 0) {
      currentPlayer.inventory.harvestStar[plantId] -= starSell;
      if (currentPlayer.inventory.harvestStar[plantId] <= 0) delete currentPlayer.inventory.harvestStar[plantId];
    }
    currentPlayer.coins += earn;
    currentPlayer.stats.earned = (currentPlayer.stats.earned || 0) + earn;
    this.addActivity(`Bán ${qty} ${plant.name} (+${earn}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Bán ${qty} ${plant.name}, nhận ${earn}🪙!` };
  },

  async sellAllHarvest() {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    let total = 0;
    const harvest = currentPlayer.inventory.harvest || {};
    const harvestStar = currentPlayer.inventory.harvestStar || {};
    Object.keys(harvest).forEach(id => {
      const plant = this.getPlant(id);
      if (!plant) return;
      const qty = harvest[id] || 0;
      const starQty = Math.min(qty, harvestStar[id] || 0);
      const normalQty = qty - starQty;
      const earn = plant.sellPrice * normalQty + Math.ceil(plant.sellPrice * 1.5) * starQty;
      total += earn;
      currentPlayer.stats.earned = (currentPlayer.stats.earned || 0) + earn;
    });
    currentPlayer.inventory.harvest = {};
    currentPlayer.inventory.harvestStar = {};
    currentPlayer.coins += total;
    if (total > 0) {
      this.addActivity(`Bán tất cả thu hoạch (+${total}🪙)`);
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
    if (currentPlayer.activity.length > 50) currentPlayer.activity = currentPlayer.activity.slice(0, 50);
  },

  totalFertilizerCount() {
    if (!currentPlayer || !currentPlayer.inventory.fertilizers) return 0;
    return Object.values(currentPlayer.inventory.fertilizers).reduce((a, b) => a + (b || 0), 0);
  },

  async buyPlot(qty = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    qty = Math.max(1, Math.min(20, parseInt(qty, 10) || 1));
    const price = (currentSettings && currentSettings.plotPrice) || 500;
    const cost = price * qty;
    if (currentPlayer.coins < cost) return { ok: false, msg: 'Không đủ tiền! Cần ' + cost + '🪙' };
    currentPlayer.coins -= cost;
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
    if (!Array.isArray(currentPlayer.plots)) currentPlayer.plots = [];
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
    this.addActivity(`Mua thêm ${qty} ô đất (-${cost}🪙)`);
    await savePlayer();
    return { ok: true, msg: `Đã mua ${qty} ô đất! Tổng ${currentPlayer.plots.length} ô.` };
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

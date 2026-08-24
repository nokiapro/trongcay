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
  getSettings() { return currentSettings; },

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
    this.rainUntil = Date.now() + 10000; // 10s animation
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
      savePlayer();
    }
    if (typeof showRainEffect === 'function') showRainEffect();
    if (typeof showToast === 'function') showToast('🌧️ Trời đổ mưa! Cây lớn nhanh hơn!', 'success');
    setTimeout(() => {
      this.raining = false;
      if (typeof hideRainEffect === 'function') hideRainEffect();
    }, 10000);
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
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    if (m >= 60) {
      const h = Math.floor(m / 60);
      return `${h}h ${m % 60}m`;
    }
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

  async buySeed(plantId, qty = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const plant = this.getPlant(plantId);
    if (!plant) return { ok: false, msg: 'Không tìm thấy cây!' };
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
    const seedCount = (currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[plantId]) || 0;
    if (seedCount < 1) return { ok: false, msg: 'Không đủ hạt giống!' };
    currentPlayer.inventory.seeds[plantId]--;
    if (currentPlayer.inventory.seeds[plantId] <= 0) delete currentPlayer.inventory.seeds[plantId];
    plot.plantId = plantId;
    plot.plantedAt = Date.now();
    plot.watered = false;
    plot.waterCount = 0;
    plot.lastWatered = null;
    plot.fertilizerId = null;
    currentPlayer.stats.planted = (currentPlayer.stats.planted || 0) + 1;
    const plant = this.getPlant(plantId);
    this.addActivity(`Trồng ${plant.name} vào ô #${plotId + 1}`);
    await savePlayer();
    return { ok: true, msg: `Đã trồng ${plant.name}!` };
  },

  // Plant same seed on up to `count` empty plots
  async plantMultiple(plantId, count) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const empty = [];
    currentPlayer.plots.forEach((p, i) => { if (!p.plantId) empty.push(i); });
    if (empty.length === 0) return { ok: false, msg: 'Không còn ô đất trống!' };
    const seedCount = (currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[plantId]) || 0;
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
    if (plot.lastWatered && Date.now() - plot.lastWatered < 8000) {
      return { ok: false, msg: 'Chờ một chút rồi tưới tiếp!' };
    }
    plot.watered = true;
    plot.waterCount = count + 1;
    plot.lastWatered = Date.now();
    this.addActivity(`Tưới nước ô #${plotId + 1} (${plot.waterCount}/3)`);
    await savePlayer();
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
    this.addActivity(`Bón ${fert.name} ô #${plotId + 1}`);
    await savePlayer();
    return { ok: true, msg: `Đã bón ${fert.name}!` };
  },

  async waterAll() {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    let count = 0;
    currentPlayer.plots.forEach((plot) => {
      if (plot.plantId && !this.isReady(plot) && (plot.waterCount || 0) < 3) {
        const canWater = !plot.lastWatered || Date.now() - plot.lastWatered >= 8000;
        if (canWater) {
          plot.watered = true;
          plot.waterCount = (plot.waterCount || 0) + 1;
          plot.lastWatered = Date.now();
          count++;
        }
      }
    });
    if (count > 0) {
      this.addActivity(`Tưới ${count} ô đất`);
      await savePlayer();
    }
    return { ok: true, msg: count > 0 ? `Đã tưới ${count} ô!` : 'Không có ô nào cần tưới.' };
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
    if (!currentPlayer.inventory.harvest) currentPlayer.inventory.harvest = {};
    currentPlayer.inventory.harvest[plot.plantId] = (currentPlayer.inventory.harvest[plot.plantId] || 0) + amount;
    currentPlayer.stats.harvested = (currentPlayer.stats.harvested || 0) + amount;
    const xpGain = plant.xp || 5;
    this.addXp(xpGain);
    plot.plantId = null;
    plot.plantedAt = null;
    plot.watered = false;
    plot.waterCount = 0;
    plot.lastWatered = null;
    plot.fertilizerId = null;
    this.addActivity(`Thu hoạch ${amount} ${plant.name} (+${xpGain} XP)`);
    await savePlayer();
    return { ok: true, msg: `Thu hoạch ${amount} ${plant.name}! +${xpGain} XP` };
  },

  async harvestAll() {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    let total = 0, totalXp = 0;
    currentPlayer.plots.forEach((plot) => {
      if (plot.plantId && this.isReady(plot)) {
        const plant = this.getPlant(plot.plantId);
        let amount = plant.yield;
        if (plot.fertilizerId) {
          const fert = this.getFertilizer(plot.fertilizerId);
          if (fert && fert.yieldBonus) amount = Math.ceil(amount * (1 + fert.yieldBonus));
        }
        if ((plot.waterCount || 0) >= 2) amount = Math.ceil(amount * 1.1);
        if (!currentPlayer.inventory.harvest) currentPlayer.inventory.harvest = {};
        currentPlayer.inventory.harvest[plot.plantId] = (currentPlayer.inventory.harvest[plot.plantId] || 0) + amount;
        currentPlayer.stats.harvested = (currentPlayer.stats.harvested || 0) + amount;
        total += amount;
        totalXp += plant.xp || 5;
        plot.plantId = null;
        plot.plantedAt = null;
        plot.watered = false;
        plot.waterCount = 0;
        plot.lastWatered = null;
        plot.fertilizerId = null;
      }
    });
    if (total > 0) {
      this.addXp(totalXp);
      this.addActivity(`Thu hoạch tất cả: ${total} sản phẩm (+${totalXp} XP)`);
      await savePlayer();
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
    this.addActivity(`Nhổ bỏ ${plant ? plant.name : 'cây'}`);
    await savePlayer();
    return { ok: true, msg: `Đã nhổ bỏ ${plant ? plant.name : 'cây'}.` };
  },

  async sellHarvest(plantId, qty = 1) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const have = (currentPlayer.inventory.harvest && currentPlayer.inventory.harvest[plantId]) || 0;
    if (have < qty) return { ok: false, msg: 'Không đủ sản phẩm!' };
    const plant = this.getPlant(plantId);
    const earn = plant.sellPrice * qty;
    currentPlayer.inventory.harvest[plantId] -= qty;
    if (currentPlayer.inventory.harvest[plantId] <= 0) delete currentPlayer.inventory.harvest[plantId];
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
    Object.keys(harvest).forEach(id => {
      const plant = this.getPlant(id);
      if (!plant) return;
      const qty = harvest[id];
      total += plant.sellPrice * qty;
      currentPlayer.stats.earned = (currentPlayer.stats.earned || 0) + plant.sellPrice * qty;
    });
    currentPlayer.inventory.harvest = {};
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
        updatedAt: Date.now()
      });
    } catch (e) { console.warn('leaderboard', e); }
  }
};

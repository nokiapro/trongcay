


const Features = {
  
  
  PLOT_UPGRADE_TIERS: [
    { mult: 1.0, price: 0 },
    { mult: 1.5, price: 500 },
    { mult: 2.0, price: 1200 },
    { mult: 3.0, price: 2800 },
    { mult: 5.0, price: 6000 },
    { mult: 8.0, price: 12000 },
    { mult: 10.0, price: 18000 },
    { mult: 15.0, price: 32000 },
    { mult: 20.0, price: 50000 },
    { mult: 25.0, price: 75000 },
    { mult: 30.0, price: 110000 },
    { mult: 40.0, price: 180000 },
    { mult: 50.0, price: 280000 }
  ],

  getPlotUpgradeCost(currentMult, targetMult) {
    const tiers = this.PLOT_UPGRADE_TIERS;
    const cur = tiers.find(t => t.mult === Number(currentMult)) || tiers.find(t => t.mult <= Number(currentMult)) || tiers[0];
    const tgt = tiers.find(t => t.mult === Number(targetMult));
    if (!tgt) return null;
    if (tgt.mult <= (Number(currentMult) || 1)) return null;
    
    const curPrice = (tiers.filter(t => t.mult <= (Number(currentMult) || 1)).pop() || tiers[0]).price;
    return Math.max(0, tgt.price - curPrice);
  },

  async upgradePlot(plotId, targetMult) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    if (!Array.isArray(currentPlayer.plots)) {
      currentPlayer.plots = Object.values(currentPlayer.plots || {});
    }
    const plot = currentPlayer.plots[plotId];
    if (!plot) return { ok: false, msg: 'Ô không tồn tại!' };
    const cur = Number(plot.specialMultPermanent) || Number(plot.specialMult) || 1;
    const tgt = Number(targetMult);
    if (!(tgt > cur)) return { ok: false, msg: 'Chọn mức cao hơn hiện tại!' };
    const cost = this.getPlotUpgradeCost(cur, tgt);
    if (cost == null) return { ok: false, msg: 'Mức không hợp lệ!' };
    if ((currentPlayer.coins || 0) < cost) return { ok: false, msg: 'Không đủ xu! Cần ' + cost.toLocaleString() + '🪙' };
    currentPlayer.coins -= cost;
    plot.specialMultPermanent = tgt;
    
    const now = Date.now();
    const tempOn = plot.specialMultUntil && plot.specialMultUntil > now;
    const tempM = Number(plot.specialMultTemp) || 0;
    plot.specialMult = Math.max(tgt, tempOn ? tempM : 0, 1);
    plot.specialName = 'Ô x' + tgt + ' (vĩnh viễn)';
    plot.specialId = 'upgrade-perm-' + tgt;
    currentPlayer.stats = currentPlayer.stats || {};
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + cost;
    if (typeof Game !== 'undefined' && Game.addActivity) {
      Game.addActivity('Nâng ô #' + (plotId + 1) + ' → x' + tgt + ' (-' + cost + '🪙)');
    }
    await savePlayer();
    if (typeof updateCoins === 'function') updateCoins();
    return { ok: true, msg: 'Ô #' + (plotId + 1) + ' đã lên x' + tgt + '!' };
  },

  



  async upgradeAllPlotsTo(targetMult = 50) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    if (typeof Game !== 'undefined' && Game.ensureGardens) {
      try { Game.ensureGardens(); Game.syncActiveGarden(); } catch (_) {}
    }
    const tgt = Number(targetMult) || 50;
    const tierOk = this.PLOT_UPGRADE_TIERS.some(t => t.mult === tgt);
    if (!tierOk) return { ok: false, msg: 'Mức không hợp lệ!' };

    const gardens = Array.isArray(currentPlayer.gardens) && currentPlayer.gardens.length
      ? currentPlayer.gardens
      : [currentPlayer.plots];
    const jobs = [];
    let totalCost = 0;
    gardens.forEach((g, gi) => {
      const plots = Array.isArray(g) ? g : Object.values(g || {});
      if (!Array.isArray(g)) gardens[gi] = plots;
      plots.forEach((plot, pi) => {
        if (!plot) return;
        const base = Number(plot.specialMultPermanent) || 1;
        if (base >= tgt) return;
        const cost = this.getPlotUpgradeCost(base, tgt);
        if (cost == null || cost < 0) return;
        jobs.push({ gi, pi, plot, base, cost });
        totalCost += cost;
      });
    });

    if (!jobs.length) {
      return { ok: true, msg: 'Tất cả ô đã đạt x' + tgt + ' (vĩnh viễn).', upgraded: 0, cost: 0 };
    }
    if ((currentPlayer.coins || 0) < totalCost) {
      return {
        ok: false,
        msg: 'Không đủ xu! Cần ' + totalCost.toLocaleString() + '🪙 để nâng ' + jobs.length + ' ô → x' + tgt,
        need: totalCost,
        count: jobs.length
      };
    }

    currentPlayer.coins -= totalCost;
    currentPlayer.stats = currentPlayer.stats || {};
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + totalCost;
    const now = Date.now();
    jobs.forEach(({ plot }) => {
      plot.specialMultPermanent = tgt;
      const tempOn = plot.specialMultUntil && plot.specialMultUntil > now;
      const tempM = Number(plot.specialMultTemp) || 0;
      plot.specialMult = Math.max(tgt, tempOn ? tempM : 0, 1);
      plot.specialName = 'Ô x' + tgt + ' (vĩnh viễn)';
      plot.specialId = 'upgrade-perm-' + tgt;
    });
    
    if (typeof Game !== 'undefined' && Game.syncActiveGarden) {
      try { Game.syncActiveGarden(); } catch (_) {}
    } else if (Array.isArray(currentPlayer.gardens) && typeof currentPlayer.activeGarden === 'number') {
      currentPlayer.plots = currentPlayer.gardens[currentPlayer.activeGarden] || currentPlayer.plots;
    }

    if (typeof Game !== 'undefined' && Game.addActivity) {
      Game.addActivity('Nâng ' + jobs.length + ' ô (mọi vườn) → x' + tgt + ' vĩnh viễn (-' + totalCost.toLocaleString() + '🪙)');
    }
    await savePlayer();
    if (typeof updateCoins === 'function') updateCoins();
    return {
      ok: true,
      msg: 'Đã nâng ' + jobs.length + ' ô → x' + tgt + ' vĩnh viễn (-' + totalCost.toLocaleString() + '🪙)!',
      upgraded: jobs.length,
      cost: totalCost
    };
  },

  

  
  PLOT_TEMP_BOOSTS: [
    { id: 'tb-15-1', name: 'x1.5 · 1 ngày', mult: 1.5, days: 1, price: 120 },
    { id: 'tb-15-3', name: 'x1.5 · 3 ngày', mult: 1.5, days: 3, price: 300 },
    { id: 'tb-15-7', name: 'x1.5 · 7 ngày', mult: 1.5, days: 7, price: 600 },
    { id: 'tb-2-1', name: 'x2 · 1 ngày', mult: 2, days: 1, price: 200 },
    { id: 'tb-2-3', name: 'x2 · 3 ngày', mult: 2, days: 3, price: 500 },
    { id: 'tb-2-7', name: 'x2 · 7 ngày', mult: 2, days: 7, price: 1000 },
    { id: 'tb-2-15', name: 'x2 · 15 ngày', mult: 2, days: 15, price: 1800 },
    { id: 'tb-2-30', name: 'x2 · 30 ngày', mult: 2, days: 30, price: 3000 },
    { id: 'tb-3-1', name: 'x3 · 1 ngày', mult: 3, days: 1, price: 350 },
    { id: 'tb-3-7', name: 'x3 · 7 ngày', mult: 3, days: 7, price: 1800 },
    { id: 'tb-3-30', name: 'x3 · 30 ngày', mult: 3, days: 30, price: 5500 },
    { id: 'tb-5-1', name: 'x5 · 1 ngày', mult: 5, days: 1, price: 700 },
    { id: 'tb-5-7', name: 'x5 · 7 ngày', mult: 5, days: 7, price: 3500 },
    { id: 'tb-5-30', name: 'x5 · 30 ngày', mult: 5, days: 30, price: 11000 },
    { id: 'tb-10-7', name: 'x10 · 7 ngày', mult: 10, days: 7, price: 8000 },
    { id: 'tb-10-30', name: 'x10 · 30 ngày', mult: 10, days: 30, price: 25000 }
  ],

  async buyTempPlotBoost(packId, plotId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const pack = this.PLOT_TEMP_BOOSTS.find(p => p.id === packId);
    if (!pack) return { ok: false, msg: 'Gói không tồn tại!' };
    if ((currentPlayer.coins || 0) < pack.price) return { ok: false, msg: 'Không đủ xu!' };
    if (!Array.isArray(currentPlayer.plots)) {
      currentPlayer.plots = Object.values(currentPlayer.plots || {});
    }
    plotId = parseInt(plotId, 10);
    const plot = currentPlayer.plots[plotId];
    if (!plot) return { ok: false, msg: 'Ô không tồn tại!' };
    currentPlayer.coins -= pack.price;
    const now = Date.now();
    const addMs = pack.days * 86400000;
    
    const active = plot.specialMultUntil && plot.specialMultUntil > now;
    if (active && Number(plot.specialMultTemp) === pack.mult) {
      plot.specialMultUntil = plot.specialMultUntil + addMs;
    } else {
      plot.specialMultTemp = pack.mult;
      plot.specialMultUntil = now + addMs;
    }
    plot.specialMult = Math.max(Number(plot.specialMultPermanent) || 1, pack.mult);
    plot.specialName = 'x' + pack.mult + ' · ' + pack.days + ' ngày';
    currentPlayer.stats = currentPlayer.stats || {};
    currentPlayer.stats.spent = (currentPlayer.stats.spent || 0) + pack.price;
    if (typeof Game !== 'undefined' && Game.addActivity) {
      Game.addActivity('Boost ô #' + (plotId + 1) + ' ' + pack.name + ' (-' + pack.price + '🪙)');
    }
    await savePlayer();
    if (typeof updateCoins === 'function') updateCoins();
    return { ok: true, msg: 'Ô #' + (plotId + 1) + ' → ' + pack.name + '!' };
  },

  
  DAILY_QUEST_DEFS: [
    { id: 'd_plant', title: 'Trồng 5 cây', type: 'plant', target: 5, reward: 80, xp: 10 },
    { id: 'd_water', title: 'Tưới 10 lần', type: 'water', target: 10, reward: 60, xp: 8 },
    { id: 'd_harvest', title: 'Thu hoạch 8 ô', type: 'harvest', target: 8, reward: 100, xp: 12 },
    { id: 'd_buy', title: 'Mua 3 hạt giống', type: 'buySeed', target: 3, reward: 50, xp: 6 }
  ],
  WEEKLY_QUEST_DEFS: [
    { id: 'w_plant', title: 'Trồng 40 cây trong tuần', type: 'plant', target: 40, reward: 500, xp: 50 },
    { id: 'w_harvest', title: 'Thu 50 ô trong tuần', type: 'harvest', target: 50, reward: 600, xp: 60 },
    { id: 'w_earn', title: 'Kiếm 2000 xu từ bán', type: 'earn', target: 2000, reward: 400, xp: 40 },
    { id: 'w_market', title: 'Giao dịch chợ 3 lần', type: 'market', target: 3, reward: 350, xp: 35 }
  ],

  dayKey(d) {
    
    if (typeof gameDateString === 'function') {
      const ms = (d instanceof Date) ? d.getTime() : (typeof nowMs === 'function' ? nowMs() : Date.now());
      return gameDateString(ms);
    }
    const x = d instanceof Date ? d : new Date();
    return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0');
  },
  weekKey(d) {
    
    if (typeof dateInGameTz === 'function') {
      const ms = (d instanceof Date) ? d.getTime() : (typeof nowMs === 'function' ? nowMs() : Date.now());
      const g = dateInGameTz(ms);
      
      const noon = Date.UTC(g.year, g.month - 1, g.day, 5, 0, 0); 
      const tmp = new Date(ms);
      
      const wd = new Date(ms).toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', weekday: 'short' });
      const map = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
      const off = map[wd] != null ? map[wd] : 0;
      const mondayMs = ms - off * 86400000;
      return this.dayKey(new Date(mondayMs));
    }
    const t = new Date(d || Date.now());
    t.setHours(0, 0, 0, 0);
    t.setDate(t.getDate() - ((t.getDay() + 6) % 7));
    return this.dayKey(t);
  },

  ensureQuests() {
    if (!currentPlayer) return;
    if (!currentPlayer.quests) currentPlayer.quests = {};
    const dk = this.dayKey();
    const wk = this.weekKey();
    if (currentPlayer.quests.dailyKey !== dk) {
      currentPlayer.quests.dailyKey = dk;
      currentPlayer.quests.daily = {};
      this.DAILY_QUEST_DEFS.forEach(q => {
        currentPlayer.quests.daily[q.id] = { progress: 0, claimed: false };
      });
    }
    if (currentPlayer.quests.weeklyKey !== wk) {
      currentPlayer.quests.weeklyKey = wk;
      currentPlayer.quests.weekly = {};
      this.WEEKLY_QUEST_DEFS.forEach(q => {
        currentPlayer.quests.weekly[q.id] = { progress: 0, claimed: false };
      });
    }
  },

  trackQuest(type, amount = 1) {
    if (!currentPlayer) return;
    this.ensureQuests();
    const bump = (bag, defs) => {
      defs.forEach(q => {
        if (q.type !== type) return;
        const st = bag[q.id];
        if (!st || st.claimed) return;
        st.progress = Math.min(q.target, (st.progress || 0) + amount);
      });
    };
    bump(currentPlayer.quests.daily || {}, this.DAILY_QUEST_DEFS);
    bump(currentPlayer.quests.weekly || {}, this.WEEKLY_QUEST_DEFS);
  },

  async claimQuest(scope, id) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    this.ensureQuests();
    const defs = scope === 'weekly' ? this.WEEKLY_QUEST_DEFS : this.DAILY_QUEST_DEFS;
    const def = defs.find(q => q.id === id);
    const st = (currentPlayer.quests[scope] || {})[id];
    if (!def || !st) return { ok: false, msg: 'Nhiệm vụ không tồn tại!' };
    if (st.claimed) return { ok: false, msg: 'Đã nhận thưởng rồi!' };
    if ((st.progress || 0) < def.target) return { ok: false, msg: 'Chưa hoàn thành!' };
    st.claimed = true;
    currentPlayer.coins = (currentPlayer.coins || 0) + def.reward;
    if (typeof Game !== 'undefined' && Game.addXp) Game.addXp(def.xp || 0);
    if (typeof Game !== 'undefined' && Game.addActivity) {
      Game.addActivity(`Nhiệm vụ ${scope === 'weekly' ? 'tuần' : 'ngày'}: ${def.title} +${def.reward}🪙`);
    }
    await savePlayer();
    if (typeof updateCoins === 'function') updateCoins();
    return { ok: true, msg: `Nhận ${def.reward}🪙 + ${def.xp || 0} XP!` };
  },

  
  BANK_TERMS: [
    { id: 'day', label: '1 ngày', days: 1, rate: 0.02 },
    { id: 'week', label: '1 tuần', days: 7, rate: 0.10 },
    { id: 'month', label: '1 tháng', days: 30, rate: 0.35 },
    { id: 'year', label: '1 năm', days: 365, rate: 2.0 }
  ],

  ensureBank() {
    if (!currentPlayer) return;
    if (!currentPlayer.bank) currentPlayer.bank = { deposits: [] };
    if (!Array.isArray(currentPlayer.bank.deposits)) currentPlayer.bank.deposits = [];
  },

  async bankDeposit(amount, termId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    amount = Math.floor(Number(amount) || 0);
    if (amount < 100) return { ok: false, msg: 'Tối thiểu 100 xu!' };
    if ((currentPlayer.coins || 0) < amount) return { ok: false, msg: 'Không đủ xu!' };
    const term = this.BANK_TERMS.find(t => t.id === termId);
    if (!term) return { ok: false, msg: 'Kỳ hạn không hợp lệ!' };
    this.ensureBank();
    if (currentPlayer.bank.deposits.length >= 10) return { ok: false, msg: 'Tối đa 10 sổ tiết kiệm!' };
    currentPlayer.coins -= amount;
    currentPlayer.bank.deposits.push({
      id: 'dep_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      amount,
      termId: term.id,
      rate: term.rate,
      days: term.days,
      startedAt: Date.now(),
      matureAt: Date.now() + term.days * 24 * 60 * 60 * 1000
    });
    if (typeof Game !== 'undefined' && Game.addActivity) {
      Game.addActivity(`Gửi ngân hàng ${amount}🪙 · ${term.label}`);
    }
    await savePlayer();
    if (typeof updateCoins === 'function') updateCoins();
    return { ok: true, msg: `Đã gửi ${amount}🪙 (${term.label}, lãi ${Math.round(term.rate * 100)}%)` };
  },

  
  async bankTopUp(depId, amount) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    amount = Math.floor(Number(amount) || 0);
    if (amount < 100) return { ok: false, msg: 'Nạp thêm tối thiểu 100 xu!' };
    if ((currentPlayer.coins || 0) < amount) return { ok: false, msg: 'Không đủ xu!' };
    this.ensureBank();
    const d = currentPlayer.bank.deposits.find(x => x.id === depId);
    if (!d) return { ok: false, msg: 'Không tìm thấy sổ!' };
    if (Date.now() >= d.matureAt) return { ok: false, msg: 'Sổ đã đáo hạn — hãy rút rồi gửi sổ mới!' };
    currentPlayer.coins -= amount;
    d.amount = (d.amount || 0) + amount;
    
    d.lastTopUpAt = Date.now();
    d.topUpTotal = (d.topUpTotal || 0) + amount;
    if (typeof Game !== 'undefined' && Game.addActivity) {
      Game.addActivity(`Nạp thêm ngân hàng +${amount}🪙 → gốc ${d.amount}🪙`);
    }
    await savePlayer();
    if (typeof updateCoins === 'function') updateCoins();
    return { ok: true, msg: `Đã nạp thêm ${amount}🪙. Gốc hiện tại: ${d.amount.toLocaleString()}🪙` };
  },

  async bankWithdraw(depId) {
    if (!currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    this.ensureBank();
    const idx = currentPlayer.bank.deposits.findIndex(d => d.id === depId);
    if (idx < 0) return { ok: false, msg: 'Không tìm thấy sổ!' };
    const d = currentPlayer.bank.deposits[idx];
    const now = Date.now();
    let payout = d.amount;
    if (now >= d.matureAt) {
      payout = Math.floor(d.amount * (1 + (d.rate || 0)));
    } else {
      
      payout = d.amount;
    }
    currentPlayer.bank.deposits.splice(idx, 1);
    currentPlayer.coins = (currentPlayer.coins || 0) + payout;
    if (typeof Game !== 'undefined' && Game.addActivity) {
      Game.addActivity(`Rút ngân hàng +${payout}🪙`);
    }
    await savePlayer();
    if (typeof updateCoins === 'function') updateCoins();
    const matured = now >= d.matureAt;
    return { ok: true, msg: matured ? `Đáo hạn +${payout}🪙 (gồm lãi)!` : `Rút sớm +${payout}🪙 (không lãi).` };
  },

  
  async redeemGiftCode(code) {
    if (!currentPlayer || !currentUser) return { ok: false, msg: 'Chưa đăng nhập!' };
    code = String(code || '').trim().toUpperCase();
    if (!code) return { ok: false, msg: 'Nhập mã!' };
    const ref = db.ref('giftCodes/' + code);
    const snap = await ref.once('value');
    if (!snap.exists()) return { ok: false, msg: 'Mã không tồn tại!' };
    const g = snap.val();
    if (g.expiresAt && Date.now() > g.expiresAt) return { ok: false, msg: 'Mã đã hết hạn!' };
    if (g.maxUses > 0 && (g.usedCount || 0) >= g.maxUses) return { ok: false, msg: 'Mã đã hết lượt!' };
    if (!currentPlayer.redeemedCodes) currentPlayer.redeemedCodes = {};
    if (currentPlayer.redeemedCodes[code]) return { ok: false, msg: 'Bạn đã dùng mã này rồi!' };
    const coins = Math.max(0, parseInt(g.coins, 10) || 0);
    const plotsAdd = Math.max(0, parseInt(g.plots, 10) || 0);
    const fertAdd = Math.max(0, parseInt(g.fert, 10) || 0);
    const fairyDays = Math.max(0, parseInt(g.fairyDays, 10) || 0);
    const nycDays = Math.max(0, parseInt(g.nycDays, 10) || 0);
    const parts = [];
    currentPlayer.coins = (currentPlayer.coins || 0) + coins;
    if (coins) parts.push('+' + coins + '🪙');
    if (plotsAdd > 0) {
      if (!Array.isArray(currentPlayer.plots)) currentPlayer.plots = Object.values(currentPlayer.plots || {});
      for (let i = 0; i < plotsAdd; i++) {
        currentPlayer.plots.push({
          id: currentPlayer.plots.length, plantId: null, plantedAt: null,
          watered: false, waterCount: 0, lastWatered: null, fertilizerId: null, fertilizedAt: null
        });
      }
      parts.push('+' + plotsAdd + ' ô đất');
    }
    if (fertAdd > 0) {
      if (!currentPlayer.inventory.fertilizers) currentPlayer.inventory.fertilizers = {};
      currentPlayer.inventory.fertilizers['phan-thuong'] =
        (currentPlayer.inventory.fertilizers['phan-thuong'] || 0) + fertAdd;
      parts.push('+' + fertAdd + ' phân thường');
    }
    if (fairyDays > 0) {
      const base = Math.max(Date.now(), currentPlayer.fairyUntil || 0);
      currentPlayer.fairyUntil = base + fairyDays * 86400000;
      parts.push('+' + fairyDays + ' ngày Tiên');
    }
    if (nycDays > 0) {
      const base = Math.max(Date.now(), currentPlayer.nycUntil || 0);
      currentPlayer.nycUntil = base + nycDays * 86400000;
      parts.push('+' + nycDays + ' ngày NYC');
    }
    if (g.seeds && typeof g.seeds === 'object') {
      if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
      Object.keys(g.seeds).forEach(pid => {
        const n = parseInt(g.seeds[pid], 10) || 0;
        if (n > 0) currentPlayer.inventory.seeds[pid] = (currentPlayer.inventory.seeds[pid] || 0) + n;
      });
    }
    currentPlayer.redeemedCodes[code] = Date.now();
    await ref.update({ usedCount: (g.usedCount || 0) + 1 });
    if (typeof Game !== 'undefined' && Game.addActivity) {
      Game.addActivity('Gift code ' + code + ': ' + (parts.join(', ') || 'OK'));
    }
    await savePlayer();
    if (typeof updateCoins === 'function') updateCoins();
    if (typeof updateFairyBadge === 'function') updateFairyBadge();
    if (typeof updateNycBadge === 'function') updateNycBadge();
    return { ok: true, msg: 'Đổi mã thành công! ' + parts.join(' · ') };
  },

  
  _marketBagKey(kind) {
    if (kind === 'seed') return 'seeds';
    if (kind === 'seedStar') return 'seedsStar';
    if (kind === 'harvest') return 'harvest';
    if (kind === 'harvestStar') return 'harvestStar';
    if (kind === 'harvestBought') return 'harvestBought';
    return null;
  },

  async listMarketItem(kind, itemId, qty, priceEach) {
    if (!currentUser || !currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    qty = Math.floor(Number(qty) || 0);
    priceEach = Math.floor(Number(priceEach) || 0);
    if (qty < 1) return { ok: false, msg: 'Số lượng không hợp lệ!' };
    if (priceEach < 1) return { ok: false, msg: 'Giá tối thiểu 1 xu!' };
    const bagKey = this._marketBagKey(kind);
    if (!bagKey) return { ok: false, msg: 'Loại không hỗ trợ!' };
    if (!currentPlayer.inventory[bagKey]) currentPlayer.inventory[bagKey] = {};
    const bag = currentPlayer.inventory[bagKey];
    if ((bag[itemId] || 0) < qty) return { ok: false, msg: 'Không đủ trong kho!' };
    // Trừ kho trước, nếu đăng Firebase fail → hoàn lại
    bag[itemId] -= qty;
    if (bag[itemId] <= 0) delete bag[itemId];
    const plant = typeof Game !== 'undefined' ? Game.getPlant(itemId) : null;
    const id = db.ref('market').push().key;
    try {
      await db.ref('market/' + id).set({
        id,
        sellerUid: currentUser.uid,
        sellerName: currentPlayer.displayName || (currentPlayer.email || '').split('@')[0] || 'Player',
        kind,
        itemId,
        itemName: plant ? plant.name : itemId,
        itemIcon: plant ? plant.icon : '🌱',
        qty,
        priceEach,
        total: qty * priceEach,
        createdAt: Date.now()
      });
    } catch (e) {
      // Hoàn kho khi đăng tin thất bại
      bag[itemId] = (bag[itemId] || 0) + qty;
      return { ok: false, msg: 'Đăng chợ thất bại: ' + (e.message || String(e)) };
    }
    this.trackQuest('market', 1);
    await savePlayer();
    return { ok: true, msg: 'Đã đăng bán trên chợ!' };
  },

  async buyMarketItem(listingId) {
    if (!currentUser || !currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const ref = db.ref('market/' + listingId);
    // Đọc trước để kiểm tra xu / không tự mua
    const snap = await ref.once('value');
    if (!snap.exists()) return { ok: false, msg: 'Tin đã hết!' };
    const L0 = snap.val();
    if (!L0) return { ok: false, msg: 'Tin đã hết!' };
    if (L0.sellerUid === currentUser.uid) return { ok: false, msg: 'Không mua tin của chính mình!' };
    const cost0 = (Number(L0.qty) || 0) * (Number(L0.priceEach) || 0);
    if (cost0 < 1) return { ok: false, msg: 'Tin không hợp lệ!' };
    if ((currentPlayer.coins || 0) < cost0) return { ok: false, msg: 'Không đủ xu!' };

    // Transaction xóa tin — tránh 2 người mua cùng 1 tin
    let L = null;
    try {
      const tx = await ref.transaction(cur => {
        if (cur == null) return; // abort — đã bán
        if (cur.sellerUid === currentUser.uid) return; // abort
        L = cur;
        return null; // xóa tin
      });
      if (!tx.committed || !L) {
        return { ok: false, msg: 'Tin đã hết hoặc vừa được người khác mua!' };
      }
    } catch (e) {
      console.warn('buyMarketItem tx', e);
      return { ok: false, msg: 'Lỗi giao dịch chợ!' };
    }

    const cost = (Number(L.qty) || 0) * (Number(L.priceEach) || 0);
    if ((currentPlayer.coins || 0) < cost) {
      // Hiếm: hết xu sau khi tx — cố gắng đăng lại tin để không mất hàng người bán
      try {
        await ref.set({ ...L, id: listingId });
      } catch (_) {}
      return { ok: false, msg: 'Không đủ xu!' };
    }

    currentPlayer.coins -= cost;
    // Hạt → kho hạt; nông sản (mọi loại) → harvestBought (đã mua từ chợ)
    if (L.kind === 'seed' || L.kind === 'seedStar') {
      const bagKey = L.kind === 'seedStar' ? 'seedsStar' : 'seeds';
      if (!currentPlayer.inventory[bagKey]) currentPlayer.inventory[bagKey] = {};
      currentPlayer.inventory[bagKey][L.itemId] = (currentPlayer.inventory[bagKey][L.itemId] || 0) + (Number(L.qty) || 0);
    } else {
      if (!currentPlayer.inventory.harvestBought) currentPlayer.inventory.harvestBought = {};
      currentPlayer.inventory.harvestBought[L.itemId] =
        (currentPlayer.inventory.harvestBought[L.itemId] || 0) + (Number(L.qty) || 0);
    }

    const buyerName = currentPlayer.displayName || (currentPlayer.email || '').split('@')[0] || 'Người mua';
    const payNote = `Chợ: bán ${L.qty} ${L.itemName || L.itemId} +${cost}🪙 (từ ${buyerName})`;
    try {
      const creditId = db.ref('marketCredits/' + L.sellerUid).push().key;
      await db.ref('marketCredits/' + L.sellerUid + '/' + creditId).set({
        id: creditId,
        fromUid: currentUser.uid,
        fromName: buyerName,
        toUid: L.sellerUid,
        amount: cost,
        qty: L.qty,
        itemId: L.itemId,
        itemName: L.itemName || L.itemId,
        note: payNote,
        at: Date.now(),
        listingId: listingId
      });
    } catch (e) {
      console.warn('marketCredits push', e);
      try {
        await db.ref('users/' + L.sellerUid + '/coins').transaction(cur =>
          (typeof cur === 'number' ? cur : 0) + cost
        );
        await db.ref('users/' + L.sellerUid + '/activity').transaction(act => {
          if (!Array.isArray(act)) act = act ? Object.values(act) : [];
          act.unshift({ text: payNote, time: new Date().toLocaleString('vi-VN') });
          if (act.length > 50) act = act.slice(0, 50);
          return act;
        });
      } catch (e2) {
        console.warn('pay seller fallback', e2);
      }
    }
    this.trackQuest('market', 1);
    if (typeof Game !== 'undefined' && Game.addActivity) {
      Game.addActivity(`Chợ: mua ${L.qty} ${L.itemName} -${cost}🪙`);
    }
    await savePlayer();
    if (typeof updateCoins === 'function') updateCoins();
    return { ok: true, msg: `Đã mua ${L.qty} ${L.itemName}!` };
  },

  



  async claimMarketCredits() {
    if (!currentUser || !currentPlayer || !db) return { ok: false, claimed: 0, amount: 0 };
    let claimed = 0;
    let total = 0;
    try {
      const snap = await db.ref('marketCredits/' + currentUser.uid).once('value');
      if (!snap.exists()) return { ok: true, claimed: 0, amount: 0 };
      const all = snap.val() || {};
      const ids = Object.keys(all);
      if (!ids.length) return { ok: true, claimed: 0, amount: 0 };
      if (!Array.isArray(currentPlayer.activity)) currentPlayer.activity = [];
      if (!currentPlayer._claimedMarketCreditIds) currentPlayer._claimedMarketCreditIds = {};

      for (const id of ids) {
        const c = all[id];
        if (!c || currentPlayer._claimedMarketCreditIds[id]) {
          try { await db.ref('marketCredits/' + currentUser.uid + '/' + id).remove(); } catch (_) {}
          continue;
        }
        const amount = Math.floor(Number(c.amount) || 0);
        if (amount > 0) {
          currentPlayer.coins = (Number(currentPlayer.coins) || 0) + amount;
          total += amount;
        }
        const note = c.note || `Chợ: bán hàng +${amount}🪙`;
        const time = c.at ? new Date(c.at).toLocaleString('vi-VN') : new Date().toLocaleString('vi-VN');
        const exists = currentPlayer.activity.some(a => a && a.text === note);
        if (!exists) {
          currentPlayer.activity.unshift({ text: note, time });
          if (currentPlayer.activity.length > 50) currentPlayer.activity = currentPlayer.activity.slice(0, 50);
        }
        currentPlayer._claimedMarketCreditIds[id] = true;
        claimed++;
        try { await db.ref('marketCredits/' + currentUser.uid + '/' + id).remove(); } catch (_) {}
      }
      const keys = Object.keys(currentPlayer._claimedMarketCreditIds);
      if (keys.length > 80) {
        const keep = keys.slice(-40);
        const next = {};
        keep.forEach(k => { next[k] = true; });
        currentPlayer._claimedMarketCreditIds = next;
      }
      if (claimed > 0) {
        if (typeof _playerDirty !== 'undefined') _playerDirty = true;
        if (typeof updateCoins === 'function') updateCoins();
        if (typeof Game !== 'undefined' && Game.addActivity && total > 0) {
          
        }
      }
      return { ok: true, claimed, amount: total };
    } catch (e) {
      console.warn('claimMarketCredits', e);
      return { ok: false, claimed: 0, amount: 0, msg: e.message || String(e) };
    }
  },

  async cancelMarketItem(listingId) {
    if (!currentUser || !currentPlayer) return { ok: false, msg: 'Chưa đăng nhập!' };
    const ref = db.ref('market/' + listingId);
    const snap = await ref.once('value');
    if (!snap.exists()) return { ok: false, msg: 'Tin không tồn tại!' };
    const L = snap.val();
    if (L.sellerUid !== currentUser.uid) return { ok: false, msg: 'Không phải tin của bạn!' };
    // Xóa tin bằng transaction — nếu đã bán thì không hoàn kho
    let removed = null;
    try {
      const tx = await ref.transaction(cur => {
        if (cur == null) return;
        if (cur.sellerUid !== currentUser.uid) return;
        removed = cur;
        return null;
      });
      if (!tx.committed || !removed) {
        return { ok: false, msg: 'Tin đã được mua hoặc không còn!' };
      }
    } catch (e) {
      return { ok: false, msg: 'Lỗi gỡ tin!' };
    }
    // Hoàn đúng túi gốc (lỗi cũ: mọi nông sản đều nhét vào harvestBought)
    const bagKey = this._marketBagKey(removed.kind) || (removed.kind === 'seed' ? 'seeds' : 'harvest');
    if (!currentPlayer.inventory[bagKey]) currentPlayer.inventory[bagKey] = {};
    currentPlayer.inventory[bagKey][removed.itemId] =
      (currentPlayer.inventory[bagKey][removed.itemId] || 0) + (Number(removed.qty) || 0);
    await savePlayer();
    return { ok: true, msg: 'Đã gỡ tin, hoàn kho!' };
  },

  
  async buySpecialPlot() {
    return { ok: false, msg: 'Đã chuyển sang nâng cấp ô trong vườn!' };
  },

  
  
  async checkAccessGates() {
    
    try {
      const snap = await db.ref('settings').once('value');
      const s = snap.val() || {};
      if (s.maintenanceOn && !(currentPlayer && currentPlayer.role === 'admin')) {
        return {
          blocked: true,
          type: 'maintenance',
          message: s.maintenanceMsg || 'Hệ thống đang bảo trì. Vui lòng quay lại sau.'
        };
      }
    } catch (_) {}
    if (currentPlayer && currentPlayer.banned) {
      return {
        blocked: true,
        type: 'banned',
        message: currentPlayer.banReason || 'Tài khoản của bạn đã bị khóa.'
      };
    }
    return { blocked: false };
  }
};
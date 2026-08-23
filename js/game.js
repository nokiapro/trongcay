// Core game actions
function playSound(type) {
  if (!state.sound) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'water') {
      osc.frequency.value = 520; gain.gain.value = 0.08;
      osc.start(); osc.stop(ctx.currentTime + 0.12);
    } else if (type === 'grow') {
      osc.frequency.value = 680; gain.gain.value = 0.1;
      osc.start(); osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.2);
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'harvest') {
      osc.frequency.value = 440; gain.gain.value = 0.1;
      osc.start(); osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'click') {
      osc.frequency.value = 300; gain.gain.value = 0.05;
      osc.start(); osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'reward') {
      osc.frequency.value = 600; gain.gain.value = 0.1;
      osc.start(); osc.frequency.linearRampToValueAtTime(900, ctx.currentTime + 0.15);
      osc.stop(ctx.currentTime + 0.2);
    }
  } catch (e) {}
}

function updateWeather() {
  if (state.weatherDate !== todayStr()) {
    state.weatherId = WEATHERS[Math.floor(Math.random() * WEATHERS.length)].id;
    state.weatherDate = todayStr();
    save();
  }
}

function updateSeason() {
  const m = new Date().getMonth() + 1;
  let t = 'Tưới nước mỗi ngày';
  if (m === 1 || m === 2) t = '🌸 Mùa Xuân';
  else if (m >= 3 && m <= 5) t = '☀️ Mùa Hè';
  else if (m >= 6 && m <= 8) t = '🍂 Mùa Thu';
  else t = '❄️ Mùa Đông';
  if (isEventActive()) t += ' • 🏮 Sự kiện Đèn Lồng';
  const el = document.getElementById('seasonText');
  if (el) el.textContent = t;
}

function checkMissedDays() {
  const tree = currentTree();
  if (!tree || !tree.lastWater) return;
  const gap = daysBetween(tree.lastWater, todayStr());
  const limits = { easy: 3, normal: 2, hard: 1 };
  if (gap > (limits[state.difficulty] || 2)) {
    state.slots[state.activeSlot] = null;
    state.streak = 0;
    save();
    setMsg('Cây đã chết vì bỏ quên… 😢', 'danger');
    render();
  }
}

function getDailyQuests() {
  const today = todayStr();
  if (!state.quests[today]) {
    state.quests[today] = [
      { id: 'water1', name: 'Tưới 1 lần', done: false, reward: { fert: 1 } },
      { id: 'minigame', name: 'Mini-game 10 điểm', done: false, reward: { fert: 2 } }
    ];
    save();
  }
  return state.quests[today];
}

function getWeeklyQuests() {
  const wid = weekId();
  if (!state.weeklyQuests[wid]) {
    state.weeklyQuests[wid] = [
      { id: 'w_water10', name: 'Tưới 10 lần trong tuần', target: 10, progress: 0, done: false, reward: { fert: 5, fruits: 3 } },
      { id: 'w_harvest3', name: 'Thu hoạch 3 lần', target: 3, progress: 0, done: false, reward: { fert: 3, fruits: 5 } },
      { id: 'w_mini5', name: 'Chơi mini-game 5 lần', target: 5, progress: 0, done: false, reward: { fert: 4, fruits: 2 } }
    ];
    save();
  }
  return state.weeklyQuests[wid];
}

function completeQuest(id) {
  const q = getDailyQuests().find(x => x.id === id);
  if (q && !q.done) {
    q.done = true;
    if (q.reward.fert) state.fertilizer += q.reward.fert;
    save();
    setMsg('Hoàn thành nhiệm vụ ngày! 🎁', 'success');
    render();
  }
}

function progressWeekly(id, amount = 1) {
  const list = getWeeklyQuests();
  const q = list.find(x => x.id === id);
  if (!q || q.done) return;
  q.progress = Math.min(q.target, (q.progress || 0) + amount);
  if (q.progress >= q.target) {
    q.done = true;
    if (q.reward.fert) state.fertilizer += q.reward.fert;
    if (q.reward.fruits) { state.fruits += q.reward.fruits; state.totalFruits += q.reward.fruits; }
    setMsg('Hoàn thành nhiệm vụ tuần! 🏆', 'success');
  }
  save();
}

function checkAchievements() {
  let neu = false;
  ACHIEVEMENTS.forEach(a => {
    if (!state.achievements.includes(a.id) && a.check(state)) {
      state.achievements.push(a.id);
      neu = true;
      setMsg('🏆 ' + a.name + '!', 'success');
    }
  });
  if (neu) save();
}

function plantTree(slotIdx, treeId) {
  if (state.slots[slotIdx] || !state.unlockedTrees.includes(treeId)) return;
  state.slots[slotIdx] = {
    type: treeId, waterCount: 0, lastWater: null, health: 100, readyHarvest: false
  };
  state.activeSlot = slotIdx;
  save();
  playSound('grow');
  setMsg('Đã trồng ' + getTreeType(treeId).name + '!', 'success');
  render();
}

function water() {
  const tree = currentTree();
  if (!tree) { setMsg('Hãy trồng cây trước!', 'warn'); return; }
  if (tree.lastWater === todayStr()) { setMsg('Hôm nay đã tưới rồi!', 'success'); return; }

  const prev = getStage(tree.waterCount).name;
  tree.waterCount += 1;
  tree.lastWater = todayStr();
  tree.health = Math.min(100, (tree.health || 100) + 20);
  state.totalWater += 1;
  state.weeklyWater = (state.weeklyWater || 0) + 1;

  if (state.lastWaterDate === yesterdayStr()) state.streak += 1;
  else state.streak = 1;
  state.bestStreak = Math.max(state.bestStreak, state.streak);
  state.lastWaterDate = todayStr();
  if (!state.history.includes(todayStr())) state.history.push(todayStr());

  TREE_TYPES.forEach(t => {
    if (!t.eventOnly && state.totalWater >= t.unlock && !state.unlockedTrees.includes(t.id)) {
      state.unlockedTrees.push(t.id);
      setMsg('🔓 Mở khóa: ' + t.name, 'success');
    }
  });
  if (STAGES.findIndex(s => s.name === getStage(tree.waterCount).name) >= 4) tree.readyHarvest = true;

  save();
  updateLeaderboardEntry();
  playSound('water');
  spawnDrops();
  progressWeekly('w_water10');

  const neu = getStage(tree.waterCount).name;
  setMsg(neu !== prev ? '🎉 Lên cấp: ' + neu : 'Tưới OK! Chuỗi ' + state.streak, 'success');
  completeQuest('water1');
  checkAchievements();
  render(true);
}

function useFertilizer() {
  const tree = currentTree();
  if (!tree || state.fertilizer <= 0) return;
  state.fertilizer -= 1;
  tree.waterCount += 2;
  tree.health = 100;
  save();
  playSound('grow');
  setMsg('Bón phân +2! 💩', 'success');
  render(true);
}

function harvest() {
  const tree = currentTree();
  if (!tree || !tree.readyHarvest) return;
  const gain = 1 + Math.floor(tree.waterCount / 20);
  state.fruits += gain;
  state.totalFruits += gain;
  // Đưa vào kho
  if (!state.inventory) state.inventory = {};
  state.inventory.fruit = (state.inventory.fruit || 0) + gain;
  // Random vật phẩm phụ (20%)
  if (Math.random() < 0.2) {
    const extras = ['seed', 'leaf', 'wood'];
    const ex = extras[Math.floor(Math.random() * extras.length)];
    state.inventory[ex] = (state.inventory[ex] || 0) + 1;
  }
  tree.readyHarvest = false;
  tree.waterCount = Math.max(0, tree.waterCount - 5);
  save();
  updateLeaderboardEntry();
  playSound('harvest');
  progressWeekly('w_harvest3');
  setMsg('Thu hoạch ' + gain + ' quả vào kho! 🍎', 'success');
  checkAchievements();
  render();
}

const MINI_DAILY_LIMIT = 3;
function getMiniPlaysLeft() {
  if (isAdmin) return Infinity;
  if (state.miniPlaysDate !== todayStr()) {
    state.miniPlaysToday = 0;
    state.miniPlaysDate = todayStr();
  }
  return Math.max(0, MINI_DAILY_LIMIT - (state.miniPlaysToday || 0));
}

let mgRunning = false, mgScore = 0, mgInterval = null;
async function startMiniGame() {
  if (mgRunning) return;
  const left = getMiniPlaysLeft();
  if (!isAdmin && left <= 0) {
    await Dialog.warn('Hết lượt mini-game hôm nay!\nThành viên: 3 lượt/ngày.\nQuay lại vào ngày mai.');
    return;
  }
  const area = document.getElementById('minigame-area');
  area.style.display = 'block';
  mgRunning = true;
  mgScore = 0;
  const leftLabel = isAdmin ? '∞' : left;
  area.innerHTML = '<div style="position:absolute;top:8px;left:0;right:0;text-align:center;font-weight:700;">Chạm giọt nước! <span id="mgScore">0</span> • 15s <span style="font-size:0.75rem;opacity:0.7">(còn ' + leftLabel + ' lượt)</span></div>';
  let t = 15;
  mgInterval = setInterval(() => {
    const drop = document.createElement('div');
    drop.className = 'drop-mg';
    drop.textContent = '💧';
    drop.style.left = (10 + Math.random() * 80) + '%';
    drop.style.top = '-30px';
    drop.onclick = e => {
      e.stopPropagation();
      mgScore++;
      const el = document.getElementById('mgScore');
      if (el) el.textContent = mgScore;
      drop.remove();
      playSound('click');
    };
    area.appendChild(drop);
    setTimeout(() => drop.remove(), 2200);
    t--;
    if (t <= 0) {
      clearInterval(mgInterval);
      mgRunning = false;
      area.style.display = 'none';
      if (!isAdmin) {
        if (state.miniPlaysDate !== todayStr()) {
          state.miniPlaysToday = 0;
          state.miniPlaysDate = todayStr();
        }
        state.miniPlaysToday = (state.miniPlaysToday || 0) + 1;
      }
      state.bestMini = Math.max(state.bestMini, mgScore);
      progressWeekly('w_mini5');
      if (mgScore >= 10) completeQuest('minigame');
      if (mgScore >= 5) {
        state.fertilizer += 1;
        setMsg('+1 phân! Điểm: ' + mgScore, 'success');
      } else setMsg('Điểm: ' + mgScore, 'warn');
      save();
      checkAchievements();
      render();
    }
  }, 1000);
}

/** Nhận 1 phân mỗi 3 giờ */
const FERT_CLAIM_COOLDOWN_MS = 3 * 60 * 60 * 1000;
function canClaimFert() {
  const last = state.lastFertClaim || 0;
  return Date.now() - last >= FERT_CLAIM_COOLDOWN_MS;
}
function fertClaimRemainingMs() {
  const last = state.lastFertClaim || 0;
  return Math.max(0, FERT_CLAIM_COOLDOWN_MS - (Date.now() - last));
}
async function claimTimedFert() {
  if (!canClaimFert()) {
    const ms = fertClaimRemainingMs();
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    await Dialog.warn('Chưa đến lúc nhận!\nCòn khoảng ' + h + ' giờ ' + m + ' phút.');
    return;
  }
  state.lastFertClaim = Date.now();
  state.fertilizer = (state.fertilizer || 0) + 1;
  save();
  render();
  if (typeof updateFertClaimBanner === 'function') updateFertClaimBanner();
  await Dialog.success('Đã nhận +1 phân bón!\nQuay lại sau 3 giờ để nhận tiếp.');
}

/** Kho: bán vật phẩm lấy xu */
const INV_META = {
  fruit: { name: 'Quả', emoji: '🍎', sell: 2 },
  seed: { name: 'Hạt giống', emoji: '🌱', sell: 3 },
  leaf: { name: 'Lá quý', emoji: '🍃', sell: 4 },
  wood: { name: 'Gỗ', emoji: '🪵', sell: 5 }
};
async function sellInventoryItem(id, amount) {
  if (!state.inventory) state.inventory = {};
  const have = state.inventory[id] || 0;
  const n = Math.min(amount || 1, have);
  if (n <= 0) {
    await Dialog.warn('Không đủ vật phẩm');
    return;
  }
  const meta = INV_META[id];
  if (!meta) return;
  state.inventory[id] = have - n;
  if (state.inventory[id] <= 0) delete state.inventory[id];
  if (id === 'fruit') state.fruits = Math.max(0, (state.fruits || 0) - n);
  const gain = meta.sell * n;
  state.coins = (state.coins || 0) + gain;
  save();
  render();
  await Dialog.success('Bán ' + n + ' ' + meta.name + ' → +' + gain + ' xu');
  openModal('inventory');
}
async function sellAllInventory() {
  if (!state.inventory) state.inventory = {};
  let total = 0;
  Object.keys(state.inventory).forEach(id => {
    const meta = INV_META[id];
    const n = state.inventory[id] || 0;
    if (!meta || n <= 0) return;
    total += meta.sell * n;
    if (id === 'fruit') state.fruits = Math.max(0, (state.fruits || 0) - n);
  });
  if (total <= 0) {
    await Dialog.warn('Kho trống');
    return;
  }
  state.inventory = {};
  state.coins = (state.coins || 0) + total;
  save();
  render();
  await Dialog.success('Đã bán hết kho → +' + total + ' xu');
  openModal('inventory');
}

function requestNotify() {
  if (!('Notification' in window)) { Dialog.warn('Trình duyệt không hỗ trợ thông báo'); return; }
  Notification.requestPermission().then(p => {
    if (p === 'granted') {
      state.notifyEnabled = true;
      save();
      setMsg('Đã bật nhắc!', 'success');
      new Notification('Cây Xanh', { body: 'Nhắc tưới mỗi ngày!' });
    }
  });
}

function shareProgress() {
  const text = `🌱 Cây Xanh\n${state.displayName}\nChuỗi tốt nhất: ${state.bestStreak}\nTổng tưới: ${state.totalWater}`;
  if (navigator.share) navigator.share({ title: 'Cây Xanh', text }).catch(() => {});
  else navigator.clipboard.writeText(text).then(() => setMsg('Đã copy!', 'success'));
}

function shopCurrencyOk(price) {
  return (state.coins || 0) >= price;
}
function spendShopCurrency(price) {
  state.coins = (state.coins || 0) - price;
}

function buyPot(id) {
  const pot = POTS.find(p => p.id === id);
  if (!pot || state.ownedPots.includes(id)) return;
  if (!shopCurrencyOk(pot.price)) { Dialog.warn('Không đủ xu (cần ' + pot.price + ')'); return; }
  spendShopCurrency(pot.price);
  state.ownedPots.push(id);
  save();
  setMsg('Đã mua ' + pot.name + '!', 'success');
  openModal('shop');
}

function equipPot(id) {
  if (!state.ownedPots.includes(id)) return;
  state.activePot = id;
  save();
  render();
  setMsg('Đã đổi chậu!', 'success');
}

function buyTheme(id) {
  const th = THEMES_SHOP.find(t => t.id === id);
  if (!th || state.ownedThemes.includes(id)) return;
  if (!shopCurrencyOk(th.price)) { Dialog.warn('Không đủ xu (cần ' + th.price + ')'); return; }
  spendShopCurrency(th.price);
  state.ownedThemes.push(id);
  save();
  setMsg('Đã mua theme ' + th.name + '!', 'success');
  openModal('shop');
}

function equipTheme(id) {
  if (!state.ownedThemes.includes(id)) return;
  state.theme = id;
  save();
  render();
}

async function buySupportItem(id) {
  const it = (typeof SUPPORT_ITEMS !== 'undefined' ? SUPPORT_ITEMS : []).find(x => x.id === id);
  if (!it) return;
  if (!shopCurrencyOk(it.price)) {
    await Dialog.warn('Không đủ xu (cần ' + it.price + ')');
    return;
  }
  spendShopCurrency(it.price);
  if (it.fert) state.fertilizer += it.fert;
  if (it.water) {
    const tree = currentTree();
    if (tree) tree.waterCount += it.water;
  }
  if (it.fruits) {
    state.fruits += it.fruits;
    state.totalFruits += it.fruits;
  }
  if (it.health) {
    const tree = currentTree();
    if (tree) tree.health = 100;
  }
  if (it.unlockRandom) {
    const locked = TREE_TYPES.filter(t => !t.eventOnly && !state.unlockedTrees.includes(t.id));
    if (locked.length) {
      const pick = locked[Math.floor(Math.random() * locked.length)];
      state.unlockedTrees.push(pick.id);
      await Dialog.success('Mở khóa ngẫu nhiên: ' + pick.name);
    }
  }
  if (it.weather) {
    state.weatherId = it.weather;
    state.weatherDate = todayStr();
  }
  save();
  render();
  setMsg('Đã mua ' + it.name + '!', 'success');
  openModal('shop');
}

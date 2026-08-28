/**
 * Vercel Serverless — chăm vườn offline KHÔNG cần Firebase Blaze
 *
 * 1. Tạo Service Account (free) trên Firebase Console
 * 2. Set env trên Vercel: FIREBASE_SERVICE_ACCOUNT, CARE_SECRET
 * 3. Gắn cron free (cron-job.org) gọi URL mỗi 2–5 phút
 */
const admin = require('firebase-admin');

const BOOST_MS = 3 * 60 * 60 * 1000;
const FALLBACK_FERTS = [
  { id: 'phan-thuong', price: 30, timeReduce: 0.10, yieldBonus: 0 },
  { id: 'phan-xanh', price: 50, timeReduce: 0.15, yieldBonus: 0.05 },
  { id: 'phan-vang', price: 80, timeReduce: 0.20, yieldBonus: 0.10 },
  { id: 'phan-do', price: 120, timeReduce: 0.22, yieldBonus: 0.15 },
  { id: 'phan-tim', price: 180, timeReduce: 0.25, yieldBonus: 0.20 },
  { id: 'phan-bac', price: 250, timeReduce: 0.28, yieldBonus: 0.25 },
  { id: 'phan-vang-kim', price: 350, timeReduce: 0.32, yieldBonus: 0.30 },
  { id: 'phan-kim-cuong', price: 500, timeReduce: 0.35, yieldBonus: 0.40 },
];

function initAdmin() {
  if (admin.apps.length) return admin.database();
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error('Missing FIREBASE_SERVICE_ACCOUNT env');
  const sa = typeof raw === 'string' ? JSON.parse(raw) : raw;
  admin.initializeApp({
    credential: admin.credential.cert(sa),
    databaseURL: process.env.FIREBASE_DATABASE_URL ||
      'https://trongcay-b417b-default-rtdb.asia-southeast1.firebasedatabase.app'
  });
  return admin.database();
}

function arrPlots(plots) {
  if (!plots) return [];
  if (Array.isArray(plots)) return plots;
  return Object.keys(plots).sort((a, b) => Number(a) - Number(b)).map(k => plots[k]);
}
function ensureGardens(player) {
  if (!player.gardens || !Array.isArray(player.gardens) || !player.gardens.length) {
    player.gardens = [arrPlots(player.plots)];
  } else {
    player.gardens = player.gardens.map(g => arrPlots(g));
  }
  const active = Math.min(player.activeGarden || 0, player.gardens.length - 1);
  player.activeGarden = active;
  player.plots = player.gardens[active];
}
function isFairyActive(p, now) {
  return p.fairyUntil > now && (p.buffPrefs || {}).fairyEnabled !== false;
}
function isNycActive(p, now) {
  return p.nycUntil > now && (p.buffPrefs || {}).nycEnabled !== false;
}
function isHelperActive(p, now) {
  return p.helperUntil > now && (p.buffPrefs || {}).helperEnabled !== false;
}
function gardenEnabled(cfg, idx) {
  const ge = (cfg && cfg.gardensEnabled) || {};
  if (ge[idx] === false || ge[String(idx)] === false) return false;
  return true;
}
function waterActive(plot, now) {
  if (!plot || !plot.lastWatered || !(plot.waterCount > 0)) return false;
  return plot.lastWatered + BOOST_MS > now;
}
function fertActive(plot, now) {
  if (!plot || !plot.fertilizerId || !plot.fertilizedAt) return false;
  return plot.fertilizedAt + BOOST_MS > now;
}
function takeFert(player, cfg, fertMap) {
  if (!player.inventory) player.inventory = {};
  if (!player.inventory.fertilizers) player.inventory.fertilizers = {};
  const bag = player.inventory.fertilizers;
  if (cfg && cfg.fertSource === 'specific' && cfg.fertId) {
    if ((bag[cfg.fertId] || 0) < 1) return null;
    bag[cfg.fertId]--;
    if (bag[cfg.fertId] <= 0) delete bag[cfg.fertId];
    return cfg.fertId;
  }
  let bestId = null, bestR = -1;
  Object.keys(bag).forEach(id => {
    if ((bag[id] || 0) < 1) return;
    const r = (fertMap[id] && fertMap[id].timeReduce) || 0;
    if (r > bestR) { bestR = r; bestId = id; }
  });
  if (!bestId) return null;
  bag[bestId]--;
  if (bag[bestId] <= 0) delete bag[bestId];
  return bestId;
}
function fairyCarePlots(plots, player, now, fertMap) {
  const cfg = player.fairyConfig || { useFertilizer: true, fertSource: 'any' };
  let changed = false;
  plots.forEach(plot => {
    if (!plot || !plot.plantId) return;
    const count = plot.waterCount || 0;
    if (!waterActive(plot, now) || count < 3 || !plot.lastWatered) {
      plot.waterCount = 3;
      plot.watered = true;
      plot.lastWatered = now;
      changed = true;
    }
    if (cfg.useFertilizer !== false && !fertActive(plot, now)) {
      if (plot.fertilizerId) { plot.fertilizerId = null; plot.fertilizedAt = null; }
      const fid = takeFert(player, cfg, fertMap);
      if (fid) { plot.fertilizerId = fid; plot.fertilizedAt = now; changed = true; }
    }
  });
  return changed;
}
function effectiveGrowSec(plot, plant, fertMap) {
  if (!plant) return 99999;
  let t = plant.growTime || 300;
  t *= (1 - Math.min(plot.waterCount || 0, 3) * 0.12);
  if (plot.fertilizerId && fertMap[plot.fertilizerId]) {
    t *= (1 - (fertMap[plot.fertilizerId].timeReduce || 0));
  }
  const sm = plot.specialMult || plot.speedMult || 1;
  if (sm > 1) t /= sm;
  return Math.max(20, t);
}
function isReady(plot, plant, fertMap, now) {
  if (!plot || !plot.plantId || !plot.plantedAt || !plant) return false;
  return (now - plot.plantedAt) / 1000 >= effectiveGrowSec(plot, plant, fertMap);
}
function harvestAmount(plot, plant, fertMap) {
  let amount = plant.yield || 1;
  if (plot.fertilizerId && fertMap[plot.fertilizerId] && fertMap[plot.fertilizerId].yieldBonus) {
    amount = Math.ceil(amount * (1 + fertMap[plot.fertilizerId].yieldBonus));
  }
  if ((plot.waterCount || 0) >= 2) amount = Math.ceil(amount * 1.1);
  if (plot.seedStar) amount = Math.ceil(amount * 1.5);
  return amount;
}
function clearPlot(plot) {
  plot.plantId = null; plot.plantedAt = null; plot.watered = false;
  plot.waterCount = 0; plot.lastWatered = null; plot.fertilizerId = null;
  plot.fertilizedAt = null; plot.seedStar = false;
}
function nycCareGarden(plots, player, plantsMap, fertMap, now) {
  const cfg = player.nycConfig || {};
  if (!cfg.plantId) return false;
  let changed = false;
  plots.forEach(plot => {
    if (!plot || !plot.plantId || !plot.plantedAt) return;
    const plant = plantsMap[plot.plantId];
    if (!isReady(plot, plant, fertMap, now)) return;
    const amount = harvestAmount(plot, plant, fertMap);
    if (!player.inventory) player.inventory = {};
    if (plot.seedStar) {
      if (!player.inventory.harvestStar) player.inventory.harvestStar = {};
      player.inventory.harvestStar[plot.plantId] = (player.inventory.harvestStar[plot.plantId] || 0) + amount;
    } else {
      if (!player.inventory.harvest) player.inventory.harvest = {};
      player.inventory.harvest[plot.plantId] = (player.inventory.harvest[plot.plantId] || 0) + amount;
    }
    player.stats = player.stats || {};
    player.stats.harvested = (player.stats.harvested || 0) + amount;
    clearPlot(plot);
    changed = true;
  });
  const kind = cfg.seedKind === 'star' ? 'star' : 'normal';
  if (!player.inventory.seeds) player.inventory.seeds = {};
  if (!player.inventory.seedsStar) player.inventory.seedsStar = {};
  const bag = kind === 'star' ? player.inventory.seedsStar : player.inventory.seeds;
  const plantId = cfg.plantId;
  const limit = cfg.mode === 'count' ? Math.max(1, parseInt(cfg.count, 10) || 1) : Infinity;
  let planted = 0;
  for (let i = 0; i < plots.length && planted < limit; i++) {
    const plot = plots[i];
    if (!plot || plot.plantId) continue;
    if ((bag[plantId] || 0) < 1) break;
    bag[plantId]--;
    if (bag[plantId] <= 0) delete bag[plantId];
    plot.plantId = plantId;
    plot.plantedAt = now;
    plot.seedStar = kind === 'star';
    plot.waterCount = 0; plot.watered = false; plot.lastWatered = null;
    plot.fertilizerId = null; plot.fertilizedAt = null;
    planted++;
    changed = true;
    player.stats = player.stats || {};
    player.stats.planted = (player.stats.planted || 0) + 1;
  }
  return changed;
}
function helperBuy(player, plantsMap, fertMap, now) {
  const rules = (player.helperConfig && player.helperConfig.rules) || [];
  if (!rules.length) return false;
  if (now - (player.lastHelperBuy || 0) < 12000) return false;
  if (!player.inventory) player.inventory = {};
  if (!player.inventory.seeds) player.inventory.seeds = {};
  if (!player.inventory.fertilizers) player.inventory.fertilizers = {};
  if (!player.inventory.protects) player.inventory.protects = {};
  let any = false, totalCost = 0;
  rules.forEach(r => {
    if (!r || r.enabled === false || !r.kind || !r.id) return;
    let have = 0;
    if (r.kind === 'seed') have = player.inventory.seeds[r.id] || 0;
    else if (r.kind === 'fert') have = player.inventory.fertilizers[r.id] || 0;
    else if (r.kind === 'protect') have = player.inventory.protects[r.id] || 0;
    else return;
    const minStock = Math.max(0, parseInt(r.minStock, 10) || 0);
    const buyQty = Math.max(1, Math.min(99, parseInt(r.buyQty, 10) || 1));
    if (have >= minStock) return;
    let unit = 0;
    if (r.kind === 'seed') unit = (plantsMap[r.id] && plantsMap[r.id].seedPrice) || 0;
    else if (r.kind === 'fert') unit = (fertMap[r.id] && fertMap[r.id].price) || 0;
    else if (r.kind === 'protect') {
      const m = String(r.id).match(/(\d+)/);
      unit = Math.max(20, (m ? parseInt(m[1], 10) : 50) * 8);
    }
    if (unit <= 0) return;
    const cost = unit * buyQty;
    if ((player.coins || 0) < cost) return;
    player.coins -= cost;
    totalCost += cost;
    player.stats = player.stats || {};
    player.stats.spent = (player.stats.spent || 0) + cost;
    if (r.kind === 'seed') player.inventory.seeds[r.id] = (player.inventory.seeds[r.id] || 0) + buyQty;
    else if (r.kind === 'fert') player.inventory.fertilizers[r.id] = (player.inventory.fertilizers[r.id] || 0) + buyQty;
    else player.inventory.protects[r.id] = (player.inventory.protects[r.id] || 0) + buyQty;
    any = true;
  });
  if (any) {
    player.lastHelperBuy = now;
    if (!Array.isArray(player.activity)) player.activity = [];
    player.activity.unshift({ t: now, msg: `💁 [Cron] Giúp việc mua (−${totalCost}🪙)` });
    player.activity = player.activity.slice(0, 30);
  }
  return any;
}
function processPlayer(player, plantsMap, fertMap, now) {
  if (!player || typeof player !== 'object') return false;
  ensureGardens(player);
  let changed = false;
  if (isFairyActive(player, now)) {
    const cfg = player.fairyConfig || {};
    player.gardens.forEach((plots, gi) => {
      if (!gardenEnabled(cfg, gi)) return;
      if (fairyCarePlots(plots, player, now, fertMap)) changed = true;
    });
    const last = player.lastFairyCare || 0;
    if (!last || now - last >= BOOST_MS) {
      player.lastFairyCare = now;
      changed = true;
    }
  }
  if (isNycActive(player, now)) {
    const cfg = player.nycConfig || {};
    player.gardens.forEach((plots, gi) => {
      if (!gardenEnabled(cfg, gi)) return;
      if (nycCareGarden(plots, player, plantsMap, fertMap, now)) changed = true;
    });
  }
  if (isHelperActive(player, now)) {
    if (helperBuy(player, plantsMap, fertMap, now)) changed = true;
  }
  const active = player.activeGarden || 0;
  if (player.gardens[active]) player.plots = player.gardens[active];
  if (changed) player.updatedAt = now;
  return changed;
}

async function runCare() {
  const db = initAdmin();
  const now = Date.now();
  const plantsSnap = await db.ref('plants').once('value');
  const plantsMap = {};
  const plantsVal = plantsSnap.val() || {};
  Object.keys(plantsVal).forEach(k => {
    const p = plantsVal[k];
    if (p) plantsMap[p.id || k] = p;
  });
  const fertMap = {};
  FALLBACK_FERTS.forEach(f => { fertMap[f.id] = f; });

  const idxSnap = await db.ref('agentIndex').once('value');
  const index = idxSnap.val() || {};
  let uids = Object.keys(index).filter(uid => {
    const a = index[uid];
    return a && ((a.fairyUntil > now) || (a.nycUntil > now) || (a.helperUntil > now));
  });
  if (!uids.length) {
    const usersSnap = await db.ref('users').limitToFirst(60).once('value');
    const users = usersSnap.val() || {};
    uids = Object.keys(users).filter(uid => {
      const p = users[uid];
      return p && ((p.fairyUntil > now) || (p.nycUntil > now) || (p.helperUntil > now));
    });
  }

  let processed = 0, updated = 0;
  for (const uid of uids) {
    processed++;
    try {
      const ref = db.ref('users/' + uid);
      const snap = await ref.once('value');
      if (!snap.exists()) continue;
      const player = snap.val();
      if (!processPlayer(player, plantsMap, fertMap, now)) continue;
      await ref.update({
        plots: player.plots,
        gardens: player.gardens,
        inventory: player.inventory,
        coins: player.coins,
        stats: player.stats || null,
        lastFairyCare: player.lastFairyCare || null,
        lastHelperBuy: player.lastHelperBuy || null,
        activity: player.activity || null,
        updatedAt: now,
        serverCareAt: now
      });
      updated++;
    } catch (e) {
      console.error('care', uid, e);
    }
  }
  return { processed, updated, at: now };
}

module.exports = async function handler(req, res) {
  // CORS + method
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  const secret = process.env.CARE_SECRET || 'vuon-cay-care-run';
  const key = (req.query && req.query.key) || req.headers['x-care-key'];
  if (key !== secret) {
    res.status(403).json({ ok: false, error: 'Forbidden' });
    return;
  }
  try {
    const result = await runCare();
    res.status(200).json({ ok: true, ...result });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: String(e.message || e) });
  }
};

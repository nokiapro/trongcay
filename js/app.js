
let selectedPlotId = null;

function getDisplayName(player, user) {
  const p = player || currentPlayer;
  const u = user || currentUser;
  if (p && p.displayName) return p.displayName;
  const email = (p && p.email) || (u && u.email) || '';
  return email ? email.split('@')[0] : 'Player';
}

let _toastTimer = null;
function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  const text = (msg == null || msg === '') ? 'Có lỗi xảy ra' : String(msg);
  toast.textContent = text;
  toast.className = 'toast show ' + (type || '');
  toast.title = 'Bấm để đóng';
  toast.style.cursor = 'pointer';
  if (_toastTimer) clearTimeout(_toastTimer);
  // Lỗi hiện lâu hơn để đọc kịp
  const ms = (type === 'error') ? 8000 : (type === 'warning' ? 5000 : 3200);
  _toastTimer = setTimeout(() => toast.classList.remove('show'), ms);
  toast.onclick = () => {
    toast.classList.remove('show');
    if (_toastTimer) clearTimeout(_toastTimer);
  };
}

function updateProfileLevelTag(level) {
  const lv = Math.min(typeof TREE_MAX_LEVEL === 'number' ? TREE_MAX_LEVEL : 10000, Math.max(1, parseInt(level, 10) || 1));
  const num = document.getElementById('profile-level-num');
  if (num) num.textContent = lv;
  const tag = document.getElementById('profile-level-tag');
  if (!tag) return;
  const tierFn = typeof getTreeTier === 'function' ? getTreeTier : null;
  if (!tierFn || typeof TREE_TIERS === 'undefined') return;
  const tier = tierFn(lv);
  if (!tier) return;
  TREE_TIERS.forEach(t => tag.classList.remove(t.class));
  tag.classList.add(tier.class);
}

function updateCoins() {
  if (!currentPlayer) return;
  const coinEl = document.getElementById('coin-display');
  if (coinEl) {
    if (Game.isUnlimitedResources && Game.isUnlimitedResources()) {
      coinEl.textContent = '∞';
      coinEl.title = 'Unlimited tài nguyên';
    } else {
      coinEl.textContent = (currentPlayer.coins || 0).toLocaleString();
      coinEl.title = '';
    }
  }
  const lvEl = document.getElementById('level-display');
  if (lvEl) lvEl.textContent = currentPlayer.level || 1;
  if (typeof updateProfileLevelTag === 'function') updateProfileLevelTag(currentPlayer.level || 1);
  const fertEl = document.getElementById('fertilizer-count');
  if (fertEl) fertEl.textContent = Game.totalFertilizerCount();
}

function updateUserUI() {
  if (!currentPlayer || !currentUser) return;
  const adminBtn = document.getElementById('btn-admin');
  if (adminBtn) adminBtn.style.display = isAdmin ? '' : 'none';
  updateDailyBtn();
}

function updateLoginStreakUI() {
  const el = document.getElementById('profile-streak');
  const countEl = document.getElementById('profile-streak-count');
  if (!el || !countEl) return;
  if (typeof Game === 'undefined' || !Game.getLoginStreak) {
    el.style.display = 'none';
    return;
  }
  const s = Game.getLoginStreak() || 0;
  const max = (Game.getMaxLoginStreak && Game.getMaxLoginStreak()) || 0;
  if (s > 0) {
    el.style.display = 'inline-flex';
    countEl.textContent = String(s);
    el.title = 'Chuỗi đăng nhập: ' + s + ' ngày' + (max > s ? ' · Kỷ lục ' + max + ' ngày' : '');
  } else {
    el.style.display = 'none';
  }
}

function updateDailyBtn() {
  const btn = document.getElementById('btn-daily');
  if (btn && typeof Game !== 'undefined' && Game.hasClaimedDaily) {
    btn.style.display = Game.hasClaimedDaily() ? 'none' : 'inline-flex';
  }
  updateLoginStreakUI();
}

function showRainEffect() {
  const el = document.getElementById('rain-overlay');
  if (!el) return;
  el.innerHTML = '';
  el.classList.add('active');
  for (let i = 0; i < 60; i++) {
    const d = document.createElement('div');
    d.className = 'drop';
    d.style.left = Math.random() * 100 + '%';
    d.style.height = (12 + Math.random() * 18) + 'px';
    d.style.animationDuration = (0.4 + Math.random() * 0.5) + 's';
    d.style.animationDelay = (Math.random() * 0.8) + 's';
    d.style.opacity = String(0.4 + Math.random() * 0.5);
    el.appendChild(d);
  }
  
  const count = 10;
  for (let i = 0; i < count; i++) {
    const item = document.createElement('button');
    const isBug = Math.random() < 0.55;
    item.type = 'button';
    item.className = 'rain-collect ' + (isBug ? 'rain-bug' : 'rain-seed');
    item.dataset.kind = isBug ? 'bug' : 'seed';
    item.textContent = isBug ? '🐛' : '🌱';
    item.title = isBug ? 'Bắt sâu (+coin)' : 'Nhặt hạt rơi';
    item.style.left = (8 + Math.random() * 84) + '%';
    item.style.top = (12 + Math.random() * 70) + '%';
    item.style.animationDelay = (Math.random() * 1.2) + 's';
    item.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (item.dataset.caught) return;
      item.dataset.caught = '1';
      const kind = item.dataset.kind;
      const res = await Game.collectRainItem(kind);
      if (res.ok) {
        item.classList.add('caught');
        showToast(res.msg, 'success');
        setTimeout(() => item.remove(), 280);
      } else {
        item.dataset.caught = '';
        if (res.msg) showToast(res.msg, 'error');
      }
    });
    el.appendChild(item);
  }
  const hint = document.createElement('div');
  hint.className = 'rain-hint';
  hint.textContent = 'Chạm 🐛 / 🌱 để nhặt thưởng!';
  el.appendChild(hint);
}
function hideRainEffect() {
  const el = document.getElementById('rain-overlay');
  if (el) { el.classList.remove('active'); el.innerHTML = ''; }
}


function hideAuthLoading() {
  const el = document.getElementById('auth-loading');
  if (el) el.style.display = 'none';
}
function showAuthLoading() {
  const el = document.getElementById('auth-loading');
  if (el) el.style.display = 'flex';
}

function showLogin() {
  hideAuthLoading();
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app-screen').style.display = 'none';
}

function showApp() {
  hideAuthLoading();
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-screen').style.display = 'block';
  updateCoins();
  updateUserUI();
  updateFairyBadge();
  listenServerAnnounce();
  let page = 'garden';
  try { page = sessionStorage.getItem('vx_page') || 'garden'; } catch (_) {}
  goToPage(page);
}

function updateFairyBadge() {
  const el = document.getElementById('fairy-badge');
  const text = document.getElementById('fairy-badge-text');
  if (!el || !text) return;
  if (Game.hasFairy()) {
    el.style.display = '';
    const emoji = (Game.getFairyEmoji && Game.getFairyEmoji()) || '🧚';
    const name = Game.getFairyDisplayName ? Game.getFairyDisplayName() : 'Tiên';
    text.textContent = emoji + ' ' + name + ' · ' + Game.formatTime(Game.fairyRemainingSec());
    const icon = el.querySelector('i.fa-wand-magic-sparkles, .badge-emoji');
    
  } else {
    el.style.display = 'none';
  }
  updateNycBadge();
  updateHelperBadge();
}

function updateNycBadge() {
  const el = document.getElementById('nyc-badge');
  const text = document.getElementById('nyc-badge-text');
  if (!el || !text) return;
  if (Game.hasNyc()) {
    el.style.display = '';
    const emoji = (Game.getNycEmoji && Game.getNycEmoji()) || '👩‍🌾';
    const name = Game.getNycDisplayName ? Game.getNycDisplayName() : 'NYC';
    text.textContent = emoji + ' ' + name + ' · ' + Game.formatTime(Game.nycRemainingSec());
  } else {
    el.style.display = 'none';
  }
}


function updateHelperBadge() {
  const el = document.getElementById('helper-badge');
  const textEl = document.getElementById('helper-badge-text');
  if (!el || !textEl || typeof Game === 'undefined') return;
  if (Game.hasHelper && Game.hasHelper()) {
    el.style.display = '';
    const emoji = Game.getHelperEmoji ? Game.getHelperEmoji() : '💁';
    const name = Game.getHelperDisplayName ? Game.getHelperDisplayName() : 'Giúp việc';
    textEl.textContent = emoji + ' ' + name + ' · ' + Game.formatTime(Game.helperRemainingSec());
  } else {
    el.style.display = 'none';
  }
  if (typeof refreshSupportMenuStatus === 'function') refreshSupportMenuStatus();
}



window._nycDraftPlantList = [];

function renderNycPlantListUI() {
  const host = document.getElementById('nyc-plant-list');
  if (!host) return;
  const list = Array.isArray(window._nycDraftPlantList) ? window._nycDraftPlantList : [];
  if (!list.length) {
    host.innerHTML = '<p class="bulk-hint" style="margin:0">Chưa có hạt trong danh sách — chọn ở trên rồi bấm Thêm.</p>';
    return;
  }
  host.innerHTML = list.map((it, idx) => {
    const p = Game.getPlant(it.plantId);
    const kindLabel = it.seedKind === 'myth' ? '✨ HT' : (it.seedKind === 'star' ? '⭐ Sao' : 'Thường');
    const name = p ? ((p.icon || '') + ' ' + p.name) : it.plantId;
    return `<div class="nyc-plant-chip" style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:rgba(0,0,0,0.2);border-radius:8px">
      <span style="opacity:0.7;min-width:18px">${idx + 1}.</span>
      <span style="flex:1">${name} · ${kindLabel}</span>
      <button type="button" class="btn btn-secondary btn-sm btn-nyc-seed-up" data-i="${idx}" title="Lên" ${idx === 0 ? 'disabled' : ''}>↑</button>
      <button type="button" class="btn btn-secondary btn-sm btn-nyc-seed-down" data-i="${idx}" title="Xuống" ${idx >= list.length - 1 ? 'disabled' : ''}>↓</button>
      <button type="button" class="btn btn-danger btn-sm btn-nyc-seed-rm" data-i="${idx}" title="Xóa">×</button>
    </div>`;
  }).join('');
  host.querySelectorAll('.btn-nyc-seed-rm').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.i, 10);
      window._nycDraftPlantList.splice(i, 1);
      renderNycPlantListUI();
    });
  });
  host.querySelectorAll('.btn-nyc-seed-up').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.i, 10);
      if (i <= 0) return;
      const t = window._nycDraftPlantList[i - 1];
      window._nycDraftPlantList[i - 1] = window._nycDraftPlantList[i];
      window._nycDraftPlantList[i] = t;
      renderNycPlantListUI();
    });
  });
  host.querySelectorAll('.btn-nyc-seed-down').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.i, 10);
      if (i >= window._nycDraftPlantList.length - 1) return;
      const t = window._nycDraftPlantList[i + 1];
      window._nycDraftPlantList[i + 1] = window._nycDraftPlantList[i];
      window._nycDraftPlantList[i] = t;
      renderNycPlantListUI();
    });
  });
}

function addNycPlantFromSelect() {
  const raw = document.getElementById('nyc-plant-select')?.value || '';
  if (!raw) {
    if (typeof showToast === 'function') showToast('Chọn hạt trước khi thêm', 'error');
    return;
  }
  let plantId = null, seedKind = 'normal';
  if (raw.includes('|')) {
    const parts = raw.split('|');
    plantId = parts[0] || null;
    seedKind = parts[1] === 'myth' ? 'myth' : (parts[1] === 'star' ? 'star' : 'normal');
  } else {
    plantId = raw;
  }
  if (!plantId) return;
  if (!Array.isArray(window._nycDraftPlantList)) window._nycDraftPlantList = [];
  if (window._nycDraftPlantList.length >= 8) {
    if (typeof showToast === 'function') showToast('Tối đa 8 loại hạt dự phòng', 'error');
    return;
  }
  const key = plantId + '|' + seedKind;
  if (window._nycDraftPlantList.some(x => (x.plantId + '|' + x.seedKind) === key)) {
    if (typeof showToast === 'function') showToast('Đã có trong danh sách', 'error');
    return;
  }
  window._nycDraftPlantList.push({ plantId, seedKind });
  renderNycPlantListUI();
}

/** Random các loại hạt KHÁC NHAU từ kho vào danh sách trồng NYC */
function randomFillNycPlantList() {
  if (!currentPlayer || typeof Game === 'undefined') {
    if (typeof showToast === 'function') showToast('Chưa đăng nhập', 'error');
    return;
  }
  const inv = currentPlayer.inventory || {};
  const bags = [
    { kind: 'normal', bag: inv.seeds || {} },
    { kind: 'star', bag: inv.seedsStar || {} },
    { kind: 'myth', bag: inv.seedsMyth || {} }
  ];
  // Hạt đã có trên bất kỳ vườn nào / đã cấu hình vườn khác → tránh khi random
  const usedElsewhere = new Set();
  try {
    (currentPlayer.gardens || []).forEach(plots => {
      if (!Array.isArray(plots)) return;
      plots.forEach(p => { if (p && p.plantId) usedElsewhere.add(String(p.plantId)); });
    });
    const base = (typeof Game !== 'undefined' && Game.getNycConfig) ? Game.getNycConfig() : null;
    const byG = (base && base.byGarden) || {};
    // Tab vườn đang cấu hình (nếu có)
    const curGi = (typeof window._nycConfigGardenIndex === 'number') ? window._nycConfigGardenIndex : null;
    Object.keys(byG).forEach(k => {
      if (curGi != null && String(k) === String(curGi)) return;
      const ov = byG[k];
      if (!ov) return;
      if (ov.plantId) usedElsewhere.add(String(ov.plantId));
      (ov.plantList || []).forEach(it => {
        const pid = (typeof it === 'string') ? it : (it && it.plantId);
        if (pid) usedElsewhere.add(String(pid));
      });
    });
  } catch (_) {}

  const pool = [];
  const seen = new Set();
  bags.forEach(b => {
    Object.keys(b.bag).forEach(pid => {
      if ((Number(b.bag[pid]) || 0) < 1) return;
      const key = pid + '|' + b.kind;
      if (seen.has(key)) return;
      seen.add(key);
      // Ưu tiên đưa vào pool loại chưa dùng ở vườn khác
      pool.push({ plantId: pid, seedKind: b.kind, used: usedElsewhere.has(String(pid)) });
    });
  });
  if (!pool.length) {
    if (typeof showToast === 'function') showToast('Kho không còn hạt để random', 'error');
    return;
  }
  const fresh = pool.filter(x => !x.used);
  const reused = pool.filter(x => x.used);
  const shuf = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  };
  shuf(fresh); shuf(reused);
  const ordered = fresh.concat(reused);
  let maxN = 12;
  try {
    const gardens = currentPlayer.gardens || [];
    let mx = 0;
    gardens.forEach(gg => { if (Array.isArray(gg) && gg.length > mx) mx = gg.length; });
    if (mx > 0) maxN = Math.min(24, Math.max(3, mx));
  } catch (_) {}
  window._nycDraftPlantList = ordered.slice(0, maxN).map(x => ({ plantId: x.plantId, seedKind: x.seedKind }));
  renderNycPlantListUI();
  if (typeof showToast === 'function') {
    showToast('Đã random ' + window._nycDraftPlantList.length + ' loại (ưu tiên chưa dùng ở vườn khác)', 'success');
  }
}


/** Map key "plantId|kind" → [chỉ số vườn 0-based] đã cài hạt đó trong NYC */
function getNycSeedConfiguredGardens() {
  const map = {};
  if (typeof Game === 'undefined' || !currentPlayer) return map;
  const n = (Game.getGardenCount && Game.getGardenCount()) || 1;
  for (let gi = 0; gi < n; gi++) {
    const cfg = Game.getNycConfigForGarden ? Game.getNycConfigForGarden(gi) : null;
    if (!cfg) continue;
    const list = (cfg.plantList && cfg.plantList.length)
      ? cfg.plantList
      : (cfg.plantId ? [{ plantId: cfg.plantId, seedKind: cfg.seedKind || 'normal' }] : []);
    list.forEach(it => {
      if (!it || !it.plantId) return;
      const k = it.seedKind === 'myth' ? 'myth' : (it.seedKind === 'star' ? 'star' : 'normal');
      const key = it.plantId + '|' + k;
      if (!map[key]) map[key] = [];
      if (map[key].indexOf(gi) < 0) map[key].push(gi);
    });
  }
  return map;
}

function openNycConfigModal() {
  if (!currentPlayer) return;
  const base = Game.getNycConfig();
  const gi = getSelectedAgentGarden('nyc');
  const cfg = Game.getNycConfigForGarden ? Game.getNycConfigForGarden(gi) : base;
  renderAgentGardenToggles('nyc-garden-toggles', base.gardensEnabled, 'nyc');
  const sel = document.getElementById('nyc-plant-select');
  if (!sel) return;
  const seeds = (currentPlayer.inventory && currentPlayer.inventory.seeds) || {};
  const stars = (currentPlayer.inventory && currentPlayer.inventory.seedsStar) || {};
  const myths = (currentPlayer.inventory && currentPlayer.inventory.seedsMyth) || {};
  const usedMap = (typeof getNycSeedConfiguredGardens === 'function') ? getNycSeedConfiguredGardens() : {};
  const gardenLabel = (arr) => {
    if (!arr || !arr.length) return '';
    // Hiện số vườn 1-based, bỏ vườn đang cấu hình khỏi nhãn "vườn khác" nếu muốn — vẫn hiện đủ để phân biệt
    return arr.map(g => 'Vườn ' + (g + 1)).join(', ');
  };
  const opts = ['<option value="">— Chưa chọn hạt —</option>'];
  const pushOpt = (id, kind, qtyLabel, selc, force) => {
    const p = Game.getPlant(id);
    if (!p && !force) return;
    const name = p ? ((p.icon || '') + ' ' + p.name) : id;
    const val = id + '|' + kind;
    const used = usedMap[val] || usedMap[id + '|' + kind] || [];
    const dim = used.length > 0;
    const usedTxt = dim ? (' · đã cài ' + gardenLabel(used)) : '';
    const dimAttr = dim ? ' data-dimmed="1"' : '';
    opts.push('<option value="' + val + '" ' + (selc || '') + dimAttr + '>' + name + ' · ' + qtyLabel + usedTxt + '</option>');
  };
  Object.keys(seeds).filter(id => (seeds[id] || 0) > 0).forEach(id => {
    const selc = (cfg.plantId === id && cfg.seedKind === 'normal') ? 'selected' : '';
    pushOpt(id, 'normal', 'thường x' + seeds[id], selc);
  });
  Object.keys(stars).filter(id => (stars[id] || 0) > 0).forEach(id => {
    const selc = (cfg.plantId === id && cfg.seedKind === 'star') ? 'selected' : '';
    pushOpt(id, 'star', '⭐ sao x' + stars[id], selc);
  });
  Object.keys(myths).filter(id => (myths[id] || 0) > 0).forEach(id => {
    const selc = (cfg.plantId === id && cfg.seedKind === 'myth') ? 'selected' : '';
    pushOpt(id, 'myth', '✨ huyền thoại x' + myths[id], selc);
  });
  if (cfg.plantId) {
    const haveN = (seeds[cfg.plantId] || 0) > 0;
    const haveS = (stars[cfg.plantId] || 0) > 0;
    const haveM = (myths[cfg.plantId] || 0) > 0;
    if (cfg.seedKind === 'myth' && !haveM) {
      pushOpt(cfg.plantId, 'myth', '✨ hết hạt huyền thoại', 'selected', true);
    }
    if (cfg.seedKind === 'star' && !haveS) {
      pushOpt(cfg.plantId, 'star', '⭐ hết hạt sao', 'selected', true);
    }
    if (cfg.seedKind === 'normal' && !haveN) {
      pushOpt(cfg.plantId, 'normal', 'hết hạt thường', 'selected', true);
    }
  }
  sel.innerHTML = opts.join('');
  // Danh sách hạt dự phòng — chỉ giữ loại còn trong kho
  const rawList = (cfg.plantList && cfg.plantList.length)
    ? cfg.plantList.map(x => ({ plantId: x.plantId, seedKind: x.seedKind || 'normal' }))
    : (cfg.plantId ? [{ plantId: cfg.plantId, seedKind: cfg.seedKind || 'normal' }] : []);
  window._nycDraftPlantList = rawList.filter(it => {
    if (!it || !it.plantId) return false;
    const k = it.seedKind || 'normal';
    if (k === 'myth') return (myths[it.plantId] || 0) > 0;
    if (k === 'star') return (stars[it.plantId] || 0) > 0;
    return (seeds[it.plantId] || 0) > 0;
  });
  // Nếu list bị lọc bớt so với cấu hình đã lưu → tự lưu lại
  if (window._nycDraftPlantList.length !== rawList.length && typeof Game.setNycConfig === 'function') {
    try {
      const gi0 = getSelectedAgentGarden('nyc');
      Game.setNycConfig({
        gardenIndex: gi0,
        plantList: window._nycDraftPlantList.slice(),
        plantId: window._nycDraftPlantList[0] ? window._nycDraftPlantList[0].plantId : null,
        seedKind: window._nycDraftPlantList[0] ? window._nycDraftPlantList[0].seedKind : 'normal',
        mode: cfg.mode,
        count: cfg.count,
        customName: base.customName,
        gender: base.gender,
        gardensEnabled: base.gardensEnabled
      });
    } catch (_) {}
  }
  renderNycPlantListUI();

  const modeAll = document.querySelector('input[name="nyc-mode"][value="all"]');
  const modeCount = document.querySelector('input[name="nyc-mode"][value="count"]');
  const countInp = document.getElementById('nyc-count-input');
  if (cfg.mode === 'count') {
    if (modeCount) modeCount.checked = true;
    if (countInp) { countInp.style.display = 'block'; countInp.value = cfg.count || 1; }
  } else {
    if (modeAll) modeAll.checked = true;
    if (countInp) countInp.style.display = 'none';
  }
  const nycNameInp = document.getElementById('nyc-custom-name');
  if (nycNameInp) nycNameInp.value = base.customName || '';
  const ng = base.gender === 'male' ? 'male' : 'female';
  const ngEl = document.querySelector(`input[name="nyc-gender"][value="${ng}"]`);
  if (ngEl) ngEl.checked = true;
  document.getElementById('modal-nyc-config')?.classList.add('show');
  mountPillDropdown(sel, { prefix: 'Hạt giống:', block: true });
}

function bindNycConfigUI() {
  document.getElementById('btn-nyc-config')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openNycConfigModal();
  });
  document.querySelectorAll('input[name="nyc-mode"]').forEach(r => {
    r.addEventListener('change', () => {
      const countInp = document.getElementById('nyc-count-input');
      if (!countInp) return;
      countInp.style.display = (document.querySelector('input[name="nyc-mode"]:checked')?.value === 'count') ? 'block' : 'none';
    });
  });
  document.getElementById('btn-nyc-add-seed')?.addEventListener('click', () => addNycPlantFromSelect());
  document.getElementById('btn-nyc-random-seeds')?.addEventListener('click', () => randomFillNycPlantList());
  document.getElementById('btn-save-nyc-config')?.addEventListener('click', async () => {
    let plantList = Array.isArray(window._nycDraftPlantList) ? window._nycDraftPlantList.slice() : [];
    if (!plantList.length) {
      const raw = document.getElementById('nyc-plant-select')?.value || '';
      let plantId = null, seedKind = 'normal';
      if (raw && raw.includes('|')) {
        const parts = raw.split('|');
        plantId = parts[0] || null;
        seedKind = parts[1] === 'myth' ? 'myth' : (parts[1] === 'star' ? 'star' : 'normal');
      } else if (raw) {
        plantId = raw;
      }
      if (plantId) plantList = [{ plantId, seedKind }];
    }
    const plantId = plantList.length ? plantList[0].plantId : null;
    const seedKind = plantList.length ? plantList[0].seedKind : 'normal';
    const mode = document.querySelector('input[name="nyc-mode"]:checked')?.value || 'all';
    const count = parseInt(document.getElementById('nyc-count-input')?.value, 10) || 1;
    const gi = getSelectedAgentGarden('nyc');
    const enEl = document.getElementById('nyc-garden-enabled');
    const applyAll = !!document.getElementById('nyc-apply-all-gardens')?.checked;
    const baseGe = Object.assign({}, (Game.getNycConfig().gardensEnabled || {}));
    if (enEl) baseGe[String(gi)] = !!enEl.checked;
    
    const nGardens = typeof Game.getGardenCount === 'function' ? Game.getGardenCount() : 1;
    for (let i = 0; i < nGardens; i++) {
      if (baseGe[String(i)] === undefined && baseGe[i] === undefined) baseGe[String(i)] = true;
    }
    const payload = {
      gardenIndex: gi,
      gardenEnabled: enEl ? !!enEl.checked : true,
      gardensEnabled: baseGe,
      plantId: plantId || null,
      seedKind,
      plantList,
      mode,
      count,
      customName: (document.getElementById('nyc-custom-name')?.value || '').trim().slice(0, 20),
      gender: document.querySelector('input[name="nyc-gender"]:checked')?.value || 'female'
    };
    let res = Game.setNycConfig(payload);
    
    if (res.ok && applyAll && plantList.length) {
      for (let i = 0; i < nGardens; i++) {
        if (baseGe[String(i)] === false || baseGe[i] === false) continue;
        Game.setNycConfig({
          gardenIndex: i,
          gardenEnabled: true,
          gardensEnabled: baseGe,
          plantId,
          seedKind,
          plantList,
          mode,
          count,
          customName: payload.customName,
          gender: payload.gender
        });
      }
      res = { ok: true, msg: 'Đã lưu NYC · áp dụng hạt cho tất cả vườn đang bật' };
    }
    if (res.ok) {
      await savePlayer();
      showToast(res.msg, 'success');
      openNycConfigModal();
      updateNycBadge();
      updateHelperBadge();
    } else {
      showToast(res.msg, 'error');
    }
  });
}

function syncFairyConfigFormVisibility() {
  const waterCount = document.getElementById('fairy-water-count');
  const waterMode = document.querySelector('input[name="fairy-water-mode"]:checked')?.value;
  if (waterCount) waterCount.style.display = waterMode === 'count' ? 'block' : 'none';

  const fertOn = document.querySelector('input[name="fairy-fert-on"]:checked')?.value !== '0';
  const fertOpts = document.getElementById('fairy-fert-options');
  if (fertOpts) fertOpts.style.display = fertOn ? 'block' : 'none';

  const src = document.querySelector('input[name="fairy-fert-src"]:checked')?.value;
  const fertIdSel = document.getElementById('fairy-fert-id');
  if (fertIdSel) fertIdSel.style.display = src === 'specific' ? 'block' : 'none';

  const fertCount = document.getElementById('fairy-fert-count');
  const fertMode = document.querySelector('input[name="fairy-fert-mode"]:checked')?.value;
  if (fertCount) fertCount.style.display = fertMode === 'count' ? 'block' : 'none';
}



window._agentGardenTab = window._agentGardenTab || { fairy: 0, nyc: 0 };

function renderAgentGardenToggles(hostId, gardensEnabled, kind) {
  const host = document.getElementById(hostId);
  if (!host) return;
  if (typeof Game.ensureGardens === 'function') Game.ensureGardens();
  const n = typeof Game.getGardenCount === 'function' ? Game.getGardenCount() : 1;
  const ge = gardensEnabled && typeof gardensEnabled === 'object' ? gardensEnabled : {};
  const k = kind || 'fairy';
  let sel = Number(window._agentGardenTab[k]) || 0;
  if (sel < 0 || sel >= n) sel = 0;
  window._agentGardenTab[k] = sel;
  let html = '<div class="agent-garden-tabs">';
  for (let i = 0; i < n; i++) {
    const on = !(ge[i] === false || ge[String(i)] === false);
    const plots = (currentPlayer && currentPlayer.gardens && currentPlayer.gardens[i]) || [];
    const count = plots.length || 0;
    const maxP = Game.MAX_PLOTS_PER_GARDEN || 99;
    html += `<button type="button" class="agent-garden-tab ${i === sel ? 'active' : ''} ${on ? '' : 'off'}" data-garden="${i}" data-kind="${k}">
      Vườn ${i + 1}<small>${count}/${maxP}</small>${on ? '' : ' · tắt'}
    </button>`;
  }
  html += '</div>';
  if (n >= 1) {
    const on = !(ge[sel] === false || ge[String(sel)] === false);
    html += `<label class="garden-toggle-row agent-garden-enable">
      <span class="garden-toggle-label"><i class="fa-solid fa-power-off"></i> Bật trên Vườn ${sel + 1}</span>
      <input type="checkbox" class="garden-toggle-switch ios-toggle" id="${k}-garden-enabled" data-garden="${sel}" ${on ? 'checked' : ''} />
    </label>
    <p class="bulk-hint">Đang cấu hình <strong>Vườn ${sel + 1}</strong> — mỗi vườn có cấu hình riêng.</p>`;
    if (k === 'nyc') {
      html += `<label class="garden-toggle-row" style="margin-top:6px">
        <span class="garden-toggle-label"><i class="fa-solid fa-copy"></i> Áp dụng hạt này cho <strong>tất cả vườn đang bật</strong> khi Lưu</span>
        <input type="checkbox" id="nyc-apply-all-gardens" checked />
      </label>`;
    }
  } else {
    html += '<p class="bulk-hint">Chưa có vườn.</p>';
  }
  host.innerHTML = html;
  host.querySelectorAll('.agent-garden-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.garden, 10) || 0;
      const kk = btn.dataset.kind || k;
      window._agentGardenTab[kk] = i;
      if (kk === 'fairy') openFairyConfigModal();
      else if (kk === 'nyc') openNycConfigModal();
    });
  });
}

function readAgentGardenToggles(hostId) {
  const host = document.getElementById(hostId);
  const ge = {};
  if (!host) return ge;
  
  host.querySelectorAll('.garden-toggle-switch').forEach(inp => {
    const i = inp.dataset.garden;
    ge[i] = !!inp.checked;
  });
  return ge;
}

function getSelectedAgentGarden(kind) {
  const n = typeof Game.getGardenCount === 'function' ? Game.getGardenCount() : 1;
  let sel = Number(window._agentGardenTab[kind]) || 0;
  if (sel < 0 || sel >= n) sel = 0;
  return sel;
}


function openFairyConfigModal() {
  if (!currentPlayer) return;
  const base = Game.getFairyConfig();
  const gi = getSelectedAgentGarden('fairy');
  const cfg = Game.getFairyConfigForGarden ? Game.getFairyConfigForGarden(gi) : base;
  renderAgentGardenToggles('fairy-garden-toggles', base.gardensEnabled, 'fairy');

  const wAll = document.querySelector('input[name="fairy-water-mode"][value="all"]');
  const wCnt = document.querySelector('input[name="fairy-water-mode"][value="count"]');
  if (cfg.waterMode === 'count') { if (wCnt) wCnt.checked = true; }
  else { if (wAll) wAll.checked = true; }
  const wInp = document.getElementById('fairy-water-count');
  if (wInp) wInp.value = cfg.waterCount || 12;

  const fOn = document.querySelector('input[name="fairy-fert-on"][value="1"]');
  const fOff = document.querySelector('input[name="fairy-fert-on"][value="0"]');
  if (cfg.useFertilizer) { if (fOn) fOn.checked = true; }
  else { if (fOff) fOff.checked = true; }

  const srcAny = document.querySelector('input[name="fairy-fert-src"][value="any"]');
  const srcSp = document.querySelector('input[name="fairy-fert-src"][value="specific"]');
  if (cfg.fertSource === 'specific') { if (srcSp) srcSp.checked = true; }
  else { if (srcAny) srcAny.checked = true; }

  const fertSel = document.getElementById('fairy-fert-id');
  if (fertSel) {
    const bag = (currentPlayer.inventory && currentPlayer.inventory.fertilizers) || {};
    const list = Game.getFertilizers() || [];
    fertSel.innerHTML = list.map(f => {
      const n = bag[f.id] || 0;
      return `<option value="${f.id}" ${cfg.fertId === f.id ? 'selected' : ''}>${f.icon || ''} ${f.name} (kho: ${n})</option>`;
    }).join('');
    if (cfg.fertId) fertSel.value = cfg.fertId;
    mountPillDropdown(fertSel, { prefix: 'Loại phân:', block: true });
  }

  const fmAll = document.querySelector('input[name="fairy-fert-mode"][value="all"]');
  const fmCnt = document.querySelector('input[name="fairy-fert-mode"][value="count"]');
  if (cfg.fertMode === 'count') { if (fmCnt) fmCnt.checked = true; }
  else { if (fmAll) fmAll.checked = true; }
  const fInp = document.getElementById('fairy-fert-count');
  if (fInp) fInp.value = cfg.fertCount || 12;

  const nameInp = document.getElementById('fairy-custom-name');
  if (nameInp) nameInp.value = base.customName || '';
  const fg = base.gender === 'male' ? 'male' : 'female';
  const fgEl = document.querySelector(`input[name="fairy-gender"][value="${fg}"]`);
  if (fgEl) fgEl.checked = true;
  const collectOn = base.collectRain !== false;
  const cOn = document.querySelector('input[name="fairy-collect-rain"][value="1"]');
  const cOff = document.querySelector('input[name="fairy-collect-rain"][value="0"]');
  if (collectOn) { if (cOn) cOn.checked = true; }
  else { if (cOff) cOff.checked = true; }
  syncFairyConfigFormVisibility();
  document.getElementById('modal-fairy-config')?.classList.add('show');
}
function openRobotConfigModal() {
  if (!currentPlayer) return;
  if (!(Game.hasRobot && Game.hasRobot())) {
    if (typeof showToast === 'function') showToast('Người máy chỉ do admin cấp quyền!', 'error');
    return;
  }
  const cfg = Game.getRobotConfig();
  const nameInp = document.getElementById('robot-custom-name');
  if (nameInp) nameInp.value = cfg.customName || '';
  const g = cfg.gender === 'male' ? 'male' : 'female';
  const gEl = document.querySelector('input[name="robot-gender"][value="' + g + '"]');
  if (gEl) gEl.checked = true;
  const elFairy = document.getElementById('robot-buy-fairy-toggle');
  if (elFairy) elFairy.checked = cfg.buyFairySeeds !== false;
  const elProt = document.getElementById('robot-buy-protect-toggle');
  if (elProt) elProt.checked = cfg.buyProtect !== false;
  const elAny = document.getElementById('robot-buy-any-toggle');
  if (elAny) elAny.checked = cfg.buyAnySeeds === true;
  const elCook = document.getElementById('robot-cook-enabled');
  if (elCook) elCook.checked = cfg.cookEnabled === true;
  const elCN = document.getElementById('robot-cook-normal');
  if (elCN) elCN.checked = cfg.cookNormal !== false;
  const elCS = document.getElementById('robot-cook-star');
  if (elCS) elCS.checked = cfg.cookStar === true;
  const elCM = document.getElementById('robot-cook-myth');
  if (elCM) elCM.checked = cfg.cookMyth === true;
  const elTQ = document.getElementById('robot-cook-target');
  if (elTQ) elTQ.value = String(Math.max(0, Math.floor(Number(cfg.cookTargetQty) || 0)));
  document.getElementById('modal-robot-config')?.classList.add('show');
}

function bindRobotConfigUI() {
  document.getElementById('btn-save-robot-config')?.addEventListener('click', async () => {
    const res = Game.setRobotConfig({
      customName: (document.getElementById('robot-custom-name')?.value || '').trim().slice(0, 20),
      gender: document.querySelector('input[name="robot-gender"]:checked')?.value || 'female',
      buyFairySeeds: !!document.getElementById('robot-buy-fairy-toggle')?.checked,
      buyProtect: !!document.getElementById('robot-buy-protect-toggle')?.checked,
      buyAnySeeds: !!document.getElementById('robot-buy-any-toggle')?.checked,
      cookEnabled: !!document.getElementById('robot-cook-enabled')?.checked,
      cookNormal: !!document.getElementById('robot-cook-normal')?.checked,
      cookStar: !!document.getElementById('robot-cook-star')?.checked,
      cookMyth: !!document.getElementById('robot-cook-myth')?.checked,
      cookTargetQty: Math.max(0, Math.floor(Number(document.getElementById('robot-cook-target')?.value) || 0))
    });
    if (res.ok) {
      // Đồng bộ tên/giới tính với field hồ sơ nếu đang mở
      const pName = document.getElementById('profile-robot-name');
      if (pName) pName.value = (document.getElementById('robot-custom-name')?.value || '').trim().slice(0, 20);
      const pg = document.querySelector('input[name="robot-gender"]:checked')?.value || 'female';
      const pGen = document.querySelector('input[name="profile-robot-gender"][value="' + pg + '"]');
      if (pGen) pGen.checked = true;
      await savePlayer();
      showToast(res.msg, 'success');
      if (typeof refreshSupportMenuStatus === 'function') refreshSupportMenuStatus();
      document.getElementById('modal-robot-config')?.classList.remove('show');
    } else {
      showToast(res.msg || 'Lỗi lưu', 'error');
    }
  });
}


function bindFairyConfigUI() {
  document.getElementById('btn-fairy-config')?.addEventListener('click', (e) => {
    e.stopPropagation();
    openFairyConfigModal();
  });
  ['fairy-water-mode', 'fairy-fert-on', 'fairy-fert-src', 'fairy-fert-mode'].forEach(name => {
    document.querySelectorAll(`input[name="${name}"]`).forEach(el => {
      el.addEventListener('change', syncFairyConfigFormVisibility);
    });
  });
  document.getElementById('btn-save-fairy-config')?.addEventListener('click', async () => {
    const gi = getSelectedAgentGarden('fairy');
    const enEl = document.getElementById('fairy-garden-enabled');
    const baseGe = Object.assign({}, (Game.getFairyConfig().gardensEnabled || {}));
    
    if (enEl) baseGe[String(gi)] = !!enEl.checked;
    const res = Game.setFairyConfig({
      gardenIndex: gi,
      gardenEnabled: enEl ? !!enEl.checked : true,
      gardensEnabled: baseGe,
      waterMode: document.querySelector('input[name="fairy-water-mode"]:checked')?.value || 'all',
      waterCount: parseInt(document.getElementById('fairy-water-count')?.value, 10) || 12,
      useFertilizer: document.querySelector('input[name="fairy-fert-on"]:checked')?.value !== '0',
      fertSource: document.querySelector('input[name="fairy-fert-src"]:checked')?.value || 'any',
      fertId: document.getElementById('fairy-fert-id')?.value || null,
      fertMode: document.querySelector('input[name="fairy-fert-mode"]:checked')?.value || 'all',
      fertCount: parseInt(document.getElementById('fairy-fert-count')?.value, 10) || 12,
      customName: (document.getElementById('fairy-custom-name')?.value || '').trim().slice(0, 20),
      gender: document.querySelector('input[name="fairy-gender"]:checked')?.value || 'female',
      collectRain: document.querySelector('input[name="fairy-collect-rain"]:checked')?.value !== '0'
    });
    if (res.ok) {
      await savePlayer();
      showToast(res.msg, 'success');
      openFairyConfigModal(); 
      updateFairyBadge();
    } else {
      showToast(res.msg, 'error');
    }
  });
}

let _announceUnsub = null;
function listenServerAnnounce() {
  const box = document.getElementById('server-announce');
  const textEl = document.getElementById('server-announce-text');
  if (!box || !textEl || !db) return;
  if (_announceUnsub) {
    try { db.ref('announcements/latest').off('value', _announceUnsub); } catch (_) {}
  }
  const handler = (snap) => {
    const v = snap.val();
    if (!v || !v.text) {
      box.style.display = 'none';
      return;
    }
    const dismissed = sessionStorage.getItem('vx_announce_dismiss');
    if (dismissed && String(v.at) === dismissed) {
      box.style.display = 'none';
      return;
    }
    textEl.textContent = v.text;
    box.style.display = 'flex';
    box.dataset.at = String(v.at || '');
  };
  _announceUnsub = handler;
  db.ref('announcements/latest').on('value', handler);
}

document.getElementById('server-announce-close')?.addEventListener('click', () => {
  const box = document.getElementById('server-announce');
  if (box) {
    sessionStorage.setItem('vx_announce_dismiss', box.dataset.at || '');
    box.style.display = 'none';
  }
});

document.getElementById('btn-login').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  errEl.textContent = '';

  if (!email || !password) {
    errEl.textContent = 'Vui lòng nhập email và mật khẩu.';
    return;
  }

  const btn = document.getElementById('btn-login');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang đăng nhập...';

  try {
    const cred = await auth.signInWithEmailAndPassword(email, password);
    currentUser = cred.user;
    await initGlobalData();
    await loadPlayer(currentUser.uid, currentUser.email);
    showApp();
    showToast('Đăng nhập thành công!', 'success');
  } catch (e) {
    console.error(e);
    let msg = 'Đăng nhập thất bại.';
    if (e.code === 'auth/user-not-found') msg = 'Tài khoản không tồn tại. Hãy tạo trong Firebase Console.';
    else if (e.code === 'auth/wrong-password') msg = 'Sai mật khẩu.';
    else if (e.code === 'auth/invalid-email') msg = 'Email không hợp lệ.';
    else if (e.code === 'auth/invalid-credential') msg = 'Email hoặc mật khẩu không đúng.';
    errEl.textContent = msg;
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Đăng nhập';
  }
});

document.getElementById('login-password').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('btn-login').click();
});

document.getElementById('btn-logout').addEventListener('click', async () => {
  await auth.signOut();
  currentUser = null;
  currentPlayer = null;
  isAdmin = false;
  showLogin();
});

auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    try {
      await initGlobalData();
      await loadPlayer(user.uid, user.email);
      // === Boot kiểu 205: vào game ngay, không await offline ===
      try {
        if (typeof Game !== 'undefined' && Game.processLoginStreak) {
          const sr = Game.processLoginStreak();
          if (sr && sr.changed && typeof scheduleSavePlayer === 'function') scheduleSavePlayer(400);
        }
      } catch (e) { console.warn('processLoginStreak', e); }
      try { if (typeof scheduleActivityMidnightPrune === 'function') scheduleActivityMidnightPrune(); } catch (_) {}
      if (typeof Features !== 'undefined') Features.ensureQuests();
      if (typeof listenPlayerTimers === 'function') listenPlayerTimers();
      // Vào game trước — gate/offline không được giữ màn loading
      showApp();
      if (typeof loadPlayerMailbox === 'function') loadPlayerMailbox().catch(() => {});
      // Gate chạy nền: chỉ khóa nếu Firebase trả blocked
      if (typeof Features !== 'undefined' && Features.checkAccessGates) {
        Features.checkAccessGates().then(gate => {
          if (gate && gate.blocked) showAccessGate(gate);
        }).catch(ge => console.warn('checkAccessGates', ge));
      }

      // Offline / sync: CHẠY NỀN, không await trên luồng auth (tránh đơ + timeout giả)
      setTimeout(() => {
        (async () => {
          try {
            if (typeof syncPlayerOnEnter === 'function') {
              const syn = await syncPlayerOnEnter();
              if (syn && syn.ok && typeof updateCoins === 'function') updateCoins();
            }
          } catch (e) { console.warn('syncPlayerOnEnter', e); }
          try {
            if (typeof pullRemotePlayerIfNewer === 'function') await pullRemotePlayerIfNewer();
          } catch (e) { console.warn('pullRemote', e); }
          try {
            if (typeof Game !== 'undefined' && Game.simulateOfflineCare) {
              const r = await Game.simulateOfflineCare();
              if (r && !r.skipped && (r.offlineMs || 0) >= ((Game.OFFLINE_CONFIG && Game.OFFLINE_CONFIG.thresholdMs) || 300000)) {
                if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(600);
                if (typeof updateCoins === 'function') updateCoins();
                if (typeof renderGarden === 'function') {
                  const gp = document.getElementById('page-garden');
                  if (gp && gp.classList.contains('active')) renderGarden();
                }
                try {
                  const logs = (currentPlayer && currentPlayer.activityLogs) || [];
                  const lastOff = logs.find(l => l && l.type === 'offline');
                  if (typeof showOfflineReturnModal === 'function') showOfflineReturnModal(r, lastOff);
                } catch (_) {}
              }
            }
          } catch (e) { console.warn('simulateOfflineCare', e); }
          try {
            if (typeof forceBackgroundCare === 'function') forceBackgroundCare('login');
          } catch (_) {}
        })();
      }, 2500);
    } catch (e) {
      console.error(e);
      showToast('Lỗi tải dữ liệu: ' + e.message, 'error');
      
      hideAuthLoading();
      if (currentPlayer) showApp();
      else showLogin();
    }
  } else {
    if (typeof stopListenPlayerTimers === 'function') stopListenPlayerTimers();
    hideAccessGate();
    showLogin();
  }
});

function showAccessGate(gate) {
  const el = document.getElementById('access-gate');
  if (!el) return;
  document.getElementById('app-screen').style.display = 'none';
  document.getElementById('login-screen').style.display = 'none';
  el.style.display = 'flex';
  const title = document.getElementById('access-gate-title');
  const msg = document.getElementById('access-gate-msg');
  const icon = document.getElementById('access-gate-icon');
  if (gate.type === 'banned') {
    if (title) title.textContent = 'Tài khoản bị khóa';
    if (icon) icon.innerHTML = '<i class="fa-solid fa-ban"></i>';
  } else {
    if (title) title.textContent = 'Bảo trì hệ thống';
    if (icon) icon.innerHTML = '<i class="fa-solid fa-screwdriver-wrench"></i>';
  }
  if (msg) msg.textContent = gate.message || '';
}

function hideAccessGate() {
  const el = document.getElementById('access-gate');
  if (el) el.style.display = 'none';
}

document.getElementById('btn-gate-logout')?.addEventListener('click', () => {
  auth.signOut();
});


function isNavMoreOpen() {
  const sheet = document.getElementById('nav-more-sheet');
  return !!(sheet && sheet.classList.contains('open'));
}

function closeNavMore() {
  const sheet = document.getElementById('nav-more-sheet');
  const moreBtn = document.getElementById('btn-nav-more');
  const backdrop = document.getElementById('nav-backdrop');
  if (sheet) {
    sheet.classList.remove('open');
    // Sau animation mới ẩn hẳn
    const hide = () => {
      if (!sheet.classList.contains('open')) {
        sheet.hidden = true;
        sheet.setAttribute('hidden', '');
      }
    };
    sheet.addEventListener('transitionend', function onEnd(e) {
      if (e.target !== sheet) return;
      sheet.removeEventListener('transitionend', onEnd);
      hide();
    });
    setTimeout(hide, 280);
  }
  if (moreBtn) {
    moreBtn.setAttribute('aria-expanded', 'false');
    moreBtn.classList.remove('nav-more-open');
  }
  backdrop?.classList.remove('show');
  document.body.classList.remove('nav-more-visible');
}

function openNavMore() {
  const sheet = document.getElementById('nav-more-sheet');
  const moreBtn = document.getElementById('btn-nav-more');
  const backdrop = document.getElementById('nav-backdrop');
  if (sheet) {
    sheet.hidden = false;
    sheet.removeAttribute('hidden');
    // force reflow để animation chạy
    void sheet.offsetWidth;
    sheet.classList.add('open');
    // Stagger animation cho từng item
    const items = sheet.querySelectorAll('.nav-more-item');
    items.forEach((el, i) => {
      el.style.setProperty('--nav-i', String(i));
      el.classList.remove('nav-item-in');
      void el.offsetWidth;
      el.classList.add('nav-item-in');
    });
  }
  if (moreBtn) {
    moreBtn.setAttribute('aria-expanded', 'true');
    moreBtn.classList.add('nav-more-open');
  }
  backdrop?.classList.add('show');
  document.body.classList.add('nav-more-visible');
}

function toggleNavMore() {
  if (isNavMoreOpen()) closeNavMore();
  else openNavMore();
}

function closeMobileNav() {
  closeNavMore();
  document.getElementById('bottom-nav')?.classList.remove('open');
  document.getElementById('menu-toggle')?.classList.remove('hidden');
}

function openMobileNav() {
  openNavMore();
}

document.getElementById('menu-toggle')?.addEventListener('click', openMobileNav);
document.getElementById('nav-backdrop')?.addEventListener('click', (e) => {
  e.preventDefault();
  closeNavMore();
});
document.getElementById('btn-nav-more')?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  toggleNavMore();
});

// Chạm bất kỳ đâu ngoài menu Thêm + nút Thêm → đóng
document.addEventListener('pointerdown', (e) => {
  if (!isNavMoreOpen()) return;
  const sheet = document.getElementById('nav-more-sheet');
  const moreBtn = document.getElementById('btn-nav-more');
  const t = e.target;
  if (sheet && sheet.contains(t)) return;
  if (moreBtn && moreBtn.contains(t)) return;
  closeNavMore();
}, true);

// Admin / Đăng xuất trong menu Thêm — bắt chắc sự kiện (không bị scrub/dock chặn)
document.getElementById('btn-admin')?.addEventListener('pointerup', (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeNavMore();
  window.location.href = 'admin';
}, true);
document.getElementById('btn-logout')?.addEventListener('pointerup', async (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeNavMore();
  try {
    await auth.signOut();
  } catch (_) {}
  currentUser = null;
  currentPlayer = null;
  isAdmin = false;
  if (typeof showLogin === 'function') showLogin();
}, true);

const NAV_PRIMARY_PAGES = { garden: 1, shop: 1, inventory: 1, quests: 1 };

function syncNavActive(page) {
  document.querySelectorAll('.nav-btn[data-page]').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });
  const moreBtn = document.getElementById('btn-nav-more');
  if (moreBtn) {
    const inMore = page && !NAV_PRIMARY_PAGES[page];
    moreBtn.classList.toggle('active', !!inMore);
  }
}

let _goToPageLock = { page: null, at: 0 };

function goToPage(page) {
  if (!page) return;
  // Chặn double-fire: cùng page trong 400ms chỉ chạy 1 lần
  const now = Date.now();
  if (_goToPageLock.page === page && (now - _goToPageLock.at) < 400) return;
  _goToPageLock = { page, at: now };

  syncNavActive(page);
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page)?.classList.add('active');
  try { sessionStorage.setItem('vx_page', page); } catch (_) {}
  closeNavMore();
  if (page === 'garden') renderGarden();
  if (page === 'shop') renderShop();
  if (page === 'inventory') renderInventory();
  if (page === 'kitchen') renderKitchen();
  if (page === 'quests') renderQuests();
  if (page === 'market') renderMarket();
  if (page === 'bank') renderBank();
  if (page === 'stats') renderStats();
  if (page === 'level') renderLevelPage();
  if (page === 'activity') {
    if (typeof closeActivityDetail === 'function') closeActivityDetail();
    renderActivityPage();
  } else if (typeof closeActivityDetail === 'function') {
    // Rời trang activity → đóng panel chi tiết
    try { closeActivityDetail(); } catch (_) {}
  }
  if (page === 'rank') renderRank();
  if (page === 'friends') renderFriends();
  if (page === 'profile') renderProfile();
  if (page === 'mail') loadPlayerMailbox();
}

// Nav: event delegation — chắc chắn 4 nút chính luôn bấm được
(function bindNavClicks() {
  function onNavClick(e) {
    const btn = e.target.closest('.nav-btn');
    if (!btn) return;
    if (btn.id === 'btn-admin' || btn.id === 'btn-logout' || btn.id === 'btn-nav-more') return;
    const page = btn.dataset.page;
    if (!page) return;
    e.preventDefault();
    e.stopPropagation();
    // Luôn gỡ trạng thái menu Thêm (tránh pointer-events bị khóa)
    try {
      document.body.classList.remove('nav-more-visible');
      document.getElementById('nav-backdrop')?.classList.remove('show');
    } catch (_) {}
    goToPage(page);
  }
  const dock = document.querySelector('#bottom-nav .nav-dock');
  if (dock) dock.addEventListener('click', onNavClick);
  const moreGrid = document.querySelector('#nav-more-sheet .nav-more-grid');
  if (moreGrid) moreGrid.addEventListener('click', onNavClick);
  // Fallback: từng nút (phòng HTML khác)
  document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
    if (btn.dataset.navBound === '1') return;
    btn.dataset.navBound = '1';
    btn.addEventListener('click', onNavClick);
  });
})();

/* Scrub nav đã tắt — gây conflict pointer với nút bottom dock */
(function setupNavTabScrub() {
  // no-op (giữ hàm để không vỡ reference cũ nếu có)
  function init() {}
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();



document.getElementById('btn-admin')?.addEventListener('click', () => {
  window.location.href = 'admin';
});


let rankKey = 'planted';
document.querySelectorAll('.rank-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.rank-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    rankKey = btn.dataset.rank;
    renderRank();
  });
});

async function renderRank() {
  const list = document.getElementById('rank-list');
  if (!list) return;
  list.innerHTML = '<p class="empty-state">Đang tải...</p>';
  try {
    const snap = await db.ref('leaderboard').once('value');
    const data = snap.val() || {};
    let rows = Object.values(data);
    rows.sort((a, b) => (b[rankKey] || 0) - (a[rankKey] || 0));
    rows = rows.slice(0, 10);
    if (!rows.length) {
      list.innerHTML = '<p class="empty-state">Chưa có dữ liệu xếp hạng. Chơi một chút rồi quay lại!</p>';
      return;
    }
    const labels = { planted: 'đã trồng', harvested: 'thu hoạch', coins: 'xu', collection: 'sưu tầm' };
    list.innerHTML = rows.map((r, i) => {
      const cls = i === 0 ? 'top1' : i === 1 ? 'top2' : i === 2 ? 'top3' : '';
      const val = rankKey === 'coins' ? (r.coins || 0).toLocaleString() + '🪙' : (r[rankKey] || 0).toLocaleString();
      const av = r.avatar ? `<img class="rank-av" src="${r.avatar}" alt="" onerror="this.style.display=\'none\'" />` : `<span class="rank-av-fb"><i class="fa-solid fa-user"></i></span>`;
      return `<div class="rank-item ${cls}">
        <div class="rank-pos">${i + 1}</div>
        ${av}
        <div class="rank-name">${r.name || 'Player'} <span class="lv-badge">Lv ${r.level || 1}</span></div>
        <div class="rank-val">${val}</div>
      </div>`;
    }).join('');
  } catch (e) {
    console.error(e);
    list.innerHTML = '<p class="empty-state">Không tải được BXH. Kiểm tra Firebase Rules (node leaderboard).</p>';
  }
}


let chatFriendUid = null;
let chatUnsub = null;

async function renderFriends() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) closeChat();
  else {
    
    if (!chatFriendUid) {
      document.getElementById('chat-panel')?.classList.remove('hidden');
      document.getElementById('friends-panel')?.classList.remove('hidden');
    }
  }
  
  const friendInp = document.getElementById('friend-uid-input');
  if (friendInp) {
    friendInp.setAttribute('placeholder', 'Nhập UID bạn bè');
    friendInp.setAttribute('autocomplete', 'off');
    friendInp.setAttribute('type', 'text');
    
    const v = (friendInp.value || '').trim();
    if (!v || v.includes('@') || /demo|example|test/i.test(v)) {
      friendInp.value = '';
    }
  }
  const list = document.getElementById('friends-list');
  if (!list || !currentUser) return;
  list.innerHTML = '<p class="empty-state">Đang tải...</p>';
  try {
    const [snap, lbSnap] = await Promise.all([
      db.ref('friends/' + currentUser.uid).once('value'),
      db.ref('leaderboard').once('value')
    ]);
    const friends = snap.val() || {};
    const lb = lbSnap.val() || {};
    const ids = Object.keys(friends);
    if (!ids.length) {
      list.innerHTML = '<p class="empty-state">Chưa có bạn. Nhập UID để kết bạn.</p>';
      return;
    }
    const nameMap = {};
    list.innerHTML = ids.map(uid => {
      const f = friends[uid];
      
      const liveName = (lb[uid] && lb[uid].name) || f.name || uid.slice(0, 8);
      nameMap[uid] = liveName;
      return `<div class="friend-item" data-uid="${uid}">
        <span><i class="fa-solid fa-user"></i> ${escapeHtml(liveName)}</span>
        <div class="friend-actions">
          <button class="btn btn-primary btn-sm btn-visit-friend" data-uid="${uid}" data-name="${escapeHtml(liveName)}"><i class="fa-solid fa-house-chimney"></i> Thăm</button>
          <button class="btn btn-secondary btn-sm btn-chat-friend" data-uid="${uid}">Chat</button>
        </div>
      </div>`;
    }).join('');
    list.querySelectorAll('.btn-chat-friend').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const uid = btn.dataset.uid;
        openChat(uid, nameMap[uid] || uid.slice(0, 8));
      });
    });
    list.querySelectorAll('.btn-visit-friend').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openVisitGarden(btn.dataset.uid, btn.dataset.name || nameMap[btn.dataset.uid] || 'Bạn');
      });
    });
    
    if (chatFriendUid && nameMap[chatFriendUid]) {
      const nameEl = document.getElementById('chat-with-name');
      if (nameEl) nameEl.textContent = nameMap[chatFriendUid];
    }
  } catch (e) {
    console.error(e);
    list.innerHTML = '<p class="empty-state">Lỗi tải bạn bè. Cập nhật Firebase Rules.</p>';
  }
}


async function openVisitGarden(friendUid, friendName) {
  const modal = document.getElementById('modal-visit');
  const title = document.getElementById('visit-title');
  const grid = document.getElementById('visit-grid');
  const meta = document.getElementById('visit-meta');
  const helpBtn = document.getElementById('btn-help-water');
  if (!modal || !grid || !currentUser) return;

  title.textContent = `Vườn của ${friendName || 'bạn'}`;
  grid.innerHTML = '<p class="empty-state">Đang tải vườn...</p>';
  if (meta) meta.textContent = '';
  modal.classList.add('show');
  helpBtn.dataset.uid = friendUid;
  helpBtn.dataset.name = friendName || '';
  const today = (typeof gameDateString === 'function') ? gameDateString() : new Date().toDateString();
  const already = currentPlayer && currentPlayer.helpWaterLog && currentPlayer.helpWaterLog[friendUid] === today;
  helpBtn.disabled = !!already;
  helpBtn.innerHTML = already
    ? '<i class="fa-solid fa-check"></i> Đã tưới giúp hôm nay'
    : '<i class="fa-solid fa-droplet"></i> Tưới giúp (+coin)';

  try {
    const snap = await db.ref('publicGardens/' + friendUid).once('value');
    if (!snap.exists()) {
      grid.innerHTML = '<p class="empty-state">Bạn này chưa đồng bộ vườn công khai.<br>Họ cần vào game một lần (cập nhật Rules nếu lỗi).</p>';
      return;
    }
    const data = snap.val();
    const plots = Array.isArray(data.plots) ? data.plots : Object.values(data.plots || {});
    if (meta) {
      const updated = data.updatedAt ? (typeof formatGameDateTime==='function'?formatGameDateTime(data.updatedAt):new Date(data.updatedAt).toLocaleString('vi-VN')) : '—';
      meta.textContent = `Lv.${data.level || 1} · ${plots.length} ô · Cập nhật: ${updated}`;
    }
    if (!plots.length) {
      grid.innerHTML = '<p class="empty-state">Vườn trống.</p>';
      return;
    }
    grid.innerHTML = '';
    plots.forEach((plot, i) => {
      const div = document.createElement('div');
      div.className = 'plot visit-plot';
      if (!plot.plantId) {
        div.classList.add('empty');
        div.innerHTML = `<div class="plot-icon">🟫</div><div class="plot-name">Trống</div>`;
      } else {
        const plant = Game.getPlant(plot.plantId);
        const progress = Game.getProgress(plot);
        const ready = progress >= 100;
        const stage = Game.getStage(plot);
        if (ready) div.classList.add('ready');
        else div.classList.add('growing');
        const water = plot.waterCount > 0 ? `<span class="plot-badge-water">💧${plot.waterCount > 1 ? plot.waterCount : ''}</span>` : '';
        const fert = plot.fertilizerId ? `<span class="plot-badge-fert">🧪</span>` : '';
        div.innerHTML = `
          <div class="plot-badges"><span class="plot-badge-left">${water}</span><span class="plot-badge-right">${fert}</span></div>
          <div class="plot-icon">${stage.icon || (plant && plant.icon) || '🌱'}</div>
          <div class="plot-name">${plant ? plant.name : plot.plantId}</div>
          <div class="plot-status">${ready ? '✨ Sẵn sàng' : stage.label + ' · ' + progress + '%'}</div>
          ${!ready ? `<div class="plot-progress"><div class="plot-progress-bar" style="width:${progress}%"></div></div>` : ''}
        `;
      }
      grid.appendChild(div);
    });
  } catch (e) {
    console.error(e);
    grid.innerHTML = `<p class="empty-state">Không đọc được vườn.<br>Hãy cập nhật Firebase Rules (publicGardens).<br><small>${escapeHtml(e.message || '')}</small></p>`;
  }
}

document.getElementById('btn-help-water')?.addEventListener('click', async () => {
  const btn = document.getElementById('btn-help-water');
  const uid = btn && btn.dataset.uid;
  if (!uid) return;
  btn.disabled = true;
  const res = await Game.helpWaterFriend(uid);
  showToast(res.msg, res.ok ? 'success' : 'error');
  if (res.ok) {
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Đã tưới giúp hôm nay';
  } else {
    btn.disabled = false;
  }
});

document.getElementById('btn-add-friend')?.addEventListener('click', async () => {
  const input = document.getElementById('friend-uid-input');
  const q = (input.value || '').trim();
  if (!q || !currentUser) return;
  try {
    
    let targetUid = q;
    let targetName = q;
    const lb = await db.ref('leaderboard').once('value');
    const all = lb.val() || {};
    if (!all[q]) {
      const found = Object.values(all).find(x =>
        (x.name && x.name.toLowerCase() === q.toLowerCase()) ||
        (x.uid && x.uid === q)
      );
      if (found) {
        targetUid = found.uid;
        targetName = found.name;
      } else {
        showToast('Không tìm thấy người chơi. Hãy dùng đúng UID.', 'error');
        return;
      }
    } else {
      targetName = all[q].name || q;
    }
    if (targetUid === currentUser.uid) {
      showToast('Không thể tự kết bạn!', 'error');
      return;
    }
    const myName = getDisplayName();
    await db.ref('friends/' + currentUser.uid + '/' + targetUid).set({
      uid: targetUid, name: targetName, since: Date.now()
    });
    await db.ref('friends/' + targetUid + '/' + currentUser.uid).set({
      uid: currentUser.uid, name: myName, since: Date.now()
    });
    showToast('Đã gửi / thêm bạn!', 'success');
    input.value = '';
    renderFriends();
  } catch (e) {
    console.error(e);
    showToast('Lỗi kết bạn: ' + e.message, 'error');
  }
});

function chatId(a, b) {
  return [a, b].sort().join('_');
}

async function openChat(uid, name) {
  chatFriendUid = uid;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const chatPanel = document.getElementById('chat-panel');
  if (isMobile) {
    document.getElementById('friends-panel')?.classList.add('hidden');
    chatPanel?.classList.add('chat-open');
    document.body.classList.add('chat-open-mobile');
  }
  chatPanel?.classList.remove('hidden');
  
  if (chatPanel) {
    chatPanel.classList.remove('chat-animating');
    void chatPanel.offsetWidth;
    chatPanel.classList.add('chat-animating');
    const onEnd = () => {
      chatPanel.classList.remove('chat-animating');
      chatPanel.removeEventListener('animationend', onEnd);
    };
    chatPanel.addEventListener('animationend', onEnd);
  }
  const nameEl = document.getElementById('chat-with-name');
  if (nameEl) nameEl.textContent = name || uid.slice(0, 8);
  updateChatStreakDisplay(uid);
  const box = document.getElementById('chat-messages');
  box.innerHTML = '';
  const cid = chatId(currentUser.uid, uid);
  if (chatUnsub) {
    try { db.ref('messages/' + chatUnsub).off(); } catch (_) {}
  }
  chatUnsub = cid;
  
  let myAv = (currentPlayer && currentPlayer.avatar) || '';
  let friendAv = '';
  try {
    const lbSnap = await db.ref('leaderboard/' + uid).once('value');
    const lb = lbSnap.val();
    if (lb && lb.avatar) friendAv = lb.avatar;
    if (lb && lb.name) {
      const nameEl = document.getElementById('chat-with-name');
      if (nameEl) nameEl.textContent = lb.name;
    }
  } catch (_) {}

  db.ref('messages/' + cid).limitToLast(80).on('value', snap => {
    const val = snap.val() || {};
    const msgs = Object.keys(val).map(k => ({ id: k, ...val[k] }))
      .sort((a, b) => (a.at || 0) - (b.at || 0));
    box.innerHTML = msgs.map(m => {
      const me = m.from === currentUser.uid;
      const fullTime = m.at
        ? (typeof formatGameDateTime==='function'?formatGameDateTime(m.at, true):new Date(m.at).toLocaleString('vi-VN'))
        : '';
      const av = me ? myAv : friendAv;
      const avHtml = av
        ? `<img class="chat-av" src="${escapeHtml(av)}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'" /><span class="chat-av-fb" style="display:none"><i class="fa-solid fa-user"></i></span>`
        : `<span class="chat-av-fb"><i class="fa-solid fa-user"></i></span>`;
      const tip = fullTime ? ` title="${escapeHtml(fullTime)}"` : '';
      return `<div class="chat-row ${me ? 'me' : 'them'}">
        <div class="chat-av-wrap">${avHtml}</div>
        <div class="chat-bubble ${me ? 'me' : 'them'}"${tip}>${escapeHtml(m.text || '')}<span class="chat-time-tip">${escapeHtml(fullTime)}</span></div>
      </div>`;
    }).join('');
    box.scrollTop = box.scrollHeight;
  });
}

function closeChat() {
  chatFriendUid = null;
  if (chatUnsub) {
    try { db.ref('messages/' + chatUnsub).off(); } catch (_) {}
    chatUnsub = null;
  }
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  document.getElementById('chat-panel')?.classList.remove('chat-open');
  document.body.classList.remove('chat-open-mobile');
  if (isMobile) {
    document.getElementById('chat-panel')?.classList.add('hidden');
  }
  document.getElementById('friends-panel')?.classList.remove('hidden');
  const box = document.getElementById('chat-messages');
  if (box) box.innerHTML = '';
  const nameEl = document.getElementById('chat-with-name');
  if (nameEl) nameEl.textContent = 'Chọn bạn để chat';
}

document.getElementById('btn-chat-back')?.addEventListener('click', closeChat);

async function updateChatStreakDisplay(friendUid) {
  const el = document.getElementById('chat-streak');
  if (!el || !currentUser) return;
  try {
    const snap = await db.ref('chatStreaks/' + chatId(currentUser.uid, friendUid)).once('value');
    const s = snap.val() || { count: 0 };
    el.textContent = s.count > 0 ? `🔥 ${s.count} ngày` : '';
  } catch (_) { el.textContent = ''; }
}

async function bumpChatStreak(friendUid) {
  if (!currentUser || !friendUid) return;
  const key = chatId(currentUser.uid, friendUid);
  const ref = db.ref('chatStreaks/' + key);
  const today = (typeof gameDateString === 'function') ? gameDateString() : new Date().toDateString();
  const snap = await ref.once('value');
  const s = snap.val() || { count: 0, lastDay: '' };
  if (s.lastDay === today) {
    await updateChatStreakDisplay(friendUid);
    return;
  }
  const yesterday = (typeof gameDateString === 'function') ? gameDateString((typeof nowMs==='function'?nowMs():Date.now()) - 86400000) : new Date(Date.now() - 86400000).toDateString();
  const next = (s.lastDay === yesterday) ? (s.count || 0) + 1 : 1;
  await ref.set({ count: next, lastDay: today });
  if (currentPlayer) {
    currentPlayer.maxChatStreak = Math.max(currentPlayer.maxChatStreak || 0, next);
    const ach = Game.checkAchievements();
    await savePlayer();
    Game.notifyAchievements(ach);
  }
  await updateChatStreakDisplay(friendUid);
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

document.getElementById('btn-send-chat')?.addEventListener('click', sendChat);
document.getElementById('chat-input')?.addEventListener('keydown', e => {
  if (e.key === 'Enter') sendChat();
});

async function sendChat() {
  if (!chatFriendUid || !currentUser) return;
  const input = document.getElementById('chat-input');
  const text = (input.value || '').trim();
  if (!text) return;
  const cid = chatId(currentUser.uid, chatFriendUid);
  try {
    await db.ref('messages/' + cid).push({
      from: currentUser.uid,
      text,
      at: Date.now()
    });
    input.value = '';
    await bumpChatStreak(chatFriendUid);
  } catch (e) {
    showToast('Gửi lỗi: ' + e.message, 'error');
  }
}





function applySiteIcon(url) {
  url = (url || (typeof currentSettings !== 'undefined' && currentSettings && currentSettings.siteIconUrl) || '').trim();
  let link = document.querySelector('link[rel="icon"]');
  if (!url) {
    if (link && link.dataset.dynamic === '1') link.remove();
    return;
  }
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    link.dataset.dynamic = '1';
    document.head.appendChild(link);
  }
  link.href = url;
}

function applyProfileCompanion() {
  const el = document.getElementById('profile-companion');
  if (!el) return;
  const id = currentPlayer && currentPlayer.companionId;
  const c = id && Game.getCompanion ? Game.getCompanion(id) : null;
  if (c) {
    el.textContent = c.icon || '🐾';
    el.style.display = 'flex';
    el.title = c.name || '';
  } else {
    el.textContent = '';
    el.style.display = 'none';
  }
}

function applyProfileBadge() {
  const el = document.getElementById('profile-badge');
  const wrap = document.getElementById('profile-avatar-wrap');
  if (!el) return;
  const id = currentPlayer && currentPlayer.avatarBadgeId;
  const owned = id && currentPlayer.avatarBadges && currentPlayer.avatarBadges[id];
  const b = id && Game.getAvatarBadge ? Game.getAvatarBadge(id) : null;
  const fa = (owned && owned.fa) || (b && b.fa) || null;
  if (fa) {
    el.innerHTML = '<i class="' + fa + '"></i>';
    el.style.display = 'flex';
    el.title = (b && b.name) || (owned && owned.slug) || id || '';
    if (wrap) wrap.classList.add('has-badge');
  } else {
    el.innerHTML = '';
    el.style.display = 'none';
    if (wrap) wrap.classList.remove('has-badge');
  }
}


function shopOwnedLabel(state) {
  if (state === 'equipped') return '<span class="owned-ico"><i class="fa-solid fa-circle-check"></i></span> Đang gắn';
  if (state === 'owned') return '<span class="owned-ico"><i class="fa-solid fa-check"></i></span> Đã sở hữu';
  if (state === 'none') return '<span class="owned-ico"><i class="fa-regular fa-circle"></i></span> Chưa có';
  return String(state || '');
}

function applyProfileAvatarFrame() {
  const wrap = document.getElementById('profile-avatar-wrap');
  if (!wrap) return;
  const frameId = currentPlayer && currentPlayer.avatarFrameId;
  const frame = (frameId && typeof Game !== 'undefined' && Game.getAvatarFrame)
    ? Game.getAvatarFrame(frameId)
    : null;
  if (frame && frame.gradient) {
    wrap.classList.add('has-frame');
    wrap.style.setProperty('--avatar-frame-grad', frame.gradient);
    
    let conic = frame.gradient;
    if (/linear-gradient/i.test(conic)) {
      conic = conic.replace(/linear-gradient\s*\(\s*[^,]+,/i, 'conic-gradient(from 0deg,');
    } else if (!/conic-gradient/i.test(conic)) {
      conic = 'conic-gradient(from 0deg, ' + conic + ', ' + conic + ')';
    }
    wrap.style.setProperty('--avatar-frame-conic', conic);
  } else {
    wrap.classList.remove('has-frame');
    wrap.style.removeProperty('--avatar-frame-grad');
    wrap.style.removeProperty('--avatar-frame-conic');
  }
}


function renderProfile() {
  if (currentPlayer && typeof updateProfileLevelTag === "function") updateProfileLevelTag(currentPlayer.level || 1);
  if (typeof updateLoginStreakUI === 'function') updateLoginStreakUI();
  if (!currentUser || !currentPlayer) return;
  document.getElementById('profile-uid').textContent = currentUser.uid;
  document.getElementById('profile-name').value = getDisplayName();
  document.getElementById('profile-avatar').value = currentPlayer.avatar || '';
  const bday = currentPlayer.birthday || {};
  const dEl = document.getElementById('profile-bday-day');
  const mEl = document.getElementById('profile-bday-month');
  const yEl = document.getElementById('profile-bday-year');
  if (dEl) dEl.value = bday.day || '';
  if (mEl) mEl.value = bday.month || '';
  if (yEl) yEl.value = bday.year || '';
  const fName = document.getElementById('profile-fairy-name');
  const nName = document.getElementById('profile-nyc-name');
  const hName = document.getElementById('profile-helper-name');
  if (fName) fName.value = (Game.getFairyConfig && Game.getFairyConfig().customName) || '';
  if (nName) nName.value = (Game.getNycConfig && Game.getNycConfig().customName) || '';
  if (hName) hName.value = (Game.getHelperConfig && Game.getHelperConfig().customName) || '';
  const rName = document.getElementById('profile-robot-name');
  if (rName) rName.value = (Game.getRobotConfig && Game.getRobotConfig().customName) || '';
  const fGen = (Game.getFairyGender && Game.getFairyGender()) || 'female';
  const nGen = (Game.getNycGender && Game.getNycGender()) || 'female';
  const hGen = (Game.getHelperConfig && Game.getHelperConfig().gender) || 'female';
  const rGen = (Game.getRobotConfig && Game.getRobotConfig().gender) || 'female';
  const pf = document.querySelector(`input[name="profile-fairy-gender"][value="${fGen}"]`);
  const pn = document.querySelector(`input[name="profile-nyc-gender"][value="${nGen}"]`);
  const ph = document.querySelector(`input[name="profile-helper-gender"][value="${hGen}"]`);
  const pr = document.querySelector(`input[name="profile-robot-gender"][value="${rGen}"]`);
  if (pf) pf.checked = true;
  if (pn) pn.checked = true;
  if (ph) ph.checked = true;
  if (pr) pr.checked = true;
  // Hiện field + buff Người máy nếu admin đã cấp
  const hasRob = !!(Game.hasRobot && Game.hasRobot());
  const robField = document.getElementById('profile-robot-field');
  const robCard = document.getElementById('buff-card-robot');
  if (robField) robField.style.display = hasRob ? '' : 'none';
  if (robCard) robCard.style.display = hasRob ? '' : 'none';
  const robMenu = document.getElementById('btn-support-robot');
  if (robMenu) robMenu.style.display = hasRob ? '' : 'none';
  loadPlayerMailbox();
  maybeSendBirthdayMailLocal();
  const img = document.getElementById('profile-avatar-img');
  const fb = document.getElementById('profile-avatar-fallback');
  if (currentPlayer.avatar) {
    img.src = currentPlayer.avatar;
    img.style.display = 'block';
    fb.style.display = 'none';
  } else {
    img.style.display = 'none';
    fb.style.display = 'flex';
  }
  applyProfileAvatarFrame();
  applyProfileCompanion();
  if (typeof applyProfileBadge === 'function') applyProfileBadge();
  const prefs = Game.getBuffPrefs();
  const fEl = document.getElementById('pref-fairy-enabled');
  const nEl = document.getElementById('pref-nyc-enabled');
  const hEl = document.getElementById('pref-helper-enabled');
  const fvEl = document.getElementById('pref-fairy-visual');
  const nvEl = document.getElementById('pref-nyc-visual');
  const hvEl = document.getElementById('pref-helper-visual');
  if (fEl) fEl.checked = !!prefs.fairyEnabled;
  if (nEl) nEl.checked = !!prefs.nycEnabled;
  if (hEl) hEl.checked = !!prefs.helperEnabled;
  if (fvEl) fvEl.checked = !!prefs.fairyVisual;
  if (nvEl) nvEl.checked = !!prefs.nycVisual;
  if (hvEl) hvEl.checked = !!prefs.helperVisual;
  const rEl = document.getElementById('pref-robot-enabled');
  const rvEl = document.getElementById('pref-robot-visual');
  if (rEl) rEl.checked = prefs.robotEnabled !== false;
  if (rvEl) rvEl.checked = prefs.robotVisual !== false;
  highlightPrefComboButtons();
}

document.getElementById('btn-copy-uid')?.addEventListener('click', async () => {
  const uid = currentUser?.uid || '';
  try {
    await navigator.clipboard.writeText(uid);
    showToast('Đã copy UID!', 'success');
  } catch (_) {
    showToast(uid, 'success');
  }
});

document.getElementById('btn-save-profile')?.addEventListener('click', async () => {
  if (!currentPlayer || !currentUser) return;
  const name = (document.getElementById('profile-name').value || '').trim().slice(0, 32);
  const avatar = (document.getElementById('profile-avatar').value || '').trim();
  currentPlayer.displayName = name || currentPlayer.displayName || 'Player';
  currentPlayer.avatar = avatar;
  const bd = parseInt(document.getElementById('profile-bday-day')?.value, 10) || 0;
  const bm = parseInt(document.getElementById('profile-bday-month')?.value, 10) || 0;
  const by = parseInt(document.getElementById('profile-bday-year')?.value, 10) || 0;
  if (bd >= 1 && bd <= 31 && bm >= 1 && bm <= 12) {
    currentPlayer.birthday = { day: bd, month: bm, year: by >= 1950 && by <= 2020 ? by : 0 };
  }
  const fairyName = (document.getElementById('profile-fairy-name')?.value || '').trim().slice(0, 20);
  const nycName = (document.getElementById('profile-nyc-name')?.value || '').trim().slice(0, 20);
  const helperName = (document.getElementById('profile-helper-name')?.value || '').trim().slice(0, 20);
  const robotName = (document.getElementById('profile-robot-name')?.value || '').trim().slice(0, 20);
  const fairyGender = document.querySelector('input[name="profile-fairy-gender"]:checked')?.value || 'female';
  const nycGender = document.querySelector('input[name="profile-nyc-gender"]:checked')?.value || 'female';
  const helperGender = document.querySelector('input[name="profile-helper-gender"]:checked')?.value || 'female';
  const robotGender = document.querySelector('input[name="profile-robot-gender"]:checked')?.value || 'female';
  if (typeof Game.setFairyConfig === 'function') {
    const fc = Game.getFairyConfig();
    Game.setFairyConfig({ ...fc, customName: fairyName, gender: fairyGender });
  }
  if (typeof Game.setNycConfig === 'function') {
    const nc = Game.getNycConfig();
    Game.setNycConfig({ ...nc, customName: nycName, gender: nycGender });
  }
  if (typeof Game.setHelperConfig === 'function') {
    const hc = Game.getHelperConfig();
    Game.setHelperConfig({ ...hc, customName: helperName, gender: helperGender });
  }
  if (typeof Game.setRobotConfig === 'function' && Game.hasRobot && Game.hasRobot()) {
    Game.setRobotConfig({ customName: robotName, gender: robotGender });
  }
  Game.setBuffPrefs({
    fairyEnabled: !!document.getElementById('pref-fairy-enabled')?.checked,
    nycEnabled: !!document.getElementById('pref-nyc-enabled')?.checked,
    helperEnabled: !!document.getElementById('pref-helper-enabled')?.checked,
    robotEnabled: !!document.getElementById('pref-robot-enabled')?.checked,
    fairyVisual: !!document.getElementById('pref-fairy-visual')?.checked,
    nycVisual: !!document.getElementById('pref-nyc-visual')?.checked,
    helperVisual: !!document.getElementById('pref-helper-visual')?.checked,
    robotVisual: !!document.getElementById('pref-robot-visual')?.checked
  });
  await savePlayer();
  
  try {
    const myName = currentPlayer.displayName;
    const snap = await db.ref('friends/' + currentUser.uid).once('value');
    const friends = snap.val() || {};
    const updates = {};
    Object.keys(friends).forEach(friendUid => {
      updates['friends/' + friendUid + '/' + currentUser.uid + '/name'] = myName;
    });
    if (Object.keys(updates).length) {
      await db.ref().update(updates);
    }
  } catch (e) {
    console.warn('sync friend names', e);
  }
  showToast('Đã lưu hồ sơ!', 'success');
  renderProfile();
  
  updateFairyBadge();
  updateNycBadge();
  updateHelperBadge();
  try {
    document.querySelectorAll('.garden-decor-fairy').forEach(el => {
      el.style.display = Game.showFairyDecor && Game.showFairyDecor() ? '' : 'none';
    });
    document.querySelectorAll('.garden-decor-nyc').forEach(el => {
      el.style.display = Game.showNycDecor && Game.showNycDecor() ? '' : 'none';
    });
    document.querySelectorAll('.garden-decor-helper').forEach(el => {
      el.style.display = Game.showHelperDecor && Game.showHelperDecor() ? '' : 'none';
    });
    document.querySelectorAll('.garden-decor-robot').forEach(el => {
      el.style.display = Game.showRobotDecor && Game.showRobotDecor() ? '' : 'none';
    });
  } catch (_) {}
});

// Nút xóa tất cả dữ liệu (profile) — giữ role admin
document.getElementById('btn-reset-all-data')?.addEventListener('click', async () => {
  if (!currentUser || !currentPlayer) {
    showToast('Chưa đăng nhập!', 'error');
    return;
  }
  const isAdm = (currentPlayer.role === 'admin') || (typeof isAdmin !== 'undefined' && isAdmin);
  const warn = isAdm
    ? 'Bạn là ADMIN.\n\nXóa TẤT CẢ tiến trình (xu, cây, ô x50, túi đồ, buff…)?\n\n→ Quyền ADMIN vẫn được giữ.\n→ Tên / avatar / ngày sinh giữ lại.\n\nHành động KHÔNG hoàn tác!'
    : 'Xóa TẤT CẢ tiến trình (xu, cây, ô nâng cấp, túi đồ, buff…)?\n\n→ Tài khoản vẫn đăng nhập được.\n→ Nếu bạn là người đầu tiên của game, vẫn là admin.\n\nHành động KHÔNG hoàn tác!';
  if (!confirm(warn)) return;
  if (!confirm('Xác nhận lần 2: thật sự muốn làm lại từ đầu?')) return;

  const btn = document.getElementById('btn-reset-all-data');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang xóa...';
  }
  try {
    if (typeof resetPlayerData !== 'function') {
      showToast('Thiếu hàm resetPlayerData', 'error');
      return;
    }
    const res = await resetPlayerData();
    if (!res || !res.ok) {
      showToast((res && res.msg) || 'Reset thất bại', 'error');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Xóa tất cả dữ liệu &amp; làm lại';
      }
    }
    // Thành công → hàm tự reload
  } catch (e) {
    console.error('reset all data', e);
    showToast('Lỗi: ' + (e && e.message ? e.message : e), 'error');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Xóa tất cả dữ liệu &amp; làm lại';
    }
  }
});

function readPrefFromUI() {
  return {
    fairyEnabled: !!document.getElementById('pref-fairy-enabled')?.checked,
    nycEnabled: !!document.getElementById('pref-nyc-enabled')?.checked,
    helperEnabled: !!document.getElementById('pref-helper-enabled')?.checked,
    robotEnabled: !!document.getElementById('pref-robot-enabled')?.checked,
    fairyVisual: !!document.getElementById('pref-fairy-visual')?.checked,
    nycVisual: !!document.getElementById('pref-nyc-visual')?.checked,
    helperVisual: !!document.getElementById('pref-helper-visual')?.checked,
    robotVisual: !!document.getElementById('pref-robot-visual')?.checked
  };
}

function writePrefToUI(prefs) {
  const map = [
    ['pref-fairy-enabled', 'fairyEnabled'],
    ['pref-nyc-enabled', 'nycEnabled'],
    ['pref-helper-enabled', 'helperEnabled'],
    ['pref-robot-enabled', 'robotEnabled'],
    ['pref-fairy-visual', 'fairyVisual'],
    ['pref-nyc-visual', 'nycVisual'],
    ['pref-helper-visual', 'helperVisual'],
    ['pref-robot-visual', 'robotVisual']
  ];
  map.forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (el && typeof prefs[key] === 'boolean') el.checked = prefs[key];
  });
  highlightPrefComboButtons();
}

function highlightPrefComboButtons() {
  const p = readPrefFromUI();
  document.querySelectorAll('.pref-combo').forEach(btn => {
    const fv = btn.dataset.fv, fb = btn.dataset.fb, nv = btn.dataset.nv, nb = btn.dataset.nb;
    let match = true;
    if (fv !== '') match = match && (p.fairyVisual === (fv === '1'));
    if (fb !== '') match = match && (p.fairyEnabled === (fb === '1'));
    if (nv !== '') match = match && (p.nycVisual === (nv === '1'));
    if (nb !== '') match = match && (p.nycEnabled === (nb === '1'));
    
    const isBoth = fv !== '' && fb !== '' && nv !== '' && nb !== '';
    const isFairyOnly = fv !== '' && fb !== '' && nv === '' && nb === '';
    const isNycOnly = nv !== '' && nb !== '' && fv === '' && fb === '';
    btn.classList.toggle('active', match && (isBoth || isFairyOnly || isNycOnly));
  });
}

async function applyPrefCombo(btn) {
  const cur = readPrefFromUI();
  const next = { ...cur };
  if (btn.dataset.fv !== '') next.fairyVisual = btn.dataset.fv === '1';
  if (btn.dataset.fb !== '') next.fairyEnabled = btn.dataset.fb === '1';
  if (btn.dataset.nv !== '') next.nycVisual = btn.dataset.nv === '1';
  if (btn.dataset.nb !== '') next.nycEnabled = btn.dataset.nb === '1';
  if (btn.dataset.hv !== '') next.helperVisual = btn.dataset.hv === '1';
  if (btn.dataset.hb !== '') next.helperEnabled = btn.dataset.hb === '1';
  if (btn.dataset.rv !== '') next.robotVisual = btn.dataset.rv === '1';
  if (btn.dataset.rb !== '') next.robotEnabled = btn.dataset.rb === '1';
  writePrefToUI(next);
  if (!currentPlayer) return;
  
  const res = Game.setBuffPrefs(next);
  try { await savePlayer(); } catch (_) {}
  showToast(res.msg || 'Đã cập nhật!', 'success');
  
  updateFairyBadge();
  updateNycBadge();
  updateHelperBadge();
  try {
    if (typeof Game !== 'undefined') {
      document.querySelectorAll('.garden-decor-fairy').forEach(el => {
        el.style.display = Game.showFairyDecor && Game.showFairyDecor() ? '' : 'none';
      });
      document.querySelectorAll('.garden-decor-nyc').forEach(el => {
        el.style.display = Game.showNycDecor && Game.showNycDecor() ? '' : 'none';
      });
      document.querySelectorAll('.garden-decor-helper').forEach(el => {
        el.style.display = Game.showHelperDecor && Game.showHelperDecor() ? '' : 'none';
      });
      document.querySelectorAll('.garden-decor-robot').forEach(el => {
        el.style.display = Game.showRobotDecor && Game.showRobotDecor() ? '' : 'none';
      });
      if (typeof renderGarden === 'function') renderGarden();
    }
  } catch (_) {}
}

document.querySelectorAll('.pref-combo').forEach(btn => {
  btn.addEventListener('click', () => applyPrefCombo(btn));
});

document.getElementById('pref-combo-select')?.addEventListener('change', async (e) => {
  const val = e.target.value || '';
  if (!val) return;
  const parts = val.split('|');
  const fakeBtn = {
    dataset: {
      fv: parts[0] !== undefined ? parts[0] : '',
      fb: parts[1] !== undefined ? parts[1] : '',
      nv: parts[2] !== undefined ? parts[2] : '',
      nb: parts[3] !== undefined ? parts[3] : '',
      hv: parts[4] !== undefined ? parts[4] : '',
      hb: parts[5] !== undefined ? parts[5] : '',
      rv: parts[6] !== undefined ? parts[6] : '',
      rb: parts[7] !== undefined ? parts[7] : ''
    }
  };
  await applyPrefCombo(fakeBtn);
  e.target.value = '';
});

['pref-fairy-enabled', 'pref-nyc-enabled', 'pref-helper-enabled', 'pref-robot-enabled'].forEach(id => {
  document.getElementById(id)?.addEventListener('change', highlightPrefComboButtons);
});




document.getElementById('btn-daily')?.addEventListener('click', async () => {
  const btn = document.getElementById('btn-daily');
  if (btn) btn.disabled = true;
  try {
    if (typeof Game === 'undefined' || !Game.claimDaily) {
      showToast('Game chưa sẵn sàng — F5 lại trang', 'error');
      return;
    }
    const res = await Game.claimDaily();
    if (!res) {
      showToast('Không nhận được phản hồi từ claimDaily', 'error');
      return;
    }
    // Đã nhận rồi → warning (vàng), lỗi thật → error (đỏ)
    const kind = res.ok ? 'success' : (res.already ? 'warning' : 'error');
    showToast(res.msg || (res.ok ? 'Đã nhận thưởng!' : 'Không nhận được thưởng'), kind);
    if (res.ok) {
      updateCoins();
      if (typeof Game.totalFertilizerCount === 'function') {
        const fertEl = document.getElementById('fertilizer-count');
        if (fertEl) fertEl.textContent = Game.totalFertilizerCount();
      }
    }
    updateDailyBtn();
  } catch (e) {
    console.error('claimDaily error', e);
    showToast('Lỗi thưởng ngày: ' + (e && e.message ? e.message : String(e)), 'error');
  } finally {
    if (btn) btn.disabled = false;
  }
});




const PILL_CHECK_SVG = `<svg class="pill-dd-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;
const PILL_ARROW_SVG = `<svg class="pill-dd-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>`;

function closeAllPillMenus(except) {
  document.querySelectorAll('.pill-dd.open').forEach(dd => {
    if (except && dd === except) return;
    dd.classList.remove('open', 'drop-up');
    const trigger = dd.querySelector('.pill-dd-trigger');
    
    let menu = dd.querySelector('.pill-dd-menu');
    if (!menu && dd._portalMenu) menu = dd._portalMenu;
    if (menu) {
      menu.hidden = true;
      menu.classList.remove('pill-dd-portal');
      menu.style.top = '';
      menu.style.left = '';
      menu.style.bottom = '';
      menu.style.right = '';
      menu.style.position = '';
      menu.style.minWidth = '';
      menu.style.maxWidth = '';
      menu.style.maxHeight = '';
      menu.style.zIndex = '';
      
      if (menu.parentNode !== dd) {
        const trig = dd.querySelector('.pill-dd-trigger');
        if (trig && trig.nextSibling) dd.insertBefore(menu, trig.nextSibling);
        else dd.appendChild(menu);
      }
    }
    dd._portalMenu = null;
    document.querySelector('#modal-plot .modal-content')?.classList.remove('dropdown-open');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
  
  document.querySelectorAll('.pill-dd-menu.pill-dd-portal').forEach(m => {
    m.hidden = true;
    m.classList.remove('pill-dd-portal');
  });
}

if (!window.__pillDdDocBound) {
  window.__pillDdDocBound = true;
  document.addEventListener('click', (e) => {
    if (e.target.closest('.pill-dd') || e.target.closest('.pill-dd-menu')) return;
    closeAllPillMenus();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllPillMenus();
  });
  
  window.addEventListener('scroll', (e) => {
    
    const t = e.target;
    if (t && t.closest && (t.closest('.pill-dd-menu') || t.closest('.pill-dd-portal'))) return;
    
    if (t && t.closest && t.closest('#modal-plot .modal-content')) {
      document.querySelectorAll('.pill-dd.open').forEach(dd => {
        const menu = dd._portalMenu || dd.querySelector('.pill-dd-menu');
        const trigger = dd.querySelector('.pill-dd-trigger');
        if (!menu || !trigger || menu.hidden) return;
        const tr = trigger.getBoundingClientRect();
        const minW = Math.max(tr.width, 160);
        let left = tr.left;
        if (left + minW > window.innerWidth - 8) left = Math.max(8, window.innerWidth - minW - 8);
        menu.style.left = left + 'px';
        const openUp = dd.classList.contains('drop-up');
        const mh = Math.min(menu.scrollHeight || 200, 280);
        menu.style.top = openUp
          ? (Math.max(8, tr.top - mh - 6) + 'px')
          : ((tr.bottom + 6) + 'px');
      });
      return;
    }
    closeAllPillMenus();
  }, true);
  window.addEventListener('resize', () => closeAllPillMenus());
}






function mountPillDropdown(select, opts = {}) {
  if (!select || select.tagName !== 'SELECT') return null;
  
  if (select.dataset.pillMounted === '1' && select._pillRefresh) {
    select._pillRefresh();
    return select._pillWrap || null;
  }

  const prefix = opts.prefix || select.dataset.pillPrefix || '';
  const block = !!(opts.block || select.dataset.pillBlock === '1' || select.classList.contains('ux-select'));

  const wrap = document.createElement('div');
  wrap.className = 'pill-dd' + (block ? ' pill-dd-block' : '');

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'pill-dd-trigger';
  trigger.setAttribute('aria-haspopup', 'listbox');
  trigger.setAttribute('aria-expanded', 'false');

  const menu = document.createElement('div');
  menu.className = 'pill-dd-menu';
  menu.setAttribute('role', 'listbox');
  menu.hidden = true;

  const parent = select.parentNode;
  if (!parent) return null;
  parent.insertBefore(wrap, select);
  wrap.appendChild(trigger);
  wrap.appendChild(menu);
  wrap.appendChild(select);
  select.classList.add('pill-dd-native');
  select.dataset.pillMounted = '1';
  select._pillWrap = wrap;

  const selectedLabel = () => {
    const opt = select.options[select.selectedIndex];
    return opt ? (opt.textContent || opt.value || '').trim() : '—';
  };

  const updateTrigger = () => {
    const label = selectedLabel();
    trigger.innerHTML = `<span class="pill-dd-trigger-label">${prefix ? `<span class="pill-dd-prefix">${prefix}</span>` : ''}${label}</span>${PILL_ARROW_SVG}`;
  };

  const rebuildMenu = () => {
    menu.innerHTML = '';
    Array.from(select.options).forEach((opt, idx) => {
      if (opt.disabled && opt.value === '' && !opt.textContent) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill-dd-item' + (idx === select.selectedIndex ? ' active' : '');
      btn.setAttribute('role', 'option');
      btn.dataset.value = opt.value;
      const text = (opt.textContent || opt.value || '').trim() || '—';
      btn.innerHTML = `<span class="pill-dd-item-text">${text}</span>${PILL_CHECK_SVG}`;
      if (opt.disabled) {
        btn.disabled = true;
        btn.style.opacity = '0.45';
      } else if (opt.dataset && opt.dataset.dimmed === '1') {
        // Hạt đã cài ở vườn khác — làm mờ để phân biệt, vẫn chọn được
        btn.style.opacity = '0.45';
        btn.classList.add('pill-dd-item-dimmed');
      }
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (opt.disabled) return;
        select.value = opt.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        updateTrigger();
        rebuildMenu();
        closeAllPillMenus();
      });
      menu.appendChild(btn);
    });
  };

  select._pillRefresh = () => {
    updateTrigger();
    rebuildMenu();
  };

  const positionMenu = () => {
    
    if (menu.parentNode !== document.body) {
      document.body.appendChild(menu);
    }
    wrap._portalMenu = menu;
    menu.classList.add('pill-dd-portal');
    menu.style.position = 'fixed';
    menu.style.right = 'auto';
    menu.style.bottom = 'auto';
    menu.hidden = false;

    const tr = trigger.getBoundingClientRect();
    const minW = Math.max(tr.width, 160);
    const spaceBelow = window.innerHeight - tr.bottom - 10;
    const spaceAbove = tr.top - 10;
    
    const isMobile = window.innerWidth <= 900 || (('ontouchstart' in window) && window.innerWidth <= 1200);
    const preferUp = isMobile || !!wrap.closest('.merge-box, #modal-nyc, #modal-fairy, .bulk-panel, #page-inventory');
    let openUp;
    if (preferUp && spaceAbove >= 100) {
      openUp = spaceAbove >= spaceBelow || spaceBelow < 180;
    } else {
      openUp = spaceBelow < Math.min(200, spaceAbove) && spaceAbove > spaceBelow;
    }
    
    const avail = Math.max(120, openUp ? spaceAbove : spaceBelow);
    const maxH = Math.min(320, avail - 4, window.innerHeight - 24);
    menu.style.minWidth = minW + 'px';
    menu.style.maxWidth = Math.min(Math.max(minW, 280), window.innerWidth - 16) + 'px';
    menu.style.maxHeight = maxH + 'px';
    menu.style.overflowY = 'auto';
    menu.style.zIndex = '5000';

    const mh = Math.min(menu.scrollHeight || 200, maxH);
    wrap.classList.toggle('drop-up', openUp);

    let left = tr.left;
    if (left + minW > window.innerWidth - 8) left = Math.max(8, window.innerWidth - minW - 8);
    if (left < 8) left = 8;

    if (openUp) {
      const top = Math.max(8, tr.top - mh - 6);
      menu.style.top = top + 'px';
      menu.style.left = left + 'px';
    } else {
      menu.style.top = (tr.bottom + 6) + 'px';
      menu.style.left = left + 'px';
    }
  };

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const willOpen = menu.hidden || menu.parentNode === document.body && !wrap.classList.contains('open');
    
    const isOpen = wrap.classList.contains('open');
    closeAllPillMenus();
    if (!isOpen) {
      rebuildMenu();
      trigger.setAttribute('aria-expanded', 'true');
      wrap.classList.add('open');
      document.querySelector('#modal-plot .modal-content')?.classList.add('dropdown-open');
      positionMenu();
    }
  });

  select.addEventListener('change', () => {
    updateTrigger();
    rebuildMenu();
  });

  updateTrigger();
  rebuildMenu();
  return wrap;
}

function mountAllPillDropdowns(root) {
  const scope = root || document;
  const map = {
    'market-kind': 'Loại:',
    'market-item': 'Mặt hàng:',
    'bank-term': 'Kỳ hạn:',
    'nyc-plant-select': 'Hạt giống:',
    'fairy-fert-id': 'Loại phân:',
    'merge-plant': 'Hạt ghép:',
    'merge-protect': 'Bảo hộ:',
    'empty-upgrade-select': 'Nâng cấp:',
    'plot-upgrade-select': 'Nâng cấp:',
    'p-type': 'Loại cây:'
  };
  scope.querySelectorAll('select').forEach(sel => {
    if (sel.closest && sel.closest('.pill-dd') && sel.dataset.pillMounted === '1') {
      if (sel._pillRefresh) sel._pillRefresh();
      return;
    }
    const id = sel.id || '';
    const prefix = map[id] || sel.dataset.pillPrefix || '';
    const block = sel.classList.contains('boost-plot-sel') ||
      ['nyc-plant-select', 'fairy-fert-id', 'merge-plant', 'merge-protect', 'empty-upgrade-select', 'plot-upgrade-select', 'p-type'].includes(id) ||
      sel.dataset.pillBlock === '1';
    if (sel.classList.contains('boost-plot-sel')) {
      mountPillDropdown(sel, { prefix: 'Ô:', block: true });
    } else {
      mountPillDropdown(sel, { prefix, block });
    }
  });
}


function renderGardenSwitcher() {
  const host = document.getElementById('garden-switcher');
  if (!host || !currentPlayer || typeof Game === 'undefined') return;
  if (typeof Game.ensureGardens === 'function') Game.ensureGardens();
  const n = Game.getGardenCount();
  const active = Game.getActiveGardenIndex();
  const maxP = Game.MAX_PLOTS_PER_GARDEN || 99;

  const activePlots = (currentPlayer.gardens && currentPlayer.gardens[active]) || [];
  const activeCount = activePlots.length || 0;

  let menuItems = '';
  for (let i = 0; i < n; i++) {
    const plots = (currentPlayer.gardens && currentPlayer.gardens[i]) || [];
    const count = plots.length || 0;
    const isActive = i === active;
    menuItems += `<button type="button" class="pill-dd-item ${isActive ? 'active' : ''}" data-garden="${i}" role="option" aria-selected="${isActive}">
      <span class="pill-dd-item-text"><i class="fa-solid fa-house-chimney-window"></i> Vườn ${i + 1} <small>${count}/${maxP}</small></span>
      ${PILL_CHECK_SVG}
    </button>`;
  }

  let hintHtml = '';
  if (n === 1) {
    const count = (currentPlayer.plots || []).length;
    if (count < maxP) {
      hintHtml = `<span class="garden-switch-hint">Đủ ${maxP} ô sẽ mở Vườn 2</span>`;
    }
  }

  host.innerHTML = `
    <div class="pill-dd" id="garden-dropdown">
      <button type="button" class="pill-dd-trigger" id="garden-dd-trigger" aria-haspopup="listbox" aria-expanded="false" title="Chọn vườn">
        <span class="pill-dd-trigger-label">Vườn ${active + 1} · ${activeCount}/${maxP}</span>
        ${PILL_ARROW_SVG}
      </button>
      <div class="pill-dd-menu" id="garden-dd-menu" role="listbox" hidden>
        ${menuItems}
      </div>
    </div>
    ${hintHtml}`;

  const dropdown = host.querySelector('#garden-dropdown');
  const trigger = host.querySelector('#garden-dd-trigger');
  const menu = host.querySelector('#garden-dd-menu');
  if (!trigger || !menu) return;

  const closeMenu = () => {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    dropdown.classList.remove('open');
  };
  const openMenu = () => {
    closeAllPillMenus();
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
    dropdown.classList.add('open');
  };

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.hidden) openMenu();
    else closeMenu();
  });

  menu.querySelectorAll('.pill-dd-item').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.dataset.garden, 10);
      closeMenu();
      if (isNaN(idx)) return;
      if (idx === Game.getActiveGardenIndex()) return;
      // Chặn spam click khi đang chuyển
      if (window._gardenSwitchBusy) return;
      window._gardenSwitchBusy = true;
      try {
        const res = Game.switchGarden(idx);
        showToast(res.msg, res.ok ? 'success' : 'error');
        if (res.ok) {
          renderGarden();
          updateCoins();
          if (typeof updateNycBadge === 'function') updateNycBadge();
          if (typeof updateFairyBadge === 'function') updateFairyBadge();
          try {
            if (typeof flushSavePlayer === 'function') await flushSavePlayer();
            else if (typeof savePlayer === 'function') await savePlayer();
          } catch (_) {}
        }
      } finally {
        window._gardenSwitchBusy = false;
      }
    });
  });
}

function renderGarden() {
  if (!currentPlayer) return;
  // Đang chạy NYC care — không render (tránh nhảy vườn khi plantMultiple tạm đổi activeGarden)
  if (typeof Game !== 'undefined' && Game._nycBusy) return;
  if (typeof Game.ensureGardens === 'function') Game.ensureGardens();
  renderGardenSwitcher();
  
  if (typeof Game.resetExpiredBoosts === 'function') {
    const changed = Game.resetExpiredBoosts();
    if (changed) {
      if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(2000);
      else if (typeof savePlayer === 'function') savePlayer().catch(() => {});
    }
  }
  const grid = document.getElementById('garden-grid');
  grid.innerHTML = '';

  const weather = Game.getWeather();
  const weatherIconEl = document.getElementById('weather-icon');
  if (weatherIconEl) {
    const faMap = {
      '☀️': 'fa-sun', '🌤️': 'fa-cloud-sun', '⛅': 'fa-cloud-sun',
      '🌦️': 'fa-cloud-sun-rain', '🌧️': 'fa-cloud-showers-heavy', '🌈': 'fa-rainbow'
    };
    const fa = faMap[weather.icon] || 'fa-cloud-sun';
    weatherIconEl.innerHTML = `<i class="fa-solid ${fa}"></i>`;
  }
  document.getElementById('weather-text').textContent = weather.text + ` (${Math.round(weather.mult * 100)}%)`;
  updateCoins();

  const plots = Array.isArray(currentPlayer.plots) ? currentPlayer.plots : Object.values(currentPlayer.plots || {});

  plots.forEach((plot, i) => {
    const div = document.createElement('div');
    div.className = 'plot';
    div.dataset.plotId = String(i);
    const speedM = (typeof Game.getPlotSpeedMult === 'function') ? Game.getPlotSpeedMult(plot) : (plot.specialMult || 1);
    if (plot && speedM > 1) {
      div.classList.add('special-plot');
      const badge = document.createElement('span');
      badge.className = 'plot-special-badge';
      const tempOn = plot.specialMultUntil && plot.specialMultUntil > Date.now();
      badge.textContent = 'x' + speedM + (tempOn ? '⏱' : '');
      badge.title = tempOn
        ? ('Tạm: x' + (plot.specialMultTemp || speedM) + ' còn ' + Game.formatTime(Math.ceil((plot.specialMultUntil - Date.now()) / 1000)))
        : ('Vĩnh viễn x' + (plot.specialMultPermanent || speedM));
      div.appendChild(badge);
    }

    if (!plot.plantId) {
      div.classList.add('empty');
      div.innerHTML = `
        <div class="plot-icon">🟫</div>
        <div class="plot-name">Ô trống</div>
        <div class="plot-status">Nhấn để trồng</div>
      `;
      div.addEventListener('click', () => openEmptyPlotModal(i));
    } else {
      const plant = Game.getPlant(plot.plantId);
      if (!plant) {
        div.classList.add('empty');
        div.innerHTML = `<div class="plot-icon">❓</div><div class="plot-name">Lỗi dữ liệu</div>`;
      } else {
        const progress = Game.getProgress(plot);
        const ready = progress >= 100;
        const stage = Game.getStage(plot);

        if (ready) div.classList.add('ready');
        else div.classList.add('growing');

        const stageIcon = stage.icon;

        let waterBadge = '';
        let fertBadge = '';
        if (plot.waterCount > 0) waterBadge = `<span class="plot-badge-water" title="Đã tưới ${plot.waterCount}/3">💧${plot.waterCount > 1 ? plot.waterCount : ''}</span>`;
        if (plot.fertilizerId) {
          const f = Game.getFertilizer(plot.fertilizerId);
          fertBadge = `<span class="plot-badge-fert" title="${f ? f.name : 'Đã bón'}">${f ? f.icon : '🧪'}</span>`;
        }
        const isMyth = !!(plot.seedMyth || (Game.getPlotSeedTier && Game.getPlotSeedTier(plot) === 'myth'));
        const isStar = !isMyth && !!plot.seedStar;
        if (isMyth) div.classList.add('plot-myth');
        else if (isStar) div.classList.add('plot-star');
        else div.classList.add('plot-normal');
        const starBadge = isMyth
          ? `<span class="plot-badge-myth" title="Hạt huyền thoại">✨</span>`
          : (isStar ? `<span class="plot-badge-star" title="Hạt sao">⭐</span>` : '');

        const remain = Game.getRemainingSeconds(plot);
        // Luôn hiện timer trên ô (kể cả ≤10s)
        const timerHtml = !ready
          ? `<div class="plot-timer" data-role="timer"><i class="fa-regular fa-clock"></i> ${Game.formatTime(remain)}</div>`
          : '';
        div.innerHTML = `
          <div class="plot-badges"><span class="plot-badge-left">${waterBadge}${starBadge}</span><span class="plot-badge-right">${fertBadge}</span></div>
          <div class="plot-icon">${stageIcon}</div>
          <div class="plot-name">${plant.name}${isMyth ? ' ✨' : (isStar ? ' ⭐' : '')}</div>
          <div class="plot-status" data-role="status">${ready ? '✨ Ra hoa/quả!' : stage.label + ' · ' + progress + '%'}</div>
          ${timerHtml}
          ${!ready ? `<div class="plot-progress"><div class="plot-progress-bar" data-role="bar" style="width:${progress}%"></div></div>` : ''}
        `;
        div.addEventListener('click', () => openPlotModal(i));
      }
    }
    grid.appendChild(div);
  });

  
  const agents = document.getElementById('garden-agents');
  const agentHost = agents || grid;
  if (agents) agents.innerHTML = '';
  else grid.querySelectorAll('.garden-decor').forEach(el => el.remove());
  if (Game.showFairyDecor && Game.showFairyDecor()) {
    const emoji = (Game.getFairyEmoji && Game.getFairyEmoji()) || '🧚';
    for (let k = 0; k < 3; k++) {
      const f = document.createElement('div');
      f.className = 'garden-decor garden-decor-fairy garden-roamer';
      f.textContent = emoji;
      f.dataset.path = String(k + 1);
      f.style.setProperty('--delay', (k * 1.4) + 's');
      f.style.left = (8 + k * 30) + '%';
      f.style.top = (12 + k * 24) + '%';
      agentHost.appendChild(f);
    }
  }
  if (Game.showNycDecor && Game.showNycDecor()) {
    const emoji = (Game.getNycEmoji && Game.getNycEmoji()) || '👩‍🌾';
    for (let k = 0; k < 3; k++) {
      const p = document.createElement('div');
      p.className = 'garden-decor garden-decor-nyc garden-roamer';
      p.textContent = emoji;
      p.dataset.path = String(k + 1);
      p.style.setProperty('--delay', (k * 1.6 + 0.5) + 's');
      p.style.left = (20 + k * 26) + '%';
      p.style.top = (28 + k * 20) + '%';
      agentHost.appendChild(p);
    }
  }
  if (Game.showHelperDecor && Game.showHelperDecor()) {
    const emoji = (Game.getHelperEmoji && Game.getHelperEmoji()) || '💁';
    for (let k = 0; k < 3; k++) {
      const h = document.createElement('div');
      h.className = 'garden-decor garden-decor-helper garden-roamer';
      h.textContent = emoji;
      h.dataset.path = String(k + 1);
      h.style.setProperty('--delay', (k * 1.5 + 0.8) + 's');
      h.style.left = (14 + k * 28) + '%';
      h.style.top = (35 + k * 18) + '%';
      agentHost.appendChild(h);
    }
  }
  if (Game.showRobotDecor && Game.showRobotDecor()) {
    const emoji = (Game.getRobotEmoji && Game.getRobotEmoji()) || '🤖';
    for (let k = 0; k < 3; k++) {
      const r = document.createElement('div');
      r.className = 'garden-decor garden-decor-robot garden-roamer';
      r.textContent = emoji;
      r.dataset.path = String(k + 1);
      r.style.setProperty('--delay', (k * 1.7 + 1.0) + 's');
      r.style.left = (24 + k * 22) + '%';
      r.style.top = (18 + k * 22) + '%';
      agentHost.appendChild(r);
    }
  }
  updateGlobalTimer();
}


function openEmptyPlotModal(plotId) {
  selectedPlotId = plotId;
  const plot = currentPlayer.plots[plotId];
  if (!plot) return;
  
  openPlantModal(plotId);
  const list = document.getElementById('plant-seed-list');
  if (!list) return;
  const curMult = Number(plot.specialMult) || 1;
  const tiers = (typeof Features !== 'undefined' && Features.PLOT_UPGRADE_TIERS)
    ? Features.PLOT_UPGRADE_TIERS : [];
  const higher = tiers.filter(x => x.mult > curMult);
  let html = '<div class="plot-upgrade-box" style="margin-bottom:12px"><h4 class="plot-upgrade-title"><i class="fa-solid fa-bolt"></i> Ô #' + (plotId + 1) + ' · <span class="plot-mult-badge">x' + curMult + '</span></h4>';
  if (!higher.length) {
    html += '<p class="bulk-hint">Đã max x50</p></div>';
  } else {
    html += '<div class="plot-upgrade-row"><select id="empty-upgrade-select">';
    higher.forEach(x => {
      const cost = Features.getPlotUpgradeCost(curMult, x.mult);
      html += '<option value="' + x.mult + '">x' + x.mult + ' — ' + Number(cost).toLocaleString() + '🪙</option>';
    });
    html += '</select><button type="button" class="btn btn-warning btn-sm" id="btn-empty-upgrade"><i class="fa-solid fa-arrow-up"></i> Nâng cấp</button></div></div>';
  }
  list.insertAdjacentHTML('afterbegin', html);
  document.getElementById('btn-empty-upgrade')?.addEventListener('click', async (e) => {
    e.stopPropagation();
    const tgt = parseFloat(document.getElementById('empty-upgrade-select')?.value);
    const res = await Features.upgradePlot(plotId, tgt);
    showToast(res.msg, res.ok ? 'success' : 'error');
    if (res.ok) {
      updateCoins();
      closeModals();
      renderGarden();
    }
  });
  mountPillDropdown(document.getElementById('empty-upgrade-select'), { prefix: 'Nâng cấp:', block: true });
}

function openPlantModal(plotId) {
  selectedPlotId = plotId;
  const seeds = (currentPlayer.inventory && currentPlayer.inventory.seeds) || {};
  const stars = (currentPlayer.inventory && currentPlayer.inventory.seedsStar) || {};
  const myths = (currentPlayer.inventory && currentPlayer.inventory.seedsMyth) || {};
  const list = document.getElementById('plant-seed-list');
  list.innerHTML = '';
  const empty = Game.emptyPlotCount();

  const ids = [...new Set([...Object.keys(seeds), ...Object.keys(stars), ...Object.keys(myths)])]
    .filter(id => ((seeds[id] || 0) + (stars[id] || 0) + (myths[id] || 0)) > 0);
  if (ids.length === 0) {
    list.innerHTML = '<p class="empty-state">Bạn chưa có hạt giống nào.<br>Hãy mua ở Cửa hàng!</p>';
  } else {
    const info = document.createElement('p');
    info.style.cssText = 'text-align:center;color:#52796f;font-size:0.9rem;margin-bottom:10px';
    info.textContent = `Ô trống: ${empty} · Ưu tiên ✨ huyền thoại → ⭐ sao → thường`;
    list.appendChild(info);

    ids.sort((a, b) => {
      const pa = Game.getPlant(a), pb = Game.getPlant(b);
      return (pa?.type || '').localeCompare(pb?.type || '');
    });
    ids.forEach(id => {
      const plant = Game.getPlant(id);
      if (!plant) return;
      const mythN = myths[id] || 0;
      const starN = stars[id] || 0;
      const have = (seeds[id] || 0) + starN + mythN;
      const opt = document.createElement('div');
      opt.className = 'seed-option seed-option-compact' + (mythN ? ' seed-option-myth' : '');
      const maxPlant = Math.min(have, empty);
      const tag = mythN ? ' ✨' : (starN ? ' ⭐' : '');
      const nameStr = plant.name + tag;
      const qtyStr = (mythN ? '✨' + mythN + ' ' : '') + (starN ? '⭐' + starN + ' ' : '') + have.toLocaleString();
      const nameLong = nameStr.length > 14 ? ' text-long' : (nameStr.length > 10 ? ' text-mid' : '');
      const qtyLong = qtyStr.length > 16 ? ' text-long' : (qtyStr.length > 12 ? ' text-mid' : '');
      // Ưu tiên kind khi trồng: myth > star > normal
      const prefer = mythN > 0 ? 'myth' : (starN > 0 ? 'star' : 'normal');
      opt.innerHTML = `
        <span class="icon">${plant.icon}</span>
        <div class="info" style="flex:1;min-width:0">
          <div class="name${nameLong}">${nameStr}</div>
          <div class="qty${qtyLong}">${qtyStr}</div>
          <div class="grow-time">${Game.formatTime(plant.growTime)}</div>
        </div>
        <div class="plant-qty-row">
          <input type="number" class="plant-qty-input" min="1" max="${Math.max(1, maxPlant)}" value="1" ${maxPlant < 1 ? 'disabled' : ''} />
          <button class="btn btn-primary btn-sm btn-plant-n" data-id="${id}" data-kind="${prefer}" ${maxPlant < 1 ? 'disabled' : ''}>
            <i class="fa-solid fa-seedling"></i> Trồng
          </button>
        </div>
      `;
      list.appendChild(opt);
    });

    list.querySelectorAll('.btn-plant-n').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const row = btn.closest('.seed-option');
        const input = row?.querySelector('.plant-qty-input');
        let n = parseInt(input?.value, 10) || 1;
        const max = parseInt(input?.max, 10) || 1;
        n = Math.max(1, Math.min(n, max));
        const kind = btn.dataset.kind || null;
        const res = await Game.plantMultiple(btn.dataset.id, n, kind);
        showToast(res.msg, res.ok ? 'success' : 'error');
        closeModals();
        renderGarden();
        updateCoins();
      });
    });
  }
  document.getElementById('modal-plant').classList.add('show');
  if (typeof enhanceQtyInputs === 'function') enhanceQtyInputs(document.getElementById('plant-seed-list'));
}

function openPlotModal(plotId) {
  selectedPlotId = plotId;
  const plot = currentPlayer.plots[plotId];
  const plant = Game.getPlant(plot.plantId);
  if (!plant) return;
  const progress = Game.getProgress(plot);
  const ready = progress >= 100;
  const remain = Game.getRemainingSeconds(plot);
  const stage = Game.getStage(plot);

  const waterDisp = (typeof Game.getWaterDisplayState === 'function')
    ? Game.getWaterDisplayState(plot)
    : { text: `${plot.waterCount || 0}/3 ${plot.watered ? '💧' : ''}`, active: (plot.waterCount || 0) >= 3 };
  const fertDisp = (typeof Game.getFertDisplayState === 'function')
    ? Game.getFertDisplayState(plot)
    : { text: plot.fertilizerId ? ((Game.getFertilizer(plot.fertilizerId) || {}).name || 'Đã bón') : 'Chưa bón phân', active: !!plot.fertilizerId };
  let fertText = fertDisp.text;

  document.getElementById('plot-title').innerHTML = `${plant.icon} ${plant.name}`;
  document.getElementById('plot-detail').innerHTML = `
    <div class="plot-detail-card">
      <p><strong>Giai đoạn:</strong> <span data-role="plot-stage">${ready ? '✨ Sẵn sàng thu hoạch' : stage.label + ' (' + progress + '%)'}</span></p>
      <p><strong>Thời gian còn:</strong> <span data-role="plot-remain">${ready ? '0s' : Game.formatTime(remain)}</span></p>
      <div class="plot-detail-progress">
        <div class="plot-detail-progress-label">Tiến độ ra hoa/quả: <strong data-role="plot-pct">${Math.min(100, progress)}%</strong></div>
        <div class="plot-progress plot-progress-lg"><div class="plot-progress-bar" data-role="plot-bar" style="width:${Math.min(100, progress)}%"></div></div>
      </div>
      <p><strong>Tưới nước:</strong> <span data-role="plot-water" class="${waterDisp.active ? '' : 'plot-boost-off'}">${waterDisp.text}</span></p>
      <p><strong>Phân bón:</strong> <span data-role="plot-fert" class="${fertDisp.active ? '' : 'plot-boost-off'}">${fertText}</span></p>
      <p><strong>Sản lượng gốc:</strong> ${plant.yield} · Giá bán: ${plant.sellPrice}🪙</p>
      ${plant.desc ? `<p class="plot-detail-desc">${plant.desc}</p>` : ''}
    </div>
  `;

  document.getElementById('btn-water').style.display = ready || waterDisp.active ? 'none' : 'inline-flex';
  document.getElementById('btn-fertilize').style.display = ready || fertDisp.active ? 'none' : 'inline-flex';
  document.getElementById('btn-harvest').style.display = ready ? 'inline-flex' : 'none';
  
  const curMult = Number(plot.specialMult) || 1;
  const tiers = (typeof Features !== 'undefined' && Features.PLOT_UPGRADE_TIERS)
    ? Features.PLOT_UPGRADE_TIERS : [{ mult: 1, price: 0 }];
  const higher = tiers.filter(x => x.mult > curMult);
  let upgradeHtml = '<div class="plot-upgrade-box"><h4 class="plot-upgrade-title"><i class="fa-solid fa-bolt"></i> <span>Nâng cấp vĩnh viễn</span> · hiện tại <span class="plot-mult-badge">x' + curMult + '</span></h4>';
  if (!higher.length) {
    upgradeHtml += '<p class="bulk-hint">Đã đạt mức tối đa x50.</p></div>';
  } else {
    upgradeHtml += '<div class="plot-upgrade-row"><select id="plot-upgrade-select">';
    higher.forEach(x => {
      const cost = Features.getPlotUpgradeCost(curMult, x.mult);
      upgradeHtml += '<option value="' + x.mult + '">x' + x.mult + ' — ' + Number(cost).toLocaleString() + '🪙</option>';
    });
    upgradeHtml += '</select><button type="button" class="btn btn-warning btn-sm" id="btn-upgrade-plot"><i class="fa-solid fa-arrow-up"></i> Nâng cấp</button></div></div>';
  }
  document.getElementById('plot-detail').insertAdjacentHTML('beforeend', upgradeHtml);
  document.getElementById('btn-upgrade-plot')?.addEventListener('click', async () => {
    const tgt = parseFloat(document.getElementById('plot-upgrade-select')?.value);
    const res = await Features.upgradePlot(plotId, tgt);
    showToast(res.msg, res.ok ? 'success' : 'error');
    if (res.ok) {
      updateCoins();
      openPlotModal(plotId);
      renderGarden();
    }
  });
  mountPillDropdown(document.getElementById('plot-upgrade-select'), { prefix: 'Nâng cấp:', block: true });

  document.getElementById('modal-plot').classList.add('show');
}


function softUpdatePlotModal() {
  const modal = document.getElementById('modal-plot');
  if (!modal || !modal.classList.contains('show')) return;
  if (selectedPlotId == null || !currentPlayer) return;
  const plot = currentPlayer.plots[selectedPlotId];
  if (!plot || !plot.plantId) return;
  const plant = Game.getPlant(plot.plantId);
  if (!plant) return;

  const progress = Game.getProgress(plot);
  const ready = progress >= 100;
  const remain = Game.getRemainingSeconds(plot);
  const stage = Game.getStage(plot);
  const detail = document.getElementById('plot-detail');
  if (!detail) return;

  const stageEl = detail.querySelector('[data-role="plot-stage"]');
  if (stageEl) stageEl.textContent = ready ? '✨ Sẵn sàng thu hoạch' : stage.label + ' (' + progress + '%)';

  const remainEl = detail.querySelector('[data-role="plot-remain"]');
  if (remainEl) remainEl.textContent = ready ? '0s' : Game.formatTime(remain);

  const pctEl = detail.querySelector('[data-role="plot-pct"]');
  if (pctEl) pctEl.textContent = Math.min(100, progress) + '%';

  const barEl = detail.querySelector('[data-role="plot-bar"]');
  if (barEl) barEl.style.width = Math.min(100, progress) + '%';

  const waterDisp = (typeof Game.getWaterDisplayState === 'function')
    ? Game.getWaterDisplayState(plot)
    : { text: `${plot.waterCount || 0}/3`, active: (plot.waterCount || 0) >= 3 };
  const fertDisp = (typeof Game.getFertDisplayState === 'function')
    ? Game.getFertDisplayState(plot)
    : { text: plot.fertilizerId ? 'Đã bón' : 'Chưa bón phân', active: !!plot.fertilizerId };

  const waterEl = detail.querySelector('[data-role="plot-water"]');
  if (waterEl) {
    waterEl.textContent = waterDisp.text;
    waterEl.classList.toggle('plot-boost-off', !waterDisp.active);
  }
  const fertEl = detail.querySelector('[data-role="plot-fert"]');
  if (fertEl) {
    fertEl.textContent = fertDisp.text;
    fertEl.classList.toggle('plot-boost-off', !fertDisp.active);
  }

  
  const btnWater = document.getElementById('btn-water');
  const btnFert = document.getElementById('btn-fertilize');
  const btnHarvest = document.getElementById('btn-harvest');
  if (btnWater) btnWater.style.display = ready || waterDisp.active ? 'none' : 'inline-flex';
  if (btnFert) btnFert.style.display = ready || fertDisp.active ? 'none' : 'inline-flex';
  if (btnHarvest) btnHarvest.style.display = ready ? 'inline-flex' : 'none';
}

document.getElementById('btn-water').addEventListener('click', async () => {
  const res = await Game.waterPlot(selectedPlotId);
  showToast(res.msg, res.ok ? 'success' : 'error');
  closeModals();
  renderGarden();
});

document.getElementById('btn-fertilize').addEventListener('click', () => {
  openFertModal(selectedPlotId);
});

document.getElementById('btn-harvest').addEventListener('click', async () => {
  const res = await Game.harvestPlot(selectedPlotId);
  showToast(res.msg, res.ok ? 'success' : 'error');
  closeModals();
  renderGarden();
  updateCoins();
});

document.getElementById('btn-remove').addEventListener('click', async () => {
  if (!confirm('Bạn chắc muốn nhổ bỏ cây này?')) return;
  const res = await Game.removePlant(selectedPlotId);
  showToast(res.msg, res.ok ? 'success' : 'error');
  closeModals();
  renderGarden();
});



function bindPressHold(el, { onClick, onHold, ms = 450 } = {}) {
  if (!el) return;
  // Tránh bind 2 lần trên cùng 1 nút (renderShop gọi lại)
  if (el.dataset.pressHoldBound === '1') return;
  el.dataset.pressHoldBound = '1';

  let timer = null;
  let held = false;
  let startedByTouch = false;
  let lastTouchEndAt = 0;
  const clear = () => { if (timer) { clearTimeout(timer); timer = null; } };

  const start = (e) => {
    if (e.type === 'mousedown' && e.button !== 0) return;
    // Ghost mouse sau touch: bỏ qua mousedown trong ~700ms
    if (e.type === 'mousedown' && (startedByTouch || (Date.now() - lastTouchEndAt < 700))) {
      return;
    }
    if (e.type === 'touchstart') startedByTouch = true;
    held = false;
    clear();
    timer = setTimeout(() => {
      held = true;
      timer = null;
      if (typeof onHold === 'function') onHold(e);
    }, ms);
  };

  const end = (e) => {
    if (e.type === 'touchend' || e.type === 'touchcancel') {
      lastTouchEndAt = Date.now();
    }
    // Ghost mouseup sau touch
    if (e.type === 'mouseup' && (startedByTouch || (Date.now() - lastTouchEndAt < 700))) {
      startedByTouch = false;
      clear();
      held = false;
      return;
    }
    if (!timer && !held) {
      startedByTouch = false;
      return;
    }
    const wasHold = held;
    clear();
    if (!wasHold && typeof onClick === 'function') onClick(e);
    held = false;
    startedByTouch = false;
  };

  const cancel = (e) => {
    if (e && e.type === 'mouseleave' && startedByTouch) return;
    clear();
    held = false;
  };

  el.addEventListener('mousedown', start);
  el.addEventListener('touchstart', start, { passive: true });
  el.addEventListener('mouseup', end);
  el.addEventListener('touchend', end);
  el.addEventListener('mouseleave', cancel);
  el.addEventListener('touchcancel', end);
}


function openQtyPickModal({ title, hint, confirmLabel, onConfirm, maxQty }) {
  const modal = document.getElementById('modal-bulk');
  const list = document.getElementById('bulk-qty-list');
  const titleEl = document.getElementById('bulk-title');
  const hintEl = document.getElementById('bulk-hint');
  if (!modal || !list) return;
  if (titleEl) titleEl.textContent = title || 'Chọn số lượng';
  if (hintEl) hintEl.textContent = hint || '';
  list.innerHTML = '';
  const cap = (maxQty && maxQty > 0) ? Math.floor(maxQty) : 0;
  const row = document.createElement('div');
  row.className = 'bulk-qty-row';
  row.innerHTML = `
    <input type="number" id="bulk-qty-input" class="bulk-qty-input" min="1"${cap ? ` max="${cap}"` : ''} placeholder="${cap ? ('Tối đa ' + cap.toLocaleString()) : 'Số lượng'}" inputmode="numeric" />
    <button type="button" class="btn btn-primary btn-sm" id="bulk-qty-all">Tất cả</button>
    <button type="button" class="btn btn-secondary btn-sm" id="bulk-qty-ok">${confirmLabel || 'OK'}</button>
  `;
  list.appendChild(row);
  const run = async (n) => {
    closeModals();
    if (typeof onConfirm === 'function') await onConfirm(n);
  };
  row.querySelector('#bulk-qty-all')?.addEventListener('click', () => run('all'));
  row.querySelector('#bulk-qty-ok')?.addEventListener('click', () => {
    let v = parseInt(row.querySelector('#bulk-qty-input')?.value, 10);
    if (!Number.isFinite(v) || v < 1) { showToast('Nhập số hợp lệ!', 'error'); return; }
    if (cap && v > cap) v = cap;
    run(v);
  });
  modal.classList.add('show');
  setTimeout(() => row.querySelector('#bulk-qty-input')?.focus(), 80);
}


let bulkAction = null; 
let bulkFertId = null;

function openBulkModal(action) {
  bulkAction = action;
  bulkFertId = null;
  const titles = {
    water: 'Tưới bao nhiêu ô?',
    fert: 'Bón phân bao nhiêu ô?',
    harvest: 'Thu hoạch bao nhiêu ô?'
  };
  const hints = {
    water: 'Nhập số ô cần tưới (mỗi ô +1 lần nếu đủ điều kiện)',
    fert: 'Chọn loại phân, rồi nhập số ô cần bón',
    harvest: 'Nhập số ô đã chín để thu hoạch'
  };
  document.getElementById('bulk-title').textContent = titles[action] || 'Chọn số lượng';
  document.getElementById('bulk-hint').textContent = hints[action] || '';
  const list = document.getElementById('bulk-qty-list');
  list.innerHTML = '';

  if (action === 'fert') {
    const ferts = (currentPlayer?.inventory?.fertilizers) || {};
    const ids = Object.keys(ferts).filter(id => ferts[id] > 0);
    if (!ids.length) {
      list.innerHTML = '<p class="empty-state">Không còn phân bón trong kho.</p>';
      document.getElementById('modal-bulk').classList.add('show');
      return;
    }
    const fertWrap = document.createElement('div');
    fertWrap.className = 'bulk-fert-list';
    ids.forEach(id => {
      const fert = Game.getFertilizer(id);
      if (!fert) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-secondary btn-sm bulk-fert-btn';
      btn.dataset.fertId = id;
      btn.innerHTML = `${fert.icon} ${fert.name} <span class="bulk-fert-stock">×${ferts[id]}</span>`;
      btn.addEventListener('click', () => {
        fertWrap.querySelectorAll('.bulk-fert-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        bulkFertId = id;
      });
      fertWrap.appendChild(btn);
    });
    const sorted = ids.map(id => Game.getFertilizer(id)).filter(Boolean)
      .sort((a, b) => (b.yieldBonus || 0) - (a.yieldBonus || 0));
    if (sorted[0]) {
      bulkFertId = sorted[0].id;
      const first = fertWrap.querySelector(`[data-fert-id="${sorted[0].id}"]`);
      if (first) first.classList.add('active');
    }
    list.appendChild(fertWrap);
  }

  const row = document.createElement('div');
  row.className = 'bulk-qty-row';
  row.innerHTML = `
    <input type="number" id="bulk-qty-input" class="bulk-qty-input" min="1" max="999" value="" placeholder="Số ô" inputmode="numeric" />
    <button type="button" class="btn btn-primary btn-sm bulk-qty-all" id="bulk-qty-all">Tất cả</button>
  `;
  list.appendChild(row);

  const runBulk = async (n) => {
    if (bulkAction === 'fert' && !bulkFertId) {
      showToast('Hãy chọn loại phân bón!', 'error');
      return;
    }
    closeModals();
    let res;
    if (bulkAction === 'water') res = await Game.waterAll(n);
    else if (bulkAction === 'fert') res = await Game.fertilizeAll(n, bulkFertId);
    else res = await Game.harvestAll(n);
    showToast(res.msg, res.ok ? 'success' : 'error');
    renderGarden();
    updateCoins();
    bulkAction = null;
    bulkFertId = null;
  };

  row.querySelector('#bulk-qty-all')?.addEventListener('click', () => runBulk('all'));
  const inp = row.querySelector('#bulk-qty-input');
  inp?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const v = parseInt(inp.value, 10);
      if (!Number.isFinite(v) || v < 1) {
        showToast('Nhập số ô hợp lệ!', 'error');
        return;
      }
      runBulk(v);
    }
  });
  
  const go = document.createElement('button');
  go.type = 'button';
  go.className = 'btn btn-secondary btn-sm';
  go.textContent = 'OK';
  go.addEventListener('click', () => {
    const v = parseInt(inp.value, 10);
    if (!Number.isFinite(v) || v < 1) {
      showToast('Nhập số ô hợp lệ!', 'error');
      return;
    }
    runBulk(v);
  });
  row.appendChild(go);

  document.getElementById('modal-bulk').classList.add('show');
  setTimeout(() => inp?.focus(), 80);
}

document.getElementById('btn-water-all')?.addEventListener('click', () => {
  document.getElementById('garden-tools-dd')?.classList.remove('open');
  openBulkModal('water');
});
document.getElementById('btn-fertilize-all')?.addEventListener('click', () => {
  document.getElementById('garden-tools-dd')?.classList.remove('open');
  openBulkModal('fert');
});
document.getElementById('btn-harvest-all')?.addEventListener('click', () => {
  document.getElementById('garden-tools-dd')?.classList.remove('open');
  openBulkModal('harvest');
});
(function bindGardenToolsMenu() {
  const wrap = document.getElementById('garden-tools-dd');
  const btn = document.getElementById('btn-tools-menu');
  if (!wrap || !btn) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('garden-support-dd')?.classList.remove('open');
    const open = wrap.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open && typeof closeAllPillMenus === 'function') closeAllPillMenus();
  });
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) {
      wrap.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();

(function bindGardenSupportMenu() {
  const wrap = document.getElementById('garden-support-dd');
  const btn = document.getElementById('btn-support-menu');
  if (!wrap || !btn) return;
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('garden-tools-dd')?.classList.remove('open');
    const open = wrap.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      if (typeof refreshSupportMenuStatus === 'function') refreshSupportMenuStatus();
      if (typeof closeAllPillMenus === 'function') closeAllPillMenus();
    }
  });
  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) {
      wrap.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  const close = () => {
    wrap.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  };
  document.getElementById('btn-support-fairy')?.addEventListener('click', () => {
    close();
    if (typeof openFairyConfigModal === 'function') openFairyConfigModal();
  });
  document.getElementById('btn-support-nyc')?.addEventListener('click', () => {
    close();
    if (typeof openNycConfigModal === 'function') openNycConfigModal();
  });
  document.getElementById('btn-support-helper')?.addEventListener('click', () => {
    close();
    if (typeof openHelperConfigModal === 'function') openHelperConfigModal();
  });
  document.getElementById('btn-support-robot')?.addEventListener('click', () => {
    close();
    if (!(Game.hasRobot && Game.hasRobot())) {
      if (typeof showToast === 'function') showToast('Người máy chỉ do admin cấp quyền!', 'error');
      return;
    }
    if (typeof openRobotConfigModal === 'function') openRobotConfigModal();
  });
})();

function refreshSupportMenuStatus() {
  if (typeof Game === 'undefined') return;
  const fill = (btnId, nameId, timeId, hasFn, remainFn, nameFn, fallbackName) => {
    const btn = document.getElementById(btnId);
    const nameEl = document.getElementById(nameId);
    const timeEl = document.getElementById(timeId);
    const active = typeof hasFn === 'function' && !!hasFn();
    const name = (typeof nameFn === 'function' ? nameFn() : null) || fallbackName;
    if (nameEl) nameEl.textContent = name;
    if (timeEl) {
      if (!active) timeEl.textContent = 'Chưa mua';
      else {
        const sec = typeof remainFn === 'function' ? (remainFn() || 0) : 0;
        timeEl.textContent = sec > 0 ? Game.formatTime(sec) : 'Hết hạn';
      }
    }
    if (btn) btn.classList.toggle('is-off', !active);
  };
  fill(
    'btn-support-fairy', 'support-name-fairy', 'support-status-fairy',
    () => Game.hasFairy && Game.hasFairy(),
    () => Game.fairyRemainingSec && Game.fairyRemainingSec(),
    () => Game.getFairyDisplayName && Game.getFairyDisplayName(),
    'Tiên'
  );
  fill(
    'btn-support-nyc', 'support-name-nyc', 'support-status-nyc',
    () => Game.hasNyc && Game.hasNyc(),
    () => Game.nycRemainingSec && Game.nycRemainingSec(),
    () => Game.getNycDisplayName && Game.getNycDisplayName(),
    'NYC'
  );
  fill(
    'btn-support-helper', 'support-name-helper', 'support-status-helper',
    () => Game.hasHelper && Game.hasHelper(),
    () => Game.helperRemainingSec && Game.helperRemainingSec(),
    () => Game.getHelperDisplayName && Game.getHelperDisplayName(),
    'Giúp việc'
  );
  // Người máy: không có hạn gói — hiện "Admin" hoặc "Tắt"
  const robBtn = document.getElementById('btn-support-robot');
  const robName = document.getElementById('support-name-robot');
  const robTime = document.getElementById('support-status-robot');
  const hasRob = Game.hasRobot && Game.hasRobot();
  if (robBtn) {
    robBtn.style.display = hasRob ? '' : 'none';
    robBtn.classList.toggle('is-off', !(Game.isRobotActive && Game.isRobotActive()));
  }
  if (robName) robName.textContent = (Game.getRobotDisplayName && Game.getRobotDisplayName()) || 'Người máy';
  if (robTime) robTime.textContent = hasRob
    ? ((Game.isRobotActive && Game.isRobotActive()) ? 'Đang bật' : 'Buff tắt')
    : '—';
}



function openFertModal(plotId) {
  selectedPlotId = plotId;
  const list = document.getElementById('fert-pick-list');
  list.innerHTML = '';
  const ferts = (currentPlayer.inventory && currentPlayer.inventory.fertilizers) || {};
  const ids = Object.keys(ferts).filter(id => ferts[id] > 0);

  if (ids.length === 0) {
    list.innerHTML = '<p class="empty-state">Bạn chưa có phân bón.<br>Hãy mua ở Cửa hàng → tab Phân bón!</p>';
  } else {
    ids.forEach(id => {
      const fert = Game.getFertilizer(id);
      if (!fert) return;
      const opt = document.createElement('div');
      opt.className = 'seed-option';
      opt.innerHTML = `
        <span class="icon">${fert.icon}</span>
        <div class="info">
          <div class="name">${fert.name}</div>
          <div class="qty">Còn ${ferts[id]} · −${Math.round(fert.timeReduce * 100)}% TG · +${Math.round(fert.yieldBonus * 100)}% SL</div>
        </div>
      `;
      opt.addEventListener('click', async () => {
        const res = await Game.applyFertilizer(plotId, id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        closeModals();
        renderGarden();
        updateCoins();
      });
      list.appendChild(opt);
    });
  }
  document.getElementById('modal-plot').classList.remove('show');
  document.getElementById('modal-fert').classList.add('show');
}


function renderUxPager(el, { page, totalPages, onChange }) {
  if (!el) return;
  const tp = Math.max(1, totalPages || 1);
  const cur = Math.min(Math.max(1, page || 1), tp);
  el.classList.add('ux-pager', 'shop-pager');
  if (tp <= 1) {
    el.innerHTML = '';
    return;
  }
  let html = '';
  html += `<button type="button" class="btn btn-secondary" data-ux-page="${Math.max(1, cur - 1)}" ${cur <= 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;
  const winStart = Math.max(1, cur - 2);
  const winEnd = Math.min(tp, winStart + 4);
  for (let p = winStart; p <= winEnd; p++) {
    html += `<button type="button" class="btn ${p === cur ? 'btn-primary' : 'btn-secondary'}" data-ux-page="${p}">${p}</button>`;
  }
  html += `<span class="ux-pager-info">${cur}/${tp}</span>`;
  html += `<button type="button" class="btn btn-secondary" data-ux-page="${Math.min(tp, cur + 1)}" ${cur >= tp ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
  el.innerHTML = html;
  el.querySelectorAll('[data-ux-page]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      const p = parseInt(btn.getAttribute('data-ux-page'), 10);
      if (!p || p === cur) return;
      if (typeof onChange === 'function') onChange(p);
    });
  });
}


let currentShopTab = 'hoa';
let shopPage = 0;
const SHOP_PAGE_SIZE = 21;

document.querySelectorAll('.shop-tab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.shop-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentShopTab = btn.dataset.shop;
    shopPage = 0;
    const s = document.getElementById('shop-search');
    if (s) s.value = '';
    renderShop();
  });
});

document.getElementById('shop-search')?.addEventListener('input', () => {
  shopPage = 0;
  renderShop();
});

function getShopPlantsFiltered() {
  let plants = Game.getPlants();
  if (currentShopTab === 'hoa') plants = plants.filter(p => p.type === 'hoa');
  else if (currentShopTab === 'qua') plants = plants.filter(p => p.type === 'qua');
  else if (currentShopTab === 'la') plants = plants.filter(p => p.type === 'la' || p.type === 'rau');
  else if (currentShopTab === 'cay') plants = plants.filter(p => p.type === 'cay');
  else if (currentShopTab === 'kytu') plants = plants.filter(p => p.type === 'kytu' || p.type === 'so');
  else if (currentShopTab === 'khac') plants = plants.filter(p => p.type === 'khac');
  else if (currentShopTab === 'limited') {
    plants = plants.filter(p => Game.isPlantLimited(p));
  }

  const q = (document.getElementById('shop-search')?.value || '').trim().toLowerCase();
  if (q) {
    plants = plants.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.id || '').toLowerCase().includes(q) ||
      (p.desc || '').toLowerCase().includes(q)
    );
  }
  
  plants = plants.slice().sort((a, b) => {
    const la = Game.isPlantLimited(a) && Game.isPlantAvailable(a) ? 0 : 1;
    const lb = Game.isPlantLimited(b) && Game.isPlantAvailable(b) ? 0 : 1;
    return la - lb;
  });
  return plants;
}



let _faProIconList = null;
let _faProIconLoading = null;
const FA_PRO_CSS_URL = 'https://kit-pro.fontawesome.com/releases/v7.3.1/css/pro.min.css';

function loadFaProIconList() {
  if (_faProIconList && _faProIconList.length) return Promise.resolve(_faProIconList);
  if (_faProIconLoading) return _faProIconLoading;

  
  if (typeof FA_PRO_ICON_SLUGS !== 'undefined' && Array.isArray(FA_PRO_ICON_SLUGS) && FA_PRO_ICON_SLUGS.length) {
    _faProIconList = FA_PRO_ICON_SLUGS.slice();
    return Promise.resolve(_faProIconList);
  }

  
  _faProIconLoading = fetch(FA_PRO_CSS_URL)
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(css => {
      const re = /\.fa-([a-z0-9-]+)(?=[,{])/g;
      const set = new Set();
      let m;
      while ((m = re.exec(css)) !== null) {
        const slug = m[1];
        if (!slug || /^\d+$/.test(slug)) continue;
        if (['solid','regular','light','thin','duotone','brands','sharp','classic','fw','spin','pulse'].indexOf(slug) >= 0) continue;
        set.add(slug);
      }
      _faProIconList = Array.from(set).sort();
      if (!_faProIconList.length) throw new Error('empty parse');
      return _faProIconList;
    })
    .catch(err => {
      console.warn('loadFaProIconList', err);
      const fb = (typeof getAvatarBadges === 'function' ? getAvatarBadges() : [])
        .map(b => b.slug || (b.fa || '').replace(/^fa-regular\s+fa-/, '').replace(/^fa-/, ''))
        .filter(Boolean);
      _faProIconList = fb.length ? fb : ['heart','star','user','bell','bookmark','circle','face-smile','moon','sun','gem'];
      return _faProIconList;
    });
  return _faProIconLoading;
}


function renderShop() {
  const faBarHide = document.getElementById('badge-fa-search-bar');
  if (faBarHide && currentShopTab !== 'badge') faBarHide.style.display = 'none';
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = '';
  const seeds = (currentPlayer && currentPlayer.inventory && currentPlayer.inventory.seeds) || {};

  if (currentShopTab === 'odat') {
    const countEl = document.getElementById('shop-count');
    const price = (currentSettings && currentSettings.plotPrice) || 500;
    if (typeof Game.ensureGardens === 'function') Game.ensureGardens();
    const have = currentPlayer?.plots?.length || 0;
    const maxP = (Game.MAX_PLOTS_PER_GARDEN || 99);
    const gIdx = (typeof Game.getActiveGardenIndex === 'function' ? Game.getActiveGardenIndex() : 0) + 1;
    const gCount = typeof Game.getGardenCount === 'function' ? Game.getGardenCount() : 1;
    if (countEl) countEl.textContent = 'Mở rộng Vườn ' + gIdx;
    document.getElementById('shop-pager').innerHTML = '';
    
    let upgradeAllNeed = 0;
    let upgradeAllCount = 0;
    try {
      if (typeof Features !== 'undefined' && Features.getPlotUpgradeCost) {
        const gardens = (currentPlayer.gardens && currentPlayer.gardens.length)
          ? currentPlayer.gardens
          : [currentPlayer.plots || []];
        gardens.forEach(g => {
          const arr = Array.isArray(g) ? g : Object.values(g || {});
          arr.forEach(pl => {
            if (!pl) return;
            const base = Number(pl.specialMultPermanent) || 1;
            if (base >= 50) return;
            const c = Features.getPlotUpgradeCost(base, 50);
            if (c != null && c >= 0) {
              upgradeAllNeed += c;
              upgradeAllCount++;
            }
          });
        });
      }
    } catch (_) {}
    grid.innerHTML = `
      <div class="shop-plot-row">
        <div class="shop-card shop-plot-card">
          <div class="shop-icon">🟫</div>
          <div class="shop-name">Mua thêm ô đất · Vườn ${gIdx}</div>
          <span class="shop-type">Tối đa ${maxP} ô / vườn · Đủ ${maxP} ô mở vườn mới</span>
          <div class="shop-meta"><span>Vườn ${gIdx}: <strong>${have}/${maxP}</strong> ô · Tổng ${gCount} vườn</span></div>
          <div class="shop-price">${price.toLocaleString()} 🪙 / ô</div>
          <div class="buy-qty">
            <input type="number" id="plot-qty-input" class="qty-input" min="1" max="20" value="1" />
            <button class="btn btn-warning" id="btn-buy-plot"><i class="fa-solid fa-cart-plus"></i> Mua ô</button>
          </div>
        </div>
        <div class="shop-card shop-plot-card">
          <div class="shop-icon">⚡</div>
          <div class="shop-name">Nâng tất cả ô → x50 vĩnh viễn</div>
          <span class="shop-type">Mọi vườn · chỉ ô dưới x50</span>
          <div class="shop-desc">Nâng vĩnh viễn hệ số tốc độ mọi ô đất (mọi vườn) lên x50. Ô đã ≥ x50 bỏ qua.</div>
          <div class="shop-meta"><span>${upgradeAllCount ? (upgradeAllCount + ' ô cần nâng') : 'Đã đủ x50'}</span></div>
          <div class="shop-price">${upgradeAllCount ? (upgradeAllNeed.toLocaleString() + ' 🪙') : '—'}</div>
          <button class="btn btn-warning" id="btn-upgrade-all-x50" ${upgradeAllCount ? '' : 'disabled'}>
            <i class="fa-solid fa-bolt"></i> Nâng hết → x50
          </button>
        </div>
      </div>`;
    document.getElementById('btn-buy-plot')?.addEventListener('click', async () => {
      const q = parseInt(document.getElementById('plot-qty-input')?.value || '1', 10);
      const res = await Game.buyPlot(q);
      showToast(res.msg, res.ok ? 'success' : 'error');
      updateCoins();
      renderShop();
    });
    document.getElementById('btn-upgrade-all-x50')?.addEventListener('click', async () => {
      if (!upgradeAllCount) return;
      if (!confirm('Nâng ' + upgradeAllCount + ' ô (mọi vườn) → x50 vĩnh viễn?\nChi phí: ' + upgradeAllNeed.toLocaleString() + ' 🪙')) return;
      const res = await Features.upgradeAllPlotsTo(50);
      showToast(res.msg, res.ok ? 'success' : 'error');
      updateCoins();
      renderShop();
      if (res.ok && typeof renderGarden === 'function') renderGarden();
    });
    return;
  }



  if (currentShopTab === 'tangtoc') {
    const countEl = document.getElementById('shop-count');
    document.getElementById('shop-pager').innerHTML = '';
    const packs = (typeof Features !== 'undefined' && Features.PLOT_TEMP_BOOSTS) ? Features.PLOT_TEMP_BOOSTS : [];
    if (countEl) countEl.textContent = packs.length + ' gói tăng tốc tạm · nâng vĩnh viễn trong chi tiết ô';
    const hint = document.createElement('div');
    hint.className = 'shop-event-banner';
    hint.innerHTML = '⏱ Gói tạm (1–30 ngày): chọn ô để áp dụng. ⚡ Nâng <strong>vĩnh viễn</strong>: mở ô đất → Nâng cấp.';
    grid.appendChild(hint);
    const plotOpts = (currentPlayer && currentPlayer.plots ? currentPlayer.plots : []).map((pl, i) => {
      const sm = Game.getPlotSpeedMult ? Game.getPlotSpeedMult(pl) : 1;
      return `<option value="${i}">Ô #${i + 1}${pl.plantId ? ' · trồng' : ' · trống'} · x${sm}</option>`;
    }).join('');
    packs.forEach(pack => {
      const card = document.createElement('div');
      card.className = 'shop-card shop-card-boost';
      card.innerHTML = `
        <div class="shop-icon">⚡</div>
        <div class="shop-name">${pack.name}</div>
        <span class="shop-type">Tăng tốc tạm · x${pack.mult}</span>
        <div class="shop-desc">Áp dụng ${pack.days} ngày cho 1 ô. Cùng mức sẽ cộng dồn thời gian.</div>
        <div class="shop-price">${pack.price.toLocaleString()} 🪙</div>
        <select class="boost-plot-sel" data-id="${pack.id}" data-pill-prefix="Ô:" data-pill-block="1">${plotOpts || '<option value="">Chưa có ô</option>'}</select>
        <button class="btn btn-warning btn-buy-temp-boost" data-id="${pack.id}"><i class="fa-solid fa-cart-plus"></i> Mua & áp dụng</button>
      `;
      grid.appendChild(card);
    });
    grid.querySelectorAll('.btn-buy-temp-boost').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sel = grid.querySelector('.boost-plot-sel[data-id="' + btn.dataset.id + '"]');
        const plotId = sel ? sel.value : '0';
        const res = await Features.buyTempPlotBoost(btn.dataset.id, plotId);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        if (res.ok) { renderGarden(); renderShop(); }
      });
    });
    mountAllPillDropdowns(grid);
    return;
  }

  if (currentShopTab === 'baoho') {
    const countEl = document.getElementById('shop-count');
    if (countEl) countEl.textContent = DEFAULT_PROTECTS.length + ' loại bảo hộ';
    document.getElementById('shop-pager').innerHTML = '';
    const haveMap = (currentPlayer?.inventory?.protects) || {};
    DEFAULT_PROTECTS.forEach(item => {
      const have = haveMap[item.id] || 0;
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-icon">${item.icon}</div>
        <div class="shop-name">${item.name}</div>
        <span class="shop-type">Bảo hộ ghép</span>
        <div class="shop-desc">${item.desc}</div>
        <div class="shop-meta"><span>Tỉ lệ <strong>${item.rate}%</strong></span></div>
        <div class="shop-owned">Bạn có: <strong>${have}</strong></div>
        <div class="shop-price">${item.price.toLocaleString()} 🪙</div>
        <button class="btn btn-primary btn-buy-protect" data-id="${item.id}"><i class="fa-solid fa-cart-plus"></i> Mua</button>
      `;
      grid.appendChild(card);
    });
    document.querySelectorAll('.btn-buy-protect').forEach(btn => {
      const buy = async (qty) => {
        const item = Game.getProtect && Game.getProtect(btn.dataset.id);
        const price = item ? (Number(item.price) || 1) : 1;
        let n = qty;
        if (n === 'all') {
          const coins = currentPlayer.coins || 0;
          n = price > 0 ? Math.floor(coins / price) : 1;
        }
        n = Math.max(1, Math.floor(Number(n) || 1));
        const res = await Game.buyProtect(btn.dataset.id, n);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderShop();
      };
      bindPressHold(btn, {
        onClick: () => buy(1),
        onHold: () => openQtyPickModal({
          title: 'Mua bao nhiêu bùa?',
          hint: 'Nhập số lượng (không giới hạn). Tất cả = theo số xu hiện có.',
          confirmLabel: 'Mua',
          maxQty: 0,
          onConfirm: (n) => buy(n)
        })
      });
    });
    return;
  }

  if (currentShopTab === 'tien') {
    const countEl = document.getElementById('shop-count');
    if (countEl) countEl.textContent = 'Tiên tự chăm vườn';
    document.getElementById('shop-pager').innerHTML = '';
    const remain = Game.hasFairy() ? Game.formatTime(Game.fairyRemainingSec()) : 'Không active';
    const info = document.createElement('div');
    info.className = 'shop-event-banner';
    const fcfg = Game.getFairyConfig();
    const fertHint = fcfg.useFertilizer
      ? (fcfg.fertSource === 'specific' ? 'bón 1 loại từ kho' : 'bón từ kho')
      : 'không bón phân';
    info.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Tiên active: <strong>${remain}</strong> — mưa tưới hết · 3h theo cấu hình (${fertHint})
      <button type="button" class="btn btn-secondary btn-sm" id="btn-fairy-cfg-shop" style="margin-left:8px">Cấu hình</button>`;
    grid.appendChild(info);
    document.getElementById('btn-fairy-cfg-shop')?.addEventListener('click', () => openFairyConfigModal());
    DEFAULT_FAIRY_PACKS.forEach(pack => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-icon">${pack.icon}</div>
        <div class="shop-name">${pack.name}</div>
        <span class="shop-type">Buff vườn</span>
        <div class="shop-desc">Tự chăm ${pack.days} ngày (cộng dồn nếu còn hạn).</div>
        <div class="shop-price">${pack.price.toLocaleString()} 🪙</div>
        <button class="btn btn-primary btn-buy-fairy" data-id="${pack.id}"><i class="fa-solid fa-cart-plus"></i> Mua</button>
      `;
      grid.appendChild(card);
    });
    document.querySelectorAll('.btn-buy-fairy').forEach(btn => {
      btn.addEventListener('click', async () => {
        const res = await Game.buyFairyPack(btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderShop();
        updateFairyBadge();
      });
    });
    return;
  }

  if (currentShopTab === 'nyc') {
    const countEl = document.getElementById('shop-count');
    if (countEl) countEl.textContent = 'Người Yêu Cũ tự thu & trồng';
    document.getElementById('shop-pager').innerHTML = '';
    const remain = Game.hasNyc() ? Game.formatTime(Game.nycRemainingSec()) : 'Không active';
    const cfg = Game.getNycConfig();
    const cfgPlant = cfg.plantId ? Game.getPlant(cfg.plantId) : null;
    const cfgText = cfgPlant
      ? `${cfgPlant.icon} ${cfgPlant.name} · ${cfg.mode === 'count' ? 'x' + cfg.count + '/lần' : 'trồng hết'}`
      : 'Chưa chọn hạt';
    const info = document.createElement('div');
    info.className = 'shop-event-banner';
    info.innerHTML = `<i class="fa-solid fa-heart-crack"></i> NYC active: <strong>${remain}</strong> — ${cfgText}
      <button type="button" class="btn btn-secondary btn-sm" id="btn-nyc-cfg-shop" style="margin-left:8px">Cấu hình hạt</button>`;
    grid.appendChild(info);
    document.getElementById('btn-nyc-cfg-shop')?.addEventListener('click', () => openNycConfigModal());
    DEFAULT_NYC_PACKS.forEach(pack => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-icon">${pack.icon}</div>
        <div class="shop-name">${pack.name}</div>
        <span class="shop-type">Buff vườn</span>
        <div class="shop-desc">Cây chín → thu ngay + trồng lại · ${pack.days} ngày (cộng dồn).</div>
        <div class="shop-price">${pack.price.toLocaleString()} 🪙</div>
        <button class="btn btn-primary btn-buy-nyc" data-id="${pack.id}"><i class="fa-solid fa-cart-plus"></i> Mua</button>
      `;
      grid.appendChild(card);
    });
    document.querySelectorAll('.btn-buy-nyc').forEach(btn => {
      btn.addEventListener('click', async () => {
        const res = await Game.buyNycPack(btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderShop();
        updateNycBadge();
  updateHelperBadge();
        renderGarden();
      });
    });
    return;
  }


  if (currentShopTab === 'helper') {
    const countEl = document.getElementById('shop-count');
    if (countEl) countEl.textContent = 'Người giúp việc tự mua kho';
    document.getElementById('shop-pager').innerHTML = '';
    const remain = Game.hasHelper() ? Game.formatTime(Game.helperRemainingSec()) : 'Không active';
    const nRules = (Game.getHelperConfig().rules || []).length;
    const info = document.createElement('div');
    info.className = 'shop-event-banner';
    info.innerHTML = `<i class="fa-solid fa-user-tie"></i> Giúp việc: <strong>${remain}</strong> · ${nRules} mục mua tự động
      <button type="button" class="btn btn-secondary btn-sm" id="btn-helper-cfg-shop" style="margin-left:8px">Cấu hình</button>`;
    grid.appendChild(info);
    document.getElementById('btn-helper-cfg-shop')?.addEventListener('click', () => openHelperConfigModal());
    const packs = (typeof DEFAULT_HELPER_PACKS !== 'undefined') ? DEFAULT_HELPER_PACKS : (Game.getHelperPacks ? Game.getHelperPacks() : []);
    packs.forEach(pack => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-icon">${pack.icon}</div>
        <div class="shop-name">${pack.name}</div>
        <span class="shop-type">Buff mua sắm</span>
        <div class="shop-desc">Tự mua vật phẩm theo mốc kho trong ${pack.days} ngày (cộng dồn).</div>
        <div class="shop-price">${pack.price.toLocaleString()} 🪙</div>
        <button class="btn btn-primary btn-buy-helper" data-id="${pack.id}"><i class="fa-solid fa-cart-plus"></i> Mua</button>
      `;
      grid.appendChild(card);
    });
    document.querySelectorAll('.btn-buy-helper').forEach(btn => {
      btn.addEventListener('click', async () => {
        const res = await Game.buyHelperPack(btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderShop();
        updateHelperBadge();
      });
    });
    return;
  }

  if (currentShopTab === 'phan') {
    const countEl = document.getElementById('shop-count');
    if (countEl) countEl.textContent = DEFAULT_FERTILIZERS.length + ' loại phân';
    document.getElementById('shop-pager').innerHTML = '';

    DEFAULT_FERTILIZERS.forEach(fert => {
      const have = (currentPlayer?.inventory?.fertilizers?.[fert.id]) || 0;
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-icon">${fert.icon}</div>
        <div class="shop-name">${fert.name}</div>
        <span class="shop-type">Phân bón</span>
        <div class="shop-desc">${fert.desc}</div>
        <div class="shop-meta">
          <span>⏱ −${Math.round(fert.timeReduce * 100)}%</span>
          <span>📦 +${Math.round(fert.yieldBonus * 100)}%</span>
        </div>
        <div class="shop-owned">Bạn có: <strong>${have}</strong></div>
        <div class="shop-price">${fert.price.toLocaleString()} 🪙</div>
        <button class="btn btn-primary btn-buy-fert" data-id="${fert.id}"><i class="fa-solid fa-cart-plus"></i> Mua</button>
      `;
      grid.appendChild(card);
    });

    document.querySelectorAll('.btn-buy-fert').forEach(btn => {
      const buy = async (qty) => {
        const fert = Game.getFertilizer && Game.getFertilizer(btn.dataset.id);
        const price = fert ? (Number(fert.price) || 1) : 1;
        let n = qty;
        if (n === 'all') {
          const coins = currentPlayer.coins || 0;
          n = price > 0 ? Math.floor(coins / price) : 1;
        }
        n = Math.max(1, Math.floor(Number(n) || 1));
        const res = await Game.buyFertilizer(btn.dataset.id, n);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderShop();
      };
      bindPressHold(btn, {
        onClick: () => buy(1),
        onHold: () => openQtyPickModal({
          title: 'Mua bao nhiêu?',
          hint: 'Nhập số lượng (không giới hạn). Tất cả = theo số xu hiện có.',
          confirmLabel: 'Mua',
          maxQty: 0,
          onConfirm: (n) => buy(n)
        })
      });
    });
    return;
  }




  if (currentShopTab === 'companion') {
    const countEl = document.getElementById('shop-count');
    document.getElementById('shop-pager').innerHTML = '';
    const items = (Game.getCompanions && Game.getCompanions()) || [];
    if (countEl) countEl.textContent = items.length + ' thú cưng · hiện góc avatar';
    const owned = (currentPlayer && currentPlayer.companions) || {};
    const eq = (currentPlayer && currentPlayer.companionId) || null;
    const none = document.createElement('div');
    none.className = 'shop-card';
    none.innerHTML = `<div class="shop-icon" style="font-size:2rem">🚫</div><div class="shop-name">Không thú</div><div class="shop-owned">${!eq ? shopOwnedLabel('equipped') : ''}</div><button class="btn btn-secondary btn-equip-cp" data-id="none">Gỡ</button>`;
    grid.appendChild(none);
    items.forEach(it => {
      const have = !!owned[it.id];
      const on = eq === it.id;
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `<div class="shop-icon" style="font-size:2.2rem">${it.icon}</div>
        <div class="shop-name">${it.name}</div>
        <span class="shop-type">${it.rarity || 'common'}</span>
        <div class="shop-owned">${on ? shopOwnedLabel('equipped') : (have ? shopOwnedLabel('owned') : shopOwnedLabel('none'))}</div>
        <div class="shop-price">${(it.price||0).toLocaleString()} 🪙</div>
        ${have ? `<button class="btn ${on?'btn-secondary':'btn-primary'} btn-equip-cp" data-id="${it.id}">${on?'Đang gắn':'Gắn'}</button>`
               : `<button class="btn btn-primary btn-buy-cp" data-id="${it.id}"><i class="fa-solid fa-cart-plus"></i> Mua</button>`}`;
      grid.appendChild(card);
    });
    grid.querySelectorAll('.btn-buy-cp').forEach(btn => btn.addEventListener('click', async () => {
      const res = await Game.buyCompanion(btn.dataset.id);
      showToast(res.msg, res.ok ? 'success' : 'error'); updateCoins(); renderShop(); applyProfileCompanion();
    }));
    grid.querySelectorAll('.btn-equip-cp').forEach(btn => btn.addEventListener('click', () => {
      const res = Game.equipCompanion(btn.dataset.id);
      showToast(res.msg, res.ok ? 'success' : 'error');
      if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(400);
      renderShop(); applyProfileCompanion();
    }));
    return;
  }

  if (currentShopTab === 'badge') {
    const countEl = document.getElementById('shop-count');
    const pager = document.getElementById('shop-pager');
    const BADGE_PAGE = 48; 
    
    const shopSearchWrap = document.getElementById('shop-search')?.closest('.shop-search-wrap, .shop-toolbar, .shop-filters') || document.getElementById('shop-search')?.parentElement;
    
    if (countEl) countEl.textContent = 'Đang tải icon từ Font Awesome Pro…';
    if (pager) pager.innerHTML = '';

    
    let faBar = document.getElementById('badge-fa-search-bar');
    if (!faBar) {
      faBar = document.createElement('div');
      faBar.id = 'badge-fa-search-bar';
      faBar.className = 'badge-fa-search-bar';
      faBar.innerHTML = `
        <label class="badge-fa-label"><i class="fa-brands fa-font-awesome"></i> Tìm icon trong FA Pro (tự chọn solid/brands)</label>
        <div class="badge-fa-row">
          <input type="search" id="badge-fa-search" placeholder="Nhập tên icon FA… ví dụ: heart, star, face-smile" autocomplete="off" />
          <span class="badge-fa-hint">Nguồn: pro.min.css · solid/brands · tối đa 48 icon</span>
        </div>`;
      grid.parentElement?.insertBefore(faBar, grid);
    }
    faBar.style.display = '';

    const qInput = document.getElementById('badge-fa-search');
    if (qInput && !qInput._boundFa) {
      qInput._boundFa = true;
      let tmr = null;
      qInput.addEventListener('input', () => {
        clearTimeout(tmr);
        tmr = setTimeout(() => { shopPage = 0; renderShop(); }, 200);
      });
    }

    const q = (qInput?.value || '').trim().toLowerCase().replace(/^fa-regular\s+fa-/, '').replace(/^fa-/, '');
    const owned = (currentPlayer && currentPlayer.avatarBadges) || {};
    const eq = (currentPlayer && currentPlayer.avatarBadgeId) || null;

    const renderWithList = (allSlugs) => {
      let slugs = allSlugs || [];
      if (q) slugs = slugs.filter(s => s.indexOf(q) >= 0);
      
      const matched = slugs.length;
      const slice = slugs.slice(0, BADGE_PAGE);
      if (countEl) {
        countEl.textContent = matched > BADGE_PAGE
          ? ('Hiện ' + BADGE_PAGE + '/' + matched.toLocaleString() + ' icon · gõ thêm để lọc (FA Pro)')
          : (matched.toLocaleString() + ' icon · tối đa 48 + Không badge');
      }
      grid.innerHTML = '';
      const none = document.createElement('div');
      none.className = 'shop-card';
      none.innerHTML = `<div class="shop-icon"><i class="fa-regular fa-circle-xmark" style="font-size:1.6rem"></i></div>
        <div class="shop-name">Không badge</div>
        <div class="shop-owned">${!eq ? shopOwnedLabel('equipped') : ''}</div>
        <button class="btn btn-secondary btn-equip-badge" data-id="none">Gỡ</button>`;
      grid.appendChild(none);
      slice.forEach(slug => {
        const id = 'ab-' + slug;
        const fa = (typeof faProClass === 'function' ? faProClass(slug) : ('fa-solid fa-' + slug));
        const have = !!owned[id];
        const on = eq === id;
        const price = 400;
        const card = document.createElement('div');
        card.className = 'shop-card';
        card.innerHTML = `<div class="shop-icon" style="font-size:1.8rem;color:var(--primary,#16a34a)"><i class="${fa}"></i></div>
          <div class="shop-name">${slug}</div>
          <span class="shop-type">${(fa.split(" ")[0] || "fa-solid").replace("fa-","")}</span>
          <div class="shop-meta"><span style="font-size:0.7rem;opacity:0.75">${fa}</span></div>
          <div class="shop-owned">${on ? shopOwnedLabel('equipped') : (have ? shopOwnedLabel('owned') : shopOwnedLabel('none'))}</div>
          <div class="shop-price">${price.toLocaleString()} 🪙</div>
          ${have
            ? `<button class="btn ${on ? 'btn-secondary' : 'btn-primary'} btn-equip-badge" data-id="${id}">${on ? 'Đang gắn' : 'Gắn'}</button>`
            : `<button class="btn btn-primary btn-buy-badge" data-id="${id}" data-slug="${slug}"><i class="fa-solid fa-cart-plus"></i> Mua</button>`}`;
        grid.appendChild(card);
      });
      grid.querySelectorAll('.btn-buy-badge').forEach(btn => btn.addEventListener('click', async () => {
        const res = await Game.buyAvatarBadge(btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderShop();
        if (typeof applyProfileBadge === 'function') applyProfileBadge();
      }));
      grid.querySelectorAll('.btn-equip-badge').forEach(btn => btn.addEventListener('click', () => {
        const res = Game.equipAvatarBadge(btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(400);
        else if (typeof savePlayer === 'function') savePlayer();
        renderShop();
        if (typeof applyProfileBadge === 'function') applyProfileBadge();
      }));
      if (pager) pager.innerHTML = ''; 
    };

    loadFaProIconList().then(list => {
      if (currentShopTab !== 'badge') return;
      renderWithList(list);
    });
    return;
  }

  if (currentShopTab === 'khung') {
    const countEl = document.getElementById('shop-count');
    document.getElementById('shop-pager').innerHTML = '';
    const frames = (Game.getAvatarFrames && Game.getAvatarFrames()) || [];
    if (countEl) countEl.textContent = frames.length + ' khung viền gradient · càng đẹp càng đắt';
    const owned = (currentPlayer && currentPlayer.avatarFrames) || {};
    const equipped = (currentPlayer && currentPlayer.avatarFrameId) || null;
    
    const noneCard = document.createElement('div');
    noneCard.className = 'shop-card';
    noneCard.innerHTML = `
      <div class="shop-icon avatar-frame-preview" style="--af-grad:linear-gradient(135deg,#94a3b8,#e2e8f0)"><span class="af-inner"></span></div>
      <div class="shop-name">Không khung</div>
      <span class="shop-type">Mặc định</span>
      <div class="shop-owned">${!equipped ? shopOwnedLabel('equipped') : shopOwnedLabel('none')}</div>
      <div class="shop-price">Miễn phí</div>
      <button class="btn btn-secondary btn-equip-frame" data-id="none">${!equipped ? 'Đang dùng' : 'Gỡ khung'}</button>`;
    grid.appendChild(noneCard);
    const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
    const sorted = frames.slice().sort((a, b) => (a.price || 0) - (b.price || 0) || (rarityOrder[a.rarity] || 0) - (rarityOrder[b.rarity] || 0));
    sorted.forEach(fr => {
      const have = !!owned[fr.id];
      const on = equipped === fr.id;
      const rarityLabel = fr.rarity === 'legendary' ? 'Huyền thoại' : fr.rarity === 'epic' ? 'Sử thi' : fr.rarity === 'rare' ? 'Hiếm' : 'Thường';
      const card = document.createElement('div');
      card.className = 'shop-card shop-card-frame rarity-' + (fr.rarity || 'common');
      card.innerHTML = `
        <div class="shop-icon avatar-frame-preview" style="--af-grad:${fr.gradient}"><span class="af-inner"></span></div>
        <div class="shop-name">${fr.name}</div>
        <span class="shop-type">Khung · ${rarityLabel}</span>
        <div class="shop-meta"><span>${fr.desc || ''}</span></div>
        <div class="shop-owned">${on ? shopOwnedLabel('equipped') : (have ? shopOwnedLabel('owned') : shopOwnedLabel('none'))}</div>
        <div class="shop-price">${(fr.price || 0).toLocaleString()} 🪙</div>
        ${have
          ? `<button class="btn ${on ? 'btn-secondary' : 'btn-primary'} btn-equip-frame" data-id="${fr.id}">${on ? 'Đang gắn' : 'Gắn khung'}</button>`
          : `<button class="btn btn-primary btn-buy-frame" data-id="${fr.id}"><i class="fa-solid fa-cart-plus"></i> Mua</button>`}
      `;
      grid.appendChild(card);
    });
    grid.querySelectorAll('.btn-buy-frame').forEach(btn => {
      btn.addEventListener('click', async () => {
        const res = await Game.buyAvatarFrame(btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderShop();
        if (typeof applyProfileAvatarFrame === 'function') applyProfileAvatarFrame();
      });
    });
    grid.querySelectorAll('.btn-equip-frame').forEach(btn => {
      btn.addEventListener('click', async () => {
        const res = Game.equipAvatarFrame(btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(400);
        else if (typeof savePlayer === 'function') savePlayer();
        renderShop();
        if (typeof applyProfileAvatarFrame === 'function') applyProfileAvatarFrame();
      });
    });
    return;
  }

  if (currentShopTab === 'pet') {
    const countEl = document.getElementById('shop-count');
    document.getElementById('shop-pager').innerHTML = '';
    const pets = Game.getPets();
    if (countEl) countEl.textContent = pets.length + ' pet · đi dạo vườn, hiếm khi nhặt xu';
    const owned = (currentPlayer && currentPlayer.pets) || {};
    pets.forEach(pet => {
      const have = !!owned[pet.id];
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `
        <div class="shop-icon" style="font-size:2.2rem">${pet.icon}</div>
        <div class="shop-name">${pet.name}</div>
        <span class="shop-type">Pet · ${pet.species === 'cat' ? 'Mèo' : pet.species === 'dog' ? 'Chó' : 'Khác'}</span>
        <div class="shop-meta"><span>Nhặt xu ~${((pet.coinChance || 0) * 100).toFixed(1)}%/tick</span></div>
        <div class="shop-owned">${have ? shopOwnedLabel('owned') : shopOwnedLabel('none')}</div>
        <div class="shop-price">${pet.price.toLocaleString()} 🪙</div>
        <p class="bulk-hint" style="font-size:0.78rem;margin:6px 0">${pet.desc || ''}</p>
        <button class="btn ${have ? 'btn-secondary' : 'btn-primary'} btn-buy-pet" data-id="${pet.id}" ${have ? 'disabled' : ''}>
          <i class="fa-solid fa-${have ? 'check' : 'cart-plus'}"></i> ${have ? 'Đã có' : 'Mua'}
        </button>`;
      grid.appendChild(card);
    });
    grid.querySelectorAll('.btn-buy-pet').forEach(btn => {
      btn.addEventListener('click', async () => {
        const res = await Game.buyPet(btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderShop();
        if (typeof renderGardenPets === 'function') renderGardenPets();
      });
    });
    return;
  }

  const plants = getShopPlantsFiltered();
  const totalPages = Math.max(1, Math.ceil(plants.length / SHOP_PAGE_SIZE));
  if (shopPage >= totalPages) shopPage = totalPages - 1;
  const slice = plants.slice(shopPage * SHOP_PAGE_SIZE, (shopPage + 1) * SHOP_PAGE_SIZE);

  const countEl = document.getElementById('shop-count');
  if (countEl) countEl.textContent = `${plants.length} loại · trang ${shopPage + 1}/${totalPages}`;

  
  const activeLimited = Game.getPlants().filter(p => Game.isPlantLimited(p) && Game.isPlantAvailable(p));
  if (activeLimited.length && currentShopTab !== 'odat' && currentShopTab !== 'phan' && currentShopTab !== 'baoho' && currentShopTab !== 'tien' && currentShopTab !== 'nyc' && currentShopTab !== 'helper' && currentShopTab !== 'khung' && currentShopTab !== 'companion') {
    const banner = document.createElement('div');
    banner.className = 'shop-event-banner';
    banner.innerHTML = `<i class="fa-solid fa-bolt"></i> <strong>${activeLimited.length} hạt Limited</strong> đang mở bán — nhanh tay trước khi hết sự kiện!`;
    grid.appendChild(banner);
  }

  slice.forEach(plant => {
    const have = seeds[plant.id] || 0;
    const limited = Game.isPlantLimited(plant);
    const available = Game.isPlantAvailable(plant);
    const card = document.createElement('div');
    card.className = 'shop-card' + (limited ? ' shop-card-limited' : '') + (!available ? ' shop-card-locked' : '');
    const badge = limited
      ? `<span class="badge-limited" title="${Game.getLimitedEventLabel(plant)}">Limited</span>`
      : '';
    const eventLine = limited
      ? `<div class="shop-event-line">${available ? '🔥 ' + Game.getLimitedEventLabel(plant) : '⛔ Hết / ngoài sự kiện'}</div>`
      : '';
    const isTextIcon = plant.type === 'kytu' || plant.type === 'so';
    let iconHtml = plant.icon || '';
    if (isTextIcon) {
      const raw = String(plant.icon || plant.name || '').slice(0, 10);
      const len = [...raw].length; 
      const sizeClass = len <= 2 ? 'txt-sm' : len <= 4 ? 'txt-md' : len <= 7 ? 'txt-lg' : 'txt-xl';
      iconHtml = `<span class="shop-icon-text ${sizeClass}">${raw.replace(/</g, '&lt;')}</span>`;
    }
    card.innerHTML = `
      ${badge}
      <div class="shop-icon${isTextIcon ? ' shop-icon-chars' : ''}">${iconHtml}</div>
      <div class="shop-name">${plant.name}</div>
      <span class="shop-type">${TYPE_LABELS[plant.type] || plant.type}</span>
      <div class="shop-desc">${plant.desc || ''}</div>
      ${eventLine}
      <div class="shop-meta">
        <span><i class="fa-regular fa-clock"></i> ${plant.growTime}s</span>
        <span><i class="fa-solid fa-box"></i> x${plant.yield}</span>
        <span><i class="fa-solid fa-coins"></i> ${plant.sellPrice}</span>
      </div>
      <div class="shop-owned">Bạn có: <strong>${have.toLocaleString()}</strong> hạt</div>
      <div class="shop-price">${plant.seedPrice} 🪙 / hạt</div>
      <div class="buy-qty">
        <input type="number" class="qty-input" min="1" value="1" data-id="${plant.id}" ${!available ? 'disabled' : ''} placeholder="Số lượng" inputmode="numeric" />
        <button class="btn btn-primary btn-buy" data-id="${plant.id}" ${!available ? 'disabled' : ''}><i class="fa-solid fa-cart-plus"></i> ${available ? 'Mua' : 'Khóa'}</button>
      </div>
    `;
    grid.appendChild(card);
  });

  document.querySelectorAll('.btn-buy').forEach(btn => {
    if (btn.disabled) return;
    const buy = async (qty) => {
      const id = btn.dataset.id;
      const res = await Game.buySeed(id, qty);
      showToast(res.msg, res.ok ? 'success' : 'error');
      updateCoins();
      renderShop();
    };
    bindPressHold(btn, {
      onClick: () => {
        const input = btn.parentElement.querySelector('.qty-input');
        let qty = Math.max(1, parseInt(input?.value || '1', 10) || 1);
        buy(qty);
      },
      onHold: () => openQtyPickModal({
        title: 'Mua bao nhiêu hạt?',
        hint: 'Nhập số lượng (không giới hạn). Tất cả = theo số xu hiện có.',
        confirmLabel: 'Mua',
        maxQty: 0,
        onConfirm: (n) => buy(n)
      })
    });
  });

  
  const pager = document.getElementById('shop-pager');
  renderUxPager(pager, {
    page: shopPage + 1,
    totalPages,
    onChange: (p) => { shopPage = p - 1; renderShop(); }
  });
}


(function bindInvSearch() {
  const el = document.getElementById('inv-search');
  if (!el || el.__invSearchBound) return;
  el.__invSearchBound = true;
  let tmr = null;
  el.addEventListener('input', () => {
    clearTimeout(tmr);
    tmr = setTimeout(() => { if (typeof renderInventory === 'function') renderInventory(); }, 180);
  });
})();
document.querySelectorAll('.inventory-tabs .tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.inventory-tabs .tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.inv-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('inv-' + btn.dataset.tab);
    if (panel) panel.classList.add('active');
    if (typeof renderInventory === 'function') renderInventory();
  });
});

function renderInventory() {
  if (!currentPlayer) return;
  if (typeof Game !== 'undefined' && Game.normalizeHarvestBags) Game.normalizeHarvestBags();
  const seeds = (currentPlayer.inventory && currentPlayer.inventory.seeds) || {};
  const ferts = (currentPlayer.inventory && currentPlayer.inventory.fertilizers) || {};
  const harvest = (currentPlayer.inventory && currentPlayer.inventory.harvest) || {};
  const harvestStar = (currentPlayer.inventory && currentPlayer.inventory.harvestStar) || {};
  const harvestMyth = (currentPlayer.inventory && currentPlayer.inventory.harvestMyth) || {};
  const harvestBought = (currentPlayer.inventory && currentPlayer.inventory.harvestBought) || {};

  
  const invQ = (document.getElementById('inv-search')?.value || '').trim().toLowerCase();
  const seedsEl = document.getElementById('inv-seeds');
  const stars = (currentPlayer.inventory && currentPlayer.inventory.seedsStar) || {};
  const myths = (currentPlayer.inventory && currentPlayer.inventory.seedsMyth) || {};

  const filterIds = (bag) => {
    let ids = Object.keys(bag).filter(id => (bag[id] || 0) > 0);
    if (invQ) {
      ids = ids.filter(id => {
        const p = Game.getPlant(id);
        return ((p && p.name) || id).toLowerCase().includes(invQ);
      });
    }
    return ids;
  };

  const renderSeedBag = (bag, kind, title, emptyMsg, unitFn) => {
    const ids = filterIds(bag);
    let html = `<div class="inv-harvest-section"><h3 class="inv-subhead">${title}</h3>`;
    if (!ids.length) {
      html += `<p class="empty-state">${emptyMsg}</p></div>`;
      return html;
    }
    html += '<div class="inv-grid">' + ids.map(id => {
      const plant = Game.getPlant(id);
      if (!plant) return '';
      const qty = bag[id] || 0;
      const unit = unitFn(plant);
      const tag = kind === 'myth' ? ' ✨' : (kind === 'star' ? ' ⭐' : '');
      const nameStr = plant.name + tag;
      const nameLong = nameStr.length > 12 ? ' text-long' : (nameStr.length > 8 ? ' text-mid' : '');
      const qtyStr = 'x' + qty.toLocaleString() + ' · ' + unit + '🪙/hạt';
      const qtyLong = qtyStr.length > 18 ? ' text-long' : (qtyStr.length > 14 ? ' text-mid' : '');
      const btnCls = kind === 'myth' ? 'btn-warning' : (kind === 'star' ? 'btn-warning' : 'btn-primary');
      return `
        <div class="inv-item${kind === 'myth' ? ' inv-item-myth' : ''}">
          <div class="icon">${plant.icon}${tag}</div>
          <div class="name${nameLong}">${nameStr}</div>
          <div class="qty${qtyLong}">${qtyStr}</div>
          <div class="actions">
            <button class="btn btn-success btn-sell-seed" data-id="${id}" data-kind="${kind}" data-qty="1">Bán 1</button>
            <button class="btn ${btnCls} btn-sell-seed" data-id="${id}" data-kind="${kind}" data-qty="all">Bán hết</button>
          </div>
        </div>`;
    }).join('') + '</div></div>';
    return html;
  };

  const normalIds = filterIds(seeds);
  const starIds = filterIds(stars);
  const mythIds = filterIds(myths);
  if (!normalIds.length && !starIds.length && !mythIds.length) {
    seedsEl.innerHTML = '<p class="empty-state">Chưa có hạt giống. Hãy mua ở Cửa hàng!</p>';
  } else {
    let sHtml = '';
    sHtml += renderSeedBag(
      seeds, 'normal', '🌱 Hạt thường', 'Chưa có hạt thường.',
      p => Math.max(1, Math.floor((p.seedPrice || 1) * 0.5))
    );
    sHtml += renderSeedBag(
      stars, 'star', '⭐ Hạt ghép sao', 'Chưa có hạt sao. Ghép ở tab Ghép hạt.',
      p => Math.max(1, Math.floor((p.seedPrice || 1) * 0.75))
    );
    sHtml += renderSeedBag(
      myths, 'myth', '✨ Hạt huyền thoại', 'Chưa có hạt huyền thoại. Ghép 2 hạt sao ở tab Ghép hạt.',
      p => Math.max(1, Math.floor((p.seedPrice || 1) * 1.2))
    );
    seedsEl.innerHTML = sHtml;
    seedsEl.querySelectorAll('.btn-sell-seed').forEach(btn => {
      const id = btn.dataset.id;
      const kind = btn.dataset.kind || 'normal';
      const sell = async (qty) => {
        let n = qty;
        if (n === 'all') {
          if (kind === 'myth') n = (currentPlayer.inventory.seedsMyth && currentPlayer.inventory.seedsMyth[id]) || 0;
          else if (kind === 'star') n = (currentPlayer.inventory.seedsStar && currentPlayer.inventory.seedsStar[id]) || 0;
          else n = (currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[id]) || 0;
        } else {
          n = Math.max(1, Math.floor(Number(n) || 1));
        }
        const res = await Game.sellSeed(id, n, kind);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderInventory();
      };
      if (btn.dataset.qty === 'all') {
        btn.addEventListener('click', () => sell('all'));
      } else {
        // Bán 1: click = 1, ấn giữ = nhập số lượng
        bindPressHold(btn, {
          onClick: () => sell(1),
          onHold: () => {
            const have = kind === 'myth'
              ? ((currentPlayer.inventory.seedsMyth && currentPlayer.inventory.seedsMyth[id]) || 0)
              : (kind === 'star'
              ? ((currentPlayer.inventory.seedsStar && currentPlayer.inventory.seedsStar[id]) || 0)
              : ((currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[id]) || 0));
            openQtyPickModal({
              title: 'Bán bao nhiêu hạt?',
              hint: 'Bạn có ' + have.toLocaleString() + '. Tất cả = bán hết.',
              confirmLabel: 'Bán',
              maxQty: 0,
              onConfirm: (n) => {
                if (n === 'all') return sell('all');
                const v = Math.min(have, Math.max(1, Math.floor(Number(n) || 1)));
                return sell(v);
              }
            });
          }
        });
      }
    });
  }

  
  const fertEl = document.getElementById('inv-fert');
  const fertIds = Object.keys(ferts).filter(id => ferts[id] > 0);
  if (fertIds.length === 0) {
    fertEl.innerHTML = '<p class="empty-state">Chưa có phân bón. Mua ở Cửa hàng → Phân bón!</p>';
  } else {
    fertEl.innerHTML = '<div class="inv-grid">' + fertIds.map(id => {
      const fert = Game.getFertilizer(id);
      if (!fert) return '';
      const unit = Math.max(1, Math.floor((Number(fert.price) || 10) * 0.5));
      return `
        <div class="inv-item">
          <div class="icon">${fert.icon}</div>
          <div class="name">${fert.name}</div>
          <div class="qty">x${ferts[id]} · −${Math.round((fert.timeReduce || 0) * 100)}% TG · ${unit}🪙/cái</div>
          <div class="actions">
            <button class="btn btn-success btn-sell-fert" data-id="${id}" data-qty="1">Bán 1</button>
            <button class="btn btn-primary btn-sell-fert" data-id="${id}" data-qty="all">Bán hết</button>
          </div>
        </div>
      `;
    }).join('') + '</div>';
    fertEl.querySelectorAll('.btn-sell-fert').forEach(btn => {
      const id = btn.dataset.id;
      const sell = async (qty) => {
        let n = qty;
        if (n === 'all') n = (currentPlayer.inventory.fertilizers && currentPlayer.inventory.fertilizers[id]) || 0;
        else n = Math.max(1, Math.floor(Number(n) || 1));
        const res = await Game.sellFertilizer(id, n);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderInventory();
      };
      if (btn.dataset.qty === 'all') {
        btn.addEventListener('click', () => sell('all'));
      } else {
        bindPressHold(btn, {
          onClick: () => sell(1),
          onHold: () => {
            const have = (currentPlayer.inventory.fertilizers && currentPlayer.inventory.fertilizers[id]) || 0;
            openQtyPickModal({
              title: 'Bán bao nhiêu phân?',
              hint: 'Bạn có ' + have.toLocaleString() + '. Tất cả = bán hết.',
              confirmLabel: 'Bán',
              maxQty: 0,
              onConfirm: (n) => {
                if (n === 'all') return sell('all');
                const v = Math.min(have, Math.max(1, Math.floor(Number(n) || 1)));
                return sell(v);
              }
            });
          }
        });
      }
    });
  }

  
  const harvestEl = document.getElementById('inv-harvest');
  const renderHarvestBag = (bag, kind, title, emptyMsg, priceFn) => {
    let ids = Object.keys(bag).filter(id => (bag[id] || 0) > 0);
    if (invQ) {
      ids = ids.filter(id => {
        const p = Game.getPlant(id);
        return ((p && p.name) || id).toLowerCase().includes(invQ);
      });
    }
    let html = `<div class="inv-harvest-section"><h3 class="inv-subhead">${title}</h3>`;
    if (!ids.length) {
      html += `<p class="empty-state">${emptyMsg}</p></div>`;
      return html;
    }
    html += `<div class="inv-grid">` + ids.map(id => {
      const plant = Game.getPlant(id);
      if (!plant) return '';
      const qty = bag[id];
      const unit = priceFn(plant);
      return `
        <div class="inv-item">
          <div class="icon">${plant.icon}</div>
          <div class="name">${plant.name}</div>
          <div class="qty">x${qty.toLocaleString()} · ${unit}🪙/cái</div>
          <div class="actions">
            <button class="btn btn-success btn-sell-hv" data-id="${id}" data-kind="${kind}" data-qty="1">Bán 1</button>
            <button class="btn btn-primary btn-sell-hv" data-id="${id}" data-kind="${kind}" data-qty="all">Bán hết</button>
          </div>
        </div>`;
    }).join('') + `</div></div>`;
    return html;
  };

  let hHtml = `
    <div style="margin-bottom:14px;display:flex;flex-wrap:wrap;gap:8px;justify-content:center">
      <button class="btn btn-success" id="btn-sell-all-harvest"><i class="fa-solid fa-coins"></i> Bán tất cả hoa quả</button>
    </div>`;
  hHtml += renderHarvestBag(harvest, 'normal', '🌾 Thu hoạch thường', 'Chưa thu hoạch sản phẩm nào.', p => p.sellPrice);
  hHtml += renderHarvestBag(harvestBought, 'bought', '🛒 Đã mua (chợ)', 'Chưa mua hoa quả từ chợ.', p => p.sellPrice);
  hHtml += renderHarvestBag(harvestStar, 'star', '⭐ Ghép sao (thu từ hạt ⭐)', 'Chưa có sản phẩm từ hạt sao.', p => Math.ceil(p.sellPrice * 1.5));
  hHtml += renderHarvestBag(harvestMyth, 'myth', '✨ Huyền thoại (thu từ hạt ✨)', 'Chưa có sản phẩm từ hạt huyền thoại.', p => Math.ceil(p.sellPrice * 2));
  harvestEl.innerHTML = hHtml;

  document.getElementById('btn-sell-all-harvest')?.addEventListener('click', async () => {
    const res = await Game.sellAllHarvest();
    showToast(res.msg || 'Đã bán!', res.ok !== false ? 'success' : 'error');
    updateCoins();
    renderInventory();
  });
  harvestEl.querySelectorAll('.btn-sell-hv').forEach(btn => {
    const id = btn.dataset.id;
    const kind = btn.dataset.kind || 'normal';
    const bagKey = kind === 'myth' ? 'harvestMyth' : (kind === 'star' ? 'harvestStar' : (kind === 'bought' ? 'harvestBought' : 'harvest'));
    const sell = async (qty) => {
      const have = (currentPlayer.inventory[bagKey] && currentPlayer.inventory[bagKey][id]) || 0;
      let n = qty;
      if (n === 'all') n = have;
      else n = Math.min(have, Math.max(1, Math.floor(Number(n) || 1)));
      const res = await Game.sellHarvest(id, n, kind);
      showToast(res.msg, res.ok ? 'success' : 'error');
      updateCoins();
      renderInventory();
    };
    if (btn.dataset.qty === 'all') {
      btn.addEventListener('click', () => sell('all'));
    } else {
      bindPressHold(btn, {
        onClick: () => sell(1),
        onHold: () => {
          const have = (currentPlayer.inventory[bagKey] && currentPlayer.inventory[bagKey][id]) || 0;
          openQtyPickModal({
            title: 'Bán bao nhiêu?',
            hint: 'Bạn có ' + have.toLocaleString() + '. Tất cả = bán hết.',
            confirmLabel: 'Bán',
            maxQty: 0,
            onConfirm: (n) => {
              if (n === 'all') return sell('all');
              return sell(n);
            }
          });
        }
      });
    }
  });

  
  const protEl = document.getElementById('inv-protect');
  if (protEl) {
    const prots = (currentPlayer.inventory && currentPlayer.inventory.protects) || {};
    const pids = Object.keys(prots).filter(id => prots[id] > 0);
    if (!pids.length) {
      protEl.innerHTML = '<p class="empty-state">Chưa có bùa bảo hộ. Mua ở Cửa hàng → Bảo hộ ghép.</p>';
    } else {
      protEl.innerHTML = '<div class="inv-grid">' + pids.map(id => {
        const item = Game.getProtect(id);
        if (!item) return '';
        return `<div class="inv-item"><div class="icon">${item.icon}</div><div class="name">${item.name}</div><div class="qty">x${prots[id]} · ${item.rate}%</div></div>`;
      }).join('') + '</div>';
    }
  }

  
  const mergeEl = document.getElementById('inv-merge');
  if (mergeEl) {
    if (typeof window._mergeSel === 'undefined') {
      window._mergeSel = { plantId: null, protectId: null, mythPlantId: null, mythProtectId: null };
    }
    const starsBag = (currentPlayer.inventory && currentPlayer.inventory.seedsStar) || {};
    const mergeable = Object.keys(seeds).filter(id => (seeds[id] || 0) >= 2);
    const mergeableStar = Object.keys(starsBag).filter(id => (starsBag[id] || 0) >= 2);
    const prots = (currentPlayer.inventory && currentPlayer.inventory.protects) || {};
    const pids = Object.keys(prots).filter(id => prots[id] > 0);
    const baseRate = (Game.getMergeBaseRate && Game.getMergeBaseRate()) || 25;
    const buildProtOpts = (selProt) => {
      return `<option value=""${selProt === '' ? ' selected' : ''}>Không dùng bùa (${baseRate}%)</option>` + pids.map(id => {
        const item = Game.getProtect(id);
        if (!item) return '';
        const sel = id === selProt ? ' selected' : '';
        const eff = Game.getMergeSuccessRate ? Game.getMergeSuccessRate(id) : Math.min(100, baseRate + (item.rate || 0));
        return `<option value="${id}"${sel}>${item.name} → ${eff}% — x${prots[id]}</option>`;
      }).join('');
    };

    let html = '';
    // --- Ghép sao ---
    if (!mergeable.length) {
      html += '<div class="merge-box"><p class="empty-state">Cần ≥ 2 hạt <strong>thường</strong> cùng loại để ghép thành hạt ⭐ (+50% sản lượng & giá bán).</p></div>';
    } else {
      let selPlant = window._mergeSel.plantId;
      if (!selPlant || !mergeable.includes(selPlant)) selPlant = mergeable[0];
      let selProt = window._mergeSel.protectId || '';
      if (selProt && !pids.includes(selProt)) selProt = '';
      const opts = mergeable.map(id => {
        const pl = Game.getPlant(id);
        if (!pl) return '';
        const sel = id === selPlant ? ' selected' : '';
        return `<option value="${id}"${sel}>${pl.icon} ${pl.name} (x${seeds[id]})</option>`;
      }).join('');
      html += `
        <div class="merge-box">
          <p class="merge-lead">Ghép <strong>2 hạt thường</strong> → <strong>1 hạt sao ⭐</strong></p>
          <p class="merge-sub">Thất bại mất 1 hạt (+ bùa nếu có). · Bấm = 1 lần · Ấn giữ = tất cả</p>
          <label>Chọn hạt</label>
          <select id="merge-plant">${opts}</select>
          <label>Bùa bảo hộ (tuỳ chọn)</label>
          <select id="merge-protect">${buildProtOpts(selProt)}</select>
          <button id="btn-do-merge" class="btn btn-primary" style="margin-top:12px"><i class="fa-solid fa-flask-vial"></i> Ghép sao</button>
        </div>`;
    }

    // --- Ghép huyền thoại ---
    if (!mergeableStar.length) {
      html += '<div class="merge-box merge-box-myth"><p class="empty-state">Cần ≥ 2 hạt <strong>sao ⭐</strong> cùng loại để ghép <strong>huyền thoại ✨</strong> (x2 sản lượng, aura huyền bí).</p></div>';
    } else {
      let selM = window._mergeSel.mythPlantId;
      if (!selM || !mergeableStar.includes(selM)) selM = mergeableStar[0];
      let selMP = window._mergeSel.mythProtectId || '';
      if (selMP && !pids.includes(selMP)) selMP = '';
      const optsM = mergeableStar.map(id => {
        const pl = Game.getPlant(id);
        if (!pl) return '';
        const sel = id === selM ? ' selected' : '';
        return `<option value="${id}"${sel}>${pl.icon} ${pl.name} ⭐ (x${starsBag[id]})</option>`;
      }).join('');
      const mythRateHint = Math.max(5, Math.min(100, (Game.getMergeSuccessRate ? Game.getMergeSuccessRate(null) : baseRate) - 5));
      html += `
        <div class="merge-box merge-box-myth">
          <p class="merge-lead">🌌 Ghép <strong>2 hạt sao</strong> → <strong>1 hạt huyền thoại ✨</strong></p>
          <p class="merge-sub">Cùng tỉ lệ bùa như ghép sao (bùa 100% = chắc chắn thành công). Thất bại mất 1 hạt sao. Cây huyền thoại toát aura tím, x2 sản lượng.</p>
          <label>Chọn hạt sao</label>
          <select id="merge-myth-plant">${optsM}</select>
          <label>Bùa bảo hộ (tuỳ chọn)</label>
          <select id="merge-myth-protect">${buildProtOpts(selMP)}</select>
          <button id="btn-do-merge-myth" class="btn btn-primary btn-myth" style="margin-top:12px"><i class="fa-solid fa-sparkles"></i> Ghép huyền thoại</button>
        </div>`;
    }

    mergeEl.innerHTML = html;

    const plantSel = document.getElementById('merge-plant');
    const protSel = document.getElementById('merge-protect');
    plantSel?.addEventListener('change', () => { window._mergeSel.plantId = plantSel.value || null; });
    protSel?.addEventListener('change', () => { window._mergeSel.protectId = protSel.value || null; });
    if (plantSel) window._mergeSel.plantId = plantSel.value || null;
    if (protSel) window._mergeSel.protectId = protSel.value || null;

    const doMerge = async (times) => {
      const pid = plantSel?.value;
      const pr = protSel?.value || null;
      window._mergeSel.plantId = pid || null;
      window._mergeSel.protectId = pr || null;
      if (!pid) { showToast('Chọn hạt!', 'error'); return; }
      let n;
      if (times === 'all' || times === 'max' || times === Infinity) {
        const have = (currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[pid]) || 0;
        n = Math.floor(have / 2);
        if (n < 1) { showToast('Cần ít nhất 2 hạt thường cùng loại!', 'error'); return; }
      } else {
        n = Math.max(1, Math.floor(Number(times) || 1));
      }
      showToast(n <= 1 ? 'Đang ghép…' : ('Đang ghép tất cả · ' + n.toLocaleString() + ' lần…'), 'info');
      const res = await Game.mergeSeeds(pid, pr || null, n);
      showToast(res.msg, res.ok ? (res.success ? 'success' : 'error') : 'error');
      updateCoins();
      renderInventory();
    };
    const mergeBtn = document.getElementById('btn-do-merge');
    if (mergeBtn) {
      bindPressHold(mergeBtn, { onClick: () => doMerge(1), onHold: () => doMerge('all') });
    }

    const mythPlantSel = document.getElementById('merge-myth-plant');
    const mythProtSel = document.getElementById('merge-myth-protect');
    mythPlantSel?.addEventListener('change', () => { window._mergeSel.mythPlantId = mythPlantSel.value || null; });
    mythProtSel?.addEventListener('change', () => { window._mergeSel.mythProtectId = mythProtSel.value || null; });
    if (mythPlantSel) window._mergeSel.mythPlantId = mythPlantSel.value || null;
    if (mythProtSel) window._mergeSel.mythProtectId = mythProtSel.value || null;

    const doMergeMyth = async (times) => {
      const pid = mythPlantSel?.value;
      const pr = mythProtSel?.value || null;
      window._mergeSel.mythPlantId = pid || null;
      window._mergeSel.mythProtectId = pr || null;
      if (!pid) { showToast('Chọn hạt sao!', 'error'); return; }
      let n;
      if (times === 'all' || times === 'max' || times === Infinity) {
        const have = (currentPlayer.inventory.seedsStar && currentPlayer.inventory.seedsStar[pid]) || 0;
        n = Math.floor(have / 2);
        if (n < 1) { showToast('Cần ít nhất 2 hạt sao cùng loại!', 'error'); return; }
      } else {
        n = Math.max(1, Math.floor(Number(times) || 1));
      }
      showToast(n <= 1 ? 'Đang ghép huyền thoại…' : ('Đang ghép huyền thoại · ' + n.toLocaleString() + ' lần…'), 'info');
      const res = await Game.mergeMythSeeds(pid, pr || null, n);
      showToast(res.msg, res.ok ? (res.success ? 'success' : 'error') : 'error');
      updateCoins();
      renderInventory();
    };
    const mythBtn = document.getElementById('btn-do-merge-myth');
    if (mythBtn) {
      bindPressHold(mythBtn, { onClick: () => doMergeMyth(1), onHold: () => doMergeMyth('all') });
    }
    mountAllPillDropdowns(mergeEl);
  }

  
  const invQCos = (document.getElementById('inv-search')?.value || '').trim().toLowerCase();

  
  const petEl = document.getElementById('inv-pet');
  if (petEl) {
    const ownedPets = (currentPlayer.pets) || {};
    let petIds = Object.keys(ownedPets);
    if (invQCos) {
      petIds = petIds.filter(id => {
        const p = Game.getPet && Game.getPet(id);
        return ((p && p.name) || id).toLowerCase().includes(invQCos);
      });
    }
    if (!petIds.length) {
      petEl.innerHTML = '<p class="empty-state">Chưa có Pet. Mua ở Cửa hàng → Pet!</p>';
    } else {
      petEl.innerHTML = '<div class="inv-grid">' + petIds.map(id => {
        const pet = Game.getPet(id);
        if (!pet) return '';
        const on = ownedPets[id] && ownedPets[id].active !== false;
        return `<div class="inv-item">
          <div class="icon" style="font-size:1.8rem">${pet.icon || '🐾'}</div>
          <div class="name">${pet.name || id}</div>
          <div class="qty">${on ? 'Đang bật' : 'Đang tắt'} · nhặt xu hiếm</div>
          <div class="actions">
            <button class="btn ${on ? 'btn-secondary' : 'btn-primary'} btn-toggle-pet" data-id="${id}" data-on="${on ? '0' : '1'}">${on ? 'Tắt' : 'Bật'}</button>
          </div>
        </div>`;
      }).join('') + '</div>';
      petEl.querySelectorAll('.btn-toggle-pet').forEach(btn => {
        btn.addEventListener('click', () => {
          const res = Game.togglePet(btn.dataset.id, btn.dataset.on === '1');
          showToast(res.msg || (btn.dataset.on === '1' ? 'Đã bật pet' : 'Đã tắt pet'), res.ok !== false ? 'success' : 'error');
          if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(400);
          else if (typeof savePlayer === 'function') savePlayer();
          renderInventory();
        });
      });
    }
  }

  
  const khungEl = document.getElementById('inv-khung');
  if (khungEl) {
    const owned = (currentPlayer.avatarFrames) || {};
    const eq = currentPlayer.avatarFrameId || null;
    let ids = Object.keys(owned);
    if (invQCos) {
      ids = ids.filter(id => {
        const f = Game.getAvatarFrame && Game.getAvatarFrame(id);
        return ((f && f.name) || id).toLowerCase().includes(invQCos);
      });
    }
    let html = '<div class="inv-grid">';
    html += `<div class="inv-item">
      <div class="icon"><i class="fa-regular fa-circle" style="font-size:1.6rem;opacity:0.5"></i></div>
      <div class="name">Không khung</div>
      <div class="qty">${!eq ? 'Đang dùng' : ''}</div>
      <div class="actions"><button class="btn btn-secondary btn-equip-inv-frame" data-id="none">Gỡ</button></div>
    </div>`;
    if (!ids.length) {
      html += '</div><p class="empty-state">Chưa có khung. Mua ở Cửa hàng → Khung avatar!</p>';
    } else {
      html += ids.map(id => {
        const f = Game.getAvatarFrame(id);
        if (!f) return '';
        const on = eq === id;
        const grad = f.gradient || 'linear-gradient(135deg,#22c55e,#86efac)';
        return `<div class="inv-item">
          <div class="icon" style="width:48px;height:48px;border-radius:50%;padding:3px;background:${grad};margin:0 auto">
            <div style="width:100%;height:100%;border-radius:50%;background:var(--card,#0b3d2e)"></div>
          </div>
          <div class="name">${f.name || id}</div>
          <div class="qty">${on ? 'Đang gắn' : (f.rarity || '')}</div>
          <div class="actions">
            <button class="btn ${on ? 'btn-secondary' : 'btn-primary'} btn-equip-inv-frame" data-id="${id}">${on ? 'Đang gắn' : 'Gắn'}</button>
          </div>
        </div>`;
      }).join('') + '</div>';
    }
    khungEl.innerHTML = html;
    khungEl.querySelectorAll('.btn-equip-inv-frame').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = Game.equipAvatarFrame(btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(400);
        if (typeof applyProfileAvatarFrame === 'function') applyProfileAvatarFrame();
        else if (typeof renderProfile === 'function') renderProfile();
        renderInventory();
      });
    });
  }

  
  const compEl = document.getElementById('inv-companion');
  if (compEl) {
    const owned = (currentPlayer.companions) || {};
    const eq = currentPlayer.companionId || null;
    let ids = Object.keys(owned);
    if (invQCos) {
      ids = ids.filter(id => {
        const c = Game.getCompanion && Game.getCompanion(id);
        return ((c && c.name) || id).toLowerCase().includes(invQCos);
      });
    }
    let html = '<div class="inv-grid">';
    html += `<div class="inv-item">
      <div class="icon">—</div>
      <div class="name">Không thú cưng</div>
      <div class="qty">${!eq ? 'Đang dùng' : ''}</div>
      <div class="actions"><button class="btn btn-secondary btn-equip-inv-comp" data-id="none">Gỡ</button></div>
    </div>`;
    if (!ids.length) {
      html += '</div><p class="empty-state">Chưa có thú cưng. Mua ở Cửa hàng → Thú cưng!</p>';
    } else {
      html += ids.map(id => {
        const c = Game.getCompanion(id);
        if (!c) return '';
        const on = eq === id;
        return `<div class="inv-item">
          <div class="icon" style="font-size:1.8rem">${c.emoji || c.icon || '🐾'}</div>
          <div class="name">${c.name || id}</div>
          <div class="qty">${on ? 'Đang gắn' : (c.rarity || '')}</div>
          <div class="actions">
            <button class="btn ${on ? 'btn-secondary' : 'btn-primary'} btn-equip-inv-comp" data-id="${id}">${on ? 'Đang gắn' : 'Gắn'}</button>
          </div>
        </div>`;
      }).join('') + '</div>';
    }
    compEl.innerHTML = html;
    compEl.querySelectorAll('.btn-equip-inv-comp').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = Game.equipCompanion(btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(400);
        if (typeof applyProfileCompanion === 'function') applyProfileCompanion();
        renderInventory();
      });
    });
  }

  
  const badgeEl = document.getElementById('inv-badge');
  if (badgeEl) {
    const owned = (currentPlayer.avatarBadges) || {};
    const eq = currentPlayer.avatarBadgeId || null;
    let ids = Object.keys(owned);
    if (invQCos) {
      ids = ids.filter(id => {
        const b = Game.getAvatarBadge && Game.getAvatarBadge(id);
        const slug = (owned[id] && owned[id].slug) || id.replace(/^ab-/, '');
        const name = (b && b.name) || slug || id;
        return String(name).toLowerCase().includes(invQCos) || String(slug).toLowerCase().includes(invQCos);
      });
    }
    let html = '<div class="inv-grid">';
    html += `<div class="inv-item">
      <div class="icon"><i class="fa-regular fa-circle-xmark" style="font-size:1.6rem;opacity:0.5"></i></div>
      <div class="name">Không badge</div>
      <div class="qty">${!eq ? 'Đang dùng' : ''}</div>
      <div class="actions"><button class="btn btn-secondary btn-equip-inv-badge" data-id="none">Gỡ</button></div>
    </div>`;
    if (!ids.length) {
      html += '</div><p class="empty-state">Chưa có icon badge. Mua ở Cửa hàng → Icon badge!</p>';
    } else {
      html += ids.map(id => {
        const b = Game.getAvatarBadge(id);
        const ownedRec = owned[id] || {};
        const fa = ownedRec.fa || (b && b.fa) || ('fa-solid fa-' + id.replace(/^ab-/, ''));
        const name = (b && b.name) || ownedRec.slug || id.replace(/^ab-/, '');
        const on = eq === id;
        return `<div class="inv-item">
          <div class="icon" style="font-size:1.8rem;color:var(--primary)"><i class="${fa}"></i></div>
          <div class="name">${name}</div>
          <div class="qty">${on ? 'Đang gắn' : fa}</div>
          <div class="actions">
            <button class="btn ${on ? 'btn-secondary' : 'btn-primary'} btn-equip-inv-badge" data-id="${id}">${on ? 'Đang gắn' : 'Gắn'}</button>
          </div>
        </div>`;
      }).join('') + '</div>';
    }
    badgeEl.innerHTML = html;
    badgeEl.querySelectorAll('.btn-equip-inv-badge').forEach(btn => {
      btn.addEventListener('click', () => {
        const res = Game.equipAvatarBadge(btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(400);
        if (typeof applyProfileBadge === 'function') applyProfileBadge();
        renderInventory();
      });
    });
  }
}


function renderStats() {
  if (!currentPlayer) return;
  const s = currentPlayer.stats || {};
  const plots = Array.isArray(currentPlayer.plots) ? currentPlayer.plots : Object.values(currentPlayer.plots || {});
  const xpNext = Game.xpForLevel(currentPlayer.level || 1);
  const colN = Game.collectionCount();
  const colPct = Game.collectionPercent();
  const achUnlocked = Object.keys(currentPlayer.achievements || {}).length;
  const achTotal = Game.getAchievementsDef().length;

  const coinsStr = (currentPlayer.coins || 0).toLocaleString('vi-VN');
  const earnedStr = (s.earned || 0).toLocaleString('vi-VN');
  const spentStr = (s.spent || 0).toLocaleString('vi-VN');
  const longCoins = coinsStr.replace(/\D/g, '').length >= 9 ? ' stat-value-long' : '';
  const longEarned = earnedStr.replace(/\D/g, '').length >= 9 ? ' stat-value-long' : '';
  const longSpent = spentStr.replace(/\D/g, '').length >= 9 ? ' stat-value-long' : '';
  document.getElementById('stats-grid').innerHTML = `
    <div class="stat-card">
      <div class="value">${currentPlayer.level || 1}</div>
      <div class="label"><i class="fa-solid fa-star"></i> Cấp độ</div>
    </div>
    <div class="stat-card">
      <div class="value">${currentPlayer.xp || 0}/${xpNext}</div>
      <div class="label"><i class="fa-solid fa-bolt"></i> Kinh nghiệm</div>
    </div>
    <div class="stat-card">
      <div class="value${longCoins}">${coinsStr}</div>
      <div class="label"><i class="fa-solid fa-coins"></i> Tiền hiện có</div>
    </div>
    <div class="stat-card">
      <div class="value">${s.planted || 0}</div>
      <div class="label"><i class="fa-solid fa-seedling"></i> Đã trồng</div>
    </div>
    <div class="stat-card">
      <div class="value">${s.harvested || 0}</div>
      <div class="label"><i class="fa-solid fa-basket-shopping"></i> Đã thu hoạch</div>
    </div>
    <div class="stat-card">
      <div class="value${longEarned}">${earnedStr}</div>
      <div class="label"><i class="fa-solid fa-arrow-trend-up"></i> Tổng thu nhập</div>
    </div>
    <div class="stat-card">
      <div class="value${longSpent}">${spentStr}</div>
      <div class="label"><i class="fa-solid fa-cart-shopping"></i> Tổng chi tiêu</div>
    </div>
    <div class="stat-card">
      <div class="value">${plots.filter(p => p.plantId).length}/${plots.length}</div>
      <div class="label"><i class="fa-solid fa-border-all"></i> Ô đang trồng</div>
    </div>
    <div class="stat-card">
      <div class="value">${colN} <small>(${colPct}%)</small></div>
      <div class="label"><i class="fa-solid fa-book-open"></i> Bộ sưu tập</div>
    </div>
    <div class="stat-card">
      <div class="value">${achUnlocked}/${achTotal}</div>
      <div class="label"><i class="fa-solid fa-medal"></i> Thành tựu</div>
    </div>
  `;

  
  const albumEl = document.getElementById('collection-album');
  if (albumEl) {
    const plants = Game.getPlants() || [];
    const col = currentPlayer.collection || {};
    const isPc = window.matchMedia('(min-width: 900px)').matches;
    const pageSize = isPc ? 55 : 30;
    if (typeof window._albumPage !== 'number') window._albumPage = 0;
    const totalPages = Math.max(1, Math.ceil(plants.length / pageSize));
    if (window._albumPage >= totalPages) window._albumPage = totalPages - 1;
    const page = window._albumPage;
    const slice = plants.slice(page * pageSize, (page + 1) * pageSize);
    albumEl.className = 'collection-album' + (isPc ? ' album-pc-grid' : '');
    albumEl.innerHTML = slice.map(p => {
      const unlocked = !!col[p.id];
      return `<div class="album-item ${unlocked ? 'unlocked' : 'locked'}" title="${unlocked ? p.name : '???'}">
        <span class="album-icon">${unlocked ? p.icon : '❔'}</span>
        <span class="album-name">${unlocked ? p.name : 'Chưa mở'}</span>
      </div>`;
    }).join('') + `<div class="album-pager ux-pager shop-pager" id="album-pager" style="grid-column:1/-1"></div>`;
    const albumPager = document.getElementById('album-pager');
    if (typeof renderUxPager === 'function') {
      renderUxPager(albumPager, {
        page: page + 1,
        totalPages: totalPages,
        onChange: (p) => {
          window._albumPage = Math.max(0, Math.min(totalPages - 1, p - 1));
          renderStats();
        }
      });
    } else if (albumPager) {
      albumPager.innerHTML = `
        <button type="button" class="btn btn-secondary" id="album-prev" ${page<=0?'disabled':''}><i class="fa-solid fa-chevron-left"></i></button>
        <span class="ux-pager-info">${page+1}/${totalPages}</span>
        <button type="button" class="btn btn-secondary" id="album-next" ${page>=totalPages-1?'disabled':''}><i class="fa-solid fa-chevron-right"></i></button>`;
      document.getElementById('album-prev')?.addEventListener('click', () => {
        window._albumPage = Math.max(0, page - 1);
        renderStats();
      });
      document.getElementById('album-next')?.addEventListener('click', () => {
        window._albumPage = Math.min(totalPages - 1, page + 1);
        renderStats();
      });
    }
  }

  
  const achEl = document.getElementById('achievements-list');
  if (achEl) {
    const have = currentPlayer.achievements || {};
    achEl.innerHTML = Game.getAchievementsDef().map(a => {
      const ok = !!have[a.id];
      return `<div class="ach-item ${ok ? 'done' : ''}">
        <span class="ach-icon">${a.icon}</span>
        <div class="ach-info">
          <strong>${a.name}</strong>
          <span>${a.desc}</span>
        </div>
        <span class="ach-status">${ok ? '✓' : '…'}</span>
      </div>`;
    }).join('');
  }

}


function formatActivityTime(ts, firstAt) {
  // Danh sách: chỉ HH:mm của mốc log (timestamp)
  if (typeof Game !== 'undefined' && Game.formatLogClock) {
    return Game.formatLogClock(ts || firstAt) || '';
  }
  if (!ts && !firstAt) return '';
  try {
    const ms = ts || firstAt;
    if (typeof formatGameDateTime === 'function') {
      const s = formatGameDateTime(ms, false);
      const m = String(s).match(/(\d{1,2}:\d{2})/);
      if (m) return m[1].padStart(5, '0');
    }
    return new Date(ms).toLocaleTimeString('vi-VN', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Ho_Chi_Minh'
    });
  } catch (_) {
    return '';
  }
}

function activityFaIcon(text, type) {
  const t = String(type || '');
  if (t === 'garden') return 'fa-solid fa-seedling';
  if (t === 'fairy') return 'fa-solid fa-wand-magic-sparkles';
  if (t === 'nyc') return 'fa-solid fa-heart';
  if (t === 'helper') return 'fa-solid fa-user-check';
  if (t === 'robot') return 'fa-solid fa-robot';
  if (t === 'offline') return 'fa-solid fa-bolt';
  if (t === 'level' || t === 'levelup') return 'fa-solid fa-star';
  if (t === 'rain') return 'fa-solid fa-cloud-rain';
  if (t === 'reward' || t === 'daily') return 'fa-solid fa-gift';
  return 'fa-solid fa-circle-dot';
}


function formatLogEventsHtml(d) {
  const evs = (d && Array.isArray(d.events)) ? d.events : [];
  if (!evs.length) return '';
  const clock = (ts) => {
    if (!ts) return '';
    if (typeof Game !== 'undefined' && Game.formatLogClock) return Game.formatLogClock(ts);
    try {
      return new Date(ts).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Ho_Chi_Minh' });
    } catch (_) { return ''; }
  };
  const label = (ev) => {
    const a = String(ev.action || '');
    const n = ev.name ? String(ev.name) : '';
    const costStr = (ev.cost != null && Number(ev.cost) > 0) ? (' · −' + Number(ev.cost).toLocaleString() + '🪙') : '';
    if (a === 'plant') return 'Trồng ' + (n ? n + ' · ' : '') + (ev.plots || ev.qty || 1) + ' ô';
    if (a === 'water') return 'Tưới ' + (ev.plots || 1) + ' ô' + (ev.plotId != null ? ' (#' + (Number(ev.plotId) + 1) + ')' : '');
    if (a === 'fert') return 'Bón ' + (n || 'phân') + ' · ' + (ev.plots || 1) + ' ô';
    if (a === 'replant') return 'Trồng lại ' + (n ? n + ' · ' : '') + (ev.plots || 1) + ' ô';
    if (a === 'harvest') return 'Thu hoạch ' + (n ? n + ' · ' : '') + (ev.plots || 1) + ' ô · +' + (ev.yield || 0) + ' SP';
    if (a === 'fairy_water') return 'Tiên tưới ' + (ev.actions || ev.plots || 1) + ' ô';
    if (a === 'fairy_fert') return 'Tiên bón ' + (ev.actions || 1) + ' lần';
    if (a === 'fairy_rain_seed') return 'Nhặt hạt mưa ×' + (ev.qty || 1) + (n ? ' (' + n + ')' : '');
    if (a === 'nyc_plant') return 'NYC trồng ' + (n ? n + ' · ' : '') + (ev.plots || 1) + ' ô';
    if (a === 'nyc_harvest') return 'NYC thu ' + (n ? n + ' · ' : '') + '+' + (ev.yield || 0) + ' SP';
    if (a === 'helper_buy') return 'Giúp việc mua phân ×' + (ev.qty || 1) + costStr;
    if (a === 'robot_seed') return 'Robot mua hạt «' + (n || '?') + '» ×' + Number(ev.qty || 1).toLocaleString() + costStr;
    if (a === 'robot_cook') return 'Robot nấu «' + (n || 'món') + '» ×' + Number(ev.qty || 1).toLocaleString();
    if (a === 'robot_merge') return 'Robot ghép ⭐×' + (ev.star || 0) + ' · ✨×' + (ev.myth || 0);
    if (a === 'rain') return 'Mưa ×' + (ev.count || 1) + ' trận';
    if (a === 'levelup') return 'Lên cấp → Lv ' + (ev.level || '');
    if (a === 'daily') return 'Thưởng ngày +' + Number(ev.coins || 0).toLocaleString() + '🪙' + (ev.streak ? ' · streak ' + ev.streak : '');
    if (a === 'xp') return 'Nhận +' + (ev.xp || 0) + ' XP';
    return a + (n ? ' · ' + n : '') + (ev.qty != null ? ' ×' + ev.qty : '') + (ev.plots != null ? ' · ' + ev.plots + ' ô' : '') + costStr;
  };
  // hiện tối đa 80 event gần nhất
  const slice = evs.slice(-80);
  let h = '<div class="ad-block ad-events"><div class="ad-label">📋 Chi tiết thao tác (' + evs.length + ')</div><ul class="ad-list ad-events-list">';
  slice.forEach(ev => {
    h += '<li><span class="ad-ev-time">' + clock(ev.timestamp) + '</span> · ' + label(ev) + '</li>';
  });
  if (evs.length > 80) h += '<li style="opacity:.7">… và ' + (evs.length - 80) + ' thao tác trước</li>';
  h += '</ul></div>';
  return h;
}

function formatActivityDetailHtml(log) {
  // Modal CHI TIẾT đầy đủ — list ngoài ngắn, trong này liệt kê đã làm gì
  if (log && (log.aggregated || (log._event && log._event.aggregated) || log.action === 'day_summary' || (log._event && log._event.action === 'day_summary'))) {
    const ev = log._event || log;
    const d = Object.assign({}, (ev.detail || {}), (log.detail || {}));
    // actor từ nhiều nguồn
    const actor = d.actor || ev.actor || log.actor || '';
    const esc = (s) => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    const num = (n) => Number(n || 0).toLocaleString('vi-VN');
    let html = '';

    // Khung giờ
    const firstAt = d.firstAt || ev.firstAt || log.firstAt;
    const lastAt = d.lastAt || ev.lastAt || log.timestamp || ev.timestamp;
    let timeStr = '—';
    if (typeof Game !== 'undefined' && Game.formatLogClock) {
      if (firstAt && lastAt && Math.abs(lastAt - firstAt) >= 1000) {
        timeStr = Game.formatLogClock(firstAt, true) + ' → ' + Game.formatLogClock(lastAt, true);
      } else if (lastAt || firstAt) {
        timeStr = Game.formatLogClock(lastAt || firstAt, true);
      }
    }
    html += '<div class="ad-hero"><div class="ad-hero-label">Thời gian hoạt động</div><div class="ad-hero-value">' + esc(timeStr) + '</div></div>';

    if (actor === 'nyc') {
      const name = d.name || 'NYC';
      html += '<div class="ad-block"><div class="ad-label">' + esc(name) + ' đã làm gì hôm nay</div>';
      html += '<ul class="ad-list ad-list-rich">';
      html += '<li><span class="ad-li-k">Số vườn NYC xử lý</span><span class="ad-li-v">' + esc(d.gardens || 0) + ' vườn</span></li>';
      html += '<li><span class="ad-li-k">Tổng lần trồng / thu (mỗi ô = 1 lần)</span><span class="ad-li-v">' + esc(num(d.plantTimes)) + ' lần</span></li>';
      html += '<li><span class="ad-li-k">Tổng sản phẩm thu được</span><span class="ad-li-v">+' + esc(num(d.harvestYield)) + ' SP</span></li>';
      html += '</ul></div>';

      if (Array.isArray(d.byGarden) && d.byGarden.length) {
        html += '<div class="ad-block"><div class="ad-label">Chi tiết từng vườn</div><ul class="ad-list ad-list-rich">';
        d.byGarden.forEach(g => {
          const label = g.gardenLabel || ('Vườn ' + (Number(g.gardenIndex) + 1));
          const times = g.plantTimes != null ? g.plantTimes : (g.planted || 0);
          const y = g.yield || 0;
          const ph = g.plotsHarvested || 0;
          html += '<li class="ad-li-stack"><strong>' + esc(label) + '</strong>';
          html += '<div class="ad-li-sub">• Số lần trồng/thu (mỗi ô 1 lần): <b>' + esc(num(times)) + '</b></div>';
          if (ph) html += '<div class="ad-li-sub">• Số ô thu hoạch: <b>' + esc(num(ph)) + '</b></div>';
          html += '<div class="ad-li-sub">• Sản phẩm: <b>+' + esc(num(y)) + ' SP</b></div>';
          html += '</li>';
        });
        html += '</ul></div>';
      }
      html += '<p class="ad-note">Ghi chú: mỗi ô được NYC trồng hoặc thu tính đúng 1 lần.</p>';
      return html;
    }

    if (actor === 'robot') {
      const name = d.name || 'Robot';
      html += '<div class="ad-block"><div class="ad-label">' + esc(name) + ' đã làm gì hôm nay</div>';
      html += '<ul class="ad-list ad-list-rich">';
      html += '<li><span class="ad-li-k">Tổng tiền mua hạt</span><span class="ad-li-v">-' + esc(num(d.seedCost)) + ' xu</span></li>';
      html += '<li><span class="ad-li-k">Ghép hạt sao</span><span class="ad-li-v">×' + esc(num(d.mergeStar)) + '</span></li>';
      html += '<li><span class="ad-li-k">Ghép hạt huyền thoại</span><span class="ad-li-v">×' + esc(num(d.mergeMyth)) + '</span></li>';
      html += '<li><span class="ad-li-k">Số món đã nấu</span><span class="ad-li-v">' + esc(num(d.cookCount)) + ' món</span></li>';
      html += '</ul></div>';

      if (Array.isArray(d.seedsBought) && d.seedsBought.length) {
        html += '<div class="ad-block"><div class="ad-label">Danh sách hạt đã mua</div><ul class="ad-list ad-list-rich">';
        d.seedsBought.forEach(it => {
          html += '<li><span class="ad-li-k">' + esc(it.name) + '</span><span class="ad-li-v">×' + esc(num(it.qty)) + '</span></li>';
        });
        html += '</ul></div>';
      } else {
        html += '<div class="ad-block"><div class="ad-label">Danh sách hạt đã mua</div><p class="ad-empty-line">Chưa mua hạt trong phiên này.</p></div>';
      }

      if (Array.isArray(d.cooked) && d.cooked.length) {
        html += '<div class="ad-block"><div class="ad-label">Danh sách món đã nấu</div><ul class="ad-list ad-list-rich">';
        d.cooked.forEach(it => {
          html += '<li><span class="ad-li-k">' + esc(it.name) + '</span><span class="ad-li-v">×' + esc(num(it.qty)) + '</span></li>';
        });
        html += '</ul></div>';
      }

      html += '<div class="ad-block"><div class="ad-label">Ghép hạt</div><ul class="ad-list ad-list-rich">';
      html += '<li><span class="ad-li-k">Hạt sao tạo được</span><span class="ad-li-v">×' + esc(num(d.mergeStar)) + '</span></li>';
      html += '<li><span class="ad-li-k">Hạt huyền thoại tạo được</span><span class="ad-li-v">×' + esc(num(d.mergeMyth)) + '</span></li>';
      html += '</ul></div>';
      return html;
    }

    if (actor === 'fairy') {
      const name = d.name || 'Tiên';
      html += '<div class="ad-block"><div class="ad-label">' + esc(name) + ' đã chăm sóc gì</div>';
      html += '<ul class="ad-list ad-list-rich">';
      html += '<li><span class="ad-li-k">Số vườn đã chăm</span><span class="ad-li-v">' + esc(num(d.gardensWatered)) + ' vườn</span></li>';
      html += '<li><span class="ad-li-k">Số lần tưới</span><span class="ad-li-v">' + esc(num(d.waterActions)) + ' lần</span></li>';
      html += '<li><span class="ad-li-k">Số lần bón phân</span><span class="ad-li-v">' + esc(num(d.fertActions)) + ' lần</span></li>';
      html += '<li><span class="ad-li-k">Hạt nhặt khi mưa</span><span class="ad-li-v">' + esc(num(d.rainSeeds)) + ' hạt</span></li>';
      html += '</ul></div>';
      html += '<p class="ad-note">Theo cấu hình Tiên hiện tại (tưới / bón / nhặt hạt mưa).</p>';
      return html;
    }

    if (actor === 'helper') {
      const name = d.name || 'Giúp việc';
      html += '<div class="ad-block"><div class="ad-label">' + esc(name) + ' đã mua gì</div>';
      html += '<ul class="ad-list ad-list-rich">';
      html += '<li><span class="ad-li-k">Tổng số món</span><span class="ad-li-v">' + esc(num(d.qty)) + '</span></li>';
      html += '<li><span class="ad-li-k">Tổng tiền đã mất</span><span class="ad-li-v">-' + esc(num(d.spent)) + ' xu</span></li>';
      html += '</ul></div>';
      if (Array.isArray(d.items) && d.items.length) {
        html += '<div class="ad-block"><div class="ad-label">Chi tiết từng món</div><ul class="ad-list ad-list-rich">';
        d.items.forEach(it => {
          html += '<li><span class="ad-li-k">' + esc(it.name) + '</span><span class="ad-li-v">×' + esc(num(it.qty)) + '</span></li>';
        });
        html += '</ul></div>';
      } else {
        html += '<p class="ad-empty-line">Chưa ghi nhận danh sách món (sẽ có sau các lần mua mới).</p>';
      }
      return html;
    }

    if (actor === 'garden') {
      html += '<div class="ad-block"><div class="ad-label">Bạn đã làm gì trên vườn</div>';
      html += '<ul class="ad-list ad-list-rich">';
      html += '<li><span class="ad-li-k">Số lần trồng</span><span class="ad-li-v">' + esc(num(d.planted)) + '</span></li>';
      html += '<li><span class="ad-li-k">Số ô thu hoạch</span><span class="ad-li-v">' + esc(num(d.plotsHarvested)) + '</span></li>';
      html += '<li><span class="ad-li-k">Sản phẩm nhận được</span><span class="ad-li-v">+' + esc(num(d.harvestYield)) + ' SP</span></li>';
      html += '<li><span class="ad-li-k">Trồng lại</span><span class="ad-li-v">' + esc(num(d.replanted)) + '</span></li>';
      html += '</ul></div>';
      if (Array.isArray(d.byGarden) && d.byGarden.length) {
        html += '<div class="ad-block"><div class="ad-label">Từng vườn</div><ul class="ad-list ad-list-rich">';
        d.byGarden.forEach(g => {
          html += '<li class="ad-li-stack"><strong>' + esc(g.gardenLabel) + '</strong>';
          html += '<div class="ad-li-sub">• Trồng: <b>' + esc(num(g.planted)) + '</b></div>';
          html += '<div class="ad-li-sub">• Thu: <b>' + esc(num(g.plotsHarvested)) + ' ô</b></div>';
          html += '<div class="ad-li-sub">• Sản phẩm: <b>+' + esc(num(g.yield)) + ' SP</b></div>';
          html += '</li>';
        });
        html += '</ul></div>';
      }
      return html;
    }

    // fallback
    html += '<pre class="ad-pre">' + esc(JSON.stringify(d, null, 2)) + '</pre>';
    return html;
  }


  if (!log) return '<p>Không có dữ liệu.</p>';
  const d = log.detail || {};
  const type = log.type;

  // === EVENT RIÊNG (nhật ký chi tiết) ===
  if (log._isEvent || log._event || (d.action && d.timestamp && d.actor)) {
    const ev = log._event || {};
    const act = d.action || log.action || ev.action || type;
    const actor = d.actor || log.actor || ev.actor || 'player';
    const actorLabel = ({
      player: 'Người chơi', robot: 'Robot', nyc: 'NYC', fairy: 'Tiên',
      helper: 'Giúp việc', system: 'Hệ thống', offline: 'Offline'
    })[actor] || actor;
    const title = (log.summary && log.summary.title) ? log.summary.title : (act || 'Chi tiết');
    const msg = (log.summary && log.summary.text) ? log.summary.text : (d.summaryText || '');
    const timeText = d.timeText || (typeof Game !== 'undefined' && Game.formatLogClock
      ? Game.formatLogClock(d.timestamp || log.timestamp) : '');

    const kv = [];
    kv.push(['Thời gian', timeText || '—']);
    kv.push(['Người làm', actorLabel]);
    if (d.mode) kv.push(['Chế độ', d.mode + (d.eventSource ? ' · ' + d.eventSource : '')]);
    if (d.name || (d.target && d.target.name)) kv.push(['Đối tượng', d.name || d.target.name]);
    if (d.quantity != null) kv.push(['Số lượng', '×' + d.quantity]);
    if (d.plotLabel || d.cellId != null) kv.push(['Ô đất', d.plotLabel || ('#' + (Number(d.cellId) + 1))]);
    if (d.gardenIndex != null) kv.push(['Vườn', '#' + (Number(d.gardenIndex) + 1)]);
    if (d.cost != null) kv.push(['Chi phí', '−' + Number(d.cost).toLocaleString() + '🪙']);
    if (d.coins != null) kv.push(['Xu', (Number(d.coins) >= 0 ? '+' : '') + Number(d.coins).toLocaleString() + '🪙']);
    if (d.sp != null) kv.push(['SP', '+' + Number(d.sp).toLocaleString()]);
    if (d.xp != null) kv.push(['XP', '+' + Number(d.xp).toLocaleString()]);
    if (d.plantedClock) kv.push(['Trồng lúc', d.plantedClock]);
    if (d.readyClock) kv.push(['Chín lúc', d.readyClock]);

    let html = '';
    html += '<div class="ad-hero">';
    html += '<div class="ad-hero-icon">' + (title.match(/^[^\w\s]/) || ['📋'])[0] + '</div>';
    html += '<div><div class="ad-hero-title">' + title + '</div>';
    if (msg) html += '<div class="ad-hero-sub">' + msg + '</div>';
    html += '</div></div>';

    html += '<div class="ad-grid">';
    kv.forEach(([label, value], i) => {
      const full = (label === 'Đối tượng' || label === 'Chế độ') ? ' full' : '';
      html += '<div class="ad-kv' + full + '"><div class="ad-kv-label">' + label + '</div><div class="ad-kv-value">' + value + '</div></div>';
    });
    html += '</div>';

    if (d.ingredients && typeof d.ingredients === 'object') {
      html += '<div class="ad-block"><div class="ad-label">Nguyên liệu</div><ul class="ad-list">';
      Object.keys(d.ingredients).forEach(k => {
        html += '<li><strong>' + k + '</strong><span>×' + d.ingredients[k] + '</span></li>';
      });
      html += '</ul></div>';
    }

    if (d.result && typeof d.result === 'object') {
      const r = d.result;
      const rows = [];
      if (r.currency != null) rows.push(['Tiền', r.currency]);
      if (r.xp != null) rows.push(['XP', '+' + r.xp]);
      if (r.sp != null) rows.push(['SP', '+' + r.sp]);
      if (rows.length) {
        html += '<div class="ad-block"><div class="ad-label">Kết quả</div><ul class="ad-list">';
        rows.forEach(([k, v]) => { html += '<li><strong>' + k + '</strong><span>' + v + '</span></li>'; });
        html += '</ul></div>';
      }
    }

    if (act === 'offline_end' || act === 'offline' || type === 'offline') {
      html += '<div class="ad-block"><div class="ad-label">⚡ Phiên offline</div><ul class="ad-list">';
      if (d.startedClock || d.endedClock) {
        html += '<li><strong>Khung giờ</strong><span>' + (d.startedClock || '—') + ' → ' + (d.endedClock || '—') + '</span></li>';
      }
      if (d.durationText) html += '<li><strong>Thời lượng</strong><span>' + d.durationText + '</span></li>';
      if (d.garden) html += '<li><strong>Vườn</strong><span>+' + (d.garden.product || 0) + ' SP · ' + (d.garden.harvested || 0) + ' ô</span></li>';
      if (d.robot) {
        const rj = (d.robot.seedsBought||0)+(d.robot.cooked||0)+(d.robot.starMerged||0)+(d.robot.mythicMerged||0);
        if (rj) html += '<li><strong>Robot</strong><span>' + rj + ' việc</span></li>';
      }
      if (d.nyc && d.nyc.gardens) html += '<li><strong>NYC</strong><span>' + d.nyc.gardens + ' vườn</span></li>';
      if (d.fairy && d.fairy.watered) html += '<li><strong>Tiên</strong><span>' + d.fairy.watered + ' ô</span></li>';
      if (d.xp) html += '<li><strong>XP</strong><span>+' + Number(d.xp).toLocaleString() + '</span></li>';
      html += '</ul></div>';
      if (Array.isArray(d.timeline) && d.timeline.length) {
        html += '<div class="ad-block"><div class="ad-label">Timeline</div><ul class="ad-list">';
        d.timeline.slice(0, 100).forEach(te => {
          const tclock = (typeof Game !== 'undefined' && Game.formatLogClock && te.timestamp)
            ? Game.formatLogClock(te.timestamp) : '';
          const ttxt = te.summaryText || te.text || te.action || te.type || '';
          html += '<li><strong>' + (tclock || '·') + '</strong><span>' + ttxt + '</span></li>';
        });
        html += '</ul></div>';
      }
    }
    return html;
  }

  let html = '';

  if (type === 'offline') {
    html += '<div class="ad-block"><div class="ad-label">⚡ Offline</div>';
    if (d.startedClock || d.endedClock) {
      html += '<div class="ad-value" style="font-size:0.9rem">Offline từ: <strong>' + (d.startedClock || '—') +
        '</strong> · Online lại: <strong>' + (d.endedClock || '—') + '</strong></div>';
    }
    html += '<div class="ad-value" style="margin-top:6px">Thời gian: <strong>' +
      (d.durationText || log.summary?.duration || '—') + '</strong>';
    if (d.durationSeconds) html += ' <span style="opacity:.7">(' + d.durationSeconds + 's)</span>';
    html += '</div></div>';
    if (d.garden) {
      html += '<div class="ad-block"><div class="ad-label">🌱 Vườn</div><ul class="ad-list">';
      html += '<li>Thu hoạch: ' + (d.garden.harvested || 0) + ' ô</li>';
      html += '<li>Sản phẩm: +' + (d.garden.product || 0) + ' SP</li>';
      html += '<li>Trồng lại: ' + (d.garden.replanted || 0) + ' ô</li>';
      html += '</ul></div>';
    }
    if (d.nyc && (d.nyc.gardens || d.nyc.cells)) {
      html += '<div class="ad-block"><div class="ad-label">❤️ NYC</div><ul class="ad-list">';
      html += '<li>Số vườn xử lý: ' + (d.nyc.gardens || 0) + '</li>';
      html += '<li>Số ô xử lý: ' + (d.nyc.cells || 0) + '</li>';
      html += '</ul></div>';
    }
    if (d.robot) {
      html += '<div class="ad-block"><div class="ad-label">🤖 Robot</div><ul class="ad-list">';
      html += '<li>Mua hạt: ' + (d.robot.seedsBought || 0) + '</li>';
      html += '<li>Nấu: ' + (d.robot.cooked || 0) + '</li>';
      html += '<li>Ghép ⭐: ' + (d.robot.starMerged || 0) + '</li>';
      html += '<li>Ghép ✨: ' + (d.robot.mythicMerged || 0) + '</li>';
      html += '</ul></div>';
    }
    if (d.fairy) {
      html += '<div class="ad-block"><div class="ad-label">🧚 Tiên</div><ul class="ad-list">';
      html += '<li>Tưới: ' + (d.fairy.watered || 0) + ' ô</li>';
      html += '<li>Nhặt hạt mưa: ' + (d.fairy.rainSeeds || 0) + '</li>';
      html += '</ul></div>';
    }
    if (d.xp) html += '<div class="ad-block"><div class="ad-label">⭐ XP</div><div class="ad-value">+' + Number(d.xp).toLocaleString() + ' XP</div></div>';
    if (d.rainHits) html += '<div class="ad-block"><div class="ad-label">🌧️ Mưa</div><div class="ad-value">' + d.rainHits + ' trận</div></div>';
    return (html || '<p>Không có chi tiết offline.</p>') + formatLogEventsHtml(d);
  }

  if (type === 'garden') {
    html += '<ul class="ad-list">';
    html += '<li>Trồng: ' + (d.planted || 0) + ' ô (' + (d.plantActions || 0) + ' lượt)</li>';
    html += '<li>Thu hoạch: ' + (d.harvestYield || 0) + ' SP · ' + (d.plotsHarvested || 0) + ' ô (' + (d.harvestCycles || 0) + ' lần)</li>';
    html += '<li>Trồng lại: ' + (d.replanted || 0) + ' ô</li>';
    html += '</ul>';
    return html + formatLogEventsHtml(d);
  }

  if (type === 'nyc') {
    html += '<ul class="ad-list">';
    html += '<li>Số vườn: ' + (d.gardens || 0) + '</li>';
    html += '<li>Số ô: ' + (d.plots || 0) + '</li>';
    html += '<li>Thu: ' + (d.harvestYield || 0) + ' SP</li>';
    html += '</ul>';
    if (d.byGarden && typeof d.byGarden === 'object') {
      html += '<div class="ad-label" style="margin-top:10px">Chi tiết từng vườn</div><ul class="ad-list">';
      Object.keys(d.byGarden).forEach(name => {
        const g = d.byGarden[name] || {};
        html += '<li><strong>' + name + '</strong>: ' + (g.plots || 0) + ' ô · +' + (g.yield || 0) + ' SP</li>';
      });
      html += '</ul>';
    }
    return html + formatLogEventsHtml(d);
  }

  if (type === 'robot') {
    html += '<ul class="ad-list">';
    html += '<li>Tổng hạt mua: ' + (d.seedTotal || 0) + '</li>';
    if (d.seedsBought) {
      Object.keys(d.seedsBought).forEach(nm => {
        html += '<li>Hạt ' + nm + ': ×' + d.seedsBought[nm] + '</li>';
      });
    }
    if (d.seedCost) html += '<li>Chi phí: −' + Number(d.seedCost).toLocaleString() + '🪙</li>';
    html += '<li>Nấu: ' + (d.cookCount || 0) + ' món</li>';
    if (d.cooked) {
      Object.keys(d.cooked).forEach(nm => {
        html += '<li>Món ' + nm + ': ×' + d.cooked[nm] + '</li>';
      });
    }
    html += '<li>Ghép ⭐: ' + (d.starMerged || 0) + '</li>';
    html += '<li>Ghép ✨: ' + (d.mythicMerged || 0) + '</li>';
    html += '</ul>';
    return html + formatLogEventsHtml(d);
  }

  if (type === 'fairy') {
    html += '<ul class="ad-list">';
    html += '<li>Vườn tưới: ' + (d.gardensWatered || 0) + '</li>';
    html += '<li>Tưới ô: ' + (d.watered || 0) + '</li>';
    html += '<li>Bón: ' + (d.fertActions || 0) + ' lần</li>';
    html += '<li>Nhặt hạt mưa: ' + (d.rainSeeds || 0) + '</li>';
    html += '</ul>';
    return html + formatLogEventsHtml(d);
  }

  if (type === 'helper') {
    html += '<ul class="ad-list">';
    html += '<li>Phân mua: ' + (d.fertBought || 0) + '</li>';
    html += '<li>Chi tiêu: −' + Number(d.spent || 0).toLocaleString() + '🪙</li>';
    html += '</ul>';
    return html + formatLogEventsHtml(d);
  }

  if (type === 'level') {
    html += '<ul class="ad-list">';
    (d.steps || []).forEach(s => { html += '<li>' + s + '</li>'; });
    html += '</ul>';
    return html + formatLogEventsHtml(d);
  }

  if (type === 'rain') {
    return '<ul class="ad-list"><li>Số trận: ' + (d.rainCount || 0) + '</li><li>Hạt nhặt: ' + (d.rainSeeds || 0) + '</li></ul>' + formatLogEventsHtml(d);
  }

  if (type === 'reward') {
    return '<ul class="ad-list"><li>Xu: +' + Number(d.coins || 0).toLocaleString() + '🪙</li><li>Streak: ' + (d.streak || 0) + '🔥</li></ul>' + formatLogEventsHtml(d);
  }

  // generic
  return '<pre class="ad-pre">' + JSON.stringify(d, null, 2) + '</pre>';
}

function closeActivityDetail() {
  // Quay lại danh sách nhật ký (giống nút back chat)
  const listPanel = document.getElementById('activity-list-panel');
  const listHeader = document.getElementById('activity-list-header');
  const detailPanel = document.getElementById('activity-detail-panel');
  if (detailPanel) detailPanel.classList.add('hidden');
  if (listPanel) listPanel.classList.remove('hidden');
  if (listHeader) listHeader.classList.remove('hidden');
  window.__vxOpeningActivityDetail = false;
  document.body.classList.remove('activity-detail-open');
}

function openActivityDetail(logId, cachedLog) {
  // Chi tiết log = trang/panel trong page-activity (không dùng modal)
  const listPanel = document.getElementById('activity-list-panel');
  const listHeader = document.getElementById('activity-list-header');
  const detailPanel = document.getElementById('activity-detail-panel');
  const title = document.getElementById('activity-detail-title');
  const body = document.getElementById('activity-detail-body');
  if (!detailPanel || !body) return;

  // Đảm bảo đang ở trang activity
  if (typeof goToPage === 'function') {
    const actPage = document.getElementById('page-activity');
    if (!actPage || !actPage.classList.contains('active')) {
      goToPage('activity');
    }
  }

  let log = cachedLog || null;
  if (!log && window._activityLogMap && logId && window._activityLogMap[logId]) {
    log = window._activityLogMap[logId];
  }
  if (!log && typeof Game !== 'undefined' && Game.getActivityLogById) {
    try { log = Game.getActivityLogById(logId); } catch (e) { console.warn(e); }
  }
  if (!log && Array.isArray(window._lastActivityLines)) {
    log = window._lastActivityLines.find(x => x && x.id === logId) || null;
  }

  if (!log) {
    if (title) title.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i> Chi tiết';
    body.innerHTML = '<p class="ad-empty-line">Không tìm thấy log (id: ' + String(logId || '') + ').</p>';
  } else {
    const t = (log.summary && log.summary.title) ? log.summary.title
      : (log.text || log.title || 'Chi tiết');
    if (title) title.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i> ' + String(t).replace(/</g, '&lt;');
    let html = '';
    try {
      html = formatActivityDetailHtml(log) || '';
    } catch (err) {
      console.warn('formatActivityDetailHtml', err);
      html = '';
    }
    if (!html || !String(html).trim()) {
      const d = Object.assign({}, (log.detail || {}), (log._event && log._event.detail) || {});
      const esc = (s) => String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      const lines = [];
      lines.push('<div class="ad-block"><div class="ad-label">Thông tin</div><ul class="ad-list ad-list-rich">');
      lines.push('<li><span class="ad-li-k">Nội dung</span><span class="ad-li-v">' + esc((log.text || (log.summary && log.summary.text) || '—')) + '</span></li>');
      if (log.actor) lines.push('<li><span class="ad-li-k">Actor</span><span class="ad-li-v">' + esc(log.actor) + '</span></li>');
      Object.keys(d).forEach(k => {
        const v = d[k];
        if (v == null || typeof v === 'object') return;
        lines.push('<li><span class="ad-li-k">' + esc(k) + '</span><span class="ad-li-v">' + esc(v) + '</span></li>');
      });
      lines.push('</ul></div>');
      html = lines.join('');
    }
    body.innerHTML = html;
  }

  if (listPanel) listPanel.classList.add('hidden');
  if (listHeader) listHeader.classList.add('hidden');
  detailPanel.classList.remove('hidden');
  document.body.classList.add('activity-detail-open');
  try { detailPanel.scrollTop = 0; body.scrollTop = 0; } catch (_) {}
}

document.getElementById('btn-activity-detail-back')?.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  closeActivityDetail();
});

let _lastOfflineLogId = null;
function showOfflineReturnModal(report, logEntry) {
  if (!report) return;
  const ms = Number(report.offlineMs) || 0;
  const thr = (typeof Game !== "undefined" && Game.OFFLINE_CONFIG && Game.OFFLINE_CONFIG.thresholdMs) || (5 * 60 * 1000);
  if (ms < thr) return; // dưới threshold: không popup

  const modal = document.getElementById('modal-offline-return');
  const durEl = document.getElementById('offline-return-duration');
  const statsEl = document.getElementById('offline-return-stats');
  if (!modal || !statsEl) {
    // fallback toast
    const text = (typeof Game !== 'undefined' && Game.formatOfflineDuration)
      ? Game.formatOfflineDuration(ms) : Math.round(ms / 60000) + ' phút';
    if (typeof showToast === 'function') showToast('⚡ Bạn đã offline ' + text, 'info');
    return;
  }

  const dur = (report.offlineText) ||
    (typeof Game !== 'undefined' && Game.formatOfflineDuration ? Game.formatOfflineDuration(ms) : '');
  if (durEl) durEl.innerHTML = 'Bạn đã offline <strong>' + dur + '</strong>';

  const items = [];
  const sp = Number(report.totalYieldAmount || 0) || 0;
  const plotsH = Number(report.uniquePlotsHarvested || report.totalHarvest || 0) || 0;
  if (sp) items.push({ icon: '🌱', text: '+' + Number(sp).toLocaleString('vi-VN') + ' SP' + (plotsH ? (' · ' + plotsH + ' ô') : '') });
  if (report.xpGained) items.push({ icon: '⭐', text: '+' + Number(report.xpGained).toLocaleString('vi-VN') + ' XP' });
  // Robot: không cộng số hạt thành "việc" (tránh 139992 việc)
  const rSeed = Number(report.robotSeedsBought || 0) || 0;
  const rStar = Number(report.robotStar || 0) || 0;
  const rMyth = Number(report.robotMyth || 0) || 0;
  const rCook = Number(report.robotCooked || 0) || 0;
  const rParts = [];
  if (rSeed) rParts.push('mua ' + rSeed.toLocaleString('vi-VN') + ' hạt');
  if (rStar) rParts.push('ghép sao ×' + rStar.toLocaleString('vi-VN'));
  if (rMyth) rParts.push('huyền thoại ×' + rMyth.toLocaleString('vi-VN'));
  if (rCook) rParts.push('nấu ' + rCook.toLocaleString('vi-VN'));
  if (rParts.length) items.push({ icon: '🤖', text: rParts.join(' · ') });
  if (report.nycGardens) {
    const nycP = Number(report.nycPlots || report.totalPlant || 0) || 0;
    items.push({ icon: '❤️', text: report.nycGardens + ' vườn NYC' + (nycP ? (' · ' + nycP.toLocaleString('vi-VN') + ' lần') : '') });
  }
  // Tiên: chu kỳ chăm / ô tưới — tách rõ
  const fairyCycles = Number(report.fairyCycles || 0) || 0;
  const rainWatered = Number(report.rainWatered || 0) || 0;
  if (fairyCycles) items.push({ icon: '🧚', text: 'Chăm ' + fairyCycles.toLocaleString('vi-VN') + ' chu kỳ' });
  else if (rainWatered) items.push({ icon: '🧚', text: 'Tưới ' + rainWatered.toLocaleString('vi-VN') + ' ô' });
  if (report.fairyRainSeeds) items.push({ icon: '🌱', text: 'Nhặt ' + Number(report.fairyRainSeeds).toLocaleString('vi-VN') + ' hạt mưa' });
  if (report.rainHits) items.push({ icon: '🌧️', text: report.rainHits + ' trận mưa' });
  if (report.helperBuys) items.push({ icon: '🧹', text: 'Giúp việc mua ' + Number(report.helperBuys).toLocaleString('vi-VN') + ' món' });

  statsEl.innerHTML = items.length
    ? items.map(it => '<li><span>' + it.icon + '</span> ' + it.text + '</li>').join('')
    : '<li style="opacity:.7">Không có hoạt động offline đáng kể</li>';

  _lastOfflineLogId = (logEntry && logEntry.id) || null;
  modal.classList.add('show');
}

document.getElementById('btn-offline-return-close')?.addEventListener('click', () => {
  document.getElementById('modal-offline-return')?.classList.remove('show');
});
document.getElementById('modal-offline-return')?.addEventListener('click', (e) => {
  if (e.target.id === 'modal-offline-return') e.currentTarget.classList.remove('show');
});
document.getElementById('btn-offline-view-detail')?.addEventListener('click', () => {
  document.getElementById('modal-offline-return')?.classList.remove('show');
  if (typeof goToPage === 'function') goToPage('activity');
  if (_lastOfflineLogId && typeof openActivityDetail === 'function') {
    setTimeout(() => openActivityDetail(_lastOfflineLogId), 200);
  }
});

/* ========== NHẬT KÝ — Timeline chuyên nghiệp (24h, không filter) ========== */
function renderActivityPage() {
  const actList = document.getElementById('activity-list');
  if (!actList || typeof currentPlayer === 'undefined' || !currentPlayer) return;

  try {
    if (typeof pruneCurrentPlayerActivity === 'function') pruneCurrentPlayerActivity();
  } catch (_) {}

  let lines = [];
  try {
    lines = (typeof Game !== 'undefined' && Game.buildDayLogLines) ? (Game.buildDayLogLines() || []) : [];
  } catch (err) {
    console.warn('buildDayLogLines', err);
  }
  if (!Array.isArray(lines)) lines = [];

  actList.className = 'activity-list activity-timeline activity-log-pro';

  if (!lines.length) {
    actList.innerHTML = '<li class="activity-empty"><i class="fa-solid fa-inbox"></i>Chưa có hoạt động trong 24 giờ qua.</li>';
    return;
  }

  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  let html = '';
  let lastDay = '';
  lines.forEach(a => {
    const ts = a.timestamp || 0;
    let day = '';
    try {
      day = (typeof gameDateString === 'function') ? gameDateString(ts)
        : new Date(ts).toLocaleDateString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', weekday: 'short', day: '2-digit', month: '2-digit' });
    } catch (_) { day = ''; }
    if (day && day !== lastDay) {
      lastDay = day;
      html += '<li class="activity-day-head"><span class="activity-day-pill">' + esc(day) + '</span></li>';
    }
    let timeStr = a.timeText || '';
    // Offline: hiện khung giờ bắt đầu → kết thúc nếu có
    if ((a.filter === 'offline' || a.type === 'offline' || a.mode === 'offline') && a._isOfflineSummary) {
      const off = a.offline || (a.detail && a.detail) || {};
      const st = off.startedAt || a.firstAt;
      const en = off.endedAt || a.timestamp;
      if (st && en && typeof Game !== 'undefined' && Game.formatLogClock) {
        timeStr = Game.formatLogClock(st, false) + ' – ' + Game.formatLogClock(en, false);
      }
    }
    const msg = a.text || a.title || 'Hành động';
    const result = a.resultLine || '';
    const isOff = (a.filter === 'offline' || a.type === 'offline' || a.mode === 'offline');
    // Tách khoảng giờ thành 2 dòng cho dễ đọc: 08:20\n– 15:42
    let timeHtml = esc(timeStr);
    if (timeStr.indexOf('–') >= 0 || timeStr.indexOf('-') >= 0) {
      const parts = timeStr.split(/\s*[–-]\s*/);
      if (parts.length === 2) {
        timeHtml = '<span class="al-time-range">' + esc(parts[0].trim()) + '</span>'
          + '<span class="al-time-range">– ' + esc(parts[1].trim()) + '</span>';
      }
    }
    html += '<li class="al-row activity-clickable' + (isOff ? ' al-offline' : '') + (a.aggregated ? ' al-agg' : '') + '" data-id="' + esc(a.id || '') + '">'
      + '<div class="al-time-col"><span class="al-time">' + timeHtml + '</span></div>'
      + '<div class="al-main">'
      + '<div class="al-msg">' + esc(msg) + '</div>'
      + (result ? ('<div class="al-result">' + esc(result) + '</div>') : '')
      + '</div>'
      + '<span class="al-chevron"><i class="fa-solid fa-chevron-right"></i></span></li>';
  });

  actList.innerHTML = html;
  window._lastActivityLines = lines;
  window._activityLogMap = {};
  lines.forEach(a => { if (a && a.id) window._activityLogMap[a.id] = a; });
  actList.querySelectorAll('.activity-clickable').forEach(el => {
    el.onclick = (ev) => {
      if (ev) { ev.preventDefault(); ev.stopPropagation(); }
      const id = el.getAttribute('data-id');
      const cached = (window._activityLogMap && id) ? window._activityLogMap[id] : null;
      if (id && typeof openActivityDetail === 'function') openActivityDetail(id, cached);
    };
  });
}

function scheduleActivityMidnightPrune() {
  // Không hẹn 0h00 nữa — prune rolling do interval bên dưới
  if (_activityPruneInterval) return;
  _activityPruneInterval = true; // flag: interval đã gắn ở dưới
}
// Mỗi phút: bỏ log > 24h (xóa dần, không đợi nửa đêm)
setInterval(() => {
  try {
    if (!currentPlayer || typeof pruneCurrentPlayerActivity !== 'function') return;
    if (pruneCurrentPlayerActivity() && typeof savePlayer === 'function') {
      savePlayer({ silent: true, action: 'activity-24h-prune' }).catch(() => {});
      if (typeof renderActivityPage === 'function') {
        const page = document.getElementById('page-activity');
        if (page && page.classList.contains('active')) renderActivityPage();
      }
    }
  } catch (_) {}
}, 60 * 1000);



const TREE_MAX_LEVEL = 10000;
const TREE_TIERS = [
  { min: 1, max: 99, class: 'tier-tree-1', title: 'Mầm Cây Trong Chậu Đất', icon: 'fa-seedling', desc: 'Hạt giống nhỏ vừa vươn mầm', glow: 'rgba(133, 83, 53, 0.4)' },
  { min: 100, max: 499, class: 'tier-tree-2', title: 'Chồi Xanh Lục Ngọc', icon: 'fa-plant-wilt', desc: 'Chồi non lá lục bảo', glow: 'rgba(74, 222, 128, 0.45)' },
  { min: 500, max: 999, class: 'tier-tree-3', title: 'Thân Cây Bích Nguyệt', icon: 'fa-leaf', desc: 'Thân cây sắc lam ngọc', glow: 'rgba(56, 189, 248, 0.5)' },
  { min: 1000, max: 1999, class: 'tier-tree-4', title: 'Đại Thụ Kim Ngân', icon: 'fa-tree', desc: 'Tán lá vàng kim phú quý', glow: 'rgba(250, 204, 21, 0.55)' },
  { min: 2000, max: 2999, class: 'tier-tree-5', title: 'Thần Hoa Sinh Thái', icon: 'fa-spa', desc: 'Hoa thơm ngọt ngào', glow: 'rgba(244, 114, 182, 0.6)' },
  { min: 3000, max: 4499, class: 'tier-tree-6', title: 'Rừng Dạ Quang', icon: 'fa-clover', desc: 'Phát sáng dạ quang xanh lơ', glow: 'rgba(0, 242, 254, 0.7)' },
  { min: 4500, max: 5999, class: 'tier-tree-7', title: 'Thái Dương Cổ Thụ', icon: 'fa-sun', desc: 'Hào quang mặt trời', glow: 'rgba(245, 158, 11, 0.75)' },
  { min: 6000, max: 7499, class: 'tier-tree-8', title: 'Vệ Binh Gaia Tối Cao', icon: 'fa-earth-americas', desc: 'Linh hồn tím bảo hộ đại địa', glow: 'rgba(192, 132, 252, 0.85)' },
  { min: 7500, max: 8999, class: 'tier-tree-9', title: 'Thần Cây Yggdrasil', icon: 'fa-tree', desc: 'Cây Thế Giới ngàn sao', glow: 'rgba(244, 63, 94, 0.95)' },
  { min: 9000, max: 9499, class: 'tier-tree-10', title: 'Ngân Hà Mộc Thần', icon: 'fa-meteor', desc: 'Ánh bạc ngân hà', glow: 'rgba(147, 197, 253, 0.9)' },
  { min: 9500, max: 9999, class: 'tier-tree-11', title: 'Hỗn Mang Khởi Nguyên', icon: 'fa-hurricane', desc: 'Hỗn mang khởi nguồn', glow: 'rgba(225, 29, 72, 0.95)' },
  { min: 10000, max: 10000, class: 'tier-tree-12', title: 'Tạo Hóa Tối Thượng', icon: 'fa-crown', desc: 'Đỉnh tối thượng tạo hóa', glow: 'rgba(255, 255, 255, 0.95)' }
];

function getTreeTier(level) {
  return TREE_TIERS.find(t => level >= t.min && level <= t.max) || TREE_TIERS[0];
}

let _levelPageBound = false;

function updateTreeLevelUI(val) {
  const level = Math.min(TREE_MAX_LEVEL, Math.max(1, parseInt(val, 10) || 1));
  const tier = getTreeTier(level) || TREE_TIERS[0];

  const range = document.getElementById('levelInputRange');
  if (range) {
    range.value = level;
    range.setAttribute('aria-valuenow', String(level));
  }

  const progress = (level / TREE_MAX_LEVEL) * 100;
  const bar = document.getElementById('levelProgressBar');
  const pct = document.getElementById('xpPercentText');
  if (bar) bar.style.width = Math.min(100, Math.max(0, progress)) + '%';
  if (pct) pct.textContent = Math.round(progress) + '%';

  const glow = document.getElementById('levelAmbientGlow');
  if (glow) glow.style.background = tier.glow || 'rgba(74, 222, 128, 0.45)';

  const wrapper = document.getElementById('activeTreeWrapper');
  const pill = document.getElementById('activePillBadge');
  TREE_TIERS.forEach(t => {
    if (wrapper) wrapper.classList.remove(t.class);
    if (pill) pill.classList.remove(t.class);
  });
  if (wrapper) wrapper.classList.add(tier.class);
  if (pill) pill.classList.add(tier.class);

  const icon = document.getElementById('activeTreeIcon');
  const lvlNum = document.getElementById('activeTreeLvlNum');
  const pillIcon = document.getElementById('activePillIcon');
  const pillText = document.getElementById('activePillText');
  if (icon) icon.className = 'fa-solid ' + (tier.icon || 'fa-seedling') + ' tree-icon';
  if (lvlNum) lvlNum.textContent = level;
  if (pillIcon) pillIcon.className = 'fa-solid ' + (tier.icon || 'fa-seedling');
  if (pillText) pillText.textContent = 'LEVEL ' + level + ' • ' + (tier.title || '');

  // Chữ dài thì co font, không cắt ... và không xuống dòng
  if (pill) {
    pill.style.fontSize = '';
    const parent = pill.parentElement;
    const parentW = parent ? parent.clientWidth : window.innerWidth;
    const maxW = Math.min(parentW - 8, 340);
    // tạm bỏ max-width để đo full width nội dung
    const prevMax = pill.style.maxWidth;
    pill.style.maxWidth = 'none';
    let fs = parseFloat(getComputedStyle(pill).fontSize) || 14.4;
    const minFs = 9;
    while (fs > minFs && pill.scrollWidth > maxW) {
      fs -= 0.5;
      pill.style.fontSize = fs + 'px';
    }
    pill.style.maxWidth = prevMax || '';
  }

  // Tránh transform 3D kẹt khi đổi tier
  const container = document.getElementById('activeTreeContainer');
  if (container) container.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
}

function bindLevelPageControls() {
  if (_levelPageBound) return;
  _levelPageBound = true;
  const range = document.getElementById('levelInputRange');
  range?.addEventListener('input', e => updateTreeLevelUI(e.target.value));
  document.getElementById('btn-level-my')?.addEventListener('click', () => {
    const lv = (currentPlayer && currentPlayer.level) ? currentPlayer.level : 1;
    updateTreeLevelUI(lv);
  });
  const showcase = document.getElementById('level-badge-showcase');
  const container = document.getElementById('activeTreeContainer');
  if (showcase && container) {
    showcase.addEventListener('mousemove', e => {
      const rect = showcase.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 18;
      const rotateY = (x / rect.width) * 18;
      container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });
    showcase.addEventListener('mouseleave', () => {
      container.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }
}

function renderLevelPage() {
  bindLevelPageControls();
  const myLv = (currentPlayer && currentPlayer.level) ? currentPlayer.level : 1;
  updateTreeLevelUI(myLv);
}



function closeModals() {
  document.querySelectorAll('.modal').forEach(m => {
    m.classList.remove('show');
  });
}

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => closeModals());
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModals();
  });
});

if (typeof bindNycConfigUI === 'function') bindNycConfigUI();
if (typeof bindFairyConfigUI === 'function') bindFairyConfigUI();
if (typeof bindRobotConfigUI === 'function') bindRobotConfigUI();


function applyTheme(mode) {
  const root = document.documentElement;
  const isDark = mode === 'dark';
  if (isDark) {
    root.setAttribute('data-theme', 'dark');
    document.body.classList.add('dark');
    const ic = document.getElementById('theme-icon');
    if (ic) ic.className = 'fa-solid fa-sun';
  } else {
    root.removeAttribute('data-theme');
    document.body.classList.remove('dark');
    const ic = document.getElementById('theme-icon');
    if (ic) ic.className = 'fa-solid fa-moon';
  }
  try { localStorage.setItem('vx-theme', mode); } catch (_) {}
}
(function initTheme() {
  let mode = 'light';
  try { mode = localStorage.getItem('vx-theme') || 'light'; } catch (_) {}
  applyTheme(mode === 'dark' ? 'dark' : 'light');
})();
document.getElementById('btn-theme')?.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  applyTheme(cur === 'dark' ? 'light' : 'dark');
});


function tickGardenCare(opts) {
  if (!currentPlayer || typeof Game === 'undefined') return false;
  const doRender = !!(opts && opts.render);
  let fairyChanged = false;
  if (typeof Game.resetExpiredBoosts === 'function') {
    fairyChanged = !!Game.resetExpiredBoosts();
    if (fairyChanged) {
      if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(2000);
      else if (typeof savePlayer === 'function') savePlayer().catch(() => {});
      
      const gardenPage = document.getElementById('page-garden');
      if (gardenPage && gardenPage.classList.contains('active') && typeof renderGarden === 'function') {
        renderGarden();
      } else if (doRender && typeof renderGarden === 'function') {
        
      }
      if (typeof softUpdatePlotModal === 'function') softUpdatePlotModal();
    }
  }
  if (typeof Game.tickHelperBuy === 'function' && Game.isHelperActive && Game.isHelperActive()) {
    const didH = Game.tickHelperBuy();
    if (didH) {
      if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(2000);
      else if (typeof savePlayer === 'function') savePlayer().catch(() => {});
      if (typeof updateCoins === 'function') updateCoins();
      if (typeof updateHelperBadge === 'function') updateHelperBadge();
    }
  }
  if (typeof Game.tickNycCare === 'function' && Game.isNycActive()) {
    Game.tickNycCare().then(did => {
      if (!did) return;
      if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(1500);
      else if (typeof savePlayer === 'function') savePlayer().catch(() => {});
      const gardenPage = document.getElementById('page-garden');
      if (gardenPage && gardenPage.classList.contains('active') && typeof renderGarden === 'function') {
        renderGarden();
      }
    }).catch(() => {});
  }
  if (typeof updateFairyBadge === 'function') updateFairyBadge();
  if (typeof updateNycBadge === 'function') updateNycBadge();
  updateHelperBadge();
  if (typeof updateGlobalTimer === 'function') updateGlobalTimer();
  return fairyChanged;
}


function softUpdateGarden() {
  if (!currentPlayer) return;
  tickGardenCare({ render: false });
  softUpdateGardenUI();
}
function softUpdateGardenUI() {
  if (!currentPlayer) return;
  // Luôn cập nhật nút đếm ngược (kể cả lúc NYC busy)
  if (typeof updateHarvestCountdownButton === 'function') updateHarvestCountdownButton();
  // NYC busy: vẫn cập nhật timer/progress trên ô, chỉ tránh renderGarden full (nhảy vườn)
  const gardenPage = document.getElementById('page-garden');
  if (gardenPage && !gardenPage.classList.contains('active')) return;
  const plots = Array.isArray(currentPlayer.plots) ? currentPlayer.plots : Object.values(currentPlayer.plots || {});
  let needFull = false;
  plots.forEach((plot, i) => {
    const el = document.querySelector(`.plot[data-plot-id="${i}"]`);
    if (!el) { needFull = true; return; }
    if (!plot.plantId) {
      if (!el.classList.contains('empty')) needFull = true;
      return;
    }
    const progress = Game.getProgress(plot);
    const ready = progress >= 100;
    const stage = Game.getStage(plot);
    if (ready && !el.classList.contains('ready')) { needFull = true; return; }
    if (!ready && el.classList.contains('ready')) { needFull = true; return; }
    const st = el.querySelector('[data-role="status"]');
    if (st) st.textContent = ready ? '✨ Ra hoa/quả!' : stage.label + ' · ' + progress + '%';
    const remain = Game.getRemainingSeconds(plot);
    let tm = el.querySelector('[data-role="timer"]');
    if (!ready) {
      if (!tm) {
        tm = document.createElement('div');
        tm.className = 'plot-timer';
        tm.dataset.role = 'timer';
        const statusEl = el.querySelector('[data-role="status"]');
        if (statusEl && statusEl.nextSibling) el.insertBefore(tm, statusEl.nextSibling);
        else el.appendChild(tm);
      }
      // Luôn hiện đếm ngược trên ô (kể cả ≤10s) — nút cạnh Hỗ trợ chỉ là phụ
      tm.innerHTML = `<i class="fa-regular fa-clock"></i> ${Game.formatTime(remain)}`;
      tm.hidden = false;
    } else if (tm) {
      tm.remove();
    }
    const bar = el.querySelector('[data-role="bar"]');
    if (bar && !ready) bar.style.width = progress + '%';
    const icon = el.querySelector('.plot-icon');
    if (icon && stage.icon && icon.textContent !== stage.icon) icon.textContent = stage.icon;
    
    const boostEl = el.querySelector('[data-role="boost"]');
    if (boostEl) boostEl.remove();
  });
  if (needFull) renderGarden();
  else updateGlobalTimer();
  updateFairyBadge();
  updateNycBadge();
  updateHelperBadge();
  softUpdatePlotModal();
  if (typeof softUpdateBank === 'function') softUpdateBank();
}


function updateGlobalTimer() {
  const btn = document.getElementById('btn-global-timer');
  const textEl = document.getElementById('global-timer-text');
  if (!textEl || !currentPlayer) return;

  const setCycle = (label, ready) => {
    textEl.textContent = label;
    if (btn) {
      btn.classList.toggle('ready', !!ready);
      btn.classList.toggle('is-empty', label === '--:--:--');
    }
  };

  // Nút đếm ngược thu hoạch cạnh Hỗ trợ (cây còn ≤ 10s)
  updateHarvestCountdownButton();

  // Đếm ngược 30 phút đến trận mưa tiếp theo (Tiên tưới khi mưa)
  if (typeof Game !== 'undefined' && Game.getRainRemainingSec) {
    const raining = !!(Game.raining && Game.rainUntil && Game.rainUntil > (typeof nowMs === 'function' ? nowMs() : Date.now()));
    const remain = Game.getRainRemainingSec();
    const label = Game.formatTime ? Game.formatTime(remain) : String(remain);
    setCycle(label, !raining && remain <= 0);
    if (btn) {
      if (raining) {
        btn.title = `🌧️ Đang mưa — Tiên đang tưới · còn ${label}`;
      } else if (remain <= 0) {
        btn.title = '🌧️ Sắp mưa / đang kích hoạt mưa — Tiên sẽ tưới';
      } else {
        btn.title = `🌧️ Mưa sau: ${label} (mỗi 30 phút · Tiên tưới khi mưa)`;
      }
    }
  } else {
    setCycle('--:--:--', false);
    if (btn) btn.title = 'Đếm ngược mưa (30 phút)';
  }
  if (typeof refreshSupportMenuStatus === 'function') refreshSupportMenuStatus();
}

/** Mỗi vườn sắp chín (1–10s, chưa isReady) → 1 nút riêng cạnh Hỗ trợ.
 *  Cây đã chín (isReady) bị bỏ qua — tránh kẹt mãi ở "1s" do Math.ceil. */
function updateHarvestCountdownButton() {
  const host = document.getElementById('harvest-countdown-host');
  if (!host || !currentPlayer || typeof Game === 'undefined') return;

  const PREVIEW_SEC = 10;
  let gardens = [];
  if (Array.isArray(currentPlayer.gardens) && currentPlayer.gardens.length) {
    gardens = currentPlayer.gardens;
  } else if (currentPlayer.gardens && typeof currentPlayer.gardens === 'object') {
    const keys = Object.keys(currentPlayer.gardens).sort((a, b) => Number(a) - Number(b));
    gardens = keys.map(k => currentPlayer.gardens[k]);
  } else {
    gardens = [Array.isArray(currentPlayer.plots) ? currentPlayer.plots : Object.values(currentPlayer.plots || {})];
  }

  const entries = [];
  gardens.forEach((plots, gi) => {
    if (!plots) return;
    const list = Array.isArray(plots) ? plots : Object.values(plots || {});
    let minRemain = null;
    list.forEach((plot) => {
      if (!plot || !plot.plantId) return;
      // Đã chín → không đếm (tránh kẹt 1s)
      if (typeof Game.isReady === 'function' && Game.isReady(plot)) return;
      if (typeof Game.getProgress === 'function' && Game.getProgress(plot) >= 100) return;
      let remain = Game.getRemainingSeconds ? Game.getRemainingSeconds(plot) : 0;
      remain = Math.max(0, Math.floor(Number(remain) || 0));
      if (remain <= 0 || remain > PREVIEW_SEC) return;
      if (minRemain == null || remain < minRemain) minRemain = remain;
    });
    if (minRemain != null && minRemain > 0) {
      entries.push({ index: gi + 1, sec: minRemain });
    }
  });

  // Không có vườn trong cửa sổ 10s → xóa hết nút
  if (!entries.length) {
    host.innerHTML = '';
    host.hidden = true;
    return;
  }

  entries.sort((a, b) => a.index - b.index);
  host.hidden = false;

  // Đồng bộ DOM: mỗi vườn 1 nút, cập nhật text hoặc tạo mới, xóa nút thừa
  const want = new Set(entries.map(e => String(e.index)));
  host.querySelectorAll('[data-garden-cd]').forEach(btn => {
    if (!want.has(btn.dataset.gardenCd)) btn.remove();
  });

  entries.forEach((e) => {
    let btn = host.querySelector(`[data-garden-cd="${e.index}"]`);
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn btn-boost-countdown';
      btn.dataset.gardenCd = String(e.index);
      btn.innerHTML = `<i class="fa-solid fa-hourglass-half"></i><span class="cd-text"></span>`;
      host.appendChild(btn);
    }
    const textEl = btn.querySelector('.cd-text');
    const label = `Vườn ${e.index}: ${e.sec}s`;
    if (textEl) textEl.textContent = label;
    btn.title = `Sắp thu hoạch — ${label}`;
  });
}





function forceBackgroundCare(reason) {
  if (!currentPlayer || typeof Game === 'undefined') return false;
  try {
    
    if (reason === 'visible' || reason === 'login' || reason === 'focus' || reason === 'online') {
      if (currentPlayer.lastHelperBuy && (Date.now() - currentPlayer.lastHelperBuy > 5000)) {
        
      }
    }
    const changed = tickGardenCare({ render: reason === 'login' || reason === 'visible' });
    if (changed) {
      if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(1200);
    }
    if (typeof refreshSupportMenuStatus === 'function') refreshSupportMenuStatus();
    return !!changed;
  } catch (e) {
    console.warn('[care]', reason, e);
    return false;
  }
}


let _lastRobotScanAt = 0;
setInterval(() => {
  if (!currentPlayer) return;
  
  forceBackgroundCare('tick');
  const gardenPage = document.getElementById('page-garden');
  if (gardenPage && gardenPage.classList.contains('active')) {
    
    softUpdateGardenUI();
  }
  if (typeof softUpdateBank === 'function') softUpdateBank();

  // Người máy: mỗi ~45s rà kho — hạt thường x1 cũng mua đủ 10000 rồi ghép
  try {
    const now = Date.now();
    if (now - _lastRobotScanAt >= 45000
        && typeof Game !== 'undefined'
        && Game.isRobotActive && Game.isRobotActive()
        && Game.robotMergeAllBag) {
      _lastRobotScanAt = now;
      Game.robotMergeAllBag({ silent: true }).then((mr) => {
        if (mr && mr.ok && (mr.starOk || mr.mythOk)) {
          if (typeof updateCoins === 'function') updateCoins();
          if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(800);
        }
      }).catch(() => {});
    }
  } catch (_) {}
}, 1000);


if (!window.__careVisibilityBound) {
  window.__careVisibilityBound = true;
  function markLastSeen() {
    if (!currentPlayer) return;
    const t = (typeof nowMs === 'function') ? nowMs() : Date.now();
    // Chỉ ghi nhận thời điểm rời — KHÔNG đụng lastCatchUpAt (để offline sim tính đúng cửa sổ)
    if (!currentPlayer.lastSeenAt || t >= currentPlayer.lastSeenAt) {
      currentPlayer.lastSeenAt = t;
    }
    try {
      if (typeof currentUser !== 'undefined' && currentUser && currentUser.uid) {
        const key = 'vuon_away_' + currentUser.uid;
        const prev = Number(localStorage.getItem(key)) || 0;
        // Giữ mốc away sớm nhất trong phiên rời (tránh heartbeat/ghi đè làm mất cửa sổ offline)
        if (!prev || t < prev || (t - prev) > 120000) {
          localStorage.setItem(key, String(t));
        }
      }
    } catch (_) {}
    try { if (typeof backupPlayerLocal === 'function') backupPlayerLocal(); } catch (_) {}
    if (typeof flushSavePlayer === 'function') flushSavePlayer();
    else if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(200);
  }
  
  if (!window.__idleTrackBound) {
    window.__idleTrackBound = true;
    window.__lastInteractionAt = Date.now();
    const bumpIdle = () => { window.__lastInteractionAt = Date.now(); };
    ['pointerdown', 'keydown', 'touchstart', 'click', 'scroll', 'mousemove'].forEach(ev => {
      window.addEventListener(ev, bumpIdle, { passive: true });
    });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      markLastSeen();
    } else if (currentPlayer) {
      (async () => {
        
        if (typeof pullRemotePlayerIfNewer === 'function') {
          try {
            const pulled = await pullRemotePlayerIfNewer();
            if (pulled) {
              if (typeof updateCoins === 'function') updateCoins();
              if (typeof renderGarden === 'function') {
                const gp = document.getElementById('page-garden');
                if (gp && gp.classList.contains('active')) renderGarden();
              }
            }
          } catch (_) {}
        }
        forceBackgroundCare('visible');
        
        if (typeof Game !== 'undefined' && Game.simulateOfflineCare) {
          try {
            const r = await Game.simulateOfflineCare();
            if (r && !r.skipped && (r.offlineMs || 0) >= ((typeof Game !== "undefined" && Game.OFFLINE_CONFIG && Game.OFFLINE_CONFIG.thresholdMs) || 300000)) {
              if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(800);
              if (typeof updateCoins === 'function') updateCoins();
              if (typeof renderGarden === 'function') {
                const gp = document.getElementById('page-garden');
                if (gp && gp.classList.contains('active')) renderGarden();
              }
              if (typeof renderActivityPage === 'function') renderActivityPage();
              try {
                const logs = (currentPlayer && currentPlayer.activityLogs) || [];
                const lastOff = logs.find(l => l && l.type === 'offline');
                if (typeof showOfflineReturnModal === 'function') showOfflineReturnModal(r, lastOff);
              } catch (_) {}
            } else if (!r || r.skipped) {
              const t = (typeof nowMs === 'function') ? nowMs() : Date.now();
              currentPlayer.lastSeenAt = t;
            }
          } catch (_) {
            const t = (typeof nowMs === 'function') ? nowMs() : Date.now();
            currentPlayer.lastSeenAt = t;
          }
        } else {
          const t = (typeof nowMs === 'function') ? nowMs() : Date.now();
          currentPlayer.lastSeenAt = t;
        }
      })();
    }
  });
  window.addEventListener('pagehide', markLastSeen);
  window.addEventListener('beforeunload', markLastSeen);
  
  
  if (!window.__lastSeenHeartbeat) {
    window.__lastSeenHeartbeat = setInterval(() => {
      if (!currentPlayer || document.hidden) return;
      const now = Date.now();
      const lastIx = window.__lastInteractionAt || now;
      if (now - lastIx >= 2 * 60 * 1000) {
        
        try {
          if (typeof currentUser !== 'undefined' && currentUser && currentUser.uid) {
            const key = 'vuon_away_' + currentUser.uid;
            if (!localStorage.getItem(key) && currentPlayer.lastSeenAt) {
              localStorage.setItem(key, String(currentPlayer.lastSeenAt));
            }
          }
        } catch (_) {}
        return;
      }
      const t = (typeof nowMs === 'function') ? nowMs() : Date.now();
      currentPlayer.lastSeenAt = t;
      try { if (typeof backupPlayerLocal === 'function') backupPlayerLocal(); } catch (_) {}
    }, 30000);
  }
  window.addEventListener('focus', () => {
    if (currentPlayer) {
      if (typeof pullRemotePlayerIfNewer === 'function') {
        pullRemotePlayerIfNewer().then(pulled => {
          if (pulled) {
            if (typeof updateCoins === 'function') updateCoins();
            if (typeof renderGarden === 'function') {
              const gp = document.getElementById('page-garden');
              if (gp && gp.classList.contains('active')) renderGarden();
            }
          }
          forceBackgroundCare('focus');
        }).catch(() => forceBackgroundCare('focus'));
      } else {
        forceBackgroundCare('focus');
      }
    }
  });
  window.addEventListener('online', () => {
    if (currentPlayer) {
      if (typeof pullRemotePlayerIfNewer === 'function') {
        pullRemotePlayerIfNewer().then(() => forceBackgroundCare('online')).catch(() => forceBackgroundCare('online'));
      } else forceBackgroundCare('online');
    }
  });
  document.addEventListener('resume', () => {
    if (currentPlayer) forceBackgroundCare('visible');
  }, false);
}


setInterval(() => {
  if (currentPlayer && !Game.raining) {
    Game.tryTriggerRain();
  }
}, 5000);


setTimeout(() => {
  if (currentPlayer) Game.tryTriggerRain();
}, 2000);


function renderQuests() {
  if (!currentPlayer || typeof Features === 'undefined') return;
  Features.ensureQuests();
  const renderBlock = (elId, title, scope, defs) => {
    const host = document.getElementById(elId);
    if (!host) return;
    const bag = currentPlayer.quests[scope] || {};
    host.innerHTML = `<h3>${title}</h3>` + defs.map(q => {
      const st = bag[q.id] || { progress: 0, claimed: false };
      const pct = Math.min(100, Math.floor(((st.progress || 0) / q.target) * 100));
      const done = (st.progress || 0) >= q.target;
      let btn = '';
      if (st.claimed) btn = '<button class="btn btn-secondary btn-sm" disabled>Đã nhận</button>';
      else if (done) btn = `<button class="btn btn-success btn-sm btn-claim-q" data-scope="${scope}" data-id="${q.id}">Nhận +${q.reward}🪙</button>`;
      else btn = `<button class="btn btn-secondary btn-sm" disabled>${st.progress || 0}/${q.target}</button>`;
      return `<div class="quest-card">
        <div><div class="q-title">${q.title}</div><small>+${q.reward}🪙 · ${q.xp} XP</small></div>
        <div class="q-prog"><i style="width:${pct}%"></i></div>
        ${btn}
      </div>`;
    }).join('');
    host.querySelectorAll('.btn-claim-q').forEach(btn => {
      btn.addEventListener('click', async () => {
        const res = await Features.claimQuest(btn.dataset.scope, btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        renderQuests();
        updateCoins();
      });
    });
  };
  renderBlock('quests-daily', '📅 Nhiệm vụ ngày', 'daily', Features.DAILY_QUEST_DEFS);
  renderBlock('quests-weekly', '📆 Nhiệm vụ tuần', 'weekly', Features.WEEKLY_QUEST_DEFS);
}

function fillMarketItemSelect() {
  const kind = document.getElementById('market-kind')?.value || 'seed';
  const sel = document.getElementById('market-item');
  if (!sel || !currentPlayer) return;
  const bagKey = kind === 'seed' ? 'seeds'
    : (kind === 'harvestStar' ? 'harvestStar'
      : (kind === 'harvestBought' ? 'harvestBought' : 'harvest'));
  const bag = (currentPlayer.inventory && currentPlayer.inventory[bagKey]) || {};
  const ids = Object.keys(bag).filter(k => bag[k] > 0);
  sel.innerHTML = ids.map(id => {
    const p = Game.getPlant(id);
    const name = p ? p.name : id;
    return `<option value="${id}">${name} (x${bag[id]})</option>`;
  }).join('') || '<option value="">— Hết hàng trong kho —</option>';
  mountPillDropdown(sel, { prefix: 'Mặt hàng:' });
  mountPillDropdown(document.getElementById('market-kind'), { prefix: 'Loại:' });
  mountPillDropdown(document.getElementById('bank-term'), { prefix: 'Kỳ hạn:' });
}

async function renderMarket() {
  fillMarketItemSelect();
  const host = document.getElementById('market-list');
  if (!host) return;
  host.innerHTML = '<p class="bulk-hint">Đang tải chợ...</p>';
  try {
    const snap = await db.ref('market').once('value');
    const all = snap.val() || {};
    let list = Object.keys(all).map(k => ({ ...all[k], id: k }));
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const q = (document.getElementById('market-search')?.value || '').trim().toLowerCase();
    if (q) {
      list = list.filter(L =>
        (L.itemName || '').toLowerCase().includes(q) ||
        (L.sellerName || '').toLowerCase().includes(q)
      );
    }
    if (!list.length) {
      host.innerHTML = '<p class="bulk-hint">Chợ đang trống. Hãy đăng bán từ kho của bạn!</p>';
      return;
    }
    host.innerHTML = list.map(L => {
      const mine = L.sellerUid === currentUser?.uid;
      return `<div class="market-card">
        <div style="font-size:1.6rem">${L.itemIcon || '🌱'}</div>
        <strong>${L.itemName || L.itemId}</strong>
        <div class="shop-meta"><span>${
          L.kind === 'seed' ? 'Hạt'
          : L.kind === 'seedStar' ? 'Hạt ⭐'
          : L.kind === 'harvestStar' ? 'Nông sản ⭐'
          : L.kind === 'harvestMyth' ? 'Nông sản ✨'
          : L.kind === 'harvestBought' ? 'Nông sản (chợ)'
          : 'Nông sản'
        } · x${L.qty}</span></div>
        <div class="shop-price">${(L.priceEach || 0).toLocaleString()}🪙 / cái</div>
        <div class="bulk-hint">Người bán: ${L.sellerName || '—'}</div>
        <div class="shop-price">Tổng: ${((L.qty || 0) * (L.priceEach || 0)).toLocaleString()}🪙</div>
        ${mine
          ? `<button class="btn btn-secondary btn-sm btn-mkt-cancel" data-id="${L.id}">Gỡ tin</button>`
          : `<button class="btn btn-primary btn-sm btn-mkt-buy" data-id="${L.id}">Mua</button>`}
      </div>`;
    }).join('');
    host.querySelectorAll('.btn-mkt-buy').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (btn.disabled) return;
        btn.disabled = true;
        const oldText = btn.textContent;
        btn.textContent = 'Đang mua...';
        try {
          const res = await Features.buyMarketItem(btn.dataset.id);
          showToast(res.msg, res.ok ? 'success' : 'error');
          updateCoins();
          renderMarket();
        } catch (e) {
          showToast('Lỗi mua: ' + (e.message || e), 'error');
          btn.disabled = false;
          btn.textContent = oldText;
        }
      });
    });
    host.querySelectorAll('.btn-mkt-cancel').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (btn.disabled) return;
        btn.disabled = true;
        const oldText = btn.textContent;
        btn.textContent = 'Đang gỡ...';
        try {
          const res = await Features.cancelMarketItem(btn.dataset.id);
          showToast(res.msg, res.ok ? 'success' : 'error');
          renderMarket();
        } catch (e) {
          showToast('Lỗi gỡ tin: ' + (e.message || e), 'error');
          btn.disabled = false;
          btn.textContent = oldText;
        }
      });
    });
  } catch (e) {
    host.innerHTML = '<p class="bulk-hint">Lỗi tải chợ (cần rule Firebase cho /market). ' + (e.message || '') + '</p>';
  }
}

document.getElementById('market-kind')?.addEventListener('change', fillMarketItemSelect);
document.getElementById('market-search')?.addEventListener('input', () => renderMarket());
document.getElementById('btn-market-list')?.addEventListener('click', async () => {
  const kind = document.getElementById('market-kind')?.value;
  const itemId = document.getElementById('market-item')?.value;
  const qty = document.getElementById('market-qty')?.value;
  const price = document.getElementById('market-price')?.value;
  if (!itemId) { showToast('Chọn vật phẩm!', 'error'); return; }
  const res = await Features.listMarketItem(kind, itemId, qty, price);
  showToast(res.msg, res.ok ? 'success' : 'error');
  if (res.ok) { fillMarketItemSelect(); renderMarket(); }
});


function bankAccruedInterest(d, now = Date.now()) {
  const amount = d.amount || 0;
  const rate = d.rate || 0;
  const fullInterest = amount * rate;
  const start = d.startedAt || (d.matureAt - (d.days || 1) * 86400000);
  const end = d.matureAt || start;
  if (now >= end) return fullInterest;
  if (now <= start) return 0;
  const pct = (now - start) / Math.max(1, end - start);
  return fullInterest * Math.min(1, Math.max(0, pct));
}


function bankInterestPerSec(d) {
  const amount = d.amount || 0;
  const rate = d.rate || 0;
  const fullInterest = amount * rate;
  const start = d.startedAt || (d.matureAt - (d.days || 1) * 86400000);
  const end = d.matureAt || start;
  const durSec = Math.max(1, (end - start) / 1000);
  return fullInterest / durSec;
}

function formatBankInterest(n) {
  if (n >= 100) return n.toFixed(2);
  if (n >= 1) return n.toFixed(3);
  if (n >= 0.01) return n.toFixed(4);
  return n.toFixed(6);
}

function renderBank() {
  if (!currentPlayer || typeof Features === 'undefined') return;
  Features.ensureBank();
  const host = document.getElementById('bank-deposits');
  if (!host) return;
  const deps = currentPlayer.bank.deposits || [];
  if (!deps.length) {
    host.innerHTML = '<p class="bulk-hint">Chưa có sổ tiết kiệm nào.</p>';
    return;
  }
  const now = Date.now();
  host.innerHTML = deps.map(d => {
    const term = Features.BANK_TERMS.find(t => t.id === d.termId);
    const matured = now >= d.matureAt;
    const remain = Math.max(0, Math.ceil((d.matureAt - now) / 1000));
    const interest = bankAccruedInterest(d, now);
    const perSec = bankInterestPerSec(d);
    const totalNow = d.amount + interest;
    const fullPayout = Math.floor(d.amount * (1 + (d.rate || 0)));
    return `<div class="bank-item" data-dep-id="${d.id}">
      <div class="bank-item-main">
        <div class="bank-item-head">
          <span class="bank-principal">${d.amount.toLocaleString()}🪙</span>
          <span class="bank-term-tag">${term ? term.label : d.termId} · ${Math.round((d.rate || 0) * 100)}%</span>
        </div>
        <div class="bank-stats">
          <div class="bank-stat">
            <span class="bank-stat-label">Lãi hiện tại</span>
            <span class="bank-stat-val bank-interest-val" data-role="bank-interest">+${formatBankInterest(interest)}</span>
          </div>
          <div class="bank-stat">
            <span class="bank-stat-label">/ giây</span>
            <span class="bank-stat-val" data-role="bank-persec">+${formatBankInterest(perSec)}</span>
          </div>
          <div class="bank-stat">
            <span class="bank-stat-label">Tổng hiện tại</span>
            <span class="bank-stat-val" data-role="bank-total">${formatBankInterest(totalNow)}</span>
          </div>
        </div>
        <div class="bank-timer plot-timer" data-role="bank-remain">${matured ? '<i class="fa-solid fa-circle-check"></i> Đáo hạn — nhận ' + fullPayout.toLocaleString() + '🪙' : '<i class="fa-regular fa-clock"></i> ' + Game.formatTime(remain)}</div>
      </div>
      <div class="bank-item-actions">
        ${!matured ? `<button class="btn btn-primary btn-sm btn-bank-topup" data-id="${d.id}"><i class="fa-solid fa-plus"></i> Gửi thêm</button>` : ''}
        <button class="btn btn-success btn-sm btn-bank-wd-interest" data-id="${d.id}" title="Chỉ rút lãi, gốc tiếp tục gửi">
          <i class="fa-solid fa-coins"></i> Rút lãi
        </button>
        <button class="btn btn-secondary btn-sm btn-bank-wd-all" data-id="${d.id}" title="Rút cả gốc và lãi, đóng sổ">
          <i class="fa-solid fa-wallet"></i> Rút gốc + lãi
        </button>
      </div>
    </div>`;
  }).join('');
  host.querySelectorAll('.btn-bank-wd-interest').forEach(btn => {
    btn.addEventListener('click', async () => {
      const res = await Features.bankWithdraw(btn.dataset.id, 'interest');
      showToast(res.msg, res.ok ? 'success' : 'error');
      updateCoins();
      renderBank();
    });
  });
  host.querySelectorAll('.btn-bank-wd-all').forEach(btn => {
    btn.addEventListener('click', async () => {
      const res = await Features.bankWithdraw(btn.dataset.id, 'all');
      showToast(res.msg, res.ok ? 'success' : 'error');
      updateCoins();
      renderBank();
    });
  });
  host.querySelectorAll('.btn-bank-topup').forEach(btn => {
    btn.addEventListener('click', async () => {
      const raw = prompt('Nhập số xu muốn gửi thêm vào sổ (tối thiểu 100):', '500');
      if (raw === null) return;
      const res = await Features.bankTopUp(btn.dataset.id, raw);
      showToast(res.msg, res.ok ? 'success' : 'error');
      updateCoins();
      renderBank();
    });
  });
}


function softUpdateBank() {
  const bankPage = document.getElementById('page-bank');
  if (!bankPage || !bankPage.classList.contains('active')) return;
  if (!currentPlayer || !currentPlayer.bank) return;
  const deps = currentPlayer.bank.deposits || [];
  const now = Date.now();
  deps.forEach(d => {
    const el = document.querySelector('.bank-item[data-dep-id="' + d.id + '"]');
    if (!el) return;
    const matured = now >= d.matureAt;
    const remain = Math.max(0, Math.ceil((d.matureAt - now) / 1000));
    const interest = bankAccruedInterest(d, now);
    const perSec = bankInterestPerSec(d);
    const totalNow = d.amount + interest;
    const fullPayout = Math.floor(d.amount * (1 + (d.rate || 0)));
    const intEl = el.querySelector('[data-role="bank-interest"]');
    const psEl = el.querySelector('[data-role="bank-persec"]');
    const totEl = el.querySelector('[data-role="bank-total"]');
    const remEl = el.querySelector('[data-role="bank-remain"]');
    if (matured) {
      if (intEl) intEl.textContent = '+' + formatBankInterest(d.amount * (d.rate || 0));
      if (totEl) totEl.textContent = fullPayout.toLocaleString();
      if (remEl) remEl.innerHTML = '<i class="fa-solid fa-circle-check"></i> Đáo hạn — nhận ' + fullPayout.toLocaleString() + '🪙';
    } else {
      if (intEl) intEl.textContent = '+' + formatBankInterest(interest);
      if (psEl) psEl.textContent = '+' + formatBankInterest(perSec);
      if (totEl) totEl.textContent = formatBankInterest(totalNow);
      if (remEl) remEl.innerHTML = '<i class="fa-regular fa-clock"></i> ' + Game.formatTime(remain);
    }
  });
}


document.getElementById('btn-bank-deposit')?.addEventListener('click', async () => {
  const amount = document.getElementById('bank-amount')?.value;
  const term = document.getElementById('bank-term')?.value;
  const res = await Features.bankDeposit(amount, term);
  showToast(res.msg, res.ok ? 'success' : 'error');
  updateCoins();
  renderBank();
});

document.getElementById('btn-redeem-code')?.addEventListener('click', async () => {
  const code = document.getElementById('gift-code-input')?.value;
  const res = await Features.redeemGiftCode(code);
  showToast(res.msg, res.ok ? 'success' : 'error');
  if (res.ok) {
    document.getElementById('gift-code-input').value = '';
    updateCoins();
  }
});

document.getElementById('inv-search')?.addEventListener('input', () => renderInventory());


function enhanceQtyInputs(root) {
  
}


const _origRenderShop = typeof renderShop === 'function' ? renderShop : null;
if (_origRenderShop) {
  window.renderShop = function () {
    _origRenderShop.apply(this, arguments);
    enhanceQtyInputs(document.getElementById('shop-grid'));
  };
}


(function setupGardenHorizontalWheel() {
  const grid = document.getElementById('garden-grid');
  if (!grid) return;
  grid.addEventListener('wheel', (e) => {
    
    if (grid.scrollWidth <= grid.clientWidth + 2) return;
    
    const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (delta === 0) return;
    e.preventDefault();
    grid.scrollLeft += delta;
  }, { passive: false });
})();



document.querySelectorAll('[data-kitchen]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('[data-kitchen]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.kitchen;
    const cook = document.getElementById('kitchen-cook');
    const dishes = document.getElementById('kitchen-dishes');
    if (cook) cook.style.display = tab === 'cook' ? '' : 'none';
    if (dishes) dishes.style.display = tab === 'dishes' ? '' : 'none';
    renderKitchen();
  });
});
document.getElementById('kitchen-search')?.addEventListener('input', () => {
  window.kitchenPage = 1;
  renderKitchen();
});

function renderKitchen() {
  if (!currentPlayer) return;
  if (typeof Game.normalizeHarvestBags === 'function') Game.normalizeHarvestBags();
  const q = (document.getElementById('kitchen-search')?.value || '').trim().toLowerCase();
  const cookEl = document.getElementById('kitchen-cook');
  const dishesEl = document.getElementById('kitchen-dishes');
  const recipes = Game.getRecipes();
  const inv = currentPlayer.inventory || {};
  const harvest = inv.harvest || {};
  const harvestStar = inv.harvestStar || {};
  const harvestMyth = inv.harvestMyth || {};

  const haveIng = (plantId, tier) => {
    if (tier === 'myth') return harvestMyth[plantId] || 0;
    if (tier === 'star') return harvestStar[plantId] || 0;
    return harvest[plantId] || 0;
  };
  const canCookTier = (r, tier) => (r.ingredients || []).every(ing => haveIng(ing.plantId, tier) >= (ing.qty || 1));
  const canCookAny = (r) => canCookTier(r, 'normal') || canCookTier(r, 'star') || canCookTier(r, 'myth');

  if (cookEl && (cookEl.style.display !== 'none')) {
    let list = recipes;
    if (q) {
      list = recipes.filter(r => {
        const name = (r.name || '').toLowerCase();
        const ings = (r.ingredients || []).map(ing => {
          const p = Game.getPlant(ing.plantId);
          return (p && p.name) || ing.plantId;
        }).join(' ').toLowerCase();
        return name.includes(q) || ings.includes(q);
      });
    }

    list = list.slice().sort((a, b) => {
      const canA = canCookAny(a);
      const canB = canCookAny(b);
      if (canA !== canB) return canA ? -1 : 1;
      return (a.name || '').localeCompare(b.name || '', 'vi');
    });
    const pageSize = 24;
    if (typeof window.kitchenPage !== 'number' || window.kitchenPage < 1) window.kitchenPage = 1;
    const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
    if (window.kitchenPage > totalPages) window.kitchenPage = totalPages;
    const startIdx = (window.kitchenPage - 1) * pageSize;
    const show = list.slice(startIdx, startIdx + pageSize);

    const priceN = (r) => Game.getDishSellPrice ? Game.getDishSellPrice(r, 'normal') : (r.sellPrice || 0);
    const priceS = (r) => Game.getDishSellPrice ? Game.getDishSellPrice(r, 'star') : Math.ceil((r.sellPrice || 0) * 1.5);
    const priceM = (r) => Game.getDishSellPrice ? Game.getDishSellPrice(r, 'myth') : Math.ceil((r.sellPrice || 0) * 2);

    cookEl.innerHTML = `
      <p class="bulk-hint">Trang ${window.kitchenPage}/${totalPages} · ${show.length}/${list.length} món. Nấu bằng nông sản <strong>thường</strong> / <strong>⭐ sao</strong> / <strong>✨ huyền thoại</strong> — giá bán món khác nhau.</p>
      <div class="kitchen-grid">` + show.map(r => {
      const ings = (r.ingredients || []).map(ing => {
        const p = Game.getPlant(ing.plantId);
        const need = ing.qty || 1;
        const n = haveIng(ing.plantId, 'normal');
        const s = haveIng(ing.plantId, 'star');
        const m = haveIng(ing.plantId, 'myth');
        const okAny = n >= need || s >= need || m >= need;
        return `<span class="kitchen-ing ${okAny ? 'ok' : 'no'}">${p ? p.icon : '❓'}${p ? p.name : ing.plantId} ×${need}
          <small>(${n}/⭐${s}/✨${m})</small></span>`;
      }).join('');
      const canN = canCookTier(r, 'normal');
      const canS = canCookTier(r, 'star');
      const canM = canCookTier(r, 'myth');
      const can = canN || canS || canM;
      return `<div class="kitchen-card ${can ? 'can-cook' : ''}">
        <div class="kitchen-icon">${r.icon || '🍽️'}</div>
        <div class="kitchen-name">${r.name}</div>
        <div class="kitchen-ings">${ings}</div>
        <div class="kitchen-meta kitchen-prices">
          Thường <strong>${priceN(r).toLocaleString()}🪙</strong>
          · ⭐ <strong>${priceS(r).toLocaleString()}🪙</strong>
          · ✨ <strong>${priceM(r).toLocaleString()}🪙</strong>
          · +${r.xp || 1} XP
        </div>
        <div class="kitchen-actions kitchen-actions-tier">
          <input type="number" class="qty-input kitchen-qty" min="1" max="99" value="1" data-rid="${r.id}" ${can ? '' : 'disabled'} />
          <button class="btn btn-primary btn-sm btn-cook" data-id="${r.id}" data-tier="normal" ${canN ? '' : 'disabled'} title="Nấu bằng nông sản thường">Nấu</button>
          <button class="btn btn-warning btn-sm btn-cook" data-id="${r.id}" data-tier="star" ${canS ? '' : 'disabled'} title="Nấu bằng nông sản ⭐">⭐</button>
          <button class="btn btn-secondary btn-sm btn-cook" data-id="${r.id}" data-tier="myth" ${canM ? '' : 'disabled'} title="Nấu bằng nông sản ✨">✨</button>
        </div>
      </div>`;
    }).join('') + '</div>';

    cookEl.querySelectorAll('.btn-cook').forEach(btn => {
      btn.addEventListener('click', async () => {
        const card = btn.closest('.kitchen-card');
        const qty = parseInt(card?.querySelector('.kitchen-qty')?.value || '1', 10) || 1;
        const tier = btn.dataset.tier || 'normal';
        const res = await Game.cookRecipe(btn.dataset.id, qty, tier);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderKitchen();
      });
    });

    renderUxPager(document.getElementById('kitchen-pager'), {
      page: window.kitchenPage,
      totalPages,
      onChange: (p) => {
        window.kitchenPage = p;
        renderKitchen();
        document.getElementById('page-kitchen')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  } else {
    const pager = document.getElementById('kitchen-pager');
    if (pager) pager.innerHTML = '';
  }

  if (dishesEl && dishesEl.style.display !== 'none') {
    const bags = [
      { key: 'dishes', tier: 'normal', label: '' },
      { key: 'dishesStar', tier: 'star', label: '⭐' },
      { key: 'dishesMyth', tier: 'myth', label: '✨' }
    ];
    const rows = [];
    bags.forEach(b => {
      const owned = inv[b.key] || {};
      Object.keys(owned).filter(id => owned[id] > 0).forEach(id => {
        rows.push({ id, qty: owned[id], tier: b.tier, label: b.label });
      });
    });
    if (!rows.length) {
      dishesEl.innerHTML = '<p class="empty-state">Chưa có món nào. Vào tab Nấu ăn nhé!</p>';
    } else {
      dishesEl.innerHTML = '<div class="kitchen-grid">' + rows.map(row => {
        const r = Game.getRecipe(row.id);
        if (!r) return '';
        const unit = Game.getDishSellPrice ? Game.getDishSellPrice(r, row.tier) : (r.sellPrice || 0);
        return `<div class="kitchen-card">
          <div class="kitchen-icon">${r.icon || '🍽️'}${row.label}</div>
          <div class="kitchen-name">${r.name} ${row.label}</div>
          <div class="qty">x${row.qty} · ${unit.toLocaleString()}🪙/món</div>
          <div class="kitchen-actions">
            <button class="btn btn-success btn-sm btn-sell-dish" data-id="${row.id}" data-tier="${row.tier}" data-qty="1">Bán 1</button>
            <button class="btn btn-primary btn-sm btn-sell-dish" data-id="${row.id}" data-tier="${row.tier}" data-qty="all">Bán hết</button>
          </div>
        </div>`;
      }).join('') + '</div>';
      dishesEl.querySelectorAll('.btn-sell-dish').forEach(btn => {
        btn.addEventListener('click', async () => {
          let qty = btn.dataset.qty;
          if (qty === 'all') qty = -1;
          else qty = parseInt(qty, 10) || 1;
          const res = await Game.sellDish(btn.dataset.id, qty, btn.dataset.tier || 'normal');
          showToast(res.msg, res.ok ? 'success' : 'error');
          updateCoins();
          renderKitchen();
        });
      });
    }
  }
}


function renderGardenPets() {
  const agents = document.getElementById('garden-agents');
  const host = agents || document.getElementById('garden-grid');
  if (!host || !currentPlayer) return;
  host.querySelectorAll('.garden-pet').forEach(el => el.remove());
  const pets = currentPlayer.pets || {};
  const activeIds = Object.keys(pets).filter(id => pets[id] && pets[id].active !== false);
  activeIds.forEach((id, i) => {
    const pet = Game.getPet(id);
    if (!pet) return;
    const el = document.createElement('div');
    el.className = 'garden-pet garden-roamer';
    el.dataset.petId = id;
    el.dataset.path = String((i % 3) + 1);
    el.textContent = pet.icon || '🐾';
    el.style.setProperty('--delay', (i * 1.1) + 's');
    el.style.left = (6 + (i * 19) % 82) + '%';
    el.style.top = (18 + (i * 27) % 58) + '%';
    host.appendChild(el);
  });
}

const _origRenderGarden = typeof renderGarden === 'function' ? renderGarden : null;
if (_origRenderGarden && !renderGarden._petsHooked) {
  window.renderGarden = function () {
    _origRenderGarden.apply(this, arguments);
    renderGardenPets();
  };
  renderGarden._petsHooked = true;
}


setInterval(async () => {
  const gardenPage = document.getElementById('page-garden');
  if (!gardenPage || !gardenPage.classList.contains('active')) return;
  if (!currentPlayer || typeof Game === 'undefined') return;
  const drop = Game.tryPetCoinDrop();
  if (drop) {
    showToast(`${drop.pet.icon} ${drop.pet.name} nhặt được ${drop.coins}🪙!`, 'success');
    updateCoins();
    try { await savePlayer(); } catch (_) {}
  }
}, 20000);


function bootPillDropdowns() {
  try {
    mountAllPillDropdowns(document);
  } catch (_) {}
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootPillDropdowns);
} else {
  bootPillDropdowns();
}
setTimeout(bootPillDropdowns, 800);


function updateNavMailBadge(unread) {
  const navBadge = document.getElementById('nav-mail-badge');
  if (!navBadge) return;
  if (unread > 0) {
    navBadge.textContent = unread > 99 ? '99+' : String(unread);
    navBadge.classList.add('show');
  } else {
    navBadge.textContent = '';
    navBadge.classList.remove('show');
  }
}

async function loadPlayerMailbox() {
  const list = document.getElementById('mail-list');
  const badge = document.getElementById('mail-unread-badge');
  if (!currentUser) return;
  try {
    const snap = await db.ref('mail/' + currentUser.uid).limitToLast(40).once('value');
    const val = snap.val() || {};
    const items = Object.keys(val).map(k => ({ id: k, ...val[k] }))
      .sort((a, b) => (b.at || 0) - (a.at || 0));
    const unread = items.filter(m => !m.read).length;
    updateNavMailBadge(unread);
    if (badge) badge.textContent = unread ? `(${unread} chưa đọc)` : '';
    if (!list) return;
    if (!items.length) {
      list.innerHTML = '<p class="bulk-hint">Chưa có thư nào.</p>';
      return;
    }
    list.innerHTML = items.map(m => `
      <div class="mail-item ${m.read ? '' : 'unread'}" data-mid="${m.id}">
        <div class="mail-item-main">
          <div class="mail-title">${escapeHtml(m.title || 'Thư hệ thống')}</div>
          <div class="mail-meta">${m.at ? (typeof formatGameDateTime==='function'?formatGameDateTime(m.at):new Date(m.at).toLocaleString('vi-VN')) : ''} · ${m.type === 'birthday' ? '🎂 Sinh nhật' : (m.from || 'Hệ thống')}</div>
          <div class="mail-body">${escapeHtml(m.body || '')}</div>
        </div>
        <div class="mail-actions">
          <button type="button" class="btn-mail-icon btn-mail-read" title="Đánh dấu đã đọc" aria-label="Đánh dấu đã đọc"><i class="fa-solid fa-envelope-open"></i></button>
          <button type="button" class="btn-mail-icon btn-mail-unread" title="Đánh dấu chưa đọc" aria-label="Đánh dấu chưa đọc"><i class="fa-solid fa-envelope"></i></button>
        </div>
      </div>
    `).join('');
    const refreshBadge = () => {
      const left = list.querySelectorAll('.mail-item.unread').length;
      updateNavMailBadge(left);
      if (badge) badge.textContent = left ? `(${left} chưa đọc)` : '';
    };
    list.querySelectorAll('.mail-item').forEach(el => {
      const mid = el.dataset.mid;
      el.querySelector('.mail-item-main')?.addEventListener('click', () => {
        el.classList.toggle('open');
      });
      el.querySelector('.btn-mail-read')?.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await db.ref('mail/' + currentUser.uid + '/' + mid + '/read').set(true);
          el.classList.remove('unread');
          refreshBadge();
        } catch (_) {}
      });
      el.querySelector('.btn-mail-unread')?.addEventListener('click', async (e) => {
        e.stopPropagation();
        try {
          await db.ref('mail/' + currentUser.uid + '/' + mid + '/read').set(false);
          el.classList.add('unread');
          refreshBadge();
        } catch (_) {}
      });
    });
  } catch (e) {
    if (list) list.innerHTML = '<p class="bulk-hint">Không tải được hộp thư (cập nhật Firebase Rules cho mail).</p>';
  }
}


async function maybeSendBirthdayMailLocal() {
  if (!currentUser || !currentPlayer || !currentPlayer.birthday) return;
  const { day, month } = currentPlayer.birthday;
  if (!day || !month) return;
  
  const g = (typeof dateInGameTz === 'function') ? dateInGameTz() : null;
  const gDay = g ? g.day : new Date().getDate();
  const gMonth = g ? g.month : (new Date().getMonth() + 1);
  const year = g ? g.year : new Date().getFullYear();
  if (gDay !== day || gMonth !== month) return;
  if (currentPlayer.birthdayMailYear === year) return;
  const mid = 'bday_' + year;
  try {
    const ref = db.ref('mail/' + currentUser.uid + '/' + mid);
    const exist = await ref.once('value');
    if (!exist.val()) {
      await ref.set({
        title: '🎂 Chúc mừng sinh nhật!',
        body: `Chúc ${getDisplayName()} sinh nhật vui vẻ!\nVườn Xanh gửi lời chúc tốt đẹp và mong bạn luôn vui khi trồng cây.`,
        from: 'Vườn Xanh',
        type: 'birthday',
        at: Date.now(),
        read: false
      });
    }
    currentPlayer.birthdayMailYear = year;
    try { await savePlayer(); } catch (_) {}
    loadPlayerMailbox();
  } catch (_) {}
}




function compareSemver(a, b) {
  const pa = String(a || '0').split(/[^\d]+/).map(n => parseInt(n, 10) || 0);
  const pb = String(b || '0').split(/[^\d]+/).map(n => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const x = pa[i] || 0, y = pb[i] || 0;
    if (x !== y) return x - y;
  }
  return 0;
}

function getClientVersion() {
  return (typeof APP_VERSION !== 'undefined' && APP_VERSION) ? String(APP_VERSION) : '0.0.0';
}

function getPublishedVersion() {
  const s = (typeof currentSettings !== 'undefined' && currentSettings) ? currentSettings : null;
  return (s && s.appVersion) ? String(s.appVersion) : getClientVersion();
}

function hardReloadApp() {
  try {
    sessionStorage.setItem('vx_reload_at', String(Date.now()));
  } catch (_) {}
  const url = new URL(location.href);
  url.searchParams.set('_v', String(Date.now()));
  
  url.hash = '';
  location.replace(url.toString());
}

function showUpdateBanner(opts) {
  const el = document.getElementById('update-banner');
  if (!el) return;
  const title = document.getElementById('update-banner-title');
  const notes = document.getElementById('update-banner-notes');
  const pub = (opts && opts.published) || getPublishedVersion();
  const client = getClientVersion();
  if (title) title.textContent = `Có bản cập nhật mới (v${pub}) — bạn đang ở v${client}`;
  if (notes) {
    const n = (opts && opts.notes != null) ? opts.notes : ((currentSettings && currentSettings.updateNotes) || '');
    notes.textContent = n ? String(n) : 'Vui lòng tải lại để dùng tính năng / sửa lỗi mới.';
  }
  const force = !!(opts && opts.force != null ? opts.force : (currentSettings && currentSettings.forceUpdate));
  el.classList.toggle('force', force);
  el.classList.add('show');
  el.style.display = '';
}

function hideUpdateBanner() {
  const el = document.getElementById('update-banner');
  if (!el) return;
  if (el.classList.contains('force')) return; 
  el.classList.remove('show');
  el.style.display = 'none';
  try {
    sessionStorage.setItem('vx_dismiss_update', getPublishedVersion());
  } catch (_) {}
}

function needsClientUpdate() {
  const client = getClientVersion();
  const pub = getPublishedVersion();
  return compareSemver(client, pub) < 0;
}

function checkClientUpdate(fromListener) {
  const badge = document.getElementById('app-version-badge');
  if (badge) badge.textContent = 'v' + getClientVersion();

  if (!needsClientUpdate()) {
    hideUpdateBanner();
    return false;
  }
  
  const force = !!(currentSettings && currentSettings.forceUpdate);
  if (!force && !fromListener) {
    try {
      if (sessionStorage.getItem('vx_dismiss_update') === getPublishedVersion()) {
        return true;
      }
    } catch (_) {}
  }
  showUpdateBanner({
    published: getPublishedVersion(),
    notes: currentSettings && currentSettings.updateNotes,
    force
  });
  return true;
}

function bindUpdateUI() {
  document.getElementById('btn-update-reload')?.addEventListener('click', () => hardReloadApp());
  document.getElementById('btn-update-dismiss')?.addEventListener('click', () => hideUpdateBanner());
  const badge = document.getElementById('app-version-badge');
  if (badge) badge.textContent = 'v' + getClientVersion();
}

let _settingsVersionUnsub = null;
function watchSettingsForUpdate() {
  if (typeof db === 'undefined' || !db) return;
  try {
    if (_settingsVersionUnsub) {
      db.ref('settings').off('value', _settingsVersionUnsub);
      _settingsVersionUnsub = null;
    }
  } catch (_) {}
  const handler = (snap) => {
    if (!snap.exists()) return;
    const val = snap.val() || {};
    
    if (typeof currentSettings === 'undefined' || !currentSettings) {
      
      currentSettings = { ...(typeof DEFAULT_SETTINGS !== 'undefined' ? DEFAULT_SETTINGS : {}), ...val };
    } else {
      if (val.appVersion != null) currentSettings.appVersion = val.appVersion;
      if (val.updateNotes != null) currentSettings.updateNotes = val.updateNotes;
      if (typeof val.forceUpdate === 'boolean') currentSettings.forceUpdate = val.forceUpdate;
      
      if (val.rainDurationMinutes != null) currentSettings.rainDurationMinutes = val.rainDurationMinutes;
      if (typeof val.maintenanceOn === 'boolean') currentSettings.maintenanceOn = val.maintenanceOn;
      if (val.siteIconUrl != null) currentSettings.siteIconUrl = val.siteIconUrl;
    }
    if (typeof applySiteIcon === 'function') applySiteIcon(currentSettings.siteIconUrl);
    checkClientUpdate(true);
  };
  _settingsVersionUnsub = handler;
  db.ref('settings').on('value', handler);
}


bindUpdateUI();
document.addEventListener('DOMContentLoaded', () => {
  bindUpdateUI();
  
  setTimeout(() => checkClientUpdate(false), 1500);
});


setInterval(() => {
  if (typeof currentUser !== 'undefined' && currentUser) checkClientUpdate(false);
}, 120000);


(function hookAuthForUpdateWatch() {
  if (typeof auth === 'undefined' || !auth) return;
  auth.onAuthStateChanged((user) => {
    if (user) {
      setTimeout(() => {
        watchSettingsForUpdate();
        checkClientUpdate(false);
      }, 800);
    }
  });
})();



let _helperRulesDraft = [];

function fillHelperItemSelect() {
  const kind = document.getElementById('helper-add-kind')?.value || 'seed';
  const sel = document.getElementById('helper-add-id');
  if (!sel || typeof Game === 'undefined') return;
  sel.innerHTML = '';
  if (kind === 'seed') {
    (Game.getPlants() || []).forEach(pl => {
      if (!pl || !pl.id) return;
      const o = document.createElement('option');
      o.value = pl.id;
      o.textContent = `${pl.icon || ''} ${pl.name}`.trim() + ` (${(pl.seedPrice || 0).toLocaleString()}🪙)`;
      sel.appendChild(o);
    });
  } else if (kind === 'fert') {
    (Game.getFertilizers() || []).forEach(f => {
      const o = document.createElement('option');
      o.value = f.id;
      o.textContent = `${f.icon || ''} ${f.name}`.trim() + ` (${(f.price || 0).toLocaleString()}🪙)`;
      sel.appendChild(o);
    });
  } else if (kind === 'protect') {
    const list = Game.getProtects ? Game.getProtects() : (typeof DEFAULT_PROTECTS !== 'undefined' ? DEFAULT_PROTECTS : []);
    list.forEach(pr => {
      const o = document.createElement('option');
      o.value = pr.id;
      o.textContent = `${pr.icon || ''} ${pr.name}`.trim() + ` (${(pr.price || 0).toLocaleString()}🪙)`;
      sel.appendChild(o);
    });
  }
}

function renderHelperRulesList() {
  const host = document.getElementById('helper-rules-list');
  if (!host || typeof Game === 'undefined') return;
  host.innerHTML = '';
  if (!_helperRulesDraft.length) {
    host.innerHTML = '<p class="bulk-hint">Chưa có mục nào — thêm bên dưới.</p>';
    return;
  }
  _helperRulesDraft.forEach((r, idx) => {
    const row = document.createElement('div');
    row.className = 'helper-rule-row';
    const name = Game.getItemDisplayName(r.kind, r.id);
    const kindLabel = r.kind === 'seed' ? 'Hạt' : (r.kind === 'fert' ? 'Phân' : 'Bảo hộ');
    row.innerHTML = `
      <div class="helper-rule-top">
        <span class="helper-rule-kind">${kindLabel}</span>
        <span class="helper-rule-name">${name}</span>
        <button type="button" class="helper-rule-del" data-del="${idx}" title="Xóa"><i class="fa-solid fa-trash"></i></button>
      </div>
      <div class="helper-rule-fields">
        <label class="helper-field">Mốc kho<input type="number" min="0" max="999999999" data-i="${idx}" data-f="minStock" value="${r.minStock}" /></label>
        <label class="helper-field">Mua thêm<input type="number" min="1" max="999999999" data-i="${idx}" data-f="buyQty" value="${r.buyQty}" /></label>
        <label class="helper-field helper-field-toggle ios-toggle-row"><span>Bật</span><input type="checkbox" class="ios-toggle" data-i="${idx}" data-f="enabled" ${r.enabled !== false ? 'checked' : ''}/></label>
      </div>
    `;
    host.appendChild(row);
  });
  const syncDraftField = (inp) => {
    const i = parseInt(inp.dataset.i, 10);
    const f = inp.dataset.f;
    if (!_helperRulesDraft[i]) return;
    if (f === 'enabled') _helperRulesDraft[i].enabled = inp.checked;
    else {
      let v = parseInt(inp.value, 10);
      if (!Number.isFinite(v)) v = 0;
      if (f === 'buyQty') v = Math.max(1, Math.min(999999999, v));
      if (f === 'minStock') v = Math.max(0, Math.min(999999999, v));
      _helperRulesDraft[i][f] = v;
    }
  };
  host.querySelectorAll('input[data-f]').forEach(inp => {
    inp.addEventListener('change', () => syncDraftField(inp));
    inp.addEventListener('input', () => syncDraftField(inp));
    inp.addEventListener('blur', () => syncDraftField(inp));
  });
  host.querySelectorAll('[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.del, 10);
      _helperRulesDraft.splice(i, 1);
      renderHelperRulesList();
    });
  });
}

function openHelperConfigModal() {
  if (!currentPlayer || typeof Game === 'undefined') return;
  const cfg = Game.getHelperConfig();
  _helperRulesDraft = (cfg.rules || []).map(r => ({ ...r }));
  const nameInp = document.getElementById('helper-custom-name');
  if (nameInp) nameInp.value = cfg.customName || '';
  const gF = document.querySelector('input[name="helper-gender"][value="female"]');
  const gM = document.querySelector('input[name="helper-gender"][value="male"]');
  if (cfg.gender === 'male') { if (gM) gM.checked = true; }
  else { if (gF) gF.checked = true; }
  fillHelperItemSelect();
  renderHelperRulesList();
  document.getElementById('modal-helper-config')?.classList.add('show');
  if (typeof mountAllPillDropdowns === 'function') {
    setTimeout(() => mountAllPillDropdowns(document.getElementById('modal-helper-config')), 50);
  }
}

document.getElementById('helper-add-kind')?.addEventListener('change', () => {
  fillHelperItemSelect();
  if (typeof mountAllPillDropdowns === 'function') {
    setTimeout(() => mountAllPillDropdowns(document.getElementById('modal-helper-config')), 50);
  }
});

document.getElementById('btn-helper-add-rule')?.addEventListener('click', () => {
  const kind = document.getElementById('helper-add-kind')?.value || 'seed';
  const id = document.getElementById('helper-add-id')?.value;
  if (!id) { showToast('Chọn vật phẩm!', 'error'); return; }
  const minStock = parseInt(document.getElementById('helper-add-min')?.value, 10);
  const buyQty = parseInt(document.getElementById('helper-add-qty')?.value, 10);
  if (_helperRulesDraft.some(r => r.kind === kind && r.id === id)) {
    showToast('Mục này đã có trong danh sách!', 'error');
    return;
  }
  _helperRulesDraft.push({
    kind, id,
    minStock: Number.isFinite(minStock) ? Math.max(0, Math.min(999999999, minStock)) : 5,
    buyQty: Number.isFinite(buyQty) && buyQty > 0 ? Math.max(1, Math.min(999999999, buyQty)) : 10,
    enabled: true
  });
  renderHelperRulesList();
});

document.getElementById('btn-save-helper-config')?.addEventListener('click', async () => {
  if (typeof Game === 'undefined') return;
  
  document.querySelectorAll('#helper-rules-list input[data-f]').forEach(inp => {
    const i = parseInt(inp.dataset.i, 10);
    const f = inp.dataset.f;
    if (!_helperRulesDraft[i]) return;
    if (f === 'enabled') _helperRulesDraft[i].enabled = inp.checked;
    else {
      let v = parseInt(inp.value, 10);
      if (!Number.isFinite(v)) v = f === 'buyQty' ? 1 : 0;
      if (f === 'buyQty') v = Math.max(1, Math.min(999999999, v));
      if (f === 'minStock') v = Math.max(0, Math.min(999999999, v));
      _helperRulesDraft[i][f] = v;
    }
  });
  const res = Game.setHelperConfig({
    customName: document.getElementById('helper-custom-name')?.value || '',
    gender: document.querySelector('input[name="helper-gender"]:checked')?.value || 'female',
    rules: _helperRulesDraft
  });
  showToast(res.msg, res.ok ? 'success' : 'error');
  if (res.ok) {
    try { await savePlayer(); } catch (_) {}
    updateHelperBadge();
    document.getElementById('modal-helper-config')?.classList.remove('show');
    if (Game.isHelperActive && Game.isHelperActive()) {
      currentPlayer.lastHelperBuy = 0;
      if (Game.tickHelperBuy()) {
        updateCoins();
        if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(1000);
        else if (typeof savePlayer === 'function') savePlayer().catch(() => {});
      }
    }
  }
});

document.getElementById('btn-helper-config')?.addEventListener('click', () => openHelperConfigModal());
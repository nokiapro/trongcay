// ===== APP UI =====
let selectedPlotId = null;

function getDisplayName(player, user) {
  const p = player || currentPlayer;
  const u = user || currentUser;
  if (p && p.displayName) return p.displayName;
  const email = (p && p.email) || (u && u.email) || '';
  return email ? email.split('@')[0] : 'Player';
}

function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show ' + (type || '');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

function updateCoins() {
  if (!currentPlayer) return;
  document.getElementById('coin-display').textContent = (currentPlayer.coins || 0).toLocaleString();
  document.getElementById('level-display').textContent = currentPlayer.level || 1;
  const fertEl = document.getElementById('fertilizer-count');
  if (fertEl) fertEl.textContent = Game.totalFertilizerCount();
}

function updateUserUI() {
  if (!currentPlayer || !currentUser) return;
  const adminBtn = document.getElementById('btn-admin');
  if (adminBtn) adminBtn.style.display = isAdmin ? '' : 'none';
  updateDailyBtn();
}

function updateDailyBtn() {
  const btn = document.getElementById('btn-daily');
  if (!btn) return;
  btn.style.display = Game.hasClaimedDaily() ? 'none' : 'inline-flex';
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
  // Mini-game: sâu + hạt rơi (click để nhặt)
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

// ===== AUTH =====
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
    // giữ icon FA, emoji nằm trong text
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


function openNycConfigModal() {
  if (!currentPlayer) return;
  const sel = document.getElementById('nyc-plant-select');
  if (!sel) return;
  const seeds = (currentPlayer.inventory && currentPlayer.inventory.seeds) || {};
  const stars = (currentPlayer.inventory && currentPlayer.inventory.seedsStar) || {};
  const cfg = Game.getNycConfig();
  const opts = ['<option value="">— Chưa chọn hạt —</option>'];
  Object.keys(seeds).filter(id => (seeds[id] || 0) > 0).forEach(id => {
    const p = Game.getPlant(id);
    if (!p) return;
    const val = id + '|normal';
    const selc = (cfg.plantId === id && cfg.seedKind !== 'star') ? 'selected' : '';
    opts.push(`<option value="${val}" ${selc}>${p.icon} ${p.name} · thường x${seeds[id]}</option>`);
  });
  Object.keys(stars).filter(id => (stars[id] || 0) > 0).forEach(id => {
    const p = Game.getPlant(id);
    if (!p) return;
    const val = id + '|star';
    const selc = (cfg.plantId === id && cfg.seedKind === 'star') ? 'selected' : '';
    opts.push(`<option value="${val}" ${selc}>${p.icon} ${p.name} ⭐ · sao x${stars[id]}</option>`);
  });
  if (cfg.plantId) {
    const haveN = (seeds[cfg.plantId] || 0) > 0;
    const haveS = (stars[cfg.plantId] || 0) > 0;
    if (cfg.seedKind === 'star' && !haveS) {
      const p = Game.getPlant(cfg.plantId);
      if (p) opts.push(`<option value="${cfg.plantId}|star" selected>${p.icon} ${p.name} ⭐ (hết hạt sao)</option>`);
    }
    if (cfg.seedKind !== 'star' && !haveN) {
      const p = Game.getPlant(cfg.plantId);
      if (p) opts.push(`<option value="${cfg.plantId}|normal" selected>${p.icon} ${p.name} (hết hạt thường)</option>`);
    }
  }
  sel.innerHTML = opts.join('');
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
  renderAgentGardenToggles('nyc-garden-toggles', cfg.gardensEnabled);
  const nycNameInp = document.getElementById('nyc-custom-name');
  if (nycNameInp) nycNameInp.value = cfg.customName || '';
  const ng = cfg.gender === 'male' ? 'male' : 'female';
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
  document.getElementById('btn-save-nyc-config')?.addEventListener('click', async () => {
    const raw = document.getElementById('nyc-plant-select')?.value || '';
    let plantId = null, seedKind = 'normal';
    if (raw && raw.includes('|')) {
      const parts = raw.split('|');
      plantId = parts[0] || null;
      seedKind = parts[1] === 'star' ? 'star' : 'normal';
    } else if (raw) {
      plantId = raw;
    }
    const mode = document.querySelector('input[name="nyc-mode"]:checked')?.value || 'all';
    const count = parseInt(document.getElementById('nyc-count-input')?.value, 10) || 1;
    const res = Game.setNycConfig({ plantId: plantId || null, seedKind, mode, count ,
      gardensEnabled: readAgentGardenToggles('nyc-garden-toggles'),
      customName: (document.getElementById('nyc-custom-name')?.value || '').trim().slice(0, 20),
      gender: document.querySelector('input[name="nyc-gender"]:checked')?.value || 'female'
    });
    if (res.ok) {
      await savePlayer();
      showToast(res.msg, 'success');
      closeModals();
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


/** Render toggle vườn trong modal Tiên / NYC */
function renderAgentGardenToggles(hostId, gardensEnabled) {
  const host = document.getElementById(hostId);
  if (!host) return;
  if (typeof Game.ensureGardens === 'function') Game.ensureGardens();
  const n = typeof Game.getGardenCount === 'function' ? Game.getGardenCount() : 1;
  const ge = gardensEnabled && typeof gardensEnabled === 'object' ? gardensEnabled : {};
  let html = '';
  for (let i = 0; i < n; i++) {
    const on = !(ge[i] === false || ge[String(i)] === false);
    const plots = (currentPlayer && currentPlayer.gardens && currentPlayer.gardens[i]) || [];
    const count = plots.length || 0;
    const maxP = Game.MAX_PLOTS_PER_GARDEN || 99;
    html += `<label class="garden-toggle-row">
      <span class="garden-toggle-label"><i class="fa-solid fa-house-chimney-window"></i> Vườn ${i + 1} <small>(${count}/${maxP} ô)</small></span>
      <input type="checkbox" class="garden-toggle-switch" data-garden="${i}" ${on ? 'checked' : ''} />
    </label>`;
  }
  if (n < 1) {
    html = '<p class="bulk-hint">Chưa có vườn.</p>';
  }
  host.innerHTML = html;
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


function openFairyConfigModal() {
  if (!currentPlayer) return;
  const cfg = Game.getFairyConfig();
  renderAgentGardenToggles('fairy-garden-toggles', cfg.gardensEnabled);

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
  if (nameInp) nameInp.value = cfg.customName || '';
  const fg = cfg.gender === 'male' ? 'male' : 'female';
  const fgEl = document.querySelector(`input[name="fairy-gender"][value="${fg}"]`);
  if (fgEl) fgEl.checked = true;
  syncFairyConfigFormVisibility();
  document.getElementById('modal-fairy-config')?.classList.add('show');
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
    const res = Game.setFairyConfig({
      waterMode: document.querySelector('input[name="fairy-water-mode"]:checked')?.value || 'all',
      waterCount: parseInt(document.getElementById('fairy-water-count')?.value, 10) || 12,
      useFertilizer: document.querySelector('input[name="fairy-fert-on"]:checked')?.value !== '0',
      fertSource: document.querySelector('input[name="fairy-fert-src"]:checked')?.value || 'any',
      fertId: document.getElementById('fairy-fert-id')?.value || null,
      fertMode: document.querySelector('input[name="fairy-fert-mode"]:checked')?.value || 'all',
      fertCount: parseInt(document.getElementById('fairy-fert-count')?.value, 10) || 12,
      gardensEnabled: readAgentGardenToggles('fairy-garden-toggles'),
      customName: (document.getElementById('fairy-custom-name')?.value || '').trim().slice(0, 20),
      gender: document.querySelector('input[name="fairy-gender"]:checked')?.value || 'female'
    });
    if (res.ok) {
      await savePlayer();
      showToast(res.msg, 'success');
      closeModals();
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
      if (typeof Features !== 'undefined') {
        const gate = await Features.checkAccessGates();
        if (gate.blocked) {
          showAccessGate(gate);
          return;
        }
      }
      if (typeof Features !== 'undefined') Features.ensureQuests();
      if (typeof listenPlayerTimers === 'function') listenPlayerTimers(); // no-op
      // Đồng bộ play-log + snapshot local → Firebase khi vào web
      setTimeout(async () => {
        try {
          if (typeof syncPlayerOnEnter === 'function') {
            const syn = await syncPlayerOnEnter();
            if (syn && syn.ok && typeof updateCoins === 'function') updateCoins();
            if (typeof renderGarden === 'function') {
              const gp = document.getElementById('page-garden');
              if (gp && gp.classList.contains('active')) renderGarden();
            }
          }
          if (typeof pullRemotePlayerIfNewer === 'function') {
            const pulled = await pullRemotePlayerIfNewer();
            if (pulled) {
              if (typeof updateCoins === 'function') updateCoins();
              if (typeof renderGarden === 'function') {
                const gp = document.getElementById('page-garden');
                if (gp && gp.classList.contains('active')) renderGarden();
              }
            }
          }
          if (typeof Game !== 'undefined' && Game.simulateOfflineCare) {
            const r = await Game.simulateOfflineCare();
            if (r && r.changed) {
              if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(600);
              else if (typeof savePlayer === 'function') await savePlayer();
              if (typeof updateCoins === 'function') updateCoins();
              if (typeof renderGarden === 'function') {
                const gp = document.getElementById('page-garden');
                if (gp && gp.classList.contains('active')) renderGarden();
              }
              if (r.notes && r.notes.length && typeof showToast === 'function') {
                const hours = Math.floor((r.offlineMs || 0) / 3600000);
                const mins = Math.floor(((r.offlineMs || 0) % 3600000) / 60000);
                showToast('⚡ Bù ' + (r.offlineText || ((hours ? hours + 'g ' : '') + mins + 'p')) + ': ' + (r.notes && r.notes.length ? r.notes.join(' · ') : 'xem Nhật ký'), 'success');
              }
            }
          }
        } catch (e) { console.warn('simulateOfflineCare', e); }
        if (typeof forceBackgroundCare === 'function') forceBackgroundCare('login');
      }, 500);
      showApp();
      if (typeof loadPlayerMailbox === 'function') loadPlayerMailbox().catch(() => {});
    } catch (e) {
      console.error(e);
      showToast('Lỗi tải dữ liệu: ' + e.message, 'error');
      // Vẫn còn session Firebase — không đá về login, thử hiện app nếu đã có player
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

// ===== NAVIGATION =====
function closeMobileNav() {
  document.getElementById('bottom-nav')?.classList.remove('open');
  document.getElementById('nav-backdrop')?.classList.remove('show');
  document.getElementById('menu-toggle')?.classList.remove('hidden');
}

function openMobileNav() {
  document.getElementById('bottom-nav')?.classList.add('open');
  document.getElementById('nav-backdrop')?.classList.add('show');
  document.getElementById('menu-toggle')?.classList.add('hidden');
}

document.getElementById('menu-toggle')?.addEventListener('click', openMobileNav);
document.getElementById('nav-backdrop')?.addEventListener('click', closeMobileNav);

function goToPage(page) {
  document.querySelectorAll('.nav-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page)?.classList.add('active');
  try { sessionStorage.setItem('vx_page', page); } catch (_) {}
  closeMobileNav();
  if (page === 'garden') renderGarden();
  if (page === 'shop') renderShop();
  if (page === 'inventory') renderInventory();
  if (page === 'kitchen') renderKitchen();
  if (page === 'quests') renderQuests();
  if (page === 'market') renderMarket();
  if (page === 'bank') renderBank();
  if (page === 'stats') renderStats();
  if (page === 'level') renderLevelPage();
  if (page === 'activity') renderActivityPage();
  if (page === 'rank') renderRank();
  if (page === 'friends') renderFriends();
  if (page === 'profile') renderProfile();
  if (page === 'mail') loadPlayerMailbox();
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.id === 'btn-admin' || btn.id === 'btn-logout') return;
    if (btn.dataset.page) goToPage(btn.dataset.page);
  });
});

document.getElementById('btn-admin')?.addEventListener('click', () => {
  window.location.href = 'admin';
});

// ===== LEADERBOARD =====
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

// ===== FRIENDS & CHAT =====
let chatFriendUid = null;
let chatUnsub = null;

async function renderFriends() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) closeChat();
  else {
    // PC: keep both panels, clear chat if no friend selected
    if (!chatFriendUid) {
      document.getElementById('chat-panel')?.classList.remove('hidden');
      document.getElementById('friends-panel')?.classList.remove('hidden');
    }
  }
  // Xóa email demo / autofill trong ô UID bạn bè
  const friendInp = document.getElementById('friend-uid-input');
  if (friendInp) {
    friendInp.setAttribute('placeholder', 'Nhập UID bạn bè');
    friendInp.setAttribute('autocomplete', 'off');
    friendInp.setAttribute('type', 'text');
    // Chỉ xóa nếu giá trị trông giống email demo
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
      // Ưu tiên tên mới từ leaderboard (sau khi bạn đổi tên)
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
    // Cập nhật luôn header chat nếu đang mở
    if (chatFriendUid && nameMap[chatFriendUid]) {
      const nameEl = document.getElementById('chat-with-name');
      if (nameEl) nameEl.textContent = nameMap[chatFriendUid];
    }
  } catch (e) {
    console.error(e);
    list.innerHTML = '<p class="empty-state">Lỗi tải bạn bè. Cập nhật Firebase Rules.</p>';
  }
}

/** Thăm vườn bạn bè (đọc publicGardens) + tưới giúp 1 lần/ngày */
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
    // Find by uid direct or search leaderboard by name/email prefix
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
  // Animation nhẹ khi vào khung chat
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
  // Lấy avatar mình + bạn (leaderboard)
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
      const frameStyle = (me && currentPlayer && currentPlayer.chatFrameId && Game.getChatFrame)
        ? (() => { const fr = Game.getChatFrame(currentPlayer.chatFrameId); return fr ? ` style="background:${fr.gradient};color:${fr.textColor||'#14532d'}"` : ''; })()
        : (m.chatFrameId && Game.getChatFrame ? (() => { const fr = Game.getChatFrame(m.chatFrameId); return fr ? ` style="background:${fr.gradient};color:${fr.textColor||'#14532d'}"` : ''; })() : '');
      return `<div class="chat-row ${me ? 'me' : 'them'}">
        <div class="chat-av-wrap">${avHtml}</div>
        <div class="chat-bubble ${me ? 'me' : 'them'}"${tip}${frameStyle}>${escapeHtml(m.text || '')}<span class="chat-time-tip">${escapeHtml(fullTime)}</span></div>
      </div>`;
    }).join('');
    box.scrollTop = box.scrollHeight;
    if (typeof applyChatFrameStyles === 'function') applyChatFrameStyles(box);
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
      from: currentUser.uid, chatFrameId: (currentPlayer && currentPlayer.chatFrameId) || null,
      text,
      at: Date.now()
    });
    input.value = '';
    await bumpChatStreak(chatFriendUid);
  } catch (e) {
    showToast('Gửi lỗi: ' + e.message, 'error');
  }
}

// ===== PROFILE =====

function applyChatFrameStyles(root) {
  const scope = root || document;
  const frameId = currentPlayer && currentPlayer.chatFrameId;
  const fr = frameId && Game.getChatFrame ? Game.getChatFrame(frameId) : null;
  scope.querySelectorAll('.chat-bubble.me, .chat-row.me .chat-bubble').forEach(el => {
    if (fr && fr.gradient) {
      el.style.background = fr.gradient;
      el.style.color = fr.textColor || '#14532d';
      el.classList.add('has-chat-frame');
    } else {
      el.style.background = '';
      el.style.color = '';
      el.classList.remove('has-chat-frame');
    }
  });
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

function applyProfileAvatarFrame() {
  const wrap = document.getElementById('profile-avatar-wrap');
  const lvlTag = document.getElementById('profile-level-tag');
  if (!wrap) return;
  const frameId = currentPlayer && currentPlayer.avatarFrameId;
  const frame = (frameId && typeof Game !== 'undefined' && Game.getAvatarFrame)
    ? Game.getAvatarFrame(frameId)
    : null;
  if (frame && frame.gradient) {
    wrap.classList.add('has-frame');
    wrap.style.setProperty('--avatar-frame-grad', frame.gradient);
    if (lvlTag) {
      lvlTag.classList.add('has-frame-grad');
      lvlTag.style.setProperty('--avatar-frame-grad', frame.gradient);
    }
  } else {
    wrap.classList.remove('has-frame');
    wrap.style.removeProperty('--avatar-frame-grad');
    if (lvlTag) {
      lvlTag.classList.remove('has-frame-grad');
      lvlTag.style.removeProperty('--avatar-frame-grad');
    }
  }
}

function renderProfile() {
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
  if (fName) fName.value = (Game.getFairyConfig && Game.getFairyConfig().customName) || '';
  if (nName) nName.value = (Game.getNycConfig && Game.getNycConfig().customName) || '';
  const fGen = (Game.getFairyGender && Game.getFairyGender()) || 'female';
  const nGen = (Game.getNycGender && Game.getNycGender()) || 'female';
  const pf = document.querySelector(`input[name="profile-fairy-gender"][value="${fGen}"]`);
  const pn = document.querySelector(`input[name="profile-nyc-gender"][value="${nGen}"]`);
  if (pf) pf.checked = true;
  if (pn) pn.checked = true;
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
  // LVL theo tier cây (không còn viền tier quanh avatar)
  const myLv = Math.min(1000, Math.max(1, parseInt(currentPlayer.level, 10) || 1));
  const tier = (typeof getTreeTier === 'function') ? getTreeTier(myLv) : { class: 'tier-tree-1' };
  const wrap = document.getElementById('profile-avatar-wrap');
  const lvlTag = document.getElementById('profile-level-tag');
  const lvlNum = document.getElementById('profile-level-num');
  if (lvlTag && typeof TREE_TIERS !== 'undefined') {
    TREE_TIERS.forEach(t => lvlTag.classList.remove(t.class));
    lvlTag.classList.add(tier.class);
  }
  if (lvlNum) lvlNum.textContent = myLv;
  applyProfileAvatarFrame();
  applyProfileCompanion();
  const prefs = Game.getBuffPrefs();
  const fEl = document.getElementById('pref-fairy-enabled');
  const nEl = document.getElementById('pref-nyc-enabled');
  const fvEl = document.getElementById('pref-fairy-visual');
  const nvEl = document.getElementById('pref-nyc-visual');
  if (fEl) fEl.checked = !!prefs.fairyEnabled;
  if (nEl) nEl.checked = !!prefs.nycEnabled;
  if (fvEl) fvEl.checked = !!prefs.fairyVisual;
  if (nvEl) nvEl.checked = !!prefs.nycVisual;
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
  const fairyGender = document.querySelector('input[name="profile-fairy-gender"]:checked')?.value || 'female';
  const nycGender = document.querySelector('input[name="profile-nyc-gender"]:checked')?.value || 'female';
  if (typeof Game.setFairyConfig === 'function') {
    const fc = Game.getFairyConfig();
    Game.setFairyConfig({ ...fc, customName: fairyName, gender: fairyGender });
  }
  if (typeof Game.setNycConfig === 'function') {
    const nc = Game.getNycConfig();
    Game.setNycConfig({ ...nc, customName: nycName, gender: nycGender });
  }
  Game.setBuffPrefs({
    fairyEnabled: !!document.getElementById('pref-fairy-enabled')?.checked,
    nycEnabled: !!document.getElementById('pref-nyc-enabled')?.checked,
    fairyVisual: !!document.getElementById('pref-fairy-visual')?.checked,
    nycVisual: !!document.getElementById('pref-nyc-visual')?.checked
  });
  await savePlayer();
  // Đồng bộ tên mới sang danh sách bạn của mọi người đang kết bạn với mình
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
  // Không renderGarden full — chỉ cập nhật badge/hình, giữ timer ngoài vườn
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
  } catch (_) {}
});

function readPrefFromUI() {
  return {
    fairyEnabled: !!document.getElementById('pref-fairy-enabled')?.checked,
    nycEnabled: !!document.getElementById('pref-nyc-enabled')?.checked,
    fairyVisual: !!document.getElementById('pref-fairy-visual')?.checked,
    nycVisual: !!document.getElementById('pref-nyc-visual')?.checked
  };
}

function writePrefToUI(prefs) {
  const map = [
    ['pref-fairy-enabled', 'fairyEnabled'],
    ['pref-nyc-enabled', 'nycEnabled'],
    ['pref-fairy-visual', 'fairyVisual'],
    ['pref-nyc-visual', 'nycVisual']
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
    // Chỉ highlight nút "cả 2" khi đủ 4 field; nút 1 phía khi đúng phía đó
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
  writePrefToUI(next);
  if (!currentPlayer) return;
  // Chỉ lưu pref hình/buff — không đụng fairyUntil / nycUntil / timer tưới-phân
  const res = Game.setBuffPrefs(next);
  try { await savePlayer(); } catch (_) {}
  showToast(res.msg || 'Đã cập nhật!', 'success');
  // Cập nhật badge & trang trí hình, không renderGarden full (tránh reset timer)
  updateFairyBadge();
  updateNycBadge();
  updateHelperBadge();
  try {
    const stage = document.querySelector('.garden-stage') || document.getElementById('garden-grid');
    if (stage && typeof Game !== 'undefined') {
      // Chỉ ẩn/hiện decor theo visual, giữ nguyên thời gian ô
      document.querySelectorAll('.garden-decor-fairy').forEach(el => {
        el.style.display = Game.showFairyDecor && Game.showFairyDecor() ? '' : 'none';
      });
      document.querySelectorAll('.garden-decor-nyc').forEach(el => {
        el.style.display = Game.showNycDecor && Game.showNycDecor() ? '' : 'none';
      });
    }
  } catch (_) {}
}

document.querySelectorAll('.pref-combo').forEach(btn => {
  btn.addEventListener('click', () => applyPrefCombo(btn));
});
// Đổi checkbox buff → đồng bộ highlight
['pref-fairy-enabled', 'pref-nyc-enabled'].forEach(id => {
  document.getElementById(id)?.addEventListener('change', highlightPrefComboButtons);
});



// ===== DAILY =====
document.getElementById('btn-daily').addEventListener('click', async () => {
  const res = await Game.claimDaily();
  showToast(res.msg, res.ok ? 'success' : 'error');
  if (res.ok) { updateCoins(); updateDailyBtn(); }
});

// ===== GARDEN =====

// ===== PILL DROPDOWN (shared) =====
const PILL_CHECK_SVG = `<svg class="pill-dd-check" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`;
const PILL_ARROW_SVG = `<svg class="pill-dd-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>`;

function closeAllPillMenus(except) {
  document.querySelectorAll('.pill-dd.open').forEach(dd => {
    if (except && dd === except) return;
    dd.classList.remove('open', 'drop-up');
    const trigger = dd.querySelector('.pill-dd-trigger');
    // menu có thể đã portal ra body
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
      // trả menu về wrap
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
  // dọn menu portal sót
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
  // khi scroll/resize — đóng menu portal để tránh lệch vị trí
  window.addEventListener('scroll', (e) => {
    // Không đóng khi scroll bên trong menu dropdown
    const t = e.target;
    if (t && t.closest && (t.closest('.pill-dd-menu') || t.closest('.pill-dd-portal'))) return;
    // Scroll trong modal-content: reposition thay vì đóng (tránh menu biến mất)
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

/**
 * Gắn UI pill dropdown lên <select>. Giữ select gốc (ẩn) để form/event cũ vẫn chạy.
 * @param {HTMLSelectElement} select
 * @param {{ prefix?: string, block?: boolean }} opts
 */
function mountPillDropdown(select, opts = {}) {
  if (!select || select.tagName !== 'SELECT') return null;
  // Nếu đã mount và cùng parent → chỉ refresh
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
    // Portal ra body + fixed → không bị modal/overflow cắt (lỗi chi tiết ô)
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
    menu.style.minWidth = minW + 'px';
    menu.style.maxWidth = Math.min(Math.max(minW, 280), window.innerWidth - 16) + 'px';
    menu.style.maxHeight = Math.min(280, window.innerHeight - 24) + 'px';
    menu.style.overflowY = 'auto';
    menu.style.zIndex = '500';

    // đo sau khi hiện
    const mh = Math.min(menu.scrollHeight || 200, 280);
    const spaceBelow = window.innerHeight - tr.bottom - 10;
    const spaceAbove = tr.top - 10;
    const openUp = spaceBelow < Math.min(mh, 160) && spaceAbove > spaceBelow;
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
    // nếu đang mở trên wrap này → đóng
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

// ===== MULTI GARDEN SWITCHER (pill dropdown) =====
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
      if (idx === Game.getActiveGardenIndex()) return;
      const res = Game.switchGarden(idx);
      showToast(res.msg, res.ok ? 'success' : 'error');
      if (res.ok) {
        try { await savePlayer(); } catch (_) {}
        renderGarden();
        updateCoins();
      }
    });
  });
}

function renderGarden() {
  if (!currentPlayer) return;
  if (typeof Game.ensureGardens === 'function') Game.ensureGardens();
  renderGardenSwitcher();
  // Hết hạn tưới / phân sau 3 giờ
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
        const starBadge = plot.seedStar ? `<span class="plot-badge-star" title="Hạt sao">⭐</span>` : '';

        const remain = Game.getRemainingSeconds(plot);
        div.innerHTML = `
          <div class="plot-badges"><span class="plot-badge-left">${waterBadge}${starBadge}</span><span class="plot-badge-right">${fertBadge}</span></div>
          <div class="plot-icon">${stageIcon}</div>
          <div class="plot-name">${plant.name}${plot.seedStar ? ' ⭐' : ''}</div>
          <div class="plot-status" data-role="status">${ready ? '✨ Ra hoa/quả!' : stage.label + ' · ' + progress + '%'}</div>
          ${!ready ? `<div class="plot-timer" data-role="timer"><i class="fa-regular fa-clock"></i> ${Game.formatTime(remain)}</div>` : ''}
          ${!ready ? `<div class="plot-progress"><div class="plot-progress-bar" data-role="bar" style="width:${progress}%"></div></div>` : ''}
        `;
        div.addEventListener('click', () => openPlotModal(i));
      }
    }
    grid.appendChild(div);
  });

  // Tiên/NYC trên #garden-agents (cùng garden-world với grid → scroll ngang đi theo)
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
  updateGlobalTimer();
}


function openEmptyPlotModal(plotId) {
  selectedPlotId = plotId;
  const plot = currentPlayer.plots[plotId];
  if (!plot) return;
  // Mở modal trồng + chèn nâng cấp
  openPlantModal(plotId);
  const list = document.getElementById('plant-seed-list');
  if (!list) return;
  const curMult = Number(plot.specialMult) || 1;
  const tiers = (typeof Features !== 'undefined' && Features.PLOT_UPGRADE_TIERS)
    ? Features.PLOT_UPGRADE_TIERS : [];
  const higher = tiers.filter(x => x.mult > curMult);
  let html = '<div class="plot-upgrade-box" style="margin-bottom:12px"><h4><i class="fa-solid fa-bolt"></i> Ô #' + (plotId + 1) + ' · <span class="plot-mult-badge">x' + curMult + '</span></h4>';
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
  const list = document.getElementById('plant-seed-list');
  list.innerHTML = '';
  const empty = Game.emptyPlotCount();

  const ids = [...new Set([...Object.keys(seeds), ...Object.keys(stars)])]
    .filter(id => ((seeds[id] || 0) + (stars[id] || 0)) > 0);
  if (ids.length === 0) {
    list.innerHTML = '<p class="empty-state">Bạn chưa có hạt giống nào.<br>Hãy mua ở Cửa hàng!</p>';
  } else {
    const info = document.createElement('p');
    info.style.cssText = 'text-align:center;color:#52796f;font-size:0.9rem;margin-bottom:10px';
    info.textContent = `Ô trống: ${empty} · Chọn hạt và số lượng trồng (ưu tiên hạt ⭐)`;
    list.appendChild(info);

    ids.sort((a, b) => {
      const pa = Game.getPlant(a), pb = Game.getPlant(b);
      return (pa?.type || '').localeCompare(pb?.type || '');
    });
    ids.forEach(id => {
      const plant = Game.getPlant(id);
      if (!plant) return;
      const have = (seeds[id] || 0) + (stars[id] || 0);
      const starN = stars[id] || 0;
      const opt = document.createElement('div');
      opt.className = 'seed-option seed-option-compact';
      const maxPlant = Math.min(have, empty);
      opt.innerHTML = `
        <span class="icon">${plant.icon}</span>
        <div class="info" style="flex:1;min-width:0">
          <div class="name">${plant.name}${starN ? ' ⭐' : ''}</div>
          <div class="qty">Còn ${have.toLocaleString()}${starN ? ' (⭐' + starN + ')' : ''} · ${Game.formatTime(plant.growTime)}</div>
        </div>
        <div class="plant-qty-row">
          <input type="number" class="plant-qty-input" min="1" max="${Math.max(1, maxPlant)}" value="1" ${maxPlant < 1 ? 'disabled' : ''} />
          <button class="btn btn-primary btn-sm btn-plant-n" data-id="${id}" ${maxPlant < 1 ? 'disabled' : ''}>
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
        const res = await Game.plantMultiple(btn.dataset.id, n);
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
  // Nâng cấp hệ số ô (1.0 → 50)
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

/** Cập nhật realtime thời gian/tiến độ trong modal chi tiết ô (giống ngoài vườn) */
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

  // Đổi nút khi chín / hết hiệu lực (gồm 10 giây cuối)
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


/** Ấn giữ (≥450ms) → callback hold; nhả sớm → callback click */
function bindPressHold(el, { onClick, onHold, ms = 450 } = {}) {
  if (!el) return;
  let timer = null;
  let held = false;
  const clear = () => { if (timer) { clearTimeout(timer); timer = null; } };
  const start = (e) => {
    if (e.type === 'mousedown' && e.button !== 0) return;
    held = false;
    clear();
    timer = setTimeout(() => {
      held = true;
      timer = null;
      if (typeof onHold === 'function') onHold(e);
    }, ms);
  };
  const end = (e) => {
    if (!timer && !held) return;
    const wasHold = held;
    clear();
    if (!wasHold && typeof onClick === 'function') onClick(e);
    held = false;
  };
  const cancel = () => { clear(); held = false; };
  el.addEventListener('mousedown', start);
  el.addEventListener('touchstart', start, { passive: true });
  el.addEventListener('mouseup', end);
  el.addEventListener('touchend', end);
  el.addEventListener('mouseleave', cancel);
  el.addEventListener('touchcancel', cancel);
}

/** Modal nhập số lượng (ghép / mua): title, hint, maxHint, onConfirm(n|'all') */
function openQtyPickModal({ title, hint, confirmLabel, onConfirm }) {
  const modal = document.getElementById('modal-bulk');
  const list = document.getElementById('bulk-qty-list');
  const titleEl = document.getElementById('bulk-title');
  const hintEl = document.getElementById('bulk-hint');
  if (!modal || !list) return;
  if (titleEl) titleEl.textContent = title || 'Chọn số lượng';
  if (hintEl) hintEl.textContent = hint || '';
  list.innerHTML = '';
  const row = document.createElement('div');
  row.className = 'bulk-qty-row';
  row.innerHTML = `
    <input type="number" id="bulk-qty-input" class="bulk-qty-input" min="1" max="9999" placeholder="Số lượng" inputmode="numeric" />
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
    const v = parseInt(row.querySelector('#bulk-qty-input')?.value, 10);
    if (!Number.isFinite(v) || v < 1) { showToast('Nhập số hợp lệ!', 'error'); return; }
    run(v);
  });
  modal.classList.add('show');
  setTimeout(() => row.querySelector('#bulk-qty-input')?.focus(), 80);
}


let bulkAction = null; // 'water' | 'fert' | 'harvest'
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
  // Nút xác nhận nhỏ cạnh input
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
}


// ===== FERT PICKER =====
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

// ===== Unified pagination UI (page 1-based) =====
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

// ===== SHOP =====
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
  // Limited còn trong sự kiện lên trước
  plants = plants.slice().sort((a, b) => {
    const la = Game.isPlantLimited(a) && Game.isPlantAvailable(a) ? 0 : 1;
    const lb = Game.isPlantLimited(b) && Game.isPlantAvailable(b) ? 0 : 1;
    return la - lb;
  });
  return plants;
}

function renderShop() {
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
    grid.innerHTML = `
      <div class="shop-card shop-plot-card" style="grid-column: 1 / -1; max-width: 360px;">
        <div class="shop-icon">🟫</div>
        <div class="shop-name">Mua thêm ô đất · Vườn ${gIdx}</div>
        <span class="shop-type">Tối đa ${maxP} ô / vườn · Đủ ${maxP} ô mở vườn mới</span>
        <div class="shop-meta"><span>Vườn ${gIdx}: <strong>${have}/${maxP}</strong> ô · Tổng ${gCount} vườn</span></div>
        <div class="shop-price">${price.toLocaleString()} 🪙 / ô</div>
        <div class="buy-qty">
          <input type="number" id="plot-qty-input" class="qty-input" min="1" max="20" value="1" />
          <button class="btn btn-warning" id="btn-buy-plot"><i class="fa-solid fa-cart-plus"></i> Mua ô</button>
        </div>
      </div>`;
    document.getElementById('btn-buy-plot')?.addEventListener('click', async () => {
      const q = parseInt(document.getElementById('plot-qty-input')?.value || '1', 10);
      const res = await Game.buyPlot(q);
      showToast(res.msg, res.ok ? 'success' : 'error');
      updateCoins();
      renderShop();
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
        const n = qty === 'all' ? 99 : Math.max(1, parseInt(qty, 10) || 1);
        const res = await Game.buyProtect(btn.dataset.id, n);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderShop();
      };
      bindPressHold(btn, {
        onClick: () => buy(1),
        onHold: () => openQtyPickModal({
          title: 'Mua bao nhiêu bùa?',
          hint: 'Nhập số lượng hoặc Tất cả (tối đa 99).',
          confirmLabel: 'Mua',
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
        const n = qty === 'all' ? 99 : Math.max(1, parseInt(qty, 10) || 1);
        const res = await Game.buyFertilizer(btn.dataset.id, n);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderShop();
      };
      bindPressHold(btn, {
        onClick: () => buy(1),
        onHold: () => openQtyPickModal({
          title: 'Mua bao nhiêu?',
          hint: 'Nhập số lượng hoặc Tất cả (tối đa 99).',
          confirmLabel: 'Mua',
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
    none.innerHTML = `<div class="shop-icon" style="font-size:2rem">🚫</div><div class="shop-name">Không thú</div><div class="shop-owned">${!eq ? '✅ Đang dùng' : ''}</div><button class="btn btn-secondary btn-equip-cp" data-id="none">Gỡ</button>`;
    grid.appendChild(none);
    items.forEach(it => {
      const have = !!owned[it.id];
      const on = eq === it.id;
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `<div class="shop-icon" style="font-size:2.2rem">${it.icon}</div>
        <div class="shop-name">${it.name}</div>
        <span class="shop-type">${it.rarity || 'common'}</span>
        <div class="shop-owned">${on ? '✅ Đang gắn' : (have ? 'Đã có' : 'Chưa có')}</div>
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

  if (currentShopTab === 'chatframe') {
    const countEl = document.getElementById('shop-count');
    document.getElementById('shop-pager').innerHTML = '';
    const items = (Game.getChatFrames && Game.getChatFrames()) || [];
    if (countEl) countEl.textContent = items.length + ' khung tin nhắn · hiện với bạn bè';
    const owned = (currentPlayer && currentPlayer.chatFrames) || {};
    const eq = (currentPlayer && currentPlayer.chatFrameId) || null;
    const none = document.createElement('div');
    none.className = 'shop-card';
    none.innerHTML = `<div class="shop-icon chat-frame-preview" style="--cf-grad:linear-gradient(135deg,#e8f5e9,#fff)"></div><div class="shop-name">Mặc định</div><button class="btn btn-secondary btn-equip-cf" data-id="none">Gỡ khung</button>`;
    grid.appendChild(none);
    items.forEach(it => {
      const have = !!owned[it.id];
      const on = eq === it.id;
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.innerHTML = `<div class="shop-icon chat-frame-preview" style="--cf-grad:${it.gradient};color:${it.textColor||'#14532d'}"><span style="font-size:0.7rem;font-weight:700">Xin chào!</span></div>
        <div class="shop-name">${it.name}</div>
        <span class="shop-type">${it.rarity||''}</span>
        <div class="shop-owned">${on ? '✅ Đang dùng' : (have ? 'Đã có' : 'Chưa có')}</div>
        <div class="shop-price">${(it.price||0).toLocaleString()} 🪙</div>
        ${have ? `<button class="btn ${on?'btn-secondary':'btn-primary'} btn-equip-cf" data-id="${it.id}">${on?'Đang dùng':'Dùng'}</button>`
               : `<button class="btn btn-primary btn-buy-cf" data-id="${it.id}"><i class="fa-solid fa-cart-plus"></i> Mua</button>`}`;
      grid.appendChild(card);
    });
    grid.querySelectorAll('.btn-buy-cf').forEach(btn => btn.addEventListener('click', async () => {
      const res = await Game.buyChatFrame(btn.dataset.id);
      showToast(res.msg, res.ok ? 'success' : 'error'); updateCoins(); renderShop();
    }));
    grid.querySelectorAll('.btn-equip-cf').forEach(btn => btn.addEventListener('click', () => {
      const res = Game.equipChatFrame(btn.dataset.id);
      showToast(res.msg, res.ok ? 'success' : 'error');
      if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(400);
      renderShop();
    }));
    return;
  }

  if (currentShopTab === 'khung') {
    const countEl = document.getElementById('shop-count');
    document.getElementById('shop-pager').innerHTML = '';
    const frames = (Game.getAvatarFrames && Game.getAvatarFrames()) || [];
    if (countEl) countEl.textContent = frames.length + ' khung viền gradient · càng đẹp càng đắt';
    const owned = (currentPlayer && currentPlayer.avatarFrames) || {};
    const equipped = (currentPlayer && currentPlayer.avatarFrameId) || null;
    // Gỡ khung
    const noneCard = document.createElement('div');
    noneCard.className = 'shop-card';
    noneCard.innerHTML = `
      <div class="shop-icon avatar-frame-preview" style="--af-grad:linear-gradient(135deg,#94a3b8,#e2e8f0)"><span class="af-inner"></span></div>
      <div class="shop-name">Không khung</div>
      <span class="shop-type">Mặc định</span>
      <div class="shop-owned">${!equipped ? '✅ Đang dùng' : 'Chưa gắn'}</div>
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
        <div class="shop-owned">${on ? '✅ Đang gắn' : (have ? 'Đã sở hữu' : 'Chưa có')}</div>
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
        <div class="shop-owned">${have ? '✅ Đã sở hữu' : 'Chưa có'}</div>
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

  // Banner limited đang mở
  const activeLimited = Game.getPlants().filter(p => Game.isPlantLimited(p) && Game.isPlantAvailable(p));
  if (activeLimited.length && currentShopTab !== 'odat' && currentShopTab !== 'phan' && currentShopTab !== 'baoho' && currentShopTab !== 'tien' && currentShopTab !== 'nyc' && currentShopTab !== 'helper' && currentShopTab !== 'khung' && currentShopTab !== 'companion' && currentShopTab !== 'chatframe') {
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
      const len = [...raw].length; // đếm đúng ký tự Unicode
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
        <input type="number" class="qty-input" min="1" max="9999" value="1" data-id="${plant.id}" ${!available ? 'disabled' : ''} />
        <button class="btn btn-primary btn-buy" data-id="${plant.id}" ${!available ? 'disabled' : ''}><i class="fa-solid fa-cart-plus"></i> ${available ? 'Mua' : 'Khóa'}</button>
      </div>
    `;
    grid.appendChild(card);
  });

  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const input = btn.parentElement.querySelector('.qty-input');
      const qty = Math.max(1, parseInt(input?.value || '1', 10));
      const res = await Game.buySeed(id, qty);
      showToast(res.msg, res.ok ? 'success' : 'error');
      updateCoins();
      renderShop();
    });
  });

  // Pager thống nhất
  const pager = document.getElementById('shop-pager');
  renderUxPager(pager, {
    page: shopPage + 1,
    totalPages,
    onChange: (p) => { shopPage = p - 1; renderShop(); }
  });
}

// ===== INVENTORY =====
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.inv-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('inv-' + btn.dataset.tab).classList.add('active');
  });
});

function renderInventory() {
  if (!currentPlayer) return;
  if (typeof Game !== 'undefined' && Game.normalizeHarvestBags) Game.normalizeHarvestBags();
  const seeds = (currentPlayer.inventory && currentPlayer.inventory.seeds) || {};
  const ferts = (currentPlayer.inventory && currentPlayer.inventory.fertilizers) || {};
  const harvest = (currentPlayer.inventory && currentPlayer.inventory.harvest) || {};
  const harvestStar = (currentPlayer.inventory && currentPlayer.inventory.harvestStar) || {};
  const harvestBought = (currentPlayer.inventory && currentPlayer.inventory.harvestBought) || {};

  // Seeds — tách riêng thường / sao
  const invQ = (document.getElementById('inv-search')?.value || '').trim().toLowerCase();
  const seedsEl = document.getElementById('inv-seeds');
  const stars = (currentPlayer.inventory && currentPlayer.inventory.seedsStar) || {};

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
      return `
        <div class="inv-item">
          <div class="icon">${plant.icon}${kind === 'star' ? ' ⭐' : ''}</div>
          <div class="name">${plant.name}${kind === 'star' ? ' ⭐' : ''}</div>
          <div class="qty">x${qty.toLocaleString()} · ${unit}🪙/hạt</div>
          <div class="actions">
            <button class="btn btn-success btn-sell-seed" data-id="${id}" data-kind="${kind}" data-qty="1">Bán 1</button>
            <button class="btn ${kind === 'star' ? 'btn-warning' : 'btn-primary'} btn-sell-seed" data-id="${id}" data-kind="${kind}" data-qty="all">Bán hết</button>
          </div>
        </div>`;
    }).join('') + '</div></div>';
    return html;
  };

  const normalIds = filterIds(seeds);
  const starIds = filterIds(stars);
  if (!normalIds.length && !starIds.length) {
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
    seedsEl.innerHTML = sHtml;
    seedsEl.querySelectorAll('.btn-sell-seed').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const kind = btn.dataset.kind || 'normal';
        let qty = btn.dataset.qty;
        if (qty === 'all') {
          if (kind === 'star') qty = (currentPlayer.inventory.seedsStar && currentPlayer.inventory.seedsStar[id]) || 0;
          else qty = (currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[id]) || 0;
        } else {
          qty = parseInt(qty, 10) || 1;
        }
        const res = await Game.sellSeed(id, qty, kind);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderInventory();
      });
    });
  }

  // Fertilizers — có thể bán
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
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        let qty = btn.dataset.qty;
        if (qty === 'all') qty = (currentPlayer.inventory.fertilizers && currentPlayer.inventory.fertilizers[id]) || 0;
        else qty = 1;
        const res = await Game.sellFertilizer(id, qty);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderInventory();
      });
    });
  }

  // Harvest — tách 3 nguồn: thu hoạch / mua / ghép sao
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
  harvestEl.innerHTML = hHtml;

  document.getElementById('btn-sell-all-harvest')?.addEventListener('click', async () => {
    const res = await Game.sellAllHarvest();
    showToast(res.msg || 'Đã bán!', res.ok !== false ? 'success' : 'error');
    updateCoins();
    renderInventory();
  });
  harvestEl.querySelectorAll('.btn-sell-hv').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const kind = btn.dataset.kind || 'normal';
      const bagKey = kind === 'star' ? 'harvestStar' : (kind === 'bought' ? 'harvestBought' : 'harvest');
      const have = (currentPlayer.inventory[bagKey] && currentPlayer.inventory[bagKey][id]) || 0;
      const qty = btn.dataset.qty === 'all' ? have : 1;
      const res = await Game.sellHarvest(id, qty, kind);
      showToast(res.msg, res.ok ? 'success' : 'error');
      updateCoins();
      renderInventory();
    });
  });

  // Bảo hộ
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

  // Ghép hạt — giữ lựa chọn hạt + bùa sau mỗi lần ghép
  const mergeEl = document.getElementById('inv-merge');
  if (mergeEl) {
    if (typeof window._mergeSel === 'undefined') {
      window._mergeSel = { plantId: null, protectId: null };
    }
    const mergeable = Object.keys(seeds).filter(id => (seeds[id] || 0) >= 2);
    const prots = (currentPlayer.inventory && currentPlayer.inventory.protects) || {};
    const pids = Object.keys(prots).filter(id => prots[id] > 0);
    if (!mergeable.length) {
      mergeEl.innerHTML = '<p class="empty-state">Cần ≥ 2 hạt <strong>thường</strong> cùng loại để ghép thành hạt ⭐ (+50% sản lượng & giá bán).</p>';
    } else {
      // Ưu tiên lựa chọn trước đó nếu còn đủ hạt / còn bùa
      let selPlant = window._mergeSel.plantId;
      if (!selPlant || !mergeable.includes(selPlant)) selPlant = mergeable[0];
      let selProt = window._mergeSel.protectId || '';
      if (selProt && !pids.includes(selProt)) selProt = '';

      let opts = mergeable.map(id => {
        const pl = Game.getPlant(id);
        if (!pl) return '';
        const sel = id === selPlant ? ' selected' : '';
        return `<option value="${id}"${sel}>${pl.icon} ${pl.name} (x${seeds[id]})</option>`;
      }).join('');
      const baseRate = (Game.getMergeBaseRate && Game.getMergeBaseRate()) || 25;
      let popts = `<option value=""${selProt === '' ? ' selected' : ''}>Không dùng bùa (${baseRate}%)</option>` + pids.map(id => {
        const item = Game.getProtect(id);
        if (!item) return '';
        const sel = id === selProt ? ' selected' : '';
        const eff = Game.getMergeSuccessRate ? Game.getMergeSuccessRate(id) : Math.min(100, baseRate + (item.rate || 0));
        return `<option value="${id}"${sel}>${item.name} → ${eff}% — x${prots[id]}</option>`;
      }).join('');
      mergeEl.innerHTML = `
        <div class="merge-box">
          <p class="merge-lead">Ghép <strong>2 hạt thường</strong> → <strong>1 hạt sao</strong></p>
          <p class="merge-sub">Thất bại mất 1 hạt (+ bùa nếu có).</p>
          <label>Chọn hạt</label>
          <select id="merge-plant">${opts}</select>
          <label>Bùa bảo hộ (tuỳ chọn)</label>
          <select id="merge-protect">${popts}</select>
          <button id="btn-do-merge" class="btn btn-primary" style="margin-top:12px"><i class="fa-solid fa-flask-vial"></i> Ghép ngay</button>
        </div>`;
      const plantSel = document.getElementById('merge-plant');
      const protSel = document.getElementById('merge-protect');
      plantSel?.addEventListener('change', () => {
        window._mergeSel.plantId = plantSel.value || null;
      });
      protSel?.addEventListener('change', () => {
        window._mergeSel.protectId = protSel.value || null;
      });
      // Ghi nhớ ngay giá trị đang hiện
      window._mergeSel.plantId = plantSel?.value || selPlant;
      window._mergeSel.protectId = protSel?.value || selProt || null;

      const doMerge = async (times) => {
        const pid = plantSel?.value;
        const pr = protSel?.value || null;
        window._mergeSel.plantId = pid || null;
        window._mergeSel.protectId = pr || null;
        if (!pid) { showToast('Chọn hạt!', 'error'); return; }
        let n = times;
        if (n === 'all') {
          const have = (currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[pid]) || 0;
          n = Math.floor(have / 2);
          if (pr) {
            const ph = (currentPlayer.inventory.protects && currentPlayer.inventory.protects[pr]) || 0;
            n = Math.min(n, ph);
          }
        }
        n = Math.max(1, parseInt(n, 10) || 1);
        const res = await Game.mergeSeeds(pid, pr || null, n);
        showToast(res.msg, res.ok ? (res.success ? 'success' : 'error') : 'error');
        updateCoins();
        renderInventory();
      };
      const mergeBtn = document.getElementById('btn-do-merge');
      bindPressHold(mergeBtn, {
        onClick: () => doMerge(1),
        onHold: () => {
          const pid = plantSel?.value;
          const have = pid ? ((currentPlayer.inventory.seeds && currentPlayer.inventory.seeds[pid]) || 0) : 0;
          const maxN = Math.floor(have / 2);
          openQtyPickModal({
            title: 'Ghép bao nhiêu lần?',
            hint: `Tối đa ~${maxN} lần với số hạt hiện có. Ấn giữ = chọn số / Tất cả.`,
            confirmLabel: 'Ghép',
            onConfirm: (n) => doMerge(n)
          });
        }
      });
      mountAllPillDropdowns(mergeEl);
    }
  }
}

// ===== STATS =====
function renderStats() {
  if (!currentPlayer) return;
  const s = currentPlayer.stats || {};
  const plots = Array.isArray(currentPlayer.plots) ? currentPlayer.plots : Object.values(currentPlayer.plots || {});
  const xpNext = Game.xpForLevel(currentPlayer.level || 1);
  const colN = Game.collectionCount();
  const colPct = Game.collectionPercent();
  const achUnlocked = Object.keys(currentPlayer.achievements || {}).length;
  const achTotal = Game.getAchievementsDef().length;

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
      <div class="value">${(currentPlayer.coins || 0).toLocaleString()}</div>
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
      <div class="value">${(s.earned || 0).toLocaleString()}</div>
      <div class="label"><i class="fa-solid fa-arrow-trend-up"></i> Tổng thu nhập</div>
    </div>
    <div class="stat-card">
      <div class="value">${(s.spent || 0).toLocaleString()}</div>
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

  // Album — full + pagination PC 5 hàng × 11 cột = 55/trang
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
    }).join('') + `<div class="album-pager">
      <button type="button" class="btn btn-secondary btn-sm" id="album-prev" ${page<=0?'disabled':''}><i class="fa-solid fa-chevron-left"></i></button>
      <span class="album-page-info">Trang ${page+1}/${totalPages} · ${plants.length} loại</span>
      <button type="button" class="btn btn-secondary btn-sm" id="album-next" ${page>=totalPages-1?'disabled':''}><i class="fa-solid fa-chevron-right"></i></button>
    </div>`;
    document.getElementById('album-prev')?.addEventListener('click', () => { window._albumPage = Math.max(0, page - 1); renderStats(); });
    document.getElementById('album-next')?.addEventListener('click', () => { window._albumPage = Math.min(totalPages - 1, page + 1); renderStats(); });
  }

  // Achievements list
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

// ===== ACTIVITY PAGE =====
function activityFaIcon(text, type) {
  const s = String(text || '');
  const t = String(type || '');
  if (t === 'offline' || s.indexOf('BÙ OFFLINE') >= 0 || s.indexOf('Bù offline') >= 0) return 'fa-solid fa-bolt';
  if (t === 'offline_detail') return 'fa-solid fa-circle-info';
  if (t === 'harvest_offline' || s.indexOf('Thu hoạch') >= 0) return 'fa-solid fa-basket-shopping';
  if (s.indexOf('Trồng') >= 0 || s.indexOf('trồng lại') >= 0) return 'fa-solid fa-seedling';
  if (s.indexOf('Tưới') >= 0 || s.indexOf('tưới') >= 0) return 'fa-solid fa-droplet';
  if (s.indexOf('Bón') >= 0 || s.indexOf('phân') >= 0) return 'fa-solid fa-flask';
  if (s.indexOf('Tiên') >= 0) return 'fa-solid fa-wand-magic-sparkles';
  if (s.indexOf('NYC') >= 0 || s.indexOf('Người yêu') >= 0) return 'fa-solid fa-heart';
  if (s.indexOf('Giúp việc') >= 0 || s.indexOf('Helper') >= 0) return 'fa-solid fa-user-tie';
  if (s.indexOf('Mua') >= 0) return 'fa-solid fa-cart-shopping';
  if (s.indexOf('Bán') >= 0) return 'fa-solid fa-tags';
  if (s.indexOf('Lên cấp') >= 0) return 'fa-solid fa-star';
  if (s.indexOf('Thành tựu') >= 0) return 'fa-solid fa-medal';
  if (s.indexOf('Ghép') >= 0) return 'fa-solid fa-flask-vial';
  if (s.indexOf('Nhổ') >= 0) return 'fa-solid fa-trash';
  if (s.indexOf('mưa') >= 0 || s.indexOf('Mưa') >= 0) return 'fa-solid fa-cloud-rain';
  if (s.indexOf('pet') >= 0 || s.indexOf('Pet') >= 0) return 'fa-solid fa-paw';
  if (s.indexOf('Admin') >= 0) return 'fa-solid fa-user-shield';
  if (s.indexOf('thưởng') >= 0 || s.indexOf('Nhận') >= 0) return 'fa-solid fa-gift';
  return 'fa-solid fa-circle-dot';
}

function renderActivityPage() {
  if (!currentPlayer) return;
  const actList = document.getElementById('activity-list');
  if (!actList) return;
  const acts = currentPlayer.activity || [];
  if (acts.length === 0) {
    actList.innerHTML = '<li class="activity-empty"><i class="fa-solid fa-inbox"></i> Chưa có hoạt động nào.</li>';
  } else {
    actList.innerHTML = acts.slice(0, 80).map(a => {
      const icon = activityFaIcon(a.text, a.type);
      return '<li><span class="time"><i class="fa-regular fa-clock"></i> ' + (a.time || '') + '</span><span class="act-icon"><i class="' + icon + '"></i></span><span class="act-text">' + (a.text || '') + '</span></li>';
    }).join('');
  }
}

// ===== LEVEL / TREE BADGE PAGE =====
const TREE_TIERS = [
  { min: 1, max: 49, class: 'tier-tree-1', title: 'Mầm Cây Trong Chậu Đất', icon: 'fa-seedling', desc: 'Hạt giống nhỏ vừa vươn mầm khỏi chậu đất sét nâu tròn', glow: 'rgba(133, 83, 53, 0.4)' },
  { min: 50, max: 149, class: 'tier-tree-2', title: 'Chồi Xanh Lục Ngọc', icon: 'fa-plant-wilt', desc: 'Mầm chồi non vươn cao với những chiếc lá lục bảo bóng mượt', glow: 'rgba(74, 222, 128, 0.45)' },
  { min: 150, max: 299, class: 'tier-tree-3', title: 'Thân Cây Bích Nguyệt', icon: 'fa-leaf', desc: 'Thân cây con tỏa sắc lam ngọc huyền ảo dưới ánh trăng', glow: 'rgba(56, 189, 248, 0.5)' },
  { min: 300, max: 499, class: 'tier-tree-4', title: 'Đại Thụ Kim Ngân', icon: 'fa-tree', desc: 'Thân gỗ vững chãi tỏa tán lá vàng kim rực rỡ phú quý', glow: 'rgba(250, 204, 21, 0.55)' },
  { min: 500, max: 699, class: 'tier-tree-5', title: 'Thần Hoa Sinh Thái', icon: 'fa-spa', desc: 'Thần cây trổ những bông hoa tỏa hương thơm ngọt ngào', glow: 'rgba(244, 114, 182, 0.6)' },
  { min: 700, max: 849, class: 'tier-tree-6', title: 'Rừng Dạ Quang', icon: 'fa-clover', desc: 'Cây phát sáng dạ quang xanh lơ rực rỡ giữa không gian', glow: 'rgba(0, 242, 254, 0.7)' },
  { min: 750, max: 949, class: 'tier-tree-7', title: 'Thái Dương Cổ Thụ', icon: 'fa-sun', desc: 'Cổ thụ hấp thụ ánh sáng mặt trời quay vòng hào quang', glow: 'rgba(245, 158, 11, 0.75)' },
  { min: 950, max: 999, class: 'tier-tree-8', title: 'Vệ Binh Gaia Tối Cao', icon: 'fa-earth-americas', desc: 'Cây linh hồn tím huyền bí bảo hộ cho đại địa thiên nhiên', glow: 'rgba(192, 132, 252, 0.85)' },
  { min: 1000, max: 1000, class: 'tier-tree-9', title: 'Thần Cây Vũ Trụ Yggdrasil', icon: 'fa-tree', desc: 'Đỉnh cao tiến hóa - Cây Thế Giới kết nối ngàn sao vũ trụ', glow: 'rgba(244, 63, 94, 0.95)' }
];

function getTreeTier(level) {
  return TREE_TIERS.find(t => level >= t.min && level <= t.max) || TREE_TIERS[0];
}

let _levelPageBound = false;

function updateTreeLevelUI(val) {
  const level = Math.min(1000, Math.max(1, parseInt(val, 10) || 1));
  const tier = getTreeTier(level);

  const range = document.getElementById('levelInputRange');
  if (range) range.value = level;

  const titleEl = document.getElementById('tierTitleText');
  if (titleEl) titleEl.textContent = tier.title;

  const progress = (level / 1000) * 100;
  const bar = document.getElementById('levelProgressBar');
  const pct = document.getElementById('xpPercentText');
  if (bar) bar.style.width = progress + '%';
  if (pct) pct.textContent = Math.round(progress) + '%';

  const glow = document.getElementById('levelAmbientGlow');
  if (glow) glow.style.background = tier.glow;

  const wrapper = document.getElementById('activeTreeWrapper');
  const pill = document.getElementById('activePillBadge');
  TREE_TIERS.forEach(t => {
    wrapper?.classList.remove(t.class);
    pill?.classList.remove(t.class);
  });
  wrapper?.classList.add(tier.class);
  pill?.classList.add(tier.class);

  const icon = document.getElementById('activeTreeIcon');
  const lvlNum = document.getElementById('activeTreeLvlNum');
  const pillIcon = document.getElementById('activePillIcon');
  const pillText = document.getElementById('activePillText');
  if (icon) icon.className = 'fa-solid ' + tier.icon + ' tree-icon';
  if (lvlNum) lvlNum.textContent = level;
  if (pillIcon) pillIcon.className = 'fa-solid ' + tier.icon;
  if (pillText) pillText.textContent = 'LVL ' + level + ' • ' + tier.title;
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


// ===== MODALS =====
function closeModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
}

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', closeModals);
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModals();
  });
});

if (typeof bindNycConfigUI === 'function') bindNycConfigUI();
if (typeof bindFairyConfigUI === 'function') bindFairyConfigUI();

// ===== THEME (dark / light) =====
function applyTheme(mode) {
  const root = document.documentElement;
  if (mode === 'dark') {
    root.setAttribute('data-theme', 'dark');
    const ic = document.getElementById('theme-icon');
    if (ic) ic.className = 'fa-solid fa-sun';
  } else {
    root.removeAttribute('data-theme');
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

/** Chăm Tiên + NYC — luôn chạy kể cả khi không ở trang vườn. Trả về true nếu Tiên vừa thay đổi ô. */
function tickGardenCare(opts) {
  if (!currentPlayer || typeof Game === 'undefined') return false;
  const doRender = !!(opts && opts.render);
  let fairyChanged = false;
  if (typeof Game.resetExpiredBoosts === 'function') {
    fairyChanged = !!Game.resetExpiredBoosts();
    if (fairyChanged) {
      if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(2000);
      else if (typeof savePlayer === 'function') savePlayer().catch(() => {});
      // Luôn refresh UI vườn khi Tiên vừa tưới/bón (badge nước)
      const gardenPage = document.getElementById('page-garden');
      if (gardenPage && gardenPage.classList.contains('active') && typeof renderGarden === 'function') {
        renderGarden();
      } else if (doRender && typeof renderGarden === 'function') {
        // không ở trang vườn — bỏ qua DOM
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

// Cập nhật tiến độ/timer tại chỗ (tránh re-render → hết nhấp nháy khi hover)
function softUpdateGarden() {
  if (!currentPlayer) return;
  tickGardenCare({ render: false });
  softUpdateGardenUI();
}
function softUpdateGardenUI() {
  if (!currentPlayer) return;
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
      tm.innerHTML = `<i class="fa-regular fa-clock"></i> ${Game.formatTime(remain)}`;
    } else if (tm) {
      tm.remove();
    }
    const bar = el.querySelector('[data-role="bar"]');
    if (bar && !ready) bar.style.width = progress + '%';
    const icon = el.querySelector('.plot-icon');
    if (icon && stage.icon && icon.textContent !== stage.icon) icon.textContent = stage.icon;
    // Gỡ badge boost cũ trên ô (nếu còn từ phiên trước)
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

/** Cập nhật chip đếm ngược 3h (kiểu thời tiết) + thanh trạng thái hỗ trợ */
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

  // Có Tiên: đồng hồ = thời gian đến lần chăm tiếp theo (chu kỳ 3 giờ)
  if (Game.isFairyActive && Game.isFairyActive()) {
    const sec = Game.getFairyCareRemainingSec ? Game.getFairyCareRemainingSec() : null;
    const remain = sec == null ? 0 : sec;
    const label = Game.formatTime(remain);
    setCycle(label, remain <= 0);
    if (btn) {
      btn.title = remain <= 0
        ? '🧚 Tiên sắp / đang chăm vườn (tưới + bón nếu có phân)'
        : `🧚 Tiên chăm lại sau: ${label} (mỗi 3 giờ)`;
    }
    if (typeof refreshSupportMenuStatus === 'function') refreshSupportMenuStatus();
    return;
  }

  const plots = Array.isArray(currentPlayer.plots) ? currentPlayer.plots : Object.values(currentPlayer.plots || {});
  let minRemain = null;
  let activeBoosts = 0;

  plots.forEach((plot) => {
    if (!plot) return;
    const sec = Game.getBoostResetRemaining ? Game.getBoostResetRemaining(plot) : null;
    if (sec == null) return;
    activeBoosts++;
    if (minRemain == null || sec < minRemain) minRemain = sec;
  });

  if (minRemain != null) {
    const label = Game.formatTime(minRemain);
    setCycle(label, minRemain <= 0);
    if (btn) {
      btn.title = minRemain <= 0
        ? 'Đã hết hiệu lực tưới/phân — có thể tưới/bón lại'
        : `Reset tưới & phân gần nhất: ${label} (${activeBoosts} ô đang có hiệu lực)`;
    }
  } else {
    setCycle('--:--:--', false);
    if (btn) btn.title = 'Chưa tưới / bón phân — reset sau 3 giờ kể từ lần tưới/bón';
  }
  if (typeof refreshSupportMenuStatus === 'function') refreshSupportMenuStatus();
}

/**
 * Chăm vườn nền — Tiên / NYC / Giúp việc chạy KỂ CẢ không mở trang Vườn.
 * Chỉ cần đang đăng nhập + tab còn sống (hoặc vừa mở lại).
 */
function forceBackgroundCare(reason) {
  if (!currentPlayer || typeof Game === 'undefined') return false;
  try {
    // Giúp việc: cho phép check ngay sau khi tab quay lại / login
    if (reason === 'visible' || reason === 'login' || reason === 'focus' || reason === 'online') {
      if (currentPlayer.lastHelperBuy && (Date.now() - currentPlayer.lastHelperBuy > 5000)) {
        // giữ cooldown bình thường; không reset về 0 để tránh spam mua
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

// Live update mỗi 1s: luôn chăm nền; chỉ soft-update DOM khi đang ở trang vườn
setInterval(() => {
  if (!currentPlayer) return;
  // Không bỏ qua khi tab ẩn — browser throttle interval, nhưng khi chạy vẫn phải chăm
  forceBackgroundCare('tick');
  const gardenPage = document.getElementById('page-garden');
  if (gardenPage && gardenPage.classList.contains('active')) {
    // softUpdateGarden đã gọi tickGardenCare — tách phần UI
    softUpdateGardenUI();
  }
  if (typeof softUpdateBank === 'function') softUpdateBank();
}, 1000);

// Tab quay lại / focus / online → chăm ngay (bù thời gian bị throttle)
if (!window.__careVisibilityBound) {
  window.__careVisibilityBound = true;
  function markLastSeen() {
    if (!currentPlayer) return;
    const t = (typeof nowMs === 'function') ? nowMs() : Date.now();
    currentPlayer.lastSeenAt = t;
    // Lưu ngay khi ẩn/thoát — không debounce (tránh mất tiến trình)
    if (typeof flushSavePlayer === 'function') flushSavePlayer();
    else if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(200);
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      markLastSeen();
    } else if (currentPlayer) {
      (async () => {
        // Kéo bản Firebase nếu máy khác đã lưu mới hơn
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
        // Không còn ngưỡng 5 phút — luôn bù thời gian / log khi quay lại
        if (typeof Game !== 'undefined' && Game.simulateOfflineCare) {
          try {
            const r = await Game.simulateOfflineCare();
            if (r && r.changed) {
              if (typeof scheduleSavePlayer === 'function') scheduleSavePlayer(800);
              if (typeof updateCoins === 'function') updateCoins();
              if (typeof renderGarden === 'function') {
                const gp = document.getElementById('page-garden');
                if (gp && gp.classList.contains('active')) renderGarden();
              }
              if (r.notes && r.notes.length && typeof showToast === 'function') {
                showToast('⚡ ' + (r.offlineText ? r.offlineText + ' · ' : '') + (r.notes && r.notes.length ? r.notes.join(' · ') : 'Bù offline — xem Nhật ký'), 'success');
              }
            } else {
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

// Check rain every 45s when logged in
setInterval(() => {
  if (currentPlayer && !Game.raining) {
    Game.tryTriggerRain();
  }
}, 45000);

// First rain chance shortly after login
setTimeout(() => {
  if (currentPlayer) Game.tryTriggerRain();
}, 8000);

// ===== QUESTS / MARKET / BANK / GIFT =====
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
        <div class="shop-meta"><span>${L.kind === 'seed' ? 'Hạt' : 'Nông sản'} · x${L.qty}</span></div>
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
        const res = await Features.buyMarketItem(btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderMarket();
      });
    });
    host.querySelectorAll('.btn-mkt-cancel').forEach(btn => {
      btn.addEventListener('click', async () => {
        const res = await Features.cancelMarketItem(btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        renderMarket();
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

/** Lãi tích lũy tuyến tính theo giây đến đáo hạn */
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

/** Lãi mỗi giây (xu/s) */
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
        <button class="btn ${matured ? 'btn-success' : 'btn-secondary'} btn-sm btn-bank-wd" data-id="${d.id}">
          ${matured ? 'Rút lãi' : 'Rút sớm'}
        </button>
      </div>
    </div>`;
  }).join('');
  host.querySelectorAll('.btn-bank-wd').forEach(btn => {
    btn.addEventListener('click', async () => {
      const res = await Features.bankWithdraw(btn.dataset.id);
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

/** Realtime: lãi + đếm ngược (giống plot-timer) */
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
      if (remEl) remEl.textContent = '✅ Đáo hạn — nhận ' + fullPayout.toLocaleString() + '🪙';
      const btn = el.querySelector('.btn-bank-wd');
      if (btn && !btn.classList.contains('btn-success')) {
        btn.className = 'btn btn-success btn-sm btn-bank-wd';
        btn.textContent = 'Rút lãi';
      }
    } else {
      if (intEl) intEl.textContent = '+' + formatBankInterest(interest);
      if (psEl) psEl.textContent = '+' + formatBankInterest(perSec);
      if (totEl) totEl.textContent = formatBankInterest(totalNow);
      if (remEl) remEl.textContent = '⏳ ' + Game.formatTime(remain);
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

/** Không bọc −/+; giữ input number native */
function enhanceQtyInputs(root) {
  /* no-op: không thêm qty-arrows / qty-stepper */
}

// Hook sau render shop / plant modal
const _origRenderShop = typeof renderShop === 'function' ? renderShop : null;
if (_origRenderShop) {
  window.renderShop = function () {
    _origRenderShop.apply(this, arguments);
    enhanceQtyInputs(document.getElementById('shop-grid'));
  };
}

/** PC: lăn chuột giữa trên vườn → cuộn ngang ô vườn */
(function setupGardenHorizontalWheel() {
  const grid = document.getElementById('garden-grid');
  if (!grid) return;
  grid.addEventListener('wheel', (e) => {
    // Chỉ áp dụng khi có thể cuộn ngang và đang dùng chuột (không phải trackpad pinch)
    if (grid.scrollWidth <= grid.clientWidth + 2) return;
    // Ưu tiên chuyển deltaY thành scroll ngang khi người dùng lăn dọc
    const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    if (delta === 0) return;
    e.preventDefault();
    grid.scrollLeft += delta;
  }, { passive: false });
})();


// ===== NHÀ BẾP =====
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
  const q = (document.getElementById('kitchen-search')?.value || '').trim().toLowerCase();
  const cookEl = document.getElementById('kitchen-cook');
  const dishesEl = document.getElementById('kitchen-dishes');
  const recipes = Game.getRecipes();
  const harvest = (currentPlayer.inventory && currentPlayer.inventory.harvest) || {};
  const ownedDishes = (currentPlayer.inventory && currentPlayer.inventory.dishes) || {};

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
    // Ưu tiên món nấu được
    list = list.slice().sort((a, b) => {
      const canA = (a.ingredients || []).every(ing => (harvest[ing.plantId] || 0) >= (ing.qty || 1));
      const canB = (b.ingredients || []).every(ing => (harvest[ing.plantId] || 0) >= (ing.qty || 1));
      if (canA !== canB) return canA ? -1 : 1;
      return (a.name || '').localeCompare(b.name || '', 'vi');
    });
    const pageSize = 24;
    if (typeof window.kitchenPage !== 'number' || window.kitchenPage < 1) window.kitchenPage = 1;
    const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
    if (window.kitchenPage > totalPages) window.kitchenPage = totalPages;
    const start = (window.kitchenPage - 1) * pageSize;
    const show = list.slice(start, start + pageSize);
    cookEl.innerHTML = `
      <p class="bulk-hint">Trang ${window.kitchenPage}/${totalPages} · ${show.length}/${list.length} món (tổng ${recipes.length} thực đơn). Có thể nấu xếp trước.</p>
      <div class="kitchen-grid">` + show.map(r => {
      const ings = (r.ingredients || []).map(ing => {
        const p = Game.getPlant(ing.plantId);
        const have = harvest[ing.plantId] || 0;
        const need = ing.qty || 1;
        const ok = have >= need;
        return `<span class="kitchen-ing ${ok ? 'ok' : 'no'}">${p ? p.icon : '❓'}${p ? p.name : ing.plantId} ×${need} <small>(${have})</small></span>`;
      }).join('');
      const can = (r.ingredients || []).every(ing => (harvest[ing.plantId] || 0) >= (ing.qty || 1));
      return `<div class="kitchen-card ${can ? 'can-cook' : ''}">
        <div class="kitchen-icon">${r.icon || '🍽️'}</div>
        <div class="kitchen-name">${r.name}</div>
        <div class="kitchen-ings">${ings}</div>
        <div class="kitchen-meta">Bán <strong>${(r.sellPrice || 0).toLocaleString()}🪙</strong> · +${r.xp || 1} XP</div>
        <div class="kitchen-actions">
          <input type="number" class="qty-input kitchen-qty" min="1" max="99" value="1" data-rid="${r.id}" ${can ? '' : 'disabled'} />
          <button class="btn btn-primary btn-sm btn-cook" data-id="${r.id}" ${can ? '' : 'disabled'}>
            <i class="fa-solid fa-fire"></i> Nấu
          </button>
        </div>
      </div>`;
    }).join('') + '</div>';
    cookEl.querySelectorAll('.btn-cook').forEach(btn => {
      btn.addEventListener('click', async () => {
        const card = btn.closest('.kitchen-card');
        const qty = parseInt(card?.querySelector('.kitchen-qty')?.value || '1', 10) || 1;
        const res = await Game.cookRecipe(btn.dataset.id, qty);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderKitchen();
      });
    });
    // Pagination bếp — cùng kiểu ux-pager
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
    const ids = Object.keys(ownedDishes).filter(id => ownedDishes[id] > 0);
    if (!ids.length) {
      dishesEl.innerHTML = '<p class="empty-state">Chưa có món nào. Vào tab Nấu ăn nhé!</p>';
    } else {
      dishesEl.innerHTML = '<div class="kitchen-grid">' + ids.map(id => {
        const r = Game.getRecipe(id);
        if (!r) return '';
        const qty = ownedDishes[id];
        return `<div class="kitchen-card">
          <div class="kitchen-icon">${r.icon || '🍽️'}</div>
          <div class="kitchen-name">${r.name}</div>
          <div class="qty">x${qty} · ${(r.sellPrice || 0).toLocaleString()}🪙/món</div>
          <div class="kitchen-actions">
            <button class="btn btn-success btn-sm btn-sell-dish" data-id="${id}" data-qty="1">Bán 1</button>
            <button class="btn btn-primary btn-sm btn-sell-dish" data-id="${id}" data-qty="all">Bán hết</button>
          </div>
        </div>`;
      }).join('') + '</div>';
      dishesEl.querySelectorAll('.btn-sell-dish').forEach(btn => {
        btn.addEventListener('click', async () => {
          let qty = btn.dataset.qty;
          if (qty === 'all') qty = -1;
          else qty = parseInt(qty, 10) || 1;
          const res = await Game.sellDish(btn.dataset.id, qty);
          showToast(res.msg, res.ok ? 'success' : 'error');
          updateCoins();
          renderKitchen();
        });
      });
    }
  }
}

// ===== PET DẠO VƯỜN =====
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

// Pet nhặt xu rất hiếm mỗi 20s khi đang ở vườn
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

// Khởi tạo pill dropdown cho select tĩnh (chợ, ngân hàng...)
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

// ===== Hộp thư người chơi =====
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

/** Tự nhận thư sinh nhật 1 lần/năm khi mở hồ sơ */
async function maybeSendBirthdayMailLocal() {
  if (!currentUser || !currentPlayer || !currentPlayer.birthday) return;
  const { day, month } = currentPlayer.birthday;
  if (!day || !month) return;
  // Sinh nhật theo GMT+7 (không phụ thuộc múi giờ máy)
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


// ===== HỆ THỐNG CẬP NHẬT CLIENT =====
/** So sánh version dạng 1.2.3 — trả về <0 / 0 / >0 */
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
  // Bỏ hash để tránh kẹt modal
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
  if (el.classList.contains('force')) return; // bắt buộc → không đóng
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
  // Nếu user đã dismiss bản này và không force → không hiện lại (trừ khi force)
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
    // Giữ object settings đồng bộ (không ghi đè toàn bộ nếu đang sửa local — merge)
    if (typeof currentSettings === 'undefined' || !currentSettings) {
      // eslint-disable-next-line no-undef
      currentSettings = { ...(typeof DEFAULT_SETTINGS !== 'undefined' ? DEFAULT_SETTINGS : {}), ...val };
    } else {
      if (val.appVersion != null) currentSettings.appVersion = val.appVersion;
      if (val.updateNotes != null) currentSettings.updateNotes = val.updateNotes;
      if (typeof val.forceUpdate === 'boolean') currentSettings.forceUpdate = val.forceUpdate;
      // Đồng bộ vài field hay dùng
      if (val.rainChance != null) currentSettings.rainChance = val.rainChance;
      if (val.rainDurationMinutes != null) currentSettings.rainDurationMinutes = val.rainDurationMinutes;
      if (typeof val.maintenanceOn === 'boolean') currentSettings.maintenanceOn = val.maintenanceOn;
    }
    checkClientUpdate(true);
  };
  _settingsVersionUnsub = handler;
  db.ref('settings').on('value', handler);
}

// Bind sớm + kiểm tra sau khi có settings
bindUpdateUI();
document.addEventListener('DOMContentLoaded', () => {
  bindUpdateUI();
  // Sau khi login/initGlobalData thường đã có settings — check định kỳ nhẹ
  setTimeout(() => checkClientUpdate(false), 1500);
});

// Mỗi 2 phút kiểm tra lại (phòng listener bị mất)
setInterval(() => {
  if (typeof currentUser !== 'undefined' && currentUser) checkClientUpdate(false);
}, 120000);

// Bật realtime settings khi đã auth (hook vào flow có sẵn)
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


// ===== NGƯỜI GIÚP VIỆC UI =====
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
        <label class="helper-field">Mốc kho<input type="number" min="0" max="9999" data-i="${idx}" data-f="minStock" value="${r.minStock}" /></label>
        <label class="helper-field">Mua thêm<input type="number" min="1" max="9999" data-i="${idx}" data-f="buyQty" value="${r.buyQty}" /></label>
        <label class="helper-field helper-field-toggle"><span>Bật</span><input type="checkbox" data-i="${idx}" data-f="enabled" ${r.enabled !== false ? 'checked' : ''}/></label>
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
      if (f === 'buyQty') v = Math.max(1, Math.min(9999, v));
      if (f === 'minStock') v = Math.max(0, Math.min(9999, v));
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
    minStock: Number.isFinite(minStock) ? Math.max(0, Math.min(9999, minStock)) : 5,
    buyQty: Number.isFinite(buyQty) && buyQty > 0 ? Math.max(1, Math.min(9999, buyQty)) : 10,
    enabled: true
  });
  renderHelperRulesList();
});

document.getElementById('btn-save-helper-config')?.addEventListener('click', async () => {
  if (typeof Game === 'undefined') return;
  // Đọc lại ô input trên form (tránh bấm Lưu khi chưa blur → vẫn 99 cũ)
  document.querySelectorAll('#helper-rules-list input[data-f]').forEach(inp => {
    const i = parseInt(inp.dataset.i, 10);
    const f = inp.dataset.f;
    if (!_helperRulesDraft[i]) return;
    if (f === 'enabled') _helperRulesDraft[i].enabled = inp.checked;
    else {
      let v = parseInt(inp.value, 10);
      if (!Number.isFinite(v)) v = f === 'buyQty' ? 1 : 0;
      if (f === 'buyQty') v = Math.max(1, Math.min(9999, v));
      if (f === 'minStock') v = Math.max(0, Math.min(9999, v));
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

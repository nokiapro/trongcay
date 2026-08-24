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
  if (adminBtn) adminBtn.style.display = isAdmin ? 'flex' : 'none';
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
}
function hideRainEffect() {
  const el = document.getElementById('rain-overlay');
  if (el) { el.classList.remove('active'); el.innerHTML = ''; }
}

// ===== AUTH =====
function showLogin() {
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('app-screen').style.display = 'none';
}

function showApp() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-screen').style.display = 'block';
  updateCoins();
  updateUserUI();
  let page = 'garden';
  try { page = sessionStorage.getItem('vx_page') || 'garden'; } catch (_) {}
  goToPage(page);
}

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
      showApp();
    } catch (e) {
      console.error(e);
      showToast('Lỗi tải dữ liệu: ' + e.message, 'error');
      showLogin();
    }
  } else {
    showLogin();
  }
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
  if (page === 'stats') renderStats();
  if (page === 'rank') renderRank();
  if (page === 'friends') renderFriends();
  if (page === 'profile') renderProfile();
}

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => goToPage(btn.dataset.page));
});

document.getElementById('btn-admin')?.addEventListener('click', () => {
  window.location.href = 'admin/index.html';
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
    const labels = { planted: 'đã trồng', harvested: 'thu hoạch', coins: 'xu' };
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
      list.innerHTML = '<p class="empty-state">Chưa có bạn. Nhập UID/email để kết bạn.</p>';
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
        <button class="btn btn-secondary btn-sm btn-chat-friend" data-uid="${uid}">Chat</button>
      </div>`;
    }).join('');
    list.querySelectorAll('.btn-chat-friend').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const uid = btn.dataset.uid;
        openChat(uid, nameMap[uid] || uid.slice(0, 8));
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

function openChat(uid, name) {
  chatFriendUid = uid;
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) {
    document.getElementById('friends-panel')?.classList.add('hidden');
    document.getElementById('chat-panel')?.classList.add('chat-open');
    document.body.classList.add('chat-open-mobile');
  }
  document.getElementById('chat-panel')?.classList.remove('hidden');
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
  db.ref('messages/' + cid).limitToLast(80).on('value', snap => {
    const val = snap.val() || {};
    const msgs = Object.keys(val).map(k => ({ id: k, ...val[k] }))
      .sort((a, b) => (a.at || 0) - (b.at || 0));
    box.innerHTML = msgs.map(m => {
      const me = m.from === currentUser.uid;
      const time = m.at ? new Date(m.at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '';
      return `<div class="chat-bubble ${me ? 'me' : 'them'}">${escapeHtml(m.text || '')}<div class="t">${time}</div></div>`;
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
  const today = new Date().toDateString();
  const snap = await ref.once('value');
  const s = snap.val() || { count: 0, lastDay: '' };
  if (s.lastDay === today) {
    await updateChatStreakDisplay(friendUid);
    return;
  }
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  const next = (s.lastDay === yesterday) ? (s.count || 0) + 1 : 1;
  await ref.set({ count: next, lastDay: today });
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

// ===== PROFILE =====
function renderProfile() {
  if (!currentUser || !currentPlayer) return;
  document.getElementById('profile-uid').textContent = currentUser.uid;
  document.getElementById('profile-name').value = getDisplayName();
  document.getElementById('profile-avatar').value = currentPlayer.avatar || '';
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
});



// ===== DAILY =====
document.getElementById('btn-daily').addEventListener('click', async () => {
  const res = await Game.claimDaily();
  showToast(res.msg, res.ok ? 'success' : 'error');
  if (res.ok) { updateCoins(); updateDailyBtn(); }
});

// ===== GARDEN =====
function renderGarden() {
  if (!currentPlayer) return;
  const grid = document.getElementById('garden-grid');
  grid.innerHTML = '';

  const weather = Game.getWeather();
  document.getElementById('weather-icon').textContent = weather.icon;
  document.getElementById('weather-text').textContent = weather.text + ` (${Math.round(weather.mult * 100)}%)`;
  updateCoins();

  const plots = Array.isArray(currentPlayer.plots) ? currentPlayer.plots : Object.values(currentPlayer.plots || {});

  plots.forEach((plot, i) => {
    const div = document.createElement('div');
    div.className = 'plot';

    if (!plot.plantId) {
      div.classList.add('empty');
      div.innerHTML = `
        <div class="plot-icon">🟫</div>
        <div class="plot-name">Ô trống</div>
        <div class="plot-status">Nhấn để trồng</div>
      `;
      div.addEventListener('click', () => openPlantModal(i));
    } else {
      const plant = Game.getPlant(plot.plantId);
      if (!plant) {
        div.classList.add('empty');
        div.innerHTML = `<div class="plot-icon">❓</div><div class="plot-name">Lỗi dữ liệu</div>`;
      } else {
        const progress = Game.getProgress(plot);
        const ready = progress >= 100;
        const stage = Game.getStage(plot);
        const remain = Game.getRemainingSeconds(plot);

        if (ready) div.classList.add('ready');
        else div.classList.add('growing');

        const stageIcon = stage.icon;

        let badges = '';
        if (plot.waterCount > 0) badges += `<span title="Đã tưới ${plot.waterCount}/3">💧${plot.waterCount > 1 ? plot.waterCount : ''}</span>`;
        if (plot.fertilizerId) {
          const f = Game.getFertilizer(plot.fertilizerId);
          badges += `<span title="${f ? f.name : 'Đã bón'}">${f ? f.icon : '🧪'}</span>`;
        }

        div.innerHTML = `
          <div class="plot-badges">${badges}</div>
          <div class="plot-icon">${stageIcon}</div>
          <div class="plot-name">${plant.name}</div>
          <div class="plot-status">${ready ? '✨ Ra hoa/quả!' : stage.label + ' · ' + progress + '%'}</div>
          ${!ready ? `<div class="plot-timer"><i class="fa-regular fa-clock"></i> ${Game.formatTime(remain)}</div>` : ''}
          ${!ready ? `<div class="plot-progress"><div class="plot-progress-bar" style="width:${progress}%"></div></div>` : ''}
        `;
        div.addEventListener('click', () => openPlotModal(i));
      }
    }
    grid.appendChild(div);
  });
}

function openPlantModal(plotId) {
  selectedPlotId = plotId;
  const seeds = (currentPlayer.inventory && currentPlayer.inventory.seeds) || {};
  const list = document.getElementById('plant-seed-list');
  list.innerHTML = '';
  const empty = Game.emptyPlotCount();

  const ids = Object.keys(seeds).filter(id => seeds[id] > 0);
  if (ids.length === 0) {
    list.innerHTML = '<p class="empty-state">Bạn chưa có hạt giống nào.<br>Hãy mua ở Cửa hàng!</p>';
  } else {
    const info = document.createElement('p');
    info.style.cssText = 'text-align:center;color:#52796f;font-size:0.9rem;margin-bottom:10px';
    info.textContent = `Ô trống: ${empty} · Chọn hạt và số lượng trồng`;
    list.appendChild(info);

    ids.sort((a, b) => {
      const pa = Game.getPlant(a), pb = Game.getPlant(b);
      return (pa?.type || '').localeCompare(pb?.type || '');
    });
    ids.forEach(id => {
      const plant = Game.getPlant(id);
      if (!plant) return;
      const have = seeds[id];
      const opt = document.createElement('div');
      opt.className = 'seed-option';
      opt.style.flexWrap = 'wrap';
      const maxPlant = Math.min(have, empty);
      let btns = '';
      if (maxPlant >= 1) btns += `<button class="btn btn-primary btn-plant-n" data-id="${id}" data-n="1">Trồng 1</button>`;
      if (maxPlant >= 5) btns += `<button class="btn btn-secondary btn-plant-n" data-id="${id}" data-n="5">Trồng 5</button>`;
      if (maxPlant > 1) btns += `<button class="btn btn-warning btn-plant-n" data-id="${id}" data-n="${maxPlant}">Trồng tất cả (${maxPlant})</button>`;
      if (maxPlant < 1) btns = '<span style="color:#999;font-size:0.85rem">Hết ô trống</span>';
      opt.innerHTML = `
        <span class="icon">${plant.icon}</span>
        <div class="info" style="flex:1">
          <div class="name">${plant.name}</div>
          <div class="qty">Còn ${have.toLocaleString()} hạt · ${Game.formatTime(plant.growTime)}</div>
        </div>
        <div class="plant-btns" style="display:flex;gap:6px;flex-wrap:wrap;width:100%;margin-top:8px;justify-content:flex-end">${btns}</div>
      `;
      list.appendChild(opt);
    });

    list.querySelectorAll('.btn-plant-n').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const n = parseInt(btn.dataset.n, 10);
        const res = await Game.plantMultiple(btn.dataset.id, n);
        showToast(res.msg, res.ok ? 'success' : 'error');
        closeModals();
        renderGarden();
        updateCoins();
      });
    });
  }
  document.getElementById('modal-plant').classList.add('show');
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

  let fertText = 'Chưa bón';
  if (plot.fertilizerId) {
    const f = Game.getFertilizer(plot.fertilizerId);
    fertText = f ? `${f.icon} ${f.name}` : 'Đã bón';
  }

  document.getElementById('plot-title').innerHTML = `${plant.icon} ${plant.name}`;
  document.getElementById('plot-detail').innerHTML = `
    <p><strong>Giai đoạn:</strong> ${ready ? '✨ Sẵn sàng thu hoạch' : stage.label + ' (' + progress + '%)'}</p>
    <p><strong>Thời gian còn:</strong> ${ready ? '0s' : Game.formatTime(remain)}</p>
    <p><strong>Tưới nước:</strong> ${plot.waterCount || 0}/3 ${plot.watered ? '💧' : ''}</p>
    <p><strong>Phân bón:</strong> ${fertText}</p>
    <p><strong>Sản lượng gốc:</strong> ${plant.yield} · Giá bán: ${plant.sellPrice}🪙</p>
    <p style="margin-top:8px;color:#52796f;font-size:0.9rem">${plant.desc || ''}</p>
  `;

  document.getElementById('btn-water').style.display = ready || (plot.waterCount || 0) >= 3 ? 'none' : 'inline-flex';
  document.getElementById('btn-fertilize').style.display = ready || plot.fertilizerId ? 'none' : 'inline-flex';
  document.getElementById('btn-harvest').style.display = ready ? 'inline-flex' : 'none';
  document.getElementById('modal-plot').classList.add('show');
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

document.getElementById('btn-water-all').addEventListener('click', async () => {
  const res = await Game.waterAll();
  showToast(res.msg, 'success');
  renderGarden();
});

document.getElementById('btn-harvest-all').addEventListener('click', async () => {
  const res = await Game.harvestAll();
  showToast(res.msg, res.ok ? 'success' : '');
  renderGarden();
  updateCoins();
});

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
  else if (currentShopTab === 'kytu') plants = plants.filter(p => p.type === 'kytu');

  const q = (document.getElementById('shop-search')?.value || '').trim().toLowerCase();
  if (q) {
    plants = plants.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.id || '').toLowerCase().includes(q) ||
      (p.desc || '').toLowerCase().includes(q)
    );
  }
  return plants;
}

function renderShop() {
  const grid = document.getElementById('shop-grid');
  grid.innerHTML = '';
  const seeds = (currentPlayer && currentPlayer.inventory && currentPlayer.inventory.seeds) || {};

  if (currentShopTab === 'odat') {
    const countEl = document.getElementById('shop-count');
    const price = (currentSettings && currentSettings.plotPrice) || 500;
    const have = currentPlayer?.plots?.length || 0;
    if (countEl) countEl.textContent = 'Mở rộng vườn';
    document.getElementById('shop-pager').innerHTML = '';
    grid.innerHTML = `
      <div class="shop-card shop-plot-card" style="grid-column: 1 / -1; max-width: 320px;">
        <div class="shop-icon">🟫</div>
        <div class="shop-name">Mua thêm ô đất</div>
        <span class="shop-type">Mở rộng vườn</span>
        <div class="shop-meta"><span>Đang có <strong>${have}</strong> ô</span></div>
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
      btn.addEventListener('click', async () => {
        const res = await Game.buyFertilizer(btn.dataset.id);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderShop();
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

  slice.forEach(plant => {
    const have = seeds[plant.id] || 0;
    const card = document.createElement('div');
    card.className = 'shop-card';
    card.innerHTML = `
      <div class="shop-icon">${plant.icon}</div>
      <div class="shop-name">${plant.name}</div>
      <span class="shop-type">${TYPE_LABELS[plant.type] || plant.type}</span>
      <div class="shop-desc">${plant.desc || ''}</div>
      <div class="shop-meta">
        <span><i class="fa-regular fa-clock"></i> ${plant.growTime}s</span>
        <span><i class="fa-solid fa-box"></i> x${plant.yield}</span>
        <span><i class="fa-solid fa-coins"></i> ${plant.sellPrice}</span>
      </div>
      <div class="shop-owned">Bạn có: <strong>${have.toLocaleString()}</strong> hạt</div>
      <div class="shop-price">${plant.seedPrice} 🪙 / hạt</div>
      <div class="buy-qty">
        <input type="number" class="qty-input" min="1" max="9999" value="1" data-id="${plant.id}" />
        <button class="btn btn-primary btn-buy" data-id="${plant.id}"><i class="fa-solid fa-cart-plus"></i> Mua</button>
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

  // Pager
  const pager = document.getElementById('shop-pager');
  if (totalPages <= 1) {
    pager.innerHTML = '';
  } else {
    pager.innerHTML = `
      <button class="btn btn-secondary" id="shop-prev" ${shopPage <= 0 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i> Trước</button>
      <span>Trang ${shopPage + 1} / ${totalPages}</span>
      <button class="btn btn-secondary" id="shop-next" ${shopPage >= totalPages - 1 ? 'disabled' : ''}>Sau <i class="fa-solid fa-chevron-right"></i></button>
    `;
    document.getElementById('shop-prev')?.addEventListener('click', () => { shopPage--; renderShop(); });
    document.getElementById('shop-next')?.addEventListener('click', () => { shopPage++; renderShop(); });
  }
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
  const seeds = (currentPlayer.inventory && currentPlayer.inventory.seeds) || {};
  const ferts = (currentPlayer.inventory && currentPlayer.inventory.fertilizers) || {};
  const harvest = (currentPlayer.inventory && currentPlayer.inventory.harvest) || {};

  // Seeds
  const seedsEl = document.getElementById('inv-seeds');
  const seedIds = Object.keys(seeds).filter(id => seeds[id] > 0);
  if (seedIds.length === 0) {
    seedsEl.innerHTML = '<p class="empty-state">Chưa có hạt giống. Hãy mua ở Cửa hàng!</p>';
  } else {
    seedsEl.innerHTML = '<div class="inv-grid">' + seedIds.map(id => {
      const plant = Game.getPlant(id);
      if (!plant) return '';
      return `
        <div class="inv-item">
          <div class="icon">${plant.icon}</div>
          <div class="name">${plant.name}</div>
          <div class="qty">x${seeds[id].toLocaleString()} hạt</div>
        </div>
      `;
    }).join('') + '</div>';
  }

  // Fertilizers
  const fertEl = document.getElementById('inv-fert');
  const fertIds = Object.keys(ferts).filter(id => ferts[id] > 0);
  if (fertIds.length === 0) {
    fertEl.innerHTML = '<p class="empty-state">Chưa có phân bón. Mua ở Cửa hàng → Phân bón!</p>';
  } else {
    fertEl.innerHTML = '<div class="inv-grid">' + fertIds.map(id => {
      const fert = Game.getFertilizer(id);
      if (!fert) return '';
      return `
        <div class="inv-item">
          <div class="icon">${fert.icon}</div>
          <div class="name">${fert.name}</div>
          <div class="qty">x${ferts[id]} · −${Math.round(fert.timeReduce * 100)}% TG</div>
        </div>
      `;
    }).join('') + '</div>';
  }

  // Harvest
  const harvestEl = document.getElementById('inv-harvest');
  const harvestIds = Object.keys(harvest).filter(id => harvest[id] > 0);
  if (harvestIds.length === 0) {
    harvestEl.innerHTML = '<p class="empty-state">Chưa có sản phẩm thu hoạch.</p>';
  } else {
    harvestEl.innerHTML = `
      <div style="margin-bottom:16px">
        <button class="btn btn-success" id="btn-sell-all"><i class="fa-solid fa-coins"></i> Bán tất cả</button>
      </div>
      <div class="inv-grid">
        ${harvestIds.map(id => {
          const plant = Game.getPlant(id);
          if (!plant) return '';
          const qty = harvest[id];
          return `
            <div class="inv-item">
              <div class="icon">${plant.icon}</div>
              <div class="name">${plant.name}</div>
              <div class="qty">x${qty} · ${plant.sellPrice}🪙/cái</div>
              <div class="actions">
                <button class="btn btn-success btn-sell-one" data-id="${id}">Bán 1</button>
                <button class="btn btn-primary btn-sell-all-one" data-id="${id}">Bán hết</button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    document.getElementById('btn-sell-all')?.addEventListener('click', async () => {
      const res = await Game.sellAllHarvest();
      showToast(res.msg, 'success');
      updateCoins();
      renderInventory();
    });

    document.querySelectorAll('.btn-sell-one').forEach(btn => {
      btn.addEventListener('click', async () => {
        const res = await Game.sellHarvest(btn.dataset.id, 1);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderInventory();
      });
    });

    document.querySelectorAll('.btn-sell-all-one').forEach(btn => {
      btn.addEventListener('click', async () => {
        const qty = (currentPlayer.inventory.harvest[btn.dataset.id]) || 0;
        const res = await Game.sellHarvest(btn.dataset.id, qty);
        showToast(res.msg, res.ok ? 'success' : 'error');
        updateCoins();
        renderInventory();
      });
    });
  }
}

// ===== STATS =====
function renderStats() {
  if (!currentPlayer) return;
  const s = currentPlayer.stats || {};
  const plots = Array.isArray(currentPlayer.plots) ? currentPlayer.plots : Object.values(currentPlayer.plots || {});
  const xpNext = Game.xpForLevel(currentPlayer.level || 1);

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
  `;

  const actList = document.getElementById('activity-list');
  const acts = currentPlayer.activity || [];
  if (acts.length === 0) {
    actList.innerHTML = '<li style="color:#999">Chưa có hoạt động nào.</li>';
  } else {
    actList.innerHTML = acts.slice(0, 30).map(a =>
      `<li><span class="time">${a.time || ''}</span><span>${a.text}</span></li>`
    ).join('');
  }
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

// Live update + occasional rain check
setInterval(() => {
  const gardenPage = document.getElementById('page-garden');
  if (gardenPage && gardenPage.classList.contains('active') && currentPlayer) {
    renderGarden();
  }
}, 1000);

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

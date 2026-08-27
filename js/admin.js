// ===== ADMIN PANEL (Firebase) =====

function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// Auth check
auth.onAuthStateChanged(async (user) => {
  const loading = document.getElementById('admin-loading');
  const dash = document.getElementById('admin-dashboard');
  const status = document.getElementById('admin-status');

  if (!user) {
    status.textContent = 'Bạn chưa đăng nhập. Vui lòng đăng nhập trước.';
    status.innerHTML += '<br><br><a href="../" class="back-link">← Đăng nhập</a>';
    return;
  }

  currentUser = user;
  try {
    await initGlobalData();
    await loadPlayer(user.uid, user.email);

    if (!isAdmin) {
      status.textContent = '⛔ Bạn không có quyền Admin.';
      status.innerHTML += '<br><br><a href="../" class="back-link">← Quay lại vườn</a>';
      return;
    }

    loading.style.display = 'none';
    dash.classList.remove('hidden');
    renderDashboard();
  } catch (e) {
    console.error(e);
    status.textContent = 'Lỗi: ' + e.message;
  }
});

// Sidebar
document.querySelectorAll('.side-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.side-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('sec-' + btn.dataset.section).classList.add('active');

    if (btn.dataset.section === 'dashboard') renderDashboard();
    if (btn.dataset.section === 'plants') renderPlantsTable();
    if (btn.dataset.section === 'users') renderUsers();
    if (btn.dataset.section === 'giftcodes') renderGiftCodes();
    if (btn.dataset.section === 'settings') renderSettings();
    if (btn.dataset.section === 'announce') renderAnnounce();
  });
});

async function renderDashboard() {
  await refreshPlants();
  const usersSnap = await db.ref('users').once('value');
  const users = usersSnap.val() || {};
  const userList = Object.values(users);

  let totalCoins = 0, totalPlanted = 0, totalHarvested = 0;
  const allActivity = [];
  userList.forEach(u => {
    totalCoins += u.coins || 0;
    totalPlanted += (u.stats && u.stats.planted) || 0;
    totalHarvested += (u.stats && u.stats.harvested) || 0;
    if (u.activity) {
      u.activity.forEach(a => allActivity.push({ ...a, email: u.email }));
    }
  });
  allActivity.sort((a, b) => (b.time || '').localeCompare(a.time || ''));

  document.getElementById('admin-stats').innerHTML = `
    <div class="admin-stat"><div class="value">${currentPlants.length}</div><div class="label">Loại cây</div></div>
    <div class="admin-stat"><div class="value">${userList.length}</div><div class="label">Người chơi</div></div>
    <div class="admin-stat"><div class="value">${totalCoins.toLocaleString()}</div><div class="label">Tổng tiền</div></div>
    <div class="admin-stat"><div class="value">${totalPlanted}</div><div class="label">Đã trồng</div></div>
    <div class="admin-stat"><div class="value">${totalHarvested}</div><div class="label">Đã thu hoạch</div></div>
    <div class="admin-stat"><div class="value">${currentSettings.plotCount}</div><div class="label">Ô đất mặc định</div></div>
  `;

  window._adminActivity = allActivity;
  window._adminActPage = 0;
  renderActivityPage();
}

function renderActivityPage() {
  const all = window._adminActivity || [];
  const pageSize = 10;
  const page = window._adminActPage || 0;
  const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
  const slice = all.slice(page * pageSize, (page + 1) * pageSize);
  const log = document.getElementById('activity-log');
  if (!log) return;
  if (slice.length) {
    log.innerHTML = slice.map(a =>
      `<li><strong>${a.time || ''}</strong> [${a.email || '?'}] — ${a.text}</li>`
    ).join('');
  } else {
    log.innerHTML = '<li>Chưa có hoạt động nào.</li>';
  }
  const pager = document.getElementById('activity-pager');
  if (!pager) return;
  if (all.length <= pageSize) {
    pager.innerHTML = all.length ? `<span>${all.length} hoạt động</span>` : '';
    return;
  }
  pager.innerHTML = `
    <button class="btn btn-secondary btn-sm" id="act-prev" ${page <= 0 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>
    <span>Trang ${page + 1}/${totalPages} (${all.length})</span>
    <button class="btn btn-secondary btn-sm" id="act-next" ${page >= totalPages - 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>
  `;
  document.getElementById('act-prev')?.addEventListener('click', () => {
    window._adminActPage = Math.max(0, page - 1);
    renderActivityPage();
  });
  document.getElementById('act-next')?.addEventListener('click', () => {
    window._adminActPage = Math.min(totalPages - 1, page + 1);
    renderActivityPage();
  });
}

function renderPlantsTable() {
  const tbody = document.querySelector('#plants-table tbody');
  const pager = document.getElementById('plants-pager');
  const pageSize = 50;
  const q = (document.getElementById('admin-plant-search')?.value || '').trim().toLowerCase();
  let all = currentPlants || [];
  if (q) {
    all = all.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.id || '').toLowerCase().includes(q) ||
      (p.type || '').toLowerCase().includes(q)
    );
  }
  if (window._adminPlantsPage == null) window._adminPlantsPage = 0;
  const totalPages = Math.max(1, Math.ceil(all.length / pageSize));
  if (window._adminPlantsPage >= totalPages) window._adminPlantsPage = totalPages - 1;
  if (window._adminPlantsPage < 0) window._adminPlantsPage = 0;
  const page = window._adminPlantsPage;
  const slice = all.slice(page * pageSize, (page + 1) * pageSize);

  tbody.innerHTML = slice.map(p => `
    <tr>
      <td style="font-size:1.5rem">${p.icon}</td>
      <td><strong>${p.name}</strong></td>
      <td>${TYPE_LABELS[p.type] || p.type}</td>
      <td>${p.seedPrice}🪙</td>
      <td>${p.growTime}s</td>
      <td>x${p.yield}</td>
      <td>${p.sellPrice}🪙</td>
      <td class="actions">
        <button class="btn btn-primary btn-edit" data-id="${p.id}">Sửa</button>
        <button class="btn btn-danger btn-delete" data-id="${p.id}">Xóa</button>
      </td>
    </tr>
  `).join('');

  document.querySelectorAll('#plants-table .btn-edit').forEach(btn => {
    btn.addEventListener('click', () => openPlantForm(btn.dataset.id));
  });
  document.querySelectorAll('#plants-table .btn-delete').forEach(btn => {
    btn.addEventListener('click', () => deletePlant(btn.dataset.id));
  });

  if (!pager) return;
  if (all.length <= pageSize) {
    pager.innerHTML = all.length ? `<span>${all.length} loại cây</span>` : '';
    return;
  }
  pager.innerHTML = `
    <button class="btn btn-secondary btn-sm" id="plants-prev" ${page <= 0 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>
    <span>Trang ${page + 1}/${totalPages} · ${all.length} loại · 50/trang</span>
    <button class="btn btn-secondary btn-sm" id="plants-next" ${page >= totalPages - 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>
  `;
  document.getElementById('plants-prev')?.addEventListener('click', () => {
    window._adminPlantsPage = Math.max(0, page - 1);
    renderPlantsTable();
  });
  document.getElementById('plants-next')?.addEventListener('click', () => {
    window._adminPlantsPage = Math.min(totalPages - 1, page + 1);
    renderPlantsTable();
  });
}

document.getElementById('btn-add-plant').addEventListener('click', () => openPlantForm(null));

function openPlantForm(id) {
  document.getElementById('plant-form').reset();
  document.getElementById('plant-id').value = '';

  if (id) {
    const plant = currentPlants.find(p => p.id === id);
    if (!plant) return;
    document.getElementById('form-title').textContent = 'Sửa cây: ' + plant.name;
    document.getElementById('plant-id').value = plant.id;
    document.getElementById('p-icon').value = plant.icon;
    document.getElementById('p-name').value = plant.name;
    document.getElementById('p-type').value = plant.type;
    document.getElementById('p-seed-price').value = plant.seedPrice;
    document.getElementById('p-grow-time').value = plant.growTime;
    document.getElementById('p-yield').value = plant.yield;
    document.getElementById('p-sell-price').value = plant.sellPrice;
    document.getElementById('p-desc').value = plant.desc || '';
    document.getElementById('p-limited').checked = !!plant.limited;
    document.getElementById('p-months').value = Array.isArray(plant.availableMonths) ? plant.availableMonths.join(',') : '';
  } else {
    document.getElementById('form-title').textContent = 'Thêm cây mới';
    document.getElementById('p-limited').checked = false;
    document.getElementById('p-months').value = '';
  }
  document.getElementById('modal-plant-form').classList.add('show');
}

document.getElementById('plant-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('plant-id').value;
  const monthsRaw = (document.getElementById('p-months').value || '').trim();
  const availableMonths = monthsRaw
    ? monthsRaw.split(/[,;\s]+/).map(x => parseInt(x, 10)).filter(n => n >= 1 && n <= 12)
    : [];
  const data = {
    id: id || ('plant-' + Date.now()),
    icon: document.getElementById('p-icon').value.trim(),
    name: document.getElementById('p-name').value.trim(),
    type: document.getElementById('p-type').value,
    seedPrice: parseInt(document.getElementById('p-seed-price').value),
    growTime: parseInt(document.getElementById('p-grow-time').value),
    yield: parseInt(document.getElementById('p-yield').value),
    sellPrice: parseInt(document.getElementById('p-sell-price').value),
    desc: document.getElementById('p-desc').value.trim(),
    limited: !!document.getElementById('p-limited').checked,
    availableMonths
  };

  if (id) {
    const idx = currentPlants.findIndex(p => p.id === id);
    if (idx >= 0) currentPlants[idx] = data;
  } else {
    currentPlants.push(data);
  }

  await savePlants();
  document.getElementById('modal-plant-form').classList.remove('show');
  showToast(id ? 'Đã cập nhật cây!' : 'Đã thêm cây mới!', 'success');
  renderPlantsTable();
});

async function deletePlant(id) {
  if (!confirm('Xóa cây này?')) return;
  currentPlants = currentPlants.filter(p => p.id !== id);
  await savePlants();
  showToast('Đã xóa cây!', 'success');
  renderPlantsTable();
}

document.querySelectorAll('.modal-close').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', e => {
    if (e.target === modal) modal.classList.remove('show');
  });
});

// Users
async function renderUsers() {
  const snap = await db.ref('users').once('value');
  const users = snap.val() || {};
  const tbody = document.querySelector('#users-table tbody');

  tbody.innerHTML = Object.keys(users).map(uid => {
    const u = users[uid];
    const banned = !!u.banned;
    return `
      <tr style="${banned ? 'opacity:0.65' : ''}">
        <td>${u.email || uid}${banned ? ' <span style="color:#e63946">[BAN]</span>' : ''}</td>
        <td><strong style="color:${u.role === 'admin' ? '#e63946' : '#2d6a4f'}">${u.role || 'user'}</strong></td>
        <td>${(u.coins || 0).toLocaleString()}🪙</td>
        <td>${(u.stats && u.stats.planted) || 0}</td>
        <td>${(u.stats && u.stats.harvested) || 0}</td>
        <td class="actions">
          <button class="btn btn-primary btn-add-coins" data-uid="${uid}">+ Tiền</button>
          <button class="btn btn-secondary btn-add-plots" data-uid="${uid}">+ Ô thường</button>
          ${u.role !== 'admin' ? `<button class="btn btn-success btn-make-admin" data-uid="${uid}">Set Admin</button>` : ''}
          ${u.role === 'admin' && uid !== currentUser.uid ? `<button class="btn btn-secondary btn-remove-admin" data-uid="${uid}">Bỏ Admin</button>` : ''}
          ${uid !== currentUser.uid ? (banned
            ? `<button class="btn btn-success btn-unban" data-uid="${uid}">Unban</button>`
            : `<button class="btn btn-danger btn-ban" data-uid="${uid}">Ban</button>`) : ''}
        </td>
      </tr>
    `;
  }).join('') || '<tr><td colspan="6">Chưa có người chơi.</td></tr>';

  document.querySelectorAll('.btn-add-coins').forEach(btn => {
    btn.addEventListener('click', async () => {
      const amount = parseInt(prompt('Số tiền cộng thêm:', '500'));
      if (!amount || amount <= 0) return;
      const ref = db.ref('users/' + btn.dataset.uid);
      const snap = await ref.once('value');
      const u = snap.val();
      if (!u) return;
      u.coins = (u.coins || 0) + amount;
      if (!u.activity) u.activity = [];
      u.activity.unshift({ text: `Admin cộng ${amount}🪙`, time: new Date().toLocaleString('vi-VN') });
      if (u.activity.length > 30) u.activity = u.activity.slice(0, 30);
      await ref.set(u);
      showToast(`Đã cộng ${amount}🪙!`, 'success');
      renderUsers();
    });
  });

  document.querySelectorAll('.btn-add-plots').forEach(btn => {
    btn.addEventListener('click', async () => {
      const n = parseInt(prompt('Số ô đất thường thêm:', '1'), 10);
      if (!n || n < 1) return;
      const ref = db.ref('users/' + btn.dataset.uid);
      const snap = await ref.once('value');
      const u = snap.val();
      if (!u) return;
      if (!Array.isArray(u.plots)) u.plots = Object.values(u.plots || {});
      for (let i = 0; i < n; i++) {
        u.plots.push({
          id: u.plots.length, plantId: null, plantedAt: null,
          watered: false, waterCount: 0, lastWatered: null,
          fertilizerId: null, fertilizedAt: null
        });
      }
      if (!u.activity) u.activity = [];
      u.activity.unshift({ text: `Admin thêm ${n} ô đất thường`, time: new Date().toLocaleString('vi-VN') });
      if (u.activity.length > 30) u.activity = u.activity.slice(0, 30);
      await ref.set(u);
      showToast(`Đã thêm ${n} ô thường (tổng ${u.plots.length} ô)!`, 'success');
      renderUsers();
    });
  });

  document.querySelectorAll('.btn-add-special').forEach(btn => {
    btn.addEventListener('click', async () => {
      const n = parseInt(prompt('Số ô đặc biệt thêm:', '1'), 10);
      if (!n || n < 1) return;
      const multStr = prompt('Hệ số tăng tốc (1.5 / 2 / 3 / 5):', '2');
      const mult = parseFloat(multStr);
      if (!mult || mult < 1.1) { showToast('Hệ số không hợp lệ!', 'error'); return; }
      const ref = db.ref('users/' + btn.dataset.uid);
      const snap = await ref.once('value');
      const u = snap.val();
      if (!u) return;
      if (!Array.isArray(u.plots)) u.plots = Object.values(u.plots || {});
      for (let i = 0; i < n; i++) {
        u.plots.push({
          id: u.plots.length, plantId: null, plantedAt: null,
          watered: false, waterCount: 0, lastWatered: null,
          fertilizerId: null, fertilizedAt: null,
          specialMult: mult,
          specialId: 'admin-boost-' + mult,
          specialName: 'Ô đặc biệt x' + mult
        });
      }
      if (!u.activity) u.activity = [];
      u.activity.unshift({ text: `Admin thêm ${n} ô đặc biệt x${mult}`, time: new Date().toLocaleString('vi-VN') });
      if (u.activity.length > 30) u.activity = u.activity.slice(0, 30);
      await ref.set(u);
      showToast(`Đã thêm ${n} ô đặc biệt x${mult}!`, 'success');
      renderUsers();
    });
  });

  document.querySelectorAll('.btn-make-admin').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Cấp quyền Admin cho user này?')) return;
      await db.ref('users/' + btn.dataset.uid + '/role').set('admin');
      showToast('Đã cấp Admin!', 'success');
      renderUsers();
    });
  });

  document.querySelectorAll('.btn-remove-admin').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Gỡ quyền Admin?')) return;
      await db.ref('users/' + btn.dataset.uid + '/role').set('user');
      showToast('Đã gỡ Admin!', 'success');
      renderUsers();
    });
  });

  document.querySelectorAll('.btn-ban').forEach(btn => {
    btn.addEventListener('click', async () => {
      const reason = prompt('Lý do ban:', 'Vi phạm quy định') || 'Bị khóa bởi admin';
      if (!confirm('Ban tài khoản này?')) return;
      await db.ref('users/' + btn.dataset.uid).update({ banned: true, banReason: reason });
      showToast('Đã ban user!', 'success');
      renderUsers();
    });
  });
  document.querySelectorAll('.btn-unban').forEach(btn => {
    btn.addEventListener('click', async () => {
      await db.ref('users/' + btn.dataset.uid).update({ banned: false, banReason: null });
      showToast('Đã gỡ ban!', 'success');
      renderUsers();
    });
  });
}

function renderSettings() {
  document.getElementById('set-plots').value = currentSettings.plotCount || 12;
  document.getElementById('set-coins').value = currentSettings.startCoins || 1000;
  const rainEl = document.getElementById('set-rain');
  if (rainEl) rainEl.value = currentSettings.rainChance ?? 15;
  const mOn = document.getElementById('set-maint-on');
  if (mOn) mOn.checked = !!currentSettings.maintenanceOn;
  const mMsg = document.getElementById('set-maint-msg');
  if (mMsg) mMsg.value = currentSettings.maintenanceMsg || '';
}

document.getElementById('btn-save-settings').addEventListener('click', async () => {
  currentSettings.plotCount = parseInt(document.getElementById('set-plots').value) || 12;
  currentSettings.startCoins = parseInt(document.getElementById('set-coins').value) || 1000;
  const rainEl = document.getElementById('set-rain');
  if (rainEl) {
    let r = parseInt(rainEl.value, 10);
    if (isNaN(r)) r = 15;
    currentSettings.rainChance = Math.max(0, Math.min(100, r));
  }
  currentSettings.maintenanceOn = !!document.getElementById('set-maint-on')?.checked;
  currentSettings.maintenanceMsg = (document.getElementById('set-maint-msg')?.value || '').trim()
    || 'Hệ thống đang bảo trì. Vui lòng quay lại sau.';
  await saveSettings();
  showToast('Đã lưu cài đặt!' + (currentSettings.maintenanceOn ? ' (Bảo trì BẬT)' : ''), 'success');
});

async function renderGiftCodes() {
  const tbody = document.querySelector('#giftcodes-table tbody');
  if (!tbody) return;
  const snap = await db.ref('giftCodes').once('value');
  const all = snap.val() || {};
  const keys = Object.keys(all);
  tbody.innerHTML = keys.map(code => {
    const g = all[code];
    const exp = g.expiresAt ? new Date(g.expiresAt).toLocaleDateString('vi-VN') : '∞';
    const rewards = [];
    if (g.coins) rewards.push(g.coins + '🪙');
    if (g.plots) rewards.push('+' + g.plots + ' ô');
    if (g.fert) rewards.push('+' + g.fert + ' phân');
    if (g.fairyDays) rewards.push(g.fairyDays + 'd Tiên');
    if (g.nycDays) rewards.push(g.nycDays + 'd NYC');
    return `<tr>
      <td><strong>${code}</strong></td>
      <td>${rewards.join(' · ') || '—'}</td>
      <td>${g.usedCount || 0}</td>
      <td>${g.maxUses || '∞'}</td>
      <td>${exp}</td>
      <td><button class="btn btn-danger btn-sm btn-del-gc" data-code="${code}">Xóa</button></td>
    </tr>`;
  }).join('') || '<tr><td colspan="6">Chưa có gift code.</td></tr>';
  tbody.querySelectorAll('.btn-del-gc').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (!confirm('Xóa mã ' + btn.dataset.code + '?')) return;
      await db.ref('giftCodes/' + btn.dataset.code).remove();
      renderGiftCodes();
    });
  });
}

document.getElementById('btn-create-gc')?.addEventListener('click', async () => {
  const code = (document.getElementById('gc-code')?.value || '').trim().toUpperCase();
  if (!code) { showToast('Nhập mã!', 'error'); return; }
  const coins = parseInt(document.getElementById('gc-coins')?.value, 10) || 0;
  const plots = parseInt(document.getElementById('gc-plots')?.value, 10) || 0;
  const fert = parseInt(document.getElementById('gc-fert')?.value, 10) || 0;
  const fairyDays = parseInt(document.getElementById('gc-fairy-days')?.value, 10) || 0;
  const nycDays = parseInt(document.getElementById('gc-nyc-days')?.value, 10) || 0;
  const maxUses = parseInt(document.getElementById('gc-max')?.value, 10) || 0;
  const days = parseInt(document.getElementById('gc-days')?.value, 10) || 0;
  if (!coins && !plots && !fert && !fairyDays && !nycDays) {
    showToast('Chọn ít nhất 1 phần thưởng!', 'error');
    return;
  }
  await db.ref('giftCodes/' + code).set({
    coins, plots, fert, fairyDays, nycDays,
    maxUses,
    usedCount: 0,
    expiresAt: days > 0 ? Date.now() + days * 86400000 : null,
    createdAt: Date.now()
  });
  showToast('Đã tạo mã ' + code, 'success');
  document.getElementById('gc-code').value = '';
  renderGiftCodes();
});

document.getElementById('admin-plant-search')?.addEventListener('input', () => {
  window._adminPlantsPage = 0;
  renderPlantsTable();
});

async function renderAnnounce() {
  const el = document.getElementById('announce-current');
  if (!el) return;
  try {
    const snap = await db.ref('announcements/latest').once('value');
    const v = snap.val();
    if (!v || !v.text) {
      el.textContent = 'Chưa có thông báo đang hiện.';
      return;
    }
    el.innerHTML = `<strong>Đang hiện:</strong> ${v.text}<br><small>${v.at ? new Date(v.at).toLocaleString('vi-VN') : ''}</small>`;
  } catch (e) {
    el.textContent = 'Lỗi đọc: ' + e.message;
  }
}

document.getElementById('btn-send-announce')?.addEventListener('click', async () => {
  const text = (document.getElementById('announce-text')?.value || '').trim();
  if (!text) {
    showToast('Nhập nội dung thông báo!', 'error');
    return;
  }
  try {
    await db.ref('announcements/latest').set({
      text,
      at: Date.now(),
      by: (currentUser && currentUser.email) || 'admin'
    });
    showToast('Đã gửi thông báo toàn server!', 'success');
    document.getElementById('announce-text').value = '';
    renderAnnounce();
  } catch (e) {
    showToast('Lỗi: ' + e.message + ' (cập nhật Rules?)', 'error');
  }
});

document.getElementById('btn-clear-announce')?.addEventListener('click', async () => {
  try {
    await db.ref('announcements/latest').remove();
    showToast('Đã xóa banner thông báo', 'success');
    renderAnnounce();
  } catch (e) {
    showToast('Lỗi: ' + e.message, 'error');
  }
});

// Mobile sidebar toggle — ẩn nút 3 gạch khi menu đang mở
function setAdminSidebar(open) {
  document.getElementById('admin-sidebar')?.classList.toggle('open', open);
  document.getElementById('admin-backdrop')?.classList.toggle('show', open);
  document.getElementById('admin-menu-btn')?.classList.toggle('hidden', open);
}
document.getElementById('admin-menu-btn')?.addEventListener('click', () => {
  const open = !document.getElementById('admin-sidebar')?.classList.contains('open');
  setAdminSidebar(open);
});
document.getElementById('admin-backdrop')?.addEventListener('click', () => setAdminSidebar(false));
document.querySelectorAll('.side-btn').forEach(btn => {
  btn.addEventListener('click', () => setAdminSidebar(false));
});

document.getElementById('btn-reset-plants').addEventListener('click', async () => {
  if (!confirm('Reset danh sách cây về mặc định?')) return;
  currentPlants = JSON.parse(JSON.stringify(DEFAULT_PLANTS));
  await savePlants();
  showToast('Đã reset danh sách cây!', 'success');
});

/* Pill dropdown cho admin select */
(function () {
  const CHECK = '<svg class="pill-dd-check" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>';
  const ARROW = '<svg class="pill-dd-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>';

  function closeAll(except) {
    document.querySelectorAll('.pill-dd.open').forEach(dd => {
      if (except && dd === except) return;
      dd.classList.remove('open');
      const m = dd.querySelector('.pill-dd-menu');
      const t = dd.querySelector('.pill-dd-trigger');
      if (m) m.hidden = true;
      if (t) t.setAttribute('aria-expanded', 'false');
    });
  }
  document.addEventListener('click', e => { if (!e.target.closest('.pill-dd')) closeAll(); });

  function mount(select, prefix) {
    if (!select || select.dataset.pillMounted === '1') {
      if (select && select._pillRefresh) select._pillRefresh();
      return;
    }
    const wrap = document.createElement('div');
    wrap.className = 'pill-dd';
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'pill-dd-trigger';
    const menu = document.createElement('div');
    menu.className = 'pill-dd-menu';
    menu.hidden = true;
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(trigger);
    wrap.appendChild(menu);
    wrap.appendChild(select);
    select.classList.add('pill-dd-native');
    select.dataset.pillMounted = '1';

    const labelOf = () => {
      const o = select.options[select.selectedIndex];
      return o ? (o.textContent || '').trim() : '—';
    };
    const update = () => {
      trigger.innerHTML = '<span><span class="pill-dd-prefix">' + (prefix || '') + '</span>' + labelOf() + '</span>' + ARROW;
    };
    const rebuild = () => {
      menu.innerHTML = '';
      Array.from(select.options).forEach((opt, idx) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'pill-dd-item' + (idx === select.selectedIndex ? ' active' : '');
        btn.innerHTML = '<span>' + (opt.textContent || opt.value) + '</span>' + CHECK;
        btn.addEventListener('click', e => {
          e.stopPropagation();
          select.value = opt.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          update(); rebuild(); closeAll();
        });
        menu.appendChild(btn);
      });
    };
    select._pillRefresh = () => { update(); rebuild(); };
    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const open = menu.hidden;
      closeAll();
      if (open) { rebuild(); menu.hidden = false; wrap.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); }
    });
    update(); rebuild();
  }

  const _open = typeof openPlantForm === 'function' ? openPlantForm : null;
  if (_open) {
    window.openPlantForm = function () {
      _open.apply(this, arguments);
      setTimeout(() => mount(document.getElementById('p-type'), 'Loại cây: '), 0);
    };
  }
  document.addEventListener('DOMContentLoaded', () => {
    mount(document.getElementById('p-type'), 'Loại cây: ');
  });
})();

/* Theme dark/light đồng bộ với index (localStorage vx-theme) */
(function () {
  function applyTheme(mode) {
    const root = document.documentElement;
    const ic = document.getElementById('theme-icon');
    if (mode === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (ic) ic.className = 'fa-solid fa-sun';
    } else {
      root.removeAttribute('data-theme');
      if (ic) ic.className = 'fa-solid fa-moon';
    }
    try { localStorage.setItem('vx-theme', mode); } catch (_) {}
  }
  let mode = 'light';
  try { mode = localStorage.getItem('vx-theme') || 'light'; } catch (_) {}
  applyTheme(mode === 'dark' ? 'dark' : 'light');
  document.getElementById('btn-theme')?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });
})();

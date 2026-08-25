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
    status.innerHTML += '<br><br><a href="../index.html" class="back-link">← Đăng nhập</a>';
    return;
  }

  currentUser = user;
  try {
    await initGlobalData();
    await loadPlayer(user.uid, user.email);

    if (!isAdmin) {
      status.textContent = '⛔ Bạn không có quyền Admin.';
      status.innerHTML += '<br><br><a href="../index.html" class="back-link">← Quay lại vườn</a>';
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
    if (btn.dataset.section === 'settings') renderSettings();
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
  const pageSize = 15;
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
  const all = currentPlants || [];
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
  } else {
    document.getElementById('form-title').textContent = 'Thêm cây mới';
  }
  document.getElementById('modal-plant-form').classList.add('show');
}

document.getElementById('plant-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('plant-id').value;
  const data = {
    id: id || ('plant-' + Date.now()),
    icon: document.getElementById('p-icon').value.trim(),
    name: document.getElementById('p-name').value.trim(),
    type: document.getElementById('p-type').value,
    seedPrice: parseInt(document.getElementById('p-seed-price').value),
    growTime: parseInt(document.getElementById('p-grow-time').value),
    yield: parseInt(document.getElementById('p-yield').value),
    sellPrice: parseInt(document.getElementById('p-sell-price').value),
    desc: document.getElementById('p-desc').value.trim()
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
    return `
      <tr>
        <td>${u.email || uid}</td>
        <td><strong style="color:${u.role === 'admin' ? '#e63946' : '#2d6a4f'}">${u.role || 'user'}</strong></td>
        <td>${(u.coins || 0).toLocaleString()}🪙</td>
        <td>${(u.stats && u.stats.planted) || 0}</td>
        <td>${(u.stats && u.stats.harvested) || 0}</td>
        <td class="actions">
          <button class="btn btn-primary btn-add-coins" data-uid="${uid}">+ Tiền</button>
          ${u.role !== 'admin' ? `<button class="btn btn-success btn-make-admin" data-uid="${uid}">Set Admin</button>` : ''}
          ${u.role === 'admin' && uid !== currentUser.uid ? `<button class="btn btn-secondary btn-remove-admin" data-uid="${uid}">Bỏ Admin</button>` : ''}
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
      await ref.set(u);
      showToast(`Đã cộng ${amount}🪙!`, 'success');
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
}

function renderSettings() {
  document.getElementById('set-plots').value = currentSettings.plotCount || 12;
  document.getElementById('set-coins').value = currentSettings.startCoins || 1000;
  const rainEl = document.getElementById('set-rain');
  if (rainEl) rainEl.value = currentSettings.rainChance ?? 15;
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
  await saveSettings();
  showToast('Đã lưu cài đặt!', 'success');
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

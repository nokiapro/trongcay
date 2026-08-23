// Admin panel - quản lý toàn bộ
async function openAdmin() {
  if (!isAdmin) {
    await Dialog.warn('Bạn không phải admin');
    return;
  }
  let html = `<button class="modal-close" onclick="closeModal()">✕</button>
    <h2>🛡️ Admin Panel</h2>
    <div class="tabs">
      <button class="tab-btn active" onclick="adminTab('users',this)">Users</button>
      <button class="tab-btn" onclick="adminTab('items',this)">Vật phẩm</button>
      <button class="tab-btn" onclick="adminTab('reports',this)">Báo cáo</button>
      <button class="tab-btn" onclick="adminTab('tools',this)">Công cụ</button>
    </div>
    <div id="adminBody"><p style="text-align:center">Đang tải…</p></div>`;
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('show');
  adminTab('users');
}

async function adminTab(tab, btn) {
  if (btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const body = document.getElementById('adminBody');
  if (!body) return;

  if (tab === 'users') {
    body.innerHTML = '<p style="text-align:center">Đang tải users…</p>';
    try {
      const snap = await db.ref('leaderboard').limitToLast(40).once('value');
      const data = snap.val() || {};
      const list = Object.entries(data).map(([uid, v]) => ({ uid, ...v }));
      list.sort((a, b) => (b.totalWater || 0) - (a.totalWater || 0));
      let html = `<p style="font-size:0.8rem;color:#666;margin-bottom:10px">${list.length} người chơi</p>`;
      list.forEach(u => {
        html += `<div class="list-item">
          <div>${u.avatar || '🌿'} <b>${u.name || 'Ẩn'}</b><br>
            <span style="font-size:0.72rem;color:#666">${u.totalWater || 0} tưới • ${u.fruits || 0} quả • ${u.uid.slice(0, 8)}…</span>
          </div>
          <div style="display:flex;flex-direction:column;gap:4px">
            <button class="btn-secondary" style="padding:4px 8px;font-size:0.72rem" onclick="adminEditUser('${u.uid}','${(u.name||'').replace(/'/g,'')}')">✏️ Sửa</button>
            <button class="btn-danger" style="padding:4px 8px;font-size:0.72rem" onclick="adminReset('${u.uid}')">Reset</button>
          </div>
        </div>`;
      });
      body.innerHTML = html || '<p style="text-align:center;color:#888">Chưa có user</p>';
    } catch (e) {
      body.innerHTML = '<p style="color:red">Lỗi: ' + e.message + '</p>';
    }
  }

  if (tab === 'items') {
    body.innerHTML = `
      <div class="admin-section admin-form">
        <h4>🍎 Cấp / chỉnh quả & phân cho user</h4>
        <input id="grantUid" placeholder="UID người chơi" />
        <input id="grantFert" type="number" placeholder="Số phân (+ hoặc -)" />
        <input id="grantFruit" type="number" placeholder="Số quả (+ hoặc -)" />
        <input id="grantWater" type="number" placeholder="Số lần tưới (+ hoặc -)" />
        <button class="btn-secondary" style="width:100%;justify-content:center" onclick="adminGrantCustom()">Áp dụng</button>
      </div>
      <div class="admin-section admin-form">
        <h4>🎁 Cấp nhanh cho chính bạn</h4>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button class="btn-secondary" onclick="adminSelfGrant(5,0)">+5 phân</button>
          <button class="btn-secondary" onclick="adminSelfGrant(0,10)">+10 quả</button>
          <button class="btn-secondary" onclick="adminSelfGrant(10,20)">+10 phân +20 quả</button>
        </div>
      </div>
      <div class="admin-section admin-form">
        <h4>🌳 Mở khóa cây cho user</h4>
        <input id="unlockUid" placeholder="UID người chơi" />
        <select id="unlockTree">
          ${TREE_TYPES.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
        </select>
        <button class="btn-secondary" style="width:100%;justify-content:center" onclick="adminUnlockTree()">Mở khóa</button>
      </div>
      <div class="admin-section admin-form">
        <h4>🌳 Thêm cây tùy chỉnh (toàn server)</h4>
        <input id="customTreeName" placeholder="Tên cây" />
        <input id="customTreeEmoji" placeholder="Emoji (vd: 🌳)" maxlength="4" />
        <input id="customTreeUnlock" type="number" placeholder="Mở khóa tại N lần tưới" value="0" />
        <button class="btn-secondary" style="width:100%;justify-content:center" onclick="adminAddCustomTree()">Thêm cây</button>
      </div>
      <div class="admin-section admin-form">
        <h4>✨ Thêm vật phẩm shop (toàn server)</h4>
        <input id="customItemName" placeholder="Tên vật phẩm" />
        <input id="customItemPrice" type="number" placeholder="Giá (quả)" value="10" />
        <input id="customItemFert" type="number" placeholder="Cho bao nhiêu phân" value="0" />
        <input id="customItemFruit" type="number" placeholder="Cho bao nhiêu quả" value="0" />
        <button class="btn-secondary" style="width:100%;justify-content:center" onclick="adminAddCustomItem()">Thêm vật phẩm</button>
      </div>
      <div class="admin-section admin-form">
        <h4>🏺 Cấp chậu / theme</h4>
        <input id="decorUid" placeholder="UID người chơi" />
        <select id="decorType">
          <option value="pot:wood">Chậu gỗ</option>
          <option value="pot:gold">Chậu vàng</option>
          <option value="pot:crystal">Chậu pha lê</option>
          <option value="theme:sakura">Theme Sakura</option>
          <option value="theme:autumn">Theme Thu</option>
          <option value="theme:winter">Theme Đông</option>
          <option value="theme:night-garden">Theme Vườn đêm</option>
        </select>
        <button class="btn-secondary" style="width:100%;justify-content:center" onclick="adminGrantDecor()">Cấp</button>
      </div>
    `;
  }

  if (tab === 'reports') {
    body.innerHTML = '<p style="text-align:center">Đang tải báo cáo…</p>';
    try {
      const snap = await db.ref('reports').orderByChild('time').limitToLast(30).once('value');
      const reports = [];
      snap.forEach(c => reports.push({ key: c.key, ...c.val() }));
      reports.reverse();
      let html = '';
      if (!reports.length) html = '<p style="text-align:center;color:#888">Không có báo cáo</p>';
      reports.forEach(r => {
        const time = new Date(r.time).toLocaleString('vi-VN');
        html += `<div class="list-item">
          <div>
            <b>${r.targetName || '?'}</b> bị báo bởi ${r.reporterName || '?'}<br>
            <span style="font-size:0.72rem;color:#666">${time}</span>
          </div>
          <button class="btn-danger" style="padding:4px 8px;font-size:0.72rem" onclick="adminDeleteReported('${r.msgKey || ''}','${r.key}')">Xóa tin</button>
        </div>`;
      });
      body.innerHTML = html;
    } catch (e) {
      body.innerHTML = '<p style="color:red">Lỗi: ' + e.message + '</p>';
    }
  }

  if (tab === 'tools') {
    body.innerHTML = `
      <div class="admin-section">
        <h4>💬 Chat</h4>
        <button class="btn-danger" style="width:100%;justify-content:center" onclick="adminClearChat()">Xóa toàn bộ chat công cộng</button>
      </div>
      <div class="admin-section admin-form">
        <h4>📢 Broadcast</h4>
        <input id="broadcastMsg" placeholder="Nội dung thông báo..." />
        <button class="btn-secondary" style="width:100%;justify-content:center" onclick="adminBroadcast()">Gửi vào chat</button>
      </div>
      <div class="admin-section admin-form">
        <h4>📊 Thống kê nhanh</h4>
        <button class="btn-secondary" style="width:100%;justify-content:center" onclick="adminStats()">Xem thống kê</button>
        <div id="adminStatsResult" style="margin-top:10px;font-size:0.85rem"></div>
      </div>
    `;
  }
}

async function adminEditUser(uid, name) {
  try {
    const snap = await db.ref('users/' + uid + '/state').once('value');
    const s = snap.val() || {};
    const fert = await promptNumber('Phân hiện tại: ' + (s.fertilizer || 0) + '\nNhập số phân mới:', s.fertilizer || 0);
    if (fert === null) return;
    const fruits = await promptNumber('Quả hiện tại: ' + (s.fruits || 0) + '\nNhập số quả mới:', s.fruits || 0);
    if (fruits === null) return;
    const water = await promptNumber('Tổng tưới hiện tại: ' + (s.totalWater || 0) + '\nNhập tổng tưới mới:', s.totalWater || 0);
    if (water === null) return;

    await db.ref('users/' + uid + '/state').update({
      fertilizer: fert,
      fruits: fruits,
      totalWater: water
    });
    await Dialog.success('Đã cập nhật ' + name);
    adminTab('users');
  } catch (e) {
    await Dialog.error(e.message);
  }
}

function promptNumber(message, defaultVal) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('dialogOverlay');
    const box = document.getElementById('dialogBox');
    box.innerHTML = `
      <div class="dialog-icon">✏️</div>
      <h3 class="dialog-title">Chỉnh sửa</h3>
      <p class="dialog-msg" style="white-space:pre-line;text-align:left">${message}</p>
      <input id="promptInput" type="number" value="${defaultVal}" style="width:100%;padding:12px;border:1.5px solid #d4e8d9;border-radius:10px;font-size:1rem;margin-bottom:16px;font-family:inherit" />
      <div class="dialog-actions">
        <button class="dialog-btn dialog-btn-cancel" id="promptCancel">Hủy</button>
        <button class="dialog-btn dialog-btn-ok" id="promptOk">Lưu</button>
      </div>
    `;
    overlay.classList.add('show');
    document.getElementById('promptOk').onclick = () => {
      const v = parseInt(document.getElementById('promptInput').value, 10);
      overlay.classList.remove('show');
      resolve(isNaN(v) ? defaultVal : v);
    };
    document.getElementById('promptCancel').onclick = () => {
      overlay.classList.remove('show');
      resolve(null);
    };
  });
}

async function adminGrantCustom() {
  const uid = document.getElementById('grantUid')?.value.trim();
  if (!uid) { await Dialog.warn('Nhập UID'); return; }
  const fert = parseInt(document.getElementById('grantFert')?.value || '0', 10) || 0;
  const fruit = parseInt(document.getElementById('grantFruit')?.value || '0', 10) || 0;
  const water = parseInt(document.getElementById('grantWater')?.value || '0', 10) || 0;
  try {
    const snap = await db.ref('users/' + uid + '/state').once('value');
    const s = snap.val() || {};
    const updates = {};
    if (fert) updates.fertilizer = Math.max(0, (s.fertilizer || 0) + fert);
    if (fruit) {
      updates.fruits = Math.max(0, (s.fruits || 0) + fruit);
      updates.totalFruits = Math.max(0, (s.totalFruits || 0) + fruit);
    }
    if (water) updates.totalWater = Math.max(0, (s.totalWater || 0) + water);
    await db.ref('users/' + uid + '/state').update(updates);
    if (uid === currentUser.uid) {
      if (updates.fertilizer !== undefined) state.fertilizer = updates.fertilizer;
      if (updates.fruits !== undefined) state.fruits = updates.fruits;
      if (updates.totalWater !== undefined) state.totalWater = updates.totalWater;
      render();
    }
    await Dialog.success('Đã áp dụng thay đổi');
  } catch (e) {
    await Dialog.error(e.message);
  }
}

async function adminSelfGrant(fert, fruits) {
  state.fertilizer += fert;
  state.fruits += fruits;
  state.totalFruits += fruits;
  save();
  render();
  await Dialog.success(`+${fert} phân, +${fruits} quả`);
}

async function adminUnlockTree() {
  const uid = document.getElementById('unlockUid')?.value.trim();
  const treeId = document.getElementById('unlockTree')?.value;
  if (!uid || !treeId) { await Dialog.warn('Nhập UID và chọn cây'); return; }
  try {
    const snap = await db.ref('users/' + uid + '/state/unlockedTrees').once('value');
    let trees = snap.val() || ['basic'];
    if (!trees.includes(treeId)) trees.push(treeId);
    await db.ref('users/' + uid + '/state/unlockedTrees').set(trees);
    await Dialog.success('Đã mở khóa cây');
  } catch (e) {
    await Dialog.error(e.message);
  }
}

async function adminGrantDecor() {
  const uid = document.getElementById('decorUid')?.value.trim();
  const val = document.getElementById('decorType')?.value;
  if (!uid || !val) { await Dialog.warn('Nhập UID'); return; }
  const [kind, id] = val.split(':');
  try {
    if (kind === 'pot') {
      const snap = await db.ref('users/' + uid + '/state/ownedPots').once('value');
      let pots = snap.val() || ['default'];
      if (!pots.includes(id)) pots.push(id);
      await db.ref('users/' + uid + '/state/ownedPots').set(pots);
    } else {
      const snap = await db.ref('users/' + uid + '/state/ownedThemes').once('value');
      let themes = snap.val() || ['default'];
      if (!themes.includes(id)) themes.push(id);
      await db.ref('users/' + uid + '/state/ownedThemes').set(themes);
    }
    await Dialog.success('Đã cấp vật phẩm trang trí');
  } catch (e) {
    await Dialog.error(e.message);
  }
}

async function adminGrant(uid, fert, fruits) {
  try {
    const snap = await db.ref('users/' + uid + '/state').once('value');
    const s = snap.val() || {};
    if (fert) s.fertilizer = (s.fertilizer || 0) + fert;
    if (fruits) {
      s.fruits = (s.fruits || 0) + fruits;
      s.totalFruits = (s.totalFruits || 0) + fruits;
    }
    await db.ref('users/' + uid + '/state').update({
      fertilizer: s.fertilizer, fruits: s.fruits, totalFruits: s.totalFruits
    });
    await Dialog.success('Đã cấp vật phẩm!');
  } catch (e) {
    await Dialog.error(e.message);
  }
}

async function adminReset(uid) {
  const ok = await Dialog.confirm('Reset toàn bộ tiến độ của user này? Không hoàn tác được.');
  if (!ok) return;
  try {
    await db.ref('users/' + uid + '/state').set(defaultState());
    await Dialog.success('Đã reset user!');
    adminTab('users');
  } catch (e) {
    await Dialog.error(e.message);
  }
}

async function adminDeleteReported(msgKey, reportKey) {
  try {
    if (msgKey) await db.ref('chat/' + msgKey).remove();
    if (reportKey) await db.ref('reports/' + reportKey).remove();
    await Dialog.success('Đã xóa tin nhắn & báo cáo');
    adminTab('reports');
  } catch (e) {
    await Dialog.error(e.message);
  }
}

async function adminClearChat() {
  const ok = await Dialog.confirm('Xóa TOÀN BỘ chat công cộng? Không hoàn tác được.');
  if (!ok) return;
  try {
    await db.ref('chat').remove();
    await Dialog.success('Đã xóa toàn bộ chat');
  } catch (e) {
    await Dialog.error(e.message);
  }
}

async function adminBroadcast() {
  const text = (document.getElementById('broadcastMsg')?.value || '').trim();
  if (!text) { await Dialog.warn('Nhập nội dung'); return; }
  try {
    await db.ref('chat').push({
      uid: currentUser.uid,
      name: state.displayName + ' (Admin)',
      avatar: state.avatar,
      isAdmin: true,
      text: '📢 ' + text.slice(0, 200),
      time: Date.now()
    });
    await Dialog.success('Đã gửi broadcast!');
  } catch (e) {
    await Dialog.error(e.message);
  }
}

async function adminStats() {
  const el = document.getElementById('adminStatsResult');
  if (!el) return;
  el.innerHTML = 'Đang tính…';
  try {
    const snap = await db.ref('leaderboard').once('value');
    const data = snap.val() || {};
    const users = Object.values(data);
    const totalUsers = users.length;
    const totalWater = users.reduce((s, u) => s + (u.totalWater || 0), 0);
    const totalFruits = users.reduce((s, u) => s + (u.fruits || 0), 0);
    el.innerHTML = `
      <b>Tổng user:</b> ${totalUsers}<br>
      <b>Tổng lần tưới:</b> ${totalWater}<br>
      <b>Tổng quả (leaderboard):</b> ${totalFruits}
    `;
  } catch (e) {
    el.innerHTML = 'Lỗi: ' + e.message;
  }
}

async function adminAddCustomTree() {
  const name = (document.getElementById('customTreeName')?.value || '').trim();
  const emoji = (document.getElementById('customTreeEmoji')?.value || '🌳').trim() || '🌳';
  const unlock = parseInt(document.getElementById('customTreeUnlock')?.value || '0', 10) || 0;
  if (!name) { await Dialog.warn('Nhập tên cây'); return; }
  const id = 'custom_' + Date.now();
  const tree = {
    id, name, emoji: [emoji, emoji, emoji, emoji, emoji, emoji, emoji], unlock, eventOnly: false
  };
  try {
    await db.ref('config/customTrees/' + id).set(tree);
    TREE_TYPES.push(tree);
    await Dialog.success('Đã thêm cây: ' + name);
  } catch (e) {
    await Dialog.error(e.message);
  }
}

async function adminAddCustomItem() {
  const name = (document.getElementById('customItemName')?.value || '').trim();
  const price = parseInt(document.getElementById('customItemPrice')?.value || '10', 10) || 10;
  const fert = parseInt(document.getElementById('customItemFert')?.value || '0', 10) || 0;
  const fruits = parseInt(document.getElementById('customItemFruit')?.value || '0', 10) || 0;
  if (!name) { await Dialog.warn('Nhập tên vật phẩm'); return; }
  const id = 'citem_' + Date.now();
  const item = { id, name, price, fert, fruits };
  try {
    await db.ref('config/customItems/' + id).set(item);
    if (typeof SUPPORT_ITEMS !== 'undefined') SUPPORT_ITEMS.push(item);
    await Dialog.success('Đã thêm vật phẩm: ' + name);
  } catch (e) {
    await Dialog.error(e.message);
  }
}

async function loadCustomConfig() {
  try {
    const treesSnap = await db.ref('config/customTrees').once('value');
    const trees = treesSnap.val() || {};
    Object.values(trees).forEach(t => {
      if (t && t.id && !TREE_TYPES.find(x => x.id === t.id)) TREE_TYPES.push(t);
    });
    const itemsSnap = await db.ref('config/customItems').once('value');
    const items = itemsSnap.val() || {};
    if (typeof SUPPORT_ITEMS !== 'undefined') {
      Object.values(items).forEach(it => {
        if (it && it.id && !SUPPORT_ITEMS.find(x => x.id === it.id)) SUPPORT_ITEMS.push(it);
      });
    }
  } catch (e) { console.warn('loadCustomConfig', e); }
}

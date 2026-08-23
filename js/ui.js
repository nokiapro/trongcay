// UI render + modals
function setMsg(t, type = '') {
  const el = document.getElementById('msg');
  if (el) { el.textContent = t; el.className = 'msg ' + type; }
}
function setSyncStatus(t, type = '') {
  const el = document.getElementById('syncStatus');
  if (el) { el.textContent = t; el.className = 'sync-status ' + type; }
}

function spawnDrops() {
  const slots = document.querySelectorAll('.slot');
  const active = slots[state.activeSlot];
  if (!active) return;
  const sky = active.querySelector('.slot-sky');
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const d = document.createElement('div');
      d.className = 'water-drop';
      d.textContent = '💧';
      d.style.left = (25 + Math.random() * 50) + '%';
      d.style.top = '10%';
      sky.appendChild(d);
      setTimeout(() => d.remove(), 900);
    }, i * 70);
  }
}

function getPotClass() {
  const pot = POTS.find(p => p.id === state.activePot) || POTS[0];
  return pot.class || '';
}

function render(justGrew = false) {
  updateWeather();
  updateSeason();
  checkMissedDays();

  // Daily reward banner
  const rewardEl = document.getElementById('dailyReward');
  if (rewardEl) {
    if (!state.claimedDaily) {
      const day = ((state.loginStreak - 1) % 7) + 1;
      const r = DAILY_REWARDS.find(x => x.day === day) || DAILY_REWARDS[0];
      rewardEl.style.display = 'block';
      rewardEl.innerHTML = `🎁 Thưởng đăng nhập ngày ${day} (chuỗi ${state.loginStreak}) — +${r.fert} phân${r.fruits ? ' +' + r.fruits + ' quả' : ''}
        <br><button class="btn-secondary" style="margin-top:8px;padding:8px 16px" onclick="claimDailyReward();playSound('reward')">Nhận ngay</button>`;
    } else {
      rewardEl.style.display = 'none';
    }
  }

  // Event banner
  const eventEl = document.getElementById('eventBanner');
  if (eventEl) {
    if (isEventActive()) {
      eventEl.style.display = 'block';
      eventEl.innerHTML = '🏮 <b>Sự kiện Đèn Lồng</b> đang diễn ra! Cây đặc biệt đã mở khóa.';
    } else eventEl.style.display = 'none';
  }

  const weather = getWeather();
  const garden = document.getElementById('garden');
  garden.innerHTML = '';
  const potCls = getPotClass();

  state.slots.forEach((tree, idx) => {
    const div = document.createElement('div');
    div.className = 'slot' + (idx === state.activeSlot ? ' active' : '') + (!tree ? ' empty' : '');
    div.onclick = () => {
      state.activeSlot = idx;
      if (!tree) openPlantModal(idx);
      else render();
    };
    if (tree) {
      const type = getTreeType(tree.type);
      const stage = getStage(tree.waterCount);
      const si = STAGES.findIndex(s => s.name === stage.name);
      const emoji = type.emoji[Math.min(si, type.emoji.length - 1)];
      let pets = '';
      if (si >= 4) {
        pets = `<span class="pet" style="top:10px;right:8px">🐝</span>
                <span class="pet" style="top:25px;left:6px;animation-delay:0.5s">🦋</span>`;
      }
      div.innerHTML = `<div class="slot-sky">
          <div class="weather-badge">${weather.icon}</div>
          ${pets}
          <div class="slot-emoji ${justGrew && idx === state.activeSlot ? 'grow' : ''}">${emoji}</div>
          <div class="slot-pot ${potCls}"></div>
        </div>
        <div class="slot-name">${type.name}</div>
        <div class="slot-status">${stage.name} • ${tree.health || 100}HP</div>`;
    } else {
      div.innerHTML = `<div class="slot-sky" style="display:flex;align-items:center;justify-content:center;font-size:2rem;opacity:0.5;">➕</div>
        <div class="slot-name">Trồng cây</div><div class="slot-status">Ô trống</div>`;
    }
    garden.appendChild(div);
  });

  const tree = currentTree();
  document.getElementById('streak').textContent = state.streak;
  document.getElementById('total').textContent = state.totalWater;
  document.getElementById('fruits').textContent = state.fruits;
  const coinsEl = document.getElementById('coins');
  if (coinsEl) coinsEl.textContent = state.coins || 0;
  document.getElementById('fert').textContent = state.fertilizer;
  const miniEl = document.getElementById('miniLeft');
  if (miniEl) {
    miniEl.textContent = (typeof isAdmin !== 'undefined' && isAdmin) ? '∞' : String(typeof getMiniPlaysLeft === 'function' ? getMiniPlaysLeft() : 3);
  }

  if (tree) {
    const stage = getStage(tree.waterCount);
    document.getElementById('stageName').textContent = `${getTreeType(tree.type).name} — ${stage.name}`;
    document.getElementById('progressBar').style.width = progressPercent(tree.waterCount) + '%';
    document.getElementById('btnWater').disabled = false;
    document.getElementById('btnFert').disabled = state.fertilizer <= 0;
    document.getElementById('btnHarvest').disabled = !tree.readyHarvest;
  } else {
    document.getElementById('stageName').textContent = 'Chọn ô trống để trồng';
    document.getElementById('progressBar').style.width = '0%';
    document.getElementById('btnWater').disabled = true;
    document.getElementById('btnFert').disabled = true;
    document.getElementById('btnHarvest').disabled = true;
  }

  // Banner đếm ngược nhận phân (giờ:phút:giây)
  updateFertClaimBanner();
  startFertCountdown();

  const hour = new Date().getHours();
  document.body.classList.toggle('night', hour < 6 || hour >= 19);
  document.body.classList.remove('theme-autumn', 'theme-winter', 'theme-sakura', 'theme-night-garden');
  if (state.theme === 'autumn') document.body.classList.add('theme-autumn');
  if (state.theme === 'winter') document.body.classList.add('theme-winter');
  if (state.theme === 'sakura') document.body.classList.add('theme-sakura');
  if (state.theme === 'night-garden') document.body.classList.add('theme-night-garden');
}


function formatFertCountdown(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = n => String(n).padStart(2, '0');
  return pad(h) + ':' + pad(m) + ':' + pad(sec);
}

function updateFertClaimBanner() {
  const fertBanner = document.getElementById('fertClaimBanner');
  if (!fertBanner || typeof canClaimFert !== 'function') return;
  fertBanner.style.display = 'block';
  if (canClaimFert()) {
    fertBanner.classList.add('ready');
    fertBanner.style.cursor = 'pointer';
    fertBanner.onclick = () => claimTimedFert();
    fertBanner.innerHTML = '<i class="fa-solid fa-gift"></i> Phân bón sẵn sàng — <b>chạm để nhận</b>';
  } else {
    fertBanner.classList.remove('ready');
    fertBanner.style.cursor = 'default';
    fertBanner.onclick = null;
    const ms = typeof fertClaimRemainingMs === 'function' ? fertClaimRemainingMs() : 0;
    fertBanner.innerHTML = '<i class="fa-regular fa-clock"></i> Nhận phân sau <b id="fertCountdown">' + formatFertCountdown(ms) + '</b>';
  }
}

let _fertCountdownTimer = null;
function startFertCountdown() {
  if (_fertCountdownTimer) return;
  _fertCountdownTimer = setInterval(() => {
    const el = document.getElementById('fertCountdown');
    const banner = document.getElementById('fertClaimBanner');
    if (!banner || typeof canClaimFert !== 'function') return;
    if (canClaimFert()) {
      // Chuyển sang trạng thái sẵn sàng
      updateFertClaimBanner();
      return;
    }
    if (el && typeof fertClaimRemainingMs === 'function') {
      el.textContent = formatFertCountdown(fertClaimRemainingMs());
    }
  }, 1000);
}

function openPlantModal(slotIdx) {
  window._plantSlot = slotIdx;
  let html = `<button class="modal-close" onclick="closeModal()">✕</button>
    <h2>Chọn loại cây</h2>
    <input id="treeSearch" placeholder="Tìm cây..." style="width:100%;padding:10px 12px;border:1.5px solid var(--border,#d4e8d9);border-radius:10px;font-family:inherit;margin-bottom:12px;font-size:0.95rem" oninput="filterTreeSelect(this.value)" />
    <div class="tree-select" id="treeSelectGrid" style="max-height:50vh;overflow-y:auto"></div>`;
  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('show');
  filterTreeSelect('');
}

function filterTreeSelect(q) {
  const slotIdx = window._plantSlot ?? 0;
  const grid = document.getElementById('treeSelectGrid');
  if (!grid) return;
  q = (q || '').toLowerCase().trim();
  let html = '';
  let count = 0;
  TREE_TYPES.forEach(t => {
    if (t.eventOnly && !isEventActive() && !state.unlockedTrees.includes(t.id)) return;
    if (q && !t.name.toLowerCase().includes(q) && !t.id.includes(q)) return;
    const locked = !state.unlockedTrees.includes(t.id);
    count++;
    html += `<div class="tree-option ${locked ? 'locked' : ''}" onclick="${locked ? '' : `plantTree(${slotIdx},'${t.id}');closeModal();`}">
      <div style="font-size:2rem">${t.emoji[Math.min(3, t.emoji.length-1)]}</div>
      <div style="font-weight:700;font-size:0.85rem">${t.name}</div>
      <div style="font-size:0.72rem;color:#666">${locked ? (t.eventOnly ? 'Sự kiện' : 'Mở @' + t.unlock) : 'Sẵn sàng'}</div>
    </div>`;
  });
  grid.innerHTML = html || '<p style="text-align:center;color:#888;grid-column:1/-1">Không tìm thấy</p>';
}

async function openModal(type) {
  playSound('click');
  // Đóng sidebar mobile nếu đang mở (và hiện lại nút ☰)
  if (typeof toggleSidebar === 'function') {
    toggleSidebar(true);
  } else {
    const sb = document.getElementById('sidebar');
    const bd = document.getElementById('sidebarBackdrop');
    const mt = document.getElementById('menuToggle');
    if (sb) sb.classList.remove('open');
    if (bd) bd.classList.remove('show');
    if (mt) mt.style.display = '';
    document.body.classList.remove('sidebar-open');
  }
  if (type === 'chat') { openChat(); return; }
  if (type === 'admin') { openAdmin(); return; }

  let html = `<button class="modal-close" onclick="closeModal()">✕</button>`;

  if (type === 'quests') {
    html += `<h2>📋 Nhiệm vụ</h2>
      <div class="tabs">
        <button class="tab-btn active" onclick="showQuestTab('daily',this)">Ngày</button>
        <button class="tab-btn" onclick="showQuestTab('weekly',this)">Tuần</button>
      </div>
      <div id="questBody"></div>`;
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('show');
    showQuestTab('daily');
    return;
  }

  if (type === 'achievements') {
    html += `<h2>🏆 Thành tích (${state.achievements.length}/${ACHIEVEMENTS.length})</h2>`;
    ACHIEVEMENTS.forEach(a => {
      const u = state.achievements.includes(a.id);
      html += `<div class="list-item"><div><div style="font-weight:700">${u ? '🏅' : '🔒'} ${a.name}</div>
        <div style="font-size:0.8rem;color:#666">${a.desc}</div></div>
        <span class="badge ${u ? 'gold' : 'locked'}">${u ? 'Đạt' : 'Chưa'}</span></div>`;
    });
  }

  if (type === 'history') {
    html += `<h2>📅 Lịch sử tưới</h2>`;
    const hist = [...state.history].reverse().slice(0, 20);
    if (!hist.length) html += `<p style="text-align:center;color:#888">Chưa có</p>`;
    hist.forEach(d => html += `<div class="list-item"><span>${d}</span><span class="badge">Đã tưới</span></div>`);
  }

  if (type === 'leaderboard') {
    html += `<h2>🏅 Bảng xếp hạng</h2>
      <div class="tabs">
        <button class="tab-btn active" onclick="loadLB(false,this)">Tổng</button>
        <button class="tab-btn" onclick="loadLB(true,this)">Tuần này</button>
      </div>
      <div id="lbList"><p style="text-align:center">Đang tải…</p></div>`;
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('show');
    loadLB(false);
    return;
  }

  if (type === 'shop') {
    html += `<h2><i class="fa-solid fa-store"></i> Cửa hàng</h2>
      <p style="text-align:center;margin-bottom:10px">Bạn có <b>${state.coins || 0}</b> xu • <b>${state.fruits || 0}</b> quả</p>
      <h3 style="font-size:1rem;margin:12px 0 8px"><i class="fa-solid fa-seedling"></i> Vật phẩm nhanh</h3>
      <div class="list-item"><div><b>Phân bón</b></div><button class="btn-secondary" onclick="buyFert()">3 xu</button></div>
      <div class="list-item"><div><b>Tưới VIP +5</b></div><button class="btn-secondary" onclick="buyBoost()">5 xu</button></div>
      <h3 style="font-size:1rem;margin:16px 0 8px"><i class="fa-solid fa-jar"></i> Chậu cây</h3>
      <div class="shop-grid">`;
    POTS.forEach(p => {
      const owned = state.ownedPots.includes(p.id);
      const equipped = state.activePot === p.id;
      html += `<div class="shop-item ${owned ? 'owned' : ''}">
        <div style="font-size:1.5rem">🏺</div>
        <div style="font-weight:700;font-size:0.85rem">${p.name}</div>
        <div style="font-size:0.75rem;color:#666">${owned ? (equipped ? 'Đang dùng' : 'Đã có') : p.price + ' xu'}</div>
        ${owned
          ? (equipped ? '' : `<button class="btn-secondary" style="margin-top:6px;padding:6px 10px;font-size:0.8rem" onclick="equipPot('${p.id}')">Dùng</button>`)
          : `<button class="btn-secondary" style="margin-top:6px;padding:6px 10px;font-size:0.8rem" onclick="buyPot('${p.id}')">Mua</button>`}
      </div>`;
    });
    html += `</div>
      <h3 style="font-size:1rem;margin:16px 0 8px"><i class="fa-solid fa-wand-magic-sparkles"></i> Vật phẩm hỗ trợ</h3>
      <div class="shop-grid">`;
    (typeof SUPPORT_ITEMS !== 'undefined' ? SUPPORT_ITEMS : []).forEach(it => {
      html += `<div class="shop-item">
        <div style="font-weight:700;font-size:0.85rem">${it.name}</div>
        <div style="font-size:0.75rem;color:#666">${it.price} xu</div>
        <button class="btn-secondary" style="margin-top:6px;padding:6px 10px;font-size:0.8rem" onclick="buySupportItem('${it.id}')">Mua</button>
      </div>`;
    });
    html += `</div>
      <h3 style="font-size:1rem;margin:16px 0 8px"><i class="fa-solid fa-palette"></i> Theme</h3>
      <div class="shop-grid">`;
    THEMES_SHOP.forEach(t => {
      const owned = state.ownedThemes.includes(t.id);
      const equipped = state.theme === t.id;
      html += `<div class="shop-item ${owned ? 'owned' : ''}">
        <div style="font-weight:700;font-size:0.85rem">${t.name}</div>
        <div style="font-size:0.75rem;color:#666">${owned ? (equipped ? 'Đang dùng' : 'Đã có') : t.price + ' xu'}</div>
        ${owned
          ? (equipped ? '' : `<button class="btn-secondary" style="margin-top:6px;padding:6px 10px;font-size:0.8rem" onclick="equipTheme('${t.id}')">Dùng</button>`)
          : `<button class="btn-secondary" style="margin-top:6px;padding:6px 10px;font-size:0.8rem" onclick="buyTheme('${t.id}')">Mua</button>`}
      </div>`;
    });
    html += `</div>`;
  }

  if (type === 'inventory') {
    if (!state.inventory) state.inventory = {};
    const keys = Object.keys(state.inventory).filter(k => (state.inventory[k] || 0) > 0);
    html += `<h2><i class="fa-solid fa-box-open"></i> Kho đồ</h2>
      <p style="text-align:center;margin-bottom:12px">Xu: <b>${state.coins || 0}</b></p>`;
    if (!keys.length) {
      html += `<p style="text-align:center;color:#888">Kho trống. Thu hoạch cây để nhận vật phẩm.</p>`;
    } else {
      keys.forEach(id => {
        const meta = (typeof INV_META !== 'undefined' && INV_META[id]) ? INV_META[id] : { name: id, emoji: '📦', sell: 1 };
        const n = state.inventory[id];
        html += `<div class="list-item">
          <div>${meta.emoji} <b>${meta.name}</b> ×${n}<br><span style="font-size:0.75rem;color:#666">Bán: ${meta.sell} xu/cái</span></div>
          <div>
            <button class="btn-secondary" style="padding:6px 10px;font-size:0.8rem" onclick="sellInventoryItem('${id}',1)">Bán 1</button>
            <button class="btn-secondary" style="padding:6px 10px;font-size:0.8rem" onclick="sellInventoryItem('${id}',${n})">Bán hết</button>
          </div>
        </div>`;
      });
      html += `<button class="btn-water" style="width:100%;justify-content:center;margin-top:12px" onclick="sellAllInventory()">Bán toàn bộ kho</button>`;
    }
  }

  if (type === 'settings') {
    html += `<h2>⚙️ Cài đặt</h2>
      <p style="font-weight:700;margin:8px 0 4px">Tên hiển thị</p>
      <input id="setName" value="${state.displayName}" style="width:100%;padding:10px;border-radius:10px;border:2px solid #c8e6c9;font-family:inherit;margin-bottom:8px" />
      <p style="font-weight:700;margin:8px 0 4px">Avatar</p>
      <div class="avatar-pick" id="setAvatarPick"></div>
      <button class="btn-secondary" style="width:100%;justify-content:center;margin:10px 0" onclick="saveProfile()">Lưu hồ sơ</button>
      <p style="font-weight:700;margin:8px 0 4px">Độ khó</p>
      <div class="difficulty-row">
        <button class="diff-btn ${state.difficulty==='easy'?'active':''}" onclick="setDiff('easy')">Dễ</button>
        <button class="diff-btn ${state.difficulty==='normal'?'active':''}" onclick="setDiff('normal')">Thường</button>
        <button class="diff-btn ${state.difficulty==='hard'?'active':''}" onclick="setDiff('hard')">Khó</button>
      </div>
      <button class="btn-secondary" style="width:100%;justify-content:center;margin-top:12px" onclick="state.sound=!state.sound;save();closeModal();openModal('settings')">
        ${state.sound ? '🔊 Âm thanh: Bật' : '🔇 Âm thanh: Tắt'}
      </button>
      <button class="btn-secondary" style="width:100%;justify-content:center;margin-top:8px" onclick="resetGameConfirm()">🔄 Reset game</button>
      <p style="margin-top:12px;font-size:0.75rem;color:#888;text-align:center">UID: ${currentUser ? currentUser.uid.slice(0, 14) + '…' : ''}</p>`;
  }

  if (type === 'friends') {
    html += `<h2>👥 Bạn bè</h2>
      <p style="font-size:0.85rem;color:#666;margin-bottom:10px">Thêm bạn từ bảng xếp hạng (nút ➕). Chat riêng đơn giản.</p>
      <div id="friendsList"></div>`;
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('modalOverlay').classList.add('show');
    renderFriends();
    return;
  }

  document.getElementById('modalContent').innerHTML = html;
  document.getElementById('modalOverlay').classList.add('show');

  if (type === 'settings') {
    const box = document.getElementById('setAvatarPick');
    AVATARS.forEach(a => {
      const d = document.createElement('div');
      d.className = 'avatar-opt' + (a === state.avatar ? ' selected' : '');
      d.textContent = a;
      d.onclick = () => {
        state.avatar = a;
        box.querySelectorAll('.avatar-opt').forEach(x => x.classList.remove('selected'));
        d.classList.add('selected');
      };
      box.appendChild(d);
    });
  }
}

function showQuestTab(tab, btn) {
  if (btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const body = document.getElementById('questBody');
  if (!body) return;
  let html = '';
  if (tab === 'daily') {
    getDailyQuests().forEach(q => {
      html += `<div class="quest-item ${q.done ? 'done' : ''}"><div style="font-weight:700">${q.done ? '✅' : '⬜'} ${q.name}</div>
        <div style="font-size:0.8rem;color:#666">Thưởng: ${q.reward.fert ? q.reward.fert + ' phân' : ''}</div></div>`;
    });
  } else {
    getWeeklyQuests().forEach(q => {
      html += `<div class="quest-item ${q.done ? 'done' : ''}"><div style="font-weight:700">${q.done ? '✅' : '⬜'} ${q.name}</div>
        <div style="font-size:0.8rem;color:#666">${q.progress || 0}/${q.target} — Thưởng: ${q.reward.fert || 0} phân, ${q.reward.fruits || 0} quả</div></div>`;
    });
  }
  body.innerHTML = html;
}

async function loadLB(weekly, btn) {
  if (btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  const list = await fetchLeaderboard(weekly);
  let lb = '';
  if (!list.length) lb = '<p style="text-align:center;color:#888">Chưa có dữ liệu</p>';
  else list.forEach((p, i) => {
    const me = p.uid === currentUser.uid;
    const score = weekly ? (p.weeklyWater || 0) : (p.totalWater || 0);
    lb += `<div class="lb-row" style="${me ? 'background:#e8f5e9;border-radius:8px;padding:8px;' : ''}">
      <span class="lb-rank">${i + 1}</span>
      <span class="lb-name">${p.avatar || '🌿'} ${p.name || 'Ẩn'}${me ? ' (Bạn)' : ''}</span>
      <span class="lb-score">${score} 💧</span>
      <span class="lb-actions">
        ${!me ? `<button class="btn-secondary" onclick="viewGarden('${p.uid}','${(p.name || '').replace(/'/g, '')}')">🌳</button>
                 <button class="btn-secondary" onclick="addFriend('${p.uid}','${(p.name || '').replace(/'/g, '')}','${p.avatar || '🌿'}')">➕</button>` : ''}
      </span>
    </div>`;
  });
  document.getElementById('lbList').innerHTML = lb;
}

async function viewGarden(uid, name) {
  const data = await fetchUserGarden(uid);
  if (!data || !data.slots) {
    Dialog.warn('Không xem được vườn của người này');
    return;
  }
  let html = `<button class="modal-close" onclick="closeModal()">✕</button>
    <h2>🌳 Vườn của ${name || 'Người chơi'}</h2><div class="garden" style="pointer-events:none">`;
  data.slots.forEach(tree => {
    if (!tree) {
      html += `<div class="slot empty"><div class="slot-sky" style="display:flex;align-items:center;justify-content:center;opacity:0.4">➕</div><div class="slot-name">Trống</div></div>`;
    } else {
      const type = getTreeType(tree.type);
      const stage = getStage(tree.waterCount);
      const si = STAGES.findIndex(s => s.name === stage.name);
      const emoji = type.emoji[Math.min(si, type.emoji.length - 1)];
      html += `<div class="slot"><div class="slot-sky"><div class="slot-emoji">${emoji}</div><div class="slot-pot"></div></div>
        <div class="slot-name">${type.name}</div><div class="slot-status">${stage.name}</div></div>`;
    }
  });
  html += `</div>
    <p style="text-align:center;color:#666;font-size:0.85rem">Tổng tưới: ${data.totalWater || 0} • Chuỗi tốt nhất: ${data.bestStreak || 0}</p>`;
  document.getElementById('modalContent').innerHTML = html;
}

async function addFriend(uid, name, avatar) {
  if (!currentUser) {
    await Dialog.warn('Chưa đăng nhập');
    return;
  }
  if (uid === currentUser.uid) {
    await Dialog.warn('Không thể kết bạn với chính mình');
    return;
  }
  if (!state.friends) state.friends = [];
  if (state.friends.find(f => f.uid === uid)) {
    await Dialog.warn('Đã là bạn bè với ' + (name || 'người này') + '!');
    return;
  }
  const me = {
    uid: currentUser.uid,
    name: state.displayName || 'Người chơi',
    avatar: state.avatar || '🌿'
  };
  const other = { uid, name: name || 'Người chơi', avatar: avatar || '🌿' };
  state.friends.push(other);
  save();

  try {
    if (typeof db !== 'undefined') {
      // Lưu friends của mình (được phép vì auth.uid == mình)
      await db.ref('users/' + currentUser.uid + '/state/friends').set(state.friends);
      // Ghi vào path friends công khai (rules cho phép auth ghi)
      await db.ref('friends/' + currentUser.uid + '/' + uid).set(other);
      await db.ref('friends/' + uid + '/' + currentUser.uid).set(me);
      // Thông báo
      await db.ref('notifications/' + uid).push({
        type: 'friend',
        fromUid: me.uid,
        fromName: me.name,
        fromAvatar: me.avatar,
        message: me.name + ' đã kết bạn với bạn!',
        createdAt: Date.now(),
        read: false
      });
    }
  } catch (e) {
    console.warn('addFriend sync', e);
    await Dialog.warn('Đã thêm local nhưng đồng bộ cloud lỗi.\nKiểm tra Firebase Rules (friends + notifications).');
    return;
  }

  await Dialog.success('Đã kết bạn với ' + (name || 'người chơi') + '!\nHọ cũng sẽ nhận được thông báo.');
  playSound('reward');
}

function renderFriends() {
  const box = document.getElementById('friendsList');
  if (!box) return;
  if (!state.friends || !state.friends.length) {
    box.innerHTML = '<p style="text-align:center;color:#888">Chưa có bạn bè. Thêm từ bảng xếp hạng.</p>';
    return;
  }
  let html = '';
  state.friends.forEach(f => {
    html += `<div class="list-item">
      <div>${f.avatar || '🌿'} <b>${f.name}</b></div>
      <div>
        <button class="btn-secondary" style="padding:6px 10px;font-size:0.8rem" onclick="openDM('${f.uid}','${f.name.replace(/'/g, '')}')">💬</button>
        <button class="btn-danger" style="padding:6px 10px;font-size:0.8rem" onclick="removeFriend('${f.uid}')">✕</button>
      </div>
    </div>`;
  });
  box.innerHTML = html;
}

function removeFriend(uid) {
  state.friends = (state.friends || []).filter(f => f.uid !== uid);
  save();
  renderFriends();
}

function openDM(uid, name) {
  let html = `<button class="modal-close" onclick="closeModal()">✕</button>
    <h2>💬 Chat với ${name}</h2>
    <div class="chat-box" id="dmBox"></div>
    <div class="chat-input-row">
      <input id="dmInput" placeholder="Nhắn tin..." maxlength="200" onkeydown="if(event.key==='Enter')sendDM('${uid}')" />
      <button onclick="sendDM('${uid}')">Gửi</button>
    </div>`;
  document.getElementById('modalContent').innerHTML = html;
  const path = [currentUser.uid, uid].sort().join('_');
  db.ref('dms/' + path).orderByChild('time').limitToLast(40).once('value').then(snap => {
    const box = document.getElementById('dmBox');
    box.innerHTML = '';
    snap.forEach(c => {
      const m = c.val();
      const div = document.createElement('div');
      div.className = 'chat-msg' + (m.from === currentUser.uid ? ' me' : '');
      const time = new Date(m.time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      div.innerHTML = `<div class="meta">${time}</div><div>${escapeHtml(m.text)}</div>`;
      box.appendChild(div);
    });
    box.scrollTop = box.scrollHeight;
  });
}

async function sendDM(toUid) {
  const input = document.getElementById('dmInput');
  const text = (input.value || '').trim();
  if (!text) return;
  input.value = '';
  const path = [currentUser.uid, toUid].sort().join('_');
  await db.ref('dms/' + path).push({
    from: currentUser.uid, text: text.slice(0, 200), time: Date.now()
  });
  openDM(toUid, state.friends.find(f => f.uid === toUid)?.name || 'Bạn');
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('show');
  if (window._chatOff) { window._chatOff(); window._chatOff = null; }
}

function saveProfile() {
  const name = (document.getElementById('setName').value.trim() || state.displayName).slice(0, 20);
  state.displayName = name;
  document.getElementById('userName').textContent = state.displayName;
  document.getElementById('userAvatar').textContent = state.avatar;
  save();
  updateLeaderboardEntry();
  closeModal();
  setMsg('Đã lưu hồ sơ!', 'success');
}
function setDiff(d) { state.difficulty = d; save(); closeModal(); openModal('settings'); }
function buyFert() {
  if ((state.coins || 0) < 3) { Dialog.warn('Không đủ xu (cần 3)'); return; }
  state.coins -= 3; state.fertilizer += 1; save(); render(); closeModal(); openModal('shop');
}
function buyBoost() {
  if ((state.coins || 0) < 5) { Dialog.warn('Không đủ xu (cần 5)'); return; }
  const tree = currentTree();
  if (!tree) { Dialog.warn('Cần chọn cây'); return; }
  state.coins -= 5; tree.waterCount += 5; save(); render(true); closeModal(); openModal('shop');
}

function escapeHtml(t) {
  const d = document.createElement('div');
  d.textContent = t;
  return d.innerHTML;
}

async function resetGameConfirm() {
  const ok = await Dialog.confirm("Reset toàn bộ tiến độ game? Chậu và theme đã mua vẫn giữ.");
  if (!ok) return;
  const dn = state.displayName, av = state.avatar, op = state.ownedPots, ot = state.ownedThemes;
  state = { ...defaultState(), displayName: dn, avatar: av, ownedPots: op, ownedThemes: ot };
  save();
  closeModal();
  render();
  setMsg("Đã reset game!", "success");
}


async function copyUserUid() {
  if (!currentUser) {
    await Dialog.warn('Chưa đăng nhập');
    return;
  }
  const uid = currentUser.uid;
  try {
    await navigator.clipboard.writeText(uid);
    await Dialog.success('Đã copy UID:\n' + uid);
  } catch (e) {
    await Dialog.alert(uid, 'UID của bạn');
  }
  if (typeof toggleSidebar === 'function') {
    toggleSidebar(true);
  } else {
    const sb = document.getElementById('sidebar');
    const bd = document.getElementById('sidebarBackdrop');
    const mt = document.getElementById('menuToggle');
    if (sb) sb.classList.remove('open');
    if (bd) bd.classList.remove('show');
    if (mt) mt.style.display = '';
    document.body.classList.remove('sidebar-open');
  }
}

// Init Firebase + Auth + Sync
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.database();
try { firebase.analytics(); } catch (e) {}

async function doLogin() {
  const email = document.getElementById('emailInput').value.trim();
  const pass = document.getElementById('passInput').value;
  const errEl = document.getElementById('loginError');
  errEl.textContent = '';
  if (!email || !pass) { errEl.textContent = 'Nhập email và mật khẩu'; return; }
  try {
    await auth.signInWithEmailAndPassword(email, pass);
  } catch (e) {
    let msg = e.message;
    if (e.code === 'auth/invalid-credential' || e.code === 'auth/wrong-password') msg = 'Sai email hoặc mật khẩu';
    else if (e.code === 'auth/user-not-found') msg = 'Tài khoản không tồn tại. Liên hệ admin.';
    else if (e.code === 'auth/too-many-requests') msg = 'Thử quá nhiều lần. Đợi rồi thử lại.';
    errEl.textContent = msg;
  }
}

function logout() {
  if (window._chatOff) window._chatOff();
  auth.signOut();
}

auth.onAuthStateChanged(async (user) => {
  if (user) {
    currentUser = user;
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('gameApp').style.display = 'flex';
    await loadUserData();
  } else {
    currentUser = null;
    isAdmin = false;
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('gameApp').style.display = 'none';
  }
});

async function loadUserData() {
  if (!currentUser) return;
  try {
    setSyncStatus('Đang tải…');
    const snap = await db.ref('users/' + currentUser.uid).once('value');
    const data = snap.val();

    if (data && data.profile) {
      state.displayName = data.profile.displayName || currentUser.email.split('@')[0];
      state.avatar = data.profile.avatar || '🌿';
      isAdmin = !!data.profile.isAdmin;
      if (data.state) {
        state = { ...defaultState(), ...data.state, displayName: state.displayName, avatar: state.avatar };
      }
    } else {
      const name = (currentUser.email || 'player').split('@')[0].slice(0, 20);
      state = defaultState();
      state.displayName = name;
      state.avatar = '🌿';
      const adminSnap = await db.ref('config/adminUid').once('value');
      const noAdminYet = !adminSnap.exists() || !adminSnap.val();
      isAdmin = noAdminYet;
      await db.ref('users/' + currentUser.uid).set({
        profile: {
          displayName: name, avatar: '🌿', email: currentUser.email || '',
          isAdmin, createdAt: Date.now()
        },
        state
      });
      if (isAdmin) await db.ref('config/adminUid').set(currentUser.uid);
    }

    const adminCheck = await db.ref('config/adminUid').once('value');
    if (adminCheck.val() === currentUser.uid) isAdmin = true;

    // Kho: đồng bộ quả cũ vào inventory nếu kho trống
    if (!state.inventory) state.inventory = {};
    if ((state.fruits || 0) > 0 && !(state.inventory.fruit > 0)) {
      state.inventory.fruit = state.fruits;
    }
    if (state.coins == null) state.coins = 0;

    // Daily login reward
    processDailyLogin();

    // Weekly water reset
    const wid = weekId();
    if (state.weeklyWaterWeek !== wid) {
      state.weeklyWater = 0;
      state.weeklyWaterWeek = wid;
    }

    // Event tree unlock
    if (isEventActive() && !state.unlockedTrees.includes('event_lantern')) {
      state.unlockedTrees.push('event_lantern');
    }

    document.getElementById('userAvatar').textContent = state.avatar;
    document.getElementById('userName').textContent = state.displayName;
    const roleEl = document.getElementById('userRole');
    if (isAdmin) {
      roleEl.style.display = 'inline';
      roleEl.textContent = 'ADMIN';
      roleEl.classList.add('admin');
    } else roleEl.style.display = 'none';

    // Show admin button
    const adminBtn = document.getElementById('btnAdmin');
    if (adminBtn) adminBtn.style.display = isAdmin ? 'inline-flex' : 'none';

    if (typeof loadCustomConfig === 'function') await loadCustomConfig();
    setSyncStatus('Đồng bộ thành công ✓', 'ok');
    save();
    render();
    updateLeaderboardEntry();
    listenFriendNotifications();
  } catch (err) {
    console.error(err);
    setSyncStatus('Lỗi: ' + err.message, 'err');
  }
}

/** Lắng nghe thông báo kết bạn */
function listenFriendNotifications() {
  if (!currentUser || typeof db === 'undefined') return;
  if (window._notifOff) {
    try { window._notifOff(); } catch (e) {}
  }

  // Đồng bộ node friends/{myUid}
  const friendsRef = db.ref('friends/' + currentUser.uid);
  const friendsHandler = snap => {
    const val = snap.val() || {};
    const list = Object.keys(val).map(k => val[k]).filter(f => f && f.uid);
    if (!list.length) return;
    if (!state.friends) state.friends = [];
    list.forEach(f => {
      if (!state.friends.find(x => x.uid === f.uid)) state.friends.push(f);
    });
    save();
  };
  friendsRef.on('value', friendsHandler);

  const ref = db.ref('notifications/' + currentUser.uid).limitToLast(15);
  const handler = async snap => {
    const n = snap.val();
    if (!n || n.read) return;
    if (n.type === 'friend') {
      if (!state.friends) state.friends = [];
      if (n.fromUid && !state.friends.find(f => f.uid === n.fromUid)) {
        state.friends.push({
          uid: n.fromUid,
          name: n.fromName || 'Người chơi',
          avatar: n.fromAvatar || '🌿'
        });
        save();
      }
      try {
        await Dialog.success((n.fromName || 'Ai đó') + ' đã kết bạn với bạn!');
      } catch (e) {}
    }
    try {
      await db.ref('notifications/' + currentUser.uid + '/' + snap.key + '/read').set(true);
    } catch (e) {}
  };
  ref.on('child_added', handler);
  window._notifOff = () => {
    ref.off('child_added', handler);
    friendsRef.off('value', friendsHandler);
  };
}

function processDailyLogin() {
  const today = todayStr();
  if (state.lastLoginDate === today) {
    state.claimedDaily = true;
    return;
  }
  if (state.lastLoginDate === yesterdayStr()) {
    state.loginStreak = (state.loginStreak || 0) + 1;
  } else {
    state.loginStreak = 1;
  }
  state.lastLoginDate = today;
  state.claimedDaily = false;
}

function claimDailyReward() {
  if (state.claimedDaily) return;
  const day = ((state.loginStreak - 1) % 7) + 1;
  const reward = DAILY_REWARDS.find(r => r.day === day) || DAILY_REWARDS[0];
  state.fertilizer += reward.fert;
  state.fruits += reward.fruits;
  state.claimedDaily = true;
  save();
  setMsg(`Nhận thưởng ngày ${day}: +${reward.fert} phân${reward.fruits ? ', +' + reward.fruits + ' quả' : ''}! 🎁`, 'success');
  checkAchievements();
  render();
}

async function saveToCloud() {
  if (!currentUser || isSyncing) return;
  isSyncing = true;
  try {
    await db.ref('users/' + currentUser.uid + '/state').set(state);
    await db.ref('users/' + currentUser.uid + '/profile/displayName').set(state.displayName);
    await db.ref('users/' + currentUser.uid + '/profile/avatar').set(state.avatar);
    setSyncStatus('Đã lưu đám mây ✓', 'ok');
  } catch (err) {
    setSyncStatus('Lỗi lưu: ' + err.message, 'err');
  }
  isSyncing = false;
}

function save() {
  clearTimeout(window._cloudTimer);
  window._cloudTimer = setTimeout(saveToCloud, 1000);
}

async function forceSync() {
  setMsg('Đang đồng bộ…');
  await saveToCloud();
  await loadUserData();
  setMsg('Đồng bộ xong!', 'success');
}

async function updateLeaderboardEntry() {
  if (!currentUser) return;
  try {
    await db.ref('leaderboard/' + currentUser.uid).set({
      name: state.displayName,
      avatar: state.avatar,
      streak: state.bestStreak || 0,
      totalWater: state.totalWater || 0,
      weeklyWater: state.weeklyWater || 0,
      fruits: state.totalFruits || 0,
      updatedAt: Date.now()
    });
  } catch (e) {}
}

async function fetchLeaderboard(byWeekly = false) {
  try {
    const field = byWeekly ? 'weeklyWater' : 'totalWater';
    const snap = await db.ref('leaderboard').orderByChild(field).limitToLast(20).once('value');
    const data = snap.val() || {};
    return Object.entries(data).map(([uid, v]) => ({ uid, ...v }))
      .sort((a, b) => (b[field] || 0) - (a[field] || 0));
  } catch (e) { return []; }
}

async function fetchUserGarden(uid) {
  try {
    const snap = await db.ref('users/' + uid + '/state').once('value');
    return snap.val();
  } catch (e) { return null; }
}

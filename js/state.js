// State + helpers
function defaultState() {
  return {
    slots: [null, null, null],
    activeSlot: 0,
    totalWater: 0,
    streak: 0,
    bestStreak: 0,
    lastWaterDate: null,
    history: [],
    fruits: 0,
    totalFruits: 0,
    fertilizer: 2,
    unlockedTrees: ['basic'],
    difficulty: 'normal',
    theme: 'default',
    achievements: [],
    quests: {},
    weeklyQuests: {},
    bestMini: 0,
    weatherDate: null,
    weatherId: 'sunny',
    sound: true,
    music: false,
    notifyEnabled: false,
    displayName: '',
    avatar: '🌿',
    ownedPots: ['default'],
    activePot: 'default',
    ownedThemes: ['default'],
    lastLoginDate: null,
    loginStreak: 0,
    claimedDaily: false,
    friends: [],
    weeklyWater: 0,
    weeklyWaterWeek: null,
    // Mini-game: 3 lượt/ngày (admin vô hạn)
    miniPlaysToday: 0,
    miniPlaysDate: null,
    // Nhận phân mỗi 3 giờ
    lastFertClaim: 0,
    // Xu + kho
    coins: 0,
    inventory: {}
  };
}

let state = defaultState();
let currentUser = null;
let isAdmin = false;
let isSyncing = false;

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}
function weekId() {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
  return d.getFullYear() + '-W' + week;
}
function daysBetween(a, b) {
  if (!a || !b) return 999;
  return Math.floor((new Date(b) - new Date(a)) / 86400000);
}
function getStage(w) {
  let st = STAGES[0];
  for (const s of STAGES) if (w >= s.min) st = s;
  return st;
}
function progressPercent(w) {
  const st = getStage(w);
  const idx = STAGES.findIndex(s => s.name === st.name);
  if (idx >= STAGES.length - 1) return 100;
  const next = STAGES[idx + 1];
  return Math.min(100, Math.round(((w - st.min) / (next.min - st.min)) * 100));
}
function getTreeType(id) {
  return TREE_TYPES.find(t => t.id === id) || TREE_TYPES[0];
}
function currentTree() {
  return state.slots[state.activeSlot];
}
function getWeather() {
  return WEATHERS.find(w => w.id === state.weatherId) || WEATHERS[0];
}
function isEventActive() {
  // Sự kiện đèn lồng: ngày 1-7 và 15-21 mỗi tháng
  const day = new Date().getDate();
  return (day >= 1 && day <= 7) || (day >= 15 && day <= 21);
}

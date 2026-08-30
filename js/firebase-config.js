// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC96Hq3bgVbCIff95AOp1epL-8ho3_Ukqk",
  authDomain: "trongcay-b417b.firebaseapp.com",
  databaseURL: "https://trongcay-b417b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "trongcay-b417b",
  storageBucket: "trongcay-b417b.firebasestorage.app",
  messagingSenderId: "642266531520",
  appId: "1:642266531520:web:d71cb8bce7cacd2263cf25",
  measurementId: "G-FJB0W8W8D2"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();
// Giữ đăng nhập sau F5 / đóng tab (localStorage + IndexedDB)
try {
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
} catch (e) { console.warn('auth persistence', e); }


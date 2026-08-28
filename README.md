# 🌱 Vườn Xanh - Firebase Edition

Website trồng cây / hoa / thu hoạch với **Firebase Auth + Realtime Database**.

## Tính năng mới

### Người chơi
- Đăng nhập (không có đăng ký trên web)
- Vườn 12 ô đất, trồng – tưới (tối đa 3 lần) – bón phân – thu hoạch
- Hệ thống thời gian thực: countdown, giai đoạn cây (mầm → lớn → sắp chín → sẵn sàng)
- Thời tiết ảnh hưởng tốc độ lớn
- **Thăm vườn bạn bè** + **tưới giúp** 1 lần/bạn/ngày (nhận coin/XP)
- **Mini-game mưa**: chạm sâu 🐛 / hạt rơi 🌱 để nhận coin hoặc hạt ngẫu nhiên
- **Limited / sự kiện**: badge Limited, tab riêng, chỉ bán trong tháng cấu hình
- **Thành tựu** + thưởng coin/XP một lần
- **Bộ sưu tập (Album)**: mở khi thu hoạch lần đầu · xếp hạng sưu tầm
- Tưới tối đa 3 lần **liên tục**, không chờ giữa các lần
- Cửa hàng hạt giống + phân bón
- Kho hàng, bán sản phẩm
- Level + XP, thưởng lên cấp
- Thưởng đăng nhập hàng ngày
- Thống kê + lịch sử hoạt động

### Admin
- Tài khoản **đầu tiên** đăng nhập tự động trở thành **admin**
- Quản lý CRUD cây, xem/cộng tiền user, set admin, cài đặt hệ thống

## Firebase Rules (Production)

Vào **Firebase Console → Realtime Database → Rules** và dán:

```json
{
  "rules": {
    "plants": {
      ".read": "auth != null",
      ".write": "auth != null && (!root.child('users').exists() || root.child('users').child(auth.uid).child('role').val() === 'admin')"
    },
    "settings": {
      ".read": "auth != null",
      ".write": "auth != null && (!root.child('users').exists() || root.child('users').child(auth.uid).child('role').val() === 'admin')"
    },
    "users": {
      ".read": "auth != null && (!root.child('users').child(auth.uid).exists() || root.child('users').child(auth.uid).child('role').val() === 'admin')",
      "$uid": {
        ".read": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
        ".write": "auth != null && (auth.uid === $uid || root.child('users').child(auth.uid).child('role').val() === 'admin')",
        "role": {
          ".write": "auth != null && (root.child('users').child(auth.uid).child('role').val() === 'admin' || (!data.exists() && !root.child('users').exists() && newData.val() === 'admin') || (!data.exists() && auth.uid === $uid && newData.val() === 'user'))"
        }
      }
    },
    "leaderboard": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "friends": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        "$fid": {
          ".write": "auth != null && (auth.uid === $uid || auth.uid === $fid)"
        }
      }
    },
    "chatStreaks": {
      "$id": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    },
    "messages": {
      "$chatId": {
        ".read": "auth != null",
        ".write": "auth != null",
        "$mid": {
          ".validate": "newData.hasChildren(['from','text','at']) && newData.child('from').val() === auth.uid"
        }
      }
    },
    "publicGardens": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "gardenHelps": {
      "$ownerUid": {
        ".read": "auth != null && auth.uid === $ownerUid",
        "$fromUid": {
          ".write": "auth != null && (auth.uid === $fromUid || auth.uid === $ownerUid)"
        }
      }
    },
    "announcements": {
      ".read": "auth != null",
      ".write": "auth != null && root.child('users').child(auth.uid).child('role').val() === 'admin'"
    },
    ".read": false,
    ".write": false
  }
}


## Cách tạo tài khoản

1. Vào [Firebase Console](https://console.firebase.google.com/) → project `trongcay-b417b`
2. **Authentication** → Sign-in method → bật **Email/Password**
3. **Users** → Add user → nhập email + mật khẩu
4. **Realtime Database** → tạo database (Asia Southeast) nếu chưa có
5. Dán Rules ở trên → Publish

## Chạy

Hosting khuyến nghị (URL sạch, **không hiện** `.html`):

| Hosting | URL vườn | URL admin |
|---------|----------|-----------|
| Firebase / Netlify / Vercel | `https://domain/` | `https://domain/admin` |

Đã có sẵn: `firebase.json` (`cleanUrls`), `_redirects`, `vercel.json`, `.htaccess`.

Local (vẫn có thể mở file, hoặc):

```bash
cd vuon-cay
python -m http.server 8080
# Vườn: http://localhost:8080/
# Admin: http://localhost:8080/admin/  (hoặc /admin/index.html)
```

## Lưu ý

- Phải mở qua **http/https** (không phải `file://`) vì Firebase Auth yêu cầu.
- Tài khoản đầu tiên login → role = `admin`.
- Các tài khoản sau → role = `user`.
- Font Awesome Pro: `kit-pro.fontawesome.com/releases/v7.3.1/css/pro.min.css`
- Link nội bộ dùng `/` và `/admin` (không gắn `.html`).

## Cấu trúc

```
vuon-cay/
├── index.html          → URL: /
├── admin/index.html    → URL: /admin
├── firebase.json       # cleanUrls
├── _redirects          # Netlify
├── vercel.json
├── .htaccess
├── css/
├── js/
└── README.md
```


## Chăm vườn khi offline (Cloud Functions)

Trình duyệt **không chạy** khi bạn thoát app. Để Tiên / NYC / Giúp việc vẫn hoạt động, cần deploy Functions:

```bash
# 1. Cài Firebase CLI (nếu chưa có)
npm install -g firebase-tools
firebase login

# 2. Cần gói Blaze (pay as you go) — scheduled functions
# 3. Cài dependency + deploy
cd functions
npm install
cd ..
firebase deploy --only functions,database

# Test thủ công (sau khi deploy):
# https://asia-southeast1-trongcay-b417b.cloudfunctions.net/backgroundCareHttp?key=vuon-cay-care-run
```

Functions chạy **mỗi 2 phút** trên server, cập nhật tưới/bón/thu/trồng/mua vào Firebase.
Khi bạn mở lại game, dữ liệu đã được server xử lý sẵn.

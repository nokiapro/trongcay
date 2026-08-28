# Chăm vườn khi thoát — KHÔNG cần Firebase Blaze

Firebase Free **không** chạy Functions hẹn giờ.  
Cách free: **Vercel API** + **cron-job.org** (miễn phí).

---

## Bước 1 — Tạo Service Account (free, không cần Blaze)

1. Mở https://console.firebase.google.com/project/trongcay-b417b/settings/serviceaccounts/adminsdk  
2. **Generate new private key** → tải file JSON  
3. Giữ file này **bí mật** (không up public Git)

## Bước 2 — Deploy lên Vercel (free)

1. Đưa code game (có thư mục `api/`) lên Vercel  
2. Project Settings → **Environment Variables**:

| Name | Value |
|------|--------|
| `FIREBASE_SERVICE_ACCOUNT` | **Cả nội dung** file JSON service account (1 dòng) |
| `FIREBASE_DATABASE_URL` | `https://trongcay-b417b-default-rtdb.asia-southeast1.firebasedatabase.app` |
| `CARE_SECRET` | tự đặt, ví dụ `mat-khau-cron-cua-toi` |

3. Redeploy

## Bước 3 — Gắn cron free (mỗi 2–5 phút)

1. Đăng ký https://cron-job.org (free)  
2. Create cronjob:
   - URL: `https://DOMAIN-VERCEL-CUA-BAN/api/care?key=mat-khau-cron-cua-toi`  
   - Schedule: every **5 minutes** (hoặc 2 phút)  
3. Enable → Save

Mỗi lần cron gọi → server tưới / thu / mua cho user còn hạn Tiên·NYC·Giúp việc.

## Bước 4 — Test tay

Mở trình duyệt:

```
https://DOMAIN-VERCEL-CUA-BAN/api/care?key=mat-khau-cron-cua-toi
```

Thấy `{"ok":true,"processed":...,"updated":...}` là OK.

---

## Không muốn Vercel?

Cùng API logic có thể chạy trên:
- **Cloudflare Workers** + Cron Trigger (free)
- **Render** free web service + cron-job.org gọi vào

Cốt lõi: cần **một máy chủ free** gọi định kỳ — không bắt buộc Blaze Firebase.

## Vẫn dùng Firebase Free được không?

| Việc | Free? |
|------|--------|
| Lưu game / đăng nhập | Có |
| Cây lớn khi tắt máy | Có (theo giờ thật) |
| Bù Tiên/NYC khi **mở lại** | Có (client) |
| Chăm **lúc đang thoát** | Cần cron ngoài (cách này) hoặc Blaze |

---

**Lưu ý bảo mật:** không đưa `CARE_SECRET` và service account lên Git public.

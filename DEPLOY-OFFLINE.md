# Firebase FREE vs Blaze

## Bạn đang dùng Firebase FREE (Spark)

**Không deploy được** Functions hẹn giờ. Không sao — game vẫn chơi được:

### Cây lớn khi tắt máy?
**CÓ.** Thời gian lớn tính theo `plantedAt` (giờ thật).  
Trồng 8 tiếng → tắt máy 8 tiếng → mở lại là **đã chín**. Không cần mở máy suốt.

### Tiên / NYC / Giúp việc trên FREE
Khi **mở lại** game, hệ thống **bù việc ngay**:
- Tiên: tưới + bón các ô cần
- NYC: thu hết ô chín + trồng lại
- Giúp việc: mua kho theo mốc

→ Không cần mở máy 8 tiếng. Chỉ cần **vào lại** sau khi cây chín / hết lượt tưới.

### Muốn chạy cả lúc đang thoát (không cần mở lại)?
Cần **nâng Blaze** (gắn thẻ, dùng ít thường ~0đ) rồi:

```bash
cd functions && npm install && cd ..
firebase deploy --only functions,database
```

Chi tiết bước Blaze xem bản trước / Firebase Console → Upgrade.

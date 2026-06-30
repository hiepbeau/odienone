# Passport QR Codes — Ô Diên One

Print these QR codes at each physical location. Each QR links to the scan URL with a secret token.

**Base URL:** Set `NEXT_PUBLIC_APP_URL` in production before generating printouts.

## Scan URLs (20 locations)

| # | Location | URL |
|---|----------|-----|
| 1 | UBND Xã Ô Diên | `/passport/scan/ubnd?t=ODIEN-UBND-2026` |
| 2 | Trường Tiểu Học | `/passport/scan/tieu-hoc?t=ODIEN-TH-2026` |
| 3 | Trường THCS | `/passport/scan/thcs?t=ODIEN-THCS-2026` |
| 4 | Chùa Ô Diên | `/passport/scan/chua?t=ODIEN-CHUA-2026` |
| 5 | Đình Làng | `/passport/scan/dinh-lang?t=ODIEN-DINH-2026` |
| 6 | Chợ Ô Diên | `/passport/scan/cho?t=ODIEN-CHO-2026` |
| 7 | Khu Tưởng Niệm | `/passport/scan/tuong-niem?t=ODIEN-TN-2026` |
| 8 | Công Viên | `/passport/scan/cong-vien?t=ODIEN-CV-2026` |
| 9 | Nhà Văn Hóa | `/passport/scan/nha-van-hoa?t=ODIEN-NVH-2026` |
| 10 | Thư Viện | `/passport/scan/thu-vien?t=ODIEN-TV-2026` |
| 11 | Sân Bóng | `/passport/scan/san-bong?t=ODIEN-SB-2026` |
| 12 | Bưu Điện | `/passport/scan/buu-dien?t=ODIEN-BD-2026` |
| 13 | Trạm Y Tế | `/passport/scan/tram-y-te?t=ODIEN-TYT-2026` |
| 14 | Hợp Tác Xã | `/passport/scan/htx?t=ODIEN-HTX-2026` |
| 15 | Ao Làng | `/passport/scan/ao-lang?t=ODIEN-AO-2026` |
| 16 | Cây Đa | `/passport/scan/cay-da?t=ODIEN-DA-2026` |
| 17 | Miếu Thờ | `/passport/scan/mieu?t=ODIEN-MIEU-2026` |
| 18 | Khu Dân Cư | `/passport/scan/khu-dan-cu?t=ODIEN-KDC-2026` |
| 19 | Cổng Chào | `/passport/scan/cong-chao?t=ODIEN-CC-2026` |
| 20 | Quảng Trường 01/07 | `/passport/scan/quang-truong?t=ODIEN-QT-2026` |

## Firebase setup for Passport

1. **Enable Anonymous Auth**  
   Firebase Console → Authentication → Sign-in method → Anonymous → Enable

2. **Deploy updated rules**
   ```bash
   npm run firebase:deploy:rules
   ```

3. **Test a scan locally**  
   Open: `http://localhost:3000/passport/scan/ubnd?t=ODIEN-UBND-2026`

## Badges

| Badge | Condition |
|-------|-----------|
| Nhà Thám Hiểm | 5+ locations |
| Sử Gia Ô Diên | All culture + government sites |
| Người Tiên Phong | First 100 passport holders |
| Kỷ Niệm 1 Năm | All 20 locations |

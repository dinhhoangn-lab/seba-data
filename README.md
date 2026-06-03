# Seba Sheet Sync

Tự động pull dữ liệu Google Sheet → commit JSON → serve qua jsdelivr CDN.

## Setup 1 lần

1. **Tạo GitHub repo public** (ví dụ `your-user/seba-data`).
2. Push toàn bộ folder này lên repo đó.
3. Vào repo → **Settings → Secrets and variables → Actions**:
   - **Secrets** tab → New secret:
     - Name: `APPSCRIPT_URL`
     - Value: `https://script.google.com/macros/s/AKfycbz.../exec` (base URL, không kèm `?name=`)
   - **Variables** tab → New variable:
     - Name: `SHEET_NAMES`
     - Value: `event1,event2,banner_home` (các sheet cần sync, phẩy ngăn cách)
4. Vào **Settings → Actions → General → Workflow permissions** → chọn **Read and write permissions** → Save.
5. Vào tab **Actions** → chọn workflow "Sync Google Sheets" → **Run workflow** để chạy thử.
6. Sau ~30 giây, folder `data/` sẽ có các file `.json`.

## URL JSON public (jsdelivr)

```
https://cdn.jsdelivr.net/gh/<user>/<repo>@main/data/<sheet_name>.json
```

Ví dụ: `https://cdn.jsdelivr.net/gh/your-user/seba-data@main/data/event1.json`

## Nhúng vào trang HTML

Thêm đoạn sau vào file HTML, trước thẻ đóng `</body>`:

```html
<div id="seba" data-name="プリンス_新富良野" data-color="#00ff00"></div>
<script src="seba.js"></script>
```

- `data-name` — tên sheet cần hiển thị (đúng tên file trong Google Drive)
- `data-color` — màu hiển thị (hex color)

## Cập nhật data

- Edit Google Sheet như bình thường.
- Tối đa 30 phút sau, Action sẽ tự sync.
- Muốn update ngay: vào tab Actions → Run workflow.
- jsdelivr cache ~12h theo branch. Để force refresh dùng commit hash:
  `https://cdn.jsdelivr.net/gh/<user>/<repo>@<commit-sha>/data/<name>.json`

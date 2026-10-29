# LUMEN ARCHIVE • Professional Photography Portfolio

Website portfolio ảnh nghệ thuật và tư liệu chuyên nghiệp lấy cảm hứng từ trải nghiệm xem ảnh điện ảnh của 500px, được xây dựng với nhận diện thương hiệu độc lập, hiệu năng cao, tối ưu hóa hiển thị hình ảnh trên mọi thiết bị và hệ thống quản trị chuyên sâu.

---

## 🌟 Tính Năng Nổi Bật

### 1. Trải Nghiệm Khách Xem (Public Gallery)
- **Thiết kế Editorial Gallery cao cấp**: Tông màu tối (Obsidian / Dark Slate) trung tính làm nổi bật tối đa dải màu và chi tiết của tác phẩm nhiếp ảnh.
- **Hero Banner điện ảnh**: Ảnh bìa kích thước lớn toàn màn hình kết hợp tuyên ngôn nghệ thuật và phím tắt chuyển nhanh vào khu vực trưng bày.
- **Lưới ảnh linh hoạt & đa dạng tỷ lệ**: Hỗ trợ 2 chế độ hiển thị (*Lưới cân bằng* và *Bố cục so le nghệ thuật*) với hiệu ứng zoom mượt mà khi hover.
- **Bộ lọc & Tìm kiếm thời gian thực**: Lọc nhanh theo năm sáng tác (2026, 2025, 2024...) và tìm kiếm theo tiêu đề, thể loại, địa danh.
- **Tải thêm (Load More) & Trạng thái tải**: Phân trang mượt mà kèm khung xương (skeleton shimmer effect), trạng thái khi không tìm thấy kết quả và trang lỗi thân thiện.

### 2. Trang Chi Tiết Bộ Ảnh (`/project/[slug]`)
- **Đường dẫn chuẩn SEO**: Định dạng `/project/[slug]` thân thiện với người dùng và chia sẻ mạng xã hội.
- **Metadata OpenGraph riêng biệt**: Tự động sinh OpenGraph tags, Twitter Card và ảnh đại diện riêng cho từng dự án.
- **Bố cục nhịp điệu ấn bản (Editorial Flow)**: Tác phẩm được sắp xếp xen kẽ giữa khung hình điện ảnh toàn cảnh và khung hình đôi, giữ khoảng cách cân đối và tôn trọng tỷ lệ ảnh gốc.
- **Fullscreen Lightbox Viewer (Chuẩn 500px)**:
  - Bấm vào bất kỳ ảnh nào để xem toàn màn hình không viền.
  - Phím điều hướng bàn phím: Mũi tên trái/phải (`←` / `→`) hoặc Phím cách (`Space`) để chuyển ảnh, phím `F` để mở full màn hình, phím `I` để bật/tắt thông tin, phím `Esc` để đóng.
  - Hỗ trợ cử chỉ vuốt (Touch Swipe) mượt mà trên smartphone và tablet.
  - Hiển thị số thứ tự ảnh (`03 / 16`), chú thích, thông tin thiết bị và nút sao chép link ảnh nhanh.

### 3. Cổng Quản Trị & Đăng Nhập Admin (`/admin`)
- **Bảo mật**: Cơ chế xác thực an toàn qua Supabase Auth, bảo vệ toàn bộ các tuyến đường quản trị. Tuyệt đối không ghi cứng mật khẩu trong mã nguồn.
- **Hỗ trợ Quick Admin Demo**: Cho phép kiểm thử trải nghiệm quản trị ngay lập tức mà không bị gián đoạn kể cả khi chưa kịp cấu hình tài khoản Supabase.
- **Bảng điều khiển trực quan (Dashboard)**:
  - Thống kê thời gian thực: Tổng bộ ảnh, Đã xuất bản, Bản nháp (Draft), Tổng số lượng tác phẩm.
  - Lọc theo trạng thái và tìm kiếm dự án.
  - Hộp thoại xác nhận trước khi xóa dự án (chống xóa nhầm).
- **Trình tạo & chỉnh sửa bộ ảnh chuyên sâu**:
  1. **Tiêu đề**: Bắt buộc.
  2. **Slug**: Tự động sinh từ tiêu đề (chuẩn hóa tiếng Việt bỏ dấu `đ -> d`, `sương sớm -> suong-som`), cho phép chỉnh sửa thủ công và kiểm tra trùng lặp thời gian thực.
  3. **Năm sáng tác**: Tùy chọn năm (mặc định năm hiện tại).
  4. **Mô tả & Câu chuyện**: Nhập liệu nhiều dòng.
  5. **Tải nhiều ảnh cùng lúc**: Hỗ trợ kéo thả (Drag & Drop), hiển thị tiến độ upload, phát hiện ảnh lỗi và có nút thử tải lại (Retry).
  6. **Thêm ảnh qua URL**: Hỗ trợ dán trực tiếp đường dẫn ảnh chất lượng cao (Unsplash, CDN...).
  7. **Chọn ảnh bìa**: Nhấn biểu tượng ngôi sao để chỉ định ảnh bìa chính (Cover Image).
  8. **Sắp xếp thứ tự ảnh**: Phím di chuyển lên/xuống nhanh chóng.
  9. **Xem trước (Preview Mode)**: Mô phỏng giao diện công khai trước khi quyết định xuất bản.
  10. **Xuất bản trực tiếp**: Lưu dữ liệu vào cơ sở dữ liệu và tự động chuyển hướng đến trang công khai của bộ ảnh đã xuất bản.

### 4. REST API — Đăng bài & quản trị qua HTTP (`/api/projects`)
- **Đọc công khai**: Mọi người truy cập được danh sách và chi tiết các bộ ảnh `published` (kèm phân trang, lọc năm, tìm kiếm) — dùng cho app di động, embed, hay bên thứ 3.
- **Ghi có bảo vệ**: Tạo / sửa / xoá bộ ảnh yêu cầu API key (`x-api-key` hoặc `Authorization: Bearer`). Slug tự sinh từ tiêu đề (chuẩn hóa tiếng Việt) và kiểm tra trùng lặp.
- **Riêng tư bản nháp**: Draft không bao giờ trả về cho người dùng ẩn danh — chỉ chủ key đọc được.
- **Hai chế độ lưu trữ**: Ghi thẳng vào Supabase qua service-role khi có `SUPABASE_SERVICE_ROLE_KEY`; nếu không sẽ rơi về local fallback (demo mode) để test ngay không cần DB.

#### Bảng endpoint

| Endpoint | Method | Auth | Mô tả |
|---|---|---|---|
| `/api/projects` | `GET` | Public | Danh sách published. Query: `?year=2025&search=fog&limit=12&offset=0`. Thêm `&status=draft`/`all` cần API key. |
| `/api/projects` | `POST` | `x-api-key` | Tạo bộ ảnh mới. |
| `/api/projects/[id]` | `GET` | Public | Chi tiết theo id, hoặc `?by=slug` để tra theo slug. Draft chỉ key-holder đọc. |
| `/api/projects/[id]` | `PATCH` | `x-api-key` | Cập nhật các field gửi kèm; `images` nếu có sẽ thay toàn bộ gallery. |
| `/api/projects/[id]` | `DELETE` | `x-api-key` | Xoá vĩnh viễn bộ ảnh và ảnh con. |

#### Đăng bài qua API — ví dụ

```bash
curl -X POST "http://localhost:3000/api/projects" \
  -H "Content-Type: application/json" \
  -H "x-api-key: your-admin-api-key" \
  -d '{
    "title": "Hoàng Hôn Hồ Tây",
    "year": 2026,
    "status": "published",
    "category": "Phong cảnh",
    "location": "Hà Nội, Việt Nam",
    "camera_info": "Canon R5",
    "description": "Bộ ảnh đăng qua REST API.",
    "published_at": "2024-05-20T10:00:00Z",   // tuỳ chọn — ngày đăng tải (mặc định: now khi publish)
    "created_at": "2024-05-20T09:00:00Z",     // tuỳ chọn — ngày tạo (mặc định: now)
    "images": [
      { "image_url": "https://.../a.jpg", "alt_text": "Mô tả ảnh", "caption": "Chú thích" },
      { "image_url": "https://.../b.jpg", "alt_text": "Mô tả ảnh 2" }
    ]
  }'
```

`slug`, `cover_image`, `published_at`, `created_at` là tuỳ chọn — slug tự sinh từ `title`, cover mặc định lấy ảnh đầu tiên, `published_at`/`created_at` mặc định là thời điểm hiện tại. Gửi `published_at`/`created_at` (ISO-8601) khi cần backdate bài viết. Trả về `201` kèm `project` và `url` công khai.

| Field | Bắt buộc | Mặc định | Ghi chú |
|---|---|---|---|
| `title` | ✅ | — | Tiêu đề bộ ảnh |
| `slug` | — | từ `title` | Chuẩn hóa tiếng Việt, kiểm tra trùng |
| `year` | — | năm hiện tại | Năm sáng tác (integer) |
| `status` | — | `draft` | `draft` \| `published` |
| `published_at` | — | `now` | Chỉ áp dụng khi `status=published` |
| `created_at` | — | `now` | Ngày tạo bản ghi |
| `images[]` | ✅ (≥1) | — | `image_url` bắt buộc; `alt_text`, `caption`, `width`, `height` tuỳ chọn |

#### Biến môi trường API

```env
# Chuỗi bí mật xác thực write endpoints (bắt buộc trong production)
ADMIN_API_KEY=change-me-to-a-long-random-secret

# Server-side ghi thẳng vào Supabase, bypass RLS — KHÔNG prefix NEXT_PUBLIC_
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> **Bảo mật**: không có `ADMIN_API_KEY` thì trong `production` các write endpoint trả `503`, còn `development` mở để test nhưng draft vẫn bị chặn. `SUPABASE_SERVICE_ROLE_KEY` chỉ dùng phía server — tuyệt đối không đặt sau `NEXT_PUBLIC_` và không commit vào git.

---

## 🛠️ Công Nghệ Sử Dụng

- **Web Framework**: Next.js 16 (App Router) & React 19
- **Ngôn ngữ**: TypeScript 5
- **Giao diện**: Tailwind CSS 4 & Vanilla CSS Variables
- **Icons**: Lucide React
- **Cơ sở dữ liệu & Xác thực**: Supabase Database (PostgreSQL) + Supabase Auth
- **Lưu trữ tệp tin**: Supabase Storage (Bucket `project-images`)

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Cục Bộ

### 1. Cài đặt các gói phụ thuộc
```bash
npm install
```

### 2. Thiết lập biến môi trường
Tạo file `.env.local` tại thư mục gốc của dự án dựa trên mẫu `.env.example`:

```bash
cp .env.example .env.local
```

Điền các thông số Supabase của bạn vào `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

> **Lưu ý tiện ích**: Nếu bạn chưa điền thông số Supabase, website sẽ tự động kích hoạt **Chế độ Demo Cục bộ (Local Fallback Mode)** với sẵn 6 bộ ảnh mẫu nghệ thuật độ nét cao. Mọi thao tác tạo, sửa, xóa, tải ảnh vẫn hoạt động 100% mượt mà ngay trên trình duyệt của bạn!

### 3. Chạy môi trường phát triển
```bash
npm run dev
```
Mở trình duyệt tại: `http://localhost:3000` (hoặc cổng hiển thị trên terminal).

### 4. Kiểm tra build sản phẩm
```bash
npm run build
```

---

## 🗄️ Hướng Dẫn Thiết Lập Supabase

### Bước 1: Khởi tạo bảng và Row Level Security (RLS)
Mở trang quản trị dự án trên [Supabase Dashboard](https://supabase.com), vào mục **SQL Editor** và chạy toàn bộ nội dung trong tệp [`supabase/schema.sql`](./supabase/schema.sql).

Tệp SQL này bao gồm:
1. Kích hoạt tiện ích mở rộng UUID (`uuid-ossp`).
2. Bảng `projects`: Lưu thông tin các bộ ảnh, slug, năm, ảnh bìa, trạng thái bản nháp/xuất bản.
3. Bảng `project_images`: Lưu chi tiết các bức ảnh, thứ tự sắp xếp (`sort_order`), chú thích, văn bản thay thế.
4. Các chỉ mục (Indexes) trên `slug`, `status`, `year`, `project_id`, `created_at` giúp truy vấn cực nhanh.
5. Thiết lập **Row Level Security (RLS)**:
   - Khách xem thông thường chỉ đọc được các bộ ảnh và ảnh có `status = 'published'`.
   - Admin đã đăng nhập có toàn quyền Thêm, Sửa, Xóa (`ALL`).

### Bước 2: Thiết lập Bucket Lưu Trữ Ảnh (Storage Bucket)
Tệp SQL đã tự động khởi tạo bucket `project-images` với chế độ `public = true` và các chính sách bảo mật cho phép công khai đọc và admin upload. Bạn có thể kiểm tra lại trong mục **Storage** trên Supabase Dashboard.

---

## 📂 Cấu Trúc Mã Nguồn

```text
├── src/
│   ├── app/
│   │   ├── layout.tsx                     # Layout gốc, cấu hình font chữ và SEO
│   │   ├── globals.css                    # CSS toàn cục, chủ đề Dark Gallery, hiệu ứng mờ
│   │   ├── page.tsx                       # Trang chủ: Hero banner, bộ lọc, tìm kiếm, danh sách
│   │   ├── not-found.tsx                  # Trang thông báo lỗi 404 tùy biến
│   │   ├── project/[slug]/
│   │   │   ├── page.tsx                   # Trang chi tiết bộ ảnh (Server Component & Dynamic SEO)
│   │   │   └── ProjectDetailClient.tsx    # Thành phần tương tác, danh sách ảnh, Lightbox trigger
│   │   ├── api/
│   │   │   └── projects/
│   │   │       ├── route.ts               # GET list (public) + POST create (API key)
│   │   │       └── [id]/route.ts          # GET detail + PATCH update + DELETE (API key)
│   │   └── admin/
│   │       ├── layout.tsx                 # Layout trang quản trị, kiểm tra quyền đăng nhập
│   │       ├── login/page.tsx             # Trang đăng nhập Admin an toàn
│   │       ├── page.tsx                   # Bảng điều khiển quản trị danh sách bộ ảnh & thao tác
│   │       └── projects/
│   │           ├── new/page.tsx           # Tạo mới bộ ảnh
│   │           └── [id]/edit/page.tsx     # Chỉnh sửa bộ ảnh hiện có
│   ├── components/
│   │   ├── Navbar.tsx                     # Thanh điều hướng trên cùng, logo, responsive menu
│   │   ├── HeroBanner.tsx                 # Banner mở đầu phong cách 500px nổi bật
│   │   ├── ProjectCard.tsx                # Thẻ hiển thị bộ ảnh kèm hiệu ứng zoom ảnh bìa
│   │   ├── Lightbox.tsx                   # Trình xem ảnh toàn màn hình điều khiển phím/vuốt
│   │   ├── Footer.tsx                     # Chân trang, tuyên ngôn nghệ thuật và liên hệ
│   │   └── admin/
│   │       └── ProjectForm.tsx            # Form tạo/sửa bộ ảnh, kéo thả ảnh, chọn ảnh bìa, xem trước
│   ├── lib/
│   │   ├── auth-service.ts                # Dịch vụ xác thực Supabase Auth + Demo session
│   │   ├── data-service.ts                # Tầng truy xuất dữ liệu kép (Supabase + Local fallback)
│   │   ├── api-utils.ts                   # Auth API key + validate payload cho REST API
│   │   ├── mock-data.ts                   # Dữ liệu ảnh nghệ thuật mẫu độ nét cao
│   │   ├── utils/slugify.ts               # Bộ sinh slug tự động chuẩn hóa tiếng Việt
│   │   └── supabase/
│   │       ├── client.ts                  # Supabase client (anon key, phía client/đọc public)
│   │       └── admin.ts                   # Supabase admin (service role, chỉ dùng phía server)
│   └── types/
│       └── portfolio.ts                   # Định nghĩa kiểu dữ liệu TypeScript
├── supabase/
│   └── schema.sql                         # Kịch bản khởi tạo bảng, RLS và Storage Supabase
├── .env.example                           # Mẫu cấu hình biến môi trường
└── next.config.ts                         # Cấu hình Next.js cho phép tải ảnh từ xa
```

---

## 🎨 Tùy Biến Thương Hiệu & Bản Quyền

- Tên thương hiệu mặc định là **LUMEN ARCHIVE**. Bạn có thể thay đổi logo chữ hoặc thêm logo hình trong file [`src/components/Navbar.tsx`](./src/components/Navbar.tsx).
- Tuyên ngôn nghệ thuật và thông tin liên hệ tùy biến tại [`src/components/Footer.tsx`](./src/components/Footer.tsx).

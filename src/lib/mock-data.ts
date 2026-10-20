import { Project } from '@/types/portfolio';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    title: 'Sương Sớm Ba Vì - The Fog of Highland',
    slug: 'suong-som-ba-vi-the-fog-of-highland',
    year: 2026,
    category: 'Phong cảnh & Phim tài liệu',
    location: 'Ba Vì, Hà Nội, Việt Nam',
    camera_info: 'Leica M11 • Summilux-M 35mm f/1.4',
    description: 'Một buổi sớm huyền ảo giữa thung lũng Ba Vì khi sương trắng còn quấn chặt từng tán thông già. Những khoảng lặng giữa ánh sáng ban mai và thinh không gợi nhớ về sự thanh khiết tuyệt đối của thiên nhiên hoang sơ.',
    cover_image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
    status: 'published',
    created_at: '2026-03-15T08:00:00Z',
    published_at: '2026-03-15T10:00:00Z',
    images: [
      {
        id: 'img-101',
        project_id: 'proj-001',
        image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85',
        alt_text: 'Thung lũng ngập tràn sương sớm trong tia nắng vàng đầu tiên',
        caption: 'Bình minh phủ lên ngọn đồi lớp sương mỏng như lụa',
        sort_order: 0,
        width: 2000,
        height: 1333,
        created_at: '2026-03-15T08:05:00Z'
      },
      {
        id: 'img-102',
        project_id: 'proj-001',
        image_url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Tia sáng xuyên qua rừng thông sương mù',
        caption: 'Tia nắng rọi qua kẽ lá thông lúc 6:15 sáng',
        sort_order: 1,
        width: 1600,
        height: 2000,
        created_at: '2026-03-15T08:10:00Z'
      },
      {
        id: 'img-103',
        project_id: 'proj-001',
        image_url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=85',
        alt_text: 'Đỉnh núi vươn lên trên biển mây bồng bềnh',
        caption: 'Biển mây vắt ngang triền đá lạnh',
        sort_order: 2,
        width: 2000,
        height: 1200,
        created_at: '2026-03-15T08:15:00Z'
      },
      {
        id: 'img-104',
        project_id: 'proj-001',
        image_url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Tán cây cổ thụ chìm trong màn sương mờ',
        caption: 'Hơi thở của khu rừng già',
        sort_order: 3,
        width: 1600,
        height: 1067,
        created_at: '2026-03-15T08:20:00Z'
      },
      {
        id: 'img-105',
        project_id: 'proj-001',
        image_url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Lối mòn xuyên qua rừng rậm ẩm ướt',
        caption: 'Con đường đất dẫn vào thung lũng bí ẩn',
        sort_order: 4,
        width: 1600,
        height: 1067,
        created_at: '2026-03-15T08:25:00Z'
      }
    ]
  },
  {
    id: 'proj-002',
    title: 'Hình Học Đô Thị Tokyo - Minimalist Tokyo',
    slug: 'hinh-hoc-do-thi-tokyo-minimalist-tokyo',
    year: 2025,
    category: 'Kiến trúc hiện đại',
    location: 'Ginza & Shinjuku, Tokyo, Japan',
    camera_info: 'Hasselblad X2D 100C • XCD 45mm f/4 P',
    description: 'Khảo cứu thẩm mỹ tối giản trong kiến trúc hiện đại tại Tokyo. Sự tương phản sắc nét giữa bóng đổ, bê tông trần và các đường xiên bất tận tạo nên một bản hòa ca thị giác vừa tĩnh mịch vừa mãnh liệt.',
    cover_image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85',
    status: 'published',
    created_at: '2025-11-20T10:00:00Z',
    published_at: '2025-11-20T14:30:00Z',
    images: [
      {
        id: 'img-201',
        project_id: 'proj-002',
        image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85',
        alt_text: 'Mảng tường bê tông tối giản với bóng đổ góc cạnh',
        caption: 'Góc giao nhau của ánh sáng và bóng tối tại Ginza',
        sort_order: 0,
        width: 2000,
        height: 1333,
        created_at: '2025-11-20T10:05:00Z'
      },
      {
        id: 'img-202',
        project_id: 'proj-002',
        image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Tòa cao ốc kính phản chiếu bầu trời xanh ngắt',
        caption: 'Mặt dựng kính kiến trúc đương đại',
        sort_order: 1,
        width: 1600,
        height: 2000,
        created_at: '2025-11-20T10:10:00Z'
      },
      {
        id: 'img-203',
        project_id: 'proj-002',
        image_url: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Cầu thang xoắn ốc đối xứng nhìn từ trên xuống',
        caption: 'Hình học đối xứng của giếng trời',
        sort_order: 2,
        width: 1600,
        height: 1200,
        created_at: '2025-11-20T10:15:00Z'
      },
      {
        id: 'img-204',
        project_id: 'proj-002',
        image_url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Khung cảnh Tokyo lúc lên đèn với đường chân trời sắc lạnh',
        caption: 'Chiều tà buông xuống tháp truyền hình Tokyo',
        sort_order: 3,
        width: 1600,
        height: 1067,
        created_at: '2025-11-20T10:20:00Z'
      }
    ]
  },
  {
    id: 'proj-003',
    title: 'Ánh Sáng Biển Vắng - Nordic Solitude',
    slug: 'anh-sang-bien-vang-nordic-solitude',
    year: 2025,
    category: 'Nghệ thuật & Biển cả',
    location: 'Quần đảo Lofoten, Na Uy',
    camera_info: 'Sony A7R V • FE 24-70mm f/2.8 GM II',
    description: 'Những ngày đông lạnh giá ở quần đảo Lofoten, nơi thời gian như dừng lại trước từng đợt sóng vỗ vào vách đá tuyết. Bộ ảnh ghi lại sự cô độc thi vị và vẻ đẹp nguyên sơ của Bắc Âu dưới dải cực quang và ánh chạng vạng.',
    cover_image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
    status: 'published',
    created_at: '2025-08-10T12:00:00Z',
    published_at: '2025-08-10T16:00:00Z',
    images: [
      {
        id: 'img-301',
        project_id: 'proj-003',
        image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=85',
        alt_text: 'Bãi biển cát mịn và sóng vỗ rì rào lúc hoàng hôn',
        caption: 'Mặt biển yên bình trước khi bão tuyết tràn về',
        sort_order: 0,
        width: 2000,
        height: 1333,
        created_at: '2025-08-10T12:05:00Z'
      },
      {
        id: 'img-302',
        project_id: 'proj-003',
        image_url: 'https://images.unsplash.com/photo-1519046904884-53103b34b271?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Dấu chân lẻ loi trên bờ cát hoang vắng',
        caption: 'Vết dấu thời gian trôi theo ngọn triều',
        sort_order: 1,
        width: 1600,
        height: 2000,
        created_at: '2025-08-10T12:10:00Z'
      },
      {
        id: 'img-303',
        project_id: 'proj-003',
        image_url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Sóng cuộn trào bọt trắng xóa va vào đá ngầm',
        caption: 'Sức mạnh nguyên thủy của đại dương',
        sort_order: 2,
        width: 1600,
        height: 1067,
        created_at: '2025-08-10T12:15:00Z'
      }
    ]
  },
  {
    id: 'proj-004',
    title: 'Nhịp Thở Phố Cổ - Saigon Noir',
    slug: 'nhip-tho-pho-co-saigon-noir',
    year: 2024,
    category: 'Đường phố & Đời sống',
    location: 'Chợ Lớn & Quận 5, TP. Hồ Chí Minh',
    camera_info: 'Fujifilm GFX 100 II • GF 55mm f/1.7 R WR',
    description: 'Đêm Sài Gòn qua lăng kính điện ảnh cổ điển. Những ánh đèn neon phản chiếu trên mặt đường ướt mưa, làn khói từ gánh hủ tiếu ven đường và những gương mặt mưu sinh trầm lặng mang theo câu chuyện của thời gian.',
    cover_image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=85',
    status: 'published',
    created_at: '2024-10-05T15:00:00Z',
    published_at: '2024-10-05T18:00:00Z',
    images: [
      {
        id: 'img-401',
        project_id: 'proj-004',
        image_url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=2000&q=85',
        alt_text: 'Ánh đèn neon đường phố phản chiếu rực rỡ',
        caption: 'Ánh sáng neon soi rọi con hẻm cổ kính',
        sort_order: 0,
        width: 2000,
        height: 1333,
        created_at: '2024-10-05T15:05:00Z'
      },
      {
        id: 'img-402',
        project_id: 'proj-004',
        image_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Chân dung người phụ nữ trong ánh sáng rạp phim',
        caption: 'Khoảnh khắc dừng lại của ánh nhìn',
        sort_order: 1,
        width: 1600,
        height: 2000,
        created_at: '2024-10-05T15:10:00Z'
      },
      {
        id: 'img-403',
        project_id: 'proj-004',
        image_url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Dòng xe chuyển động thành vệt sáng dài trên cầu',
        caption: 'Vệt sáng dòng xe qua cầu Ba Son',
        sort_order: 2,
        width: 1600,
        height: 1067,
        created_at: '2024-10-05T15:15:00Z'
      }
    ]
  },
  {
    id: 'proj-005',
    title: 'Dư Âm Của Gió - Dune Whispers',
    slug: 'du-am-cua-gio-dune-whispers',
    year: 2024,
    category: 'Trừu tượng & Thiên nhiên',
    location: 'Bàu Trắng, Bình Thuận, Việt Nam',
    camera_info: 'Leica SL2-S • APO-Summicron-SL 50mm f/2 ASPH',
    description: 'Sự biến chuyển liên tục của cát và gió dưới ánh nắng rực rỡ buổi hoàng hôn. Những đường vân cát uốn lượn như nét vẽ điêu khắc của tự nhiên trên nền trời bao la.',
    cover_image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85',
    status: 'published',
    created_at: '2024-05-18T09:00:00Z',
    published_at: '2024-05-18T11:00:00Z',
    images: [
      {
        id: 'img-501',
        project_id: 'proj-005',
        image_url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=2000&q=85',
        alt_text: 'Đồi cát uốn lượn với gợn sóng cát mịn',
        caption: 'Đường cong điêu khắc của gió trên đồi cát trắng',
        sort_order: 0,
        width: 2000,
        height: 1333,
        created_at: '2024-05-18T09:05:00Z'
      },
      {
        id: 'img-502',
        project_id: 'proj-005',
        image_url: 'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1600&q=85',
        alt_text: 'Bóng người độc hành in dài trên sườn cát',
        caption: 'Bóng dài hoàng hôn lúc 17:40',
        sort_order: 1,
        width: 1600,
        height: 1067,
        created_at: '2024-05-18T09:10:00Z'
      }
    ]
  },
  {
    id: 'proj-006',
    title: 'Gốm Mộc Phù Lãng - Craft of Clay',
    slug: 'gom-moc-phu-lang-craft-of-clay',
    year: 2026,
    category: 'Chân dung nghề thủ công',
    location: 'Làng gốm Phù Lãng, Bắc Ninh',
    camera_info: 'Fujifilm X-T5 • XF 33mm f/1.4 R LM WR',
    description: 'Bản thảo phóng sự ảnh về đôi bàn tay của những người nghệ nhân gìn giữ kỹ nghệ nung gốm men da lươn truyền thống qua nhiều thế kỷ.',
    cover_image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1600&q=85',
    status: 'draft',
    created_at: '2026-04-01T14:00:00Z',
    published_at: null,
    images: [
      {
        id: 'img-601',
        project_id: 'proj-006',
        image_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=2000&q=85',
        alt_text: 'Đôi bàn tay thợ gốm nhào nặn đất sét trên bàn xoay',
        caption: 'Bàn tay tài hoa của nghệ nhân gốm Phù Lãng',
        sort_order: 0,
        width: 2000,
        height: 1333,
        created_at: '2026-04-01T14:05:00Z'
      }
    ]
  }
];

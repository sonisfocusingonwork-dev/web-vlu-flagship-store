<?php
require_once dirname(__DIR__, 2) . '/backend/lib/product_links.php';
/**
 * VLU FLAGSHIP STORE – Header Component
 * Chuẩn UI/UX Apple 2026: Tối giản, sang trọng, hiệu ứng kính mờ (glassmorphism).
 * Thanh điều hướng ngang gồm 7 danh mục chính (Điện thoại, Laptop, iPad, Tai nghe, Loa, Phụ kiện, Đồng hồ điện tử).
 * Tất cả 7 danh mục đều có Mega-Menu thả xuống toàn màn hình, hỗ trợ thanh cuộn dọc (max-height: 75vh).
 * Đã dọn dẹp sạch toàn bộ nhãn thừa, badge quảng cáo, chú thích phụ – chỉ hiển thị Tiêu đề nhóm/hãng và Tên dòng sản phẩm.
 */

if (!function_exists('e')) {
    function e($val): string {
        return htmlspecialchars((string)$val, ENT_QUOTES, 'UTF-8');
    }
}

$cartCount = isset($cartCount) ? (int)$cartCount : 0;

/* ==========================================================================
   DỮ LIỆU TOÀN BỘ 7 DANH MỤC MEGA-MENU
   ========================================================================== */
$navMegaCategories = [

    /* ---------- 1. ĐIỆN THOẠI (5 CỘT) ---------- */
    'dien-thoai' => [
        'name' => 'Điện thoại',
        'icon' => '<svg class="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>',
        'grid_class' => 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5',
        'groups' => [
            [
                'title' => 'Apple iPhone',
                'sections' => [
                    [
                        'title' => 'iPhone 18 Series',
                        'items' => ['iPhone 18 Pro Max', 'iPhone 18 Pro', 'iPhone 18', 'iPhone Air'],
                    ],
                    [
                        'title' => 'iPhone 17 Series',
                        'items' => ['iPhone 17 Pro Max', 'iPhone 17 Pro', 'iPhone 17'],
                    ],
                    [
                        'title' => 'iPhone 16 Series',
                        'items' => ['iPhone 16 Pro Max', 'iPhone 16 Pro', 'iPhone 16 Plus', 'iPhone 16'],
                    ],
                    [
                        'title' => 'iPhone 15 Series',
                        'items' => ['iPhone 15 Pro Max', 'iPhone 15 Pro', 'iPhone 15 Plus', 'iPhone 15'],
                    ],
                ],
            ],
            [
                'title' => 'Samsung Galaxy',
                'sections' => [
                    [
                        'title' => 'Dòng Galaxy S',
                        'items' => [
                            'Galaxy S26 Ultra', 'Galaxy S26+', 'Galaxy S26',
                            'Galaxy S25 Ultra', 'Galaxy S25+', 'Galaxy S25',
                            'Galaxy S24 Ultra', 'Galaxy S24 FE',
                        ],
                    ],
                    [
                        'title' => 'Dòng Màn Hình Gập',
                        'items' => [
                            'Galaxy Z Fold8', 'Galaxy Z Flip8',
                            'Galaxy Z Fold7', 'Galaxy Z Flip7',
                            'Galaxy Z Fold6', 'Galaxy Z Flip6',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Xiaomi',
                'sections' => [
                    [
                        'title' => 'Xiaomi 16 Series',
                        'items' => ['Xiaomi 16 Ultra', 'Xiaomi 16 Pro', 'Xiaomi 16'],
                    ],
                    [
                        'title' => 'Xiaomi 15 Series',
                        'items' => ['Xiaomi 15 Ultra', 'Xiaomi 15 Pro', 'Xiaomi 15'],
                    ],
                    [
                        'title' => 'Xiaomi 14 Series',
                        'items' => ['Xiaomi 14 Ultra', 'Xiaomi 14 Pro', 'Xiaomi 14'],
                    ],
                ],
            ],
            [
                'title' => 'OPPO',
                'sections' => [
                    [
                        'title' => 'Dòng Flagship Find',
                        'items' => [
                            'Find X9 Ultra', 'Find X9 Pro',
                            'Find X8 Ultra', 'Find X8 Pro', 'Find X8',
                            'Find N5', 'Find N3 Flip',
                        ],
                    ],
                    [
                        'title' => 'Dòng Reno',
                        'items' => [
                            'Reno13 Pro+ 5G', 'Reno13 Pro 5G', 'Reno13 5G',
                            'Reno12 Pro 5G', 'Reno12 5G',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Redmi',
                'sections' => [
                    [
                        'title' => 'Dòng K-Series',
                        'items' => ['Redmi K80 Pro', 'Redmi K80', 'Redmi K70 Ultra', 'Redmi K70'],
                    ],
                    [
                        'title' => 'Dòng Note-Series',
                        'items' => [
                            'Redmi Note 15 Pro+', 'Redmi Note 15 Pro',
                            'Redmi Note 14 Pro+', 'Redmi Note 14 Pro', 'Redmi Note 14',
                        ],
                    ],
                ],
            ],
        ],
    ],

    /* ---------- 2. LAPTOP (6 CỘT) ---------- */
    'laptop' => [
        'name' => 'Laptop',
        'icon' => '<svg class="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="18" height="12" x="3" y="4" rx="2"/><path d="M2 20h20"/></svg>',
        'grid_class' => 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 xl:gap-5',
        'groups' => [
            [
                'title' => '💻 Laptop học tập – văn phòng',
                'items' => [
                    'ASUS Vivobook', 'ASUS ExpertBook', 'Lenovo IdeaPad', 'Lenovo ThinkBook',
                    'HP Pavilion', 'HP 14 / HP 15', 'Acer Aspire', 'Dell Inspiron',
                    'MSI Modern', 'Samsung Galaxy Book',
                ],
            ],
            [
                'title' => '🎮 Laptop gaming',
                'items' => [
                    'ASUS TUF Gaming', 'ASUS ROG Strix', 'ASUS ROG Zephyrus',
                    'Lenovo LOQ', 'Lenovo Legion', 'Acer Nitro', 'Acer Predator Helios',
                    'MSI Thin', 'MSI Katana', 'MSI Cyborg', 'MSI Raider',
                    'HP Victus', 'HP Omen', 'Dell G Series', 'Alienware',
                ],
            ],
            [
                'title' => '🎨 Laptop đồ họa / sáng tạo',
                'items' => [
                    'ASUS ProArt', 'ASUS Vivobook Pro', 'Lenovo Yoga Pro',
                    'Lenovo ThinkPad P Series', 'HP ZBook', 'Dell Precision',
                    'MSI Creator', 'Acer ConceptD',
                ],
            ],
            [
                'title' => '💼 Laptop doanh nhân – cao cấp',
                'items' => [
                    'Lenovo ThinkPad', 'Lenovo ThinkPad X1', 'HP EliteBook', 'HP Spectre',
                    'Dell Latitude', 'Dell XPS', 'ASUS Zenbook',
                    'Microsoft Surface Laptop', 'Samsung Galaxy Book Pro',
                ],
            ],
            [
                'title' => '🍎 MacBook',
                'items' => [
                    'MacBook Air', 'MacBook Pro',
                ],
            ],
            [
                'title' => '🔥 Dòng đặc biệt / hiệu năng cao',
                'items' => [
                    'ASUS ROG Zephyrus', 'Lenovo Legion Pro', 'MSI Vector', 'MSI Raider',
                    'Razer Blade', 'Alienware', 'ASUS ProArt Studiobook',
                    'HP ZBook Fury', 'Dell Precision',
                ],
            ],
        ],
    ],

    /* ---------- 3. IPAD & TABLET (12 NHÓM) ---------- */
    'ipad' => [
        'name' => 'iPad',
        'icon' => '<svg class="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect width="16" height="20" x="4" y="2" rx="2"/><circle cx="12" cy="18" r="1"/></svg>',
        'grid_class' => 'mega-grid-flow',
        'groups' => [
            [
                'title' => '🍎 Apple',
                'items' => ['iPad', 'iPad mini', 'iPad Air', 'iPad Pro'],
            ],
            [
                'title' => '🟢 Samsung Galaxy Tab',
                'items' => [
                    'Galaxy Tab A', 'Galaxy Tab S', 'Galaxy Tab S FE',
                    'Galaxy Tab S9 / S10 / S11 Series', 'Galaxy Tab Active',
                ],
            ],
            [
                'title' => '🔵 Xiaomi',
                'items' => [
                    'Xiaomi Pad', 'Xiaomi Pad 5 / 6 / 7 Series',
                    'Redmi Pad', 'Redmi Pad SE', 'Xiaomi Pad Pro',
                ],
            ],
            [
                'title' => '🟣 Huawei',
                'items' => [
                    'Huawei MatePad', 'MatePad SE', 'MatePad Air',
                    'MatePad Pro', 'MatePad Paper',
                ],
            ],
            [
                'title' => '🔴 Lenovo',
                'items' => [
                    'Lenovo Tab', 'Lenovo Tab M Series', 'Lenovo Tab P Series',
                    'Lenovo Legion Tab', 'Lenovo Yoga Tab',
                ],
            ],
            [
                'title' => '🟠 OPPO',
                'items' => ['OPPO Pad', 'OPPO Pad Air', 'OPPO Pad 2', 'OPPO Pad 3 Series'],
            ],
            [
                'title' => '🟡 OnePlus',
                'items' => ['OnePlus Pad', 'OnePlus Pad 2', 'OnePlus Pad Go'],
            ],
            [
                'title' => '🟤 vivo',
                'items' => ['vivo Pad', 'vivo Pad Air', 'vivo Pad SE', 'vivo Pad Pro'],
            ],
            [
                'title' => '⚫ HONOR',
                'items' => ['HONOR Pad', 'HONOR Pad X Series', 'HONOR Pad V Series', 'HONOR MagicPad'],
            ],
            [
                'title' => '🟦 ASUS',
                'items' => ['ASUS ROG Flow Z Series', 'ASUS ZenPad'],
            ],
            [
                'title' => '🪟 Microsoft',
                'items' => ['Surface Go', 'Surface Pro', 'Surface Pro X'],
            ],
            [
                'title' => '🎮 Tablet gaming / hiệu năng cao',
                'items' => [
                    'Lenovo Legion Tab', 'REDMAGIC Gaming Tablet', 'ASUS ROG Flow Z',
                    'Samsung Galaxy Tab S Ultra', 'iPad Pro', 'Xiaomi Pad Pro', 'OnePlus Pad 2',
                ],
            ],
        ],
    ],

    /* ---------- 4. TAI NGHE (11 NHÓM) ---------- */
    'tai-nghe' => [
        'name' => 'Tai nghe',
        'icon' => '<svg class="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>',
        'grid_class' => 'mega-grid-flow',
        'groups' => [
            [
                'title' => '🍎 Apple',
                'items' => [
                    'AirPods', 'AirPods 2', 'AirPods 3', 'AirPods 4',
                    'AirPods Pro', 'AirPods Pro 2', 'AirPods Max',
                ],
            ],
            [
                'title' => '🔵 Sony',
                'items' => [
                    'WH-1000XM Series', 'WH-CH Series',
                    'WF-1000XM Series', 'WF-C Series', 'INZONE',
                ],
            ],
            [
                'title' => '🎧 Bose',
                'items' => ['QuietComfort', 'QuietComfort Ultra', 'QuietComfort Earbuds', 'Bose 700'],
            ],
            [
                'title' => '🟣 Samsung',
                'items' => [
                    'Galaxy Buds', 'Galaxy Buds+', 'Galaxy Buds2',
                    'Galaxy Buds2 Pro', 'Galaxy Buds3', 'Galaxy Buds3 Pro',
                ],
            ],
            [
                'title' => '🟢 Sennheiser',
                'items' => ['Momentum', 'Momentum True Wireless', 'Accentum', 'HD Series', 'IE Series'],
            ],
            [
                'title' => '🟠 JBL',
                'items' => ['JBL Tune', 'JBL Live', 'JBL Tour', 'JBL Quantum', 'JBL Endurance'],
            ],
            [
                'title' => '🔴 Beats',
                'items' => [
                    'Beats Studio', 'Beats Studio Pro', 'Beats Fit Pro',
                    'Beats Solo', 'Beats Solo Buds', 'Powerbeats',
                ],
            ],
            [
                'title' => '⚫ Marshall & B&O',
                'items' => [
                    'Marshall Major', 'Marshall Monitor', 'Marshall Motif', 'Marshall Minor',
                    'Beoplay', 'Beoplay EX', 'Beoplay H Series',
                ],
            ],
            [
                'title' => '🎮 Gaming',
                'items' => [
                    'Logitech G', 'Razer BlackShark', 'Razer Barracuda',
                    'SteelSeries Arctis', 'SteelSeries Arctis Nova', 'HyperX Cloud',
                    'ASUS ROG', 'Sony INZONE', 'JBL Quantum', 'Corsair HS / Virtuoso',
                ],
            ],
            [
                'title' => '💰 Các hãng giá tốt',
                'items' => [
                    'Soundcore by Anker', 'Edifier', 'QCY', 'Baseus',
                    'Redmi', 'Xiaomi', 'Nothing', 'CMF', 'SoundPEATS', '1MORE',
                ],
            ],
            [
                'title' => '🎵 Tai nghe audiophile / có dây',
                'items' => [
                    'Audio-Technica', 'Beyerdynamic', 'AKG', 'Sennheiser',
                    'Shure', 'FiiO', 'Moondrop', 'HiFiMAN', 'Audeze', 'Final Audio',
                ],
            ],
        ],
    ],

    /* ---------- 5. LOA (9 NHÓM) ---------- */
    'loa' => [
        'name' => 'Loa',
        'icon' => '<svg class="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>',
        'grid_class' => 'mega-grid-flow',
        'groups' => [
            [
                'title' => '🔵 JBL',
                'items' => [
                    'JBL Go', 'JBL Clip', 'JBL Flip', 'JBL Charge',
                    'JBL Xtreme', 'JBL Boombox', 'JBL PartyBox',
                    'JBL Authentics', 'JBL Bar', 'JBL Quantum',
                ],
            ],
            [
                'title' => '🔴 Sony',
                'items' => [
                    'Sony SRS-XB', 'Sony ULT Field', 'Sony ULT Tower',
                    'Sony SRS-X Series', 'Sony Party Speaker', 'Sony HT', 'Sony BRAVIA Theatre',
                ],
            ],
            [
                'title' => '🟢 Bose',
                'items' => [
                    'Bose SoundLink', 'Bose SoundLink Flex', 'Bose Home Speaker',
                    'Bose Portable Smart Speaker', 'Bose Smart Soundbar', 'Bose Surround Speakers',
                ],
            ],
            [
                'title' => '🟣 Marshall',
                'items' => [
                    'Marshall Willen', 'Marshall Emberton', 'Marshall Stockwell',
                    'Marshall Kilburn', 'Marshall Middleton', 'Marshall Acton',
                    'Marshall Stanmore', 'Marshall Woburn', 'Marshall Tufton',
                ],
            ],
            [
                'title' => '🟠 Harman Kardon',
                'items' => [
                    'Onyx Studio', 'Aura Studio', 'Go + Play',
                    'Citation', 'SoundSticks', 'Harman Kardon Soundbar',
                ],
            ],
            [
                'title' => '⚫ Sonos',
                'items' => [
                    'Sonos Era', 'Sonos Roam', 'Sonos Move', 'Sonos Five',
                    'Sonos Arc', 'Sonos Beam', 'Sonos Ray', 'Sonos Sub',
                ],
            ],
            [
                'title' => '🟡 Anker Soundcore',
                'items' => [
                    'Soundcore Mini', 'Soundcore Select', 'Soundcore Motion',
                    'Soundcore Boom', 'Soundcore Rave', 'Soundcore Glow', 'Soundcore Space',
                ],
            ],
            [
                'title' => '🎵 Loa nghe nhạc / Hi-Fi',
                'items' => [
                    'KEF (LSX, LS50, R Series, Q Series)',
                    'Bowers & Wilkins (Zeppelin, Formation, 600, 700, 800)',
                    'Klipsch (The Three, The Five, Heritage, Reference)',
                    'DALI (Oberon, Opticon, Rubicon, Epikore)',
                    'Focal (Alpha, Aria, Kanta, Sopra, Utopia)',
                ],
            ],
            [
                'title' => '🎮 Loa gaming / máy tính',
                'items' => [
                    'Logitech G', 'Razer', 'Creative', 'Edifier',
                    'SteelSeries', 'ASUS ROG', 'JBL Quantum', 'Corsair',
                ],
            ],
        ],
    ],

    /* ---------- 6. PHỤ KIỆN (10 NHÓM) ---------- */
    'phu-kien' => [
        'name' => 'Phụ kiện',
        'icon' => '<svg class="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83"/></svg>',
        'grid_class' => 'mega-grid-flow',
        'groups' => [
            [
                'title' => '📱 Phụ kiện điện thoại',
                'items' => [
                    'Ốp lưng', 'Kính cường lực', 'Dán màn hình', 'Cáp sạc', 'Củ sạc',
                    'Sạc không dây', 'MagSafe', 'Pin dự phòng', 'Giá đỡ điện thoại',
                    'Ring holder', 'Dây đeo điện thoại', 'Adapter', 'Hub USB-C',
                    'OTG', 'SIM/eSIM accessories',
                ],
            ],
            [
                'title' => '💻 Phụ kiện laptop / PC',
                'items' => [
                    'Chuột', 'Bàn phím', 'Bàn di chuột', 'Webcam', 'Micro',
                    'USB Hub', 'Docking Station', 'Giá đỡ laptop', 'Đế tản nhiệt',
                    'Túi laptop', 'Balo laptop', 'Kê tay', 'Cáp HDMI',
                    'Cáp DisplayPort', 'Cáp USB', 'Adapter chuyển đổi',
                    'Card đọc thẻ', 'USB Flash', 'SSD di động', 'HDD di động',
                ],
            ],
            [
                'title' => '🎧 Phụ kiện tai nghe',
                'items' => [
                    'Hộp bảo vệ AirPods', 'Eartips', 'Ear hooks', 'Dây đeo',
                    'Case chống sốc', 'Cáp sạc', 'Giá treo tai nghe', 'Stand tai nghe',
                ],
            ],
            [
                'title' => '🔊 Phụ kiện loa',
                'items' => [
                    'Giá đỡ loa', 'Chân loa', 'Dây loa', 'Cáp AUX', 'Cáp optical',
                    'Cáp RCA', 'Adapter Bluetooth', 'Micro không dây', 'Túi bảo vệ loa',
                    'Pin thay thế', 'Bộ điều khiển',
                ],
            ],
            [
                'title' => '📱 Phụ kiện iPad / Tablet',
                'items' => [
                    'Bao da', 'Ốp lưng', 'Kính cường lực', 'Apple Pencil / Bút cảm ứng',
                    'Bàn phím', 'Magic Keyboard', 'Trackpad', 'Giá đỡ tablet',
                    'Hub USB-C', 'Cáp USB-C', 'Sạc', 'Túi đựng tablet',
                ],
            ],
            [
                'title' => '⌚ Phụ kiện smartwatch',
                'items' => [
                    'Dây đồng hồ', 'Dây thể thao', 'Dây da', 'Dây kim loại',
                    'Miếng dán màn hình', 'Ốp bảo vệ', 'Đế sạc', 'Cáp sạc',
                ],
            ],
            [
                'title' => '🎮 Phụ kiện gaming',
                'items' => [
                    'Chuột gaming', 'Bàn phím gaming', 'Headset gaming', 'Mousepad',
                    'Webcam', 'Micro', 'Controller', 'Joystick', 'Racing Wheel',
                    'Giá treo headset', 'RGB accessories', 'Capture Card', 'Gaming Dock',
                ],
            ],
            [
                'title' => '🖥️ Phụ kiện màn hình',
                'items' => [
                    'Arm màn hình', 'Chân màn hình', 'Giá treo màn hình',
                    'Cáp HDMI', 'DisplayPort', 'USB-C', 'VGA',
                    'Adapter chuyển đổi', 'Webcam', 'Light bar', 'Loa màn hình',
                ],
            ],
            [
                'title' => '💾 Lưu trữ & kết nối',
                'items' => [
                    'USB Flash', 'SSD Portable', 'HDD Portable', 'Thẻ nhớ SD',
                    'MicroSD', 'Card Reader', 'USB Hub', 'Thunderbolt Dock',
                    'NAS', 'Adapter mạng LAN', 'Wi-Fi Adapter', 'Bluetooth Adapter',
                ],
            ],
            [
                'title' => '🔌 Sạc & nguồn',
                'items' => [
                    'Củ sạc', 'Sạc nhanh', 'GaN Charger', 'Cáp USB-A',
                    'Cáp USB-C', 'Cáp Lightning', 'Cáp Micro USB', 'Sạc không dây',
                    'MagSafe Charger', 'Power Bank', 'Ổ cắm điện', 'Ổ cắm chống sốc', 'UPS',
                ],
            ],
        ],
    ],

    /* ---------- 7. ĐỒNG HỒ ĐIỆN TỬ (4 CỘT) ---------- */
    'dong-ho-dien-tu' => [
        'name' => 'Đồng hồ điện tử',
        'icon' => '<svg class="h-4 w-4 text-slate-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="m16.51 17.35-.85 3.22a2 2 0 0 1-1.95 1.43H10.3a2 2 0 0 1-1.95-1.43l-.85-3.22m9.01-10.7.85-3.22A2 2 0 0 0 15.41 2H8.6a2 2 0 0 0-1.95 1.43l-.85 3.22"/></svg>',
        'grid_class' => 'grid grid-cols-2 md:grid-cols-4 gap-5',
        'groups' => [
            [
                'title' => '🍎 Apple Watch',
                'items' => [
                    'Apple Watch SE', 'Apple Watch Series',
                    'Apple Watch Ultra', 'Apple Watch Ultra 2', 'Apple Watch Ultra 3',
                ],
            ],
            [
                'title' => '🟢 Samsung Galaxy Watch',
                'items' => [
                    'Galaxy Watch', 'Galaxy Watch Active', 'Galaxy Watch FE',
                    'Galaxy Watch Classic', 'Galaxy Watch Pro',
                    'Galaxy Watch Ultra', 'Galaxy Watch Ultra 2',
                ],
            ],
            [
                'title' => '🔵 Huawei Watch',
                'items' => [
                    'Huawei Watch Fit', 'Huawei Watch GT', 'Huawei Watch GT Runner',
                    'Huawei Watch GT Pro', 'Huawei Watch 4', 'Huawei Watch 5', 'Huawei Watch Ultimate',
                ],
            ],
            [
                'title' => '🟠 Xiaomi',
                'items' => [
                    'Xiaomi Watch', 'Xiaomi Watch S', 'Xiaomi Watch S Pro',
                    'Xiaomi Watch 2', 'Xiaomi Watch 2 Pro', 'Redmi Watch', 'Redmi Watch Active',
                ],
            ],
        ],
    ],
];
?>

<!-- ============================================================
     APPLE 2026 GLASSMORPHIC HEADER (STICKY CỐ ĐỊNH TẠI TOP: 0)
     Hàng 1: Logo khử nền nguyên khối | Thanh tìm kiếm | Giỏ hàng
     Hàng 2: Menu ngang 7 danh mục (Toàn bộ Mega-Menu với thanh cuộn)
     ============================================================ -->
<header id="site-header" class="site-header sticky top-0 z-50">
  <div class="mx-auto max-w-7xl px-4 sm:px-6">

    <!-- [HÀNG TRÊN]: Logo + Tìm kiếm + Giỏ hàng -->
    <div class="flex items-center justify-between gap-4 py-3 md:gap-8">

      <!-- 1. Logo khử nền hòa trộn nguyên khối (không khung viền) -->
      <a href="index.php" class="site-logo" aria-label="VLU FLAGSHIP STORE – Trang chủ">
        <img src="frontend/assets/images/logo.png" onerror="this.onerror=null;this.src='image_2c97c5.png';" alt="VLU FLAGSHIP STORE" width="243" height="171">
      </a>

      <!-- 2. Thanh tìm kiếm trung tâm phong cách kính mờ Apple -->
      <form action="search.php" method="GET" role="search" class="relative hidden sm:block flex-1 max-w-2xl">
        <label for="search-input" class="sr-only">Tìm kiếm sản phẩm</label>
        <div class="relative flex items-center">
          <svg class="pointer-events-none absolute left-4 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
          <input id="search-input" name="q" type="search" placeholder="Bạn cần tìm iPhone 18, iPad Pro, Galaxy S26, MacBook, tai nghe, phụ kiện…" autocomplete="off"
                 class="glass-search-input h-11 w-full rounded-full pl-11 pr-12 text-sm font-medium placeholder:text-slate-400 transition-all focus:outline-none">
          <button type="submit" class="absolute right-1.5 h-8 px-4 rounded-full bg-brand text-xs font-bold text-white shadow-sm hover:bg-brand-dark transition-colors">Tìm</button>
        </div>
      </form>

      <!-- 3. Giỏ hàng & Nút mở menu di động -->
      <div class="flex items-center gap-2">
        <a href="cart.html" class="relative grid h-10 w-10 place-items-center rounded-full text-slate-700 transition hover:bg-slate-100/80 active:scale-95" aria-label="Giỏ hàng, hiện có <?= $cartCount ?> sản phẩm">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/>
          </svg>
          <span id="cartCount" class="absolute -top-0.5 -right-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-brand px-1 text-[10px] font-extrabold text-white shadow-sm ring-2 ring-white"><?= $cartCount ?></span>
        </a>

        <!-- Nút Menu Hamburger (Mobile) -->
        <button type="button" id="mobileMenuBtn" class="grid lg:hidden h-10 w-10 place-items-center rounded-full text-slate-700 transition hover:bg-slate-100 active:scale-95" aria-label="Mở menu danh mục" aria-expanded="false" aria-controls="mobileDrawer">
          <svg class="h-5 w-5 icon-burger" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
          </svg>
          <svg class="h-5 w-5 icon-close hidden" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

    </div>

    <!-- [HÀNG DƯỚI]: THANH MENU NGANG 7 DANH MỤC CHÍNH -->
    <nav class="main-nav hidden lg:block border-t border-slate-200/60 py-1.5" aria-label="Danh mục sản phẩm">
      <ul class="nav-list flex items-center justify-between">

        <?php foreach ($navMegaCategories as $slug => $cat): ?>
          <li class="nav-item-mega" id="menuItem-<?= e($slug) ?>">
            <button type="button" class="nav-link-btn" aria-expanded="false" aria-controls="megaPanel-<?= e($slug) ?>">
              <?= $cat['icon'] ?>
              <span><?= e($cat['name']) ?></span>
              <svg class="nav-chev" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>

            <!-- BẢNG MEGA-MENU THẢ XUỐNG VỚI THANH CUỘN (MAX-HEIGHT: 75VH) -->
            <div id="megaPanel-<?= e($slug) ?>" class="mega-panel" role="region" aria-label="Bảng phân loại <?= e($cat['name']) ?>">
              <div class="mega-menu-scroll">
                <div class="mx-auto max-w-7xl px-4 sm:px-6 py-6">

                  <!-- Tiêu đề bảng menu tinh giản -->
                  <div class="flex items-center justify-between pb-3.5 border-b border-slate-200/70 mb-5">
                    <h3 class="text-base font-extrabold text-slate-900 tracking-tight"><?= e($cat['name']) ?> chính hãng</h3>
                    <a href="category.php?cat=<?= e($slug) ?>" class="inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-dark px-3 py-1 rounded-full bg-brand-soft hover:bg-brand-soft/80 transition-colors">
                      Xem tất cả <?= e(mb_strtolower($cat['name'], 'UTF-8')) ?>
                      <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </a>
                  </div>

                  <!-- Lưới các nhóm/cột phân loại -->
                  <div class="<?= e($cat['grid_class']) ?>">
                    <?php foreach ($cat['groups'] as $grp): ?>
                      <div class="mega-brand-col">
                        <!-- Tiêu đề nhóm/hãng thuần túy -->
                        <h4 class="text-xs font-extrabold text-slate-900 pb-2 mb-2.5 border-b border-slate-200/80 leading-tight">
                          <?= e($grp['title']) ?>
                        </h4>

                        <!-- Danh sách tên dòng sản phẩm thuần túy -->
                        <?php if (!empty($grp['sections'])): ?>
                          <div class="space-y-3">
                            <?php foreach ($grp['sections'] as $sec): ?>
                              <div>
                                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 px-1"><?= e($sec['title']) ?></p>
                                <ul class="space-y-0.5">
                                  <?php foreach ($sec['items'] as $item): ?>
                                    <li>
                                      <a href="<?= vlu_product_url($item, $slug) ?>" class="mega-item-link" title="<?= e($item) ?>">
                                        <?= e($item) ?>
                                      </a>
                                    </li>
                                  <?php endforeach; ?>
                                </ul>
                              </div>
                            <?php endforeach; ?>
                          </div>
                        <?php else: ?>
                          <ul class="space-y-0.5">
                            <?php foreach ($grp['items'] as $item): ?>
                              <li>
                                <a href="<?= vlu_product_url($item, $slug) ?>" class="mega-item-link" title="<?= e($item) ?>">
                                  <?= e($item) ?>
                                </a>
                              </li>
                            <?php endforeach; ?>
                          </ul>
                        <?php endif; ?>

                      </div>
                    <?php endforeach; ?>
                  </div>

                  <!-- Footer bảo đảm chân menu -->
                  <div class="mt-6 pt-3.5 border-t border-slate-200/70 -mx-4 -mb-6 px-6 py-3 bg-slate-50/70 rounded-b-[24px] flex items-center justify-between text-xs text-slate-600 font-medium">
                    <div class="flex items-center gap-6">
                      <span class="flex items-center gap-1.5 text-slate-700 font-bold">
                        <svg class="h-4 w-4 text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                        100% Chính hãng · Bảo hành 12 - 24 tháng
                      </span>
                      <span class="flex items-center gap-1.5 text-slate-700 font-bold">
                        <svg class="h-4 w-4 text-brand" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                        Thu cũ đổi mới trợ giá cao
                      </span>
                      <span class="flex items-center gap-1.5 text-slate-700 font-bold">
                        <svg class="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        Giao hàng hỏa tốc trong 2 giờ
                      </span>
                    </div>
                    <span class="text-slate-400">Cam kết máy mới nguyên seal 100%</span>
                  </div>

                </div>
              </div>
            </div>
          </li>
        <?php endforeach; ?>

      </ul>
    </nav>

  </div>

  <!-- ================= MENU DI ĐỘNG (MOBILE DRAWER SHEET) ================= -->
  <div id="mobileDrawer" class="mobile-drawer" role="dialog" aria-modal="true" aria-label="Menu danh mục di động">
    <div class="mobile-drawer-inner p-4 space-y-3">
      
      <!-- Ô tìm kiếm mobile -->
      <form action="search.php" method="GET" class="relative">
        <svg class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
        <input name="q" type="search" placeholder="Tìm kiếm sản phẩm…" class="h-11 w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand">
      </form>

      <!-- Accordion 7 danh mục chính trên Mobile -->
      <div class="space-y-2">
        <?php foreach ($navMegaCategories as $slug => $cat): ?>
          <div class="mobile-brand-card">
            <button type="button" class="mobile-accordion-toggle flex w-full items-center justify-between p-3.5 rounded-2xl bg-white/80 font-bold text-slate-900 text-left transition">
              <span class="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <?= $cat['icon'] ?>
                <?= e($cat['name']) ?>
              </span>
              <svg class="h-4 w-4 text-slate-400 transition-transform duration-200" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div class="mobile-accordion-body hidden px-3 pt-2 pb-3 space-y-3">
              <?php foreach ($cat['groups'] as $grp): ?>
                <div class="pl-2 border-l-2 border-slate-200">
                  <p class="text-xs font-black text-slate-800"><?= e($grp['title']) ?></p>
                  <?php if (!empty($grp['sections'])): ?>
                    <?php foreach ($grp['sections'] as $sec): ?>
                      <p class="text-[10px] font-bold text-slate-400 uppercase mt-1.5"><?= e($sec['title']) ?></p>
                      <div class="mt-0.5 space-y-0.5">
                        <?php foreach ($sec['items'] as $it): ?>
                          <a href="<?= vlu_product_url($it, $slug) ?>" class="block py-0.5 text-xs font-semibold text-slate-700 hover:text-brand">
                            <?= e($it) ?>
                          </a>
                        <?php endforeach; ?>
                      </div>
                    <?php endforeach; ?>
                  <?php else: ?>
                    <div class="mt-1 space-y-0.5">
                      <?php foreach ($grp['items'] as $it): ?>
                        <a href="<?= vlu_product_url($it, $slug) ?>" class="block py-0.5 text-xs font-semibold text-slate-700 hover:text-brand">
                          <?= e($it) ?>
                        </a>
                      <?php endforeach; ?>
                    </div>
                  <?php endif; ?>
                </div>
              <?php endforeach; ?>
            </div>
          </div>
        <?php endforeach; ?>
      </div>

    </div>
  </div>
</header>

<!-- Lớp phủ mờ nền trang (Scrim Blur) NẰM SAU HEADER (z-index 40 < header 50) -->
<div id="megaScrim" class="mega-scrim" aria-hidden="true"></div>
<!-- Central Cart Engine 2026 -->
<script src="frontend/assets/js/cart-engine.js"></script>

<?php
/**
 * VLU FLAGSHIP STORE – Tạo cấu trúc thư mục phân loại trong SanPham/SanPham
 * Phân chia riêng biệt: Laptop, iPad, Tai nghe, Loa, Phụ kiện, Đồng hồ
 * Kèm file hướng dẫn để người dùng thả ảnh thật vào cực kỳ dễ dàng.
 */

$root = dirname(__DIR__, 2);
$baseDir = $root . '/SanPham/SanPham';

$structure = [
    'Laptop' => [
        'MacBook Pro',
        'MacBook Air',
        'ASUS ROG Strix',
        'ASUS Vivobook',
        'Dell XPS',
        'Lenovo Legion',
        'Lenovo ThinkPad',
        'HP Pavilion',
        'MSI Raider',
    ],
    'iPad' => [
        'iPad Pro',
        'iPad Air',
        'iPad mini',
        'iPad Gen',
        'Samsung Galaxy Tab S',
        'Xiaomi Pad Pro',
        'Huawei MatePad',
    ],
    'Tai nghe' => [
        'AirPods Pro 2',
        'AirPods Max',
        'AirPods 4',
        'Sony WH-1000XM5',
        'Sony WF-1000XM5',
        'Galaxy Buds3 Pro',
        'Bose QuietComfort Ultra',
        'Marshall Major V',
    ],
    'Loa' => [
        'JBL Flip 6',
        'JBL Charge 5',
        'Marshall Emberton II',
        'Marshall Stanmore III',
        'Bose SoundLink Flex',
        'Harman Kardon Onyx Studio 8',
        'Sony ULT Field 7',
    ],
    'Phu kien' => [
        'Cu sac GaN 35W Dual USB-C',
        'Op lung MagSafe cao cap',
        'Pin du phong 20000mAh',
        'Apple Pencil Pro',
        'Cap sac USB-C 100W',
    ],
    'Dong ho' => [
        'Apple Watch Ultra 3',
        'Apple Watch Series 10',
        'Apple Watch SE',
        'Galaxy Watch Ultra',
        'Galaxy Watch 7',
        'Xiaomi Watch S3',
    ],
];

echo "=== ĐANG KHỞI TẠO CẤU TRÚC THƯ MỤC TRONG SanPham/SanPham ===\n";

foreach ($structure as $category => $subfolders) {
    $catPath = $baseDir . '/' . $category;
    if (!is_dir($catPath)) {
        mkdir($catPath, 0777, true);
        echo "[TẠO MỤC] $category\n";
    }

    $guide = "HƯỚNG DẪN THÊM ẢNH CHO DANH MỤC: $category\n"
           . "====================================================\n\n"
           . "1. Bạn chỉ cần thả các file ảnh (.png, .webp, .jpg) vào thư mục tương ứng với dòng máy.\n"
           . "2. Đặt tên file theo tên màu sắc của sản phẩm, ví dụ:\n"
           . "   - Den.png\n"
           . "   - Trang.png\n"
           . "   - Bac.png\n"
           . "   - Xam Khong Gian.webp\n"
           . "   - Vang Sa Mac.jpg\n"
           . "3. Hệ thống sẽ TỰ ĐỘNG nhận diện tên file thành tùy chọn màu sắc hiển thị trên trang Chi tiết sản phẩm!\n"
           . "4. Nếu chưa có ảnh trong thư mục này, hệ thống sẽ tự động dùng ảnh biểu tượng chuẩn Retina chất lượng cao.\n";
    file_put_contents($catPath . '/HUONG_DAN.txt', $guide);

    foreach ($subfolders as $sub) {
        $subPath = $catPath . '/' . $sub;
        if (!is_dir($subPath)) {
            mkdir($subPath, 0777, true);
            echo "  └─ [TẠO DÒNG MÁY] $sub\n";
        }
    }
}

echo "=== HOÀN TẤT KHỞI TẠO CẤU TRÚC THƯ MỤC! ===\n";

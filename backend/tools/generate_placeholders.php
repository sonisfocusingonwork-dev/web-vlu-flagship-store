<?php
/**
 * Tạo các hình SVG đại diện cho các danh mục sản phẩm theo phong cách Apple Studio tối giản 2026.
 */
$dir = dirname(__DIR__, 2) . '/frontend/assets/images/placeholders';
if (!is_dir($dir)) {
    mkdir($dir, 0777, true);
}

$placeholders = [
    'laptop' => [
        'title' => 'Laptop / MacBook',
        'icon' => '<path d="M40 180h400l-40 40H80l-40-40zm30-120h340a16 16 0 0116 16v104H54V76a16 16 0 0116-16z" fill="#0F172A" opacity="0.85"/><circle cx="240" cy="115" r="14" fill="#C8102E"/>',
    ],
    'tablet' => [
        'title' => 'iPad / Tablet',
        'icon' => '<rect x="90" y="40" width="300" height="400" rx="28" fill="#0F172A" opacity="0.85"/><rect x="106" y="56" width="268" height="368" rx="16" fill="#F8FAFC"/><circle cx="240" cy="48" r="3" fill="#94A3B8"/><path d="M225 410h30" stroke="#94A3B8" stroke-width="3" stroke-linecap="round"/>',
    ],
    'headphones' => [
        'title' => 'Tai nghe Flagship',
        'icon' => '<path d="M120 250v-60a120 120 0 01240 0v60" fill="none" stroke="#0F172A" stroke-width="24" stroke-linecap="round"/><rect x="80" y="240" width="60" height="110" rx="30" fill="#C8102E"/><rect x="340" y="240" width="60" height="110" rx="30" fill="#C8102E"/>',
    ],
    'speaker' => [
        'title' => 'Loa Di Động',
        'icon' => '<rect x="120" y="70" width="240" height="340" rx="40" fill="#0F172A" opacity="0.9"/><circle cx="240" cy="170" r="48" fill="#1E293B"/><circle cx="240" cy="170" r="28" fill="#C8102E"/><circle cx="240" cy="290" r="56" fill="#1E293B"/><circle cx="240" cy="290" r="34" fill="#334155"/>',
    ],
    'accessories' => [
        'title' => 'Phụ Kiện Chính Hãng',
        'icon' => '<rect x="140" y="100" width="200" height="200" rx="36" fill="#0F172A" opacity="0.85"/><path d="M190 300v70m100-70v70" stroke="#94A3B8" stroke-width="14" stroke-linecap="round"/><circle cx="240" cy="200" r="40" fill="#C8102E"/>',
    ],
    'watch' => [
        'title' => 'Đồng Hồ Điện Tử',
        'icon' => '<rect x="180" y="30" width="120" height="80" rx="12" fill="#334155"/><rect x="180" y="370" width="120" height="80" rx="12" fill="#334155"/><rect x="140" y="100" width="200" height="280" rx="46" fill="#0F172A"/><rect x="156" y="116" width="168" height="248" rx="34" fill="#F8FAFC"/><circle cx="240" cy="240" r="50" fill="none" stroke="#C8102E" stroke-width="8"/><path d="M240 210v30l20 15" stroke="#C8102E" stroke-width="6" stroke-linecap="round"/>',
    ],
    'phone' => [
        'title' => 'Điện Thoại Flagship',
        'icon' => '<rect x="130" y="40" width="220" height="400" rx="36" fill="#0F172A" opacity="0.9"/><rect x="144" y="54" width="192" height="372" rx="26" fill="#F8FAFC"/><rect x="200" y="66" width="80" height="18" rx="9" fill="#0F172A"/><circle cx="240" cy="406" r="4" fill="#94A3B8"/>',
    ],
];

foreach ($placeholders as $name => $item) {
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 480" width="100%" height="100%">'
         . '<defs>'
         . '  <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">'
         . '    <stop offset="0%" stop-color="#F1F5F9"/>'
         . '    <stop offset="100%" stop-color="#E2E8F0"/>'
         . '  </radialGradient>'
         . '  <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">'
         . '    <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#0F172A" flood-opacity="0.12"/>'
         . '  </filter>'
         . '</defs>'
         . '<rect width="480" height="480" rx="40" fill="url(#bgGlow)"/>'
         . '<g filter="url(#softShadow)">'
         . $item['icon']
         . '</g>'
         . '</svg>';
    file_put_contents("$dir/$name.svg", $svg);
    echo "Tạo placeholder: $name.svg\n";
}
echo "Hoàn tất tạo placeholder SVG!\n";

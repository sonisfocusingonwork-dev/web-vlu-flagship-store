<?php
/**
 * VLU FLAGSHIP STORE – Product link helpers
 * Tạo slug thống nhất giữa PHP và JavaScript (frontend/assets/js/product-detail.js)
 * để mọi thẻ sản phẩm & mục Mega-Menu đều trỏ về product-detail.html?id=<slug>.
 */

if (!function_exists('vlu_slug')) {
    /**
     * "iPhone 18 Pro Max" → "iphone-18-pro-max", "Ốp lưng" → "op-lung", "Galaxy S26+" → "galaxy-s26-plus"
     * Quy tắc phải khớp hàm slugify() trong product-detail.js.
     */
    function vlu_slug(string $text): string
    {
        static $map = null;
        if ($map === null) {
            $groups = [
                'a' => 'àáạảãâầấậẩẫăằắặẳẵ', 'e' => 'èéẹẻẽêềếệểễ', 'i' => 'ìíịỉĩ',
                'o' => 'òóọỏõôồốộổỗơờớợởỡ', 'u' => 'ùúụủũưừứựửữ', 'y' => 'ỳýỵỷỹ', 'd' => 'đ',
                'A' => 'ÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴ', 'E' => 'ÈÉẸẺẼÊỀẾỆỂỄ', 'I' => 'ÌÍỊỈĨ',
                'O' => 'ÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠ', 'U' => 'ÙÚỤỦŨƯỪỨỰỬỮ', 'Y' => 'ỲÝỴỶỸ', 'D' => 'Đ',
            ];
            $map = [];
            foreach ($groups as $ascii => $chars) {
                foreach (preg_split('//u', $chars, -1, PREG_SPLIT_NO_EMPTY) as $ch) {
                    $map[$ch] = $ascii;
                }
            }
        }
        if (class_exists('Normalizer')) {
            $text = Normalizer::normalize($text, Normalizer::FORM_C) ?: $text;
        }
        $text = strtr($text, $map);
        $text = str_replace('+', ' plus ', $text);
        $text = strtolower($text);
        $text = preg_replace('/[^a-z0-9]+/', '-', $text);
        return trim((string)$text, '-');
    }
}

if (!function_exists('vlu_product_url')) {
    /**
     * URL trang chi tiết động. Truyền kèm tên gốc (name) và danh mục (cat)
     * để cơ chế Smart Fallback hiển thị chính xác cả những dòng máy chưa có dữ liệu.
     */
    function vlu_product_url(string $name, string $cat = '', string $id = ''): string
    {
        $query = ['id' => $id !== '' ? $id : vlu_slug($name), 'name' => $name];
        if ($cat !== '') {
            $query['cat'] = $cat;
        }
        return 'product-detail.html?' . http_build_query($query, '', '&amp;', PHP_QUERY_RFC3986);
    }
}

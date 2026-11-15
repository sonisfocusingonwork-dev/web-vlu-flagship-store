<?php
/**
 * VLU FLAGSHIP STORE – Chuyển hướng 302 sang giao diện chuẩn admin.html 2026
 */
$query = !empty($_SERVER['QUERY_STRING']) ? ('?' . $_SERVER['QUERY_STRING']) : '';
header('Location: admin.html' . $query, true, 302);
exit;

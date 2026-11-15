<?php
/**
 * VLU FLAGSHIP STORE – Chuyển hướng 302 sang giao diện chuẩn product-detail.html 2026
 */
$id = isset($_GET['id']) ? (int)$_GET['id'] : 101;
$query = !empty($_SERVER['QUERY_STRING']) ? ('?' . $_SERVER['QUERY_STRING']) : ('?id=' . $id);
header('Location: product-detail.html' . $query, true, 302);
exit;

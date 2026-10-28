<?php
/**
 * Forwarder to product-detail.html (or product-detail.php)
 * VLU FLAGSHIP STORE
 */
$id = isset($_GET['id']) ? (int)$_GET['id'] : 101;
$query = !empty($_SERVER['QUERY_STRING']) ? '?' . $_SERVER['QUERY_STRING'] : '?id=' . $id;

header('Location: product-detail.html' . $query);
exit;

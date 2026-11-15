<?php
/**
 * VLU FLAGSHIP STORE – Search Forwarder
 * Chuyển tiếp tìm kiếm sang category.html kèm query parameters
 */
$query = !empty($_SERVER['QUERY_STRING']) ? ('?' . $_SERVER['QUERY_STRING']) : '';
header('Location: category.html' . $query, true, 302);
exit;

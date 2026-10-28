<?php
$host = 'localhost';
$dbname = 'web_dien_tu';
$username = 'root'; // 
$password = '';     // 

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    // Thiết lập chế độ báo lỗi
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); 
} catch(PDOException $e) {
    // Không in trạng thái CSDL ra ngoài giao diện
    $conn = null;
}
?>

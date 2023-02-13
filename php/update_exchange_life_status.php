<?php header('Access-Control-Allow-Origin: *');

$status = $_POST['status'];
// $status = 1;
// $user_id = 1;
include "dbconn.php";
#變數設定
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它
$sql = "UPDATE `setting` SET `exchange_life_status` = :statuss";
$statement = $conn->prepare($sql);
$statement->execute(array(':statuss' => $status));

if ($statement) {
    echo "ok";
}
#關閉連線
$conn = null;

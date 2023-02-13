<?php header('Access-Control-Allow-Origin: *');


$user_id = $_POST['user_id'];
$current_index = $_POST['current_index'];
$status = $_POST['status'];

// $user_id = 1;
// $current_index = -2;
// $status = -2; // 0: 未選 ，1: 已選

// print_r($user_id . "," .  $current_index . "," . $status);

include "dbconn.php";
#變數設定
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它
$sql = "UPDATE `user` SET `current_index` = :current_index , `status` = :statuss WHERE `user`.`user_id` = :user_id";
#執行prepare
$statement = $conn->prepare($sql);
$statement->execute(array(':current_index' => $current_index, ':statuss' => $status, ':user_id' => $user_id));

$count = $statement->rowCount(); // 若更新成功則會回傳更新行數 這邊只更新一行 所以只有1
print($count);


#關閉連線
$conn = null;

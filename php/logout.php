<?php header('Access-Control-Allow-Origin: *');

#變數設定
$user_id = $_POST['user_id'];
include "dbconn.php";
include "second_to_date.php";


#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

$sql = "UPDATE `user` SET `login_status` = 0 WHERE `user`.`user_id` = :user_id ";
#執行prepare

$statement = $conn->prepare($sql);
$statement->execute(array(':user_id' => $user_id));

$count = $statement->rowCount();

print_r($count);

#關閉連線
$conn = null;

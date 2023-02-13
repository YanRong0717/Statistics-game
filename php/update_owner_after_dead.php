<?php header('Access-Control-Allow-Origin: *');
// 死後將該使用者移除

$zone_id = $_POST['zone_id'];
$index = $_POST['index'];

include "dbconn.php";
#變數設定
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它


$sql3 = "UPDATE `zone` SET `use_status` = 0 ,`first_location` = 0 , `card_owner` = 0  WHERE `zone`.`zone_id` = :zone_id AND `zone`.`card_id` = :card_id";

$statement3 = $conn->prepare($sql3);
$statement3->execute(array(':zone_id' => $zone_id, ':card_id' => $index));



$count = $statement3->rowCount(); // 若更新成功則會回傳更新行數 這邊只更新一行 所以只有1
print($count);
#關閉連線
$conn = null;

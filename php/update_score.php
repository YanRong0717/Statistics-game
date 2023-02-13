<?php header('Access-Control-Allow-Origin: *');

$user_id = $_POST['user_id'];
$ques_id = $_POST['ques_id'];
$index = $_POST['index'];
$zone_id = $_POST['zone_id'];
// $user_id = 1;
// $ques_id = 1;
include "dbconn.php";
#變數設定
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它
$sql = "UPDATE `user` SET `score` = `score` +1  WHERE `user`.`user_id` = :user_id";
$statement = $conn->prepare($sql);
$statement->execute(array(':user_id' => $user_id));

$sql2 = "UPDATE `ques` SET `correct_num` = `correct_num` +1 WHERE `ques_id` = :ques_id";
$statement2 = $conn->prepare($sql2);
$statement2->execute(array(":ques_id" => $ques_id));


$sql3 = "UPDATE `zone` SET `correct_time` = now() WHERE `zone`.`zone_id` = :zone_id and `zone`.`card_id` = :card_id";
$statement3 = $conn->prepare($sql3);
$statement3->execute(array(":zone_id" => $zone_id, ":card_id" => $index));

if ($statement && $statement2) {
    echo "ok";
}
#關閉連線
$conn = null;

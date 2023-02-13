<?php header('Access-Control-Allow-Origin: *');

date_default_timezone_set("Asia/Taipei");

$ques_id = $_POST['ques_id'];
$zone_id = $_POST['zone_id'];
$index = $_POST['index'];

// $ques_id = 21;
// $zone_id = 1;
// $index = 0;

include "dbconn.php";
#變數設定
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它



$sql = "SELECT `ques_time` FROM `ques` WHERE `ques_id` = :ques_id";
$statement = $conn->prepare($sql);
$statement->execute(array(':ques_id' => $ques_id));

$row = $statement->fetch(PDO::FETCH_ASSOC);

$ques_time = $row['ques_time'];
// $sql5 = "SELECT ADDTIME(NOW(), '$ques_time')";

// $statement5 = $conn->prepare($sql5);
// $statement5->execute();
// $row5 = $statement5->fetch(PDO::FETCH_NUM);
// echo "-------------<br>";
// print_r($statement5);
// print_r($row5[0]);



$sql3 = "UPDATE `zone` SET `deadline` = (ADDTIME(NOW(), ADDTIME('$ques_time', '00:00:07' ))) WHERE `zone`.`zone_id` = :zone_id AND `zone`.`card_id` = :card_id";

$statement3 = $conn->prepare($sql3);
$statement3->execute(array(':zone_id' => $zone_id, ':card_id' => $index));

$count = $statement3->rowCount(); // 若更新成功則會回傳更新行數 這邊只更新一行 所以只有1
print($count);
#關閉連線
$conn = null;

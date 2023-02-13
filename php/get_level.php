<?php header('Access-Control-Allow-Origin: *');

include "dbconn.php";
#變數設定
$zond_id = $_POST['zone_id'];
$card_id = $_POST['index'];
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

$sql = 'SELECT * FROM `zone` WHERE `card_id` = :card_id AND `zone_id` = :zone_id';
# card_level & ques_level 其實要輸入的是一樣的，這邊只是讓他搜尋時不會多跑幾筆

#執行prepare
$statement = $conn->prepare($sql);
$statement->execute(array(":zone_id" => $zond_id, ":card_id" => $card_id));

$row = $statement->fetch(PDO::FETCH_ASSOC);
echo $row['card_level'];


#關閉連線
$conn = null;

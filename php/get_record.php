<?php header('Access-Control-Allow-Origin: *');

include "dbconn.php";

$zone_id = $_POST['zone_id'];
#變數設定


#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

$sql = 'SELECT `user_name` as murderer_name , `mode` ,`time` FROM `record`,`user` WHERE `record`.`murderer_id` = `user`.`user_id` and `record`.`zone_id` = :zone_id ORDER BY `record`.`time` DESC';

$sql2 = 'SELECT `user_name` as victim_name  FROM `record`,`user` WHERE `record`.`victim_id` = `user`.`user_id` and `record`.`zone_id` = :zone_id ORDER BY `record`.`time` DESC';

#執行prepare
$statement = $conn->prepare($sql);
$statement->execute(array(':zone_id' => $zone_id));

$statement2 = $conn->prepare($sql2);
$statement2->execute(array(':zone_id' => $zone_id));


$victim_name = array();
while ($row2 = $statement2->fetch(PDO::FETCH_ASSOC)) {
    array_push($victim_name, $row2['victim_name']);
}
$allData = array();
$i = 0;
while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
    array_push($allData, array("murderer_name" => $row['murderer_name'], "victim_name" => $victim_name[$i], "mode" => $row['mode'], "time" => $row['time']));
    $i++;
}




echo json_encode($allData);

#關閉連線
$conn = null;

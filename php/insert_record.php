<?php header('Access-Control-Allow-Origin: *');

include "dbconn.php";
$user_id = $_POST['user_id'];
$zone_id = $_POST['zone_id'];
$victim_index = $_POST['victim_index']; // 死掉的人的index
$victim_team; //被害人的team
$murderer_team = $_POST['team']; // 兇手的team
$victim_id;
#變數設定

#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它


$sql4 = 'SELECT `card_owner`,`team` FROM `zone`,`user` WHERE `card_id` = :card_id AND `zone`.`zone_id` = :zone_id AND `card_owner` = `user_id`';

#執行prepare
$statement4 = $conn->prepare($sql4);
$statement4->execute(array(':card_id' => $victim_index, ':zone_id' => $zone_id));

while ($row4 = $statement4->fetch(PDO::FETCH_ASSOC)) {
    $victim_id = $row4['card_owner']; // 找到被害人的ID
    $victim_team = $row4['team']; // 找到被害人的team
}

$mode;
if ($victim_team == $murderer_team) { // 我把隊友殺了
    $mode = 3;
} else { // 我殺了別隊的
    $mode = 2;
}
//----------------------------------------------
$sql3 = 'INSERT INTO `record` (`id`, `murderer_id`, `victim_id`,`zone_id`,`mode` ,  `time`) VALUES (NULL, :murderer_id, :victim_id,:zone_id,:mode, current_timestamp());';

#執行prepare
$statement3 = $conn->prepare($sql3);
$statement3->execute(array(':murderer_id' => $user_id, ':victim_id' => $victim_id, ':zone_id' => $zone_id, ':mode' => $mode));

//-------------------------------------------------
$sql5 = 'UPDATE `zone` SET `use_status` = 0 ,`first_location` = 0 , `card_owner` = 0  WHERE `zone`.`zone_id` = :zone_id AND `zone`.`card_owner` = :card_owner'; // 將死掉的人移除zone

#執行prepare
$statement5 = $conn->prepare($sql5);
$statement5->execute(array(':zone_id' => $zone_id, ':card_owner' => $victim_id));

#關閉連線
$conn = null;

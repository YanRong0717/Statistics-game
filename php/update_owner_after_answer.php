<?php header('Access-Control-Allow-Origin: *');

$user_id = $_POST['user_id'];
$zone_id = $_POST['zone_id'];
// $ques_id = $_POST['ques_id'];
$index = $_POST['index'];
$result = $_POST['result'];
// $user_id = 1;
// $current_index = -2;
// print_r($user_id . "," .  $current_index );

include "dbconn.php";
#變數設定
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它


$sql4 = "SELECT `card_id` FROM `zone` WHERE `card_owner` = :card_owner AND `first_location` = 1 AND `zone_id` = :zone_id";
$statement4 = $conn->prepare($sql4);
$statement4->execute(array(':card_owner' => $user_id, ':zone_id' => $zone_id));

while ($row4 = $statement4->fetch(PDO::FETCH_ASSOC)) {
    $card_id = $row4['card_id']; //先取得更新前的card_id後，把該格子的owner . first_location . use_status 釋放
    // echo $card_id;
    // die();
}

//-----------------------------------------------------------// 將原本的格子釋放
// $sql5 = "UPDATE `zone` SET `use_status` = 0 ,`card_owner` = 0 , `first_location` = 0 WHERE `zone`.`zone_id` = :zone_id AND `zone`.`card_id` = :card_id;";
$sql5 = "UPDATE `zone` SET `use_status` = 0 ,`card_owner` = 0 , `first_location` = 0 WHERE `card_owner` = :card_owner AND `first_location` = 1 AND `zone_id` = :zone_id";
$statement5 = $conn->prepare($sql5);
$statement5->execute(array(':zone_id' => $zone_id, ':card_owner' => $user_id));

// ------------------------------------------------------------ // 將當前選到的格子釋放狀態
$sql6 = "UPDATE `zone` SET `use_status` = 0 WHERE `zone`.`zone_id` = :zone_id AND `zone`.`card_id` = :card_id;";
$statement6 = $conn->prepare($sql6);
$statement6->execute(array(':zone_id' => $zone_id, 'card_id' => $index));


//----------------------------------------------------------- 到這邊再更新新的格子
if ($result == "1") { //正確
    $sql3 = "UPDATE `zone` SET `use_status` = 0 , `card_owner` = :card_owner , `first_location` = 1 , `use_status` = 0 WHERE `zone`.`zone_id` = :zone_id AND `zone`.`card_id` = :card_id";

    $statement3 = $conn->prepare($sql3);
    $statement3->execute(array(':card_owner' => $user_id, ':zone_id' => $zone_id, ':card_id' => $index)); //這邊的card_id 為新的index
} else if ($result == "0") { // 錯誤
    $sql3 = "UPDATE `zone` SET `use_status` = 0 , `card_owner` = :card_owner , `first_location` = 1 , `use_status` = 0 WHERE `zone`.`zone_id` = :zone_id AND `zone`.`card_id` = :card_id";

    $statement3 = $conn->prepare($sql3);
    $statement3->execute(array(':card_owner' => $user_id, ':zone_id' => $zone_id, ':card_id' => $card_id)); //這邊的card_id 為舊的card_id
}








$count = $statement3->rowCount(); // 若更新成功則會回傳更新行數 這邊只更新一行 所以只有1
print($count);
#關閉連線
$conn = null;

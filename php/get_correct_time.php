<?php header('Access-Control-Allow-Origin: *');

include "dbconn.php";
$peoples = $_POST['peoples'];
$zone_id = $_POST['zone_id'];
$user_id = $_POST['user_id'];
$result = $_POST['result']; //答題狀態 0 : 錯誤，1 : 正確
$victim_team = $_POST['team']; //自己的team
$murderer_team; //兇手的team
$mode;
#變數設定




$people = explode(',', $peoples);


$min_second = 999999; // 該格子答對時間距離當前時間最小的
$min_index = -1;

#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

// print_r($people);
// print_r(count($people));


for ($i = 0; $i <= count($people) - 2; $i++) {
    // echo $people[$i] . ",";
    $sql = 'SELECT timestampdiff(second,`correct_time`,now()) as result FROM `zone` WHERE `card_id` = :card_id AND `zone_id` = :zone_id';

    #執行prepare
    $statement = $conn->prepare($sql);
    $statement->execute(array(':zone_id' => $zone_id, ':card_id' => $people[$i]));
    while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
        if ((int)$row['result'] < $min_second) {
            $min_second = (int)$row['result'];
            $min_index = $people[$i];
        }
    }
}
// echo $min_index;

$sql2 = 'SELECT `user`.`user_name`,`user`.`team` from `zone` ,`user` WHERE `zone`.`card_id` = :card_id AND `zone`.`zone_id` = :zone_id AND `user`.`user_id` = `zone`.`card_owner`';

#執行prepare
$statement2 = $conn->prepare($sql2);
$statement2->execute(array(':zone_id' => $zone_id, ':card_id' => $min_index));
while ($row2 = $statement2->fetch(PDO::FETCH_ASSOC)) {
    echo $row2['user_name'];
}


// --------------------- 以下是新增記錄 ----------------------
$count = $statement2->rowCount();
$murderer_id;
if ($count > 0) {


    $sql4 = 'SELECT `card_owner` , `team` FROM `zone`,`user` WHERE `card_id` = :card_id and `card_owner` = `user_id`';

    #執行prepare
    $statement4 = $conn->prepare($sql4);
    $statement4->execute(array(':card_id' => $min_index));

    while ($row4 = $statement4->fetch(PDO::FETCH_ASSOC)) {
        $murderer_id = $row4['card_owner']; // 找到殺的人的ID
        $murderer_team = $row4['team']; // 找到殺的人的team
    }
    //----------------------------------------------

    if ($result == "1" && $murderer_team == $victim_team) { // 答題正確，且隊友殺了我
        $mode = 3;
    } else if ($result == "1" && $murderer_team != $victim_team) { //　答題正確，且敵隊殺了我
        $mode = 2;
    } else if ($result == "0" && $murderer_team == $victim_team) { //　答題錯誤，且隊友殺了我
        $mode = 3;
    } else if ($result == "0" && $murderer_team != $victim_team) { //　答題錯誤，且敵隊殺了我
        $mode = 2;
    }
    // --------------------------------------------

    $sql3 = 'INSERT INTO `record` (`id`, `murderer_id`, `victim_id`,`zone_id`,`mode` ,`time`) VALUES (NULL, :murderer_id, :victim_id,:zone_id, :mode,current_timestamp());'; // 新增紀錄

    #執行prepare
    $statement3 = $conn->prepare($sql3);
    $statement3->execute(array(':murderer_id' => $murderer_id, ':victim_id' => $user_id, ':zone_id' => $zone_id, ':mode' => $mode));
    //-------------------------------------------------
    $sql5 = 'UPDATE `zone` SET `use_status` = 0 ,`first_location` = 0 , `card_owner` = 0  WHERE `zone`.`zone_id` = :zone_id AND `zone`.`card_owner` = :card_owner'; // 將死掉的人移除zone

    #執行prepare
    $statement5 = $conn->prepare($sql5);
    $statement5->execute(array(':zone_id' => $zone_id, ':card_owner' => $user_id));
}





#關閉連線
$conn = null;

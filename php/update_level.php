<?php header('Access-Control-Allow-Origin: *');

$user_id = $_POST['user_id'];
$card_level = $_POST['level'];
$zone_id = $_POST['zone_id'];
$card_id = $_POST['card_id'];
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


if ($result == 1) { //正確
    // ----------------------------搜尋當前區塊的level最大值----------------------------
    $sql88 = "SELECT `max_level` FROM `zone` WHERE `zone`.`zone_id` = :zone_id AND `zone`.`card_id` = :card_id";

    $statement88 = $conn->prepare($sql88);
    $statement88->execute(array(':zone_id' => $zone_id, ':card_id' => $card_id));

    $row88 = $statement88->fetch(PDO::FETCH_ASSOC);

    $max_level = $row88['max_level'];

    if ($card_level >= (int)$max_level) {
        $card_level = (int)$max_level - 1; //這邊-1 是因為下面又 +1
    }
    // ----------------------------搜尋當前區塊的level最大值----------------------------
    // ------------------------更新當前區塊的擁有者、使用狀態、卡片等級----------------------

    $sql = "UPDATE `zone` SET `card_owner` = :user_id , `use_status` = 0 , `card_level` = :card_level WHERE `zone`.`zone_id` = :zone_id AND `zone`.`card_id` = :card_id";

    $statement = $conn->prepare($sql);
    $statement->execute(array(':user_id' => $user_id, ':card_level' => $card_level + 1, ':zone_id' => $zone_id, ':card_id' => $card_id));

    $count = $statement->rowCount(); // 若更新成功則會回傳更新行數 這邊只更新一行 所以只有1
    print($count);
    // ------------------------更新當前區塊的擁有者、使用狀態、卡片等級----------------------
} else if ($result == 0) { // 錯誤
    // ----------------------解除當前區塊的該項目(index)的使用狀態----------------------
    $sql2 = "UPDATE `zone` SET  `use_status` = 0 WHERE `zone`.`zone_id` = :zone_id AND `zone`.`card_id` = :card_id";

    $statement2 = $conn->prepare($sql2);
    $statement2->execute(array(':card_level' => $card_level, ':zone_id' => $zone_id));

    $count = $statement2->rowCount(); // 若更新成功則會回傳更新行數 這邊只更新一行 所以只有1
    print($count);
    // ----------------------解除當前區塊的該項目(index)的使用狀態、擁有者----------------------
}


#關閉連線
$conn = null;

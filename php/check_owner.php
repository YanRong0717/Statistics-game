<?php header('Access-Control-Allow-Origin: *');

include "dbconn.php";
#變數設定
$user_id = $_POST['user_id'];
$zone_id = $_POST['zone_id'];
$index = (int)$_POST['index'];

// $user_id = 1;
// $zone_id = 1;
// $index = 55;

$index_array = array(
    $index - 1, $index + 1, $index - 9, $index + 9, $index - 10, $index + 10, $index - 11, $index + 11,
);

// print_r($index_array);

#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它


$sql = 'SELECT a.card_id,a.card_owner FROM zone a INNER JOIN user b ON a.zone_id =:zone_id AND b.user_id = :user_id AND a.card_id = :card_id';


#執行prepare

//--------------------------------------------------------------
$result1 = false; //預設為false
$result2 = false; //預設為false

for ($i = 0; $i <= 7; $i++) { //查詢九宮格中是否有一個card_owner是屬於我的如果是，則break，並將$result = true，代表可以使用該格子。
    $statement = $conn->prepare($sql);
    $statement->execute(array(':zone_id' => $zone_id, ':user_id' => $user_id, ':card_id' => $index_array[$i]));

    while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
        if ($row['card_owner'] == $user_id) {
            $result1 = true;
            break;
        }
        // echo $index_array[$i] . ":" . $row['card_owner'];
        // echo ",";
    }
}
//--------------------------------------------------------------
// 且要判斷當前這格($index)當前是否沒人選中
$sql2 = 'SELECT `use_status` FROM `zone` WHERE `card_id` = :card_id AND `zone_id` = :zone_id';

$statement2 = $conn->prepare($sql2);
$statement2->execute(array(':zone_id' => $zone_id, ':card_id' => $index));

while ($row2 = $statement2->fetch(PDO::FETCH_ASSOC)) {
    if ($row2['use_status'] == "0") {
        $result2 = true;
    }
}




if ($result1 == true && $result2 == true) {
    echo "ok";
} else {
    if ($result1 == true && $result2 == false) {
        echo "11";
    }
    if ($result2 == true && $result1 == false) {
        echo "22";
    }
    if ($result1 == false && $result2 == false) {
        echo "33";
    }
}
#關閉連線
$conn = null;

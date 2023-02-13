<?php header('Access-Control-Allow-Origin: *');

include "dbconn.php";
#變數設定
$zone_id = $_POST['zone_id'];
// $zone_id = 1;
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

$sql = 'SELECT * FROM `zone` WHERE `zone_id` = :zone_id';

#執行prepare
$statement = $conn->prepare($sql);
$statement->execute(array(":zone_id" => $zone_id));

while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
    $allData[] = array(
        "card_id" => $row['card_id'],
        "zone_name" => $row['zone_name'],
        "card_owner" => $row['card_owner'],
        "card_level" => $row['card_level'],
        "first_location" => $row['first_location'],
        "use_status" => $row['use_status'],
    );
}
echo json_encode($allData);

#關閉連線
$conn = null;

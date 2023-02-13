<?php header('Access-Control-Allow-Origin: *');

include "dbconn.php";
$index = $_POST['index'];
$user_id;
#變數設定

#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

$sql = 'SELECT * FROM `zone` WHERE `card_id` = :card_id AND `first_location` = 1'; // 取得該格子的使用者

#執行prepare
$statement = $conn->prepare($sql);
$statement->execute(array(':card_id' => $index));

while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
    $user_id = $row['card_owner'];
}

// -----------------------------------------------------
$sql2 = 'SELECT * FROM `user` WHERE `user_id` = :user_id'; // 取得該使用者狀態

#執行prepare
$statement2 = $conn->prepare($sql2);
$statement2->execute(array(':user_id' => $user_id));

while ($row2 = $statement2->fetch(PDO::FETCH_ASSOC)) {
    echo $row2['status'];
}





#關閉連線
$conn = null;

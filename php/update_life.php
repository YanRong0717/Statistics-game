<?php header('Access-Control-Allow-Origin: *');

$user_id = $_POST['user_id'];


include "dbconn.php";
#變數設定
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它





$sql2 = "SELECT `user`.life FROM `user` WHERE `user`.`user_id` = :user_id";
$statement2 = $conn->prepare($sql2);
$statement2->execute(array(':user_id' => $user_id));

$row2 = $statement2->fetch(PDO::FETCH_ASSOC);

$life = (int)$row2['life'];

if ($life == 0) {
    echo "x";
} else if ($life > 0) {
    // ---------------------更新該使用者的生命值(-1)
    $sql = "UPDATE `user` SET `life` = `life` -1  WHERE `user`.`user_id` = :user_id";
    $statement = $conn->prepare($sql);
    $statement->execute(array(':user_id' => $user_id));
    // ---------------------更新該使用者的生命值(-1)
    echo "ok";
}
#關閉連線
$conn = null;

<?php header('Access-Control-Allow-Origin: *');


include "dbconn.php";
#變數設定
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

$sql = "SELECT * FROM `setting` where CURRENT_TIME() BETWEEN `begin` AND `end`";
#執行prepare
$statement = $conn->prepare($sql);
$statement->execute();

$count = $statement->rowCount(); // 若更新成功則會回傳更新行數 這邊只更新一行 所以只有1

print($count);


#關閉連線
$conn = null;

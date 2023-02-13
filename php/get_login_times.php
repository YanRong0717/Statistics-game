<?php header('Access-Control-Allow-Origin: *');

include "dbconn.php";
#變數設定
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

$sql = 'SELECT * FROM `setting`';

#執行prepare
$statement = $conn->prepare($sql);
$statement->execute();

while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
    echo $row['login_times'];
}

#關閉連線
$conn = null;

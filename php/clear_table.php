<?php header('Access-Control-Allow-Origin: *');

#變數設定
$table = $_POST['table'];

// echo $table;
// die();

if ($table == "ques") $sql = "TRUNCATE `game`.`ques`";
if ($table == "user") $sql = "TRUNCATE `game`.`user`";
if ($table == "zone") $sql = "TRUNCATE `game`.`zone`";

include "dbconn.php";

#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

#執行prepare

$statement = $conn->prepare($sql);
$statement->execute();
$count = $statement->rowCount();
print_r($count);

#關閉連線
$conn = null;

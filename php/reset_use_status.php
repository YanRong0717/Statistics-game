<?php header('Access-Control-Allow-Origin: *');

include "dbconn.php";
date_default_timezone_set("Asia/Taipei");
#變數設定
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它


$sql = "UPDATE `zone` SET `use_status` = '0' WHERE (timestampdiff(second,`zone`.`deadline`,now()) >= 0)";

$statement = $conn->prepare($sql);
$statement->execute();


//---------------------------------------------
$sql2 = "UPDATE `zone` SET `use_status` = '0' , `deadline` = now()  WHERE `deadline` = '0000-00-00 00:00:00'";
$statement2 = $conn->prepare($sql2);
$statement2->execute();

$count = $statement2->rowCount();


if ($count > 0) {
    file_put_contents("../log.txt", $count . "\t" . date("Y-m-d h:i:sa") . "\n", FILE_APPEND | LOCK_EX);
}

//---------------------------------------------




$status = $statement->execute();
if ($status) {
    echo 'ok';
} else {
    echo 'failed';
}
#關閉連線
$conn = null;

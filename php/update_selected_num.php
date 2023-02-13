<?php header('Access-Control-Allow-Origin: *');


$ques_id = $_POST['ques_id'];

include "dbconn.php";
#變數設定
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它


// ------------------------------------------------------------------
$sql2 = "UPDATE `ques` SET `selected_num` = `selected_num` +1 WHERE `ques_id` = :ques_id";
$statement2 = $conn->prepare($sql2);
$statement2->execute(array(":ques_id" => $ques_id));
// ------------------------------------------------------------------

$count = $statement2->rowCount(); // 若更新成功則會回傳更新行數 這邊只更新一行 所以只有1
print($count);


#關閉連線
$conn = null;

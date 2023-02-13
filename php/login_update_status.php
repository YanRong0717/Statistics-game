<?php header('Access-Control-Allow-Origin: *');

include "dbconn.php";
$user_account = $_POST['user_account'];
$user_pwd = $_POST['user_pwd'];
#變數設定

#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

$sql = 'UPDATE `user` SET current_index = -1 , `status` = 0 WHERE `user`.`user_account` = :user_account and `user`.`user_pwd` = :user_pwd';
# card_level & ques_level 其實要輸入的是一樣的，這邊只是讓他搜尋時不會多跑幾筆

#執行prepare
$statement = $conn->prepare($sql);
$statement->execute(array(':user_account' => $user_account, ':user_pwd' => $user_pwd));

$count = $statement->rowCount(); // 若更新成功則會回傳更新行數 這邊只更新一行 所以只有1

print($count);

#關閉連線
$conn = null;

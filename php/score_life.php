

<?php header('Access-Control-Allow-Origin: *');


$user_id = $_POST['user_id'];
// $user_id = 5;
$score = 1; // 用多少分數換
$life = 2; // 換得多少生命
$max_life = 4;

include "dbconn.php";
#變數設定
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

$sql = "UPDATE `user` SET `life` = IF(`score` >= :score , IF(`life` +$life >= $max_life , $max_life ,`life` +$life ),`life`) , `score`  = IF(`score` >= :score , `score` - :score ,`score`)WHERE `user_id` = :user_id";


#執行prepare
$statement = $conn->prepare($sql);
$statement->execute(array(':score' => $score, ':user_id' => $user_id));

$count = $statement->rowCount(); // 若更新成功則會回傳更新行數 這邊只更新一行 所以只有1
print($count);


#關閉連線
$conn = null;

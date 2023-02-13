<?php header('Access-Control-Allow-Origin: *');

include "dbconn.php";
#變數設定
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

$sql = 'SELECT * FROM `setting`';
# card_level & ques_level 其實要輸入的是一樣的，這邊只是讓他搜尋時不會多跑幾筆

#執行prepare
$statement = $conn->prepare($sql);
$statement->execute();

while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
    echo $row['begin'] . "," . $row['end'];
}
// echo json_encode($allData);

#關閉連線
$conn = null;

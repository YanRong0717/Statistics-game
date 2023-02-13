<?php header('Access-Control-Allow-Origin: *');

include "dbconn.php";
#變數設定
$zond_id = $_POST['zone_id'];
$level = $_POST['level'];
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

$sql = 'SELECT b.ques_id,b.ques_content,b.ques_ans,b.ques_ans_lower,b.ques_ans_upper FROM zone a INNER JOIN ques b ON a.zone_id = :zone_id AND b.ques_level = :ques_level AND a.card_level = :card_level ORDER BY RAND() LIMIT 1';
# card_level & ques_level 其實要輸入的是一樣的，這邊只是讓他搜尋時不會多跑幾筆

#執行prepare
$statement = $conn->prepare($sql);
$statement->execute(array(":zone_id" => $zond_id, ":ques_level" => $level, ":card_level" => $level));

while ($row = $statement->fetch(PDO::FETCH_ASSOC)) {
    $allData[] = array(
        "ques_id" => $row['ques_id'],
        "ques_content" => $row['ques_content'],
        "ques_ans" => $row['ques_ans'],
        "ques_ans_lower" => $row['ques_ans_lower'],
        "ques_ans_upper" => $row['ques_ans_upper'],
    );
}
echo json_encode($allData);

#關閉連線
$conn = null;

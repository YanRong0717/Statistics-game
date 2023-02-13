<?php

include "dbconn.php";

$table_name = $_GET['table'];
// $table_name = 'zone';


ini_set("max_execution_time", "60");
date_default_timezone_set("Asia/Taipei");
ini_set("memory_limit", "256M");
ini_set("max_execution_time", 600);

$file_type = "vnd.ms-excel";
$file_ending = "csv";
$dbTablename = "$table_name-" . date("Y-m-d_H-i-s");




header('Access-Control-Allow-Origin: *');
header("Pragma: public");
header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
header("Content-Type: application/force-download");
header("Content-Type: application/octet-stream");
header("Content-Type: application/xls");
header("Content-Disposition: attachment; filename=$dbTablename.$file_ending");
header("Content-Transfer-Encoding: binary ");
header("Pragma: no-cache");
header("Expires: 0");
# -----------------------------------------------------------------------------------------

#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
$conn->exec("set names utf8");
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它



$sql = "SELECT * FROM `{$table_name}`";
# card_level & ques_level 其實要輸入的是一樣的，這邊只是讓他搜尋時不會多跑幾筆

#執行prepare
$statement = $conn->prepare($sql);
$statement->execute();

$rows = $statement->fetchAll(PDO::FETCH_NUM);
echo "\xEF\xBB\xBF";
foreach ($rows as $row) {
    // print_r($rows);
    foreach ($row as $key => $value) {
        // echo $row[$key] . ",";
        if ($table_name == 'ques') {
            if ($key == 0) {
                echo "NULL,";
            } elseif ($key == 5) { // 這裡的5是ques_content的欄位num
                echo "\"" . $row[$key] . "\",";
            } elseif ($key == 8) {
                echo $row[$key] . "\n";
            } else {
                echo $row[$key] . ",";
            }
        }

        if ($table_name == 'user') {
            if ($key == 0) {
                echo "NULL,";
            } elseif ($key == 10) {
                echo $row[$key] . "\n";
            } else {
                echo $row[$key] . ",";
            }
        }

        if ($table_name == 'zone') {
            if ($key == 0) {
                echo "NULL,";
            } elseif ($key == 3) { // 這裡的3是zone_name的欄位num
                echo "\"" . $row[$key] . "\",";
            } elseif ($key == 9) {
                echo $row[$key] . "\n";
            } else {
                echo $row[$key] . ",";
            }
        }
    }
}
// echo json_encode($allData);

#關閉連線
$conn = null;

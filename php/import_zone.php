<?php header('Access-Control-Allow-Origin: *');


$fieldseparator = ",";
$lineseparator = "\n";
// $csvfile = "test3.csv"; // 測試路徑

$filename = $_FILES["file"]["name"]; // 檔案名稱
$filetmpname = $_FILES["file"]["tmp_name"]; // 上傳檔案後的暫存資料夾位置


// ---------------------------------------------------
include "dbconn.php";

$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password, array(
    PDO::MYSQL_ATTR_LOCAL_INFILE => true
)); #初始化一個PDO物件
# https://stackoverflow.com/questions/7638090/load-data-local-infile-forbidden-in-php

if (!file_exists($filetmpname)) {
    die("找不到檔案，請確認路徑是否正確.");
}

$affectedRows = $conn->exec(
    "LOAD DATA LOCAL INFILE "
        . $conn->quote($filetmpname)
        . " INTO TABLE `$zone_table` CHARACTER SET 'UTF8' FIELDS  TERMINATED BY "
        . $conn->quote($fieldseparator) . "enclosed by '\"' escaped by '\"'"
        . "LINES TERMINATED BY "
        . $conn->quote($lineseparator)
);

echo "共新增了 " .  $affectedRows . "筆至 \"$zone_table\" 資料表中.\n";

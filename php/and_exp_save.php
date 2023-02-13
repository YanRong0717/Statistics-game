<?php
include "dbconn.php";
#連結資料庫
$link = mysqli_connect($host, $username, $password);
// 選取資料庫
mysqli_select_db($link, $dbname);
// 透過mysqli_query執行資料庫指令，設定連線編碼
mysqli_query($link, "SET NAMES 'utf8'");
// --------------------------------------------------------------------------


// include("connectdb-and.php");
date_default_timezone_set("Asia/Taipei");
ini_set("memory_limit", "256M");
ini_set("max_execution_time", 600);

$mode = "1";
if (!empty($_POST["f_mode"])) {
  $mode = $_POST["f_mode"];
}

$qty = "0";
if (!empty($_POST["f_qty"])) {
  $qty = $_POST["f_qty"];
}

$table_name = 'ques';


//echo $cus_id."<br>";
//echo $mode."<br>";
//echo $box."<br>";
//echo $dt."<br>";
// set header infomation
// export data to excel
if ($mode == 1) {
  //by 下載
  $query = "SELECT * FROM `{$table_name}`";
  if (!($result = mysqli_query($link, $query))) {
    echo "Could not execute query! <br />";
    die(mysqli_error($link) . "</body></html>");
  }

  ini_set("max_execution_time", "60");

  $file_type = "vnd.ms-excel";
  $file_ending = "csv";
  $dbTablename = "game-$table_name-" . date("Ymd-Hi", time());
  $sep = "\t";
  header("Pragma: public");
  header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
  header("Content-Type: application/force-download");
  header("Content-Type: application/octet-stream");
  header("Content-Type: application/xls");
  header("Content-Disposition: attachment; filename=$dbTablename.$file_ending");
  header("Content-Transfer-Encoding: binary ");
  header("Pragma: no-cache");
  header("Expires: 0");

  while ($property = mysqli_fetch_field($result)) { //fetch table field name
    echo $property->name . ",";
  }
  print "\n";
  while ($row = mysqli_fetch_row($result)) {
    $schema_insert = "";
    for ($j = 0; $j <= mysqli_num_fields($result); $j++) {
      if (!isset($row[$j]))
        $schema_insert .= "NULL" . $sep;
      elseif ($row[$j] != "")
        // if ($j == 0) {
        //   $schema_insert .= "NULL" . $sep;
        // } else {
        //   $schema_insert .= "$row[$j]" . $sep;
        // }
        $schema_insert .= "$row[$j]" . $sep;
      else
        $schema_insert .= "" . $sep;
    }
    $schema_insert = str_replace($sep . "$", "", $schema_insert);
    $schema_insert = preg_replace("/\r\n|\n\r|\n|\r/", " ", $schema_insert);
    $schema_insert .= "\t";
    print(trim($schema_insert));
    print "\n";
  }
} else if ($mode == 2) {
  //by 刪除
  $query = "delete from info order by info_id asc limit " . $qty;
  //echo $query."<br>";

  if (!($result = mysqli_query($link, $query))) {
    echo "Could not execute query! <br />";
    die(mysqli_error($link) . "</body></html>");
  }

  header("Content-Type:text/html; charset=utf-8");

  $msg =
    "<script type=\"text/javascript\">
   alert(\"刪除完成!\");
   location.replace(\"and_exp.php\");     
   </script>";
  echo $msg;
}

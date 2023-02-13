<?php header('Access-Control-Allow-Origin: *');


include "dbconn.php";
#變數設定
#連結資料庫
$conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
$conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件
#設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它

$sql = "SELECT * FROM `setting` where CURRENT_TIME() BETWEEN `begin` AND `end`";
#執行prepare
$statement = $conn->prepare($sql);
$statement->execute();

$count = $statement->rowCount(); // 若更新成功則會回傳更新行數 這邊只更新一行 所以只有1


if ($count > 0) { //代表目前時間可以遊玩


    $user = $_POST['user'];
    $pass = $_POST['pass'];
    // $user = "111";
    // $pass = "111";
    // $setting_time = 3600; #秒

    include "second_to_date.php";


    #變數設定
    #連結資料庫
    $conn_str = $database . ":host=" . $host . ";dbname=" . $dbname . ";charset=utf8";
    $conn = new PDO($conn_str, $username, $password); #初始化一個PDO物件



    $sql55 = "SELECT `Reset_NextDay` FROM `setting`";
    $statement55 = $conn->prepare($sql55);
    $statement55->execute();

    $result55 = $statement55->fetch(PDO::FETCH_ASSOC);
    // print_r($result55['Reset_NextDay']);
    // die();
    // -----------------------------------------------------------------------------
    if ($result55['Reset_NextDay'] == "1") {
        $max_life = 4; //最大生命

        $sql88 = "UPDATE `user` SET `life` = IF(CURRENT_DATE() > DATE(`login_time`) , '{$max_life}' , `life`) WHERE `user_account` = :user_account AND `user_pwd` = :user_pwd";

        #執行prepare
        $statement88 = $conn->prepare($sql88);
        $statement88->execute(array(":user_account" => $user, "user_pwd" => $pass));
    }

    // -----------------------------------------------------------------------------

    $sql66 = "UPDATE `user` SET `login_status` = '0' WHERE (UNIX_TIMESTAMP (NOW()) - UNIX_TIMESTAMP(`user`.`login_time`) >= login_interval)";
    #執行prepare
    $statement66 = $conn->prepare($sql66);
    $statement66->execute();




    // --------------------------------- 查看是否可以換命 ------------------------
    $sql22 = "SELECT `exchange_life_status` FROM `setting`";
    #執行prepare
    $statement22 = $conn->prepare($sql22);
    $statement22->execute();
    $result22 = $statement22->fetch(PDO::FETCH_ASSOC);
    // --------------------------------- 查看是否可以換命 ------------------------




    #設定sql語句，變數前面加上冒號(:)表示它是placeholder，我們會在之後execute的時候再來填入它
    $sql = "SELECT b.user_id,b.user_name,a.zone_id,a.zone_name,b.current_index,b.status,b.login_time,b.login_status,b.login_interval,b.life,b.score,b.team FROM zone a INNER JOIN user b ON `user_account` = :user_account AND `user_pwd` = :user_pwd AND a.zone_id = b.zone_id ORDER BY b.user_id DESC LIMIT 0 , 1";
    #執行prepare
    $statement = $conn->prepare($sql);
    $statement->execute(array(':user_account' => $user, ':user_pwd' => $pass));

    $result = $statement->fetch(PDO::FETCH_ASSOC);
    $count = $statement->rowCount();




    if ($count != 0) { //有搜尋到此帳號
        if ($result['login_status'] == 0) { //目前無人登入，可以直接登

            //------------------------------------------------------------------------
            $sql2 = "UPDATE `user` SET `login_time` = NOW(),`login_status` = 1 WHERE `user_account` = :user_account AND `user_pwd` = :user_pwd";
            #執行prepare
            $statement2 = $conn->prepare($sql2);
            $statement2->execute(array(':user_account' => $user, ':user_pwd' => $pass));
            $count2 = $statement->rowCount();

            // --------------------------------- 登入次數+1 ------------------------
            $sql55 = "UPDATE `setting` SET `login_times` = `login_times` + 1";
            #執行prepare
            $statement55 = $conn->prepare($sql55);
            $statement55->execute();
            // --------------------------------- 登入次數+1 ------------------------
            if ($count2 >= 1) {
                print_r("yes," . $result['user_id'] . "," . $result['user_name'] . "," . $result['zone_id'] . "," . $result['zone_name'] . "," . $result['current_index'] . "," . $result['status'] . "," . $result['login_time'] . "," . $result['login_status'] . "," .  $result['life'] . "," .  $result['score'] . "," . $result22['exchange_life_status'] . "," . $result['team']);
            } else {
                print_r("failed");
            }
            //------------------------------------------------------------------------
        } else if ($result['login_status'] == 1) { # 目前有人登入，須檢查距離上次登入有沒有超過1個小時，如果有，則必須等到1個小時後才能登，並在登入時，將登入時間改變
            $sql3 = "SELECT TIMESTAMPDIFF(SECOND, (SELECT `user`.`login_time` FROM `user` WHERE `user_account` = :user_account AND `user_pwd` = :user_pwd), NOW())";

            $statement3 = $conn->prepare($sql3);
            $statement3->execute(array(':user_account' => $user, ':user_pwd' => $pass));

            $row3 = $statement3->fetch(PDO::FETCH_NUM);
            $login_interval = $result['login_interval'];

            if ($login_interval - $row3[0] <= 0) {
                // echo "已經超過1個小時，可以登入了";
                //------------------------------------------------------------------------
                $sql4 = "UPDATE `user` SET `login_time` = NOW(),`login_status` = 1 WHERE `user_account` = :user_account AND `user_pwd` = :user_pwd";
                #執行prepare
                $statement4 = $conn->prepare($sql4);
                $statement4->execute(array(':user_account' => $user, ':user_pwd' => $pass));

                $count4 = $statemen4t->rowCount();
                if ($count4 >= 1) {
                    print_r("yes," . $result['user_id'] . "," . $result['user_name'] . "," . $result['zone_id'] . "," . $result['zone_name'] . "," . $result['current_index'] . "," . $result['status'] . "," . $result['login_time'] . "," . $result['login_status'] . "," .  $result['life'] . "," . $result22['exchange_life_status'] . "," . $result['team']);
                } else {
                    print_r("failed");
                }
                //------------------------------------------------------------------------
            } else {
                echo "no," . Sec2Time($login_interval - $row3[0]); //還需要等這麼多秒才能登
            }
        }
    } else {
        echo "x"; //帳密有誤
    }

    #關閉連線
    $conn = null;
} else { //非遊玩時間
    echo "QQ";
}

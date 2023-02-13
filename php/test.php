<?php
date_default_timezone_set("Asia/Taipei");
file_put_contents("../log.txt", "222222" . "\t" . date("Y-m-d h:i:sa") . "\n", FILE_APPEND | LOCK_EX);

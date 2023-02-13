// -------------------------------------------------------
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: true,
})
// -------------------------------------------------------
function get_cookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function delete_cookie(name, path) {
    if (get_cookie(name)) {
        document.cookie = name + "=" +
            ";path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT";
    }
}
function get_unescape_Cookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]); return null;
};
// -------------------------------------------------------

$(document).ready(function () {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // --------------------------------------------------------------   
    get_game_time()
    // --------------------------------------------------------------
    var pass = document.getElementById("pass");
    pass.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            login_event()
        }
    });

    var user = document.getElementById("user");
    user.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            login_event()
        }
    });
});
// -------------------------------------------------------
function login_event() { //按下登入按鈕所做的動作
    // console.log($('#user').val())
    // console.log($('#pass').val())

    $(".logbtn").prop("disabled", true)

    $.ajax({
        type: 'POST', //必要 少了type:POST 會無法將data傳給php
        url: '../php/login.php',
        data: {
            user: $('#user').val(),
            pass: $('#pass').val()
        },
        async: false,
        xhrFields: {
            withCredentials: true
        },
        datatype: 'text',
        success: function (e) {
            // console.log(e)
            if (e == "QQ") { // 非遊玩時間
                Swal.fire({
                    icon: 'error',
                    title: '現在非開放時間 ！！',
                    timer: 5000,
                    timerProgressBar: true,
                })
            } else {


                var strArray = e.split(',')
                var r = strArray[0]


                if (r == "yes") {


                    $.ajax({ // 每次登入時，都將該使用者的current_index = -1 , status = 0
                        type: "post",
                        url: 'php/login_update_status.php',
                        data: {
                            user: $('#user').val(),
                            pass: $('#pass').val()
                        },
                        async: false,
                        dataType: 'text',
                        success: function (data) {
                            console.log(data)
                        },
                        error: function (e) {
                            Toast.fire({
                                icon: 'error',
                                title: '使用者資料獲取失敗 ！！',
                            })
                        }
                    })



                    var user_id = strArray[1]
                    var user_name = strArray[2]
                    var zone_id = strArray[3]
                    var zone_name = strArray[4]
                    var current_index = strArray[5]
                    var status = strArray[6]
                    var login_time = strArray[7]
                    var login_status = strArray[8]
                    var life = strArray[9]
                    var score = strArray[10]
                    var exchange_life_status = strArray[11]
                    var team = strArray[12]

                    Swal.fire({
                        icon: 'success',
                        title: '登入成功 ！',
                        timer: 800,
                        timerProgressBar: true,
                    })


                    $(".logbtn").prop("disabled", true)
                    $('#user').val("")
                    $('#pass').val("")

                    delete_cookie("exam2_user_id")
                    delete_cookie("exam2_user_name")
                    delete_cookie("exam2_user_life")
                    delete_cookie("exam2_user_score")
                    delete_cookie("exam2_zone_id")
                    delete_cookie("exam2_zone_name")
                    delete_cookie("exam2_current_index")
                    delete_cookie("exam2_this_level")
                    delete_cookie("exam2_status")
                    delete_cookie("exam2_ques_id")
                    delete_cookie("exam2_ques")
                    delete_cookie("exam2_ans")
                    delete_cookie("exam2_ans_lower")
                    delete_cookie("exam2_ans_upper")
                    delete_cookie("exam2_login_time")
                    delete_cookie("exam2_login_status")
                    delete_cookie("result2")
                    delete_cookie("exam2_exchange_life_status")
                    delete_cookie("exam2_team")



                    document.cookie = "exam2_user_id=" + user_id + "; path=/;"; //將id放入cookie
                    document.cookie = "exam2_user_life=" + life + "; path=/;";
                    document.cookie = "exam2_user_score=" + score + "; path=/;";
                    document.cookie = "exam2_zone_id=" + zone_id + "; path=/;";
                    document.cookie = "exam2_zone_name=" + escape(zone_name) + "; path=/;";
                    document.cookie = "exam2_user_name=" + escape(user_name) + "; path=/;";
                    document.cookie = "exam2_current_index=" + current_index + "; path=/;";
                    document.cookie = "exam2_status=" + status + "; path=/;";
                    document.cookie = "exam2_login_time=" + login_time + "; path=/;";
                    document.cookie = "exam2_login_status=1" + "; path=/;";
                    document.cookie = "exam2_exchange_life_status=" + exchange_life_status + "; path=/;";
                    document.cookie = "exam2_team=" + team + "; path=/;";
                    document.cookie = "result2=0" + "; path=/;";

                    // console.log(user_id)
                    // console.log(user_name)
                    // console.log(zone_id)
                    // console.log(zone_name)
                    // console.log(current_index)
                    // console.log(status)

                    setTimeout(function () {
                        location.href = "../"
                    }, 800)
                } else if (e == "x") {
                    Swal.fire({
                        icon: 'error',
                        title: '帳號或密碼錯誤 ！',
                    })

                    $(".logbtn").prop("disabled", false)
                } else {
                    var q = strArray[1] //剩餘時間
                    Swal.fire({
                        icon: 'error',
                        title: '登入失敗 ！\n',
                        text: '還需要等 ~ ' + q + " ~",
                    })
                    $(".logbtn").prop("disabled", false)
                }
            }



        },
        error: function (e) {
            // alert('系統異常！請稍後再試！');
            Toast.fire({
                icon: 'error',
                title: '系統異常！請稍後再試！',
            })
        }
    });

}




function get_game_time() {
    $.ajax({
        type: "post",
        url: '../php/get_game_time.php',
        data: 'data',
        async: false,
        dataType: 'text',
        success: function (data) {
            var strArray = data.split(',')
            var begin = strArray[0]
            var end = strArray[1]

            $('.login-form h3').html('<i class="fas fa-clock"></i> 開放時間 ' + begin + ' ~ ' + end)
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '獲取開放時間失敗 ！！',
            })
        }
    })
}

$(document).on('click', '.logbtn', function (e) {
    e.preventDefault();
    login_event();
});


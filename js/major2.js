// ----------------------
var zone_name;
var i_occupied = [];
var other = [];
var last_time = [];
var time = 0;
var user_ans;
var check_ans_status = false;
var counter = 0;
// ---------------------------------------------------------------------
var clock;
// ---------------------------------------------------------------------
var up, down, left, right;
var other_up, other_down, other_left, other_right, other_way;
var num = 10; // 10*10
var current_index;
// ---------------------------------------------------------------------
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: true,
})
// ---------------------------------------------------------------------
// ---------------------------------------------------------------------
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

function xor(x) {
    var input = x
    var key = 0977559155
    var output = ""
    for (i = 0; i < input.length; ++i) {
        output += String.fromCharCode(key ^ input.charCodeAt(i));
    }
    return output
}
// ---------------------------------------------------------------------
$(document).ready(function () {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    document.getElementById("question").onselectstart = function () {
        // console.log("onselect")
        return false;
    };

    // https://blog.csdn.net/zzk220106/article/details/81313259


    document.getElementById("question").ontouchend = function () {
        console.log("ontouchend")
        return false;
    }



    $('.btn input').attr('disabled', true);
    $('.card .item').prop('disabled', false);

    $(".refresh").hide()
    clock = $('.clock').FlipClock(time, {
        clockFace: 'MinuteCounter',
        countdown: true,
        autoStart: false,
        callbacks: {
        }
    });
    // ------------------------------------------------------------
    get_zone()
    print_ques()
    timer()
    reset_status()
    update_score_life_html()
    record()
    // ------------------------------------------------------------
    setInterval(function () {
        setTimeout(function () { //每次刷新時的動畫
            $(".refresh").show();
            setTimeout(function () {
                $(".refresh").hide();
            }, 1100)
        }, 1000)


        get_zone()
        print_ques()
        record()
    }, 5000)

    // ----------------------------------------------------------------
    if (document.body.scrollWidth < 768) {
        $(".footer table").css("order", "1")
    }
})



// https://blog.csdn.net/CS_wuxiang/article/details/7796320

document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === 'visible') {
        timer()
    } else {
    }
});









function update_score_life_html() {
    $(".star").html("") // 先清空
    var life = parseInt(get_cookie("exam2_user_life"))
    var score = parseInt(get_cookie("exam2_user_score"))
    if (life >= 4) life = 4;
    // console.log(life)
    // console.log(score)
    if (life == 0) {
        $(".star").html('<p>點此換取生命</p><i class="far fa-heart"></i><i class="far fa-heart"></i><i class="far fa-heart"></i><i class="far fa-heart"></i>')
    }
    else if (life == 1) {
        $(".star").html('<p>點此換取生命</p><i class="fas fa-heart"></i><i class="far fa-heart"></i><i class="far fa-heart"></i><i class="far fa-heart"></i>')
    } else if (life == 2) {
        $(".star").html('<p>點此換取生命</p><i class="fas fa-heart"></i><i class="fas fa-heart"></i></i><i class="far fa-heart"></i><i class="far fa-heart"></i>')
    } else if (life == 3) {
        $(".star").html('<p>點此換取生命</p><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="far fa-heart"></i>')
    }
    else if (life == 4) {
        $(".star").html('<p>點此換取生命</p><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i>')
    }

    $(".score .txt").html("") // 先清空
    $(".score .txt").html('<i class="fas fa-medal" aria-hidden="true"></i> Score : ' + score)
}








$(document).on('click', '.card div', function (e) { // 點擊任意圖片時

    current_index = $(".card div").index(this);
    $('.card .item').prop('disabled', true);

    $.ajax({
        type: 'POST', //必要 少了type:POST 會無法將data傳給php
        url: 'php/check_game_time.php',
        data: "data",
        dataType: 'text',
        async: false,
        success: function (data) {
            console.log(parseInt(data))
            if (parseInt(data) >= 1) {

                Swal.fire({
                    title: "確定要選擇此題？",
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: "確定",
                    cancelButtonText: "取消"
                }).then(result => {
                    if (result.value) {
                        // ---------- 增加1.2秒鐘載入動畫 ----------------
                        Swal.fire({
                            title: '~ 載入中 ~',
                            timer: 800,
                            timerProgressBar: true,
                            onBeforeOpen: () => {
                                Swal.showLoading()
                                timerInterval = setInterval(() => {
                                    const content = Swal.getContent()
                                    if (content) {
                                        const b = content.querySelector('b')
                                        if (b) {
                                            b.textContent = Swal.getTimerLeft()
                                        }
                                    }
                                }, 100)
                            },
                            onClose: () => {
                                clearInterval(timerInterval)
                            }
                        })
                        // ---------- 增加1.2鐘載入動畫 ----------------

                        // 詢問zone table，檢查該zone_id的index是否已經被選走，如果已被選走，則刪除cookie，讓使用者重新選取，並更新status、current_index狀態至-1、重新載入整張表格(get_zone)。若沒被選走，則更新status=1、current_index=當前選中之項目代碼、重新載入整張表格(get_zone)，並印出題目、解鎖btn使用。




                        delete_cookie("exam2_current_index")

                        // // console.log(current_index)
                        // // console.log(owner)

                        // //將current_index放入cookie ，這樣重新整理時，也可以知道上次點了哪個，以便後續繼續作答同一題
                        document.cookie = "exam2_current_index=" + current_index + "; path=/;";

                        // console.log(current_index)
                        reset_status()
                        check_owner()
                        // update_owner()


                        // current_index = get_cookie("exam2_current_index")
                        _3x3()

                    } else {
                        $('.card .item').prop('disabled', false);
                        // console.log(result.dismiss)
                    }
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: '現在非開放時間 ！！',
                    timer: 1000,
                    timerProgressBar: true,
                })
                setTimeout(function () {
                    logout()
                }, 1100)



            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '遊玩時間資訊獲取失敗 ！！',
            })
        }
    })



})






$(document).on('click', '.star', function (e) { //點擊送出按鈕時
    var exchange_life_status = parseInt(get_cookie("exam2_exchange_life_status"))
    if (exchange_life_status == 0) { // 如果為0，代表不能夠以分數換生命
        Toast.fire({
            icon: 'warning',
            title: '尚未開放此功能',
            timer: 3000,
            timerProgressBar: true,
        })
    } else {
        if (parseInt(get_cookie("exam2_user_life")) >= 4) {
            Toast.fire({
                icon: 'success',
                title: '您的生命值已滿',
                timer: 1000,
                timerProgressBar: true,
            })
        } else {
            Swal.fire({
                html: "確定要以１點分數換２格生命？",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: "確定",
                cancelButtonText: "取消"
            }).then(result => {
                if (result.value) {
                    $.ajax({
                        type: "post",
                        url: 'php/score_life.php',
                        data: {
                            user_id: get_cookie("exam2_user_id"),
                        },
                        async: false,
                        dataType: 'text',
                        success: function (data) {
                            // console.log(data)
                            if (data == 1) {
                                // console.log("deal ok！！")
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                });

                                Toast.fire({
                                    icon: 'success',
                                    title: '您的生命值已增加',
                                    timer: 1000,
                                    timerProgressBar: true,
                                })

                                var before_life = parseInt(get_cookie("exam2_user_life"))
                                var before_score = parseInt(get_cookie("exam2_user_score"))

                                delete_cookie("exam2_user_life")
                                delete_cookie("exam2_user_score")
                                if (before_life == 3) { // 3+2 會變成5，到下面的cookie會有問題，這邊直接將3變成2，以便下面的cookie，不會大於4
                                    before_life = 2;
                                }
                                // １分換２命
                                document.cookie = "exam2_user_life=" + (before_life + 2) + "; path=/;";
                                document.cookie = "exam2_user_score=" + (before_score - 1) + "; path=/;";

                                update_score_life_html()

                            } else {
                                // console.log("deal failed！！")
                                Toast.fire({
                                    icon: 'error',
                                    title: '您的分數不足換取生命 ！！',
                                })
                            }
                        },
                        error: function (e) {
                            Toast.fire({
                                icon: 'error',
                                title: '更新生命值失敗 ！！',
                            })
                        }
                    })
                } else {
                    // console.log(result.dismiss)
                }
            })
        }
    }
})









function print_ques() {
    if (get_unescape_Cookie("exam2_ques") != null) {
        $('.btn input').attr('disabled', false);
        $('.card .item').prop('disabled', true);
    }

    $(".question h3 pre").text(get_unescape_Cookie("exam2_ques"))

    if (document.body.scrollWidth >= 768) {
        $(".question h3 pre").niceScroll({
            cursorwidth: 10,         //滾動條寬度
            autohidemode: true,      //滚動條是否是自動隐藏，默認值为 true
            railoffset: true,
            railoffset: { left: 5 }, //可以使用top/left来修正位置
            touchbehavior: true, // 激活拖拽滚动
        });
        $(".table-content").niceScroll({
            cursorwidth: 10,         //滾動條寬度
            autohidemode: false,      //滚動條是否是自動隐藏，默認值为 true
            autohidemode: true,
            railoffset: true,
            railoffset: { left: 5 }, //可以使用top/left来修正位置
        });
    }
}

function get_ques() {

    $.ajax({
        type: 'POST', //必要 少了type:POST 會無法將data傳給php
        url: 'php/get_ques.php',
        data: 'data',
        dataType: 'json',
        async: false,
        success: function (data) {
            var ques_id = data[0].ques_id
            var ques = data[0].ques_content
            var level = data[0].ques_level
            var ans = data[0].ques_ans
            var lower = data[0].ques_ans_lower
            var upper = data[0].ques_ans_upper

            encrypted_ans = xor(ans)
            encrypted_lower = xor(lower)
            encrypted_upper = xor(upper)

            // console.log(ques)
            // console.log(ans)
            // console.log(lower)
            // console.log(upper)
            // console.log(encrypted_ans)
            // console.log(encrypted_lower)
            // console.log(encrypted_upper)



            // //將current_index放入cookie ，這樣重新整理時，也可以知道上次點了哪個，以便後續繼續作答同一題
            document.cookie = "exam2_ques_id=" + ques_id + "; path=/;";
            document.cookie = "exam2_ques_level=" + level + "; path=/;";
            document.cookie = "exam2_ques=" + escape(ques) + "; path=/;";
            document.cookie = "exam2_ans=" + escape(encrypted_ans) + "; path=/;";
            document.cookie = "exam2_ans_lower=" + escape(encrypted_lower) + "; path=/;";
            document.cookie = "exam2_ans_upper=" + escape(encrypted_upper) + "; path=/;";



        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '題目資訊獲取失敗 ！！',
            })
        }
    })

}

function get_zone() {
    $.ajax({
        type: 'POST', //必要 少了type:POST 會無法將data傳給php
        url: 'php/get_zone.php',
        data: {
            zone_id: get_cookie("exam2_zone_id")
        },
        dataType: 'json',
        async: false,
        success: function (data) {
            // console.log(data)
            var contain = "";
            $(".card").html("")
            i_occupied = [] // 重置此陣列
            $.each(data, function (key, value) {
                var owner = value.card_owner;
                var use = value.use_status;
                var first = value.first_location;
                var name = value.user_name;
                var team = value.team;

                if (owner == get_cookie("exam2_user_id")) { // 擁有者為自己時
                    contain +=
                        `<div class='item this' style='background: #03a9f4;box-shadow: none;color: #fff;'>${name}</div>`
                    i_occupied.push(key)

                } else if (owner == 0 && first == 0 && use == 1) { // 目前被使用的格子且不是屬於任何人的
                    contain +=
                        `<div class='item using' style='background: #E680FF;box-shadow: none;'><i class="fas fa-street-view" style="color: #222;"></i></div>`
                } else if (team == get_cookie("exam2_team")) { // 跟自己同隊的
                    contain +=
                        `<div class='item using other' style='background: #03a9f4;box-shadow: none;color: #fff;'>${name}</div>`
                } else if (owner != 0 && team != get_cookie("exam2_team")) { // 敵隊的
                    contain +=
                        `<div class='item using other' style='background: #FF5151;box-shadow: none;color: #fff;'>${name}</div>`
                }
                else { // 如果當前有人選中
                    contain +=
                        `<div class='item'></div>`
                }
            })

            $(".card").append(contain)

            _3x3() //將每個被佔領的(i_occupied)周圍，做調整

            // -------------------------------------------------
            $(".user .name h3").eq(0).html(`<i class="fas fa-user" aria-hidden="true"></i> 
            ` + get_unescape_Cookie("exam2_user_name"))
            $(".user .name h3").eq(1).html(`<i class="fab fa-font-awesome-flag" aria-hidden="true"></i> ` + get_unescape_Cookie("exam2_zone_name"))
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '地圖資訊獲取失敗 ！！',
            })
        }
    })
}


function update_deadline() {
    $.ajax({
        type: "post",
        url: 'php/update_deadline.php',
        data: {
            ques_id: get_cookie("exam2_ques_id"),
            zone_id: get_cookie("exam2_zone_id"),
            index: current_index,
        },
        async: false,
        dataType: 'text',
        success: function (data) {
            // console.log(data[0])
            if (data == "1") {
                // console.log("update deadline ok！！")
                timer()
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '題目截止日期更新失敗 ！！',
            })
        }
    })
}



function timer() {
    if (get_cookie("exam2_status") == "1") { //如果在作答中，才去抓取時間
        $.ajax({
            type: "post",
            url: 'php/get_deadline.php',
            data: {
                index: get_cookie("exam2_current_index"),
                zone_id: get_cookie("exam2_zone_id"),
            },
            async: false,
            dataType: 'text',
            success: function (data) {
                // console.log(data) // 作答截止時間
                var format = data.replace(/-/g, '/')   //https://www.jianshu.com/p/cfbd97d31c39
                var deadline = Date.parse(new Date(format));
                // console.log(deadline) // 作答截止時間

                var dateTime = Date.now(); // 當前時間
                var timestamp = Math.floor(dateTime);

                // console.log(timestamp) // 當前時間

                time = (deadline - timestamp) / 1000;// 計時器上要顯示的時間(秒數)
                console.log("time:" + time)


                if (time >= 1) { // 如果還在期限內的話，就啟動計時

                    clock.stop(); // 每次重整時，都用stop讓計時器整個死掉，然後在下面再新增一個新的計時器


                    clock = $('.clock').FlipClock(time, {
                        clockFace: 'MinuteCounter',
                        countdown: true,
                        autoStart: true, //這邊直接自動啟動
                        callbacks: {
                            stop: function () {
                                // console.log(counter)
                                counter++

                                if (counter == 1 && check_ans_status == false) {
                                    timer()
                                    counter = 0
                                }
                                // console.log(777)
                                if (check_ans_status == true) {
                                    clock = $('.clock').FlipClock(0, {
                                        clockFace: 'MinuteCounter',
                                        countdown: true,
                                        autoStart: false,
                                        callbacks: {
                                        }
                                    });

                                    counter = 0;
                                    $('.btn input').attr('disabled', true);
                                    $('.card .item').prop('disabled', false);


                                    timer_reset()
                                }
                            }
                        }
                    });

                } else {
                    if (check_ans_status == false) { // 沒有點選答題時
                        Swal.fire({
                            icon: 'warning',
                            title: '時間到 ！！',
                        })

                        clock = $('.clock').FlipClock(0, {
                            clockFace: 'MinuteCounter',
                            countdown: true,
                            autoStart: false,
                        });
                    }
                    counter = 0;
                    $('.btn input').attr('disabled', true);
                    $('.card .item').prop('disabled', false);


                    timer_reset()



                    // clock.stop();
                    // clock.setTime(0);
                    // if (get_cookie("exam2_status") == 0) {
                    //     timer_reset()

                    //     // Swal.fire({
                    //     //     icon: 'warning',
                    //     //     title: '時間到 ！！',
                    //     // })
                    // }
                }



            },
            error: function (e) {
                Toast.fire({
                    icon: 'error',
                    title: '獲取題目截止日期失敗 ！！',
                })
            }
        })
    }
}



function update_score() {
    $.ajax({
        type: "post",
        url: 'php/update_score.php',
        data: {
            user_id: get_cookie("exam2_user_id"),
            ques_id: get_cookie("exam2_ques_id"),
            index: get_cookie("exam2_current_index"),
            zone_id: get_cookie("exam2_zone_id")

        },
        async: false,
        dataType: 'text',
        success: function (data) {
            // console.log(data)
            if (data == "ok") {
                console.log("update user score ok！！")
                update_score_life_html()
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '更新使用者分數失敗 ！！',
            })
        }
    })
}



function timer_reset() {

    $('.btn input').attr('disabled', true);
    $('.card .item').prop('disabled', false);
    $(".question h3 pre").text("")

    update_owner_after_answer()
    update_user_status_reset()
    reset_status()



    delete_cookie("exam2_ques_id")
    delete_cookie("exam2_ques")
    delete_cookie("exam2_ans")
    delete_cookie("exam2_ques_level")
    delete_cookie("exam2_ans_lower")
    delete_cookie("exam2_ans_upper")


    check_dead() // 這裡面有get_zone

    delete_cookie("result2")
    document.cookie = "result2=0" + "; path=/;";
}



function reset_status() {
    $.ajax({
        type: "post",
        url: 'php/reset_use_status.php',
        data: 'data',
        dataType: 'text',
        async: false,
        success: function (data) {
            console.log(data)
            if (data == "ok") {
                // console.log("update zone's user status ok！！")
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '更新zone使用者狀態失敗 ！！',
            })
        }
    })
}


function update_user_status() {
    $.ajax({
        type: "post",
        url: 'php/update_user_status.php',
        data: {
            user_id: get_cookie("exam2_user_id"),
            current_index: get_cookie("exam2_current_index"),
            status: get_cookie("exam2_status"),
        },
        async: false,
        dataType: 'text',
        success: function (data) {
            // console.log(data[0])
            if (data == "1") {
                // console.log("update user status ok！！")

                // Toast.fire({
                //     icon: 'success',
                //     title: 'update user status ！！',
                //     timer: 3000,
                //     timerProgressBar: true,
                // })
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '更新使用者狀態失敗 ！！',
            })
        }
    })
}

function update_user_status_reset() {
    $.ajax({
        type: "post",
        url: 'php/update_user_status.php',
        data: {
            user_id: get_cookie("exam2_user_id"),
            current_index: -1,
            status: 0,
        },
        async: false,
        dataType: 'text',
        success: function (data) {
            // console.log(data)
            if (data == "1") {
                // console.log("update user status reset ！！")
                // Toast.fire({
                //     icon: 'success',
                //     title: 'update user status reset ！！',
                //     timer: 3000,
                //     timerProgressBar: true,
                // })

                delete_cookie("exam2_current_index")
                delete_cookie("exam2_status")

                document.cookie = "exam2_current_index=-1" + "; path=/;";
                document.cookie = "exam2_status=0" + "; path=/;";

                current_index = -1;
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '更新使用者狀態失敗 ！！',
            })
        }
    })
}

function update_owner_after_answer() { // 回答完後更新zone的card_owner
    //點下去時，檢查該index的周圍是否有自己已經佔領過的(owner)，且該index的owner=-1(尚未被佔領)
    //index -1,+1,-9,+9,-10,+10,-11,+11,
    $.ajax({
        type: "post",
        url: 'php/update_owner_after_answer.php',
        data: {
            user_id: get_cookie("exam2_user_id"),
            zone_id: get_cookie("exam2_zone_id"),
            index: get_cookie("exam2_current_index"),
            result: get_cookie("result2")
        },
        async: false,
        dataType: 'text',
        success: function (data) {
            // console.log(data)
            if (data == "1") {
                // console.log("update owner after answer ！！")
                // Toast.fire({
                //     icon: 'success',
                //     title: 'update owner after answer ！！',
                //     timer: 3000,
                //     timerProgressBar: true,
                // })
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '地圖資訊獲取失敗 ！！',
            })
        }
    })
}




function update_owner() {
    //點下去時，檢查該index的周圍是否有自己已經佔領過的(owner)，且該index的owner=-1(尚未被佔領)
    //index -1,+1,-9,+9,-10,+10,-11,+11,
    $.ajax({
        type: "post",
        url: 'php/update_owner.php',
        data: {
            user_id: get_cookie("exam2_user_id"),
            zone_id: get_cookie("exam2_zone_id"),
            index: get_cookie("exam2_current_index"),
            use_status: 1
        },
        async: false,
        dataType: 'text',
        success: function (data) {
            // console.log(data)
            if (data == "1") {
                // console.log("update owner ok ！！")
                // Toast.fire({
                //     icon: 'success',
                //     title: 'update owner ok ！！',
                //     timer: 3000,
                //     timerProgressBar: true,
                // })
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '地圖資訊獲取失敗 ！！',
            })
        }
    })
}


function check_owner() {
    //點下去時，檢查該index的周圍是否有自己已經佔領過的(owner)，且該index的owner=-1(尚未被佔領)
    //index -1,+1,-10,+10
    $.ajax({
        type: "post",
        url: 'php/check_owner.php',
        data: {
            user_id: get_cookie("exam2_user_id"),
            zone_id: get_cookie("exam2_zone_id"),
            index: get_cookie("exam2_current_index")
        },
        async: false, // ★這邊如果沒有用false (須等待這個ajax執行完)，則會直接執行update_owner，會導致先更新use_status狀態之後，才去check_owner，會有問題。
        dataType: 'text',
        success: function (data) {
            // console.log(data)
            if (data == "ok") {  // 代表沒有人的

                //----------------------------------------------------------------------------------
                var index = get_cookie("exam2_current_index")
                if ($(".card div").eq(index).hasClass("can_select")) { //這是判斷選中的，是不是不具有can_select class，如果有(true)則代表不是選到王冠(crown)或已佔領的位置
                    // console.log("可以選") // 搜尋題目、印出題目

                    //確定可以選之後，將生命值-1後，更新html (update_score_life_html())，若update_life.php回傳ok，則代表生命值還大於0(可以回答)，若回傳x，則表示已無生命。
                    $.ajax({
                        type: "post",
                        url: 'php/update_life.php',
                        data: {
                            user_id: get_cookie("exam2_user_id"),
                        },
                        async: false,
                        dataType: 'text',
                        success: function (data) {
                            // console.log(data)
                            if (data == "ok") { // 生命值還大於0
                                update_owner()


                                // console.log("可以回答題目 ！！")
                                delete_cookie("exam2_status")
                                document.cookie = "exam2_status=1" + "; path=/;";

                                var before_life = parseInt(get_cookie("exam2_user_life")) //先取得原本生命值
                                // console.log(before_life)
                                delete_cookie("exam2_user_life") // 再把原本的刪了
                                document.cookie = "exam2_user_life=" + (before_life - 1) + "; path=/;"; //再新增-1後的生命值
                                update_score_life_html()


                                get_ques()
                                get_zone()
                                print_ques()
                                update_deadline()
                                update_user_status()

                                selected_num() // 被選中之後，將該題目總次數+1





                                delete_cookie("exam2_current_index")
                                document.cookie = "exam2_current_index=" + index + "; path=/;";


                            } else if (data == "x") { // 生命值已歸零
                                Toast.fire({
                                    icon: 'error',
                                    title: '您已經無生命值了 ！！',
                                    timer: 3000,
                                    timerProgressBar: true,
                                })

                                get_zone()
                                update_user_status_reset()
                            }
                        },
                        error: function (e) {
                            Toast.fire({
                                icon: 'error',
                                title: '生命值獲取失敗 ！！',
                            })
                        }
                    })


                } else {
                    Toast.fire({
                        icon: 'error',
                        title: '已經被占領了 ！！',
                        padding: '1.5em',
                        timer: 3000,
                        timerProgressBar: true,
                    })

                    get_zone()
                    update_user_status_reset()
                }
                //----------------------------------------------------------------------------------
            } else {
                console.log(data) // 代表畫面太久沒更新，要更新畫面
                Toast.fire({
                    icon: 'error',
                    padding: '1.5em',
                    width: 360,
                    title: '只能選已佔領之鄰近方塊 ！\n或者此方塊已被人選走　！',
                    timer: 5000,
                    timerProgressBar: true,
                })


                get_zone()
                update_user_status_reset()
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '地圖資訊獲取失敗 ！！',
            })
        }
    })
}


function selected_num() {
    $.ajax({
        type: "post",
        url: 'php/update_selected_num.php',
        data: {
            ques_id: get_cookie("exam2_ques_id"),
        },
        async: false,
        dataType: 'text',
        success: function (data) {
            // console.log(data)
            if (data == "1") {
                // Toast.fire({
                //     icon: 'success',
                //     title: '更新成功 ！！',
                // })
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '生命值獲取失敗 ！！',
            })
        }
    })

}



function _3x3() {
    var index;
    i_occupied.forEach(function (item) {
        // console.log(item)
        index = item;

        (index + 1) - num <= 0 ? up = false : up = true;
        (index + 1) + num > Math.pow(num, 2) ? down = false : down = true;
        (index + 1) % num == 1 ? left = false : left = true;
        (index + 1) % num == 0 ? right = false : right = true;


        // console.log("上:" + up + ",下:" + down + ",左:" + left + ",右:" + right + "\n左上:" + left_up + ",左下:" + left_down + ",右上:" + right_up + ",右下:" + right_down)

        //-------------------------------------- 檢查九宮格
        if (up) {
            if ($(".card .item").eq(index - num).hasClass("using")) {

            } else {// 無人正在使用
                $(".card .item").eq(index - num).css("background-color", "#fafafa")
                $(".card .item").eq(index - num).addClass("can_select")
            }

        }
        if (down) {
            if ($(".card .item").eq(index + num).hasClass("using")) {

            } else { // 無人正在使用
                $(".card .item").eq(index + num).css("background-color", "#fafafa")
                $(".card .item").eq(index + num).addClass("can_select")
            }
        }
        if (left) {
            if ($(".card .item").eq(index - 1).hasClass("using")) {

            } else { // 無人正在使用
                $(".card .item").eq(index - 1).css("background-color", "#fafafa")
                $(".card .item").eq(index - 1).addClass("can_select")
            }
        }
        if (right) {
            if ($(".card .item").eq(index + 1).hasClass("using")) {

            } else {// 無人正在使用
                $(".card .item").eq(index + 1).css("background-color", "#fafafa")
                $(".card .item").eq(index + 1).addClass("can_select")
            }
        }

    });


    //-------------------------------------- 檢查九宮格

    // console.log("3*3")
    if (get_cookie("exam2_status") == 1) {
        $(".card .item").eq(get_cookie("exam2_current_index")).css({ "background-color": "#E680FF", "box-shadow": "none" })
        $(".card .item").eq(get_cookie("exam2_current_index")).addClass("this")
    }
}








$(document).on('click', '.btn input', function (e) { //點擊送出按鈕時
    input_ans();
})


function input_ans() { //輸入答案
    Swal.fire({ //先輸入答案
        title: "請輸入答案",
        input: 'text',
        icon: 'warning',
        showCancelButton: true,
        inputAutoTrim: true, // 自動裁切頭尾空白字元
        confirmButtonText: "確定",
        cancelButtonText: "取消"
    }).then(result => {
        if (result.value) {
            console.log(result.value) // 輸入的答案內容
            user_ans = result.value // 將此答案存至全域變數
            Swal.fire({
                title: "您的答案為",
                html: result.value, // 印出答案內容
                icon: 'warning',
                showCancelButton: true,
                inputAutoTrim: true,
                confirmButtonText: "確定",
                cancelButtonText: "取消"
            }).then(result2 => {
                if (result2.value) {
                    // console.log("確定")
                    check_ans()
                } else {
                    // console.log(result2.dismiss)
                }
            })
        } else {
            // console.log(result.dismiss)
        }
    })
}



function up_down_left_right(index) { // 計算別人死活的公式
    var result = 3; // 不是從4開始是因為我自己也在要判斷的那格的周圍，且我自己的格子的class 沒有"other"
    (index + 1) - num <= 0 ? other_up = false : other_up = true;
    (index + 1) + num > Math.pow(num, 2) ? other_down = false : other_down = true;
    (index + 1) % num == 1 ? other_left = false : other_left = true;
    (index + 1) % num == 0 ? other_right = false : other_right = true;

    if (other_up) {
        if ($(".card .item").eq(index - 10).hasClass("other")) {
            result--;
        }
    } else { // 怕該格子在邊邊
        result--;
    }
    if (other_down) {
        if ($(".card .item").eq(index + 10).hasClass("other")) {
            result--;
        }
    } else { // 怕該格子在邊邊
        result--;
    }
    if (other_left) {
        if ($(".card .item").eq(index - 1).hasClass("other")) {
            result--;
        }
    } else { // 怕該格子在邊邊
        result--;
    }
    if (other_right) {
        if ($(".card .item").eq(index + 1).hasClass("other")) {
            result--;
        }
    } else { // 怕該格子在邊邊
        result--;
    }

    return result;
}


function up_down_left_right2(index) { // 計算我自己死活的公式
    // console.log(index)
    var me_up, me_down, me_left, me_right;
    var peoples = ""; // 自己周遭共有哪些人(找到他們的id)
    (index + 1) - num <= 0 ? me_up = false : me_up = true;
    (index + 1) + num > Math.pow(num, 2) ? me_down = false : me_down = true;
    (index + 1) % num == 1 ? me_left = false : me_left = true;
    (index + 1) % num == 0 ? me_right = false : me_right = true;

    if (me_up) {
        if ($(".card .item").eq(index - 10).hasClass("other")) {
            peoples += index - 10 + ","
        }
    }
    if (me_down) {
        if ($(".card .item").eq(index + 10).hasClass("other")) {
            peoples += index + 10 + ","
        }
    }
    if (me_left) {
        if ($(".card .item").eq(index - 1).hasClass("other")) {
            peoples += index - 1 + ","
        }
    }
    if (me_right) {
        if ($(".card .item").eq(index + 1).hasClass("other")) {
            peoples += index + 1 + ","
        }
    }

    return peoples;
}




function check_dead() { // 答題完後或時間到，檢查是只剩下一條路可選
    get_zone() // 先更新至最新的
    other = [];
    var index;
    $.ajax({
        type: "post",
        url: 'php/get_card_id.php',
        data: {
            user_id: get_cookie("exam2_user_id"),
        },
        async: false,
        dataType: 'text',
        success: function (data) {
            // console.log(data);
            var me_index = parseInt(data);//我自己當前的位置
            var other_index;//別人自己當前的位置
            var me_way = 4; // 我剩下幾條路可走，初始為4條
            var dead = 1; // <= 幾條路可走時，就死掉



            // console.log("上:" + up + ",下:" + down + ",左:" + left + ",右:" + right + "\n左上:" + left_up + ",左下:" + left_down + ",右上:" + right_up + ",右下:" + right_down)

            //-------------------------------------- 檢查九宮格
            if (up) {
                if ($(".card .item").eq(me_index - 10).hasClass("other")) { //other為其他使用者
                    me_way--;
                    //----------------------------------------------------
                    other.push(me_index - 10) // 將上下左右有"別人佔領的"位置存下來
                }
            } else {
                me_way--;
            }
            if (down) {
                if ($(".card .item").eq(me_index + 10).hasClass("other")) {
                    me_way--;
                    //----------------------------------------------------
                    other.push(me_index + 10)// 將上下左右有"別人佔領的"位置存下來
                }
            } else {
                me_way--;
            }
            if (left) {
                if ($(".card .item").eq(me_index - 1).hasClass("other")) {
                    me_way--;
                    //----------------------------------------------------
                    other.push(me_index - 1) // 將上下左右有"別人佔領的"位置存下來
                }
            } else {
                me_way--;
            }
            if (right) {
                if ($(".card .item").eq(me_index + 1).hasClass("other")) {
                    me_way--;
                    //----------------------------------------------------

                    other.push(me_index + 1) // 將上下左右有"別人佔領的"位置存下來
                }
            } else {
                me_way--;
            }

            // console.log(me_way)

            if (me_way <= dead && get_cookie("exam2_status") == "0") { // 自殺("包含自己走進去被包圍"，"或是被包圍時，自己正在逃跑，卻回答錯誤")
                // 找出自己四周答對時間離當前時間最近的(now - correct_time 最小的)
                var peoples = "";
                peoples = up_down_left_right2(me_index) // 找到所有周遭的人的card_id
                // console.log(peoples)

                $.ajax({ // 抓取周遭的其他使用者答題狀態
                    type: "post",
                    url: 'php/get_correct_time.php', // 新增記錄，並清除死掉的人的zone
                    data: {
                        zone_id: get_cookie("exam2_zone_id"),
                        peoples: peoples,
                        user_id: get_cookie("exam2_user_id"),
                        team: get_cookie("exam2_team"),
                        result: get_cookie("result2")
                    },
                    async: false,
                    dataType: 'text',
                    success: function (data) {
                        // console.log(data)
                        Swal.fire({
                            title: "遊戲結束！",
                            html: '我被 『 ' + data + ' 』擊殺了 ！',
                            icon: 'warning',
                            confirmButtonText: "確定",
                        })
                        get_zone()
                        record()
                    },
                    error: function (e) {
                        Toast.fire({
                            icon: 'error',
                            title: '生命值獲取失敗 ！！',
                        })
                    }
                })



                // alert("You're already dead !")
            } else { // 如果自己沒死，才能殺別人
                other.forEach(function (item) {

                    other_way = up_down_left_right(item) // 從這裡去判斷該使用者剩餘的路剩幾條
                    var other_user_status = false; // F : 未在答題，T : 正在答題

                    $.ajax({ // 抓取周遭的其他使用者答題狀態
                        type: "post",
                        url: 'php/get_user_status.php',
                        data: {
                            index: item,
                        },
                        async: false,
                        dataType: 'text',
                        success: function (data) {
                            // console.log(data)
                            if (data == "1") {
                                console.log("該格子的使用者正在答題，因此無法殺他")
                                other_user_status = true;
                            } else if (data == "0") { // 
                                console.log("該格子的使用者未在答題中，可以殺他")
                                other_user_status = false;
                            }
                        },
                        error: function (e) {
                            Toast.fire({
                                icon: 'error',
                                title: '生命值獲取失敗 ！！',
                            })
                        }
                    })


                    if (other_way <= dead && other_user_status == false) { // 小於1條路、且該使用者未在答題狀態中
                        Swal.fire({
                            html: '『 <i class="fas fa-skull-crossbones"></i> ' + $(".card .item").eq(item).html() + " 』 \t被我擊殺了 ！",
                            icon: 'warning',
                            confirmButtonText: "確定",
                        })


                        $.ajax({ // 抓取周遭的其他使用者答題狀態
                            type: "post",
                            url: 'php/insert_record.php', // 新增記錄，並清除死掉的人的zone
                            data: {
                                user_id: get_cookie("exam2_user_id"),
                                victim_index: item,
                                zone_id: get_cookie("exam2_zone_id"),
                                team: get_cookie("exam2_team")
                            },
                            async: false,
                            dataType: 'text',
                            success: function (data) {
                                // console.log(data)
                                get_zone()
                                record()
                            },
                            error: function (e) {
                                Toast.fire({
                                    icon: 'error',
                                    title: '生命值獲取失敗 ！！',
                                })
                            }
                        })
                    }
                })
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '判斷生死失敗 ！！',
            })
        }
    })



}





function check_ans() {


    check_ans_status = true

    // console.log(user_ans)
    user_ans = user_ans.toLowerCase();
    var level = get_cookie("exam2_ques_level")
    var lower;
    var upper;





    if (level == "1") { // level=1，只比對ans，因為level1的答案無上下界線
        // console.log("level = 1")
        var ans = get_unescape_Cookie("exam2_ans")
        ans = xor(ans)

        if (user_ans == ans) {
            Swal.fire({
                icon: 'success',
                title: '正確答案 ！！',
            })

            delete_cookie("result2")
            document.cookie = "result2=1" + "; path=/;";

            var before_score = parseInt(get_cookie("exam2_user_score")) //先取得原本分數
            // console.log(before_score)
            delete_cookie("exam2_user_score") // 再把原本的刪了
            document.cookie = "exam2_user_score=" + (before_score + 1) + "; path=/;"; //再新增-1後的生命值
            update_score()
        } else {
            Swal.fire({
                icon: 'error',
                title: '錯誤答案 ！！',
            })

            delete_cookie("result2")
            document.cookie = "result2=0" + "; path=/;";
        }
    } else { // 剩餘的level 都有上下界限
        // console.log("level > 1")

        user_ans = parseFloat(user_ans)

        lower = get_unescape_Cookie("exam2_ans_lower")
        upper = get_unescape_Cookie("exam2_ans_upper")

        lower = parseFloat(xor(lower))
        upper = parseFloat(xor(upper))

        // lower = parseFloat(get_cookie("exam2_ans_lower"))
        // upper = parseFloat(get_cookie("exam2_ans_upper"))


        console.log(user_ans)
        console.log(lower)
        console.log(upper)

        if (user_ans >= lower && user_ans <= upper) {
            Swal.fire({
                icon: 'success',
                title: '正確答案 ！！',
            })

            delete_cookie("result2")
            document.cookie = "result2=1" + "; path=/;";

            var before_score = parseInt(get_cookie("exam2_user_score")) //先取得原本分數
            // console.log(before_score)
            delete_cookie("exam2_user_score") // 再把原本的刪了
            document.cookie = "exam2_user_score=" + (before_score + 1) + "; path=/;"; //再新增-1後的生命值
            update_score()
        } else {
            Swal.fire({
                icon: 'error',
                title: '錯誤答案 ！！',
            })

            delete_cookie("result2")
            document.cookie = "result2=0" + "; path=/;";

        }
    }

    clock.stop();

    check_ans_status = false
    $(".question h3 pre").text("")
    $('.btn input').attr('disabled', true);
    $('.card .item').prop('disabled', false);


    // get_zone()


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


}


function record() {
    $.ajax({
        type: "post",
        url: 'php/get_record.php',
        data: {
            zone_id: get_cookie("exam2_zone_id")
        },
        dataType: 'json',
        success: function (data) {
            // console.log(data);
            $("tbody").eq(2).html("") //先清空
            var table_tbody = "";
            $.each(data, function (key, value) {
                var murderer_name = value.murderer_name
                var victim_name = value.victim_name
                var mode = value.mode
                var time = value.time
                // console.log(time)
                time = time.substring(5)
                time = time.replace("-", "月")
                time = time.replace(" ", "日 ")

                // if (murderer_name == get_unescape_Cookie("exam2_user_name")) murderer_name = "我";
                // if (victim_name == get_unescape_Cookie("exam2_user_name")) victim_name = "我";
                if (mode == "0") mode = "";
                if (mode == "1") {
                    mode = "自投羅網";
                    table_tbody +=
                        `<tr>
                    <td style="width: 168px;">${time}</td>
                    <td style="width: 168px;">${victim_name}${mode}</td>
                    </tr>`
                }

                if (mode == "2") {
                    mode = "夾殺";
                    table_tbody +=
                        `<tr>
                    <td style="width: 168px;">${time}</td>
                    <td style="width: 168px;">${murderer_name}將${victim_name}${mode}</td>
                    </tr>`
                }
                if (mode == "3") {
                    mode = "誤殺";
                    table_tbody +=
                        `<tr>
                    <td style="width: 168px;">${time}</td>
                    <td style="width: 168px;">${murderer_name}將${victim_name}${mode}</td>
                    </tr>`
                }




            })

            //新增資料至容器內
            $("tbody").eq(2).append(table_tbody);
            //----------------------------------
        },
        error: function (e) {
            Swal.fire({
                icon: 'error',
                title: '獲取紀錄失敗 ！！',
                timer: 5000,
                timerProgressBar: true,
            })
        }
    })
}


$(document).on('click', '.logout', function (e) {
    var warning = "";
    if (get_cookie("exam2_status") == "1") { //正在答題中
        warning = "登出後就不能再回答此題目囉~"
    }
    Swal.fire({
        title: "確定要登出？",
        icon: 'question',
        html: warning,
        showCancelButton: true,
        confirmButtonText: "確定",
        cancelButtonText: "取消"
    }).then(result => {
        if (result.value) {
            logout()
        }
    })
});

$(document).on('click', '.info', function (e) {
    var name = get_unescape_Cookie("exam2_user_name")
    var zone = get_unescape_Cookie("exam2_zone_name")
    if (window.innerWidth > 768) {
        Swal.fire({
            title: "遊戲說明",
            footer: '<i class="fas fa-user"></i> ' + name + '　　　' + '<i class="fab fa-font-awesome-flag"></i> ' + zone,
            background: "#B5CBFA",
            html: `<div class='item this' style="color: #fff;background: #03a9f4;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;font-size:20px;line-height: 45px;">${name}</div><span style="transform: translateX(43px); position: absolute; top: 80px; left: 152px; font-size: 25px; font-weight: 900;">我目前的位置</span>` + `<div class='item' style="background: #03a9f4;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;"><span style="transform:translateX(50px);position:absolute;">友方</span></div>` + `<div class='item' style="background: #FF5151;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;"><span style="transform:translateX(50px);position:absolute;">敵方</span></div>` + `<div class='item this' style="background: #E680FF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;font-size: 20px;line-height: 45px;"><i class="fas fa-street-view" style="color: #222;"></i></div><span style="transform: translateX(42px); position: absolute; top: 265px; left: 152px; font-size: 25px; font-weight: 900;">我目前所選的</span>` + `<div class='item' style="background: #E680FF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;font-size: 20px;line-height: 45px;"><i class="fas fa-street-view" style="color: #222;"></i><span style="transform:translateX(39px);position:absolute;font-size: 25px;">別人的目前所選的</span></div>` + `<div class='item' style="background: #FFF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;box-shadow: inset 0px -4px 4px 0px #e8e8e8;"><span style="transform:translateX(50px);position:absolute;">可選的格子</span></div>\n` + `<div class='item' style="background: #ccc;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;box-shadow: inset 0px -4px 4px 0px #e8e8e8;"><span style="transform:translateX(50px);position:absolute;">不可選的格子</span></div>\n`,
        })
        $(".swal2-footer").css("align-items", "center")
    } else {
        Swal.fire({
            title: "遊戲說明",
            footer: '<i class="fas fa-user"></i> ' + name + '　　　' + '<i class="fab fa-font-awesome-flag"></i> ' + zone,
            background: "#B5CBFA",
            html: `<div class='item this' style="color: #fff;background: #03a9f4;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 35px;font-size:20px;line-height: 45px;line-height: 50px;">${name}</div><span style="transform: translateX(43px); position: absolute; top: 80px; left: 87px; font-size: 25px; font-weight: 900;">我目前的位置</span>` + `<div class='item' style="background: #03a9f4;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 35px;line-height: 50px;"><span style="transform:translateX(50px);position:absolute;font-size: 25px;">友方</span></div>` + `<div class='item' style="background: #FF5151;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 35px;line-height: 50px;"><span style="transform:translateX(50px);position:absolute;font-size: 25px;">敵方</span></div>` + `<div class='item this' style="background: #E680FF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 35px;line-height: 50px;font-size: 20px;line-height: 45px;"><i class="fas fa-street-view" style="color: #222;"></i></div><span style="transform: translateX(42px); position: absolute; top: 265px; left: 87px; font-size: 25px; font-weight: 900;">我目前所選的</span>` + `<div class='item' style="background: #E680FF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 35px;font-size: 20px;line-height: 45px;"><i class="fas fa-street-view" style="color: #222;"></i><span style="transform:translateX(39px);position:absolute;font-size: 25px;">別人的目前所選的</span></div>` + `<div class='item' style="background: #FFF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 35px;line-height: 50px;box-shadow: inset 0px -4px 4px 0px #e8e8e8;"><span style="transform:translateX(50px);position:absolute;font-size: 25px;">可選的格子</span></div>\n` + `<div class='item' style="background: #ccc;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 35px;line-height: 50px;box-shadow: inset 0px -4px 4px 0px #e8e8e8;"><span style="transform:translateX(50px);position:absolute;font-size: 25px;">不可選的格子</span></div>\n`,
        })
        $(".swal2-footer").css("align-items", "center")
    }


})

function logout() {
    $.ajax({
        type: "post",
        url: 'php/logout.php',
        data: {
            user_id: get_cookie("exam2_user_id")
        },
        async: false,
        dataType: 'text',
        success: function (data) {
            // if (data == "1") {
            update_user_status_reset()
            delete_cookie("exam2_user_id")
            delete_cookie("exam2_user_name")
            delete_cookie("exam2_user_life")
            delete_cookie("exam2_user_score")
            delete_cookie("exam2_zone_id")
            delete_cookie("exam2_zone_name")
            delete_cookie("exam2_current_index")
            delete_cookie("exam2_status")
            delete_cookie("exam2_ques_id")
            delete_cookie("exam2_ques")
            delete_cookie("exam2_ques_level")
            delete_cookie("exam2_ans")
            delete_cookie("exam2_ans_lower")
            delete_cookie("exam2_ans_upper")
            delete_cookie("exam2_login_time")
            delete_cookie("exam2_login_status")
            delete_cookie("result2")
            delete_cookie("exam2_team")
            delete_cookie("exam2_exchange_life_status")
            location.href = "login/"
            // }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '登出失敗 ！！',
            })
        }
    })
}



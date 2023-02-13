// ----------------------
var zone_name;
var i_occupied = [];
var last_time = [];
var time = 0;
var user_ans;
var check_ans_status = false;
var counter = 0;
// ---------------------------------------------------------------------
var clock;
// ---------------------------------------------------------------------
var up, down, left, right;
var left_up, left_down, right_up, right_down;
var num = 10; // 10*10
var current_index;
var this_level;
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
    }, 10000)

    // ----------------------------------------------------------------
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
    var life = parseInt(get_cookie("exam_user_life"))
    var score = parseInt(get_cookie("exam_user_score"))
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



function get_level() {
    $.ajax({
        type: 'POST', //必要 少了type:POST 會無法將data傳給php
        url: 'php/get_level.php',
        data: {
            zone_id: get_cookie("exam_zone_id"),
            index: current_index
        },
        dataType: 'text',
        async: false,
        success: function (data) {
            this_level = data
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '難度資訊獲取失敗 ！！',
            })
        }
    })

}




$(document).on('click', '.card div', function (e) { // 點擊任意圖片時

    current_index = $(".card div").index(this);
    // this_level = $(this).html()
    get_level()

    console.log("當前選到的index: " + current_index)
    console.log("當前選到的level: " + this_level)


    $.ajax({
        type: 'POST', //必要 少了type:POST 會無法將data傳給php
        url: 'php/check_game_time.php',
        data: "data",
        dataType: 'text',
        async: false,
        success: function (data) {
            // console.log(parseInt(data))
            if (parseInt(data) >= 1) {

                var html;

                if ($(this).hasClass("cant_select")) {
                    this_level = $(this).html()
                    html = `<i class="fas fa-balance-scale-left"></i> 難度 : ` + this_level;
                } else {
                    html = "";
                }

                Swal.fire({
                    title: "確定要選擇此題？",
                    icon: 'question',
                    html: html,
                    showCancelButton: true,
                    confirmButtonText: "確定",
                    cancelButtonText: "取消"
                }).then(result => {
                    if (result.value) {
                        // ---------- 增加1.2秒鐘載入動畫 ----------------
                        Swal.fire({
                            title: '~ 載入中 ~',
                            timer: 1200,
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




                        delete_cookie("exam_current_index")
                        delete_cookie("exam_this_level")

                        // // console.log(current_index)
                        // // console.log(owner)
                        // // console.log(this_level)

                        // //將current_index放入cookie ，這樣重新整理時，也可以知道上次點了哪個，以便後續繼續作答同一題
                        document.cookie = "exam_current_index=" + current_index + "; path=/;";
                        document.cookie = "exam_this_level=" + this_level + "; path=/;";

                        // console.log(current_index)
                        reset_status()
                        check_owner()
                        // update_owner()


                        // current_index = get_cookie("exam_current_index")
                        _3x3()

                    } else {
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
    var exchange_life_status = parseInt(get_cookie("exam_exchange_life_status"))
    if (exchange_life_status == 0) { // 如果為0，代表不能夠以分數換生命
        Toast.fire({
            icon: 'warning',
            title: '尚未開放此功能',
            timer: 3000,
            timerProgressBar: true,
        })
    } else {
        if (parseInt(get_cookie("exam_user_life")) >= 4) {
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
                            user_id: get_cookie("exam_user_id"),
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

                                var before_life = parseInt(get_cookie("exam_user_life"))
                                var before_score = parseInt(get_cookie("exam_user_score"))

                                delete_cookie("exam_user_life")
                                delete_cookie("exam_user_score")
                                if (before_life == 3) { // 3+2 會變成5，到下面的cookie會有問題，這邊直接將3變成2，以便下面的cookie，不會大於4
                                    before_life = 2;
                                }
                                // １分換２命
                                document.cookie = "exam_user_life=" + (before_life + 2) + "; path=/;";
                                document.cookie = "exam_user_score=" + (before_score - 1) + "; path=/;";

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
    if (get_unescape_Cookie("exam_ques") != null) {
        $('.btn input').attr('disabled', false);
        $('.card .item').prop('disabled', true);
        if (get_cookie("exam_current_index") != "-1") {
            $(".card div").eq(get_cookie("exam_current_index")).addClass("this") // 印出題目之後再新增選取動畫
            $(".card div").eq(get_cookie("exam_current_index")).html('<i class="fas fa-street-view" style="color: #222;" aria-hidden="true"></i>')

        }
    }

    $(".question h3 pre").text(get_unescape_Cookie("exam_ques"))

    if (document.body.scrollWidth >= 768) {
        $(".question h3 pre").niceScroll({
            cursorwidth: 10,         //滾動條寬度
            autohidemode: true,      //滚動條是否是自動隐藏，默認值为 true
            railoffset: true,
            railoffset: { left: 5 }, //可以使用top/left来修正位置
            touchbehavior: true, // 激活拖拽滚动
        });
    }
}

function get_ques() {

    $.ajax({
        type: 'POST', //必要 少了type:POST 會無法將data傳給php
        url: 'php/get_ques.php',
        data: {
            zone_id: get_cookie("exam_zone_id"),
            level: get_cookie("exam_this_level")
        },
        dataType: 'json',
        async: false,
        success: function (data) {
            var ques_id = data[0].ques_id
            var ques = data[0].ques_content
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

            // //將current_index放入cookie ，這樣重新整理時，也可以知道上次點了哪個，以便後續繼續作答同一題
            document.cookie = "exam_ques_id=" + ques_id + "; path=/;";
            document.cookie = "exam_ques=" + escape(ques) + "; path=/;";
            document.cookie = "exam_ans=" + escape(encrypted_ans) + "; path=/;";
            document.cookie = "exam_ans_lower=" + escape(encrypted_lower) + "; path=/;";
            document.cookie = "exam_ans_upper=" + escape(encrypted_upper) + "; path=/;";

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
            zone_id: get_cookie("exam_zone_id")
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
                var level = value.card_level;
                var first = value.first_location;
                var use = value.use_status;
                // console.log(use)
                if (use == "0" && owner == "0") { // 沒有人的、狀態也為"沒被使用""
                    contain +=
                        `<div class='item cant_select level_${level}'>${level}</div>`
                } else if (first == "1" && owner == get_cookie("exam_user_id")) { // 是起始位置且是自己的
                    contain +=
                        `<div class='item' style="background: #FF5151;box-shadow: none;"><i class="fas fa-crown" style="color:#F9F900"></i></div>`
                    i_occupied.push(key)
                }
                else if (first == "1" && owner != "0") { // 是起始位置且有被佔領(別人的起始位置)
                    contain +=
                        `<div class='item' style="background: #a1df5a;box-shadow: none;"><i class="fas fa-chess-rook" style="color: #222;"></i></div>`
                } else if (use == "1" && owner == get_cookie("exam_user_id")) { // 為被使用狀態、是自己的
                    contain +=
                        `<div class='item' style="background: #E680FF;box-shadow: none;"><i class="fas fa-street-view" style="color: #222;"></i></div>`
                    i_occupied.push(key)
                } else if (use == "1") { // 為被使用狀態、且不是自己的
                    contain +=
                        `<div class='item' style="background: #E680FF;box-shadow: none;"><i class="fas fa-street-view" style="color: #222;"></i></div>`
                } else if (first == "0" && owner == get_cookie("exam_user_id")) { // 不是起始位置且是自己的
                    contain +=
                        `<div class='item' style="background: #FF5151;box-shadow: none;"><i class="fas fa-chess-pawn" style="color:#F9F900"></i></div>`
                    i_occupied.push(key)
                }
                else { // 如果當前有人選中
                    contain +=
                        `<div class='item cant_select level_${level}'>${level}</div>`
                }
            })

            $(".card").append(contain)

            $(".card .cant_select,.card .other").css({
                "background-color": "#ccc",
                "box-shadow": "none"
            })

            // $(".card div").eq(get_cookie("exam_current_index")).addClass("this") // 上面印出內容後再新增選取動畫

            // -----------------------------------------------全部都上色完後，再來改變當前使用者能夠選的格子的顏色。
            // console.log(i_occupied)
            _3x3() //將每個被佔領的(i_occupied)周圍，做調整

            // -------------------------------------------------
            $(".user h2").eq(0).html(`<i class="fas fa-user" aria-hidden="true"></i> 
            ` + get_cookie("exam_user_name"))
            $(".user h2").eq(1).html(`<i class="fab fa-font-awesome-flag" aria-hidden="true"></i> ` + get_unescape_Cookie("exam_zone_name"))
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
            ques_id: get_cookie("exam_ques_id"),
            zone_id: get_cookie("exam_zone_id"),
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

    if (get_cookie("exam_status") == "1") { //如果在作答中，才去抓取時間
        $.ajax({
            type: "post",
            url: 'php/get_deadline.php',
            data: {
                index: get_cookie("exam_current_index"),
                zone_id: get_cookie("exam_zone_id"),
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
                    // if (get_cookie("exam_status") == 0) {
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
            user_id: get_cookie("exam_user_id"),
            ques_id: get_cookie("exam_ques_id")
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

    update_level()
    update_owner_after_answer()
    update_user_status_reset()
    reset_status()
    get_zone()


    delete_cookie("exam_ques_id")
    delete_cookie("exam_ques")
    delete_cookie("exam_ans")
    delete_cookie("exam_ans_lower")
    delete_cookie("exam_ans_upper")
    delete_cookie("exam_this_level")


    delete_cookie("result")
    document.cookie = "result=0" + "; path=/;";
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
            user_id: get_cookie("exam_user_id"),
            current_index: get_cookie("exam_current_index"),
            status: get_cookie("exam_status"),
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
            user_id: get_cookie("exam_user_id"),
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

                delete_cookie("exam_current_index")
                delete_cookie("exam_status")

                document.cookie = "exam_current_index=-1" + "; path=/;";
                document.cookie = "exam_status=0" + "; path=/;";

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
        url: 'php/update_owner.php',
        data: {
            user_id: 0, // 將該格子重置
            zone_id: get_cookie("exam_zone_id"),
            index: get_cookie("exam_current_index"),
            use_status: 0
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
            user_id: get_cookie("exam_user_id"),
            zone_id: get_cookie("exam_zone_id"),
            index: get_cookie("exam_current_index"),
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
    //index -1,+1,-9,+9,-10,+10,-11,+11,
    $.ajax({
        type: "post",
        url: 'php/check_owner.php',
        data: {
            user_id: get_cookie("exam_user_id"),
            zone_id: get_cookie("exam_zone_id"),
            index: get_cookie("exam_current_index")
        },
        async: false, // ★這邊如果沒有用false (須等待這個ajax執行完)，則會直接執行update_owner，會導致先更新use_status狀態之後，才去check_owner，會有問題。
        dataType: 'text',
        success: function (data) {
            // console.log(data)
            if (data == "ok") {  // 代表沒有人的

                //----------------------------------------------------------------------------------
                var index = get_cookie("exam_current_index")
                if ($(".card div").eq(index).hasClass("cant_select")) { //這是判斷選中的，是不是不具有cant_select class，如果有(true)則代表不是選到王冠(crown)或已佔領的位置
                    // console.log("可以選") // 搜尋題目、印出題目

                    //確定可以選之後，將生命值-1後，更新html (update_score_life_html())，若update_life.php回傳ok，則代表生命值還大於0(可以回答)，若回傳x，則表示已無生命。
                    $.ajax({
                        type: "post",
                        url: 'php/update_life.php',
                        data: {
                            user_id: get_cookie("exam_user_id"),
                        },
                        async: false,
                        dataType: 'text',
                        success: function (data) {
                            // console.log(data)
                            if (data == "ok") { // 生命值還大於0

                                update_owner()


                                // console.log("可以回答題目 ！！")
                                delete_cookie("exam_status")
                                document.cookie = "exam_status=1" + "; path=/;";

                                var before_life = parseInt(get_cookie("exam_user_life")) //先取得原本生命值
                                // console.log(before_life)
                                delete_cookie("exam_user_life") // 再把原本的刪了
                                document.cookie = "exam_user_life=" + (before_life - 1) + "; path=/;"; //再新增-1後的生命值
                                update_score_life_html()


                                get_ques()
                                get_zone()
                                print_ques()
                                update_deadline()
                                update_user_status()

                                $(".card div").eq(index).addClass("this") // 印出題目之後再新增選取動畫
                                selected_num() // 被選中之後，將該題目總次數+1
                            } else if (data == "x") { // 生命值已歸零
                                Toast.fire({
                                    icon: 'error',
                                    title: '您已經無生命值了 ！！',
                                    timer: 3000,
                                    timerProgressBar: true,
                                })
                                delete_cookie("exam_this_level")

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
                    delete_cookie("exam_this_level")

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

                delete_cookie("exam_this_level")

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
            ques_id: get_cookie("exam_ques_id"),
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

        (left == false || up == false) ? left_up = false : left_up = true;
        (left == false || down == false) ? left_down = false : left_down = true;
        (right == false || up == false) ? right_up = false : right_up = true;
        (right == false || down == false) ? right_down = false : right_down = true;

        // console.log("上:" + up + ",下:" + down + ",左:" + left + ",右:" + right + "\n左上:" + left_up + ",左下:" + left_down + ",右上:" + right_up + ",右下:" + right_down)

        //-------------------------------------- 檢查九宮格
        if (up) {
            if ($(".card .item").eq(index - num).hasClass("cant_select")) {
                $(".card .item").eq(index - num).css("background-color", "#fafafa")
            }
        }
        if (down) {
            if ($(".card .item").eq(index + num).hasClass("cant_select")) {
                $(".card .item").eq(index + num).css("background-color", "#fafafa")
            }
        }
        if (left) {
            if ($(".card .item").eq(index - 1).hasClass("cant_select")) {
                $(".card .item").eq(index - 1).css("background-color", "#fafafa")
            }
        }
        if (right) {
            if ($(".card .item").eq(index + 1).hasClass("cant_select")) {
                $(".card .item").eq(index + 1).css("background-color", "#fafafa")
            }
        }
        if (left_up) {
            if ($(".card .item").eq(index - 11).hasClass("cant_select")) {
                $(".card .item").eq(index - 11).css("background-color", "#fafafa")
            }
        }
        if (left_down) {
            if ($(".card .item").eq(index + 9).hasClass("cant_select")) {
                $(".card .item").eq(index + 9).css("background-color", "#fafafa")
            }
        }
        if (right_up) {
            if ($(".card .item").eq(index - 9).hasClass("cant_select")) {
                $(".card .item").eq(index - 9).css("background-color", "#fafafa")
            }
        }
        if (right_down) {
            if ($(".card .item").eq(index + 11).hasClass("cant_select")) {
                $(".card .item").eq(index + 11).css("background-color", "#fafafa")
            }
        }
    });
    //-------------------------------------- 檢查九宮格

    // console.log("3*3")



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
                    check_ans();
                } else {
                    // console.log(result2.dismiss)
                }
            })
        } else {
            // console.log(result.dismiss)
        }
    })
}


function check_ans() {


    check_ans_status = true

    // console.log(user_ans)
    user_ans = user_ans.toLowerCase();

    var level = get_cookie("exam_this_level")
    var lower;
    var upper;
    // console.log(level)

    if (level == "1") { // level=1，只比對ans，因為level1的答案無上下界線
        // console.log("level = 1")
        var ans = get_unescape_Cookie("exam_ans")
        ans = xor(ans)

        if (user_ans == ans) {
            Swal.fire({
                icon: 'success',
                title: '正確答案 ！！',
            })

            delete_cookie("result")
            document.cookie = "result=1" + "; path=/;";

            var before_score = parseInt(get_cookie("exam_user_score")) //先取得原本分數
            // console.log(before_score)
            delete_cookie("exam_user_score") // 再把原本的刪了
            document.cookie = "exam_user_score=" + (before_score + 1) + "; path=/;"; //再新增-1後的生命值
            update_score()
        } else {
            Swal.fire({
                icon: 'error',
                title: '錯誤答案 ！！',
            })

            delete_cookie("result")
            document.cookie = "result=0" + "; path=/;";
        }
    } else { // 剩餘的level 都有上下界限
        // console.log("level > 1")

        user_ans = parseFloat(user_ans)

        lower = get_unescape_Cookie("exam_ans_lower")
        upper = get_unescape_Cookie("exam_ans_upper")

        lower = parseFloat(xor(lower))
        upper = parseFloat(xor(upper))

        // lower = parseFloat(get_cookie("exam_ans_lower"))
        // upper = parseFloat(get_cookie("exam_ans_upper"))


        console.log(user_ans)
        console.log(lower)
        console.log(upper)

        if (user_ans >= lower && user_ans <= upper) {
            Swal.fire({
                icon: 'success',
                title: '正確答案 ！！',
            })

            delete_cookie("result")
            document.cookie = "result=1" + "; path=/;";

            var before_score = parseInt(get_cookie("exam_user_score")) //先取得原本分數
            // console.log(before_score)
            delete_cookie("exam_user_score") // 再把原本的刪了
            document.cookie = "exam_user_score=" + (before_score + 1) + "; path=/;"; //再新增-1後的生命值
            update_score()
        } else {
            Swal.fire({
                icon: 'error',
                title: '錯誤答案 ！！',
            })

            delete_cookie("result")
            document.cookie = "result=0" + "; path=/;";

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

function update_level() {
    $.ajax({
        type: "post",
        url: 'php/update_level.php',
        data: {
            user_id: get_cookie("exam_user_id"),
            level: get_cookie("exam_this_level"), // 獲取當前level ，至PHP 藉由result判斷正確之後，給予level +1 或保持原樣
            zone_id: get_cookie("exam_zone_id"),
            card_id: get_cookie("exam_current_index"),
            result: get_cookie("result"),//1正確，0錯誤
        },
        async: false,
        dataType: 'text',
        success: function (data) {
            // console.log(data)
            if (data == "1") {
                // Toast.fire({
                //     icon: 'success',
                //     title: '更新使用者資訊成功 ！！',
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


$(document).on('click', '.logout', function (e) {
    var warning = "";
    if (get_cookie("exam_status") == "1") { //正在答題中
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
    var name = get_unescape_Cookie("exam_user_name")
    var zone = get_unescape_Cookie("exam_zone_name")

    if (window.innerWidth > 768) {
        Swal.fire({
            title: "遊戲說明",
            footer: '<i class="fas fa-user"></i> ' + name + '　　　' + '<i class="fab fa-font-awesome-flag"></i> ' + zone,
            background: "#B5CBFA",
            html: `<div class='item' style="background: #FF5151;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:30px 10px 10px 100px;"><i class="fas fa-crown" style="color:#F9F900"></i><span style="transform:translateX(40px);position:absolute;">我的起始點</span></div>\n` + `<div class='item' style="background: #FF5151;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;"><i class="fas fa-chess-pawn" style="color:#F9F900"></i><span style="transform:translateX(47px);position:absolute;">我已佔領的</span></div>\n` + `<div class='item' style="background: #a1df5a;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;"><i class="fas fa-chess-rook" style="color: #222;"></i><span style="transform:translateX(45px);position:absolute;">別人的起始點</span></div>` + `<div class='item this' style="background: #E680FF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;"><i class="fas fa-street-view" style="color: #222;"></i></div><span style="transform: translateX(45px); position: absolute; top: 300px; left: 152px; font-size: 25px; font-weight: 900;">我目前所選的</span>` + `<div class='item' style="background: #E680FF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;"><i class="fas fa-street-view" style="color: #222;"></i><span style="transform:translateX(40px);position:absolute;">別人的目前所選的</span></div>` + `<div class='item' style="background: #FFF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;box-shadow: inset 0px -4px 4px 0px #e8e8e8;"><i style="color:#000" class="fas fa-balance-scale-left" style="color:#F9F900"></i><span style="transform:translateX(40px);position:absolute;left: 155px;">可選的格子</span></div>\n` + `<div class='item' style="background: #ccc;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;box-shadow: inset 0px -4px 4px 0px #e8e8e8;"><i style="color:#000" class="fas fa-balance-scale-left" style="color:#F9F900"></i><span style="transform:translateX(40px);position:absolute;left: 155px;">不可選的格子</span></div>\n`,
        })
        $(".swal2-footer").css("align-items", "center")
    } else {
        Swal.fire({
            title: "遊戲說明",
            background: "#B5CBFA",
            footer: '<i class="fas fa-user"></i> ' + name + '　　　' + '<i class="fab fa-font-awesome-flag"></i> ' + zone,
            html: `<div class='item' style="line-height:50px;background: #FF5151;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:30px 10px 10px 50px;"><i class="fas fa-crown" style="color:#F9F900"></i><span style="transform:translateX(40px);position:absolute;">我的起始點</span></div>\n` + `<div class='item' style="line-height:50px;background: #FF5151;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 50px;"><i class="fas fa-chess-pawn" style="color:#F9F900"></i><span style="transform:translateX(46px);position:absolute;">我已佔領的</span></div>\n` + `<div class='item' style="line-height:50px;background: #a1df5a;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 50px;"><i class="fas fa-chess-rook" style="color: #222;"></i><span style="transform:translateX(44px);position:absolute;">別人的起始點</span></div>` + `<div class='item this' style="line-height:50px;background: #E680FF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 50px;"><i class="fas fa-street-view" style="color: #222;"></i></div><span style="transform: translateX(45px); position: absolute; top: 300px; left: 100px; font-size: 18px; font-weight: 900;">我目前所選的</span>` + `<div class='item' style="line-height:50px;background: #E680FF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 50px;"><i class="fas fa-street-view" style="color: #222;"></i><span style="transform:translateX(40px);position:absolute;">別人的目前所選的</span></div>` + `<div class='item' style="line-height:50px;background: #FFF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 50px;"><i style="color:#000" class="fas fa-balance-scale-left" style="color:#F9F900"></i><span style="transform:translateX(37px);position:absolute;">可選的格子</span></div>\n` + `<div class='item' style="line-height:50px;background: #ccc;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 50px;"><i style="color:#000" class="fas fa-balance-scale-left" style="color:#F9F900"></i><span style="transform:translateX(37px);position:absolute;">不可選的格子</span></div>\n`,
        })
        $(".swal2-footer").css("align-items", "center")
    }


})

function logout() {
    $.ajax({
        type: "post",
        url: 'php/logout.php',
        data: {
            user_id: get_cookie("exam_user_id")
        },
        async: false,
        dataType: 'text',
        success: function (data) {
            // if (data == "1") {
            update_user_status_reset()
            delete_cookie("exam_user_id")
            delete_cookie("exam_user_name")
            delete_cookie("exam_user_life")
            delete_cookie("exam_user_score")
            delete_cookie("exam_zone_id")
            delete_cookie("exam_zone_name")
            delete_cookie("exam_current_index")
            delete_cookie("exam_this_level")
            delete_cookie("exam_status")
            delete_cookie("exam_ques_id")
            delete_cookie("exam_ques")
            delete_cookie("exam_ans")
            delete_cookie("exam_ans_lower")
            delete_cookie("exam_ans_upper")
            delete_cookie("exam_login_time")
            delete_cookie("exam_login_status")
            delete_cookie("result")
            delete_cookie("exam_exchange_life_status")
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



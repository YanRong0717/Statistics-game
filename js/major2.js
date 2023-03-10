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
        setTimeout(function () { //????????????????????????
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
    $(".star").html("") // ?????????
    var life = parseInt(get_cookie("exam_user_life"))
    var score = parseInt(get_cookie("exam_user_score"))
    if (life >= 4) life = 4;
    // console.log(life)
    // console.log(score)
    if (life == 0) {
        $(".star").html('<p>??????????????????</p><i class="far fa-heart"></i><i class="far fa-heart"></i><i class="far fa-heart"></i><i class="far fa-heart"></i>')
    }
    else if (life == 1) {
        $(".star").html('<p>??????????????????</p><i class="fas fa-heart"></i><i class="far fa-heart"></i><i class="far fa-heart"></i><i class="far fa-heart"></i>')
    } else if (life == 2) {
        $(".star").html('<p>??????????????????</p><i class="fas fa-heart"></i><i class="fas fa-heart"></i></i><i class="far fa-heart"></i><i class="far fa-heart"></i>')
    } else if (life == 3) {
        $(".star").html('<p>??????????????????</p><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="far fa-heart"></i>')
    }
    else if (life == 4) {
        $(".star").html('<p>??????????????????</p><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i><i class="fas fa-heart"></i>')
    }

    $(".score .txt").html("") // ?????????
    $(".score .txt").html('<i class="fas fa-medal" aria-hidden="true"></i> Score : ' + score)
}



function get_level() {
    $.ajax({
        type: 'POST', //?????? ??????type:POST ????????????data??????php
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
                title: '???????????????????????? ??????',
            })
        }
    })

}




$(document).on('click', '.card div', function (e) { // ?????????????????????

    current_index = $(".card div").index(this);
    // this_level = $(this).html()
    get_level()

    console.log("???????????????index: " + current_index)
    console.log("???????????????level: " + this_level)


    $.ajax({
        type: 'POST', //?????? ??????type:POST ????????????data??????php
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
                    html = `<i class="fas fa-balance-scale-left"></i> ?????? : ` + this_level;
                } else {
                    html = "";
                }

                Swal.fire({
                    title: "????????????????????????",
                    icon: 'question',
                    html: html,
                    showCancelButton: true,
                    confirmButtonText: "??????",
                    cancelButtonText: "??????"
                }).then(result => {
                    if (result.value) {
                        // ---------- ??????1.2?????????????????? ----------------
                        Swal.fire({
                            title: '~ ????????? ~',
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
                        // ---------- ??????1.2??????????????? ----------------

                        // ??????zone table????????????zone_id???index??????????????????????????????????????????????????????cookie???????????????????????????????????????status???current_index?????????-1???????????????????????????(get_zone)??????????????????????????????status=1???current_index=??????????????????????????????????????????????????????(get_zone)???????????????????????????btn?????????




                        delete_cookie("exam_current_index")
                        delete_cookie("exam_this_level")

                        // // console.log(current_index)
                        // // console.log(owner)
                        // // console.log(this_level)

                        // //???current_index??????cookie ????????????????????????????????????????????????????????????????????????????????????????????????
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
                    title: '????????????????????? ??????',
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
                title: '?????????????????????????????? ??????',
            })
        }
    })



})






$(document).on('click', '.star', function (e) { //?????????????????????
    var exchange_life_status = parseInt(get_cookie("exam_exchange_life_status"))
    if (exchange_life_status == 0) { // ?????????0????????????????????????????????????
        Toast.fire({
            icon: 'warning',
            title: '?????????????????????',
            timer: 3000,
            timerProgressBar: true,
        })
    } else {
        if (parseInt(get_cookie("exam_user_life")) >= 4) {
            Toast.fire({
                icon: 'success',
                title: '?????????????????????',
                timer: 1000,
                timerProgressBar: true,
            })
        } else {
            Swal.fire({
                html: "??????????????????????????????????????????",
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: "??????",
                cancelButtonText: "??????"
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
                                // console.log("deal ok??????")
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                });

                                Toast.fire({
                                    icon: 'success',
                                    title: '????????????????????????',
                                    timer: 1000,
                                    timerProgressBar: true,
                                })

                                var before_life = parseInt(get_cookie("exam_user_life"))
                                var before_score = parseInt(get_cookie("exam_user_score"))

                                delete_cookie("exam_user_life")
                                delete_cookie("exam_user_score")
                                if (before_life == 3) { // 3+2 ?????????5???????????????cookie??????????????????????????????3??????2??????????????????cookie???????????????4
                                    before_life = 2;
                                }
                                // ???????????????
                                document.cookie = "exam_user_life=" + (before_life + 2) + "; path=/;";
                                document.cookie = "exam_user_score=" + (before_score - 1) + "; path=/;";

                                update_score_life_html()

                            } else {
                                // console.log("deal failed??????")
                                Toast.fire({
                                    icon: 'error',
                                    title: '?????????????????????????????? ??????',
                                })
                            }
                        },
                        error: function (e) {
                            Toast.fire({
                                icon: 'error',
                                title: '????????????????????? ??????',
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
            $(".card div").eq(get_cookie("exam_current_index")).addClass("this") // ???????????????????????????????????????
            $(".card div").eq(get_cookie("exam_current_index")).html('<i class="fas fa-street-view" style="color: #222;" aria-hidden="true"></i>')

        }
    }

    $(".question h3 pre").text(get_unescape_Cookie("exam_ques"))

    if (document.body.scrollWidth >= 768) {
        $(".question h3 pre").niceScroll({
            cursorwidth: 10,         //???????????????
            autohidemode: true,      //????????????????????????????????????????????? true
            railoffset: true,
            railoffset: { left: 5 }, //????????????top/left???????????????
            touchbehavior: true, // ??????????????????
        });
    }
}

function get_ques() {

    $.ajax({
        type: 'POST', //?????? ??????type:POST ????????????data??????php
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

            // //???current_index??????cookie ????????????????????????????????????????????????????????????????????????????????????????????????
            document.cookie = "exam_ques_id=" + ques_id + "; path=/;";
            document.cookie = "exam_ques=" + escape(ques) + "; path=/;";
            document.cookie = "exam_ans=" + escape(encrypted_ans) + "; path=/;";
            document.cookie = "exam_ans_lower=" + escape(encrypted_lower) + "; path=/;";
            document.cookie = "exam_ans_upper=" + escape(encrypted_upper) + "; path=/;";

        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '???????????????????????? ??????',
            })
        }
    })

}

function get_zone() {
    $.ajax({
        type: 'POST', //?????? ??????type:POST ????????????data??????php
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
            i_occupied = [] // ???????????????
            $.each(data, function (key, value) {
                var owner = value.card_owner;
                var level = value.card_level;
                var first = value.first_location;
                var use = value.use_status;
                // console.log(use)
                if (use == "0" && owner == "0") { // ???????????????????????????"????????????""
                    contain +=
                        `<div class='item cant_select level_${level}'>${level}</div>`
                } else if (first == "1" && owner == get_cookie("exam_user_id")) { // ??????????????????????????????
                    contain +=
                        `<div class='item' style="background: #FF5151;box-shadow: none;"><i class="fas fa-crown" style="color:#F9F900"></i></div>`
                    i_occupied.push(key)
                }
                else if (first == "1" && owner != "0") { // ??????????????????????????????(?????????????????????)
                    contain +=
                        `<div class='item' style="background: #a1df5a;box-shadow: none;"><i class="fas fa-chess-rook" style="color: #222;"></i></div>`
                } else if (use == "1" && owner == get_cookie("exam_user_id")) { // ?????????????????????????????????
                    contain +=
                        `<div class='item' style="background: #E680FF;box-shadow: none;"><i class="fas fa-street-view" style="color: #222;"></i></div>`
                    i_occupied.push(key)
                } else if (use == "1") { // ???????????????????????????????????????
                    contain +=
                        `<div class='item' style="background: #E680FF;box-shadow: none;"><i class="fas fa-street-view" style="color: #222;"></i></div>`
                } else if (first == "0" && owner == get_cookie("exam_user_id")) { // ?????????????????????????????????
                    contain +=
                        `<div class='item' style="background: #FF5151;box-shadow: none;"><i class="fas fa-chess-pawn" style="color:#F9F900"></i></div>`
                    i_occupied.push(key)
                }
                else { // ????????????????????????
                    contain +=
                        `<div class='item cant_select level_${level}'>${level}</div>`
                }
            })

            $(".card").append(contain)

            $(".card .cant_select,.card .other").css({
                "background-color": "#ccc",
                "box-shadow": "none"
            })

            // $(".card div").eq(get_cookie("exam_current_index")).addClass("this") // ??????????????????????????????????????????

            // -----------------------------------------------?????????????????????????????????????????????????????????????????????????????????
            // console.log(i_occupied)
            _3x3() //?????????????????????(i_occupied)??????????????????

            // -------------------------------------------------
            $(".user h2").eq(0).html(`<i class="fas fa-user" aria-hidden="true"></i> 
            ` + get_cookie("exam_user_name"))
            $(".user h2").eq(1).html(`<i class="fab fa-font-awesome-flag" aria-hidden="true"></i> ` + get_unescape_Cookie("exam_zone_name"))
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '???????????????????????? ??????',
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
                // console.log("update deadline ok??????")
                timer()
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '?????????????????????????????? ??????',
            })
        }
    })
}



function timer() {

    if (get_cookie("exam_status") == "1") { //???????????????????????????????????????
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
                // console.log(data) // ??????????????????
                var format = data.replace(/-/g, '/')   //https://www.jianshu.com/p/cfbd97d31c39
                var deadline = Date.parse(new Date(format));
                // console.log(deadline) // ??????????????????

                var dateTime = Date.now(); // ????????????
                var timestamp = Math.floor(dateTime);

                // console.log(timestamp) // ????????????

                time = (deadline - timestamp) / 1000;// ??????????????????????????????(??????)
                console.log("time:" + time)

                if (time >= 1) { // ?????????????????????????????????????????????


                    clock.stop(); // ????????????????????????stop????????????????????????????????????????????????????????????????????????

                    clock = $('.clock').FlipClock(time, {
                        clockFace: 'MinuteCounter',
                        countdown: true,
                        autoStart: true, //????????????????????????
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

                    if (check_ans_status == false) { // ?????????????????????
                        Swal.fire({
                            icon: 'warning',
                            title: '????????? ??????',
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
                    //     //     title: '????????? ??????',
                    //     // })
                    // }
                }



            },
            error: function (e) {
                Toast.fire({
                    icon: 'error',
                    title: '?????????????????????????????? ??????',
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
                console.log("update user score ok??????")
                update_score_life_html()
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '??????????????????????????? ??????',
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
                // console.log("update zone's user status ok??????")
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '??????zone????????????????????? ??????',
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
                // console.log("update user status ok??????")

                // Toast.fire({
                //     icon: 'success',
                //     title: 'update user status ??????',
                //     timer: 3000,
                //     timerProgressBar: true,
                // })
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '??????????????????????????? ??????',
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
                // console.log("update user status reset ??????")
                // Toast.fire({
                //     icon: 'success',
                //     title: 'update user status reset ??????',
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
                title: '??????????????????????????? ??????',
            })
        }
    })
}

function update_owner_after_answer() { // ??????????????????zone???card_owner
    //????????????????????????index??????????????????????????????????????????(owner)?????????index???owner=-1(???????????????)
    //index -1,+1,-9,+9,-10,+10,-11,+11,
    $.ajax({
        type: "post",
        url: 'php/update_owner.php',
        data: {
            user_id: 0, // ??????????????????
            zone_id: get_cookie("exam_zone_id"),
            index: get_cookie("exam_current_index"),
            use_status: 0
        },
        async: false,
        dataType: 'text',
        success: function (data) {
            // console.log(data)
            if (data == "1") {
                // console.log("update owner after answer ??????")
                // Toast.fire({
                //     icon: 'success',
                //     title: 'update owner after answer ??????',
                //     timer: 3000,
                //     timerProgressBar: true,
                // })
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '???????????????????????? ??????',
            })
        }
    })
}




function update_owner() {
    //????????????????????????index??????????????????????????????????????????(owner)?????????index???owner=-1(???????????????)
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
                // console.log("update owner ok ??????")
                // Toast.fire({
                //     icon: 'success',
                //     title: 'update owner ok ??????',
                //     timer: 3000,
                //     timerProgressBar: true,
                // })
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '???????????????????????? ??????',
            })
        }
    })
}


function check_owner() {
    //????????????????????????index??????????????????????????????????????????(owner)?????????index???owner=-1(???????????????)
    //index -1,+1,-9,+9,-10,+10,-11,+11,
    $.ajax({
        type: "post",
        url: 'php/check_owner.php',
        data: {
            user_id: get_cookie("exam_user_id"),
            zone_id: get_cookie("exam_zone_id"),
            index: get_cookie("exam_current_index")
        },
        async: false, // ????????????????????????false (???????????????ajax?????????)?????????????????????update_owner?????????????????????use_status?????????????????????check_owner??????????????????
        dataType: 'text',
        success: function (data) {
            // console.log(data)
            if (data == "ok") {  // ??????????????????

                //----------------------------------------------------------------------------------
                var index = get_cookie("exam_current_index")
                if ($(".card div").eq(index).hasClass("cant_select")) { //??????????????????????????????????????????cant_select class????????????(true)???????????????????????????(crown)?????????????????????
                    // console.log("?????????") // ???????????????????????????

                    //????????????????????????????????????-1????????????html (update_score_life_html())??????update_life.php??????ok??????????????????????????????0(????????????)????????????x???????????????????????????
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
                            if (data == "ok") { // ??????????????????0

                                update_owner()


                                // console.log("?????????????????? ??????")
                                delete_cookie("exam_status")
                                document.cookie = "exam_status=1" + "; path=/;";

                                var before_life = parseInt(get_cookie("exam_user_life")) //????????????????????????
                                // console.log(before_life)
                                delete_cookie("exam_user_life") // ?????????????????????
                                document.cookie = "exam_user_life=" + (before_life - 1) + "; path=/;"; //?????????-1???????????????
                                update_score_life_html()


                                get_ques()
                                get_zone()
                                print_ques()
                                update_deadline()
                                update_user_status()

                                $(".card div").eq(index).addClass("this") // ???????????????????????????????????????
                                selected_num() // ???????????????????????????????????????+1
                            } else if (data == "x") { // ??????????????????
                                Toast.fire({
                                    icon: 'error',
                                    title: '???????????????????????? ??????',
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
                                title: '????????????????????? ??????',
                            })
                        }
                    })


                } else {
                    Toast.fire({
                        icon: 'error',
                        title: '?????????????????? ??????',
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
                console.log(data) // ?????????????????????????????????????????????
                Toast.fire({
                    icon: 'error',
                    padding: '1.5em',
                    width: 360,
                    title: '????????????????????????????????? ???\n????????????????????????????????????',
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
                title: '???????????????????????? ??????',
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
                //     title: '???????????? ??????',
                // })
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '????????????????????? ??????',
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

        // console.log("???:" + up + ",???:" + down + ",???:" + left + ",???:" + right + "\n??????:" + left_up + ",??????:" + left_down + ",??????:" + right_up + ",??????:" + right_down)

        //-------------------------------------- ???????????????
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
    //-------------------------------------- ???????????????

    // console.log("3*3")



}








$(document).on('click', '.btn input', function (e) { //?????????????????????
    input_ans();
})


function input_ans() { //????????????
    Swal.fire({ //???????????????
        title: "???????????????",
        input: 'text',
        icon: 'warning',
        showCancelButton: true,
        inputAutoTrim: true, // ??????????????????????????????
        confirmButtonText: "??????",
        cancelButtonText: "??????"
    }).then(result => {
        if (result.value) {
            console.log(result.value) // ?????????????????????
            user_ans = result.value // ??????????????????????????????
            Swal.fire({
                title: "???????????????",
                html: result.value, // ??????????????????
                icon: 'warning',
                showCancelButton: true,
                inputAutoTrim: true,
                confirmButtonText: "??????",
                cancelButtonText: "??????"
            }).then(result2 => {
                if (result2.value) {
                    // console.log("??????")
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

    if (level == "1") { // level=1????????????ans?????????level1????????????????????????
        // console.log("level = 1")
        var ans = get_unescape_Cookie("exam_ans")
        ans = xor(ans)

        if (user_ans == ans) {
            Swal.fire({
                icon: 'success',
                title: '???????????? ??????',
            })

            delete_cookie("result")
            document.cookie = "result=1" + "; path=/;";

            var before_score = parseInt(get_cookie("exam_user_score")) //?????????????????????
            // console.log(before_score)
            delete_cookie("exam_user_score") // ?????????????????????
            document.cookie = "exam_user_score=" + (before_score + 1) + "; path=/;"; //?????????-1???????????????
            update_score()
        } else {
            Swal.fire({
                icon: 'error',
                title: '???????????? ??????',
            })

            delete_cookie("result")
            document.cookie = "result=0" + "; path=/;";
        }
    } else { // ?????????level ??????????????????
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
                title: '???????????? ??????',
            })

            delete_cookie("result")
            document.cookie = "result=1" + "; path=/;";

            var before_score = parseInt(get_cookie("exam_user_score")) //?????????????????????
            // console.log(before_score)
            delete_cookie("exam_user_score") // ?????????????????????
            document.cookie = "exam_user_score=" + (before_score + 1) + "; path=/;"; //?????????-1???????????????
            update_score()
        } else {
            Swal.fire({
                icon: 'error',
                title: '???????????? ??????',
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
            level: get_cookie("exam_this_level"), // ????????????level ??????PHP ??????result???????????????????????????level +1 ???????????????
            zone_id: get_cookie("exam_zone_id"),
            card_id: get_cookie("exam_current_index"),
            result: get_cookie("result"),//1?????????0??????
        },
        async: false,
        dataType: 'text',
        success: function (data) {
            // console.log(data)
            if (data == "1") {
                // Toast.fire({
                //     icon: 'success',
                //     title: '??????????????????????????? ??????',
                //     timer: 3000,
                //     timerProgressBar: true,
                // })
            }
        },
        error: function (e) {
            Toast.fire({
                icon: 'error',
                title: '??????????????????????????? ??????',
            })
        }
    })
}


$(document).on('click', '.logout', function (e) {
    var warning = "";
    if (get_cookie("exam_status") == "1") { //???????????????
        warning = "???????????????????????????????????????~"
    }
    Swal.fire({
        title: "??????????????????",
        icon: 'question',
        html: warning,
        showCancelButton: true,
        confirmButtonText: "??????",
        cancelButtonText: "??????"
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
            title: "????????????",
            footer: '<i class="fas fa-user"></i> ' + name + '?????????' + '<i class="fab fa-font-awesome-flag"></i> ' + zone,
            background: "#B5CBFA",
            html: `<div class='item' style="background: #FF5151;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:30px 10px 10px 100px;"><i class="fas fa-crown" style="color:#F9F900"></i><span style="transform:translateX(40px);position:absolute;">???????????????</span></div>\n` + `<div class='item' style="background: #FF5151;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;"><i class="fas fa-chess-pawn" style="color:#F9F900"></i><span style="transform:translateX(47px);position:absolute;">???????????????</span></div>\n` + `<div class='item' style="background: #a1df5a;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;"><i class="fas fa-chess-rook" style="color: #222;"></i><span style="transform:translateX(45px);position:absolute;">??????????????????</span></div>` + `<div class='item this' style="background: #E680FF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;"><i class="fas fa-street-view" style="color: #222;"></i></div><span style="transform: translateX(45px); position: absolute; top: 300px; left: 152px; font-size: 25px; font-weight: 900;">??????????????????</span>` + `<div class='item' style="background: #E680FF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;"><i class="fas fa-street-view" style="color: #222;"></i><span style="transform:translateX(40px);position:absolute;">????????????????????????</span></div>` + `<div class='item' style="background: #FFF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;box-shadow: inset 0px -4px 4px 0px #e8e8e8;"><i style="color:#000" class="fas fa-balance-scale-left" style="color:#F9F900"></i><span style="transform:translateX(40px);position:absolute;left: 155px;">???????????????</span></div>\n` + `<div class='item' style="background: #ccc;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 100px;box-shadow: inset 0px -4px 4px 0px #e8e8e8;"><i style="color:#000" class="fas fa-balance-scale-left" style="color:#F9F900"></i><span style="transform:translateX(40px);position:absolute;left: 155px;">??????????????????</span></div>\n`,
        })
        $(".swal2-footer").css("align-items", "center")
    } else {
        Swal.fire({
            title: "????????????",
            background: "#B5CBFA",
            footer: '<i class="fas fa-user"></i> ' + name + '?????????' + '<i class="fab fa-font-awesome-flag"></i> ' + zone,
            html: `<div class='item' style="line-height:50px;background: #FF5151;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:30px 10px 10px 50px;"><i class="fas fa-crown" style="color:#F9F900"></i><span style="transform:translateX(40px);position:absolute;">???????????????</span></div>\n` + `<div class='item' style="line-height:50px;background: #FF5151;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 50px;"><i class="fas fa-chess-pawn" style="color:#F9F900"></i><span style="transform:translateX(46px);position:absolute;">???????????????</span></div>\n` + `<div class='item' style="line-height:50px;background: #a1df5a;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 50px;"><i class="fas fa-chess-rook" style="color: #222;"></i><span style="transform:translateX(44px);position:absolute;">??????????????????</span></div>` + `<div class='item this' style="line-height:50px;background: #E680FF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 50px;"><i class="fas fa-street-view" style="color: #222;"></i></div><span style="transform: translateX(45px); position: absolute; top: 300px; left: 100px; font-size: 18px; font-weight: 900;">??????????????????</span>` + `<div class='item' style="line-height:50px;background: #E680FF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 50px;"><i class="fas fa-street-view" style="color: #222;"></i><span style="transform:translateX(40px);position:absolute;">????????????????????????</span></div>` + `<div class='item' style="line-height:50px;background: #FFF;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 50px;"><i style="color:#000" class="fas fa-balance-scale-left" style="color:#F9F900"></i><span style="transform:translateX(37px);position:absolute;">???????????????</span></div>\n` + `<div class='item' style="line-height:50px;background: #ccc;box-shadow: none;width:50px;height:50px;border-radius: 10px;margin:0 10px 10px 50px;"><i style="color:#000" class="fas fa-balance-scale-left" style="color:#F9F900"></i><span style="transform:translateX(37px);position:absolute;">??????????????????</span></div>\n`,
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
                title: '???????????? ??????',
            })
        }
    })
}



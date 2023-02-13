// -------------------------------------------------------
var ques_easy = [];
var ans_easy = [];

var ques_medium = [];
var ans_medium = [];
var ans_medium_upper = [];
var ans_medium_lower = [];

var ques_hard = [];
var ans_hard = [];
var ans_hard_upper = [];
var ans_hard_lower = [];
// -------------------------------------------------------
var zone_id;
var user_id;
var user_name;
var user_img; //使用者圖片
var item = []; // 管理所有item的可用性(T or F)
var user_item = [];
var first = true; //如果是遊戲剛開始
var num = 10; // 正方形邊長
var select_state; // 當前使用者是否點選卡片 若=1 : 已選，undefined : 未選
// -------------------------------------------------------
var up, down, left, right;
var left_up, left_down, right_up, right_down;
// -------------------------------------------------------  
var easy_num, medium_num, hard_num; //使用者目前共在各階段答對幾題

var level_up = 5; //至下個階段 所需的題數
var current_stage = 0; //階段1:easy 2:medium 3:hard
// -------------------------------------------------------
var current_index; // 當前選中之筆數
var first_time; //是否為第一次
var status; //  0: 未選 ，1: 已選
// -------------------------------------------------------
var clock;
// -------------------------------------------------------
const Toast = Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: true,
})
// -------------------------------------------------------

// -------------------------------------------------------
window.onload = function () {

    $(".card").addClass("disabled")
    $('.btn input').attr('disabled', true);
    // ---------------------------------------------
    var text = document.getElementById("text");
    text.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            // event.preventDefault();
            check()
        }
    });
    // --------------------------------------------- 
    $(".user h2").eq(1).html('<i class="fas fa-user"> ' + get_cookie("exam_user_name"))
    $(".user h2").eq(1).html('<i class="fab fa-font-awesome-flag"> ' + get_cookie("exam_user_zone_name"))
    // --------------------------------------------- 
    get_user()
    get_map()
    get_ques()
    card_init()
    update_card()
    print_ques()
    // ---------------------------------------------

    current_index = get_cookie("exam_user_current_index")



    if (get_cookie("exam_user_first_time") == "0" && get_cookie("exam_user_status") != "1") {
        $(".card").removeClass("disabled")
    }
    if (get_cookie("exam_user_first_time") == "1" && get_cookie("exam_user_status") == "0") {
        $(".card").removeClass("disabled")
    }
    if (get_cookie("exam_user_first_time") == "1" && $(".card div").hasClass('highlight') == false) {
        Toast.fire({
            icon: 'error',
            title: '～　Game Over　～',
        })
        $(".card").addClass("disabled")
        $('.btn input').attr('disabled', true);
        $('#text').addClass("disabled")
        $('.btn').addClass("disabled")
    }


    console.log($("#text").prop("disabled"))
}




$(document).ready(function () {
    // First we get the viewport height and we multiple it by 1% to get a value for a vh unit
    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);



    $(document).ready(function () {

        clock = $('.clock').FlipClock(500, {
            clockFace: 'MinuteCounter',
            countdown: true,
            autoStart: false,
            callbacks: {
                start: function () {
                    $('.message').html('The clock has started!');
                }
            }
        });

        $('.start').click(function (e) {

            clock.start();
        });

    });
    if ($(document).width() <= 768) {
        $(".logout").html("<i class=\"fas fa-sign-out-alt\"></i>")
    }
})


function card_init() {
    current_index = get_cookie("exam_user_current_index")
    first_time = get_cookie("exam_user_first_time")
    if (first_time == "0") { // 第一次入場
        $(".card div img").css("opacity", 0.6) //將所有卡牌變半透明
    } else {
        for (var i = 0; i <= Math.pow(num, 2) - 1; i++) {
            if ($(".card div img").eq(i).attr("src") == "img/" + user_img) {
                user_item.push(i)
            }
        }
        // console.log(user_item)

        //--------------------------將卡片圖片為back.png的設定為透明--------------------------------
        for (var i = 0; i <= Math.pow(num, 2) - 1; i++) {
            if ($(".card div img").eq(i).attr("src") == "img/back.png") {
                $(".card div img").eq(i).css("opacity", 0.6) // 將未佔領的設為透明0.6
            }
        }
        //----------------------------在這邊則能夠透過3x3 改變卡片圖片的透明度----------------------------------
        for (var j = 0; j <= user_item.length - 1; j++) {
            current_index = user_item[j]; //先暫時將current_index 改變成當前使用者已佔領的index，之後再復原
            // console.log(current_index)
            _3x3()
        }
    }
}


function check_card() { //如果之前選中的，沒有回答，且被其他使用者回答過了
    $.ajax({
        type: "post",
        url: 'php/check_card.php',
        data: {
            zone_id: get_cookie("exam_user_zone_id"),
            index: get_cookie("exam_user_current_index"),
        },
        dataType: 'text',
        async: false,
        success: function (data) {
            // console.log(data)

            if (get_cookie("exam_user_first_time") == "1" && $(".card div").hasClass('highlight') == false) {
                Toast.fire({
                    icon: 'error',
                    title: '～　Game Over　～',
                })
                $(".card").addClass("disabled")
                $('.btn input').attr('disabled', true);
                $('#text').addClass("disabled")
                $('.btn').addClass("disabled")
            }

            if (data != "0") { //代表已經有人回答過了(card_user != 0)
                Toast.fire({
                    icon: 'error',
                    title: '已經被別人占領了 !!',
                    timer: 1500,
                    timerProgressBar: true,
                })
                $(".card").removeClass("disabled")
                $('.card div').eq(current_index).removeClass("selected")
                // --------------------------------------------- 
                get_user()
                get_map()
                card_init()
                update_user_reset()
                update_card()
                // ---------------------------------------------

                delete_cookie("exam_user_status")
                delete_cookie("exam_user_current_index")

                document.cookie = "exam_user_status=0" + "; path=/;";
                document.cookie = "exam_user_current_index=-1" + "; path=/;";
            } else {
                $('.card div').eq(current_index).addClass("selected")
                update_user()
                print_ques()
            }
        },
        error: function (e) {
            // alert("使用者圖片獲取失敗 !!")
            Toast.fire({
                icon: 'error',
                title: '卡片擁有者獲取失敗 !!',
                timer: 3000,
                timerProgressBar: true,
            })
        }
    })
}


function update_card() {
    current_index = get_cookie("exam_user_current_index")
    first_time = get_cookie("exam_user_first_time")
    status = get_cookie("exam_user_status")

    if (status == "1") { //有選到
        $('.card div').eq(current_index).addClass("selected")
        $(".card div img").eq(current_index).css("opacity", 1)
    }

}

$(document).on('click', '.card div img', function (e) { // 點擊任意圖片時
    if ($(".question h3 pre").text() !== "") { //用題目中是否有內容來判斷可否點選卡片，如果不等於空，則不給使用者操作卡片
        $(".card").addClass("disabled")
    }

    Swal.fire({
        title: "確定要選擇此題？",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: "確定",
        cancelButtonText: "取消"
    }).then(result => {
        if (result.value) {
            delete_cookie("exam_user_current_index")
            delete_cookie("exam_user_status")

            current_index = $(".card div img").index(this);
            // console.log(current_index)
            document.cookie = "exam_user_status=1" + "; path=/;";
            document.cookie = "exam_user_current_index=" + current_index + "; path=/;"; //將current_index放入cookie ，這樣重新整理時，也可以知道上次點了哪個，以便後續繼續作答同一題(highlight)
            // document.cookie = "exam_user_state=1" + "; path=/;"; //state:0 已選擇,未選->則會undefined

            $(".card").addClass("disabled")
            if (get_cookie("exam_user_first_time") == "1") { // 0:first , 1:not-first
                console.log("not-first")

                if ($(".card div").eq(current_index).is('.highlight')) { //如果有被highlight，則可以回答題目，否則告知使用者

                    check_card()
                } else {
                    // console.log("2")
                    Toast.fire({
                        icon: 'error',
                        title: '請選擇已佔領之鄰近地圖  ！！\n或此處已被佔領！！',
                        timer: 5000,
                        timerProgressBar: true,
                    })
                    $(".card").removeClass("disabled")
                }

            } else {
                console.log("first")


                // 如果第一次回答錯誤，則改變first_time => 0

                // $(".card div img").eq(current_index).css("opacity", 1)
                $(".card").addClass("disabled")
                if ($(".card div img").eq(current_index).attr("src") == "img/back.png") {



                    $('.card div').eq(current_index).addClass("selected")

                    update_user_first()
                    print_ques()
                } else {
                    $(".card").removeClass("disabled")
                    $('.card div').eq(current_index).removeClass("selected")


                    delete_cookie("exam_user_first_time")
                    delete_cookie("exam_user_current_index")
                    delete_cookie("exam_user_status")

                    // console.log(current_index)
                    document.cookie = "exam_user_first_time=0" + "; path=/;";
                    document.cookie = "exam_user_current_index=-1" + current_index + "; path=/;";
                    document.cookie = "exam_user_status=0" + current_index + "; path=/;";

                    update_user()

                    Toast.fire({
                        icon: 'error',
                        title: '此處已被佔領！！',
                        timer: 5000,
                        timerProgressBar: true,
                    })
                }
            }
        } else {
            // console.log(result.dismiss)
        }
    })
})


// -------------------------------------------------------

function checkStage() { //檢查階段
    $(".user h2 i").attr("class", "")
    if (easy_num < level_up) {
        current_stage = 1;
        $(".user h2 i").attr("class", "far fa-star")
    }
    if (easy_num >= level_up && medium_num < level_up) {
        current_stage = 2;
        $(".user h2 i").attr("class", "fas fa-star-half-alt")
    }
    if (medium_num >= level_up) {
        current_stage = 3;
        $(".user h2 i").attr("class", "fas fa-star")
    }
    // console.log(current_stage)
    // console.log("Easy:" + easy_num)
    // console.log("Medium:" + medium_num)
    // console.log("Hard:" + hard_num)
}
// -------------------------------------------------------

function print_ques() { // 印出題目
    switch (current_stage) {
        case 1:
            $(".question h3 pre").text(ques_easy[current_index])
            break;
        case 2:
            $(".question h3 pre").text(ques_medium[current_index])
            break;
        case 3:
            $(".question h3 pre").text(ques_hard[current_index])
            break;
        default:
        // code block
    }
    $(".question h3 pre").niceScroll({
        cursorwidth: 10,         //滾動條寬度
        autohidemode: false,      //滚動條是否是自動隐藏，默認值为 true
    });
    $('.btn input').attr('disabled', false);
    $('#text').removeClass("disabled")
    $('.btn').removeClass("disabled")

}



function correct() { //答對題目後

    current_index = get_cookie("exam_user_current_index")
    console.log(current_index)

    delete_cookie("exam_user_first_time") // 因為已經點選題目了，代表不是第一次。
    document.cookie = "exam_user_first_time=1" + "; path=/;";

    Toast.fire({
        icon: 'success',
        title: '正確答案 ！',
        timer: 3000,
        timerProgressBar: true,
    })

    $(".card div img").eq(current_index).css("opacity", 1)
    $(".card div img").eq(current_index).attr("src", "img/" + user_img)
    $('.card div').eq(current_index).removeClass("selected")

    $(".question h3 pre").text("")
    $(".question h3").getNiceScroll().resize();
    $('.btn input').attr('disabled', true);
    $(".card").removeClass("disabled")


    _3x3()



    // state()
    // -------------------------------------------------------
    switch (current_stage) { // 答對後將該階段num+1，並更新當前階段
        case 1:
            easy_num++;
            checkStage()
            break;
        case 2:
            medium_num++;
            checkStage()
            break;
        case 3:
            hard_num++;
            checkStage()
            break;
        default:
        // code block
    }
    // console.log(current_stage)
    // -------------------------------------------------------
    $.ajax({
        type: "post",
        url: 'php/update_map.php',
        data: {
            user_id: get_cookie("exam_user_id"),
            index: get_cookie("exam_user_current_index"),
            zone_id: get_cookie("exam_user_zone_id")
        },
        dataType: 'text',
        async: false,
        success: function (data) {
            console.log(data)
            if (data == "x") {
                Toast.fire({
                    icon: 'error',
                    title: '你太遲了~\n已經被佔領了 !!\n 將重新載入內容',
                    timer: 2000,
                    timerProgressBar: true,
                })
                $(".card").removeClass("disabled")
                // --------------------------------------------- 
                get_user()
                get_map()
                card_init()
                update_user_reset()
                update_card()
                $('.card div').eq(current_index).removeClass("selected")
                // ---------------------------------------------

                delete_cookie("exam_user_status")
                delete_cookie("exam_user_current_index")

                document.cookie = "exam_user_status=0" + "; path=/;";
                document.cookie = "exam_user_current_index=-1" + "; path=/;";

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"

                });
            }
        },
        error: function (e) {
            // alert("使用者圖片獲取失敗 !!")
            Toast.fire({
                icon: 'error',
                title: '地圖更新失敗 !!',
                timer: 3000,
                timerProgressBar: true,
            })
        }
    })


    // -------------------------------------------------------
    // for (var i = 0; i <= Math.pow(num, 2) - 1; i++) {
    //     if ($(".card div img").eq(i).attr("src") !== "img/back.png") {
    //         $(".card div").eq(i).removeClass("highlight")
    //         $(".card div img").eq(i).css("opacity", 1)
    //     }
    // }

    // --------------------------------------------- 
    get_user()
    get_map()
    card_init()
    update_user_reset()
    update_card()
    $('.card div').eq(current_index).removeClass("selected")
    // ---------------------------------------------

    delete_cookie("exam_user_status")
    delete_cookie("exam_user_current_index")

    document.cookie = "exam_user_status=0" + "; path=/;";
    document.cookie = "exam_user_current_index=-1" + "; path=/;";

    window.scrollTo({
        top: 0,
        behavior: "smooth"

    });
}


function update_user() {
    $.ajax({
        type: "post",
        url: 'php/update_user.php',
        data: {
            user_id: get_cookie("exam_user_id"),
            easy_num: easy_num,
            medium_num: medium_num,
            hard_num: hard_num,
            first_time: get_cookie("exam_user_first_time"),
            current_index: get_cookie("exam_user_current_index"),
            status: get_cookie("exam_user_status"),
        },
        dataType: 'text',
        success: function (data) {
            // console.log(data[0])
            if (data[0] == "1") {
                // Toast.fire({
                //     icon: 'success',
                //     title: '更新使用者資訊成功 !!',
                //     timer: 3000,
                //     timerProgressBar: true,
                // })
                get_user()
            }
        },
        error: function (e) {
            console.log(e[0])
            Toast.fire({
                icon: 'error',
                title: '更新使用者資訊失敗 !!',
                timer: 3000,
                timerProgressBar: true,
            })
        }
    })
}




function update_user_first() {
    $.ajax({
        type: "post",
        url: 'php/update_user.php',
        data: {
            user_id: get_cookie("exam_user_id"),
            easy_num: easy_num,
            medium_num: medium_num,
            hard_num: hard_num,
            first_time: 0,
            current_index: get_cookie("exam_user_current_index"),
            status: 1,
        },
        dataType: 'text',
        success: function (data) {
            // console.log(data[0])
            if (data[0] == "1") {
                // Toast.fire({
                //     icon: 'success',
                //     title: '更新使用者資訊成功 !!',
                //     timer: 3000,
                //     timerProgressBar: true,
                // })
                get_user()
            }
        },
        error: function (e) {
            console.log(e[0])
            Toast.fire({
                icon: 'error',
                title: '更新使用者資訊失敗 !!',
                timer: 3000,
                timerProgressBar: true,
            })
        }
    })
}


function update_user_reset() {
    $.ajax({
        type: "post",
        url: 'php/update_user.php',
        data: {
            user_id: get_cookie("exam_user_id"),
            easy_num: easy_num,
            medium_num: medium_num,
            hard_num: hard_num,
            first_time: 1,
            current_index: -1,
            status: 0
        },
        dataType: 'text',
        success: function (data) {
            // console.log(data[0])
            if (data[0] == "1") {
                // Toast.fire({
                //     icon: 'success',
                //     title: '更新使用者資訊成功 !!',
                //     timer: 3000,
                //     timerProgressBar: true,
                // })
            }
        },
        error: function (e) {
            console.log(e[0])
            Toast.fire({
                icon: 'error',
                title: '更新使用者資訊失敗 !!',
                timer: 3000,
                timerProgressBar: true,
            })
        }
    })
}


function error() {

    current_index = get_cookie("exam_user_current_index")

    $(".card div img").eq(current_index).css("opacity", 0.6)
    $('.card div').eq(current_index).removeClass("selected")

    $(".question h3 pre").text("")
    $(".question h3").getNiceScroll().resize();
    $('.btn input').attr('disabled', true);
    $(".card").removeClass("disabled")


    Toast.fire({
        icon: 'error',
        title: '錯誤答案 ！',
        timer: 3000,
        timerProgressBar: true,
    })

    // --------------------------------------------- 
    get_user()
    get_map()
    card_init()
    update_user_reset()
    update_card()
    $('.card div').eq(current_index).removeClass("selected")
    if (get_cookie("exam_user_first_time") == "0") {
        $(".card div img").eq(current_index).css("opacity", 0.6)
    }
    // ---------------------------------------------

    delete_cookie("exam_user_status")
    delete_cookie("exam_user_current_index")

    document.cookie = "exam_user_status=0" + "; path=/;";
    document.cookie = "exam_user_current_index=-1" + "; path=/;";


    window.scrollTo({
        top: 0,
        behavior: "smooth"

    });
}



function check() { //檢查答案

    if ($('.btn input').prop('disabled') == false) { //如果按鈕disable == false (沒被停用)
        var ans = $(".answer input").val()
        ans = ans.toLowerCase();
        Swal.fire({
            title: "確定送出？",
            html: "您輸入的答案為：" + ans,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: "確定",
            cancelButtonText: "取消"
        }).then(result => {
            console.log(current_stage)
            if (result.value) {


                $(".card").removeClass("disabled")

                var user_ans = $(".answer input").val()
                switch (current_stage) { // 根據當前階段去檢查答案
                    case 1:
                        // console.log(ans_easy[index])
                        if (user_ans == ans_easy[current_index]) {
                            correct()
                        } else {
                            error()
                        }
                        break;
                    case 2:
                        // console.log(parseFloat(user_ans))
                        // console.log(parseFloat(ans_medium_lower[index]))
                        // console.log(parseFloat(ans_medium_upper[index]))

                        if (parseFloat(user_ans) >= parseFloat(ans_medium_lower[current_index]) && parseFloat(user_ans) <= parseFloat(ans_medium_upper[current_index])) {
                            correct()
                        } else {
                            error()
                        }
                        break;
                    case 3:
                        // console.log(parseFloat(user_ans))
                        // console.log(parseFloat(ans_hard_lower[index]))
                        // console.log(parseFloat(ans_hard_upper[index]))
                        if (parseFloat(user_ans) >= parseFloat(ans_hard_lower[current_index]) && parseFloat(user_ans) <= parseFloat(ans_hard_upper[current_index])) {
                            correct()

                        } else {
                            error()
                        }
                        break;
                    default:
                    // code block
                }
                $(".answer input").val("")
            } else {
                // console.log(result.dismiss)
            }
        })
    }
}


$(document).on('click', '.btn input', function (e) { //點擊送出按鈕時
    check();
})
















//------------------------------------------------------------------------------------------------
function get_user() {
    $.ajax({
        type: "post",
        url: 'php/get_user.php',
        data: {
            user_id: get_cookie("exam_user_id"),
        },
        dataType: 'json',
        async: false,
        success: function (data) {
            // console.log(data[0].image)
            user_img = data[0].image;
            easy_num = parseInt(data[0].easy_num);
            medium_num = parseInt(data[0].medium_num);
            hard_num = parseInt(data[0].hard_num);
            $(".user_img img").attr("src", "img/" + user_img)

            // console.log("456" + get_cookie("exam_user_current_index"))
            // console.log(current_index)

            checkStage()
            update_card()
        },
        error: function (e) {
            // alert("使用者圖片獲取失敗 !!")
            Toast.fire({
                icon: 'error',
                title: '使用者圖片獲取失敗 !!',
                timer: 3000,
                timerProgressBar: true,
            })
        }
    })
}
//------------------------------------------------------------------------------------------------
function get_ques() {
    $.ajax({
        type: 'POST', //必要 少了type:POST 會無法將data傳給php
        url: 'php/get_ques.php',
        data: {
            user_id: parseInt(get_cookie("exam_user_id")),
            zone_id: get_cookie("exam_user_zone_id")
        },
        dataType: 'json',
        async: false,
        success: function (data) {
            // console.log(data)
            var contain = "";
            $.each(data, function (key, value) {
                ques_easy.push(value.ques_easy)
                ans_easy.push(value.ans_easy)
                ques_medium.push(value.ques_medium)
                ans_medium.push(value.ans_medium)
                ans_medium_lower.push(value.ans_medium_lower)
                ans_medium_upper.push(value.ans_medium_upper)
                ques_hard.push(value.ques_hard)
                ans_hard.push(value.ans_hard)
                ans_hard_lower.push(value.ans_hard_lower)
                ans_hard_upper.push(value.ans_hard_upper)
            })

        },
        error: function (e) {
            // alert("題目獲取失敗 !!")
            Toast.fire({
                icon: 'error',
                title: '題目獲取失敗 !!',
                timer: 3000,
                timerProgressBar: true,
            })
        }
    })
}
//------------------------------------------------------------------------------------------------
function get_map() {
    $.ajax({
        type: 'POST', //必要 少了type:POST 會無法將data傳給php
        url: 'php/get_map.php',
        data: {
            zone_id: get_cookie("exam_user_zone_id")
        },
        dataType: 'json',
        async: false,
        success: function (data) {
            var contain = "";
            $(".card").html("")
            $.each(data, function (key, value) {
                contain +=
                    "<div><img src=\'img\/" + value.image + "\'></img></div>";
                // $(".card img").eq(key).attr("src", "img/" + value.image)
            })

            $(".card").append(contain)
        },
        error: function (e) {
            // alert("地圖圖片獲取失敗 !!")
            Toast.fire({
                icon: 'error',
                title: '地圖圖片獲取失敗 !!',
                timer: 3000,
                timerProgressBar: true,
            })
        }
    })
}
//------------------------------------------------------------------------------------------------

function map_init() {
    for (var i = 0; i <= Math.pow(num, 2) - 1; i++) {
        if ($(".card div img").eq(i).attr("src") == "img/" + user_img) {
            user_item.push(i)
        }
    }
    // console.log(user_item)

    //--------------------------將卡片圖片為back.png的設定為透明--------------------------------
    for (var i = 0; i <= Math.pow(num, 2) - 1; i++) {
        if ($(".card div img").eq(i).attr("src") == "img/back.png") {
            $(".card div img").eq(i).css("opacity", 0.6) // 將未佔領的設為透明0.6
        }
    }
    //----------------------------在這邊則能夠透過3x3 改變卡片圖片的透明度----------------------------------
    for (var j = 0; j <= user_item.length - 1; j++) {
        current_index = user_item[j]; //先暫時將current_index 改變成當前使用者已佔領的index，之後再復原
        // console.log(current_index)
        _3x3()
    }
}




//------------------------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------------------------

$(document).on('click', '.logout', function (e) {
    Swal.fire({
        title: "確定要登出？",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: "確定",
        cancelButtonText: "取消"
    }).then(result => {
        if (result.value) {
            delete_cookie("exam_user_id")
            delete_cookie("exam_user_name")
            delete_cookie("exam_user_zone_id")
            delete_cookie("exam_user_zone_name")
            delete_cookie("exam_user_current_index")
            // delete_cookie("exam_user_state")
            delete_cookie("exam_user_status")
            delete_cookie("exam_user_first_time")
            location.href = "login/"
        }
    })
});



function _3x3() {
    //-------------------------------------- 檢查九宮格
    (current_index + 1) - num <= 0 ? up = false : up = true;
    (current_index + 1) + num > Math.pow(num, 2) ? down = false : down = true;
    (current_index + 1) % num == 1 ? left = false : left = true;
    (current_index + 1) % num == 0 ? right = false : right = true;

    (left == false || up == false) ? left_up = false : left_up = true;
    (left == false || down == false) ? left_down = false : left_down = true;
    (right == false || up == false) ? right_up = false : right_up = true;
    (right == false || down == false) ? right_down = false : right_down = true;

    // console.log("上:" + up + ",下:" + down + ",左:" + left + ",右:" + right + "\n左上:" + left_up + ",左下:" + left_down + ",右上:" + right_up + ",右下:" + right_down)
    // console.log("3*3")

    if (up) {
        if ($(".card div img").eq(current_index - num).attr("src") == "img/back.png") {
            $(".card div").eq(current_index - num).addClass("highlight")
            $(".card div img").eq(current_index - num).css("opacity", 1)
            item[current_index - num] = true;
        }
    }
    if (down) {
        if ($(".card div img").eq(current_index + num).attr("src") == "img/back.png") {
            $(".card div").eq(current_index + num).addClass("highlight")
            $(".card div img").eq(current_index + num).css("opacity", 1)
            item[current_index + num] = true;
        }

    }
    if (left) {
        if ($(".card div img").eq(current_index - 1).attr("src") == "img/back.png") {
            $(".card div").eq(current_index - 1).addClass("highlight")
            $(".card div img").eq(current_index - 1).css("opacity", 1)
            item[current_index - 1] = true;
        }

    }
    if (right) {
        if ($(".card div img").eq(current_index + 1).attr("src") == "img/back.png") {
            $(".card div").eq(current_index + 1).addClass("highlight")
            $(".card div img").eq(current_index + 1).css("opacity", 1)
            item[current_index + 1] = true;
        }

    }
    if (left_up) {
        if ($(".card div img").eq(current_index - num - 1).attr("src") == "img/back.png") {
            $(".card div").eq(current_index - num - 1).addClass("highlight")
            $(".card div img").eq(current_index - num - 1).css("opacity", 1)
            item[current_index - num - 1] = true;
        }

    }
    if (left_down) {
        if ($(".card div img").eq(current_index + num - 1).attr("src") == "img/back.png") {
            $(".card div").eq(current_index + num - 1).addClass("highlight")
            $(".card div img").eq(current_index + num - 1).css("opacity", 1)
            item[current_index + num - 1] = true;
        }

    }
    if (right_up) {
        if ($(".card div img").eq(current_index - num + 1).attr("src") == "img/back.png") {
            $(".card div").eq(current_index - num + 1).addClass("highlight")
            $(".card div img").eq(current_index - num + 1).css("opacity", 1)
            item[current_index - num + 1] = true;
        }
    }
    if (right_down) {
        if ($(".card div img").eq(current_index + num + 1).attr("src") == "img/back.png") {
            $(".card div").eq(current_index + num + 1).addClass("highlight")
            $(".card div img").eq(current_index + num + 1).css("opacity", 1)
            item[current_index + num + 1] = true;
        }

    }
    //-------------------------------------- 檢查九宮格
}
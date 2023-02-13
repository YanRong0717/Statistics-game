// ajax to php
// https://t.codebug.vip/questions-934432.htm


$(document).ready(function (e) {
    get_exchange_life_status()
    get_Reset_NextDay()
    import_ques()
    import_user()
    import_zone()
});
function import_ques() {
    $('#ques_form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '../php/import_ques.php',
            type: 'POST',
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                // $("#fileMsg").html("File Uploaded Successfully");
                console.log(data)
                if (data == "找不到檔案，請確認路徑是否正確.") {
                    Swal.fire({
                        icon: 'error',
                        html: '找不到檔案，請確認路徑是否正確. ！！'
                    })
                } else {
                    Swal.fire({
                        icon: 'success',
                        html: data
                    })
                    $("#ques_upload").val("")
                }

            },
            error: function (data) {
                // alert(data)
                Swal.fire({
                    icon: 'error',
                    title: '新增失敗 ！！'
                })
            }
        });
    });
}







function import_user() {
    $('#user_form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '../php/import_user.php',
            type: 'POST',
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                // $("#fileMsg").html("File Uploaded Successfully");
                console.log(data)
                if (data == "找不到檔案，請確認路徑是否正確.") {
                    Swal.fire({
                        icon: 'error',
                        html: '找不到檔案，請確認路徑是否正確. ！！'
                    })
                } else {
                    Swal.fire({
                        icon: 'success',
                        html: data
                    })
                    $("#user_upload").val("")
                }

            },
            error: function (data) {
                // alert(data)
                Swal.fire({
                    icon: 'error',
                    title: '新增失敗 ！！'
                })
            }
        });
    });
}






function import_zone() {
    $('#zone_form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '../php/import_zone.php',
            type: 'POST',
            data: new FormData(this),
            contentType: false,
            cache: false,
            processData: false,
            success: function (data) {
                // $("#fileMsg").html("File Uploaded Successfully");
                console.log(data)
                if (data == "找不到檔案，請確認路徑是否正確.") {
                    Swal.fire({
                        icon: 'error',
                        html: '找不到檔案，請確認路徑是否正確. ！！'
                    })
                } else {
                    Swal.fire({
                        icon: 'success',
                        html: data
                    })
                    $("#zone_upload").val("")
                }

            },
            error: function (data) {
                // alert(data)
                Swal.fire({
                    icon: 'error',
                    title: '新增失敗 ！！'
                })
            }
        });
    });
}






$(document).on('click', '#setting_btn', function (e) { //點擊按鈕時
    Swal.fire({
        html: "確定要更新 ？",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: "確定",
        cancelButtonText: "取消"
    }).then(result => {
        if (result.value) {
            e.preventDefault();
            $.ajax({
                url: '../php/update_setting.php',
                type: 'POST',
                data: {
                    begin: $(".setting input").eq(0).val(),
                    end: $(".setting input").eq(1).val()
                },
                dataType: 'text',
                success: function (data) {
                    if (data == "1") {
                        Swal.fire({
                            icon: 'success',
                            title: "更新成功 ！！"
                        })
                    }
                },
                error: function (data) {
                    // alert(data)
                    Swal.fire({
                        icon: 'error',
                        title: '更新失敗 ！！'
                    })
                }
            });
        }
    });
})










$(document).on('click', '#clear_btn', function (e) { //點擊按鈕時
    if ($(".manage select").eq(0).val() != "none") {
        Swal.fire({
            html: "確定要清除 \"" + $(".manage select").eq(0).val() + " \" table ？",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: "確定",
            cancelButtonText: "取消"
        }).then(result => {
            if (result.value) {
                e.preventDefault();
                $.ajax({
                    url: '../php/clear_table.php',
                    type: 'POST',
                    data: {
                        table: $(".manage select").eq(0).val()
                    },
                    dataType: 'text',
                    success: function (data) {
                        console.log(data)
                        if (data == "0") {
                            Swal.fire({
                                icon: 'success',
                                title: "清空成功 ！！"
                            })
                        }
                        $("select").val("none")
                    },
                    error: function (data) {
                        // alert(data)
                        Swal.fire({
                            icon: 'error',
                            title: '清除失敗 ！！'
                        })
                    }
                });
            } else {
                $("select").val("none")
                // console.log(result.dismiss)
            }
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: '請選擇資料表 ！！'
        })
    }
})



$(document).on('click', '#export_btn', function (e) { //點擊按鈕時
    if ($(".manage select").eq(1).val() != "none") {
        Swal.fire({
            html: "確定要匯出 \"" + $(".manage select").eq(1).val() + " \" table ？",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: "確定",
            cancelButtonText: "取消"
        }).then(result => {
            if (result.value) {
                document.location.href = '../php/export_table.php?table=' + $(".manage select").eq(1).val();
                $(".manage select").eq(1).val("none")
            } else {
                $(".manage select").eq(1).val("none")
                // console.log(result.dismiss)
            }
        })
    } else {
        Swal.fire({
            icon: 'error',
            title: '請選擇資料表 ！！'
        })
    }
})







$(document).on('click', '#download_btn', function (e) { //點擊按鈕時
    if ($(".manage select").eq(2).val() == "ques") {
        document.location.href = '../manage/ques-v2-sample.csv'
    }
    if ($(".manage select").eq(2).val() == "user") {
        document.location.href = '../manage/user-v2-sample.csv'
    }
    if ($(".manage select").eq(2).val() == "zone") {
        document.location.href = '../manage/zone-v2-sample.csv'
    }
})



$(document).on('click', '.btn_box1', function (e) { //點擊開關時
    console.log("111")


    if ($("#switch1").prop("checked") == false) { // 為false時，代表啟用"分數換生命"功能
        $.ajax({
            url: '../php/update_exchange_life_status.php',
            type: 'POST',
            data: {
                status: 1
            },
            dataType: 'text',
            success: function (data) {
                console.log(data)
                if (data == "ok") {
                    Swal.fire({
                        icon: 'success',
                        title: "更新成功 ！！"
                    })
                }
            },
            error: function (data) {
                // alert(data)
                Swal.fire({
                    icon: 'error',
                    title: '更新失敗 ！！'
                })
            }
        });
    } else { // 為true時，代表關閉"分數換生命"功能
        $.ajax({
            url: '../php/update_exchange_life_status.php',
            type: 'POST',
            data: {
                status: 0
            },
            dataType: 'text',
            success: function (data) {
                console.log(data)
                if (data == "ok") {
                    Swal.fire({
                        icon: 'success',
                        title: "更新成功 ！！"
                    })
                }
            },
            error: function (data) {
                // alert(data)
                Swal.fire({
                    icon: 'error',
                    title: '更新失敗 ！！'
                })
            }
        });
    }
})

$(document).on('click', '.btn_box2', function (e) { //點擊開關時
    console.log("222")


    if ($("#switch2").prop("checked") == false) { // 為false時，代表啟用"分數換生命"功能
        $.ajax({
            url: '../php/update_Reset_NextDay.php',
            type: 'POST',
            data: {
                reset_nextday: 1
            },
            dataType: 'text',
            success: function (data) {
                console.log(data)
                if (data == "ok") {
                    Swal.fire({
                        icon: 'success',
                        title: "更新成功 ！！"
                    })
                }
            },
            error: function (data) {
                // alert(data)
                Swal.fire({
                    icon: 'error',
                    title: '更新失敗 ！！'
                })
            }
        });
    } else { // 為true時，代表關閉"分數換生命"功能
        $.ajax({
            url: '../php/update_Reset_NextDay.php',
            type: 'POST',
            data: {
                reset_nextday: 0
            },
            dataType: 'text',
            success: function (data) {
                console.log(data)
                if (data == "ok") {
                    Swal.fire({
                        icon: 'success',
                        title: "更新成功 ！！"
                    })
                }
            },
            error: function (data) {
                // alert(data)
                Swal.fire({
                    icon: 'error',
                    title: '更新失敗 ！！'
                })
            }
        });
    }
})



function get_exchange_life_status() {
    $.ajax({
        url: '../php/get_exchange_life_status.php',
        type: 'POST',
        data: 'data',
        dataType: 'text',
        success: function (data) {
            // console.log(data)
            if (data == "0") {
                $("#switch1").prop("checked", false)
            } else if (data == "1") {
                $("#switch1").prop("checked", true)
            }
        },
        error: function (data) {
            // alert(data)
            Swal.fire({
                icon: 'error',
                title: '獲取狀態失敗 ！！'
            })
        }
    });
}

function get_Reset_NextDay() {
    $.ajax({
        url: '../php/get_Reset_NextDay.php',
        type: 'POST',
        data: 'data',
        dataType: 'text',
        success: function (data) {
            // console.log(data)
            if (data == "0") {
                $("#switch2").prop("checked", false)
            } else if (data == "1") {
                $("#switch2").prop("checked", true)
            }
        },
        error: function (data) {
            // alert(data)
            Swal.fire({
                icon: 'error',
                title: '獲取狀態失敗 ！！'
            })
        }
    });
}


// Swal.fire({
//     html: "確定要匯入 ？",
//     icon: 'question',
//     showCancelButton: true,
//     confirmButtonText: "確定",
//     cancelButtonText: "取消"
// }).then(result => {
//     if (result.value) {

//     }
// });


$(document).ready(function () {
    if (get_cookie("exam_user_id") == undefined) {
        location.href = "login/index.html"
    }
})
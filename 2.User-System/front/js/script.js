const SERVER_URL = "http://192.168.1.7:5002/";
$(function () {
    $('#login').on('click', () => {
        const username = $('#username').val();
        const password = $('#password').val();

        if (!validation()) return false;

        $.ajax({
            url: SERVER_URL + "api/login",
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify({username, password})
        })
            .done(data => {
                console.log(data);
                if (data.status === 200) {
                    normal($("#username"));
                    normal($("#password"));
                    localStorage.setItem('token', data.token);
                    customAlert("alert-success", "Login successful");
                    setTimeout(() => window.location.href = "/admin", 2000);
                } else if (data.status === 404) {
                    error($("#username"));
                    error($("#password"));
                    customAlert("alert-fail", "There is no user with entered data!");
                }
            })
            .fail((err) => {
                console.log(err);
                alert("Server error");
            });
    });
    $('#logout').on('click', logout);
    $('#update').on('click', () => {
        let data = {
            name: $('#name').val(),
            username: $('#username').val(),
            email: $('#email').val(),
            gender: $('#gender').val(),
            token: localStorage.getItem('token')
        }
        $.ajax({
            url: SERVER_URL + "api/update-info",
            data: JSON.stringify(data),
            method: "POST",
            contentType: "application/json",
            success: result => {
                if (result.status === 200) {
                    setTimeout(()=>window.location.reload(),1000);
                }
                else
                    window.location.href = result.url;
            },
            error: err => {
                alert('somethings wrong, check server');
            }
        });
    });
    $('#updatePassword').on('click', ()=>{
        let oldPassword = $('#oldPassword').val();
        let newPassword = $('#newPassword').val();
        let reNewPassword = $('#reNewPassword').val();
        let token = localStorage.getItem('token');
        if(newPassword !== reNewPassword)
            return alert("new password and it's repeat is not match");
        $.ajax({
            url: SERVER_URL+"api/update-password",
            data: JSON.stringify({oldPassword, newPassword, reNewPassword, token}),
            method: "POST",
            contentType: "application/json",
            success: result => {
                if(result.status === 200){
                    setTimeout(logout,1000);
                }
                else
                    alert(result.message);
            },
            error: err => {
                alert('somethings wrong, check server');
            }
        });
    });
    let selectedGender = $('#selectedGender').val();
    $('#gender').val(selectedGender ? selectedGender : "Gender ...");
});
const validation = () => {
    const username = $('#username');
    const password = $('#password');
    let wrong = false;

    if (!username.val()) {
        error(username, true);
        wrong = true;
    } else normal(username);

    if (!password.val()) {
        error(password, true);
        wrong = true;
    } else normal(password);

    return !wrong;
}

const error = (element, text = false) => {
    $(element).parent().css("border", "2px solid orangered");
    $(element).children('i').css("color", "orangered");
    if (text) {
        $(`div[data-target=${$(element).attr("id")}]`).show();
    }
}
const normal = element => {
    $(element).parent().css("border", "none");
    $(element).children('i').css("color", "white");
    $(`div[data-target=${$(element).attr("id")}]`).hide();
}
const customAlert = (type, text) => {
    let alertContainer = $('.d-flex');
    let notification = $('#notification');
    notification.fadeIn();
    alertContainer.css("display", "flex");
    let icon = type === "alert-fail" ? '<i class="fa fa-times"></i>' : '<i class="fa fa-check"></i>';
    text = `${icon} ${text}`;
    notification.addClass(type).html(text);
    setTimeout(() => {
        notification.fadeOut(() => {
            notification.removeClass(type).html("");
        });
    }, 2000);
}

const checkLogin = () => {
    if (!localStorage.getItem('token')) window.location.href = "/login";
}
const logout = () => {
    $.get('http://192.168.1.7:5002/api/logout')
        .done(() => {
            localStorage.removeItem('token');
            window.location.href = "/login";
        });
}
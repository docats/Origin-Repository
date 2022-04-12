// 導覽登入
let mebLogin = document.getElementById("mebLogin");
//導覽註冊
let menbRegister = document.getElementById("menbRegister");
//關閉視窗X
let loginClose = document.getElementById("login_close");
let regClose = document.getElementById("reg_close");

const mail_format = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let = window.location.pathname;
//註冊會員整個外框
let regWrap = document.getElementById("reg_wrap");
//登入會員整個外框
let loginWrap = document.getElementById("login_wrap");
//登入註冊連結註冊
let log = document.getElementById("log");
let reg = document.getElementById("reg");
//註冊關掉按鈕
regClose.addEventListener("click", function () {
    regWrap.style.display = "none";
    loginWrap.style.display = "none";
})
reg.addEventListener("click", function () {
    regWrap.style.display = "block";
    loginWrap.style.display = "none";
});
//登入關掉按鈕
loginClose.addEventListener("click", function () {
    loginWrap.style.display = "none";
    regWrap.style.display = "none";
})

log.addEventListener("click", function () {
    loginWrap.style.display = "block";
    regWrap.style.display = "none";
});

mebLogin.addEventListener("click", function () {
    loginWrap.style.display = "block";
});

menbRegister.addEventListener("click", function () {
    regWrap.style.display = "block";
});

//手機版

m_mebLogin.addEventListener("click", function () {
    loginWrap.style.display = "block";
});

m_menbRegister.addEventListener("click", function () {
    regWrap.style.display = "block";
});

let reg_btn = document.querySelector(".reg_btn"); //按鈕註冊
let signupbtn = document.querySelector(".signupbtn")//按鈕登入



//登入使用者帳戶 PATCH
signupbtn.addEventListener("click", function () {

    //如果帳號密碼打錯，出現重新輸入帳號密碼
    //如果帳號密碼都對，出現登入成功
    let ename = document.querySelectorAll(".email")[0].value;
    let pname = document.querySelectorAll(".psw")[0].value;
    let verify = document.querySelectorAll(".email")[0].pattern;
    let regSuccess=document.getElementById("reg_success") //登入成功
    let regFail=document.getElementById("reg_fail")//登入失敗
    let signBtnBox=document.getElementById("signBtnBox")//登入按鈕
    //如果帳號密碼都沒輸入，出現錯誤訊息
    fetch('/api/user', {
        body: JSON.stringify({ email: `${ename}`, psw: `${pname}` }),
        headers: { 'content-type': 'application/json' },
        method: 'PATCH',
    }).then((response) => {
        return response.json();
    })
        //這邊才是拿到真正的資料
        .then((datas) => {
            // console.log("datas:", datas.message);
            if (datas.error == true) {
                regFail.style.display="block";
                ename = document.querySelectorAll(".email")[0].value = "";
                pname = document.querySelectorAll(".psw")[0].value = "";
                setTimeout(function () { window.location.href = window.location.href; }, 2000)
                // loginFail.style.display="block"
                return
            } else if(datas.ok == true) {
                regSuccess.style.display="block";
                // signBtnBox.style.display="none";
                // ename.style.display="none";
                // pname.style.display="none";
                ename = document.querySelectorAll(".email")[0].value = "";
                pname = document.querySelectorAll(".psw")[0].value = "";
                setTimeout(get, 1000); 
            }
        })
    // window.location.href=window.location.href;

});

let emailRule = "/^\w+([\w\.\-]){1,63}\@\w+([\w\.\-])\.\w+([\w\.\-])$/";
//驗證信箱
function verifyEmail() {
    // 有空再寫
}


//註冊使用者資料 POST
reg_btn.addEventListener("click", function () {
    let vname = document.querySelectorAll(".name")[0].value;
    let ename = document.querySelectorAll(".email")[1].value;
    let pname = document.querySelectorAll(".psw")[1].value;
    let regFail = document.getElementById("regFail")//註冊失敗提示
    let inSuccess = document.getElementById("in_success");
    let inFail = document.getElementById("in_fail");
    let signBtnBox = document.getElementById("sign_btn_box");
    // 信箱驗證:符合信箱的格式(@前最多64字，@後的伺服器域名需要是以.來分開的格式)
    ename.placeholder = "/^\w+([\w\.\-]){1,63}\@\w+([\w\.\-])\.\w+([\w\.\-])$/";
    //信箱驗證:符合信箱的格式(@前最多64字，@後的伺服器域名需要是以.來分開的格式)

    fetch('/api/user', {
        body: JSON.stringify({ name: `${vname}`, email: `${ename}`, psw: `${pname}` }),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
    })
        .then((response) => {
            // console.log("reg:", response.json())
            return response.json();
        })
        .then((datas) => {
            // console.log("123:",datas)
            if (datas.error === true) {
                inFail.style.display = "block";
                setTimeout(function () { window.location.href = window.location.href; }, 3000)
            } else if (datas.ok === true)
                inSuccess.style.display = "block";
            setTimeout(function () { window.location.href = window.location.href; }, 3000)
        })
});

let logDone = document.getElementById("log_done");
let regSuccess=document.getElementById("reg_success") //登入成功
let regFail=document.getElementById("reg_fail")//登入失敗
const GETit = document.getElementById("GETit");
GETit.addEventListener("click", get, false);
//取得當前登入的使用者資訊 GET
function get() {
    console.log("會員專區")
    //當使用者登入後的狀態    
    fetch('/api/user', {
        // body: JSON.stringify({ data }),
        headers: { 'content-type': 'application/json' },
        method: 'GET',
    })
        .then((response) => {
            return response.json();
        })
        .then((datas) => {
            if (datas["data"] != null) {
                logDone.style.display = "none";
                GETit.style.display = "inline-block";
                mebout.style.display = "inline-block";
                loginWrap.style.display = "none";
                regSuccess.style.display="none";
                regFail.style.display="none";
            }
        })
    // window.location.href=window.location.href;
}

const mebout = document.getElementById("out");
mebout.addEventListener("click", outout, false);
//登出使用者帳戶(DELETE)
function outout() {
    console.log("會員登出")
    fetch('/api/user', {
        body: JSON.stringify({ email: `${ename}`, psw: `${pname}` }),
        headers: { 'content-type': 'application/json' },
        method: 'DELETE',
    })
        .then((response) => {
            // console.log("out:", response.json())
            return response.json();
        })
        .then((datas) => {
            // console.log("datas:", datas);
           
            mebout.style.display="none";
            logDone.style.display="inline-block";
            GETit.style.display="none";
            loginWrap.style.display="none";
            
            
        })
}

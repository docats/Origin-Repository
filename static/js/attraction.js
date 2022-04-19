let bookTrip = document.getElementById("bookTrip");//開始預訂行程按鈕
bookTrip.addEventListener("click", bookNow, false);
function bookNow() {
    let selectDate = document.getElementById("selectDate")//日期沒選擇警示框
    //抓輸入日期
    let orderDate = document.getElementById("orderDate").value;
    console.log("orderDate", orderDate);
    // 判斷是否有登入帳戶
    fetch('/api/user', {
        // body: JSON.stringify({ data }),
        headers: { 'content-type': 'application/json' },
        method: 'GET',
    })
        .then((response) => {
            return response.json();
        })
        .then((datas) => {

            if (datas["data"] == null) {
                reg_wrap.style.display = "block";
            }
            else if (orderDate == "") {
                selectDate.style.display = "block;"
                bookTrip.replace = '<input type="submit" value="開始預訂行程" class="order_this" id="bookTrip" disabled>'
                bookTrip.style = "backGround-color:#666;"
                alert("請選擇日期時間")
            }
            else if (orderDate != "") {
                bookTrip.style = "backGround-color:#448899;"
                window.location.href = '../booking';
            }

        })
}

//抓景點
let tipView = document.getElementById("tpi_view");
//選上半天
let firstHalfDay = document.getElementById("first_half_day").value;
//選下半天
let secHalfDay = document.getElementById("sec_half_day").value;
//導覽費用
let showFee = document.getElementById("show_fee")
//抓地址
let atrAddress = document.getElementById("atr_address");

//取得景點資訊訂購外框項目
const orderCon = document.getElementById("view_con");

// 取得景點介紹項目外框
const viedec = document.getElementById("view_dec_box");
let slides;
let data;
let list;
let str = ""
let pic;
let id = window.location.pathname; //window.location.pathname抓出當前page路徑
//使用fetch取得並展示特定景點資訊
fetch('/api/' + id) //id=app.py的attractionId
    .then(function (response) {
        //處理response
        return response.json();
    })
        //這邊才是拿到真正的資料
    .then(function (datas) {
        // console.log("datas:是api", datas);
        viewdata(datas)

    })

//用程式刻畫面
function viewdata(datas) {

    //當前景名
    let name = datas.data.name;
    // console.log("name:", name);
    //把景點名稱塞進去
    document.getElementById("tpi_view").append(name);

    //當前捷運
    let mrt = datas.data.mrt;
    // console.log("mrt:", mrt);
    //把捷運名稱塞進去
    document.getElementById("mrt").append(mrt);
    //當前類別
    let cat = datas.data.category;
    // console.log("cat:", cat);
    //把景點類別名稱塞進去
    document.getElementById("cat").append(cat);

    //建立景點描述
    let dec = datas.data.description;
    document.getElementById("atr_con").append(dec);

    //建立景點地址
    let address = datas.data.address;
    document.getElementById("atr_address").append(address);

    //建立交通方式
    let transport = datas.data.transport;
    document.getElementById("atr_traffic").append(transport);

    //選擇【上半天】的時候，導覽費用顯示為新台幣 2000 元，選擇下半天的時候，導覽費用顯示為新台幣 2500 元
    selectFee();

    //景點相片輪播
    data = datas.data.images.length;
    // console.log(data);
    pic = datas.data.images;
    // console.log(pic[0]);
    picShow(pic);


}

//設定輪播一開始的索引
let slideIndex = 1;
// picShow(slideIndex)
//function plusSlides() 當我點選下一頁
function plusSlides(pic) {
    picShow(slideIndex += pic);
}
//dot指向的目前頁面
function currentSlide(pic) {
    picShow(slideIndex = pic);
}
// function currentSlide() {
    
// }
let relBox = document.querySelector(".rel_box");
let relImg = document.querySelector(".rel_img");
let picRel=document.querySelector(".pic_rel");
// 點點的外框
let dotBox = document.querySelector(".dot_box");
//景點相片輪播
function picShow(pic) {
    let i;
    // let dots = document.getElementsByClassName("dot");
    
    //用程式把圖片跑出來
    for (i = 0; i < pic.length; i++) {
        let slides = document.createElement("div");
        slides.setAttribute("class", "pic_item");
        // console.log("slides:", slides)
        const newImage = document.createElement('img');
        newImage.setAttribute("src", `${pic[i]}`)
        // console.log("圖:", pic[i]);
        let test=orderCon.appendChild(relBox).appendChild(relImg).appendChild(picRel).appendChild(slides).appendChild(newImage);
        // console.log("test:",test)
        // 點點製造中
        let dots=document.createElement("span");
        dots.setAttribute("class","dot")
        // dots.setAttribute("onclick","currentSlide()");
        orderCon.appendChild(relBox).appendChild(relImg).appendChild(dotBox).appendChild(dots)
        
    }
    slides=document.getElementsByClassName("pic_item")
    dots=document.getElementsByClassName("dot")
    //按下右箭頭-下一頁循環(+1)
    if (pic > slides.length && pic > dots.length) {
        // console.log("n>:",n)
        slideIndex = 1;
        // console.log(slideIndex);
    }
    //按下左箭頭-下一頁循環(-1)
    if (pic < 1) {
        // console.log("n<:",n)
        slideIndex = slides.length
        // slideIndex--;
        // console.log(slideIndex);
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active"; //讓黑點動

}

//選擇【上半天】的時候，導覽費用顯示為新台幣 2000 元，選擇下半天的時候，導覽費用顯示為新台幣 2500 元
function selectFee() {
    //抓上半天的ID
    let first = document.getElementById("first_half_day");
    //抓下半天的ID
    let afternoon = document.getElementById("sec_half_day");
    //抓導覽費用的ID
    let showFee = document.getElementById("show_fee");
    //radio特性為單選，故將onclick()寫到選擇項目的HTML中，點誰金額就變
    if (first.checked == true) {
        showFee.innerHTML = "新台幣2000元";
    }
    if (afternoon.checked == true) {
        showFee.innerHTML = "新台幣2500元";
    }
}
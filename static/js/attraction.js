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
    .then(function (datas) {
        console.log("datas:是api", datas);
        viewdata(datas)

    })

//用程式刻畫面
function viewdata(datas) {

    //當前景名
    let name = datas.data.name;
    console.log("name:", name);
    //把景點名稱塞進去
    document.getElementById("tpi_view").append(name);

    //當前捷運
    let mrt = datas.data.mrt;
    console.log("mrt:", mrt);
    //把捷運名稱塞進去
    document.getElementById("mrt").append(mrt);
    //當前類別
    let cat = datas.data.category;
    console.log("cat:", cat);
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
    console.log(data);
    pic = datas.data.images;
    console.log(pic[0]);
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
        console.log("slides:", slides)
        const newImage = document.createElement('img');
        newImage.setAttribute("src", `${pic[i]}`)
        console.log("圖:", pic[i]);
        let test=orderCon.appendChild(relBox).appendChild(relImg).appendChild(picRel).appendChild(slides).appendChild(newImage);
        console.log("test:",test)
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
        console.log(slideIndex);
    }
    //按下左箭頭-下一頁循環(-1)
    if (pic < 1) {
        // console.log("n<:",n)
        slideIndex = slides.length
        // slideIndex--;
        console.log(slideIndex);
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex - 1].style.display = "block";
    dots[slideIndex - 1].className += " active"; //讓黑點動
    
    
    



    //  //抓出全部圖片
    //  data=datas.data.images;
    //  console.log("data:",data);
    //  //用for迴圈把圖片全部抓出來
    //  for(i=0;i<data.length;i++){
    //      //在每張圖片裡加一個div，建立外框pic_item
    //      let picItem = document.createElement("div");
    //      picItem.setAttribute("class","pic_item");

    //     //  建立一個img元素，並放入newImage物件，之後設定圖片路徑
    //    const newImage =document.createElement('img');
    //    newImage.setAttribute('src',`${data[i]}`)
    //     //讓圖片一張一張抓出來
    //     // let showpic=relImg.appendChild(slides).appendChild(picItem).appendChild(newImage);
    //     // console.log("印整列showpic:",showpic);

    // pic=document.getElementsByClassName("pic_item"); //getElementsByClassName要用此法才能抓到長度
    //     console.log("型態pic:",typeof(pic)) //型態是物件
    //     console.log("pic:",pic);
    //  }
    //  console.log("pic在for迴圈外:",pic.length) //pic的長度
    //  if(data.length >= pic.length){
    //     slideIndex=1;
    //     console.log("pic.length:123", slideIndex) //這邊開始不會跑了
    //  }
    //  if(data.length<1){
    //     slideIndex=pic.length;
    //  }

    //  for(i=0;i<pic.length;i++){
    //     pic[i].style.display="none";
    //  }

    //  //抓圖片上的換頁框
    // let dotBox=document.getElementsByClassName("dot_box");
    // let dots=document.createElement("span");
    //     dots.setAttribute("class","dot");
    //     console.log("dots:",dots);

    // // console.log("dots預設長度:",dots.length);
    // // let dd=document.getElementsByClassName("dot");
    // // console.log("dd:",dd);
    //     //因為dots.length是undefined所以跑不出來點點
    //     if(data=0){
    //         let test=relImg.appendChild(dotBox).appendChild(dots);
    //         console.log("test:",test);
    //         for(i=0;i<dots.length;i++){
    //             // dotBox.appendChild(dots[i]);
    //             let dd=document.getElementsByClassName("dot");
    //             console.log("dd[i]:",dd[i]);
    //             dots[i].className = dots[i].className.replace(" active", "");
    //          }
    //     }


    //  pic[slideIndex-1].style.display="block";
    // //  dots[slideIndex-1].className +=" active";

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
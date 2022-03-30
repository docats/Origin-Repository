//取得景點資訊訂購外框項目
const orderCon = document.getElementById("view_con");

// 取得景點介紹項目外框
const viedec = document.getElementById("view_dec_box");
let list;
let str=""
let pic;
let id = window.location.pathname; //window.location.pathname抓出當前page路徑
//使用fetch取得並展示特定景點資訊
fetch('/api/'+id) //id=app.py的attractionId
.then(function(response){
    //處理response
    return response.json();
})
.then(function(datas){
    console.log("datas:",datas);
    viewdata(datas)
   
})

//用程式刻畫面
function viewdata(datas){

    //當前景名
    let name=datas.data.name;
    console.log("name:",name);
    //把景點名稱塞進去
    document.getElementById("tpi_view").append(name);
    
    //當前捷運
    let mrt = datas.data.mrt;
    console.log("mrt:",mrt);
    //把捷運名稱塞進去
    document.getElementById("mrt").append(mrt);
    //當前類別
    let cat = datas.data.category;
    console.log("cat:",cat);
     //把景點類別名稱塞進去
     document.getElementById("cat").append(cat);
  
     //建立景點描述
     let dec = datas.data.description;
     document.getElementById("atr_con").append(dec);
   
     //建立景點地址
     let address=datas.data.address;
     document.getElementById("atr_address").append(address);

     //建立交通方式
     let transport=datas.data.transport;
     document.getElementById("atr_traffic").append(transport);
    
     //選擇【上半天】的時候，導覽費用顯示為新台幣 2000 元，選擇下半天的時候，導覽費用顯示為新台幣 2500 元
     selectFee();

     //景點相片輪播
     picShow(datas);
    
}


//選擇【上半天】的時候，導覽費用顯示為新台幣 2000 元，選擇下半天的時候，導覽費用顯示為新台幣 2500 元
function selectFee(){
    //抓上半天的ID
    let first=document.getElementById("first_half_day");
    //抓下半天的ID
    let afternoon=document.getElementById("sec_half_day");
    //抓導覽費用的ID
    let showFee = document.getElementById("show_fee");
    //radio特性為單選，故將onclick()寫到選擇項目的HTML中，點誰金額就變
    if(first.checked==true){
        showFee.innerHTML="新台幣2000元";
    }
    if (afternoon.checked==true){
        showFee.innerHTML="新台幣2500元";
    }
}

let slideIndex=1;
//景點相片輪播
function picShow(datas){
    //抓圖片的外框框
    let slides=document.querySelector(".pic_rel");
    console.log("slides.length:",slides.length)
    //抓圖片上的換頁點點
    let dots=document.querySelector("dot");
     //抓出全部圖片
     let data=datas.data.images;
     console.log("data:",data);
     
     
    if(data.length>slideIndex){
        console.log("h")
    }
    let i
     //用for迴圈把圖片全部抓出來
     for( i=0;i<data.length;i++){
        //  console.log("pic:",data[i])
       const newImage =document.createElement('img');
       newImage.setAttribute('src',`${data[i]}`)
        //我想讓圖片一張一張抓出來
       slides.appendChild(newImage);
     }
     
     
    

     //dot的增減
    //  for(let k=0;k<dots.length;k++){
    //      dots[k].className=dots[k].className.replace("active","");
    //  }
     
}
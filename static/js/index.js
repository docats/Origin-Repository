// 取得景點頁面外框
const content = document.querySelector(".my_box");

//初始化
let page = 0;
const footer = document.getElementById("footer");
const search = document.getElementById("searchBtn");
// const loadingIcon = document.getElementsByClassName("loading-icon")[0];
let next;
let words;
let src;


//使用fetch 讓景點資料出來
fetch('/api/attractions?page=0', { method: 'get' })
  .then(function (response) {
    //處理response
    if (!response.ok) throw new Error(response.statusText)
    return response.json();
  })
  .then(function (datas) {
    console.log("123:", datas);
    // console.log("景點名稱測試", datas.data[0].name)
    next = datas.nextPage
    console.log("一開抓API景點的下一頁:", next);
    tpiView(datas);

  }).catch(function (err) {

    //Error
  })


// 景點頁面
function tpiView(datas) {
  let data = datas.data;

  console.log("你是24筆嗎?",data)

  for (site of data) {
    //圖片
    let pic = site["images"][0];
    //景名
    let name = site["name"];
    //捷運
    let mrt = site["mrt"];
    //類別
    let cat = site["category"];

    const box = document.createElement("a");
    box.href = "/attraction/" + site["id"];
    box.className = "box";
    box.id = "box" + site["id"];
    box.setAttribute("onclick", "target(this.id)");
    //建立外框box_item
    let box_item = document.createElement("div");
    box_item.setAttribute("class", "box_item");
    // 建立圖片標籤
    let pic_img = document.createElement("img");
    pic_img.setAttribute("class", "pic_img");
    //建立文字標籤-台北景點名稱
    let tpi_view = document.createElement("h2");
    tpi_view.setAttribute("class", "tpi_view");
    view_name = document.createTextNode(name);
    //建立捷運站標籤
    let site_name = document.createElement("span");
    site_name.setAttribute("class", "site_name");
    mrt_name = document.createTextNode(mrt);
    //建立景點類別標籤
    let site_class = document.createElement("span");
    site_class.setAttribute("class", "site_class");
    cat_name = document.createTextNode(cat);
    //建立文字資訊外框
    let point = document.createElement("div");
    point.setAttribute("class", "point");
    // console.log(pic_img.src = pic); //跑圖片
    //用JS建立網頁，把資料塞進去。
    pic_img.src = pic;
    content.appendChild(box).appendChild(box_item).appendChild(pic_img);
    content.appendChild(box).appendChild(box_item).appendChild(tpi_view);
    content.appendChild(box).appendChild(box_item).appendChild(tpi_view).appendChild(view_name);
    content.appendChild(box).appendChild(box_item).appendChild(point).appendChild(site_name).appendChild(mrt_name);
    content.appendChild(box).appendChild(box_item).appendChild(point).appendChild(site_class).appendChild(cat_name);
  }
}



//window scroll 記得優化
window.addEventListener("scroll", () => {

  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
    console.log("scroll test 我有轉動");
    //
    console.log("滾動next下一頁:", next);
    // next = datas.nextPage;
    if (next != null) {                      
      if (next > 0) {
        let src;
        console.log("next?:",next)
        
        src='/api/attractions?page=' + next
        console.log("9999:",src);
        if (words == undefined) {
          fetch(src)
            .then(function (response) { 
              //處理response
              if (!response.ok) throw new Error(response.statusText)
              return response.json();
            })
            .then(function (datas) {
              // next = 0;
              next = datas.nextPage;
              console.log("text:",next);
              let data = datas.data;
              console.log("一開抓API景點的下一頁:", next);
              tpiView(datas);
              console.log("你是24筆嗎?",data)
            })
        } else {
          fetch('/api/attractions?page=' + next + "&keyword=" + words)
            .then(function (response) {
              //處理response
              if (!response.ok) throw new Error(response.statusText)
              return response.json();
            })
            .then(function (datas) {
              // next = 0;
              next = datas.nextPage;
              console.log("一開抓API景點的下一頁:", next);
              tpiView(datas);
            })
        }

      }
    }
  }
});

//搜尋關鍵字跟下一頁 moreSearch()
function moreSearch() {
  // next = 0;
  document.getElementById("mains").innerHTML = "";
  words = document.getElementById("SearchKey").value;
  fetch("/api/attractions?page=" + next + "&keyword=" + words)
    .then(function (response) {
      return response.json();
    })
    .then(function (datas) {
      if (datas.error == true) {
        document.getElementById("mains").innerHTML = "";
        document.getElementById("mains").innerHTML = "查無資料";
      } else {
        next = datas.nextPage;
        let data = datas;
        console.log("moreSearch_data:", data); //可跑出搜尋資料
        tpiView(datas);
      }
    })
}

// 點擊即可以顯示目標id
// target = (id) => {
//   console.log(id);
// }




// 預定行程GET狀態-使用者登入才可以預訂
fetch('/api/booking', {
    headers: { 'content-type': 'application/json' },
    method: 'GET',
}).then((response) => {
    return response.json();
}).then((datas) => {
    //這邊才是拿到真正的資料

})

fetch('/api/user', {
    // body: JSON.stringify({ data }),
    headers: { 'content-type': 'application/json' },
    method: 'GET',
})
    .then((response) => {
        return response.json();
    })
    .then((datas) => {

        bookView(datas)
        console.log("555:", datas);

    })

//使用fetch取得並展示特定景點資訊
fetch('/api/' + id) //id=app.py的attractionId
    .then(function (response) {
        //處理response
        return response.json();
    })
    //這邊才是拿到真正的資料
    .then(function (datas) {
        console.log("datas:是api", datas);


    })



//使用者畫面
function bookView(datas) {
    //使用者姓名
    let name = datas.data.name;
    console.log("name:", name);
    let bookName = document.getElementById("bookName");
    bookName.innerHTML = name;
   
}

//景點畫面
function viewSite(){
    let address = datas.data.address;
    document.getElementById
}


// 建立新的預定行程POST狀態
fetch('/api/booking', {
    body: JSON.stringify({}),
    headers: { 'content-type': 'application/json' },
    method: 'POST',
}).then((response) => {
    return response.json();
}).then((datas) => {
    //這邊才是拿到真正的資料

})

// 刪除目前的預定行程DELETE狀態
fetch('/api/booking', {
    headers: { 'content-type': 'application/json' },
    method: 'DELETE',
}).then((response) => {
    return response.json();
}).then((datas) => {
    //這邊才是拿到真正的資料

})
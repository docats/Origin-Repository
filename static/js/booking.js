
// 預定行程GET狀態
fetch('/api/booking',{
    headers: { 'content-type': 'application/json' },
    method: 'GET',
}).then((response)=> {
    return response.json();
}).then((datas)=>{
     //這邊才是拿到真正的資料
    console.log(datas);
})


// 建立新的預定行程POST狀態
fetch('/api/booking',{
    body:JSON.stringify({ }),
    headers: { 'content-type': 'application/json' },
    method: 'POST',
}).then((response)=>{
    return response.json();
}).then((datas)=>{
    //這邊才是拿到真正的資料

})

// 刪除目前的預定行程DELETE狀態
fetch('/api/booking',{
    headers: { 'content-type': 'application/json' },
    method: 'DELETE',
}).then((response)=>{
    return response.json();
}).then((datas)=>{
    //這邊才是拿到真正的資料

})
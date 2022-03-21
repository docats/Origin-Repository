
fetch('/api/attractions?page=0',{method:'get'})
  .then(function(response) {
    //ok 代表狀態碼在範圍200-299
    if (!response.ok) throw new Error(response.statusText)
    //處理response
     response.json();
    // return response.json();
  })
  .then(function(data) {
    const productList=document.querySelector('.my_box')
    data.forEach(function(item){
      productList.innerHTML +=`<h1>${item.name}</h1>`

    })
  }).catch(function(err){
    //Error
    console.log('Request Failed',err)
  })

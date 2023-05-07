var xhr = new XMLHttpRequest();
xhr.open('GET', `https://www.goal.com/en/fixtures/${date.toISOString().split('T')[0]}`, true);
xhr.responseType = "document";

xhr.onload = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
        var res = xhr.responseXML.querySelector(".competition_name__YEMb_")
        console.log(res)
    }
}

xhr.onerror = function(){
    console.log('error');
}
xhr.send();
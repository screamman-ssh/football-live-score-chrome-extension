// chrome.runtime.onInstalled.addListener(() => {
//   chrome.action.setBadgeText({
//     text: "!",
//   });

// });

//fetch data from scraper api
const fecthData = async () => {
  var data = await fetch('http://localhost:4231/get-data').then((res) => res.json());
  const preload = { data: data, timestamp: Date.now() }
  chrome.storage.local.set({ "data": preload }).then(() => {
    console.log("Value is set to storage");
  });
  return preload;
}

//handle event message from popup.js
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.data === "get") {
      chrome.storage.local.get(["data"]).then( data =>{ 
        sendResponse(data)
      })
    }
    else if(request.data === "refetch"){  
      //annonymous function for refetch data
      // (async () => {
      //   const data = await fecthData();
      //   console.log(new Date(data.timestamp))
      //   sendResponse(data)
      // })();
      fecthData().then(res => {
        console.log("refetch")
        sendResponse(res)
      })
    }
    return true
  }
);
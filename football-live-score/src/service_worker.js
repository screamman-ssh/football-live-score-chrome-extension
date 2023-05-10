// chrome.runtime.onInstalled.addListener(() => {
//   chrome.action.setBadgeText({
//     text: "!",
//   });

// });

//fetch data from scraper api
const fecthData = async () => {
  var data = await fetch('http://localhost:5000/get-data',{
    method: "POST",
    body: JSON.stringify({
      date: new Date()
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then((res) => res.json());
  const preload = { data: data, timestamp: Date.now() }
  chrome.storage.local.set({ "data": preload }).then(() => {
    console.log("Value is set to storage");
  });
  return preload;
}

chrome.runtime.onStartup.addListener(function () {
  //fetch data when browser has been open
  fecthData().then(res => {
    if (res) {
      console.log("pre-fetch");
      chrome.action.setBadgeText({ text: '...' });
      chrome.action.setBadgeBackgroundColor({ color: '#FF4F4F', })
    }
  })
})

//handle event message from popup.js
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    // console.log(request)
    if (request.popup == "open") {
      chrome.action.setBadgeText({ text: '' });
    }
    else if (request.data === "get") {
      chrome.storage.local.get(["data"]).then(data => {
        sendResponse(data)
      })
    }
    else if (request.data === "refetch") {
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
    else if (request.data == "fatch-date") {
      console.log(request.date);
      sendResponse("Recieve");
    }
    return true
  }
);
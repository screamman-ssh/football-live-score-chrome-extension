// chrome.runtime.onInstalled.addListener(() => {
//   chrome.action.setBadgeText({
//     text: "!",
//   });

// });

//fetch data from scraper api
const fecthData = async (targetDate) => {
  var data = await fetch('http://localhost:4231/get-data', {
    method: "POST",
    body: JSON.stringify({
      date: targetDate
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then((res) => res.json());
  return data;
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
      var curDate = new Date();
      curDate = curDate.toISOString().split("T")[0];
      fecthData(curDate).then(res => {
        const preload = { data: res, timestamp: Date.now() }
        chrome.storage.local.set({ "data": preload }).then(() => {
          console.log("Value is set to storage");
        });
        sendResponse(preload)
      })
    }
    else if (request.data == "fatch-date") {
      // console.log(request.date);
      var targetDate = request.date;
      chrome.storage.session.get(null, function (items) {
        var allKeys = Object.keys(items);
        // console.log(allKeys);
        //check if data has been load before, prevent wasting time load stored data
        if (allKeys.includes(targetDate)) {
          chrome.storage.session.get(targetDate).then(res => {
            sendResponse(res)
          })
        }
        else {
          console.log("There no data");
          fecthData(targetDate).then(res => {
            // console.log(res)
            var preload = {};                   //create object to each date as a preload
            preload[targetDate] = res;
            chrome.storage.session.set(preload).then(() => {
              console.log(targetDate + " data is set to storage")
            })
            sendResponse(preload)
          })
        }
      });
    }
    return true
  }
);
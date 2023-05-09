// chrome.runtime.onInstalled.addListener(() => {
//   chrome.action.setBadgeText({
//     text: "!",
//   });

// });

const fecthData = async () => {
  var data = await fetch('http://localhost:4231/get-data').then((res) => res.json());
  const preload = { data: data, timestamp: Date.now() }
  // console.log(preload.timestamp)
  chrome.storage.local.set({ "data": preload }).then(() => {
    console.log("Value is set to storage");
  });
  return data;
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.data === "get") {
      chrome.storage.local.get(["data"]).then( data =>{ 
        sendResponse(data)
      })
    }
    else if(request.data === "refetch"){  
      //Annonymous Function for refetch data
      (async () => {
        await fecthData();
      })();
      chrome.storage.local.get(["data"]).then( data =>{ 
        // console.log(new Date(data.data.timestamp))
        sendResponse(data)
      })
    }
    return true
  }
);
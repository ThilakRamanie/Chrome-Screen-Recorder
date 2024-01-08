chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && /^http/.test(tab.url)) {
    chrome.scripting
      .executeScript({
        target: { tabId },
        files: ["./content.js"],
      })
      .then(() => {
        console.log("Injected the content script");
      })
      .catch((e) => console.log(e, "error in background"));
  }
});

// chrome.runtime.onMessage.addListener({request, sender, sendResponse}=> {

// })

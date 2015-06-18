declare var $, chrome;
/*
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    try {    
    console.log(changeInfo);
        if (tab.url.match(Resource.Regex.Youtube) == null) return;
        chrome.tabs.sendMessage(tabId, { action: "createButton" }, function (response) { });
    } catch (e) { alert(e) }
});*/

var port = chrome.runtime.connect();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {//等待接受建立按鈕指令
    if (!message.action || message.action != "downloadFile") return;
    chrome.downloads.download({
        url: message.url,
        filename: message.filename // Optional
    });
})
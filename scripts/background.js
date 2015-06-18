/*
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
try {
console.log(changeInfo);
if (tab.url.match(Resource.Regex.Youtube) == null) return;
chrome.tabs.sendMessage(tabId, { action: "createButton" }, function (response) { });
} catch (e) { alert(e) }
});*/
var port = chrome.runtime.connect();
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (!message.action || message.action != "downloadFile")
        return;
    chrome.downloads.download({
        url: message.url,
        filename: message.filename
    });
});
//# sourceMappingURL=background.js.map

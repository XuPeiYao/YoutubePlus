/*棄用
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    console.log(changeInfo);
    if (tab.status != "complete") return;
    if (!tab.url.match(Resource.Regex.Youtube)) return;
    if (!changeInfo.title) return;
    chrome.tabs.sendMessage(tabId, { action: "createButton" }, function (response) { });
    
});
*/
var port = chrome.runtime.connect();
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!message.action || message.action != "downloadFile")
        return;
    chrome.downloads.download({
        url: message.url,
        filename: message.filename // Optional
    });
});
//# sourceMappingURL=background.js.map
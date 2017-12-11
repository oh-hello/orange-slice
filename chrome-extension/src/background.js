// Setting a toolbar badge text
var roe = chrome.runtime && chrome.runtime.sendMessage ? 'runtime' : 'extension';
chrome[roe].onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log(request);
        chrome.browserAction.setBadgeText({text: request.grade, tabId: sender.tab.id});

    }
);

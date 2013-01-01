chrome.browserAction.onClicked.addListener(function(){
	var path = chrome.extension.getURL("index.html");
	window.open(path);
});
function oauth($scope, $http){
	var oauth = ChromeExOAuth.initBackgroundPage({
		'request_url': "POST http://www.tumblr.com/oauth/request_token",
		'authorize_url': "http://www.tumblr.com/oauth/authorize",
		'access_url': "POST http://www.tumblr.com/oauth/access_token",
		'consumer_key': "sFuOrQsJF7OkxNhxh0A3gEb2AgCVju4lLzku7E1QkARqfxBWoV",
		'consumer_secret': "IZ6BYPDVcW1JglzY9UomxP1GJyodONN2cX8Ref6YYSV3qHm4qh",
		'app_name': "snail"
	});

	oauth.authorize(function() {
		alert();
	});

	chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
		alert();
	});
}
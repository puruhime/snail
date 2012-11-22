function oauth($scope, $http){
	if(location.search == ""){
		var message = {
			method: "POST",
			action: "http://www.tumblr.com/oauth/request_token",
			parameters: {
				oauth_signature_method: "HMAC-SHA1",
				oauth_consumer_key: "sFuOrQsJF7OkxNhxh0A3gEb2AgCVju4lLzku7E1QkARqfxBWoV"
			}
		};
		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, {
			consumerSecret: "IZ6BYPDVcW1JglzY9UomxP1GJyodONN2cX8Ref6YYSV3qHm4qh",
			tokenSecret: ''
		});
		debugger;
		$http({
			method: message.method,
			url: OAuth.addToURL(message.action, message.parameters)
		}).success(function(d){
			debugger;
			const requestToken = d.match(/oauth_token=([^&]*)/)[1];
			const requestTokenSecret = d.match(/oauth_token_secret=([^&]*)/)[1];

			localStorage["requestToken"] = requestToken;
			localStorage["requestTokenSecret"] = requestTokenSecret;

			open("http://www.tumblr.com/oauth/authorize?oauth_token=" + requestToken);
		}).error(function(d){
			debugger;
		});
	}else{
		debugger;
		var accessor = {
			consumerSecret: this.consumer.consumerSecret,
			tokenSecret: localStorage["requestTokenSecret"]
		};

		var message = {
			method: "GET",
			action: "http://www.tumblr.com/oauth/access_token",
			parameters: {
				oauth_signature_method: "HMAC-SHA1",
				oauth_consumer_key: "sFuOrQsJF7OkxNhxh0A3gEb2AgCVju4lLzku7E1QkARqfxBWoV",
				oauth_token: localStorage["requestToken"],
				oauth_verifier: pin
			}
		};
		OAuth.setTimestampAndNonce(message);
		OAuth.SignatureMethod.sign(message, accessor);
		var target = OAuth.addToURL(message.action, message.parameters);
		var options = {
			method: message.method,
			url: target
		};
		$http(options).success(function(d){
			debugger;
		});
	}
}
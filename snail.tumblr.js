if(typeof snail == "undefined") const snail = {};

snail.tumblr = {};


snail.tumblr.init = function($http){
	if("accessToken" in localStorage) return;

	if(location.search == ""){
		new function(){
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
			$http({
				method: message.method,
				url: OAuth.addToURL(message.action, message.parameters)
			}).success(function(d){
					const requestToken = d.match(/oauth_token=([^&]*)/)[1];
					const requestTokenSecret = d.match(/oauth_token_secret=([^&]*)/)[1];

					localStorage["requestToken"] = requestToken;
					localStorage["requestTokenSecret"] = requestTokenSecret;

					open("http://www.tumblr.com/oauth/authorize?oauth_token=" + requestToken);
				});
		};
	}else{
		new function(){
			var accessor = {
				consumerSecret: "IZ6BYPDVcW1JglzY9UomxP1GJyodONN2cX8Ref6YYSV3qHm4qh",
				tokenSecret: localStorage["requestTokenSecret"]
			};

			var message = {
				method: "GET",
				action: "http://www.tumblr.com/oauth/access_token",
				parameters: {
					oauth_signature_method: "HMAC-SHA1",
					oauth_consumer_key: "sFuOrQsJF7OkxNhxh0A3gEb2AgCVju4lLzku7E1QkARqfxBWoV",
					oauth_token: localStorage["requestToken"],
					oauth_verifier: location.search.match(/oauth_verifier=([^?&]*)/)[1]
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
				localStorage.clear();
				localStorage["accessToken"] = d.match(/oauth_token=([^?&]*)/)[1];
				localStorage["accessTokenSecret"] = d.match(/oauth_token_secret=([^?&]*)/)[1];
			});
		};
	}
}



snail.tumblr.api = function(args){
	const url = args.url
	const success = args.success;
	const method = "method" in args ? args.method : "GET";

	var message = {
		method: method,
		action: url,
		parameters: {
			oauth_signature_method: "HMAC-SHA1",
			oauth_consumer_key: "sFuOrQsJF7OkxNhxh0A3gEb2AgCVju4lLzku7E1QkARqfxBWoV",
			oauth_token: localStorage["accessToken"]
		}
	};

	"params" in args && Object.keys(args.params).forEach(function(key){
		message.parameters[key] = args.params[key];
	});

	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, {
		consumerSecret: "IZ6BYPDVcW1JglzY9UomxP1GJyodONN2cX8Ref6YYSV3qHm4qh",
		tokenSecret: localStorage["accessTokenSecret"]
	});

	$.ajax({
		type:message.method,
		url:OAuth.addToURL(message.action, message.parameters),
		success:success
	})
};
snail.tumblr.user = {};
snail.tumblr.user.dashboard = function(success){
	snail.tumblr.api({
		url:"http://api.tumblr.com/v2/user/dashboard",
		success:success
	});
};
snail.tumblr.user.info = function(success){
	snail.tumblr.api({
		url:"http://api.tumblr.com/v2/user/info",
		success:success
	});
};
snail.tumblr.blog = {};
snail.tumblr.blog.post = {};
snail.tumblr.blog.post.reblog = function(args){
	if("userName" in localStorage == false){
		snail.tumblr.user.info(function(d){
			localStorage["userName"] = d.response.user.name;
			arguments.callee(args);
		});
	}

	snail.tumblr.api({
		url:"http://api.tumblr.com/v2/blog/" + localStorage["userName"] + "/post/reblog",
		method: "POST",
		params:{
			id: args.id,
			reblog_key: args.reblogKey
		}
	});
};
function oauth($scope, $http){
	snail.tumblr.init($http);
}

function post($scope, $http){
	$scope.posts = [];

	snail.tumblr.user.dashboard(function(d){
		$scope.posts.push.apply($scope.posts, d.response.posts);
		$scope.posts[0].isShow = true;
	}, $http);
}





$(function(){
	const KEY_J = 74;

	$(document).keyup(function(e){
		if(e.keyCode == KEY_J){
			alert();
		}
	});
});
function oauth($scope, $http){
	snail.tumblr.init($http);
}

function post($scope, $http){
	$scope.posts = [];

	snail.tumblr.user.dashboard(function(d){
		$scope.posts.push.apply($scope.posts, d.response.posts);
		$scope.posts[0].isShow = true;
		$scope.$apply();
	});

	new function appendKeyEventListener(){
		const KEYS = {
			74:{//j
				keyup:function($scope){
					$scope.posts[index].isShow = false;

					index++;

					if(index >= $scope.posts.length){
						snail.tumblr.user.dashboard(function(d){
							$scope.posts.push.apply($scope.posts, d.response.posts);
							$scope.posts[index].isShow = true;
							$scope.$apply();
						}, index);

						return;
					}

					//imageが横長だった場合
					window.innerWidth

					$scope.posts[index].isShow = true;
				}
			},
			75:{//k
				keyup:function($scope){
					$scope.posts[index].isShow = false;

					index--;

					if(index <= 0){
						index = 0;
					}

					$scope.posts[index].isShow = true;
				}
			},
			84:{//t
				keyup:function(){
					snail.tumblr.blog.post.reblog($scope.posts[index]);
				}
			}
		}

		var index = 0;

		$(document).keyup(function(e){
			if(e.keyCode in KEYS == false) return;

			KEYS[e.keyCode].keyup($scope);
			$(document).scrollTop(0);


			$scope.$apply();
		});
	}
}
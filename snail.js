function oauth($scope, $http){
	snail.tumblr.init($http);
}

function post($scope, $http){
	$scope.posts = [];

	snail.tumblr.user.dashboard(function(d){
		$scope.posts.push.apply($scope.posts, d.response.posts);
		$scope.posts[0].isShow = true;
	}, $http);

	new function appendKeyEventListener(){
		const KEYS = {
			74:{//j
				keyup:function($scope){
					index++;

					if(index >= $scope.posts.length){
						index = index - 1;
					}

					$scope.posts[index].isShow = true;
				}
			},
			75:{//k
				keyup:function($scope){
					index--;

					if(index <= 0){
						index = 0;
					}

					$scope.posts[index].isShow = true;
				}
			},
			84:{//t
				keyup:function(){

				}
			}
		}

		var index = 0;

		$(document).keyup(function(e){
			$scope.posts[index].isShow = false;
			e.keyCode in KEYS && KEYS[e.keyCode].keyup($scope);
			$scope.$apply();
		});
	}
}
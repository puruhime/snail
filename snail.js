function oauth($scope, $http){
	snail.tumblr.init($http);
}

function post($scope, $http){
	$scope.posts = [];

	snail.tumblr.user.dashboard({
		success:function(d){
			$scope.posts.push.apply($scope.posts, d.response.posts);
			$scope.posts[0].isShow = true;
			$scope.$apply();
		}
	});

	new function appendKeyEventListener(){
		const KEYS = {
			74:{//j
				keyup:function($scope){
					//ロード中だからはじく
					if("isShow" in $scope.posts[index] == false) return;

					const miniLog = angular.element($("#miniLog")).scope();

					$scope.posts[index].isShow = false;

					index++;

					if(index >= $scope.posts.length && !$scope.isLoad){
						miniLog.addLog("loading...");

						$scope.isLoad = true;

						snail.tumblr.user.dashboard({
							success:function(d){
								$scope.posts.push.apply($scope.posts, d.response.posts);
								$scope.posts[index].isShow = true;
								$scope.$apply();
								$scope.isLoad = false;
							},
							offset:index
						});

						return;
					}

					//imageが横長だった場合
					if("photos" in $scope.posts[index]){
						$("<img/>")
							.attr(
								"src",
								$scope.posts[index].photos[0].original_size.url
							)
							.load(function(){
								if($(this).width() >= $(window).width()){
									$scope.posts[index].isImageMode = "width";
									$scope.$apply();
								}
							});
					}

					$scope.posts[index].isShow = true;

					miniLog.addLog(index + "meters");
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
				keyup:function($scope){
					//ロード中だからはじく
					if("isShow" in $scope.posts[index] == false) return;

					const miniLog = angular.element($("#miniLog")).scope();

					KEYS[74].keyup($scope);
					$scope.$apply();
					miniLog.addLog("reblog...");

					//まずjキーの動作を行うため、indexが+1される。
					//そのため、reblogする時はindexを-1する。
					var post = $scope.posts[index - 1];

					snail.tumblr.blog.post.reblog(post,{
						success:function(){
							miniLog.addLog("post success!");
							$scope.$apply();
						}
					});

					snail.tumblr.extra.countQueue(function(count){
						$("title").text(count + ":queue, snail");
					});
				}
			},
			82:{//r
				keyup:function($scope){
					const miniLog = angular.element($("#miniLog")).scope();

					snail.tumblr.user.like($scope.posts[index], {
						success:function(){
							miniLog.addLog("like success!");
						}
					});

					miniLog.addLog("like...");
				}
			}
		}

		var index = 0;

		$(document).keyup(function(e){
			if(e.keyCode in KEYS == false) {
				return;
			}

			KEYS[e.keyCode].keyup($scope);
			$(document).scrollTop(0);

			$scope.$apply();
		});
	}
}

function miniLog($scope){
	const DELETE_TIME = 2500;

	$scope.logs = [];
	var isShowing = false;


	$scope.addLog = function(log){
		$scope.logs.push(log);

		if(isShowing == true) return;

		setTimeout(function(){
			$scope.logs.shift();
			$scope.$apply();

			if($scope.logs.length){
				setTimeout(arguments.callee, DELETE_TIME);
			}else{
				isShowing = false;
			}
		}, DELETE_TIME);

		isShowing = true;
	};
}

//たまに_blankを持ってないaタグをtumblr側が返す事があるので、その対策。
//また、これがある限り全てのリンクは新しいタブに移動する事になるため、target指定いらずになる
$("a").live("click", function(){
	window.open(this.href, "_blank");
	return false;
});
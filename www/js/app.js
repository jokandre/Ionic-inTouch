(function () {
	var db = null;
	var app = angular.module('inTouch', ['ionic', 'angularMoment', 'ngCordova']);
	app.run(function ($ionicPlatform, $cordovaSQLite) {
		$ionicPlatform.ready(function () {
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}
			db = $cordovaSQLite.openDB({
				name: 'app.db',
				location: 'default'
			});
			$cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
		});
	});

	app.config(function ($stateProvider, $urlRouterProvider) {

		$stateProvider.state('friendList', {
			url: '/friendList',
			templateUrl: 'templates/friendList.html',
			controller: 'FriendListController'
		});
		$stateProvider.state('friendDetail', {
			url: '/friendDetail/:friendId',
			templateUrl: 'templates/friendDetail.html',
			controller: 'DetailController'
		});
		$stateProvider.state('edit', {
			url: '/edit/',
			params: {
				friendId: null
			},
			templateUrl: 'templates/edit.html',
			controller: 'EditController'
		});
		$urlRouterProvider.otherwise('/friendList');
	});

	app.controller('FriendListController', function ($scope, $state, $cordovaSQLite, friendListService, avatarService, $ionicModal) {
		$scope.listCanSwipe = true;
		$scope.friendList = friendListService.getSortedList();
		$scope.avatar = angular.copy(avatarService.getRandomAvatar());
		$scope.newFriend = {
			name: '',
			nickname: '',
			avatar: ''
		};


		$scope.updateFriend = function (friend) {
			// friend.lastcontacted = moment();
			// friendListService.updateFriend(friend);
			// $scope.friendList = angular.copy(friendListService.getSortedList());
			friend.lastcontacted = moment();
			//friendListService.updateFriend(friend);
			$scope.friendList = friendListService.getSortedList();
			console.log('updated');
		};
		$scope.deleteFriend = function (friendId) {
			friendListService.deleteFriend(friendId);
		};

		$ionicModal.fromTemplateUrl('templates/addFriend.html', {
			scope: $scope
		}).then(function (modal) {
			$scope.modal = modal;
		});
		$scope.changeAvatar = function (avatarId) {
			console.log('changeAvatar', avatarId);
			$scope.avatar = angular.copy(avatarService.nextAvatar(avatarId));
		};
		$scope.openModal = function () {
			$scope.avatar = angular.copy(avatarService.getRandomAvatar());
			$scope.modal.show();
		};
		$scope.closeModal = function () {
			$scope.newFriend = {
				name: '',
				nickname: '',
				avatar: ''
			};
			$scope.modal.hide();
		};
		$scope.createFriend = function (friend) {
			friend.avatar = angular.copy($scope.avatar.link);
			friendListService.addFriend(friend);
			$scope.closeModal();
		};

		$scope.insert = function (firstname, lastname) {
			var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
			$cordovaSQLite.execute(db, query, [firstname, lastname]).then(function (result) {
				console.log("INSERT ID -> " + result.insertId);
			}, function (error) {
				console.error(error);
			});
		};
		$scope.select = function (lastname) {
			var query = "SELECT firstname, lastname FROM people WHERE lastname = ?";
			$cordovaSQLite.execute(db, query, [lastname]).then(function (result) {
				if(result.rows.length > 0) {
					console.log("SELECTED -> " + result.rows.item(0).firstname + " " + result.rows.item(0).lastname);
				} else {
					console.log("NO ROWS EXIST");
				}
			}, function (error) {
				console.error(error);
			});
		};

	});

	// app.controller('AddController', function ($scope, $state, friendListService) {
	//
	// });

	app.controller('EditController', function ($scope, $state, friendListService) {
		$scope.friend = angular.copy(friendListService.getFriend($state.params.friendId));

		$scope.save = function () {
			alert('saving');
		};
	});

	app.controller('DetailController', function ($scope, $state, friendListService) {
		$scope.friend = angular.copy(friendListService.getFriend($state.params.friendId));

		$scope.editFriend = function (id) {
			$state.go('edit', {
				friendId: id
			});
		};

	});

})();

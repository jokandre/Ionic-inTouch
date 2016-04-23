//(function () {
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
		window.plugin.notification.local.on("trigger", function(notification) {
			alert("triggered: " + notification);
		});

		if(window.cordova) {
			db = $cordovaSQLite.openDB({
				name: 'app.db',
				location: 'default'
			});
		} else {
			// Ionic serve syntax
			db = window.openDatabase("app.db", "1.0", "My app", -1);
		}
		//$cordovaSQLite.execute(db,"DROP TABLE friendGroup");
		$cordovaSQLite.execute(db, "CREATE TABLE  IF NOT EXISTS friendGroup (id integer primary key, name text, avatar text, lastcontacted text, lastcontactedUnix timestamp, nextnotificationUnix timestamp)");
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

app.controller('FriendListController', function ($scope, $state, $ionicModal,
	$cordovaSQLite, $cordovaLocalNotification, notificationService, avatarService, FriendGroup) {
	$scope.listCanSwipe = true; //$scope.friendList = friendListService.getSortedList();
	$scope.friendList = null;
	$scope.avatar = angular.copy(avatarService.getRandomAvatar());
	$scope.newFriend = {
		name: '',
		avatar: '',
		notifyIn: null
	};

	$scope.sortByDateDesc = function (a, b) {
		a = a.lastcontactedUnix;
		b = b.lastcontactedUnix;
		return a - b; //a < b? 1 : a > b ? -1 : 0;
	};
	$scope.updateFriendList = function () {
		FriendGroup.all().then(function (friendList) {
			$scope.friendList = friendList.sort($scope.sortByDateDesc);
		});
	};
	$scope.updateFriendList();

	$scope.editFriend = function (friend) {
		friend.lastcontactedUnix = moment().unix();
		friend.lastcontacted = moment().format();
		friend.nextnotificationUnix = moment().add(30, 'seconds').unix();
		notificationService.reschedule(friend.id, friend);

		FriendGroup.update(friend);
		$scope.updateFriendList();
	};
	$scope.deleteFriend = function (friend) {
		FriendGroup.remove(friend);
		$scope.updateFriendList();
	};

	$ionicModal.fromTemplateUrl('templates/addFriend.html', {
		scope: $scope
	}).then(function (modal) {
		$scope.modal = modal;
	});

	$scope.changeAvatar = function (avatarId) {
		$scope.avatar = angular.copy(avatarService.nextAvatar(avatarId));
	};
	$scope.openModal = function () {
		$scope.modal.show();
	};
	$scope.closeModal = function () {
		$scope.newFriend = {
			name: '',
			avatar: '',
			notifyIn: null
		};
		$scope.modal.hide();
	};

	$scope.createFriend = function (friend) {
		/*
		name
		avatar
		lastcontacted
		lastcontactedUnix
		notificationId
		*/
		friend.avatar = angular.copy($scope.avatar.link);
		friend.lastcontacted = moment().format();
		friend.lastcontactedUnix = moment().unix();
		friend.nextnotificationUnix = moment().add(friend.notifyIn, 'seconds').unix();

		//var notificationId = null;
		FriendGroup.add(friend).then(function (result) {
			//notificationId = result.insertId;
			if(friend.notifyIn && window.cordova) {
				notificationService.new(result.insertId, friend);
			} else {
				console.log('Browser: Notification not available');
			}
		});
		$scope.updateFriendList();
		$scope.closeModal();
	};

});

app.controller('EditController', function ($scope, $state, FriendGroup) {
	FriendGroup.get($state.params.friendId).then(function (friend) {
		$scope.friend = friend;
	});
	$scope.save = function () {
		alert('saving');
	};
});

app.controller('DetailController', function ($scope, $state, FriendGroup) {
	FriendGroup.get($state.params.friendId).then(function (friend) {
		$scope.friend = friend;
	});
	$scope.editFriend = function (id) {
		$state.go('edit', {
			friendId: id
		});
	};

});

//})();

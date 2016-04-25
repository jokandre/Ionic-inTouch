	var app = angular.module('inTouch');

	app.factory('notificationService', function ($cordovaLocalNotification, FriendGroup) {
		var self = this;

		self.new = function (fid, friend) {
			$cordovaLocalNotification.schedule({
				id: fid,
				title: 'Warning!',
				//sound: 'file://sound/summer.mp3',
				text: friend.name + ' is Missing You!',
				at: friend.nextnotificationUnix * 1000,
				every:'month',
				led: '000fff'
			}).then(function (result) {
				console.log('Name:' + friend.name + ', Notification scheduled for ' +
				moment.unix(friend.nextnotificationUnix).format());
			});
		};

		self.update = function (fid, friend) {
			$cordovaLocalNotification.isScheduled(fid).then(function (found) {
				console.log(JSON.stringify("Found: " + found));
				if(found) {
					$cordovaLocalNotification.update({
						id: fid,
						at: friend.nextnotificationUnix * 1000,
					}).then(function (result) {
						console.log('Updated:' + friend.name + ' ' +
						moment.unix(friend.nextnotificationUnix).format());
					});
				} else {
					alert(fid + " Not Found");
				}
			});
		};
		//TODO reschedule
		self.reschedule = function (oldNotification) {
			FriendGroup.get(oldNotification.id).then(function (friend) {
				if(friend.notifyEvery !== null) {
					friend.nextnotificationUnix = moment().add(friend.notifyEvery, 'weeks').unix();
					self.new(friend.id, friend);
					FriendGroup.update(friend);
				}

			});
		};
		//TODO delete
		self.cancel = function (friend) {
			$cordovaLocalNotification.isScheduled(friend.id).then(function (found) {
				if(found) {
					console.log("Deleting notification");
					$cordovaLocalNotification.cancel(friend.id);
				} else {
					console.log(friend.name + " Not Found");
				}
			});
		};

		return self;
	});

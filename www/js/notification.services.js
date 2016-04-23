	var app = angular.module('inTouch');

	app.factory('notificationService', function ($cordovaLocalNotification) {
		var self = this;

		self.new = function (fid, friend) {
			$cordovaLocalNotification.schedule({
				id: fid,
				title: 'Warning!',
				//sound: 'file://sound/summer.mp3',
				text: friend.name + ' is Missing You!',
				data: {'detail':friend.name},
				at: friend.nextnotificationUnix*1000,
				led: '000fff'
			}).then(function (result) {
				console.log(fid+' Notification scheduled at '+moment.unix(friend.nextnotificationUnix).format());
			});
		};

		self.reschedule = function (fid, friend) {
			$cordovaLocalNotification.isPresent(fid).then(function (present) {
				console.log(JSON.stringify(present));
				if(present) {
					$cordovaLocalNotification.update({
						id:fid,
						at: friend.nextnotificationUnix*1000,
					}).then(function (result) {
						console.log('Re-Scheduled:' +friend.name+' '+moment.unix(friend.nextnotificationUnix).format());
					});
				} else {
					alert(fid + " Not Present");
				}
			});
			// $cordovaLocalNotification.update({
			// 	id: ID,
			// 	at: friend.nextnotificationUnix*1000,
			// });
      // console.log(ID+':rescheduled:' +friend.name+' '+moment.unix(friend.nextnotificationUnix).format());
		};
		return self;
	});

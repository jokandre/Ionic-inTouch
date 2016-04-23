//(function () {
	var app = angular.module('inTouch');

	app.factory('DBA', function ($cordovaSQLite, $q, $ionicPlatform) {
		var self = this;

		// Handle query's and potential errors
		self.query = function (query, parameters) {
			parameters = parameters || [];
			var q = $q.defer();

			$ionicPlatform.ready(function () {
				$cordovaSQLite.execute(db, query, parameters)
					.then(function (result) {
						q.resolve(result);
					}, function (error) {
						console.warn('I found an error');
						console.warn(error.message);
						q.reject(error);
					});
			});
			return q.promise;
		};

		// Process a result set
		self.getAll = function (result) {
			var output = [];

			for(var i = 0; i < result.rows.length; i++) {
				output.push(result.rows.item(i));
			}
			return output;
		};

		// Process a single result
		self.getById = function (result) {
			var output = null;
			output = angular.copy(result.rows.item(0));
			return output;
		};

		return self;
	});

	app.factory('FriendGroup', function ($cordovaSQLite, DBA) {
		var self = this;

		self.all = function () {
			return DBA.query("SELECT id, name, avatar, lastcontacted, lastcontactedUnix, nextnotificationUnix FROM friendGroup")
				.then(function (result) {
					return DBA.getAll(result);
				});
		};

		self.get = function (memberId) {
			var parameters = [memberId];
			return DBA.query("SELECT id, name, avatar,lastcontacted, lastcontactedUnix, nextnotificationUnix FROM friendGroup WHERE id = (?)", parameters)
				.then(function (result) {
          //console.log("result:",result);
					return DBA.getById(result);
				});
		};

		self.add = function (member) {
			var parameters = [member.name, member.avatar, member.lastcontacted, member.lastcontactedUnix, member.nextnotificationUnix];
			return DBA.query("INSERT INTO friendGroup ( name, avatar, lastcontacted,lastcontactedUnix, nextnotificationUnix) VALUES (?,?,?,?,?)", parameters);
		};

		self.remove = function (member) {
			var parameters = [member.id];
			return DBA.query("DELETE FROM friendGroup WHERE id = (?)", parameters);
		};

		self.update = function (editMember) {
			var parameters = [editMember.name, editMember.lastcontacted, editMember.lastcontactedUnix, editMember.nextnotificationUnix, editMember.id];
			return DBA.query("UPDATE friendGroup SET name = (?),lastcontacted = (?), lastcontactedUnix = (?), nextnotificationUnix =(?) WHERE id = (?)", parameters);
		};

		return self;
	});
//})();

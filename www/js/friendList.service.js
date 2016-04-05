(function(){
  	var app = angular.module('inTouch');

    app.factory('friendListService', function(){

      friendList = [{
  			id: '1',
  			name: 'Shao Lin',
  			status: 'waiting',
        avatar: 'http://api.adorable.io/avatars/face/eyes1/nose10/mouth9/70bBC4',
        lastcontacted: moment('2016-03-23', 'YYYY-MM-DD')
  		}, {
  			id: '2',
  			name: 'Ana Rita',
  			status: 'waiting',
        avatar: 'http://api.adorable.io/avatars/face/eyes1/nose10/mouth9/70bBC4',
        lastcontacted: moment('2016-03-08', 'YYYY-MM-DD')
  		}, {
  			id: '3',
  			name: 'Joao Pedro',
  			status: 'waiting',
        avatar: 'http://api.adorable.io/avatars/face/eyes1/nose10/mouth9/70bBC4',
        lastcontacted: moment('2016-04-01', 'YYYY-MM-DD')
  		}];

      function indexOf(id){
        for (var i = 0; i < friendList.length; i++) {
          if (friendList[i].id === id) {
            return i;
          }
        }
        return -1;
      }

      function sortByDateDesc (a, b){
        a = a.lastcontacted;
        b = b.lastcontacted;
        return a - b;//a < b? 1 : a > b ? -1 : 0;
      }

      return {
        getFriendList: function() {
          return friendList;
        },
        getFriend: function(friendId) {
          return friendList[indexOf(friendId)];
        },
        updateFriend: function(friend) {
          friendList[indexOf(friend.id)] = friend;
        },
        deleteFriend: function(id) {
          var i = indexOf(id);
          friendList.splice(i, 1);
        },
        getSortedList: function() {
          return friendList.sort(sortByDateDesc);
        },
        addFriend: function (newfriend) {
          newfriend.id = friendList.length + 1 +'';
          newfriend.lastcontacted = moment();
          friendList.push(newfriend);
        }

      };
    });
})();

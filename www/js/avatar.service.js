/*generate avatar list*/
(function(){
  	var app = angular.module('inTouch');

    app.factory('avatarService', function(){

      avatarList = [{
  			id: '1',
  			link: 'http://api.adorable.io/avatars/face/eyes1/nose10/mouth9/70bBC4',
  		},
      {
        id: '2',
  			link: 'http://api.adorable.io/avatars/face/eyes10/nose4/mouth9/70bBC4',
  		},
      {
        id: '3',
  			link: 'http://api.adorable.io/avatars/face/eyes5/nose4/mouth6/70bBC4',
  		},
      {
        id: '4',
  			link: 'http://api.adorable.io/avatars/face/eyes3/nose9/mouth1/70bBC4',
  		},
      {
        id: '5',
  			link: 'http://api.adorable.io/avatars/face/eyes6/nose4/mouth9/70bBC4',
  		},
      {
        id: '6',
  			link: 'https://api.adorable.io/avatars/450/aaa',
  		},
      {
        id: '7',
  			link: 'http://api.adorable.io/avatar/450/2',
  		},
      {
        id: '8',
  			link: 'http://api.adorable.io/avatar/450/3',
  		},
      {
        id: '9',
  			link: 'https://api.adorable.io/avatars/500/g',
  		}];
/*
      function indexOf(id){
        for (var i = 0; i < friendList.length; i++) {
          if (friendList[i].id === id) {
            return i;
          }
        }
        return -1;
      }
*/
      return {
        getAvatarList: function() {
          return avatarList;
        },
        getFirstAvatar: function() {
          return avatarList[0];
        },
        nextAvatar: function(currId) {
          if(currId < avatarList.length){
            var nextId = parseInt(currId) + 1;
            return avatarList[nextId-1];
          }else{
            return avatarList[0];
          }
        },
        getRandomAvatar: function(){
          var index = Math.floor((Math.random() * avatarList.length) + 0);
          return avatarList[index];
        }
      };
    });
})();

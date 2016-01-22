class FriendlistController {
  constructor($scope, Users, Auth) {

    this.$scope = $scope;
    this.Users = Users;

    this.userList = [];
    this.user;
    this.showUserList = false;
    
    this.$scope.$watch('user', (user) => {
      this.user = user;
      if (!this.userList.length && this.user) {
        this.Users.getAllUsers()
          .then((users) => {
            this.userList = this.filterFriends(users);
          });
      }
    });
  }

  addFriend(friend) {
    this.user.friends.push(friend);
    this.handleUpdate();
  }

  filterFriends(userList){
    
    let idHash = {};
    
    idHash[this.user.id] = true;
    _.each(this.user.friends, (friend) => {
      idHash[friend.id] = true;
    });

    return userList.filter((user) => {
      return !idHash[user.id];
    });
  }

}

FriendlistController.$inject = ['$scope', 'Users', 'Auth'];

export {
  FriendlistController
};

class FriendlistController {
  constructor($scope, $state, Users, Auth) {

    this.$scope = $scope;
    this.$state = $state;
    this.Users = Users;
    this.Auth = Auth;

    this.userList = [];
    this.user;
    this.showUserList = false;

    this.Auth.getLoggedInUser()
      .then((user) => {
        this.user = user
        return this.Users.getAllUsers()
      })
      .then(users => this.userList = this.filterFriends(users));
  }

  addFriend(friend) {
    this.user.friends.push(friend);
    this.Users.update(this.user);
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

  viewFriend(id) {
    console.log(`dashboard({userId: ${id}})`);
    this.$state.transitionTo('dashboard', {userId: id});
  }

}

FriendlistController.$inject = ['$scope', '$state', 'Users', 'Auth'];

export {
  FriendlistController
};


class DashboardController {
  
  constructor($scope, $state, $stateParams, Users, Tasks, Auth) {

    // Add dependencies
    this.$scope = $scope;
    this.$state = $state;
  	this.Users = Users;
    this.Tasks = Tasks;
    this.Auth = Auth;

    this.user;
    this.isLoggedInUser = false;

    this.$scope.$watch('vm', (vm) => {
      console.log('change');
      this.user = vm.user;
    });

    // Initialize current user
    // Redirect to login if not authorized
 		if(this.Auth.authorized()){
      // Get logged in user
      this.Auth.getLoggedInUser()
        .then((loggedInUser) => {
          // If viewing another user
          if($stateParams.userId && $stateParams.userId !== loggedInUser.id){

            this.Users.getCurrentUser($stateParams.userId)
              .then((user) => {
                this.user = user;
              });
          // Default to logged in user
          } else {
            this.isLoggedInUser = true;
            this.user = loggedInUser;
          }
        });
    // Unauthorized gets the boot
    } else {
      this.redirect();
    }
  }

  redirect(){
    this.$state.go('login');
  }

  addTask(task) {
    this.Tasks.addTask(task)
      .then(tasks => this.tasks = tasks);
  }

  checkTask(task) {
    this.updateTask(task);
  }

  updateTask(task) {
    this.Tasks.updateTask(task)
      .then(tasks => this.tasks = tasks);
  }

  updateUser() {
    this.Users.update(this.user)
      .then(user => this.user = user);
  }

}

DashboardController.$inject = ['$scope', '$state', '$stateParams', 'Users', 'Tasks', 'Auth'];

export {DashboardController};

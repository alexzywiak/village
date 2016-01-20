
class DashboardController {
  constructor($state, Users, Auth) {

    // Add dependencies
    this.$state = $state;
  	this.Users = Users;
    this.Auth = Auth;

    // Initialize newTask
    this.newTask = {
    	dueDate: new Date()
    };

    // Initialize current user
    // Redirect to login if not authorized
 		if(this.Auth.authorized()){
      this.Users.getLoggedInUser()
        .then(user => this.user = user);
    } else {
      this.$state.go('login');
    }
  }

  addTask(task) {
  	this.Users.addTask(task).then(() => {
      return this.Users.getLoggedInUser();
    })
    .then(user => this.user = user);
    this.newTask = {
      dueDate: new Date()
    }
  }

}

DashboardController.$inject = ['$state', 'Users', 'Auth'];

export {DashboardController};

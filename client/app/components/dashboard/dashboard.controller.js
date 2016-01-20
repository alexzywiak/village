
class DashboardController {
  
  constructor($state, Users, Tasks, Auth) {

    // Add dependencies
    this.$state = $state;
  	this.Users = Users;
    this.Tasks = Tasks;
    this.Auth = Auth;

    // Initialize current user
    // Redirect to login if not authorized
 		if(this.Auth.authorized()){
      this.Users.getLoggedInUser()
        .then((user) => {
          this.user = user
          return this.Tasks.getTasks();
        })
        .then(tasks => this.tasks = tasks);
    } else {
      this.$state.go('login');
    }
  }

  addTask(task) {
  	console.log(task);
    this.Tasks.addTask(task)
      .then(tasks => this.tasks = tasks);
    
    this.newTask = {
      dueDate: new Date()
    }
  }

  checkTask(task) {
    task.status = 'pending';
    this.updateTask(task);
  }

  updateTask(task) {
    this.Tasks.updateTask(task)
      .then(tasks => this.tasks = tasks);
  }

}

DashboardController.$inject = ['$state', 'Users', 'Tasks', 'Auth'];

export {DashboardController};

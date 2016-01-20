
class DashboardController {
  constructor(Users) {
  	this.Users = Users;
    this.greeting = 'DashboardController!';
    this.newTask = {
    	dueDate: new Date()
    };
 		this.Users.getLoggedInUser().then(user => this.user = user);
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

DashboardController.$inject = ['Users'];

export {DashboardController};

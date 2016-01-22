import moment from 'moment';

class TasklistController {
	constructor($scope, Tasks, Auth) {
		
		this.$scope = $scope;
		this.Tasks  = Tasks;
		this.Auth = Auth;
		this.moment = moment;

		this.showDetail = {};
		this.$scope.$watch('user', (user) => {
			if(user){			
				this.user = user;
			}
		});
	}

  onUpdate(task){
  	task = this.changeTaskStatus(task);
  	if(task){
	  	this.Tasks.updateTask(task);
  	}
  }

  changeTaskStatus(task) {
  	// Check if it's user's own profile
  	if(this.Auth.isLoggedInUser(this.user) && task.status !== 'complete'){
	  	task.status = (task.status === 'pending') ? 'incomplete' : 'pending';
	  	return task;
  	// Friends Profile
  	} else if(task.status !== 'incomplete'){
  		task.status = (task.status === 'pending') ? 'complete' : 'pending';
  		return task;
  	} else {
  		return false;
  	}
  }

}

TasklistController.$inject = ['$scope', 'Tasks', 'Auth'];

export {TasklistController};

import moment from 'moment';

class TasklistController {
	constructor($scope, Tasks) {
		
		this.$scope = $scope;
		this.Tasks  = Tasks
		this.moment = moment;

		this.showDetail = {};
		this.$scope.$watch('user', (user) => {
			if(user){			
				this.user = user;
			}
		});
	}

  onUpdate(task){
  	task.status = (task.status === 'pending') ? 'incomplete' : 'pending';
  	this.Tasks.updateTask(task);
  }

}

TasklistController.$inject = ['$scope', 'Tasks'];

export {TasklistController};

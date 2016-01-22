class TaskinputController {
  constructor($scope, Tasks) {

    this.$scope = $scope;
    this.Tasks = Tasks;

    this.$scope.$watch('user', (user) => {
      this.user = user;
    });

    // Initialize newTask
    this.resetTask();
  }

  resetTask() {
    this.task = {
      dueDate: new Date(),
      status: 'incomplete'
    };
  }

  /**
   * Run the submit function passed in from parent
   */
  onSubmit() {
    if (this.task.name.length) {
      this.user.tasks.push(this.task);
      this.Tasks.addTask(this.user.id, this.task);
      this.resetTask();
    }
  }

}

TaskinputController.$inject = ['$scope', 'Tasks'];

export {
  TaskinputController
};

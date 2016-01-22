class TaskinputController {
  constructor($scope, Tasks) {

    this.$scope = $scope;
    this.Tasks = Tasks;

    this.$scope.$watch('user', (user) => {
      this.user = user;
    });

    // Initialize newTask
    this.task = {
      dueDate: new Date()
    };
  }

  /**
   * Run the submit function passed in from parent
   */
  onSubmit() {
    if (this.task.name.length) {
      this.user.tasks.push(this.task);
      this.Tasks.addTask(this.user.id, this.task);
      this.task = {
        dueDate: new Date()
      };
      this.handleUpdate();
    }
  }

}

TaskinputController.$inject = ['$scope', 'Tasks'];

export {
  TaskinputController
};

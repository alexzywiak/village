class TaskinputController {
  constructor() {

    // Initialize newTask
    this.task = {
      dueDate: new Date()
    };
  }

  onSubmit() {
    this.handleSubmit({
      task: this.task
    });
    this.task = {
      dueDate: new Date()
    };
  }

}

TaskinputController.$inject = [];

export {
  TaskinputController
};

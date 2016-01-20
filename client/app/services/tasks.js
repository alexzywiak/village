export const tasks = ($http, $q, Users, API) => {

  let userTasks = null;

  const addTask = (data) => {
    return Users.getLoggedInUser()
      .then((user) => {
        data.user_id = user.id;
        return $http({
          method: "POST",
          url: `${API.url}/task`,
          data: data
        });
      })
      .then((resp) => {
        userTasks.push(resp.data);
        return getTasks();
      });
  };

  const updateTask = (data) => {
    return $http({
      method: "PUT",
      url: `${API.url}/task/${data.id}`,
      data: data
    }).then((resp) => {
      let updatedTask = resp.data;

      userTasks = userTasks.map((task) => {
        if(task.id === updatedTask.id){
          return updatedTask;
        } else {
          return task;
        }
      });

      return getTasks();
    });
  };

  const getTasks = () => {
    console.log(userTasks);
    if(!userTasks){
      return Users.getLoggedInUser()
        .then(user => userTasks = user.tasks);
    } else {
      return $q.when(userTasks);
    }
  };


  return {addTask, updateTask, getTasks};
};

tasks.$inject = ['$http', '$q', 'Users', 'API'];

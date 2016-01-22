export const tasks = ($http, $q, Users, API) => {

  const addTask = (userId, data) => {
    data.user_id = userId;
    return $http({
      method: "POST",
      url: `${API.url}/task`,
      data: data
    }).then((resp) => {
      return resp.data;
    });
  };

  const updateTask = (data) => {

    return $http({
      method: "PUT",
      url: `${API.url}/task/${data.id}`,
      data: data
    });
  };

  return {
    addTask, updateTask
  };
};

tasks.$inject = ['$http', '$q', 'Users', 'API'];

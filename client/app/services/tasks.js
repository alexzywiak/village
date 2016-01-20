export const tasks = ($http, Users, API) => {

  let addTask = (data) => {
  	console.log(data);
    return Users.getLoggedInUser()
      .then((user) => {
      	data.user_id = user.id;
        return $http({
          method: "POST",
          url: `${API.url}/task`,
          data: data
        }).then(resp => resp.data);
      });
  }

  return {
    addTask
  };
};

tasks.$inject = ['$http', 'Users', 'API'];

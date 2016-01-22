import {
  omit
}
from 'lodash';

export const users = ($http, $q, $window, $state, Auth, API) => {

  let allUsers = null;
  let currentUser = null;

  /**
   * Gets all users from the DB
   * @return {[array of {}]} [Array of all user objects]
   */
  const get = () => {
    return $http.get(`${API.url}/user`).then(resp => allUsers = resp.data);
  };


  const getAllUsers = () => {
    if (!allUsers) {
      return get()
        .then(() => {
          return allUsers;
        });
    } else {
      return $q.when(allUsers);
    }
  };

  const getCurrentUser = (id, update) => {
    if (update || !currentUser || currentUser.id !== id) {
      return getById(id);
    } else {
      return $q.when(currentUser);
    }
  };

  /**
   * Gets single user by id
   * Sets response to loggedInUser state variable
   * @param  {[string]} id [id of user on db]
   * @return {[promise]}   [resolves when state is set]
   */
  const getById = (id) => {
    return $http({
      method: 'GET',
      url: `${API.url}/user/${id}`,
    }).then((resp) => {
      return resp.data;
    });
  };

  const update = (data) => {
    console.log('update');
    return $http({
      method: "PUT",
      url: `${API.url}/user/${data.id}`,
      data: data
    }).then((resp) => {
    	return getCurrentUser(resp.data.id, true);
    });
  };


  return {
    getAllUsers, getById, update, getCurrentUser
  };
};

users.$inject = ['$http', '$q', '$window', '$state', 'Auth', 'API'];

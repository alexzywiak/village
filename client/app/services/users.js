
export const users = ($http, $q, $window, $state, Auth, API) => {
	
	let allUsers = [];
	let currentUser = null;

	/**
	 * Gets all users from the DB
	 * @return {[array of {}]} [Array of all user objects]
	 */
	let get = () => {
		return $http.get(`${API.url}/user`).then(resp => allUsers = resp.data);
	};

	/**
	 * Gets single user by id
	 * Sets response to currentUser state variable
	 * @param  {[string]} id [id of user on db]
	 * @return {[promise]}   [resolves when state is set]
	 */
	let getById = (id) => {
		return $http({
			method: 'GET',
			url: `${API.url}/user/${id}`,
		}).then((resp) => {
			currentUser = resp.data;
			return $q.when(currentUser);
		});
	};

	/**
	 * Signs up a user.  Gets user from the DB and sets to currentUser state var
	 * Data requires {email, password, [name, twitter]}
	 * @param  {[obj]} data [user data object]
	 * @return {[promise]}  [gets current user from db]
	 */
	let signUp = (data) => {
		return $http({
			method: "POST",
			url: `${API.url}/user/signup`,
			data: data
		}).then((resp) => {
			if(resp.data.id_token){
				let user = Auth.saveToken(res.data.id_token);
				return getById(user.id);
			} else {
				return $q.when(false);
			}
		});
	};

	/**
	 * Logs in a user.  Gets user from the DB and sets to currentUser state var
	 * data requires {email, password}
	 * @param  {[obj]} data [user data object]
	 * @return {[promise]}  [gets current user from db]
	 */
	let login = (data) => {
		return $http({
			method: "POST",
			url: `${API.url}/user/login`,
			data: data
		}).then((resp) => {
			if(resp.data.id_token){
				let user = Auth.saveToken(resp.data.id_token);
				return getById(user.id);
			} else {
				return $q.when(false);
			}
		});
	};

	let update = (data) => {
		
	};

	/**
	 * Gets logged in user from state
	 * Returns user if cached, otherwise will use jwt to get from DB
	 * @return {[obj]} [current user data]
	 */
	let getLoggedInUser = () => {

		if(!currentUser && Auth.authorized()){

			let user = Auth.decodeToken();

			return getById(user.id).then(() => {
				return currentUser;
			});

		} else if (Auth.authorized()){
			return $q.when(currentUser);
		} else {
			return $q.when(false);
		}
	};

	// /**
	//  * Saves a new task to the logged in user
	//  * data requires {name, [description, due date]}
	//  * @param  {[obj]} data [task data]
	//  * @return {[promise]}  [resolves on completion]
	//  */
	// let addTask = (data) => {
 //    return getLoggedInUser()
 //      .then((user) => {
 //      	data.user_id = user.id;
 //      	if(user){
	//         return $http({
	//           method: "POST",
	//           url: `${API.url}/task`,
	//           data: data
	//         }).then((resp) => {
	//         	currentUser.tasks.push(resp.data);
	//         	return resp.data;
	//         });
 //      	} else {
 //      		return $q.when(false);
 //      	}
 //      });
  //}

  return {getLoggedInUser, signUp, login};
};

users.$inject = ['$http', '$q', '$window', '$state', 'Auth', 'API'];

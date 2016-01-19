
export const users = ($http, API) => {
	
	let users = [];
	let loggedInUser = {};

	let get = () => {
		return $http.get(`${API.url}/user`).then(resp => users = resp.data);
	}

	let getById = (id) => {

	}

	let signUp = (data) => {

	}

	let update = (data) => {
		
	}

	let getState = () => {
		return {users, loggedInUser};
	}
  
  return {get, getState};
};

users.$inject = ['$http', 'API'];

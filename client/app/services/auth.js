
export const auth = ($q, $window, jwtHelper) => {
	
	const storageKey = 'village.id_token';

	/**
	 * Checks if a user has a token
	 * @return {[boolean]} [if user is authorized]
	 */
	const authorized = () => {
		return !!getToken();
	};

	/**
	 * Returns raw jwt from local storage
	 * @return {[string]} [returns token or false if doesn't exist]
	 */
	const getToken = () => {
		return $window.localStorage.getItem(storageKey) || false;
	}

	/**
	 * Save raw token to local storage.  Returns decoded token
	 * @param  {[string]} token [jwt to save]
	 * @return {[object]}       [decoded jwt]
	 */
	const saveToken = (token) => {
		$window.localStorage.setItem(storageKey, token);
		return decodeToken();
	}

	/**
	 * Deletes jwt from storage
	 * @return {[boolean]} [true]
	 */
	const removeToken = () => {
		$window.localStorage.removeItem(storageKey);
		return true;
	}

	/**
	 * Decodes raw jwt and returns payload
	 * @return {[object]} [returns decoded payload]
	 */
	const decodeToken = () => {
		let token = getToken();
		if(token){
			return jwtHelper.decodeToken(token);
		} else {
			return false;
		}
	}

  return {authorized, saveToken, removeToken, decodeToken};
};

auth.$inject = ['$q', '$window', 'jwtHelper'];

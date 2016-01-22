export const auth = ($http, $q, $window, jwtHelper, API) => {

  const storageKey = 'village.id_token';

  let loggedInUser = null;

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
  const logOut = () => {
    $window.localStorage.removeItem(storageKey);
    loggedInUser = null;
    return true;
  }

  /**
   * Decodes raw jwt and returns payload
   * @return {[object]} [returns decoded payload]
   */
  const decodeToken = () => {
    let token = getToken();
    if (token) {
      return jwtHelper.decodeToken(token);
    } else {
      return false;
    }
  }

  const _getLoggedInUserFromDB = () => {
    let id = decodeToken().id;
    return $http({
        method: "GET",
        url: `${API.url}/user/${id}`
      })
      .then((resp) => {
        loggedInUser = resp.data;
        return loggedInUser;
      });
  }

  /**
   * Manages state for the logged in user
   * If value is already saved, return it
   * Otherwise query the DB for the Users' info
   * Returns false if no JWT present
   * @return {[promise]} [resolves with User obj]
   */
  const getLoggedInUser = () => {
    if (!loggedInUser && authorized()) {
      return _getLoggedInUserFromDB()
    } else if (authorized()) {
      return $q.when(loggedInUser);
    } else {
      return $q.when(false);
    }
  };

  /**
   * Check if a user object is the current logged in user
   * @param  {[obj]} user [user data object]
   * @return {[boolean]}  [true if is logged in user]
   */
  const isLoggedInUser = (user) => {
    return (authorized() && user.id === loggedInUser.id) ? true : false;
  };

  /**
   * Signs up a user.  Gets user from the DB and sets to loggedInUser state var
   * Data requires {email, password, [name, twitter]}
   * @param  {[obj]} data [user data object]
   * @return {[promise]}  [gets current user from db]
   */
  const signUp = (data) => {
    return $http({
      method: "POST",
      url: `${API.url}/user/signup`,
      data: data
    }).then((resp) => {
      if (resp.data.id_token) {
        return getLoggedInUser();
      } else {
        return $q.when(false);
      }
    });
  };

  /**
   * Logs in a user.  Gets user from the DB and sets to loggedInUser state var
   * data requires {email, password}
   * @param  {[obj]} data [user data object]
   * @return {[promise]}  [gets current user from db]
   */
  const login = (data) => {
    return $http({
      method: "POST",
      url: `${API.url}/user/login`,
      data: data
    }).then((resp) => {
      if (resp.data.id_token) {
        return getLoggedInUser();
      } else {
        return $q.when(false);
      }
    });
  };

  return {authorized, logOut, getLoggedInUser, isLoggedInUser, login, signUp};
};

auth.$inject = ['$http', '$q', '$window', 'jwtHelper', 'API'];

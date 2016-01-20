
export const auth = ($window) => {
	
	const authorized = () => {
		return !!$window.localStorage.getItem('village.id_token');
	};

  return {authorized};
};

auth.$inject = ['$window'];

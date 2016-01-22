
class LoginController {
  constructor($state, Auth) {
    this.$state = $state;
  	this.Auth = Auth;
    this.user = {};
  }

  login(user) {
  	this.Auth.login(user)
  		.then((auth) => {
        console.log(auth);
        this.$state.go('dashboard');
  		});	
  }
}

LoginController.$inject = ['$state', 'Auth'];

export {LoginController};


class LoginController {
  constructor($state, Users) {
    this.$state = $state;
  	this.Users = Users;
    this.user = {};
  }

  login(user) {
  	this.Users.login(user)
  		.then((auth) => {
  			if(auth){
          this.$state.go('dashboard');
        }
  		});	
  }
}

LoginController.$inject = ['$state', 'Users'];

export {LoginController};

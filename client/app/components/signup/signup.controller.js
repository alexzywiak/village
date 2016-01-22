
class SignupController {
  constructor(Auth, $state) {
  	this.user = {};
    this.greeting = 'SignupController!';
    this.Auth = Auth;
  }

  signUp(user){
  	this.Auth.signUp(user)
  		.then((auth) => {
        if(auth){
          this.$state.go('dashboard');
        }
      }); 
  }
}

SignupController.$inject = ['Auth', '$state'];

export {SignupController};

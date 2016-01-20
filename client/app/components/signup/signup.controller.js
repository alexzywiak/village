
class SignupController {
  constructor(Users, $state) {
  	this.user = {};
    this.greeting = 'SignupController!';
    this.Users = Users;
  }

  signUp(user){
  	this.Users.signUp(user)
  		.then((auth) => {
        if(auth){
          this.$state.go('dashboard');
        }
      }); 
  }
}

SignupController.$inject = ['Users', '$state'];

export {SignupController};

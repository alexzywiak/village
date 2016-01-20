
class LoginController {
  constructor() {
    this.greeting = 'LoginController!';
    this.user = {};
  }

  signUp(user) {
  	console.log(user);
  }

}

LoginController.$inject = [];

export {LoginController};

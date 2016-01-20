class NavbarController {
  constructor() {
    this.greeting = 'NavbarController!';
    this.links = [{
      title: 'dashobard',
      state: 'dashboard'
    }, {
    	title: 'login',
    	state: 'login'
    }, {
    	title: 'signup',
    	state: 'signup'
    }];
  }

}

NavbarController.$inject = [];

export {
  NavbarController
};

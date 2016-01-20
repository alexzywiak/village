class NavbarController {
  constructor($state, Auth) {
    
    this.$state = $state;
    this.Auth = Auth;

    this.links = [{
      title: 'dashboard',
      state: 'dashboard'
    }, {
    	title: 'login',
    	state: 'login'
    }, {
    	title: 'signup',
    	state: 'signup'
    },{
      title: 'logout',
      click: 'logout'
    }];
  }

  logout() {
    this.Auth.removeToken();
    this.$state.go('login');
  }

  handleClick(click){
    if(click){
      this[click]();
    }
  }

}

NavbarController.$inject = ['$state', 'Auth'];

export {
  NavbarController
};

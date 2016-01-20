
import 'normalize.css';
import '../../node_modules/angular-material/angular-material.css';
import {appDirective} from './app.directive';

// Angular Dependencies
import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';
import 'angular-aria';
import ngMaterial from 'angular-material';

// JWT Dependencies
import angularJwt from 'angular-jwt';
import angularStorage from 'angular-storage';

// Import shared services
import {services} from './services/services';

// Import components
import {signup} from './components/signup/signup';
import {login} from './components/login/login';
import {dashboard} from './components/dashboard/dashboard';
import {navbar} from './components/navbar/navbar';

angular.module('app', [
  uiRouter,
  ngAnimate,
  ngMaterial,
  angularJwt,
  angularStorage,
  
  services.name,

  signup.name,
  login.name,
  dashboard.name,
  navbar.name

])
.directive('app', appDirective)

// Set up JWT authentication

.config(['$httpProvider', '$stateProvider', '$urlRouterProvider', '$mdThemingProvider', function($httpProvider, $stateProvider, $urlRouterProvider, $mdThemingProvider){
	
	$mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('green');

	$urlRouterProvider.otherwise('/login');
	// Intercept outgoing http requests and attach jwt token
	$httpProvider.interceptors.push('AttachJWT');
}])

.factory('AttachJWT', ['$window', function($window){
	
	const attach = {
		// Attach jwt token if it exists
		request: (object) => {
			let jwt = $window.localStorage.getItem('village.id_token');
			if(jwt){
				object.headers['x-access-token'] = jwt;
			}
			object.headers['Allow-Control-Allow-Origin'] = '*';
			return object;
		}

	};

	return attach;
}])
.run(function($rootScope, $state, Auth) {
	$rootScope.$on('$stateChangeStart', function(){
		console.log('chicken butt');
	});
});





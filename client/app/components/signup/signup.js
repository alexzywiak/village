
import {signupDirective} from './signup.directive';
import angular from 'angular';
//import uiRouter from 'angular-ui-router';

export const signup = angular.module('signup', ['ui.router'])
  .config(($stateProvider) => {
    $stateProvider.state('signup', {
      url: '/signup',
      template: '<signup></signup>'
    });
  })
  .directive('signup', signupDirective);


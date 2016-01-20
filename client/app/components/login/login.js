
import {loginDirective} from './login.directive';
import angular from 'angular';
//import uiRouter from 'angular-ui-router';

export const login = angular.module('login', ['ui.router'])
  .config(($stateProvider) => {
    $stateProvider.state('login', {
      url: '/login',
      template: '<login></login>'
    });
  })
  .directive('login', loginDirective);


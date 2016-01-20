
import {navbarDirective} from './navbar.directive';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export const navbar = angular.module('navbar', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('navbar', {
      url: '/navbar',
      template: '<navbar></navbar>'
    });
  })
  .directive('navbar', navbarDirective);


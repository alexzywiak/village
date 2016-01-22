
import {dashboardDirective} from './dashboard.directive';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export const dashboard = angular.module('dashboard', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('dashboard', {
      url: '/dashboard/',
      params: {
      	userId: null
      },
      template: '<dashboard></dashboard>',
      authenticate: true
    });
  })
  .directive('dashboard', dashboardDirective);


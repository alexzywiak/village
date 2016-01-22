
import {tasklistDirective} from './tasklist.directive';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export const tasklist = angular.module('tasklist', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('tasklist', {
      url: '/tasklist',
      template: '<tasklist></tasklist>'
    });
  })
  .directive('tasklist', tasklistDirective);


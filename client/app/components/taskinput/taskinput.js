
import {taskinputDirective} from './taskinput.directive';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export const taskinput = angular.module('taskinput', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('taskinput', {
      url: '/taskinput',
      template: '<taskinput></taskinput>'
    });
  })
  .directive('taskinput', taskinputDirective);



import {testDirective} from './test.directive';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export const test = angular.module('test', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('test', {
      url: '/test',
      template: '<test></test>'
    })
  })
  .directive('test', testDirective);


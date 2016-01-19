
import {test2Directive} from './test2.directive';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export const test2 = angular.module('test2', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('test2', {
      url: '/test2',
      template: '<test2></test2>'
    })
  })
  .directive('test2', test2Directive);



import {friendlistDirective} from './friendlist.directive';
import angular from 'angular';
import uiRouter from 'angular-ui-router';

export const friendlist = angular.module('friendlist', [uiRouter])
  .config(($stateProvider) => {
    $stateProvider.state('friendlist', {
      url: '/friendlist',
      template: '<friendlist></friendlist>'
    });
  })
  .directive('friendlist', friendlistDirective);


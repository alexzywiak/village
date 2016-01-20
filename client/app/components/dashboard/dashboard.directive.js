import './dashboard.styl';
import {DashboardController as controller} from './dashboard.controller';
import template from './dashboard.html';

export const dashboardDirective = () => {
  return {
    template,
    controller,
    controllerAs: 'vm',
    scope: {},
    restrict: 'E',
    replace: true
  };
};

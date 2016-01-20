import './login.styl';
import {LoginController as controller} from './login.controller';
import template from './login.html';

export const loginDirective = () => {
  return {
    template,
    controller,
    controllerAs: 'vm',
    scope: {},
    restrict: 'E',
    replace: true
  };
};

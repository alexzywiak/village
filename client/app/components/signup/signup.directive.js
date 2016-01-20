import './signup.styl';
import {SignupController as controller} from './signup.controller';
import template from './signup.html';

export const signupDirective = () => {
  return {
    template,
    controller,
    controllerAs: 'vm',
    scope: {},
    restrict: 'E',
    replace: true
  };
};

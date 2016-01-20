import './navbar.styl';
import {NavbarController as controller} from './navbar.controller';
import template from './navbar.html';

export const navbarDirective = () => {
  return {
    template,
    controller,
    controllerAs: 'vm',
    scope: {},
    restrict: 'E',
    replace: true
  };
};

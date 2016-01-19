import './test2.styl';
import {Test2 as controller} from './test2.controller';
import template from './test2.html';

export const test2Directive = ()=> {
  return {
    template,
    controller,
    controllerAs: 'vm',
    scope: {},
    restrict: 'E',
    replace: true
  }
};

import './friendlist.styl';
import {FriendlistController as controller} from './friendlist.controller';
import template from './friendlist.html';

export const friendlistDirective = () => {
  return {
    template,
    controller,
    controllerAs: 'vm',
    scope: {},
    restrict: 'E',
    replace: true
  };
};

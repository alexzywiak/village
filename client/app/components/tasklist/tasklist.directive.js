import './tasklist.styl';
import {TasklistController as controller} from './tasklist.controller';
import template from './tasklist.html';

export const tasklistDirective = () => {
  return {
    template,
    controller,
    controllerAs: 'vm',
    scope: {
    	user: '=',
    	handleUpdate: '&'
    },
    restrict: 'E',
    replace: true,
    link: (scope) => {
    	scope.vm.user = scope.user;
    	scope.vm.handleUpdate = scope.handleUpdate
    }
  };
};

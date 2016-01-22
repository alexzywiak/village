import './taskinput.styl';
import {TaskinputController as controller} from './taskinput.controller';
import template from './taskinput.html';

export const taskinputDirective = () => {
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
    link: (scope, element, attrs, controller) => {
    	scope.vm.user = scope.user;
        scope.vm.handleUpdate = scope.handleUpdate;
    }
  };
};

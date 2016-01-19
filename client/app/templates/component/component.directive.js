import './<%= name %>.styl';
import {<%= upCaseName %> as controller} from './<%= name %>.controller';
import template from './<%= name %>.html';

export const <%= name %>Directive = () => {
  return {
    template,
    controller,
    controllerAs: 'vm',
    scope: {},
    restrict: 'E',
    replace: true
  };
};


import 'normalize.css';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';

// Import shared services
import {services} from './services/services';

// Import components
import {test} from './components/test/test';

angular.module('app', [
  uiRouter,
  ngAnimate,
  test.name,
  services.name
])
.directive('app', appDirective);

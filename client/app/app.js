
import 'normalize.css';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';

import {test} from './components/test/test';

angular.module('app', [
  uiRouter,
  ngAnimate,
  test.name
])
.directive('app', appDirective)
.config()

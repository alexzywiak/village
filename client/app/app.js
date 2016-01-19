
import 'normalize.css';

import angular from 'angular';
import uiRouter from 'angular-ui-router';
import ngAnimate from 'angular-animate';

import {appDirective} from './app.directive';

angular.module('app', [
  uiRouter,
  ngAnimate
])
.directive('app', appDirective);
//.config()

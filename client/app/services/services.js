
import angular from 'angular';
import {api} from './api';
import {users} from './users';

export const services = angular.module('services', [])
	.factory('Users', users)
  .constant('API', api);


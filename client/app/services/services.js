
import angular from 'angular';
import {api} from './api';
import {users} from './users';
import {auth} from './auth';

export const services = angular.module('services', [])
	.factory('Users', users)
	.factory('Auth', auth)
  .constant('API', api);



import angular from 'angular';
import {api} 	 from './api';
import {users} from './users';
import {tasks} from './tasks';
import {auth}  from './auth';

export const services = angular.module('services', [])
	.factory('Users', users)
	.factory('Tasks', tasks)
	.factory('Auth', auth)
  .constant('API', api);


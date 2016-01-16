process.env.NODE_ENV = 'test';

var expect = require('chai').expect;
var requets = require('supertest');
var express = require('express');

var app = require('../../index');
var db = require('../../app/config/bookshelf.config.js');

describe('User Routes', function(){

	it('should not be totally busted', function(){
		expect(true).to.equal(true);
	});
});	
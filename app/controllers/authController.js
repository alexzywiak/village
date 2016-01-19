/*jslint node: true */
'use strict';

var jwt = require('jsonwebtoken');
var _ = require('lodash');

var secret = require('../config/auth.config').secret;

module.exports = {

  authorize: function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      jwt.verify(token, secret, function(err, decoded) {
        if (err) {
          console.error(err);
          return res.status(403).send('error authorizing token');
        } else {
          req.token = decoded;
          return next();
        }
      });
    } else {
      console.error('not authorized');
      return res.sendStatus(403);
    }
  },

  createToken: function(user) {
    return jwt.sign(_.omit(user.attributes, 'password'), secret, {
      expiresIn: 24 * 60 * 60
    });
  }
};

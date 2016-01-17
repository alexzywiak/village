'use strict';

/**
 * Taken from http://kroltech.com/2014/05/30/sanitizing-xss-and-html-with-express-middleware/
 */

var sanitizer = require('sanitize-html'),
  _ = require('lodash');

var before;

module.exports = function(config, errors) {
  return function(req, res, next) {
    if (req.body) {
      _.each(req.body, function(value, key) {
        if (!parseInt(value, 10) && value !== null) {
          // Hack to allow empty arrays through
          if (Array.isArray(value) && value.length) {
            if (typeof value === 'string') {
              value = value.replace(/&gt;/gi, '>');
              value = value.replace(/&lt;/gi, '<');
              value = value.replace(/(&copy;|&quot;|&amp;)/gi, '');
            }
            req.body[key] = sanitizer(value, {
              allowedTags: []
            });
          }
        }
      });
    }
    return next();
  };
};

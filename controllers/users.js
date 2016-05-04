var express    = require('express'),
    session    = require('express-session'),
    app        = express.Router(),
    bcrypt     = require('bcryptjs'),
    mongoose   = require('mongoose');

var User = require('../models/User');

app.route('/')
  .get(function(req, res, next) {
    res.sendFile('../views/index.html');
  })


module.exports = app;

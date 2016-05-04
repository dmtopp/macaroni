var express    = require('express'),
    session    = require('express-session'),
    controller = express.Router(),
    bcrypt     = require('bcryptjs'),
    mongoose   = require('mongoose');

var User = require('../models/User');

controller.route('/login')
  .post(function(req, res, next) {
    console.log(req.body);
    res.send();
  })

controller.post('/register', function(req, res, next) {
  var userInfo = {
    username: req.body.newUsername,
    password: req.body.newPassword,
    confirmPassword: req.body.confirmPassword
  };
  User.find({ username: userInfo.username }, function(err, users) {
    // console.log(userInfo.username);
    console.log(users);
    if (users.length >= 1) {
      // res.send('Username already exists!');
      res.json({ message: 'That username already exists!' });
    } else {
      User.create(userInfo, function(err, user) {
        if (err) console.log(err);
        console.log(user);
        res.json({ message: 'User account created!' ,
                   username: userInfo.username });
      })
    }
  })
})


module.exports = controller;

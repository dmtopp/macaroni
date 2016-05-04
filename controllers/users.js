var express    = require('express'),
    session    = require('express-session'),
    controller = express.Router(),
    bcrypt     = require('bcryptjs'),
    mongoose   = require('mongoose'),
    salt = bcrypt.genSaltSync(10);

var User = require('../models/User');

controller.route('/login')
  .post(function(req, res, next) {
    var userInfo = {
      username: req.body.username,
      password: req.body.password
    };

    User.find({ username: userInfo.username }, function(err, user) {
      console.log(userInfo.password);
      var passwordIsValid = bcrypt.compareSync(userInfo.password, user[0].password);
      if (passwordIsValid) {
        res.json({ message: 'Thanks! You are now logged in.',
                   username: user[0].username })
      } else {
          res.json({ message: 'Incorrect pasword.  Please try again!',
                     username: false });
      }
    })
  })

controller.post('/register', function(req, res, next) {
  var userInfo = {
    username: req.body.newUsername,
    password: bcrypt.hashSync(req.body.newPassword, salt),
    confirmPassword: req.body.confirmPassword
  };
  var passwordsMatch = req.body.newPassword === req.body.confirmPassword;
  User.find({ username: userInfo.username }, function(err, users) {
    // console.log(userInfo.username);
    console.log(users);
    if (users.length >= 1) {
      // res.send('Username already exists!');
      res.json({ message: 'That username already exists!' });
    } else if (!passwordsMatch) {
      res.json({ message: 'Passwords do not match!' });
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

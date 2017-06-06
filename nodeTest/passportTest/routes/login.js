var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/', function (req, res) {
    var username = req.user ? req.user.username : '';
//    console.log('a', req.flash('error'));
    res.render('login', {title: '登陆', username: username, message: req.flash('error')});
});

router.post('/', passport.authenticate('local', {failureRedirect: '/login',
//   session: false,
    failureFlash: true}), function (req , res) {
       res.redirect('/users');
//    res.end(req.user.username + req.isAuthenticated());
});

module.exports = router;

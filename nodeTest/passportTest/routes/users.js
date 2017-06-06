var express = require('express');
var router = express.Router();
var passport = require('passport');

router.use(function (req, res, next) {
    console.log(req.isAuthenticated())
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
});

/* GET users listing. */
router.get('/', function(req, res) {
    if (req.user) {
        res.end('hello '+req.user.username);
    } else {
        res.end('please login.');
    }

});

module.exports = router;

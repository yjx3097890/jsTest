var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  
   if (!req.signedCookies.name) {
        res.cookie('name', 'tobi',  { signed: true });
   }
   res.render('index', { title: 'Express' });
});

module.exports = router;

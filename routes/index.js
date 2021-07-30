var express = require('express');
var router = express.Router();

/*Middleware initialization*/
const commonMiddleWare = require('../middleware/commonMiddleWare');
const commonMiddleWareObj = new commonMiddleWare;
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});




module.exports = router;

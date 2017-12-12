//import { logger } from 'handlebars/handlebars.runtime';

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  logger.info("Rendering");
  res.render('index', { title: 'Expresso' });
  logger.error("Error");
});

module.exports = router;



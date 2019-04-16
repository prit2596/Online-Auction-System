var express = require('express');
var router = express.Router();

var Category = require('./category.controller')

router.post('/create', Category.createCategory);
router.get('/get', Category.getCategory);


module.exports = router;
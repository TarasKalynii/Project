const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', function (req, res) {
  console.log('Hello World!');
});


module.exports = router;
//треба добавити клас а не стилі!!!!!!!!!

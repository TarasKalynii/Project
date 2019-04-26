const express = require('express');
const router = express.Router();
const User = require('../models/user');

function checkingSessionAdmin(req, res, next) {
  if (req.session.user_id == '5caf69ce12f07b103145f3a0') {
    next();
  }
  else {
    res.redirect('/login');
  }
}


router.get('/', checkingSessionAdmin, function (req, res) {
  var settings = JSON.parse(req.query.settings);
  User.find({ "first_name": { "$regex": settings.searchString, "$options": "i" },
  'type': { $in: settings.filter } },null,
  {skip: settings.countOfLoad - 10, limit: 10, },
   function(err, users) {
    var userMap = [];
    users.forEach(function(user, i) {
      userMap[i] = user;
    });
    res.send(userMap);
  });
});

router.patch('/', function (req, res) {
  User.findOneAndUpdate({ _id: req.body.userId }, { $set: { type: 'singer' } }, function(err, doc) {
});
  res.send('ok');
});



module.exports = router;

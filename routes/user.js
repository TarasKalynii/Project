const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

function checkingSession(req, res, next) {
  if (req.session.user_id) {
    next();
  }
  else {
    res.redirect('/login');
  }
}



//створення користувача
router.post('/',async function (req, res) {
  try {
    const user = await User.findOne({email: req.body.email});
    if (user === null) {
      if (req.body.password === req.body.repeatPassword) {
        if(req.body.type === undefined){
          req.body.type = "listener";
        }
          const hashPassword = await bcrypt.hash(req.body.password, 10);
          req.body.password = hashPassword;
          const newUser = await User.create(req.body);
          res.send('is registered');
        } else {
          res.send("repeatPassword");
        }
      } else {
        res.send("email");
      }
  } catch (e) {
    console.log(e);
  }
  });


//редагування користувача
router.patch('/:id',async function (req, res) {
  var query = { _id: req.params.id };
  req.newData = req.body;
  const updateUser = await User.findOneAndUpdate(query, req.newData, {upsert:true});
  res.send(updateUser);
  });

//авторизація
  router.get('/',async function (req, res) {
      try {
        const user = await User.findOne({ email: req.query.email});
        if (user === null) {
          res.send("email");
        } else {
          const match = await bcrypt.compare(req.query.password, user.password);
          if(match) {
            req.session.user_id = user._id;
            res.send();
          } else {
            res.send("password");
          }
        }
      } catch (e) {
        res.send("error");
      }
  });

  //sendprofile
    router.get('/sendProfile', checkingSession, async function (req, res) {
        try {
            let user = await User.findById(req.session.user_id).select('-email -password').populate({path: 'addedSongIds', populate : { path : 'releasesId', populate : { path : 'autorsIds', select : '-email -password'}}});
            res.send(user);
        } catch (e) {
          console.log(e);
          res.send("error");
        }
    });



module.exports = router;

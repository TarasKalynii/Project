const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Song = require('../models/song');
const Release = require('../models/release');

router.get('/search',async function (req, res) {
  let result = {};
  result.singerMap = await User.find({ "pseudonym": { "$regex": req.query.searchString.normalize('NFD'), "$options": "i" }, 'type': "singer" }).select('-email -password').populate( { path: 'releasesIds', populate : { path : 'songsIds autorsIds', select : '-email -password' }  } ).populate( { path: 'songsIds', populate : { path : 'releasesId', populate : { path : 'autorsIds', select : '-email -password' } } }  );
  result.songMap = await Song.find({ "name": { "$regex": req.query.searchString.normalize('NFD'), "$options": "i" }}).populate({ path: 'releasesId', populate : { path : 'autorsIds', select : '-email -password' } });
  result.releaseMap = await Release.find({ "name": { "$regex": req.query.searchString.normalize('NFD'), "$options": "i" }}).populate({ path: 'songsIds', populate : { path : 'autorsIds', select : '-email -password' } }).populate( { path: 'autorsIds' } );
  res.send(result);
});

router.patch('/addSong',async function (req, res) {
  console.log(req.body);
  res.send('Added');
});



router.patch('/addRelease',async function (req, res) {
  console.log(req.body);
  let user = await User.findById(req.session.user_id).select('-email -password');
  if(!user.addReleasesIds.includes(req.body.id)){
    console.log('here');
    addFullRelease(req.session.user_id, req.body.id);
    res.send('Added');
  }else {
    res.send('Was added');
  }
});

async function addFullRelease(user_id, id) {
  // let addRelease = await User.findOneAndUpdate(
  // { _id: user_id},
  // { $push: { addReleasesIds:  } }
  // );

}

module.exports = router;

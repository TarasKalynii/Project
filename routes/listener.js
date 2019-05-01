const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Song = require('../models/song');
const Release = require('../models/release');

router.get('/search', async function (req, res) {
  var result = {};
  var singerFind = await User.find({ "pseudonym": { "$regex": req.query.searchString, "$options": "i" },
  'type': "singer" },null,
   function(err, users) {
    var userMap = [];
    users.forEach(function(user, i) {
      userMap[i] = user;
    });
    result.singerMap = userMap;
  });
  var songFind = await Song.find({ "name": { "$regex": req.query.searchString, "$options": "i" }
}, null,
   function(err, songs) {
    var songMap = [];
    songs.forEach(function(song, i) {
    Release.findById(song.releasesId, async function (err, doc){
        // doc is a Document
        var autorsList = [];
        for (var i = 1; i < doc.autorsIds.length; i++) {
          var singerFind = await User.findById(doc.autorsIds[i], function (err, doc){
          autorsList.push(doc.pseudonym);
        });
      }
      var autorString = autorsList[0];
      for (var i = 1; i < autorsList.length; i++) {
        autorString += ' & ' + autorsList[i];
      }
      //song.name = autorString;
      //tuuuuuuuuuuuuuuuuuuuut
      //console.log(song + 'here');
});
      //console.log(song);
      songMap[i] = song;
    });
    result.songMap = songMap;
  });
  var releaseFind = await Release.find({ "name": { "$regex": req.query.searchString, "$options": "i" }
}, null,
   function(err, releases) {
    var releaseMap = [];
    releases.forEach(function(release, i) {
      releaseMap[i] = release;
    });
    result.releaseMap = releaseMap;
  });
  res.send(result);
});


module.exports = router;

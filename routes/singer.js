const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const path  = require('path');
const User = require('../models/user');
const Song = require('../models/song');
const Release = require('../models/release');
const multiparty = require('multiparty');
const fileUpload = require('express-fileupload');
const bodyParser = require("body-parser");
const fs = require('file-system');



router.get('/', function (req, res) {
  var settings = JSON.parse(req.query.settings);
  var countDocs;
  User.count({ "first_name": { "$regex": settings.searchString, "$options": "i" },
  'type': { $in: settings.filter } },
   function(err, count) {
    countDocs = count;
  });

  User.find({ "first_name": { "$regex": settings.searchString, "$options": "i" },
  'type': { $in: settings.filter } },null,
  {skip: settings.countOfLoad - 10, limit: 10, },
   function(err, users) {
    var userMap = [];
    users.forEach(function(user, i) {
      userMap[i] = user;
    });
    var userList = {
      userMap : userMap,
      countDocs : countDocs
    }
    res.send(userList);
  });
});















router.post('/', async function (req, res) {
  //log req
  //console.log(req.files);



  //createRelease
  var nameOfRelease = req.body.nameOfRelease;
  var autorsList = [];
  Array.prototype.forEach.call(req.body.autorsList, function (id) {
    autorsList.push(id);
  });
  var newRelease = await new Release({ name: nameOfRelease });
  var saveNewRelease = await newRelease.save();
  var updateNewRelease = await Release.findOneAndUpdate(
  { _id: newRelease._id },
  //with each or double my id NE DOPOMOGLO
  { $push: { autorsIds: { $each: autorsList }   } }
  );
  //saveImage
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.image;
  var dir = './uploads/' + updateNewRelease._id;

  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir);
  }
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('uploads/' + updateNewRelease._id + '/' + updateNewRelease._id + '.jpg', function(err) {
    if (err)
      return res.status(500).send(err);
  });


  for (var i = 1; i < autorsList.length; i++) {
    var updateAutor = await User.findOneAndUpdate(
    { _id: autorsList[i] },
    { $push: { releasesIds: newRelease._id   } }
    );
  }



















  //create song
  var songsIds = [];
  var autorsForEverySong = [];
if (req.body.orderOfSongs.length == 1) {
  var autorsSongList = [];
  Array.prototype.forEach.call(req.body.autorsForEverySong.split(','), function (id) {
    autorsSongList.push(id);
  });
  var newSong = await new Song({ name: req.body.songNamesList, order: req.body.orderOfSongs, releasesId: updateNewRelease._id });
  var saveNewSong = await newSong.save();
  var updateNewSong = await Song.findOneAndUpdate(
  { _id: newSong._id },
  { $push: { autorsIds: autorsSongList  } }
  );
  //saveSong
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.songsFileList;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('uploads/' + updateNewRelease._id + '/' + updateNewSong._id + '.mp3', function(err) {
    if (err)
      return res.status(500).send(err);

  });
  songsIds.push(updateNewSong._id);
  var updateNewRelease = await Release.findOneAndUpdate(
  { _id: newRelease._id },
  //with each or double my id NE DOPOMOGLO
  { songsIds:  songsIds }
  );
  //add songsIds
  for (var i = 1; i < autorsSongList.length; i++) {
    var updateAutor = await User.findOneAndUpdate(
    { _id: autorsSongList[i] },
    { $push: { songsIds: updateNewSong._id   } }
    );
  }


}else {
  for (var i = 0; i < req.body.orderOfSongs.length; i++) {
  Array.prototype.forEach.call(req.body.autorsForEverySong, function (arrayOfId) {
    autorsForEverySong.push(arrayOfId.split(','));
  });
  var autorsSongList = [];
  Array.prototype.forEach.call(autorsForEverySong[i], function (id) {
    autorsSongList.push(id);
  });
  var newSong = await new Song({ name: req.body.songNamesList[i], order: req.body.orderOfSongs[i], releasesId: updateNewRelease._id });
  var saveNewSong = await newSong.save();
  var updateNewSong = await Song.findOneAndUpdate(
  { _id: newSong._id },
  { $push: { autorsIds: autorsSongList  } }
  );




  //saveSong
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.songsFileList[i];

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('uploads/' + updateNewRelease._id + '/' + updateNewSong._id + '.mp3', function(err) {
    if (err)
      return res.status(500).send(err);

  });
  songsIds.push(updateNewSong._id);

}


var updateNewRelease = await Release.findOneAndUpdate(
{ _id: newRelease._id },
//with each or double my id NE DOPOMOGLO
{ $push: { songsIds: { $each: songsIds }   } }
);

//addAutors for songs
for (var j = 0; j < req.body.autorsForEverySong.length; j++) {
  var songAutorsList = req.body.autorsForEverySong[j].split(',');
for (var i = 1; i < songAutorsList.length; i++) {
  var updateAutor = await User.findOneAndUpdate(
  { _id: songAutorsList[i]},
  { $push: { songsIds: songsIds[j]  } }
  );
}
}

}


  res.send('Files uploaded!');
});







// async function createRelease(fields) {
//   var nameOfRelease = fields.nameOfRelease[0];
//   var autorsList = [];
//   Array.prototype.forEach.call(fields.autorsList, function (id) {
//     autorsList.push(id);
//   });
//   var newRelease = await new Release({ name: nameOfRelease });
//   var saveNewRelease = await newRelease.save();
//   var updateNewRelease = await Release.findOneAndUpdate(
//   { _id: newRelease._id },
//   { $push: { autorsIds: autorsList  } }
//   );
//
// }

// function saveImage() {
//   if (Object.keys(req.files).length == 0) {
//     return res.status(400).send('No files were uploaded.');
//   }
//
//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   let sampleFile = req.files.image;
//
//   // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv('./uploads/filename.jpg', function(err) {
//     if (err)
//       return res.status(500).send(err);
//
//   });
// }


// async function createSong() {
//   //create song
//   var autorsForEverySong = [];
// if (req.body.orderOfSongs.length == 1) {
//   var autorsSongList = [];
//   Array.prototype.forEach.call(req.body.autorsForEverySong.split(','), function (id) {
//     autorsSongList.push(id);
//   });
//   var newSong = await new Song({ name: req.body.songNamesList, order: req.body.orderOfSongs });
//   var saveNewSong = await newSong.save();
//   var updateNewSong = await Song.findOneAndUpdate(
//   { _id: newSong._id },
//   { $push: { autorsIds: autorsSongList  } }
//   );
//   //saveSong
//   if (Object.keys(req.files).length == 0) {
//     return res.status(400).send('No files were uploaded.');
//   }
//
//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   let sampleFile = req.files.songsFileList;
//
//   // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv('uploads/' + updateNewRelease._id + '/' + updateNewSong._id + '.mp3', function(err) {
//     if (err)
//       return res.status(500).send(err);
//
//   });
// }else {
//   for (var i = 0; i < req.body.orderOfSongs.length; i++) {
//   Array.prototype.forEach.call(req.body.autorsForEverySong, function (arrayOfId) {
//     autorsForEverySong.push(arrayOfId.split(','));
//   });
//   var autorsSongList = [];
//   Array.prototype.forEach.call(autorsForEverySong[i], function (id) {
//     autorsSongList.push(id);
//   });
//   var newSong = await new Song({ name: req.body.songNamesList[i], order: req.body.orderOfSongs[i] });
//   var saveNewSong = await newSong.save();
//   var updateNewSong = await Song.findOneAndUpdate(
//   { _id: newSong._id },
//   { $push: { autorsIds: autorsSongList  } }
//   );
//   //saveSong
//   if (Object.keys(req.files).length == 0) {
//     return res.status(400).send('No files were uploaded.');
//   }
//
//   // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//   let sampleFile = req.files.songsFileList[i];
//
//   // Use the mv() method to place the file somewhere on your server
//   sampleFile.mv('uploads/' + updateNewRelease._id + '/' + updateNewSong._id + '.mp3', function(err) {
//     if (err)
//       return res.status(500).send(err);
//
//   });
//
// }
// }
// }



module.exports = router;

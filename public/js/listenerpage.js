//макс має поянити як краще
var user = {};
window.onload = function() {
  getUser();
  logout();
  bindSearch();

}

//через фільтер зберігати массив знайднених пісень, щоб не шукати купу разів










function bindSearch() {
  document.getElementById("searchButton").addEventListener("click", search);
  document.querySelector('#searchInput').addEventListener('keypress', function (e) {
    var key = e.which || e.keyCode;
    if (key === 13) { // 13 is enter
      // code for enter
      search();
    }
});
}

function search() {
  requestSearch(document.getElementById('searchInput').value);
  //console.log('search working');
}

function requestSearch(searchString) {
  $.ajax({
    url: '/listener/search',
    method: 'GET',
    data: { searchString: searchString },
    success: createRelustSearch,
    error: function(){
      console.log("error");
    }
  });
}


function createRelustSearch(result) {
  console.log(user);
  if (document.getElementById("searchDiv")) {
    document.getElementById("searchDiv").remove();
  }
  //create  search div
  var searchDiv = document.createElement("div");
  searchDiv.classList.add("searchDiv");
  searchDiv.id = "searchDiv";
  document.body.appendChild(searchDiv);
  if (result.singerMap.length != 0) {
    createSearchSingers(result.singerMap);
  }
  if (result.songMap.length != 0) {
    createSearchSongs(result.songMap);
  }
  if (result.releaseMap.length != 0) {
    createSearchReleases(result.releaseMap);
  }
}

function createSearchReleases(releaseMap) {
  //create songs search div
  var releasesSearchDiv = document.createElement("div");
  releasesSearchDiv.classList.add("releasesSearchDiv");
  releasesSearchDiv.id = "releasesSearchDiv";
  //create songs Search Div Title Div
  var releasesSearchDivTitleDiv = document.createElement("div");
  releasesSearchDivTitleDiv.classList.add("releasesSearchDivTitleDiv");
  releasesSearchDivTitleDiv.id = "releasesSearchDivTitleDiv";
  //create title tag with "Releases"
  // Create a <h1> element
  var title = document.createElement("H1");
  title.classList.add("titleForSearch");
  title.id = "releasesTitleForSearch";
  // Create a text node
  var textForTitle = document.createTextNode("Releases");
  // Append the text to <h1>
  title.appendChild(textForTitle);
  releasesSearchDivTitleDiv.appendChild(title);
  releasesSearchDiv.appendChild(releasesSearchDivTitleDiv);
  var releasesDiv = document.createElement("div");
  releasesDiv.classList.add("releasesDiv");
  releasesDiv.id = "releasesDiv";
  //create releasesDiv
  for (var i = 0; i < releaseMap.length; i++) {
    var releaseDiv = document.createElement("div");
    releaseDiv.classList.add("releaseDiv");
    releaseDiv.id = releaseMap[i]._id + "Div";
    var releaseImageDiv = document.createElement("div");
    releaseImageDiv.classList.add("releaseImageDiv");
    releaseImageDiv.id = releaseMap[i]._id + "ImageDiv";
    var img = document.createElement("IMG");
    img.classList.add("releaseImage");
    img.id = releaseMap[i]._id + "Image";
    img.src = 'uploads/' + releaseMap[i]._id + '/' + releaseMap[i]._id + '.jpg';
    img.releaseInfo = releaseMap[i];
    releaseImageDiv.appendChild(img);
    releaseDiv.appendChild(releaseImageDiv);
    var initDiv = document.createElement("div");
    initDiv.classList.add("initDiv");
    initDiv.id = releaseMap[i]._id + 'initDiv';
    initDiv.innerHTML = makeAuthors(releaseMap[i].autorsIds) + " - " + releaseMap[i].name;
    let arrayAddedReleaseSongs = getArrayAddedSongs(user.addedSongIds, releaseMap[i].songsIds);
    if (!(arrayAddedReleaseSongs.length === releaseMap[i].songsIds.length)) {
      var button = document.createElement("button");
      button.classList.add("addButton");
      button.id = releaseMap[i]._id;
      button.innerHTML = "+";
      button.typeContent = "release";
      button.releaseInfo = releaseMap[i];
      initDiv.appendChild(button);
    }
    releaseDiv.appendChild(initDiv);
    releasesDiv.appendChild(releaseDiv);
    //console.log(releaseMap[i]);
  }
  releasesSearchDiv.appendChild(releasesDiv);
  searchDiv.appendChild(releasesSearchDiv);
  Array.prototype.forEach.call(document.getElementsByTagName("IMG"), image => {
    image.addEventListener("click", createReleasePage);
  });
  Array.prototype.forEach.call(document.getElementsByClassName("addButton"), button => {
    button.addEventListener("click", addSomething);
  });
  //console.log(releaseMap);
}




function createSearchSongs(songMap) {
  //create songs search div
  var songsSearchDiv = document.createElement("div");
  songsSearchDiv.classList.add("songsSearchDiv");
  songsSearchDiv.id = "songsSearchDiv";
  //create songs Search Div Title Div
  var songsSearchDivTitleDiv = document.createElement("div");
  songsSearchDivTitleDiv.classList.add("songsSearchDivTitleDiv");
  songsSearchDivTitleDiv.id = "songsSearchDivTitleDiv";
  //create title tag with "Singers"
  // Create a <h1> element
  var title = document.createElement("H1");
  title.classList.add("titleForSearch");
  title.id = "songsTitleForSearch";
  // Create a text node
  var textForTitle = document.createTextNode("Songs");
  // Append the text to <h1>
  title.appendChild(textForTitle);
  songsSearchDivTitleDiv.appendChild(title);
  songsSearchDiv.appendChild(songsSearchDivTitleDiv);
  //create songs audio Div
  var songsAudioDiv = document.createElement("div");
  songsAudioDiv.classList.add("songsAudioDiv");
  songsAudioDiv.id = "songsAudioDiv";
  //add songs audio
  for (var i = 0; i < songMap.length; i++) {
    var songDiv = document.createElement("div");
    songDiv.classList.add("songDiv");
    songDiv.id = songMap[i]._id + 'Div';
    var audioDiv = document.createElement("div");
    audioDiv.classList.add("audioDiv");
    audioDiv.id = songMap[i]._id + 'audioDiv';
    var audio = document.createElement('audio');
    audio.id = songMap[i]._id;
    audio.preload = 'false';
    audio.controls = 'controls';
    audio.src = 'uploads/' + songMap[i].releasesId._id + '/' + songMap[i]._id + '.mp3';
    audio.type = 'audio/mpeg';
    audioDiv.appendChild(audio);
    var initDiv = document.createElement("div");
    initDiv.classList.add("initDiv");
    initDiv.id = songMap[i]._id + 'initDiv';
    initDiv.innerHTML = makeAuthors(songMap[i].releasesId.autorsIds) + " - " + songMap[i].name;
    // if (!user.addedSongIds.includes(songMap[i]._id)) {
    //   var button = document.createElement("button");
    //   button.classList.add("addButton");
    //   button.id = songMap[i]._id;
    //   button.typeContent = 'song';
    //   button.innerHTML = "+";
    //   button.songInfo = songMap[i];
    //   initDiv.appendChild(button);
    // }
    songDiv.appendChild(audioDiv);
    songDiv.appendChild(initDiv);
    songsAudioDiv.appendChild(songDiv);
    //console.log(songDiv[i]);
  }
  Array.prototype.forEach.call(document.getElementsByClassName("addButton"), button => {
    button.addEventListener("click", addSomething);
  });
  songsSearchDiv.appendChild(songsAudioDiv);
  searchDiv.appendChild(songsSearchDiv);
}

function makeAuthors(array) {
  let authorsList = array[1].pseudonym;
  for (var i = 2; i < array.length; i++) {
    authorsList += ' & ' + array[i].pseudonym;
  }
  return authorsList;
}

function createSearchSingers(singerMap) {
  //create singers search div
  var singersSearchDiv = document.createElement("div");
  singersSearchDiv.classList.add("singersSearchDiv");
  singersSearchDiv.id = "singersSearchDiv";
  //create singers Search Div Title Div
  var singersSearchDivTitleDiv = document.createElement("div");
  singersSearchDivTitleDiv.classList.add("singersSearchDivTitleDiv");
  singersSearchDivTitleDiv.id = "singersSearchDivTitleDiv";
  //create title tag with "Singers"
  // Create a <h1> element
  var title = document.createElement("H1");
  title.classList.add("titleForSearch");
  title.id = "singersTitleForSearch";
  // Create a text node
  var textForTitle = document.createTextNode("Singers");
  // Append the text to <h1>
  title.appendChild(textForTitle);
  singersSearchDivTitleDiv.appendChild(title);
  singersSearchDiv.appendChild(singersSearchDivTitleDiv);
  //create singers button Div
  var singersButtonDiv = document.createElement("div");
  singersButtonDiv.classList.add("singersButtonDiv");
  singersButtonDiv.id = "singersButtonDiv";
  //add singers button
  for (var i = 0; i < singerMap.length; i++) {
    var singerDiv = document.createElement("div");
    singerDiv.classList.add("singerDiv");
    singerDiv.id = singerMap[i]._id + 'Div';
    var button = document.createElement("button");
    button.classList.add("singerButton");
    button.id = singerMap[i]._id;
    button.innerHTML = singerMap[i].pseudonym;
    button.singerInfo = singerMap[i];
    singerDiv.appendChild(button);
    singersButtonDiv.appendChild(singerDiv);
    //console.log(singerMap[i]);
  }
  singersSearchDiv.appendChild(singersButtonDiv);
  searchDiv.appendChild(singersSearchDiv);
  Array.prototype.forEach.call(document.getElementsByClassName('singerButton'), button => {
    button.addEventListener("click", getSingerPage);
  });
  Array.prototype.forEach.call(document.getElementsByClassName("addButton"), button => {
    button.addEventListener("click", addSomething);
  });
  //console.log(singerMap);
}

function closeSearch() {
  if (document.getElementById("searchDiv")) {
    document.getElementById("searchDiv").style.display = 'none';
  }
}

function showCreateRelease() {
  document.getElementById("openCreateRelease").style.display = 'none';
  document.getElementById("createRelease").style.display = 'block';
}

function closeSingerPage() {
  if (document.getElementById("singerDiv")) {
    document.getElementById("singerDiv").style.display = 'none';
  }
}

function getSingerPage() {
  let singerInfo = event.target.singerInfo;
  closeSearch();
  //console.log(singerInfo);
  //create singers search div
  var singerDiv = document.createElement("div");
  singerDiv.classList.add("singerDiv");
  singerDiv.id = "singerDiv";
  document.body.appendChild(singerDiv);
  //create singers Search Div Title Div
  var singerTitleDiv = document.createElement("div");
  singerTitleDiv.classList.add("singerTitleDiv");
  singerTitleDiv.id = "singerTitleDiv";
  //create title tag with "SingerName"
  // Create a <h1> element
  var title = document.createElement("H1");
  title.classList.add("titleForSinger");
  title.id = "titleForSinger";
  // Create a text node
  var textForTitle = document.createTextNode(singerInfo.pseudonym);
  // Append the text to <h1>
  title.appendChild(textForTitle);
  singerTitleDiv.appendChild(title);
  singerDiv.appendChild(singerTitleDiv);
  //create songs audio Div
  var songsAudioDiv = document.createElement("div");
  songsAudioDiv.classList.add("songsAudioDiv");
  songsAudioDiv.id = "songsAudioDiv";
  //create singers Search Div Title Div
  var songsAudioDivTitleDiv = document.createElement("div");
  songsAudioDivTitleDiv.classList.add("songsAudioDivTitleDiv");
  songsAudioDivTitleDiv.id = "songsAudioDivTitleDiv";
  //create title tag with "SingerName"
  // Create a <h1> element
  var songsAudioTitle = document.createElement("H1");
  songsAudioTitle.classList.add("songsAudioTitle");
  songsAudioTitle.id = "songsAudioTitle";
  // Create a text node
  var songsAudioTitleTextForTitle = document.createTextNode('Songs');
  // Append the text to <h1>
  songsAudioTitle.appendChild(songsAudioTitleTextForTitle);
  songsAudioDivTitleDiv.appendChild(songsAudioTitle);
  songsAudioDiv.appendChild(songsAudioDivTitleDiv);
  //add songs audio
  for (var i = 0; i < singerInfo.songsIds.length; i++) {
    var songDiv = document.createElement("div");
    songDiv.classList.add("songDiv");
    songDiv.id = singerInfo.songsIds[i]._id + 'Div';
    var audioDiv = document.createElement("div");
    audioDiv.classList.add("audioDiv");
    audioDiv.id = singerInfo.songsIds[i]._id + 'audioDiv';
    var audio = document.createElement('audio');
    audio.id = singerInfo.songsIds[i]._id;
    audio.preload = 'false';
    audio.controls = 'controls';
    audio.src = 'uploads/' + singerInfo.songsIds[i].releasesId._id + '/' + singerInfo.songsIds[i]._id + '.mp3';
    audio.type = 'audio/mpeg';
    audioDiv.appendChild(audio);
    var initDiv = document.createElement("div");
    initDiv.classList.add("initDiv");
    initDiv.id = singerInfo.songsIds[i]._id + 'initDiv';
    initDiv.innerHTML = makeAuthors(singerInfo.songsIds[i].releasesId.autorsIds) + " - " + singerInfo.songsIds[i].name;
    // if (!user.addSongsIds.includes(singerInfo.songsIds[i]._id)) {
    //   var button = document.createElement("button");
    //   button.classList.add("addButton");
    //   button.id = singerInfo.songsIds[i]._id;
    //   button.typeContent = "song";
    //   button.innerHTML = "+";
    //   button.songInfo = singerInfo.songsIds[i];
    //   initDiv.appendChild(button);
    // }
    songDiv.appendChild(audioDiv);
    songDiv.appendChild(initDiv);
    songsAudioDiv.appendChild(songDiv);
    //console.log(songDiv[i]);
  }
  singerDiv.appendChild(songsAudioDiv);
  //create songs search div
  var releasesDiv = document.createElement("div");
  releasesDiv.classList.add("releasesDiv");
  releasesDiv.id = "releasesDiv";
  //create songs Search Div Title Div
  var releasesDivTitleDiv = document.createElement("div");
  releasesDivTitleDiv.classList.add("releasesDivTitleDiv");
  releasesDivTitleDiv.id = "releasesDivTitleDiv";
  //create title tag with "Releases"
  // Create a <h1> element
  var releasesTitle = document.createElement("H1");
  releasesTitle.classList.add("titleForReleases");
  releasesTitle.id = "releasesTitle";
  // Create a text node
  var textForTitle = document.createTextNode("Releases");
  // Append the text to <h1>
  releasesTitle.appendChild(textForTitle);
  releasesDivTitleDiv.appendChild(releasesTitle);
  releasesDiv.appendChild(releasesDivTitleDiv);
  var releaseDiv = document.createElement("div");
  releaseDiv.classList.add("releaseDiv");
  releaseDiv.id = "releaseDiv";
  //create releasesDiv
  for (var i = 0; i < singerInfo.releasesIds.length; i++) {
    var oneReleaseDiv = document.createElement("div");
    oneReleaseDiv.classList.add("oneReleaseDiv");
    oneReleaseDiv.id = singerInfo.releasesIds[i]._id + "Div";
    var releaseImageDiv = document.createElement("div");
    releaseImageDiv.classList.add("releaseImageDiv");
    releaseImageDiv.id = singerInfo.releasesIds[i]._id + "ImageDiv";
    var img = document.createElement("IMG");
    img.classList.add("releaseImage");
    img.id = singerInfo.releasesIds[i]._id + "Image";
    img.src = 'uploads/' + singerInfo.releasesIds[i]._id + '/' + singerInfo.releasesIds[i]._id + '.jpg';
    img.releaseInfo = singerInfo.releasesIds[i];
    releaseImageDiv.appendChild(img);
    oneReleaseDiv.appendChild(releaseImageDiv);
    var initDiv = document.createElement("div");
    initDiv.classList.add("initDiv");
    initDiv.id = singerInfo.releasesIds[i]._id + 'initDiv';
    initDiv.innerHTML = makeAuthors(singerInfo.releasesIds[i].autorsIds) + " - " + singerInfo.releasesIds[i].name;
    let arrayAddedReleaseSongs = getArrayAddedSongs(user.addedSongIds, singerInfo.releasesIds[i].songsIds);
    if (!(arrayAddedReleaseSongs.length === singerInfo.releasesIds[i].songsIds.length)) {
      var button = document.createElement("button");
      button.classList.add("addButton");
      button.id = singerInfo.releasesIds[i]._id;
      button.typeContent = "release";
      button.innerHTML = "+";
      button.songInfo = singerInfo.releasesIds[i];
      initDiv.appendChild(button);
    }
    oneReleaseDiv.appendChild(initDiv);
    releaseDiv.appendChild(oneReleaseDiv);
    //console.log(releaseMap[i]);
  }
  releasesDiv.appendChild(releaseDiv);
  singerDiv.appendChild(releasesDiv);
  //console.log(releaseMap);
  Array.prototype.forEach.call(document.getElementsByTagName("IMG"), image => {
    image.addEventListener("click", createReleasePage);
  });
  Array.prototype.forEach.call(document.getElementsByClassName("addButton"), button => {
    button.addEventListener("click", addSomething);
  });
}

function createReleasePage() {
  let releaseInfo = event.target.releaseInfo;
  closeSingerPage();
  closeSearch();
  //create  release div
  var divForRelease = document.createElement("div");
  divForRelease.classList.add("divForRelease");
  divForRelease.id = "divForRelease";
  document.body.appendChild(divForRelease);
  //create  release init div
  var initDivForRelease = document.createElement("div");
  initDivForRelease.classList.add("initDivForRelease");
  initDivForRelease.id = "initDivForRelease";
  // create image div
  var imageDivForRelease = document.createElement("div");
  imageDivForRelease.classList.add("imageDivForRelease");
  imageDivForRelease.id = releaseInfo._id + "imageDivForRelease";
  //create img
  var img = document.createElement("IMG");
  img.classList.add("imageForRelease");
  img.id = releaseInfo._id + "imageForRelease";
  img.src = 'uploads/' + releaseInfo._id + '/' + releaseInfo._id + '.jpg';
  imageDivForRelease.appendChild(img);
  initDivForRelease.appendChild(imageDivForRelease);
  //create init div
  var initDiv = document.createElement("div");
  initDiv.classList.add("initDivForRelease");
  initDiv.id = releaseInfo._id + 'initDivForRelease';
  initDiv.innerHTML = makeAuthors(releaseInfo.autorsIds) + " - " + releaseInfo.name;
  let arrayAddedReleaseSongs = getArrayAddedSongs(user.addedSongIds, releaseInfo.songsIds);
  if (!(arrayAddedReleaseSongs.length === releaseInfo.songsIds.length)) {
    var button = document.createElement("button");
    button.classList.add("addButton");
    button.id = releaseInfo._id;
    button.typeContent = "release";
    button.innerHTML = "+";
    button.releaseInfo = releaseInfo;
    initDiv.appendChild(button);
  }
  initDivForRelease.appendChild(initDiv);
  divForRelease.appendChild(initDivForRelease);
  //create songs div
  var divForSongs = document.createElement("div");
  divForSongs.classList.add("divForSongs");
  divForSongs.id = releaseInfo._id + 'divForSongs';
  //add songs audio
  for (var i = 0; i < releaseInfo.songsIds.length; i++) {
    var songDiv = document.createElement("div");
    songDiv.classList.add("songDivForRelease");
    songDiv.id = releaseInfo.songsIds[i]._id + 'Div';
    var audioDiv = document.createElement("div");
    audioDiv.classList.add("audioDivForRelease");
    audioDiv.id = releaseInfo.songsIds[i]._id + 'audioDiv';
    var audio = document.createElement('audio');
    audio.id = releaseInfo.songsIds[i]._id;
    audio.preload = 'false';
    audio.controls = 'controls';
    audio.src = 'uploads/' + releaseInfo._id + '/' + releaseInfo.songsIds[i]._id + '.mp3';
    audio.type = 'audio/mpeg';
    audioDiv.appendChild(audio);
    var initDiv = document.createElement("div");
    initDiv.classList.add("initDivForRelease");
    initDiv.id = releaseInfo.songsIds[i]._id + 'initDiv';
    initDiv.innerHTML = releaseInfo.songsIds[i].order + ". " + makeAuthors(releaseInfo.autorsIds) + " - " + releaseInfo.songsIds[i].name;
    // if (!user.addSongsIds.includes(releaseInfo.songsIds[i]._id)) {
    //   var button = document.createElement("button");
    //   button.classList.add("addButton");
    //   button.id = releaseInfo.songsIds[i]._id;
    //   button.typeContent = "song";
    //   button.innerHTML = "+";
    //   button.songInfo = releaseInfo.songsIds[i];
    //   initDiv.appendChild(button);
    // }
    songDiv.appendChild(audioDiv);
    songDiv.appendChild(initDiv);
    divForSongs.appendChild(songDiv);
    //console.log(songDiv[i]);
  }
  divForRelease.appendChild(divForSongs);
  Array.prototype.forEach.call(document.getElementsByClassName("addButton"), button => {
    button.addEventListener("click", addSomething);
  });
  console.log(releaseInfo);
}

function addSomething() {
  console.log(event.target.typeContent);
  if (event.target.typeContent === "release") {
    $.ajax({
      url: '/listener/addRelease',
      method: 'PATCH',
      data: { id : event.target.id },
      success: console.log('Add something.'),
      error: function(){
        console.log("error");
      }
    });
  }else {
    $.ajax({
      url: '/listener/addSong',
      method: 'PATCH',
      data: { id : event.target.id },
      success: console.log('Add something.'),
      error: function(){
        console.log("error");
      }
    });
  }
}

function getArrayAddedSongs(arrayAddedSongObjects, arrayReleaseSongObjects) {
  let arrayAddedReleaseSongObjects = arrayAddedSongObjects.filter(function (element, index, array) {
      return arrayReleaseSongObjects.find(function (elementF, indexF, arrayF) {
        if (elementF._id === element._id) {
          return elementF;
        }
      });
    });
    return arrayAddedReleaseSongObjects;
}



function getUser() {

      $.ajax({
        url: '/users/sendProfile',
        method: 'GET',
        data: {   },
        success: function(result){
          user = result;
          console.log(user);
          },
        error: function(){
          console.log("error");
        }
      });
}


function logout() {
  $( document ).on("click" , "#logout", function () {
    window.location.href = '/login';
  });
}

//макс має поянити як краще
var user = {};
window.onload = function() {
  getUser();
  logout();
  bindSearch();

}












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
    success: function(result){
      console.log(result);
      createRelustSearch(result);
      },
    error: function(){
      console.log("error");
    }
  });
}


function createRelustSearch(result) {
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
    audio.src = 'uploads/' + songMap[i].releasesId + '/' + songMap[i]._id + '.mp3';
    audio.type = 'audio/mpeg';
    audioDiv.appendChild(audio);
    var initDiv = document.createElement("div");
    initDiv.classList.add("initDiv");
    initDiv.id = songMap[i]._id + 'initDiv';
    initDiv.innerHTML = songMap[i].name;
    songDiv.appendChild(audioDiv);
    songDiv.appendChild(initDiv);
    songsAudioDiv.appendChild(songDiv);
    //console.log(songDiv[i]);
  }
  songsSearchDiv.appendChild(songsAudioDiv);
  searchDiv.appendChild(songsSearchDiv);
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
    singerDiv.appendChild(button);
    singersButtonDiv.appendChild(singerDiv);
    //console.log(singerMap[i]);
  }
  singersSearchDiv.appendChild(singersButtonDiv);
  searchDiv.appendChild(singersSearchDiv);
  //console.log(singerMap);
}

function getUser() {

      $.ajax({
        url: '/users/sendProfile',
        method: 'GET',
        data: {   },
        success: function(result){
          user = result;
          //console.log(user);
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

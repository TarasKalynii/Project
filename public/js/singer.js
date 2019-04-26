var userList = { users : [], countOfLoaded : 10};
var autors = ['5caf936b9ad545112b4b6258','5caf936b9ad545112b4b6258'];
var autorsForEverySong = [['5caf936b9ad545112b4b6258','5caf936b9ad545112b4b6258']];
var countOfLoaded = 1;
var formData = new FormData();

window.onload = function() {
  document.getElementById("addSong").addEventListener("click", addSong);
  document.getElementById("openCreateRelease").addEventListener("click", showCreateRelease);
  document.getElementById("closeCreateRelease").addEventListener("click", closeCreateRelease);
  document.getElementById("load").addEventListener("click", loadRelease);
  Array.prototype.forEach.call(document.getElementsByClassName('radio'), radio => {
    radio.addEventListener("click", cleanSearch);
});
  document.getElementById("search").addEventListener("click", forSearch);
  document.getElementById("more").addEventListener("click", forMore);
}



function cleanSearch() {
  document.getElementById("singers").innerHTML = "";
}

function loadRelease() {
  createFormData();
  showFormData();
  $.ajax({
      url: '/singer',
      method: 'POST',
      data: formData ,
      contentType: false,
      processData: false,
      success: function(result){
        //не встигає очищати
        console.log(result);

      },
      error: function(){

      }
    });
  }

function showFormData() {
  for (var pair of formData.entries()) {
    console.log(pair[0]+ ', ' + pair[1]);
  }
}

function createFormData() {
  formData = new FormData();

  var autorsList = autors;
  autorsList.forEach(function(autor) {
    formData.append("autorsList", autor);
});
autorsForEverySong.forEach(function(autorsForSong) {
  formData.append("autorsForEverySong", autorsForSong);
});
  var nameOfRelease = document.getElementById('nameRelease').value;
  formData.append("nameOfRelease", nameOfRelease);
  formData.append("image", document.getElementById('image').files[0]);
  Array.prototype.forEach.call(document.getElementsByClassName('nameSong'), nameSong => {
    formData.append("songNamesList", nameSong.value);
});
  Array.prototype.forEach.call(document.getElementsByClassName('numberSong'), numberSong => {
    formData.append("orderOfSongs", numberSong.value);
});
  Array.prototype.forEach.call(document.getElementsByClassName('songFile'), songFile => {
    formData.append("songsFileList", songFile.files[0]);
});
}


function success(result) {
  result.userMap.forEach(function (user, i) {
    $("#singers").append('<li id="' + user._id + '">' + user.first_name + ' ' + user.type + '</li>' + '<button type="button" id="' + user._id + '" name="' + user.first_name + '" class="add">Add</button>');
  });
  createEventForAdd();
  if (result.countDocs <= userList.countOfLoaded || result.countDocs == null ) {
    document.getElementById("more").style.display = 'none';
  }
}

function createEventForAdd() {
  Array.prototype.forEach.call(document.getElementsByClassName('add'), add => {
  add.addEventListener("click", addSinger);
});
}

function addSinger() {
  var numberChecked;
  var count = 0;
  Array.prototype.forEach.call(document.getElementsByClassName('radio'), add => {
  if (add.checked === true) {
    numberChecked = count;
  };
  count++;
});
if (numberChecked === 0) {
  document.getElementById('authorsRelease').append(", " + event.target.name);
  autors.push(event.target.id);
}else {
  var numberInSongs = numberChecked - 1;
  var countInSongs = 0;
  Array.prototype.forEach.call(document.getElementsByClassName('authors'), field => {
    if (countInSongs === numberInSongs) {
      field.append(", " + event.target.name);
      autorsForEverySong[numberInSongs].push(event.target.id);
    }
    countInSongs++;
  });
}
  var x = event.target;
  x.remove();
}

function countOfLoadUp() {
  userList.countOfLoaded += 10;
}

function searchString() {
  return document.getElementById("searchField").value;
}

function forSearch() {
  document.getElementById("more").style.display = 'block';
  document.getElementById("singers").innerHTML = "";
  userList = { users : [], countOfLoaded : 10};
  loadUsers();
}

function forMore() {
  countOfLoadUp();
  loadUsers();
}

function loadUsers() {
  var settings = {
    searchString : searchString(),
    countOfLoad : userList.countOfLoaded,
    filter : ['singer']
  };
  $.ajax({
    url: '/singer',
    method: 'GET',
    data: { settings : JSON.stringify(settings)
    },
    success: function (result) {
      //як правильно???
      success(result);
    },
    error: function(){
      console.log("error");
    }
  });
}




$( document ).on("click" , "#logout", function () {
  window.location.href = '/login';
});

function closeCreateRelease() {
  document.getElementById("openCreateRelease").style.display = 'block';
  document.getElementById("createRelease").style.display = 'none';
}

function showCreateRelease() {
  document.getElementById("openCreateRelease").style.display = 'none';
  document.getElementById("createRelease").style.display = 'block';
}

function addSong() {


//pizdec
var song = document.getElementsByClassName("song")[0].cloneNode(true);
var btn = document.createElement("BUTTON");
btn.innerHTML = "X";
btn.className = "deleteSong";
song.append(btn);
countOfLoaded = 1;
Array.prototype.forEach.call(document.getElementsByClassName('song'), add => {
  countOfLoaded++;
});
autorsForEverySong.push(['5caf936b9ad545112b4b6258', '5caf936b9ad545112b4b6258']);
var br = document.createElement("br");
song.prepend(
   br
);
song.prepend(
  countOfLoaded + " loaded"
);
// document.getElementById("authors").append(
//   countOfLoaded + " loaded"
// );
var radioBox = document.createElement("SPAN");
  radioBox.className = "radioBox";
  var radio = document.getElementsByClassName("radio")[1].cloneNode(true);
radioBox.appendChild(
  radio
);
radioBox.append(
  countOfLoaded + " loaded"
);
document.getElementById("authors").appendChild(
  radioBox
);
Array.prototype.forEach.call(document.getElementsByClassName('radio'), radio => {
  radio.addEventListener("click", cleanSearch);
});
document.getElementById("songs").appendChild(
  song
);
Array.prototype.forEach.call(document.getElementsByClassName('deleteSong'), button => {
button.addEventListener("click", deleteSong);
});
}



function deleteSong() {
  event.target.parentElement.id = "delete";
  var orderOfDelete;
  var countForSong = 0;
  Array.prototype.forEach.call(document.getElementsByClassName('song'), song => {
    if (song.id === "delete") {
      orderOfDelete = countForSong;
    }
    countForSong++;
  });
  autorsForEverySong.splice(orderOfDelete, 1)
  var countForRadioBox = 0;
  Array.prototype.forEach.call(document.getElementsByClassName('radioBox'), radioBox => {
    if ((orderOfDelete) === countForRadioBox) {
      radioBox.remove();
    }
    countForRadioBox++;
  });

  var x = event.target.parentElement;
  x.remove();
}


function eventsChecker(event) {
  console.log(event.target.id + " is working");
}

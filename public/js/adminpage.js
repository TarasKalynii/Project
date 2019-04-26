var userList = { users : [], countOfLoaded : 10};

//правильно через window.onload???
window.onload = function() {
  sendForOther();
  document.getElementById("more").addEventListener("click", sendForMore);
  document.getElementById("search").addEventListener("input", sendForOther);
  //Array.prototype.forEach.call(document.getElementsByClassName('types') - як воно працює?????
  Array.prototype.forEach.call(document.getElementsByClassName('types'), checkbox => {
  checkbox.addEventListener("change", sendForOther);
});
};




function loadUsers() {
  var settings = {
    searchString : searchString(),
    countOfLoad : userList.countOfLoaded,
    filter : createFilterList()
  };
  $.ajax({
    url: '/admin',
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

function success(result) {
  result.forEach(function (user, i) {
    if (user.type === "mbSinger") {
      $("#users").append('<li>' + user.first_name + ' ' + user.type + '</li>' + '<button type="button" id="' + user._id + '" class="changeType">Change</button>');
    } else {
      $("#users").append('<li>' + user.first_name + ' ' + user.type + '</li>');
    }
  });
  createEventForChange();
}


function sendForMore() {
  countOfLoadUp();
  loadUsers();
}

function sendForOther() {
  document.getElementById("users").innerHTML = "";
  userList = { users : [], countOfLoaded : 10};
  loadUsers();
}

function searchString() {
  return document.getElementById("search").value;
}


function countOfLoadUp() {
  userList.countOfLoaded += 10;
}

function createFilterList() {
  var filterList = [];
  Array.prototype.forEach.call(document.getElementsByClassName('types'), checkbox => {
  if (checkbox.checked) {
    filterList.push(checkbox.id);
    }
  });
  if (filterList[0] == undefined) {
    filterList = ['listener', 'singer', 'mbSinger'];
  }
  return filterList;
}

function createEventForChange() {
  Array.prototype.forEach.call(document.getElementsByClassName('changeType'), changeType => {
  changeType.addEventListener("click", sendForChangeType);
});
}

function sendForChangeType() {

  $.ajax({
    url: '/admin',
    method: 'PATCH',
    data: { userId: event.target.id
    },
    success: function (result) {

    },
    error: function(){
      console.log("error");
    }
  });
}

function eventsChecker(event) {
  console.log(event.target.id + " is working");
}

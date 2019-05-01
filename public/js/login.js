$(document).on('click', "#goLogin", function () {
  $( ".mistake" ).remove();


  const email = $('#email').val();
  const password = $('#password').val();

  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  function checking(field, fieldRule, msg) {
    if (fieldRule) {
      $(field).parents('div.blockInput').css("border-color","#ff6660");
      $(field).parents('div.blockInput').css("color","#ff6660");
      $(field).parents('div.blockInput').append(msg);
    }
  }
  function finalChecking(field, fieldRule) {
    if (fieldRule) {
      $(field).parents('div.blockInput').css("border-color","#AEABB5");
      $(field).parents('div.blockInput').css("color","#AEABB5");
    }
  }

  checking('#email', !regex.test(email) || email == '', '<div class = "mistake" >Please write your email. </div>');
  finalChecking('#email', !(!regex.test(email) || email == ''));

  checking('#password', password === '', '<div class = "mistake" >Please write your password. </div>');


  if($(document).find(".mistake").length === 0){
  $.ajax({
    url: '/users',
    method: 'GET',
    data: { email, password },
    success: function(result){
      checking('#email', result === "email"  && email != '', '<div class = "mistake" >Email is wrong. </div>');
      checking('#password', "password" === result, '<div class = "mistake" >Password is wrong. </div>');
      if (result != "email" && result != "password" && result != "error") {
        localStorage.setItem( "session", result );
        window.location.href = '/listenerpage';
      }
    },
    error: function(){
      console.log("error");
    }
  });
  }
});

window.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("goLogin").click();
  }
});

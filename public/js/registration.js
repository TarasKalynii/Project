///Front-end: AJAX side;
$(document).on('click', '#goRegistration', function(event) {
//cleaning
    $( ".mistake" ).remove();

    const pseudonym = $('#pseudonym').val();
    const first_name = $('#first_name').val();
    const last_name = $('#last_name').val();
    const email = $('#email').val();
    const password = $('#password').val();
    const repeatPassword = $('#repeatPassword').val();
    var type;
    if (window.location.pathname === '/collaboration') {
      type = 'mbSinger';
}


    function checking(field, fieldRule, msg) {
      if (fieldRule) {
        $(field).parents('div.blockInput').css("border-color","#ff6660");
        $(field).parents('div.blockInput').css("color","#ff6660");
        $(field).parents('div.blockInput').append(msg);
      }
    }
    function finalChecking(field, fieldRule) {
      if (fieldRule) {
        $(field).parents('div.blockInput').css("border-color","#a3eda4");
        $(field).parents('div.blockInput').css("color","#a3eda4");
      }
    }

    var english = /^[A-Za-z]+$/;
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    var regPassword = /^[A-Za-z0-9]+$/;

    // //checking inputs
    // //check first_name
    checking('#first_name', first_name === '', '<div class = "mistake" >Please write your first name. </div>');
    checking('#first_name', !english.test(first_name) && first_name != '', '<div class = "mistake" >Please write your first name on English. </div>');
    checking('#first_name', first_name.length > 20, '<div class = "mistake" >Max length 20 symbols. </div>');
    finalChecking('#first_name', first_name.length < 20 && english.test(first_name) && first_name != '');

    // //check last_name
    checking('#last_name', last_name === '', '<div class = "mistake" >Please write your last name. </div>');
    checking('#last_name', !english.test(last_name) && last_name != '', '<div class = "mistake" >Please write your last name on English. </div>');
    checking('#last_name', last_name.length > 20, '<div class = "mistake" >Max length 20 symbols. </div>');
    finalChecking('#last_name', last_name.length < 20 && english.test(last_name) && last_name != '');

    // //check email

    checking('#email', !regex.test(email) || email == '', '<div class = "mistake" >Please write your email. </div>');
    finalChecking('#email', !(!regex.test(email) || email == ''));

    // //check password
    checking('#password', password === '', '<div class = "mistake" >Please write your password. </div>');
    checking('#password', !regPassword.test(password) && password != '', '<div class = "mistake" >Please write your password only english symbols and numbers. </div>');
    checking('#password', password.length > 20 || password.length < 5 && password != '', '<div class = "mistake" >Min-max 5-20 symbols. </div>');
    finalChecking('#password', password.length <= 20 && password.length >= 5 && regPassword.test(password) && password != '');

    // //check repeatPassword
    checking('#repeatPassword', password != repeatPassword || repeatPassword === '', '<div class = "mistake" >Repeat password please. </div>');
    finalChecking('#repeatPassword', password === repeatPassword && repeatPassword != '');

    //event.preventDefault();
    if($(document).find(".mistake").length === 0){
    $.ajax({
        url: '/users',
        method: 'POST',
        data: { pseudonym, first_name, last_name, email, password, repeatPassword, type },
        success: function(result){
          checking('#email', result === "email"  && email != '', '<div class = "mistake" >Email is used. </div>');
          checking('#repeatPassword', "repeatPassword" === result || repeatPassword === '', '<div class = "mistake" >Repeat password please. </div>');
          if (result === 'is registered') {
            window.location.href = '/login';
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
    document.getElementById("goRegistration").click();
  }
});

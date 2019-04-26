$( document ).ready(function() {

      $.ajax({
        url: '/users/sendProfile',
        method: 'GET',
        data: {   },
        success: function(result){
          $( "#name" ).prepend( result.first_name + ' ' + result.last_name );
          },
        error: function(){
          console.log("error");
        }
      });
});
$( document ).on("click" , "#logout", function () {
  window.location.href = '/login';
});

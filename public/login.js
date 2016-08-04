$('#login-form button').on('click', event => {
  event.preventDefault();
  
  const data = {};
  if($('#username').val()) {
    data.username = $('#username').val();
  }
  else {
    $('#notification-bar').text('Username and Password Required');
  }

  if($('#password').val()) {
    data.password = $('#password').val();
  } else {
    $('#notification-bar').text('Username and Password Required');
  }

  if(data.username && data.password) {
    $.post('/api/login', JSON.stringify(data))
    .done( function(result) {
      console.log('result.token:', result.token);
      console.log('result.username:', result.username);
      Cookies.set('token',result.token, { expires: 7 });
      Cookies.set('username',data.username, { expires: 7 });
      document.location.href = '/';
    });
  }
});

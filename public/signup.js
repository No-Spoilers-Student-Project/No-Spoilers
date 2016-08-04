$('#signup-form button').on('click', event => {
  event.preventDefault();
  
  const data = {};
  data.username = $('#username').val();
  data.password = $('#password').val();
  data.confirm = $('#confirm').val();
  if(!data.username) {
    $('#notification-bar').text('Username Required');
  } else 
  if (!data.password) {
    $('#notification-bar').text('Password Required');
  } else 
  if (!data.confirm) {
    $('#notification-bar').text('Please confirm your password');
  } else
  if(data.password != data.confirm) {
    $('#notification-bar').text('Password and Confirmation must match');
  } else {
    $.post('/api/signup', JSON.stringify(data))
    .done( function(result) {
      console.log('result.token:', result.token);
      console.log('result.username:', result.username);
      Cookies.set('token',result.token, { expires: 7 });
      Cookies.set('username',data.username, { expires: 7 });
      document.location.href = '/';
    });
  }
});

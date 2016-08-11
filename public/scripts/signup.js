(function(module) {
  const signup = {};

  signup.startSignup = function() {
    $('#signup-form button').on('click', event => {
      event.preventDefault();
      signup.userData();
      $('#signup-form').hide();
    });
  };

  signup.userData = function() {
    console.log('called userData');
    const data = {};
    data.username = $('#signupUsername').val();
    data.password = $('#signupPassword').val();
    data.confirm = $('#confirm').val();
    signup.sendData(data);
  };

  signup.sendData = function(data) {
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
      console.log('data sending to /api/signup:',JSON.stringify(data));
      superagent
        .post('/api/signup')
        .send(JSON.stringify(data))
        .then(result => {
          let token = JSON.parse(result.text);
          console.log(token);
          Cookies.set('token',token.token, { expires: 7 });
          Cookies.set('username',data.username, { expires: 7 });
          token = Cookies.get('token');
          // document.location.href = '/';
          login.userOptions(token);
          Cookies.set('id',data._id, { expires: 7 });
        });
    }
  };


  module.signup = signup;

})(window);


  


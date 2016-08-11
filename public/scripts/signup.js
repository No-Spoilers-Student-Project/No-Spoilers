(function(module) {
  const signup = {};
  let token = Cookies.get('token');

  signup.showForm = function() {
    $('#signup-link,#signup-button').on('click', function(event) {
      event.preventDefault();
      $('#signup-form').show();
      $('#login-form').hide();
      // $('#user-options').hide();
    });
  };

  signup.startSignup = function() {
    $('#signup-form button').on('click', event => {
      event.preventDefault();
      signup.userData();
    });
  };

  signup.userData = function() {
    const data = {};
    data.username = $('#signupUsername').val();
    data.password = $('#signupPassword').val();
    data.confirm = $('#confirm').val();
    signup.sendData(data);
  };

  signup.sendData = function(data) {
    if (token === undefined) {
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
        superagent
          .post('/api/signup')
          .send(JSON.stringify(data))
          .then(result => {
            const body = JSON.parse(result.text);
            Cookies.set('id', body.payload.id, { expires: 7} );
            Cookies.set('token',body.token, { expires: 7 });
            Cookies.set('username',data.username, { expires: 7 });
            document.location.href = '/';
          })
          .catch((err) => {
            $('#notification-bar').text('Problem with signup. Try again.');
          });
      }
    } else {
      alert('Already signed in.');
    }
  };

  signup.showForm();
  signup.startSignup();

  module.signup = signup;

})(window);

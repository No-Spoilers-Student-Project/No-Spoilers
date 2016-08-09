(function(module) {

  const login = {};
  let tempToken = Cookies.get('token');
  let loginUser = Cookies.get('username');

  login.startLogin = function() {
    $('#login-form button').on('click', event => {
      event.preventDefault();
      console.log('button clicked');
      $('#landing-page').hide();
      $('#login-form').hide();
      login.userData();

    });
  };

  login.userOptions = function () {
    console.log(tempToken);
    console.log(loginUser);
    if(tempToken) {
      $('#user-options').html(`<p>Current User: ${loginUser} <button id="logout">Log Out</button></p>`);
    } else {
      $('#user-options').html('<button id="login-button">Log In</button> <button id="signup-button">Sign Up</button>');
    }
  };



  login.userData = function() {
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
    console.log(data);
    login.userLogin(data);
  };

  login.userLogin = function(data) {

    if(data.username && data.password) {
      superagent
        .post('/api/login')
        .send(data)
        .then(result => {
          let token = JSON.parse(result.text);
          Cookies.set('token',token.token, { expires: 7 });
          Cookies.set('username',data.username, { expires: 7 });
          loginUser = Cookies.get('username');
          tempToken = Cookies.get('token');
          login.userOptions();
          // document.location.href = '/';
        });
    };
  };
  login.startLogin();
  login.userOptions();

  module.login = login;

})(window);

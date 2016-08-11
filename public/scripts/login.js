(function(module) {

  const login = {};
  let tempToken = Cookies.get('token');
  let loginUser = Cookies.get('username');
  let loginId = Cookies.get('id');

  login.showForm = function () {
    $('#login-link, #login-button').on('click', function(event) {
      event.preventDefault();
      console.log('got here');
      $('#signup-form').hide();
      $('#login-form').show();
      // $('#user-options').hide();
    });
  };

  login.startLogin = function() {
    $('#login-form button').on('click', function(event) {
      event.preventDefault();
      $('#login-form').hide();
      login.userData();
    });
  };

  login.userOptions = function () {
    if(tempToken) {
      $('#user-options').html(`<p>Current User: ${loginUser} <button id="logout">Log Out</button> <button id="go-user">User Page</button></p>`);
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
    login.userLogin(data);
  };

  login.userLogin = function(data) {
    if(data.username && data.password) {
      superagent
        .post('/api/login')
        .send(data)
        .then(result => {
          console.log(result);
          let token = result.body.token;
          let userId = result.body.payload.id;
          Cookies.set('id', userId, { expires: 7} );
          Cookies.set('token',token, { expires: 7 });
          Cookies.set('username',data.username, { expires: 7 });
          loginUser = Cookies.get('username');
          tempToken = Cookies.get('token');
          loginId = Cookies.get('id');
          login.userOptions();
          login.getSeries(loginId);
        })
        .catch(err => {
          $('#notification-bar').text('Login Error.');
        });
    };
  };

  login.getSeries = function(id) {
    superagent
      .get(`/api/series/user/${id}`)
      .then(result => {
        result.body.forEach(e => {
          toHtml('series', e, '#user-series');
        });
      });
  };

  login.userOptions();
  login.showForm();
  login.startLogin();

  module.login = login;

})(window);

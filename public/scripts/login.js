(function(module) {

  const login = {};
  let tempToken = Cookies.get('token');
  let loginUser = Cookies.get('username');
  let loginId = Cookies.get('id');

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
          // document.location.href = '/';
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

  login.startLogin();
  login.userOptions();

  module.login = login;

})(window);

(function(module) {

  const login = {};

  login.startLogin = function() {
    $('#login-form button').on('click', function(event) {
      event.preventDefault();
      const data = {};
      data.username = $('#username').val();
      data.password = $('#password').val();

      if(data.username && data.password) {
        login.userLogin(data);
      } else {
        $('#notification-bar').text('Username and Password Required');
      }
    });
  };

  login.userLogin = function(data) {
    superagent
    .post('/api/login')
    .send(data)
    .then(result => {
      const token = result.body.token;
      const userId = result.body.payload.id;
      Cookies.set('id', userId, { expires: 7} );
      Cookies.set('token',token, { expires: 7 });
      Cookies.set('username',data.username, { expires: 7 });
      login.userOptions(token); // set up navbar for logged in state
      user.getSeries(); // render user's active series
      // series.viewSeriesListener();
      // series.renderLandingPage();
    })
    .catch( function(err) {
      console.log('Login error',err);
    });
  };

  // This method render the Username / login / signup in the navbar
  login.userOptions = function(token) {
    $('body').off('click', '#logout');
    $('#signup-link').off('click');
    $('#login-link').off('click');

    if(token) {
      const loginUser = Cookies.get('username');
      let htmlString = '<li id="username"><a href="" id="username-link">Hello, ' + loginUser + '!</a></li>';
      htmlString += '<li><a href="" id="logout">Logout</a></li>';
      $('#login-info').empty().html(htmlString);
      $('#nav-buttons li:first-child').siblings().attr('class', 'nav-links');
    } else {
      // Render logged out options
      $('#login-info').empty().html('<li><a href="" id="signup-link">Sign Up!</a></li><li><a href="" id="login-link">Login</a></li>');
    }
    login.setLoginButtonListeners();
  };

  login.setLoginButtonListeners = function() {
    $('body').on('click', '#logout', function(event) {
      event.preventDefault();
      Cookies.remove('token');
      Cookies.remove('username');
      Cookies.remove('id');
      login.userOptions();
      series.renderLandingPage();
    });

    $('#signup-link').on('click', function(event) {
      event.preventDefault();
      $('#notification-bar').removeClass('alert');
      $('#notification-bar').empty();
      toHtml('signup-form', '', '#landing-page', signup.startSignup);
    });

    $('#login-link').on('click', function(event) {
      event.preventDefault();
      $('#notification-bar').removeClass('alert');
      $('#notification-bar').empty();
      toHtml('login-form', '', '#landing-page', login.startLogin);
    });

    $('#username-link').on('click', function(event){
      event.preventDefault();
      $('#notification-bar').removeClass('alert');
      $('#notification-bar').empty();
      user.getSeries();
    });
  };

  module.login = login;
})(window);

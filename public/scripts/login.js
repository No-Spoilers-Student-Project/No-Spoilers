(function(module) {

  const login = {};
  let tempToken = Cookies.get('token');
  let loginId = Cookies.get('id');

  if(tempToken) {
    // setup login state
    login.userOptions(tempToken);
  } else {
    // setup non-login state
  }


  login.startLogin = function() {
    $('#login-form button').on('click', event => {
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
        // console.log(result.body);
        const token = result.body.token;
        const userId = result.body.payload.id;
        Cookies.set('id', userId, { expires: 7} );
        Cookies.set('token',token, { expires: 7 });
        Cookies.set('username',data.username, { expires: 7 });

        login.userOptions(token); // set up navbar for logged in state
        user.getSeries(userId); // render user's active series
      })
      .catch( function(err) {
        console.log('Login error',err);
      });
  };

  login.userOptions = function (token) {
    if(token) {
      let loginUser = Cookies.get('username');
      //$('#new-series-span').html('<a href=""><button>New</button></a>');
      // $('#user-options').html(`<button id="logout">Log Out</button> <button id="go-user">User Page</button> <button id="go-home" style="display: none;">Home Page</button></p>`);
      // $('#signup-link').parent().remove();

      $('#login-link').attr('id', 'logout');
      let $hello = $('<li></li>').text('Hello, ' + loginUser + '!');
      $hello.attr('id', 'greeting');
      $('#login-link').text('Logout');
      $('#login-info').append($hello);
      $('#nav-buttons li:first-child').siblings().attr('class', 'nav-links');
    } else {
      // $('#user-options').html('<button id="login-button">Log In</button> <button id="signup-button">Sign Up</button>');
    }
  };

  login.setLoginButtonListeners = function() {
    $('body').on('click', '#logout', function() {
      Cookies.remove('token');
      Cookies.remove('username');
      Cookies.remove('id');
      series.renderLandingPage();
      //$('#landing-page').show();
      //document.location.reload(true);
    });

    $('#signup-link').on('click', function(event) {
      event.preventDefault();
      toHtml('signup-form', '', '#landing-page', signup.startSignup);
    });

    $('#login-link').on('click', function(event) {
      event.preventDefault();
      toHtml('login-form', '', '#landing-page', login.startLogin);
    });
  };

  module.login = login;

})(window);

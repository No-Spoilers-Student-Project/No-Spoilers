(function(module) {

  const login = {};
  let tempToken = Cookies.get('token');
  let loginId = Cookies.get('id');

  login.startLogin = function() {
    $('#login-form button').on('click', event => {
      event.preventDefault();
      console.log('called login.startLogin');
      // $('#landing-page').hide();
      login.userData();
      $('#login-form').remove();
    });
  };

  login.userOptions = function (token) {
    if(token) {
      let loginUser = Cookies.get('username');
      $('#new-series-span').html('<a href="series-new.html"><button>New</button></a>');
      // $('#user-options').html(`<button id="logout">Log Out</button> <button id="go-user">User Page</button> <button id="go-home" style="display: none;">Home Page</button></p>`);
      $('#signup-link').parent().remove();
      $('#login-link').text('Logout');
      $('#login-link').attr('id', 'logout');
      let $hello = $('<li></li>').text('Hello, ' + loginUser + '!');
      $hello.attr('id', 'greeting');
      $('#nav-buttons').prepend($hello);
      $('#nav-buttons li:first-child').siblings().attr('class', 'nav-links');
      $('#landing-page h4').show();
    } else {
      // $('#user-options').html('<button id="login-button">Log In</button> <button id="signup-button">Sign Up</button>');
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
          console.log(result.body);
          let token = result.body.token;
          let userId = result.body.payload.id;
          Cookies.set('id', userId, { expires: 7} );
          Cookies.set('token',token, { expires: 7 });
          Cookies.set('username',data.username, { expires: 7 });
          loginUser = Cookies.get('username');
          tempToken = Cookies.get('token');
          loginId = Cookies.get('id');
          login.getSeries(loginId);
          // document.location.href = '/';
          login.userOptions(tempToken);
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

  
  
  module.login = login;

})(window);

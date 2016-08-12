(function(module) {

  const login = {};
  let token = Cookies.get('token');

  //let loginId = Cookies.get('id');

  // if(tempToken) {
  //   // setup login state
  // } else {
  //   // setup non-login state
  // }

  // login.showForm();
  // login.showForm = function () {
  //   $('#login-link, #login-button').on('click', function(event) {
  //     event.preventDefault();
  //     $('#signup-form').hide();
  //     $('#login-form').show();
  //     // $('#user-options').hide();
  //   });
  // };

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
  //     $('#login-form').hide();
  //     login.userData();
  //   });
  // };

  // login.userOptions = function () {
  //   if(tempToken) {
  //     $('#user-options').html(`<p>Current User: ${loginUser} <button id="logout">Log Out</button> <button id="go-user">User Page</button></p>`);
  //   } else {
  //     $('#user-options').html('<button id="login-button">Log In</button> <button id="signup-button">Sign Up</button>');
  //   }
  };

  // This method render the Username / login / signup in the navbar
  login.userOptions = function(token) {
    $('body').off('click', '#logout');
    $('#signup-link').off('click');
    $('#login-link').off('click');

    if(token) {
      const loginUser = Cookies.get('username');
      //$('#new-series-span').html('<a href=""><button>New</button></a>');
      // $('#user-options').html(`<button id="logout">Log Out</button> <button id="go-user">User Page</button> <button id="go-home" style="display: none;">Home Page</button></p>`);
      // $('#signup-link').parent().remove();

      //$('#login-link').attr('id', 'logout');
      
      let htmlString = '<li id="username"><a href="" id="username-link">Hello, ' + loginUser + '!</a></li>';
      htmlString += '<li><a href="" id="logout">Logout</a></li>';
      $('#login-info').empty().html(htmlString);
      $('#nav-buttons li:first-child').siblings().attr('class', 'nav-links');
    } else {
      // Render logged out options
      $('#login-info').empty().html('<li><a href="" id="signup-link">Sign Up!</a></li><li><a href="" id="login-link">Login</a></li>');
      // $('#user-options').html('<button id="login-button">Log In</button> <button id="signup-button">Sign Up</button>');
    }
    login.setLoginButtonListeners();
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

  //   login.userLogin(data);
  // };

  // login.userLogin = function(data) {
  //   if(data.username && data.password) {
  //     superagent
  //       .post('/api/login')
  //       .send(data)
  //       .then(result => {
  //         let token = result.body.token;
  //         let userId = result.body.payload.id;
  //         Cookies.set('id', userId, { expires: 7} );
  //         Cookies.set('token',token, { expires: 7 });
  //         Cookies.set('username',data.username, { expires: 7 });
  //         loginUser = Cookies.get('username');
  //         tempToken = Cookies.get('token');
  //         loginId = Cookies.get('id');
  //         login.userOptions();
  //         login.getSeries(loginId);
  //       })
  //       .catch(err => {
  //         $('#notification-bar').text('Login Error. Try again.');
  //       });
  //   };
  // };

  // login.getSeries = function(id) {
  //   superagent
  //     .get(`/api/series/user/${id}`)
  //     .then(result => {
  //       console.log(result.body);
  //       const overview = {};
  //       overview.series = result.body;
  //       toHtml('series', overview, '#user-series');
  //       // result.body.forEach(e => {
  //       //   toHtml('series', e, '#user-series');
  //       // })
  //     })
  //     .catch(err => {
  //       $('#notification-bar').text('Error retrieving series. Try again.');;
  //     });
  // };

  login.userOptions(token);

  module.login = login;
})(window);

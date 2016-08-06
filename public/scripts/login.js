(function(module) {

  const login = {};

  login.startLogin = function() {
    $('#login-form button').on('click', event => {
      event.preventDefault();
      console.log(`button clicked`);
      login.userData();
    });
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
          document.location.href = '/';
        });
    };
  };
  login.startLogin();

  module.login = login;

})(window);





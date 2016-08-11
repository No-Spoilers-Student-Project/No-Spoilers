(function(module){

  const user = {};

  user.goToUserPage = function () {
    $('#user-options').on('click', '#go-user', e => {
      e.preventDefault();
      const userId = Cookies.get('id');
      $('#user-page').show();
      $('#landing-page').hide();
      $('#login-form').hide();
      // $('#go-home').show();
      $('#go-user').hide();
      $('#user-page').show();
      $('#user-series').empty();
      login.getSeries(userId);
    });
  };

  user.goHome = function () {
    $('#back-to-main').on('click', function(){
      document.location.href = '/';
    });
  };

  // user.goToLanding = function () {
  //   $('#user-options').on('click', '#go-home', e => {
  //     e.preventDefault();
  //     $('#landing-page').show();
  //     $('#go-home').hide();
  //     $('#go-user').show();
  //     $('#user-page').hide();
  //   });
  // };

  user.manageApprovals = function () {
    $('#user-series').on('click', '.series-name', renderSeriesOverview);
  };

  function renderSeriesOverview (series) {
    let loginId = Cookies.get('id');
    let seriesId = $(this).data('id');
    $('#landing-page').empty();
    if(!seriesId) seriesId = series;
    getApprovedData(seriesId,loginId);
    $('#landing-page').show();
    $('#user-page').hide();
  };

  function getApprovedData (seriesId,loginId) {
    superagent
    .get('api/series/' + seriesId)
    .then( function(data) {
      superagent
      .get('api/installments/' + seriesId + '/approvals/' + loginId)
      .then( function(instData) {
        instData.body.forEach( function(show, index) {
          instData.body[index].releaseDate = moment(show.releaseDate).format('MM-DD-YYYY');
        });
        data.body.installments = instData.body;
        toHtml('series-overview', data.body, '#landing-page');
        series.approvalButton();
      });
    })
    .catch( err => {
      $('#notification-bar').text('Error occurred getting installments list');
    });
  };

  user.logOut = function () {
    $('body').on('click', '#logout', function() {
      Cookies.remove('token');
      Cookies.remove('username');
      $('#landing-page').show();
      $('#user-series').empty();
      $('#user-options').html('<button id="login-button">Log In</button> <button id="signup-button">Sign Up</button>');
      document.location.href = '/';
      document.location.reload(true);
    });
  };

  user.logOut();
  user.goToUserPage();
  user.manageApprovals();
  user.goHome();
  module.user = user;
})(window);

(function(module) {

  const series = {};

  // Single Page App main methods

  // Displays the main landing page template
  series.renderLandingPage = function() {
    $('#notification-bar').removeClass('alert');
    $('#notification-bar').empty();
    toHtml('landing-page', '', '#landing-page', series.getSeries);
  };

  // Displays a list of active series in the landing page
  series.getSeries = function() {
    window.scrollTo(0, 0);
    $('#series-list').empty();
    superagent
    .get('api/series')
    .then( data => {
      toHtml('brief-series', data, '#series-list', function(){
        const token = Cookies.get('token');
        if(token) {
          $('#add-series-button').html('<button id="add-new-series-button">Add New Series</button>');
          $('#add-new-series-button').on('click', renderAddSeries);
        }
      });
    })
    .catch( err => {
      $('#notification-bar').text('Error occurred getting series list');
      console.log('Error occurred getting series list',err);
    });
  };

  // Sets up a listener on the home link to render the home page
  series.homeLinkListener = function() {
    $('#home-link').on('click', function(event) {
      event.preventDefault();
      series.renderLandingPage();
    });
  };

  function renderAddSeries(){
    toHtml('add-series', '', '#landing-page', function(){
      addSeries.setSearchButtonListener();
      addSeries.setShowEpisodesButtonListener();
      addSeries.setAddSeriesButtonListener();
    });
  }

  //Sets up a listener to switch to the series overview view for a specific series
  series.viewSeriesListener = function() {
    $('#landing-page').on('click', '.series-details-template', function(){
      window.scrollTo(0,0);
      series.renderSeriesOverview($(this).data('id'));
    });
  };

  // Part 1 of rendering Series Overview View
  series.renderSeriesOverview = function(series) {
    const loginId = Cookies.get('id');
    getApprovedData(series,loginId);
  };

  // Part 2 of rendering Series Overview View
  function getApprovedData(seriesId,loginId) {
    superagent
    .get('api/series/' + seriesId)
    .then( function(seriesData) {
      let installmentRoute;
      if(loginId) installmentRoute = 'api/installments/' + seriesId + '/approvals/' + loginId;
      else installmentRoute = 'api/installments/' + seriesId + '/series';
      superagent
      .get(installmentRoute)
      .then( function(installmentData) {
        installmentData.body.forEach( function(show, index, arr) {
          arr[index].releaseDate = moment(show.releaseDate).format('MM-DD-YYYY');
        });
        seriesData.body.installments = installmentData.body;
        toHtml('series-overview', seriesData.body, '#landing-page');
        series.approvalButton();
      });
    })
    .catch( err => {
      $('#notification-bar').text('Error occurred getting installments list');
      console.log('Error occurred getting installments list',err);
    });
  };

  // Part 3 of rendering Series Overview View
  // Sets up a listener to handle installment approvals
  series.approvalButton = function() {
    const loginId = Cookies.get('id');
    const token = Cookies.get('token');

    $('#landing-page').on('click', '.approval-button', function(e){
      e.preventDefault();
      $('#landing-page').off('click', '.approval-button');
      const seriesId = $(this).data('series');
      const dataObj = {};
      if($(this).data('unapproved')) {
        dataObj.add = [ $(this).data('id') ];
        dataObj.remove = [];
      }
      else if($(this).data('approved')) {
        dataObj.add = [];
        dataObj.remove = [ $(this).data('id') ];
      }

      superagent
      .put('/api/users/' + loginId + '/approvals')
      .set({token})
      .send(dataObj)
      .then( function() {
        series.renderSeriesOverview(seriesId);
      })
      .catch( err => {
        $('#notification-bar').text('Error occurred approving/unapproving installment');
        console.log('Error occurred approving/unapproving installment',err);
      });
    });
  };

  module.series = series;
})(window);

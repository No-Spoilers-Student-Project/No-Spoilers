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
      const token = Cookies.get('token');
      if (token) series.renderSeriesOverview($(this).data('id'));
    });
  };

  // Part 1 of rendering Series Overview View
  series.renderSeriesOverview = function(series,editId) {
    const loginId = Cookies.get('id');
    getApprovedData(series,loginId,editId);
  };

  // Part 2 of rendering Series Overview View
  function getApprovedData(seriesId,loginId,editId) {
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
          if(show._id === editId) arr[index].edit = 'true';
        });
        seriesData.body.installments = installmentData.body;
        toHtml('series-overview', seriesData.body, '#landing-page');
        setListeners();
      });
    })
    .catch( err => {
      $('#notification-bar').text('Error occurred getting installments list');
      console.log('Error occurred getting installments list',err);
    });
  };

  // Part 3 of rendering Series Overview View
  // Sets up a listener to handle installment approvals
  series.approval = function(event) {
    event.preventDefault();
    removeListeners();
    const loginId = Cookies.get('id');
    const token = Cookies.get('token');
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
  };

  series.editSummary = function(event) {
    event.preventDefault();
    removeListeners();
    const installmentId = $(this).data('id');
    const seriesId = $(this).data('series');
    series.renderSeriesOverview(seriesId,installmentId);
  };

  series.submitSummary = function() {
    event.preventDefault();
    removeListeners();
    const newSummary = $('#summary-textarea').val();
    const instId = $(this).data('id');
    const seriesId = $(this).data('series');
    const token = Cookies.get('token');

    if(newSummary) {
      superagent
      .put('api/installments/' + instId + '/summary')
      .set({token})
      .send({summary:newSummary})
      .then( function() {
        series.renderSeriesOverview(seriesId);
      })
      .catch( err => {
        $('#notification-bar').text('Error occurred submitting summary');
        console.log('Error occurred submitting summary',err);
      });
    }
    // put'api/installments/:id/summary'

    // obj: summary:String
  };

  function setListeners() {
    $('#landing-page').on('click', '.approval-button', series.approval);
    $('#landing-page').on('click', '.edit-summary-button', series.editSummary);
    $('#landing-page').on('click', '#submit-summary', series.submitSummary);
  }

  function removeListeners() {
    $('#landing-page').off('click', '.approval-button');
    $('#landing-page').off('click', '.edit-summary-button');
    $('#landing-page').off('click', '#submit-summary');
  }

  module.series = series;
})(window);

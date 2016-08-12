(function(module) {

  const series = {};

  // Single Page App main methods

  // Displays the main landing page template
  series.renderLandingPage = function() {
    toHtml('landing-page', '', '#landing-page', series.getSeries);
  };

  // Displays a list of active series in the landing page
  series.getSeries = function() {
    window.scrollTo(0, 0);
    $('#series-list').empty();
    superagent
      .get('api/series')
      .then(data => {
        console.log(data);
        toHtml('brief-series', data, '#series-list', function(){
          const token = Cookies.get('token');
          if(token) {
            $('#add-series-button').html('<button id="add-new-series-button">Add New Series</button>');
            $('#add-new-series-button').on('click', renderAddSeries);
          }
        });
      })
      .catch(err => {
        $('#notification-bar').text('Error occurred getting series list');
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
      $('#landing-page').empty();
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
      });
    });
  };

  
  
  // series.viewBriefsListener();
  module.series = series;
})(window);

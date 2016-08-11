(function(module) {

  const series = {};

  series.getSeries = function() {
    $('#series-list').empty();
    superagent
      .get('api/series')
      .then(data => {
        data.body.forEach(e => {
          toHtml('brief-series', e, '#series-list');
        });

      })
      .catch(err => {
        $('#notification-bar').text('Error occurred getting series list');
      });
  };

  // series.viewBriefs = function () {
  //   $('#series-list').on('click', '.installments-brief', function(e) {
  //     e.preventDefault();
  //     if ($(this).hasClass('active')) {
  //       $(this).removeClass('active').addClass('inactive');
  //       superagent
  //         .get('api/installments/' + $(this).data('id'))
  //         .then(data => {
  //           data.body.forEach(e => {
  //             e.releaseDate = moment(e.releaseDate).format('MM-DD-YYYY');
  //             toHtml('brief-install', e, `#details-${this.id}`);
  //           });
  //         })
  //         .catch(err => {
  //           console.log(err);
  //           $('#notification-bar').text('Error occurred getting installments list');
  //         });
  //     } else {
  //       $(this).removeClass('inactive').addClass('active');
  //       $('.details-display').empty();
  //     }
  //   });
  // };

  series.viewSeries = function() {
    $('#series-list').on('click', '.series-name', renderSeriesOverview);
  };

  function renderSeriesOverview (series) {
    let loginId = Cookies.get('id');
    let seriesId = $(this).data('id');
    $('#landing-page').empty();
    if(!seriesId) seriesId = series;
    getApprovedData(seriesId,loginId);
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

  series.approvalButton = function () {
    let loginId = Cookies.get('id');
    let token = Cookies.get('token');

    $('#landing-page').on('click', '.approval-button', function(e){
      e.preventDefault();
      $('#landing-page').off('click', '.approval-button');
      let series = $(this).data('series');
      let dataObj = {};
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
      .then(data => {
        renderSeriesOverview(series);
      })
      .catch( err => {
        $('#notification-bar').text('Error occurred approving/unapproving installment');
      });
    });
  };

  series.viewSeries();
  series.getSeries();
  // series.viewBriefs();
  module.series = series;
})(window);

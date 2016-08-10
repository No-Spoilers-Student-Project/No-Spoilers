(function(module) {

  const series = {};

  series.getSeries = function() {
    $('#series-list').empty();
    superagent
      .get('api/series')
      .then(data => {
        data.body.forEach(e => {
          series.toHtml('brief-series', e, '#series-list');
        });

      })
      .catch(err => {
        console.log(err);
        $('#notification-bar').text('Error occurred getting series list');
      });
  };

  //export this function to its own module to DRY up code
  series.toHtml = function (filename, series, location) {
    getCompiledTemplate(filename).then((handlebarsCompile) => {
      const html = handlebarsCompile(series);
      $(location).append(html);
    })
    .catch(err => {
      console.log(err);
    });
  };

  series.viewBriefs = function () {

    $('#series-list').on('click', '.installments-brief', function(e) {
      e.preventDefault();
      if ($(this).hasClass('active')) {
        $(this).removeClass('active').addClass('inactive');
        superagent
          .get('api/installments/' + $(this).data('id'))
          .then(data => {
            data.body.forEach(e => {
              e.releaseDate = moment(e.releaseDate).format('MM DD YYYY');
              series.toHtml('brief-install', e, `#details-${this.id}`);
            });
          })
          .catch(err => {
            console.log(err);
            $('#notification-bar').text('Error occurred getting installments list');
          });
      } else {
        $(this).removeClass('inactive').addClass('active');
        $('.details-display').empty();
      }
    });
  };

  series.viewSeries = function() {
    $('#series-list').on('click', '.series-name', renderSeriesOverview);
  };

  function renderSeriesOverview(series) {
    const loginId = Cookies.get('id');
    //$('#landing-page').empty();
    let seriesId = $(this).data('id');
    if(!seriesId) seriesId = series;
    getApprovedData(seriesId,loginId);
  }  

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
      console.log(err);
      $('#notification-bar').text('Error occurred getting installments list');
    });
  }

  series.approvalButton = function() {
    const loginId = Cookies.get('id');
    const token = Cookies.get('token');

    $('#landing-page').on('click', '.approval-button', function(){
      $('#landing-page').off('click', '.approval-button');
      const series = $(this).data('series');
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
      .then( () => {
        renderSeriesOverview(series);
      })
      .catch( err => {
        console.log(err);
        $('#notification-bar').text('Error occurred approving/unapproving installment');
      });
    });
  };

  series.viewSeries();
  series.getSeries();
  series.viewBriefs();
  module.series = series;
})(window);

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
      // console.log(html);
      $(location).append(html);
    })
    .catch(err => {
      console.log(err);
      //do something if err
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
    $('#series-list').on('click', '.series-name', function(event) {
      $('#landing-page').empty();
      const seriesId = $(this).data('id');
      
      superagent
        .get('api/series/' + seriesId)
        .then( function(data) {
          data.body.installments.forEach( function(show, index) {
            data.body.installments[index].releaseDate = moment(show.releaseDate).format('MM-DD-YYYY');
          });
          toHtml('series-overview', data.body, '#landing-page');
        })
        .catch( err => {
          console.log(err);
          $('#notification-bar').text('Error occurred getting installments list');
        });


    });
  };

  series.viewSeries();
  series.getSeries();
  series.viewBriefs();
  module.series = series;
})(window);

(function(module) {

  const series = {};

  series.getSeries = function() {
    $('#series-list').empty();
    superagent
      .get('api/series')
      .then(data => {
        console.log(data.body);
        data.body.forEach(e => {
          series.toHtml('series', e, '#series-list');
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
      console.log('clicked installments brief');
      console.log(this);
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

  series.getSeries();
  series.viewBriefs();
  module.series = series;
})(window);

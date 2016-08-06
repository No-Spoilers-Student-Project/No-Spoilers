(function(module) {

  const series = {};

  series.getSeries = function() {
    superagent
      .get('api/series')
      .then(series => {
        console.log(series);
      });
  };
  
  series.getSeries();
  module.series = series;
})(window);
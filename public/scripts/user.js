(function(module){

  const user = {};

  user.getSeries = function(id) {
    superagent
    .get(`/api/series/user/${id}`)
    .then( result => {
      const overview = {};
      overview.series = result.body;
      toHtml('series', overview, '#landing-page');
    })
    .catch( err => {
      console.log('error getting user series:',err);
    });
  };

  module.user = user;
})(window);

(function(module){

  const user = {};

  user.getSeries = function() {
    const id = Cookies.get('id');
    superagent
    .get(`/api/series/user/${id}`)
    .then( result => {
      if(result.body.length === 0) series.renderLandingPage();
      else {
        const overview = {};
        overview.series = result.body;
        toHtml('series', overview, '#landing-page');
      }
    })
    .catch( err => {
      console.log('error getting user series:',err);
    });
  };

  module.user = user;
})(window);

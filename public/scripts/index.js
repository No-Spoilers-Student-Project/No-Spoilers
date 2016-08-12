'use strict';

(function(module){

  let token = Cookies.get('token');

  // Handlebars.registerHelper('if', function(conditional, options) {
  //   if(conditional) {
  //     return options.fn(this);
  //   }
  // });

  function initAll() {
    login.userOptions(token);
    series.viewSeriesListener();
    series.renderLandingPage();
    series.homeLinkListener();
  };

  
  initAll();
  module.initAll = initAll;
})(window);

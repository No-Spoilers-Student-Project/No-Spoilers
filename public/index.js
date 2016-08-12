'use strict';

(function(module){

  let token = Cookies.get('token');

  function initAll() {
    login.userOptions(token);
    series.viewSeriesListener();
    series.renderLandingPage();
    series.homeLinkListener();
  };
  
  module.initAll = initAll;
})(window);

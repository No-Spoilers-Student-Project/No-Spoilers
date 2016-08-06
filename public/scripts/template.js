(function(module) {
  function getCompiledTemplate(name) {
    console.log( 'in getCompiledTemplate');
    superagent
      .get('/hbs/' + name + '.hbs')
      .then(text => {
        return Handlebars.compile(text);
      });
  };  
  module.getCompiledTemplate = getCompiledTemplate;
})(window);
(function(module) {
  function getCompiledTemplate(name) {
    // console.log( 'in getCompiledTemplate');
    return superagent
      .get('../hbs/' + name + '.hbs')
      .then(res => {
        // console.log(res.text);
        return Handlebars.compile(res.text);
      });
  };
  module.getCompiledTemplate = getCompiledTemplate;
})(window);

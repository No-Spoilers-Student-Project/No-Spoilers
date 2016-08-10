(function(module) {
  function getCompiledTemplate(name) {
    console.log( 'called getCompiledTemplate');
    return superagent
      .get('../hbs/' + name + '.hbs')
      .then(res => {
        console.log('superagent loaded template',name);
        return Handlebars.compile(res.text);
      });
  };
  module.getCompiledTemplate = getCompiledTemplate;
})(window);

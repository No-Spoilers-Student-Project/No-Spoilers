(function(module) {
  function getCompiledTemplate(name) {
    return superagent
      .get('../hbs/' + name + '.hbs')
      .then(res => {
        return Handlebars.compile(res.text);
      });
  };
  module.getCompiledTemplate = getCompiledTemplate;
})(window);

(function(module) {

  Handlebars.registerHelper('if', function(conditional, options) {
    if(conditional) {
      return options.fn(this);
    }
  });

  function getCompiledTemplate(name) {
    return superagent
    .get('../hbs/' + name + '.hbs')
    .then(res => {
      return Handlebars.compile(res.text);
    });
  };

  function toHtml(filename, obj, location, callback) {
    getCompiledTemplate(filename)
    .then((handlebarsCompile) => {
      const html = handlebarsCompile(obj);
      $(location).empty();
      $(location).append(html);
      if(callback) callback();
    })
    .catch(err => {
      console.log(err);
    });
  };

  module.getCompiledTemplate = getCompiledTemplate;
  module.toHtml = toHtml;

})(window);

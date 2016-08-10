(function(module) {

  function toHtml(filename, obj, location) {
    getCompiledTemplate(filename)
    .then((handlebarsCompile) => {
      const html = handlebarsCompile(obj);
      $(location).empty();
      $(location).append(html);
    })
    .catch(err => {
      console.log(err);
    });
  };

  module.toHtml = toHtml;

})(window);

(function(module) {
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

  module.toHtml = toHtml;

})(window);

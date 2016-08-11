(function(module) {
  function toHtml(filename, obj, location) {
    getCompiledTemplate(filename)
    .then((handlebarsCompile) => {
      const html = handlebarsCompile(obj);
      $(location).append(html);
      if(callback) callback();
    })
    .catch(err => {
      console.log(err);
    });
  };

  module.toHtml = toHtml;

})(window);

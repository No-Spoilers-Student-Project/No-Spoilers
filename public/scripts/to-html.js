(function(module) {

  function toHtml(filename, obj, location) {
    getCompiledTemplate(filename).then((handlebarsCompile) => {
      const html = handlebarsCompile(obj);
      $(location).append(html);
    })
    .catch(err => {
      console.log(err);
      //do something if err
    });
  };

  module.toHtml = toHtml;

})(window);

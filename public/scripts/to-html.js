(function(module) {

  function toHtml(filename, obj, location) {
    console.log('Called toHtml');
    getCompiledTemplate(filename)
    .then((handlebarsCompile) => {
      console.log('About to compile with data');
      const html = handlebarsCompile(obj);
      console.log('Done compiling html from data');
      console.log('------------------------------');
      $(location).empty();
      $(location).append(html);
    })
    .catch(err => {
      console.log(err);
      //do something if err
    });
  };

  module.toHtml = toHtml;

})(window);

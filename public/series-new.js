'use strict';

//const token = Cookies.get('token');

$('#series-form').on('submit', event => {
  event.preventDefault();
  
  const data = {
    name: $('#series_name').val()
    // ,
    // genre: $('#series_genre').val(),
    // description: $('#series_description').val()
  };

  if(!data.name) $('#notification-bar').text('Name Required');
  else {
    $.ajax({
      url: '/api/series/search/' + data.name,
      type: 'GET'
      // contentType: 'application/json; charset=utf-8',
      // dataType: 'json'
    })  
    // $.post('/api/series', JSON.stringify(data))
    .done( function(result) {
      const seriesToHtml = Handlebars.compile($('#result-template').html());
      const obj = { data: result };
      if(obj.data==='') $('#results').html('<h3>No results</h3>');
      else {
        $('#results').html(seriesToHtml(obj));
        $('#series-form button').text('New Search');
        //window.location.href = 'series-detail.html?id=' + result._id;
      }
    });
  }
});
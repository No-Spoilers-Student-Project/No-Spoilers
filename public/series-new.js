const token = Cookies.get('token');

$('#series-form button').on('click', event => {
  event.preventDefault();
  
  const data = {
    name: $('#series_name').val(),
    type: $('#series_type').val(),
    description: $('#series_description').val()
  };

  if(!data.name) $('#notification-bar').text('Name Required');
  else {
    $.ajax({
      url: '/api/series',
      type: 'POST',
      headers: { 'token': token },
      // contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(data)
      // dataType: 'json'
    })  
    // $.post('/api/series', JSON.stringify(data))
    .done( function(result) {
      window.location.href = 'series-detail.html?id=' + result._id;
    });
  }
});
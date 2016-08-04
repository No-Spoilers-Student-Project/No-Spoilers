const token = Cookies.get('token');

$.getJSON('/api/series', function(result) {
  var options = $('#series_id');
  $.each(result, function() {
    options.append($('<option />').val(this._id).text(this.name));
  });
});

$('#episode-form button').on('click', event => {
  event.preventDefault();
  
  const data = {};
  if($('#episode_title').val()) data.title = $('#episode_title').val();
  if($('#series_id').val()) data.series = $('#series_id').val();
  if($('#episode_medium').val()) data.medium = $('#episode_medium').val();
  if($('#episode_length').val()) data.length = $('#episode_length').val();
  if($('#episode_airdate').val()) data.airdate = $('#episode_airdate').val();

  if(!data.title) $('#notification-bar').text('Title Required');
  else {
    $.ajax({
      url: '/api/episodes',
      type: 'POST',
      headers: { 'token': token },
      data: JSON.stringify(data)
    })  
    .done( function(result) {
      window.location.href = 'episode-detail.html?id=' + result._id;
    });
  }
});

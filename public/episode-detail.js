const episodeToHtml = Handlebars.compile($('#epsode-details-template').html());
const id = url('?id');
const token = Cookies.get('token');

if(id) {
  $.ajax(`/api/episodes/${id}`, {
    success: data => {
      if(data.airdate) {
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        data.airdate = new Date(data.airdate).toLocaleDateString('en-US', options);
      } 
      $('#details-display').append(episodeToHtml(data));
    },
    error: () => $('#notification-bar').text('Error occurred getting series list')
  });
} else {
  $('#notification-bar').text('Bad id parameter');
}

$('body').on('click', '.delete', function() {
  const selected = $(this).data();
  $.ajax(`/api/episodes/${selected.id}`, {
    type: 'DELETE',
    headers: {'token': token},
    success: data => {
      window.location.href = '/';
      $('#notification-bar').text('Deleted:' + data.title);
    },
    error: () => $('#notification-bar').text('Error occurred deleting', selected)
  });
});
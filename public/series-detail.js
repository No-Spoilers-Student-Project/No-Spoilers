const seriesToHtml = Handlebars.compile($('#series-details-template').html());
const episodesToHtml = Handlebars.compile($('#episode-list-template').html());
const id = url('?id');
const token = Cookies.get('token');

if(id) {
  $.ajax(`/api/series/${id}`, {
    success: data => {
      console.log('data:',data);
      $('#details-display').append(seriesToHtml(data));
      $('#details-display').append(episodesToHtml(data));
    },
    error: () => $('#notification-bar').text('Error occurred getting series detail')
  });
} else {
  $('#notification-bar').text('Bad id parameter');
}

$('body').on('click', '.delete', function() {
  const selected = $(this).data();
  $.ajax(`/api/series/${selected.id}`, {
    type: 'DELETE',
    headers: {'token': token},
    success: data => {
      window.location.href = '/';
      $('#notification-bar').text('Deleted:', data.name);
    },
    error: () => $('#notification-bar').text('Error occurred deleting', selected)
  });
});
'use strict';

const installmentToHtml = Handlebars.compile($('#epsode-details-template').html());
const id = url('?id');
const token = Cookies.get('token');

if(id) {
  $.ajax(`/api/installments/${id}`, {
    success: data => {
      if(data.releaseDate) {
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        data.releaseDate = new Date(data.releaseDate).toLocaleDateString('en-US', options);
      }
      $('#details-display').append(installmentToHtml(data));
    },
    error: () => $('#notification-bar').text('Error occurred getting series list')
  });
} else {
  $('#notification-bar').text('Bad id parameter');
}

$('body').on('click', '.delete', function() {
  const selected = $(this).data();
  $.ajax(`/api/installments/${selected.id}`, {
    type: 'DELETE',
    headers: {'token': token},
    success: data => {
      window.location.href = '/';
      $('#notification-bar').text('Deleted:' + data.title);
    },
    error: () => $('#notification-bar').text('Error occurred deleting', selected)
  });
});

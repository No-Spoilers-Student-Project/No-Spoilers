'use strict';

const token = Cookies.get('token');

$.getJSON('/api/series', function(result) {
  var options = $('#series_id');
  $.each(result, function() {
    options.append($('<option />').val(this._id).text(this.name));
  });
});

$('#installment-form button').on('click', event => {
  event.preventDefault();
  
  const data = {};
  if($('#installment_name').val()) data.name = $('#installment_name').val();
  if($('#series_id').val()) data.series = $('#series_id').val();
  if($('#installment_medium').val()) data.medium = $('#installment_medium').val();
  if($('#installment_length').val()) data.length = $('#installment_length').val();
  if($('#installment_releaseDate').val()) data.airdate = $('#installment_releaseDate').val();

  if(!data.name) $('#notification-bar').text('Installment Title Required');
  else {
    $.ajax({
      url: '/api/installments',
      type: 'POST',
      headers: { 'token': token },
      data: JSON.stringify(data)
    })  
    .done( function(result) {
      window.location.href = 'installment-detail.html?id=' + result._id;
    })
    .fail( function(err) {
      console.log('Error: ' + err.status + ' ' + err.statusText + ' - ' + err.responseText);
    });
  }
});

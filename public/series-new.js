'use strict';

const token = Cookies.get('token');

$('#series-form').on('submit', function(event) {
  event.preventDefault();

  const data = {
    name: $('#series_name').val(),
    type: $('#series_genre').val()
  };

  if(!data.name) $('#notification-bar').text('Search Term Required');
  else {
    $('#results').html('<h2>Searching Remote Database...</h2>');
    if(data.type === 'tv') {
      $.ajax({
        url: '/api/series/search/tvdb/' + data.name,
        type: 'GET'
      })
      .done( function(result) {
        const tvSeriesToHtml = Handlebars.compile($('#tv-result-template').html());
        const obj = { data: result };
        if(obj.data==='') $('#results').html('<h3>No results</h3>');
        else {
          $('#results').html(tvSeriesToHtml(obj));
          $('#series-form button').text('New Search');
          //window.location.href = 'series-detail.html?id=' + result._id;
        }
      });
    }
    else if(data.type === 'book') {
      $.ajax({
        url: '/api/series/search/goodreads/' + data.name,
        type: 'GET'
      })
      // $.post('/api/series', JSON.stringify(data))
      .done( function(result) {
        const bookSeriesToHtml = Handlebars.compile($('#book-result-template').html());
        const obj = { data: result };
        console.log('result:',obj);
        if(obj.data==='') $('#results').html('<h3>No results</h3>');
        else {
          $('#results').html(bookSeriesToHtml(obj));
          $('#series-form button').text('New Search');
          //window.location.href = 'series-detail.html?id=' + result._id;
        }
      });
    }
    else if(data.type === 'movie') {
      $('#notification-bar').text('Movie search has not yet been implemented. Sorry!');
    }
  }
});

$('#results').on('click', '.show-episodes', function(event) {
  event.preventDefault();
  const seriesId = $(this).data('seriesid');
  const type = $(this).data('type');
  console.log('Series selected:', type, seriesId);

// https://api.thetvdb.com/series/77398/episodes

  if(type === 'tv') {
    $.ajax({
      url: '/api/series/search/tvdb/' + seriesId + '/episodes',
      type: 'GET'
    })
    .done( function(result) {
      console.log('result:',result);
      const episodesToHtml = Handlebars.compile($('#tv-episodes-template').html());
      result.sort( function(a,b) {
        if(a.FirstAired == b.FirstAired) {
          return a.EpisodeNumber < b.EpisodeNumber ? -1 : 1;
        } else {
          return a.FirstAired < b.FirstAired ? -1 : 1;
        }
      });
      const obj = { data: result };
      if(obj.data==='') $('#eipsodes-' + seriesId).html('<h3>No results</h3>');
      else {
        $('#eipsodes-' + seriesId).html(episodesToHtml(obj));
        //window.location.href = 'series-detail.html?id=' + result._id;
      }
    });
  }

});

$('#results').on('click', '.add-series', function() {
  const seriesId = $(this).data('seriesid');
  $.ajax({
    url: '/api/series/tvdb/' + seriesId,
    type: 'GET'
  })
  .done( function(result) {
    const data = {
      name: result.SeriesName,
      description: result.Overview
    };
    console.log('add series, stage 1 result:',data);
    if(!data.name || data.name==='') $('#results').html('<h3>No results</h3>');
    else {
      pushSeries(data);
    }
  });
});

function pushSeries(data) {
  $.ajax({
    url: '/api/series/',
    type: 'POST',
    headers: { 'token': token },
    data: JSON.stringify(data)
  })
  .done( function(result) {
    console.log('add series, stage 2 result:',result);
    window.location.href = 'series-detail.html?id=' + result._id;
//    window.location.href = 'installment-detail.html?id=' + result._id;
  })
  .fail( function(err) {
    console.log('Error: ' + err.status + ' ' + err.statusText + ' - ' + err.responseText);
  });
}
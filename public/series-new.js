'use strict';

const token = Cookies.get('token');

// Button Click: Search remote APIs for series
$('#series-form').on('submit', function(event) {
  event.preventDefault();

  const data = {
    name: $('#series_name').val(),
    type: $('#series_genre').val()
  };

  // TV series search is through The TV Database
  if(!data.name) $('#notification-bar').text('Search Term Required');
  else {
    $('#results').html('<h2>Searching Remote Database...</h2>');
    if(data.type === 'tv') {
      $.ajax({
        url: '/api/tvdb/search/' + data.name,
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

    // Book series search is through GoodReads
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

// Button Click: Show episodes for a specific series (after searching)
$('#results').on('click', '.show-episodes', function(event) {
  event.preventDefault();
  const seriesId = $(this).data('seriesid');
  const type = $(this).data('type');

  // Only works for tv so far
  if(type === 'tv') {
    $.ajax({
      url: '/api/tvdb/episodes/' + seriesId,
      type: 'GET'
    })
    .done( function(result) {
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

// Button Click: Add Series (After searching)
$('#results').on('click', '.add-series', function() {
  const seriesId = $(this).data('seriesid');
  superagent
    .get('/api/tvdb/' + seriesId)
    .then(result => {
      const data = {
        name: result.SeriesName,
        description: result.Overview,
        tvdbid: result.id
      };
      if(!data.name || data.name==='') $('#results').html('<h3>No results</h3>');
      else {
        pushSeries(data);
      }
    })
    .catch(err => {
      console.log(err);
      $('#results').html('Series already added.');
    });


  // $.ajax({
  //   url: '/api/tvdb/' + seriesId,
  //   type: 'GET'
  // })
  // .done( function(result) {
  //   console.log('full result from tvdb search:');
  //   console.log(result);
  //   const data = {
  //     name: result.SeriesName,
  //     description: result.Overview,
  //     tvdbid: result.id
  //   };
  //   if(!data.name || data.name==='') $('#results').html('<h3>No results</h3>');
  //   else {
  //     pushSeries(data);
  //   }
  // })
  // .fail( function(err) {
  //   $('#results').html(`<h3>${err.message}</h3>`);
  // });
});

function pushSeries(data) {
  $.ajax({
    url: '/api/series/',
    type: 'POST',
    headers: { 'token': token },
    data: JSON.stringify(data)
  })
  .done( function(result) {
    console.log('new series added:',result.tvdbid);
    pushInstallments(result.tvdbid,result._id);
    // window.location.href = 'series-detail.html?id=' + result._id;
  })
  .fail( function(err) {
    console.log('Error: ' + err.status + ' ' + err.statusText + ' - ' + err.responseText);
  });
}

function pushInstallments(tvdbSeriesId,localSeriesId) {
  $.ajax({
    url: '/api/tvdb/episodes/' + tvdbSeriesId,
    type: 'GET'
  })
  .done( function(result) {
    console.log('full result from tvdb episode search:');
    console.log(result);
    result.forEach( function(episode){
      const data = {
        name: episode.EpisodeName,
        medium: 'tv',
        summary: episode.Overview,
        tvdbid: episode.id,
        releaseDate: episode.FirstAired,
        series: localSeriesId,
        imageLink: 'http://thetvdb.com/banners/' + episode.filename,
        season: episode.SeasonNumber,
        episode: episode.EpisodeNumber
      };
      $.ajax({
        url: '/api/installments/',
        type: 'POST',
        headers: { 'token': token },
        data: JSON.stringify(data)
      })
      .done( function(result) {
        console.log('new installment added:',result);
      })
      .fail( function(err) {
        console.log('Error: ' + err.status + ' ' + err.statusText + ' - ' + err.responseText);
        console.log(err);
      });

    });
  });
}

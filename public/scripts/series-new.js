'use strict';

(function(module) {

  const addSeries = {};

  // Button Click: Search remote APIs for series
  addSeries.setSearchButtonListener = function() {
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
            const obj = { data: result };
            if(obj.data==='') $('#results').html('<h3>No results</h3>');
            else {
              toHtml('tv-result',obj,'#results');
            }
          });
        }

        // Book series search is through GoodReads
        else if(data.type === 'book') {
          $.ajax({
            url: '/api/series/search/goodreads/' + data.name,
            type: 'GET'
          })
          .done( function(result) {
            // const bookSeriesToHtml = Handlebars.compile($('#book-result-template').html());
            const obj = { data: result };
            if(obj.data==='') $('#results').html('<h3>No results</h3>');
            else {
              toHtml('book-result',obj,'#results');
              // $('#results').html(bookSeriesToHtml(obj));
              $('#series-form button').text('New Search');
            }
          });
        }
        else if(data.type === 'movie') {
          $('#notification-bar').text('Movie search has not yet been implemented. Sorry!');
        }
      }
    });
  };

  // Button Click: Show episodes for a specific series (after searching)
  addSeries.setShowEpisodesButtonListener = function() {
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
            toHtml('tv-episode',obj,'#eipsodes-' + seriesId);
          }
        });
      }
    });
  };

  // Button Click: Add Series (After searching)
  addSeries.setAddSeriesButtonListener = function() {
    $('#results').on('click', '.add-series', function() {
      const seriesId = $(this).data('seriesid');
      superagent
      .get('/api/tvdb/' + seriesId)
      .then(result => {
        const data = {
          name: result.body.SeriesName,
          description: result.body.Overview,
          tvdbid: result.body.id,
          firstAired: result.body.FirstAired
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
    });
  };

  function pushSeries(data) {
    const token = Cookies.get('token');
    $.ajax({
      url: '/api/series/',
      type: 'POST',
      headers: { 'token': token },
      data: JSON.stringify(data)
    })
    .done( function(result) {
      pushInstallments(result.tvdbid,result._id,token);
    })
    .fail( function(err) {
      console.log('Error: ' + err.status + ' ' + err.statusText + ' - ' + err.responseText);
    });
  }

  function pushInstallments(tvdbSeriesId,localSeriesId,token) {
    superagent
    .get('/api/tvdb/episodes/' + tvdbSeriesId)
    .then( function(result) {
      return Promise.all( result.body.map( function(episode){
        const data = {
          name: episode.EpisodeName || 'NO TITLE IN DB',
          medium: 'tv',
          summary: episode.Overview || 'No Summary Entered',
          tvdbid: episode.id,
          releaseDate: episode.FirstAired,
          series: localSeriesId,
          imageLink: 'http://thetvdb.com/banners/' + episode.filename,
          season: episode.SeasonNumber,
          episode: episode.EpisodeNumber
        };
        return superagent
        .post('/api/installments/')
        .set({ 'token': token })
        .send(data)
        .then()
        .catch( function(err) {
          console.log('Error: ' + err.status + ' ' + err.statusText + ' - ' + err.responseText);
          console.log(err);
        });
      }));
    })
    .then( function() {
      $('#landing-page').empty();
      window.scrollTo(0,0);
      series.renderSeriesOverview(localSeriesId);
    })
    .catch( function(err) {
      console.log('Error: ' + err.status + ' ' + err.statusText + ' - ' + err.responseText);
      console.log(err);
    });
  }

  module.addSeries = addSeries;
})(window);

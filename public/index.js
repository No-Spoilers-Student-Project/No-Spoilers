'use strict';
let seriesToHtml, episodesToHtml;
const loginUser = Cookies.get('username');
const token = Cookies.get('token');

if(token) {
  $('#new-series-span').html('<a href="series-new.html"><button>New</button></a>');
  $('#new-episode-span').html('<a href="episode-new.html"><button>New</button></a>');
  //$('#new-user-span').html('<a href="series-new.html"><button>New</button></a>');
}

Handlebars.registerHelper('if', function(conditional, options) {
  if(conditional) {
    return options.fn(this);
  }
});

seriesToHtml = Handlebars.compile($('#series-template').html());
episodesToHtml = Handlebars.compile($('#episode-template').html()); 

function loadSeries() {
  $.ajax('/api/series', {
    success: data => {
      let series = { data };
      series.token = token;
      const html = seriesToHtml(series);
      $('#series-list').empty().append(html);
    },
    error: () => $('#notification-bar').text('Error occurred getting series list')
  });
}

loadSeries();

function loadEpisodes() {
  $.ajax('/api/episodes', {
    success: data => {
      const episode = { data };
      episode.token = token;
      const html = episodesToHtml(episode);
      $('#episode-list').empty().append(html);
    },
    error: () => $('#notification-bar').text('Error occurred getting episode list')
  });
}

loadEpisodes();

const usersToHtml = Handlebars.compile($('#userlist-template').html());

function loadUsers() {
  $.ajax('/api/users', {
    success: data => {
      const users = { data };
      users.token = token;
      const html = usersToHtml(users);
      $('#user-list').empty().append(html);
    },
    error: () => $('#notification-bar').text('Error occurred getting user list')
  });
}

loadUsers();

function userOptions() {
  if(token) {
    $('#user-options').html(`<p>Current User: ${loginUser} <button id="logout">Log Out</button></p>`);
  } else {
    $('#user-options').html('<a href="login.html"><button>Log In</button></a> <a href="signup.html"><button>Sign Up</button></a>');
  }
  
}

userOptions();

$('#user-list,#episode-list,#series-list').on('click', '.delete', function() {
  const selected = $(this).data();
  $.ajax(`/api/${selected.type}/${selected.id}`, {
    type: 'DELETE',
    headers: {'token': token},
    success: data => {
      selected.type === 'series' ? loadSeries() : selected.type === 'episodes' ? loadEpisodes() : loadUsers();
      $('#notification-bar').text('Deleted: ' + (data.name || data.title || data.username));
      setTimeout( () => $('#notification-bar').empty() , 10000);
    },
    error: () => $('#notification-bar').text('Error occurred deleting', selected)
  });
});

$('#logout').on('click', function() {
  Cookies.remove('token');
  Cookies.remove('username');
  document.location.reload(true);
});
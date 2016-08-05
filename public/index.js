'use strict';

let seriesToHtml, installmentsToHtml;
const loginUser = Cookies.get('username');
const token = Cookies.get('token');

if(token) {
  $('#new-series-span').html('<a href="series-new.html"><button>New</button></a>');
  $('#new-installment-span').html('<a href="installment-new.html"><button>New</button></a>');
  //$('#new-user-span').html('<a href="series-new.html"><button>New</button></a>');
}

Handlebars.registerHelper('if', function(conditional, options) {
  if(conditional) {
    return options.fn(this);
  }
});

seriesToHtml = Handlebars.compile($('#series-template').html());
installmentsToHtml = Handlebars.compile($('#installment-template').html()); 

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

function loadInstallments() {
  $.ajax('/api/installments', {
    success: data => {
      const installment = { data };
      installment.token = token;
      const html = installmentsToHtml(installment);
      $('#installment-list').empty().append(html);
    },
    error: () => $('#notification-bar').text('Error occurred getting installment list')
  });
}

loadInstallments();

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

$('#user-list,#installment-list,#series-list').on('click', '.delete', function() {
  const selected = $(this).data();
  $.ajax(`/api/${selected.type}/${selected.id}`, {
    type: 'DELETE',
    headers: {'token': token},
    success: data => {
      selected.type === 'series' ? loadSeries() : selected.type === 'installments' ? loadInstallments() : loadUsers();
      $('#notification-bar').text('Deleted: ' + (data.name || data.username));
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
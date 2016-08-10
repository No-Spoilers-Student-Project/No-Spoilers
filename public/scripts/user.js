(function(module){

  const user = {};

  user.goToUserPage = function () {
    $('#user-options').on('click', '#go-user', e => {
      e.preventDefault();
      let userId = Cookies.get('id');
      $('#landing-page').hide();
      $('#login-form').hide();
      $('#go-home').show();
      $('#go-user').hide();
      $('#user-page').show();
      $('#user-series').empty();
      login.getSeries(userId);
    });
  };

  user.goToLanding = function () {
    $('#user-options').on('click', '#go-home', e => {
      e.preventDefault();
      $('#landing-page').show();
      $('#go-home').hide();
      $('#go-user').show();
      $('#user-page').hide();
    });
  };


  user.getInstallments = function () {
    let userId = Cookies.get('id');
    console.log(userId);
    $('#user-series').on('click', 'button[data-id]', (e) => {
      e.preventDefault();
      let location = '#' + $(e.target).data('id');
      console.log($(e.target).text());
      if($(e.target).text() === 'Show Installments') {
        $(e.target).text('Hide Installments');
        superagent
          .get('api/installments/' + $(e.target).data('id') + '/approvals/' + userId)
          .then(result => {
            result.body.forEach(e => {
              // e.releaseDate = moment(e.releaseDate).format('MM DD YYYY');
              if(e.summary[0] === 'You have not apporoved this installment for viewing.') {
                e.notApproved = true;
              } else {
                e.approved = true;
              }
              console.log(e.approved);
              toHtml('installments', e, location);
            });
          });
      } else {
        $(location).empty();
        $(e.target).text('Show Installments');
      }
    });
  };

  user.manageApprovals = function() {
    $('#user-series').on('click', 'button[id]', e => {
      e.preventDefault();
      let data = {};
      data.add = [];
      data.remove = [];
      let userId = Cookies.get('id');
      let token = Cookies.get('token');
      $('input[type=checkbox]:checked').each(function() {
        console.log($(this));
        if($(this).val() === 'add') {
          data.add.push($(this).data('id'));
        } else {
          data.remove.push($(this).data('id'));
        }
      });
      console.log(data);
      superagent
        .put('/api/users/' + userId + '/approvals')
        .set({token})
        .send(data)
        .then(data => {
          console.log(data);
        });
      // let location = '#' + $(e.target).id;
      if(e.target.value === 'delete') {
      }

    });

  };

  user.manageApprovals();
  user.getInstallments();
  user.goToUserPage();
  user.goToLanding();
  module.user = user;
})(window);

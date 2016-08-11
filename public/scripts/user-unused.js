// user.getInstallments = function () {
//   let userId = Cookies.get('id');
//
//   $('#user-series').on('click', 'button[data-id]', function(e) {
//     let seriesId = $(e.target).data('id');
//     e.preventDefault();
//     console.log($(e.target).data('name'));
//     if ($(e.target).data('name') === 'show') {
//       let location = '#' + $(e.target).data('id');
//       console.log($(e.target).text());
//       if($(e.target).text() === 'Show Installments') {
//         $(e.target).text('Hide Installments');
//         user.installmentsAPI(seriesId, userId, location);
//         // superagent
//         //   .get('api/installments/' + $(e.target).data('id') + '/approvals/' + userId)
//         //   .then(result => {
//         //     result.body.forEach(e => {
//         //       // e.releaseDate = moment(e.releaseDate).format('MM DD YYYY');
//         //       if(e.summary[0] === 'You have not apporoved this installment for viewing.') {
//         //         e.notApproved = true;
//         //       } else {
//         //         e.approved = true;
//         //       }
//         //       console.log(e.approved);
//         //       toHtml('installments', e, location);
//         //     });
//         //   });
//       } else {
//         $(location).empty();
//         $(e.target).text('Show Installments');
//       }
//     } else {
//       user.manageApprovals();
//     }
//
//
//   });
// };
//
// user.installmentsAPI = function (seriesId, userId, location) {
//   superagent
//     .get('api/installments/' + seriesId + '/approvals/' + userId)
//     .then(result => {
//       result.body.forEach(e => {
//         e.releaseDate = moment(e.releaseDate).format('MM DD YYYY');
//         if(e.summary[0] === 'You have not approved this installment for viewing.') {
//           e.notApproved = true;
//         } else {
//           e.approved = true;
//         }
//         console.log(e.approved);
//         toHtml('installments', e, location);
//       });
//     });
// };
//
//
// user.manageApprovals = function() {
//   // $('#user-series').on('click', 'button[id]', e => {
//   //   e.preventDefault();
//   let data = {};
//   data.add = [];
//   data.remove = [];
//   let userId = Cookies.get('id');
//   let token = Cookies.get('token');
//   $('input[type=checkbox]:checked').each(function() {
//     console.log($(this));
//     if($(this).val() === 'add') {
//       data.add.push($(this).data('id'));
//     } else {
//       data.remove.push($(this).data('id'));
//     }
//   });
//   console.log(data);
//   superagent
//     .put('/api/users/' + userId + '/approvals')
//     .set({token})
//     .send(data)
//     .then(data => {
//       console.log(data);
//       alert('You have updated your approvals.');
//     });
//   // let location = '#' + $(e.target).id;
//   // if(e.target.value === 'delete') {
//   // }
//
//   // });
//
// };

// user.manageApprovals();
// user.getInstallments();

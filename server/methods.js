Meteor.methods({
  'PUT/ACCOUNTS/UpdatePlan': function(options) {
    console.log(options);
    return Meteor.users.update(options.userId, {
      $set: {
        'profile.plan': options.plan,
        'profile.startTotal': options.startTotal
      }
    }, function(error, result) {
      if (error) {

      } else {
        var opts = options;
        Meteor.call('SUBSCRIPTIONS/DELETE/CancelUsersubscription', options);
      }
    });
  }
});

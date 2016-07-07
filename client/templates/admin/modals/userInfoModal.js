checkPlanSelected = function(options) {
  var noStripePlans = ['s27', 's15', 'allCat', '0'];
  return noStripePlans.indexOf(options.plan) >= 0;
};
checkCurrentUser = function(options) {
  Meteor.call('ACCOUNTS/CUSTOMERS/GetCustomerExisting', {
    userId: options.tmpl.data.user._id
  }, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      if (result && _.isEqual(result.code, 200)) {
        options.tmpl.isAlreadyACustomer.set(result.data[0].havePlan);
        options.tmpl.userData.set(result.data[0].data);
      }
    }
  });
}

Template.userInfoModal.events({
  'hidden.bs.modal #user_info_modal': function(event, template) {
    Blaze.remove(template.view);
  },
  'click #change_user_plan_admin': function(event, template) {
    var userId = template.data.user._id,
      plan = plan = $('#fresh_new_plan_admin').val() || $('#new_plan_from_admin_select').val(),
      startTotal = $('#fresh_new_plan_admin option[value="' + $('#fresh_new_plan_admin').val() + '"]').data() &&
      $('#fresh_new_plan_admin option[value="' + $('#fresh_new_plan_admin').val() + '"]').data().starttotal ||
      $('#new_plan_from_admin_select option[value="' + $('#new_plan_from_admin_select').val() + '"]').data() &&
      $('#new_plan_from_admin_select option[value="' + $('#new_plan_from_admin_select').val() + '"]').data().starttotal;
    if (checkPlanSelected({
        plan: plan
      })) {
      Meteor.call('PUT/ACCOUNTS/UpdatePlan', {
        userId: userId,
        plan: plan,
        startTotal: startTotal,
        allCat: _.isEqual(plan, 'allCat') ? true : false,
        fromAdmin: true
      }, function(error, result) {
        if (error) {
          console.log(error);
        } else {
          $('#user_info_modal').modal('hide');
          checkCurrentUser({
            tmpl: template
          })
        }
      });
    } else {
      Meteor.call('SUBSCRIPTIONS/POST/AttachUserToSubscription', {
        userId: userId,
        plan: plan,
        fromAdmin: true,
        startTotal: startTotal
      }, function(error, result) {
        if (error) {
          console.log(error);
        } else {
          Meteor.users.update(userId, {
            $set: {
              'profile.plan': plan,
              'profile.startTotal': startTotal
            }
          });
          $('#user_info_modal').modal('hide');
          checkCurrentUser({
            tmpl: template
          });
        }
      });
    }
  },
  'click #cancel_user_susbcription_admin': function(event, template) {

  },
  'click #suscribe_user_plan_admin': function(event, template) {
    var userId = template.data.user._id,
      plan = $('#fresh_new_plan_admin').val() || $('#new_plan_from_admin_select').val(),
      startTotal = $('#fresh_new_plan_admin option[value="' + $('#fresh_new_plan_admin').val() + '"]').data() &&
      $('#fresh_new_plan_admin option[value="' + $('#fresh_new_plan_admin').val() + '"]').data().starttotal ||
      $('#new_plan_from_admin_select option[value="' + $('#new_plan_from_admin_select').val() + '"]').data() &&
      $('#new_plan_from_admin_select option[value="' + $('#new_plan_from_admin_select').val() + '"]').data().starttotal;
    if (checkPlanSelected({
        plan: plan
      })) {
      Meteor.call('PUT/ACCOUNTS/UpdatePlan', {
        userId: userId,
        plan: plan,
        startTotal: startTotal,
        allCat: _.isEqual(plan, 'allCat') ? true : false,
        fromAdmin: true
      }, function(error, result) {
        if (error) {
          console.log(error);
        } else {
          checkCurrentUser({
            tmpl: template
          })
        }
      });
    } else {
      Meteor.call('SUBSCRIPTIONS/POST/AttachUserToSubscription', {
        userId: userId,
        plan: plan,
        fromAdmin: true,
        startTotal: startTotal
      }, function(error, result) {
        if (error) {
          console.log(error);
        } else {
          Meteor.users.update(userId, {
            $set: {
              'profile.plan': plan,
              'profile.startTotal': startTotal
            }
          });
          $('#user_info_modal').modal('hide');
          checkCurrentUser({
            tmpl: template
          });
        }
      });
    }
  }
})

Template.userInfoModal.helpers({
  userInfo: function() {
    return Template.instance().data && Template.instance().data.user;
  },
  fullName: function() {
    var user = Template.instance().data && Template.instance().data.user;
    return user.profile && user.profile.firstName + ' ' + user.profile.lastName;
  },
  userHaveSubscription: function() {
    return Template.instance().isAlreadyACustomer.get();
  },
  currentSubscription: function() {
    return Template.instance().userPlan.get();
  },
  cardataexists: function() {
    return Template.instance().cardataexists.get();
  }
});

Template.userInfoModal.onRendered(function() {
  var tmpl = this;
  $('#user_info_modal').modal('show');

  tmpl.autorun(function() {
    checkCurrentUser({
      tmpl: tmpl
    });
  });
});

Template.userInfoModal.onCreated(function() {
  var tmpl = this;
  tmpl.isAlreadyACustomer = new ReactiveVar(false);
  tmpl.userData = new ReactiveVar(false);
  tmpl.userPlan = new ReactiveVar(tmpl.data.user.profile.plan);
  tmpl.cardataexists = new ReactiveVar(tmpl.data.cardataexists);
});

subscribeUserToPlan = function(options, callback) {
  Meteor.call('SUBSCRIPTIONS/POST/AttachUserToSubscription', {
    plan: options.plan
  }, function(error, result) {
    if (error) {
      callback(error);
      console.log("error" + error.reason);
    } else {
      var subscriptionId = result.subscriptions.data[0].id

      Meteor.call('CUSTOMERS/SUBSCRIPTIONS/UpdateSubscriptionId', {
        subscriptionId: subscriptionId
      });
      callback(null, result);
    }
  });
}

Template.subscriptionModal.events({
  'hidden.bs.modal #subscription_modal': function(event, template) {
    Blaze.remove(template.view);
  },
  "click #make_subscription,  submit #porccess_order": function(event, template) {
    event.preventDefault();
    var subscriptionData = template.data;
    subscribeUserToPlan({
      plan: subscriptionData.plan
    }, function(error, result) {
      if (error) {
        sAlert.success(error.reason, {
          effect: 'slide',
          position: 'top-right',
          timeout: '3000',
          onRouteClose: false,
          stack: false,
          offset: '100px'
        });
      } else {
        Meteor.call('custUpgrade', Meteor.userId(), subscriptionData.plan);
        Session.set('custPlan', plan);
        if (Session.get('grandTotal') === "") {
          Session.set('total', subscriptionData.grandTotal);
        };
        sAlert.success('Upgrade added!', {
          effect: 'slide',
          position: 'top-right',
          timeout: '3000',
          onRouteClose: false,
          stack: false,
          offset: '100px'
        });
        sendEmail({
          'to': Meteor.user() && Meteor.user().emails[0].address,
          'from': 'no-reply@rts.com',
          'text': 'Subscription Activated',
          'subject': 'Subscriptin Activated',
          'tags': [
            'buy',
          ]
        });
        $('#subscription_modal').modal('hide');
      };
    });
  }
});

Template.subscriptionModal.helpers({
  totalToCharge: function() {
    return Template.instance().data.planPrice;
  },
  showCustomerData: function() {
    return Template.instance().customerData.get();
  },
  isAlreadyCustomer: function() {
    return Template.instance().isAlreadyCustomer.get();
  },
  showCardForm: function() {
    return Template.instance().showCardForm.get();
  },
  isDefault(source) {
    return _.isEqual(Template.instance().defaultSource.get(), source);
  }
});

Template.subscriptionModal.onRendered(function() {
  var tmpl = this;

  $('#subscription_modal').modal('show');
  getCustomerData({
    tmpl: tmpl
  });
  tmpl.autorun(function() {
    var queryCustomerData = StripeCustomers.find().count();
    if (queryCustomerData >= 1) {
      tmpl.isAlreadyCustomer.set(true);
      tmpl.showCardForm.set(false);
    }
  });
});

Template.subscriptionModal.onCreated(function() {
  var tmpl = this;

  tmpl.customerData = new ReactiveVar;
  tmpl.isAlreadyCustomer = new ReactiveVar(false);
  tmpl.showCardForm = new ReactiveVar(true);
  tmpl.defaultSource = new ReactiveVar;
  tmpl.autorun(function() {
    tmpl.subscribe('stripeAccounts');
  });
});

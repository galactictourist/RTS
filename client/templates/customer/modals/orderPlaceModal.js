Template.orderPlaceModal.events({
  'hidden.bs.modal #order_place_modal': function(event, template) {
    Blaze.remove(template.view);
  },
  'click #submit': function(event, template) {
    event.preventDefault();
    var cardData = {
      number: template.$('#card_number').val(),
      cvc: template.$('#cvc').val(),
      exp_month: template.$('#exp_month').val(),
      exp_year: template.$('#exp_year').val(),
    };
    generateToken({
      tmpl : template,
      cardData: cardData,
      amount: template.data.orderTotal
    });

  },
  'click #submit_new_card': function(event, template) {
    var cardData = {
      number: template.$('#card_number').val(),
      cvc: template.$('#cvc').val(),
      exp_month: template.$('#exp_month').val(),
      exp_year: template.$('#exp_year').val(),
    };
    addNewSource({
      cardData: cardData,
      tmpl: template
    });


  },
  'click #make_payment': function(event, template) {
    event.preventDefault();
    var currentAmt = Session.get('grandTotal');
    Meteor.call('PAYMENTS/POST/CreateCharge', {
      amount: template.data.orderTotal
    }, function(error, result) {
      if (error) {
        template.showError.set(true);
        template.errorMessage.set(error.reason);
      } else {
        template.showError.set(false);
        template.errorMessage.set(false);
        sAlert.success('Order processed successfully!', {
          effect: 'slide',
          position: 'top-right',
          timeout: '8000',
          onRouteClose: false,
          stack: false,
          offset: '100px'
        });
        processOrder();
        sendEmail({
          'to': Meteor.user() && Meteor.user().emails[0].address,
          'from': 'no-reply@rts.com',
          'html': '<html><head></head><body>' + Meteor.user().profile.firstName + ',<br><br><p>Thank you for your business. Order total = ' + template.data.orderTotal + '</p></body><html>',
          'subject': 'Ridgetop A.T. Order Confirmation',
          'tags': [
            'buy',
          ]
        });
        $('#order_place_modal').modal('hide');

      }
    });
  },
  "click #add_new_card, click #cancel_new_card": function(event, template) {
    template.showCardForm.set(!template.showCardForm.get());
  },
  "click #change_to_default": function(event, template) {
    updateCustomerDefaultSource({
      default_source: this.id,
      tmpl: template
    });
  },
  "click #delete_card": function(event, template) {
    deleteCustomerCard({
      cardId: this.id,
      tmpl: template
    })
  }
})

Template.orderPlaceModal.helpers({
  totalToCharge: function() {
    return Template.instance().data.orderTotal;
  },
  showCustomerData: function() {
    console.log(Template.instance().customerData.get());
    return Template.instance().customerData.get();
  },
  isAlreadyCustomer: function() {
    return Template.instance().isAlreadyCustomer.get();
  },
  showCardForm: function() {
    return Template.instance().showCardForm.get();
  },
  isDefault:function(source) {
    return _.isEqual(Template.instance().defaultSource.get(), source);
  },
  showError:function(){
    return Template.instance().showError.get();
  },
  errorMessage:function(){
    return Template.instance().errorMessage.get();
  }
});

Template.orderPlaceModal.onRendered(function() {
  var tmpl = this;

  $('#order_place_modal').modal('show');
  Meteor.setTimeout(function() {
    getCustomerData({
      tmpl: tmpl
    });
  }, 500);
});

Template.orderPlaceModal.onCreated(function() {
  var tmpl = this;

  tmpl.customerData = new ReactiveVar;
  tmpl.isAlreadyCustomer = new ReactiveVar(false);
  tmpl.showCardForm = new ReactiveVar(true);
  tmpl.defaultSource = new ReactiveVar;
  tmpl.errorMessage = new ReactiveVar(false);
  tmpl.showError = new ReactiveVar;
  tmpl.autorun(function() {
    tmpl.subscribe('stripeAccounts');
  });
});

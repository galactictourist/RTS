generateToken = function(options) {
  Stripe.token.create({
    card: options.cardData
  }, function(error, token) {
    if (error) {
      var tokenId = token.id,
        tmpl = options.tmpl;
      console.log(options);
      if(token.error){
        tmpl.showError.set(true);
        tmpl.errorMessage.set(token.error.message);
      }else{
        if (_.isEqual(options.from, 'new_source')) {
          Meteor.call('PAYMENTS/POST/CustomerSource', {
            tokenId: tokenId
          }, function(error, result) {
            if (error) {
              console.log(error);
            } else {
              tmpl.showCardForm.set(false);
              processOrder();
              sAlert.success('Order processed successfully!', {
                effect: 'slide',
                position: 'top-right',
                timeout: '8000',
                onRouteClose: false,
                stack: false,
                offset: '100px'
              });
              sendEmail({
                'to': Meteor.user() && Meteor.user().emails[0].address,
                'from': 'no-reply@rts.com',
                'html': '<html><head></head><body>' + Meteor.user().profile.firstName + ',<br><br><p>Thank you for your business. Order total = ' + options.tmpl.orderTotal + '</p></body><html>',
                'subject': 'Ridgetop A.T. Order Confirmation',
                'tags': [
                  'buy',
                ]
              });
              $('#order_place_modal').modal('hide');
              getCustomerData({
                tmpl: tmpl
              });
            }
          });
        } else {
          Meteor.call('PAYMENTS/POST/CreateAccount', {
            tokenId: tokenId,
            userEmail: Meteor.user().emails[0].address,
            amount: options.amount
          }, function(error, result) {
            if (error) {
              tmpl.showError.set(true);
              tmpl.errorMessage.set(error.reason);
            } else {
              tmpl.showError.set(false);
              tmpl.errorMessage.set(false);
              processOrder();
              sAlert.success('Order processed successfully!', {
                effect: 'slide',
                position: 'top-right',
                timeout: '8000',
                onRouteClose: false,
                stack: false,
                offset: '100px'
              });
              sendEmail({
                'to': Meteor.user() && Meteor.user().emails[0].address,
                'from': 'no-reply@rts.com',
                'html': '<html><head></head><body>' + Meteor.user().profile.firstName + ',<br><br><p>Thank you for your business. Order total = ' + options.tmpl.orderTotal + '</p></body><html>',
                'subject': 'Ridgetop A.T. Order Confirmation',
                'tags': [
                  'buy',
                ]
              });
              $('#order_place_modal').modal('hide');
              getCustomerData({
                tmpl: tmpl
              });
            }
          });
        }
      }
    }
  });
};

getCustomerData = function(options) {
  var tmpl = options.tmpl;
  Meteor.call('PAYMENTS/GET/CustomerData', function(error, result) {
    if (error) {
      console.log(error);
    } else if(result){
      tmpl.customerData.set(result);
      tmpl.defaultSource.set(result.default_source);
      tmpl.autorun(function() {
        var queryCustomerData = StripeCustomers.find().count();
        if (queryCustomerData >= 1) {
          tmpl.isAlreadyCustomer.set(true);
          tmpl.showCardForm.set(false);
        }
      });
    }
  });
};

addNewSource = function(options) {
  generateToken({
    cardData: options.cardData,
    from: 'new_source',
    tmpl: options.tmpl
  });
};

updateCustomerDefaultSource = function(options) {
  Meteor.call('PAYMENTS/POST/UpdateCustomerSource', {
    default_source: options.default_source
  }, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      console.log(result);
      getCustomerData({
        tmpl: options.tmpl
      })
    }
  });
}

deleteCustomerCard = function(options) {
  Meteor.call('PAYMENTS/POST/DeleteCard', {
    cardId: options.cardId
  }, function(error, result) {
    if (error) {
      console.log(error);
    } else {
      console.log(result);
      getCustomerData({
        tmpl: options.tmpl
      })
    }
  });
}
getStartTotal = function() {

  //var startTCall = Meteor.users.findOne({'_id': Meteor.userId()}, {fields: {'profile.startTotal': 1,'_id': 0}});
  //var sTotal = startTCall.profile.startTotal;
  sTotal = Meteor.user().profile.startTotal;
  Session.set('total', sTotal);
}

setDefaultFacets = function() {
  var e = document.getElementById("facets");
  var selected = e.options[e.selectedIndex].value;
  Session.set('facets', selected);
}

processOrder = function() {
  var orderToMove = tempOrder.find({}).fetch(),
    isOrderRush = tempOrder.findOne({
      'diagram.expedite': '6'
    }); //check to mark eta field for sorting on front
  var isETA = 24;
  if (isOrderRush == null) {} else {
    isETA = 6;
  }
  orderToMove.forEach(function(doc) {
    Orders.insert(doc, {
        validate: false
      },
      function(err) {
        if (err) {
          sAlert.error('Error' + err, {
            effect: 'slide',
            position: 'top-right',
            timeout: '3000',
            onRouteClose: false,
            stack: false,
            offset: '100px'
          });
        }
      });
    Meteor.call('updateOrderETA', isETA, Session.get('newOrderId')); // update order eta for sorting
    var firstOrder = Meteor.user() && Meteor.user().profile && Meteor.user().profile.firstOrder; //  update firstorder if this is the first one
    if (firstOrder === "0") {
      Meteor.call('orderCherryPop', Meteor.userId());
    }
    Session.set('firstOrder', firstOrder);
    getStartTotal();
    setDefaultFacets();
    Session.set('anotherDiagram', false);

    Session.set('grandTotal', '');
    Session.set('emptyOrder', true);
    Session.delete('newOrderId');
    Session.delete('mapLat');
    Session.delete('mapLon');

    Session.delete('uploadedImages');
    Session.set('diagSesh', null);
    tempOrder.remove({});
    tempImgs.remove({});
  });
}

sendEmail = function(options) {
  Meteor.call('EMAILS/POST/SendEmail', options);
};

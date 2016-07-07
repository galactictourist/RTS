var Future = Npm.require('fibers/future'),
  Customer = StripeSync(Meteor.settings.stripe.secret);

Meteor.methods({
  'PAYMENTS/POST/CreateAccount': function(options) {
    check([options], [Object]);
    var stripeCustomerfuture = new Future(),
      query = StripeCustomers.findOne({
        owner: this.userId
      }),
      userId = this.userId;
    if (query) {
      //Existing user just made the charge
      //You can let this if here for any securty issue, i.e the customer see the form,
      //and its already a customer ... shit happends
      Meteor.call('PAYMENTS/POST/CreateCharge', {
        amount: options.amount
      });
    } else {
      Customer.customers.create({
        email: options.userEmail,
        card: options.tokenId,
        description: "Ridgetop Aerial Technologies",
        metadata: {
          userId: this.userId,
          other: 'bar'
        }
      }, function(error, result) {
        if (result) {
          //twisted since stripe always return an error object
          CreateCustomerReference({
            owner: userId,
            id: result.id
          }, function(error, result) {
            if (error) {
              console.log(error);
            } else {
              //Customer is on the collection now lets play with Stripe API
              console.log(result);
            }
          });
          //TODO this should be removed into a future.wait check for best ops
          Meteor.call('PAYMENTS/POST/CreateCharge', {
            amount: options.amount
          });
          return stripeCustomerfuture.return(result);
        } else {
          return stripeCustomerfuture.return(error);
        }
      });
    }
  },
  'PAYMENTS/POST/CreateCharge': function(options) {
    check([options], [Object]);
    var stripeCustomerfuture = new Future(),
      queryCustomer = StripeCustomers.findOne({
        owner: this.userId
      });
    Customer.charges.create({
      amount: StripeCentsToDollars({
        amount: options.amount,
        userId: this.userId
      }),
      currency: 'USD',
      customer: queryCustomer.id
    }, function(error, result) {
      if (error) {
        return stripeCustomerfuture.return(error);
      } else {
        return stripeCustomerfuture.return(result)
      }
    })
  },
  'PAYMENTS/GET/CustomerData': function() {
    var stripeCustomerfuture = new Future(),
      queryCustomer = StripeCustomers.findOne({
        owner: this.userId
      });
    console.log(queryCustomer);
    if (queryCustomer) {
      return Customer.customers.retrieve(queryCustomer.id, function(error, result) {
        if (error) {
          return stripeCustomerfuture.return(error);
        } else {
          return stripeCustomerfuture.return(result);
        }
      });
      return stripeCustomerfuture.wait();
    };
  },
  'PAYMENTS/POST/CustomerSource': function(options) {
    check([options], [Object]);
    var stripeCustomerfuture = new Future(),
      queryCustomer = StripeCustomers.findOne({
        owner: this.userId
      });
    return Customer.customers.createSource(queryCustomer.id, {
      source: options.tokenId
    }, function(error, result) {
      if (error) {
        return stripeCustomerfuture.return(error);
      } else {
        return stripeCustomerfuture.return(result);
      }
    });
    return stripeCustomerfuture.wait();

  },
  'PAYMENTS/POST/UpdateCustomerSource': function(options) {
    check([options], [Object]);
    var stripeCustomerfuture = new Future(),
      queryCustomer = StripeCustomers.findOne({
        owner: this.userId
      });
    return Customer.customers.update(queryCustomer.id, {
      'default_source': options.default_source
    }, function(error, result) {
      if (error) {
        return stripeCustomerfuture.return(error);
      } else {
        return stripeCustomerfuture.return(result);
      }
    });
    return stripeCustomerfuture.wait();
  },
  'PAYMENTS/POST/DeleteCard': function(options) {
    check([options], [Object]);
    var stripeCustomerfuture = new Future(),
      queryCustomer = StripeCustomers.findOne({
        owner: this.userId
      });
    return Customer.customers.deleteCard(
      queryCustomer.id,
      options.cardId,
      function(error, result) {
        if (error) {
          return stripeCustomerfuture.return(error);
        } else {
          return stripeCustomerfuture.return(result);
        }
      });

    return stripeCustomerfuture.wait();
  },
  'SUBSCRIPTIONS/POST/AttachUserToSubscription': function(options) {
    check([options], [Object]);
    var stripeCustomerfuture = new Future();
    var currentUser = Meteor.users.findOne(this.userId);
    if (options.fromAdmin && isAdmin({
        role: currentUser.profile.role
      })) {
      queryCustomer = StripeCustomers.findOne({
        owner: options.userId
      });
    } else {
      queryCustomer = StripeCustomers.findOne({
        owner: this.userId
      });
    };
    if (queryCustomer) {
      return Customer.customers.update(queryCustomer.id, {
        plan: options.plan
      }, function(error, result) {
        if (error) {
          return stripeCustomerfuture.return(error);
        } else {
          updateSubscriptionId({
            subscriptionId: result.subscriptions.data[0].id,
            queryCustomer: queryCustomer
          })
          return stripeCustomerfuture.return(result);
        }
      });
      return stripeCustomerfuture.wait();
    } else {
      return {
        response: 500,
        message: 'user is not a customer'
      }
    }

  },
  'SUBSCRIPTIONS/DELETE/CancelUsersubscription': function(options) {
    var stripeCustomerfuture = new Future(),
      queryUser = Meteor.users.findOne(this.userId);
    if (options && options.fromAdmin && isAdmin({
        role: queryUser.profile.role
      })) {
      queryCustomer = StripeCustomers.findOne({
        owner: options.userId
      });
    } else {
      queryCustomer = StripeCustomers.findOne({
        owner: this.userId
      });
    };
    if (queryCustomer && queryUser) {
      console.log(queryCustomer);
      Customer.customers.cancelSubscription(
        queryCustomer.id,
        queryCustomer.subscriptionId,
        function(error, result) {
          if (error) {
            return stripeCustomerfuture.return(error);
          } else {
            return stripeCustomerfuture.return(result)
          }
        }
      )
      Meteor.users.update(this.userId, {
        $set: {
          'profile.plan': "0",
          'profile.startTotal': "29.99"
        }
      })
      return stripeCustomerfuture.wait();
    };
  },
  'CUSTOMERS/SUBSCRIPTIONS/UpdateSubscriptionId': function(options) {
    var queryCustomer = StripeCustomers.findOne({
      owner: this.userId
    });
    if (queryCustomer) {
      StripeCustomers.update(queryCustomer._id, {
        $set: {
          subscriptionId: options.subscriptionId
        }
      })
    }
  },
  'ACCOUNTS/CUSTOMERS/GetCustomerExisting': function(options) {
    var queryCustomer = StripeCustomers.findOne({
        owner: options.userId
      }),
      queryUser = Meteor.users.findOne(options.userId),
      havePlan,
      responseCode, message;
    if (queryCustomer) {
      responseCode = 200;
      message = 'User is already a customer';
    } else {
      responseCode = 422;
      message = 'User is not a customer';
    };
    if (_.isEqual(queryUser.profile.plan, "0")) {
      havePlan = false
    } else {
      havePlan = true;
    }
    return {
      'code': responseCode,
      'data': [{
        'data': queryCustomer,
        'havePlan': havePlan
      }],
      'message': message
    }
  }


}); //end meteor methods




CreateCustomerReference = function(options, callback) {
  StripeCustomers.insert(options, function(error, result) {
    if (error) {
      callback(error)
    } else {
      callback(null, result);
    }
  });

}
RemoveCustomerReference = function(options) {
  return StripeCustomers.update(options._id, {
    subscriptionId: 'null'
  });
}

ClearUserPlan = function(options) {
  var options = options;
  Meteor.users.update(options.userId, {
    $set: {
      'profile.plan': "0",
      'profile.startTotal': "29.99",
      'profile.signUpDate': ""
    }
  })
};

UpdateUserPlan = function(options) {
 var d = new Date();

  Meteor.users.update(options.userId, {
    $set: {
      'profile.plan': options.plan,
      'profile.startTotal': options.startTotal,
      'profile.signUpDate': d
    }
  })
}

StripeCentsToDollars = function(options) {
  var userquery = Meteor.users.findOne(options.userId),
    userPlan = userquery && userquery.profile.plan;

  return Math.round(options.amount * 100);
}

isAdmin = function(options) {
  return _.isEqual(options.role, 'admin');
}

updateSubscriptionId = function(options) {
  return StripeCustomers.update(options.queryCustomer._id, {
    $set: {
      subscriptionId : options.subscriptionId
    }
  })
};

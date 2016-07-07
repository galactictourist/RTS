Template.cust_mgmt.onCreated(function() {

  var self = this;

  self.autorun(function() {
    self.subscribe('allStripeAccountsAdmin');
  });



});

Template.cust_mgmt.onRendered(function() {


});


Template.cust_mgmt.helpers({

  showChangeButton: function(userId) {
    var count =  StripeCustomers.find({
      owner: userId
    }).count();
   return count >= 1 ? '1' : '0';
  },
  getCustomers: function() { //get all customers from DB


    return Meteor.users.find({
      'profile.role': 'customer'
    }).fetch();

  },



  custSignUpDate: function(key) {

    var custDate = moment(key).format('MM-DD-YY');

    return custDate;
  }



});



Template.cust_mgmt.events({

  'click .impersonate': function() {
    var userId = this._id;

    Meteor.call('impersonate', userId, function(err) {

      if (!err) {

        Meteor.connection.setUserId(userId);

        Meteor.call('impersonateWorkStatusFix', userId);
        Router.go('/c-home');
      }

    });


  },


  'click #user_item_managment': function(event, template) {
    var cardataexists = $(event.target).data().cardataexists;
    Blaze.renderWithData(Template.userInfoModal, {
      user: this,
      cardataexists : parseInt(cardataexists) >= 1 ? true : false
    }, document.body);
  },

  'click #addCust': function(event, template) {

    event.preventDefault();



    var firstName = trimInput(template.$('#f_name').val());
    var lastName = trimInput(template.$('#l_name').val());
    var email = trimInput(template.$('#email').val());
    var phone = trimInput(template.$('#phone').val());
    var plan = template.$('#planSelect').val();
    var password = trimInput(template.$('#password').val());

    //form validation
    if (isNotEmpty(firstName) &&
      isNotEmpty(lastName) &&
      isNotEmpty(email) &&
      isNotEmpty(phone) &&
      isNotEmpty(plan) &&
      isNotEmpty(password)) {




      Meteor.call('addNewCustomer', firstName, lastName, email, phone, plan, password);



      sAlert.success('Customer added.', {
        effect: 'slide',
        position: 'top-right',
        timeout: '3000',
        onRouteClose: false,
        stack: false,
        offset: '100px'
      });

      template.$('#f_name').val('');
      template.$('#l_name').val('');
      template.$('#email').val('');
      template.$('#phone').val('');
      template.$('#planSelect').val('');
      template.$('#password').val('');

    } //end validation

  }

});




//Trim Helper
var trimInput = function(val) {
  return val.replace(/^\s*|\s*$/g, "");
}

//Check for empty fields
isNotEmpty = function(value) {
  if (value && value !== '') {
    return true;
  }

  sAlert.error('Please fill in all fields', {
    effect: 'slide',
    position: 'top-right',
    timeout: '3000',
    onRouteClose: false,
    stack: false,
    offset: '100px'
  });
  return false;
};

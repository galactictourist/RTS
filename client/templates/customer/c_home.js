


Template.c_home.onCreated(function () {

    Meteor.logoutOtherClients();
  	var self = this;
    var cust = Meteor.userId();


	  self.autorun(function () {

            Tracker.afterFlush(function () {

                var firstOrder = Meteor.user() && Meteor.user().profile && Meteor.user().profile.firstOrder;
                Session.set('firstOrder', firstOrder);

            });


	     self.subscribe('usersOne',cust);
	     //self.subscribe('custOrders', cust);
       self.subscribe('sketches');
        $("#fileBox").toggle();



	});





});

Template.c_home.onRendered(function () {




      var firstOrder = Meteor.user() && Meteor.user().profile && Meteor.user().profile.firstOrder;
      Session.set('firstOrder', firstOrder);



    var custPlan = Meteor.users.findOne({'_id': Meteor.userId()}, {fields: {'profile.plan': 1,'_id': 0}});
    var plan = custPlan && custPlan.profile.plan;

    Session.set('custPlan', plan);


  });


Template.c_home.helpers({


  	getData: function() {

      return Meteor.users.find({}).fetch();


    },

  planCheck: function(){


    var plan = Session.get('custPlan');

     switch (plan) {
    case "0":
        return false;
        break;
    case "mt1":
        return "Monthly Tier 1";
        break;
    case "mt2":
        return "Monthly Tier 2";
        break;
    case "yt1":
        return "Yearly Tier 1";
        break;
    case "yt2":
        return "Yearly Tier 2";
        break;
    case "s27":
        return "S27 No facet upcharges";
        break;
    case "s32":
        return "S32 No facet upcharges";
        break;

    }


  },

  newOrderCount: function(){


    var newCount = Orders.find({ 'diagram.status':6, 'archive':0}).count();


    if(newCount !== 0){

      return newCount
    } else {

      return false;
    }

  }

});

Template.c_home.events({

  'click #change-password': function(event){
     event.preventDefault();

     var oldPass = $('#password');
     var verifyPass = $('#password-confirm');
     var newPass = $('#password-new');

     if(newPass.val() === verifyPass.val()){
         Accounts.changePassword(oldPass.val(), newPass.val(), function(err){
             if(err){

              sAlert.error(err, {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});

                
             } else {
                 
              sAlert.success('Password changed.', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});

             }
         });

         oldPass.val('');
         verifyPass.val('');
         newPass.val('');

     } else {
         
              sAlert.error('New password and password again do not match.', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});

     }
 },


  "click #unsubscribe_plan":function(event, template){
    event.preventDefault();
    Meteor.call('SUBSCRIPTIONS/DELETE/CancelUsersubscription', function(error, result){
      if(error){
        console.log(error);
      }else{
        sAlert.success('Unsibscribe successfully!', {
          effect: 'slide',
          position: 'top-right',
          timeout: '8000',
          onRouteClose: false,
          stack: false,
          offset: '100px'
        });
      }
    });
  },


//---------------------------------------------------SUBSCRIBE BUTTONS
  'click #subscriptions_buttons':function(event, template){
    var element = $(event.target);
         elementData = element.data(),
         plan = elementData.planid,
         planPrice = elementData.total,
         grandTotal = elementData.grandtotal;
         Blaze.renderWithData(Template.subscriptionModal, {
           plan : plan,
           planPrice : planPrice,
           grandTotal : grandTotal
         }, document.body);
  }
  });

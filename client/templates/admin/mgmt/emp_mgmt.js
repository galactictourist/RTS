

Template.emp_mgmt.onCreated(function() {

	     var self = this;

	     self.autorun(function () {


	     });



});

Template.emp_mgmt.onRendered(function() {


});


Template.emp_mgmt.helpers({

 editEmployees: function(){//get employee list for edit in tools


    return Meteor.users.find({ 'profile.role': { $ne: 'customer' } }).fetch();


  }



});



Template.emp_mgmt.events({

   'click #addEmp': function (event, template) {

     event.preventDefault();

    

    var firstName = trimInput(template.$('#f_name').val());
    var lastName = trimInput(template.$('#l_name').val());
    var email = trimInput(template.$('#email').val());
    var phone = trimInput(template.$('#phone').val());
    var password = trimInput(template.$('#password').val());
    var role = template.$('#empRoleSelect').val();
   

     //form validation
            if(isNotEmpty(firstName) && 
              isNotEmpty(lastName) &&
               isNotEmpty(email) &&
                isNotEmpty(phone) &&
               isNotEmpty(role) && 
               isNotEmpty(password)) { 

              if(role === '1'){

                role = 'employee1';

              } else if (role === '2') {

                role = 'employee2';

              } else {

                role = 'admin';
              }

    Meteor.call('addNewEmployee',firstName,lastName,email,phone,role,password);



    sAlert.success('Employee added.' , {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});

    template.$('#f_name').val('');
    template.$('#l_name').val('');
    template.$('#email').val('');
    template.$('#phone').val('');
    template.$('#empRoleSelect').val('');
    template.$('#password').val('');

    }//end validation

  },

  'click #deleteEmp' : function (event, template) {

     event.preventDefault();

     eId = this._id;

     Meteor.call('deleteEmp',eId);

     sAlert.success('Record deleted.' , {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});


  }
	

});




Template.emp_mgmt.onDestroyed(function () {

  


});



//Trim Helper
var trimInput = function(val){
  return val.replace(/^\s*|\s*$/g, "");
}

//Check for empty fields
isNotEmpty = function(value) {
  if (value && value !== ''){
    return true;
  }
  
  sAlert.error('Please fill in all fields', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});
  return false;
};

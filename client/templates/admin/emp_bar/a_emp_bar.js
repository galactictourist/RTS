Template.a_emp_bar.onCreated(function() {

	
	var self = this;

	  	self.autorun(function () {

	  

	});

});


Template.a_emp_bar.helpers({

	 adminColorStatus: function() {

  

            if(this.profile.role === 'admin'){
              return Spacebars.SafeString('#cc453a');
            } else {
              return Spacebars.SafeString('#216cc3');
            }
      },

      isQC: function() {//check if employee 2 is in qc mode to not show diagram stuff

            if(this.profile.role === 'emp2qc'){

              return true;

            } else {

              return false;
            }

      },



      employee: function() {

      	return Meteor.users.find().fetch();

        
      
      },


      isEmpReady: function(){

        if(this.profile.workStatus === "1" && this.profile.role != "customer"){

              if(this._id != Meteor.userId()){
                  return true;

              }

        }


      },

      modalEmpName: function(){

        return Session.get('modalEmpName');


      },

      

      empDiagStatus: function(key) {

        if(key){
          

          return Today.findOne({user: key});

        }
      
      }


});

Template.a_emp_bar.events({

	  'click .clickViewEmpDiags': function(event, template){

	    event.preventDefault();
	    

	    Session.set('modalEmp', this.user);
	    Session.set('modalEmpName', this.userName);


	  }
 });

Template.level.helpers({ //------------------------------------- helpers for embedded template return status star
	empLevel: function(roles) {

     

	    	return this.profile.role === roles;
	   
    }

});


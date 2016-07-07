Template.empAssign.onCreated(function() {

});

Template.empAssign.helpers({

	   assignEmployee: function() {

      	return Meteor.users.find({'profile.workStatus': '1'}).fetch();

     },

     toggleSelect: function() {

        statCheck = this.status;

        if(statCheck < 3){

          return true;
        } else {

          return false;
        }

     },

     sketchAssigned: function(key) {

        if(key){

        return key == this.sketcher ? 'selected' : '';

        }
      
     }


});

Template.empAssign.events({

	'change .empAssign': function (event, template) { 

  	event.preventDefault();

    var diagID = this.id;
    var oId = this.oid;

    if(this.level === "0"){

      //$(event.currentTarget).val('none');
      template.$('#'+diagID+'assign').val('none');

      sAlert.error('Please select diagram level before assigning.', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});
          

    } else {

    var selected = template.$('#'+diagID+'assign').val();

    

    Meteor.call('assignDiagram',selected,diagID,oId);
    //sAlert.success('Diagram assigned' , {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});
              
    	}	



    }


});
Template.signin.onCreated(function() { 


	


});


Template.signin.onRendered(function() { 

	if(Session.get('hereFirst')){
		window.location.reload();

	}

Session.set('hereFirst', false);
		
$('#email').focus();


});


Template.signin.helpers({

	
});

Template.signin.events({
	'submit form': function(evt, template){
		

		var email = template.$('#email').val(),
			password = template.$('#password').val();

		Meteor.loginWithPassword(email, password, function(error){

			if(Meteor.user()){

				Meteor.logoutOtherClients();

				var currentUser = Meteor.userId();

				console.log('at signin with ' + currentUser);

				if(Meteor.user().profile.role === "employee2" || Meteor.user().profile.role === "employee1") {
                   
                    Router.go('/emp-home');
                  }

                  else if (Meteor.user().profile.role === "admin") {


                    Router.go('/admin');
                  } 

                  else {
                  	Router.go('/c-home');
                  }


			} else {


				var message = "Oops!: " + error.reason;
				sAlert.error(message, {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});
          

			}
			return;
			
	});

		return false;

	}

});



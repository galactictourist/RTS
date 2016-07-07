Template.register.onRendered(function() { 


$('#f_name').focus();


});	

Template.register.events({
	'submit form': function(evt){
		
		
		var email = trimInput(evt.target.email.value);
		var password = trimInput(evt.target.password.value);
		var password2 = trimInput(evt.target.password2.value);
		var f_name = trimInput(evt.target.f_name.value);
		var l_name = trimInput(evt.target.l_name.value);
		var Phone = trimInput(evt.target.phone.value);

		//form validation
		if(isNotEmpty(email) && 
			isNotEmpty(password) &&
			 isNotEmpty(f_name) &&
			  isNotEmpty(l_name) &&
			  isNotEmpty(phone) && isEmail(email) &&
			  areValidPasswords(password, password2)) {

		

		Accounts.createUser({
			email:email,
			password:password,
      		profile: { 
      			firstName: f_name,
      			lastName: l_name,
      			phone: Phone,
      			plan: "0",
      			startTotal: "29.99",
      			role: "customer",
      			firstOrder: "0",
      			signUpDate: ""
      			
      		
      				}
      	}, function(err){
				if(err){
					sAlert.error('There was an error with registration', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});
					
				} else {
					sAlert.success('Welcome, '+f_name+'. Account Created! You are good to go!', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});
					
					
						
						Router.go('/c-home');
					
				}
				
			
		});// end account create

		
	}//end if

	return false;
		
	}// end submit form
});// end event

//Validation

//Trim Helper
var trimInput = function(val){
	return val.replace(/^\s*|\s*$/g, "");
}

//Check for empty fields
isNotEmpty = function(value) {
	if (value && value !== ''){
		return true;
	}
	//FlashMessages.sendError("Please fill in all fields");
	sAlert.error('Please fill in all fields', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});
	return false;
};

//Validate email
isEmail = function(value) {
	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
	if (filter.test(value)){
		return true;

	}
	//FlashMessages.sendError("Please use a valid email address");
	sAlert.error('Please use a valid email address', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});
	return false;
};

//Check password length
isValidPassword = function(password) {
	if(password.length < 6) {
		//FlashMessages.sendError("Password must be at least 6 characters");
		sAlert.error('Password must be at least 6 characters', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});

		return false;
	}
	return true;
};

// Match Password
areValidPasswords = function(password, confirm) {
	if (!isValidPassword(password)) {
		return false;
	}
	if (password !== confirm) {
		//FlashMessages.sendError("Passwords do not match");
		sAlert.error('Passwords do not match', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});
		return false;
	}
	return true;
};
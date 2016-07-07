
//------------------------------------------------------------------------------------------------------------ADMIN|
//-----------------------------------------------------------------------------------------------------------------|

//-----------------------------------------------------------------------------------STATUS KEY---------------------
//----------------------------------------ORDER/ 1=NEW 2=IN PROGRESS 3=DELIVERED
//---------------------------DIAGRAM/ 1=NEW 2=ASSIGNED 3=STARTED 4=SENT TO QC 5=QC STARTED 6=DELIVERED 7=ACCEPTED 0=REJECTED

//GEYSER FOR ADMIN ORDERS EXCEPT NEW
Meteor.publish('adminOrders', function() {

	var adminData = Orders.find({ 'status': {$in: [1,2,3] }});

	if(adminData){

		return adminData;
	}


    return this.ready();

});

Meteor.publish('qcPool', function() {

	var qcData = Orders.find({'diagram.status': {$in: [4,5]}});




	if(qcData){

		return qcData;
	}


    return this.ready();

});

//EMPLOYEES LIST FOR ADMIN
Meteor.publish('employees', function() {
	return Meteor.users.find({ 'profile.role': { $ne: 'customer' } });
});

//TODAY FOR ADMIN
Meteor.publish('todayUsers', function() {


    var dateToday = moment().format("MM-DD-YYYY");
	return Today.find({date: dateToday});
});

//MESSAGES FOR ADMIN
Meteor.publish('adminMsg', function(uid) {


	return AdminMessages.find({'from': uid});
});

//CUSTOMER LIST FOR ADMIN
Meteor.publish('customers', function() {
	return Meteor.users.find({ 'profile.role': 'customer' });
});



//-----------------------------------------------------------------------------------------------------------EMPLOYEE|
//-------------------------------------------------------------------------------------------------------------------|

//GEYSER FOR EMPLOYEES
Meteor.publish('empOrders', function(uid) {

 console.log('here in publish' + uid);

 	return Orders.find({ 'diagram.sketcher': uid });


});

Meteor.publish('sketchCount', function() {

	var sketchCount = Orders.find({ 'diagram.status': {$in: [1] }});

	return sketchCount;


});

Meteor.publish('empMsg', function(uid) {


	return AdminMessages.find({'to': uid});
});

//Sketches done *FILTER BY DAY-WEEK-MONTH ON CLIENT
Meteor.publish('sketchesDone', function(uid) {

	return Orders.find({ $and: [{'diagram.sketcher': uid}, {$or : [ { 'diagram.status' : 6 }, { 'diagram.status' : 7 } ] } ]});


});

//TODAY FOR EMPLOYEE
Meteor.publish('todayEmp', function(uid) {

	day =  moment().format("MM-DD-YYYY");

	return Today.find({ $and: [{'user': uid}, {'date': day }]});
});

//SINGLE USER
Meteor.publish('usersOne', function(uid) {
	return Meteor.users.find({'_id': uid});
});


//----------------------------------------------------------------------------------------------------------CUSTOMER|
//------------------------------------------------------------------------------------------------------------------|
//GEYSER FOR CUSTOMER
Meteor.publish('custOrders', function(uid) {
	return Orders.find({ $and: [{'custId': uid}, {'archive': 0}]});
});

//ARCHIVE ORDERS FOR CUSTOMER
Meteor.publish('custArchiveOrders', function(uid) {
	return Orders.find({'custId': uid, 'archive': 1});
});
//--------------------------------------------------------GLOBAL UTILITY

//ALL USERS
//Meteor.publish('users', function() {
	//return Meteor.users.find();
//});


//PROTOTYPE FOR ORDERS BY DATE///////
Meteor.publish('allOrders', function() {
	var d = new Date();
	d.setHours(d.getHours() - 48);
	return Orders.find();
});



//Sketches
Meteor.publish('sketches', function() {

	return Sketches.find();
});

//Stripe Accounts
Meteor.publish('stripeAccounts', function(){
  if(!this.userId) return this.ready();
  return StripeCustomers.find({
  	owner:this.userId
  });
});

Meteor.publish("allStripeAccountsAdmin", function(argument){
	if(this.userId){
			var currentUser = Meteor.users.findOne(this.userId),
			isAdmin = currentUser && _.isEqual(currentUser.profile.role, 'admin');
			if(isAdmin){
				return StripeCustomers.find();
			};
	};
});

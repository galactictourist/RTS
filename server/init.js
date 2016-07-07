Meteor.startup(function () {

  process.env.MAIL_URL = 'smtp://ridgetopmail:ridgetop2016@smtp.sendgrid.net:587';
      createUsers();
      //createTestOrders();
});



function createUsers () {
  var users

  if (Meteor.users.find().fetch().length === 0) {

    console.log('Creating users: ');

    users = [
      {fName:"Wyatt",lName:"Earp",email:"wyatt@me.com",role:"employee2"},
      {fName:"Charles",lName:"Bronson",email:"charles@me.com",role:"employee2"},
      {fName:"Justin",lName:"Bieber",email:"justin@me.com",role:"employee1"},
       {fName:"Carlos",lName:"Voltron",email:"jason@me.com",role:"admin"},
       {fName:"Wayne",lName:"Thomas",email:"wayne@me.com",role:"admin"}
    ];

    _.each(users, function (userData) {
      var id
      
      

      id = Accounts.createUser({
        email: userData.email,
        password: "password",
        profile: { firstName: userData.fName,
        lastName: userData.lName, phone: "4444444444", role: userData.role, workStatus: '0' }
      });

      // email verification
      Meteor.users.update({_id: id},
                          {$set:{'emails.0.verified': true}});

      
    
    });
  }
}



Accounts.onLogin(function() {

});


/*function createTestOrders () {

  //create 4 users

  var customers = [];
  var id;

    for (i = 0; i < 4; i++) {

      console.log('i ==' + i);

      

      id = Accounts.createUser({

        email:'test' + i + '@me.com',
        password:'password',
            profile: { 
              firstName: 'test' + i,
              lastName: 'tester',
              phone: '9999999999',
              plan: '0',
              startTotal: '29.99',
              role: 'customer',
              firstOrder: '0'}
              
            
                
                });// end account create
      console.log('id==' + id);

      customers.push(id);
    }

    console.log(JSON.stringify(customers));

    //Create orders for each new customer

    for (c = 0; c < customers.length; c++) {//each customer

      var custId = customers[i];

        for(o = 0; o < 75; o++){//75 orders

          var orderId = Random.id(7).toUpperCase();

            for(d = 0; d < 2; d++){// 2 diagrams per order

              var diag_id = Random.id(9).toUpperCase(); 
              var dt = new Date();


                    var newOrder = {
                    "orderId": orderId,
                    "eta": 24,
                    "custId": custId,
                    "custName": 'test' + c,
                    "total": '49.99',
                    "diagram":[

                        { 
                          "client": 'test client',
                          "clientemail": 'testclient@gmail.com',
                          "clientphone": '9999999999',
                          "price": '29.99',
                          "address": '6401 garden view drive Austin TX 78724',
                          "insName": 'smith',
                          "pitch": '5',
                          "lat": '0.00',
                          "lon": '0.00',
                          "xmateversion": '28',
                          "facets": '0-20',
                          "facetCount": 20,
                          "structure": 'residential',
                          "reporttype": 'ESX',
                          "expedite": '24',
                          "imgurls": '',
                          "id": diag_id,
                          "stage": ['New', dt, 'Customer'],
                          "status": 1,
                          "level": '0',
                          "oid": orderId,
                          "odate": dt,
                          "facetUpCharge": '0.00',
                          "comments": ''


                        }


                      ]


                  };//end new order   

                  if(d == 0){// first order insert

                    Orders.insert(newOrder, { validate: false});

                  } else {//next diagram update

                    Orders.update({ orderId: existingOrderId },{ $push: { diagram: newDiag }},{ validate: false});

                }

                  }


            }

        }


    }

    


            // tempOrder.update({ orderId: thisOrderId },{$set: {diagNum: 1, qcNum: 1}},{ validate: false});
            //Orders.insert(doc, { validate: false});





            /*var isOrderRush = tempOrder.findOne({ 'diagram.expedite' : '6' }); //check to mark eta field for sorting on front
                var isETA = 24;

               if(isOrderRush == null){


                } else {

                  isETA = 6;

                }*/////////////////////////




                /*Meteor.call('updateOrderETA',isETA,Session.get('newOrderId')); // update order eta for sorting

                    var firstOrder = Meteor.user().profile.firstOrder;//  update firstorder if this is the first one
                    if(firstOrder === "0"){
                      Meteor.call('orderCherryPop',Meteor.userId());
                    }
}
 
*/








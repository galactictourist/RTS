//IMPORTANT
//
// order.diagNum= for knowing when all diagrams in an order are assigned. decrements by one each
// time a diagram in the order is assigned.
//
// order.qcNum= for knowing when an order is delivered decrements when a diagram is delivered to
// customer.
//
//





Meteor.methods({

  'afterLogout': function(userId) {

    var roleCall = Meteor.users.findOne({
      '_id': userId
    }, {
      fields: {
        'profile.role': 1,
        '_id': 0
      }
    });
    var role = roleCall.profile.role;


    if (role === "employee1" || role === "employee2" || role === "admin") {

      

      Meteor.users.update({
        '_id': userId
      }, {
        $set: {
          'profile.workStatus': '0'
        }
      });

    } else if (role === "emp2qc") {

      Meteor.users.update({
        '_id': userId
      }, {
        $set: {
          'profile.role': 'employee2',
          'profile.workStatus': '0'
        }
      });
    }

  },

  //------------***************************************- CUSTOMER METHODS ---------------------------------------------------


  'custFeedbackSubmit': function(cat, diagId, msg){

    var d = new Date();

    Orders.update({
      'diagram.id': diagId
    }, {
      $set: {
        'diagram.$.feedbackCat': cat,
        'diagram.$.feedbacktext': msg,
        'diagram.$.feedbackread': 0,
        'diagram.$.feedbackDate': d
      }
    }, {
      validate: false
    });


  },


 'archiveOrder': function(order){


   Orders.update({
      'orderId': order
    }, {
      $set: {
        'archive': 1
      }
    }, {
      validate: false
    });


 },

 'orderCherryPop': function(uid){

    Meteor.users.update({
        '_id': uid
      }, {
        $set: {
          'profile.firstOrder': '1'
        }
      });


 },

  'custUpgrade': function(uid, plan) { //update profile.plan

    //subscription plan roles
    //m1, m2, y1, y2
    if (plan === 'mt1') {

      var sTotal = '24.99';
    }
    if (plan === 'mt2') {

      var sTotal = '19.99';
    }
    if (plan === 'yt1') {

      var sTotal = '24.99';
    }
    if (plan === 'yt2') {

      var sTotal = '19.99';
    }

    Meteor.users.update({
      '_id': uid
    }, {
      $set: {
        'profile.plan': plan,
        'profile.startTotal': sTotal
      }
    });



  },



  'updateOrderETA': function(etanum, orderid) {

    Orders.update({
      'orderId': orderid
    }, {
      $set: {
        'eta': etanum
      }
    }, {
      validate: false
    });

  },

  'sendOrderEmail': function(to, oid, total, custName) {

    
    var dateToday = moment().format("MM-DD-YYYY");

    Email.send({
      from: "admin@ridgetopsketch.com",
      to: to,
      subject: "Your recent order with Ridgetop Sketch",
      text: custName + "Thank you for your order (Order ID " + oid + ") for " + total + "at, " + dateToday
    });


  },

  //------------***************************************- ADMIN METHODS ---------------------------------------------------

  
  impersonate: function(userId) {
    check(userId, String);

    if (!Meteor.users.findOne(userId))
      throw new Meteor.Error(404, 'User not found');
  

    this.setUserId(userId);
  },

  impersonateWorkStatusFix: function(userId){

    Meteor.users.update(
   { '_id': userId },
   { $unset: { 'profile.workStatus': ''} });



  },


  'deleteEmp': function(eId) {

    Meteor.users.remove({
      '_id': eId
    });


  },


  'addNewEmployee': function(firstName, lastName, email, phone, role, password) {


    var id;


    id = Accounts.createUser({
      email: email,
      password: password,
      profile: {
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        role: role,
        workStatus: '0'
      }
    });

    // email verification
    Meteor.users.update({
      _id: id
    }, {
      $set: {
        'emails.0.verified': true
      }
    });




  },

  'addNewCustomer': function(firstName,lastName,email,phone,plan,password){


    //subscription plan roles
    //m1, m2, y1, y2, s27, s15 - 0 = default

    if (plan === '0') {

      var sTotal = '29.99';
    }

    if (plan === 'mt1') {

      var sTotal = '24.99';
    }
    if (plan === 'mt2') {

      var sTotal = '19.99';
    }
    if (plan === 'yt1') {

      var sTotal = '24.99';
    }
    if (plan === 'yt2') {

      var sTotal = '19.99';
    }
    if (plan === 's27') {

      var sTotal = '27.00';
    }
    if (plan === 's15') {

      var sTotal = '15.00';
    }

  Accounts.createUser({
      email:email,
      password:password,
          profile: { 
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            plan: plan,
            startTotal: sTotal,
            role: "customer",
            firstOrder: "0",
            signUpDate: " "
          }
        });



 },


  'adminMsgEmp': function(sendee, sender, theMsg) {

    var d = new Date();

   
    AdminMessages.insert({
      'to': sendee,
      'from': sender,
      'message': theMsg,
      'dateSent': d
    });



  },



  'loginUpdateWorkStatus': function(emp) {

    Meteor.users.update({
      '_id': emp
    }, {
      $set: {
        'profile.workStatus': '1'
      }
    });

  },


  'selfStartQC': function(diagID, emp) {
    //emp 2 or admin complete a sketch and move directly to QC


    var d = new Date();

    Orders.update({
      'diagram.id': diagID
    }, {
      $push: {
        'diagram.$.stage': {
          $each: ['QC Started', d, emp]
        }
      }
    }, {
      validate: false
    });

    Orders.update({
      'diagram.id': diagID
    }, {
      $set: {
        'diagram.$.status': 5
      }
    }, {
      validate: false
    });



  },



  'changeDiagramLevel': function(selected, diagID) {


    Orders.update({
      'diagram.id': diagID
    }, {
      $set: {
        'diagram.$.level': selected
      }
    }, {
      validate: false
    });



  },

  'changeOrderToInProgress': function(orderId) {


    Orders.update({
      'orderId': orderId
    }, {
      $set: {
        'status': 2
      }
    }, {
      validate: false
    });



  },





  'StartQC': function(userId, diagramId) {

    //diagram claimed for qc - set diagram stage to qc started then filter these out of qc pool
    //user id, diagram id, datetime, set stage

    var d = new Date();
 

    Orders.update({
      'diagram.id': diagramId
    }, {
      $push: {
        'diagram.$.stage': {
          $each: ['QC Started', d, userId]
        }
      }
    }, {
      validate: false
    });
    Orders.update({
      'diagram.id': diagramId
    }, {
      $set: {
        'diagram.$.status': 5,
        'diagram.$.qc': userId
      }
    }, {
      validate: false
    });

  },

  'ReleaseQC': function(userId,diagramId, fileURL){

    //diagram unclaimed for qc - set diagram stage to sent to qc to be put back into pool
    //user id, diagram id, datetime, set stage
    //delete any xtra file uploads

     var d = new Date();
   
    Orders.update({
      'diagram.id': diagramId
    }, {
      $push: {
        'diagram.$.stage': {
          $each: ['Sent back into QC', d, userId]
        }
      }
    }, {
      validate: false
    });
    Orders.update({
      'diagram.id': diagramId
    }, {
      $set: {
        'diagram.$.status': 4,
        'diagram.$.qc': ''
      }
    }, {
      validate: false
    });

     Sketches.remove({
      'qsketchUrl': fileURL
    });


  },

  'assignDiagram': function(empID, diagID, oId) {

    var d = new Date();
    var tdate = moment().format("MM-DD-YYYY");

    var sName = Meteor.users.findOne({
      '_id': empID
    }, {
      fields: {
        'profile.firstName': 1,
        'profile.lastName': 1,
        '_id': 0
      }
    });

    var empFullName = sName.profile.firstName + ' ' + sName.profile.lastName;

    ///////////-------------------------------------------------------------------check if reassign
    var prior = Orders.find({'diagram.id': diagID,'diagram.status':2 }).fetch(),

     onlyDiagrams = [];
      _.each(prior, function(single){
          _.each(single.diagram,function(diagram){
                if(diagram.id === diagID && diagram.sketcher != null && diagram.status === 2){
                  onlyDiagrams.push(diagram);
                   }
          })
      });

    if (onlyDiagrams.length > 0) {

 
      var priorEmp = [onlyDiagrams][0][0].sketcher;

       Today.update({
          $and: [{
            'user': priorEmp
          }, {
            'date': tdate
          }]
        }, {
          $inc: {
            'diagsSent': -1
          }
        }, {
          validate: false
        });

        Orders.update({
         'orderId': oId
         }, {
         $inc: {
        'diagNum': 1
         }
         }, {
          validate: false
         });
      
     }


    Orders.update({
      'diagram.id': diagID
    }, {
      $set: {
        'diagram.$.sketcher': empID,
        'diagram.$.sketcherName': empFullName,
        'diagram.$.status': 2
      }
    }, {
      validate: false
    });
    
    Orders.update({
      'orderId': oId
    }, {
      $inc: {
        'diagNum': -1
      }
    }, {
      validate: false
    });

    Today.update({'user': empID}, {$inc: {'diagsSent': 1}}, {validate: false});


    Orders.update({
      'diagram.id': diagID
    }, {
      $push: {
        'diagram.$.stage': {
          $each: ['Assigned', d, 'admin']
        }
      }
    }, {
      validate: false
    });







  },

  'ainsertSketchFile': function(uid, diagId, fileName, furl, flag) {

    var dateToday = moment().format("MM-DD-YYYY");

    //check if file is extra file for employee qc 
    // if it is then insert this into Xtrasketch 
  
    if(flag){

      Sketches.insert({
      'diagramId': diagId,
      'XtrasketchUrl': furl,
      'qcId': uid,
      'XtrasketchName': fileName,
      'date': dateToday
    });


    } else {

       Sketches.insert({
      'diagramId': diagId,
      'qsketchUrl': furl,
      'qcId': uid,
      'qsketchName': fileName,
      'date': dateToday
    });


    }

   



  },



  'deleteSketchFile': function(id) {

    Sketches.remove({
      '_id': id
    });


  },


  'sendFilestoCustomer': function(orderID, diagID, facetsNew, facetsOld, emp) {

    
    var d = new Date();
    var facetUpCharge = '0.00'; //store upcharge amount


    if (facetsNew > facetsOld) { //if new is larger than highest original facet count then find new charge

      if (facetsNew > 60) {
        facetUpCharge = '15.00';
      } else if (facetsNew > 40) {
        facetUpCharge = '10.00';
      } else {
        facetUpCharge = '5.00';
      }


    }

    Orders.update({
      'diagram.id': diagID
    }, {
      $set: {
        'diagram.$.status': 6,
        'diagram.$.deliveredDate': d,
        'diagram.$.qcFacets': facetsNew,
        'diagram.$.facetUpCharge': facetUpCharge
      }
    }, {
      validate: false
    });
    

    Orders.update({
      'diagram.id': diagID
    }, {
      $push: {
        'diagram.$.stage': {
          $each: ['Delivered', d, emp]
        }
      }
    }, {
      validate: false
    });


    Orders.update({
      'diagram.id': diagID
    }, {
      $inc: {
        'qcNum': -1
      }
    }, {
      validate: false
    });

    /*var qcNow = Orders.findOne({ ////////////// come back to this why the hell doesn't this work????
      'orderId': orderID
    }, {
      fields: {
        'qcNum': 1,
        '_id': 0
      }
    });

    console.log('qcNow==' + JSON.stringify(qcNow));

    var getqcNow = qcNow.qcNum;

    console.log('getqcNow==' + getqcNow);

    if (getqcNow == '0') {

      Orders.update({
        'orderId': orderID
      }, {
        $set: {
          'status': 3
        }
      }, {
        validate: false
      });
    }
*/



    //EMAIL CUSTOMER HERE



  },

  //------------***************************************- EMPLOYEE METHODS ---------------------------------------------------

  'readAdminMsg': function(msgId) {

    var d = new Date();

   
    AdminMessages.update({
      '_id': msgId
    }, {
      $set: {
        'dateRead': d
      }
    }, {
      validate: false
    });

  },

  'empLoginUpdateWorkStatus': function(emp) {


    var dateToday = moment().format("MM-DD-YYYY");
    var check = Today.findOne({
      $and: [{
        'user': emp
      }, {
        'date': dateToday
      }]
    });


    if (check === undefined) {

      var sName = Meteor.users.findOne({
        '_id': emp
      }, {
        fields: {
          'profile.firstName': 1,
          'profile.lastName': 1
        }
      });
      var empFullName = sName.profile.firstName + ' ' + sName.profile.lastName;


      Today.insert({
        'user': emp,
        'userName': empFullName,
        'diagsSent': 0,
        'diagsRequested': 0,
        'date': dateToday
      });
    }



  },


  'newDiagCount': function(uid) { //get new assigned diag count for tab counter




    var data = Orders.find({
      $and: [{
        'diagram.sketcher': uid
      }, {
        'diagram.status': 2
      }]
    });

    return data;

  },

  'empTwoAddQC': function(uid) { //add qc for this session                 


    Meteor.users.update({
      '_id': uid
    }, {
      $set: {
        'profile.role': 'emp2qc',
        'profile.workStatus': '1'
      }
    });


  },

   'empTwoRemoveQC': function(uid){

     Meteor.users.update({
      '_id': uid
    }, {
      $set: {
        'profile.role': 'employee2'
      }
    });



   },



  'empDiagStatusReject': function(diagID, emp) {


    var d = new Date();



    Orders.update({
      'diagram.id': diagID
    }, {
      $push: {
        'diagram.$.stage': {
          $each: ['Rejected', d, emp]
        }
      }
    }, {
      validate: false
    });

    Orders.update({
      'diagram.id': diagID
    }, {
      $set: {
        'diagram.$.status': 0
      }
    }, {
      validate: false
    });



  },

  'empDiagStatusStart': function(selected, diagID, emp) {

    var d = new Date();

    Orders.update({
      'diagram.id': diagID
    }, {
      $push: {
        'diagram.$.stage': {
          $each: ['Started', d, emp]
        }
      }
    }, {
      validate: false
    });
    Orders.update({
      'diagram.id': diagID
    }, {
      $set: {
        'diagram.$.status': 3
      }
    }, {
      validate: false
    });



  },

  'einsertSketchFile': function(uid, diagId, fileName, furl) {

    var dateToday = moment().format("MM-DD-YYYY");

    Sketches.insert({
      'diagramId': diagId,
      'esketchUrl': furl,
      'sketcherId': uid,
      'esketchName': fileName,
      'date': dateToday
    });



  },

  'empDiagSendQC': function(diagID, facets, emp) {

  

    var d = new Date();


    Orders.update({
      'diagram.id': diagID
    }, {
      $set: {
        'diagram.$.status': 4,
        'diagram.$.EmpOnefacets': facets
      }
    }, {
      validate: false
    });

    Orders.update({
      'diagram.id': diagID
    }, {
      $push: {
        'diagram.$.stage': {
          $each: ['Sent to QC', d, emp]
        }
      }
    }, {
      validate: false
    });



  },


  'empWorkStatusUpdate': function(selected, emp) {



    Meteor.users.update({
      '_id': emp
    }, {
      $set: {
        'profile.workStatus': selected
      }
    });


  },




  'sketchRequest': function(id, amount) {



    var dateToday = moment().format("MM-DD-YYYY");
  

    Today.update({
      $and: [{
        'user': id
      }, {
        'date': dateToday
      }]
    }, {
      $set: {
        'diagsRequested': amount
      }
    }, {
      validate: false
    });




  }

}); //end methods




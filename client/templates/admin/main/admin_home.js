

Template.admin_home.onCreated(function() {

	     var self = this;

	     self.autorun(function () {


	     self.subscribe('adminOrders');
       self.subscribe('users');
       self.subscribe('employees');
       self.subscribe('todayUsers');
       self.subscribe('sketches');
       self.subscribe('adminMsg',Meteor.userId());
       self.subscribe('customers');



	     });



});

Template.admin_home.onRendered(function() {



});


Template.admin_home.helpers({

  notDelivered: function() {

    var stat = this.status;

    if(stat !== 6){

      return true;
    }

  },

  qcAssigned: function() {

    if(this.qc){

      var sName = Meteor.users.findOne({
      '_id': this.qc
    }, {
      fields: {
        'profile.firstName': 1,
        'profile.lastName': 1
      }
    });

    var empFullName = sName.profile.firstName + ' ' + sName.profile.lastName;

    return empFullName;
    }



  },

  qadminSelect: function() {

    if(Session.get('a_myQC')){

      return true;
    }


  },


  msgEmployee: function() {//send message to employee from message tab


    return Meteor.users.find({'_id': {$ne: Meteor.userId()}},{'profile.role': { $ne: 'customer'}}).fetch();

     },



  

  ifComments: function() {

    if(this.comments){

      
       return true;
    }
  },

  getComments: function() {



      var diagId = this.id;

     

       return Session.get(diagId + 'Cmts');
     },


  unreadMsgs: function() {


    return AdminMessages.find({ 'dateRead': { $exists: false } }).fetch();



    },

    custMsgs: function() {

    var queryMsgs =  Orders.find({'qcNum': 0, 'diagram.feedbackread':0}).fetch(),



       onlyDiagrams = [];
      _.each(queryMsgs, function(single){
          _.each(single.diagram,function(diagram){
                if(diagram.feedbackread === 0){
                  onlyDiagrams.push(diagram);
                   }
          })
      });
      return onlyDiagrams;


    //return AdminMessages.find({ 'dateRead': { $exists: false } }).fetch();
    //, { 'custName': 1, 'diagram.id': 1, 'diagram.feedbacktext': 1, 'diagram.feedbackCat': 1, 'diagram.feedbackdate': 1 }


    },



  msgEmpName: function() {

      var id = this.to;

     

    return Meteor.users.findOne({'_id':id});



    },

  msgDate: function() {

        var mDate = moment(this.dateSent).format('MM-DD-YY, h:mm a');

        return mDate;
      },



  newOrderCount: function(){

    var newCount = Orders.find({'status':1}).count();

    if(newCount !== 0){

      return newCount
    } else {

      return false;
    }

  },

  newQCCount: function(){

    var queryQC =  Orders.find({ "diagram.status":4}).fetch(),

       onlyDiagrams = [];
      _.each(queryQC, function(single){
          _.each(single.diagram,function(diagram){
                if(diagram.status === 4){
                  onlyDiagrams.push(diagram);
                   }
          })
      });
      

    if(onlyDiagrams.length !== 0){

      return onlyDiagrams.length;
    } else {

      return false;
    }

  },

  myDiagram: function() {

      var uid = Meteor.userId();

      var queryUserDiagrams = Orders.find({'diagram.sketcher': uid}).fetch(),



       onlyDiagrams = [];
      _.each(queryUserDiagrams, function(single){
          _.each(single.diagram,function(diagram){
                if(diagram.sketcher === uid && diagram.status < 6){
                  onlyDiagrams.push(diagram);
                   }
          })
      });
      return onlyDiagrams;
    },

    updateStatus: function() {



    if(this.status == 3){


      return Spacebars.SafeString('<option disabled="disabled" selected="selected">Select</option><option value="1">Start QC</option>');



    } else if (this.status == 5) {

      return Spacebars.SafeString('<option disabled="disabled" selected="selected">QC in Progress</option><option value="1">Start QC</option>');
    }
    else {

      return Spacebars.SafeString('<option disabled="disabled" selected="selected">Select</option><option value="0">Start</option>');


    }
    },



  progress: function(){

        var result = ((this.diagram.length - this.diagNum) / this.diagram.length) * 100;

        if(result === 100){

          var orderId = this.orderId;

          Meteor.call('changeOrderToInProgress',orderId);//update order status to in progress (2)

        }

        return Spacebars.SafeString(result+'%');


      },

      order: function() {

        	return Orders.find({}, {sort: {status: 1, eta: 1, orderDate: -1}}).fetch();

      },

      orderStatusCheck: function(key) {

        

        if(key)

          if(key === 0){

            orderId = this.orderId;

             

             Meteor.call('changeOrderToDelivered',orderId);//update order status to delivered (3)

          }

      },



  borderColorStatus: function() {

            if(this.expedite[0] == '6'){
              return Spacebars.SafeString('red;');
            } else {
              return Spacebars.SafeString('#3071a9;');
            }
      },


  ColorStatusOrder: function() {

        if(this.eta === 6) {

          return Spacebars.SafeString('red');

        }


      },

  orderCount: function() {



       	var orderNum = Orders.find().count();
       	//Session.set('orderCount', orderNum);
        return orderNum; //Session.get('orderCount') ;

      },

  qcDivShow: function() {


        if(this.id === Session.get('qcDivId')){
          return "show";
        }
      },




  diagLvl: function(key) {

        return key == this.level ? 'selected' : '';

      },

  diagStatus: function() {

         var code = this.status;

      var show;

      switch (code) {
    case 1:
        show = "New";
        break;
    case 2:
        show = "Assigned";
        break;
    case 3:
        show = "Started";
        break;
    case 4:
        show = "Sent to QC";
        break;
    case 5:
        show = "QC Started";
        break;
    case 6:
        show = "Delivered";
        break;
    case 7:
        show = "Started";
        break;

    }

    return show;

      },


  statusProgress: function(){

        var stat = this.status;
        var qcnum = this.qcNum;

        if(stat === 1){

          return Spacebars.SafeString('<span id="d-ID" style="margin:0;"" class="label label-warning">New</span>');

        }
        else if (stat === 2 && qcnum === 0)  {



           return Spacebars.SafeString('<span id="d-ID" style="margin:0;"" class="label label-success">Delivered</span>');



        }
        else {

          if(stat === 2){

            return Spacebars.SafeString('<span id="d-ID" style="margin:0;"" class="label label-info">In Progress</span>');

          }

        }


      },

  momentTime: function() {

        var oDate = moment(this.orderDate).format('MM-DD-YY, h:mm a');

        return oDate;
      },

       anyMomentTime: function(key) {

        var aDate = moment(key).format('MM-DD-YY, h:mm a');

        return aDate;
      },

  eMgmtTemplate: function() {

    if(Session.get('showMgmtTmpl')){

      if(Session.get('showMgmtTmpl') === "emp"){

        return true;
      }
    }


  },

  cMgmtTemplate: function() {

    if(Session.get('showMgmtTmpl')){

      if(Session.get('showMgmtTmpl') === "cust"){

        return true;
      }
    }


  },

  momentDuration: function() {



        if(this.expedite === '6'){

          var hoursToAdd = 6;
        } else {

          var hoursToAdd = 24;
        }




        var oDate = moment(this.odate);

          function pad(num) {
            var str = '' + num;
            return str.length < 2 ? '0' + str : str;
          }



          var dueDate = oDate.add(hoursToAdd, 'hours');

          var now = moment();

          if (dueDate.isBefore(now))
           { return 'overdue' }


          var hours = dueDate.diff(now, 'hours');
          var minutes = dueDate.diff(now, 'minutes') - hours * 60;

          var time = [];
          if (hours > 0) time.push(hours + 'h');
          if (minutes > 0 || time.length > 0) time.push(pad(minutes) + 'm');


          var dueIn = 'Due in ' + _.compact(time).join(' ');

          return dueIn;



      }


});



Template.admin_home.events({

  'click #btn_emp_mgmt': function(event, template){

    

    Session.set('showMgmtTmpl','emp');

    return false;

  },

  'click .comments': function(event, template){


   var comment = this.comments;
 
    Blaze.renderWithData(Template.commentsModal, {
      com: comment
    }, document.body);

   


  },


  'click #btn_cust_mgmt': function(event, template){

   

    Session.set('showMgmtTmpl','cust');

    return false;
    
  },

 

  'click #sendEmpMsg': function (event, template) {

   

    var e = document.getElementById("msgEmp");
    var sendee = e.options[e.selectedIndex].value;

    var sender = Meteor.userId();
    var theMsg = document.getElementById("msg").value;

    


    Meteor.call('adminMsgEmp',sendee,sender,theMsg);
    sAlert.success('Message sent.' , {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});

    document.getElementById("msg").value = "";
    document.getElementById("msgEmp").value = "";

    return false;

    },

  'click #qcTab': function(event, template){

  },


    'change .selectLvl': function (event, template) {

    event.preventDefault();

    //Id of this select
    var clickId = event.currentTarget.id;

   
    //User Id
    var qc = Meteor.userId();


    var selected = $(event.currentTarget).val();
    var diagID = this.id;



    Meteor.call('changeDiagramLevel',selected,diagID);
    //sAlert.success('Diagram level set to ' + selected , {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});





    },


  'change .update': function (event, template) {

    event.preventDefault();



    var selected = $(event.currentTarget).val(); //selected status update value

    var emp = Meteor.userId();

    var diagID = this.id; //diagram id

    

        switch(selected){
          case '0':                //start selected


              Meteor.call('empDiagStatusStart',selected,diagID,emp);

              sAlert.success('Diagram started', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});


              break

          case '1':

              //$("#update").val(selected);
              Session.set('qcDivId', diagID);

              Meteor.call('selfStartQC',diagID,emp);


              sAlert.success('QC Started', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});


              break


        }


    }



});





UI.registerHelper('returnCount', function(context, options) { //--------------pass array for length
  if(context)
    return context.length;
});



Template.eta.helpers({ //------------------------------------- helpers for embedded template return status star
	etaStatus: function(expedite) {

	    	return this.expedite[0] === expedite;
	    }

});


Template.admin_home.onDestroyed(function () {


});

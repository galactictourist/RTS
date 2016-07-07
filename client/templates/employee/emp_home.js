Template.emp_home.onCreated(function() {


	   var self = this;

	   self.autorun(function () {

          var emp = Meteor.userId();

          Tracker.afterFlush(function () {

            var thisRole = Meteor.user().profile.role;

            if(Session.get('empRole') == null){

               Session.set('empRole', thisRole);

            }

          

          });

  	     //self.subscribe('empOrders', emp);
  	     self.subscribe('usersOne', emp);
         self.subscribe('todayEmp', emp);
         self.subscribe('sketches');
         self.subscribe('empMsg',emp);
         self.subscribe('employees');
         self.subscribe('sketchCount');
         self.subscribe('qcPool');
         self.subscribe('empOrders', emp);

	   });

});

Template.emp_home.onRendered(function() { 


});

Template.emp_home.helpers({

   unreadMsgs: function() {


    return AdminMessages.find({ 'dateRead': { $exists: false } }).fetch();

    

    },

    msgAdminName: function() {

      var id = this.from;

      

    return Meteor.users.findOne({'_id':id});

    

    },

    getSketchCount: function() {


      var querySketchCount =  Orders.find({ "diagram.status":1}).fetch(),

       onlyDiagrams = [];
      _.each(querySketchCount, function(single){
          _.each(single.diagram,function(diagram){
                if(diagram.status === 1){
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

     msgDate: function() {

        var mDate = moment(this.dateSent).format('MM-DD-YY, h:mm a');

        return mDate;
      },


    newMsgCount: function(){

    var newCount = AdminMessages.find({ 'dateRead': { $exists: false } }).count();

    if(newCount !== 0){

      return newCount
    } else {

      return false;
    }

  },

  newDiagCount: function(){

   uid = Meteor.userId();



    var empDiagrams = Orders.find({'diagram.sketcher': uid}).fetch(),
  
       assignedDiagrams = [];

      _.each(empDiagrams, function(single){
          _.each(single.diagram,function(diagram){
            if(diagram.sketcher === uid && diagram.status == 2){
                  assignedDiagrams.push(diagram);
                   }
 
          })
      });
      
      
    if(assignedDiagrams.length !== 0){

      return assignedDiagrams.length;

    } else {

      return false;
    }

  },

  getProfileData: function() {

      var me = Meteor.userId();

      return Meteor.users.find({'_id':me}).fetch();
  
     
  },

  

  isInQC: function() {

    var role = Session.get('empRole');

      if (role ==='emp2qc') {

        return true;

        } else {

        return false;

        }
  
     
  },
  showGoQCButton: function() {

      var role = Session.get('empRole');

     

      if (role === 'employee2') {

        return true;

        } else {

        return false;

        }
  
     
  },

  thisEmployee: function() {

      return Meteor.users.findOne({});

  },


  empStats: function() {


      return Today.findOne({});
      
  },


  wStatus: function(key) {

      if(key){

       
        if(key === "1") {

          return 'checked';

        }
      }


  },

  wStatusTxt: function(key) {

      if(key){

       

        if(key == "1") {

          return Spacebars.SafeString('Ready');

        } else {

          return Spacebars.SafeString('Off');
        }
      }


  },

  qempSelect: function() {

    console.log('qempSelect fired');

    if(Session.get('myQC')){

      console.log('qempselect true');

      return true;
    }


  }



});




Template.emp_home.events({

  'click #eqcTab': function(event, template){



  },

   'click #readMsg': function(event, template){

    msgId = this._id;

    Meteor.call('readAdminMsg',msgId);
    sAlert.success('Message marked as read.', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'}); 



  },

  'change #updateWorkStatus': function(event, template){ //update emp work status

    event.preventDefault();


    var selected = template.$('#updateWorkStatus').is(":checked");
    var rslt;

    if(selected){
      rslt = "1";
    } else {
      rslt = "2";
    }


    emp = Meteor.userId();


    Meteor.call('empWorkStatusUpdate',rslt,emp);
    
    sAlert.success('Work status updated', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'}); 



  },

  'click #sketchrequest': function(event, template) {

    event.preventDefault();

    if( document.getElementById("srequest").value === ""){

      sAlert.error('Enter number of requested sketches.', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'}); 


    } else {

      var reqSketch = document.getElementById("srequest").value;

      

      Meteor.call('sketchRequest',Meteor.userId(),reqSketch);

      document.getElementById("srequest").value ="";

      sAlert.success('Request sent.', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});


    }

   

  },

  'click #goQC': function(event, template) {

    

    var uid = Meteor.userId();

    Meteor.call('empTwoAddQC',uid);

    Session.set('empRole','emp2qc');

    sAlert.success('You are now in QC mode.', {effect: 'slide', position: 'top-right', timeout: '5000', onRouteClose: false, stack: false, offset: '100px'});

   
    return false;
  },

   'click #quitQC': function(event, template) {

    

    var uid = Meteor.userId();

    Meteor.call('empTwoRemoveQC',uid);

    Session.set('empRole','employee2');

    sAlert.success('You have exited QC mode.', {effect: 'slide', position: 'top-right', timeout: '5000', onRouteClose: false, stack: false, offset: '100px'});

   
    return false;
  }





});






Template.emp_home.onDestroyed(function () {

  Session.delete('qcDivId');

 

});














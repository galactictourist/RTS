Template.esketch.onCreated(function() {

});

Template.esketch.onRendered(function() { 



});

Template.esketch.helpers({

  qcDivShow: function() {


        if(this.id === Session.get('qcDivId')){
          return "show";
        }
      },

  
    empdiagram: function() {

      
      var emp = Meteor.userId();

      var empDiagrams = Orders.find({'diagram.sketcher': emp}).fetch(),
  
       assignedDiagrams = [];

      _.each(empDiagrams, function(single){
          _.each(single.diagram,function(diagram){
            if(diagram.sketcher === emp && diagram.status < 4){
                  assignedDiagrams.push(diagram);
                   }
              
                  
                  
                  
                 
          })
      });

   
      return assignedDiagrams;
    },

    today: function() {

      var currentDate = moment().format("MM-DD-YYYY");
      return currentDate;
    },

  

    dStatus: function() {

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

    assignedtime: function() {

      var time = this.stage[3];

      var aTime = moment(time).format('MM/DD/YYYY, hh:mm');
      
      return aTime;
    },

    borderColorStatus: function() {

        if(this.expedite[0] == '6'){
          return Spacebars.SafeString('red;');
        } else {
          return Spacebars.SafeString('#3071a9;');
        }
    },

    updateStatus: function() {

    if(Meteor.user().profile.role === 'employee2') {

     

        if(this.status == 3){

     

          return Spacebars.SafeString('<option value="" selected="selected">Select</option><option value="2">Start QC</option>');

                                 
        } else {

          return Spacebars.SafeString('<option selected="selected">Select</option><option value="0">Start</option>'); 
         
        }


    } else {

        if(this.status == 3){

          
          return Spacebars.SafeString('<option value="" selected="selected">Select</option><option value="2">Send to QC</option>');

    

        } else {
        

      return Spacebars.SafeString('<option  selected="selected">Select</option><option value="0">Start</option><option value="1">Reject</option>');                                           

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




Template.esketch.events({




  'change #update': function (event, template) { 

    event.preventDefault();

    

    var selected = $(event.currentTarget).val(); //selected status update value

    var emp = Meteor.userId();

    var diagID = this.id;//jQuery(event.currentTarget).data('id'); //diagram id
    //var newdiagID = 

        switch(selected){
          case '0':                //start selected. 

             

              Meteor.call('empDiagStatusStart',selected,diagID,emp);

              sAlert.success('Diagram started', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});

              
              break

          case '1':

         

              var message = "Can't do it";

             Meteor.call('empDiagStatusReject',selected,diagID,emp,message);

              sAlert.success('Diagram rejected', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});


              break

          case '2':               //show send to qc facet number text and send button hanlde update with button
              
             

              $("#update").val(selected);
              Session.set('qcDivId', diagID);

              break

        }


    }






});



Template.eDiagEta.helpers({ //------------------------------------- helpers for embedded template return status star
  diagetaStatus: function(expedite) {

        return this.expedite[0] === expedite;
      }

});






Template.esketch.onDestroyed(function () {

 

});














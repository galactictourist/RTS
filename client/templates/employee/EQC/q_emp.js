Template.q_emp.onCreated(function() {
  

});


Template.q_emp.onRendered(function() {

       this.autorun(function () {

          

            });

   

});




Template.q_emp.helpers({

  

    getFiles: function() {

      var diagID = this.id;

      return Sketches.find({'diagramId': diagID}).fetch();


    },

    orderinqc: function() {

      
       var uid = Meteor.userId(); 
       var queryQCDiagrams = Orders.find({},{sort: {eta: 1, orderDate: -1}}).fetch(),


       onlyQCDiagrams = [];
      _.each(queryQCDiagrams, function(single){
          _.each(single.diagram,function(diagram){
                if(diagram.status == 4)
                {
                  onlyQCDiagrams.push(diagram);
                }
                if((diagram.status == 5 && diagram.qc == uid))
                {
                      onlyQCDiagrams.push(diagram);
                }
                  
          
          })
      });
      onlyQCDiagrams.sort(function(a, b){
      return a.expedite-b.expedite
      });
      return onlyQCDiagrams;
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

      var time = this.stage[1];

      var aTime = new Date(time).toISOString();
      
      return aTime;
    },

    borderColorStatus: function() {

        if(this.expedite[0] == '6'){
          return Spacebars.SafeString('red;');
        } else {
          return Spacebars.SafeString('#3071a9;');
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




Template.q_emp.events({


//CLAIM DIAGRAM FOR QC
  'click .listqcCheck': function(event, template){


    //Id of this checkbox
    var clickId = event.currentTarget.id;

    
    //Diagram ID
    var ID = this.id;

    //User Id
    var qc = Meteor.userId();


    Session.set('myQC',ID);

     
    //Set diagram to status 5 qc started
      
    Meteor.call('StartQC',qc,ID);

    sAlert.success('Sketch claimed for QC.', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});
              
      

  }

  

});





Template.qempDiagEta.helpers({ //------------------------------------- helpers for embedded template return status star
  qdiagetaStatus: function(expedite) {

        return this.expedite[0] === expedite;
      }

});



Template.q_emp.onDestroyed(function () {
 

});














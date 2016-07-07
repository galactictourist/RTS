Template.q_emp_select.onCreated(function() {

	
	

});


Template.q_emp_select.onRendered(function() {

  var self = this;

   self.autorun(function () {

          self.subscribe('sketches');

          Tracker.afterFlush(function () {

             if(Session.get('myQC')){

                          

                           var ID = Session.get('myQC');

                           $('#myqc'+ ID).prop('checked', true);

                           if(Session.get('addQCUpload')){
                            $('#addFile'+ Session.get('myQC')).prop('checked',true);
                           } 

                            
                        } 


          });


     });


});


Template.q_emp_select.helpers({

  

    getFiles: function() {

      var diagID = Session.get('myQC');

      return Sketches.find({'diagramId': diagID}).fetch();


    },

    selectedOrderInQC: function() {

     
       var uid = Meteor.userId(); 
       var diagId = Session.get('myQC');

       var queryQCDiagrams = Orders.find({'diagram.id': diagId}).fetch(),


       onlyQCDiagrams = [];
      _.each(queryQCDiagrams, function(single){
          _.each(single.diagram,function(diagram){
               
                if((diagram.status == 5 && diagram.qc == uid))
                {
                      onlyQCDiagrams.push(diagram);
                }
                  
          
          })
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

    }


});




Template.q_emp_select.events({


//UNCLAIM DIAGRAM FOR QC
  'click .qcCheck': function(event, template){


    //Id of this checkbox
    var clickId = event.currentTarget.id;

    
    //Diagram ID
    var ID = this.id;

    //User Id
    var qc = Meteor.userId();

    //check if unclaiming
    if(Session.get('myQC') === ID){


      //unclaim
 
     
      Session.set('addQCUpload', null);
      //if they uploaded an extra file get rid of it
      if(Session.get('addFileURL')){

        var fileUploaded = Session.get('addFileURL');

      }
     

      Meteor.call('ReleaseQC',qc,ID,fileUploaded);

      sAlert.success('Sketch unclaimed and entered back into QC pool.', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});
      
      Session.set('myQC', null);
      Session.set('addFileURL', null);



    } 

  }



});





Template.qempDiagEta.helpers({ //------------------------------------- helpers for embedded template return status star
  qdiagetaStatus: function(expedite) {

        return this.expedite[0] === expedite;
      }

});















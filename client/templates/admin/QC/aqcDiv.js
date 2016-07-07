Template.aqcDiv.helpers({

  isNotSelfQC: function() {//show add file checkbox if not in self QC

    if(Session.get('qcDivId') == null){

    return true

    }

  },


});

Template.aqcDiv.events({

    'click .addFile': function(evt){

      //Id of this checkbox
      var clickId = evt.currentTarget.id;

    
      //Diagram ID
      var ID = this.id;

      

      if(Session.get('addQCUpload')){

        if(Session.get('addQCUpload') === ID){

          Session.set('addQCUpload', null);
        }
      } else {

      Session.set('addQCUpload', ID);

    }


    },


    'click .clickSendtoCust': function(evt){

        evt.preventDefault();

      

        //check if QC'ing employee1 diagram in which case we don't force file upload
        //add checkbox if we are uploading additional file then we do force file upload
        //Session qcDivId is only true when self QC'ing if false then we are QC'ing emp 1
        //Session addQCUpload is true if add file checkbox is checked

        var needFile = true;

        if(Session.get('qcDivId') == null){

           

          //here we are in qc for emp1 
          needFile = false; //don't force upload
            if(Session.get('addQCUpload') != null){
              needFile = true;
              }

        }

        
        var emp = Meteor.userId();
        var OrderID = this.oid;
        
        var diagID = this.id;
        var sketchFileCount = Sketches.find({'diagramId': diagID,'qcId': emp }).count();
       
      
        var facets = document.getElementById(diagID+"Facets").value;
        var origFacets = $('#'+diagID+'fCount').text();

        if(facets === "") {
          
            sAlert.error('Value required for facets field', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'}); 

         } else if(needFile){


              

              if(sketchFileCount.toString() === '0'){

                sAlert.error('Sketch file missing', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'}); 
              } else {


              

                Meteor.call('sendFilestoCustomer',OrderID, diagID,facets,origFacets,emp);

               //check if using sendtocustomer in my diagrams as qc to not delete selected diagram on qc tab.
               if(Session.get('qcDivId')){

                  Session.set('qcDivId', null);

                } else {

                  Session.set('a_myQC', null);
                  //delete any extra file upload reference
                  Session.set('addFileURL', null);
                }
         
          

                sAlert.success('Files sent to customer', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'}); 


              }


         } else {

           

            Meteor.call('sendFilestoCustomer',OrderID, diagID,facets,origFacets,emp);

            //check if using sendtocustomer in my diagrams as qc to not delete selected diagram on qc tab.
            if(Session.get('qcDivId')){

             Session.set('qcDivId', null);

          } else {

             Session.set('a_myQC', null);
             //delete any extra file upload reference
             Session.set('addFileURL', null);
          }
         
          

          sAlert.success('Files sent to customer', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'}); 


        }

        
    }
});
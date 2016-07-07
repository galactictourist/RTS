var euploader = new Slingshot.Upload("sketchUploads");

  Template.e_fileList.onCreated(function() {

         var self = this;

         self.autorun(function () {

         self.subscribe('sketches');
        

         });

    
     
  });




  Template.e_fileList.helpers({

    progress: function () {

    var prog = Math.round(euploader.progress() * 100);

    if(prog > 1 && prog < 99){

        return true;
    }
  

  },

  isEmpTwoFiles: function () {

    var empRole = Meteor.user().profile.role;

    if(empRole === 'employee2'){

      return true;
    } else {

      return false;
    }


  },

  theFiles: function () {


      var uId = Meteor.userId();
      var dateToday = moment().format("MM-DD-YYYY");
     
      var diagID = this.id;

      var empRole = Meteor.user().profile.role;
      
      if(empRole === 'employee2' || empRole === 'emp2qc'){

      return Sketches.find({ $and: [{'qcId': uId}, {'diagramId': diagID}, {"date": dateToday }]}).fetch();

      } else {

      return Sketches.find({ $and: [{'sketcherId': uId}, {'diagramId': diagID}, {"date": dateToday }]}).fetch();


      }

     
  }


    
  });



  Template.e_fileList.events({

    'click .fileUp': function(event, template) {


      event.preventDefault();

      //Id of this button
      var clickId = event.currentTarget.id;

      //user Id
      var uid = Meteor.userId();
     

      //Diagram ID
      var diagID = this.id;
     

      var files = template.$('#'+diagID+'files')[0].files;
      var fileName = files.item(0).name;

   
        euploader.send(files[0], function (error, downloadUrl) {
          if (error) {
            // Log service detailed response
            console.error('Error uploading', euploader.xhr.response);
            alert (error);
          } else {
          

            

            } 

            // URL received, file is up
            //console.log('success:', downloadUrl);

            var empRole = Meteor.user().profile.role;
           
            if(empRole === 'employee2' || empRole === 'emp2qc'){

              //check if extra file is being uploaded to delete later
            // is Xtra tells insert to flag file for insert into Xtra

            var isXtra = false;

            if(Session.get('addQCUpload')){
              if(Session.get('addQCUpload') == diagID){
                Session.set('addFileURL',downloadUrl);
                var isXtra = true;
              }
            }

               Meteor.call('ainsertSketchFile',uid, diagID, fileName, downloadUrl,isXtra);

            } else {


               Meteor.call('einsertSketchFile',uid, diagID, fileName, downloadUrl);

            }
               


            
          
        });
      
    
  },

  'click .deleteUpload':function(event) {
    event.preventDefault();

    var sketchId = this._id;

    if (confirm('Are you sure?')) {

    Meteor.call('deleteSketchFile',sketchId);
      

     
    }
  }



  });

var uploader = new Slingshot.Upload("sketchUploads");

  Template.a_fileList.onCreated(function() {

         var self = this;

         self.autorun(function () {

        

         });

    
     
  });




  Template.a_fileList.helpers({

    progress: function () {

    var prog = Math.round(uploader.progress() * 100);

    if(prog > 1 && prog < 99){

        return true;
    }
  

  },

  theFiles: function () {


      var uId = Meteor.userId();
      var dateToday = moment().format("MM-DD-YYYY");
      
      var diagID = this.id;

      return Sketches.find({ $and: [{'qcId': uId}, {'diagramId': diagID}, {'date': dateToday }]}).fetch();

     
  }


    
  });



  Template.a_fileList.events({

    'click .fileUp': function(event, template) {

      //Id of this button
      var clickId = event.currentTarget.id;

      //user
      var uid = Meteor.userId();
     
      //diagram id
      var diagID = this.id;
     

      var files = template.$('#'+diagID+'files')[0].files;
      var fileName = fileName = files.item(0).name;


   
        uploader.send(files[0], function (error, downloadUrl) {
          if (error) {
            // Log service detailed response
            console.error('Error uploading', uploader.xhr.response);
            alert (error);
          } else {
          

            

            } 

            // URL received, file is up
            //console.log('success:', downloadUrl);
            
            //check if extra file is being uploaded to delete later
            // is Xtra tells insert to flag file for insert into esketch instead of qsketch

            var isXtra = false;

            if(Session.get('addQCUpload')){
              if(Session.get('addQCUpload') == diagID){
                Session.set('addFileURL',downloadUrl);
                var isXtra = true;
              }
            }
           Meteor.call('ainsertSketchFile',uid, diagID, fileName, downloadUrl, isXtra);


            
          
        });

    return false;
  },

  'click .deleteUpload':function(event) {
    event.preventDefault();

    var sketchId = this._id;

    if (confirm('Are you sure?')) {

    Meteor.call('deleteSketchFile',sketchId);
      

     
    }
  }



  });

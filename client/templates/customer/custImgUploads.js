

  var uploader = new Slingshot.Upload("custImgUploads");
  
  





Template.custImgUploads.helpers({

  progress: function () {

    var prog = Math.round(uploader.progress() * 100);

    if(prog > 1 && prog < 99){

        return true;
    }
  

     //return Session.get('toggle');
  },

  getImages: function () {

      if(Session.get('diagSesh')){

      return tempImgs.find({sessionid: Session.get('diagSesh')});

      }
  }

});

Template.custImgUploads.events({
  

  'submit #imgUp': function(event, template) {
    event.preventDefault();

    
    const files = template.$('#files')[0].files;

    var imgCount = tempImgs.find().count();

    if(imgCount < 5){



        uploader.send(files[0], function (error, downloadUrl) {
          if (error) {
            // Log service detailed response
           
            alert (error);
          }
          else {



            if(Session.get('diagSesh') != null){

                   

                  //session there add image with existing id
                  tempImgs.insert({
                    url: downloadUrl,
                    sessionid: Session.get('diagSesh')
                  });


            } else {

              //create new session id
              Session.set('diagSesh',Random.id());

             

              tempImgs.insert({
              url: downloadUrl,
              sessionid: Session.get('diagSesh')
              });

            }

            // URL received, file is up
            //console.log('success:', downloadUrl);
           

            
          }
        });

    } else {
    // max images reached
    }
  },

  'click .deleteUpload':function(event) {
    event.preventDefault();

   

    if (confirm('Are you sure?')) {
      tempImgs.remove({'_id':this._id});

     
    }
  }
});

Template.custImgUploads.onDestroyed(function () {

   

});

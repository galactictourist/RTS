Template.showFiles.onCreated(function () {


  	var self = this;
    var cust = Meteor.userId();
     console.log(self.data.diagId)

	  self.autorun(function () {



       self.subscribe('sketches');


	});


  
});



Template.showFiles.helpers({

notArchived: function() {

  var diagId = Template.instance().data.diagId;

  query = Orders.findOne({'diagram.id':diagId}, {'archive': 1});
  var rslt = query.archive;

  if(rslt !== 1){

    return true;
  }
  

},

	 

 getFiles: function() {

      var diagID = Template.instance().data.diagId,
          query = Sketches.find({'diagramId': diagID}).fetch(),
          qsKetchArray =[],
          esKetchArray = [],
          qssketchExists = false;

        _.each(query, function(sketch){

          if(sketch && sketch.qsketchUrl){

                      qsKetchArray.push({
                      name : sketch && sketch.qsketchName,
                      url : sketch && sketch.qsketchUrl
                      });
            qssketchExists = true;
          } else {
                      esKetchArray.push({
                      name : sketch && sketch.esketchName,
                      url : sketch && sketch.esketchUrl
                      });

            if(sketch && sketch.XtrasketchUrl){

                      esKetchArray.push({
                      name : sketch && sketch.XtrasketchName,
                      url : sketch && sketch.XtrasketchUrl
                      });
            }
                      
          }
        });
        console.log(esKetchArray)

        c_esKetchArray = esKetchArray.filter(Boolean);
        c_qsKetchArray = qsKetchArray.filter(Boolean);
       

        
        
                                   

        return qssketchExists ? c_qsKetchArray : c_esKetchArray ;
     


    },


    formatTime: function(key){

    return moment(key).format('MM-DD-YYYY, h:mm a');

  }

});

Template.showFiles.events({

'click #btnFeedback':function(event, template){
    console.log(this)
    var diagID = Template.instance().data.diagId;
    Blaze.renderWithData(Template.feedbackModal, {
      id: diagID
    }, document.body);

  }

});


Template.feedbackModal.onCreated(function() {
  var tmpl = this;

});

Template.feedbackModal.onRendered(function() {
  var tmpl = this;
  $('#feedback_modal').modal('show');

  tmpl.autorun(function() {
    
  });
});

Template.feedbackModal.helpers({
  diagInfo: function() {
    return Template.instance().data && Template.instance().data.id;
  }
});

Template.feedbackModal.events({

  'hidden.bs.modal #feedback_modal': function(event, template) {
    Blaze.remove(template.view);
  },
  'click #sendFeedback': function(event, template) {

    var cat = document.getElementById("fb_category").value;
    var msg = document.getElementById("fb_comment").value;
    var diagId = Template.instance().data.id;

    if(cat === ''){
      alert("Please select a category.");
    } else if (msg === ''){
       alert("Please enter a comment.");

    } else {

      Meteor.call('custFeedbackSubmit',cat, diagId, msg);
      
      document.getElementById("fb_category").value = '';
      document.getElementById("fb_comment").value = '';

      alert("Feedback sent. Thank you!");

    }
    
   
      
  }
});




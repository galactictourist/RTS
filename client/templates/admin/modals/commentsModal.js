
Template.commentsModal.onCreated(function() {
  var tmpl = this;

});

Template.commentsModal.onRendered(function() {
  var tmpl = this;
  $('#comments_modal').modal('show');

  tmpl.autorun(function() {
    
  });
});

Template.commentsModal.helpers({
  getComment: function() {
    return Template.instance().data && Template.instance().data.com;
  }
});

Template.commentsModal.events({

  'hidden.bs.modal #comments_modal': function(event, template) {
    Blaze.remove(template.view);
  }
});




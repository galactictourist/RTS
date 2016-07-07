Template.homePage.onCreated(function () {
  /* Mongo subscriptions go here, before the DOM is rendered.
   * Make sure to do template-based subscriptions, instead of global
   * Meteor.subscribe calls. so only subscribe to data within the template
   * that actually needs the data.
   */
  // https://www.discovermeteor.com/blog/template-level-subscriptions/

  // Example below:
  this.subscribe('someSubscription');
});

Template.homePage.onRendered(function () {
  /*
  DOM is ready at this point, this is like $(document).ready() in jQuery
  for the most part.
   */
});

Template.homePage.events({
  'submit #sketch-form': function (event, template) {
    event.preventDefault();
   

    // using template.$() restricts jQuery to search within this template only
    // instead of $() searching the whole DOM
    const $someText = template.$('#some-text');

   

    // http://docs.meteor.com/#/full/meteor_call
    Meteor.call('insertSomethingIntoDB', formData, function (error, result) {
      if (error) {
        // something wrong happened on the server side
      } else {
        // we're good. result contains data, maybe
      }

    });

  }
});


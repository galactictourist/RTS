var mailgunSettings = Meteor.settings.mailgun,
  Future = Npm.require('fibers/future'),
  options = {
    apiKey: mailgunSettings.apiKey,
    domain: mailgunSettings.domain
  };
MailgunEmail = new Mailgun(options);

Meteor.methods({
  'EMAILS/POST/SendEmail': function(options) {
    //options.to = 'galactictourist@gmail.com';
    var mailgunFuture = new Future();
    return  MailgunEmail.send(options, function(error, result){
      if(error){
        mailgunFuture.return(error);
      }else{
        mailgunFuture.return(result);
      }
    });
    return mailgunFuture.wait();
  }
});

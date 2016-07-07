Meteor.startup(function() {

    var publishableKey = Meteor.settings.public.publishableKey;
    Stripe.setPublishableKey(publishableKey);
	var handler = StripeCheckout.configure({
	key:publishableKey,
		token:function(token){}
	});
});


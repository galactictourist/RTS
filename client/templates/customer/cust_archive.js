  


Template.cust_archive.onCreated(function () {


  	var self = this;
    var cust = Meteor.userId();


	  self.autorun(function () {

           
	    
	     self.subscribe('custArchiveOrders', cust);
      
	});





});

Template.cust_archive.onRendered(function () {



  });




Template.cust_archive.helpers({

  showOrdersWithDelivered: function(){


    var order = this.orderId;

    
    var count = Orders.find({"orderId": order, "diagram.status":6}).count();

    

    if(count !== 0){

      return true;

    } else {

      return false;
    }

  },


     upCharge: function() {

      var plan = Session.get('custPlan');

      if(this.facetUpCharge === '0.00'){

        return false;

      } else if (plan === 's27' || plan === 's32'){

        return false;

      } else {

        return true;
      }

    },

  showUpgrade: function() {

  

    if(Session.get('firstOrder') === "0"){

      return false;

    } else {

      return true
    }


  },

    getStatus: function() {

      var code = this.status;

      var show;

      switch (code) {
    case 1:
        show = "New";
        break;
    case 2:
        show = "Assigned";
        break;
    case 3:
        show = "Started";
        break;
    case 4:
        show = "Sent to QC";
        break;
    case 5:
        show = "QC Started";
        break;
    case 6:
        show = "Delivered";
        break;
    case 7:
        show = "Started";
        break;

    }

    return show;


    },



    onDelivered: function() {

      if(this.status === 6){

        return true;
      }
        else {

          return false;
        }


    },




	 getOrders: function() {

      var orderDiagrams = Orders.find({'archive': 1},{sort: {orderDate: -1}}).fetch();

      

      return orderDiagrams;

	},

  formatTime: function(key){

    return moment(key).format('MM-DD-YYYY, h:mm a');

  },


  newOrderCount: function(){


    var newCount = Orders.find({ "diagram.status":6}).count();


    if(newCount !== 0){

      return newCount
    } else {

      return false;
    }

  },

  filesDivShow: function() {


        if(this.id === Session.get('filesDivId')){
          return "show";
        }
      }

});

Template.cust_archive.events({


  'click #btnShowFiles':function(event, template){

    diagID = this.id;

     Session.set('filesDivId', diagID);

    return false;
  }

  });

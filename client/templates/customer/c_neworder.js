Template.new_order.onCreated(function () {


     var self = this;

     self.autorun(function () {



         self.subscribe('stripeAccounts');

     });


  if(Session.get('total')){

  } else {
    getStartTotal();

  }



  Session.setDefault('grandTotal', '');
  Session.setDefault('emptyOrder', true);
  Session.setDefault('anotherDiagram' , false);
  Session.setDefault('newOrderId', '');// initialize order id for insert


});

Template.new_order.onRendered(function () {

$('#address').focus();

  setDefaultFacets();

  if(Session.get('total')){

  } else {
    getStartTotal();

  }


});

setDefaultFacets = function(){

  console.log('set facets function');

  var e = document.getElementById("facets");
  var selected = e.options[e.selectedIndex].value;
  Session.set('facets', selected);

}

function round(number, decimals){
    return parseFloat(number.toFixed(decimals));
}

function getStartTotal(){

  var startTCall = Meteor.users.findOne({'_id': Meteor.userId()}, {fields: {'profile.startTotal': 1,'_id': 0}});
  var sTotal = startTCall && startTCall.profile.startTotal;

  Session.set('total', sTotal);



}


Template.new_order.helpers({  //-------------------------------------------- Helpers

  mapMessage: function() {

    return (Session.get('mapMessage'));

  },


  diagramData: function () {

    var tmpO = tempOrder.find({orderId: Session.get('newOrderId')});
    return tmpO;
  },

  myFormData: function() {


    //return { directoryName: 'images', prefix: this._id, id: this._id };
    return {diagramId: 'test'}


  },

  filesToUpload: function() {
    return Uploader.info.get();
  },

  getDiscountMsg: function() {



    var plan = Session.get('custPlan');

    if(plan){
      if(plan !== "0"){

        var msg = "Discount plan applied.";

        return msg;
      }
    }

  },



  lat: function () {

    var alat = Session.get("mapLat");


    var latResult = "Latitude: " + alat;
    return latResult;
  },

  long: function () {


    var along = Session.get("mapLon");


    var longResult = "Longitude: " + along;
    return longResult;
  },



  total: function () {


    return Session.get('total');
  },

  grand_total: function () {




    return Session.get('grandTotal');
  }

});

//---------------------------------------------------------------------------[E V E N T S]-----------------

Template.new_order.events({

  'click #delTempDiag': function(event, template){

      event.preventDefault();

      diagId = this.id;
      oid = Session.get('newOrderId');
      price = this.price;

      var newTotal1 = parseFloat(Session.get('grandTotal') - price);
      var newTotal2 = round(newTotal1,2);

      Session.set('grandTotal', newTotal2);

      tempOrder.update({}, { "$pull": { "diagram": { "id": diagId} } });
      tempOrder.update({'orderId': oid},{$set: {'total': newTotal2}});
      tempOrder.update({'orderId': oid},{$inc: { 'diagNum': -1, 'qcNum': -1 }});


  },

  //update session total based on order eta selection

  'click #rushradio': function(event, template){



      $( "#speedradio" ).prop( "checked", false );

      var newTotal = round(parseFloat(Session.get('total')) + 20.00,2);

      Session.set('total', newTotal);



  },
  //update session total based on order eta selection

  'click #speedradio': function(event, template){



      $( "#rushradio" ).prop( "checked", false );

      var newTotal = round(parseFloat(Session.get('total')) - 20.00,2);
      Session.set('total', newTotal);




  },

  //update session total based on report type selection

   'click #PDFradio': function(event, template){



      $( "#ESXradio" ).prop( "checked", false );

      var newTotal = round(parseFloat(Session.get('total')) + 5.00,2);
      Session.set('total', newTotal);




  },
  //update session total based on report type selection

  'click #ESXradio': function(event, template){



      $( "#PDFradio" ).prop( "checked", false );

      var newTotal = round(parseFloat(Session.get('total')) - 5.00,2);
      Session.set('total', newTotal);




  },

  'change #facets': function (e, template) {

    e.preventDefault();

    var e = document.getElementById("facets");
    var selected = e.options[e.selectedIndex].value;

    var curFacetAmt = parseFloat(Session.get('facets'));

    varPreNewTotal = parseFloat(Session.get('total')) - curFacetAmt;

    varFinNewTotal = round(parseFloat(varPreNewTotal) + parseFloat(selected),2);

    Session.set('facets', selected);
    Session.set('total', varFinNewTotal);


    },

    //-----------------------------------------------------------------------------------add diagrams to order

    'click #addOrder': function(evt){

    evt.preventDefault();

       if(Session.get('anotherDiagram') != true) { // ----------------------------------------if this is a --[NEW]-- order insert

         Session.set('orderPaid',false);

            var eta;
            var reportType;

            var dLat = Session.get('mapLat');//from map template

            var dLong = Session.get('mapLon');

            var address = document.getElementById("address").value;

            var finalAddress = Session.get('this_address');

            var comments = document.getElementById("diag_comment").value;

            if(document.getElementById("speedradio").checked){ //get eta radio
                eta = "24";
            }else{
                eta = "6";

            }

             if(document.getElementById("ESXradio").checked){ //get report type radio
                reportType = "ESX";
            }else{
                reportType = "ESX-PDF";
            }

            var insName = document.getElementById("i_name").value;


             var f = document.getElementById("xvers");
             var fselect = f.options[f.selectedIndex].value;

            var xmateVer = fselect;



            var facetNum = document.getElementById("facets").value;

            switch (facetNum){

              case "0":

                var facetNumClean = "0-20";
                var facetNum = 20;
                break;

              case "5.00":

                var facetNumClean = "21-40";
                 var facetNum = 40;
                break;

              case "10.00":

                var facetNumClean = "41-60";
                 var facetNum = 60;
                break;

              case "15.00":

                var facetNumClean = "61+";
                break;

            }


            var bldgType = document.getElementById("bldg_type").value;

            var pitch = document.getElementById("pitch").value;


            var dTotal = Session.get('total');
            //form validation
            if(isNotEmpty(eta) &&
              isNotEmpty(reportType) &&
               isNotEmpty(dLat) &&
                isNotEmpty(dLong) &&
               isNotEmpty(address) &&
                isNotEmpty(xmateVer) &&
                 isNotEmpty(facetNum) &&
                  isNotEmpty(bldgType) &&
                   isNotEmpty(pitch) &&
                    isNotEmpty(dTotal)) { //validation passed


              var new_id = Random.id(7).toUpperCase();

              Session.set('newOrderId', new_id ); //set new order id first time


            var diagImgs = [];

            if(Session.get('diagSesh')){//----------------------------get image urls from tmp table


                  var sesh = Session.get('diagSesh');
                  var imgList = tempImgs.find({'sessionid': sesh},{fields:{'url': 1, '_id':0}}).fetch();
                  var url;

                  for (url in imgList){
                    if(imgList.hasOwnProperty(url)){

                          var obj = imgList[url];

                          for(var prop in obj){
                            if (obj.hasOwnProperty(prop)){

                              var subObj = obj[prop];
                              diagImgs.push(subObj);

                            }
                           }

                    }
                  }


                } else {}





            var thisOrderId = Session.get('newOrderId');

            var diag_id = Random.id(9).toUpperCase();
            Session.set('thisDiagId', diag_id);

            var firstName = (function() {
              return Meteor.user().profile.firstName;
            })();

            var lastName = (function() {
              return Meteor.user().profile.lastName;
            })();

            var fullName = firstName + ' ' + lastName;

            var email = Meteor.user().emails[0].address;

            var phone = Meteor.user().profile.phone;

            var d = new Date();



            var newStuff = {
              "orderId": thisOrderId,
              "archive": 0,
              "eta": 24,
              "custId": Meteor.userId(),
              "custName": fullName,
              "total": dTotal,
              "diagram":[

                  {
                    "client": fullName,
                    "clientemail": email,
                    "clientphone": phone,
                    "price": dTotal,
                    "address": finalAddress,
                    "insName": insName,
                    "pitch": pitch,
                    "lat": dLat,
                    "lon": dLong,
                    "xmateversion": xmateVer,
                    "facets": facetNumClean,
                    "facetCount": facetNum,
                    "structure": bldgType,
                    "reporttype": reportType,
                    "expedite": eta,
                    "imgurls": diagImgs,
                    "id": diag_id,
                    "stage": ['New', d, 'Customer'],
                    "status": 1,
                    "level": '0',
                    "oid": thisOrderId,
                    "odate": d,
                    "facetUpCharge": '0.00',
                    "comments": comments


                  }


                ]


            };//end new stuff

              tempOrder.insert(newStuff, { validate: false

                }, function(err){
                if(err){

                 sAlert.error('Error' + err, {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});

               } else {

                //Clear Form
              Session.set('emptyOrder', false);//no checkout unless diagram in the cart
              Session.set('mapMessage', null);
              Session.set('mapLat', null);
              Session.set('mapLon', null);
              Session.set('facets', '0');
              Session.set('diagSesh', null);

              document.getElementById("address").value = "";
              document.getElementById("speedradio").checked = true;
              document.getElementById("rushradio").checked = false;
              document.getElementById("ESXradio").checked = true;
              document.getElementById("PDFradio").checked = false;
              document.getElementById("i_name").value = "";
              document.getElementById("xvers").value = "";
              document.getElementById("facets").value = "0";
              Session.set('facets', '0');
              document.getElementById("bldg_type").value = "";
              document.getElementById("pitch").value = "";
              document.getElementById("diag_comment").value = "";
              Session.set('this_address',null);
              Session.set('anotherDiagram', true);

               var newTotal = Session.get('total');
                Session.set('grandTotal', newTotal);
                 getStartTotal();

          //add 1 to diagram number on this order to start count - add 1 to qcnum to start count
                 tempOrder.update({ orderId: thisOrderId },{$set: {diagNum: 1, qcNum: 1}},{ validate: false});



              sAlert.success('Diagram added', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});


                }//end else success


                });// end insert
              }// end if form validation


              }//end if to check if new order --- -----------------------------------------create update to add another diagram
            else{



            var eta;
            var reportType;

            var dLat = Session.get('mapLat');//from map template

            var dLong = Session.get('mapLon');

            var address = document.getElementById("address").value;

            if(document.getElementById("speedradio").checked){ //get eta radio
                eta = "24";
            }else{
                eta = "6";

            }

             if(document.getElementById("ESXradio").checked){ //get report type radio
                reportType = "ESX";
            }else{
                reportType = "ESX-PDF";
            }

            var insName = document.getElementById("i_name").value;


             var f = document.getElementById("xvers");
             var fselect = f.options[f.selectedIndex].value;

            var xmateVer = fselect;

            var finalAddress = Session.get('this_address');

            var comments = document.getElementById("diag_comment").value;



            var facetNum = document.getElementById("facets").value;

            switch (facetNum){

              case "0":

                var facetNumClean = "0-20";
                var facetNum = 20;
                break;

              case "5.00":

                var facetNumClean = "21-40";
                 var facetNum = 40;
                break;

              case "10.00":

                var facetNumClean = "41-60";
                 var facetNum = 60;
                break;

              case "15.00":

                var facetNumClean = "61+";
                break;

            }


            var bldgType = document.getElementById("bldg_type").value;

            var pitch = document.getElementById("pitch").value;


            var dTotal = Session.get('total');


                            //form validation
            if(isNotEmpty(eta) &&
              isNotEmpty(reportType) &&
               isNotEmpty(dLat) &&
                isNotEmpty(dLong) &&
               isNotEmpty(address) &&
                isNotEmpty(xmateVer) &&
                 isNotEmpty(facetNum) &&
                  isNotEmpty(bldgType) &&
                   isNotEmpty(pitch) &&
                    isNotEmpty(dTotal)) {


              var existingOrderId = Session.get('newOrderId');
              var diag_id = Random.id(9).toUpperCase();

              var diagImgs = [];

            if(Session.get('diagSesh')){//----------------------------get image urls from tmp table


                  var sesh = Session.get('diagSesh');
                  var imgList = tempImgs.find({'sessionid': sesh},{fields:{'url': 1, '_id':0}}).fetch();
                  var url;

                  for (url in imgList){
                    if(imgList.hasOwnProperty(url)){

                          var obj = imgList[url];

                          for(var prop in obj){
                            if (obj.hasOwnProperty(prop)){

                              var subObj = obj[prop];
                              diagImgs.push(subObj);

                            }
                           }

                    }
                  }


                } else {}



            var firstName = (function() {
              return Meteor.user().profile.firstName;
            })();

            var lastName = (function() {
              return Meteor.user().profile.lastName;
            })();

            var fullName = firstName + ' ' + lastName;

            var email = Meteor.user().emails[0].address;

            var phone = Meteor.user().profile.phone;

            var d = new Date();







              var newTotal1 = parseFloat(Session.get('total')) + parseFloat(Session.get('grandTotal'));
              var newTotal2 = round(newTotal1,2);
              Session.set('grandTotal', newTotal2);

               var newDiag = {

                      "client": fullName,
                      "clientemail": email,
                      "clientphone": phone,
                       "price": dTotal,
                       "address": finalAddress,
                        "insName": insName,
                        "pitch": pitch,
                        "lat": dLat,
                        "lon": dLong,
                        "xmateversion": xmateVer,
                        "facets": facetNumClean,
                        "facetCount": facetNum,
                        "structure": bldgType,
                        "reporttype": reportType,
                        "expedite": eta,
                        "imgurls": diagImgs,
                        "id": diag_id,
                        "stage": ['New', d, 'Customer'],
                        "status": 1,
                        "level": '0',
                        "oid": existingOrderId,
                        "odate": d,
                        "facetUpCharge": '0.00',
                        "comments": comments

                            };//end new diag

                            var output = '';
                            for (var property in newDiag) {
                            output += property + ': ' + newDiag[property]+'; ';
                              }


              tempOrder.update({ orderId: existingOrderId },{ $push: { diagram: newDiag }},{ validate: false

                }, function(err){
                if(err){

                 sAlert.error('Error' + err, {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});

               } else {

                //Clear Form
              Session.set('mapMessage', null);
              Session.set('uploadedImages', null);
              Session.set('mapLat', null);
              Session.set('mapLon', null);
              Session.set('facets', '0');
              Session.set('diagSesh', null);

              document.getElementById("address").value = "";
              document.getElementById("speedradio").checked = true;
              document.getElementById("rushradio").checked = false;
              document.getElementById("ESXradio").checked = true;
              document.getElementById("PDFradio").checked = false;
              document.getElementById("i_name").value = "";
              document.getElementById("xvers").value = "";
              document.getElementById("facets").value = "0";
              Session.set('facets', '0');
              document.getElementById("bldg_type").value = "";
              document.getElementById("pitch").value = "";
              document.getElementById("diag_comment").value = "";
              Session.set('this_address',null);



              getStartTotal();

              sAlert.success('Diagram added', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});


                }//end else success


                });

                //add 1 to diagram number on this order to start count same for qcnum
                 tempOrder.update({ orderId: existingOrderId },{$inc: {diagNum: 1, qcNum: 1}},{ validate: false});

                //update total
                    tempOrder.update({ orderId: existingOrderId },{$set: {total: Session.get('grandTotal')}},{ validate: false

                      }, function(err){
                      if(err){

                       sAlert.error('Update Total Error' + err, {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});

                     } else {}
                   });

                  }//end form validation
              }//end else new order or update




      },

      'click #place-order': function(evt){ // ------------------------------------------------------------PLACE ORDER

        evt.preventDefault();

        if(Session.get('emptyOrder')){

          sAlert.error('Please add at least 1 diagram to proceed', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});

          return;


        }

         var orderTotal = Session.get('grandTotal');
         var orderId = Session.get('newOrderId');


         //check for allcat plan if true then we do not charge this order. the order is sent and billed later by invoice from admin
         if(Session.get('custPlan') === 'allCat'){

          processOrder();

          sAlert.success('Order placed successfully', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});


         } else {

        //for stripe use orderTotal for amount--------
         Blaze.renderWithData(Template.orderPlaceModal, {
             orderTotal: orderTotal,
            orderId :orderId
         }, document.body);

       }// end if allcat
      }// end of place order

  });  //end of events



//Validation

//Trim Helper
var trimInput = function(val){
  return val.replace(/^\s*|\s*$/g, "");
}

//Check for empty fields
isNotEmpty = function(value) {
  if (value && value !== ''){
    return true;
  }

  sAlert.error('Please fill in all fields', {effect: 'slide', position: 'top-right', timeout: '3000', onRouteClose: false, stack: false, offset: '100px'});
  return false;
};

Template.new_order.onDestroyed(function () {


  tempOrder.remove({});
  tempImgs.remove({});


});

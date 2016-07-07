Template.registerHelper("showUpgrade", function(argument) {
  var firstO = Session.get('firstOrder');
  var custP = Session.get('custPlan');

  console.log(firstO);
  console.log(custP);

  if ((firstO === "1" && custP === "0")) {


    return true;

  } else {

    return false;
  }
});
Tracker.autorun(function () {
  OrdersIndex.search('LN7WEKF', { limit: 20 }).fetch();
  
});

Template.ordersSearch.helpers({
    getSketches: function () {
      var diagID = this.id;
      query = Sketches.find({'diagramId': diagID}).fetch();
    },
    inputAttributes: function () {
      return { 'class': 'easy-search-input', 'placeholder': 'Start searching...' };
    },
    orders: function () {
      return Orders.find({});
    },
    
    index: function () {
      return OrdersIndex;
    },
    resultsCount: function () {
      return OrdersIndex.getComponentDict().get('count');
    },
    showMore: function () {
      return false;
    },
    renderTmpl: () => Template.renderTemplate
  });

  Template.ordersSearch.events({
    
  });

  Template.order.helpers({

  	momentTime: function(key) {

        var oDate = moment(key).format('MM-DD-YY, h:mm a');

        return oDate;
      }


  });
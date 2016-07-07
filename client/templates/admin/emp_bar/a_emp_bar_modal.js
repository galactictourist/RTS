Template.a_emp_bar_modal.onCreated(function() {

	
  	var self = this;

  	  	self.autorun(function () {

  	  

  	});

});


Template.a_emp_bar_modal.helpers({

   empDiagram: function() {

          var emp = Session.get('modalEmp'); 

          var queryUserDiagrams = Orders.find({ $and: [{'diagram.sketcher': emp}, {'diagram.status':{$lt:7} }]}).fetch(),
      
      
           onlyDiagrams = [];
          _.each(queryUserDiagrams, function(single){
              _.each(single.diagram,function(diagram){
                    if(_.isEqual(diagram.sketcher, emp)){
                      onlyDiagrams.push(diagram);
                       }
              })
          });

          return onlyDiagrams;
    },
 

    borderColorStatus: function() {

            if(this.expedite[0] == '6'){
              return Spacebars.SafeString('red;');
            } else {
              return Spacebars.SafeString('#3071a9;');
            }
      },


    diagStatus: function() {

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


    modalEmpName: function(){

      return Session.get('modalEmpName');


    },

    momentDuration: function() {

       

        if(this.expedite === '6'){

          var hoursToAdd = 6;
        } else {

          var hoursToAdd = 24;
        }

        
        

        var oDate = moment(this.odate);
       
          function pad(num) {
            var str = '' + num;
            return str.length < 2 ? '0' + str : str;
          }

          
         
          var dueDate = oDate.add(hoursToAdd, 'hours');

          var now = moment();

          if (dueDate.isBefore(now))
           { return 'overdue' }
         

          var hours = dueDate.diff(now, 'hours');
          var minutes = dueDate.diff(now, 'minutes') - hours * 60;

          var time = [];
          if (hours > 0) time.push(hours + 'h');
          if (minutes > 0 || time.length > 0) time.push(pad(minutes) + 'm');


          var dueIn = 'Due in ' + _.compact(time).join(' ');

          return dueIn;

         

      }



});
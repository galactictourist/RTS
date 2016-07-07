Router.configure({
  layoutTemplate: "home_layout" //public site layout
});

Router.configure({
  layoutTemplate: "admin_layout" //admin layout
});


Router.configure({
  layoutTemplate: "c_layout" //customer dash layout
});


Router.configure({
  layoutTemplate: "emp_layout" //employee dash layout
});

Router.configure({
  layoutTemplate: "layout_auth" //layout for signin and register
});


loginRedirect = function() {
 

  let user = Meteor.user();
  if (user && user.profile && _.isEqual(user.profile.role, 'admin')) {
    Router.go('/admin')
  } else if (user && user.profile && _.isEqual(user.profile.role, 'customer')) {
    Router.go('/c-home')
  } else if (user && user.profile && _.isEqual(user.profile.role, 'employee1' || user.profile.role, 'employee2' )) {
      
    Router.go('/emp-home')
  } else {
    Router.go('/signin');
  }
  user && Meteor.call('loginUpdateWorkStatus', user._id);
  this.next();
}

//Simple Routes Config.

Router.route('/', {
  layoutTemplate: 'home_layout', //public homepage
  name: 'home'
});

Router.route('/admin', {
        layoutTemplate: 'admin_layout',//admin route
        name: 'a-home',
        template: 'admin_home',
        onBeforeAction: function () {
              if (!Meteor.userId()) {
              console.log("not logged-in");
              Router.go('/signin');
              } else {
                Meteor.call('loginUpdateWorkStatus',Meteor.userId());
              }
             
              this.next();
          }
      });

// Router.route('/admin', {
//   layoutTemplate: 'admin_layout', //admin route
//   name: 'a-home',
//   template: 'admin_home',
//   onBeforeAction: loginRedirect
// });


Router.route('/emp-home', {
        layoutTemplate: 'emp_layout',//customer dashboard home
        name: 'emp-home',
        template: 'emp_home',
        onBeforeAction: function () {
              if (!Meteor.userId()) {
              console.log("not logged-in");
              Router.go('/signin');
              } else {
                Meteor.call('empLoginUpdateWorkStatus',Meteor.userId());
                
              }

              this.next();
            }
      });

// Router.route('/emp-home', {

//   layoutTemplate: 'emp_layout', //customer dashboard home
//    name: 'emp-home',
//   template: 'emp_home',
//   onBeforeAction: loginRedirect
// });

 Router.route('/c-home', {
        layoutTemplate: 'c_layout',//customer dashboard home
        name: 'c-home',
        template: 'c_home',
        onBeforeAction: function () {


              if (!Meteor.userId()) {
              console.log("not logged-in");
              Router.go('/signin');
              } else {

                console.log('chome router');

              }
                this.next();
              
            }
    });



// Router.route('/c-home', {
//   layoutTemplate: 'c_layout', //customer dashboard home
//   //name: 'c-home',
//   template: 'c_home',
//   onBeforeAction: loginRedirect
// });



Router.route('/signin', {
  'name': 'login',
  'template': 'signin',
  layoutTemplate: 'layout_auth'
});

Router.route('/register', {
  'name': 'register',
  'template': 'register',
  layoutTemplate: 'layout_auth'
});



Router.route('/signout', function() {

}, {
  name: 'signout',
  onBeforeAction: function() {

    Meteor.call('afterLogout', Meteor.userId());

    Meteor.logout();

    Object.keys(Session.keys).forEach(function(key) {
      Session.set(key, undefined);
    });
    console.log('here router 2');

    this.next();
  },
  onAfterAction: function() {
    Session.set('hereFirst', true);
    Router.go('/signin');
  }
});

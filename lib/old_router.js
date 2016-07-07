/*FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('home_layout', {main: 'homePage'});
  }
});

FlowRouter.route('/register', {
  name: 'register',
  action() {
    BlazeLayout.render('layout_auth', {auth_main: 'register'});
  }
});

FlowRouter.route('/signin', {
 name: 'signin',
 action() {
    BlazeLayout.render('layout_auth', {auth_main: 'signin'});
  }
});

FlowRouter.route('/signout', {
 name: 'signout',
 action() {
    Meteor.logout(function(err){
      if(!err){
        FlowRouter.go('/signin');
      }
    })
  }
});

FlowRouter.route('/c-dashboard', {
 name: 'c-dashboard',
 action() {
    
      BlazeLayout.render('c_layout', {c_content: 'new_order'});//show this 4 first time customer 
     
      }
   
});



const adminRoutes = FlowRouter.group({
  prefix: '/admin',
  name: 'admin',
  triggersEnter: [(context, redirect) => {
    if (Meteor.userId()) { // and probably make sure they're some sort of admin
      if (Roles.userIsInRole(Meteor.userId(), 'qc-manager')) {
        this.adminLayout = 'qc_admin_layout';
      } else {
        this.adminLayout = 'admin_layout';
      }
    } else {
      redirect('/');
    }
  }]
});

adminRoutes.route('/', {
  name: 'adminHome',
  action: () => {
    BlazeLayout.render(this.adminLayout, {content: 'admin_home'});
  }
});

adminRoutes.route('/users', {
  name: 'adminUsers',
  action() {
    BlazeLayout.render('admin_layout', {content: 'admin_users'});
  }
});
*/
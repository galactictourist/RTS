Meteor.users.allow({
  update:function(userId, doc){
    var query = Meteor.users.findOne(userId);
    return query && _.isEqual(query.profile.role, 'admin');
  }
});

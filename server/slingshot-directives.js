Slingshot.createDirective("custImgUploads", Slingshot.S3Storage, {
  bucket: "rts-bucket",
  region: 'us-west-2',

  authorize: function () {
    //Deny uploads if user is not logged in.
    // if (!this.userId) {
    //   var message = "Please login before posting files";
    //   throw new Meteor.Error("Login Required", message);
    // }

    return true;
  },

  key: function (file) {
    //Store file into a directory by the user's username.
    // var user = Meteor.users.findOne(this.userId);
    // return user.username + "/" + file.name;
    return file.name;
  }
});

Slingshot.createDirective("sketchUploads", Slingshot.S3Storage, {
  bucket: "rts-bucket",
  region: 'us-west-2',

  authorize: function () {
    //Deny uploads if user is not logged in.
    // if (!this.userId) {
    //   var message = "Please login before posting files";
    //   throw new Meteor.Error("Login Required", message);
    // }

    return true;
  },

  key: function (file) {
    //Store file into a directory by the user's username.
    // var user = Meteor.users.findOne(this.userId);
    // return user.username + "/" + file.name;
    return "sketch/" + file.name;
  }
});
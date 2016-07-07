
Today = new Meteor.Collection('today');

TodaySchema = new SimpleSchema({


	"user":{

		type: String,
		label: "Emp ID",
		optional: true
	},

	"userName":{

		type: String,
		label: "Emp Name",
		optional: true
	},

	"diagsSent":{

		type: Number,
		label: "Number of Diags Sent",
		optional: true
	},

	"diagsRequested":{

		type: Number,
		label: "Diags Requested",
		optional: true
	},

	"date":{

		type: String, //using string here for sketchrequest method to compare moment simple date string
		label: "Date",
		optional: true
	}

});

Today.attachSchema(TodaySchema);
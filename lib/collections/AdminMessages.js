
AdminMessages = new Meteor.Collection('adminMessages');

AdminMessagesSchema = new SimpleSchema({


	"to":{

		type: String,
		label: "To",
		optional: true
	},

	"from":{

		type: String,
		label: "From",
		optional: true
	},

	"message":{

		type: String,
		label: "Message",
		optional: true
	},

	"dateSent":{

		type: Date,
		label: "Date Sent",
		optional: true
	},

	"dateRead":{

		type: Date, 
		label: "Date",
		optional: true
	}

});

AdminMessages.attachSchema(AdminMessagesSchema);
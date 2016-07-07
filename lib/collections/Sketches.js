Sketches = new Meteor.Collection('sketches');

SketchSchema = new SimpleSchema({


	"diagramId":{

		type: String,
		label: "Diagram ID",
		optional: true
	},

	"sketcherId":{

		type: String,
		label: "Emp ID",
		optional: true
	},

	"qcId":{

		type: String,
		label: "QC ID",
		optional: true
	},

	"esketchName":{

		type: String,
		label: "Sketch Filename",
		optional: true
	},


	"esketchUrl":{

		type: String,
		label: "Sketch URL",
		optional: true
	},

	"qsketchName":{

		type: String,
		label: "Sketch Filename",
		optional: true
	},


	"qsketchUrl":{

		type: String,
		label: "Sketch URL",
		optional: true
	},
	
	"XtrasketchName":{

		type: String,
		label: "QC Extra Sketch Filename",
		optional: true
	},


	"XtrasketchUrl":{

		type: String,
		label: "QC Extra Sketch URL",
		optional: true
	},

	"qsketchComment":{

		type: String,
		label: "QC Comments",
		optional: true
	},


	"date":{

		type: String, //using string here for sketchrequest method to compare moment simple date string
		label: "Date",
		optional: true
	}

});

Sketches.attachSchema(SketchSchema);
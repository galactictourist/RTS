
Orders = new Meteor.Collection('orders');

OrdersSchema = new SimpleSchema({

	"orderId": {

		type: String,
		label: "Order ID",
		optional: true	
	},

	"archive": {

		type: Number,
		label: "Archive",
		optional: true	
	},
	
	"eta": {

		type: Number,
		label: "ETA",
		optional: true	
	},


	"diagNum": {

		type: Number,
		label: "Number of Diagrams", //increment on insert, decrement on assign to change to inprog status
		optional: true
	},

	"qcNum": {

		type: Number,
		label: "Number of Diagrams", //increment on diagram deliver to know when status can change to 3 delivered
		optional: true
	},

	"status": {

		type: Number,
		label: "Status", //1new, 2inprog, 3delivered 4accepted
		optional: true
	},

	"custId": {

		type: String,
		label: "Customer ID",
		optional: true	
	},


	"custName": {

		type: String,
		label: "Customer Name",
		optional: true	
	},

	"total": {

		type: String,
		label: "Total",
		optional: true
	},


	"orderDate": {

		type: Date,
		label: "Order Date",
		optional: true
	},

	"diagram.$.client":{

		type: String,
		label: "Client Name",
		optional: true
	},

	"diagram.$.clientemail":{

		type: String,
		label: "Client Email",
		optional: true
	},

	"diagram.$.clientphone":{

		type: String,
		label: "Client Phone",
		optional: true
	},

	"diagram.$.price":{

		type: String,
		label: "Price",
		optional: true
	},

	"diagram.$.address":{

		type: String,
		label: "Address",
		optional: true
	},

	"diagram.$.insName":{

		type: String,
		label: "Insured Name",
		optional: true
	},

	"diagram.$.pitch":{

		type: String,
		label: "Pitch",
		optional: true
	},

	"diagram.$.lat":{

		type: String,
		label: "Latitude",
		optional: true
	},

	"diagram.$.lon":{

		type: String,
		label: "Longitude",
		optional: true
	},

	"diagram.$.xmateversion":{

		type: String,
		label: "Xactimate Version",
		optional: true
	},

	"diagram.$.facets":{

		type: String,
		label: "Facets",
		optional: true
	},

	"diagram.$.EmpOnefacets":{

		type: String,
		label: "Facets",
		optional: true
	},

	"diagram.$.facetCount":{// for calculating facet upcharges

		type: Number,
		label: "Facet Count",
		optional: true
	},

	"diagram.$.facetUpCharge":{

		type: String,
		label: "Facet Up Charge",
		optional: true

	},
	"diagram.$.qcFacets":{

		type: String,
		label: "QC Counted Facets",
		optional: true

	},

	"diagram.$.structure":{

		type: String,
		label: "Structure Type",
		optional: true
	},

	"diagram.$.reporttype":{

		type: String,
		label: "Report Type",
		optional: true
	},

	"diagram.$.imgurls":{

		type: [String],
		label: "Image URL",
		optional: true
	},

	"diagram.$.sketcher":{

		type: String,
		label: "Sketcher",
		optional: true
	},

	"diagram.$.sketcherName":{

		type: String,
		label: "Sketcher Name",
		optional: true
	},

	"diagram.$.stage":{

		type: [String],
		label: "Stage",
		optional: true
	},

	"diagram.$.status":{

		type: Number,
		label: "Status",
		optional: true
	},



	"diagram.$.level":{

		type: String,
		label: "Level", //1,2
		optional: true
	},

	"diagram.$.qc":{

		type: String,
		label: "QC",
		optional: true
	},


	"diagram.$.expedite":{

		type: String,
		label: "Expedite",
		optional: true
	},


	"diagram.$.feedbacktext":{

		type: String,
		label: "Feedback",
		optional: true
	},

	"diagram.$.feedbackread":{

		type: Number,
		label: "Feedback Read",
		optional: true
	},


	"diagram.$.feedbackCat":{

		type: String,
		label: "Feedback Category",
		optional: true
	},

	"diagram.$.feedbackdate":{

		type: Date,
		label: "Feedback Date",
		optional: true
	},

	"diagram.$.id":{

		type: String,
		label: "Diagram ID",
		optional: true

	},

	"diagram.$.odate":{

		type: Date,
		label: "Order Date",
		optional: true

	},

	"diagram.$.deliveredDate":{

		type: Date,
		label: "Delivered Date",
		optional: true

	},

	"diagram.$.oid":{

		type: String,
		label: "Order ID",
		optional: true

	},
	
	"diagram.$.comments":{

		type: String,
		label: "Comments",
		optional: true
	}

});

Orders.attachSchema(OrdersSchema);
var mongoose =require("mongoose");

var Schema = mongoose.Schema

var HeadlineSchema = new Schema({
	headlines:{
		type: String,
		require: true
	},
	summary:{
		type: String,
		require: true
	},
	url: {
		type: String,
		require: true
	}
})

var Headlines = mongoose.model("headlines", HeadlineSchema);

module.exports = Headlines;
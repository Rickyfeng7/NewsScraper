var mongoose =require("mongoose");

var Schema = mongoose.Schema

var HeadlineSchema = new Schema({
	headline:{
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

var Headline = mongoose.model("headlines", HeadlineSchema);

module.exports = Headline;
var mongoose =require("mongoose");

var Schema = mongoose.Schema

var articleScema = new Schema({
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
	},
	saved:{
		type: Boolean,
		default: false
	}
})

var article = mongoose.model("article", articleScema);

module.exports = article;
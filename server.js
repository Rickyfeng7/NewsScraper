var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/HomeworkNewsScraper", {
  // useMongoClient: true
});

app.get("/scrape", function(req, res) {

	axios.get("http://bleacherreport.com/").then(function(response){
		var result = {};
		var $ = cheerio.load(response.data);
		$("atom articleTitle").each(function(i, element) {
			console.log(i)
			console.log(element)
	    result.featured = $(this)
	        .children("atom articleTitle")
	        .text();
	    result.link = $(this)
	        .children("a")
	        .attr("href");

		    // $(".atom commentary").each(function(i, element){
	    	// result.summary = $(this)
	    	// 	.children("h3")
	    	// 	.text()
	    	db.Summary
	    		.create(result)
	    		.then(function(dbSummary){
	    			console.log(dbSummary)
	    			res.send("Scrape Complete")
	    		})
	    		.catch(function(err){
	    			res.json(err)
	    		})
		    // })
	    })
	});

});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
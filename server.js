var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request")
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
//   // useMongoClient: true
});

app.get("/scrape", function(req, res) {

	// axios.get("https://www.sfgate.com/").then(function(response){
	// 	var result = {};
	// 	var $ = cheerio.load(response.data);
	// 	$("h4").each(function(i, element) {
	//     result.headle = $(this)
	//         .find(".hdn-analytics")
	//         .text();
	//     result.link = $(this)
	//         .children("a")
	//         .attr("href");

	axios.get("https://football.realgm.com/").then(function(response){
		var $ = cheerio.load(response.data);
		$("div.secondary-story").each(function(i, element) {
		var result = {};
	    result.headline = $(this)
	        .find("div.article-title")
	        .text();
	    result.summary = $(this)
	        .find("div.article-content")
	        .text();
	    result.url = $(this)
	        .children("a")
	        .attr("href");
	    console.log("first result", result)
		    // $(".atom commentary").each(function(i, element){
	    	// result.summary = $(this)
	    	// 	.children("h3")
	    	// 	.text()

	    	db.Headline

	    		.create(result)
	    		.then(function(dbHeadline){
	    			console.log("67", dbHeadline)
	    			res.send("Scrape Complete")
	    		})
	    		.catch(function(err){
	    			res.json(err)
	    		})
		    })
	    })
});
    // request("https://www.sfgate.com/", function(error, response, html) {
    //     var $ = cheerio.load(html);
    //     var results = [];
    //     console.log(results)
    //     // $(".atom commentary").each(function(i, element) {
    //     //     var headline = $(element).find("h3").text()
    //     //         results.push({
    //     //         headline: headline,
    //     //     }
    //     $(".itemWrapper").each(function(i, element) {
    //     	var headline = $(element).find("data-tb-shadow-region-title").text()
    //         var body = $(element).find("a").text()
    //         var link = $(element).find("a").attr("href");
    //         // var photo = $(element).find("img").html()
    //         results.push({
    //             headline: headline,
    //             body: body,
    //             link: link
    //             // photo: photo
    //         });
        
    //     for(var i= 0; i < results.length; i++){
            
    //         var head = results[i].headline
    //         var body = results[i].body
    //         var link = results[i].link
    //         // var photo = results[i].photo
    //         console.log("\nTitle: "+head, "\nBody: "+body, "\nLink: " + link )
    //     }
    // });
    
    // });
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
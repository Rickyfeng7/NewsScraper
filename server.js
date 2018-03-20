var express = require("express");
var exphbs = require("express-handlebars");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var request = require("request");
var db = require("./models");
var index = require("./routes/index");
var PORT = 3000;

// Initialize Express
var app = express();

app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');

app.use("/", index);
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

app.get("/", function(req, res){
	db.Headline
	.find({}, function(err, data) {
		if (err){
			console.log(error)
		}
		else{
			var articlesobj = {
				article: []
			};
			data.foreach(function(article){
				articlesobj.article.push({
					tite:article.title,
					summary:article.summary,
					link:article.link,
					_id:article._id
				})
			})
			res.render("index", articlesobj)
		}
    });
});

app.get("/scrape", function(req, res) {

	request("https://football.realgm.com/", function(error, response, html){
		var $ = cheerio.load(html);
		$("div.secondary-story").each(function(i, element){
			var result = {};
		    result.headline = $(this)
		        .find("div.article-title")
		        .text();
		    result.summary = $(this)
		        .find("div.article-content")
		        .text();
		    result.url =  "https://football.realgm.com" + $(this)
		        .children("a")
		        .attr("href");
		    console.log("first result", result)
	    	db.Headline
			.create(result)
			.then(function(dbHeadline){
    			console.log("58", dbHeadline)
    			res.send("Scrape Complete")
    		})
    		.catch(function(err){
    			console.log(err)
    			res.json(err)
    		})
		})
    })
});

// Route for getting all Articles from the db
app.get("/articles", function(req, res) {
  	// Grab every document in the Articles collection
  	db.Headline
    .find({})
    .then(function(dbHeadline) {
      	// If we were able to successfully find Articles, 	send them back to the client
      	res.json(dbHeadline);
    })
    .catch(function(err) {
      	// If an error occurred, send it to the client
      	res.json(err);
    });
});


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
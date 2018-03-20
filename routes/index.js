
var request = require("request");
var cheerio  = require("cheerio");
var express = require('express');
var app = express.Router();
var db = require("../models")
/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// home page = /
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
// how to scrape and get data to populate the page
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

//Saving Favorites Articles
app.post("/articles/save/:id", function(req, res){
	headline.findOneAndUpdate({"_id": req.params.id}, {"saved": true})
	.then(function(err, data){
		if (err) {
			console.log(err);
		}
		else{
			res.send(data);
		}
	});
});
//getting at the saved headlines
app.get("/saved", function(req,res){
	db.headline
	.find({saved: true}).sort({createdAt: -1})
	.then(function(dbheadlines){
		console.log(dbheadlines);
		var saveObj = {
			savedheadline: dbheadlines
		}
		res.render("saved", saveObj)
	})
})
// get the notes to a specific id
app.get("/headlines/:id/notes", function(req,res){
	db.headline
	.findOne({_id:req.params.id})
	.populate("note")
	.then(function(result){
		console.log("109", result.note);
		res.json(result.note)
	})
})
// Creating a note to save
app.post("/create/note", function(req, res){
	db.note
	.create({body:req.body})
	.then(function(dbNote){
		db.headlines
		.findOneAndUpdate({_id:req.body.articleId}, {$push:{ note:dbNote._id}})
		.then(function(res){
			console.log(res)
			res.json(dbNote)
		}).catc(function(err){
			console.log(err)
		})
	})
})
module.exports = app;